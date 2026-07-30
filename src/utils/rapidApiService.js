const RAPIDAPI_KEY = '3219b5e825msh9b49549f58e785cp148ab7jsneb005c011bc5';
const isRapidKeyDummy = !RAPIDAPI_KEY || RAPIDAPI_KEY.startsWith('3219b5e');
const CACHE_TTL = 6 * 60 * 60 * 1000; // 6 hours

export async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 2500 } = options;
  
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

// City to Airport Codes Directory
const AIRPORT_CODES = {
  'new york': 'JFK',
  'los angeles': 'LAX',
  'london': 'LHR',
  'tokyo': 'HND',
  'paris': 'CDG',
  'rome': 'FCO',
  'dubai': 'DXB',
  'riyadh': 'RUH',
  'islamabad': 'ISB',
  'lahore': 'LHE',
  'karachi': 'KHI',
  'munich': 'MUC',
  'sydney': 'SYD',
  'geneva': 'GVA',
  'zurich': 'ZRH',
  'bali': 'DPS',
  'skardu': 'KDU',
  'toronto': 'YYZ',
  'delhi': 'DEL',
  'mumbai': 'BOM',
  'goa': 'GOI',
  'melbourne': 'MEL',
  'singapore': 'SIN',
  'bangkok': 'BKK',
  'istanbul': 'IST',
  'cairo': 'CAI'
};

function getAirportCode(cityName, defaultCode = 'JFK') {
  if (!cityName) return defaultCode;
  const clean = cityName.toLowerCase().trim().replace(/[^a-z ]/g, '');
  return AIRPORT_CODES[clean] || defaultCode;
}

export async function fetchLiveFlights(originCity, destCity, travelClass = 'ECONOMY', adults = 1) {
  const depCode = getAirportCode(originCity, 'LAX');
  const arrCode = getAirportCode(destCity, 'JFK');
  
  const cacheKey = `tripready_flights_${depCode}_${arrCode}_${travelClass}_${adults}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_TTL) {
      return { flights: data, source: 'cache', timestamp };
    }
  }

  if (isRapidKeyDummy) {
    throw new Error('RapidAPI: Using simulation fallback (dummy key detected)');
  }

  const url = `https://google-flights2.p.rapidapi.com/api/v1/searchFlights?departure_id=${depCode}&arrival_id=${arrCode}&travel_class=${travelClass}&adults=${adults}&currency=USD`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-host': 'google-flights2.p.rapidapi.com',
        'x-rapidapi-key': RAPIDAPI_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const json = await response.json();
    
    // Check if the RapidAPI plan is not subscribed
    if (json.message && json.message.includes('not subscribed')) {
      throw new Error('RapidAPI: Unsubscribed');
    }

    // Google Flights API structure (Parsing from response)
    if (json && json.data && json.data.itineraries) {
      const parsedFlights = json.data.itineraries.slice(0, 5).map((item, idx) => {
        const firstLeg = item.legs?.[0];
        const carrier = firstLeg?.carriers?.[0];
        return {
          id: item.id || `f-${idx}`,
          airline: carrier?.name || 'Live Flight Partner',
          code: `${carrier?.code || 'XX'}-${firstLeg?.segments?.[0]?.flightNumber || idx + 100}`,
          dep: firstLeg?.departure || '10:00 AM',
          arr: firstLeg?.arrival || '4:00 PM',
          dur: firstLeg?.durationDisplay || '6h 0m',
          stops: firstLeg?.stopCount === 0 ? 'Direct' : `${firstLeg?.stopCount} Stop`,
          price: Math.round(item.price?.raw || 450)
        };
      });

      if (parsedFlights.length > 0) {
        localStorage.setItem(cacheKey, JSON.stringify({ data: parsedFlights, timestamp: Date.now() }));
        return { flights: parsedFlights, source: 'api', timestamp: Date.now() };
      }
    }
    throw new Error('Invalid Flight Data');
  } catch (error) {
    console.warn(`RapidAPI Google Flights failed, using fallback simulation:`, error.message);
    throw error; // Propagate error so frontend handles fallback state and warning
  }
}

