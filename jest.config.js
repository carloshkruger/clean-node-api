module.exports = {
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  // testEnvironment: 'node',
  collectCoverageFrom: ['**/src/**/*.js'],
  preset: '@shelf/jest-mongodb',
  watchPathIgnorePatterns: ['globalConfig'],
  roots: ['src', '__mocks__']
}
