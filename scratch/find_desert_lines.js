import fs from 'fs';

const content = fs.readFileSync('src/data/index.js', 'utf8');
const lines = content.split('\n');

// Let's find each desert destination and its line range
console.log("Analyzing index.js line ranges for desert destinations...");

// We'll search for keys like "id": "dubai" or "id": "sahara" etc.
const desertIds = [
  'dubai',
  'sahara',
  'dubai-desert',
  'cappadocia',
  'cairo-pyramids',
  'petra-rose',
  'marrakech',
  'alula'
];

desertIds.forEach(id => {
  const searchStr = `"id": "${id}"`;
  let foundIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(searchStr)) {
      foundIdx = i;
      break;
    }
  }

  if (foundIdx !== -1) {
    // Find the enclosing curly braces { and }
    // Usually the object starts with { a few lines before, and ends with },
    let startLine = foundIdx;
    while (startLine >= 0 && !lines[startLine].trim().startsWith('{')) {
      startLine--;
    }
    
    // Find matching closing brace
    let endLine = foundIdx;
    let bracesCount = 1;
    while (endLine < lines.length) {
      const line = lines[endLine];
      if (line.includes('},')) {
        break;
      }
      endLine++;
    }
    console.log(`- Destination ID: "${id}"`);
    console.log(`  Line range: [${startLine + 1} to ${endLine + 1}]`);
    console.log(`  Start snippet: ${lines[startLine].trim()}`);
    console.log(`  End snippet: ${lines[endLine].trim()}`);
  } else {
    console.log(`- Destination ID: "${id}" (NOT FOUND)`);
  }
});
