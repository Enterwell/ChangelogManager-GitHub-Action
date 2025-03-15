import { join } from 'path';
import { execFileSync, spawnSync } from 'child_process';

import { chmodSync } from 'fs-extra';
import { getInput, setFailed, setOutput } from '@actions/core';

import { getVersionFromString, printContents, removeVersionLine } from './helpers/actionHelpers';

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
      let newChangelogSection: string;

      // If on windows VM
      if (process.platform === 'win32') {
        fileToRunPath = join(__dirname, 'clm-win.exe');

        if (setVersionOption == null) {
          newChangelogSection = execFileSync(fileToRunPath, [changelogLocation, changesLocation], { encoding: 'utf-8' });
        } else {
          newChangelogSection = execFileSync(fileToRunPath, [changelogLocation, changesLocation, setVersionOption], { encoding: 'utf-8' });
        }
      } else {
        const fileName = `clm-${process.platform === 'darwin' ? 'osx' : 'linux'}`;

        fileToRunPath = join(__dirname, fileName);
        chmodSync(fileToRunPath, 0o777);

        let error: string;

        if (setVersionOption == null) {
          const result = spawnSync(fileToRunPath, [changelogLocation, changesLocation], { encoding: 'utf-8' });

          newChangelogSection = result.stdout;
          error = result.stderr;
        } else {
          const result = spawnSync(fileToRunPath, [changelogLocation, changesLocation, setVersionOption], { encoding: 'utf-8' });

          newChangelogSection = result.stdout;
          error = result.stderr;
        }

        if (error) {
          throw new Error(error);
        }
      }
      
      console.log('=============================================AFTER EXECUTION=============================================');
      console.log('New changelog section from the executable:');
      console.log(newChangelogSection ? newChangelogSection : '-');

      const newlyBumpedVersion = getVersionFromString(newChangelogSection);
      if (!newlyBumpedVersion) {
        throw new Error('Could not parse the new semantic version from the changelog section');
      }

      const versionParts = newlyBumpedVersion.split('.');
      if (versionParts.length !== 3) {
        throw new Error('Newly bumped semantic version is not in the correct format (MAJOR.MINOR.PATCH).');
      }

      const changes = removeVersionLine(newChangelogSection);

      // Set output variables
      setOutput('bumped-semantic-version', newlyBumpedVersion);
      setOutput('bumped-major-part', versionParts[0]);
      setOutput('bumped-minor-part', versionParts[1]);
      setOutput('bumped-patch-part', versionParts[2]);
      setOutput('new-changes', changes);
    } catch (error) {
      throw new Error(`Error occurred while running the executable.\n${error}`);
    }

    printContents(changelogLocation, changesLocation);
  } catch (error) {
    if (error instanceof Error) setFailed(error.message);
  }
}

run();