const fs = require('fs');
const code = fs.readFileSync('src/pages/FullTripPlannerPage.jsx', 'utf8');
const lines = code.split('\n');

function printRange(start, end) {
  console.log(`=== Lines ${start} - ${end} ===`);
  for (let i = start - 1; i < end && i < lines.length; i++) {
    console.log(`${i + 1}: ${lines[i]}`);
  }
}

printRange(3225, 3275);
printRange(4435, 4475);
