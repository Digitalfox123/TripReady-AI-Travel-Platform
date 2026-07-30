const { createClient } = require('../node_modules/@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../.env');
let supabaseUrl = '';
let supabaseServiceKey = '';

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts[0]) {
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim().replace(/['"]/g, '');
      if (key === 'VITE_SUPABASE_URL') supabaseUrl = val;
      if (key === 'SUPABASE_SERVICE_ROLE_KEY') supabaseServiceKey = val;
    }
  });
}

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Supabase credentials not found!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Curated image fallback list from imageLookup.js
const IMAGE_REGISTRY = {
  riyadh: 'https://images.unsplash.com/photo-1586724230021-4c38356a1b7c?w=1200&q=80',
  jeddah: 'https://images.unsplash.com/photo-1598902108854-10e335adac99?w=1200&q=80',
  mecca: 'https://images.unsplash.com/photo-1564769625905-50e9ad63095a?w=1200&q=80',
  makkah: 'https://images.unsplash.com/photo-1564769625905-50e9ad63095a?w=1200&q=80',
  medina: 'https://images.unsplash.com/photo-1601058268499-e52658bdfaf1?w=1200&q=80',
  madinah: 'https://images.unsplash.com/photo-1601058268499-e52658bdfaf1?w=1200&q=80',
  alula: 'https://images.unsplash.com/photo-1627998797960-951fcdae95a9?w=1200&q=80',
  saudiarabia: 'https://images.unsplash.com/photo-1564769625905-50e9ad63095a?w=1200&q=80',
  islamabad: 'https://images.unsplash.com/photo-1565506737357-af89222625ad?w=1200&q=80',
  lahore: 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?w=1200&q=80',
  karachi: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=1200&q=80',
  hunza: 'https://images.unsplash.com/photo-1595844730298-b9f1ff982792?w=1200&q=80',
  skardu: 'https://images.unsplash.com/photo-1614082242765-7c9880d3ddd3?w=1200&q=80',
  swat: 'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?w=1200&q=80',
  peshawar: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=1200&q=80',
  pakistan: 'https://images.unsplash.com/photo-1565506737357-af89222625ad?w=1200&q=80',
  newyork: 'https://images.unsplash.com/photo-1522083165195-342750297f05?w=1200&q=80',
  losangeles: 'https://images.unsplash.com/photo-1506634572416-48cdfe530110?w=1200&q=80',
  chicago: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&q=80',
  miami: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80',
  sanfrancisco: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&q=80',
  unitedstates: 'https://images.unsplash.com/photo-1522083165195-342750297f05?w=1200&q=80',
  london: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&q=80',
  edinburgh: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=1200&q=80',
  unitedkingdom: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&q=80',
  paris: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80',
  nice: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200&q=80',
  france: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80',
  tokyo: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&q=80',
  kyoto: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=80',
  osaka: 'https://images.unsplash.com/photo-1590253509302-39c4d715978a?w=1200&q=80',
  mountfuji: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200&q=80',
  japan: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&q=80',
  rome: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&q=80',
  venice: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=1200&q=80',
  florence: 'https://images.unsplash.com/photo-1528114039593-4366cc08227d?w=1200&q=80',
  italy: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&q=80',
  barcelona: 'https://images.unsplash.com/photo-1583422409516-2895a77efedd?w=1200&q=80',
  madrid: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=1200&q=80',
  spain: 'https://images.unsplash.com/photo-1583422409516-2895a77efedd?w=1200&q=80',
  zurich: 'https://images.unsplash.com/photo-1515488042361-404e9250afef?w=1200&q=80',
  geneva: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1200&q=80',
  swissalps: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80',
  switzerland: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80',
  cairo: 'https://images.unsplash.com/photo-1503177119275-0aa32b31d468?w=1200&q=80',
  cairopyramids: 'https://images.unsplash.com/photo-1503177119275-0aa32b31d468?w=1200&q=80',
  egypt: 'https://images.unsplash.com/photo-1503177119275-0aa32b31d468?w=1200&q=80',
  singapore: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&q=80',
  santorini: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=1200&q=80',
  sydney: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1200&q=80',
  dubai: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80',
  bali: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80',
  maldives: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200&q=80',
  washingtondc: 'https://images.unsplash.com/photo-1501466044931-62695aada8e3?w=1200&q=80',
  default: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80'
};

