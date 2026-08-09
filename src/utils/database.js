import { supabase } from './supabaseClient';
import { attractionKnowledgeBase } from '../data/attractionKnowledgeBase';
import { pilgrimageGuides } from '../data/pilgrimageData';
import { getCountryIntelligence } from '../data/countryIntelligence';

// Curated list of popular destinations to boost search ranking
const CURATED_BOOSTS = {
  'lahore': 300,
  'dubai': 300,
  'tokyo': 300,
  'paris': 300,
  'london': 300,
  'rome': 300,
  'newyork': 300,
  'sydney': 300,
  'cairo': 300,
  'zurich': 300,
  'bali': 300,
  'munich': 300,
  'islamabad': 300,
  'karachi': 300,
  'pakistan': 250,
  'unitedarabemirates': 250,
  'unitedstates': 250,
  'france': 250,
  'unitedkingdom': 250,
  'japan': 250,
  'australia': 250,
  'egypt': 250,
  'switzerland': 250,
  'canada': 250
};

// Normalized string helper for fuzzy scoring
function normalizeKey(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

// Levenshtein distance for typo-tolerant fuzzy matching
function getLevenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

/**
 * Fuzzy search engine executing parallel SQL queries against Supabase
 * Target response time: < 100ms
 */
export async function searchDestinations(query, limit = 10) {
  if (!query || query.trim().length === 0) return [];
  const queryClean = query.trim();
  const queryNorm = normalizeKey(queryClean);
  if (queryNorm.length === 0) return [];

  try {
    // Execute parallel ILIKE queries on Supabase tables
    const [countriesRes, statesRes, citiesRes, attractionsRes] = await Promise.all([
      supabase.from('countries').select('*').ilike('name', `%${queryClean}%`).limit(limit),
      supabase.from('states').select('*').ilike('name', `%${queryClean}%`).limit(limit),
      supabase.from('cities').select('*').ilike('name', `%${queryClean}%`).limit(limit),
      supabase.from('attractions').select('*').ilike('name', `%${queryClean}%`).limit(limit)
    ]);

    const tempIndex = [];

    // Parse local pilgrimage guides for search index
    pilgrimageGuides.forEach(g => {
      tempIndex.push({
        type: 'guide',
        id: g.id,
        name: g.title,
        slug: g.id,
        flag: g.id.includes('umrah') || g.id.includes('hajj') || g.id.includes('makkah') || g.id.includes('madinah') ? '🕋' : '⛩️',
        normalizedName: normalizeKey(g.title),
        displayTitle: g.title,
        displaySubtitle: `Religion & Pilgrimage • ${g.subtitle}`,
        path: g.path,
        rankingPriority: 5,
        original: g,
        keywords: g.id === 'umrah-guide' 
          ? ['umrah', 'how to perform umrah', 'first-time umrah guide', 'umrah budget', 'umrah cost', 'umrah itinerary', 'makkah guide', 'madinah guide', 'pilgrimage planning', 'religious travel', 'mecca', 'medina', 'saudi', 'islamic']
          : g.id === 'hajj-guide'
          ? ['hajj', 'pilgrimage', 'islamic', 'mecca', 'makkah', 'holy']
          : g.id === 'vatican-guide'
          ? ['vatican', 'rome', 'christian', 'pilgrimage', 'holy', 'pope']
          : g.id === 'makkah-guide'
          ? ['makkah', 'mecca', 'saudi', 'islamic', 'travel', 'holy']
          : g.id === 'madinah-guide'
          ? ['madinah', 'medina', 'saudi', 'islamic', 'travel', 'holy']
          : []
      });
    });

    // Parse Countries
    if (countriesRes.data) {
      countriesRes.data.forEach(c => {
        tempIndex.push({
          type: 'country',
          id: c.id,
          name: c.name,
          slug: c.slug,
          flag: c.flag,
          normalizedName: normalizeKey(c.name),
          displayTitle: c.name,
          displaySubtitle: `${c.subregion || c.region || 'Worldwide'}`,
          rankingPriority: 10,
          original: c
        });
      });
    }

    // Parse States
    if (statesRes.data) {
      statesRes.data.forEach(s => {
        tempIndex.push({
          type: 'state',
          id: s.id,
          name: s.name,
          slug: s.slug,
          flag: '🏛️',
          normalizedName: normalizeKey(s.name),
          displayTitle: s.name,
          displaySubtitle: `State • ${s.country_name || 'Global'}`,
          rankingPriority: 20,
          original: s
        });
      });
    }

    // Parse Cities
    if (citiesRes.data) {
      citiesRes.data.forEach(c => {
        tempIndex.push({
          type: 'city',
          id: c.id,
          name: c.name,
          slug: c.slug,
          flag: '🏙️',
          normalizedName: normalizeKey(c.name),
          displayTitle: c.name,
          displaySubtitle: `City • ${c.state_name || ''} • ${c.country_name || ''}`,
          rankingPriority: 30,
          isCapital: c.is_capital,
          original: c
        });
      });
    }

    // Parse Attractions
    if (attractionsRes.data) {
      attractionsRes.data.forEach(a => {
        let cleanName = (a.name || '').replace(/\s+/g, ' ').trim();
        if (/^1\.\s+/.test(cleanName)) {
          cleanName = cleanName.replace(/^1\.\s+/, '');
        }
        
        if (/\s+\d+\.\s+/.test(cleanName)) {
          const parts = cleanName.split(/\s+\d+\.\s+/).map(p => p.trim()).filter(Boolean);
          parts.forEach((part, idx) => {
            // Only add if it matches the query to keep it clean and relevant
            if (part.toLowerCase().includes(queryClean.toLowerCase())) {
              tempIndex.push({
                type: 'attraction',
                id: a.id,
                name: part,
                slug: idx > 0 ? `${a.slug}-${idx}` : a.slug,
                flag: '📍',
                normalizedName: normalizeKey(part),
                displayTitle: part,
                displaySubtitle: `Attraction • ${a.category || 'Sightseeing'}`,
                rankingPriority: 40,
                original: {
                  ...a,
                  name: part,
                  slug: idx > 0 ? `${a.slug}-${idx}` : a.slug
                }
              });
            }
          });
        } else {
          tempIndex.push({
            type: 'attraction',
            id: a.id,
            name: a.name,
            slug: a.slug,
            flag: '📍',
            normalizedName: normalizeKey(a.name),
            displayTitle: a.name,
            displaySubtitle: `Attraction • ${a.category || 'Sightseeing'}`,
            rankingPriority: 40,
            original: a
          });
        }
      });
    }

    // Apply Levenshtein fuzzy scoring on the search hits
    const matches = tempIndex.map(item => {
      let score = 0;
      let isMatch = false;

      if (item.normalizedName === queryNorm) {
        score += 10000;
        isMatch = true;
      } else if (item.normalizedName.startsWith(queryNorm)) {
        score += 5000;
        isMatch = true;
      } else if (item.normalizedName.includes(queryNorm)) {
        score += 1000;
        isMatch = true;
      } else if (queryNorm.length > 3) {
        const queryLen = queryNorm.length;
        const itemNamePrefix = item.normalizedName.substring(0, queryLen + 1);
        const dist = getLevenshteinDistance(queryNorm, itemNamePrefix);
        
        if (dist <= 1) {
          score += 800 - dist * 200;
          isMatch = true;
        } else {
          const fullDist = getLevenshteinDistance(queryNorm, item.normalizedName);
          if (fullDist <= 2 && queryNorm.length >= 5) {
            score += 300 - fullDist * 100;
            isMatch = true;
          }
        }
      }

      // Match keywords if it's a guide
      if (item.type === 'guide' && item.keywords) {
        const keywordMatch = item.keywords.some(kw => {
          const kwNorm = normalizeKey(kw);
          return kwNorm === queryNorm || kwNorm.startsWith(queryNorm) || kwNorm.includes(queryNorm);
        });
        if (keywordMatch) {
          score += 12000; // give it a very high score to rank it prominently!
          isMatch = true;
        }
      }

      // Add base type weights
      if (item.type === 'guide') score += 100;
      else if (item.type === 'attraction') score += 50;
      else if (item.type === 'city') score += 40;
      else if (item.type === 'state') score += 30;
      else if (item.type === 'country') score += 20;

      // Curated popular boosts
      const popularityBoost = CURATED_BOOSTS[item.normalizedName];
      if (popularityBoost) score += popularityBoost;

      if (item.isCapital) score += 25;

      return { ...item, score, isMatch };
    }).filter(item => item.isMatch);

    return matches
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.name.localeCompare(b.name);
      })
      .slice(0, limit);
  } catch (err) {
    console.error('Supabase query search failed:', err);
    return [];
  }
}

