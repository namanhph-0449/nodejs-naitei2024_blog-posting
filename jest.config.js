module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: 'tests',
    setupFilesAfterEnv: ['<rootDir>/setup.ts'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'node'],
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    globals: {
        'ts-jest': {
        tsconfig: 'tsconfig.json',
        },
    },
};
  