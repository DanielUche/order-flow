export const jestConfig = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)sx?$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  coverageDirectory: 'coverage',
  moduleNameMapper: {
    '^@orderflow/(.*)$': '<rootDir>/../$1/src',
  },
};
