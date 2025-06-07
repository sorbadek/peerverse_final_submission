#[allow(duplicate_alias)]
module wer2::user_profile {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use std::string::{Self, String};
    use sui::transfer;
    use sui::event;
    use sui::clock::{Self, Clock};
    use sui::sui::SUI;
    use sui::coin::{Self, Coin};
    use std::option::{Self};

    // ===== Constants =====
    const GRACE_PERIOD_DAYS: u64 = 7;
    const SECONDS_PER_DAY: u64 = 86400;
    const INITIAL_XP: u64 = 100;

    // ===== Structs =====
    
    public struct UserProfile has key, store {
        id: UID,
        zk_address: vector<u8>,
        username: String,
        bio: String,
        avatar_url: String,
        is_tutor: bool,
        xp_balance: u64,
        total_xp_earned: u64,
        created_at: u64,
        updated_at: u64,
        grace_period_end: u64,
        performance_metrics: PerformanceMetrics,
    }

    public struct PerformanceMetrics has store, drop {
        sessions_taught: u64,
        sessions_attended: u64,
        content_created: u64,
        content_consumed: u64,
        average_rating: u64,
        rating_count: u64,
    }

    // ===== Events =====
    
    public struct ProfileCreated has copy, drop {
        user_address: address,
        grace_period_end: u64,
        username: String,
        is_tutor: bool
    }

    public struct PerformanceXPAwarded has copy, drop {
        user_address: address,
        amount: u64,
        reason: String
    }

    public entry fun create_profile(
        zk_address: vector<u8>,
        username: String,
        bio: String,
        avatar_url: String,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let now = clock::timestamp_ms(clock) / 1000;
        let grace_period_end = now + (GRACE_PERIOD_DAYS * SECONDS_PER_DAY);
        let sender = tx_context::sender(ctx);
        
        let profile = UserProfile {
            id: object::new(ctx),
            zk_address,
            username: copy username,
            bio: copy bio,
            avatar_url: copy avatar_url,
            is_tutor: false,
            xp_balance: INITIAL_XP,
            total_xp_earned: INITIAL_XP,
            created_at: now,
            updated_at: now,
            grace_period_end,
            performance_metrics: PerformanceMetrics {
                sessions_taught: 0,
                sessions_attended: 0,
                content_created: 0,
                content_consumed: 0,
                average_rating: 0,
                rating_count: 0,
            }
        };

        transfer::transfer(profile, sender);
        event::emit(ProfileCreated {
            user_address: sender,
            grace_period_end,
            username,
            is_tutor: false
        });
    }

    public fun is_in_grace_period(profile: &UserProfile, current_time: u64): bool {
        current_time < profile.grace_period_end
    }

    public(package) fun update_performance_metrics(
        profile: &mut UserProfile,
        sessions_taught_delta: u64,
        sessions_attended_delta: u64,
        content_created_delta: u64,
        content_consumed_delta: u64,
        new_rating: u64,
    ) {
        let metrics = &mut profile.performance_metrics;
        
        metrics.sessions_taught = metrics.sessions_taught + sessions_taught_delta;
        metrics.sessions_attended = metrics.sessions_attended + sessions_attended_delta;
        metrics.content_created = metrics.content_created + content_created_delta;
        metrics.content_consumed = metrics.content_consumed + content_consumed_delta;
        
        if (new_rating > 0) {
            let total_rating = metrics.average_rating * metrics.rating_count;
            metrics.rating_count = metrics.rating_count + 1;
            metrics.average_rating = (total_rating + new_rating) / metrics.rating_count;
        }
    }

    public fun calculate_performance_reward(profile: &UserProfile): u64 {
        let metrics = &profile.performance_metrics;
        let mut reward = 0;
        
        reward = reward + (metrics.sessions_taught * 50);
        reward = reward + (metrics.sessions_attended * 20);
        reward = reward + (metrics.content_created * 30);
        reward = reward + (metrics.content_consumed * 10);
        
        let rating_bonus = (reward * metrics.average_rating) / 1000;
        reward = reward + rating_bonus;
        
        if (reward < 100) reward = 100;
        if (reward > 1000) reward = 1000;
        
        reward
    }

    public entry fun award_performance_xp(
        profile: &mut UserProfile,
        amount: u64,
        payment: Coin<SUI>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let now = clock::timestamp_ms(clock) / 1000;
        let sender = tx_context::sender(ctx);
        
        // Take the payment (in a real app, you'd verify the amount)
        let _payment_value = coin::value(&payment);
        coin::destroy_zero(payment);
        
        // Update profile with new XP
        profile.xp_balance = profile.xp_balance + amount;
        profile.total_xp_earned = profile.total_xp_earned + amount;
        profile.updated_at = now;
        
        // Update performance metrics
        profile.performance_metrics = PerformanceMetrics {
            sessions_taught: profile.performance_metrics.sessions_taught,
            sessions_attended: profile.performance_metrics.sessions_attended + 1,
            content_created: profile.performance_metrics.content_created,
            content_consumed: profile.performance_metrics.content_consumed + 1,
            average_rating: profile.performance_metrics.average_rating,
            rating_count: profile.performance_metrics.rating_count,
        };
        
        // Emit event with proper string type
        let reason = string::utf8(b"weekly_performance_reward");
        event::emit(PerformanceXPAwarded {
            user_address: sender,
            amount: amount,
            reason: reason
        });
        
        // Burn the payment
        transfer::public_transfer(payment, @0x0);
    }
}