export async function fetchLiveCarRentals(lat, lng, currency = 'USD') {
  const cacheKey = `tripready_cars_${lat.toFixed(2)}_${lng.toFixed(2)}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_TTL) {
      return { cars: data, source: 'cache', timestamp };
    }
  }

  if (isRapidKeyDummy) {
    throw new Error('RapidAPI: Using simulation fallback (dummy key detected)');
  }

  const url = `https://booking-com15.p.rapidapi.com/api/v1/cars/searchCarRentals?pick_up_latitude=${lat}&pick_up_longitude=${lng}&drop_off_latitude=${lat}&drop_off_longitude=${lng}&pick_up_time=10%3A00&drop_off_time=10%3A00&driver_age=30&currency_code=${currency}&location=US`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-host': 'booking-com15.p.rapidapi.com',
        'x-rapidapi-key': RAPIDAPI_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const json = await response.json();
    
    if (json.message && json.message.includes('not subscribed')) {
      throw new Error('RapidAPI: Unsubscribed');
    }

    // Booking.com API structure parsing
    if (json && json.data && json.data.searchResults) {
      const parsedCars = json.data.searchResults.slice(0, 4).map((car, idx) => {
        return {
          id: car.id || `car-${idx}`,
          name: car.vehicleInfo?.name || 'Premium Sedan',
          type: car.vehicleInfo?.class || 'Economy Class',
          provider: car.supplierInfo?.name || 'Local Rental Partner',
          price: Math.round(car.priceInfo?.totalRaw || 45),
          img: car.vehicleInfo?.imageUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&q=80',
          seats: car.vehicleInfo?.seats || 5,
          transmission: car.vehicleInfo?.transmission || 'Automatic',
          ac: car.vehicleInfo?.airConditioned !== false
        };
      });

      if (parsedCars.length > 0) {
        localStorage.setItem(cacheKey, JSON.stringify({ data: parsedCars, timestamp: Date.now() }));
        return { cars: parsedCars, source: 'api', timestamp: Date.now() };
      }
    }
    throw new Error('Invalid Car Rental Data');
  } catch (error) {
    console.warn(`RapidAPI Booking.com Cars failed, using fallback simulation:`, error.message);
    throw error;
  }
}

