import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/pages/DestinationPage.jsx');
const content = fs.readFileSync(filePath, 'utf-8');
const lines = content.split('\n');

const functionsToFind = [
  'getDynamicAlerts',
  'getDynamicMedicalDirectory',
  'getTransportDataForDest',
  'handleTranslationSubmit',
  'isCountryDestination',
  'currency'
];

functionsToFind.forEach(fn => {
  console.log(`\n=== Matches for "${fn}" ===`);
  lines.forEach((line, index) => {
    if (line.includes(fn)) {
      console.log(`Line ${index + 1}: ${line.trim()}`);
    }
  });
});
