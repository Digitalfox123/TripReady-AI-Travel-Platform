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
  const skyscrapers = m.topDestinations.filter(d => d.categoryIds && d.categoryIds.includes('skyscrapers'));
  console.log(`Found ${skyscrapers.length} skyscrapers.`);
  skyscrapers.forEach(d => {
    console.log(`- ${d.name} (${d.country}): ${d.image}`);
  });
  
  fs.unlinkSync('scratch/temp_destinations.js');
}).catch(err => {
  console.error(err);
});
