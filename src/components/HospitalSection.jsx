import { useState, useEffect } from 'react';
import { Phone, Map, ExternalLink, MapPin, AlertTriangle, ChevronDown, ChevronUp, Maximize2, Minimize2 } from 'lucide-react';

export default function HospitalSection({
  hospitals = [],
  uiState,
  retryFetch,
  focusOnMap,
  onExpand
}) {
  const [expandedIds, setExpandedIds] = useState({});
  const [allExpanded, setAllExpanded] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const displayedHospitals = showAll ? hospitals : hospitals.slice(0, 8);

  useEffect(() => {
    if (displayedHospitals.length === 0) return;
    const allOpened = displayedHospitals.every(h => expandedIds[h.id]);
    setAllExpanded(allOpened);
  }, [expandedIds, hospitals]);

  if (uiState === 'loading') {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] animate-pulse space-y-3 text-left"
          >
            <div className="h-3 w-1/3 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-3 w-5/6 bg-slate-200 dark:bg-slate-800 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (uiState === 'error' || hospitals.length === 0) {
    return (
      <div className="p-8 rounded-[32px] bg-[var(--bg-secondary)] border border-[var(--border)] text-center space-y-4 max-w-md mx-auto">
        <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto border border-amber-500/20">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="font-heading font-bold text-sm">No Local Medical Data</h4>
          <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed font-light">
            We couldn't locate active medical centers for this region. Click retry to run another scan.
          </p>
        </div>
        <button
          onClick={retryFetch}
          className="px-5 py-2 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-[10px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer"
        >
          Retry Scan
        </button>
      </div>
    );
  }

  const toggleExpand = (id) => {
    setExpandedIds((prev) => {
      const next = !prev[id];
      if (next && onExpand) {
        onExpand(id, 'hospital');
      }
      return {
        ...prev,
        [id]: next
      };
    });
  };

  const toggleAll = () => {
    const nextState = !allExpanded;
    setAllExpanded(nextState);
    const newExpanded = {};
    if (nextState) {
      displayedHospitals.forEach((h) => {
        newExpanded[h.id] = true;
      });
    }
    setExpandedIds(newExpanded);
  };

  return (
    <div className="space-y-5 text-left">
      {/* Control Bar */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono tracking-wide">
          {hospitals.length} medical center{hospitals.length !== 1 ? 's' : ''} found
        </span>
        <button
          onClick={toggleAll}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100/80 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-[9px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 transition-all border border-slate-200/40 dark:border-white/[0.05] cursor-pointer"
        >
          {allExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          <span>{allExpanded ? 'Collapse All' : 'Expand All'}</span>
        </button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {displayedHospitals.map((center, cIdx) => {
          const isExpanded = !!expandedIds[center.id];
          const isPublic = center.isPublic;
          const accentColor = isPublic ? 'emerald' : 'blue';

          return (
            <div
              key={center.id || cIdx}
              onClick={() => toggleExpand(center.id)}
              className={`relative p-4 rounded-2xl neumorphic-card transition-all duration-300 flex flex-col group cursor-pointer overflow-hidden ${
                isExpanded
                  ? `border-${accentColor}-500/30 shadow-md ring-1 ring-${accentColor}-500/10`
                  : 'border-[var(--border)] hover:border-slate-300 dark:hover:border-white/15 hover:shadow-sm'
              }`}
            >
              {/* Left accent bar */}
              <div className={`absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl ${
                isPublic ? 'bg-emerald-500' : 'bg-blue-500'
              }`} />

              <div className="space-y-1.5 pl-2">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
                    isPublic
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                  }`}>
                    {isPublic ? 'Government' : 'Private'}
                  </span>
                  <div className="p-0.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Name */}
                <h4 className="font-heading text-[13px] font-bold text-[var(--text-primary)] leading-tight line-clamp-2">
                  {center.name}
                </h4>

                {/* Address & Distance */}
                <p className="text-[10px] text-[var(--text-muted)] font-light leading-relaxed line-clamp-2">
                  {center.address}
                </p>
                {center.distance && (
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 font-mono">
                    <MapPin className="inline-block mr-1 text-[var(--accent)]" size={10} />{center.distance}
                  </span>
                )}
              </div>

              {/* Collapsible Details */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isExpanded
                    ? 'max-h-[200px] opacity-100 pt-3 mt-3 border-t border-slate-150/40 dark:border-white/[0.05]'
                    : 'max-h-0 opacity-0 pointer-events-none'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-[10px] font-mono text-[var(--text-secondary)] space-y-2.5 pl-2">
                  <div className="flex items-center justify-between">
                    <span className="font-light">Status:</span>
                    <span className="text-emerald-500 font-bold uppercase text-[9px] tracking-wide">
                      Emergency 24/7
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-light">Phone:</span>
                    {center.phone ? (
                      <a
                        href={`tel:${center.phone.split('/')[0].trim()}`}
                        className="text-[var(--accent)] hover:underline flex items-center gap-1 font-bold font-mono text-[9px]"
                      >
                        <Phone className="w-3 h-3" /> {center.phone}
                      </a>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-600 italic text-[8px]">
                        Local Dispatch Only
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 pt-1.5">
                    <button
                      onClick={() => focusOnMap(center.lat, center.lng, center.name)}
                      className="px-2 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-[9px] font-bold uppercase tracking-wider text-slate-700 dark:text-white transition-all flex items-center justify-center gap-1 border border-slate-200/40 dark:border-white/[0.05] cursor-pointer"
                    >
                      <Map className="w-3 h-3 shrink-0 text-[var(--accent)]" />
                      <span>Map</span>
                    </button>

                    {center.website ? (
                      <a
                        href={center.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-[9px] font-bold uppercase tracking-wider text-slate-700 dark:text-white transition-all flex items-center justify-center gap-1 border border-slate-200/40 dark:border-white/[0.05] text-center"
                      >
                        <ExternalLink className="w-3 h-3 shrink-0 text-[var(--accent)]" />
                        <span>Website</span>
                      </a>
                    ) : (
                      <div className="px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-white/[0.02] text-[9px] font-bold uppercase text-slate-400 dark:text-slate-600 flex items-center justify-center gap-1 border border-dashed border-slate-200 dark:border-white/5 select-none">
                        <span>No Site</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Show more button */}
      {hospitals.length > 8 && (
        <div className="text-center pt-2">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-2 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] hover:bg-[var(--border)] text-[10px] font-bold uppercase tracking-wider text-[var(--text-primary)] transition-all cursor-pointer"
          >
            {showAll ? 'Show Less' : `View All ${hospitals.length} Centers`}
          </button>
        </div>
      )}
    </div>
  );
}
