const fs = require('fs');
const content = fs.readFileSync('src/pages/FullTripPlannerPage.jsx', 'utf8');

const lines = content.split('\n');
let mainReturn = -1;
for (let i = 2300; i < lines.length; i++) {
  if (lines[i].includes("return (") && !lines[i].trim().startsWith("//") && !lines[i].trim().startsWith("/*")) {
    mainReturn = i;
    break;
  }
}

if (mainReturn !== -1) {
  console.log(`Found main return at line ${mainReturn + 1}`);
  console.log(lines.slice(mainReturn, mainReturn + 100).join('\n'));
} else {
  console.log("Main return not found after 2300");
}
