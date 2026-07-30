import { getPoiAttractions } from '../src/services/poiSearchService.js';
import { getCountryBySlug as dbGetCountry, getCityBySlug as dbGetCity, getAttractionBySlug as dbGetAttraction, searchDestinations } from '../src/utils/database.js';

async function run() {
  console.log('=== Automated Attractions Integration & Split Routing Verification ===\n');

  // Test 1: City-Level split check for Beijing
  console.log('Test 1: Beijing (City-Level query with numbered list splitting)...');
  const beijingAttrs = await getPoiAttractions(39.9042, 116.4074, 'Beijing', 'China');
  console.log(`- Attractions returned for Beijing: ${beijingAttrs ? beijingAttrs.length : 0}`);
  if (beijingAttrs && beijingAttrs.length === 10) {
    console.log('✓ Success: Beijing returned exactly 10 split attractions instead of 1!');
  } else {
    console.log('✗ Failed: Beijing did not return 10 split attractions!');
  }

  // Test 2: Country-Level query check for China
  console.log('\nTest 2: China (Country-Level query)...');
  const chinaAttrs = await getPoiAttractions(35.8617, 104.1954, 'China', 'China');
  console.log(`- Attractions returned for China: ${chinaAttrs ? chinaAttrs.length : 0}`);
  if (chinaAttrs && chinaAttrs.length > 50) {
    console.log('✓ Success: China returned all city attractions split and mapped (total > 50)!');
  } else {
    console.log('✗ Failed: China returned too few attractions!');
  }

  // Test 3: US Page-by-page check (>1000 items)
  console.log('\nTest 3: United States (Country-Level query with >1000 items)...');
  const usAttrs = await getPoiAttractions(37.0902, -95.7129, 'United States', 'United States');
  console.log(`- Attractions returned for United States: ${usAttrs ? usAttrs.length : 0}`);
  if (usAttrs && usAttrs.length === 2461) {
    console.log('✓ Success: Page-by-page fetching retrieved all 2,461 attractions (bypassed 1000-row limit)!');
  } else {
    console.log('✗ Failed: United States did not return all 2,461 attractions!');
  }

  // Test 4: Database utilities getCityBySlug check
  console.log('\nTest 4: getCityBySlug("beijing")...');
  const beijingCityData = await dbGetCity('beijing');
  console.log(`- getCityBySlug("beijing") returned:`, beijingCityData ? `${beijingCityData.attractions.length} attractions` : 'null');
  if (beijingCityData && beijingCityData.attractions.length === 10) {
    console.log('✓ Success: getCityBySlug split attractions correctly!');
  } else {
    console.log('✗ Failed: getCityBySlug attractions count mismatch!');
  }

  // Test 5: Database utilities getCountryBySlug check
  console.log('\nTest 5: getCountryBySlug("united-states")...');
  const usCountryData = await dbGetCountry('united-states');
  console.log(`- getCountryBySlug("united-states") returned:`, usCountryData ? `${usCountryData.attractions.length} attractions` : 'null');
  if (usCountryData && usCountryData.attractions.length >= 2461) {
    console.log('✓ Success: getCountryBySlug fetched all 2,461 attractions page-by-page and merged static ones!');
  } else {
    console.log('✗ Failed: getCountryBySlug attractions count mismatch!');
  }

  // Test 6: Search destinations autocomplete split check
  console.log('\nTest 6: searchDestinations("Canton Tower")...');
  const searchResults = await searchDestinations('Canton Tower');
  console.log(`- Search results count: ${searchResults.length}`);
  const cantonTowerResult = searchResults.find(r => r.name.includes('Canton Tower'));
  if (cantonTowerResult) {
    console.log(`✓ Success: Found Canton Tower in search options with slug "${cantonTowerResult.slug}"!`);
  } else {
    console.log('✗ Failed: Did not find Canton Tower in search results!');
    console.log('Results were:', searchResults.map(r => r.name));
  }

  // Test 7: Fetch split attraction by slug
  if (cantonTowerResult) {
    console.log(`\nTest 7: dbGetAttraction("${cantonTowerResult.slug}")...`);
    const attractionDetails = await dbGetAttraction(cantonTowerResult.slug);
    if (attractionDetails && attractionDetails.name.includes('Canton Tower')) {
      console.log('✓ Success: Retrieved details for split attraction!');
      console.log('Retrieved Details:', {
        name: attractionDetails.name,
        slug: attractionDetails.slug,
        city: attractionDetails.city?.name,
        country: attractionDetails.country?.name
      });
    } else {
      console.log('✗ Failed: Could not load details for split attraction slug!');
      console.log('Result:', attractionDetails);
    }
  }

  console.log('\n=== Verification Complete ===');
}

run().catch(err => {
  console.error('Error during verification:', err);
});
