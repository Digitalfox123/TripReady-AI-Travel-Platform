import { calculateDistance } from '../engine/travelEngine';
import { supabase } from '../utils/supabaseClient';
import { attractionKnowledgeBase } from '../data/attractionKnowledgeBase';
import { getCuratedAttractionImage } from '../utils/imageLookup';

async function fetchWikipediaImage(attractionName) {
  if (!attractionName) return null;
  const cleanName = attractionName.replace(/\s*\(.*?\)\s*/g, ' ').trim();
  if (!cleanName) return null;

  const curated = getCuratedAttractionImage(cleanName);
  if (curated) return curated;

  const norm = cleanName.toLowerCase();
  for (const cityList of Object.values(attractionKnowledgeBase)) {
    const found = cityList.find(a => a.name.toLowerCase().includes(norm) || norm.includes(a.name.toLowerCase()));
    if (found && found.image) return found.image;
  }
  return null;
}

/**
 * Enriches a list of attractions with Wikipedia images for entries that have no image.
 * Processes in batches to avoid overwhelming the browser with parallel requests.
 */
async function enrichAttractionsWithImages(attractions) {
  if (!attractions || attractions.length === 0) return attractions;
  
  // Only enrich attractions that have empty images
  const needsImage = attractions.filter(a => !a.image);
  if (needsImage.length === 0) return attractions;
  
  // Process in batches of 5 to be respectful to Wikipedia API
  const BATCH_SIZE = 5;
  const results = new Map();
  
  for (let i = 0; i < needsImage.length; i += BATCH_SIZE) {
    const batch = needsImage.slice(i, i + BATCH_SIZE);
    const promises = batch.map(async (a) => {
      const img = await fetchWikipediaImage(a.name);
      if (img) results.set(a.id || a.name, img);
    });
    await Promise.all(promises);
  }
  
  // Merge images back into the attractions list
  return attractions.map(a => {
    const key = a.id || a.name;
    if (!a.image && results.has(key)) {
      return { ...a, image: results.get(key) };
    }
    return a;
  });
}


// ── Static Knowledge Base Matching ──────────────────────────────────────────────
const matchPremiumCity = (lat, lng, city = '') => {
  const normCity = city.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  
  // 1. Try matching by name
  for (const cityKey in attractionKnowledgeBase) {
    const normKey = cityKey.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (normCity.includes(normKey) || normKey.includes(normCity)) {
      return cityKey;
    }
  }

  // Special aliases
  if (normCity.includes('sf') || normCity.includes('siliconvalley')) return 'sanfrancisco';
  if (normCity.includes('stlouis') || normCity.includes('saintlouis')) return 'stlouis';

  // 2. Try matching by coordinates close to any attraction
  if (lat && lng) {
    for (const cityKey in attractionKnowledgeBase) {
      const attractions = attractionKnowledgeBase[cityKey];
      if (attractions.length > 0) {
        const first = attractions[0];
        if (Math.abs(lat - first.lat) < 0.3 && Math.abs(lng - first.lng) < 0.3) {
          return cityKey;
        }
      }
    }
  }
  return null;
};

export function isPlaceholderImage(url) {
  if (!url) return true;
  const lower = url.toLowerCase();
  return (
    lower.includes('photo-1488646953014-85cb44e25828') || // Passport/Map placeholder
    lower.includes('photo-1476514525535-07fb3b4ae5f1')    // Nikon camera placeholder
  );
}

/**
 * Transforms a raw Supabase attraction record into a normalized UI-ready object.
 */
function mapDbAttractionToUI(item, lat, lng) {
  let parsedDesc = {};
  try {
    if (item.description && item.description.startsWith('{')) {
      parsedDesc = JSON.parse(item.description);
    }
  } catch (e) {
    // Ignore JSON parse errors
  }

  const itemLat = item.latitude ? parseFloat(item.latitude) : null;
  const itemLng = item.longitude ? parseFloat(item.longitude) : null;

  const distance = lat && lng && itemLat && itemLng
    ? calculateDistance(lat, lng, itemLat, itemLng)
    : 0.0;

  const rawImage = parsedDesc.image || '';
  const finalImage = isPlaceholderImage(rawImage) ? '' : rawImage;

  return {
    id: item.slug,
    name: item.name,
    category: item.category || 'Sightseeing',
    address: parsedDesc.address || 'Central',
    lat: itemLat || (lat || 0.0),
    lng: itemLng || (lng || 0.0),
    distance: `${distance.toFixed(1)} km from center`,
    rawDistance: distance,
    description: parsedDesc.description || item.description || '',
    image: finalImage,
    rating: parsedDesc.rating || 4.8,
    reviewsCount: parsedDesc.reviewsCount || 150,
    score: parsedDesc.rating ? (parsedDesc.rating / 5.0) : 0.96
  };
}

/**
 * Splits a concatenated list of attractions (if present) and maps them to UI-ready objects.
 */
function splitAndMapDbAttractionToUI(item, lat, lng) {
  const name = item.name || '';
  
  // Normalize spacing
  let cleanName = name.replace(/\s+/g, ' ').trim();
  
  // Remove starting "1. " if present
  if (/^1\.\s+/.test(cleanName)) {
    cleanName = cleanName.replace(/^1\.\s+/, '');
  }
  
  // Check if it's a numbered list (e.g. contains " 2. ")
  const splitRegex = /\s+\d+\.\s+/;
  
  if (splitRegex.test(cleanName)) {
    const parts = cleanName.split(/\s+\d+\.\s+/).map(p => p.trim()).filter(Boolean);
    
    return parts.map((part, idx) => {
      // Create a copy of the item with the split name
      const splitItem = {
        ...item,
        name: part,
        slug: idx > 0 ? `${item.slug}-${idx}` : item.slug
      };
      return mapDbAttractionToUI(splitItem, lat, lng);
    });
  }
  
  // Standard mapping
  return [mapDbAttractionToUI(item, lat, lng)];
}

