import { countries } from '../src/data/index.js';

const checkCodes = ['AQ', 'UZ', 'TM', 'KZ', 'NA', 'BW', 'MN', 'EG', 'MA', 'SA', 'AE', 'IN', 'PK', 'CL', 'PE', 'CN'];
console.log("Checking desert country codes registration status:");
checkCodes.forEach(code => {
  const match = countries.find(c => c.code === code);
  if (match) {
    console.log(`- [FOUND] Code: ${code}, Name: ${match.name}, Flag: ${match.flag}`);
  } else {
    console.log(`- [MISSING] Code: ${code}`);
  }
});
