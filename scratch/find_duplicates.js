const { attractionKnowledgeBase } = require('../src/data/attractionKnowledgeBase.js');

const imgMap = {};
const duplicates = [];

for (const citySlug in attractionKnowledgeBase) {
  if (citySlug === 'lahore' || citySlug === 'stlouis') continue;
  const attractions = attractionKnowledgeBase[citySlug];
  attractions.forEach((spot, idx) => {
    const img = spot.image;
    if (img) {
      if (imgMap[img]) {
        imgMap[img].push({ city: citySlug, name: spot.name, idx });
      } else {
        imgMap[img] = [{ city: citySlug, name: spot.name, idx }];
      }
    }
  });
}

for (const img in imgMap) {
  if (imgMap[img].length > 1) {
    duplicates.push({
      url: img,
      spots: imgMap[img]
    });
  }
}

console.log(`Total duplicate image URLs found: ${duplicates.length}`);
duplicates.forEach(d => {
  console.log(`\nURL: ${d.url}`);
  d.spots.forEach(s => {
    console.log(`  - ${s.city} -> ${s.name} (index ${s.idx})`);
  });
});
