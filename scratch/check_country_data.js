import { countriesData } from '../src/data/countryData.js';

console.log("Checking for unescoSites...");
let errors = 0;
for (const [key, country] of Object.entries(countriesData)) {
  if (!country) continue;
  if (country.intermediate) {
    if (!country.advanced.unescoSites) {
      console.error(`Curated Flagship "${key}" is missing advanced.unescoSites!`);
      errors++;
    }
  }
}
console.log(`Errors: ${errors}`);
