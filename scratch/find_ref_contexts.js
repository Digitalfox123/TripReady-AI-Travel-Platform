import fs from 'fs';

function inspectFile(filePath) {
  if (fs.existsSync(filePath)) {
    console.log(`\n=== References in ${filePath} ===`);
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      if (line.includes('sahara') || line.includes('dubai-desert')) {
        console.log(`[Line ${idx + 1}] ${line.trim()}`);
      }
    });
  } else {
    console.log(`File not found: ${filePath}`);
  }
}

inspectFile('src/components/home/CategoriesSection.jsx');
inspectFile('src/pages/DestinationPage.jsx');
