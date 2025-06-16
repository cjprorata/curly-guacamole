module.exports = {
    testEnvironment: 'node',
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
      'src/**/*.js',
      '!src/index.js', // Exclude CLI entry point
      '!**/node_modules/**'
    ],
    testMatch: [
      '**/tests/**/*.test.js'
    ],
    verbose: true,
    testTimeout: 30000,
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js']
  };