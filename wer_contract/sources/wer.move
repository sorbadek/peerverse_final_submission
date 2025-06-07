#[allow(duplicate_alias)]
module wer::auth {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::table::{Self, Table};
    use sui::event;
    use sui::clock::{Self, Clock};
    use sui::address;
    use sui::bcs;
    use std::string::{Self, String};
    use std::vector;
    use std::option::{Self, Option};

    const EInvalidZKProof: u64 = 1;
    const EUserNotRegistered: u64 = 2;
    const EUserAlreadyExists: u64 = 3;
    const EUnauthorizedAccess: u64 = 5;
    const EInvalidProvider: u64 = 7;

    const MAX_SESSION_DURATION: u64 = 86400000;
    const INITIAL_XP_BONUS: u64 = 100;
    const GOOGLE_PROVIDER: u8 = 1;

    const XP_COST_PER_CLASS: u64 = 50; 
    const FREE_TRIAL_DURATION: u64 = 604800000; 
    const MIN_XP_REQUIRED: u64 = XP_COST_PER_CLASS; 


    public struct UserProfile has key, store {
        id: UID,
        user_address: address,
        email_hash: vector<u8>,
        provider: u8,
        provider_id: String,
        username: String,
        xp_balance: u64,
        reputation_score: u64,
        created_at: u64,
        last_login: u64,
        is_verified: bool,
        session_token: Option<vector<u8>>,
        session_expires: u64,
        trial_period: TrialPeriod,
        can_attend_class: bool
    }

    public struct ZKLoginProof has copy, drop {
        jwt_header: vector<u8>,
        jwt_payload: vector<u8>,
        jwt_signature: vector<u8>,
        ephemeral_public_key: vector<u8>,
        max_epoch: u64,
        user_salt: vector<u8>,
    }

    public struct ZkLoginSignature has copy, drop {
        proof: vector<u8>,
        public_inputs: vector<u8>,
        max_epoch: u64,
        user_salt: vector<u8>,
        jwt_claim: String,
    }

    public struct AuthRegistry has key {
        id: UID,
        users: Table<address, UserProfile>,
        email_to_address: Table<vector<u8>, address>,
        provider_to_address: Table<String, address>,
        admin: address,
        total_users: u64,
    }

    public struct UserRegistered has copy, drop {
        user_address: address,
        provider: u8,
        username: String,
        timestamp: u64,
    }

    public struct UserAuthenticated has copy, drop {
        user_address: address,
        session_token: vector<u8>,
        expires_at: u64,
        timestamp: u64,
    }

    public struct XPAwarded has copy, drop {
        user_address: address,
        amount: u64,
        reason: String,
        timestamp: u64,
    }

    /// Event emitted when zkLogin verification is successful
    public struct ZkLoginVerified has copy, drop {
        user_address: address,
        jwt_claim: String,
        timestamp: u64,
    }
    
    public struct TrialPeriod has store {
    start_time: u64,
    is_active: bool,
    classes_attended: u64,
    contributions_made: u64
    }

    fun init(ctx: &mut TxContext) {
        let registry = AuthRegistry {
            id: object::new(ctx),
            users: table::new(ctx),
            email_to_address: table::new(ctx),
            provider_to_address: table::new(ctx),
            admin: tx_context::sender(ctx),
            total_users: 0,
        };
        transfer::share_object(registry);
    }

    public fun validate_zklogin_proof(
        proof: &ZKLoginProof,
        current_epoch: u64,
        clock: &Clock
    ): bool {
        if (proof.max_epoch < current_epoch) {
            return false
        };
        let _ = clock::timestamp_ms(clock);
        true
    }

    fun extract_user_info(_jwt_payload: &vector<u8>): (String, u8, String, vector<u8>) {
        (
            string::utf8(b"user@example.com"),
            GOOGLE_PROVIDER,
            string::utf8(b"google_user_123"),
            vector::singleton(1)
        )
    }

