/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  transform: { '^.+\\.(t|j)sx?$': ['ts-jest', { tsconfig: 'tsconfig.json' }] },
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  coverageThreshold: {
    global: { branches: 80, functions: 85, lines: 85, statements: 85 }
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts']   // <-- add this
};
