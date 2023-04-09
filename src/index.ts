import { join } from 'path';
import { execFileSync } from 'child_process';

import { getInput, setFailed } from '@actions/core';

import { printContents } from './helpers/actionHelpers';

/**
 * Action entry point.
 */
async function run() {
  try {
    // Action inputs
    const semanticVersion = getInput('semantic-version', { required: true });
    const changelogLocation = getInput('changelog-location');
    const differentLocation = getInput('changes-in-different-location') === 'true';
    let changesLocation: string;

    if (!differentLocation) {
      changesLocation = join(changelogLocation, 'changes');
    } else {
      changesLocation = getInput('changes-location', { required: true });
    }

    // Log the received inputs
    console.log(`Using semantic version: ${semanticVersion}`);
    console.log(`Using changelog location: ${changelogLocation}`);
    console.log(`Using different location for 'changes' directory: ${differentLocation}`);
    console.log(`Using changes location: ${changesLocation}`);

    if (!changesLocation.endsWith('changes')) {
      throw new Error('Pass in correct location for the change files');
    }

    // Action execution
    console.log('=============================================BEFORE EXECUTION=============================================');
    printContents(changelogLocation, changesLocation);

    // Run the executable
    const executablePath = join(__dirname, 'clm.exe');

    try {
      const executableOutput = execFileSync(executablePath, [semanticVersion, changelogLocation, changesLocation], { encoding: 'utf-8' });

      console.log('=======EXECUTABLE OUTPUT=======');
      console.log(executableOutput);
    } catch (error) {
      throw new Error(`Error occurred while running the executable.\n${error}`);
    }

    console.log('=============================================AFTER EXECUTION=============================================');
    printContents(changelogLocation, changesLocation);
  } catch (error) {
    if (error instanceof Error) setFailed(error.message);
  }
}

run();