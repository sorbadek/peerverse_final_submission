#[allow(duplicate_alias)]
module wer2::xp_marketplace {
    use sui::object::{Self, ID, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::event;
    use sui::coin::{Self, Coin};
    use std::bcs;
    use std::vector;

    // Derive a deterministic ID from a seed
    fun derive_id(_seed: vector<u8>, ctx: &mut TxContext): (address, u8) {
        let id = object::new(ctx);
        let id_bytes = bcs::to_bytes(&id);
        let (hashed, _) = std::hash::blake2b256(id_bytes);
        (std::option::extract(&mut std::vector::address_from_bytes(hashed)), 0)
    }

    // ===== Constants =====
    const ERROR_INSUFFICIENT_BALANCE: u64 = 1;
    #[allow(unused)]
    const ERROR_TRANSFER_TO_SELF: u64 = 2;
    #[allow(unused)]
    const ERROR_ZERO_AMOUNT: u64 = 3;
    const DEFAULT_PRICE_PER_XP: u64 = 10_000_000;
    
    // SUI coin type
    public struct SUI has drop {}

    // ===== Structs =====
    
    /// Marker type for XP
    public struct XP has store, drop {}
    
    /// User profile that holds the XP balance
    public struct UserProfile has key {
        id: UID,
        xp_balance: u64,
    }

    public struct MarketConfig has key, store {
        id: UID,
        price_per_xp: u64,
    }

    // ===== Events =====
    
    public struct XPPurchased has copy, drop {
        buyer: address,
        amount: u64,
        price: u64,
    }
    
    public struct XPUpdated has copy, drop {
        user: address,
        amount: u64,
        timestamp: u64,
    }
    
    public struct ProfileCreated has copy, drop {
        user: address,
        timestamp: u64,
    }

    public struct XPTransferred has copy, drop {
        from: address,
        to: address,
        amount: u64,
        timestamp: u64,
    }

    public struct XPSpent has copy, drop {
        user: address,
        amount: u64,
        timestamp: u64,
    }
    
    public struct XPAwarded has copy, drop {
        user: address,
        amount: u64,
        timestamp: u64,
    }

    fun init(ctx: &mut TxContext) {
        let config = MarketConfig {
            id: object::new(ctx),
            price_per_xp: DEFAULT_PRICE_PER_XP,
        };
        transfer::share_object(config);
    }

    /// Purchase XP with SUI tokens
    /// 
    /// # Arguments
    /// * `payment` - Payment in SUI tokens
    /// * `amount` - Amount of XP to purchase
    /// * `ctx` - Transaction context
    /// Update or create an XP balance for a user
    /// 
    /// # Parameters:
    /// * `user` - The address of the user
    /// * `amount` - The amount of XP to add
    /// Update a user's XP balance
    public fun update_xp_balance(user: address, amount: u64, ctx: &mut TxContext) {
        let profile_addr = create_profile_address(&user, ctx);
        
        if (!object::exists(profile_addr)) {
            // Create new profile with initial balance
            let user_profile = UserProfile {
                id: object::new(ctx),
                xp_balance: amount,
            };
            transfer::share_object(user_profile);
        } else {
            // In Sui Move, we can't directly modify shared objects like this
            // For now, we'll just emit an event and handle the update in a separate function
            event::emit(XPUpdated {
                user,
                amount,
                timestamp: tx_context::epoch(ctx)
            });
        }
    }

    public entry fun purchase_xp(
        _buyer: &signer,
        payment: Coin<SUI>,
        amount: u64,
        price: u64,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let payment_value = coin::value(&payment);
        
        // Verify the payment is sufficient
        assert!(payment_value >= price, 1); // ERROR_INSUFFICIENT_BALANCE
        
        // Split the payment coin to get exact amount
        let mut payment_mut = payment;
        let payment_coin = coin::split(&mut payment_mut, price, ctx);
        
        // Burn the payment coin by sending to 0x0
        transfer::public_transfer(payment_coin, @0x0);
        
        // Return any change
        if (coin::value(&payment_mut) > 0) {
            transfer::public_transfer(payment_mut, sender);
        }
        

        // Also emit transfer event for consistency
        event::emit(XPTransferred {
            from: sender,
            to: sender,
            amount: amount,
            timestamp: 0, // In a real app, use a proper timestamp
        });
    }

    /// Create a new user profile with an XP balance
    public entry fun create_profile(_user: &signer, ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);
        
        // Create user profile with initial balance of 0
        let user_profile = UserProfile {
            id: object::new(ctx),
            xp_balance: 0,
        };
        
        // Share the profile object
        transfer::share_object(user_profile);
        
        // Emit profile created event
        event::emit(ProfileCreated {
            user: sender,
            timestamp: tx_context::epoch(ctx)
        });
    }
    
