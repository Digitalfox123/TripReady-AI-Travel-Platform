import fs from 'fs';
import readline from 'readline';

const fileStream = fs.createReadStream('C:\\Users\\hafiz\\.gemini\\antigravity\\brain\\8aea9138-58d5-4892-b520-33e32f04da5c\\.system_generated\\logs\\transcript.jsonl');

const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});

console.log("Searching for 'export const travelCategories' occurrences...");

let matchCount = 0;
for await (const line of rl) {
  if (line.includes('export const travelCategories = [')) {
    matchCount++;
    console.log(`Match ${matchCount}: Line length = ${line.length}`);
    // Let's print the first 2000 characters from the match index
    const idx = line.indexOf('export const travelCategories = [');
    console.log("Snippet:", line.substring(idx, idx + 3000));
    console.log("-----------------------------------------");
    if (matchCount >= 5) break;
  }
}
