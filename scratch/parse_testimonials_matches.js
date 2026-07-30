import fs from 'fs';

const files = [
  'scratch/testimonials_match_1.txt',
  'scratch/testimonials_match_2.txt',
  'scratch/testimonials_match_3.txt',
  'scratch/testimonials_match_4.txt'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    const text = fs.readFileSync(f, 'utf8');
    console.log(`=== File: ${f} ===`);
    const lines = text.split('\n');
    console.log("Lines count:", lines.length);
    console.log("First 15 lines:");
    lines.slice(0, 15).forEach((l, i) => console.log(`[${i + 1}] ${l}`));
    
    // Look for featuredTestimonials
    lines.forEach((line, index) => {
      if (line.includes('export const featuredTestimonials') || line.includes('export const scrollingTestimonials')) {
        console.log(`  Line ${index + 1}: ${line.trim()}`);
        for (let i = index; i < Math.min(lines.length, index + 35); i++) {
          console.log(`    [${i + 1}] ${lines[i]}`);
        }
      }
    });
    console.log("-----------------------------------------");
  }
});
