/**
 * Dynamic SEO & Schema Helper
 * Manages document title, meta descriptions, canonical URLs, and structured JSON-LD schemas.
 */

export function updateEntitySEO(type, data) {
  if (!data) return;

  const baseUrl = window.location.origin;
  let title = '';
  let description = '';
  let canonicalUrl = '';
  let mainSchema = null;
  let breadcrumbList = [];

  const name = data.name;
  const sameAsLinks = [];

  // Dynamically reconcile entities against Wikipedia and Wikidata patterns
  if (type === 'country') {
    sameAsLinks.push(
      `https://en.wikipedia.org/wiki/${encodeURIComponent(name)}`,
      `https://www.wikidata.org/wiki/${data.iso2 ? `Special:GoToLinkedPage/enwiki/${data.iso2}` : ''}`
    );
  } else if (type === 'state') {
    sameAsLinks.push(
      `https://en.wikipedia.org/wiki/${encodeURIComponent(name + '_' + (data.country?.name || ''))}`
    );
  } else if (type === 'city') {
    sameAsLinks.push(
      `https://en.wikipedia.org/wiki/${encodeURIComponent(name)}`,
      `https://en.wikipedia.org/wiki/${encodeURIComponent(name + ',_' + (data.country?.name || ''))}`
    );
  } else if (type === 'attraction') {
    if (data.website && data.website.includes('wikipedia.org')) {
      sameAsLinks.push(data.website);
    } else {
      sameAsLinks.push(
        `https://en.wikipedia.org/wiki/${encodeURIComponent(name)}`,
        `https://en.wikipedia.org/wiki/${encodeURIComponent(name + '_(' + (data.cityName || '') + ')')}`
      );
    }
  }

  // Filter out invalid/empty strings from sameAs links
  const filteredSameAs = sameAsLinks.filter(link => link && !link.endsWith('/') && !link.endsWith('Special:GoToLinkedPage/enwiki/'));

  if (type === 'country') {
    title = `${data.flag || ''} Explore ${name} — Travel Guide, Capitals & Top Sights | Trip Ready`;
    description = `Plan your perfect trip to ${name}. Explore its capital (${data.capital || 'N/A'}), region, states, major cities, and popular tourist attractions with smart budgeting.`;
    canonicalUrl = `${baseUrl}/country/${data.slug}`;

    mainSchema = {
      '@type': 'Country',
      '@id': `${canonicalUrl}#country`,
      'name': name,
      'description': description,
      'url': canonicalUrl,
      'sameAs': filteredSameAs.length > 0 ? filteredSameAs : undefined,
      'containedInPlace': data.subregion ? {
        '@type': 'Place',
        'name': data.subregion
      } : undefined,
      'address': {
        '@type': 'PostalAddress',
        'addressCountry': data.iso2
      }
    };

    breadcrumbList = [
      { name: 'Home', url: `${baseUrl}/` },
      { name: 'Countries', url: `${baseUrl}/country-explorer` },
      { name: name, url: canonicalUrl }
    ];
  } else if (type === 'state') {
    const countryName = data.country?.name || '';
    const countrySlug = data.country?.slug || '';
    title = `🏛️ Explore ${name}, ${countryName} — Travel Directory & Cities | Trip Ready`;
    description = `Discover the state of ${name} in ${countryName}. Get lists of major cities, top tourist spots, regional transit details, and live weather conditions.`;
    canonicalUrl = `${baseUrl}/state/${data.slug}`;

    mainSchema = {
      '@type': 'AdministrativeArea',
      '@id': `${canonicalUrl}#state`,
      'name': name,
      'description': description,
      'url': canonicalUrl,
      'sameAs': filteredSameAs.length > 0 ? filteredSameAs : undefined,
      'containedInPlace': countrySlug ? {
        '@type': 'Country',
        '@id': `${baseUrl}/country/${countrySlug}#country`,
        'name': countryName
      } : undefined
    };

    breadcrumbList = [
      { name: 'Home', url: `${baseUrl}/` },
      { name: 'Countries', url: `${baseUrl}/country-explorer` }
    ];
    if (countrySlug) {
      breadcrumbList.push({ name: countryName, url: `${baseUrl}/country/${countrySlug}` });
    }
    breadcrumbList.push({ name: name, url: canonicalUrl });
  } else if (type === 'city') {
    const countryName = data.country?.name || '';
    const countrySlug = data.country?.slug || '';
    const stateName = data.state?.name || '';
    const stateSlug = data.state?.slug || '';
    title = `🏙️ Explore ${name}, ${countryName} — AI Local Travel Guide & Budgets | Trip Ready`;
    description = `Discover ${name} in ${stateName ? `${stateName}, ` : ''}${countryName}. View real-world daily budgets, top local attractions, hospitals, transit apps, and weather forecast overlays.`;
    canonicalUrl = `${baseUrl}/city/${data.slug}`;

    mainSchema = {
      '@type': 'City',
      '@id': `${canonicalUrl}#city`,
      'name': name,
      'description': description,
      'url': canonicalUrl,
      'sameAs': filteredSameAs.length > 0 ? filteredSameAs : undefined,
      'containedInPlace': stateSlug ? {
        '@type': 'AdministrativeArea',
        '@id': `${baseUrl}/state/${stateSlug}#state`,
        'name': stateName
      } : countrySlug ? {
        '@type': 'Country',
        '@id': `${baseUrl}/country/${countrySlug}#country`,
        'name': countryName
      } : undefined
    };

    breadcrumbList = [
      { name: 'Home', url: `${baseUrl}/` },
      { name: 'Countries', url: `${baseUrl}/country-explorer` }
    ];
    if (countrySlug) {
      breadcrumbList.push({ name: countryName, url: `${baseUrl}/country/${countrySlug}` });
    }
    if (stateSlug) {
      breadcrumbList.push({ name: stateName, url: `${baseUrl}/state/${stateSlug}` });
    }
    breadcrumbList.push({ name: name, url: canonicalUrl });
  } else if (type === 'attraction') {
    const cityName = data.city?.name || '';
    const citySlug = data.city?.slug || '';
    const countryName = data.country?.name || '';
    const countrySlug = data.country?.slug || '';
    const stateName = data.state?.name || '';
    const stateSlug = data.state?.slug || '';
    title = `📍 ${name} — Tourist Spot in ${cityName}, ${countryName} | Trip Ready`;
    description = `Guide to visiting ${name} in ${cityName}. Find details on category (${data.category || 'Sightseeing'}), location coordinates, and historical context.`;
    canonicalUrl = `${baseUrl}/attraction/${data.slug}`;

    mainSchema = {
      '@type': 'TouristAttraction',
      '@id': `${canonicalUrl}#attraction`,
      'name': name,
      'description': description,
      'url': canonicalUrl,
      'sameAs': filteredSameAs.length > 0 ? filteredSameAs : undefined,
      'containedInPlace': citySlug ? {
        '@type': 'City',
        '@id': `${baseUrl}/city/${citySlug}#city`,
        'name': cityName
      } : undefined
    };

    breadcrumbList = [
      { name: 'Home', url: `${baseUrl}/` },
      { name: 'Countries', url: `${baseUrl}/country-explorer` }
    ];
    if (countrySlug) {
      breadcrumbList.push({ name: countryName, url: `${baseUrl}/country/${countrySlug}` });
    }
    if (stateSlug) {
      breadcrumbList.push({ name: stateName, url: `${baseUrl}/state/${stateSlug}` });
    }
    if (citySlug) {
      breadcrumbList.push({ name: cityName, url: `${baseUrl}/city/${citySlug}` });
    }
    breadcrumbList.push({ name: name, url: canonicalUrl });
  } else if (type === 'blog') {
    title = `${data.title} — Travel Chronicles | Trip Ready`;
    description = data.subtitle || data.description || '';
    canonicalUrl = `${baseUrl}/blog/${data.id}`;

    mainSchema = {
      '@type': 'BlogPosting',
      '@id': `${canonicalUrl}#blogposting`,
      'headline': data.title,
      'description': description,
      'datePublished': data.datePublished || '2026-05-30T00:00:00Z',
      'dateModified': data.dateModified || '2026-07-20T00:00:00Z',
      'image': data.image || ogImage,
      'author': {
        '@type': 'Person',
        'name': data.author || 'Senior Travel Curation Expert',
        'jobTitle': 'Lead Travel Researcher',
        'sameAs': `${baseUrl}/about`
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'Trip Ready',
        'logo': {
          '@type': 'ImageObject',
          'url': `${baseUrl}/favicon.svg`
        }
      },
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': canonicalUrl
      }
    };

    breadcrumbList = [
      { name: 'Home', url: `${baseUrl}/` },
      { name: 'Blog', url: `${baseUrl}/blog` },
      { name: data.title, url: canonicalUrl }
    ];
  }

  // Construct standard Graph schema
  const ogImage = data.image || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=80';

  // Generate dynamic programmatic FAQs based on entity type and fields
  const faqs = [];
  if (type === 'country') {
    faqs.push(
      {
        q: `What is the capital of ${name}?`,
        a: `The capital of ${name} is ${data.capital || 'N/A'}.`
      },
      {
        q: `Which region is ${name} located in?`,
        a: `${name} is located in the ${data.region || 'global'} region, specifically in the subregion of ${data.subregion || 'N/A'}.`
      }
    );
  } else if (type === 'state') {
    faqs.push(
      {
        q: `Where is the state of ${name} located?`,
        a: `${name} is a state or province territory located in ${data.country?.name || 'N/A'}.`
      },
      {
        q: `How many cities are indexed in ${name}?`,
        a: `There are ${data.cities?.length || 0} cities indexed within the state of ${name} on Trip Ready.`
      }
    );
  } else if (type === 'city') {
    faqs.push(
      {
        q: `What is the travel budget for ${name}?`,
        a: `The estimated travel budget for ${name} is approximately ${data.budget?.daily || '$150'} per day.`
      },
      {
        q: `What is the safety index of ${name}?`,
        a: `The safety rating for ${name} is currently estimated as ${data.safety || 'Safe'} with local advisory overlays.`
      }
    );
  } else if (type === 'attraction') {
    faqs.push(
      {
        q: `What category is ${name} classified under?`,
        a: `${name} is classified under the ${data.category || 'Sightseeing'} category.`
      },
      {
        q: `Which city is ${name} located in?`,
        a: `${name} is located in the city of ${data.city?.name || 'N/A'}, ${data.country?.name || 'N/A'}.`
      }
    );
  }

  const faqNode = faqs.length > 0 ? {
    '@type': 'FAQPage',
    '@id': `${canonicalUrl}#faq`,
    'mainEntity': faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.q,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.a
      }
    }))
  } : null;

  const graphList = [
    mainSchema,
    {
      '@type': 'BreadcrumbList',
      '@id': `${canonicalUrl}#breadcrumbs`,
      'itemListElement': breadcrumbList.map((item, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'item': {
          '@id': item.url,
          'name': item.name
        }
      }))
    }
  ];

  if (faqNode) {
    graphList.push(faqNode);
  }

  const schema = {
    '@context': 'https://schema.org',
    '@graph': graphList
  };

  // Apply basic tags
  document.title = title;

  // Helper to sync meta tag
  const setMetaTag = (attrName, attrValue, content) => {
    let tag = document.querySelector(`meta[${attrName}="${attrValue}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute(attrName, attrValue);
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
  };

  // Standard Meta description
  setMetaTag('name', 'description', description);

  // Canonical tag
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.rel = 'canonical';
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', canonicalUrl);

  // Open Graph / Facebook Meta
  setMetaTag('property', 'og:title', title);
  setMetaTag('property', 'og:description', description);
  setMetaTag('property', 'og:url', canonicalUrl);
  setMetaTag('property', 'og:image', ogImage);
  setMetaTag('property', 'og:type', 'website');

  // Twitter Cards
  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:title', title);
  setMetaTag('name', 'twitter:description', description);
  setMetaTag('name', 'twitter:image', ogImage);

  // Inject JSON-LD Schema
  let schemaScript = document.getElementById('jsonld-schema-entity');
  if (!schemaScript) {
    schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.id = 'jsonld-schema-entity';
    document.head.appendChild(schemaScript);
  }
  schemaScript.textContent = JSON.stringify(schema, null, 2);
}

export function clearEntitySEO() {
  const schemaScript = document.getElementById('jsonld-schema-entity');
  if (schemaScript) {
    schemaScript.remove();
  }
  
  // Remove generated social metadata tags to prevent leaks across pages
  const ogTags = ['og:title', 'og:description', 'og:url', 'og:image', 'og:type'];
  const twitterTags = ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image'];
  
  ogTags.forEach(prop => {
    const el = document.querySelector(`meta[property="${prop}"]`);
    if (el) el.remove();
  });
  twitterTags.forEach(name => {
    const el = document.querySelector(`meta[name="${name}"]`);
    if (el) el.remove();
  });
}
