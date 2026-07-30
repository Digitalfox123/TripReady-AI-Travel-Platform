import { useState, useEffect, useCallback, useRef } from 'react';
import { getCoordinates, getAttractions, getHospitals } from '../services/geoapifyService';
import { deduplicatePlaces, sortByRelevance, classifyHospitals } from '../utils/geoProcessor';
import { getCache, setCache } from '../utils/cache';
import { askGemini, hasGeminiKey } from '../utils/gemini';

/**
 * Custom hook to load, process, cache, and retry Geoapify data.
 */
export const useGeoapifyData = (destination) => {
  const [geoCoords, setGeoCoords] = useState(null);
  const [attractions, setAttractions] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [source, setSource] = useState('api'); // 'api' | 'cache'
  const [retryTrigger, setRetryTrigger] = useState(0);

  const abortControllerRef = useRef(null);

  const retryFetch = useCallback(() => {
    setRetryTrigger((prev) => prev + 1);
  }, []);

  const enrichDescriptions = async (items, cityName, hasKey) => {
    if (!hasKey) return items;

    // Only enrich top 6 to prevent performance issues and rate limits
    const enriched = await Promise.all(
      items.map(async (item, index) => {
        if (item.description || index >= 6) return item;

        try {
          const systemPrompt = "You are a professional travel writer. Write a concise, 1-sentence (max 15 words) travel description for this attraction.";
          const userPrompt = `Attraction Name: ${item.name}, City: ${cityName}, Category: ${item.category}.`;
          const geminiText = await askGemini(userPrompt, systemPrompt);
          if (geminiText) {
            return {
              ...item,
              description: geminiText.trim().replace(/^"|"$/g, '')
            };
          }
        } catch (e) {
          console.error(`Gemini enrichment failed for ${item.name}:`, e);
        }

        return item;
      })
    );

    return enriched;
  };

  useEffect(() => {
    if (!destination || !destination.name) return;

    // 1. Cancel previous pending requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const query = `${destination.name}, ${destination.country || ''}`;
    const destinationId = destination.id || destination.name;

    async function loadData() {
      setLoading(true);
      setError(null);

      // Check cache first (skip cache if retryTrigger changed)
      if (retryTrigger === 0) {
        const cached = getCache(destinationId);
        if (cached && cached.geoCoords) {
          setGeoCoords(cached.geoCoords);
          setAttractions(cached.attractions);
          setHospitals(cached.hospitals);
          setSource('cache');
          setLoading(false);
          return;
        }
      }

      try {
        // 2. Fetch City Center Coordinates
        const coords = await getCoordinates(query, controller.signal);
        setGeoCoords(coords);

        // 3. Parallel API Calls for Attractions & Hospitals
        const [rawAttractions, rawHospitals] = await Promise.all([
          getAttractions(coords.lat, coords.lng, controller.signal),
          getHospitals(coords.lat, coords.lng, controller.signal)
        ]);

        if (controller.signal.aborted) return;

        // 4. Processing & Normalization
        const uniqAttractions = deduplicatePlaces(rawAttractions);
        const sortedAttractions = sortByRelevance(uniqAttractions, coords);

        const uniqHospitals = deduplicatePlaces(rawHospitals);
        const classifiedHosp = classifyHospitals(uniqHospitals, coords);

        // 5. Enrich description with Gemini AI (if missing)
        const hasKey = hasGeminiKey();
        const finalAttractions = await enrichDescriptions(sortedAttractions, destination.name, hasKey);

        if (controller.signal.aborted) return;

        // Set state
        setAttractions(finalAttractions);
        setHospitals(classifiedHosp);
        setSource('api');
        setError(null);

        // 6. Save to Cache
        setCache(destinationId, {
          geoCoords: coords,
          attractions: finalAttractions,
          hospitals: classifiedHosp
        });
      } catch (err) {
        if (err.name === 'AbortError') {
          return; // Ignore abort exceptions
        }
        console.error('Failed to fetch Geoapify data:', err);
        setError(err.message || 'Failed to retrieve destination details.');
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      controller.abort();
    };
  }, [destination, retryTrigger]);

  return {
    geoCoords,
    attractions,
    hospitals,
    loading,
    error,
    source,
    retryFetch
  };
};
