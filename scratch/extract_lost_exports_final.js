import fs from 'fs';
import readline from 'readline';

const fileStream = fs.createReadStream('C:\\Users\\hafiz\\.gemini\\antigravity\\brain\\8aea9138-58d5-4892-b520-33e32f04da5c\\.system_generated\\logs\\transcript.jsonl');

const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});

console.log("Searching for the exact JS text for categories, features, and testimonials...");

let matchText = '';
for await (const line of rl) {
  // We want to find a model output or command result that has the full, untruncated arrays
  if (line.includes('export const travelCategories = [') && 
      line.includes('export const features = [') && 
      line.includes('export const featuredTestimonials = [') && 
      line.includes('export const scrollingTestimonials = [')) {
    
    console.log(`Found complete candidate block! Line length: ${line.length}`);
    matchText = line;
    // Don't break, let's get the latest one!
  }
}

if (matchText) {
  fs.writeFileSync('scratch/found_match_raw.txt', matchText);
  console.log("Saved raw match to scratch/found_match_raw.txt");
  
  // Let's do some regex extraction of the variables!
  const getArray = (varName) => {
    const pattern = new RegExp(`export const ${varName} = \\s*\\[([\\s\\S]*?)\\];`);
    const m = matchText.match(pattern);
    if (m) {
      return `export const ${varName} = [${m[1]}];`;
    }
    // Try clean escaping
    const patternEsc = new RegExp(`export const ${varName} = \\\\\\[([\\\\s\\\\S]*?)\\\\\\];`);
    const mEsc = matchText.match(patternEsc);
    if (mEsc) {
      return `export const ${varName} = [${mEsc[1]}];`;
    }
    return `// Could not extract ${varName}`;
  };
  
  console.log("Extracted travelCategories:", getArray('travelCategories').substring(0, 100));
  console.log("Extracted features:", getArray('features').substring(0, 100));
  console.log("Extracted featuredTestimonials:", getArray('featuredTestimonials').substring(0, 100));
  console.log("Extracted scrollingTestimonials:", getArray('scrollingTestimonials').substring(0, 100));
} else {
  console.log("No complete untruncated block found containing all four exports.");
}
