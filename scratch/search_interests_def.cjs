const fs = require('fs');
const content = fs.readFileSync('src/pages/FullTripPlannerPage.jsx', 'utf8');

const lines = content.split('\n');
let startLine = -1;
lines.forEach((line, index) => {
  if (line.includes("const INTEREST_ICONS =")) {
    startLine = index;
  }
});

if (startLine !== -1) {
  console.log(lines.slice(startLine, startLine + 20).join('\n'));
} else {
  console.log("INTEREST_ICONS definition not found");
}
