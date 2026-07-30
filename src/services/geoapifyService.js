const API_KEY = 'ed3fc44ceae0480db0a6cafdb9f39d1b';
const TIMEOUT_MS = 10000; // 10 seconds timeout

/**
 * Helper to fetch a URL with a timeout limit.
 */
const fetchWithTimeout = async (url, options = {}) => {
  const { signal, ...fetchOptions } = options;
  const controller = new AbortController();

  if (signal) {
    signal.addEventListener('abort', () => controller.abort());
  }

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, TIMEOUT_MS);

  try {
    const response = await fetch(url, { ...fetchOptions, signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

/**
 * Queries coordinates from Geoapify Geocoding API text search.
 * Returns { lat, lng } or throws an error.
 */
export const getCoordinates = async (query, signal) => {
  const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(query)}&apiKey=${API_KEY}`;
  const response = await fetchWithTimeout(url, { signal });
  if (!response.ok) {
    throw new Error(`Geocoding failed: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  if (data && data.features && data.features.length > 0) {
    const coords = data.features[0].geometry.coordinates;
    return {
      lng: coords[0],
      lat: coords[1]
    };
  }
  throw new Error('Coordinates not found');
};

/**
 * Fetches attractions near coordinates.
 */
export const getAttractions = async (lat, lng, signal) => {
  const categories = [
    'tourism.attraction',
    'entertainment',
    'heritage',
    'entertainment.museum',
    'national_park',
    'tourism.sights',
    'beach',
    'tourism.attraction.viewpoint',
    'entertainment.zoo',
    'entertainment.theme_park',
    'tourism.sights.castle',
    'tourism.sights.memorial.monument',
    'tourism.attraction.artwork'
  ].join(',');

  const url = `https://api.geoapify.com/v2/places?categories=${categories}&filter=circle:${lng},${lat},20000&bias=proximity:${lng},${lat}&limit=30&apiKey=${API_KEY}`;
  const response = await fetchWithTimeout(url, { signal });
  if (!response.ok) {
    throw new Error(`Attractions lookup failed: ${response.status}`);
  }
  const data = await response.json();
  return data.features || [];
};

/**
 * Fetches healthcare facilities near coordinates.
 */
export const getHospitals = async (lat, lng, signal) => {
  const url = `https://api.geoapify.com/v2/places?categories=healthcare.hospital&filter=circle:${lng},${lat},20000&bias=proximity:${lng},${lat}&limit=30&apiKey=${API_KEY}`;
  const response = await fetchWithTimeout(url, { signal });
  if (!response.ok) {
    throw new Error(`Hospitals lookup failed: ${response.status}`);
  }
  const data = await response.json();
  return data.features || [];
};
