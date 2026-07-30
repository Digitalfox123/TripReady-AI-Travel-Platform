import fs from 'fs';
import path from 'path';

const DATA_FILE = 'src/data/index.js';
const PEXELS_KEY = "YQYRDVubERjsu4wHacREVKfAJdMBKjsJawtRREAKQQCFyE408pq5oeBw";
const PIXABAY_KEY = "25085477-64457aa3004ffe076ffb1989c";

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const snowData = [
  { name: 'Zermatt', country: 'Switzerland', flag: '🇨🇭', query: 'Zermatt winter snow', highlight: 'A car-free, luxury alpine wonderland nestled at the foot of the iconic Matterhorn mountain. Horses draw sleds through the snow, and the entire village looks like a living postcard.', vibe: 'Cozy chalets, world-class skiing, and upscale winter romance.' },
  { name: 'Hallstatt', country: 'Austria', flag: '🇦🇹', query: 'Hallstatt winter snow', highlight: 'A historic lakeside village tucked tightly between dramatic mountains. When the snow blankets the traditional 16th-century alpine houses and the lake is perfectly still, the view is completely surreal.', vibe: 'Mind-blowing winter photography and peaceful lakeside strolls.' },
  { name: 'Shirakawa-go', country: 'Japan', flag: '🇯🇵', query: 'Shirakawa-go winter snow', highlight: 'A UNESCO World Heritage village famous for its traditional Gassho-zukuri (farmhouses with steep thatched roofs). In winter, the snow-covered homes glow warmly during illumination events.', vibe: 'A deeply cultural, magical winter experience.' },
  { name: 'Tromso', country: 'Norway', flag: '🇳🇴', query: 'Tromso northern lights snow', highlight: 'Known as the Capital of the Arctic, this lively city is surrounded by snow-capped fjords and mountains. It is one of the absolute best places on Earth to catch the Northern Lights.', vibe: 'Aurora chasing, whale watching, and cozying up in a warm waterfront cabin.' },
  { name: 'Rovaniemi', country: 'Finland', flag: '🇫🇮', query: 'Rovaniemi Lapland snow winter', highlight: 'The official hometown of Santa Claus, located right on the Arctic Circle. The landscapes look like a pure white desert of snow-heavy trees, offering glass igloos to sleep under.', vibe: 'Husky sledding, reindeer safaris, and sleeping under a glass roof.' },
  { name: 'Banff & Lake Louise', country: 'Canada', flag: '🇨🇦', query: 'Lake Louise winter snow', highlight: 'Situated deep in the Canadian Rockies. Lake Louise freezes over into a giant, natural ice-skating rink surrounded by towering glaciers in front of a majestic heritage hotel.', vibe: 'Ice skating on frozen lakes, dog sledding, and massive mountain backdrops.' },
  { name: 'Sapporo', country: 'Japan', flag: '🇯🇵', query: 'Sapporo snow festival winter', highlight: 'The snow capital of Asia. Every February, the city transforms into a massive gallery for the Sapporo Snow Festival, featuring giant, intricately carved snow and ice sculptures.', vibe: 'Incredible street festivals, legendary winter seafood, and epic city snowscapes.' },
  { name: 'Quebec City', country: 'Canada', flag: '🇨🇦', query: 'Quebec City winter snow Chateau Frontenac', highlight: 'Walled French-colonial architecture featuring the castle-like Château Frontenac looking over a snow-covered St. Lawrence River, offering classic European charm.', vibe: 'Winter carnivals, toboggan slides, and European charm without crossing the Atlantic.' },
  { name: 'Reykjavik', country: 'Iceland', flag: '🇮🇸', query: 'Reykjavik winter snow Iceland', highlight: 'A colorful, cozy coastal capital backed by snow-dusted volcanic mountains. Serves as the ultimate base before heading to frozen waterfalls and geothermal hot springs.', vibe: 'Soaking in steaming thermal pools while snow falls around you.' },
  { name: 'Malam Jabba & Kalam Valley', country: 'Pakistan', flag: '🇵🇰', query: 'Malam Jabba snow Swat winter', highlight: 'A stunning, high-altitude winter escape nestled in the Hindu Kush range. The snow views across the sweeping valleys and dense pine forests are breathtakingly beautiful.', vibe: 'Snow resorts, dramatic valley views, and crisp mountain air.' },
  { name: 'Chamonix', country: 'France', flag: '🇫🇷', query: 'Chamonix winter snow Mont Blanc', highlight: 'Sitting at the base of Mont Blanc, this legendary valley offers Aiguille du Midi cable car rides up to 12,605 feet to look down on glaciers and snow.', vibe: 'High-altitude views, extreme mountain beauty, and alpine cable cars.' },
  { name: 'Interlaken & Lauterbrunnen', country: 'Switzerland', flag: '🇨🇭', query: 'Lauterbrunnen winter snow', highlight: 'A deep, dramatic valley with 72 waterfalls (frozen in winter). From here, take a cogwheel train up to the Jungfraujoch Top of Europe to stand on a massive glacier.', vibe: 'Iconic train journeys, deep valley views, and massive glaciers.' }
];

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

