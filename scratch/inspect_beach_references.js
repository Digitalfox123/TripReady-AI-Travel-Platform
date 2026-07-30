import fs from 'fs';
import path from 'path';

// Recursively find all JS/JSX files in src/
function findFiles(dir, files = []) {
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== 'dist' && file !== '.git') {
        findFiles(filePath, files);
      }
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      files.push(filePath);
    }
  });
  return files;
}

const allFiles = findFiles('.');
console.log(`Found ${allFiles.length} JS/JSX files.`);

const searchIds = [
  'losangeles-635', 'miamibeach-30', 'nicepromenade-489', 'marseilleharbor-97',
  'amalficoast-181', 'ibizaisland-294', 'antalyacoast-823', 'cretebeaches-805',
  'tulumruins-600', 'lombokbeaches-853', 'riocopacabana-761', 'losangeles-458',
  'miamibeach-516', 'nicepromenade-9', 'marseilleharbor-780', 'amalficoast-47',
  'ibizaisland-562', 'antalyacoast-116', 'cretebeaches-846', 'tulumruins-498',
  'lombokbeaches-127', 'riocopacabana-361'
];

searchIds.forEach(id => {
  let found = [];
  allFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes(id) && !file.includes('inspect') && !file.includes('scratch')) {
      found.push(file);
    }
  });
  if (found.length > 0) {
    console.log(`ID "${id}" found in:`, found);
  }
});
