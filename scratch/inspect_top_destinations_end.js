import fs from 'fs';

const content = fs.readFileSync('src/data/index.js', 'utf8');
const lines = content.split('\n');

console.log("Total lines:", lines.length);

// Print the last 40 lines of index.js
console.log("Last 40 lines of index.js:");
for (let i = Math.max(0, lines.length - 40); i < lines.length; i++) {
  console.log(`[${i + 1}] ${lines[i]}`);
}
