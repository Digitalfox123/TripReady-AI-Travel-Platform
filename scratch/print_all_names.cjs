const { attractionKnowledgeBase } = require('../src/data/attractionKnowledgeBase.js');
const fs = require('fs');

let output = '';
for (const citySlug in attractionKnowledgeBase) {
  output += `\nCity: ${citySlug}\n`;
  const attractions = attractionKnowledgeBase[citySlug];
  attractions.forEach((spot, idx) => {
    output += `  ${idx + 1}. "${spot.name}"\n`;
  });
}

fs.writeFileSync('scratch/all_names.txt', output, 'utf8');
console.log('Saved to scratch/all_names.txt');
