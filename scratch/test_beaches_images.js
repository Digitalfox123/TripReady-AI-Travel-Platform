import { topDestinations } from '../src/data/index.js';

const beachIds = [
  'entalula-beach', 'whitehaven-beach', 'bioluminescent-maldives', 'railay-beach',
  'elafonissi-beach', 'praia-da-falesia', 'la-pelosa-beach', 'reynisfjara-beach',
  'isla-pasion', 'grace-bay-beach', 'la-jolla-cove', 'tulum-beach', 'boulders-beach',
  'saadiyat-beach', 'camps-bay'
];

const beaches = topDestinations.filter(d => beachIds.includes(d.id));

console.log(`Checking image URLs for all ${beaches.length} beach destinations:`);

let allSuccess = true;

for (const m of beaches) {
  const urls = [m.image];
  if (m.gallery) {
    urls.push(...m.gallery);
  }
  
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    if (!url) continue;
    try {
      const res = await fetch(url, { method: 'HEAD' });
      const fieldName = i === 0 ? 'Primary Image' : `Gallery[${i - 1}]`;
      console.log(`- ${m.name} ${fieldName} [${url.substring(0, 60)}...]: Status ${res.status} ${res.ok ? 'OK' : 'FAIL'}`);
      if (!res.ok) {
        allSuccess = false;
      }
    } catch (err) {
      console.log(`- ${m.name} [${url.substring(0, 60)}...]: ERROR: ${err.message}`);
      allSuccess = false;
    }
  }
}

console.log("-----------------------------------------");
console.log(`Final Verification Result: ${allSuccess ? '100% SUCCESS - All beach images are valid!' : 'FAILED - Some beach images are broken!'}`);
