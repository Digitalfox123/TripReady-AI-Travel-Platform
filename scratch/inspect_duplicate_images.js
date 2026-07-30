import fs from 'fs';
import path from 'path';

const PROJECT_DIR = 'C:\\Users\\hafiz\\.gemini\\antigravity\\scratch\\trip-ready';

// We will read the src/data/index.js file as text
const fileContent = fs.readFileSync(path.join(PROJECT_DIR, 'src/data/index.js'), 'utf8');

// We will extract all "image:" fields or urls
const unsplashUrls = [];
const regex = /image:\s*'([^']+)'/g;
let match;
while ((match = regex.exec(fileContent)) !== null) {
  unsplashUrls.push(match[1]);
}

console.log(`Found ${unsplashUrls.length} destination image URLs in index.js.`);

// Find duplicates
const urlMap = {};
unsplashUrls.forEach(url => {
  urlMap[url] = (urlMap[url] || 0) + 1;
});

const duplicates = Object.entries(urlMap).filter(([url, count]) => count > 1);

if (duplicates.length === 0) {
  console.log("No duplicate image URLs found in index.js topDestinations!");
} else {
  console.log("\nFound duplicate image URLs:");
  duplicates.forEach(([url, count]) => {
    console.log(`- ${url} (used ${count} times)`);
  });
}
