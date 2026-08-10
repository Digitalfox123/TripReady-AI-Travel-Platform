import { useState, useEffect, useRef } from 'react';
import { attractionKnowledgeBase } from '../data/attractionKnowledgeBase.js';
import { getPipelineImage } from './imagePipeline.js';

export function getCuratedAttractionImage(name) {
  if (!name) return null;
  const lowerName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  for (const city of Object.values(attractionKnowledgeBase)) {
    const found = city.find(attr => {
      const attrName = attr.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      return attrName === lowerName || attrName.includes(lowerName) || lowerName.includes(attrName);
    });
    if (found && found.image) {
      return found.image;
    }
  }
  return null;
}

export function isPlaceholderImage(url) {
  if (!url) return true;
  const lower = url.toLowerCase();
  return (
    lower.includes('photo-1488646953014-85cb44e25828') || // Passport/Map placeholder
    lower.includes('photo-1469854523086-cc02fe5d8800') || // Yellow van placeholder
    lower.includes('photo-1476514525535-07fb3b4ae5f1') || // Nikon camera placeholder
    lower.includes('flag') ||
    lower.includes('map') ||
    lower.includes('locator') ||
    lower.includes('projection') ||
    lower.includes('orthographic') ||
    lower.includes('coat_of_arms') ||
    lower.includes('shield') ||
    lower.includes('seal') ||
    lower.includes('.svg') ||
    lower.includes('silhouette') ||
    lower.includes('diagram') ||
    lower.includes('globe')
  );
}