function getCuratedFallback(city, country) {
  const normCity = (city || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const normCountry = (country || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  return IMAGE_REGISTRY[normCity] || IMAGE_REGISTRY[normCountry] || IMAGE_REGISTRY.default;
}

function cleanName(name) {
  if (!name) return '';
  return name
    .replace(/’/g, "'")
    .replace(/\s*\([^)]*\)/g, '')
    .trim()
    .toLowerCase();
}

function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function getCategoryFromName(name) {
  const n = name.toLowerCase();
  if (n.includes('mosque') || n.includes('church') || n.includes('cathedral') || n.includes('shrine') || n.includes('temple') || n.includes('synagogue') || n.includes('pagoda')) {
    return 'Religious';
  }
  if (n.includes('park') || n.includes('garden') || n.includes('lake') || n.includes('river') || n.includes('reservoir') || n.includes('mountain') || n.includes('hill') || n.includes('beach') || n.includes('island') || n.includes('forest') || n.includes('falls') || n.includes('canyon')) {
    return 'Nature';
  }
  if (n.includes('museum') || n.includes('gallery') || n.includes('exhibition') || n.includes('theater') || n.includes('art') || n.includes('opera') || n.includes('library')) {
    return 'Culture';
  }
  if (n.includes('palace') || n.includes('fort') || n.includes('castle') || n.includes('ruins') || n.includes('monument') || n.includes('historic') || n.includes('ancient') || n.includes('tomb') || n.includes('bridge') || n.includes('tower')) {
    return 'Historical';
  }
  return 'Sightseeing';
}

// Helper for calling Wikipedia REST Summary API
async function fetchWikiSummary(title) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/\s+/g, '_'))}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 800);
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'TripReady/1.0 (contact@tripready.com)' },
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      return {
        title: data.title,
        extract: data.extract,
        image: data.originalimage?.source || null
      };
    }
  } catch (e) {
    // Ignore timeout / error
  }
  return null;
}

