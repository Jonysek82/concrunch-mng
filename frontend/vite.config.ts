import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: {
    // použije se, když VITE_API_URL=/api (bez absolutní adresy); backend běží na portu 5000
    proxy: { '/api': { target: 'http://localhost:5000', changeOrigin: true } },
  },
});
