import fs from 'fs';
import { topDestinations } from '../src/data/index.js';

// Define the 15 new world-class beaches
const newBeaches = [
  {
    "id": "entalula-beach",
    "name": "Entalula Beach",
    "country": "Philippines",
    "flag": "🇵🇭",
    "rank": 55,
    "image": "https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?w=1200&q=80",
    "preview": "Towering karst limestone walls and blindingly white sand.",
    "description": "Entalula Beach is a private tropical oasis in El Nido, Palawan. Framed by dramatic, towering limestone cliffs and washed by crystal-clear turquoise waters, its fine white sand is the epitome of secluded island luxury.",
    "weather": {
      "temp": "31°C",
      "condition": "Sunny & Humid",
      "humidity": "75%",
      "airQuality": "Excellent"
    },
    "bestTime": "December - April (Dry Season)",
    "budget": {
      "daily": "$90-220",
      "hotel": "$45-180",
      "food": "$15-35",
      "transport": "$30-60"
    },
    "safety": "Very Safe",
    "timezone": "PST (UTC+8)",
    "attractions": [
      "Limestone Karst Cliffs",
      "Bacuit Bay Snorkeling",
      "Big Lagoon Sea Kayaking",
      "Shimizu Island Reefs"
    ],
    "foods": [
      "Adobo Chicken",
      "Fresh Mango Shakes",
      "Grilled Lapu-Lapu fish",
      "Kinilaw (ceviche)"
    ],
    "transport": [
      "Bangka Motorized Boat",
      "Kayaking"
    ],
    "culture": "Respectful island communities. Filipino warmth and hospitality are world-famous.",
    "visa": "Visa-free for 30 days for most nationalities. Tourist card completed on arrival.",
    "categoryIds": [
      "beaches",
      "islands",
      "nature"
    ],
    "gallery": [
      "https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=80",
      "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1200&q=80"
    ]
  },
  {
    "id": "whitehaven-beach",
    "name": "Whitehaven Beach",
    "country": "Australia",
    "flag": "🇦🇺",
    "rank": 56,
    "image": "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1200&q=80",
    "preview": "98% pure silica sand swirling with brilliant turquoise tides.",
    "description": "Whitehaven Beach stretches for seven kilometers along Whitsunday Island. Composed of 98% pure silica, the sand is so fine it doesn't retain heat, remaining perfectly cool underfoot even in the midday sun, creating spectacular swirling colors with the changing tides.",
    "weather": {
      "temp": "26°C",
      "condition": "Breezy & Clear",
      "humidity": "60%",
      "airQuality": "Excellent"
    },
    "bestTime": "September - November (Ideal spring warmth)",
    "budget": {
      "daily": "$150-380",
      "hotel": "$80-280",
      "food": "$30-70",
      "transport": "$40-120"
    },
    "safety": "Safe (Stinger suits recommended in summer)",
    "timezone": "AEST (UTC+10)",
    "attractions": [
      "Hill Inlet Lookout",
      "Betty's Beach Cove",
      "Whitsunday Island Walk",
      "Reef Scenic Helicopter Flight"
    ],
    "foods": [
      "Barramundi fillet",
      "Moreton Bay Bugs (lobster)",
      "Traditional Aussie Meat Pies",
      "Pavlova dessert"
    ],
    "transport": [
      "Catamaran Charter",
      "Seaplane / Helicopter",
      "Sailing Yacht"
    ],
    "culture": "Aussie outdoor/beach culture. Strictly regulated national park conservation rules.",
    "visa": "Electronic Travel Authority (ETA) required for international visitors before travel.",
    "categoryIds": [
      "beaches",
      "islands",
      "nature"
    ],
    "gallery": [
      "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=80",
      "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1200&q=80"
    ]
  },
  {
    "id": "bioluminescent-maldives",
    "name": "Bioluminescent Beaches",
    "country": "Maldives",
    "flag": "🇲🇻",
    "rank": 57,
    "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
    "preview": "Waves glowing with brilliant neon blue light at night.",
    "description": "On Vaadhoo Island, waves crash against the shore glowing with a magical neon-blue bioluminescence. This spectacular natural light show is caused by thousands of microscopic marine phytoplankton (dinoflagellates) reacting to oxygen and movement.",
    "weather": {
      "temp": "29°C",
      "condition": "Tropical Calm",
      "humidity": "82%",
      "airQuality": "Excellent"
    },
    "bestTime": "June - October (Optimal plankton activity)",
    "budget": {
      "daily": "$180-450",
      "hotel": "$90-380",
      "food": "$25-60",
      "transport": "$60-150"
    },
    "safety": "Very Safe",
    "timezone": "MVT (UTC+5)",
    "attractions": [
      "Vaadhoo Glowing Shoreline",
      "Coral Reef Night Dives",
      "Private Dhoni sunset cruise",
      "Overwater Bungalow Lounging"
    ],
    "foods": [
      "Mas Huni (tuna & coconut)",
      "Garudhiya (fish broth)",
      "Fihunu Mas (grilled fish)",
      "Fresh Coconut Water"
    ],
    "transport": [
      "Speedboat transfer",
      "Inter-island Dhoni ferry"
    ],
    "culture": "Respect local Islamic customs in inhabited islands. Dress modestly outside resorts.",
    "visa": "30-day tourist visa granted free on arrival for all tourists.",
    "categoryIds": [
      "beaches",
      "islands",
      "nature"
    ],
    "gallery": [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=80",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200&q=80",
      "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1200&q=80"
    ]
  },
  {
    "id": "railay-beach",
    "name": "Railay Beach",
    "country": "Thailand",
    "flag": "🇹🇭",
    "rank": 58,
    "image": "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1200&q=80",
    "preview": "Limestone cliffs cutting off a beautiful peninsula from the mainland.",
    "description": "Railay Beach is a gorgeous peninsula in Krabi surrounded by towering limestone cliffs, accessible only by sea. Famous for its dramatic karst rock walls, deep caves, and soft white sands, it is a global mecca for rock climbing and paddle boarding.",
    "weather": {
      "temp": "30°C",
      "condition": "Tropical Sunny",
      "humidity": "78%",
      "airQuality": "Good"
    },
    "bestTime": "November - March (Dry, breezy winter)",
    "budget": {
      "daily": "$60-150",
      "hotel": "$30-100",
      "food": "$10-30",
      "transport": "$15-40"
    },
    "safety": "Safe",
    "timezone": "ICT (UTC+7)",
    "attractions": [
      "Phra Nang Cave Beach",
      "Diamond Cave (Tham Phra Nang)",
      "Railay West Sunset Front",
      "Tonsai Climbing Crags"
    ],
    "foods": [
      "Pad Thai Boran",
      "Tom Yum Goong",
      "Mango Sticky Rice",
      "Green Papaya Salad (Som Tum)"
    ],
    "transport": [
      "Long-Tail Boat transfer",
      "Footpath Walking"
    ],
    "culture": "Laid-back southern Thai island lifestyle. Respect temples and religious icons.",
    "visa": "Visa-free entry for up to 30 days for visitors from 60+ countries.",
    "categoryIds": [
      "beaches",
      "islands",
      "adventure"
    ],
    "gallery": [
      "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
      "https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?w=1200&q=80",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=80"
    ]
  },
  {
    "id": "elafonissi-beach",
    "name": "Elafonissi Beach",
    "country": "Greece",
    "flag": "🇬🇷",
    "rank": 59,
    "image": "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1200&q=80",
    "preview": "Shallow tidal lagoons lined with distinct pink coral sand.",
    "description": "Elafonissi is a small peninsula off southwest Crete famous for its shallow turquoise lagoons and natural pink sands. The unique pink hue is created by millions of crushed pink coral shells deposited along the water's edge over millennia.",
    "weather": {
      "temp": "24°C",
      "condition": "Warm & Sunny",
      "humidity": "50%",
      "airQuality": "Excellent"
    },
    "bestTime": "May - June or September - October",
    "budget": {
      "daily": "$80-180",
      "hotel": "$40-120",
      "food": "$20-40",
      "transport": "$20-50"
    },
    "safety": "Very Safe",
    "timezone": "EEST (UTC+3)",
    "attractions": [
      "Pink Sand Lagoon Channels",
      "Elafonissi Nature Reserve",
      "Chrysoskalitissa Monastery",
      "Kedrodasos Juniper Forest"
    ],
    "foods": [
      "Greek Dakos salad",
      "Crete Graviera cheese",
      "Slow-cooked Lamb Kleftiko",
      "Cretan Tsikoudia (Raki)"
    ],
    "transport": [
      "Rental Car",
      "Cooperative KTEL bus"
    ],
    "culture": "Generous Cretan hospitality. Standard Greek mainland customs apply.",
    "visa": "Schengen Visa guidelines apply. Joint visa for European Union countries.",
    "categoryIds": [
      "beaches",
      "islands",
      "nature"
    ],
    "gallery": [
      "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
      "https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=1200&q=80",
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200&q=80"
    ]
  },
  {
    "id": "praia-da-falesia",
    "name": "Praia da Falésia",
    "country": "Portugal",
    "flag": "🇵🇹",
    "rank": 60,
    "image": "https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=1200&q=80",
    "preview": "Multi-kilometer sandy beach bordered by red and ochre clay cliffs.",
    "description": "Praia da Falésia is a legendary multi-kilometer stretch of sand in Algarve, Portugal. The beach is dramatically bordered by high, vertical clay cliffs striped with brilliant red, orange, and golden ochre, capped by lush green pine forests.",
    "weather": {
      "temp": "23°C",
      "condition": "Sunny & Sunny",
      "humidity": "55%",
      "airQuality": "Excellent"
    },
    "bestTime": "June - September (Optimal warm sea temperatures)",
    "budget": {
      "daily": "$85-200",
      "hotel": "$45-150",
      "food": "$20-45",
      "transport": "$15-35"
    },
    "safety": "Very Safe",
    "timezone": "WEST (UTC+1)",
    "attractions": [
      "Algarve Red Clay Cliffs",
      "Clifftop Pine Path hikes",
      "Vilamoura Marina Front",
      "Olhos de Água fishing cove"
    ],
    "foods": [
      "Cataplana de Marisco",
      "Grilled Sardines (Sardinhas)",
      "Pastéis de Nata tart",
      "Algarve orange wines"
    ],
    "transport": [
      "Rental Car",
      "Local Algarve trains",
      "Biking"
    ],
    "culture": "Deep Portuguese maritime history. Gentle and polite coastal culture.",
    "visa": "Schengen Area guidelines apply. Visa-free for EU citizens.",
    "categoryIds": [
      "beaches",
      "nature"
    ],
    "gallery": [
      "https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200&q=80",
      "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1200&q=80"
    ]
  },
  {
    "id": "la-pelosa-beach",
    "name": "La Pelosa Beach",
    "country": "Italy",
    "flag": "🇮🇹",
    "rank": 61,
    "image": "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200&q=80",
    "preview": "Shallow turquoise waters looking out at an ancient watchtower.",
    "description": "La Pelosa in Stintino, Sardinia, features exceptionally calm, knee-deep turquoise water that looks like a natural swimming pool. The shallow waters look across the bay to an iconic 16th-century stone watchtower on Isola della Pelosa.",
    "weather": {
      "temp": "25°C",
      "condition": "Calm & Clear",
      "humidity": "52%",
      "airQuality": "Excellent"
    },
    "bestTime": "June - September (Matting and reservation mandatory in summer)",
    "budget": {
      "daily": "$100-240",
      "hotel": "$50-180",
      "food": "$25-50",
      "transport": "$20-45"
    },
    "safety": "Very Safe",
    "timezone": "CEST (UTC+2)",
    "attractions": [
      "Torre della Pelosa Tower",
      "Asinara National Park Ferry",
      "Capo Falcone Scenic Path",
      "Sardinian Lagoon Diving"
    ],
    "foods": [
      "Fregola con arselle (pasta)",
      "Sardinian Roast Suckling Pig",
      "Seadas (sweet pastry)",
      "Cannonau local red wine"
    ],
    "transport": [
      "Rental Car",
      "Sardinian Bus Services"
    ],
    "culture": "Proud Sardinian island heritage. Strictly regulated sand conservation guidelines.",
    "visa": "Standard Schengen Area guidelines apply. Open access for European citizens.",
    "categoryIds": [
      "beaches",
      "islands",
      "luxury"
    ],
    "gallery": [
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
      "https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=1200&q=80",
      "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1200&q=80"
    ]
  },
  {
    "id": "reynisfjara-beach",
    "name": "Reynisfjara Beach",
    "country": "Iceland",
    "flag": "🇮🇸",
    "rank": 62,
    "image": "https://images.unsplash.com/photo-1529963183134-61a90db47eaf?w=1200&q=80",
    "preview": "Pitch-black volcanic sand, geometric basalt columns, and sea stacks.",
    "description": "Reynisfjara is a world-famous black sand beach on Iceland's southern coast. Characterized by striking volcanic sands, towering geometric basalt columns (Garðar), dramatic caverns, and massive stone sea stacks (Reynisdrangar) rising out of crashing North Atlantic waves.",
    "weather": {
      "temp": "11°C",
      "condition": "Overcast & Windy",
      "humidity": "80%",
      "airQuality": "Excellent"
    },
    "bestTime": "June - August (Mildest weather window)",
    "budget": {
      "daily": "$160-350",
      "hotel": "$80-250",
      "food": "$30-70",
      "transport": "$50-120"
    },
    "safety": "Extreme Sneaker Wave Warning / Remain far from shore",
    "timezone": "GMT (UTC+0)",
    "attractions": [
      "Reynisdrangar Sea Stacks",
      "Garðar Basalt Column Wall",
      "Hálsanefshellir Sea Cave",
      "Dyrhólaey Peninsula Viewpoint"
    ],
    "foods": [
      "Icelandic Lamb Soup (Kjötsúpa)",
      "Freshly caught Arctic Char",
      "Skyr local yogurt",
      "Rye bread baked in hot springs"
    ],
    "transport": [
      "Rental 4x4 Vehicle",
      "Organized South Coast tour bus"
    ],
    "culture": "Rich Norse folklore. Keep absolute respect for the immense, dangerous natural power of the ocean.",
    "visa": "Schengen Area guidelines apply. Free movement for Schengen citizens.",
    "categoryIds": [
      "beaches",
      "nature",
      "adventure"
    ],
    "gallery": [
      "https://images.unsplash.com/photo-1529963183134-61a90db47eaf?w=1200&q=80",
      "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?w=1200&q=80",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80"
    ]
  },
  {
    "id": "isla-pasion",
    "name": "Isla Pasión",
    "country": "Mexico",
    "flag": "🇲🇽",
    "rank": 63,
    "image": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=80",
    "preview": "Protected coral island oasis with untouched reefs.",
    "description": "Isla Pasión is a private island paradise in Cozumel, Mexico. Known for its soft, palm-lined sands, pristine coral reefs, and calm warm Caribbean waters, it serves as a critical nesting ground for endangered marine sea turtles.",
    "weather": {
      "temp": "28°C",
      "condition": "Tropical Breezy",
      "humidity": "72%",
      "airQuality": "Good"
    },
    "bestTime": "December - April (Dry, pleasant winter)",
    "budget": {
      "daily": "$110-250",
      "hotel": "$50-180",
      "food": "$20-45",
      "transport": "$30-75"
    },
    "safety": "Safe",
    "timezone": "EST (UTC-5)",
    "attractions": [
      "Cozumel Marine Sanctuary Dives",
      "Chankanaab Eco-Park Reefs",
      "Private Yacht catamaran tours",
      "Sea Turtle Nesting Dunes"
    ],
    "foods": [
      "Cozumel Fish Tacos",
      "Sopa de Lima (lime soup)",
      "Ceviche Mixto",
      "Freshly shaken Margaritas"
    ],
    "transport": [
      "Motorized Ferry Boat",
      "Golf Cart rental"
    ],
    "culture": "Warm Mayan-Mexican hospitality. Protecting fragile coral reefs from sunscreen damage is strongly emphasized.",
    "visa": "FMM Tourist Card granted free to visitors from US, EU, and Canada on arrival.",
    "categoryIds": [
      "beaches",
      "islands",
      "nature"
    ],
    "gallery": [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
      "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1200&q=80",
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80"
    ]
  },
  {
    "id": "grace-bay-beach",
    "name": "Grace Bay Beach",
    "country": "Turks & Caicos",
    "flag": "🇹🇨",
    "rank": 64,
    "image": "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1200&q=80",
    "preview": "Miles of exceptionally clean sand protected by a massive barrier reef.",
    "description": "Grace Bay Beach is widely regarded as one of the world's finest beaches. Boasting miles of dazzlingly white, powder-soft sand and calm turquoise lagoons, the entire beach is protected by a massive barrier reef system that shelters the shore from rough ocean waves.",
    "weather": {
      "temp": "28°C",
      "condition": "Tropical Calm",
      "humidity": "68%",
      "airQuality": "Excellent"
    },
    "bestTime": "December - April (Dry peak season)",
    "budget": {
      "daily": "$200-500",
      "hotel": "$120-400",
      "food": "$30-80",
      "transport": "$25-60"
    },
    "safety": "Very Safe",
    "timezone": "EST (UTC-5)",
    "attractions": [
      "Princess Alexandra Marine Park",
      "Barrier Reef Snorkeling",
      "Bight Reef Snorkel Path",
      "Providenciales Sailing cruise"
    ],
    "foods": [
      "Conch Salad (local delicacy)",
      "Deep Fried Conch Fritters",
      "Grilled Caribbean lobster",
      "Rum Punch cocktails"
    ],
    "transport": [
      "Rental Car",
      "Biking",
      "Water Taxi"
    ],
    "culture": "Friendly Caribbean island lifestyle. Strong eco-friendly resort culture.",
    "visa": "Visa-free access for up to 90 days for US, Canadian, and European citizens.",
    "categoryIds": [
      "beaches",
      "islands",
      "luxury"
    ],
    "gallery": [
      "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=80",
      "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1200&q=80"
    ]
  },
  {
    "id": "la-jolla-cove",
    "name": "La Jolla Cove",
    "country": "United States",
    "flag": "🇺🇸",
    "rank": 65,
    "image": "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=1200&q=80",
    "preview": "Sandstone cliffs framing a cove teeming with wild sea lions.",
    "description": "La Jolla Cove is a highly picturesque sandstone cliff inlet in San Diego, California. As part of a protected ecological reserve, its clean, cold waters and golden cliffs are home to massive colonies of wild California sea lions, harbor seals, and orange Garibaldi fish.",
    "weather": {
      "temp": "19°C",
      "condition": "Sunny & Coastal",
      "humidity": "62%",
      "airQuality": "Good"
    },
    "bestTime": "June - September (Optimal ocean visibility)",
    "budget": {
      "daily": "$110-250",
      "hotel": "$65-200",
      "food": "$20-45",
      "transport": "$15-30"
    },
    "safety": "Very Safe",
    "timezone": "PDT (UTC-7)",
    "attractions": [
      "Sea Lion Observation Point",
      "Sunny Jim Sea Cave Walk",
      "La Jolla Underwater Reserve",
      "Torrey Pines State Gliderport"
    ],
    "foods": [
      "Baja California Fish Tacos",
      "Clam Chowder bread bowl",
      "Fresh California Avocado toast",
      "Artisanal West Coast craft beers"
    ],
    "transport": [
      "Walking / Rent-a-bike",
      "MTS City Bus System",
      "Ride-sharing"
    ],
    "culture": "Classic Southern California coastal/surf culture. Do not approach or touch marine mammals.",
    "visa": "ESTA electronic visa waiver required for international tourists.",
    "categoryIds": [
      "beaches",
      "nature",
      "wildlife"
    ],
    "gallery": [
      "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=80",
      "https://images.unsplash.com/photo-1500964757637-c85e8a162699?w=1200&q=80"
    ]
  },
  {
    "id": "tulum-beach",
    "name": "Tulum Beach",
    "country": "Mexico",
    "flag": "🇲🇽",
    "rank": 66,
    "image": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80",
    "preview": "White sand framing ancient Mayan ruins perched directly on cliff edges.",
    "description": "Tulum Beach combines natural tropical beauty with profound historical legacy. Soft white sands and swaying coconut palms frame the iconic, ancient Mayan ruins of El Castillo, perched dramatically on the limestone cliff edge directly overlooking the sea.",
    "weather": {
      "temp": "28°C",
      "condition": "Tropical Sunny",
      "humidity": "74%",
      "airQuality": "Good"
    },
    "bestTime": "December - April (Dry season window)",
    "budget": {
      "daily": "$90-220",
      "hotel": "$45-180",
      "food": "$15-35",
      "transport": "$15-40"
    },
    "safety": "Safe",
    "timezone": "EST (UTC-5)",
    "attractions": [
      "Tulum Mayan Ruins Site",
      "Grand Cenote Swimming Cave",
      "Sian Ka'an Biosphere Dunes",
      "Paradise Beach (Playa Paraíso)"
    ],
    "foods": [
      "Cochinita Pibil pork",
      "Yucatán Panuchos",
      "Guacamole and corn chips",
      "Fresh Coconut Horchata"
    ],
    "transport": [
      "Rental Scooter / Bicycle",
      "Colectivo local shared vans"
    ],
    "culture": "Rich Mayan cultural roots blended with bohemian beach vibes. Eco-conscious preservation.",
    "visa": "FMM Tourist card completed free at border for most international arrivals.",
    "categoryIds": [
      "beaches",
      "historical"
    ],
    "gallery": [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=80",
      "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1200&q=80"
    ]
  },
  {
    "id": "boulders-beach",
    "name": "Boulders Beach",
    "country": "South Africa",
    "flag": "🇿🇦",
    "rank": 67,
    "image": "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80",
    "preview": "540-million-year-old granite boulders sheltering wild African Penguins.",
    "description": "Boulders Beach in Simon's Town, Cape Town, features massive, smooth 540-million-year-old granite boulders. These giants form sheltered coves and windbreaks that serve as the protected sanctuary for a massive breeding colony of wild African Penguins.",
    "weather": {
      "temp": "18°C",
      "condition": "Windy & Sunny",
      "humidity": "58%",
      "airQuality": "Excellent"
    },
    "bestTime": "November - March (Optimal warm summer months)",
    "budget": {
      "daily": "$80-180",
      "hotel": "$40-120",
      "food": "$15-35",
      "transport": "$20-45"
    },
    "safety": "Safe",
    "timezone": "SAST (UTC+2)",
    "attractions": [
      "Penguin Colony Boardwalk",
      "Foxy Beach Swimming Cove",
      "Simon's Town Historic Navy Dock",
      "Cape Point Nature Reserve"
    ],
    "foods": [
      "Cape Malay Chicken Curry",
      "Freshly braaied Snoek fish",
      "Biltong beef snack",
      "Traditional Koeksisters"
    ],
    "transport": [
      "Rental Car",
      "Organized Cape Peninsula tour bus"
    ],
    "culture": "Standard South African customs. Do not touch, feed, or corner the endangered penguins.",
    "visa": "Visa-free access for 90 days for major European, American, and Commonwealth nations.",
    "categoryIds": [
      "beaches",
      "nature",
      "wildlife"
    ],
    "gallery": [
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
      "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=1200&q=80",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=80"
    ]
  },
  {
    "id": "saadiyat-beach",
    "name": "Saadiyat Beach",
    "country": "United Arab Emirates",
    "flag": "🇦🇪",
    "rank": 68,
    "image": "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80",
    "preview": "Eco-reserve dunes serving as nesting grounds for hawksbill turtles.",
    "description": "Saadiyat Beach in Abu Dhabi offers sprawling, untouched white sand dunes looking out to warm turquoise Persian Gulf waters. Operated as a highly regulated eco-reserve, it serves as a critical nesting ground for endangered hawksbill turtles.",
    "weather": {
      "temp": "34°C",
      "condition": "Hot & Sunny",
      "humidity": "60%",
      "airQuality": "Good"
    },
    "bestTime": "November - March (Pleasant winter months)",
    "budget": {
      "daily": "$180-400",
      "hotel": "$100-300",
      "food": "$30-70",
      "transport": "$25-50"
    },
    "safety": "Extremely Safe",
    "timezone": "GST (UTC+4)",
    "attractions": [
      "Hawksbill Turtle Nest Dunes",
      "Louvre Abu Dhabi Museum",
      "Guggenheim Abu Dhabi Front",
      "Saadiyat Beach Club"
    ],
    "foods": [
      "Machboos (spiced lamb rice)",
      "Luqaimat sweet dumplings",
      "Fresh hummus & pita bread",
      "Arabian coffee & dates"
    ],
    "transport": [
      "Licensed City Taxi",
      "Abu Dhabi Public Bus System"
    ],
    "culture": "Respect local Emirati Islamic traditions. Modest beach dress code outside beach clubs.",
    "visa": "Visa-free or Visa on Arrival granted to travelers from 70+ nations.",
    "categoryIds": [
      "beaches",
      "nature",
      "luxury"
    ],
    "gallery": [
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=80",
      "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1200&q=80"
    ]
  },
  {
    "id": "camps-bay",
    "name": "Camps Bay",
    "country": "South Africa",
    "flag": "🇿🇦",
    "rank": 69,
    "image": "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=1200&q=80",
    "preview": "White-sand crescent sitting beneath a towering coastal mountain range.",
    "description": "Camps Bay is Cape Town's premier beach, featuring a sprawling white-sand crescent. The beach is bordered by a lively palm-lined promenade and sits directly underneath the towering, jagged cliffs of the Twelve Apostles and Table Mountain range.",
    "weather": {
      "temp": "21°C",
      "condition": "Sunny & Breezy",
      "humidity": "54%",
      "airQuality": "Excellent"
    },
    "bestTime": "December - February (Peak warm summer)",
    "budget": {
      "daily": "$90-220",
      "hotel": "$50-180",
      "food": "$20-45",
      "transport": "$15-35"
    },
    "safety": "Safe (Standard city caution recommended after dark)",
    "timezone": "SAST (UTC+2)",
    "attractions": [
      "Twelve Apostles Mountain Views",
      "Camps Bay Strip Promenade",
      "Table Mountain Cableway (nearby)",
      "Clifton Beaches granite coves"
    ],
    "foods": [
      "Traditional South African Braai",
      "Biltong & Droëwors platter",
      "Fresh Atlantic hake & chips",
      "Stellenbosch local white wines"
    ],
    "transport": [
      "MyCiTi Bus System",
      "Ride-sharing"
    ],
    "culture": "Vibrant, friendly Cape outdoor lifestyle. Keep national park nature zones clean.",
    "visa": "Visa-free entry for up to 90 days for major Western and Commonwealth countries.",
    "categoryIds": [
      "beaches",
      "nature"
    ],
    "gallery": [
      "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=80"
    ]
  }
];

