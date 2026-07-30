/**
 * Fetch and parse country data from REST Countries API with caching and timeouts
 * @param {string} countryName Name of the country to fetch
 * @returns {Promise<import('../types/country').ParsedCountryFacts>}
 */
export async function fetchRestCountry(countryName) {
  const normalized = countryName.trim();
  if (!normalized) {
    throw new Error("Country name cannot be empty");
  }

  const cacheKey = `rest_country_v2_${normalized.toLowerCase().replace(/ /g, '_')}`;
  
  // 1. Try to read from cache (expires in 24 hours)
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      const CACHE_EXPIRATION = 24 * 60 * 60 * 1000; // 24 hours in ms
      if (Date.now() - parsed.timestamp < CACHE_EXPIRATION) {
        return parsed.data;
      }
    } catch (e) {
      console.warn("Failed to parse cached REST Countries data:", e);
    }
  }

  // 2. Set timeout of 5 seconds using AbortController
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const url = `https://restcountries.com/v3.1/name/${encodeURIComponent(normalized)}?fullText=true`;
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`REST Countries API responded with status ${response.status}`);
    }

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Empty or invalid response from REST Countries API");
    }

    const raw = data[0];

    // Safe currency parsing
    let currencyCode = 'N/A';
    let currencyName = 'N/A';
    let currencySymbol = '';
    if (raw.currencies) {
      const keys = Object.keys(raw.currencies);
      if (keys.length > 0) {
        currencyCode = keys[0];
        const cur = raw.currencies[currencyCode];
        currencyName = cur.name || 'N/A';
        currencySymbol = cur.symbol || '';
      }
    }

    // Safe capital parsing
    const capital = Array.isArray(raw.capital) && raw.capital.length > 0 ? raw.capital[0] : 'N/A';

    // Safe languages parsing
    let languages = 'N/A';
    if (raw.languages) {
      const langList = Object.values(raw.languages);
      if (langList.length > 1) {
        // Move English to the end so that native/national languages are prioritized first
        const englishIndex = langList.findIndex(l => l.toLowerCase() === 'english');
        if (englishIndex !== -1) {
          const [english] = langList.splice(englishIndex, 1);
          langList.push(english);
        }
      }
      languages = langList.join(', ');
    }

    // Safe timezones parsing
    const timezones = Array.isArray(raw.timezones) ? raw.timezones.join(', ') : 'N/A';

    // Safe driving side parsing
    const drivingSide = raw.car && raw.car.side 
      ? raw.car.side.charAt(0).toUpperCase() + raw.car.side.slice(1) 
      : 'Right';

    // Safe maps link parsing
    const mapLink = raw.maps ? raw.maps.googleMaps || raw.maps.openStreetMaps : '';

    const parsedData = {
      name: raw.name?.common || normalized,
      officialName: raw.name?.official || normalized,
      flagEmoji: raw.flag || '',
      flagImgUrl: raw.flags?.png || raw.flags?.svg || '',
      capital,
      currencyCode,
      currencyName,
      currencySymbol,
      languages,
      timezones,
      population: raw.population ? raw.population.toLocaleString() : 'N/A',
      drivingSide,
      mapLink,
      area: raw.area ? raw.area.toLocaleString() + ' km²' : 'N/A',
      cca2: raw.cca2 || ''
    };

    // Cache the result
    localStorage.setItem(cacheKey, JSON.stringify({
      timestamp: Date.now(),
      data: parsedData
    }));

    return parsedData;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error("REST Countries API request timed out after 5 seconds");
    }
    throw error;
  }
}
