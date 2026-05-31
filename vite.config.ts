import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          // Group heavy deps (and their transitive deps) into cacheable vendor
          // chunks. recharts pulls in many d3-* packages, so match them too.
          if (/[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/.test(id))
            return 'react-vendor';
          if (/[\\/]node_modules[\\/](@reduxjs|react-redux|redux|immer|reselect)[\\/]/.test(id))
            return 'redux-vendor';
          if (/[\\/]node_modules[\\/](recharts|d3-|victory-|decimal\.js-light|internmap)/.test(id))
            return 'chart-vendor';
          if (/[\\/]node_modules[\\/]@supabase[\\/]/.test(id)) return 'supabase-vendor';
          return 'vendor';
        },
      },
    },
  },
});
