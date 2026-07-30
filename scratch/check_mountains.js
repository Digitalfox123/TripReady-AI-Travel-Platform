import { topDestinations } from '../src/data/index.js';

console.log("Total destinations:", topDestinations.length);

const mountains = topDestinations.filter(d => 
  d.category?.toLowerCase() === 'mountains' || 
  d.categories?.includes('mountains') ||
  d.id.includes('everest') || 
  d.id.includes('k2') || 
  d.id.includes('annapurna') || 
  d.id.includes('blanc') || 
  d.id.includes('matterhorn') || 
  d.id.includes('dolomites') || 
  d.id.includes('aconcagua') || 
  d.id.includes('paine') || 
  d.id.includes('rockies') || 
  d.id.includes('kilimanjaro') || 
  d.id.includes('denali') || 
  d.id.includes('fuji')
);

console.log("Mountain destinations found:", mountains.length);
mountains.forEach(m => {
  console.log(`- ID: ${m.id}, Name: ${m.name}, Country: ${m.country}, Image: ${m.image || m.imageUrl}`);
  if (m.images) {
    console.log(`  Images array (${m.images.length}):`, m.images);
  }
});