// ISO Alpha-2 Country Codes Directory
export const ISO_COUNTRY_CODES = {
  'afghanistan': 'AF',
  'albania': 'AL',
  'algeria': 'DZ',
  'andorra': 'AD',
  'angola': 'AO',
  'antigua_and_barbuda': 'AG',
  'argentina': 'AR',
  'armenia': 'AM',
  'australia': 'AU',
  'austria': 'AT',
  'azerbaijan': 'AZ',
  'bahamas': 'BS',
  'bahrain': 'BH',
  'bangladesh': 'BD',
  'barbados': 'BB',
  'belarus': 'BY',
  'belgium': 'BE',
  'belize': 'BZ',
  'benin': 'BJ',
  'bhutan': 'BT',
  'bolivia': 'BO',
  'bosnia_and_herzegovina': 'BA',
  'botswana': 'BW',
  'brazil': 'BR',
  'brunei': 'BN',
  'bulgaria': 'BG',
  'burkina_faso': 'BF',
  'burundi': 'BI',
  'cabo_verde': 'CV',
  'cambodia': 'KH',
  'cameroon': 'CM',
  'canada': 'CA',
  'central_african_republic': 'CF',
  'chad': 'TD',
  'chile': 'CL',
  'china': 'CN',
  'colombia': 'CO',
  'comoros': 'KM',
  'congo': 'CG',
  'costa_rica': 'CR',
  'croatia': 'HR',
  'cuba': 'CU',
  'cyprus': 'CY',
  'czechia': 'CZ',
  'denmark': 'DK',
  'djibouti': 'DJ',
  'dominica': 'DM',
  'dominican_republic': 'DO',
  'ecuador': 'EC',
  'egypt': 'EG',
  'el_salvador': 'SV',
  'equatorial_guinea': 'GQ',
  'eritrea': 'ER',
  'estonia': 'EE',
  'eswatini': 'SZ',
  'ethiopia': 'ET',
  'fiji': 'FJ',
  'finland': 'FI',
  'france': 'FR',
  'gabon': 'GA',
  'gambia': 'GM',
  'georgia': 'GE',
  'germany': 'DE',
  'ghana': 'GH',
  'greece': 'GR',
  'grenada': 'GD',
  'guatemala': 'GT',
  'guinea': 'GN',
  'guyana': 'GY',
  'haiti': 'HT',
  'honduras': 'HN',
  'hungary': 'HU',
  'iceland': 'IS',
  'india': 'IN',
  'indonesia': 'ID',
  'iran': 'IR',
  'iraq': 'IQ',
  'ireland': 'IE',
  'israel': 'IL',
  'italy': 'IT',
  'jamaica': 'JM',
  'japan': 'JP',
  'jordan': 'JO',
  'kazakhstan': 'KZ',
  'kenya': 'KE',
  'kiribati': 'KI',
  'kuwait': 'KW',
  'kyrgyzstan': 'KG',
  'laos': 'LA',
  'latvia': 'LV',
  'lebanon': 'LB',
  'lesotho': 'LS',
  'liberia': 'LR',
  'libya': 'LY',
  'liechtenstein': 'LI',
  'lithuania': 'LT',
  'luxembourg': 'LU',
  'madagascar': 'MG',
  'malawi': 'MW',
  'malaysia': 'MY',
  'maldives': 'MV',
  'mali': 'ML',
  'malta': 'MT',
  'marshall_islands': 'MH',
  'mauritania': 'MR',
  'mauritius': 'MU',
  'mexico': 'MX',
  'micronesia': 'FM',
  'moldova': 'MD',
  'monaco': 'MC',
  'mongolia': 'MN',
  'montenegro': 'ME',
  'morocco': 'MA',
  'mozambique': 'MZ',
  'myanmar': 'MM',
  'namibia': 'NA',
  'nauru': 'NR',
  'nepal': 'NP',
  'netherlands': 'NL',
  'new_zealand': 'NZ',
  'nicaragua': 'NI',
  'niger': 'NE',
  'nigeria': 'NG',
  'north_korea': 'KP',
  'north_macedonia': 'MK',
  'norway': 'NO',
  'oman': 'OM',
  'pakistan': 'PK',
  'palau': 'PW',
  'panama': 'PA',
  'papua_new_guinea': 'PG',
  'paraguay': 'PY',
  'peru': 'PE',
  'philippines': 'PH',
  'poland': 'PL',
  'portugal': 'PT',
  'qatar': 'QA',
  'romania': 'RO',
  'russia': 'RU',
  'rwanda': 'RW',
  'saint_kitts_and_nevis': 'KN',
  'saint_lucia': 'LC',
  'samoa': 'WS',
  'san_marino': 'SM',
  'saudi_arabia': 'SA',
  'senegal': 'SN',
  'serbia': 'RS',
  'seychelles': 'SC',
  'sierra_leone': 'SL',
  'singapore': 'SG',
  'slovakia': 'SK',
  'slovenia': 'SI',
  'solomon_islands': 'SB',
  'somalia': 'SO',
  'south_africa': 'ZA',
  'south_korea': 'KR',
  'south_sudan': 'SS',
  'spain': 'ES',
  'sri_lanka': 'LK',
  'sudan': 'SD',
  'suriname': 'SR',
  'sweden': 'SE',
  'switzerland': 'CH',
  'syria': 'SY',
  'taiwan': 'TW',
  'tajikistan': 'TJ',
  'tanzania': 'TZ',
  'thailand': 'TH',
  'timor_leste': 'TL',
  'togo': 'TG',
  'tonga': 'TO',
  'trinidad_and_tobago': 'TT',
  'tunisia': 'TN',
  'turkey': 'TR',
  'turkmenistan': 'TM',
  'tuvalu': 'TV',
  'uganda': 'UG',
  'ukraine': 'UA',
  'united_arab_emirates': 'AE',
  'uae': 'AE',
  'united_kingdom': 'GB',
  'uk': 'GB',
  'united_states': 'US',
  'usa': 'US',
  'uruguay': 'UY',
  'uzbekistan': 'UZ',
  'vanuatu': 'VU',
  'vatican_city': 'VA',
  'venezuela': 'VE',
  'vietnam': 'VN',
  'yemen': 'YE',
  'zambia': 'ZM',
  'zimbabwe': 'ZW'
};

export function getCountryISO2(countryName) {
  if (!countryName) return 'US';
  const clean = countryName.toLowerCase().trim()
    .replace(/ /g, '_')
    .replace(/[^a-z_]/g, '');
  return ISO_COUNTRY_CODES[clean] || 'US';
}

