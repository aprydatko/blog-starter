import { config as baseConfig } from '@blog-starter/eslint-config/base'

/** @type {import("eslint").Linter.Config[]} */
export default [
    ...baseConfig,
    {
        ignores: ['**/__tests__/**']
    }
]
