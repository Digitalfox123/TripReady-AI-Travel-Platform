const sample1 = "Chimelong Resort (Theme Park & Safari) 2. Canton Tower (Iconic TV Tower & Observation Deck) 3. Shamian Island (Historic Colonial Architecture) 4. Chen Clan Ancestral Hall (Traditional Architecture & Museum) 5. Yuexiu Park (Five Rams Sculpture, Zhenhai Tower) 6. Guangzhou Sunac Snow World (Indoor Ski Resort) 7. Shangxiajiu Pedestrian Street (Shopping & Food) 8. Temple of the Five Immortals 9. Pearl River Night Cruise 10. Guangdong Museum";
const sample2 = "Great Wall of China (Mutianyu/Badaling/Jinshanling) 2. Forbidden City (Palace Museum - UNESCO World Heritage) 3. Temple of Heaven (Tiantan - UNESCO World Heritage) 4. Summer Palace (Yiheyuan - UNESCO World Heritage) 5. Tiananmen Square (World's Largest Public Square) 6. Lama Temple (Yonghe Gong - Tibetan Buddhist Temple) 7. Hutong Historic Districts (Traditional Courtyard Alleys) 8. Beihai Park (Imperial Garden) 9. Ming Tombs (Imperial Burial Grounds) 10. National Stadium (Bird's Nest) & National Aquatics Center (Water Cube)";
const sample3 = "1. Balboa Park & Museums 2. San Diego Zoo";
const sample4 = "Just a single attraction name without numbers";

function splitNumberedAttractions(name) {
  // Normalize double spaces or tabs
  let cleanName = name.replace(/\s+/g, ' ').trim();
  
  // Remove starting "1. " if present
  if (/^1\.\s+/.test(cleanName)) {
    cleanName = cleanName.replace(/^1\.\s+/, '');
  }
  
  // Check if there are other numbers like " 2. " or " 3. "
  // We match " 2. ", " 3. ", etc. up to " 99. "
  const splitRegex = /\s+\d+\.\s+/;
  if (splitRegex.test(cleanName)) {
    const parts = cleanName.split(/\s+\d+\.\s+/);
    return parts.map(p => p.trim()).filter(Boolean);
  }
  
  return [name];
}

console.log('Sample 1 Split:', splitNumberedAttractions(sample1));
console.log('Sample 2 Split:', splitNumberedAttractions(sample2));
console.log('Sample 3 Split:', splitNumberedAttractions(sample3));
console.log('Sample 4 Split:', splitNumberedAttractions(sample4));
