import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['html', 'json-summary', 'json'],
      reportOnFailure: true,
      enabled: true
    }
  },
  resolve: {
    // Solves ESM import errors
    mainFields: ['module']
  }
});
