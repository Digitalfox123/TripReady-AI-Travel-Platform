import { countriesData } from './countryData';

// Stable curated data for flagship countries
const flagshipIntelligence = {
  switzerland: {
    safety: {
      score: '9.6',
      solo: 'Extremely Safe. One of the safest destinations globally for solo travelers.',
      family: 'Excellent. Clean public parks, baby-friendly trains, and safe pedestrian paths.',
      women: 'Very safe. Solo female travelers experience virtually no street harassment.',
      scams: 'Low risk. Watch out for overpriced tourist menus or taxi fares in city centers.'
    },
    visa: {
      status: 'Schengen Visa-Free / Schengen Area',
      processing: '15 Days (if visa is required)',
      requirements: [
        'Passport valid for at least 3 months beyond departure date',
        'Proof of financial means (100 CHF per day)',
        'Schengen Travel Insurance policy ($30,000 EUR coverage)',
        'Roundtrip flight reservation'
      ]
    },
    basics: {
      plug: 'Type J (also accepts Type C), 230V, 50Hz',
      emergency: 'Police: 117 | Ambulance: 144 | Fire: 118',
      timezone: 'CET (UTC+1) / CEST (UTC+2)'
    },
    seasons: {
      peak: 'June to August (Summer hiking) & December to March (Skiing)',
      shoulder: 'April to May (Spring blooms) & September to October (Autumn colors)',
      budget: 'November (Pre-winter quiet) & January to February (Non-ski areas)',
      timeline: ['shoulder', 'shoulder', 'peak', 'shoulder', 'shoulder', 'peak', 'peak', 'peak', 'shoulder', 'shoulder', 'budget', 'peak']
    },
    destinations: [
      {
        name: 'Zurich',
        category: 'Cities',
        desc: 'Switzerland\'s largest city and economic engine, blending medieval old town charm with trendy modern districts.',
        stay: '2-3 Days',
        why: 'Vibrant lakeside swimming lidos, Bahnhofstrasse luxury shopping, and world-class museums like the Kunsthaus.'
      },
      {
        name: 'Interlaken',
        category: 'Mountains',
        desc: 'The adventure capital of the Swiss Alps, nestled beautifully between Lake Thun and Lake Brienz.',
        stay: '3-4 Days',
        why: 'Gateway to the Jungfraujoch summit, paragliding over alpine meadows, and scenic hiking trails.'
      },
      {
        name: 'Geneva',
        category: 'Cities',
        desc: 'A cosmopolitan lakeside hub hosting the United Nations and global humanitarian headquarters.',
        stay: '2 Days',
        why: 'The iconic Jet d\'Eau water fountain, historic St. Pierre Cathedral, and high-end chocolate boutique tours.'
      },
      {
        name: 'Lucerne',
        category: 'Islands', // Will map to Lakes / Water
        desc: 'A postcard-perfect lakeside city famous for its preserved fourteenth-century wooden Chapel Bridge.',
        stay: '2 Days',
        why: 'Mt. Pilatus cable car excursions, direct lake steamer cruises, and walking through the car-free old town.'
      },
      {
        name: 'Zermatt',
        category: 'Mountains',
        desc: 'A high-altitude, car-free alpine village situated directly at the base of the iconic Matterhorn peak.',
        stay: '2-3 Days',
        why: 'Skiing 365 days a year, riding the Gornergrat cogwheel railway, and taking photos of the mountain reflections.'
      }
    ],
    attractions: [
      {
        name: 'The Matterhorn',
        fee: 'Free (Cable cars from $85)',
        duration: 'Half Day',
        season: 'July to September',
        rating: '4.9',
        tip: 'Ride the early morning Gornergrat Railway to catch the sun reflecting off the eastern face of the peak before cloud cover rolls in.'
      },
      {
        name: 'Jungfraujoch - Top of Europe',
        fee: 'From $195 USD (Train ticket)',
        duration: 'Full Day',
        season: 'Year-round',
        rating: '4.8',
        tip: 'Check the live webcam at Interlaken station before buying tickets. If the summit is covered in clouds, save your money for another day.'
      },
      {
        name: 'Rhine Falls',
        fee: '$5 USD',
        duration: '2-3 Hours',
        season: 'May to August',
        rating: '4.7',
        tip: 'Take the yellow boat tour that runs directly to the central rock. Climbing up to the viewing platform surrounded by the roaring waters is unforgettable.'
      },
      {
        name: 'Lake Geneva Promenade & Chillon Castle',
        fee: 'Castle entry: $15 USD',
        duration: '3-4 Hours',
        season: 'June to September',
        rating: '4.8',
        tip: 'Walk the flower-lined lakeside path from Montreux to Chillon Castle. It takes 45 minutes and offers stunning views of the Savoy Alps.'
      }
    ],
    budget: {
      budgetDaily: '80 - 120',
      midRangeDaily: '200 - 350',
      luxuryDaily: '650+',
      snapshot: {
        hotel: '150 - 250',
        food: '30 - 60',
        transport: '20 - 45',
        attraction: '15 - 50'
      }
    },
    transport: {
      train: { cost: '$$$', conv: '4.9', rec: 'Highly Recommended. The Swiss Rail network (SBB) is incredibly punctual, clean, and covers every mountain valley.' },
      bus: { cost: '$$', conv: '4.5', rec: 'Highly Recommended. The yellow PostBus system connects villages not reached by trains.' },
      metro: { cost: '$$', conv: '4.0', rec: 'Recommended. Lausanne has a small metro; Zurich and Geneva use dense, easy-to-use tramways.' },
      rideshare: { cost: '$$$$', conv: '3.5', rec: 'Optional. Uber is available in major cities but is significantly more expensive than public transit.' },
      carRental: { cost: '$$$$', conv: '4.2', rec: 'Optional. Fun for scenic mountain passes, but parking in cities is extremely expensive and driving is restricted in resorts.' },
      flights: { cost: '$$$$', conv: '1.5', rec: 'Not Recommended. The country is small; center-to-center trains are faster than flying.' }
    },
    weather: [
      { month: 'Jan', temp: '-2°C / 3°C', rain: '65mm', snow: 'Yes', crowd: 'High', rating: 'Winter Sports Peak ⭐️⭐️⭐️⭐️' },
      { month: 'Feb', temp: '-1°C / 5°C', rain: '55mm', snow: 'Yes', crowd: 'High', rating: 'Winter Sports Peak ⭐️⭐️⭐️⭐️' },
      { month: 'Mar', temp: '2°C / 10°C', rain: '70mm', snow: 'Alpine', crowd: 'Medium', rating: 'Spring Transition ⭐️⭐️⭐️' },
      { month: 'Apr', temp: '5°C / 14°C', rain: '80mm', snow: 'No', crowd: 'Low', rating: 'Off-season Quiet ⭐️⭐️' },
      { month: 'May', temp: '9°C / 18°C', rain: '100mm', snow: 'No', crowd: 'Medium', rating: 'Spring Hiking ⭐️⭐️⭐️⭐️' },
      { month: 'Jun', temp: '13°C / 22°C', rain: '120mm', snow: 'No', crowd: 'High', rating: 'Summer Peak ⭐️⭐️⭐️⭐️⭐️' },
      { month: 'Jul', temp: '15°C / 25°C', rain: '115mm', snow: 'No', crowd: 'High', rating: 'Summer Peak ⭐️⭐️⭐️⭐️⭐️' },
      { month: 'Aug', temp: '15°C / 24°C', rain: '110mm', snow: 'No', crowd: 'High', rating: 'Summer Peak ⭐️⭐️⭐️⭐️⭐️' },
      { month: 'Sep', temp: '11°C / 20°C', rain: '90mm', snow: 'No', crowd: 'Medium', rating: 'Autumn Gold ⭐️⭐️⭐️⭐️⭐️' },
      { month: 'Oct', temp: '7°C / 14°C', rain: '80mm', snow: 'No', crowd: 'Medium', rating: 'Autumn Gold ⭐️⭐️⭐️⭐️' },
      { month: 'Nov', temp: '3°C / 8°C', rain: '75mm', snow: 'No', crowd: 'Low', rating: 'Cold/Foggy Quiet ⭐️' },
      { month: 'Dec', temp: '0°C / 4°C', rain: '70mm', snow: 'Yes', crowd: 'High', rating: 'Christmas Lights ⭐️⭐️⭐️⭐️' }
    ],
    dining: {
      avgCost: 'Street Food: $15 - $25 | Mid-Range: $35 - $60 | Fine Dining: $120+',
      streetFood: 'Cervelas (grilled sausages) at local stands, hot roasted chestnuts (Marroni) in autumn, and cheese-covered pretzels.',
      dietary: {
        halal: 'Limited. Found in major cities; check for Turkish/Arab dining spots. Alpine regions have very few options.',
        veg: 'Excellent. Switzerland is home to the world\'s oldest vegetarian restaurant (Hiltl in Zurich). Almost all venues offer vegetarian options.',
        vegan: 'Very Good. Supermarkets like Coop and Migros carry extensive vegan product lines, and city cafes are highly vegan-friendly.'
      },
      restaurantTip: 'Service charge is legally included in the menu price. Tipping is not required, but rounding up to the nearest 5 or 10 CHF is appreciated for great service.',
      safetyTip: 'Tap water is 100% pure alpine mineral water. You can drink safely from any sink or public fountain unless marked "Kein Trinkwasser".'
    },
    culture: {
      greetings: 'A polite, firm handshake with eye contact. In social circles, three light cheek kisses (right-left-right) are standard.',
      tipping: 'Not expected or necessary. Rounding up bills is a simple gesture of gratitude.',
      dressCode: 'Neat, casual, and functional. Activewear is accepted in mountain towns, but smart-casual is preferred in city restaurants.',
      publicBehavior: 'Keep speaking voices low in public transport. Sundays are strict rest days: avoid noisy activities like vacuuming or lawn-mowing.',
      religion: 'Respect church silence. Remove hats when entering historic cathedrals.',
      photography: 'Allowed everywhere. Respect privacy and ask before photographing local farmers or alpine children.',
      laws: 'Strict littering and recycling regulations. Throwing trash in the wrong bin can result in local municipal fines.',
      avoid: [
        'Being loud or noisy in public trains or buses.',
        'Arriving late (punctuality is highly respected).',
        'Littering or mixing up paper/pet-bottle recycling bins.'
      ],
      etiquetteTips: 'Always say a friendly greeting like "Grüezi" (German), "Bonjour" (French), or "Buongiorno" (Italian) when entering local boutique shops.'
    },
    connectivity: {
      speed: '165 Mbps (Download)',
      simProviders: 'Swisscom, Sunrise, Salt',
      esim: 'Excellent. Widely supported by Airalo, Holafly, and local provider apps.',
      wifi: 'Highly Available. Free public WiFi at all train stations (SBB-FREE) and city cafes.',
      coverage: '99% nationwide coverage, including deep mountain tunnels and cable car routes.',
      apps: 'SBB Mobile (essential for train tickets/timelines), MeteoSwiss (hyper-local alpine weather forecasts), Google Maps.',
      payment: 'Nearly cashless. Credit cards, debit cards, and mobile payments (Apple Pay, Twint) are accepted everywhere, even on mountaintops.'
    },
    readiness: {
      safety: 9.6,
      affordability: 2.1,
      accessibility: 9.8,
      family: 9.5,
      solo: 9.4
    },
    checklist: [
      { label: 'Passport ready (3+ months validity)', checked: true },
      { label: 'Schengen travel insurance secured', checked: false },
      { label: 'Swiss Travel Pass purchased', checked: false },
      { label: 'Offline map & SBB app installed', checked: false }
    ],
    insights: {
      whyLove: 'Breathtaking, postcard-perfect alpine scenery that looks exactly like the photos, paired with public transit that runs like clockwork.',
      mistakes: 'Buying individual train tickets instead of getting a Swiss Travel Pass or Half-Fare Card, which can double your transit expenses.',
      hiddenGems: 'Valle Verzasca in Ticino: a crystal-clear turquoise river running under a double-arched Roman bridge.',
      secrets: 'Most Coop and Migros supermarkets have restaurant buffets where you can eat healthy, local food for a third of standard restaurant prices.'
    }
  },
  japan: {
    safety: {
      score: '9.4',
      solo: 'Exceptionally Safe. Solo travelers can walk alone at night in almost any neighborhood.',
      family: 'Excellent. Incredibly clean public spaces, stroller-friendly subways, and kids amenities.',
      women: 'Very safe. Japan has ladies-only train carriages during rush hours to prevent crowding harassment.',
      scams: 'Low risk. Beware of street promoters in Tokyo\'s Kabukicho promising cheap drinks (bar-charging scams).'
    },
    visa: {
      status: 'Visa-Free Entry (68 countries - 90 Days)',
      processing: '5-10 Working Days (if visa is required)',
      requirements: [
        'Valid passport with at least 6 months validity',
        'Confirmed return flight ticket',
        'Completed disembarkation card (Visit Japan Web QR recommended)'
      ]
    },
    basics: {
      plug: 'Type A & B (flat 2-pin, ungrounded), 100V, 50/60Hz',
      emergency: 'Police: 110 | Ambulance & Fire: 119',
      timezone: 'JST (UTC+9)'
    },
    seasons: {
      peak: 'late March to mid-April (Sakura blooms) & November (Autumn leaves)',
      shoulder: 'May (Post-Golden Week) & September to October (Mild fall weather)',
      budget: 'January to February (Winter cold, great for skiing) & June to July (Rainy season)',
      timeline: ['budget', 'budget', 'peak', 'shoulder', 'shoulder', 'budget', 'budget', 'shoulder', 'shoulder', 'peak', 'peak', 'budget']
    },
    destinations: [
      {
        name: 'Tokyo',
        category: 'Cities',
        desc: 'The world\'s most populous metropolitan area, blending neon skyscrapers with quiet wooden shrines.',
        stay: '4-5 Days',
        why: 'Shibuya Crossing, culinary sushi markets, themed cafes, and anime shopping in Akihabara.'
      },
      {
        name: 'Kyoto',
        category: 'Historical Sites',
        desc: 'The ancient imperial capital, home to thousands of classical Buddhist temples and geisha houses.',
        stay: '2-3 Days',
        why: 'Fushimi Inari golden shrines, Kinkaku-ji golden pavilion, and Arashiyama bamboo trails.'
      },
      {
        name: 'Osaka',
        category: 'Cities',
        desc: 'Japan\'s kitchen, famous for its street food, neon-lit canals, and friendly, outgoing merchants.',
        stay: '2 Days',
        why: 'Takoyaki and okonomiyaki dining at Dotonbori, Universal Studios, and Osaka Castle.'
      },
      {
        name: 'Nara',
        category: 'Historical Sites',
        desc: 'A historic sanctuary famous for its giant bronze Buddha and hundreds of free-roaming, polite deer.',
        stay: '1 Day',
        why: 'Feeding deer Shika-senbei crackers, visiting Todai-ji wooden temple, and peaceful forest walks.'
      },
      {
        name: 'Mount Fuji',
        category: 'Mountains',
        desc: 'The sacred active volcano and national symbol, surrounded by scenic lakes and resorts.',
        stay: '1-2 Days',
        why: 'Relaxing in hot spring ryokans (onsen), lake cruising in Hakone, and mountain hiking trails.'
      }
    ],
    attractions: [
      {
        name: 'Fushimi Inari Shrine',
        fee: 'Free',
        duration: '2-3 Hours',
        season: 'Year-round (Best at sunset)',
        rating: '4.9',
        tip: 'Walk past the first dense cluster of gates where most tourists take photos. The path thins out and becomes incredibly peaceful as you climb higher.'
      },
      {
        name: 'Kinkaku-ji (Golden Pavilion)',
        fee: '$4 USD',
        duration: '1-2 Hours',
        season: 'Autumn / Winter',
        rating: '4.8',
        tip: 'Arrive at opening time (9:00 AM) or just before closing. The morning light makes the gold leaf coating glow beautifully against the mirror pond.'
      },
      {
        name: 'Shibuya Crossing & Hachiko Statue',
        fee: 'Free',
        duration: '1 Hour',
        season: 'Year-round',
        rating: '4.7',
        tip: 'Get a coffee at the second-floor Starbucks in the Q-Front building to overlook the scramble crossing, or visit the rooftop observatory.'
      },
      {
        name: 'Todai-ji Temple (Nara)',
        fee: '$5 USD',
        duration: '2 Hours',
        season: 'Spring / Autumn',
        rating: '4.8',
        tip: 'Look for the wooden pillar in the back of the Great Buddha Hall with a hole matching the size of the Buddha\'s nostril. Crawling through it is said to bring good luck.'
      }
    ],
    budget: {
      budgetDaily: '55 - 85',
      midRangeDaily: '120 - 200',
      luxuryDaily: '450+',
      snapshot: {
        hotel: '80 - 150',
        food: '15 - 35',
        transport: '10 - 25',
        attraction: '5 - 20'
      }
    },
    transport: {
      train: { cost: '$$$', conv: '4.9', rec: 'Highly Recommended. Shinkansen (Bullet Trains) connect major cities, and urban subways are incredibly precise.' },
      bus: { cost: '$$', conv: '4.2', rec: 'Recommended. Highway night buses are the cheapest way to travel between Tokyo and Kyoto.' },
      metro: { cost: '$$', conv: '4.8', rec: 'Highly Recommended. The Tokyo and Osaka subway grids are complex but run like clockwork. Get an IC Card.' },
      rideshare: { cost: '$$$$', conv: '3.0', rec: 'Optional. Uber is available but mostly summons regular, expensive local taxis.' },
      carRental: { cost: '$$$', conv: '3.5', rec: 'Not Recommended. Only useful for rural areas like Hokkaido or Okinawa. Tolls and parking are very expensive.' },
      flights: { cost: '$$$', conv: '4.0', rec: 'Recommended. Low-cost domestic carriers (Peach, Jetstar) are great for long distances like Tokyo to Sapporo.' }
    },
    weather: [
      { month: 'Jan', temp: '2°C / 10°C', rain: '45mm', snow: 'Hokkaido', crowd: 'Low', rating: 'Winter Skiing ⭐️⭐️⭐️' },
      { month: 'Feb', temp: '2°C / 10°C', rain: '50mm', snow: 'Hokkaido', crowd: 'Low', rating: 'Winter Skiing ⭐️⭐️⭐️' },
      { month: 'Mar', temp: '5°C / 13°C', rain: '95mm', snow: 'No', crowd: 'High', rating: 'Cherry Blossoms ⭐️⭐️⭐️⭐️⭐️' },
      { month: 'Apr', temp: '10°C / 19°C', rain: '110mm', snow: 'No', crowd: 'High', rating: 'Cherry Blossoms ⭐️⭐️⭐️⭐️⭐️' },
      { month: 'May', temp: '15°C / 23°C', rain: '125mm', snow: 'No', crowd: 'Medium', rating: 'Mild Spring ⭐️⭐️⭐️⭐️' },
      { month: 'Jun', temp: '19°C / 26°C', rain: '165mm', snow: 'No', crowd: 'Low', rating: 'Rainy Season ⭐️⭐️' },
      { month: 'Jul', temp: '23°C / 30°C', rain: '130mm', snow: 'No', crowd: 'Medium', rating: 'Humid/Festivals ⭐️⭐️⭐️' },
      { month: 'Aug', temp: '24°C / 31°C', rain: '110mm', snow: 'No', crowd: 'Medium', rating: 'Humid/Festivals ⭐️⭐️⭐️' },
      { month: 'Sep', temp: '20°C / 27°C', rain: '170mm', snow: 'No', crowd: 'Low', rating: 'Typhoon Risk ⭐️⭐️' },
      { month: 'Oct', temp: '14°C / 22°C', rain: '110mm', snow: 'No', crowd: 'Medium', rating: 'Mild Fall ⭐️⭐️⭐️⭐️⭐️' },
      { month: 'Nov', temp: '9°C / 17°C', rain: '65mm', snow: 'No', crowd: 'High', rating: 'Autumn Foliage ⭐️⭐️⭐️⭐️⭐️' },
      { month: 'Dec', temp: '4°C / 12°C', rain: '45mm', snow: 'Hokkaido', crowd: 'Medium', rating: 'Illuminations ⭐️⭐️⭐️' }
    ],
    dining: {
      avgCost: 'Street Food: $5 - $10 | Mid-Range: $12 - $25 | Fine Dining: $80+',
      streetFood: 'Takoyaki (octopus balls), Yakitori (grilled skewers), Taiyaki (fish-shaped sweet bean cakes), and Kushikatsu.',
      dietary: {
        halal: 'Limited. Rapidly growing in Tokyo/Osaka; look for certified Halal ramen/kebab shops. Use apps to verify.',
        veg: 'Challenging. Dashi (fish broth) is used in almost all savory sauces. Seek out Buddhist temple food (Shojin Ryori) or specialized vegan venues.',
        vegan: 'Challenging. Traditional meals rely heavily on fish flakes. Always explain "no dashi" or use vegan translation cards.'
      },
      restaurantTip: 'Never tip. Leaving money behind will confuse staff, and they will run after you to return it. Pay at the front counter instead of the table.',
      safetyTip: 'Tap water is completely safe and clean to drink nationwide.'
    },
    culture: {
      greetings: 'Deep, polite bow. The depth of the bow indicates the level of respect. Handshakes are common for foreigners.',
      tipping: 'Strictly forbidden. It is considered disrespectful to leave tip money.',
      dressCode: 'Conservative and modest. Avoid revealing tops or short skirts, and always wear clean socks (you will take off shoes often).',
      publicBehavior: 'Keep phone calls off trains; speak in quiet whispers. Avoid eating or drinking while walking (sit down at vending machines).',
      religion: 'Quiet respect at shrines (Shinto) and temples (Buddhist). Bow twice, clap twice, and bow once at Shinto shrines.',
      photography: 'Allowed, but look for "no photo" signs inside temple halls. Never photograph Geishas without permission.',
      laws: 'Strict anti-drug laws. Even trace amounts of prescription medications like Adderall are illegal to import without permission.',
      avoid: [
        'Eating or drinking while walking down the street.',
        'Speaking loudly on subways or buses.',
        'Leaving chopsticks standing upright in a bowl of rice (represents funerals).'
      ],
      etiquetteTips: 'Always use both hands when presenting or receiving business cards, tickets, or money.'
    },
    connectivity: {
      speed: '115 Mbps (Download)',
      simProviders: 'Docomo, SoftBank, au',
      esim: 'Highly Available. Airalo, Ubigi, and Holafly work seamlessly on local networks.',
      wifi: 'Moderate. Free WiFi is available in convenience stores (7-Eleven, Lawson) and cafes, but requires sign-ups.',
      coverage: '99% nationwide coverage, including subways and bullet trains.',
      apps: 'Google Maps (highly accurate for subway routes), Google Translate, Japan Travel (by NAVITIME).',
      payment: 'Transitioning to digital. Suica/Pasmo IC cards, PayPay, and credit cards are widely used, but carry cash for temple entry and local ramen vending ticket machines.'
    },
    readiness: {
      safety: 9.4,
      affordability: 7.2,
      accessibility: 9.6,
      family: 9.0,
      solo: 9.8
    },
    checklist: [
      { label: 'Passport ready (6 months validity)', checked: true },
      { label: 'Visit Japan Web QR code generated', checked: false },
      { label: 'Suica/Pasmo IC card added to Apple Wallet', checked: false },
      { label: 'Japan Rail Pass purchased (if needed)', checked: false }
    ],
    insights: {
      whyLove: 'Incredible hospitality (Omotenashi), absolute safety, and a fascinating culture where ancient shrines sit right beside hyper-modern skyscrapers.',
      mistakes: 'Buying the nationwide JR Pass without calculating if it is cheaper than individual tickets, especially after the major 2023 price hike.',
      hiddenGems: 'Iya Valley in Shikoku: an isolated mountain valley featuring suspension vine bridges and historic thatch-roof villages.',
      secrets: 'Convenience stores (Conbini) like 7-Eleven, Lawson, and FamilyMart serve gourmet, fresh food (Onigiri, bento boxes, hot fried chicken) for under $5 USD.'
    }
  },
  france: {
    safety: {
      score: '8.4',
      solo: 'Very Safe. Excellent public transit and solo traveler amenities across all regions.',
      family: 'Great. Kid-friendly parks, museums, and pedestrian river walkways.',
      women: 'Safe. Standard urban awareness recommended in nighttime metro stations.',
      scams: 'Low-to-medium risk. Watch for pickpockets in crowded tourist spots like Eiffel Tower or Sacré-Cœur.'
    },
    visa: {
      status: 'Schengen Visa-Free / Schengen Area',
      processing: '15 Days (if visa is required)',
      requirements: [
        'Passport valid for at least 3 months beyond departure date',
        'Proof of financial means',
        'Schengen Travel Insurance policy'
      ]
    },
    basics: {
      plug: 'Type C / E, 230V, 50Hz',
      emergency: 'Police: 17 | Ambulance: 15 | General European Emergency: 112',
      timezone: 'CET (UTC+1) / CEST (UTC+2)'
    },
    seasons: {
      peak: 'June to August (Summer & Riviera coast) & December (Paris Christmas markets)',
      shoulder: 'April to May (Spring blooms) & September to October (Autumn wine harvests)',
      budget: 'November & January to February (Winter quiet, lower hotel rates)',
      timeline: ['shoulder', 'shoulder', 'peak', 'shoulder', 'shoulder', 'peak', 'peak', 'peak', 'shoulder', 'shoulder', 'budget', 'peak']
    },
    destinations: [
      {
        name: 'Paris',
        category: 'Cities',
        desc: 'The City of Light, world-renowned for art, gastronomy, fashion, and iconic monuments.',
        stay: '4-5 Days',
        why: 'Eiffel Tower, Louvre Museum, Notre-Dame, Seine river cruises, and sidewalk bistro dining.'
      },
      {
        name: 'Nice',
        category: 'Beaches',
        desc: 'The glamorous Côte d\'Azur, featuring pebble beaches, azure waters, and seaside promenades.',
        stay: '3-4 Days',
        why: 'Promenade des Anglais, day trips to Monaco and Cannes, and coastal Mediterranean views.'
      },
      {
        name: 'Lyon',
        category: 'Culture & Food',
        desc: 'The culinary capital of France, famous for historic traboules passages and bouchon dining.',
        stay: '2-3 Days',
        why: 'Basilique Notre Dame de Fourvière, UNESCO Old Lyon streets, and gourmet dining.'
      },
      {
        name: 'Marseille',
        category: 'Coastal Port',
        desc: 'France\'s oldest city and vibrant Mediterranean port, surrounded by dramatic limestone calanques.',
        stay: '2-3 Days',
        why: 'Vieux-Port harbor, Calanques National Park hiking, and fresh bouillabaisse seafood.'
      },
      {
        name: 'Strasbourg',
        category: 'Historical Sites',
        desc: 'The capital of Alsace, blending French and German architectural heritage along canal waterways.',
        stay: '2 Days',
        why: 'Petite France half-timbered houses, Strasbourg Cathedral, and famous Christmas markets.'
      }
    ],
    attractions: [
      {
        name: 'Eiffel Tower',
        fee: '$18 - $28 USD',
        duration: '2-3 Hours',
        season: 'Year-round (Sunset peak)',
        rating: '4.9',
        tip: 'Book summit elevator tickets online 2 months in advance. Alternatively, take the stairs to the 2nd floor for shorter lines and panoramic photo angles.'
      },
      {
        name: 'Louvre Museum',
        fee: '$17 USD',
        duration: 'Half Day',
        season: 'Year-round',
        rating: '4.9',
        tip: 'Enter through the Carrousel du Louvre shopping mall entrance rather than the main glass pyramid to bypass long security queues.'
      },
      {
        name: 'Palace of Versailles',
        fee: '$22 USD',
        duration: 'Full Day',
        season: 'Spring to Autumn',
        rating: '4.8',
        tip: 'Reserve a morning timed entry slot. After exploring the Hall of Mirrors, rent a bicycle or golf cart to explore the vast Grand Canal and Trianon estates.'
      },
      {
        name: 'Mont Saint-Michel',
        fee: 'Free (Abbey entry: $13 USD)',
        duration: 'Full Day',
        season: 'May to October',
        rating: '4.9',
        tip: 'Check tide schedules. During super high tides, the island abbey is surrounded entirely by sea water, creating an unforgettable magical view.'
      },
      {
        name: 'Musée d\'Orsay',
        fee: '$16 USD',
        duration: '2-3 Hours',
        season: 'Year-round',
        rating: '4.8',
        tip: 'Located inside a majestic Beaux-Arts railway station, home to masterworks by Monet, Van Gogh, and Degas. Take a photo behind the giant station clock face.'
      }
    ],
    budget: {
      budgetDaily: '75 - 110',
      midRangeDaily: '160 - 280',
      luxuryDaily: '550+',
      snapshot: {
        hotel: '110 - 220',
        food: '25 - 50',
        transport: '15 - 35',
        attraction: '12 - 30'
      }
    },
    transport: {
      train: { cost: '$$$', conv: '4.9', rec: 'Highly Recommended. The TGV high-speed train connects Paris to Marseille in under 3 hours.' },
      bus: { cost: '$$', conv: '4.2', rec: 'Recommended. FlixBus and BlaBlaCar Bus offer cheap regional routes.' },
      metro: { cost: '$$', conv: '4.8', rec: 'Highly Recommended. Paris Métro and RER lines cover every quarter with frequent train service.' },
      rideshare: { cost: '$$$', conv: '4.0', rec: 'Available. Uber and Bolt operate in major cities like Paris, Lyon, and Nice.' },
      carRental: { cost: '$$$', conv: '4.0', rec: 'Optional. Excellent for exploring the Provence lavender fields or Loire Valley châteaux.' },
      flights: { cost: '$$$', conv: '3.5', rec: 'Optional. TGV trains are usually faster and more convenient than domestic airport flights.' }
    },
    weather: [
      { month: 'Jan', temp: '3°C / 8°C', rain: '50mm', snow: 'Rare', crowd: 'Low', rating: 'Winter Season ⭐️⭐️' },
      { month: 'Feb', temp: '3°C / 9°C', rain: '45mm', snow: 'Rare', crowd: 'Low', rating: 'Winter Season ⭐️⭐️' },
      { month: 'Mar', temp: '6°C / 13°C', rain: '50mm', snow: 'No', crowd: 'Medium', rating: 'Spring Bloom ⭐️⭐️⭐️' },
      { month: 'Apr', temp: '8°C / 16°C', rain: '45mm', snow: 'No', crowd: 'Medium', rating: 'Spring Bloom ⭐️⭐️⭐️⭐️' },
      { month: 'May', temp: '12°C / 20°C', rain: '60mm', snow: 'No', crowd: 'High', rating: 'Spring Peak ⭐️⭐️⭐️⭐️⭐️' },
      { month: 'Jun', temp: '15°C / 24°C', rain: '50mm', snow: 'No', crowd: 'High', rating: 'Summer Peak ⭐️⭐️⭐️⭐️⭐️' },
      { month: 'Jul', temp: '17°C / 26°C', rain: '55mm', snow: 'No', crowd: 'High', rating: 'Summer Peak ⭐️⭐️⭐️⭐️⭐️' },
      { month: 'Aug', temp: '17°C / 26°C', rain: '45mm', snow: 'No', crowd: 'High', rating: 'Summer Peak ⭐️⭐️⭐️⭐️⭐️' },
      { month: 'Sep', temp: '13°C / 22°C', rain: '50mm', snow: 'No', crowd: 'Medium', rating: 'Autumn Harvest ⭐️⭐️⭐️⭐️⭐️' },
      { month: 'Oct', temp: '10°C / 17°C', rain: '60mm', snow: 'No', crowd: 'Medium', rating: 'Autumn Foliage ⭐️⭐️⭐️⭐️' },
      { month: 'Nov', temp: '6°C / 11°C', rain: '60mm', snow: 'No', crowd: 'Low', rating: 'Pre-winter Quiet ⭐️⭐️' },
      { month: 'Dec', temp: '4°C / 8°C', rain: '60mm', snow: 'Occasional', crowd: 'High', rating: 'Christmas Lights ⭐️⭐️⭐️⭐️' }
    ],
    dining: {
      avgCost: 'Street Food / Bakery: $6 - $12 | Mid-Range Bistro: $22 - $45 | Fine Dining: $90+',
      streetFood: 'Fresh butter croissants, savory crêpes (galettes), baguette sandwiches (jambon-beurre), and macarons.',
      dietary: {
        halal: 'Good. Extensively available in Paris, Marseille, and major urban suburbs.',
        veg: 'Very Good. Modern cafes and bistros offer creative vegetarian options.',
        vegan: 'Good. Rapidly growing network of plant-based bakeries and vegan restaurants in Paris.'
      },
      restaurantTip: 'Service (15%) is legally included in the menu prices. Leaving 1-2 Euros on the table for polite service is common.',
      safetyTip: 'Tap water (carafe d\'eau) is 100% safe to drink everywhere in France and free in restaurants.'
    },
    culture: {
      greetings: 'Always begin interactions with "Bonjour" (during daytime) or "Bonsoir" (in the evening).',
      tipping: 'Not mandatory. Small change left on the table is appreciated.',
      dressCode: 'Smart casual. French city dwellers dress neatly; avoid overly casual loungewear when dining out.',
      publicBehavior: 'Keep voices moderate in metros and cafes. Speak softly on train carriages.',
      religion: 'Respect quiet in historical cathedrals.',
      photography: 'Allowed everywhere. Respect privacy of locals.',
      laws: 'Strict rules against single-use plastics and littering.',
      avoid: [
        'Starting conversations in English without first saying "Bonjour".',
        'Speaking loudly on metro trains.',
        'Leaving bags unattended in train stations.'
      ],
      etiquetteTips: 'Saying "Bonjour Madame/Monsieur" when stepping into any bakery or boutique opens up warm local hospitality.'
    },
    connectivity: {
      speed: '120 Mbps (Download)',
      simProviders: 'Orange, SFR, Bouygues, Free Mobile',
      esim: 'Excellent. Airalo, Holafly, and Bouygues eSIM work seamlessly.',
      wifi: 'Highly Available. Free public WiFi in Paris parks (Paris Wi-Fi) and major stations.',
      coverage: '99% nationwide coverage across cities, TGV train tracks, and coastal beaches.',
      apps: 'Citymapper (best for Paris Metro), SNCF Connect (TGV trains), Google Maps, Uber.',
      payment: 'Nearly cashless. Contactless cards and Apple Pay / Google Pay work everywhere.'
    },
    readiness: {
      safety: 8.4,
      affordability: 6.5,
      accessibility: 9.5,
      family: 8.8,
      solo: 9.0
    },
    checklist: [
      { label: 'Passport ready (3+ months validity)', checked: true },
      { label: 'Schengen travel insurance active', checked: false },
      { label: 'SNCF train app & tickets downloaded', checked: false },
      { label: 'Navigo / Metro pass loaded', checked: false }
    ],
    insights: {
      whyLove: 'Incomparable blend of art, history, world-class bakeries, and romantic landscapes.',
      mistakes: 'Rushing to see too many sights in a single day instead of savoring a relaxed café moment.',
      hiddenGems: 'Annecy: a picturesque alpine town in southeastern France with crystal-clear turquoise canals.',
      secrets: 'Order "une carafe d\'eau" at any restaurant for free, delicious tap water instead of paying for bottled water.'
    }
  },
  brazil: {
    safety: {
      score: '6.2',
      solo: 'Moderate. Stick to tourist paths, avoid showing jewelry or expensive phones, and use Uber at night.',
      family: 'Good. Locals are warm and welcoming to children, but beach crowds can be overwhelming.',
      women: 'Moderate. Solo female travelers should avoid empty streets at night and use trusted transport.',
      scams: 'Medium risk. Double-check taxi meters or card machines before tapping, and keep an eye on credit card transactions.'
    },
    visa: {
      status: 'Visa-Free / eVisa Available (depends on country)',
      processing: '5-10 Days (for eVisa)',
      requirements: [
        'Valid passport with at least 6 months validity',
        'Proof of financial sufficiency (recent bank statements)',
        'Return flight reservation',
        'Hotel booking confirmation'
      ]
    },
    basics: {
      plug: 'Type N (grounded 3-pin, fits Type C), 127V/220V, 60Hz',
      emergency: 'Police: 190 | Ambulance: 192 | Fire: 193',
      timezone: 'BRT (UTC-3) / AMT (UTC-4)'
    },
    seasons: {
      peak: 'December to March (Summer & Carnival) & July (Winter holidays)',
      shoulder: 'April to June (Mild fall) & August to November (Spring weather)',
      budget: 'May to June (Rainy season in Northeast) & October to November (Pre-summer)',
      timeline: ['peak', 'peak', 'peak', 'shoulder', 'shoulder', 'budget', 'budget', 'shoulder', 'shoulder', 'shoulder', 'budget', 'peak']
    },
    destinations: [
      {
        name: 'Rio de Janeiro',
        category: 'Beaches',
        desc: 'The marvelous city, framed by dramatic mountains and famous Atlantic beaches.',
        stay: '3-4 Days',
        why: 'Christ the Redeemer, Sugarloaf Mountain cable car, Copacabana beaches, and Samba street parties.'
      },
      {
        name: 'São Paulo',
        category: 'Cities',
        desc: 'A massive metropolis serving as the financial and culinary powerhouse of South America.',
        stay: '2-3 Days',
        why: 'Art museums, gourmet dining, trendy nightlife, and the Liberdade Japanese quarter.'
      },
      {
        name: 'Manaus',
        category: 'National Parks',
        desc: 'The jungle capital situated deep in the Amazon basin at the meeting of the rivers.',
        stay: '3 Days',
        why: 'Amazon rainforest expeditions, river cruises, and the historic European-style Opera House.'
      },
      {
        name: 'Salvador',
        category: 'Historical Sites',
        desc: 'The cultural center of Afro-Brazilian heritage, featuring colorful colonial squares.',
        stay: '2 Days',
        why: 'Pelourinho historic architecture, Capoeira street circles, and traditional Bahian cuisine.'
      },
      {
        name: 'Iguaçu Falls',
        category: 'National Parks',
        desc: 'A spectacular natural wonder featuring 275 cascading waterfalls on the border with Argentina.',
        stay: '2 Days',
        why: 'Walking the falls trail, boat rides under the cascades, and bird park safaris.'
      }
    ],
    attractions: [
      {
        name: 'Christ the Redeemer (Corcovado)',
        fee: '$15 - $25 USD (Includes train/van)',
        duration: '2-3 Hours',
        season: 'Year-round (Clear days)',
        rating: '4.8',
        tip: 'Book the cogwheel train tickets online in advance. Sit on the right side of the train when going up for the best views through the forest.'
      },
      {
        name: 'Sugarloaf Mountain (Pão de Açúcar)',
        fee: '$25 USD (Cable car)',
        duration: '3 Hours',
        season: 'Year-round (Best at sunset)',
        rating: '4.9',
        tip: 'Arrive 1.5 hours before sunset. Watch the lights of Copacabana and Guanabara Bay turn on from the summit summit.'
      },
      {
        name: 'Iguaçu Falls National Park',
        fee: '$18 USD',
        duration: '1 Full Day',
        season: 'December to February (High water flow)',
        rating: '4.9',
        tip: 'Wear a plastic poncho. The walking path to the Devil\'s Throat platform gets completely sprayed, but the views are incredible.'
      },
      {
        name: 'Historic Pelourinho (Salvador)',
        fee: 'Free',
        duration: 'Half Day',
        season: 'Year-round',
        rating: '4.6',
        tip: 'Hire an official local guide wearing a badge. They will navigate the historic streets, explain the Afro-Brazilian history, and keep you safe from pushy street vendors.'
      }
    ],
    budget: {
      budgetDaily: '40 - 65',
      midRangeDaily: '90 - 150',
      luxuryDaily: '400+',
      snapshot: {
        hotel: '50 - 100',
        food: '15 - 30',
        transport: '8 - 18',
        attraction: '10 - 25'
      }
    },
    transport: {
      train: { cost: '$$', conv: '1.5', rec: 'Not Recommended. There are no passenger train networks connecting major cities, only short tourist steam trains.' },
      bus: { cost: '$$', conv: '4.0', rec: 'Recommended. Interstate buses (Leito/sleeper buses) are comfortable, clean, and cheap for long-distance travel.' },
      metro: { cost: '$', conv: '4.5', rec: 'Highly Recommended. The subway networks in Rio and São Paulo are clean, safe, and highly efficient.' },
      rideshare: { cost: '$$', conv: '4.8', rec: 'Highly Recommended. Uber and 99 are cheap, safe, and widely available in all major cities.' },
      carRental: { cost: '$$$', conv: '3.5', rec: 'Optional. Good for coastal routes like Rio to Búzios, but city traffic is chaotic and highway conditions vary.' },
      flights: { cost: '$$$', conv: '4.5', rec: 'Highly Recommended. Domestic flights (LATAM, GOL, Azul) are essential for covering long distances like Rio to Manaus.' }
    },
    weather: [
      { month: 'Jan', temp: '23°C / 30°C', rain: '140mm', snow: 'No', crowd: 'High', rating: 'Summer Peak ⭐️⭐️⭐️⭐️' },
      { month: 'Feb', temp: '23°C / 30°C', rain: '120mm', snow: 'No', crowd: 'High', rating: 'Carnival Peak ⭐️⭐️⭐️⭐️⭐️' },
      { month: 'Mar', temp: '22°C / 29°C', rain: '130mm', snow: 'No', crowd: 'High', rating: 'Summer End ⭐️⭐️⭐️⭐️' },
      { month: 'Apr', temp: '20°C / 27°C', rain: '95mm', snow: 'No', crowd: 'Medium', rating: 'Pleasant Autumn ⭐️⭐️⭐️⭐️' },
      { month: 'May', temp: '18°C / 25°C', rain: '75mm', snow: 'No', crowd: 'Low', rating: 'Mild Weather ⭐️⭐️⭐️' },
      { month: 'Jun', temp: '16°C / 24°C', rain: '55mm', snow: 'No', crowd: 'Low', rating: 'Mild Weather ⭐️⭐️⭐️' },
      { month: 'Jul', temp: '15°C / 24°C', rain: '50mm', snow: 'No', crowd: 'Medium', rating: 'Winter Break ⭐️⭐️⭐️' },
      { month: 'Aug', temp: '16°C / 25°C', rain: '45mm', snow: 'No', crowd: 'Low', rating: 'Dry / Warm ⭐️⭐️⭐️' },
      { month: 'Sep', temp: '18°C / 26°C', rain: '65mm', snow: 'No', crowd: 'Low', rating: 'Spring Transition ⭐️⭐️⭐️' },
      { month: 'Oct', temp: '19°C / 28°C', rain: '90mm', snow: 'No', crowd: 'Medium', rating: 'Warm Spring ⭐️⭐️⭐️' },
      { month: 'Nov', temp: '21°C / 29°C', rain: '110mm', snow: 'No', crowd: 'Medium', rating: 'Pre-summer Warm ⭐️⭐️⭐️⭐️' },
      { month: 'Dec', temp: '22°C / 30°C', rain: '130mm', snow: 'No', crowd: 'High', rating: 'Summer Peak ⭐️⭐️⭐️⭐️' }
    ],
    dining: {
      avgCost: 'Street Food: $3 - $6 | Mid-Range: $12 - $22 | Fine Dining: $60+',
      streetFood: 'Coxinha (chicken croquettes), Pastel (fried pastry pockets), Pão de Queijo, and fresh coconut water (Água de Coco) on the beach.',
      dietary: {
        halal: 'Very Limited. Only available in select Arab-owned restaurants in São Paulo or near mosque communities.',
        veg: 'Moderate. Barbecue (Churrascarias) are beef-heavy, but self-service buffet restaurants (Comida por quilo) offer massive salad/vegetable bars.',
        vegan: 'Moderate. City centers like São Paulo and Rio have trendy vegan cafes, but traditional restaurants rely heavily on pork and butter.'
      },
      restaurantTip: 'A 10% service charge is almost always included in the final bill. Additional tipping is not required, but leaving some coins is appreciated.',
      safetyTip: 'Avoid drinking tap water directly. Drink bottled or filtered water (almost all houses have filters).'
    },
    culture: {
      greetings: 'Warm and physical. Handshakes for men, and double-cheek kisses for women. Hugs are common among friends.',
      tipping: 'Factor in the 10% service charge on bills. Tipping taxi drivers is not necessary.',
      dressCode: 'Casual and beach-oriented. Beachgoers wear revealing swimwear, but entering shops or churches in bikinis is inappropriate.',
      publicBehavior: 'Avoid showing valuable items like phones or cameras on the street. Keep them in bags until needed.',
      religion: 'Respect church silence. Catholic services are standard; keep voices low.',
      photography: 'Allowed, but keep an eye on your surroundings when holding expensive cameras.',
      laws: 'Strict environmental preservation laws. Do not take native shells or plants out of national reserves.',
      avoid: [
        'Walking down empty streets or quiet beaches at night.',
        'Flashing expensive phones, jewelry, or cash in public.',
        'Accepting unsolicited help at ATM machines.'
      ],
      etiquetteTips: 'Say "Por favor" (please) and "Obrigado" (thank you for men) / "Obrigada" (thank you for women).'
    },
    connectivity: {
      speed: '48 Mbps (Download)',
      simProviders: 'Vivo, Claro, TIM',
      esim: 'Available. Supported by international providers like Airalo and Holafly.',
      wifi: 'Available. Free WiFi in shopping malls, airport lounges, and upscale cafes, but usually requires local phone registration.',
      coverage: 'Excellent in cities and coastal towns, but spotty or non-existent inside deep national park canyons and the Amazon basin.',
      apps: 'Uber (essential for safe city transport), WhatsApp (primary way to communicate with local hotels/guides), Google Maps.',
      payment: 'Digital-first. Credit cards and PIX (local instant mobile bank payments) are accepted everywhere, even by beach towel vendors. Carry a little cash for tips or emergency parking.'
    },
    readiness: {
      safety: 6.2,
      affordability: 7.8,
      accessibility: 8.0,
      family: 8.5,
      solo: 7.2
    },
    checklist: [
      { label: 'Passport ready (6 months validity)', checked: true },
      { label: 'eVisa secured (if applicable)', checked: false },
      { label: 'Yellow Fever vaccine certificate (jungle areas)', checked: false },
      { label: 'WhatsApp & Uber apps installed', checked: false }
    ],
    insights: {
      whyLove: 'The incredibly warm, friendly, and energetic locals, combined with dramatic natural wonders like Iguaçu Falls and beautiful beaches.',
      mistakes: 'Trying to travel to too many distant states (e.g. Rio, Amazon, and Iguaçu) in a single week without factoring in domestic flight durations.',
      hiddenGems: 'Lençóis Maranhenses: a vast desert of pure white sand dunes that fill with fresh turquoise rainwater lagoons between May and September.',
      secrets: 'Eat at "Restaurantes por Quilo" (pay-by-weight buffets). They serve fresh, high-quality meats, fish, salads, and sushi for a very cheap price.'
    }
  },
  south_africa: {
    safety: {
      score: '6.5',
      solo: 'Moderate. Avoid walking alone at night, stick to trusted tourist areas, and use Uber or guided tours.',
      family: 'Good. Excellent family-friendly resorts, beach pathways, and private safari lodges.',
      women: 'Moderate. Solo female travelers should take standard precautions, avoid hiking alone, and use pre-booked transport.',
      scams: 'Medium risk. Be careful when withdrawing cash at public ATMs; scammers may try to "help" or clone cards.'
    },
    visa: {
      status: 'Visa-Free (depends on country - 90 Days)',
      processing: '10-14 Days (for eVisa)',
      requirements: [
        'Valid passport with at least 2 blank pages and 30 days validity beyond departure',
        'Proof of financial means (bank statements)',
        'Return flight reservation',
        'Yellow Fever certificate (if traveling from endemic zone)'
      ]
    },
    basics: {
      plug: 'Type M (large 3-pin) & Type N/C, 230V, 50Hz',
      emergency: 'Police: 10111 | Ambulance: 10177',
      timezone: 'SAST (UTC+2)'
    },
    seasons: {
      peak: 'November to March (Summer & Cape beaches) & June to August (Best safari game viewing)',
      shoulder: 'April to May (Mild autumn) & September to October (Spring whale watching)',
      budget: 'May to August (Winter cold in interior, cheap flights and stays)',
      timeline: ['peak', 'peak', 'peak', 'shoulder', 'budget', 'peak', 'peak', 'peak', 'shoulder', 'shoulder', 'peak', 'peak']
    },
    destinations: [
      {
        name: 'Cape Town',
        category: 'Cities',
        desc: 'A spectacular coastal city nestled beneath Table Mountain, famous for beaches and winelands.',
        stay: '4-5 Days',
        why: 'Table Mountain cableway, Boulders penguin colony, Robben Island, and historic wine tastings.'
      },
      {
        name: 'Kruger National Park',
        category: 'National Parks',
        desc: 'One of Africa\'s largest game reserves, home to the Big Five (lion, leopard, rhino, elephant, buffalo).',
        stay: '3-4 Days',
        why: 'Open-vehicle sunrise game drives, staying in bush lodges, and seeing wild leopards and rhinos.'
      },
      {
        name: 'Johannesburg',
        category: 'Cities',
        desc: 'The city of gold, a high-energy urban center rich in history and contemporary art.',
        stay: '2 Days',
        why: 'Apartheid Museum, Soweto bicycle tours, and visiting local creative hubs like Maboneng.'
      },
      {
        name: 'The Garden Route',
        category: 'Nature',
        desc: 'A scenic stretch of the southeastern coast featuring ancient forests, lagoons, and dramatic cliffs.',
        stay: '4-5 Days',
        why: 'Road tripping along ocean roads, Tsitsikamma bridge walking, and Knysna lagoon cruises.'
      }
    ],
    attractions: [
      {
        name: 'Table Mountain Cableway',
        fee: '$22 USD (Return ticket)',
        duration: '3-4 Hours',
        season: 'October to March (Warm weather)',
        rating: '4.9',
        tip: 'Buy tickets online and check the weather webcam before going. Strong winds or "the table cloth" cloud cover will immediately shut down the cable car.'
      },
      {
        name: 'Kruger National Park Safari',
        fee: 'Daily conservation fee: $25 USD',
        duration: '2-4 Days',
        season: 'May to September (Dry winter season)',
        rating: '4.9',
        tip: 'Book a safari during the dry winter months. The lack of foliage and search for watering holes makes spotting lions and leopards much easier.'
      },
      {
        name: 'Boulders Penguin Colony',
        fee: '$10 USD',
        duration: '1.5 Hours',
        season: 'Year-round',
        rating: '4.8',
        tip: 'Go early in the morning. Not only are the penguins more active, but you will avoid the tour bus crowds on the narrow wooden walkways.'
      },
      {
        name: 'Robben Island Museum',
        fee: '$22 USD (Includes ferry)',
        duration: '3.5 Hours',
        season: 'September to April (Calmer sea conditions)',
        rating: '4.7',
        tip: 'Book tickets weeks in advance. The tours are led by former political prisoners, offering an intense and authentic history.'
      }
    ],
    budget: {
      budgetDaily: '45 - 75',
      midRangeDaily: '100 - 180',
      luxuryDaily: '450+',
      snapshot: {
        hotel: '60 - 120',
        food: '15 - 30',
        transport: '10 - 20',
        attraction: '8 - 25'
      }
    },
    transport: {
      train: { cost: '$$$', conv: '2.0', rec: 'Optional. The Gautrain connects Pretoria and Joburg safely, but other long-distance passenger trains are slow or inactive.' },
      bus: { cost: '$$', conv: '3.8', rec: 'Recommended. Baz Bus is a great hop-on hop-off backpacker bus service that runs along the Garden Route.' },
      metro: { cost: '$', conv: '1.5', rec: 'Not Recommended. Standard city buses/trams are limited. Stick to ridesharing.' },
      rideshare: { cost: '$$', conv: '4.8', rec: 'Highly Recommended. Uber and Bolt are cheap, safe, and widely available in major urban centers.' },
      carRental: { cost: '$$', conv: '4.7', rec: 'Highly Recommended. Self-driving is the best way to explore the Garden Route and Kruger. Road grids are excellent.' },
      flights: { cost: '$$$', conv: '4.5', rec: 'Recommended. Domestic carriers (Safair, Airlink) are efficient for covering distances like Joburg to Cape Town.' }
    },
    weather: [
      { month: 'Jan', temp: '16°C / 26°C', rain: '15mm', snow: 'No', crowd: 'High', rating: 'Summer Peak ⭐️⭐️⭐️⭐️' },
      { month: 'Feb', temp: '16°C / 27°C', rain: '15mm', snow: 'No', crowd: 'High', rating: 'Summer Peak ⭐️⭐️⭐️⭐️' },
      { month: 'Mar', temp: '14°C / 25°C', rain: '20mm', snow: 'No', crowd: 'Medium', rating: 'Warm Autumn ⭐️⭐️⭐️⭐️' },
      { month: 'Apr', temp: '12°C / 23°C', rain: '40mm', snow: 'No', crowd: 'Medium', rating: 'Pleasant Autumn ⭐️⭐️⭐️⭐️' },
      { month: 'May', temp: '9°C / 20°C', rain: '60mm', snow: 'No', crowd: 'Low', rating: 'Cool / Safaris ⭐️⭐️⭐️' },
      { month: 'Jun', temp: '8°C / 18°C', rain: '90mm', snow: 'Alpine', crowd: 'Low', rating: 'Cold Safaris ⭐️⭐️⭐️' },
      { month: 'Jul', temp: '7°C / 18°C', rain: '80mm', snow: 'Alpine', crowd: 'Medium', rating: 'Winter Peak ⭐️⭐️⭐️' },
      { month: 'Aug', temp: '8°C / 19°C', rain: '70mm', snow: 'No', crowd: 'Low', rating: 'Spring Flowers ⭐️⭐️⭐️⭐️' },
      { month: 'Sep', temp: '9°C / 20°C', rain: '40mm', snow: 'No', crowd: 'Low', rating: 'Whale Watching ⭐️⭐️⭐️⭐️' },
      { month: 'Oct', temp: '11°C / 22°C', rain: '30mm', snow: 'No', crowd: 'Medium', rating: 'Mild Spring ⭐️⭐️⭐️⭐️' },
      { month: 'Nov', temp: '13°C / 24°C', rain: '25mm', snow: 'No', crowd: 'Medium', rating: 'Warm Spring ⭐️⭐️⭐️⭐️' },
      { month: 'Dec', temp: '15°C / 25°C', rain: '15mm', snow: 'No', crowd: 'High', rating: 'Summer Peak ⭐️⭐️⭐️⭐️' }
    ],
    dining: {
      avgCost: 'Street Food: $4 - $8 | Mid-Range: $15 - $28 | Fine Dining: $70+',
      streetFood: 'Bunny Chow (mutton curry inside bread), Biltong (cured beef jerky), and Boerewors (grilled farm sausages) at local braais.',
      dietary: {
        halal: 'Very Good. Widely available in Cape Town (Bo-Kaap heritage) and Durban. Most restaurant menus mark Halal options.',
        veg: 'Very Good. Urban cafes and tourist restaurants offer extensive vegetarian salads, veggie burgers, and pasta options.',
        vegan: 'Good. Major cities like Cape Town and Johannesburg have excellent vegan specialty restaurants and organic markets.'
      },
      restaurantTip: 'A tip of 10% to 15% is standard in all seated restaurants. It is not always included on the bill, so double-check before paying.',
      safetyTip: 'Tap water is clean and completely safe to drink in major urban cities, though buying bottled water is recommended in rural villages.'
    },
    culture: {
      greetings: 'A friendly handshake with eye contact. Standard greetings are "Howzit" (casual slang), "Sanibona" (Zulu), or "Molo" (Xhosa).',
      tipping: 'Highly expected for waiters (10-15%), petrol attendants ($1-$2 USD), and car guards ($1 USD).',
      dressCode: 'Casual and outdoor-oriented. Neutral-colored clothing is recommended for safaris; smart-casual for city dining.',
      publicBehavior: 'Keep a close eye on personal items in public places. Do not walk alone in empty streets or hiking trails.',
      religion: 'Christian services are standard. Keep voices low in historic stone churches.',
      photography: 'Allowed, but ask locals before taking portraits, especially in township communities or rural villages.',
      laws: 'Strict anti-poaching laws. Do not take native flora, fauna, or seeds out of national reserves.',
      avoid: [
        'Walking alone on empty beaches or quiet hiking paths.',
        'Leaving bags or phones visible inside a parked rental car.',
        'Not leaving a small tip for local informal car guards.'
      ],
      etiquetteTips: 'Respect the local custom of hosting a "Braai" (barbecue) — it is a central social event. Bring drinks or side salads if invited.'
    },
    connectivity: {
      speed: '42 Mbps (Download)',
      simProviders: 'Vodacom, MTN, Telkom, Cell C',
      esim: 'Available. Supported by Airalo, Holafly, and local provider apps.',
      wifi: 'Highly Available. Free public WiFi in shopping malls, cafes, and major guest houses.',
      coverage: '95% nationwide coverage. Fast LTE in cities, but drops off in deep national park bush reserves.',
      apps: 'Uber (essential for safe city transport), WhatsApp, Google Maps, Bushradar (safari sightings).',
      payment: 'Cashless-first. Credit cards and contactless tap payments are accepted almost everywhere, but carry cash coins to tip car guards and petrol attendants.'
    },
    readiness: {
      safety: 6.5,
      affordability: 7.8,
      accessibility: 8.5,
      family: 9.0,
      solo: 7.5
    },
    checklist: [
      { label: 'Passport ready (6 months validity)', checked: true },
      { label: 'eVisa secured (if applicable)', checked: false },
      { label: 'Yellow Fever vaccine certificate (if needed)', checked: false },
      { label: 'Rental car & offline GPS booked', checked: false }
    ],
    insights: {
      whyLove: 'The incredible wildlife encounters, dramatic coastal drives like the Garden Route, and world-class wines at very affordable prices.',
      mistakes: 'Walking around downtown Joburg or Cape Town at night instead of using an Uber, which is cheap and much safer.',
      hiddenGems: 'Blyde River Canyon: one of the largest green canyons on Earth, featuring the dramatic Three Rondavels rock viewpoints.',
      secrets: 'Purchase a wild card (SANParks) if you plan to visit multiple national parks (Kruger, Table Mountain, Tsitsikamma) — it saves a lot on entry fees.'
    }
  },
  pakistan: {
    safety: {
      score: '7.2',
      solo: 'Good. Extremely welcoming local hospitality, but hire local guides for remote northern valleys.',
      family: 'Good. Safe in high-end areas, but transport can be crowded and chaotic.',
      women: 'Moderate. Solo female travelers should dress conservatively and avoid walking alone in quiet places at night.',
      scams: 'Medium risk. Double-check price quotes with taxi/auto drivers before boarding, and count your change.'
    },
    visa: {
      status: 'eVisa / Visa-on-Arrival (175+ countries)',
      processing: '2-5 Working Days (via online portal)',
      requirements: [
        'Valid passport with at least 6 months validity',
        'Sponsor letter or hotel booking confirmation',
        'Digital passport photo'
      ]
    },
    basics: {
      plug: 'Type C & D (fits Type C, round 3-pin), 230V, 50Hz',
      emergency: 'Police: 15 | Ambulance: 115',
      timezone: 'PKT (UTC+5)'
    },
    seasons: {
      peak: 'May to October (Northern areas) & October to March (Southern cities)',
      shoulder: 'April (Spring blooms) & September (Pre-autumn transitions)',
      budget: 'December to February (Winter cold in north, cheap hotels and flights)',
      timeline: ['budget', 'budget', 'shoulder', 'shoulder', 'peak', 'peak', 'peak', 'peak', 'peak', 'shoulder', 'budget', 'budget']
    },
    destinations: [
      {
        name: 'Lahore',
        category: 'Historical Sites',
        desc: 'The cultural heartbeat of Pakistan, featuring majestic Mughal architecture and rich street dining.',
        stay: '3 Days',
        why: 'Lahore Fort, Badshahi Mosque, Shalimar Gardens, and eating at the famous Food Street.'
      },
      {
        name: 'Hunza Valley',
        category: 'Mountains',
        desc: 'A stunning high-altitude alpine valley surrounded by K2-region snow peaks.',
        stay: '4-5 Days',
        why: 'Karimabad historic forts, Attabad turquoise lake boating, and spectacular views of Rakaposhi.'
      },
      {
        name: 'Islamabad',
        category: 'Cities',
        desc: 'The capital city, characterized by leafy, organized grids and Margalla Hill hikes.',
        stay: '2 Days',
        why: 'Faisal Mosque, hiking trails overlooking the city, and modern cafes.'
      },
      {
        name: 'Karachi',
        category: 'Cities',
        desc: 'The commercial megacity port on the Arabian Sea, famous for coastal dining.',
        stay: '2 Days',
        why: 'Burns Road food tours, Clifton beach sunsets, and historic colonial markets.'
      },
      {
        name: 'Skardu',
        category: 'Mountains',
        desc: 'The gateway to K2 and the Karakoram peaks, featuring cold deserts and alpine lakes.',
        stay: '4 Days',
        why: 'Katpana cold desert dunes, Shangrila Resort, and trekking into Deosai Plains.'
      }
    ],
    attractions: [
      {
        name: 'Badshahi Mosque & Lahore Fort',
        fee: '$5 USD (Combined)',
        duration: '3-4 Hours',
        season: 'October to March (Mild weather)',
        rating: '4.9',
        tip: 'Visit the mosque just before sunset. The red sandstone bricks glow beautifully under the evening lights, and you can capture stunning photos of the marble domes.'
      },
      {
        name: 'Attabad Lake (Hunza)',
        fee: 'Free (Boat rides $10)',
        duration: '2-3 Hours',
        season: 'May to October',
        rating: '4.8',
        tip: 'Hire a boat to cross the turquoise water. The lake was formed in 2010 due to a massive landslide, creating an incredible landscape against the gray cliffs.'
      },
      {
        name: 'Faisal Mosque (Islamabad)',
        fee: 'Free',
        duration: '1-2 Hours',
        season: 'Year-round',
        rating: '4.7',
        tip: 'Visit during the late afternoon. You will need to take off your shoes at the entrance, so wear slip-on shoes. The view of the Margalla hills behind the mosque is beautiful.'
      },
      {
        name: 'Deosai National Park (Skardu)',
        fee: '$10 USD (Conservation fee)',
        duration: '1 Full Day',
        season: 'July to September',
        rating: '4.9',
        tip: 'Hire a 4x4 Jeep from Skardu. The park sits at 4,114 meters and is covered in wildflowers during summer. Bring warm layers as weather can drop below freezing instantly.'
      }
    ],
    budget: {
      budgetDaily: '30 - 50',
      midRangeDaily: '70 - 120',
      luxuryDaily: '250+',
      snapshot: {
        hotel: '35 - 80',
        food: '10 - 20',
        transport: '8 - 15',
        attraction: '2 - 10'
      }
    },
    transport: {
      train: { cost: '$', conv: '3.0', rec: 'Optional. Pakistan Railways connects major cities (Green Line is recommended), but delays are common.' },
      bus: { cost: '$', conv: '4.5', rec: 'Highly Recommended. Daewoo Express and Faisal Movers are comfortable, safe, and cheap for travel between major cities.' },
      metro: { cost: '$', conv: '4.0', rec: 'Recommended. Metrobus lines in Islamabad, Lahore, and Karachi are cheap and bypass heavy traffic.' },
      rideshare: { cost: '$', conv: '4.8', rec: 'Highly Recommended. Yango, InDrive, and Uber are cheap and highly recommended for safe urban travel.' },
      carRental: { cost: '$$', conv: '3.5', rec: 'Optional. Renting a car with a local driver is highly recommended for mountain travel rather than self-driving.' },
      flights: { cost: '$$', conv: '4.0', rec: 'Recommended. PIA and private carriers run daily flights between Islamabad, Karachi, Lahore, and Skardu.' }
    },
    weather: [
      { month: 'Jan', temp: '5°C / 18°C', rain: '20mm', snow: 'North Only', crowd: 'Low', rating: 'Cold / Mild South ⭐️⭐️⭐️' },
      { month: 'Feb', temp: '7°C / 20°C', rain: '30mm', snow: 'North Only', crowd: 'Low', rating: 'Winter Quiet ⭐️⭐️⭐️' },
      { month: 'Mar', temp: '12°C / 25°C', rain: '45mm', snow: 'No', crowd: 'Medium', rating: 'Spring Blooms ⭐️⭐️⭐️⭐️' },
      { month: 'Apr', temp: '18°C / 30°C', rain: '35mm', snow: 'No', crowd: 'Medium', rating: 'Spring Blooms ⭐️⭐️⭐️⭐️' },
      { month: 'May', temp: '23°C / 36°C', rain: '20mm', snow: 'No', crowd: 'High', rating: 'Peak Mountains ⭐️⭐️⭐️⭐️⭐️' },
      { month: 'Jun', temp: '26°C / 40°C', rain: '25mm', snow: 'No', crowd: 'High', rating: 'Hot / Mountain Peak ⭐️⭐️⭐️⭐️' },
      { month: 'Jul', temp: '25°C / 38°C', rain: '90mm', snow: 'No', crowd: 'High', rating: 'Monsoon / Mountains ⭐️⭐️⭐️' },
      { month: 'Aug', temp: '24°C / 36°C', rain: '85mm', snow: 'No', crowd: 'High', rating: 'Monsoon / Mountains ⭐️⭐️⭐️' },
      { month: 'Sep', temp: '21°C / 34°C', rain: '30mm', snow: 'No', crowd: 'Medium', rating: 'Autumn Transitions ⭐️⭐️⭐️⭐️⭐️' },
      { month: 'Oct', temp: '16°C / 30°C', rain: '15mm', snow: 'No', crowd: 'Medium', rating: 'Golden Autumn ⭐️⭐️⭐️⭐️⭐️' },
      { month: 'Nov', temp: '10°C / 24°C', rain: '10mm', snow: 'No', crowd: 'Low', rating: 'Mild South ⭐️⭐️⭐️' },
      { month: 'Dec', temp: '6°C / 20°C', rain: '15mm', snow: 'North Only', crowd: 'Low', rating: 'Cold / Mild South ⭐️⭐️⭐️' }
    ],
    dining: {
      avgCost: 'Street Food: $2 - $5 | Mid-Range: $8 - $15 | Fine Dining: $35+',
      streetFood: 'Karachi Biryani, Seekh Kebabs, Samosa Chaat, Naan, and Kashmiri Chai.',
      dietary: {
        halal: 'Impeccable. 100% Halal options nationwide. All meat and dining spots conform to Islamic rules.',
        veg: 'Very Good. Excellent lentil curries (Daal), vegetable woks (Sabzi), and paneer dishes available everywhere.',
        vegan: 'Moderate. Butter (ghee) is widely used in cooking. Always specify "no ghee" or "no cream" when ordering.'
      },
      restaurantTip: 'Tipping is not legally required but is customary. Leaving 10% cash for waitstaff is highly appreciated in mid to high-end restaurants.',
      safetyTip: 'Always drink bottled water. Avoid ice cubes in street drinks, and choose freshly-cooked, piping hot street food.'
    },
    culture: {
      greetings: 'Saying "Salam" or "Assalamu Alaikum" with a slight nod. Handshakes are standard. Avoid shaking hands with the opposite gender unless initiated.',
      tipping: 'Expected for waitstaff, bag carriers, and drivers ($1 - $2 USD is appreciated).',
      dressCode: 'Conservative and modest. Wear loose-fitting clothes. Women should carry a light scarf (dupatta) to cover their head when entering mosques.',
      publicBehavior: 'Avoid public displays of affection. Alcohol is not publicly sold or consumed.',
      religion: '96% Muslim. Respect prayer times. Take off shoes before entering mosques or shrines.',
      photography: 'Allowed, but ask before taking photos of women, military checkpoints, or bridges.',
      laws: 'Strict regulations on alcohol import. Respect local customs during the holy month of Ramadan (avoid eating/drinking in public during fast hours).',
      avoid: [
        'Dressing revealingly (shorts or sleeveless tops in public).',
        'Discussing sensitive religious topics.',
        'Drinking tap water.'
      ],
      etiquetteTips: 'Locals are famous for guest hospitality. If offered tea (Chai) or a meal, accepting it politely is highly respected.'
    },
    connectivity: {
      speed: '38 Mbps (Download)',
      simProviders: 'Zong, Jazz, Telenor, Ufone',
      esim: 'Available. Airalo and local carriers offer digital eSIMs.',
      wifi: 'Available. Free public WiFi in major city airports and shopping centers; hotels and upscale restaurants offer free access.',
      coverage: 'Excellent in major cities, but spotty in remote mountain passes of Gilgit-Baltistan (SCO sim card is recommended for Hunza).',
      apps: 'InDrive/Yango (essential for cheap, safe rides), Foodpanda (food delivery), Careem, WhatsApp.',
      payment: 'Cash-dominated. Credit/debit cards are accepted in high-end hotels and supermarkets, but carry cash for bazaars, street dining, and remote northern towns.'
    },
    readiness: {
      safety: 7.2,
      affordability: 9.5,
      accessibility: 7.5,
      family: 8.4,
      solo: 8.0
    },
    checklist: [
      { label: 'Passport ready (6 months validity)', checked: true },
      { label: 'eVisa secured online', checked: false },
      { label: 'Local currency (PKR) cash collected', checked: false },
      { label: 'SCO or Zong SIM card active', checked: false }
    ],
    insights: {
      whyLove: 'Renowned for exceptionally warm, hospitable locals, spectacular snow peaks that rival Switzerland, and very cheap travel costs.',
      mistakes: 'Trying to drive yourself in city traffic or mountain roads; hiring a local driver with a 4x4 Jeep is cheap and far safer.',
      hiddenGems: 'Katpana Cold Desert in Skardu: high-altitude pure white sand dunes that get covered in snow during winter.',
      secrets: 'Visit local Food Streets (like Lahore Food Street overlooking Badshahi Mosque) at night for the best barbecue and cultural vibes.'
    }
  }
};

