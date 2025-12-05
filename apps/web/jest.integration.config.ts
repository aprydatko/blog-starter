import type { Config } from 'jest'

const config: Config = {
  displayName: 'integration',
  preset: '@blog-starter/jest-presets/node',
  testMatch: ['**/__tests__/integration/**/*.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/envConfig$': '<rootDir>/src/lib/envConfig.ts',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@auth|@prisma|@blog-starter)/)',
  ],
}

export default config
