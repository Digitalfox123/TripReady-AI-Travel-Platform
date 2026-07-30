import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/pages/DestinationPage.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

const startMarker = 'const getCountryRegions = (dest) => {';
const endMarker = 'const getLocalEvents = (dest) => {';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
  const before = content.substring(0, startIndex);
  const after = content.substring(endIndex);
  
  const newFunction = `const getCountryRegions = (dest) => {
    const cId = dest.id.toLowerCase();
    if (cId === 'switzerland') {
      return [
        { name: 'Zurich', type: 'Urban Luxury & Clockwork', time: 'Base City', activity: 'Explore the historic Bahnhofstrasse, lakeside plazas, and medieval Altstadt.' },
        { name: 'Interlaken', type: 'Adventure & Lakes Valley', time: '1.5 hrs by Train', activity: 'Skydive over Swiss lakes, ride cogwheel railways, and explore Lauterbrunnen waterfalls.' },
        { name: 'Zermatt', type: 'Alpine Peaks & Off-grid Sanctuary', time: '2 hrs by Train', activity: 'Hike near the majestic Matterhorn, ride the Gornergrat railway, and breathe carbon-free alpine air.' },
        { name: 'Geneva', type: 'Lakeside Science & Diplomacy', time: '2.5 hrs by Train', activity: 'Stroll past the massive Jet d\\'Eau fountain, visit CERN, and tour watchmaking galleries.' }
      ];
    }
    if (cId === 'costa-rica') {
      return [
        { name: 'San José', type: 'Cultural Gateway', time: 'Base City', activity: 'Visit the National Theatre, explore local gold museums, and sample organic coffee.' },
        { name: 'Arenal Volcano', type: 'Thermal Springs & Volcanoes', time: '2.5 hrs by Road', activity: 'Hike active volcanic trails, traverse hanging forest bridges, and soak in natural hot springs.' },
        { name: 'Monteverde', type: 'Mystical Cloud Forest Canopy', time: '3 hrs by Road', activity: 'Embark on world-class zip-line adventures and explore pristine cloud forest biodiversity.' },
        { name: 'Manuel Antonio', type: 'Jungle Coast & White Sands', time: '3.5 hrs by Road', activity: 'Spot sloths and monkeys in the lush rainforest bordering spectacular white sand beaches.' }
      ];
    }
    if (cId === 'norway') {
      return [
        { name: 'Oslo', type: 'Modern Nordic Design', time: 'Base City', activity: 'Visit the Opera House, Vigeland Sculpture Park, and the new Munch Museum.' },
        { name: 'Bergen', type: 'Fjord Gateway & Hanseatic Wharf', time: '6 hrs by Scenic Rail', activity: 'Stroll through colorful Bryggen wooden alleys, ride the funicular, and scan dynamic fjords.' },
        { name: 'Flåm', type: 'Epic Glacier Fjord Valley', time: '2 hrs by Ferry/Rail', activity: 'Ride the world-famous Flåmsbana mountain train and explore sheer cliffs by boat.' },
        { name: 'Lofoten Islands', type: 'Arctic Peaks & Fishing Villages', time: '1.5 hrs by Flight', activity: 'Photograph red fisherman cabins, hike iconic ridge trails, and watch the Northern Lights.' }
      ];
    }
    if (cId === 'new-zealand') {
      return [
        { name: 'Auckland', type: 'Harbor Volcanic Hub', time: 'Base City', activity: 'Explore vibrant harbor cafes, scale the Sky Tower, and ferry to Waiheke wine estates.' },
        { name: 'Rotorua', type: 'Geothermal Wonders & Maori Culture', time: '3 hrs by Road', activity: 'Explore bubbling mud pools, active geysers, and experience traditional Maori Hangi dinners.' },
        { name: 'Queenstown', type: 'The Adventure Capital', time: '1.5 hrs by Flight', activity: 'Skydive, bungee jump, ride the Shotover jet, or ski in the Remarkables.' },
        { name: 'Milford Sound', type: 'Glacial Fjord Sanctuary', time: '4 hrs by Scenic Coach', activity: 'Cruise through majestic glacial fjords, towering waterfalls, and spot fur seals.' }
      ];
    }
    if (cId === 'japan') {
      return [
        { name: 'Tokyo', type: 'Neon Skyscrapers & Spiritual Shrines', time: 'Base City', activity: 'Explore Shibuya Crossing, ascend Tokyo Skytree, and stroll through Meiji Shrine and historic Senso-ji temple.' },
        { name: 'Kyoto', type: 'Ancient Temple & Bamboo Wilderness', time: '2 hrs by Bullet Train', activity: 'Visit Kinkaku-ji (Golden Pavilion), hike through Fushimi Inari Torii gates, and walk the Arashiyama Bamboo Grove.' },
        { name: 'Osaka', type: 'Neon Nightlife & Legendary Street Food', time: '30 mins by Rail', activity: 'Indulge in takoyaki and okonomiyaki in Dotonbori, explore Osaka Castle, and ride the Umeda Sky Ferris wheel.' },
        { name: 'Nara', type: 'UNESCO Giant Buddha & Sacred Bowing Deer', time: '45 mins by Rail', activity: 'Feed tame deer in Nara Park and marvel at the colossal bronze Buddha statue at Todai-ji Temple.' }
      ];
    }
    if (cId === 'india') {
      return [
        { name: 'Delhi', type: 'Metropolitan & Mughal Heritage Hub', time: 'Base City', activity: 'Visit the historic Red Fort, scale Qutub Minar, and dine on spicy parathas in Old Delhi Chandni Chowk.' },
        { name: 'Agra & Jaipur', type: 'The Iconic Golden Triangle Landmarks', time: '3-4 hrs by Expressway', activity: 'Witness the sunrise over the breathtaking Taj Mahal, explore Agra Fort, and tour the pink palaces of Jaipur.' },
        { name: 'Mumbai', type: 'Vibrant Coastal Boulevard & Financial Central', time: '2 hrs by Flight', activity: 'Walk through the Gateway of India, take a sunset drive along Marine Drive, and explore Elephanta Caves.' },
        { name: 'Goa & Kerala', type: 'Tropical Beaches & Tranquil Backwaters', time: '1.5 hrs by Flight', activity: 'Relax on sandy beaches, tour historic Portuguese churches in Goa, and cruise Kerala backwaters in a traditional houseboat.' }
      ];
    }
    if (cId === 'pakistan') {
      return [
        { name: 'Lahore', type: 'Mughal Architectural Capital & Food streets', time: 'Base City', activity: 'Visit the historic Badshahi Mosque, Lahore Fort, Liberty Market, and feast at Fort Road Food Street.' },
        { name: 'Islamabad', type: 'Scenic Green Foothills & Monumental Squares', time: '4 hrs by Motorway', activity: 'Breathe fresh air at Margalla Hills, visit Faisal Mosque, and capture monument panoramas at Shakarparian.' },
        { name: 'Hunza Valley', type: 'High Altitude Peaks & Ancient Silk Road Forts', time: '1 hr Flight + Road', activity: 'Explore Altit and Baltit forts, boat across turquoise Attabad Lake, and watch sunset at Eagle\\'s Nest.' },
        { name: 'Skardu', type: 'Cold Desert Sand Dunes & High Mountain Lakes', time: '1 hr Scenic Flight', activity: 'Tour the Shangrila Resort, cross the Katpana Cold Desert, and drive through the high-altitude Deosai Plains.' }
      ];
    }
    return [
      { name: \`Capital Region of \${dest.name}\`, type: 'Metropolitan & Heritage Center', time: 'Base City', activity: 'Tour historical royal monuments, national galleries, and try authentic central street food.' }
    ];
  };

  `;
  
  fs.writeFileSync(filePath, before + newFunction + after, 'utf-8');
  console.log("Successfully replaced getCountryRegions structurally!");
} else {
  console.error("FAIL: Could not locate markers", { startIndex, endIndex });
}
