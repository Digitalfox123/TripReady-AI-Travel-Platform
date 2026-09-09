import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useLocation, useSearchParams, Link } from 'react-router-dom';
import {
  DollarSign,
  Sun,
  Shield,
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Sparkles,
  Navigation,
  Bus,
  Train,
  Car,
  Wifi,
  CreditCard,
  Compass,
  Luggage,
  FileText,
  ArrowRight,
  X,
  Sliders,
  Bookmark,
  Lock,
  Star,
  MapPin,
  CloudRain,
  Cloud,
  Snowflake,
  Zap,
  Building2,
  UtensilsCrossed,
  Clock,
  RotateCcw
} from 'lucide-react';
import { resolveDestinationIntelligence } from '../../data/commandCenterIntelligence';
import { countries } from '../../data';
import { getBackendCities } from '../../data/backendCities';
import { attractionKnowledgeBase, realCityFoodAndTransit } from '../../data/attractionKnowledgeBase';
import { fetchLiveNews } from '../../utils/rapidApiService';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../utils/supabaseClient';
import { isPlaceholderImage, getCityImage } from '../../utils/imageLookup';
import { getDishImage } from '../../data/dishImages';
import { getAccurateHotels } from '../../data/hotelDirectory';
import {
  VisaPassportVector,
  SafetyShieldVector,
  MoneyCardsVector,
  Connectivity5GVector,
  TransitMetroVector,
  CultureTeaVector,
  EmergencySirenVector,
  BaggageSuitcaseVector,
  CustomsBorderVector,
  SimESimVector,
  BankAtmVector,
  ExpressTrainVector,
  HotelBellVector
} from './TripVectorArt';

