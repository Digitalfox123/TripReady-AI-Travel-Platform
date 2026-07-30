import fs from 'fs';

const DATA_FILE = 'src/data/index.js';
const content = fs.readFileSync(DATA_FILE, 'utf8');

const arrayStart = content.indexOf('export const topDestinations = [');
let braceCount = 0;
let arrayEnd = -1;
for (let i = arrayStart + 'export const topDestinations = '.length; i < content.length; i++) {
  if (content[i] === '[') braceCount++;
  if (content[i] === ']') {
    braceCount--;
    if (braceCount === 0) {
      arrayEnd = i + 1;
      break;
    }
  }
}

const arrayStr = content.slice(arrayStart + 'export const topDestinations = '.length, arrayEnd);
fs.writeFileSync('scratch/temp_destinations.js', 'export const topDestinations = ' + arrayStr);

import('./temp_destinations.js').then((m) => {
  console.log(`Total topDestinations length: ${m.topDestinations.length}`);
  console.log(`First destination in topDestinations:`, m.topDestinations[0]);
  
  // Let's filter by country Pakistan
  const pak = m.topDestinations.filter(d => d.country === 'Pakistan');
  console.log(`Pakistan destinations in topDestinations:`, pak);
  
  // Let's print unique categories in topDestinations
  const cats = new Set();
  m.topDestinations.forEach(d => {
    if (d.categories) d.categories.forEach(c => cats.add(c));
    else if (d.category) cats.add(d.category);
  });
  console.log(`Unique categories in topDestinations:`, Array.from(cats));
  
  fs.unlinkSync('scratch/temp_destinations.js');
}).catch(err => {
  console.error(err);
});
