module learning_platform::xp_marketplace {
    use sui::coin::{Self, Coin};
    use sui::balance;
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::object::{Self, ID, UID};
    use sui::sui::SUI;
    use sui::event;
    use std::option::Option;
    use std::vector;
    use sui::dynamic_field;
    
    // Use local modules with proper address
    use learning_platform::user_profile;

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
    
    public struct XpPurchased has copy, drop {
        buyer: address,
        amount: u64,
        price: u64
    }

    public struct XpTransferred has copy, drop {
        sender: address,
        recipient: address,
        amount: u64,
        timestamp: u64
    }

    public struct XpSpent has copy, drop {
        user: address,
        amount: u64,
        timestamp: u64
    }
    
    public struct XpAwarded has copy, drop {
        user: address,
        amount: u64,
        timestamp: u64
    }

    public fun init(ctx: &mut TxContext) {
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
    public entry fun purchase_xp(
        config: &mut MarketConfig,
        payment: coin::Coin<SUI>,
        amount: u64,
        ctx: &mut TxContext,
    ) {
        let price = amount * config.price_per_xp;
        let payment_value = coin::value(&payment);
        
        assert!(payment_value >= price, 0);
        
        let (payment, change) = coin::split(payment, price, ctx);
        coin::burn(payment, ctx);
        
        if (coin::value(&change) > 0) {
            transfer::public_transfer(change, tx_context::sender(ctx));
        }
        
        let sender = tx_context::sender(ctx);
        let xp_balance = if (exists<XPBalance>(object::address_to_object(sender))) {
            object::borrow_global_mut<XPBalance>(sender)
        } else {
            XPBalance {
                id: object::new(ctx),
                balance: 0,
                last_updated: 0,
            }
        };
        
        xp_balance.balance = xp_balance.balance + amount;
        transfer::transfer(xp_balance, sender);
        
        event::emit(XPPurchased {
            buyer: sender,
            amount,
            price,
        });
    }

    public fun balance_of(addr: address): u64 {
        if (exists<XPBalance>(object::address_to_object(addr))) {
            object::borrow_global<XPBalance>(addr).balance
        } else {
            0
        }
    }

    public fun spend_xp(
        _sender: &signer,
        amount: u64,
        ctx: &mut TxContext,
    ): bool {
        let sender = tx_context::sender(ctx);
        let xp_balance = balance::balance_mut(&mut object::borrow_global_mut<XPBalance>(sender).balance);
        if (*xp_balance < amount) {
            return false
        };
        
        *xp_balance = *xp_balance - amount;
        true
    }

    public fun add_xp(
        _sender: &signer,
        recipient: address,
        amount: u64,
        ctx: &mut TxContext,
    ) {
        if (!exists<XPBalance>(object::address_to_object(recipient))) {
            let xp_balance = XPBalance {
                id: object::new(ctx),
                balance: 0,
            };
            transfer::transfer(xp_balance, recipient);
        };
        
        let xp_balance = object::borrow_global_mut<XPBalance>(recipient);
        xp_balance.balance = xp_balance.balance + amount;
        xp_balance.last_updated = 0; // TODO: Update with actual timestamp when clock is available
    }
}