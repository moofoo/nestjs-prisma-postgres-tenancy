import { defineConfig } from '@playwright/test';

export default defineConfig({
      testDir: './tests',
      fullyParallel: true,
      workers: 50,
      repeatEach: 50,
      reporter: 'html',
      use: {
            trace: 'on-first-retry',
            bypassCSP: true
      }
});