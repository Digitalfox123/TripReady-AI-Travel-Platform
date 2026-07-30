const fs = require('fs');
const content = fs.readFileSync('src/pages/FullTripPlannerPage.jsx', 'utf8');

console.log("Searching for keywords inside FullTripPlannerPage.jsx...");
const lines = content.split('\n');
lines.forEach((line, index) => {
  if (line.includes("interest") || line.includes("theme") || line.includes("type") || line.includes("Category") || line.includes("Activity")) {
    if (line.length < 150) {
      console.log(`Line ${index + 1}: ${line.trim()}`);
    }
  }
});
