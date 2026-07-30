import fs from 'fs';
import { execSync } from 'child_process';

const gitPaths = [
  'C:\\Program Files\\Git\\bin\\git.exe',
  'C:\\Program Files\\Git\\cmd\\git.exe',
  'git'
];

let gitPath = null;
for (const p of gitPaths) {
  try {
    execSync(`"${p}" --version`);
    gitPath = p;
    console.log(`Found git at: ${p}`);
    break;
  } catch (err) {
    // Ignore
  }
}

if (gitPath) {
  try {
    // Let's run git diff on src/data/index.js
    console.log("Running git diff to see deleted lines...");
    const diff = execSync(`"${gitPath}" diff src/data/index.js`, { encoding: 'utf8' });
    console.log("Diff length:", diff.length);
    fs.writeFileSync('scratch/git_diff.txt', diff);
    console.log("Saved scratch/git_diff.txt");
    
    // Let's find deleted lines starting with '-' that contain our missing exports
    const lines = diff.split('\n');
    console.log("Deleted export blocks starting with '-' (first few):");
    lines.filter(l => l.startsWith('-') && !l.startsWith('---')).slice(0, 100).forEach(l => {
      if (l.includes('export const') || l.includes('travelCategories') || l.includes('features') || l.includes('featuredTestimonials') || l.includes('scrollingTestimonials')) {
        console.log(l);
      }
    });
  } catch (err) {
    console.log("Error running git diff:", err.message);
  }
} else {
  console.log("Git executable not found on the system.");
}
