import fs from 'fs';

const content = fs.readFileSync('src/data/index.js', 'utf8');
const lines = content.split('\n');

console.log("Searching for 'sort' in index.js...");
lines.forEach((line, idx) => {
  if (line.includes('sort')) {
    console.log(`[Line ${idx + 1}] ${line.trim()}`);
  }
});
