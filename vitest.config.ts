import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom'
  },
  resolve: {
    // Solves ESM import errors
    mainFields: ['module']
  }
});
