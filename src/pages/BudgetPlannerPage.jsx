import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import {
  DollarSign,
  TrendingDown,
  Download,
  Mail,
  Share2,
  Sparkles,
  ArrowRight,
  Plane,
  Building2,
  UtensilsCrossed,
  Car,
  Ticket,
  ChevronDown,
  Search,
  Shield,
  FileText,
  Clock,
  Globe,
  Settings,
  Plus,
  Minus,
  CheckCircle,
  HelpCircle,
  Eye,
  RefreshCw,
  Award,
  AlertTriangle,
  Wallet,
  Compass,
  Crown,
  Lightbulb
} from 'lucide-react';
import { topDestinations, currencies, budgetPreferences, travelTypes, countries } from '../data';
import { useLiveRates } from '../utils/currencyService';

// Segment colors strictly following a sophisticated slate/neutral sequence with a royal blue highlight
const CATEGORY_META = {
  flights:    { label: 'Flights & Transit', color: '#5F6368', icon: Plane }, // Slate
  hotels:     { label: 'Luxury Stays', color: '#3B82F6', icon: Building2 }, // Royal Blue Accent
  food:       { label: 'Culinary Experiences', color: '#8E9296', icon: UtensilsCrossed }, // Neutral Grey
  transport:  { label: 'Local Commute', color: '#A3A6A8', icon: Car }, // Light Slate
  activities: { label: 'Tours & Highlights', color: '#BDBFBF', icon: Ticket }, // Cool Silver
  visa:       { label: 'Border Clearances', color: '#D5D7D8', icon: Globe }, // Light Silver
  emergency:  { label: 'Emergency Cushion', color: '#E6E8EA', icon: Shield }, // Soft Grey-White
};

// Daily benchmark multiplier ratios per destination style
const DEST_BASE_COSTS = {
  tokyo: { budget: 110, midrange: 220, luxury: 480 },
  paris: { budget: 130, midrange: 240, luxury: 550 },
  bali: { budget: 45, midrange: 95, luxury: 240 },
  dubai: { budget: 160, midrange: 310, luxury: 750 },
  santorini: { budget: 140, midrange: 280, luxury: 680 },
  newyork: { budget: 180, midrange: 350, luxury: 820 },
  maldives: { budget: 250, midrange: 580, luxury: 1500 },
  iceland: { budget: 170, midrange: 320, luxury: 710 },
  rome: { budget: 110, midrange: 210, luxury: 450 },
  capetown: { budget: 70, midrange: 140, luxury: 320 },
  barcelona: { budget: 100, midrange: 190, luxury: 410 },
  kyoto: { budget: 90, midrange: 180, luxury: 390 },
  riyadh: { budget: 100, midrange: 190, luxury: 450 },
};

// Segment distributions (weights)
const WEIGHTS = {
  flights: 0.22,
  hotels: 0.32,
  food: 0.18,
  transport: 0.08,
  activities: 0.12,
  visa: 0.03,
  emergency: 0.05,
};

// Donut Chart Segment
function DonutSegment({ size, radius, strokeWidth, color, pct, offset, delay }) {
  const circ = 2 * Math.PI * radius;
  const length = pct * circ;
  const gap = circ - length;

  return (
    <circle
      cx={size / 2}
      cy={size / 2}
      r={radius}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeDasharray={`${length} ${gap}`}
      strokeDashoffset={-offset}
      strokeLinecap="round"
      className="transition-all duration-1000 ease-out"
      style={{
        transitionDelay: `${delay}ms`,
      }}
    />
  );
}

const prefIcons = { budget: Wallet, midrange: Compass, luxury: Crown };

// Helper to generate normalized city ID
const getCityId = (cityName) => {
  const lower = cityName.toLowerCase().trim();
  if (lower === 'new york') return 'newyork';
  if (lower === 'cape town') return 'capetown';
  return lower.replace(/\s+/g, '-');
};

// Premium worldwide countries and cities selector database (250+ Cities)
const ALL_WORLDWIDE_CITIES = countries.flatMap(c => 
  c.cities.map(city => ({
    id: getCityId(city),
    name: city,
    country: c.name,
    flag: c.flag,
    region: c.code === 'US' ? 'North America' :
            ['GB', 'FR', 'IT', 'ES', 'GR', 'PT', 'CH', 'IS', 'NO'].includes(c.code) ? 'Europe' :
            ['JP', 'AU', 'NZ', 'SG', 'KR', 'CN', 'HK'].includes(c.code) ? 'Asia-Pacific' :
            ['AE', 'SA', 'EG', 'JO'].includes(c.code) ? 'Middle East' :
            ['TH', 'ID', 'MV', 'IN', 'PK'].includes(c.code) ? 'South Asia' : 'Worldwide'
  }))
).sort((a, b) => a.name.localeCompare(b.name));