    public entry fun register_user(
        registry: &mut AuthRegistry,
        proof_bytes: vector<u8>,
        username: String,
        current_epoch: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let proof = decode_zklogin_proof(proof_bytes);
        assert!(validate_zklogin_proof(&proof, current_epoch, clock), EInvalidZKProof);
        let user_address = tx_context::sender(ctx);
        assert!(!table::contains(&registry.users, user_address), EUserAlreadyExists);

        let (_email, provider, _provider_id, email_hash) = extract_user_info(&proof.jwt_payload);
        assert!(provider >= 1 && provider <= 3, EInvalidProvider);
        assert!(!table::contains(&registry.email_to_address, email_hash), EUserAlreadyExists);

        let current_time = clock::timestamp_ms(clock);

        let user_profile = UserProfile {
            id: object::new(ctx),
            user_address,
            email_hash,
            provider,
            provider_id: std::string::utf8(b""), 
            username: std::string::utf8(b""), 
            xp_balance: 0, 
            reputation_score: 0,
            created_at: current_time,
            last_login: current_time,
            is_verified: true,
            session_token: option::none(),
            session_expires: 0,
            trial_period: TrialPeriod {
                start_time: current_time,
                is_active: true,
                classes_attended: 0,
                contributions_made: 0
            },
            can_attend_class: true
        };

        table::add(&mut registry.users, user_address, user_profile);
        table::add(&mut registry.email_to_address, email_hash, user_address);

        let mut provider_key = string::utf8(b"provider_");
        string::append(&mut provider_key, string::utf8(b""));
        table::add(&mut registry.provider_to_address, provider_key, user_address);

        registry.total_users = registry.total_users + 1;

        event::emit(UserRegistered {
            user_address,
            provider,
            username,
            timestamp: current_time,
        });

        event::emit(XPAwarded {
            user_address,
            amount: INITIAL_XP_BONUS,
            reason: string::utf8(b"Registration bonus"),
            timestamp: current_time,
        });
    }

    public entry fun authenticate_user(
        registry: &mut AuthRegistry,
        proof_bytes: vector<u8>,
        current_epoch: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let proof = decode_zklogin_proof(proof_bytes);
        assert!(validate_zklogin_proof(&proof, current_epoch, clock), EInvalidZKProof);
        let user_address = tx_context::sender(ctx);
        assert!(table::contains(&registry.users, user_address), EUserNotRegistered);

        let user_profile = table::borrow_mut(&mut registry.users, user_address);
        let current_time = clock::timestamp_ms(clock);

        let mut session_token = address::to_bytes(user_address);
        let time_bytes = bcs::to_bytes(&current_time);
        vector::append(&mut session_token, time_bytes);

        let mut session_token_copy = vector::empty();
        vector::append(&mut session_token_copy, session_token); 
        user_profile.session_token = option::some(session_token_copy);
        user_profile.session_expires = current_time + MAX_SESSION_DURATION;
        user_profile.last_login = current_time;

        event::emit(UserAuthenticated {
            user_address,
            session_token,
            expires_at: user_profile.session_expires,
            timestamp: current_time,
        });
    }

    public fun verify_session(
        registry: &AuthRegistry,
        user_address: address,
        clock: &Clock
    ): bool {
        if (!table::contains(&registry.users, user_address)) return false;

        let user_profile = table::borrow(&registry.users, user_address);
        if (option::is_none(&user_profile.session_token)) return false;

        let current_time = clock::timestamp_ms(clock);
        current_time < user_profile.session_expires
    }

