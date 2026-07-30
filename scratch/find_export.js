import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/pages/FullTripPlannerPage.jsx');
const content = fs.readFileSync(filePath, 'utf-8');
const lines = content.split('\n');

console.log("Total lines in file:", lines.length);

// Let's find the true end of the component.
// The file should end after the default export or the closing of FullTripPlannerPage component.
// Let's see: the last lines of the true component should end with the closing of FullTripPlannerPage component and export default.
// Let's search for "export default FullTripPlannerPage" or see what line it's on.

lines.forEach((line, index) => {
  if (line.includes('export default')) {
    console.log(`Export default found on line ${index + 1}: ${line}`);
  }
});
