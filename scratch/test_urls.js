const urls = [
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80'
];

async function testUrls() {
  console.log('--- Testing image URL ---');
  for (const url of urls) {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      console.log(`URL: ${url}`);
      console.log(`Status: ${res.status} ${res.statusText}`);
      console.log('-----------------------------------');
    } catch (err) {
      console.error(`Failed to fetch ${url}:`, err.message);
    }
  }
}

testUrls();
