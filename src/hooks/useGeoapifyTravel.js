import { useState, useEffect, useCallback, useRef } from 'react';
import { getCoordinates, getAttractions, getHospitals } from '../services/geoapifyService';
import {
  googleGetCoordinates,
  googleGetAttractions,
  googleGetHospitals,
  googleGetPlaceDetails
} from '../services/googlePlacesService';
import { deduplicatePlaces } from '../utils/geoProcessor';
import { calculateDistance, rankAttractions, rankAndClassifyHospitals } from '../engine/travelEngine';
import { getCache, setCache, invalidateCache } from '../cache/geoCache';
import { cityDatabase } from '../data/cityDatabase';
import { getPoiAttractions } from '../services/poiSearchService';

/**
 * Resolves coordinates locally from the city database.
 */
const getLocalCoords = (name, country) => {
  const destName = (name || '').toLowerCase().trim();
  const destCountry = (country || '').toLowerCase().trim().replace(/ /g, '_');

  // Check city database by country
  const countryCities = cityDatabase[destCountry];
  if (countryCities) {
    const match = countryCities.find(c => c.name.toLowerCase() === destName);
    if (match) return { lat: match.lat, lng: match.lng };
  }

  // Check all cities globally
  for (const key in cityDatabase) {
    const match = cityDatabase[key].find(c => c.name.toLowerCase() === destName);
    if (match) return { lat: match.lat, lng: match.lng };
  }

  return null;
};

const GOOGLE_PLACES_API_KEY = 'AIzaSyBVdC9yOe8hrcCH_PunfApQKbR1gzrR348';
const isGoogleKeyDummy = !GOOGLE_PLACES_API_KEY || GOOGLE_PLACES_API_KEY.startsWith('AIzaSyBVdC9yOe');

/**
 * Maps Google Place Types to TripReady Categories.
 */
const mapGoogleTypeToCategory = (types = []) => {
  if (types.includes('museum')) return 'Museum';
  if (types.includes('park')) return 'National Park';
  if (types.includes('amusement_park')) return 'Amusement Park';
  if (types.includes('aquarium') || types.includes('zoo')) return 'Zoo';
  if (
    types.includes('place_of_worship') ||
    types.includes('church') ||
    types.includes('mosque') ||
    types.includes('hindu_temple') ||
    types.includes('synagogue')
  ) {
    return 'Heritage Site';
  }
  if (types.includes('natural_feature')) return 'Viewpoint';
  if (types.includes('art_gallery')) return 'Landmark';
  if (types.includes('tourist_attraction')) return 'Attraction';
  return 'Attraction';
};

/**
 * Computes score for a Google Place based on distance and rating.
 */
const computeGoogleScore = (place, centerLat, centerLng) => {
  const lat = typeof place.geometry.location.lat === 'function' ? place.geometry.location.lat() : place.geometry.location.lat;
  const lng = typeof place.geometry.location.lng === 'function' ? place.geometry.location.lng() : place.geometry.location.lng;
  const distance = calculateDistance(centerLat, centerLng, lat, lng);

  // Proximity score (0 to 1 decay)
  const distanceScore = Math.exp(-distance / 8.0);

  // Rating score (0 to 1) - default to 4.2 rating if undefined
  const rating = place.rating || 4.2;
  const ratingScore = rating / 5.0;

  // Weights: 60% distance, 40% rating
  const score = distanceScore * 0.6 + ratingScore * 0.4;

  return { distance, score };
};

/**
 * Formats Google Places Attractions.
 */
const formatGoogleAttractions = (places, center) => {
  const scored = places.map((p) => {
    const { distance, score } = computeGoogleScore(p, center.lat, center.lng);
    return { place: p, distance, score };
  });

  scored.sort((a, b) => b.score - a.score);

  // Filter for quality: must have rating and at least 5 reviews
  const qualityPlaces = scored.filter(
    (item) => item.place.rating && item.place.user_ratings_total && item.place.user_ratings_total >= 5
  );

  // Fallback to original scored list if we have too few quality places
  const finalPlaces = qualityPlaces.length >= 3 ? qualityPlaces : scored;

  return finalPlaces.map((item, idx) => {
    const p = item.place;
    const lat = typeof p.geometry.location.lat === 'function' ? p.geometry.location.lat() : p.geometry.location.lat;
    const lng = typeof p.geometry.location.lng === 'function' ? p.geometry.location.lng() : p.geometry.location.lng;

    let imageUrl = '';
    if (p.photos && p.photos.length > 0) {
      if (typeof p.photos[0].getUrl === 'function') {
        imageUrl = p.photos[0].getUrl({ maxWidth: 800, maxHeight: 600 });
      } else {
        imageUrl = p.photos[0].url || '';
      }
    }

    return {
      id: p.place_id || `google-attr-${idx}`,
      name: p.name || 'Attraction Site',
      category: mapGoogleTypeToCategory(p.types),
      address: p.vicinity || 'Nearby Central',
      lat,
      lng,
      distance: `${item.distance.toFixed(1)} km from center`,
      rawDistance: item.distance,
      description: p.rating
        ? `Google Rated: ${p.rating}★ (${p.user_ratings_total || 0} reviews). A top local landmark.`
        : 'A highly recommended local attraction.',
      image: imageUrl,
      website: null,
      phone: null,
      score: item.score
    };
  });
};

