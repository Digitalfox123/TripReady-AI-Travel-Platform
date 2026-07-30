import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { 
  Map, Bookmark, CalendarDays, AlertTriangle, RefreshCw, 
  ChevronLeft, ChevronRight, MapPin, Star, MessageSquare, Compass 
} from 'lucide-react';
import { useDestinationGallery, getCityImage, getCuratedAttractionImage } from '../utils/imageLookup';
import { getPipelineImage } from '../utils/imagePipeline';

// Deterministic category-based images (no API calls, no blinking)
const CATEGORY_IMAGES = {
  'Museum': 'https://images.unsplash.com/photo-1566121318599-270834fb1553?w=800&q=80',
  'Heritage Site': 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80',
  'Landmark': 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80',
  'National Park': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
  'Beach': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
  'Viewpoint': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  'Zoo': 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=800&q=80',
  'Amusement Park': 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&q=80',
  'Castle': 'https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?w=800&q=80',
  'Monument': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80',
  'Attraction': 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80',
  'Religious': 'https://images.unsplash.com/photo-1564769625905-50e9ad63095a?w=800&q=80',
  'Nature': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
  'Culture': 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&q=80',
  'Historical': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80',
  'Sightseeing': 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80'
};

const VARIETY_IMAGES = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80',
  'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
  'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80',
  'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80',
  'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80',
  'https://images.unsplash.com/photo-1528114039593-4366cc08227d?w=800&q=80',
  'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
  'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
];

export function isPlaceholderImage(url) {
  if (!url) return true;
  const lower = url.toLowerCase();
  return (
    lower.includes('photo-1488646953014-85cb44e25828') || // Passport/Map placeholder
    lower.includes('photo-1476514525535-07fb3b4ae5f1') || // Nikon camera placeholder
    lower.includes('flag') ||
    lower.includes('map') ||
    lower.includes('locator') ||
    lower.includes('projection') ||
    lower.includes('orthographic') ||
    lower.includes('coat_of_arms') ||
    lower.includes('shield') ||
    lower.includes('seal') ||
    lower.includes('.svg') ||
    lower.includes('silhouette') ||
    lower.includes('diagram') ||
    lower.includes('globe')
  );
}

// Helper to retrieve image URL from attraction properties or nested description JSON
function getSpotImage(spot) {
  if (!spot) return null;
  if (spot.image && !isPlaceholderImage(spot.image)) return spot.image;
  if (spot.featured_image && !isPlaceholderImage(spot.featured_image)) return spot.featured_image;
  if (spot.description && spot.description.trim().startsWith('{')) {
    try {
      const parsed = JSON.parse(spot.description);
      if (parsed.image && !isPlaceholderImage(parsed.image)) return parsed.image;
      if (parsed.featured_image && !isPlaceholderImage(parsed.featured_image)) return parsed.featured_image;
    } catch (_) {
      // Ignore JSON parse errors
    }
  }
  return null;
}

