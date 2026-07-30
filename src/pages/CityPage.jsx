import { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Shield, Star, Heart, CalendarDays, ArrowLeft, ChevronRight, Compass, HeartPulse, ShieldAlert, CloudSun, Map, Sparkles, DollarSign, HelpCircle } from 'lucide-react';
import { getCityBySlug } from '../utils/database';
import UmrahGuideCard from '../components/UmrahGuideCard';
import YouTubeTravelSection from '../components/YouTubeTravelSection';
import { updateEntitySEO, clearEntitySEO } from '../utils/seoHelper';
import { cityDatabase } from '../data/cityDatabase';
import { useGeoapifyTravel } from '../hooks/useGeoapifyTravel';
import { usePremiumImage } from '../utils/imageLookup';
import UnifiedWeatherDashboard from '../components/UnifiedWeatherDashboard';
import HospitalSection from '../components/HospitalSection';
import MapPanel from '../components/MapPanel';
import AttractionsGrid from '../components/AttractionsGrid';

// Look up exact or fallback coordinates for a city
function getCityCoordinates(cityName, countryName) {
  if (!cityName) return { lat: 33.6844, lng: 73.0479 }; // default to Islamabad

  const countryKey = (countryName || '').toLowerCase().replace(/ /g, '_');
  const countryCities = cityDatabase[countryKey] || [];
  const matched = countryCities.find(c => c.name.toLowerCase() === cityName.toLowerCase());
  
  if (matched) {
    return { lat: matched.lat, lng: matched.lng };
  }

  // Fallback: Generate deterministic coordinates based on the name hash
  let hash = 0;
  for (let i = 0; i < cityName.length; i++) {
    hash = cityName.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Map within reasonable boundaries
  const lat = 25.0 + Math.abs(hash % 15) + (Math.abs(hash % 100) / 100);
  const lng = 45.0 + Math.abs((hash >> 4) % 35) + (Math.abs((hash >> 8) % 100) / 100);
  return { lat, lng };
}

export default function CityPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [city, setCity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coords, setCoords] = useState(null);
  
  // Interactive UI state for map hotspots
  const [mapHotspot, setMapHotspot] = useState(null);
  
  // Saved and itinerary bookmarks states to bind with AttractionsGrid
  const [savedIds, setSavedIds] = useState([]);
  const [itineraryIds, setItineraryIds] = useState([]);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    async function load() {
      const data = await getCityBySlug(slug);
      if (active) {
        if (data) {
          setCity(data);
          const computedCoords = getCityCoordinates(data.name, data.country?.name);
          setCoords(computedCoords);
          updateEntitySEO('city', data);
        } else {
          setCity(null);
          setCoords(null);
        }
        setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
      clearEntitySEO();
    };
  }, [slug]);

  // Hook into the Geoapify API travel engine using the resolved city object
  const geoapifyDest = city ? { id: city.id, name: city.name, country: city.country?.name } : null;
  const {
    geoCoords,
    attractions: apiAttractions,
    hospitals,
    uiState,
    isBackgroundValidating,
    retryFetch,
    loadDetailsForPlace
  } = useGeoapifyTravel(geoapifyDest);

  // Fallback to static coordinates if the API didn't resolve them yet
  const activeCoords = geoCoords || coords;

  // Fetch a premium watermark-free landscape image
  const { imageUrl: heroImage } = usePremiumImage(city?.name, city?.country?.name);

  // Focus map view on specific coordinates (triggered from hospital/attraction cards)
  const focusOnMap = useCallback((lat, lng, name) => {
    if (window.destinationLeafletMap) {
      window.destinationLeafletMap.setView([lat, lng], 16, { animate: true, duration: 1 });
      
      // Look for marker to trigger popup
      if (window.destinationMapMarkers) {
        const marker = window.destinationMapMarkers.find(
          (m) => m.getLatLng().lat === lat && m.getLatLng().lng === lng
        );
        if (marker) marker.openPopup();
      }

      setMapHotspot({
        name,
        desc: `Locational marker scanned and active on coordinates [${lat.toFixed(4)}, ${lng.toFixed(4)}].`,
        type: 'Scanned Location',
        subway: 'Proximity: Near Road Link',
        airport: 'Coordinates Aligned'
      });

      // Scroll smoothly to map section
      const mapSection = document.getElementById('interactive-map-section');
      if (mapSection) {
        mapSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, []);

  const toggleSaveAttraction = (id) => {
    setSavedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleItineraryAttraction = (id) => {
    setItineraryIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[var(--bg-primary)] text-[var(--text-primary)] pt-32">
        <style>{`
          @keyframes loaderBarShift {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
          .animate-loader-bar {
            animation: loaderBarShift 1.5s infinite linear;
          }
        `}</style>
        <div className="max-w-md w-full text-center space-y-6 glass-card p-10 rounded-[32px] border border-[var(--border)] shadow-premium relative overflow-hidden flex flex-col items-center">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          <div className="relative w-20 h-20 flex items-center justify-center mb-2">
            <div className="absolute inset-0 w-full h-full rounded-full border border-dashed border-[var(--accent)]/30 animate-spin-slow" />
            <div className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] rounded-full border border-dotted border-[var(--accent)]/15 animate-spin-reverse-slow" />
            <div className="absolute w-12 h-12 rounded-full bg-[var(--accent)]/10 blur-xl animate-pulse" />
            <Compass className="w-8 h-8 text-[var(--accent)] animate-pulse" />
          </div>

          <div className="space-y-2">
            <h2 className="font-heading text-xl font-bold tracking-tight text-[var(--text-primary)]">
              Loading City Guide...
            </h2>
            <p className="text-xs text-[var(--text-secondary)] font-light max-w-[280px] mx-auto leading-relaxed">
              Retrieving destination analytics and climate reports...
            </p>
          </div>

          <div className="w-36 h-[3px] bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-full overflow-hidden relative">
            <div className="absolute top-0 bottom-0 left-0 w-1/2 bg-gradient-to-r from-[var(--accent)]/40 to-[var(--accent)] rounded-full animate-loader-bar" />
          </div>
        </div>
      </div>
    );
  }

  if (!city) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[var(--bg-primary)] text-[var(--text-primary)] pt-32">
        <div className="max-w-md text-center space-y-6 bg-white dark:bg-[#071125] p-10 rounded-[32px] border border-slate-100 dark:border-white/[0.04] shadow-premium">
          <span className="text-5xl block animate-bounce">🏙️</span>
          <h2 className="font-heading text-2xl font-bold">City Not Found</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-light">
            We couldn't locate a city with the slug <code className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded font-mono text-xs text-rose-500">{slug}</code>.
          </p>
          <button
            onClick={() => navigate('/destinations')}
            className="btn-primary w-full inline-flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Directory
          </button>
        </div>
      </div>
    );
  }

  // Pre-configured hotspots for vector map guidelines
  const mockVectorHotspots = [
    { id: 1, name: `${city.name} Central Plaza`, desc: 'The bustling cultural heartbeat, shopping complexes and local food courts.', x: '30%', y: '40%' },
    { id: 2, name: 'Heritage Museum Quarter', desc: 'Museum exhibits, historical memorials, and tourist information desk.', x: '60%', y: '35%' },
    { id: 3, name: 'Greenway Promenade', desc: 'Botanical gardens, leisure walking tracks, and organic outdoor dining.', x: '70%', y: '65%' }
  ];

  return (
    <div className="min-h-screen neumorphic-bg pt-28 pb-24 overflow-x-hidden relative">
      {/* Background subtle grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.01)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.002)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.002)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0 opacity-70" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-slate-400 font-medium">
          <Link to="/" className="hover:text-[var(--accent)] transition-colors">Home</Link>
          <ChevronRight size={12} className="text-slate-500" />
          <Link to="/destinations" className="hover:text-[var(--accent)] transition-colors">Destinations</Link>
          {city.country && (
            <>
              <ChevronRight size={12} className="text-slate-500" />
              <Link to={`/country/${city.country.slug}`} className="hover:text-[var(--accent)] transition-colors">
                {city.country.flag} {city.country.name}
              </Link>
            </>
          )}
          {city.state && (
            <>
              <ChevronRight size={12} className="text-slate-500" />
              <Link to={`/state/${city.state.slug}`} className="hover:text-[var(--accent)] transition-colors">
                {city.state.name}
              </Link>
            </>
          )}
          <ChevronRight size={12} className="text-slate-500" />
          <span className="text-slate-600 dark:text-slate-350">{city.name}</span>
        </nav>

        {/* Hero Banner Section */}
        <div className="relative h-[380px] rounded-[36px] overflow-hidden shadow-premium group">
          <img
            src={heroImage}
            alt={city.name}
            className="w-full h-full object-cover transition-transform duration-[4000ms] ease-out scale-102 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
          
          <div className="absolute bottom-10 left-10 right-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-left">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white/80 text-xs font-bold uppercase tracking-widest">
                <span>{city.country?.flag}</span>
                <Link to={`/country/${city.country?.slug}`} className="hover:underline">{city.countryName}</Link>
                {city.stateName && (
                  <>
                    <span>•</span>
                    <Link to={`/state/${city.state?.slug}`} className="hover:underline">{city.stateName}</Link>
                  </>
                )}
              </div>
              <h1 className="font-heading text-4xl sm:text-6xl font-black text-white leading-none tracking-tight">
                {city.name}
              </h1>
              <p className="text-white/70 text-xs sm:text-sm font-light max-w-xl leading-relaxed">
                Discover the best times to visit, local safety conditions, and nearby healthcare facilities in {city.name}. Plan day-by-day itineraries with our automated AI assistant.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/25 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm">
                <Compass size={14} className="text-[var(--accent)]" />
                Lat: {activeCoords?.lat.toFixed(4)}
              </span>
              <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/25 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm">
                <Compass size={14} className="text-[var(--accent)]" />
                Lng: {activeCoords?.lng.toFixed(4)}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Background Alert if validating in background */}
        {isBackgroundValidating && (
          <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-[var(--accent)] flex items-center gap-2.5 animate-pulse text-left">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
            <span>Scanning real-time regional data from Geoapify in the background...</span>
          </div>
        )}

        {/* Planning Your Umrah section for Makkah */}
        {slug === 'mecca' && (
          <section className="animate-fade-in space-y-8 p-6 sm:p-8 rounded-[36px] border border-amber-500/15 dark:border-amber-500/10 bg-amber-500/5 dark:bg-amber-500/[0.005] relative overflow-hidden text-left">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-amber-500/[0.03] filter blur-3xl pointer-events-none" />
            
            <div className="space-y-1.5 relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase tracking-widest select-none animate-pulse">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Planning Your Umrah</span>
              </span>
              <h2 className="font-heading text-2xl font-extrabold text-luxury-primary dark:text-white">
                Umrah Pilgrimage Guide & Planner
              </h2>
              <p className="text-xs text-slate-550 dark:text-slate-400 font-light leading-relaxed font-body">
                Everything you need to plan your sacred rituals, calculate expenses, and prepare for your Ziyarat journeys.
              </p>
            </div>

            {/* Grid for Umrah guide card & info */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
              {/* Card Col */}
              <div className="lg:col-span-5 flex">
                <UmrahGuideCard />
              </div>

              {/* Tools & Details Col */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Mini Budget Estimator */}
                <div className="p-5 rounded-2xl neumorphic-inset space-y-3">
                  <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-500" />
                    Interactive Budget Estimate
                  </h4>
                  <p className="text-2xs sm:text-xs text-slate-550 dark:text-slate-400 font-light leading-relaxed font-body">
                    A basic 7-day budget for 2 travelers averages **$1,940** (Economy flights, standard hotel). Tap below to adjust parameters like hotel tiers, flights, and transfers.
                  </p>
                  <Link to="/pilgrimage/umrah#budget-calculator" className="inline-flex items-center gap-1 text-[10px] font-bold text-[var(--accent)] uppercase tracking-wider hover:underline">
                    <span>Open Budget Calculator</span>
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>

                {/* Itinerary Preview */}
                <div className="p-5 rounded-2xl neumorphic-inset space-y-3">
                  <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-indigo-500" />
                    Recommended Pilgrimage Itinerary
                  </h4>
                  <div className="border-l-2 border-slate-200 dark:border-white/10 pl-4 space-y-3">
                    <div className="text-left">
                      <span className="text-[9px] font-bold uppercase text-[var(--accent)] block">Day 1: Ihram & Arrival</span>
                      <span className="text-[11px] text-slate-600 dark:text-slate-350 leading-relaxed font-body">Arrive in Makkah via high-speed Haramain Train and complete Tawaf and Sa'i.</span>
                    </div>
                    <div className="text-left">
                      <span className="text-[9px] font-bold uppercase text-[var(--accent)] block">Day 2: Haram Worship</span>
                      <span className="text-[11px] text-slate-600 dark:text-slate-350 leading-relaxed font-body">Focus on prayers, voluntary Tawafs, and reflections inside Masjid al-Haram.</span>
                    </div>
                    <div className="text-left">
                      <span className="text-[9px] font-bold uppercase text-[var(--accent)] block">Day 3: Cave of Hira Ziyarat</span>
                      <span className="text-[11px] text-slate-600 dark:text-slate-350 leading-relaxed font-body">Early morning spiritual climb to Jabal al-Nour to view the Cave of Hira.</span>
                    </div>
                  </div>
                  <Link to="/pilgrimage/umrah#itinerary-generator" className="inline-flex items-center gap-1 text-[10px] font-bold text-[var(--accent)] uppercase tracking-wider hover:underline">
                    <span>View Full 7/10 Days Itinerary</span>
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>

                {/* Ziyarat Guide info */}
                <div className="p-5 rounded-2xl neumorphic-inset space-y-3">
                  <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Compass className="w-4 h-4 text-emerald-500" />
                    Makkah Ziyarat Directory
                  </h4>
                  <p className="text-2xs sm:text-xs text-slate-550 dark:text-slate-400 font-light leading-relaxed font-body">
                    Locate coordinates and cultural safety tips for **Cave of Hira**, **Jannat al-Mualla**, **Maqam Ibrahim**, and **Mount Thawr**.
                  </p>
                  <Link to="/pilgrimage/umrah#ziyarat-places" className="inline-flex items-center gap-1 text-[10px] font-bold text-[var(--accent)] uppercase tracking-wider hover:underline">
                    <span>Explore Ziyarat Sights</span>
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>

              </div>
            </div>
          </section>
        )}

        {/* Continue Your Spiritual Journey section for Madinah */}
        {slug === 'medina' && (
          <section className="animate-fade-in space-y-8 p-6 sm:p-8 rounded-[36px] border border-amber-500/15 dark:border-amber-500/10 bg-amber-500/5 dark:bg-amber-500/[0.005] relative overflow-hidden text-left">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-amber-500/[0.03] filter blur-3xl pointer-events-none" />
            
            <div className="space-y-1.5 relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase tracking-widest select-none animate-pulse">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Continue Your Spiritual Journey</span>
              </span>
              <h2 className="font-heading text-2xl font-extrabold text-luxury-primary dark:text-white">
                Madinah Pilgrimage & Heritage Guide
              </h2>
              <p className="text-xs text-slate-550 dark:text-slate-400 font-light leading-relaxed font-body">
                Plan your visits to the Prophet’s sanctuary (Al-Masjid an-Nabawi), schedule Rawdah entry slots, and explore historic battle sites.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
              {/* Card Col */}
              <div className="lg:col-span-5 flex">
                <UmrahGuideCard />
              </div>

              {/* Tools & Details Col */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Nusuk Rawdah Permit Module */}
                <div className="p-5 rounded-2xl neumorphic-inset space-y-3">
                  <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-emerald-500" />
                    Rawdah Permit Scheduling (Nusuk App)
                  </h4>
                  <p className="text-2xs sm:text-xs text-slate-550 dark:text-slate-400 font-light leading-relaxed font-body">
                    A permit on the official **Nusuk App** is legally mandatory to visit the sacred Rawdah garden. Slots open weekly. Ensure you register and reserve your slot at least 3-4 weeks in advance of your transit.
                  </p>
                  <Link to="/pilgrimage/umrah#faqs-section" className="inline-flex items-center gap-1 text-[10px] font-bold text-[var(--accent)] uppercase tracking-wider hover:underline">
                    <span>Read Nusuk Setup FAQ</span>
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>

                {/* Madinah Ziyarat landmarks */}
                <div className="p-5 rounded-2xl neumorphic-inset space-y-3">
                  <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Compass className="w-4 h-4 text-indigo-500" />
                    Madinah Holy Landmarks
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-650 dark:text-slate-350">
                    <div className="p-3 bg-slate-50 dark:bg-white/[0.01] rounded-xl">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">🕌 Quba Mosque</span>
                      <span className="font-light block">The first mosque built in Islamic history; praying 2 rak’ahs equals an Umrah reward.</span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-white/[0.01] rounded-xl">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">🏔️ Mount Uhud</span>
                      <span className="font-light block">Historic mountain and battlefield site, hosting graves of 70 early martyrs.</span>
                    </div>
                  </div>
                  <Link to="/pilgrimage/umrah#ziyarat-places" className="inline-flex items-center gap-1 text-[10px] font-bold text-[var(--accent)] uppercase tracking-wider hover:underline">
                    <span>Explore Ziyarat Guides</span>
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>

              </div>
            </div>
          </section>
        )}

        {/* ─── SECTION 1: Sightseeing & Sights (Horizontal scroll landscape cards) ─── */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--accent)] text-xs font-semibold uppercase tracking-wider">
              <Star className="w-3.5 h-3.5" /> Featured Sights
            </span>
            <h2 className="section-title !m-0">Explore Local Sightseeing</h2>
          </div>
          
          <AttractionsGrid
            destination={city}
            attractions={apiAttractions}
            uiState={uiState}
            retryFetch={retryFetch}
            savedAttractionIds={savedIds}
            itineraryAttractionIds={itineraryIds}
            toggleSaveAttraction={toggleSaveAttraction}
            toggleItineraryAttraction={toggleItineraryAttraction}
            focusOnMap={focusOnMap}
            isBackgroundValidating={isBackgroundValidating}
          />
        </section>

        {/* ─── SECTION 2: Interactive Map Panel ─── */}
        <section id="interactive-map-section" className="pt-8 border-t border-slate-100 dark:border-white/[0.04]">
          <MapPanel
            geoCoords={activeCoords}
            destination={city}
            attractions={apiAttractions}
            hospitals={hospitals}
            mapHotspot={mapHotspot}
            setMapHotspot={setMapHotspot}
            mapHotspots={mockVectorHotspots}
          />
        </section>

        {/* ─── SECTION 3: Hospital & Medical (Health safety card layout) ─── */}
        <section className="pt-8 border-t border-slate-100 dark:border-white/[0.04] space-y-6">
          <div className="flex items-center gap-3 text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] text-emerald-500 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <HeartPulse className="w-3.5 h-3.5" /> Health & Safety
            </span>
            <h2 className="section-title !m-0">Nearby Medical Facilities</h2>
          </div>
          
          <HospitalSection
            hospitals={hospitals}
            uiState={uiState}
            retryFetch={retryFetch}
            focusOnMap={focusOnMap}
            onExpand={loadDetailsForPlace}
          />
        </section>

        {/* ─── SECTION 4: Weather Dashboard Forecast ─── */}
        <section className="pt-8 border-t border-slate-100 dark:border-white/[0.04] space-y-6">
          <div className="flex items-center gap-3 text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] text-amber-500 text-xs font-semibold uppercase tracking-wider">
              <CloudSun className="w-3.5 h-3.5" /> Weather Dashboard
            </span>
            <h2 className="section-title !m-0">Climate Forecast</h2>
          </div>
          
          <UnifiedWeatherDashboard
            lat={activeCoords?.lat}
            lon={activeCoords?.lng}
            city={city.name}
          />
        </section>

        {/* ─── SECTION 5: Nearby Directory Locations ─── */}
        {city.nearby && city.nearby.length > 0 && (
          <section className="pt-8 border-t border-slate-100 dark:border-white/[0.04] space-y-5">
            <div className="text-left space-y-1">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Regional Directory Links</span>
              <h3 className="font-heading text-xl font-bold text-luxury-primary dark:text-white">Nearby Travel Hubs</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {city.nearby.map((near) => (
                <Link
                  key={near.id}
                  to={`/city/${near.slug}`}
                  className="p-4 rounded-xl neumorphic-card text-left flex items-center justify-between group"
                >
                  <div className="space-y-0.5 truncate">
                    <span className="text-[9px] text-slate-400 block truncate">
                      {near.stateName || near.countryName}
                    </span>
                    <h5 className="font-heading font-bold text-xs text-luxury-primary dark:text-white truncate group-hover:text-[var(--accent)] transition-colors">
                      {near.name}
                    </h5>
                  </div>
                  <ChevronRight size={14} className="text-slate-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ─── YOUTUBE TRAVEL SECTION ─── */}
        <YouTubeTravelSection destination={city.name} />

        {/* ─── SECTION 6: Frequently Asked Questions (AEO & Voice Search Accordion) ─── */}
        <section className="pt-8 border-t border-slate-100 dark:border-white/[0.04] space-y-6">
          <div className="flex items-center gap-3 text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] text-indigo-500 text-xs font-semibold uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5" /> Factual Q&A
            </span>
            <h2 className="section-title !m-0">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto text-left">
            {[
              {
                q: `What is the estimated daily travel budget for ${city.name}?`,
                a: `The estimated daily budget for ${city.name} is approximately ${city.budget?.daily || '$150'} per day. This covers moderate accommodation, dining at local restaurants, public transit, and entry tickets to top sights.`
              },
              {
                q: `What is the safety index rating of ${city.name}?`,
                a: `${city.name} has a safety index rating of ${city.safety || 'Safe'}. We recommend that travelers follow standard local safety protocols, secure belongings in tourist areas, and keep emergency contact numbers saved.`
              },
              {
                q: `What is the best time of year to visit ${city.name}?`,
                a: `The best season to explore ${city.name} is generally during its peak travel season, which offers comfortable weather for sightseeing and outdoor events.`
              }
            ].map((faq, idx) => (
              <div 
                key={idx}
                className="rounded-2xl border border-slate-150 dark:border-white/[0.04] bg-white dark:bg-[#071125] p-5 shadow-sm hover:border-[var(--accent)]/20 transition-all duration-300"
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left font-heading font-bold text-sm sm:text-base text-luxury-primary dark:text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronRight 
                    size={16} 
                    className={`text-slate-400 transform transition-transform duration-300 ${openFaqIndex === idx ? 'rotate-90 text-[var(--accent)]' : ''}`}
                  />
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaqIndex === idx ? 'max-h-40 opacity-100 mt-3 pt-3 border-t border-slate-50 dark:border-white/[0.02]' : 'max-h-0 opacity-0'}`}
                >
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
