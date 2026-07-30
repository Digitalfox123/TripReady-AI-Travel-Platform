import fs from 'fs';

const files = [
  'C:\\Users\\hafiz\\.gemini\\antigravity\\brain\\8aea9138-58d5-4892-b520-33e32f04da5c\\walkthrough.md',
  'C:\\Users\\hafiz\\.gemini\\antigravity\\brain\\8aea9138-58d5-4892-b520-33e32f04da5c\\implementation_plan.md'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    console.log(`=== File: ${file} ===`);
    const searchTerms = ['features', 'travelCategories', 'featuredTestimonials', 'scrollingTestimonials'];
    searchTerms.forEach(term => {
      if (content.includes(term)) {
        console.log(`- Contains "${term}"`);
      }
    });
  }
});
