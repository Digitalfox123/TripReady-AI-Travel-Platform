import fs from 'fs';

const content = fs.readFileSync('src/data/index.js', 'utf8');
const lines = content.split('\n');

const searchTerms = ['annapurna-massif', 'the-dolomites', 'mount-aconcagua'];

searchTerms.forEach(term => {
  console.log(`Searching for "${term}":`);
  lines.forEach((line, index) => {
    if (line.includes(term)) {
      console.log(`  Line ${index + 1}: ${line.trim()}`);
      // Print surrounding lines
      for (let i = Math.max(0, index - 2); i <= Math.min(lines.length - 1, index + 10); i++) {
        console.log(`    [${i + 1}] ${lines[i]}`);
      }
    }
  });
});
