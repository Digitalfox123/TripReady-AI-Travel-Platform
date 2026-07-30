import fs from 'fs';
import path from 'path';

const files = [
  'src/pages/DestinationPage.jsx',
  'src/pages/FullTripPlannerPage.jsx'
];

const queries = ['translate', 'news', 'hospital', 'app', 'flight', 'budget', 'visa'];

files.forEach(file => {
  const filePath = path.resolve(file);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${file}`);
    return;
  }
  console.log(`\n=== Searching ${file} ===`);
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  lines.forEach((line, index) => {
    queries.forEach(query => {
      if (line.toLowerCase().includes(query.toLowerCase())) {
        console.log(`Line ${index + 1} [${query}]: ${line.trim().substring(0, 100)}`);
      }
    });
  });
});