// Let's do the programmatic database migration:
// 1. We will filter the current topDestinations array to:
//    - Remove `"beaches"` from `categoryIds` for the original destinations.
//    - Filter out the 22 duplicate placeholders.
// 2. We will push the 15 new iconic beach destinations into the array.
// 3. We will write the updated array back into the topDestinations section of index.js.

const duplicateIds = new Set([
  'losangeles-635', 'miamibeach-30', 'nicepromenade-489', 'marseilleharbor-97',
  'amalficoast-181', 'ibizaisland-294', 'antalyacoast-823', 'cretebeaches-805',
  'tulumruins-600', 'lombokbeaches-853', 'riocopacabana-761', 'losangeles-458',
  'miamibeach-516', 'nicepromenade-9', 'marseilleharbor-780', 'amalficoast-47',
  'ibizaisland-562', 'antalyacoast-116', 'cretebeaches-846', 'tulumruins-498',
  'lombokbeaches-127', 'riocopacabana-361'
]);

const updatedDestinations = [];

topDestinations.forEach(d => {
  // If it's a duplicate placeholder, discard it
  if (duplicateIds.has(d.id)) {
    return;
  }
  
  // If it has "beaches" in categoryIds, remove "beaches" gently
  if (d.categoryIds && d.categoryIds.includes('beaches')) {
    d.categoryIds = d.categoryIds.filter(cat => cat !== 'beaches');
  }
  
  updatedDestinations.push(d);
});

// Push the 15 new beaches to the array!
updatedDestinations.push(...newBeaches);

console.log("Filtered original array. Old count:", topDestinations.length, "New count (after purging 22 duplicates and adding 15 new beaches):", updatedDestinations.length);

// Read the index.js file as text
let fileContent = fs.readFileSync('src/data/index.js', 'utf8');

// Locate the start of topDestinations and the start of currencies
const topDestStartIndex = fileContent.indexOf('export const topDestinations = [');
const currenciesStartIndex = fileContent.indexOf('export const currencies = [');

if (topDestStartIndex !== -1 && currenciesStartIndex !== -1) {
  const headPart = fileContent.substring(0, topDestStartIndex);
  const tailPart = fileContent.substring(currenciesStartIndex);
  
  // Format the updatedDestinations array nicely
  const destinationsString = `export const topDestinations = ${JSON.stringify(updatedDestinations, null, 2)};\n\n`;
  
  const finalContent = headPart + destinationsString + tailPart;
  
  fs.writeFileSync('src/data/index.js', finalContent, 'utf8');
  console.log("Successfully wrote updated topDestinations array into src/data/index.js!");
} else {
  console.log("ERROR: Could not locate array boundaries in index.js!");
}
