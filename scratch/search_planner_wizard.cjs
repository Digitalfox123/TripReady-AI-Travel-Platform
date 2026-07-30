const fs = require('fs');
const content = fs.readFileSync('src/pages/FullTripPlannerPage.jsx', 'utf8');

const lines = content.split('\n');
console.log("Searching for state variables and wizard steps...");
lines.forEach((line, index) => {
  if (line.includes("const [") && (line.includes("step") || line.includes("tab") || line.includes("page"))) {
    if (line.length < 120) {
      console.log(`Line ${index + 1}: ${line.trim()}`);
    }
  }
  if (line.includes("<h1>") || line.includes("<h2>") || line.includes("<h3>")) {
    if (line.length < 125 && (line.includes("Plan") || line.includes("Wizard") || line.includes("Trip") || line.includes("Hub") || line.includes("Special"))) {
      console.log(`Line ${index + 1}: ${line.trim()}`);
    }
  }
});
