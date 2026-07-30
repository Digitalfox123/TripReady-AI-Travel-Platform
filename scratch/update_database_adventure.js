import fs from 'fs';
import path from 'path';

const DATA_FILE = 'src/data/index.js';
const PEXELS_KEY = "YQYRDVubERjsu4wHacREVKfAJdMBKjsJawtRREAKQQCFyE408pq5oeBw";
const PIXABAY_KEY = "25085477-64457aa3004ffe076ffb1989c";

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const adventureData = [
  { name: 'Queenstown', country: 'New Zealand', flag: '🇳🇿', query: 'Queenstown bungee jumping Nevis canyon bungy', highlight: 'Globally celebrated as the Adventure Capital of the World, offering commercial Nevis canyon bungee leaps and high-speed jet boating.', vibe: 'Adrenaline, Gravity Thrills, Canyon Swings' },
  { name: 'Interlaken Adventure', country: 'Switzerland', flag: '🇨🇭', query: 'Interlaken skydiving paragliding Swiss Alps', highlight: 'Europe\'s premier hub for skydiving, hang-gliding, and paragliding directly over snow-capped Swiss peaks and deep green valleys.', vibe: 'Helicopter Skydiving, Aerial Views, Mountain Gliding' },
  { name: 'Victoria Falls Adventure', country: 'Zimbabwe', flag: '🇿🇼', query: 'Victoria Falls bungee jump Zambezi bridge', highlight: 'Plunge 111 meters off the historic Victoria Falls Bridge directly toward the wild rapids of the Zambezi River.', vibe: 'Falls Bungee Jumping, River Swings, Canyon Plunges' },
  { name: 'K2 Base Camp Concordia', country: 'Pakistan', flag: '🇵🇰', query: 'K2 base camp Concordia trek Karakoram', highlight: 'Ultimate high-altitude wilderness trek through the Karakoram Range to Concordia glacier confluence, flanked by gigantic peaks.', vibe: 'Extreme Wilderness, Alpine Glacial Trekking, Mountaineering' },
  { name: 'Inca Trail', country: 'Peru', flag: '🇵🇪', query: 'Inca Trail Machu Picchu hike trek', highlight: 'Epic historic hike traversing high-altitude Andean cloud forests, ancient pass runs, and pristine Inca ruins ending at the Sun Gate.', vibe: 'Historic Hiking, Andean cloud forests, Trekking' },
  { name: 'Uhuru Peak Kilimanjaro', country: 'Tanzania', flag: '🇹🇿', query: 'Mount Kilimanjaro climb trek Uhuru peak', highlight: 'Climbing the highest freestanding mountain on Earth through five distinct ecological climate zones to its arctic glacier crown.', vibe: 'High-Altitude Ridge Hiking, Volcanic Ascent, Peak Climbing' },
  { name: 'Zambezi Whitewater Rafting', country: 'Zimbabwe', flag: '🇿🇼', query: 'Zambezi river rafting white water rapids', highlight: 'Navigate the wildest, most intense commercially runnable Class V Whitewater Rafting rapids directly below Victoria Falls.', vibe: 'Class V Whitewater, Wild River Rafting, Hydrospeeding' },
  { name: 'Great Barrier Reef Diving', country: 'Australia', flag: '🇦🇺', query: 'Great Barrier Reef scuba diving Coral Sea marine', highlight: 'Elite remote ribbon reef diving liveaboard adventures swimming with manta rays, sea turtles, and pristine coral structures.', vibe: 'Deep Scuba Diving, Marine Wildlife, Coral Exploration' },
  { name: 'Raja Ampat Marine', country: 'Indonesia', flag: '🇮🇩', query: 'Raja Ampat diving kayak limestone islands', highlight: 'Explore the most bio-diverse marine habitats on Earth via remote island sea-kayaking, cave dives, and hidden blue lagoons.', vibe: 'Lagoon Kayaking, Caves Diving, Pristine Snorkeling' },
  { name: 'Cerro Negro Volcano Boarding', country: 'Nicaragua', flag: '🇳🇮', query: 'Cerro Negro volcano boarding sliding black ash', highlight: 'Hike up an active, charcoal-black volcano and sled down its 41-degree ash slope on a wooden board at speeds up to 80 km/h.', vibe: 'Active Volcano Boarding, High-Speed Ash Sliding' },
  { name: 'Moab Slot Canyons', country: 'United States', flag: '🇺🇸', query: 'Moab slickrock mountain bike off road slot canyon', highlight: 'Timeless playground for extreme red-rock off-roading, mountain biking the famous Slickrock Trail, and deep slot canyoning.', vibe: 'Slickrock Mountain Biking, 4x4 Backcountry, Slot Canyoning' },
  { name: 'Vatnajokull Ice Caves', country: 'Iceland', flag: '🇮🇸', query: 'Vatnajokull ice cave glacier climbing Iceland', highlight: 'Explore immense, glowing neon-blue subterranean ice caves and climb vertical glacial ice sheets using specialized gear.', vibe: 'Glacial Ice Climbing, Neon Ice Caves, Snowmobiling' }
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
    images = await fetchFromPexels(`${name} adventure adrenaline`, 5);
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
  fs.writeFileSync('scratch/temp_destinations_adventure.js', 'export const topDestinations = ' + arrayStr);
  
  const m = await import('./temp_destinations_adventure.js');
  let destinations = m.topDestinations;
  console.log(`Loaded ${destinations.length} current destinations.`);

  // 1. Clean categoryIds for current adventure destinations
  console.log("Cleaning old adventure references...");
  destinations.forEach(d => {
    if (d.categoryIds && d.categoryIds.includes('adventure')) {
      d.categoryIds = d.categoryIds.filter(cat => cat !== 'adventure');
      if (d.categoryIds.length === 0) {
        d.categoryIds = ['nature']; // Safe reassign
      }
    }
  });

  // 2. Remove standard duplicate/old custom adventure spots to prevent any leaks
  destinations = destinations.filter(d => !['queenstown', 'chamonix', 'k2-base-camp-concordia', 'moab-slot-canyons'].includes(d.id));

  // Synthesize new adventure list sequential fetches
  let rankCounter = 1;
  const newAdventureDestinations = [];

  for (let i = 0; i < adventureData.length; i++) {
    const ad = adventureData[i];
    const id = ad.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    
    console.log(`[${i+1}/${adventureData.length}] Processing adventure spot: "${ad.name}" (${ad.country})...`);
    
    // Fetch high-quality landscape Pexels/Pixabay images
    const images = await getImagesForQuery(ad.query, ad.name);
    let primaryImage = 'https://images.unsplash.com/photo-1533240332313-0db49b439ad3?w=1200&q=80'; // Adventure fallback
    let gallery = [primaryImage, primaryImage, primaryImage, primaryImage];
    
    if (images && images.length > 0) {
      primaryImage = images[0];
      gallery = [...images];
      while (gallery.length < 4) {
        gallery.push(images[0]);
      }
      gallery = gallery.slice(0, 4);
    } else {
      console.log(`  -> Warning: No images found for "${ad.name}". Using standard fallback.`);
    }

    let dailyCost = '$60-120';
    let hotelCost = '$35-80';
    let foodCost = '$15-30';
    let transportCost = '$8-15';

    if (ad.country === 'Switzerland' || ad.country === 'New Zealand' || ad.country === 'Australia' || ad.country === 'United States') {
      dailyCost = '$180-350';
      hotelCost = '$110-240';
      foodCost = '$35-70';
      transportCost = '$25-45';
    }

    const adDest = {
      id,
      name: ad.name,
      country: ad.country,
      flag: ad.flag,
      rank: rankCounter++,
      image: primaryImage,
      preview: ad.highlight.substring(0, 100),
      description: `${ad.name} is a legendary high-adrenaline retreat in ${ad.country}. ${ad.highlight}`,
      weather: {
        temp: '22°C',
        condition: 'Fresh & Windy',
        humidity: '60%',
        airQuality: 'Excellent'
      },
      bestTime: 'May - September',
      budget: {
        daily: dailyCost,
        hotel: hotelCost,
        food: foodCost,
        transport: transportCost
      },
      safety: 'Safe (use certified guides)',
      timezone: 'GMT+12', 
      attractions: [`Thrill Launch Pad`, `Canyon Bungee Platform`, `Glacial Crest Overlook`],
      foods: ['Local Energy Platters', 'High-Protein Trail Bars', 'Regional Warm Broth'],
      transport: ['Harness shuttle rigs', 'Trek path guide lines', 'Cable cars & shuttles'],
      culture: 'Strictly respect wildlife habitats. Follow safety gear lock guidelines strictly.',
      visa: 'Standard visa requirements apply to the host nation.',
      categoryIds: ['adventure', 'nature'],
      gallery
    };

    newAdventureDestinations.push(adDest);
    await sleep(200); // respect rate limits
  }

  // 3. Combine and clean duplicates
  const filteredExisting = destinations.filter(d => !newAdventureDestinations.some(nf => nf.id === d.id));
  const finalDestinations = [...filteredExisting, ...newAdventureDestinations];
  console.log(`Total combined topDestinations length: ${finalDestinations.length}`);

  // 4. Write back to index.js
  const newArrayStr = JSON.stringify(finalDestinations, null, 2);
  const finalCode = content.slice(0, startIndex) + 'export const topDestinations = ' + newArrayStr + content.slice(endIndex);

  console.log("Writing adventure back to index.js...");
  fs.writeFileSync(DATA_FILE, finalCode, 'utf8');
  console.log("Successfully rebuilt adventure category in src/data/index.js!");

  // Clean up
  fs.unlinkSync('scratch/temp_destinations_adventure.js');
}

run().catch(err => {
  console.error("Execution error:", err);
});
