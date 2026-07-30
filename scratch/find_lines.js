const fs = require('fs');
const content = fs.readFileSync('C:/Users/hafiz/.gemini/antigravity/scratch/trip-ready/src/pages/DestinationPage.jsx', 'utf8');
const query = 'useGeoapifyTravel';
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes(query)) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
