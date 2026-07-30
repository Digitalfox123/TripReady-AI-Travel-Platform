const fs = require('fs');
const code = fs.readFileSync('src/pages/FullTripPlannerPage.jsx', 'utf8');

const lines = code.split('\n');
let matchCount = 0;
lines.forEach((line, idx) => {
  if (line.includes('displayItinerary')) {
    matchCount++;
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
