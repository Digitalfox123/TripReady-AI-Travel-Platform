import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import YouTubeTravelSection from '../components/YouTubeTravelSection';
import { 
  Compass, 
  Globe, 
  Building2, 
  Users, 
  Map, 
  BookOpen, 
  HeartPulse, 
  AlertTriangle, 
  TrendingUp, 
  Coins, 
  Clock, 
  ArrowRight, 
  Search, 
  Award, 
  FileText, 
  ChevronLeft,
  ChevronRight, 
  Info, 
  Calendar, 
  DollarSign, 
  X, 
  ArrowLeftRight,
  MapPin,
  ShieldAlert,
  Navigation,
  Shield,
  UtensilsCrossed,
  Lock,
  CheckCircle,
  Activity,
  Milestone,
  Car,
  Train,
  Plane,
  Camera,
  Wifi,
  CheckCircle2,
  Sparkles,
  Star,
  Smartphone,
  AlertCircle,
  ThumbsUp,
  Check,
  Snowflake,
  Sun,
  Heart
} from 'lucide-react';
import { continents, countriesData } from '../data/countryData';
import { cityDatabase, getCitiesForCountry } from '../data/cityDatabase';
import { useDestinationGallery, getCityImage, usePremiumImage } from '../utils/imageLookup';
import { WorldMap } from '../components/ui/map';
import { useTheme } from '../hooks/useTheme';
import { getCountryIntelligence } from '../data/countryIntelligence';
import { useLiveRates } from '../utils/currencyService';
import { fetchLiveVisaRequirement, simulateVisaRequirement } from '../utils/rapidApiService';
import { supabase } from '../utils/supabaseClient';
import allCountriesList from '../data/countries.json';

// ── Reusable DynamicImage Component (uses usePremiumImage hook safely outside loops) ──
function DynamicImage({ name, country, className = '', alt = '', queryOverride = null }) {
  const { imageUrl, loading } = usePremiumImage(name, country, queryOverride);
  const [imgError, setImgError] = useState(false);
  const [finalSrc, setFinalSrc] = useState(() => imageUrl || getCityImage(name, country));
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    if (imageUrl) {
      setFinalSrc(imageUrl);
      setImgError(false);
    }
  }, [imageUrl]);

  const handleError = () => {
    setImgError(true);
    const countryFallback = getCityImage(country, country);
    if (finalSrc !== countryFallback) {
      setFinalSrc(countryFallback);
    } else {
      setFinalSrc('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=80');
    }
    setImgLoaded(true);
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Visual background pattern */}
      <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
        <Compass size={24} className="animate-spin-slow text-slate-700/50" />
      </div>

      <img
        src={finalSrc || imageUrl}
        alt={alt || name}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-90'}`}
        onLoad={() => setImgLoaded(true)}
        onError={handleError}
        loading="lazy"
      />
    </div>
  );
}


// ── Dynamic Haversine Geodesic Math Solver ───────────────────────────────────
const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const getTravelEstimates = (fromCity, toCity) => {
  const geoDist = calculateHaversineDistance(fromCity.lat, fromCity.lng, toCity.lat, toCity.lng);
  const roadDist = Math.round(geoDist * 1.25); // Scale by 1.25 for curvature

  // 1. Road (Car) at 80 km/h
  const carHrs = roadDist / 80;
  const carH = Math.floor(carHrs);
  const carM = Math.round((carHrs - carH) * 60);
  const travel_time_road = carH > 0 ? `${carH}h ${carM}m` : `${carM}m`;

  // 2. Rail (Train) at 120 km/h
  const trainHrs = roadDist / 120;
  const trainH = Math.floor(trainHrs);
  const trainM = Math.round((trainHrs - trainH) * 60);
  const travel_time_train = trainH > 0 ? `${trainH}h ${trainM}m` : `${trainM}m`;

  // 3. Air (Flight) at 750 km/h + 50m overhead (only if road distance > 200 km)
  let travel_time_flight = 'N/A';
  if (geoDist > 200) {
    const flightHrs = geoDist / 750 + 50 / 60;
    const flightH = Math.floor(flightHrs);
    const flightM = Math.round((flightHrs - flightH) * 60);
    travel_time_flight = flightH > 0 ? `${flightH}h ${flightM}m` : `${flightM}m`;
  }

  return {
    distance_km: roadDist,
    travel_time_road,
    travel_time_train,
    travel_time_flight
  };
};

const getFlagUrl = (countryId, emoji) => {
  if (emoji && typeof emoji === 'string') {
    const chars = [...emoji];
    const code = chars.map(char => {
      const cp = char.codePointAt(0);
      if (cp >= 127462 && cp <= 127487) {
        return String.fromCharCode(cp - 127462 + 97);
      }
      return '';
    }).join('');
    
    if (code.length === 2) {
      return `https://flagcdn.com/w160/${code}.png`;
    }
  }

  if (!countryId || typeof countryId !== 'string') return 'https://flagcdn.com/w160/un.png';
  const customMap = {
    switzerland: 'ch',
    japan: 'jp',
    brazil: 'br',
    south_africa: 'za',
    australia: 'au',
    germany: 'de',
    france: 'fr',
    italy: 'it',
    united_kingdom: 'gb',
    spain: 'es',
    netherlands: 'nl',
    belgium: 'be',
    sweden: 'se',
    norway: 'no',
    austria: 'at',
    united_states: 'us',
    canada: 'ca',
    india: 'in',
    china: 'cn',
    egypt: 'eg',
    new_zealand: 'nz',
    saudi_arabia: 'sa',
    thailand: 'th',
    pakistan: 'pk'
  };
  
  const normalized = countryId.toLowerCase().replace(/ /g, '_');
  const code = customMap[normalized] || 'un';
  return `https://flagcdn.com/w160/${code}.png`;
};

const simCarriers = {
  switzerland: 'Swisscom, Sunrise, Salt',
  pakistan: 'Jazz, Zong, Telenor, Ufone',
  saudi_arabia: 'stc, Mobily, Zain',
  japan: 'NTT Docomo, SoftBank, au',
  united_arab_emirates: 'Etisalat, du',
  united_kingdom: 'EE, O2, Vodafone, Three',
  united_states: 'T-Mobile, Verizon, AT&T',
  india: 'Jio, Airtel, Vi',
  canada: 'Rogers, Bell, Telus',
  germany: 'Telekom, Vodafone, o2',
  turkey: 'Turkcell, Vodafone, Türk Telekom',
  france: 'Orange, SFR, Bouygues, Free',
  australia: 'Telstra, Optus, Vodafone',
  brazil: 'Vivo, Claro, TIM, Oi',
  south_africa: 'Vodacom, MTN, Cell C, Telkom',
  italy: 'TIM, Vodafone, WindTre, Iliad',
  spain: 'Movistar, Vodafone, Orange, MásMóvil',
  south_korea: 'SK Telecom, KT, LG U+',
  singapore: 'Singtel, StarHub, M1',
  indonesia: 'Telkomsel, XL Axiata, Indosat',
  thailand: 'AIS, TrueMove H, dtac',
  china: 'China Mobile, China Unicom, China Telecom',
  malaysia: 'Maxis, Celcom, Digi, U Mobile',
  vietnam: 'Viettel, Mobifone, Vinaphone',
  philippines: 'Globe, Smart, DITO',
  egypt: 'Vodafone, Orange, Etisalat, WE',
  nigeria: 'MTN, Airtel, Glo, 9mobile',
  mexico: 'Telcel, AT&T, Movistar',
  bangladesh: 'Grameenphone, Robi, Banglalink',
  qatar: 'Ooredoo, Vodafone',
  kuwait: 'Zain, stc, Ooredoo',
  oman: 'Omantel, Ooredoo',
  bahrain: 'Batelco, stc, Zain',
  new_zealand: 'Spark, Vodafone, 2degrees',
  kenya: 'Safaricom, Airtel, Telkom',
  morocco: 'Maroc Telecom, Inwi, Orange',
  colombia: 'Claro, Movistar, Tigo',
  argentina: 'Movistar, Claro, Personal',
  peru: 'Movistar, Claro, Entel, Bitel',
  chile: 'Entel, Movistar, Claro, WOM',
  sri_lanka: 'Dialog, Mobitel, Hutch, Airtel',
  nepal: 'Ncell, Nepal Telecom',
  israel: 'Partner, Cellcom, Pelephone, HOT Mobile'
};

