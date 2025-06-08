#[allow(duplicate_alias)]
module wer::session_manager {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use std::string;
    use std::vector;

    public struct Session has key, store {
        id: UID,
        owner: address,
        title: string::String,
        description: string::String,
        category: string::String,
        duration: string::String,
        room_name: string::String,
        created_at: string::String,
    }

    // Remove 'drop' ability since UID doesn't support it
    // Instead, we'll manage the cleanup manually
    public struct SessionStore has key, store {
        id: UID,
        sessions: vector<Session>,
    }

    public entry fun create_session_store(ctx: &mut TxContext) {
        let session_store = SessionStore {
            id: object::new(ctx),
            sessions: vector::empty<Session>(),
        };
        transfer::share_object(session_store)
    }

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
        create_session(
            session_store,
            ctx,
            title,
            description,
            category,
            duration,
            room_name,
            created_at
        );
    }



    // Helper function to create a session (internal use only)
    fun create_session(
        session_store: &mut SessionStore,
        ctx: &mut TxContext,
        title: string::String,
        description: string::String,
        category: string::String,
        duration: string::String,
        room_name: string::String,
        created_at: string::String,
    ) {
        let new_session = Session {
            id: object::new(ctx),
            owner: tx_context::sender(ctx),
            title,
            description,
            category,
            duration,
            room_name,
            created_at,
        };
        vector::push_back(&mut session_store.sessions, new_session);
    }
}
