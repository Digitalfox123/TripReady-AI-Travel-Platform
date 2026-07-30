import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Compass, 
  SlidersHorizontal, 
  ArrowRight, 
  Shield, 
  Globe,
  Leaf,
  Mountain,
  Palmtree,
  Flame,
  Landmark,
  Building,
  Trees,
  Snowflake,
  Zap,
  Sparkles,
  PawPrint,
  Gem,
  Heart
} from 'lucide-react';
import { topDestinations, travelCategories, countries } from '../data';
import { supabase } from '../utils/supabaseClient';
import { getCityImage, usePremiumImage, isPlaceholderImage } from '../utils/imageLookup';
import { useAuth } from '../context/AuthContext';

// Helper function to map category ID to styled Lucide icon
export function getCategoryIcon(id, className = "w-3.5 h-3.5") {
  switch (id) {
    case 'nature':
      return <Leaf className={className} />;
    case 'mountains':
      return <Mountain className={className} />;
    case 'beaches':
      return <Palmtree className={className} />;
    case 'deserts':
      return <Flame className={className} />;
    case 'historical':
      return <Landmark className={className} />;
    case 'cities':
      return <Compass className={className} />;
    case 'skyscrapers':
      return <Building className={className} />;
    case 'forests':
      return <Trees className={className} />;
    case 'snow':
      return <Snowflake className={className} />;
    case 'adventure':
      return <Zap className={className} />;
    case 'islands':
      return <Globe className={className} />;
    case 'cultural':
      return <Sparkles className={className} />;
    case 'wildlife':
      return <PawPrint className={className} />;
    case 'luxury':
      return <Gem className={className} />;
    default:
      return <Globe className={className} />;
  }
}

// Reusable Dynamic Destination Card Image component
// Priority: dest.image (static data) → usePremiumImage (pipeline API) → getCityImage (keyword fallback)
function DestinationCardImage({ name, country, image, className = '', alt = '' }) {
  const keywordFallback = getCityImage(name, country);
  const { imageUrl: pipelineUrl } = usePremiumImage(name, country);

  // Pick best available source: static data image first (if not placeholder), then pipeline, then keyword fallback
  const isImagePlaceholder = !image || isPlaceholderImage(image);
  const bestSrc = (!isImagePlaceholder) ? image : (pipelineUrl || keywordFallback);
  const [finalSrc, setFinalSrc] = useState(bestSrc);
  const triedRef = useRef(new Set());

  useEffect(() => {
    // When a better source becomes available, use it (but don't downgrade)
    const isImgPlaceholder = !image || isPlaceholderImage(image);
    if (!isImgPlaceholder && !triedRef.current.has(image)) {
      setFinalSrc(image);
    } else if (pipelineUrl && !isPlaceholderImage(pipelineUrl) && !triedRef.current.has(pipelineUrl)) {
      setFinalSrc(pipelineUrl);
    } else if (isPlaceholderImage(finalSrc)) {
      setFinalSrc(keywordFallback);
    }
  }, [image, pipelineUrl, keywordFallback, finalSrc]);

  const handleError = () => {
    triedRef.current.add(finalSrc);
    // Cascade through fallbacks on error
    const isImgPlaceholder = !image || isPlaceholderImage(image);
    if (!isImgPlaceholder && finalSrc === image && pipelineUrl && !isPlaceholderImage(pipelineUrl) && !triedRef.current.has(pipelineUrl)) {
      setFinalSrc(pipelineUrl);
    } else if (!triedRef.current.has(keywordFallback)) {
      setFinalSrc(keywordFallback);
    } else {
      setFinalSrc('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80');
    }
  };

  return (
    <img
      src={finalSrc}
      alt={alt || name}
      className={className}
      onError={handleError}
      loading="lazy"
    />
  );
}

