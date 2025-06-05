# PeerVerse - Decentralized Learning Platform

PeerVerse is a decentralized learning platform built on the Sui blockchain, enabling users to create, share, and monetize educational content and interactive learning sessions.

## Project Structure

- `sources/` - Contains the Move smart contracts
  - `content.move` - Manages educational content (articles, videos, courses)
  - `session.move` - Handles live learning sessions and scheduling
  - `user_profile.move` - Manages user profiles and reputation
  - `xp_marketplace.move` - Handles XP token economy and transactions

## Prerequisites

- [Sui CLI](https://docs.sui.io/build/install) - Install the Sui development environment
- [Rust](https://www.rust-lang.org/tools/install) - Required for Move development

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd peer-verse
   ```

2. Build the project:
   ```bash
   sui move build
   ```

3. Run tests:
   ```bash
   sui move test
   ```

## Smart Contract Modules

### Content Module
Manages educational content including articles, videos, and courses.
- Create, update, and access content
- Set content visibility (public/private/paid)
- Track content interactions

### Session Module
Handles live learning sessions and scheduling.
- Schedule and manage live sessions
- Join and participate in sessions
- Track session attendance and completion

### User Profile Module
Manages user profiles and reputation.
- Create and update user profiles
- Track user activity and achievements
- Manage user ratings and reviews

### XP Marketplace Module
Manages the XP token economy.
- Earn XP through platform activities
- Transfer XP between users
- Purchase content and sessions using XP

## Development

### Building

```bash
sui move build
```

### Testing

```bash
sui move test
```

### Deploying

1. Start a local Sui network:
   ```bash
   sui start
   ```

2. Deploy the package:
   ```bash
   sui client publish --gas-budget 100000000
   ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
