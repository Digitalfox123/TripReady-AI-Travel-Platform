const fs = require('fs');
const path = require('path');

function search(dir) {
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      search(full);
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      const content = fs.readFileSync(full, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (line.includes('localStorage')) {
          console.log(`${full} Line ${idx + 1}: ${line.trim()}`);
        }
      });
    }
  }
}

search('C:/Users/hafiz/.gemini/antigravity/scratch/trip-ready/src');
