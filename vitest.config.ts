import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    // Each test file runs in its own isolated context, and mocks/timers are
    // restored after every test, so no global state bleeds across files.
    isolate: true,
    restoreMocks: true,
    unstubGlobals: true,
  },
});
