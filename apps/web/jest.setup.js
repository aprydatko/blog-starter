/* eslint-disable @typescript-eslint/no-require-imports */
const { beforeEach } = require("@jest/globals");
require('@testing-library/jest-dom');

// Mock TextEncoder/Decoder
const { TextEncoder, TextDecoder } = require('text-encoding');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.setImmediate = jest.fn();

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

// Optional: Clear mocks before each test to ensure fresh state
beforeEach(() => {
  jest.clearAllMocks();
})