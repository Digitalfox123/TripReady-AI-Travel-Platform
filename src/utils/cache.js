const TTL = 1000 * 60 * 60 * 24; // 24 hours in milliseconds

/**
 * Checks if a timestamp is still valid according to the TTL duration.
 */
export const isCacheValid = (timestamp) => {
  if (!timestamp) return false;
  return Date.now() - timestamp < TTL;
};

/**
 * Saves place data for a destination into localStorage.
 */
export const setCache = (destinationId, data) => {
  try {
    const cacheKey = `geoapify-data-${destinationId}`;
    const payload = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(cacheKey, JSON.stringify(payload));
  } catch (error) {
    console.error('Failed to set Geoapify cache:', error);
  }
};

/**
 * Retrieves cached place data for a destination, verifying TTL.
 * Returns the cached data object, or null if expired or not found.
 */
export const getCache = (destinationId) => {
  try {
    const cacheKey = `geoapify-data-${destinationId}`;
    const cached = localStorage.getItem(cacheKey);
    if (!cached) return null;

    const payload = JSON.parse(cached);
    if (isCacheValid(payload.timestamp)) {
      return payload.data;
    }

    // Cache expired: invalidate/remove
    localStorage.removeItem(cacheKey);
  } catch (error) {
    console.error('Failed to get Geoapify cache:', error);
  }
  return null;
};
