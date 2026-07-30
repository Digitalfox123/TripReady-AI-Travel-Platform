const fs = require('fs');
const path = require('path');
const file = path.resolve(__dirname, '../src/data/index.js');
const content = fs.readFileSync(file, 'utf8');

console.log('Index.js length:', content.length);

// Let's find some occurrences of Paris or Montreal or Notre
const lines = content.split('\n');
let foundNotreCount = 0;
lines.forEach((line, idx) => {
  if (line.includes('Notre') || line.includes('Notre-Dame') || line.includes('Champs-Elys') || line.includes('Champs-Élys')) {
    foundNotreCount++;
    if (foundNotreCount <= 20) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  }
});
console.log('Total Notre occurrences in index.js:', foundNotreCount);
