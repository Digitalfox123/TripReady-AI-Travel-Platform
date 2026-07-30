import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      if (f !== 'node_modules' && f !== '.git' && f !== 'dist') {
        walkDir(dirPath, callback);
      }
    } else {
      callback(dirPath);
    }
  });
}

console.log("Searching for references to 'sahara' or 'dubai-desert' in source code...");
walkDir('src', filePath => {
  if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    if (fileContent.includes('sahara') || fileContent.includes('dubai-desert')) {
      console.log(`Found in: ${filePath}`);
    }
  }
});
