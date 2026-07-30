import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/pages/DestinationPage.jsx');
const content = fs.readFileSync(filePath, 'utf-8');
const lines = content.split('\n');

for (let i = 0; i < 40; i++) {
  if (lines[i] && lines[i].includes('lucide-react')) {
    console.log(`Line ${i + 1}: ${lines[i]}`);
    for (let j = i - 5; j <= i + 5; j++) {
      if (lines[j]) console.log(`${j + 1}: ${lines[j]}`);
    }
  }
}
