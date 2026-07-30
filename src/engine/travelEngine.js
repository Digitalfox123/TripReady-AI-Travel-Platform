import { classifyHospitalType } from '../utils/geoProcessor';

/**
 * Calculates the distance between two coordinates in kilometers using the Haversine formula.
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Computes a deterministic score for a place based on:
 * - Exponential Proximity Decay (70%): score_dist = Math.exp(-distance / 8.0)
 * - Data Completeness (30%): +0.25 for each of address, phone, website, description
 */
export const computeScore = (place, center) => {
  const props = place.properties || {};
  const geom = place.geometry || {};
  const coords = geom.coordinates || [];
  const lng = coords[0] || center.lng;
  const lat = coords[1] || center.lat;

  const distance = calculateDistance(center.lat, center.lng, lat, lng);
  
  // 1. Exponential proximity decay (normalized between 0 and 1)
  const distanceScore = Math.exp(-distance / 8.0);

  // 2. Data Completeness (normalized between 0 and 1)
  let completeness = 0;
  if (props.formatted || props.address_line2) completeness += 0.25;
  if (props.datasource?.raw?.phone || props.contact?.phone) completeness += 0.25;
  if (props.datasource?.raw?.website || props.contact?.website) completeness += 0.25;
  if (props.description || props.details || props.wikidata) completeness += 0.25;

  const score = distanceScore * 0.7 + completeness * 0.3;

  return {
    distance,
    score
  };
};

/**
 * Ranks and formats attractions.
 */
export const rankAttractions = (places, center) => {
  const scored = places.map(p => {
    const { distance, score } = computeScore(p, center);
    return { place: p, distance, score };
  });

  // Sort descending by deterministic score
  scored.sort((a, b) => b.score - a.score);

  return scored.map((item, idx) => {
    const p = item.place;
    const props = p.properties || {};
    const geom = p.geometry || {};
    const coords = geom.coordinates || [];

    // Map categories
    let categoryTag = 'Attraction';
    const cats = props.categories || [];
    if (cats.includes('museum') || cats.includes('tourism.attraction.museum') || cats.includes('entertainment.museum')) categoryTag = 'Museum';
    else if (cats.includes('heritage') || cats.includes('heritage.unesco')) categoryTag = 'Heritage Site';
    else if (cats.includes('landmark') || cats.includes('tourism.sights') || cats.includes('tourism.attraction.artwork')) categoryTag = 'Landmark';
    else if (cats.includes('national_park')) categoryTag = 'National Park';
    else if (cats.includes('beach') || cats.includes('beach.beach_resort')) categoryTag = 'Beach';
    else if (cats.includes('viewpoint') || cats.includes('tourism.attraction.viewpoint')) categoryTag = 'Viewpoint';
    else if (cats.includes('zoo') || cats.includes('entertainment.zoo')) categoryTag = 'Zoo';
    else if (cats.includes('amusement_park') || cats.includes('entertainment.theme_park')) categoryTag = 'Amusement Park';
    else if (cats.includes('castle') || cats.includes('tourism.sights.castle')) categoryTag = 'Castle';
    else if (cats.includes('monument') || cats.includes('tourism.sights.monument') || cats.includes('tourism.sights.memorial.monument')) categoryTag = 'Monument';

    return {
      id: props.place_id || `attr-${idx}-${Math.random().toString(36).substr(2, 5)}`,
      name: props.name || props.street || 'Attraction Site',
      category: categoryTag,
      address: props.formatted || props.address_line2 || 'Nearby Central',
      lat: coords[1] || center.lat,
      lng: coords[0] || center.lng,
      distance: `${item.distance.toFixed(1)} km from center`,
      rawDistance: item.distance,
      description: props.description || '',
      image: props.image || '',
      website: props.datasource?.raw?.website || props.contact?.website || null,
      phone: props.datasource?.raw?.phone || props.contact?.phone || null,
      score: item.score
    };
  });
};

/**
 * Ranks, classifies and filters hospitals.
 */
export const rankAndClassifyHospitals = (places, center) => {
  const processed = places.map((p, idx) => {
    const props = p.properties || {};
    const geom = p.geometry || {};
    const coords = geom.coordinates || [];
    const { distance, score } = computeScore(p, center);

    const classification = classifyHospitalType(p);

    return {
      id: props.place_id || `hosp-${idx}-${Math.random().toString(36).substr(2, 5)}`,
      name: props.name || props.street || 'Medical Clinic',
      type: classification.label,
      isPublic: classification.isPublic,
      address: props.formatted || props.address_line2 || 'Hospital Parkway',
      lat: coords[1] || center.lat,
      lng: coords[0] || center.lng,
      distance: `${distance.toFixed(1)} km from center`,
      rawDistance: distance,
      phone: props.datasource?.raw?.phone || props.contact?.phone || null,
      website: props.datasource?.raw?.website || props.contact?.website || null,
      hours: 'Emergency 24/7 Open',
      score
    };
  });

  // Sort descending by score
  processed.sort((a, b) => b.score - a.score);

  return processed;
};
