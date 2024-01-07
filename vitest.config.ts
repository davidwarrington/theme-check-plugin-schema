import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Required whilst plugin must be built before test run
    pool: 'forks',
  },
});
