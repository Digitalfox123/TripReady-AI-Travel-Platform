// ============================================================================
// TRIPREADY — COMMAND CENTER DESTINATION INTELLIGENCE
// Deep pre-departure & arrival intelligence for destinations
// ============================================================================

export const DESTINATION_KNOWLEDGE = {
  geneva: {
    city: 'Geneva',
    country: 'Switzerland',
    flag: '🇨🇭',
    airportCode: 'GVA',
    airportName: 'Geneva Airport (Cointrin)',
    currency: { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', rate: 0.89 },
    timezone: 'CEST (UTC+2) · 3h behind Lahore',
    safetyScore: 92,
    safetyLevel: 'Very Safe',
    firstHour: [
      {
        step: 1,
        title: 'Land & Baggage Reclaim',
        category: 'Arrival',
        summary: 'Collect baggage at Hall 1 or 2 in Terminal 1.',
        detail: 'Follow Swiss-sector arrival signs after exiting the jet bridge. Baggage carousels are located immediately on the ground level.',
        badge: 'Terminal 1'
      },
      {
        step: 2,
        title: 'Claim Free 80-Min Transit Ticket',
        category: 'Transport',
        summary: 'Crucial: Get your free Unireso ticket before exiting baggage hall.',
        detail: 'Before exiting into the public arrival lounge, press the blue button at the automated Unireso ticket distributor in the baggage reclaim hall. It prints a 100% FREE 80-minute ticket valid for all trains and buses into Geneva city.',
        badge: 'Free Voucher'
      },
      {
        step: 3,
        title: 'Connectivity & eSIM Setup',
        category: 'Tech',
        summary: 'Connect to airport Wi-Fi or toggle your Swiss digital eSIM.',
        detail: 'Connect to "GVA-FREE-WIFI" for 2 hours of complimentary high-speed internet. If using Airalo or Holafly, toggle data roaming on your Swiss eSIM profile.',
        badge: 'Free 5G Wi-Fi'
      },
      {
        step: 4,
        title: 'Skip High-Fee Currency Booths',
        category: 'Money',
        summary: 'Use official bank ATMs in the arrival hall for clean CHF rates.',
        detail: 'Currency exchange booths at the airport charge up to 10–12% margin. Use Banque Cantonale de Genève (BCGE) or PostFinance ATMs inside the terminal for official rates, or tap your contactless credit/debit card directly.',
        badge: 'Pro Tip'
      },
      {
        step: 5,
        title: '7-Minute Train to Geneva Cornavin',
        category: 'Transit',
        summary: 'Walk 3 minutes to the airport train platform; direct train to city center.',
        detail: 'Walk straight through the underground corridor connected to the terminal. All trains departing Geneva Airport stop at Geneva Cornavin (central station) in just 7 minutes. Trains run every 10–12 minutes.',
        badge: '7 Min Ride'
      },
      {
        step: 6,
        title: 'Hotel Check-in & Free Transport Card',
        category: 'Check-in',
        summary: 'Claim your complimentary Geneva Transport Card at the front desk.',
        detail: 'Under Geneva cantonal tourism law, every registered hotel, hostel, or campsite provides guests with a free Geneva Transport Card valid for your entire stay across all trams, buses, and yellow lake boats (Mouettes).',
        badge: 'Complimentary'
      }
    ],
    essentials: {
      visa: {
        title: 'Visa & Entry Requirements',
        summary: 'Schengen Visa required for Pakistani passport holders · 90-day max stay.',
        detail: 'Switzerland is a member of the Schengen Area. Travelers with a Pakistani passport require a Schengen Tourist Visa (Type C) submitted at least 15–30 days prior to departure. Key requirements: Passport valid for min. 6 months beyond travel dates, travel medical insurance with at least €30,000 coverage across the Schengen zone, confirmed round-trip flight reservations, and proof of accommodation. Citizens of US, UK, EU, UAE, Canada, and Australia can enter visa-free for up to 90 days in any 180-day period.',
        status: 'Schengen Visa Required',
        badgeColor: 'amber',
        officialLink: 'https://www.eda.admin.ch/eda/en/home/entry-switzerland-residence/visa-requirements.html'
      },
      safety: {
        title: 'Safety & Health Protocol',
        summary: 'Safety Index: 92/100 · Low violent crime rate · High civic order.',
        detail: 'Geneva is one of the safest cities globally. The principal tourist concern is non-violent opportunistic pickpocketing in crowded transport hubs, particularly Geneva Cornavin railway station, surrounding Pâquis side-streets late at night, and crowded Tram Line 15. Tap water from every city fountain and tap is pure alpine mineral water and 100% safe to drink.',
        status: 'Very Safe (92/100)',
        badgeColor: 'emerald',
        hotlines: { police: '117', ambulance: '144', fire: '118', universal: '112' }
      },
      money: {
        title: 'Money, Cards & Currency',
        summary: 'Currency: Swiss Franc (CHF) · 97% contactless card acceptance.',
        detail: 'Switzerland uses the Swiss Franc (CHF). 1 USD ≈ 0.89 CHF. Euros are accepted in major chain stores and railway counters, but change is returned in CHF at unfavorable rates. Contactless Visa, Mastercard, Apple Pay, and Google Pay work practically everywhere including trams and farmers markets. Tipping is legally included in restaurant bills, but rounding up by 5–10% for dedicated table service is courteous.',
        status: 'Card Preferred',
        badgeColor: 'blue'
      },
      connectivity: {
        title: 'Mobile Connectivity & Power',
        summary: '5G coverage across 99% of city · Swisscom & Sunrise are primary networks.',
        detail: 'Switzerland is not in the EU, so European roaming packages may incur additional charges depending on your provider. An eSIM (Airalo, Holafly, Nomad) provides the cleanest and most cost-effective data. Electrical sockets use Swiss Type J (3-pin diamond) and Europlug Type C (2-pin round), operating at 230V / 50Hz.',
        status: 'eSIM Recommended',
        badgeColor: 'blue'
      },
      transport: {
        title: 'Local Transit & Lake Boats',
        summary: 'Complimentary Geneva Transport Card with hotel booking.',
        detail: 'The Unireso and TPG transit grid connects the entire canton with zero-emission trams, trolleybuses, and Léman Express commuter trains. The iconic yellow Mouettes water buses cross Lake Geneva between Rive Droite and Rive Gauche every 10–15 minutes and are included with your transport pass.',
        status: 'Free Hotel Pass',
        badgeColor: 'emerald'
      },
      culture: {
        title: 'Cultural Etiquette & Languages',
        summary: 'French-speaking · Polite social decorum · Quiet hours after 10 PM.',
        detail: 'Always greet shopkeepers and drivers with a polite "Bonjour Madame/Monsieur" upon entering and "Merci, bonne journée" upon leaving. Punctuality is deeply valued. Switzerland enforces statutory quiet hours every day after 10:00 PM and throughout Sundays (avoid running loud washing machines or loud conversations in residential quarters).',
        status: 'French / Multilingual',
        badgeColor: 'purple'
      },
      emergency: {
        title: 'Emergency Hotlines & Medical Desks',
        summary: 'Police: 117 · Ambulance: 144 · Universal European Emergency: 112.',
        detail: 'Hôpitaux Universitaires de Genève (HUG) is the premier public medical facility with 24/7 adult and pediatric emergency services and multilingual staff. Pharmacy emergency service is available at Cornavin station (Pharmacie Principale).',
        status: '24/7 Dispatch',
        badgeColor: 'rose'
      }
    },
    neighborhoods: [
      {
        name: 'Old Town (Vieille Ville)',
        bestFor: 'First-time visitors & history enthusiasts',
        description: 'Atmospheric cobblestone alleys, historic 16th-century buildings, art galleries, and St. Pierre Cathedral.',
        avgNight: '$220 - $380',
        vibe: 'Historic & Elegant',
        transit: 'Tram 12, 17 · 10 min to lake'
      },
      {
        name: 'Pâquis & Lakefront',
        bestFor: 'Lake views, vibrant dining & nightlife',
        description: 'Vibrant and cosmopolitan district along the western lake shore, home to luxury 5-star hotels, Bains des Pâquis, and diverse international eateries.',
        avgNight: '$190 - $450',
        vibe: 'Energetic & Scenic',
        transit: 'Mouettes boats, Buses 1, 25'
      },
      {
        name: 'Cornavin / City Centre',
        bestFor: 'Transit convenience & day-trip ease',
        description: 'The central hub surrounding the main railway station. Fastest airport access and central departure point for trains across Switzerland.',
        avgNight: '$140 - $260',
        vibe: 'Convenient & Busy',
        transit: 'Main Hub: All trains, trams 14, 15, 18'
      },
      {
        name: 'Eaux-Vives',
        bestFor: 'Local café culture, parks & lakeside strolls',
        description: 'Upscale residential neighborhood surrounding the Jet d\'Eau and Parc La Grange. Great bistros, wine bars, and beach access.',
        avgNight: '$180 - $320',
        vibe: 'Relaxed & Chic',
        transit: 'Trams 12, 17, CEVA Léman Express'
      },
      {
        name: 'Plainpalais & Carouge',
        bestFor: 'Bohemian vibe, flea markets & budget-friendly stays',
        description: 'Lively student and artist district. Carouge features Mediterranean Italianate architecture with artisan boutiques and open squares.',
        avgNight: '$120 - $210',
        vibe: 'Bohemian & Artistic',
        transit: 'Trams 12, 14, 18'
      }
    ],
    transportOptions: [
      {
        title: 'Geneva Airport → City Centre',
        mode: 'Direct CFF Train',
        duration: '~7 minutes',
        cost: 'FREE with Unireso ticket',
        highlight: true,
        badge: 'BEST & FASTEST OPTION',
        description: 'Trains run every 10–12 minutes from the airport underground station to Geneva Cornavin. Luggage racks available, zero traffic, drops you right in the center.'
      },
      {
        title: 'TPG Tram & Bus Network',
        mode: 'Trams & Electric Buses',
        duration: 'City-wide',
        cost: 'Free with hotel pass ($3.50 regular)',
        highlight: false,
        badge: 'TPG Transit',
        description: '100% electric and hybrid fleet connecting every neighborhood. Trams 12, 14, 15, and 18 are the main spines of the city.'
      },
      {
        title: 'Mouettes Genevoises (Lake Shuttles)',
        mode: 'Yellow Solar/Electric Boats',
        duration: '5–10 minutes',
        cost: 'Free with hotel pass',
        highlight: false,
        badge: 'Scenic Route',
        description: 'Four ferry lines (M1 to M4) crossing Lake Geneva between Pâquis, Eaux-Vives, Molard, and De-Châteaubriand. Quickest and most beautiful lake crossing.'
      },
      {
        title: 'SBB CFF FFS Intercity Rail',
        mode: 'National Swiss Rail',
        duration: 'Lausanne (35m), Montreux (1h)',
        cost: 'Varies with SBB pass',
        highlight: false,
        badge: 'Day Trips',
        description: 'World-renowned Swiss punctuality. Highly recommended for day trips along the Swiss Riviera and alpine excursions to Zermatt or Interlaken.'
      },
      {
        title: 'Licensed City Taxis & Uber',
        mode: 'Cab / Rideshare',
        duration: 'On-demand',
        cost: 'CHF 35–50 from airport',
        highlight: false,
        badge: 'Direct Door-to-Door',
        description: 'Official taxis are cream or black with "Taxi" roof signs. Uber operates legally in Geneva with vetted professional drivers.'
      }
    ],
    foodHighlights: [
      {
        name: 'Authentic Swiss Fondue',
        type: 'National Dish',
        description: 'A rich moitié-moitié blend of Gruyère AOP and Vacherin Fribourgeois melted with white wine and garlic, served bubbling with crusty rustic bread cubes.',
        spot: 'Les Armures (Old Town) or Bains des Pâquis',
        dietary: 'Vegetarian Friendly'
      },
      {
        name: 'Filets de Perche du Léman',
        type: 'Lakeside Specialty',
        description: 'Delicate fresh perch fillets caught from Lake Geneva, pan-fried in brown butter with fresh herbs, served with golden shoestring fries.',
        spot: 'Café du Centre or lakeside brasseries',
        dietary: 'Pescatarian'
      },
      {
        name: 'Raclette du Valais',
        type: 'Alpine Traditional',
        description: 'Melted wheel of raw alpine cow milk cheese scraped directly over steamed new potatoes, baby gherkins, and pickled pearl onions.',
        spot: 'Auberge de Savièse (Pâquis)',
        dietary: 'Vegetarian / Gluten-Free'
      },
      {
        name: 'Artisanal Swiss Chocolate & Pralines',
        type: 'Confectionery',
        description: 'Geneva is world-famous for luxury chocolatiers crafting dark pavés, truffles, and single-origin bars.',
        spot: 'Chocolaterie Favarger, Auer Chocolatier, or Du Rhône',
        dietary: 'Vegetarian'
      }
    ],
    curatedAttractions: [
      {
        id: 'jet-deau',
        name: 'The Jet d\'Eau',
        category: 'Must See',
        duration: '45 mins',
        image: 'https://images.unsplash.com/photo-1574873215043-44119461cb3b?w=1000&q=80',
        description: 'Geneva\'s iconic 140-meter (460 ft) water fountain pumping 500 liters of lake water into the sky per second at 200 km/h.',
        tag: 'Iconic Landmark'
      },
      {
        id: 'st-pierre-cathedral',
        name: 'St. Pierre Cathedral & Old Town',
        category: 'History',
        duration: '1.5 hours',
        image: 'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=1000&q=80',
        description: 'Historic 12th-century cathedral where John Calvin preached, featuring a 157-step climb to panoramic views over the lake and Mont Blanc.',
        tag: 'Panoramic Overlook'
      },
      {
        id: 'palace-of-nations',
        name: 'Palace of Nations (UN Headquarters)',
        category: 'Museums',
        duration: '2 hours',
        image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=1000&q=80',
        description: 'The European seat of the United Nations surrounded by 193 sovereign flags and the monumental "Broken Chair" sculpture on Place des Nations.',
        tag: 'Global Diplomacy'
      },
      {
        id: 'bains-des-paquis',
        name: 'Bains des Pâquis',
        category: 'Food',
        duration: '2 hours',
        image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1000&q=80',
        description: 'Beloved 1930s public bathhouse on a lakeside pier featuring public swimming, authentic winter fondue, massage, and summer sunbathing.',
        tag: 'Local Favorite'
      },
      {
        id: 'cern-science-gateway',
        name: 'CERN Science Gateway',
        category: 'Museums',
        duration: '2.5 hours',
        image: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=1000&q=80',
        description: 'Renzo Piano-designed public discovery center of the world\'s premier particle physics laboratory and Large Hadron Collider.',
        tag: 'Science & Tech'
      },
      {
        id: 'jardin-anglais-flower-clock',
        name: 'Jardin Anglais & L\'horloge fleurie',
        category: 'Nature',
        duration: '30 mins',
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1000&q=80',
        description: 'Lakeside garden home to the famous floral clock crafted from 6,500 seasonal blooming plants, celebrating the Swiss horology heritage.',
        tag: 'Lakefront Park'
      }
    ],
    packingChecklist: [
      { id: 'p1', label: 'Layered weather jacket / Windbreaker', category: 'Clothing', checked: true },
      { id: 'p2', label: 'Comfortable walking shoes (for cobblestones)', category: 'Clothing', checked: true },
      { id: 'p3', label: 'Type J Swiss adapter (or 2-pin Type C Europlug)', category: 'Electronics', checked: false },
      { id: 'p4', label: 'Valid Passport (min. 6 months validity)', category: 'Documents', checked: true },
      { id: 'p5', label: 'Schengen Visa document copy / Insurance policy', category: 'Documents', checked: true },
      { id: 'p6', label: 'Reusable water bottle (pure tap water in fountains)', category: 'Essentials', checked: false },
      { id: 'p7', label: 'Sunglasses for lake and alpine light glare', category: 'Essentials', checked: false },
      { id: 'p8', label: 'Compact umbrella or light rain protection', category: 'Essentials', checked: false }
    ]
  }
};

export function resolveDestinationIntelligence(destName, destCountry) {
  const normCity = (destName || '').toLowerCase().trim().replace(/[^a-z]/g, '');
  const normCountry = (destCountry || '').toLowerCase().trim();

  if (DESTINATION_KNOWLEDGE[normCity]) {
    return DESTINATION_KNOWLEDGE[normCity];
  }

  const isEurope = ['france', 'germany', 'italy', 'spain', 'switzerland', 'austria', 'netherlands', 'belgium', 'norway', 'sweden', 'denmark', 'portugal', 'greece', 'uk', 'united kingdom'].some(c => normCountry.includes(c));
  const isMiddleEast = ['saudi arabia', 'uae', 'united arab emirates', 'qatar', 'kuwait', 'oman', 'bahrain', 'jordan'].some(c => normCountry.includes(c));
  const isAsia = ['japan', 'china', 'south korea', 'thailand', 'singapore', 'indonesia', 'vietnam', 'malaysia', 'pakistan', 'india', 'turkey'].some(c => normCountry.includes(c));

  const cityName = destName || 'Destination';
  const countryName = destCountry || 'Worldwide';

  return {
    city: cityName,
    country: countryName,
    flag: '🌍',
    airportCode: cityName.slice(0, 3).toUpperCase(),
    airportName: `${cityName} International Airport`,
    currency: isEurope ? { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.92 } : isMiddleEast ? { code: 'SAR', name: 'Saudi Riyal', symbol: 'SAR', rate: 3.75 } : { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1.0 },
    timezone: isEurope ? 'CET / CEST (UTC+1/+2)' : isAsia ? 'Local Time (UTC+5 to +9)' : 'Local Time',
    safetyScore: isEurope ? 88 : isMiddleEast ? 90 : 84,
    safetyLevel: 'Safe & Welcoming',
    firstHour: [
      {
        step: 1,
        title: 'Land & Baggage Claim',
        category: 'Arrival',
        summary: `Arrive at ${cityName} airport terminal and retrieve luggage.`,
        detail: 'Follow standard arrivals and baggage claim signs. Ensure all baggage tags match your boarding pass stubs.',
        badge: 'Arrival'
      },
      {
        step: 2,
        title: 'Immigration & Border Clearance',
        category: 'Entry',
        summary: 'Present passport, return tickets, and visa documentation.',
        detail: 'Have your digital hotel booking confirmation, passport with 6 months validity, and return flight details handy.',
        badge: 'Border Desk'
      },
      {
        step: 3,
        title: 'Connectivity & Local SIM / eSIM',
        category: 'Tech',
        summary: 'Activate your digital eSIM or connect to airport Wi-Fi.',
        detail: 'Connect to the free terminal Wi-Fi network or toggle your travel eSIM data roaming profile.',
        badge: 'Connectivity'
      },
      {
        step: 4,
        title: 'Cash & Local Currency',
        category: 'Money',
        summary: 'Use bank ATMs inside the terminal for local currency.',
        detail: 'Avoid high airport currency exchange kiosks. Official bank ATMs provide better interbank exchange rates.',
        badge: 'ATM Access'
      },
      {
        step: 5,
        title: 'Transit to City Center',
        category: 'Transit',
        summary: `Board express train, airport bus, or official taxi to central ${cityName}.`,
        detail: 'Follow ground transportation signs to the rail platform or official taxi rank. Avoid unlicensed drivers.',
        badge: 'Transit'
      },
      {
        step: 6,
        title: 'Hotel Check-in & Orientation',
        category: 'Hotel',
        summary: `Arrive at your accommodation, drop luggage, and pick up local maps.`,
        detail: 'Ask the hotel front desk for a transit map, neighborhood advice, and Wi-Fi credentials.',
        badge: 'Check-in'
      }
    ],
    essentials: {
      visa: {
        title: 'Visa & Entry Requirements',
        summary: `Entry regulations for ${countryName}.`,
        detail: `Check specific entry regulations based on your passport nationality. Most international travelers require a valid passport with at least 6 months validity, return flight confirmation, and sufficient funds.`,
        status: 'Check Requirements',
        badgeColor: 'blue',
        officialLink: '#'
      },
      safety: {
        title: 'Safety & Health Protocol',
        summary: `Safety rating: 85/100 · Peaceful with standard tourist precautions.`,
        detail: `Violent crime is rare. Standard precautions against petty theft in crowded tourist plazas and public transit stations are recommended. Keep your valuables secure.`,
        status: 'Safe & Welcoming',
        badgeColor: 'emerald',
        hotlines: { police: '112 / 911', ambulance: '112 / 911', fire: '112 / 911', universal: '112' }
      },
      money: {
        title: 'Money, Cards & Currency',
        summary: `Payment methods and card acceptance in ${cityName}.`,
        detail: `Credit and debit cards are widely accepted at hotels, major restaurants, and shops. Carrying a small amount of local currency cash is recommended for street food and tipping.`,
        status: 'Cards Widely Accepted',
        badgeColor: 'blue'
      },
      connectivity: {
        title: 'Mobile Connectivity & Power',
        summary: `High-speed 4G/5G mobile coverage across ${cityName}.`,
        detail: `Local eSIMs or prepaid SIM cards are easily available at airport arrival halls. Free Wi-Fi is standard in hotels, cafes, and major transit stations.`,
        status: 'eSIM Recommended',
        badgeColor: 'blue'
      },
      transport: {
        title: 'Local Transit & Navigation',
        summary: `Public transit and ride-hailing options in ${cityName}.`,
        detail: `The city features municipal transit networks (metros, buses, or regional trains). Ride-hailing apps provide reliable door-to-door transit.`,
        status: 'Multiple Transit Modes',
        badgeColor: 'emerald'
      },
      culture: {
        title: 'Cultural Etiquette & Customs',
        summary: `Local customs, etiquette, and polite greetings in ${countryName}.`,
        detail: `Polite greetings and courteous interaction with service staff are cherished. Respect religious monuments, local traditions, and appropriate dress codes.`,
        status: 'Respect Local Customs',
        badgeColor: 'purple'
      },
      emergency: {
        title: 'Emergency Hotlines & Medical Services',
        summary: `Emergency hotlines and medical centers in ${cityName}.`,
        detail: `Emergency dispatch is reachable via universal emergency lines. Major hospitals provide 24/7 emergency care and English-speaking doctors.`,
        status: '24/7 Available',
        badgeColor: 'rose'
      }
    },
    neighborhoods: [
      {
        name: 'Historic Center / Downtown',
        bestFor: 'First-time visitors & sightseeing',
        description: 'Central district with landmark architecture, cultural sites, and walkable pedestrian promenades.',
        avgNight: '$140 - $280',
        vibe: 'Central & Vibrant',
        transit: 'Metro / Tram accessible'
      },
      {
        name: 'Waterfront / Riverside District',
        bestFor: 'Views, culinary experiences & lifestyle',
        description: 'Scenic promenade along the water, lined with dining terraces, boutiques, and evening entertainment.',
        avgNight: '$160 - $340',
        vibe: 'Scenic & Upscale',
        transit: 'Ferries & Buses'
      },
      {
        name: 'Central Railway Hub',
        bestFor: 'Day trips & maximum transit convenience',
        description: 'Convenient neighborhood right beside the central railway terminal for effortless airport and regional connections.',
        avgNight: '$110 - $220',
        vibe: 'Practical & Active',
        transit: 'All rail lines'
      }
    ],
    transportOptions: [
      {
        title: `Airport to Central ${cityName}`,
        mode: 'Airport Express Train / Shuttle',
        duration: '20–35 min',
        cost: '$5.00 - $18.00',
        highlight: true,
        badge: 'RECOMMENDED OPTION',
        description: 'Fast direct rail or shuttle connection connecting airport arrivals with downtown terminal.'
      },
      {
        title: 'City Metro & Bus Grid',
        mode: 'Public Rapid Transit',
        duration: 'City-wide',
        cost: '$1.50 - $4.00 / trip',
        highlight: false,
        badge: 'Local Transit',
        description: 'Comprehensive municipal bus and metro routes operating from early morning until late evening.'
      },
      {
        title: 'Ride-Hailing & Licensed Taxis',
        mode: 'On-demand Car',
        duration: 'On-demand',
        cost: 'Metered pricing',
        highlight: false,
        badge: 'Door-to-Door',
        description: 'Licensed taxis and ride-hailing applications provide private transfers across all urban districts.'
      }
    ],
    foodHighlights: [
      {
        name: `Traditional ${countryName} Specialty`,
        type: 'Regional Signature',
        description: 'Signature local delicacy crafted with fresh regional ingredients, slow-cooked spices, and authentic culinary heritage.',
        spot: `Local Heritage Bistros in ${cityName}`,
        dietary: 'Local Classic'
      },
      {
        name: 'Artisanal Street Delicacies',
        type: 'Street Gastronomy',
        description: 'Popular snacks and savory bites served hot from local market stalls and traditional neighborhood bakeries.',
        spot: `Central Food Markets of ${cityName}`,
        dietary: 'Casual Treat'
      }
    ],
    curatedAttractions: [
      {
        id: 'attr-1',
        name: `Historic Center of ${cityName}`,
        category: 'Must See',
        duration: '2 hours',
        image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1000&q=80',
        description: `The cultural and historic heart of ${cityName}, showcasing iconic architecture and picturesque boulevards.`,
        tag: 'Top Landmark'
      },
      {
        id: 'attr-2',
        name: 'Panoramic Viewpoint & Overlook',
        category: 'Nature',
        duration: '1.5 hours',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&q=80',
        description: `Scenic vantage point offering sweeping skyline vistas and photo opportunities over ${cityName}.`,
        tag: 'Scenic Views'
      },
      {
        id: 'attr-3',
        name: 'National Cultural Museum',
        category: 'Museums',
        duration: '2 hours',
        image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1000&q=80',
        description: 'Renowned repository of art, historical artifacts, and interactive exhibits detailing national heritage.',
        tag: 'Arts & Culture'
      }
    ],
    packingChecklist: [
      { id: 'p1', label: 'Comfortable walking shoes', category: 'Clothing', checked: true },
      { id: 'p2', label: 'Layered weather jacket / Windbreaker', category: 'Clothing', checked: true },
      { id: 'p3', label: 'International universal power adapter', category: 'Electronics', checked: false },
      { id: 'p4', label: 'Passport (valid 6+ months) & Visa copies', category: 'Documents', checked: true },
      { id: 'p5', label: 'Travel insurance card & emergency contacts', category: 'Documents', checked: true },
      { id: 'p6', label: 'Portable smartphone power bank', category: 'Electronics', checked: false },
      { id: 'p7', label: 'Reusable water bottle', category: 'Essentials', checked: false }
    ]
  };
}
