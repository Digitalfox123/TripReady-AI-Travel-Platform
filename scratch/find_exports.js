import fs from 'fs';

const content = fs.readFileSync('src/data/index.js', 'utf8');

// Find all export statements
const exportRegex = /export\s+const\s+(\w+)\s*=/g;
let match;
while ((match = exportRegex.exec(content)) !== null) {
  console.log(`Found export: ${match[1]}`);
}