// ============================================
// RELATION-AWARE ASYNC RESOLVERS
// ============================================

export async function getCountryBySlug(slug) {
  if (!slug) return null;
  const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '');

  try {
    // 1. Fetch country from Supabase exact slug match
    let { data: country, error: cErr } = await supabase
      .from('countries')
      .select('*')
      .eq('slug', cleanSlug)
      .single();

    // 2. If not found by exact slug, try ilike search by name or code
    if (cErr || !country) {
      const searchName = cleanSlug.replace(/-/g, ' ');
      const { data: altCountries } = await supabase
        .from('countries')
        .select('*')
        .or(`name.ilike.%${searchName}%,slug.ilike.%${cleanSlug}%`)
        .limit(1);

      if (altCountries && altCountries.length > 0) {
        country = altCountries[0];
      }
    }

    // 3. Robust fallback if Supabase returns no match
    if (!country) {
      const cleanName = cleanSlug.replace(/-/g, ' ');
      const intel = getCountryIntelligence(cleanName);
      const formattedTitle = cleanName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

      country = {
        id: cleanSlug,
        name: intel?.countryName || formattedTitle,
        slug: cleanSlug,
        flag: intel?.flag || '🌍',
        capital: intel?.facts?.capital || 'Capital Hub',
        region: intel?.continent || 'Worldwide',
        subregion: intel?.continent || 'Global Destination',
        iso2: intel?.countryCode || 'XX',
        iso3: intel?.countryCode || 'XXX',
        currency_code: intel?.currencyCode || 'USD',
        currency_symbol: intel?.currencySymbol || '$',
        population: intel?.facts?.population || 'N/A',
        overview: intel?.insights?.whyLove || `Explore travel guides, top sights, regional cities, local transit apps and custom itineraries for ${formattedTitle}.`
      };
    }

    // 2. Fetch states in parallel
    const [statesRes, citiesRes] = await Promise.all([
      supabase.from('states').select('id, name, slug').eq('country_id', country.id),
      supabase.from('cities').select('id, name, slug, state_id, state_name, is_capital').eq('country_id', country.id)
    ]);

    // 3. Fetch ALL attractions from Supabase page-by-page (Primary Source of Truth)
    let dbAttractions = [];
    let page = 0;
    const pageSize = 1000;
    const cityIds = (citiesRes.data || []).map(c => c.id);
    
    if (cityIds.length > 0) {
      while (true) {
        const { data, error } = await supabase
          .from('attractions')
          .select('id, name, slug, category, city_id, description')
          .in('city_id', cityIds)
          .range(page * pageSize, (page + 1) * pageSize - 1);
          
        if (error || !data || data.length === 0) break;
        dbAttractions = dbAttractions.concat(data);
        if (data.length < pageSize) break;
        page++;
      }
    }

    const attractionsList = (dbAttractions || []).flatMap(da => {
      let cleanName = (da.name || '').replace(/\s+/g, ' ').trim();
      if (/^1\.\s+/.test(cleanName)) {
        cleanName = cleanName.replace(/^1\.\s+/, '');
      }
      
      const cityObj = (citiesRes.data || []).find(c => c.id === da.city_id);
      
      if (/\s+\d+\.\s+/.test(cleanName)) {
        const parts = cleanName.split(/\s+\d+\.\s+/).map(p => p.trim()).filter(Boolean);
        return parts.map((part, idx) => ({
          id: da.id,
          name: part,
          slug: idx > 0 ? `${da.slug}-${idx}` : da.slug,
          category: da.category,
          cityName: cityObj ? cityObj.name : '',
          description: da.description
        }));
      }
      
      return [{
        id: da.id,
        name: da.name,
        slug: da.slug,
        category: da.category,
        cityName: cityObj ? cityObj.name : '',
        description: da.description
      }];
    });

    // Supplement with static knowledge base entries not already in DB results
    const countryNorm = country.name.toLowerCase().trim();
    for (const cityKey in attractionKnowledgeBase) {
      // Find if this city belongs to this country
      const belongsToCountry = (citiesRes.data || []).some(c => {
        const normC = c.name.toLowerCase().replace(/[^a-z0-9]/g, '');
        const normKey = cityKey.toLowerCase().replace(/[^a-z0-9]/g, '');
        return normC.includes(normKey) || normKey.includes(normC);
      });

      if (!belongsToCountry) continue;

      const kbAttractions = attractionKnowledgeBase[cityKey];
      kbAttractions.forEach(a => {
        if (!attractionsList.some(existing => existing.name.toLowerCase() === a.name.toLowerCase())) {
          attractionsList.push({
            id: a.id,
            name: a.name,
            slug: a.id,
            category: a.category,
            cityName: a.cityName || cityKey,
            image: a.image,
            description: a.description || '',
            rating: a.rating,
            reviewsCount: a.reviewsCount
          });
        }
      });
    }

    return {
      id: country.id,
      name: country.name,
      slug: country.slug,
      flag: country.flag,
      iso2: country.iso2,
      iso3: country.iso3,
      continent: country.continent,
      region: country.region,
      subregion: country.subregion,
      capital: country.capital,
      states: statesRes.data || [],
      cities: (citiesRes.data || []).map(c => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        stateId: c.state_id,
        stateName: c.state_name,
        isCapital: c.is_capital
      })),
      attractions: attractionsList
    };
  } catch (err) {
    console.error('Error fetching country by slug:', err);
    return null;
  }
}

