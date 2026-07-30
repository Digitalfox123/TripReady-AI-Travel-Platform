import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/pages/FullTripPlannerPage.jsx');
const content = fs.readFileSync(filePath, 'utf-8');
const lines = content.split('\n');

lines.forEach((line, index) => {
  if (line.includes('displayTransitApps') || line.includes('transportApps') || line.includes('getTransportDataForDest')) {
    console.log(`Line ${index + 1}: ${line.trim()}`);
  }
});