/**
 * Fetches attractions from Supabase first, falling back to local static knowledge base.
 * Returns null if no match found, allowing callers to fall back to live API feeds.
 * 
 * PRIORITY ORDER:
 * 1. Supabase database (primary source of truth — 21,000+ attractions)
 * 2. Static attractionKnowledgeBase (fallback only if Supabase returns 0 results)
 * 3. null (caller falls back to Google Places / Geoapify)
 */
export const getPoiAttractions = async (lat, lng, city = '', country = '') => {
  try {
    // ────────────────────────────────────────────────────────────────────────────
    // STEP 1: Try Supabase Database (Primary Source of Truth)
    // ────────────────────────────────────────────────────────────────────────────
    if (city) {
      try {
        const cityClean = city.trim().toLowerCase();
        const countryClean = country ? country.trim().toLowerCase() : '';
        
        const isCountryQuery = countryClean && cityClean === countryClean;
        
        if (isCountryQuery) {
          // ── Country-Level Query ──────────────────────────────────────────────
          // User searched for a country (e.g., "China"). Fetch ALL attractions
          // in ALL cities belonging to that country. NO LIMIT.
          const { data: matchedCountries } = await supabase
            .from('countries')
            .select('id, name, slug')
            .or(`name.ilike.%${countryClean}%,slug.eq.${countryClean}`);
            
          let dbCountry = null;
          if (matchedCountries && matchedCountries.length > 0) {
            dbCountry = matchedCountries.find(c => c.name.toLowerCase() === countryClean || c.slug === countryClean) || matchedCountries[0];
          }
            
          if (dbCountry) {
            // Find all cities in this country
            const { data: dbCities } = await supabase
              .from('cities')
              .select('id')
              .eq('country_id', dbCountry.id);
              
            if (dbCities && dbCities.length > 0) {
              const cityIds = dbCities.map(c => c.id);
              
              // Fetch ALL attractions from these cities page-by-page — NO LIMIT
              let dbAttractions = [];
              let page = 0;
              const pageSize = 1000;
              while (true) {
                const { data, error } = await supabase
                  .from('attractions')
                  .select('*')
                  .in('city_id', cityIds)
                  .range(page * pageSize, (page + 1) * pageSize - 1);
                
                if (error || !data || data.length === 0) break;
                dbAttractions = dbAttractions.concat(data);
                if (data.length < pageSize) break;
                page++;
              }
              
              if (dbAttractions && dbAttractions.length > 0) {
                const mapped = dbAttractions.flatMap(item => splitAndMapDbAttractionToUI(item, lat, lng));
                return await enrichAttractionsWithImages(mapped);
              }
            }
          }
        } else {
          // ── City-Level Query ──────────────────────────────────────────────────
          // User searched for a city. Query cities by name or slug.
          const { data: matchedCities } = await supabase
            .from('cities')
            .select('id, name, slug, country_name')
            .or(`name.ilike.%${cityClean}%,slug.eq.${cityClean}`);
            
          if (matchedCities && matchedCities.length > 0) {
            let dbCity = null;
            
            // If country is specified, try to narrow to the correct city
            if (countryClean) {
              dbCity = matchedCities.find(c => 
                c.country_name && (
                  c.country_name.toLowerCase().includes(countryClean) || 
                  countryClean.includes(c.country_name.toLowerCase())
                )
              );
            }
            
            // Fallback: use first match
            if (!dbCity) {
              // Prefer exact name or slug match over partial match
              const exactMatch = matchedCities.find(c => c.name.toLowerCase() === cityClean || c.slug === cityClean);
              dbCity = exactMatch || matchedCities[0];
            }
            
            // Fetch ALL attractions for this city page-by-page — NO LIMIT
            let dbAttractions = [];
            let page = 0;
            const pageSize = 1000;
            while (true) {
              const { data, error } = await supabase
                .from('attractions')
                .select('*')
                .eq('city_id', dbCity.id)
                .range(page * pageSize, (page + 1) * pageSize - 1);
              
              if (error || !data || data.length === 0) break;
              dbAttractions = dbAttractions.concat(data);
              if (data.length < pageSize) break;
              page++;
            }
              
            if (dbAttractions && dbAttractions.length > 0) {
              const mapped = dbAttractions.flatMap(item => splitAndMapDbAttractionToUI(item, lat, lng));
              return await enrichAttractionsWithImages(mapped);
            }
          }
        }
      } catch (dbErr) {
        console.warn("Supabase POI search failed, falling back:", dbErr);
      }
    }

    // ────────────────────────────────────────────────────────────────────────────
    // STEP 2: Static Knowledge Base Fallback (only if Supabase returned nothing)
    // ────────────────────────────────────────────────────────────────────────────
    const premiumKey = matchPremiumCity(lat, lng, city);
    if (premiumKey) {
      const list = attractionKnowledgeBase[premiumKey];
      return list.map(item => {
        const distance = lat && lng ? calculateDistance(lat, lng, item.lat, item.lng) : 0.0;
        return {
          ...item,
          distance: `${distance.toFixed(1)} km from center`,
          rawDistance: distance
        };
      });
    }

    return null;
  } catch (err) {
    console.warn('POI search failed:', err);
    return null;
  }
};
