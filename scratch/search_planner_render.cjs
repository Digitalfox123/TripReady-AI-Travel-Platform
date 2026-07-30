const fs = require('fs');
const content = fs.readFileSync('src/pages/FullTripPlannerPage.jsx', 'utf8');

const lines = content.split('\n');
let returnLine = -1;
lines.forEach((line, index) => {
  if (line.includes("export default function FullTripPlannerPage") || line.includes("return (") && index > 2300 && returnLine === -1) {
    returnLine = index;
  }
});

// Let's find return ( inside the main component
let mainCompIndex = -1;
lines.forEach((line, index) => {
  if (line.includes("export default function FullTripPlannerPage")) {
    mainCompIndex = index;
  }
});

if (mainCompIndex !== -1) {
  let searchIdx = mainCompIndex;
  while (searchIdx < lines.length) {
    if (lines[searchIdx].trim().startsWith("return (")) {
      returnLine = searchIdx;
      break;
    }
    searchIdx++;
  }
}

if (returnLine !== -1) {
  console.log(`Found main return at line ${returnLine + 1}`);
  console.log(lines.slice(returnLine, returnLine + 70).join('\n'));
} else {
  console.log("Main return not found");
}
