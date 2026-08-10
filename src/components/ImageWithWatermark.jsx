import React, { useState, useEffect, useRef } from 'react';
import { Compass } from 'lucide-react';

export default function ImageWithWatermark({
  src,
  alt = 'Image',
  className = 'w-full h-full object-cover',
  wrapperClassName = 'relative w-full h-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/5',
  watermarkText = 'tripready',
  watermarkOpacity = 'opacity-25'
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const imgRef = useRef(null);

  // Reset loaded state when src changes
  useEffect(() => {
    setCurrentSrc(src);
    setLoaded(false);
    setError(false);
  }, [src]);

  // Handle cached image completes immediately before event registration
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [currentSrc]);

  const GUARANTEED_TRAVEL_FALLBACKS = [
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80',
    'https://images.unsplash.com/photo-1473116763269-255448993f66?w=1200&q=80',
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80',
    'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&q=80',
    'https://images.unsplash.com/photo-1565506737357-af89222625ad?w=1200&q=80'
  ];

  const handleError = () => {
    // Pick deterministic fallback from guaranteed list based on alt text or random index
    const hash = (alt || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const fallbackUrl = GUARANTEED_TRAVEL_FALLBACKS[hash % GUARANTEED_TRAVEL_FALLBACKS.length];
    
    if (currentSrc !== fallbackUrl) {
      setCurrentSrc(fallbackUrl);
      setError(false);
    } else {
      setError(false); // Never show grey missing box
    }
  };

  const hasPosition = /absolute|relative|fixed/.test(wrapperClassName);
  const positionClass = hasPosition ? '' : 'relative';

  return (
    <div className={`${wrapperClassName} ${positionClass} group select-none`}>
      {/* Self-contained keyframe styles */}
      <style>{`
        @keyframes customShimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes customSpinSlow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .animate-custom-shimmer {
          animation: customShimmer 1.5s infinite;
        }
        .animate-custom-spin-slow {
          animation: customSpinSlow 8s linear infinite;
        }
      `}</style>

      {/* Loading Skeleton */}
      {!loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-[#0c1329] z-10">
          {/* Shimmer overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-200/40 dark:via-white/[0.04] to-transparent -translate-x-full animate-custom-shimmer" />
          <div className="w-6 h-6 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin z-10" />
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900 text-slate-400 text-xs">
          <Compass className="w-5 h-5 mb-1 animate-bounce text-slate-350 dark:text-slate-650" />
          <span>Image Unavailable</span>
        </div>
      )}

      {/* The Actual Image */}
      <img
        ref={imgRef}
        src={currentSrc || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80'}
        alt={alt}
        className={`${className} transition-all duration-500 ${
          loaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-105 blur-md'
        }`}
        onLoad={() => setLoaded(true)}
        onError={handleError}
      />
    </div>
  );
}
