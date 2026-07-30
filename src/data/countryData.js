export const continents = [
  {
    id: 'europe',
    name: 'Europe',
    overview: 'A continent of rich diversity, historic civilizations, and leading economic integration.',
    countriesCount: 44,
    population: '746 Million',
    area: '10.18M km²',
    gdpShare: '22%',
    languages: 'German, English, French, Spanish, Russian',
    majorCities: 'London, Paris, Berlin, Rome, Zurich',
    quickFacts: [
      'Home to the European Union, the largest economic single market.',
      'Hosts the world\'s highest density of UNESCO World Heritage sites.',
      'Pioneered industrial revolutions and high-speed passenger rail networks.'
    ],
    landAreaShare: '6.8%',
    countries: ['Switzerland', 'Germany', 'France', 'Italy', 'United Kingdom', 'Spain', 'Netherlands', 'Belgium', 'Sweden', 'Norway', 'Austria', 'Denmark', 'Finland', 'Portugal', 'Greece', 'Ireland']
  },
  {
    id: 'asia',
    name: 'Asia',
    overview: 'The largest and most populous continent, blending ancient cultural heritages with global high-tech metropolises.',
    countriesCount: 49,
    population: '4.7 Billion',
    area: '44.58M km²',
    gdpShare: '39%',
    languages: 'Mandarin, Japanese, Hindi, Arabic, Russian',
    majorCities: 'Tokyo, Beijing, Singapore, Mumbai, Seoul',
    quickFacts: [
      'Contains both the highest point on Earth (Mt. Everest) and the lowest (Dead Sea).',
      'The global epicenter of technology, e-commerce, and advanced electronics.',
      'Birthplace of major world religions including Hinduism, Buddhism, Islam, and Shinto.'
    ],
    landAreaShare: '29.9%',
    countries: ['Japan', 'China', 'India', 'South Korea', 'Singapore', 'Saudi Arabia', 'Turkey', 'Israel', 'Indonesia', 'Thailand', 'Vietnam', 'Philippines', 'United Arab Emirates', 'Pakistan']
  },
  {
    id: 'americas',
    name: 'Americas',
    overview: 'Spanning from arctic glaciers to tropical rainforests, a region defined by dynamic economic engines and rich ecological biomes.',
    countriesCount: 35,
    population: '1.03 Billion',
    area: '42.55M km²',
    gdpShare: '28%',
    languages: 'English, Spanish, Portuguese, French',
    majorCities: 'New York, Los Angeles, São Paulo, Rio, Toronto',
    quickFacts: [
      'Home to the Amazon Rainforest, the lungs of the planet and largest biodiversity reserve.',
      'Bridges the Atlantic and Pacific oceans, critical for global maritime shipping routes.',
      'Features high-tech software hubs (Silicon Valley) alongside massive agricultural plains.'
    ],
    landAreaShare: '28.5%',
    countries: ['Brazil', 'United States', 'Canada', 'Mexico', 'Argentina', 'Colombia', 'Peru', 'Chile', 'Ecuador', 'Costa Rica', 'Venezuela', 'Cuba']
  },
  {
    id: 'africa',
    name: 'Africa',
    overview: 'A vast continent of immense mineral wealth, breathtaking natural landscapes, and the world\'s youngest demographics.',
    countriesCount: 54,
    population: '1.4 Billion',
    area: '30.37M km²',
    gdpShare: '3%',
    languages: 'English, French, Arabic, Swahili, Zulu',
    majorCities: 'Cairo, Johannesburg, Lagos, Nairobi, Cape Town',
    quickFacts: [
      'The cradle of humanity, hosting the richest hominid fossil sites in the world.',
      'Contains the Sahara Desert, the world\'s largest hot desert.',
      'Leading global producer of platinum, gold, diamonds, and cobalt.'
    ],
    landAreaShare: '20.4%',
    countries: ['South Africa', 'Egypt', 'Nigeria', 'Kenya', 'Ethiopia', 'Morocco', 'Ghana', 'Senegal', 'Tanzania', 'Angola', 'Uganda', 'Rwanda', 'Madagascar', 'Algeria']
  },
  {
    id: 'oceania',
    name: 'Oceania',
    overview: 'A geographic region comprised of thousands of islands across the Pacific Ocean, characterized by unique endemic wildlife and coral biomes.',
    countriesCount: 14,
    population: '45 Million',
    area: '8.52M km²',
    gdpShare: '1.5%',
    languages: 'English, Maori, Tok Pisin, Fijian',
    majorCities: 'Sydney, Melbourne, Auckland, Brisbane, Perth',
    quickFacts: [
      'Dominated by the Australian continent, the flattest and driest inhabited landmass.',
      'Home to the Great Barrier Reef, the planet\'s largest coral reef ecosystem.',
      'Unique isolated ecosystems hosting endemic marsupials found nowhere else.'
    ],
    landAreaShare: '5.7%',
    countries: ['Australia', 'New Zealand', 'Fiji', 'Papua New Guinea', 'Samoa', 'Tonga', 'Vanuatu', 'Solomon Islands']
  }
];

