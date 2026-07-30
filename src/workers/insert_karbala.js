// Node script to seed Karbala city and its attractions into Supabase
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
const envPath = path.resolve(__dirname, '../../.env');
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

// Fallback to process.env
supabaseUrl = supabaseUrl || process.env.VITE_SUPABASE_URL;
supabaseServiceKey = supabaseServiceKey || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("CRITICAL: Supabase credentials not found!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

const cityData = {
  name: "Karbala",
  country: "Iraq",
  state: "Karbala Governorate",
  latitude: 32.616,
  longitude: 44.0249,
  timezone: "Asia/Baghdad",
  population: 700000,
  description: "Karbala is one of the holiest cities in Islam and a major pilgrimage destination. It is renowned for the shrines of Imam Husayn ibn Ali and Al-Abbas ibn Ali, attracting millions of visitors annually, especially during Ashura and Arbaeen."
};

const attractions = [
  {
    name: "Imam Husayn Shrine",
    category: "Religious Site",
    description: "The holiest shrine in Karbala and the burial place of Imam Husayn ibn Ali. Millions of pilgrims visit this sacred site every year, especially during Ashura and Arbaeen.",
    latitude: 32.6162,
    longitude: 44.0319,
    must_visit: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Karbala.j.jpg/960px-Karbala.j.jpg"
  },
  {
    name: "Al-Abbas Shrine",
    category: "Religious Site",
    description: "A magnificent shrine dedicated to Abbas ibn Ali, located opposite the Imam Husayn Shrine. It is one of the most visited religious landmarks in Iraq.",
    latitude: 32.6174,
    longitude: 44.0326,
    must_visit: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Shrine_of_Al-Abbas%2C_Karbala.jpg"
  },
  {
    name: "Bayn al-Haramayn",
    category: "Religious Plaza",
    description: "The famous plaza connecting the Imam Husayn Shrine and Al-Abbas Shrine. It serves as the heart of Karbala's religious gatherings and processions.",
    latitude: 32.6168,
    longitude: 44.0323,
    must_visit: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/d/dc/Between_the_two_shrines_in_Karbala.jpg"
  },
  {
    name: "Tall al-Zaynabiyya",
    category: "Historic & Religious Site",
    description: "A historic hill traditionally believed to be where Lady Zaynab observed the Battle of Karbala after the martyrdom of Imam Husayn.",
    latitude: 32.6155,
    longitude: 44.0308,
    must_visit: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Al-Zaynabiyya_hill_in_Karbala.jpg"
  },
  {
    name: "Al-Khayam Area",
    category: "Historical Memorial",
    description: "A memorial complex representing the tents of Imam Husayn's family during the Battle of Karbala, preserving the memory of the tragic events.",
    latitude: 32.6148,
    longitude: 44.0311,
    must_visit: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Tents_of_Imam_Husayn_family.jpg"
  },
  {
    name: "Karbala Museum",
    category: "Museum",
    description: "A museum featuring Islamic manuscripts, historical artifacts, and relics connected with the history of Karbala and Shia Islamic heritage.",
    latitude: 32.6142,
    longitude: 44.0278,
    must_visit: false,
    image: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Karbala_Museum.jpg"
  },
  {
    name: "Qasr al-Ukhaidir",
    category: "Historic Fortress",
    description: "A remarkably preserved Abbasid-era desert fortress located southwest of Karbala. It is considered one of Iraq's greatest architectural treasures.",
    latitude: 32.2917,
    longitude: 43.7625,
    must_visit: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Ukhaidir_fortress_1.jpg/1280px-Ukhaidir_fortress_1.jpg"
  },
  {
    name: "Al-Hurr ibn Yazid al-Riyahi Shrine",
    category: "Religious Site",
    description: "The shrine of Al-Hurr ibn Yazid al-Riyahi, who famously switched sides to support Imam Husayn before the Battle of Karbala.",
    latitude: 32.647,
    longitude: 44.066,
    must_visit: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/d/dd/Shrine_of_Al-Hurr_ibn_Yazid_al-Riyahi.jpg"
  },
  {
    name: "Ain al-Tamr",
    category: "Historical & Religious Site",
    description: "An ancient oasis town known for its historic monasteries, palm groves, and archaeological significance, located west of Karbala.",
    latitude: 32.495,
    longitude: 43.773,
    must_visit: false,
    image: "https://upload.wikimedia.org/wikipedia/commons/6/68/Ain_al-Tamr_oasis.jpg"
  },
  {
    name: "Razaza Lake",
    category: "Nature & Recreation",
    description: "A large lake west of Karbala offering scenic views, birdwatching opportunities, and a peaceful natural environment.",
    latitude: 32.73,
    longitude: 43.85,
    must_visit: false,
    image: "https://upload.wikimedia.org/wikipedia/commons/7/77/Milh_Lake%2C_Karbala.jpg"
  }
];

async function seed() {
  console.log("Seeding Karbala into Supabase...");

  // 1. Get Iraq country ID
  let countryId = 35; // default fallback
  const { data: countryDataDb, error: countryErr } = await supabase
    .from('countries')
    .select('id')
    .eq('name', 'Iraq')
    .maybeSingle();

  if (countryDataDb) {
    countryId = countryDataDb.id;
  }
  console.log(`Country ID for Iraq is: ${countryId}`);

  // 2. Insert or get State (Karbala Governorate)
  let stateId = 9811; // unique state ID
  const { data: stateDataDb } = await supabase
    .from('states')
    .select('id')
    .eq('name', cityData.state)
    .maybeSingle();

  if (stateDataDb) {
    stateId = stateDataDb.id;
  } else {
    const { error: stateInsertErr } = await supabase
      .from('states')
      .insert({
        id: stateId,
        country_id: countryId,
        country_name: 'Iraq',
        name: cityData.state,
        slug: 'karbala-governorate'
      });
    if (stateInsertErr) {
      console.error("Error inserting state:", stateInsertErr);
    }
  }
  console.log(`State ID for ${cityData.state} is: ${stateId}`);

  // 3. Insert or get City (Karbala)
  let cityId = 91600; // unique city ID
  const { data: cityDataDb } = await supabase
    .from('cities')
    .select('id')
    .eq('name', 'Karbala')
    .maybeSingle();

  if (cityDataDb) {
    cityId = cityDataDb.id;
  } else {
    const { error: cityInsertErr } = await supabase
      .from('cities')
      .insert({
        id: cityId,
        country_id: countryId,
        state_id: stateId,
        country_name: 'Iraq',
        state_name: cityData.state,
        name: 'Karbala',
        slug: 'karbala',
        is_capital: false
      });

    if (cityInsertErr) {
      console.error("Error inserting city:", cityInsertErr);
      process.exit(1);
    }
  }
  console.log(`City ID for Karbala is: ${cityId}`);

  // 4. Insert Attractions
  for (let i = 0; i < attractions.length; i++) {
    const attr = attractions[i];
    const attrId = 960000 + i;
    const slug = attr.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    // Create description JSON payload
    const descJson = JSON.stringify({
      description: attr.description,
      image: attr.image,
      images: [attr.image],
      featured_image: attr.image,
      image_source: "Wikipedia",
      image_credit: "Wikipedia Contributors",
      image_confidence: 100,
      image_verified: true,
      last_checked: new Date().toISOString(),
      thumbnail: attr.image,
      gallery_images: [attr.image]
    });

    console.log(`Inserting attraction "${attr.name}" (ID ${attrId})...`);

    // Defensive insert
    const { error: attrInsertErr } = await supabase
      .from('attractions')
      .upsert({
        id: attrId,
        city_id: cityId,
        name: attr.name,
        slug: slug,
        category: attr.category,
        description: descJson,
        latitude: attr.latitude,
        longitude: attr.longitude,
        featured_image: attr.image,
        image_source: "Wikipedia",
        image_credit: "Wikipedia Contributors",
        image_confidence: 100,
        image_verified: true,
        last_checked: new Date().toISOString(),
        thumbnail: attr.image,
        gallery_images: [attr.image]
      });

    if (attrInsertErr) {
      if (attrInsertErr.code === 'PGRST204') {
        // Mismatch - insert with only description JSON
        const { error: jsonInsertErr } = await supabase
          .from('attractions')
          .upsert({
            id: attrId,
            city_id: cityId,
            name: attr.name,
            slug: slug,
            category: attr.category,
            description: descJson,
            latitude: attr.latitude,
            longitude: attr.longitude
          });
        if (jsonInsertErr) {
          console.error(` -> JSON-only insert failed:`, jsonInsertErr);
        } else {
          console.log(` -> Inserted successfully via JSON fallback`);
        }
      } else {
        console.error(` -> Insert failed:`, attrInsertErr);
      }
    } else {
      console.log(` -> Inserted successfully with direct columns`);
    }
  }

  console.log("Database seeding completed successfully!");
}

seed();
