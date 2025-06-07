# PeerVerse

A modern, Vite-powered React web application inspired by the Situation and challenges surrounding students in africa and beyond. This project features a modular architecture, fast development workflow, and is optimized for deployment on Netlify.

## Features
- Built with [Vite](https://vitejs.dev/) for lightning-fast development and builds
- Uses [React](https://react.dev/) with SWC for high performance
- Modular component structure in `src/components`
- TypeScript for type safety
- [Tailwind CSS](https://tailwindcss.com/) for rapid UI development
- Protected routes and authentication context
- Analytics, notifications, and social features
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
color-echo-clone-10/
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
