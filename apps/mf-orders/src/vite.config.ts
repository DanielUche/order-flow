import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'mf-orders',
      filename: 'remoteEntry.js',
      exposes: { './App': './src/App.tsx' },
      shared: ['react', 'react-dom'],
    }),
  ],
  server: {
    host: '127.0.0.1',
    port: 5001,
    strictPort: true, // <-- fail if 5001 is taken (don’t auto-bump)
    cors: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
  },
  build: { outDir: 'dist', assetsDir: 'assets' },
  base: process.env.BUILD_ENV === 'prod' ? '/assets/mf-orders/' : '/',
});
