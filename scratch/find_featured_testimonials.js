import fs from 'fs';
import readline from 'readline';

const fileStream = fs.createReadStream('C:\\Users\\hafiz\\.gemini\\antigravity\\brain\\8aea9138-58d5-4892-b520-33e32f04da5c\\.system_generated\\logs\\transcript.jsonl');

const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});

console.log("Searching for 'featuredTestimonials' in transcript...");

let matchCount = 0;
for await (const line of rl) {
  if (line.includes('featuredTestimonials') && 
      !line.includes('extract_lost_exports_direct') && 
      !line.includes('restore_lost_exports') && 
      !line.includes('inspect_backup') && 
      !line.includes('find_features_full') && 
      !line.includes('search_all_sizes') && 
      !line.includes('find_featured_testimonials') &&
      !line.includes('console.log')) {
    
    matchCount++;
    console.log(`Match ${matchCount}: Length = ${line.length}`);
    const idx = line.indexOf('export const featuredTestimonials');
    if (idx !== -1) {
      console.log("Snippet:", line.substring(idx, idx + 2000));
    } else {
      const idx2 = line.indexOf('featuredTestimonials');
      console.log("Snippet 2:", line.substring(idx2 - 100, idx2 + 1000));
    }
    console.log("-----------------------------------------");
    if (matchCount >= 10) break;
  }
}
