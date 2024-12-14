import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      'recharts',
      'recharts/lib/component/ResponsiveContainer',
      'recharts/lib/component/LineChart',
      'recharts/lib/component/Line',
      'recharts/lib/component/XAxis',
      'recharts/lib/component/YAxis',
      'recharts/lib/component/CartesianGrid',
      'recharts/lib/component/Tooltip',
      'recharts/lib/component/Legend'
    ],
    force: true
  },
  build: {
    target: 'es2015',
    outDir: 'dist',
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    },
    rollupOptions: {
      external: [],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'recharts']
        }
      }
    }
  },
  resolve: {
    alias: {
      'recharts': 'recharts/es6'
    },
    dedupe: ['react', 'react-dom', 'recharts']
  }
});