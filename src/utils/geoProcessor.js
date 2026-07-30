/**
 * Deduplicates places based on place_id first, falling back to normalized name matching.
 * Handles localized name objects, numbers, and null/undefined values safely.
 */
export const deduplicatePlaces = (places) => {
  const seenIds = new Set();
  const seenNames = new Set();
  const unique = [];

  for (const place of places) {
    if (!place) continue;
    const props = place.properties || {};
    const id = props.place_id || place.id || '';
    
    // Resolve name robustly in case it's an object or other type
    let name = '';
    if (props.name) {
      name = typeof props.name === 'object' ? (props.name.en || Object.values(props.name)[0] || '') : props.name;
    } else if (props.street) {
      name = typeof props.street === 'object' ? (props.street.en || Object.values(props.street)[0] || '') : props.street;
    }
    name = String(name || '').trim();

    if (!name || name.toLowerCase().includes('unknown') || name.toLowerCase().includes('landmark')) {
      continue;
    }

    const normName = name.toLowerCase();
    
    // Check ID first
    if (id && seenIds.has(id)) {
      continue;
    }
    // Check name fallback
    if (seenNames.has(normName)) {
      continue;
    }

    if (id) seenIds.add(id);
    seenNames.add(normName);
    unique.push(place);
  }

  return unique;
};

/**
 * Classifies hospital items into public vs. private.
 * Prioritizes structured Geoapify category values, falling back to name keywords second.
 * Handles localized name objects safely.
 */
export const classifyHospitalType = (hosp) => {
  const props = hosp.properties || {};
  const categories = props.categories || [];
  
  // Resolve name robustly
  let name = '';
  if (props.name) {
    name = typeof props.name === 'object' ? (props.name.en || Object.values(props.name)[0] || '') : props.name;
  } else if (props.street) {
    name = typeof props.street === 'object' ? (props.street.en || Object.values(props.street)[0] || '') : props.street;
  }
  name = String(name || '').trim();
  const nameLower = name.toLowerCase();

  // 1. Prioritize structured Geoapify categories
  if (categories.includes('healthcare.hospital.public')) {
    return { isPublic: true, label: 'Best Government General Hospital' };
  }
  if (categories.includes('healthcare.hospital.private')) {
    return { isPublic: false, label: 'Best Private Specialist Hospital' };
  }

  // 2. Secondary fallback: Heuristic keyword check
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

  const hasPublicKw = publicKeywords.some(kw => nameLower.includes(kw));
  if (hasPublicKw) {
    return { isPublic: true, label: 'Best Government General Hospital' };
  }

  return { isPublic: false, label: 'Best Private Specialist Hospital' };
};
