module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['src/__tests__'],
  testTimeout: 10000,
  collectCoverageFrom: [
    "src/services/*.{js,ts}",
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
};
