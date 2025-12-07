/* eslint-disable @typescript-eslint/no-require-imports */
const { loggerMock } = require("__mocks__/logger")
const { reactMock } = require("__mocks__/next-auth/react")
const { beforeEach } = require("@jest/globals");
require('@testing-library/jest-dom');

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
  logger: loggerMock,
}));

// Mock the useSession hook globally for all tests
jest.mock('next-auth/react', () => (reactMock));

// Optional: Clear mocks before each test to ensure fresh state
beforeEach(() => {
  jest.clearAllMocks();
})