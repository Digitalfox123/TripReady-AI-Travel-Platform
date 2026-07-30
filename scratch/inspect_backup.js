import fs from 'fs';
import readline from 'readline';

const fileStream = fs.createReadStream('C:\\Users\\hafiz\\.gemini\\antigravity\\brain\\8aea9138-58d5-4892-b520-33e32f04da5c\\.system_generated\\logs\\transcript.jsonl');

const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});

console.log("Searching for 'export const features' or 'export const travelCategories' in transcript.jsonl...");

let foundCount = 0;
for await (const line of rl) {
  if (line.includes('export const features') || line.includes('export const travelCategories')) {
    foundCount++;
    console.log(`Match ${foundCount} found! Line length: ${line.length}`);
    // Print a small snippet around the match
    const idx = line.indexOf('export const features');
    if (idx !== -1) {
      console.log("Snippet:", line.substring(Math.max(0, idx - 100), Math.min(line.length, idx + 1000)));
    }
    const idx2 = line.indexOf('export const travelCategories');
    if (idx2 !== -1) {
      console.log("Snippet 2:", line.substring(Math.max(0, idx2 - 100), Math.min(line.length, idx2 + 1000)));
    }
  }
}

console.log("Search finished.");
