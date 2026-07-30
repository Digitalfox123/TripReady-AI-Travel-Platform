import fs from 'fs';

const logPath = 'C:\\Users\\hafiz\\.gemini\\antigravity\\brain\\cfde45ab-22d0-4261-bac1-e4c10f2a746d\\.system_generated\\tasks\\task-4122.log';
const content = fs.readFileSync(logPath, 'utf8');

// Find all supported categories listed in the error message
const match = content.match(/The supported categories are: ([^}]+)/);
if (match) {
  const cats = match[1].split(',').map(c => c.trim().replace(/'/g, '').replace(/"/g, ''));
  console.log('Total categories available:', cats.length);
  
  const searchTerms = ['museum', 'landmark', 'viewpoint', 'zoo', 'amusement', 'castle', 'monument', 'park', 'attraction', 'heritage', 'beach'];
  for (const term of searchTerms) {
    const matched = cats.filter(c => c.includes(term));
    console.log(`Matching "${term}":`, matched);
  }
} else {
  console.log('Could not parse supported categories');
}
