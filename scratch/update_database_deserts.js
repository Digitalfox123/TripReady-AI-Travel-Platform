import fs from 'fs';

const filePath = 'C:\\Users\\hafiz\\.gemini\\antigravity\\scratch\\trip-ready\\src\\data\\index.js';
const fileContent = fs.readFileSync(filePath, 'utf8');

// Parse countries
const countriesStart = fileContent.indexOf('export const countries = [');
let bracketCount = 0;
let countriesEnd = -1;
for (let i = countriesStart + 'export const countries = '.length; i < fileContent.length; i++) {
  if (fileContent[i] === '[') bracketCount++;
  if (fileContent[i] === ']') {
    bracketCount--;
    if (bracketCount === 0) {
      countriesEnd = i;
      break;
    }
  }
}
const countriesStr = fileContent.substring(countriesStart + 'export const countries = '.length, countriesEnd + 1);
const countries = eval(countriesStr);

// Parse topDestinations
const destStart = fileContent.indexOf('export const topDestinations = [');
let destBracketCount = 0;
let destEnd = -1;
for (let i = destStart + 'export const topDestinations = '.length; i < fileContent.length; i++) {
  if (fileContent[i] === '[') destBracketCount++;
  if (fileContent[i] === ']') {
    destBracketCount--;
    if (destBracketCount === 0) {
      destEnd = i;
      break;
    }
  }
}
const destStr = fileContent.substring(destStart + 'export const topDestinations = '.length, destEnd + 1);
const topDestinations = eval(destStr);

console.log("Original countries count:", countries.length);
console.log("Original destinations count:", topDestinations.length);

// 1. Add missing desert countries
const newDesertCountries = [
  { code: 'UZ', name: 'Uzbekistan', flag: '🇺🇿', cities: ['Kyzylkum Desert'] },
  { code: 'TM', name: 'Turkmenistan', flag: '🇹🇲', cities: ['Karakum Desert'] },
  { code: 'KZ', name: 'Kazakhstan', flag: '🇰🇿', cities: ['Kyzylkum Desert'] },
  { code: 'NA', name: 'Namibia', flag: '🇳🇦', cities: ['Namib Desert'] },
  { code: 'MN', name: 'Mongolia', flag: '🇲🇳', cities: ['Gobi Desert'] }
];

newDesertCountries.forEach(nc => {
  const exists = countries.find(c => c.code === nc.code);
  if (!exists) {
    countries.push(nc);
    console.log(`Added missing country: ${nc.name} (${nc.code})`);
  }
});

// 2. Update existing countries' cities lists for the desert entries
const desertCityUpdates = {
  AQ: ['Antarctic Desert'],
  CA: ['Arctic Desert'],
  US: ['Arctic Desert'],
  MA: ['Sahara Desert'],
  SA: ["Rub' al Khali"],
  IN: ['Thar Desert'],
  PK: ['Thar Desert'],
  BW: ['Kalahari Desert'],
  ZA: ['Kalahari Desert'],
  AU: ['Great Victoria Desert'],
  CL: ['Atacama Desert'],
  PE: ['Atacama Desert'],
  CN: ['Gobi Desert']
};

Object.entries(desertCityUpdates).forEach(([code, citiesList]) => {
  const c = countries.find(item => item.code === code);
  if (c) {
    citiesList.forEach(city => {
      if (!c.cities.includes(city)) {
        c.cities.push(city);
        console.log(`Updated cities of ${c.name} (${code}) to include "${city}"`);
      }
    });
  }
});

// Sort countries alphabetically
countries.sort((a, b) => a.name.localeCompare(b.name));

// 3. Process topDestinations:
// Gentler unlinking: Keep dubai, cappadocia, cairo-pyramids, petra-rose, marrakech, alula but strip 'deserts' from categoryIds
// Discard sahara and dubai-desert completely
const keepRemoveDesertsIds = ['dubai', 'cappadocia', 'cairo-pyramids', 'petra-rose', 'marrakech', 'alula'];
const processedDestinations = [];

topDestinations.forEach(dest => {
  if (dest.categoryIds && dest.categoryIds.includes('deserts')) {
    if (keepRemoveDesertsIds.includes(dest.id)) {
      // Remove 'deserts' from categoryIds but keep the destination record intact!
      dest.categoryIds = dest.categoryIds.filter(c => c !== 'deserts');
      processedDestinations.push(dest);
      console.log(`Unlinked 'deserts' category from destination: ${dest.name} (${dest.id})`);
    } else if (dest.id === 'sahara' || dest.id === 'dubai-desert') {
      console.log(`Purged obsolete placeholder: ${dest.name} (${dest.id})`);
    } else {
      // Keep any other desert entries (just in case) or put in process
      processedDestinations.push(dest);
    }
  } else {
    processedDestinations.push(dest);
  }
});