export async function getStateBySlug(slug) {
  try {
    // 1. Fetch state
    const { data: state, error: sErr } = await supabase
      .from('states')
      .select('*')
      .eq('slug', slug)
      .single();

    if (sErr || !state) return null;

    // 2. Fetch parent country
    const { data: country } = await supabase
      .from('countries')
      .select('name, slug, flag')
      .eq('id', state.country_id)
      .single();

    // 3. Fetch cities
    const { data: cities } = await supabase
      .from('cities')
      .select('id, name, slug, is_capital')
      .eq('state_id', state.id);

    // 4. Fetch attractions page-by-page — NO LIMIT
    let dbAttractions = [];
    let page = 0;
    const pageSize = 1000;
    const cityIds = (cities || []).map(c => c.id);
    
    if (cityIds.length > 0) {
      while (true) {
        const { data, error } = await supabase
          .from('attractions')
          .select('id, name, slug, category, city_id, description')
          .in('city_id', cityIds)
          .range(page * pageSize, (page + 1) * pageSize - 1);
          
        if (error || !data || data.length === 0) break;
        dbAttractions = dbAttractions.concat(data);
        if (data.length < pageSize) break;
        page++;
      }
    }

    return {
      id: state.id,
      countryId: state.country_id,
      countryName: state.country_name,
      name: state.name,
      slug: state.slug,
      country: country ? { name: country.name, slug: country.slug, flag: country.flag } : null,
      cities: (cities || []).map(c => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        isCapital: c.is_capital
      })),
      attractions: (dbAttractions || []).flatMap(a => {
        let cleanName = (a.name || '').replace(/\s+/g, ' ').trim();
        if (/^1\.\s+/.test(cleanName)) {
          cleanName = cleanName.replace(/^1\.\s+/, '');
        }
        
        const cityObj = (cities || []).find(c => c.id === a.city_id);
        
        if (/\s+\d+\.\s+/.test(cleanName)) {
          const parts = cleanName.split(/\s+\d+\.\s+/).map(p => p.trim()).filter(Boolean);
          return parts.map((part, idx) => ({
            id: a.id,
            name: part,
            slug: idx > 0 ? `${a.slug}-${idx}` : a.slug,
            category: a.category,
            cityName: cityObj ? cityObj.name : '',
            description: a.description
          }));
        }
        
        return [{
          id: a.id,
          name: a.name,
          slug: a.slug,
          category: a.category,
          cityName: cityObj ? cityObj.name : '',
          description: a.description
        }];
      })
    };
  } catch (err) {
    console.error('Error fetching state by slug:', err);
    return null;
  }
}