export async function fetchLiveVisaRequirement(originCountry, destCountry, date = '2026-06-06') {
  const originCode = getCountryISO2(originCountry);
  const destCode = getCountryISO2(destCountry);
  
  // Cache key
  const cacheKey = `tripready_visa_${originCode}_${destCode}_${date}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    // 12 hours TTL (12 * 60 * 60 * 1000)
    if (Date.now() - timestamp < 12 * 60 * 60 * 1000) {
      return { visa: data, source: 'cache', timestamp };
    }
  }

  if (isRapidKeyDummy) {
    throw new Error('RapidAPI: Using simulation fallback (dummy key detected)');
  }

  const url = `https://visa-requirement.p.rapidapi.com/v2/visa/check/history/${originCode}/${destCode}/${date}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-host': 'visa-requirement.p.rapidapi.com',
        'x-rapidapi-key': RAPIDAPI_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const json = await response.json();
    
    if (json.message && json.message.includes('not subscribed')) {
      throw new Error('RapidAPI: Unsubscribed');
    }

    if (json && json.data && json.data.current_rule) {
      const currentRule = json.data.current_rule;
      
      // Map basic color classes
      let mappedColor = 'yellow';
      if (currentRule.color === 'green') mappedColor = 'green';
      if (currentRule.color === 'red') mappedColor = 'red';

      const parsedVisa = {
        originCode,
        destCode,
        requirement: currentRule.display_label || currentRule.name || 'Visa Required',
        duration: currentRule.duration || 'N/A',
        color: mappedColor,
        criticalInfo: json.data.has_changes_since_from_date 
          ? `Visa policies changed recently. Active status: ${currentRule.display_label}.`
          : `Passport holders from ${json.data.passport?.name || originCountry} entering ${json.data.destination?.name || destCountry}: ${currentRule.display_label}.`
      };

      localStorage.setItem(cacheKey, JSON.stringify({ data: parsedVisa, timestamp: Date.now() }));
      return { visa: parsedVisa, source: 'api', timestamp: Date.now() };
    }

    throw new Error('Invalid Visa Data format');
  } catch (error) {
    console.warn(`RapidAPI Visa Requirements failed, using fallback simulation:`, error.message);
    throw error;
  }
}

export function simulateVisaRequirement(originCountry, destCountry) {
  const origin = originCountry.toLowerCase();
  const dest = destCountry.toLowerCase();
  const originCode = getCountryISO2(originCountry);
  const destCode = getCountryISO2(destCountry);

  let requirement = 'eVisa Required';
  let duration = '30 Days';
  let color = 'yellow';
  let criticalInfo = 'Ensure your passport is valid for at least 6 months beyond your planned stay.';
  let checklist = ['Valid Passport (6+ months validity)', 'Return Flight Confirmation', 'Hotel Accommodation voucher', 'Proof of sufficient travel funds'];

  if (originCode === destCode) {
    requirement = 'Citizen Entry';
    duration = 'Unlimited';
    color = 'green';
    criticalInfo = 'No visa restrictions apply for domestic travelers or national passport holders.';
    checklist = ['National Identification Card or Domestic Passport'];
  } else if ((origin.includes('pakistan') && dest.includes('india')) || (origin.includes('india') && dest.includes('pakistan'))) {
    requirement = 'Bilateral Consular Visa';
    duration = '30 Days Single Entry';
    color = 'red';
    criticalInfo = 'E-Visa NOT available. Citizens must submit physical sponsor papers, bank statements, and biometric records at the consulate.';
    checklist = ['Official Consulate Application Form', 'Notarized Sponsorship / Host Invitation', '6-Month Certified Bank Statement', 'Biometric Enrollment'];
  } else if (dest.includes('saudi') || dest.includes('arabia')) {
    requirement = 'Tourist eVisa';
    duration = '90 Days Max';
    color = 'yellow';
    criticalInfo = 'Ensure passport has minimum 6 months validity. e-Visa is processed online and typically approved in 24-72 hours.';
    checklist = ['Valid Passport (6+ months)', 'Digital Passport-size Photo', 'Active Travel Insurance (Saudi-approved)', 'eVisa Fee Payment'];
  } else if (dest.includes('japan')) {
    if (origin.includes('states') || origin.includes('kingdom') || origin.includes('canada') || origin.includes('europe') || origin.includes('swiss') || origin.includes('germany') || origin.includes('france') || origin.includes('italy')) {
      requirement = 'Visa Exempt Transit';
      duration = '90 Days allowed';
      color = 'green';
      criticalInfo = 'Visa exempt for short-term tourism. Must present onward/return flight ticket upon arrival.';
      checklist = ['Valid Passport', 'Onward/Return Flight Ticket', 'Completed Visit Japan Web registration'];
    } else {
      requirement = 'Consular Tourist Visa';
      duration = '15/30 Days allowed';
      color = 'yellow';
      criticalInfo = 'Must submit official tourist visa forms at the local Japanese embassy or authorized visa center.';
      checklist = ['Consular Visa Application Form', 'Recent Passport Photograph', 'Detailed Daily Travel Itinerary', 'Certificate of Employment & Bank Books'];
    }
  } else if (origin.includes('states') || origin.includes('kingdom') || origin.includes('canada') || origin.includes('europe') || origin.includes('swiss') || origin.includes('germany') || origin.includes('france') || origin.includes('italy')) {
    // Western passport to most typical destinations
    if (dest.includes('switzerland') || dest.includes('france') || dest.includes('italy') || dest.includes('spain') || dest.includes('germany') || dest.includes('united_kingdom') || dest.includes('united_states') || dest.includes('canada') || dest.includes('australia')) {
      requirement = 'Visa Free waiver';
      duration = '90 Days';
      color = 'green';
      criticalInfo = 'Visa exempt for tourist stays under bilateral Schengen or visa-waiver program rules.';
      checklist = ['Valid Passport', 'Onward/Return Ticket', 'Sufficient funds proof'];
    } else {
      requirement = 'eVisa / Visa on Arrival';
      duration = '30 Days';
      color = 'green';
      criticalInfo = 'Simple electronic visa registration or stamp on arrival. Standard processing time is 1-3 business days.';
      checklist = ['Passport with blank pages', 'Online eVisa Registration printout', 'Visa Fee Payment (where applicable)', 'Passport Photos'];
    }
  } else {
    // General fallback
    requirement = 'Visa / eVisa Required';
    duration = '30 Days';
    color = 'yellow';
    criticalInfo = 'Regular tourist visa or electronic travel authorization (ETA) required. Check with embassy prior to travel.';
    checklist = ['Passport (6+ months validity)', 'Visa Application Form', 'Bank Statement (last 3 months)', 'Confirmed flight itinerary & hotel booking'];
  }

  return {
    originCode,
    destCode,
    requirement,
    duration,
    color,
    criticalInfo,
    checklist
  };
}

