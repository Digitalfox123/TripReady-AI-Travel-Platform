import fs from 'fs';

const content = fs.readFileSync('C:\\Users\\hafiz\\.gemini\\antigravity\\brain\\8aea9138-58d5-4892-b520-33e32f04da5c\\walkthrough.md', 'utf8');
const lines = content.split('\n');

lines.forEach((line, index) => {
  if (line.includes('features') || line.includes('travelCategories')) {
    console.log(`[${index + 1}] ${line}`);
  }
});
