module learning_platform::content {
    // Import standard library and Sui framework modules
    use sui::tx_context::{Self, TxContext};
    use sui::object::{Self, UID, ID};
    use std::string::{Self, String};
    use sui::transfer;
    use sui::event;

    
    // Constants for content types
    const CONTENT_TYPE_ARTICLE: u8 = 0;
    const CONTENT_TYPE_VIDEO: u8 = 1;
    const CONTENT_TYPE_COURSE: u8 = 2;
    const CONTENT_TYPE_QUIZ: u8 = 3;
    
    // Visibility constants
    const VISIBILITY_PUBLIC: u8 = 0;
    const VISIBILITY_PRIVATE: u8 = 1;
    const VISIBILITY_PAID: u8 = 2;
    
    // Error codes
    const E_INVALID_TITLE: u64 = 1;
    const E_INVALID_DESCRIPTION: u64 = 2;
    const E_INVALID_CONTENT_TYPE: u64 = 3;
    const E_UNAUTHORIZED: u64 = 4;
    const E_INSUFFICIENT_XP: u64 = 5;

    public struct Content has key, store {
        id: UID,
        creator: address,
        title: String,
        description: String,
        content_type: u8,
        content_url: String,
        thumbnail_url: String,
        price_xp: u64,
        visibility: u8,
        tags: vector<String>,
        created_at: u64,
        updated_at: u64,
    }

    public struct ContentCreated has copy, drop {
        content_id: ID,
        creator: address,
        created_at: u64,
    }

    public fun create_content(
        _creator: &signer,
        title: String,
        description: String,
        content_type: u8,
        content_url: String,
        thumbnail_url: String,
        price_xp: u64,
        visibility: u8,
        tags: vector<String>,
        ctx: &mut TxContext
    ) {
        let creator_addr = tx_context::sender(ctx);
        let now = 0; // Will be replaced with actual timestamp when clock is available
        
        // Validate inputs
        assert!(std::string::length(&title) > 0, E_INVALID_TITLE);
        assert!(std::string::length(&description) > 0, E_INVALID_DESCRIPTION);
        assert!(
            content_type == CONTENT_TYPE_ARTICLE ||
            content_type == CONTENT_TYPE_VIDEO ||
            content_type == CONTENT_TYPE_COURSE ||
            content_type == CONTENT_TYPE_QUIZ,
            E_INVALID_CONTENT_TYPE
        );

        let content = Content {
            id: object::new(ctx),
            creator: creator_addr,
            title,
            description,
            content_type,
            content_url,
            thumbnail_url,
            price_xp,
            visibility,
            tags,
            created_at: now,
            updated_at: now,
        };

        // Emit event
        event::emit(ContentCreated {
            content_id: object::id(&content),
            creator: creator_addr,
            created_at: now,
        });

        // Transfer ownership to creator
        transfer::public_share_object(content);
    }


    public fun access_content(
        _sender: &signer,
        content: &mut Content,
        ctx: &mut TxContext
    ) {
        let now = 0; // Temporary placeholder - will be replaced with actual timestamp
        let sender_addr = tx_context::sender(ctx);
        
        if (content.visibility == VISIBILITY_PRIVATE && content.creator != sender_addr) {
            // Only the creator can access private content
            assert!(false, E_UNAUTHORIZED);
        } else if (content.visibility == VISIBILITY_PAID) {
            // For paid content, check if user has enough XP
            // This is a placeholder - actual XP check will be implemented
            // when XP module is ready
            assert!(false, E_INSUFFICIENT_XP);
        }
        
        // Update last accessed timestamp
        content.updated_at = now;
    }


    public fun update_content(
        _sender: &signer,
        content: &mut Content,
        new_title: String,
        new_description: String,
        new_visibility: u8,
        new_tags: vector<String>,
        ctx: &mut TxContext
    ) {
        let sender_addr = tx_context::sender(ctx);
        let now = 0; // Temporary placeholder
        
        // Only the creator can update content
        assert!(content.creator == sender_addr, E_UNAUTHORIZED);
        
        // Update content
        content.title = new_title;
        content.description = new_description;
        content.visibility = new_visibility;
        content.tags = new_tags;
        content.updated_at = now;
    }
}
