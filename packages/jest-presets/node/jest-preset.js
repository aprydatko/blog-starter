/** @type {import('jest').Config} */
module.exports = {
    roots: ['<rootDir>'],
    testEnvironment: 'node',
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    modulePathIgnorePatterns: [
        '<rootDir>/test/__fixtures__',
        '<rootDir>/node_modules',
        '<rootDir>/dist',
        '<rootDir>/.next'
    ],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testTimeout: 30000,
    maxWorkers: 1,
    collectCoverageFrom: [
        'src/**/*.{js,jsx,ts,tsx}',
        '!src/**/*.d.ts',
        '!src/**/__tests__/**'
    ],
    preset: 'ts-jest'
};