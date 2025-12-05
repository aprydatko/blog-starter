/* eslint-disable @typescript-eslint/no-require-imports */
const { beforeEach, beforeAll, afterAll } = require("@jest/globals");
const { execSync } = require("child_process")

require('@testing-library/jest-dom');

// Mock TextEncoder/Decoder
// const { TextEncoder, TextDecoder } = require('text-encoding');
// global.TextEncoder = TextEncoder;
// global.TextDecoder = TextDecoder;
// global.setImmediate = jest.fn();

// Mock CSS imports - Jest can't parse CSS files
jest.mock('@blog-starter/ui/styles.css', () => ({}));

// Mock next/font/google
jest.mock('next/font/google', () => ({
  Geist: jest.fn(() => ({
    variable: '--font-geist-sans',
  })),
  Geist_Mono: jest.fn(() => ({
    variable: '--font-geist-mono',
  })),
}));

// Mock the logger
jest.mock('@blog-starter/logger', () => ({
  logger: {
    trace: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    fatal: jest.fn(),
    levels: {
      labels: { '10': 'trace', '20': 'debug', '30': 'info', '40': 'warn', '50': 'error', '60': 'fatal' },
      values: { trace: 10, debug: 20, info: 30, warn: 40, error: 50, fatal: 60 },
    },
  },
}));

// Mock the useSession hook globally for all tests
jest.mock('next-auth/react', () => ({
  useSession: jest.fn().mockReturnValue({
    status: 'authenticated',
    data: {
      user: {
        id: 'mockUserId',
        name: 'Mock User',
        email: 'mockuser@example.com',
        image: 'https://example.com/mockuser.png',
      },
    },
  }),
}));

beforeAll(() => {
  process.env.NODE_ENV = 'test';
  require('dotenv').config(); // Load .env.test
  
  // Run Prisma migrations for the test database
  execSync('npx prisma migrate deploy --schema=packages/database/prisma/schema.prisma', { stdio: 'inherit' });
});

afterAll(() => {
  // Optionally reset the database after tests (or close connections)
  execSync('npx prisma migrate reset --force --schema=packages/database/prisma/schema.prisma', { stdio: 'inherit' });
});

// Optional: Clear mocks before each test to ensure fresh state
beforeEach(() => {
  jest.clearAllMocks();
})