const fs = require('fs');
const s = fs.readFileSync('src/data/index.js', 'utf8');

// Find all image entries
const all = s.match(/"image":\s*"[^"]+"/g);
console.log('Total image entries:', all ? all.length : 0);

// Find ones that are NOT https URLs
const bad = all ? all.filter(x => !x.includes('https://')) : [];
console.log('Non-HTTPS images:', bad.length);
bad.forEach(x => console.log('  ', x));

// Find duplicates (same image used for multiple destinations)
const urls = all ? all.map(x => x.match(/"([^"]+)"$/)[1]) : [];
const counts = {};
urls.forEach(u => { counts[u] = (counts[u] || 0) + 1; });
const dupes = Object.entries(counts).filter(([k,v]) => v > 3);
console.log('\nImages used 4+ times (likely generic/wrong):');
dupes.forEach(([url, count]) => console.log(`  ${count}x: ${url.substring(0, 80)}...`));
