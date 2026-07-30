import fs from 'fs';
import readline from 'readline';

const fileStream = fs.createReadStream('C:\\Users\\hafiz\\.gemini\\antigravity\\brain\\8aea9138-58d5-4892-b520-33e32f04da5c\\.system_generated\\logs\\transcript.jsonl');

const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});

console.log("Searching for full arrays of travelCategories, features, featuredTestimonials, scrollingTestimonials with clean filtering...");

let travelCategoriesText = '';
let featuresText = '';
let featuredTestimonialsText = '';
let scrollingTestimonialsText = '';

for await (const line of rl) {
  // Ignore lines that are part of our inspection scripts
  if (line.includes('extract_lost_exports_direct') || 
      line.includes('restore_lost_exports') || 
      line.includes('inspect_backup') || 
      line.includes('find_features_full') || 
      line.includes('search_all_sizes') || 
      line.includes('extract_from_match_4') || 
      line.includes('parse_step_files') || 
      line.includes('inspect_previous_scripts') || 
      line.includes('inspect_walkthrough') ||
      line.includes('line.includes(')) {
    continue;
  }
  
  // Let's search for travelCategories array
  if (line.includes('export const travelCategories = [')) {
    const idx = line.indexOf('export const travelCategories = [');
    const endIdx = line.indexOf('];', idx);
    if (endIdx !== -1 && endIdx - idx < 5000) {
      const match = line.substring(idx, endIdx + 2);
      if (!match.includes('line.includes')) {
        travelCategoriesText = match;
      }
    }
  }
  
  // Let's search for features array
  if (line.includes('export const features = [')) {
    const idx = line.indexOf('export const features = [');
    const endIdx = line.indexOf('];', idx);
    if (endIdx !== -1 && endIdx - idx < 5000) {
      const match = line.substring(idx, endIdx + 2);
      if (!match.includes('line.includes')) {
        featuresText = match;
      }
    }
  }

  // Let's search for featuredTestimonials array
  if (line.includes('export const featuredTestimonials = [')) {
    const idx = line.indexOf('export const featuredTestimonials = [');
    const endIdx = line.indexOf('];', idx);
    if (endIdx !== -1 && endIdx - idx < 5000) {
      const match = line.substring(idx, endIdx + 2);
      if (!match.includes('line.includes')) {
        featuredTestimonialsText = match;
      }
    }
  }

  // Let's search for scrollingTestimonials array
  if (line.includes('export const scrollingTestimonials = [')) {
    const idx = line.indexOf('export const scrollingTestimonials = [');
    const endIdx = line.indexOf('];', idx);
    if (endIdx !== -1 && endIdx - idx < 5000) {
      const match = line.substring(idx, endIdx + 2);
      if (!match.includes('line.includes')) {
        scrollingTestimonialsText = match;
      }
    }
  }
}

console.log("Results:");
console.log("travelCategories found:", travelCategoriesText ? 'YES' : 'NO', travelCategoriesText.substring(0, 100));
console.log("features found:", featuresText ? 'YES' : 'NO', featuresText.substring(0, 100));
console.log("featuredTestimonials found:", featuredTestimonialsText ? 'YES' : 'NO', featuredTestimonialsText.substring(0, 100));
console.log("scrollingTestimonials found:", scrollingTestimonialsText ? 'YES' : 'NO', scrollingTestimonialsText.substring(0, 100));

if (travelCategoriesText && featuresText && featuredTestimonialsText && scrollingTestimonialsText) {
  const result = `
// ============================================
// RESTORED EXPORTS
// ============================================

${travelCategoriesText}

${featuresText}

${featuredTestimonialsText}

${scrollingTestimonialsText}
`;
  fs.writeFileSync('scratch/restored_exports.js', result);
  console.log("Saved scratch/restored_exports.js!");
}
