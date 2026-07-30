import fs from 'fs';
import path from 'path';

const DATA_FILE = 'src/data/index.js';
const PEXELS_KEY = "YQYRDVubERjsu4wHacREVKfAJdMBKjsJawtRREAKQQCFyE408pq5oeBw";
const PIXABAY_KEY = "25085477-64457aa3004ffe076ffb1989c";

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const islandsData = [
  { name: 'Astola Island', country: 'Pakistan', flag: '🇵🇰', query: 'Astola Island Balochistan Pakistan', highlight: 'Uninhabited marine protected area in the Arabian Sea famous for its turquoise waters, dramatic coral cliffs, and green turtles.', vibe: 'Deep-sea diving, camping under the stars, and raw wilderness.' },
  { name: 'Churna Island', country: 'Pakistan', flag: '🇵🇰', query: 'Churna Island Karachi Pakistan marine', highlight: 'Massive barren rock formation near Karachi that transforms into a premier local hotspot for aquatic sports.', vibe: 'Snorkeling, scuba diving, cliff jumping, and jet-skiing.' },
  { name: 'Bali', country: 'Indonesia', flag: '🇮🇩', query: 'Bali beach temple Ubud', highlight: 'The ultimate island blend of spirituality, world-class surfing, luxury clifftop villas, and deep cultural roots in Ubud.', vibe: 'Yoga retreats, beach clubs, temple tours, and volcanic hikes.' },
  { name: 'Raja Ampat Islands', country: 'Indonesia', flag: '🇮🇩', query: 'Raja Ampat diving islands', highlight: 'Pristine underwater paradise consisting of an archipelago of jungle-covered limestone karst islands rising from ultra-clear waters.', vibe: 'Elite scuba diving, marine biodiversity, and sea kayaking.' },
  { name: 'Komodo Island', country: 'Indonesia', flag: '🇮🇩', query: 'Komodo island pink beach dragon', highlight: 'Prehistoric adventure famous for its pink-sand beaches and tracking the legendary Komodo dragons in the wild.', vibe: 'Wildlife spotting, trekking, and unique photography.' },
  { name: 'Boracay', country: 'Philippines', flag: '🇵🇭', query: 'Boracay White Beach island', highlight: 'A tiny island world-famous for White Beach, featuring powdery sands that never get hot, paired with intense nightlife.', vibe: 'White Beach paradise, nightlife, and water sports.' },
  { name: 'Phuket', country: 'Thailand', flag: '🇹🇭', query: 'Phuket beach island resort', highlight: 'Thailand\'s largest island, offering a high-energy mix of luxury rainforest resorts, hidden coves, and lively night markets.', vibe: 'Resort luxury, island hopping, and vibrant nightlife.' },
  { name: 'Maldives', country: 'Maldives', flag: '🇲🇻', query: 'Maldives water villa bungalow private resort', highlight: 'The global benchmark for romance—a sprawling chain of coral atolls defined by overwater bungalows and private resorts.', vibe: 'Overwater luxury villas, coral reefs, and romantic escapes.' },
  { name: 'Bora Bora', country: 'French Polynesia', flag: '🇵🇫', query: 'Bora Bora lagoon overwater bungalow', highlight: 'A jaw-dropping South Pacific fantasy where a sharp, emerald-green volcanic peak rises directly out of a neon-blue barrier reef lagoon.', vibe: 'Lagoon cruises, luxurious overwater bungalows, and barrier reefs.' },
  { name: 'Fiji Islands', country: 'Fiji', flag: '🇫🇯', query: 'Fiji islands mamanuca yasawa beach resort', highlight: 'Famous for Mamanuca and Yasawa groups, incredibly warm hospitality, world-class drift diving, and remote luxury hideaways.', vibe: 'Warm local hospitality, drift diving, and remote luxury.' },
  { name: 'Whitsunday Islands', country: 'Australia', flag: '🇦🇺', query: 'Whitsunday islands Whitehaven beach Australia', highlight: 'Home to Whitehaven Beach, a magnificent stretch of 98% pure silica sand swirling elegantly with shifting blue tides.', vibe: 'Silica sand beach walks, sailing cruises, and Great Barrier Reef gateway.' },
  { name: 'Santorini', country: 'Greece', flag: '🇬🇷', query: 'Santorini dome sunset caldera Greece', highlight: 'Volcanic caldera cliffs lined with white-washed buildings, blue-domed churches, and legendary sunset viewpoints.', vibe: 'Honeymoons, wine tasting, and premium boutique stays.' },
  { name: 'Mykonos', country: 'Greece', flag: '🇬🇷', query: 'Mykonos windmills beach Greece', highlight: 'High-end glamour and jet-setter nightlife, famous for its historic 16th-century windmills, narrow stone alleys, and beach parties.', vibe: 'Luxury beach clubs, fine dining, and vibrant summer energy.' },
  { name: 'Crete', country: 'Greece', flag: '🇬🇷', query: 'Crete island Elafonissi beach Palace of Knossos', highlight: 'Deep history and rugged nature, blending the ancient Palace of Knossos with pink-sand lagoons and deep hiking gorges.', vibe: 'Foodies, ancient archaeology, and extensive road trips.' },
  { name: 'Ibiza', country: 'Spain', flag: '🇪🇸', query: 'Ibiza beach cove bohemian club Spain', highlight: 'The undisputed electronic music capital of the world, balancing mega-clubs with peaceful pine-covered bohemian coves.', vibe: 'Nightlife clubs, bohemian coves, and scenic pine hills.' },
  { name: 'Capri', country: 'Italy', flag: '🇮🇹', query: 'Capri blue grotto limestone island Italy', highlight: 'A dramatic, upscale limestone crag in the Bay of Naples, loved by celebrities for high-fashion shopping and the Blue Grotto.', vibe: 'Upscale shopping, Blue Grotto boat tours, and celebrity spotting.' },
  { name: 'Mallorca', country: 'Spain', flag: '🇪🇸', query: 'Mallorca cala cove limestone cliff Spain', highlight: 'A Mediterranean powerhouse featuring soaring limestone cliffs, hidden turquoise calas, and historic stone mountain villages.', vibe: 'Turquoise coves, mountain driving, and historic stone towns.' },
  { name: 'Madeira', country: 'Portugal', flag: '🇵🇹', query: 'Madeira island peak sea cliff forest Portugal', highlight: 'Atlantic volcanic island known as the Island of Eternal Spring, prized for emerald peaks, vertical sea cliffs, and botanical trails.', vibe: 'Botanical trails hiking, emerald peaks, and volcanic landscapes.' },
  { name: 'Hvar', country: 'Croatia', flag: '🇭🇷', query: 'Hvar island yacht harbor lavender Croatia', highlight: 'A sunny Adriatic gem where ancient Venetian architecture meets lavender fields and yacht-filled historic harbors.', vibe: 'Venetian history, yacht harbors, and lavender fields.' },
  { name: 'Nassau & Paradise Island', country: 'Bahamas', flag: '🇧🇸', query: 'Nassau Bahamas paradise island resort casino', highlight: 'Bustling tropical hub blending British colonial history with world-class mega-resorts, casinos, and marine waterparks.', vibe: 'Casino resorts, colonial history, and waterparks.' },
  { name: 'St. Lucia', country: 'St. Lucia', flag: '🇱🇨', query: 'St Lucia pitons volcano beach Caribbean', highlight: 'Visually defined by the Pitons—two green, volcanic spires rising straight out of the Caribbean Sea with dark-sand beaches.', vibe: 'Pitons views, volcanic hot springs, and luxury rain forest lodges.' },
  { name: 'Turks and Caicos', country: 'Turks and Caicos', flag: '🇹🇨', query: 'Grace Bay beach Providenciales Turks Caicos', highlight: 'Home to Grace Bay Beach, consistently voted one of the world\'s best beaches for its calm, flawlessly clear turquoise waters.', vibe: 'Calm turquoise waters, luxury diving, and pristine beaches.' },
  { name: 'Jamaica', country: 'Jamaica', flag: '🇯🇲', query: 'Jamaica beach waterfall jungle reggae', highlight: 'Culturally rich island powerhouse driving global music and cuisine, rich in cascading jungle waterfalls and vibrant beach towns.', vibe: 'Reggae roots culture, jerk culinary spots, and jungle waterfalls.' },
  { name: 'Aruba', country: 'Aruba', flag: '🇦🇼', query: 'Aruba beach divi divi tree Caribbean', highlight: 'Unique, sun-drenched southern Caribbean island where desert divi-divi trees grow directly alongside white sands, outside the hurricane belt.', vibe: 'Divi-divi trees beaches, desert exploration, and windsurfing.' },
  { name: 'Maui', country: 'United States', flag: '🇺🇸', query: 'Maui Hawaii beach Haleakala bamboo forest', highlight: 'Premier Pacific destination offering an epic mix of bamboo forest hikes, world-famous windsurfing, and Haleakala sunrise views.', vibe: 'Haleakala sunrise, bamboo hikes, and scenic coastal road drives.' },
  { name: 'Galapagos Islands', country: 'Ecuador', flag: '🇪🇨', query: 'Galapagos islands giant tortoise marine iguana wildlife', highlight: 'A living museum of human evolution and wildlife, where travelers walk completely unbothered among giant tortoises and marine iguanas.', vibe: 'Giant tortoises, evolutionary wildlife, and volcanic hikes.' },
  { name: 'Fernando de Noronha', country: 'Brazil', flag: '🇧🇷', query: 'Fernando de Noronha emerald bay beach Brazil', highlight: 'An ultra-exclusive volcanic archipelago with strict visitor caps, boasting some of South America\'s most dramatic, untouched bays.', vibe: 'Untouched emerald bays, marine preservation, and exclusive beach views.' },
  { name: 'Mauritius', country: 'Mauritius', flag: '🇲🇺', query: 'Mauritius island underwater waterfall resort', highlight: 'Spectacular island encircled by coral reefs, luxury resorts, and the famous underwater waterfall optical illusion.', vibe: 'Cultural melting pot, reef protection, and luxury resorts.' },
  { name: 'Zanzibar', country: 'Tanzania', flag: '🇹🇿', query: 'Zanzibar stone town spice island beach', highlight: 'Historic spice island where African, Arab, and Indian cultures fuse seamlessly within the winding alleys of Stone Town.', vibe: 'Stone Town history, spice farm tours, and white-sand beaches.' },
  { name: 'Seychelles', country: 'Seychelles', flag: '🇸🇨', query: 'Seychelles beach granite boulders Praslin Digue La', highlight: 'Famous for Anse Source d’Argent, a striking beach defined by massive, smooth pink granite boulders sitting in shallow waters.', vibe: 'Granite boulder beaches, premium privacy, and pristine shallow lagoons.' },
  { name: 'Nosy Be', country: 'Madagascar', flag: '🇲🇬', query: 'Nosy Be island crater lake Madagascar lemur', highlight: 'Fragrant, ylang-ylang scented island gateway known for its volcanic crater lakes, rare lemurs, and untouched coral reefs.', vibe: 'Ylang-ylang scent forests, crater lakes, and lemur tracking.' }
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
    images = await fetchFromPexels(`${name} island tropical beach`, 5);
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
  fs.writeFileSync('scratch/temp_destinations_islands.js', 'export const topDestinations = ' + arrayStr);
  
  const m = await import('./temp_destinations_islands.js');
  let destinations = m.topDestinations;
  console.log(`Loaded ${destinations.length} current destinations.`);

  // 1. Clean categoryIds for current island destinations
  console.log("Cleaning old islands references...");
  destinations.forEach(d => {
    if (d.categoryIds && d.categoryIds.includes('islands')) {
      d.categoryIds = d.categoryIds.filter(cat => cat !== 'islands');
      if (d.categoryIds.length === 0) {
        d.categoryIds = ['beaches']; // Safe reassign
      }
    }
  });

  // 2. Remove standard duplicate/old custom island spots to prevent any leaks
  destinations = destinations.filter(d => !['bali', 'santorini', 'maldives', 'phuket', 'bora-bora', 'mykonos', 'raja-ampat', 'galapagos-islands', 'mykonoswindmills-885', 'mykonoswindmills-44'].includes(d.id));

  // Synthesize new islands list sequential fetches
  let rankCounter = 1;
  const newIslandDestinations = [];

  for (let i = 0; i < islandsData.length; i++) {
    const isd = islandsData[i];
    const id = isd.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    
    console.log(`[${i+1}/${islandsData.length}] Processing island: "${isd.name}" (${isd.country})...`);
    
    // Fetch high-quality landscape Pexels/Pixabay images
    const images = await getImagesForQuery(isd.query, isd.name);
    let primaryImage = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80'; // Beach fallback
    let gallery = [primaryImage, primaryImage, primaryImage, primaryImage];
    
    if (images && images.length > 0) {
      primaryImage = images[0];
      gallery = [...images];
      while (gallery.length < 4) {
        gallery.push(images[0]);
      }
      gallery = gallery.slice(0, 4);
    } else {
      console.log(`  -> Warning: No images found for "${isd.name}". Using standard fallback.`);
    }

    let dailyCost = '$70-150';
    let hotelCost = '$45-100';
    let foodCost = '$15-30';
    let transportCost = '$8-15';

    if (isd.country === 'Switzerland' || isd.country === 'Greece' || isd.country === 'Italy' || isd.country === 'Spain' || isd.country === 'Australia' || isd.country === 'United States' || isd.country === 'Bahamas' || isd.country === 'Turks and Caicos' || isd.country === 'Maldives' || isd.country === 'French Polynesia') {
      dailyCost = '$180-380';
      hotelCost = '$110-250';
      foodCost = '$40-80';
      transportCost = '$25-45';
    }

    const islandDest = {
      id,
      name: isd.name,
      country: isd.country,
      flag: isd.flag,
      rank: rankCounter++,
      image: primaryImage,
      preview: isd.highlight.substring(0, 100),
      description: `${isd.name} is a world-renowned tropical sanctuary in ${isd.country}. ${isd.highlight}`,
      weather: {
        temp: '28°C',
        condition: 'Sunny Shore',
        humidity: '70%',
        airQuality: 'Excellent'
      },
      bestTime: 'December - April',
      budget: {
        daily: dailyCost,
        hotel: hotelCost,
        food: foodCost,
        transport: transportCost
      },
      safety: 'Safe to travel',
      timezone: 'GMT+1', 
      attractions: [`Scenic Tropical Beach`, `Marine Coral Sanctuary`, `Sunset Outlook Point`],
      foods: ['Fresh Ocean Seafood', 'Chilled Tropical Coconut', 'Traditional Spiced Specialties'],
      transport: ['Coastal Speedboats', 'Ferry networks', 'Island rental scooters'],
      culture: 'Maintain clean beaches. Respect marine wildlife conservation protocols strictly.',
      visa: 'Standard visa requirements apply to the host nation.',
      categoryIds: ['islands', 'beaches'],
      gallery
    };

    newIslandDestinations.push(islandDest);
    await sleep(200); // respect rate limits
  }

  // 3. Combine and clean duplicates
  const filteredExisting = destinations.filter(d => !newIslandDestinations.some(nf => nf.id === d.id));
  const finalDestinations = [...filteredExisting, ...newIslandDestinations];
  console.log(`Total combined topDestinations length: ${finalDestinations.length}`);

  // 4. Write back to index.js
  const newArrayStr = JSON.stringify(finalDestinations, null, 2);
  const finalCode = content.slice(0, startIndex) + 'export const topDestinations = ' + newArrayStr + content.slice(endIndex);

  console.log("Writing islands back to index.js...");
  fs.writeFileSync(DATA_FILE, finalCode, 'utf8');
  console.log("Successfully rebuilt islands category in src/data/index.js!");

  // Clean up
  fs.unlinkSync('scratch/temp_destinations_islands.js');
}

run().catch(err => {
  console.error("Execution error:", err);
});
