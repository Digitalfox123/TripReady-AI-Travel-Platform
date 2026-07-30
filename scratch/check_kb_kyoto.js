import { attractionKnowledgeBase } from '../src/data/attractionKnowledgeBase.js';

console.log('--- Checking Kyoto in attractionKnowledgeBase ---');
const kyotoAttractions = attractionKnowledgeBase['kyoto'];
if (kyotoAttractions) {
  console.log(`Found Kyoto attractions: ${kyotoAttractions.length}`);
  kyotoAttractions.forEach(a => {
    console.log(`- Name: "${a.name}"`);
    console.log(`  Image: "${a.image}"`);
  });
} else {
  console.log('Kyoto not found directly. Keys are:', Object.keys(attractionKnowledgeBase));
}
