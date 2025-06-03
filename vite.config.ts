import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  base: "/", // 💡 Needed for Vercel to correctly serve index.html
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    outDir: "dist", // 💡 Ensure Vercel picks up the built app
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
