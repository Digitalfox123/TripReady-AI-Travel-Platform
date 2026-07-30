import { topDestinations } from '../src/data/index.js';

const categories = new Set();
topDestinations.forEach(d => {
  if (d.categoryIds) {
    d.categoryIds.forEach(c => categories.add(c));
  }
  if (d.category) {
    categories.add(d.category);
  }
});

console.log("All categories in database:", Array.from(categories));
