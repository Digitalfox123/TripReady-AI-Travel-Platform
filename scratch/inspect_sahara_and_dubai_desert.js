import fs from 'fs';

const content = fs.readFileSync('src/data/index.js', 'utf8');
const lines = content.split('\n');

function findFullObjectRange(id) {
  const searchStr = `"id": "${id}"`;
  let foundIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(searchStr)) {
      foundIdx = i;
      break;
    }
  }

  if (foundIdx === -1) return null;

  // Find start brace
  let startLine = foundIdx;
  while (startLine >= 0 && !lines[startLine].trim().startsWith('{')) {
    startLine--;
  }

  // Find closing brace of the whole object (at the same level of indentation)
  let endLine = foundIdx;
  let openBraces = 0;
  for (let i = startLine; i < lines.length; i++) {
    const line = lines[i];
    // Simple bracket matching
    for (let char of line) {
      if (char === '{') openBraces++;
      if (char === '}') openBraces--;
    }
    if (openBraces === 0) {
      endLine = i;
      break;
    }
  }
  return { start: startLine + 1, end: endLine + 1 };
}

['sahara', 'dubai-desert'].forEach(id => {
  const range = findFullObjectRange(id);
  if (range) {
    console.log(`ID: ${id}, startLine: ${range.start}, endLine: ${range.end}`);
    console.log("Snippet at start:");
    console.log(lines.slice(range.start - 1, range.start + 5).join('\n'));
    console.log("Snippet at end:");
    console.log(lines.slice(range.end - 6, range.end).join('\n'));
  } else {
    console.log(`ID: ${id} NOT FOUND`);
  }
});