export default function CountryExplorerPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isFallbackMode } = useAuth();
  const { isDark } = useTheme();
  const { rates: liveRates, source: ratesSource, lastUpdated: ratesUpdated } = useLiveRates();
  
  // Navigation / Tab states
  const [explorerMode, setExplorerMode] = useState('country'); // 'country' | 'continent'
  const [selectedCountryKey, setSelectedCountryKey] = useState('switzerland');
  const [selectedContinentKey, setSelectedContinentKey] = useState('europe');
  const [hasSelection, setHasSelection] = useState(false);
  const [searchTab, setSearchTab] = useState('country');
  const [selectedTransitGuide, setSelectedTransitGuide] = useState(null);
  const [selectedScheduleTime, setSelectedScheduleTime] = useState(null);

  // ── Favorites ─────────────────────────────────────────────────────
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (!user) { setFavorites([]); return; }
    if (isFallbackMode) {
      const allFavs = JSON.parse(localStorage.getItem('tripready_favorites') || '[]');
      setFavorites(allFavs.filter(f => f.user_id === user.id));
    } else {
      supabase.from('favorites').select('*').eq('user_id', user.id).then(({ data, error }) => { 
        if (error) {
          console.warn("Failed to check Supabase favorites, falling back to local storage:", error);
          const allFavs = JSON.parse(localStorage.getItem('tripready_favorites') || '[]');
          setFavorites(allFavs.filter(f => f.user_id === user.id));
        } else if (data) {
          setFavorites(data); 
        }
      });
    }
  }, [user, isFallbackMode]);

  const toggleFavorite = async (itemId, itemName, itemType, e) => {
    if (e) e.stopPropagation();
    if (!user) { alert('Please log in to save favorites!'); return; }
    const isFav = favorites.some(f => f.item_id === itemId && f.item_type === itemType);
    if (isFav) {
      if (isFallbackMode) {
        const allFavs = JSON.parse(localStorage.getItem('tripready_favorites') || '[]');
        const filtered = allFavs.filter(f => !(f.user_id === user.id && f.item_id === itemId && f.item_type === itemType));
        localStorage.setItem('tripready_favorites', JSON.stringify(filtered));
        setFavorites(filtered.filter(f => f.user_id === user.id));
      } else {
        try {
          const { error } = await supabase.from('favorites').delete().eq('user_id', user.id).eq('item_id', itemId).eq('item_type', itemType);
          if (error) throw error;
          setFavorites(prev => prev.filter(f => !(f.item_id === itemId && f.item_type === itemType)));
        } catch (e) { 
          console.error("Failed to delete favorite from Supabase, falling back:", e);
          const allFavs = JSON.parse(localStorage.getItem('tripready_favorites') || '[]');
          const filtered = allFavs.filter(f => !(f.user_id === user.id && f.item_id === itemId && f.item_type === itemType));
          localStorage.setItem('tripready_favorites', JSON.stringify(filtered));
          setFavorites(filtered.filter(f => f.user_id === user.id));
        }
      }
    } else {
      const newFav = { id: crypto.randomUUID(), user_id: user.id, item_id: itemId, item_name: itemName, item_type: itemType, created_at: new Date().toISOString() };
      if (isFallbackMode) {
        const allFavs = JSON.parse(localStorage.getItem('tripready_favorites') || '[]');
        allFavs.unshift(newFav);
        localStorage.setItem('tripready_favorites', JSON.stringify(allFavs));
        setFavorites(allFavs.filter(f => f.user_id === user.id));
      } else {
        try {
          const { error } = await supabase.from('favorites').insert([newFav]);
          if (error) throw error;
          setFavorites(prev => [newFav, ...prev]);
        } catch (e) { 
          console.error("Failed to insert favorite into Supabase, falling back:", e);
          const allFavs = JSON.parse(localStorage.getItem('tripready_favorites') || '[]');
          allFavs.unshift(newFav);
          localStorage.setItem('tripready_favorites', JSON.stringify(allFavs));
          setFavorites(allFavs.filter(f => f.user_id === user.id));
        }
      }
    }
  };

  const isFavorite = (itemId, itemType) => favorites.some(f => f.item_id === itemId && f.item_type === itemType);

  // Curated country-specific route details for transportation guides
  const countryTransitDb = {
    pakistan: {
      train: {
        operator: 'Pakistan Railways (Green Line)',
        route: 'Islamabad (Margalla) → Rawalpindi → Gujranwala → Lahore Junction',
        stops: [
          { name: 'Islamabad Margalla Station', arr: '--', dep: '08:00 AM', platform: 'Platform 2', stay: '--' },
          { name: 'Rawalpindi Station', arr: '08:25 AM', dep: '08:45 AM', platform: 'Platform 1', stay: '20m' },
          { name: 'Gujranwala Station', arr: '10:15 AM', dep: '10:20 AM', platform: 'Platform 3', stay: '5m' },
          { name: 'Lahore Junction', arr: '12:20 PM', dep: '--', platform: 'Platform 4', stay: '--' }
        ],
        fares: { economy: 'Rs.1,500', business: 'Rs.2,800', executive: 'Rs.4,500' },
        schedules: ['06:00', '08:00', '11:00', '13:00', '16:30', '18:00'],
        mapQuery: 'Islamabad+to+Lahore+Railway+Station',
        speed: '120 km/h',
        amenities: { wifi: true, plugs: true, food: true, restroom: true, ac: true },
        image: 'https://images.unsplash.com/photo-1541417904950-b855846fe074?w=1200&q=80'
      },
      bus: {
        operator: 'Daewoo Express / Faisal Movers',
        route: 'Islamabad M2 Terminal → Bhera Rest Area → Lahore Thokar Niaz Baig',
        stops: [
          { name: 'Islamabad Terminal (G-11)', arr: '--', dep: '09:00 AM', platform: 'Bay 4', stay: '--' },
          { name: 'Bhera Motorway Service Area', arr: '11:15 AM', dep: '11:35 AM', platform: '--', stay: '20m' },
          { name: 'Lahore Thokar Niaz Baig Terminal', arr: '01:20 PM', dep: '--', platform: '--', stay: '--' }
        ],
        fares: { economy: 'Rs.1,300', business: 'Rs.1,850', executive: 'Rs.2,400' },
        schedules: ['07:00', '09:00', '11:30', '13:30', '15:00', '17:30', '19:00', '21:00'],
        mapQuery: 'Daewoo+Express+Terminal+Islamabad+to+Lahore',
        speed: '100 km/h',
        amenities: { wifi: true, plugs: true, food: true, restroom: false, ac: true },
        image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&q=80'
      },
      metro: {
        operator: 'Lahore Orange Line Metro / Islamabad Metrobus',
        route: 'Ali Town → Anarkali → Lahore Railway Station → Dera Gujran',
        stops: [
          { name: 'Ali Town Terminal', arr: '--', dep: '06:00 AM', platform: 'Track A', stay: '--' },
          { name: 'Anarkali Interchange', arr: '06:22 AM', dep: '06:24 AM', platform: 'Track A', stay: '2m' },
          { name: 'Lahore Railway Station', arr: '06:38 AM', dep: '06:40 AM', platform: 'Track A', stay: '2m' },
          { name: 'Dera Gujran Terminal', arr: '06:55 AM', dep: '--', platform: '--', stay: '--' }
        ],
        fares: { economy: 'Rs.40 Flat Rate', business: 'N/A', executive: 'N/A' },
        schedules: ['Every 5 mins (06:00 AM - 10:00 PM)'],
        mapQuery: 'Orange+Line+Metro+Station+Lahore',
        speed: '80 km/h',
        amenities: { wifi: false, plugs: false, food: false, restroom: true, ac: true },
        image: 'https://images.unsplash.com/photo-1560671563-7a75c5838cf3?w=1200&q=80'
      },
      rideshare: {
        operator: 'Uber / Careem / inDrive',
        route: 'Door-to-door transit within Islamabad/Rawalpindi & Lahore',
        fares: { economy: 'Rs.450 (Mini)', business: 'Rs.800 (Eco)', executive: 'Rs.1,500 (Sedan)' },
        schedules: ['On-Demand 24/7 via mobile app'],
        mapQuery: 'Islamabad+to+Rawalpindi+Route',
        speed: '60 km/h',
        amenities: { wifi: false, plugs: true, food: false, restroom: false, ac: true },
        image: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=1200&q=80'
      },
      carRental: {
        operator: 'Hertz Pakistan / local chauffeured agencies',
        route: 'Airport Car Rentals & Inter-City Chauffeured Travel',
        fares: { economy: 'Rs.5,500/day', business: 'Rs.10,000/day', executive: 'Rs.18,000/day (SUV)' },
        schedules: ['Flexible reservations 24 hours advance'],
        mapQuery: 'Islamabad+Airport+Car+Rental',
        speed: '90 km/h',
        amenities: { wifi: false, plugs: true, food: false, restroom: false, ac: true },
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80'
      },
      flights: {
        operator: 'PIA / AirSial / FlyJinnah',
        route: 'Islamabad (ISB) Terminal 1 → Karachi Jinnah International (KHI)',
        stops: [
          { name: 'Islamabad Airport (ISB)', arr: '--', dep: '11:00 AM', platform: 'Gate 14', stay: '--' },
          { name: 'Karachi Airport (KHI)', arr: '01:00 PM', dep: '--', platform: '--', stay: '--' }
        ],
        fares: { economy: 'Rs.18,500', business: 'Rs.32,000', executive: 'Rs.45,000' },
        schedules: ['08:30', '11:00', '14:30', '18:00', '21:15'],
        mapQuery: 'Islamabad+Airport+to+Karachi+Airport',
        speed: '780 km/h',
        amenities: { wifi: false, plugs: true, food: true, restroom: true, ac: true },
        image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80'
      }
    },
    italy: {
      train: {
        operator: 'Trenitalia Frecciarossa / Italo',
        route: 'Rome Termini → Florence SMN → Bologna Central → Milan Central',
        stops: [
          { name: 'Rome Termini Station', arr: '--', dep: '08:30 AM', platform: 'Platform 11', stay: '--' },
          { name: 'Florence Santa Maria Novella', arr: '10:02 AM', dep: '10:07 AM', platform: 'Platform 5', stay: '5m' },
          { name: 'Bologna Central Station', arr: '10:45 AM', dep: '10:48 AM', platform: 'Platform 16', stay: '3m' },
          { name: 'Milan Central Station', arr: '11:50 AM', dep: '--', platform: 'Platform 21', stay: '--' }
        ],
        fares: { economy: '€39.00', business: '€59.00', executive: '€95.00' },
        schedules: ['07:00', '08:30', '10:00', '12:00', '14:30', '16:00', '18:30'],
        mapQuery: 'Rome+Termini+to+Milan+Central',
        speed: '300 km/h',
        amenities: { wifi: true, plugs: true, food: true, restroom: true, ac: true },
        image: 'https://images.unsplash.com/photo-1541417904950-b855846fe074?w=1200&q=80'
      },
      bus: {
        operator: 'FlixBus Italy',
        route: 'Rome Tiburtina Terminal → Florence Villa Constanza → Milan Lampugnano',
        stops: [
          { name: 'Rome Tiburtina Bus Station', arr: '--', dep: '07:30 AM', platform: 'Bay 12', stay: '--' },
          { name: 'Florence Villa Constanza', arr: '11:45 AM', dep: '12:00 PM', platform: 'Bay 2', stay: '15m' },
          { name: 'Milan Lampugnano Station', arr: '04:15 PM', dep: '--', platform: '--', stay: '--' }
        ],
        fares: { economy: '€14.90', business: '€24.90', executive: 'N/A' },
        schedules: ['06:00', '07:30', '10:15', '13:00', '15:30', '19:00', '23:30'],
        mapQuery: 'Rome+Tiburtina+to+Milan+Lampugnano+FlixBus',
        speed: '95 km/h',
        amenities: { wifi: true, plugs: true, food: false, restroom: true, ac: true },
        image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&q=80'
      },
      metro: {
        operator: 'ATM Milano / ATAC Roma Subway',
        route: 'Milano Centrale (M3/M2) → Duomo (M1) → Cadorna FN (M1/M2)',
        stops: [
          { name: 'Milano Centrale Station', arr: '--', dep: '06:00 AM', platform: 'Track 1', stay: '--' },
          { name: 'Repubblica', arr: '06:03 AM', dep: '06:04 AM', platform: 'Track 1', stay: '1m' },
          { name: 'Duomo Cathedral Square', arr: '06:08 AM', dep: '06:09 AM', platform: 'Track 1', stay: '1m' },
          { name: 'Cadorna FN Station', arr: '06:14 AM', dep: '--', platform: '--', stay: '--' }
        ],
        fares: { economy: '€2.20 Single Ride', business: '€7.60 (24h Ticket)', executive: 'N/A' },
        schedules: ['Every 3 mins (05:30 AM - 12:30 AM)'],
        mapQuery: 'Milan+Metro+Duomo+Station',
        speed: '70 km/h',
        amenities: { wifi: false, plugs: false, food: false, restroom: false, ac: true },
        image: 'https://images.unsplash.com/photo-1560671563-7a75c5838cf3?w=1200&q=80'
      },
      rideshare: {
        operator: 'Uber Black / FreeNow Taxi',
        route: 'Premium chauffeured rides inside Rome, Florence & Milan',
        fares: { economy: '€15 (Standard)', business: '€28 (Black Taxi)', executive: '€45 (Van)' },
        schedules: ['On-Demand 24/7 via mobile app'],
        mapQuery: 'Rome+City+Center+Drive',
        speed: '50 km/h',
        amenities: { wifi: false, plugs: true, food: false, restroom: false, ac: true },
        image: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=1200&q=80'
      },
      carRental: {
        operator: 'Sixt / Hertz / Avis Italy',
        route: 'Airport Car Rentals (Fiumicino / Malpensa) & Autostrada Roadtrips',
        fares: { economy: '€35/day', business: '€65/day', executive: '€120/day (SUV)' },
        schedules: ['Flexible online bookings 24 hours advance'],
        mapQuery: 'Rome+Fiumicino+Airport+Car+Rental',
        speed: '110 km/h',
        amenities: { wifi: false, plugs: true, food: false, restroom: false, ac: true },
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80'
      },
      flights: {
        operator: 'ITA Airways / Ryanair / EasyJet',
        route: 'Rome Fiumicino (FCO) Terminal 1 → Milan Linate Airport (LIN)',
        stops: [
          { name: 'Rome Fiumicino Airport (FCO)', arr: '--', dep: '09:15 AM', platform: 'Gate B22', stay: '--' },
          { name: 'Milan Linate Airport (LIN)', arr: '10:25 AM', dep: '--', platform: '--', stay: '--' }
        ],
        fares: { economy: '€49.00', business: '€110.00', executive: '€180.00' },
        schedules: ['07:30', '09:15', '12:00', '15:45', '18:30', '21:00'],
        mapQuery: 'Rome+FCO+Airport+to+Milan+Linate+Airport',
        speed: '800 km/h',
        amenities: { wifi: false, plugs: true, food: true, restroom: true, ac: true },
        image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80'
      }
    },
    default: {
      train: {
        operator: 'National Railway System',
        route: 'Central Metro Terminal → Intermediate Stations → Destination Station',
        stops: [
          { name: 'Central Terminal', arr: '--', dep: '08:00 AM', platform: 'Platform 3', stay: '--' },
          { name: 'City Junction', arr: '09:40 AM', dep: '09:45 AM', platform: 'Platform 2', stay: '5m' },
          { name: 'Destination Station', arr: '11:15 AM', dep: '--', platform: 'Platform 1', stay: '--' }
        ],
        fares: { economy: '$20.00', business: '$45.00', executive: '$75.05' },
        schedules: ['08:00', '11:15', '14:30', '18:00'],
        mapQuery: 'Central+Station+to+Airport',
        speed: '140 km/h',
        amenities: { wifi: true, plugs: true, food: true, restroom: true, ac: true },
        image: 'https://images.unsplash.com/photo-1541417904950-b855846fe074?w=1200&q=80'
      },
      bus: {
        operator: 'Metropolitan Intercity Bus Lines',
        route: 'Central Station Bay → Express Highway Transit → Destination Depot',
        stops: [
          { name: 'Central Bus Terminal', arr: '--', dep: '09:30 AM', platform: 'Bay A', stay: '--' },
          { name: 'Highway Rest Station', arr: '11:20 AM', dep: '11:35 AM', platform: '--', stay: '15m' },
          { name: 'Destination Depot', arr: '01:10 PM', dep: '--', platform: '--', stay: '--' }
        ],
        fares: { economy: '$12.00', business: '$25.00', executive: 'N/A' },
        schedules: ['07:30', '09:30', '12:00', '15:30', '18:45'],
        mapQuery: 'Central+Bus+Depot',
        speed: '90 km/h',
        amenities: { wifi: true, plugs: true, food: false, restroom: true, ac: true },
        image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&q=80'
      },
      metro: {
        operator: 'Metropolitan Subway & Rapid Transit Corp',
        route: 'Line 1 (Express Circular Line Routing)',
        stops: [
          { name: 'Station A', arr: '--', dep: '06:00 AM', platform: 'Track 1', stay: '--' },
          { name: 'Station B', arr: '06:08 AM', dep: '06:09 AM', platform: 'Track 1', stay: '1m' },
          { name: 'Station C', arr: '06:17 AM', dep: '--', platform: '--', stay: '--' }
        ],
        fares: { economy: '$2.50 Flat Rate', business: 'N/A', executive: 'N/A' },
        schedules: ['Every 4 mins (06:00 AM - 11:30 PM)'],
        mapQuery: 'Subway+Metro+Station',
        speed: '75 km/h',
        amenities: { wifi: false, plugs: false, food: false, restroom: false, ac: true },
        image: 'https://images.unsplash.com/photo-1560671563-7a75c5838cf3?w=1200&q=80'
      },
      rideshare: {
        operator: 'Uber / Local rideshare taxi',
        route: 'Point-to-point dynamic routing via mobile apps',
        fares: { economy: '$15.00', business: '$28.00', executive: '$45.00' },
        schedules: ['On-Demand 24/7'],
        mapQuery: 'Downtown+City+Drive',
        speed: '55 km/h',
        amenities: { wifi: false, plugs: true, food: false, restroom: false, ac: true },
        image: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=1200&q=80'
      },
      carRental: {
        operator: 'Enterprise / National / local rental desks',
        route: 'Airport pickup and dropoff services',
        fares: { economy: '$45/day', business: '$80/day', executive: '$150/day' },
        schedules: ['Flexible booking options'],
        mapQuery: 'Airport+Car+Rental+Center',
        speed: '100 km/h',
        amenities: { wifi: false, plugs: true, food: false, restroom: false, ac: true },
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80'
      },
      flights: {
        operator: 'National Flag Carrier / Regional airlines',
        route: 'Capital City Airport → Destination Regional Airport',
        stops: [
          { name: 'Capital Airport', arr: '--', dep: '10:00 AM', platform: 'Gate C4', stay: '--' },
          { name: 'Regional Airport', arr: '11:15 AM', dep: '--', platform: '--', stay: '--' }
        ],
        fares: { economy: '$99.00', business: '$199.00', executive: '$320.00' },
        schedules: ['08:00', '10:00', '13:30', '17:00'],
        mapQuery: 'International+Airport+Terminal',
        speed: '800 km/h',
        amenities: { wifi: false, plugs: true, food: true, restroom: true, ac: true },
        image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80'
      }
    }
  };

  // Get selected transit data based on country and key
  const getSelectedTransitData = (key) => {
    const cKey = selectedCountryKey.toLowerCase();
    const data = countryTransitDb[cKey] || countryTransitDb['default'];
    return data[key] || countryTransitDb['default'][key];
  }; // 'country' | 'continent'

  // Visa requirements states
  const [passportCountry, setPassportCountry] = useState('United States');
  const [visaData, setVisaData] = useState({
    requirement: 'Checking requirements...',
    duration: 'N/A',
    color: 'yellow',
    criticalInfo: '',
    checklist: [],
    isLoading: true,
    isLive: false
  });
  
  // REST Countries API disabled (using high-fidelity local/AI generated intelligence)
  const apiLoading = false;
  const apiError = null;
  const dataSource = 'fallback';

  const selectedCountryObj = useMemo(() => {
    return countriesData[selectedCountryKey] || countriesData.switzerland;
  }, [selectedCountryKey]);

  useEffect(() => {
    let active = true;
    async function loadVisa() {
      setVisaData(prev => ({ ...prev, isLoading: true }));
      try {
        const destName = selectedCountryObj?.name || 'Switzerland';
        const todayStr = new Date().toISOString().split('T')[0];
        const res = await fetchLiveVisaRequirement(passportCountry, destName, todayStr);
        if (active) {
          setVisaData({
            requirement: res.visa.requirement,
            duration: res.visa.duration,
            color: res.visa.color,
            criticalInfo: res.visa.criticalInfo,
            checklist: res.visa.checklist || simulateVisaRequirement(passportCountry, destName).checklist,
            isLoading: false,
            isLive: res.source === 'api' || res.source === 'cache'
          });
        }
      } catch (e) {
        const destName = selectedCountryObj?.name || 'Switzerland';
        const sim = simulateVisaRequirement(passportCountry, destName);
        if (active) {
          setVisaData({
            requirement: sim.requirement,
            duration: sim.duration,
            color: sim.color,
            criticalInfo: sim.criticalInfo,
            checklist: sim.checklist,
            isLoading: false,
            isLive: false
          });
        }
      }
    }
    loadVisa();
    return () => {
      active = false;
    };
  }, [passportCountry, selectedCountryObj]);

  const country = useMemo(() => {
    const localIntell = getCountryIntelligence(selectedCountryKey, isDark);
    return {
      ...localIntell,
      facts: {
        ...localIntell.facts,
        currencyCode: selectedCountryObj.basic?.currency?.code || 'USD',
        currencySymbol: selectedCountryObj.basic?.currency?.symbol || '$',
        currencyName: selectedCountryObj.basic?.currency?.name || 'US Dollar',
        languages: selectedCountryObj.basic?.languages || 'English',
        timezones: selectedCountryObj.basic?.timezones || 'UTC',
        mapLink: `https://www.google.com/maps/place/${encodeURIComponent(selectedCountryObj.name)}`
      },
      dataSource: 'fallback'
    };
  }, [selectedCountryKey, isDark, selectedCountryObj]);

  const activeRate = useMemo(() => {
    const code = selectedCountryObj.basic?.currency?.code || 'USD';
    const norm = code.toUpperCase();
    return liveRates[norm] || selectedCountryObj.basic?.currency?.rate || 1;
  }, [liveRates, selectedCountryObj]);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Active Tab state inside Country View
  const [activeTab, setActiveTab] = useState('essential'); 
  const [lockModalTab, setLockModalTab] = useState(null);
  const [activeReadinessIdx, setActiveReadinessIdx] = useState(0);
  const [checklistState, setChecklistState] = useState([]);

  // Carousel refs and scroll handlers
  const destScrollRef = useRef(null);
  const attrScrollRef = useRef(null);

  const scrollLeft = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  const scrollRight = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };

  const toggleChecklistItem = (id) => {
    setChecklistState(prev => prev.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const handleOpenCityDeepDive = (cityObj) => {
    if (!cityObj) return;
    const enriched = {
      ...cityObj,
      overview: cityObj.overview || `A gorgeous city in ${country.name}, known for its local culture, history, and sights.`,
      population: cityObj.population || '120,000 residents',
      bestTimeToVisit: cityObj.bestTimeToVisit || country.seasons?.peak || 'Spring and Autumn',
      costOfLiving: cityObj.costOfLiving || (country.readiness?.affordability ? `${Math.round(100 - (country.readiness.affordability * 8))}%` : 'Medium'),
      safety: cityObj.safety || (country.readiness?.safety ? `${Math.round(country.readiness.safety * 10)}%` : 'High'),
      history: cityObj.history || `Rich historical heritage spanning centuries, with prominent landmarks in the center.`,
      culture: cityObj.culture || `Warm hospitality, traditional festivals, and active local markets.`,
      attractions: cityObj.attractions || `${cityObj.name} Old Town, Central Plaza, and local nature parks.`,
      foodSpecialties: cityObj.foodSpecialties || `Traditional local cuisine and street food specialties.`,
      transportation: cityObj.transportation || `Highly active bus networks, local taxi fleets, and walkable pedestrian streets.`,
      nearbyDestinations: cityObj.nearbyDestinations || `Other scenic spots across ${country.name}.`
    };
    setActiveCityDeepDive(enriched);
  };

  const { imageUrl: heroImageUrl, loading: heroImageLoading } = usePremiumImage(country.name, country.continent);

  useEffect(() => {
    if (country && country.checklist) {
      setChecklistState(country.checklist.map((item, idx) => ({ ...item, id: idx })));
    }
  }, [selectedCountryKey, country]);
  
  // City Map node hover/select states
  const [selectedCityNode, setSelectedCityNode] = useState(null);
  
  // City Drawer Deep Dive state
  const [activeCityDeepDive, setActiveCityDeepDive] = useState(null);
  
  // Comparison Engine States
  const [compareCountryA, setCompareCountryA] = useState('switzerland');
  const [compareCountryB, setCompareCountryB] = useState('japan');
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Country Explorer Gallery states
  const [showCountryLightbox, setShowCountryLightbox] = useState(false);
  const [countryLightboxImg, setCountryLightboxImg] = useState('');
  const [countrySights, setCountrySights] = useState([]);
  const [countryNature, setCountryNature] = useState([]);
  const [countryCulture, setCountryCulture] = useState([]);
  const [loadingCountryGallery, setLoadingCountryGallery] = useState(false);
  const [galleryFilter, setGalleryFilter] = useState('all');


  useEffect(() => {
    if (activeTab !== 'gallery') return;
    
    const countryName = selectedCountryObj.name;
    const cacheKey = `tripready_country_gal_${selectedCountryKey}`;
    
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed.sights && parsed.sights.length > 0) {
          setCountrySights(parsed.sights);
          setCountryNature(parsed.nature);
          setCountryCulture(parsed.culture);
          return;
        }
      } catch (e) {}
    }

    setLoadingCountryGallery(true);
    let isMounted = true;

    async function fetchCountryImages() {
      const pexelsKey = 'YQYRDVubERjsu4wHacREVKfAJdMBKjsJawtRREAKQQCFyE408pq5oeBw';
      const pixabayKey = '25085477-64457aa3004ffe076ffb1989c';

      async function queryImg(query) {
        try {
          const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=3`, {
            headers: { Authorization: pexelsKey }
          });
          if (res.ok) {
            const data = await res.json();
            if (data.photos && data.photos.length > 0) {
              return data.photos.map(p => p.src.large2x || p.src.large);
            }
          }
        } catch (e) {}
        
        try {
          const pixabayUrl = `https://pixabay.com/api/?key=${pixabayKey}&q=${encodeURIComponent(query.replace(/sights |scenic /g, ''))}&image_type=photo&per_page=3&min_width=1200`;
          const res = await fetch(pixabayUrl);
          if (res.ok) {
            const data = await res.json();
            if (data.hits && data.hits.length > 0) {
              return data.hits.map(h => h.largeImageURL || h.webformatURL);
            }
          }
        } catch (e) {}
        
        return [];
      }

      const sightsImgs = await queryImg(`${countryName} famous landmark sight architecture`);
      const natureImgs = await queryImg(`${countryName} scenic nature landscape mountain`);
      const cultureImgs = await queryImg(`${countryName} traditional food culture market`);

      const fallbackSights = [
        getCityImage(countryName, countryName),
        'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=80',
        'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=80'
      ];
      
      const fallbackNature = [
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80',
        'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200&q=80'
      ];

      const fallbackCulture = [
        'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=1200&q=80',
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80',
        'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=80'
      ];

      const finalSights = sightsImgs.length > 0 ? sightsImgs : fallbackSights;
      const finalNature = natureImgs.length > 0 ? natureImgs : fallbackNature;
      const finalCulture = cultureImgs.length > 0 ? cultureImgs : fallbackCulture;

      if (isMounted) {
        setCountrySights(finalSights);
        setCountryNature(finalNature);
        setCountryCulture(finalCulture);
        localStorage.setItem(cacheKey, JSON.stringify({
          sights: finalSights,
          nature: finalNature,
          culture: finalCulture
        }));
      }
      setLoadingCountryGallery(false);
    }

    fetchCountryImages();

    return () => {
      isMounted = false;
    };
  }, [selectedCountryKey, activeTab, selectedCountryObj.name]);

  // Sort country keys alphabetically by name
  const sortedCountryKeys = useMemo(() => {
    return Object.keys(countriesData).sort((a, b) => {
      const nameA = countriesData[a]?.name || '';
      const nameB = countriesData[b]?.name || '';
      return nameA.localeCompare(nameB);
    });
  }, []);
  
  // Converter States
  const [convertAmount, setConvertAmount] = useState(100);
  const [isConvertingToLocal, setIsConvertingToLocal] = useState(true);



  // Active data mappings (resolved at top of component)
  const continent = continents.find(c => c.id === selectedContinentKey) || continents[0];

  // Suggestions search list
  const getSuggestions = () => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    const suggestions = [];

    if (!hasSelection) {
      if (searchTab === 'country') {
        // Check countries only
        Object.keys(countriesData).forEach(key => {
          const c = countriesData[key];
          if (c.name.toLowerCase().includes(query) || c.continent.toLowerCase().includes(query)) {
            suggestions.push({ type: 'country', name: c.name, key, flag: c.flag, subtitle: c.continent });
          }
        });
      } else {
        // Check continents only
        continents.forEach(c => {
          if (c.name.toLowerCase().includes(query)) {
            suggestions.push({ type: 'continent', name: c.name, key: c.id, flag: '🌍', subtitle: 'Continent' });
          }
        });
      }
    } else {
      // In details view, the search box searches for both
      Object.keys(countriesData).forEach(key => {
        const c = countriesData[key];
        if (c.name.toLowerCase().includes(query) || c.continent.toLowerCase().includes(query)) {
          suggestions.push({ type: 'country', name: c.name, key, flag: c.flag, subtitle: c.continent });
        }
      });
      continents.forEach(c => {
        if (c.name.toLowerCase().includes(query)) {
          suggestions.push({ type: 'continent', name: c.name, key: c.id, flag: '🌍', subtitle: 'Continent' });
        }
      });
    }

    return suggestions;
  };

  const handleSuggestionClick = (item) => {
    if (item.type === 'country') {
      setSelectedCountryKey(item.key);
      setExplorerMode('country');
      setActiveTab('essential');
      setSelectedCityNode(null);
    } else {
      setSelectedContinentKey(item.key);
      setExplorerMode('continent');
    }
    setSearchQuery('');
    setShowSuggestions(false);
    setHasSelection(true);
  };

  // Convert Currency utility
  const getConvertedCurrency = () => {
    if (isConvertingToLocal) {
      return (convertAmount * activeRate).toFixed(2);
    } else {
      return (convertAmount / activeRate).toFixed(2);
    }
  };

  const cities = getCitiesForCountry(selectedCountryKey, selectedCountryObj.basic.capital);

  // Compute all pairwise distances and travel estimates dynamically (Requirement 5 - JSON output structure)
  const countryDataEngine = useMemo(() => {
    const distances = [];
    for (let i = 0; i < cities.length; i++) {
      for (let j = i + 1; j < cities.length; j++) {
        const fromCity = cities[i];
        const toCity = cities[j];
        const estimates = getTravelEstimates(fromCity, toCity);
        distances.push({
          from: fromCity.name,
          to: toCity.name,
          distance_km: estimates.distance_km,
          travel_time_road: estimates.travel_time_road,
          travel_time_train: estimates.travel_time_train,
          travel_time_flight: estimates.travel_time_flight
        });
      }
    }
    return {
      country: country.name,
      cities: cities,
      distances: distances
    };
  }, [selectedCountryKey, country.name, cities]);

  const filteredImages = useMemo(() => {
    const images = [];
    if (galleryFilter === 'all' || galleryFilter === 'cities' || galleryFilter === 'attractions') {
      countrySights.forEach((url, i) => images.push({ url, category: i === 0 ? 'Cities' : 'Attractions' }));
    }
    if (galleryFilter === 'all' || galleryFilter === 'nature' || galleryFilter === 'mountains') {
      countryNature.forEach((url, i) => images.push({ url, category: i === 0 ? 'Nature' : 'Mountains' }));
    }
    if (galleryFilter === 'all' || galleryFilter === 'food' || galleryFilter === 'culture' || galleryFilter === 'festivals' || galleryFilter === 'nightlife') {
      countryCulture.forEach((url, i) => images.push({ url, category: i === 0 ? 'Food' : i === 1 ? 'Culture' : 'Festivals' }));
    }
    return images;
  }, [galleryFilter, countrySights, countryNature, countryCulture]);

  // Fallback procedural SVG mapping (Requirement 4 - Graceful degradation)
  const mapData = useMemo(() => {
    const activeCities = countryDataEngine.cities;
    if (!activeCities || activeCities.length === 0) return { path: '', cities: [], routes: [] };
    
    const lats = activeCities.map(c => c.lat);
    const lngs = activeCities.map(c => c.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    
    const latSpan = maxLat - minLat || 1;
    const lngSpan = maxLng - minLng || 1;
    
    const mappedCities = activeCities.map(city => {
      // Map coordinates beautifully to a padded 100x100 SVG viewport grid
      const y = 80 - ((city.lat - minLat) / latSpan) * 60;
      const x = 20 + ((city.lng - minLng) / lngSpan) * 60;
      return {
        name: city.name,
        x: Math.round(x),
        y: Math.round(y),
        type: city.type,
        desc: `${city.type.toUpperCase()} node on fallback overlay.`
      };
    });
    
    // Create an enclosing boundary path for the fallback shape
    const path = mappedCities.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x},${c.y}`).join(' ') + ' Z';
    
    // Build fallback route paths
    const routes = [];
    for (let i = 0; i < mappedCities.length; i++) {
      for (let j = i + 1; j < mappedCities.length; j++) {
        const c1 = mappedCities[i];
        const c2 = mappedCities[j];
        const distData = countryDataEngine.distances.find(d => 
          (d.from === c1.name && d.to === c2.name) || (d.from === c2.name && d.to === c1.name)
        );
        
        // Dynamic Curved Bezier Math
        const mx = (c1.x + c2.x) / 2;
        const my = (c1.y + c2.y) / 2;
        const dx = c2.x - c1.x;
        const dy = c2.y - c1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const offset = Math.min(18, dist * 0.15); // arched path offset
        const theta = Math.atan2(dy, dx);
        const cx = mx - offset * Math.sin(theta);
        const cy = my + offset * Math.cos(theta);
        
        routes.push({
          from: c1.name,
          to: c2.name,
          d: `M ${c1.x},${c1.y} Q ${cx},${cy} ${c2.x},${c2.y}`,
          straightD: `M ${c1.x},${c1.y} L ${c2.x},${c2.y}`,
          distance: distData ? `${distData.distance_km} km` : 'N/A',
          time: distData ? distData.travel_time_road : 'N/A'
        });
      }
    }
    
    return { path, cities: mappedCities, routes };
  }, [countryDataEngine]);

  const worldMapDots = useMemo(() => {
    if (!cities || cities.length === 0) return [];
    const capital = cities.find(c => c.type === 'capital') || cities[0];
    const others = cities.filter(c => c.name !== capital.name);
    if (others.length === 0) {
      return [{
        start: { lat: capital.lat, lng: capital.lng, label: capital.name },
        end: { lat: capital.lat, lng: capital.lng, label: capital.name }
      }];
    }
    return others.map(city => ({
      start: { lat: capital.lat, lng: capital.lng, label: capital.name },
      end: { lat: city.lat, lng: city.lng, label: city.name }
    }));
  }, [cities]);

  // Set default city focusing node to the country's capital upon switching countries
  useEffect(() => {
    const activeCities = countryDataEngine.cities;
    if (activeCities && activeCities.length > 0) {
      const capital = activeCities.find(c => c.type === 'capital') || activeCities[0];
      setSelectedCityNode(capital.name);
    } else {
      setSelectedCityNode(null);
    }
  }, [selectedCountryKey, countryDataEngine.cities]);

  // Selected active city profile detail
  const activeCity = cities.find(c => c.name === selectedCityNode) || cities[0];

  // All countries in active continent
  const continentCountries = Object.values(countriesData).filter(
    c => c.continent.toLowerCase() === selectedContinentKey
  );

  return (
    <div className={`min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] relative pb-20 overflow-x-hidden font-body transition-colors duration-500 ${hasSelection && explorerMode !== 'country' ? 'pt-24' : 'pt-0'}`}>
      
      {/* Dynamic ambient grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(99,102,241,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-[300px] rounded-full bg-[var(--accent)]/[0.02] dark:bg-[var(--accent)]/[0.04] filter blur-[120px] pointer-events-none overflow-hidden z-0" />

      {!hasSelection ? (
        <div className="w-full flex flex-col">
          {/* Reconstructed Hero Section with Full-Bleed Taj Mahal Background */}
          <div 
            className="w-full relative min-h-[460px] sm:min-h-[500px] md:min-h-[560px] flex items-center bg-cover bg-center pt-28 pb-16 overflow-visible transition-all duration-700"
            style={{ backgroundImage: isDark ? "url('/images/taj-mahal-dark.jpg')" : "url('/images/taj-mahal.jpg')" }}
          >
            {/* Gradient overlays for ultimate text readability and dark-mode blending */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/98 via-white/80 to-transparent dark:from-slate-950/95 dark:via-slate-950/60 dark:to-transparent z-0 pointer-events-none" />
            <div className="absolute inset-0 bg-white/5 dark:bg-black/10 z-0 pointer-events-none" />
            
            {/* Text Overlay container aligned with site grid */}
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col justify-center text-left">
              <div className="max-w-xl space-y-6">
                <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] font-bold text-slate-500 dark:text-[var(--accent)] block font-heading">
                  Explore Travel Guides
                </span>
                
                <h1 className="font-heading select-none leading-none">
                  <span className="font-normal text-slate-800 dark:text-slate-100 text-2xl sm:text-3xl md:text-4.5xl tracking-tight mb-1 block">
                    Hey Buddy! where are you
                  </span>
                  <span className="font-light italic text-slate-900 dark:text-white text-4xl sm:text-5.5xl md:text-6.5xl tracking-tight block pb-1">
                    traveling to?
                  </span>
                </h1>
                
                <p className="text-xs sm:text-sm md:text-base text-slate-650 dark:text-slate-200 font-light leading-relaxed max-w-md">
                  Discover local details, interactive maps, regional facts, and helpful country guides.
                </p>

                <div className="pt-2">
                  <button 
                    onClick={() => {
                      document.getElementById('popular-destinations')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-2 text-xs font-bold text-[var(--accent)] hover:text-indigo-500 hover:translate-x-1 transition-all group cursor-pointer"
                  >
                    <span>Explore Now</span>
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Search Widget Overlapping Hero Bottom */}
          <div className="relative z-20 -mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-left">
            
            {/* Active Tab Selectors */}
            <div className="flex gap-1 items-end relative z-30">
              {[
                { id: 'country', label: 'Country', icon: Globe },
                { id: 'continent', label: 'Continent', icon: Compass }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = searchTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setSearchTab(tab.id);
                      setSearchQuery('');
                      setShowSuggestions(false);
                    }}
                    className={`flex items-center gap-2 px-6 py-3.5 rounded-t-2xl text-[11px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer relative top-[1px] ${
                      isActive
                        ? 'bg-white dark:bg-slate-900 text-[var(--accent)] border-t border-x border-[var(--border)] z-30 font-extrabold shadow-[0_-4px_12px_rgba(0,0,0,0.02)]'
                        : 'bg-slate-100/90 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border-t border-x border-transparent hover:text-slate-800 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 z-10'
                    }`}
                  >
                    <Icon size={13} className={isActive ? 'text-[var(--accent)]' : 'text-slate-400'} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Search Box Card */}
            <div className="relative z-20 flex items-center px-6 py-4 border border-[var(--border)] focus-within:ring-2 focus-within:ring-[var(--accent)]/30 focus-within:border-[var(--accent)]/40 transition-all duration-300 rounded-b-3xl rounded-r-3xl rounded-tl-none shadow-xl max-w-2xl bg-white dark:bg-slate-900">
              <Search className="w-4 h-4 text-slate-500 mr-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder={
                  searchTab === 'country'
                    ? "Search country (e.g. Pakistan, Switzerland, Italy)..."
                    : "Search continent (e.g. Europe, Asia, Africa)..."
                }
                className="w-full bg-transparent text-xs sm:text-sm text-[var(--text-primary)] placeholder-slate-455 focus:outline-none py-1.5 font-light"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 text-slate-550 mr-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Suggestions autocomplete dropdown */}
            {showSuggestions && getSuggestions().length > 0 && (
              <div className="absolute top-[105%] left-4 right-4 sm:left-6 sm:right-6 md:left-8 md:right-8 mt-1 max-w-2xl rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] shadow-premium overflow-hidden z-50 animate-fade-in text-left">
                {getSuggestions().map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(item)}
                    className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-[var(--accent)]/[0.04] transition-colors border-b border-[var(--border)] last:border-0 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      {item.type === 'country' ? (
                        <img 
                          src={getFlagUrl(item.key, item.flag)} 
                          alt={`${item.name} flag`} 
                          className="w-8 h-5.5 object-cover rounded-md border border-slate-200/50 dark:border-white/10 shrink-0" 
                        />
                      ) : (
                        <span className="text-base leading-none">{item.flag}</span>
                      )}
                      <div className="flex flex-col leading-tight">
                        <span className="text-xs font-bold text-[var(--text-primary)]">{item.name}</span>
                        <span className="text-[9px] text-slate-400 font-light">{item.subtitle}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                ))}
              </div>
            )}

            {showSuggestions && searchQuery.trim() && getSuggestions().length === 0 && (
              <div className="absolute top-[105%] left-4 right-4 sm:left-6 sm:right-6 md:left-8 md:right-8 mt-1 max-w-2xl p-4 text-center rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] shadow-premium z-50 text-xs text-slate-455">
                No matching {searchTab} found.
              </div>
            )}
          </div>

          {/* Popular Destinations Cards */}
          <div id="popular-destinations" className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-24 space-y-6 text-left">
            <div className="flex justify-between items-end border-b border-[var(--border)] pb-4">
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold font-mono">CURATED CHOICE</span>
                <h3 className="text-xl sm:text-2xl font-black font-heading text-slate-900 dark:text-white">Popular Destinations</h3>
              </div>
              <span className="text-2xs font-bold uppercase tracking-wider text-[var(--accent)] font-heading">
                Top 3 Picked Countries
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { key: 'switzerland', name: 'Switzerland', desc: 'Alpine peaks, stunning lakes, and timeless villages.', image: '/images/card-switzerland.jpg' },
                { key: 'france', name: 'France', desc: 'Artistic heritage, world-class gastronomy, and romantic views.', image: '/images/card-france.jpg' },
                { key: 'italy', name: 'Italy', desc: 'Ancient monuments, pristine coastlines, and vibrant culture.', image: '/images/card-italy.jpg' }
              ].map((dest) => (
                <div 
                  key={dest.key}
                  onClick={() => {
                    setSelectedCountryKey(dest.key);
                    setExplorerMode('country');
                    setActiveTab('essential');
                    setSelectedCityNode(null);
                    setHasSelection(true);
                  }}
                  className="group relative overflow-hidden rounded-[24px] border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm hover:border-[var(--accent)]/30 hover:-translate-y-1.5 hover:shadow-[0_16px_48px_rgba(30,64,175,0.08)] dark:hover:shadow-[0_16px_48px_rgba(46,91,255,0.12)] transition-all duration-500 flex flex-col justify-between cursor-pointer h-60"
                >
                  <div className="absolute inset-0 z-0">
                    <img
                      src={dest.image}
                      alt={`${dest.name} landscape`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.08]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/30 to-transparent pointer-events-none" />
                  </div>

                  <div className="relative z-10 p-5 mt-auto text-left space-y-1">
                    <div className="flex items-center gap-2">
                      <img 
                        src={getFlagUrl(dest.key, countriesData[dest.key]?.flag)} 
                        alt={`${dest.name} flag`} 
                        className="w-5.5 h-3.5 object-cover rounded shadow-sm border border-white/20"
                      />
                      <h4 className="text-base sm:text-lg font-black text-white font-heading drop-shadow-md leading-tight">{dest.name}</h4>
                    </div>
                    <p className="text-[10px] text-slate-200/90 font-light leading-snug drop-shadow-xs">{dest.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full relative z-10 flex flex-col pt-0">
          
          {/* Suggestions overlay */}
          {showSuggestions && (
            <div className="fixed inset-0 z-30" onClick={() => setShowSuggestions(false)} />
          )}

          {/* ── Mode 1: CONTINENT EXPLORER DASHBOARD ────────────────────────── */}
          {hasSelection && explorerMode === 'continent' && (
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in text-left">
              
              {/* Top Navigation Row in Continent View */}
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                <button 
                  onClick={() => {
                    setHasSelection(false);
                    setSearchQuery('');
                    setShowSuggestions(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-[var(--border)] hover:border-slate-350 hover:scale-[1.01] active:scale-[0.99]"
                >
                  <ArrowLeftRight size={13} className="rotate-180 text-[var(--accent)]" />
                  <span>Back to Explorer</span>
                </button>
                
                {/* Smaller search bar in continent details view */}
                <div className="relative max-w-xs w-full">
                  <div className="glass-card flex items-center px-3.5 py-1.5 border border-[var(--border)] focus-within:ring-2 focus-within:ring-[var(--accent)]/40 transition-all rounded-full bg-white dark:bg-slate-900 shadow-sm">
                    <Search className="w-3.5 h-3.5 text-slate-555 mr-2 shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      placeholder="Search country or continent..."
                      className="w-full bg-transparent text-[11px] text-[var(--text-primary)] placeholder-slate-455 focus:outline-none py-0.5 font-light"
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 text-slate-555 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  
                  {/* Autocomplete list */}
                  {showSuggestions && getSuggestions().length > 0 && (
                    <div className="absolute top-[105%] right-0 w-64 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] shadow-premium overflow-hidden z-50 animate-fade-in text-left">
                      {getSuggestions().map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSuggestionClick(item)}
                          className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-[var(--accent)]/[0.04] transition-colors border-b border-[var(--border)] last:border-0 cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            {item.type === 'country' ? (
                              <img 
                                src={getFlagUrl(item.key, item.flag)} 
                                alt="" 
                                className="w-5.5 h-3.5 object-cover rounded-sm shadow-xs border border-slate-100 dark:border-white/[0.05]" 
                              />
                            ) : (
                              <span className="text-sm">{item.flag}</span>
                            )}
                            <div className="flex flex-col leading-tight">
                              <span className="text-[10px] font-bold text-[var(--text-primary)]">{item.name}</span>
                              <span className="text-[8px] text-slate-400 font-light">{item.subtitle}</span>
                            </div>
                          </div>
                          <ChevronRight className="w-3 text-slate-400" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-12 gap-8">            
            {/* Continent selection side panel */}
            <div className="col-span-12 md:col-span-4 space-y-3">
              <h3 className="text-xs uppercase tracking-widest font-extrabold text-slate-500 mb-4 px-1 leading-none font-heading">SELECT REGION</h3>
              {continents.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedContinentKey(item.id)}
                  className={`w-full glass-card p-5 border text-left flex items-center justify-between group transition-all duration-300 cursor-pointer hover:-translate-y-0.5 ${
                    selectedContinentKey === item.id 
                      ? 'border-[var(--accent)] bg-[var(--accent)]/[0.02] dark:bg-[var(--accent)]/[0.04] shadow-premium font-bold' 
                      : 'border-[var(--border)] hover:border-slate-350 dark:hover:border-white/10 bg-white/20 dark:bg-white/[0.01]'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold block">{item.area} Landmass</span>
                    <span className={`text-sm font-extrabold ${selectedContinentKey === item.id ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'}`}>
                      {item.name}
                    </span>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform ${selectedContinentKey === item.id ? 'text-[var(--accent)]' : ''}`} />
                </button>
              ))}
            </div>

            {/* Continent Detail OS View */}
            <div className="col-span-12 md:col-span-8 glass-card p-6 sm:p-8 space-y-8 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 to-[var(--accent)]" />
              
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-[var(--accent)] font-bold font-heading">CONTINENT DETAILS</span>
                    <h2 className="text-2xl font-black font-heading text-[var(--text-primary)]">{continent.name} Overview</h2>
                  </div>
                  <span className="text-5xl opacity-40 select-none">🌍</span>
                </div>

                <p className="text-sm font-light text-slate-550 dark:text-slate-300 leading-relaxed font-body">
                  {continent.overview}
                </p>

                {/* KPI Metrics row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Countries', val: `${continentCountries.length} Nations`, unit: 'Sovers', icon: Compass },
                    { label: 'Population Share', val: continent.population, unit: 'People Scale', icon: Users },
                    { label: 'Economic share', val: continent.gdpShare, unit: 'Global GDP', icon: TrendingUp },
                    { label: 'Principal Tongues', val: continent.languages.split(',').length, unit: 'Languages', icon: BookOpen }
                  ].map((kpi, idx) => {
                    const Icon = kpi.icon;
                    return (
                      <div key={idx} className="bg-[var(--bg-secondary)] border border-[var(--border)] p-4 rounded-2xl space-y-1 hover:border-[var(--accent)]/15 transition-all duration-300">
                        <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-slate-500 font-bold">
                          <Icon className="w-3.5 h-3.5 text-slate-550" />
                          <span>{kpi.label}</span>
                        </div>
                        <span className="text-lg font-extrabold text-[var(--text-primary)] block leading-tight">{kpi.val}</span>
                        <span className="text-[9px] font-mono text-slate-400 font-light block leading-none">{kpi.unit}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                  {/* Circular SVG Area chart */}
                  <div className="bg-[var(--bg-secondary)] p-5 border border-[var(--border)] rounded-2xl flex flex-col justify-between">
                    <span className="text-[9.5px] uppercase tracking-widest text-slate-500 font-extrabold mb-3 block font-heading">Global Land Share</span>
                    
                    <div className="relative w-28 h-28 mx-auto flex items-center justify-center my-2">
                      <div className="absolute text-center leading-none">
                        <span className="text-lg font-extrabold text-[var(--text-primary)]">{continent.landAreaShare}</span>
                        <span className="block text-[7px] font-mono text-slate-500 mt-0.5">OF GLOBAL</span>
                      </div>
                      
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" stroke="var(--border)" strokeWidth="8" fill="transparent" className="opacity-40" />
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="42" 
                          stroke="var(--accent)" 
                          strokeWidth="8" 
                          fill="transparent" 
                          strokeDasharray="264" 
                          strokeDashoffset={264 - (264 * parseFloat(continent.landAreaShare)) / 100}
                          strokeLinecap="round"
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Bullet points overview list */}
                  <div className="bg-[var(--bg-secondary)] p-5 border border-[var(--border)] rounded-2xl text-left space-y-4">
                    <span className="text-[9.5px] uppercase tracking-widest text-slate-500 font-extrabold block font-heading">Flagship Geographical Notes</span>
                    <ul className="space-y-3">
                      {continent.quickFacts.map((fact, fidx) => (
                        <li key={fidx} className="flex gap-2.5 items-start text-xs font-light text-slate-550 dark:text-slate-300 leading-relaxed font-body">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-1.5 shrink-0" />
                          <span>{fact}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* ── Continent Countries Directory Grid (Requirement 5 - Image 4) ── */}
                <div className="pt-6 border-t border-[var(--border)] space-y-4 text-left">
                  <div className="flex justify-between items-center">
                    <span className="text-xs uppercase font-extrabold tracking-widest text-slate-550 dark:text-slate-400 font-heading">
                      Countries in {continent.name} Directory ({continentCountries.length})
                    </span>
                    <span className="text-[10px] font-mono text-[var(--accent)] font-bold">Select any to inspect details</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-60 overflow-y-auto pr-2 scrollbar-thin">
                    {continentCountries.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setSelectedCountryKey(c.id);
                          setExplorerMode('country');
                          setActiveTab('essential');
                          setSelectedCityNode(null);
                        }}
                        className="p-2.5 rounded-xl border border-[var(--border)] bg-white/40 dark:bg-white/[0.01] hover:border-[var(--accent)]/30 hover:bg-[var(--accent)]/[0.02] dark:hover:bg-[var(--accent)]/[0.04] flex items-center gap-2 transition-all duration-200 text-left cursor-pointer group hover:-translate-y-0.5 shadow-4xs"
                      >
                        <img 
                          src={getFlagUrl(c.id, c.flag)} 
                          alt={`${c.name} flag`} 
                          className="w-8 h-5.5 object-cover rounded border border-slate-200/50 dark:border-white/10 shrink-0 select-none transition-transform group-hover:scale-105" 
                        />
                        <div className="flex flex-col min-w-0">
                          <span className="text-[10px] font-extrabold text-[var(--text-primary)] truncate group-hover:text-[var(--accent)] transition-colors leading-tight">{c.name}</span>
                          <span className="text-[8px] text-slate-400 truncate leading-none mt-0.5">Cap: {c.basic.capital}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

        {/* ── Mode 2: COUNTRY INFORMATION DASHBOARD ────────────────── */}
        {hasSelection && explorerMode === 'country' && (
          <div className="w-full flex flex-col animate-fade-in text-left">
            
            {/* Full-Bleed Country Hero Background extending behind navbar */}
            <div 
              className="w-full relative min-h-[520px] sm:min-h-[585px] md:min-h-[630px] flex items-center bg-cover bg-center overflow-visible -mt-24 pt-24"
              style={{ backgroundImage: `url('${heroImageUrl || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=80'}')` }}
            >
              {/* Premium subtle gradient overlays to blend header and bottom section */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-[var(--bg-primary)] z-0 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/40 to-transparent z-0 pointer-events-none" />

              {/* Main Content Container aligned with site grid */}
              <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col justify-between pt-32 pb-12 min-h-[420px]">
                
                {/* Top buttons overlay sitting cleanly on top of banner */}
                <div className="w-full flex items-center justify-between z-20 mb-8 sm:mb-12">
                  <button 
                    onClick={() => {
                      setHasSelection(false);
                      setSearchQuery('');
                      setShowSuggestions(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-black/40 hover:bg-black/55 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 transition-all border border-white/10 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                  >
                    <ArrowLeftRight size={13} className="rotate-180 text-[var(--accent)]" />
                    <span>Back to Explorer</span>
                  </button>
                  
                  {/* Smaller search bar in details view */}
                  <div className="relative max-w-xs w-full">
                    <div className="flex items-center px-3.5 py-1.5 border border-white/10 focus-within:ring-2 focus-within:ring-[var(--accent)]/45 transition-all rounded-full bg-black/40 backdrop-blur-md shadow-sm">
                      <Search className="w-3.5 h-3.5 text-white/70 mr-2 shrink-0" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        placeholder="Search country..."
                        className="w-full bg-transparent text-[11px] text-white placeholder-white/40 focus:outline-none py-0.5 font-light"
                      />
                      {searchQuery && (
                        <button 
                          onClick={() => setSearchQuery('')}
                          className="p-1 rounded-full hover:bg-white/10 text-white cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    
                    {/* Suggestions list */}
                    {showSuggestions && getSuggestions().length > 0 && (
                      <div className="absolute top-[105%] right-0 w-64 rounded-2xl bg-slate-950/95 backdrop-blur-xl border border-white/10 shadow-premium overflow-hidden z-50 animate-fade-in text-left">
                        {getSuggestions().map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSuggestionClick(item)}
                            className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 cursor-pointer"
                          >
                            <div className="flex items-center gap-2.5">
                              {item.type === 'country' ? (
                                <img 
                                  src={getFlagUrl(item.key, item.flag)} 
                                  alt="" 
                                  className="w-7 h-4.5 object-cover rounded border border-white/10 shrink-0" 
                                />
                              ) : (
                                <span className="text-sm">{item.flag}</span>
                              )}
                              <div className="flex flex-col leading-tight">
                                <span className="text-[10px] font-bold text-white">{item.name}</span>
                                <span className="text-[8px] text-white/60 font-light">{item.subtitle}</span>
                              </div>
                            </div>
                            <ChevronRight className="w-3 text-white/60" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Grid layout with Floating Liquid Glassmorphic Info Card */}
                <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mt-16">
                  <div className="lg:col-span-6 hidden lg:block" /> {/* Left side empty to let country landscape photo be 100% visible */}
                  
                                    {/* Right side Liquid Glass Container Card */}
                  <div className="col-span-12 lg:col-span-6 relative group z-10">
                    {/* Dynamic backdrop reflection/glow overlay */}
                    <div className="absolute -inset-4 bg-gradient-to-tr from-[var(--accent)]/15 via-indigo-500/5 to-transparent rounded-[44px] blur-2xl opacity-80 pointer-events-none z-0" />
                    
                    <div className="relative z-10 bg-slate-950/35 dark:bg-black/40 backdrop-blur-[40px] border border-white/[0.16] dark:border-white/[0.08] p-6 sm:p-8 rounded-[36px] shadow-[0_32px_80px_rgba(0,0,0,0.5)] flex flex-col justify-between space-y-6 text-left overflow-hidden animate-scale-in">
                      {/* Frosted diagonal glass shine overlay */}
                      <div className="absolute -top-[150%] -left-[50%] w-[200%] h-[200%] bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent rotate-45 pointer-events-none" />

                      {/* Header information */}
                      <div className="space-y-4 relative z-10">
                        <div className="flex items-center gap-3">
                          <img 
                            src={country.flagImgUrl || getFlagUrl(country.id, country.flag)} 
                            alt="" 
                            className="w-10 h-7 object-cover rounded shadow border border-white/10 select-none shrink-0"
                          />
                          <span className="text-[10px] bg-white/10 border border-white/10 px-3 py-1 rounded-full font-bold uppercase tracking-wider text-slate-200 leading-none">
                            {country.continent}
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h2 className="font-heading text-3xl sm:text-4xl md:text-4.5xl font-black tracking-tight text-white leading-tight drop-shadow-md">
                              {country.name}
                            </h2>
                            <button
                              onClick={(e) => toggleFavorite(selectedCountryKey, country.name, 'country', e)}
                              className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-300 shrink-0 ${isFavorite(selectedCountryKey, 'country') ? 'bg-red-500/80 border border-red-400/50 shadow-lg shadow-red-500/25' : 'bg-white/10 border border-white/15 hover:bg-white/20 hover:border-white/25'}`}
                              title={isFavorite(selectedCountryKey, 'country') ? 'Remove from favorites' : 'Add to favorites'}
                            >
                              <Heart className={`w-4.5 h-4.5 transition-all duration-300 ${isFavorite(selectedCountryKey, 'country') ? 'text-white fill-white scale-110' : 'text-white/80'}`} />
                            </button>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-200 font-light leading-relaxed max-w-xl">
                            {country.overview}
                          </p>
                        </div>
                      </div>

                      {/* Quick Stats Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 pt-4 border-t border-white/10 relative z-10">
                        {[
                          { label: 'Safety Score', value: `${country.safety?.score || 'N/A'}/10`, icon: Shield, color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/20' },
                          { label: 'Visa Entry', value: visaData.isLoading ? 'Checking...' : (visaData.requirement?.split(' ')?.[0] || 'Visa Free'), icon: FileText, color: 'text-blue-400 bg-blue-500/20 border-blue-500/20' },
                          { label: 'Daily Budget', value: `$${country.budget?.midRangeDaily || '150-250'}`, icon: DollarSign, color: 'text-amber-400 bg-amber-500/20 border-amber-500/20' },
                          { label: 'Best Season', value: country.seasons?.peak?.split(' ')?.[0] || 'Summer', icon: Calendar, color: 'text-purple-400 bg-purple-500/20 border-purple-500/20' },
                          { label: 'Main Language', value: country.facts?.languages?.split(',')?.[0]?.trim() || 'English', icon: Globe, color: 'text-indigo-400 bg-indigo-500/20 border-indigo-500/20' },
                          { label: 'Currency', value: `${country.facts?.currencyCode || 'USD'} (${country.facts?.currencySymbol || '$'})`, icon: Coins, color: 'text-pink-400 bg-pink-500/20 border-pink-500/20' }
                        ].map((stat, idx) => {
                          const StatIcon = stat.icon;
                          return (
                            <div key={idx} className="bg-white/[0.04] dark:bg-white/[0.015] border border-white/[0.08] hover:bg-white/[0.08] dark:hover:bg-white/[0.04] p-3 rounded-2xl space-y-1.5 hover:scale-[1.02] hover:border-white/[0.15] hover:shadow-[0_8px_20px_rgba(0,0,0,0.2)] transition-all duration-300 cursor-pointer">
                              <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-slate-300 font-bold font-mono">
                                <div className={"p-1 rounded-md " + stat.color + " shrink-0 border"}>
                                  <StatIcon size={10} />
                                </div>
                                <span className="truncate">{stat.label}</span>
                              </div>
                              <span className="text-xs font-extrabold text-white block leading-tight truncate pl-1">{stat.value}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-2.5 pt-4 border-t border-white/10">
                      <button
                        onClick={() => navigate(`/ai-trip-planner?country=${country.name}`)}
                        className="flex-1 px-4 py-3 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-md hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                      >
                        <Compass size={14} />
                        <span>Plan Trip</span>
                      </button>
                      <button
                        onClick={() => navigate(`/budget-planner?country=${country.name}`)}
                        className="flex-1 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                      >
                        <DollarSign size={14} />
                        <span>Budget</span>
                      </button>
                      <button
                        onClick={() => {
                          const slug = country.name.toLowerCase().replace(/ /g, '-');
                          navigate(`/country/${slug}`);
                        }}
                        className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                        title="Full Directory Guide"
                      >
                        <Globe size={14} />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Lower Section (Tabs Workspace Grid Container) */}
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 relative z-10 space-y-12">
            
            {/* 11-Tab panel Workspace Grid Layout */}
            <div className="grid grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Tab workspace panel */}
              <div className="col-span-12 lg:col-span-8 space-y-6">
                
                {/* Modern Glassmorphic Sticky Tab Navigation */}
                <div className="sticky top-20 z-30 transition-all duration-300">
                  <div className="relative bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/60 dark:border-white/[0.08] rounded-2xl p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden">
                    {/* Subtle top glow accent */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)]/40 to-transparent" />
                    
                    {/* Premium edge fade gradient overlays (only at edges, no white overlay in dark mode) */}
                    <div className="absolute left-0 top-0 bottom-0 w-5 bg-gradient-to-r from-white to-transparent dark:from-slate-900 z-20 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-5 bg-gradient-to-l from-white to-transparent dark:from-slate-900 z-20 pointer-events-none" />
                    
                    <div className="flex items-center overflow-x-auto no-scrollbar gap-1 scroll-smooth select-none scrollbar-none touch-pan-x">
                      {[
                        { id: 'essential', label: 'Essential', icon: Info },
                        { id: 'destinations', label: 'Destinations', icon: Map },
                        { id: 'attractions', label: 'Attractions', icon: Compass },
                        { id: 'budget', label: 'Budget', icon: DollarSign },
                        { id: 'transit', label: 'Transport', icon: Car },
                        { id: 'weather', label: 'Weather', icon: Calendar },
                        { id: 'dining', label: 'Dining', icon: UtensilsCrossed },
                        { id: 'culture', label: 'Culture', icon: Milestone },
                        { id: 'connectivity', label: 'Connect', icon: Wifi },
                        { id: 'gallery', label: 'Gallery', icon: Camera },
                        { id: 'facts', label: 'Facts', icon: Globe }
                      ].map((tab) => {
                        const TabIcon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => {
                              const isLockedTab = ['budget', 'transit', 'weather', 'dining', 'culture', 'connectivity', 'gallery', 'facts'].includes(tab.id);
                              if (!user && isLockedTab) {
                                setLockModalTab(tab.label);
                              } else {
                                setActiveTab(tab.id);
                              }
                            }}
                            className={`relative px-3.5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider whitespace-nowrap flex items-center gap-1.5 transition-all duration-300 cursor-pointer shrink-0 ${
                              isActive
                                ? 'bg-[var(--accent)] text-white shadow-[0_2px_12px_rgba(30,64,175,0.3)] dark:shadow-[0_2px_12px_rgba(46,91,255,0.4)] scale-[1.02] font-extrabold'
                                : 'text-slate-650 hover:text-slate-900 dark:text-slate-350 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-white/[0.06]'
                            }`}
                          >
                            <TabIcon size={13} className={isActive ? 'text-white/90' : 'text-slate-500 dark:text-slate-400'} />
                            <span>{tab.label}</span>
                            {isActive && (
                              <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-white/60 rounded-full" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Tab Content Cards Container */}
                <div className="animate-fade-in text-left">
                  {/* TAB 1: ESSENTIAL TRAVEL INFO */}
                  {activeTab === 'essential' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        
                        {/* Visa Requirements Card (Image 2 style) */}
                        <div className="relative overflow-hidden rounded-2xl border border-slate-200/40 dark:border-white/[0.05] bg-white/60 dark:bg-slate-900/40 backdrop-blur-md p-6 space-y-6 shadow-sm">
                          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />
                          
                          <div className="flex justify-between items-start">
                            <div className="space-y-1 text-left">
                              <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono"><MapPin size={10} className="text-[var(--accent)] inline-block mr-1 -mt-0.5" /> Visa Entry Requirement</span>
                              <h4 className="text-xl font-black font-heading text-[var(--text-primary)] mt-0.5">
                                {visaData.isLoading ? 'Checking Requirements...' : (visaData.requirement || 'Visa Free')}
                              </h4>
                            </div>
                            <div className={"px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5 border " + (
                              visaData.requirement?.toLowerCase().includes('required')
                                ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                : 'bg-emerald-500/10 text-emerald-505 border-emerald-500/20'
                            )}>
                              <span className={"w-1.5 h-1.5 rounded-full " + (visaData.requirement?.toLowerCase().includes('required') ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500 animate-pulse')} />
                              {visaData.requirement?.toLowerCase().includes('required') ? 'Visa Required' : "You're Good"}
                            </div>
                          </div>

                          {/* Passport Selector dropdown */}
                          <div className="space-y-1.5 text-left">
                            <label className="text-[8.5px] uppercase tracking-wider text-slate-400 dark:text-slate-505 font-extrabold font-heading block">Select Passport Nationality</label>
                            <select
                              value={passportCountry}
                              onChange={(e) => setPassportCountry(e.target.value)}
                              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[var(--accent)] font-medium cursor-pointer"
                            >
                              {(allCountriesList || []).map((c) => (
                                <option key={c.code || c.name} value={c.name}>{c.flag || ''} {c.name} Passport</option>
                              ))}
                            </select>
                          </div>

                          {/* Remaining budget style Stay Limit bar (Image 2 style) */}
                          <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-white/[0.015] border border-slate-100 dark:border-white/[0.03] flex items-center justify-between">
                            <div className="space-y-0.5 text-left">
                              <span className="text-[9px] text-slate-400 dark:text-slate-500 font-light block leading-none font-heading">Stay Limit Duration</span>
                              <span className="text-xs font-extrabold text-[var(--text-primary)] block mt-1">Up to 90 Days Stay</span>
                            </div>
                            <div className="w-11 h-11 rounded-full border-2 border-emerald-500/25 flex items-center justify-center bg-emerald-500/5">
                              <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 font-mono">85%</span>
                            </div>
                          </div>

                          {/* Split columns with vertical indicators (Image 2 style) */}
                          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200/40 dark:border-white/[0.04]">
                            <div className="border-l-[3px] border-blue-500 pl-3 space-y-0.5 text-left">
                              <span className="text-[8px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">Processing Time</span>
                              <span className="text-xs font-black text-[var(--text-primary)] block leading-tight">{visaData.isLoading ? '...' : (visaData.processingTime || 'Instant')}</span>
                            </div>
                            <div className="border-l-[3px] border-emerald-500 pl-3 space-y-0.5 text-left">
                              <span className="text-[8px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">Entry Fee Cost</span>
                              <span className="text-xs font-black text-[var(--text-primary)] block leading-tight">{visaData.isLoading ? '...' : (visaData.fee || 'Free')}</span>
                            </div>
                          </div>
                        </div>

                        {/* Safety & Security Card (Card 1, Image 3 & Card 7, Image 5 style) */}
                        <div className="relative overflow-hidden rounded-2xl border border-slate-200/40 dark:border-white/[0.05] bg-white/60 dark:bg-slate-900/40 backdrop-blur-md p-6 space-y-5 shadow-sm">
                          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
                          <div className="flex flex-col items-center justify-center p-4 bg-slate-50/50 dark:bg-white/[0.015] border border-slate-100/80 dark:border-white/[0.03] rounded-2xl relative">
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono absolute top-3.5 left-3.5">Check your score</span>
                            <div className="relative w-36 h-20 flex items-center justify-center mt-3">
                              <svg className="w-full h-full" viewBox="0 0 100 60">
                                {/* Background thin arc */}
                                <path
                                  d="M 10 50 A 40 40 0 0 1 90 50"
                                  fill="none"
                                  stroke="#e2e8f0"
                                  strokeWidth="7"
                                  className="stroke-slate-200/50 dark:stroke-white/[0.04]"
                                  strokeLinecap="round"
                                />
                                {/* Foreground safety indicator arc */}
                                <path
                                  d="M 10 50 A 40 40 0 0 1 90 50"
                                  fill="none"
                                  stroke="#10B981"
                                  strokeWidth="8.5"
                                  strokeDasharray="125.6"
                                  strokeDashoffset={125.6 - (Math.min(10, Math.max(0, country.safety?.score || 8.0)) / 10) * 125.6}
                                  strokeLinecap="round"
                                  className="transition-all duration-1000"
                                />
                              </svg>
                              <div className="absolute bottom-1 flex flex-col items-center justify-center select-none">
                                <span className="text-xl font-black font-heading text-[var(--text-primary)] leading-none">
                                  {parseFloat(country.safety?.score || 8.0).toFixed(1)}
                                </span>
                                <span className="text-[8px] font-bold text-emerald-500 mt-0.5 flex items-center gap-0.5">
                                  ↑ Stable
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Sub progress tracks (Image 5 style) */}
                          <div className="space-y-3 pt-1 text-left">
                            {[
                              { label: 'Solo Traveler Index', val: 85, color: 'bg-blue-500' },
                              { label: 'Family Tourist Security', val: 90, color: 'bg-emerald-500' },
                              { label: 'Women Safety Level', val: 78, color: 'bg-purple-500' },
                              { label: 'Scam & Threat Level', val: 35, color: 'bg-amber-500' }
                            ].map((s, idx) => (
                              <div key={idx} className="space-y-1">
                                <div className="flex justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400 leading-none">
                                  <span>{s.label}</span>
                                  <span className="font-mono text-slate-600 dark:text-slate-350">{s.val}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                                  <div className={"h-full " + s.color + " rounded-full"} style={{ width: s.val + "%" }} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Travel Basics (Credit Report Card style) */}
                        <div className="relative overflow-hidden rounded-2xl border border-slate-200/40 dark:border-white/[0.05] bg-white/60 dark:bg-slate-900/40 backdrop-blur-md p-6 space-y-4 shadow-sm text-left">
                          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-500" />
                          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">Credit report card</span>
                          
                          <div className="space-y-2.5 pt-1">
                            {[
                              { label: 'Currency', val: (country.facts?.currencyCode || selectedCountryObj.basic?.currency?.code || 'USD') + " (" + (country.facts?.currencySymbol || '$') + ")", icon: Coins, bg: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
                              { label: 'Time Zone', val: country.facts?.timezones || country.basics?.timezone || 'UTC+1', icon: Clock, bg: 'bg-emerald-500/10 text-emerald-505 border-emerald-500/20' },
                              { label: 'Power Plug Type', val: country.basics?.plug || 'Type C / G', icon: Wifi, bg: 'bg-amber-500/10 text-amber-505 border-amber-500/20' },
                              { label: 'Emergency Hotline', val: country.basics?.emergency || '112', icon: ShieldAlert, bg: 'bg-rose-500/10 text-rose-500 border-rose-500/20' }
                            ].map((item, idx) => {
                              const IconComp = item.icon;
                              return (
                                <div key={idx} className="p-3 bg-slate-50/50 dark:bg-white/[0.015] border border-slate-100/50 dark:border-white/[0.02] rounded-xl flex items-center justify-between hover:scale-[1.01] transition-transform">
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div className={"w-8 h-8 rounded-full flex items-center justify-center border shrink-0 " + item.bg}>
                                      <IconComp size={13} />
                                    </div>
                                    <div className="min-w-0 text-left">
                                      <span className="text-[11px] font-bold text-slate-800 dark:text-white block leading-tight">{item.label}</span>
                                      <span className="text-[9px] text-slate-400 dark:text-slate-500 font-light block mt-0.5">High Impact</span>
                                    </div>
                                  </div>
                                  <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200 font-heading truncate pl-2">{item.val}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Best Time to Visit (See your utilization style) */}
                        <div className="relative overflow-hidden rounded-2xl border border-slate-200/40 dark:border-white/[0.05] bg-white/60 dark:bg-slate-900/40 backdrop-blur-md p-6 space-y-4 shadow-sm text-left">
                          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />
                          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">See your utilization</span>
                          
                          <div className="space-y-4 pt-1">
                            <div className="flex justify-between items-baseline font-heading">
                              <div className="text-left">
                                <span className="text-[9px] text-slate-400 dark:text-slate-500 font-light block">Peak Season</span>
                                <span className="text-lg font-black text-emerald-500 leading-none">{country.seasons?.peak || 'Summer'}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-[9px] text-slate-400 dark:text-slate-500 font-light block">Average Temp</span>
                                <span className="text-lg font-black text-blue-500 leading-none">22°C - 30°C</span>
                              </div>
                            </div>
                            
                            {/* Horizontal Slide Indicator */}
                            <div className="space-y-2 pt-2 border-t border-slate-200/40 dark:border-white/[0.04]">
                              <div className="w-full h-4 bg-gradient-to-r from-blue-300 via-emerald-400 to-amber-500 rounded-lg relative overflow-hidden">
                                <div className="absolute top-0 bottom-0 w-1.5 bg-white border border-slate-800 shadow-sm left-[65%] -translate-x-1/2" />
                              </div>
                              <div className="flex justify-between text-[8px] font-extrabold font-mono text-slate-450 uppercase">
                                <span>Low (Wet)</span>
                                <span>Shoulder</span>
                                <span>Peak (Dry)</span>
                              </div>
                            </div>
                            
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-light leading-relaxed pl-0.5 text-left">
                              {country.seasons?.details || 'Ideal visiting months occur during dry, sunny weather with local cultural events and pleasant temperatures.'}
                            </p>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                    {/* TAB 2: TOP DESTINATIONS */}
                                    {activeTab === 'destinations' && (
                    <div className="relative w-full group/carousel px-4">
                      {/* Left navigation arrow button */}
                      <button
                        onClick={() => scrollLeft(destScrollRef)}
                        className="absolute left-[-16px] top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all z-20 cursor-pointer text-slate-700 dark:text-slate-350 hover:text-[var(--accent)]"
                      >
                        <ChevronLeft size={16} />
                      </button>

                      {/* Horizontal Scroll Track */}
                      <div 
                        ref={destScrollRef}
                        className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-4"
                      >
                        {country.destinations?.map((dest, idx) => {
                          return (
                            <div key={idx} className="group/card relative overflow-hidden rounded-2xl border border-slate-200/50 dark:border-white/[0.05] bg-white dark:bg-slate-900/60 p-6 shadow-premium hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-between h-full w-[290px] sm:w-[325px] shrink-0 snap-start">
                              <div className="flex-1 flex flex-col">
                                {/* Rounded inset image container */}
                                <div className="relative w-full h-48 overflow-hidden rounded-xl mb-4">
                                  <DynamicImage
                                    name={dest.name}
                                    country={country.name}
                                    alt={dest.name}
                                    queryOverride={dest.name + ", " + country.name + " travel photography scenic landmark"}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-[1.06]"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                                  <span className="absolute top-3.5 right-3.5 text-[9px] bg-black/45 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full font-bold uppercase tracking-wider text-white shadow-sm">
                                    {dest.category}
                                  </span>
                                </div>

                                {/* Text content details */}
                                <div className="space-y-3.5 flex-1 flex flex-col">
                                  <div className="text-left">
                                    <h4 className="text-base font-black text-[var(--text-primary)] font-heading leading-tight">{dest.name}</h4>
                                    <div className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500 font-light mt-1">
                                      <MapPin size={11} className="text-slate-400 shrink-0" />
                                      <span className="truncate">{country.name}, {dest.category || 'Sight'}</span>
                                    </div>
                                  </div>

                                  <div className="space-y-1 text-left flex-1">
                                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">Description</span>
                                    <p className="text-xs text-slate-655 dark:text-slate-400 font-light leading-relaxed line-clamp-3">
                                      {dest.desc}
                                    </p>
                                  </div>

                                  {/* Indicators Grid (3 columns) */}
                                  <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-slate-100 dark:border-white/[0.04] text-center text-2xs font-mono mt-auto">
                                    <div className="space-y-0.5">
                                      <span className="text-[8px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">Stay</span>
                                      <span className="block font-black text-blue-500 text-xs truncate">{dest.stay || '2-3 Days'}</span>
                                    </div>
                                    <div className="space-y-0.5 border-x border-slate-100 dark:border-white/[0.04]">
                                      <span className="text-[8px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">Category</span>
                                      <span className="block font-black text-emerald-500 text-xs truncate">{dest.category || 'Urban'}</span>
                                    </div>
                                    <div className="space-y-0.5">
                                      <span className="text-[8px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">Rating</span>
                                      <span className="block font-black text-amber-500 text-xs truncate">★ {(4.6 + (idx % 5) * 0.1).toFixed(1)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Card Bottom CTA Row */}
                              <div className="flex items-center justify-between mt-4.5 pt-3.5 border-t border-slate-100 dark:border-white/[0.04]">
                                <div className="text-left leading-tight">
                                  <span className="block text-[8px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">Daily Est.</span>
                                  <span className="text-xs font-black text-[var(--text-primary)] font-mono">
                                    ${country.budget?.midRangeDaily || '180'} <span className="text-[8px] text-slate-400 dark:text-slate-500 font-normal">/ day</span>
                                  </span>
                                </div>
                                
                                <button
                                  onClick={() => handleOpenCityDeepDive(dest)}
                                  className="w-9 h-9 rounded-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
                                  title="Explore City Profile"
                                >
                                  <Plane size={13} className="transform rotate-45" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Right navigation arrow button */}
                      <button
                        onClick={() => scrollRight(destScrollRef)}
                        className="absolute right-[-16px] top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all z-20 cursor-pointer text-slate-700 dark:text-slate-350 hover:text-[var(--accent)]"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  )}

                  {/* TAB 3: MUST-VISIT ATTRACTIONS */}
                                    {activeTab === 'attractions' && (
                    <div className="relative w-full group/carousel px-4">
                      {/* Left navigation arrow button */}
                      <button
                        onClick={() => scrollLeft(attrScrollRef)}
                        className="absolute left-[-16px] top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all z-20 cursor-pointer text-slate-700 dark:text-slate-350 hover:text-[var(--accent)]"
                      >
                        <ChevronLeft size={16} />
                      </button>

                      {/* Horizontal Scroll Track */}
                      <div 
                        ref={attrScrollRef}
                        className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-4"
                      >
                        {country.attractions?.map((attr, idx) => {
                          return (
                            <div key={idx} className="group/card relative overflow-hidden rounded-none border border-slate-200/50 dark:border-white/[0.05] bg-white dark:bg-slate-900/60 p-6 shadow-premium hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-between h-full w-[290px] sm:w-[325px] shrink-0 snap-start">
                              <div className="flex-1 flex flex-col">
                                {/* Rounded inset image container */}
                                <div className="relative w-full h-48 overflow-hidden rounded-none mb-4">
                                  <DynamicImage
                                    name={attr.name}
                                    country={country.name}
                                    alt={attr.name}
                                    queryOverride={attr.name + ", " + country.name + " famous travel landmark attraction"}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-[1.06]"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                                  <div className="absolute top-3.5 right-3.5 flex items-center gap-1 bg-amber-500 backdrop-blur-md border border-amber-400/30 px-2.5 py-1 rounded-full text-white shadow-md">
                                    <Star size={10} className="text-white fill-white" />
                                    <span className="text-[10px] font-extrabold font-mono leading-none">{attr.rating || '4.8'}</span>
                                  </div>
                                </div>

                                {/* Text content details */}
                                <div className="space-y-3.5 flex-1 flex flex-col">
                                  <div className="text-left">
                                    <h4 className="text-base font-black text-[var(--text-primary)] font-heading leading-tight">{attr.name}</h4>
                                    <div className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500 font-light mt-1">
                                      <MapPin size={11} className="text-slate-400 shrink-0" />
                                      <span className="truncate">{country.name}, Local Sight</span>
                                    </div>
                                  </div>

                                  <div className="space-y-1 text-left flex-1">
                                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">Description</span>
                                    <p className="text-xs text-slate-655 dark:text-slate-400 font-light leading-relaxed line-clamp-3">
                                      {attr.desc || 'Experience the local heritage, scenic marvels, and breathtaking cultural experiences.'}
                                    </p>
                                  </div>

                                  {/* Indicators Grid (3 columns) */}
                                  <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-slate-100 dark:border-white/[0.04] text-center text-2xs font-mono mt-auto">
                                    <div className="space-y-0.5">
                                      <span className="text-[8px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">Duration</span>
                                      <span className="block font-black text-blue-500 text-xs truncate">{attr.duration || '2-3 Hours'}</span>
                                    </div>
                                    <div className="space-y-0.5 border-x border-slate-100 dark:border-white/[0.04]">
                                      <span className="text-[8px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">Season</span>
                                      <span className="block font-black text-emerald-500 text-xs truncate">{attr.season || 'All Year'}</span>
                                    </div>
                                    <div className="space-y-0.5">
                                      <span className="text-[8px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">Rating</span>
                                      <span className="block font-black text-amber-500 text-xs truncate">★ {attr.rating || '4.8'}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Card Bottom CTA Row */}
                              <div className="flex items-center justify-between mt-4.5 pt-3.5 border-t border-slate-100 dark:border-white/[0.04]">
                                <div className="text-left leading-tight">
                                  <span className="block text-[8px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">Entry Fee</span>
                                  <span className="text-xs font-black text-[var(--text-primary)] font-mono">
                                    {attr.fee || 'Free'}
                                  </span>
                                </div>
                                
                                <button
                                  onClick={() => {
                                    // Soft bounce/highlight action
                                  }}
                                  className="w-9 h-9 rounded-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
                                  title="Sight Profile"
                                >
                                  <Compass size={13} className="animate-spin-slow" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Right navigation arrow button */}
                      <button
                        onClick={() => scrollRight(attrScrollRef)}
                        className="absolute right-[-16px] top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all z-20 cursor-pointer text-slate-700 dark:text-slate-350 hover:text-[var(--accent)]"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  )}

                  {/* TAB 4: BUDGET OVERVIEW */}
                  {activeTab === 'budget' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {[
                          { title: 'Budget Traveler', val: `$${country.budget?.budgetDaily || '80-120'} / day`, desc: 'Covers hostel stays, self-catering/street dining, public regional transit, and free/cheap attraction sites.', gradient: 'from-emerald-500 via-teal-500 to-green-500', color: 'text-emerald-500', segments: 1, activeColor: 'bg-emerald-500' },
                          { title: 'Mid-Range Traveler', val: `$${country.budget?.midRangeDaily || '150-250'} / day`, desc: 'Covers private hotel rooms, local seated restaurants, combined rail transit/rideshare, and standard attraction entry fees.', gradient: 'from-blue-500 via-indigo-500 to-violet-500', color: 'text-blue-500', segments: 2, activeColor: 'bg-blue-500' },
                          { title: 'Luxury Traveler', val: `$${country.budget?.luxuryDaily || '400+'} / day`, desc: 'Covers high-end luxury resorts, fine dining experiences, private chauffeur services, and private guided excursions.', gradient: 'from-purple-500 via-pink-500 to-rose-500', color: 'text-purple-500', segments: 3, activeColor: 'bg-purple-500' }
                        ].map((tier, idx) => (
                          <div key={idx} className="relative overflow-hidden rounded-[32px] border border-slate-200/40 dark:border-white/[0.05] bg-white/60 dark:bg-slate-900/40 backdrop-blur-md p-6 space-y-4 flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-[0_16px_48px_rgba(0,0,0,0.04)] transition-all duration-500">
                            <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${tier.gradient}`} />
                            <div className="space-y-2">
                              <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider font-heading block">{tier.title}</span>
                              <span className={`text-xl font-extrabold ${tier.color} block leading-none font-mono`}>{tier.val}</span>
                            </div>
                            <p className="text-2xs font-light text-slate-555 dark:text-slate-400 leading-relaxed font-body">{tier.desc}</p>
                            
                            {/* Graphic Cost Intensity meter */}
                            <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-white/[0.03]">
                              <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">Cost Intensity</span>
                              <div className="flex gap-1.5">
                                {Array.from({ length: 3 }).map((_, scaleIdx) => {
                                  const isActive = scaleIdx < tier.segments;
                                  return (
                                    <div 
                                      key={scaleIdx} 
                                      className={`h-1.5 flex-1 rounded-full ${
                                        isActive ? tier.activeColor : 'bg-slate-200 dark:bg-white/5'
                                      }`} 
                                    />
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Quick Cost Snapshot */}
                      <div className="relative overflow-hidden rounded-[32px] border border-slate-200/40 dark:border-white/[0.05] bg-white/60 dark:bg-slate-900/40 backdrop-blur-md p-6 space-y-5 shadow-[0_8px_32px_rgba(0,0,0,0.02)]">
                        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500" />
                        <div className="flex items-center gap-2.5 text-slate-655 dark:text-slate-350 border-b border-slate-100 dark:border-white/[0.05] pb-3">
                          <div className="p-1.5 bg-amber-500/10 rounded-xl">
                            <Coins size={14} className="text-amber-500" />
                          </div>
                          <h4 className="text-xs uppercase font-extrabold tracking-wider font-heading">Average Cost Snapshot</h4>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {[
                            { label: 'Hotel Stay', sub: 'per night', val: `$${country.budget?.snapshot?.hotel || '100-200'}`, color: 'border-l-blue-500', iconBg: 'bg-blue-500/10 text-blue-505 dark:text-blue-400' },
                            { label: 'Meals', sub: 'daily average', val: `$${country.budget?.snapshot?.food || '30-65'}`, color: 'border-l-emerald-500', iconBg: 'bg-emerald-500/10 text-emerald-505 dark:text-emerald-400' },
                            { label: 'Transportation', sub: 'daily', val: `$${country.budget?.snapshot?.transport || '15-35'}`, color: 'border-l-amber-500', iconBg: 'bg-amber-500/10 text-amber-505 dark:text-amber-400' },
                            { label: 'Attractions', sub: 'per entry', val: `$${country.budget?.snapshot?.attraction || '10-25'}`, color: 'border-l-purple-500', iconBg: 'bg-purple-500/10 text-purple-505 dark:text-purple-400' }
                          ].map((cost, idx) => (
                            <div key={idx} className={`p-4 bg-slate-50/50 dark:bg-white/[0.015] border border-slate-100 dark:border-white/[0.03] border-l-[3px] ${cost.color} rounded-2xl space-y-2 hover:shadow-[0_4px_16px_rgba(0,0,0,0.02)] transition-all duration-300`}>
                              <div className="space-y-0.5">
                                <span className="text-[11px] font-medium text-slate-505 dark:text-slate-350 block leading-tight">{cost.label}</span>
                                <span className="text-[9px] text-slate-400 dark:text-slate-500 block leading-none">{cost.sub}</span>
                              </div>
                              <span className="text-base font-bold text-[var(--text-primary)] block leading-none tracking-tight font-mono">{cost.val}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Redirect CTA Card */}
                      <div className="p-6 rounded-[28px] border border-[var(--accent)]/15 bg-gradient-to-tr from-[var(--accent)]/[0.02] to-indigo-500/[0.01] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
                        <div className="space-y-1 text-left">
                          <h4 className="text-sm font-bold text-[var(--text-primary)] font-heading">Need an accurate trip cost estimate?</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-light max-w-xl leading-relaxed font-body">
                            Calculate your personalized, high-fidelity budget based on travel dates, style preferences, accommodation, food choices, transport, and tours.
                          </p>
                        </div>
                        <button
                          onClick={() => navigate(`/budget-planner?country=${country.name}`)}
                          className="px-5 py-3 rounded-xl bg-gradient-to-tr from-[var(--accent)] to-indigo-600 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
                        >
                          <span>Open Budget Estimator</span>
                          <ArrowRight size={13} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* TAB 5: TRANSPORTATION GUIDE */}
                  {activeTab === 'transit' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                          { type: 'Train Network', key: 'train', icon: Train, bgClass: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
                          { type: 'Bus System', key: 'bus', icon: Milestone, bgClass: 'bg-emerald-500/10 text-emerald-505 border-emerald-500/20' },
                          { type: 'Metro & Subway', key: 'metro', icon: Train, bgClass: 'bg-indigo-500/10 text-indigo-505 border-indigo-500/20' },
                          { type: 'Ride Sharing', key: 'rideshare', icon: Smartphone, bgClass: 'bg-purple-500/10 text-purple-505 border-purple-500/20' },
                          { type: 'Car Rental', key: 'carRental', icon: Car, bgClass: 'bg-amber-500/10 text-amber-505 border-amber-500/20' },
                          { type: 'Domestic Flights', key: 'flights', icon: Plane, bgClass: 'bg-rose-500/10 text-rose-500 border-rose-500/20' }
                        ].map((trans, idx) => {
                          const TransIcon = trans.icon;
                          const tData = country.transport?.[trans.key] || { cost: '$$', conv: '4.0', rec: 'Recommended public transportation options.' };
                          const ratingVal = parseFloat(tData.conv) || 4.0;
                          
                          return (
                            <div key={idx} className="group/card relative overflow-hidden rounded-2xl border border-slate-200/50 dark:border-white/[0.05] bg-white/60 dark:bg-slate-900/40 backdrop-blur-md p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full text-left">
                              <div className="space-y-4 flex-1">
                                {/* Top Badging Row matching Image 1 */}
                                <div className="flex justify-between items-center">
                                  <div className={"w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 " + trans.bgClass}>
                                    <TransIcon size={16} />
                                  </div>
                                  <div className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-white/10" />
                                </div>

                                {/* Text content details */}
                                <div className="space-y-2">
                                  <h4 className="text-base font-black text-[var(--text-primary)] font-heading leading-tight">{trans.type}</h4>
                                  <p className="text-xs font-light text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                                    {tData.rec}
                                  </p>
                                </div>
                              </div>

                              {/* Indicators Row (Price Estimate and Rating) */}
                              <div className="grid grid-cols-2 gap-4 py-3 mt-4 border-t border-slate-100 dark:border-white/[0.04] text-[10px] font-mono">
                                <div className="space-y-0.5">
                                  <span className="text-[8px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">Est. Cost</span>
                                  <span className="block font-black text-slate-800 dark:text-white text-xs truncate">
                                    {tData.cost === '$$$' ? 'Premium' : tData.cost === '$$' ? 'Moderate' : 'Budget'}
                                  </span>
                                </div>
                                <div className="space-y-0.5 border-l border-slate-100 dark:border-white/[0.04] pl-3">
                                  <span className="text-[8px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">Convenience</span>
                                  <span className="block font-black text-amber-500 text-xs truncate">★ {ratingVal.toFixed(1)}</span>
                                </div>
                              </div>

                              {/* Learn more style Button at bottom (Image 1 style) */}
                              <button className="w-full mt-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-white/[0.02] dark:hover:bg-white/[0.06] text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors border border-slate-200/50 dark:border-white/[0.04] cursor-pointer text-center">
                                View Routes Guide
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* TAB 6: WEATHER & SEASONS */}
                  {activeTab === 'weather' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {/* Best Months To Visit (Sun) */}
                        <div className="relative overflow-hidden bg-white/60 dark:bg-slate-900/40 border border-slate-200/40 dark:border-white/[0.05] p-5 rounded-[28px] space-y-2 backdrop-blur-md shadow-4xs text-left group">
                          <div className="absolute right-[-15px] bottom-[-15px] opacity-10 dark:opacity-20 group-hover:scale-110 transition-transform duration-500 text-amber-500">
                            <Sun size={80} className="animate-spin-slow" />
                          </div>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider font-heading block">Best Months To Visit</span>
                          <span className="text-sm font-extrabold text-emerald-500 block leading-tight">{country.seasons?.peak?.split('(')?.[0] || 'Summer Months'}</span>
                          <p className="text-2xs font-light text-slate-500 dark:text-slate-400 leading-relaxed font-body pr-8">Ideal weather conditions for outdoor sightseeing and sightseeing tours.</p>
                        </div>
                        {/* Cheapest Months (Snowflake) */}
                        <div className="relative overflow-hidden bg-white/60 dark:bg-slate-900/40 border border-slate-200/40 dark:border-white/[0.05] p-5 rounded-[28px] space-y-2 backdrop-blur-md shadow-4xs text-left group">
                          <div className="absolute right-[-15px] bottom-[-15px] opacity-10 dark:opacity-20 group-hover:scale-110 transition-transform duration-500 text-blue-400">
                            <Snowflake size={80} className="animate-pulse" />
                          </div>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider font-heading block">Cheapest Months</span>
                          <span className="text-sm font-extrabold text-blue-500 block leading-tight">{country.seasons?.budget?.split('(')?.[0] || 'Winter Months'}</span>
                          <p className="text-2xs font-light text-slate-500 dark:text-slate-400 leading-relaxed font-body pr-8">Lower hotel rates, fewer tourists, and affordable flights.</p>
                        </div>
                        {/* Festival Months (Sparkles) */}
                        <div className="relative overflow-hidden bg-white/60 dark:bg-slate-900/40 border border-slate-200/40 dark:border-white/[0.05] p-5 rounded-[28px] space-y-2 backdrop-blur-md shadow-4xs text-left group">
                          <div className="absolute right-[-15px] bottom-[-15px] opacity-10 dark:opacity-20 group-hover:scale-110 transition-transform duration-500 text-purple-400">
                            <Sparkles size={80} className="animate-bounce-slow" />
                          </div>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider font-heading block">Festival Months</span>
                          <span className="text-sm font-extrabold text-purple-500 block leading-tight">{country.seasons?.shoulder?.split('(')?.[0] || 'Spring/Autumn'}</span>
                          <p className="text-2xs font-light text-slate-500 dark:text-slate-400 leading-relaxed font-body pr-8">Great times to experience local cultural events and celebrations.</p>
                        </div>
                      </div>

                      <div className="bg-white/60 dark:bg-slate-900/40 border border-slate-200/40 dark:border-white/[0.05] rounded-[32px] overflow-hidden shadow-sm text-left backdrop-blur-md">
                        <div className="p-5 border-b border-slate-100 dark:border-white/[0.04] flex items-center justify-between">
                          <span className="text-xs uppercase font-extrabold tracking-widest text-slate-500 dark:text-slate-400 font-heading">Month-by-Month Weather & Tourism Guide</span>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse text-xs">
                            <thead>
                              <tr className="border-b border-slate-100 dark:border-white/[0.04] bg-slate-50/50 dark:bg-white/[0.015] font-mono text-[9px] uppercase tracking-wider text-slate-400 text-left">
                                <th className="px-5 py-4">Month</th>
                                <th className="px-5 py-4">Average Temperature</th>
                                <th className="px-5 py-4">Rainfall</th>
                                <th className="px-5 py-4">Snowfall</th>
                                <th className="px-5 py-4">Crowd Level</th>
                                <th className="px-5 py-4">Travel Rating</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.03] font-body">
                              {country.weather?.map((row, idx) => {
                                const ratingStr = row.rating?.toLowerCase() || '';
                                let ratingStars = 4;
                                let ratingColor = 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
                                if (ratingStr.includes('excel')) {
                                  ratingStars = 5;
                                  ratingColor = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
                                } else if (ratingStr.includes('good')) {
                                  ratingStars = 4;
                                  ratingColor = 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20';
                                } else if (ratingStr.includes('fair') || ratingStr.includes('mod')) {
                                  ratingStars = 3;
                                  ratingColor = 'bg-amber-500/10 text-amber-600 dark:text-amber-450 border border-amber-500/20';
                                } else {
                                  ratingStars = 2;
                                  ratingColor = 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20';
                                }

                                return (
                                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.015] transition-colors">
                                    <td className="px-5 py-4 font-extrabold text-[var(--text-primary)]">{row.month}</td>
                                    <td className="px-5 py-4 font-mono font-medium text-slate-655 dark:text-slate-350">{row.temp}</td>
                                    <td className="px-5 py-4 font-mono font-light text-slate-500 dark:text-slate-400">{row.rain}</td>
                                    <td className="px-5 py-4 font-mono font-light text-slate-500 dark:text-slate-400">{row.snow || 'No'}</td>
                                    <td className="px-5 py-4">
                                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                                        row.crowd === 'High' ? 'bg-rose-500/10 text-rose-500' :
                                        row.crowd === 'Medium' ? 'bg-amber-500/10 text-amber-505 dark:text-amber-400' :
                                        'bg-emerald-500/10 text-emerald-500'
                                      }`}>
                                        {row.crowd}
                                      </span>
                                    </td>
                                    <td className="px-5 py-4">
                                      <div className="flex items-center gap-2">
                                        <div className={"w-2 h-2 rounded-full shrink-0 " + (
                                          ratingStars >= 5 ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]' :
                                          ratingStars >= 4 ? 'bg-indigo-500 shadow-[0_0_6px_rgba(99,102,241,0.5)]' :
                                          ratingStars >= 3 ? 'bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.5)]' :
                                          'bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.5)]'
                                        )} />
                                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold leading-none whitespace-nowrap ${ratingColor}`}>
                                          {row.rating}
                                        </span>
                                        <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                                          {ratingStars}.0
                                        </span>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 7: FOOD & DINING GUIDE */}
                  {activeTab === 'dining' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        
                        {/* Food Basics */}
                        <div className="bg-white/60 dark:bg-slate-900/40 border border-slate-200/40 dark:border-white/[0.05] p-6 rounded-[32px] shadow-sm backdrop-blur-md space-y-4">
                          <div className="flex items-center gap-2.5 text-slate-655 dark:text-slate-350 border-b border-slate-100 dark:border-white/[0.05] pb-3">
                            <div className="p-1.5 bg-[var(--accent)]/10 rounded-xl text-[var(--accent)]">
                              <UtensilsCrossed size={14} />
                            </div>
                            <h4 className="text-xs uppercase font-extrabold tracking-wider font-heading">Food & Dining Basics</h4>
                          </div>
                          <div className="space-y-4 text-xs font-body">
                            <div className="space-y-1">
                              <span className="font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider text-[9px]">Average Meal Cost</span>
                              <p className="font-light text-slate-600 dark:text-slate-300 leading-relaxed">{country.dining?.avgCost}</p>
                            </div>
                            <div className="space-y-1">
                              <span className="font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider text-[9px]">Street Food Guide</span>
                              <p className="font-light text-slate-600 dark:text-slate-300 leading-relaxed">{country.dining?.streetFood}</p>
                            </div>
                            <div className="space-y-2.5 border-t border-slate-100 dark:border-white/[0.05] pt-3.5">
                              <span className="font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider text-[9px]">Dietary Friendliness</span>
                              <div className="grid grid-cols-1 gap-4 pt-1">
                                {[
                                  { label: 'Halal Suitability', val: country.dining?.dietary?.halal || 'Limited options', icon: Shield, rating: 40, color: 'bg-emerald-500', bgClass: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
                                  { label: 'Vegetarian Options', val: country.dining?.dietary?.veg || 'Good availability', icon: Award, rating: 90, color: 'bg-indigo-500', bgClass: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20' },
                                  { label: 'Vegan Friendliness', val: country.dining?.dietary?.vegan || 'Moderate options', icon: Sparkles, rating: 65, color: 'bg-amber-500', bgClass: 'bg-amber-500/10 text-amber-600 border-amber-500/20' }
                                ].map((item, idx) => {
                                  const IconComp = item.icon;
                                  return (
                                    <div key={idx} className="p-4 bg-slate-50/50 dark:bg-white/[0.01] border border-slate-100 dark:border-white/[0.02] rounded-2xl space-y-3 hover:scale-[1.01] transition-transform text-left">
                                      <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2.5">
                                          <div className={"w-7 h-7 rounded-lg flex items-center justify-center border " + item.bgClass}>
                                            <IconComp size={13} />
                                          </div>
                                          <span className="text-xs font-black text-slate-800 dark:text-white font-heading">{item.label}</span>
                                        </div>
                                        <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{item.rating}% Rating</span>
                                      </div>
                                      
                                      <p className="text-[11px] text-slate-550 dark:text-slate-350 leading-relaxed font-body pl-0.5">
                                        {item.val}
                                      </p>

                                      <div className="w-full h-1 bg-slate-105 dark:bg-white/[0.04] rounded-full overflow-hidden">
                                        <div className={"h-full " + item.color} style={{ width: item.rating + "%" }} />
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>

                          {/* Tips & Safety */}
                        <div className="bg-white/60 dark:bg-slate-900/40 border border-slate-200/40 dark:border-white/[0.05] p-6 rounded-[32px] shadow-sm backdrop-blur-md space-y-4">
                          <div className="flex items-center gap-2.5 text-slate-655 dark:text-slate-350 border-b border-slate-100 dark:border-white/[0.05] pb-3">
                            <div className="p-1.5 bg-indigo-500/10 rounded-xl text-indigo-500">
                              <Info size={14} />
                            </div>
                            <h4 className="text-xs uppercase font-extrabold tracking-wider font-heading">Dining Etiquette & Safety</h4>
                          </div>
                          <div className="space-y-3.5 text-xs font-body">
                            <div className="p-4 bg-[var(--accent)]/[0.03] border border-[var(--accent)]/10 rounded-2xl space-y-1">
                              <span className="font-bold text-slate-500 block uppercase tracking-wider text-[9px] font-heading">Restaurant Tipping</span>
                              <p className="font-light text-slate-655 dark:text-slate-300 italic">{country.dining?.restaurantTip}</p>
                            </div>
                            <div className="p-4 bg-blue-500/[0.03] border border-blue-500/10 rounded-2xl space-y-1">
                              <span className="font-bold text-slate-500 block uppercase tracking-wider text-[9px] font-heading">Water & Food Safety</span>
                              <p className="font-light text-slate-655 dark:text-slate-300 italic">{country.dining?.safetyTip}</p>
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Must-Try Traditional Dishes */}
                      <div className="bg-white/60 dark:bg-slate-900/40 border border-slate-200/40 dark:border-white/[0.05] p-6 rounded-[32px] shadow-sm backdrop-blur-md space-y-4 text-left">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 dark:text-slate-400 block font-heading border-b border-slate-105 dark:border-white/[0.04] pb-2">Must-Try Traditional Dishes</span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {selectedCountryObj.intermediate?.cuisineList?.map((dish, idx) => (
                            <div key={idx} className="p-4 bg-slate-50/50 dark:bg-white/[0.015] border border-slate-100 dark:border-white/[0.03] rounded-2xl flex items-start gap-3 hover:border-[var(--accent)]/30 hover:scale-[1.01] transition-all duration-300">
                              <span className="text-2xl shrink-0 leading-none select-none">{dish.emoji}</span>
                              <div className="space-y-0.5 min-w-0">
                                <span className="text-xs font-bold text-[var(--text-primary)] block leading-tight">{dish.name}</span>
                                <span className="text-2xs text-slate-450 dark:text-slate-500 font-light block leading-relaxed">{dish.desc}</span>
                              </div>
                            </div>
                          )) || (
                            <div className="col-span-3 text-center py-4 text-xs text-slate-455">
                              No traditional dishes in database. Check local guides for recommendations!
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}


                  {/* TAB 8: CULTURE & ETIQUETTE */}
                  {activeTab === 'culture' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        
                        {/* Greetings & Behaviors */}
                        <div className="glass-card p-6 border border-[var(--border)] rounded-2xl space-y-4">
                          <div className="flex items-center gap-2 text-slate-555 dark:text-slate-400 border-b border-[var(--border)] pb-2.5">
                            <Milestone size={16} className="text-[var(--accent)]" />
                            <h4 className="text-xs uppercase font-extrabold tracking-widest font-heading">Greetings & Etiquette</h4>
                          </div>
                          <div className="space-y-4 text-xs font-body">
                            <div className="space-y-1">
                              <span className="font-semibold text-slate-500 block uppercase tracking-wider text-[9px]">Greetings</span>
                              <p className="font-light text-slate-655 dark:text-slate-305 leading-relaxed">{country.culture?.greetings}</p>
                            </div>
                            <div className="space-y-1">
                              <span className="font-semibold text-slate-500 block uppercase tracking-wider text-[9px]">Tipping Culture</span>
                              <p className="font-light text-slate-655 dark:text-slate-305 leading-relaxed">{country.culture?.tipping}</p>
                            </div>
                            <div className="space-y-1">
                              <span className="font-semibold text-slate-500 block uppercase tracking-wider text-[9px]">Dress Code</span>
                              <p className="font-light text-slate-655 dark:text-slate-305 leading-relaxed">{country.culture?.dressCode}</p>
                            </div>
                            <div className="space-y-1">
                              <span className="font-semibold text-slate-500 block uppercase tracking-wider text-[9px]">Public Behavior</span>
                              <p className="font-light text-slate-655 dark:text-slate-305 leading-relaxed">{country.culture?.publicBehavior}</p>
                            </div>
                          </div>
                        </div>

                        {/* Rules & Warnings */}
                        <div className="glass-card p-6 border border-[var(--border)] rounded-2xl space-y-4">
                          <div className="flex items-center gap-2 text-slate-555 dark:text-slate-400 border-b border-[var(--border)] pb-2.5">
                            <AlertCircle size={16} className="text-red-500" />
                            <h4 className="text-xs uppercase font-extrabold tracking-widest font-heading">Local Laws & Religious Customs</h4>
                          </div>
                          <div className="space-y-4 text-xs font-body">
                            <div className="space-y-1">
                              <span className="font-semibold text-slate-500 block uppercase tracking-wider text-[9px]">Religious Customs</span>
                              <p className="font-light text-slate-655 dark:text-slate-305 leading-relaxed">{country.culture?.religion}</p>
                            </div>
                            <div className="space-y-1">
                              <span className="font-semibold text-slate-500 block uppercase tracking-wider text-[9px]">Photography Rules</span>
                              <p className="font-light text-slate-655 dark:text-slate-305 leading-relaxed">{country.culture?.photography}</p>
                            </div>
                            <div className="space-y-1">
                              <span className="font-semibold text-slate-500 block uppercase tracking-wider text-[9px]">Local Laws</span>
                              <p className="font-light text-slate-655 dark:text-slate-305 leading-relaxed">{country.culture?.laws}</p>
                            </div>
                            <div className="p-3 bg-amber-500/[0.02] border border-amber-500/10 rounded-xl space-y-1">
                              <span className="font-bold text-slate-500 block uppercase tracking-wider text-[9px] font-heading">Traveler Etiquette Tips</span>
                              <p className="font-light text-slate-655 dark:text-slate-300 italic">{country.culture?.etiquetteTips}</p>
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Things to Avoid */}
                      <div className="glass-card p-6 border border-[var(--border)] rounded-2xl space-y-4 text-left">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-red-500 block font-heading border-b border-[var(--border)] pb-2">Things To Avoid</span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {country.culture?.avoid?.map((item, idx) => (
                            <div key={idx} className="p-4 bg-red-500/[0.01] dark:bg-white/[0.01] border border-[var(--border)] rounded-xl flex items-start gap-3 hover:border-red-500/20 transition-all duration-300">
                              <span className="text-red-500 font-bold shrink-0 mt-0.5">✕</span>
                              <span className="text-xs font-light text-slate-550 dark:text-slate-300 leading-relaxed font-body">{item}</span>
                            </div>
                          )) || (
                            <div className="col-span-3 text-center py-4 text-xs text-slate-455">
                              No checklist items.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 9: CONNECTIVITY GUIDE */}
                  {activeTab === 'connectivity' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        
                        {/* Internet Speed Stats Card (Image 5 style) */}
                        <div className="relative overflow-hidden rounded-2xl border border-slate-200/40 dark:border-white/[0.05] bg-white/60 dark:bg-slate-900/40 backdrop-blur-md p-6 flex flex-col justify-between shadow-sm text-left min-h-[290px] pb-5">
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">Active speed</span>
                            <span className="text-[9px] text-slate-400 dark:text-slate-500 font-light block">Average Broadband Download</span>
                          </div>
                          
                          <div className="my-auto py-2">
                            <h3 className="text-4xl font-black text-[var(--text-primary)] tracking-tight leading-none">
                              {country.connectivity?.speed || '45 Mbps'}
                            </h3>
                          </div>

                          <div className="flex items-center gap-1.5 pt-3 border-t border-slate-100 dark:border-white/[0.04]">
                            <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                              <span>↑ 12% today</span>
                            </span>
                            <span className="text-[9.5px] text-slate-400 dark:text-slate-550 font-light">Compared to region avg</span>
                          </div>
                        </div>

                        {/* eSIM Coverage Circular Gauge (Card 9, Image 5 style) */}
                        <div className="relative overflow-hidden rounded-2xl border border-slate-200/40 dark:border-white/[0.05] bg-white/60 dark:bg-slate-900/40 backdrop-blur-md p-6 flex flex-col justify-between shadow-sm text-left min-h-[290px] pb-5">
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">Storage used</span>
                            <span className="text-[9px] text-slate-400 dark:text-slate-500 font-light block">eSIM Digital Coverage</span>
                          </div>
                          
                          <div className="flex justify-center items-center my-auto">
                            <div className="relative w-28 h-28 flex items-center justify-center">
                              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="38" strokeWidth="6" fill="transparent" className="stroke-slate-100 dark:stroke-white/[0.02]" />
                                <circle cx="50" cy="50" r="38" strokeWidth="8" strokeLinecap="round" fill="transparent" stroke="#F59E0B" strokeDasharray="238.76" strokeDashoffset="35.8" className="transition-all duration-1000" />
                              </svg>
                              <div className="absolute flex flex-col items-center justify-center leading-none">
                                <span className="text-sm font-black text-slate-800 dark:text-white">95%</span>
                                <span className="text-[6.5px] font-mono tracking-widest text-slate-400 dark:text-slate-500 uppercase mt-0.5">Active</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-between items-center text-[9px] font-mono text-slate-400 dark:text-slate-500 pt-3 border-t border-slate-100 dark:border-white/[0.04]">
                            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Available eSIMs</span>
                            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-white/10" /> Physical SIMs</span>
                          </div>
                        </div>

                        {/* SIM & Wi-Fi Coverage Card */}
                        <div className="relative overflow-hidden rounded-2xl border border-slate-200/40 dark:border-white/[0.05] bg-white/60 dark:bg-slate-900/40 backdrop-blur-md p-6 space-y-5 shadow-sm text-left">
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono"><MapPin size={10} className="text-[var(--accent)] inline-block mr-1 -mt-0.5" /> Network Access</span>
                            <h4 className="text-xs uppercase font-extrabold tracking-widest font-heading text-slate-800 dark:text-slate-200">SIM & Connectivity</h4>
                          </div>

                          {/* Local SIM Providers */}
                          <div className="p-3.5 bg-slate-50/50 dark:bg-white/[0.015] border border-slate-100 dark:border-white/[0.03] rounded-2xl space-y-2 text-left">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg flex items-center justify-center border shrink-0 bg-violet-500/10 text-violet-600 border-violet-500/20">
                                <Smartphone size={13} />
                              </div>
                              <span className="text-xs font-black text-slate-850 dark:text-white font-heading">Local SIM Providers</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {(simCarriers[selectedCountryKey] || 'Local Provider').split(', ').map((carrier, ci) => (
                                <span key={ci} className="px-2.5 py-1 rounded-lg text-[9px] font-bold bg-slate-100 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-white/[0.06]">
                                  {carrier}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* eSIM & Wi-Fi Status */}
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-slate-50/50 dark:bg-white/[0.015] border border-slate-100 dark:border-white/[0.03] rounded-xl space-y-1.5 text-left">
                              <div className="flex items-center gap-1.5">
                                <Wifi size={11} className="text-emerald-500" />
                                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200">eSIM</span>
                              </div>
                              <span className="text-[8.5px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/15 inline-block">
                                Supported
                              </span>
                            </div>
                            <div className="p-3 bg-slate-50/50 dark:bg-white/[0.015] border border-slate-100 dark:border-white/[0.03] rounded-xl space-y-1.5 text-left">
                              <div className="flex items-center gap-1.5">
                                <Globe size={11} className="text-indigo-500" />
                                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200">Free Wi-Fi</span>
                              </div>
                              <span className="text-[8.5px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/15 inline-block">
                                Available
                              </span>
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Payment & Mobile Apps Details Row (Image 2 Budget style indicator) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                        
                        {/* Payments acceptance card */}
                        <div className="relative overflow-hidden rounded-2xl border border-slate-200/40 dark:border-white/[0.05] bg-white/60 dark:bg-slate-900/40 backdrop-blur-md p-6 space-y-4 shadow-sm text-left">
                          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono"><MapPin size={10} className="text-[var(--accent)] inline-block mr-1 -mt-0.5" /> Payment Acceptance</span>
                          <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-white/[0.015] border border-slate-100 dark:border-white/[0.03] flex items-center justify-between">
                            <div className="space-y-0.5">
                              <span className="text-[9px] text-slate-400 dark:text-slate-500 font-light block leading-none">Remaining budget this month</span>
                              <span className="text-sm font-extrabold text-[var(--text-primary)] block mt-1">Digital Payments Accepted</span>
                            </div>
                            <div className="w-11 h-11 rounded-full border-2 border-emerald-500/25 flex items-center justify-center bg-emerald-500/5">
                              <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 font-mono">85%</span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200/40 dark:border-white/[0.04]">
                            <div className="border-l-[3px] border-emerald-500 pl-3 space-y-0.5">
                              <span className="text-[8px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">Card Payments</span>
                              <span className="text-xs font-black text-[var(--text-primary)] block leading-tight">Widely Accepted</span>
                            </div>
                            <div className="border-l-[3px] border-amber-500 pl-3 space-y-0.5">
                              <span className="text-[8px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">Cash Acceptance</span>
                              <span className="text-xs font-black text-[var(--text-primary)] block leading-tight">Taxi & Markets</span>
                            </div>
                          </div>
                        </div>

                        {/* Mobile Apps card */}
                        <div className="relative overflow-hidden rounded-2xl border border-slate-200/40 dark:border-white/[0.05] bg-white/60 dark:bg-slate-900/40 backdrop-blur-md p-6 space-y-4 shadow-sm text-left min-h-[290px] pb-5">
                          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono"><MapPin size={10} className="text-[var(--accent)] inline-block mr-1 -mt-0.5" /> Essential Mobile Apps</span>
                          
                          <div className="space-y-2.5 pt-1">
                            {[
                              { name: 'Uber / Local Ride', desc: 'Ridesharing & local taxi booking app.', domain: 'uber.com' },
                              { name: 'Google Maps', desc: 'Transit directions, walking trails, and reviews.', domain: 'google.com' },
                              { name: 'Booking.com', desc: 'Hotel reservations and local stays check-in.', domain: 'booking.com' },
                              { name: 'Airalo eSIM', desc: 'Instant local eSIM purchase and data activation.', domain: 'airalo.com' }
                            ].map((app, idx) => (
                              <div key={idx} className="p-2 bg-slate-50/50 dark:bg-white/[0.015] border border-slate-100 dark:border-white/[0.03] rounded-xl flex items-center justify-between hover:scale-[1.01] transition-transform">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <img
                                    src={"https://logo.clearbit.com/" + app.domain}
                                    alt={app.name}
                                    onError={(e) => {
                                      e.target.src = 'https://www.google.com/s2/favicons?sz=64&domain=' + app.domain;
                                    }}
                                    className="w-7 h-7 rounded-lg border border-slate-100 dark:border-white/10 bg-white object-contain shrink-0"
                                  />
                                  <div className="min-w-0 text-left">
                                    <span className="text-[10px] font-bold text-slate-800 dark:text-white block leading-tight">{app.name}</span>
                                    <span className="text-[8px] text-slate-455 font-light block mt-0.5">{app.desc}</span>
                                  </div>
                                </div>
                                <span className="text-[9px] font-bold text-[var(--accent)] hover:underline cursor-pointer shrink-0 ml-2">Open</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        </div>

                      </div>
                  )}

                  {/* TAB 10: PHOTOS & VIDEOS GALLERY */}
                  {activeTab === 'gallery' && (
                    <div className="space-y-6">
                      
                      {/* Gallery filters */}
                      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 border-b border-[var(--border)]">
                        {[
                          { id: 'all', label: 'All Photos' },
                          { id: 'cities', label: 'Cities' },
                          { id: 'nature', label: 'Nature' },
                          { id: 'mountains', label: 'Mountains' },
                          { id: 'food', label: 'Food' },
                          { id: 'culture', label: 'Culture' },
                          { id: 'attractions', label: 'Attractions' },
                          { id: 'festivals', label: 'Festivals' },
                          { id: 'nightlife', label: 'Nightlife' }
                        ].map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => setGalleryFilter(cat.id)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                              galleryFilter === cat.id
                                ? 'bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20'
                                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 border border-transparent'
                            }`}
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>

                      {loadingCountryGallery ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {[1, 2, 3, 4, 5, 6].map((idx) => (
                            <div key={idx} className="aspect-square bg-slate-200 dark:bg-white/[0.04] rounded-2xl animate-pulse" />
                          ))}
                        </div>
                      ) : filteredImages.length > 0 ? (
                        <div className="columns-2 sm:columns-3 gap-4 space-y-4">
                          {filteredImages.map((img, idx) => (
                            <div
                              key={idx}
                              onClick={() => {
                                setCountryLightboxImg(img.url);
                                setShowCountryLightbox(true);
                              }}
                              className="break-inside-avoid relative rounded-2xl overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border)] cursor-pointer shadow-premium hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 group mb-4"
                            >
                              <img 
                                src={img.url} 
                                alt="" 
                                className="w-full h-auto object-cover max-h-[350px] transition-transform duration-500 group-hover:scale-103" 
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3.5">
                                <span className="text-[9px] uppercase font-mono font-bold text-white tracking-wider">
                                  {img.category}
                                </span>
                                <span className="text-[8px] font-mono text-slate-350">Zoom</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-10 border border-[var(--border)] rounded-2xl bg-slate-50/20 dark:bg-white/[0.01]">
                          <Camera className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                          <p className="text-xs text-slate-455 font-light">No images available for this filter. Select "All Photos" to browse available shots.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 11: COUNTRY FACTS */}
                  {activeTab === 'facts' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {apiLoading ? (
                          Array.from({ length: 12 }).map((_, idx) => (
                            <div key={idx} className="p-5 rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/50 dark:bg-white/[0.015] space-y-3 animate-pulse">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-slate-200 dark:bg-white/10 rounded-xl animate-pulse" />
                                <div className="space-y-1.5 flex-1">
                                  <div className="w-20 h-2.5 bg-slate-200 dark:bg-white/10 rounded animate-pulse" />
                                  <div className="w-28 h-4 bg-slate-200 dark:bg-white/10 rounded-lg animate-pulse" />
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          [
                            { label: 'Capital City', value: country.facts?.capital, icon: Building2, color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
                            { label: 'Population', value: country.facts?.population, icon: Users, color: 'bg-emerald-500/10 text-emerald-505 border-emerald-500/20' },
                            { label: 'Land Area', value: country.facts?.area, icon: Map, color: 'bg-amber-500/10 text-amber-505 border-amber-500/20' },
                            { label: 'Currency', value: country.facts?.currencyCode ? (country.facts.currencyName || 'N/A') + " (" + country.facts.currencyCode + (country.facts.currencySymbol ? ' ' + country.facts.currencySymbol : '') + ")" : 'N/A', icon: Coins, color: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20' },
                            { label: 'Languages', value: country.facts?.languages, icon: Globe, color: 'bg-indigo-500/10 text-indigo-505 border-indigo-500/20' },
                            { label: 'Time Zones', value: country.facts?.timezones, icon: Clock, color: 'bg-purple-500/10 text-purple-505 border-purple-500/20' },
                            { label: 'Driving Side', value: country.facts?.drivingSide, icon: Car, color: 'bg-rose-500/10 text-rose-500 border-rose-500/20' },
                            { label: 'Government', value: country.facts?.government || 'N/A', icon: Compass, color: 'bg-teal-500/10 text-teal-505 border-teal-500/20' },
                            { label: 'Calling Code', value: country.facts?.callingCode || 'N/A', icon: Smartphone, color: 'bg-sky-500/10 text-sky-505 border-sky-500/20' },
                            { label: 'National Flower', value: country.facts?.flower || 'N/A', icon: Award, color: 'bg-pink-500/10 text-pink-500 border-pink-500/20' },
                            { label: 'National Animal', value: country.facts?.animal || 'N/A', icon: Award, color: 'bg-orange-500/10 text-orange-505 border-orange-500/20' },
                            { label: 'National Anthem', value: country.facts?.anthem || 'N/A', icon: BookOpen, color: 'bg-violet-500/10 text-violet-505 border-violet-500/20' }
                          ].map((fact, idx) => {
                            const FactIcon = fact.icon;
                            return (
                              <div key={idx} className="group/card relative overflow-hidden rounded-2xl border border-slate-200/50 dark:border-white/[0.05] bg-white/60 dark:bg-slate-900/40 backdrop-blur-md p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full text-left">
                                <div className="space-y-4">
                                  {/* Top Badging Row matching Image 1 */}
                                  <div className="flex justify-between items-center">
                                    <div className={"w-8 h-8 rounded-xl flex items-center justify-center border shrink-0 " + fact.color}>
                                      <FactIcon size={14} />
                                    </div>
                                    <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-white/10" />
                                  </div>

                                  {/* Value and Label in the middle */}
                                  <div className="space-y-1">
                                    <span className="text-sm font-extrabold text-[var(--text-primary)] block leading-snug truncate" title={typeof fact.value === 'string' ? fact.value : ''}>
                                      {fact.value || 'N/A'}
                                    </span>
                                    <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block font-heading">
                                      {fact.label}
                                    </span>
                                  </div>
                                </div>

                                {/* Learn more button (Image 1 style) */}
                                <button className="w-full mt-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-white/[0.02] dark:hover:bg-white/[0.06] text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors border border-slate-200/50 dark:border-white/[0.04] cursor-pointer text-center">
                                  Details Overview
                                </button>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

            {/* Right Column: Side panel widgets */}
            <div className="col-span-12 lg:col-span-4 space-y-6 animate-fade-in">
              
                  {/* Travel Readiness Score Widget */}
              <div className="relative overflow-hidden rounded-[28px] border border-slate-200/40 dark:border-white/[0.05] bg-white/60 dark:bg-slate-900/40 backdrop-blur-md p-6 space-y-4.5 shadow-[0_8px_32px_rgba(0,0,0,0.02)]">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500" />
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/[0.03] pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[var(--accent)]/10 rounded-xl">
                      <Activity size={15} className="text-[var(--accent)]" />
                    </div>
                    <h4 className="text-xs uppercase font-extrabold tracking-widest font-heading text-slate-800 dark:text-slate-200">Travel Readiness</h4>
                  </div>
                  <span className="text-[9px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Interactive Chart</span>
                </div>

                <div className="space-y-4">
                  {(() => {
                    const s1 = parseFloat(country.readiness?.safety || 8.0);
                    const s2 = parseFloat(country.readiness?.affordability || 5.0);
                    const s3 = parseFloat(country.readiness?.accessibility || 8.0);
                    const s4 = parseFloat(country.readiness?.family || 8.0);
                    const s5 = parseFloat(country.readiness?.solo || 8.0);
                    const totalSum = s1 + s2 + s3 + s4 + s5;
                    const avgScore = totalSum / 5;

                    const readinessMetrics = [
                      { 
                        label: 'Safety Index', 
                        score: s1, 
                        color: '#10B981', 
                        bulletClass: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]',
                        accentClass: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
                        desc: 'Overall safety level, police presence, emergency service responsiveness, and local security protocol compliance.',
                        icon: Shield
                      },
                      { 
                        label: 'Affordability', 
                        score: s2, 
                        color: '#F59E0B', 
                        bulletClass: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]',
                        accentClass: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
                        desc: 'Value of local pricing index, affordable dining alternatives, transport systems, and lodging rates.',
                        icon: DollarSign
                      },
                      { 
                        label: 'Accessibility', 
                        score: s3, 
                        color: '#3B82F6', 
                        bulletClass: 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]',
                        accentClass: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
                        desc: 'Public rail connectivity, sidewalk wheelchair accessibility, international flights, and bilingual signage.',
                        icon: Globe
                      },
                      { 
                        label: 'Family Friendliness', 
                        score: s4, 
                        color: '#6366F1', 
                        bulletClass: 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.4)]',
                        accentClass: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
                        desc: 'Availability of children parks, kid menus, family lodgings, stroller pathways, and safety assurance.',
                        icon: ShieldAlert
                      },
                      { 
                        label: 'Solo Traveler Rating', 
                        score: s5, 
                        color: '#EC4899', 
                        bulletClass: 'bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.4)]',
                        accentClass: 'text-pink-500 bg-pink-500/10 border-pink-500/20',
                        desc: 'Solo traveler safety tracks, hostel density, ease of networking, and general local community friendliness.',
                        icon: Navigation
                      }
                    ];

                    const activeMetric = readinessMetrics[activeReadinessIdx];
                    const ActiveIcon = activeMetric.icon;

                    let cumulativeScore = 0;

                    return (
                      <div className="space-y-4">
                        <div className="p-4 bg-slate-50/50 dark:bg-white/[0.015] border border-slate-100 dark:border-white/[0.03] rounded-2xl flex items-center justify-between text-left">
                          <div className="space-y-0.5">
                            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-555 uppercase tracking-wider font-mono flex items-center gap-1">
                              <MapPin size={10} className="text-[var(--accent)]" /> Travel Readiness
                            </span>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-2xl font-black font-heading text-[var(--text-primary)] leading-none">
                                {avgScore.toFixed(1)}
                              </span>
                              <span className="text-[10px] text-slate-400 font-normal">/ 10</span>
                            </div>
                          </div>
                          <span className="text-[7.5px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/15">
                            {avgScore >= 8.0 ? 'EXCELLENT' : avgScore >= 6.0 ? 'GOOD' : 'MODERATE'}
                          </span>
                        </div>

                        <div className="relative">
                          <div className={`space-y-4 transition-all duration-300 ${!user ? 'filter blur-[5px] select-none pointer-events-none opacity-25' : ''}`}>
                            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6 items-center p-4 bg-slate-50/50 dark:bg-white/[0.015] border border-slate-100/80 dark:border-white/[0.03] rounded-3xl">
                              <div className="space-y-3.5 text-left">
                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-555 uppercase tracking-wider font-mono">Breakdown Metrics</span>
                                <div className="space-y-2 pt-1 border-t border-slate-200/40 dark:border-white/[0.04]">
                                  {readinessMetrics.map((item, idx) => {
                                    const isSelected = activeReadinessIdx === idx;
                                    return (
                                      <button
                                        key={idx}
                                        onClick={() => setActiveReadinessIdx(idx)}
                                        className={"flex items-center gap-2.5 text-left w-full cursor-pointer group/bullet transition-all " + (isSelected ? "scale-[1.02]" : "opacity-75 hover:opacity-100")}
                                      >
                                        <div className={"w-2.5 h-2.5 rounded-sm shrink-0 transition-transform group-hover/bullet:scale-110 " + item.bulletClass} />
                                        <span className={"text-[10px] font-bold truncate " + (isSelected ? "text-[var(--text-primary)] font-black" : "text-slate-500 dark:text-slate-400")}>
                                          {item.label}
                                        </span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              <div className="flex justify-center">
                                <div className="relative w-36 h-36 flex items-center justify-center">
                                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                                    <circle cx="80" cy="80" r="52" strokeWidth="12" fill="transparent" className="stroke-slate-100/50 dark:stroke-white/[0.02]" />
                                    {readinessMetrics.map((metric, idx) => {
                                      const isSelected = activeReadinessIdx === idx;
                                      const sliceAngle = (metric.score / totalSum) * 360;
                                      const startAngle = (cumulativeScore / totalSum) * 360;
                                      const length = (metric.score / totalSum) * 326.72;
                                      const offset = -((cumulativeScore / totalSum) * 326.72);
                                      cumulativeScore += metric.score;
                                      const gapReduction = 11.5;
                                      const visualLength = Math.max(2, length - gapReduction);
                                      const visualGap = 326.72 - visualLength;

                                      return (
                                        <g key={idx} className="cursor-pointer" onClick={() => setActiveReadinessIdx(idx)}>
                                          <circle
                                            cx="80"
                                            cy="80"
                                            r="52"
                                            strokeWidth={isSelected ? "17" : "12"}
                                            strokeLinecap="round"
                                            fill="transparent"
                                            stroke={metric.color}
                                            strokeDasharray={visualLength + " " + visualGap}
                                            strokeDashoffset={offset}
                                            className={"transition-all duration-500 origin-center " + (isSelected ? "opacity-100" : "opacity-45 hover:opacity-75")}
                                            style={{ filter: isSelected ? "drop-shadow(0 0 8px " + metric.color + "75)" : "none" }}
                                          />
                                        </g>
                                      );
                                    })}
                                  </svg>
                                  <div className="absolute w-22 h-22 rounded-full bg-white/75 dark:bg-slate-950/80 backdrop-blur-xl border border-slate-200/50 dark:border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.45)] flex flex-col items-center justify-center pointer-events-none select-none">
                                    <span className="text-[22px] font-black font-heading text-slate-900 dark:text-white leading-none">{activeMetric.score.toFixed(1)}</span>
                                    <span className="text-[6.5px] font-mono tracking-widest text-slate-400 dark:text-slate-550 uppercase font-black mt-1.5 leading-none">{activeMetric.label.split(' ')[0]}</span>
                                    <span className="text-[6px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/15 mt-1.5 leading-none scale-90">
                                      {activeMetric.score >= 8.0 ? 'EXCELLENT' : activeMetric.score >= 6.0 ? 'GOOD' : 'MODERATE'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="p-4 bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-white/[0.05] rounded-2xl space-y-2 relative overflow-hidden transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.01)] animate-fade-in" key={activeReadinessIdx}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className={"p-1.5 rounded-lg border " + activeMetric.accentClass + " shrink-0"}>
                                    <ActiveIcon size={11} />
                                  </div>
                                  <span className="text-2xs font-extrabold text-[var(--text-primary)]">{activeMetric.label}</span>
                                </div>
                                <span className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                  {activeMetric.score >= 8 ? 'Excellent' : activeMetric.score >= 6 ? 'Good' : 'Moderate'}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-light leading-relaxed text-left">
                                {activeMetric.desc}
                              </p>
                            </div>
                          </div>

                          {!user && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
                              <div className="w-full max-w-[240px] bg-white/40 dark:bg-slate-950/40 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl shadow-lg p-5 text-center space-y-3">
                                <Lock className="w-4 h-4 text-amber-500 dark:text-amber-400 animate-bounce mx-auto" />
                                <h5 className="font-heading font-extrabold text-xs text-slate-900 dark:text-white leading-tight">Unlock Breakdown</h5>
                                <p className="text-[10px] text-slate-750 dark:text-slate-300 font-light leading-relaxed">Create a free account to unlock safety, cost, and access breakdowns.</p>
                                <Link to="/auth" state={{ mode: 'signup', from: location.pathname }} className="w-full h-8.5 rounded-xl bg-gradient-to-r from-[var(--accent)] to-indigo-600 text-white font-bold text-[10px] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-1 shadow-md cursor-pointer">
                                  <span>Create Your Account</span>
                                  <ArrowRight className="w-3 h-3" />
                                </Link>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Live Currency Converter Widget */}
              <div className="relative overflow-hidden rounded-[28px] border border-slate-200/40 dark:border-white/[0.05] bg-white/60 dark:bg-slate-900/40 backdrop-blur-md p-6 space-y-4.5 shadow-[0_8px_32px_rgba(0,0,0,0.02)]">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500" />
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/[0.03] pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500/10 rounded-xl">
                      <Coins size={15} className="text-amber-500 animate-spin-slow" />
                    </div>
                    <h4 className="text-xs uppercase font-extrabold tracking-widest font-heading text-slate-800 dark:text-slate-200">Live Cost Converter</h4>
                  </div>
                  {/* Live Rates Pulsing indicator */}
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-500 group relative cursor-pointer">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span>Live Rates</span>
                    <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-slate-950 text-white text-[9px] py-1.5 px-3 rounded-xl shadow-lg whitespace-nowrap z-50">
                      {ratesSource === 'api' ? 'Fetched live from CurrencyFreaks' : ratesSource === 'cache' ? `Cached rates (updated ${new Date(ratesUpdated).toLocaleTimeString()})` : 'Live API Active'}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-white/5 px-4 py-3 rounded-2xl focus-within:border-[var(--accent)]/30 focus-within:ring-1 focus-within:ring-[var(--accent)]/10 transition-all">
                    <div className="text-left flex-1 space-y-0.5">
                      <span className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 font-heading block">You Pay (USD)</span>
                      <input 
                        type="number"
                        value={isConvertingToLocal ? convertAmount : getConvertedCurrency()}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          if (isConvertingToLocal) {
                            setConvertAmount(val);
                          } else {
                            setConvertAmount(val * activeRate);
                          }
                        }}
                        className="bg-transparent border-none p-0 focus:ring-0 focus:outline-none w-full text-sm font-bold text-slate-850 dark:text-slate-100 font-mono"
                      />
                    </div>
                    <span className="text-xs font-bold font-heading text-slate-500 bg-slate-100 dark:bg-white/10 px-2.5 py-1 rounded-lg">USD ($)</span>
                  </div>

                  {/* Swap Arrow Button */}
                  <div className="flex justify-center -my-2 relative z-10">
                    <button 
                      onClick={() => setIsConvertingToLocal(prev => !prev)}
                      className="p-2 rounded-full border border-slate-250/50 dark:border-white/10 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 hover:text-[var(--accent)] transition-all shadow-md hover:scale-110 cursor-pointer"
                      title="Swap currencies"
                    >
                      <ArrowLeftRight size={13} className={isConvertingToLocal ? "" : "rotate-180"} />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-white/5 px-4 py-3 rounded-2xl focus-within:border-[var(--accent)]/30 focus-within:ring-1 focus-within:ring-[var(--accent)]/10 transition-all">
                    <div className="text-left flex-1 space-y-0.5">
                      <span className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 font-heading block">
                        You Get ({country.facts?.currencyCode || selectedCountryObj.basic?.currency?.code})
                      </span>
                      <input 
                        type="number"
                        value={isConvertingToLocal ? getConvertedCurrency() : convertAmount}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          if (isConvertingToLocal) {
                            setConvertAmount(val / activeRate);
                          } else {
                            setConvertAmount(val);
                          }
                        }}
                        className="bg-transparent border-none p-0 focus:ring-0 focus:outline-none w-full text-sm font-bold text-slate-850 dark:text-slate-100 font-mono"
                      />
                    </div>
                    <span className="text-xs font-bold font-heading text-slate-555 bg-slate-100 dark:bg-white/10 px-2.5 py-1 rounded-lg">
                      {country.facts?.currencyCode || selectedCountryObj.basic?.currency?.code} ({country.facts?.currencySymbol || selectedCountryObj.basic?.currency?.symbol})
                    </span>
                  </div>
                  
                  <div className="text-[10px] text-slate-450 dark:text-slate-500 text-center font-light leading-none pt-1">
                    1 USD = <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{activeRate.toFixed(4)}</span> {country.facts?.currencyCode || selectedCountryObj.basic?.currency?.code}
                  </div>
                </div>
              </div>

              {/* AI Travel Insights Widget */}
              <div className="relative overflow-hidden rounded-[28px] border border-slate-200/40 dark:border-white/[0.05] bg-white/60 dark:bg-slate-900/40 backdrop-blur-md p-6 space-y-4.5 shadow-[0_8px_32px_rgba(0,0,0,0.02)]">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                <div className="flex items-center gap-3 border-b border-slate-100 dark:border-white/[0.03] pb-3">
                  <div className="p-2 bg-purple-500/10 rounded-xl">
                    <Sparkles size={15} className="text-purple-500 animate-pulse" />
                  </div>
                  <h4 className="text-xs uppercase font-extrabold tracking-widest font-heading text-slate-800 dark:text-slate-200">AI Travel Insights</h4>
                </div>
                <div className="space-y-4 text-xs font-body">
                  <div className="space-y-1 p-3 bg-slate-50/50 dark:bg-white/[0.01] rounded-2xl border border-slate-100/50 dark:border-white/[0.02]">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">Why Travelers Love This Country</span>
                    <p className="font-light text-slate-600 dark:text-slate-350 leading-relaxed">{country.insights?.whyLove || 'Beautiful landscapes and rich culture.'}</p>
                  </div>
                  <div className="space-y-1 p-3 bg-red-50/50 dark:bg-red-500/[0.02] rounded-2xl border border-red-150/20 dark:border-red-500/10">
                    <span className="font-bold text-red-500 block mb-0.5">Common Mistakes Visitors Make</span>
                    <p className="font-light text-slate-600 dark:text-slate-350 leading-relaxed">{country.insights?.mistakes || 'Not planning transit options in advance.'}</p>
                  </div>
                  <div className="space-y-1 p-3 bg-amber-50/50 dark:bg-amber-500/[0.02] rounded-2xl border border-amber-150/20 dark:border-amber-500/10">
                    <span className="font-bold text-amber-600 dark:text-amber-500 block mb-0.5">Hidden Gems</span>
                    <p className="font-light text-slate-600 dark:text-slate-350 leading-relaxed">{country.insights?.hiddenGems || 'Tranquil waterfalls and forest valleys.'}</p>
                  </div>
                  <div className="space-y-1 p-3 bg-blue-50/50 dark:bg-blue-500/[0.02] rounded-2xl border border-blue-150/20 dark:border-blue-500/10">
                    <span className="font-bold text-indigo-500 dark:text-indigo-400 block mb-0.5">Local Secrets</span>
                    <p className="font-light text-slate-600 dark:text-slate-350 leading-relaxed">{country.insights?.secrets || 'Eat at neighborhood diners to save on costs.'}</p>
                  </div>
                </div>
              </div>

              {/* Quick Travel Checklist Widget */}
              <div className="relative overflow-hidden rounded-[28px] border border-slate-200/40 dark:border-white/[0.05] bg-white/60 dark:bg-slate-900/40 backdrop-blur-md p-6 space-y-4.5 shadow-[0_8px_32px_rgba(0,0,0,0.02)]">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500" />
                <div className="flex items-center gap-3 border-b border-slate-100 dark:border-white/[0.03] pb-3">
                  <div className="p-2 bg-teal-500/10 rounded-xl">
                    <CheckCircle2 size={15} className="text-teal-500" />
                  </div>
                  <h4 className="text-xs uppercase font-extrabold tracking-widest font-heading text-slate-800 dark:text-slate-200">Travel Checklist</h4>
                </div>
                <div className="space-y-3">
                  {checklistState.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => toggleChecklistItem(item.id)}
                      className="w-full flex items-start gap-3 text-left group cursor-pointer"
                    >
                      <div className={`mt-0.5 w-4.5 h-4.5 rounded-lg border flex items-center justify-center transition-all shrink-0 ${
                        item.checked 
                          ? 'bg-[var(--accent)] border-transparent text-white shadow-sm' 
                          : 'border-slate-300 dark:border-white/20 group-hover:border-slate-400 dark:group-hover:border-white/30'
                      }`}>
                        {item.checked && <Check size={11} strokeWidth={3.5} />}
                      </div>
                      <span className={`text-xs font-light transition-all leading-tight ${
                        item.checked 
                          ? 'text-slate-400 dark:text-slate-500 line-through decoration-slate-400/50' 
                          : 'text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-slate-100'
                      }`}>
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    )}
  </div>
)}

      {/* ── CITY DEEP DIVE GLASSMORPHISM DRAWER ─────────────────────────── */}
      {activeCityDeepDive && (
        <>
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-[80] transition-opacity duration-300"
            onClick={() => setActiveCityDeepDive(null)}
          />
          
          {/* Side Drawer Panel */}
          <aside className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white dark:bg-[#081125] border-l border-slate-200 dark:border-white/[0.08] shadow-[0_0_60px_rgba(0,0,0,0.25)] dark:shadow-[0_0_60px_rgba(0,0,0,0.65)] z-[90] flex flex-col justify-between transition-transform duration-300 animate-slide-in text-left">
            
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-200 dark:border-white/[0.05] flex items-center justify-between bg-slate-50 dark:bg-slate-950/20">
              <div className="space-y-0.5">
                <span className="text-[9px] font-heading text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-widest block">City Deep Dive</span>
                <h3 className="text-xl font-black font-heading text-slate-900 dark:text-white leading-tight">
                  {activeCityDeepDive.name} Profile
                </h3>
              </div>
              
              <button
                onClick={() => setActiveCityDeepDive(null)}
                className="w-8 h-8 rounded-full bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-white/[0.08] flex items-center justify-center text-slate-550 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-white/5 transition-all cursor-pointer shadow-3xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
              
              {/* Overview & Description Section */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400 dark:text-slate-500 font-heading block">Overview & Context</span>
                <p className="text-xs font-light text-slate-655 dark:text-slate-300 leading-relaxed font-body text-left">
                  {activeCityDeepDive.overview}
                </p>
              </div>

              {/* City KPI grid (Image 2 style with premium text) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.015] border border-slate-200/50 dark:border-white/[0.04] space-y-2 text-left">
                  <span className="text-[8.5px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-extrabold font-heading block">City Population</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white block leading-tight">{activeCityDeepDive.population}</span>
                </div>
                
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.015] border border-slate-200/50 dark:border-white/[0.04] space-y-2 text-left">
                  <span className="text-[8.5px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-extrabold font-heading block">Best Visit Season</span>
                  <span className="text-xs font-black text-slate-900 dark:text-white block leading-snug">{activeCityDeepDive.bestTimeToVisit}</span>
                </div>
              </div>

              {/* Suitability score bars (Image 2 progress bars) */}
              <div className="p-5 rounded-2xl border border-slate-200/50 dark:border-white/[0.04] bg-slate-50 dark:bg-white/[0.01] space-y-4">
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400 dark:text-slate-500 block font-heading text-left">AI Metric Dashboard</span>
                
                <div className="space-y-4">
                  {[
                    { label: 'Cost of Living Index', val: parseInt(activeCityDeepDive.costOfLiving) || 65, desc: activeCityDeepDive.costOfLiving, color: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]' },
                    { label: 'Safety Index Level', val: parseInt(activeCityDeepDive.safety) || 80, desc: activeCityDeepDive.safety, color: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' }
                  ].map((bar, idx) => (
                    <div key={idx} className="space-y-2 text-left">
                      <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 leading-none font-heading">
                        <span>{bar.label}</span>
                        <span className="font-mono text-slate-500 dark:text-slate-400">{bar.desc}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 dark:bg-white/[0.06] rounded-full overflow-hidden">
                        <div className={"h-full " + bar.color + " rounded-full transition-all duration-1000"} style={{ width: bar.val + "%" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed fields (Image 2 styles) */}
              <div className="space-y-5">
                {[
                  { title: 'Historic Significance', val: activeCityDeepDive.history, icon: Clock },
                  { title: 'Cultural Identity', val: activeCityDeepDive.culture, icon: Milestone },
                  { title: 'Major Attractions', val: activeCityDeepDive.attractions, icon: Compass },
                  { title: 'Traditional Foods', val: activeCityDeepDive.foodSpecialties, icon: UtensilsCrossed },
                  { title: 'Local Transportation', val: activeCityDeepDive.transportation, icon: Clock },
                  { title: 'Nearby Destinations', val: activeCityDeepDive.nearbyDestinations, icon: Map }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex gap-4 items-start text-xs font-light leading-relaxed font-body text-left">
                      <div className="w-6.5 h-6.5 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center shrink-0 mt-0.5 border border-[var(--accent)]/15">
                        <Icon size={13} />
                      </div>
                      <div className="space-y-0.5">
                        <span className="font-extrabold text-[12px] text-slate-800 dark:text-slate-200 font-heading block">{item.title}</span>
                        <span className="text-[11px] text-slate-550 dark:text-slate-400 block leading-relaxed">{item.val}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* YouTube Travel Experience for Active City */}
              <div className="pt-6 border-t border-slate-200/50 dark:border-white/[0.04]">
                <YouTubeTravelSection destination={activeCityDeepDive.name} />
              </div>

            </div>

            {/* Drawer Footer CTA */}
            <div className="p-6 border-t border-slate-200 dark:border-white/[0.05] bg-slate-50 dark:bg-slate-950/20">
              <button
                onClick={() => {
                  setActiveCityDeepDive(null);
                  navigate(`/destinations`); // Route directly to worldwide travel explorer
                }}
                className="w-full py-3 rounded-none text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-premium cursor-pointer bg-[var(--accent)] hover:bg-[var(--accent)]/85 text-white"
              >
                <span>Browse Destinations Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </aside>
        </>
      )}

      {/* ── PREMIUM LOCK MODAL FOR GUEST USERS ── */}
      {lockModalTab && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-sm px-6">
          <div className="w-full max-w-sm bg-white/90 dark:bg-[#0c1223]/95 backdrop-blur-2xl border border-slate-200/50 dark:border-white/[0.08] rounded-2xl shadow-2xl p-6 text-center space-y-4 relative transform hover:scale-[1.01] transition-transform duration-500 animate-fade-in">
            {/* Close Button */}
            <button 
              onClick={() => setLockModalTab(null)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="relative">
              <Lock className="w-5 h-5 text-amber-500 dark:text-amber-400 animate-bounce mx-auto mb-1" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-heading font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-tight">
                Unlock {lockModalTab} Section
              </h3>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-light leading-relaxed max-w-xs mx-auto">
                Create a free account to unlock local budgets, transit guides, weather insights, food etiquette, and other premium travel features.
              </p>
            </div>

            <div className="pt-1 flex flex-col gap-2">
              <Link 
                to="/auth" 
                state={{ mode: 'signup', from: location.pathname }}
                onClick={() => setLockModalTab(null)}
                className="w-full h-10 rounded-xl bg-gradient-to-r from-[var(--accent)] to-indigo-600 text-white font-bold text-[11px] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                <span>Create Your Account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => setLockModalTab(null)}
                className="w-full h-10 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-slate-700 dark:text-white font-bold text-[11px] transition-all cursor-pointer border border-slate-200 dark:border-white/10"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SIDE-BY-SIDE COUNTRY COMPARISON ENGINE MODAL ────────────────── */}
      {showCompareModal && (
        <>
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-[100] transition-opacity duration-300"
            onClick={() => setShowCompareModal(false)}
          />
          
          {/* Center Modal */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[28px] shadow-premium z-[110] flex flex-col justify-between animate-fade-in text-left max-h-[85vh] overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-[var(--border)] flex items-center justify-between bg-[var(--bg-primary)]/10">
              <div className="space-y-0.5">
                <span className="text-[8px] font-mono text-slate-450 block uppercase">METRIC ENGINE</span>
                <h3 className="text-base font-black font-heading text-[var(--text-primary)]">
                  Side-by-Side Country Comparison
                </h3>
              </div>
              
              <button
                onClick={() => setShowCompareModal(false)}
                className="w-8 h-8 rounded-full bg-[var(--bg-primary)] border border-[var(--border)] flex items-center justify-center text-slate-550 hover:bg-slate-100 dark:hover:bg-white/5 transition-all cursor-pointer shadow-3xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
              
              {/* Selectors grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[8px] uppercase tracking-wider text-slate-500 font-bold mb-1">Country A</label>
                  <select
                    value={compareCountryA}
                    onChange={(e) => setCompareCountryA(e.target.value)}
                    className="w-full bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border)] px-3 py-2 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[var(--accent)] font-semibold"
                  >
                    {sortedCountryKeys.map((key) => (
                      <option key={key} value={key}>{countriesData[key].name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[8px] uppercase tracking-wider text-slate-500 font-bold mb-1">Country B</label>
                  <select
                    value={compareCountryB}
                    onChange={(e) => setCompareCountryB(e.target.value)}
                    className="w-full bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border)] px-3 py-2 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[var(--accent)] font-semibold"
                  >
                    {sortedCountryKeys.map((key) => (
                      <option key={key} value={key}>{countriesData[key].name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dynamic comparative bar graphs */}
              <div className="space-y-5 pt-3">
                {[
                  { metric: 'Safety Index Score', valA: compareCountryA === 'switzerland' || compareCountryA === 'japan' || compareCountryA === 'australia' ? 90 : 75, valB: compareCountryB === 'switzerland' || compareCountryB === 'japan' || compareCountryB === 'australia' ? 90 : 75, colorA: 'bg-blue-500', colorB: 'bg-emerald-500' },
                  { metric: 'Cost of Living Index', valA: compareCountryA === 'switzerland' || compareCountryA === 'japan' ? 95 : 65, valB: compareCountryB === 'switzerland' || compareCountryB === 'japan' ? 95 : 65, colorA: 'bg-amber-500', colorB: 'bg-orange-500' },
                  { metric: 'Traveler Suitability Index', valA: 92, valB: 88, colorA: 'bg-purple-500', colorB: 'bg-indigo-500' },
                  { metric: 'UNESCO Sites density', valA: compareCountryA === 'italy' || compareCountryA === 'spain' ? 95 : 60, valB: compareCountryB === 'italy' || compareCountryB === 'spain' ? 95 : 60, colorA: 'bg-rose-500', colorB: 'bg-pink-500' }
                ].map((graph, idx) => (
                  <div key={idx} className="space-y-2 border-b border-[var(--border)] pb-4 last:border-0">
                    <span className="text-[10px] font-extrabold uppercase text-slate-550 dark:text-slate-355 tracking-wider block font-heading">{graph.metric}</span>
                    
                    <div className="space-y-1.5 text-xs">
                      {/* Country A bar */}
                      <div className="space-y-0.5">
                        <div className="flex justify-between font-mono text-[9px] text-slate-500 font-bold uppercase leading-none">
                          <span>{countriesData[compareCountryA]?.name}</span>
                          <span>{graph.valA}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 dark:bg-white/[0.08] rounded-full overflow-hidden">
                          <div className={`h-full ${graph.colorA} rounded-full`} style={{ width: `${graph.valA}%` }} />
                        </div>
                      </div>

                      {/* Country B bar */}
                      <div className="space-y-0.5">
                        <div className="flex justify-between font-mono text-[9px] text-slate-500 font-bold uppercase leading-none">
                          <span>{countriesData[compareCountryB]?.name}</span>
                          <span>{graph.valB}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 dark:bg-white/[0.08] rounded-full overflow-hidden">
                          <div className={`h-full ${graph.colorB} rounded-full`} style={{ width: `${graph.valB}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-[var(--border)] bg-[var(--bg-primary)]/10">
              <button
                onClick={() => setShowCompareModal(false)}
                className="w-full btn-primary py-3 rounded-xl text-xs font-semibold flex items-center justify-center cursor-pointer shadow-premium"
              >
                Close Comparison
              </button>
            </div>

          </div>
        </>
      )}

      {/* ─── CENTERED TRANSPORTATION ROUTE GUIDE POPUP MODAL (APPLE/AIRBNB DESIGN) ─── */}
      {selectedTransitGuide && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-6 bg-slate-950/75 backdrop-blur-[20px] animate-fade-in text-left">
          {/* Backdrop Overlay Click Handler */}
          <div className="absolute inset-0 cursor-pointer" onClick={() => setSelectedTransitGuide(null)} />
          
          {/* Modal Container */}
          <div className="w-full max-w-4xl max-h-[90vh] bg-[#0c1426]/95 border border-white/[0.12] rounded-[30px] shadow-[0_32px_80px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col relative z-10 animate-scale-in text-white">
            
            {/* STICKY HEADER */}
            <div className="px-8 py-5 border-b border-white/[0.08] bg-slate-950/60 backdrop-blur-md flex items-center justify-between z-20 sticky top-0">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-lg leading-none">{selectedTransitGuide.trans.type === 'Train Network' ? '🚆' : selectedTransitGuide.trans.type === 'Bus System' ? '🚌' : selectedTransitGuide.trans.type === 'Metro & Subway' ? '🚇' : selectedTransitGuide.trans.type === 'Ride Sharing' ? '🚖' : selectedTransitGuide.trans.type === 'Car Rental' ? '🚗' : '✈'}</span>
                  <h3 className="font-heading text-base font-black tracking-tight text-white">{selectedTransitGuide.trans.type}</h3>
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[8px] font-bold text-blue-400 uppercase tracking-widest">
                    ★ Best Choice
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-bold text-emerald-400 uppercase tracking-widest">
                    💰 Budget Friendly
                  </span>
                </div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  {selectedCountryKey.toUpperCase()} ROUTE MAP • {country.capital || 'Capital'} → {country.cities?.[0]?.name || 'Hub'}
                </span>
              </div>
              
              <button 
                onClick={() => setSelectedTransitGuide(null)}
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white cursor-pointer shadow transition-all hover:scale-105 active:scale-95"
              >
                ×
              </button>
            </div>

            {/* SCROLLABLE CONTENT BODY */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              
              {/* HERO BANNER SECTION */}
              <div className="relative rounded-2xl overflow-hidden aspect-[21/9] border border-white/[0.06] group shadow-inner">
                <img 
                  src={selectedTransitGuide.guide.image} 
                  alt={selectedTransitGuide.trans.type} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 flex justify-between items-end">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-widest font-black text-blue-400 block font-mono">PRIMARY OPERATOR</span>
                    <h4 className="text-lg font-black text-white leading-tight">{selectedTransitGuide.guide.operator}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] uppercase tracking-widest font-black text-slate-400 block font-mono">AVERAGE RATING</span>
                    <span className="text-base font-black text-amber-400">★ {selectedTransitGuide.tData.conv || '4.5'}</span>
                  </div>
                </div>
              </div>

              {/* STATS OVERVIEW CARDS */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Distance Vector', val: selectedTransitGuide.trans.type === 'Domestic Flights' ? 'Approx. 750 km' : 'Approx. 375 km', icon: MapPin },
                  { label: 'Estimated Duration', val: selectedTransitGuide.trans.type === 'Train Network' ? '4 hr 20 min' : selectedTransitGuide.trans.type === 'Bus System' ? '5h 15m' : selectedTransitGuide.trans.type === 'Metro & Subway' ? '30 mins' : '1h 05m', icon: Clock },
                  { label: 'Economy Base Fare', val: selectedTransitGuide.guide.fares.economy || 'Free', icon: Coins },
                  { label: 'Operating Hours', val: selectedTransitGuide.trans.type === 'Ride Sharing' ? '24/7 Service' : '06:00 AM – 11:30 PM', icon: Compass }
                ].map((stat, sIdx) => {
                  const StatIcon = stat.icon;
                  return (
                    <div key={sIdx} className="p-4 bg-slate-900/60 border border-white/[0.06] rounded-xl flex items-start gap-3 shadow-xs">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                        <StatIcon className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5 text-left leading-tight">
                        <span className="text-[8px] uppercase tracking-wider text-slate-500 font-extrabold">{stat.label}</span>
                        <span className="text-xs font-bold text-white block truncate max-w-[140px]">{stat.val}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* TIMELINE ROUTE MAP STOPS (if available) */}
              {selectedTransitGuide.guide.stops && (
                <div className="p-6 bg-slate-900/40 border border-white/[0.05] rounded-2xl space-y-4">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Milestone className="w-4 h-4 text-blue-400" /> Route & Checkpoints Timeline
                  </h5>
                  
                  <div className="relative pl-6 space-y-5">
                    {/* Vertical dashed line */}
                    <div className="absolute left-2 top-2 bottom-6 w-px border-l border-dashed border-white/10 pointer-events-none" />
                    
                    {selectedTransitGuide.guide.stops.map((stop, sIdx) => (
                      <div key={sIdx} className="relative flex justify-between items-center text-xs">
                        {/* Timeline Bullet */}
                        <div className="absolute left-[-20.5px] top-1 w-3.5 h-3.5 rounded-full bg-slate-950 border border-blue-500 flex items-center justify-center z-10">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        </div>
                        
                        <div className="text-left space-y-0.5">
                          <span className="font-bold text-white block">{stop.name}</span>
                          <span className="text-[9px] text-slate-550 font-semibold">Platform: {stop.platform} • Stay: {stop.stay}</span>
                        </div>
                        
                        <div className="text-right leading-none">
                          <span className="text-[10px] font-bold text-blue-400 block">{stop.dep !== '--' ? stop.dep : stop.arr}</span>
                          <span className="text-[8px] text-slate-655 font-mono">Checked</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SCHEDULE SELECTION CHIPS */}
              {selectedTransitGuide.guide.schedules && (
                <div className="space-y-3">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-blue-400" /> Select Departure Schedule
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedTransitGuide.guide.schedules.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedScheduleTime(time)}
                        className={'px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all border cursor-pointer ' + (selectedScheduleTime === time ? 'bg-blue-600 border-transparent text-white shadow-lg' : 'bg-white/5 border-white/[0.08] text-slate-350 hover:bg-white/10')}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* FARE OPTIONS */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-blue-400" /> Ticket Pricing Options
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { title: 'Economy Class', price: selectedTransitGuide.guide.fares.economy, desc: 'Standard seating, clean amenities, and luggage support.' },
                    { title: 'Business Class', price: selectedTransitGuide.guide.fares.business, desc: 'Priority check-in, extra legroom, hot meals included.' },
                    { title: 'Executive / First', price: selectedTransitGuide.guide.fares.executive, desc: 'Fully reclining berths, individual power terminals, private cabin access.' }
                  ].map((fare, fIdx) => (
                    <div key={fIdx} className="p-5 bg-slate-900/60 border border-white/[0.06] rounded-xl text-left flex flex-col justify-between gap-4">
                      <div className="space-y-1">
                        <span className="block text-2xs font-extrabold uppercase tracking-widest text-slate-500">{fare.title}</span>
                        <span className="block text-lg font-black text-blue-400 font-mono">{fare.price || 'Not Available'}</span>
                        <p className="text-[10px] text-slate-400 font-light leading-relaxed">{fare.desc}</p>
                      </div>
                      <span className="text-[8px] uppercase tracking-widest font-black text-slate-500 block leading-none">SEATS AVAILABLE</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* VEHICLE DETAILS & AMENITIES */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Vehicle specifications */}
                <div className="p-5 bg-slate-900/40 border border-white/[0.05] rounded-xl text-left space-y-3">
                  <h6 className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Transit Specifications</h6>
                  <div className="space-y-2 text-xs leading-relaxed">
                    <div className="flex justify-between border-b border-white/5 pb-1.5">
                      <span className="text-slate-500">Maximum Speed</span>
                      <span className="font-bold text-white">{selectedTransitGuide.guide.speed || '100 km/h'}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1.5">
                      <span className="text-slate-500">Luggage Allowance</span>
                      <span className="font-bold text-white">Up to 30kg checked</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1.5">
                      <span className="text-slate-500">Reservation Window</span>
                      <span className="font-bold text-white">24 hours advance recommended</span>
                    </div>
                    <div className="flex justify-between pb-1">
                      <span className="text-slate-500">Safety Rating</span>
                      <span className="font-bold text-emerald-400">★★★★★ (Excellent)</span>
                    </div>
                  </div>
                </div>

                {/* Amenities list */}
                <div className="p-5 bg-slate-900/40 border border-white/[0.05] rounded-xl text-left space-y-3">
                  <h6 className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500">On-Board Conveniences</h6>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {[
                      { name: 'High-Speed Wi-Fi', active: selectedTransitGuide.guide.amenities.wifi },
                      { name: 'USB Charging Outlets', active: selectedTransitGuide.guide.amenities.plugs },
                      { name: 'Meals & Beverages', active: selectedTransitGuide.guide.amenities.food },
                      { name: 'Air Conditioning', active: selectedTransitGuide.guide.amenities.ac },
                      { name: 'Restrooms', active: selectedTransitGuide.guide.amenities.restroom },
                      { name: 'Wheelchair Support', active: true }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className={'w-2 h-2 rounded-full ' + (item.active ? 'bg-emerald-500' : 'bg-rose-500')} />
                        <span className={item.active ? 'text-white' : 'text-slate-500 line-through'}>{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* GOOGLE MAPS ROUTE IFRAME */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Map className="w-4 h-4 text-blue-400" /> Interactive Route Navigation Map
                </h5>
                <div className="w-full h-72 rounded-2xl overflow-hidden border border-white/10 shadow-lg relative bg-slate-950">
                  <iframe
                    title="Route Map"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={"https://maps.google.com/maps?q=" + encodeURIComponent(selectedTransitGuide.guide.mapQuery) + "&t=&z=12&ie=UTF8&iwloc=&output=embed"}
                    allowFullScreen
                  />
                </div>
              </div>

            </div>

            {/* STICKY FOOTER ACTION BAR */}
            <div className="px-8 py-5 border-t border-white/[0.08] bg-slate-950/80 backdrop-blur-md flex items-center justify-end gap-3.5 z-20 sticky bottom-0">
              <button 
                onClick={() => setSelectedTransitGuide(null)}
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Close Guide
              </button>
              <a
                href={"https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(selectedTransitGuide.guide.mapQuery)}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-colors cursor-pointer shadow-md shadow-blue-500/20 text-center"
              >
                Open Google Maps
              </a>
            </div>

          </div>
        </div>
      )}

      {/* ─── FULL-SCREEN COUNTRY GALLERY LIGHTBOX MODAL ─── */}
      {showCountryLightbox && (
        <div 
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
          onClick={() => setShowCountryLightbox(false)}
        >
          <button 
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white cursor-pointer shadow-premium z-50 text-xl transition-all"
            onClick={() => setShowCountryLightbox(false)}
          >
            ×
          </button>
          
          <div className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center justify-center overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <img 
              src={countryLightboxImg} 
              alt="Country Sight" 
              className="max-w-full max-h-[80vh] object-contain rounded-2xl border border-white/10 shadow-premium animate-scale-in" 
            />
            <span className="text-[10px] font-mono tracking-widest text-slate-400 mt-4 uppercase">
              HD LANDSCAPE VISUAL • Curated via Pexels & Pixabay
            </span>
          </div>
        </div>
      )}

    </div>
  );
}
