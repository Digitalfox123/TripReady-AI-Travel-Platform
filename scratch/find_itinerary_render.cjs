const fs = require('fs');
const code = fs.readFileSync('src/pages/FullTripPlannerPage.jsx', 'utf8');

console.log('FullTripPlannerPage.jsx size:', code.length);

const lines = code.split('\n');
let matchCount = 0;
lines.forEach((line, idx) => {
  if (line.includes('itinerary') || line.includes('Itinerary') || line.includes('Day ') || line.includes('timeline')) {
    matchCount++;
    if (matchCount <= 40) {
      console.log(`Line ${idx + 1}: ${line.trim().slice(0, 100)}`);
    }
  }
});
console.log('Total matches:', matchCount);
