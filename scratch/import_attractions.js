import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '..', '.env');
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
  console.error("Supabase credentials not found in .env!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

// Category classification heuristic
function getCategory(name, desc = '') {
  const n = name.toLowerCase();
  const d = desc.toLowerCase();
  if (n.includes('mosque') || n.includes('temple') || n.includes('shrine') || n.includes('church') || n.includes('cathedral') || n.includes('nunnery') || n.includes('pagoda') || n.includes('basilica') || n.includes('abbey') || n.includes('synagogue')) {
    return 'Religious';
  }
  if (n.includes('museum') || n.includes('gallery') || n.includes('art') || n.includes('louvre') || n.includes('prado')) {
    return 'Museum';
  }
  if (n.includes('park') || n.includes('garden') || n.includes('beach') || n.includes('lake') || n.includes('waterfall') || n.includes('bay') || n.includes('canyon') || n.includes('harbour') || n.includes('harbor') || n.includes('river') || n.includes('mountain') || n.includes('island') || n.includes('grove')) {
    return 'Nature';
  }
  if (n.includes('market') || n.includes('bazaar') || n.includes('street') || n.includes('road') || n.includes('mall') || n.includes('shopping') || n.includes('district') || n.includes('souk')) {
    return 'Shopping';
  }
  if (n.includes('castle') || n.includes('fort') || n.includes('palace') || n.includes('ruins') || n.includes('ancient') || n.includes('bridge') || n.includes('tower') || n.includes('gate') || n.includes('monument') || n.includes('wall') || n.includes('tomb') || n.includes('citadel') || n.includes('theatre') || n.includes('theater')) {
    return 'Historical';
  }
  if (n.includes('studio') || n.includes('disneyland') || n.includes('theme park') || n.includes('safari') || n.includes('zoo') || n.includes('aquarium') || n.includes('show') || n.includes('cabaret') || n.includes('wheel') || n.includes('climb') || n.includes('cruise') || n.includes('ride') || n.includes('nightlife')) {
    return 'Entertainment';
  }
  return 'Landmark';
}

function normalize(name) {
  return name.replace(/\([^)]*\)/g, '').trim()
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, '');
}

async function fetchAllCities() {
  let allCities = [];
  let page = 0;
  const pageSize = 1000;
  while (true) {
    const { data, error } = await supabase.from('cities').select('id, name, country_name, slug').range(page * pageSize, (page + 1) * pageSize - 1);
    if (error) { console.error(error); break; }
    if (!data || data.length === 0) break;
    allCities = allCities.concat(data);
    if (data.length < pageSize) break;
    page++;
  }
  return allCities;
}

// Helper to chunk array
function chunkArray(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

async function run() {
  console.log("--- Starting Attractions Data Import ---");
  try {
    const dbCities = await fetchAllCities();
    console.log(`Loaded ${dbCities.length} cities from Supabase for local mapping.`);

    const attractionsRawPath = 'C:\\Users\\hafiz\\.gemini\\antigravity\\brain\\cfde45ab-22d0-4261-bac1-e4c10f2a746d\\scratch\\attractions_raw.txt';
    const attractionsRaw = fs.readFileSync(attractionsRawPath, 'utf8');
    const lines = attractionsRaw.split('\n').map(l => l.trim()).filter(Boolean);

    console.log(`Parsing ${lines.length} rows of attractions...`);

    const records = [];
    let attractionIdSeq = 1;
    const usedSlugs = new Set();

    for (const line of lines) {
      if (line.startsWith('Country | City | Attractions')) continue;
      const parts = line.split('|').map(p => p.trim());
      if (parts.length < 3) continue;

      const [country, city, attractionsStr] = parts;
      const attractions = attractionsStr.split(';').map(a => a.trim()).filter(Boolean);

      const normalizedCity = normalize(city);
      const normalizedCountry = normalize(country);

      const matchedCity = dbCities.find(c => 
        normalize(c.name) === normalizedCity &&
        normalize(c.country_name) === normalizedCountry
      );

      if (!matchedCity) {
        console.warn(`WARNING: Unmapped city "${city}" in country "${country}". Skipping.`);
        continue;
      }

      for (const attr of attractions) {
        let attractionName = attr;
        let description = `Explore the beautiful ${attractionName}, a popular destination in ${matchedCity.name}, ${matchedCity.country_name}.`;

        // Parse parenthetical details if present
        const match = attractionName.match(/^([^(]+)\(([^)]+)\)$/);
        if (match) {
          const cleanName = match[1].trim();
          const parenthetical = match[2].trim();
          attractionName = cleanName;
          description = `${parenthetical.charAt(0).toUpperCase() + parenthetical.slice(1)}. A must-visit attraction in ${matchedCity.name}, ${matchedCity.country_name}.`;
        }

        const category = getCategory(attractionName, description);

        // Generate a globally unique slug
        let baseSlug = attractionName.toLowerCase()
          .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        
        let uniqueSlug = `${baseSlug}-${matchedCity.slug}`;
        let counter = 1;
        while (usedSlugs.has(uniqueSlug)) {
          uniqueSlug = `${baseSlug}-${matchedCity.slug}-${counter}`;
          counter++;
        }
        usedSlugs.add(uniqueSlug);

        records.push({
          id: attractionIdSeq++,
          city_id: matchedCity.id,
          name: attractionName,
          slug: uniqueSlug,
          category: category,
          description: description,
          latitude: null,
          longitude: null
        });
      }
    }

    console.log(`Parsed total of ${records.length} attraction records.`);

    // Bulk insert chunk by chunk
    const chunks = chunkArray(records, 100);
    console.log(`Uploading in ${chunks.length} batches of 100...`);

    for (let i = 0; i < chunks.length; i++) {
      const { error } = await supabase.from('attractions').upsert(chunks[i]);
      if (error) {
        console.error(`ERROR: Batch ${i + 1} failed:`, error.message);
        throw error;
      }
      console.log(`  Processed batch ${i + 1}/${chunks.length}`);
    }

    console.log("✓ Attractions imported successfully!");
  } catch (err) {
    console.error("FATAL ERROR: Import failed:", err);
    process.exit(1);
  }
}

run();
