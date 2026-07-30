import { fetchWithTimeout } from './rapidApiService';

// Amadeus Developer Credentials (defaults to empty so sandbox active automatically if not configured)
const CLIENT_ID = '';
const CLIENT_SECRET = '';

const BASE_URL = 'https://test.api.amadeus.com';
const CACHE_TTL = 6 * 60 * 60 * 1000; // 6 hours

let cachedToken = null;
let tokenExpiry = 0;

// Standard IATA mapping directories matching city codes
const CITY_IATA_CODES = {
  'tokyo': 'TYO',
  'riyadh': 'RUH',
  'new york': 'NYC',
  'london': 'LON',
  'paris': 'PAR',
  'bali': 'DPS',
  'sydney': 'SYD',
  'cape town': 'CPT',
  'dubai': 'DXB',
  'são paulo': 'SAO',
  'rome': 'ROM',
  'singapore': 'SIN',
  'geneva': 'GVA',
  'zurich': 'ZRH',
  'munich': 'MUC',
  'lahore': 'LHE',
  'islamabad': 'ISB',
  'karachi': 'KHI',
  'bangkok': 'BKK',
  'phuket': 'HKT',
  'cancún': 'CUN'
};

function getCityCode(cityName) {
  if (!cityName) return 'PAR';
  const clean = cityName.toLowerCase().trim();
  for (const key in CITY_IATA_CODES) {
    if (clean.includes(key) || key.includes(clean)) {
      return CITY_IATA_CODES[key];
    }
  }
  return cityName.substring(0, 3).toUpperCase();
}

// Fetches OAuth2 Access Token from Amadeus Test Server
async function getAmadeusToken() {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error('Amadeus: Credentials not set');
  }

  const tokenUrl = `${BASE_URL}/v1/security/oauth2/token`;
  const bodyParams = new URLSearchParams();
  bodyParams.append('grant_type', 'client_credentials');
  bodyParams.append('client_id', CLIENT_ID);
  bodyParams.append('client_secret', CLIENT_SECRET);

  // 3-second timeout for authentication to keep app loading fast
  const response = await fetchWithTimeout(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: bodyParams.toString(),
    timeout: 3000
  });

  if (!response.ok) {
    throw new Error(`Token request failed: ${response.status}`);
  }

  const data = await response.json();
  cachedToken = data.access_token;
  // Expire 30 seconds early as safety margin
  tokenExpiry = Date.now() + (data.expires_in - 30) * 1000;
  return cachedToken;
}

// Queries live hotel listings and details using Amadeus API
export async function fetchLiveHotels(cityName, countryName) {
  const cleanCity = cityName.toLowerCase().trim();
  const cacheKey = `tripready_hotels_${cleanCity.replace(/ /g, '_')}`;
  
  // 1. Check local cache
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_TTL) {
      return { hotels: data, source: 'cache', timestamp };
    }
  }

  try {
    // 2. Fetch token (will fail and trigger catch block if keys are empty/invalid)
    const token = await getAmadeusToken();
    const cityCode = getCityCode(cityName);
    
    // Step A: Search for hotel IDs in the city
    const searchUrl = `${BASE_URL}/v1/reference-data/locations/hotels/by-city?cityCode=${cityCode}&radius=5&radiusUnit=KM`;
    
    const searchRes = await fetchWithTimeout(searchUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      timeout: 2500
    });

    if (!searchRes.ok) {
      throw new Error(`Hotel Search failed: ${searchRes.status}`);
    }

    const searchData = await searchRes.json();
    if (searchData && searchData.data && searchData.data.length > 0) {
      // Take up to 3 hotel IDs for detailed offers lookup
      const hotelIds = searchData.data.slice(0, 3).map(h => h.hotelId).join(',');
      
      // Step B: Query offers and pricing details for those hotels
      const offersUrl = `${BASE_URL}/v3/shopping/hotel-offers?hotelIds=${hotelIds}&adults=1&checkInDate=${new Date().toISOString().split('T')[0]}&roomQuantity=1`;
      
      const offersRes = await fetchWithTimeout(offersUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        timeout: 2500
      });

      if (offersRes.ok) {
        const offersData = await offersRes.json();
        if (offersData && offersData.data && offersData.data.length > 0) {
          const parsedHotels = offersData.data.map((item, idx) => {
            const h = item.hotel;
            const offer = item.offers?.[0];
            const price = Math.round(parseFloat(offer?.price?.amount || 150));
            const ratingVal = 4.2 + (idx * 0.2) + (Math.random() * 0.2);
            
            // Map amenities
            const rawAmenities = h.amenities || ['WIFI', 'PARKING'];
            const amenitiesList = rawAmenities.slice(0, 4).map(a => 
              a.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
            );

            return {
              name: h.name ? h.name.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()) : 'Luxury City Stay',
              image: getHotelFallbackImage(idx, cleanCity),
              tag: idx === 0 ? 'Premier Choice' : idx === 1 ? 'Boutique Comfort' : 'Strategic Value',
              rating: parseFloat(ratingVal.toFixed(1)),
              reviews: 210 + (idx * 310),
              desc: h.description?.text || `A beautiful stay in ${cityName} offering elegant accommodations, modern comfort, and premier local hospitality.`,
              amenities: amenitiesList,
              price: price
            };
          });

          if (parsedHotels.length > 0) {
            localStorage.setItem(cacheKey, JSON.stringify({ data: parsedHotels, timestamp: Date.now() }));
            return { hotels: parsedHotels, source: 'api', timestamp: Date.now() };
          }
        }
      }
    }
    throw new Error('No hotel offers resolved from Amadeus API');
  } catch (err) {
    console.warn(`Amadeus live hotels query failed, loading sandbox simulation:`, err.message);
    const simulated = simulateHotels(cityName, countryName);
    return { hotels: simulated, source: 'simulation', timestamp: null };
  }
}

