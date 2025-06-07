# PeerVerse

PeerVerse is a decentralized educational platform built on the Sui blockchain that enables peer-to-peer learning with gamified elements and token-based incentives.

## Features

- **zkLogin Authentication**: Secure user authentication using zkLogin proofs
- **XP (Experience Points) System**: 
  - Earn XP through participation and contributions
  - Purchase XP to unlock features
  - Use XP to attend classes
- **Trial Period System**:
  - Free trial period for new users
  - Track class attendance and contributions
  - Earn initial XP based on trial period activity
- **Class Attendance**:
  - Track and verify class attendance
  - XP-based access control for classes
  - Special provisions during trial period
- **Reputation System**:
  - Dynamic reputation scoring
  - Positive and negative reputation adjustments
  - Impact on platform privileges

## Smart Contract Structure

### Main Contract (auth.move)
The main smart contract contains the following key components:

- User Profile Management
- Authentication System
- XP Management
- Class Attendance Tracking
- Trial Period Evaluation
- Reputation System

### Active Frontend Integration (wer_session.move)
The `wer_session.move` contract is currently the only actively integrated module with the frontend. It handles:
- Creation of live learning sessions
- Storage of session data on the Sui blockchain
- Management of session participants and interactions

All session data is stored immutably on the Sui blockchain, ensuring transparency and verifiability of all learning sessions.

## Getting Started

### Prerequisites

- Sui CLI
- Move Compiler
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/sorbadek/peerverse_final_submission.git
```

2. Navigate to the project directory:
```bash
cd wer_contract
```

3. Build the project:
```bash
sui move build
```

### Testing

Run the test suite:
```bash
sui move test
```

## Core Functions

### User Management
- `register_user`: Register new users with zkLogin verification
- `authenticate_user`: Authenticate existing users
- `verify_session`: Verify user session validity

### Class System
- `attend_class`: Record class attendance
- `evaluate_trial_period`: Evaluate user's trial period performance
- `calculate_initial_xp`: Calculate XP based on trial period activity

### XP System
- `purchase_xp`: Allow users to purchase XP
- `award_xp`: Award XP to users for activities
- `spend_xp`: Spend XP for platform features

## Constants

- `MAX_SESSION_DURATION`: 86400000 (24 hours)
- `INITIAL_XP_BONUS`: 100 XP
- `XP_COST_PER_CLASS`: 50 XP
- `FREE_TRIAL_DURATION`: 604800000 (7 days)
- `MIN_XP_REQUIRED`: 50 XP

## Events

The system emits various events for tracking and auditing:
- UserRegistered
- UserAuthenticated
- XPAwarded
- ClassAttended
- TrialPeriodCompleted
- XPPurchased
- ZkLoginVerified

## Security

- zkLogin verification for secure authentication
- Session-based access control
- Admin-only functions for sensitive operations
- XP-based access restrictions

## License

MIT

## Contributing

[Add contribution guidelines here]
