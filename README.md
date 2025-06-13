# PeerVerse

A modern, Vite-powered React web application with Sui blockchain integration, designed to address challenges faced by students in Africa and beyond. This project features a modular architecture, fast development workflow, and is optimized for deployment on Netlify.

##  Features
-  Built with [Vite](https://vitejs.dev/) for lightning-fast development
-  [React](https://react.dev/) with SWC for high performance
-  Sui blockchain integration
-  Modern UI with Radix UI components and Tailwind CSS
-  TypeScript for type safety
-  State management with React Query
-  Form handling with React Hook Form
-  Theming support
-  ZKLOGIN authentication
-  Data visualization with Recharts
-  Video conferencing with Jitsi Meet

##  Dependencies

### Core
- `react` (^18.3.1) & `react-dom` (^18.3.1) - React library
- `typescript` (^5.5.3) - Type checking
- `vite` (^5.4.1) - Build tool

### Sui Blockchain
- `@mysten/dapp-kit` (^0.16.6) - Sui dApp development
- `@mysten/sui` (^1.30.2) - Sui SDK
- `@mysten/wallet-kit` (^0.8.6) - Wallet components
- `@mysten/enoki` (^0.6.14) - Enoki wallet

### UI Components
- `@radix-ui/*` - Accessible UI primitives
- `tailwindcss` (^3.4.11) - CSS framework
- `lucide-react` (^0.462.0) - Icons
- `sonner` (^1.5.0) - Toasts

### State & Data
- `@tanstack/react-query` (^5.56.2) - Data fetching
- `zod` (^3.23.8) - Validation
- `react-hook-form` (^7.53.0) - Forms
- `jwt-decode` (^4.0.0) - Token handling

##  Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd color-echo-clone-10
   ```

2. **Install dependencies with legacy peer deps**
   
   Due to version conflicts between Sui packages, use one of these methods:
   
   **Option 1: Using npm (recommended)**
   ```bash
   npm install --legacy-peer-deps
   ```
   
   **Option 2: Using pnpm**
   ```bash
   pnpm install --shamefully-hoist
   ```
   
   **Option 3: Using yarn**
   ```bash
   yarn install --ignore-engines
   ```

3. **If you still encounter issues**, try installing specific versions:
   ```bash
   npm uninstall @mysten/sui.js @mysten/wallet-adapter-react
   npm install @mysten/sui.js@0.20.0 @mysten/wallet-adapter-react@11.0.0 --legacy-peer-deps
   ```

##  Troubleshooting

### Dependency Conflicts
If you see errors about conflicting peer dependencies, try these steps:

1. Clear npm cache:
   ```bash
   npm cache clean --force
   ```

2. Remove node_modules and package-lock.json:
   ```bash
   rm -rf node_modules package-lock.json
   ```

3. Reinstall with legacy peer deps:
   ```bash
   npm install --legacy-peer-deps
   ```

### Common Issues

1. **Mysten SDK Version Mismatch**
   Ensure these versions are installed together:
   ```bash
   npm install @mysten/sui.js@0.20.0 @mysten/wallet-adapter-react@11.0.0 @mysten/dapp-kit@0.16.6 --legacy-peer-deps
   ```

2. **React Version Conflicts**
   Make sure you're using a compatible React version:
   ```bash
   npm install react@18.3.1 react-dom@18.3.1 --legacy-peer-deps
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory with required environment variables:
   ```
   VITE_APP_TITLE=PeerVerse
   VITE_API_URL=your_api_url_here
   ```

##  Development

1. **Start the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   # or
   yarn dev
   ```
   The app will be available at `http://localhost:8080`

2. **Build for production**
   ```bash
   npm run build
   ```
   The production build will be in the `dist/` directory

##  Deployment

### Netlify
1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Deploy:
   ```bash
   netlify deploy --prod
   ```

##  Documentation

- [Vite Documentation](https://vitejs.dev/guide/)
- [React Documentation](https://react.dev/learn)
- [Sui Documentation](https://docs.sui.io/)
- [Tailwind CSS](https://tailwindcss.com/docs)

##  Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
- Ready for deployment on Netlify

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [pnpm](https://pnpm.io/) or [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd color-echo-clone-10
   ```
2. Install dependencies:
   ```sh
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```

### Development

Start the development server:
```sh
pnpm dev
# or
npm run dev
# or
yarn dev
```
The app will be available at [http://localhost:5173](http://localhost:5173).

### Build

To build the app for production:
```sh
pnpm build
# or
npm run build
# or
yarn build
```
The output will be in the `dist/` directory, ready for deployment.

### Deployment

This project is configured for seamless deployment on [Netlify](https://peerverses.netlify.com/). The `netlify.toml` and Vite config ensure correct routing and static file serving.

## Project Structure

```
PeerVerse/
├── public/           # Static assets
├── src/              # Source code
│   ├── components/   # React components
│   ├── contexts/     # React contexts
│   ├── hooks/        # Custom hooks
│   ├── lib/          # Utilities
│   └── pages/        # Page components
├── index.html        # Main HTML file
├── vite.config.ts    # Vite configuration
├── tailwind.config.ts# Tailwind CSS config
├── vercel.json       # Vercel deployment config
└── ...
```

## Contributing

Contributions are welcome! Please open issues or pull requests for improvements or bug fixes.

## License

[MIT](LICENSE)