    public entry fun attend_class(
        registry: &mut AuthRegistry,
        user_address: address,
        clock: &Clock,
        _ctx: &mut TxContext
    ) {
        assert!(verify_session(registry, user_address, clock), EUnauthorizedAccess);
        let user_profile = table::borrow_mut(&mut registry.users, user_address);
        let current_time = clock::timestamp_ms(clock);

        // Check if user is in trial period
        if (user_profile.trial_period.is_active) {
            assert!(current_time - user_profile.trial_period.start_time <= FREE_TRIAL_DURATION, 0);
            user_profile.trial_period.classes_attended = user_profile.trial_period.classes_attended + 1;
        } else {
            // Check if user has enough XP
            assert!(user_profile.xp_balance >= XP_COST_PER_CLASS, 0);
            user_profile.xp_balance = user_profile.xp_balance - XP_COST_PER_CLASS;

            // Prevent class attendance if XP is too low
            if (user_profile.xp_balance < MIN_XP_REQUIRED) {
                user_profile.can_attend_class = false;
            };
        };

        event::emit(ClassAttended {
            user_address,
            timestamp: current_time,
            is_trial: user_profile.trial_period.is_active
        });
    }

    public entry fun evaluate_trial_period(
           registry: &mut AuthRegistry,
           user_address: address,
           clock: &Clock,
           ctx: &mut TxContext
       ) {
           assert!(tx_context::sender(ctx) == registry.admin, EUnauthorizedAccess);
           let user_profile = table::borrow_mut(&mut registry.users, user_address);
           let current_time = clock::timestamp_ms(clock);

           assert!(user_profile.trial_period.is_active, 0);
           assert!(current_time - user_profile.trial_period.start_time >= FREE_TRIAL_DURATION, 0);

           // Calculate initial XP based on trial period activity
           let initial_xp = calculate_initial_xp(
               user_profile.trial_period.classes_attended,
               user_profile.trial_period.contributions_made
           );

           user_profile.xp_balance = initial_xp;
           user_profile.trial_period.is_active = false;
           user_profile.can_attend_class = initial_xp >= MIN_XP_REQUIRED;

           event::emit(TrialPeriodCompleted {
               user_address,
               initial_xp,
               classes_attended: user_profile.trial_period.classes_attended,
               contributions_made: user_profile.trial_period.contributions_made,
               timestamp: current_time
           });
       }

       fun calculate_initial_xp(classes_attended: u64, contributions_made: u64): u64 {
            // Base XP for participating in the trial
            let base_xp = 50;
            
            // Add XP for classes attended (10 XP per class)
            let class_xp = classes_attended * 10;
            
            // Add XP for contributions made (15 XP per contribution)
            let contribution_xp = contributions_made * 15;
            
            // Total XP
            base_xp + class_xp + contribution_xp
        }

       public entry fun purchase_xp(
       registry: &mut AuthRegistry,
       user_address: address,
       amount: u64,
       clock: &Clock,
       _ctx: &mut TxContext
)    {
       // Add payment logic here
       let user_profile = table::borrow_mut(&mut registry.users, user_address);
       user_profile.xp_balance = user_profile.xp_balance + amount;

       if (user_profile.xp_balance >= MIN_XP_REQUIRED) {
           user_profile.can_attend_class = true;
       };

       event::emit(XPPurchased {
           user_address,
           amount,
           timestamp: clock::timestamp_ms(clock)
       });
}   

    
    public fun award_xp(
        registry: &mut AuthRegistry,
        user_address: address,
        amount: u64,
        reason: String,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == registry.admin, EUnauthorizedAccess);
        assert!(table::contains(&registry.users, user_address), EUserNotRegistered);

        let user_profile = table::borrow_mut(&mut registry.users, user_address);
        user_profile.xp_balance = user_profile.xp_balance + amount;

