import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/pages/FullTripPlannerPage.jsx');
const content = fs.readFileSync(filePath, 'utf-8');
const lines = content.split('\n');

console.log("Original total lines:", lines.length);

// Keep only up to line 2885 (1-based index, so index 0 to 2884)
const trimmedLines = lines.slice(0, 2885);
console.log("Trimmed total lines:", trimmedLines.length);

fs.writeFileSync(filePath, trimmedLines.join('\n'), 'utf-8');
console.log("Successfully trimmed FullTripPlannerPage.jsx!");