// ── CURATED DYNAMIC IMAGE REGISTRY FOR HIGH-DENSITY LANDMARK VISUALS ─────────
const IMAGE_REGISTRY = {
  // Saudi Arabia
  riyadh: 'https://images.unsplash.com/photo-1586724230021-4c38356a1b7c?w=1200&q=80', // Kingdom Centre Skyline
  jeddah: 'https://images.unsplash.com/photo-1598902108854-10e335adac99?w=1200&q=80', // Historic Al-Balad coral houses
  mecca: 'https://images.unsplash.com/photo-1564769625905-50e9ad63095a?w=1200&q=80',  // Holy Kaaba
  makkah: 'https://images.unsplash.com/photo-1564769625905-50e9ad63095a?w=1200&q=80', // Holy Kaaba
  medina: 'https://images.unsplash.com/photo-1601058268499-e52658bdfaf1?w=1200&q=80',  // Prophet's Mosque Al-Masjid an-Nabawi
  madinah: 'https://images.unsplash.com/photo-1601058268499-e52658bdfaf1?w=1200&q=80', // Prophet's Mosque Al-Masjid an-Nabawi
  alula: 'https://images.unsplash.com/photo-1627998797960-951fcdae95a9?w=1200&q=80',   // Hegra Stone Tombs
  saudiarabia: 'https://images.unsplash.com/photo-1564769625905-50e9ad63095a?w=1200&q=80',

  // Pakistan
  islamabad: 'https://images.unsplash.com/photo-1565506737357-af89222625ad?w=1200&q=80', // Faisal Mosque
  lahore: 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?w=1200&q=80',    // Badshahi Mosque
  karachi: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=1200&q=80',   // Mazar-e-Quaid Mausoleum
  hunza: 'https://images.unsplash.com/photo-1595844730298-b9f1ff982792?w=1200&q=80',     // Passu Cones Karakoram
  skardu: 'https://images.unsplash.com/photo-1614082242765-7c9880d3ddd3?w=1200&q=80',    // Shangrila Resort Lake
  swat: 'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?w=1200&q=80',       // Swat Valley River/Mountains
  peshawar: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=1200&q=80',   // Qissa Khwani Bazaar
  pakistan: 'https://images.unsplash.com/photo-1565506737357-af89222625ad?w=1200&q=80',

  // United States
  newyork: 'https://images.unsplash.com/photo-1522083165195-342750297f05?w=1200&q=80',    // Statue of Liberty
  losangeles: 'https://images.unsplash.com/photo-1506634572416-48cdfe530110?w=1200&q=80', // Griffith Observatory / Hollywood Sign
  chicago: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&q=80',    // Chicago Cloud Gate Bean
  miami: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80',      // Art Deco Ocean Drive
  sanfrancisco: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&q=80', // Golden Gate Bridge
  unitedstates: 'https://images.unsplash.com/photo-1522083165195-342750297f05?w=1200&q=80',
  usa: 'https://images.unsplash.com/photo-1522083165195-342750297f05?w=1200&q=80',

  // United Kingdom
  london: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&q=80',    // Big Ben & Tower Bridge
  edinburgh: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=1200&q=80', // Edinburgh Castle
  unitedkingdom: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&q=80',
  uk: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&q=80',

  // France
  paris: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80',     // Eiffel Tower
  nice: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200&q=80',      // Promenade des Anglais
  france: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80',

  // Japan
  tokyo: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&q=80',     // Tokyo Tower
  kyoto: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=80',     // Kiyomizu-dera Pagoda
  osaka: 'https://images.unsplash.com/photo-1590253509302-39c4d715978a?w=1200&q=80',     // Dotonbori Canal Neon
  mountfuji: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200&q=80', // Mt. Fuji Pagoda Cherry Blossoms
  japan: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&q=80',

  // Italy
  rome: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&q=80',      // Colosseum
  venice: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=1200&q=80',    // Rialto Bridge Canal
  florence: 'https://images.unsplash.com/photo-1528114039593-4366cc08227d?w=1200&q=80',  // Florence Duomo Cathedral
  italy: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&q=80',

  // Spain
  barcelona: 'https://images.unsplash.com/photo-1583422409516-2895a77efedd?w=1200&q=80', // Sagrada Familia
  madrid: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=1200&q=80',    // Royal Palace Plaza
  spain: 'https://images.unsplash.com/photo-1583422409516-2895a77efedd?w=1200&q=80',

  // Switzerland
  zurich: 'https://images.unsplash.com/photo-1515488042361-404e9250afef?w=1200&q=80',     // Zurich city lake/skyline
  geneva: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1200&q=80',
  swissalps: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80', // Matterhorn Peak
  switzerland: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80',

  // Egypt
  cairo: 'https://images.unsplash.com/photo-1503177119275-0aa32b31d468?w=1200&q=80',        // Great Pyramids of Giza
  cairopyramids: 'https://images.unsplash.com/photo-1503177119275-0aa32b31d468?w=1200&q=80', // Great Pyramids of Giza
  egypt: 'https://images.unsplash.com/photo-1503177119275-0aa32b31d468?w=1200&q=80',

  // Germany
  berlin: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=1200&q=80',    // Brandenburg Gate
  munich: 'https://images.unsplash.com/photo-1595867818082-083862f3d630?w=1200&q=80',    // Marienplatz Town Hall
  germany: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=1200&q=80',

  // Turkey
  istanbul: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=80',  // Hagia Sophia / Blue Mosque
  cappadocia: 'https://images.unsplash.com/photo-1570939617782-99c878bfeed3?w=1200&q=80',// Hot Air Balloons
  turkey: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=80',

  // Greece
  athens: 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=1200&q=80',    // Acropolis Parthenon
  greece: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=1200&q=80',

  // Canada
  toronto: 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?w=1200&q=80',   // CN Tower Skyline
  vancouver: 'https://images.unsplash.com/photo-1559511260-66a654ae982a?w=1200&q=80', // Vancouver Harbor
  canada: 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?w=1200&q=80',

  // Australia
  sydney: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1200&q=80',    // Sydney Opera House
  melbourne: 'https://images.unsplash.com/photo-1545044846-351ba102b6d5?w=1200&q=80', // Flinders Station
  australia: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1200&q=80',

  // Brazil
  rio: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1200&q=80',            // Christ the Redeemer
  riodejaneiro: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1200&q=80',   // Christ the Redeemer
  brazil: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1200&q=80',

  // Netherlands
  amsterdam: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=1200&q=80', // Canals & Houses
  netherlands: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=1200&q=80',

  // Austria
  vienna: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=1200&q=80',    // Schönbrunn Palace
  austria: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=1200&q=80',

  // Portugal
  lisbon: 'https://images.unsplash.com/photo-1509804868213-982885970221?w=1200&q=80',    // Yellow Tram Alfama
  portugal: 'https://images.unsplash.com/photo-1509804868213-982885970221?w=1200&q=80',

  // Others
  singapore: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&q=80', // Marina Bay Sands
  santorini: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=1200&q=80', // Oia Blue Domes
  dubai: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80',     // Burj Khalifa
  unitedarabemirates: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80',
  uae: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80',
  bali: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80',      // Tanah Lot Temple
  indonesia: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80',
  maldives: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200&q=80',  // Overwater Bungalow Resort
  thailand: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1200&q=80',  // Grand Palace Bangkok
  bangkok: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1200&q=80',
  washingtondc: 'https://images.unsplash.com/photo-1501466044931-62695aada8e3?w=1200&q=80', // US Capitol
  washington: 'https://images.unsplash.com/photo-1501466044931-62695aada8e3?w=1200&q=80',
  default: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=80'
};

