const testNames = [
  "Sensō-ji Temple",
  "Kinkaku-ji (Golden Pavilion)",
  "Kiyomizu-dera Temple",
  "Ryōan-ji Temple",
  "Shitennō-ji Temple",
  "Warner Bros. World Abu Dhabi",
  "Ben Thanh Market",
  "Chichen Itza"
];

async function getWikiImage(name) {
  try {
    const headers = {
      "User-Agent": "TripReadyTravelPlanner/1.0 (hafiz@example.com; Antigravity AI Agent Pair Programming)"
    };
    
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(name)}&format=json&origin=*`;
    const searchRes = await fetch(searchUrl, { headers });
    if (!searchRes.ok) {
      console.log(`  Search failed for "${name}": status ${searchRes.status}`);
      return null;
    }
    const searchData = await searchRes.json();
    if (!searchData.query || !searchData.query.search || searchData.query.search.length === 0) {
      console.log(`  No search results for "${name}"`);
      return null;
    }
    
    const pageTitle = searchData.query.search[0].title;
    console.log(`  Query: "${name}" -> Matched Title: "${pageTitle}"`);
    
    // REST API summary
    const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle.replace(/ /g, '_'))}`;
    const summaryRes = await fetch(summaryUrl, { headers });
    if (!summaryRes.ok) {
      console.log(`    Summary failed for "${pageTitle}" (URL: ${summaryUrl}): status ${summaryRes.status}`);
      return null;
    }
    const summaryData = await summaryRes.json();
    
    return summaryData.originalimage ? summaryData.originalimage.source : (summaryData.thumbnail ? summaryData.thumbnail.source : null);
  } catch (err) {
    console.error(`  Error for "${name}":`, err.message);
    return null;
  }
}

async function run() {
  console.log('=== Testing Two-Step Wikipedia Search with User-Agent ===');
  for (const name of testNames) {
    const img = await getWikiImage(name);
    console.log(`Name: "${name}" -> Image: ${img}`);
    console.log('---');
    await new Promise(r => setTimeout(r, 500)); // sleep 500ms
  }
}

run();
