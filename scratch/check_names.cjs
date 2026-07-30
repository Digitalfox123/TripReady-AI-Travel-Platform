const { attractionKnowledgeBase } = require('../src/data/attractionKnowledgeBase.js');

for (const citySlug in attractionKnowledgeBase) {
  console.log(`\nCity: ${citySlug}`);
  const attractions = attractionKnowledgeBase[citySlug];
  attractions.forEach((spot, idx) => {
    console.log(`  ${idx + 1}. "${spot.name}"`);
  });
}