export function getCityImage(city, country) {
  const cityStr = city && typeof city === 'object' ? city.name : city;
  const countryStr = country && typeof country === 'object' ? country.name : country;
  const normCity = cityStr ? cityStr.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
  const normCountry = countryStr ? countryStr.toLowerCase().replace(/[^a-z0-9]/g, '') : '';

  if (IMAGE_REGISTRY[normCity]) {
    return IMAGE_REGISTRY[normCity];
  }
  if (IMAGE_REGISTRY[normCountry]) {
    return IMAGE_REGISTRY[normCountry];
  }

  for (const [key, value] of Object.entries(IMAGE_REGISTRY)) {
    if (normCity.includes(key) || key.includes(normCity)) {
      return value;
    }
  }

  // Structural Fallback themes
  const fullText = (normCity + ' ' + normCountry).toLowerCase();
  
  if (fullText.includes('forest') || fullText.includes('jungle') || fullText.includes('amazon') || fullText.includes('woods')) {
    return 'https://images.unsplash.com/photo-1511497584788-876760111969?w=1200&q=80';
  }
  if (fullText.includes('beach') || fullText.includes('island') || fullText.includes('coast') || fullText.includes('ocean') || fullText.includes('tropical') || fullText.includes('maldives') || fullText.includes('bora')) {
    return 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80';
  }
  if (fullText.includes('mountain') || fullText.includes('alp') || fullText.includes('peak') || fullText.includes('summit') || fullText.includes('himalaya') || fullText.includes('andes') || fullText.includes('glacier') || fullText.includes('k2') || fullText.includes('valley')) {
    return 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80';
  }
  if (fullText.includes('snow') || fullText.includes('winter') || fullText.includes('ice') || fullText.includes('cold') || fullText.includes('frozen') || fullText.includes('antarctic') || fullText.includes('antarctica') || fullText.includes('polar')) {
    return 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?w=1200&q=80';
  }
  if (fullText.includes('desert') || fullText.includes('sahara') || fullText.includes('dune') || fullText.includes('safari')) {
    return 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=80';
  }
  if (fullText.includes('historic') || fullText.includes('ancient') || fullText.includes('ruin') || fullText.includes('castle') || fullText.includes('temple') || fullText.includes('pyramid') || fullText.includes('mecca') || fullText.includes('medina')) {
    return 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200&q=80';
  }
  if (fullText.includes('waterfall') || fullText.includes('falls') || fullText.includes('river') || fullText.includes('lake')) {
    return 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=80';
  }
  if (fullText.includes('city') || fullText.includes('town') || fullText.includes('skyline') || fullText.includes('metropolis')) {
    return 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=80';
  }

  return 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=80';
}

// ── LOCAL CURATED IMAGE RESOLUTION (NO EXTERNAL IMAGE APIS REQUIRED) ───────

