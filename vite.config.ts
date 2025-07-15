
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    watch: {
      usePolling: true,
      interval: 5000,
      binaryInterval: 10000,
      depth: 2,
      ignored: [
        '**/.git/**',
        '**/node_modules/**',
        '**/dist/**',
        '**/build/**',
        '**/coverage/**',
        '**/.next/**',
        '**/out/**',
        '**/.vscode/**',
        '**/.idea/**',
        '**/tmp/**',
        '**/temp/**',
        '**/public/**',
        '**/supabase/**',
        '**/*.log',
        '**/*.lock',
        '**/package-lock.json',
        '**/bun.lockb',
        '**/yarn.lock',
        '**/.env*',
        '**/tsconfig*.json',
        '**/vite.config.ts',
        '**/tailwind.config.ts',
        '**/postcss.config.js',
        '**/eslint.config.js',
        '**/components.json',
        '**/*.md',
        '**/README*',
        '**/PRD',
        '**/.gitignore'
      ]
    }
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: ['fsevents'],
    include: ['react', 'react-dom']
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      external: ['fsevents']
    }
  }
}));
