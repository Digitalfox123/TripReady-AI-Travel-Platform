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

console.log("Found countries to prune:", countries.length);

const cityRegistry = {
  'Antarctica': ['Antarctica'],
  'Argentina': ['Buenos Aires', 'Mendoza', 'Bariloche'],
  'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Gold Coast', 'Cairns'],
  'Belize': ['Belize City', 'Ambergris Caye', 'Placencia'],
  'Bhutan': ['Thimphu', 'Paro', 'Punakha'],
  'Botswana': ['Gaborone', 'Maun', 'Kasane'],
  'Brazil': ['Rio de Janeiro', 'São Paulo', 'Salvador', 'Florianópolis'],
  'Cambodia': ['Phnom Penh', 'Siem Reap', 'Sihanoukville'],
  'Canada': ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa'],
  'Chile': ['Santiago', 'Valparaíso', 'Punta Arenas'],
  'China': ['Shanghai', 'Beijing', 'Guangzhou', 'Shenzhen', 'Chengdu'],
  'Congo': ['Brazzaville', 'Pointe-Noire'],
  'Croatia': ['Zagreb', 'Dubrovnik', 'Split', 'Zadar'],
  'Cuba': ['Havana', 'Varadero', 'Trinidad'],
  'Ecuador': ['Quito', 'Guayaquil', 'Cuenca'],
  'Egypt': ['Cairo', 'Luxor', 'Aswan', 'Hurghada', 'Sharm El Sheikh', 'Alexandria'],
  'France': ['Paris', 'Nice', 'Lyon', 'Marseille', 'Bordeaux', 'Strasbourg'],
  'French Polynesia': ['Papeete', 'Bora Bora', 'Moorea'],
  'Greece': ['Athens', 'Santorini', 'Mykonos', 'Crete', 'Rhodes', 'Corfu'],
  'Hong Kong': ['Hong Kong'],
  'Hungary': ['Budapest'],
  'Iceland': ['Reykjavik', 'Akureyri', 'Vik', 'Husavik'],
  'India': ['Delhi', 'Mumbai', 'Jaipur', 'Goa', 'Agra', 'Varanasi'],
  'Indonesia': ['Bali', 'Jakarta', 'Yogyakarta', 'Lombok'],
  'Iran': ['Tehran', 'Shiraz', 'Isfahan', 'Yazd'],
  'Italy': ['Rome', 'Venice', 'Florence', 'Milan', 'Naples', 'Amalfi'],
  'Japan': ['Tokyo', 'Kyoto', 'Osaka', 'Hiroshima', 'Sapporo', 'Nara'],
  'Jordan': ['Amman', 'Aqaba', 'Petra'],
  'Kazakhstan': ['Almaty', 'Astana', 'Shymkent'],
  'Laos': ['Luang Prabang', 'Vientiane', 'Vang Vieng'],
  'Madagascar': ['Antananarivo', 'Nosy Be', 'Morondava'],
  'Malaysia': ['Kuala Lumpur', 'Penang', 'Langkawi', 'Kota Kinabalu'],
  'Maldives': ['Malé', 'Maafushi'],
  'Mexico': ['Mexico City', 'Cancún', 'Playa del Carmen', 'Tulum', 'Oaxaca'],
  'Mongolia': ['Ulaanbaatar'],
  'Morocco': ['Marrakech', 'Casablanca', 'Fez', 'Chefchaouen', 'Rabat'],
  'Myanmar': ['Yangon', 'Mandalay', 'Bagan'],
  'Namibia': ['Windhoek', 'Swakopmund', 'Walvis Bay'],
  'Nepal': ['Kathmandu', 'Pokhara', 'Lalitpur'],
  'New Zealand': ['Auckland', 'Queenstown', 'Wellington', 'Rotorua', 'Christchurch'],
  'Norway': ['Oslo', 'Bergen', 'Tromsø', 'Stavanger', 'Lofoten'],
  'Pakistan': ['Islamabad', 'Lahore', 'Karachi', 'Peshawar', 'Hunza', 'Skardu', 'Swat'],
  'Peru': ['Lima', 'Cusco', 'Arequipa'],
  'Philippines': ['Manila', 'Cebu', 'Boracay', 'El Nido'],
  'Portugal': ['Lisbon', 'Porto', 'Algarve', 'Sintra'],
  'Saudi Arabia': ['Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Al Ula'],
  'Singapore': ['Singapore'],
  'South Africa': ['Cape Town', 'Johannesburg', 'Durban'],
  'South Korea': ['Seoul', 'Busan', 'Jeju Island', 'Gyeongju', 'Incheon'],
  'Spain': ['Barcelona', 'Madrid', 'Seville', 'Valencia', 'Malaga', 'Ibiza'],
  'Switzerland': ['Zurich', 'Geneva', 'Lucerne', 'Interlaken', 'Zermatt'],
  'Tanzania': ['Dar es Salaam', 'Zanzibar', 'Arusha'],
  'Thailand': ['Bangkok', 'Phuket', 'Chiang Mai', 'Krabi', 'Koh Samui', 'Pattaya'],
  'Tunisia': ['Tunis', 'Sousse', 'Hammamet'],
  'Turkey': ['Istanbul', 'Antalya', 'Cappadocia', 'Bodrum', 'Izmir', 'Ankara'],
  'Turkmenistan': ['Ashgabat'],
  'Turks & Caicos': ['Providenciales', 'Cockburn Town'],
  'UAE': ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ras Al Khaimah'],
  'United Kingdom': ['London', 'Manchester', 'Edinburgh', 'Birmingham', 'Liverpool', 'Bristol'],
  'United States': ['New York', 'Los Angeles', 'Chicago', 'Miami', 'San Francisco', 'Las Vegas', 'Seattle', 'Houston'],
  'Uzbekistan': ['Tashkent', 'Samarkand', 'Bukhara'],
  'Zimbabwe': ['Harare', 'Victoria Falls', 'Bulawayo']
};

// Update cities in-place
countries.forEach(c => {
  if (cityRegistry[c.name]) {
    c.cities = cityRegistry[c.name];
  }
});

const countriesCodeStr = 'export const countries = ' + JSON.stringify(countries, null, 2) + ';';

// Replace the countries segment in the file content
const finalFileContent = fileContent.substring(0, countriesStart) + countriesCodeStr + fileContent.substring(countriesEnd + 2);

fs.writeFileSync(filePath, finalFileContent, 'utf8');
console.log("Successfully pruned and updated city list in index.js!");
