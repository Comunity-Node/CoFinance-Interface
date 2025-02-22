import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';

const patchFilePath = path.join(__dirname, 'patches', 'some-patch-file.patch');

fs.access(patchFilePath, fs.constants.F_OK, (err) => {
  if (err) {
    console.log(`Patch file not found at ${patchFilePath}. Skipping patch...`);
  } else {
    console.log(`Patch file found. Applying patch...`);
    exec('npx patch-package', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error applying patch: ${stderr}`);
        process.exit(1);
      } else {
        console.log(`Patch applied successfully: ${stdout}`);
      }
    });
  }
});
