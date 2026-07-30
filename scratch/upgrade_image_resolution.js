import fs from 'fs';
import path from 'path';

const PROJECT_DIR = 'C:\\Users\\hafiz\\.gemini\\antigravity\\scratch\\trip-ready';

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

console.log("Upgrading image resolution parameters from w=800 and w=1000 to w=1200 globally...");

let count = 0;
walkDir(path.join(PROJECT_DIR, 'src'), (filePath) => {
  if (filePath.endsWith('.js') || filePath.endsWith('.jsx') || filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    if (content.includes('w=800')) {
      content = content.replaceAll('w=800', 'w=1200');
      changed = true;
    }
    if (content.includes('w=1000')) {
      content = content.replaceAll('w=1000', 'w=1200');
      changed = true;
    }
    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Upgraded: ${path.basename(filePath)}`);
      count++;
    }
  }
});

console.log(`Completed. Upgraded resolution parameters in ${count} files.`);
