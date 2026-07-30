import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/pages/DestinationPage.jsx');
const content = fs.readFileSync(filePath, 'utf-8');
const lines = content.split('\n');

const variables = ['fromCurrency', 'toCurrency', 'convertedAmount', 'getRate', 'currencies', 'fromAmount'];

variables.forEach(v => {
  console.log(`\n=== Matches for "${v}" ===`);
  lines.forEach((line, index) => {
    if (line.includes(v)) {
      console.log(`Line ${index + 1}: ${line.trim()}`);
    }
  });
});
