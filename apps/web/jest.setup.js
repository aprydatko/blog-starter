// jest.setup.js
const { afterEach } = require("@jest/globals")

// Mock global fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
)

// Set up custom matchers (e.g., for testing React components or DOM elements)
require("@testing-library/jest-dom")

// Make sure to mock global window object if you're using any properties like `localStorage` or `sessionStorage`
Object.defineProperty(global, 'window', {
  value: global,
})

global.window = global // In case you are manually setting `window`

// Mocking localStorage (if used in your tests)
Object.defineProperty(global.window, 'localStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
})

// Mock the nextjs `next/router` (if using Next.js)
jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '/',
  }),
}))

// Example: Mock global console methods if needed
global.console = {
  ...global.console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}

// Setting up global variables or environment variables (if needed)
process.env.NODE_ENV = 'test'  // Ensure you're in test mode
process.env.NEXTAUTH_URL = 'http://localhost:3000'
process.env.NEXTAUTH_SECRET = 'test-secret'
process.env.GITHUB_ID = 'test-github-id'
process.env.GITHUB_SECRET = 'test-github-secret'
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'

// If using custom logging utility, mock it for tests
jest.mock('@blog-starter/logger', () => ({
  logger: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  }
}))

// Optional: Global setup for testing React components or utilities
const { cleanup } = require("@testing-library/react")
afterEach(() => {
  // Clean up the DOM after each test to avoid memory leaks
  cleanup()
})
