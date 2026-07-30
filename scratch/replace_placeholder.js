import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetDir = path.resolve(__dirname, '../src');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      results.push(filePath);
    }
  });
  return results;
}

function run() {
  console.log('Walking files in:', targetDir);
  const files = walk(targetDir);
  console.log(`Found ${files.length} JS/JSX files.`);

  let modifiedCount = 0;
  files.forEach((filePath) => {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('1488646953014-85cb44e25828')) {
      const updated = content.replaceAll('1488646953014-85cb44e25828', '1476514525535-07fb3b4ae5f1');
      fs.writeFileSync(filePath, updated, 'utf8');
      console.log('Modified:', path.relative(targetDir, filePath));
      modifiedCount++;
    }
  });

  console.log(`Replacement complete. Modified ${modifiedCount} files.`);
}

run();
