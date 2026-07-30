import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Plane,
  Building2,
  UtensilsCrossed,
  Car,
  Ticket,
  ArrowRight,
  DollarSign,
  Layers,
  Globe,
  Sparkles,
  FileText,
  Wallet,
  Compass,
  Crown,
  ChevronDown,
  MapPin,
  Check
} from 'lucide-react';

const DESTINATIONS = [
  { id: 'bali', name: 'Bali, Indonesia' },
  { id: 'dubai', name: 'Dubai, UAE' },
  { id: 'newyork', name: 'New York, USA' },
  { id: 'paris', name: 'Paris, France' },
  { id: 'rome', name: 'Rome, Italy' },
  { id: 'tokyo', name: 'Tokyo, Japan' },
];

const DAILY_COSTS = {
  tokyo:   { budget: { flights: 35, hotels: 40, food: 20, transport: 10, activities: 15 }, midrange: { flights: 55, hotels: 90, food: 40, transport: 18, activities: 30 }, luxury: { flights: 95, hotels: 220, food: 80, transport: 35, activities: 70 } },
  paris:   { budget: { flights: 40, hotels: 50, food: 25, transport: 8,  activities: 18 }, midrange: { flights: 65, hotels: 110, food: 50, transport: 15, activities: 35 }, luxury: { flights: 110, hotels: 260, food: 95, transport: 30, activities: 80 } },
  bali:    { budget: { flights: 25, hotels: 18, food: 10, transport: 5,  activities: 10 }, midrange: { flights: 40, hotels: 50, food: 22, transport: 10, activities: 20 }, luxury: { flights: 70, hotels: 160, food: 55, transport: 25, activities: 50 } },
  dubai:   { budget: { flights: 45, hotels: 60, food: 30, transport: 12, activities: 20 }, midrange: { flights: 75, hotels: 140, food: 55, transport: 22, activities: 40 }, luxury: { flights: 130, hotels: 320, food: 110, transport: 45, activities: 95 } },
  newyork: { budget: { flights: 40, hotels: 55, food: 30, transport: 12, activities: 18 }, midrange: { flights: 70, hotels: 130, food: 55, transport: 20, activities: 38 }, luxury: { flights: 120, hotels: 300, food: 100, transport: 40, activities: 85 } },
  rome:    { budget: { flights: 35, hotels: 40, food: 20, transport: 8,  activities: 15 }, midrange: { flights: 55, hotels: 95, food: 40, transport: 14, activities: 28 }, luxury: { flights: 90, hotels: 230, food: 75, transport: 28, activities: 65 } },
};

const CATEGORIES = [
  { key: 'flights',    label: 'Flights & Transit', color: '#0284C7', icon: Plane }, // Sky Blue
  { key: 'hotels',     label: 'Luxury Stays',      color: '#4F46E5', icon: Building2 }, // Indigo
  { key: 'food',       label: 'Food & Dining',     color: '#8B5CF6', icon: UtensilsCrossed }, // Violet
  { key: 'transport',  label: 'Local Commute',     color: '#06B6D4', icon: Car }, // Cyan
  { key: 'activities', label: 'Tours & Tickets',   color: '#64748B', icon: Ticket }, // Slate
];

const BUDGET_STYLES = [
  { id: 'budget',   label: 'Budget',    icon: Wallet },
  { id: 'midrange', label: 'Mid-Range', icon: Compass },
  { id: 'luxury',   label: 'Luxury',    icon: Crown },
];

const FEATURES = [
  {
    icon: Layers,
    title: '7 Budget Categories',
    description: 'Hotels, flights, food, transport, activities, visa, and emergency funds — all covered.',
  },
  {
    icon: Globe,
    title: '150+ Currencies',
    description: 'Real-time conversion rates so you always know exact costs in your local currency.',
  },
  {
    icon: Sparkles,
    title: 'AI Optimization',
    description: 'Save up to 40% with smart booking tips, seasonal pricing, and budget-friendly alternatives.',
  },
  {
    icon: FileText,
    title: 'Export Reports',
    description: 'Download detailed PDF budget plans to share with travel companions or keep for records.',
  },
];

