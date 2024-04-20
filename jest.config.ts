/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    collectCoverageFrom: ["./**/*"],
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/tests/',
        '/coverage/',
        'jest.config.ts'
    ],
    coverageThreshold: {
        "global": {
            "lines": 90
        }
    },
    testMatch: [
        '**/tests/**',
        '!**/tests/**/example.ts',
    ],
};