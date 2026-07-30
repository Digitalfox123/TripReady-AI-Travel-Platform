import { fetchWithTimeout } from './rapidApiService';

// Navitia API Token (requires registration, defaults to empty for sandbox auto-activation)
const NAVITIA_TOKEN = '';
const BASE_URL = 'https://api.navitia.io/v1';

const CACHE_TTL = 12 * 60 * 60 * 1000; // 12 hours

export async function fetchLiveTransitJourneys(fromLat, fromLng, toLat, toLng, cityName = 'City') {
  // Simple cache key based on coordinates rounded to 2 decimals
  const cacheKey = `tripready_transit_${fromLat.toFixed(2)}_${fromLng.toFixed(2)}_${toLat.toFixed(2)}_${toLng.toFixed(2)}`;
  
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_TTL) {
      return { journeys: data, source: 'cache', timestamp };
    }
  }

  try {
    if (!NAVITIA_TOKEN) {
      throw new Error('Navitia: Token not configured');
    }

    // Navitia coordinates query format: "longitude;latitude"
    const fromVal = `${fromLng};${fromLat}`;
    const toVal = `${toLng};${toLat}`;
    const url = `${BASE_URL}/coverage/global/journeys?from=${fromVal}&to=${toVal}&count=2`;

    // 2.5 seconds timeout to guarantee page speed compliance
    const response = await fetchWithTimeout(url, {
      method: 'GET',
      headers: {
        'Authorization': NAVITIA_TOKEN
      },
      timeout: 2500
    });

    if (!response.ok) {
      throw new Error(`Transit Search failed: ${response.status}`);
    }

    const json = await response.json();
    if (json && json.journeys && json.journeys.length > 0) {
      const parsedJourneys = json.journeys.map((j, idx) => {
        const durationMins = Math.round(j.duration / 60);
        const sectionsList = j.sections
          .filter(sec => sec.type === 'street_network' || sec.type === 'public_transport')
          .map(sec => {
            const mode = sec.type === 'street_network' ? 'Walk' : sec.display_informations?.physical_mode || 'Transit';
            const name = sec.display_informations?.label || sec.display_informations?.name || '';
            const desc = sec.type === 'street_network' 
              ? `Walk ${Math.round(sec.duration / 60)} mins to ${sec.to?.name || 'next stop'}`
              : `Board ${mode} ${name} toward ${sec.display_informations?.direction || 'terminus'}`;
            return {
              type: sec.type === 'street_network' ? 'walk' : 'transit',
              mode: mode,
              line: name,
              desc: desc,
              duration: Math.round(sec.duration / 60)
            };
          });

        return {
          id: `route-${idx}`,
          duration: `${durationMins} mins`,
          transfers: j.nb_transfers || 0,
          type: idx === 0 ? 'Fastest Route' : 'Alternative Connection',
          sections: sectionsList
        };
      });

      if (parsedJourneys.length > 0) {
        localStorage.setItem(cacheKey, JSON.stringify({ data: parsedJourneys, timestamp: Date.now() }));
        return { journeys: parsedJourneys, source: 'api', timestamp: Date.now() };
      }
    }
    throw new Error('No journeys resolved from Navitia');
  } catch (err) {
    console.warn(`Navitia transit query failed, using sandbox fallback:`, err.message);
    const simulated = simulateTransitJourneys(fromLat, fromLng, toLat, toLng, cityName);
    return { journeys: simulated, source: 'simulation', timestamp: null };
  }
}

// Sandbox simulation fallback generator for Transit
export function simulateTransitJourneys(fromLat, fromLng, toLat, toLng, cityName = 'City') {
  const cleanCity = cityName.toLowerCase().trim();

  // Route 1: Subway/Rail connection
  let r1Line = 'Line 4 (Central Line)';
  let r1Mode = 'Metro Train';
  let r2Line = 'Bus 24 (Express)';
  let r2Mode = 'City Shuttle Bus';

  if (cleanCity.includes('london')) {
    r1Line = 'Piccadilly Line (Tube)';
    r1Mode = 'London Underground';
    r2Line = 'Red Bus Route 9';
    r2Mode = 'Double-decker Bus';
  } else if (cleanCity.includes('tokyo')) {
    r1Line = 'Yamanote Line';
    r1Mode = 'JR Rail Network';
    r2Line = 'Chiyoda Metro';
    r2Mode = 'Subway Train';
  } else if (cleanCity.includes('paris')) {
    r1Line = 'Metro Line 1';
    r1Mode = 'RATP Subway';
    r2Line = 'RER A Line';
    r2Mode = 'Regional Rail';
  } else if (cleanCity.includes('riyadh')) {
    r1Line = 'Blue Line (Olaya Metro)';
    r1Mode = 'Riyadh Metro';
    r2Line = 'Bus Route 10';
    r2Mode = 'Riyadh Bus';
  }

  return [
    {
      id: 'sim-route-0',
      duration: '35 mins',
      transfers: 1,
      type: 'Fastest Route',
      sections: [
        { type: 'walk', mode: 'Walk', line: '', desc: 'Walk 5 mins from your location to the nearest boarding terminal.', duration: 5 },
        { type: 'transit', mode: r1Mode, line: r1Line, desc: `Board ${r1Mode} ${r1Line} toward Center Crossing.`, duration: 18 },
        { type: 'transit', mode: r2Mode, line: r2Line, desc: `Transfer and board ${r2Mode} ${r2Line} to destination drop-off.`, duration: 8 },
        { type: 'walk', mode: 'Walk', line: '', desc: 'Walk 4 mins to target location entrance.', duration: 4 }
      ]
    },
    {
      id: 'sim-route-1',
      duration: '48 mins',
      transfers: 0,
      type: 'Direct Route (Less Transfers)',
      sections: [
        { type: 'walk', mode: 'Walk', line: '', desc: 'Walk 8 mins to secondary transit depot.', duration: 8 },
        { type: 'transit', mode: 'Bus', line: 'Route 102 (Regional)', desc: 'Board Direct City Bus Line 102 to destination drop-off.', duration: 35 },
        { type: 'walk', mode: 'Walk', line: '', desc: 'Walk 5 mins to target location entrance.', duration: 5 }
      ]
    }
  ];
}
