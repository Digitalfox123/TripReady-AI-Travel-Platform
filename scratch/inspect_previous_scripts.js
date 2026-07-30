import fs from 'fs';

const files = [
  'C:\\Users\\hafiz\\.gemini\\antigravity\\brain\\8aea9138-58d5-4892-b520-33e32f04da5c\\scratch\\update_database_nature.js',
  'C:\\Users\\hafiz\\.gemini\\antigravity\\brain\\8aea9138-58d5-4892-b520-33e32f04da5c\\scratch\\update_database_mountains.js'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    console.log(`=== File: ${file} ===`);
    
    // Look for features, travelCategories, featuredTestimonials, scrollingTestimonials exports
    const searchTerms = [
      'export const features',
      'export const travelCategories',
      'export const featuredTestimonials',
      'export const scrollingTestimonials'
    ];
    
    searchTerms.forEach(term => {
      const idx = content.indexOf(term);
      if (idx !== -1) {
        console.log(`- Found "${term}" at index ${idx}`);
        // Let's print out 2000 characters from the match
        console.log("Snippet:");
        console.log(content.substring(idx, idx + 2000));
        console.log("-----------------------------------------");
      } else {
        console.log(`- "${term}" not found`);
      }
    });
  } else {
    console.log(`File not found: ${file}`);
  }
});
