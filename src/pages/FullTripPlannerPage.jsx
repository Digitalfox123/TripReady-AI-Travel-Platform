import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Compass, MapPin, Calendar, Users, Wallet, Plane, ChevronDown, Globe, 
  Sun, Moon, Sunrise, Sunset, Star, ArrowRight, ArrowLeft, Plus, Check, Play, Pause, Eye, X,
  Map, Sparkles, AlertCircle, Info, ShieldAlert, CloudRain, Clock, 
  Camera, Printer, Coffee, Utensils, Heart, ChevronRight, Activity, 
  CheckCircle, Briefcase, Gem, Flame, Mountain, TreePine, Castle,
  Music, ShoppingBag, Landmark, HelpCircle, PhoneCall, Gift, Search, Trash, Smartphone, Train, Car, Ticket, Shield,
  ExternalLink, TrendingUp, DollarSign, FileText, Lock, Folder
} from 'lucide-react';
import { countries, topDestinations, currencies } from '../data';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';
import { getGeminiApiKey, saveGeminiApiKey, hasGeminiKey, askGemini, repairJson } from '../utils/gemini';
import { getCityImage } from '../utils/imageLookup';
import { getPipelineImage } from '../utils/imagePipeline';
import ImageWithWatermark from '../components/ImageWithWatermark';
import TransportAppLogo from '../components/TransportAppLogo';
import UmrahGuideCard from '../components/UmrahGuideCard';
import YouTubeTravelSection from '../components/YouTubeTravelSection';
import { getTransportDataForDest } from './DestinationPage';
import { cityDatabase } from '../data/cityDatabase';
import { fetchLiveFlights, fetchLiveCarRentals, fetchLiveVisaRequirement, simulateVisaRequirement } from '../utils/rapidApiService';
import { attractionKnowledgeBase, realCityFoodAndTransit } from '../data/attractionKnowledgeBase';

// ============================================
// DYNAMIC COMPREHENSIVE GENERATION DICTIONARY
// ============================================
function generateRealisticFlights(originCity, originCountry, destCity, destCountry, budgetTier) {
  const oCountry = (originCountry || '').toLowerCase();
  const dCountry = (destCountry || '').toLowerCase();
  const isDomestic = oCountry === dCountry;

  const isEurope = (c) => ['france', 'italy', 'spain', 'germany', 'united kingdom', 'greece', 'portugal', 'switzerland', 'croatia', 'hungary', 'norway', 'iceland', 'turkey'].some(x => c.includes(x));
  const isNorthAmerica = (c) => ['united states', 'usa', 'canada', 'mexico'].some(x => c.includes(x));
  const isMiddleEast = (c) => ['saudi', 'arabia', 'uae', 'emirates', 'egypt', 'jordan', 'qatar', 'kuwait', 'bahrain', 'oman'].some(x => c.includes(x));
  const isAsia = (c) => ['japan', 'korea', 'china', 'india', 'pakistan', 'indonesia', 'thailand', 'vietnam', 'malaysia', 'singapore', 'philippines', 'cambodia'].some(x => c.includes(x));

  let flightType = 'longhaul';
  if (isDomestic) {
    flightType = 'domestic';
  } else if (
    (isEurope(oCountry) && isEurope(dCountry)) ||
    (isNorthAmerica(oCountry) && isNorthAmerica(dCountry)) ||
    (isMiddleEast(oCountry) && isMiddleEast(dCountry)) ||
    (isAsia(oCountry) && isAsia(dCountry))
  ) {
    flightType = 'regional';
  }

  let airlines = [];
  if (isDomestic) {
    if (oCountry.includes('united states') || oCountry.includes('usa')) {
      airlines = [
        { name: 'Delta Air Lines', prefix: 'DL' },
        { name: 'American Airlines', prefix: 'AA' },
        { name: 'United Airlines', prefix: 'UA' },
        { name: 'Southwest Airlines', prefix: 'WN' },
        { name: 'JetBlue Airways', prefix: 'B6' }
      ];
    } else if (oCountry.includes('pakistan')) {
      airlines = [
        { name: 'Pakistan International', prefix: 'PK' },
        { name: 'AirSial', prefix: 'PF' },
        { name: 'Serene Air', prefix: 'ER' },
        { name: 'Fly Jinnah', prefix: '9P' },
        { name: 'Airblue', prefix: 'PA' }
      ];
    } else if (oCountry.includes('india')) {
      airlines = [
        { name: 'IndiGo', prefix: '6E' },
        { name: 'Air India', prefix: 'AI' },
        { name: 'Akasa Air', prefix: 'QP' },
        { name: 'SpiceJet', prefix: 'SG' },
        { name: 'Vistara', prefix: 'UK' }
      ];
    } else if (oCountry.includes('australia')) {
      airlines = [
        { name: 'Qantas Airways', prefix: 'QF' },
        { name: 'Virgin Australia', prefix: 'VA' },
        { name: 'Jetstar', prefix: 'JQ' },
        { name: 'Rex Airlines', prefix: 'ZL' },
        { name: 'Link Airways', prefix: 'FC' }
      ];
    } else {
      airlines = [
        { name: 'National Carrier', prefix: 'NC' },
        { name: 'Regional Connect', prefix: 'RC' },
        { name: 'Metro Air Link', prefix: 'ML' },
        { name: 'FlyLocal Express', prefix: 'FL' },
        { name: 'JetExpress', prefix: 'JX' }
      ];
    }
  } else {
    if (flightType === 'regional') {
      if (isEurope(oCountry)) {
        airlines = [
          { name: 'Ryanair', prefix: 'FR' },
          { name: 'EasyJet', prefix: 'U2' },
          { name: 'Lufthansa', prefix: 'LH' },
          { name: 'Air France', prefix: 'AF' },
          { name: 'Wizz Air', prefix: 'W6' }
        ];
      } else if (isMiddleEast(oCountry)) {
        airlines = [
          { name: 'Flydubai', prefix: 'FZ' },
          { name: 'Air Arabia', prefix: 'G9' },
          { name: 'Gulf Air', prefix: 'GF' },
          { name: 'Jazeera Airways', prefix: 'J9' },
          { name: 'Flynas', prefix: 'XY' }
        ];
      } else if (isAsia(oCountry)) {
        airlines = [
          { name: 'AirAsia', prefix: 'AK' },
          { name: 'VietJet Air', prefix: 'VJ' },
          { name: 'Singapore Airlines', prefix: 'SQ' },
          { name: 'Thai Airways', prefix: 'TG' },
          { name: 'Batik Air', prefix: 'OD' }
        ];
      } else {
        airlines = [
          { name: 'Continental Shuttle', prefix: 'CS' },
          { name: 'Border Air', prefix: 'BA' },
          { name: 'FlyRegional', prefix: 'FR' },
          { name: 'InterJet', prefix: 'IJ' },
          { name: 'Transit Link', prefix: 'TL' }
        ];
      }
    } else {
      airlines = [
        { name: 'Emirates', prefix: 'EK' },
        { name: 'Singapore Airlines', prefix: 'SQ' },
        { name: 'Qatar Airways', prefix: 'QR' },
        { name: 'Lufthansa', prefix: 'LH' },
        { name: 'Turkish Airlines', prefix: 'TK' },
        { name: 'Cathay Pacific', prefix: 'CX' },
        { name: 'British Airways', prefix: 'BA' },
        { name: 'All Nippon Airways', prefix: 'NH' }
      ];
    }
  }

  let basePriceRange = [600, 1000];
  let baseDurRange = [7, 14];
  if (flightType === 'domestic') {
    basePriceRange = [100, 250];
    baseDurRange = [1, 4];
  } else if (flightType === 'regional') {
    basePriceRange = [180, 450];
    baseDurRange = [2, 6];
  }

  let tierMultiplier = 1.0;
  if (budgetTier === 'Budget') tierMultiplier = 0.7;
  else if (budgetTier === 'Mid-range') tierMultiplier = 1.0;
  else if (budgetTier === 'Luxury') tierMultiplier = 2.5;
  else if (budgetTier === 'Ultra Luxury') tierMultiplier = 5.0;

  const generateFlightNumber = (prefix) => {
    const num = Math.floor(100 + Math.random() * 900);
    return `${prefix}-${num}`;
  };

  const results = [];
  const count = Math.min(5, airlines.length);
  for (let i = 0; i < count; i++) {
    const airline = airlines[i];
    const code = generateFlightNumber(airline.prefix);
    const seed = (code.charCodeAt(3) || 0) + (code.charCodeAt(5) || 0);
    const durMinsTotal = Math.round(baseDurRange[0] * 60 + (seed % ((baseDurRange[1] - baseDurRange[0]) * 60)));
    const durHours = Math.floor(durMinsTotal / 60);
    const durMins = durMinsTotal % 60;
    const durStr = `${durHours}h ${durMins}m`;

    const rawPrice = Math.round((basePriceRange[0] + (seed % (basePriceRange[1] - basePriceRange[0]))) * tierMultiplier);
    
    const depSeed = (seed * 7) % 24;
    const depAMPM = depSeed < 12 ? 'AM' : 'PM';
    const depHourRaw = depSeed === 0 ? 12 : depSeed > 12 ? depSeed - 12 : depSeed;
    const depHour = depHourRaw < 10 ? `0${depHourRaw}` : depHourRaw;
    const depMin = (seed * 11) % 60;
    const depMinStr = depMin < 10 ? `0${depMin}` : depMin;
    const depTime = `${depHour}:${depMinStr} ${depAMPM}`;

    const arrTimeRaw = (depSeed + Math.ceil(durMinsTotal / 60)) % 24;
    const arrAMPM = arrTimeRaw < 12 ? 'AM' : 'PM';
    const arrHourRaw = arrTimeRaw === 0 ? 12 : arrTimeRaw > 12 ? arrTimeRaw - 12 : arrTimeRaw;
    const arrHour = arrHourRaw < 10 ? `0${arrHourRaw}` : arrHourRaw;
    const arrMin = (depMin + durMins) % 60;
    const arrMinStr = arrMin < 10 ? `0${arrMin}` : arrMin;
    const arrTime = `${arrHour}:${arrMinStr} ${arrAMPM}`;

    let stops = 'Direct';
    if (durMinsTotal > 360) {
      const hubs = ['DXB', 'LHR', 'SIN', 'DOH', 'IST', 'ORD', 'HKG', 'CDG'];
      const stopHub = hubs[seed % hubs.length];
      stops = `1 Stop (${stopHub})`;
    }

    results.push({
      airline: airline.name,
      code,
      dep: depTime,
      arr: arrTime,
      dur: durStr,
      stops,
      price: rawPrice
    });
  }

  return results.sort((a, b) => a.price - b.price);
}

