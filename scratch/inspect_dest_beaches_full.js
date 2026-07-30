import { topDestinations } from '../src/data/index.js';

const target = topDestinations.find(d => d.id.includes('miamibeach') || d.id === 'bali');
if (target) {
  console.log("Example destination structure:", JSON.stringify(target, null, 2));
} else {
  console.log("No matching destination found!");
}
