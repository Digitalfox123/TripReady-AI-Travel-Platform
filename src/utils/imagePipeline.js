// Curated High-Definition Image Pipeline with Wikipedia REST API Integration
import { attractionKnowledgeBase } from '../data/attractionKnowledgeBase.js';

// Clean attraction names by removing parentheses, common generic suffixes, etc.
export function cleanAttractionName(name) {
  if (!name) return '';
  return name
    .replace(/\s*\(.*?\)\s*/g, ' ') // Remove parentheses contents
    .replace(/,\s*nearby/i, '')     // Remove "nearby" references
    .replace(/\s+/g, ' ')
    .trim();
}

// Tokenize text for similarity matching
function tokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3);
}

// Score a candidate image
export function scoreCandidate(candidate, context) {
  const { baseConfidence = 100 } = context || {};
  return baseConfidence;
}

// Wikipedia REST API image fetcher (Free, Public, No API Key Required)
export async function fetchFromWikipedia(term, locationContext = '') {
  if (!term) return null;
  const cleanTerm = cleanAttractionName(term);
  if (!cleanTerm) return null;

  let query = cleanTerm;
  if (locationContext && !cleanTerm.toLowerCase().includes(locationContext.toLowerCase())) {
    query += ` ${locationContext}`;
  }

  const cacheKey = `tripready_wiki_img_v2_${query.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) return cached;
  } catch (e) {}

  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`;
    const searchRes = await fetch(searchUrl);
    if (!searchRes.ok) return null;

    const searchData = await searchRes.json();
    const results = searchData?.query?.search || [];
    if (results.length === 0) return null;

    for (let i = 0; i < Math.min(3, results.length); i++) {
      const pageTitle = results[i].title;
      const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle.replace(/\s+/g, '_'))}`;
      const summaryRes = await fetch(summaryUrl);
      if (!summaryRes.ok) continue;

      const data = await summaryRes.json();
      const src = data?.originalimage?.source || data?.thumbnail?.source;
      if (!src) continue;

      const lowerSrc = src.toLowerCase();
      const description = (data.description || '').toLowerCase();

      const isMapOrFlag =
        lowerSrc.includes('flag') ||
        lowerSrc.includes('map') ||
        lowerSrc.includes('locator') ||
        lowerSrc.includes('projection') ||
        lowerSrc.includes('position') ||
        lowerSrc.includes('location') ||
        lowerSrc.includes('coat_of_arms') ||
        lowerSrc.includes('shield') ||
        lowerSrc.includes('seal') ||
        lowerSrc.includes('orthographic') ||
        lowerSrc.includes('globe') ||
        lowerSrc.includes('inset') ||
        lowerSrc.includes('.svg') ||
        description.includes('flag') ||
        description.includes('map') ||
        description.includes('coat of arms');

      if (!isMapOrFlag) {
        try { localStorage.setItem(cacheKey, src); } catch (e) {}
        return src;
      }
    }
  } catch (err) {
    console.warn("Wikipedia REST API lookup failed for:", query, err);
  }
  return null;
}

// Main pipeline function to resolve attraction images using KB & Wikipedia REST API
export async function getPipelineImage(attractionName, cityName, countryName) {
  if (!attractionName) return null;
  const cleanAttr = cleanAttractionName(attractionName).toLowerCase();
  const cleanCity = cityName ? cityName.toLowerCase().replace(/[^a-z0-9]/g, '') : '';

  // 1. Search knowledge base for exact attraction match
  if (cleanCity && attractionKnowledgeBase[cleanCity]) {
    const found = attractionKnowledgeBase[cleanCity].find(a => 
      a.name.toLowerCase().includes(cleanAttr) || cleanAttr.includes(a.name.toLowerCase())
    );
    if (found && found.image) {
      return {
        url: found.image,
        source: 'Curated KB',
        credit: 'TripReady Visuals',
        confidence: 100
      };
    }
  }

  // 2. Global search across all cities in knowledge base
  for (const cityList of Object.values(attractionKnowledgeBase)) {
    const found = cityList.find(a => 
      a.name.toLowerCase().includes(cleanAttr) || cleanAttr.includes(a.name.toLowerCase())
    );
    if (found && found.image) {
      return {
        url: found.image,
        source: 'Curated KB',
        credit: 'TripReady Visuals',
        confidence: 95
      };
    }
  }

  // 3. Query Wikipedia REST API for the attraction
  const wikiUrl = await fetchFromWikipedia(attractionName, cityName || countryName);
  if (wikiUrl) {
    return {
      url: wikiUrl,
      source: 'Wikipedia REST API',
      credit: 'Wikipedia Contributors',
      confidence: 90
    };
  }

  // 4. Query Wikipedia REST API for the city if attraction lookup yielded no photo
  if (cityName && cityName !== attractionName) {
    const wikiCityUrl = await fetchFromWikipedia(cityName, countryName);
    if (wikiCityUrl) {
      return {
        url: wikiCityUrl,
        source: 'Wikipedia City',
        credit: 'Wikipedia Contributors',
        confidence: 80
      };
    }
  }

  return null;
}
