import { join } from 'path';

import { mkdirSync, removeSync } from 'fs-extra';

import { createAndFillChanges, createChangelogFile, runActionAsync } from '../src/helpers/testHelpers';

// Path to the temporary test folder structure used in our test suite.
const testRoot = join(__dirname, 'test_structure');

/**
 * Mege Changelog Test Suite.
 */
describe('Merge Changelog Test Suite', () => {
  /**
   * Runs before each invididual test in our suite.
   */
  beforeEach(() => mkdirSync(testRoot));

  /**
   * Runs after each invidivual test in our suite.
   */
  afterEach(() => removeSync(testRoot));

  /**
   * Tests with invalid inputs.
   */
  describe('invalid inputs', () => {
    /**
     * Tests that the task fails when invalid changelog location is passed in.
     */
    it('should fail if input changelog location is invalid', async () => {
      // Arrange 
      createAndFillChanges(testRoot);
      createChangelogFile(testRoot);

      // Act
      const result = await runActionAsync('1.2.0', 'something that\'s invalid', false, testRoot);

      // Assert
      expect(result).not.toBeNull();
      expect(result.exitCode).toBe(1);
      expect(result.executableOutput).toContain('Error occurred while reading changelog directory');
    });

    /**
     * Tests that the task fails when invalid changes location is passed in.
     */
    it('should fail if input changes location is invalid', async () => {
      // Arrange 
      createAndFillChanges(testRoot);
      createChangelogFile(testRoot);

      // Act
      const result = await runActionAsync('1.2.0', testRoot, true, 'something that\'s invalid');

      // Assert
      expect(result).not.toBeNull();
      expect(result.exitCode).toBe(1);
      expect(result.executableOutput).toContain('Pass in correct location for the change files');
    });

    /**
     * Tests that the task fails when cahnges location is an empty string
     */
    it('should fail if input changes location is an empty string', async () => {
      // Arrange 
      createAndFillChanges(testRoot);
      createChangelogFile(testRoot);

      // Act
      const result = await runActionAsync('1.2.0', testRoot, true, '');

      // Assert
      expect(result).not.toBeNull();
      expect(result.exitCode).toBe(1);
      expect(result.executableOutput).toContain('Input required and not supplied: changes-location');
    });

    /**
     * Tests that the task fails when invalid semantic version is passed in
     */
    it('should fail if input semantic version is not in the correct format', async () => {
      // Arrange 
      createAndFillChanges(testRoot);
      createChangelogFile(testRoot);

      // Act
      const result = await runActionAsync('1.2', testRoot, false, testRoot);

      // Assert
      expect(result).not.toBeNull();
      expect(result.exitCode).toBe(1);
      expect(result.executableOutput).toContain('Error occurred while running the executable');
    }, 10000);
  })

  /**
   * Tests with valid inputs.
   */
  describe('valid inputs', () => {
    /**
     * Tests that the task fails when valid inputs are passed in but the changelog file does not exist.
     */
    it('should fail if changelog.md does not exist', async () => {
      // Arrange 
      createAndFillChanges(testRoot);

      // Act
      const result = await runActionAsync('1.2.0', testRoot, false, testRoot);

      // Assert
      expect(result).not.toBeNull();
      expect(result.exitCode).toBe(1);
      expect(result.executableOutput).toContain('Error occurred while reading changelog file');
    });

    /**
     * Tests that the task fails when valid inputs are passed in but the changes directory does not exist.
     */
    it('should fail if changes directory does not exist', async () => {
      // Arrange 
      createChangelogFile(testRoot);

      // Act
      const result = await runActionAsync('1.2.0', testRoot, false, testRoot);

      // Assert
      expect(result).not.toBeNull();
      expect(result.exitCode).toBe(1);
      expect(result.executableOutput).toContain('Error occurred while reading changes directory');
    });

    /**
     * Tests that the task succeeds when valid inputs are passed in and everything exists.
     */
    it('should succeed when everything is at its place', async () => {
      // Arrange
      createAndFillChanges(testRoot);
      createChangelogFile(testRoot);

      // Act
      const result = await runActionAsync('1.2.0', testRoot, false, testRoot);

      // Assert
      expect(result).not.toBeNull();
      expect(result.exitCode).toBe(0);
      expect(result.executableOutput).not.toContain('::error');
    }, 15000)
  });
});


