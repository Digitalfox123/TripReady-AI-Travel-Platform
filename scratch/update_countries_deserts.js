import fs from 'fs';

let content = fs.readFileSync('src/data/index.js', 'utf8');

// Let's add UZ, TM, KZ, NA, and MN right before the closing bracket of countries:
//   }
// ].sort((a, b) => a.name.localeCompare(b.name));

const targetSegment = `  {
    "code": "TC",
    "name": "Turks & Caicos",
    "flag": "🇹🇨",
    "cities": [
      "Grace Bay Beach"
    ]
  }
].sort((a, b) => a.name.localeCompare(b.name));`;

const newSegment = `  {
    "code": "TC",
    "name": "Turks & Caicos",
    "flag": "🇹🇨",
    "cities": [
      "Grace Bay Beach"
    ]
  },
  {
    "code": "UZ",
    "name": "Uzbekistan",
    "flag": "🇺🇿",
    "cities": [
      "Kyzylkum Desert"
    ]
  },
  {
    "code": "TM",
    "name": "Turkmenistan",
    "flag": "🇹🇲",
    "cities": [
      "Karakum Desert"
    ]
  },
  {
    "code": "KZ",
    "name": "Kazakhstan",
    "flag": "🇰🇿",
    "cities": [
      "Kyzylkum Desert"
    ]
  },
  {
    "code": "NA",
    "name": "Namibia",
    "flag": "🇳🇦",
    "cities": [
      "Namib Desert"
    ]
  },
  {
    "code": "MN",
    "name": "Mongolia",
    "flag": "🇲🇳",
    "cities": [
      "Gobi Desert"
    ]
  }
].sort((a, b) => a.name.localeCompare(b.name));`;

if (content.includes(targetSegment)) {
  content = content.replace(targetSegment, newSegment);
  console.log("Successfully registered new desert countries in the countries array!");
} else {
  console.log("ERROR: Target countries array tail not found!");
}

// Now let's update cities arrays for other countries in index.js to support the search page associations:
const countryCityUpdates = [
  { code: 'AQ', city: 'Antarctic Desert' },
  { code: 'CA', city: 'Arctic Desert' },
  { code: 'MA', city: 'Sahara Desert' },
  { code: 'SA', city: "Rub' al Khali" },
  { code: 'IN', city: 'Thar Desert' },
  { code: 'PK', city: 'Thar Desert' },
  { code: 'BW', city: 'Kalahari Desert' },
  { code: 'ZA', city: 'Kalahari Desert' },
  { code: 'AU', city: 'Great Victoria Desert' },
  { code: 'CL', city: 'Atacama Desert' },
  { code: 'CN', city: 'Gobi Desert' }
];

countryCityUpdates.forEach(update => {
  const codeRegex = new RegExp(`"code":\\s*"${update.code}",[^]*?"cities":\\s*\\[([^]*?)\\]`, 'g');
  
  content = content.replace(codeRegex, (match, citiesGroup) => {
    if (citiesGroup.includes(`"${update.city}"`)) {
      return match;
    }
    const separator = citiesGroup.trim() === '' ? '' : ',\n      ';
    const updatedCitiesGroup = citiesGroup.replace(/[\s\n]*$/, '') + `${separator}"${update.city}"\n    `;
    return match.replace(citiesGroup, updatedCitiesGroup);
  });
  console.log(`Updated country cities list for ${update.code} with "${update.city}".`);
});

fs.writeFileSync('src/data/index.js', content, 'utf8');
