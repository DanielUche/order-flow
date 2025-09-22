import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

console.log('Federation plugin loaded:', federation);

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'mf-analytics',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App.tsx',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
  server: {
    host: '127.0.0.1',
    port: 5002,
    strictPort: true,
    cors: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
  },
  build: {
    outDir: 'dist',
    target: 'esnext',
  },
});