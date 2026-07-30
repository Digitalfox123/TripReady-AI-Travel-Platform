import { countriesData } from '../src/data/countryData.js';

console.log("Analyzing countriesData keys and structure...");
const keys = Object.keys(countriesData);
console.log("Total country keys:", keys.length);

if (keys.length > 0) {
  const firstKey = keys[0];
  const firstItem = countriesData[firstKey];
  console.log(`=== Sample country profile: "${firstKey}" ===`);
  console.log("Keys:", Object.keys(firstItem));
  console.log("basic:", firstItem.basic);
  console.log("continent:", firstItem.continent);
}
