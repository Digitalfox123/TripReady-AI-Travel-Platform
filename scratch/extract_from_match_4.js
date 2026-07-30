import fs from 'fs';
import readline from 'readline';

const fileStream = fs.createReadStream('C:\\Users\\hafiz\\.gemini\\antigravity\\brain\\8aea9138-58d5-4892-b520-33e32f04da5c\\.system_generated\\logs\\transcript.jsonl');

const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});

console.log("Searching for the line of length 4237...");

for await (const line of rl) {
  if (line.length === 4237 && line.includes('travelCategories')) {
    console.log("Found line of length 4237!");
    fs.writeFileSync('scratch/match_4237.txt', line);
    console.log("Saved scratch/match_4237.txt");
    break;
  }
}
