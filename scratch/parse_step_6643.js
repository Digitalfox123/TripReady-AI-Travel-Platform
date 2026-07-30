import fs from 'fs';

const text = fs.readFileSync('scratch/step_6643.txt', 'utf8');
const lines = text.split('\n');
console.log("Lines count of step 6643:", lines.length);
console.log("First 15 lines:");
lines.slice(0, 15).forEach((l, i) => console.log(`[${i + 1}] ${l}`));
console.log("Entire text search:");
lines.forEach((line, index) => {
  if (line.includes('export const features') || line.includes('export const travelCategories')) {
    console.log(`  Line ${index + 1}: ${line.trim()}`);
  }
});
