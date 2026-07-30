const API_KEY = 'ed3fc44ceae0480db0a6cafdb9f39d1b';

const candidates = [
  'tourism.attraction',
  'entertainment',
  'heritage',
  'entertainment.museum',
  'national_park',
  'tourism.sights',
  'beach',
  'tourism.attraction.viewpoint',
  'entertainment.zoo',
  'entertainment.theme_park',
  'tourism.sights.castle',
  'tourism.sights.monument',
  'tourism.attraction.artwork'
];

async function testCandidates() {
  const lng = 74.7681298;
  const lat = 36.7867043;
  
  for (const cat of candidates) {
    try {
      const url = `https://api.geoapify.com/v2/places?categories=${cat}&filter=circle:${lng},${lat},20000&bias=proximity:${lng},${lat}&limit=1&apiKey=${API_KEY}`;
      const res = await fetch(url);
      console.log(`Category [${cat}]: Status = ${res.status}`);
      if (res.status === 400) {
        const body = await res.json();
        console.log(`  Error: ${body.message}`);
      }
    } catch (e) {
      console.log(`  Error calling for ${cat}:`, e.message);
    }
  }
}

testCandidates();