const styleConfigs = {
  budget: {
    color: '#64748B',
    bgActive: 'bg-slate-500/10 border-slate-500/30 text-slate-700 dark:text-slate-355',
    dotColor: 'bg-slate-500',
  },
  midrange: {
    color: '#3B82F6',
    bgActive: 'bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-350',
    dotColor: 'bg-blue-500',
  },
  luxury: {
    color: '#D97706',
    bgActive: 'bg-amber-500/10 border-amber-500/35 text-amber-800 dark:text-amber-300',
    dotColor: 'bg-amber-500',
  }
};

const FEATURE_COLORS = [
  { iconColor: '#3B82F6', iconBg: 'bg-blue-500/10 dark:bg-blue-500/15' },
  { iconColor: '#8B5CF6', iconBg: 'bg-purple-500/10 dark:bg-purple-500/15' },
  { iconColor: '#EC4899', iconBg: 'bg-pink-500/10 dark:bg-pink-500/15' },
  { iconColor: '#10B981', iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/15' },
];

function useCountUp(target, duration = 1200, active = false) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!active) { setValue(0); return; }
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, duration, active]);

  return value;
}

function DonutChart({ data, total, show }) {
  const size = 180;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedOffset = 0;

  return (
    <div className="relative flex items-center justify-center select-none">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-slate-100 dark:text-white/[0.04]"
          strokeWidth={strokeWidth}
        />
        {data.map((segment, i) => {
          const pct = total > 0 ? segment.value / total : 0;
          const dashLength = pct * circumference;
          const dashGap = circumference - dashLength;
          const offset = accumulatedOffset;
          accumulatedOffset += dashLength;

          return (
            <circle
              key={segment.key}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dashLength} ${dashGap}`}
              strokeDashoffset={-offset}
              className="transition-all duration-1000 ease-out"
              style={{
                opacity: show ? 1 : 0,
                transitionDelay: `${i * 100}ms`,
              }}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total</span>
        <span className="text-xl font-heading font-bold text-luxury-primary dark:text-white mt-0.5">
          ${total.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

export default function BudgetPreviewSection() {
  const [destination, setDestination] = useState('tokyo');
  const [days, setDays] = useState(7);
  const [style, setStyle] = useState('midrange');
  const [calculated, setCalculated] = useState(false);
  const [results, setResults] = useState(null);
  const [isDestDropdownOpen, setIsDestDropdownOpen] = useState(false);

  const destDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (destDropdownRef.current && !destDropdownRef.current.contains(event.target)) {
        setIsDestDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const calculate = useCallback(() => {
    const costs = DAILY_COSTS[destination]?.[style] || DAILY_COSTS['tokyo'][style];
    const breakdown = CATEGORIES.map((cat) => ({
      ...cat,
      value: costs[cat.key] * days,
    }));
    const total = breakdown.reduce((sum, b) => sum + b.value, 0);
    setResults({ breakdown, total });
    setCalculated(true);
  }, [destination, days, style]);

  useEffect(() => {
    setCalculated(false);
    setResults(null);
  }, [destination, days, style]);

  const animatedTotal = useCountUp(results?.total || 0, 1200, calculated);

  return (
    <section className="section-padding bg-[var(--bg-primary)] border-t border-[var(--border)] relative overflow-hidden transition-colors duration-500">
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--accent)] text-[10px] font-bold uppercase tracking-widest mb-4">
            <DollarSign className="w-3.5 h-3.5" />
            <span>AI Budget Planner</span>
          </div>
          <h2 className="section-title">
            Travel budgeting, <span className="italic font-light text-[var(--text-secondary)] dark:text-slate-400">simplified.</span>
          </h2>
          <p className="section-subtitle">
            Get custom cost estimates tailored to your travel style and current travel rates.
          </p>
        </div>

        {/* Core Layout */}
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Configurator Box (Left Column) */}
          <div className="lg:col-span-6 w-full">
            <div className="rounded-[32px] border border-white/60 dark:border-white/[0.07] bg-white/[0.5] dark:bg-[#081125]/[0.45] backdrop-blur-2xl p-6 sm:p-8 space-y-6 text-left group/card shadow-[0_20px_50px_rgba(2,8,19,0.03)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.45)] relative overflow-hidden transition-all duration-350">
              
              {/* Card glare sweep effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] dark:via-white/[0.005] to-transparent -translate-x-full group-hover/card:translate-x-full duration-1000 ease-out pointer-events-none z-20" />

              <h3 className="font-heading text-lg font-bold text-luxury-primary dark:text-white pb-3 border-b border-[var(--border)]">
                Budget Estimator
              </h3>

              {/* Destination */}
              <div>
                <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-2 font-heading">
                  Destination
                </label>
                
                <div className="relative" ref={destDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsDestDropdownOpen(!isDestDropdownOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/60 dark:bg-black/15 border border-slate-200/60 dark:border-white/[0.05] text-[var(--text-primary)] hover:bg-white/80 dark:hover:bg-black/25 hover:border-[var(--accent)]/45 transition-all text-sm font-medium cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-4 h-4 text-[var(--accent)]" />
                      <span>{DESTINATIONS.find(d => d.id === destination)?.name || 'Select Destination'}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-[var(--text-muted)] transition-transform duration-300 ${isDestDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isDestDropdownOpen && (
                    <div className="absolute left-0 right-0 mt-2 p-1.5 rounded-2xl bg-[var(--glass-bg)] border border-[var(--border)] shadow-[0_10px_30px_rgba(2,8,19,0.12)] backdrop-blur-md z-50 animate-scale-in max-h-60 overflow-y-auto scrollbar-thin">
                      {DESTINATIONS.map((d) => (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => {
                            setDestination(d.id);
                            setIsDestDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-sm transition-all cursor-pointer ${
                            destination === d.id
                              ? 'bg-[var(--accent)]/10 text-[var(--accent)] font-semibold'
                              : 'text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <MapPin className={`w-3.5 h-3.5 ${destination === d.id ? 'text-[var(--accent)]' : 'text-slate-400 dark:text-slate-500'}`} />
                            <span>{d.name}</span>
                          </div>
                          {destination === d.id && <Check className="w-4 h-4 text-[var(--accent)]" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Duration Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest font-heading">
                    Duration
                  </label>
                  <span className="text-xs text-[var(--accent)] font-bold font-mono">{days} Days</span>
                </div>
                
                <input
                  type="range"
                  min={1}
                  max={30}
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-[var(--bg-tertiary)] border border-[var(--border)] focus:outline-none accent-[var(--accent)] transition-all hover:scale-[1.002]"
                  style={{
                    background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${((days - 1) / 29 * 100)}%, var(--bg-tertiary) ${((days - 1) / 29 * 100)}%, var(--bg-tertiary) 100%)`
                  }}
                />

                {/* Range Slider ticks */}
                <div className="flex justify-between text-[8px] text-slate-400 dark:text-slate-500 px-1 mt-1.5 font-mono select-none">
                  <span>1d</span>
                  <span>5d</span>
                  <span>10d</span>
                  <span>15d</span>
                  <span>20d</span>
                  <span>25d</span>
                  <span>30d</span>
                </div>
                
                {/* Quick select duration pills */}
                <div className="flex gap-2 mt-3">
                  {[3, 7, 10, 14, 21].map((presetDays) => (
                    <button
                      key={presetDays}
                      type="button"
                      onClick={() => setDays(presetDays)}
                      className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-tight border cursor-pointer hover:scale-105 active:scale-95 transition-all ${
                        days === presetDays
                          ? 'bg-[var(--accent)] text-white border-transparent shadow-[0_4px_12px_rgba(30,64,175,0.2)]'
                          : 'bg-white/60 dark:bg-white/[0.01] border-slate-200 dark:border-white/[0.05] text-[var(--text-muted)] hover:bg-white/90 dark:hover:bg-white/5 hover:border-slate-350 dark:hover:border-white/10'
                      }`}
                    >
                      {presetDays}d
                    </button>
                  ))}
                </div>
              </div>

              {/* Travel Comfort Style */}
              <div>
                <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-3 font-heading">
                  Travel Comfort Style
                </label>
                
                <div className="grid grid-cols-3 gap-3">
                  {BUDGET_STYLES.map((s) => {
                    const IconComponent = s.icon;
                    const isSelected = style === s.id;
                    const config = styleConfigs[s.id];
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setStyle(s.id)}
                        className={`relative py-3.5 rounded-2xl text-center transition-all duration-300 border flex flex-col items-center justify-center gap-2 group cursor-pointer ${
                          isSelected
                            ? `${config.bgActive} border-opacity-100 scale-[1.03] shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)] font-bold`
                            : 'bg-white/40 dark:bg-white/[0.01] border-slate-200 dark:border-white/[0.05] text-[var(--text-secondary)] hover:bg-white/70 dark:hover:bg-white/5 hover:border-slate-355 dark:hover:border-white/10 hover:scale-[1.01]'
                        }`}
                      >
                        {/* Glow effect on hover/active */}
                        {isSelected && (
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/[0.01] dark:to-white/[0.01] rounded-2xl pointer-events-none" />
                        )}
                        <IconComponent className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${isSelected ? '' : 'text-slate-400 dark:text-slate-500'}`} style={isSelected ? { color: config.color } : {}} />
                        <span className="text-[11px] font-heading font-medium tracking-wide">{s.label}</span>
                        
                        {/* Selection indicator */}
                        <div className={`absolute bottom-1 w-5 h-0.5 rounded-full transition-all duration-300 ${isSelected ? `${config.dotColor} scale-100 opacity-100` : 'bg-transparent scale-50 opacity-0'}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Calculate CTA */}
              <button
                type="button"
                onClick={calculate}
                className="w-full btn-sunset flex items-center justify-center gap-2.5 py-3.5 rounded-2xl shadow-premium hover:shadow-[0_8px_24px_rgba(46,91,255,0.25)] dark:hover:shadow-[0_8px_24px_rgba(46,91,255,0.4)] transition-all font-bold cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
              >
                <Sparkles className="w-4.5 h-4.5 text-white" />
                <span>Calculate Budget</span>
              </button>

              {/* Outputs dashboard */}
              {calculated && results && (
                <div className="space-y-6 animate-fade-in pt-6 border-t border-[var(--border)]">
                  
                  {/* Totals + donut chart */}
                  <div className="flex flex-col sm:flex-row items-center gap-8 bg-white/50 dark:bg-black/15 p-5 rounded-2.5xl border border-slate-200/60 dark:border-white/[0.05]">
                    <div className="relative">
                      {/* Soft decorative glow behind donut */}
                      <div className="absolute inset-2 bg-gradient-to-tr from-[var(--accent)]/10 to-transparent blur-xl rounded-full pointer-events-none" />
                      <DonutChart
                        data={results.breakdown}
                        total={results.total}
                        show={calculated}
                      />
                    </div>
                    <div className="text-center sm:text-left space-y-2">
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-extrabold font-heading">Total Estimated Cost</span>
                      <p className="text-4xl font-heading font-black text-[var(--text-primary)] tracking-tight leading-none">
                        <span className="text-xl text-[var(--accent)] font-bold mr-0.5">$</span>
                        {animatedTotal.toLocaleString()}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)] font-normal flex items-center justify-center sm:justify-start gap-1 select-none">
                        <span>For</span>
                        <span className="font-bold text-[var(--text-primary)] font-mono">{days} Days</span>
                        <span>of</span>
                        <span className="px-2 py-0.5 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border)] text-[10px] font-bold text-[var(--accent)]">{BUDGET_STYLES.find((s) => s.id === style)?.label}</span>
                        <span>travel</span>
                      </p>
                    </div>
                  </div>

                  {/* Categories progression lines list */}
                  <div className="space-y-4 pt-1">
                    <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-heading">Cost Breakdown</h4>
                    <div className="space-y-3">
                      {results.breakdown.map((cat, i) => {
                        const pct = results.total > 0 ? ((cat.value / results.total) * 100).toFixed(0) : 0;
                        const Icon = cat.icon;
                        return (
                          <div
                            key={cat.key}
                            className="p-3 rounded-2xl bg-white/40 dark:bg-white/[0.01] border border-slate-200/50 dark:border-white/[0.04] hover:border-[var(--accent)]/20 hover:bg-white/70 dark:hover:bg-white/5 hover:-translate-y-0.5 transition-all duration-300 space-y-2 text-left"
                            style={{ animationDelay: `${i * 60}ms` }}
                          >
                            <div className="flex items-center justify-between text-xs">
                              <span className="flex items-center gap-2 text-[var(--text-primary)]">
                                <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-white dark:bg-slate-900 border border-[var(--border)] shadow-sm shrink-0">
                                  <Icon className="w-3.5 h-3.5" style={{ color: cat.color }} />
                                </div>
                                <span className="font-semibold text-sm">{cat.label}</span>
                              </span>
                              <div className="flex items-baseline gap-1">
                                <span className="font-bold text-[var(--text-primary)] font-mono">${cat.value.toLocaleString()}</span>
                                <span className="text-[10px] text-[var(--text-muted)] font-mono font-medium">({pct}%)</span>
                              </div>
                            </div>
                            
                            {/* Clean minimal line */}
                            <div className="h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                              <div
                                  className="h-full rounded-full transition-all duration-1000 ease-out"
                                  style={{
                                    width: calculated ? `${pct}%` : '0%',
                                    backgroundColor: cat.color,
                                    transitionDelay: `${i * 100 + 200}ms`,
                                  }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              )}
            </div>
          </div>

          {/* Features Column (Right Column) */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {FEATURES.map((feat, i) => {
              const Icon = feat.icon;
              const config = FEATURE_COLORS[i % FEATURE_COLORS.length];
              return (
                <div
                  key={feat.title}
                  className="glass-card relative overflow-hidden bg-gradient-to-b from-white to-slate-50/30 dark:from-[#090f1e]/95 dark:to-[#050915]/98 border border-slate-150/70 dark:border-white/[0.04] p-6 rounded-[28px] shadow-premium flex items-start gap-4 transition-all duration-300 hover:shadow-[0_15px_30px_rgba(2,8,19,0.04)] dark:hover:shadow-[0_20px_45px_rgba(0,0,0,0.4)] hover:-translate-y-1 hover:border-slate-350 dark:hover:border-white/10 group"
                >
                  {/* Subtle glass glare shine on hover */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.015] dark:via-white/[0.005] to-transparent -translate-x-full group-hover:translate-x-full duration-1000 ease-out pointer-events-none" />

                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-inner ${config.iconBg}`} style={{ color: config.iconColor }}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-heading text-base font-bold text-[var(--text-primary)] mb-1.5">
                      {feat.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-light font-body leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* CTA */}
            <div className="pt-4">
              <Link
                to="/budget-planner"
                className="group w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-[var(--text-primary)] hover:bg-[var(--text-primary)]/90 text-[var(--bg-primary)] transition-all duration-300 font-semibold text-xs tracking-wider uppercase shadow-premium hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-[var(--border)] cursor-pointer"
              >
                <span>Open Full Budget Planner</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
