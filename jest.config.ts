const config = {
  roots: ["<rootDir>/src"],
  collectCoverage: true,
  collectCoverageFrom: ["<rootDir>/src/**/*.ts", "!<rootDir>/src/main/**"],
  coverageDirectory: "coverage",
  testEnvironment: "node",
  transform: {
    ".+\\.ts$": "ts-jest",
  },
  moduleNameMapper: {
    "^@users/(.*)$": "<rootDir>/src/users/$1",
    "^@shared/(.*)$": "<rootDir>/src/shared/$1",
  },
};

module.exports = config;