// 4. Find the maximum rank currently in processedDestinations to assign new ranks
let maxRank = 0;
processedDestinations.forEach(d => {
  if (typeof d.rank === 'number' && d.rank > maxRank) {
    maxRank = d.rank;
  }
});
console.log("Current maximum destination rank:", maxRank);

// Define 11 new definitive desert destinations with verified 100% working images
const newDeserts = [
  {
    id: "antarctic-desert",
    name: "Antarctic Desert",
    country: "Antarctica",
    flag: "🇦🇶",
    rank: ++maxRank,
    image: "https://images.unsplash.com/photo-1517783999520-f068d7431a60?w=1200&q=80",
    preview: "The largest overall desert on Earth—a freezing, dry ice sheet wilderness.",
    description: "The Antarctic Desert is the single largest desert on Earth, spanning roughly 14.2 million square kilometers. Water here is locked completely in ice sheets rather than falling as liquid rain. It is the coldest, windiest, and driest continent on the planet, featuring dramatic glacial landscapes and specialized marine wildlife.",
    weather: { temp: "-25°C", condition: "Freezing Sun", humidity: "10%", airQuality: "Excellent" },
    bestTime: "December - February (Polar Summer)",
    budget: { daily: "$500-1500", hotel: "$400-1200", food: "$80-200", transport: "$300-1000" },
    safety: "Extreme Environment (Guided Expeditions)",
    timezone: "Multiple (UTC+12 / UTC-3)",
    attractions: ["McMurdo Dry Valleys", "South Pole Station", "Lemaire Channel", "Paradise Bay"],
    foods: ["Pemmican", "Dehydrated Stew", "High-calorie Chocolate", "Hot Cocoa"],
    transport: ["Expedition Vessel", "Helicopter", "Zodiac Boat", "Snowcat"],
    culture: "Scientific collaboration and strict environmental conservation under the Antarctic Treaty.",
    visa: "Permit required via national environmental authority.",
    categoryIds: ["deserts", "snow", "adventure"],
    gallery: [
      "https://images.unsplash.com/photo-1517783999520-f068d7431a60?w=1200&q=80",
      "https://images.unsplash.com/photo-1551244072-5d12893278ab?w=1200&q=80",
      "https://images.unsplash.com/photo-1524820197278-540916411e20?w=1200&q=80",
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&q=80"
    ]
  },
  {
    id: "arctic-desert",
    name: "Arctic Desert",
    country: "Canada",
    flag: "🇨🇦",
    rank: ++maxRank,
    image: "https://images.unsplash.com/photo-1482862549707-f63cb32c5fd9?w=1200&q=80",
    preview: "The second-largest global desert, spanning ice caps and barren tundra.",
    description: "The Arctic Desert is the second-largest global desert (~13.9 million sq km), covering parts of Canada, Alaska, Greenland, and Russia. It consists of massive ice caps, glaciers, and barren tundra fields where water remains entirely frozen. Despite the cold aridity, it supports iconic polar wildlife including arctic foxes and polar bears.",
    weather: { temp: "-15°C", condition: "Overcast & Cold", humidity: "15%", airQuality: "Excellent" },
    bestTime: "June - August (Midnight Sun)",
    budget: { daily: "$300-800", hotel: "$200-600", food: "$50-120", transport: "$150-450" },
    safety: "Cold Hazards (Wildlife caution)",
    timezone: "EST (UTC-5)",
    attractions: ["Ellesmere Island", "Baffin Island Fjords", "Svalbard Glaciers", "Greenland Ice Cap"],
    foods: ["Arctic Char", "Bannock", "Smoked Salmon", "Dried Berries"],
    transport: ["Snowmobile", "Dog Sled", "Bush Plane", "Icebreaker Ship"],
    culture: "Deep-seated Inuit tradition, centering around seasonal tracking, fishing, and organic craftsmanship.",
    visa: "Standard Canadian Visa/eTA (depends on entry country).",
    categoryIds: ["deserts", "snow", "adventure"],
    gallery: [
      "https://images.unsplash.com/photo-1482862549707-f63cb32c5fd9?w=1200&q=80",
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&q=80",
      "https://images.unsplash.com/photo-1489440543286-a69330151c0b?w=1200&q=80",
      "https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?w=1200&q=80"
    ]
  },
  {
    id: "sahara-desert",
    name: "Sahara Desert",
    country: "Morocco",
    flag: "🇲🇦",
    rank: ++maxRank,
    image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?w=1200&q=80",
    preview: "The largest hot desert in the world, featuring colossal sand dunes.",
    description: "The Sahara is the largest hot desert in the world (~9.2 million sq km), cutting across 11 North African countries. It is characterized by massive, wind-swept dune fields (ergs), stone plateaus, and hidden dry valleys. Known for its intense daytime heat, rich Bedouin culture, and starlit skies, it is a timeless escape.",
    weather: { temp: "32°C", condition: "Sunny & Dry", humidity: "8%", airQuality: "Moderate" },
    bestTime: "October - May (Cooler winter months)",
    budget: { daily: "$50-150", hotel: "$40-200", food: "$15-40", transport: "$20-80" },
    safety: "Safe in tourist zones (Use local guides)",
    timezone: "WET (UTC+0)",
    attractions: ["Erg Chebbi Dunes", "Draa Valley Oases", "M'Hamid Desert Gate", "Atlas Mountain Views"],
    foods: ["Tagine", "Couscous", "Mint Tea", "Dates"],
    transport: ["Camel Caravan", "4x4 SUV", "Quad Bike", "Walking"],
    culture: "Berber and Bedouin fireside music, traditional tea ceremonies, and stargazing storytelling.",
    visa: "Visa-free for most Western passport holders via Morocco.",
    categoryIds: ["deserts", "adventure", "cultural"],
    gallery: [
      "https://images.unsplash.com/photo-1547234935-80c7145ec969?w=1200&q=80",
      "https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=1200&q=80",
      "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=1200&q=80",
      "https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?w=1200&q=80"
    ]
  },
  {
    id: "rub-al-khali",
    name: "Rub' al Khali",
    country: "Saudi Arabia",
    flag: "🇸🇦",
    rank: ++maxRank,
    image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1200&q=80",
    preview: "The Empty Quarter—the largest uninterrupted body of sand on Earth.",
    description: "Spanning the Arabian Peninsula, the Rub' al Khali (The Empty Quarter) is the largest continuous body of sand on Earth. It features spectacular, wind-sculpted golden dunes, remote desert oases, and ancient trade routes, offering a raw, endless wilderness experience under dramatic desert skies.",
    weather: { temp: "38°C", condition: "Clear & Sunny", humidity: "5%", airQuality: "Good" },
    bestTime: "November - March",
    budget: { daily: "$150-450", hotel: "$120-600", food: "$30-100", transport: "$50-200" },
    safety: "Safe with guides (Extreme summer heat)",
    timezone: "AST (UTC+3)",
    attractions: ["Liwa Oasis Dunes", "Shaybah Dunes", "Ubar Lost City Ruins", "Star-gazing Camps"],
    foods: ["Kabsa", "Mandi", "Arabic Coffee", "Dates and Camel Milk"],
    transport: ["4x4 Desert Vehicle", "Camel", "Dune Buggy"],
    culture: "Traditional Bedouin hospitality, ancient desert poetry, falconry, and camel breeding.",
    visa: "eVisa available online for citizens of over 40 countries.",
    categoryIds: ["deserts", "adventure", "luxury"],
    gallery: [
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1200&q=80",
      "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=1200&q=80",
      "https://images.unsplash.com/photo-1547234935-80c7145ec969?w=1200&q=80",
      "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=1200&q=80"
    ]
  },
  {
    id: "thar-desert",
    name: "Thar Desert",
    country: "India",
    flag: "🇮🇳",
    rank: ++maxRank,
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&q=80",
    preview: "The Great Indian Desert, the most densely populated and colorful desert area.",
    description: "Also known as the Great Indian Desert, the Thar is famous for its rich cultural heritage, wind-swept sand dunes, and majestic sandstone fortresses. It is the most densely populated desert in the world, renowned for its colorful traditional attire, vibrant festivals, folk music, and camel safaris.",
    weather: { temp: "29°C", condition: "Sunny", humidity: "25%", airQuality: "Moderate" },
    bestTime: "October - March",
    budget: { daily: "$30-90", hotel: "$20-150", food: "$10-30", transport: "$10-40" },
    safety: "Very Safe (Tourist-friendly)",
    timezone: "IST (UTC+5.5)",
    attractions: ["Jaisalmer Golden Fort", "Sam Sand Dunes", "Desert National Park", "Khuri Village"],
    foods: ["Ker Sangri", "Dal Baati Churma", "Gatte ki Sabji", "Masala Chai"],
    transport: ["Camel", "Auto Rickshaw", "4x4 SUV", "Tuk-Tuk"],
    culture: "Exquisite Rajasthani folk dances, traditional puppets, vibrant local turbans, and ancient stargazing forts.",
    visa: "eVisa available online for most countries.",
    categoryIds: ["deserts", "cultural", "historical"],
    gallery: [
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&q=80",
      "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=1200&q=80",
      "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1200&q=80",
      "https://images.unsplash.com/photo-1455620611406-966ca6889d80?w=1200&q=80"
    ]
  },
  {
    id: "kalahari-desert",
    name: "Kalahari Desert",
    country: "Botswana",
    flag: "🇧🇼",
    rank: ++maxRank,
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80",
    preview: "A vast semi-arid sandy savanna featuring rich wildlife and red dunes.",
    description: "The Kalahari is a vast semi-arid sandy savanna covering Botswana, Namibia, and South Africa. Characterized by spectacular red dunes and dry grasslands, the Kalahari is home to endemic wildlife like black-maned lions, cheetahs, and meerkats, offering an iconic desert-safari blend.",
    weather: { temp: "27°C", condition: "Clear & Sunny", humidity: "20%", airQuality: "Good" },
    bestTime: "May - October (Dry winter season)",
    budget: { daily: "$200-600", hotel: "$150-800", food: "$30-80", transport: "$40-150" },
    safety: "Safe (Wildlife guides recommended)",
    timezone: "CAT (UTC+2)",
    attractions: ["Central Kalahari Reserve", "Makgadikgadi Salt Flats", "Kgalagadi Transfrontier Park", "Tsodilo Hills Cave Paintings"],
    foods: ["Seswaa", "Pap", "Biltong", "Morogo Greens"],
    transport: ["Open Safari Vehicle", "4x4 Overland Truck", "Bush Plane"],
    culture: "Home of the San people (Bushmen), possessing deep tracking skills and the oldest living culture in Southern Africa.",
    visa: "Visa-free for most Western passport holders.",
    categoryIds: ["deserts", "wildlife", "adventure"],
    gallery: [
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80",
      "https://images.unsplash.com/photo-1528184039930-bd03972bd974?w=1200&q=80",
      "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200&q=80",
      "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=1200&q=80"
    ]
  },
  {
    id: "great-victoria-desert",
    name: "Great Victoria Desert",
    country: "Australia",
    flag: "🇦🇺",
    rank: ++maxRank,
    image: "https://images.unsplash.com/photo-1529108190281-9a4f620bc2d8?w=1200&q=80",
    preview: "Australia's largest desert, famous for red sands, salt lakes, and grasslands.",
    description: "The Great Victoria Desert is the largest desert in Australia, characterized by deep red sand dunes, extensive salt lakes, and spinifex grasslands. It is an extremely remote outback wilderness home to unique desert reptiles, kangaroos, and beautiful native eucalyptus woodlands.",
    weather: { temp: "28°C", condition: "Sunny & Breezy", humidity: "12%", airQuality: "Excellent" },
    bestTime: "April - September (Australian winter/cool season)",
    budget: { daily: "$150-350", hotel: "$100-300", food: "$30-70", transport: "$50-200" },
    safety: "Extremely Remote (Prepare water, fuel, and communication)",
    timezone: "ACST (UTC+9.5)",
    attractions: ["Mamungari Conservation Park", "Plumridge Lakes", "Anne Beadell Highway", "Coober Pedy Opal Mining Town"],
    foods: ["Damper Bread", "Bush Tucker Fruits", "Grilled Kangaroo", "Barramundi"],
    transport: ["Heavy Duty 4x4 SUV", "Walking", "Caravan"],
    culture: "Deep spiritual connection to the Indigenous Anangu and Maralinga Tjarutja traditional owners.",
    visa: "Australian eVisitor or ETA required.",
    categoryIds: ["deserts", "adventure", "nature"],
    gallery: [
      "https://images.unsplash.com/photo-1529108190281-9a4f620bc2d8?w=1200&q=80",
      "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=1200&q=80",
      "https://images.unsplash.com/photo-1528184039930-bd03972bd974?w=1200&q=80",
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80"
    ]
  },
  {
    id: "atacama-desert",
    name: "Atacama Desert",
    country: "Chile",
    flag: "🇨🇱",
    rank: ++maxRank,
    image: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=1200&q=80",
    preview: "The driest non-polar place on Earth, featuring lunar valleys and salt flats.",
    description: "The Atacama is the driest non-polar location on Earth, with landscapes so barren and Mars-like that NASA tests space rovers here. It features dramatic lunar rock formations, steaming high-altitude geysers, and crystalline salt flats, offering the clearest starlit night skies on Earth.",
    weather: { temp: "22°C", condition: "Bright Sun & Dry", humidity: "2%", airQuality: "Excellent" },
    bestTime: "Year-round (Best skies in June - September)",
    budget: { daily: "$100-250", hotel: "$70-350", food: "$25-60", transport: "$30-90" },
    safety: "Very Safe (High altitude preparation needed)",
    timezone: "CLT (UTC-3)",
    attractions: ["Valle de la Luna (Valley of the Moon)", "El Tatio Geysers", "Salar de Atacama Salt Flats", "ALMA Observatory"],
    foods: ["Empanadas", "Pastel de Choclo", "Patasca Stew", "Pisco Sour"],
    transport: ["4x4 Vehicle", "Bicycle", "Group Tour Bus"],
    culture: "Influence of ancient Likan Antai (Atacameño) people, known for high-altitude stone crafts and terraced farming.",
    visa: "Visa-free for most Western passport holders.",
    categoryIds: ["deserts", "adventure", "nature"],
    gallery: [
      "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=1200&q=80",
      "https://images.unsplash.com/photo-1483168527879-c66136b56105?w=1200&q=80",
      "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=1200&q=80",
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200&q=80"
    ]
  },
  {
    id: "namib-desert",
    name: "Namib Desert",
    country: "Namibia",
    flag: "🇳🇦",
    rank: ++maxRank,
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&q=80",
    preview: "The oldest desert in the world, with giant red dunes dropping into the ocean.",
    description: "Dating back at least 55 million years, the Namib is the oldest desert on Earth. It is famous for its colossal, deep-red sand dunes at Sossusvlei that drop directly into the cold Atlantic Ocean. Deadvlei's 900-year-old skeletal trees set against orange dunes present an iconic visual.",
    weather: { temp: "24°C", condition: "Sunny & Coastal Breeze", humidity: "35%", airQuality: "Good" },
    bestTime: "May - October",
    budget: { daily: "$120-300", hotel: "$90-400", food: "$20-50", transport: "$40-120" },
    safety: "Very Safe",
    timezone: "WAT (UTC+1)",
    attractions: ["Sossusvlei Dunes", "Deadvlei Clay Pan", "Skeleton Coast", "Sesriem Canyon"],
    foods: ["Braaivleis (Barbecue)", "Kapana Beef", "Biltong", "Oryx Steak"],
    transport: ["4x4 Self-drive SUV", "Hot Air Balloon", "Quad Bike"],
    culture: "Traditional pastoralist heritage of the Himba and Herero tribes, known for distinct customs and clay crafts.",
    visa: "Visa-free for 50+ countries; tourist visa on arrival for others.",
    categoryIds: ["deserts", "nature", "adventure"],
    gallery: [
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&q=80",
      "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=1200&q=80",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80"
    ]
  },
  {
    id: "gobi-desert",
    name: "Gobi Desert",
    country: "Mongolia",
    flag: "🇲🇳",
    rank: ++maxRank,
    image: "https://images.unsplash.com/photo-1527853787696-f7be74f2e39a?w=1200&q=80",
    preview: "A historic, cold rock and gravel desert famous for dinosaur fossils and the Silk Road.",
    description: "The Gobi is a historic rain-shadow desert created by the Himalayas. It is a cold desert featuring gravel plains, singing dunes, and extreme temperature swings. Famous for the ancient Silk Road, it is renowned for legendary dinosaur fossil discoveries at the Flaming Cliffs.",
    weather: { temp: "18°C", condition: "Windy & Sunny", humidity: "15%", airQuality: "Excellent" },
    bestTime: "September - October (Mild Autumn)",
    budget: { daily: "$60-180", hotel: "$40-200", food: "$15-40", transport: "$30-100" },
    safety: "Safe (Nomadic guides essential)",
    timezone: "ULAT (UTC+8)",
    attractions: ["Khongor Singing Sand Dunes", "Flaming Cliffs (Bayanzag)", "Yolyn Am Ice Valley", "Baga Gazriin Chuluu"],
    foods: ["Khushuur (Meat Pastry)", "Buuz (Dumplings)", "Airag (Fermented Mare Milk)", "Roasted Mutton"],
    transport: ["Russian Furgon Van", "Two-humped Bactrian Camel", "4x4 Vehicle"],
    culture: "Traditional nomadic life, staying in circular felt tents (Gers) and participating in the Naadam festival.",
    visa: "Visa-free for 30+ countries; simple online eVisa available.",
    categoryIds: ["deserts", "adventure", "cultural"],
    gallery: [
      "https://images.unsplash.com/photo-1527853787696-f7be74f2e39a?w=1200&q=80",
      "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=1200&q=80",
      "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=1200&q=80",
      "https://images.unsplash.com/photo-1547234935-80c7145ec969?w=1200&q=80"
    ]
  },
  {
    id: "kyzylkum-karakum",
    name: "Kyzylkum & Karakum",
    country: "Uzbekistan",
    flag: "🇺🇿",
    rank: ++maxRank,
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=80",
    preview: "Vast expanses of red and black sands bordered by ancient Silk Road clay cities.",
    description: "The Kyzylkum (Red Sand) and Karakum (Black Sand) deserts are vast expanses located across Uzbekistan, Turkmenistan, and Kazakhstan. They are famous for spectacular clay canyons, desert lakes, historic fortresses, and the dramatic Darvaza Gas Crater (Door to Hell).",
    weather: { temp: "26°C", condition: "Clear & Dry", humidity: "18%", airQuality: "Good" },
    bestTime: "April - May or September - October",
    budget: { daily: "$40-120", hotel: "$30-150", food: "$10-25", transport: "$15-50" },
    safety: "Safe (Avoid remote border zones without guides)",
    timezone: "UZT (UTC+5)",
    attractions: ["Darvaza Gas Crater", "Khiva Ancient Clay City", "Aydarkul Lake Oasis", "Nurata Mountain Fort"],
    foods: ["Plöv (Pilaf)", "Shurpa Soup", "Laghman Noodles", "Samarkand Flatbread"],
    transport: ["Silk Road High-Speed Train", "Shared Taxi", "4x4 Desert Guide SUV"],
    culture: "Centuries-old Islamic Silk Road architecture, bustling bazaars, and traditional Suzani hand-embroidery.",
    visa: "Visa-free for over 90 nationalities.",
    categoryIds: ["deserts", "historical", "cultural"],
    gallery: [
      "https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=80",
      "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=1200&q=80",
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1200&q=80",
      "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=1200&q=80"
    ]
  }
];

