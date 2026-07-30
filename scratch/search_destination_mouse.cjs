const fs = require('fs');
const content = fs.readFileSync('src/pages/DestinationPage.jsx', 'utf8');

const lines = content.split('\n');
console.log("Searching for mouse and isHovered occurrences...");
lines.forEach((line, index) => {
  if (line.includes("mouse") || line.includes("isHovered")) {
    if (line.length < 150) {
      console.log(`Line ${index + 1}: ${line.trim()}`);
    }
  }
});
