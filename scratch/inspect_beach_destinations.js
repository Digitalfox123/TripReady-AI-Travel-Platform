import { topDestinations } from '../src/data/index.js';

console.log("Total destinations:", topDestinations.length);

const beaches = topDestinations.filter(d => 
  d.category?.toLowerCase() === 'beach' || 
  d.categoryIds?.includes('beach')
);

console.log("Current beach destinations found:", beaches.length);
beaches.forEach(m => {
  console.log(`- ID: ${m.id}, Name: ${m.name}, Country: ${m.country}, Categories:`, m.categoryIds);
});
