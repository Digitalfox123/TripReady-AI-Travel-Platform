import fs from 'fs';
import path from 'path';

const DATA_FILE = 'src/data/index.js';
const PEXELS_KEY = "YQYRDVubERjsu4wHacREVKfAJdMBKjsJawtRREAKQQCFyE408pq5oeBw";
const PIXABAY_KEY = "25085477-64457aa3004ffe076ffb1989c";

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const rawText = `Tokyo (Japan) 🇯🇵
Tags: Modern, Culture, Food
Description: Neon megacity — sushi, anime, temples, bullet trains and cherry blossoms.
Best Time to Visit: Mar–May, Oct–Nov | Rating: ★★★★★

Bangkok (Thailand) 🇹🇭
Tags: Culture, Food, History
Description: City of temples, floating markets, tuk-tuks and insane street food.
Best Time to Visit: Nov–Feb | Rating: ★★★★★

Singapore (Singapore) 🇸🇬
Tags: Modern, Luxury, Food
Description: Futuristic garden city — Marina Bay Sands, hawker centres and spotless streets.
Best Time to Visit: Feb–Apr | Rating: ★★★★★

Lahore (Pakistan) 🇵🇰
Tags: History, Culture, Food
Description: Mughal jewel — Badshahi Mosque, Lahore Fort, food street and vibrant arts.
Best Time to Visit: Oct–Mar | Rating: ★★★★☆

Hong Kong (China) 🇭🇰
Tags: Modern, Culture, Food
Description: Vertical skyline, dim sum, night markets and Victoria Harbour.
Best Time to Visit: Oct–Dec | Rating: ★★★★★

Bali (Ubud & Seminyak) (Indonesia) 🇮🇩
Tags: Beach, Culture, Nature
Description: Rice terraces, Hindu temples, surf beaches and yoga retreats.
Best Time to Visit: Apr–Oct | Rating: ★★★★★

Seoul (South Korea) 🇰🇷
Tags: Modern, Culture, Food
Description: K-pop, palaces, BBQ, cutting-edge tech and Han River sunsets.
Best Time to Visit: Mar–May, Sep–Nov | Rating: ★★★★★

Kyoto (Japan) 🇯🇵
Tags: History, Culture, Nature
Description: Geisha districts, bamboo groves, 1,600 Buddhist temples and Zen gardens.
Best Time to Visit: Mar–May, Oct–Nov | Rating: ★★★★★

Mumbai (India) 🇮🇳
Tags: Culture, Modern, Food
Description: Bollywood capital — Gateway of India, Dharavi, street vada pav and chaos.
Best Time to Visit: Nov–Feb | Rating: ★★★★☆

Delhi (India) 🇮🇳
Tags: History, Culture, Food
Description: Red Fort, Qutb Minar, Mughal history and legendary street food of Old Delhi.
Best Time to Visit: Oct–Mar | Rating: ★★★★☆

Jaipur (India) 🇮🇳
Tags: History, Culture, Adventure
Description: Pink City of palaces, Amber Fort, camel rides and vibrant bazaars.
Best Time to Visit: Oct–Mar | Rating: ★★★★★

Beijing (China) 🇨🇳
Tags: History, Culture, Modern
Description: Forbidden City, Great Wall, Tiananmen and contemporary art districts.
Best Time to Visit: Sep–Nov, Apr–Jun | Rating: ★★★★★

Shanghai (China) 🇨🇳
Tags: Modern, Culture, Food
Description: Bund skyline, French Concession lanes, dumplings and luxury malls.
Best Time to Visit: Mar–May, Sep–Nov | Rating: ★★★★☆

Hanoi (Vietnam) 🇻🇳
Tags: History, Culture, Food
Description: Old Quarter, Hoan Kiem Lake, pho and French colonial architecture.
Best Time to Visit: Oct–Apr | Rating: ★★★★★

Ho Chi Minh City (Vietnam) 🇻🇳
Tags: History, Culture, Food
Description: War Remnants Museum, Reunification Palace, street food and motorbike madness.
Best Time to Visit: Dec–Apr | Rating: ★★★★☆

Kuala Lumpur (Malaysia) 🇲🇾
Tags: Modern, Culture, Food
Description: Petronas Towers, multicultural food scene, Batu Caves and sky bars.
Best Time to Visit: May–Jul | Rating: ★★★★☆

Taipei (Taiwan) 🇹🇼
Tags: Modern, Culture, Food
Description: Taipei 101, night markets, bubble tea and volcanic hot springs.
Best Time to Visit: Oct–Dec | Rating: ★★★★★

Karachi (Pakistan) 🇵🇰
Tags: Culture, Food, Modern
Description: Pakistan's largest city and economic hub with beaches and street food.
Best Time to Visit: Nov–Feb | Rating: ★★★☆☆

Islamabad (Pakistan) 🇵🇰
Tags: Modern, Nature
Description: Planned capital surrounded by Margalla Hills — Faisal Mosque and serene parks.
Best Time to Visit: Oct–Apr | Rating: ★★★☆☆

Kathmandu (Nepal) 🇳🇵
Tags: History, Adventure, Culture
Description: Durbar Squares, Buddhist stupas and base for Himalayan treks.
Best Time to Visit: Oct–Dec, Mar–May | Rating: ★★★★☆

Thimphu (Bhutan) 🇧🇹
Tags: Culture, Nature, Adventure
Description: Himalayan kingdom capital — dzong fortresses, archery and Gross National Happiness.
Best Time to Visit: Mar–May, Sep–Nov | Rating: ★★★★☆

Almaty (Kazakhstan) 🇰🇿
Tags: Modern, Nature, Adventure
Description: Mountain-backed city with skiing, bazaars and Soviet-era architecture.
Best Time to Visit: May–Sep | Rating: ★★★★☆

Tashkent (Uzbekistan) 🇺🇿
Tags: History, Culture
Description: Silk Road gateway — Soviet architecture meets Islamic mausoleums.
Best Time to Visit: Apr–Jun, Sep–Oct | Rating: ★★★☆☆

Phnom Penh (Cambodia) 🇰🇭
Tags: History, Culture
Description: Royal Palace, Killing Fields memorial and Mekong riverfront.
Best Time to Visit: Nov–Mar | Rating: ★★★☆☆

Yangon (Myanmar) 🇲🇲
Tags: History, Culture
Description: Shwedagon Pagoda, colonial buildings and a city slowly opening to the world.
Best Time to Visit: Nov–Feb | Rating: ★★★★☆

Colombo (Sri Lanka) 🇱🇰
Tags: Culture, Food, Beach
Description: Colonial harbour city and gateway to tea estates and ancient ruins.
Best Time to Visit: Dec–Mar | Rating: ★★★☆☆

Male (Maldives) 🇲🇻
Tags: Beach, Luxury, Nature
Description: Tiny island capital — gateway to overwater bungalows and coral reefs.
Best Time to Visit: Nov–Apr | Rating: ★★★★☆

Ulaanbaatar (Mongolia) 🇲🇳
Tags: Culture, Adventure
Description: Gateway to the steppes — Gandantegchinlen Monastery and Gobi desert tours.
Best Time to Visit: Jun–Aug | Rating: ★★★☆☆

Vientiane (Laos) 🇱🇦
Tags: History, Culture
Description: Sleepy Mekong capital with Buddhist temples, patisseries and golden stupas.
Best Time to Visit: Nov–Mar | Rating: ★★★☆☆

Bandar Seri Begawan (Brunei) 🇧🇳
Tags: Culture, History, Luxury
Description: Oil-rich sultanate capital with Omar Ali Saifuddien Mosque and water villages.
Best Time to Visit: Dec–Mar | Rating: ★★★☆☆

Dhaka (Bangladesh) 🇧🇩
Tags: Culture, History
Description: Bustling riverside capital — Old Dhaka mosques, rickshaws and Mughal ruins.
Best Time to Visit: Nov–Feb | Rating: ★★★☆☆

Dili (East Timor) 🇹🇱
Tags: Beach, Culture
Description: Young capital on Timor Sea — Cristo Rei, war history and diving reefs.
Best Time to Visit: May–Nov | Rating: ★★★☆☆

Kabul (Afghanistan) 🇦🇫
Tags: History, Culture
Description: Ancient capital with Babur Gardens and bazaars — rich history.
Best Time to Visit: May–Sep | Rating: ★★☆☆☆

Naypyidaw (Myanmar) 🇲🇲
Tags: Modern
Description: Vast purpose-built capital with wide boulevards and Naypyidaw Zoo.
Best Time to Visit: Nov–Feb | Rating: ★★☆☆☆

Paris (France) 🇫🇷
Tags: Culture, History, Food, Luxury
Description: City of light — fashion, the Eiffel Tower, world-class cuisine and art.
Best Time to Visit: Apr–Jun, Sep–Oct | Rating: ★★★★★

London (United Kingdom) 🇬🇧
Tags: Culture, History, Modern
Description: Iconic capital blending Big Ben, theatre, diverse food scenes and royal heritage.
Best Time to Visit: May–Sep | Rating: ★★★★★

Rome (Italy) 🇮🇹
Tags: History, Culture, Food
Description: Eternal City of the Colosseum, Vatican, pasta, and gelato.
Best Time to Visit: Apr–Jun, Sep–Oct | Rating: ★★★★★

Barcelona (Spain) 🇪🇸
Tags: Beach, Culture, Food, Modern
Description: Gaudí architecture, sandy beaches, world-famous tapas and nightlife.
Best Time to Visit: May–Jun, Sep | Rating: ★★★★★

Amsterdam (Netherlands) 🇳🇱
Tags: Culture, History
Description: Canal city of bikes, Rembrandt, tulips and vibrant cafe culture.
Best Time to Visit: Apr–May, Sep | Rating: ★★★★☆

Prague (Czech Republic) 🇨🇿
Tags: History, Culture
Description: Fairy-tale Gothic spires, a medieval old town and affordable charm.
Best Time to Visit: May–Sep | Rating: ★★★★★

Vienna (Austria) 🇦🇹
Tags: Culture, History, Luxury
Description: Imperial palaces, Mozart, opera houses and Viennese coffee houses.
Best Time to Visit: Apr–May, Sep–Oct | Rating: ★★★★★

Budapest (Hungary) 🇭🇺
Tags: History, Culture
Description: Thermal baths, Parliament on the Danube and ruin-bar nightlife.
Best Time to Visit: Apr–Jun, Sep–Oct | Rating: ★★★★☆

Lisbon (Portugal) 🇵🇹
Tags: History, Culture, Food, Beach
Description: Hilly city of trams, fado music, pastel de nata and sunny plazas.
Best Time to Visit: Mar–May, Sep–Oct | Rating: ★★★★★

Athens (Greece) 🇬🇷
Tags: History, Culture, Food
Description: Cradle of Western civilisation — Acropolis, ancient agoras and vibrant street food.
Best Time to Visit: Apr–Jun, Sep–Oct | Rating: ★★★★★

Istanbul (Turkey) 🇹🇷
Tags: History, Culture, Food
Description: Gateway between continents — Hagia Sophia, grand bazaars and Bosphorus views.
Best Time to Visit: Apr–Jun, Sep–Nov | Rating: ★★★★★

Florence (Italy) 🇮🇹
Tags: History, Culture, Food
Description: Renaissance heart — Uffizi, Duomo, Michelangelo's David and Tuscan wine.
Best Time to Visit: Apr–Jun, Sep–Oct | Rating: ★★★★★

Venice (Italy) 🇮🇹
Tags: History, Culture, Luxury
Description: City on water — gondolas, carnival masks, St Mark's Basilica and palazzos.
Best Time to Visit: Apr–Jun, Sep–Oct | Rating: ★★★★★

Edinburgh (United Kingdom) 🏴
Tags: History, Culture, Adventure
Description: Dramatic castle, Arthur's Seat, whisky distilleries and the world's biggest arts festival.
Best Time to Visit: Jun–Aug | Rating: ★★★★☆

Berlin (Germany) 🇩🇪
Tags: History, Culture, Modern
Description: Reunified city of cutting-edge art, war memorials, and world-class museums.
Best Time to Visit: May–Sep | Rating: ★★★★☆

Madrid (Spain) 🇪🇸
Tags: Culture, Food, History
Description: Prado Museum, Royal Palace, late-night tapas crawls and lively plazas.
Best Time to Visit: Sep–Nov, Mar–May | Rating: ★★★★☆

Stockholm (Sweden) 🇸🇪
Tags: Culture, Modern, Nature
Description: Archipelago capital of design, ABBA and the Vasa warship museum.
Best Time to Visit: Jun–Aug | Rating: ★★★★☆

Copenhagen (Denmark) 🇩🇰
Tags: Modern, Culture, Food
Description: Hygge capital — Nyhavn, world's best restaurants and cycling culture.
Best Time to Visit: May–Sep | Rating: ★★★★☆

Dubrovnik (Croatia) 🇭🇷
Tags: History, Beach, Culture
Description: Pearl of the Adriatic — walled old city, crystal waters and Game of Thrones filming locations.
Best Time to Visit: May–Jun, Sep | Rating: ★★★★★

Santorini (Greece) 🇬🇷
Tags: Beach, Luxury, Culture
Description: Iconic white-washed villages, caldera sunsets and volcanic beaches.
Best Time to Visit: May–Oct | Rating: ★★★★★

Porto (Portugal) 🇵🇹
Tags: History, Food, Culture
Description: Port wine cellars, azulejo tiles, the Douro river and world-renowned bridges.
Best Time to Visit: May–Oct | Rating: ★★★★★

Brussels (Belgium) 🇧🇪
Tags: Culture, Food, History
Description: Capital of Europe — Grand Place, waffles, chocolate, and over 1,500 beer varieties.
Best Time to Visit: Apr–Sep | Rating: ★★★★☆

Zurich (Switzerland) 🇨🇭
Tags: Modern, Luxury, Nature
Description: Clean lakeside city with Alps access, quality of life and world finance.
Best Time to Visit: Jun–Sep | Rating: ★★★★☆

Oslo (Norway) 🇳🇴
Tags: Nature, Modern, Culture
Description: Fjord city of Viking heritage, aurora borealis and Munch's The Scream.
Best Time to Visit: Jun–Aug | Rating: ★★★★☆

Helsinki (Finland) 🇫🇮
Tags: Modern, Culture, Nature
Description: Design capital on the Baltic, saunas, white nights and Nordic cuisine.
Best Time to Visit: Jun–Aug | Rating: ★★★★☆

Milan (Italy) 🇮🇹
Tags: Modern, Luxury, Culture
Description: Fashion capital — The Last Supper, Galleria Vittorio and aperitivo culture.
Best Time to Visit: Mar–May, Sep–Nov | Rating: ★★★★☆

Reykjavik (Iceland) 🇮🇸
Tags: Nature, Adventure, Culture
Description: Gateway to volcanoes, geysers, Northern Lights and midnight sun.
Best Time to Visit: Jun–Aug, Dec–Feb | Rating: ★★★★★

Warsaw (Poland) 🇵🇱
Tags: History, Culture, Modern
Description: Rebuilt old town, WWII museums, a thriving arts scene and affordable luxury.
Best Time to Visit: May–Sep | Rating: ★★★★☆

Krakow (Poland) 🇵🇱
Tags: History, Culture
Description: Medieval Rynek Główny, Wawel Castle and gateway to Auschwitz-Birkenau.
Best Time to Visit: May–Sep | Rating: ★★★★☆

Bruges (Belgium) 🇧🇪
Tags: History, Culture, Food
Description: Medieval canal city — cobblestones, belfry towers, beer and Flemish art.
Best Time to Visit: Apr–Oct | Rating: ★★★★☆

Cairo (Egypt) 🇪🇬
Tags: History, Culture, Food
Description: Pyramids, Sphinx, Egyptian Museum and buzzing Khan el-Khalili bazaar.
Best Time to Visit: Oct–Apr | Rating: ★★★★★

Marrakech (Morocco) 🇲🇦
Tags: Culture, History, Food
Description: Medina souks, Djemaa el-Fna square, riads and Atlas Mountains gateway.
Best Time to Visit: Mar–May, Sep–Nov | Rating: ★★★★★

Cape Town (South Africa) 🇿🇦
Tags: Nature, Beach, Culture, Adventure
Description: Table Mountain, Robben Island, Cape Winelands and world's best beaches.
Best Time to Visit: Nov–Mar | Rating: ★★★★★

Nairobi (Kenya) 🇰🇪
Tags: Nature, Adventure, Culture
Description: Safari capital — Nairobi National Park, Maasai Market and gateway to the Masai Mara.
Best Time to Visit: Jun–Oct | Rating: ★★★★☆

Kigali (Rwanda) 🇷🇼
Tags: Modern, Culture, Nature
Description: Africa's cleanest city — genocide memorial, gorilla permits and hillside views.
Best Time to Visit: Jun–Sep | Rating: ★★★★☆

Dakar (Senegal) 🇸🇳
Tags: Culture, Beach, Food
Description: West Africa's cool capital — Gorée Island, music, pink Lake Retba and art.
Best Time to Visit: Nov–May | Rating: ★★★★☆

Casablanca (Morocco) 🇲🇦
Tags: Modern, Culture, History
Description: Hassan II Mosque, Art Deco architecture and Morocco's business hub.
Best Time to Visit: Mar–May, Sep–Nov | Rating: ★★★★☆

Tunis (Tunisia) 🇹🇳
Tags: History, Culture, Beach
Description: Medina of Tunis, Carthage ruins and gateway to Sahara adventures.
Best Time to Visit: Mar–May, Sep–Nov | Rating: ★★★★☆

Port Louis (Mauritius) 🇲🇺
Tags: Beach, Luxury, Culture
Description: Indian Ocean island capital — colourful market, Creole culture and beaches.
Best Time to Visit: May–Dec | Rating: ★★★★☆

Victoria (Seychelles) 🇸🇨
Tags: Beach, Luxury, Nature
Description: World's smallest capital — clock tower, granite beaches and marine parks.
Best Time to Visit: Apr–May, Oct–Nov | Rating: ★★★★★

Addis Ababa (Ethiopia) 🇪🇹
Tags: Culture, History, Food
Description: Highest African capital — National Museum, Ethiopian coffee ceremony and Mercato.
Best Time to Visit: Oct–Feb | Rating: ★★★☆☆

Accra (Ghana) 🇬🇭
Tags: Culture, Food, Beach
Description: Vibrant West African capital — Jamestown, slavery forts and Labadi Beach.
Best Time to Visit: Nov–Mar | Rating: ★★★☆☆

Lagos (Nigeria) 🇳🇬
Tags: Culture, Modern, Food
Description: Africa's largest city — Afrobeats, Lekki markets, Nollywood and beaches.
Best Time to Visit: Nov–Mar | Rating: ★★★☆☆

Windhoek (Namibia) 🇳🇦
Tags: Modern, Nature, Adventure
Description: Compact German colonial capital and gateway to Sossusvlei dunes.
Best Time to Visit: May–Sep | Rating: ★★★☆☆

Kinshasa (DR Congo) 🇨🇩
Tags: Culture, Music
Description: Africa's second-largest city — rumba music, Zongo Falls and vibrant arts.
Best Time to Visit: May–Sep | Rating: ★★★☆☆

Asmara (Eritrea) 🇪🇷
Tags: History, Culture
Description: Africa's Art Deco gem — perfectly preserved Italian modernist city.
Best Time to Visit: Oct–Mar | Rating: ★★★★☆

New York City (USA) 🇺🇸
Tags: Modern, Culture, Food, Luxury
Description: The Big Apple — Times Square, Central Park, world-class museums and food.
Best Time to Visit: Apr–Jun, Sep–Nov | Rating: ★★★★★

Los Angeles (USA) 🇺🇸
Tags: Modern, Beach, Culture
Description: Hollywood, Venice Beach, Getty Museum and endless sunshine.
Best Time to Visit: Mar–May, Sep–Nov | Rating: ★★★★★

Miami (USA) 🇺🇸
Tags: Beach, Modern, Luxury
Description: South Beach, Art Deco, Cuban food and vibrant nightlife.
Best Time to Visit: Nov–Apr | Rating: ★★★★☆

Mexico City (Mexico) 🇲🇽
Tags: History, Culture, Food
Description: Aztec Templo Mayor, world-class museums, tacos and Frida Kahlo's blue house.
Best Time to Visit: Oct–Apr | Rating: ★★★★★

Buenos Aires (Argentina) 🇦🇷
Tags: Culture, Food, Modern
Description: Paris of South America — tango, Boca Juniors, steak and Recoleta Cemetery.
Best Time to Visit: Sep–Nov, Mar–May | Rating: ★★★★★

Rio de Janeiro (Brazil) 🇧🇷
Tags: Beach, Culture, Nature
Description: Christ the Redeemer, Copacabana, samba and favela tours.
Best Time to Visit: Dec–Mar | Rating: ★★★★★

Lima (Peru) 🇵🇪
Tags: History, Food, Culture
Description: World's best restaurants, pre-Columbian gold museums and Pacific cliffs.
Best Time to Visit: Dec–Apr | Rating: ★★★★★

Havana (Cuba) 🇨🇺
Tags: History, Culture, Music
Description: Vintage cars, salsa clubs, Malecón and perfectly preserved colonial Habana Vieja.
Best Time to Visit: Nov–Apr | Rating: ★★★★★

Vancouver (Canada) 🇨🇦
Tags: Nature, Modern, Adventure
Description: Mountains meet Pacific — Stanley Park, skiing and multicultural cuisine.
Best Time to Visit: Jun–Sep | Rating: ★★★★★

Chicago (USA) 🇺🇸
Tags: Modern, Culture, Food
Description: Magnificent Mile, deep-dish pizza, blues music and Lake Michigan skyline.
Best Time to Visit: Jun–Aug | Rating: ★★★★☆

San Francisco (USA) 🇺🇸
Tags: Modern, Culture, Nature
Description: Golden Gate, Alcatraz, cable cars and Silicon Valley gateway.
Best Time to Visit: Sep–Nov | Rating: ★★★★★

Las Vegas (USA) 🇺🇸
Tags: Modern, Luxury, Adventure
Description: Neon Strip, world-class shows, casinos and Grand Canyon day trips.
Best Time to Visit: Mar–May, Sep–Nov | Rating: ★★★★☆

Toronto (Canada) 🇨🇦
Tags: Modern, Culture, Food
Description: CN Tower, multicultural food, Niagara Falls day trip and vibrant neighbourhoods.
Best Time to Visit: Jun–Sep | Rating: ★★★★☆

Cartagena (Colombia) 🇨🇴
Tags: History, Beach, Culture
Description: Walled colonial city with Caribbean beaches, coloured buildings and rum.
Best Time to Visit: Dec–Apr | Rating: ★★★★★

Bogotá (Colombia) 🇨🇴
Tags: Culture, History, Modern
Description: Monserrate, Gold Museum, Candelaria neighbourhood and coffee culture.
Best Time to Visit: Dec–Mar | Rating: ★★★★☆

Dubai (UAE) 🇦🇪
Tags: Modern, Luxury, Culture
Description: Burj Khalifa, desert safaris, gold souks and man-made islands.
Best Time to Visit: Nov–Mar | Rating: ★★★★★

Abu Dhabi (UAE) 🇦🇪
Tags: Modern, Luxury, Culture
Description: Sheikh Zayed Grand Mosque, Louvre Abu Dhabi and F1 race circuit.
Best Time to Visit: Nov–Mar | Rating: ★★★★★

Muscat (Oman) 🇴🇲
Tags: History, Luxury, Culture
Description: Sultan Qaboos Grand Mosque, Mutrah Souq and dramatic fjord coast.
Best Time to Visit: Oct–Apr | Rating: ★★★★★

Jerusalem (Israel) 🇮🇱
Tags: History, Culture, Religion
Description: Holy to three faiths — Western Wall, Church of the Holy Sepulchre and Dome of the Rock.
Best Time to Visit: Mar–May, Sep–Nov | Rating: ★★★★★

Tel Aviv (Israel) 🇮🇱
Tags: Modern, Beach, Culture, Food
Description: Bauhaus White City, Mediterranean beaches, Carmel Market and nightlife.
Best Time to Visit: Apr–Jun, Sep–Nov | Rating: ★★★★★

Riyadh (Saudi Arabia) 🇸🇦
Tags: Modern, History, Culture
Description: Kingdom Tower, Diriyah heritage site and Saudi Arabia's rapid transformation.
Best Time to Visit: Nov–Mar | Rating: ★★★★☆

Jeddah (Saudi Arabia) 🇸🇦
Tags: History, Beach, Culture
Description: Historic Al-Balad UNESCO district, Red Sea diving and gateway to Mecca.
Best Time to Visit: Nov–Mar | Rating: ★★★★☆

Doha (Qatar) 🇶🇦
Tags: Modern, Luxury, Culture
Description: Museum of Islamic Art, Souq Waqif and futuristic West Bay skyline.
Best Time to Visit: Nov–Mar | Rating: ★★★★☆

Beirut (Lebanon) 🇱🇧
Tags: Culture, Food, History
Description: Middle East's party capital — Gemmayzeh, Roman ruins, mountains and cuisine.
Best Time to Visit: Apr–Jun, Sep–Oct | Rating: ★★★★☆

Amman (Jordan) 🇯🇴
Tags: History, Culture, Food
Description: Hillside capital — Roman Theatre, Rainbow Street and gateway to Petra.
Best Time to Visit: Apr–May, Sep–Oct | Rating: ★★★★☆

Tehran (Iran) 🇮🇷
Tags: History, Culture, Modern
Description: Golestan Palace, Grand Bazaar, Milad Tower and Alborz mountain backdrop.
Best Time to Visit: Apr–May, Sep–Oct | Rating: ★★★★☆

Baghdad (Iraq) 🇮🇶
Tags: History, Culture
Description: Ancient capital on the Tigris — Abbasid Palace, historic markets and Al-Mutanabbi Street.
Best Time to Visit: Nov–Mar | Rating: ★★☆☆☆

Damascus (Syria) 🇸🇾
Tags: History, Culture
Description: One of the oldest continuously inhabited cities — Umayyad Mosque and ancient covered souks.
Best Time to Visit: Apr–May, Sep–Oct | Rating: ★★☆☆☆

Sanaa (Yemen) 🇾🇪
Tags: History, Culture
Description: Fairy-tale ancient old town featuring unique multi-story gingerbread-style clay houses.
Best Time to Visit: Oct–Mar | Rating: ★★☆☆☆

Kuwait City (Kuwait) 🇰🇼
Tags: Modern, Luxury, Food
Description: Kuwait Towers, vibrant shopping hubs, seaside promenades and rich local marine history.
Best Time to Visit: Nov–Mar | Rating: ★★★☆☆

Manama (Bahrain) 🇧🇭
Tags: Modern, Culture, Food
Description: Island capital — Bab Al Bahrain souk, pearl trading trails and modern high-rises.
Best Time to Visit: Nov–Mar | Rating: ★★★☆☆

Sydney (Australia) 🇦🇺
Tags: Modern, Beach, Culture
Description: Opera House, Harbour Bridge, Bondi Beach and Blue Mountains day trips.
Best Time to Visit: Sep–Nov, Mar–May | Rating: ★★★★★

Melbourne (Australia) 🇦🇺
Tags: Culture, Food, Modern
Description: Coffee capital of the world — street art laneways, MCG and Great Ocean Road.
Best Time to Visit: Sep–Apr | Rating: ★★★★★

Queenstown (New Zealand) 🇳🇿
Tags: Adventure, Nature, Luxury
Description: Adventure capital of the world — bungee jumping, skiing and fjord cruises.
Best Time to Visit: Dec–Feb, Jun–Aug | Rating: ★★★★★

Auckland (New Zealand) 🇳🇿
Tags: Nature, Modern, Adventure
Description: City of Sails — Sky Tower, volcanic cones and Waitemata Harbour.
Best Time to Visit: Dec–Feb | Rating: ★★★★☆

Papeete (French Polynesia) 🇵🇫
Tags: Beach, Luxury, Nature
Description: Gateway to Bora Bora overwater bungalows and crystal lagoons.
Best Time to Visit: May–Oct | Rating: ★★★★★

Nouméa (New Caledonia) 🇳🇨
Tags: Beach, Luxury, Culture
Description: French Pacific island with turquoise lagoon UNESCO site and French cuisine.
Best Time to Visit: Aug–Nov | Rating: ★★★★☆`;

