import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation, useSearchParams, Link } from 'react-router-dom';
import {
  DollarSign,
  Sun,
  Shield,
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronRight,
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
  Lock
} from 'lucide-react';
import { resolveDestinationIntelligence } from '../../data/commandCenterIntelligence';
import { countries } from '../../data';
import { getBackendCities } from '../../data/backendCities';
import { attractionKnowledgeBase, realCityFoodAndTransit } from '../../data/attractionKnowledgeBase';
import { fetchLiveNews } from '../../utils/rapidApiService';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../utils/supabaseClient';

export default function TripCommandCenter({ destination }) {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  // ── 1. Extract and Normalize Trip Context ──────────────────────────────────
  const destName = destination?.name || searchParams.get('destCity') || location.state?.destinationCity || 'Paris';
  const destCountry = destination?.country || searchParams.get('destCountry') || location.state?.destinationCountry || 'France';

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

  // ── 2. Destination Type Determination ─────────────────────────────────────
  const destinationType = useMemo(() => {
    if (destination?.rank) {
      if (destination.rank.includes('Country')) return 'country';
      if (destination.rank.includes('Attraction')) return 'attraction';
      if (destination.rank.includes('State')) return 'state';
      return 'city';
    }
    const slugLower = (destination?.id || destName).toLowerCase();
    const isCountry = countries.some(c => c.name.toLowerCase() === slugLower || c.code.toLowerCase() === slugLower);
    if (isCountry) return 'country';
    return 'city';
  }, [destination, destName]);

  // ── 3. Edit Trip Modal State ──────────────────────────────────────────────
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editOriginCountry, setEditOriginCountry] = useState(originCountry);
  const [editOriginCity, setEditOriginCity] = useState(originCity);
  const [editStartDate, setEditStartDate] = useState(startDate);
  const [editEndDate, setEditEndDate] = useState(endDate);
  const [editTravelers, setEditTravelers] = useState(travelers);
  const [editTravelType, setEditTravelType] = useState(travelType);

  // ── 4. Auth Prompt Modal for Signed-out Users ─────────────────────────────
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // ── 5. Destination Intelligence ───────────────────────────────────────────
  const intel = useMemo(() => {
    return resolveDestinationIntelligence(destName, destCountry);
  }, [destName, destCountry]);

  // ── 6. Date & Duration Calculations ───────────────────────────────────────
  const { durationDays, dateRangeFormatted } = useMemo(() => {
    if (!startDate || !endDate) {
      return { durationDays: 7, dateRangeFormatted: 'Jun 15 – Jun 22, 2026' };
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const days = isNaN(diffDays) || diffDays < 1 ? 7 : diffDays;
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const formatted = `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('en-US', options)}`;
    return { durationDays: days, dateRangeFormatted: formatted };
  }, [startDate, endDate]);

  // ── 7. Open-Meteo Live Weather Telemetry ──────────────────────────────────
  const [weatherData, setWeatherData] = useState({
    temp: 21,
    feelsLike: 20,
    condition: 'Partly Cloudy',
    high: 24,
    low: 15,
    humidity: 58,
    windSpeed: 11,
    uvIndex: 4,
    code: 2,
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
        let lat = 48.8566;
        let lng = 2.3522;
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
            high: data.daily?.temperature_2m_max ? Math.round(data.daily.temperature_2m_max[0]) : 24,
            low: data.daily?.temperature_2m_min ? Math.round(data.daily.temperature_2m_min[0]) : 14,
            humidity: data.current.relative_humidity_2m || 55,
            windSpeed: Math.round(data.current.wind_speed_10m || 10),
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

  // ── 8. Interactive Next Steps Mini-Checklist ─────────────────────────────
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

  const completedCount = checklist.filter(c => c.completed).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  // ── 9. Trip Essentials Accordion (Progressive Disclosure) ─────────────────
  const [expandedEssential, setExpandedEssential] = useState('visa');

  const toggleEssential = (key) => {
    setExpandedEssential(prev => prev === key ? null : key);
  };

  // ── 10. Your First Hour Stepper (Signature Stepper) ──────────────────────
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const firstHourSteps = intel.firstHour || [
    { step: 1, title: 'Land & Baggage', category: 'Arrival', summary: 'Follow arrival signs to Terminal Baggage Hall.', detail: 'Exit jet bridge and proceed to baggage carousels. Follow terminal exit signs.', badge: 'Arrival' },
    { step: 2, title: 'Immigration & Customs', category: 'Border', summary: 'Present your valid passport & entry documentation.', detail: 'Keep passport, accommodation confirmation, and return flight itinerary accessible.', badge: 'Passport Control' },
    { step: 3, title: 'Connectivity & eSIM', category: 'Tech', summary: 'Connect to airport Wi-Fi or toggle your digital eSIM.', detail: 'Activate mobile data roaming on your digital eSIM profile or log onto complimentary airport Wi-Fi.', badge: 'Free 5G Wi-Fi' },
    { step: 4, title: 'Cash & Local Currency', category: 'Money', summary: 'Use official bank ATMs inside arrival hall.', detail: 'Avoid high-fee commercial airport currency exchange kiosks; bank ATMs give official interbank rates.', badge: 'ATM Access' },
    { step: 5, title: 'Airport Express Transit', category: 'Transport', summary: `Take direct train or express shuttle into central ${destName}.`, detail: 'Follow rail signs directly from the terminal. Trains and shuttles depart frequently into central stations.', badge: 'Fast Transit' },
    { step: 6, title: 'Hotel Check-in', category: 'Check-in', summary: 'Arrive at hotel, drop bags, and claim city transit passes.', detail: 'Ask front desk staff for city visitor maps, public transport guidance, and Wi-Fi access credentials.', badge: 'Check-in' }
  ];

  // ── 11. Weather + What to Pack ───────────────────────────────────────────
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

  // ── 12. Data-Driven Destination Highlights (Backend-driven) ──────────────
  const backendAttractions = useMemo(() => {
    const slugNorm = destName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const foundKey = Object.keys(attractionKnowledgeBase).find(key => {
      const kNorm = key.toLowerCase().replace(/[^a-z0-9]/g, '');
      return slugNorm === kNorm || slugNorm.includes(kNorm) || kNorm.includes(slugNorm);
    });

    if (foundKey && attractionKnowledgeBase[foundKey] && attractionKnowledgeBase[foundKey].length > 0) {
      return attractionKnowledgeBase[foundKey].map(a => ({
        id: a.id,
        name: a.name,
        category: a.category || 'Must See',
        duration: a.visitDuration || '1.5 - 2 hours',
        image: a.image || (a.images && a.images[0]) || 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80',
        description: a.description || a.longDescription || `Iconic landmark in ${destName}.`,
        rating: a.rating || 4.8
      }));
    }

    if (destination?.attractions && Array.isArray(destination.attractions) && destination.attractions.length > 0) {
      return destination.attractions.map((attr, idx) => {
        const name = typeof attr === 'string' ? attr : attr.name || `Attraction ${idx + 1}`;
        return {
          id: `attr-${idx}`,
          name: name,
          category: 'Landmark',
          duration: '1.5 hours',
          image: typeof attr === 'object' && attr.image ? attr.image : 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
          description: typeof attr === 'object' && attr.description ? attr.description : `Scenic and historic landmark in ${destName}.`,
          rating: 4.8
        };
      });
    }

    if (intel.curatedAttractions && intel.curatedAttractions.length > 0) {
      return intel.curatedAttractions;
    }

    return [];
  }, [destName, destination, intel]);

  // Desktop shows max 3, mobile shows max 2
  const visibleAttractions = backendAttractions.slice(0, 3);
  const remainingAttractionsCount = Math.max(0, backendAttractions.length - 3);

  // ── 13. Where to Stay (Max 3 Neighborhoods) ──────────────────────────────
  const neighborhoods = useMemo(() => {
    const raw = intel.neighborhoods || [
      { name: 'Historic Old Town', bestFor: 'First-time visitors & sightseeing', description: 'Walkable cobblestone streets, landmark architecture, and easy access to heritage sights.', avgNight: '$160 - $280', vibe: 'Historic & Central' },
      { name: 'Waterfront / Riverside', bestFor: 'Scenic dining & lakeside strolls', description: 'Scenic promenades lined with cafés, boutique restaurants, and panoramic sunset overlooks.', avgNight: '$180 - $340', vibe: 'Scenic & Chic' },
      { name: 'Central Transit Hub', bestFor: 'Fast airport access & day trips', description: 'Surrounding the primary railway station. Unmatched transit connectivity across the country.', avgNight: '$130 - $240', vibe: 'Connected & Easy' }
    ];
    return raw.slice(0, 3);
  }, [intel]);

  // ── 14. Getting Around (Prioritized Best Recommendation) ──────────────────
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

  // ── 15. Food Discovery (2-3 highlights) ──────────────────────────────────
  const foodHighlights = useMemo(() => {
    const cityKey = destName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const realFood = realCityFoodAndTransit?.[cityKey]?.foods;
    if (realFood && Array.isArray(realFood) && realFood.length > 0) {
      return realFood.slice(0, 3).map((f, idx) => ({
        id: `food-${idx}`,
        name: typeof f === 'string' ? f : f.name || f,
        tag: f.tag || 'Local Specialty',
        description: f.desc || `Authentic culinary classic enjoyed across ${destName}.`,
        dietary: f.dietary || 'Authentic'
      }));
    }
    return (intel.foodHighlights || [
      { name: 'Signature Local Fondue / Stew', tag: 'Traditional Heritage', description: 'Slow-cooked local classic served in authentic bistros and historical taverns.', dietary: 'Local Specialty' },
      { name: 'Fresh Catch / Lake Fillets', tag: 'Regional Delicate', description: 'Lightly sautéed with lemon butter and fresh herbs, paired with crisp seasonal sides.', dietary: 'Pescatarian' },
      { name: 'Artisanal Chocolates & Pastries', tag: 'Sweet Icon', description: 'World-famous handcrafted confections from heritage master chocolatiers.', dietary: 'Vegetarian' }
    ]).slice(0, 3);
  }, [destName, intel]);

  // ── 16. Stay Aware (Safety / Culture / Live Alerts Tabs) ──────────────────
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

  // ── 17. Save Trip Action (Signed-in vs Signed-out) ────────────────────────
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* ════════════════════════════════════════════════════════════════════
            1. TRIP HEADER & SPACIOUS SUB-STRIP
            ════════════════════════════════════════════════════════════════════ */}
        <section className="border-b border-slate-200/80 dark:border-white/[0.08] pb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-blue-600 dark:text-blue-400 mb-2">
                <span>Trip Command Center</span>
                <span>•</span>
                <span>{destCountry}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                {originCity || originCountry} <span className="text-slate-400 font-light">→</span> {destName}
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal">
                {dateRangeFormatted} · {durationDays} Days · {travelers} Travelers ({travelType})
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300 shadow-sm hover:shadow transition-all cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5 text-slate-500" />
                <span>Edit Parameters</span>
              </button>

              <button
                type="button"
                onClick={handleSaveTrip}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                {isSaved ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Saved to Trips</span>
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

          {/* Calm, Horizontal Information Strip */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-white/[0.04] grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Sun className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[10px] uppercase font-mono tracking-wider text-slate-400">Weather</span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {weatherData.loading ? 'Syncing...' : `${weatherData.temp}°C · ${weatherData.condition}`}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[10px] uppercase font-mono tracking-wider text-slate-400">Currency</span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {intel.currency ? `${intel.currency.code} (1 USD ≈ ${intel.currency.rate} ${intel.currency.code})` : 'USD / Contactless'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[10px] uppercase font-mono tracking-wider text-slate-400">Time Zone</span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[140px]">
                  {intel.timezone || 'Local Time (UTC)'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[10px] uppercase font-mono tracking-wider text-slate-400">Trip Readiness</span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {progressPercent}% Prepared
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            2. TRIP AT A GLANCE (Two-Column Layout)
            ════════════════════════════════════════════════════════════════════ */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: [City] at a Glance */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900/60 rounded-3xl p-6 border border-slate-200/80 dark:border-white/[0.06] shadow-sm">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-white/[0.04]">
              <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-blue-600" />
                <span>{destName} at a Glance</span>
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-medium border border-emerald-200/50 dark:border-emerald-800/30">
                Open for Tourism
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-white/[0.03]">
                <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Current Climate</span>
                <p className="font-medium text-slate-800 dark:text-slate-200">
                  {weatherData.loading ? 'Updating live...' : `${weatherData.temp}°C · ${weatherData.condition} (High ${weatherData.high}°C / Low ${weatherData.low}°C)`}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-white/[0.03]">
                <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Local Payments</span>
                <p className="font-medium text-slate-800 dark:text-slate-200">
                  {intel.essentials?.money?.status || '97% Contactless Card Acceptance · Official Bank ATMs'}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-white/[0.03]">
                <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Visa & Entry Status</span>
                <p className="font-medium text-slate-800 dark:text-slate-200 truncate">
                  {intel.essentials?.visa?.status || 'Valid passport (min. 6 months validity required)'}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-white/[0.03]">
                <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Safety & Civics</span>
                <p className="font-medium text-slate-800 dark:text-slate-200">
                  Safety Index: {intel.safetyScore || 90}/100 · Peaceful & Welcoming
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed">
              {destination?.preview || destination?.description || `Explore ${destName}, ${destCountry}. Discover iconic architectural heritage, lakeside promenades, efficient transit, and rich regional culinary traditions.`}
            </p>
          </div>

          {/* Right Column: Your Next Steps */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900/60 rounded-3xl p-6 border border-slate-200/80 dark:border-white/[0.06] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-white/[0.04]">
                <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Your Next Steps</span>
                </h2>
                <span className="text-xs font-mono font-medium text-slate-500">
                  {completedCount} of {checklist.length} Completed
                </span>
              </div>

              {/* Subtle Progress Bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mb-5 overflow-hidden">
                <div
                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Compact Checklist */}
              <div className="space-y-2.5">
                {checklist.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleChecklistItem(item.id)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        item.completed
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-slate-300 dark:border-slate-600 text-transparent'
                      }`}>
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span className={`text-xs ${item.completed ? 'text-slate-800 dark:text-slate-200 line-through opacity-60' : 'text-slate-700 dark:text-slate-300 font-medium'}`}>
                        {item.label}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 group-hover:text-blue-600 transition-colors">
                      {item.completed ? 'Done' : 'Mark'}
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
            3. TRIP ESSENTIALS (Progressive Disclosure 2-Col Grid)
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
            <div className="bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-white/[0.06] shadow-sm transition-all overflow-hidden">
              <button
                type="button"
                onClick={() => toggleEssential('visa')}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 flex-shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-slate-900 dark:text-white">Visa & Entry Requirements</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[240px] sm:max-w-xs">
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
                <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-white/[0.04] text-xs text-slate-600 dark:text-slate-300 space-y-3">
                  <p className="leading-relaxed text-[11px]">
                    {intel.essentials?.visa?.detail || `Travelers holding passport from ${originCountry} traveling to ${destCountry} require standard passport validation with at least 6 months remaining validity, proof of accommodation, and medical travel coverage.`}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <a
                      href={intel.essentials?.visa?.officialLink || "https://www.eda.admin.ch"}
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
            <div className="bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-white/[0.06] shadow-sm transition-all overflow-hidden">
              <button
                type="button"
                onClick={() => toggleEssential('safety')}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-slate-900 dark:text-white">Safety & Health Protocol</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[240px] sm:max-w-xs">
                      {intel.essentials?.safety?.summary || `Safety Index: ${intel.safetyScore || 90}/100 · Low violent crime`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                    Very Safe
                  </span>
                  {expandedEssential === 'safety' ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {expandedEssential === 'safety' && (
                <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-white/[0.04] text-xs text-slate-600 dark:text-slate-300 space-y-3">
                  <p className="leading-relaxed text-[11px]">
                    {intel.essentials?.safety?.detail || `${destName} maintains very high civic order and low violent crime. Primary caution is situational awareness against pickpockets around crowded train stations and tourist squares. Tap water is pure and 100% safe to drink.`}
                  </p>
                  <div className="flex items-center gap-2 pt-1 text-[11px]">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Hotlines:</span>
                    <span className="font-mono text-slate-500">Police 117 · Ambulance 144 · Universal 112</span>
                  </div>
                </div>
              )}
            </div>

            {/* Card 3: Money & Payments */}
            <div className="bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-white/[0.06] shadow-sm transition-all overflow-hidden">
              <button
                type="button"
                onClick={() => toggleEssential('money')}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-slate-900 dark:text-white">Money & Payments</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[240px] sm:max-w-xs">
                      {intel.essentials?.money?.summary || `Currency: ${intel.currency?.code || 'Local'} · High card acceptance`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                    Card Friendly
                  </span>
                  {expandedEssential === 'money' ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {expandedEssential === 'money' && (
                <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-white/[0.04] text-xs text-slate-600 dark:text-slate-300 space-y-3">
                  <p className="leading-relaxed text-[11px]">
                    {intel.essentials?.money?.detail || 'Contactless Visa, Mastercard, Apple Pay, and Google Pay work practically everywhere including public transit and cafés. Official bank ATMs inside terminals give cleanest interbank exchange rates.'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Tipping: Service is included in bills; rounding up 5–10% for courteous table service is polite.
                  </p>
                </div>
              )}
            </div>

            {/* Card 4: Connectivity & Power */}
            <div className="bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-white/[0.06] shadow-sm transition-all overflow-hidden">
              <button
                type="button"
                onClick={() => toggleEssential('connectivity')}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 flex-shrink-0">
                    <Wifi className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-slate-900 dark:text-white">Connectivity & Power</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[240px] sm:max-w-xs">
                      {intel.essentials?.connectivity?.summary || '230V 50Hz · Type J/C sockets · 5G eSIM'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                    Fast 5G
                  </span>
                  {expandedEssential === 'connectivity' ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {expandedEssential === 'connectivity' && (
                <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-white/[0.04] text-xs text-slate-600 dark:text-slate-300 space-y-3">
                  <p className="leading-relaxed text-[11px]">
                    {intel.essentials?.connectivity?.detail || 'Standard European 2-pin Europlugs (Type C) fit into most recessed sockets. Local digital eSIMs activate instantly upon landing with LTE/5G roaming.'}
                  </p>
                </div>
              )}
            </div>

            {/* Card 5: Local Transport */}
            <div className="bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-white/[0.06] shadow-sm transition-all overflow-hidden">
              <button
                type="button"
                onClick={() => toggleEssential('transport')}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-50 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 flex-shrink-0">
                    <Train className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-slate-900 dark:text-white">Local Transport System</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[240px] sm:max-w-xs">
                      {intel.essentials?.transport?.summary || 'Free hotel transport card · Punctual trams & trains'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300">
                    Integrated
                  </span>
                  {expandedEssential === 'transport' ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {expandedEssential === 'transport' && (
                <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-white/[0.04] text-xs text-slate-600 dark:text-slate-300 space-y-3">
                  <p className="leading-relaxed text-[11px]">
                    {intel.essentials?.transport?.detail || 'Public transit networks are clean, punctual, and safe. Registered accommodation often provides complimentary local transport cards valid across all trams, buses, and city boats.'}
                  </p>
                </div>
              )}
            </div>

            {/* Card 6: Culture & Etiquette */}
            <div className="bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-white/[0.06] shadow-sm transition-all overflow-hidden">
              <button
                type="button"
                onClick={() => toggleEssential('culture')}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400 flex-shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-slate-900 dark:text-white">Cultural Etiquette & Customs</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[240px] sm:max-w-xs">
                      {intel.essentials?.culture?.summary || 'Polite greetings · Punctuality · Sunday shop closures'}
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
                <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-white/[0.04] text-xs text-slate-600 dark:text-slate-300 space-y-3">
                  <p className="leading-relaxed text-[11px]">
                    {intel.essentials?.culture?.detail || 'Courteous greetings upon entering small shops and punctuality are cherished. Stores and pharmacies are typically closed on Sundays, with the exception of major train station shops.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            4. YOUR FIRST HOUR IN [CITY] (Signature Interactive Stepper)
            ════════════════════════════════════════════════════════════════════ */}
        <section className="bg-white dark:bg-slate-900/60 rounded-3xl p-6 border border-slate-200/80 dark:border-white/[0.06] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-white/[0.04] pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-blue-600 dark:text-blue-400 block mb-1">
                Signature Arrival Guide
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                YOUR FIRST HOUR IN {destName.toUpperCase()}
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Milestone {activeStepIdx + 1} of {firstHourSteps.length}</span>
            </div>
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

          {/* Active Step Detailed Information Card */}
          {firstHourSteps[activeStepIdx] && (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-white/[0.04] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-mono font-bold flex items-center justify-center">
                    {firstHourSteps[activeStepIdx].step}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {firstHourSteps[activeStepIdx].title}
                  </h3>
                </div>
                <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium">
                  {firstHourSteps[activeStepIdx].badge || firstHourSteps[activeStepIdx].category}
                </span>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                {firstHourSteps[activeStepIdx].summary}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                {firstHourSteps[activeStepIdx].detail}
              </p>

              {/* Stepper Navigation Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200/50 dark:border-white/[0.04]">
                <button
                  type="button"
                  disabled={activeStepIdx === 0}
                  onClick={() => setActiveStepIdx(prev => Math.max(0, prev - 1))}
                  className="text-xs px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  ← Previous Step
                </button>

                <button
                  type="button"
                  disabled={activeStepIdx === firstHourSteps.length - 1}
                  onClick={() => setActiveStepIdx(prev => Math.min(firstHourSteps.length - 1, prev + 1))}
                  className="text-xs px-4 py-1.5 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
                >
                  <span>Next Step</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            5. WEATHER & WHAT TO PACK (Unified Section)
            ════════════════════════════════════════════════════════════════════ */}
        <section className="bg-white dark:bg-slate-900/60 rounded-3xl p-6 border border-slate-200/80 dark:border-white/[0.06] shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/[0.04] pb-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sun className="w-5 h-5 text-amber-500" />
              <span>WEATHER & WHAT TO PACK</span>
            </h2>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              Live Forecast Telemetry
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Live Open-Meteo Weather Telemetry */}
            <div className="lg:col-span-6 p-5 rounded-2xl bg-gradient-to-br from-blue-50/50 via-slate-50 to-white dark:from-slate-800/40 dark:via-slate-900/40 dark:to-slate-800/20 border border-blue-100/50 dark:border-white/[0.04] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Live Open-Meteo Telemetry
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Real-time</span>
                </div>

                <div className="flex items-baseline gap-3 mt-4">
                  <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    {weatherData.temp}°C
                  </span>
                  <div className="text-xs">
                    <span className="block font-semibold text-slate-800 dark:text-slate-200">
                      {weatherData.condition}
                    </span>
                    <span className="text-slate-400">
                      Feels like {weatherData.feelsLike}°C
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-6 mt-6 border-t border-slate-200/60 dark:border-white/[0.04] text-xs">
                <div>
                  <span className="block text-[10px] uppercase font-mono text-slate-400">High / Low</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{weatherData.high}° / {weatherData.low}°</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-mono text-slate-400">Humidity</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{weatherData.humidity}%</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-mono text-slate-400">Wind</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{weatherData.windSpeed} km/h</span>
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

              <div className="pt-4 border-t border-slate-200/50 dark:border-white/[0.04] flex items-center justify-between">
                <span className="text-xs text-slate-400">Custom packing gear ready</span>
                <button
                  type="button"
                  onClick={() => setIsPackingDrawerOpen(true)}
                  className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Open Full Checklist</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            6. DESTINATION HIGHLIGHTS (Data-Driven, No Hardcoded Mockups)
            ════════════════════════════════════════════════════════════════════ */}
        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-blue-600 dark:text-blue-400 block mb-1">
                Curated Highlights
              </span>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                EXPLORE {destName.toUpperCase()}
              </h2>
            </div>
            <Link
              to="/destinations"
              className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline inline-flex items-center gap-1"
            >
              <span>Explore all {destName} ({backendAttractions.length || 10}+ places)</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {visibleAttractions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {visibleAttractions.map((spot, idx) => (
                <div
                  key={spot.id || idx}
                  className="group bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-white/[0.06] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
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
                      <span className="text-slate-400 text-[11px]">Primary Landmark</span>
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

          {remainingAttractionsCount > 0 && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-white/[0.04] flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-300 font-medium">
                + {remainingAttractionsCount} more places documented across {destName}
              </span>
              <Link
                to="/destinations"
                className="px-4 py-1.5 rounded-full bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-medium shadow-sm hover:shadow transition-all inline-flex items-center gap-1"
              >
                <span>Explore Full Directory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            7. WHERE TO STAY (Max 3 Neighborhoods)
            ════════════════════════════════════════════════════════════════════ */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                WHERE TO STAY
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Top curated districts recommended by travel style and transit proximity
              </p>
            </div>
            <Link
              to="/destinations"
              className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline inline-flex items-center gap-1"
            >
              <span>Explore Neighborhoods</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {neighborhoods.map((n, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/[0.06] shadow-sm flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium">
                      {n.vibe || 'Curated District'}
                    </span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-mono">
                      {n.avgNight || '$150/nt'}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {n.name}
                  </h3>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-0.5">
                    {n.bestFor}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-2 leading-relaxed">
                    {n.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-white/[0.04] text-[11px] text-slate-400 flex items-center justify-between">
                  <span>{n.transit || 'Direct transit access'}</span>
                  <Link
                    to="/budget-planner"
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    Compare Hotels →
                  </Link>
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
              View Transport Options →
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
                <p className="text-xs text-slate-600 dark:text-slate-300 font-light mt-3 leading-relaxed">
                  {transitRecommendations.primary.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-blue-200/60 dark:border-blue-900/40 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Direct Airport Link</span>
                <span className="text-blue-600 dark:text-blue-400 font-medium">Every 10–12 Mins</span>
              </div>
            </div>

            {/* Smaller Alternatives */}
            <div className="lg:col-span-6 space-y-3">
              {transitRecommendations.alternatives.map((alt, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-white/[0.03] flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-200/60 dark:bg-slate-700/60 flex items-center justify-center text-slate-700 dark:text-slate-300">
                      {idx === 0 ? <Bus className="w-4 h-4" /> : idx === 1 ? <Car className="w-4 h-4" /> : <Navigation className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{alt.name}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-light leading-snug">{alt.desc}</p>
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
            9. FOOD DISCOVERY (Eat & Discover)
            ════════════════════════════════════════════════════════════════════ */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                EAT & DISCOVER
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {foodHighlights.map((f, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/[0.06] shadow-sm flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-medium">
                      {f.tag || 'Specialty'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {f.dietary}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {f.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-1 leading-relaxed">
                    {f.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-white/[0.04] text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                  Locally Recommended Specialty
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
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Safety index, etiquette decorum, and live travel advisories feed
              </p>
            </div>

            {/* Segmented Tabs: Safety | Culture | Live Alerts */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setActiveAwareTab('safety')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeAwareTab === 'safety'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Safety
              </button>
              <button
                type="button"
                onClick={() => setActiveAwareTab('culture')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeAwareTab === 'culture'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Culture
              </button>
              <button
                type="button"
                onClick={() => setActiveAwareTab('alerts')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeAwareTab === 'alerts'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Live Alerts
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeAwareTab === 'safety' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-4 p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/30 text-center">
                <span className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                  {intel.safetyScore || 92}
                </span>
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 block mt-1">
                  Safety Index (Out of 100)
                </span>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-light mt-1">
                  Very low violent crime · High civic stability
                </p>
              </div>

              <div className="lg:col-span-8 space-y-3 text-xs text-slate-600 dark:text-slate-300">
                <p className="leading-relaxed">
                  {intel.essentials?.safety?.detail || `${destName} ranks among the world's most secure destinations for international travelers. Main tourist safety considerations focus on pickpocket prevention at major rail hubs and crowded tram lines.`}
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Emergency Dispatch:</span>
                  <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[11px]">Police: 117</span>
                  <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[11px]">Ambulance: 144</span>
                  <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[11px]">Universal: 112</span>
                </div>
              </div>
            </div>
          )}

          {activeAwareTab === 'culture' && (
            <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-white/[0.03]">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">Civic Greetings & Language</h4>
                  <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                    Always offer a courteous &quot;Bonjour&quot; upon entering bakeries and shops. English is widely spoken in hotels, fine dining, and rail hubs.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-white/[0.03]">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">Sunday Rest Laws</h4>
                  <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                    Supermarkets, pharmacies, and general retail stores are closed on Sundays under labor laws. Plan grocery needs on Saturdays.
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 pt-1">
                Tipping: Hospitality bills legally include service fees. Rounding up 5–10% for table dining is polite recognition.
              </p>
            </div>
          )}

          {activeAwareTab === 'alerts' && (
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
              One-click access to dedicated planning engines and personalized itinerary builders
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Day-by-Day Timeline */}
            <Link
              to={`/ai-trip-planner?destCity=${encodeURIComponent(destName)}&destCountry=${encodeURIComponent(destCountry)}&originCity=${encodeURIComponent(originCity)}&originCountry=${encodeURIComponent(originCountry)}&startDate=${startDate}&endDate=${endDate}&travelers=${travelers}`}
              className="group p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/[0.06] hover:border-blue-500/50 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3 group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                  DAY-BY-DAY TIMELINE
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-1.5 leading-relaxed">
                  Generate hour-by-hour routing, museum slots, and personalized pace.
                </p>
              </div>
              <div className="pt-4 mt-3 border-t border-slate-100 dark:border-white/[0.04] text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center justify-between">
                <span>Build Timeline</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 2: Budget Planner */}
            <Link
              to={`/budget-planner?country=${encodeURIComponent(destCountry)}&city=${encodeURIComponent(destName)}`}
              className="group p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/[0.06] hover:border-emerald-500/50 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3 group-hover:scale-110 transition-transform">
                  <DollarSign className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                  BUDGET PLANNER
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-1.5 leading-relaxed">
                  Calculate lodging, dining, transit, and daily allowances in local currency.
                </p>
              </div>
              <div className="pt-4 mt-3 border-t border-slate-100 dark:border-white/[0.04] text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
                <span>Create Budget</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 3: Real Flight Pricing */}
            <Link
              to="/destinations"
              className="group p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/[0.06] hover:border-purple-500/50 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-3 group-hover:scale-110 transition-transform">
                  <Navigation className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                  FLIGHT PRICING
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-1.5 leading-relaxed">
                  Compare nonstop routes and connecting layovers into {intel.airportCode || 'Hub'}.
                </p>
              </div>
              <div className="pt-4 mt-3 border-t border-slate-100 dark:border-white/[0.04] text-xs font-semibold text-purple-600 dark:text-purple-400 flex items-center justify-between">
                <span>Check Flights</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 4: Religious Travel / Pilgrimage */}
            <Link
              to="/pilgrimage"
              className="group p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/[0.06] hover:border-amber-500/50 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-3 group-hover:scale-110 transition-transform">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                  RELIGIOUS TRAVEL
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-1.5 leading-relaxed">
                  Explore faith-based itineraries, historic shrines, and sacred pilgrimages.
                </p>
              </div>
              <div className="pt-4 mt-3 border-t border-slate-100 dark:border-white/[0.04] text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center justify-between">
                <span>Explore Hub</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </section>

      </div>

      {/* ════════════════════════════════════════════════════════════════════
          12. AUTH PROMPT MODAL (For Gated Actions)
          ════════════════════════════════════════════════════════════════════ */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 text-center">
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mx-auto">
              <Lock className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Sign in to save your trip
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                Sign in to save your trip to your personal dashboard, track budget estimates, and sync your personalized day-by-day travel timeline.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <Link
                to={`/auth?mode=login&returnUrl=${encodeURIComponent(location.pathname + location.search)}`}
                className="w-full py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all"
              >
                Sign In
              </Link>
              <Link
                to={`/auth?mode=signup&returnUrl=${encodeURIComponent(location.pathname + location.search)}`}
                className="w-full py-2.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                Create Account
              </Link>
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 pt-1 cursor-pointer"
              >
                Continue browsing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          13. EDIT TRIP PARAMETERS MODAL
          ════════════════════════════════════════════════════════════════════ */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-600" />
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  Adjust Trip Parameters
                </h3>
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
                    <option value="Couple">Couple / Partner</option>
                    <option value="Family">Family Travel</option>
                    <option value="Group">Friends Group</option>
                    <option value="Business">Business Trip</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer"
                >
                  Update Command Center
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          14. FULL PACKING CHECKLIST DRAWER / MODAL
          ════════════════════════════════════════════════════════════════════ */}
      {isPackingDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Luggage className="w-4 h-4 text-blue-600" />
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  Packing Checklist for {destName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPackingDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2 pr-1 no-scrollbar">
              {packingItems.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => togglePackingItem(p.id)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left group cursor-pointer border border-slate-100 dark:border-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                      p.checked ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 dark:border-slate-600 text-transparent'
                    }`}>
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span className={`text-xs ${p.checked ? 'text-slate-800 dark:text-slate-200 line-through opacity-70' : 'text-slate-700 dark:text-slate-300 font-medium'}`}>
                      {p.label}
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                    {p.category}
                  </span>
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">
                {packingItems.filter(p => p.checked).length} of {packingItems.length} items packed
              </span>
              <button
                type="button"
                onClick={() => setIsPackingDrawerOpen(false)}
                className="px-4 py-2 rounded-xl font-medium bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
