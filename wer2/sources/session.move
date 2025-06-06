#[allow(duplicate_alias)]
module wer2::session {
    use sui::object::{Self, ID, UID};
    use sui::tx_context::{Self, TxContext};
    use std::string::String;
    use sui::transfer;
    use sui::event;
    
    // Session states
    const SESSION_STATE_SCHEDULED: u8 = 0;
    const SESSION_STATE_IN_PROGRESS: u8 = 1;
    const SESSION_STATE_COMPLETED: u8 = 2;
    const SESSION_STATE_CANCELLED: u8 = 3;
    
    // Error codes
    const E_INVALID_START_TIME: u64 = 1;
    const E_UNAUTHORIZED: u64 = 2;
    const E_SESSION_FULL: u64 = 3;
    const E_INVALID_STATE: u64 = 4;

    public struct Session has key, store {
        id: UID,
        tutor: address,
        title: String,
        description: String,
        start_time: u64,
        end_time: u64,
        max_participants: u64,
        participants: vector<address>,
        state: u8,
        price_xp: u64,
        created_at: u64,
        updated_at: u64,
    }

    public struct SessionCreated has copy, drop {
        session_id: ID,
        tutor: address,
        start_time: u64,
        price_xp: u64,
    }

    public struct SessionJoined has copy, drop {
        session_id: ID,
        participant: address,
    }

    public struct SessionCompleted has copy, drop {
        session_id: ID,
        tutor: address,
        participants: vector<address>,
    }

    public struct SessionCancelled has copy, drop {
        session_id: ID,
        tutor: address,
        reason: String,
    }

    public fun create_session(
        _tutor: &signer,
        title: String,
        description: String,
        start_time: u64,
        duration_minutes: u64,
        max_participants: u64,
        price_xp: u64,
        ctx: &mut TxContext
    ) {
        let tutor_addr = tx_context::sender(ctx);
        let now = 0; // Will be replaced with actual timestamp
        
        // Validate inputs
        assert!(start_time > now, E_INVALID_START_TIME);
        assert!(max_participants > 0, E_INVALID_STATE);
        
        let session = Session {
            id: object::new(ctx),
            tutor: tutor_addr,
            title,
            description,
            start_time,
            end_time: start_time + (duration_minutes * 60), // Convert minutes to seconds
            max_participants,
            participants: vector::empty(),
            state: SESSION_STATE_SCHEDULED,
            price_xp,
            created_at: now,
            updated_at: now,
        };
        
        // Emit event
        event::emit(SessionCreated {
            session_id: object::id(&session),
            tutor: tutor_addr,
            start_time,
            price_xp,
        });
        
        transfer::share_object(session);
    }

    public fun join_session(
        _participant: &signer,
        session: &mut Session,
        ctx: &mut TxContext
    ) {
        let participant_addr = tx_context::sender(ctx);
        let now = 0; // Temporary placeholder
        
        // Validate session state
        assert!(session.state == SESSION_STATE_SCHEDULED, E_INVALID_STATE);
        
        // Check if there's space for more participants
        assert!(
            vector::length(&session.participants) < session.max_participants,
            E_SESSION_FULL
        );
        
        // Check if participant has already joined
        let i = 0;
        let participant_exists = false;
        while (i < vector::length(&session.participants)) {
            if (*vector::borrow(&session.participants, i) == participant_addr) {
                participant_exists = true;
                break;
            };
            i = i + 1;
        };
        
        if (!participant_exists) {
            vector::push_back(&mut session.participants, participant_addr);
            
            // Emit event
            event::emit(SessionJoined {
                session_id: object::id(session),
                participant: participant_addr,
            });
        };
        
        session.updated_at = now;
    }

    public fun complete_session(
        _tutor: &signer,
        session: &mut Session,
        ctx: &mut TxContext
    ) {
        let tutor_addr = tx_context::sender(ctx);
        let now = 0; // Temporary placeholder
        
        // Only the tutor can complete the session
        assert!(session.tutor == tutor_addr, E_UNAUTHORIZED);
        
        // Session must be in progress to be completed
        assert!(session.state == SESSION_STATE_IN_PROGRESS, E_INVALID_STATE);
        
        // Update session state
        session.state = SESSION_STATE_COMPLETED;
        session.updated_at = now;
        
        // Emit event
        event::emit(SessionCompleted {
            session_id: object::id(session),
            tutor: tutor_addr,
            participants: session.participants,
        });
    }

    public fun cancel_session(
        _tutor: &signer,
        session: &mut Session,
        reason: String,
        ctx: &mut TxContext
    ) {
        let tutor_addr = tx_context::sender(ctx);
        let now = 0; // Temporary placeholder
        
        // Only the tutor can cancel the session
        assert!(session.tutor == tutor_addr, E_UNAUTHORIZED);
        
        // Can only cancel scheduled or in-progress sessions
        assert!(
            session.state == SESSION_STATE_SCHEDULED ||
            session.state == SESSION_STATE_IN_PROGRESS,
            E_INVALID_STATE
        );
        
        // Update session state
        session.state = SESSION_STATE_CANCELLED;
        session.updated_at = now;
        
        // Emit event
        event::emit(SessionCancelled {
            session_id: object::id(session),
            tutor: tutor_addr,
            reason,
        });
    }
}