// --- useAttractionImages: fetch per-attraction thumbnails using the smart image selection pipeline ---
function useAttractionImages(attractions, cityName, countryName) {
  const cacheRef = useRef(new window.Map());
  const [imageMap, setImageMap] = useState(new window.Map());
  const pendingRef = useRef(new Set());

  const normalizeName = useCallback((name) => {
    return (name || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '_');
  }, []);

  useEffect(() => {
    if (!attractions || attractions.length === 0) return;

    // Filter to attractions that need fetching
    const toFetch = attractions.filter((a) => {
      if (getSpotImage(a)) return false; // already has an image
      const key = normalizeName(a.name);
      if (cacheRef.current.has(a.id)) return false; // already cached in ref
      if (pendingRef.current.has(a.id)) return false; // already in-flight
      
      // Check localStorage
      const lsKey = `tripready_wiki_attr_img_${key}`;
      const cached = localStorage.getItem(lsKey);
      if (cached !== null) {
        cacheRef.current.set(a.id, cached);
        return false;
      }
      return true;
    });

    // Hydrate imageMap from anything found in localStorage on this pass
    const noDbImages = attractions.filter((a) => !getSpotImage(a));
    if (toFetch.length < noDbImages.length) {
      setImageMap(new window.Map(cacheRef.current));
    }

    if (toFetch.length === 0) return;

    let cancelled = false;

    async function fetchBatch(batch) {
      const results = await Promise.allSettled(
        batch.map(async (attraction) => {
          try {
            const result = await getPipelineImage(attraction.name, cityName || '', countryName || '');
            if (result && result.url) {
              return { id: attraction.id, name: attraction.name, imageUrl: result.url };
            }
          } catch (err) {
            console.warn("Pipeline lookup failed for attraction card:", attraction.name, err);
          }
          return { id: attraction.id, name: attraction.name, imageUrl: '' };
        })
      );
      return results
        .filter((r) => r.status === 'fulfilled')
        .map((r) => r.value);
    }

    async function processAll() {
      // Mark all as pending
      toFetch.forEach((a) => pendingRef.current.add(a.id));

      const BATCH_SIZE = 5;
      for (let i = 0; i < toFetch.length; i += BATCH_SIZE) {
        if (cancelled) break;
        const batch = toFetch.slice(i, i + BATCH_SIZE);
        const results = await fetchBatch(batch);

        results.forEach(({ id, name, imageUrl }) => {
          cacheRef.current.set(id, imageUrl);
          pendingRef.current.delete(id);
          // Persist to localStorage
          const lsKey = `tripready_wiki_attr_img_${normalizeName(name)}`;
          try { localStorage.setItem(lsKey, imageUrl); } catch (_) { /* quota */ }
        });

        if (!cancelled) {
          setImageMap(new window.Map(cacheRef.current));
        }

        // Small delay between batches to respect rate limits
        if (i + BATCH_SIZE < toFetch.length && !cancelled) {
          await new Promise((r) => setTimeout(r, 200));
        }
      }
    }

    processAll();

    return () => {
      cancelled = true;
    };
  }, [attractions, normalizeName, cityName, countryName]);

  return imageMap;
}

function getCardImage(spot, idx, destination) {
  const baseImg = getSpotImage(spot);
  if (baseImg) return baseImg;
  
  // Try looking up in attractionKnowledgeBase first
  const curatedImg = getCuratedAttractionImage(spot.name);
  if (curatedImg) return curatedImg;

  const catImg = CATEGORY_IMAGES[spot.category];
  if (catImg && idx % 3 === 0) return catImg;
  if (destination && destination.name) {
    return getCityImage(destination.name, destination.country);
  }
  
  // Return a generic cityscape or the category default if nothing else is available
  return catImg || CATEGORY_IMAGES['Attraction'];
}