export async function getCityBySlug(slug) {
  try {
    // 1. Fetch city
    const { data: city, error: cErr } = await supabase
      .from('cities')
      .select('*')
      .eq('slug', slug)
      .single();

    if (cErr || !city) return null;

    // 2. Fetch parent country and state
    const [countryRes, stateRes] = await Promise.all([
      supabase.from('countries').select('name, slug, flag, iso2').eq('id', city.country_id).single(),
      supabase.from('states').select('name, slug').eq('id', city.state_id).single()
    ]);

    const country = countryRes.data;
    const state = stateRes.data;

    // 3. Fetch ALL attractions in this city from Supabase (Primary Source of Truth)
    let dbAttrData = [];
    let page = 0;
    const pageSize = 1000;
    while (true) {
      const { data, error } = await supabase
        .from('attractions')
        .select('id, name, slug, category, description')
        .eq('city_id', city.id)
        .range(page * pageSize, (page + 1) * pageSize - 1);
        
      if (error || !data || data.length === 0) break;
      dbAttrData = dbAttrData.concat(data);
      if (data.length < pageSize) break;
      page++;
    }

    const attractions = (dbAttrData || []).flatMap(da => {
      let cleanName = (da.name || '').replace(/\s+/g, ' ').trim();
      if (/^1\.\s+/.test(cleanName)) {
        cleanName = cleanName.replace(/^1\.\s+/, '');
      }
      
      if (/\s+\d+\.\s+/.test(cleanName)) {
        const parts = cleanName.split(/\s+\d+\.\s+/).map(p => p.trim()).filter(Boolean);
        return parts.map((part, idx) => ({
          id: da.id,
          name: part,
          slug: idx > 0 ? `${da.slug}-${idx}` : da.slug,
          category: da.category,
          description: da.description
        }));
      }
      
      return [{
        id: da.id,
        name: da.name,
        slug: da.slug,
        category: da.category,
        description: da.description
      }];
    });

    // Supplement with static knowledge base if DB returned few/no results
    const normSlug = slug.toLowerCase().replace(/[^a-z0-9]/g, '');
    const kbKey = Object.keys(attractionKnowledgeBase).find(key => {
      const normKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
      return normSlug === normKey || normSlug.includes(normKey) || normKey.includes(normSlug) || (normSlug === 'sf' && normKey === 'sanfrancisco') || (normSlug === 'saintlouis' && normKey === 'stlouis');
    });
    if (kbKey) {
      attractionKnowledgeBase[kbKey].forEach(a => {
        if (!attractions.some(existing => existing.name.toLowerCase() === a.name.toLowerCase())) {
          attractions.push({
            id: a.id,
            name: a.name,
            slug: a.id,
            category: a.category,
            image: a.image,
            description: a.description || '',
            rating: a.rating,
            reviewsCount: a.reviewsCount
          });
        }
      });
    }

    // 4. Find nearby cities (in the same state or same country)
    const { data: nearby } = await supabase
      .from('cities')
      .select('id, name, slug, state_name, country_name')
      .neq('id', city.id)
      .or(`state_id.eq.${city.state_id},country_id.eq.${city.country_id}`)
      .limit(5);

    return {
      id: city.id,
      countryId: city.country_id,
      stateId: city.state_id,
      countryName: city.country_name,
      stateName: city.state_name,
      name: city.name,
      slug: city.slug,
      isCapital: city.is_capital,
      attractionMode: city.attraction_mode,
      country: country ? { name: country.name, slug: country.slug, flag: country.flag, code: country.iso2 } : null,
      state: state ? { name: state.name, slug: state.slug } : null,
      attractions: attractions || [],
      nearby: (nearby || []).map(n => ({
        id: n.id,
        name: n.name,
        slug: n.slug,
        stateName: n.state_name,
        countryName: n.country_name
      }))
    };
  } catch (err) {
    console.error('Error fetching city by slug:', err);
    return null;
  }
}