function getSeasonalCities() {
  const month = new Date().getMonth();
  let season = 'Summer';
  let desc = 'Peak summer season in the Northern Hemisphere. Perfect for coastal getaways, Alpine trekking, and cultural festivals.';
  let suggestions = [
    { name: 'Santorini', country: 'Greece', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=200&q=80', highlight: 'Sun-drenched cliffs & beaches' },
    { name: 'Zurich', country: 'Switzerland', image: 'https://images.unsplash.com/photo-1515488042361-404e9250afef?w=200&q=80', highlight: 'Crystal clear lake swimming' },
    { name: 'Kyoto', country: 'Japan', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=200&q=80', highlight: 'Gion summer festivals' },
    { name: 'Bali', country: 'Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=200&q=80', highlight: 'Perfect dry season beach weather' }
  ];

  if (month >= 8 && month <= 10) {
    season = 'Autumn';
    desc = 'Golden foliage and cooling breezes. Best for vineyard tours, historic temples, and scenic mountain road trips.';
    suggestions = [
      { name: 'Kyoto', country: 'Japan', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=200&q=80', highlight: 'Fiery red maple leaf canopies' },
      { name: 'Paris', country: 'France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=200&q=80', highlight: 'Golden gardens & cozy cafes' },
      { name: 'Rome', country: 'Italy', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=200&q=80', highlight: 'Comfortable crowds & architecture' },
      { name: 'New York', country: 'United States', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=200&q=80', highlight: 'Fall foliage in Central Park' }
    ];
  } else if (month === 11 || month === 0 || month === 1) {
    season = 'Winter';
    desc = 'Cozy winter escapes. Perfect for snowy ski fields, tropical sun retreats, and winter shopping festivals.';
    suggestions = [
      { name: 'Dubai', country: 'UAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=200&q=80', highlight: 'Pleasant warm desert safaris' },
      { name: 'Zermatt', country: 'Switzerland', image: 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?w=200&q=80', highlight: 'Pristine ski slopes & Matterhorn' },
      { name: 'Reykjavik', country: 'Iceland', image: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?w=200&q=80', highlight: 'Northern lights & geothermal pools' },
      { name: 'Bangkok', country: 'Thailand', image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=200&q=80', highlight: 'Cool breeze & golden temples' }
    ];
  } else if (month >= 2 && month <= 4) {
    season = 'Spring';
    desc = 'Bustling cherry blossoms, spring blooms, and mild temperatures. Perfect for botanical garden walks and old town markets.';
    suggestions = [
      { name: 'Tokyo', country: 'Japan', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=200&q=80', highlight: 'Cherry blossom (Sakura) season' },
      { name: 'Bordeaux', country: 'France', image: 'https://images.unsplash.com/photo-1513026705753-bc3fffca8bf4?w=200&q=80', highlight: 'Vineyard blooms & mild weather' },
      { name: 'Amsterdam', country: 'Netherlands', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=200&q=80', highlight: 'Vast colorful tulip fields' },
      { name: 'Lisbon', country: 'Portugal', image: 'https://images.unsplash.com/photo-1509840144524-f6790b5072b2?w=200&q=80', highlight: 'Mild sun & ocean breezes' }
    ];
  }

  return { season, desc, suggestions };
}
const CULINARY_DB = {
  tokyo: [
    { name: 'Sukiyabashi Jiro', type: 'Fine Dining (Sushi)', cost: '$$$$', rating: 4.9, tags: ['Michelin 3-Star', 'Authentic'], note: 'Requires months-ahead reservation. Unrivaled premium sushi.' },
    { name: 'Ichiran Shibuya', type: 'Casual (Tonkotsu Ramen)', cost: '$', rating: 4.7, tags: ['Solo Booths', 'Local Favorite'], note: 'Customizable rich pork broth with signature red sauce.' },
    { name: 'Gyukatsu Motomura', type: 'Mid-range (Deep-fried Beef)', cost: '$$', rating: 4.8, tags: ['Halal options', 'Unique style'], note: 'Sizzle your own stone-cooked medium beef cutlets.' },
  ],
  paris: [
    { name: 'Le Jules Verne', type: 'Luxury French Gastronomy', cost: '$$$$', rating: 4.8, tags: ['Eiffel Tower View', 'Michelin Star'], note: 'Elevated dining situated directly inside the Eiffel structure.' },
    { name: 'Angelina Paris', type: 'Charming Cafe (Hot Chocolate & Pastry)', cost: '$$', rating: 4.6, tags: ['Historic', 'World Famous'], note: 'Famous for its ultra-rich African hot chocolate and Mont-Blanc.' },
    { name: 'L\'As du Fallafel', type: 'Cheap Eats (Middle Eastern)', cost: '$', rating: 4.7, tags: ['Vegetarian', 'Fast Service'], note: 'Voted the finest falafel pita in the Marais district.' },
  ],
  bali: [
    { name: 'Locavore Ubud', type: 'Modern Gastronomy', cost: '$$$$', rating: 4.9, tags: ['Eco-Luxury', 'Organic'], note: '100% locally sourced premium hyper-seasonal tasting menu.' },
    { name: 'Naughty Nuri\'s', type: 'Casual BBQ Diner', cost: '$$', rating: 4.7, tags: ['Local Style', 'Signature Ribs'], note: 'Legendary flame-grilled sticky pork ribs with stellar martini shakes.' },
    { name: 'Warung Halal Bu Mi', type: 'Cheap Eats (Indonesian Buffet)', cost: '$', rating: 4.6, tags: ['Halal', 'Traditional'], note: 'Build your own plate from a massive array of cooked organic local recipes.' },
  ]
};

const DEFAULT_CULINARY = [
  { name: 'Horizon Luxury Skybar', type: 'Fine Dining & Lounge', cost: '$$$$', rating: 4.8, tags: ['Panoramic Views', 'Premium Chef'], note: 'Stunning elevated terrace serving gourmet international molecular gastronomy.' },
  { name: 'Bistro Green Leaf', type: 'Mid-range Local Fare', cost: '$$', rating: 4.6, tags: ['Vegetarian', 'Eco-friendly'], note: 'A cozy garden bistro using direct farm-to-table organic ingredients.' },
  { name: 'Street Food Bazaar', type: 'Cheap Eats & Market', cost: '$', rating: 4.7, tags: ['Local Favorites', 'Fast Service'], note: 'The central gathering hub for historical, time-tested quick recipes and treats.' },
];

const PACKING_BASE = [
  { name: 'Passport & Travel Authorization Documents', category: 'Essentials' },
  { name: 'Multi-Country Universal Power Adapter', category: 'Gear' },
  { name: 'Noise-Canceling Wireless Earphones', category: 'Gear' },
  { name: 'Personal Medical Kit & Prescription Medicines', category: 'Essentials' },
];

const INTEREST_ICONS = {
  Nature: TreePine,
  Beaches: PalmtreeIcon,
  'Historical Places': Castle,
  Museums: Landmark,
  Food: Utensils,
  Nightlife: WineIcon,
  Shopping: ShoppingBag,
  Luxury: Gem,
  Adventure: Flame,
  Hiking: Compass,
  Photography: Camera,
  'Local Culture': Globe,
  'Hidden Gems': Sparkles,
};

function PalmtreeIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M13 8c0-2.76-2.24-5-5-5S3 5.24 3 8" />
      <path d="M13 8c1.1 0 2-.9 2-2" />
      <path d="M13 8c0 3.31-2.69 6-6 6" />
      <path d="M13 12c1.66 0 3-1.34 3-3" />
      <path d="M13 12c0 3.87-3.13 7-7 7" />
      <path d="M2 22h12" />
      <path d="M10 22c0-4.42-3.58-8-8-8" />
      <path d="M18 12c1.66 0 3-1.34 3-3" />
      <path d="M18 8c0-2.76-2.24-5-5-5" />
      <path d="M18 8c1.1 0 2-.9 2-2" />
      <path d="M18 8c0 3.31-2.69 6-6 6" />
      <path d="M18 12c0 3.87-3.13 7-7 7" />
      <path d="M22 22H10" />
      <path d="M14 22c0-4.42-3.58-8-8-8" />
    </svg>
  );
}

function WineIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M8 22h8" />
      <path d="M7 10h10" />
      <path d="M12 15v7" />
      <path d="M12 15a5 5 0 0 0 5-5V3H7v7a5 5 0 0 0 5 5z" />
    </svg>
  );
}

// Curated authentic landmark database for key cities
const realCityData = {
  tokyo: {
    attractions: [
      'Shibuya Crossing & Hachiko Statue', 'Senso-ji Temple in Asakusa', 'Tokyo Skytree Observatory',
      'Meiji Jingu Shrine & Yoyogi Park', 'Shinjuku Gyoen National Garden', 'Tsukiji Outer Fish Market',
      'Akihabara Electric Town', 'Odaiba Seaside Park & Rainbow Bridge', 'Imperial Palace East Gardens',
      'Tokyo Tower & Zojo-ji Temple', 'Harajuku Takeshita Street', 'Ueno Park & National Museum',
      'Roppongi Hills Mori Art Museum', 'Ginza Luxury Shopping Boulevard', 'Yayoi Kusama Museum'
    ],
    foods: ['Tsukiji Sushi & Sashimi platter', 'Tonkotsu Ramen Bowl', 'Crispy Vegetable Tempura', 'Matcha Soft Serve & Wagashi', 'Yakitori skewers in Omoide Yokocho', 'Takoyaki & Okonomiyaki'],
    transports: ['Tokyo Subway Metro (Suica Card)', 'JR Yamanote Line Circular Train', 'Local Yellow Taxi fleet']
  },
  paris: {
    attractions: [
      'Eiffel Tower Summit', 'Louvre Museum Glass Pyramid', 'Notre-Dame Cathedral & Latin Quarter',
      'Arc de Triomphe & Champs-Élysées', 'Sainte-Chapelle Stained Glass', 'Sacré-Cœur Basilica in Montmartre',
      'Seine River Evening Dinner Cruise', 'Musée d\'Orsay Impressionist Art', 'Jardin du Luxembourg Palace',
      'Palace of Versailles Grand Hall', 'Centre Pompidou Modern Art', 'Palais Garnier Opera House',
      'Jardin des Tuileries fountains', 'Catacombs of Paris tours', 'Shakespeare and Company Bookstore'
    ],
    foods: ['Fresh Butter Croissants & Café', 'Steak Frites with Herb Butter', 'Savory Galettes & Sweet Crepes', 'Gourmet French Cheese Platter', 'Duck Confit & Red Wine', 'Colorful Macarons from Ladurée'],
    transports: ['RATP Metro Ticket t+', 'Paris RER Express Rail', 'Vélib\' Shared Bicycle network']
  },
  rome: {
    attractions: [
      'The Colosseum Flavian Amphitheatre', 'Trevi Fountain (Throw a Coin)', 'The Pantheon Dome',
      'Roman Forum & Palatine Hill', 'St. Peter\'s Basilica & Square', 'Vatican Museums & Sistine Chapel',
      'Piazza Navona Bernini Fountains', 'The Spanish Steps & Piazza di Spagna', 'Villa Borghese Galleries & Gardens',
      'Castel Sant\'Angelo Fortress', 'Campo de\' Fiori Morning Market', 'Trastevere Historic Alleyways',
      'Catacombs of San Callisto', 'Bocca della Verità (Mouth of Truth)', 'Piazza del Popolo obelisk'
    ],
    foods: ['Pasta Carbonara or Cacio e Pepe', 'Wood-fired Roman Style Pizza', 'Authentic Pistachio Gelato', 'Espresso Macchiato at local bar', 'Suppli Fried Rice Balls', 'Artichokes alla Romana'],
    transports: ['Rome ATAC Subway Metro', 'Local Tramway network', 'FreeNow Taxi / Rideshare']
  },
  london: {
    attractions: [
      'The British Museum Great Court', 'Tower of London & Crown Jewels', 'Tower Bridge Walkway',
      'The London Eye Giant Wheel', 'Big Ben & Houses of Parliament', 'Westminster Abbey Royal Tombs',
      'Buckingham Palace (Changing of the Guard)', 'Hyde Park & Serpentine Lake', 'Covent Garden Street Performers',
      'Trafalgar Square & National Gallery', 'St. Paul\'s Cathedral Whispering Gallery', 'Tate Modern Art Gallery',
      'The Shard Viewing Platform', 'Borough Market Street Food', 'Kensington Palace & Gardens'
    ],
    foods: ['Traditional Fish and Chips', 'Full English Breakfast platter', 'Afternoon Tea with Scones & Clotted Cream', 'Sunday Roast with Yorkshire Pudding', 'Chicken Tikka Masala in Brick Lane', 'British Meat Pies & Mash'],
    transports: ['London Underground (Oyster Card)', 'Iconic Double-Decker Red Bus', 'London Black Cab Taxi']
  },
  dubai: {
    attractions: [
      'Burj Khalifa Observation Deck', 'The Dubai Mall & Fountain Show', 'Palm Jumeirah Boardwalk',
      'Burj Al Arab Luxury Sail', 'Dubai Marina Yacht Cruise', 'Gold & Spice Souks crossing the Creek',
      'Global Village Multicultural pavilions', 'Dubai Miracle Garden Floral Castles', 'Museum of the Future',
      'Dubai Desert Conservation Safari', 'Jumeirah Mosque cultural tour', 'La Mer Waterfront Boardwalk',
      'Kite Beach & Burj Al Arab view', 'Dubai Frame Sky Glass Bridge', 'Al Fahidi Historical Neighbourhood'
    ],
    foods: ['Spiced Chicken Mandi rice', 'Traditional Arabic Mezze platter', 'Camel Milk Gelato & Dates', 'Shawarma wrap with Garlic paste', 'Luqaimat sweet dumplings', 'Arabic Coffee (Gahwa)'],
    transports: ['Dubai Driverless Metro Line', 'Careem Ride-Hailing Cabs', 'Dubai Abra Water Taxi']
  },
  riyadh: {
    attractions: [
      'Kingdom Centre Sky Bridge', 'Historic Al Masmak Fortress', 'At-Turaif District in Diriyah',
      'National Museum of Saudi Arabia', 'Boulevard Riyadh City Entertainment', 'Edge of the World Escarpment',
      'King Abdullah Park Water Fountains', 'Al Rajhi Grand Mosque', 'King Abdulaziz Historical Center',
      'Souq Al Zel traditional auction', 'Wadi Hanifah Eco-Park trails', 'Skyline view of KAFD Financial District',
      'Riyadh Gallery water canals', 'Nofa Wildlife Safari Park', 'Heet Cave natural spring'
    ],
    foods: ['Kabsa spiced chicken & rice', 'Saleeg creamy broth rice', 'Sukkari Dates & Gahwa Coffee', 'Murtabak stuffed pan-bread', 'Jareesh crushed wheat dish', 'Ma\'amoul date filled cookies'],
    transports: ['Riyadh Public Bus system', 'Careem Ride-Hailing Cabs', 'KAFD Metro Station Line']
  },
  newyork: {
    attractions: [
      'Statue of Liberty & Ellis Island ferry', 'Central Park Rowboats & Bethesda Terrace', 'Empire State Building Observatory',
      'Times Square Broadway Theater District', 'Metropolitan Museum of Art (The Met)', 'Brooklyn Bridge Pedestrian Walkway',
      'Rockefeller Center Top of the Rock', 'The High Line Elevated Park', 'Grand Central Terminal main hall',
      '9/11 Memorial Pools & Museum', 'Museum of Modern Art (MoMA)', 'Summit One Vanderbilt Glass Ledges',
      'One World Observatory skyline view', 'Chelsea Market culinary stalls', 'St. Patrick\'s Cathedral'
    ],
    foods: ['New York Style Pepperoni Pizza slice', 'Classic NYC Bagel with Lox & Cream Cheese', 'Pastrami Sandwich on Rye from Katz\'s', 'New York Cheesecake', 'Halal Cart Chicken over Rice', 'Gourmet street cart hot dogs'],
    transports: ['MTA Subway Train (OMNY Tap)', 'Iconic NYC Yellow Taxi Cab', 'NYC Ferry East River routing']
  },
  zurich: {
    attractions: [
      'Bahnhofstrasse Luxury Shopping', 'Lake Zurich Promenade Boat Cruise', 'Grossmünster Twin Tower climb',
      'Lindenhof Hill Panoramic View', 'Uetliberg Mountain Train & Lookout', 'Fraumünster Chagall Windows',
      'Swiss National Museum Castles', 'Kunsthaus Zürich Fine Art Gallery', 'Altstadt (Zurich Old Town) streets',
      'Niederdorf pedestrian alleyways', 'Zurich Botanical Garden greenhouses', 'Zurich Opera House plaza',
      'FIFA Museum interactive zone', 'Thermalbad & Spa rooftop springs', 'Rhine Falls day tour excursion'
    ],
    foods: ['Zürcher Geschnetzeltes veal stew', 'Swiss Cheese Fondue with bread cubes', 'Rösti golden potato pancakes', 'Luxemburgerli macarons from Sprüngli', 'Birchermüesli breakfast cups', 'Artisanal Swiss Milk Chocolates'],
    transports: ['Zurich VBZ Tramway network', 'SBB Swiss Federal Railways', 'Lake Zurich Passenger Ferry']
  },
  sanfrancisco: {
    attractions: [
      'Golden Gate Bridge', 'Alcatraz Island', 'Fisherman\'s Wharf & Pier 39',
      'Cable Cars', 'Lombard Street', 'Chinatown',
      'Golden Gate Park', 'Twin Peaks', 'Exploratorium', 'Union Square'
    ],
    foods: ['Sourdough Bread Bowl Clam Chowder', 'Mission Style Burrito from La Taqueria', 'Ghirardelli Chocolate Hot Fudge Sundae', 'Dungeness Crab at Fisherman\'s Wharf', 'Anchor Steam Beer & local craft brews', 'Dim Sum in SF Chinatown'],
    transports: ['MUNI Cable Cars & Historic Streetcars', 'BART Subway Transit Line', 'Waymo Driverless Autonomous Cabs']
  },
  stlouis: {
    attractions: [
      'Gateway Arch & Museum', 'Missouri Botanical Garden & Climatron', 'St. Louis Zoo in Forest Park',
      'Cortex Innovation Community tech hub', 'City Museum interactive art playground', 'Forest Park Grand Basin & Art Museum',
      'Cathedral Basilica of Saint Louis mosaics', 'Anheuser-Busch Historic Brewery', 'Science Center & Planetarium',
      'Lafayette Square Victorian home walk', 'St. Louis Union Station & Aquarium', 'Missouri History Museum',
      'Cahokia Mounds UNESCO Historic Site', 'Delmar Loop Walk of Fame', 'TechArtista Collaborative tech workspace'
    ],
    foods: ['St. Louis Style Thin Crust Pizza', 'Toasted Ravioli with marinara dipping', 'Gooey Butter Cake slice', 'Ted Drewes Frozen Custard concrete', 'Pork Steaks with St. Louis BBQ sauce', 'Fitz\'s Root Beer Float'],
    transports: ['MetroLink Light Rail Transit', 'MetroBus local route system', 'Lime Scooter & Bird micromobility', 'Lyft & Uber rideshare services']
  },
  islamabad: {
    attractions: [
      'Faisal Mosque under Margallas', 'Daman-e-Koh Hillside Viewpoint', 'Pakistan Monument & Museum',
      'Lok Virsa Cultural Heritage Museum', 'Rawal Lake View Park & boating', 'Margalla Hills Trail 3 Trekking',
      'The Centaurus Mall sky towers', 'Saidpur Historic Heritage Village', 'Shakarparian Hills viewpoint',
      'Monal Restaurant Margalla ridge', 'Shah Allah Ditta Buddhist Caves', 'Rose and Jasmine Garden pathways',
      'Lake View Park bird sanctuary', 'F-6 Markaz Kohsar Market cafe street', 'Rawalpindi Ayub National Park'
    ],
    foods: ['Mutton Karahi with Garlic Naan', 'Sikh Kebab & Chicken Tikka platter', 'Sweet Falooda & Rabri scoop', 'Kashmiri Chai (Pink tea) with nuts', 'Samosa Chaat street platter', 'Chicken Biryani with Raita'],
    transports: ['Metrobus Rapid Transit Line', 'Careem / inDrive Ride Cabs', 'Bykea Motorbike Shuttle']
  },
  lahore: {
    attractions: [
      'Lahore Fort (Shahi Qila)', 'Badshahi Mosque grand courtyard', 'Shalimar Mughal Gardens',
      'Wazir Khan Mosque mosaic tiles', 'Minar-e-Pakistan heritage park', 'Lahore Museum gallery decks',
      'Anarkali Bazaar shopping lanes', 'Sheesh Mahal mirror palace', 'Wagah Border Flag Lowering Ceremony',
      'Jahangir\'s Tomb garden complex', 'Greater Iqbal Park lake & fountains', 'Delhi Gate & Royal Trail hike',
      'Lahore Zoo wildlife center', 'Lawrence Gardens (Jinnah Park)', 'MM Alam Road restaurant strip'
    ],
    foods: ['Butt Karahi or Lahori Chargha', 'Crispy Gol Gappay with spicy water', 'Lahori Halwa Puri breakfast', 'Siri Paye mutton broth & naan', 'Lassi yogurt shake in clay cups', 'Tikka Boti & Seekh Kebab skewers'],
    transports: ['Lahore Orange Line Metro Train', 'Metrobus Rapid Transit system', 'Careem / inDrive ride booking']
  },
  karachi: {
    attractions: [
      'Mazar-e-Quaid (Jinnah Mausoleum)', 'Mohatta Palace Museum & Art', 'Clifton Beach camel & ATV rides',
      'Frere Hall library & gardens', 'Port Grand harbor food street', 'Pakistan Air Force (PAF) Museum',
      'Turtle Beach Hawksbay seaside huts', 'Churna Island snorkeling boat tour', 'Tooba Mosque single-dome',
      'Empress Market historic tower', 'Karachi Maritime Museum lake', 'Do Darya waterfront dining belt',
      'Hill Park amusement overlooks', 'National Museum of Pakistan', 'Dolmen Mall Clifton beach towers'
    ],
    foods: ['Karachi Beef Biryani with spices', 'Spiced Nihari with Ginger & Lemon', 'Burns Road Bun Kabab', 'Grilled Fish at Kemari Port', 'Kulfi Ice Cream & falooda', 'Paratha Roll from Silver Spoon'],
    transports: ['Local Green Line Bus Rapid', 'Careem ride-hailing app', 'Bykea Motorbike transport']
  },
  munich: {
    attractions: [
      'Marienplatz & Glockenspiel show', 'English Garden & Eisbach Wave surfers', 'Nymphenburg Palace canals',
      'Munich Residenz Treasury & Theater', 'BMW Welt & Museum modern decks', 'Viktualienmarkt gourmet stands',
      'Deutsches Museum technology halls', 'Allianz Arena football stadium', 'Frauenkirche Cathedral twin towers',
      'Olympiapark Munich towers', 'Hofbräuhaus historic beer hall', 'Asamkirche baroque interiors',
      'Alte Pinakothek Fine Art Gallery', 'Schloss Schleissheim palace park', 'Neuschwanstein Castle day tour'
    ],
    foods: ['Weisswurst white veal sausage', 'Soft Pretzel (Brezel) with sweet mustard', 'Schweinsshaxe roast pork knuckle', 'Kaiserschmarrn shredded pancakes', 'Apfelstrudel with vanilla sauce', 'Bavarian Lager in Steins'],
    transports: ['Munich U-Bahn Subway Metro', 'MVG Tram & Bus network', 'DB Regional S-Bahn Trains']
  },
  sydney: {
    attractions: [
      'Sydney Opera House Sails', 'Sydney Harbour Bridge Climb', 'Bondi Beach Coastal Walkways',
      'Darling Harbour Waterfront shops', 'Royal Botanic Garden harbor viewpoints', 'Taronga Zoo wild animal viewing',
      'Manly Beach Ferry crossing', 'Art Gallery of New South Wales', 'Queen Victoria Building architecture',
      'Sydney Tower Eye Observatory', 'The Rocks Historic Convict District', 'Hyde Park ANZAC Memorial',
      'Watsons Bay Cliffside Walk', 'Taronga Western Plains safari', 'Featherdale Wildlife Park'
    ],
    foods: ['Grilled Barramundi fish fillet', 'Aussie Meat Pie with gravy', 'Lamingtons chocolate cake square', 'Pavlova meringue dessert with fruits', 'Kangaroo steaks on the grill', 'Fresh Sydney Rock Oysters'],
    transports: ['Sydney Ferries Circular Quay', 'Sydney Light Rail / Metro', 'Uber / local ride taxi fleet']
  },
  bali: {
    attractions: [
      'Tanah Lot Offshore Sea Temple', 'Uluwatu Temple Sunset Cliff Walk', 'Ubud Sacred Monkey Forest Sanctuary',
      'Mount Batur Sunrise Volcano Trek', 'Tegallalang Green Rice Terraces', 'Seminyak Beach beach-club lounges',
      'Nusa Penida Kelingking Beach cliffs', 'Pura Besakih Mother Temple', 'Ulun Danu Bratan Lake Temple',
      'Tegenungan Waterfall rainforest pool', 'Campuhan Ridge Walk Ubud', 'Uluwatu Sunset Kecak Fire Dance',
      'Nusa Lembongan Devil\'s Tear waves', 'Kuta Beach surfing schools', 'Sanur Sunrise Cycling path'
    ],
    foods: ['Nasi Goreng with fried egg', 'Mie Goreng spicy noodles', 'Sate Lilit minced fish skewers', 'Gado-Gado peanut salad', 'Babi Guling roast suckling pig', 'Fresh Coconut water straight from fruit'],
    transports: ['Bluebird Metered Taxi fleet', 'Grab ride-hailing scooters', 'Private hire driver services']
  },
  iceland: {
    attractions: [
      'Reykjavik Hallgrímskirkja Cathedral', 'Harpa Concert Hall glass facade', 'The Blue Lagoon Geothermal Spa',
      'Gullfoss Golden Waterfall cascades', 'Strokkur Active Boiling Geysir', 'Thingvellir National Park Tectonic Rift',
      'Reynisfjara Black Sand Beach basalt columns', 'Seljalandsfoss Walk-Behind Waterfall', 'Skógafoss Giant Waterfall',
      'Jökulsárlón Glacier Lagoon icebergs', 'Sólheimasandur Plane Wreck hike', 'Skaftafell Ice Caves exploration',
      'Sun Voyager Sculpture seaside', 'Perlan Wonders of Iceland museum', 'Kerid Volcanic Crater Lake'
    ],
    foods: ['Slow-cooked Icelandic Lamb Soup', 'Skyr Icelandic Creamy Yogurt', 'Hot Spring Baked Rye Bread', 'Fermented Shark (Hákarl) tasting', 'Fresh Arctic Char fish pan-fry', 'Bæjarins Beztu Pylsur Hot Dogs'],
    transports: ['Rental Car 4WD Explorer', 'Adventure Bus Tours', 'Local Reykjavik City Bus']
  }
};

// Returns a beautiful travel photography URL
function getAttractionImage(city, index) {
  const normCity = city ? city.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
  
  const cityImages = {
    tokyo: [
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&q=80',
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80',
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80',
      'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=600&q=80',
      'https://images.unsplash.com/photo-1590253509302-39c4d715978a?w=600&q=80',
      'https://images.unsplash.com/photo-1504109586057-7a2ae83d1338?w=600&q=80',
      'https://images.unsplash.com/photo-1528164344705-47542687000d?w=600&q=80'
    ],
    paris: [
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80',
      'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&q=80',
      'https://images.unsplash.com/photo-1509840144299-db975b209cc9?w=600&q=80',
      'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=600&q=80',
      'https://images.unsplash.com/photo-1431274172761-fca41d930114?w=600&q=80',
      'https://images.unsplash.com/photo-1522093007474-d86e9bf7ba6f?w=600&q=80'
    ],
    rome: [
      'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80',
      'https://images.unsplash.com/photo-1529260830199-44552441d22e?w=600&q=80',
      'https://images.unsplash.com/photo-1515542690899-7aae3d82f2be?w=600&q=80',
      'https://images.unsplash.com/photo-1525874684015-58379d421a52?w=600&q=80',
      'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=600&q=80',
      'https://images.unsplash.com/photo-1554907906-ac2533036a1c?w=600&q=80'
    ],
    london: [
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80',
      'https://images.unsplash.com/photo-1505761671935-60b3a7427bab?w=600&q=80',
      'https://images.unsplash.com/photo-1529655683826-aba9b3e21f8b?w=600&q=80',
      'https://images.unsplash.com/photo-1513026705753-bc3fffca8bf4?w=600&q=80',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80',
      'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=600&q=80'
    ],
    dubai: [
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80',
      'https://images.unsplash.com/photo-1582672012124-747d8848d799?w=600&q=80',
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80',
      'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=600&q=80',
      'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600&q=80',
      'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600&q=80'
    ],
    newyork: [
      'https://images.unsplash.com/photo-1522083165195-342750297f05?w=600&q=80',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&q=80',
      'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80',
      'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=600&q=80',
      'https://images.unsplash.com/photo-1492664738988-2be3d16612a0?w=600&q=80',
      'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=600&q=80'
    ]
  };

  if (cityImages[normCity]) {
    return cityImages[normCity][index % cityImages[normCity].length];
  }

  const fallbacks = [
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
    'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&q=80',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&q=80',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&q=80',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80',
    'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&q=80'
  ];

  let hashVal = 0;
  for (let i = 0; i < normCity.length; i++) {
    hashVal += normCity.charCodeAt(i);
  }

  return fallbacks[(index + hashVal) % fallbacks.length];
}

// Generate fallback destinations data on the fly
function getFallbackDestination(city, country) {
  const normCity = city.trim();
  const normCountry = country.trim();
  const id = normCity.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  const cityKey = id;
  const hasRealData = realCityData[cityKey];
  
  const attractions = hasRealData ? realCityData[cityKey].attractions : [
    `Historic Center of ${normCity}`,
    `${normCity} Scenic Viewpoint`,
    `Traditional Artisans Street`,
    `${normCity} Royal Gardens`,
    `National Art & Museum of ${normCity}`,
    `${normCity} Botanical Gardens`,
    `Local Gastronomy & Food Street`,
    `${normCity} Historic Cathedral`,
    `Hilltop Panoramic Overlook of ${normCity}`,
    `${normCity} Waterfront Boardwalk`,
    `Ancient Temple & Landmark Sites`,
    `${normCity} Central Urban Park`,
    `Local Performance Theatre`,
    `${normCity} Landmark Bridge`,
    `Scenic Pedestrian Boulevard`
  ];
  
  const foods = hasRealData ? realCityData[cityKey].foods : [
    'Traditional Roasted Stew',
    'Handcrafted Pastry Cups',
    'Infused Botanical Tea',
    'Local Street Savory Bites',
    'Artisanal Dessert platter',
    'Slow-cooked Broth Bowl'
  ];
  
  const transports = hasRealData ? realCityData[cityKey].transports : [
    'Public Tramway',
    'Local Taxi Fleet',
    'Shared Micro-Mobility',
    'Electric Metro Line'
  ];
  
  return {
    id,
    name: normCity,
    country: normCountry,
    flag: '🌍',
    image: getCityImage(normCity, normCountry),
    preview: `A customized AI exploration of the gorgeous city of ${normCity}.`,
    description: `${normCity} is a historical treasure nestled in ${normCountry}, presenting visitors with a gorgeous array of sensory highlights, deep localized culture, scenic vistas, and warm hospitality.`,
    weather: { temp: '24°C', condition: 'Sunny', humidity: '52%', airQuality: 'Excellent' },
    bestTime: 'April to October',
    budget: { daily: '$80-220', hotel: '$60-180', food: '$20-60', transport: '$10-25' },
    safety: 'Highly Welcoming & Safe',
    timezone: 'UTC+2',
    attractions,
    foods,
    transport: transports,
    culture: 'Greetings are cherished. Dressing modestly in historic temples is standard etiquette.',
    visa: 'Check specific e-Visa provisions according to your departure passport.'
  };
}

function getCityCoordinates(cityName, countryName) {
  const normCountry = (countryName || '').toLowerCase().replace(/ /g, '_');
  const list = cityDatabase[normCountry] || [];
  const matched = list.find(c => c.name.toLowerCase() === (cityName || '').toLowerCase());
  if (matched) return { lat: matched.lat, lng: matched.lng };
  return { lat: 40.7128, lng: -74.0060 }; // New York default
}

function generateRealisticCarRentals(destCity) {
  return [
    { id: 'c1', name: 'Toyota Corolla / Elantra', type: 'Standard Sedan', provider: 'Hertz Rental', price: 45, seats: 5, transmission: 'Automatic', img: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&q=80' },
    { id: 'c2', name: 'Nissan Rogue / RAV4', type: 'Compact SUV', provider: 'Avis Car Rental', price: 65, seats: 5, transmission: 'Automatic', img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&q=80' },
    { id: 'c3', name: 'Honda Civic / Corolla', type: 'Economy Sedan', provider: 'Budget Rental', price: 39, seats: 5, transmission: 'Automatic', img: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=400&q=80' },
    { id: 'c4', name: 'Audi A4 / BMW 3 Series', type: 'Luxury Sedan', provider: 'Sixt Premium', price: 110, seats: 5, transmission: 'Automatic', img: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&q=80' }
  ];
}

/* ── Floating Background Glassmorphic Travel Tile ── */
const FloatingTile = ({ icon: Icon, className }) => (
  <div 
    className={`absolute hidden lg:flex w-12.5 h-12.5 rounded-2xl bg-white/75 dark:bg-slate-900/75 border border-white/80 dark:border-white/[0.08] shadow-[0_8px_20px_rgba(2,8,20,0.04)] dark:shadow-[0_12px_28px_rgba(0,0,0,0.45)] items-center justify-center text-slate-700 dark:text-slate-250 backdrop-blur-md hover:-translate-y-2 hover:scale-105 hover:rotate-3 hover:shadow-[0_15px_30px_rgba(2,8,20,0.08)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] transition-all duration-300 cursor-pointer pointer-events-auto z-20 ${className}`}
  >
    <Icon className="w-5.5 h-5.5 text-slate-600 dark:text-slate-300" />
  </div>
);

export default function FullTripPlannerPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isFallbackMode, preferences: authPrefs, updatePreferences } = useAuth();
  const [toastMsg, setToastMsg] = useState('');
  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  // Dynamic custom API integration states
  const [customPlan, setCustomPlan] = useState(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingFormSubstep, setOnboardingFormSubstep] = useState(1);

  // ============================================
  // WIZARD STATE FIELDS
  // ============================================
  const [originCountry, setOriginCountry] = useState('United States');
  const [originCity, setOriginCity] = useState('New York');
  const [destCountry, setDestCountry] = useState('Japan');
  const [destCity, setDestCity] = useState('Tokyo');
  const [startDate, setStartDate] = useState('2026-06-15');
  const [endDate, setEndDate] = useState('2026-06-20');
  const [travelersCount, setTravelersCount] = useState(2);
  const [travelStyle, setTravelStyle] = useState('Luxury Traveler');
  const [selectedInterests, setSelectedInterests] = useState(['Luxury', 'Food', 'Hidden Gems']);
  const [budgetTier, setBudgetTier] = useState('Luxury'); // Budget, Mid-range, Luxury, Ultra Luxury
  const [energyLevel, setEnergyLevel] = useState('Balanced'); // Relaxed, Balanced, Fast-Paced
  const [preferences, setPreferences] = useState(['Halal Food Only', 'Family Friendly']);
  const travelerCurrency = authPrefs?.currency || 'USD';
  const setTravelerCurrency = (curr) => updatePreferences(authPrefs?.language || 'English', curr, authPrefs?.theme || 'dark');

  const [tripSaved, setTripSaved] = useState(false);
  const [isSavingTrip, setIsSavingTrip] = useState(false);

  // Check if current trip is already saved
  useEffect(() => {
    if (user && customPlan) {
      const checkTripSaved = async () => {
        const dest = customPlan.destination || destCity || 'Custom Trip';
        const dur = customPlan.duration || 5;
        if (isFallbackMode) {
          const allTrips = JSON.parse(localStorage.getItem('tripready_saved_trips') || '[]');
          const exists = allTrips.some(t => t.user_id === user.id && t.destination === dest && t.duration === dur);
          setTripSaved(exists);
        } else {
          try {
            const { data } = await supabase
              .from('saved_ai_trips')
              .select('id')
              .eq('user_id', user.id)
              .eq('destination', dest)
              .eq('duration', dur)
              .limit(1);
            setTripSaved(data && data.length > 0);
          } catch (e) {
            console.error(e);
          }
        }
      };
      checkTripSaved();
    }
  }, [user, customPlan, isFallbackMode, destCity]);

  // Log recently viewed trip on step 3 mount
  useEffect(() => {
    if (user && currentStep === 3 && customPlan) {
      const saveRecentlyViewedTrip = async () => {
        const itemSlug = customPlan.destination || destCity || 'Custom Trip';
        const itemName = `Trip to ${itemSlug}`;
        const itemType = 'trip';
        if (isFallbackMode) {
          const allHist = JSON.parse(localStorage.getItem('tripready_recently_viewed') || '[]');
          const filtered = allHist.filter(h => !(h.user_id === user.id && h.item_name === itemName));
          filtered.unshift({
            id: crypto.randomUUID(),
            user_id: user.id,
            item_slug: itemSlug,
            item_name: itemName,
            item_type: itemType,
            itinerary_data: customPlan,
            viewed_at: new Date().toISOString()
          });
          localStorage.setItem('tripready_recently_viewed', JSON.stringify(filtered.slice(0, 20)));
        } else {
          try {
            const { error } = await supabase.from('recently_viewed').insert([{
              user_id: user.id,
              item_slug: itemSlug,
              item_name: itemName,
              item_type: itemType,
              itinerary_data: customPlan
            }]);
            if (error) throw error;
          } catch (e) {
            console.error("Failed to log recently viewed trip:", e);
            const allHist = JSON.parse(localStorage.getItem('tripready_recently_viewed') || '[]');
            const filtered = allHist.filter(h => !(h.user_id === user.id && h.item_name === itemName));
            filtered.unshift({
              id: crypto.randomUUID(),
              user_id: user.id,
              item_slug: itemSlug,
              item_name: itemName,
              item_type: itemType,
              itinerary_data: customPlan,
              viewed_at: new Date().toISOString()
            });
            localStorage.setItem('tripready_recently_viewed', JSON.stringify(filtered.slice(0, 20)));
          }
        }
      };
      saveRecentlyViewedTrip();
    }
  }, [user, currentStep, customPlan, isFallbackMode, destCity]);

  const handleSaveThisTrip = async () => {
    if (!user) {
      showToast("Please login or sign up to save this trip itinerary!");
      setTimeout(() => {
        navigate('/auth', { state: { from: '/ai-trip-planner', guestPlan: customPlan } });
      }, 1500);
      return;
    }

    const dest = customPlan?.destination || destCity || 'Custom Trip';
    const dur = customPlan?.duration || 5;
    const tripData = {
      user_id: user.id,
      destination: dest,
      duration: dur,
      budget: customPlan?.budget || budgetTier || 'Medium',
      travel_type: customPlan?.travel_type || travelStyle || 'Solo',
      itinerary_data: customPlan
    };

    // 1. Instant Optimistic Save (<5ms delay for user response)
    const newTripRecord = { id: crypto.randomUUID(), ...tripData, created_at: new Date().toISOString() };
    const allTrips = JSON.parse(localStorage.getItem('tripready_saved_trips') || '[]');
    const isDuplicate = allTrips.some(t => t.user_id === user.id && t.destination === dest && t.duration === dur);
    if (!isDuplicate) {
      allTrips.unshift(newTripRecord);
      localStorage.setItem('tripready_saved_trips', JSON.stringify(allTrips));
    }
    setTripSaved(true);
    setIsSavingTrip(false);
    showToast("Trip saved successfully to your profile!");

    // 2. Non-blocking Async Supabase Sync (runs in background without freezing UI)
    if (!isFallbackMode) {
      Promise.race([
        supabase.from('saved_ai_trips').select('id').eq('user_id', user.id).eq('destination', dest).eq('duration', dur).limit(1),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000))
      ]).then(async (res) => {
        const existing = res?.data;
        if (!existing || existing.length === 0) {
          await supabase.from('saved_ai_trips').insert([tripData]);
        }
      }).catch(() => {
        // Silently handled - already persisted in localStorage!
      });
    }
  };

  // ── Session recovery & Auto-save generated trip ─────────────────────
  useEffect(() => {
    if (user) {
      const cachedPlanStr = localStorage.getItem('tripready_guest_custom_plan');
      if (cachedPlanStr) {
        try {
          const parsedPlan = JSON.parse(cachedPlanStr);
          setCustomPlan(parsedPlan);
          setCurrentStep(3);
          
          const saveTripToAccount = async () => {
            const tripData = {
              user_id: user.id,
              destination: parsedPlan.destination || 'Custom Trip',
              duration: parsedPlan.duration || 5,
              budget: parsedPlan.budget || 'Medium',
              travel_type: parsedPlan.travel_type || 'Solo',
              itinerary_data: parsedPlan
            };
            
            // 1. Instant local persistence
            const allTrips = JSON.parse(localStorage.getItem('tripready_saved_trips') || '[]');
            const isDuplicate = allTrips.some(t => t.user_id === user.id && t.destination === tripData.destination && t.duration === tripData.duration);
            if (!isDuplicate) {
              allTrips.unshift({ id: crypto.randomUUID(), ...tripData, created_at: new Date().toISOString() });
              localStorage.setItem('tripready_saved_trips', JSON.stringify(allTrips));
            }
            
            // 2. Non-blocking background sync to Supabase
            if (!isFallbackMode) {
              Promise.race([
                supabase.from('saved_ai_trips').select('id').eq('user_id', user.id).eq('destination', tripData.destination).eq('duration', tripData.duration).limit(1),
                new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000))
              ]).then(async (res) => {
                const existing = res?.data;
                if (!existing || existing.length === 0) {
                  await supabase.from('saved_ai_trips').insert([tripData]);
                }
              }).catch(() => {});
            }
            
            localStorage.removeItem('tripready_guest_custom_plan');
            showToast("Success! Your itinerary has been unlocked and saved to your dashboard!");
          };
          
          saveTripToAccount();
        } catch (err) {
          console.error("Error restoring guest plan session:", err);
        }
      }
    }
  }, [user, isFallbackMode]);

  const [liveWeather, setLiveWeather] = useState(null);
  const [liveRates, setLiveRates] = useState(null);
  const [showApiModal, setShowApiModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(getGeminiApiKey() || '');

  // Live Flights & Car Rentals states (RapidAPI)
  const [liveFlights, setLiveFlights] = useState([]);
  const [flightsSource, setFlightsSource] = useState('simulated'); // 'api' | 'cache' | 'simulated'
  const [flightsLoading, setFlightsLoading] = useState(false);

  const [liveCars, setLiveCars] = useState([]);
  const [logoSrcs, setLogoSrcs] = useState({});
  const [loadedAttractionImages, setLoadedAttractionImages] = useState({});
  
  const getAirlineDomain = (name) => {
    const n = name.toLowerCase();
    if (n.includes('emirates')) return 'emirates.com';
    if (n.includes('singapore')) return 'singaporeair.com';
    if (n.includes('qatar')) return 'qatarairways.com';
    if (n.includes('lufthansa')) return 'lufthansa.com';
    if (n.includes('turkish')) return 'turkishairlines.com';
    if (n.includes('cathay')) return 'cathaypacific.com';
    if (n.includes('british')) return 'britishairways.com';
    if (n.includes('ana') || n.includes('nippon')) return 'ana.co.jp';
    if (n.includes('airasia')) return 'airasia.com';
    if (n.includes('vietjet')) return 'vietjetair.com';
    if (n.includes('thai')) return 'thaiairways.com';
    if (n.includes('batik')) return 'batikair.com';
    if (n.includes('continental')) return 'united.com';
    if (n.includes('border')) return 'alaskaair.com';
    if (n.includes('regional')) return 'skywest.com';
    if (n.includes('interjet')) return 'interjet.com.mx';
    return 'logo.dev';
  };
  const [carsSource, setCarsSource] = useState('simulated'); // 'api' | 'cache' | 'simulated'
  const [carsLoading, setCarsLoading] = useState(false);


  // Read country from query params to pre-select destination country & city
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const countryParam = params.get('country');
    if (countryParam) {
      const found = countries.find(
        c => c.name.toLowerCase() === countryParam.toLowerCase()
      );
      if (found) {
        setDestCountry(found.name);
        if (found.cities && found.cities.length > 0) {
          setDestCity(found.cities[0]);
        }
      }
    }
  }, [location.search]);

  // Visa requirements dynamic fetching states
  const [visaData, setVisaData] = useState({
    requirement: 'Checking eVisa provisions',
    duration: '30 Days average',
    color: 'yellow',
    criticalInfo: 'Confirm specific requirements based on your national passport guidelines.',
    isLoading: true,
    isLive: false
  });

  // TIME-001: Global Time Engine & Simulation System States
  const [simulationTime, setSimulationTime] = useState(480); // 8:00 AM in minutes from midnight
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1); // 1 = 1x, 2 = 2x, 3 = 5x
  const [simulationDay, setSimulationDay] = useState(0); // 0-indexed active day
  const [dayStartTimes, setDayStartTimes] = useState({}); // dayIndex -> minutes
  const [activityDurations, setActivityDurations] = useState({}); // activityKey -> minutes
  const [customEvents, setCustomEvents] = useState([]); // array of { id, day, title, startTime, endTime, category }
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventStart, setNewEventStart] = useState('08:00');
  const [newEventEnd, setNewEventEnd] = useState('09:00');
  const [newEventCategory, setNewEventCategory] = useState('Rest');

  // Time conversion helpers
  const formatTimeHM = (mins) => {
    const h = Math.floor(mins / 60) % 24;
    const m = Math.floor(mins % 60);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 === 0 ? 12 : h % 12;
    const displayM = m < 10 ? '0' + m : m;
    return `${displayH}:${displayM} ${ampm}`;
  };

  const getDayDateString = (dayNum) => {
    try {
      const d = new Date(startDate);
      d.setDate(d.getDate() + (dayNum - 1));
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' });
    } catch (e) {
      return `Day ${dayNum}`;
    }
  };

  const parseTimeToMins = (timeStr) => {
    if (!timeStr) return 480;
    const clean = timeStr.trim().toUpperCase();
    const isPM = clean.includes('PM');
    const isAM = clean.includes('AM');
    const parts = clean.replace(/[A-Z]/g, '').trim().split(':');
    let h = parseInt(parts[0]) || 0;
    const m = parseInt(parts[1]) || 0;
    
    if (isPM && h < 12) h += 12;
    if (isAM && h === 12) h = 0;
    
    return h * 60 + m;
  };

  const parseDurationToMins = (durStr) => {
    if (!durStr) return 120;
    const clean = durStr.toLowerCase().trim();
    if (clean.includes('hour') || clean.includes('hr') || clean.includes('h')) {
      const hourMatch = clean.match(/(\d+(?:\.\d+)?)\s*(?:hour|hr|h)/);
      const minMatch = clean.match(/(\d+)\s*(?:min|m)(?:$|\s)/);
      let mins = 0;
      if (hourMatch) mins += parseFloat(hourMatch[1]) * 60;
      if (minMatch) mins += parseInt(minMatch[1]);
      return Math.round(mins);
    }
    const minOnlyMatch = clean.match(/(\d+)/);
    if (minOnlyMatch) return parseInt(minOnlyMatch[1]);
    return 120;
  };

  const getActiveActivity = (day) => {
    if (!day || !day.timings) return null;
    const t = day.timings;
    const time = simulationTime;
    
    if (time >= t.morningStart && time < t.morningEnd) {
      return { type: 'morning', label: `Visiting ${day.morning.attraction}`, icon: 'Compass', end: t.morningEnd };
    } else if (time >= t.morningEnd && time < t.afternoonStart) {
      return { type: 'transit-lunch', label: 'Transit & Lunch break', icon: 'Utensils', end: t.afternoonStart };
    } else if (time >= t.afternoonStart && time < t.afternoonEnd) {
      return { type: 'afternoon', label: `Exploring ${day.afternoon.attraction}`, icon: 'Camera', end: t.afternoonEnd };
    } else if (time >= t.afternoonEnd && time < t.eveningStart) {
      return { type: 'transit-dinner', label: 'Transit & Dinner preparation', icon: 'Utensils', end: t.eveningStart };
    } else if (time >= t.eveningStart && time < t.eveningEnd) {
      return { type: 'evening', label: `Dinner at ${day.evening.dinner} & sunset at ${day.evening.sunsetSpot}`, icon: 'Coffee', end: t.eveningEnd };
    } else if (time >= t.eveningEnd && time < t.nightEnd) {
      return { type: 'night', label: `Rest: ${day.night.hotelReturn}`, icon: 'Moon', end: t.nightEnd };
    } else {
      return { type: 'sleep', label: 'Sleeping at hotel', icon: 'Moon', end: 1440 };
    }
  };

  const addCustomEvent = () => {
    if (!newEventTitle.trim()) return;
    const newEvent = {
      id: Date.now().toString(),
      day: simulationDay,
      title: newEventTitle,
      startTime: newEventStart,
      endTime: newEventEnd,
      category: newEventCategory
    };
    setCustomEvents(prev => [...prev, newEvent]);
    setNewEventTitle('');
    setShowAddEventModal(false);
  };

  const removeCustomEvent = (id) => {
    setCustomEvents(prev => prev.filter(evt => evt.id !== id));
  };

  const getAmbientGradient = (mins) => {
    if (mins >= 360 && mins < 600) return 'from-rose-500/10 via-amber-500/5 to-transparent bg-gradient-to-b';
    if (mins >= 600 && mins < 960) return 'from-sky-500/10 via-indigo-500/5 to-transparent bg-gradient-to-b';
    if (mins >= 960 && mins < 1140) return 'from-amber-600/10 via-rose-600/5 to-transparent bg-gradient-to-b';
    return 'from-slate-950/20 via-indigo-950/10 to-transparent bg-gradient-to-b';
  };



  // Dynamic Visa Requirement Integration
  useEffect(() => {
    let active = true;
    async function loadVisaInfo() {
      setVisaData(prev => ({ ...prev, isLoading: true }));
      try {
        const res = await fetchLiveVisaRequirement(originCountry, destCountry, startDate);
        if (active) {
          setVisaData({
            requirement: res.visa.requirement,
            duration: res.visa.duration,
            color: res.visa.color,
            criticalInfo: res.visa.criticalInfo,
            isLoading: false,
            isLive: res.source === 'api' || res.source === 'cache'
          });
        }
      } catch (e) {
        const sim = simulateVisaRequirement(originCountry, destCountry);
        if (active) {
          setVisaData({
            requirement: sim.requirement,
            duration: sim.duration,
            color: sim.color,
            criticalInfo: sim.criticalInfo,
            isLoading: false,
            isLive: false
          });
        }
      }
    }
    loadVisaInfo();
    return () => {
      active = false;
    };
  }, [originCountry, destCountry, startDate]);

  // Load live RapidAPI Flights and Car Rentals
  useEffect(() => {
    if (currentStep !== 3 || !destCity) return;
    let isMounted = true;
    
    async function loadFlights() {
      setFlightsLoading(true);
      try {
        const res = await fetchLiveFlights(originCity, destCity, 'ECONOMY', travelersCount);
        if (isMounted) {
          setLiveFlights(res.flights);
          setFlightsSource(res.source);
        }
      } catch (err) {
        if (isMounted) {
          setLiveFlights([]);
          setFlightsSource('simulated');
        }
      } finally {
        if (isMounted) setFlightsLoading(false);
      }
    }

    async function loadCarRentals() {
      setCarsLoading(true);
      const coords = getCityCoordinates(destCity, destCountry);
      try {
        const res = await fetchLiveCarRentals(coords.lat, coords.lng, 'USD');
        if (isMounted) {
          setLiveCars(res.cars);
          setCarsSource(res.source);
        }
      } catch (err) {
        if (isMounted) {
          setLiveCars([]);
          setCarsSource('simulated');
        }
      } finally {
        if (isMounted) setCarsLoading(false);
      }
    }

    loadFlights();
    loadCarRentals();

    return () => {
      isMounted = false;
    };
  }, [currentStep, originCity, destCity, travelersCount, destCountry]);

  // UI state for dropdown lists search overlays
  const [showOriginCountries, setShowOriginCountries] = useState(false);
  const [activeOnboardingSegment, setActiveOnboardingSegment] = useState(null);
  const [showDestCountries, setShowDestCountries] = useState(false);
  
  const [searchOriginText, setSearchOriginText] = useState('');
  const [searchDestText, setSearchDestText] = useState('');

  // Filtering countries lists
  const filteredOriginCountries = useMemo(() => {
    return countries.filter(c => c.name.toLowerCase().includes(searchOriginText.toLowerCase()));
  }, [searchOriginText]);

  const filteredDestCountries = useMemo(() => {
    return countries.filter(c => c.name.toLowerCase().includes(searchDestText.toLowerCase()));
  }, [searchDestText]);

  // Cities matching selected country
  const originCities = useMemo(() => {
    const found = countries.find(c => c.name === originCountry);
    return found ? found.cities : [];
  }, [originCountry]);

  const destCities = useMemo(() => {
    const found = countries.find(c => c.name === destCountry);
    return found ? found.cities : [];
  }, [destCountry]);

  // Dates duration calculation
  const totalDays = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return isNaN(diffDays) ? 5 : diffDays;
  }, [startDate, endDate]);

  const destinationCurrency = useMemo(() => {
    const dc = destCountry.toLowerCase();
    const c = countries.find(item => item.name.toLowerCase() === dc);
    if (c && c.currency) {
      const matched = currencies.find(curr => curr.code === c.currency);
      if (matched) return matched;
    }
    if (dc.includes('saudi') || dc.includes('arabia')) return { code: 'SAR', name: 'Saudi Riyal', symbol: 'SR', rate: 3.75 };
    if (dc.includes('emirates') || dc.includes('dubai') || dc.includes('uae')) return { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', rate: 3.67 };
    if (dc.includes('egypt')) return { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£', rate: 47.15 };
    if (dc.includes('pakistan')) return { code: 'PKR', name: 'Pakistani Rupee', symbol: 'Rs', rate: 278.45 };
    if (dc.includes('india')) return { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 83.12 };
    if (dc.includes('japan') || dc.includes('tokyo')) return { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 149.50 };
    if (dc.includes('united kingdom') || dc.includes('london') || dc.includes('uk')) return { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.79 };
    if (dc.includes('switzerland')) return { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', rate: 0.88 };
    if (dc.includes('turkey') || dc.includes('türkiye')) return { code: 'TRY', name: 'Turkish Lira', symbol: '₺', rate: 32.10 };
    if (dc.includes('australia')) return { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.53 };
    if (dc.includes('new zealand')) return { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', rate: 1.67 };
    if (dc.includes('korea')) return { code: 'KRW', name: 'South Korean Won', symbol: '₩', rate: 1330.0 };
    if (dc.includes('iceland')) return { code: 'ISK', name: 'Icelandic Króna', symbol: 'kr', rate: 137.0 };
    if (dc.includes('singapore')) return { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', rate: 1.34 };
    if (dc.includes('thailand')) return { code: 'THB', name: 'Thai Baht', symbol: '฿', rate: 35.20 };
    if (dc.includes('indonesia') || dc.includes('bali')) return { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', rate: 15700.0 };
    if (dc.includes('brazil')) return { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', rate: 4.97 };
    if (dc.includes('mexico')) return { code: 'MXN', name: 'Mexican Peso', symbol: 'Mex$', rate: 17.15 };
    if (dc.includes('south africa')) return { code: 'ZAR', name: 'South African Rand', symbol: 'R', rate: 18.50 };
    if (dc.includes('norway')) return { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', rate: 10.70 };
    if (dc.includes('malaysia')) return { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', rate: 4.72 };
    if (dc.includes('china') || dc.includes('hong kong')) return { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: 7.24 };
    if (dc.includes('europe') || dc.includes('france') || dc.includes('germany') || dc.includes('italy') || dc.includes('spain') || dc.includes('netherlands') || dc.includes('belgium') || dc.includes('austria') || dc.includes('portugal') || dc.includes('greece') || dc.includes('ireland')) return { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.92 };
    return { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1 };
  }, [destCountry]);

  const displayRates = useMemo(() => {
    const base = { ...destinationCurrency };
    if (liveRates && liveRates[base.code]) {
      base.rate = liveRates[base.code];
    }
    return base;
  }, [liveRates, destinationCurrency]);

  const formatCost = (usdAmount) => {
    if (isNaN(usdAmount)) return '$0';
    
    // Support traveler selected currency conversion
    const travCurrObj = currencies.find(c => c.code === travelerCurrency) || { code: 'USD', symbol: '$', rate: 1.0 };
    const activeRate = (liveRates && liveRates[travelerCurrency]) ? liveRates[travelerCurrency] : travCurrObj.rate;
    const convertedTrav = Math.round(usdAmount * activeRate);
    
    if (travelerCurrency === 'USD') {
      return `$${usdAmount.toLocaleString()} USD`;
    }
    return `${travCurrObj.symbol}${convertedTrav.toLocaleString()} ${travelerCurrency}`;
  };

  const displayVisa = useMemo(() => {
    const planVisa = customPlan?.visa;
    
    const merged = {
      requirement: visaData.requirement,
      duration: visaData.duration,
      criticalInfo: visaData.criticalInfo,
      color: visaData.color,
      isLive: visaData.isLive,
      isLoading: visaData.isLoading
    };
    
    if (planVisa && typeof planVisa === 'object') {
      return {
        ...merged,
        requirement: planVisa.requirement || merged.requirement,
        duration: planVisa.duration || merged.duration,
        criticalInfo: planVisa.criticalInfo || merged.criticalInfo
      };
    }
    return merged;
  }, [customPlan, visaData]);

  const displaySafety = useMemo(() => {
    const planSafety = customPlan?.safety;
    const norm = destCountry.toLowerCase();
    
    let baseSafety = { 
      police: '112', 
      ambulance: '112', 
      fire: '112', 
      note: 'Keep digital passport scans secure on portable device drives.' 
    };
    
    if (norm.includes('saudi') || norm.includes('arabia')) {
      baseSafety = { police: '911', ambulance: '997', fire: '998', note: 'Dress modesty required in public. Extremely low crime index.' };
    } else if (norm.includes('united kingdom') || norm.includes('uk') || norm.includes('london')) {
      baseSafety = { police: '999', ambulance: '999', fire: '999', note: 'Beware of pickpockets in crowded transit nodes.' };
    } else if (norm.includes('uae') || norm.includes('dubai')) {
      baseSafety = { police: '999', ambulance: '998', fire: '997', note: 'Strict public conduct policies. Extremely safe.' };
    }
    
    if (planSafety && typeof planSafety === 'object') {
      return {
        police: planSafety.police || baseSafety.police,
        ambulance: planSafety.ambulance || baseSafety.ambulance,
        fire: planSafety.fire || baseSafety.fire,
        note: planSafety.note || baseSafety.note
      };
    }
    return baseSafety;
  }, [customPlan, destCountry]);

  // Ensure reasonable default cities when country changes
  useEffect(() => {
    if (originCities.length > 0 && !originCities.includes(originCity)) {
      setOriginCity(originCities[0]);
    }
  }, [originCities, originCity]);

  useEffect(() => {
    if (destCities.length > 0 && !destCities.includes(destCity)) {
      setDestCity(destCities[0]);
    }
  }, [destCities, destCity]);

  // ============================================
  // STEP 2: CINEMATIC LOADING STATE
  // ============================================
  const [loadingLogIndex, setLoadingLogIndex] = useState(0);
  const loadingLogs = [
    'Getting your travel details ready...',
    'Scanning optimal intercontinental transit vectors...',
    `Calculating spatial distance from ${originCity} to ${destCity}...`,
    'Clustering spatial attraction locations geographically...',
    'Checking climate updates and adapting outdoor calendars...',
    'Balancing walking routes matching "Relaxed" thresholds...',
    'Calibrating Michelin and premium culinary registries...',
    'Assembling National Geographic style infotainment print designs...',
    'Syncing local consulate coordinates & emergency protocols...',
    'Compiling personalized Luxury Travel Operating System...'
  ];

  useEffect(() => {
    if (currentStep === 2) {
      const interval = setInterval(() => {
        setLoadingLogIndex((prev) => {
          if (prev < loadingLogs.length - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            setCurrentStep(3); // Go to final roadmap dashboard
            return prev;
          }
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [currentStep]);

  const handleGeneratePlan = async (overrideCity = null) => {
    setCustomPlan(null);
    setLiveWeather(null);
    setLiveRates(null);
    const activeCity = overrideCity || destCity;

    const liveDataPromise = (async () => {
      let lat = null;
      let lon = null;
      let weatherObj = null;
      let ratesObj = null;

      try {
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(activeCity + ', ' + destCountry)}&count=1&language=en&format=json`;
        const geoRes = await fetch(geoUrl);
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          if (geoData && geoData.results && geoData.results.length > 0) {
            lat = parseFloat(geoData.results[0].latitude);
            lon = parseFloat(geoData.results[0].longitude);
          }
        }
      } catch (e) {
        console.warn("Geocoding Open-Meteo failed:", e);
      }

      try {
        if (lat !== null && lon !== null) {
          const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`;
          const weatherRes = await fetch(weatherUrl);
          if (weatherRes.ok) {
            const weatherData = await weatherRes.json();
            const current = weatherData.current_weather;
            if (current) {
              const wmoCodes = {
                0: 'Clear Sky', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
                45: 'Foggy', 48: 'Fog', 51: 'Light Drizzle', 53: 'Moderate Drizzle',
                55: 'Dense Drizzle', 61: 'Light Rain', 63: 'Moderate Rain', 65: 'Heavy Rain',
                71: 'Light Snow', 73: 'Moderate Snow', 75: 'Heavy Snow',
                80: 'Light Showers', 81: 'Moderate Showers', 82: 'Violent Showers',
                95: 'Thunderstorm', 96: 'Thunderstorm with Hail'
              };
              weatherObj = {
                temp: `${Math.round(current.temperature)}°C`,
                condition: wmoCodes[current.weathercode] || 'Sunny',
                humidity: '54%',
                airQuality: 'Excellent'
              };
            }
          }
        }
      } catch (e) {
        console.warn("Weather API open-meteo failed:", e);
      }

      try {
        const currencyRes = await fetch('https://open.er-api.com/v6/latest/USD');
        if (currencyRes.ok) {
          const currencyData = await currencyRes.json();
          if (currencyData && currencyData.rates) {
            ratesObj = {
              ...currencyData.rates,
              SAR: 3.75,
              AED: 3.67,
              EGP: 47.15,
              PKR: 278.45
            };
          }
        }
      } catch (e) {
        console.warn("ExchangeRate-API rates failed:", e);
      }

      return { weatherObj, ratesObj };
    })();

    let geminiPromise = Promise.resolve(null);
    if (hasGeminiKey()) {
      const geminiPrompt = `You are a world-class travel planner API. 
Generate a completely customized travel itinerary and travel guide in JSON format for a trip from ${originCity}, ${originCountry} to ${activeCity}, ${destCountry}.

Important Structuring Guidelines to ensure it looks human-designed:
- Day 1: Must be dedicated to "Arrival, Hotel Check-in & Orientation". Morning/afternoon details should focus on arriving at the airport, customs, transit to the hotel, checking in, unpacking, and resting to recover from jetlag. Evening should focus on a light neighborhood walk or a local dinner.
- Intermediate Days (Day 2 to Day N-1): Dedicated to active sightseeing. Group must-visit local landmarks, tourist attractions, and restaurants logically by proximity and timings (morning, afternoon, evening).
- Tech & Historic Landmarks: If the destination is famous for tech (e.g. St. Louis Cortex tech hub) or history/culture (e.g. San Francisco Golden Gate Bridge, Alcatraz, or Lahore Badshahi Mosque, Lahore Fort, Wazir Khan Mosque), you MUST feature them prominently in the sightseeing details.
- Final Day: Focus on check-out, souvenir/crafts shopping at local markets, packing, and airport transit for departure.

Trip Parameters:
- Start Date: ${startDate}
- End Date: ${endDate}
- Total Days: ${totalDays}
- Travelers Count: ${travelersCount}
- Travel Style: ${travelStyle}
- Budget Tier: ${budgetTier}
- Energy Level: ${energyLevel}
- Interests: ${selectedInterests.join(', ')}
- Preferences: ${preferences.join(', ')}

Ensure the itinerary matches the requested budget tier ("${budgetTier}") and energy level ("${energyLevel}").

Respond ONLY with a JSON object. Do not include markdown codeblocks (no \`\`\`json tags) or extra text. The structure of the JSON MUST match the following fields:
{
  "itinerary": [
    {
      "day": 1,
      "title": "Day 1: Arrival & Orientation",
      "weatherShift": false,
      "weatherAdaptMessage": null,
      "morning": {
        "time": "09:00 AM",
        "breakfast": "Gourmet Breakfast Dish Name",
        "attraction": "Major Attraction Name",
        "duration": "3 hours",
        "price": "$25 per person",
        "crowd": "Moderate Density",
        "photoTip": "Photography framing tip...",
        "expenses": 25,
        "transport": "Transit Method (e.g., Luxury Shuttle)",
        "distance": "2.4 miles",
        "travelTime": "12 mins"
      },
      "afternoon": {
        "time": "01:30 PM",
        "lunch": "Lunch Restaurant / Dish Name",
        "attraction": "Afternoon Attraction Name",
        "duration": "2 hours",
        "price": "Free Access",
        "crowd": "High Peak Density",
        "photoTip": "Angle/framing photo tip...",
        "expenses": 0,
        "walkingRoute": "Walking routing description..."
      },
      "evening": {
        "time": "06:00 PM",
        "sunsetSpot": "Evening Sunset/Scenic Viewpoint Name",
        "dinner": "Dinner Restaurant Name",
        "nightlife": "Evening activity / lounge suggestion",
        "expenses": 45
      },
      "night": {
        "time": "10:00 PM",
        "hotelReturn": "Directions/transit back to hotel",
        "safetyNote": "Safety alert or security advice...",
        "nextDayPrep": "What to prep for the next day..."
      }
    }
  ],
  "packing": [
    { "name": "Passport & Travel Authorization Documents", "category": "Essentials" }
  ],
  "culinary": [
    { "name": "Horizon Luxury Skybar", "type": "Fine Dining & Lounge", "cost": "$$$$", "rating": 4.8, "tags": ["Panoramic Views", "Premium Chef"], "note": "Stunning elevated terrace..." }
  ],
  "safety": {
    "police": "911",
    "ambulance": "997",
    "fire": "998",
    "note": "Critical cultural laws, tipping customs, modests dress norms, and security guidelines."
  },
  "visa": {
    "requirement": "e-Visa Required",
    "duration": "90 Days Max",
    "criticalInfo": "Ensure passport has minimum 6 months validity from date of entry."
  },
  "transportApps": [
    { "name": "Careem", "purpose": "The premier local ride-hailing app across Saudi Arabia and the Middle East." }
  ]
}`;
      const systemInstruction = `You are a world-class travel planner API. Generate customized itineraries and travel guides in structured JSON matching the requested schema. Ensure you generate an array of day objects matching exactly totalDays=${totalDays}.`;
      geminiPromise = askGemini(geminiPrompt, systemInstruction);
    }

    try {
      const [liveData, geminiText] = await Promise.all([liveDataPromise, geminiPromise]);

      if (liveData.weatherObj) setLiveWeather(liveData.weatherObj);
      if (liveData.ratesObj) setLiveRates(liveData.ratesObj);

      if (geminiText) {
        const repaired = repairJson(geminiText);
        if (repaired) {
          try {
            const parsed = JSON.parse(repaired);
            if (parsed && parsed.itinerary && parsed.itinerary.length > 0) {
              setCustomPlan(parsed);
              if (!user) {
                localStorage.setItem('tripready_guest_custom_plan', JSON.stringify(parsed));
              } else {
                const saveTripDirectly = async () => {
                  const tripData = {
                    user_id: user.id,
                    destination: parsed.destination || destCity || 'Custom Trip',
                    duration: parsed.duration || 5,
                    budget: parsed.budget || 'Medium',
                    travel_type: parsed.travel_type || 'Solo',
                    itinerary_data: parsed
                  };
                  if (isFallbackMode) {
                    const allTrips = JSON.parse(localStorage.getItem('tripready_saved_trips') || '[]');
                    allTrips.unshift({ id: crypto.randomUUID(), ...tripData, created_at: new Date().toISOString() });
                    localStorage.setItem('tripready_saved_trips', JSON.stringify(allTrips));
                  } else {
                    try {
                      await supabase.from('saved_ai_trips').insert([tripData]);
                    } catch (e) {
                      console.error("Failed to save to Supabase, falling back to local storage:", e);
                    }
                  }
                  showToast("Plan auto-saved to your dashboard!");
                };
                saveTripDirectly();
              }
            }
          } catch (jsonErr) {
            console.error("Failed to parse healed Gemini custom plan JSON:", jsonErr, repaired);
          }
        } else {
          console.error("Failed to heal truncated Gemini plan JSON string.", geminiText);
        }
      }
    } catch (e) {
      console.error("Failed to fetch live travel data or Gemini plan:", e);
    }
  };

  // ============================================
  // STEP 3: HIGH FIDELITY DYNAMIC ITINERARY BUILDER
  // ============================================
  const activeDestination = useMemo(() => {
    const lookupKey = destCity.toLowerCase().replace(/[^a-z0-9]/g, '');
    let matched = topDestinations.find(d => d.id === lookupKey || d.name.toLowerCase() === destCity.toLowerCase());
    if (!matched) {
      matched = getFallbackDestination(destCity, destCountry);
    }
    
    const matchKey = Object.keys(attractionKnowledgeBase).find(key => {
      const normKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
      return lookupKey === normKey || lookupKey.includes(normKey) || normKey.includes(lookupKey) || (lookupKey === 'sf' && normKey === 'sanfrancisco') || (lookupKey === 'saintlouis' && normKey === 'stlouis');
    });
    if (matchKey && matched) {
      matched = {
        ...matched,
        attractions: attractionKnowledgeBase[matchKey].map(a => a.name)
      };
      if (realCityFoodAndTransit[matchKey]) {
        matched.foods = realCityFoodAndTransit[matchKey].foods;
        matched.transport = realCityFoodAndTransit[matchKey].transports;
      }
    }
    return matched;
  }, [destCity, destCountry]);

  // Formulate daily itineraries dynamically based on inputs!
  const generatedItinerary = useMemo(() => {
    const attractions = activeDestination.attractions || [];
    const baseFoods = activeDestination.foods || [];
    const daysCount = totalDays;

    const lowerCity = (destCity || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const kbKey = Object.keys(attractionKnowledgeBase).find(key => {
      const normKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
      return lowerCity === normKey || lowerCity.includes(normKey) || normKey.includes(lowerCity) || (lowerCity === 'sf' && normKey === 'sanfrancisco') || (lowerCity === 'saintlouis' && normKey === 'stlouis');
    }) || null;

    if (kbKey && attractionKnowledgeBase[kbKey]) {
      const kbAttractions = attractionKnowledgeBase[kbKey];
      const foods = realCityFoodAndTransit[kbKey]?.foods || baseFoods;
      const transitList = realCityFoodAndTransit[kbKey]?.transports || [];
      const localTransit = transitList[0] || 'Local Cab / Walk';

      const itineraryList = [];

      // Day 1: Arrival & Orientation
      itineraryList.push({
        day: 1,
        title: `Day 1: Arrival & Hotel Orientation in ${destCity}`,
        weatherShift: false,
        weatherAdaptMessage: null,
        morning: {
          time: '11:00 AM',
          breakfast: 'Airport Lounge Refreshments / Transit Snacks',
          attraction: `Flight Arrival at ${destCity} International Terminal & Customs`,
          attractionImg: kbAttractions[0]?.image || getAttractionImage(destCity, 0),
          duration: '2 hours',
          price: 'Included in Airfare',
          crowd: 'High Peak Density',
          photoTip: 'Keep entry visa stamp and passport documents readily accessible for photo verification.',
          expenses: 0,
          transport: localTransit,
          distance: '12 miles from Airport',
          travelTime: '35 mins'
        },
        afternoon: {
          time: '02:00 PM',
          lunch: 'Light Local Cafe Snack near Hotel Lobby',
          attraction: `Hotel Check-in, Unpacking and Rest / Jetlag Recovery`,
          attractionImg: kbAttractions[1]?.image || getAttractionImage(destCity, 1),
          duration: '3 hours',
          price: 'Free',
          crowd: 'Low Density',
          photoTip: 'Capture the cozy room view framing the bustling local skyline below.',
          expenses: 0,
          walkingRoute: `Direct elevator check-in transfer from reception desk straight to your private suite.`
        },
        evening: {
          time: '06:00 PM',
          sunsetSpot: kbAttractions[kbAttractions.length - 1]?.name ? `${kbAttractions[kbAttractions.length - 1].name} Sunset Stroll` : `${destCity} Central Promenade Stroll`,
          sunsetSpotImg: kbAttractions[Math.min(kbAttractions.length - 1, 8)]?.image || getAttractionImage(destCity, 2),
          dinner: `${foods[0]} - Welcome Dinner`,
          nightlife: 'Early neighborhood walk & relaxing beverage before turning in',
          expenses: budgetTier === 'Budget' ? 10 : budgetTier === 'Luxury' ? 60 : 30
        },
        night: {
          time: '10:00 PM',
          hotelReturn: 'Return to hotel room for an early sleep to align with the local timezone.',
          safetyNote: 'Store your physical passports, visa documents, and jewelry inside the hotel room safe.',
          nextDayPrep: 'Unpack your comfortable walking shoes and charge all camera/phone batteries for tomorrow.'
        }
      });

      // Pre-defined intermediate days based on city.
      let intermediatePlans = [];
      if (kbKey === 'lahore') {
        intermediatePlans = [
          {
            title: `Mughal Heritage & Food Street`,
            morning: {
              time: '09:00 AM',
              breakfast: 'Halwa Puri Breakfast with Sweet Lassi',
              attraction: 'Badshahi Mosque',
              duration: '1.5 hours',
              price: 'Free',
              crowd: 'Low Density',
              photoTip: 'Shoot from the main courtyard gate to capture the massive marble domes.',
              expenses: 0,
              transport: 'Careem / inDrive',
              distance: '3 miles',
              travelTime: '15 mins'
            },
            afternoon: {
              time: '01:00 PM',
              lunch: 'Traditional Seekh Kebab & Naan at Cooco\'s Den',
              attraction: 'Lahore Fort (Shahi Qila)',
              duration: '2.5 hours',
              price: 'PKR 500',
              crowd: 'Moderate Density',
              photoTip: 'Capture the glass reflections in Sheesh Mahal.',
              expenses: 5,
              walkingRoute: 'Walk through the historical passage connecting the Mosque and the Fort.'
            },
            evening: {
              time: '06:00 PM',
              sunsetSpot: 'Minar-e-Pakistan',
              sunsetSpotImg: kbAttractions[4]?.image,
              dinner: 'Fort Road Food Street - Rooftop Mutton Karahi',
              nightlife: 'Enjoy traditional live music and views of illuminated monuments from the rooftop',
              expenses: budgetTier === 'Budget' ? 15 : budgetTier === 'Luxury' ? 60 : 30
            }
          },
          {
            title: `Walled City Art, Culture & Local Shopping`,
            morning: {
              time: '09:30 AM',
              breakfast: 'Siri Paye mutton broth & fresh tandoori naan',
              attraction: 'Wazir Khan Mosque',
              duration: '1 hour',
              price: 'Free',
              crowd: 'Low Density',
              photoTip: 'Focus on the intricate kashi-kari tile-work details on the minarets.',
              expenses: 0,
              transport: 'Careem / Auto-Rickshaw',
              distance: '2 miles',
              travelTime: '12 mins'
            },
            afternoon: {
              time: '01:30 PM',
              lunch: 'Spiced Biryani & local mint cooler',
              attraction: 'Lahore Museum',
              duration: '2 hours',
              price: 'PKR 1000',
              crowd: 'Moderate Density',
              photoTip: 'Use soft side-lighting to frame the Fasting Buddha.',
              expenses: 4,
              walkingRoute: 'Head out to the Mall Road and explore colonial-era structures.'
            },
            evening: {
              time: '06:00 PM',
              sunsetSpot: 'Anarkali Bazaar',
              sunsetSpotImg: kbAttractions[7]?.image,
              dinner: 'Tikka Boti & Seekh Kebab skewers',
              nightlife: 'Shop for traditional embroidered khussas and local bangles',
              expenses: budgetTier === 'Budget' ? 12 : budgetTier === 'Luxury' ? 50 : 25
            }
          },
          {
            title: `Imperial Gardens & Modern Shopping`,
            morning: {
              time: '09:00 AM',
              breakfast: 'Lassi and paratha rolls at a local dairy',
              attraction: 'Shalimar Gardens',
              duration: '1.5 hours',
              price: 'PKR 500',
              crowd: 'Low Density',
              photoTip: 'Shoot along the central water canal to frame the marble pavilions.',
              expenses: 3,
              transport: 'Orange Line Metro Train',
              distance: '6 miles',
              travelTime: '20 mins'
            },
            afternoon: {
              time: '01:30 PM',
              lunch: 'Lahori Chargha chicken with garlic sauce',
              attraction: 'Liberty Market',
              duration: '3 hours',
              price: 'Free Entry',
              crowd: 'High Density',
              photoTip: 'Capture the bustling neon signs and fashion booths.',
              expenses: 0,
              walkingRoute: 'Walk the circular plaza exploring silks, crafts, and gold bazaars.'
            },
            evening: {
              time: '06:00 PM',
              sunsetSpot: 'Gowalmandi Food Street',
              sunsetSpotImg: kbAttractions[6]?.image,
              dinner: 'Crispy Gol Gappay and Rabri Kulfi',
              nightlife: 'Sip hot cardamom tea (Kashmiri Chai) at a roadside kiosk',
              expenses: budgetTier === 'Budget' ? 10 : budgetTier === 'Luxury' ? 40 : 20
            }
          }
        ];
      } else if (kbKey === 'sanfrancisco') {
        intermediatePlans = [
          {
            title: `Iconic Vistas & Cable Cars`,
            morning: {
              time: '09:00 AM',
              breakfast: 'Sourdough croissants and pour-over coffee',
              attraction: 'Golden Gate Bridge',
              duration: '2.5 hours',
              price: 'Free',
              crowd: 'Moderate Density',
              photoTip: 'Frame the bridge towers from the Battery Spencer overlook.',
              expenses: 0,
              transport: 'MUNI Bus',
              distance: '4 miles',
              travelTime: '18 mins'
            },
            afternoon: {
              time: '01:00 PM',
              lunch: 'Dungeness Crab roll at Marina Green',
              attraction: 'Lombard Street',
              duration: '1.5 hours',
              price: 'Free',
              crowd: 'High Density',
              photoTip: 'Capture the eight hairpin turns from the bottom of the street.',
              expenses: 0,
              walkingRoute: 'Walk up the stairs along the crooked street.'
            },
            evening: {
              time: '05:30 PM',
              sunsetSpot: 'Cable Cars',
              sunsetSpotImg: kbAttractions[3]?.image,
              dinner: 'Ghirardelli Chocolate Hot Fudge Sundae & Italian dinner at North Beach',
              nightlife: 'Ride the Powell-Hyde Cable Car hanging off the side to Union Square',
              expenses: budgetTier === 'Budget' ? 25 : budgetTier === 'Luxury' ? 90 : 50
            }
          },
          {
            title: `Waterfront Exploration & Science`,
            morning: {
              time: '08:30 AM',
              breakfast: 'Fresh beignets and hot cafe au lait',
              attraction: 'Alcatraz Island',
              duration: '3 hours',
              price: '$45 per person',
              crowd: 'High Density',
              photoTip: 'Take a portrait framing the cellblock corridor depth.',
              expenses: 45,
              transport: 'Alcatraz City Cruises Ferry',
              distance: '1.5 miles by water',
              travelTime: '20 mins'
            },
            afternoon: {
              time: '01:00 PM',
              lunch: 'Sourdough Bread Bowl Clam Chowder at Boudin',
              attraction: 'Fisherman\'s Wharf & Pier 39',
              duration: '2 hours',
              price: 'Free Entry',
              crowd: 'High Density',
              photoTip: 'Get a wide shot of the barking sea lions lounging on docks.',
              expenses: 0,
              walkingRoute: 'Stroll east along the Embarcadero pedestrian promenade.'
            },
            evening: {
              time: '06:00 PM',
              sunsetSpot: 'Exploratorium',
              sunsetSpotImg: kbAttractions[8]?.image,
              dinner: 'Mission Style Burrito from La Taqueria',
              nightlife: 'Enjoy interactive science experiments during Exploratorium After Dark',
              expenses: budgetTier === 'Budget' ? 18 : budgetTier === 'Luxury' ? 70 : 35
            }
          },
          {
            title: `Culture, Parks & Panoramic Views`,
            morning: {
              time: '09:00 AM',
              breakfast: 'Avocado toast and matcha latte',
              attraction: 'Golden Gate Park',
              duration: '3 hours',
              price: 'Free Entry',
              crowd: 'Moderate Density',
              photoTip: 'Snap the serene Japanese Tea Garden pagoda.',
              expenses: 0,
              transport: 'Waymo Driverless Cab',
              distance: '5 miles',
              travelTime: '15 mins'
            },
            afternoon: {
              time: '01:30 PM',
              lunch: 'Dim Sum at Ross Alley in Chinatown',
              attraction: 'Chinatown',
              duration: '2.5 hours',
              price: 'Free Entry',
              crowd: 'High Density',
              photoTip: 'Frame the Grant Avenue street lanterns and Dragon Gate.',
              expenses: 0,
              walkingRoute: 'Walk from the Chinatown Dragon Gate down Post Street to Union Square.'
            },
            evening: {
              time: '06:00 PM',
              sunsetSpot: 'Twin Peaks',
              sunsetSpotImg: kbAttractions[7]?.image,
              dinner: 'Upscale dining or local eats around Union Square',
              nightlife: 'Take in the 360-degree city skyline lights from the top of Twin Peaks',
              expenses: budgetTier === 'Budget' ? 20 : budgetTier === 'Luxury' ? 85 : 45
            }
          }
        ];
      } else if (kbKey === 'stlouis') {
        intermediatePlans = [
          {
            title: `Historic Landmarks & Downtown Architecture`,
            morning: {
              time: '09:00 AM',
              breakfast: 'Fitz\'s Root Beer Float & pancakes',
              attraction: 'Gateway Arch',
              duration: '2 hours',
              price: '$19 per person',
              crowd: 'Moderate Density',
              photoTip: 'Capture the curved arch framing the Old Courthouse at sunset/sunrise.',
              expenses: 19,
              transport: 'MetroLink Light Rail',
              distance: '2 miles',
              travelTime: '10 mins'
            },
            afternoon: {
              time: '01:30 PM',
              lunch: 'St. Louis Style Thin Crust Pizza at IMO\'s',
              attraction: 'St. Louis Union Station',
              duration: '2.5 hours',
              price: '$25 entry (Aquarium)',
              crowd: 'Moderate Density',
              photoTip: 'Use a wide-angle lens to capture the barrel-vaulted ceiling of the Grand Hall.',
              expenses: 25,
              walkingRoute: 'Walk west on Market Street exploring downtown parks.'
            },
            evening: {
              time: '06:00 PM',
              sunsetSpot: 'Grand Hall Laser Light Show',
              sunsetSpotImg: kbAttractions[5]?.image,
              dinner: 'Toasted Ravioli with marinara dipping',
              nightlife: 'Enjoy the 3D laser projection show in the station lobby',
              expenses: budgetTier === 'Budget' ? 15 : budgetTier === 'Luxury' ? 60 : 30
            }
          },
          {
            title: `Forest Park Greenery & Interactive Science`,
            morning: {
              time: '09:00 AM',
              breakfast: 'Fresh pastries and espresso at Central West End',
              attraction: 'Forest Park',
              duration: '3 hours',
              price: 'Free Entry',
              crowd: 'Low Density',
              photoTip: 'Capture the Art Museum facade standing atop Art Hill.',
              expenses: 0,
              transport: 'Lime Scooter',
              distance: '3 miles',
              travelTime: '15 mins'
            },
            afternoon: {
              time: '01:00 PM',
              lunch: 'Gourmet sandwiches at Forest Park Boathouse',
              attraction: 'Saint Louis Science Center',
              duration: '2 hours',
              price: 'Free (Planetarium paid)',
              crowd: 'Moderate Density',
              photoTip: 'Snapshot the dinosaur exhibits from the upper balcony.',
              expenses: 0,
              walkingRoute: 'Take the indoor pedestrian skybridge directly over Highway 40.'
            },
            evening: {
              time: '06:00 PM',
              sunsetSpot: 'Missouri Botanical Garden',
              sunsetSpotImg: kbAttractions[1]?.image,
              dinner: 'Ted Drewes Frozen Custard concrete & BBQ Pork Steaks',
              nightlife: 'Stroll through the Japanese garden bridges as the evening lights turn on',
              expenses: budgetTier === 'Budget' ? 18 : budgetTier === 'Luxury' ? 65 : 35
            }
          },
          {
            title: `Technology Innovation & Bob Cassilly's Playgrounds`,
            morning: {
              time: '09:30 AM',
              breakfast: 'Coffee and local bagels at Cortex hub',
              attraction: 'Cortex Innovation District',
              duration: '1.5 hours',
              price: 'Free',
              crowd: 'Low Density',
              photoTip: 'Snap the modern brick facades and community lawn area.',
              expenses: 0,
              transport: 'MetroLink Rail',
              distance: '2 miles',
              travelTime: '8 mins'
            },
            afternoon: {
              time: '01:30 PM',
              lunch: 'Modern salad bowls at Cortex Commons',
              attraction: 'City Museum',
              duration: '3.5 hours',
              price: '$20 per person',
              crowd: 'High Density',
              photoTip: 'Frame the school bus hanging off the rooftop edge.',
              expenses: 20,
              walkingRoute: 'Ride share directly to Washington Ave loft district.'
            },
            evening: {
              time: '06:00 PM',
              sunsetSpot: 'City Museum Rooftop Ferris Wheel',
              sunsetSpotImg: kbAttractions[3]?.image,
              dinner: 'Gooey Butter Cake dessert & gastropub burgers',
              nightlife: 'Explore the rooftop bus and architectural slides',
              expenses: budgetTier === 'Budget' ? 22 : budgetTier === 'Luxury' ? 75 : 40
            }
          }
        ];
      } else {
        // Dynamic fallback: generate 3 intermediate day plans from the city's KB attractions
        const dayThemes = ['Heritage Landmarks & Cultural Exploration', 'Art, Nature & Local Life', 'Hidden Gems & Iconic Views'];
        intermediatePlans = dayThemes.map((theme, themeIdx) => {
          const morningAttr = kbAttractions[themeIdx * 3] || kbAttractions[0];
          const afternoonAttr = kbAttractions[themeIdx * 3 + 1] || kbAttractions[1];
          const eveningAttr = kbAttractions[themeIdx * 3 + 2] || kbAttractions[2];
          return {
            title: theme,
            morning: {
              time: '09:00 AM',
              breakfast: `${foods[themeIdx % foods.length] || 'Local Café Breakfast'} & Fresh Brew`,
              attraction: morningAttr.name,
              duration: morningAttr.visitDuration || '2 hours',
              price: budgetTier === 'Budget' ? 'Free Access' : '$15 per person',
              crowd: 'Moderate Density',
              photoTip: `Frame ${morningAttr.name} with morning golden light for dramatic effect.`,
              expenses: budgetTier === 'Budget' ? 0 : 15,
              transport: localTransit,
              distance: '3 miles',
              travelTime: '15 mins'
            },
            afternoon: {
              time: '01:30 PM',
              lunch: `${foods[(themeIdx + 2) % foods.length] || 'Gourmet Local Bistro'} & Regional Specialties`,
              attraction: afternoonAttr.name,
              duration: afternoonAttr.visitDuration || '2.5 hours',
              price: budgetTier === 'Budget' ? 'Free Access' : '$20 per person',
              crowd: 'High Peak Density',
              photoTip: `Capture the unique architectural details of ${afternoonAttr.name} from a low angle.`,
              expenses: budgetTier === 'Budget' ? 5 : 20,
              walkingRoute: `Scenic pedestrian route through ${destCity} historic quarter`
            },
            evening: {
              time: '06:00 PM',
              sunsetSpot: eveningAttr.name,
              sunsetSpotImg: eveningAttr.image,
              dinner: `${foods[(themeIdx + 4) % foods.length] || 'Traditional Evening Feast'} - Dinner`,
              nightlife: energyLevel === 'Relaxed' ? 'Quiet evening garden stroll' : 'Rooftop lounge with panoramic city views',
              expenses: budgetTier === 'Budget' ? 15 : budgetTier === 'Luxury' ? 70 : 35
            }
          };
        });
      }

      for (let d = 2; d < daysCount; d++) {
        const planIndex = (d - 2) % intermediatePlans.length;
        const basePlan = intermediatePlans[planIndex];

        const attrMorning = kbAttractions.find(a => a.name.toLowerCase().includes(basePlan.morning.attraction.toLowerCase())) || {};
        const attrAfternoon = kbAttractions.find(a => a.name.toLowerCase().includes(basePlan.afternoon.attraction.toLowerCase())) || {};

        itineraryList.push({
          day: d,
          title: `Day ${d}: ${basePlan.title}`,
          weatherShift: d === 2,
          weatherAdaptMessage: d === 2 ? 'AI Weather Shield: Indoor galleries prioritized this afternoon due to high humidity forecast.' : null,
          morning: {
            ...basePlan.morning,
            attractionImg: attrMorning.image || getAttractionImage(destCity, d - 1)
          },
          afternoon: {
            ...basePlan.afternoon,
            attractionImg: attrAfternoon.image || getAttractionImage(destCity, d + 4)
          },
          evening: {
            ...basePlan.evening
          },
          night: {
            time: '10:00 PM',
            hotelReturn: `Private ride transfer back to hotel in ${destCity}.`,
            safetyNote: 'Keep personal items secured. Keep a copy of your hotel address card.',
            nextDayPrep: 'Charge your electronic devices and check weather forecast for outdoor conditions.'
          }
        });
      }

      if (daysCount > 1) {
        itineraryList.push({
          day: daysCount,
          title: `Day ${daysCount}: Souvenir Shopping & Departure from ${destCity}`,
          weatherShift: false,
          weatherAdaptMessage: null,
          morning: {
            time: '09:00 AM',
            breakfast: 'Final Hotel Buffet Breakfast & Specialty Coffee',
            attraction: `Souvenir Shopping at Local Crafts & Heritage Artisan Bazaars`,
            attractionImg: kbAttractions[kbAttractions.length - 1]?.image || getAttractionImage(destCity, 3),
            duration: '2.5 hours',
            price: 'Free Entry',
            crowd: 'Moderate Density',
            photoTip: 'Capture the colorful handicrafts display booths using soft side-angle morning lighting.',
            expenses: budgetTier === 'Budget' ? 15 : budgetTier === 'Luxury' ? 120 : 50,
            transport: localTransit,
            distance: '1.2 miles',
            travelTime: '10 mins'
          },
          afternoon: {
            time: '01:00 PM',
            lunch: `Farewell Local Diner - Tasting ${foods[foods.length - 1]}`,
            attraction: `Hotel Checkout, Luggage Retrieval & Airport Departure Transfer`,
            attractionImg: kbAttractions[0]?.image || getAttractionImage(destCity, 4),
            duration: '3 hours',
            price: 'Free',
            crowd: 'High Peak Density',
            photoTip: 'Snapshot a final group picture in the beautiful hotel lobby entrance.',
            expenses: 0,
            walkingRoute: `Lobby checkout followed by direct shuttle boarding to the main international departures terminal.`
          },
          evening: {
            time: '06:00 PM',
            sunsetSpot: 'Airport Departure Gate Lounge View',
            sunsetSpotImg: kbAttractions[1]?.image || getAttractionImage(destCity, 5),
            dinner: 'In-flight Dining Platter or Departure Gate Food Court',
            nightlife: 'Boarding the return flight back home',
            expenses: budgetTier === 'Budget' ? 8 : budgetTier === 'Luxury' ? 45 : 20
          },
          night: {
            time: '10:00 PM',
            hotelReturn: 'Safe arrival back at your home airport, concluding your amazing vacation.',
            safetyNote: 'Keep baggage claim tickets ready to retrieve checked-in suitcases quickly.',
            nextDayPrep: 'Reflect on wonderful memories, unpack souvenirs, and start sorting your travel photos!'
          }
        });
      }

      if (daysCount === 1) {
        itineraryList.length = 0;
        itineraryList.push({
          day: 1,
          title: `Day 1: Express Highlights Tour of ${destCity}`,
          weatherShift: false,
          weatherAdaptMessage: null,
          morning: {
            time: '08:30 AM',
            breakfast: `Express Cafe breakfast with local roast`,
            attraction: kbAttractions[0]?.name || 'Primary Heritage Site',
            attractionImg: kbAttractions[0]?.image || getAttractionImage(destCity, 0),
            duration: '2 hours',
            price: 'Free',
            crowd: 'Moderate',
            photoTip: 'Frame the facade with morning sun rays.',
            expenses: 10,
            transport: localTransit,
            distance: '3 miles',
            travelTime: '15 mins'
          },
          afternoon: {
            time: '01:00 PM',
            lunch: `${foods[0]} - Quick lunch`,
            attraction: kbAttractions[1]?.name || 'Secondary Landmark',
            attractionImg: kbAttractions[1]?.image || getAttractionImage(destCity, 1),
            duration: '2 hours',
            price: 'Free',
            crowd: 'High',
            photoTip: 'Shoot from high angle looking down.',
            expenses: 15,
            walkingRoute: 'Follow pedestrian sidewalk path directly.'
          },
          evening: {
            time: '06:00 PM',
            sunsetSpot: kbAttractions[kbAttractions.length - 1]?.name || 'Sunset Viewpoint',
            sunsetSpotImg: kbAttractions[kbAttractions.length - 1]?.image || getAttractionImage(destCity, 2),
            dinner: `Farewell Feast: ${foods[1] || 'Traditional Meal'}`,
            nightlife: 'Express transit back to airport for late night flight',
            expenses: budgetTier === 'Budget' ? 20 : budgetTier === 'Luxury' ? 80 : 40
          },
          night: {
            time: '10:00 PM',
            hotelReturn: 'Conclude express trip and board flight.',
            safetyNote: 'Ensure bags are packed and boarding passes printed.',
            nextDayPrep: 'Safe travel back home!'
          }
        });
      }

      return itineraryList;
    }

    // Scale plans matching energy level
    let itemsPerDay = 3; 
    if (energyLevel === 'Relaxed') itemsPerDay = 2;
    if (energyLevel === 'Fast-Paced') itemsPerDay = 4;

    const itineraryList = [];
    const cLower = (destCountry || '').toLowerCase();
    
    // Define geographic multi-city hubs & routing
    let hubs = [];
    if (cLower.includes('india')) {
      hubs = [
        { name: 'Delhi', region: 'North', travelTime: 'Base Hub', trans: 'Flight Arrival' },
        { name: 'Agra & Jaipur', region: 'Golden Triangle', travelTime: '4 hrs via Expressway', trans: 'Express Train' },
        { name: 'Mumbai', region: 'West Coast', travelTime: '2 hrs via Flight', trans: 'Domestic Air' },
        { name: 'Goa', region: 'South Coast', travelTime: '1 hr via Flight', trans: 'Domestic Air' },
        { name: 'Kerala', region: 'Deep South', travelTime: '1.5 hrs via Flight', trans: 'Domestic Air' }
      ];
    } else if (cLower.includes('japan')) {
      hubs = [
        { name: 'Tokyo', region: 'Kanto', travelTime: 'Base Hub', trans: 'Flight Arrival' },
        { name: 'Kyoto', region: 'Kansai East', travelTime: '2 hrs via Bullet Train', trans: 'Shinkansen Bullet Train' },
        { name: 'Osaka', region: 'Kansai South', travelTime: '30 mins via Rapid Rail', trans: 'JR Rapid Rail' },
        { name: 'Nara', region: 'Kansai Heritage', travelTime: '45 mins via Local Express', trans: 'Kintetsu Express' }
      ];
    } else if (cLower.includes('pakistan')) {
      hubs = [
        { name: 'Lahore', region: 'Punjab', travelTime: 'Base Hub', trans: 'Flight Arrival' },
        { name: 'Islamabad', region: 'Capital Territory', travelTime: '4 hrs via Motorway M-2', trans: 'Intercity Shuttle' },
        { name: 'Hunza Valley', region: 'Gilgit-Baltistan North', travelTime: '1 hr Flight + 3 hrs Road', trans: 'C-130 Flight / SUV' },
        { name: 'Skardu', region: 'Baltistan East', travelTime: '4 hrs via Karakoram Highway', trans: '4x4 Jeep transfer' }
      ];
    } else if (cLower.includes('switzerland')) {
      hubs = [
        { name: 'Zurich', region: 'North Swiss', travelTime: 'Base Hub', trans: 'Flight Arrival' },
        { name: 'Interlaken', region: 'Bernese Oberland', travelTime: '1.5 hrs via Train', trans: 'SBB Federal Rail' },
        { name: 'Zermatt', region: 'Valais Alps', travelTime: '2 hrs via Train', trans: 'Matterhorn Gotthard Bahn' },
        { name: 'Geneva', region: 'West Swiss', travelTime: '2.5 hrs via Train', trans: 'SBB Federal Rail' }
      ];
    } else if (cLower.includes('saudi') || cLower.includes('arabia')) {
      hubs = [
        { name: 'Jeddah', region: 'West Coast', travelTime: 'Base Hub', trans: 'Flight Arrival' },
        { name: 'Mecca (Makkah)', region: 'Hijaz Holy City', travelTime: '1 hr via Rail', trans: 'Haramain Bullet Train' },
        { name: 'Medina (Madinah)', region: 'Prophet\'s Sanctuary', travelTime: '2 hrs via Rail', trans: 'Haramain Bullet Train' },
        { name: 'AlUla', region: 'Ancient Nabataean Valleys', travelTime: '1 hr Flight + 1 hr Road', trans: 'Domestic Air / SUV' },
        { name: 'Riyadh', region: 'Central Najd', travelTime: '1.5 hrs via Flight', trans: 'Domestic Air' },
        { name: 'Taif', region: 'Sarawat Highlands', travelTime: '2 hrs via Highway', trans: 'Private GMC SUV' }
      ];
    }

    for (let d = 1; d <= daysCount; d++) {
      let currentHubName = activeDestination.name;
      let transitInfo = 'None (Local walking routing)';
      let travelTime = 'Local';
      if (cLower.includes('saudi') || cLower.includes('arabia')) {
        // Special high-fidelity AI Saudi Arabia Itinerary Planner
        const jdDays = Math.max(1, Math.floor(daysCount * 0.15));
        const mkDays = Math.max(2, Math.floor(daysCount * 0.25));
        const mdDays = Math.max(2, Math.floor(daysCount * 0.20));
        const auDays = Math.max(1, Math.floor(daysCount * 0.15));
        const ryDays = Math.max(1, Math.floor(daysCount * 0.15));
        
        let activeHubIndex = 0;
        if (d <= jdDays) {
          activeHubIndex = 0; // Jeddah
        } else if (d <= jdDays + mkDays) {
          activeHubIndex = 1; // Mecca
        } else if (d <= jdDays + mkDays + mdDays) {
          activeHubIndex = 2; // Medina
        } else if (d <= jdDays + mkDays + mdDays + auDays) {
          activeHubIndex = 3; // AlUla
        } else if (d <= jdDays + mkDays + mdDays + auDays + ryDays) {
          activeHubIndex = 4; // Riyadh
        } else if (d < daysCount) {
          activeHubIndex = 5; // Taif
        } else {
          activeHubIndex = 0; // Return to Jeddah on the final day for departure
        }

        const hub = hubs[activeHubIndex] || hubs[0];
        currentHubName = hub.name;
        transitInfo = hub.trans;
        travelTime = hub.travelTime;
        
        // Calculate day index within this specific hub
        let dayInHub = 1;
        if (activeHubIndex === 0 && d === daysCount) {
          dayInHub = jdDays + 1; // Departure day
        } else {
          let startDayOfHub = 1;
          if (activeHubIndex > 0) startDayOfHub += jdDays;
          if (activeHubIndex > 1) startDayOfHub += mkDays;
          if (activeHubIndex > 2) startDayOfHub += mdDays;
          if (activeHubIndex > 3) startDayOfHub += auDays;
          if (activeHubIndex > 4) startDayOfHub += ryDays;
          dayInHub = d - startDayOfHub + 1;
        }

        // Build Saudi Arabian custom activities
        let dayTitle = `Day ${d}: Exploring ${currentHubName}`;
        let morning = {};
        let afternoon = {};
        let evening = {};
        let night = {};

        if (currentHubName === 'Jeddah') {
          if (dayInHub === 1) {
            dayTitle = `Day ${d}: Arrival & Red Sea Vistas in Jeddah`;
            morning = {
              time: '10:00 AM',
              breakfast: 'Transit Snacks & Specialty Arabic Coffee',
              attraction: 'Arrival at Jeddah King Abdulaziz International Airport (JED) & Customs',
              attractionImg: getAttractionImage('Jeddah', 0),
              duration: '2.5 hours',
              price: 'Included',
              crowd: 'High Peak Density',
              photoTip: 'Snapshot the stunning modern architecture of the airport terminal halls.',
              expenses: 0,
              transport: 'Private SUV transfer',
              distance: '15 miles',
              travelTime: '30 mins'
            };
            afternoon = {
              time: '02:00 PM',
              lunch: 'Red Sea Local Coastal Seafood Grill',
              attraction: 'Hotel Check-in & Red Sea Corniche sunset stroll',
              attractionImg: getAttractionImage('Jeddah', 1),
              duration: '3 hours',
              price: 'Free',
              crowd: 'Low Density',
              photoTip: 'Frame the beautiful shoreline skyline at sunset.',
              expenses: 15,
              walkingRoute: 'Unpack luggage at hotel, then walk directly along the seaside promenade.'
            };
            evening = {
              time: '06:00 PM',
              sunsetSpot: 'King Fahd\'s Fountain & Coastal Walkways',
              sunsetSpotImg: getAttractionImage('Jeddah', 2),
              dinner: 'Al-Anbariah Seafood Heritage Grill',
              nightlife: 'Arabic Tea & Dates at a seaside cafe lounge',
              expenses: budgetTier === 'Budget' ? 15 : budgetTier === 'Luxury' ? 80 : 35
            };
          } else if (d === daysCount) {
            // Final Departure Day
            dayTitle = `Day ${d}: Farewell Saudi Arabia & Departure`;
            morning = {
              time: '09:00 AM',
              breakfast: 'Fresh Shakshuka & Mutabbaq Buffet at Hotel',
              attraction: 'Souvenir shopping for local Ajwa dates and oud oils in Jeddah',
              attractionImg: getAttractionImage('Jeddah', 3),
              duration: '3 hours',
              price: 'Free',
              crowd: 'Moderate Density',
              photoTip: 'Buy authentic gifts and dates to photograph in vintage boxes.',
              expenses: budgetTier === 'Budget' ? 20 : budgetTier === 'Luxury' ? 150 : 60,
              transport: 'Taxi',
              distance: '2.5 miles',
              travelTime: '15 mins'
            };
            afternoon = {
              time: '01:00 PM',
              lunch: 'Al-Baik Famous Local Fried Chicken (Jeddah favorite)',
              attraction: 'Hotel Checkout and Airport Departures Terminal Transfer',
              attractionImg: getAttractionImage('Jeddah', 4),
              duration: '2 hours',
              price: 'Free',
              crowd: 'High Density',
              photoTip: 'Final snapshot with airport backdrop.',
              expenses: 0,
              walkingRoute: 'Lobby checkout followed by direct shuttle boarding to departed terminal.'
            };
            evening = {
              time: '05:00 PM',
              sunsetSpot: 'JED Departures Lounge Overlooking Runway',
              sunsetSpotImg: getAttractionImage('Jeddah', 5),
              dinner: 'International cuisine inside airport departures area',
              nightlife: 'Boarding call for international return flight',
              expenses: 20
            };
          } else {
            // Al-Balad Heritage Day
            dayTitle = `Day ${d}: Historic Al-Balad Heritage Walk (UNESCO)`;
            morning = {
              time: '09:00 AM',
              breakfast: 'Foul & Tamees at a traditional bakery in old Jeddah',
              attraction: 'Historic Al-Balad Walking Tour (Nasseef House & Ancient Gates)',
              attractionImg: getAttractionImage('Jeddah', 6),
              duration: '3 hours',
              price: 'Free',
              crowd: 'Moderate',
              photoTip: 'Capture the intricate wooden Rawshan balconies framing the old streets.',
              expenses: 10,
              transport: 'Walking / Cab',
              distance: '1 mile',
              travelTime: '10 mins'
            };
            afternoon = {
              time: '01:00 PM',
              lunch: 'Yemeni Mandi Rice & Lamb near old market',
              attraction: 'Shopping at Souq Al-Alawi and Red Sea Mall visit',
              attractionImg: getAttractionImage('Jeddah', 7),
              duration: '4 hours',
              price: 'Free',
              crowd: 'High',
              photoTip: 'Colors of spice bags and fabrics.',
              expenses: 15,
              walkingRoute: 'Walk through narrow alleyways of old souq shops.'
            };
            evening = {
              time: '06:00 PM',
              sunsetSpot: 'Red Sea Floating Mosque (Al-Rahmah)',
              sunsetSpotImg: getAttractionImage('Jeddah', 8),
              dinner: 'Modern Middle-Eastern fusion on Corniche',
              nightlife: 'Walk along the Marina Marina boulevard',
              expenses: budgetTier === 'Budget' ? 20 : budgetTier === 'Luxury' ? 100 : 45
            };
          }
        } else if (currentHubName === 'Mecca (Makkah)') {
          // Mecca Holy Umrah Days
          if (dayInHub === 1) {
            dayTitle = `Day ${d}: Journey to Mecca & Performing Umrah Pilgrimage`;
            morning = {
              time: '08:00 AM',
              breakfast: 'Light fruits, tea and dates in preparation for travel',
              attraction: 'Ihram preparation at Miqat & Haramain High-Speed Train to Mecca',
              attractionImg: getAttractionImage('Mecca', 0),
              duration: '2.5 hours',
              price: 'Haramain Train Ticket Included',
              crowd: 'High Density',
              photoTip: 'Photograph the sleek, high-tech Haramain train terminal building.',
              expenses: 25,
              transport: 'Haramain Bullet Train',
              distance: '45 miles',
              travelTime: '34 mins'
            };
            afternoon = {
              time: '01:00 PM',
              lunch: 'Fast Casual food near hotel lobby in Mecca',
              attraction: 'Masjid al-Haram entrance to perform Tawaaf & Sa\'ee (Umrah Pilgrimage)',
              attractionImg: getAttractionImage('Mecca', 1),
              duration: '4 hours',
              price: 'Free (Pilgrimage)',
              crowd: 'High Peak Density',
              photoTip: 'No photography allowed directly during ritual, but capture hills of Safa & Marwa.',
              expenses: 0,
              walkingRoute: 'Walk directly from your Clock Tower hotel to King Abdulaziz gate to start Umrah.'
            };
            evening = {
              time: '06:00 PM',
              sunsetSpot: 'Holy Kaaba Courtyard view after completing Sa\'ee',
              sunsetSpotImg: getAttractionImage('Mecca', 2),
              dinner: 'Traditional Arabic Kabsa dinner in Clock Tower food center',
              nightlife: 'Midnight prayers and rest at Masjid al-Haram',
              expenses: budgetTier === 'Budget' ? 15 : budgetTier === 'Luxury' ? 70 : 30
            };
          } else if (dayInHub === 2) {
            dayTitle = `Day ${d}: Cave of Hira (Jabal al-Nour) & Holy Sanctuary`;
            morning = {
              time: '05:00 AM',
              breakfast: 'Fajr prayer at Haram followed by fresh honey bread and tea',
              attraction: 'Early hike to Jabal al-Nour and visiting Cave of Hira',
              attractionImg: getAttractionImage('Mecca', 3),
              duration: '4 hours',
              price: 'Free',
              crowd: 'High Peak Density',
              photoTip: 'Hike before sunrise. Photograph Mecca city views from the mountain top.',
              expenses: 10,
              transport: 'Taxi transfer to trail base',
              distance: '4 miles',
              travelTime: '15 mins'
            };
            afternoon = {
              time: '01:00 PM',
              lunch: 'Traditional Bukhari rice & grilled chicken',
              attraction: 'Visit the Exhibition of the Two Holy Mosques Architecture',
              attractionImg: getAttractionImage('Mecca', 4),
              duration: '3 hours',
              price: 'Free',
              crowd: 'Moderate',
              photoTip: 'Exquisite pillars and historical manuscript displays.',
              expenses: 5,
              walkingRoute: 'Tour the indoor exhibits displaying Kaaba keys and historical pillars.'
            };
            evening = {
              time: '06:00 PM',
              sunsetSpot: 'Roof terrace of Masjid al-Haram overlooking the minarets',
              sunsetSpotImg: getAttractionImage('Mecca', 5),
              dinner: 'Luxury buffet dining overlooking the Haram courtyard',
              nightlife: 'Spiritual contemplation and prayers at Masjid al-Haram',
              expenses: budgetTier === 'Budget' ? 20 : budgetTier === 'Luxury' ? 120 : 50
            };
          } else {
            // General Mecca visits
            dayTitle = `Day ${d}: Mount Arafat, Mina & Historical Landmarks`;
            morning = {
              time: '08:00 AM',
              breakfast: 'Pancakes, olives, labneh and flatbread at hotel',
              attraction: 'Tour of historical sites (Mina, Muzdalifah, Mount Arafat & Jabal al-Rahmah)',
              attractionImg: getAttractionImage('Mecca', 6),
              duration: '3.5 hours',
              price: 'Free',
              crowd: 'Moderate',
              photoTip: 'Jabal al-Rahmah stone pillar with desert backdrop.',
              expenses: 15,
              transport: 'Private Coach',
              distance: '10 miles',
              travelTime: '25 mins'
            };
            afternoon = {
              time: '01:30 PM',
              lunch: 'Biryani Rice & Salad',
              attraction: 'Shopping at Abraj Al Bait (Mecca Clock Tower Mall)',
              attractionImg: getAttractionImage('Mecca', 7),
              duration: '3 hours',
              price: 'Free',
              crowd: 'High',
              photoTip: 'Macro close-up of the beautiful clock face from the mall entrance.',
              expenses: 30,
              walkingRoute: 'Stroll directly inside the air-conditioned tower mall stores.'
            };
            evening = {
              time: '06:00 PM',
              sunsetSpot: 'Masjid al-Haram marble plazas',
              sunsetSpotImg: getAttractionImage('Mecca', 8),
              dinner: 'Turkish Kebabs at Clock Tower Plaza',
              nightlife: 'Recitation and voluntary prayers at the Kaaba',
              expenses: budgetTier === 'Budget' ? 15 : budgetTier === 'Luxury' ? 90 : 40
            };
          }
        } else if (currentHubName === 'Medina (Madinah)') {
          // Medina Days
          if (dayInHub === 1) {
            dayTitle = `Day ${d}: High-Speed Rail to Medina & Al-Masjid an-Nabawi`;
            morning = {
              time: '08:30 AM',
              breakfast: 'Light croissants and tea in hotel lobby',
              attraction: 'Haramain Bullet Train transfer from Mecca to Medina',
              attractionImg: getAttractionImage('Medina', 0),
              duration: '2.5 hours',
              price: 'Train ticket included',
              crowd: 'Moderate',
              photoTip: 'Fast motion view of Hijaz desert landscape from train window.',
              expenses: 30,
              transport: 'Haramain Bullet Train',
              distance: '270 miles',
              travelTime: '2 hours 15 mins'
            };
            afternoon = {
              time: '02:00 PM',
              lunch: 'Local Madini Rice & Lamb',
              attraction: 'Check-in at Medina hotel & enter Al-Masjid an-Nabawi (Prophet\'s Mosque) to pray in the Rawdah',
              attractionImg: getAttractionImage('Medina', 1),
              duration: '3 hours',
              price: 'Free',
              crowd: 'High Peak Density',
              photoTip: 'Capture the giant motorized umbrella structures opening in the Haram courtyard.',
              expenses: 0,
              walkingRoute: 'Brief check-in at Northern Central hotel, walk directly to Gate 25 of the Prophet\'s Mosque.'
            };
            evening = {
              time: '06:00 PM',
              sunsetSpot: 'Prophet\'s Mosque courtyards during golden hour Maghrib prayer',
              sunsetSpotImg: getAttractionImage('Medina', 2),
              dinner: 'Traditional Madinah heritage food at Al-Tabkha',
              nightlife: 'Walk around the Prophet\'s Mosque under glowing giant umbrellas',
              expenses: budgetTier === 'Budget' ? 12 : budgetTier === 'Luxury' ? 80 : 35
            };
          } else if (dayInHub === 2) {
            dayTitle = `Day ${d}: Quba Mosque (First Mosque) & Mount Uhud`;
            morning = {
              time: '08:00 AM',
              breakfast: 'Arabic bread, falafel, cheese and fresh mint tea',
              attraction: 'Visit Quba Mosque (perform voluntary prayers) & Walk Quba Street',
              attractionImg: getAttractionImage('Medina', 3),
              duration: '3 hours',
              price: 'Free',
              crowd: 'Moderate',
              photoTip: 'White minarets of Quba Mosque framed by date palms.',
              expenses: 5,
              transport: 'Pedestrian walk trail / Taxi',
              distance: '2 miles',
              travelTime: '15 mins'
            };
            afternoon = {
              time: '01:00 PM',
              lunch: 'Grilled fish and hummus platter',
              attraction: 'Mount Uhud Battleground, Archers\' Hill & Martyrs Cemetery visit',
              attractionImg: getAttractionImage('Medina', 4),
              duration: '2.5 hours',
              price: 'Free',
              crowd: 'Moderate',
              photoTip: 'Archer\'s hill panorama overlooking Uhud mountain range.',
              expenses: 10,
              walkingRoute: 'Climb the gentle path up Archers\' Hill for Uhud view.'
            };
            evening = {
              time: '06:00 PM',
              sunsetSpot: 'Mount Uhud lookout point',
              sunsetSpotImg: getAttractionImage('Medina', 5),
              dinner: 'Dates Market (Souq Al-Tumour) tour and dinner',
              nightlife: 'Specialty Ajwa dates tasting & evening prayer at Haram',
              expenses: budgetTier === 'Budget' ? 20 : budgetTier === 'Luxury' ? 110 : 45
            };
          } else {
            // General Medina
            dayTitle = `Day ${d}: Qiblatayn Mosque & Dar Al Madinah Museum`;
            morning = {
              time: '09:00 AM',
              breakfast: 'Medina local breakfast spread',
              attraction: 'Masjid al-Qiblatayn (Mosque of the Two Qiblas) visit',
              attractionImg: getAttractionImage('Medina', 6),
              duration: '2 hours',
              price: 'Free',
              crowd: 'Low',
              photoTip: 'Historic Qibla walls inside.',
              expenses: 5,
              transport: 'Taxi',
              distance: '3.5 miles',
              travelTime: '12 mins'
            };
            afternoon = {
              time: '01:00 PM',
              lunch: 'Shawarma wraps and garlic paste salad',
              attraction: 'Dar Al Madinah Museum Heritage City Models tour',
              attractionImg: getAttractionImage('Medina', 7),
              duration: '3 hours',
              price: '$5 Entry',
              crowd: 'Low',
              photoTip: 'Detailed wooden micro-models of ancient Medina.',
              expenses: 15,
              walkingRoute: 'Walk through air-conditioned galleries with local historians.'
            };
            evening = {
              time: '06:00 PM',
              sunsetSpot: 'Prophet\'s Mosque Northern Courtyard',
              sunsetSpotImg: getAttractionImage('Medina', 8),
              dinner: 'Arabic Mandi rice at local restaurant',
              nightlife: 'Quiet study and recitation at the Prophet\'s library inside Mosque',
              expenses: budgetTier === 'Budget' ? 15 : budgetTier === 'Luxury' ? 85 : 40
            };
          }
        } else if (currentHubName === 'AlUla') {
          // AlUla Ancient Valleys
          if (dayInHub === 1) {
            dayTitle = `Day ${d}: Arrival in AlUla Valley & Elephant Rock Sunset`;
            morning = {
              time: '09:30 AM',
              breakfast: 'Dates and cardamon spiced coffee at airport lounge',
              attraction: 'Travel to AlUla via scenic flight/road & canyon resort check-in',
              attractionImg: getAttractionImage('AlUla', 0),
              duration: '3 hours',
              price: 'Included',
              crowd: 'Low Density',
              photoTip: 'Dramatic sandstone canyons rising from the valley floor.',
              expenses: 40,
              transport: 'SUV transfer',
              distance: '25 miles',
              travelTime: '40 mins'
            };
            afternoon = {
              time: '02:00 PM',
              lunch: 'Organic gourmet farm dining in AlUla Oasis',
              attraction: 'Rest at desert luxury pool villa/tented camp',
              attractionImg: getAttractionImage('AlUla', 1),
              duration: '3.5 hours',
              price: 'Free',
              crowd: 'Low',
              photoTip: 'Framing pool reflecting orange canyon walls.',
              expenses: 0,
              walkingRoute: 'Relaxing lounge around the tented resort pathways.'
            };
            evening = {
              time: '06:00 PM',
              sunsetSpot: 'Elephant Rock (Jabal Al-Fil) outdoor lounges',
              sunsetSpotImg: getAttractionImage('AlUla', 2),
              dinner: 'Wood-fired oven pizza and grill at Elephant Rock outdoor lounge',
              nightlife: 'Stargazing by the campfire pits under the clear desert sky',
              expenses: budgetTier === 'Budget' ? 30 : budgetTier === 'Luxury' ? 220 : 90
            };
          } else {
            // Hegra UNESCO Heritage Day
            dayTitle = `Day ${d}: Hegra (Mada\'in Salih) Nabataean Tombs (UNESCO)`;
            morning = {
              time: '08:00 AM',
              breakfast: 'Organic eggs, olives, and dates at resort',
              attraction: 'Hegra UNESCO archaeological tour (Tomb of Lihyan son of Kuza)',
              attractionImg: getAttractionImage('AlUla', 3),
              duration: '4 hours',
              price: '$25 Entry',
              crowd: 'Moderate',
              photoTip: 'Photograph the iconic monolithic tomb of Lihyan in the morning golden light.',
              expenses: 25,
              transport: 'Vintage Land Rover / Coach',
              distance: '12 miles',
              travelTime: '20 mins'
            };
            afternoon = {
              time: '01:00 PM',
              lunch: 'Modern Mediterranean lunch in Old Town AlUla',
              attraction: 'Dadan and Jabal Ikmah (Lihyanite rock inscriptions open-air library)',
              attractionImg: getAttractionImage('AlUla', 4),
              duration: '3 hours',
              price: 'Included in Hegra pass',
              crowd: 'Low',
              photoTip: 'Inscriptions and carvings high up on red sandstone walls.',
              expenses: 10,
              walkingRoute: 'Walk along the designated wooden boardwalks through canyon ruins.'
            };
            evening = {
              time: '06:00 PM',
              sunsetSpot: 'Harrat Viewpoint overlooking the entire oasis and canyons',
              sunsetSpotImg: getAttractionImage('AlUla', 5),
              dinner: 'Fine dining at Maraya Social on top of the mirrored Maraya Concert Hall',
              nightlife: 'Strolling through the illuminated AlUla Old Town market shops',
              expenses: budgetTier === 'Budget' ? 40 : budgetTier === 'Luxury' ? 350 : 130
            };
          }
        } else if (currentHubName === 'Riyadh') {
          // Riyadh Capital City Days
          if (dayInHub === 1) {
            dayTitle = `Day ${d}: Modern Riyadh Arrival & Sky Bridge Panorama`;
            morning = {
              time: '10:00 AM',
              breakfast: 'Flat white coffee and croissants at upscale cafe',
              attraction: 'Flight/transfer to Riyadh capital & check-in at central high-rise hotel',
              attractionImg: getAttractionImage('Riyadh', 0),
              duration: '3 hours',
              price: 'Included',
              crowd: 'Moderate',
              photoTip: 'Futuristic Riyadh skyline view from hotel lobby.',
              expenses: 50,
              transport: 'Airport Cab',
              distance: '22 miles',
              travelTime: '35 mins'
            };
            afternoon = {
              time: '02:00 PM',
              lunch: 'Kabsa Traditional Rice & Lamb at local heritage diner',
              attraction: 'Kingdom Centre Tower Sky Bridge (300 meters high sky walk)',
              attractionImg: getAttractionImage('Riyadh', 1),
              duration: '2.5 hours',
              price: '$18 Ticket',
              crowd: 'Moderate',
              photoTip: 'Panoramic skyline view through the giant steel frame gaps.',
              expenses: 25,
              walkingRoute: 'Take high-speed elevator directly to the 99th floor sky bridge deck.'
            };
            evening = {
              time: '06:00 PM',
              sunsetSpot: 'Sky Bridge overlooking Olaya business district',
              sunsetSpotImg: getAttractionImage('Riyadh', 2),
              dinner: 'Gourmet Najdi feast at Najd Village Restaurant',
              nightlife: 'Boulevard Riyadh City light shows and walks',
              expenses: budgetTier === 'Budget' ? 25 : budgetTier === 'Luxury' ? 180 : 75
            };
          } else {
            // Diriyah Heritage Day
            dayTitle = `Day ${d}: At-Turaif Heritage Diriyah & Masmak Fort`;
            morning = {
              time: '08:30 AM',
              breakfast: 'Dates, fresh bread, cheese and dates honey syrup',
              attraction: 'Masmak Fort historical mudbrick fortress & Souq Al-Zal carpet souq tour',
              attractionImg: getAttractionImage('Riyadh', 3),
              duration: '3.5 hours',
              price: 'Free',
              crowd: 'Moderate',
              photoTip: 'Masmak Fort mudbrick watchtowers and wooden entry door spear marks.',
              expenses: 10,
              transport: 'Car / Taxi',
              distance: '4 miles',
              travelTime: '15 mins'
            };
            afternoon = {
              time: '01:00 PM',
              lunch: 'Traditional Najdi Camel Meat & Rice or Vegetarian options',
              attraction: 'At-Turaif District in Diriyah (birthplace of the Saudi state, UNESCO site)',
              attractionImg: getAttractionImage('Riyadh', 4),
              duration: '4 hours',
              price: '$15 Entry',
              crowd: 'High',
              photoTip: 'Mud-brick palaces glowing under afternoon sun.',
              expenses: 20,
              walkingRoute: 'Stroll along the wooden walkways crossing the Wadi Hanifa oasis bed.'
            };
            evening = {
              time: '06:00 PM',
              sunsetSpot: 'Bujairi Terrace overlooking At-Turaif ruins',
              sunsetSpotImg: getAttractionImage('Riyadh', 5),
              dinner: 'Fine dining at Bujairi Terrace heritage park',
              nightlife: 'Walk around modern King Abdullah Financial District (KAFD) towers',
              expenses: budgetTier === 'Budget' ? 30 : budgetTier === 'Luxury' ? 260 : 110
            };
          }
        } else if (currentHubName === 'Taif') {
          // Taif Highland Days
          dayTitle = `Day ${d}: Rose Highlands of Taif & Mount Al Hada`;
          morning = {
            time: '09:00 AM',
            breakfast: 'Taif mountain honey, cheese and whole wheat bread',
            attraction: 'Drive up scenic Al Hada Highway & visiting Taif Organic Rose Distilleries',
            attractionImg: getAttractionImage('Taif', 0),
            duration: '4 hours',
            price: 'Free entry',
            crowd: 'Low',
            photoTip: 'Rose distiller boiling copper vats producing organic perfume.',
            expenses: 15,
            transport: 'Scenic drive',
            distance: '50 miles',
            travelTime: '1 hour 20 mins'
          };
          afternoon = {
            time: '01:30 PM',
            lunch: 'Taif mountain grilled meat and local vegetables',
            attraction: 'Al-Shafa mountain peak view & cable car ride over Sarawat highlands',
            attractionImg: getAttractionImage('Taif', 1),
            duration: '3 hours',
            price: '$20 Ticket',
            crowd: 'Moderate',
            photoTip: 'Red cable car suspended high above jagged orange mountains.',
            expenses: 25,
            walkingRoute: 'Ride the cable car down the mountain ridge to the valley base station.'
          };
          evening = {
            time: '06:00 PM',
            sunsetSpot: 'Al Hada Mountains edge cliff views',
            sunsetSpotImg: getAttractionImage('Taif', 2),
            dinner: 'Traditional grilled lamb at Al Shafa peak restaurant',
            nightlife: 'Stroll through Shubra Palace museums',
            expenses: budgetTier === 'Budget' ? 20 : budgetTier === 'Luxury' ? 140 : 60
          };
        }

        // Apply default fallbacks
        morning.price = morning.price || 'Included';
        morning.crowd = morning.crowd || 'Moderate';
        morning.photoTip = morning.photoTip || 'Capture details.';
        morning.expenses = morning.expenses || 0;
        morning.transport = morning.transport || 'Local transport';
        morning.distance = morning.distance || '1.5 miles';
        morning.travelTime = morning.travelTime || '10 mins';

        afternoon.price = afternoon.price || 'Free';
        afternoon.crowd = afternoon.crowd || 'Moderate';
        afternoon.photoTip = afternoon.photoTip || 'Frame with lighting.';
        afternoon.expenses = afternoon.expenses || 0;
        afternoon.walkingRoute = afternoon.walkingRoute || 'Walk to next stop.';

        night = {
          time: '10:00 PM',
          hotelReturn: currentHubName === 'Mecca (Makkah)' || currentHubName === 'Medina (Madinah)' 
            ? 'Walk back to your central hotel lobby directly adjacent to the Holy Mosque courtyards.'
            : `Private local transport transfer direct to your hotel lobby inside ${currentHubName}.`,
          safetyNote: currentHubName === 'Mecca (Makkah)' || currentHubName === 'Medina (Madinah)'
            ? 'Masjid al-Haram has round-the-clock security. Keep your card entry key and shoe bag safe.'
            : 'Area is extremely friendly. Secure pockets in bustling crowd sectors.',
          nextDayPrep: currentHubName === 'Mecca (Makkah)'
            ? 'Ensure you wear comfortable footwear for ease of entry during daily prayers.'
            : 'Charge camera batteries and wear comfortable trail shoes for active walks tomorrow.'
        };

        itineraryList.push({
          day: d,
          title: dayTitle,
          weatherShift: d === 3,
          weatherAdaptMessage: d === 3 ? 'Mid-day Hijaz desert temperatures rise. Afternoon activities shifted indoors.' : null,
          morning,
          afternoon,
          evening,
          night
        });
        continue;
      }


      
      if (hubs.length > 0) {
        // Intelligently distribute days geographically based on total trip duration
        const hubCount = hubs.length;
        const daysPerHub = Math.max(1, Math.floor(daysCount / hubCount));
        const hubIndex = Math.min(hubCount - 1, Math.floor((d - 1) / daysPerHub));
        
        currentHubName = hubs[hubIndex].name;
        transitInfo = hubs[hubIndex].trans;
        travelTime = hubs[hubIndex].travelTime;
      }
      
      const mainAttraction = attractions[(d - 1) % attractions.length] || `Scenic Landmark inside ${currentHubName}`;
      const secAttraction = attractions[(d + 4) % attractions.length] || `Traditional Cultural Center`;
      const eveningSpot = attractions[(d + 9) % attractions.length] || `${currentHubName} Sunset Skyline Promenade`;
      
      const isRainExpected = d === 2; // Simulate weather adaptation

      if (d === 1 && daysCount > 1) {
        // Human-like Day 1: Arrival, Hotel Check-in, Unpack, Rest, Light Evening Activity
        itineraryList.push({
          day: d,
          title: `Day 1: Arrival & Hotel Orientation in ${currentHubName}`,
          weatherShift: false,
          weatherAdaptMessage: null,
          morning: {
            time: '11:00 AM',
            breakfast: 'Airport Lounge Refreshments / Transit Snacks',
            attraction: `Flight Arrival at ${currentHubName} International Terminal & Customs`,
            attractionImg: getAttractionImage(currentHubName, 0),
            duration: '2 hours',
            price: 'Included in Airfare',
            crowd: 'High Peak Density',
            photoTip: 'Keep entry visa stamp and passport documents readily accessible for photo verification.',
            expenses: 0,
            transport: transitInfo === 'Flight Arrival' ? 'Airport Shuttle / Taxi Transfer' : transitInfo,
            distance: '12 miles from Airport',
            travelTime: '35 mins'
          },
          afternoon: {
            time: '02:00 PM',
            lunch: 'Light Local Cafe Snack near Hotel Lobby',
            attraction: `Hotel Check-in, Unpacking and Jetlag Recovery Rest`,
            attractionImg: getAttractionImage(currentHubName, 1),
            duration: '3 hours',
            price: 'Free',
            crowd: 'Low Density',
            photoTip: 'Capture the cozy room view framing the bustling local skyline below.',
            expenses: 0,
            walkingRoute: `Direct elevator check-in transfer from reception desk straight to your private suite.`
          },
          evening: {
            time: '06:00 PM',
            sunsetSpot: `Scenic stroll around ${currentHubName} Central Square`,
            sunsetSpotImg: getAttractionImage(currentHubName, 2),
            dinner: `${baseFoods[0] || 'Local Traditional Diner'} - Light Welcome Meal`,
            nightlife: 'Early neighborhood walk & relaxing beverage before turning in',
            expenses: budgetTier === 'Budget' ? 10 : budgetTier === 'Luxury' ? 60 : 30
          },
          night: {
            time: '10:00 PM',
            hotelReturn: 'Return to hotel room for an early sleep to align with the local timezone.',
            safetyNote: 'Store your physical passports, visa documents, and jewelry inside the hotel room safe.',
            nextDayPrep: 'Unpack your comfortable walking shoes and charge all camera/phone batteries for an active tour tomorrow.'
          }
        });
      } else if (d === daysCount && daysCount > 1) {
        // Human-like Final Day: Souvenir Shopping, Packing, Checkout, Airport Departure
        itineraryList.push({
          day: d,
          title: `Day ${d}: Souvenir Shopping & Departure from ${currentHubName}`,
          weatherShift: false,
          weatherAdaptMessage: null,
          morning: {
            time: '09:00 AM',
            breakfast: 'Final Hotel Buffet Breakfast & Specialty Coffee',
            attraction: `Souvenir Shopping at Local Crafts & Heritage Artisan Bazaars`,
            attractionImg: getAttractionImage(currentHubName, 3),
            duration: '2.5 hours',
            price: 'Free Entry',
            crowd: 'Moderate Density',
            photoTip: 'Capture the colorful handicrafts display booths using soft side-angle morning lighting.',
            expenses: budgetTier === 'Budget' ? 15 : budgetTier === 'Luxury' ? 120 : 50,
            transport: 'Local Cab / Walk',
            distance: '1.2 miles',
            travelTime: '10 mins'
          },
          afternoon: {
            time: '01:00 PM',
            lunch: `${baseFoods[(d + 1) % baseFoods.length] || 'Farewell Local Cafe'}`,
            attraction: `Hotel Checkout, Luggage Retrieval & Private Airport Departure Transfer`,
            attractionImg: getAttractionImage(currentHubName, 4),
            duration: '3 hours',
            price: 'Free',
            crowd: 'High Peak Density',
            photoTip: 'Snapshot a final group picture in the beautiful hotel lobby entrance.',
            expenses: 0,
            walkingRoute: `Lobby checkout followed by direct shuttle boarding to the main international departures terminal.`
          },
          evening: {
            time: '06:00 PM',
            sunsetSpot: 'Airport Departure Gate Lounge View',
            sunsetSpotImg: getAttractionImage(currentHubName, 5),
            dinner: 'In-flight Dining Platter or Departure Gate Food Court',
            nightlife: 'Boarding the return flight back home',
            expenses: budgetTier === 'Budget' ? 8 : budgetTier === 'Luxury' ? 45 : 20
          },
          night: {
            time: '10:00 PM',
            hotelReturn: 'Safe arrival back at your home airport, concluding your amazing vacation.',
            safetyNote: 'Keep baggage claim tickets ready to retrieve checked-in suitcases quickly.',
            nextDayPrep: 'Reflect on wonderful memories, unpack souvenirs, and start sorting your travel photos!'
          }
        });
      } else {
        // Standard sightseeing days for day 2 to N-1 (or if 1-day trip)
        itineraryList.push({
          day: d,
          title: `Day ${d}: Explore ${currentHubName}`,
          weatherShift: isRainExpected,
          weatherAdaptMessage: isRainExpected ? 'AI Weather Shift: Outdoor city trails optimized due to localized light rain forecast. Indoor historical galleries moved to this morning.' : null,
          morning: {
            time: energyLevel === 'Relaxed' ? '10:00 AM' : energyLevel === 'Fast-Paced' ? '08:00 AM' : '09:00 AM',
            breakfast: `${baseFoods[d % baseFoods.length] || 'Artisanal Fresh Bakery'} & Roasted Brews`,
            attraction: isRainExpected ? `Historical Museum & Indoor Galleries of ${currentHubName}` : mainAttraction,
            attractionImg: getAttractionImage(currentHubName, d - 1),
            duration: '3 hours',
            price: budgetTier === 'Budget' ? 'Free Access' : '$25 per person',
            crowd: 'Moderate Density',
            photoTip: 'Shoot from the lower terrace at an upward angle to frame golden hour refractions.',
            expenses: budgetTier === 'Budget' ? 0 : 25,
            transport: transitInfo,
            distance: travelTime === 'Local' ? '2.4 miles' : travelTime,
            travelTime: travelTime
          },
          afternoon: {
            time: '01:30 PM',
            lunch: `${baseFoods[(d + 2) % baseFoods.length] || 'Fresh Gourmet Bistro'} and Culinary Kitchens`,
            attraction: secAttraction,
            attractionImg: getAttractionImage(currentHubName, d + 4),
            duration: energyLevel === 'Relaxed' ? '1.5 hours' : '2.5 hours',
            price: budgetTier === 'Budget' ? 'Free Access' : '$35 per person',
            crowd: 'High Peak Density',
            photoTip: 'Capture the colorful entry facade through architectural shadow grids.',
            expenses: budgetTier === 'Budget' ? 5 : 35,
            walkingRoute: `Scenic historic pedestrian walkways inside ${currentHubName}`
          },
          evening: {
            time: '06:00 PM',
            sunsetSpot: eveningSpot,
            sunsetSpotImg: getAttractionImage(currentHubName, d + 9),
            dinner: `${baseFoods[(d + 4) % baseFoods.length] || 'Classic Heritage Tasting Dinner'} Restaurant`,
            nightlife: energyLevel === 'Relaxed' ? 'Quiet Botanical Garden Lounge' : 'Rooftop Lounge and Light Jazz Recitals',
            expenses: budgetTier === 'Budget' ? 12 : budgetTier === 'Luxury' ? 85 : 150
          },
          night: {
            time: '10:00 PM',
            hotelReturn: `Private local transport transfer direct to hotel lobby inside ${currentHubName}.`,
            safetyNote: 'Area is extremely friendly. Secure pockets in bustling crowd sectors.',
            nextDayPrep: 'Lay out water-resistant shell jacket for early outdoor coastal boat trails tomorrow.'
          }
        });
      }
    }
    
    return itineraryList;
  }, [activeDestination, totalDays, energyLevel, budgetTier, destCountry]);

  const displayItinerary = useMemo(() => {
    const rawItinerary = customPlan?.itinerary && Array.isArray(customPlan.itinerary) && customPlan.itinerary.length > 0
      ? customPlan.itinerary
      : generatedItinerary;
      
    if (!rawItinerary || rawItinerary.length === 0) return [];
    
    return rawItinerary.map((day, idx) => {
      const fbDay = generatedItinerary[idx] || generatedItinerary[generatedItinerary.length - 1] || {};
      const dayIdx = idx;
      
      const dayStart = dayStartTimes[dayIdx] !== undefined ? dayStartTimes[dayIdx] : 480; 
      
      const morningDur = activityDurations[`day-${dayIdx}-morning`] !== undefined 
        ? activityDurations[`day-${dayIdx}-morning`] 
        : parseDurationToMins(day?.morning?.duration || fbDay.morning?.duration || '2 hours');
        
      const afternoonDur = activityDurations[`day-${dayIdx}-afternoon`] !== undefined 
        ? activityDurations[`day-${dayIdx}-afternoon`] 
        : parseDurationToMins(day?.afternoon?.duration || fbDay.afternoon?.duration || '2 hours');
        
      const eveningDur = activityDurations[`day-${dayIdx}-evening`] !== undefined 
        ? activityDurations[`day-${dayIdx}-evening`] 
        : parseDurationToMins(day?.evening?.duration || fbDay.evening?.duration || '2.5 hours');
        
      const morningStart = dayStart;
      const morningEnd = morningStart + morningDur;
      
      const afternoonStart = morningEnd + 60; 
      const afternoonEnd = afternoonStart + afternoonDur;
      
      const eveningStart = afternoonEnd + 60; 
      const eveningEnd = eveningStart + eveningDur;
      
      const nightStart = eveningEnd;
      const nightEnd = nightStart + 60; 
      
      const dayCustomEvents = customEvents.filter(e => e.day === dayIdx).map(e => {
        const startMins = parseTimeToMins(e.startTime);
        const endMins = parseTimeToMins(e.endTime);
        
        const overlapsMorning = (startMins < morningEnd && endMins > morningStart);
        const overlapsAfternoon = (startMins < afternoonEnd && endMins > afternoonStart);
        const overlapsEvening = (startMins < eveningEnd && endMins > eveningStart);
        
        return {
          ...e,
          startMins,
          endMins,
          hasConflict: overlapsMorning || overlapsAfternoon || overlapsEvening,
          conflictWith: overlapsMorning ? 'Morning Activity' : (overlapsAfternoon ? 'Afternoon Activity' : (overlapsEvening ? 'Evening Activity' : null))
        };
      });
      
      return {
        day: day?.day || fbDay.day || (dayIdx + 1),
        title: day?.title || fbDay.title || `Day ${dayIdx + 1}`,
        weatherShift: day?.weatherShift ?? fbDay.weatherShift ?? false,
        weatherAdaptMessage: day?.weatherAdaptMessage || fbDay.weatherAdaptMessage || null,
        timings: {
          dayStart,
          morningStart, morningEnd, morningDur,
          afternoonStart, afternoonEnd, afternoonDur,
          eveningStart, eveningEnd, eveningDur,
          nightStart, nightEnd
        },
        customEvents: dayCustomEvents,
        morning: {
          time: formatTimeHM(morningStart),
          endTimeStr: formatTimeHM(morningEnd),
          breakfast: day?.morning?.breakfast || fbDay.morning?.breakfast || 'Breakfast at local cafe',
          attraction: day?.morning?.attraction || fbDay.morning?.attraction || 'Scenic Landmark',
          attractionImg: day?.morning?.attractionImg || fbDay.morning?.attractionImg || fbDay.morning?.attractionImg,
          duration: `${Math.floor(morningDur / 60)}h ${morningDur % 60}m`,
          price: day?.morning?.price || fbDay.morning?.price || 'Free Access',
          crowd: day?.morning?.crowd || fbDay.morning?.crowd || 'Moderate Density',
          photoTip: day?.morning?.photoTip || fbDay.morning?.photoTip || 'Capture with natural lighting.',
          expenses: typeof day?.morning?.expenses === 'number' ? day.morning.expenses : (parseInt(day?.morning?.expenses) || fbDay.morning?.expenses || 0),
          transport: day?.morning?.transport || fbDay.morning?.transport || 'Walking',
          distance: day?.morning?.distance || fbDay.morning?.distance || 'Local',
          travelTime: day?.morning?.travelTime || fbDay.morning?.travelTime || 'Local'
        },
        afternoon: {
          time: formatTimeHM(afternoonStart),
          endTimeStr: formatTimeHM(afternoonEnd),
          lunch: day?.afternoon?.lunch || fbDay.afternoon?.lunch || 'Lunch at local cafe',
          attraction: day?.afternoon?.attraction || fbDay.afternoon?.attraction || 'Historic Sight',
          attractionImg: day?.afternoon?.attractionImg || fbDay.afternoon?.attractionImg || fbDay.afternoon?.attractionImg,
          duration: `${Math.floor(afternoonDur / 60)}h ${afternoonDur % 60}m`,
          price: day?.afternoon?.price || fbDay.afternoon?.price || 'Free Access',
          crowd: day?.afternoon?.crowd || fbDay.afternoon?.crowd || 'Moderate Density',
          photoTip: day?.afternoon?.photoTip || fbDay.afternoon?.photoTip || 'Capture dynamic angles.',
          expenses: typeof day?.afternoon?.expenses === 'number' ? day.afternoon.expenses : (parseInt(day?.afternoon?.expenses) || fbDay.afternoon?.expenses || 0),
          walkingRoute: day?.afternoon?.walkingRoute || fbDay.afternoon?.walkingRoute || 'Scenic walking paths'
        },
        evening: {
          time: formatTimeHM(eveningStart),
          endTimeStr: formatTimeHM(eveningEnd),
          sunsetSpot: day?.evening?.sunsetSpot || fbDay.evening?.sunsetSpot || 'Sunset viewpoint',
          sunsetSpotImg: day?.evening?.sunsetSpotImg || fbDay.evening?.sunsetSpotImg || fbDay.evening?.sunsetSpotImg,
          dinner: day?.evening?.dinner || fbDay.evening?.dinner || 'Dinner at local restaurant',
          nightlife: day?.evening?.nightlife || fbDay.evening?.nightlife || 'Relaxing lounge',
          duration: `${Math.floor(eveningDur / 60)}h ${eveningDur % 60}m`,
          expenses: typeof day?.evening?.expenses === 'number' ? day.evening.expenses : (parseInt(day?.evening?.expenses) || fbDay.evening?.expenses || 0)
        },
        night: {
          time: formatTimeHM(nightStart),
          endTimeStr: formatTimeHM(nightEnd),
          hotelReturn: day?.night?.hotelReturn || fbDay.night?.hotelReturn || 'Return to base hotel lobby',
          safetyNote: day?.night?.safetyNote || fbDay.night?.safetyNote || 'Area is generally safe. Remain alert.',
          nextDayPrep: day?.night?.nextDayPrep || fbDay.night?.nextDayPrep || 'Prepare for next day activities.'
        }
      };
    });
  }, [customPlan, generatedItinerary, dayStartTimes, activityDurations, customEvents]);

  // TIME-001: Simulation loop logic
  useEffect(() => {
    let intervalId = null;
    if (isSimulating) {
      const minPerStep = simulationSpeed === 1 ? 5 : (simulationSpeed === 2 ? 15 : 30);
      const intervalMs = 250;
      
      intervalId = setInterval(() => {
        setSimulationTime(prevTime => {
          let nextTime = prevTime + minPerStep;
          if (nextTime >= 1440) {
            nextTime = 480; // Reset to 8:00 AM
            setSimulationDay(prevDay => {
              if (prevDay < displayItinerary.length - 1) {
                return prevDay + 1;
              } else {
                setIsSimulating(false);
                return prevDay;
              }
            });
          }
          return nextTime;
        });
      }, intervalMs);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isSimulating, simulationSpeed, displayItinerary.length]);

  // Flight options memoized for calculations
  const flightOptionsList = useMemo(() => {
    if (liveFlights && liveFlights.length > 0) return liveFlights;
    return generateRealisticFlights(originCity, originCountry, destCity, destCountry, budgetTier);
  }, [liveFlights, originCity, originCountry, destCity, destCountry, budgetTier]);

  // Total estimated budget spent calculation based on selections
  const budgetBreakdown = useMemo(() => {
    let dailyRate = 120;
    
    if (budgetTier === 'Budget') { dailyRate = 45; }
    else if (budgetTier === 'Mid-range') { dailyRate = 160; }
    else if (budgetTier === 'Luxury') { dailyRate = 380; }
    else if (budgetTier === 'Ultra Luxury') { dailyRate = 980; }

    const daysVal = totalDays;
    const travelers = travelersCount;

    const hotels = Math.round(dailyRate * 0.45 * daysVal * travelers);
    const transport = Math.round(dailyRate * 0.15 * daysVal * travelers);
    const food = Math.round(dailyRate * 0.25 * daysVal * travelers);
    const activities = Math.round(dailyRate * 0.15 * daysVal * travelers);
    
    const cheapestFlightPrice = flightOptionsList[0] ? flightOptionsList[0].price : 450;
    const flights = Math.round(cheapestFlightPrice * travelers);

    return {
      flights,
      hotels,
      transport,
      food,
      activities,
      total: flights + hotels + transport + food + activities
    };
  }, [budgetTier, totalDays, travelersCount, flightOptionsList]);

  // Dynamic packing list based on weather/interests
  const dynamicPackingList = useMemo(() => {
    const list = [...PACKING_BASE];
    if (selectedInterests.includes('Hiking') || selectedInterests.includes('Nature')) {
      list.push({ name: 'Breathable Technical Outdoor Trail Shoes', category: 'Gear' });
      list.push({ name: 'Hydration Pack & Energy Bars', category: 'Gear' });
    }
    if (selectedInterests.includes('Beaches')) {
      list.push({ name: 'Quick-Dry Microfiber Beach Towel', category: 'Apparel' });
      list.push({ name: 'Eco-Safe Ocean Sunscreen Lotion', category: 'Essentials' });
    }
    if (selectedInterests.includes('Photography')) {
      list.push({ name: 'Lens Cleaning Brush & Compact Carbon Tripod', category: 'Gear' });
    }
    if (energyLevel === 'Fast-Paced') {
      list.push({ name: 'Ergonomic Support Running Cushions', category: 'Apparel' });
    }
    if (preferences.includes('Halal Food Only')) {
      list.push({ name: 'Pre-Downloaded Halal Restaurant Registry Card', category: 'Essentials' });
    }
    return list;
  }, [selectedInterests, energyLevel, preferences]);

  const displayPacking = useMemo(() => {
    if (customPlan?.packing && Array.isArray(customPlan.packing) && customPlan.packing.length > 0) {
      return customPlan.packing.map((item, idx) => ({
        name: item?.name || `Travel Essential #${idx + 1}`,
        category: item?.category || 'Essentials'
      }));
    }
    return dynamicPackingList;
  }, [customPlan, dynamicPackingList]);

  const displayCulinary = useMemo(() => {
    if (customPlan?.culinary && Array.isArray(customPlan.culinary) && customPlan.culinary.length > 0) {
      return customPlan.culinary.map((rest) => ({
        name: rest?.name || 'Gourmet Selection',
        note: rest?.note || 'Premium local dining highlight.',
        type: rest?.type || 'Local Fare',
        cost: rest?.cost || '$$',
        rating: rest?.rating || '4.5',
        tags: Array.isArray(rest?.tags) ? rest.tags : typeof rest?.tags === 'string' ? rest.tags.split(',') : []
      }));
    }
    return CULINARY_DB[activeDestination.id] || DEFAULT_CULINARY;
  }, [customPlan, activeDestination]);

  const displayTransitApps = useMemo(() => {
    if (customPlan?.transportApps && Array.isArray(customPlan.transportApps) && customPlan.transportApps.length > 0) {
      return customPlan.transportApps.map((app) => ({
        name: app?.name || 'Transit App',
        purpose: app?.purpose || 'Local transit application.'
      }));
    }
    return getTransportDataForDest(activeDestination).apps || [];
  }, [customPlan, activeDestination]);

  const displayWeather = useMemo(() => {
    if (liveWeather) return liveWeather;
    return activeDestination.weather || { temp: '24°C', condition: 'Sunny', humidity: '52%', airQuality: 'Excellent' };
  }, [liveWeather, activeDestination]);

  // ============================================
  // DASHBOARD TAB CONTROLLER
  // ============================================
  const [activeDashboardTab, setActiveDashboardTab] = useState('roadmap'); // roadmap, transit, culinary, safety, packing, alerts
  const [expandedDay, setExpandedDay] = useState(1);
  const [checkedAttractions, setCheckedAttractions] = useState({});

  const toggleAttractionChecked = (attractionKey) => {
    setCheckedAttractions(prev => ({
      ...prev,
      [attractionKey]: !prev[attractionKey]
    }));
  };

  const completedAttractionsCount = useMemo(() => {
    return Object.values(checkedAttractions).filter(Boolean).length;
  }, [checkedAttractions]);

  // Handle Printable Magazine Report trigger
  const handlePrintReport = () => {
    window.print();
  };

  
  const carRentalGuidelines = useMemo(() => {
    const country = (destCountry || '').toLowerCase();
    const city = destCity || activeDestination.name;

    if (country.includes('japan')) {
      return {
        location: `Haneda/Narita Airport Terminals or major Tokyo Central stations (Shinjuku, Tokyo Station).`,
        docs: [
          'International Driving Permit (IDP) - Must be 1949 Geneva Convention format (strictly checked)',
          'Valid Passport & Home Country Driver\'s License',
          'Credit Card in main driver\'s name'
        ],
        rules: [
          'Drive on the left side of the road.',
          'Zero tolerance for driving under the influence (BAC limit is 0.00%).',
          'ETC Card is highly recommended for automatic toll booth payments on expressways.'
        ]
      };
    } else if (country.includes('pakistan')) {
      return {
        location: `Lahore/Karachi Airport Terminals or luxury hotels in central hubs.`,
        docs: [
          'Valid Passport & CNIC / National ID',
          'Valid Pakistan Driver\'s License or International Driving Permit',
          'Credit Card or Security Cash Deposit'
        ],
        rules: [
          'Drive on the left side. Central city lanes are often congested.',
          'Hiring a car WITH a local driver is strongly recommended for visitors due to chaotic traffic patterns.'
        ]
      };
    } else if (country.includes('saudi') || country.includes('arabia') || country.includes('uae')) {
      return {
        location: `Riyadh/Jeddah or Dubai International Airport Arrivals (Terminal 1 & 3).`,
        docs: [
          'Valid Passport & Tourist Visa entry stamp',
          'International Driving Permit (IDP) or GCC License',
          'Valid Home Driver\'s License',
          'Credit Card for deposit block hold'
        ],
        rules: [
          'Drive on the right side. Speed cameras (Saher/Tafur) are extremely active.',
          'Ensure the car is equipped with a working climate-control AC system.'
        ]
      };
    } else {
      return {
        location: `${city} International Airport Car Rental Center or downtown offices.`,
        docs: [
          'Valid Driver\'s License (English or with certified translation)',
          'International Driving Permit (highly recommended for non-EU/non-US citizens)',
          'Passport or Government-issued ID',
          'Major Credit Card (debit cards are rarely accepted for deposits)'
        ],
        rules: [
          'Confirm if driving is on the right or left side.',
          'Ensure you have proof of third-party liability insurance (usually included in rental contract).'
        ]
      };
    }
  }, [activeDestination, destCity, destCountry]);
  // Dynamic high-resolution image pipeline fetcher for timeline attractions
  useEffect(() => {
    if (!displayItinerary || displayItinerary.length === 0) return;
    
    let isMounted = true;
    
    async function fetchAllImages() {
      // Gather unique attractions
      const pending = [];
      displayItinerary.forEach(day => {
        if (day.morning?.attraction) {
          pending.push({ name: day.morning.attraction, city: day.morning.city || activeDestination.name });
        }
        if (day.afternoon?.attraction) {
          pending.push({ name: day.afternoon.attraction, city: day.afternoon.city || activeDestination.name });
        }
        if (day.evening?.sunsetSpot) {
          pending.push({ name: day.evening.sunsetSpot, city: day.evening.city || activeDestination.name });
        }
      });
      
      // Filter unique names
      const unique = pending.filter((item, idx, arr) => arr.findIndex(t => t.name === item.name) === idx);
      
      for (const item of unique) {
        if (!isMounted) break;
        const cacheKey = `tripready_timeline_img_v1_${item.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
        const cached = localStorage.getItem(cacheKey);
        
        if (cached) {
          setLoadedAttractionImages(prev => {
            if (prev[item.name] === cached) return prev;
            return { ...prev, [item.name]: cached };
          });
          continue;
        }
        
        // Fetch from pipeline
        try {
          const result = await getPipelineImage(item.name, item.city, destCountry || '');
          if (result && result.url) {
            localStorage.setItem(cacheKey, result.url);
            if (isMounted) {
              setLoadedAttractionImages(prev => ({ ...prev, [item.name]: result.url }));
            }
          }
        } catch (e) {
          console.warn("Failed to fetch image for timeline attraction:", item.name, e);
        }
        
        // Small throttle delay between API calls to prevent rate limiting
        await new Promise(r => setTimeout(r, 80));
      }
    }
    
    fetchAllImages();
    
    return () => {
      isMounted = false;
    };
  }, [displayItinerary, activeDestination, destCountry]);


return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-500 pt-24 pb-16 overflow-x-hidden relative">
      
      {/* Premium Dynamic Background elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.012)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.012)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.003)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.003)_1px,transparent_1px)] bg-[size:40px_40px] opacity-70" />
        {/* Floating gradient orbs with drift animation */}
        <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] rounded-full bg-[var(--accent)]/[0.04] filter blur-[100px] animate-[drift_20s_ease-in-out_infinite]" />
        <div className="absolute bottom-[20%] right-[5%] w-[450px] h-[450px] rounded-full bg-indigo-500/[0.03] filter blur-[120px] animate-[drift_25s_ease-in-out_infinite_reverse]" />
        <div className="absolute top-[45%] right-[25%] w-[350px] h-[350px] rounded-full bg-purple-500/[0.02] filter blur-[90px] animate-[drift_30s_ease-in-out_infinite]" />
        {/* Subtle top light gradient */}
        <div className="absolute top-0 left-0 right-0 h-[280px] bg-gradient-to-b from-[var(--accent)]/[0.025] to-transparent" />
      </div>

      {/* ============================================================
          STEP 1: PREMIUM ONBOARDING CONFIGURATOR
          ============================================================ */}
      {currentStep === 1 && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 animate-fade-in print:hidden">
          
          {/* Floating Trajectory Dashed Line and Travel Icons (Image 2 Style) */}
          <div className="absolute inset-0 pointer-events-none -z-10 overflow-visible hidden lg:block">
            {/* Trajectory Curve */}
            <svg className="w-full h-full min-h-[600px] absolute inset-0" viewBox="0 0 1200 600" fill="none">
              <path 
                d="M -30,220 Q 600,0 1230,220" 
                stroke="currentColor" 
                className="text-slate-200/50 dark:text-white/[0.025]" 
                strokeWidth="1.5" 
                strokeDasharray="6,8" 
              />
            </svg>

            {/* Left Column Floating Glass Tiles */}
            <FloatingTile icon={Sun} className="left-[-60px] top-[140px] rotate-[-4deg]" />
            <FloatingTile icon={Plane} className="left-[40px] top-[230px] rotate-[6deg]" />
            <FloatingTile icon={Compass} className="left-[-70px] top-[370px] rotate-[-8deg]" />
            <FloatingTile icon={Ticket} className="left-[30px] top-[480px] rotate-[5deg]" />

            {/* Right Column Floating Glass Tiles */}
            <FloatingTile icon={Calendar} className="right-[-60px] top-[150px] rotate-[8deg]" />
            <FloatingTile icon={Map} className="right-[40px] top-[240px] rotate-[-5deg]" />
            <FloatingTile icon={DollarSign} className="right-[-70px] top-[390px] rotate-[6deg]" />
            <FloatingTile icon={MapPin} className="right-[30px] top-[500px] rotate-[-4deg]" />
          </div>
          
          {/* Header Progress Tracker */}
          <div className="max-w-3xl mx-auto text-center mb-10">
            <span className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-[0.2em] mb-2.5 block select-none">
              quiet luxury AI engine
            </span>
            <h1 className="font-heading text-4xl sm:text-6xl font-normal text-luxury-primary dark:text-white leading-[1.1] tracking-tight mt-3 select-none">
              Full AI Trip Planner for <br />
              <span className="italic font-light text-luxury-secondary dark:text-slate-400">intentional travel.</span>
            </h1>
            <p className="text-luxury-secondary dark:text-slate-450 text-2xs sm:text-xs max-w-xl mx-auto mt-4 leading-relaxed font-semibold uppercase tracking-widest">
              AI-Powered Personal Travel Operating System
            </p>
                 {/* Configurator Steps progress bullets */}
            <div className="relative flex items-center justify-between w-full max-w-2xl mx-auto mt-8 mb-12 px-4">
              {/* Background track line */}
              <div className="absolute left-8 right-8 top-[14px] h-[2px] bg-slate-200 dark:bg-white/[0.06] -z-10 rounded-full" />
              {/* Active progress line fill */}
              <div 
                className="absolute left-8 top-[14px] h-[2px] bg-gradient-to-r from-[var(--accent)] to-indigo-500 -z-10 rounded-full transition-all duration-550 ease-out" 
                style={{ width: `${((onboardingFormSubstep - 1) / 3) * 100}%` }}
              />
              
              {[
                { step: 1, label: 'Origin', icon: Compass },
                { step: 2, label: 'Budget', icon: Wallet },
                { step: 3, label: 'Pace', icon: Sparkles },
                { step: 4, label: 'Tailor', icon: Heart }
              ].map((item) => {
                const StepIcon = item.icon;
                const isActive = onboardingFormSubstep === item.step;
                const isCompleted = onboardingFormSubstep > item.step;
                
                return (
                  <button
                    key={item.step}
                    onClick={() => setOnboardingFormSubstep(item.step)}
                    className="flex flex-col items-center group focus:outline-none cursor-pointer"
                  >
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center border text-xs font-bold transition-all duration-300 relative ${
                        isActive 
                          ? 'bg-[var(--accent)] border-transparent text-white ring-4 ring-[var(--accent)]/15 scale-110 shadow-lg'
                          : isCompleted
                            ? 'bg-emerald-505 border-transparent text-white shadow-sm'
                            : 'bg-white dark:bg-[#070e1b] border-slate-200 dark:border-white/[0.08] text-slate-400 dark:text-slate-500 hover:border-slate-350 dark:hover:border-white/20'
                      }`}
                      style={isCompleted ? { backgroundColor: '#10B981' } : {}}
                    >
                      {isCompleted ? <Check className="w-3.5 h-3.5" /> : <StepIcon className="w-3.5 h-3.5" />}
                    </div>
                    <span 
                      className={`mt-2 text-[9px] tracking-wider uppercase font-extrabold transition-all duration-300 ${
                        isActive 
                          ? 'text-[var(--accent)]' 
                          : isCompleted 
                            ? 'text-emerald-500' 
                            : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-650'
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Container Wrapper */}
          <div className="rounded-[32px] border border-slate-200/50 dark:border-white/[0.08] p-8 sm:p-10 relative overflow-hidden shadow-[0_20px_50px_rgba(8,112,241,0.03)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.65)] max-w-4xl mx-auto bg-white/45 dark:bg-[#071125]/45 border border-white/70 dark:border-white/[0.08] backdrop-blur-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[var(--accent)]/[0.03] filter blur-3xl pointer-events-none" />
            
            {/* SUBSTEP 1.1: DESTINATION & DATES */}
            {onboardingFormSubstep === 1 && (
              <div className="space-y-8 text-left animate-slide-up">
                <div className="border-b border-[var(--border)] pb-4">
                  <h3 className="font-heading text-2xl font-light tracking-tight text-luxury-primary dark:text-white">
                    Where & When are you exploring?
                  </h3>
                  <p className="text-xs text-luxury-secondary dark:text-slate-450 font-light mt-1.5">
                    Select your starting parameters and date vectors to scale pricing calculations.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                  {/* Visual Divider Connector Line for Desktop */}
                  <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[var(--bg-primary)] border border-[var(--border)] items-center justify-center z-10 shadow-sm">
                    <Plane className="w-4 h-4 text-[var(--accent)] transform rotate-90" />
                  </div>

                  {/* Departure Column */}
                  <div className="space-y-5 p-6 rounded-2xl bg-slate-50/50 dark:bg-white/[0.01] border border-[var(--border)] relative">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-[var(--accent)] bg-[var(--accent)]/5 dark:bg-[var(--accent)]/10 px-2.5 py-1 rounded-md">
                      <Compass className="w-3.5 h-3.5" /> Departure Origin
                    </span>

                    {/* Country Picker dropdown */}
                    <div className="relative">
                      <label className="block text-2xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Departure Country</label>
                      <button
                        onClick={() => setShowOriginCountries(!showOriginCountries)}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white dark:bg-white/[0.02] border border-[var(--border)] text-left text-sm text-luxury-primary dark:text-slate-200 outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all hover:bg-slate-50 dark:hover:bg-white/[0.04] cursor-pointer"
                      >
                        <span className="flex items-center gap-2.5">
                          <Globe className="w-4 h-4 text-slate-400" />
                          {originCountry}
                        </span>
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      </button>

                      {showOriginCountries && (
                        <div className="absolute left-0 right-0 mt-2 p-3 bg-white dark:bg-[#070e1b] border border-[var(--border)] rounded-2xl shadow-xl z-20 space-y-2">
                          <div className="flex items-center gap-2 bg-slate-50 dark:bg-white/[0.04] px-3 py-1.5 rounded-lg border border-[var(--border)]">
                            <Search className="w-3.5 h-3.5 text-slate-400" />
                            <input 
                              type="text" 
                              placeholder="Search origin countries..."
                              value={searchOriginText}
                              onChange={(e) => setSearchOriginText(e.target.value)}
                              className="bg-transparent text-xs w-full outline-none text-luxury-primary dark:text-white"
                            />
                          </div>
                          <div className="max-h-40 overflow-y-auto space-y-0.5 custom-scrollbar no-scrollbar">
                            {filteredOriginCountries.map((c) => (
                              <button
                                key={c.code}
                                onClick={() => {
                                  setOriginCountry(c.name);
                                  setShowOriginCountries(false);
                                  setSearchOriginText('');
                                }}
                                className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-slate-50 dark:hover:bg-white/[0.04] text-luxury-secondary dark:text-slate-350 transition-colors flex items-center justify-between cursor-pointer"
                              >
                                <span>{c.name}</span>
                                <span>{c.flag}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* City Dropdown */}
                    <div>
                      <label className="block text-2xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Departure City</label>
                      <select
                        value={originCity}
                        onChange={(e) => setOriginCity(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-white/[0.02] border border-[var(--border)] text-sm text-luxury-primary dark:text-slate-200 outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all select-none cursor-pointer"
                      >
                        {originCities.map((ct) => (
                          <option key={ct} value={ct} className="dark:bg-[#070e1b]">{ct}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Destination Column */}
                  <div className="space-y-5 p-6 rounded-2xl bg-slate-50/50 dark:bg-white/[0.01] border border-[var(--border)] relative">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-[var(--accent)] bg-[var(--accent)]/5 dark:bg-[var(--accent)]/10 px-2.5 py-1 rounded-md">
                      <MapPin className="w-3.5 h-3.5" /> Exploring Destination
                    </span>
                    
                    {/* Destination Country picker */}
                    <div className="relative">
                      <label className="block text-2xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Destination Country</label>
                      <button
                        onClick={() => setShowDestCountries(!showDestCountries)}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white dark:bg-white/[0.02] border border-[var(--border)] text-left text-sm text-luxury-primary dark:text-slate-200 outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all hover:bg-slate-50 dark:hover:bg-white/[0.04] cursor-pointer"
                      >
                        <span className="flex items-center gap-2.5">
                          <Globe className="w-4 h-4 text-slate-400" />
                          {destCountry}
                        </span>
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      </button>

                      {showDestCountries && (
                        <div className="absolute left-0 right-0 mt-2 p-3 bg-white dark:bg-[#070e1b] border border-[var(--border)] rounded-2xl shadow-xl z-20 space-y-2">
                          <div className="flex items-center gap-2 bg-slate-50 dark:bg-white/[0.04] px-3 py-1.5 rounded-lg border border-[var(--border)]">
                            <Search className="w-3.5 h-3.5 text-slate-400" />
                            <input 
                              type="text" 
                              placeholder="Search destinations..."
                              value={searchDestText}
                              onChange={(e) => setSearchDestText(e.target.value)}
                              className="bg-transparent text-xs w-full outline-none text-luxury-primary dark:text-white"
                            />
                          </div>
                          <div className="max-h-40 overflow-y-auto space-y-0.5 custom-scrollbar no-scrollbar">
                            {filteredDestCountries.map((c) => (
                              <button
                                key={c.code}
                                onClick={() => {
                                  setDestCountry(c.name);
                                  setShowDestCountries(false);
                                  setSearchDestText('');
                                }}
                                className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-slate-50 dark:hover:bg-white/[0.04] text-luxury-secondary dark:text-slate-355 transition-colors flex items-center justify-between cursor-pointer"
                              >
                                <span>{c.name}</span>
                                <span>{c.flag}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Destination City */}
                    <div>
                      <label className="block text-2xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Destination City</label>
                      <select
                        value={destCity}
                        onChange={(e) => setDestCity(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-white/[0.02] border border-[var(--border)] text-sm text-luxury-primary dark:text-slate-200 outline-none focus:ring-2 focus:ring-[var(--accent)]/25 transition-all select-none cursor-pointer"
                      >
                        {destCities.map((ct) => (
                          <option key={ct} value={ct} className="dark:bg-[#070e1b]">{ct}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                </div>

                {/* Dates & Travelers */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-[var(--border)]">
                  <div className="space-y-1.5 text-left">
                    <label className="block text-2xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">Departure Date</label>
                    <div className="relative flex items-center bg-white dark:bg-white/[0.02] border border-[var(--border)] rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-[var(--accent)]/20 transition-all">
                      <Calendar className="w-4 h-4 text-slate-400 mr-2.5" />
                      <input 
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="bg-transparent border-none text-xs text-luxury-primary dark:text-slate-200 w-full focus:outline-none focus:ring-0"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5 text-left">
                    <label className="block text-2xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">Return Date</label>
                    <div className="relative flex items-center bg-white dark:bg-white/[0.02] border border-[var(--border)] rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-[var(--accent)]/20 transition-all">
                      <Calendar className="w-4 h-4 text-slate-400 mr-2.5" />
                      <input 
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="bg-transparent border-none text-xs text-luxury-primary dark:text-slate-200 w-full focus:outline-none focus:ring-0"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="block text-2xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">Travelers Count</label>
                    <div className="flex items-center justify-between bg-white dark:bg-white/[0.02] border border-[var(--border)] rounded-xl px-4 py-2">
                      <button
                        onClick={() => setTravelersCount(prev => Math.max(1, prev - 1))}
                        className="w-8 h-8 flex items-center justify-center border border-[var(--border)] rounded-lg hover:bg-slate-50 dark:hover:bg-white/[0.04] text-xs font-bold transition-all cursor-pointer"
                      >
                        -
                      </button>
                      <span className="font-mono text-sm font-bold text-luxury-primary dark:text-white flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-slate-400" />
                        {travelersCount}
                      </span>
                      <button
                        onClick={() => setTravelersCount(prev => Math.min(20, prev + 1))}
                        className="w-8 h-8 flex items-center justify-center border border-[var(--border)] rounded-lg hover:bg-slate-50 dark:hover:bg-white/[0.04] text-xs font-bold transition-all cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>



                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => setOnboardingFormSubstep(2)}
                    className="btn-primary flex items-center gap-2 group cursor-pointer"
                  >
                    <span>Continue: Style & Budget</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            )}

            {/* SUBSTEP 1.2: STYLE & BUDGET */}
            {onboardingFormSubstep === 2 && (
              <div className="space-y-8 text-left animate-slide-up">
                <div className="border-b border-[var(--border)] pb-4">
                  <h3 className="font-heading text-2xl font-light tracking-tight text-luxury-primary dark:text-white">
                    Travel Style & Budget Parameters
                  </h3>
                  <p className="text-xs text-luxury-secondary dark:text-slate-400 font-light mt-1.5">
                    These selectors directly shift hotel quality, dining targets, and private vehicle calibrations.
                  </p>
                </div>

                {/* Travel Style Selector Cards */}
                <div className="space-y-4">
                  <span className="block text-2xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Travel Character
                  </span>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { name: 'Solo Explorer', desc: 'Indie schedules & off-grid routes', icon: Compass },
                      { name: 'Luxury Traveler', desc: '5-star suites & private drivers', icon: Gem },
                      { name: 'Backpacker', desc: 'Street food hubs & active walks', icon: Wallet },
                      { name: 'Family Vacation', desc: 'Spacious stays & child friendly pacing', icon: Users },
                      { name: 'Honeymoon', desc: 'Romantic views & private dining', icon: Heart },
                      { name: 'Adventure', desc: 'Outdoor scaling & wild tracks', icon: Flame },
                      { name: 'Cultural Explorer', desc: 'Ancient sites & local history', icon: Globe },
                      { name: 'Food Explorer', desc: 'Culinary tours & gourmet spots', icon: Utensils }
                    ].map((style) => {
                      const StyleIcon = style.icon;
                      const isSelected = travelStyle === style.name;
                      return (
                        <button
                          key={style.name}
                          onClick={() => setTravelStyle(style.name)}
                          className={`p-5 rounded-2xl border text-left transition-all duration-300 relative flex flex-col justify-between aspect-[1.1] group cursor-pointer backdrop-blur-md ${
                            isSelected
                              ? 'bg-[var(--accent)]/10 border-[var(--accent)] text-luxury-primary dark:text-white shadow-[0_4px_20px_rgba(30,81,255,0.15)] ring-1 ring-[var(--accent)]/30'
                              : 'bg-white/30 dark:bg-white/[0.015] border-slate-200/60 dark:border-white/[0.05] text-luxury-secondary dark:text-slate-355 hover:border-slate-350/80 dark:hover:border-white/15 hover:bg-white/50 dark:hover:bg-white/[0.03] hover:scale-[1.02]'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <StyleIcon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isSelected ? 'text-[var(--accent)]' : 'text-slate-400'}`} />
                            {isSelected && (
                              <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
                            )}
                          </div>
                          <div className="mt-4">
                            <h4 className="font-heading text-xs font-bold tracking-tight text-luxury-primary dark:text-white">
                              {style.name}
                            </h4>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-light leading-snug mt-1">
                              {style.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Traveler Currency Selection */}
                <div className="space-y-3 pt-6 border-t border-[var(--border)]">
                  <span className="block text-2xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Preferred Billing Currency
                  </span>
                  <p className="text-[11px] text-slate-400 dark:text-slate-455 font-light">
                    Select your local billing currency. All estimated costs, flights, and daily budgets will dynamically be converted using current market rates.
                  </p>
                  <select
                    value={travelerCurrency}
                    onChange={(e) => setTravelerCurrency(e.target.value)}
                    className="w-full sm:w-1/2 bg-white dark:bg-white/[0.02] text-[var(--text-primary)] border border-luxury-border dark:border-white/[0.05] px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 font-medium text-xs transition-all shadow-sm cursor-pointer"
                  >
                    <option value="USD" className="dark:bg-[#070e1b]">USD ($) - US Dollar</option>
                    <option value="PKR" className="dark:bg-[#070e1b]">PKR (Rs) - Pakistani Rupee</option>
                    <option value="EUR" className="dark:bg-[#070e1b]">EUR (€) - Euro</option>
                    <option value="GBP" className="dark:bg-[#070e1b]">GBP (£) - British Pound</option>
                    <option value="AED" className="dark:bg-[#070e1b]">AED (د.إ) - UAE Dirham</option>
                  </select>
                </div>

                {/* Budget Scale */}
                <div className="space-y-4 pt-6 border-t border-[var(--border)]">
                  <span className="block text-2xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Target Budget Tier
                  </span>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { tier: 'Budget', symbol: '$', desc: 'Backpacker Hostels & Transit Trams' },
                      { tier: 'Mid-range', symbol: '$$', desc: 'Boutique Hotels & Local Bistros' },
                      { tier: 'Luxury', symbol: '$$$', desc: 'Villas & Private Guided Transfers' },
                      { tier: 'Ultra Luxury', symbol: '$$$$', desc: 'Michelin Star Dining & Limo Service' }
                    ].map((item) => {
                      const isSelected = budgetTier === item.tier;
                      return (
                        <button
                          key={item.tier}
                          onClick={() => setBudgetTier(item.tier)}
className={`p-5 rounded-2xl border text-left transition-all duration-300 relative flex flex-col justify-between group cursor-pointer backdrop-blur-md ${
                            isSelected
                              ? 'bg-[var(--accent)]/10 border-[var(--accent)] text-luxury-primary dark:text-white shadow-[0_4px_20px_rgba(30,81,255,0.15)] ring-1 ring-[var(--accent)]/30'
                              : 'bg-white/30 dark:bg-white/[0.015] border-slate-200/60 dark:border-white/[0.05] text-luxury-secondary dark:text-slate-355 hover:border-slate-350/80 dark:hover:border-white/15 hover:bg-white/50 dark:hover:bg-white/[0.03] hover:scale-[1.02]'
                          }`}
                        >
                          <span className={`block font-mono text-sm font-black transition-colors ${isSelected ? 'text-[var(--accent)]' : 'text-slate-400'}`}>
                            {item.symbol}
                          </span>
                          <div className="mt-4">
                            <h4 className="font-heading text-xs font-bold animate-fade-in">
                              {item.tier}
                            </h4>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-light leading-snug mt-1">
                              {item.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-between pt-6 border-t border-[var(--border)]">
                  <button
                    onClick={() => setOnboardingFormSubstep(1)}
                    className="px-5 py-2.5 border border-[var(--border)] rounded-xl hover:bg-slate-50 dark:hover:bg-white/[0.04] text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={() => setOnboardingFormSubstep(3)}
                    className="btn-primary flex items-center gap-2 group cursor-pointer"
                  >
                    <span>Continue: Focus & Pace</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            )}

            {/* SUBSTEP 1.3: INTERESTS & ENERGY */}
            {onboardingFormSubstep === 3 && (
              <div className="space-y-8 text-left animate-slide-up">
                <div className="border-b border-[var(--border)] pb-4">
                  <h3 className="font-heading text-2xl font-light tracking-tight text-luxury-primary dark:text-white">
                    Interests & Activity Density
                  </h3>
                  <p className="text-xs text-luxury-secondary dark:text-slate-450 font-light mt-1.5">
                    Select your focus areas. Our algorithms balance travel duration based on energy profiles.
                  </p>
                </div>

                {/* Selectable Interests */}
                <div className="space-y-4">
                  <span className="block text-2xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Exploring Preferences
                  </span>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {Object.keys(INTEREST_ICONS).map((interest) => {
                      const IconComponent = INTEREST_ICONS[interest];
                      const isSelected = selectedInterests.includes(interest);
                      return (
                        <button
                          key={interest}
                          onClick={() => {
                            setSelectedInterests(prev => 
                              isSelected ? prev.filter(i => i !== interest) : [...prev, interest]
                            );
                          }}
                          className={`p-4 rounded-xl border text-left transition-all duration-300 flex items-center gap-3 cursor-pointer ${
                            isSelected
                              ? 'bg-[var(--accent)]/5 border-[var(--accent)] text-luxury-primary dark:text-white font-bold'
                              : 'bg-white dark:bg-white/[0.01] border-luxury-border dark:border-white/[0.04] text-luxury-secondary dark:text-slate-350 hover:border-slate-350 dark:hover:border-white/10'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isSelected ? 'bg-[var(--accent)]/10 text-[var(--accent)]' : 'bg-slate-100 dark:bg-white/[0.02] text-slate-400'}`}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-semibold">
                            {interest}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Very Smart Energy Intensity Selector */}
                <div className="space-y-4 pt-6 border-t border-[var(--border)]">
                  <span className="block text-2xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Energy Level / Exploration Pace
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { level: 'Relaxed', desc: '2 major highlights, late morning departures, multiple organic cafe rests', icon: Coffee },
                      { level: 'Balanced', desc: '3 highlights, standard pacing, comfortable transfers & walking tracks', icon: Compass },
                      { level: 'Fast-Paced', desc: '4+ locations daily, early starts, high exploration density & quick transit', icon: Flame }
                    ].map((pace) => {
                      const PaceIcon = pace.icon;
                      const isSelected = energyLevel === pace.level;
                      return (
                        <button
                          key={pace.level}
                          onClick={() => setEnergyLevel(pace.level)}
className={`p-5 rounded-2xl border text-left transition-all duration-300 relative flex flex-col justify-between group cursor-pointer backdrop-blur-md ${
                            isSelected
                              ? 'bg-[var(--accent)]/10 border-[var(--accent)] text-luxury-primary dark:text-white shadow-[0_4px_20px_rgba(30,81,255,0.15)] ring-1 ring-[var(--accent)]/30'
                              : 'bg-white/30 dark:bg-white/[0.015] border-slate-200/60 dark:border-white/[0.05] text-luxury-secondary dark:text-slate-355 hover:border-slate-350/80 dark:hover:border-white/15 hover:bg-white/50 dark:hover:bg-white/[0.03] hover:scale-[1.02]'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full mb-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isSelected ? 'bg-[var(--accent)]/10 text-[var(--accent)]' : 'bg-slate-100 dark:bg-white/[0.02] text-slate-400'}`}>
                              <PaceIcon className="w-4 h-4" />
                            </div>
                            {isSelected && (
                              <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-heading text-xs font-bold tracking-tight text-luxury-primary dark:text-white">
                              {pace.level}
                            </h4>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-light leading-relaxed mt-1">
                              {pace.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-between pt-6 border-t border-[var(--border)]">
                  <button
                    onClick={() => setOnboardingFormSubstep(2)}
                    className="px-5 py-2.5 border border-[var(--border)] rounded-xl hover:bg-slate-50 dark:hover:bg-white/[0.04] text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={() => setOnboardingFormSubstep(4)}
                    className="btn-primary flex items-center gap-2 group cursor-pointer"
                  >
                    <span>Continue: Tailor Trip</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            )}

            {/* SUBSTEP 1.4: PREFERENCES & DIETARY */}
            {onboardingFormSubstep === 4 && (
              <div className="space-y-8 text-left animate-slide-up">
                <div className="border-b border-[var(--border)] pb-4">
                  <h3 className="font-heading text-2xl font-light tracking-tight text-luxury-primary dark:text-white">
                    Special Accommodations & Preferences
                  </h3>
                  <p className="text-xs text-luxury-secondary dark:text-slate-455 font-light mt-1.5">
                    Select custom parameters. These configure food directions and spatial route elevations.
                  </p>
                </div>

                {/* Dietary & Accessibility Tags */}
                <div className="space-y-4">
                  <span className="block text-2xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Special Travel Preferences
                  </span>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      'Halal Food Only',
                      'Vegetarian Only',
                      'Family Friendly',
                      'Wheelchair Accessible',
                      'Child Friendly Stays',
                      'Senior Friendly Walks',
                      'Avoid Crowded Areas',
                      'Quiet Accommodations'
                    ].map((pref) => {
                      const isSelected = preferences.includes(pref);
                      return (
                        <button
                          key={pref}
                          onClick={() => {
                            setPreferences(prev => 
                              isSelected ? prev.filter(p => p !== pref) : [...prev, pref]
                            );
                          }}
                          className={`p-4 rounded-xl border text-left transition-all duration-300 flex items-center gap-3 relative cursor-pointer ${
                            isSelected
                              ? 'bg-[var(--accent)]/5 border-[var(--accent)] text-luxury-primary dark:text-white font-bold'
                              : 'bg-white dark:bg-white/[0.01] border-luxury-border dark:border-white/[0.04] text-luxury-secondary dark:text-slate-350 hover:border-slate-350 dark:hover:border-white/10'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                            isSelected ? 'bg-[var(--accent)] border-transparent text-white' : 'border-slate-400 dark:border-slate-650'
                          }`}>
                            {isSelected && <Check className="w-3 h-3 stroke-[3px]" />}
                          </div>
                          <span className="text-xs font-semibold">
                            {pref}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-between pt-6 border-t border-[var(--border)]">
                  <button
                    onClick={() => setOnboardingFormSubstep(3)}
                    className="px-5 py-2.5 border border-[var(--border)] rounded-xl hover:bg-slate-50 dark:hover:bg-white/[0.04] text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setCurrentStep(2); // Move to cinematic loading
                      setLoadingLogIndex(0);
                      handleGeneratePlan();
                    }}
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-indigo-650 text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2.5 shadow-lg hover:shadow-[0_0_24px_rgba(249,115,22,0.35)] transition-all hover:scale-[1.03] active:scale-[0.98] animate-pulse cursor-pointer"
                  >
                    <span>Generate AI Travel Plan</span>
                    <Sparkles className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Dest Preview Deck */}
          <div className="mt-12 text-left">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)] mb-4 font-heading">
              Premium Trending Hotspots
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {topDestinations.slice(0, 4).map((dest) => (
                <div 
                  key={dest.id}
                  onClick={() => {
                    setDestCountry(dest.country);
                    setDestCity(dest.name);
                    setOnboardingFormSubstep(1);
                  }}
                  className="group rounded-2xl overflow-hidden border border-luxury-border dark:border-white/[0.04] relative aspect-[4/3] shadow-premium hover:scale-102 transition-all duration-300 select-none cursor-pointer"
                >
                  <ImageWithWatermark 
                    src={dest.image} 
                    alt={dest.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    wrapperClassName="absolute inset-0 w-full h-full"
                    watermarkOpacity="opacity-20"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 text-left">
                    <span className="text-[10px] text-white/80 font-sans tracking-widest uppercase flex items-center gap-1">
                      {dest.flag} {dest.country}
                    </span>
                    <h5 className="font-heading font-black text-white text-xs uppercase tracking-wider mt-0.5">
                      {dest.name}
                    </h5>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ============================================================
          STEP 2: CINEMATIC LOADING EXPERIENCE
          ============================================================ */}
      {currentStep === 2 && (
        <div className="min-h-[70vh] flex flex-col items-center justify-center max-w-4xl mx-auto px-4 relative z-10 animate-fade-in text-center print:hidden">
          <div className="space-y-8 max-w-xl">
            {/* Pulsing loading sphere animation */}
            <div className="w-24 h-24 rounded-full relative flex items-center justify-center mx-auto bg-slate-50 dark:bg-white/[0.01] border border-luxury-border dark:border-white/[0.04] shadow-xl">
              <div className="absolute inset-0 rounded-full border border-orange-500/35 animate-ping opacity-60 pointer-events-none" />
              <Compass className="w-10 h-10 text-[var(--accent)] animate-spin-slow" />
            </div>

            <div className="space-y-2">
              <h3 className="font-heading text-2xl font-light text-luxury-primary dark:text-white tracking-tight animate-pulse">
                Optimizing Travel Flow
              </h3>
              <p className="text-xs text-luxury-secondary dark:text-slate-400 font-light">
                Connecting coordinates, scaling restaurant checklists, and modeling weather shifts.
              </p>
            </div>

            {/* Dynamic visual loading logs */}
            <div className="bg-slate-50 dark:bg-[#030813] border border-luxury-border dark:border-white/[0.04] p-6 rounded-2xl shadow-inner font-sans text-left space-y-3 max-h-48 overflow-y-auto text-xs text-slate-500">
              {loadingLogs.slice(0, loadingLogIndex + 1).map((log, i) => (
                <div key={i} className="flex items-start gap-2.5 animate-fade-in">
                  <span className="text-emerald-500 font-bold shrink-0 font-sans">✓</span>
                  <span className={`${i === loadingLogIndex ? 'text-luxury-primary dark:text-white font-bold' : ''}`}>
                    {log}
                  </span>
                </div>
              ))}
              <div className="flex items-center gap-2 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-ping" />
                <span className="italic text-slate-500">Calculating local path vectors...</span>
              </div>
            </div>

            {/* Visual Progress bar */}
            <div className="w-full bg-[var(--border)] h-[2px] rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-orange-500 to-indigo-600 h-full transition-all duration-300 ease-out"
                style={{ width: `${((loadingLogIndex + 1) / loadingLogs.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          STEP 3: FULL AI TRAVEL ROADMAP PAGE (THE TRAVEL OS)
          ============================================================ */}
      {currentStep === 3 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 animate-fade-in print:p-0 print:m-0">
          
          {/* Cover Hero Banner */}
          <div className="rounded-[40px] overflow-hidden border border-slate-200/50 dark:border-white/[0.04] relative min-h-[440px] flex items-end p-8 md:p-14 shadow-premium print:border-none print:shadow-none print:rounded-none print:p-0 print:min-h-0 bg-[#0c1425]">
            <ImageWithWatermark 
              src={activeDestination.image} 
              alt={activeDestination.name} 
              className="w-full h-full object-cover filter brightness-[0.8] hover:scale-[1.02] transition-transform duration-700 print:hidden" 
              wrapperClassName="absolute inset-0 w-full h-full print:hidden"
              watermarkOpacity="opacity-20"
            />
            {/* Editorial ambient dark bottom gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent print:hidden" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between w-full gap-8 text-left">
              <div className="space-y-4 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white text-[10px] font-bold uppercase tracking-wider select-none">
                  <span>{activeDestination.flag}</span>
                  <span>AI Itinerary Planner</span>
                </div>
                
                <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl font-extrabold text-white leading-none tracking-tight">
                  {activeDestination.name}
                </h1>
                
                <p className="text-xs sm:text-sm text-slate-200 font-light leading-relaxed max-w-2xl">
                  {activeDestination.description}
                </p>
                
                {/* Spacious info deck bar */}
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2 text-[10px] font-mono text-slate-300 uppercase tracking-widest font-bold">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-blue-400" /> Start: {startDate}</span>
                  <span className="text-slate-600 font-normal select-none">•</span>
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-blue-400" /> End: {endDate}</span>
                  <span className="text-slate-600 font-normal select-none">•</span>
                  <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-blue-400" /> {travelersCount} Travelers</span>
                  <span className="text-slate-600 font-normal select-none">•</span>
                  <span className="text-[var(--accent)] font-extrabold">{travelStyle}</span>
                </div>
              </div>

              {/* Floating widgets deck card */}
              <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto shrink-0 print:hidden">
                <div className="bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-3xl p-5 flex-1 md:flex-none text-left min-w-[160px] shadow-lg">
                  <span className="block text-[8px] uppercase tracking-widest text-slate-400 font-extrabold mb-1">Trip duration</span>
                  <span className="font-heading text-lg font-black text-white">{totalDays} full days</span>
                </div>
                <div className="bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-3xl p-5 flex-1 md:flex-none text-left min-w-[160px] shadow-lg">
                  <span className="block text-[8px] uppercase tracking-widest text-slate-400 font-extrabold mb-1">Climate index</span>
                  <span className="font-heading text-lg font-black text-white">{displayWeather?.temp || '24°C'} <span className="text-[11px] text-slate-400 font-light font-sans">/ {displayWeather?.condition || 'Clear'}</span></span>
                </div>

                <button
                  onClick={handleSaveThisTrip}
                  disabled={tripSaved || isSavingTrip}
                  className={`rounded-3xl p-5 flex items-center justify-center gap-2 flex-1 md:flex-none text-center min-w-[160px] shadow-lg transition-all border ${
                    tripSaved 
                      ? 'bg-emerald-600/25 border-emerald-500/35 text-emerald-400 cursor-default' 
                      : 'bg-[var(--accent)] hover:bg-[var(--accent)]/90 hover:border-[var(--accent)] border-[var(--accent)]/20 text-white hover:scale-102 active:scale-98 cursor-pointer'
                  }`}
                >
                  {tripSaved ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span className="font-heading text-xs font-bold uppercase tracking-wider">Saved ✓</span>
                    </>
                  ) : isSavingTrip ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span className="font-heading text-xs font-bold uppercase tracking-wider">Saving...</span>
                    </>
                  ) : (
                    <>
                      <Folder className="w-4 h-4 text-white/95" />
                      <span className="font-heading text-xs font-bold uppercase tracking-wider">Save Trip</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Dynamic Map Path SVG Graph */}
          <div className="mt-10 bg-white/50 dark:bg-[#071125]/30 border border-slate-200/50 dark:border-white/[0.04] p-8 rounded-[36px] relative overflow-hidden shadow-[0_8px_30px_rgba(8,112,241,0.015)] backdrop-blur-xl flex flex-col xl:flex-row items-center justify-between gap-8 print:hidden text-left">
            <div className="absolute -left-6 -bottom-6 w-32 h-32 rounded-full bg-[var(--accent)]/[0.03] filter blur-xl pointer-events-none" />
            
            <div className="space-y-2.5 text-left xl:max-w-md relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] shrink-0">
                  <Map className="w-4 h-4" />
                </div>
                <h4 className="font-heading text-base font-extrabold tracking-tight text-slate-850 dark:text-white">
                  Active Vector Itinerary Route Tracing
                </h4>
              </div>
              <p className="text-xs text-slate-505 dark:text-slate-405 font-light leading-relaxed pl-11">
                Geographically optimized routing paths. Select a checkpoint node below to instantly jump to that specific day on your timeline.
              </p>
            </div>

            {/* Dynamic Map Nodes vector Overhauled Stepper */}
            <div className="w-full xl:max-w-2xl bg-slate-50/50 dark:bg-[#0b1324]/30 border border-slate-200/40 dark:border-white/[0.04] p-4 rounded-3xl flex items-center justify-start gap-4 overflow-x-auto scrollbar-none relative backdrop-blur-xl">
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0 shadow-xs" title={`Origin: ${originCity}`}>
                    <Plane className="w-4 h-4 transform -rotate-45" />
                  </div>
                  <span className="text-[10px] text-slate-550 dark:text-slate-405 font-bold mt-1.5">{originCity}</span>
                </div>
                
                <div className="w-6 h-0.5 bg-slate-200 dark:bg-white/10 shrink-0" />
                
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 dark:text-indigo-400 shrink-0 shadow-xs" title="Base Hotel">
                    <Landmark className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] text-indigo-500 dark:text-indigo-455 font-bold mt-1.5">Hotel</span>
                </div>
              </div>
              
              {displayItinerary.map((d, i) => {
                const isActive = expandedDay === d.day;
                return (
                  <React.Fragment key={d.day}>
                    <div className={`w-6 h-0.5 shrink-0 transition-colors duration-300 ${isActive ? 'bg-[var(--accent)]' : 'bg-slate-200 dark:bg-white/10'}`} />
                    <div className="flex flex-col items-center shrink-0">
                      <button 
                        onClick={() => {
                          setExpandedDay(d.day);
                          const el = document.getElementById(`timeline-day-${d.day}`);
                          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }}
                        className={`w-10 h-10 rounded-2xl border text-xs font-mono font-bold transition-all duration-300 flex items-center justify-center cursor-pointer ${
                          isActive 
                            ? 'bg-gradient-to-tr from-[var(--accent)] to-indigo-600 border-transparent text-white shadow-lg shadow-blue-500/20 scale-110 ring-4 ring-blue-500/10' 
                            : 'bg-white dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.04] text-slate-600 dark:text-slate-400 hover:border-slate-350 dark:hover:border-white/10 hover:bg-slate-100 dark:hover:bg-white/[0.04]'
                        }`}
                      >
                        {d.day}
                      </button>
                      <span className={`text-[10px] mt-1.5 font-bold transition-colors duration-300 ${isActive ? 'text-[var(--accent)]' : 'text-slate-400 dark:text-slate-500'}`}>Day {d.day}</span>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Main Grid: Left Timeline content, Right sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12 items-start print:grid-cols-1">
            
            {/* LEFT 2-COLUMNS: THE SYSTEM VIEWS */}
            <div className="lg:col-span-2 space-y-10 text-left print:col-span-1">
              
              {/* Tab Navigation header */}
              <div className="bg-slate-100/60 dark:bg-white/[0.02] p-1.5 rounded-full border border-slate-200/50 dark:border-white/[0.04] flex flex-wrap gap-1 max-w-full overflow-x-auto scrollbar-none print:hidden">
                {[
                  { id: 'roadmap', label: 'Day-by-Day Timeline', icon: Compass },
                  { id: 'flights', label: 'Real Flight Pricing', icon: Plane, locked: !user },
                  { id: 'transit', label: 'Transit Infographics', icon: Train, locked: !user },
                  { id: 'culinary', label: 'Food Discovery', icon: Utensils, locked: !user },
                  { id: 'safety', label: 'Safety & Culture Desk', icon: ShieldAlert, locked: !user },
                  { id: 'packing', label: 'Packing Checklist', icon: Briefcase, locked: !user },
                  { id: 'alerts', label: 'Live Advisories Feed', icon: AlertCircle, locked: !user }
                ].map((tab) => {
                  const TabIcon = tab.icon;
                  const isActive = activeDashboardTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        if (tab.locked) {
                          showToast("Create a free account to unlock flights, safety desk, and packing guides!");
                        } else {
                          setActiveDashboardTab(tab.id);
                        }
                      }}
                      className={`px-4 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 transition-all duration-300 cursor-pointer ${
                        isActive
                          ? 'bg-white dark:bg-white/10 text-[var(--accent)] dark:text-white font-bold shadow-xs'
                          : tab.locked
                          ? 'text-slate-400 dark:text-slate-600 opacity-60 cursor-not-allowed'
                          : 'text-slate-550 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50/50 dark:hover:bg-white/[0.01]'
                      }`}
                    >
                      <TabIcon className="w-3.5 h-3.5 shrink-0" />
                      <span>{tab.label}</span>
                      {tab.locked && <Lock size={10} className="text-slate-400 dark:text-slate-600 ml-0.5" />}
                    </button>
                  );
                })}
              </div>

{/* ============================================================
                  REAL FLIGHT PRICING TAB
                  ============================================================ */}
              {activeDashboardTab === 'flights' && (
                <div className="space-y-6 text-left">
                  <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/5 border border-blue-500/15 rounded-2xl p-5 flex items-start justify-between gap-4 shadow-sm">
                    <div className="flex items-start gap-4">
                      <Plane className="w-5 h-5 text-blue-500 shrink-0 mt-0.5 animate-pulse" />
                      <div className="space-y-1">
                        <h5 className="text-[10px] uppercase tracking-widest font-bold text-blue-500 font-mono">
                          Real-Time Global Flight Integration Desk
                        </h5>
                        <p className="text-xs text-luxury-secondary dark:text-slate-400 font-light leading-relaxed">
                          Connecting direct API feeds across multiple travel consolidators to fetch live airfares from {originCity} to {destCity}. Complete with duration, transit nodes, and instant booking options.
                        </p>
                      </div>
                    </div>
                    {/* Live connection status badge */}
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      <span>{flightsSource === 'api' ? 'Live API Feed Connected' : flightsSource === 'cache' ? 'API Cache Active' : 'API Sandbox (Realistic Airfares)'}</span>
                    </div>
                  </div>

                  <div className="grid gap-5">
                    {flightOptionsList.map((flight, idx) => {
                      const basePriceUSD = flight.price;
                      return (
                        <div key={idx} className="backdrop-blur-xl bg-white/40 dark:bg-[#0c1424]/20 border border-slate-200/50 dark:border-white/[0.04] p-6 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-[var(--accent)]/30 hover:shadow-md transition-all duration-300 group/flight text-left">
                          <div className="flex items-center gap-4">
                            {logoSrcs[flight.code] === 'failed' ? (
                              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-sm border border-blue-500/15 uppercase shrink-0">
                                {flight.airline[0]}
                              </div>
                            ) : (
                              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white dark:bg-white/5 border border-slate-200/50 dark:border-white/[0.05] flex items-center justify-center p-1.5 shrink-0 shadow-xs">
                                <img 
                                  src={logoSrcs[flight.code] || `https://img.logo.dev/${getAirlineDomain(flight.airline)}?token=pk_bYH-YceiR-KgJx79TnahZg`}
                                  onError={() => {
                                    const domain = getAirlineDomain(flight.airline);
                                    const currentSrc = logoSrcs[flight.code];
                                    if (!currentSrc) {
                                      setLogoSrcs(prev => ({ ...prev, [flight.code]: `https://logo.clearbit.com/${domain}` }));
                                    } else {
                                      setLogoSrcs(prev => ({ ...prev, [flight.code]: 'failed' }));
                                    }
                                  }}
                                  className="w-full h-full object-contain"
                                  alt={flight.airline}
                                />
                              </div>
                            )}
                            <div className="space-y-0.5">
                              <h4 className="font-heading text-sm font-extrabold text-slate-855 dark:text-white leading-none">{flight.airline}</h4>
                              <span className="text-[10px] text-slate-450 dark:text-slate-500 font-mono font-bold tracking-wider">{flight.code}</span>
                            </div>
                          </div>

                          <div className="flex gap-8 text-left items-center w-full md:w-auto">
                            <div className="min-w-[70px]">
                              <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-extrabold mb-0.5">Departure</span>
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-205">{flight.dep}</span>
                              <span className="block text-[10px] text-slate-405 font-light mt-0.5">{originCity}</span>
                            </div>
                            <div className="flex-1 md:flex-none flex flex-col items-center justify-center px-4">
                              <span className="text-[10px] text-slate-455 dark:text-slate-400 font-mono font-bold">{flight.dur}</span>
                              <div className="w-20 h-0.5 bg-slate-200 dark:bg-white/10 relative my-1.5">
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-blue-500/10" />
                              </div>
                              <span className="text-[9px] text-blue-550 font-bold uppercase tracking-wider">{flight.stops}</span>
                            </div>
                            <div className="min-w-[70px]">
                              <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-extrabold mb-0.5">Arrival</span>
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-205">{flight.arr}</span>
                              <span className="block text-[10px] text-slate-455 font-light mt-0.5">{destCity}</span>
                            </div>
                          </div>

                          <div className="text-right w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 flex md:flex-col justify-between items-center md:items-end gap-3.5">
                            <div className="text-left md:text-right">
                              <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-extrabold">Est. Airfare</span>
                              <span className="text-base font-extrabold text-[var(--accent)] font-mono">{formatCost(basePriceUSD)}</span>
                            </div>
                            <a 
                              href={`https://www.google.com/travel/flights?q=Flights%20to%20${encodeURIComponent(destCity)}%20from%20${encodeURIComponent(originCity)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all hover:scale-102 cursor-pointer shadow-sm shadow-blue-550/20"
                            >
                              Book Seat
                            </a>
                          </div>
                        </div>
                      );
                    })}                  </div>
                </div>
              )}


              {/* ============================================================
                  ROADMAP TIMELINE TAB
                  ============================================================ */}
              {activeDashboardTab === 'roadmap' && (
                <div className="space-y-6">
                  
                  {/* Dynamic City Switcher Pill Selector */}
                  {destCities && destCities.length > 0 && (
                    <div className="bg-white/40 dark:bg-black/30 backdrop-blur-md border border-luxury-border dark:border-white/[0.04] p-5 rounded-3xl space-y-3 text-left shadow-sm print:hidden">
                      <span className="block text-[9px] uppercase tracking-widest font-bold text-[var(--accent)]">
                        Country City Switcher
                      </span>
                      <p className="text-[11px] text-slate-450 dark:text-slate-400 font-light">
                        Select a city in {destCountry} to instantly render a localized Day-by-Day AI Travel Plan.
                      </p>
                      <div className="flex flex-wrap gap-2.5 pt-1">
                        {destCities.map((cityName) => {
                          const isSelected = destCity === cityName;
                          return (
                            <button
                              key={cityName}
                              onClick={() => {
                                setDestCity(cityName);
                                handleGeneratePlan(cityName);
                              }}
                              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-gradient-to-tr from-[var(--accent)] to-indigo-600 text-white shadow-md scale-102 font-bold'
                                  : 'bg-white dark:bg-white/[0.02] border border-[var(--border)] text-luxury-secondary dark:text-slate-355 hover:bg-slate-50 dark:hover:bg-white/[0.04]'
                              }`}
                            >
                              {cityName}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {/* Smart Optimization Indicators Banner */}
                  <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-5 flex items-start gap-4 shadow-sm print:hidden">
                    <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h5 className="text-[10px] uppercase tracking-widest font-bold text-indigo-400">
                        AI Travel Optimizer Engine Active
                      </h5>
                      <p className="text-xs text-luxury-secondary dark:text-slate-400 font-light leading-relaxed">
                        Routing clustered {activeDestination.name} attractions geographically, reducing intercity transitions by ~45 mins daily. Budget estimations are updated based on {travelersCount} travelers in "{travelStyle}" class.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Clean timeline header section */}
                    <div className="flex justify-between items-center print:hidden pb-4 border-b border-slate-200/50 dark:border-white/[0.04] mb-8">
                      <div className="space-y-1 text-left">
                        <h4 className="font-heading text-lg font-black tracking-tight text-slate-800 dark:text-white">
                          Your Personalized Timeline
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-light">
                          Select days to expand scheduled details and customize plans.
                        </p>
                      </div>
                      <button
                        onClick={() => setShowAddEventModal(true)}
                        className="px-4 py-2.5 bg-indigo-650 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm shadow-blue-500/10"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Event</span>
                      </button>
                    </div>

                    {displayItinerary.slice(0, user ? displayItinerary.length : 1).map((day, dIdx) => {
                      const isExpanded = expandedDay === day.day;
                      const dayIdx = dIdx;
                      const isSimActive = simulationDay === dayIdx;
                      
                      const completedCount = [
                        checkedAttractions[`day-${day.day}-morning`],
                        checkedAttractions[`day-${day.day}-afternoon`],
                        checkedAttractions[`day-${day.day}-evening`]
                      ].filter(Boolean).length;
                      const totalActivities = 3;
                      const progressPct = (completedCount / totalActivities) * 100;

                      const isMorningDone = checkedAttractions[`day-${day.day}-morning`];
                      const isAfternoonDone = checkedAttractions[`day-${day.day}-afternoon`];
                      const isEveningDone = checkedAttractions[`day-${day.day}-evening`];

                      const ambientBg = isSimActive 
                        ? getAmbientGradient(simulationTime) 
                        : (isExpanded ? 'bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl' : 'bg-white/40 dark:bg-[#080d19]/20');
                      const activeBorder = isSimActive 
                        ? 'border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.15)] ring-1 ring-indigo-500/20' 
                        : (isExpanded ? 'border-slate-200 dark:border-white/[0.08]' : 'border-slate-200/40 dark:border-white/[0.04]');
                      
                      return (
                        <div 
                          key={day.day} 
                          id={`timeline-day-${day.day}`}
                          className={`glass-card rounded-[32px] border transition-all duration-300 shadow-sm relative overflow-hidden ${ambientBg} ${activeBorder}`}
                        >
                          
                          {/* Weather Shift alert header if Day 2 */}
                          {day.weatherShift && (
                            <div className="bg-amber-500/10 border-b border-amber-500/10 px-6 py-2.5 flex items-center gap-2.5 text-[10px] text-amber-500 font-medium print:hidden">
                              <CloudRain className="w-4 h-4 shrink-0" />
                              <span>{day.weatherAdaptMessage}</span>
                            </div>
                          )}

                          {/* Interactive click header */}
                          <div 
                            onClick={() => setExpandedDay(isExpanded ? null : day.day)}
                            className="p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none cursor-pointer"
                          >
                            <div className="flex items-start gap-4 text-left">
                              <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 dark:bg-white/[0.03] flex flex-col items-center justify-center font-heading text-slate-850 dark:text-white shrink-0 select-none border border-slate-200/50 dark:border-white/[0.05]">
                                <span className="text-[10px] uppercase font-bold tracking-widest leading-none text-slate-400 mb-0.5">Day</span>
                                <span className="text-lg font-extrabold leading-none">{day.day}</span>
                              </div>
                              <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                                    {activeDestination.flag} {destCity}
                                  </span>
                                  <span className="text-slate-300 dark:text-slate-700 select-none text-[8px]">•</span>
                                  <span className="text-[11px] font-mono text-[var(--accent)] font-semibold">
                                    {getDayDateString(day.day)}
                                  </span>
                                </div>
                                <h4 className="font-heading text-base font-extrabold tracking-tight text-slate-855 dark:text-white leading-snug">
                                  {day.title}
                                </h4>
                                <div className="flex items-center gap-3.5 pt-0.5">
                                  <span className="text-[10px] text-slate-450 dark:text-slate-400 font-sans font-medium uppercase tracking-wider">
                                    {energyLevel} pace
                                  </span>
                                  <span className="text-slate-300 dark:text-slate-700 select-none">•</span>
                                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                                    <span className="font-bold">{completedCount}/3 Done</span>
                                    <div className="w-16 h-1 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                                      <div className="h-full bg-emerald-500 rounded-full transition-all duration-300" style={{ width: `${progressPct}%` }} />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4 self-end sm:self-center ml-auto sm:ml-0">
                              <div className="text-right text-[11px] text-slate-505 dark:text-slate-400 font-mono font-medium hidden sm:block leading-tight">
                                <div>{day.weatherShift ? '🌧 Rainy' : '🌤 Sunny'}</div>
                                <div className="text-[10px] text-slate-400 dark:text-slate-550 font-normal">{day.weatherShift ? '21°C' : '27°C'}</div>
                              </div>
                              <div className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] flex items-center justify-center transition-all duration-200">
                                <ChevronDown className={`w-4 h-4 text-slate-500 dark:text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                              </div>
                            </div>
                          </div>

                          {/* Expanded content */}
                          {isExpanded && (
                            <div className="px-6 sm:px-8 pb-10 pt-2 border-t border-slate-100 dark:border-white/[0.04] space-y-10">
                              
                              {/* 🧠 AI Travel Insights Panel (Rule 22) */}
                              <div className="p-5 bg-indigo-500/5 dark:bg-indigo-500/[0.02] rounded-3xl space-y-3.5 text-left text-xs animate-scale-in">
                                <div className="flex items-center gap-2 text-indigo-550 dark:text-indigo-400 font-bold uppercase tracking-widest text-[10px] font-heading select-none">
                                  <Sparkles className="w-4 h-4" />
                                  <span>🧠 AI Travel Insights</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-slate-655 dark:text-slate-400 font-light leading-relaxed">
                                  <div className="flex items-start gap-2.5">
                                    <span className="text-indigo-500 dark:text-indigo-455 font-bold shrink-0 mt-0.5">✓</span>
                                    <span>Immigration & customs checks expected to take ~35-45 minutes.</span>
                                  </div>
                                  <div className="flex items-start gap-2.5">
                                    <span className="text-indigo-500 dark:text-indigo-455 font-bold shrink-0 mt-0.5">✓</span>
                                    <span>Peak crowds expected around afternoon; consider visiting morning spots early.</span>
                                  </div>
                                  <div className="flex items-start gap-2.5">
                                    <span className="text-indigo-500 dark:text-indigo-455 font-bold shrink-0 mt-0.5">✓</span>
                                    <span>Carry a water bottle and weather protection for outdoor attractions.</span>
                                  </div>
                                  <div className="flex items-start gap-2.5">
                                    <span className="text-indigo-500 dark:text-indigo-455 font-bold shrink-0 mt-0.5">✓</span>
                                    <span>Transit activation available nearby: {day.morning.transport.split('(')[0]}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Daily Adjustments bar & Progress Overview (Rule 10) */}
                              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-50/50 dark:bg-white/[0.015] p-5 rounded-3xl text-xs">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 flex items-center justify-center">
                                    <Clock className="w-4 h-4" />
                                  </div>
                                  <div className="text-left">
                                    <span className="block text-[8px] uppercase tracking-widest font-extrabold text-slate-400">Day Start Time</span>
                                    <span className="font-bold text-slate-700 dark:text-slate-200">{formatTimeHM(day.timings.dayStart)}</span>
                                  </div>
                                  <div className="flex gap-1 ml-2">
                                    <button 
                                      onClick={() => {
                                        const cur = day.timings.dayStart;
                                        const next = Math.max(300, cur - 30);
                                        setDayStartTimes(prev => ({ ...prev, [dayIdx]: next }));
                                      }}
                                      className="px-2 py-1 bg-white dark:bg-white/5 border border-slate-200/60 dark:border-white/10 rounded-lg text-[10px] font-bold text-slate-500 hover:text-[var(--accent)] hover:border-[var(--accent)]/30 transition-all duration-200 cursor-pointer"
                                    >
                                      -30m
                                    </button>
                                    <button 
                                      onClick={() => {
                                        const cur = day.timings.dayStart;
                                        const next = Math.min(720, cur + 30);
                                        setDayStartTimes(prev => ({ ...prev, [dayIdx]: next }));
                                      }}
                                      className="px-2 py-1 bg-white dark:bg-white/5 border border-slate-200/60 dark:border-white/10 rounded-lg text-[10px] font-bold text-slate-500 hover:text-[var(--accent)] hover:border-[var(--accent)]/30 transition-all duration-200 cursor-pointer"
                                    >
                                      +30m
                                    </button>
                                  </div>
                                </div>

                                {/* Custom Events or Overview status */}
                                <div className="flex items-center gap-4 flex-wrap">
                                  <div className="flex items-center gap-2 bg-slate-200/40 dark:bg-white/5 px-3 py-1.5 rounded-xl font-mono text-[10px] text-slate-605 dark:text-slate-330">
                                    <span><Compass className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" /><span>Timeline progress: {completedCount} / 3 items checked</span></span>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-2 text-left">
                                    {day.customEvents && day.customEvents.length > 0 ? (
                                      day.customEvents.map(evt => (
                                        <div 
                                          key={evt.id} 
                                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[10px] font-semibold leading-none ${
                                            evt.hasConflict 
                                              ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' 
                                              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                                          }`}
                                          title={evt.hasConflict ? `Conflicts with ${evt.conflictWith}!` : 'No conflicts'}
                                        >
                                          {evt.hasConflict && <AlertCircle className="w-3 h-3 text-rose-500 animate-pulse" />}
                                          <span>{evt.title} ({evt.startTime}-{evt.endTime})</span>
                                          <button 
                                            onClick={() => removeCustomEvent(evt.id)}
                                            className="hover:text-rose-600 font-bold ml-1 transition-colors cursor-pointer"
                                          >
                                            ×
                                          </button>
                                        </div>
                                      ))
                                    ) : null}
                                  </div>
                                </div>
                              </div>

                              {/* ── CONTINUOUS VERTICAL TIMELINE CONTAINER (Rule 4, 15, 9, 13) ── */}
                              <div className="relative pl-7 sm:pl-9 border-l border-slate-100 dark:border-white/[0.04] ml-4 sm:ml-5 py-2 space-y-12 text-left">
                                
                                {/* 🌅 MORNING BLOCK */}
                                <div className="relative space-y-4">
                                  {/* Node dot with period themed status colors (Blue if active/upcoming, Green if completed) */}
                                  <div className={`absolute -left-[35px] sm:-left-[43px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 transition-all duration-200 ${
                                    isMorningDone
                                      ? 'bg-emerald-500 ring-4 ring-emerald-500/15'
                                      : 'bg-blue-500 ring-4 ring-blue-500/15'
                                  }`} />

                                  {/* Section Header Row */}
                                  <div className="flex sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-white/[0.04] pb-2">
                                    <div className="flex items-center gap-2">
                                      <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-550 uppercase tracking-widest leading-none">{day.morning.time}</span>
                                      <span className="text-slate-300 dark:text-slate-700 text-xs">•</span>
                                      <span className="text-xs font-heading font-extrabold tracking-widest uppercase text-blue-500 dark:text-blue-400 flex items-center gap-1.5 leading-none">
                                        <Sunrise className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 shrink-0" />
                                        <span>Morning Routine</span>
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal italic flex items-center gap-1">
                                        <Coffee className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                        <span className="text-slate-400 mr-1 hidden sm:inline">Breakfast:</span>
                                        <span className="font-semibold text-slate-700 dark:text-slate-300 font-sans">{day.morning.breakfast}</span>
                                      </div>
                                      <button 
                                        onClick={() => toggleAttractionChecked(`day-${day.day}-morning`)}
                                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-300 shrink-0 print:hidden cursor-pointer ${
                                          isMorningDone
                                            ? 'bg-emerald-500 border-transparent text-white scale-105 shadow-sm shadow-emerald-500/25'
                                            : 'border-slate-300 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/20 hover:scale-105 text-transparent'
                                        }`}
                                      >
                                        <Check className="w-3 h-3 stroke-[3px]" />
                                      </button>
                                    </div>
                                  </div>

                                  {/* Activity Card Stacked Layout (Rule 5 & 21) */}
                                  <div className="bg-slate-50/30 dark:bg-white/[0.015] hover:bg-slate-100/50 dark:hover:bg-white/[0.03] transition-all duration-300 rounded-[24px] p-5 relative overflow-hidden group/act shadow-xs flex flex-col md:flex-row gap-5 items-stretch">
                                    {/* Left aspect image with hover zoom */}
                                    <div className="w-full md:w-44 h-32 shrink-0 relative rounded-2xl overflow-hidden aspect-[16/10] md:aspect-auto">
                                      <ImageWithWatermark
                                        src={loadedAttractionImages[day.morning.attraction] || day.morning.attractionImg}
                                        alt={day.morning.attraction}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover/act:scale-105"
                                        wrapperClassName="absolute inset-0 w-full h-full"
                                        watermarkOpacity="opacity-20"
                                      />
                                    </div>

                                    {/* Right contents */}
                                    <div className="flex-1 flex flex-col justify-between space-y-3">
                                      <div className="space-y-2">
                                        <div className="flex items-start justify-between gap-3">
                                          <h5 className="font-heading text-base font-extrabold text-slate-800 dark:text-white leading-tight">
                                            {day.morning.attraction}
                                          </h5>
                                        </div>

                                        {/* Metadata row with tiny chips (Rule 6) */}
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-455 dark:text-slate-400 font-mono">
                                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" /><span>{day.morning.duration}</span></span>
                                          <span className="text-slate-300 dark:text-slate-700">•</span>
                                          <span className="flex items-center gap-1"><Ticket className="w-3.5 h-3.5 text-slate-400 shrink-0" /><span>{day.morning.price}</span></span>
                                          <span className="text-slate-300 dark:text-slate-700">•</span>
                                          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-slate-400 shrink-0" /><span>{day.morning.crowd}</span></span>
                                        </div>

                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                                          {day.morning.photoTip}
                                        </p>
                                      </div>

                                      {/* Mini info cards side-by-side (Rule 16) */}
                                      <div className="flex flex-wrap gap-3 pt-3 border-t border-slate-100 dark:border-white/[0.04]">
                                        <div className="flex items-center gap-2 bg-slate-100/50 dark:bg-white/[0.02] px-3.5 py-2 rounded-xl text-2xs font-mono text-slate-600 dark:text-slate-405">
                                          <span><DollarSign className="w-3.5 h-3.5 text-slate-400 shrink-0" /></span>
                                          <span>Est. Cost: <strong className="font-extrabold text-slate-800 dark:text-slate-205">${day.morning.expenses}</strong></span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-slate-100/50 dark:bg-white/[0.02] px-3.5 py-2 rounded-xl text-2xs font-mono text-slate-600 dark:text-slate-405 flex-1 min-w-[150px]">
                                          <Train className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                          <span className="truncate">Transit: <strong className="font-extrabold text-slate-800 dark:text-slate-205">${day.morning.transport}</strong></span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* ☀️ AFTERNOON BLOCK */}
                                <div className="relative space-y-4">
                                  {/* Node dot (Orange if active/upcoming, Green if completed) */}
                                  <div className={`absolute -left-[35px] sm:-left-[43px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 transition-all duration-200 ${
                                    isAfternoonDone
                                      ? 'bg-emerald-500 ring-4 ring-emerald-500/15'
                                      : 'bg-orange-500 ring-4 ring-orange-500/15'
                                  }`} />

                                  {/* Section Header Row */}
                                  <div className="flex sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-white/[0.04] pb-2">
                                    <div className="flex items-center gap-2">
                                      <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-555 uppercase tracking-widest leading-none">{day.afternoon.time}</span>
                                      <span className="text-slate-300 dark:text-slate-700 text-xs">•</span>
                                      <span className="text-xs font-heading font-extrabold tracking-widest uppercase text-orange-500 dark:text-orange-400 flex items-center gap-1.5 leading-none">
                                        <Sun className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
                                        <span>Afternoon Itinerary</span>
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <div className="text-[11px] text-slate-550 dark:text-slate-400 leading-normal italic flex items-center gap-1">
                                        <Utensils className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                        <span className="text-slate-400 mr-1 hidden sm:inline">Lunch:</span>
                                        <span className="font-semibold text-slate-700 dark:text-slate-300 font-sans">{day.afternoon.lunch}</span>
                                      </div>
                                      <button 
                                        onClick={() => toggleAttractionChecked(`day-${day.day}-afternoon`)}
                                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-300 shrink-0 print:hidden cursor-pointer ${
                                          isAfternoonDone
                                            ? 'bg-emerald-500 border-transparent text-white scale-105 shadow-sm shadow-emerald-500/25'
                                            : 'border-slate-300 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/20 hover:scale-105 text-transparent'
                                        }`}
                                      >
                                        <Check className="w-3 h-3 stroke-[3px]" />
                                      </button>
                                    </div>
                                  </div>

                                  {/* Activity Card Stacked Layout (Rule 5 & 21) */}
                                  <div className="bg-slate-50/30 dark:bg-white/[0.015] hover:bg-slate-100/50 dark:hover:bg-white/[0.03] transition-all duration-300 rounded-[24px] p-5 relative overflow-hidden group/act shadow-xs flex flex-col md:flex-row gap-5 items-stretch">
                                    {/* Left aspect image with hover zoom */}
                                    <div className="w-full md:w-44 h-32 shrink-0 relative rounded-2xl overflow-hidden aspect-[16/10] md:aspect-auto">
                                      <ImageWithWatermark
                                        src={loadedAttractionImages[day.afternoon.attraction] || day.afternoon.attractionImg}
                                        alt={day.afternoon.attraction}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover/act:scale-105"
                                        wrapperClassName="absolute inset-0 w-full h-full"
                                        watermarkOpacity="opacity-20"
                                      />
                                    </div>

                                    {/* Right contents */}
                                    <div className="flex-1 flex flex-col justify-between space-y-3">
                                      <div className="space-y-2">
                                        <div className="flex items-start justify-between gap-3">
                                          <h5 className="font-heading text-base font-extrabold text-slate-800 dark:text-white leading-tight">
                                            {day.afternoon.attraction}
                                          </h5>
                                        </div>

                                        {/* Metadata row with tiny chips (Rule 6) */}
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-455 dark:text-slate-400 font-mono">
                                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" /><span>{day.afternoon.duration}</span></span>
                                          <span className="text-slate-300 dark:text-slate-700">•</span>
                                          <span className="flex items-center gap-1"><Ticket className="w-3.5 h-3.5 text-slate-400 shrink-0" /><span>{day.afternoon.price}</span></span>
                                          <span className="text-slate-300 dark:text-slate-700">•</span>
                                          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-slate-400 shrink-0" /><span>{day.afternoon.crowd}</span></span>
                                        </div>

                                        <p className="text-xs text-slate-505 dark:text-slate-400 font-light leading-relaxed">
                                          {day.afternoon.walkingRoute}
                                        </p>
                                      </div>

                                      {/* Mini info cards side-by-side (Rule 16) */}
                                      <div className="flex flex-wrap gap-3 pt-3 border-t border-slate-100 dark:border-white/[0.04]">
                                        <div className="flex items-center gap-2 bg-slate-100/50 dark:bg-white/[0.02] px-3.5 py-2 rounded-xl text-2xs font-mono text-slate-600 dark:text-slate-405">
                                          <span><DollarSign className="w-3.5 h-3.5 text-slate-400 shrink-0" /></span>
                                          <span>Est. Cost: <strong className="font-extrabold text-slate-800 dark:text-slate-205">${day.afternoon.expenses}</strong></span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-slate-100/50 dark:bg-white/[0.02] px-3.5 py-2 rounded-xl text-2xs font-mono text-slate-600 dark:text-slate-405 flex-1 min-w-[150px]">
                                          <span><Camera className="w-3.5 h-3.5 text-slate-400 shrink-0" /></span>
                                          <span className="truncate" title={day.afternoon.photoTip}>Photo tip: <strong className="font-extrabold text-slate-800 dark:text-slate-205">{day.afternoon.photoTip}</strong></span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* 🌆 EVENING & NIGHT BLOCK */}
                                <div className="relative space-y-4">
                                  {/* Node dot (Purple if active/upcoming, Green if completed) */}
                                  <div className={`absolute -left-[35px] sm:-left-[43px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 transition-all duration-200 ${
                                    isEveningDone
                                      ? 'bg-emerald-500 ring-4 ring-emerald-500/15'
                                      : 'bg-purple-500 ring-4 ring-purple-500/15'
                                  }`} />

                                  {/* Section Header Row */}
                                  <div className="flex sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-white/[0.04] pb-2">
                                    <div className="flex items-center gap-2">
                                      <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-555 uppercase tracking-widest leading-none">{day.evening.time}</span>
                                      <span className="text-slate-300 dark:text-slate-700 text-xs">•</span>
                                      <span className="text-xs font-heading font-extrabold tracking-widest uppercase text-purple-500 dark:text-purple-400 flex items-center gap-1.5 leading-none">
                                        <Moon className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400 shrink-0" />
                                        <span>Evening & Night Plan</span>
                                      </span>
                                    </div>
                                    <button 
                                      onClick={() => toggleAttractionChecked(`day-${day.day}-evening`)}
                                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-300 shrink-0 print:hidden cursor-pointer ${
                                        isEveningDone
                                          ? 'bg-emerald-500 border-transparent text-white scale-105 shadow-sm shadow-emerald-500/25'
                                          : 'border-slate-300 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/20 hover:scale-105 text-transparent'
                                      }`}
                                    >
                                      <Check className="w-3 h-3 stroke-[3px]" />
                                    </button>
                                  </div>

                                  {/* Evening Stacked Layout */}
                                  <div className="bg-slate-50/30 dark:bg-white/[0.015] hover:bg-slate-100/50 dark:hover:bg-white/[0.03] transition-all duration-300 rounded-[24px] p-5 relative overflow-hidden group/act shadow-xs space-y-4">
                                    
                                    {/* Sunset Viewpoint details */}
                                    <div className="flex flex-col md:flex-row gap-5 items-stretch">
                                      <div className="w-full md:w-44 h-32 shrink-0 relative rounded-2xl overflow-hidden aspect-[16/10] md:aspect-auto">
                                        <ImageWithWatermark
                                          src={loadedAttractionImages[day.evening.sunsetSpot] || day.evening.sunsetSpotImg}
                                          alt={day.evening.sunsetSpot}
                                          className="w-full h-full object-cover transition-transform duration-300 group-hover/act:scale-105"
                                          wrapperClassName="absolute inset-0 w-full h-full"
                                          watermarkOpacity="opacity-20"
                                        />
                                      </div>
                                      
                                      <div className="flex-1 flex flex-col justify-between space-y-3">
                                        <div className="space-y-1.5 text-left">
                                          <span className="text-[9px] uppercase tracking-wider font-extrabold text-orange-400 flex items-center gap-1.5 mb-0.5 select-none">
                                            <Sun className="w-3.5 h-3.5 shrink-0" /> Sunset Viewpoint
                                          </span>
                                          <h5 className="font-heading text-base font-extrabold text-slate-855 dark:text-white leading-tight">
                                            {day.evening.sunsetSpot}
                                          </h5>
                                          <div className="text-[11px] text-slate-455 dark:text-slate-400 font-mono">
                                            ⏱ Recommended Duration: <strong>{day.evening.duration || '2.5 hours'}</strong>
                                          </div>
                                        </div>

                                        {/* Dinner & Nightlife Mini-Cards (Rule 16) */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                          <div className="flex items-start gap-2.5 bg-slate-100/50 dark:bg-white/[0.02] p-3 rounded-2xl text-2xs text-left leading-normal border-0">
                                            <Utensils className="w-3.5 h-3.5 text-slate-450 dark:text-slate-400 shrink-0 mt-0.5" />
                                            <div>
                                              <span className="block text-[8px] uppercase tracking-widest font-extrabold text-slate-400 leading-none mb-1">Dinner Recommendation</span>
                                              <span className="font-bold text-slate-700 dark:text-slate-205">{day.evening.dinner}</span>
                                            </div>
                                          </div>
                                          <div className="flex items-start gap-2.5 bg-slate-100/50 dark:bg-white/[0.02] p-3 rounded-2xl text-2xs text-left leading-normal border-0">
                                            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                                            <div>
                                              <span className="block text-[8px] uppercase tracking-widest font-extrabold text-slate-400 leading-none mb-1">Nightlife Spot</span>
                                              <span className="font-bold text-slate-700 dark:text-slate-205">{day.evening.nightlife}</span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Safety Advisory Panel (Rule 22 context) */}
                                    <div className="p-4 bg-amber-500/5 dark:bg-amber-500/[0.02] rounded-2xl text-[11px] text-left space-y-1.5 leading-normal">
                                      <div className="text-[9px] font-bold uppercase tracking-widest text-amber-500 flex items-center gap-1.5 select-none">
                                        <ShieldAlert className="w-3.5 h-3.5" />
                                        <span>Local Safety & Logistics Alert</span>
                                      </div>
                                      <p className="text-slate-655 dark:text-slate-400 font-light">
                                        <strong>Night Safety:</strong> {day.night.safetyNote}
                                      </p>
                                    </div>

                                  </div>
                                </div>

                              </div>

                            </div>
                          )}

                        </div>
                      );
                    })}
                    
                    {/* Locked Days Blur Preview for Guest */}
                    {!user && (
                      <div className="relative mt-8 rounded-[32px] overflow-hidden border border-slate-200/40 dark:border-white/[0.04]">
                        <div className="filter blur-xl pointer-events-none select-none opacity-40 space-y-6">
                          <div className="glass-card rounded-[32px] border border-slate-200/40 dark:border-white/[0.04] p-8 space-y-4 bg-white/40 dark:bg-[#080d19]/20">
                            <div className="h-6 bg-slate-300 dark:bg-slate-700 w-1/4 rounded-md animate-pulse" />
                            <div className="space-y-2">
                              <div className="h-3 bg-slate-250 dark:bg-slate-800 w-full rounded" />
                              <div className="h-3 bg-slate-250 dark:bg-slate-800 w-5/6 rounded" />
                              <div className="h-3 bg-slate-250 dark:bg-slate-800 w-2/3 rounded" />
                            </div>
                          </div>
                          <div className="glass-card rounded-[32px] border border-slate-200/40 dark:border-white/[0.04] p-8 space-y-4 bg-white/40 dark:bg-[#080d19]/20">
                            <div className="h-6 bg-slate-300 dark:bg-slate-700 w-1/5 rounded-md animate-pulse" />
                            <div className="space-y-2">
                              <div className="h-3 bg-slate-250 dark:bg-slate-800 w-5/6 rounded" />
                              <div className="h-3 bg-slate-250 dark:bg-slate-800 w-full rounded" />
                            </div>
                          </div>
                        </div>
                        
                        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/10 dark:bg-black/30 backdrop-blur-[6px] px-6 rounded-[32px] overflow-hidden">
                          <div className="w-full max-w-sm bg-white/30 dark:bg-slate-950/30 backdrop-blur-md border border-white/20 dark:border-white/15 rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.15)] p-6 text-center space-y-4 transform hover:scale-[1.01] transition-transform duration-500">
                            <div className="relative">
                              <Lock className="w-5 h-5 text-amber-500 dark:text-amber-400 animate-bounce mx-auto mb-1" />
                            </div>
                            <div className="space-y-1.5">
                              <h3 className="font-heading font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-tight">
                                Unlock Full Itinerary
                              </h3>
                              <p className="text-[11px] text-slate-700 dark:text-slate-300 font-light leading-relaxed max-w-xs mx-auto">
                                Create a free account to view the complete day-by-day roadmap and premium features.
                              </p>
                            </div>

                            <div className="pt-1">
                              <Link 
                                to="/auth" 
                                state={{ mode: 'signup', from: location.pathname }}
                                className="w-full h-10 rounded-xl bg-gradient-to-r from-[var(--accent)] to-indigo-600 text-white font-bold text-[11px] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                              >
                                <span>Create Your Account</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

                    {activeDashboardTab === 'transit' && (
                <div className="space-y-10">
                  
                  {/* Custom Infographic Transport cards (Polished, Premium & Theme Convertible) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* card 1: Metro */}
                    <div className="bg-white dark:bg-[#0c1425]/40 border border-slate-205/80 dark:border-white/[0.04] rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between transition-all duration-350 hover:-translate-y-1 hover:shadow-md hover:border-[var(--accent)]/30 text-left">
                      {/* Top Image Section */}
                      <div className="h-40 w-full relative overflow-hidden shrink-0">
                        <ImageWithWatermark 
                          src="/assets/metro.jpg" 
                          alt="Metro Transit" 
                          className="w-full h-full object-cover" 
                          wrapperClassName="absolute inset-0 w-full h-full"
                          watermarkOpacity="opacity-15"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                        <span className="absolute top-4 left-4 text-[9px] font-sans font-bold bg-blue-600 text-white border border-blue-400/20 px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                          Highly Recommended
                        </span>
                        <div className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                          <Train className="w-5 h-5 shrink-0" />
                        </div>
                      </div>

                      {/* Bottom Content Section */}
                      <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                          <h4 className="font-heading text-base font-bold text-slate-800 dark:text-white">
                            Metro & Tram Networks
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                            The most economical, traffic-free pathway transit system inside {activeDestination.name}. Perfect for rapid cross-city hops.
                          </p>
                        </div>

                        <div className="pt-4 border-t border-slate-100 dark:border-white/5 space-y-3.5 text-xs text-slate-600 dark:text-slate-300">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
                              <DollarSign className="w-3.5 h-3.5" />
                            </div>
                            <div className="space-y-0.5">
                              <span className="block text-[8px] uppercase tracking-wider text-slate-450 dark:text-slate-500 font-bold">Pricing scale</span>
                              <span className="block text-xs font-semibold text-slate-800 dark:text-white">$1.50 - $4.00 <span className="text-[10px] text-slate-450 dark:text-slate-500 font-normal font-sans">/ single ride</span></span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
                              <Smartphone className="w-3.5 h-3.5" />
                            </div>
                            <div className="space-y-0.5">
                              <span className="block text-[8px] uppercase tracking-wider text-slate-455 dark:text-slate-500 font-bold">Primary app</span>
                              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer flex items-center gap-0.5">
                                Google Maps / Transit App <ExternalLink className="w-3 h-3 inline opacity-70" />
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-555 dark:text-emerald-400 shrink-0">
                              <Activity className="w-3.5 h-3.5" />
                            </div>
                            <div className="space-y-0.5">
                              <span className="block text-[8px] uppercase tracking-wider text-emerald-600 dark:text-emerald-450 font-bold">Efficiency rating</span>
                              <span className="block text-xs font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                Excellent <span className="text-[10px] text-emerald-555 dark:text-emerald-500 font-normal">(98% on-time)</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* card 2: Taxis */}
                    <div className="bg-white dark:bg-[#0c1425]/40 border border-slate-205/80 dark:border-white/[0.04] rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between transition-all duration-350 hover:-translate-y-1 hover:shadow-md hover:border-[var(--accent)]/30 text-left">
                      {/* Top Image Section */}
                      <div className="h-40 w-full relative overflow-hidden shrink-0">
                        <ImageWithWatermark 
                          src="/assets/taxi.jpg" 
                          alt="Rideshare & Taxis" 
                          className="w-full h-full object-cover" 
                          wrapperClassName="absolute inset-0 w-full h-full"
                          watermarkOpacity="opacity-15"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-955/60 to-transparent" />
                        <span className="absolute top-4 left-4 text-[9px] font-sans font-bold bg-amber-500 text-white border border-amber-400/20 px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                          Comfort Option
                        </span>
                        <div className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                          <Car className="w-5 h-5 shrink-0" />
                        </div>
                      </div>

                      {/* Bottom Content Section */}
                      <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                          <h4 className="font-heading text-base font-bold text-slate-800 dark:text-white">
                            Ride-Hailing & Taxis
                          </h4>
                          <p className="text-xs text-slate-505 dark:text-slate-400 font-light leading-relaxed">
                            {displayTransitApps[0] ? displayTransitApps[0].name : 'Uber'} door-to-door transit. Recommended for late night returns, heavy luggage transfers, or direct hotel routes.
                          </p>
                        </div>

                        <div className="pt-4 border-t border-slate-100 dark:border-white/5 space-y-3.5 text-xs text-slate-600 dark:text-slate-300">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
                              <DollarSign className="w-3.5 h-3.5" />
                            </div>
                            <div className="space-y-0.5">
                              <span className="block text-[8px] uppercase tracking-wider text-slate-450 dark:text-slate-500 font-bold">Pricing scale</span>
                              <span className="block text-xs font-semibold text-slate-800 dark:text-white">$12 - $35 <span className="text-[10px] text-slate-450 dark:text-slate-500 font-normal font-sans">/ standard ride</span></span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
                              <Smartphone className="w-3.5 h-3.5" />
                            </div>
                            <div className="space-y-0.5">
                              <span className="block text-[8px] uppercase tracking-wider text-slate-455 dark:text-slate-500 font-bold">Primary apps</span>
                              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer flex items-center gap-0.5">
                                {displayTransitApps.map(a => a.name).join(' / ')} <ExternalLink className="w-3 h-3 inline opacity-70" />
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-555 dark:text-emerald-400 shrink-0">
                              <Shield className="w-3.5 h-3.5" />
                            </div>
                            <div className="space-y-0.5">
                              <span className="block text-[8px] uppercase tracking-wider text-emerald-600 dark:text-emerald-450 font-bold">Safety rating</span>
                              <span className="block text-xs font-extrabold text-emerald-650 dark:text-emerald-400 flex items-center gap-1">
                                Highly Secured <span className="text-[10px] text-emerald-555 dark:text-emerald-505 font-normal">(GPS logged)</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* card 3: Tourist Passes */}
                    <div className="bg-white dark:bg-[#0c1425]/40 border border-slate-205/80 dark:border-white/[0.04] rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between transition-all duration-355 hover:-translate-y-1 hover:shadow-md hover:border-[var(--accent)]/30 text-left">
                      {/* Top Image Section */}
                      <div className="h-40 w-full relative overflow-hidden shrink-0">
                        <ImageWithWatermark 
                          src="/assets/pass.jpg" 
                          alt="Tourist Passes" 
                          className="w-full h-full object-cover" 
                          wrapperClassName="absolute inset-0 w-full h-full"
                          watermarkOpacity="opacity-15"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                        <span className="absolute top-4 left-4 text-[9px] font-sans font-bold bg-emerald-600 text-white border border-emerald-500/20 px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                          Smart Purchase
                        </span>
                        <div className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                          <Ticket className="w-5 h-5 shrink-0" />
                        </div>
                      </div>

                      {/* Bottom Content Section */}
                      <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                          <h4 className="font-heading text-base font-bold text-slate-800 dark:text-white">
                            Unlimited Tourist Passes
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                            Pre-paid transit card options granting limitless public transportation rides over 3, 5, or 7 days inside the city zone.
                          </p>
                        </div>

                        <div className="pt-4 border-t border-slate-100 dark:border-white/5 space-y-3.5 text-xs text-slate-600 dark:text-slate-300">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
                              <DollarSign className="w-3.5 h-3.5" />
                            </div>
                            <div className="space-y-0.5">
                              <span className="block text-[8px] uppercase tracking-wider text-slate-450 dark:text-slate-500 font-bold">Pricing scale</span>
                              <span className="block text-xs font-semibold text-slate-800 dark:text-white font-mono">$18 - $45 <span className="text-[10px] text-slate-450 dark:text-slate-500 font-normal font-sans">/ unlimited card</span></span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
                              <MapPin className="w-3.5 h-3.5" />
                            </div>
                            <div className="space-y-0.5">
                              <span className="block text-[8px] uppercase tracking-wider text-slate-455 dark:text-slate-500 font-bold">Where to buy</span>
                              <span className="text-xs font-semibold text-slate-800 dark:text-white">Airport Terminal / Main Rail Stations</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-555 dark:text-emerald-400 shrink-0">
                              <TrendingUp className="w-3.5 h-3.5" />
                            </div>
                            <div className="space-y-0.5">
                              <span className="block text-[8px] uppercase tracking-wider text-emerald-600 dark:text-emerald-450 font-bold">Est. savings</span>
                              <span className="block text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                                Save up to 40% <span className="text-[10px] text-emerald-555 dark:text-emerald-505 font-normal font-sans">vs single tickets</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Rent-a-Car Guide Infographic Section with wireframe SVG background */}
                  <div className="relative rounded-[32px] overflow-hidden p-8 sm:p-10 border border-slate-200/50 dark:border-white/[0.04] bg-slate-900 text-white min-h-[300px] flex flex-col md:flex-row items-center justify-between gap-8 text-left shadow-lg">
                    {/* Abstract Car Wireframe Background SVG */}
                    <svg className="absolute -right-16 -bottom-16 w-96 h-96 text-white/[0.025] pointer-events-none select-none" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.4">
                      <path d="M5 62 L15 62 C18 62 21 53 26 53 L68 53 C73 53 75 42 80 42 L89 42 C92 42 94 48 97 55 L97 64 C97 66 95 66 93 66 L89 66 C89 62 86 59 82 59 C78 59 75 62 75 66 L25 66 C25 62 22 59 18 59 C14 59 11 62 11 66 L5 66 Z" />
                      <circle cx="18" cy="66" r="3.5" />
                      <circle cx="82" cy="66" r="3.5" />
                      <path d="M30 53 L38 45 L64 45 L68 53" />
                      <path d="M48 45 L48 53" />
                    </svg>

                    <div className="relative z-10 space-y-6 max-w-2xl">
                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold uppercase tracking-wider">
                          <Car className="w-3.5 h-3.5" />
                          <span>Local Car Rental Guide</span>
                        </div>
                        <h3 className="font-heading text-2xl font-extrabold tracking-tight text-white leading-tight">
                          Renting a Car in {destCity}
                        </h3>
                        <p className="text-xs text-slate-350 font-light leading-relaxed">
                          Navigate your journey at your own pace. Below are the key requirements and pickup details customized for {destCountry}.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-200">
                        <div className="space-y-2.5">
                          <span className="block text-[9px] uppercase tracking-widest text-slate-400 font-bold">Pick-up Locations</span>
                          <span className="block text-xs font-semibold text-white">{carRentalGuidelines.location}</span>
                          <span className="block text-[9px] uppercase tracking-widest text-slate-400 font-bold mt-2">Required Documents</span>
                          <ul className="space-y-1.5 list-disc pl-4 text-xs font-light text-slate-300">
                            {carRentalGuidelines.docs.map((doc, i) => (
                              <li key={i}>{doc}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-2.5">
                          <span className="block text-[9px] uppercase tracking-widest text-slate-400 font-bold">Local Traffic Rules</span>
                          <ul className="space-y-1.5 list-disc pl-4 text-xs font-light text-slate-300">
                            {carRentalGuidelines.rules.map((rule, i) => (
                              <li key={i}>{rule}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Booking links deck */}
                      <div className="pt-2 flex flex-wrap gap-3">
                        <a 
                          href="https://www.booking.com/cars/index.html" 
                          target="_blank" 
                          rel="noreferrer" 
                          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all hover:scale-102 flex items-center gap-1 shadow-sm"
                        >
                          Booking.com Cars <ExternalLink className="w-3 h-3" />
                        </a>
                        <a 
                          href="https://www.rentalcars.com/" 
                          target="_blank" 
                          rel="noreferrer" 
                          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all hover:scale-102 flex items-center gap-1 border border-slate-700"
                        >
                          Rentalcars.com <ExternalLink className="w-3 h-3" />
                        </a>
                        <a 
                          href="https://www.tripadvisor.com/RentalCars" 
                          target="_blank" 
                          rel="noreferrer" 
                          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all hover:scale-102 flex items-center gap-1 border border-slate-700"
                        >
                          TripAdvisor Cars <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Airport Transfer advice infographic block */}
                  <div className="p-6 bg-slate-50 dark:bg-white/[0.01] border border-slate-205/30 dark:border-white/[0.04] rounded-3xl text-left shadow-sm flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0">
                      <Info className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-heading text-sm font-bold tracking-tight text-slate-850 dark:text-white leading-none">
                        AI Recommended Airport Transfers (Arrival Day 1)
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                        Based on your "{budgetTier}" budget tier, the algorithm suggests taking the high-speed airport express rail directly to the central terminal station (22 mins, $14.50), then taking a short ride-hail cab straight to your base hotel lobby. This avoids heavy highway traffic gridlocks.
                      </p>
                    </div>
                  </div>

                  {/* Dynamic local apps with brand logos */}
                  <div className="glass-card p-8 border border-slate-200/50 dark:border-white/[0.04] rounded-[32px] text-left space-y-6 bg-white/40 dark:bg-[#0c1424]/10">
                    <div className="flex items-center gap-3 select-none pb-4 border-b border-slate-205/30 dark:border-white/[0.04]">
                      <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-[var(--accent)] shrink-0">
                        <Smartphone className="w-4.5 h-4.5" />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="font-heading text-base font-extrabold tracking-tight text-slate-800 dark:text-white">
                          Local Transit Apps Directory
                        </h4>
                        <p className="text-2xs text-slate-455 dark:text-slate-500 font-light leading-none">
                          Download these local apps for direct transit booking and mapping
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                      {displayTransitApps && Array.isArray(displayTransitApps) && displayTransitApps.map((app, i) => {
                        if (!app) return null;
                        return (
                          <div key={i} className="bg-white dark:bg-[#0d1425]/30 border border-slate-200/50 dark:border-white/[0.04] p-5 rounded-2xl flex items-start gap-4 shadow-sm hover:border-[var(--accent)]/30 hover:scale-102 transition-all duration-300 text-left">
                            <TransportAppLogo name={app.name} className="w-10 h-10 shrink-0 rounded-xl shadow-xs border border-slate-200/40 dark:border-white/5 bg-white" />
                            <div className="space-y-1">
                              <span className="text-xs font-extrabold text-slate-800 dark:text-white block leading-tight">{app.name || 'Transit App'}</span>
                              <span className="text-[10.5px] text-slate-500 dark:text-slate-400 font-light leading-relaxed block">{app.purpose || 'Local transit application.'}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              )}




              {activeDashboardTab === 'culinary' && (
                <div className="space-y-6">
                  
                  {/* Table of curated dining spots */}
                  <div className="glass-card border border-luxury-border dark:border-white/[0.04] overflow-hidden rounded-2xl">
                    <div className="p-5 border-b border-luxury-border dark:border-white/[0.04] flex items-center justify-between">
                      <h4 className="font-heading text-xs font-bold uppercase tracking-widest text-luxury-primary dark:text-white">
                        Recommended Places to Eat
                      </h4>
                      <span className="text-[10px] font-sans font-semibold bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full uppercase">
                        Halal & Veg Options Mapped
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs font-sans">
                        <thead>
                          <tr className="bg-slate-100 dark:bg-white/[0.02] text-slate-400 font-semibold uppercase tracking-wider border-b border-luxury-border dark:border-white/[0.04] text-[10px]">
                            <th className="p-4">Establishment</th>
                            <th className="p-4">Type / Cuisine</th>
                            <th className="p-4">Expenses Scale</th>
                            <th className="p-4">Rating</th>
                            <th className="p-4">Preferences Tags</th>
                            <th className="p-4 text-center">Location</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-luxury-border dark:divide-white/[0.04]">
                          {displayCulinary && Array.isArray(displayCulinary) && displayCulinary.map((rest, i) => {
                            if (!rest) return null;
                            const tagsArray = Array.isArray(rest.tags) 
                              ? rest.tags 
                              : typeof rest.tags === 'string' 
                                ? rest.tags.split(',').map(s => s.trim()) 
                                : [];
                            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((rest.name || 'Gourmet Selection') + ' ' + (activeDestination.name || ''))}`;
                            return (
                              <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-colors">
                                <td className="p-4 font-sans font-bold text-luxury-primary dark:text-white">
                                  <div className="flex items-center gap-2">
                                    <span>{rest.name || 'Gourmet Selection'}</span>
                                    <a 
                                      href={mapsUrl}
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="p-1 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-indigo-500/10 dark:hover:bg-indigo-500/20 dark:hover:text-indigo-400 transition-colors"
                                      title={`View ${rest.name} on Google Maps`}
                                    >
                                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                                    </a>
                                  </div>
                                  <div className="text-[10px] text-slate-400 font-light font-sans mt-0.5">{rest.note || 'Premium local dining highlight.'}</div>
                                </td>
                                <td className="p-4 text-luxury-secondary dark:text-slate-400">{rest.type || 'Local Fare'}</td>
                                <td className="p-4 text-[var(--accent)] font-bold">{rest.cost || '$$'}</td>
                                <td className="p-4 font-bold text-amber-500">★ {rest.rating || '4.5'}</td>
                                <td className="p-4">
                                  <div className="flex flex-wrap gap-1">
                                    {tagsArray.map((t, idx) => (
                                      <span key={idx} className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/[0.04] text-slate-400 border border-luxury-border dark:border-white/[0.04]">
                                        {t}
                                      </span>
                                    ))}
                                  </div>
                                </td>
                                <td className="p-4 text-center">
                                  <a 
                                    href={mapsUrl}
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-650 dark:bg-indigo-500/5 dark:text-indigo-400 hover:bg-indigo-500 dark:hover:bg-indigo-500 hover:text-white transition-all duration-300 shadow-xs"
                                    title="Open in Google Maps"
                                  >
                                    <MapPin className="w-4 h-4" />
                                  </a>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Culinary specialty cards */}
                  <div className="space-y-4 text-left">
                    <h4 className="text-xs uppercase tracking-widest font-extrabold text-luxury-secondary dark:text-slate-400 font-heading">
                      Famous Regional Specialties
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {(activeDestination.foods || ['Gourmet local stews', 'Street pancakes', 'Botanical drinks']).map((foodName, i) => (
                        <div key={i} className="p-4 bg-slate-50 dark:bg-white/[0.01] border border-luxury-border dark:border-white/[0.04] rounded-xl flex items-center gap-3">
                          <Utensils className="w-5 h-5 text-[var(--accent)] shrink-0" />
                          <div className="space-y-0.5">
                            <span className="text-xs font-semibold text-luxury-primary dark:text-white leading-none">{foodName}</span>
                            <span className="block text-[10px] text-slate-400 font-sans font-light">Traditional Must-Try Culinary dish</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* ============================================================
                  SAFETY & CULTURE DESK TAB
                  ============================================================ */}
              {activeDashboardTab === 'safety' && (
                <div className="space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Safety advisories */}
                    <div className="glass-card p-6 border border-luxury-border dark:border-white/[0.04] space-y-4 text-left">
                      <div className="flex items-center gap-2 text-amber-500">
                        <ShieldAlert className="w-4 h-4" />
                        <h4 className="font-heading text-sm font-semibold tracking-tight text-luxury-primary dark:text-white">
                          Scams & Safety Warnings
                        </h4>
                      </div>
                      
                      <ul className="space-y-3.5 text-xs text-luxury-secondary dark:text-slate-400 font-light leading-relaxed list-disc pl-4">
                        <li>
                          <span className="font-bold text-luxury-primary dark:text-white">Unmetered Taxis:</span> Always request the meter active or use pre-calculated Uber ride-hail selections at airport terminals.
                        </li>
                        <li>
                          <span className="font-bold text-luxury-primary dark:text-white">Bustling Crowd Pockets:</span> Secure secondary zippered wallet files in heavy tourist corridors.
                        </li>
                        <li>
                          <span className="font-bold text-luxury-primary dark:text-white">Emergency Consulate:</span> Keep our integrated consulate emergency registry coordinates handy on device drives.
                        </li>
                      </ul>
                    </div>

                    {/* Culture & Customs */}
                    <div className="glass-card p-6 border border-luxury-border dark:border-white/[0.04] space-y-4 text-left">
                      <div className="flex items-center gap-2 text-indigo-400">
                        <Globe className="w-4 h-4 animate-pulse" />
                        <h4 className="font-heading text-sm font-semibold tracking-tight text-luxury-primary dark:text-white">
                          Cultural Etiquette & Laws
                        </h4>
                      </div>
                      
                      <p className="text-xs text-luxury-secondary dark:text-slate-400 font-light leading-relaxed">
                        {displaySafety.note || activeDestination.culture || 'Modest dress is highly recommended in public historical places. A friendly greeting at entry remains standard social protocol.'}
                      </p>

                      <div className="pt-2.5 border-t border-luxury-border dark:border-white/[0.04] space-y-2.5 text-xs font-sans">
                        <div className="flex justify-between">
                          <span className="text-slate-455 font-light">Tipping guidelines:</span>
                          <span className="text-luxury-primary dark:text-white font-medium">Included in bill or 10% appreciated</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-455 font-light">Dress protocols:</span>
                          <span className="text-luxury-primary dark:text-white font-medium">Modest clothes for religious sites</span>
                        </div>
                      </div>
                    </div>

                    {/* Visa Guidelines */}
                    <div className="glass-card p-6 border border-luxury-border dark:border-white/[0.04] space-y-4 text-left">
                      <div className="flex items-center justify-between border-b border-luxury-border dark:border-white/[0.04] pb-3">
                        <div className="flex items-center gap-2 text-blue-500">
                          <FileText className="w-4 h-4" />
                          <h4 className="font-heading text-sm font-semibold tracking-tight text-luxury-primary dark:text-white">
                            Visa Requirements
                          </h4>
                        </div>
                        {displayVisa.isLoading ? (
                          <div className="w-16 h-3.5 bg-slate-200 dark:bg-white/10 rounded animate-pulse" />
                        ) : displayVisa.isLive ? (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-500 font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            API Synced
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-500 font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            Sandbox Active
                          </span>
                        )}
                      </div>
                      
                      {displayVisa.isLoading ? (
                        <div className="space-y-3 animate-pulse">
                          <div className="w-full h-4 bg-slate-200 dark:bg-white/5 rounded" />
                          <div className="w-2/3 h-4 bg-slate-200 dark:bg-white/5 rounded" />
                        </div>
                      ) : (
                        <div className="space-y-3.5 text-xs">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-455 font-light">Requirement:</span>
                            <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                              displayVisa.color === 'green' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' :
                              displayVisa.color === 'red' ? 'bg-red-500/15 text-red-600 dark:text-red-400' :
                              'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                            }`}>{displayVisa.requirement}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-455 font-light">Stay Allowed:</span>
                            <span className="text-luxury-primary dark:text-white font-medium">{displayVisa.duration}</span>
                          </div>
                          <div className="pt-2.5 border-t border-luxury-border dark:border-white/[0.04] text-slate-400 font-light leading-relaxed text-[11px]">
                            <strong className="font-semibold text-slate-900 dark:text-white">Critical Alert:</strong> {displayVisa.criticalInfo}
                          </div>
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Consulates emergency dashboard */}
                  <div className="p-5 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-start gap-4 text-left">
                    <PhoneCall className="w-5 h-5 text-red-500 shrink-0 mt-0.5 animate-bounce" />
                    <div className="space-y-1 font-sans text-xs">
                      <h5 className="font-heading text-xs font-bold text-red-500 uppercase tracking-widest">
                        Emergency Consulate & Contacts Desk
                      </h5>
                      <p className="text-luxury-secondary dark:text-slate-400 font-light">
                        Local Police: <span className="font-bold text-luxury-primary dark:text-white">{displaySafety.police}</span> • Ambulance: <span className="font-bold text-luxury-primary dark:text-white">{displaySafety.ambulance}</span> • Fire: <span className="font-bold text-luxury-primary dark:text-white">{displaySafety.fire}</span> • Consulate note: <span className="italic text-slate-455 font-light">{displaySafety.note}</span>
                      </p>
                    </div>
                  </div>

                </div>
              )}

              {/* ============================================================
                  PACKING CHECKLIST TAB
                  ============================================================ */}
              {activeDashboardTab === 'packing' && (
                <div className="space-y-6 relative overflow-hidden">
                  {/* Faint absolute travel/luggage vector background */}
                  <div className="absolute right-[-20px] bottom-[-20px] w-64 h-64 opacity-5 dark:opacity-[0.03] pointer-events-none select-none z-0">
                    <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-current text-slate-550 dark:text-slate-400">
                      <rect x="25" y="35" width="50" height="45" rx="6" strokeWidth="2" />
                      <path d="M40,35 V25 c0,-2.5 2,-4.5 4.5,-4.5 h11 c2.5,0 4.5,2 4.5,4.5 V35" strokeWidth="2" />
                      <line x1="38" y1="80" x2="38" y2="85" strokeWidth="2.5" strokeLinecap="round" />
                      <line x1="62" y1="80" x2="62" y2="85" strokeWidth="2.5" strokeLinecap="round" />
                      <rect x="42" y="47" width="16" height="18" rx="2" strokeWidth="1.5" />
                      <circle cx="50" cy="56" r="2.5" fill="currentColor" />
                    </svg>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                    
                    {/* Category: Gear & Tech */}
                    <div className="glass-card p-6 border border-luxury-border dark:border-white/[0.04] space-y-4">
                      <h4 className="font-heading text-sm font-semibold tracking-tight text-luxury-primary dark:text-white flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4 text-[var(--accent)]" /> Gear & Technical Tools
                      </h4>
                      
                      <div className="space-y-2">
                        {displayPacking && Array.isArray(displayPacking) && displayPacking.filter(item => item && (item.category === 'Gear' || item.category === 'Gadgets')).map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                            <span className="text-xs text-luxury-secondary dark:text-slate-400 font-light">{item.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Category: Essentials */}
                    <div className="glass-card p-6 border border-luxury-border dark:border-white/[0.04] space-y-4">
                      <h4 className="font-heading text-sm font-semibold tracking-tight text-luxury-primary dark:text-white flex items-center gap-1.5">
                        <Shield className="w-4 h-4 text-emerald-500" /> Essentials & Documents
                      </h4>
                      
                      <div className="space-y-2">
                        {displayPacking && Array.isArray(displayPacking) && displayPacking.filter(item => item && item.category !== 'Gear' && item.category !== 'Gadgets').map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <input type="checkbox" className="rounded text-[var(--accent)] focus:ring-[var(--accent)] shrink-0" />
                            <span className="text-xs text-luxury-secondary dark:text-slate-355 font-sans font-medium">{item.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>
              )}

              {/* ============================================================
                  LIVE ADVISORIES FEED TAB
                  ============================================================ */}
              {activeDashboardTab === 'alerts' && (
                <div className="space-y-4 text-left">
                  
                  {/* Alert item 1 */}
                  <div className="p-4 bg-amber-500/5 border border-amber-500/15 rounded-xl flex items-start gap-4">
                    <CloudRain className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div className="space-y-1 font-sans text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-amber-500 uppercase tracking-wider text-[10px]">Climate Adjustment</span>
                        <span className="text-[8px] text-slate-500 uppercase font-semibold">10 mins ago</span>
                      </div>
                      <p className="text-luxury-secondary dark:text-slate-455 leading-relaxed font-light">
                        Localized light rain shower pockets expected on Day 2 morning. The AI Itinerary planner has proactively shifted outdoor temple trails to Day 3, placing indoor historical galleries inside your Day 2 schedule slot.
                      </p>
                    </div>
                  </div>

                  {/* Alert item 2 */}
                  <div className="p-4 bg-indigo-500/5 border border-indigo-500/15 rounded-xl flex items-start gap-4">
                    <Activity className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                    <div className="space-y-1 font-sans text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-indigo-400 uppercase tracking-wider text-[10px]">Transit Optimization</span>
                        <span className="text-[8px] text-slate-500 uppercase font-semibold">1 hour ago</span>
                      </div>
                      <p className="text-luxury-secondary dark:text-slate-455 leading-relaxed font-light">
                        Metro line 4 is operating with minor 5-minute passenger delays due to morning cleaning. Safe, quiet and direct alternative tram routing maps have been updated inside your Day 1 afternoon transit widgets.
                      </p>
                    </div>
                  </div>

                  {/* Alert item 3 */}
                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/15 rounded-xl flex items-start gap-4">
                    <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="space-y-1 font-sans text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px]">Hidden Gems Unlocked</span>
                        <span className="text-[8px] text-slate-500 uppercase font-semibold">System Sync</span>
                      </div>
                      <p className="text-luxury-secondary dark:text-slate-455 leading-relaxed font-light">
                        Secret local artisanal pottery lanes inside the historical center have been geographically grouped next to your Day 2 afternoon walk tracks. Enjoy rare crowd-free scenic photography windows!
                      </p>
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* RIGHT COLUMN: STICKY TRIP DASHBOARD SIDEBAR */}
            <div className="space-y-6 lg:sticky lg:top-28 print:hidden">
              
              <div className="glass-card p-8 border border-slate-200/50 dark:border-white/[0.04] space-y-8 text-left relative overflow-hidden shadow-premium bg-white/40 dark:bg-[#080d19]/25 rounded-[32px]">
                <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-[var(--accent)]/[0.02] filter blur-xl" />
                
                {/* Header */}
                <div className="flex justify-between items-center pb-4 border-b border-slate-200/50 dark:border-white/[0.04]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] shrink-0">
                      <Compass className="w-4 h-4 animate-spin-slow" />
                    </div>
                    <span className="text-xs uppercase tracking-widest font-heading font-black text-slate-800 dark:text-white">
                      Trip Details
                    </span>
                  </div>
                  <span className="flex items-center gap-1.5 text-[8px] uppercase tracking-widest bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Sync
                  </span>
                </div>

                {/* Info Items */}
                <div className="space-y-6 font-sans text-xs">
                  
                  {/* Current focus day */}
                  <div className="space-y-1">
                    <span className="block text-slate-400 uppercase tracking-widest text-[9px] font-extrabold">Active Highlight</span>
                    <div className="flex items-center justify-between text-sm font-semibold text-slate-700 dark:text-white">
                      <span className="font-bold">Day {expandedDay || 'Overview'} of {totalDays}</span>
                      <span className="text-[10px] text-slate-400 font-normal italic">Selected Day</span>
                    </div>
                  </div>

                  {/* Complete Attractions tracking */}
                  <div className="space-y-2">
                    <span className="block text-slate-400 uppercase tracking-widest text-[9px] font-extrabold">Checklist Progress</span>
                    <div className="space-y-1.5">
                      <div className="w-full bg-slate-200 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-emerald-500 h-full transition-all duration-500 rounded-full"
                          style={{ width: `${(completedAttractionsCount / (totalDays * 2)) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-bold mt-1">
                        <span>{completedAttractionsCount} of {totalDays * 2} items checked</span>
                        <span>{Math.round((completedAttractionsCount / (totalDays * 2)) * 100) || 0}% Complete</span>
                      </div>
                    </div>
                  </div>

                  {/* Budget Spent */}
                  <div className="space-y-3">
                    <span className="block text-slate-400 uppercase tracking-widest text-[9px] font-extrabold">Estimated Spent Breakdown</span>
                    <div className="space-y-3 text-xs font-semibold text-slate-700 dark:text-white pt-1">
                      <div className="flex justify-between items-center">
                        <span className="font-light text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider">Flights & Transfers:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{formatCost(budgetBreakdown.flights)}</span>
                      </div>
                      {/* Hotels Spent with Booking.com Link */}
                      <div className="flex justify-between items-center">
                        <span className="font-light text-slate-505 dark:text-slate-400 uppercase text-[10px] tracking-wider">Hotels & Stays:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 dark:text-slate-205">{formatCost(budgetBreakdown.hotels)}</span>
                          <a 
                            href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destCity)}&checkin=${startDate}&checkout=${endDate}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[9px] font-sans font-bold bg-blue-600 dark:bg-blue-500 text-white px-2.5 py-1 rounded-full hover:scale-105 transition-all uppercase tracking-wider shrink-0 cursor-pointer"
                            title="Direct Booking.com Hotel Search"
                          >
                            Book
                          </a>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-light text-slate-505 dark:text-slate-400 uppercase text-[10px] tracking-wider">Food & Dining:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-202">{formatCost(budgetBreakdown.food)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-light text-slate-505 dark:text-slate-400 uppercase text-[10px] tracking-wider">Activities:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-202">{formatCost(budgetBreakdown.activities)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm pt-3.5 border-t border-slate-200/50 dark:border-white/[0.04]">
                        <span className="uppercase text-[10px] font-black text-[var(--accent)] tracking-widest">Total Estimated:</span>
                        <span className="text-[var(--accent)] font-black text-base font-mono">{formatCost(budgetBreakdown.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="pt-4 space-y-2">
                    <button
                      onClick={handlePrintReport}
                      className="w-full btn-sunset py-3 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-md hover:opacity-95"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Travel Guide Booklet</span>
                    </button>
                    <button
                      onClick={() => {
                        setCurrentStep(1);
                        setOnboardingFormSubstep(1);
                      }}
                      className="w-full py-3 border border-slate-200/60 dark:border-white/10 rounded-full hover:bg-slate-100 dark:hover:bg-white/[0.04] text-[10px] uppercase tracking-widest font-bold text-center block text-slate-700 dark:text-slate-202 transition-colors"
                    >
                      Configure New Itinerary
                    </button>
                  </div>

                </div>
              </div>

            </div>
          </div>

          {/* YouTube Travel Videos for the Planned Destination */}
          <YouTubeTravelSection 
            destination={activeDestination.name} 
            title="▶️ Videos for Your Trip" 
            subtitle={`Watch curated 4K travel guides, walking tours, and cinematic footage for your upcoming journey to ${activeDestination.name}.`}
            className="print:hidden my-16"
          />

          {/* ============================================================
              PRINTABLE LUXURY INFOTAINMENT TRAVEL MAGAZINE REPORT SECTION
              (Styled beautifully with print CSS classes for @media print)
              ============================================================ */}
          <div className="hidden print:block text-left bg-white text-neutral-900 p-10 font-sans max-w-4xl mx-auto space-y-12">
            
            {/* FRONT COVER */}
            <div className="min-h-screen flex flex-col justify-between border-8 border-neutral-900 p-8 text-neutral-900 relative">
              <div className="text-left">
                <span className="text-xs uppercase tracking-widest font-bold text-neutral-500">Travel Guide & Overview</span>
                <h1 className="text-5xl font-black uppercase tracking-tighter text-neutral-900 leading-none mt-2">
                  TRIP READY EDITORIAL
                </h1>
                <div className="w-24 h-1.5 bg-neutral-900 mt-4" />
              </div>

              <div className="my-10 text-center py-20 bg-neutral-50 rounded-2xl">
                <span className="text-xs uppercase font-bold text-amber-600 tracking-widest">PERSONAL EXPLORATION BOOKLET</span>
                <h2 className="text-6xl font-black uppercase tracking-tight text-neutral-900 mt-2">
                  {activeDestination.name}
                </h2>
                <p className="text-sm font-light text-neutral-500 uppercase tracking-widest mt-2">{activeDestination.country}</p>
              </div>

              <div className="flex justify-between items-end border-t-2 border-neutral-900 pt-6 text-2xs font-mono">
                <div className="space-y-1">
                  <div>DEPARTURE: {originCity} ({originCountry})</div>
                  <div>TRAVELERS: {travelersCount} EXPLORERS</div>
                  <div>PACE LEVEL: {energyLevel} COMFORT</div>
                </div>
                <div className="text-right">
                  <div>DURATION: {totalDays} DAYS</div>
                  <div>CLASS: {travelStyle}</div>
                  <div>EST TOTAL SPENT: ${budgetBreakdown.total}</div>
                </div>
              </div>
            </div>

            {/* DESTINATION PROFILE */}
            <div className="page-break min-h-screen pt-10 space-y-6">
              <h3 className="text-xs uppercase font-extrabold tracking-widest text-amber-600">01. GEOGRAPHY & WEATHER</h3>
              <h2 className="text-3xl font-black uppercase text-neutral-900 tracking-tight">Destination Overview</h2>
              <div className="w-16 h-1 bg-neutral-900" />
              
              <p className="text-sm leading-relaxed text-neutral-600 font-light first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-2">
                {activeDestination.description}
              </p>

              <div className="grid grid-cols-2 gap-8 pt-6">
                <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2">
                  <h4 className="text-xs uppercase font-bold text-neutral-900">Climate Parameters</h4>
                  <p className="text-2xs text-neutral-600 leading-relaxed font-light">
                    The average local temperature is {displayWeather?.temp} with {displayWeather?.condition} skies. The best time for sightseeing is usually in the early {activeDestination.bestTime}.
                  </p>
                </div>
                <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2">
                  <h4 className="text-xs uppercase font-bold text-neutral-900">Etiquette & Customs</h4>
                  <p className="text-2xs text-neutral-600 leading-relaxed font-light">
                    {displaySafety.note || activeDestination.culture} Greetings remain standard etiquette. Tipping indexes around 10% in culinary spots.
                  </p>
                </div>
              </div>
            </div>

            {/* TIMELINE BOOKLET */}
            <div className="page-break min-h-screen pt-10 space-y-8">
              <h3 className="text-xs uppercase font-extrabold tracking-widest text-amber-600">02. ROADMAP TIMELINE</h3>
              <h2 className="text-3xl font-black uppercase text-neutral-900 tracking-tight">Day-by-Day Journey</h2>
              <div className="w-16 h-1 bg-neutral-900" />

              <div className="space-y-8">
                {displayItinerary.map((day) => (
                  <div key={day.day} className="border-l-4 border-neutral-900 pl-6 space-y-4">
                    <h4 className="text-lg font-black uppercase tracking-wider text-neutral-900">
                      Day {day.day}: {day.title}
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-2xs leading-relaxed text-neutral-600 font-light">
                      <div>
                        <span className="block font-bold text-neutral-950 uppercase tracking-widest text-4xs">Morning Activities</span>
                        <p>{day.morning.attraction} (Est ticket: {day.morning.price}). Departure time: {day.morning.time} via {day.morning.transport}.</p>
                      </div>
                      <div>
                        <span className="block font-bold text-neutral-950 uppercase tracking-widest text-4xs">Afternoon Activities</span>
                        <p>{day.afternoon.attraction} (Est ticket: {day.afternoon.price}). Route via {day.afternoon.walkingRoute}.</p>
                      </div>
                      <div>
                        <span className="block font-bold text-neutral-950 uppercase tracking-widest text-4xs">Evening & Culinary Highlights</span>
                        <p>Dinner at {day.evening.dinner}. Sunset viewpoint: {day.evening.sunsetSpot}. Night lounge: {day.evening.nightlife}.</p>
                      </div>
                      <div>
                        <span className="block font-bold text-neutral-950 uppercase tracking-widest text-4xs">Safety & Next-Day Preparation</span>
                        <p>Safety alert: {day.night.safetyNote}. Next-day prep: {day.night.nextDayPrep}.</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CHECKS & EMERGENCY */}
            <div className="page-break min-h-screen pt-10 space-y-8">
              <h3 className="text-xs uppercase font-extrabold tracking-widest text-amber-600">03. TRAVEL CHECKLIST & LOGS</h3>
              <h2 className="text-3xl font-black uppercase text-neutral-900 tracking-tight">Packing & Emergency Protocols</h2>
              <div className="w-16 h-1 bg-neutral-900" />

              <div className="grid grid-cols-2 gap-8 text-2xs leading-relaxed text-neutral-600">
                <div className="space-y-4">
                  <h4 className="text-xs uppercase font-bold text-neutral-900">Packing List checklist</h4>
                  <ul className="space-y-2 pl-4 list-disc font-light">
                    {displayPacking && Array.isArray(displayPacking) && displayPacking.map((item, idx) => {
                      if (!item) return null;
                      return (
                        <li key={idx}>{item.name || 'Travel Item'} ({item.category || 'General'})</li>
                      );
                    })}
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-xs uppercase font-bold text-neutral-900">Safety & Consular desk</h4>
                  <p className="font-mono text-[10px] text-neutral-800 leading-snug">
                    Local Emergency Police: 112 / 911 equivalent<br />
                    Medical Ambulance: 119<br />
                    USA embassy consulate hotline: +1 (202) 501-4444<br />
                    Address matching visa forms registry.
                  </p>
                  
                  {/* Fake printed QR block */}
                  <div className="border border-neutral-300 p-4 rounded-xl flex items-center gap-4 bg-neutral-50 mt-6">
                    <div className="w-16 h-16 bg-neutral-400 shrink-0" />
                    <div>
                      <span className="block text-3xs font-bold text-neutral-900 uppercase">Emergency Navigation QR link</span>
                      <p className="text-4xs text-neutral-500 font-light mt-1">Scan to load dynamic satellite coordinate tracers direct to emergency hubs.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ─── API SETTINGS MODAL ─── */}
      {showApiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in select-none">
          <div className="relative glass-card w-full max-w-md p-6 border border-white/10 dark:border-white/[0.04] shadow-premium rounded-[28px] overflow-hidden text-left bg-[var(--bg-secondary)] text-[var(--text-primary)]">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-blue-500/[0.05] filter blur-xl pointer-events-none" />
            
            {/* Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-white/[0.03]">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-blue-500 animate-spin-slow" />
                <h3 className="font-heading text-sm font-bold uppercase tracking-wider">Gemini API Settings</h3>
              </div>
              <button 
                onClick={() => setShowApiModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-[var(--text-primary)] hover:bg-slate-200/50 dark:hover:bg-white/[0.04] transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="space-y-4 text-xs font-sans">
              <p className="text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                Connect your Google Gemini API key directly to unlock real-time, helpful travel tips. Your key is stored strictly on your local browser (<code className="bg-slate-100 dark:bg-white/[0.04] px-1 rounded">localStorage</code>) and is never transmitted to any third-party servers.
              </p>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">
                  Google Gemini API Key
                </label>
                <input 
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl py-3 px-4 text-xs outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 text-[var(--text-primary)] font-mono transition-all"
                />
              </div>

              <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl text-[10px] text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                <span className="font-semibold text-blue-500 block mb-0.5">Need a key?</span>
                Get a completely free or pay-as-you-go Gemini API key from the <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Google AI Studio</a> console in less than 30 seconds.
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex gap-3 justify-end mt-6 pt-3 border-t border-slate-100 dark:border-white/[0.03]">
              <button 
                onClick={() => {
                  saveGeminiApiKey('');
                  setApiKeyInput('');
                  setShowApiModal(false);
                }}
                className="px-4 py-2 border border-[var(--border)] rounded-xl hover:bg-slate-50 dark:hover:bg-white/[0.04] text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Clear Key
              </button>
              <button 
                onClick={() => {
                  saveGeminiApiKey(apiKeyInput);
                  setShowApiModal(false);
                }}
                className="btn-sunset px-4 py-2 text-[10px] rounded-xl font-bold uppercase tracking-wider cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TIME-001: Add Custom Event Modal */}
      {showAddEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in select-none">
          <div className="relative bg-white dark:bg-[#0c1424] border border-slate-200 dark:border-white/[0.08] rounded-[28px] max-w-md w-full p-6 space-y-4 shadow-2xl relative text-left">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-indigo-500/[0.03] filter blur-xl pointer-events-none" />
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-lg font-bold text-luxury-primary dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-500" />
                <span>Schedule Custom Event</span>
              </h3>
              <button
                onClick={() => setShowAddEventModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-luxury-primary dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04] transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-slate-450 dark:text-slate-455 font-light leading-relaxed">
              Add custom slots like flights, dinner reservations, or local events. The planner checks for timing overlaps with your sightseeing plans.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Event Title</label>
                <input
                  type="text"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder="e.g. Flight Departure, Fine Dining reservation"
                  className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-luxury-primary dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={newEventStart}
                    onChange={(e) => setNewEventStart(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-luxury-primary dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">End Time</label>
                  <input
                    type="time"
                    value={newEventEnd}
                    onChange={(e) => setNewEventEnd(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-luxury-primary dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Category</label>
                <select
                  value={newEventCategory}
                  onChange={(e) => setNewEventCategory(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-luxury-primary dark:text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Activity">Activity</option>
                  <option value="Culinary">Culinary</option>
                  <option value="Transit">Transit</option>
                  <option value="Rest">Rest</option>
                  <option value="Shopping">Shopping</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setShowAddEventModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-slate-650 dark:text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={addCustomEvent}
                disabled={!newEventTitle.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
              >
                Add Event
              </button>
            </div>
          </div>
        </div>
      )}

      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 px-5 py-3 rounded-2xl bg-gradient-to-tr from-[var(--accent)] to-indigo-600 text-white text-xs font-semibold shadow-premium border border-white/10 animate-slide-up">
          {toastMsg}
        </div>
      )}

    </div>
  );
}