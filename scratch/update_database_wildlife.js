import fs from 'fs';
import path from 'path';

const DATA_FILE = 'src/data/index.js';
const PEXELS_KEY = "YQYRDVubERjsu4wHacREVKfAJdMBKjsJawtRREAKQQCFyE408pq5oeBw";
const PIXABAY_KEY = "25085477-64457aa3004ffe076ffb1989c";

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const wildlifeData = [
  { name: 'Maasai Mara & Serengeti', country: 'Kenya', flag: '🇰🇪', query: 'Maasai Mara migration safari lion Serengeti', highlight: 'Witness the iconic Great Wildebeest Migration, watching millions of zebras and wildebeests leap across crocodile-infested rivers.', vibe: 'Apex Predator tracking, Great Migration safari, and balloon tours' },
  { name: 'Kruger National Park', country: 'South Africa', flag: '🇿🇦', query: 'Kruger national park big five safari elephant', highlight: 'The absolute best destination on Earth for spotting the entire "Big Five" (Lion, Leopard, Elephant, Rhino, and Buffalo) in a single day.', vibe: 'Luxury safari lodges, guided walking treks, and raw bushveld tours' },
  { name: 'Ranthambore National Park', country: 'India', flag: '🇮🇳', query: 'Ranthambore tiger safari bengal tiger fortress', highlight: 'Track the majestic Royal Bengal Tiger, leopards, and sloth bears through ancient, crumbling jungle fortress ruins.', vibe: 'Jungle Book fortress treks, Bengal tiger tracking, and wildlife photography' },
  { name: 'Bwindi & Volcanoes National Park', country: 'Uganda', flag: '🇺🇬', query: 'Bwindi gorilla trekking volcanoes park mountain silverback', highlight: 'Hack through dense, misty cloud forest mountains with expert trackers to stand face-to-face with an endangered massive Silverback mountain gorilla.', vibe: 'Silverback Gorilla trekking, remote rainforest treks, and conservation walks' },
  { name: 'Tanjung Puting National Park', country: 'Indonesia', flag: '🇮🇩', query: 'Tanjung Puting orangutan Borneo river boat klotok', highlight: 'Live on a klotok (traditional wooden river boat) to cruise down dark jungle rivers, watching wild orangutans and proboscis monkeys swing above you.', vibe: 'Orangutan river cruises, pristine jungle rivers, and primate safaris' },
  { name: 'Galapagos Islands Wildlife', country: 'Ecuador', flag: '🇪🇨', query: 'Galapagos sea lion beach giant tortoise marine iguana', highlight: 'A living laboratory of evolution where the wildlife has zero fear of humans, letting you walk directly alongside sea lions and giant tortoises.', vibe: 'Giant tortoises, marine iguanas, evolutionary snorkeling, and wildlife walks' },
  { name: 'Antarctica & South Georgia', country: 'Antarctica', flag: '🇦🇶', query: 'Antarctica penguin beach South Georgia king penguins glacier', highlight: 'Sail past colossal blue icebergs on expedition ships to explore beaches packed with over 100,000 King penguins as far as the eye can see.', vibe: 'Polar cruises, King penguin beach treks, and glacial whale watching' },
  { name: 'Churchill polar bears', country: 'Canada', flag: '🇨🇦', query: 'Churchill polar bear tundra buggy Hudson bay', highlight: 'Known as the Polar Bear Capital of the World, offering tundra buggy rides onto the frozen shores of Hudson Bay to watch massive polar bears.', vibe: 'Polar bear tundra buggy tours, beluga whale kayaking, and arctic wilderness' },
  { name: 'The Pantanal Wetlands', country: 'Brazil', flag: '🇧🇷', query: 'Pantanal jaguar hunting river wetlands capybara', highlight: 'The world\'s largest tropical wetland, making it the absolute best spot to successfully view wild jaguars hunting along open riverbanks.', vibe: 'Jaguar river safaris, tropical wetlands photography, and birdwatching' },
  { name: 'Kangaroo Island Outback', country: 'Australia', flag: '🇦🇺', query: 'Kangaroo Island koala kangaroo outback beach', highlight: 'Rugged red-dirt coastal adventures serving as a giant zoo without fences, where wild koalas sleep in eucalyptus trees.', vibe: 'Wild koala spotting, kangaroo beach crawls, and red-dirt outback safaris' },
  { name: 'Khunjerab & Deosai Plains', country: 'Pakistan', flag: '🇵🇰', query: 'Deosai brown bear Khunjerab snow leopard Karakoram', highlight: 'Track the incredibly elusive Snow Leopard, Markhor, Himalayan brown bears, and Himalayan ibex in raw high-altitude mountain valleys.', vibe: 'Snow leopard alpine tracking, brown bear plateau safaris, and raw mountain wilderness' }
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
    images = await fetchFromPexels(`${name} safari wildlife animals`, 5);
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
  fs.writeFileSync('scratch/temp_destinations_wildlife.js', 'export const topDestinations = ' + arrayStr);
  
  const m = await import('./temp_destinations_wildlife.js');
  let destinations = m.topDestinations;
  console.log(`Loaded ${destinations.length} current destinations.`);

  // 1. Clean categoryIds for current wildlife destinations
  console.log("Cleaning old wildlife references...");
  destinations.forEach(d => {
    if (d.categoryIds && d.categoryIds.includes('wildlife')) {
      d.categoryIds = d.categoryIds.filter(cat => cat !== 'wildlife');
      if (d.categoryIds.length === 0) {
        d.categoryIds = ['nature']; // Safe reassign
      }
    }
  });

  // 2. Remove standard duplicate/old custom wildlife spots to prevent any leaks
  destinations = destinations.filter(d => !['serengeti-national-park', 'pantanal-wetlands', 'okavango-delta', 'kruger-national-park', 'la-jolla-cove', 'galapagos-islands', 'antarctica'].includes(d.id));

  // Synthesize new wildlife list sequential fetches
  let rankCounter = 1;
  const newWildlifeDestinations = [];

  for (let i = 0; i < wildlifeData.length; i++) {
    const wd = wildlifeData[i];
    const id = wd.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    
    console.log(`[${i+1}/${wildlifeData.length}] Processing wildlife spot: "${wd.name}" (${wd.country})...`);
    
    // Fetch high-quality landscape Pexels/Pixabay images
    const images = await getImagesForQuery(wd.query, wd.name);
    let primaryImage = 'https://images.unsplash.com/photo-1547407139-3c921a66005c?w=1200&q=80'; // Wildlife fallback
    let gallery = [primaryImage, primaryImage, primaryImage, primaryImage];
    
    if (images && images.length > 0) {
      primaryImage = images[0];
      gallery = [...images];
      while (gallery.length < 4) {
        gallery.push(images[0]);
      }
      gallery = gallery.slice(0, 4);
    } else {
      console.log(`  -> Warning: No images found for "${wd.name}". Using standard fallback.`);
    }

    let dailyCost = '$70-150';
    let hotelCost = '$40-90';
    let foodCost = '$15-30';
    let transportCost = '$8-15';

    if (wd.country === 'South Africa' || wd.country === 'Australia' || wd.country === 'Canada' || wd.country === 'Antarctica') {
      dailyCost = '$180-360';
      hotelCost = '$110-240';
      foodCost = '$35-70';
      transportCost = '$25-45';
    }

    const wdDest = {
      id,
      name: wd.name,
      country: wd.country,
      flag: wd.flag,
      rank: rankCounter++,
      image: primaryImage,
      preview: wd.highlight.substring(0, 100),
      description: `${wd.name} is a world-class wildlife sanctuary in ${wd.country}. ${wd.highlight}`,
      weather: {
        temp: '26°C',
        condition: 'Clear Sky',
        humidity: '50%',
        airQuality: 'Excellent'
      },
      bestTime: 'May - October',
      budget: {
        daily: dailyCost,
        hotel: hotelCost,
        food: foodCost,
        transport: transportCost
      },
      safety: 'Safe (always obey ranger guidelines)',
      timezone: 'GMT+2', 
      attractions: [`Main Ranger Station`, `Wildlife Waterhole Lookout`, `Scenic Game Trail`],
      foods: ['Safari Bush Breakfast', 'Local Traditional Stew', 'Native Forest Berries'],
      transport: ['Open-top 4x4 Jeeps', 'Guided Walking Safaris', 'Tourist Shuttle Buses'],
      culture: 'Strictly maintain safety distance from animals. Never feed wildlife or litter.',
      visa: 'Standard visa requirements apply to the host nation.',
      categoryIds: ['wildlife', 'nature'],
      gallery
    };

    newWildlifeDestinations.push(wdDest);
    await sleep(200); // respect rate limits
  }

  // 3. Combine and clean duplicates
  const filteredExisting = destinations.filter(d => !newWildlifeDestinations.some(nf => nf.id === d.id));
  const finalDestinations = [...filteredExisting, ...newWildlifeDestinations];
  console.log(`Total combined topDestinations length: ${finalDestinations.length}`);

  // 4. Write back to index.js
  const newArrayStr = JSON.stringify(finalDestinations, null, 2);
  const finalCode = content.slice(0, startIndex) + 'export const topDestinations = ' + newArrayStr + content.slice(endIndex);

  console.log("Writing wildlife back to index.js...");
  fs.writeFileSync(DATA_FILE, finalCode, 'utf8');
  console.log("Successfully rebuilt wildlife category in src/data/index.js!");

  // Clean up
  fs.unlinkSync('scratch/temp_destinations_wildlife.js');
}

run().catch(err => {
  console.error("Execution error:", err);
});