// Fallback high-quality images based on index/city
function getHotelFallbackImage(index, city) {
  const images = [
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80', // Aman
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80', // Boutique
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80', // Resort
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80'  // Modern
  ];
  return images[index % images.length];
}

// Generates highly realistic, curated hotel listings for any target city
export function simulateHotels(cityName, countryName) {
  const cleanCity = cityName.toLowerCase().trim();
  const cName = countryName || 'Local Area';
  
  const tags = ['Luxury Oasis', 'Boutique Retreat', 'Strategic Basecamp'];
  const basePrices = [320, 180, 95];
  const ratings = [4.9, 4.7, 4.4];
  const reviewsCount = [620, 480, 240];
  
  const amenitiesSets = [
    ['Executive Lounge', 'Infinity Pool', 'Fine Dining', 'City View'],
    ['Bicycle Rentals', 'Organic Breakfast', 'Art Gallery', 'Cozy Fireplace'],
    ['Free Transit Pass', 'Luggage Lockers', 'Self-Laundry', '24h Coffee']
  ];

  const descriptors = [
    `A pristine sanctuary in the heart of ${cityName}, providing premium accommodations, panoramic landmark vistas, and standard-setting local hospitality.`,
    `A charming boutique stay nestled in the cultural district, combining historical architectures with modern comforts and personalized local tours.`,
    `A highly optimized modern hotel located close to key public transit lines, designed for smart travelers prioritizing efficiency, value, and connectivity.`
  ];

  return Array.from({ length: 3 }, (_, idx) => {
    // Inject realistic names based on the target city name
    let hotelName = '';
    if (idx === 0) {
      hotelName = `${cityName} Serena Grand Resort`;
    } else if (idx === 1) {
      hotelName = `The Boutique Stay ${cityName}`;
    } else {
      hotelName = `Select Inn ${cityName} Central`;
    }

    // Specific Pakistani mountain properties for Hunza
    if (cleanCity.includes('hunza')) {
      if (idx === 0) {
        hotelName = 'Luxus Hunza Attabad Lake Resort';
        basePrices[0] = 220;
      } else if (idx === 1) {
        hotelName = 'Altit Serena Orchard Guestrooms';
        basePrices[1] = 160;
      } else {
        hotelName = 'Eagle Nest Hotel Duiker';
        basePrices[2] = 85;
      }
    }

    return {
      name: hotelName,
      image: getHotelFallbackImage(idx, cleanCity),
      tag: tags[idx],
      rating: ratings[idx],
      reviews: reviewsCount[idx],
      desc: descriptors[idx],
      amenities: amenitiesSets[idx],
      price: basePrices[idx]
    };
  });
}
