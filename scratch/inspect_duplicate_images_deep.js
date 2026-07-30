import fs from 'fs';
import path from 'path';

const PROJECT_DIR = 'C:\\Users\\hafiz\\.gemini\\antigravity\\scratch\\trip-ready';

const fileContent = fs.readFileSync(path.join(PROJECT_DIR, 'src/data/index.js'), 'utf8');

// We will find all destinations blocks in topDestinations
// Destinations look like:
// {
//   id: 'tokyo',
//   name: 'Tokyo',
//   country: 'Japan',
//   ...
//   image: '...'
// }
const destRegex = /\{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)',\s*country:\s*'([^']+)'[\s\S]*?image:\s*'([^']+)'/g;
let match;
const destinations = [];
while ((match = destRegex.exec(fileContent)) !== null) {
  destinations.push({
    id: match[1],
    name: match[2],
    country: match[3],
    image: match[4]
  });
}

console.log(`Successfully parsed ${destinations.length} destinations.`);

// Map of image URL to destinations using it
const imageUsage = {};
destinations.forEach(d => {
  if (!imageUsage[d.image]) {
    imageUsage[d.image] = [];
  }
  imageUsage[d.image].push(d);
});

console.log("\nDeep inspection of shared image URLs in topDestinations:");
Object.entries(imageUsage).forEach(([url, usages]) => {
  if (usages.length > 1) {
    console.log(`\nURL: ${url}`);
    usages.forEach(u => {
      console.log(`  - Destination ID: ${u.id}, Name: ${u.name}, Country: ${u.country}`);
    });
  }
});
