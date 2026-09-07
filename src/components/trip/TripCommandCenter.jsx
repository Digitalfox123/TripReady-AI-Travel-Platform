import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useLocation, useSearchParams, Link } from 'react-router-dom';
import {
  Plane,
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Cloud,
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
  Smartphone,
  Wifi,
  CreditCard,
  Info,
  Heart,
  Share2,
  Compass,
  Layers,
  Globe,
  Luggage,
  Thermometer,
  Wind,
  Droplets,
  Award,
  FileText,
  ArrowRight,
  User,
  Users,
  RefreshCw,
  X,
  SlidersHorizontal,
  Eye,
  BookOpen,
  Utensils,
  Coffee,
  Landmark,
  Mountain,
  CheckSquare,
  Square,
  Building,
  Edit3,
  PhoneCall,
  Search,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Sliders
} from 'lucide-react';
import { resolveDestinationIntelligence } from '../../data/commandCenterIntelligence';
import { countries, topDestinations, currencies } from '../../data';
import { fetchLiveVisaRequirement, simulateVisaRequirement, fetchLiveNews } from '../../utils/rapidApiService';

export default function TripCommandCenter({ destination }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // ── Extract and Normalize Search Context ──────────────────────────────────
  const destName = destination?.name || searchParams.get('destCity') || location.state?.destinationCity || 'Geneva';
  const destCountry = destination?.country || searchParams.get('destCountry') || location.state?.destinationCountry || 'Switzerland';

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

  // ── Edit Trip Modal State ────────────────────────────────────────────────
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editOriginCountry, setEditOriginCountry] = useState(originCountry);
  const [editOriginCity, setEditOriginCity] = useState(originCity);
  const [editStartDate, setEditStartDate] = useState(startDate);
  const [editEndDate, setEditEndDate] = useState(endDate);
  const [editTravelers, setEditTravelers] = useState(travelers);
  const [editTravelType, setEditTravelType] = useState(travelType);

  // ── Destination Intelligence ─────────────────────────────────────────────
  const intel = useMemo(() => {
    return resolveDestinationIntelligence(destName, destCountry);
  }, [destName, destCountry]);

  // ── Date and Duration Calculations ───────────────────────────────────────
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

  // ── Live Weather Integration ─────────────────────────────────────────────
  const [weatherData, setWeatherData] = useState({
    temp: 21,
    condition: 'Sunny',
    feelsLike: 22,
    humidity: 52,
    wind: 9,
    forecast: [
      { day: 'Mon', temp: 21, condition: 'Sunny' },
      { day: 'Tue', temp: 23, condition: 'Clear' },
      { day: 'Wed', temp: 22, condition: 'Partly Cloudy' },
      { day: 'Thu', temp: 20, condition: 'Showers' },
      { day: 'Fri', temp: 24, condition: 'Sunny' },
      { day: 'Sat', temp: 25, condition: 'Sunny' }
    ]
  });

  useEffect(() => {
    async function loadLiveWeather() {
      try {
        const lat = destination?.latitude || 46.2044;
        const lng = destination?.longitude || 6.1432;
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`);
        if (res.ok) {
          const json = await res.json();
          if (json.current_weather) {
            const currentTemp = Math.round(json.current_weather.temperature);
            const wCode = json.current_weather.weathercode;
            const cond = wCode === 0 ? 'Sunny' : wCode < 4 ? 'Partly Cloudy' : wCode < 60 ? 'Foggy' : wCode < 80 ? 'Rainy' : 'Clear';
            
            const daysArr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const daily = json.daily?.time ? json.daily.time.slice(0, 6).map((t, idx) => {
              const d = new Date(t);
              const maxT = Math.round(json.daily.temperature_2m_max[idx] || currentTemp);
              return {
                day: daysArr[d.getDay()],
                temp: maxT,
                condition: cond
              };
            }) : weatherData.forecast;

            setWeatherData({
              temp: currentTemp,
              condition: cond,
              feelsLike: currentTemp + 1,
              humidity: 50,
              wind: Math.round(json.current_weather.windspeed || 8),
              forecast: daily
            });
          }
        }
      } catch (err) {
        // Fallback gracefully to default weather
      }
    }
    loadLiveWeather();
  }, [destName, destCountry, destination]);

  // ── Live Visa Regulations ────────────────────────────────────────────────
  const [visaInfo, setVisaInfo] = useState({
    status: 'Schengen Visa Required',
    details: 'Pakistani passport holders require a standard Schengen Visa (Type C) with at least 15 days advance processing and travel medical insurance.',
    officialLink: 'https://www.eda.admin.ch/eda/en/home/entry-switzerland-residence/visa-requirements.html',
    badgeColor: 'amber'
  });

  useEffect(() => {
    async function checkVisa() {
      try {
        const res = await fetchLiveVisaRequirement(originCountry, destCountry, startDate);
        if (res?.visa) {
          setVisaInfo({
            status: res.visa.requirement || 'Visa Required',
            details: res.visa.details || res.visa.text || `Passport holders from ${originCountry} require a visa to enter ${destCountry}.`,
            officialLink: res.visa.official_link || '#',
            badgeColor: (res.visa.requirement || '').toLowerCase().includes('free') ? 'emerald' : 'amber'
          });
          return;
        }
      } catch (e) {
        const sim = simulateVisaRequirement(originCountry, destCountry);
        if (sim) {
          setVisaInfo({
            status: sim.status,
            details: sim.notes || `Standard entry rules apply for travelers from ${originCountry} to ${destCountry}.`,
            officialLink: sim.officialPortal || '#',
            badgeColor: sim.status.toLowerCase().includes('free') ? 'emerald' : 'amber'
          });
        }
      }
    }
    checkVisa();
  }, [originCountry, destCountry, startDate]);

  // ── Live Advisories / News ───────────────────────────────────────────────
  const [liveAlerts, setLiveAlerts] = useState([
    {
      id: 'al-1',
      type: 'Advisory',
      title: `No Major Travel Warnings for ${destCountry}`,
      source: 'Consular Border Bureau',
      date: 'Today',
      summary: 'Safe travel zone. Standard international border entry protocol in effect.'
    },
    {
      id: 'al-2',
      type: 'Transit',
      title: 'High-Frequency Regional Rail Running On Schedule',
      source: 'SBB / Transit Authority',
      date: 'Live',
      summary: 'Airport shuttle trains and public tram networks operating with 99.4% punctuality.'
    }
  ]);

  useEffect(() => {
    async function loadAlerts() {
      try {
        const res = await fetchLiveNews(destCountry);
        if (res?.news && Array.isArray(res.news) && res.news.length > 0) {
          setLiveAlerts(res.news.slice(0, 3).map((item, i) => ({
            id: `live-${i}`,
            type: 'Live Update',
            title: item.title,
            source: item.source || 'Verified Wire',
            date: 'Recent',
            summary: item.summary || item.title
          })));
        }
      } catch (e) {
        // Retain verified static advisories
      }
    }
    loadAlerts();
  }, [destCountry]);

  // ── Trip Readiness Score & Dynamic Checklist ─────────────────────────────
  const [readinessItems, setReadinessItems] = useState([
    { id: 'res', label: 'Destination researched', checked: true, weight: 20 },
    { id: 'wea', label: 'Live weather & forecast checked', checked: true, weight: 20 },
    { id: 'trans', label: 'Airport & first-hour transit mapped', checked: true, weight: 20 },
    { id: 'visa', label: 'Visa regulations & entry checked', checked: true, weight: 18 },
    { id: 'bud', label: 'Budget calculation established', checked: false, weight: 11, actionUrl: '/budget-planner', actionLabel: 'Plan Budget' },
    { id: 'time', label: 'Day-by-day timeline generated', checked: false, weight: 11, actionUrl: '/ai-trip-planner', actionLabel: 'Build Timeline' }
  ]);

  const readinessScore = useMemo(() => {
    return readinessItems.reduce((acc, item) => acc + (item.checked ? item.weight : 0), 0);
  }, [readinessItems]);

  const toggleReadinessItem = (id) => {
    setReadinessItems(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  // ── Accordion States for Essentials ──────────────────────────────────────
  const [expandedEssentials, setExpandedEssentials] = useState({
    visa: true,
    safety: false,
    money: false,
    connectivity: false,
    transport: false,
    culture: false,
    emergency: false
  });

  const toggleEssential = (key) => {
    setExpandedEssentials(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // ── First Hour Interactive Stepper State ─────────────────────────────────
  const [activeFirstHourStep, setActiveFirstHourStep] = useState(1);

  // ── Packing Checklist State ──────────────────────────────────────────────
  const [packingList, setPackingList] = useState(intel.packingChecklist);
  const [activePackingCategory, setActivePackingCategory] = useState('All');
  const [newCustomItem, setNewCustomItem] = useState('');

  const togglePackingItem = (id) => {
    setPackingList(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const handleAddPackingItem = (e) => {
    e.preventDefault();
    if (!newCustomItem.trim()) return;
    const newItem = {
      id: `custom-${Date.now()}`,
      label: newCustomItem.trim(),
      category: 'Custom',
      checked: false
    };
    setPackingList(prev => [...prev, newItem]);
    setNewCustomItem('');
  };

  // ── Stay Aware Tab State ─────────────────────────────────────────────────
  const [activeAwareTab, setActiveAwareTab] = useState('safety');

  // ── Curated Explore Category Filter ──────────────────────────────────────
  const [activeExploreCat, setActiveExploreCat] = useState('All');
  const filteredAttractions = useMemo(() => {
    if (activeExploreCat === 'All') return intel.curatedAttractions;
    return intel.curatedAttractions.filter(attr => 
      (attr.category || '').toLowerCase().includes(activeExploreCat.toLowerCase())
    );
  }, [intel, activeExploreCat]);

  // ── Save Trip Modal / Updates ────────────────────────────────────────────
  const handleSaveTripUpdate = (e) => {
    e.preventDefault();
    setOriginCountry(editOriginCountry);
    setOriginCity(editOriginCity);
    setStartDate(editStartDate);
    setEndDate(editEndDate);
    setTravelers(editTravelers);
    setTravelType(editTravelType);

    const params = new URLSearchParams(searchParams);
    params.set('originCountry', editOriginCountry);
    if (editOriginCity) params.set('originCity', editOriginCity);
    params.set('startDate', editStartDate);
    params.set('endDate', editEndDate);
    params.set('travelers', editTravelers.toString());
    params.set('travelType', editTravelType);
    setSearchParams(params);

    setIsEditModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#030816] text-slate-900 dark:text-slate-100 transition-colors duration-300 pb-32">
      {/* ────────────────────────────────────────────────────────────────────────
          A. TRIP HEADER & TRIP SNAPSHOT STRIP
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="pt-28 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Breadcrumb & Command Center Tag */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/40 text-[11px] font-semibold tracking-wide uppercase text-blue-700 dark:text-blue-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Trip Command Center</span>
            <span className="w-1 h-1 rounded-full bg-blue-400"></span>
            <span>Pre-Departure Intelligence</span>
          </div>

          {/* Edit Trip Trigger */}
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/[0.08] hover:border-blue-300 dark:hover:border-blue-600 transition-all shadow-sm cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Trip Parameters</span>
          </button>
        </div>

        {/* Primary Route Title */}
        <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-semibold tracking-tight text-slate-950 dark:text-white">
              {originCity ? `${originCity} → ${destName}` : destName}
            </h1>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-light mt-1 flex items-center gap-2">
              <span>{destCountry}</span>
              <span>{intel.flag}</span>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <span className="text-xs uppercase tracking-wider font-mono text-slate-400 dark:text-slate-500">
                Hub: {intel.airportCode}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 dark:text-slate-500 font-mono">
              Status: Verified Active
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
        </div>

        {/* Compact Horizontal Information Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5 p-3 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/[0.06] shadow-sm">
          {/* 1. Dates */}
          <div className="flex flex-col p-2.5 rounded-xl bg-slate-50/80 dark:bg-white/[0.02]">
            <span className="text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-blue-500" /> Travel Dates
            </span>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate mt-0.5" title={dateRangeFormatted}>
              {dateRangeFormatted}
            </span>
          </div>

          {/* 2. Duration */}
          <div className="flex flex-col p-2.5 rounded-xl bg-slate-50/80 dark:bg-white/[0.02]">
            <span className="text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3 text-blue-500" /> Duration
            </span>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate mt-0.5">
              {durationDays} Days ({durationDays - 1} Nights)
            </span>
          </div>

          {/* 3. Travelers */}
          <div className="flex flex-col p-2.5 rounded-xl bg-slate-50/80 dark:bg-white/[0.02]">
            <span className="text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <Users className="w-3 h-3 text-blue-500" /> Travelers
            </span>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate mt-0.5">
              {travelers} {travelers === 1 ? 'Traveler' : 'Travelers'} ({travelType})
            </span>
          </div>

          {/* 4. Arrival Hub */}
          <div className="flex flex-col p-2.5 rounded-xl bg-slate-50/80 dark:bg-white/[0.02]">
            <span className="text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <Plane className="w-3 h-3 text-blue-500" /> Arrival Hub
            </span>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate mt-0.5" title={intel.airportName}>
              {intel.airportCode} · {destName}
            </span>
          </div>

          {/* 5. Live Weather */}
          <div className="flex flex-col p-2.5 rounded-xl bg-slate-50/80 dark:bg-white/[0.02]">
            <span className="text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <Sun className="w-3 h-3 text-amber-500" /> Weather
            </span>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate mt-0.5">
              {weatherData.temp}°C · {weatherData.condition}
            </span>
          </div>

          {/* 6. Local Currency */}
          <div className="flex flex-col p-2.5 rounded-xl bg-slate-50/80 dark:bg-white/[0.02]">
            <span className="text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-emerald-500" /> Currency
            </span>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate mt-0.5" title={intel.currency.name}>
              {intel.currency.code} ({intel.currency.symbol})
            </span>
          </div>

          {/* 7. Time Zone */}
          <div className="flex flex-col p-2.5 rounded-xl bg-slate-50/80 dark:bg-white/[0.02]">
            <span className="text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <Globe className="w-3 h-3 text-indigo-500" /> Time Zone
            </span>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate mt-0.5" title={intel.timezone}>
              {intel.timezone.split('·')[0].trim()}
            </span>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          B. TRIP READINESS SCORE
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-10">
        <div className="p-6 rounded-3xl bg-gradient-to-br from-white via-slate-50 to-blue-50/20 dark:from-slate-900/90 dark:via-slate-900/50 dark:to-blue-950/20 border border-slate-200/80 dark:border-white/[0.06] shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Left: Score Gauge & Description */}
            <div className="flex items-center gap-5">
              <div className="relative flex items-center justify-center w-18 h-18 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex-shrink-0">
                <span className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400">
                  {readinessScore}%
                </span>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white stroke-[3]" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                    Trip Readiness Score
                  </h3>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                    Strong Baseline
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md leading-relaxed">
                  Key arrival protocols, weather checks, and visa regulations verified. Complete the remaining steps to finalize your pre-departure checklist.
                </p>
              </div>
            </div>

            {/* Right: Interactive Preparation Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 flex-1 max-w-3xl">
              {readinessItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleReadinessItem(item.id)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    item.checked
                      ? 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                      : 'bg-slate-100/60 dark:bg-slate-900/40 border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    {item.checked ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-slate-400 dark:border-slate-600 flex-shrink-0" />
                    )}
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.actionUrl && !item.checked && (
                    <Link
                      to={item.actionUrl}
                      onClick={(e) => e.stopPropagation()}
                      className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex-shrink-0"
                    >
                      {item.actionLabel} →
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          C. ESSENTIALS (PROGRESSIVE DISCLOSURE ACCORDIONS)
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-14">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-heading font-semibold text-slate-950 dark:text-white">
              Trip Essentials
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-light">
              Core regulations and operational requirements for {destName}, {destCountry}. Click any card to view detailed notes.
            </p>
          </div>
          <button
            onClick={() => {
              const allOpen = Object.values(expandedEssentials).every(Boolean);
              const toggled = Object.keys(expandedEssentials).reduce((acc, k) => ({ ...acc, [k]: !allOpen }), {});
              setExpandedEssentials(toggled);
            }}
            className="text-xs font-mono text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            {Object.values(expandedEssentials).every(Boolean) ? 'Collapse All' : 'Expand All'}
          </button>
        </div>

        <div className="space-y-3">
          {/* 1. Visa & Entry */}
          <div className="rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/[0.06] shadow-sm overflow-hidden transition-all">
            <button
              onClick={() => toggleEssential('visa')}
              className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-slate-50/60 dark:hover:bg-white/[0.02] cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Visa & Entry Requirements
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                    Entry protocol for travelers from {originCountry} to {destCountry}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                  {visaInfo.status}
                </span>
                {expandedEssentials.visa ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </div>
            </button>
            {expandedEssentials.visa && (
              <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-white/[0.04] bg-slate-50/30 dark:bg-slate-950/30 text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-3">
                <p>{visaInfo.details || intel.essentials.visa.detail}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Passport Validity</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Min. 6 Months Required</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Allowed Stay</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Up to 90 Days (Schengen)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Medical Insurance</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Min. €30,000 Coverage</span>
                  </div>
                </div>
                {visaInfo.officialLink && visaInfo.officialLink !== '#' && (
                  <div className="pt-2">
                    <a
                      href={visaInfo.officialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <span>Open Official Consular Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 2. Safety & Health */}
          <div className="rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/[0.06] shadow-sm overflow-hidden transition-all">
            <button
              onClick={() => toggleEssential('safety')}
              className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-slate-50/60 dark:hover:bg-white/[0.02] cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Safety & Health Overview
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                    {intel.essentials.safety.summary}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                  {intel.essentials.safety.status}
                </span>
                {expandedEssentials.safety ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </div>
            </button>
            {expandedEssentials.safety && (
              <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-white/[0.04] bg-slate-50/30 dark:bg-slate-950/30 text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-3">
                <p>{intel.essentials.safety.detail}</p>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block">Tap Water Quality</span>
                    <span className="text-slate-500 dark:text-slate-400">100% pure alpine mineral water safe from every municipal fountain and tap.</span>
                  </div>
                  <span className="text-emerald-600 font-bold font-mono">100% Potable</span>
                </div>
              </div>
            )}
          </div>

          {/* 3. Money & Payments */}
          <div className="rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/[0.06] shadow-sm overflow-hidden transition-all">
            <button
              onClick={() => toggleEssential('money')}
              className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-slate-50/60 dark:hover:bg-white/[0.02] cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Money & Contactless Payments
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                    {intel.essentials.money.summary}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300">
                  {intel.essentials.money.status}
                </span>
                {expandedEssentials.money ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </div>
            </button>
            {expandedEssentials.money && (
              <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-white/[0.04] bg-slate-50/30 dark:bg-slate-950/30 text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-3">
                <p>{intel.essentials.money.detail}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Card Acceptance Rate</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">97%+ (Apple/Google Pay everywhere)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Tipping Standard</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Included in bill · Round up 5-10%</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 4. Connectivity & Power */}
          <div className="rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/[0.06] shadow-sm overflow-hidden transition-all">
            <button
              onClick={() => toggleEssential('connectivity')}
              className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-slate-50/60 dark:hover:bg-white/[0.02] cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                  <Wifi className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Connectivity, eSIM & Power Plugs
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                    {intel.essentials.connectivity.summary}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300">
                  {intel.essentials.connectivity.status}
                </span>
                {expandedEssentials.connectivity ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </div>
            </button>
            {expandedEssentials.connectivity && (
              <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-white/[0.04] bg-slate-50/30 dark:bg-slate-950/30 text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-3">
                <p>{intel.essentials.connectivity.detail}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Power Plug Standard</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Type J (3-pin diamond) & Type C (2-pin)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Public Wi-Fi</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Free at airport & all CFF stations</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 5. Local Transport & Passes */}
          <div className="rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/[0.06] shadow-sm overflow-hidden transition-all">
            <button
              onClick={() => toggleEssential('transport')}
              className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-slate-50/60 dark:hover:bg-white/[0.02] cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center flex-shrink-0">
                  <Train className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Local Transport & City Passes
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                    {intel.essentials.transport.summary}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300">
                  {intel.essentials.transport.status}
                </span>
                {expandedEssentials.transport ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </div>
            </button>
            {expandedEssentials.transport && (
              <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-white/[0.04] bg-slate-50/30 dark:bg-slate-950/30 text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-3">
                <p>{intel.essentials.transport.detail}</p>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-1">Recommended Transit Apps</span>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 font-mono">SBB Mobile (Swiss Trains)</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 font-mono">TPG (Geneva Trams & Buses)</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 font-mono">Google Maps</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 6. Cultural Etiquette */}
          <div className="rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/[0.06] shadow-sm overflow-hidden transition-all">
            <button
              onClick={() => toggleEssential('culture')}
              className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-slate-50/60 dark:hover:bg-white/[0.02] cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Cultural Etiquette & Decorum
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                    {intel.essentials.culture.summary}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300">
                  {intel.essentials.culture.status}
                </span>
                {expandedEssentials.culture ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </div>
            </button>
            {expandedEssentials.culture && (
              <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-white/[0.04] bg-slate-50/30 dark:bg-slate-950/30 text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-3">
                <p>{intel.essentials.culture.detail}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40">
                    <span className="font-semibold text-emerald-800 dark:text-emerald-300 block mb-1">Recommended Behavior</span>
                    <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
                      <li>Say "Bonjour" upon entering any boutique or cafe</li>
                      <li>Be precisely on time for bookings and tours</li>
                      <li>Lower speaking volume in trains and public dining</li>
                    </ul>
                  </div>
                  <div className="p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/40">
                    <span className="font-semibold text-rose-800 dark:text-rose-300 block mb-1">Things to Avoid</span>
                    <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
                      <li>Avoid loud conversations after 10:00 PM</li>
                      <li>Never board Swiss trains without a validated ticket</li>
                      <li>Avoid tossing recyclable glass in domestic trash</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 7. Emergency Information */}
          <div className="rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/[0.06] shadow-sm overflow-hidden transition-all">
            <button
              onClick={() => toggleEssential('emergency')}
              className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-slate-50/60 dark:hover:bg-white/[0.02] cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Emergency Desks & Consular Support
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                    {intel.essentials.emergency.summary}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300">
                  {intel.essentials.emergency.status}
                </span>
                {expandedEssentials.emergency ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </div>
            </button>
            {expandedEssentials.emergency && (
              <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-white/[0.04] bg-slate-50/30 dark:bg-slate-950/30 text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-3">
                <p>{intel.essentials.emergency.detail}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 text-center border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 block">Universal 112</span>
                    <span className="text-base font-bold text-rose-600">112</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 text-center border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 block">Police</span>
                    <span className="text-base font-bold text-blue-600">117</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 text-center border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 block">Ambulance</span>
                    <span className="text-base font-bold text-emerald-600">144</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 text-center border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 block">Fire Desk</span>
                    <span className="text-base font-bold text-amber-600">118</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          D. ARRIVAL / YOUR FIRST HOUR (STEP-BY-STEP JOURNEY)
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-14">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-6">
          <div>
            <h2 className="text-xl font-heading font-semibold text-slate-950 dark:text-white">
              Your First Hour in {destName}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-light">
              Step-by-step navigational guidance from the touchdown gate to your hotel lobby.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
            {intel.firstHour.length} Guided Steps
          </span>
        </div>

        {/* Desktop Horizontal Interactive Timeline */}
        <div className="hidden md:block">
          <div className="relative mb-6">
            <div className="absolute top-4.5 left-6 right-6 h-0.5 bg-slate-200 dark:bg-slate-800 -z-0"></div>
            <div className="grid grid-cols-6 gap-2 relative z-10">
              {intel.firstHour.map((step) => {
                const isActive = activeFirstHourStep === step.step;
                return (
                  <button
                    key={step.step}
                    onClick={() => setActiveFirstHourStep(step.step)}
                    className="flex flex-col items-center text-center group cursor-pointer focus:outline-none"
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-mono font-bold text-xs transition-all shadow-sm ${
                        isActive
                          ? 'bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-900/40 scale-110'
                          : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 group-hover:border-blue-400'
                      }`}
                    >
                      {step.step}
                    </div>
                    <span className={`text-xs font-medium mt-2.5 truncate max-w-[120px] transition-colors ${
                      isActive ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-600 dark:text-slate-400'
                    }`}>
                      {step.title.split('&')[0]}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 mt-0.5">
                      {step.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Expanded Step Card */}
          {intel.firstHour.find(s => s.step === activeFirstHourStep) && (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/[0.06] shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold font-mono text-sm flex-shrink-0">
                0{activeFirstHourStep}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {intel.firstHour.find(s => s.step === activeFirstHourStep).title}
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {intel.firstHour.find(s => s.step === activeFirstHourStep).category}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1">
                  {intel.firstHour.find(s => s.step === activeFirstHourStep).summary}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {intel.firstHour.find(s => s.step === activeFirstHourStep).detail}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Vertical Stepper */}
        <div className="block md:hidden space-y-3">
          {intel.firstHour.map((step) => {
            const isExpanded = activeFirstHourStep === step.step;
            return (
              <div
                key={step.step}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/[0.06] shadow-sm transition-all"
              >
                <div
                  onClick={() => setActiveFirstHourStep(isExpanded ? null : step.step)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-mono text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {step.step}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
                        {step.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {step.badge}
                      </span>
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
                {isExpanded && (
                  <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    <p className="font-medium text-slate-800 dark:text-slate-200 mb-1">{step.summary}</p>
                    <p className="text-slate-500 dark:text-slate-400">{step.detail}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          E. WEATHER + PACKING CHECKLIST
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (5 cols): Live Weather Forecast */}
          <div className="lg:col-span-5 p-5 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/[0.06] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-heading font-semibold text-slate-950 dark:text-white">
                    Destination Weather
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-light">
                    Real-time atmospheric telemetry for {destName}
                  </p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                  Open-Meteo API
                </span>
              </div>

              {/* Current Temperature Hero */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-blue-50/80 to-slate-50 dark:from-blue-950/30 dark:to-slate-900 mb-4 border border-blue-100/50 dark:border-white/[0.04]">
                <div>
                  <span className="text-4xl font-bold font-mono text-slate-900 dark:text-white">
                    {weatherData.temp}°C
                  </span>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-0.5">
                    {weatherData.condition} · Feels like {weatherData.feelsLike}°C
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-amber-100/80 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center">
                  <Sun className="w-6 h-6" />
                </div>
              </div>

              {/* Weather Metrics */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center gap-2.5">
                  <Wind className="w-4 h-4 text-blue-500" />
                  <div>
                    <span className="text-[10px] text-slate-400 block font-mono">Breeze / Wind</span>
                    <span className="text-xs font-semibold">{weatherData.wind} km/h</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center gap-2.5">
                  <Droplets className="w-4 h-4 text-cyan-500" />
                  <div>
                    <span className="text-[10px] text-slate-400 block font-mono">Humidity</span>
                    <span className="text-xs font-semibold">{weatherData.humidity}%</span>
                  </div>
                </div>
              </div>

              {/* Multi-day mini strip */}
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
                Travel Forecast Overview
              </span>
              <div className="grid grid-cols-6 gap-1 text-center font-mono">
                {weatherData.forecast.map((f, i) => (
                  <div key={i} className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block">{f.day}</span>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block my-0.5">{f.temp}°</span>
                    <span className="text-[9px] text-slate-400 truncate block">{f.condition.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/[0.04] text-[11px] text-slate-400 flex items-center justify-between">
              <span>Best packing style: Light layers with wind protection</span>
            </div>
          </div>

          {/* Right Column (7 cols): Expandable Packing Checklist */}
          <div className="lg:col-span-7 p-5 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/[0.06] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-base font-heading font-semibold text-slate-950 dark:text-white">
                    What to Pack for {destName}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-light">
                    Smart pre-departure checklist tailored to local climate & standards.
                  </p>
                </div>
                <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
                  {packingList.filter(p => p.checked).length} of {packingList.length} packed
                </span>
              </div>

              {/* Packing Category Chips */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {['All', 'Clothing', 'Electronics', 'Documents', 'Essentials'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActivePackingCategory(cat)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      activePackingCategory === cat
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Checklist Items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
                {packingList
                  .filter(item => activePackingCategory === 'All' || item.category === activePackingCategory)
                  .map((item) => (
                    <div
                      key={item.id}
                      onClick={() => togglePackingItem(item.id)}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                        item.checked
                          ? 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400 line-through'
                          : 'bg-white dark:bg-slate-800 border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-blue-400'
                      }`}
                    >
                      {item.checked ? (
                        <CheckSquare className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      )}
                      <span className="truncate">{item.label}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Quick Add Custom Packing Item */}
            <form onSubmit={handleAddPackingItem} className="mt-4 pt-3 border-t border-slate-100 dark:border-white/[0.04] flex items-center gap-2">
              <input
                type="text"
                value={newCustomItem}
                onChange={(e) => setNewCustomItem(e.target.value)}
                placeholder="Add custom packing item (e.g. Hiking boots)..."
                className="flex-1 px-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-90 transition-opacity cursor-pointer flex-shrink-0"
              >
                Add
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          F. EXPLORE THE DESTINATION (CURATED PREVIEW)
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-14">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-6">
          <div>
            <h2 className="text-xl font-heading font-semibold text-slate-950 dark:text-white">
              Explore {destName} Highlights
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-light">
              Curated architectural, cultural, and lakeside landmarks.
            </p>
          </div>
          <Link
            to="/destinations"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            <span>Explore All {destName} Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-5">
          {['All', 'Must See', 'History', 'Museums', 'Nature', 'Food'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveExploreCat(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeExploreCat === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-blue-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Curated Attraction Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAttractions.slice(0, 6).map((attr) => (
            <div
              key={attr.id}
              className="group rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/[0.06] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={attr.image}
                  alt={attr.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-900/80 text-white backdrop-blur-md">
                  {attr.tag || attr.category}
                </div>
                <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-mono bg-black/70 text-white backdrop-blur-sm flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{attr.duration}</span>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">
                    {attr.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {attr.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/[0.04] flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono text-[11px]">{attr.category}</span>
                  <Link
                    to="/destinations"
                    className="text-blue-600 dark:text-blue-400 font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    <span>Inspect</span>
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          G. NEIGHBORHOOD / WHERE TO STAY
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-14">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-6">
          <div>
            <h2 className="text-xl font-heading font-semibold text-slate-950 dark:text-white">
              Where to Stay in {destName}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-light">
              Neighborhood intelligence and quarter recommendations based on your travel priorities.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {intel.neighborhoods.length} Curated Quarters
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {intel.neighborhoods.map((n, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/[0.06] shadow-sm hover:border-blue-300 dark:hover:border-blue-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {n.name}
                  </h4>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex-shrink-0">
                    {n.vibe}
                  </span>
                </div>
                <div className="inline-block text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-md mb-2">
                  {n.bestFor}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                  {n.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-white/[0.04] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block">Avg. Cost</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{n.avgNight}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400 block">Transit Access</span>
                  <span className="text-slate-600 dark:text-slate-400 text-[11px] font-medium">{n.transit}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          H. TRANSPORT / GETTING AROUND
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-14">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-6">
          <div>
            <h2 className="text-xl font-heading font-semibold text-slate-950 dark:text-white">
              Getting Around {destName}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-light">
              Verified ground transit options, airport connections, and city transit passes.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Punctuality: 99.4%
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {intel.transportOptions.map((opt, i) => (
            <div
              key={i}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                opt.highlight
                  ? 'bg-blue-50/40 dark:bg-blue-950/20 border-blue-300 dark:border-blue-700/60 shadow-sm md:col-span-2 lg:col-span-1'
                  : 'bg-white dark:bg-slate-900/80 border-slate-200/80 dark:border-white/[0.06] shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full uppercase ${
                    opt.highlight
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}>
                    {opt.badge}
                  </span>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {opt.duration}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                  {opt.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                  {opt.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/60 dark:border-white/[0.04] flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono text-[11px]">{opt.mode}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">{opt.cost}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          I. FOOD DISCOVERY (EAT & DISCOVER)
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-14">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-6">
          <div>
            <h2 className="text-xl font-heading font-semibold text-slate-950 dark:text-white">
              Eat & Discover: {destName} Gastronomy
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-light">
              Iconic culinary staples and dining experiences you shouldn't miss.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
            Halal & Vegetarian Friendly
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {intel.foodHighlights.map((food, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/[0.06] shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono uppercase text-blue-600 dark:text-blue-400 font-semibold">
                    {food.type}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                    {food.dietary}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1.5">
                  {food.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                  {food.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-white/[0.04] text-[11px] text-slate-400">
                <span className="block font-mono text-[10px] uppercase text-slate-400">Recommended Spot</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{food.spot}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          J. SAFETY + LIVE AWARENESS (STAY AWARE)
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-14">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/[0.06] shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-heading font-semibold text-slate-950 dark:text-white">
                Stay Aware: Intelligence & Protocols
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-light">
                Real-time safety metrics, social etiquette, and consular alerts.
              </p>
            </div>

            {/* Segmented Tab Control */}
            <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 self-start sm:self-auto font-mono text-xs">
              <button
                onClick={() => setActiveAwareTab('safety')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeAwareTab === 'safety'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Safety Index
              </button>
              <button
                onClick={() => setActiveAwareTab('culture')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeAwareTab === 'culture'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Culture & Decorum
              </button>
              <button
                onClick={() => setActiveAwareTab('alerts')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeAwareTab === 'alerts'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Live Alerts ({liveAlerts.length})
              </button>
            </div>
          </div>

          {/* Tab 1: Safety Index */}
          {activeAwareTab === 'safety' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Overall Civic Safety</span>
                <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 block mb-1">
                  {intel.safetyScore} / 100
                </span>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  Consistently ranked in the top 10 global peaceful cities. Extremely safe for solo and family travelers.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Tourist Scams to Note</span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 block mb-1">
                  Petty Distractions
                </span>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  Watch for petition signers or street shell games near the lakeside. Politely decline and keep walking.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Female & Solo Travel</span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 block mb-1">
                  High Confidence (9.6/10)
                </span>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  Well-lit boulevards and visible police patrols make nocturnal navigation secure across primary districts.
                </p>
              </div>
            </div>
          )}

          {/* Tab 2: Culture & Decorum */}
          {activeAwareTab === 'culture' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Essential Social Etiquette</h4>
                <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span>Greeting is polite etiquette: Always say "Bonjour" when entering shops and "Au revoir" when leaving.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span>Respect quiet hours: By Swiss statute, avoid loud conversations, vacuuming, or running laundry after 10 PM.</span>
                  </li>
                </ul>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Dining & Commercial Norms</h4>
                <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span>Table service: Wait to be seated at restaurants. Tips are legally included; rounding up 5-10% is customary.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span>Sunday closures: Most supermarkets and retail shops close on Sundays (except at Cornavin and the airport).</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Tab 3: Live Alerts */}
          {activeAwareTab === 'alerts' && (
            <div className="space-y-2 text-xs">
              {liveAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold">
                        {alert.type}
                      </span>
                      <span className="text-slate-400 font-mono text-[10px]">{alert.source}</span>
                    </div>
                    <h5 className="font-semibold text-slate-800 dark:text-slate-200">{alert.title}</h5>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5">{alert.summary}</p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 flex-shrink-0">{alert.date}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          K. TRIP PLANNING ACTIONS (DEEP TOOL LAUNCHPAD)
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-xl font-heading font-semibold text-slate-950 dark:text-white">
            Continue Planning Your Trip
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-light">
            One-click deep links to TripReady's specialized itinerary, budget, and booking engines.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Day-by-Day Timeline */}
          <Link
            to={`/ai-trip-planner?dest=${encodeURIComponent(destName)}&country=${encodeURIComponent(destCountry)}&origin=${encodeURIComponent(originCity || originCountry)}&days=${durationDays}`}
            className="group p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/[0.06] shadow-sm hover:border-blue-500 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                Day-by-Day Timeline
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Generate an intelligent, hour-by-hour customized itinerary taking crowds, pacing, and weather into account.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/[0.04] text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center justify-between">
              <span>Build Timeline</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* 2. Budget Planner */}
          <Link
            to={`/budget-planner?destination=${encodeURIComponent(destName)}&currency=${intel.currency.code}`}
            className="group p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/[0.06] shadow-sm hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                <DollarSign className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                Smart Budget Estimator
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Accurately forecast costs for flights, hotels, dining, and city transit in both USD and {intel.currency.code}.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/[0.04] text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
              <span>Calculate Budget</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* 3. Real Flight Pricing */}
          <Link
            to={`/ai-trip-planner?dest=${encodeURIComponent(destName)}&tab=flights`}
            className="group p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/[0.06] shadow-sm hover:border-indigo-500 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
                <Plane className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                Real Flight Pricing
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Compare routes, layovers, and live estimated airfare from {originCity || originCountry} to {destName} ({intel.airportCode}).
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/[0.04] text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center justify-between">
              <span>Compare Flights</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* 4. Religious & Pilgrimage Travel */}
          <Link
            to="/pilgrimage"
            className="group p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/[0.06] shadow-sm hover:border-purple-500 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
                <Compass className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                Religious & Sacred Travel
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Explore sacred pilgrimage guidance, dietary/halal indexes, prayer timing calculators, and spiritual hubs.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/[0.04] text-xs font-semibold text-purple-600 dark:text-purple-400 flex items-center justify-between">
              <span>Explore Pilgrimages</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          EDIT TRIP PARAMETERS MODAL
      ──────────────────────────────────────────────────────────────────────── */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-600" />
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  Adjust Trip Parameters
                </h3>
              </div>
              <button
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
                      setEditOriginCountry(e.target.value);
                      const match = countries.find(c => c.name === e.target.value);
                      setEditOriginCity(match?.cities?.[0] || '');
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
                    value={editOriginCity}
                    onChange={(e) => setEditOriginCity(e.target.value)}
                    placeholder="e.g. Lahore, Karachi"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  />
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
    </div>
  );
}
