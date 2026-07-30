import fs from 'fs';
import readline from 'readline';

const fileStream = fs.createReadStream('C:\\Users\\hafiz\\.gemini\\antigravity\\brain\\8aea9138-58d5-4892-b520-33e32f04da5c\\.system_generated\\logs\\transcript.jsonl');

const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});

console.log("Listing line lengths in transcript.jsonl that contain 'travelCategories':");

let count = 0;
for await (const line of rl) {
  if (line.includes('travelCategories')) {
    count++;
    console.log(`Match ${count}: Length = ${line.length}, starts with: ${line.substring(0, 150)}`);
  }
}
