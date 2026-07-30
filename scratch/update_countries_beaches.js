import fs from 'fs';

let content = fs.readFileSync('src/data/index.js', 'utf8');

// Let's add PH and TC to the end of the countries array, right before the closing bracket of countries:
//   }
// ].sort((a, b) => a.name.localeCompare(b.name));

const targetSegment = `  {
    "code": "CA",
    "name": "Canada",
    "flag": "🇨🇦",
    "cities": [
      "Northern Rockies"
    ]
  }
].sort((a, b) => a.name.localeCompare(b.name));`;

const newSegment = `  {
    "code": "CA",
    "name": "Canada",
    "flag": "🇨🇦",
    "cities": [
      "Northern Rockies"
    ]
  },
  {
    "code": "PH",
    "name": "Philippines",
    "flag": "🇵🇭",
    "cities": [
      "Entalula Beach"
    ]
  },
  {
    "code": "TC",
    "name": "Turks & Caicos",
    "flag": "🇹🇨",
    "cities": [
      "Grace Bay Beach"
    ]
  }
].sort((a, b) => a.name.localeCompare(b.name));`;

if (content.includes(targetSegment)) {
  content = content.replace(targetSegment, newSegment);
  console.log("Successfully registered Philippines and Turks & Caicos in the countries array!");
} else {
  console.log("ERROR: Target countries array tail not found!");
}

// Now let's update cities arrays for other countries in index.js to support the search page associations:
// 1. Australia (AU) -> add "Whitehaven Beach"
// 2. Maldives (MV) -> add "Bioluminescent Beaches"
// 3. Thailand (TH) -> add "Railay Beach"
// 4. Greece (GR) -> add "Elafonissi Beach"
// 5. Portugal (PT) -> add "Praia da Falésia"
// 6. Italy (IT) -> add "La Pelosa Beach"
// 7. Iceland (IS) -> add "Reynisfjara Beach"
// 8. Mexico (MX) -> add "Isla Pasión", "Tulum Beach"
// 9. United States (US) -> add "La Jolla Cove"
// 10. South Africa (ZA) -> add "Boulders Beach", "Camps Bay"
// 11. UAE (AE) -> add "Saadiyat Beach"

const countryCityUpdates = [
  { code: 'AU', city: 'Whitehaven Beach' },
  { code: 'MV', city: 'Bioluminescent Beaches' },
  { code: 'TH', city: 'Railay Beach' },
  { code: 'GR', city: 'Elafonissi Beach' },
  { code: 'PT', city: 'Praia da Falésia' },
  { code: 'IT', city: 'La Pelosa Beach' },
  { code: 'IS', city: 'Reynisfjara Beach' },
  { code: 'MX', city: 'Isla Pasión' },
  { code: 'MX', city: 'Tulum Beach' },
  { code: 'US', city: 'La Jolla Cove' },
  { code: 'ZA', city: 'Boulders Beach' },
  { code: 'ZA', city: 'Camps Bay' },
  { code: 'AE', city: 'Saadiyat Beach' }
];

countryCityUpdates.forEach(update => {
  // Let's find the country block by searching for "code": "CODE", and the surrounding cities array.
  // This is a bit tricky, but since the JSON structure is standardized, we can locate:
  // "code": "CODE",
  // followed by "cities": [
  // and append our city to that array!
  const codeRegex = new RegExp(`"code":\\s*"${update.code}",[^]*?"cities":\\s*\\[([^]*?)\\]`, 'g');
  
  content = content.replace(codeRegex, (match, citiesGroup) => {
    if (citiesGroup.includes(`"${update.city}"`)) {
      // Already has the city
      return match;
    }
    // Append the city
    const separator = citiesGroup.trim() === '' ? '' : ',\n      ';
    const updatedCitiesGroup = citiesGroup.replace(/[\s\n]*$/, '') + `${separator}"${update.city}"\n    `;
    return match.replace(citiesGroup, updatedCitiesGroup);
  });
  console.log(`Updated country cities list for ${update.code} with "${update.city}".`);
});

fs.writeFileSync('src/data/index.js', content, 'utf8');