async function getImagesForQuery(searchQuery, name) {
  let images = await fetchFromPexels(searchQuery, 5);
  
  if (!images || images.length === 0) {
    images = await fetchFromPexels(`${name} winter`, 5);
  }

  if (!images || images.length === 0) {
    images = await fetchFromPixabay(searchQuery, 5);
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
  fs.writeFileSync('scratch/temp_destinations_snow.js', 'export const topDestinations = ' + arrayStr);
  
  const m = await import('./temp_destinations_snow.js');
  let destinations = m.topDestinations;
  console.log(`Loaded ${destinations.length} current destinations.`);

  // 1. Clean categoryIds for current snow destinations
  console.log("Cleaning old snow references...");
  destinations.forEach(d => {
    if (d.categoryIds && d.categoryIds.includes('snow')) {
      d.categoryIds = d.categoryIds.filter(cat => cat !== 'snow');
      if (d.categoryIds.length === 0) {
        d.categoryIds = ['nature']; // Safe reassign for generic snow spots
      }
    }
  });

  // 2. Remove standard duplicate/old custom snow ids to prevent any leaks
  destinations = destinations.filter(d => !['icelandic-highlands', 'antarctica', 'annapurna-massif', 'swat'].includes(d.id));

  // Synthesize new snow destinations list sequential fetches
  let rankCounter = 1;
  const newSnowDestinations = [];

  for (let i = 0; i < snowData.length; i++) {
    const sd = snowData[i];
    const id = sd.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    
    console.log(`[${i+1}/${snowData.length}] Processing winter escape: "${sd.name}" (${sd.country})...`);
    
    // Fetch high-quality landscape Pexels/Pixabay images
    const images = await getImagesForQuery(sd.query, sd.name);
    let primaryImage = 'https://images.unsplash.com/photo-1548777123-e2169adb673d?w=1200&q=80'; // Snow fallback
    let gallery = [primaryImage, primaryImage, primaryImage, primaryImage];
    
    if (images && images.length > 0) {
      primaryImage = images[0];
      gallery = [...images];
      while (gallery.length < 4) {
        gallery.push(images[0]);
      }
      gallery = gallery.slice(0, 4);
    } else {
      console.log(`  -> Warning: No images found for "${sd.name}". Using standard fallback.`);
    }

    let dailyCost = '$80-160';
    let hotelCost = '$50-100';
    let foodCost = '$20-40';
    let transportCost = '$10-20';

    if (sd.country === 'Switzerland' || sd.country === 'Norway' || sd.country === 'Finland' || sd.country === 'Canada') {
      dailyCost = '$180-380';
      hotelCost = '$110-250';
      foodCost = '$40-80';
      transportCost = '$30-50';
    }

    const snowDest = {
      id,
      name: sd.name,
      country: sd.country,
      flag: sd.flag,
      rank: rankCounter++,
      image: primaryImage,
      preview: sd.highlight.substring(0, 100),
      description: `${sd.name} is a magical winter wonderland in ${sd.country}. ${sd.highlight}`,
      weather: {
        temp: '-5°C',
        condition: 'Heavy Snowfall',
        humidity: '85%',
        airQuality: 'Excellent'
      },
      bestTime: 'December - March',
      budget: {
        daily: dailyCost,
        hotel: hotelCost,
        food: foodCost,
        transport: transportCost
      },
      safety: 'Safe to travel',
      timezone: 'GMT+1', 
      attractions: [`Scenic Cable Car`, `Winter Ski Resort`, `Thermal Spa Springs`],
      foods: ['Warm Hot Chocolate', 'Spiced Fondue', 'Hearty Winter Soup'],
      transport: ['Snow Cable Cars', 'Sled rides', 'Ski lifts'],
      culture: 'Pack heavy insulated layering. Always check local snow and weather advisory warnings.',
      visa: 'Standard visa requirements apply to the host nation.',
      categoryIds: ['snow', 'nature'],
      gallery
    };

    newSnowDestinations.push(snowDest);
    await sleep(200); // respect rate limits
  }

  // 3. Combine and clean duplicates
  const filteredExisting = destinations.filter(d => !newSnowDestinations.some(nf => nf.id === d.id));
  const finalDestinations = [...filteredExisting, ...newSnowDestinations];
  console.log(`Total combined topDestinations length: ${finalDestinations.length}`);

  // 4. Write back to index.js
  const newArrayStr = JSON.stringify(finalDestinations, null, 2);
  const finalCode = content.slice(0, startIndex) + 'export const topDestinations = ' + newArrayStr + content.slice(endIndex);

  console.log("Writing snow back to index.js...");
  fs.writeFileSync(DATA_FILE, finalCode, 'utf8');
  console.log("Successfully rebuilt snow category in src/data/index.js!");

  // Clean up
  fs.unlinkSync('scratch/temp_destinations_snow.js');
}

run().catch(err => {
  console.error("Execution error:", err);
});