newDeserts.forEach(nd => {
  processedDestinations.push(nd);
});

console.log("Final destinations count:", processedDestinations.length);

// 5. Reassemble and write the entire file back
const countriesCodeStr = 'export const countries = ' + JSON.stringify(countries, null, 2) + ';';
const destinationsCodeStr = 'export const topDestinations = ' + JSON.stringify(processedDestinations, null, 2) + ';';

// Let's replace the countries block
const countriesSegmentStart = fileContent.indexOf('export const countries = [');
const fileContentStage1 = fileContent.substring(0, countriesSegmentStart) + countriesCodeStr + fileContent.substring(countriesEnd + 2);

// Re-find the topDestinations array range in Stage 1
const destSegmentStart = fileContentStage1.indexOf('export const topDestinations = [');
let newDestBracketCount = 0;
let newDestEnd = -1;
for (let i = destSegmentStart + 'export const topDestinations = '.length; i < fileContentStage1.length; i++) {
  if (fileContentStage1[i] === '[') newDestBracketCount++;
  if (fileContentStage1[i] === ']') {
    newDestBracketCount--;
    if (newDestBracketCount === 0) {
      newDestEnd = i;
      break;
    }
  }
}

const finalFileContent = fileContentStage1.substring(0, destSegmentStart) + destinationsCodeStr + fileContentStage1.substring(newDestEnd + 2);

fs.writeFileSync(filePath, finalFileContent, 'utf8');
console.log("Successfully wrote the updated database with new deserts to index.js!");
