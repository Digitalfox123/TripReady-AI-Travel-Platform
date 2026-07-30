import fs from 'fs';
import readline from 'readline';

const fileStream = fs.createReadStream('C:\\Users\\hafiz\\.gemini\\antigravity\\brain\\8aea9138-58d5-4892-b520-33e32f04da5c\\.system_generated\\logs\\transcript.jsonl');

const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});

console.log("Searching for 'export const features = [' in transcript.jsonl...");

let matchCount = 0;
for await (const line of rl) {
  if (line.includes('export const features = [')) {
    matchCount++;
    console.log(`Match ${matchCount}: Line length = ${line.length}`);
    const idx = line.indexOf('export const features = [');
    console.log("Snippet:", line.substring(idx, idx + 2000));
    console.log("-----------------------------------------");
    if (matchCount >= 5) break;
  }
}
