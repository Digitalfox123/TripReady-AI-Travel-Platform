const fs = require('fs');
const code = fs.readFileSync('src/pages/FullTripPlannerPage.jsx', 'utf8');
const lines = code.split('\n');

console.log('=== Imports ===');
for (let i = 0; i < 60; i++) {
  if (lines[i].includes('import')) {
    console.log(`${i + 1}: ${lines[i]}`);
  }
}

console.log('\n=== Component Definition ===');
lines.forEach((line, idx) => {
  if (line.includes('export default function') || line.includes('function FullTripPlannerPage')) {
    console.log(`${idx + 1}: ${line}`);
  }
});

console.log('\n=== DisplayItinerary Context ===');
for (let i = 2035; i < 2100; i++) {
  console.log(`${i + 1}: ${lines[i]}`);
}
