const fs = require('fs');
const path = require('path');
const { attractionKnowledgeBase, realCityFoodAndTransit } = require('../src/data/attractionKnowledgeBase.js');

const nameFixes = {
  tokyo: {
    "Senso": "Sensō-ji Temple"
  },
  kyoto: {
    "Kinkaku": "Kinkaku-ji (Golden Pavilion)",
    "Kiyomizu": "Kiyomizu-dera Temple",
    "Ryoan": "Ryōan-ji Temple"
  },
  osaka: {
    "Shitenno": "Shitennō-ji Temple"
  },
  mecca: {
    "Masjid al": "Al-Masjid al-Haram",
    "Hira Cave (Jabal al": "Hira Cave (Jabal al-Nour)"
  },
  medina: {
    "Al": "Al-Masjid an-Nabawi",
    "Baqi Cemetery (Jannat al": "Al-Baqi Cemetery (Jannat al-Baqi)",
    "Dar al": "Dar Al Madinah Museum",
    "Wadi al": "Wadi al-Jinn"
  },
  hochiminhcity: {
    "Notre": "Saigon Notre-Dame Cathedral Basilica"
  },
  paris: {
    "Notre": "Notre-Dame Cathedral",
    "Champs": "Champs-Élysées",
    "Montmartre & Sacre": "Montmartre & Sacré-Cœur Basilica"
  },
  orlando: {
    "International Drive (I": "International Drive (I-Drive)"
  },
  montreal: {
    "Old Montreal (Vieux": "Old Montreal (Vieux-Montréal)",
    "Notre": "Notre-Dame Basilica of Montreal",
    "Jean": "Jean-Talon Market"
  },
  cancun: {
    "Whale Shark Swimming (Seasonal, May": "Whale Shark Swimming (Seasonal, May to September)"
  }
};

let fixedCount = 0;
for (const citySlug in nameFixes) {
  const attractions = attractionKnowledgeBase[citySlug];
  if (!attractions) continue;
  
  const fixes = nameFixes[citySlug];
  attractions.forEach(spot => {
    if (fixes[spot.name]) {
      console.log(`Fixing "${spot.name}" -> "${fixes[spot.name]}" in ${citySlug}`);
      spot.name = fixes[spot.name];
      fixedCount++;
    }
  });
}

// Save back to file
const realKbFile = path.resolve(__dirname, '../src/data/attractionKnowledgeBase.js');
let fileContent = `export const attractionKnowledgeBase = {\n`;
for (const key in attractionKnowledgeBase) {
  fileContent += `  ${key}: ${JSON.stringify(attractionKnowledgeBase[key], null, 2)},\n`;
}
fileContent += `};\n\n`;

fileContent += `export const realCityFoodAndTransit = {\n`;
for (const key in realCityFoodAndTransit) {
  fileContent += `  ${key}: ${JSON.stringify(realCityFoodAndTransit[key], null, 2)},\n`;
}
fileContent += `};\n`;

fs.writeFileSync(realKbFile, fileContent, 'utf8');
console.log(`Successfully fixed ${fixedCount} names in ${realKbFile}`);
