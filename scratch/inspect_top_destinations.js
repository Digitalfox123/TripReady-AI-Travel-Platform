import fs from 'fs';

const content = fs.readFileSync('src/data/index.js', 'utf8');
const lines = content.split('\n');

console.log("Searching for topDestinations declaration...");
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('export const topDestinations')) {
    console.log(`Found declaration at line ${i + 1}: ${lines[i]}`);
    // Print 50 lines starting from here
    for (let j = i; j < Math.min(lines.length, i + 50); j++) {
      console.log(`[${j + 1}] ${lines[j]}`);
    }
    break;
  }
}
