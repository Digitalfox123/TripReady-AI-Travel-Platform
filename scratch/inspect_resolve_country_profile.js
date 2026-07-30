import fs from 'fs';

const content = fs.readFileSync('src/pages/CountryExplorerPage.jsx', 'utf8');
const lines = content.split('\n');

console.log("Searching for resolveCountryProfile declaration...");
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('resolveCountryProfile')) {
    console.log(`Found declaration at line ${i + 1}: ${lines[i]}`);
    // Print 80 lines starting from 15 lines before
    const start = Math.max(0, i - 15);
    const end = Math.min(lines.length, i + 80);
    for (let j = start; j < end; j++) {
      console.log(`[${j + 1}] ${lines[j]}`);
    }
    break;
  }
}
