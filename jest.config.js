module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['./test-setup'],
  testPathIgnorePatterns: ["/node_modules/", "/build/"]
};