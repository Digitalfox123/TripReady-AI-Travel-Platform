import { topDestinations } from '../src/data/index.js';

const deserts = topDestinations.filter(d => 
  d.categoryIds?.includes('deserts')
);

console.log("Current deserts in database:", deserts.length);
deserts.forEach(m => {
  console.log(`- ID: ${m.id}, Name: ${m.name}, Country: ${m.country}, Categories:`, m.categoryIds);
});