/**
 * Formats Google Places Hospitals.
 */
const formatGoogleHospitals = (places, center) => {
  const scored = places.map((p) => {
    const { distance, score } = computeGoogleScore(p, center.lat, center.lng);
    return { place: p, distance, score };
  });

  scored.sort((a, b) => b.score - a.score);

  // Filter out irrelevant animal clinics, dentists, orthodontists, etc.
  const blacklistKeywords = ['veterinary', 'vet ', 'animal', 'pet ', 'dentist', 'dental', 'orthodontist'];
  const filteredScored = scored.filter((item) => {
    const nameLower = (item.place.name || '').toLowerCase();
    return !blacklistKeywords.some((kw) => nameLower.includes(kw));
  });

  const finalPlaces = filteredScored.length >= 3 ? filteredScored : scored;

  return finalPlaces.map((item, idx) => {
    const p = item.place;
    const lat = typeof p.geometry.location.lat === 'function' ? p.geometry.location.lat() : p.geometry.location.lat;
    const lng = typeof p.geometry.location.lng === 'function' ? p.geometry.location.lng() : p.geometry.location.lng;

    const nameLower = (p.name || '').toLowerCase();
    const publicKeywords = [
      'general',
      'public',
      'government',
      'state',
      'civil',
      'municipal',
      'district',
      'national',
      'nhs',
      'mayo',
      'university',
      'county',
      'clinical',
      'charity'
    ];
    const isPublic = publicKeywords.some((kw) => nameLower.includes(kw));
    const typeLabel = isPublic ? 'Government General Hospital' : 'Private Specialist Clinic';

    return {
      id: p.place_id || `google-hosp-${idx}`,
      name: p.name || 'Medical Center',
      type: p.rating ? `${typeLabel} (Google: ${p.rating}★)` : typeLabel,
      isPublic,
      address: p.vicinity || 'Hospital Parkway',
      lat,
      lng,
      distance: `${item.distance.toFixed(1)} km from center`,
      rawDistance: item.distance,
      phone: null,
      website: null,
      hours: 'Emergency 24/7 Open',
      score: item.score
    };
  });
};

