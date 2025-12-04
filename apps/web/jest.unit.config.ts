// jest.unit.config.js

const config = {
  displayName: 'unit',
  preset: '@blog-starter/jest-presets/browser',
  testMatch: ['**/__tests__/unit/**/*.test.ts', '**/__tests__/unit/**/*.test.tsx'],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@blog-starter/logger$': '<rootDir>/__mocks__/logger.ts',
    '^@blog-starter/ui/styles\\.css$': 'identity-obj-proxy',
    '^__mocks__/(.*)$': '<rootDir>/__mocks__/$1.ts',
    '^next-auth/providers/github$': '<rootDir>/__mocks__/next-auth/providers/github.ts',
    '^@/lib/auth$': '<rootDir>/__mocks__/lib/auth.ts',
  },
}
export default config

// pnpm run test:unit -- ./__tests__/unit/components/AuthComponents.test.ts
// pnpm run test:unit -- ./__tests__/unit/components/Layout.test
