import { topDestinations } from '../src/data/index.js';

const beaches = topDestinations.filter(d => 
  d.categoryIds?.includes('beaches')
);

console.log("Current beaches in database:", beaches.length);
beaches.forEach(m => {
  console.log(`- ID: ${m.id}, Name: ${m.name}, Country: ${m.country}, Categories:`, m.categoryIds);
});