function AttractionCard({
  spot,
  isSaved,
  isAdded,
  toggleSaveAttraction,
  toggleItineraryAttraction,
  focusOnMap,
  idx,
  galleryImages = [],
  destination,
  offset,
  isActive,
  onClick,
  totalCount,
  wikiImage
}) {
  const baseImg = getSpotImage(spot);
  const cardImage = baseImg 
    ? baseImg 
    : (wikiImage || ((galleryImages && galleryImages.length > 0)
        ? galleryImages[idx % galleryImages.length]
        : getCardImage(spot, idx, destination)));

  const defaultDesc = `A highly rated ${spot.category.toLowerCase()} offering a premium sightseeing experience.`;

  // Coverflow 3D layout math styles
  const getCardStyles = (offset) => {
    const absOffset = Math.abs(offset);
    if (absOffset > 2) {
      return {
        transform: 'translate(-50%, -50%) scale(0.5)',
        opacity: 0,
        zIndex: 0,
        pointerEvents: 'none',
        position: 'absolute',
        transition: 'all 500ms cubic-bezier(0.25, 1, 0.5, 1)'
      };
    }

    let translateX = '-50%';
    let scale = 1;
    let rotate = '0deg';
    let zIndex = 30 - absOffset * 10;
    let opacity = 1;
    let pointerEvents = 'none';

    if (offset === 0) {
      translateX = '-50%';
      scale = 1.05;
      rotate = '0deg';
      opacity = 1;
      pointerEvents = 'auto';
    } else if (offset === -1) {
      translateX = '-115%';
      scale = 0.9;
      rotate = '-4deg';
      opacity = 0.85;
      pointerEvents = 'auto';
    } else if (offset === 1) {
      translateX = '15%';
      scale = 0.9;
      rotate = '4deg';
      opacity = 0.85;
      pointerEvents = 'auto';
    } else if (offset === -2) {
      translateX = '-175%';
      scale = 0.76;
      rotate = '-8deg';
      opacity = 0.45;
    } else if (offset === 2) {
      translateX = '75%';
      scale = 0.76;
      rotate = '8deg';
      opacity = 0.45;
    }

    return {
      transform: `translate(${translateX}, -50%) scale(${scale}) rotate(${rotate})`,
      zIndex,
      opacity,
      pointerEvents,
      position: 'absolute',
      transition: 'all 500ms cubic-bezier(0.25, 1, 0.5, 1)'
    };
  };

  return (
    <div
      onClick={!isActive ? onClick : undefined}
      style={getCardStyles(offset)}
      className="left-1/2 top-1/2 w-[240px] md:w-[285px] aspect-[3/4.2] rounded-[32px] overflow-visible shadow-2xl bg-slate-900 border border-white/10 group cursor-pointer"
    >
      {/* Full Bleed Card Image Container */}
      <div className="w-full h-full rounded-[32px] overflow-hidden relative">
        <img
          src={cardImage}
          alt={spot.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = CATEGORY_IMAGES['Attraction'];
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent pointer-events-none" />

        {/* Overlaid Title & Subtitle + Optional CTA */}
        <div className="absolute bottom-5 left-5 right-5 z-10 flex flex-col items-start text-left">
          <span className="text-[10px] text-white/70 uppercase tracking-wider font-bold mb-1">
            {spot.category}
          </span>
          <h3 className="font-heading text-base md:text-lg font-bold text-white leading-tight line-clamp-2">
            {spot.name}
          </h3>
          <p className="text-[10.5px] text-white/60 font-light mt-1.5 line-clamp-1 leading-relaxed">
            {spot.description || defaultDesc}
          </p>

          {/* Map button on active card */}
          {isActive && (
            <button
              onClick={(e) => { e.stopPropagation(); focusOnMap(spot.lat, spot.lng, spot.name); }}
              className="mt-4 w-full py-2.5 rounded-full bg-white text-slate-950 hover:bg-white/95 text-[10px] font-bold uppercase tracking-wider transition-all duration-300 shadow-xl flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Map className="w-3.5 h-3.5 text-[var(--accent)]" />
              View on Map
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AttractionsGrid({
  destination,
  attractions = [],
  uiState,
  retryFetch,
  savedAttractionIds = [],
  itineraryAttractionIds = [],
  toggleSaveAttraction,
  toggleItineraryAttraction,
  focusOnMap,
  isBackgroundValidating = false
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeIndex, setActiveIndex] = useState(0);

  // Filtered attractions based on category
  const filteredAttractions = useMemo(() => {
    if (selectedCategory === 'All') return attractions;
    return attractions.filter(
      (a) => (a.category || '').toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [attractions, selectedCategory]);

  // Available unique categories
  const availableCategories = useMemo(() => {
    if (!attractions || attractions.length === 0) return [];
    const cats = new Set(attractions.map((a) => a.category).filter(Boolean));
    return ['All', ...Array.from(cats)];
  }, [attractions]);

  // Fetch destination-specific gallery images for fallback
  const { images: galleryImages } = useDestinationGallery(
    destination?.name,
    destination?.country,
    Math.max(attractions.length || 10, 15)
  );

  // Fetch per-attraction images using the smart pipeline
  const wikiImageMap = useAttractionImages(filteredAttractions, destination?.name, destination?.country);

  // Handle keyboard arrow navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight') {
        setActiveIndex((prev) => Math.min(filteredAttractions.length - 1, prev + 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredAttractions.length]);

  // Handle initial center active index or category shifts
  useEffect(() => {
    if (filteredAttractions.length > 0) {
      setActiveIndex(Math.floor(filteredAttractions.length / 2));
    } else {
      setActiveIndex(0);
    }
  }, [filteredAttractions.length]);

  // 1. Loading State
  if (uiState === 'loading') {
    return (
      <div className="flex justify-center items-center gap-5 h-[420px] md:h-[460px]">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className={`w-[240px] md:w-[285px] aspect-[3/4.2] rounded-[32px] bg-slate-200/50 dark:bg-slate-800/30 animate-pulse ${
              n === 2 ? 'scale-105 z-20' : 'scale-90 opacity-60 z-10'
            }`}
          />
        ))}
      </div>
    );
  }

  // 2. Error State
  if (uiState === 'error') {
    return (
      <div className="glass-card p-12 text-center max-w-xl mx-auto rounded-[32px] space-y-6">
        <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-heading font-bold">Failed to Load Attractions</h3>
          <p className="text-xs text-[var(--text-secondary)] font-light leading-relaxed">
            A network timeout or API error occurred. Verify your internet connection and try again.
          </p>
        </div>
        <button
          onClick={retryFetch}
          className="px-6 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md hover:scale-[1.02] cursor-pointer"
        >
          Retry Search
        </button>
      </div>
    );
  }

  // 3. Empty State
  if (uiState === 'empty' || attractions.length === 0) {
    return (
      <div className="glass-card p-12 text-center max-w-xl mx-auto rounded-[32px] space-y-6">
        <div className="w-16 h-16 bg-slate-500/10 text-slate-500 rounded-full flex items-center justify-center mx-auto border border-slate-500/20">
          <Map className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-heading font-bold">No Attractions Found</h3>
          <p className="text-xs text-[var(--text-secondary)] font-light leading-relaxed">
            There are no registered attractions or landmarks for this location within 20 kilometers.
          </p>
        </div>
        <button
          onClick={retryFetch}
          className="px-6 py-2.5 rounded-xl bg-slate-150/80 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
        >
          Refresh Scan
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 flex flex-col items-center w-full">
      {/* SWR Revalidating status */}
      {isBackgroundValidating && (
        <div className="flex items-center justify-center gap-2 text-xs text-amber-500 font-mono animate-pulse">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          <span>Verifying fresh place data...</span>
        </div>
      )}

      {/* SWR Cached status */}
      {uiState === 'cached' && !isBackgroundValidating && (
        <div className="flex items-center justify-center gap-2 text-xs text-amber-600 dark:text-amber-400 font-mono">
          <span>⚠️ Displaying Cached Offline View. Click retry to update.</span>
        </div>
      )}

      {/* Category Tabs */}
      {availableCategories.length > 2 && (
        <div className="flex flex-wrap gap-2.5 justify-center mb-4 select-none max-w-full px-4 animate-fade-in">
          {availableCategories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                }}
                className={`px-4 py-2 rounded-full text-[10.5px] font-bold uppercase tracking-wider transition-all duration-300 border cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 border-transparent shadow-premium scale-[1.04]'
                    : 'bg-white/50 dark:bg-white/[0.02] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/[0.06] hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      )}

      {filteredAttractions.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-sm text-slate-500">No attractions found in this category.</p>
        </div>
      ) : (
        <>
          {/* 3D Coverflow Deck Viewport */}
          <div className="relative w-full max-w-4xl h-[400px] md:h-[450px] flex items-center justify-center overflow-visible py-10">
            
            {/* Left Arrow */}
            <button
              onClick={() => setActiveIndex((prev) => Math.max(0, prev - 1))}
              disabled={activeIndex === 0}
              className="absolute left-2 md:left-6 z-40 w-11 h-11 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200/60 dark:border-white/10 shadow-lg flex items-center justify-center text-slate-700 dark:text-white hover:scale-110 active:scale-95 transition-all disabled:opacity-20 disabled:pointer-events-none cursor-pointer animate-fade-in"
            >
              <ChevronLeft className="w-5.5 h-5.5" />
            </button>

            {/* The stacked deck */}
            <div className="relative w-full h-full flex items-center justify-center select-none overflow-visible">
              {filteredAttractions.map((spot, idx) => {
                const isSaved = savedAttractionIds.includes(spot.id);
                const isAdded = itineraryAttractionIds.includes(spot.id);
                const offset = idx - activeIndex;

                return (
                  <AttractionCard
                    key={spot.id || idx}
                    spot={spot}
                    isSaved={isSaved}
                    isAdded={isAdded}
                    toggleSaveAttraction={toggleSaveAttraction}
                    toggleItineraryAttraction={toggleItineraryAttraction}
                    focusOnMap={focusOnMap}
                    idx={idx}
                    galleryImages={galleryImages}
                    destination={destination}
                    offset={offset}
                    isActive={idx === activeIndex}
                    onClick={() => setActiveIndex(idx)}
                    totalCount={filteredAttractions.length}
                    wikiImage={wikiImageMap.get(spot.id) || ''}
                  />
                );
              })}
            </div>

            {/* Right Arrow */}
            <button
              onClick={() => setActiveIndex((prev) => Math.min(filteredAttractions.length - 1, prev + 1))}
              disabled={activeIndex === filteredAttractions.length - 1}
              className="absolute right-2 md:right-6 z-40 w-11 h-11 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200/60 dark:border-white/10 shadow-lg flex items-center justify-center text-slate-700 dark:text-white hover:scale-110 active:scale-95 transition-all disabled:opacity-20 disabled:pointer-events-none cursor-pointer animate-fade-in"
            >
              <ChevronRight className="w-5.5 h-5.5" />
            </button>
          </div>

          {/* Dynamic Stats Bar & Indicator Dots */}
          {filteredAttractions[activeIndex] && (
            <div className="flex flex-col items-center space-y-4 max-w-full">
              {/* Active stats pill (Image 2 style) */}
              <div className="bg-slate-900/80 dark:bg-slate-950/80 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-6 md:gap-8 border border-white/15 shadow-2xl transition-all duration-300 max-w-full overflow-x-auto no-scrollbar select-none animate-fade-in">
                
                {/* Distance */}
                <div className="flex items-center gap-2 text-white/95 shrink-0">
                  <MapPin size={14} className="text-cyan-400" />
                  <span className="text-[10.5px] md:text-xs font-mono font-bold tracking-wider">
                    {filteredAttractions[activeIndex].distance || '0.8 km'}
                  </span>
                </div>

                <div className="w-[1px] h-3 bg-white/20 shrink-0" />

                {/* Rating */}
                <div className="flex items-center gap-2 text-white/95 shrink-0">
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                  <span className="text-[10.5px] md:text-xs font-mono font-bold tracking-wider">
                    ★ {filteredAttractions[activeIndex].score ? filteredAttractions[activeIndex].score.toFixed(1) : '4.8'}
                  </span>
                </div>

                <div className="w-[1px] h-3 bg-white/20 shrink-0" />

                {/* Reviews */}
                <div className="flex items-center gap-2 text-white/95 shrink-0">
                  <MessageSquare size={14} className="text-emerald-400" />
                  <span className="text-[10.5px] md:text-xs font-mono font-bold tracking-wider">
                    {filteredAttractions[activeIndex].reviewsCount || '150'} reviews
                  </span>
                </div>

                <div className="w-[1px] h-3 bg-white/20 shrink-0" />

                {/* Category */}
                <div className="flex items-center gap-2 text-white/95 shrink-0">
                  <Compass size={14} className="text-purple-400 animate-spin-slow" style={{ animationDuration: '12s' }} />
                  <span className="text-[10.5px] md:text-xs font-bold uppercase tracking-wider">
                    {filteredAttractions[activeIndex].category}
                  </span>
                </div>

              </div>

              {/* Navigation dots */}
              <div className="flex items-center gap-2 justify-center py-1">
                {filteredAttractions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      i === activeIndex ? 'w-4.5 bg-[var(--text-primary)] dark:bg-white' : 'bg-slate-300 dark:bg-white/20 hover:bg-slate-400 dark:hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Count Indicator */}
          <div className="text-center pt-2">
            <span className="text-[9px] text-[var(--text-muted)] font-mono uppercase tracking-widest">
              {filteredAttractions.length} of {attractions.length} Attractions Loaded · Use Arrows or Click Cards
            </span>
          </div>
        </>
      )}
    </div>
  );
}
