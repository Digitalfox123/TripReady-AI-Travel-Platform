const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Manually parse .env file to get credentials
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');

function getEnvVar(name) {
  const match = envContent.match(new RegExp(`^${name}=(.*)$`, 'm'));
  return match ? match[1].trim() : null;
}

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const serviceRoleKey = getEnvVar('SUPABASE_SERVICE_ROLE_KEY');

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Error: VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing in .env');
  process.exit(1);
}

// 2. Initialize Supabase Admin client
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false }
});

// Helper to chunk arrays for batch inserting
function chunkArray(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

async function seedDatabase() {
  console.log('--- Starting Supabase Database Seeding ---');

  try {
    // ─── 1. SEED COUNTRIES ───
    console.log('Reading countries.json...');
    const countriesData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'countries.json'), 'utf8')
    );

    const dbCountries = countriesData.map(c => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      flag: c.flag,
      iso2: c.iso2,
      iso3: c.iso3,
      continent: c.continent,
      region: c.region,
      subregion: c.subregion,
      capital: c.capital
    }));

    console.log(`Inserting ${dbCountries.length} countries...`);
    const countryChunks = chunkArray(dbCountries, 50);
    for (let i = 0; i < countryChunks.length; i++) {
      const { error } = await supabase.from('countries').upsert(countryChunks[i]);
      if (error) throw new Error(`Countries chunk ${i} failed: ${error.message}`);
      console.log(`  Processed country chunk ${i + 1}/${countryChunks.length}`);
    }
    console.log('✓ Countries seeded successfully.');

    // ─── 2. SEED STATES ───
    console.log('Reading states.json...');
    const statesData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'states.json'), 'utf8')
    );

    const dbStates = statesData.map(s => ({
      id: s.id,
      country_id: s.countryId,
      country_name: s.countryName,
      name: s.name,
      slug: s.slug
    }));

    console.log(`Inserting ${dbStates.length} states...`);
    const stateChunks = chunkArray(dbStates, 100);
    for (let i = 0; i < stateChunks.length; i++) {
      const { error } = await supabase.from('states').upsert(stateChunks[i]);
      if (error) throw new Error(`States chunk ${i} failed: ${error.message}`);
      console.log(`  Processed state chunk ${i + 1}/${stateChunks.length}`);
    }
    console.log('✓ States seeded successfully.');

    // ─── 3. SEED CITIES ───
    console.log('Reading cities.json...');
    const citiesData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'cities.json'), 'utf8')
    );

    const dbCities = citiesData.map(c => ({
      id: c.id,
      country_id: c.countryId,
      state_id: c.stateId,
      country_name: c.countryName,
      state_name: c.stateName,
      name: c.name,
      slug: c.slug,
      is_capital: c.isCapital,
      attraction_mode: c.attractionMode
    }));

    console.log(`Inserting ${dbCities.length} cities...`);
    const cityChunks = chunkArray(dbCities, 150);
    for (let i = 0; i < cityChunks.length; i++) {
      const { error } = await supabase.from('cities').upsert(cityChunks[i]);
      if (error) throw new Error(`Cities chunk ${i} failed: ${error.message}`);
      console.log(`  Processed city chunk ${i + 1}/${cityChunks.length}`);
    }
    console.log('✓ Cities seeded successfully.');

    console.log('--- Seeding completed successfully! ---');
  } catch (error) {
    console.error('Fatal Seeding Error:', error);
    process.exit(1);
  }
}

seedDatabase();
