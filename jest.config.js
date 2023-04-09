/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */
module.exports = {
  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,

  // An array of file extensions your modules use
  moduleFileExtensions: [
    'js',
    'ts'
  ],

  // The root directory that Jest should scan for tests and modules within
  rootDir: 'tests',

  // The glob patterns Jest uses to detect test files
  testMatch: [ '**/*.test.ts' ],

  // A map from regular expressions to paths to transformers
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },

  // Indicates whether each individual test should be reported during the run
  verbose: true
};
