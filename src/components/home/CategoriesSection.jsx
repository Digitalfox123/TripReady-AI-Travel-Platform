import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, ArrowRight } from 'lucide-react';
import { travelCategories, topDestinations } from '../../data';

export default function CategoriesSection() {
  const navigate = useNavigate();
  const [selectedCatId, setSelectedCatId] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Curate to top 8 featured categories and inject destinations array dynamically
  const featuredCats = travelCategories.slice(0, 8).map((cat) => {
    // Dynamically retrieve destinations belonging to this category from the database
    const categoryDests = topDestinations.filter(d => d.categoryIds && d.categoryIds.includes(cat.id));
    
    // Sort alphabetically A to Z by destination name and take the top 6 spots
    const displayDests = categoryDests
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(0, 6);

    return { ...cat, destinations: displayDests };
  });

  // Select the first category by default on mount
  useEffect(() => {
    if (!selectedCatId && featuredCats.length > 0) {
      setSelectedCatId(featuredCats[0].id);
    }
  }, [featuredCats, selectedCatId]);

  const selectedCat = selectedCatId
    ? featuredCats.find((c) => c.id === selectedCatId)
    : null;

  const matchingDestinations = selectedCat
    ? selectedCat.destinations
    : [];

  const handleCategoryClick = (categoryId) => {
    setSelectedCatId(categoryId);
    setActiveIndex(0);
  };

  // Window resize responsive calculations
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth < 1024;

  return (
    <section className="section-padding bg-[var(--bg-primary)] text-[var(--text-primary)] border-t border-[var(--border)] relative overflow-hidden transition-colors duration-500">

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-10 select-none">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--accent)] text-[10px] font-bold uppercase tracking-widest mb-4">
            <Compass className="w-3.5 h-3.5" />
            <span>Categories</span>
          </div>
          <h2 className="section-title">
            Explore by <span className="italic font-light text-[var(--text-secondary)] dark:text-slate-400">travel style.</span>
          </h2>
          <p className="section-subtitle">
            Select a travel style below to explore our handpicked worldwide destinations in a premium 3D carousel.
          </p>
        </div>

        {/* Categories Horizontal Pills Selector (Scrollable) */}
        <div className="flex justify-center items-center mb-12 w-full">
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar py-2 px-4 max-w-full justify-start md:justify-center items-center">
            {featuredCats.map((cat) => {
              const isSelected = selectedCatId === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 whitespace-nowrap cursor-pointer select-none ${
                    isSelected 
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-md transform scale-102 border border-slate-900 dark:border-white' 
                      : 'bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
            
            {/* View More Tag */}
            <button
              onClick={() => navigate('/destinations')}
              className="px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-transparent border border-slate-300 dark:border-white/20 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all duration-300 whitespace-nowrap cursor-pointer flex items-center gap-1.5 select-none"
            >
              <span>View More</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3D Coverflow Spots Carousel */}
        {matchingDestinations.length > 0 ? (
          <div className="flex flex-col items-center select-none">
            
            {/* Carousel Container */}
            <div className="relative w-full h-[360px] sm:h-[420px] md:h-[460px] flex items-center justify-center overflow-hidden [perspective:1200px] [transform-style:preserve-3d]">
              {matchingDestinations.map((dest, idx) => {
                const offset = idx - activeIndex;
                const absOffset = Math.abs(offset);

                // Hide cards that are out of bounds of our Coverflow view
                if (absOffset > 2) return null;

                const stepX = isMobile ? 130 : isTablet ? 200 : 280;
                const translateX = offset * stepX;
                const scale = 1 - absOffset * 0.12;
                const zIndex = 30 - absOffset * 5;
                const opacity = 1 - absOffset * 0.45;
                const rotateY = offset * -15;

                return (
                  <div
                    key={dest.id}
                    onClick={() => {
                      if (offset === 0) {
                        navigate(`/destination/${dest.id}`);
                      } else {
                        setActiveIndex(idx);
                      }
                    }}
                    className="absolute rounded-[28px] overflow-hidden cursor-pointer shadow-[0_25px_50px_rgba(0,0,0,0.25)] flex flex-col justify-end transition-all duration-500 ease-out"

                    style={{
                      width: isMobile ? '220px' : '290px',
                      height: isMobile ? '300px' : '380px',
                      transform: `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`,
                      zIndex: zIndex,
                      opacity: opacity,
                      backgroundImage: `url(${dest.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'absolute',
                      pointerEvents: absOffset > 1 ? 'none' : 'auto',
                    }}
                  >
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent z-10" />

                    {/* Content Overlay */}
                    <div className={`relative z-20 p-5 text-left transition-opacity duration-300 ${
                      offset === 0 ? 'opacity-100' : 'opacity-40'
                    }`}>
                      <div className="flex items-center gap-1.5 text-[9px] font-bold text-white/70 uppercase tracking-widest font-mono">
                        <span>{dest.flag}</span>
                        <span>{dest.country}</span>
                      </div>
                      <h3 className="font-heading text-lg sm:text-xl font-bold text-white mt-1 leading-tight">
                        {dest.name}
                      </h3>
                      
                      {offset === 0 && (
                        <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-white/15">
                          <span className="text-[9px] uppercase tracking-wider font-bold text-white bg-white/15 backdrop-blur-sm border border-white/20 px-2.5 py-0.5 rounded-full font-mono">
                            Spot #{dest.rank}
                          </span>
                          <span className="text-[10px] text-white/90 font-mono font-bold">
                            {dest.budget?.daily || dest.budget || '$120/day'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation Arrows */}
            {matchingDestinations.length > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  onClick={() => setActiveIndex((prev) => (prev === 0 ? matchingDestinations.length - 1 : prev - 1))}
                  className="w-12 h-12 rounded-full border border-slate-200 dark:border-white/10 hover:border-slate-350 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  aria-label="Previous Spot"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path>
                  </svg>
                </button>
                <button
                  onClick={() => setActiveIndex((prev) => (prev === matchingDestinations.length - 1 ? 0 : prev + 1))}
                  className="w-12 h-12 rounded-full border border-slate-200 dark:border-white/10 hover:border-slate-350 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  aria-label="Next Spot"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            )}

          </div>
        ) : (
          <div className="p-12 rounded-[24px] bg-[var(--bg-secondary)] border border-slate-200 dark:border-white/5 text-center text-slate-500 text-sm font-light">
            No active curated spots in this category yet. Explore other curated profiles!
          </div>
        )}

      </div>
    </section>
  );
}