export function getIconicLandmark(attractions, cityName, countryName) {
  if (!attractions || attractions.length === 0) return null;

  const scored = attractions.map(a => {
    let score = 0;
    const category = (a.category || '').toLowerCase();
    const name = (a.name || '').toLowerCase();

    // 1. Category-based ranking
    if (category.includes('landmark') || category.includes('monument') || category.includes('heritage')) {
      score += 50;
    } else if (category.includes('castle') || category.includes('palace') || category.includes('tower')) {
      score += 45;
    } else if (category.includes('museum') || category.includes('historical')) {
      score += 40;
    } else if (category.includes('religious') || category.includes('mosque') || category.includes('church') || category.includes('temple') || category.includes('cathedral')) {
      score += 35;
    } else if (category.includes('park') || category.includes('nature') || category.includes('beach') || category.includes('viewpoint')) {
      score += 20;
    } else {
      score += 10;
    }

    // 2. Popularity-based ranking (rating & reviews)
    const rating = a.rating || 4.5;
    const reviewsCount = a.reviewsCount || 100;
    score += rating * 10;
    score += Math.min(50, reviewsCount / 10);

    // 3. Title match boost
    if (cityName && name.includes(cityName.toLowerCase())) {
      score += 10;
    }

    return { attraction: a, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0].attraction;
}

// ── CATEGORY THEMATIC IMAGE POOLS (DIVERSE UNIQUE VISUALS) ─────────────────
const CATEGORY_IMAGE_POOLS = {
  museum: [
    'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=1200&q=80',
    'https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=1200&q=80',
    'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=1200&q=80',
    'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=1200&q=80'
  ],
  park: [
    'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1200&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80',
    'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=1200&q=80',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=80'
  ],
  beach: [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80',
    'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200&q=80',
    'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200&q=80',
    'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1200&q=80'
  ],
  castle: [
    'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=1200&q=80',
    'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=1200&q=80',
    'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?w=1200&q=80'
  ],
  nature: [
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80',
    'https://images.unsplash.com/photo-1511497584788-876760111969?w=1200&q=80',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=80'
  ],
  city: [
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80',
    'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=80',
    'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&q=80'
  ]
};

export function getCategoryFallbackImage(name = '', category = '') {
  const norm = (name + ' ' + category).toLowerCase();
  
  if (norm.includes('museum') || norm.includes('art') || norm.includes('gallery') || norm.includes('exhibit')) {
    const hash = Math.abs(norm.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0));
    return CATEGORY_IMAGE_POOLS.museum[hash % CATEGORY_IMAGE_POOLS.museum.length];
  }
  if (norm.includes('park') || norm.includes('botanical') || norm.includes('garden') || norm.includes('green')) {
    const hash = Math.abs(norm.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0));
    return CATEGORY_IMAGE_POOLS.park[hash % CATEGORY_IMAGE_POOLS.park.length];
  }
  if (norm.includes('beach') || norm.includes('coast') || norm.includes('sea') || norm.includes('ocean') || norm.includes('riviera') || norm.includes('island')) {
    const hash = Math.abs(norm.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0));
    return CATEGORY_IMAGE_POOLS.beach[hash % CATEGORY_IMAGE_POOLS.beach.length];
  }
  if (norm.includes('castle') || norm.includes('palace') || norm.includes('chateau') || norm.includes('fort') || norm.includes('tower')) {
    const hash = Math.abs(norm.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0));
    return CATEGORY_IMAGE_POOLS.castle[hash % CATEGORY_IMAGE_POOLS.castle.length];
  }
  if (norm.includes('mountain') || norm.includes('forest') || norm.includes('lake') || norm.includes('river') || norm.includes('trail') || norm.includes('nature')) {
    const hash = Math.abs(norm.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0));
    return CATEGORY_IMAGE_POOLS.nature[hash % CATEGORY_IMAGE_POOLS.nature.length];
  }

  const hash = Math.abs(norm.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0));
  const allPools = [
    ...CATEGORY_IMAGE_POOLS.museum,
    ...CATEGORY_IMAGE_POOLS.park,
    ...CATEGORY_IMAGE_POOLS.beach,
    ...CATEGORY_IMAGE_POOLS.castle,
    ...CATEGORY_IMAGE_POOLS.nature,
    ...CATEGORY_IMAGE_POOLS.city
  ];
  return allPools[hash % allPools.length];
}

