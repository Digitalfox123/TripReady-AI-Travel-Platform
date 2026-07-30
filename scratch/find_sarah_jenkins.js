import fs from 'fs';
import readline from 'readline';

const fileStream = fs.createReadStream('C:\\Users\\hafiz\\.gemini\\antigravity\\brain\\8aea9138-58d5-4892-b520-33e32f04da5c\\.system_generated\\logs\\transcript.jsonl');

const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});

console.log("Searching for 'Sarah Jenkins' or 'featuredTestimonials' elements...");

let foundCount = 0;
for await (const line of rl) {
  if (line.includes('Marco Rossi') && line.includes('Aisha Al-Rashid') && !line.includes('find_sarah_jenkins') && !line.includes('console.log')) {
    foundCount++;
    console.log(`Match ${foundCount}: Length = ${line.length}`);
    const idx = line.indexOf('Marco Rossi');
    console.log("Snippet:", line.substring(Math.max(0, idx - 1000), Math.min(line.length, idx + 1000)));
    console.log("-----------------------------------------");
    if (foundCount >= 5) break;
  }
}
