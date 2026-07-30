const fs = require('fs');
const code = fs.readFileSync('src/pages/FullTripPlannerPage.jsx', 'utf8');
const lines = code.split('\n');

for (let i = 679; i < 750; i++) {
  console.log(`${i + 1}: ${lines[i]}`);
}
