/** @type {import('jest').Config} */

// jest.unit.config.ts

module.exports = {
    roots: ['<rootDir>'],
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            tsconfig: {
                jsx: 'react-jsx'
            }
        }]
    },
    transformIgnorePatterns: [
        '/node_modules/(?!(next-auth|@auth|@prisma)/)'
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    modulePathIgnorePatterns: [
        '<rootDir>/test/__fixtures__',
        '<rootDir>/node_modules',
        '<rootDir>/dist',
        '<rootDir>/.next'
    ],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '^@blog-starter/logger$': '<rootDir>/__mocks__/logger.ts',
        '^@blog-starter/ui/styles\\.css$': 'identity-obj-proxy',
        '^__mocks__/(.*)$': '<rootDir>/__mocks__/$1.ts',
        '^next-auth/providers/github$': '<rootDir>/__mocks__/next-auth/providers/github.ts',
        '^@/lib/auth$': '<rootDir>/__mocks__/lib/auth.ts',
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    collectCoverageFrom: [
        'src/**/*.{js,jsx,ts,tsx}',
        '!src/**/*.d.ts',
        '!src/**/*.stories.{js,jsx,ts,tsx}',
        '!src/**/__tests__/**'
    ],
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70
        }
    },
    preset: 'ts-jest'
};