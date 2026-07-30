import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/pages/DestinationPage.jsx');
const content = fs.readFileSync(filePath, 'utf-8');
const lines = content.split('\n');

lines.forEach((line, index) => {
  if (line.includes('getDynamicAlerts')) {
    console.log(`Line ${index + 1}: ${line.trim()}`);
  }
});
