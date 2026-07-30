const { countries } = require('../src/data/countryIntelligence.js');

const antarctica = countries ? countries.find(c => c.name.toLowerCase() === 'antarctica') : null;
console.log('Antarctica static data:', antarctica);
