const config = {
  roots: ['<rootDir>/src'],
  collectCoverage: true,
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!<rootDir>/src/main/**'],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest',
  },
  testMatch: ['**/*.spec.ts'],
  moduleNameMapper: {
    '^@users/(.*)$': '<rootDir>/src/users/$1',
    '^@transactions/(.*)$': '<rootDir>/src/transactions/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
  },
};

module.exports = config;
