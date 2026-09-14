import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {rollupOptions:{input:{site:'index.html',admin:'admin/index.html'}}},
  server: { proxy: { '/api': 'http://localhost:3001', '/media':'http://localhost:3001' } }
});
