// apps/web/__tests__/app.e2e.test.ts
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'
import { logger } from "@blog-starter/logger";  // Importing logger from the shared package

// jest.setup.e2e.js

beforeAll(() => {
  // Initialize logger for E2E tests
  logger.info('Starting E2E tests...');
});

afterAll(() => {
  // Clean up after all E2E tests
  logger.info('Finished running E2E tests');
});