export default function TripCommandCenter({ destination }) {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const authContext = useAuth();
  const user = authContext?.user || null;

  // ── 1. Extract and Normalize Trip Context ──────────────────────────────────
  const destName = destination?.name || searchParams.get('destCity') || location.state?.destinationCity || 'Kyoto';
  const destCountry = destination?.country || searchParams.get('destCountry') || location.state?.destinationCountry || 'Japan';

  const [originCountry, setOriginCountry] = useState(
    location.state?.originCountry || searchParams.get('originCountry') || 'Pakistan'
  );
  const [originCity, setOriginCity] = useState(
    location.state?.originCity || searchParams.get('originCity') || (originCountry === 'Pakistan' ? 'Lahore' : '')
  );
  const [startDate, setStartDate] = useState(
    location.state?.startDate || searchParams.get('startDate') || '2026-06-15'
  );
  const [endDate, setEndDate] = useState(
    location.state?.endDate || searchParams.get('endDate') || '2026-06-22'
  );
  const [travelers, setTravelers] = useState(
    Number(location.state?.travelers || searchParams.get('travelers') || 2)
  );
  const [travelType, setTravelType] = useState(
    location.state?.travelType || searchParams.get('travelType') || 'Couple'
  );

  // ── 2. Destination Hero Image Resolution ───────────────────────────────────
  const heroImage = useMemo(() => {
    if (destination?.image && !isPlaceholderImage(destination.image)) {
      return destination.image;
    }
    return getCityImage(destName, destCountry);
  }, [destination, destName, destCountry]);

  // ── 3. Destination Type Determination ─────────────────────────────────────
  const destinationType = useMemo(() => {
    try {
      if (destination?.rank && typeof destination.rank === 'string') {
        if (destination.rank.includes('Country')) return 'country';
        if (destination.rank.includes('Attraction')) return 'attraction';
        if (destination.rank.includes('State')) return 'state';
        return 'city';
      }
      const slugLower = String(destination?.id || destName || '').toLowerCase();
      const isCountry = Array.isArray(countries) && countries.some(c => 
        (c?.name && c.name.toLowerCase() === slugLower) || 
        (c?.code && c.code.toLowerCase() === slugLower)
      );
      if (isCountry) return 'country';
      return 'city';
    } catch {
      return 'city';
    }
  }, [destination, destName]);

  // ── 4. Edit Trip Modal State ──────────────────────────────────────────────
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editOriginCountry, setEditOriginCountry] = useState(originCountry);
  const [editOriginCity, setEditOriginCity] = useState(originCity);
  const [editStartDate, setEditStartDate] = useState(startDate);
  const [editEndDate, setEditEndDate] = useState(endDate);
  const [editTravelers, setEditTravelers] = useState(travelers);
  const [editTravelType, setEditTravelType] = useState(travelType);

  // ── 5. Auth Prompt Modal for Signed-out Users ─────────────────────────────
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // ── 6. Destination Intelligence ───────────────────────────────────────────
  const intel = useMemo(() => {
    return resolveDestinationIntelligence(destName, destCountry) || {};
  }, [destName, destCountry]);

  // ── 7. Date & Duration Calculations ───────────────────────────────────────
  const { durationDays, dateRangeFormatted } = useMemo(() => {
    try {
      if (!startDate || !endDate) {
        return { durationDays: 7, dateRangeFormatted: 'Jun 15 – Jun 22, 2026' };
      }
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return { durationDays: 7, dateRangeFormatted: 'Flexible Dates' };
      }
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      const days = isNaN(diffDays) || diffDays < 1 ? 7 : diffDays;
      const options = { month: 'short', day: 'numeric', year: 'numeric' };
      const formatted = `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('en-US', options)}`;
      return { durationDays: days, dateRangeFormatted: formatted };
    } catch {
      return { durationDays: 7, dateRangeFormatted: 'Flexible Dates' };
    }
  }, [startDate, endDate]);

  // ── 8. Open-Meteo Live Weather Telemetry ──────────────────────────────────
  const [weatherData, setWeatherData] = useState({
    temp: 22,
    feelsLike: 25,
    condition: 'Light Rain',
    high: 26,
    low: 22,
    humidity: 85,
    windSpeed: 5,
    uvIndex: 4,
    code: 61,
    loading: true
  });

  useEffect(() => {
    let active = true;
    async function fetchWeather() {
      try {
        const queryTarget = `${destName}, ${destCountry}`;
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(queryTarget)}&count=1&language=en&format=json`
        );
        const geoJson = await geoRes.json();
        let lat = 35.0116;
        let lng = 135.7681; // Kyoto default
        if (geoJson.results && geoJson.results[0]) {
          lat = geoJson.results[0].latitude;
          lng = geoJson.results[0].longitude;
        }

        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`
        );
        const data = await res.json();
        if (active && data && data.current) {
          const code = data.current.weather_code || 0;
          let cond = 'Clear Sky';
          if (code >= 1 && code <= 3) cond = 'Partly Cloudy';
          else if (code >= 45 && code <= 48) cond = 'Foggy';
          else if (code >= 51 && code <= 67) cond = 'Light Rain';
          else if (code >= 71 && code <= 77) cond = 'Snow Showers';
          else if (code >= 80 && code <= 82) cond = 'Rain Showers';
          else if (code >= 95) cond = 'Thunderstorm';

          setWeatherData({
            temp: Math.round(data.current.temperature_2m),
            feelsLike: Math.round(data.current.apparent_temperature || data.current.temperature_2m),
            condition: cond,
            high: data.daily?.temperature_2m_max ? Math.round(data.daily.temperature_2m_max[0]) : 26,
            low: data.daily?.temperature_2m_min ? Math.round(data.daily.temperature_2m_min[0]) : 20,
            humidity: data.current.relative_humidity_2m || 75,
            windSpeed: Math.round(data.current.wind_speed_10m || 6),
            uvIndex: 4,
            code,
            loading: false
          });
        }
      } catch (e) {
        if (active) {
          setWeatherData(prev => ({ ...prev, loading: false }));
        }
      }
    }
    fetchWeather();
    return () => { active = false; };
  }, [destName, destCountry]);

  // ── 9. Interactive Next Steps Mini-Checklist ─────────────────────────────
  const [checklist, setChecklist] = useState([
    { id: 'researched', label: 'Destination researched', completed: true },
    { id: 'weather', label: 'Weather checked', completed: true },
    { id: 'visa', label: 'Visa requirements reviewed', completed: false },
    { id: 'budget', label: 'Budget estimated', completed: false },
    { id: 'timeline', label: 'Day-by-day timeline built', completed: false }
  ]);

  const toggleChecklistItem = (id) => {
    setChecklist(prev =>
      prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item)
    );
  };

  const completedCount = (checklist || []).filter(c => c.completed).length;
  const progressPercent = Math.round((completedCount / (checklist?.length || 5)) * 100);

  // ── 10. Trip Essentials Accordion (Progressive Disclosure) ─────────────────
  const [expandedEssential, setExpandedEssential] = useState('visa');

  const toggleEssential = (key) => {
    setExpandedEssential(prev => prev === key ? null : key);
  };

  // ── 11. Your First Hour Stepper (Signature Stepper) ──────────────────────
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const firstHourSteps = intel.firstHour || [
    { step: 1, title: 'Land & Baggage Claim', category: 'Arrival', summary: `Arrive at ${destName} terminal and retrieve luggage.`, detail: 'Follow standard arrivals and baggage claim signs. Ensure all baggage tags match your boarding pass stubs.', badge: 'Arrival' },
    { step: 2, title: 'Immigration & Customs', category: 'Border', summary: 'Present your valid passport & entry documentation.', detail: 'Keep passport, accommodation confirmation, and return flight itinerary accessible.', badge: 'Passport Control' },
    { step: 3, title: 'Connectivity & eSIM', category: 'Tech', summary: 'Connect to airport Wi-Fi or toggle your digital eSIM.', detail: 'Activate mobile data roaming on your digital eSIM profile or log onto complimentary airport Wi-Fi.', badge: 'Free 5G Wi-Fi' },
    { step: 4, title: 'Cash & Local Currency', category: 'Money', summary: 'Use official bank ATMs inside arrival hall.', detail: 'Avoid high-fee commercial airport currency exchange kiosks; bank ATMs give official interbank rates.', badge: 'ATM Access' },
    { step: 5, title: 'Airport Express Transit', category: 'Transport', summary: `Take direct train or express shuttle into central ${destName}.`, detail: 'Follow rail signs directly from the terminal. Trains and shuttles depart frequently into central stations.', badge: 'Fast Transit' },
    { step: 6, title: 'Hotel Check-in', category: 'Check-in', summary: 'Arrive at hotel, drop bags, and claim city transit passes.', detail: 'Ask front desk staff for city visitor maps, public transport guidance, and Wi-Fi access credentials.', badge: 'Check-in' }
  ];

  // ── 12. Weather + What to Pack ───────────────────────────────────────────
  const [packingItems, setPackingItems] = useState([
    { id: 'p1', label: 'Comfortable walking shoes', category: 'Clothing', checked: true },
    { id: 'p2', label: 'Layered weather jacket / Windbreaker', category: 'Clothing', checked: true },
    { id: 'p3', label: 'Universal plug adapter & power bank', category: 'Electronics', checked: false },
    { id: 'p4', label: 'Valid Passport & printed Visa copy', category: 'Documents', checked: true },
    { id: 'p5', label: 'Sun protection / Polarized sunglasses', category: 'Essentials', checked: false },
    { id: 'p6', label: 'Reusable filtered water bottle', category: 'Essentials', checked: false }
  ]);
  const [isPackingDrawerOpen, setIsPackingDrawerOpen] = useState(false);

  const togglePackingItem = (id) => {
    setPackingItems(prev =>
      prev.map(p => p.id === id ? { ...p, checked: !p.checked } : p)
    );
  };

  // ── 13. Data-Driven Destination Highlights Carousel ──────────────────────
  const backendAttractions = useMemo(() => {
    try {
      const slugNorm = String(destName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const foundKey = Object.keys(attractionKnowledgeBase || {}).find(key => {
        const kNorm = key.toLowerCase().replace(/[^a-z0-9]/g, '');
        return kNorm && (slugNorm === kNorm || slugNorm.includes(kNorm) || kNorm.includes(slugNorm));
      });

      if (foundKey && attractionKnowledgeBase[foundKey] && Array.isArray(attractionKnowledgeBase[foundKey]) && attractionKnowledgeBase[foundKey].length > 0) {
        return attractionKnowledgeBase[foundKey].map(a => ({
          id: a?.id || `kb-${Math.random()}`,
          name: a?.name || 'Local Landmark',
          category: a?.category || 'Must See',
          duration: a?.visitDuration || '1.5 - 2 hours',
          image: a?.image || (Array.isArray(a?.images) && a.images[0]) || 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80',
          description: a?.description || a?.longDescription || `Iconic landmark in ${destName}.`,
          rating: a?.rating || 4.8
        }));
      }

      if (destination?.attractions && Array.isArray(destination.attractions) && destination.attractions.length > 0) {
        return destination.attractions.map((attr, idx) => {
          const name = typeof attr === 'string' ? attr : attr?.name || `Attraction ${idx + 1}`;
          return {
            id: `attr-${idx}`,
            name: name,
            category: 'Landmark',
            duration: '1.5 hours',
            image: typeof attr === 'object' && attr?.image ? attr.image : 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
            description: typeof attr === 'object' && attr?.description ? attr.description : `Scenic and historic landmark in ${destName}.`,
            rating: 4.8
          };
        });
      }

      if (intel?.curatedAttractions && Array.isArray(intel.curatedAttractions) && intel.curatedAttractions.length > 0) {
        return intel.curatedAttractions;
      }

      return [];
    } catch {
      return [];
    }
  }, [destName, destination, intel]);

  // Attraction horizontal scroll ref & navigation
  const attractionsScrollRef = useRef(null);
  const scrollAttractions = (direction) => {
    if (attractionsScrollRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      attractionsScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // ── 14. Where to Stay (Accurate Real Hotels) ─────────────────────────────
  const accurateHotels = useMemo(() => {
    return getAccurateHotels(destName, destCountry);
  }, [destName, destCountry]);

  // ── 15. Getting Around (Prioritized Best Recommendation) ──────────────────
  const transitRecommendations = useMemo(() => {
    return {
      primary: {
        title: `Airport Express to Central ${destName}`,
        type: 'Direct Train / Express Rail',
        duration: '7–25 min',
        cost: intel.currency ? `Standard Local Transit Ticket` : 'Express Rail Fare',
        description: `Fastest and most comfortable connection from the airport terminal directly into ${destName} central station.`
      },
      alternatives: [
        { name: 'Public Metro & Trams', duration: 'Frequent', desc: 'Extensive, clean urban network covering all central neighborhoods.' },
        { name: 'Official Taxi & Rideshare', duration: '20–35 min', desc: 'Available 24/7 at airport ground terminal and via mobile apps.' },
        { name: 'Regional Intercity Rail', duration: 'Hourly', desc: 'Seamless high-speed rail lines to neighboring regions and day-trip spots.' }
      ]
    };
  }, [destName, intel]);

  // ── 16. Food Discovery (Eat & Discover with Authentic Dishes & Photos) ───
  const foodHighlights = useMemo(() => {
    const cityKey = destName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const realFood = realCityFoodAndTransit?.[cityKey]?.foods;
    if (realFood && Array.isArray(realFood) && realFood.length > 0) {
      return realFood.slice(0, 3).map((f, idx) => {
        const dishName = typeof f === 'string' ? f : f.name || f;
        return {
          id: `food-${idx}`,
          name: dishName,
          tag: f.tag || 'Local Specialty',
          description: f.desc || `Authentic culinary classic enjoyed across ${destName}.`,
          dietary: f.dietary || 'Authentic',
          image: getDishImage(dishName, destName)
        };
      });
    }
    const fallbackList = intel.foodHighlights || [
      { name: 'Traditional Regional Specialty', tag: 'Traditional Heritage', description: 'Slow-cooked local classic served in authentic bistros and historical taverns.', dietary: 'Local Specialty' },
      { name: 'Fresh Seasonal Delicate', tag: 'Regional Delicate', description: 'Lightly sautéed with local butter and fresh herbs, paired with crisp seasonal sides.', dietary: 'Regional Classic' },
      { name: 'Artisanal Sweets & Pastries', tag: 'Sweet Icon', description: 'World-famous handcrafted confections from master confectioners.', dietary: 'Vegetarian' }
    ];
    return fallbackList.slice(0, 3).map((f, idx) => ({
      id: `food-${idx}`,
      name: f.name,
      tag: f.tag || 'Specialty',
      description: f.description || `Signature delicacy of ${destName}.`,
      dietary: f.dietary || 'Authentic',
      image: getDishImage(f.name, destName)
    }));
  }, [destName, intel]);

  // ── 17. Stay Aware (Safety / Culture / Live Alerts Tabs) ──────────────────
  const [activeAwareTab, setActiveAwareTab] = useState('safety');
  const [liveNews, setLiveNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);

  useEffect(() => {
    let active = true;
    async function loadNews() {
      setNewsLoading(true);
      try {
        const news = await fetchLiveNews(destCountry || destName);
        if (active && news && news.length > 0) {
          setLiveNews(news.slice(0, 3));
        }
      } catch (e) {
        // Fallback silently
      } finally {
        if (active) setNewsLoading(false);
      }
    }
    loadNews();
    return () => { active = false; };
  }, [destName, destCountry]);

  // ── 18. Save Trip Action (Signed-in vs Signed-out) ────────────────────────
  const handleSaveTrip = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    setIsSaving(true);
    try {
      const tripRecord = {
        user_id: user.id,
        destination: `${destName}, ${destCountry}`,
        duration: durationDays,
        budget: 'Midrange',
        travel_type: travelType,
        itinerary_data: {
          origin: `${originCity}, ${originCountry}`,
          startDate,
          endDate,
          travelers,
          weather: weatherData,
          intelSummary: intel.essentials?.visa?.summary || 'Standard Entry'
        }
      };

      const { error } = await supabase.from('saved_ai_trips').insert([tripRecord]);
      if (!error) {
        setIsSaved(true);
      }
    } catch (e) {
      console.warn("Failed to save trip:", e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveTripUpdate = (e) => {
    e.preventDefault();
    setOriginCountry(editOriginCountry);
    setOriginCity(editOriginCity);
    setStartDate(editStartDate);
    setEndDate(editEndDate);
    setTravelers(editTravelers);
    setTravelType(editTravelType);
    setIsEditModalOpen(false);

    // Update URL query parameters
    const p = new URLSearchParams(searchParams);
    p.set('originCountry', editOriginCountry);
    p.set('originCity', editOriginCity);
    p.set('startDate', editStartDate);
    p.set('endDate', editEndDate);
    p.set('travelers', editTravelers.toString());
    p.set('travelType', editTravelType);
    setSearchParams(p);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFD] dark:bg-[#070D18] text-slate-900 dark:text-slate-100 selection:bg-blue-500 selection:text-white pt-24 pb-20 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* ════════════════════════════════════════════════════════════════════
            1. HIGH-DEFINITION DESTINATION HERO BANNER
            ════════════════════════════════════════════════════════════════════ */}
        <section className="space-y-4">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-white/[0.08] min-h-[290px] sm:min-h-[340px] flex flex-col justify-between p-6 sm:p-10 text-white select-none">
            {/* Background Destination Photo */}
            <img
              src={heroImage}
              alt={`${destName}, ${destCountry}`}
              className="absolute inset-0 w-full h-full object-cover object-center transform scale-100 hover:scale-105 transition-transform duration-1000 ease-out"
              loading="eager"
            />
            {/* Cinematic Scrim Gradient: Ensures text is always 100% crisp & prominent */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-slate-950/35" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-transparent" />

            {/* Top Bar inside Hero */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 dark:bg-black/30 backdrop-blur-md border border-white/20 text-white text-xs font-semibold uppercase tracking-wider shadow-sm">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span>Trip Command Center</span>
                <span className="opacity-60">•</span>
                <span>{destCountry}</span>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium bg-white/20 dark:bg-slate-900/60 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white shadow-sm transition-all cursor-pointer active:scale-95"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Edit Parameters</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveTrip}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all cursor-pointer active:scale-95"
                >
                  {isSaved ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Saved</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>{isSaving ? 'Saving...' : 'Save Trip'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Bottom Content inside Hero */}
            <div className="relative z-10 space-y-2 mt-12 sm:mt-16">
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white drop-shadow-lg">
                {originCity || originCountry} <span className="text-blue-300 font-light">→</span> {destName}
              </h1>
              <p className="text-sm sm:text-base text-slate-200 font-medium drop-shadow flex flex-wrap items-center gap-2">
                <span>{dateRangeFormatted}</span>
                <span className="opacity-60">•</span>
                <span>{durationDays} Days</span>
                <span className="opacity-60">•</span>
                <span>{travelers} Travelers ({travelType})</span>
              </p>
            </div>
          </div>

          {/* Calm, Sleek 4-Item Horizontal Information Bar below Hero Image */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/[0.06] shadow-sm">
            {/* Item 1: Weather */}
            <div className="flex items-center gap-3 p-1">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                {weatherData.condition.toLowerCase().includes('rain') ? (
                  <CloudRain className="w-4 h-4" />
                ) : (
                  <Sun className="w-4 h-4" />
                )}
              </div>
              <div className="min-w-0">
                <span className="block text-[10px] uppercase font-mono tracking-wider text-slate-400">Weather</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block">
                  {weatherData.loading ? 'Syncing...' : `${weatherData.temp}°C · ${weatherData.condition}`}
                </span>
              </div>
            </div>

            {/* Item 2: Currency */}
            <div className="flex items-center gap-3 p-1">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                <DollarSign className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="block text-[10px] uppercase font-mono tracking-wider text-slate-400">Currency</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block">
                  {intel.currency ? `${intel.currency.code} (1 USD ≈ ${intel.currency.rate} ${intel.currency.code})` : 'USD (1 USD ≈ 1 USD)'}
                </span>
              </div>
            </div>

            {/* Item 3: Time Zone */}
            <div className="flex items-center gap-3 p-1">
              <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 flex-shrink-0">
                <Compass className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="block text-[10px] uppercase font-mono tracking-wider text-slate-400">Time Zone</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block">
                  {intel.timezone || 'Local Time (UTC+5 to +9)'}
                </span>
              </div>
            </div>

            {/* Item 4: Trip Readiness */}
            <div className="flex items-center gap-3 p-1">
              <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 flex-shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="block text-[10px] uppercase font-mono tracking-wider text-slate-400">Trip Readiness</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block">
                  {progressPercent}% Prepared
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            2. TRIP AT A GLANCE (Two-Column Command Grid)
            ════════════════════════════════════════════════════════════════════ */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: City Status & Key Advisories */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900/60 rounded-3xl p-6 border border-slate-200/80 dark:border-white/[0.06] shadow-sm flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/[0.04] pb-4">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    DESTINATION SNAPSHOT
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    {destName} Overview
                  </h2>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                  {destinationType.toUpperCase()}
                </span>
              </div>

              <div className="mt-5 space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 flex-shrink-0 mt-0.5">
                    <Sun className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-slate-900 dark:text-white">Current Weather</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-0.5">
                      {weatherData.temp}°C · {weatherData.condition} · High: {weatherData.high}°C / Low: {weatherData.low}°C
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 flex-shrink-0 mt-0.5">
                    <CreditCard className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-slate-900 dark:text-white">Payments & Cash</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-0.5">
                      {intel.essentials?.money?.status || '97% Contactless Card Acceptance · Official Bank ATMs'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 flex-shrink-0 mt-0.5">
                    <FileText className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-slate-900 dark:text-white">Visa Status</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-0.5">
                      {intel.essentials?.visa?.status || 'Valid passport (min. 6 months validity required)'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 flex-shrink-0 mt-0.5">
                    <Shield className="w-4 h-4 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-slate-900 dark:text-white">Safety Advisory</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-0.5">
                      Safety Index: {intel.safetyScore || 90}/100 · Peaceful & Welcoming
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-white/[0.04] flex items-center justify-between text-xs">
              <span className="text-slate-400">Verified Destination Data</span>
              <span className="text-blue-600 dark:text-blue-400 font-medium">Updated Daily</span>
            </div>
          </div>

          {/* Right Column: "Your Next Steps" Checklist */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900/60 rounded-3xl p-6 border border-slate-200/80 dark:border-white/[0.06] shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/[0.04] pb-4">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    ACTIONABLE READINESS
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Your Next Steps
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400">
                    {completedCount} of {(checklist || []).length}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                    {progressPercent}%
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-4 overflow-hidden">
                <div
                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Checklist items */}
              <div className="mt-4 space-y-2.5">
                {(checklist || []).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleChecklistItem(item.id)}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-white/[0.03] hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                          item.completed
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'border-slate-300 dark:border-slate-600 text-transparent group-hover:border-slate-400'
                        }`}
                      >
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span
                        className={`text-xs font-medium transition-colors ${
                          item.completed
                            ? 'text-slate-400 line-through'
                            : 'text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.completed ? 'Undo' : 'Mark done'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/[0.04] flex items-center justify-between text-xs">
              <span className="text-slate-400">Ready to build your timeline?</span>
              <Link
                to={`/ai-trip-planner?destCity=${encodeURIComponent(destName)}&destCountry=${encodeURIComponent(destCountry)}`}
                className="text-blue-600 dark:text-blue-400 font-medium hover:underline inline-flex items-center gap-1"
              >
                <span>Open Timeline</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            3. TRIP ESSENTIALS (Progressive Disclosure with Tilted Vector SVG Art)
            ════════════════════════════════════════════════════════════════════ */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Trip Essentials
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Key regulations, customs, currency, and connectivity protocols for your trip
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">
              Click any card to expand details
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card 1: Visa & Entry */}
            <div className="relative bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-white/[0.06] shadow-sm transition-all overflow-hidden group">
              {/* Tilted Vector SVG Art */}
              <div className="absolute right-3 top-2.5 pointer-events-none select-none text-amber-500 dark:text-amber-400 opacity-20 group-hover:opacity-35 transition-opacity">
                <VisaPassportVector className="w-20 h-20 sm:w-24 sm:h-24" />
              </div>

              <button
                type="button"
                onClick={() => toggleEssential('visa')}
                className="relative z-10 w-full p-4 flex items-center justify-between text-left hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 flex-shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-slate-900 dark:text-white">Visa & Entry Requirements</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[200px] sm:max-w-xs">
                      {intel.essentials?.visa?.summary || `Check entry protocol from ${originCountry} to ${destCountry}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                    Requirement
                  </span>
                  {expandedEssential === 'visa' ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {expandedEssential === 'visa' && (
                <div className="relative z-10 px-5 pb-5 pt-1 border-t border-slate-100 dark:border-white/[0.04] text-xs text-slate-600 dark:text-slate-300 space-y-3">
                  <p className="leading-relaxed text-[11px]">
                    {intel.essentials?.visa?.detail || `Travelers holding passport from ${originCountry} traveling to ${destCountry} require standard passport validation with at least 6 months remaining validity, proof of accommodation, and medical travel coverage.`}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <a
                      href={intel.essentials?.visa?.officialLink || "https://www.mofa.go.jp/j_info/visit/visa/"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 text-[11px] font-medium hover:underline inline-flex items-center gap-1"
                    >
                      <span>Official Consular Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <span className="text-[10px] text-slate-400 font-mono">Verified Guideline</span>
                  </div>
                </div>
              )}
            </div>

            {/* Card 2: Safety & Health */}
            <div className="relative bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-white/[0.06] shadow-sm transition-all overflow-hidden group">
              {/* Tilted Vector SVG Art */}
              <div className="absolute right-3 top-2.5 pointer-events-none select-none text-emerald-500 dark:text-emerald-400 opacity-20 group-hover:opacity-35 transition-opacity">
                <SafetyShieldVector className="w-20 h-20 sm:w-24 sm:h-24" />
              </div>

              <button
                type="button"
                onClick={() => toggleEssential('safety')}
                className="relative z-10 w-full p-4 flex items-center justify-between text-left hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-slate-900 dark:text-white">Safety & Health Protocol</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[200px] sm:max-w-xs">
                      {intel.essentials?.safety?.summary || `Safety Index: ${intel.safetyScore || 90}/100 · Low violent crime`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                    Protocols
                  </span>
                  {expandedEssential === 'safety' ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {expandedEssential === 'safety' && (
                <div className="relative z-10 px-5 pb-5 pt-1 border-t border-slate-100 dark:border-white/[0.04] text-xs text-slate-600 dark:text-slate-300 space-y-3">
                  <p className="leading-relaxed text-[11px]">
                    {intel.essentials?.safety?.detail || `${destName} maintains very high civic order and low violent crime. Primary caution is situational awareness against pickpockets around crowded train stations and tourist squares. Tap water is pure and 100% safe to drink.`}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium">
                      Emergency: Police 110 / Ambulance 119
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Consular Monitored</span>
                  </div>
                </div>
              )}
            </div>

            {/* Card 3: Money & Payments */}
            <div className="relative bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-white/[0.06] shadow-sm transition-all overflow-hidden group">
              {/* Tilted Vector SVG Art */}
              <div className="absolute right-3 top-2.5 pointer-events-none select-none text-blue-500 dark:text-blue-400 opacity-20 group-hover:opacity-35 transition-opacity">
                <MoneyCardsVector className="w-20 h-20 sm:w-24 sm:h-24" />
              </div>

              <button
                type="button"
                onClick={() => toggleEssential('money')}
                className="relative z-10 w-full p-4 flex items-center justify-between text-left hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-slate-900 dark:text-white">Money, Cards & Currency</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[200px] sm:max-w-xs">
                      {intel.essentials?.money?.summary || `Currency: ${intel.currency?.code || 'JPY'} · High card acceptance`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                    Finance
                  </span>
                  {expandedEssential === 'money' ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {expandedEssential === 'money' && (
                <div className="relative z-10 px-5 pb-5 pt-1 border-t border-slate-100 dark:border-white/[0.04] text-xs text-slate-600 dark:text-slate-300 space-y-3">
                  <p className="leading-relaxed text-[11px]">
                    {intel.essentials?.money?.detail || 'Contactless Visa, Mastercard, Apple Pay, and IC Transit cards (Suica/Pasmo/ICOCA) work practically everywhere including convenience stores and subways. 7-Eleven and post office ATMs give clean interbank exchange rates for foreign cards.'}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-slate-500">Tipping is not customary and can cause confusion</span>
                    <span className="text-[10px] text-slate-400 font-mono">IC Cards Accepted</span>
                  </div>
                </div>
              )}
            </div>

            {/* Card 4: Connectivity & Power */}
            <div className="relative bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-white/[0.06] shadow-sm transition-all overflow-hidden group">
              {/* Tilted Vector SVG Art */}
              <div className="absolute right-3 top-2.5 pointer-events-none select-none text-purple-500 dark:text-purple-400 opacity-20 group-hover:opacity-35 transition-opacity">
                <Connectivity5GVector className="w-20 h-20 sm:w-24 sm:h-24" />
              </div>

              <button
                type="button"
                onClick={() => toggleEssential('connectivity')}
                className="relative z-10 w-full p-4 flex items-center justify-between text-left hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 flex-shrink-0">
                    <Wifi className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-slate-900 dark:text-white">Mobile Connectivity & Power</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[200px] sm:max-w-xs">
                      {intel.essentials?.connectivity?.summary || '100V 50/60Hz · Type A sockets · 5G eSIM'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                    Tech Setup
                  </span>
                  {expandedEssential === 'connectivity' ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {expandedEssential === 'connectivity' && (
                <div className="relative z-10 px-5 pb-5 pt-1 border-t border-slate-100 dark:border-white/[0.04] text-xs text-slate-600 dark:text-slate-300 space-y-3">
                  <p className="leading-relaxed text-[11px]">
                    {intel.essentials?.connectivity?.detail || 'Sockets use US 2-prong flat pins (Type A), operating at 100V. High-speed 5G mobile coverage is standard across the city. Digital travel eSIMs (Airalo, Ubigi, Holafly) activate instantly on arrival.'}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-purple-700 dark:text-purple-300 font-medium">
                      eSIM Recommended
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">5G Supported</span>
                  </div>
                </div>
              )}
            </div>

            {/* Card 5: Getting Around */}
            <div className="relative bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-white/[0.06] shadow-sm transition-all overflow-hidden group">
              {/* Tilted Vector SVG Art */}
              <div className="absolute right-3 top-2.5 pointer-events-none select-none text-indigo-500 dark:text-indigo-400 opacity-20 group-hover:opacity-35 transition-opacity">
                <TransitMetroVector className="w-20 h-20 sm:w-24 sm:h-24" />
              </div>

              <button
                type="button"
                onClick={() => toggleEssential('transport')}
                className="relative z-10 w-full p-4 flex items-center justify-between text-left hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                    <Train className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-slate-900 dark:text-white">Transit & Navigation</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[200px] sm:max-w-xs">
                      {intel.essentials?.transport?.summary || 'IC cards · City bus grid · Punctual railways'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                    Transit
                  </span>
                  {expandedEssential === 'transport' ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {expandedEssential === 'transport' && (
                <div className="relative z-10 px-5 pb-5 pt-1 border-t border-slate-100 dark:border-white/[0.04] text-xs text-slate-600 dark:text-slate-300 space-y-3">
                  <p className="leading-relaxed text-[11px]">
                    {intel.essentials?.transport?.detail || 'World-renowned train punctuality. Subway and bus networks accept IC contactless cards (ICOCA/Suica). Station signs and automated announcements are provided in English.'}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                      Google Maps transit routing is 100% accurate
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Tap-to-Pay</span>
                  </div>
                </div>
              )}
            </div>

            {/* Card 6: Local Culture & Etiquette */}
            <div className="relative bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-white/[0.06] shadow-sm transition-all overflow-hidden group">
              {/* Tilted Vector SVG Art */}
              <div className="absolute right-3 top-2.5 pointer-events-none select-none text-rose-500 dark:text-rose-400 opacity-20 group-hover:opacity-35 transition-opacity">
                <CultureTeaVector className="w-20 h-20 sm:w-24 sm:h-24" />
              </div>

              <button
                type="button"
                onClick={() => toggleEssential('culture')}
                className="relative z-10 w-full p-4 flex items-center justify-between text-left hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400 flex-shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-slate-900 dark:text-white">Local Etiquette & Culture</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[200px] sm:max-w-xs">
                      {intel.essentials?.culture?.summary || 'Polite bowing · Quiet train etiquette · Temple decorum'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300">
                    Etiquette
                  </span>
                  {expandedEssential === 'culture' ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {expandedEssential === 'culture' && (
                <div className="relative z-10 px-5 pb-5 pt-1 border-t border-slate-100 dark:border-white/[0.04] text-xs text-slate-600 dark:text-slate-300 space-y-3">
                  <p className="leading-relaxed text-[11px]">
                    {intel.essentials?.culture?.detail || 'Avoid loud phone calls on public transit. Remove shoes when stepping into traditional tatami rooms or temples. Keep your trash with you until you find convenience store bins.'}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                      Polite bow & "Arigato gozaimasu" goes a long way
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Respectful Travel</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            4. YOUR FIRST HOUR IN [CITY] (Interactive Stepper with SVG Vector Art)
            ════════════════════════════════════════════════════════════════════ */}
        <section className="bg-white dark:bg-slate-900/60 rounded-3xl p-6 border border-slate-200/80 dark:border-white/[0.06] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-white/[0.04] pb-4">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                ARRIVAL PLAYBOOK
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                YOUR FIRST HOUR IN {destName.toUpperCase()}
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">
              6 Sequential Arrival Milestones
            </span>
          </div>

          {/* Desktop Stepper: Horizontal clickable milestones */}
          <div className="hidden md:flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-100 dark:bg-slate-800 z-0" />
            {firstHourSteps.map((s, idx) => (
              <button
                key={s.step}
                type="button"
                onClick={() => setActiveStepIdx(idx)}
                className={`relative z-10 flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeStepIdx === idx
                    ? 'bg-blue-600 text-white shadow-md scale-105'
                    : idx < activeStepIdx
                    ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200/50'
                    : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <span className="font-mono text-[11px]">{String(s.step).padStart(2, '0')}</span>
                <span>{s.title.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {/* Mobile Stepper: Step indicator tabs */}
          <div className="flex md:hidden items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {firstHourSteps.map((s, idx) => (
              <button
                key={s.step}
                type="button"
                onClick={() => setActiveStepIdx(idx)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium flex-shrink-0 transition-all cursor-pointer ${
                  activeStepIdx === idx
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}
              >
                {String(s.step).padStart(2, '0')} {s.title.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Active Step Detailed Information Card with Tilted SVG Vector */}
          {firstHourSteps[activeStepIdx] && (
            <div className="relative overflow-hidden p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-white/[0.04] space-y-3 group">
              {/* Milestone Specific Tilted SVG Vector Illustration */}
              <div className="absolute right-4 top-4 pointer-events-none select-none text-blue-600 dark:text-blue-400 opacity-15 group-hover:opacity-25 transition-opacity">
                {activeStepIdx === 0 && <BaggageSuitcaseVector className="w-20 h-20 sm:w-24 sm:h-24" />}
                {activeStepIdx === 1 && <CustomsBorderVector className="w-20 h-20 sm:w-24 sm:h-24" />}
                {activeStepIdx === 2 && <SimESimVector className="w-20 h-20 sm:w-24 sm:h-24" />}
                {activeStepIdx === 3 && <BankAtmVector className="w-20 h-20 sm:w-24 sm:h-24" />}
                {activeStepIdx === 4 && <ExpressTrainVector className="w-20 h-20 sm:w-24 sm:h-24" />}
                {activeStepIdx === 5 && <HotelBellVector className="w-20 h-20 sm:w-24 sm:h-24" />}
              </div>

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-mono font-bold flex items-center justify-center shadow-sm">
                    {firstHourSteps[activeStepIdx].step}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    {firstHourSteps[activeStepIdx].title}
                  </h3>
                </div>
                <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold">
                  {firstHourSteps[activeStepIdx].badge || firstHourSteps[activeStepIdx].category}
                </span>
              </div>

              <p className="relative z-10 text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium">
                {firstHourSteps[activeStepIdx].summary}
              </p>
              <p className="relative z-10 text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed max-w-2xl">
                {firstHourSteps[activeStepIdx].detail}
              </p>

              {/* Stepper Navigation Buttons */}
              <div className="relative z-10 flex items-center justify-between pt-3 border-t border-slate-200/50 dark:border-white/[0.04]">
                <button
                  type="button"
                  disabled={activeStepIdx === 0}
                  onClick={() => setActiveStepIdx(prev => Math.max(0, prev - 1))}
                  className="text-xs px-3.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  ← Previous Step
                </button>

                <button
                  type="button"
                  disabled={activeStepIdx === firstHourSteps.length - 1}
                  onClick={() => setActiveStepIdx(prev => Math.min(firstHourSteps.length - 1, prev + 1))}
                  className="text-xs px-4 py-1.5 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 shadow-sm transition-all"
                >
                  <span>Next Step</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            5. WEATHER & WHAT TO PACK (Unified Colorful Atmospheric Card)
            ════════════════════════════════════════════════════════════════════ */}
        <section className="bg-white dark:bg-slate-900/60 rounded-3xl p-6 border border-slate-200/80 dark:border-white/[0.06] shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/[0.04] pb-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sun className="w-5 h-5 text-amber-500" />
              <span>WEATHER & WHAT TO PACK</span>
            </h2>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {destName}, {destCountry}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Atmospheric Live Weather Card (No open-meteo telemetry label) */}
            <div className={`relative overflow-hidden lg:col-span-6 p-6 rounded-2xl flex flex-col justify-between border shadow-sm transition-all ${
              weatherData.condition.toLowerCase().includes('rain')
                ? 'bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white border-blue-800/40'
                : weatherData.condition.toLowerCase().includes('cloud')
                ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 text-white border-slate-700/40'
                : 'bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-950 text-white border-blue-700/30'
            }`}>
              {/* Rain Animation Layer */}
              {weatherData.condition.toLowerCase().includes('rain') && (
                <div className="absolute inset-0 pointer-events-none opacity-25 overflow-hidden">
                  <div className="absolute w-0.5 h-6 bg-blue-300 top-2 left-10 animate-pulse" />
                  <div className="absolute w-0.5 h-8 bg-blue-200 top-12 left-28 animate-pulse" style={{ animationDelay: '200ms' }} />
                  <div className="absolute w-0.5 h-6 bg-blue-300 top-4 left-48 animate-pulse" style={{ animationDelay: '400ms' }} />
                  <div className="absolute w-0.5 h-7 bg-blue-200 top-16 left-64 animate-pulse" style={{ animationDelay: '600ms' }} />
                  <div className="absolute w-0.5 h-6 bg-blue-300 top-8 right-12 animate-pulse" style={{ animationDelay: '300ms' }} />
                  <div className="absolute w-0.5 h-8 bg-blue-200 top-20 right-28 animate-pulse" style={{ animationDelay: '500ms' }} />
                </div>
              )}

              {/* Sun Ambient Glow */}
              {!weatherData.condition.toLowerCase().includes('rain') && (
                <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />
              )}

              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-blue-300">
                    Live Destination Forecast
                  </span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md font-mono text-white/80">
                    {weatherData.condition}
                  </span>
                </div>

                <div className="flex items-baseline gap-4 mt-5">
                  <span className="text-5xl sm:text-6xl font-black tracking-tight text-white drop-shadow-md">
                    {weatherData.temp}°C
                  </span>
                  <div className="text-xs space-y-0.5">
                    <span className="block font-bold text-base text-white">
                      {weatherData.condition}
                    </span>
                    <span className="text-white/70 block">
                      Feels like {weatherData.feelsLike}°C
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative z-10 grid grid-cols-3 gap-3 pt-6 mt-6 border-t border-white/10 text-xs">
                <div>
                  <span className="block text-[10px] uppercase font-mono text-white/60">High / Low</span>
                  <span className="font-bold text-white text-sm">{weatherData.high}° / {weatherData.low}°</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-mono text-white/60">Humidity</span>
                  <span className="font-bold text-white text-sm">{weatherData.humidity}%</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-mono text-white/60">Wind</span>
                  <span className="font-bold text-white text-sm">{weatherData.windSpeed} km/h</span>
                </div>
              </div>
            </div>

            {/* Right: What to Pack Compact Preview */}
            <div className="lg:col-span-6 flex flex-col justify-between p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-white/[0.04]">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold uppercase font-mono text-slate-500 tracking-wider">
                    Recommended Packing Checklist
                  </h3>
                  <span className="text-[10px] text-slate-400">
                    {packingItems.filter(p => p.checked).length} of {packingItems.length} packed
                  </span>
                </div>

                <div className="space-y-2">
                  {packingItems.slice(0, 4).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => togglePackingItem(p.id)}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-white dark:hover:bg-slate-700/40 transition-colors text-left group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${
                          p.checked ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 dark:border-slate-600 text-transparent'
                        }`}>
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span className={`text-xs ${p.checked ? 'text-slate-700 dark:text-slate-300' : 'text-slate-500'}`}>
                          {p.label}
                        </span>
                      </div>
                      <span className="text-[9px] px-2 py-0.5 rounded bg-slate-200/50 dark:bg-slate-700 text-slate-500">
                        {p.category}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 mt-4 border-t border-slate-200/60 dark:border-white/[0.04] flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  {weatherData.condition.toLowerCase().includes('rain') ? 'Pack an umbrella & rain jacket' : 'Pack light & stay hydrated'}
                </span>
                <button
                  type="button"
                  onClick={() => setIsPackingDrawerOpen(true)}
                  className="text-blue-600 dark:text-blue-400 font-medium hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Open Full Checklist</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            6. DESTINATION HIGHLIGHTS (Horizontal Slide Scrolling Carousel)
            ════════════════════════════════════════════════════════════════════ */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-blue-600 dark:text-blue-400 block mb-1">
                Curated Highlights & Attractions
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                EXPLORE {destName.toUpperCase()}
              </h2>
            </div>

            {/* Carousel Controls (Left / Right Arrow Buttons) */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollAttractions('left')}
                className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-sm transition-all cursor-pointer"
                aria-label="Previous Attractions"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollAttractions('right')}
                className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-sm transition-all cursor-pointer"
                aria-label="Next Attractions"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <Link
                to="/destinations"
                className="ml-2 text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline inline-flex items-center gap-1"
              >
                <span>View Directory ({backendAttractions.length}+)</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Smooth Slide Scrolling Carousel Track */}
          {backendAttractions.length > 0 ? (
            <div
              ref={attractionsScrollRef}
              className="flex gap-5 overflow-x-auto pb-4 pt-1 px-1 no-scrollbar scroll-smooth snap-x snap-mandatory"
            >
              {backendAttractions.map((spot, idx) => (
                <div
                  key={spot.id || idx}
                  className="min-w-[280px] sm:min-w-[320px] max-w-[320px] flex-shrink-0 snap-start group bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-white/[0.06] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={spot.image}
                      alt={spot.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full font-medium bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white backdrop-blur-md">
                        {spot.category || 'Landmark'}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                      <span className="font-mono text-[11px] opacity-90">{spot.duration || '2 hours'}</span>
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-300">
                        ★ {spot.rating || 4.8}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {spot.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-light line-clamp-2 mt-1 leading-relaxed">
                        {spot.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-white/[0.04] flex items-center justify-between text-xs">
                      <span className="text-slate-400 text-[11px]">Primary Sight</span>
                      <Link
                        to="/destinations"
                        className="text-blue-600 dark:text-blue-400 text-xs font-medium inline-flex items-center gap-0.5 hover:underline"
                      >
                        <span>View Details</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
              Loading verified attractions for {destName}...
            </div>
          )}
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            7. WHERE TO STAY (Accurate, Real Properties & Hotels)
            ════════════════════════════════════════════════════════════════════ */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-blue-600 dark:text-blue-400 block mb-1">
                Accommodations & Lodging
              </span>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                WHERE TO STAY IN {destName.toUpperCase()}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Top verified hotels and boutique stays evaluated for location, comfort, and transit access
              </p>
            </div>
            <Link
              to="/budget-planner"
              className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline inline-flex items-center gap-1"
            >
              <span>Compare All Rates →</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {accurateHotels.map((h, idx) => (
              <div
                key={idx}
                className="group bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-white/[0.06] shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Hotel Photo */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={h.image}
                      alt={h.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 text-[10px] px-2.5 py-0.5 rounded-full font-medium bg-blue-600 text-white shadow-sm">
                      {h.badge || 'Verified Stay'}
                    </span>
                    <span className="absolute bottom-3 right-3 text-white text-xs font-mono font-bold bg-black/50 px-2.5 py-1 rounded-md backdrop-blur-sm">
                      {h.price} / night
                    </span>
                  </div>

                  {/* Hotel Details */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400">
                        {h.category}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        <span>{h.rating}</span>
                        <span className="text-[10px] text-slate-400 font-normal">({h.reviews})</span>
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {h.name}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 font-light flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{h.area}</span>
                    </p>

                    {/* Amenities tags */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {(h.amenities || []).slice(0, 3).map((amenity, aIdx) => (
                        <span
                          key={aIdx}
                          className="text-[9px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-slate-100 dark:border-white/[0.04] mt-3">
                  <div className="pt-3 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      ✓ Free cancellation
                    </span>
                    <a
                      href={`https://www.google.com/travel/hotels?q=${encodeURIComponent(h.name + ' ' + destName)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 font-medium hover:underline inline-flex items-center gap-0.5"
                    >
                      <span>Check Availability</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            8. GETTING AROUND (Prioritizing Best Recommendation)
            ════════════════════════════════════════════════════════════════════ */}
        <section className="bg-white dark:bg-slate-900/60 rounded-3xl p-6 border border-slate-200/80 dark:border-white/[0.06] shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/[0.04] pb-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Train className="w-5 h-5 text-blue-600" />
              <span>GETTING AROUND {destName.toUpperCase()}</span>
            </h2>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              View Transit Guide →
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Primary Highlight: Best Option */}
            <div className="lg:col-span-6 p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-600 text-white font-bold inline-block mb-3">
                  RECOMMENDED ROUTE
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {transitRecommendations.primary.title}
                </h3>
                <p className="text-xs text-blue-700 dark:text-blue-300 font-medium mt-1">
                  {transitRecommendations.primary.type} · {transitRecommendations.primary.duration} · {transitRecommendations.primary.cost}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-light mt-3 leading-relaxed">
                  {transitRecommendations.primary.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-blue-200/50 dark:border-blue-900/40 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Punctual & Direct</span>
                <span className="text-blue-600 dark:text-blue-400 font-semibold">Fastest Option</span>
              </div>
            </div>

            {/* Alternative Transit Options */}
            <div className="lg:col-span-6 space-y-3 flex flex-col justify-between">
              {transitRecommendations.alternatives.map((alt, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-slate-100 dark:border-white/[0.04] bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 flex-shrink-0 shadow-sm">
                      {idx === 0 ? <Bus className="w-4 h-4" /> : idx === 1 ? <Car className="w-4 h-4" /> : <Navigation className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-white">{alt.name}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{alt.desc}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-medium text-slate-500 px-2 py-1 rounded bg-slate-200/50 dark:bg-slate-700/40 flex-shrink-0">
                    {alt.duration}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            9. FOOD DISCOVERY (Eat & Discover with Real Dish Photos)
            ════════════════════════════════════════════════════════════════════ */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 block mb-1">
                Culinary Gastronomy
              </span>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                EAT & DISCOVER IN {destName.toUpperCase()}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Iconic regional flavors, signature dishes, and local dining traditions
              </p>
            </div>
            <Link
              to="/destinations"
              className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline inline-flex items-center gap-1"
            >
              <span>Explore Food →</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {foodHighlights.map((f, idx) => (
              <div
                key={idx}
                className="group bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-white/[0.06] shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* High Quality Dish Photograph */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={f.image}
                      alt={f.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full font-semibold bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 backdrop-blur-md shadow-sm">
                      {f.tag || 'Local Specialty'}
                    </span>
                    <span className="absolute bottom-2.5 right-3 text-[10px] font-mono text-white/90 bg-black/50 px-2 py-0.5 rounded-md backdrop-blur-sm">
                      {f.dietary || 'Authentic'}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {f.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                      {f.description}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-slate-100 dark:border-white/[0.04] mt-2">
                  <div className="pt-3 text-[11px] text-blue-600 dark:text-blue-400 font-medium flex items-center justify-between">
                    <span>Locally Recommended Specialty</span>
                    <span className="text-slate-400 text-[10px]">Must-Try</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            10. STAY AWARE (Single Tabbed Intelligence Module)
            ════════════════════════════════════════════════════════════════════ */}
        <section className="bg-white dark:bg-slate-900/60 rounded-3xl p-6 border border-slate-200/80 dark:border-white/[0.06] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-white/[0.04] pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span>STAY AWARE</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Essential safety protocols, cultural courtesies, and real-time consular updates
              </p>
            </div>

            {/* Minimalist Tab Switcher */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-medium">
              <button
                type="button"
                onClick={() => setActiveAwareTab('safety')}
                className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeAwareTab === 'safety'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Safety Guidance
              </button>
              <button
                type="button"
                onClick={() => setActiveAwareTab('culture')}
                className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeAwareTab === 'culture'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Cultural Norms
              </button>
              <button
                type="button"
                onClick={() => setActiveAwareTab('news')}
                className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeAwareTab === 'news'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Live Alerts
              </button>
            </div>
          </div>

          {/* Tab 1: Safety Guidance */}
          {activeAwareTab === 'safety' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-white/[0.03] space-y-2">
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block font-semibold">
                  Safety Index: {intel.safetyScore || 92}/100
                </span>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">Very Safe & Orderly</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                  {intel.essentials?.safety?.detail || `${destName} ranks among the world's most secure destinations for international travelers. Main tourist safety considerations focus on pickpocket prevention at major rail hubs and crowded tram lines.`}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-white/[0.03] space-y-2">
                <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 uppercase tracking-wider block font-semibold">
                  Situational Awareness
                </span>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">Common Scams & Crowds</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                  Keep bags zipped in crowded stations and markets. Decline unsolicited offers from unlicensed street operators or unmetered cabs outside transit hubs.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-white/[0.03] space-y-2">
                <span className="text-[10px] font-mono text-rose-600 dark:text-rose-400 uppercase tracking-wider block font-semibold">
                  Emergency Desks
                </span>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">24/7 Response</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                  Universal emergency dispatch reachable 24/7. Major university and city hospitals provide English-speaking emergency rooms and multilingual receptionists.
                </p>
              </div>
            </div>
          )}

          {/* Tab 2: Cultural Norms */}
          {activeAwareTab === 'culture' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-white/[0.03] space-y-2">
                <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 uppercase tracking-wider block font-semibold">
                  Courtesy & Decorum
                </span>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">Polite Interactions</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                  A courteous greeting upon entering shops or taking a taxi is standard social etiquette. Punctuality is deeply respected across all services and rail travel.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-white/[0.03] space-y-2">
                <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 uppercase tracking-wider block font-semibold">
                  Dining & Tipping
                </span>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">Service Charges</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                  Tipping laws vary by destination. In Europe service is included with discretionary rounding; in Japan tipping is not practiced; in North America 15–20% is standard.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-white/[0.03] space-y-2">
                <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 uppercase tracking-wider block font-semibold">
                  Local Regulations
                </span>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">Statutory Quiet Hours</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                  Residential quiet hours are enforced at night (typically 10 PM to 7 AM). Maintain respectful volume in neighborhoods and on late public transportation.
                </p>
              </div>
            </div>
          )}

          {/* Tab 3: Live Alerts (RapidAPI News) */}
          {activeAwareTab === 'news' && (
            <div className="space-y-3">
              {newsLoading ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  Retrieving real-time news & consular advisories...
                </div>
              ) : liveNews && liveNews.length > 0 ? (
                liveNews.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-white/[0.03] flex items-center justify-between gap-4"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{item.title}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{item.description}</p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 flex-shrink-0">Live Advisory</span>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/30 text-xs text-emerald-800 dark:text-emerald-300">
                  ✓ No critical travel advisories, security alerts, or transportation strikes reported for {destName}.
                </div>
              )}
            </div>
          )}

          <div className="pt-2 border-t border-slate-100 dark:border-white/[0.04] flex items-center justify-between text-xs">
            <span className="text-slate-400">Consular updates monitored daily</span>
            <Link
              to="/contact"
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline inline-flex items-center gap-1"
            >
              <span>Open Safety & Culture Desk →</span>
            </Link>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            11. CONTINUE PLANNING YOUR TRIP (Contextual Next Steps)
            ════════════════════════════════════════════════════════════════════ */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              CONTINUE PLANNING YOUR TRIP
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pick up where you left off or fine-tune specialized aspects of your itinerary
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card A: Timeline */}
            <Link
              to={`/ai-trip-planner?destCity=${encodeURIComponent(destName)}&destCountry=${encodeURIComponent(destCountry)}`}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/[0.06] shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700/50 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3 group-hover:scale-110 transition-transform">
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                  Day-by-Day Timeline
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-1 leading-relaxed">
                  Generate optimized hourly schedules, transit routes, and booking checkpoints.
                </p>
              </div>
              <div className="pt-4 mt-3 border-t border-slate-100 dark:border-white/[0.04] text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center justify-between">
                <span>Build Timeline</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card B: Budget Calculator */}
            <Link
              to={`/budget-planner?dest=${encodeURIComponent(destName)}`}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/[0.06] shadow-sm hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700/50 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3 group-hover:scale-110 transition-transform">
                  <DollarSign className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                  Budget Calculator
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-1 leading-relaxed">
                  Calculate lodging, dining, transit, and attraction spending in your home currency.
                </p>
              </div>
              <div className="pt-4 mt-3 border-t border-slate-100 dark:border-white/[0.04] text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
                <span>Calculate Expenses</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card C: Flights Finder */}
            <Link
              to="/destinations"
              className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/[0.06] shadow-sm hover:shadow-md hover:border-purple-300 dark:hover:border-purple-700/50 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-3 group-hover:scale-110 transition-transform">
                  <Navigation className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                  Flight Connections
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-1 leading-relaxed">
                  Compare departure carriers, layover durations, and terminal arrival gates.
                </p>
              </div>
              <div className="pt-4 mt-3 border-t border-slate-100 dark:border-white/[0.04] text-xs font-semibold text-purple-600 dark:text-purple-400 flex items-center justify-between">
                <span>Compare Flights</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card D: Spiritual / Umrah Guide (Contextual) */}
            <Link
              to="/pilgrimage/umrah"
              className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/[0.06] shadow-sm hover:shadow-md hover:border-amber-300 dark:hover:border-amber-700/50 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-3 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
                  Pilgrimage & Sacred Hub
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-1 leading-relaxed">
                  Step-by-step rituals, Nusuk registration guidelines, and spiritual travel tools.
                </p>
              </div>
              <div className="pt-4 mt-3 border-t border-slate-100 dark:border-white/[0.04] text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center justify-between">
                <span>View Sacred Guide</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </section>

      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          MODAL: EDIT TRIP PARAMETERS
          ══════════════════════════════════════════════════════════════════════ */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/[0.04] pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Edit Trip Parameters
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Update departure, dates, or traveling party
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTripUpdate} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                    Origin Country
                  </label>
                  <select
                    value={editOriginCountry}
                    onChange={(e) => {
                      const newCountry = e.target.value;
                      setEditOriginCountry(newCountry);
                      const backendList = getBackendCities(newCountry);
                      setEditOriginCity(backendList && backendList.length > 0 ? backendList[0] : '');
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  >
                    {countries.map((c) => (
                      <option key={c.code} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                    Origin City
                  </label>
                  <input
                    type="text"
                    list="modal-origin-cities"
                    value={editOriginCity}
                    onChange={(e) => setEditOriginCity(e.target.value)}
                    placeholder="e.g. Lahore, Geneva, Zurich"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  />
                  <datalist id="modal-origin-cities">
                    {getBackendCities(editOriginCountry).map((city) => (
                      <option key={city} value={city} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                    Departure Date
                  </label>
                  <input
                    type="date"
                    value={editStartDate}
                    onChange={(e) => setEditStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                    Return Date
                  </label>
                  <input
                    type="date"
                    value={editEndDate}
                    onChange={(e) => setEditEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                    Travelers
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={editTravelers}
                    onChange={(e) => setEditTravelers(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                    Travel Style
                  </label>
                  <select
                    value={editTravelType}
                    onChange={(e) => setEditTravelType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  >
                    <option value="Solo">Solo Traveler</option>
                    <option value="Couple">Couple</option>
                    <option value="Family">Family</option>
                    <option value="Friends">Friends Group</option>
                    <option value="Business">Business</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-white/[0.04]">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm cursor-pointer"
                >
                  Apply Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          MODAL: AUTH PROMPT FOR SIGNED-OUT USERS
          ══════════════════════════════════════════════════════════════════════ */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mx-auto">
              <Lock className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Save Trip to Your Profile
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                Sign in or create a complimentary account to save your {destName} itinerary, export packing guides, and sync checklists.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <Link
                to="/auth?mode=signin"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center shadow-md shadow-blue-500/20"
              >
                Sign In
              </Link>
              <Link
                to="/auth?mode=signup"
                className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center border border-slate-200 dark:border-slate-700"
              >
                Create Free Account
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setIsAuthModalOpen(false)}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              Continue exploring as guest
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          DRAWER: FULL PACKING CHECKLIST
          ══════════════════════════════════════════════════════════════════════ */}
      {isPackingDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 w-full max-w-md h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/[0.04] pb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Smart Packing Checklist
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Tailored for {weatherData.temp}°C {weatherData.condition} in {destName}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPackingDrawerOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {packingItems.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => togglePackingItem(p.id)}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-white/[0.04] hover:bg-slate-50 dark:hover:bg-slate-800/40 text-left cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        p.checked ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 dark:border-slate-600 text-transparent'
                      }`}>
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span className={`text-xs ${p.checked ? 'text-slate-400 line-through' : 'text-slate-800 dark:text-slate-200 font-medium'}`}>
                        {p.label}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                      {p.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-white/[0.04] space-y-3">
              <button
                type="button"
                onClick={() => setIsPackingDrawerOpen(false)}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm cursor-pointer"
              >
                Done ({packingItems.filter(p => p.checked).length}/{packingItems.length} Packed)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
