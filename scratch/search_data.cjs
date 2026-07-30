const fs = require('fs');
const content = fs.readFileSync('src/data/index.js', 'utf8');

console.log("Includes Makkah:", content.includes("Makkah"));
console.log("Includes Madinah:", content.includes("Madinah"));
console.log("Includes Saudi Arabia:", content.includes("Saudi Arabia"));

// Find occurrences
const lines = content.split('\n');
lines.forEach((line, index) => {
  if (line.includes("Makkah") || line.includes("Madinah") || line.includes("Saudi Arabia")) {
    console.log(`Line ${index + 1}: ${line.trim()}`);
  }
});
