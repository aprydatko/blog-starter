import type { Config } from 'jest'

const config: Config = {
  displayName: 'integration',
  preset: '@blog-starter/jest-presets/node',
  testMatch: ['**/__tests__/integration/**/*.test.ts'],
}

export default config