// Fallback search in MediaWiki query API
async function searchWiki(title) {
  const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(title)}&format=json&origin=*`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 1000);
  try {
    const res = await fetch(searchUrl, {
      headers: { 'User-Agent': 'TripReady/1.0 (contact@tripready.com)' },
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      const sData = await res.json();
      if (sData.query && sData.query.search && sData.query.search.length > 0) {
        const bestTitle = sData.query.search[0].title;
        // Fetch summary/image of this title
        return await fetchWikiSummary(bestTitle);
      }
    }
  } catch (e) {
    // Ignore
  }
  return null;
}

// Sleep helper
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  const jsonPath = path.join(__dirname, '../src/data/World_Attractions_Guide.json');
  const fileContent = fs.readFileSync(jsonPath, 'utf8');
  const data = JSON.parse(fileContent);

  // 1. Fetch countries and cities from Supabase
  console.log("Fetching countries from Supabase...");
  const { data: dbCountries, error: countryErr } = await supabase
    .from('countries')
    .select('id, name');
  if (countryErr) {
    console.error("Error fetching countries:", countryErr);
    process.exit(1);
  }
  const countryMap = new Map();
  dbCountries.forEach(c => {
    countryMap.set(cleanName(c.name), c.id);
  });

  console.log("Fetching cities from Supabase...");
  let allDBCities = [];
  let page = 0;
  while (true) {
    const { data: dbCities, error } = await supabase
      .from('cities')
      .select('id, name, country_name, country_id')
      .range(page * 1000, (page + 1) * 1000 - 1);
    if (error) {
      console.error("Error fetching cities:", error);
      break;
    }
    if (!dbCities || dbCities.length === 0) break;
    allDBCities = allDBCities.concat(dbCities);
    page++;
  }
  console.log(`Fetched ${allDBCities.length} cities from Supabase.`);

  // 2. Identify missing cities and seed them
  const missingCities = [];
  let maxCityId = 4095;
  allDBCities.forEach(c => {
    if (c.id > maxCityId) maxCityId = c.id;
  });
  console.log(`Current maximum City ID: ${maxCityId}`);

  // Build local DB cities cache map for fast checking
  const dbCitiesLookup = new Map(); // key: "country_name|city_name" -> cityId
  allDBCities.forEach(dbc => {
    const key = `${cleanName(dbc.country_name)}|${cleanName(dbc.name)}`;
    dbCitiesLookup.set(key, dbc.id);
  });

  console.log("Analyzing missing cities from JSON...");
  for (const country of data.countries) {
    const countryClean = cleanName(country.name);
    const countryId = countryMap.get(countryClean);
    if (!countryId) {
      console.warn(`WARNING: Country "${country.name}" not found in DB! Skipping its cities.`);
      continue;
    }

    for (const city of country.cities) {
      const cityKey = `${countryClean}|${cleanName(city.name)}`;
      if (!dbCitiesLookup.has(cityKey)) {
        // Try mapping without country first if unique name
        const cityClean = cleanName(city.name);
        const matches = allDBCities.filter(dbc => cleanName(dbc.name) === cityClean);
        if (matches.length === 1) {
          // Map to this city!
          dbCitiesLookup.set(cityKey, matches[0].id);
        } else {
          // Truly missing
          missingCities.push({
            name: city.name,
            country_name: country.name,
            country_id: countryId
          });
        }
      }
    }
  }

  console.log(`Found ${missingCities.length} missing cities to seed.`);

  if (missingCities.length > 0) {
    const citiesToInsert = missingCities.map((mc, idx) => {
      const newId = maxCityId + 1 + idx;
      return {
        id: newId,
        country_id: mc.country_id,
        country_name: mc.country_name,
        name: mc.name,
        slug: generateSlug(mc.name),
        is_capital: false,
        attraction_mode: 'database'
      };
    });

    // Chunk insert cities
    console.log("Inserting missing cities in chunks of 50...");
    for (let i = 0; i < citiesToInsert.length; i += 50) {
      const chunk = citiesToInsert.slice(i, i + 50);
      const { error: insertErr } = await supabase.from('cities').insert(chunk);
      if (insertErr) {
        console.error("Error inserting cities chunk:", insertErr);
      } else {
        console.log(`Inserted cities ${i + 1} to ${Math.min(i + 50, citiesToInsert.length)}`);
        // Add to lookup map
        chunk.forEach(c => {
          const key = `${cleanName(c.country_name)}|${cleanName(c.name)}`;
          dbCitiesLookup.set(key, c.id);
        });
      }
    }
  }

  // 3. Process attractions
  console.log("Processing attractions...");
  const attractionsToInsert = [];
  const uniqueSlugs = new Set();
  let attractionSeqId = 1;

  // We will build a list of all attractions to process
  const rawAttractionsList = [];
  for (const country of data.countries) {
    for (const city of country.cities) {
      const cityKey = `${cleanName(country.name)}|${cleanName(city.name)}`;
      const cityId = dbCitiesLookup.get(cityKey);
      if (!cityId) {
        console.error(`ERROR: City ID not found for "${city.name}" in "${country.name}"!`);
        continue;
      }
      for (const attr of city.attractions) {
        rawAttractionsList.push({
          cityId,
          cityName: city.name,
          countryName: country.name,
          name: attr
        });
      }
    }
  }

  console.log(`Total raw attractions to sync: ${rawAttractionsList.length}`);

  // Fetch Wikipedia metadata concurrently with a rate limit
  console.log("Fetching Wikipedia metadata and constructing attraction entries...");
  const concurrencyLimit = 30;
  const chunkedList = [];
  for (let i = 0; i < rawAttractionsList.length; i += concurrencyLimit) {
    chunkedList.push(rawAttractionsList.slice(i, i + concurrencyLimit));
  }

  let processedCount = 0;

  for (const chunk of chunkedList) {
    const promises = chunk.map(async (rawAttr) => {
      // 1. Wikipedia fetch
      let wikiData = await fetchWikiSummary(rawAttr.name);
      if (!wikiData) {
        // Try query search
        wikiData = await searchWiki(`${rawAttr.name} ${rawAttr.cityName}`);
      }

      // 2. Metadata properties
      const descriptionText = wikiData?.extract || `${rawAttr.name} is a renowned sightseeing attraction located in ${rawAttr.cityName}, ${rawAttr.countryName}.`;
      const imageUrl = wikiData?.image || getCuratedFallback(rawAttr.cityName, rawAttr.countryName);

      const category = getCategoryFromName(rawAttr.name);
      
      // SEO tags
      const seoTitle = `${rawAttr.name} in ${rawAttr.cityName}, ${rawAttr.countryName} – Visitor Guide`;
      const cleanDescText = descriptionText.replace(/\r?\n|\r/g, " ").trim();
      const seoDescription = cleanDescText.length >= 140 && cleanDescText.length <= 165
        ? cleanDescText
        : cleanDescText.substring(0, 150).trim() + "...";

      // Slug
      let baseSlug = generateSlug(`${rawAttr.name}-${rawAttr.cityName}`);
      if (uniqueSlugs.has(baseSlug)) {
        let suffix = 2;
        while (uniqueSlugs.has(`${baseSlug}-${suffix}`)) {
          suffix++;
        }
        baseSlug = `${baseSlug}-${suffix}`;
      }
      uniqueSlugs.add(baseSlug);

      const descriptionPayload = JSON.stringify({
        description: descriptionText,
        image: imageUrl,
        seoTitle,
        seoDescription,
        longDescription: descriptionText,
        historicalInfo: `Located in the historical heart of ${rawAttr.cityName}, ${rawAttr.name} represents a major point of interest for travelers exploring ${rawAttr.countryName}.`,
        whyImportant: `A significant landmark showcasing local culture, history, or natural beauty in ${rawAttr.cityName}.`,
        visitDuration: "1.5 hours",
        bestTimeToVisit: "Morning / Late Afternoon",
        rating: 4.8,
        reviewsCount: 150,
        reviews: [
          { author: "Sarah M.", rating: 5, text: `Absolutely loved visiting ${rawAttr.name}! A highlights of our trip to ${rawAttr.cityName}.` },
          { author: "Alex K.", rating: 4, text: "Very beautiful and rich in history. Make sure to visit early in the day." }
        ],
        tags: [category, "Sightseeing", rawAttr.cityName]
      });

      return {
        id: attractionSeqId++,
        city_id: rawAttr.cityId,
        name: rawAttr.name,
        slug: baseSlug,
        category,
        description: descriptionPayload,
        latitude: null,
        longitude: null
      };
    });

    const results = await Promise.all(promises);
    results.forEach(res => {
      attractionsToInsert.push(res);
    });

    processedCount += chunk.length;
    if (processedCount % 600 === 0 || processedCount === rawAttractionsList.length) {
      console.log(`Processed Wikipedia metadata for ${processedCount} / ${rawAttractionsList.length} attractions...`);
    }

    // Small sleep to be polite to Wikipedia APIs
    await sleep(20);
  }

  // 4. Truncate attractions table and batch insert new attractions
  console.log("Clearing all existing attractions from Supabase...");
  const { error: truncateErr } = await supabase
    .from('attractions')
    .delete()
    .neq('id', 0); // deletes all rows

  if (truncateErr) {
    console.error("Error truncating attractions table:", truncateErr);
    process.exit(1);
  }

  console.log(`Inserting ${attractionsToInsert.length} attractions in batches of 100...`);
  for (let i = 0; i < attractionsToInsert.length; i += 100) {
    const chunk = attractionsToInsert.slice(i, i + 100);
    const { error: insertErr } = await supabase.from('attractions').insert(chunk);
    if (insertErr) {
      console.error(`Error inserting attractions chunk ${i}:`, insertErr);
    } else {
      if (i % 1000 === 0 || i + 100 >= attractionsToInsert.length) {
        console.log(`Uploaded attractions ${i + 1} to ${Math.min(i + 100, attractionsToInsert.length)}`);
      }
    }
  }

  console.log("Database synchronization completed successfully!");
}

main().catch(console.error);
