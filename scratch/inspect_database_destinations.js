import { topDestinations } from '../src/data/index.js';

console.log("Total destinations:", topDestinations.length);
const sample = topDestinations.slice(0, 10);
sample.forEach(d => {
  console.log(`ID: ${d.id}, Name: ${d.name}, Country: ${d.country}, CategoryIds: ${JSON.stringify(d.categoryIds)}, Attractions: ${JSON.stringify(d.attractions || [])}`);
});
