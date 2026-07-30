import fs from 'fs';

const file1 = fs.readFileSync('src/data/posts/best-budget-countries-2026.js', 'utf8');
const file2 = fs.readFileSync('src/data/posts/ai-vs-traditional-travel-planning.js', 'utf8');

// Function to count words in the content field of sections
function countWordsInPost(fileContent) {
  // Simple word count of the entire file
  const totalWords = fileContent.split(/\s+/).filter(w => w.length > 0).length;
  return totalWords;
}

console.log('Best Budget Countries Word Count:', countWordsInPost(file1));
console.log('AI vs Traditional Word Count:', countWordsInPost(file2));
