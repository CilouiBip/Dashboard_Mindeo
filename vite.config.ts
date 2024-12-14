import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2015',
    outDir: 'dist',
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    },
    rollupOptions: {
      external: ['recharts'],
      output: {
        globals: {
          recharts: 'Recharts'
        }
      }
    }
  },
  resolve: {
    alias: {
      'recharts': 'recharts/es6'
    },
    dedupe: ['react', 'react-dom']
  }
});