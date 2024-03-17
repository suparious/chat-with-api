module.exports = {
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest'
  },
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['./jest.setup.js']
}