export default function DestinationsExplorerPage() {
  const navigate = useNavigate();
  const { user, isFallbackMode } = useAuth();
  const [favorites, setFavorites] = useState([]);

  // Load user favorites
  const loadFavorites = async () => {
    if (!user) return;
    if (isFallbackMode) {
      const allFavs = JSON.parse(localStorage.getItem('tripready_favorites') || '[]');
      setFavorites(allFavs.filter(f => f.user_id === user.id));
    } else {
      try {
        const { data } = await supabase.from('favorites').select('*').eq('user_id', user.id);
        if (data) setFavorites(data);
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      setFavorites([]);
    }
  }, [user, isFallbackMode]);

  const toggleFavorite = async (dest, e) => {
    if (e) e.stopPropagation();
    if (!user) {
      alert("Please log in to save favorites!");
      return;
    }
    const isFav = favorites.some(f => f.item_id === dest.id && f.item_type === 'destination');
    if (isFav) {
      // Remove
      if (isFallbackMode) {
        const allFavs = JSON.parse(localStorage.getItem('tripready_favorites') || '[]');
        const filtered = allFavs.filter(f => !(f.user_id === user.id && f.item_id === dest.id && f.item_type === 'destination'));
        localStorage.setItem('tripready_favorites', JSON.stringify(filtered));
        setFavorites(filtered.filter(f => f.user_id === user.id));
      } else {
        try {
          await supabase.from('favorites').delete().eq('user_id', user.id).eq('item_id', dest.id).eq('item_type', 'destination');
          setFavorites(prev => prev.filter(f => f.item_id !== dest.id));
        } catch (e) {
          console.error(e);
        }
      }
    } else {
      // Add
      const newFav = {
        id: crypto.randomUUID(),
        user_id: user.id,
        item_id: dest.id,
        item_name: dest.name,
        item_type: 'destination',
        created_at: new Date().toISOString()
      };
      if (isFallbackMode) {
        const allFavs = JSON.parse(localStorage.getItem('tripready_favorites') || '[]');
        allFavs.unshift(newFav);
        localStorage.setItem('tripready_favorites', JSON.stringify(allFavs));
        setFavorites(allFavs.filter(f => f.user_id === user.id));
      } else {
        try {
          await supabase.from('favorites').insert([newFav]);
          setFavorites(prev => [newFav, ...prev]);
        } catch (e) {
          console.error(e);
        }
      }
    }
  };

  const isFavorite = (id) => {
    return favorites.some(f => f.item_id === id && f.item_type === 'destination');
  };
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedCulturalRegion, setSelectedCulturalRegion] = useState('all');
  const [selectedCulturalSubCategory, setSelectedCulturalSubCategory] = useState('all');
  const [showCulturalFilters, setShowCulturalFilters] = useState(false);

  // Database destinations loaded from Supabase
  const [dbDestinations, setDbDestinations] = useState([]);
  const [dbLoading, setDbLoading] = useState(false);

  // Pagination visible cards limit
  const [visibleCount, setVisibleCount] = useState(24);

  // 1. Debounce search query changes to prevent heavy filtering on every keystroke
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(inputValue);
    }, 150);
    return () => clearTimeout(handler);
  }, [inputValue]);

  // 2. Fetch extra destinations from Supabase (Capital Cities)
  useEffect(() => {
    async function loadDbDestinations() {
      try {
        setDbLoading(true);
        const { data: dbCapitals, error } = await supabase
          .from('cities')
          .select('id, name, slug, country_name, is_capital')
          .eq('is_capital', true);

        if (error) {
          console.error('Error fetching database capitals:', error);
          return;
        }

        if (dbCapitals && dbCapitals.length > 0) {
          const existingNames = new Set(topDestinations.map(d => d.name.toLowerCase()));
          const existingIds = new Set(topDestinations.map(d => d.id.toLowerCase()));

          const extraDestinations = dbCapitals
            .filter(city => !existingNames.has(city.name.toLowerCase()) && !existingIds.has(city.slug.toLowerCase()))
            .map(city => {
              const countryObj = countries.find(c => c.name.toLowerCase() === city.country_name.toLowerCase());
              const flag = countryObj ? countryObj.flag : '🌐';
              return {
                id: city.slug,
                name: city.name,
                country: city.country_name,
                flag: flag,
                rank: 999, // default lower priority rank
                image: getCityImage(city.name, city.country_name),
                preview: `Discover the iconic landmarks, local food, and cultural spaces of ${city.name}, the capital of ${city.country_name}.`,
                description: `Discover the iconic landmarks, local food, and cultural spaces of ${city.name}, the capital of ${city.country_name}.`,
                budget: { daily: '$60-130' },
                safety: 'Safe',
                categoryIds: ['cities'] // Classified in cities category
              };
            });
          setDbDestinations(extraDestinations);
        }
      } catch (err) {
        console.error('Failed to load extra destinations:', err);
      } finally {
        setDbLoading(false);
      }
    }
    loadDbDestinations();
  }, []);

  // Combine static topDestinations with dynamically fetched database destinations
  const allDestinations = useMemo(() => {
    return [...topDestinations, ...dbDestinations];
  }, [dbDestinations]);

  // Reset pagination visible count when filters or search parameters change
  useEffect(() => {
    setVisibleCount(24);
  }, [searchQuery, activeCategory, selectedCulturalRegion, selectedCulturalSubCategory]);

  // Filter destinations based on search query and active category
  const filteredDestinations = useMemo(() => {
    const filtered = allDestinations.filter((dest) => {
      // 1. Search Query Filter (Checks name, country)
      const matchesSearch = 
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.country.toLowerCase().includes(searchQuery.toLowerCase());
      
      // 2. Category Filter
      const matchesCategory = 
        activeCategory === 'all' || 
        (dest.categoryIds && dest.categoryIds.includes(activeCategory));

      // 3. Cultural Advanced Region & SubCategory Filters
      if (activeCategory === 'cultural') {
        const matchesRegion = 
          selectedCulturalRegion === 'all' || 
          dest.culturalRegion === selectedCulturalRegion;
        const matchesSubCat = 
          selectedCulturalSubCategory === 'all' || 
          dest.culturalSubCategory === selectedCulturalSubCategory;
        
        return matchesSearch && matchesCategory && matchesRegion && matchesSubCat;
      }

      return matchesSearch && matchesCategory;
    });

    // Sort alphabetically A to Z by destination name
    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [allDestinations, searchQuery, activeCategory, selectedCulturalRegion, selectedCulturalSubCategory]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-500 pt-28 pb-24">
      {/* Dynamic Background subtle grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.01)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.002)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.002)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0 opacity-70" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Spacious Title Header Section */}
        <div className="text-left max-w-3xl space-y-4">
          <span className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-[0.2em] mb-2 block select-none">
            Directory Curation
          </span>
          <h1 className="font-heading text-4xl sm:text-6xl font-normal text-luxury-primary dark:text-white leading-[1.1] tracking-tight">
            Curated spaces for <br />
            <span className="italic font-light text-luxury-secondary dark:text-slate-400">your next trip.</span>
          </h1>
          <p className="text-sm sm:text-base text-luxury-secondary dark:text-slate-400 font-light leading-relaxed font-body max-w-xl">
            Explore {allDestinations.length}+ handpicked destinations worldwide. Filter by categories, cities, weather profiles, and historical sites.
          </p>
        </div>

        {/* ─── Search & Categories Control Workspace ─── */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Elegant Search Input & Toggle Button Group */}
            <div className="flex w-full md:max-w-xl gap-2.5 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Search destinations by city or country..."
                  className="w-full pl-11 pr-4 py-3 rounded-full bg-slate-50 dark:bg-white/[0.03] border border-luxury-border dark:border-white/[0.06] text-sm text-luxury-primary dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/30 transition-all font-body"
                />
              </div>

              {/* Dynamic Filter Toggle Button (Exclusively visible when 'cultural' category is active) */}
              {activeCategory === 'cultural' && (
                <button
                  onClick={() => setShowCulturalFilters(!showCulturalFilters)}
                  className={`p-3 rounded-full border transition-all duration-300 flex items-center justify-center shrink-0 shadow-premium relative ${
                    showCulturalFilters
                      ? 'bg-[var(--accent)] text-white border-transparent rotate-90 scale-105'
                      : 'bg-slate-50 dark:bg-white/[0.03] text-luxury-secondary dark:text-slate-300 border border-luxury-border dark:border-white/[0.06] hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                  title="Toggle Advanced Curation Filters"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  {!showCulturalFilters && (
                    <span className="absolute -top-1.5 -right-1 w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
                  )}
                </button>
              )}
            </div>
            
            <div className="text-xs text-slate-400 dark:text-slate-500 font-bold select-none uppercase tracking-widest shrink-0">
              Showing {filteredDestinations.length} destinations
            </div>
          </div>

          {/* Horizontal Scrolling Category Pill Wheel */}
          <div className="overflow-x-auto no-scrollbar -mx-4 px-4 flex gap-2.5 pb-2">
            {/* 'All' pill */}
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 shrink-0 ${
                activeCategory === 'all'
                  ? 'bg-luxury-primary text-white dark:bg-white dark:text-[#020813] shadow-md scale-102 border-transparent'
                  : 'bg-slate-50 dark:bg-white/[0.03] text-luxury-secondary dark:text-slate-300 border border-luxury-border dark:border-white/[0.06] hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>All Regions</span>
            </button>

            {travelCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 shrink-0 ${
                  activeCategory === cat.id
                    ? 'bg-[var(--accent)] text-white shadow-md scale-102 border-transparent'
                    : 'bg-slate-50 dark:bg-white/[0.03] text-luxury-secondary dark:text-slate-300 border border-luxury-border dark:border-white/[0.06] hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                {getCategoryIcon(cat.id, "w-3.5 h-3.5")}
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
          
          {/* Advanced Cultural Sub-Filters Panel */}
          {activeCategory === 'cultural' && showCulturalFilters && (
            <div className="p-5 rounded-3xl bg-slate-50/50 dark:bg-white/[0.02] border border-luxury-border dark:border-white/[0.04] backdrop-blur-md space-y-4 animate-fade-in relative z-20">
              <div className="flex items-center gap-2 text-xs font-bold text-luxury-primary dark:text-white uppercase tracking-wider">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>Advanced Cultural Curation Filters</span>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Regions sub-filter */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold block">
                    Filter by Global Region
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {['all', 'Asia', 'Europe', 'Africa', 'Americas', 'Middle East', 'Oceania'].map((r) => (
                      <button
                        key={r}
                        onClick={() => setSelectedCulturalRegion(r)}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${
                          selectedCulturalRegion === r
                            ? 'bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30'
                            : 'bg-white dark:bg-white/[0.02] text-luxury-secondary dark:text-slate-400 border border-luxury-border dark:border-white/[0.04] hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                      >
                        {r === 'all' ? 'All Regions' : r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sub-Categories filter */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold block">
                    Filter by Heritage Type
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {['all', 'Ancient Heritage', 'Sacred Sites', 'Arts & Museums', 'Music & Performance', 'Festivals', 'Living Culture', 'Culinary Heritage', 'Literature & Film', 'Architecture'].map((sc) => (
                      <button
                        key={sc}
                        onClick={() => setSelectedCulturalSubCategory(sc)}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${
                          selectedCulturalSubCategory === sc
                            ? 'bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30'
                            : 'bg-white dark:bg-white/[0.02] text-luxury-secondary dark:text-slate-400 border border-luxury-border dark:border-white/[0.04] hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                      >
                        {sc === 'all' ? 'All Types' : sc}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ─── Destinations Directory Layout (Categorized Lanes or Flat Grid) ─── */}
        {activeCategory === 'all' && searchQuery === '' ? (
          /* Categorized Lane Layout when viewing 'All' */
          <div className="space-y-16 animate-fade-in">
            {travelCategories.map((cat) => {
              const categoryDests = allDestinations.filter(
                (d) => d.categoryIds && d.categoryIds.includes(cat.id)
              );
              const sortedDests = [...categoryDests].sort((a, b) => (a.rank || 9999) - (b.rank || 9999));
              const slicedDests = sortedDests.slice(0, 8);

              if (slicedDests.length === 0) return null;

              return (
                <div key={cat.id} className="space-y-6 pt-4 border-t border-luxury-border/30 dark:border-white/[0.02] first:border-none first:pt-0">
                  <div className="flex items-end justify-between">
                    <div className="space-y-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-xl p-1.5 rounded-lg bg-slate-50 dark:bg-white/[0.03] border border-luxury-border/50 dark:border-white/[0.05]">
                          {getCategoryIcon(cat.id, "w-5 h-5 text-[var(--accent)]")}
                        </span>
                        <h2 className="font-heading text-xl sm:text-2xl font-bold text-luxury-primary dark:text-white">
                          {cat.name} Destinations
                        </h2>
                      </div>
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-light max-w-xl font-body">
                        {cat.description || `Browse handpicked ${cat.name.toLowerCase()} getaways from across the globe.`}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => setActiveCategory(cat.id)}
                      className="group inline-flex items-center gap-1.5 text-xs text-[var(--accent)] font-bold hover:underline transition-all pb-1 select-none"
                    >
                      <span>Explore All ({categoryDests.length})</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>
                  
                  <div className="overflow-x-auto no-scrollbar -mx-4 px-4 flex gap-6 pb-4 scroll-smooth">
                    {slicedDests.map((dest) => (
                      <div
                        key={dest.id}
                        onClick={() => navigate(`/destination/${dest.id}`)}
                        className="w-[280px] shrink-0 group glass-card overflow-hidden cursor-pointer shadow-premium hover:shadow-2xl border border-luxury-border dark:border-white/[0.04] hover:border-[var(--accent)]/20 dark:hover:border-[var(--accent)]/30 hover:scale-[1.01] hover:-translate-y-1 transition-all duration-300 relative flex flex-col justify-between"
                      >
                        {/* Image layout container */}
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-dark-300">
                          <DestinationCardImage
                            name={dest.name}
                            country={dest.country}
                            image={dest.image}
                            alt={dest.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#020813]/60 via-transparent to-transparent pointer-events-none" />
                          <button
                            onClick={(e) => toggleFavorite(dest, e)}
                            className={`absolute top-3 left-3 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-300 z-10 ${isFavorite(dest.id) ? 'bg-red-500/80 border border-red-400/50 shadow-lg shadow-red-500/25' : 'bg-black/30 border border-white/15 hover:bg-black/50 hover:border-white/25'}`}
                          >
                            <Heart className={`w-4 h-4 transition-all duration-300 ${isFavorite(dest.id) ? 'text-white fill-white scale-110' : 'text-white/80'}`} />
                          </button>
                          <span className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/20 border border-white/10 backdrop-blur-xs flex items-center justify-center text-xs shadow-sm">
                            {dest.flag}
                          </span>
                        </div>

                        {/* Content body layout */}
                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4 text-left">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-[10px] font-bold tracking-wider uppercase">
                              <MapPin className="w-3.5 h-3.5 text-[var(--accent)]" />
                              <span>{dest.country}</span>
                            </div>
                            
                            <h3 className="font-heading text-base font-bold text-luxury-primary dark:text-white leading-tight">
                              {dest.name}
                            </h3>
                            
                            <p className="text-xs text-luxury-secondary dark:text-slate-400 font-light font-body line-clamp-2 leading-relaxed">
                              {dest.preview || dest.description}
                            </p>
                          </div>

                          {/* Details stats bar footer */}
                          <div className="pt-3 border-t border-luxury-border dark:border-white/[0.04] flex items-center justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500 font-mono">
                            <div className="flex items-center gap-0.5">
                              <span className="text-[var(--accent)] font-extrabold font-body">Est: </span>
                              <span>{dest.budget ? (dest.budget.daily || dest.budget) : '$100/day'}</span>
                            </div>

                            <div className="flex items-center gap-1 font-body">
                              <Shield className="w-3 h-3 text-green-500" />
                              <span className="text-green-600 dark:text-green-500">{dest.safety || 'Safe'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : filteredDestinations.length > 0 ? (
          /* Flat Grid Layout when specific category is active or search query is active */
          <div className="space-y-10 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDestinations.slice(0, visibleCount).map((dest) => (
                <div 
                  key={dest.id}
                  onClick={() => navigate(`/destination/${dest.id}`)}
                  className="group glass-card overflow-hidden cursor-pointer shadow-premium hover:shadow-2xl border border-luxury-border dark:border-white/[0.04] hover:border-[var(--accent)]/20 dark:hover:border-[var(--accent)]/30 hover:scale-[1.01] hover:-translate-y-1 transition-all duration-300 relative flex flex-col justify-between"
                >
                  {/* Image layout container */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-dark-300">
                    <DestinationCardImage
                      name={dest.name}
                      country={dest.country}
                      image={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020813]/60 via-transparent to-transparent pointer-events-none" />
                    <button
                      onClick={(e) => toggleFavorite(dest, e)}
                      className={`absolute top-3 left-3 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-300 z-10 ${isFavorite(dest.id) ? 'bg-red-500/80 border border-red-400/50 shadow-lg shadow-red-500/25' : 'bg-black/30 border border-white/15 hover:bg-black/50 hover:border-white/25'}`}
                    >
                      <Heart className={`w-4 h-4 transition-all duration-300 ${isFavorite(dest.id) ? 'text-white fill-white scale-110' : 'text-white/80'}`} />
                    </button>
                    <span className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/20 border border-white/10 backdrop-blur-xs flex items-center justify-center text-xs shadow-sm">
                      {dest.flag}
                    </span>
                  </div>

                  {/* Content body layout */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4 text-left">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-[10px] font-bold tracking-wider uppercase">
                        <MapPin className="w-3.5 h-3.5 text-[var(--accent)]" />
                        <span>{dest.country}</span>
                      </div>
                      
                      <h3 className="font-heading text-lg font-bold text-luxury-primary dark:text-white leading-tight">
                        {dest.name}
                      </h3>
                      
                      <p className="text-xs text-luxury-secondary dark:text-slate-400 font-light font-body line-clamp-2 leading-relaxed">
                        {dest.preview || dest.description}
                      </p>
                    </div>

                    {/* Details stats bar footer */}
                    <div className="pt-3 border-t border-luxury-border dark:border-white/[0.04] flex items-center justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500 font-mono">
                      <div className="flex items-center gap-0.5">
                        <span className="text-[var(--accent)] font-extrabold font-body">Est: </span>
                        <span>{dest.budget ? (dest.budget.daily || dest.budget) : '$100/day'}</span>
                      </div>

                      <div className="flex items-center gap-1 font-body">
                        <Shield className="w-3 h-3 text-green-500" />
                        <span className="text-green-600 dark:text-green-500">{dest.safety || 'Safe'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {filteredDestinations.length > visibleCount && (
              <div className="flex justify-center pt-8">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 24)}
                  className="px-8 py-3.5 rounded-full bg-slate-50 dark:bg-white/[0.03] border border-luxury-border dark:border-white/[0.06] text-luxury-primary dark:text-white text-xs font-bold uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-white/5 active:scale-95 transition-all shadow-premium"
                >
                  Load More Destinations
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-24 glass-card border border-luxury-border max-w-xl mx-auto space-y-4 animate-scale-in">
            <span className="text-4xl block">🔍</span>
            <h3 className="font-heading text-xl font-bold text-luxury-primary dark:text-white">No Destinations Found</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto font-light leading-relaxed">
              We couldn't find any destinations matching your search. Try typing another city or select a region filter above.
            </p>
            <button 
              onClick={() => { setInputValue(''); setSearchQuery(''); setActiveCategory('all'); }}
              className="px-6 py-2.5 rounded-full bg-luxury-primary text-white dark:bg-white dark:text-[#020813] text-xs font-bold uppercase tracking-widest hover:scale-102 active:scale-98 transition-transform"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
