import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Shield, MapPin, Bell, Mic, Plane, Calendar, ChevronRight, Wifi, Battery, Home, Compass, Briefcase, Settings } from 'lucide-react';
import { countries, travelTypes, budgetPreferences, topDestinations } from '../../data';
import { useTheme } from '../../hooks/useTheme';
import { supabase } from '../../utils/supabaseClient';

// ── Searchable Dropdown ─────────────────────────────────────────────────────
function SearchableDropdown({ label, value, onChange, options, placeholder, disabled }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const filtered = options.filter((opt) =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (opt) => {
    onChange(opt);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div className="relative flex-1" ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
            setTimeout(() => inputRef.current?.focus(), 100);
          }
        }}
        className="w-full text-left px-5 py-3 hover:bg-slate-100/50 dark:hover:bg-white/[0.03] transition-colors duration-200 rounded-2xl md:rounded-none"
      >
        <span className="block text-[10px] font-bold text-luxury-secondary dark:text-slate-400 uppercase tracking-widest mb-0.5">
          {label}
        </span>
        <span className={`block text-sm truncate ${value ? 'text-luxury-primary dark:text-white font-medium' : 'text-slate-400'}`}>
          {value || placeholder}
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-2 rounded-2xl bg-white dark:bg-dark-300 border border-luxury-border dark:border-white/[0.08] shadow-premium p-2 animate-slide-down">
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-white/[0.04] rounded-xl mb-1">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Type to search..."
              className="w-full bg-transparent text-sm text-luxury-primary dark:text-white placeholder-slate-400 outline-none"
            />
          </div>
          <ul className="max-h-48 overflow-y-auto py-1 no-scrollbar">
            {filtered.length > 0 ? (
              filtered.map((opt) => (
                <li key={opt}>
                  <button
                    type="button"
                    onClick={() => handleSelect(opt)}
                    className={`w-full text-left px-4 py-2 rounded-lg text-xs transition-colors ${
                      opt === value
                        ? 'bg-slate-100 dark:bg-white/[0.08] text-luxury-primary dark:text-white font-bold'
                        : 'text-luxury-secondary dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-white/[0.04]'
                    }`}
                  >
                    {opt}
                  </button>
                </li>
              ))
            ) : (
              <li className="px-4 py-3 text-xs text-slate-400 text-center">No results</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

// ── Country Dropdown ────────────────────────────────────────────────────────
function CountryDropdown({ label, value, onChange, placeholder, countriesList }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const activeCountries = countriesList && countriesList.length > 0 ? countriesList : countries;

  const filtered = activeCountries.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedCountry = activeCountries.find((c) => c.name === value);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (c) => {
    onChange(c.name);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div className="relative flex-1" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setTimeout(() => inputRef.current?.focus(), 100);
        }}
        className="w-full text-left px-5 py-3 hover:bg-slate-100/50 dark:hover:bg-white/[0.03] transition-colors duration-200 rounded-2xl md:rounded-none"
      >
        <span className="block text-[10px] font-bold text-luxury-secondary dark:text-slate-400 uppercase tracking-widest mb-0.5">
          {label}
        </span>
        <span className={`block text-sm truncate ${value ? 'text-luxury-primary dark:text-white font-medium' : 'text-slate-400'}`}>
          {selectedCountry ? `${selectedCountry.flag || '🌍'} ${selectedCountry.name}` : placeholder}
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-2 rounded-2xl bg-white dark:bg-dark-300 border border-luxury-border dark:border-white/[0.08] shadow-premium p-2 animate-slide-down">
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-white/[0.04] rounded-xl mb-1">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search countries..."
              className="w-full bg-transparent text-sm text-luxury-primary dark:text-white placeholder-slate-400 outline-none"
            />
          </div>
          <ul className="max-h-48 overflow-y-auto py-1 no-scrollbar">
            {filtered.length > 0 ? (
              filtered.map((c) => (
                <li key={c.code || c.name}>
                  <button
                    type="button"
                    onClick={() => handleSelect(c)}
                    className={`w-full text-left px-4 py-2 rounded-lg text-xs flex items-center gap-2 transition-colors ${
                      c.name === value
                        ? 'bg-slate-100 dark:bg-white/[0.08] text-luxury-primary dark:text-white font-bold'
                        : 'text-luxury-secondary dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-white/[0.04]'
                    }`}
                  >
                    <span>{c.flag || '🌍'}</span>
                    <span>{c.name}</span>
                  </button>
                </li>
              ))
            ) : (
              <li className="px-4 py-3 text-xs text-slate-400 text-center">No countries</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

// Stable constants to prevent Cobe Globe WebGL context recreation on re-render
const GLOBE_MARKERS = [
  { id: "sf", location: [37.7595, -122.4367], label: "San Francisco" },
  { id: "nyc", location: [40.7128, -74.006], label: "New York" },
  { id: "tokyo", location: [35.6762, 139.6503], label: "Tokyo" },
  { id: "london", location: [51.5074, -0.1278], label: "London" },
  { id: "sydney", location: [-33.8688, 151.2093], label: "Sydney" },
  { id: "dubai", location: [25.2048, 55.2708], label: "Dubai" },
  { id: "paris", location: [48.8566, 2.3522], label: "Paris" }
];
const GLOBE_MARKER_COLOR = [249 / 255, 115 / 255, 22 / 255];
const GLOBE_BASE_DARK = [8 / 255, 17 / 255, 37 / 255];
const GLOBE_BASE_LIGHT = [218 / 255, 224 / 255, 238 / 255];
const GLOBE_ARC_COLOR = [46 / 255, 91 / 255, 255 / 255];

// ── Main Hero Section ───────────────────────────────────────────────────────
export default function HeroSection() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [isMockupCentered, setIsMockupCentered] = useState(false);

  // Parallax elements Refs
  const globeParallaxRef = useRef(null);
  const mapParallaxRef = useRef(null);

  useEffect(() => {
    let active = true;
    let frameId = null;

    const handleScroll = () => {
      if (!active) return;
      // Skip heavy parallax calculations on mobile screens (<768px) for lag-free touch scrolling
      if (window.innerWidth < 768) return;
      if (frameId) cancelAnimationFrame(frameId);
      
      frameId = requestAnimationFrame(() => {
        const sy = window.scrollY;
        if (globeParallaxRef.current) {
          globeParallaxRef.current.style.transform = `translate3d(${sy * 0.12}px, ${-sy * 0.04}px, 0)`;
        }
        if (mapParallaxRef.current) {
          mapParallaxRef.current.style.transform = `translate3d(${-sy * 0.25}px, ${sy * 0.03}px, 0)`;
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      active = false;
      if (frameId) cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Search parameters state
  const [departureCountry, setDepartureCountry] = useState('');
  const [departureCity, setDepartureCity] = useState('');
  const [destinationCountry, setDestinationCountry] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [travelType, setTravelType] = useState('');
  const [travelers, setTravelers] = useState(2);

  // Dynamic lists from Supabase
  const [dbCountries, setDbCountries] = useState([]);
  const [departureCities, setDepartureCities] = useState([]);
  const [destinationCities, setDestinationCities] = useState([]);

  // Fetch countries list from Supabase on mount
  useEffect(() => {
    async function loadCountries() {
      try {
        const { data, error } = await supabase
          .from('countries')
          .select('name, flag, code:iso2')
          .order('name', { ascending: true });
        if (data && !error && data.length > 0) {
          setDbCountries(data);
        } else {
          setDbCountries(countries);
        }
      } catch (e) {
        console.warn("Failed to load countries from Supabase, using static fallback:", e);
        setDbCountries(countries);
      }
    }
    loadCountries();
  }, []);

  // Fetch cities for departure country
  useEffect(() => {
    if (!departureCountry) {
      setDepartureCities([]);
      return;
    }
    async function loadCities() {
      try {
        const { data, error } = await supabase
          .from('cities')
          .select('name')
          .eq('country_name', departureCountry)
          .order('name', { ascending: true });
        if (data && !error) {
          setDepartureCities(data.map(c => c.name));
        } else {
          const staticMatch = countries.find(c => c.name === departureCountry);
          setDepartureCities(staticMatch ? staticMatch.cities : []);
        }
      } catch (e) {
        console.warn("Failed to load departure cities, using static fallback:", e);
        const staticMatch = countries.find(c => c.name === departureCountry);
        setDepartureCities(staticMatch ? staticMatch.cities : []);
      }
    }
    loadCities();
  }, [departureCountry]);

  // Fetch cities for destination country
  useEffect(() => {
    if (!destinationCountry) {
      setDestinationCities([]);
      return;
    }
    async function loadCities() {
      try {
        const { data, error } = await supabase
          .from('cities')
          .select('name')
          .eq('country_name', destinationCountry)
          .order('name', { ascending: true });
        if (data && !error) {
          setDestinationCities(data.map(c => c.name));
        } else {
          const staticMatch = countries.find(c => c.name === destinationCountry);
          setDestinationCities(staticMatch ? staticMatch.cities : []);
        }
      } catch (e) {
        console.warn("Failed to load destination cities, using static fallback:", e);
        const staticMatch = countries.find(c => c.name === destinationCountry);
        setDestinationCities(staticMatch ? staticMatch.cities : []);
      }
    }
    loadCities();
  }, [destinationCountry]);

  const handleDepartureCountryChange = (c) => {
    setDepartureCountry(c);
    setDepartureCity('');
  };
  const handleDestinationCountryChange = (c) => {
    setDestinationCountry(c);
    setDestinationCity('');
  };

  const handleSearch = useCallback(() => {
    const target = destinationCity || destinationCountry;
    if (!target) return;
    const match = topDestinations.find(
      (d) => d.name.toLowerCase() === target.toLowerCase()
    );
    if (match) {
      navigate(`/destination/${match.id}`);
    } else {
      const slug = target.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      navigate(`/destination/${slug}`);
    }
  }, [destinationCity, destinationCountry, navigate]);

  return (
    <section 
      style={{
        '--accent': '#2563EB',
        '--accent-hover': '#1d4ed8',
        background: isDark 
          ? 'var(--bg-primary)' 
          : 'linear-gradient(to bottom, #F8FAFC 0%, #EEF2FF 100%)'
      }}
      className="relative min-h-screen text-[var(--text-primary)] transition-all duration-500 overflow-hidden flex flex-col justify-center items-center py-20"
    >
      {/* Creative Background System: Luxury Grid Backdrop & Deep Floating Orbs */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.015)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.003)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.003)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none z-0 opacity-80" />
      <div className="absolute top-12 left-[8%] w-[450px] h-[450px] rounded-full bg-[#2563EB]/[0.05] dark:bg-[#2563EB]/[0.02] filter blur-[90px] animate-float pointer-events-none z-0" />
      <div className="absolute bottom-24 right-[8%] w-[550px] h-[550px] rounded-full bg-[#2563EB]/[0.03] dark:bg-[#2563EB]/[0.01] filter blur-[110px] animate-float-delayed pointer-events-none z-0" />

      {/* ─── Immersive Center-Curved World Map Horizon (Horizontal Parallax Slide) ─── */}
      <div 
        ref={mapParallaxRef}
        className="absolute inset-x-0 top-[10%] h-[70%] pointer-events-none z-0 select-none overflow-visible flex items-center justify-center"
        style={{
          transform: 'translate3d(0, 0, 0)',
          transition: 'transform 0.15s cubic-bezier(0.1, 0.8, 0.25, 1)',
          willChange: 'transform'
        }}
      >
        <img 
          src="/curved-world-map.png"
          alt="Curved World Map"
          className={`absolute w-[110%] max-w-[1440px] h-auto object-contain pointer-events-none select-none z-0 transition-all duration-500 ${
            isDark 
              ? 'opacity-[0.16] invert brightness-[1.8] contrast-[1.2]' 
              : 'opacity-[0.08] mix-blend-multiply'
          }`}
        />
        
        <svg 
          className={`w-[145%] min-w-[1300px] h-full transition-all duration-500 ${isDark ? 'opacity-40 text-slate-700' : 'opacity-[0.06] text-slate-400 blur-[0.5px]'}`}
          viewBox="0 0 1200 600" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1"
        >
          {/* Concentric curved grid/latitude arches across the background sky */}
          <path d="M -200 480 A 1500 1500 0 0 1 1400 480" strokeDasharray="3 6" className="text-slate-150 dark:text-white/[0.04] stroke-[1.2px]" />
          <path d="M -200 370 A 1500 1500 0 0 1 1400 370" strokeDasharray="4 8" className="text-slate-150 dark:text-white/[0.05] stroke-[1.2px]" />
          <path d="M -200 260 A 1500 1500 0 0 1 1400 260" strokeDasharray="5 10" className="text-slate-150 dark:text-white/[0.06] stroke-[1.2px]" />
          <path d="M -200 150 A 1500 1500 0 0 1 1400 150" strokeDasharray="6 12" className="text-slate-150 dark:text-white/[0.03] stroke-[1px]" />
          
          {/* Curved dotted flight connection lines (flight routes) */}
          <path d="M 280 220 Q 380 130 480 190" stroke="url(#flightGrad)" strokeWidth="1.2" strokeDasharray="3 4" className="opacity-60" />
          <path d="M 480 190 Q 580 110 680 230" stroke="url(#flightGrad)" strokeWidth="1.2" strokeDasharray="3 4" className="opacity-60" />
          <path d="M 680 230 Q 770 140 860 210" stroke="url(#flightGrad)" strokeWidth="1.2" strokeDasharray="3 4" className="opacity-60" />
          <path d="M 860 210 Q 940 120 1020 300" stroke="url(#flightGrad)" strokeWidth="1.2" strokeDasharray="3 4" className="opacity-60" />
          <path d="M 280 220 Q 180 260 120 380" stroke="url(#flightGrad)" strokeWidth="1.2" strokeDasharray="3 4" className="opacity-60" />
          
          <defs>
            <linearGradient id="flightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#2563EB" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#2563EB" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Glowing Blue Map Pin Markers */}
          {/* New York */}
          <g className="cursor-pointer hover:scale-110 transition-transform duration-300">
            <circle cx="280" cy="220" r="12" className="fill-[#2563EB]/20 stroke-[#2563EB]/35 stroke-1 animate-pulse" />
            <circle cx="280" cy="220" r="4.5" className="fill-[#2563EB]" />
          </g>
          {/* London */}
          <g className="cursor-pointer hover:scale-110 transition-transform duration-300">
            <circle cx="480" cy="190" r="12" className="fill-[#2563EB]/20 stroke-[#2563EB]/35 stroke-1 animate-pulse" style={{ animationDelay: '0.5s' }} />
            <circle cx="480" cy="190" r="4.5" className="fill-[#2563EB]" />
          </g>
          {/* Marrakech */}
          <g className="cursor-pointer hover:scale-110 transition-transform duration-300">
            <circle cx="470" cy="290" r="12" className="fill-[#2563EB]/20 stroke-[#2563EB]/35 stroke-1 animate-pulse" style={{ animationDelay: '1s' }} />
            <circle cx="470" cy="290" r="4.5" className="fill-[#2563EB]" />
          </g>
          {/* Lisbon */}
          <g className="cursor-pointer hover:scale-110 transition-transform duration-300">
            <circle cx="440" cy="240" r="12" className="fill-[#2563EB]/20 stroke-[#2563EB]/35 stroke-1 animate-pulse" style={{ animationDelay: '1.5s' }} />
            <circle cx="440" cy="240" r="4.5" className="fill-[#2563EB]" />
          </g>
          {/* Bali */}
          <g className="cursor-pointer hover:scale-110 transition-transform duration-300">
            <circle cx="780" cy="340" r="12" className="fill-[#2563EB]/20 stroke-[#2563EB]/35 stroke-1 animate-pulse" style={{ animationDelay: '0.7s' }} />
            <circle cx="780" cy="340" r="4.5" className="fill-[#2563EB]" />
          </g>
          {/* Tokyo */}
          <g className="cursor-pointer hover:scale-110 transition-transform duration-300">
            <circle cx="860" cy="210" r="12" className="fill-[#2563EB]/20 stroke-[#2563EB]/35 stroke-1 animate-pulse" style={{ animationDelay: '1.2s' }} />
            <circle cx="860" cy="210" r="4.5" className="fill-[#2563EB]" />
          </g>
          {/* Sydney */}
          <g className="cursor-pointer hover:scale-110 transition-transform duration-300">
            <circle cx="910" cy="410" r="12" className="fill-[#2563EB]/20 stroke-[#2563EB]/35 stroke-1 animate-pulse" style={{ animationDelay: '1.8s' }} />
            <circle cx="910" cy="410" r="4.5" className="fill-[#2563EB]" />
          </g>
        </svg>
      </div>

      {/* Subtle Ambient Glow overlays */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-blue-900/[0.01] to-transparent pointer-events-none z-0" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20 flex flex-col items-center">
        {/* Top curations - reference matching */}
        <div className="flex flex-wrap gap-2 justify-center items-center text-xs text-slate-400 font-medium mb-8 animate-fade-in">
          <span className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold mr-1 select-none">Plan trips to:</span>
          {['Bali', 'Lisbon', 'Tokyo', 'Marrakech'].map((c, i) => (
            <span 
              key={c} 
              className={`px-3.5 py-1 rounded-full text-[11px] font-semibold border transition-all duration-300 ${
                i === 0 
                  ? 'bg-[#2563EB]/10 border-[#2563EB]/25 text-[#2563EB] font-bold shadow-[0_2px_8px_rgba(37,99,235,0.1)]' 
                  : 'bg-white dark:bg-white/[0.03] border-gray-200 dark:border-white/[0.08] text-luxury-secondary dark:text-slate-300 hover:border-gray-300 dark:hover:border-white/15'
              }`}
            >
              {i === 0 && <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#2563EB] mr-1.5 animate-pulse" />}
              {c}
            </span>
          ))}
          <span className="text-[11px] text-slate-400 dark:text-slate-550 ml-1 select-none font-semibold">+ 120 more</span>
        </div>

        {/* Hero Typography */}
        <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl font-normal tracking-tight text-luxury-primary dark:text-white leading-[1.05] max-w-4xl animate-slide-up select-none">
          Your trips,<br />
          <span className="italic font-light text-luxury-secondary dark:text-slate-400">finally organized.</span>
        </h1>

        <p className="text-luxury-secondary dark:text-slate-400 text-base sm:text-lg max-w-2xl mt-6 leading-relaxed font-light font-body animate-fade-in">
          Follow beautiful itineraries, plan budgets, and discover hidden gems — all in one calm, spacious workspace made for everyone who loves simple, peaceful travel.
        </p>

        {/* ─── 3. APPLE x AIRBNB SEARCH EXPERIENCE ─── */}
        <div className="w-full max-w-5xl mt-12 px-2 animate-slide-up" style={{ animationDelay: '150ms' }}>
          <div className="backdrop-blur-md bg-white/80 dark:bg-[#101A2E]/85 border border-gray-200 dark:border-white/[0.08] rounded-[32px] md:rounded-full shadow-premium flex flex-col md:flex-row items-stretch md:items-center p-3 md:p-2 gap-2 md:gap-1 relative z-20 transition-all duration-500">
            
            {/* Country selectors */}
            <CountryDropdown
              label="From Country"
              value={departureCountry}
              onChange={handleDepartureCountryChange}
              placeholder="Select origin"
              countriesList={dbCountries}
            />
            
            <div className="hidden md:block w-px h-8 bg-gray-200 dark:bg-white/[0.08]" />

            <SearchableDropdown
              label="From City"
              value={departureCity}
              onChange={setDepartureCity}
              options={departureCities}
              placeholder={departureCountry ? 'Choose city' : 'Choose country'}
              disabled={!departureCountry}
            />

            <div className="hidden md:block w-px h-8 bg-gray-200 dark:bg-white/[0.08]" />

            <CountryDropdown
              label="To Country"
              value={destinationCountry}
              onChange={handleDestinationCountryChange}
              placeholder="Destination"
              countriesList={dbCountries}
            />

            <div className="hidden md:block w-px h-8 bg-gray-200 dark:bg-white/[0.08]" />

            <SearchableDropdown
              label="To City"
              value={destinationCity}
              onChange={setDestinationCity}
              options={destinationCities}
              placeholder={destinationCountry ? 'Choose city' : 'Choose country'}
              disabled={!destinationCountry}
            />

            {/* Submit Button */}
            <button
              onClick={handleSearch}
              disabled={!destinationCity && !destinationCountry}
              className={`w-full md:w-auto p-4 rounded-2xl md:rounded-full bg-[var(--accent)] text-white dark:text-[#091220] transition-all duration-300 flex items-center justify-center gap-2 flex-shrink-0 ${
                destinationCity || destinationCountry ? 'hover:scale-[1.02] md:hover:scale-105 active:scale-95 shadow-md hover:bg-[var(--accent-hover)]' : 'opacity-30 cursor-not-allowed'
              }`}
            >
              <Search className="w-5 h-5 stroke-[2.5px]" />
              <span className="md:hidden font-semibold text-sm">Search Destination</span>
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 justify-center text-xs text-slate-400 font-medium">
            <span>Trending:</span>
            {['Tokyo', 'Paris', 'Bali', 'Kyoto'].map((c) => (
              <button
                key={c}
                onClick={() => {
                  setDestinationCountry('');
                  setDestinationCity(c);
                  const match = topDestinations.find(d => d.name.toLowerCase() === c.toLowerCase());
                  if (match) navigate(`/destination/${match.id}`);
                  else navigate(`/destination/${c.toLowerCase()}`);
                }}
                className="text-[11px] hover:text-luxury-primary dark:hover:text-white transition-colors duration-200 cursor-pointer hover:underline underline-offset-4"
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* ─── 4. PRODUCT SHOWCASE — IPHONE SHOWCASE ─── */}
        <div className="w-full mt-16 sm:mt-24 px-4 relative flex flex-col items-center select-none">
          
          <style>{`
            .glass-card-glow-left::after {
              content: '';
              position: absolute;
              inset: 0;
              border-radius: 2rem;
              padding: 1px;
              background: linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(59, 130, 246, 0.25) 100%);
              -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
              -webkit-mask-composite: xor;
              mask-composite: exclude;
              pointer-events: none;
            }
            .glass-card-glow-right::after {
              content: '';
              position: absolute;
              inset: 0;
              border-radius: 2rem;
              padding: 1px;
              background: linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(6, 182, 212, 0.25) 100%);
              -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
              -webkit-mask-composite: xor;
              mask-composite: exclude;
              pointer-events: none;
            }
          `}</style>

          {/* Subtle background ambient gradients around the showcase (light & dark mode compliant) */}
          <div className="absolute top-[10%] left-[-10%] w-[35%] aspect-square rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-[120px] pointer-events-none" />
          <div className="absolute top-[20%] right-[-10%] w-[35%] aspect-square rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-[120px] pointer-events-none" />

          {/* Three-column layout: Left Feature Card | iPhone Mockup | Right Rating Card */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-2 lg:gap-3 xl:gap-4 w-full max-w-7xl relative z-10">
            
            {/* ── Left Feature Card (Glassmorphism & Closer Translation) ── */}
            <div className={`flex-1 max-w-sm w-full order-2 lg:order-1 flex justify-center lg:justify-end transition-all duration-700 ease-in-out ${
              isMockupCentered 
                ? 'opacity-0 -translate-x-32 pointer-events-none scale-95 h-0 overflow-hidden lg:h-auto lg:overflow-visible' 
                : 'opacity-100 translate-x-0 lg:translate-x-12 z-30 h-auto'
            }`}>
              <div className="w-full max-w-[310px] p-8 rounded-[2rem] bg-white/40 dark:bg-slate-900/75 backdrop-blur-2xl border border-white/40 dark:border-white/15 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] transition-all duration-300 hover:scale-[1.02] relative group overflow-hidden">
                {/* Diagonal sweep glow */}
                <div className="absolute -inset-full bg-gradient-to-tr from-transparent via-white/[0.06] to-transparent pointer-events-none z-10 -rotate-45 transition-transform duration-700 ease-out group-hover:translate-x-full group-hover:translate-y-full" />
                
                <span className="text-[10px] text-[var(--accent)] font-bold uppercase tracking-widest bg-[var(--accent)]/10 px-3.5 py-1.5 rounded-full mb-4 inline-block shadow-sm">
                  Trusted by 2.5M Travelers
                </span>
                
                <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-luxury-primary dark:text-white leading-tight tracking-tight mt-1">
                  Plan Smarter,<br />
                  <span className="relative inline-block mt-0.5">
                    Travel Better.
                    <span className="absolute bottom-0.5 left-0 w-full h-[4px] bg-[var(--accent)] rounded-full" />
                  </span>
                </h3>
                
                <p className="text-slate-500 dark:text-slate-400 text-[15px] leading-relaxed mt-4 font-light">
                  Empowering you to organize every detail of your journey with intuitive AI tools, real-time budgets, and personalized itineraries.
                </p>

                {/* Prominent CTA Button */}
                <button 
                  onClick={() => navigate('/ai-trip-planner')}
                  className="mt-6 w-full py-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] active:scale-[0.98] text-white font-bold rounded-2xl shadow-[0_4px_14px_0_rgba(37,99,235,0.3)] transition-all duration-200 text-sm flex items-center justify-center gap-2 group cursor-pointer"
                >
                  Get Started Free <span className="transform transition-transform duration-200 group-hover:translate-x-1">→</span>
                </button>

                {/* User avatars + stats */}
                <div className="flex items-center gap-3 mt-6 pt-5 border-t border-slate-100 dark:border-white/[0.04]">
                  <div className="flex -space-x-2">
                    {[
                      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80',
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
                      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&h=120&q=80',
                      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80'
                    ].map((url, i) => (
                      <img 
                        key={i} 
                        src={url}
                        alt="User Portrait"
                        className="w-8 h-8 rounded-full border-2 border-white dark:border-[#0B1329] object-cover select-none shadow-sm"
                        loading="lazy"
                        draggable={false}
                      />
                    ))}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-luxury-primary dark:text-white block leading-none">2.5M Active Users</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Center iPhone Mockup (Interactive Centering & Blue Ribbon) ── */}
            <div 
              onClick={() => setIsMockupCentered(!isMockupCentered)}
              title={isMockupCentered ? "Click to minimize" : "Click to inspect UI"}
              className={`relative flex-shrink-0 order-1 lg:order-2 z-20 my-6 lg:my-0 aspect-[3/4] transition-all duration-700 ease-in-out flex items-center justify-center cursor-pointer ${
                isMockupCentered 
                  ? 'w-[320px] sm:w-[400px] md:w-[440px] lg:w-[460px] xl:w-[480px] z-50 scale-105 my-[200px] sm:my-[240px] md:my-0' 
                  : 'w-[280px] sm:w-[320px] md:w-[360px] lg:w-[380px] xl:w-[400px]'
              }`}
            >
              
              {/* Vector Blue Ribbon Wave in Background */}
              <svg 
                className={`absolute w-[180%] h-[320px] pointer-events-none opacity-80 select-none -z-10 transition-all duration-700 ease-in-out ${
                  isMockupCentered ? 'scale-110 opacity-30 blur-[2px]' : 'scale-100'
                }`} 
                viewBox="0 0 1000 350" 
                fill="none"
              >
                <defs>
                  <linearGradient id="ribbonGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--ribbon-color-1)" stopOpacity="0.8" />
                    <stop offset="35%" stopColor="var(--ribbon-color-2)" stopOpacity="0.95" />
                    <stop offset="65%" stopColor="var(--ribbon-color-3)" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="var(--ribbon-color-4)" stopOpacity="0.8" />
                  </linearGradient>
                  <linearGradient id="ribbonGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--ribbon-color-5)" stopOpacity="0.6" />
                    <stop offset="50%" stopColor="var(--ribbon-color-3)" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="var(--ribbon-color-6)" stopOpacity="0.6" />
                  </linearGradient>
                  <filter id="ribbonShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="25" stdDeviation="15" floodColor="#1E40AF" floodOpacity="0.35"/>
                  </filter>
                </defs>
                {/* Waving Ribbon Path Layers for 3D Shading Effect */}
                <path 
                  d="M -50,180 C 150,250 250,70 420,70 C 560,70 600,290 700,290 C 800,290 880,140 1050,160" 
                  stroke="url(#ribbonGrad1)" 
                  strokeWidth="30" 
                  strokeLinecap="round" 
                  filter="url(#ribbonShadow)"
                />
                <path 
                  d="M -50,180 C 150,250 250,70 420,70 C 560,70 600,290 700,290 C 800,290 880,140 1050,160" 
                  stroke="url(#ribbonGrad2)" 
                  strokeWidth="18" 
                  strokeLinecap="round"
                />
                <path 
                  d="M -50,175 C 150,245 250,65 420,65 C 560,65 600,285 700,285 C 800,285 880,135 1050,155" 
                  stroke="#FFFFFF" 
                  strokeWidth="1.5" 
                  strokeOpacity="0.3" 
                  strokeLinecap="round"
                />
              </svg>

              {/* --- Fanning Glassmorphic Attraction Cards --- */}
              {/* Kyoto (Left Outer Card) */}
              <div 
                onClick={(e) => {
                  if (isMockupCentered) {
                    e.stopPropagation();
                    navigate('/destination/kyoto');
                  }
                }}
                className={`absolute w-[64%] h-[75%] md:w-[50%] md:h-[68%] rounded-[24px] overflow-hidden transition-all duration-700 ease-out z-10 shadow-[0_25px_55px_rgba(0,0,0,0.45)] select-none border border-white/30 dark:border-white/20 ${
                  isMockupCentered 
                    ? 'opacity-100 pointer-events-auto cursor-pointer -translate-y-[85%] -translate-x-[12%] scale-[0.85] md:scale-[0.95] md:-translate-y-0 md:-translate-x-[115%] hover:scale-[1.02] hover:-translate-y-6 hover:z-50 hover:shadow-[0_30px_60px_rgba(37,99,235,0.4)] hover:border-blue-400/50' 
                    : 'opacity-0 pointer-events-none translate-x-0 scale-90 translate-y-0'
                }`}
                style={{ transitionDelay: '50ms' }}
              >
                {/* Background Cover Image */}
                <img 
                  src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=80"
                  alt="Kyoto"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />

                {/* Badges */}
                <div className="absolute top-3 inset-x-3 flex justify-between items-center z-20">
                  <span className="bg-white/90 dark:bg-slate-900/90 text-[#0F172A] dark:text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    Spot #2
                  </span>
                  <span className="bg-white/10 dark:bg-black/30 text-white text-[9px] font-medium px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-md border border-white/25 flex items-center gap-1 shadow-sm">
                    <Shield className="w-2.5 h-2.5 text-blue-400 fill-blue-400/30" /> Very Safe
                  </span>
                </div>

                {/* Card Content */}
                <div className="absolute bottom-0 inset-x-0 p-4 text-left z-20">
                  <div className="text-white/70 text-[9px] font-bold tracking-widest uppercase mb-1">
                    🇯🇵 Japan
                  </div>
                  <h4 className="font-heading text-lg font-bold text-white leading-tight">
                    Kyoto
                  </h4>
                  <p className="text-white/80 text-[10px] font-light leading-snug mt-1 line-clamp-2">
                    Bamboo groves, golden pavilions, and traditional tea ceremonies.
                  </p>
                  <div className="mt-2.5 pt-2.5 border-t border-white/10 flex items-center justify-between text-[9px] text-white/60">
                    <span className="flex items-center gap-0.5">
                      <MapPin className="w-3 h-3 text-blue-400 dark:text-blue-300" /> Oct - Nov (Autumn)
                    </span>
                    <span className="font-bold text-blue-400 dark:text-blue-300 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-lg shadow-[0_2px_10px_rgba(59,130,246,0.1)]">$150-300/d</span>
                  </div>
                </div>
              </div>

              {/* Paris (Left Inner Card) */}
              <div 
                onClick={(e) => {
                  if (isMockupCentered) {
                    e.stopPropagation();
                    navigate('/destination/paris');
                  }
                }}
                className={`absolute w-[64%] h-[75%] md:w-[50%] md:h-[68%] rounded-[24px] overflow-hidden transition-all duration-700 ease-out z-10 shadow-[0_25px_55px_rgba(0,0,0,0.45)] select-none border border-white/30 dark:border-white/20 ${
                  isMockupCentered 
                    ? 'opacity-100 pointer-events-auto cursor-pointer -translate-y-[42%] -translate-x-[6%] scale-[0.80] md:scale-[0.88] md:-translate-y-[15px] md:-translate-x-[58%] hover:scale-[0.95] hover:-translate-y-6 hover:z-50 hover:shadow-[0_30px_60px_rgba(37,99,235,0.4)] hover:border-blue-400/50' 
                    : 'opacity-0 pointer-events-none translate-x-0 scale-90 translate-y-0'
                }`}
                style={{ transitionDelay: '100ms' }}
              >
                {/* Background Cover Image */}
                <img 
                  src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80"
                  alt="Paris"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />

                {/* Badges */}
                <div className="absolute top-3 inset-x-3 flex justify-between items-center z-20">
                  <span className="bg-white/90 dark:bg-slate-900/90 text-[#0F172A] dark:text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    Spot #4
                  </span>
                  <span className="bg-white/10 dark:bg-black/30 text-white text-[9px] font-medium px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-md border border-white/25 flex items-center gap-1 shadow-sm">
                    <Shield className="w-2.5 h-2.5 text-blue-400 fill-blue-400/30" /> Very Safe
                  </span>
                </div>

                {/* Card Content */}
                <div className="absolute bottom-0 inset-x-0 p-4 text-left z-20">
                  <div className="text-white/70 text-[9px] font-bold tracking-widest uppercase mb-1">
                    🇫🇷 France
                  </div>
                  <h4 className="font-heading text-lg font-bold text-white leading-tight">
                    Paris
                  </h4>
                  <p className="text-white/80 text-[10px] font-light leading-snug mt-1 line-clamp-2">
                    Eiffel Tower, Louvre Museum, and cozy sidewalk cafes.
                  </p>
                  <div className="mt-2.5 pt-2.5 border-t border-white/10 flex items-center justify-between text-[9px] text-white/60">
                    <span className="flex items-center gap-0.5">
                      <MapPin className="w-3 h-3 text-blue-400 dark:text-blue-300" /> Apr - June (Spring)
                    </span>
                    <span className="font-bold text-blue-400 dark:text-blue-300 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-lg shadow-[0_2px_10px_rgba(59,130,246,0.1)]">$180-350/d</span>
                  </div>
                </div>
              </div>

              {/* Bali (Right Inner Card) */}
              <div 
                onClick={(e) => {
                  if (isMockupCentered) {
                    e.stopPropagation();
                    navigate('/destination/bali');
                  }
                }}
                className={`absolute w-[64%] h-[75%] md:w-[50%] md:h-[68%] rounded-[24px] overflow-hidden transition-all duration-700 ease-out z-10 shadow-[0_25px_55px_rgba(0,0,0,0.45)] select-none border border-white/30 dark:border-white/20 ${
                  isMockupCentered 
                    ? 'opacity-100 pointer-events-auto cursor-pointer translate-y-[42%] translate-x-[6%] scale-[0.80] md:scale-[0.88] md:-translate-y-[15px] md:translate-x-[58%] hover:scale-[0.95] hover:-translate-y-6 hover:z-30 hover:shadow-[0_30px_60px_rgba(37,99,235,0.4)] hover:border-blue-400/50' 
                    : 'opacity-0 pointer-events-none translate-x-0 scale-90 translate-y-0'
                }`}
                style={{ transitionDelay: '150ms' }}
              >
                {/* Background Cover Image */}
                <img 
                  src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80"
                  alt="Bali"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />

                {/* Badges */}
                <div className="absolute top-3 inset-x-3 flex justify-between items-center z-20">
                  <span className="bg-white/90 dark:bg-slate-900/90 text-[#0F172A] dark:text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    Spot #5
                  </span>
                  <span className="bg-white/10 dark:bg-black/30 text-white text-[9px] font-medium px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-md border border-white/25 flex items-center gap-1 shadow-sm">
                    <Shield className="w-2.5 h-2.5 text-blue-400 fill-blue-400/30" /> Very Safe
                  </span>
                </div>

                {/* Card Content */}
                <div className="absolute bottom-0 inset-x-0 p-4 text-left z-20">
                  <div className="text-white/70 text-[9px] font-bold tracking-widest uppercase mb-1">
                    🇮🇩 Indonesia
                  </div>
                  <h4 className="font-heading text-lg font-bold text-white leading-tight">
                    Bali
                  </h4>
                  <p className="text-white/80 text-[10px] font-light leading-snug mt-1 line-clamp-2">
                    Tropical beaches, lush rice terraces, and serene sunset temples.
                  </p>
                  <div className="mt-2.5 pt-2.5 border-t border-white/10 flex items-center justify-between text-[9px] text-white/60">
                    <span className="flex items-center gap-0.5">
                      <MapPin className="w-3 h-3 text-blue-400 dark:text-blue-300" /> Apr - Oct (Dry Season)
                    </span>
                    <span className="font-bold text-blue-400 dark:text-blue-300 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-lg shadow-[0_2px_10px_rgba(59,130,246,0.1)]">$80-180/d</span>
                  </div>
                </div>
              </div>

              {/* Iceland (Right Outer Card) */}
              <div 
                onClick={(e) => {
                  if (isMockupCentered) {
                    e.stopPropagation();
                    navigate('/destination/iceland');
                  }
                }}
                className={`absolute w-[64%] h-[75%] md:w-[50%] md:h-[68%] rounded-[24px] overflow-hidden transition-all duration-700 ease-out z-0 shadow-[0_25px_55px_rgba(0,0,0,0.45)] select-none border border-white/30 dark:border-white/20 ${
                  isMockupCentered 
                    ? 'opacity-100 pointer-events-auto cursor-pointer translate-y-[85%] translate-x-[12%] scale-[0.85] md:scale-[0.95] md:-translate-y-0 md:translate-x-[115%] hover:scale-[1.02] hover:-translate-y-6 hover:z-50 hover:shadow-[0_30px_60px_rgba(37,99,235,0.4)] hover:border-blue-400/50' 
                    : 'opacity-0 pointer-events-none translate-x-0 scale-90 translate-y-0'
                }`}
                style={{ transitionDelay: '200ms' }}
              >
                {/* Background Cover Image */}
                <img 
                  src="https://images.unsplash.com/photo-1504829857797-ddff29c27927?auto=format&fit=crop&w=400&q=80"
                  alt="Iceland"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />

                {/* Badges */}
                <div className="absolute top-3 inset-x-3 flex justify-between items-center z-20">
                  <span className="bg-white/90 dark:bg-slate-900/90 text-[#0F172A] dark:text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    Spot #8
                  </span>
                  <span className="bg-white/10 dark:bg-black/30 text-white text-[9px] font-medium px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-md border border-white/25 flex items-center gap-1 shadow-sm">
                    <Shield className="w-2.5 h-2.5 text-blue-400 fill-blue-400/30" /> Very Safe
                  </span>
                </div>

                {/* Card Content */}
                <div className="absolute bottom-0 inset-x-0 p-4 text-left z-20">
                  <div className="text-white/70 text-[9px] font-bold tracking-widest uppercase mb-1">
                    🇮🇸 Iceland
                  </div>
                  <h4 className="font-heading text-lg font-bold text-white leading-tight">
                    Iceland
                  </h4>
                  <p className="text-white/80 text-[10px] font-light leading-snug mt-1 line-clamp-2">
                    Land of fire, ice, glaciers, waterfalls, and the Northern Lights.
                  </p>
                  <div className="mt-2.5 pt-2.5 border-t border-white/10 flex items-center justify-between text-[9px] text-white/60">
                    <span className="flex items-center gap-0.5">
                      <MapPin className="w-3 h-3 text-blue-400 dark:text-blue-300" /> June-Aug (Summer)
                    </span>
                    <span className="font-bold text-blue-400 dark:text-blue-300 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-lg shadow-[0_2px_10px_rgba(59,130,246,0.1)]">$200-400/d</span>
                  </div>
                </div>
              </div>

              {/* Official 4K Ultra-HD Crisp iPhone 16 Pro Natural Titanium Mockup */}
              <img
                src="/iphone-mockup-new.png"
                alt="TripReady Official Mobile App Experience"
                className={`absolute w-full h-full object-contain select-none transition-all duration-700 ease-out filter z-20 ${
                  isMockupCentered 
                    ? 'rotate-[-2.5deg] scale-105 drop-shadow-[0_50px_100px_rgba(0,0,0,0.4)]' 
                    : 'rotate-0 scale-100 drop-shadow-[0_35px_70px_rgba(37,99,235,0.18)]'
                }`}
                draggable={false}
                loading="eager"
              />

              {/* Light mode glass glow backdrop */}
              {!isDark && (
                <div className="absolute inset-x-8 top-10 bottom-10 bg-gradient-to-b from-blue-500/15 via-indigo-500/8 to-transparent rounded-[50px] blur-2xl pointer-events-none z-10" />
              )}
            </div>

            {/* ── Right Testimonial Card (Glassmorphism & Closer Translation) ── */}
            <div className={`flex-1 max-w-sm w-full order-3 flex justify-center lg:justify-start transition-all duration-700 ease-in-out ${
              isMockupCentered 
                ? 'opacity-0 translate-x-32 pointer-events-none scale-95 h-0 overflow-hidden lg:h-auto lg:overflow-visible' 
                : 'opacity-100 translate-x-0 lg:-translate-x-12 z-30 h-auto'
            }`}>
              <div className="w-full max-w-[310px] p-8 rounded-[2rem] bg-white/40 dark:bg-slate-900/75 backdrop-blur-2xl border border-white/40 dark:border-white/15 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] transition-all duration-300 hover:scale-[1.02] relative group overflow-hidden">
                {/* Diagonal sweep glow */}
                <div className="absolute -inset-full bg-gradient-to-tr from-transparent via-white/[0.06] to-transparent pointer-events-none z-10 -rotate-45 transition-transform duration-700 ease-out group-hover:translate-x-full group-hover:translate-y-full" />
                
                {/* 5 Green Stars */}
                <div className="flex gap-1 mb-5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg key={s} className="w-4.5 h-4.5 fill-[#22C77A] text-[#22C77A]" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>

                <h3 className="font-heading text-lg font-bold text-luxury-primary dark:text-white leading-tight tracking-tight">
                  Best on the market
                </h3>
                <p className="text-slate-600 dark:text-slate-350 text-sm leading-relaxed mt-3 font-light italic">
                  "I planned my entire Umrah trip, booked flights, managed my budget, and discovered attractions — all from one place. Incredible experience."
                </p>

                {/* Reviewer Meta (real person photo) */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/[0.04] flex items-center gap-3">
                  <img 
                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&h=120&q=80"
                    alt="Ahmed K."
                    className="w-9 h-9 rounded-full border border-[var(--accent)] object-cover select-none shadow-sm"
                    loading="lazy"
                    draggable={false}
                  />
                  <div>
                    <span className="text-xs font-bold text-luxury-primary dark:text-white block">Ahmed K.</span>
                    <span className="text-[10px] text-[var(--accent)] font-bold block mt-0.5">Verified ✓</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ─── 5. TRUSTED PARTNERS — INFINITE MARQUEE ─── */}
        <div className="w-full max-w-6xl mt-16 sm:mt-24 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <p className="text-center mb-5 select-none">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-400/80 dark:text-slate-555 uppercase tracking-[0.25em]">Trusted Partners</span>
          </p>

          {/* Marquee container with edge fade masks */}
          <div 
            className="relative overflow-hidden group/marquee"
            style={{
              maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
            }}
          >
            <div 
              className="flex items-center gap-12 sm:gap-16 whitespace-nowrap group-hover/marquee:[animation-play-state:paused]"
              style={{
                animation: 'marquee-scroll 35s linear infinite',
                width: 'max-content',
              }}
            >
              {[
                { name: 'Google', domain: 'google.com' },
                { name: 'Gemini', domain: 'gemini.google.com' },
                { name: 'Google Maps', domain: 'maps.google.com' },
                { name: 'Pexels', domain: 'pexels.com' },
                { name: 'Pixabay', domain: 'pixabay.com' },
                { name: 'Unsplash', domain: 'unsplash.com' },
                { name: 'Logo.dev', domain: 'logo.dev' },
                { name: 'Supabase', domain: 'supabase.com' },
                { name: 'Booking.com', domain: 'booking.com' },
                { name: 'Tripadvisor', domain: 'tripadvisor.com' },
              ].map((partner) => (
                <div key={`a-${partner.domain}`} className="flex items-center gap-2.5 px-2 select-none shrink-0 group/item cursor-default">
                  <img 
                    src={`https://img.logo.dev/${partner.domain}?token=${import.meta.env.VITE_LOGO_DEV_PUBLISHABLE_KEY || 'pk_bYH-YceiR-KgJx79TnahZg'}&size=60&format=png`}
                    alt={partner.name}
                    className="h-5 w-5 sm:h-6 sm:w-6 object-contain filter grayscale opacity-50 group-hover/item:grayscale-0 group-hover/item:opacity-100 transition-all duration-500"
                    loading="lazy"
                    draggable={false}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <span className="text-[12px] sm:text-[13px] font-semibold text-slate-400 dark:text-slate-555 group-hover/item:text-slate-700 dark:group-hover/item:text-slate-200 transition-colors duration-500 tracking-wide">
                    {partner.name}
                  </span>
                </div>
              ))}
              {[
                { name: 'Google', domain: 'google.com' },
                { name: 'Gemini', domain: 'gemini.google.com' },
                { name: 'Google Maps', domain: 'maps.google.com' },
                { name: 'Pexels', domain: 'pexels.com' },
                { name: 'Pixabay', domain: 'pixabay.com' },
                { name: 'Unsplash', domain: 'unsplash.com' },
                { name: 'Logo.dev', domain: 'logo.dev' },
                { name: 'Supabase', domain: 'supabase.com' },
                { name: 'Booking.com', domain: 'booking.com' },
                { name: 'Tripadvisor', domain: 'tripadvisor.com' },
              ].map((partner) => (
                <div key={`b-${partner.domain}`} className="flex items-center gap-2.5 px-2 select-none shrink-0 group/item cursor-default">
                  <img 
                    src={`https://img.logo.dev/${partner.domain}?token=${import.meta.env.VITE_LOGO_DEV_PUBLISHABLE_KEY || 'pk_bYH-YceiR-KgJx79TnahZg'}&size=60&format=png`}
                    alt={partner.name}
                    className="h-5 w-5 sm:h-6 sm:w-6 object-contain filter grayscale opacity-50 group-hover/item:grayscale-0 group-hover/item:opacity-100 transition-all duration-500"
                    loading="lazy"
                    draggable={false}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <span className="text-[12px] sm:text-[13px] font-semibold text-slate-400 dark:text-slate-555 group-hover/item:text-slate-700 dark:group-hover/item:text-slate-200 transition-colors duration-500 tracking-wide">
                    {partner.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Ultra-HD Vector iPhone 16 Pro Mockup Interface (0% Blur / 0% Phatna) ──
function VectorIphoneMockup({ isDark, isCentered }) {
  return (
    <div 
      className={`relative w-[280px] sm:w-[320px] aspect-[9/19.5] mx-auto transition-all duration-700 ease-out select-none ${
        isCentered 
          ? 'rotate-[-2.5deg] scale-105 drop-shadow-[0_40px_80px_rgba(0,0,0,0.3)]' 
          : 'rotate-0 scale-100 drop-shadow-[0_25px_50px_rgba(0,0,0,0.15)]'
      }`}
    >
      {/* Outer Titanium Metallic Chassis Frame */}
      <div className={`w-full h-full rounded-[48px] p-3 relative shadow-2xl transition-colors duration-500 border-[3.5px] ${
        isDark 
          ? 'bg-[#181C24] border-[#374151] shadow-black/80' 
          : 'bg-[#E5E7EB] border-[#D1D5DB] shadow-slate-900/15'
      }`}>
        {/* Metallic Highlight Edge */}
        <div className="absolute inset-0 rounded-[45px] border border-white/20 pointer-events-none z-30" />
        
        {/* Dynamic Island Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-40 flex items-center justify-between px-2.5 shadow-md">
          <div className="w-2 h-2 rounded-full bg-[#0a0a0a] border border-white/10" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#111] border border-blue-500/30" />
        </div>

        {/* Inner Vector OLED/LCD Screen */}
        <div className={`w-full h-full rounded-[38px] overflow-hidden flex flex-col justify-between pt-8 pb-2.5 px-3.5 relative z-10 transition-colors duration-500 antialiased ${
          isDark 
            ? 'bg-[#0B0F19] text-white' 
            : 'bg-[#FFFFFF] text-slate-900 shadow-[inset_0_0_20px_rgba(0,0,0,0.03)]'
        }`}>
          
          {/* Status Bar */}
          <div className="flex items-center justify-between text-[9.5px] font-bold font-mono px-1 opacity-80">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[8.5px]">5G</span>
              <Wifi size={10} />
              <Battery size={12} className="fill-current" />
            </div>
          </div>

          {/* Top User Greeting Bar */}
          <div className="flex items-center justify-between mt-2">
            <h4 className="font-heading text-base font-extrabold tracking-tight leading-none text-slate-900 dark:text-white">
              Welcome back!
            </h4>
            <div className="flex items-center gap-1.5">
              <div className="relative p-1 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                <Bell size={11} />
                <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-red-500" />
              </div>
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
                alt="User Avatar"
                className="w-6.5 h-6.5 rounded-full object-cover border border-blue-500/30"
                loading="eager"
              />
            </div>
          </div>

          {/* Search Input Box */}
          <div className="mt-2 bg-slate-100 dark:bg-white/10 rounded-xl px-2.5 py-1.5 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <Search size={11} className="text-slate-400" />
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-light">Search</span>
            </div>
            <Mic size={11} className="text-slate-400" />
          </div>

          {/* Upcoming Trip Card */}
          <div className="mt-2.5 rounded-xl bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white p-2.5 shadow-md relative overflow-hidden text-left border border-white/10">
            <div className="flex items-center justify-between text-[8px] text-slate-400 font-bold uppercase tracking-wider">
              <span>Upcoming Trip</span>
              <span className="text-blue-400 flex items-center gap-0.5">See more <ChevronRight size={9} /></span>
            </div>
            <div className="flex items-end justify-between mt-1">
              <div>
                <h5 className="font-heading text-sm font-extrabold leading-none text-white">London</h5>
                <span className="text-[8px] text-slate-400 block mt-1">Oct 24–28</span>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=200&auto=format&fit=crop&q=80" 
                alt="London" 
                className="w-12 h-9 rounded-md object-cover border border-white/20 shadow-xs"
                loading="eager"
              />
            </div>
          </div>

          {/* Recent Bookings Card */}
          <div className="mt-2 space-y-1 text-left">
            <div className="flex items-center justify-between text-[9px] font-bold text-slate-500 dark:text-slate-400">
              <span>Recent Bookings</span>
              <span className="text-blue-600 dark:text-blue-400 text-[8.5px]">See All</span>
            </div>

            <div className="bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 rounded-lg p-1.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="p-1 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Briefcase size={11} />
                </div>
                <div className="leading-tight">
                  <span className="text-[9.5px] font-bold text-slate-800 dark:text-white block">Bookings</span>
                  <span className="text-[8px] text-slate-400 block">London</span>
                </div>
              </div>
              <div className="text-right leading-tight">
                <span className="text-[9.5px] font-bold text-slate-800 dark:text-white block">$400</span>
                <span className="text-[8px] text-slate-400 block">Oct 24-28</span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 rounded-lg p-1.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="p-1 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <Calendar size={11} />
                </div>
                <div className="leading-tight">
                  <span className="text-[9.5px] font-bold text-slate-800 dark:text-white block">Department</span>
                  <span className="text-[8px] text-slate-400 block">London</span>
                </div>
              </div>
              <div className="text-right leading-tight">
                <span className="text-[9.5px] font-bold text-slate-800 dark:text-white block">$201</span>
                <span className="text-[8px] text-slate-400 block">12:00 AM</span>
              </div>
            </div>
          </div>

          {/* Flight Status Card */}
          <div className="mt-1.5 text-left">
            <div className="flex items-center justify-between text-[9px] font-bold text-slate-500 dark:text-slate-400 mb-0.5">
              <span>Flight Status</span>
              <span className="text-blue-600 dark:text-blue-400 text-[8.5px]">More</span>
            </div>

            <div className="bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 rounded-lg p-1.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Plane size={11} className="rotate-45" />
                </div>
                <div className="leading-tight">
                  <span className="text-[9.5px] font-bold text-slate-800 dark:text-white block">AHG</span>
                  <span className="text-[8px] text-slate-400 block">Flight Status</span>
                </div>
              </div>
              <div className="text-right leading-tight">
                <span className="text-[9.5px] font-bold text-slate-800 dark:text-white block">8:25</span>
                <span className="text-[8px] text-emerald-500 font-bold block">Head ago</span>
              </div>
            </div>
          </div>

          {/* Bottom Dock Navigation Bar */}
          <div className="mt-2 pt-1.5 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-around text-slate-400 text-[8.5px]">
            <div className="flex flex-col items-center gap-0.5 text-blue-600 dark:text-blue-400 font-bold">
              <Home size={12} />
              <span>Home</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <Compass size={12} />
              <span>Discover</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <Briefcase size={12} />
              <span>Bookings</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <Settings size={12} />
              <span>Settings</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
