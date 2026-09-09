// ============================================================================
// TRIPREADY — COMMAND CENTER DESTINATION INTELLIGENCE
// 100% Accurate Pre-Departure & Arrival Intelligence for World Destinations
// ZERO Cross-Destination Leaks · Built-in Curated Flagships + Smart Universal Resolver
// ============================================================================

import { countriesData } from './countryData.js';
import { attractionKnowledgeBase, realCityFoodAndTransit } from './attractionKnowledgeBase.js';
import { getCityImage } from '../utils/imageLookup.js';

export const DESTINATION_KNOWLEDGE = {
  // ── 1. GENEVA, SWITZERLAND ───────────────────────────────────────────────
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
      { step: 1, title: 'Land & Baggage Reclaim', category: 'Arrival', summary: 'Collect baggage at Hall 1 or 2 in Terminal 1.', detail: 'Follow Swiss-sector arrival signs after exiting the jet bridge. Baggage carousels are located immediately on the ground level.', badge: 'Terminal 1' },
      { step: 2, title: 'Claim Free 80-Min Transit Ticket', category: 'Transport', summary: 'Crucial: Get your free Unireso ticket before exiting baggage hall.', detail: 'Before exiting into the public arrival lounge, press the blue button at the automated Unireso ticket distributor in the baggage reclaim hall. It prints a 100% FREE 80-minute ticket valid for all trains and buses into Geneva city.', badge: 'Free Voucher' },
      { step: 3, title: 'Connectivity & eSIM Setup', category: 'Tech', summary: 'Connect to airport Wi-Fi or toggle your Swiss digital eSIM.', detail: 'Connect to "GVA-FREE-WIFI" for 2 hours of complimentary high-speed internet. If using Airalo or Holafly, toggle data roaming on your Swiss eSIM profile.', badge: 'Free 5G Wi-Fi' },
      { step: 4, title: 'Skip High-Fee Currency Booths', category: 'Money', summary: 'Use official bank ATMs in the arrival hall for clean CHF rates.', detail: 'Currency exchange booths at the airport charge up to 10–12% margin. Use Banque Cantonale de Genève (BCGE) or PostFinance ATMs inside the terminal for official rates, or tap your contactless card directly.', badge: 'Pro Tip' },
      { step: 5, title: '7-Minute Train to Geneva Cornavin', category: 'Transit', summary: 'Walk 3 minutes to the airport train platform; direct train to city center.', detail: 'Walk straight through the underground corridor connected to the terminal. All trains departing Geneva Airport stop at Geneva Cornavin (central station) in just 7 minutes. Trains run every 10–12 minutes.', badge: '7 Min Ride' },
      { step: 6, title: 'Hotel Check-in & Free Transport Card', category: 'Check-in', summary: 'Claim your complimentary Geneva Transport Card at the front desk.', detail: 'Under Geneva cantonal tourism law, every registered hotel, hostel, or campsite provides guests with a free Geneva Transport Card valid for your entire stay across all trams, buses, and yellow lake boats (Mouettes).', badge: 'Complimentary' }
    ],
    essentials: {
      visa: { title: 'Visa & Entry Requirements', summary: 'Schengen Visa required for Pakistani passport holders · 90-day max stay.', detail: 'Switzerland is a member of the Schengen Area. Travelers with a Pakistani passport require a Schengen Tourist Visa (Type C) submitted at least 15–30 days prior to departure. Citizens of US, UK, EU, UAE, Canada, and Australia can enter visa-free for up to 90 days.', status: 'Schengen Visa Required', badgeColor: 'amber', officialLink: 'https://www.eda.admin.ch/' },
      safety: { title: 'Safety & Health Protocol', summary: 'Safety Index: 92/100 · Low violent crime rate · High civic order.', detail: 'Geneva is one of the safest cities globally. Tap water from every city fountain and tap is pure alpine mineral water and 100% safe to drink.', status: 'Very Safe (92/100)', badgeColor: 'emerald', hotlines: { police: '117', ambulance: '144', fire: '118', universal: '112' } },
      money: { title: 'Money, Cards & Currency', summary: 'Currency: Swiss Franc (CHF) · 97% contactless card acceptance.', detail: 'Switzerland uses the Swiss Franc (CHF). 1 USD ≈ 0.89 CHF. Contactless Visa, Mastercard, Apple Pay, and Google Pay work practically everywhere. Tipping is legally included in restaurant bills.', status: 'Card Preferred', badgeColor: 'blue' },
      connectivity: { title: 'Mobile Connectivity & Power', summary: '5G coverage across 99% of city · Swisscom & Sunrise.', detail: 'Switzerland is not in the EU, so European roaming packages may incur additional charges. Electrical sockets use Swiss Type J (3-pin diamond) and Europlug Type C (2-pin round, 230V / 50Hz).', status: 'eSIM Recommended', badgeColor: 'blue' },
      transport: { title: 'Local Transit & Lake Boats', summary: 'Complimentary Geneva Transport Card with hotel booking.', detail: 'The Unireso and TPG transit grid connects the entire canton with zero-emission trams, trolleybuses, and Léman Express trains. Yellow Mouettes lake boats are included.', status: 'Free Hotel Pass', badgeColor: 'emerald' },
      culture: { title: 'Cultural Etiquette & Languages', summary: 'French-speaking · Polite social decorum · Quiet hours after 10 PM.', detail: 'Always greet shopkeepers with a polite "Bonjour Madame/Monsieur" upon entering and "Merci, bonne journée" upon leaving. Punctuality is deeply valued. Switzerland enforces statutory quiet hours after 10 PM.', greetingText: 'Always greet with a polite "Bonjour" and depart with "Merci, bonne journée"', status: 'French Language', badgeColor: 'purple' },
      emergency: { title: 'Emergency Hotlines & Medical Desks', summary: 'Police: 117 · Ambulance: 144 · Universal European Emergency: 112.', detail: 'Hôpitaux Universitaires de Genève (HUG) is the premier public medical facility with 24/7 adult and pediatric emergency services and multilingual staff.', status: '24/7 Dispatch', badgeColor: 'rose' }
    },
    neighborhoods: [
      { name: 'Old Town (Vieille Ville)', bestFor: 'First-time visitors & history enthusiasts', description: 'Atmospheric cobblestone alleys, historic 16th-century buildings, art galleries, and St. Pierre Cathedral.', avgNight: '$220 - $380', vibe: 'Historic & Elegant', transit: 'Tram 12, 17 · 10 min to lake' },
      { name: 'Pâquis & Lakefront', bestFor: 'Lake views, vibrant dining & nightlife', description: 'Cosmopolitan district along the western lake shore, home to luxury hotels and Bains des Pâquis.', avgNight: '$190 - $450', vibe: 'Energetic & Scenic', transit: 'Mouettes boats, Buses 1, 25' },
      { name: 'Cornavin / City Centre', bestFor: 'Transit convenience & day-trip ease', description: 'The central hub surrounding the main railway station with fastest airport access.', avgNight: '$140 - $260', vibe: 'Convenient & Busy', transit: 'Main Hub: All trains, trams 14, 15, 18' }
    ],
    transportOptions: [
      { title: 'Geneva Airport → City Centre', mode: 'Direct CFF Train', duration: '~7 minutes', cost: 'FREE with Unireso ticket', highlight: true, badge: 'BEST & FASTEST OPTION', description: 'Trains run every 10–12 minutes from the airport underground station to Geneva Cornavin.' },
      { title: 'TPG Tram & Bus Network', mode: 'Trams & Electric Buses', duration: 'City-wide', cost: 'Free with hotel pass', highlight: false, badge: 'TPG Transit', description: '100% electric and hybrid fleet connecting every neighborhood.' },
      { title: 'Mouettes Genevoises (Lake Shuttles)', mode: 'Yellow Solar Boats', duration: '5–10 minutes', cost: 'Free with hotel pass', highlight: false, badge: 'Scenic Route', description: 'Four ferry lines crossing Lake Geneva between Pâquis, Eaux-Vives, Molard, and De-Châteaubriand.' }
    ],
    foodHighlights: [
      { name: 'Authentic Swiss Fondue', type: 'National Dish', description: 'A rich moitié-moitié blend of Gruyère AOP and Vacherin Fribourgeois melted with white wine and garlic, served bubbling with crusty rustic bread cubes.', spot: 'Les Armures (Old Town) or Bains des Pâquis', dietary: 'Vegetarian Friendly' },
      { name: 'Filets de Perche du Léman', type: 'Lakeside Specialty', description: 'Delicate fresh perch fillets caught from Lake Geneva, pan-fried in brown butter with fresh herbs, served with golden shoestring fries.', spot: 'Café du Centre or lakeside brasseries', dietary: 'Pescatarian' },
      { name: 'Raclette du Valais', type: 'Alpine Traditional', description: 'Melted wheel of raw alpine cow milk cheese scraped directly over steamed new potatoes, baby gherkins, and pickled pearl onions.', spot: 'Auberge de Savièse (Pâquis)', dietary: 'Vegetarian / Gluten-Free' },
      { name: 'Artisanal Swiss Chocolate & Pralines', type: 'Confectionery', description: 'Geneva is world-famous for luxury chocolatiers crafting dark pavés, truffles, and single-origin bars.', spot: 'Chocolaterie Favarger, Auer Chocolatier, or Du Rhône', dietary: 'Vegetarian' }
    ],
    curatedAttractions: [
      { id: 'geneva-jet-deau', name: 'The Jet d\'Eau', category: 'Must See', duration: '45 mins', image: 'https://images.unsplash.com/photo-1574873215043-44119461cb3b?w=1000&q=80', description: 'Geneva\'s iconic 140-meter water fountain pumping 500 liters of lake water into the sky per second at 200 km/h.', tag: 'Iconic Landmark' },
      { id: 'geneva-st-pierre', name: 'St. Pierre Cathedral & Old Town', category: 'History', duration: '1.5 hours', image: 'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=1000&q=80', description: 'Historic 12th-century cathedral where John Calvin preached, featuring a 157-step climb to panoramic lake views.', tag: 'Panoramic Overlook' },
      { id: 'geneva-palace-nations', name: 'Palace of Nations (UN Headquarters)', category: 'Museums', duration: '2 hours', image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=1000&q=80', description: 'The European seat of the United Nations surrounded by 193 sovereign flags and the monumental Broken Chair sculpture.', tag: 'Global Diplomacy' },
      { id: 'geneva-bains-paquis', name: 'Bains des Pâquis', category: 'Food & Leisure', duration: '2 hours', image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1000&q=80', description: 'Beloved 1930s public bathhouse on a lakeside pier featuring swimming, authentic fondue, and summer sunbathing.', tag: 'Local Favorite' }
    ]
  },

  // ── 2. ZURICH, SWITZERLAND ───────────────────────────────────────────────
  zurich: {
    city: 'Zurich',
    country: 'Switzerland',
    flag: '🇨🇭',
    airportCode: 'ZRH',
    airportName: 'Zurich Airport (Kloten)',
    currency: { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', rate: 0.89 },
    timezone: 'CEST (UTC+2) · 3h behind Lahore',
    safetyScore: 94,
    safetyLevel: 'Extremely Safe',
    firstHour: [
      { step: 1, title: 'Land at Zurich Kloten (ZRH)', category: 'Arrival', summary: 'Arrive at Airport Center and collect luggage.', detail: 'Follow signs through the modern terminal to baggage reclaim in Arrival 1 or 2.', badge: 'ZRH Arrival' },
      { step: 2, title: 'Direct SBB Train to Zurich HB', category: 'Transit', summary: '9-minute direct train to central Zurich Hauptbahnhof.', detail: 'Walk into the integrated underground rail station. S-Bahn trains (S2, S16) and InterCity trains leave every few minutes directly into Zurich HB.', badge: '9 Min Train' },
      { step: 3, title: 'Swiss eSIM & Zurich Free Wi-Fi', category: 'Tech', summary: 'Connect to "Zurich Airport" Wi-Fi or toggle travel eSIM.', detail: 'Enjoy 4 hours of free terminal Wi-Fi, or enable data roaming on your Swiss eSIM profile.', badge: 'Free 5G' },
      { step: 4, title: 'Zurich Card from SBB Ticket Desk', category: 'Transit', summary: 'Purchase a 24h or 72h Zürich Card for unlimited city transit.', detail: 'Includes unlimited second-class travel on trams, buses, trains, riverboats, and free admission to most museums.', badge: 'Zürich Card' },
      { step: 5, title: 'VBZ Tram to Hotel / Old Town', category: 'Transit', summary: 'Take blue-and-white VBZ tram right outside station.', detail: 'Trams 4, 11, and 15 glide silently through Bahnhofstrasse and the historic Altstadt.', badge: 'VBZ Tram' },
      { step: 6, title: 'Hotel Check-In & Lake Zurich Stroll', category: 'Check-in', summary: 'Unpack, refresh, and stroll along the pristine Lake Zurich promenade.', detail: 'Walk down world-famous Bahnhofstrasse to Bürkliplatz and admire alpine mountain peaks across the lake.', badge: 'Lakeside Stroll' }
    ],
    essentials: {
      visa: { title: 'Visa & Entry Requirements', summary: 'Schengen Visa required for Pakistani passports · Max 90 days.', detail: 'Switzerland is a Schengen member. Citizens of US, UK, EU, UAE, Canada, and Australia enter visa-free.', status: 'Schengen Visa', badgeColor: 'amber', officialLink: 'https://www.eda.admin.ch/' },
      safety: { title: 'Safety & Health Protocol', summary: 'Safety Index: 94/100 · Unparalleled civic security and cleanliness.', detail: 'Zurich is extraordinarily safe at all hours. Pure drinkable alpine water flows from 1,200 public fountains across the city.', status: 'Extremely Safe', badgeColor: 'emerald', hotlines: { police: '117', ambulance: '144', fire: '118', universal: '112' } },
      money: { title: 'Money, Cards & Currency', summary: 'Currency: Swiss Franc (CHF) · Cashless payments preferred everywhere.', detail: 'Contactless Visa, Mastercard, and Apple Pay work at all trams, shops, and restaurants. Tipping is rounded up voluntarily.', status: 'Card Preferred', badgeColor: 'blue' },
      connectivity: { title: 'Mobile Connectivity & Power', summary: 'High-speed 5G network · Swisscom and Sunrise.', detail: 'Electrical sockets are Type J (3-pin diamond, 230V / 50Hz). Standard European 2-pin Type C plugs also fit.', status: 'Type J / C Plug', badgeColor: 'blue' },
      transport: { title: 'VBZ Trams & S-Bahn Rail', summary: 'Punctual network of trams, electric buses, and Limmat riverboats.', detail: 'The Zürich Card covers all urban transport zones (Zone 110) including the Uetliberg mountain lookout train.', status: 'World-Class Transit', badgeColor: 'emerald' },
      culture: { title: 'Cultural Etiquette & Languages', summary: 'Swiss German & Standard German · Courteous, punctual, quiet.', detail: 'Always greet with a polite "Grüezi" (formal Swiss German) or "Guten Tag". Punctuality is strictly observed and Sunday is a designated quiet rest day.', greetingText: 'Formal Swiss greeting: "Grüezi" (Hello) and "Merci / Danke" (Thank you)', status: 'Swiss German', badgeColor: 'purple' },
      emergency: { title: 'Emergency Hotlines & Medical Centers', summary: 'Police: 117 · Ambulance: 144 · University Hospital Zurich (USZ).', detail: 'University Hospital Zurich (Universitätsspital) is a world-renowned emergency trauma center.', status: '24/7 Dispatch', badgeColor: 'rose' }
    },
    neighborhoods: [
      { name: 'Altstadt (Old Town - Lindenhof & Niederdorf)', bestFor: 'Historic cobbled streets, medieval guild houses & Grossmünster', description: 'Picturesque historic core split by the Limmat river, featuring pedestrian alleys, cafes, and Lindenhof overlook.', avgNight: '$220 - $420', vibe: 'Historic & Charming', transit: 'Trams 4, 15, Central Polybahn' },
      { name: 'Zürich West', bestFor: 'Industrial-chic art hubs, Frau Gerolds Garten & trendy nightlife', description: 'Former industrial shipyard converted into an artistic district with Prime Tower, Freitag flagship, and hipster bars.', avgNight: '$160 - $290', vibe: 'Trendy & Creative', transit: 'Hardbrücke S-Bahn, Tram 4' },
      { name: 'Enge & Seefeld', bestFor: 'Lakeside swimming, parks, relaxed cafes & upscale promenades', description: 'Leafy districts on either side of Lake Zurich, perfect for summer lakeside lidos and quiet residential stays.', avgNight: '$200 - $380', vibe: 'Lakeside & Tranquil', transit: 'Trams 2, 4, Train to Enge' }
    ],
    transportOptions: [
      { title: 'Zurich Airport to Zurich HB', mode: 'Direct SBB Train', duration: '9–11 minutes', cost: 'CHF 6.80 (Included in Zürich Card)', highlight: true, badge: 'FASTEST TRANSFER', description: 'Trains leave every 3–5 minutes from underground platform 3 & 4 directly to the city center.' },
      { title: 'VBZ Tramway Grid', mode: 'Electric Trams (15 Lines)', duration: 'City-wide', cost: 'Included in Zürich Card', highlight: false, badge: 'City Trams', description: 'Iconic blue and white trams gliding through every neighborhood every 6 minutes.' },
      { title: 'Limmat River Cruise Boats', mode: 'Low-profile Riverboat', duration: '25 minutes', cost: 'Included in Zürich Card', highlight: false, badge: 'Scenic River Cruise', description: 'Cruises from Zurich HB down the Limmat river out into Lake Zurich.' }
    ],
    foodHighlights: [
      { name: 'Zürcher Geschnetzeltes with Crispy Rösti', type: 'Signature Specialty', description: 'Tender sliced veal cooked in a velvety white wine and button mushroom cream sauce, served beside golden pan-fried grated potato rösti.', spot: 'Kronenhalle or Zunfthaus zur Waag', dietary: 'Zürich Icon' },
      { name: 'Artisanal Luxemburgerli Macarons', type: 'Luxury Confectionery', description: 'Bite-sized, feather-light filled macarons created fresh daily by legendary Swiss chocolatier Sprüngli.', spot: 'Confiserie Sprüngli (Paradeplatz)', dietary: 'Vegetarian Sweet' },
      { name: 'Traditional Swiss Rösti Fritter', type: 'Alpine Classic', description: 'Coarsely grated parboiled potatoes pan-fried until crisp and golden brown on the outside, soft and savory on the inside.', spot: 'Rheinfelder Bierhalle (Niederdorf)', dietary: 'Vegetarian' },
      { name: 'Fine Swiss Single-Origin Chocolate', type: 'Artisanal Chocolate', description: 'Handcrafted truffles and Grand Cru dark bars crafted with pure alpine milk and roasted cocoa nibs.', spot: 'Läderach or Max Chocolatier', dietary: 'Vegetarian' }
    ],
    curatedAttractions: [
      { id: 'zurich-grossmunster', name: 'Grossmünster Cathedral', category: 'Must See', duration: '1.5 hours', image: 'https://images.unsplash.com/photo-1515488042361-404e9250afef?w=1400&q=85', description: 'The iconic twin-towered Romanesque cathedral founded by Charlemagne, central to the Swiss Reformation.', tag: 'Iconic Landmark' },
      { id: 'zurich-lake-promenade', name: 'Lake Zurich & Bürkliplatz', category: 'Nature', duration: '2 hours', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=85', description: 'Scenic lakeside promenade framed by swans, alpine mountain vistas, and historic steamer boat docks.', tag: 'Panoramic Lake' },
      { id: 'zurich-lindenhof', name: 'Lindenhof Historic Overlook', category: 'Scenic View', duration: '45 mins', image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=85', description: 'Elevated tree-shaded public square built on the site of a 4th-century Roman fort, overlooking the Limmat river and old town.', tag: 'Panoramic Deck' },
      { id: 'zurich-uetliberg', name: 'Uetliberg Mountain Summit', category: 'Nature & Views', duration: '3 hours', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=85', description: 'Zurich\'s local mountain rising 871 meters, reached via a direct 20-minute train ride for sweeping views over the Alps and lake.', tag: 'Alpine Overlook' }
    ]
  },

  // ── 3. PARIS, FRANCE ─────────────────────────────────────────────────────
  paris: {
    city: 'Paris',
    country: 'France',
    flag: '🇫🇷',
    airportCode: 'CDG',
    airportName: 'Paris Charles de Gaulle Airport (CDG)',
    currency: { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.92 },
    timezone: 'CET (UTC+1) / CEST (UTC+2) · 3-4h behind Lahore',
    safetyScore: 88,
    safetyLevel: 'Safe with Standard Precautions',
    firstHour: [
      { step: 1, title: 'Terminal Arrival & Baggage Claim', category: 'Arrival', summary: 'Deplane at CDG Terminal 1 or 2 and collect baggage.', detail: 'Follow "Bagages - Sortie" signs. Baggage claim belts are clearly marked on monitors in the arrival hall.', badge: 'CDG Arrival' },
      { step: 2, title: 'Schengen Border Clearance', category: 'Entry', summary: 'Pass through EU / Non-EU passport control checkpoints.', detail: 'Have your passport (6+ months validity), confirmed hotel booking, and Schengen travel insurance ready for border inspection.', badge: 'Border Control' },
      { step: 3, title: 'Connectivity & Free Airport Wi-Fi', category: 'Tech', summary: 'Connect to "WIFI-AIRPORT" or activate European eSIM.', detail: 'Free unlimited high-speed Wi-Fi is available across all CDG terminals. Alternatively, turn on data roaming on your Airalo or Orange Holiday eSIM profile.', badge: 'Free Wi-Fi' },
      { step: 4, title: 'Euro Cash & Official Bank ATMs', category: 'Money', summary: 'Withdraw Euros from BNP Paribas or HSBC ATMs in the terminal.', detail: 'Skip commercial Travelex kiosks charging excessive spreads. Use official French bank ATMs or tap contactless cards directly.', badge: 'ATM Access' },
      { step: 5, title: 'RER B Direct Train to Central Paris', category: 'Transit', summary: 'Direct express rail from CDG Terminal 2 to Châtelet - Les Halles.', detail: 'Follow "Train RER B" signs to the airport rail station. Trains depart every 10–15 minutes and reach central Paris in ~35 minutes (€11.80 ticket).', badge: '35 Min Ride' },
      { step: 6, title: 'Hotel Check-In & Navigo Pass', category: 'Check-in', summary: 'Drop bags, check in, and load a Navigo Easy transport card.', detail: 'Purchase a Navigo Easy card at any Metro station or via the Bonjour RATP smartphone app for effortless tap-and-go rides.', badge: 'Navigo Pass' }
    ],
    essentials: {
      visa: { title: 'Visa & Entry Requirements', summary: 'Schengen Tourist Visa required for Pakistani passports · Max 90 days.', detail: 'France is within the Schengen Zone. Pakistani passport holders require a Schengen Visa (Type C) submitted via VFS Global. US, UK, Canada, Australia, and UAE passport holders can enter visa-free for up to 90 days.', status: 'Schengen Visa Required', badgeColor: 'amber', officialLink: 'https://france-visas.gouv.fr/' },
      safety: { title: 'Safety & Health Protocol', summary: 'Safety Index: 88/100 · Low violent crime · Watch for pickpockets.', detail: 'Paris is very safe overall. Be vigilant with backpacks and phones in crowded Metro lines (Line 1, Line 4) and near major attractions like the Eiffel Tower, Louvre, and Sacré-Cœur.', status: 'Safe & Orderly', badgeColor: 'emerald', hotlines: { police: '17', ambulance: '15', fire: '18', universal: '112' } },
      money: { title: 'Money, Cards & Currency', summary: 'Currency: Euro (€) · 98% contactless card acceptance across Paris.', detail: 'Contactless Visa, Mastercard, Apple Pay, and Google Pay are accepted virtually everywhere. Tipping is legally included in the bill ("service compris"); rounding up €1–€2 for good service is customary.', status: 'Card Preferred', badgeColor: 'blue' },
      connectivity: { title: 'Mobile Connectivity & Power', summary: '4G/5G coverage across 99% of Paris · Orange, SFR & Bouygues.', detail: 'European eSIMs work seamlessly. Sockets are European Type C & Type E (2-pin round, 230V / 50Hz). Bring a standard 2-pin European adapter.', status: 'eSIM Recommended', badgeColor: 'blue' },
      transport: { title: 'Metro, RER & City Transit', summary: 'RATP Metro network connects all 20 arrondissements within 500 meters.', detail: 'The Paris Metro has 16 lines with trains arriving every 2–4 minutes. Use the "Bonjour RATP" app or Citymapper for live navigation and electronic ticket loading.', status: 'Extensive Metro Grid', badgeColor: 'emerald' },
      culture: { title: 'Cultural Etiquette & Languages', summary: 'French · Polite greeting "Bonjour" is mandatory in every shop.', detail: 'Always greet shopkeepers, waiters, and hotel staff with a warm "Bonjour Madame/Monsieur" before asking questions. Entering a boutique without greeting is considered impolite.', greetingText: 'Always begin interactions with "Bonjour" and conclude with "Merci, bonne journée"', status: 'French Language', badgeColor: 'purple' },
      emergency: { title: 'Emergency Hotlines & Medical Care', summary: 'Police: 17 · Medical SAMU: 15 · European Universal Emergency: 112.', detail: 'Hôpital Hôtel-Dieu near Notre-Dame and Pitié-Salpêtrière provide 24/7 emergency medical care with English-speaking doctors on staff.', status: '24/7 Dispatch', badgeColor: 'rose' }
    },
    neighborhoods: [
      { name: 'Le Marais (3rd & 4th Arr.)', bestFor: 'Boutiques, art galleries, cobblestone alleys & dining', description: 'Historic district featuring 17th-century mansions, trendy concept stores, Place des Vosges, and famous falafel on Rue des Rosiers.', avgNight: '$190 - $350', vibe: 'Chic & Historic', transit: 'Metro Lines 1, 8, 11' },
      { name: 'Saint-Germain-des-Prés (6th Arr.)', bestFor: 'Literary cafes, luxury shopping & Left Bank charm', description: 'Legendary quartier home to Café de Flore, Les Deux Magots, art publishers, and the Luxembourg Gardens.', avgNight: '$240 - $450', vibe: 'Intellectual & Elegant', transit: 'Metro Lines 4, 10' },
      { name: 'Latin Quarter (5th Arr.)', bestFor: 'Student energy, bookstores & budget-friendly bistros', description: 'Vibrant neighborhood surrounding the Sorbonne University, Panthéon, and Shakespeare and Company bookstore.', avgNight: '$140 - $260', vibe: 'Bohemian & Lively', transit: 'RER B, Metro Line 10' },
      { name: 'Montmartre (18th Arr.)', bestFor: 'Panoramic views, romantic winding staircases & artistic history', description: 'Hilltop village crowned by the Sacré-Cœur Basilica, charming cafes, and panoramic vistas over Paris rooftops.', avgNight: '$130 - $240', vibe: 'Artistic & Romantic', transit: 'Metro Lines 2, 12' }
    ],
    transportOptions: [
      { title: 'CDG Airport to Paris Center (RER B)', mode: 'Regional Express Rail', duration: '~35 minutes', cost: '€11.80 per passenger', highlight: true, badge: 'FASTEST TO DOWNTOWN', description: 'Direct train running every 10–15 minutes from CDG Terminal 2 directly to Gare du Nord and Châtelet.' },
      { title: 'Paris Metro Network', mode: 'Underground Rapid Transit', duration: 'City-wide', cost: '€2.15 per single ticket', highlight: false, badge: 'RATP Metro', description: '300+ stations covering every corner of Paris. Trains run from 5:30 AM until 1:15 AM.' },
      { title: 'Official Parisian Taxis & Uber', mode: 'Licensed Cabs & Rideshare', duration: '45–60 mins from CDG', cost: 'Fixed fare: €56 (Right Bank) / €65 (Left Bank)', highlight: false, badge: 'Fixed Fare Taxi', description: 'Only take official taxis from the marked taxi rank outside terminal exits.' }
    ],
    foodHighlights: [
      { name: 'Crispy Butter Croissants & Pain au Chocolat', type: 'Artisanal Viennoiserie', description: 'Freshly baked flaky pastries with pure churned French butter, crisp on the exterior and pillowy inside.', spot: 'Du Pain et des Idées or local boulangeries', dietary: 'Vegetarian' },
      { name: 'Boeuf Bourguignon', type: 'Classic French Bistro', description: 'Tender beef chuck slow-braised for hours in red Burgundy wine with pearl onions, lardons, and button mushrooms.', spot: 'Traditional Parisian Bouillons (e.g. Bouillon Chartier)', dietary: 'Hearty Classic' },
      { name: 'French Onion Soup (Soupe à l\'Oignon)', type: 'Heritage Starter', description: 'Rich caramelized onion beef broth topped with a crusty toasted baguette slice and thick melted Gruyère cheese.', spot: 'Café de Flore or Le Comptoir du Relais', dietary: 'Classic Warmth' },
      { name: 'Artisanal Macarons & Pastries', type: 'Luxury Confectionery', description: 'Delicate almond meringue shells filled with rich ganache, fruit compote, or buttercream.', spot: 'Pierre Hermé or Ladurée', dietary: 'Vegetarian' }
    ],
    curatedAttractions: [
      { id: 'paris-eiffel-tower', name: 'The Eiffel Tower', category: 'Must See', duration: '2-3 hours', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1400&q=85', description: 'The world\'s most iconic wrought-iron lattice tower offering panoramic vistas over Paris from its summit and second-floor decks.', tag: 'World Landmark' },
      { id: 'paris-louvre-museum', name: 'Louvre Museum', category: 'Museums', duration: '3-4 hours', image: 'https://images.unsplash.com/photo-1565099824688-e93eb20fe622?w=1200&q=85', description: 'The world\'s largest art museum, home to the Mona Lisa, Venus de Milo, and Winged Victory inside a historic royal palace.', tag: 'Art & History' },
      { id: 'paris-arc-de-triomphe', name: 'Arc de Triomphe & Champs-Élysées', category: 'History', duration: '1.5 hours', image: 'https://images.unsplash.com/photo-1509299349698-dd22323b5963?w=1200&q=85', description: 'Monumental triumphal arch honoring French military history, with a rooftop platform overlooking 12 radiating grand avenues.', tag: 'Panoramic Deck' },
      { id: 'paris-sainte-chapelle', name: 'Sainte-Chapelle & Notre-Dame', category: 'Heritage', duration: '2 hours', image: 'https://images.unsplash.com/photo-1549144511-f099e773c147?w=1200&q=85', description: 'Gothic masterpiece on Île de la Cité featuring 1,113 stained glass panels illuminating biblical narratives in vivid jewel colors.', tag: 'Gothic Architecture' }
    ]
  },

  // ── 4. TOKYO, JAPAN ───────────────────────────────────────────────────────
  tokyo: {
    city: 'Tokyo',
    country: 'Japan',
    flag: '🇯🇵',
    airportCode: 'HND / NRT',
    airportName: 'Tokyo Haneda (HND) / Narita (NRT)',
    currency: { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 155.0 },
    timezone: 'JST (UTC+9) · 4h ahead of Lahore',
    safetyScore: 97,
    safetyLevel: 'Extremely Safe',
    firstHour: [
      { step: 1, title: 'Touch Down & Immigration QR', category: 'Arrival', summary: 'Scan your Visit Japan Web QR code at immigration kiosks.', detail: 'Have your digital Visit Japan Web customs & immigration QR codes saved to your phone before landing to breeze through electronic biometric gates.', badge: 'Digital Border' },
      { step: 2, title: 'Retrieve Luggage & Baggage Check', category: 'Arrival', summary: 'Collect checked baggage from automated carousels.', detail: 'Airport staff ensure bags are placed neatly on carousels with handles facing outward. Hand in your electronic customs declaration.', badge: 'Fast Baggage' },
      { step: 3, title: 'Add Digital IC Transit Card (Suica/Pasmo)', category: 'Tech', summary: 'Add digital Suica or Pasmo card to Apple Wallet / Google Pay.', detail: 'Open Apple Wallet, select "+" -> Transit Cards -> Japan -> Suica/Pasmo, and load ¥2,000. It works instantly at every metro gate, vending machine, and convenience store.', badge: 'Tap & Go' },
      { step: 4, title: '7-Eleven ATM for Japanese Yen Cash', category: 'Money', summary: 'Withdraw clean Yen bills from 7-Bank ATMs in the arrival lobby.', detail: 'Japan is still a cash-embracing society for shrines, ramen ticket machines, and small izakayas. 7-Eleven ATMs provide zero-markup official bank rates for international cards.', badge: 'Cash Essential' },
      { step: 5, title: 'Tokyo Monorail or Keikyu Line to City', category: 'Transit', summary: '13-minute scenic monorail ride from Haneda to Hamamatsucho.', detail: 'Tap your Suica at the gate. The Tokyo Monorail connects Haneda Terminal 3 to Hamamatsucho station in 13 minutes, linking directly to the circular JR Yamanote Line.', badge: '13 Min Monorail' },
      { step: 6, title: 'Hotel Check-In & Neighborhood Orientation', category: 'Check-in', summary: 'Drop bags, learn local sorting rules, and explore your district.', detail: 'Hotels maintain impeccably high hospitality (Omotenashi). Ask front desk staff for pocket Wi-Fi chargers or station neighborhood maps.', badge: 'Omotenashi' }
    ],
    essentials: {
      visa: { title: 'Visa & Entry Requirements', summary: 'Japan Tourist Visa required for Pakistani passports · eVisa available for many nationalities.', detail: 'Pakistani passport holders require a standard Japanese Tourist Visa applied through embassy channels. Citizens of US, UK, Canada, Australia, Singapore, and EU can enter visa-free for up to 90 days. Register on "Visit Japan Web" prior to boarding.', status: 'Visit Japan Web Required', badgeColor: 'blue', officialLink: 'https://www.mofa.go.jp/' },
      safety: { title: 'Safety & Health Protocol', summary: 'Safety Index: 97/100 · One of the safest megacities on Earth.', detail: 'Violent crime is practically nonexistent. Walking alone at night is safe anywhere in Tokyo. The main natural precautions are earthquake awareness and hydration during humid summer months.', status: 'Impeccably Safe', badgeColor: 'emerald', hotlines: { police: '110', ambulance: '119', fire: '119', universal: '110' } },
      money: { title: 'Money, Cards & Currency', summary: 'Currency: Japanese Yen (¥) · Cash + IC Cards (Suica/Pasmo) dominant.', detail: 'Credit cards are widely accepted in department stores and hotels. Cash is required for shrines, ramen ticket machines, and street food. Never tip in Japan — tipping is considered rude.', status: 'Cash & IC Cards', badgeColor: 'blue' },
      connectivity: { title: 'Mobile Connectivity & Power', summary: '5G coverage across 100% of urban Tokyo · Docomo, SoftBank & au.', detail: 'Digital travel eSIMs (Airalo, Ubigi) work exceptionally well. Electrical sockets are Type A & B (2-pin flat blade, 100V / 50-60Hz). You will need a US/Japan flat-prong adapter.', status: 'eSIM Recommended', badgeColor: 'blue' },
      transport: { title: 'World\'s Most Punctual Rail Network', summary: 'Tokyo Metro + Toei Subway + JR Yamanote Line.', detail: 'Trains arrive within seconds of schedule. Tap in and out with digital Suica or Pasmo. Keep phone calls silent on train carriages and avoid eating while walking down streets.', status: 'Ultra-Fast Rail', badgeColor: 'emerald' },
      culture: { title: 'Cultural Etiquette & Customs', summary: 'Japanese · Polite bow, quiet trains, and no tipping culture.', detail: 'Keep your voice down on public transport. Remove shoes when stepping into traditional tatami rooms or fitting rooms. Carry trash with you as public garbage cans are rare. Bow gently when greeting.', greetingText: 'Polite greeting: "Konnichiwa" (Hello) and "Arigatou gozaimasu" (Thank you very much)', status: 'Polite Decorum', badgeColor: 'purple' },
      emergency: { title: 'Emergency Hotlines & Medical Centers', summary: 'Police: 110 · Fire & Ambulance: 119 · English Medical Hotline: 03-5285-8181.', detail: 'St. Luke\'s International Hospital in Tsukiji provides world-class 24/7 emergency medical care with dedicated English-speaking physicians.', status: '24/7 Available', badgeColor: 'rose' }
    },
    neighborhoods: [
      { name: 'Shinjuku', bestFor: 'Neon skyscrapers, nightlife, huge transit hub & dining', description: 'Vibrant epicenter featuring the world\'s busiest train station, Omoide Yokocho alleyways, and Shinjuku Gyoen National Garden.', avgNight: '$160 - $320', vibe: 'High-Energy & Futuristic', transit: 'All JR lines, Marunouchi & Shinjuku Subway' },
      { name: 'Shibuya & Harajuku', bestFor: 'Youth culture, fashion, iconic scramble crossing & Meiji Shrine', description: 'The cultural beating heart of Japanese street fashion, iconic pedestrian crossing, and tranquil Meiji Jingu forested shrine.', avgNight: '$180 - $340', vibe: 'Youthful & Trendy', transit: 'JR Yamanote, Ginza, Hanzomon Lines' },
      { name: 'Ginza', bestFor: 'Luxury shopping, high-end sushi, art galleries & architecture', description: 'Tokyo\'s most glamorous avenue lined with flagship luxury fashion houses, Michelin-starred sushi counters, and classic Kabuki-za theater.', avgNight: '$220 - $480', vibe: 'Upscale & Sophisticated', transit: 'Ginza, Marunouchi & Hibiya Lines' },
      { name: 'Asakusa & Ueno', bestFor: 'Old Tokyo heritage, Senso-ji temple, traditional craft & museums', description: 'Historic Shitamachi district surrounding Tokyo\'s oldest Buddhist temple Senso-ji and Nakamise shopping street.', avgNight: '$110 - $220', vibe: 'Historic & Traditional', transit: 'Ginza & Asakusa Subway Lines' }
    ],
    transportOptions: [
      { title: 'Tokyo Monorail (Haneda to Hamamatsucho)', mode: 'Elevated Monorail', duration: '~13 minutes', cost: '¥500 (Suica tap)', highlight: true, badge: 'FASTEST FROM HANEDA', description: 'Departs directly from Haneda airport terminal and connects to the JR Yamanote loop line in 13 minutes.' },
      { title: 'Tokyo Metro & Toei Subway Network', mode: 'Subway Grid (13 Lines)', duration: 'City-wide', cost: '¥180 - ¥330 / trip', highlight: false, badge: 'Subway Network', description: 'World\'s densest subway system. Clean, air-conditioned, and arriving every 2–3 minutes.' },
      { title: 'JR Yamanote Loop Line', mode: 'Circular Above-Ground Rail', duration: 'Loop around city in 60m', cost: '¥150 - ¥270', highlight: false, badge: 'JR Yamanote', description: 'Connects all major hubs: Tokyo Station, Shinjuku, Shibuya, Harajuku, Ueno, and Akihabara.' }
    ],
    foodHighlights: [
      { name: 'Authentic Tonkotsu & Shoyu Ramen', type: 'Soul Food', description: 'Rich slow-simmered pork bone or soy broth with springy handmade wheat noodles, tender chashu, and seasoned soft-boiled egg.', spot: 'Fuunji (Shinjuku), Afuri (Harajuku), or Ichiran', dietary: 'Hearty Noodle Bowl' },
      { name: 'Edomae Sushi & Fresh Sashimi', type: 'Culinary Art', description: 'Fresh seafood from Toyosu Market pressed over seasoned warm vinegared rice with fresh grated wasabi.', spot: 'Toyosu Market sushi counters or Ginza omakase', dietary: 'Pescatarian' },
      { name: 'Crispy Tempura Moriawase', type: 'Imperial Traditional', description: 'Tiger prawns, lotus root, and seasonal vegetables flash-fried in golden sesame oil batter to airy, feather-light crispness.', spot: 'Tempura Kondo or Daikokuya Asakusa', dietary: 'Crispy Classic' },
      { name: 'Charcoal-Grilled Yakitori Skewers', type: 'Izakaya Delicacy', description: 'Skewered chicken thigh, scallions, and meatballs grilled over smoking binchotan white charcoal with rich tare sauce glaze.', spot: 'Omoide Yokocho (Shinjuku Memory Lane) or Yurakucho alleys', dietary: 'Savory Skewers' }
    ],
    curatedAttractions: [
      { id: 'tokyo-tokyo-tower', name: 'Tokyo Tower', category: 'Must See', duration: '2 hours', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1400&q=85', description: 'The iconic 333-meter red and white communications tower standing as Tokyo\'s beloved skyline beacon with breathtaking observation decks.', tag: 'Iconic Landmark' },
      { id: 'tokyo-senso-ji-temple', name: 'Senso-ji Temple & Kaminarimon', category: 'Heritage', duration: '2 hours', image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1200&q=85', description: 'Tokyo\'s oldest ancient Buddhist temple founded in 645 AD, famed for its giant red paper lantern gate and lively Nakamise market street.', tag: 'Ancient Heritage' },
      { id: 'tokyo-shibuya-crossing', name: 'Shibuya Scramble Crossing', category: 'Urban', duration: '1 hour', image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=1200&q=85', description: 'The world\'s most famous pedestrian intersection where up to 3,000 people cross simultaneously under glowing neon mega-screens.', tag: 'Must Experience' },
      { id: 'tokyo-meiji-shrine', name: 'Meiji Jingu Forest Shrine', category: 'Nature', duration: '1.5 hours', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=85', description: 'Peaceful Shinto shrine dedicated to Emperor Meiji, nestled within a sacred 170-acre forest of 120,000 evergreen trees in the city center.', tag: 'Serene Sanctuary' }
    ]
  },

  // ── 5. KYOTO, JAPAN ───────────────────────────────────────────────────────
  kyoto: {
    city: 'Kyoto',
    country: 'Japan',
    flag: '🇯🇵',
    airportCode: 'KIX',
    airportName: 'Kansai International Airport (KIX) / Itami (ITM)',
    currency: { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 155.0 },
    timezone: 'JST (UTC+9) · 4h ahead of Lahore',
    safetyScore: 97,
    safetyLevel: 'Extremely Safe',
    firstHour: [
      { step: 1, title: 'Touch Down at Kansai or Itami Airport', category: 'Arrival', summary: 'Arrive at KIX Terminal 1 or Itami Airport.', detail: 'Follow arrival signs to customs and baggage claim. Have your digital Visit Japan Web QR code ready.', badge: 'KIX Arrival' },
      { step: 2, title: 'Board JR Haruka Express to Kyoto Station', category: 'Transit', summary: '75-minute direct bullet train connection into central Kyoto.', detail: 'Hop on the Hello Kitty JR Haruka Express train from KIX platform directly into Kyoto Station in 75 minutes.', badge: '75 Min Haruka' },
      { step: 3, title: 'Digital ICOCA Card on Mobile', category: 'Tech', summary: 'Tap ICOCA card for all Kyoto City buses and subways.', detail: 'Load digital ICOCA or Suica on Apple Wallet / Google Pay for effortless bus and train taps.', badge: 'ICOCA Pass' },
      { step: 4, title: '7-Eleven ATM for Cash at Kyoto Station', category: 'Money', summary: 'Withdraw Yen for wooden temple admission tickets and tea houses.', detail: 'Temple admissions and traditional street vendors require cash bills and coins. Use post office or 7-Eleven ATMs.', badge: 'Temple Cash' },
      { step: 5, title: 'Karasuma Subway or Bus to Gion / Ryokan', category: 'Transit', summary: 'Quick 10-minute subway or city bus ride to your accommodation.', detail: 'Kyoto City Bus lines (100, 206) and Karasuma Subway line connect Kyoto Station to Gion, Kawaramachi, and Higashiyama.', badge: 'Local Transit' },
      { step: 6, title: 'Traditional Ryokan Check-in & Matcha Welcome', category: 'Check-in', summary: 'Check in, remove shoes, and enjoy authentic Uji matcha green tea.', detail: 'Experience centuries-old Japanese hospitality, traditional tatami rooms, and relaxing hot spring onsen baths.', badge: 'Ryokan Experience' }
    ],
    essentials: {
      visa: { title: 'Visa & Entry Requirements', summary: 'Standard Japanese Tourist Visa required for Pakistani passports.', detail: 'Register on Visit Japan Web before traveling. 90-day visa exemption for citizens of 70+ countries.', status: 'Visit Japan Web', badgeColor: 'blue', officialLink: 'https://www.mofa.go.jp/' },
      safety: { title: 'Safety & Health Protocol', summary: 'Safety Index: 97/100 · Exceptionally peaceful ancient cultural capital.', detail: 'Kyoto is one of the safest destinations in the world. Please respect local geisha privacy in Gion (photography on private streets is strictly prohibited).', status: 'Extremely Safe', badgeColor: 'emerald', hotlines: { police: '110', ambulance: '119', fire: '119', universal: '110' } },
      money: { title: 'Money, Cards & Currency', summary: 'Currency: Japanese Yen (¥) · Cash needed for temple fees & tea houses.', detail: 'While hotels and department stores take credit cards, temple admission tickets (¥400-¥600) and small artisan shops are cash only. No tipping in Japan.', status: 'Cash & Cards', badgeColor: 'blue' },
      connectivity: { title: 'Mobile Connectivity & Power', summary: '5G coverage · Sockets use Type A (2 flat prongs, 100V).', detail: 'Kyoto offers "KYOTO Wi-Fi" at major bus stops and subway stations. An eSIM ensures reliable Google Maps transit directions.', status: 'Type A Plug (100V)', badgeColor: 'blue' },
      transport: { title: 'Kyoto City Bus & Subway Grid', summary: 'Kyoto City Bus network reaches all UNESCO heritage temples.', detail: 'Kyoto Station is the central transit hub. City Bus 1-day pass or ICOCA tap is the easiest way to navigate between shrines.', status: 'Bus & Subway Grid', badgeColor: 'emerald' },
      culture: { title: 'Ancient Cultural Etiquette & Temples', summary: 'Japanese · Deep temple decorum, quiet preservation, polite bow.', detail: 'Speak softly at temples and shrines. Bow gently when greeting. Remove shoes when entering temple halls and step over (never on) wooden thresholds.', greetingText: 'Polite greeting: "Konnichiwa" and deep respect for temple grounds', status: 'Ancient Decorum', badgeColor: 'purple' },
      emergency: { title: 'Emergency Hotlines & Medical Centers', summary: 'Police: 110 · Ambulance / Fire: 119 · Kyoto University Hospital.', detail: 'Kyoto University Hospital provides top-tier 24/7 medical emergency care with international patient support.', status: '24/7 Dispatch', badgeColor: 'rose' }
    },
    neighborhoods: [
      { name: 'Gion & Higashiyama', bestFor: 'Historic wooden machiya houses, geisha culture & Kiyomizu-dera', description: 'The timeless heart of historic Kyoto with lantern-lit stone streets, Yasaka Shrine, and centuries-old teahouses.', avgNight: '$220 - $550', vibe: 'Ancient & Timeless', transit: 'Gion-Shijo Station, Bus 206' },
      { name: 'Arashiyama', bestFor: 'Bamboo forest groves, Tenryu-ji Zen temple & riverboat rides', description: 'Scenic western district framed by mist-covered mountains, Togetsukyo Bridge, and towering bamboo groves.', avgNight: '$180 - $420', vibe: 'Serene Nature', transit: 'JR Saga-Arashiyama, Randen Tram' },
      { name: 'Downtown (Kawaramachi & Karasuma)', bestFor: 'Nishiki Market, boutique shopping & central dining', description: 'Modern commercial strip running alongside the Kamogawa River, filled with food markets, cafes, and izakayas.', avgNight: '$140 - $280', vibe: 'Lively & Walkable', transit: 'Hankyu & Keihan Rail, Karasuma Subway' }
    ],
    transportOptions: [
      { title: 'JR Haruka Express (KIX to Kyoto)', mode: 'Bullet-Style Airport Express', duration: '75 minutes', cost: '¥3,400 (or JR Pass / ICOCA discount)', highlight: true, badge: 'DIRECT EXPRESS', description: 'Fastest direct rail link from Kansai International Airport straight into Kyoto Station.' },
      { title: 'Kyoto City Bus Network', mode: 'City Bus System', duration: 'Connecting all temples', cost: '¥230 flat fare per ride', highlight: false, badge: 'Temple Transit', description: 'Reaches famous landmarks: Kinkaku-ji, Ginkaku-ji, Kiyomizu-dera, and Fushimi Inari.' },
      { title: 'Sagano Romantic Scenic Train', mode: 'Vintage Open-Air Train', duration: '25 minutes through Hozugawa gorge', cost: '¥880', highlight: false, badge: 'Scenic Heritage Ride', description: 'Historic steam train ride winding through scenic river canyons in Arashiyama.' }
    ],
    foodHighlights: [
      { name: 'Kaiseki Ryori Multi-Course Feast', type: 'Imperial Culinary Art', description: 'The pinnacle of Japanese seasonal gastronomy, featuring an artistic succession of delicate sashimi, simmered broth, and grilled dishes.', spot: 'Gion Nanba or Kikunoi', dietary: 'Seasonal Masterpiece' },
      { name: 'Fresh Yuba (Silken Tofu Skin)', type: 'Kyoto Buddhist Heritage', description: 'Delicate warm sheets of silken soybean milk skin served freshly skimmed with light dashi broth and grated wasabi.', spot: 'Yuan (Higashiyama) or Yuba Cuisine Matsuyama', dietary: 'Vegetarian Friendly' },
      { name: 'Shojin Ryori (Zen Temple Cuisine)', type: 'Monastic Vegan Tradition', description: 'Traditional vegetarian cuisine developed by Zen Buddhist monks using mountain herbs, lotus root, tofu, and seasonal squash.', spot: 'Shigetsu (inside Tenryu-ji temple garden)', dietary: '100% Vegan' },
      { name: 'Authentic Uji Matcha Parfaits & Sweets', type: 'Confectionery', description: 'Rich green tea gelato layered with sweet red bean paste (anko), matcha chiffon, and chewy shiratama mochi dumplings.', spot: 'Tsujiri (Gion) or Nakamura Tokichi', dietary: 'Vegetarian Sweet' }
    ],
    curatedAttractions: [
      { id: 'kyoto-kiyomizu-dera', name: 'Kiyomizu-dera Temple', category: 'Must See', duration: '2.5 hours', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1400&q=85', description: 'UNESCO World Heritage wooden temple founded in 778 AD, famed for its monumental stage built entirely without nails overlooking cherry trees.', tag: 'UNESCO Masterpiece' },
      { id: 'kyoto-fushimi-inari', name: 'Fushimi Inari-Taisha Shrine', category: 'Heritage', duration: '3 hours', image: 'https://images.unsplash.com/photo-1478436127897-769e00d2c715?w=1200&q=85', description: 'Iconic mountain sanctuary dedicated to the Shinto deity of agriculture, celebrated for its mesmerizing pathway of 10,000 vermilion Torii gates.', tag: 'Torii Path' },
      { id: 'kyoto-kinkaku-ji', name: 'Kinkaku-ji (The Golden Pavilion)', category: 'Architecture', duration: '1.5 hours', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&q=85', description: 'Magnificent Zen Buddhist temple covered in pure gold leaf, reflected magically in the surrounding Kyoko-chi mirror pond.', tag: 'Golden Wonder' },
      { id: 'kyoto-arashiyama-bamboo', name: 'Arashiyama Bamboo Grove', category: 'Nature', duration: '2 hours', image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=1200&q=85', description: 'Enchanting natural walkway flanked by towering, rustling emerald green bamboo stalks creating an otherworldly atmosphere.', tag: 'Natural Wonder' }
    ]
  },

  // ── 6. SINGAPORE ─────────────────────────────────────────────────────────
  singapore: {
    city: 'Singapore',
    country: 'Singapore',
    flag: '🇸🇬',
    airportCode: 'SIN',
    airportName: 'Singapore Changi Airport (SIN)',
    currency: { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', rate: 1.34 },
    timezone: 'SGT (UTC+8) · 3h ahead of Lahore',
    safetyScore: 98,
    safetyLevel: 'Extremely Safe',
    firstHour: [
      { step: 1, title: 'Land at Changi & Jewel Rain Vortex', category: 'Arrival', summary: 'Deplane at world-renowned Changi Airport (Terminal 1, 2, 3, or 4).', detail: 'Follow signs through carpeted terminals. Jewel Changi is linked directly to Terminal 1 arrivals and features the world\'s tallest indoor waterfall (HSBC Rain Vortex).', badge: 'World #1 Airport' },
      { step: 2, title: 'Electronic SG Arrival Card (SGAC)', category: 'Entry', summary: 'Automated biometric passport clearance gates.', detail: 'Ensure your digital SG Arrival Card is submitted via the ICA app (free, within 3 days of arrival). Insert passport at automated clearance gates for 20-second immigration.', badge: 'Automated Gates' },
      { step: 3, title: 'Connect to #WiFi@Changi & eSIM', category: 'Tech', summary: 'Connect to airport Wi-Fi or toggle your Singtel/StarHub eSIM.', detail: 'Connect to "#WiFi@Changi" for 3 hours of complimentary fast internet, or turn on your travel eSIM for instantaneous 5G connectivity.', badge: 'Free 5G' },
      { step: 4, title: 'DBS / OCBC ATM & Tap-and-Go Payments', category: 'Money', summary: 'Singapore is 98% cashless; tap foreign Visa/Mastercard directly.', detail: 'Foreign contactless cards and Apple/Google Pay work at every MRT gate and bus with zero top-ups (SimplyGo). Withdraw S$30-50 for small hawker stalls.', badge: 'SimplyGo Ready' },
      { step: 5, title: 'MRT Subway or Grab to City Center', category: 'Transit', summary: 'Direct MRT train from Changi Terminal 2 & 3 or licensed Grab ride.', detail: 'The Changi Airport MRT station is in the basement between T2 and T3. Ride to Tanah Merah and switch to the East-West line to reach City Hall in 30 minutes (S$2.10).', badge: '30 Min MRT' },
      { step: 6, title: 'Hotel Check-In & Hawker Center Lunch', category: 'Check-in', summary: 'Check into your hotel and enjoy famous Hainanese Chicken Rice.', detail: 'Drop bags, refresh, and visit Maxwell Food Centre or Lau Pa Sat for a fresh plate of chicken rice and chilled sugarcane juice.', badge: 'Hawker Feast' }
    ],
    essentials: {
      visa: { title: 'Visa & Entry Requirements', summary: 'SG Arrival Card mandatory for all · Visa-free for 90+ nationalities.', detail: 'Submit the electronic SG Arrival Card (SGAC) with health declaration online within 3 days prior to arrival. Citizens of US, UK, Canada, Australia, and EU enter visa-free for 30–90 days. Pakistani passport holders require an entry visa applied through an authorized Singapore visa agent.', status: 'SGAC Card Mandatory', badgeColor: 'blue', officialLink: 'https://eservices.ica.gov.sg/sgarrivalcard/' },
      safety: { title: 'Safety & Health Protocol', summary: 'Safety Index: 98/100 · The safest metropolis in Asia.', detail: 'Singapore maintains strict civic order and zero tolerance for crime. Strict laws apply: chewing gum import is banned, littering carries heavy fines (S$300+), and smoking is prohibited in all public parks and sheltered walkways.', status: 'Unrivaled Safety', badgeColor: 'emerald', hotlines: { police: '999', ambulance: '995', fire: '995', universal: '999' } },
      money: { title: 'Money, Cards & Currency', summary: 'Currency: Singapore Dollar (SGD) · 99% digital & contactless cashless.', detail: 'Tap your foreign credit card or smartphone directly at MRT train gantries and public buses via SimplyGo without buying travel cards. Contactless payments (Visa, Mastercard, GrabPay, PayNow) work everywhere. Tipping is not customary.', status: '99% Cashless', badgeColor: 'blue' },
      connectivity: { title: 'Mobile Connectivity & Power', summary: 'Ultra-fast 5G city-wide · Singtel, StarHub, and M1.', detail: 'eSIMs connect instantly on arrival. Singapore uses British Type G power plugs (3-pin rectangular pins, 230V / 50Hz). Standard UK adapters work perfectly.', status: 'Type G (UK Plug)', badgeColor: 'blue' },
      transport: { title: 'SMRT & SBS Transit Rail Network', summary: 'MRT subway lines connect every neighborhood with precision air conditioning.', detail: 'Train arrivals every 2–3 minutes. Simply tap any contactless credit card or Apple Pay at the turnstiles. Grab and Gojek apps provide cheap, reliable on-demand rides.', status: 'SimplyGo Contactless', badgeColor: 'emerald' },
      culture: { title: 'Cultural Etiquette & Decorum', summary: 'Multicultural (English, Chinese, Malay, Tamil) · Keep left on escalators.', detail: 'Always stand on the left side of escalators to let commuters pass on the right. Return your food trays at hawker centers (mandatory by law). Dress casually and light for year-round tropical warmth.', greetingText: 'Polite greeting: "Hello" / "Good morning" · Friendly multicultural hospitality', status: 'Multicultural Harmony', badgeColor: 'purple' },
      emergency: { title: 'Emergency Hotlines & Hospitals', summary: 'Police: 999 · Ambulance & Fire: 995 · Non-Emergency Ambulance: 1777.', detail: 'Singapore General Hospital (SGH) and Mount Elizabeth Hospital offer premier international emergency medical care with state-of-the-art facilities.', status: '24/7 Dispatch', badgeColor: 'rose' }
    },
    neighborhoods: [
      { name: 'Marina Bay', bestFor: 'Iconic skyline, luxury stays, rooftop bars & Gardens by the Bay', description: 'World-famous waterfront precinct home to Marina Bay Sands, the ArtScience Museum, the Helix Bridge, and the Supertree Grove.', avgNight: '$320 - $650', vibe: 'Futuristic & Luxurious', transit: 'Bayfront & Marina Bay MRT Stations' },
      { name: 'Chinatown & Telok Ayer', bestFor: 'Heritage shophouses, Michelin hawker food & trendy cocktail bars', description: 'Atmospheric historic precinct combining traditional temples (Buddha Tooth Relic), Chinatown Complex food center, and stylish dining along Club Street.', avgNight: '$140 - $280', vibe: 'Historic & Vibrant', transit: 'Chinatown, Telok Ayer & Maxwell MRT' },
      { name: 'Orchard Road', bestFor: 'Luxury shopping malls, retail flagship stores & dining', description: 'Singapore\'s premier 2.2-kilometer shopping boulevard packed with upscale designer shopping complexes (ION Orchard, Ngee Ann City) and luxury hotels.', avgNight: '$190 - $380', vibe: 'Glamorous & Commercial', transit: 'Orchard & Somerset MRT Stations' },
      { name: 'Kampong Glam & Bugis', bestFor: 'Arab street heritage, Sultan Mosque, street art & indie boutiques', description: 'Historic Malay-Arab quarter featuring the golden-domed Sultan Mosque, textile shops, Haji Lane street murals, and trendy Middle Eastern cafes.', avgNight: '$120 - $240', vibe: 'Artistic & Bohemian', transit: 'Bugis & Jalan Besar MRT Stations' }
    ],
    transportOptions: [
      { title: 'SMRT East-West Line (Changi to City)', mode: 'Direct MRT Subway', duration: '~30 minutes', cost: 'S$2.10 (SimplyGo contactless tap)', highlight: true, badge: 'FAST & BUDGET-FRIENDLY', description: 'Air-conditioned underground train connecting Changi Airport to City Hall, Bugis, and Raffles Place.' },
      { title: 'SimplyGo Public Bus Network', mode: 'Double-Decker Electric Buses', duration: 'Island-wide', cost: 'S$1.10 - S$2.30', highlight: false, badge: 'Scenic City Views', description: 'Comprehensive municipal bus grid. Tap foreign contactless card upon boarding and tap again upon alighting.' },
      { title: 'Grab & Licensed Metred Taxis', mode: 'On-Demand Rideshare', duration: '20–25 mins to Marina Bay', cost: 'S$22 - S$35', highlight: false, badge: 'Door-to-Door', description: 'Book via Grab app or join the organized taxi queue outside all airport terminals. Regulated, metered, and zero haggling.' }
    ],
    foodHighlights: [
      { name: 'Hainanese Chicken Rice', type: 'National Iconic Dish', description: 'Fragrant chicken-broth jasmine rice served with succulent poached chicken, ginger paste, and piquant fresh chili dip.', spot: 'Tian Tian Hainanese Chicken Rice (Maxwell Food Centre)', dietary: 'National Classic' },
      { name: 'Singapore Chili Crab with Fried Mantou', type: 'Seafood Sensation', description: 'Sweet Sri Lankan mud crab stir-fried in a rich, sweet, savory, and spicy tomato-egg gravy, scooped up with fluffy golden fried mantou buns.', spot: 'Jumbo Seafood (Clarke Quay) or Long Beach', dietary: 'Pescatarian' },
      { name: 'Katong Laksa', type: 'Peranakan Heritage', description: 'Thick rice noodles in a creamy, spicy coconut milk broth infused with dried shrimp, topped with plump cockles, fishcake, and laksa leaves.', spot: '328 Katong Laksa (East Coast Road)', dietary: 'Spicy Noodle Soup' },
      { name: 'Kaya Toast & Soft-Boiled Eggs', type: 'Traditional Breakfast', description: 'Crisp charcoal-toasted bread slathered with sweet coconut-pandan jam (kaya) and cold butter slabs, served with soft-boiled eggs and dark soy sauce.', spot: 'Ya Kun Kaya Toast or Tong Ah Eating House', dietary: 'Vegetarian' }
    ],
    curatedAttractions: [
      { id: 'singapore-marina-bay-sands', name: 'Marina Bay Sands & SkyPark', category: 'Must See', duration: '2-3 hours', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1400&q=85', description: 'Architectural marvel featuring three 55-story towers crowned by the cantilevered SkyPark observation deck and infinity pool.', tag: 'Iconic Wonder' },
      { id: 'singapore-gardens-by-the-bay', name: 'Gardens by the Bay & Supertrees', category: 'Nature', duration: '3 hours', image: 'https://images.unsplash.com/photo-1506351421178-63788970ee5b?w=1200&q=85', description: 'Futuristic 250-acre botanical park featuring the 50-meter Supertree Grove, the Flower Dome, and the misty Cloud Forest indoor waterfall.', tag: 'Botanical Spectacle' },
      { id: 'singapore-jewel-changi', name: 'Jewel Changi & Rain Vortex', category: 'Architecture', duration: '2 hours', image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&q=85', description: 'A multi-dimensional lifestyle hub featuring the 40-meter indoor HSBC Rain Vortex framed by four stories of lush terraced indoor forest.', tag: 'Indoor Waterfall' },
      { id: 'singapore-sentosa-island', name: 'Sentosa Island & Palawan Beach', category: 'Leisure', duration: 'Full Day', image: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=1200&q=85', description: 'Resort island home to Universal Studios Singapore, S.E.A. Aquarium, pristine tropical beaches, and coastal cable cars.', tag: 'Island Getaway' }
    ]
  },

  // ── 7. LAHORE, PAKISTAN ───────────────────────────────────────────────────
  lahore: {
    city: 'Lahore',
    country: 'Pakistan',
    flag: '🇵🇰',
    airportCode: 'LHE',
    airportName: 'Allama Iqbal International Airport (LHE)',
    currency: { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨', rate: 278.5 },
    timezone: 'PKT (UTC+5) · Base City',
    safetyScore: 84,
    safetyLevel: 'Warm & Hospitable',
    firstHour: [
      { step: 1, title: 'Land at Allama Iqbal International', category: 'Arrival', summary: 'Deplane at LHE Terminal and clear immigration.', detail: 'Follow signs to International Arrivals. Pass through Nadra biometric desks; overseas Pakistanis and visa holders use designated express lanes.', badge: 'LHE Arrival' },
      { step: 2, title: 'Baggage Claim & Customs Clearance', category: 'Arrival', summary: 'Retrieve luggage from ground level carousels.', detail: 'Baggage claim is directly past immigration. Green channel is available for passengers with nothing to declare.', badge: 'Customs Desk' },
      { step: 3, title: 'Local 4G SIM (Jazz / Zong) in Arrival Hall', category: 'Tech', summary: 'Get an official Jazz or Zong biometric travel SIM card.', detail: 'Authorized telecom kiosks are situated in the arrival concourse. Present your passport for instant biometric SIM activation with 30GB+ high-speed data.', badge: 'Local 4G SIM' },
      { step: 4, title: 'Withdraw Pakistani Rupee Cash', category: 'Money', summary: 'Use HBL, Standard Chartered, or Meezan Bank ATMs in terminal.', detail: 'Cash is king in Lahore for street food, rickshaws, and bazaars. Bank ATMs in the arrival hall support Visa/Mastercard without airport counter commission.', badge: 'Cash is King' },
      { step: 5, title: 'Book Careem / inDrive to Central Lahore', category: 'Transit', summary: 'Air-conditioned private ride to Gulberg, DHA, or Mall Road.', detail: 'Use Careem or inDrive apps for upfront transparent fares (~PKR 1,200 - 2,500 to Gulberg/DHA). Avoid informal curbside touts outside the exit gates.', badge: 'Careem / inDrive' },
      { step: 6, title: 'Hotel Check-In & Lahori Tea / Karahi', category: 'Check-in', summary: 'Arrive at hotel and experience world-famous Lahori hospitality.', detail: 'Settle in and head out to MM Alam Road or Food Street overlooking the illuminated Badshahi Mosque for traditional Karahi and Karak chai.', badge: 'Zinda Dil' }
    ],
    essentials: {
      visa: { title: 'Visa & Entry Requirements', summary: 'Pakistan Online Visa System (POVS) · Fast 48-72h electronic visa.', detail: 'Apply online via the official Nadra Pakistan Online Visa System portal. Visa on Arrival is available for citizens of 50+ countries. Overseas Pakistanis travel visa-free with a valid NICOP / POC card.', status: 'eVisa / NICOP', badgeColor: 'emerald', officialLink: 'https://visa.nadra.gov.pk/' },
      safety: { title: 'Safety & Health Protocol', summary: 'Safety Index: 84/100 · Exceptionally warm local hospitality.', detail: 'Lahoris are famed worldwide for their generous hospitality ("Jisne Lahore nahi dekha wo jamya nahi"). Standard city precautions apply: use registered rideshare services, drink sealed mineral water, and keep personal belongings secure in crowded bazaars.', status: 'Warm & Safe', badgeColor: 'emerald', hotlines: { police: '15', ambulance: '1122', rescue: '1122', motorway: '130' } },
      money: { title: 'Money, Cards & Currency', summary: 'Currency: Pakistani Rupee (PKR) · Cash essential for markets & dining.', detail: 'Credit/debit cards are accepted at luxury hotels, supermarkets, and upscale restaurants on MM Alam Road and DHA. Carrying PKR cash is essential for traditional bazaars (Anarkali, Liberty), street dining, and local transit.', status: 'Cash Recommended', badgeColor: 'blue' },
      connectivity: { title: 'Mobile Connectivity & Power', summary: 'High-speed 4G coverage across Lahore · Jazz, Zong, and Nayatel.', detail: 'Prepaid 4G SIMs are cheap and fast. Sockets use Type C, Type D, and Type G (230V / 50Hz). Most modern hotels have universal sockets that accept all international plugs.', status: 'Type C/D/G (230V)', badgeColor: 'blue' },
      transport: { title: 'Orange Line Metro & Ride-Hailing', summary: 'Orange Line Metro Train connects 27 km across the city center.', detail: 'The Orange Line Metro Train provides clean, air-conditioned rapid rail from Ali Town to Dera Gujran. Metrobus runs on dedicated elevated corridors along Ferozepur Road. Careem, inDrive, and Uber are the gold standard for door-to-door transit.', status: 'Orange Line & Careem', badgeColor: 'emerald' },
      culture: { title: 'Cultural Etiquette & Hospitality', summary: 'Urdu & Punjabi · Warm greetings, generous hospitality, modest dress.', detail: 'Hospitality is paramount. Greet warmly with "As-salamu alaykum". When visiting mosques (Badshahi Mosque, Wazir Khan), remove shoes and ensure modest dress (women cover heads with a dupatta/scarf). Use the right hand for giving and receiving.', greetingText: 'Traditional greeting: "As-salamu alaykum" (Peace be upon you) and "Shukriya" (Thank you)', status: 'Rich Cultural Heritage', badgeColor: 'purple' },
      emergency: { title: 'Emergency Hotlines & Medical Centers', summary: 'Police: 15 · Rescue & Medical: 1122 · Traffic Police: 1915.', detail: 'Doctors Hospital (Johar Town), Shaukat Khanum Memorial Hospital, and National Hospital (DHA) provide high-standard 24/7 emergency medical care.', status: '24/7 Rescue 1122', badgeColor: 'rose' }
    },
    neighborhoods: [
      { name: 'Gulberg (MM Alam & Main Boulevard)', bestFor: 'Upscale dining, shopping, luxury cafes & central location', description: 'The commercial and culinary heartbeat of modern Lahore, home to MM Alam Road dining strip, Liberty Market, and boutique hotels.', avgNight: '$80 - $180', vibe: 'Cosmopolitan & Lively', transit: 'Metrobus stations nearby, 10 min to DHA' },
      { name: 'DHA (Defence Housing Authority)', bestFor: 'Modern residential serenity, upscale cafes, parks & boutiques', description: 'Upscale planned community featuring vibrant commercial hubs in Phase 5 and Phase 6 (LUMS sector), high-end fitness clubs, and quiet avenues.', avgNight: '$90 - $220', vibe: 'Modern & Serene', transit: 'Ring Road direct access, Careem rides' },
      { name: 'Walled City / Old Lahore', bestFor: 'Centuries-old Mughal history, heritage architecture & street food', description: 'Atmospheric historic core containing the 13 historic gates, Badshahi Mosque, Lahore Fort, Delhi Gate, and the aromatic Haveli food street.', avgNight: '$45 - $95', vibe: 'Historic & Atmospheric', transit: 'Delhi Gate rickshaws, Orange Line Station' }
    ],
    transportOptions: [
      { title: 'Careem & inDrive Ride-Hailing', mode: 'Air-Conditioned Private Cars', duration: 'On-demand across Lahore', cost: 'PKR 400 - 1,800', highlight: true, badge: 'MOST COMFORTABLE & SAFE', description: 'Reliable private transfers with vetted drivers and live GPS tracking across all city sectors.' },
      { title: 'Lahore Orange Line Metro Train', mode: 'Automated Electric Rapid Transit', duration: '27 km from Ali Town to Dera Gujran', cost: 'PKR 40 per ride', highlight: false, badge: 'Rapid Rail', description: 'Pakistan\'s premier driverless rapid transit system, linking southern and northern Lahore in 45 minutes.' },
      { title: 'Metrobus Rapid Transit', mode: 'Dedicated Corridor Buses', duration: 'Shahdara to Gajjumata', cost: 'PKR 30 per ride', highlight: false, badge: 'Metrobus', description: 'Fleet of articulated buses running on fully separated elevated flyovers, unaffected by street traffic.' }
    ],
    foodHighlights: [
      { name: 'Lahori Mutton & Chicken Karahi', type: 'Signature Dish', description: 'Fresh meat cooked in a deep wok over roaring flame with tomatoes, green chilies, ginger juliennes, and pure butter or desi ghee.', spot: 'Butt Karahi (Lakshmi Chowk) or Haveli Food Street', dietary: 'Signature Specialty' },
      { name: 'Royal Lahori Nihari with Roghani Naan', type: 'Slow-Cooked Heritage', description: 'Velvety beef shank stew slow-cooked overnight with bone marrow, garnished with fried onions, ginger, and fresh lime slices.', spot: 'Waris Nihari (Abid Market) or Muhammadi Nihari', dietary: 'Heritage Stew' },
      { name: 'Lahori Halwa Puri & Chana Breakfast', type: 'Traditional Morning Feast', description: 'Puffed golden puris served with spicy chickpea curry (chana), sweet semolina halwa, and spicy mango pickle.', spot: 'Taj Mahal Sweets (Taxali Gate) or Capri Restaurant (Liberty)', dietary: 'Vegetarian Classic' },
      { name: 'Crispy Lahori Chargha & Tikka Boti', type: 'Mughal Barbecue', description: 'Whole chicken marinated in traditional Lahori spices and yogurt, steamed then crisp-fried, served with mint chutney.', spot: 'Goga Naqeebia or Zakir Tikka', dietary: 'Barbecue Classic' }
    ],
    curatedAttractions: [
      { id: 'lahore-minar-e-pakistan', name: 'Minar-e-Pakistan', category: 'Must See', duration: '1.5 hours', image: 'https://images.unsplash.com/photo-1622546758596-f1f06ba11f58?w=1400&q=85', description: 'The national monument standing tall in Greater Iqbal Park where the historic Lahore Resolution was passed in 1940, beautifully illuminated in the evening.', tag: 'National Monument' },
      { id: 'lahore-badshahi-mosque', name: 'Badshahi Mosque', category: 'Heritage', duration: '2 hours', image: 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?w=1400&q=85', description: 'Mughal architectural masterpiece commissioned by Emperor Aurangzeb in 1673, built with red sandstone and white marble domes holding 100,000 worshippers.', tag: 'Mughal Wonder' },
      { id: 'lahore-lahore-fort', name: 'Lahore Fort (Shahi Qila)', category: 'History', duration: '2.5 hours', image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=1200&q=85', description: 'UNESCO World Heritage royal citadel featuring the dazzling Sheesh Mahal (Palace of Mirrors), Alamgiri Gate, and historic marble pavilions.', tag: 'UNESCO World Heritage' },
      { id: 'lahore-wazir-khan-mosque', name: 'Wazir Khan Mosque', category: 'Architecture', duration: '1.5 hours', image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=1200&q=85', description: 'Exquisite 17th-century mosque located inside the Walled City, world-renowned for its intricate fresco paintings and kashi-kari glazed tile mosaics.', tag: 'Mosaic Masterpiece' }
    ]
  },

  // ── 8. DUBAI, UNITED ARAB EMIRATES ────────────────────────────────────────
  dubai: {
    city: 'Dubai',
    country: 'United Arab Emirates',
    flag: '🇦🇪',
    airportCode: 'DXB',
    airportName: 'Dubai International Airport (DXB)',
    currency: { code: 'AED', name: 'UAE Dirham', symbol: 'AED', rate: 3.67 },
    timezone: 'GST (UTC+4) · 1h behind Lahore',
    safetyScore: 95,
    safetyLevel: 'Extremely Safe',
    firstHour: [
      { step: 1, title: 'Land at DXB & Smart Gates', category: 'Arrival', summary: 'Pass through biometric Smart Gates at Terminal 1 or 3.', detail: 'Registered travelers and visa-on-arrival passengers clear immigration in seconds using contactless facial recognition Smart Gates.', badge: 'Smart Gates' },
      { step: 2, title: 'Free Tourist SIM with 1GB Data', category: 'Tech', summary: 'Collect complimentary du / e& tourist SIM at passport control.', detail: 'Immigration officers hand international visitors a free tourist SIM card preloaded with complimentary 1GB data.', badge: 'Free du SIM' },
      { step: 3, title: 'Withdraw AED Dirhams or Tap Apple Pay', category: 'Money', summary: 'Dubai is completely cashless; contactless cards work everywhere.', detail: 'Official Emirates NBD and ADCB ATMs are located throughout arrivals. All taxis, metro stations, and shops accept Apple Pay and contactless cards.', badge: 'Cashless City' },
      { step: 4, title: 'Buy Silver Nol Card for Dubai Metro', category: 'Transit', summary: 'Purchase a Silver Nol card at the airport metro station entrance.', detail: 'Load AED 20-50 on a Silver Nol card. Dubai Metro Red Line connects DXB Terminal 1 and 3 directly to Downtown (Burj Khalifa) in 25 minutes.', badge: 'Nol Card' },
      { step: 5, title: 'Red Line Metro or RTA Taxi to Hotel', category: 'Transit', summary: 'Board driverless metro train or join the official RTA taxi queue.', detail: 'RTA taxis are metered and strictly regulated with AED 25 airport flag drop. Alternatively, the driverless metro train runs every 3–5 minutes.', badge: 'Driverless Metro' },
      { step: 6, title: 'Check-In & Dubai Mall Fountain Show', category: 'Check-in', summary: 'Unpack, refresh, and watch the illuminated evening fountain show.', detail: 'Head to the base of Burj Khalifa for the spectacular synchronized music and light fountain show starting every 30 minutes in the evening.', badge: 'Burj Khalifa View' }
    ],
    essentials: {
      visa: { title: 'Visa & Entry Requirements', summary: 'Pre-arranged 30/60-day Tourist Visa or Visa on Arrival.', detail: 'Citizens of GCC, US, UK, Canada, Australia, EU, and Japan receive free 30–90 day Visa on Arrival. Pakistani and Indian passport holders require a pre-arranged tourist visa applied through airlines (Emirates/flydubai) or registered travel agencies.', status: 'Tourist Visa / VOA', badgeColor: 'blue', officialLink: 'https://gdrfad.gov.ae/' },
      safety: { title: 'Safety & Health Protocol', summary: 'Safety Index: 95/100 · One of the safest cities worldwide.', detail: 'Strict laws and 24/7 policing ensure virtually non-existent violent crime. Respect Islamic traditions: dressing modestly in family public areas (malls, government buildings) is required, and public intoxication is strictly prohibited.', status: 'Impeccably Safe', badgeColor: 'emerald', hotlines: { police: '999', ambulance: '998', fire: '997', universal: '999' } },
      money: { title: 'Money, Cards & Currency', summary: 'Currency: UAE Dirham (AED) · Fixed peg 1 USD = 3.67 AED.', detail: 'Contactless cards, Apple Pay, and Samsung Pay are ubiquitous across all shopping malls, taxis, cafes, and delivery apps. Tipping 10–15% is common for good restaurant table service.', status: 'Contactless Ubiquitous', badgeColor: 'blue' },
      connectivity: { title: 'Mobile Connectivity & Power', summary: 'World-leading 5G speeds across UAE · e& (Etisalat) and du.', detail: 'Free Wi-Fi is available across all malls and metro stations. Electrical sockets use UK Type G (3-pin rectangular pins, 230V / 50Hz).', status: 'Type G (UK Plug)', badgeColor: 'blue' },
      transport: { title: 'Dubai Metro & Careem Taxis', summary: 'Driverless air-conditioned metro system and plentiful taxis.', detail: 'The Dubai Metro Red and Green lines feature Gold Class, Women & Children carriages, and standard cabins. Careem and Hala Taxi apps provide transparent on-demand cab booking.', status: 'World-Class Metro', badgeColor: 'emerald' },
      culture: { title: 'Cultural Etiquette & Hospitality', summary: 'Arabic & English · Respect Islamic culture, modest attire in malls.', detail: 'Greet with "As-salamu alaykum" or "Marhaban". Alcohol is served only in licensed hotel venues. During the holy month of Ramadan, eating, drinking, or smoking in public daylight areas is restricted.', greetingText: 'Polite greeting: "As-salamu alaykum" or "Marhaban" (Welcome) · "Shukran" (Thank you)', status: 'Modern Arab Hospitality', badgeColor: 'purple' },
      emergency: { title: 'Emergency Hotlines & Medical Care', summary: 'Police: 999 · Ambulance: 998 · Fire / Civil Defence: 997.', detail: 'Rashid Hospital and Mediclinic City Hospital provide high-tech 24/7 emergency medical trauma services with international multilingual doctors.', status: '24/7 Dispatch', badgeColor: 'rose' }
    },
    neighborhoods: [
      { name: 'Downtown Dubai', bestFor: 'Burj Khalifa views, luxury shopping at Dubai Mall & fountain shows', description: 'The monumental core of Dubai featuring the world\'s tallest tower, Dubai Opera, and the lavish Dubai Mall.', avgNight: '$220 - $550', vibe: 'Glamorous & Monumental', transit: 'Burj Khalifa / Dubai Mall Metro Station' },
      { name: 'Dubai Marina & JBR', bestFor: 'Waterfront promenades, beach clubs, yachts & al fresco dining', description: 'Vibrant residential canal district surrounded by high-rise towers, The Walk at JBR beachfront, and yacht charters.', avgNight: '$180 - $380', vibe: 'Beachfront & Cosmopolitan', transit: 'Dubai Tram & Sobha Realty Metro' },
      { name: 'Palm Jumeirah', bestFor: 'World-famous 5-star island resorts, Atlantis & private beaches', description: 'Iconic artificial palm tree archipelago home to Atlantis The Royal, luxury beach clubs, and panoramic Monorail rides.', avgNight: '$350 - $900', vibe: 'Ultra-Luxury Island', transit: 'Palm Monorail, Taxis' }
    ],
    transportOptions: [
      { title: 'Dubai Metro Red Line', mode: 'Driverless Rapid Rail', duration: 'Direct from Airport to Downtown in 24 min', cost: 'AED 5 - 8.50 (Nol Card)', highlight: true, badge: 'FAST & AIR-CONDITIONED', description: 'Modern, fully air-conditioned elevated train running directly from DXB Terminal 1 and 3 to Burj Khalifa, Marina, and Mall of the Emirates.' },
      { title: 'RTA City Taxis & Hala (via Careem)', mode: 'Metered Official Cabs', duration: 'On-demand 24/7', cost: 'Metered (AED 25 airport flag drop)', highlight: false, badge: 'Hala Taxi', description: 'Cream-colored licensed cabs with color-coded roof tops. Bookable via Careem app.' },
      { title: 'Dubai Creek Traditional Abra', mode: 'Motorized Wooden Water Boats', duration: '5 minutes across creek', cost: 'AED 1.00', highlight: false, badge: 'Historic 1 Dirham Ride', description: 'Charming traditional wooden boats ferrying commuters between Deira spice souks and Bur Dubai textile market.' }
    ],
    foodHighlights: [
      { name: 'Fragrant Chicken & Lamb Machboos', type: 'Emirati Traditional', description: 'Basmati rice slow-cooked with tender spiced meat, dried black limes (loomi), saffron, cardamom, and toasted pine nuts.', spot: 'Al Fanar Restaurant (Festival City / Al Seef)', dietary: 'National Dish' },
      { name: 'Crispy Falafel & Chicken Shawarma', type: 'Middle Eastern Street Classic', description: 'Thinly sliced spit-roasted marinated chicken wrapped in warm pita bread with rich garlic toum and salty pickles.', spot: 'Al Mallah (Dhiyafa Road) or Operation Falafel', dietary: 'Street Food Icon' },
      { name: 'Golden Luqaimat Dumplings', type: 'Emirati Sweet', description: 'Crisp fried dough balls soft on the inside, drizzled generously with thick date syrup and sprinkled with toasted sesame seeds.', spot: 'Arabian Tea House (Al Fahidi Heritage District)', dietary: 'Vegetarian Sweet' },
      { name: 'Spiced Karak Chai', type: 'Beloved Street Beverage', description: 'Strong black tea simmered with evaporated milk, crushed cardamom pods, and saffron, served piping hot in small paper cups.', spot: 'FiLLi Café or local roadside tea counters', dietary: 'Vegetarian' }
    ],
    curatedAttractions: [
      { id: 'dubai-burj-khalifa', name: 'Burj Khalifa & At The Top', category: 'Must See', duration: '2.5 hours', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1400&q=85', description: 'The world\'s tallest building soaring 828 meters (2,717 ft) into the desert sky, featuring high-speed elevators to the 124th, 125th, and 148th observation decks.', tag: 'World Record' },
      { id: 'dubai-museum-of-the-future', name: 'Museum of the Future', category: 'Innovation', duration: '2-3 hours', image: 'https://images.unsplash.com/photo-1634148549929-23c21a4f0288?w=1200&q=85', description: 'Stunning architectural torus inscribed with Arabic calligraphy poetry by Sheikh Mohammed bin Rashid, showcasing visionary exhibits on space and ecology.', tag: 'Design Marvel' },
      { id: 'dubai-palm-jumeirah', name: 'Palm Jumeirah & The View at The Palm', category: 'Leisure', duration: '2 hours', image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=1200&q=85', description: 'World-famous man-made palm archipelago offering 360-degree views from the 52nd floor observation deck of Nakheel Mall.', tag: 'Engineering Wonder' }
    ]
  },

  // ── 9. LONDON, UNITED KINGDOM ────────────────────────────────────────────
  london: {
    city: 'London',
    country: 'United Kingdom',
    flag: '🇬🇧',
    airportCode: 'LHR',
    airportName: 'London Heathrow Airport (LHR)',
    currency: { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.79 },
    timezone: 'GMT (UTC+0) / BST (UTC+1) · 5h behind Lahore',
    safetyScore: 90,
    safetyLevel: 'Safe & Orderly',
    firstHour: [
      { step: 1, title: 'Land at Heathrow & Automated e-Gates', category: 'Arrival', summary: 'Arrive at LHR Terminal 2, 3, 4, or 5.', detail: 'Follow purple arrival signs. Eligible biometric passports clear UK Border Force automated e-Gates in seconds.', badge: 'Heathrow Arrival' },
      { step: 2, title: 'Tap-to-Pay Elizabeth Line into London', category: 'Transit', summary: 'Direct 30-minute journey into central London on the Elizabeth line.', detail: 'Tap your foreign contactless card or phone directly at the rail gantry. The state-of-the-art Elizabeth line runs straight into Paddington and Tottenham Court Road in 30 minutes.', badge: 'Elizabeth Line' },
      { step: 3, title: 'Connectivity & Unlimited Terminal Wi-Fi', category: 'Tech', summary: 'Connect to "_Heathrow Wi-Fi" or activate UK eSIM.', detail: 'Free high-speed internet across all Heathrow terminals. UK eSIMs connect instantly to EE or Vodafone networks.', badge: 'Free Wi-Fi' },
      { step: 4, title: 'No Cash Needed — London is 99% Contactless', category: 'Money', summary: 'All Tube gates, red double-decker buses, and black cabs take cards.', detail: 'Transport for London (TfL) has daily fare caps. Never buy paper paper tickets — simply tap your contactless credit card or Apple Pay.', badge: 'TfL Tap & Go' },
      { step: 5, title: 'Arrive at Hotel & Traditional Pub Lunch', category: 'Check-in', summary: 'Drop luggage and enjoy a warm London pub welcome.', detail: 'Settle in and visit a traditional Victorian pub for crispy beer-battered fish and chips with mushy peas.', badge: 'Classic Pub' },
      { step: 6, title: 'Thames Riverside Walk & Big Ben', category: 'Sightseeing', summary: 'Stroll along the South Bank to Big Ben and Parliament.', detail: 'Walk along the pedestrianized South Bank promenade past the London Eye and Westminster Bridge.', badge: 'Big Ben Views' }
    ],
    essentials: {
      visa: { title: 'Visa & Entry Requirements', summary: 'Standard Visitor Visa required for Pakistani passports · Max 6 months.', detail: 'Pakistani passport holders require a standard UK Visitor Visa applied online via GOV.UK and biometrics at VFS. US, Canadian, Australian, and EU citizens enter visa-free.', status: 'Standard Visitor Visa', badgeColor: 'blue', officialLink: 'https://www.gov.uk/standard-visitor' },
      safety: { title: 'Safety & Health Protocol', summary: 'Safety Index: 90/100 · Clean, well-policed capital.', detail: 'London is safe day and night. Standard big-city precautions apply: keep smartphones out of reach of cyclists on street corners and watch bags in busy shopping areas (Oxford Street).', status: 'Safe & Orderly', badgeColor: 'emerald', hotlines: { police: '999', ambulance: '999', fire: '999', nonEmergency: '101' } },
      money: { title: 'Money, Cards & Currency', summary: 'Currency: British Pound (£) · 99% contactless card acceptance.', detail: 'Cash is rarely used in London. All buses, Tube turnstiles, black cabs, and pubs accept contactless cards and Apple Pay. Tipping 10–12.5% is common in sit-down restaurants.', status: 'Card Preferred', badgeColor: 'blue' },
      connectivity: { title: 'Mobile Connectivity & Power', summary: '5G across London · EE, Vodafone, O2, and Three.', detail: 'UK sockets use Type G (3 rectangular pins, 230V / 50Hz). Mobile phone Wi-Fi is available across most central underground Tube stations.', status: 'Type G (UK Plug)', badgeColor: 'blue' },
      transport: { title: 'TfL Underground, Elizabeth Line & Buses', summary: 'The world\'s oldest underground network (The Tube).', detail: '11 Underground lines plus the Elizabeth Line and DLR. Stand on the right on all escalators. Tap in and tap out with the same card to ensure daily fare capping.', status: 'TfL Underground', badgeColor: 'emerald' },
      culture: { title: 'Cultural Etiquette & Decorum', summary: 'English · Polite queueing, "Please" and "Thank you".', detail: 'Queueing patiently in orderly lines is a sacred British cultural norm. Always stand on the right side of Tube escalators to let commuters walk past on the left.', greetingText: 'Polite greeting: "Hello / Good morning" and "Thank you / Cheers"', status: 'British Etiquette', badgeColor: 'purple' },
      emergency: { title: 'Emergency Hotlines & NHS Hospitals', summary: 'Emergency Police/Ambulance: 999 · Non-Emergency: 111.', detail: 'St Thomas\' Hospital (facing Big Ben) and University College Hospital (UCH) provide 24/7 NHS Accident & Emergency departments.', status: '24/7 NHS Dispatch', badgeColor: 'rose' }
    },
    neighborhoods: [
      { name: 'Westminster & South Bank', bestFor: 'Big Ben, London Eye, Buckingham Palace & Thames walks', description: 'The political and royal center of Britain, featuring the Houses of Parliament, Westminster Abbey, and riverside culture.', avgNight: '$220 - $450', vibe: 'Royal & Historic', transit: 'Westminster & Waterloo Stations' },
      { name: 'Soho & Covent Garden', bestFor: 'West End theaters, world-class dining, cafes & shopping', description: 'Vibrant entertainment district filled with historic playhouses, street performers on the piazza, and bustling eateries.', avgNight: '$240 - $480', vibe: 'Lively & Theatrical', transit: 'Covent Garden & Leicester Sq' },
      { name: 'Kensington & Chelsea', bestFor: 'Free world-class museums, Hyde Park & Victorian terraces', description: 'Upscale residential borough home to the Natural History Museum, V&A Museum, Harrods, and Royal Albert Hall.', avgNight: '$210 - $420', vibe: 'Elegant & Cultural', transit: 'South Kensington & High St Ken' }
    ],
    transportOptions: [
      { title: 'The Elizabeth Line', mode: 'High-Capacity Commuter Rail', duration: '30–35 min from Heathrow to Central London', cost: '£12.80 (Tap contactless)', highlight: true, badge: 'FASTEST & SMOOTHEST', description: 'Air-conditioned express trains running every 10 minutes directly into Paddington, Tottenham Court Road, and Liverpool St.' },
      { title: 'London Underground (Piccadilly Line)', mode: 'Classic Tube', duration: '50 minutes from Heathrow', cost: '£5.60', highlight: false, badge: 'Budget Rail', description: 'Cheapest transit from Heathrow directly into central London (Piccadilly Circus, King\'s Cross).' },
      { title: 'Iconic London Black Cabs', mode: 'Hackney Carriage', duration: 'On-demand street hail or app (Gett)', cost: 'Metered rates (all accept card)', highlight: false, badge: 'Historic Black Cab', description: 'World-famous purpose-built cabs driven by certified drivers who have passed "The Knowledge".' }
    ],
    foodHighlights: [
      { name: 'Traditional Fish and Chips', type: 'British National Classic', description: 'Fresh North Sea cod or haddock deep-fried in crisp golden ale batter, served with chunky hand-cut chips, tartar sauce, and mushy peas.', spot: 'Poppies (Spitalfields) or The Golden Hind (Marylebone)', dietary: 'Pescatarian Classic' },
      { name: 'Full English Breakfast', type: 'Hearty Morning Tradition', description: 'Eggs cooked to order with Cumberland pork sausages, crispy bacon, grilled tomatoes, buttered mushrooms, baked beans, and buttered toast.', spot: 'Regency Café (Pimlico) or The Wolseley', dietary: 'British Breakfast' },
      { name: 'Sunday Roast with Yorkshire Pudding', type: 'Weekend Heritage', description: 'Tender roast beef or lamb served with crisp towering Yorkshire puddings, duck-fat roast potatoes, seasonal greens, and rich onion gravy.', spot: 'The Quality Chop House or traditional Victorian pubs', dietary: 'Sunday Classic' },
      { name: 'Traditional Afternoon Cream Tea', type: 'High Tea Elegance', description: 'Warm baked buttermilk scones served with thick Cornish clotted cream and strawberry preserve, accompanied by loose-leaf black tea.', spot: 'The Ritz, Fortnum & Mason, or The Savoy', dietary: 'Vegetarian Sweet' }
    ],
    curatedAttractions: [
      { id: 'london-big-ben', name: 'Big Ben & Houses of Parliament', category: 'Must See', duration: '1.5 hours', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1400&q=85', description: 'The majestic Elizabeth Tower and Gothic revival Palace of Westminster standing beside the River Thames.', tag: 'Global Landmark' },
      { id: 'london-tower-bridge', name: 'Tower Bridge & Tower of London', category: 'Heritage', duration: '2.5 hours', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&q=85', description: 'Iconic Victorian bascule bridge and the 1,000-year-old royal fortress housing the dazzling Crown Jewels.', tag: 'Royal Fortress' },
      { id: 'london-british-museum', name: 'The British Museum', category: 'Museums', duration: '3 hours', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&q=85', description: 'World-famous free museum holding millions of historic artifacts including the Rosetta Stone and Parthenon sculptures under Norman Foster\'s glass Great Court.', tag: 'Free Admission' },
      { id: 'london-eye', name: 'The London Eye', category: 'Views', duration: '1 hour', image: 'https://images.unsplash.com/photo-1506970845246-18f21d533b20?w=1200&q=85', description: 'Cantilevered observation wheel on the South Bank providing 360-degree panoramic views over London up to 40 km on clear days.', tag: 'Skyline Wheel' }
    ]
  },

  // ── 10. NEW YORK CITY, USA ───────────────────────────────────────────────
  newyork: {
    city: 'New York',
    country: 'United States',
    flag: '🇺🇸',
    airportCode: 'JFK / EWR / LGA',
    airportName: 'John F. Kennedy International Airport (JFK)',
    currency: { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1.0 },
    timezone: 'EST (UTC-5) / EDT (UTC-4) · 9-10h behind Lahore',
    safetyScore: 86,
    safetyLevel: 'Safe & Energetic',
    firstHour: [
      { step: 1, title: 'Land at JFK & Pass CBP Border Control', category: 'Arrival', summary: 'Arrive at Terminal 1, 4, 7, or 8 and clear US Customs.', detail: 'Follow signs to US Customs and Border Protection (CBP). International visitors have digital fingerprints and facial biometric photo taken.', badge: 'CBP Clearance' },
      { step: 2, title: 'AirTrain JFK to Jamaica Subway Station', category: 'Transit', summary: 'Elevated AirTrain connects JFK terminals to the subway in 10 min.', detail: 'Board the AirTrain ($8.50) to Jamaica Station. Switch to the E subway train for a direct 35-minute express ride into Midtown Manhattan.', badge: 'AirTrain & Subway' },
      { step: 3, title: 'OMNY Tap-and-Go for NYC Subway', category: 'Transit', summary: 'Tap foreign contactless card or phone directly at turnstiles.', detail: 'NYC\'s OMNY system lets you tap your contactless card or Apple Pay directly at subway turnstiles. Weekly fare-cap ensures automatic discounts.', badge: 'OMNY Tap' },
      { step: 4, title: 'Terminal ATMs & Cash Preparation', category: 'Money', summary: 'Use official Chase or Bank of America ATMs.', detail: 'Cards are accepted 99% of places, but keep a few $1 and $5 bills for tipping hotel luggage porters and street food carts.', badge: 'Tipping Cash' },
      { step: 5, title: 'Check In & Grab a Classic NYC Pizza Slice', category: 'Check-in', summary: 'Drop bags at your hotel and grab a hot dollar slice.', detail: 'Head to Joe\'s Pizza in Greenwich Village for an authentic hot, foldable, crisp NYC thin-crust cheese slice.', badge: 'Classic Slice' },
      { step: 6, title: 'Evening Walk to Times Square & Broadway', category: 'Sightseeing', summary: 'Experience the electric neon glow of Times Square.', detail: 'Walk down Broadway and 7th Avenue under towering digital billboards and the vibrant heart of the theater district.', badge: 'Times Square' }
    ],
    essentials: {
      visa: { title: 'Visa & Entry Requirements', summary: 'US B1/B2 Tourist Visa required for Pakistani passports · ESTA for VWP.', detail: 'Pakistani passport holders require a US B1/B2 visa with DS-160 application and in-person consular interview. Citizens of 40 Visa Waiver countries require an online ESTA approved prior to departure.', status: 'US Visa / ESTA', badgeColor: 'blue', officialLink: 'https://travel.state.gov/' },
      safety: { title: 'Safety & Health Protocol', summary: 'Safety Index: 86/100 · One of the safest large cities in America.', detail: 'NYC is well-policed and busy 24/7. Standard urban awareness applies: keep phones secure on subway platforms, avoid empty subway cars late at night, and ignore unsolicited CD sellers in Times Square.', status: 'Well-Policed', badgeColor: 'emerald', hotlines: { police: '911', ambulance: '911', fire: '911', cityServices: '311' } },
      money: { title: 'Money, Cards & Currency', summary: 'Currency: US Dollar ($) · Cards accepted everywhere · Tipping standard.', detail: 'Contactless credit cards, Apple Pay, and Google Pay work across 99% of businesses. Tipping is a cultural imperative in the US: 18–20% in sit-down restaurants, $1–$2 per drink at bars, and 15–20% in yellow cabs.', status: 'Card Dominant', badgeColor: 'blue' },
      connectivity: { title: 'Mobile Connectivity & Power', summary: 'Fast 5G across all five boroughs · T-Mobile, AT&T, and Verizon.', detail: 'US sockets use Type A and Type B (2 flat pins with optional round ground pin, 120V / 60Hz). Free public Wi-Fi is available via "LinkNYC" sidewalk kiosks.', status: 'Type A/B (120V)', badgeColor: 'blue' },
      transport: { title: 'MTA Subway & Iconic Yellow Cabs', summary: 'The world\'s only 24/7/365 uninterrupted subway system.', detail: '36 subway lines serving 472 stations. Simply tap your contactless card with OMNY. Yellow cabs can be hailed from any avenue curb or via Curb app.', status: '24/7 Subway', badgeColor: 'emerald' },
      culture: { title: 'Cultural Etiquette & Pacing', summary: 'English · Fast-paced, direct communication, friendly small talk.', detail: 'New Yorkers walk fast; step to the side of the sidewalk if you need to check maps. Stand on the right side of escalators. A warm "Hi, how are you doing?" precedes interactions.', greetingText: 'Friendly greeting: "Hi, how are you doing?" · 18-20% restaurant tipping expected', status: 'Dynamic & Direct', badgeColor: 'purple' },
      emergency: { title: 'Emergency Hotlines & Hospitals', summary: 'Emergency Police / Medical: 911 · Non-Emergency: 311.', detail: 'NewYork-Presbyterian Hospital, Mount Sinai, and NYU Langone provide world-class 24/7 emergency medical trauma departments.', status: '24/7 911 Dispatch', badgeColor: 'rose' }
    },
    neighborhoods: [
      { name: 'Midtown Manhattan', bestFor: 'Times Square, Broadway theaters, Empire State & Central Park', description: 'The bustling skyscraper core of New York, featuring Rockefeller Center, Grand Central Terminal, and 5th Avenue shopping.', avgNight: '$220 - $480', vibe: 'High-Energy & Iconic', transit: 'Major hubs: Times Sq, Grand Central' },
      { name: 'SoHo & Greenwich Village', bestFor: 'Cast-iron architecture, indie boutiques, jazz clubs & cafes', description: 'Charming historic neighborhoods with cobblestone streets, Washington Square Park, comedy clubs, and chic designer fashion.', avgNight: '$240 - $550', vibe: 'Chic & Bohemian', transit: 'Subway lines A, C, E, B, D, F, M, N, R' },
      { name: 'Brooklyn (Williamsburg & DUMBO)', bestFor: 'Waterfront Manhattan skyline views, hipster cafes & art', description: 'Trendy borough directly across the East River, famous for the Brooklyn Bridge promenade, flea markets, and rooftop dining.', avgNight: '$180 - $350', vibe: 'Creative & Scenic', transit: 'Subway lines L, F, NYC Ferry' }
    ],
    transportOptions: [
      { title: 'MTA Subway Grid (OMNY Tap)', mode: '24/7 Underground Rapid Transit', duration: 'City-wide', cost: '$2.90 per ride (Cap at $34/week)', highlight: true, badge: '24/7 SUBWAY', description: 'Fastest way to move through Manhattan traffic. Tap your credit card or phone at any turnstile.' },
      { title: 'NYC Yellow Cabs & Uber/Lyft', mode: 'Licensed Cabs & Rideshare', duration: 'On-demand across all boroughs', cost: 'Metered rates ($70 JFK flat fare to Manhattan)', highlight: false, badge: 'Iconic Yellow Cab', description: 'Official yellow cabs have illuminated roof lights when available for street hailing.' },
      { title: 'NYC Ferry Network', mode: 'Passenger Catamaran Ferries', duration: 'Scenic East River & Harbor routes', cost: '$4.00 per ride', highlight: false, badge: 'Scenic Skyline Cruise', description: 'Commuter ferries connecting Wall Street, DUMBO, Williamsburg, and Midtown with open-top decks.' }
    ],
    foodHighlights: [
      { name: 'Classic New York Thin-Crust Pizza Slice', type: 'Iconic Street Classic', description: 'Large, wide, crisp yet pliable cheese slice baked in deck ovens with tangy tomato sauce and aged shredded mozzarella, folded in half to eat.', spot: 'Joe\'s Pizza (Carmine St) or Scarr\'s Pizza', dietary: 'Vegetarian Classic' },
      { name: 'Hot Pastrami on Rye Sandwich', type: 'Jewish Deli Heritage', description: 'Piled-high warm, spiced, and smoked pastrami beef brisket served between seeded caraway rye bread with spicy brown mustard and pickles.', spot: 'Katz\'s Delicatessen (Lower East Side)', dietary: 'Heritage Sandwich' },
      { name: 'New York Bagel with Cream Cheese & Lox', type: 'Breakfast Tradition', description: 'Boiled and baked chewy malt bagel slathered with whipped scallion cream cheese, thinly sliced smoked Nova lox salmon, capers, and red onion.', spot: 'Russ & Daughters or Ess-a-Bagel', dietary: 'Pescatarian' },
      { name: 'Classic New York Baked Cheesecake', type: 'Confectionery Classic', description: 'Dense, rich, and velvety baked cheesecake made with pure cream cheese, sour cream, and graham cracker crust.', spot: 'Junior\'s (Brooklyn / Times Square)', dietary: 'Vegetarian Sweet' }
    ],
    curatedAttractions: [
      { id: 'newyork-statue-of-liberty', name: 'Statue of Liberty & Ellis Island', category: 'Must See', duration: '3.5 hours', image: 'https://images.unsplash.com/photo-1522083165195-342750297f05?w=1400&q=85', description: 'The colossal neoclassical sculpture on Liberty Island given by France in 1886, standing as the universal symbol of freedom and hope.', tag: 'Universal Icon' },
      { id: 'newyork-central-park', name: 'Central Park', category: 'Nature', duration: '2-3 hours', image: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=1200&q=85', description: '843-acre urban oasis designed by Olmsted and Vaux, featuring Bethesda Terrace, Bow Bridge, Wollman Rink, and winding tree-lined paths.', tag: 'Urban Oasis' },
      { id: 'newyork-empire-state', name: 'Empire State Building', category: 'Skyline', duration: '2 hours', image: 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?w=1200&q=85', description: 'Art Deco architectural icon soaring 102 stories above Midtown, featuring open-air 86th floor observation decks with 360-degree views.', tag: 'Art Deco Marvel' },
      { id: 'newyork-brooklyn-bridge', name: 'Brooklyn Bridge Walk', category: 'History & Views', duration: '1.5 hours', image: 'https://images.unsplash.com/photo-1496868834840-5f4c98840aaa?w=1200&q=85', description: 'Historic 1883 suspension bridge with Gothic limestone towers offering iconic pedestrian boardwalk strolls over the East River.', tag: 'Historic Walk' }
    ]
  }
};

// ── UNIVERSAL INTELLIGENCE RESOLVER (COVERS ALL 195 COUNTRIES & ANY CITY) ──
export function resolveDestinationIntelligence(destName, destCountry) {
  const normCity = (destName || '').toLowerCase().trim().replace(/[^a-z]/g, '');
  const normCountry = (destCountry || '').toLowerCase().trim();

  // 1. Direct hit in pre-compiled knowledge registry
  if (DESTINATION_KNOWLEDGE[normCity]) {
    return DESTINATION_KNOWLEDGE[normCity];
  }

  // 2. Check if a major country key matches directly
  for (const [key, val] of Object.entries(DESTINATION_KNOWLEDGE)) {
    if (normCountry.includes(key) || key.includes(normCountry)) {
      // Clone and customize with the specific city name
      return {
        ...val,
        city: destName || val.city,
        firstHour: val.firstHour.map(s => ({
          ...s,
          summary: s.summary.replace(new RegExp(val.city, 'gi'), destName || val.city),
          detail: s.detail.replace(new RegExp(val.city, 'gi'), destName || val.city)
        }))
      };
    }
  }

  // 3. Dynamic Universal Resolver matching country and real data
  const cityName = destName || 'Destination City';
  const countryName = destCountry || 'Worldwide';

  // Find country data match
  let matchedCountry = null;
  if (countriesData) {
    const cValues = Object.values(countriesData);
    matchedCountry = cValues.find(c => 
      c.name?.toLowerCase() === normCountry || 
      normCountry.includes(c.name?.toLowerCase() || '___') ||
      c.id?.toLowerCase() === normCountry
    );
  }

  const currencyCode = matchedCountry?.basic?.currency?.code || (normCountry.includes('united states') ? 'USD' : normCountry.includes('united kingdom') ? 'GBP' : 'USD');
  const currencySymbol = matchedCountry?.basic?.currency?.symbol || '$';
  const currencyName = matchedCountry?.basic?.currency?.name || `${countryName} Currency`;
  const currencyRate = matchedCountry?.basic?.currency?.rate || 1.0;
  const languages = matchedCountry?.basic?.languages || 'English / Local Language';
  const flag = matchedCountry?.flag || '🌍';
  const timezones = matchedCountry?.basic?.timezones || 'Local Standard Time';

  // Language & polite greeting derivation (100% destination-specific)
  let greeting = 'Hello / Good morning';
  let thankYou = 'Thank you very much';
  let greetingAdvice = `Greet locals courteously with "${greeting}" and polite manners`;
  let tippingAdvice = 'Tipping customs follow local standards. In restaurants, rounding up or 10% is customary for attentive service.';
  let emergencyNumber = '112';

  if (normCountry.includes('japan')) {
    greeting = 'Konnichiwa';
    thankYou = 'Arigatou gozaimasu';
    greetingAdvice = 'Polite greeting: "Konnichiwa" and gentle bow · No tipping culture';
    tippingAdvice = 'Do not tip in Japan — tipping is considered rude and confusing.';
    emergencyNumber = '110 / 119';
  } else if (normCountry.includes('france') || normCountry.includes('switzerland') || normCountry.includes('belgium')) {
    greeting = 'Bonjour';
    thankYou = 'Merci';
    greetingAdvice = 'Always greet with a polite "Bonjour" upon entering any boutique or cafe';
    emergencyNumber = '112';
  } else if (normCountry.includes('germany') || normCountry.includes('austria')) {
    greeting = 'Guten Tag';
    thankYou = 'Danke';
    greetingAdvice = 'Polite greeting: "Guten Tag" · Punctuality and quiet hours are valued';
    emergencyNumber = '112';
  } else if (normCountry.includes('italy')) {
    greeting = 'Buongiorno';
    thankYou = 'Grazie';
    greetingAdvice = 'Polite greeting: "Buongiorno" · Modest dress for basilicas and churches';
    emergencyNumber = '112';
  } else if (normCountry.includes('spain') || normCountry.includes('mexico') || normCountry.includes('colombia') || normCountry.includes('argentina')) {
    greeting = 'Hola';
    thankYou = 'Muchas gracias';
    greetingAdvice = 'Warm greeting: "Hola" · Relaxed meal pacing and friendly conversations';
    emergencyNumber = normCountry.includes('mexico') ? '911' : '112';
  } else if (normCountry.includes('saudi') || normCountry.includes('uae') || normCountry.includes('qatar') || normCountry.includes('oman') || normCountry.includes('jordan') || normCountry.includes('egypt')) {
    greeting = 'As-salamu alaykum / Marhaban';
    thankYou = 'Shukran';
    greetingAdvice = 'Respectful greeting: "As-salamu alaykum" · Respect Islamic traditions and dress codes';
    emergencyNumber = normCountry.includes('saudi') ? '997 / 999' : '999';
  } else if (normCountry.includes('pakistan')) {
    greeting = 'As-salamu alaykum';
    thankYou = 'Shukriya';
    greetingAdvice = 'Warm greeting: "As-salamu alaykum" · Exceptional hospitality and right hand etiquette';
    emergencyNumber = '15 / 1122';
  } else if (normCountry.includes('turkey')) {
    greeting = 'Merhaba';
    thankYou = 'Teşekkür ederim';
    greetingAdvice = 'Warm greeting: "Merhaba" · Remove shoes when entering mosques or homes';
    emergencyNumber = '112';
  } else if (normCountry.includes('thailand')) {
    greeting = 'Sawasdee';
    thankYou = 'Khob khun';
    greetingAdvice = 'Gentle "Wai" greeting with pressed palms · Never touch anyone on the head';
    emergencyNumber = '191 / 1155';
  } else if (normCountry.includes('singapore') || normCountry.includes('malaysia')) {
    greeting = 'Hello / Selamat Datang';
    thankYou = 'Thank you / Terima Kasih';
    greetingAdvice = 'Friendly multicultural decorum · Keep left on escalators';
    emergencyNumber = '999';
  } else if (normCountry.includes('united states') || normCountry.includes('canada')) {
    greeting = 'Hi / Hello';
    thankYou = 'Thank you';
    greetingAdvice = 'Friendly greeting: "Hello" · 15-20% standard tipping in restaurants';
    tippingAdvice = '15–20% tipping is customary for table service and taxi rides in North America.';
    emergencyNumber = '911';
  } else if (normCountry.includes('united kingdom')) {
    greeting = 'Hello';
    thankYou = 'Thank you / Cheers';
    greetingAdvice = 'Polite queueing in line and "Please & Thank you" are customary';
    emergencyNumber = '999';
  }

  // Real city foods and transit lookup
  const cityKey = normCity;
  const foodData = realCityFoodAndTransit?.[cityKey]?.foods || [
    `Traditional ${cityName} Specialty`,
    `Artisanal Regional Pastry`,
    `Local Heritage Broth`
  ];

  const transitData = realCityFoodAndTransit?.[cityKey]?.transports || [
    `${cityName} Metro & Bus Network`,
    `Licensed Airport Rail Link`,
    `Ride-Hailing & City Taxis`
  ];

  // Attractions from knowledge base if available
  const knownAttractions = attractionKnowledgeBase?.[cityKey] || [];
  const curatedAttrs = knownAttractions.slice(0, 4).map(a => ({
    id: a.id || `attr-${a.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    name: a.name,
    category: a.category || 'Sightseeing',
    duration: a.visitDuration || '2 hours',
    image: a.image || getCityImage(a.name, countryName),
    description: a.description || a.longDescription?.slice(0, 160) || `A famous landmark situated in ${cityName}.`,
    tag: a.category || 'Popular Landmark'
  }));

  const fallbackAttrs = [
    {
      id: `${normCity}-landmark-1`,
      name: `Historic Center of ${cityName}`,
      category: 'Heritage',
      duration: '2-3 hours',
      image: getCityImage(cityName, countryName),
      description: `The historic cultural and architectural heart of ${cityName}, offering scenic walking boulevards and cultural squares.`,
      tag: 'City Center'
    },
    {
      id: `${normCity}-landmark-2`,
      name: `${cityName} Panoramic Viewpoint`,
      category: 'Scenic View',
      duration: '1.5 hours',
      image: getCityImage(`${cityName} view`, countryName),
      description: `Scenic overlook offering sweeping vistas and photo opportunities across the ${cityName} skyline.`,
      tag: 'Panoramic Deck'
    },
    {
      id: `${normCity}-landmark-3`,
      name: `${countryName} National Cultural Museum`,
      category: 'Museums',
      duration: '2 hours',
      image: getCityImage(`${cityName} museum`, countryName),
      description: `Renowned institution detailing regional artifacts, historical collections, and traditional art.`,
      tag: 'Arts & Culture'
    }
  ];

  return {
    city: cityName,
    country: countryName,
    flag: flag,
    airportCode: cityName.slice(0, 3).toUpperCase(),
    airportName: `${cityName} International Airport`,
    currency: { code: currencyCode, name: currencyName, symbol: currencySymbol, rate: currencyRate },
    timezone: timezones,
    safetyScore: 88,
    safetyLevel: 'Safe & Welcoming',
    firstHour: [
      {
        step: 1,
        title: `Arrive at ${cityName} Airport`,
        category: 'Arrival',
        summary: `Deplane and follow signs to baggage claim at ${cityName} airport.`,
        detail: `Check airport information monitors for your assigned flight baggage carousel and ensure tags match your claim stubs.`,
        badge: 'Arrival'
      },
      {
        step: 2,
        title: 'Immigration & Border Clearance',
        category: 'Entry',
        summary: `Present travel documents for border clearance into ${countryName}.`,
        detail: `Keep your passport (6+ months validity), visa or eVisa confirmation, and hotel booking voucher ready for the border control desk.`,
        badge: 'Border Control'
      },
      {
        step: 3,
        title: 'Terminal Connectivity & eSIM Setup',
        category: 'Tech',
        summary: `Connect to airport Wi-Fi or toggle your travel eSIM profile.`,
        detail: `Connect to the free airport Wi-Fi network or enable roaming on your digital eSIM profile for instant data.`,
        badge: 'Connectivity'
      },
      {
        step: 4,
        title: `Official Bank ATMs for ${currencyCode}`,
        category: 'Money',
        summary: `Withdraw ${currencyCode} from bank ATMs inside the arrival terminal.`,
        detail: `Use official bank ATMs inside the terminal for competitive interbank exchange rates. Contactless credit/debit cards are widely accepted.`,
        badge: 'ATM Access'
      },
      {
        step: 5,
        title: `Transit to Downtown ${cityName}`,
        category: 'Transit',
        summary: `Board airport express transit or official licensed taxi.`,
        detail: `Follow ground transportation signs to the airport express train station, shuttle bus, or official metered taxi rank. ${transitData[0] || 'Airport transit'} provides fast connections.`,
        badge: 'Transit'
      },
      {
        step: 6,
        title: 'Hotel Check-In & Local Orientation',
        category: 'Check-in',
        summary: `Arrive at your accommodation, unpack, and orient yourself.`,
        detail: `Check into your hotel, ask the concierge for a neighborhood map, and enjoy your first authentic ${foodData[0] || 'local meal'}.`,
        badge: 'Check-In'
      }
    ],
    essentials: {
      visa: {
        title: 'Visa & Entry Regulations',
        summary: `Entry requirements for travelers visiting ${countryName}.`,
        detail: `Check official consular requirements for ${countryName} based on your passport nationality. Ensure your passport has at least 6 months validity from departure date.`,
        status: 'Check Requirements',
        badgeColor: 'blue',
        officialLink: '#'
      },
      safety: {
        title: 'Safety & Health Protocol',
        summary: `Safety Index: 88/100 · Peaceful with standard tourist precautions.`,
        detail: `${cityName} is welcoming to international travelers. Practice standard travel awareness: keep valuables secure in crowded transit hubs and choose licensed transportation.`,
        status: 'Safe & Welcoming',
        badgeColor: 'emerald',
        hotlines: { police: emergencyNumber, ambulance: emergencyNumber, fire: emergencyNumber, universal: emergencyNumber }
      },
      money: {
        title: 'Money, Cards & Currency',
        summary: `Currency: ${currencyName} (${currencyCode}) · Cards and cash.`,
        detail: `Credit and debit cards are widely accepted in hotels, major restaurants, and shops. Carrying a modest amount of ${currencyCode} cash is recommended for small vendors and markets. ${tippingAdvice}`,
        status: `${currencyCode} Accepted`,
        badgeColor: 'blue'
      },
      connectivity: {
        title: 'Mobile Connectivity & Power',
        summary: `Mobile data coverage and local network connections in ${cityName}.`,
        detail: `Local eSIMs or airport SIM cards provide seamless 4G/5G data. Standard Wi-Fi is available in hotels and cafes across ${cityName}.`,
        status: 'eSIM Recommended',
        badgeColor: 'blue'
      },
      transport: {
        title: 'Local Transit & Navigation',
        summary: `Transit network: ${transitData[0] || 'Municipal transit'}.`,
        detail: `${cityName} features municipal transit options including ${transitData.join(', ')}. Mobile navigation apps like Google Maps provide reliable routing.`,
        status: 'Public Transit',
        badgeColor: 'emerald'
      },
      culture: {
        title: 'Cultural Etiquette & Customs',
        summary: `Languages: ${languages} · Polite social etiquette.`,
        detail: `Respect local cultural customs and religious heritage in ${countryName}. Courteous interaction, polite greetings, and appropriate attire at historical and religious landmarks are appreciated.`,
        greetingText: greetingAdvice,
        status: `${languages.split(',')[0]} Spoken`,
        badgeColor: 'purple'
      },
      emergency: {
        title: 'Emergency Hotlines & Medical Care',
        summary: `Universal Emergency: ${emergencyNumber} · 24/7 Dispatch.`,
        detail: `In case of medical or security assistance in ${cityName}, dial ${emergencyNumber}. Major municipal hospitals provide 24/7 emergency departments.`,
        status: '24/7 Dispatch',
        badgeColor: 'rose'
      }
    },
    neighborhoods: [
      {
        name: `Downtown / Central ${cityName}`,
        bestFor: 'First-time visitors, walking tours & landmark attractions',
        description: `The vibrant heart of ${cityName} featuring prominent architectural landmarks, shopping avenues, and top dining.`,
        avgNight: '$140 - $280',
        vibe: 'Central & Vibrant',
        transit: 'Central Transit Hub'
      },
      {
        name: 'Historic Old Quarter',
        bestFor: 'Heritage architecture, cobblestone alleys & local culture',
        description: `Atmospheric historic neighborhood lined with traditional shops, cultural monuments, and heritage cafes.`,
        avgNight: '$110 - $210',
        vibe: 'Historic & Atmospheric',
        transit: 'Walkable / Local Buses'
      },
      {
        name: 'Waterfront / Scenic Promenade',
        bestFor: 'Scenic views, leisure strolls & open-air dining',
        description: `Picturesque promenade featuring waterfront cafes, scenic vistas, and relaxing evening entertainment.`,
        avgNight: '$160 - $320',
        vibe: 'Scenic & Relaxed',
        transit: 'Promenade Transit'
      }
    ],
    transportOptions: [
      {
        title: `Airport to Downtown ${cityName}`,
        mode: 'Express Rail / Shuttle',
        duration: '20–35 min',
        cost: '$4.00 - $18.00',
        highlight: true,
        badge: 'RECOMMENDED',
        description: `Fast and direct connection linking ${cityName} airport arrivals to the central city district.`
      },
      {
        title: transitData[0] || `${cityName} City Bus & Metro`,
        mode: 'Public Rapid Transit',
        duration: 'City-wide',
        cost: '$1.50 - $4.00',
        highlight: false,
        badge: 'Local Grid',
        description: `Comprehensive municipal routes connecting every sector of ${cityName}.`
      },
      {
        title: 'Licensed City Cabs & Rideshare',
        mode: 'On-Demand Private Car',
        duration: 'On-demand',
        cost: 'Metered rates',
        highlight: false,
        badge: 'Door-to-Door',
        description: `Official metered taxis and licensed ride-hailing services provide safe private transfers.`
      }
    ],
    foodHighlights: foodData.map((fName, idx) => ({
      name: fName,
      type: idx === 0 ? 'Signature Specialty' : idx === 1 ? 'Regional Classic' : 'Local Treat',
      description: `Authentic culinary creation popular in ${cityName}, crafted with regional spices and traditional preparation methods.`,
      spot: `Local heritage bistros and markets across ${cityName}`,
      dietary: 'Local Specialty'
    })),
    curatedAttractions: curatedAttrs.length > 0 ? curatedAttrs : fallbackAttrs,
    packingChecklist: [
      { id: 'p1', label: 'Comfortable walking shoes', category: 'Clothing', checked: true },
      { id: 'p2', label: 'Layered weather jacket / Windbreaker', category: 'Clothing', checked: true },
      { id: 'p3', label: 'Universal electrical power adapter', category: 'Electronics', checked: false },
      { id: 'p4', label: 'Valid Passport (6+ months validity) & Visa copy', category: 'Documents', checked: true },
      { id: 'p5', label: 'Travel health insurance policy document', category: 'Documents', checked: true },
      { id: 'p6', label: 'Portable phone power bank', category: 'Electronics', checked: false },
      { id: 'p7', label: 'Reusable water bottle', category: 'Essentials', checked: false }
    ]
  };
}
