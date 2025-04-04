import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    watch: {
      usePolling: true,
      interval: 100
    },
    headers: {
      'Content-Security-Policy': [
        "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:",
        "img-src 'self' data: blob: https://*.unsplash.com",
        "style-src 'self' 'unsafe-inline' blob: https://fonts.googleapis.com",
        "style-src-elem 'self' 'unsafe-inline' blob: https://fonts.googleapis.com",
        "font-src 'self' data: https://fonts.gstatic.com",
        "connect-src 'self' https://*.unsplash.com",
      ].join('; ')
    }
  },
});
