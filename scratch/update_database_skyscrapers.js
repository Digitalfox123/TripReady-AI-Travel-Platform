import fs from 'fs';
import path from 'path';

const DATA_FILE = 'src/data/index.js';
const PEXELS_KEY = "YQYRDVubERjsu4wHacREVKfAJdMBKjsJawtRREAKQQCFyE408pq5oeBw";
const PIXABAY_KEY = "25085477-64457aa3004ffe076ffb1989c";

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const skyscrapersData = [
  // Saudi Arabia
  { name: 'Kingdom Centre', city: 'Riyadh', country: 'Saudi Arabia', flag: '🇸🇦', highlight: 'The spectacular 56-meter-long Sky Bridge suspended over a massive parabolic arch, offering panoramic views of the entire capital.', vibe: 'Luxury, Architecture, City Views', rating: '★★★★★' },
  { name: 'Makkah Clock Royal Tower', city: 'Mecca', country: 'Saudi Arabia', flag: '🇸🇦', highlight: 'The centerpiece of the Abraj Al Bait complex, featuring the world’s largest clock face and towering directly over the Grand Mosque.', vibe: 'Religion, Massive Scale, Iconic Landmark', rating: '★★★★★' },
  { name: 'PIF Tower', city: 'Riyadh', country: 'Saudi Arabia', flag: '🇸🇦', highlight: 'The tallest architectural crown jewel of the futuristic King Abdullah Financial District (KAFD).', vibe: 'Modern, Business, Cyberpunk Aesthetic', rating: '★★★★★' },
  
  // UAE
  { name: 'Burj Khalifa', city: 'Dubai', country: 'United Arab Emirates', flag: '🇦🇪', highlight: 'The absolute tallest freestanding structure on Earth. Travelers flock to the "At the Top" observation decks on floors 124, 125, and 148 for literal cloud-level views.', vibe: 'Luxury, Record-Breaking, Skyline', rating: '★★★★★' },
  { name: 'Burj Al Arab', city: 'Dubai', country: 'United Arab Emirates', flag: '🇦🇪', highlight: 'The world\'s most famous sail-shaped luxury hotel skyscraper, sitting on its own man-made island.', vibe: 'Ultra-Luxury, Beach Views, Fine Dining', rating: '★★★★★' },
  
  // China & Hong Kong
  { name: 'Shanghai Tower', city: 'Shanghai', country: 'China', flag: '🇨🇳', highlight: 'A magnificent, twisted mega-tall skyscraper housing the world\'s highest observation deck inside a building (Top of Shanghai on the 118th floor).', vibe: 'Futuristic, Eco-Architecture, High-Speed Elevator', rating: '★★★★★' },
  { name: 'International Commerce Centre', city: 'Hong Kong', country: 'China', flag: '🇭🇰', highlight: 'Home to the Sky100 Observation Deck and the highest bar in the world (Ozone, on the 118th floor), overlooking the dramatic Victoria Harbour.', vibe: 'Nightlife, Fine Dining, Harbor Views', rating: '★★★★★' },
  { name: 'Canton Tower', city: 'Guangzhou', country: 'China', flag: '🇨🇳', highlight: 'A striking, twisted lattice tower famous for its open-air skywalk and bubble tram rides operating around the rim of its roof deck.', vibe: 'Adventure, Neon Lights, Cityscape', rating: '★★★★★' },
  
  // Rest of East & Southeast Asia
  { name: 'Taipei 101', city: 'Taipei', country: 'Taiwan', flag: '🇹🇼', highlight: 'Shaped like a giant, traditional bamboo stalk. Tourists can visit the 89th-floor indoor deck and view the massive, gold-colored tuned mass damper that protects the tower from earthquakes.', vibe: 'Engineering Marvel, Culture, City Views', rating: '★★★★★' },
  { name: 'Petronas Twin Towers', city: 'Kuala Lumpur', country: 'Malaysia', flag: '🇲🇾', highlight: 'The world\'s tallest twin towers. Travelers can walk across the iconic, double-decker Skybridge connecting the towers on the 41st and 42nd floors.', vibe: 'Iconic Landmark, Photography, City Parks', rating: '★★★★★' },
  { name: 'Marina Bay Sands', city: 'Singapore', cityOverride: 'Singapore', country: 'Singapore', flag: '🇸🇬', highlight: 'While technically a three-tower resort, its crowning achievement is the SkyPark—a massive surfboard-shaped cantilever terrace featuring the world’s largest rooftop infinity pool.', vibe: 'Luxury, Rooftop Pools, Nightlife', rating: '★★★★★' },
  { name: 'Lotte World Tower', city: 'Seoul', country: 'South Korea', flag: '🇰🇷', highlight: 'A sleek, glass-tapered skyscraper featuring Seoul Sky, which includes a thrilling glass-bottomed skywalk deck.', vibe: 'High-Tech, Thrill-Seeking, Sunset Views', rating: '★★★★★' },
  
  // The Americas
  { name: 'One World Trade Center', city: 'New York City', country: 'United States', flag: '🇺🇸', highlight: 'The tallest building in the Western Hemisphere. The One World Observatory offers immersive multimedia displays alongside 360-degree views of Manhattan and the Statue of Liberty.', vibe: 'History, Resilience, Epic City Views', rating: '★★★★★' },
  { name: 'Empire State Building', city: 'New York City', country: 'United States', flag: '🇺🇸', highlight: 'The world\'s most timeless Art Deco icon. Its open-air 86th-floor observatory has starred in countless Hollywood movies.', vibe: 'Classic Romance, Cinema History, Architecture', rating: '★★★★★' },
  { name: 'Willis Tower', city: 'Chicago', country: 'United States', flag: '🇺🇸', highlight: 'Home to The Ledge at Skydeck Chicago—all-glass boxes that extend four feet out from the facade, looking directly down 1,353 feet to the street below.', vibe: 'Thrill-Seeking, Architecture, Great Lakes Views', rating: '★★★★★' },
  { name: 'The Edge at 30 Hudson Yards', city: 'New York City', country: 'United States', flag: '🇺🇸', highlight: 'The highest outdoor sky deck in the Western Hemisphere, suspended mid-air with angled glass walls and a glass floor section.', vibe: 'Modern, Instagram Hotspot, Outdoor Views', rating: '★★★★★' },
  { name: 'Torre Reforma', city: 'Mexico City', country: 'Mexico', flag: '🇲🇽', highlight: 'An award-winning triangular skyscraper built to withstand massive seismic activity, seamlessly integrating a historic 1920s house at its base.', vibe: 'Sustainable Design, Culture, Urban Innovation', rating: '★★★★★' },
  { name: 'Gran Torre Santiago', city: 'Santiago', country: 'Chile', flag: '🇨🇱', highlight: 'The tallest building in South America. The Sky Costanera deck gives travelers a breathtaking, unobstructed view of the sprawling city backed by the snow-capped Andes Mountains.', vibe: 'Mountain Landscapes, Sunset, Panorama', rating: '★★★★★' },
  
  // Europe
  { name: 'The Shard', city: 'London', country: 'United Kingdom', flag: '🇬🇧', highlight: 'A jagged, spire-like glass pyramid designed by Renzo Piano. The View from The Shard offers the highest viewing point in the UK, showcasing London\'s historic bridges and the River Thames.', vibe: 'Luxury Dining, Modern Contrast, Historic City Views', rating: '★★★★★' },
  { name: 'Lakhta Center', city: 'St. Petersburg', country: 'Russia', flag: '🇷🇺', highlight: 'The tallest skyscraper in Europe, designed in the shape of a swirling flame, sitting right on the coast of the Gulf of Finland.', vibe: 'Northern Lights Aesthetic, Coastal Views', rating: '★★★★★' },
  { name: 'Commerzbank Tower', city: 'Frankfurt', country: 'Germany', flag: '🇩🇪', highlight: 'Famous for its indoor "Sky Gardens"—lush, vertically integrated atrium gardens that loop around the building\'s core.', vibe: 'Green Tourism, Modern Finance, Engineering', rating: '★★★★★' },
  { name: 'Torre Glòries', city: 'Barcelona', country: 'Spain', flag: '🇪🇸', highlight: 'A bullet-shaped glass marvel designed to mimic a geyser rising into the sky. It lights up in vibrant colors at night and features a panoramic lookout deck.', vibe: 'Mediterranean Nightlife, Pop Art Architecture', rating: '★★★★★' },
  
  // Oceania
  { name: 'Q1 Tower', city: 'Gold Coast', country: 'Australia', flag: '🇦🇺', highlight: 'One of the tallest residential towers in the world. Adventure travelers can take part in the SkyPoint Climb—an open-air guided walk up the outer harness structure at the very top of the building.', vibe: 'Adrenaline, Coastal Surf Views, Sunsets', rating: '★★★★★' },
  { name: 'Eureka Tower', city: 'Melbourne', country: 'Australia', flag: '🇦🇺', highlight: 'Home to the Melbourne Skydeck and "The Edge"—a glass cube that slides out from the 88th floor with you inside, switching from opaque to completely clear glass.', vibe: 'Interactive Tech, Panoramic City Views', rating: '★★★★★' }
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

async function getImagesForQuery(skyscraperName, cityName) {
  let query = `${skyscraperName} ${cityName || ''} skyscraper`;
  let images = await fetchFromPexels(query, 5);
  
  if (!images || images.length === 0) {
    query = `${skyscraperName} building`;
    images = await fetchFromPexels(query, 5);
  }

  if (!images || images.length === 0) {
    query = `${skyscraperName} ${cityName || ''}`;
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
  fs.writeFileSync('scratch/temp_destinations.js', 'export const topDestinations = ' + arrayStr);
  
  const m = await import('./temp_destinations.js');
  let destinations = m.topDestinations;
  console.log(`Loaded ${destinations.length} current destinations.`);

  // 1. Purge all current destinations in the 'skyscrapers' category
  console.log("Purging all old 'skyscrapers' category destinations...");
  destinations = destinations.filter(d => !(d.categoryIds && d.categoryIds.includes('skyscrapers')));
  console.log(`Destinations count after skyscrapers purge: ${destinations.length}`);

  // 2. Synthesize new skyscrapers list sequential fetches
  let rankCounter = 1;
  const newSkyscraperDestinations = [];

  for (let i = 0; i < skyscrapersData.length; i++) {
    const sd = skyscrapersData[i];
    const id = sd.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    
    console.log(`[${i+1}/${skyscrapersData.length}] Processing skyscraper: "${sd.name}" (${sd.city}, ${sd.country})...`);
    
    // Fetch high-quality landscape Pexels/Pixabay images
    const images = await getImagesForQuery(sd.name, sd.city);
    let primaryImage = 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=80'; // Skyline fallback
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

    // Default daily ranges based on country
    let dailyCost = '$90-180';
    let hotelCost = '$60-120';
    let foodCost = '$20-40';
    let transportCost = '$10-20';

    if (sd.country === 'Saudi Arabia' || sd.country === 'United Arab Emirates' || sd.country === 'Singapore' || sd.country === 'United States' || sd.country === 'United Kingdom') {
      dailyCost = '$150-350';
      hotelCost = '$100-240';
      foodCost = '$30-70';
      transportCost = '$20-40';
    }

    const skyDest = {
      id,
      name: sd.name,
      country: sd.country,
      flag: sd.flag,
      rank: rankCounter++,
      image: primaryImage,
      preview: sd.highlight.substring(0, 100),
      description: `${sd.name} is a world-class architectural masterpiece in ${sd.city}, ${sd.country}. ${sd.highlight}`,
      weather: {
        temp: '25°C',
        condition: 'Clear Sky',
        humidity: '50%',
        airQuality: 'Good'
      },
      bestTime: 'October - April',
      budget: {
        daily: dailyCost,
        hotel: hotelCost,
        food: foodCost,
        transport: transportCost
      },
      safety: 'Safe to travel',
      timezone: 'GMT+3', // placeholder, resolved dynamically on client
      attractions: [`Observation Deck`, `Sky Bridge Lobby`, `Rooftop Observatory`],
      foods: ['Fine Dining Restaurant', 'Skyline Lounge Cocktails', 'Local Spiced Specialties'],
      transport: ['High-speed Elevators', 'Metro Access Stations', 'Valet Parking'],
      culture: 'Ensure to book observation deck vouchers in advance. Dress smart-casual for rooftop dining.',
      visa: 'Visa depends on entry policies of the destination country.',
      categoryIds: ['skyscrapers'],
      gallery
    };

    newSkyscraperDestinations.push(skyDest);
    await sleep(150); // respect rate limits
  }

  // 3. Combine all non-skyscrapers destinations and the new skyscrapers
  const finalDestinations = [...destinations, ...newSkyscraperDestinations];
  console.log(`Total combined topDestinations length: ${finalDestinations.length}`);

  // 4. Write back to index.js
  const newArrayStr = JSON.stringify(finalDestinations, null, 2);
  const finalCode = content.slice(0, startIndex) + 'export const topDestinations = ' + newArrayStr + content.slice(endIndex);

  console.log("Writing skyscrapers back to index.js...");
  fs.writeFileSync(DATA_FILE, finalCode, 'utf8');
  console.log("Successfully rebuilt skyscrapers category in src/data/index.js!");

  // Clean up
  fs.unlinkSync('scratch/temp_destinations.js');
}

run().catch(err => {
  console.error("Execution error:", err);
});
