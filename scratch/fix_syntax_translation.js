import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/pages/DestinationPage.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

// Replace the invalid template string in JSX
const target = '<p className="text-xs text-[var(--text-secondary)] italic">"${translationInput}"</p>';
const replacement = '<p className="text-xs text-[var(--text-secondary)] italic">"{translationInput}"</p>';

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log("Successfully fixed translationInput JSX string!");
} else {
  // Let's print out what is on line 3667
  const lines = content.split('\n');
  console.log("Line 3667:", lines[3666]);
  // Try replacement by regex or substring
  const fixedContent = content.replace('"${translationInput}"', '"{translationInput}"');
  fs.writeFileSync(filePath, fixedContent, 'utf-8');
  console.log("Successfully replaced translationInput JSX string via simple replace!");
}
