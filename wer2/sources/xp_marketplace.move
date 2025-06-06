#[allow(duplicate_alias)]
#[allow(unused_alias)]
module wer2::xp_marketplace {
    use std::option::{Self, Option};
    use sui::balance::{Self, Balance};
    use sui::coin::{Self, Coin};
    use sui::dynamic_field as df;
    use sui::event;
    use sui::object::{Self, UID};
    use sui::sui::SUI;
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    
    // ===== Event Types =====
    // Note: These are the actual event structs used in the code
    // The ones below in the Events section should be removed or aligned with these
    
    // Use local modules with proper address
    use wer2::user_profile;

    // ===== Constants =====
    const ERROR_INSUFFICIENT_BALANCE: u64 = 1;
    const ERROR_TRANSFER_TO_SELF: u64 = 2;
    const ERROR_ZERO_AMOUNT: u64 = 3;
    const INITIAL_XP_BALANCE: u64 = 100;
    const DEFAULT_PRICE_PER_XP: u64 = 10_000_000;

    // ===== Structs =====
    
    public struct XP has store, drop {}
    
    public struct XPBalance has key, store {
        id: UID,
        balance: u64,
        last_updated: u64,
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
    /// * `sender` - The address of the user
    /// * `amount` - The amount of XP to add
    /// * `ctx` - Transaction context
    fun update_xp_balance(sender: address, amount: u64, ctx: &mut TxContext) {
        let xp_balance_opt = df::get<address, XPBalance>(sender);
        
        if (option::is_some(&xp_balance_opt)) {
            // Update existing balance
            let balance = option::extract(&mut xp_balance_opt);
            let XPBalance { id, balance: current_balance, last_updated: _ } = balance;
            let updated_balance = XPBalance {
                id,
                balance: current_balance + amount,
                last_updated: 0,
            };
            // Return the updated object to the owner
            transfer::public_transfer(updated_balance, sender);
        } else {
            // Create new balance object
            let new_balance = XPBalance {
                id: object::new(ctx),
                balance: amount,
                last_updated: 0,
            };
            // Transfer to the user
            transfer::transfer(new_balance, sender);
        }
    }

    public entry fun purchase_xp(
        buyer: &signer,
        payment: Coin<SUI>,
        amount: u64,
        price: u64,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let payment_value = coin::value(&payment);
        
        // Verify the payment is sufficient
        assert!(payment_value >= price, 0);
        
        // Split the payment into the amount needed and change
        let payment_coin = coin::split(payment, price, ctx);
        
        // In a real scenario, you would transfer the payment to a treasury
        // For now, we'll just burn it by transferring to the zero address
        transfer::public_transfer(payment_coin, @0x0);
        
        // Return any change
        if (coin::value(&payment) > 0) {
            transfer::public_transfer(payment, sender);
        }
        
        // Update or create XP balance
        update_xp_balance(sender, amount, ctx);
        
        // Emit purchase event
        let purchase_event = XPPurchased {
            buyer: sender,
            amount: amount,
            price: price,
        };
        event::emit(purchase_event);
        
        // Also emit transfer event for consistency
        let transfer_event = XPTransferred {
            from: sender,
            to: sender,
            amount: amount,
            timestamp: 0, // In a real app, use a proper timestamp
        };
        event::emit(transfer_event);
    }

    public fun balance_of(addr: address): u64 {
        if (df::exists<address, XPBalance>(addr)) {
            let xp_balance = df::get<address, XPBalance>(addr);
            xp_balance.balance
        } else {
            0
        }
    }

    public entry fun spend_xp(
        user: &signer,
        amount: u64,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        assert!(df::exists<address, XPBalance>(sender), ERROR_INSUFFICIENT_BALANCE);
        let xp_balance = df::get<address, XPBalance>(sender);
        
        // Verify the balance is sufficient
        assert!(xp_balance.balance >= amount, ERROR_INSUFFICIENT_BALANCE);
        
        // Update the balance
        let XPBalance { id, balance: current_balance, last_updated: _ } = xp_balance;
        let updated_balance = XPBalance {
            id,
            balance: current_balance - amount,
            last_updated: 0, // Update timestamp (in a real app, use a proper timestamp)
        };
        
        // Return the updated balance to the user
        transfer::public_transfer(updated_balance, sender);
        
        // Emit spent event
        let spent_event = XPSpent {
            user: sender,
            amount: amount,
            timestamp: 0, // In a real app, use a proper timestamp
        };
        event::emit(spent_event);
        
        // Also emit transfer event for consistency
        let transfer_event = XPTransferred {
            from: sender,
            to: @0x0, // Indicates the XP was spent/destroyed (zero address)
            amount: amount,
            timestamp: 0, // In a real app, use a proper timestamp
        };
        event::emit(transfer_event);
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
        let awarded_event = XPAwarded {
            user: recipient,
            amount: amount,
            timestamp: 0, // In a real app, use a proper timestamp
        };
        event::emit(awarded_event);
        
        // Also emit transfer event for consistency
        let transfer_event = XPTransferred {
            from: @0x0, // Indicates the XP was created/minted
            to: recipient,
            amount: amount,
            timestamp: 0, // In a real app, use a proper timestamp
        };
        event::emit(transfer_event);
    }
    
    /// Transfer XP from the sender to another user
    /// 
    /// # Arguments:
    /// * `sender` - The signer of the transaction (must be the owner of the XP)
    /// * `recipient` - The address to transfer XP to
    /// * `amount` - The amount of XP to transfer
    /// * `ctx` - Transaction context
    public entry fun transfer_xp(
        sender: &signer,
        recipient: address,
        amount: u64,
        ctx: &mut TxContext
    ) {
        let sender_addr = tx_context::sender(ctx);
        
        // Prevent self-transfer
        assert!(sender_addr != recipient, ERROR_TRANSFER_TO_SELF);
        // Prevent zero amount transfers
        assert!(amount > 0, ERROR_ZERO_AMOUNT);
        
        // Get and verify sender's balance
        assert!(df::exists<address, XPBalance>(sender_addr), ERROR_INSUFFICIENT_BALANCE);
        let xp_balance = df::get<address, XPBalance>(sender_addr);
        
        // Verify the balance is sufficient
        assert!(xp_balance.balance >= amount, ERROR_INSUFFICIENT_BALANCE);
        
        // Update sender's balance
        let XPBalance { id, balance: current_balance, last_updated: _ } = xp_balance;
        let updated_balance = XPBalance {
            id,
            balance: current_balance - amount,
            last_updated: 0, // In a real app, use a proper timestamp
        };
        
        // Return the updated balance to the sender
        transfer::public_transfer(updated_balance, sender_addr);
        
        // Add XP to recipient
        update_xp_balance(recipient, amount, ctx);
        
        // Emit transfer event
        let transfer_event = XPTransferred {
            from: sender_addr,
            to: recipient,
            amount: amount,
            timestamp: 0, // In a real app, use a proper timestamp
        };
        event::emit(transfer_event);
    }
}