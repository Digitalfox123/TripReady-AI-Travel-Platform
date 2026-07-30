const fs = require('fs');
const path = require('path');
const { attractionKnowledgeBase, realCityFoodAndTransit } = require('../src/data/attractionKnowledgeBase.js');

const PEXELS_KEY = "YQYRDVubERjsu4wHacREVKfAJdMBKjsJawtRREAKQQCFyE408pq5oeBw";

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchFromPexels(query, count = 2) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&orientation=landscape&per_page=${count}`;
  try {
    const response = await fetch(url, {
      headers: { "Authorization": PEXELS_KEY }
    });
    if (response.ok) {
      const data = await response.json();
      if (data.photos && data.photos.length > 0) {
        return data.photos.map(p => p.src.large2x || p.src.large).filter(Boolean);
      }
    }
  } catch (err) {
    console.error(`Pexels failed for "${query}":`, err.message);
  }
  return null;
}

async function getWikiImage(name) {
  try {
    const headers = {
      "User-Agent": "TripReadyTravelPlanner/1.0 (hafiz@example.com; Antigravity AI Agent Pair Programming)"
    };
    
    // 1. Search Wikipedia for the best matching page title
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(name)}&format=json&origin=*`;
    const searchRes = await fetch(searchUrl, { headers });
    if (!searchRes.ok) return null;
    const searchData = await searchRes.json();
    if (!searchData.query || !searchData.query.search || searchData.query.search.length === 0) {
      return null;
    }
    
    const pageTitle = searchData.query.search[0].title;
    
    // 2. Fetch page summary for the page title
    const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle.replace(/ /g, '_'))}`;
    const summaryRes = await fetch(summaryUrl, { headers });
    if (!summaryRes.ok) return null;
    const summaryData = await summaryRes.json();
    
    return summaryData.originalimage ? summaryData.originalimage.source : (summaryData.thumbnail ? summaryData.thumbnail.source : null);
  } catch (err) {
    return null;
  }
}

const CITY_NAMES = {
  bangkok: "Bangkok", tokyo: "Tokyo", kyoto: "Kyoto", osaka: "Osaka",
  seoul: "Seoul", busan: "Busan", singapore: "Singapore", hongkong: "Hong Kong",
  kualalumpur: "Kuala Lumpur", dubai: "Dubai", abudhabi: "Abu Dhabi",
  mecca: "Mecca", medina: "Medina", istanbul: "Istanbul", antalya: "Antalya",
  bali: "Bali", jakarta: "Jakarta", phuket: "Phuket", chiangmai: "Chiang Mai",
  hanoi: "Hanoi", hochiminhcity: "Ho Chi Minh City", paris: "Paris",
  london: "London", rome: "Rome", milan: "Milan", venice: "Venice",
  barcelona: "Barcelona", madrid: "Madrid", amsterdam: "Amsterdam",
  vienna: "Vienna", prague: "Prague", athens: "Athens", lisbon: "Lisbon",
  budapest: "Budapest", berlin: "Berlin", munich: "Munich", zurich: "Zurich",
  newyorkcity: "New York City", losangeles: "Los Angeles", lasvegas: "Las Vegas",
  sanfrancisco: "San Francisco", miami: "Miami", orlando: "Orlando",
  washingtondc: "Washington D.C.", toronto: "Toronto", vancouver: "Vancouver",
  montreal: "Montreal", mexicocity: "Mexico City", cancun: "Cancun",
  riodejaneiro: "Rio de Janeiro", saopaulo: "São Paulo"
};

async function run() {
  console.log('Starting hybrid attraction image database upgrade...');
  
  const keys = Object.keys(attractionKnowledgeBase);
  let updatedCount = 0;
  let wikiCount = 0;
  let pexelsCount = 0;
  let fallbackCount = 0;
  
  for (const citySlug of keys) {
    // PRESERVE Lahore and St. Louis untouched
    if (citySlug === 'lahore' || citySlug === 'stlouis') {
      console.log(`Skipping preserved city: ${citySlug}`);
      continue;
    }
    
    const cityName = CITY_NAMES[citySlug] || citySlug;
    const attractions = attractionKnowledgeBase[citySlug];
    console.log(`\n=== Updating ${cityName} ===`);
    
    for (let idx = 0; idx < attractions.length; idx++) {
      const spot = attractions[idx];
      const attrName = spot.name;
      
      let finalImage = null;
      let finalImages = [];
      
      // 1. Try Wikipedia Search first
      console.log(`  Attraction: "${attrName}"`);
      const wikiImg = await getWikiImage(`${attrName} ${cityName}`);
      await sleep(300); // respect Wikipedia rate limit
      
      if (wikiImg) {
        console.log(`    [SUCCESS] Found on Wikipedia: ${wikiImg}`);
        finalImage = wikiImg;
        finalImages = [wikiImg];
        wikiCount++;
      } else {
        // 2. Fall back to Pexels search
        const query = attrName.toLowerCase().includes(cityName.toLowerCase()) ? attrName : `${attrName} ${cityName}`;
        console.log(`    [FALLBACK] Wikipedia failed. Querying Pexels for "${query}"...`);
        const pexelsImgs = await fetchFromPexels(query, 2);
        await sleep(150); // respect Pexels rate limit
        
        if (pexelsImgs && pexelsImgs.length > 0) {
          console.log(`    [SUCCESS] Found on Pexels: ${pexelsImgs[0]}`);
          finalImage = pexelsImgs[0];
          finalImages = pexelsImgs;
          pexelsCount++;
        } else {
          // 3. Fall back to high-quality Unsplash Featured Search
          console.log(`    [WARNING] Pexels failed. Falling back to Unsplash Featured Redirect.`);
          const cleanQuery = attrName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase();
          finalImage = `https://images.unsplash.com/featured/1200x800/?${encodeURIComponent(cleanQuery)}`;
          finalImages = [
            finalImage,
            `https://images.unsplash.com/featured/1200x800/?${encodeURIComponent(cityName.toLowerCase() + '-travel')}`
          ];
          fallbackCount++;
        }
      }
      
      spot.image = finalImage;
      spot.images = finalImages;
      updatedCount++;
    }
  }
  
  // Write back to attractionKnowledgeBase.js
  const realKbFile = path.resolve(__dirname, '../src/data/attractionKnowledgeBase.js');
  
  let fileContent = `export const attractionKnowledgeBase = {\n`;
  for (const key in attractionKnowledgeBase) {
    fileContent += `  ${key}: ${JSON.stringify(attractionKnowledgeBase[key], null, 2)},\n`;
  }
  fileContent += `};\n\n`;

  fileContent += `export const realCityFoodAndTransit = {\n`;
  for (const key in realCityFoodAndTransit) {
    fileContent += `  ${key}: ${JSON.stringify(realCityFoodAndTransit[key], null, 2)},\n`;
  }
  fileContent += `};\n`;
  
  fs.writeFileSync(realKbFile, fileContent, 'utf8');
  console.log(`\nSuccessfully updated ${updatedCount} attractions.`);
  console.log(`Stats:\n - Wikipedia Images: ${wikiCount}\n - Pexels Images: ${pexelsCount}\n - Fallback Images: ${fallbackCount}`);
}

run();