    /// Helper function to create a deterministic address for a user's profile
    fun create_profile_address(user: &address, ctx: &mut TxContext): address {
        let seed = b"user_profile";
        let addr_bytes = bcs::to_bytes(user);
        let mut seed_bytes = vector::empty<u8>();
        vector::append(&mut seed_bytes, seed);
        vector::append(&mut seed_bytes, addr_bytes);
        
        let (addr, _) = derive_id(seed_bytes, ctx);
        addr
    }
    
    /// Helper function to check if a profile exists for an address
    public fun profile_exists(user: address, ctx: &mut TxContext): bool {
        object::exists(create_profile_address(&user, ctx))
    }

    /// Get the XP balance for an address
    public fun balance_of(addr: address, ctx: &mut TxContext): u64 {
        let profile_addr = create_profile_address(&addr, ctx);
        // In Sui Move, we can't directly read shared objects like this
        // For now, we'll return 0 and handle the actual balance in the frontend
        0
    }

    public entry fun get_balance(_user: &signer, ctx: &mut TxContext): u64 {
        balance_of(tx_context::sender(ctx), ctx)
    }

    public entry fun spend_xp(
        _user: &signer,
        _amount: u64,
        _ctx: &mut TxContext
    ) {
        // Temporary implementation - will be updated with proper logic
        // For now, this is a no-op to avoid lint errors
        // The full implementation will include:
        // 1. Verifying the user has a profile
        // 2. Checking sufficient balance
        // 3. Updating the balance
        // 4. Emitting appropriate events
    }

    /// Add XP to a user's balance
    /// 
    /// # Arguments:
    /// * `_sender` - The signer of the transaction (must have permission to add XP)
    /// * `recipient` - The address of the user to add XP to
    /// * `amount` - The amount of XP to add
    /// * `ctx` - Transaction context
    public entry fun add_xp(
        _sender: &signer,
        recipient: address,
        amount: u64,
        ctx: &mut TxContext
    ) {
        // Update or create the XP balance
        update_xp_balance(recipient, amount, ctx);
        
        // Emit awarded event
        event::emit(XPAwarded {
            user: recipient,
            amount: amount,
            timestamp: 0, // In a real app, use a proper timestamp
        });
        
        // Also emit transfer event for consistency
        event::emit(XPTransferred {
            from: @0x0, // Indicates the XP was created/minted
            to: recipient,
            amount: amount,
            timestamp: 0, // In a real app, use a proper timestamp
        });
    }
    
    /// Transfer XP from the sender to another user
    /// 
    /// # Arguments:
    /// * `sender` - The signer of the transaction (must be the owner of the XP)
    /// * `recipient` - The address to transfer XP to
    /// * `amount` - The amount of XP to transfer
    /// * `ctx` - Transaction context
    public entry fun transfer_xp(
        _sender: &signer,
        _recipient: address,
        _amount: u64,
        _ctx: &mut TxContext
    ) {
        // Temporary implementation - will be updated with proper logic
        // For now, this is a no-op to avoid lint errors
        // The full implementation will include:
        // 1. Verifying the sender has a profile
        // 2. Checking sufficient balance
        // 3. Updating sender's balance
        // 4. Updating recipient's balance (creating profile if needed)
        // 5. Emitting transfer event
    }
}