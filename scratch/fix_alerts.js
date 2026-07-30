import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/pages/DestinationPage.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

// Use regex to find and replace getDynamicAlerts structurally
const regex = /const getDynamicAlerts = \([\s\S]*?\)\s*=>\s*\{[\s\S]*?\};(\s*\n\s*)*const getDestinationLanguage/;

const match = content.match(regex);

if (match) {
  const newAlerts = `const getDynamicAlerts = (dest) => {
    const city = dest.name;
    const region = dest.region || 'Scenic Highlands';
    const country = dest.country || 'Global';
    
    return [
      { 
        id: 1, 
        title: \`\${country} Digital Tourist Entry Portal Synced\`, 
        type: 'info', 
        desc: \`The Ministry of Foreign Affairs in \${country} has officially integrated dynamic fast-track travel authorization gates, reducing transit arrivals checkpoint processing times to under 3 minutes.\`, 
        time: '15 mins ago' 
      },
      { 
        id: 2, 
        title: \`\${city} Tourism Board Launches Green Corridors\`, 
        type: 'event', 
        desc: \`Official tourism announcements in \${city} verify the expansion of 15 new pedestrian-only cultural walks and eco-friendly heritage cycles winding through the historic core.\`, 
        time: '2 hours ago' 
      },
      { 
        id: 3, 
        title: \`Optimal Climate & Walkability Advisory\`, 
        type: 'weather', 
        desc: \`Local meteorological stations in \${city} report optimal clear skies and gentle regional breeze. Recommended sunset photography window open between 6:15 PM and 6:45 PM. Carry light hydration.\`, 
        time: '4 hours ago' 
      },
      { 
        id: 4, 
        title: \`Smart EV Electric Bus Ticketing System Active\`, 
        type: 'info', 
        desc: \`Local transport updates: City transit operators have launched complete mobile-tap ticketing across all electric buses linking \${city} historic landmarks and hotel zones.\`, 
        time: '6 hours ago' 
      },
      { 
        id: 5, 
        title: \`Tourist Precinct Safety & Security Sentinel\`, 
        type: 'event', 
        desc: \`Safety advisories: Security details have been reinforced in central crowded plazas and shopping alleys. Travelers are advised to secure personal pockets and utilize officially registered taxi applications.\`, 
        time: '1 day ago' 
      }
    ];
  };

  const getDestinationLanguage`;

  content = content.replace(regex, newAlerts);
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log("Successfully replaced getDynamicAlerts using regex!");
} else {
  console.error("FAIL: Regex did not match getDynamicAlerts in DestinationPage.jsx");
  // Let's print out what is around getDynamicAlerts using indexOf
  const index = content.indexOf('getDynamicAlerts');
  if (index !== -1) {
    console.log("Found 'getDynamicAlerts' at index", index);
    console.log("Snippet:", content.substring(index, index + 300));
  } else {
    console.log("Could not find 'getDynamicAlerts' in file");
  }
}
