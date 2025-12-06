import { resolve } from 'node:path'
import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import tseslint from 'typescript-eslint'
import onlyWarn from 'eslint-plugin-only-warn'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y'
import globals from 'globals'

/**
 * A custom ESLint configuration for Storybook projects.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const config = [
    js.configs.recommended,
    eslintConfigPrettier,
    ...tseslint.configs.recommended,
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        plugins: {
            react: reactPlugin,
            'react-hooks': reactHooksPlugin,
            'jsx-a11y': jsxA11yPlugin,
            onlyWarn,
        },
        languageOptions: {
            globals: {
                ...globals.browser,
                React: 'readonly',
                JSX: 'readonly',
            },
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
        rules: {
            ...reactPlugin.configs.recommended.rules,
            ...reactHooksPlugin.configs.recommended.rules,
            'import/no-default-export': 'off',
            'react/react-in-jsx-scope': 'off', // Not needed in React 17+
            '@typescript-eslint/no-unused-vars': 'warn',
        },
    },
    {
        ignores: ['node_modules/', 'dist/', 'storybook-static/', '.storybook/'],
    },
]