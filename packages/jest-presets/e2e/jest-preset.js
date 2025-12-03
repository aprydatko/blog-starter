/** @type {import('jest').Config} */
module.exports = {
  roots: ['<rootDir>'], // Default root directory for tests
  transform: {
    '^.+\\.tsx?$': 'ts-jest', // Use ts-jest for TypeScript files
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  modulePathIgnorePatterns: [
    '<rootDir>/test/__fixtures__',  // Ignore fixture folders
    '<rootDir>/node_modules',       // Ignore node_modules
    '<rootDir>/dist',               // Ignore dist folder (e.g., built files)
  ],

  // To detect E2E tests, we will match files with `.e2e.ts` or `.e2e.js` extension
  testMatch: ['**/?(*.)+(e2e).[jt]s?(x)'], // Matches `*.e2e.ts` or `*.e2e.js` files

  // Optional: Custom setup file for E2E tests
  setupFilesAfterEnv: ['<rootDir>/jest.setup.e2e.js'], // Path to a custom setup file

  // Use Node environment for E2E tests (you can change to jsdom for frontend E2E tests)
  testEnvironment: 'node', // Set 'jsdom' for frontend, 'node' for backend
  
  // You can also specify E2E test-specific globals if needed
  globals: {
    __E2E__: true, // You can use this flag in tests to differentiate them if needed
  },
  
  // Optional: Configure Jest to run tests serially for E2E
  maxWorkers: 1, // Useful for E2E to avoid concurrency issues
  
  // Other Jest configuration as needed for your project
  preset: 'ts-jest',  // If you're using TypeScript
};
