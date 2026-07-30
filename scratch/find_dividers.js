import fs from 'fs';

const content = fs.readFileSync('src/data/index.js', 'utf8');

const startTag = 'export const topDestinations = [';
const startIndex = content.indexOf(startTag);
console.log(`startIndex: ${startIndex}`);

let braceCount = 0;
let endIndex = -1;
for (let i = startIndex + 'export const topDestinations = '.length; i < content.length; i++) {
  if (content[i] === '[') braceCount++;
  if (content[i] === ']') {
    braceCount--;
    if (braceCount === 0) {
      endIndex = i + 1;
      break;
    }
  }
}
console.log(`endIndex: ${endIndex}`);

if (startIndex !== -1 && endIndex !== -1) {
  console.log(`Before topDestinations (last 100 chars):`);
  console.log(content.slice(startIndex - 100, startIndex));
  
  console.log(`\nAfter topDestinations (first 200 chars):`);
  console.log(content.slice(endIndex, endIndex + 200));
}
