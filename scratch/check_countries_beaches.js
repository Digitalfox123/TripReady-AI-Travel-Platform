import { countries } from '../src/data/index.js';

const checkCodes = ['PH', 'PT', 'IS', 'TC', 'AE', 'GR', 'IT', 'MX', 'US', 'ZA', 'AU', 'MV', 'TH'];
console.log("Checking country codes registration status:");
checkCodes.forEach(code => {
  const match = countries.find(c => c.code === code);
  if (match) {
    console.log(`- [FOUND] Code: ${code}, Name: ${match.name}, Flag: ${match.flag}, Cities:`, match.cities);
  } else {
    console.log(`- [MISSING] Code: ${code}`);
  }
});
