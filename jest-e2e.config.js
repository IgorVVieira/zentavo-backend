module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globalSetup: './jest.setup.ts',
  roots: ['<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/jest-setup-e2e.ts'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '.+\\.ts$': 'ts-jest',
  },
};