        event::emit(XPAwarded {
            user_address,
            amount,
            reason,
            timestamp: clock::timestamp_ms(clock),
        });
    }

    public fun spend_xp(
        registry: &mut AuthRegistry,
        user_address: address,
        amount: u64,
        clock: &Clock,
        _ctx: &mut TxContext
    ): bool {
        assert!(table::contains(&registry.users, user_address), EUserNotRegistered);
        assert!(verify_session(registry, user_address, clock), EUnauthorizedAccess);

        let user_profile = table::borrow_mut(&mut registry.users, user_address);
        if (user_profile.xp_balance < amount) return false;

        user_profile.xp_balance = user_profile.xp_balance - amount; 
        true
    }

    public fun get_user_profile(
        registry: &AuthRegistry,
        user_address: address
    ): (String, u64, u64, bool, u64) {
        assert!(table::contains(&registry.users, user_address), EUserNotRegistered);
        let user_profile = table::borrow(&registry.users, user_address);
        (
            user_profile.username,
            user_profile.xp_balance,
            user_profile.reputation_score,
            user_profile.is_verified,
            user_profile.last_login
        )
    }

    public fun update_reputation(
        registry: &mut AuthRegistry,
        user_address: address,
        score_change: u64,
        is_positive: bool,
        _ctx: &mut TxContext
    ) {
        assert!(table::contains(&registry.users, user_address), EUserNotRegistered);
        let user_profile = table::borrow_mut(&mut registry.users, user_address);

        if (is_positive) {
            user_profile.reputation_score = user_profile.reputation_score + score_change;
        } else {
            if (user_profile.reputation_score > score_change) {
                user_profile.reputation_score = user_profile.reputation_score - score_change;
            } else {
                user_profile.reputation_score = 0;
            }
        }
    }

    public fun verify_zklogin_signature(
        sig: &ZkLoginSignature,
        current_epoch: u64,
        clock: &Clock
    ): bool {
        // Verify epoch hasn't expired
        if (sig.max_epoch < current_epoch) {
            return false
        };

        // Verify JWT claim format and signature
        // Note: In production, you would use Sui's native zkLogin verification here
        let current_time = clock::timestamp_ms(clock);
        let _ = current_time;

        // For demo purposes returning true
        // In production, implement full verification
        true
    }

    public entry fun login_with_zk(
        registry: &mut AuthRegistry,
        sig_bytes: vector<u8>,
        current_epoch: u64, 
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let sig = decode_zklogin_signature(sig_bytes);
        assert!(verify_zklogin_signature(&sig, current_epoch, clock), EInvalidZKProof);

        let user_address = tx_context::sender(ctx);
        let current_time = clock::timestamp_ms(clock);

        // Create or update user session
        if (!table::contains(&registry.users, user_address)) {
            // New user registration flow
            let user_profile = UserProfile {
                id: object::new(ctx),
                user_address,
                email_hash: vector::empty(), // Will be populated from JWT
                provider: GOOGLE_PROVIDER,
                provider_id: std::string::utf8(b""), // Will be populated from JWT
                username: std::string::utf8(b""), // Can be updated later
                xp_balance: INITIAL_XP_BONUS,
                reputation_score: 0,
                created_at: current_time,
                last_login: current_time,
                is_verified: true,
                session_token: option::some(bcs::to_bytes(&current_time)),
                session_expires: current_time + MAX_SESSION_DURATION,
                trial_period: TrialPeriod {
                    start_time: current_time,
                    is_active: true,
                    classes_attended: 0,
                    contributions_made: 0
                },
                can_attend_class: true
            };
            table::add(&mut registry.users, user_address, user_profile);
            registry.total_users = registry.total_users + 1;
        } else {
            // Existing user login flow
            let user_profile = table::borrow_mut(&mut registry.users, user_address);
            user_profile.last_login = current_time;
            user_profile.session_token = option::some(bcs::to_bytes(&current_time));
            user_profile.session_expires = current_time + MAX_SESSION_DURATION;
        };

        event::emit(ZkLoginVerified {
            user_address,
            jwt_claim: sig.jwt_claim,
            timestamp: current_time,
        });
    }

    // Add helper functions for decoding
    fun decode_zklogin_proof(_bytes: vector<u8>): ZKLoginProof {
        // Placeholder implementation for demonstration purposes
        // In production, properly decode and verify the JWT components
        ZKLoginProof {
            jwt_header: vector[1u8],
            jwt_payload: vector::empty(),
            jwt_signature: vector::empty(),
            ephemeral_public_key: vector::empty(),
            max_epoch: 0,
            user_salt: vector::empty()
        }
    }

    fun decode_zklogin_signature(_bytes: vector<u8>): ZkLoginSignature {
        // Placeholder implementation
        ZkLoginSignature {
            proof: vector::empty(),
            public_inputs: vector::empty(),
            max_epoch: 0,
            user_salt: vector::empty(),
            jwt_claim: string::utf8(b"")
        }
    }

    public struct ClassAttended has copy, drop {
        user_address: address,
        timestamp: u64,
        is_trial: bool
    }

    public struct TrialPeriodCompleted has copy, drop {
        user_address: address,
        initial_xp: u64,
        classes_attended: u64,
        contributions_made: u64,
        timestamp: u64
    }

    public struct XPPurchased has copy, drop {
        user_address: address,
        amount: u64,
        timestamp: u64
    }

    public struct Content has key, store {
        id: UID,
        creator: address,
        content_type: u8, // 1: Course, 2: Tutorial, 3: Resource
        title: String,
        description: String,
        xp_reward: u64,
        created_at: u64,
        is_approved: bool,
        total_engagements: u64
    }

    public struct ContentEngagement has copy, drop {
        content_id: address,
        user_address: address,
        engagement_type: u8, // 1: View, 2: Like, 3: Comment
        timestamp: u64
    }

    public struct Achievement has key, store {
        id: UID,
        user_address: address,
        achievement_type: u8,
        title: String,
        description: String,
        xp_bonus: u64,
        earned_at: u64
    }

    public entry fun create_content(
        registry: &mut AuthRegistry,
        content_type: u8,
        title: String,
        description: String,
        xp_reward: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let creator = tx_context::sender(ctx);
        assert!(table::contains(&registry.users, creator), EUserNotRegistered);
        
        let content = Content {
            id: object::new(ctx),
            creator,
            content_type,
            title,
            description,
            xp_reward,
            created_at: clock::timestamp_ms(clock),
            is_approved: false,
            total_engagements: 0
        };
        
        // Transfer content to creator
        transfer::transfer(content, creator);
    }

    public entry fun engage_with_content(
        registry: &mut AuthRegistry,
        content_id: address,
        engagement_type: u8,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let user_address = tx_context::sender(ctx);
        assert!(table::contains(&registry.users, user_address), EUserNotRegistered);
        
        event::emit(ContentEngagement {
            content_id,
            user_address,
            engagement_type,
            timestamp: clock::timestamp_ms(clock)
        });
        
        // Award XP for engagement
        let xp_reward = if (engagement_type == 1) { 5 } // View
        else if (engagement_type == 2) { 10 } // Like
        else { 15 }; // Comment
        
        let user_profile = table::borrow_mut(&mut registry.users, user_address);
        user_profile.xp_balance = user_profile.xp_balance + xp_reward;
    }

    public entry fun award_achievement(
        registry: &mut AuthRegistry,
        user_address: address,
        achievement_type: u8,
        title: String,
        description: String,
        xp_bonus: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == registry.admin, EUnauthorizedAccess);
        assert!(table::contains(&registry.users, user_address), EUserNotRegistered);
        
        let achievement = Achievement {
            id: object::new(ctx),
            user_address,
            achievement_type,
            title,
            description,
            xp_bonus,
            earned_at: clock::timestamp_ms(clock)
        };
        
        // Award XP bonus
        let user_profile = table::borrow_mut(&mut registry.users, user_address);
        user_profile.xp_balance = user_profile.xp_balance + xp_bonus;
        
        // Transfer achievement to user
        transfer::transfer(achievement, user_address);
    }

    public entry fun approve_content(
        registry: &mut AuthRegistry,
        content: &mut Content,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == registry.admin, EUnauthorizedAccess);
        content.is_approved = true;
        
        // Award XP to content creator
        let creator_profile = table::borrow_mut(&mut registry.users, content.creator);
        creator_profile.xp_balance = creator_profile.xp_balance + 50; // Bonus for approved content
    }
} // Close the module

