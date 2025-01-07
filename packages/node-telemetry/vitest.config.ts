import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    watch: false,
    include: ['**/test/*.test.ts'],
    exclude: ['**/fixtures/**', '**/dist/**'],
    poolOptions: {
      threads: {
        maxThreads: 8,
      },
    },
    clearMocks: true,
    testTimeout: 30_000,
    coverage: {
      enabled: true,
      provider: 'v8',
      reportsDirectory: 'coverage',
      reporter: ['lcov', 'cobertura'],
      clean: true,
    },
    reporters: ['default', ['junit', { outputFile: 'test-report.xml' }]],
    environment: 'node',
  },
});