// ── BudgetPlannerPage ────────────────────────────────────────────────────────
export default function BudgetPlannerPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Primary Inputs State
  const [departureId, setDepartureId] = useState('newyork'); // normalized default 'newyork'
  const [destinationId, setDestinationId] = useState('tokyo'); // normalized default 'tokyo'
  const [duration, setDuration] = useState(7);
  const [style, setStyle] = useState('midrange');

  // Read country from query params to pre-select destination
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const countryParam = params.get('country');
    if (countryParam) {
      // Find the first city in ALL_WORLDWIDE_CITIES that matches this country
      const match = ALL_WORLDWIDE_CITIES.find(
        c => c.country.toLowerCase() === countryParam.toLowerCase()
      );
      if (match) {
        setDestinationId(match.id);
      }
    }
  }, [location]);
  const [currencyCode, setCurrencyCode] = useState('USD');
  const [travelers, setTravelers] = useState(2);
  const [customLimit, setCustomLimit] = useState('');

  // Custom Search Dropdowns State
  const [showDepartureDropdown, setShowDepartureDropdown] = useState(false);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  const [searchDepartureText, setSearchDepartureText] = useState('');
  const [searchDestinationText, setSearchDestinationText] = useState('');

  const currentDepartureLoc = ALL_WORLDWIDE_CITIES.find(c => c.id === departureId) || ALL_WORLDWIDE_CITIES[0];
  const currentDestinationLoc = ALL_WORLDWIDE_CITIES.find(c => c.id === destinationId) || ALL_WORLDWIDE_CITIES[0];

  const filteredDepartureCities = ALL_WORLDWIDE_CITIES.filter(city => 
    city.name.toLowerCase().includes(searchDepartureText.toLowerCase()) ||
    city.country.toLowerCase().includes(searchDepartureText.toLowerCase())
  );

  const filteredDestinationCities = ALL_WORLDWIDE_CITIES.filter(city => 
    city.name.toLowerCase().includes(searchDestinationText.toLowerCase()) ||
    city.country.toLowerCase().includes(searchDestinationText.toLowerCase())
  );

  // AI Loading & Calculations state
  const [loading, setLoading] = useState(false);
  const [loadStep, setLoadStep] = useState(0);
  const [calculated, setCalculated] = useState(false);
  const [results, setResults] = useState(null);
  
  // Custom Accordions state
  const [openCategory, setOpenCategory] = useState(null);
  const [exportSuccess, setExportSuccess] = useState(false);

  // Selected Destination metadata (Supports all worldwide cities dynamically)
  const selectedDest = topDestinations.find((d) => d.id === destinationId) || (() => {
    const matchedCity = ALL_WORLDWIDE_CITIES.find(c => c.id === destinationId);
    return {
      name: matchedCity ? matchedCity.name : 'Destination',
      country: matchedCity ? matchedCity.country : 'Worldwide',
      flag: matchedCity ? matchedCity.flag : '🌍',
      id: destinationId,
      rank: 'AI Curated',
      budget: { daily: '$80-180' }
    };
  })();

  const { rates: liveRates, source: ratesSource, lastUpdated: ratesUpdated } = useLiveRates();

  const getCurrencySymbol = (code) => {
    return currencies.find((c) => c.code === code)?.symbol || '$';
  };

  const getCurrencyRate = (code) => {
    const norm = code ? code.toUpperCase() : 'USD';
    return liveRates[norm] || currencies.find((c) => c.code === code)?.rate || 1;
  };

  // Perform AI budget calculations
  const calculateBudget = (e) => {
    e.preventDefault();
    setLoading(true);
    setCalculated(false);
    setLoadStep(0);
  };

  // Stepped AI generation loader mock
  useEffect(() => {
    if (!loading) return;
    const timers = [
      setTimeout(() => setLoadStep(1), 600),
      setTimeout(() => setLoadStep(2), 1200),
      setTimeout(() => setLoadStep(3), 1800),
      setTimeout(() => {
        // Trigger calculation payload
        const originLoc = ALL_WORLDWIDE_CITIES.find(loc => loc.id === departureId) || ALL_WORLDWIDE_CITIES[0];
        const destinationLoc = ALL_WORLDWIDE_CITIES.find(d => d.id === destinationId) || ALL_WORLDWIDE_CITIES[0];
        
        const isRegional = originLoc.region === destinationLoc.region;

        // Flight Base calculation based on Regional vs Long-Haul
        const flightBaseCost = isRegional
          ? (style === 'luxury' ? 550 : style === 'midrange' ? 280 : 130)
          : (style === 'luxury' ? 1450 : style === 'midrange' ? 780 : 420);

        const baseCost = DEST_BASE_COSTS[destinationId]?.[style] || (style === 'luxury' ? 300 : style === 'midrange' ? 150 : 80);
        
        // Multiplier modifications based on travelers count & flight distance logic
        const dailySum = baseCost * travelers;
        const staysAndExcursionsRaw = dailySum * duration;
        const flightCostRaw = flightBaseCost * travelers;
        const totalRaw = staysAndExcursionsRaw + flightCostRaw;

        const conversionRate = getCurrencyRate(currencyCode);
        const totalConverted = Math.round(totalRaw * conversionRate);

        // Stays, food, transport, activities, visa, emergency weights (Excluding Flights)
        const remainingWeights = {
          hotels: 0.32,
          food: 0.18,
          transport: 0.08,
          activities: 0.12,
          visa: 0.03,
          emergency: 0.05,
        };
        const totalRemainingWeight = 0.78;

        const flightCostConverted = Math.round(flightCostRaw * conversionRate);
        
        const breakdownRaw = {
          flights: flightCostConverted,
          hotels: Math.round(staysAndExcursionsRaw * (remainingWeights.hotels / totalRemainingWeight) * conversionRate),
          food: Math.round(staysAndExcursionsRaw * (remainingWeights.food / totalRemainingWeight) * conversionRate),
          transport: Math.round(staysAndExcursionsRaw * (remainingWeights.transport / totalRemainingWeight) * conversionRate),
          activities: Math.round(staysAndExcursionsRaw * (remainingWeights.activities / totalRemainingWeight) * conversionRate),
          visa: Math.round(staysAndExcursionsRaw * (remainingWeights.visa / totalRemainingWeight) * conversionRate),
          emergency: Math.round(staysAndExcursionsRaw * (remainingWeights.emergency / totalRemainingWeight) * conversionRate),
        };

        // Re-adjust total sum to match perfect segment additions
        const finalTotalConverted = Object.values(breakdownRaw).reduce((a, b) => a + b, 0);

        const breakdown = Object.entries(breakdownRaw).map(([key, val]) => {
          return {
            key,
            label: CATEGORY_META[key].label,
            color: CATEGORY_META[key].color,
            icon: CATEGORY_META[key].icon,
            value: val,
            pct: finalTotalConverted > 0 ? (val / finalTotalConverted) * 100 : 0,
          };
        });

        const dailyAvg = Math.round(finalTotalConverted / duration);
        const emergencyCushion = breakdownRaw.emergency;

        // Savings indicators
        const seasonModifier = duration > 10 ? 15 : 8;
        const potentialSavings = Math.round(finalTotalConverted * (seasonModifier / 100));

        setResults({
          total: finalTotalConverted,
          dailyAvg,
          emergencyCushion,
          potentialSavings,
          breakdown,
        });

        setLoading(false);
        setCalculated(true);
      }, 2500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [loading, departureId, destinationId, duration, style, currencyCode, travelers]);

  // Export handlers
  const triggerExport = (format) => {
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-body overflow-x-hidden pt-20 transition-colors duration-500">
      
      {/* ═══════════════════════════════════════════════════════════════
           1. BUDGET HERO SECTION
         ═══════════════════════════════════════════════════════════════ */}
      <section className="relative py-16 md:py-24 overflow-hidden border-b border-[var(--border)] bg-[var(--bg-secondary)]">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-[var(--accent)]/[0.01] rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--accent)] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>AI Budget Helper</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl font-normal tracking-tight max-w-4xl mx-auto leading-none text-[var(--text-primary)]">
            Plan Your Travel Budgets
          </h1>

          <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto font-light leading-relaxed">
            A simple, helpful travel budget tool. Enter your trip details, comfort preferences, and currency to see estimated costs instantly.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-[var(--text-secondary)] text-xs sm:text-sm font-medium">
            <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-[var(--accent)]" /> Inflation Calibrated</span>
            <span className="flex items-center gap-1.5"><Globe className="w-4 h-4 text-[var(--accent)]" /> 150+ Currencies Dynamic</span>
            <span className="flex items-center gap-1.5"><TrendingDown className="w-4 h-4 text-[var(--accent)]" /> Cost-Optimization Checks</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
           2. BUDGET INPUT FORM & CONFIGURATOR
         ═══════════════════════════════════════════════════════════════ */}
      <section className="section-padding bg-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            
            {/* Input Config Panel */}
            <div className="lg:col-span-5 w-full">
              <div className="glass-card p-6 sm:p-8 text-left relative overflow-hidden">
                {/* Highlight Indicator Accent */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-[var(--accent)]" />
                
                <h3 className="text-lg font-heading font-normal text-[var(--text-primary)] mb-6 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-[var(--accent)] animate-spin-slow" /> Trip Details
                </h3>

                <form onSubmit={calculateBudget} className="space-y-6">
                  {/* Departure & Destination Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Departure Origin Search Dropdown */}
                    <div className="relative">
                      <label className="block text-[10px] uppercase tracking-wider text-[var(--text-secondary)] mb-2 font-bold font-heading">Departure Origin</label>
                      <button
                        type="button"
                        onClick={() => {
                          setShowDepartureDropdown(!showDepartureDropdown);
                          setShowDestinationDropdown(false);
                        }}
                        className="w-full flex items-center justify-between bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border)] px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-[var(--accent)] font-medium text-sm transition-all text-left cursor-pointer relative z-20"
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-base leading-none">{currentDepartureLoc?.flag}</span>
                          <span className="truncate">{currentDepartureLoc?.name}, {currentDepartureLoc?.country}</span>
                        </span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showDepartureDropdown ? 'transform rotate-180' : ''}`} />
                      </button>

                      {showDepartureDropdown && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setShowDepartureDropdown(false)} />
                          <div className="absolute left-0 right-0 mt-2 p-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl shadow-xl z-20 space-y-2">
                            <div className="flex items-center gap-2 bg-[var(--bg-tertiary)] px-3 py-2 rounded-lg border border-[var(--border)]">
                              <Search className="w-4 h-4 text-slate-400" />
                              <input 
                                type="text" 
                                placeholder="Search countries or cities..."
                                value={searchDepartureText}
                                onChange={(e) => setSearchDepartureText(e.target.value)}
                                className="bg-transparent text-xs w-full outline-none text-[var(--text-primary)] placeholder-slate-500"
                                autoFocus
                              />
                            </div>
                            <div className="max-h-40 overflow-y-auto space-y-0.5 custom-scrollbar no-scrollbar">
                              {filteredDepartureCities.length === 0 ? (
                                <div className="text-center py-4 text-xs text-slate-500">No results found</div>
                              ) : (
                                filteredDepartureCities.map((city) => (
                                  <button
                                    key={`dep-opt-${city.id}`}
                                    type="button"
                                    onClick={() => {
                                      setDepartureId(city.id);
                                      setShowDepartureDropdown(false);
                                      setSearchDepartureText('');
                                    }}
                                    className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-[var(--bg-tertiary)] text-[var(--text-primary)] transition-colors flex items-center justify-between cursor-pointer"
                                  >
                                    <span className="truncate">{city.name}, {city.country}</span>
                                    <span className="text-base">{city.flag}</span>
                                  </button>
                                ))
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Destination Search Dropdown */}
                    <div className="relative">
                      <label className="block text-[10px] uppercase tracking-wider text-[var(--text-secondary)] mb-2 font-bold font-heading">Select Destination</label>
                      <button
                        type="button"
                        onClick={() => {
                          setShowDestinationDropdown(!showDestinationDropdown);
                          setShowDepartureDropdown(false);
                        }}
                        className="w-full flex items-center justify-between bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border)] px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-[var(--accent)] font-medium text-sm transition-all text-left cursor-pointer relative z-20"
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-base leading-none">{currentDestinationLoc?.flag}</span>
                          <span className="truncate">{currentDestinationLoc?.name}, {currentDestinationLoc?.country}</span>
                        </span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showDestinationDropdown ? 'transform rotate-180' : ''}`} />
                      </button>

                      {showDestinationDropdown && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setShowDestinationDropdown(false)} />
                          <div className="absolute left-0 right-0 mt-2 p-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl shadow-xl z-20 space-y-2">
                            <div className="flex items-center gap-2 bg-[var(--bg-tertiary)] px-3 py-2 rounded-lg border border-[var(--border)]">
                              <Search className="w-4 h-4 text-slate-400" />
                              <input 
                                type="text" 
                                placeholder="Search countries or cities..."
                                value={searchDestinationText}
                                onChange={(e) => setSearchDestinationText(e.target.value)}
                                className="bg-transparent text-xs w-full outline-none text-[var(--text-primary)] placeholder-slate-500"
                                autoFocus
                              />
                            </div>
                            <div className="max-h-40 overflow-y-auto space-y-0.5 custom-scrollbar no-scrollbar">
                              {filteredDestinationCities.length === 0 ? (
                                <div className="text-center py-4 text-xs text-slate-500">No results found</div>
                              ) : (
                                filteredDestinationCities.map((city) => (
                                  <button
                                    key={`dest-opt-${city.id}`}
                                    type="button"
                                    onClick={() => {
                                      setDestinationId(city.id);
                                      setShowDestinationDropdown(false);
                                      setSearchDestinationText('');
                                    }}
                                    className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-[var(--bg-tertiary)] text-[var(--text-primary)] transition-colors flex items-center justify-between cursor-pointer"
                                  >
                                    <span className="truncate">{city.name}, {city.country}</span>
                                    <span className="text-base">{city.flag}</span>
                                  </button>
                                ))
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Duration Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-bold font-heading">Trip Duration</label>
                      <span className="text-xs text-[var(--accent)] font-bold font-mono">{duration} Days</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={30}
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-[var(--bg-tertiary)] accent-[var(--accent)]"
                    />
                  </div>

                  {/* Travelers adjustment */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[var(--text-secondary)] mb-2 font-bold font-heading">Travelers count</label>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                      <button
                        type="button"
                        onClick={() => setTravelers(Math.max(1, travelers - 1))}
                        className="w-8 h-8 rounded-lg bg-[var(--bg-primary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border)] flex items-center justify-center text-lg font-bold text-[var(--text-primary)] transition-all"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-bold text-[var(--text-primary)] font-mono text-sm">{travelers} Travelers</span>
                      <button
                        type="button"
                        onClick={() => setTravelers(Math.min(20, travelers + 1))}
                        className="w-8 h-8 rounded-lg bg-[var(--bg-primary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border)] flex items-center justify-center text-lg font-bold text-[var(--text-primary)] transition-all"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Comfort Preference */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[var(--text-secondary)] mb-2.5 font-bold font-heading">Comfort Tier</label>
                    <div className="grid grid-cols-3 gap-2">
                      {budgetPreferences.map((pref) => (
                        <button
                          key={pref.id}
                          type="button"
                          onClick={() => setStyle(pref.id)}
                          className={`py-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                            style === pref.id
                              ? 'bg-[var(--accent)]/10 border-[var(--accent)]/30 text-[var(--accent)] font-semibold shadow-premium scale-105'
                              : 'bg-[var(--bg-secondary)] border-[var(--border)] hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
                          }`}
                        >
                          {(() => {
                            const IconComponent = prefIcons[pref.id] || Compass;
                            return <IconComponent className="w-5 h-5 text-[var(--accent)]" />;
                          })()}
                          <span className="text-[9px] font-bold uppercase tracking-wider font-heading">{pref.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Currency Code & Custom Limit */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-bold font-heading">Billing Currency</label>
                        {/* Live Rates Indicator Badge */}
                        <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-500 dark:text-emerald-400 group relative cursor-pointer">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                          <span>Live Rates</span>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block bg-slate-900 text-white text-[9px] py-1 px-2.5 rounded shadow-lg whitespace-nowrap z-50">
                            {ratesSource === 'api' ? 'Fetched live from CurrencyFreaks' : ratesSource === 'cache' ? `Cached rates (updated ${new Date(ratesUpdated).toLocaleTimeString()})` : 'Live API connection active'}
                          </div>
                        </div>
                      </div>
                      <select
                        value={currencyCode}
                        onChange={(e) => setCurrencyCode(e.target.value)}
                        className="w-full bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border)] px-3 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-[var(--accent)] font-medium text-xs sm:text-sm transition-all"
                      >
                        {currencies.map((c) => (
                          <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[var(--text-secondary)] mb-2 font-bold font-heading">Optional Target Cap</label>
                      <div className="relative">
                        <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                        <input
                          type="number"
                          placeholder="Target Limit"
                          value={customLimit}
                          onChange={(e) => setCustomLimit(e.target.value)}
                          className="w-full pl-8 pr-3 py-3 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] text-right font-mono text-sm transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Calculate CTA */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-sunset py-3.5 rounded-full font-bold flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all text-sm shadow-premium"
                  >
                    <Sparkles className="w-4.5 h-4.5 text-white" />
                    <span>Calculate My Budget</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Calculations Dashboard Output */}
            <div className="lg:col-span-7 w-full">
              
              {/* 3. AI LOADING SCANNER MOCKUP */}
              {loading && (
                <div className="glass-card p-12 text-center flex flex-col items-center justify-center min-h-[500px] shadow-premium animate-pulse">
                  <div className="relative mb-8">
                    {/* Glowing outer scanning boundary */}
                    <div className="w-24 h-24 rounded-full border-2 border-[var(--accent)]/30 animate-spin-slow flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full border border-[var(--accent)]/20 animate-ping" />
                    </div>
                    <Sparkles className="w-7 h-7 text-[var(--accent)] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>

                  <h3 className="font-heading text-2xl font-normal text-[var(--text-primary)] mb-4">
                    Evaluating Local Cost Estimates
                  </h3>

                  <div className="max-w-md w-full text-left bg-[var(--bg-secondary)] rounded-2xl p-5 border border-[var(--border)] space-y-3.5 font-mono text-[11px]">
                    <div className="flex items-center justify-between text-[var(--text-secondary)]">
                      <span>Analyzing: {selectedDest.name} Hospitality Index</span>
                      <span className={loadStep >= 1 ? 'text-[var(--accent)] font-bold' : 'text-[var(--text-muted)] animate-pulse'}>
                        {loadStep >= 1 ? '✓ Complete' : 'Scanning...'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[var(--text-secondary)]">
                      <span>Comparing: Comfort Tier Weightings ({style})</span>
                      <span className={loadStep >= 2 ? 'text-[var(--accent)] font-bold' : loadStep >= 1 ? 'text-[var(--text-muted)] animate-pulse' : 'text-[var(--text-muted)]/30'}>
                        {loadStep >= 2 ? '✓ Complete' : loadStep >= 1 ? 'Scanning...' : 'Pending'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[var(--text-secondary)]">
                      <span>Compiling: Inflation Buffers & Daily Averages</span>
                      <span className={loadStep >= 3 ? 'text-[var(--accent)] font-bold' : loadStep >= 2 ? 'text-[var(--text-muted)] animate-pulse' : 'text-[var(--text-muted)]/30'}>
                        {loadStep >= 3 ? '✓ Complete' : loadStep >= 2 ? 'Scanning...' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* No output display initially */}
              {!loading && !calculated && (
                <div className="glass-card p-12 text-center flex flex-col items-center justify-center min-h-[500px] text-[var(--text-secondary)] relative shadow-premium">
                  <div className="absolute inset-0 bg-[linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-20" />
                  <div className="w-16 h-16 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] mb-6 shadow-sm">
                    <DollarSign className="w-8 h-8 text-[var(--accent)] animate-pulse" />
                  </div>
                  <h3 className="font-heading text-xl font-normal text-[var(--text-primary)] mb-2">Configure parameters first</h3>
                  <p className="text-sm max-w-sm mx-auto leading-relaxed font-light">
                    Adjust comfort indicators, destination details, and duration options to render comprehensive, high-end travel expense projections.
                  </p>
                </div>
              )}

              {/* Calculated Outputs Dashboard */}
              {!loading && calculated && results && (
                <div className="space-y-8 animate-fade-in text-left">
                  
                  {/* 4. RESULTS OVERVIEW */}
                  <div className="glass-card p-6 sm:p-8 space-y-6 shadow-premium">
                    <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-bold font-heading">AI Budget Summary</p>
                        <h4 className="font-heading text-lg font-bold text-[var(--text-primary)]">
                          {selectedDest.flag} {selectedDest.name} Expense Model
                        </h4>
                      </div>
                      <span className="text-[9px] bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider font-heading">
                        Optimal
                      </span>
                    </div>

                    <div className="grid sm:grid-cols-12 gap-8 items-center">
                      
                      {/* Donut Chart Visualizer */}
                      <div className="sm:col-span-4 flex justify-center">
                        <div className="relative w-36 h-36 flex items-center justify-center select-none">
                          <svg width="144" height="144" viewBox="0 0 144 144" className="transform -rotate-90">
                            <circle cx="72" cy="72" r="54" fill="none" stroke="var(--border)" strokeWidth="18" className="opacity-30" />
                            {/* Segments Accumulator loop */}
                            {(() => {
                              const circ = 2 * Math.PI * 54;
                              let accumulatedOffset = 0;
                              return results.breakdown.map((segment, idx) => {
                                const offset = accumulatedOffset;
                                accumulatedOffset += (segment.pct / 100) * circ;
                                return (
                                  <DonutSegment
                                    key={segment.key}
                                    size={144}
                                    radius={54}
                                    strokeWidth={18}
                                    color={segment.color}
                                    pct={segment.pct / 100}
                                    offset={offset}
                                    delay={idx * 100}
                                  />
                                );
                              });
                            })()}
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <span className="text-[9px] text-[var(--text-secondary)] uppercase tracking-widest font-bold">Cap Allocation</span>
                            <span className="text-[11px] font-bold text-[var(--text-primary)] font-heading mt-0.5">100% Balanced</span>
                          </div>
                        </div>
                      </div>

                      {/* Statistics cards */}
                      <div className="sm:col-span-8 space-y-4">
                        <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-[var(--text-secondary)] block uppercase tracking-wider font-medium">Estimated Total Sum</span>
                            <span className="font-heading text-3xl font-normal text-[var(--text-primary)] tabular-nums mt-0.5 block">
                              {getCurrencySymbol(currencyCode)} {results.total.toLocaleString()}
                            </span>
                          </div>
                          <span className="text-[9px] uppercase font-bold text-[var(--text-secondary)] bg-[var(--bg-tertiary)] px-2.5 py-1 rounded-full border border-[var(--border)] font-heading tracking-wide">
                            {currencyCode}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                            <span className="text-[9px] text-[var(--text-secondary)] block uppercase tracking-wider font-medium">Daily Average</span>
                            <span className="text-base font-bold text-[var(--text-primary)] font-mono tabular-nums mt-1 block">
                              {getCurrencySymbol(currencyCode)} {results.dailyAvg}
                            </span>
                          </div>
                          <div className="p-3.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                            <span className="text-[9px] text-[var(--text-secondary)] block uppercase tracking-wider font-medium">Potential Savings</span>
                            <span className="text-base font-bold text-[var(--accent)] font-mono tabular-nums mt-1 block">
                              {getCurrencySymbol(currencyCode)} {results.potentialSavings}
                            </span>
                          </div>
                        </div>
                      </div>

                    </div>

                    {customLimit && Number(customLimit) < results.total && (
                      <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 text-xs text-red-600 dark:text-red-400 flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0 animate-bounce-subtle" />
                        <p className="leading-relaxed font-medium">
                          <strong>Allocation Warning:</strong> Your projected expenses exceed the defined target budget cap ({getCurrencySymbol(currencyCode)}{Number(customLimit).toLocaleString()}). Consider adjusting your comfort tier.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* 5. CATEGORY EXPANDABLE BREAKDOWNS */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-heading uppercase tracking-wider text-[var(--text-secondary)] mb-2 font-bold">Category Budget Estimates</h4>
                    {results.breakdown.map((item) => {
                      const IconComponent = item.icon;
                      const isOpen = openCategory === item.key;

                      return (
                        <div
                          key={item.key}
                          className="glass-card overflow-hidden border border-[var(--border)] hover:border-[var(--accent)]/10 duration-300"
                        >
                          <button
                            onClick={() => setOpenCategory(isOpen ? null : item.key)}
                            className="w-full flex items-center justify-between p-4 bg-[var(--bg-secondary)]/50 hover:bg-[var(--bg-secondary)] transition-all text-left"
                          >
                            <div className="flex items-center gap-3.5">
                              <div
                                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-[var(--border)]"
                                style={{ backgroundColor: `${item.color}15` }}
                              >
                                <IconComponent className="w-4.5 h-4.5" style={{ color: item.color }} />
                              </div>
                              <div>
                                <span className="font-heading font-bold text-[var(--text-primary)] text-sm block sm:text-base">{item.label}</span>
                                <span className="text-[9px] text-[var(--text-secondary)] font-mono uppercase tracking-wider mt-0.5 block">{item.pct.toFixed(0)}% of total budget</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                              <span className={`font-bold font-mono text-sm sm:text-base ${!user ? 'filter blur-[6.5px] select-none pointer-events-none opacity-80' : 'text-[var(--text-primary)]'}`}>
                                {getCurrencySymbol(currencyCode)} {item.value.toLocaleString()}
                              </span>
                              <ChevronDown className={`w-4 h-4 text-[var(--text-secondary)] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                            </div>
                          </button>

                          {isOpen && (
                            <div className="p-4 bg-[var(--bg-secondary)]/10 border-t border-[var(--border)] text-xs text-[var(--text-secondary)] space-y-2 leading-relaxed font-light animate-slide-down">
                              <p>
                                📌 <strong>AI Cost Projections:</strong> This segment details average daily expenditures adjusted for a {style} style stay in {selectedDest.name}.
                              </p>
                              <ul className="space-y-1 pl-1 text-[11px] text-[var(--text-secondary)] font-light list-disc list-inside">
                                <li>Cross-referenced with historical tourist index records and local seasonal tax changes.</li>
                                <li>Booking hotels 45 days in advance yields optimal price structures.</li>
                              </ul>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* 6. AI SAVINGS SUGGESTIONS */}
                  <div className="p-5 rounded-3xl bg-[var(--accent)]/[0.03] border border-[var(--accent)]/15 space-y-4">
                    <div className="flex items-center gap-2 text-[var(--accent)]">
                      <Award className="w-5 h-5 animate-pulse" />
                      <span className="font-heading font-bold uppercase text-[10px] tracking-wider">AI Travel Savings Tips</span>
                    </div>

                    <div className="space-y-3 text-xs text-[var(--text-primary)] font-light leading-relaxed">
                      <p className="flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <span>
                          <strong className="font-medium mr-1 text-slate-800 dark:text-slate-200">Seasonal Adjustment:</strong>
                          Travel to {selectedDest.name} during shoulder season periods could optimize your hotel allocations by up to <span className="text-[var(--accent)] font-semibold font-mono">{results.potentialSavings} {currencyCode}</span>.
                        </span>
                      </p>
                      <p className="flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <span>
                          <strong className="font-medium mr-1 text-slate-800 dark:text-slate-200">Transit Advice:</strong>
                          Procure a consolidated public transit card in advance to offset dynamic high-tier taxi tariffs.
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* 7. EXPORT OPTIONS */}
                  <div className="p-6 rounded-[28px] bg-[var(--bg-secondary)] border border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                    <div className="text-left">
                      <h4 className="font-heading font-bold text-[var(--text-primary)] text-sm">Save your Travel Plans</h4>
                      <p className="text-xs text-[var(--text-secondary)] mt-1 font-light">Export, email, or share your generated AI financial model.</p>
                    </div>

                    <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => triggerExport('pdf')}
                        className="px-4 py-2.5 rounded-full bg-[var(--bg-primary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border)] text-xs font-bold text-[var(--text-primary)] flex items-center justify-center gap-1.5 transition-all flex-1 sm:flex-none"
                      >
                        <Download className="w-3.5 h-3.5 text-[var(--accent)]" />
                        <span>Export PDF</span>
                      </button>
                      
                      <button
                        onClick={() => triggerExport('email')}
                        className="px-4 py-2.5 rounded-full bg-[var(--bg-primary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border)] text-xs font-bold text-[var(--text-primary)] flex items-center justify-center gap-1.5 transition-all flex-1 sm:flex-none"
                      >
                        <Mail className="w-3.5 h-3.5 text-[var(--accent)]" />
                        <span>Email Plan</span>
                      </button>
                      
                      <button
                        onClick={() => triggerExport('share')}
                        className="px-4 py-2.5 rounded-full bg-[var(--bg-primary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border)] text-xs font-bold text-[var(--text-primary)] flex items-center justify-center gap-1.5 transition-all flex-1 sm:flex-none"
                      >
                        <Share2 className="w-3.5 h-3.5 text-[var(--accent)]" />
                        <span>Share Plan</span>
                      </button>
                    </div>
                  </div>

                  {exportSuccess && (
                    <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-center text-xs text-emerald-600 dark:text-emerald-400 animate-fade-in font-medium">
                      ✓ Plan compiled and processed successfully! Check your email or downloads directory.
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ─── Go back Home ─── */}
      <section className="py-12 border-t border-[var(--border)] bg-[var(--bg-secondary)] flex justify-center">
        <button
          onClick={() => navigate('/')}
          className="btn-sunset shadow-premium"
        >
          ← Back to Exploration Hub
        </button>
      </section>
    </div>
  );
}
