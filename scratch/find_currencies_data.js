import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/data/index.js');
if (!fs.existsSync(filePath)) {
  console.log("File not found");
  process.exit(1);
}
const content = fs.readFileSync(filePath, 'utf-8');
const lines = content.split('\n');

let startIndex = -1;
lines.forEach((line, index) => {
  if (line.includes('export const currencies')) {
    startIndex = index;
  }
});

if (startIndex !== -1) {
  console.log(`currencies found starting at line ${startIndex + 1}:`);
  for (let i = startIndex; i < startIndex + 50; i++) {
    if (lines[i]) console.log(lines[i]);
  }
} else {
  console.log("currencies not found");
}