export const countriesData = {
  // ── FLAGSHIP COUNTRIES ─────────────────────────────────────────────
  switzerland: {
    id: 'switzerland',
    name: 'Switzerland',
    flag: '🇨🇭',
    continent: 'Europe',
    overview: 'A landlocked country of towering alpine peaks, deep glacial valleys, and pristine lakefront cities. Renowned for its direct democracy, financial stability, and historical neutrality.',
    basic: {
      capital: 'Bern',
      population: '8.9 Million',
      area: '41,285 km²',
      currency: { code: 'CHF', symbol: 'CHF', rate: 0.91 },
      languages: 'German, French, Italian, Romansh',
      timezones: 'CET (UTC+1) / CEST (UTC+2)',
      drivingSide: 'Right',
      callingCode: '+41',
      governmentType: 'Federal Semi-Direct Democracy',
      symbols: {
        flower: 'Edelweiss',
        animal: 'Alpine Cow / Steinbock',
        anthem: 'Swiss Psalm',
        motto: 'Unus pro omnibus, omnes pro uno (One for all, all for one)'
      },
      quickFacts: [
        'Direct democracy where citizens can challenge any law passed by parliament.',
        'Maintained active armed political neutrality since the Congress of Vienna in 1815.',
        'Consistently ranked #1 in the Global Innovation Index for precision tech.'
      ]
    },
    intermediate: {
      geography: 'A landlocked nation dominated by three geological regions: the Swiss Alps in the south, the Central Plateau, and the Jura Mountains in the north.',
      climate: 'Temperate climate, varying significantly with altitude. Cold, snowy winters in mountains; pleasant, warm summers in lowlands.',
      regions: [
        { name: 'Zurich Region', capital: 'Zurich', highlight: 'Financial capital and lakeside cultural center.' },
        { name: 'Geneva Lake Region', capital: 'Lausanne', highlight: 'Terraced vineyards, international organizations, and lakeside resorts.' },
        { name: 'Bernese Oberland', capital: 'Interlaken', highlight: 'Dramatic alpine peaks, glaciers, and deep blue lakes.' },
        { name: 'Ticino', capital: 'Bellinzona', highlight: 'Italian-speaking sector with Mediterranean microclimate.' }
      ],
      industries: 'Banking & Financial Services, Pharmaceuticals, Luxury Watches, Precision Engineering (Robotics), Tourism.',
      transportation: 'Swiss Federal Railways (SBB CFF FFS), postal buses (PostBus), Alpine cable cars, and dense regional tramways.',
      education: 'State-funded public education. Home to world-leading research hubs ETH Zurich and EPFL Lausanne.',
      healthcare: 'Universal mandatory private health insurance, featuring exceptionally fast access and high medical standards.',
      tourism: 'Famous for alpine skiing, mountain hiking, scenic train rides (Glacier Express), and chocolate/cheese tastings.',
      customs: 'Values punctuality, quiet hours (Sunday quietude), formal greetings, and eco-conscious waste recycling systems.',
      cuisine: 'Fondue, Raclette, Rösti (grated potato cakes), Muesli, and world-famous premium milk chocolates.',
      festivals: 'Fête de L\'Escalade (Geneva), Basler Fasnacht (Basel Carnival), Street Parade (Zurich electronic music festival).',
      travelTips: [
        'Invest in a Swiss Travel Pass for unlimited public trains, buses, and ferry transfers.',
        'Tap water is safe to drink everywhere, including all public fountain spouts.',
        'Tipping is not required; service charge is always factored into restaurant bills.'
      ],
      distances: [
        { from: 'Zurich', to: 'Geneva', distance: '224 km', time: '2h 44m via SBB Train' },
        { from: 'Zurich', to: 'Interlaken', distance: '120 km', time: '1h 50m via SBB Train' },
        { from: 'Geneva', to: 'Interlaken', distance: '145 km', time: '2h 30m via Scenic Train' }
      ],
      cuisineList: [
        { name: 'Cheese Fondue', desc: 'Melted Gruyère and Vacherin cheese inside a communal caquelon, flavored with dry white wine and garlic.', emoji: '🫕' },
        { name: 'Rösti Fritter', desc: 'Crispy pan-fried fritters made of coarsely grated parboiled potatoes, considered a Swiss national breakfast staple.', emoji: '🥔' },
        { name: 'Zürcher Geschnetzeltes', desc: 'Sliced tender veal strips cooked in a creamy white wine and mushroom sauce, served beside hot crispy Rösti.', emoji: '🥩' }
      ],
      festivalList: [
        { name: 'Basler Fasnacht', date: 'Feb/Mar', desc: 'The largest carnival in Switzerland, starting at exactly 4:00 AM with a magical costumed lantern parade.', emoji: '🎭' },
        { name: 'Zurich Street Parade', date: 'August', desc: 'A massive lakeside electronic dance music street parade drawing over a million dancers from around the globe.', emoji: '🎶' }
      ]
    },
    advanced: {
      history: 'Founded as the Old Swiss Confederacy in 1291 with the Federal Charter. Developed into a decentralized direct democracy with the Federal Constitution of 1848, paving the way for modern industrialization and neutrality.',
      culture: 'Highly decentralized culture, showing deep German, French, and Italian linguistic influences across cantonal borders.',
      diversity: 'Foreign residents comprise over 25% of the total population, mainly from European Union countries.',
      religion: 'Roman Catholicism (34%), Swiss Reformed Church (23%), Islam (5.5%), and Non-religious (30%).',
      architecture: 'Blends medieval castles (Chillon Castle), timber alpine chalets, and premium modern glassmorphic designs (Le Corbusier).',
      politics: 'Governed by a seven-member Federal Council representing a coalition of major political parties, serving as collective head of state.',
      economics: {
        gdp: '$850 Billion USD',
        gdpPerCapita: '$92,000 USD',
        inflation: '1.8%',
        unemployment: '2.0%',
        exportShare: 'Products: Pharmaceuticals, Gold, Watches, Machinery'
      },
      infrastructure: 'Superbly engineered mountain tunnels (Gotthard Base Tunnel - world\'s longest at 57km), 100% electrified rail grids.',
      relations: 'Member of the UN, EFTA, and Schengen Area, but remains outside the European Union and NATO.',
      unescoSites: [
        'Historic Abbey of Saint Gall',
        'Jungfrau-Aletsch Alpine Glaciers',
        'Lavaux Terraced Vineyards overlooking Lake Geneva'
      ],
      hiddenDestinations: 'Valle Verzasca (crystal-clear turquoise river), Creux du Van (massive natural rock amphitheater), Appenzell village.',
      lifestyle: 'Enjoys one of the world\'s highest standards of living, characterized by strong work-life balance, mandatory local voting, and active outdoor hiking cultures.',
      futureProjects: 'Cargo Sous Terrain: An automated underground logistics cargo system connecting major cities by 2035.',
      timeline: [
        { year: '1291', epoch: 'Federal Foundation', title: 'Old Swiss Confederacy', desc: 'Signing of the Federal Charter on the Rütli meadow by Uri, Schwyz, and Unterwalden cantons, establishing defensive alliances.' },
        { year: '1815', epoch: 'Eternal Neutrality', title: 'Vienna Congress Pact', desc: 'European powers guarantee Switzerland perpetual armed neutrality. Three new cantons (Valais, Neuchâtel, Geneva) join.' },
        { year: '1848', epoch: 'Federal Democratic Republic', title: 'Modern Swiss Constitution', desc: 'Adoption of the new Federal Constitution, transforming the loose alliance of cantons into a cohesive federal state.' }
      ]
    },
    cities: [
      {
        name: 'Zurich',
        overview: 'A global financial hub nestled at the northern tip of Lake Zurich, blending medieval charm with high-end luxury shopping.',
        population: '430,000 (Metropolitan: 1.4 Million)',
        culture: 'A lively cultural landscape hosting the Street Parade, contemporary galleries, and premium lakeside lidos.',
        history: 'Founded by Romans as Turicum. Evolved into a silk-weaving mercantile city and the center of the Swiss Protestant Reformation under Zwingli.',
        attractions: 'Bahnhofstrasse (luxury retail), Grossmünster Church, Lindenhof Hill, Lake Zurich Promenade, Kunsthaus Art Museum.',
        foodSpecialties: 'Zürcher Geschnetzeltes (veal in cream sauce), Luxembergerli macarons, local alpine cheeses.',
        transportation: 'VBZ Tramways, S-Bahn local trains, and public Limmat river cruise boats.',
        costOfLiving: 'Very High (120/100 Index)',
        safety: 'Extremely Safe (92/100 Safety Index)',
        bestTimeToVisit: 'June to August (lakeside swimming) or December (Christmas markets).',
        nearbyDestinations: 'Rhine Falls (Europe\'s largest waterfall), Mount Uetliberg.'
      },
      {
        name: 'Geneva',
        overview: 'A cosmopolitan city situated on the shores of Lake Geneva, serving as the global headquarters for diplomacy and human rights.',
        population: '205,000',
        culture: 'Highly international, host to the United Nations, Red Cross, and global scientific institutions like CERN.',
        history: 'A historic republic that became the "Protestant Rome" under John Calvin. Joined the Swiss Confederation in 1815.',
        attractions: 'Jet d\'Eau water fountain, St. Pierre Cathedral, Palais des Nations, Old Town historic squares, Red Cross Museum.',
        foodSpecialties: 'Filet de Perche (lake fish), Geneva-style pear tart, Swiss milk chocolate truffles.',
        transportation: 'TPG public buses and trams, Mouettes Genevoises public lake water taxis.',
        costOfLiving: 'Very High (115/100 Index)',
        safety: 'Very Safe (85/100 Safety Index)',
        bestTimeToVisit: 'May to September (lake cruises) or March (International Motor Show).',
        nearbyDestinations: 'Yvoire (medieval French village), Chamonix & Mont Blanc (France).'
      },
      {
        name: 'Interlaken',
        overview: 'The adventure tourism capital of Switzerland, spectacularly situated between Lake Thun and Lake Brienz in the Bernese Alps.',
        population: '6,000 (Tourism-centric hub)',
        culture: 'Highly focused on alpine sport, winter ski chalets, and classic Swiss mountain hospitality.',
        history: 'Centuried monastery destination that grew into a primary nineteenth-century spa resort for European aristocrats.',
        attractions: 'Höheweg Park, Harder Kulm viewpoint, Jungfraujoch (Top of Europe rail link), Schynige Platte, alpine glaciers.',
        foodSpecialties: 'Swiss Alpine macaroni (Älplermagronen), mountain trout, walnut pastries.',
        transportation: 'Regional BOB and MGB trains, historic steam paddle wheel boats on the lakes.',
        costOfLiving: 'High (Tourist pricing)',
        safety: 'Impeccable (95/100 Safety Index)',
        bestTimeToVisit: 'December to March (skiing) or June to September (hiking and paragliding).',
        nearbyDestinations: 'Lauterbrunnen (Valley of 72 waterfalls), Grindelwald, Wengen.'
      }
    ]
  },
  japan: {
    id: 'japan',
    name: 'Japan',
    flag: '🇯🇵',
    continent: 'Asia',
    overview: 'An island nation in East Asia where thousands of years of imperial history exist in harmony with hyper-modern skyscraper cities and advanced robotic infrastructures.',
    basic: {
      capital: 'Tokyo',
      population: '124.5 Million',
      area: '377,975 km²',
      currency: { code: 'JPY', symbol: '¥', rate: 156.40 },
      languages: 'Japanese',
      timezones: 'JST (UTC+9)',
      drivingSide: 'Left',
      callingCode: '+81',
      governmentType: 'Unitary Parliamentary Constitutional Monarchy',
      symbols: {
        flower: 'Cherry Blossom (Sakura) / Chrysanthemum',
        animal: 'Green Pheasant (National Bird)',
        anthem: 'Kimigayo',
        motto: 'Peace and Progress'
      },
      quickFacts: [
        'Composed of over 6,800 mountainous islands, dominated by the four main landmasses.',
        'Boasts the world\'s highest density of vending machines and automated robotic stores.',
        'Features the highest life expectancy on Earth due to healthy regional dietary habits.'
      ]
    },
    intermediate: {
      geography: 'A rugged volcanic archipelago where forest-clad mountains cover 70% of the land, home to active volcanoes including the iconic Mount Fuji.',
      climate: 'Varies from humid continental in the north (Hokkaido) with heavy winter snow, to warm subtropical in the south (Okinawa).',
      regions: [
        { name: 'Kanto', capital: 'Tokyo', highlight: 'Highly populated plains, industrial center, and imperial capital.' },
        { name: 'Kansai', capital: 'Osaka', highlight: 'Ancient capitals Kyoto/Nara, temples, and culinary hubs.' },
        { name: 'Hokkaido', capital: 'Sapporo', highlight: 'Cozy winter wilderness, volcanic lakes, and ski mountains.' },
        { name: 'Kyushu', capital: 'Fukuoka', highlight: 'Thermal hot springs (onsen), active craters, and sub-tropical coasts.' }
      ],
      industries: 'Automotive Manufacturing (Toyota, Honda), Robotics & Advanced Electronics, Finance, Gaming & Anime Entertainment.',
      transportation: 'Shinkansen (Bullet Trains - running at 320 km/h), extremely precise regional subways, and highway bus terminals.',
      education: '9-year compulsory schooling with nearly 100% literacy. Elite state research centers led by the University of Tokyo.',
      healthcare: 'Universal statutory healthcare coverage. Insured co-pays are capped depending on income brackets.',
      tourism: 'Famous for historic temples, relaxing onsen hot springs, cherry blossom viewing (hanami), and anime shopping.',
      customs: 'Values deep bowing, quiet public transport, taking off shoes at entrances (genkan), and avoiding street-eating.',
      cuisine: 'Sushi, Sashimi, Ramen, Tempura, Wagyu Beef, Okonomiyaki, and green Matcha teas.',
      festivals: 'Gion Matsuri (Kyoto), Sapporo Snow Festival, Tenjin Matsuri (Osaka boat procession).',
      travelTips: [
        'Get a rechargeable IC Card (Suica/Pasmo) for seamless train tap-ins and vending payments.',
        'Carry a small plastic bag: public trash cans are extremely rare due to safety protocols.',
        'Tipping is strictly discouraged; doing so will often result in waiters chasing you down to return it.'
      ],
      distances: [
        { from: 'Tokyo', to: 'Kyoto', distance: '372 km', time: '2h 15m via Nozomi Shinkansen' },
        { from: 'Tokyo', to: 'Osaka', distance: '402 km', time: '2h 30m via Nozomi Shinkansen' },
        { from: 'Kyoto', to: 'Osaka', distance: '43 km', time: '28m via Rapid Special Train' }
      ],
      cuisineList: [
        { name: 'Edomae Sushi', desc: 'Vinegared sushi rice topped with premium fresh catches from Tokyo Bay, prepared with master precision.', emoji: '🍣' },
        { name: 'Shoyu Ramen', desc: 'Springy wheat noodles served in a savory soy-sauce infused chicken and dashi broth, topped with chashu pork.', emoji: '🍜' },
        { name: 'Matcha Tea Ceremony', desc: 'Traditional multi-course imperial dining featuring seasonal ingredients, concluding with high-grade green tea.', emoji: '🍵' }
      ],
      festivalList: [
        { name: 'Kyoto Gion Matsuri', date: 'July', desc: 'A spectacular historic festival in Kyoto featuring massive float parades and evening street feasts.', emoji: '🏮' },
        { name: 'Sapporo Snow Festival', date: 'February', desc: 'A winter wonderland event displaying giant, beautifully carved ice sculptures in Odori Park.', emoji: '❄️' }
      ]
    },
    advanced: {
      history: 'Spans from ancient hunter-gatherer Jomon eras to the feudal rule of the Samurai under the Tokugawa Shogunate. Opened to the West during the Meiji Restoration (1868) and rebuilt into a global pacifist economic powerhouse post-WWII.',
      culture: 'Intricate mixture of indigenous Shinto animism, Buddhist Zen traditions, and modern pop cultures (manga and gaming).',
      diversity: 'Historically homogenous population, though foreign work visas have been rapidly expanded since 2019.',
      religion: 'Shintoism (70%), Buddhism (67%), with most citizens actively practicing syncretic rituals from both.',
      architecture: 'Wooden joinery pagodas (Kiyomizu-dera) paired with sleek, light-diffusing skyscrapers and concrete minimalist arches.',
      politics: 'A constitutional monarchy where the Emperor holds symbolic duties. Executive power resides with the Prime Minister and the Diet.',
      economics: {
        gdp: '$4.2 Trillion USD',
        gdpPerCapita: '$34,000 USD',
        inflation: '2.5%',
        unemployment: '2.6%',
        exportShare: 'Products: Automobiles, High-tech machinery, Semiconductors, Steel'
      },
      infrastructure: 'Stunningly precise transit networks, seismic-resistant engineering codes, and advanced nationwide fiber optics.',
      relations: 'Strong US alliance, member of the G7, G20, and UN, actively advocating for open Indo-Pacific maritime networks.',
      unescoSites: [
        'Mount Fuji (Sacred Place and Source of Artistic Inspiration)',
        'Historic Monuments of Ancient Kyoto',
        'Himeji Castle (White Heron Castle)'
      ],
      hiddenDestinations: 'Shirakawa-go (thatch-roof farmhouses), Iya Valley (suspension vine bridges), Yakushima (ancient cedar forests).',
      lifestyle: 'Characterized by high urban densities, extreme attention to public order, polite social etiquette, and strong community cleanup traditions.',
      futureProjects: 'Linear Chuo Shinkansen: Superconducting Maglev railway connecting Tokyo and Nagoya in 40 minutes at 500 km/h by 2027.',
      timeline: [
        { year: '1192', epoch: 'Feudal Shogunate', title: 'Rise of the Samurai', desc: 'Establishment of the Kamakura Shogunate, shifting political power to the warrior class and Zen Buddhist values.' },
        { year: '1603', epoch: 'Edo Sakoku Seclusion', title: 'Tokugawa Pax Romana', desc: 'Seclusion policy (Sakoku) cuts all contact with the West, nurturing distinctive geisha arts, kabuki, and woodblock prints.' },
        { year: '1868', epoch: 'Imperial Restoration', title: 'Meiji Westernization Era', desc: 'Restoration of imperial rule under Emperor Meiji, dismantling the shogunate and driving modern industrial growth.' }
      ]
    },
    cities: [
      {
        name: 'Tokyo',
        overview: 'The world\'s most populous metropolitan area, a neon-lit cyber-oasis blending futuristic architecture with historic shrines.',
        population: '14 Million (Metropolitan: 37 Million)',
        culture: 'The epicenter of pop culture, fashion (Harajuku), high-tech electronics (Akihabara), and Michelin-starred dining.',
        history: 'Originated as Edo, a small fishing village that became the Tokugawa Shogun\'s seat in 1603. Renamed Tokyo ("Eastern Capital") in 1868.',
        attractions: 'Shibuya Crossing, Senso-ji Temple, Tokyo Skytree, Meiji Shrine, Imperial Palace Gardens.',
        foodSpecialties: 'Edomae Sushi, Tempura, Tonkotsu Ramen, Yakitori skewers.',
        transportation: 'JR Yamanote circular rail, Tokyo Metro subways, Yurikamome driverless monorail.',
        costOfLiving: 'High (95/100 Index)',
        safety: 'Extremely Safe (90/100 Safety Index)',
        bestTimeToVisit: 'March to April (cherry blossoms) or October to November (autumn foliage).',
        nearbyDestinations: 'Mount Takao, Kamakura (giant bronze Buddha), Hakone hot springs.'
      },
      {
        name: 'Kyoto',
        overview: 'The cultural heart of Japan, preserving thousands of classical Buddhist temples, Shinto shrines, and traditional geisha districts.',
        population: '1.45 Million',
        culture: 'Vested in traditional tea ceremonies, flower arrangement (ikebana), geisha arts, and premium kaiseki multi-course dining.',
        history: 'Served as Japan\'s imperial capital for over a millennium (794 to 1869) under the name Heian-kyo, spared from WWII aerial bombing.',
        attractions: 'Fushimi Inari-taisha Shrine, Kinkaku-ji (Golden Pavilion), Arashiyama Bamboo Grove, Kiyomizu-dera, Giza district.',
        foodSpecialties: 'Kaiseki ryori, Yudofu (tofu simmered in broth), Matcha green tea desserts, Yatsuhashi sweet dumplings.',
        transportation: 'Kyoto City Bus networks, Hankyu and Keihan regional rail links.',
        costOfLiving: 'Moderate (75/100 Index)',
        safety: 'Impeccable (94/100 Safety Index)',
        bestTimeToVisit: 'November (crimson maple leaves) or April (sakura blooms).',
        nearbyDestinations: 'Nara Park (free-roaming deer), Uji (world-class matcha tea farms).'
      },
      {
        name: 'Osaka',
        overview: 'A vibrant merchant city famous for its street food, neon-clad entertainment strips, and outgoing, friendly local culture.',
        population: '2.7 Million (Metropolitan: 19 Million)',
        culture: 'Known as "Japan\'s Kitchen," characterized by casual dining, stand-bar culture, and a historic center of stand-up comedy.',
        history: 'Historically the commercial heart of Japan, serving as the primary hub for rice trading and merchant guilds during the Edo era.',
        attractions: 'Dotonbori neon canal, Osaka Castle, Shinsekai retro district, Universal Studios Japan, Umeda Sky Building.',
        foodSpecialties: 'Takoyaki (octopus balls), Okonomiyaki (savory pancakes), Kushikatsu (skewered fried food).',
        transportation: 'Osaka Loop Line trains, Midosuji Subway Line, regional railways to Kobe and Kyoto.',
        costOfLiving: 'Moderate (80/100 Index)',
        safety: 'Very Safe (88/100 Safety Index)',
        bestTimeToVisit: 'October to November or April to May.',
        nearbyDestinations: 'Kobe (world-famous beef), Himeji Castle.'
      }
    ]
  },
  brazil: {
    id: 'brazil',
    name: 'Brazil',
    flag: '🇧🇷',
    continent: 'Americas',
    overview: 'The largest country in South America, spanning the massive Amazon River basin, pristine coastal beaches, and culturally rich cities that showcase a vibrant mixture of European, African, and Indigenous histories.',
    basic: {
      capital: 'Brasilia',
      population: '215.3 Million',
      area: '8.51 Million km²',
      currency: { code: 'BRL', symbol: 'R$', rate: 5.15 },
      languages: 'Portuguese',
      timezones: 'BRT (UTC-3) / FNT (UTC-2) / AMT (UTC-4)',
      drivingSide: 'Right',
      callingCode: '+55',
      governmentType: 'Federal Presidential Constitutional Republic',
      symbols: {
        flower: 'Ipê-amarelo',
        animal: 'Jaguar / Rufous-bellied Thrush',
        anthem: 'Hino Nacional Brasileiro',
        motto: 'Ordem e Progresso (Order and Progress)'
      },
      quickFacts: [
        'Contains over 60% of the Amazon Rainforest, hosting 1 in 10 known species on Earth.',
        'World\'s absolute leading exporter of coffee, sugarcane, and soybeans for over 150 years.',
        'Hosts Rio Carnival, the largest street festival on the planet, drawing millions of dancers.'
      ]
    },
    intermediate: {
      geography: 'Dominated by the massive Amazon River basin, the Pantanal tropical wetlands, and rolling central savannah plateaus (Cerrado).',
      climate: 'Mostly tropical and subtropical, featuring warm conditions year-round. The semi-arid Northeast has hot, dry weather.',
      regions: [
        { name: 'Southeast', capital: 'São Paulo', highlight: 'Economic powerhouse, megacities, and premium coffee production.' },
        { name: 'North', capital: 'Manaus', highlight: 'Amazon jungle basin, riverboat channels, and eco-resorts.' },
        { name: 'Northeast', capital: 'Salvador', highlight: 'Colonial heritage sites, African-Brazilian culture, and dunes.' },
        { name: 'South', capital: 'Porto Alegre', highlight: 'European immigrant towns, high-altitude vineyards, and canyons.' }
      ],
      industries: 'Agribusiness, Mining (Iron Ore), Biofuels (Ethanol), Aircraft Manufacturing (Embraer), Deep-water Oil Extraction.',
      transportation: 'Interstate bus highway systems, extensive riverboat routes in the Amazon, and domestic flight loops.',
      education: 'Free public federal universities (USP) alongside private systems. Technical trade sectors are highly active.',
      healthcare: 'Unified Health System (SUS) provides universal free medical care, complemented by high-end private networks.',
      tourism: 'Famous for golden beaches (Copacabana), Amazon rainforest expeditions, Iguaçu waterfalls, and colonial historic towns.',
      customs: 'Values highly expressive physical greetings, warm social gatherings, strong family units, and artistic musicality.',
      cuisine: 'Feijoada Completa (black bean and pork stew), Churrasco (Brazilian barbecue), Pão de Queijo (cheese bread).',
      festivals: 'Rio de Janeiro Carnival, Festa Junina (folklore harvest festival), Parintins Boi-Bumbá boat pageant.',
      travelTips: [
        'Download ride-hailing apps like Uber or 99: they are highly recommended for safe urban travel.',
        'Carry a small amount of cash, but expect that credit cards are accepted virtually everywhere, even by beach vendors.',
        'Apply high-strength insect repellent containing DEET when traveling into jungle basin sectors.'
      ],
      distances: [
        { from: 'Brasilia', to: 'Rio de Janeiro', distance: '936 km', time: '1h 40m Flight' },
        { from: 'Brasilia', to: 'São Paulo', distance: '873 km', time: '1h 30m Flight' },
        { from: 'Rio de Janeiro', to: 'São Paulo', distance: '357 km', time: '6h via Express Bus / 50m Flight' },
        { from: 'Brasilia', to: 'Manaus', distance: '1,930 km', time: '2h 50m Flight' }
      ],
      cuisineList: [
        { name: 'Feijoada Completa', desc: 'A rich, slow-simmered black bean stew with pork and beef cuts, served with farofa and orange slices.', emoji: '🍲' },
        { name: 'Churrasco Gaúcho', desc: 'Skewered premium cuts of beef roasted slow over open fire pits, sliced tableside with rock salt.', emoji: '🥩' },
        { name: 'Pão de Queijo', desc: 'Warm, gluten-free cheese bread buns made of sour cassava flour, soft on the inside.', emoji: '🫓' }
      ],
      festivalList: [
        { name: 'Rio Carnival', date: 'February', desc: 'The biggest street party in the world, filled with Samba school parades, drum beats, and gold floats.', emoji: '🎭' },
        { name: 'Festa Junina', date: 'June', desc: 'A vibrant winter harvest festival celebrating rural customs, square dances, and corn-based treats.', emoji: '🌽' }
      ]
    },
    advanced: {
      history: 'Inhabited by hundreds of indigenous groups prior to the arrival of Portuguese navigator Pedro Álvares Cabral in 1500. Remained a Portuguese colony until declaring independence as the Empire of Brazil (1822), transitioning to a federal republic in 1889.',
      culture: 'An exceptionally rich synthesis of native Amerindian, Portuguese colonial, and West African musical, religious, and culinary traditions.',
      diversity: 'Extremely diverse multi-racial population (Pardo, White, Black, Asian-Brazilian).',
      religion: 'Roman Catholicism (64%), Protestantism (22%), Spiritism, Afro-Brazilian religions (Candomblé/Umbanda).',
      architecture: 'Rich baroque colonial stone tiles (Pelourinho) contrasted with Oscar Niemeyer\'s famous white concrete futurism.',
      politics: 'Federal republic divided into 26 states and one Federal District. The executive president serves a four-year term.',
      economics: {
        gdp: '$2.1 Trillion USD',
        gdpPerCapita: '$9,800 USD',
        inflation: '4.2%',
        unemployment: '7.8%',
        exportShare: 'Products: Soybeans, Crude Petroleum, Iron Ore, Poultry, Cellulose'
      },
      infrastructure: 'Massive offshore deep-water oil rigs, expanding solar grids in the Northeast, and extensive regional airports.',
      relations: 'Leading founder of Mercosur and BRICS, playing a key role in global environmental diplomacy and G20 councils.',
      unescoSites: [
        'Iguaçu National Park and Waterfalls',
        'Historic Center of Salvador de Bahia',
        'Brasília Modernist City Grid'
      ],
      hiddenDestinations: 'Lençóis Maranhenses (pure white sand dunes filled with blue lagoons), Jalapão sand dunes, Fernando de Noronha island.',
      lifestyle: 'Focuses heavily on beach outings, outdoor sports (football, beach volleyball), family weekend barbecues, and musical festivals.',
      futureProjects: 'Amazon Sustainable Reserve expansion and major high-voltage transmission grids to connect Northeast wind farms.',
      timeline: [
        { year: '1500', epoch: 'Colonial Arrival', title: 'Portuguese Discovery', desc: 'Navigator Pedro Álvares Cabral lands at Porto Seguro, establishing sugarcane and timber trade networks.' },
        { year: '1822', epoch: 'Imperial Declaration', title: 'Empire of Brazil', desc: 'Prince Dom Pedro I declares independence from Portugal beside the Ipiranga river, establishing the local empire.' },
        { year: '1889', epoch: 'Republican Era', title: 'Proclamation of Republic', desc: 'A military coup deposes Emperor Dom Pedro II, establishing the modern federal republican governance framework.' }
      ]
    },
    cities: [
      {
        name: 'Rio de Janeiro',
        overview: 'Known as the "Marvelous City," Rio is a dramatic seaside metropolis nestled between lush mountain peaks and golden Atlantic beaches.',
        population: '6.7 Million (Metropolitan: 13 Million)',
        culture: 'The birthplace of Samba and Bossa Nova, home to iconic football culture (Maracanã) and world-renowned beach subcultures.',
        history: 'Founded by Portuguese in 1565. Served as the capital of the Kingdom of Portugal (during Napoleonic wars) and Brazil until 1960.',
        attractions: 'Christ the Redeemer, Sugarloaf Mountain, Copacabana & Ipanema Beaches, Tijuca Forest, Selarón Steps.',
        foodSpecialties: 'Feijoada carioca, Bolinho de Bacalhau (codfish balls), local draft beer (Chopp), Caipirinha cocktail.',
        transportation: 'Rio Metro line, public BRT express buses, and modern electric VLT trams in downtown.',
        costOfLiving: 'Moderate (55/100 Index)',
        safety: 'Moderate (Exercise caution in tourist areas; 40/100 Safety Index)',
        bestTimeToVisit: 'December to March (warm beach weather and Carnival).',
        nearbyDestinations: 'Búzios (luxury beach town), Petrópolis (historic imperial mountain resort).'
      },
      {
        name: 'São Paulo',
        overview: 'A massive, high-energy metropolis that serves as the economic, financial, and gastronomic powerhouse of South America.',
        population: '12.3 Million (Metropolitan: 22 Million)',
        culture: 'Extremely diverse, featuring the largest Japanese population outside Japan, massive Italian quarters, and avant-garde art.',
        history: 'Founded as a Jesuit mission in 1554. Boomed into a global hub during the nineteenth-century coffee rush.',
        attractions: 'Paulista Avenue, MASP Art Museum, Ibirapuera Park, Municipal Market, Liberdade Asian Quarter.',
        foodSpecialties: 'Mortadella sandwich, Paulistano pizza, Virado a Paulista, gourmet international cuisines.',
        transportation: 'Extensive SP Metro subway grid, massive bus terminals (Tietê).',
        costOfLiving: 'Moderate-High (65/100 Index)',
        safety: 'Moderate (Stay alert at night; 50/100 Safety Index)',
        bestTimeToVisit: 'April to September (mild, dry autumn and winter weather).',
        nearbyDestinations: 'Santos (historic coffee port), Ilhabela island.'
      },
      {
        name: 'Manaus',
        overview: 'The capital of Amazonas state, a bustling industrial duty-free port situated deep inside the dense Amazon Rainforest.',
        population: '2.2 Million',
        culture: 'Blends indigenous Amazonian folklore with the legacy of the late nineteenth-century wealthy rubber boom.',
        history: 'Grew rapidly during the rubber boom (Late 1800s), financing the construction of grand European theatres using imported materials.',
        attractions: 'Amazon Theatre (opera house), Meeting of the Waters (Amazon and Rio Negro), Adolpho Ducke Forest Reserve, local river markets.',
        foodSpecialties: 'Tambaqui fish ribs, Tacacá soup, Açaí pulp, cupuaçu juice.',
        transportation: 'Regional public buses, extensively organized river boat routes, and local moto-taxis.',
        costOfLiving: 'Low-Moderate (45/100 Index)',
        safety: 'Moderate (55/100 Safety Index)',
        bestTimeToVisit: 'June to November (dry river season; excellent for beach island camping).',
        nearbyDestinations: 'Anavilhanas Archipelago (eco-lodges), Presidente Figueiredo waterfalls.'
      }
    ]
  },
  south_africa: {
    id: 'south_africa',
    name: 'South Africa',
    flag: '🇿🇦',
    continent: 'Africa',
    overview: 'A nation of spectacular geographic diversity and cultural richness, located at the southern tip of the African continent. Celebrated as the "Rainbow Nation" for its diverse ethnic makeup and multi-faceted history.',
    basic: {
      capital: 'Pretoria (Admin) / Cape Town (Legis)',
      population: '60.6 Million',
      area: '1.22 Million km²',
      currency: { code: 'ZAR', symbol: 'R', rate: 18.45 },
      languages: '12 Official (Zulu, Xhosa, Afrikaans, English, etc.)',
      timezones: 'SAST (UTC+2)',
      drivingSide: 'Left',
      callingCode: '+27',
      governmentType: 'Unitary Parliamentary Constitutional Republic',
      symbols: {
        flower: 'King Protea',
        animal: 'Springbok / Blue Crane',
        anthem: 'Nkosi Sikelel\' iAfrika',
        motto: 'ǃke e: ǀxarra ǁke (Diverse People Unite)'
      },
      quickFacts: [
        'The only country in the world with three official capital cities to balance regional interests.',
        'Home to the Cradle of Humankind, hosting the world\'s richest fossil hominid discoveries.',
        'World\'s absolute leading producer of platinum, chromium, and high-purity manganese ore.'
      ]
    },
    intermediate: {
      geography: 'A vast interior plateau bordered by rugged escarpments (Drakensberg Mountains), coastal plains, and semi-arid scrublands (Karoo).',
      climate: 'Generally temperate, but highly varied. Cape Town has a Mediterranean climate; the east coast has a warm subtropical climate.',
      regions: [
        { name: 'Gauteng', capital: 'Johannesburg', highlight: 'Economic heart, gold rush history, and business hubs.' },
        { name: 'Western Cape', capital: 'Cape Town', highlight: 'Scenic coastlines, historic winelands, and Table Mountain.' },
        { name: 'KwaZulu-Natal', capital: 'Durban', highlight: 'Warm Indian Ocean beaches, Zulu culture, and coastal shipping.' },
        { name: 'Mpumalanga', capital: 'Mbombela', highlight: 'Kruger National Park safaris and Blyde River Canyon.' }
      ],
      industries: 'Mining (Platinum, Gold), Financial Services, Agriculture (Viticulture), Manufacturing, Automotive Assembly.',
      transportation: 'Dense minibus taxi networks, Gautrain commuter high-speed rail, regional luxury trains (Blue Train).',
      education: 'National senior certificate public schooling alongside top-tier state research centers like the University of Cape Town.',
      healthcare: 'Public healthcare system supplemented by elite, world-class private hospital networks.',
      tourism: 'World-famous for Big Five wildlife safaris, Cape Peninsula scenic routes, vineyard tours, and historical museums.',
      customs: 'Values dynamic multi-cultural greetings, warm "braai" barbecues, community support values, and linguistic flexibility.',
      cuisine: 'Biltong (cured dried meat), Bobotie (spiced minced meat bake), Braai (barbecue), Bunny Chow.',
      festivals: 'Cape Town Minstrel Carnival (Kaapse Klopse), National Arts Festival (Makhanda), Klein Karoo Nasionale Kunstefees.',
      travelTips: [
        'Rent a car or use Uber for urban transport; avoid public minibus taxis unless accompanied by experienced local guides.',
        'Always check the weather when ascending Table Mountain: strong wind can instantly shut down cable car lines.',
        'Do not carry large sums of cash visibly, and lock valuables in hotel safes before leaving for day excursions.'
      ],
      distances: [
        { from: 'Pretoria', to: 'Cape Town', distance: '1,300 km', time: '2h 10m Flight / 26h Scenic Blue Train' },
        { from: 'Pretoria', to: 'Durban', distance: '540 km', time: '1h Flight / 5.5h via N3 Freeway' },
        { from: 'Cape Town', to: 'Durban', distance: '1,270 km', time: '2h Flight' }
      ],
      cuisineList: [
        { name: 'Cured Biltong', desc: 'Traditional air-dried cured beef strips seasoned with vinegar, coriander seed, and black pepper.', emoji: '🥩' },
        { name: 'Spiced Bobotie', desc: 'Spiced minced beef baked with a golden egg custard top, served with yellow raisin rice.', emoji: '🥮' },
        { name: 'Bunny Chow', desc: 'A hollowed-out loaf of white bread filled to the brim with rich, fiery Durban mutton curry.', emoji: '🍞' }
      ],
      festivalList: [
        { name: 'Kaapse Klopse', date: 'January', desc: 'A lively minstrel carnival in Cape Town filled with parasols, dynamic face paint, and brass bands.', emoji: '🎺' },
        { name: 'National Arts Festival', date: 'June/July', desc: 'The largest multi-arts event in Africa, hosting boundary-pushing theatre, jazz, and visual art.', emoji: '🎨' }
      ]
    },
    advanced: {
      history: 'Inhabited by the San and Khoekhoe peoples for millennia prior to Bantu expansions. Colonial conflicts arose after the Dutch East India Company set up Cape Town (1652). Decades of British-Boer wars led to the Union of South Africa (1910) and Apartheid segregation. Democratic elections in 1994, led by Nelson Mandela, transitioned the state into a modern constitutional democracy.',
      culture: 'Known as the "Rainbow Nation," showcasing a complex fusion of Zulu, Xhosa, Sotho, British, Dutch, and Indian cultures.',
      diversity: 'Highly diverse: Black African (81%), Coloured (8.8%), White (7.7%), and Indian/Asian (2.6%).',
      religion: 'Christianity (80%), traditional African religions, Islam (1.6%), and Hinduism.',
      architecture: 'Blends Cape Dutch whitewashed gables, colonial sandstone arches, and high-end glassmorphic high-rises.',
      politics: 'Constitutional democracy with a President who serves as both head of state and head of government, elected by the National Assembly.',
      economics: {
        gdp: '$380 Billion USD',
        gdpPerCapita: '$6,200 USD',
        inflation: '5.3%',
        unemployment: '32.1%',
        exportShare: 'Products: Gold, Platinum, Coal, Diamonds, Citrus Fruits, Wine'
      },
      infrastructure: 'Gautrain rapid rail system, massive container ship terminals, and extensive regional road grids.',
      relations: 'Leading economy in the African Union, member of the G20 and BRICS, representing African interests globally.',
      unescoSites: [
        'Robben Island (Nelson Mandela\'s political imprisonment site)',
        'Cradle of Humankind Fossil Sites',
        'Maloti-Drakensberg Mountain Park'
      ],
      hiddenDestinations: 'Blyde River Canyon (largest green canyon on Earth), Wild Coast pristine beaches, Golden Gate Highlands.',
      lifestyle: 'Centres heavily around rugby, cricket, and soccer, outdoor weekend "braais", coastal surfing, and national park camping.',
      futureProjects: 'Presidential Hydrogen Corridor Corridor and massive solar/wind independent power producer infrastructure arrays.',
      timeline: [
        { year: '1652', epoch: 'Colonial Provisioning', title: 'Dutch East India Fort', desc: 'Jan van Riebeeck establishes a supply station at Table Bay, initiating Cape colonial settlements.' },
        { year: '1910', epoch: 'Union Unification', title: 'Union of South Africa', desc: 'Four colonies unify under a single administration, paving the way for progressive segregationist codes.' },
        { year: '1994', epoch: 'Democratic Rainbow', title: 'End of Apartheid', desc: 'The first fully democratic multi-racial elections elect Nelson Mandela as President under the ANC.' }
      ]
    },
    cities: [
      {
        name: 'Cape Town',
        overview: 'A stunning coastal city situated beneath Table Mountain, famous for its historic vineyards, dramatic cliffs, and dynamic waterfronts.',
        population: '4.6 Million (Metropolitan)',
        culture: 'A diverse artistic landscape hosting international design festivals, contemporary African art galleries, and historic Cape Malay communities.',
        history: 'Established in 1652 by Jan van Riebeeck as a supply station for the Dutch East India Company, serving as South Africa\'s first colonial city.',
        attractions: 'Table Mountain, Cape of Good Hope, V&A Waterfront, Robben Island, Kirstenbosch Botanical Gardens, Boulders Penguin Colony.',
        foodSpecialties: 'Cape Malay Curry, fresh ocean snoek fish, Bobotie, local Chenin Blanc and Pinotage wines.',
        transportation: 'MyCiTi express buses, Metrorail suburban trains, and municipal water taxis at the harbor.',
        costOfLiving: 'Moderate (45/100 Index)',
        safety: 'Moderate (Stay in tourist zones at night; 55/100 Safety Index)',
        bestTimeToVisit: 'November to March (warm, dry summer weather; perfect for wine tastings and beaches).',
        nearbyDestinations: 'Stellenbosch Winelands, Hermanus (world-class shore-based whale watching).'
      },
      {
        name: 'Johannesburg',
        overview: 'South Africa\'s largest city and economic engine, built on the historic wealth of the late nineteenth-century Witwatersrand gold rush.',
        population: '4.4 Million (Metropolitan: 10.5 Million)',
        culture: 'A fast-paced cultural melting pot hosting Afro-jazz clubs, street art hubs (Maboneng), and historic apartheid museums.',
        history: 'Founded in 1886 following the discovery of gold. Developed from a chaotic mining camp into a massive global commercial center.',
        attractions: 'Apartheid Museum, Constitution Hill, Soweto Township (Vilakazi Street), Gold Reef City, Cradle of Humankind.',
        foodSpecialties: 'Braai meats, Chakalaka relish, Pap (maize porridge), Bunny Chow, local craft beers.',
        transportation: 'Gautrain rapid rail, Rea Vaya rapid buses, and municipal taxi grids.',
        costOfLiving: 'Low-Moderate (40/100 Index)',
        safety: 'Moderate (Exercise strict caution; use secure transport at night; 35/100 Safety Index)',
        bestTimeToVisit: 'September to November (pleasant spring climate with purple Jacaranda blooms).',
        nearbyDestinations: 'Pretoria (capital city administrative buildings), Lion & Safari Park.'
      },
      {
        name: 'Durban',
        overview: 'A busy sub-tropical port city on the Indian Ocean, famous for its warm water, surfing beaches, and large Indian-heritage community.',
        population: '3.9 Million (Metropolitan)',
        culture: 'Displays a unique blend of traditional Zulu culture, British colonial legacies, and Indian culinary and religious customs.',
        history: 'Established as Port Natal in 1824. Grew rapidly due to sugar plantations and the development of the busiest container port in Africa.',
        attractions: 'Golden Mile beachfront, uShaka Marine World, Moses Mabhida Stadium, Durban Botanic Gardens, Victoria Street Market.',
        foodSpecialties: 'Bunny chow (curry in hollowed bread), Durban-style spicy lamb curry, fresh samosas.',
        transportation: 'Municipal People Mover buses, local taxi networks, and regional train lines.',
        costOfLiving: 'Low (35/100 Index)',
        safety: 'Moderate (50/100 Safety Index)',
        bestTimeToVisit: 'June to August (mild, sunny sub-tropical winter weather; excellent for surfing).',
        nearbyDestinations: 'uKhahlamba-Drakensberg Park, Valley of a Thousand Hills.'
      }
    ]
  },
  australia: {
    id: 'australia',
    name: 'Australia',
    flag: '🇦🇺',
    continent: 'Oceania',
    overview: 'A vast country and continent surrounded by the Indian and Pacific oceans. Renowned for its unique endemic marsupial wildlife, the ancient heritage of its Indigenous peoples, and its cosmopolitan coastal metropolises.',
    basic: {
      capital: 'Canberra',
      population: '26.5 Million',
      area: '7.69 Million km²',
      currency: { code: 'AUD', symbol: '$', rate: 1.50 },
      languages: 'English',
      timezones: 'AEST (UTC+10) / ACST (UTC+9.5) / AWST (UTC+8)',
      drivingSide: 'Left',
      callingCode: '+61',
      governmentType: 'Federal Parliamentary Constitutional Monarchy',
      symbols: {
        flower: 'Golden Wattle',
        animal: 'Red Kangaroo / Emu',
        anthem: 'Advance Australia Fair',
        motto: 'Advance Australia'
      },
      quickFacts: [
        'The flattest and driest inhabited continent, with over 80% of citizens living along coastal zones.',
        'Home to the Great Barrier Reef, the largest living biological structure visible from space.',
        'Hosts the oldest continuous living cultural tradition on Earth (Indigenous Australian cultures).'
      ]
    },
    intermediate: {
      geography: 'Dominated by the vast, semi-arid interior deserts ("Outback"), surrounded by fertile coastal agricultural plains and the Great Dividing Range.',
      climate: 'Varies from tropical in the north (jungle and savannah) to dry semi-arid in the interior, and temperate in the south and east.',
      regions: [
        { name: 'New South Wales', capital: 'Sydney', highlight: 'Cosmopolitan bays, surf beaches, and Blue Mountains.' },
        { name: 'Victoria', capital: 'Melbourne', highlight: 'Coffee culture, arts, sports, and Yarra Valley vineyards.' },
        { name: 'Queensland', capital: 'Brisbane', highlight: 'Subtropical coast, Daintree Rainforest, and Great Barrier Reef.' },
        { name: 'Western Australia', capital: 'Perth', highlight: 'Outback deserts, white sand beaches, and mining wealth.' }
      ],
      industries: 'Mining (Iron Ore, Lithium, Coal), Agribusiness (Wheat, Wool), Tourism, International Education, Financial Services.',
      transportation: 'Extensive domestic air loops, interstate rail (The Ghan), and modern tollway networks in major cities.',
      education: 'Highly ranked public school grids. Elite research universities include the "Group of Eight" (e.g. University of Melbourne).',
      healthcare: 'Medicare system provides universal free public hospital treatment, funded by a national tax levy.',
      tourism: 'Famous for snorkeling the reef, exploring the Outback, wine tasting, and iconic urban architecture.',
      customs: 'Values "mateship," egalitarian social views, casual dress, outdoor active lifestyles, and strict environmental conservation.',
      cuisine: 'Vegemite, meat pies, Lamingtons, Pavlova dessert, barramundi fish, and premium grilled barbecue sausages.',
      festivals: 'Vivid Sydney light festival, Melbourne International Arts Festival, WOMADelaide world music carnival.',
      travelTips: [
        'Always swim strictly between the red and yellow flags on public beaches to avoid dangerous rip currents.',
        'Apply strong broad-spectrum sunscreen: the UV index in Australia is exceptionally high year-round.',
        'Strict biosecurity laws: declare all food, plant material, and wooden items upon airport arrival.'
      ],
      distances: [
        { from: 'Canberra', to: 'Sydney', distance: '248 km', time: '3h via Federal Hwy / 50m Flight' },
        { from: 'Canberra', to: 'Melbourne', distance: '465 km', time: '5h via Hume Hwy / 1h Flight' },
        { from: 'Sydney', to: 'Melbourne', distance: '713 km', time: '1.5h Flight / 9h Drive' },
        { from: 'Sydney', to: 'Brisbane', distance: '730 km', time: '1.5h Flight' }
      ],
      cuisineList: [
        { name: 'Vegemite Toast', desc: 'Thick-cut sourdough toast topped with butter and a thin spread of salty, savory dark yeast extract.', emoji: '🍞' },
        { name: 'Aussie Meat Pie', desc: 'A hand-sized flaky shortcrust pastry shell filled with minced beef, rich gravy, and tomato sauce.', emoji: '🥧' },
        { name: 'Pavlova Meringue', desc: 'A crisp, marshmallow-light baked meringue crust topped with whipped cream, kiwi, and passionfruit.', emoji: '🍰' }
      ],
      festivalList: [
        { name: 'Vivid Sydney', date: 'May/June', desc: 'A spectacular winter outdoor gallery of 3D light mappings, light sculptures, and concert series.', emoji: '💡' },
        { name: 'WOMADelaide', date: 'March', desc: 'A magnificent four-day open-air world music and dance event set inside Adelaide Botanic Park.', emoji: '🎵' }
      ]
    },
    advanced: {
      history: 'Inhabited by Indigenous Australians for over 65,000 years. British colonization began in 1788 with the arrival of the First Fleet as a penal colony. Six self-governing colonies united on January 1, 1901, to form the Commonwealth of Australia.',
      culture: 'Reflects a fusion of British colonial heritage, indigenous Dreamtime traditions, and postwar European and Asian immigration.',
      diversity: 'Over 30% of Australia\'s current population was born overseas, primarily in Europe and Asia.',
      religion: 'Christianity (44%), Non-religious (39%), Islam (3.2%), and Buddhism (2.4%).',
      architecture: 'Iconic curved sails (Sydney Opera House), colonial Victorian terrace homes, and premium glassmorphic skyscraper towers.',
      politics: 'A constitutional monarchy where the British monarch serves as head of state, represented by a Governor-General. Executive power resides with the Prime Minister.',
      economics: {
        gdp: '$1.7 Trillion USD',
        gdpPerCapita: '$64,000 USD',
        inflation: '3.6%',
        unemployment: '3.8%',
        exportShare: 'Products: Iron Ore, Coal, Natural Gas, Gold, Wheat, Beef'
      },
      infrastructure: 'Superb coastal highway networks, highly automated deep-water mineral export docks, and advanced water recycling grids.',
      relations: 'Key US military ally, active member of the Commonwealth, ANZUS, Five Eyes, AUKUS, and the G20.',
      unescoSites: [
        'Great Barrier Reef Marine Park',
        'Sydney Opera House Sails',
        'Uluru-Kata Tjuta National Park'
      ],
      hiddenDestinations: 'Margaret River (caves and premium wineries), Kangaroo Island (marsupial sanctuary), Daintree Rainforest.',
      lifestyle: 'Strong focus on coastal beach cultures, surfing, backyard barbecues, national park bushwalking, and competitive sport.',
      futureProjects: 'Snowy 2.0 pumped hydro-storage project and the development of the Western Sydney International Airport.',
      timeline: [
        { year: '65k BP', epoch: 'Dreamtime Custodianship', title: 'Aboriginal First Nations', desc: 'Continuous spiritual custodianship by Aboriginal clans, mapping tracks, songlines, and land bounds.' },
        { year: '1788', epoch: 'British Colony Entry', title: 'First Fleet Sydney Cove', desc: 'Governor Arthur Phillip lands at Port Jackson, establishing the penal colony and displacing clans.' },
        { year: '1901', epoch: 'Commonwealth Unification', title: 'Federation of Australia', desc: 'Six self-governing colonies unite under the Commonwealth Constitution, creating the modern democratic state.' }
      ]
    },
    cities: [
      {
        name: 'Sydney',
        overview: 'Australia\'s largest city, built around one of the world\'s most spectacular natural harbors, famous for its iconic sails and surf beaches.',
        population: '5.3 Million (Metropolitan)',
        culture: 'A diverse coastal lifestyle hosting world-class design expos, contemporary arts festivals (Vivid), and active beach running clubs.',
        history: 'Established in 1788 by Governor Arthur Phillip as the first European settlement in Australia, centered around Sydney Cove.',
        attractions: 'Sydney Opera House, Sydney Harbour Bridge, Bondi Beach, Darling Harbour, Royal Botanic Garden, Taronga Zoo.',
        foodSpecialties: 'Barramundi fish, Sydney rock oysters, Australian meat pies, pavlova, flat white coffee.',
        transportation: 'Sydney Trains network, iconic public harbor ferries, and modern urban light rails.',
        costOfLiving: 'Very High (90/100 Index)',
        safety: 'Extremely Safe (86/100 Safety Index)',
        bestTimeToVisit: 'September to November (spring) or March to May (mild autumn).',
        nearbyDestinations: 'Blue Mountains National Park, Hunter Valley wineries.'
      },
      {
        name: 'Melbourne',
        overview: 'Australia\'s cultural and sporting capital, celebrated for its historic laneways, world-class coffee, and Victorian architecture.',
        population: '5.1 Million (Metropolitan)',
        culture: 'A thriving arts, live music, and street art scene, alongside a highly specialized specialty coffee and cafe subculture.',
        history: 'Founded in 1835 by free settlers. Boomed into one of the world\'s wealthiest cities during the Victorian gold rush of the 1850s.',
        attractions: 'Federation Square, Royal Exhibition Building, National Gallery of Victoria, Flinders Street Station, Great Ocean Road.',
        foodSpecialties: 'Artisanal flat white coffee, multicultural dining (Lygon Street Italian, Chinatown), smashed avocado toast.',
        transportation: 'Yarra Trams (world\'s largest urban tram network), Free Tram Zone, commuter rail lines.',
        costOfLiving: 'High (80/100 Index)',
        safety: 'Extremely Safe (84/100 Safety Index)',
        bestTimeToVisit: 'March to May (pleasant autumn weather and cultural festivals) or September to November.',
        nearbyDestinations: 'Yarra Valley winelands, Phillip Island (fairy penguin parade).'
      },
      {
        name: 'Brisbane',
        overview: 'A rapidly growing subtropical river city in Queensland, characterized by its relaxed outdoor lifestyle, modern art, and warm climate.',
        population: '2.6 Million (Metropolitan)',
        culture: 'Thrives on outdoor dining, riverfront cycling, craft breweries, and modern outdoor art installations.',
        history: 'Originated as a penal settlement in 1824. Became the capital of the newly separated colony of Queensland in 1859.',
        attractions: 'South Bank Parklands, Lone Pine Koala Sanctuary, Story Bridge Climb, Gallery of Modern Art (GOMA), Brisbane Riverwalk.',
        foodSpecialties: 'Moreton Bay Bugs (slipper lobsters), Queensland macadamia nuts, craft beer, local mangoes.',
        transportation: 'Translink busways, public CityCat high-speed river ferries, and suburban rail.',
        costOfLiving: 'Moderate-High (70/100 Index)',
        safety: 'Extremely Safe (82/100 Safety Index)',
        bestTimeToVisit: 'May to October (dry, sunny winter and spring climate; very comfortable).',
        nearbyDestinations: 'Gold Coast surf beaches, Sunshine Coast rainforests.'
      }
    ]
  },

  // ── 200+ COMPRESSED COUNTRIES DATA ─────────────────────────────────
  // EUROPE (44 Countries total + key additions)
  germany: {
    id: 'germany', name: 'Germany', flag: '🇩🇪', continent: 'Europe',
    basic: { capital: 'Berlin', population: '83.8 Million', area: '357,022 km²', currency: { code: 'EUR', symbol: '€', rate: 0.92 }, languages: 'German', timezones: 'CET (UTC+1) / CEST (UTC+2)', drivingSide: 'Right', callingCode: '+49', governmentType: 'Federal Parliamentary Republic', symbols: { flower: 'Cornflower', animal: 'Federal Eagle', anthem: 'Deutschlandlied', motto: 'Einigkeit und Recht und Freiheit (Unity and Justice and Freedom)' }, quickFacts: ['Largest economy in the European Union.', 'Famous for precision engineering and automotive sectors.', 'Hosts the historic Castle of Neuschwanstein.'] }
  },
  france: {
    id: 'france', name: 'France', flag: '🇫🇷', continent: 'Europe',
    basic: { capital: 'Paris', population: '68.0 Million', area: '551,695 km²', currency: { code: 'EUR', symbol: '€', rate: 0.92 }, languages: 'French', timezones: 'CET (UTC+1) / CEST (UTC+2)', drivingSide: 'Right', callingCode: '+33', governmentType: 'Semi-Presidential Republic', symbols: { flower: 'Iris', animal: 'Gallic Rooster', anthem: 'La Marseillaise', motto: 'Liberté, Égalité, Fraternité' }, quickFacts: ['Most visited country in the world.', 'Renowned global capital of haute cuisine, fashion, and art.', 'Features the Eiffel Tower and Louvre Museum.'] }
  },
  italy: {
    id: 'italy', name: 'Italy', flag: '🇮🇹', continent: 'Europe',
    basic: { capital: 'Rome', population: '58.9 Million', area: '301,340 km²', currency: { code: 'EUR', symbol: '€', rate: 0.92 }, languages: 'Italian', timezones: 'CET (UTC+1) / CEST (UTC+2)', drivingSide: 'Right', callingCode: '+39', governmentType: 'Parliamentary Republic', symbols: { flower: 'Lily / Cyclamen', animal: 'Italian Wolf', anthem: 'Il Canto degli Italiani', motto: 'La Repubblica tutela la salute' }, quickFacts: ['Hosts the absolute highest number of UNESCO World Heritage Sites globally.', 'Birthplace of the Roman Empire and the Renaissance.', 'Famous for pizza, pasta, fashion, and high-performance sports cars.'] }
  },
  united_kingdom: {
    id: 'united_kingdom', name: 'United Kingdom', flag: '🇬🇧', continent: 'Europe',
    basic: { capital: 'London', population: '67.0 Million', area: '243,610 km²', currency: { code: 'GBP', symbol: '£', rate: 0.79 }, languages: 'English', timezones: 'GMT (UTC+0) / BST (UTC+1)', drivingSide: 'Left', callingCode: '+44', governmentType: 'Parliamentary Constitutional Monarchy', symbols: { flower: 'Tudor Rose', animal: 'Lion / Bulldog', anthem: 'God Save the King', motto: 'Dieu et mon droit (God and my right)' }, quickFacts: ['Composed of four countries: England, Scotland, Wales, and Northern Ireland.', 'Birthplace of the Industrial Revolution and the English language.', 'Home to Stonehenge and Big Ben tower.'] }
  },
  spain: {
    id: 'spain', name: 'Spain', flag: '🇪🇸', continent: 'Europe',
    basic: { capital: 'Madrid', population: '47.5 Million', area: '505,990 km²', currency: { code: 'EUR', symbol: '€', rate: 0.92 }, languages: 'Spanish', timezones: 'CET (UTC+1) / CEST (UTC+2)', drivingSide: 'Right', callingCode: '+34', governmentType: 'Parliamentary Constitutional Monarchy', symbols: { flower: 'Red Carnation', animal: 'Osborne Bull', anthem: 'Marcha Real', motto: 'Plus Ultra (Further Beyond)' }, quickFacts: ['Famous for architectural marvels like La Sagrada Família.', 'Home to dynamic flamenco dancing and tapas bars.', 'A primary pioneer of early global maritime exploration routes.'] }
  },
  netherlands: {
    id: 'netherlands', name: 'Netherlands', flag: '🇳🇱', continent: 'Europe',
    basic: { capital: 'Amsterdam', population: '17.8 Million', area: '41,543 km²', currency: { code: 'EUR', symbol: '€', rate: 0.92 }, languages: 'Dutch', timezones: 'CET (UTC+1) / CEST (UTC+2)', drivingSide: 'Right', callingCode: '+31', governmentType: 'Parliamentary Constitutional Monarchy', symbols: { flower: 'Tulip', animal: 'Lion', anthem: 'Wilhelmus', motto: 'Je maintiendrai (I will maintain)' }, quickFacts: ['Over 26% of the country lies strictly below sea level.', 'World leader in eco-friendly bicycling transit grids.', 'Renowned for wind mills, tulips, and Rembrandt paintings.'] }
  },
  belgium: {
    id: 'belgium', name: 'Belgium', flag: '🇧🇪', continent: 'Europe',
    basic: { capital: 'Brussels', population: '11.7 Million', area: '30,689 km²', currency: { code: 'EUR', symbol: '€', rate: 0.92 }, languages: 'Dutch, French, German', timezones: 'CET (UTC+1) / CEST (UTC+2)', drivingSide: 'Right', callingCode: '+32', governmentType: 'Federal Parliamentary Constitutional Monarchy', symbols: { flower: 'Red Poppy', animal: 'Belgian Lion', anthem: 'The Brabançonne', motto: 'L\'union fait la force (Unity makes strength)' }, quickFacts: ['Hosts the headquarters of NATO and the European Union.', 'World famous for double-fried fries, gourmet waffles, and chocolate.', 'Home to medieval historic cities like Bruges.'] }
  },
  sweden: {
    id: 'sweden', name: 'Sweden', flag: '🇸🇪', continent: 'Europe',
    basic: { capital: 'Stockholm', population: '10.5 Million', area: '450,295 km²', currency: { code: 'SEK', symbol: 'kr', rate: 10.60 }, languages: 'Swedish', timezones: 'CET (UTC+1) / CEST (UTC+2)', drivingSide: 'Right', callingCode: '+46', governmentType: 'Parliamentary Constitutional Monarchy', symbols: { flower: 'Twinflower', animal: 'Eurasian Elk', anthem: 'Du gamla, Du fria', motto: 'För Sverige i tiden (For Sweden, with the times)' }, quickFacts: ['A leading pioneer in advanced circular waste recycling technology.', 'Birthplace of the Nobel Prize award ceremony.', 'Renowned for minimalist design and scenic archipelagos.'] }
  },
  norway: {
    id: 'norway', name: 'Norway', flag: '🇳🇴', continent: 'Europe',
    basic: { capital: 'Oslo', population: '5.5 Million', area: '385,207 km²', currency: { code: 'NOK', symbol: 'kr', rate: 10.75 }, languages: 'Norwegian', timezones: 'CET (UTC+1) / CEST (UTC+2)', drivingSide: 'Right', callingCode: '+47', governmentType: 'Parliamentary Constitutional Monarchy', symbols: { flower: 'Purple Heather', animal: 'Lion', anthem: 'Ja, vi elsker dette landet', motto: 'Alt for Norge (All for Norway)' }, quickFacts: ['Features spectacular deep glacial fjords and midnight sun.', 'Consistently ranked #1 in the UN Human Development Index.', 'Pioneered early polar expeditions under Amundsen.'] }
  },
  austria: {
    id: 'austria', name: 'Austria', flag: '🇦🇹', continent: 'Europe',
    basic: { capital: 'Vienna', population: '9.1 Million', area: '83,879 km²', currency: { code: 'EUR', symbol: '€', rate: 0.92 }, languages: 'German', timezones: 'CET (UTC+1) / CEST (UTC+2)', drivingSide: 'Right', callingCode: '+43', governmentType: 'Federal Parliamentary Republic', symbols: { flower: 'Edelweiss', animal: 'Golden Eagle', anthem: 'Land der Berge, Land am Strome', motto: 'Unity and Justice' }, quickFacts: ['The historical heart of the massive Austro-Hungarian Empire.', 'Vienna is the global capital of classical opera and waltz.', 'Hosts pristine alpine ski trails in the Tyrol region.'] }
  },
  denmark: {
    id: 'denmark', name: 'Denmark', flag: '🇩🇰', continent: 'Europe',
    basic: { capital: 'Copenhagen', population: '5.9 Million', area: '42,933 km²', currency: { code: 'DKK', symbol: 'kr', rate: 6.90 }, languages: 'Danish', timezones: 'CET (UTC+1) / CEST (UTC+2)', drivingSide: 'Right', callingCode: '+45', governmentType: 'Parliamentary Constitutional Monarchy', symbols: { flower: 'Marguerite Daisy', animal: 'Mute Swan', anthem: 'Der er et yndigt land', motto: 'Guds hjælp, Folkets kærlighed, Danmarks styrke' }, quickFacts: ['Home to the iconic little mermaid statue and Nyhavn harbor.', 'Consistently ranked among the happiest nations globally.', 'Pioneered early wind-energy infrastructure.'] }
  },
  finland: {
    id: 'finland', name: 'Finland', flag: '🇫🇮', continent: 'Europe',
    basic: { capital: 'Helsinki', population: '5.6 Million', area: '338,440 km²', currency: { code: 'EUR', symbol: '€', rate: 0.92 }, languages: 'Finnish, Swedish', timezones: 'EET (UTC+2) / EEST (UTC+3)', drivingSide: 'Right', callingCode: '+358', governmentType: 'Parliamentary Republic', symbols: { flower: 'Lily of the Valley', animal: 'Brown Bear', anthem: 'Maamme', motto: 'Sisu (Grit & Resilience)' }, quickFacts: ['Ranked the happiest country in the world for 7 consecutive years.', 'Contains over 188,000 scenic lakes.', 'Sauna culture is an integral part of daily life.'] }
  },
  portugal: {
    id: 'portugal', name: 'Portugal', flag: '🇵🇹', continent: 'Europe',
    basic: { capital: 'Lisbon', population: '10.4 Million', area: '92,212 km²', currency: { code: 'EUR', symbol: '€', rate: 0.92 }, languages: 'Portuguese', timezones: 'WET (UTC+0) / WEST (UTC+1)', drivingSide: 'Right', callingCode: '+351', governmentType: 'Semi-Presidential Republic', symbols: { flower: 'Lavender', animal: 'Barcelos Rooster', anthem: 'A Portuguesa', motto: 'Esta é a Ditosa Pátria Minha Amada' }, quickFacts: ['Home to Europe\'s oldest borders, set in 1139.', 'Famous for Port wine and beautiful hand-painted azulejo tiles.', 'Breathtaking Atlantic coastlines ideal for surfing.'] }
  },
  greece: {
    id: 'greece', name: 'Greece', flag: '🇬🇷', continent: 'Europe',
    basic: { capital: 'Athens', population: '10.3 Million', area: '131,957 km²', currency: { code: 'EUR', symbol: '€', rate: 0.92 }, languages: 'Greek', timezones: 'EET (UTC+2) / EEST (UTC+3)', drivingSide: 'Right', callingCode: '+30', governmentType: 'Parliamentary Republic', symbols: { flower: 'Acanthus / Violet', animal: 'Dolphin', anthem: 'Hymn to Liberty', motto: 'Eleftheria i thanatos (Freedom or Death)' }, quickFacts: ['The historic birthplace of democracy and Western philosophy.', 'Hosts over 6,000 spectacular islands across the Aegean sea.', 'Famous for olive oil, feta cheese, and white-washed houses.'] }
  },
  ireland: {
    id: 'ireland', name: 'Ireland', flag: '🇮🇪', continent: 'Europe',
    basic: { capital: 'Dublin', population: '5.2 Million', area: '70,273 km²', currency: { code: 'EUR', symbol: '€', rate: 0.92 }, languages: 'Irish, English', timezones: 'GMT (UTC+0) / IST (UTC+1)', drivingSide: 'Left', callingCode: '+353', governmentType: 'Parliamentary Republic', symbols: { flower: 'Shamrock', animal: 'Irish Wolfhound', anthem: 'Amhrán na bhFiann', motto: 'Unity and Freedom' }, quickFacts: ['Known as the "Emerald Isle" for its lush green landscapes.', 'Famous for Celtic folklore, traditional music, and Guinness.', 'Birthplace of Halloween custom historical roots.'] }
  },
  poland: {
    id: 'poland', name: 'Poland', flag: '🇵🇱', continent: 'Europe',
    basic: { capital: 'Warsaw', population: '37.7 Million', area: '312,696 km²', currency: { code: 'PLN', symbol: 'zł', rate: 3.95 }, languages: 'Polish', timezones: 'CET (UTC+1) / CEST (UTC+2)', drivingSide: 'Right', callingCode: '+48', governmentType: 'Parliamentary Republic', symbols: { flower: 'Red Poppy', animal: 'White-tailed Eagle', anthem: 'Mazurek Dąbrowskiego', motto: 'Bóg, Honor, Ojczyzna' }, quickFacts: ['Contains the largest brick castle in the world (Malbork Castle).', 'Birthplace of Marie Curie and Nicolaus Copernicus.', 'Boasts pristine primeval forests hosting European bisons.'] }
  },
  czechia: { id: 'czechia', name: 'Czechia', flag: '🇨🇿', continent: 'Europe', basic: { capital: 'Prague', population: '10.8 Million', area: '78,866 km²', currency: { code: 'CZK', symbol: 'Kč', rate: 22.8 }, languages: 'Czech', timezones: 'CET (UTC+1)', drivingSide: 'Right', callingCode: '+420', governmentType: 'Parliamentary Republic', symbols: { flower: 'Linden', animal: 'Double-tailed Lion', anthem: 'Kde domov můj', motto: 'Pravda vítězí (Truth prevails)' }, quickFacts: ['Has the highest castle density in all of Europe.', 'Renowned for historic Prague and world-class bohemian glass.'] } },
  hungary: { id: 'hungary', name: 'Hungary', flag: '🇭🇺', continent: 'Europe', basic: { capital: 'Budapest', population: '9.6 Million', area: '93,028 km²', currency: { code: 'HUF', symbol: 'Ft', rate: 360.5 }, languages: 'Hungarian', timezones: 'CET (UTC+1)', drivingSide: 'Right', callingCode: '+36', governmentType: 'Parliamentary Republic', symbols: { flower: 'Tulip', animal: 'Turul', anthem: 'Himnusz', motto: 'With the Help of God for the Homeland' }, quickFacts: ['Budapest hosts the largest thermal water cave network.', 'Famous for spicy Paprika and Tokaji sweet dessert wines.'] } },
  romania: { id: 'romania', name: 'Romania', flag: '🇷🇴', continent: 'Europe', basic: { capital: 'Bucharest', population: '19.0 Million', area: '238,397 km²', currency: { code: 'RON', symbol: 'lei', rate: 4.6 }, languages: 'Romanian', timezones: 'EET (UTC+2)', drivingSide: 'Right', callingCode: '+40', governmentType: 'Semi-Presidential Republic', symbols: { flower: 'Dog Rose', animal: 'Lynx', anthem: 'Deșteaptă-te, române!', motto: 'Nihil Sine Deo (Nothing without God)' }, quickFacts: ['Home to the iconic Bran Castle associated with Dracula.', 'Contains the magnificent untouched delta of the Danube river.'] } },
  ukraine: { id: 'ukraine', name: 'Ukraine', flag: '🇺🇦', continent: 'Europe', basic: { capital: 'Kyiv', population: '38.0 Million', area: '603,628 km²', currency: { code: 'UAH', symbol: '₴', rate: 40.2 }, languages: 'Ukrainian', timezones: 'EET (UTC+2)', drivingSide: 'Right', callingCode: '+380', governmentType: 'Semi-Presidential Republic', symbols: { flower: 'Sunflower', animal: 'Common Nightingale', anthem: 'Shche ne vmerla Ukrainy', motto: 'Volya (Freedom)' }, quickFacts: ['One of the largest grain and sunflower oil exporters globally.', 'Rich historic heritage of gold-domed churches in Kyiv.'] } },
  russia: { id: 'russia', name: 'Russia', flag: '🇷🇺', continent: 'Europe', basic: { capital: 'Moscow', population: '144.2 Million', area: '17.1M km²', currency: { code: 'RUB', symbol: '₽', rate: 90.5 }, languages: 'Russian', timezones: 'MSK (UTC+3) / 10 others', drivingSide: 'Right', callingCode: '+7', governmentType: 'Semi-Presidential Republic', symbols: { flower: 'Camomile', animal: 'Russian Brown Bear', anthem: 'State Hymn', motto: 'Unity and Power' }, quickFacts: ['The largest country in the world by total land area.', 'Spans across eleven distinct geographical timezone sectors.'] } },
  belarus: { id: 'belarus', name: 'Belarus', flag: '🇧🇾', continent: 'Europe', basic: { capital: 'Minsk', population: '9.2 Million', area: '207,600 km²', currency: { code: 'BYN', symbol: 'Rbl', rate: 3.25 }, languages: 'Belarusian, Russian', timezones: 'MSK (UTC+3)', drivingSide: 'Right', callingCode: '+375', governmentType: 'Presidential Republic', symbols: { flower: 'Flax / Cornflower', animal: 'European Bison', anthem: 'My Belarusy', motto: 'Peace and Labor' }, quickFacts: ['Over 40% of the land area is covered by dense primeval forests.', 'Hosts the UNESCO listed Bialowieza national park reserve.'] } },
  bulgaria: { id: 'bulgaria', name: 'Bulgaria', flag: '🇧🇬', continent: 'Europe', basic: { capital: 'Sofia', population: '6.4 Million', area: '110,994 km²', currency: { code: 'BGN', symbol: 'лв', rate: 1.8 }, languages: 'Bulgarian', timezones: 'EET (UTC+2)', drivingSide: 'Right', callingCode: '+359', governmentType: 'Parliamentary Republic', symbols: { flower: 'Red Rose', animal: 'Lion', anthem: 'Mila Rodino', motto: 'Saedinenieto pravi silata (Unity makes strength)' }, quickFacts: ['One of the world\'s leading exporters of organic rose oil perfume.', 'Ancient city of Plovdiv is the oldest continuously inhabited in Europe.'] } },
  croatia: { id: 'croatia', name: 'Croatia', flag: '🇭🇷', continent: 'Europe', basic: { capital: 'Zagreb', population: '3.8 Million', area: '56,594 km²', currency: { code: 'EUR', symbol: '€', rate: 0.92 }, languages: 'Croatian', timezones: 'CET (UTC+1)', drivingSide: 'Right', callingCode: '+385', governmentType: 'Parliamentary Republic', symbols: { flower: 'Iris croatica', animal: 'Pine Marten', anthem: 'Lijepa naša domovino', motto: 'God and Croats' }, quickFacts: ['Birthplace of the necktie fashion item historical roots.', 'Spectacular walled city of Dubrovnik is a major UNESCO site.'] } },
  slovakia: { id: 'slovakia', name: 'Slovakia', flag: '🇸🇰', continent: 'Europe', basic: { capital: 'Bratislava', population: '5.4 Million', area: '49,035 km²', currency: { code: 'EUR', symbol: '€', rate: 0.92 }, languages: 'Slovak', timezones: 'CET (UTC+1)', drivingSide: 'Right', callingCode: '+421', governmentType: 'Parliamentary Republic', symbols: { flower: 'Linden', animal: 'Golden Eagle', anthem: 'Nad Tatrou sa blýska', motto: 'Faithful to Ourselves' }, quickFacts: ['Produces the absolute highest number of cars per capita in the world.', 'Dominated by the spectacular High Tatras mountain peaks.'] } },
  iceland: { id: 'iceland', name: 'Iceland', flag: '🇮🇸', continent: 'Europe', basic: { capital: 'Reykjavik', population: '0.39 Million', area: '103,000 km²', currency: { code: 'ISK', symbol: 'kr', rate: 138.5 }, languages: 'Icelandic', timezones: 'GMT (UTC+0)', drivingSide: 'Right', callingCode: '+354', governmentType: 'Parliamentary Republic', symbols: { flower: 'Mountain Avens', animal: 'Gyrfalcon', anthem: 'Lofsöngur', motto: 'With laws shall our land be built' }, quickFacts: ['Powered entirely by green geothermal and hydro electric resources.', 'Famous for roaring volcanoes, black sand beaches, and geysers.'] } },
  lithuania: { id: 'lithuania', name: 'Lithuania', flag: '🇱🇹', continent: 'Europe', basic: { capital: 'Vilnius', population: '2.8 Million', area: '65,300 km²', currency: { code: 'EUR', symbol: '€', rate: 0.92 }, languages: 'Lithuanian', timezones: 'EET (UTC+2)', drivingSide: 'Right', callingCode: '+370', governmentType: 'Parliamentary Republic', symbols: { flower: 'Rue', animal: 'White Stork', anthem: 'Tautiška giesmė', motto: 'Vienybė težydi (Let Unity Flourish)' }, quickFacts: ['Lithuanian is one of the oldest living Indo-European languages.', 'Famous for beautiful Baltic amber coastline reserves.'] } },
  latvia: { id: 'latvia', name: 'Latvia', flag: '🇱🇻', continent: 'Europe', basic: { capital: 'Riga', population: '1.8 Million', area: '64,589 km²', currency: { code: 'EUR', symbol: '€', rate: 0.92 }, languages: 'Latvian', timezones: 'EET (UTC+2)', drivingSide: 'Right', callingCode: '+371', governmentType: 'Parliamentary Republic', symbols: { flower: 'Marguerite Daisy', animal: 'White Wagtail', anthem: 'Dievs, svētī Latviju!', motto: 'Tēvzemei un Brīvībai (For Fatherland and Freedom)' }, quickFacts: ['Riga has the highest concentration of Art Nouveau buildings in Europe.', 'Over half of the country is covered by pristine wild forests.'] } },
  estonia: { id: 'estonia', name: 'Estonia', flag: '🇪🇪', continent: 'Europe', basic: { capital: 'Tallinn', population: '1.3 Million', area: '45,339 km²', currency: { code: 'EUR', symbol: '€', rate: 0.92 }, languages: 'Estonian', timezones: 'EET (UTC+2)', drivingSide: 'Right', callingCode: '+372', governmentType: 'Parliamentary Republic', symbols: { flower: 'Cornflower', animal: 'Barn Swallow', anthem: 'Mu isamaa, mu õnn ja rõõm', motto: 'Truth and Justice' }, quickFacts: ['Leading pioneer in national e-governance and electronic voting.', 'Helsinki and Tallinn are linked by high-frequency ferries.'] } },
  slovenia: { id: 'slovenia', name: 'Slovenia', flag: '🇸🇮', continent: 'Europe', basic: { capital: 'Ljubljana', population: '2.1 Million', area: '20,273 km²', currency: { code: 'EUR', symbol: '€', rate: 0.92 }, languages: 'Slovenian', timezones: 'CET (UTC+1)', drivingSide: 'Right', callingCode: '+386', governmentType: 'Parliamentary Republic', symbols: { flower: 'Carnation', animal: 'Lipizzan Horse', anthem: 'Zdravljica', motto: 'One for all, all for one' }, quickFacts: ['First country declared a green global destination under standard criteria.', 'Scenic Lake Bled features a medieval castle set on an island.'] } },
  luxembourg: { id: 'luxembourg', name: 'Luxembourg', flag: '🇱🇺', continent: 'Europe', basic: { capital: 'Luxembourg City', population: '0.66 Million', area: '2,586 km²', currency: { code: 'EUR', symbol: '€', rate: 0.92 }, languages: 'Luxembourgish, French, German', timezones: 'CET (UTC+1)', drivingSide: 'Right', callingCode: '+352', governmentType: 'Constitutional Monarchy', symbols: { flower: 'Rose', animal: 'Red Lion', anthem: 'Ons Heemecht', motto: 'Mir wëlle bleiwe wat mir sinn (We want to remain what we are)' }, quickFacts: ['First country in the world to make all public transit free.', 'Enjoys the highest GDP per capita index in the EU.'] } },
  cyprus: { id: 'cyprus', name: 'Cyprus', flag: '🇨🇾', continent: 'Europe', basic: { capital: 'Nicosia', population: '1.2 Million', area: '9,251 km²', currency: { code: 'EUR', symbol: '€', rate: 0.92 }, languages: 'Greek, Turkish', timezones: 'EET (UTC+2)', drivingSide: 'Left', callingCode: '+357', governmentType: 'Presidential Republic', symbols: { flower: 'Cyprus Cyclamen', animal: 'Mouflon', anthem: 'Hymn to Liberty', motto: 'Duty and Honor' }, quickFacts: ['The legendary birthplace of the Greek goddess Aphrodite.', 'Nicosia remains the last divided capital city in the world.'] } },
  malta: { id: 'malta', name: 'Malta', flag: '🇲🇹', continent: 'Europe', basic: { capital: 'Valletta', population: '0.53 Million', area: '316 km²', currency: { code: 'EUR', symbol: '€', rate: 0.92 }, languages: 'Maltese, English', timezones: 'CET (UTC+1)', drivingSide: 'Left', callingCode: '+356', governmentType: 'Parliamentary Republic', symbols: { flower: 'Maltese Centaury', animal: 'Pharaoh Hound', anthem: 'L-Innu Malti', motto: 'Virtute et Constantia' }, quickFacts: ['Valletta is the absolute smallest capital city in the EU.', 'Home to megalithic temples older than the Egyptian Pyramids.'] } },
  albania: { id: 'albania', name: 'Albania', flag: '🇦🇱', continent: 'Europe', basic: { capital: 'Tirana', population: '2.7 Million', area: '28,748 km²', currency: { code: 'ALL', symbol: 'L', rate: 93.4 }, languages: 'Albanian', timezones: 'CET (UTC+1)', drivingSide: 'Right', callingCode: '+355', governmentType: 'Parliamentary Republic', symbols: { flower: 'Red Poppy', animal: 'Golden Eagle', anthem: 'Hymni i Flamurit', motto: 'Feja e Shqiptarit është Shqiptaria' }, quickFacts: ['Features the spectacular pristine beaches of the Albanian Riviera.', 'Birthplace of Mother Teresa historical roots.'] } },
  north_macedonia: { id: 'north_macedonia', name: 'North Macedonia', flag: '🇲🇰', continent: 'Europe', basic: { capital: 'Skopje', population: '2.0 Million', area: '25,713 km²', currency: { code: 'MKD', symbol: 'ден', rate: 56.5 }, languages: 'Macedonian, Albanian', timezones: 'CET (UTC+1)', drivingSide: 'Right', callingCode: '+389', governmentType: 'Parliamentary Republic', symbols: { flower: 'Macedonian Pine', animal: 'Sarplaninec Dog', anthem: 'Denes nad Makedonija', motto: 'Sloboda ili Smrt (Freedom or Death)' }, quickFacts: ['Lake Ohrid is one of the oldest and deepest lakes in Europe.', 'Skopje has more statues per square kilometer than any other city.'] } },
  montenegro: { id: 'montenegro', name: 'Montenegro', flag: '🇲🇪', continent: 'Europe', basic: { capital: 'Podgorica', population: '0.62 Million', area: '13,812 km²', currency: { code: 'EUR', symbol: '€', rate: 0.92 }, languages: 'Montenegrin', timezones: 'CET (UTC+1)', drivingSide: 'Right', callingCode: '+382', governmentType: 'Parliamentary Republic', symbols: { flower: 'Mimosa', animal: 'Golden Eagle', anthem: 'Oj, svijetla majska zoro', motto: 'May Montenegro be eternal' }, quickFacts: ['Bay of Kotor is considered the southernmost fjord in Europe.', 'Uses the Euro as its de facto currency without being in the EU.'] } },
  serbia: { id: 'serbia', name: 'Serbia', flag: '🇷🇸', continent: 'Europe', basic: { capital: 'Belgrade', population: '6.6 Million', area: '88,361 km²', currency: { code: 'RSD', symbol: 'дин', rate: 107.5 }, languages: 'Serbian', timezones: 'CET (UTC+1)', drivingSide: 'Right', callingCode: '+381', governmentType: 'Parliamentary Republic', symbols: { flower: 'Ramonda nathaliae', animal: 'White-tailed Eagle', anthem: 'Bože pravde', motto: 'Samo sloga Srbina spasava (Only Unity Saves the Serb)' }, quickFacts: ['Belgrade sits on the strategic confluence of the Sava and Danube rivers.', 'Leading exporter of raspberries globally.'] } },
  bosnia_herzegovina: { id: 'bosnia_herzegovina', name: 'Bosnia & Herzegovina', flag: '🇧🇦', continent: 'Europe', basic: { capital: 'Sarajevo', population: '3.2 Million', area: '51,197 km²', currency: { code: 'BAM', symbol: 'KM', rate: 1.8 }, languages: 'Bosnian, Croatian, Serbian', timezones: 'CET (UTC+1)', drivingSide: 'Right', callingCode: '+387', governmentType: 'Federal Parliamentary Republic', symbols: { flower: 'Lilium bosniacum', animal: 'Tornjak', anthem: 'Državna himna Bosne i Hercegovine', motto: 'Justice and Peace' }, quickFacts: ['Sarajevo hosted the historic 1984 Winter Olympic Games.', 'Famous for the stunning, rebuilt Stari Most stone bridge in Mostar.'] } },
  moldova: { id: 'moldova', name: 'Moldova', flag: '🇲🇩', continent: 'Europe', basic: { capital: 'Chisinau', population: '2.5 Million', area: '33,846 km²', currency: { code: 'MDL', symbol: 'L', rate: 17.6 }, languages: 'Romanian', timezones: 'EET (UTC+2)', drivingSide: 'Right', callingCode: '+373', governmentType: 'Parliamentary Republic', symbols: { flower: 'Peony', animal: 'Aurochs', anthem: 'Limba noastră', motto: 'Virtute, Muncă, Credință (Virtue, Labor, Faith)' }, quickFacts: ['Contains Milestii Mici, the largest wine cellar in the world.', 'Renowned for agricultural plains and quiet rural monasteries.'] } },
  andorra: { id: 'andorra', name: 'Andorra', flag: '🇦🇩', continent: 'Europe', basic: { capital: 'Andorra la Vella', population: '0.08 Million', area: '468 km²', currency: { code: 'EUR', symbol: '€', rate: 0.92 }, languages: 'Catalan', timezones: 'CET (UTC+1)', drivingSide: 'Right', callingCode: '+376', governmentType: 'Parliamentary Semi-Elective Coprincipality', symbols: { flower: 'Grandalla', animal: 'Pyrenean Chamois', anthem: 'El Gran Carlemany', motto: 'Virtus Unita Fortior (Virtue United is Stronger)' }, quickFacts: ['The only country in the world with Catalan as its sole official language.', 'Andorra la Vella is the highest capital city in Europe.'] } },
  monaco: { id: 'monaco', name: 'Monaco', flag: '🇲🇨', continent: 'Europe', basic: { capital: 'Monaco', population: '0.04 Million', area: '2.02 km²', currency: { code: 'EUR', symbol: '€', rate: 0.92 }, languages: 'French', timezones: 'CET (UTC+1)', drivingSide: 'Right', callingCode: '+377', governmentType: 'Constitutional Monarchy', symbols: { flower: 'Carnation', animal: 'Monegasque Lion', anthem: 'Hymne Monégasque', motto: 'Deo Juvante (With God\'s Help)' }, quickFacts: ['The second smallest and most densely populated sovereign nation.', 'Famous for Monte Carlo casino and Formula 1 Grand Prix.'] } },
  san_marino: { id: 'san_marino', name: 'San Marino', flag: '🇸🇲', continent: 'Europe', basic: { capital: 'San Marino', population: '0.03 Million', area: '61 km²', currency: { code: 'EUR', symbol: '€', rate: 0.92 }, languages: 'Italian', timezones: 'CET (UTC+1)', drivingSide: 'Right', callingCode: '+378', governmentType: 'Parliamentary Republic', symbols: { flower: 'Cyclamen', animal: 'Three Towers / Falcon', anthem: 'Inno Nazionale della Repubblica', motto: 'Libertas (Liberty)' }, quickFacts: ['Recognized as the world\'s oldest continuous constitutional republic.', 'A landlocked enclave completely surrounded by Italy.'] } },
  liechtenstein: { id: 'liechtenstein', name: 'Liechtenstein', flag: '🇱🇮', continent: 'Europe', basic: { capital: 'Vaduz', population: '0.04 Million', area: '160 km²', currency: { code: 'CHF', symbol: 'CHF', rate: 0.91 }, languages: 'German', timezones: 'CET (UTC+1)', drivingSide: 'Right', callingCode: '+423', governmentType: 'Constitutional Monarchy', symbols: { flower: 'Golden Wattle / Lily', animal: 'Crown / Eagle', anthem: 'Oben am jungen Rhein', motto: 'Für Gott, Fürst und Vaterland (For God, Prince and Fatherland)' }, quickFacts: ['Double-landlocked alpine principality set between Switzerland and Austria.', 'The world\'s leading manufacturer of high-end prosthetic teeth.'] } },
  vatican_city: { id: 'vatican_city', name: 'Vatican City', flag: '🇻🇦', continent: 'Europe', basic: { capital: 'Vatican City', population: '0.001 Million', area: '0.49 km²', currency: { code: 'EUR', symbol: '€', rate: 0.92 }, languages: 'Latin, Italian', timezones: 'CET (UTC+1)', drivingSide: 'Right', callingCode: '+379', governmentType: 'Absolute Ecclesiastical Monarchy', symbols: { flower: 'Madonna Lily', animal: 'Keys of St. Peter / Dove', anthem: 'Pontifical Anthem', motto: 'Miserando atque eligendo' }, quickFacts: ['The absolute smallest independent sovereign state in the world.', 'Surrounded completely by Rome; home to St. Peter\'s Basilica.'] } },

  // ASIA (46 Countries total + key additions)
  china: {
    id: 'china', name: 'China', flag: '🇨🇳', continent: 'Asia',
    basic: { capital: 'Beijing', population: '1.41 Billion', area: '9.6 Million km²', currency: { code: 'CNY', symbol: '¥', rate: 7.24 }, languages: 'Mandarin', timezones: 'CST (UTC+8)', drivingSide: 'Right', callingCode: '+86', governmentType: 'Single-Party Socialist Republic', symbols: { flower: 'Peony / Plum Blossom', animal: 'Giant Panda / Chinese Dragon', anthem: 'March of the Volunteers', motto: 'Serve the People' }, quickFacts: ['The global epicenter of electronics manufacturing and supply chains.', 'Hosts the Great Wall, the longest artificial structure on Earth.', 'Home to dynamic bullet train networks connecting 40,000+ km.'] }
  },
  india: {
    id: 'india', name: 'India', flag: '🇮🇳', continent: 'Asia',
    basic: { capital: 'New Delhi', population: '1.43 Billion', area: '3.28 Million km²', currency: { code: 'INR', symbol: '₹', rate: 83.3 }, languages: 'Hindi, English, 20 others', timezones: 'IST (UTC+5.5)', drivingSide: 'Left', callingCode: '+91', governmentType: 'Federal Parliamentary Republic', symbols: { flower: 'Lotus', animal: 'Bengal Tiger / Peacock', anthem: 'Jana Gana Mana', motto: 'Satyameva Jayate (Truth Alone Triumphs)' }, quickFacts: ['The world\'s most populous nation and largest democracy.', 'Birthplace of major global religions including Hinduism and Buddhism.', 'Hosts the Taj Mahal, an iconic marble masterpiece.'] }
  },
  south_korea: {
    id: 'south_korea', name: 'South Korea', flag: '🇰🇷', continent: 'Asia',
    basic: { capital: 'Seoul', population: '51.3 Million', area: '100,363 km²', currency: { code: 'KRW', symbol: '₩', rate: 1370.0 }, languages: 'Korean', timezones: 'KST (UTC+9)', drivingSide: 'Right', callingCode: '+82', governmentType: 'Presidential Republic', symbols: { flower: 'Hibiscus syriacus', animal: 'Siberian Tiger', anthem: 'Aegukga', motto: 'Hongik Ingan (To Broadly Benefit Humanity)' }, quickFacts: ['The global capital of cosmetics, K-pop music, and electronics.', 'Seoul has the world\'s fastest average residential internet speeds.', 'Pioneered advanced semi-conductor chips.'] }
  },
  singapore: {
    id: 'singapore', name: 'Singapore', flag: '🇸🇬', continent: 'Asia',
    basic: { capital: 'Singapore', population: '5.9 Million', area: '734 km²', currency: { code: 'SGD', symbol: 'S$', rate: 1.35 }, languages: 'English, Malay, Mandarin, Tamil', timezones: 'SGT (UTC+8)', drivingSide: 'Left', callingCode: '+65', governmentType: 'Parliamentary Republic', symbols: { flower: 'Vanda Miss Joaquim Orchid', animal: 'Merlion / Lion', anthem: 'Majulah Singapura', motto: 'Majulah Singapura (Onward Singapore)' }, quickFacts: ['A sovereign island city-state recognized for extreme cleanliness.', 'One of the absolute leading financial and maritime trading hubs.', 'Home to Marina Bay Sands hotel and futuristic tree superstructures.'] }
  },
  saudi_arabia: {
    id: 'saudi_arabia', name: 'Saudi Arabia', flag: '🇸🇦', continent: 'Asia',
    basic: { capital: 'Riyadh', population: '36.4 Million', area: '2.15 Million km²', currency: { code: 'SAR', symbol: 'SR', rate: 3.75 }, languages: 'Arabic', timezones: 'AST (UTC+3)', drivingSide: 'Right', callingCode: '+966', governmentType: 'Absolute Monarchy', symbols: { flower: 'Arfaj', animal: 'Arabian Camel / Falcon', anthem: 'National Anthem', motto: 'La ilaha illallah, Muhammadur rasulullah' }, quickFacts: ['The global cradle of Islam; hosts holy cities Mecca and Medina.', 'Possesses the world\'s second largest proven oil reserves.', 'Currently constructing NEOM, a futuristic linear city.'] }
  },
  turkey: {
    id: 'turkey', name: 'Turkey', flag: '🇹🇷', continent: 'Asia',
    basic: { capital: 'Ankara', population: '85.3 Million', area: '783,562 km²', currency: { code: 'TRY', symbol: '₺', rate: 32.2 }, languages: 'Turkish', timezones: 'TRT (UTC+3)', drivingSide: 'Right', callingCode: '+90', governmentType: 'Presidential Republic', symbols: { flower: 'Tulip', animal: 'Grey Wolf', anthem: 'İstiklal Marşı', motto: 'Yurtta sulh, cihanda sulh (Peace at home, peace in the world)' }, quickFacts: ['Bridges the continents of Europe and Asia across the Bosphorus.', 'Hosts Hagia Sophia and underground cities in Cappadocia.', 'Renowned for Turkish tea, spices, and historic bazaars.'] }
  },
  israel: {
    id: 'israel', name: 'Israel', flag: '🇮🇱', continent: 'Asia',
    basic: { capital: 'Jerusalem', population: '9.8 Million', area: '20,770 km²', currency: { code: 'ILS', symbol: '₪', rate: 3.7 }, languages: 'Hebrew, Arabic', timezones: 'EET (UTC+2) / EEST (UTC+3)', drivingSide: 'Right', callingCode: '+972', governmentType: 'Parliamentary Republic', symbols: { flower: 'Cyclamen persicum', animal: 'Hoopoe', anthem: 'Hatikvah', motto: 'Justice and Peace' }, quickFacts: ['Consistently ranked among global leaders in tech startups per capita.', 'Home to Jerusalem, holy to Judaism, Christianity, and Islam.', 'Bordered by the Dead Sea, the lowest land point on Earth.'] }
  },
  indonesia: { id: 'indonesia', name: 'Indonesia', flag: '🇮🇩', continent: 'Asia', basic: { capital: 'Jakarta', population: '277.5 Million', area: '1.9M km²', currency: { code: 'IDR', symbol: 'Rp', rate: 16100.0 }, languages: 'Indonesian', timezones: 'WIB (UTC+7) / WITA (UTC+8) / WIT (UTC+9)', drivingSide: 'Left', callingCode: '+62', governmentType: 'Presidential Republic', symbols: { flower: 'Melati Putih Orchid', animal: 'Komodo Dragon', anthem: 'Indonesia Raya', motto: 'Bhinneka Tunggal Ika (Unity in Diversity)' }, quickFacts: ['The largest archipelagic state in the world with 17,000+ islands.', 'Home to Komodo dragons and pristine tropical jungle reserves.'] } },
  thailand: { id: 'thailand', name: 'Thailand', flag: '🇹🇭', continent: 'Asia', basic: { capital: 'Bangkok', population: '71.8 Million', area: '513,120 km²', currency: { code: 'THB', symbol: '฿', rate: 36.7 }, languages: 'Thai', timezones: 'ICT (UTC+7)', drivingSide: 'Left', callingCode: '+66', governmentType: 'Constitutional Monarchy', symbols: { flower: 'Ratchaphruek', animal: 'Thai Elephant', anthem: 'Phleng Chat', motto: 'Nation, Religion, King' }, quickFacts: ['The only Southeast Asian nation never colonized by European powers.', 'World-famous for ornate golden Buddhist temples and street foods.'] } },
  vietnam: { id: 'vietnam', name: 'Vietnam', flag: '🇻🇳', continent: 'Asia', basic: { capital: 'Hanoi', population: '98.8 Million', area: '331,210 km²', currency: { code: 'VND', symbol: '₫', rate: 25400.0 }, languages: 'Vietnamese', timezones: 'ICT (UTC+7)', drivingSide: 'Right', callingCode: '+84', governmentType: 'Single-Party Socialist Republic', symbols: { flower: 'Lotus', animal: 'Water Buffalo', anthem: 'Tien Quan Ca', motto: 'Independence, Freedom, Happiness' }, quickFacts: ['World\'s second-largest exporter of coffee beans after Brazil.', 'Hosts the spectacular limestone towers of Ha Long Bay.'] } },
  philippines: { id: 'philippines', name: 'Philippines', flag: '🇵🇭', continent: 'Asia', basic: { capital: 'Manila', population: '115.5 Million', area: '300,000 km²', currency: { code: 'PHP', symbol: '₱', rate: 58.2 }, languages: 'Filipino, English', timezones: 'PHT (UTC+8)', drivingSide: 'Right', callingCode: '+63', governmentType: 'Presidential Republic', symbols: { flower: 'Sampaguita Jasmine', animal: 'Carabao / Philippine Eagle', anthem: 'Lupang Hinirang', motto: 'Maka-Diyos, Maka-Tao, Makakalikasan at Makabansa' }, quickFacts: ['Composed of 7,641 beautiful islands in the western Pacific.', 'Renowned for world-class tropical white sand beaches.'] } },
  united_arab_emirates: { id: 'united_arab_emirates', name: 'United Arab Emirates', flag: '🇦🇪', continent: 'Asia', basic: { capital: 'Abu Dhabi', population: '9.4 Million', area: '83,600 km²', currency: { code: 'AED', symbol: 'د.إ', rate: 3.67 }, languages: 'Arabic, English', timezones: 'GST (UTC+4)', drivingSide: 'Right', callingCode: '+971', governmentType: 'Federal Elective Constitutional Monarchy', symbols: { flower: 'Tribulus terrestris', animal: 'Arabian Oryx / Falcon', anthem: 'Ishy Bilady', motto: 'Allah, al-Watan, al-Ra\'is' }, quickFacts: ['Home to the Burj Khalifa in Dubai, the tallest building on Earth.', 'Transformed from desert coastlines to high-tech logistics hubs.'] } },
  pakistan: { id: 'pakistan', name: 'Pakistan', flag: '🇵🇰', continent: 'Asia', basic: { capital: 'Islamabad', population: '241.4 Million', area: '796,095 km²', currency: { code: 'PKR', symbol: '₨', rate: 278.2 }, languages: 'Urdu, English', timezones: 'PKT (UTC+5)', drivingSide: 'Left', callingCode: '+92', governmentType: 'Federal Parliamentary Republic', symbols: { flower: 'Jasmine', animal: 'Markhor / Snow Leopard', anthem: 'Qaumi Taraanah', motto: 'Iman, Ittihad, Nazm (Faith, Unity, Discipline)' }, quickFacts: ['Hosts five of the world\'s fourteen peaks above 8,000 meters.', 'Contains the remains of the ancient Indus Valley Civilization.'] } },
  bangladesh: { id: 'bangladesh', name: 'Bangladesh', flag: '🇧🇩', continent: 'Asia', basic: { capital: 'Dhaka', population: '172.9 Million', area: '147,570 km²', currency: { code: 'BDT', symbol: '৳', rate: 117.5 }, languages: 'Bengali', timezones: 'BST (UTC+6)', drivingSide: 'Left', callingCode: '+880', governmentType: 'Parliamentary Republic', symbols: { flower: 'Water Lily', animal: 'Royal Bengal Tiger', anthem: 'Amar Shonar Bangla', motto: 'Unity, Labor, Progress' }, quickFacts: ['Home to Cox\'s Bazar, the longest natural sandy sea beach.', 'Located on the Ganges-Brahmaputra Delta, the largest delta.'] } },
  malaysia: { id: 'malaysia', name: 'Malaysia', flag: '🇲🇾', continent: 'Asia', basic: { capital: 'Kuala Lumpur', population: '34.3 Million', area: '330,803 km²', currency: { code: 'MYR', symbol: 'RM', rate: 4.7 }, languages: 'Malay', timezones: 'MYT (UTC+8)', drivingSide: 'Left', callingCode: '+60', governmentType: 'Federal Parliamentary Constitutional Monarchy', symbols: { flower: 'Hibiscus', animal: 'Malayan Tiger', anthem: 'Negaraku', motto: 'Bersekutu Bertambah Mutu (Unity is Strength)' }, quickFacts: ['Petronas Twin Towers in KL are the tallest twin towers.', 'Borneo jungle sectors host unique orangutan populations.'] } },
  afghanistan: { id: 'afghanistan', name: 'Afghanistan', flag: '🇦🇫', continent: 'Asia', basic: { capital: 'Kabul', population: '42.2 Million', area: '652,864 km²', currency: { code: 'AFN', symbol: '؋', rate: 71.5 }, languages: 'Pashto, Dari', timezones: 'AFT (UTC+4.5)', drivingSide: 'Right', callingCode: '+93', governmentType: 'Theocratic Emirate', symbols: { flower: 'Tulip', animal: 'Snow Leopard', anthem: 'Milli Surood', motto: 'Allahu Akbar' }, quickFacts: ['A rugged landlocked mountainous country in South-Central Asia.', 'Kabul has over 3,000 years of strategic historical records.'] } },
  qatar: { id: 'qatar', name: 'Qatar', flag: '🇶🇦', continent: 'Asia', basic: { capital: 'Doha', population: '2.7 Million', area: '11,586 km²', currency: { code: 'QAR', symbol: 'QR', rate: 3.64 }, languages: 'Arabic, English', timezones: 'AST (UTC+3)', drivingSide: 'Right', callingCode: '+974', governmentType: 'Absolute Monarchy', symbols: { flower: 'Qatari Rose', animal: 'Arabian Oryx', anthem: 'As-Salam al-Amiri', motto: 'For the love of Qatar' }, quickFacts: ['Boasts one of the highest GDP per capita levels globally.', 'Successfully hosted the historic 2022 FIFA World Cup.'] } },
  kuwait: { id: 'kuwait', name: 'Kuwait', flag: '🇰🇼', continent: 'Asia', basic: { capital: 'Kuwait City', population: '4.3 Million', area: '17,818 km²', currency: { code: 'KWD', symbol: 'KD', rate: 0.31 }, languages: 'Arabic', timezones: 'AST (UTC+3)', drivingSide: 'Right', callingCode: '+965', governmentType: 'Constitutional Emirate', symbols: { flower: 'Arfaj', animal: 'Falcon', anthem: 'Al-Nasheed Al-Watani', motto: 'For Kuwait' }, quickFacts: ['The Kuwaiti Dinar remains the highest-valued currency globally.', 'Holds massive, highly concentrated crude petroleum reserves.'] } },
  oman: { id: 'oman', name: 'Oman', flag: '🇴🇲', continent: 'Asia', basic: { capital: 'Muscat', population: '4.6 Million', area: '309,500 km²', currency: { code: 'OMR', symbol: 'RO', rate: 0.38 }, languages: 'Arabic', timezones: 'GST (UTC+4)', drivingSide: 'Right', callingCode: '+968', governmentType: 'Absolute Monarchy', symbols: { flower: 'Jasmine', animal: 'Arabian Oryx / Dagger (Khanjar)', anthem: 'Nashid as-Salaam as-Sultani', motto: 'Faith, Country, King' }, quickFacts: ['The oldest continuous independent state in the Arab world.', 'Famous for ancient frankincense trade and dramatic wadi canyons.'] } },
  bahrain: { id: 'bahrain', name: 'Bahrain', flag: '🇧🇭', continent: 'Asia', basic: { capital: 'Manama', population: '1.5 Million', area: '780 km²', currency: { code: 'BHD', symbol: 'BD', rate: 0.38 }, languages: 'Arabic, English', timezones: 'AST (UTC+3)', drivingSide: 'Right', callingCode: '+973', governmentType: 'Constitutional Monarchy', symbols: { flower: 'Chamomile', animal: 'Bulbul', anthem: 'Bahrainona', motto: 'For the Country' }, quickFacts: ['Composed of over 30 islands set in the Persian Gulf.', 'Famous for ancient Dilmun civilization archaeological sites.'] } },
  yemen: { id: 'yemen', name: 'Yemen', flag: '🇾🇪', continent: 'Asia', basic: { capital: 'Sanaa', population: '34.4 Million', area: '527,968 km²', currency: { code: 'YER', symbol: '﷼', rate: 250.0 }, languages: 'Arabic', timezones: 'AST (UTC+3)', drivingSide: 'Right', callingCode: '+967', governmentType: 'Provisional Government', symbols: { flower: 'Coffee Flower', animal: 'Golden Eagle', anthem: 'National Anthem', motto: 'Allah, al-Watan, al-Thawra' }, quickFacts: ['Home to Shibam, the historic "Manhattan of the Desert" clay high-rises.', 'Socotra island hosts rare endemic Dragon\'s Blood trees.'] } },
  syria: { id: 'syria', name: 'Syria', flag: '🇸🇾', continent: 'Asia', basic: { capital: 'Damascus', population: '23.0 Million', area: '185,180 km²', currency: { code: 'SYP', symbol: 'LS', rate: 13000.0 }, languages: 'Arabic', timezones: 'EET (UTC+2)', drivingSide: 'Right', callingCode: '+963', governmentType: 'Presidential Republic', symbols: { flower: 'Damask Rose', animal: 'Hawk of Quraish', anthem: 'Humath ad-Diyar', motto: 'Unity, Freedom, Socialism' }, quickFacts: ['Damascus is one of the oldest continuously inhabited cities globally.', 'Home to massive historic Roman ruins at Palmyra.'] } },
  jordan: { id: 'jordan', name: 'Jordan', flag: '🇯🇴', continent: 'Asia', basic: { capital: 'Amman', population: '11.3 Million', area: '89,342 km²', currency: { code: 'JOD', symbol: 'JD', rate: 0.71 }, languages: 'Arabic', timezones: 'EET (UTC+2)', drivingSide: 'Right', callingCode: '+962', governmentType: 'Constitutional Monarchy', symbols: { flower: 'Black Iris', animal: 'Arabian Oryx', anthem: 'The Royal Anthem', motto: 'Allah, al-Watan, al-Malik' }, quickFacts: ['Hosts Petra, a spectacular ancient city carved in rose sandstone.', 'Bounded by the hyper-saline waters of the Dead Sea.'] } },
  lebnon: { id: 'lebanon', name: 'Lebanon', flag: '🇱🇧', continent: 'Asia', basic: { capital: 'Beirut', population: '5.3 Million', area: '10,452 km²', currency: { code: 'LBP', symbol: 'ل.ل', rate: 89500.0 }, languages: 'Arabic, French', timezones: 'EET (UTC+2)', drivingSide: 'Right', callingCode: '+961', governmentType: 'Parliamentary Republic', symbols: { flower: 'Cyclamen / Cedar', animal: 'Striped Hyena', anthem: 'Kulluna lil-Watan', motto: 'All for the Country' }, quickFacts: ['The iconic Lebanese Cedar tree is stamped on the national flag.', 'Beirut was historically known as the "Paris of the Middle East."'] } },
  sri_lanka: { id: 'sri_lanka', name: 'Sri Lanka', flag: '🇱🇰', continent: 'Asia', basic: { capital: 'Colombo', population: '21.9 Million', area: '65,610 km²', currency: { code: 'LKR', symbol: '₨', rate: 300.5 }, languages: 'Sinhala, Tamil', timezones: 'SLST (UTC+5.5)', drivingSide: 'Left', callingCode: '+94', governmentType: 'Semi-Presidential Republic', symbols: { flower: 'Blue Water Lily', animal: 'Sri Lankan Junglefowl', anthem: 'Sri Lanka Matha', motto: 'Unity and Progress' }, quickFacts: ['Known as the "Pearl of the Indian Ocean" for its natural shape.', 'Leading global producer of premium Ceylon tea leaves.'] } },
  nepal: { id: 'nepal', name: 'Nepal', flag: '🇳🇵', continent: 'Asia', basic: { capital: 'Kathmandu', population: '30.9 Million', area: '147,181 km²', currency: { code: 'NPR', symbol: '₨', rate: 133.5 }, languages: 'Nepali', timezones: 'NPT (UTC+5.75)', drivingSide: 'Left', callingCode: '+977', governmentType: 'Federal Parliamentary Republic', symbols: { flower: 'Rhododendron', animal: 'Cow / Danphe', anthem: 'Sayaun Thunga Phulka', motto: 'Mother and Motherland are greater than heaven' }, quickFacts: ['Contains eight of the world\'s ten highest mountain peaks.', 'The only national flag globally that is not rectangular.'] } },
  bhutan: { id: 'bhutan', name: 'Bhutan', flag: '🇧🇹', continent: 'Asia', basic: { capital: 'Thimphu', population: '0.78 Million', area: '38,394 km²', currency: { code: 'BTN', symbol: 'Nu.', rate: 83.3 }, languages: 'Dzongkha', timezones: 'BTT (UTC+6)', drivingSide: 'Left', callingCode: '+975', governmentType: 'Constitutional Monarchy', symbols: { flower: 'Blue Poppy', animal: 'Takin / Thunder Dragon', anthem: 'Druk Tsendhen', motto: 'One Nation, One People' }, quickFacts: ['Pioneered measuring national success via Gross National Happiness.', 'The first country globally to be officially carbon negative.'] } },
  maldives: { id: 'maldives', name: 'Maldives', flag: '🇲🇻', continent: 'Asia', basic: { capital: 'Male', population: '0.52 Million', area: '300 km²', currency: { code: 'MVR', symbol: 'Rf', rate: 15.4 }, languages: 'Dhivehi', timezones: 'MVT (UTC+5)', drivingSide: 'Left', callingCode: '+960', governmentType: 'Presidential Republic', symbols: { flower: 'Pink Rose', animal: 'Yellowfin Tuna', anthem: 'Gaumii Salaam', motto: 'State of the Dhivehi' }, quickFacts: ['The lowest and flattest sovereign nation on the planet.', 'Famous for spectacular turquoise overwater villa resorts.'] } },

  // AMERICAS (35 Countries total + key additions)
  united_states: {
    id: 'united_states', name: 'United States', flag: '🇺🇸', continent: 'Americas',
    basic: { capital: 'Washington D.C.', population: '334.9 Million', area: '9.83M km²', currency: { code: 'USD', symbol: '$', rate: 1.0 }, languages: 'English', timezones: 'EST (UTC-5) / 5 others', drivingSide: 'Right', callingCode: '+1', governmentType: 'Federal Constitutional Republic', symbols: { flower: 'Rose', animal: 'Bald Eagle', anthem: 'The Star-Spangled Banner', motto: 'In God We Trust' }, quickFacts: ['The world\'s absolute leading economy by nominal GDP index.', 'Home to Silicon Valley, the epicentre of software innovation.', 'Hosts spectacular natural reserves like Yellowstone and Grand Canyon.'] }
  },
  canada: {
    id: 'canada', name: 'Canada', flag: '🇨🇦', continent: 'Americas',
    basic: { capital: 'Ottawa', population: '38.9 Million', area: '9.98M km²', currency: { code: 'CAD', symbol: '$', rate: 1.37 }, languages: 'English, French', timezones: 'EST (UTC-5) / 5 others', drivingSide: 'Right', callingCode: '+1', governmentType: 'Federal Parliamentary Constitutional Monarchy', symbols: { flower: 'Maple Leaf', animal: 'Beaver', anthem: 'O Canada', motto: 'A mari usque ad mare (From sea to sea)' }, quickFacts: ['The second-largest country in the world by total land bounds.', 'Contains over 60% of the planet\'s total freshwater lakes.', 'Maple syrup is an iconic national resource and cultural symbol.'] }
  },
  mexico: {
    id: 'mexico', name: 'Mexico', flag: '🇲🇽', continent: 'Americas',
    basic: { capital: 'Mexico City', population: '128.5 Million', area: '1.96M km²', currency: { code: 'MXN', symbol: '$', rate: 16.7 }, languages: 'Spanish', timezones: 'CST (UTC-6) / 3 others', drivingSide: 'Right', callingCode: '+52', governmentType: 'Federal Presidential Republic', symbols: { flower: 'Dahlia', animal: 'Golden Eagle', anthem: 'Himno Nacional Mexicano', motto: 'Patria y Libertad' }, quickFacts: ['The cradle of ancient Aztec and Mayan civilizations.', 'Renowned worldwide for spicy tacos, tequila, and mariachi music.', 'Hosts Chichén Itzá, a spectacular UNESCO Mayan step pyramid.'] }
  },
  argentina: {
    id: 'argentina', name: 'Argentina', flag: '🇦🇷', continent: 'Americas',
    basic: { capital: 'Buenos Aires', population: '46.2 Million', area: '2.78M km²', currency: { code: 'ARS', symbol: '$', rate: 890.0 }, languages: 'Spanish', timezones: 'ART (UTC-3)', drivingSide: 'Right', callingCode: '+54', governmentType: 'Federal Presidential Republic', symbols: { flower: 'Ceibo', animal: 'Rufous Hornero', anthem: 'Himno Nacional Argentino', motto: 'En Unión y Libertad (In Union and Liberty)' }, quickFacts: ['Birthplace of the passionate, elegant Tango dance.', 'Famous for massive steak barbecues (Asado) and Patagonia peaks.', 'Features Ushuaia, the southernmost city on the planet.'] }
  },
  colombia: {
    id: 'colombia', name: 'Colombia', flag: '🇨🇴', continent: 'Americas',
    basic: { capital: 'Bogota', population: '52.1 Million', area: '1.14M km²', currency: { code: 'COP', symbol: '$', rate: 3880.0 }, languages: 'Spanish', timezones: 'COT (UTC-5)', drivingSide: 'Right', callingCode: '+57', governmentType: 'Presidential Republic', symbols: { flower: 'Christmas Orchid', animal: 'Andean Condor', anthem: 'Himno Nacional de Colombia', motto: 'Libertad y Orden (Liberty and Order)' }, quickFacts: ['The world\'s absolute leading producer of high-grade emeralds.', 'Home to incredible biological diversity and premium mild coffees.', 'Features the historic walled port city of Cartagena.'] }
  },
  peru: {
    id: 'peru', name: 'Peru', flag: '🇵🇪', continent: 'Americas',
    basic: { capital: 'Lima', population: '34.0 Million', area: '1.28M km²', currency: { code: 'PEN', symbol: 'S/.', rate: 3.72 }, languages: 'Spanish, Quechua', timezones: 'PET (UTC-5)', drivingSide: 'Right', callingCode: '+51', governmentType: 'Presidential Republic', symbols: { flower: 'Cantua', animal: 'Vicuña / Andean Cock-of-the-rock', anthem: 'Himno Nacional del Perú', motto: 'Firme y feliz por la unión' }, quickFacts: ['Hosts Machu Picchu, the legendary lost citadel of the Incas.', 'Lima is the undisputed culinary gastronomy capital of South America.', 'Birthplace of the humble potato, hosting 4,000+ local varieties.'] }
  },
  chile: { id: 'chile', name: 'Chile', flag: '🇨🇱', continent: 'Americas', basic: { capital: 'Santiago', population: '19.6 Million', area: '756,096 km²', currency: { code: 'CLP', symbol: '$', rate: 915.0 }, languages: 'Spanish', timezones: 'CLT (UTC-4) / EAST (UTC-6)', drivingSide: 'Right', callingCode: '+56', governmentType: 'Presidential Republic', symbols: { flower: 'Copihue', animal: 'Andean Huemul / Condor', anthem: 'Himno Nacional de Chile', motto: 'Por la razón o la fuerza' }, quickFacts: ['The longest country in the world, stretching over 4,300 km.', 'Contains the hyper-arid wastes of the high Atacama Desert.'] } },
  ecuador: { id: 'ecuador', name: 'Ecuador', flag: '🇪🇨', continent: 'Americas', basic: { capital: 'Quito', population: '18.2 Million', area: '283,561 km²', currency: { code: 'USD', symbol: '$', rate: 1.0 }, languages: 'Spanish', timezones: 'ECT (UTC-5) / GALT (UTC-6)', drivingSide: 'Right', callingCode: '+593', governmentType: 'Presidential Republic', symbols: { flower: 'Chuquiragua', animal: 'Andean Condor', anthem: 'Salve, Oh Patria', motto: 'La Patria en marcha' }, quickFacts: ['Home to the Galápagos Islands, which inspired Darwin\'s evolution theory.', 'Quito is situated at the highest altitude of any official capital.'] } },
  costa_rica: { id: 'costa_rica', name: 'Costa Rica', flag: '🇨🇷', continent: 'Americas', basic: { capital: 'San Jose', population: '5.2 Million', area: '51,100 km²', currency: { code: 'CRC', symbol: '₡', rate: 512.0 }, languages: 'Spanish', timezones: 'CST (UTC-6)', drivingSide: 'Right', callingCode: '+506', governmentType: 'Presidential Republic', symbols: { flower: 'Guaria Morada Orchid', animal: 'White-tailed Deer', anthem: 'Himno Nacional de Costa Rica', motto: 'Vivan siempre el trabajo y la paz' }, quickFacts: ['A global leading pioneer in eco-tourism and national parks protection.', 'Abolished its entire standing national military in 1948.'] } },
  venezuela: { id: 'venezuela', name: 'Venezuela', flag: '🇻🇪', continent: 'Americas', basic: { capital: 'Caracas', population: '28.8 Million', area: '916,445 km²', currency: { code: 'VES', symbol: 'Bs.S', rate: 36.4 }, languages: 'Spanish', timezones: 'VET (UTC-4)', drivingSide: 'Right', callingCode: '+58', governmentType: 'Federal Presidential Republic', symbols: { flower: 'May Flower Orchid', animal: 'Turpial', anthem: 'Gloria al Bravo Pueblo', motto: 'Dios y Federación' }, quickFacts: ['Hosts Angel Falls, the highest uninterrupted waterfall on Earth.', 'Possesses the absolute largest proven crude oil reserves globally.'] } },
  cuba: { id: 'cuba', name: 'Cuba', flag: '🇨🇺', continent: 'Americas', basic: { capital: 'Havana', population: '11.2 Million', area: '109,884 km²', currency: { code: 'CUP', symbol: '$', rate: 24.0 }, languages: 'Spanish', timezones: 'CST (UTC-5)', drivingSide: 'Right', callingCode: '+53', governmentType: 'Single-Party Socialist Republic', symbols: { flower: 'Mariposa Orchid', animal: 'Tocororo', anthem: 'La Bayamesa', motto: 'Patria o Muerte (Homeland or Death)' }, quickFacts: ['Famous for historic classic cars and hand-rolled premium cigars.', 'The largest island in the Caribbean, rich in Spanish heritage.'] } },

  // AFRICA (54 Countries total + key additions)
  egypt: {
    id: 'egypt', name: 'Egypt', flag: '🇪🇬', continent: 'Africa',
    basic: { capital: 'Cairo', population: '112.7 Million', area: '1.01M km²', currency: { code: 'EGP', symbol: 'E£', rate: 47.5 }, languages: 'Arabic', timezones: 'EET (UTC+2)', drivingSide: 'Right', callingCode: '+20', governmentType: 'Semi-Presidential Republic', symbols: { flower: 'Lotus', animal: 'Steppe Eagle', anthem: 'Bilady, Bilady, Bilady', motto: 'Silence and Patience' }, quickFacts: ['Home to the ancient Pyramids of Giza and the Sphinx.', 'Controlled by the Nile river basin and the strategic Suez Canal.', 'Cairo hosts medieval Islamic architecture and vast museum collections.'] }
  },
  nigeria: {
    id: 'nigeria', name: 'Nigeria', flag: '🇳🇬', continent: 'Africa',
    basic: { capital: 'Abuja', population: '223.8 Million', area: '923,768 km²', currency: { code: 'NGN', symbol: '₦', rate: 1450.0 }, languages: 'English', timezones: 'WAT (UTC+1)', drivingSide: 'Right', callingCode: '+234', governmentType: 'Federal Presidential Republic', symbols: { flower: 'Yellow Trumpet Costus', animal: 'Black Crowned Crane', anthem: 'Arise, O Compatriots', motto: 'Unity and Faith, Peace and Progress' }, quickFacts: ['The most populous country in Africa and leading economic hub.', 'Nollywood is one of the largest film production sectors globally.', 'Home to dense rainforest reserves and major petroleum fields.'] }
  },
  kenya: {
    id: 'kenya', name: 'Kenya', flag: '🇰🇪', continent: 'Africa',
    basic: { capital: 'Nairobi', population: '55.1 Million', area: '580,367 km²', currency: { code: 'KES', symbol: 'KSh', rate: 132.0 }, languages: 'Swahili, English', timezones: 'EAT (UTC+3)', drivingSide: 'Left', callingCode: '+254', governmentType: 'Presidential Republic', symbols: { flower: 'Orchid', animal: 'Lion', anthem: 'Ee Mungu Nguvu Yetu', motto: 'Harambee (Let us pull together)' }, quickFacts: ['World capital of scenic wildlife safaris in the Maasai Mara.', 'Nairobi is the primary technology startup hub of East Africa.', 'Produces world-champion long-distance running athletes.'] }
  },
  morocco: {
    id: 'morocco', name: 'Morocco', flag: '🇲🇦', continent: 'Africa',
    basic: { capital: 'Rabat', population: '37.8 Million', area: '446,550 km²', currency: { code: 'MAD', symbol: 'DH', rate: 10.05 }, languages: 'Arabic, Berber', timezones: 'WET (UTC+0) / WEST (UTC+1)', drivingSide: 'Right', callingCode: '+212', governmentType: 'Parliamentary Constitutional Monarchy', symbols: { flower: 'Rose', animal: 'Barbary Lion', anthem: 'Cherifian Anthem', motto: 'Allah, al-Watan, al-Malik' }, quickFacts: ['Hosts beautiful ancient red clay medinas in Marrakech and Fez.', 'Renowned for aromatic tagine stews and argan oil extracts.', 'Bordered by both the Atlantic Ocean and the dry Sahara Desert.'] }
  },
  ethiopia: { id: 'ethiopia', name: 'Ethiopia', flag: '🇪🇹', continent: 'Africa', basic: { capital: 'Addis Ababa', population: '126.5 Million', area: '1.1M km²', currency: { code: 'ETB', symbol: 'Br', rate: 57.2 }, languages: 'Amharic', timezones: 'EAT (UTC+3)', drivingSide: 'Right', callingCode: '+251', governmentType: 'Federal Parliamentary Republic', symbols: { flower: 'Calla Lily', animal: 'Abyssinian Lion', anthem: 'Wodefit Gesgeshi, Widd Innat Ityopp\'ya', motto: 'Ethiopia shall hold out her hands to God' }, quickFacts: ['One of the only African nations never officially colonized.', 'The historical birthplace of the Coffea arabica bean.'] } },
  ghana: { id: 'ghana', name: 'Ghana', flag: '🇬🇭', continent: 'Africa', basic: { capital: 'Accra', population: '34.1 Million', area: '238,533 km²', currency: { code: 'GHS', symbol: 'GH₵', rate: 14.5 }, languages: 'English', timezones: 'GMT (UTC+0)', drivingSide: 'Right', callingCode: '+233', governmentType: 'Presidential Republic', symbols: { flower: 'Golden Wattle', animal: 'Golden Eagle', anthem: 'God Bless Our Homeland Ghana', motto: 'Freedom and Justice' }, quickFacts: ['The first sub-Saharan nation to gain colonial independence in 1957.', 'Major global exporter of premium cocoa beans and gold.'] } },
  senegal: { id: 'senegal', name: 'Senegal', flag: '🇸🇳', continent: 'Africa', basic: { capital: 'Dakar', population: '17.8 Million', area: '196,722 km²', currency: { code: 'XOF', symbol: 'CFA', rate: 605.0 }, languages: 'French, Wolof', timezones: 'GMT (UTC+0)', drivingSide: 'Right', callingCode: '+221', governmentType: 'Presidential Republic', symbols: { flower: 'Baobab Flower', animal: 'Lion', anthem: 'Pincez Tous vos Koras, Frappez les Balafons', motto: 'Un Peuple, Un But, Une Foi' }, quickFacts: ['Dakar is the absolute westernmost city on the African mainland.', 'Famous for warm local hospitality, traditional music, and wrestling.'] } },
  tanzania: { id: 'tanzania', name: 'Tanzania', flag: '🇹🇿', continent: 'Africa', basic: { capital: 'Dodoma', population: '67.4 Million', area: '947,303 km²', currency: { code: 'TZS', symbol: 'TSh', rate: 2600.0 }, languages: 'Swahili, English', timezones: 'EAT (UTC+3)', drivingSide: 'Left', callingCode: '+255', governmentType: 'Presidential Republic', symbols: { flower: 'Cloves', animal: 'Maasai Giraffe', anthem: 'Mungu Ibariki Afrika', motto: 'Uhuru na Umoja (Freedom and Unity)' }, quickFacts: ['Home to Mount Kilimanjaro, the highest free-standing peak.', 'Hosts the spectacular annual wildebeest Serengeti migrations.'] } },

  // OCEANIA (14 Countries total + key additions)
  new_zealand: {
    id: 'new_zealand', name: 'New Zealand', flag: '🇳🇿', continent: 'Oceania',
    basic: { capital: 'Wellington', population: '5.2 Million', area: '268,021 km²', currency: { code: 'NZD', symbol: '$', rate: 1.63 }, languages: 'English, Maori', timezones: 'NZST (UTC+12) / NZDT (UTC+13)', drivingSide: 'Left', callingCode: '+64', governmentType: 'Parliamentary Constitutional Monarchy', symbols: { flower: 'Kowhai', animal: 'Kiwi / Silver Fern', anthem: 'God Defend New Zealand', motto: 'Onward' }, quickFacts: ['The first self-governing nation to grant women the vote in 1893.', 'Scenic backdrop for the legendary Lord of the Rings movies.', 'Renowned for dramatic geothermal geysers and deep glacial fjords.'] }
  },
  fiji: {
    id: 'fiji', name: 'Fiji', flag: '🇫🇯', continent: 'Oceania',
    basic: { capital: 'Suva', population: '0.93 Million', area: '18,274 km²', currency: { code: 'FJD', symbol: '$', rate: 2.25 }, languages: 'English, Fijian, Hindi', timezones: 'FJT (UTC+12)', drivingSide: 'Left', callingCode: '+679', governmentType: 'Parliamentary Republic', symbols: { flower: 'Tagimoucia', animal: 'Collared Lory', anthem: 'God Bless Fiji', motto: 'Rerevaka na Kalou ka Doka na Tui (Fear God and honor the Queen)' }, quickFacts: ['Archipelago composed of 332 beautiful volcanic islands.', 'World famous for crystal blue coral lagoons and friendly resorts.', 'Rugby is the primary national sport and cultural obsession.'] }
  },
  papua_new_guinea: { id: 'papua_new_guinea', name: 'Papua New Guinea', flag: '🇵🇬', continent: 'Oceania', basic: { capital: 'Port Moresby', population: '10.3 Million', area: '462,840 km²', currency: { code: 'PGK', symbol: 'K', rate: 3.85 }, languages: 'English, Tok Pisin, Hiri Motu', timezones: 'PGT (UTC+10)', drivingSide: 'Left', callingCode: '+675', governmentType: 'Parliamentary Constitutional Monarchy', symbols: { flower: 'Orchid', animal: 'Raggiana Bird-of-paradise', anthem: 'O Arise, All You Sons', motto: 'Unity in Diversity' }, quickFacts: ['One of the most culturally diverse nations, hosting 800+ languages.', 'Dense mountainous jungle interior regions host rare wildlife.'] } }
};
