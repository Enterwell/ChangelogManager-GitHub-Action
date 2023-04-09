import { join } from 'path';
import { readFileSync, readdirSync } from 'fs';

/**
 * Prints the contents of the changelog and changes location passed to the task.
 *
 * @param changelogLocation Path to the directory where "Changelog.md" is located
 * @param changesLocation Path to the "changes" directory
 */
export const printContents = (changelogLocation: string, changesLocation: string) => {
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