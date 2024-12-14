import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src'
    },
    dedupe: ['react', 'react-dom'],
    preserveSymlinks: true
  },
  build: {
    target: 'es2015',
    outDir: 'dist',
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    },
    sourcemap: true,
    rollupOptions: {
      // Removed external: ['recharts']
    }
  },
  server: {
    port: 3000
  },
  optimizeDeps: {
    include: ['recharts', '@tanstack/react-query', 'lucide-react']
  }
});