function getRelativeTime(isoString) {
  try {
    const diffMs = Date.now() - new Date(isoString).getTime();
    if (isNaN(diffMs)) return 'Recently';
    const diffMins = Math.floor(diffMs / (60 * 1000));
    if (diffMins <= 0) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } catch (e) {
    return 'Recently';
  }
}

export async function fetchLiveNews(query) {
  const cleanQuery = query.toLowerCase().trim().replace(/[^a-z0-9 ]/g, '');
  const cacheKey = `tripready_news_${cleanQuery.replace(/ /g, '_')}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    // 6 hours cache TTL
    if (Date.now() - timestamp < CACHE_TTL) {
      return { articles: data, source: 'cache', timestamp };
    }
  }

  // Google News RSS feed search through rss2json proxy (completely free, CORS-friendly, and keyless)
  const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
  const url = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

  try {
    // 2.5 seconds timeout to guarantee ultra-fast loading speeds
    const response = await fetchWithTimeout(url, { timeout: 2500 });
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    const json = await response.json();
    if (json.status === 'ok' && json.items && json.items.length > 0) {
      const types = ['advisory', 'update', 'transit', 'weather', 'culture'];
      const parsedArticles = json.items.slice(0, 6).map((item, idx) => {
        // Clean title: Google News titles usually end with " - SourceName"
        let cleanTitle = item.title;
        let sourceName = 'Google News';
        const parts = item.title.split(' - ');
        if (parts.length > 1) {
          sourceName = parts[parts.length - 1];
          cleanTitle = parts.slice(0, -1).join(' - ');
        }
        
        // Clean description: strip any HTML tags
        let desc = item.description || 'No description details available.';
        desc = desc.replace(/<[^>]*>/g, '').trim();
        if (desc.includes('')) {
          desc = desc.split('')[0].trim();
        }
        if (!desc || desc.length < 10) {
          desc = cleanTitle;
        }

        return {
          id: `news-${idx}`,
          title: cleanTitle,
          type: types[idx % types.length],
          desc: desc,
          time: getRelativeTime(item.pubDate),
          source: sourceName,
          link: item.link
        };
      });

      if (parsedArticles.length > 0) {
        localStorage.setItem(cacheKey, JSON.stringify({ data: parsedArticles, timestamp: Date.now() }));
        return { articles: parsedArticles, source: 'api', timestamp: Date.now() };
      }
    }
    throw new Error('No articles resolved from RSS');
  } catch (error) {
    console.warn('Google News RSS fetch failed, returning error for fallback:', error.message);
    throw error;
  }
}

