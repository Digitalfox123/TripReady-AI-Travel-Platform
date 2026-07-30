const API_KEY = 'ed3fc44ceae0480db0a6cafdb9f39d1b';

async function test() {
  try {
    const query = 'Hunza Valley, Pakistan';
    console.log(`Testing Geocoding API for: ${query}`);
    const geoUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(query)}&apiKey=${API_KEY}`;
    const geoRes = await fetch(geoUrl);
    console.log('Geocoding Status:', geoRes.status);
    const geoData = await geoRes.json();
    
    if (geoData.features && geoData.features.length > 0) {
      const coords = geoData.features[0].geometry.coordinates;
      const lng = coords[0];
      const lat = coords[1];
      console.log(`Coords: lat=${lat}, lng=${lng}`);
      
      console.log('Testing Places API for Attractions (Final Categories)...');
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
      const attrUrl = `https://api.geoapify.com/v2/places?categories=${categories}&filter=circle:${lng},${lat},20000&bias=proximity:${lng},${lat}&limit=30&apiKey=${API_KEY}`;
      const attrRes = await fetch(attrUrl);
      console.log('Places Attractions Status:', attrRes.status);
      const attrData = await attrRes.json();
      console.log('Found Attractions:', attrData.features ? attrData.features.length : 0);
      if (attrData.features) {
        console.log('Attraction names:', attrData.features.map(f => f.properties.name || f.properties.street).filter(Boolean).slice(0, 5));
      }
      
      console.log('Testing Places API for Hospitals...');
      const hospUrl = `https://api.geoapify.com/v2/places?categories=healthcare.hospital&filter=circle:${lng},${lat},20000&bias=proximity:${lng},${lat}&limit=30&apiKey=${API_KEY}`;
      const hospRes = await fetch(hospUrl);
      console.log('Places Hospitals Status:', hospRes.status);
      const hospData = await hospRes.json();
      console.log('Found Hospitals:', hospData.features ? hospData.features.length : 0);
    } else {
      console.log('No features found in geocoding response:', geoData);
    }
  } catch (error) {
    console.error('Error in test:', error);
  }
}

test();
