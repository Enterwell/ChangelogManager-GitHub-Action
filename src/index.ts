import { join } from 'path';
import { execFileSync, spawnSync } from 'child_process';

import { chmodSync } from 'fs-extra';
import { getInput, setFailed, setOutput } from '@actions/core';

import { printContents } from './helpers/actionHelpers';

/**
 * Action entry point.
 */
async function run() {
  try {
    // Action inputs
    const changelogLocation = getInput('changelog-location');
    const differentLocation = getInput('changes-in-different-location') === 'true';
    let changesLocation: string;
    const shouldBumpVersion = getInput('should-bump-version') === 'true';
    const pathToProjectFile = getInput('path-to-project-file');

    if (!differentLocation) {
      changesLocation = join(changelogLocation, 'changes');
    } else {
      changesLocation = getInput('changes-location', { required: true });
    }

    // Log the received inputs
    console.log(`Using changelog location: ${changelogLocation}`);
    console.log(`Using different location for 'changes' directory: ${differentLocation}`);
    console.log(`Using changes location: ${changesLocation}`);
    console.log(`Should bump version: ${shouldBumpVersion}`);
    console.log(`Using path to the project file: ${pathToProjectFile}`);

    if (!changesLocation.endsWith('changes')) {
      throw new Error('Pass in correct location for the change files');
    }

    // Action execution
    console.log('=============================================BEFORE EXECUTION=============================================');
    printContents(changelogLocation, changesLocation);

    // Run the executable
    try {
      const setVersionProjectFilePath = pathToProjectFile !== '' ? `:${pathToProjectFile}` : '';
      const setVersionOption = shouldBumpVersion ? `-sv${setVersionProjectFilePath}` : null;

      let fileToRunPath: string;
      let newlyBumpedVersion: string;

      // If on windows VM
      if (process.platform === 'win32') {
        fileToRunPath = join(__dirname, 'clm.exe');

        if (setVersionOption == null) {
          newlyBumpedVersion = execFileSync(fileToRunPath, [changelogLocation, changesLocation], { encoding: 'utf-8' });
        } else {
          newlyBumpedVersion = execFileSync(fileToRunPath, [changelogLocation, changesLocation, setVersionOption], { encoding: 'utf-8' });
        }
      } else {
        fileToRunPath = join(__dirname, 'clm');
        chmodSync(fileToRunPath, 0o777);

        if (setVersionOption == null) {
          newlyBumpedVersion = spawnSync(fileToRunPath, [changelogLocation, changesLocation], { encoding: 'utf-8' }).stdout;
        } else {
          newlyBumpedVersion = spawnSync(fileToRunPath, [changelogLocation, changesLocation, setVersionOption], { encoding: 'utf-8' }).stdout;
        }
      }
      
      console.log('=============================================AFTER EXECUTION=============================================');

      newlyBumpedVersion = newlyBumpedVersion.trim();
      console.log(`Newly bumped version got from the executable: ${newlyBumpedVersion}`);

      if (!(/\d+.\d+.\d+/.test(newlyBumpedVersion))) {
        throw new Error('Executable output is not in the correct format.');
      }

      // Set output variable
      setOutput('bumped-semantic-version', newlyBumpedVersion);
    } catch (error) {
      throw new Error(`Error occurred while running the executable.\n${error}`);
    }

    printContents(changelogLocation, changesLocation);
  } catch (error) {
    if (error instanceof Error) setFailed(error.message);
  }
}

run();