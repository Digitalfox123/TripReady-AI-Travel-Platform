import { topDestinations } from '../src/data/index.js';

const mountains = topDestinations.filter(d => 
  d.id.includes('everest') || 
  d.id.includes('k2') || 
  d.id.includes('annapurna') || 
  d.id.includes('blanc') || 
  d.id.includes('matterhorn') || 
  d.id.includes('dolomites') || 
  d.id.includes('aconcagua') || 
  d.id.includes('paine') || 
  d.id.includes('rockies') || 
  d.id.includes('kilimanjaro') || 
  d.id.includes('denali') || 
  d.id.includes('fuji')
);

console.log("Checking gallery image URLs for all mountains:");

for (const m of mountains) {
  if (m.gallery) {
    for (let i = 0; i < m.gallery.length; i++) {
      const url = m.gallery[i];
      try {
        const res = await fetch(url, { method: 'HEAD' });
        console.log(`- ${m.name} Gallery[${i}] [${url.substring(0, 60)}...]: Status ${res.status} ${res.ok ? 'OK' : 'FAIL'}`);
      } catch (err) {
        console.log(`- ${m.name} Gallery[${i}]: ERROR: ${err.message}`);
      }
    }
  }
}
