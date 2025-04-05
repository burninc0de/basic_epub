import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // exclude: ['lucide-react'],
  },
  server: {
    watch: {
      usePolling: true,
      interval: 100
    },
    headers: {
      'Content-Security-Policy': [
        "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: https://*.amazonaws.com",
        "img-src 'self' data: blob: https://*.unsplash.com https://*.amazonaws.com",
        "style-src 'self' 'unsafe-inline' blob: https://fonts.googleapis.com https://*.amazonaws.com",
        "style-src-elem 'self' 'unsafe-inline' blob: https://fonts.googleapis.com https://*.amazonaws.com",
        "font-src 'self' data: https://fonts.gstatic.com https://*.amazonaws.com",
        "connect-src 'self' https://*.unsplash.com https://*.amazonaws.com"
      ].join('; ')
    }
  },
});