export function usePremiumImage(city, country, queryOverride, attractions) {
  const cityStr = city && typeof city === 'object' ? city.name : city;
  const countryStr = country && typeof country === 'object' ? country.name : country;
  
  const [imageUrl, setImageUrl] = useState(() => {
    if (!cityStr) return getCityImage(cityStr, countryStr);
    let targetAttractionName = cityStr;
    if (attractions && attractions.length > 0) {
      const landmark = getIconicLandmark(attractions, cityStr, countryStr);
      if (landmark) targetAttractionName = landmark.name;
    }
    const curated = getCuratedAttractionImage(targetAttractionName);
    if (curated) return curated;
    return getCategoryFallbackImage(targetAttractionName, queryOverride || cityStr);
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!cityStr) return;
    let targetAttractionName = cityStr;
    if (attractions && attractions.length > 0) {
      const landmark = getIconicLandmark(attractions, cityStr, countryStr);
      if (landmark) targetAttractionName = landmark.name;
    }

    const curated = getCuratedAttractionImage(targetAttractionName);
    if (curated) {
      setImageUrl(curated);
      setLoading(false);
      return;
    }

    // Try Wikipedia REST API asynchronously
    setLoading(true);
    getPipelineImage(targetAttractionName, cityStr, countryStr).then(res => {
      if (res && res.url) {
        setImageUrl(res.url);
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, [cityStr, countryStr, queryOverride, attractions]);

  return { imageUrl, loading };
}

// ── CUSTOM DYNAMIC HOOK FOR 3-5 IMAGE DIVERSIFIED LANDMARK GALLERIES ─────────
export function useDestinationGallery(destinationName, countryName, count = 4) {
  const cityStr = destinationName && typeof destinationName === 'object' ? destinationName.name : destinationName;
  const countryStr = countryName && typeof countryName === 'object' ? countryName.name : countryName;

  const [images, setImages] = useState(() => {
    if (!cityStr) return [];
    const normCity = cityStr.toLowerCase().replace(/[^a-z0-9]/g, '');
    const kbKey = Object.keys(attractionKnowledgeBase).find(key => {
      const normKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
      return normCity === normKey || normCity.includes(normKey) || normKey.includes(normCity);
    });
    
    let baseKbImages = [];
    if (kbKey && Array.isArray(attractionKnowledgeBase[kbKey])) {
      baseKbImages = attractionKnowledgeBase[kbKey]
        .map(a => a.image)
        .filter(Boolean)
        .filter(img => !isPlaceholderImage(img))
        .filter((img, idx, arr) => arr.indexOf(img) === idx);
    }
    
    const primaryImg = getCityImage(cityStr, countryStr);
    const results = baseKbImages.length > 0 ? [...baseKbImages] : [primaryImg];

    const normCityLower = (cityStr || '').toLowerCase();
    const cLower = (countryStr || '').toLowerCase();
    let countrySpecificFallbacks = [];

    if (cLower.includes('pakistan') || normCityLower.includes('changa') || normCityLower.includes('manga') || normCityLower.includes('lahore') || normCityLower.includes('islamabad')) {
      countrySpecificFallbacks = [
        'https://images.unsplash.com/photo-1565506737357-af89222625ad?w=1200&q=80', // Faisal Mosque
        'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?w=1200&q=80', // Badshahi Mosque
        'https://images.unsplash.com/photo-1595844730298-b9f1ff982792?w=1200&q=80', // Passu Cones Karakoram
        'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=1200&q=80', // Mazar-e-Quaid
        'https://images.unsplash.com/photo-1614082242765-7c9880d3ddd3?w=1200&q=80', // Shangrila Lake
      ];
    } else if (cLower.includes('saudi') || cLower.includes('arabia') || normCityLower.includes('makkah') || normCityLower.includes('riyadh')) {
      countrySpecificFallbacks = [
        'https://images.unsplash.com/photo-1586724230021-4c38356a1b7c?w=1200&q=80',
        'https://images.unsplash.com/photo-1598902108854-10e335adac99?w=1200&q=80',
        'https://images.unsplash.com/photo-1564769625905-50e9ad63095a?w=1200&q=80',
        'https://images.unsplash.com/photo-1601058268499-e52658bdfaf1?w=1200&q=80',
      ];
    } else if (cLower.includes('japan') || normCityLower.includes('tokyo') || normCityLower.includes('kyoto')) {
      countrySpecificFallbacks = [
        'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&q=80',
        'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=80',
        'https://images.unsplash.com/photo-1590253509302-39c4d715978a?w=1200&q=80',
        'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200&q=80',
      ];
    }

    const fallbackList = [
      ...countrySpecificFallbacks,
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80',
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80',
      'https://images.unsplash.com/photo-1473116763269-255448993f66?w=1200&q=80',
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80',
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&q=80'
    ];

    for (const fb of fallbackList) {
      if (results.length >= count) break;
      if (!results.includes(fb)) {
        results.push(fb);
      }
    }
    return results.slice(0, count);
  });

  return { images, loading: false };
}
