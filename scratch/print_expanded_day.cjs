const fs = require('fs');
const code = fs.readFileSync('src/pages/FullTripPlannerPage.jsx', 'utf8');
const lines = code.split('\n');

for (let i = 3270; i < 3360 && i < lines.length; i++) {
  console.log(`${i + 1}: ${lines[i]}`);
}
