import fs from 'fs';
import readline from 'readline';

const fileStream = fs.createReadStream('C:\\Users\\hafiz\\.gemini\\antigravity\\brain\\8aea9138-58d5-4892-b520-33e32f04da5c\\.system_generated\\logs\\transcript.jsonl');

const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});

console.log("Searching for full export content in transcript.jsonl...");

let foundCount = 0;
for await (const line of rl) {
  // Let's find a line that contains the definition of export const travelCategories or features
  // We want to find a line from MODEL source where the full file or these specific arrays were written/printed.
  if (line.includes('export const travelCategories') && line.includes('export const features') && line.includes('export const featuredTestimonials') && line.length > 50000) {
    foundCount++;
    console.log(`Found a large file write step: Match ${foundCount}, Length: ${line.length}`);
    
    // Save this line to a temp file so we can inspect it or extract the variables!
    fs.writeFileSync(`scratch/backup_match_${foundCount}.txt`, line);
    console.log(`Saved scratch/backup_match_${foundCount}.txt`);
  }
}

console.log("Search finished.");
