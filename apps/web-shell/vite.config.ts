import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'web-shell',
      remotes: {
        'mf-orders': 'http://localhost:5001/assets/remoteEntry.js',
        'mf-analytics': 'http://localhost:5002/assets/remoteEntry.js',
      },
      shared: ['react', 'react-dom', 'react-router-dom'],
    }),
  ],
  server: { port: 5000 },
  build: {
    outDir: 'dist',
    target: 'esnext',
  },
});
