const TTL_MS = 1000 * 60 * 60 * 24; // 24 hours Time-To-Live

/**
 * Returns cache key formatted with versioning.
 */
const getVersionedKey = (destinationId) => {
  return `geoapify_v6_${destinationId}`;
};

/**
 * Validates cache record against TTL constraint.
 */
export const isCacheValid = (timestamp) => {
  if (!timestamp) return false;
  return Date.now() - timestamp < TTL_MS;
};

/**
 * Sets cache value with current timestamp.
 */
export const setCache = (destinationId, data) => {
  try {
    const key = getVersionedKey(destinationId);
    const payload = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(payload));
  } catch (error) {
    console.error('Failed to write Geoapify v3 cache:', error);
  }
};

/**
 * Retrieves cache payload if available.
 * Returns the object structure, or null.
 * Also returns { data, isExpired: boolean } for stale check.
 */
export const getCache = (destinationId) => {
  try {
    const key = getVersionedKey(destinationId);
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const payload = JSON.parse(cached);
    const isValid = isCacheValid(payload.timestamp);
    return {
      data: payload.data,
      isExpired: !isValid
    };
  } catch (error) {
    console.error('Failed to read Geoapify v3 cache:', error);
    return null;
  }
};

/**
 * Clear cache for specific destination.
 */
export const invalidateCache = (destinationId) => {
  try {
    const key = getVersionedKey(destinationId);
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to clear cache key:', error);
  }
};
