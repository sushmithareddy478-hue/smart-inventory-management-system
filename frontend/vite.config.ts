import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('error', (_err, _req, res) => {
            if (!res.headersSent && typeof (res as any).writeHead === 'function') {
              (res as any).writeHead(503, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ status: 503, message: 'Backend offline - utilizing local state' }));
            }
          });
        }
      }
    }
  }
});
