import fs from 'fs';

const DATA_FILE = 'src/data/index.js';

async function run() {
  console.log("Reading src/data/index.js...");
  const content = fs.readFileSync(DATA_FILE, 'utf8');

  // Extract topDestinations array range
  const startTag = 'export const topDestinations = [';
  const startIndex = content.indexOf(startTag);
  if (startIndex === -1) {
    console.error("Could not find start of topDestinations!");
    process.exit(1);
  }

  let braceCount = 0;
  let endIndex = -1;
  for (let i = startIndex + 'export const topDestinations = '.length; i < content.length; i++) {
    if (content[i] === '[') braceCount++;
    if (content[i] === ']') {
      braceCount--;
      if (braceCount === 0) {
        endIndex = i + 1;
        break;
      }
    }
  }

  if (endIndex === -1) {
    console.error("Could not find end of topDestinations!");
    process.exit(1);
  }

  const arrayStr = content.slice(startIndex + 'export const topDestinations = '.length, endIndex);
  fs.writeFileSync('scratch/temp_destinations.js', 'export const topDestinations = ' + arrayStr);
  
  const m = await import('./temp_destinations.js');
  const destinations = m.topDestinations;
  console.log(`Loaded ${destinations.length} current destinations.`);

  // 24 Skyscrapers IDs list
  const skyscraperIds = [
    'kingdom-centre', 'makkah-clock-royal-tower', 'pif-tower', 'burj-khalifa', 'burj-al-arab',
    'shanghai-tower', 'international-commerce-centre', 'canton-tower', 'taipei-101',
    'petronas-twin-towers', 'marina-bay-sands', 'lotte-world-tower', 'one-world-trade-center',
    'empire-state-building', 'willis-tower', 'the-edge-at-30-hudson-yards', 'torre-reforma',
    'gran-torre-santiago', 'the-shard', 'lakhta-center', 'commerzbank-tower', 'torre-gl-ries',
    'q1-tower', 'eureka-tower', 'torre-gl-ries'
  ];

  // Enforce strict category classification
  destinations.forEach(dest => {
    const id = dest.id.toLowerCase();
    const name = dest.name.toLowerCase();

    // 1. If it's a skyscraper
    if (skyscraperIds.includes(id) || name.includes('tower') || name.includes('shard') || name.includes('building') || id === 'marina-bay-sands' || id === 'kingdom-centre') {
      dest.categoryIds = ['skyscrapers'];
      // Only keep 'cultural' if it has cultural vibes
      if (dest.description && dest.description.toLowerCase().includes('culture')) {
        dest.categoryIds.push('cultural');
      }
    }
    
    // 2. If it's a historical ruin/monument (excluding major cities)
    else if (dest.categoryIds && dest.categoryIds.includes('historical') && !dest.categoryIds.includes('cities')) {
      // Historical ruins (Machu Picchu, Stonehenge, Mohenjo-daro, etc.) should NOT be tagged as 'cities'
      dest.categoryIds = dest.categoryIds.filter(c => c !== 'cities');
    }
    
    // 3. If it's a mountain or peak (e.g. Kilimanjaro, Mount Fuji, Dolomites, Andes)
    else if (id.includes('mountain') || id.includes('mount-') || id.includes('alps') || id.includes('dolomites') || id === 'kilimanjaro' || id === 'k2-mountain') {
      dest.categoryIds = ['mountains', 'nature'];
      if (dest.categoryIds.includes('cities')) {
        dest.categoryIds = dest.categoryIds.filter(c => c !== 'cities');
      }
    }

    // 4. If it's a desert (e.g. Sahara, Atacama, Rub' al Khali)
    else if (id.includes('desert') || id.includes('sahara') || id.includes('gobi') || id.includes('namib') || id.includes('atacama')) {
      dest.categoryIds = ['deserts', 'nature'];
      if (dest.categoryIds.includes('cities')) {
        dest.categoryIds = dest.categoryIds.filter(c => c !== 'cities');
      }
    }

    // 5. If it's a pure natural beach/island (e.g. Tulum, Santorini, Maldives, Bora Bora)
    else if (id.includes('beach') || id.includes('island') || id.includes('maldives') || id.includes('bora-bora') || id.includes('galapagos') || id === 'santorini') {
      dest.categoryIds = ['beaches', 'islands', 'nature'];
      if (dest.categoryIds.includes('cities')) {
        dest.categoryIds = dest.categoryIds.filter(c => c !== 'cities');
      }
    }
  });

  // Let's print out category counts to verify
  const catCounts = {};
  destinations.forEach(dest => {
    dest.categoryIds.forEach(c => {
      catCounts[c] = (catCounts[c] || 0) + 1;
    });
  });
  console.log("Strict Category Segmentation complete! Counts:", catCounts);

  // Write back to index.js
  const newArrayStr = JSON.stringify(destinations, null, 2);
  const finalCode = content.slice(0, startIndex) + 'export const topDestinations = ' + newArrayStr + content.slice(endIndex);

  console.log("Writing back to index.js...");
  fs.writeFileSync(DATA_FILE, finalCode, 'utf8');
  console.log("Successfully cleaned up database categories!");

  // Clean up
  fs.unlinkSync('scratch/temp_destinations.js');
}

run().catch(err => {
  console.error("Execution error:", err);
});
