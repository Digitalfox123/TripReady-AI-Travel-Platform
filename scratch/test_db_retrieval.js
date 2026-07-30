import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jklhfbuuknsuveoibccp.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprbGhmYnV1a25zdXZlb2liY2NwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTA3NjE5OCwiZXhwIjoyMDk2NjUyMTk4fQ.4mw48gTCICgKDXyVkcUYdZiyoKEMftIN6pkEmikJD1s';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testCountry(countryName) {
  console.log(`\n--- Testing Country: ${countryName} ---`);
  const countryClean = countryName.trim().toLowerCase();
  
  // Try exact match first, then fallback to ilike
  let { data: exactCountry, error: exactErr } = await supabase
    .from('countries')
    .select('id, name')
    .eq('name', countryName);
  
  console.log('Exact Match Country Result:', exactCountry, 'Error:', exactErr);

  let { data: ilikeCountry, error: ilikeErr } = await supabase
    .from('countries')
    .select('id, name')
    .ilike('name', `%${countryClean}%`);
  
  console.log('Ilike Match Country Result:', ilikeCountry, 'Error:', ilikeErr);
  
  if (ilikeCountry && ilikeCountry.length > 0) {
    const countryId = ilikeCountry[0].id;
    // Find all cities in this country
    const { data: dbCities, error: citiesErr } = await supabase
      .from('cities')
      .select('id, name')
      .eq('country_id', countryId);
    
    console.log(`Found ${dbCities ? dbCities.length : 0} cities in country. Error:`, citiesErr);
    if (dbCities && dbCities.length > 0) {
      console.log('Sample Cities:', dbCities.slice(0, 5));
      const cityIds = dbCities.map(c => c.id);
      
      // Fetch attractions
      const { data: dbAttractions, error: attrErr } = await supabase
        .from('attractions')
        .select('id, name, city_id')
        .in('city_id', cityIds);
      
      console.log(`Found ${dbAttractions ? dbAttractions.length : 0} attractions in country. Error:`, attrErr);
      if (dbAttractions && dbAttractions.length > 0) {
        console.log('Sample Attractions:', dbAttractions.slice(0, 10));
      }
    }
  }
}

async function testCity(cityName, countryName = '') {
  console.log(`\n--- Testing City: ${cityName} (Country: ${countryName}) ---`);
  const cityClean = cityName.trim().toLowerCase();
  
  const { data: matchedCities, error: cityErr } = await supabase
    .from('cities')
    .select('id, name, country_name, country_id')
    .ilike('name', `%${cityClean}%`);
  
  console.log(`Found ${matchedCities ? matchedCities.length : 0} matching cities. Error:`, cityErr);
  if (matchedCities && matchedCities.length > 0) {
    console.log('Matching Cities:', matchedCities);
    
    let dbCity = matchedCities[0];
    if (countryName) {
      const countryClean = countryName.toLowerCase().trim();
      const exactCountryMatch = matchedCities.find(c => 
        c.country_name && c.country_name.toLowerCase() === countryClean
      );
      const partialCountryMatch = matchedCities.find(c => 
        c.country_name && (
          c.country_name.toLowerCase().includes(countryClean) || 
          countryClean.includes(c.country_name.toLowerCase())
        )
      );
      dbCity = exactCountryMatch || partialCountryMatch || matchedCities[0];
    }
    
    console.log('Selected City:', dbCity);
    
    const { data: dbAttractions, error: attrErr } = await supabase
      .from('attractions')
      .select('id, name, city_id')
      .eq('city_id', dbCity.id);
      
    console.log(`Found ${dbAttractions ? dbAttractions.length : 0} attractions for city. Error:`, attrErr);
    if (dbAttractions && dbAttractions.length > 0) {
      console.log('Sample Attractions:', dbAttractions.slice(0, 10));
    }
  }
}

async function run() {
  await testCountry('China');
  await testCountry('United States');
  await testCity('Shanghai', 'China');
  await testCity('Beijing', 'China');
}

run();
