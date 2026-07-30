import fs from 'fs';
import path from 'path';

const DATA_FILE = 'src/data/index.js';
const PEXELS_KEY = "YQYRDVubERjsu4wHacREVKfAJdMBKjsJawtRREAKQQCFyE408pq5oeBw";
const PIXABAY_KEY = "25085477-64457aa3004ffe076ffb1989c";

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const forestsData = [
  { name: 'Changa Manga Forest', country: 'Pakistan', flag: '🇵🇰', highlight: 'One of the largest man-made, hand-planted forests in the world, featuring a historic miniature train ride, a wildlife park, and boating lakes.', vibe: 'Eco-Tourism, Family Picnics, Heritage Train Rides' },
  { name: 'Juniper Forest of Ziarat', country: 'Pakistan', flag: '🇵🇰', highlight: 'One of the oldest and largest ecosystem patches of Juniper trees on Earth, with some trees believed to be over 5,000 years old, offering crisp alpine air.', vibe: 'Hiking, Ancient Nature, Mountain Retreats' },
  { name: 'Arashiyama Bamboo Grove', country: 'Japan', flag: '🇯🇵', highlight: 'A surreal, towering forest of emerald-green bamboo stalks with a meditative wind-whispering walkway.', vibe: 'Photography, Zen Meditation, Walking Tours' },
  { name: 'Yakushima Forest', country: 'Japan', flag: '🇯🇵', highlight: 'A mystical, moss-covered ancient rainforest featuring cedar trees thousands of years old, which inspired Ghibli\'s Princess Mononoke.', vibe: 'Mystical Hiking, Photography, Deep Wilderness' },
  { name: 'Sagano Bamboo Forests', country: 'Taiwan/China', flag: '🗺️', highlight: 'Rich, high-altitude bamboo biomes offering pristine eco-trails and misty mountain viewing decks.', vibe: 'Eco-Trails, Mountain Views, Hiking' },
  { name: 'Daintree Rainforest', country: 'Australia', flag: '🇦🇺', highlight: 'Universally celebrated as the oldest continuously surviving tropical rainforest on Earth (over 180 million years old), meeting the Great Barrier Reef.', vibe: 'Ancient Jungle, Reef Meets Rainforest, Eco-Tourism' },
  { name: 'Redwood Whakarewarewa Forest', country: 'New Zealand', flag: '🇳🇿', highlight: 'A magnificent grove of exotic California Redwoods, famous for its structural Treewalk suspended up to 20 meters high.', vibe: 'Treewalk Adventure, Giant Redwoods, Canopy Walks' },
  { name: 'The Black Forest', country: 'Germany', flag: '🇩🇪', highlight: 'A sprawling pine canopy birthplace of Brothers Grimm folklore, thermal spa towns, cuckoo clocks, and cherry cakes.', vibe: 'Fairy-Tale Folklore, Hiking, Luxury Thermal Spas' },
  { name: 'Crooked Forest', country: 'Poland', flag: '🇵🇱', highlight: 'A bizarre and captivating botanical mystery featuring approximately 400 pine trees structurally curved at a sharp 90-degree angle near their base.', vibe: 'Botanical Mystery, Photography, Curious Nature' },
  { name: 'Hallerbos Blue Forest', country: 'Belgium', flag: '🇧🇪', highlight: 'A fairytale woodland that turns into a vibrant, violet-blue carpet every spring when millions of wild bluebells blossom simultaneously.', vibe: 'Bluebell Blossoms, Fairytale walks, Spring Nature' },
  { name: 'Białowieża Primeval Forest', country: 'Poland / Belarus', flag: '🗺️', highlight: 'One of the last and largest remaining parts of the immense primeval European plain forest, home to European bisons.', vibe: 'Primeval Wilderness, Bison Tracking, Deep Eco-Tourism' },
  { name: 'Redwood National Parks', country: 'United States', flag: '🇺🇸', highlight: 'Home to the tallest living trees on the planet, with cathedral-like redwood trunks stretching up to 350+ feet.', vibe: 'Epic Road Trips, Giant Trees, Coastal Hikes' },
  { name: 'Tongass National Forest', country: 'United States', flag: '🇺🇸', highlight: 'The largest national forest in the US, encompassing old-growth trees, glaciers, deep fjords, and abundant grizzly bears.', vibe: 'Glacial Trails, Primate/Wildlife Spotting, Kayaking' },
  { name: 'Amazon Rainforest', country: 'Brazil', flag: '🇧🇷', highlight: 'The world\'s largest, most bio-diverse tropical rainforest, offering jungle safaris, expedition cruises, and unique wildlife.', vibe: 'Expedition Cruises, Jungle Safaris, Birdwatching' },
  { name: 'Congo Basin Rainforest', country: 'Congo', flag: '🇨🇬', highlight: 'The world\'s second-largest tropical rainforest, sought after for tracking rare lowland gorillas and forest elephants.', vibe: 'Extreme Adventure, Primate Safaris, Conservation Tourism' },
  { name: 'Baobab Avenue & Tsingy', country: 'Madagascar', flag: '🇲🇬', highlight: 'Striking alien-like landscapes where massive Baobab trees line dusty tracks, leading to unique lemur species and stone arches.', vibe: 'Baobab Photography, Rare Lemur Wildlife, Extreme Landscapes' }
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

async function getImagesForQuery(forestName, countryName) {
  let query = `${forestName} ${countryName || ''}`;
  let images = await fetchFromPexels(query, 5);
  
  if (!images || images.length === 0) {
    query = `${forestName} forest`;
    images = await fetchFromPexels(query, 5);
  }

  if (!images || images.length === 0) {
    query = `${forestName}`;
    images = await fetchFromPixabay(query, 5);
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
  fs.writeFileSync('scratch/temp_destinations_forests.js', 'export const topDestinations = ' + arrayStr);
  
  const m = await import('./temp_destinations_forests.js');
  let destinations = m.topDestinations;
  console.log(`Loaded ${destinations.length} current destinations.`);

  // 1. Clean categoryIds for current forests (either reassign or clean)
  console.log("Cleaning old forests references...");
  destinations.forEach(d => {
    if (d.categoryIds && d.categoryIds.includes('forests')) {
      d.categoryIds = d.categoryIds.filter(cat => cat !== 'forests');
      if (d.categoryIds.length === 0) {
        d.categoryIds = ['historical', 'cultural']; // Safe reassign for Sintra
      }
    }
  });

  // 2. We also completely remove old forest destinations to make a fresh start!
  destinations = destinations.filter(d => !['sintra', 'borneo-rainforest', 'yellowstone-ecosystem', 'sigiriya-rock-fortress', 'sintra-cultural-landscape'].includes(d.id));

  // Synthesize new forests list sequential fetches
  let rankCounter = 1;
  const newForestDestinations = [];

  for (let i = 0; i < forestsData.length; i++) {
    const fd = forestsData[i];
    const id = fd.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    
    console.log(`[${i+1}/${forestsData.length}] Processing forest: "${fd.name}" (${fd.country})...`);
    
    // Fetch high-quality landscape Pexels/Pixabay images
    const images = await getImagesForQuery(fd.name, fd.country);
    let primaryImage = 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=80'; // Forest fallback
    let gallery = [primaryImage, primaryImage, primaryImage, primaryImage];
    
    if (images && images.length > 0) {
      primaryImage = images[0];
      gallery = [...images];
      while (gallery.length < 4) {
        gallery.push(images[0]);
      }
      gallery = gallery.slice(0, 4);
    } else {
      console.log(`  -> Warning: No images found for "${fd.name}". Using standard fallback.`);
    }

    const dailyCost = '$70-150';
    const hotelCost = '$45-100';
    const foodCost = '$15-30';
    const transportCost = '$8-15';

    const forestDest = {
      id,
      name: fd.name,
      country: fd.country,
      flag: fd.flag,
      rank: rankCounter++,
      image: primaryImage,
      preview: fd.highlight.substring(0, 100),
      description: `${fd.name} is a majestic woodland retreat in ${fd.country}. ${fd.highlight}`,
      weather: {
        temp: '22°C',
        condition: 'Misty & Fresh',
        humidity: '75%',
        airQuality: 'Excellent'
      },
      bestTime: 'April - October',
      budget: {
        daily: dailyCost,
        hotel: hotelCost,
        food: foodCost,
        transport: transportCost
      },
      safety: 'Safe to travel',
      timezone: 'GMT+1', 
      attractions: [`Eco Trails Walk`, `Wildlife Sanctuary`, `Scenic Overlook Deck`],
      foods: ['Local Forest Berries', 'Herbal Honey Tea', 'Regional Organic Stew'],
      transport: ['Hiker Footpaths', 'Nature shuttle bus', 'Bicycle paths'],
      culture: 'Maintain absolute environmental cleanliness. Preserve flora and fauna without disruption.',
      visa: 'Standard visa requirements apply to the host nation.',
      categoryIds: ['forests', 'nature'],
      gallery
    };

    newForestDestinations.push(forestDest);
    await sleep(200); // respect rate limits
  }

  // 3. Combine and clean duplicates
  const filteredExisting = destinations.filter(d => !newForestDestinations.some(nf => nf.id === d.id));
  const finalDestinations = [...filteredExisting, ...newForestDestinations];
  console.log(`Total combined topDestinations length: ${finalDestinations.length}`);

  // 4. Write back to index.js
  const newArrayStr = JSON.stringify(finalDestinations, null, 2);
  const finalCode = content.slice(0, startIndex) + 'export const topDestinations = ' + newArrayStr + content.slice(endIndex);

  console.log("Writing forests back to index.js...");
  fs.writeFileSync(DATA_FILE, finalCode, 'utf8');
  console.log("Successfully rebuilt forests category in src/data/index.js!");

  // Clean up
  fs.unlinkSync('scratch/temp_destinations_forests.js');
}

run().catch(err => {
  console.error("Execution error:", err);
});
