const fs = require('fs');
const path = require('path');

const saoPauloAttractions = [
  { name: 'Avenida Paulista' },
  { name: 'Ibirapuera Park' },
  { name: 'Museum of Art of São Paulo (MASP)' },
  { name: 'Mercado Municipal de São Paulo' },
  { name: 'Sé Metropolitan Cathedral' },
  { name: 'Beco do Batman (Batman\'s Alley)' },
  { name: 'Museu do Ipiranga' },
  { name: 'Farol Santander' },
  { name: 'Municipal Theatre of São Paulo' },
  { name: 'Monumento às Bandeiras' }
];

function run() {
  console.log('Starting static topDestinations updater...');

  const indexPath = path.resolve('src/data/index.js');
  let content = fs.readFileSync(indexPath, 'utf8');

  // 1. Parse full_user_request.txt to get the clean list of cities and attractions
  const requestPath = 'C:\\Users\\hafiz\\.gemini\\antigravity\\brain\\cfde45ab-22d0-4261-bac1-e4c10f2a746d\\scratch\\full_user_request.txt';
  const text = fs.readFileSync(requestPath, 'utf8');
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  const parsedCities = [];
  let currentCity = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isCityHeader = !/^\d+\./.test(line) && i + 1 < lines.length && /^\s*1\.\s+/.test(lines[i+1]);
    
    if (isCityHeader) {
      if (currentCity) {
        parsedCities.push(currentCity);
      }
      currentCity = {
        header: line,
        attractions: []
      };
    } else if (currentCity && /^\s*(\d+)\.\s*(.+)$/.test(line)) {
      const match = line.match(/^\s*(\d+)\.\s*(.+)$/);
      currentCity.attractions.push({
        num: parseInt(match[1]),
        text: match[2]
      });
    }
  }
  if (currentCity) {
    parsedCities.push(currentCity);
  }

  const cleanCities = parsedCities.filter(c => !c.header.toLowerCase().includes('every city'));
  console.log(`Loaded ${cleanCities.length} cities to update in index.js`);

  let updatedCount = 0;

  for (const c of cleanCities) {
    const rawCityName = c.header.split(',')[0].trim();
    const cityName = rawCityName.replace(/\([^)]*\)/g, '').trim();
    const citySlug = cityName.toLowerCase().replace(/[^a-z0-9]/g, '');

    // Map city slug to topDestinations ID (some IDs have hyphens)
    let targetId = citySlug;
    if (citySlug === 'hongkong') targetId = 'hong-kong';
    else if (citySlug === 'kualalumpur') targetId = 'kuala-lumpur';
    else if (citySlug === 'abudhabi') targetId = 'abu-dhabi';
    else if (citySlug === 'hochiminhcity') targetId = 'ho-chi-minh-city';
    else if (citySlug === 'newyorkcity') targetId = 'new-york-city';
    else if (citySlug === 'losangeles') targetId = 'los-angeles';
    else if (citySlug === 'lasvegas') targetId = 'las-vegas';
    else if (citySlug === 'sanfrancisco') targetId = 'san-francisco';
    else if (citySlug === 'mexicocity') targetId = 'mexo-city'; // Wait, let's check Mexico City's actual ID: it was mexico-city
    if (citySlug === 'mexicocity') targetId = 'mexico-city';
    else if (citySlug === 'riodejaneiro') targetId = 'rio-de-janeiro';

    let attractionsNames = [];
    if (citySlug === 'saopaulo') {
      attractionsNames = saoPauloAttractions.map(a => a.name);
    } else {
      c.attractions.forEach(attr => {
        const splitMatch = attr.text.match(/^([^-–:]+)[-–:](.+)$/);
        if (splitMatch) {
          attractionsNames.push(splitMatch[1].trim());
        } else {
          attractionsNames.push(attr.text.trim());
        }
      });
    }

    // Now, locate the destination block in index.js content
    // We want to match: id: "targetId" or id: 'targetId' and then find the attractions: [...] field inside its block.
    // Let's use a regex that finds the block for the specific destination ID
    const blockStartRegex = new RegExp(`id:\\s*["']${targetId}["']`, 'i');
    const match = content.match(blockStartRegex);

    if (match) {
      const startIdx = match.index;
      // Find the end of the destination object block (usually ends with a closing brace at the same indentation)
      // Or simply find the next "attractions:" after startIdx
      const attrTag = 'attractions:';
      const attrIdx = content.indexOf(attrTag, startIdx);
      if (attrIdx !== -1 && attrIdx - startIdx < 800) { // Should be within the same block
        // Find the matching closing bracket for the attractions array
        const startBracketIdx = content.indexOf('[', attrIdx);
        let endBracketIdx = -1;
        let bracketCount = 1;
        for (let j = startBracketIdx + 1; j < content.length; j++) {
          if (content[j] === '[') bracketCount++;
          else if (content[j] === ']') {
            bracketCount--;
            if (bracketCount === 0) {
              endBracketIdx = j;
              break;
            }
          }
        }

        if (endBracketIdx !== -1) {
          // Construct the new attractions array string
          const newArrayStr = `[\n      ${attractionsNames.map(name => `"${name.replace(/"/g, '\\"')}"`).join(',\n      ')}\n    ]`;
          
          // Replace it in content
          content = content.slice(0, startBracketIdx) + newArrayStr + content.slice(endBracketIdx + 1);
          console.log(`  -> Successfully updated attractions for static ID: ${targetId}`);
          updatedCount++;
        }
      }
    } else {
      console.log(`  -> Destination ID: ${targetId} (${cityName}) not found in index.js (it is loaded dynamically from Supabase/extraData)`);
    }
  }

  fs.writeFileSync(indexPath, content, 'utf8');
  console.log(`Completed static topDestinations updates. Updated ${updatedCount} cities in index.js.`);
}

run();