function parseSplitSlug(slug) {
  const match = slug.match(/-(\d+)$/);
  if (match) {
    const index = parseInt(match[1], 10);
    const baseSlug = slug.substring(0, slug.lastIndexOf(`-${match[1]}`));
    return { baseSlug, index };
  }
  return { baseSlug: slug, index: 0 };
}

export async function getAttractionBySlug(slug) {
  try {
    const lookupSlug = (slug || '').toLowerCase().trim();
    // 1. Search in attractionKnowledgeBase first
    for (const cityKey in attractionKnowledgeBase) {
      const list = attractionKnowledgeBase[cityKey];
      const matched = list.find(a => 
        a.id.toLowerCase() === lookupSlug || 
        a.id.replace('attr-', '').toLowerCase() === lookupSlug || 
        a.name.toLowerCase() === lookupSlug.replace(/-/g, ' ')
      );

      if (matched) {
        let cityName = matched.cityName || cityKey;
        let citySlug = cityKey;
        let countryName = "USA";
        let countrySlug = "usa";
        let countryFlag = "🇺🇸";
        let stateName = "";
        let stateSlug = "";

        const { data: dbCity } = await supabase
          .from('cities')
          .select('name, slug, country_name, state_name, country_id, state_id')
          .or(`slug.eq.${cityKey},slug.eq.${cityKey.replace(/([a-z])([A-Z])/g, '$1-$2')}`)
          .limit(1)
          .maybeSingle();

        if (dbCity) {
          cityName = dbCity.name;
          citySlug = dbCity.slug;
          countryName = dbCity.country_name;
          countrySlug = dbCity.country_name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
          stateName = dbCity.state_name || "";
          stateSlug = dbCity.state_name ? dbCity.state_name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : "";

          if (dbCity.country_id) {
            const { data: dbCountry } = await supabase
              .from('countries')
              .select('flag, slug')
              .eq('id', dbCity.country_id)
              .maybeSingle();
            if (dbCountry) {
              countryFlag = dbCountry.flag;
              if (dbCountry.slug) countrySlug = dbCountry.slug;
            }
          }
        } else {
          if (cityKey === 'lahore') {
            cityName = "Lahore";
            citySlug = "lahore";
            countryName = "Pakistan";
            countrySlug = "pakistan";
            countryFlag = "🇵🇰";
            stateName = "Punjab";
            stateSlug = "punjab";
          } else if (cityKey === 'sanfrancisco') {
            cityName = "San Francisco";
            citySlug = "san-francisco";
            countryName = "USA";
            countrySlug = "usa";
            countryFlag = "🇺🇸";
            stateName = "California";
            stateSlug = "california";
          } else if (cityKey === 'stlouis') {
            cityName = "St. Louis";
            citySlug = "st-louis";
            countryName = "USA";
            countrySlug = "usa";
            countryFlag = "🇺🇸";
            stateName = "Missouri";
            stateSlug = "missouri";
          }
        }

        return {
          id: matched.id,
          cityId: cityKey,
          name: matched.name,
          slug: matched.id,
          category: matched.category,
          description: matched.description,
          longDescription: matched.longDescription,
          historicalInfo: matched.historicalInfo,
          whyImportant: matched.whyImportant,
          visitDuration: matched.visitDuration,
          bestTimeToVisit: matched.bestTimeToVisit,
          touristPriorityScore: matched.touristPriorityScore,
          technologyRelevance: matched.technologyRelevance,
          cultureRelevance: matched.cultureRelevance,
          website: matched.website,
          rating: matched.rating,
          reviewsCount: matched.reviewsCount,
          reviews: matched.reviews,
          tags: matched.tags,
          image: matched.image,
          images: matched.images,
          coordinates: { lat: matched.lat, lng: matched.lng },
          city: { name: cityName, slug: citySlug },
          state: { name: stateName, slug: stateSlug },
          country: { name: countryName, slug: countrySlug, flag: countryFlag }
        };
      }
    }

    const { baseSlug, index: splitIdx } = parseSplitSlug(lookupSlug);

    const { data: attraction, error: aErr } = await supabase
      .from('attractions')
      .select('*')
      .eq('slug', baseSlug)
      .single();

    if (aErr || !attraction) return null;

    let attractionName = attraction.name;
    let cleanName = attractionName.replace(/\s+/g, ' ').trim();
    if (/^1\.\s+/.test(cleanName)) {
      cleanName = cleanName.replace(/^1\.\s+/, '');
    }
    
    if (/\s+\d+\.\s+/.test(cleanName)) {
      const parts = cleanName.split(/\s+\d+\.\s+/).map(p => p.trim()).filter(Boolean);
      if (splitIdx < parts.length) {
        attractionName = parts[splitIdx];
      }
    }

    // Fetch parent hierarchy
    const { data: city } = await supabase
      .from('cities')
      .select('name, slug, country_id, state_id')
      .eq('id', attraction.city_id)
      .single();

    let state = null;
    let country = null;

    if (city) {
      const [countryRes, stateRes] = await Promise.all([
        supabase.from('countries').select('name, slug, flag').eq('id', city.country_id).single(),
        supabase.from('states').select('name, slug').eq('id', city.state_id).single()
      ]);
      country = countryRes.data;
      state = stateRes.data;
    }

    let parsedDesc = {};
    try {
      if (attraction.description && attraction.description.startsWith('{')) {
        parsedDesc = JSON.parse(attraction.description);
      }
    } catch (e) {
      console.warn("Failed to parse description JSON", e);
    }

    return {
      id: attraction.id,
      cityId: attraction.city_id,
      name: attractionName,
      slug: lookupSlug,
      category: attraction.category,
      description: parsedDesc.description || attraction.description,
      image: parsedDesc.image || '',
      images: parsedDesc.images || (parsedDesc.image ? [parsedDesc.image] : []),
      longDescription: parsedDesc.longDescription || '',
      historicalInfo: parsedDesc.historicalInfo || '',
      whyImportant: parsedDesc.whyImportant || '',
      visitDuration: parsedDesc.visitDuration || '',
      bestTimeToVisit: parsedDesc.bestTimeToVisit || '',
      rating: parsedDesc.rating || 4.5,
      reviewsCount: parsedDesc.reviewsCount || 100,
      reviews: parsedDesc.reviews || [],
      tags: parsedDesc.tags || [],
      seoTitle: parsedDesc.seoTitle || '',
      seoDescription: parsedDesc.seoDescription || '',
      coordinates: attraction.latitude && attraction.longitude 
        ? { lat: parseFloat(attraction.latitude), lng: parseFloat(attraction.longitude) }
        : null,
      city: city ? { name: city.name, slug: city.slug } : null,
      state: state ? { name: state.name, slug: state.slug } : null,
      country: country ? { name: country.name, slug: country.slug, flag: country.flag } : null
    };
  } catch (err) {
    console.error('Error fetching attraction by slug:', err);
    return null;
  }
}
