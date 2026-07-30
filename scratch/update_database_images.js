import fs from 'fs';
import path from 'path';

const DATA_FILE = 'src/data/index.js';
const PEXELS_KEY = "YQYRDVubERjsu4wHacREVKfAJdMBKjsJawtRREAKQQCFyE408pq5oeBw";
const PIXABAY_KEY = "25085477-64457aa3004ffe076ffb1989c";

// Helper to delay execution to respect rate limits
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchFromPexels(query, count = 5) {
  try {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&orientation=landscape&per_page=${count}`;
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

async function fetchFromPixabay(query, count = 5) {
  try {
    const url = `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${encodeURIComponent(query)}&image_type=photo&per_page=${count}&min_width=1200`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      if (data.hits && data.hits.length > 0) {
        return data.hits.map(h => h.largeImageURL || h.webformatURL).filter(Boolean);
      }
    }
  } catch (err) {
    console.error(`Pixabay failed for "${query}":`, err.message);
  }
  return null;
}

async function getImagesForQuery(destinationName, countryName) {
  // Try 1: Precise search name + country landmark
  let query = `${destinationName} ${countryName || ''} landmark`;
  let images = await fetchFromPexels(query, 5);
  
  // Try 2: General name + country search
  if (!images || images.length === 0) {
    query = `${destinationName} ${countryName || ''}`;
    images = await fetchFromPexels(query, 5);
  }

  // Try 3: Pixabay with precise query
  if (!images || images.length === 0) {
    query = `${destinationName} ${countryName || ''}`;
    images = await fetchFromPixabay(query, 5);
  }

  // Try 4: Broad name search
  if (!images || images.length === 0) {
    query = destinationName;
    images = await fetchFromPexels(query, 5);
  }

  return images;
}

async function run() {
  console.log("Reading src/data/index.js...");
  const content = fs.readFileSync(DATA_FILE, 'utf8');

  // Extract topDestinations array range
  const startTag = 'export const topDestinations = [';
  const startIndex = content.indexOf(startTag);
  if (startIndex === -1) {
    console.error("Could not find start of topDestinations!");
    process.exit(1);
  }

  let braceCount = 0;
  let endIndex = -1;
  for (let i = startIndex + 'export const topDestinations = '.length; i < content.length; i++) {
    if (content[i] === '[') braceCount++;
    if (content[i] === ']') {
      braceCount--;
      if (braceCount === 0) {
        endIndex = i + 1;
        break;
      }
    }
  }

  if (endIndex === -1) {
    console.error("Could not find end of topDestinations!");
    process.exit(1);
  }

  const arrayStr = content.slice(startIndex + 'export const topDestinations = '.length, endIndex);
  
  // Save as temporary module to load it into memory
  fs.writeFileSync('scratch/temp_destinations.js', 'export const topDestinations = ' + arrayStr);
  const m = await import('./temp_destinations.js');
  const destinations = m.topDestinations;
  console.log(`Loaded ${destinations.length} destinations into memory.`);

  // Process destinations sequentially
  // We prioritize destinations that are Historical or Pakistan-related, or that have generic flat lay/sticker images.
  // Actually, let's process all destinations in the list to make the app absolutely premium!
  // Spacing requests by 150ms avoids rate limit spikes.
  for (let i = 0; i < destinations.length; i++) {
    const dest = destinations[i];
    const isHistoricalOrPak = (dest.categoryIds && dest.categoryIds.includes('historical')) || dest.country === 'Pakistan';
    const isGenericImage = dest.image && (dest.image.includes('photo-1488646953014') || dest.image.includes('photo-1596572418737') || dest.image.includes('photo-1627998797960') || dest.image.includes('photo-1607604276583') || dest.image.includes('photo-1600271886742'));
    
    // We update if it's historical, in Pakistan, or carries a known generic placeholder
    if (isHistoricalOrPak || isGenericImage) {
      console.log(`[${i+1}/${destinations.length}] Fetching high-quality images for: "${dest.name}" (${dest.country})...`);
      
      const newImages = await getImagesForQuery(dest.name, dest.country);
      if (newImages && newImages.length > 0) {
        console.log(`  -> Found ${newImages.length} images! Primary: ${newImages[0].substring(0, 60)}...`);
        dest.image = newImages[0];
        
        // Pad the gallery if fewer than 4 unique images returned
        const galleryList = [...newImages];
        while (galleryList.length < 4) {
          galleryList.push(newImages[0]);
        }
        dest.gallery = galleryList.slice(0, 4);
      } else {
        console.log(`  -> Warning: No images found for "${dest.name}". Leaving as: ${dest.image}`);
      }
      
      // Delay to respect APIs rate limits
      await sleep(150);
    }
  }

  // Format array back into code structure
  // Using JSON.stringify directly preserves all quotes, but we format nicely to look beautiful in the code
  const newArrayStr = JSON.stringify(destinations, null, 2);
  const finalCode = content.slice(0, startIndex) + 'export const topDestinations = ' + newArrayStr + content.slice(endIndex);

  console.log("Writing changes back to src/data/index.js...");
  fs.writeFileSync(DATA_FILE, finalCode, 'utf8');
  console.log("Database update complete!");

  // Clean up temporary file
  fs.unlinkSync('scratch/temp_destinations.js');
}

run().catch(err => {
  console.error("Execution error:", err);
});
