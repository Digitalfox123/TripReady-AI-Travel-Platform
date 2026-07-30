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
        // Return matching photo URLs
        return data.photos.map(p => p.src.large2x || p.src.large).filter(Boolean);
      }
    }
  } catch (err) {
    console.error(`Pexels failed for "${query}":`, err.message);
  }
  return null;
}

// Map city slugs to readable names for better search
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
  console.log('Starting attraction image database upgrade...');
  
  const keys = Object.keys(attractionKnowledgeBase);
  let updatedCount = 0;
  
  for (const citySlug of keys) {
    // PRESERVE Lahore and St. Louis untouched
    if (citySlug === 'lahore' || citySlug === 'stlouis') {
      console.log(`Skipping preserved city: ${citySlug}`);
      continue;
    }
    
    const cityName = CITY_NAMES[citySlug] || citySlug;
    const attractions = attractionKnowledgeBase[citySlug];
    console.log(`\n=== Updating ${cityName} (${attractions.length} attractions) ===`);
    
    for (let idx = 0; idx < attractions.length; idx++) {
      const spot = attractions[idx];
      const attrName = spot.name;
      
      // Smart query: if the name contains the city already, search name. Else, combine.
      let query = '';
      if (attrName.toLowerCase().includes(cityName.toLowerCase())) {
        query = attrName;
      } else {
        query = `${attrName} ${cityName}`;
      }
      
      console.log(`  Updating "${attrName}" -> Query: "${query}"`);
      
      let imageUrls = null;
      try {
        imageUrls = await fetchFromPexels(query, 2);
        await sleep(150); // Respect Pexels rate limits
      } catch (err) {
        console.error(`Pexels error for ${attrName}:`, err.message);
      }
      
      // Fallback to dynamic high-quality Unsplash Featured Search
      if (!imageUrls || imageUrls.length === 0) {
        console.log(`    [Pexels returned 0 results. Falling back to Unsplash Featured Redirect]`);
        imageUrls = [
          `https://images.unsplash.com/featured/1200x800/?${encodeURIComponent(attrName.replace(/ /g, '-').toLowerCase())}`,
          `https://images.unsplash.com/featured/1200x800/?${encodeURIComponent(cityName.toLowerCase() + '-travel')}`
        ];
      } else if (imageUrls.length === 1) {
        imageUrls.push(`https://images.unsplash.com/featured/1200x800/?${encodeURIComponent(attrName.replace(/ /g, '-').toLowerCase())}`);
      }
      
      // Set updated image properties
      spot.image = imageUrls[0];
      spot.images = imageUrls;
      updatedCount++;
    }
  }
  
  // 3. Write back to attractionKnowledgeBase.js
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
  console.log(`\nSuccessfully updated ${updatedCount} attractions. Written to ${realKbFile}`);
}

run();
