import { join } from 'path';

import { mkdirSync, writeFileSync } from 'fs-extra';
import { type ExecOptions, exec } from '@actions/exec';

/**
 * Creates directory 'changes' in our test folder and fills it with a few change files.
 * 
 * @param rootDir Root directory where the 'change' directory will be created
 */
export const createAndFillChanges = (rootDir: string) => {
  const changesPath = join(rootDir, 'changes');
  mkdirSync(changesPath);

  writeFileSync(join(changesPath, 'Added [FE       ] First Change'), '');
  writeFileSync(join(changesPath, 'Removed [      API      ] First Deletion'), '');
  writeFileSync(join(changesPath, 'Removed [API      ] First Deletion2'), '');
  writeFileSync(join(changesPath, 'Removed [API] First Deletion3'), '');
}

/**
 * Creates a changelog file and fills it with some initial data.
 * 
 * @param rootDir Root directory where the 'Changelog.md' will be created
 */
export const createChangelogFile = (rootDir: string) => {
  const changelogContent = 
    `# Changelog
All notable changes to this project will be documented in this file.
    
The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).
## [1.0.0] - 2018-08-13
### Changed
- Migrated from .NET Framework 4.5 to .NET Standard 2.0`;

  writeFileSync(join(rootDir, 'Changelog.md'), changelogContent);
}

/**
 * Runs the action.
 *
 * @param semanticVersion Input semantic version
 * @param changelogLocation Input changelog location
 * @param changesInDiffLocation Input changes in different locaiton
 * @param changesLocation Input changes location
 */
export const runActionAsync = async (semanticVersion: string, changelogLocation: string, changesInDiffLocation: boolean, changesLocation: string) => {
  let executableOutput = '';

  const executableOptions: ExecOptions = {
    listeners: {
      stdout: (data: Buffer) => executableOutput += data.toString()
    },
    cwd: join(__dirname, '../..', 'dist'),
    env: {
      'INPUT_SEMANTIC-VERSION': semanticVersion,
      'INPUT_CHANGELOG-LOCATION': changelogLocation,
      'INPUT_CHANGES-IN-DIFFERENT-LOCATION': `${changesInDiffLocation}`,
      'INPUT_CHANGES-LOCATION': changesLocation
    }
  };

  let exitCode: number;

  try {
    exitCode = await exec('node', ['index.js'], executableOptions);
  } catch (error) {
    exitCode = 1;
  }

  return {
    exitCode,
    executableOutput
  };
}