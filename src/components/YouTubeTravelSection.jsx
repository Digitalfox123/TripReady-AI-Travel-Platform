import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Clock, 
  Tv, 
  ExternalLink, 
  X, 
  Sparkles, 
  Compass, 
  CheckCircle2,
  Film,
  Video,
  Layers
} from 'lucide-react';
import { fetchTravelVideos, formatViewCount, formatTimeAgo } from '../services/youtubeService';

// Official Brand YouTube Logo SVG
export const YoutubeLogo = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"
      fill="#FF0000"
    />
    <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#FFFFFF" />
  </svg>
);

export default function YouTubeTravelSection({
  destination = 'Switzerland',
  category = 'general',
  title,
  subtitle,
  className = ''
}) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVideoModal, setActiveVideoModal] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  // Carousel & Drag scroll states
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [draggedDistance, setDraggedDistance] = useState(0);

  // Fetch videos whenever destination or category changes
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetchTravelVideos(destination, category)
      .then((data) => {
        if (isMounted) {
          setVideos(data || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn('Failed to load travel videos:', err);
        if (isMounted) {
          setVideos([]);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [destination, category]);

  // Update scroll arrow state
  const checkScrollBounds = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    checkScrollBounds();
    el.addEventListener('scroll', checkScrollBounds, { passive: true });
    window.addEventListener('resize', checkScrollBounds);

    return () => {
      el.removeEventListener('scroll', checkScrollBounds);
      window.removeEventListener('resize', checkScrollBounds);
    };
  }, [videos, loading, checkScrollBounds]);

  // Carousel scroll controls
  const handleScroll = (direction) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.85;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      handleScroll('left');
    } else if (e.key === 'ArrowRight') {
      handleScroll('right');
    }
  };

  // Mouse Drag / Touch Swipe handlers
  const handleMouseDown = (e) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setIsDragging(true);
    setStartX(e.pageX - el.offsetLeft);
    setScrollLeftState(el.scrollLeft);
    setDraggedDistance(0);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const el = scrollContainerRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 1.5;
    el.scrollLeft = scrollLeftState - walk;
    setDraggedDistance(Math.abs(x - startX));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCardClick = (video) => {
    // Only trigger modal click if not dragging
    if (draggedDistance > 10) return;
    setActiveVideoModal(video);
  };

  // Filter video categories
  const filteredVideos = videos.filter((v) => {
    if (activeFilter === 'walking') {
      return v.title.toLowerCase().includes('walk') || v.title.toLowerCase().includes('tour');
    }
    if (activeFilter === 'cinematic') {
      return v.title.toLowerCase().includes('cinematic') || v.title.toLowerCase().includes('drone') || v.title.toLowerCase().includes('4k');
    }
    if (activeFilter === 'guides') {
      return v.title.toLowerCase().includes('guide') || v.title.toLowerCase().includes('places') || v.title.toLowerCase().includes('best');
    }
    return true;
  });

  // Default Title & Subtitle defaults
  const rawTitle = title || (category === 'religious' ? `Sacred Experience in ${destination}` : `Discover ${destination} Through YouTube`);
  const cleanTitle = rawTitle.replace(/^▶️\s*/, '');
  const displaySubtitle = subtitle || `Experience ${destination} before you arrive. Watch curated 4K travel guides, walking tours, and documentaries.`;

  return (
    <section 
      className={`w-full relative my-12 transition-all duration-300 ${className}`}
      aria-label={`YouTube Travel Videos for ${destination}`}
    >
      {/* Container Box */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6 border-b border-[var(--border)] pb-6">
          <div className="space-y-2 text-left">
            {/* Badge Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-[11px] font-bold tracking-wider uppercase">
              <YoutubeLogo className="w-4 h-4" />
              <span>YouTube 4K Travel Experience</span>
            </div>

            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-normal tracking-tight text-luxury-primary dark:text-white leading-tight flex items-center gap-3">
              <YoutubeLogo className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 drop-shadow-md" />
              <span>{cleanTitle}</span>
            </h2>

            <p className="text-xs sm:text-sm text-luxury-secondary dark:text-slate-400 font-light max-w-2xl leading-relaxed">
              {displaySubtitle}
            </p>
          </div>

          {/* Controls & Category Filter Buttons */}
          <div className="flex items-center gap-3 self-start md:self-end">
            {/* Future-Ready Category Tabs */}
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-100 dark:bg-white/[0.03] p-1 rounded-2xl border border-[var(--border)]">
              {[
                { id: 'all', label: 'All Videos', icon: Layers },
                { id: 'guides', label: 'Guides', icon: Compass },
                { id: 'walking', label: 'Walking', icon: Film },
                { id: 'cinematic', label: '4K Drone', icon: Video }
              ].map((filter) => {
                const IconComp = filter.icon;
                const isActive = activeFilter === filter.id;
                return (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-medium transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-white dark:bg-dark-200 text-[var(--accent)] shadow-sm font-semibold'
                        : 'text-luxury-secondary dark:text-slate-400 hover:text-luxury-primary dark:hover:text-white'
                    }`}
                  >
                    <IconComp className="w-3 h-3" />
                    <span>{filter.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Navigation Arrow Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleScroll('left')}
                disabled={!canScrollLeft}
                aria-label="Previous videos"
                className={`p-2.5 rounded-full border border-[var(--border)] transition-all cursor-pointer ${
                  canScrollLeft
                    ? 'bg-white dark:bg-dark-200 text-luxury-primary dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 hover:scale-105 active:scale-95 shadow-sm'
                    : 'bg-slate-100/50 dark:bg-white/[0.02] text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-50'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={() => handleScroll('right')}
                disabled={!canScrollRight}
                aria-label="Next videos"
                className={`p-2.5 rounded-full border border-[var(--border)] transition-all cursor-pointer ${
                  canScrollRight
                    ? 'bg-white dark:bg-dark-200 text-luxury-primary dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 hover:scale-105 active:scale-95 shadow-sm'
                    : 'bg-slate-100/50 dark:bg-white/[0.02] text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-50'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* ─── LOADING STATE (SKELETON CAROUSEL) ─── */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="glass-card p-4 rounded-[24px] space-y-4 animate-pulse border border-[var(--border)]"
              >
                <div className="w-full aspect-video rounded-2xl bg-slate-200 dark:bg-white/10 relative overflow-hidden" />
                <div className="space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-white/10 rounded-md w-5/6" />
                  <div className="h-4 bg-slate-200 dark:bg-white/10 rounded-md w-2/3" />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="h-3 bg-slate-200 dark:bg-white/10 rounded-md w-1/3" />
                  <div className="h-3 bg-slate-200 dark:bg-white/10 rounded-md w-1/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ─── EMPTY STATE ─── */}
        {!loading && filteredVideos.length === 0 && (
          <div className="glass-card rounded-[28px] p-12 text-center space-y-4 border border-[var(--border)] max-w-lg mx-auto my-8">
            <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
              <Tv className="w-8 h-8" />
            </div>
            <h3 className="font-heading text-lg font-bold text-luxury-primary dark:text-white">
              No travel videos available yet for this destination.
            </h3>
            <p className="text-xs text-luxury-secondary dark:text-slate-400 font-light leading-relaxed">
              We couldn't find 4K videos matching this criteria right now. Check back soon as new destination guides are published!
            </p>
          </div>
        )}

        {/* ─── VIDEO CAROUSEL ─── */}
        {!loading && filteredVideos.length > 0 && (
          <div
            ref={scrollContainerRef}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={`flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none py-2 px-1 focus:outline-none select-none ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                onClick={() => handleCardClick(video)}
                className="snap-start shrink-0 w-[300px] sm:w-[340px] md:w-[380px] glass-card-hover rounded-[24px] overflow-hidden p-3.5 flex flex-col justify-between group transition-all duration-300 border border-[var(--border)] bg-white/70 dark:bg-dark-200/80 cursor-pointer"
              >
                {/* Thumbnail Header */}
                <div className="relative aspect-video rounded-[18px] overflow-hidden bg-slate-900 shadow-md">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';
                    }}
                  />

                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                  {/* YouTube Tag Top Left */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-semibold flex items-center gap-1.5 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span>YouTube 4K</span>
                  </div>

                  {/* Duration Badge Bottom Right */}
                  <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-white text-[10px] font-mono font-medium tracking-wider shadow-sm">
                    {video.duration}
                  </div>

                  {/* Central Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-xl transform transition-all duration-300 group-hover:scale-115 group-hover:bg-red-600 group-hover:shadow-red-600/50">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Content Details */}
                <div className="pt-4 pb-2 px-1 flex flex-col justify-between flex-1 space-y-3 text-left">
                  {/* Video Title */}
                  <h3 
                    className="font-heading text-sm font-semibold text-luxury-primary dark:text-white line-clamp-2 leading-snug group-hover:text-[var(--accent)] transition-colors"
                    title={video.title}
                  >
                    {video.title}
                  </h3>

                  {/* Metadata Row */}
                  <div className="space-y-2 pt-1 border-t border-[var(--border)]">
                    {/* Channel Name */}
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-luxury-secondary dark:text-slate-400">
                      <span className="truncate max-w-[200px]">{video.channelTitle}</span>
                      <CheckCircle2 className="w-3 h-3 text-blue-500 shrink-0" />
                    </div>

                    {/* Views & Date */}
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 dark:text-slate-500">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {formatViewCount(video.viewCount)}
                      </span>

                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimeAgo(video.publishedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── VIDEO MODAL PLAYER ─── */}
      {activeVideoModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl animate-fade-in"
          onClick={() => setActiveVideoModal(null)}
        >
          <div 
            className="relative w-full max-w-4xl bg-slate-900 border border-white/10 rounded-[32px] overflow-hidden shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-6 pb-0 flex items-start justify-between gap-4">
              <div className="space-y-1 text-left">
                <div className="inline-flex items-center gap-1.5 text-xs text-red-400 font-medium">
                  <YoutubeLogo className="w-4 h-4" />
                  <span>{activeVideoModal.channelTitle}</span>
                </div>
                <h3 className="font-heading text-base sm:text-lg font-bold text-white line-clamp-1">
                  {activeVideoModal.title}
                </h3>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <a
                  href={activeVideoModal.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md"
                >
                  <YoutubeLogo className="w-4 h-4" />
                  <span>Watch on YouTube</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => setActiveVideoModal(null)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Video Player 16:9 */}
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={activeVideoModal.embedUrl}
                title={activeVideoModal.title}
                className="w-full h-full border-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
