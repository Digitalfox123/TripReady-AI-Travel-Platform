let googleMapsPromise = null;

/**
 * Dynamically loads the Google Maps JavaScript API script if not already present.
 */
export const loadGoogleMapsScript = (apiKey) => {
  if (window.google && window.google.maps) {
    return Promise.resolve(window.google.maps);
  }

  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    // Check if script tag already exists in the document
    const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
    if (existingScript) {
      if (window.google && window.google.maps) {
        resolve(window.google.maps);
        return;
      }

      const checkInterval = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(checkInterval);
          resolve(window.google.maps);
        }
      }, 100);

      existingScript.addEventListener('load', () => {
        clearInterval(checkInterval);
        if (window.google && window.google.maps) {
          resolve(window.google.maps);
        } else {
          reject(new Error('Google Maps script loaded but window.google.maps is undefined'));
        }
      });

      existingScript.addEventListener('error', (err) => {
        clearInterval(checkInterval);
        reject(err);
      });

      // 3-second timeout fallback (fast failover for blocked scripts or network issues)
      setTimeout(() => {
        clearInterval(checkInterval);
        if (window.google && window.google.maps) {
          resolve(window.google.maps);
        } else {
          reject(new Error('Timeout waiting for Google Maps script to load'));
        }
      }, 3000);
      return;
    }

    // Create a new script if none exists
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google && window.google.maps) {
        resolve(window.google.maps);
      } else {
        reject(new Error('Google Maps script loaded but window.google.maps is undefined'));
      }
    };
    script.onerror = (err) => {
      reject(err);
    };
    document.head.appendChild(script);
  });

  return googleMapsPromise;
};

/**
 * Geocodes a text query to coordinates { lat, lng } using Google Geocoder.
 * Timeout-safe: rejects after 3000ms if no callback triggers.
 */
export const googleGetCoordinates = async (query, apiKey) => {
  const maps = await loadGoogleMapsScript(apiKey);
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Google Geocoding timed out after 3000ms'));
    }, 3000);

    const geocoder = new maps.Geocoder();
    geocoder.geocode({ address: query }, (results, status) => {
      clearTimeout(timeout);
      if (status === maps.GeocoderStatus.OK && results && results[0]) {
        const location = results[0].geometry.location;
        resolve({
          lat: location.lat(),
          lng: location.lng()
        });
      } else {
        reject(new Error(`Google Geocoding failed with status: ${status}`));
      }
    });
  });
};

/**
 * Queries Google Places Nearby Search for attractions.
 * Timeout-safe: rejects after 3000ms if no callback triggers.
 */
export const googleGetAttractions = async (lat, lng, apiKey) => {
  const maps = await loadGoogleMapsScript(apiKey);
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Google Places attractions query timed out after 3000ms'));
    }, 3000);

    const dummyDiv = document.createElement('div');
    const service = new maps.places.PlacesService(dummyDiv);

    service.nearbySearch(
      {
        location: new maps.LatLng(lat, lng),
        radius: 20000, // 20km search radius
        type: 'tourist_attraction'
      },
      (results, status) => {
        clearTimeout(timeout);
        if (status === maps.places.PlacesServiceStatus.OK || status === maps.places.PlacesServiceStatus.ZERO_RESULTS) {
          resolve(results || []);
        } else {
          reject(new Error(`Google Places attractions query failed with status: ${status}`));
        }
      }
    );
  });
};

/**
 * Queries Google Places Nearby Search for hospitals.
 * Timeout-safe: rejects after 3000ms if no callback triggers.
 */
export const googleGetHospitals = async (lat, lng, apiKey) => {
  const maps = await loadGoogleMapsScript(apiKey);
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Google Places hospitals query timed out after 3000ms'));
    }, 3000);

    const dummyDiv = document.createElement('div');
    const service = new maps.places.PlacesService(dummyDiv);

    service.nearbySearch(
      {
        location: new maps.LatLng(lat, lng),
        radius: 20000, // 20km search radius
        type: 'hospital'
      },
      (results, status) => {
        clearTimeout(timeout);
        if (status === maps.places.PlacesServiceStatus.OK || status === maps.places.PlacesServiceStatus.ZERO_RESULTS) {
          resolve(results || []);
        } else {
          reject(new Error(`Google Places hospitals query failed with status: ${status}`));
        }
      }
    );
  });
};

/**
 * Fetches Place Details (phone, website, opening hours) for a specific place_id.
 */
export const googleGetPlaceDetails = async (placeId, apiKey) => {
  const maps = await loadGoogleMapsScript(apiKey);
  return new Promise((resolve, reject) => {
    const dummyDiv = document.createElement('div');
    const service = new maps.places.PlacesService(dummyDiv);

    service.getDetails(
      {
        placeId,
        fields: ['formatted_phone_number', 'website', 'opening_hours', 'formatted_address']
      },
      (result, status) => {
        if (status === maps.places.PlacesServiceStatus.OK) {
          resolve({
            phone: result.formatted_phone_number || null,
            website: result.website || null,
            hours: result.opening_hours ? (result.opening_hours.isOpen() ? 'Emergency 24/7 Open' : 'Open (Standard Hours)') : 'Open',
            address: result.formatted_address || null
          });
        } else {
          reject(new Error(`Google Place Details failed with status: ${status}`));
        }
      }
    );
  });
};
