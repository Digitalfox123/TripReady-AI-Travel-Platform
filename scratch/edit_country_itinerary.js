import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/pages/FullTripPlannerPage.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

const startMarker = '  // Formulate daily itineraries dynamically based on inputs!';
const endMarker = '  const displayItinerary = useMemo(() => {';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
  const before = content.substring(0, startIndex);
  const after = content.substring(endIndex);

  const newFunction = `  // Formulate daily itineraries dynamically based on inputs!
  const generatedItinerary = useMemo(() => {
    const attractions = activeDestination.attractions || [];
    const baseFoods = activeDestination.foods || [];
    const daysCount = totalDays;
    
    // Scale plans matching energy level
    let itemsPerDay = 3; 
    if (energyLevel === 'Relaxed') itemsPerDay = 2;
    if (energyLevel === 'Fast-Paced') itemsPerDay = 4;

    const itineraryList = [];
    const cLower = (destCountry || '').toLowerCase();
    
    // Define geographic multi-city hubs & routing
    let hubs = [];
    if (cLower.includes('india')) {
      hubs = [
        { name: 'Delhi', region: 'North', travelTime: 'Base Hub', trans: 'Flight Arrival' },
        { name: 'Agra & Jaipur', region: 'Golden Triangle', travelTime: '4 hrs via Expressway', trans: 'Express Train' },
        { name: 'Mumbai', region: 'West Coast', travelTime: '2 hrs via Flight', trans: 'Domestic Air' },
        { name: 'Goa', region: 'South Coast', travelTime: '1 hr via Flight', trans: 'Domestic Air' },
        { name: 'Kerala', region: 'Deep South', travelTime: '1.5 hrs via Flight', trans: 'Domestic Air' }
      ];
    } else if (cLower.includes('japan')) {
      hubs = [
        { name: 'Tokyo', region: 'Kanto', travelTime: 'Base Hub', trans: 'Flight Arrival' },
        { name: 'Kyoto', region: 'Kansai East', travelTime: '2 hrs via Bullet Train', trans: 'Shinkansen Bullet Train' },
        { name: 'Osaka', region: 'Kansai South', travelTime: '30 mins via Rapid Rail', trans: 'JR Rapid Rail' },
        { name: 'Nara', region: 'Kansai Heritage', travelTime: '45 mins via Local Express', trans: 'Kintetsu Express' }
      ];
    } else if (cLower.includes('pakistan')) {
      hubs = [
        { name: 'Lahore', region: 'Punjab', travelTime: 'Base Hub', trans: 'Flight Arrival' },
        { name: 'Islamabad', region: 'Capital Territory', travelTime: '4 hrs via Motorway M-2', trans: 'Intercity Shuttle' },
        { name: 'Hunza Valley', region: 'Gilgit-Baltistan North', travelTime: '1 hr Flight + 3 hrs Road', trans: 'C-130 Flight / SUV' },
        { name: 'Skardu', region: 'Baltistan East', travelTime: '4 hrs via Karakoram Highway', trans: '4x4 Jeep transfer' }
      ];
    } else if (cLower.includes('switzerland')) {
      hubs = [
        { name: 'Zurich', region: 'North Swiss', travelTime: 'Base Hub', trans: 'Flight Arrival' },
        { name: 'Interlaken', region: 'Bernese Oberland', travelTime: '1.5 hrs via Train', trans: 'SBB Federal Rail' },
        { name: 'Zermatt', region: 'Valais Alps', travelTime: '2 hrs via Train', trans: 'Matterhorn Gotthard Bahn' },
        { name: 'Geneva', region: 'West Swiss', travelTime: '2.5 hrs via Train', trans: 'SBB Federal Rail' }
      ];
    }

    for (let d = 1; d <= daysCount; d++) {
      let currentHubName = activeDestination.name;
      let transitInfo = 'None (Local walking routing)';
      let travelTime = 'Local';
      
      if (hubs.length > 0) {
        // Intelligently distribute days geographically based on total trip duration
        const hubCount = hubs.length;
        const daysPerHub = Math.max(1, Math.floor(daysCount / hubCount));
        const hubIndex = Math.min(hubCount - 1, Math.floor((d - 1) / daysPerHub));
        
        currentHubName = hubs[hubIndex].name;
        transitInfo = hubs[hubIndex].trans;
        travelTime = hubs[hubIndex].travelTime;
      }
      
      const mainAttraction = attractions[(d - 1) % attractions.length] || \`Scenic Landmark inside \${currentHubName}\`;
      const secAttraction = attractions[((d - 1) * 2 + 1) % attractions.length] || \`Traditional Cultural Center\`;
      const eveningSpot = attractions[((d - 1) * 2 + 2) % attractions.length] || \`\${currentHubName} Sunset Skyline Promenade\`;
      
      const isRainExpected = d === 2; // Simulate weather adaptation

      itineraryList.push({
        day: d,
        title: \`Day \${d}: Explore \${currentHubName}\`,
        weatherShift: isRainExpected,
        weatherAdaptMessage: isRainExpected ? 'AI Weather Shift: Outdoor city trails optimized due to localized light rain forecast. Indoor historical galleries moved to this morning.' : null,
        morning: {
          time: energyLevel === 'Relaxed' ? '10:00 AM' : energyLevel === 'Fast-Paced' ? '08:00 AM' : '09:00 AM',
          breakfast: \`\${baseFoods[0] || 'Artisanal Fresh Bakery'} & Roasted Brews\`,
          attraction: isRainExpected ? \`Historical Museum & Indoor Galleries of \${currentHubName}\` : mainAttraction,
          attractionImg: activeDestination.image,
          duration: '3 hours',
          price: budgetTier === 'Budget' ? 'Free Access' : '$25 per person',
          crowd: 'Moderate Density',
          photoTip: 'Shoot from the lower terrace at an upward angle to frame golden hour refractions.',
          expenses: budgetTier === 'Budget' ? 0 : 25,
          transport: transitInfo,
          distance: travelTime === 'Local' ? '2.4 miles' : travelTime,
          travelTime: travelTime
        },
        afternoon: {
          time: '01:30 PM',
          lunch: \`\${baseFoods[1] || 'Fresh Gourmet Bistro'} and Culinary Kitchens\`,
          attraction: secAttraction,
          attractionImg: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&q=80',
          duration: energyLevel === 'Relaxed' ? '1.5 hours' : '2.5 hours',
          price: budgetTier === 'Budget' ? 'Free Access' : '$35 per person',
          crowd: 'High Peak Density',
          photoTip: 'Capture the colorful entry facade through architectural shadow grids.',
          expenses: budgetTier === 'Budget' ? 5 : 35,
          walkingRoute: \`Scenic historic pedestrian walkways inside \${currentHubName}\`
        },
        evening: {
          time: '06:00 PM',
          sunsetSpot: eveningSpot,
          dinner: \`\${baseFoods[2] || 'Classic Heritage Tasting Dinner'} Restaurant\`,
          nightlife: energyLevel === 'Relaxed' ? 'Quiet Botanical Garden Lounge' : 'Rooftop Lounge and Light Jazz Recitals',
          expenses: budgetTier === 'Budget' ? 12 : budgetTier === 'Luxury' ? 85 : 150
        },
        night: {
          time: '10:00 PM',
          hotelReturn: \`Private local transport transfer direct to hotel lobby inside \${currentHubName}.\`,
          safetyNote: 'Area is extremely friendly. Secure pockets in bustling crowd sectors.',
          nextDayPrep: 'Lay out water-resistant shell jacket for early outdoor coastal boat trails tomorrow.'
        }
      });
    }
    
    return itineraryList;
  }, [activeDestination, totalDays, energyLevel, budgetTier, destCountry]);

  `;

  fs.writeFileSync(filePath, before + newFunction + after, 'utf-8');
  console.log("Successfully replaced generatedItinerary structurally!");
} else {
  console.error("FAIL: Could not locate markers", { startIndex, endIndex });
}
