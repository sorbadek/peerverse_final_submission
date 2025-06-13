#[allow(duplicate_alias)]
module wer::session_manager {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use std::string;
    use std::vector;

    public struct Session has store, copy, drop {
        session_id: u64,
        owner: address,
        title: string::String,
        description: string::String,
        category: string::String,
        duration: string::String,
        room_name: string::String,
        created_at: string::String,
    }

    public struct SessionStore has key {
        id: UID,
        sessions: vector<Session>,
        next_session_id: u64,
    }

    /// Create a new shared SessionStore that anyone can add sessions to
    public entry fun create_session_store(ctx: &mut TxContext) {
        let session_store = SessionStore {
            id: object::new(ctx),
            sessions: vector::empty<Session>(),
            next_session_id: 0,
        };
        // Share the object so anyone can add sessions
        transfer::share_object(session_store)
    }

    /// Create a new session and add it to the SessionStore
    public entry fun create_session_entry(
        session_store: &mut SessionStore,
        title: string::String,
        description: string::String,
        category: string::String,
        duration: string::String,
        room_name: string::String,
        created_at: string::String,
        ctx: &mut TxContext,
    ) {
        let sender = tx_context::sender(ctx);
        let session_id = session_store.next_session_id;
        
        // Create new session
        let new_session = Session {
            session_id,
            owner: sender,
            title,
            description,
            category,
            duration,
            room_name,
            created_at,
        };
        
        // Add to sessions vector and increment ID
        vector::push_back(&mut session_store.sessions, new_session);
        session_store.next_session_id = session_id + 1;
    }
    
    /// Get the number of sessions in the store (for testing/verification)
    public fun get_session_count(session_store: &SessionStore): u64 {
        vector::length(&session_store.sessions)
    }
    
    /// Get all sessions (for frontend to query)
    /// Note: In a real app, you'd want to add pagination for large numbers of sessions
    public fun get_all_sessions(session_store: &SessionStore): &vector<Session> {
        &session_store.sessions
    }
}
