/**
 * Programmatic SEO Template Generator for TripReady
 * Automates title, description, schema, breadcrumbs, internal links, FAQs, and related destinations.
 */

export function generateProgrammaticSEO(vertical, data) {
  if (!data) return null;

  const baseUrl = window.location.origin;
  const name = data.name || data.title || '';
  const countryName = data.countryName || data.country?.name || '';
  const stateName = data.stateName || data.state?.name || '';
  const cityName = data.cityName || data.city?.name || '';

  let title = '';
  let description = '';
  let canonicalUrl = '';
  let schema = null;
  let breadcrumbs = [];
  let internalLinks = [];
  let faqs = [];
  let relatedDestinations = [];

  switch (vertical) {
    case 'country':
      title = `${data.flag || '🌐'} Explore ${name} — Travel Guide, Sights & Itineraries | Trip Ready`;
      description = `Plan your trip to ${name}. Discover major states, cities, attractions, emergency numbers, and custom AI travel budgets for ${name}.`;
      canonicalUrl = `${baseUrl}/country/${data.slug}`;
      
      breadcrumbs = [
        { label: 'Home', path: '/' },
        { label: 'Countries', path: '/country-explorer' },
        { label: name, path: `/country/${data.slug}` }
      ];

      schema = {
        '@context': 'https://schema.org',
        '@type': 'Country',
        '@id': `${canonicalUrl}#country`,
        'name': name,
        'description': description,
        'url': canonicalUrl,
        'address': {
          '@type': 'PostalAddress',
          'addressCountry': data.iso2 || ''
        }
      };

      internalLinks = [
        { label: `States in ${name}`, path: `/country/${data.slug}#states` },
        { label: `Cities in ${name}`, path: `/country/${data.slug}#cities` }
      ];

      faqs = [
        { q: `What is the capital of ${name}?`, a: `The capital city of ${name} is ${data.capital || 'N/A'}.` },
        { q: `Which region is ${name} located in?`, a: `${name} is located in the ${data.region || 'global'} region.` }
      ];
      break;

    case 'state':
      title = `🏛️ Explore ${name}, ${countryName} — Travel Directory & Cities | Trip Ready`;
      description = `Travel directory for the state of ${name} in ${countryName}. Get details on major cities, local sightseeing spots, and transit options.`;
      canonicalUrl = `${baseUrl}/state/${data.slug}`;

      breadcrumbs = [
        { label: 'Home', path: '/' },
        { label: 'Countries', path: '/country-explorer' },
        { label: countryName, path: `/country/${data.country?.slug || ''}` },
        { label: name, path: `/state/${data.slug}` }
      ];

      schema = {
        '@context': 'https://schema.org',
        '@type': 'AdministrativeArea',
        '@id': `${canonicalUrl}#state`,
        'name': name,
        'description': description,
        'url': canonicalUrl
      };

      internalLinks = [
        { label: `Cities in ${name}`, path: `/state/${data.slug}#cities` },
        { label: `Attractions in ${name}`, path: `/state/${data.slug}#attractions` }
      ];

      faqs = [
        { q: `Where is the state of ${name} located?`, a: `${name} is an administrative area located in the country of ${countryName}.` }
      ];
      break;

    case 'city':
      title = `🏙️ Explore ${name}, ${countryName} — AI Local Travel Guide & Budgets | Trip Ready`;
      description = `Travel guide for ${name} in ${stateName ? `${stateName}, ` : ''}${countryName}. View daily travel budgets, local attractions, transit, and weather forecasts.`;
      canonicalUrl = `${baseUrl}/city/${data.slug}`;

      breadcrumbs = [
        { label: 'Home', path: '/' },
        { label: 'Countries', path: '/country-explorer' },
        { label: countryName, path: `/country/${data.country?.slug || ''}` },
        { label: name, path: `/city/${data.slug}` }
      ];

      schema = {
        '@context': 'https://schema.org',
        '@type': 'City',
        '@id': `${canonicalUrl}#city`,
        'name': name,
        'description': description,
        'url': canonicalUrl
      };

      internalLinks = [
        { label: `Attractions in ${name}`, path: `/city/${data.slug}#attractions` },
        { label: `Hospital Directory in ${name}`, path: `/city/${data.slug}#hospitals` }
      ];

      faqs = [
        { q: `What is the estimated budget for ${name}?`, a: `The estimated travel budget for ${name} is ${data.budget?.daily || '$150'} per day.` }
      ];
      break;

    case 'attraction':
      title = `📍 ${name} — Tourist Spot in ${cityName}, ${countryName} | Trip Ready`;
      description = `Guide to visiting ${name} in ${cityName}, ${countryName}. Find details on category (${data.category || 'Sightseeing'}), location coordinates, and historical context.`;
      canonicalUrl = `${baseUrl}/attraction/${data.slug}`;

      breadcrumbs = [
        { label: 'Home', path: '/' },
        { label: 'Countries', path: '/country-explorer' },
        { label: countryName, path: `/country/${data.country?.slug || ''}` },
        { label: cityName, path: `/city/${data.city?.slug || ''}` },
        { label: name, path: `/attraction/${data.slug}` }
      ];

      schema = {
        '@context': 'https://schema.org',
        '@type': 'TouristAttraction',
        '@id': `${canonicalUrl}#attraction`,
        'name': name,
        'description': description,
        'url': canonicalUrl
      };

      internalLinks = [
        { label: `Explore parent city: ${cityName}`, path: `/city/${data.city?.slug || ''}` }
      ];

      faqs = [
        { q: `Where is ${name} located?`, a: `${name} is located in the city of ${cityName}, ${countryName}.` }
      ];
      break;

    case 'hotel':
      title = `🏨 Stay at ${name} — Rates, Amenities & Booking Guide | Trip Ready`;
      description = `Find reviews, available amenities, and local pricing schemas for ${name} in ${cityName}, ${countryName}. Book your travel stay.`;
      canonicalUrl = `${baseUrl}/hotel/${data.slug}`;

      breadcrumbs = [
        { label: 'Home', path: '/' },
        { label: 'Hotels', path: '/hotels' },
        { label: name, path: `/hotel/${data.slug}` }
      ];

      schema = {
        '@context': 'https://schema.org',
        '@type': 'Hotel',
        '@id': `${canonicalUrl}#hotel`,
        'name': name,
        'description': description,
        'url': canonicalUrl
      };

      faqs = [
        { q: `What amenities does ${name} offer?`, a: `Amenities at ${name} typically include wifi, local parking, dining areas, and room services.` }
      ];
      break;

    case 'weather':
      title = `☀️ Live Climate & Weather Forecast for ${name} | Trip Ready`;
      description = `Get real-time weather forecasts, monthly climate averages, and seasonal packing advisories for ${name}, ${countryName}.`;
      canonicalUrl = `${baseUrl}/weather/${data.slug}`;

      breadcrumbs = [
        { label: 'Home', path: '/' },
        { label: 'Weather Hubs', path: '/weather-explorer' },
        { label: name, path: `/weather/${data.slug}` }
      ];

      schema = {
        '@context': 'https://schema.org',
        '@type': 'WeatherForecast',
        '@id': `${canonicalUrl}#weather`,
        'name': `${name} Weather Forecast`,
        'description': description,
        'url': canonicalUrl
      };

      faqs = [
        { q: `What is the best time of year to visit ${name}?`, a: `Check the climate forecast averages above to locate comfortable seasonal temperature ranges.` }
      ];
      break;

    case 'airport':
      title = `✈️ ${name} — Terminal Maps, Flights & Transit Guide | Trip Ready`;
      description = `Transit guide for ${name} (${data.code || 'IATA'}). Find flight departures, terminal maps, local shuttle lines, and taxi zones.`;
      canonicalUrl = `${baseUrl}/airport/${data.slug}`;

      breadcrumbs = [
        { label: 'Home', path: '/' },
        { label: 'Airports', path: '/airports' },
        { label: name, path: `/airport/${data.slug}` }
      ];

      schema = {
        '@context': 'https://schema.org',
        '@type': 'Airport',
        '@id': `${canonicalUrl}#airport`,
        'name': name,
        'description': description,
        'url': canonicalUrl,
        'iataCode': data.code || ''
      };

      faqs = [
        { q: `What is the airport code for ${name}?`, a: `The official IATA airport code for ${name} is ${data.code || 'N/A'}.` }
      ];
      break;

    case 'guide':
      title = `📖 Ultimate ${name} Travel Guide — Cultural Tips & Sights | Trip Ready`;
      description = `Comprehensive travel guide for ${name}. Learn local cultural protocols, recommended stay budgets, and emergency hotline contacts.`;
      canonicalUrl = `${baseUrl}/guide/${data.slug}`;

      breadcrumbs = [
        { label: 'Home', path: '/' },
        { label: 'Guides', path: '/guides' },
        { label: name, path: `/guide/${data.slug}` }
      ];

      schema = {
        '@context': 'https://schema.org',
        '@type': 'TravelGuide',
        '@id': `${canonicalUrl}#guide`,
        'name': name,
        'description': description,
        'url': canonicalUrl
      };

      faqs = [
        { q: `What does this guide cover?`, a: `This guide details packing checklists, local currency, emergency services, and top attraction spots.` }
      ];
      break;

    case 'blog':
      title = `${name} — Travel Chronicles & Logs | Trip Ready`;
      description = data.subtitle || data.description || '';
      canonicalUrl = `${baseUrl}/blog/${data.id}`;

      breadcrumbs = [
        { label: 'Home', path: '/' },
        { label: 'Blog', path: '/blog' },
        { label: name, path: `/blog/${data.id}` }
      ];

      schema = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        '@id': `${canonicalUrl}#blogposting`,
        'headline': name,
        'description': description,
        'url': canonicalUrl
      };

      faqs = [
        { q: `Who is the author of this post?`, a: `This post was researched and written by ${data.author || 'Senior Travel Curation Expert'}.` }
      ];
      break;

    default:
      return null;
  }

  return {
    title,
    description,
    canonicalUrl,
    schema,
    breadcrumbs,
    internalLinks,
    faqs,
    relatedDestinations
  };
}
