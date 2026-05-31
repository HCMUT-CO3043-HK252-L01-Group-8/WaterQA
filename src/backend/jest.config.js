module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'services/auth.service.js',
    'services/data.service.js',
    'services/device.service.js',
  ],
  clearMocks: true,
  restoreMocks: true,
};
