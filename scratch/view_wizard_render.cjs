const fs = require('fs');
const content = fs.readFileSync('src/pages/FullTripPlannerPage.jsx', 'utf8');

const lines = content.split('\n');
let foundLine = -1;
lines.forEach((line, index) => {
  if (line.includes("onboardingFormSubstep") && line.includes("===")) {
    console.log(`Line ${index + 1}: ${line.trim()}`);
  }
});
