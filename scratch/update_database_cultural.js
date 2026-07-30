import fs from 'fs';
import path from 'path';

const DATA_FILE = 'src/data/index.js';
const PEXELS_KEY = "YQYRDVubERjsu4wHacREVKfAJdMBKjsJawtRREAKQQCFyE408pq5oeBw";
const PIXABAY_KEY = "25085477-64457aa3004ffe076ffb1989c";

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const culturalData = [
  // Asia
  { name: 'Angkor Wat Complex', country: 'Cambodia', flag: '🇰🇭', region: 'Asia', subCat: 'Ancient Heritage', query: 'Angkor Wat temple Cambodia complex ancient' },
  { name: 'DMZ Korean Heritage', country: 'South Korea', flag: '🇰🇷', region: 'Asia', subCat: 'Ancient Heritage', query: 'DMZ Korean border heritage Panmunjom' },
  { name: 'Silk Road Trail', country: 'Uzbekistan', flag: '🇺🇿', region: 'Asia', subCat: 'Ancient Heritage', query: 'Registan Samarkand Uzbekistan Silk Road' },
  { name: 'Badshahi Mosque Heritage', country: 'Pakistan', flag: '🇵🇰', region: 'Asia', subCat: 'Sacred Sites', query: 'Badshahi Mosque Lahore Pakistan historic' },
  { name: 'Borobudur Temple', country: 'Indonesia', flag: '🇮🇩', region: 'Asia', subCat: 'Sacred Sites', query: 'Borobudur temple Java Indonesia sunrise' },
  { name: 'National Palace Museum', country: 'Taiwan', flag: '🇹🇼', region: 'Asia', subCat: 'Arts & Museums', query: 'National Palace Museum Taipei Taiwan' },
  { name: 'Classical Indian Dance', country: 'India', flag: '🇮🇳', region: 'Asia', subCat: 'Music & Performance', query: 'Kathakali Bharatanatyam Indian classical dance' },
  { name: 'Holi Festival', country: 'India', flag: '🇮🇳', region: 'Asia', subCat: 'Festivals', query: 'Holi festival of colors India celebration' },
  { name: 'Diwali in Varanasi', country: 'India', flag: '🇮🇳', region: 'Asia', subCat: 'Festivals', query: 'Varanasi ghats diwali lamps ganga' },
  { name: 'Vesak Festival', country: 'Sri Lanka', flag: '🇱🇰', region: 'Asia', subCat: 'Festivals', query: 'Vesak festival lanterns Sri Lanka buddha' },
  { name: 'Songkran Water Festival', country: 'Thailand', flag: '🇹🇭', region: 'Asia', subCat: 'Festivals', query: 'Songkran water festival Thailand bangkok' },
  { name: 'Harbin Ice Festival', country: 'China', flag: '🇨🇳', region: 'Asia', subCat: 'Festivals', query: 'Harbin ice snow sculpture festival China' },
  { name: 'Pushkar Camel Fair', country: 'India', flag: '🇮🇳', region: 'Asia', subCat: 'Festivals', query: 'Pushkar camel fair Rajasthan India' },
  { name: 'Kyoto Geisha District', country: 'Japan', flag: '🇯🇵', region: 'Asia', subCat: 'Living Culture', query: 'Gion Kyoto geisha district Japan' },
  { name: 'Tea Ceremony Culture', country: 'Japan', flag: '🇯🇵', region: 'Asia', subCat: 'Living Culture', query: 'Japanese tea ceremony matcha traditional' },
  { name: 'Walled City of Lahore', country: 'Pakistan', flag: '🇵🇰', region: 'Asia', subCat: 'Living Culture', query: 'Lahore walled city Delhi gate street' },
  { name: 'Bali Hindu Culture', country: 'Indonesia', flag: '🇮🇩', region: 'Asia', subCat: 'Living Culture', query: 'Bali Hindu temple dance offering' },
  { name: 'Luang Prabang Alms Giving', country: 'Laos', flag: '🇱🇦', region: 'Asia', subCat: 'Living Culture', query: 'Luang Prabang alms giving ceremony monks' },
  { name: 'Food Street Lahore', country: 'Pakistan', flag: '🇵🇰', region: 'Asia', subCat: 'Culinary Heritage', query: 'Fort food street Lahore night lights' },

  // Europe
  { name: 'Louvre Museum', country: 'France', flag: '🇫🇷', region: 'Europe', subCat: 'Arts & Museums', query: 'Louvre museum pyramid Paris France' },
  { name: 'Musee d Orsay', country: 'France', flag: '🇫🇷', region: 'Europe', subCat: 'Arts & Museums', query: 'Musee d Orsay Paris inside clock' },
  { name: 'British Museum', country: 'United Kingdom', flag: '🇬🇧', region: 'Europe', subCat: 'Arts & Museums', query: 'British Museum London great court' },
  { name: 'Uffizi Gallery', country: 'Italy', flag: '🇮🇹', region: 'Europe', subCat: 'Arts & Museums', query: 'Uffizi gallery Florence Italy' },
  { name: 'Prado Museum', country: 'Spain', flag: '🇪🇸', region: 'Europe', subCat: 'Arts & Museums', query: 'Prado museum Madrid Spain' },
  { name: 'Acropolis Museum', country: 'Greece', flag: '🇬🇷', region: 'Europe', subCat: 'Arts & Museums', query: 'Acropolis museum Athens Greece' },
  { name: 'Hermitage Museum', country: 'Russia', flag: '🇷🇺', region: 'Europe', subCat: 'Arts & Museums', query: 'Hermitage museum St Petersburg winter palace' },
  { name: 'Rijksmuseum', country: 'Netherlands', flag: '🇳🇱', region: 'Europe', subCat: 'Arts & Museums', query: 'Rijksmuseum Amsterdam Netherlands' },
  { name: 'Versailles Palace & Gardens', country: 'France', flag: '🇫🇷', region: 'Europe', subCat: 'Architecture', query: 'Versailles palace hall of mirrors gardens' },
  { name: 'Vatican Museums & Sistine', country: 'Vatican City', flag: '🇻🇦', region: 'Europe', subCat: 'Sacred Sites', query: 'Vatican museum spiral staircase sistine chapel' },
  { name: 'Shakespeare Globe Theatre', country: 'United Kingdom', flag: '🇬🇧', region: 'Europe', subCat: 'Literature & Film', query: 'Shakespeare Globe Theatre London inside' },
  { name: 'Flamenco in Seville', country: 'Spain', flag: '🇪🇸', region: 'Europe', subCat: 'Music & Performance', query: 'Flamenco dancer Seville Spain traditional' },
  { name: 'Vienna State Opera', country: 'Austria', flag: '🇦🇹', region: 'Europe', subCat: 'Music & Performance', query: 'Vienna State Opera building Austria inside' },
  { name: 'Edinburgh Festival Fringe', country: 'United Kingdom', flag: '🇬🇧', region: 'Europe', subCat: 'Festivals', query: 'Edinburgh fringe festival street performance' },
  { name: 'Venice Carnival', country: 'Italy', flag: '🇮🇹', region: 'Europe', subCat: 'Festivals', query: 'Venice carnival mask costume canal' },
  { name: 'La Tomatina', country: 'Spain', flag: '🇪🇸', region: 'Europe', subCat: 'Festivals', query: 'La Tomatina festival Bunol Spain' },
  { name: 'Oktoberfest Munich', country: 'Germany', flag: '🇩🇪', region: 'Europe', subCat: 'Festivals', query: 'Oktoberfest Munich Germany beer tent festival' },

  // Africa
  { name: 'Pyramids & Egyptian Museum', country: 'Egypt', flag: '🇪🇬', region: 'Africa', subCat: 'Ancient Heritage', query: 'Giza pyramids sphinx Cairo Egypt museum' },
  { name: 'Fez Medina Heritage', country: 'Morocco', flag: '🇲🇦', region: 'Africa', subCat: 'Ancient Heritage', query: 'Fez medina souk tannery Morocco' },
  { name: 'Goree Island Slave House', country: 'Senegal', flag: '🇸🇳', region: 'Africa', subCat: 'Living Culture', query: 'Goree island house of slaves Senegal' },
  { name: 'Djemaa el Fna', country: 'Morocco', flag: '🇲🇦', region: 'Africa', subCat: 'Living Culture', query: 'Jemaa el Fna square Marrakech night' },
  { name: 'Voodoo Fetish Market', country: 'Togo', flag: '🇹🇬', region: 'Africa', subCat: 'Living Culture', query: 'Akodessewa fetish market Lome Togo voodoo' },
  { name: 'Festival au Desert', country: 'Mali', flag: '🇲🇱', region: 'Africa', subCat: 'Music & Performance', query: 'Mali tuareg music desert festival' },
  { name: 'Cape Town Jazz Festival', country: 'South Africa', flag: '🇿🇦', region: 'Africa', subCat: 'Music & Performance', query: 'Cape Town international jazz festival' },
  { name: 'Zanzibar Sauti za Busara', country: 'Tanzania', flag: '🇹🇿', region: 'Africa', subCat: 'Music & Performance', query: 'Sauti za Busara music festival Zanzibar' },
  { name: 'Lalibela Timkat', country: 'Ethiopia', flag: '🇪🇹', region: 'Africa', subCat: 'Festivals', query: 'Timkat festival Lalibela rock churches Ethiopia' },
  { name: 'Asmara Modernist City', country: 'Eritrea', flag: '🇪🇷', region: 'Africa', subCat: 'Architecture', query: 'Asmara architecture modernist Art Deco Eritrea' },

  // Americas
  { name: 'Carnival of Rio', country: 'Brazil', flag: '🇧🇷', region: 'Americas', subCat: 'Festivals', query: 'Rio carnival parade samba dancers Brazil' },
  { name: 'Mardi Gras New Orleans', country: 'United States', flag: '🇺🇸', region: 'Americas', subCat: 'Festivals', query: 'Mardi Gras New Orleans parade French quarter' },
  { name: 'Dia de Muertos', country: 'Mexico', flag: '🇲🇽', region: 'Americas', subCat: 'Festivals', query: 'Dia de los Muertos Mexico day of the dead' },
  { name: 'Carnaval de Barranquilla', country: 'Colombia', flag: '🇨🇴', region: 'Americas', subCat: 'Festivals', query: 'Carnaval de Barranquilla Colombia parade' },
  { name: 'Festival de la Candelaria', country: 'Peru', flag: '🇵🇪', region: 'Americas', subCat: 'Festivals', query: 'Candelaria festival Puno Peru dance' },
  { name: 'Burning Man Black Rock', country: 'United States', flag: '🇺🇸', region: 'Americas', subCat: 'Festivals', query: 'Burning man festival Nevada black rock desert' },
  { name: 'Tango in Buenos Aires', country: 'Argentina', flag: '🇦🇷', region: 'Americas', subCat: 'Music & Performance', query: 'Tango street dancers Buenos Aires La Boca' },
  { name: 'Havana Jazz Festival', country: 'Cuba', flag: '🇨🇺', region: 'Americas', subCat: 'Music & Performance', query: 'Havana jazz festival Cuba club street' },
  { name: 'Smithsonian Institution', country: 'United States', flag: '🇺🇸', region: 'Americas', subCat: 'Arts & Museums', query: 'Smithsonian castle Washington DC museum' },
  { name: 'MoMA NYC', country: 'United States', flag: '🇺🇸', region: 'Americas', subCat: 'Arts & Museums', query: 'MoMA museum New York interior modern art' },
  { name: 'Anthropology Museum Mexico', country: 'Mexico', flag: '🇲🇽', region: 'Americas', subCat: 'Arts & Museums', query: 'National museum of anthropology Mexico city' },

  // Middle East
  { name: 'Hagia Sophia Museum', country: 'Turkey', flag: '🇹🇷', region: 'Middle East', subCat: 'Sacred Sites', query: 'Hagia Sophia Istanbul Turkey historic dome' },
  { name: 'Jerusalem Old City', country: 'Jerusalem', flag: '🇯🇪', region: 'Middle East', subCat: 'Sacred Sites', query: 'Jerusalem old city dome of the rock wall' },
  { name: 'Petra by Night', country: 'Jordan', flag: '🇯🇴', region: 'Middle East', subCat: 'Ancient Heritage', query: 'Petra by night treasury candles Jordan' },
  { name: 'Persepolis Ancient Ruins', country: 'Iran', flag: '🇮🇷', region: 'Middle East', subCat: 'Ancient Heritage', query: 'Persepolis Shiraz Iran ancient ruins' },
  { name: 'Isfahan Naghsh e Jahan', country: 'Iran', flag: '🇮🇷', region: 'Middle East', subCat: 'Architecture', query: 'Naghsh e Jahan square Isfahan Iran' },
  { name: 'Souk al Hamidiyya', country: 'Syria', flag: '🇸🇾', region: 'Middle East', subCat: 'Living Culture', query: 'Souq al Hamidiyah Damascus Syria bazaar' },
  { name: 'Museum of Islamic Art', country: 'Qatar', flag: '🇶🇦', region: 'Middle East', subCat: 'Arts & Museums', query: 'Museum of Islamic Art Doha Qatar skyline' },
  { name: 'Louvre Abu Dhabi', country: 'UAE', flag: '🇦🇪', region: 'Middle East', subCat: 'Arts & Museums', query: 'Louvre Abu Dhabi dome museum architecture' },

  // Oceania
  { name: 'Sydney Opera House Heritage', country: 'Australia', flag: '🇦🇺', region: 'Oceania', subCat: 'Architecture', query: 'Sydney Opera House harbor architecture Australia' },
  { name: 'Melbourne Street Art', country: 'Australia', flag: '🇦🇺', region: 'Oceania', subCat: 'Arts & Museums', query: 'Melbourne street art Hosier lane graffiti' },
  { name: 'Maori Rotorua Culture', country: 'New Zealand', flag: '🇳🇿', region: 'Oceania', subCat: 'Living Culture', query: 'Maori culture Rotorua New Zealand dance' },
  { name: 'Heiva Festival Tahiti', country: 'French Polynesia', flag: '🇵🇫', region: 'Oceania', subCat: 'Festivals', query: 'Heiva Tahiti festival dance French Polynesia' }
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
    images = await fetchFromPexels(`${name} culture heritage`, 5);
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
  fs.writeFileSync('scratch/temp_destinations_cultural.js', 'export const topDestinations = ' + arrayStr);
  
  const m = await import('./temp_destinations_cultural.js');
  let destinations = m.topDestinations;
  console.log(`Loaded ${destinations.length} current destinations.`);

  // 1. Clean categoryIds for current cultural destinations
  console.log("Cleaning old cultural references...");
  destinations.forEach(d => {
    if (d.categoryIds && d.categoryIds.includes('cultural')) {
      d.categoryIds = d.categoryIds.filter(cat => cat !== 'cultural');
      if (d.categoryIds.length === 0) {
        d.categoryIds = ['historical']; // Safe reassign
      }
    }
  });

  // 2. Remove standard duplicate/old custom cultural spots to prevent any leaks
  destinations = destinations.filter(d => !['louvre-museum', 'badshahi-mosque-heritage', 'borobudur-temple', 'flamenco-in-seville', 'venice-carnival', 'isla-pasion', 'grace-bay-beach', 'tulum-beach'].includes(d.id));

  // Synthesize new cultural list sequential fetches
  let rankCounter = 1;
  const newCulturalDestinations = [];

  for (let i = 0; i < culturalData.length; i++) {
    const cd = culturalData[i];
    const id = cd.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    
    console.log(`[${i+1}/${culturalData.length}] Processing cultural spot: "${cd.name}" (${cd.country})...`);
    
    // Fetch high-quality landscape Pexels/Pixabay images
    const images = await getImagesForQuery(cd.query, cd.name);
    let primaryImage = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80'; // Fallback
    let gallery = [primaryImage, primaryImage, primaryImage, primaryImage];
    
    if (images && images.length > 0) {
      primaryImage = images[0];
      gallery = [...images];
      while (gallery.length < 4) {
        gallery.push(images[0]);
      }
      gallery = gallery.slice(0, 4);
    } else {
      console.log(`  -> Warning: No images found for "${cd.name}". Using standard fallback.`);
    }

    let dailyCost = '$60-120';
    let hotelCost = '$35-80';
    let foodCost = '$15-30';
    let transportCost = '$8-15';

    if (cd.country === 'France' || cd.country === 'United Kingdom' || cd.country === 'Italy' || cd.country === 'Spain' || cd.country === 'Austria' || cd.country === 'Japan' || cd.country === 'United States' || cd.country === 'UAE' || cd.country === 'Australia' || cd.country === 'New Zealand') {
      dailyCost = '$180-360';
      hotelCost = '$100-240';
      foodCost = '$35-70';
      transportCost = '$25-45';
    }

    const adDest = {
      id,
      name: cd.name,
      country: cd.country,
      flag: cd.flag,
      rank: rankCounter++,
      image: primaryImage,
      preview: `${cd.subCat} heritage in ${cd.country}.`,
      description: `${cd.name} is a majestic cultural masterpiece situated in ${cd.country}, celebrating ${cd.subCat} under ${cd.region} regional traditions.`,
      weather: {
        temp: '22°C',
        condition: 'Clear Sky',
        humidity: '55%',
        airQuality: 'Excellent'
      },
      bestTime: 'October - May',
      budget: {
        daily: dailyCost,
        hotel: hotelCost,
        food: foodCost,
        transport: transportCost
      },
      safety: 'Safe to travel',
      timezone: 'GMT+1', 
      attractions: [`Main Heritage Pavilion`, `Historic Gallery Hall`, `Interactive Craft Center`],
      foods: ['Regional Heritage Special', 'Local Traditional Tea', 'Native Craft Sweets'],
      transport: ['Tourist Shuttle Bus', 'Metro Transit station', 'Walkable pathways'],
      culture: 'Strictly maintain museum silent guidelines. Professional photography might require a permit.',
      visa: 'Standard tourist visa requirements apply.',
      categoryIds: ['cultural'],
      culturalRegion: cd.region,
      culturalSubCategory: cd.subCat,
      gallery
    };

    newCulturalDestinations.push(adDest);
    await sleep(200); // respect rate limits
  }

  // 3. Combine and clean duplicates
  const filteredExisting = destinations.filter(d => !newCulturalDestinations.some(nf => nf.id === d.id));
  const finalDestinations = [...filteredExisting, ...newCulturalDestinations];
  console.log(`Total combined topDestinations length: ${finalDestinations.length}`);

  // 4. Write back to index.js
  const newArrayStr = JSON.stringify(finalDestinations, null, 2);
  const finalCode = content.slice(0, startIndex) + 'export const topDestinations = ' + newArrayStr + content.slice(endIndex);

  console.log("Writing cultural back to index.js...");
  fs.writeFileSync(DATA_FILE, finalCode, 'utf8');
  console.log("Successfully rebuilt cultural category in src/data/index.js!");

  // Clean up
  fs.unlinkSync('scratch/temp_destinations_cultural.js');
}

run().catch(err => {
  console.error("Execution error:", err);
});
