import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  base: '/Dashboard_Mindeo/',
  plugins: [react()],
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    }
  }
});