export const useGeoapifyTravel = (destination) => {
  const [geoCoords, setGeoCoords] = useState(null);
  const [attractions, setAttractions] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [uiState, setUiState] = useState('loading'); // 'loading' | 'cached' | 'success' | 'error' | 'empty'
  const [error, setError] = useState(null);
  const [isBackgroundValidating, setIsBackgroundValidating] = useState(false);
  const [forceFetchTrigger, setForceFetchTrigger] = useState(0);

  const abortControllerRef = useRef(null);
  const lastRequestTimeRef = useRef(0);

  const retryFetch = useCallback(() => {
    if (destination && destination.id) {
      invalidateCache(destination.id);
    }
    setForceFetchTrigger((prev) => prev + 1);
  }, [destination]);

  // Performs parallel attractions/hospitals fetch with exponential backoff retries (max 3)
  const fetchPlacesWithBackoff = async (coords, signal) => {
    let delay = 1000; // start with 1s delay
    const maxAttempts = 3;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const [rawAttr, rawHosp] = await Promise.all([
          getAttractions(coords.lat, coords.lng, signal),
          getHospitals(coords.lat, coords.lng, signal)
        ]);
        return [rawAttr, rawHosp];
      } catch (err) {
        if (err.name === 'AbortError' || attempt === maxAttempts) {
          throw err;
        }
        console.warn(`Geoapify places attempt ${attempt} failed. Retrying in ${delay}ms...`, err);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2; // exponential backoff
      }
    }
  };

  /**
   * Fetches Google Place Details (phone, website, hours) dynamically and updates state/cache.
   */
  const loadDetailsForPlace = useCallback(
    async (placeId, type) => {
      // Check if details are already loaded in current state
      if (type === 'attraction') {
        const existing = attractions.find((a) => a.id === placeId);
        if (existing && (existing.phone || existing.website)) return;
      } else {
        const existing = hospitals.find((h) => h.id === placeId);
        if (existing && (existing.phone || existing.website)) return;
      }

      try {
        const details = await googleGetPlaceDetails(placeId, GOOGLE_PLACES_API_KEY);

        const updateList = (prevList) =>
          prevList.map((item) =>
            item.id === placeId
              ? {
                  ...item,
                  phone: details.phone,
                  website: details.website,
                  address: details.address || item.address,
                  hours: details.hours || item.hours
                }
              : item
          );

        if (type === 'attraction') {
          setAttractions(updateList);
        } else {
          setHospitals(updateList);
        }

        // Update the cache as well so the details persist on page reloads
        const destinationId = destination.id || destination.name;
        const cached = getCache(destinationId);
        if (cached && cached.data) {
          if (type === 'attraction') {
            cached.data.attractions = updateList(cached.data.attractions);
          } else {
            cached.data.hospitals = updateList(cached.data.hospitals);
          }
          setCache(destinationId, cached.data);
        }
      } catch (err) {
        console.warn('Failed to fetch Google Place details dynamically:', err);
      }
    },
    [attractions, hospitals, destination]
  );

  useEffect(() => {
    if (!destination || !destination.name) return;

    // 1. Abort any active requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const currentRequestTime = Date.now();
    lastRequestTimeRef.current = currentRequestTime;

    const destinationId = destination.id || destination.name;
    const query = `${destination.name}, ${destination.country || ''}`;

    async function load() {
      setError(null);

      // Check cache (skip if forceFetchTrigger was bumped)
      const cached = forceFetchTrigger === 0 ? getCache(destinationId) : null;

      if (cached && cached.data) {
        // Cache exists: immediately render cached data
        setGeoCoords(cached.data.geoCoords);
        setAttractions(cached.data.attractions);
        setHospitals(cached.data.hospitals);

        if (cached.isExpired) {
          // Cache is stale: transition to CACHED and revalidate in background
          setUiState('cached');
          setIsBackgroundValidating(true);
        } else {
          // Cache is valid: SUCCESS
          setUiState(
            cached.data.attractions.length === 0 && cached.data.hospitals.length === 0 ? 'empty' : 'success'
          );
          setIsBackgroundValidating(false);
          return;
        }
      } else {
        // Cache miss: LOADING state
        setUiState('loading');
        setIsBackgroundValidating(false);
      }

      try {
        let coords = null;
        let attractionsList = [];
        let hospitalsList = [];

        // Check if destination itself has coordinates or check locally first
        if (destination.latitude && destination.longitude) {
          coords = { lat: Number(destination.latitude), lng: Number(destination.longitude) };
        } else {
          coords = getLocalCoords(destination.name, destination.country);
        }

        if (!coords) {
          if (!isGoogleKeyDummy) {
            try {
              coords = await googleGetCoordinates(query, GOOGLE_PLACES_API_KEY);
            } catch (gCoordsErr) {
              try {
                coords = await getCoordinates(query, controller.signal);
              } catch (geoCoordsErr) {
                console.error('Failed to resolve coordinates:', geoCoordsErr);
              }
            }
          } else {
            try {
              coords = await getCoordinates(query, controller.signal);
            } catch (geoCoordsErr) {
              console.error('Failed to resolve coordinates:', geoCoordsErr);
            }
          }
        }

        if (coords) {
          // 1. Try private POI search engine service first
          let poiAttractions = null;
          try {
            poiAttractions = await getPoiAttractions(coords.lat, coords.lng, destination.name, destination.country);
          } catch (poiErr) {
            console.warn('Private POI search service failed:', poiErr);
          }

          if (poiAttractions && poiAttractions.length > 0) {
            attractionsList = poiAttractions;
            // Fetch hospitals from Google Places or Geoapify since POI service is for attractions only
            if (!isGoogleKeyDummy) {
              try {
                const rawHosp = await googleGetHospitals(coords.lat, coords.lng, GOOGLE_PLACES_API_KEY);
                hospitalsList = formatGoogleHospitals(rawHosp, coords);
              } catch (hErr) {
                try {
                  const rawHosp = await getHospitals(coords.lat, coords.lng, controller.signal);
                  const deduplicatedHosp = deduplicatePlaces(rawHosp);
                  hospitalsList = rankAndClassifyHospitals(deduplicatedHosp, coords);
                } catch (geoHospErr) {
                  console.warn('Hospitals fetch failed:', geoHospErr);
                }
              }
            } else {
              try {
                const rawHosp = await getHospitals(coords.lat, coords.lng, controller.signal);
                const deduplicatedHosp = deduplicatePlaces(rawHosp);
                hospitalsList = rankAndClassifyHospitals(deduplicatedHosp, coords);
              } catch (geoHospErr) {
                console.warn('Hospitals fetch failed:', geoHospErr);
              }
            }
          } else {
            // 2. Google Places Fallback
            if (!isGoogleKeyDummy) {
              try {
                const [rawAttr, rawHosp] = await Promise.all([
                  googleGetAttractions(coords.lat, coords.lng, GOOGLE_PLACES_API_KEY),
                  googleGetHospitals(coords.lat, coords.lng, GOOGLE_PLACES_API_KEY)
                ]);

                attractionsList = formatGoogleAttractions(rawAttr, coords);
                hospitalsList = formatGoogleHospitals(rawHosp, coords);
                console.log(`Successfully fetched and ranked via Google Places API for: ${query}`);
              } catch (gErr) {
                // 3. Geoapify Fallback
                console.warn('Google Places API search failed, falling back to Geoapify:', gErr);
                try {
                  const [rawAttr, rawHosp] = await fetchPlacesWithBackoff(coords, controller.signal);

                  const deduplicatedAttr = deduplicatePlaces(rawAttr);
                  attractionsList = rankAttractions(deduplicatedAttr, coords);

                  const deduplicatedHosp = deduplicatePlaces(rawHosp);
                  hospitalsList = rankAndClassifyHospitals(deduplicatedHosp, coords);
                } catch (geoErr) {
                  console.error('All fallbacks failed for attractions and hospitals:', geoErr);
                  throw geoErr;
                }
              }
            } else {
              // Geoapify directly
              try {
                const [rawAttr, rawHosp] = await fetchPlacesWithBackoff(coords, controller.signal);

                const deduplicatedAttr = deduplicatePlaces(rawAttr);
                attractionsList = rankAttractions(deduplicatedAttr, coords);

                const deduplicatedHosp = deduplicatePlaces(rawHosp);
                hospitalsList = rankAndClassifyHospitals(deduplicatedHosp, coords);
              } catch (geoErr) {
                console.error('All fallbacks failed for attractions and hospitals:', geoErr);
                throw geoErr;
              }
            }
          }
        } else {
          throw new Error('Coordinates could not be resolved for destination');
        }

        // Check if a newer request has already been initiated
        if (currentRequestTime !== lastRequestTimeRef.current || controller.signal.aborted) {
          return; // Ignore stale background response
        }

        // Save fresh results to cache
        setCache(destinationId, {
          geoCoords: coords,
          attractions: attractionsList,
          hospitals: hospitalsList
        });

        setGeoCoords(coords);
        setAttractions(attractionsList);
        setHospitals(hospitalsList);
        setError(null);

        // Transition to success or empty
        setUiState(attractionsList.length === 0 && hospitalsList.length === 0 ? 'empty' : 'success');
      } catch (err) {
        if (err.name === 'AbortError') return;

        // Check if request is latest
        if (currentRequestTime !== lastRequestTimeRef.current) return;

        console.error('Unified travel fetching failed:', err);

        // If we are currently displaying cached data, keep it! Do not overwrite with error screen
        if (uiState !== 'cached') {
          setError(err.message || 'Failed to fetch destination data.');
          setUiState('error');
        } else {
          console.warn('Background revalidation failed. Maintaining cached offline view.');
        }
      } finally {
        if (currentRequestTime === lastRequestTimeRef.current && !controller.signal.aborted) {
          setIsBackgroundValidating(false);
        }
      }
    }

    load();

    return () => {
      controller.abort();
    };
  }, [destination, forceFetchTrigger]);

  return {
    geoCoords,
    attractions,
    hospitals,
    uiState,
    error,
    isBackgroundValidating,
    retryFetch,
    loadDetailsForPlace
  };
};
