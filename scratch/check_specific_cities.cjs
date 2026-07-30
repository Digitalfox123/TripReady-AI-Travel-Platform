const { attractionKnowledgeBase } = require('../src/data/attractionKnowledgeBase.js');

const targetCities = ['paris', 'mecca', 'medina', 'montreal', 'hochiminhcity', 'cancun', 'orlando', 'lahore', 'stlouis'];

targetCities.forEach(citySlug => {
  console.log(`\n=== City: ${citySlug} ===`);
  const attractions = attractionKnowledgeBase[citySlug];
  if (attractions) {
    attractions.forEach((spot, idx) => {
      console.log(`  ${idx + 1}. "${spot.name}" -> ${spot.image}`);
    });
  } else {
    console.log(`  Not found`);
  }
});
