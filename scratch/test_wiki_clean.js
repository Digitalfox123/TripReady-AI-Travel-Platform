async function testWikipedia(title) {
  const cleanTitle = title.replace(/\s*\(.*?\)\s*/g, '').trim();
  console.log(`Original: "${title}" | Cleaned: "${cleanTitle}"`);
  
  try {
    const pageTitle = cleanTitle.replace(/\s+/g, '_');
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle)}`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      console.log('Wikipedia Success for:', cleanTitle, '->', data.originalimage?.source);
      return;
    }
    console.log('Wikipedia Status:', response.status);
  } catch (err) {
    console.error('Wikipedia Error:', err.message);
  }
}

async function run() {
  await testWikipedia('Great Wall of China (Mutianyu/Badaling/Jinshanling)');
  await testWikipedia('Forbidden City (Palace Museum - UNESCO World Heritage)');
  await testWikipedia('Canton Tower (Iconic TV Tower & Observation Deck)');
  await testWikipedia("Shanghai Tower (China's Tallest Building - 632m)");
}

run();
