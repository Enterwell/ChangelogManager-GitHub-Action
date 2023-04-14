import { join } from 'path';
import { readFileSync, readdirSync } from 'fs';

/**
 * Prints the contents of the changelog and changes location passed to the task.
 *
 * @param changelogLocation Path to the directory where "Changelog.md" is located
 * @param changesLocation Path to the "changes" directory
 */
export function printContents(changelogLocation: string, changesLocation: string) {
  let changelogName = 'changelog.md';
  
  // Print the contents of the directory that should contain "Changelog.md"
  try {
    const folderFiles = readdirSync(changelogLocation, { encoding: 'utf-8' });

    console.log('=======FOLDER CONTENTS=======');
    folderFiles.forEach((file) => {
      if (file.toLowerCase() === changelogName) {
        changelogName = file;
      }

      console.log(file);
    });

  } catch (error) {
    throw new Error(`Error occurred while reading changelog directory.\n${error}`);
  }

  // Print the contents of the "changes" directory
  try {
    const changeFiles = readdirSync(changesLocation, { encoding: 'utf-8' });

    console.log('=======CHANGES CONTENTS=======');
    changeFiles.forEach((file) => console.log(file));
  } catch (error) {
    throw new Error(`Error occurred while reading changes directory.\n${error}`);
  }

  const changelogPath = join(changelogLocation, changelogName);
  
  // Print the changelog.md content
  try {
    const changelogFile = readFileSync(changelogPath, { encoding: 'utf-8' });

    console.log('=======CHANGELOG.MD=======');
    console.log(changelogFile);
  } catch (error) {
    throw new Error(`Error occurred while reading changelog file.\n${error}`);
  }
}

/**
 * Gets the semantic version from a changelog section by using regex.
 *
 * @param input Changelog section
 */
export function getVersionFromString(input: string) {
  const regex = /(?:\[)(\d+\.\d+\.\d+)(?:\])/;
  const match = input.match(regex);

  return match ? match[1] : null;
}

/**
 * Removes the first header line from a changelog section to get changes.
 *
 * @param input Changelog section
 */
export function removeVersionLine(input: string) {
  const lines = input.split('\n');
  lines.shift();

  return lines.join('\n');
}