// Generates dynamic fallback data for any other country
export function getCountryIntelligence(countryKey, isDark) {
  const normalizedKey = countryKey.toLowerCase().replace(/ /g, '_');
  
  // If flagship data exists, return it merged with basic fact parameters
  if (flagshipIntelligence[normalizedKey]) {
    const raw = countriesData[normalizedKey] || countriesData.switzerland;
    return {
      ...flagshipIntelligence[normalizedKey],
      id: raw.id,
      name: raw.name,
      flag: raw.flag,
      continent: raw.continent,
      overview: raw.overview,
      facts: {
        capital: raw.basic.capital,
        population: raw.basic.population,
        area: raw.basic.area,
        government: raw.basic.governmentType,
        flower: raw.basic.symbols?.flower || 'National Flower',
        animal: raw.basic.symbols?.animal || 'National Animal',
        anthem: raw.basic.symbols?.anthem || 'National Anthem',
        motto: raw.basic.symbols?.motto || 'National Motto',
        callingCode: raw.basic.callingCode,
        drivingSide: raw.basic.drivingSide
      }
    };
  }

  // Otherwise, procedurally generate a realistic profile
  const raw = countriesData[normalizedKey] || countriesData.switzerland;
  const continent = raw.continent || 'Europe';
  const capital = raw.basic.capital || 'Capital City';
  const currencyCode = raw.basic.currency?.code || 'USD';
  const currencySymbol = raw.basic.currency?.symbol || '$';
  const currencyRate = raw.basic.currency?.rate || 1.0;
  const language = raw.basic.languages || 'English';
  
  // Custom heuristics based on continent
  let safetyScore = '8.2';
  let dailySpend = '75 - 120';
  let visaStatus = 'eVisa / Visa-on-Arrival';
  let plugType = 'Type C & G, 230V, 50Hz';
  let bestSeason = 'May to September';
  let timeline = ['shoulder', 'shoulder', 'peak', 'shoulder', 'shoulder', 'peak', 'peak', 'peak', 'shoulder', 'shoulder', 'budget', 'shoulder'];

  if (continent === 'Europe') {
    safetyScore = '8.8';
    dailySpend = '110 - 180';
    visaStatus = 'Schengen Visa-Free / Schengen Area';
    plugType = 'Type C & F, 230V, 50Hz';
    bestSeason = 'June to August';
    timeline = ['budget', 'budget', 'shoulder', 'shoulder', 'peak', 'peak', 'peak', 'peak', 'shoulder', 'shoulder', 'budget', 'budget'];
  } else if (continent === 'Americas') {
    safetyScore = '7.5';
    dailySpend = '80 - 140';
    visaStatus = 'Visa-Free Entry (90 days)';
    plugType = 'Type A & B, 110V, 60Hz';
    bestSeason = 'December to April';
    timeline = ['peak', 'peak', 'peak', 'shoulder', 'shoulder', 'budget', 'budget', 'shoulder', 'shoulder', 'shoulder', 'budget', 'peak'];
  } else if (continent === 'Africa') {
    safetyScore = '6.8';
    dailySpend = '50 - 90';
    visaStatus = 'eVisa Available';
    plugType = 'Type G & C, 220V, 50Hz';
    bestSeason = 'June to October (Dry season)';
  } else if (continent === 'Oceania') {
    safetyScore = '9.0';
    dailySpend = '120 - 200';
    visaStatus = 'eTA / Visa-Free Entry';
    plugType = 'Type I, 230V, 50Hz';
    bestSeason = 'December to February';
  }

  return {
    id: raw.id,
    name: raw.name,
    flag: raw.flag,
    continent: raw.continent,
    overview: raw.overview,
    safety: {
      score: safetyScore,
      solo: 'Very Good. Solo travelers should exercise standard precautions in crowded tourist zones.',
      family: 'Excellent. Family friendly with clean parks and reliable transportation options.',
      women: 'Safe. Solo female travelers generally report comfortable experiences.',
      scams: 'Low to moderate risk. Watch out for unregulated street taxi offers or high price quotes at tourist shops.'
    },
    visa: {
      status: visaStatus,
      processing: '3-7 Working Days',
      requirements: [
        'Passport valid for at least 6 months beyond travel dates',
        'Proof of return flight ticket',
        'Hotel booking confirmation',
        'Proof of financial support'
      ]
    },
    basics: {
      plug: plugType,
      emergency: 'General Emergency: 112 | Police: 999',
      timezone: raw.basic.timezones || 'UTC+1'
    },
    seasons: {
      peak: `${bestSeason} (Pleasant weather, higher tourist turnout)`,
      shoulder: 'April (Spring blooms) & October (Mild transition weather)',
      budget: 'November to February (Winter season, lower booking rates)',
      timeline: timeline
    },
    destinations: [
      {
        name: capital,
        category: 'Cities',
        desc: `The capital city of ${raw.name}, serving as the cultural, historical, and economic center.`,
        stay: '2-3 Days',
        why: `Explore grand municipal monuments, local food markets, and the historic old town sector.`
      },
      {
        name: 'Scenic Coastal Town',
        category: 'Beaches',
        desc: `A stunning seaside getaway famous for pristine beaches, local fishing docks, and ocean views.`,
        stay: '3 Days',
        why: 'Enjoy fresh local seafood, boating excursions, and scenic sunsets over the coast.'
      },
      {
        name: 'Historic Highlands',
        category: 'Mountains',
        desc: 'A gorgeous mountain region featuring dense forest paths, waterfalls, and hiking spots.',
        stay: '2 Days',
        why: 'Refreshing cool air, beautiful valley panoramas, and historical landmark exploration.'
      }
    ],
    attractions: [
      {
        name: `National Museum of ${raw.name}`,
        fee: '$10 USD',
        duration: '2 Hours',
        season: 'Year-round',
        rating: '4.6',
        tip: 'Visit in the early afternoon to avoid student group tours, and check out the historic artifacts wing.'
      },
      {
        name: `${capital} Central Botanical Park`,
        fee: 'Free',
        duration: '1-2 Hours',
        season: 'Spring / Summer',
        rating: '4.7',
        tip: 'Perfect place for a quiet afternoon stroll. Pack some local bread and fruit for a small picnic near the lake.'
      },
      {
        name: 'Scenic Mountain Lookout',
        fee: 'Free (Cable cars: $15)',
        duration: '3 Hours',
        season: 'Dry season months',
        rating: '4.8',
        tip: 'Start your trek early in the morning. Cloud cover usually sets in around midday, blocking the panoramic valley views.'
      }
    ],
    budget: {
      budgetDaily: dailySpend.split(' - ')[0],
      midRangeDaily: dailySpend.split(' - ')[1],
      luxuryDaily: (parseInt(dailySpend.split(' - ')[1]) * 3).toString() + '+',
      snapshot: {
        hotel: (parseInt(dailySpend.split(' - ')[0]) * 0.8).toFixed(0) + ' - ' + (parseInt(dailySpend.split(' - ')[0]) * 1.5).toFixed(0),
        food: (parseInt(dailySpend.split(' - ')[0]) * 0.25).toFixed(0) + ' - ' + (parseInt(dailySpend.split(' - ')[0]) * 0.5).toFixed(0),
        transport: (parseInt(dailySpend.split(' - ')[0]) * 0.15).toFixed(0) + ' - ' + (parseInt(dailySpend.split(' - ')[0]) * 0.3).toFixed(0),
        attraction: '5 - 18'
      }
    },
    transport: {
      train: { cost: '$$', conv: '4.0', rec: 'Recommended. Connects major urban cities. Clean, affordable, and scenic.' },
      bus: { cost: '$', conv: '4.2', rec: 'Recommended. Local buses are highly active and represent the cheapest transit option.' },
      metro: { cost: '$', conv: '4.5', rec: 'Recommended. Available in the capital city. Rapidly bypasses central road traffic jams.' },
      rideshare: { cost: '$$', conv: '4.6', rec: 'Recommended. International ridesharing apps are available in major cities.' },
      carRental: { cost: '$$$', conv: '3.8', rec: 'Optional. Excellent for exploring remote coastlines or mountain valleys.' },
      flights: { cost: '$$$', conv: '3.5', rec: 'Optional. Recommended for covering major interstate distances quickly.' }
    },
    weather: [
      { month: 'Jan', temp: '5°C / 12°C', rain: '80mm', snow: 'Alpine Only', crowd: 'Low', rating: 'Winter Season ⭐️⭐️' },
      { month: 'Feb', temp: '6°C / 13°C', rain: '70mm', snow: 'Alpine Only', crowd: 'Low', rating: 'Winter Season ⭐️⭐️' },
      { month: 'Mar', temp: '9°C / 16°C', rain: '65mm', snow: 'No', crowd: 'Medium', rating: 'Spring Transition ⭐️⭐️⭐️' },
      { month: 'Apr', temp: '12°C / 20°C', rain: '55mm', snow: 'No', crowd: 'Medium', rating: 'Spring Mild ⭐️⭐️⭐️⭐️' },
      { month: 'May', temp: '16°C / 24°C', rain: '50mm', snow: 'No', crowd: 'High', rating: 'Spring Peak ⭐️⭐️⭐️⭐️⭐️' },
      { month: 'Jun', temp: '19°C / 28°C', rain: '40mm', snow: 'No', crowd: 'High', rating: 'Summer Peak ⭐️⭐️⭐️⭐️⭐️' },
      { month: 'Jul', temp: '22°C / 30°C', rain: '30mm', snow: 'No', crowd: 'High', rating: 'Summer Peak ⭐️⭐️⭐️⭐️⭐️' },
      { month: 'Aug', temp: '22°C / 30°C', rain: '35mm', snow: 'No', crowd: 'High', rating: 'Summer Peak ⭐️⭐️⭐️⭐️⭐️' },
      { month: 'Sep', temp: '18°C / 26°C', rain: '55mm', snow: 'No', crowd: 'Medium', rating: 'Autumn Mild ⭐️⭐️⭐️⭐️⭐️' },
      { month: 'Oct', temp: '14°C / 21°C', rain: '70mm', snow: 'No', crowd: 'Medium', rating: 'Autumn Mild ⭐️⭐️⭐️⭐️' },
      { month: 'Nov', temp: '9°C / 16°C', rain: '85mm', snow: 'No', crowd: 'Low', rating: 'Pre-winter Quiet ⭐️⭐️' },
      { month: 'Dec', temp: '6°C / 13°C', rain: '90mm', snow: 'Alpine Only', crowd: 'Low', rating: 'Winter Season ⭐️⭐️' }
    ],
    dining: {
      avgCost: `Street Food: $4 - $8 | Mid-Range: $15 - $28 | Fine Dining: $60+`,
      streetFood: 'Local baked items, sausage rolls, cheese pockets, and fresh seasonal fruit cuts.',
      dietary: {
        halal: 'Moderate. Available in capital cities and specialized quarters; look for certified badges.',
        veg: 'Good. Standard cafes and dining halls offer vegetarian soups, salads, and pasta bowls.',
        vegan: 'Moderate. Available in cosmopolitan city cafes; check menus or ask staff.'
      },
      restaurantTip: 'Service charge is often included on the bill. Adding a small cash tip (5-10%) is customary for great service.',
      safetyTip: 'Tap water is generally safe in large hotels and city centers, though buying bottled water is recommended for sensitive stomachs.'
    },
    culture: {
      greetings: 'A friendly handshake with eye contact is standard in both business and social environments.',
      tipping: 'A tip of 10% is appreciated in seated dining if not already factored into the bill.',
      dressCode: 'Casual and relaxed. Modest clothing is recommended when entering historical temples or shrines.',
      publicBehavior: 'Keep speaking voices low on public transport, and follow recycling sorting rules.',
      religion: 'Keep voices low in churches and historic temples. Remove hats when entering.',
      photography: 'Allowed, but look for "no flash" indicators inside museum rooms and shrines.',
      laws: 'Strict environmental preservation rules inside national parks and reserves.',
      avoid: [
        'Speaking loudly on public buses or subways.',
        'Littering or ignoring recycling guidelines.',
        'Taking photos of locals without asking.'
      ],
      etiquetteTips: 'A polite greeting when entering small family shops is highly appreciated.'
    },
    connectivity: {
      speed: '55 Mbps (Download)',
      simProviders: 'Local Mobile network 1, Mobile network 2',
      esim: 'Available. Supported by Airalo and Holafly.',
      wifi: 'Available. Free WiFi in city malls, airports, and major cafes.',
      coverage: 'Excellent in city centers and towns, spotty in high-altitude mountain forests.',
      apps: 'Local ride-hailing apps, WhatsApp, Google Maps.',
      payment: 'Credit and debit cards are widely accepted in cities, but carry cash coins for local bus fares and street markets.'
    },
    readiness: {
      safety: parseFloat(safetyScore),
      affordability: parseFloat((10 - (parseInt(dailySpend.split(' - ')[0]) / 25)).toFixed(1)),
      accessibility: 8.5,
      family: 8.0,
      solo: 8.5
    },
    checklist: [
      { label: 'Passport ready (6 months validity)', checked: true },
      { label: 'eVisa secured (if applicable)', checked: false },
      { label: 'Travel insurance recommended', checked: false },
      { label: 'Local SIM card or eSIM active', checked: false }
    ],
    insights: {
      whyLove: `Renowned for rich historic architecture, welcoming local communities, and gorgeous scenic national park routes.`,
      mistakes: 'Not booking high-speed train tickets in advance, which can cost significantly more near travel dates.',
      hiddenGems: `A scenic forest valley just a 1-hour drive from ${capital}, featuring tranquil waterfalls and quiet trails.`,
      secrets: 'Eat at local neighborhood diners rather than main tourist squares to save up to 40% on daily meals.'
    },
    facts: {
      capital: raw.basic.capital,
      population: raw.basic.population,
      area: raw.basic.area,
      government: raw.basic.governmentType,
      flower: raw.basic.symbols?.flower || 'National Flower',
      animal: raw.basic.symbols?.animal || 'National Animal',
      anthem: raw.basic.symbols?.anthem || 'National Anthem',
      motto: raw.basic.symbols?.motto || 'National Motto',
      callingCode: raw.basic.callingCode,
      drivingSide: raw.basic.drivingSide
    }
  };
}