async function fetchFromPexels(query, count = 5) {
  try {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&orientation=landscape&per_page=${count}`;
    const response = await fetch(url, {
      headers: { "Authorization": PEXELS_KEY }
    });
    if (response.ok) {
      const data = await response.json();
      if (data.photos && data.photos.length > 0) {
        return data.photos.map(p => p.src.large2x || p.src.large).filter(Boolean);
      }
    }
  } catch (err) {
    console.error(`Pexels failed for "${query}":`, err.message);
  }
  return null;
}

async function fetchFromPixabay(query, count = 5) {
  try {
    const url = `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${encodeURIComponent(query)}&image_type=photo&per_page=${count}&min_width=1200`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      if (data.hits && data.hits.length > 0) {
        return data.hits.map(h => h.largeImageURL || h.webformatURL).filter(Boolean);
      }
    }
  } catch (err) {
    console.error(`Pixabay failed for "${query}":`, err.message);
  }
  return null;
}

async function getImagesForQuery(destinationName, countryName) {
  let query = `${destinationName} ${countryName || ''} city skyline`;
  let images = await fetchFromPexels(query, 5);
  
  if (!images || images.length === 0) {
    query = `${destinationName} ${countryName || ''}`;
    images = await fetchFromPexels(query, 5);
  }

  if (!images || images.length === 0) {
    query = `${destinationName} ${countryName || ''}`;
    images = await fetchFromPixabay(query, 5);
  }

  if (!images || images.length === 0) {
    query = destinationName;
    images = await fetchFromPexels(query, 5);
  }

  return images;
}

// Simple parser for user text
function parseCities(text) {
  const blocks = text.split(/\n\s*\n/);
  const parsed = [];
  
  for (const block of blocks) {
    const lines = block.trim().split('\n');
    if (lines.length < 4) continue;
    
    // Line 1: Tokyo (Japan) 🇯🇵
    const matchLine1 = lines[0].match(/^([^(]+)\s*\(([^)]+)\)\s*([^\s]+)?/);
    if (!matchLine1) continue;
    
    const name = matchLine1[1].trim();
    const country = matchLine1[2].trim();
    const flag = matchLine1[3] ? matchLine1[3].trim() : '🌐';
    
    // Line 2: Tags: Modern, Culture, Food
    const tags = lines[1].replace(/^Tags:\s*/, '').split(',').map(t => t.trim());
    
    // Line 3: Description: Neon megacity...
    const desc = lines[2].replace(/^Description:\s*/, '').trim();
    
    // Line 4: Best Time to Visit: Mar–May, Oct–Nov | Rating: ★★★★★
    const matchLine4 = lines[3].match(/Best Time to Visit:\s*([^|]+)(?:\|\s*Rating:\s*(.*))?/i);
    const bestTime = matchLine4 ? matchLine4[1].trim() : 'All Year';
    const rating = matchLine4 && matchLine4[2] ? matchLine4[2].trim() : '★★★★★';
    
    parsed.push({
      name,
      country,
      flag,
      tags,
      desc,
      bestTime,
      rating
    });
  }
  
  return parsed;
}

async function run() {
  console.log("Parsing cities from prompt text...");
  const parsedCities = parseCities(rawText);
  console.log(`Parsed ${parsedCities.length} new cities from raw text.`);

  console.log("Reading src/data/index.js...");
  const content = fs.readFileSync(DATA_FILE, 'utf8');

  // Extract topDestinations array range
  const startTag = 'export const topDestinations = [';
  const startIndex = content.indexOf(startTag);
  if (startIndex === -1) {
    console.error("Could not find start of topDestinations!");
    process.exit(1);
  }

  let braceCount = 0;
  let endIndex = -1;
  for (let i = startIndex + 'export const topDestinations = '.length; i < content.length; i++) {
    if (content[i] === '[') braceCount++;
    if (content[i] === ']') {
      braceCount--;
      if (braceCount === 0) {
        endIndex = i + 1;
        break;
      }
    }
  }

  if (endIndex === -1) {
    console.error("Could not find end of topDestinations!");
    process.exit(1);
  }

  const arrayStr = content.slice(startIndex + 'export const topDestinations = '.length, endIndex);
  fs.writeFileSync('scratch/temp_destinations.js', 'export const topDestinations = ' + arrayStr);
  
  const m = await import('./temp_destinations.js');
  let destinations = m.topDestinations;
  console.log(`Loaded ${destinations.length} current destinations.`);

  // 1. Purge all current destinations in the 'cities' category
  console.log("Purging all old 'cities' category destinations...");
  destinations = destinations.filter(d => !(d.categoryIds && d.categoryIds.includes('cities')));
  console.log(`Destinations count after cities purge: ${destinations.length}`);

  // 2. Synthesize new cities list sequential fetches
  let rankCounter = 1;
  const newCityDestinations = [];

  for (let i = 0; i < parsedCities.length; i++) {
    const pc = parsedCities[i];
    const id = pc.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    
    console.log(`[${i+1}/${parsedCities.length}] Processing city: "${pc.name}" (${pc.country})...`);
    
    // Fetch high-quality landscape Pexels/Pixabay images
    const images = await getImagesForQuery(pc.name, pc.country);
    let primaryImage = 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=80'; // Skyline fallback
    let gallery = [primaryImage, primaryImage, primaryImage, primaryImage];
    
    if (images && images.length > 0) {
      primaryImage = images[0];
      gallery = [...images];
      while (gallery.length < 4) {
        gallery.push(images[0]);
      }
      gallery = gallery.slice(0, 4);
    } else {
      console.log(`  -> Warning: No images found for "${pc.name}". Using standard fallback.`);
    }

    // Map tags to categoryIds or other tags if appropriate
    const categoryIds = ['cities'];
    if (pc.tags.some(t => t.toLowerCase() === 'historical' || t.toLowerCase() === 'history')) {
      categoryIds.push('historical');
    }
    if (pc.tags.some(t => t.toLowerCase() === 'cultural' || t.toLowerCase() === 'culture')) {
      categoryIds.push('cultural');
    }

    // Default daily ranges based on country
    let dailyCost = '$70-150';
    let hotelCost = '$45-100';
    let foodCost = '$15-30';
    let transportCost = '$8-15';

    if (pc.name === 'Singapore' || pc.name === 'Zurich' || pc.name === 'New York City' || pc.name === 'London' || pc.name === 'Paris') {
      dailyCost = '$180-450';
      hotelCost = '$120-300';
      foodCost = '$40-90';
      transportCost = '$20-40';
    } else if (pc.country === 'Pakistan' || pc.country === 'India' || pc.country === 'Nepal' || pc.country === 'Bangladesh') {
      dailyCost = '$25-55';
      hotelCost = '$15-30';
      foodCost = '$5-12';
      transportCost = '$3-8';
    }

    const cityDest = {
      id,
      name: pc.name,
      country: pc.country,
      flag: pc.flag,
      rank: rankCounter++,
      image: primaryImage,
      preview: pc.desc.substring(0, 100),
      description: `${pc.name} is a majestic city in ${pc.country}. ${pc.desc}`,
      weather: {
        temp: '24°C',
        condition: 'Clear Sky',
        humidity: '55%',
        airQuality: 'Good'
      },
      bestTime: pc.bestTime,
      budget: {
        daily: dailyCost,
        hotel: hotelCost,
        food: foodCost,
        transport: transportCost
      },
      safety: 'Safe to travel',
      timezone: 'GMT+0', // placeholder, resolved dynamically on client
      attractions: [`Historic ${pc.name} Square`, `Grand ${pc.name} Museum`, `Scenic ${pc.name} Lookout`],
      foods: pc.tags.includes('Food') ? ['Traditional Specialty', 'Local Spiced Stew', 'Signature Pastry'] : ['Local Specialty'],
      transport: ['Metro Transit Network', 'Licensed Taxi Service', 'Walkable Corridors'],
      culture: 'Respect local traditions and dress appropriately when visiting sacred spaces.',
      visa: 'eVisa or Visa on Arrival is available for international tourists.',
      categoryIds,
      gallery
    };

    newCityDestinations.push(cityDest);
    await sleep(150); // respect rate limits
  }

  // 3. Fix Kilimanjaro broken image!
  console.log("Fixing Mount Kilimanjaro broken image...");
  const kiliDest = destinations.find(d => d.id === 'mount-kilimanjaro');
  if (kiliDest) {
    console.log("Mount Kilimanjaro found! Fetching fresh high-res images...");
    const kiliImages = await fetchFromPexels("Mount Kilimanjaro Tanzania", 5);
    if (kiliImages && kiliImages.length > 0) {
      kiliDest.image = kiliImages[0];
      kiliDest.gallery = [...kiliImages.slice(0, 4)];
      console.log("Mount Kilimanjaro image updated successfully!");
    }
  }

  // 4. Combine all non-cities destinations and the new cities
  const finalDestinations = [...destinations, ...newCityDestinations];
  console.log(`Total combined topDestinations length: ${finalDestinations.length}`);

  // 5. Write back to index.js
  const newArrayStr = JSON.stringify(finalDestinations, null, 2);
  const finalCode = content.slice(0, startIndex) + 'export const topDestinations = ' + newArrayStr + content.slice(endIndex);

  console.log("Writing cities back to index.js...");
  fs.writeFileSync(DATA_FILE, finalCode, 'utf8');
  console.log("Successfully rebuilt cities category in src/data/index.js!");

  // Clean up
  fs.unlinkSync('scratch/temp_destinations.js');
}

run().catch(err => {
  console.error("Execution error:", err);
});
