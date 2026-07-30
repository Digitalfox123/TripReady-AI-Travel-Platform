import fs from 'fs';
import path from 'path';

const DATA_FILE = 'src/data/index.js';
const content = fs.readFileSync(DATA_FILE, 'utf8');

// Use a simple regex to match the topDestinations block and parse it, or find all destination objects
// Each destination looks like: { id: "...", name: "...", country: "...", categories: [...], image: "...", ... }
const regex = /\{\s*"?id"?:\s*"([^"]+)",\s*"?name"?:\s*"([^"]+)",\s*"?country"?:\s*"([^"]+)"[\s\S]*?"?image"?:\s*"([^"]+)"/g;

let match;
const destinations = [];
while ((match = regex.exec(content)) !== null) {
  destinations.push({
    id: match[1],
    name: match[2],
    country: match[3],
    image: match[4]
  });
}

console.log(`Found total ${destinations.length} destinations parsed by simple regex.`);
const pakDests = destinations.filter(d => d.country.toLowerCase() === 'pakistan');
console.log(`Pakistan destinations:`, pakDests);
