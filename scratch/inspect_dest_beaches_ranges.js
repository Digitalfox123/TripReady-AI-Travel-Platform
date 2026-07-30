import fs from 'fs';

const content = fs.readFileSync('src/data/index.js', 'utf8');
const lines = content.split('\n');

// Find where topDestinations array starts
const topDestinationsStartIndex = content.indexOf('export const topDestinations = [');
console.log("topDestinations starts at character index:", topDestinationsStartIndex);

// Let's write a script to find all items that have "beaches" in categoryIds
import { topDestinations } from '../src/data/index.js';

console.log("Analyzing each destination with categoryIds containing 'beaches':");
topDestinations.forEach((d, idx) => {
  if (d.categoryIds?.includes('beaches')) {
    // Find the line index of this item in the file
    const searchString = `"id": "${d.id}"`;
    const lineIndex = lines.findIndex(l => l.includes(searchString));
    console.log(`- Index in array: ${idx}, ID: ${d.id}, Line: ${lineIndex + 1}, Country: ${d.country}`);
  }
});
