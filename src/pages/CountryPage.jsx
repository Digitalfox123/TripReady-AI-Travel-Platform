import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Globe, MapPin, Landmark, Building, ArrowLeft, ChevronRight, Compass, Sparkles, Loader2, Search, AlertTriangle, ShieldAlert, Share2 } from 'lucide-react';
import { getCountryBySlug } from '../utils/database';
import { updateEntitySEO, clearEntitySEO } from '../utils/seoHelper';
import UmrahGuideCard from '../components/UmrahGuideCard';
import YouTubeTravelSection from '../components/YouTubeTravelSection';

/* ── Skeleton Pulse Component ── */
const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse rounded-xl bg-slate-200/60 dark:bg-white/[0.04] ${className}`} />
);

/* ── Professional Loading Skeleton ── */
function CountryLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] transition-colors duration-500 pt-28 pb-24 overflow-x-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 left-[15%] w-[400px] h-[400px] rounded-full bg-[var(--accent)]/[0.04] filter blur-[120px] animate-pulse" />
        <div className="absolute bottom-40 right-[10%] w-[500px] h-[500px] rounded-full bg-indigo-500/[0.03] filter blur-[140px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="w-12 h-3" />
          <Skeleton className="w-3 h-3 rounded-full" />
          <Skeleton className="w-16 h-3" />
          <Skeleton className="w-3 h-3 rounded-full" />
          <Skeleton className="w-20 h-3" />
        </div>

        {/* Hero card skeleton */}
        <div className="rounded-[32px] overflow-hidden bg-white dark:bg-[#071125] border border-slate-100 dark:border-white/[0.04] p-8 md:p-12 shadow-[0_12px_40px_rgba(2,6,23,0.03)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="space-y-5 flex-1">
              <div className="flex items-center gap-4">
                <Skeleton className="w-16 h-16 rounded-2xl" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="w-32 h-3" />
                  <Skeleton className="w-56 h-8 rounded-2xl" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="w-full h-3" />
                <Skeleton className="w-3/4 h-3" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full md:w-auto shrink-0 md:min-w-[280px]">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.04]">
                  <Skeleton className="w-16 h-2.5 mb-2" />
                  <Skeleton className="w-20 h-4" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Loading indicator */}
        <div className="flex flex-col items-center justify-center py-16 space-y-6">
          <style>{`
            @keyframes loaderBarShift {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(200%); }
            }
            .animate-loader-bar {
              animation: loaderBarShift 1.5s infinite linear;
            }
          `}</style>
          <div className="relative w-20 h-20 flex items-center justify-center mb-2">
            <div className="absolute inset-0 w-full h-full rounded-full border border-dashed border-[var(--accent)]/30 animate-spin-slow" />
            <div className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] rounded-full border border-dotted border-[var(--accent)]/15 animate-spin-reverse-slow" />
            <div className="absolute w-12 h-12 rounded-full bg-[var(--accent)]/10 blur-xl animate-pulse" />
            <Globe size={24} className="text-[var(--accent)] animate-pulse" />
          </div>
          <div className="text-center space-y-2">
            <span className="text-sm font-semibold text-[var(--text-primary)] block">Loading Country Data...</span>
            <span className="text-[11px] text-[var(--text-secondary)] font-light block">Fetching states, cities, and attractions from our database</span>
          </div>
          <div className="w-36 h-[3px] bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-full overflow-hidden relative">
            <div className="absolute top-0 bottom-0 left-0 w-1/2 bg-gradient-to-r from-[var(--accent)]/40 to-[var(--accent)] rounded-full animate-loader-bar" />
          </div>
        </div>

        {/* Card skeleton grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="p-6 rounded-2xl bg-white dark:bg-[#071125] border border-slate-100 dark:border-white/[0.04] space-y-3" style={{ animationDelay: `${i * 150}ms` }}>
              <div className="flex items-center justify-between">
                <Skeleton className="w-32 h-4" />
                <Skeleton className="w-4 h-4 rounded-full" />
              </div>
              <Skeleton className="w-24 h-2.5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Professional Not Found State ── */
function CountryNotFound({ slug, navigate }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[var(--bg-primary)] text-[var(--text-primary)] pt-32 relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] rounded-full bg-rose-500/[0.03] filter blur-[140px]" />
        <div className="absolute bottom-[20%] right-[15%] w-[400px] h-[400px] rounded-full bg-[var(--accent)]/[0.03] filter blur-[120px]" />
      </div>

      <div className="max-w-lg text-center space-y-8 relative z-10">
        {/* Animated icon */}
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 rounded-full bg-rose-500/[0.06] animate-ping" style={{ animationDuration: '2s' }} />
          <div className="relative w-24 h-24 rounded-full bg-white dark:bg-[#071125] border border-slate-100 dark:border-white/[0.06] shadow-lg flex items-center justify-center">
            <AlertTriangle size={36} className="text-rose-500/70" />
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="font-heading text-3xl font-black text-[var(--text-primary)] tracking-tight">Country Not Found</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-light leading-relaxed max-w-sm mx-auto">
            We couldn't locate any country data for <code className="px-2 py-0.5 bg-rose-500/[0.06] border border-rose-500/10 rounded-md font-mono text-[11px] text-rose-500 font-medium">{slug}</code> in our database. This country may not have been indexed yet.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            onClick={() => navigate('/country-explorer')}
            className="btn-primary inline-flex items-center justify-center gap-2"
          >
            <Compass size={15} />
            Open Country Explorer
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-full font-medium transition-all duration-300 text-xs tracking-wide uppercase inline-flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] cursor-pointer border border-slate-200 dark:border-white/[0.06] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.02]"
          >
            <ArrowLeft size={15} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}


export default function CountryPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('states');

  useEffect(() => {
    let active = true;
    setLoading(true);
    async function load() {
      const data = await getCountryBySlug(slug);
      if (active) {
        if (data) {
          setCountry(data);
          updateEntitySEO('country', data);
        } else {
          setCountry(null);
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

  // Show loading skeleton first
  if (loading) {
    return <CountryLoadingSkeleton />;
  }

  // Then show not found if no data
  if (!country) {
    return <CountryNotFound slug={slug} navigate={navigate} />;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-500 pt-28 pb-24 overflow-x-hidden relative">
      {/* ─── Premium Background Effects ─── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.012)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.012)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.003)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.003)_1px,transparent_1px)] bg-[size:40px_40px] opacity-70" />
        {/* Floating orbs */}
        <div className="absolute top-12 left-[10%] w-[350px] h-[350px] rounded-full bg-[var(--accent)]/[0.04] filter blur-[100px] animate-[drift_20s_ease-in-out_infinite]" />
        <div className="absolute bottom-24 right-[10%] w-[450px] h-[450px] rounded-full bg-indigo-500/[0.03] filter blur-[120px] animate-[drift_25s_ease-in-out_infinite_reverse]" />
        <div className="absolute top-[40%] right-[30%] w-[300px] h-[300px] rounded-full bg-purple-500/[0.02] filter blur-[80px] animate-[drift_30s_ease-in-out_infinite]" />
        {/* Top gradient ribbon */}
        <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-b from-[var(--accent)]/[0.02] to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-slate-400 font-medium">
          <Link to="/" className="hover:text-[var(--accent)] transition-colors">Home</Link>
          <ChevronRight size={12} className="text-slate-500" />
          <Link to="/country-explorer" className="hover:text-[var(--accent)] transition-colors">Countries</Link>
          <ChevronRight size={12} className="text-slate-500" />
          <span className="text-slate-600 dark:text-slate-350">{country.name}</span>
        </nav>

        {/* Hero Card */}
        <div 
          itemScope 
          itemType="https://schema.org/Country" 
          className="relative rounded-[32px] overflow-hidden bg-white dark:bg-[#071125] border border-slate-100 dark:border-white/[0.04] p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 shadow-[0_12px_40px_rgba(2,6,23,0.03)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
        >
          {/* Hero decorative gradient */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-[var(--accent)]/[0.04] filter blur-[80px] pointer-events-none" />
          
          <div className="space-y-4 text-left max-w-2xl relative z-10">
            <div className="flex items-center gap-4">
              <span className="text-5xl sm:text-6xl drop-shadow-sm select-none">{country.flag}</span>
              <div>
                <span 
                  itemProp="containedInPlace" 
                  className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-widest block mb-0.5"
                >
                  {country.subregion || country.region || 'Continent'} • {country.iso3}
                </span>
                <h1 
                  itemProp="name" 
                  className="font-heading text-3xl sm:text-5xl font-black text-slate-800 dark:text-white tracking-tight"
                >
                  {country.name}
                </h1>
              </div>
            </div>
            <p 
              itemProp="description" 
              className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-light leading-relaxed font-body"
            >
              Explore states, provinces, and beautiful cities across {country.name}. Set your travel budget, discover top cultural landmarks, and follow customized AI travel itineraries.
            </p>
          </div>

          {/* Quick Metrics Panel */}
          <div className="grid grid-cols-2 gap-4 w-full md:w-auto shrink-0 md:min-w-[280px] relative z-10">
            <div className="p-4 rounded-2xl neumorphic-inset text-left">
              <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 block mb-1">Capital City</span>
              <span className="text-sm font-semibold text-slate-800 dark:text-white flex items-center gap-1.5">
                <Landmark size={14} className="text-blue-500" />
                {country.capital || 'N/A'}
              </span>
            </div>
            <div className="p-4 rounded-2xl neumorphic-inset text-left">
              <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 block mb-1">Region</span>
              <span className="text-sm font-semibold text-slate-800 dark:text-white flex items-center gap-1.5">
                <Globe size={14} className="text-blue-500" />
                {country.region || 'N/A'}
              </span>
            </div>
            <div className="p-4 rounded-2xl neumorphic-inset text-left">
              <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 block mb-1">States/Provinces</span>
              <span className="text-sm font-semibold text-slate-800 dark:text-white flex items-center gap-1.5">
                <Compass size={14} className="text-blue-500" />
                {country.states?.length || country.stateCount || 0}
              </span>
            </div>
            <div className="p-4 rounded-2xl neumorphic-inset text-left">
              <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 block mb-1">Indexed Cities</span>
              <span className="text-sm font-semibold text-slate-800 dark:text-white flex items-center gap-1.5">
                <Building size={14} className="text-blue-500" />
                {country.cities?.length || country.cityCount || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Country Travel Advisory & Information Gain Alert (Original Curation) */}
        <section className="p-6 rounded-[24px] border border-blue-500/15 dark:border-blue-500/10 bg-blue-500/5 dark:bg-blue-500/[0.01] text-left space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-blue-500/[0.02] filter blur-2xl pointer-events-none" />
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-650 dark:text-blue-400 text-[10px] font-bold uppercase tracking-widest">
              <ShieldAlert className="w-3.5 h-3.5" /> Dynamic Travel Advisory
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Last updated: Today</span>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 items-start">
            <div className="space-y-2">
              <h3 className="font-heading font-bold text-sm sm:text-base text-luxury-primary dark:text-white">
                Safety & Entrance Guidelines for {country.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed font-body">
                {country.name === 'Saudi Arabia' 
                  ? 'Pilgrims intending to perform Umrah must secure active permits via the official Nusuk application. Ensure all visa guidelines are registered prior to flight departure. Standard emergency hotline is 911.'
                  : `Travelers to ${country.name} are advised to carry digital copies of identification, check active visa rules relative to country passports, and keep local embassy hotlines handy.`
                }
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-heading font-bold text-sm sm:text-base text-luxury-primary dark:text-white">
                Seasonal Packing Recommendation
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed font-body">
                {country.name === 'Saudi Arabia'
                  ? 'Peak temperatures in summer can exceed 45°C. Carry light cotton clothing, dynamic hydration accessories, and sunblock. Winter nights are mild but cooler in northern deserts.'
                  : `Ensure to monitor changing weather reports for ${country.name}. Pack multi-layered garments to adapt to local regional temperature shifts.`
                }
              </p>
            </div>
          </div>
        </section>

        {/* Dynamic Citation & Share Tool (Driving High-Quality Backlinks) */}
        <section className="p-6 rounded-[24px] border border-slate-150 dark:border-white/[0.04] bg-white dark:bg-[#071125] text-left space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h4 className="font-heading font-extrabold text-sm sm:text-base text-luxury-primary dark:text-white flex items-center gap-2">
              <Share2 className="w-4.5 h-4.5 text-[var(--accent)]" /> Cite or Link to this Guide
            </h4>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Reference OS</span>
          </div>
          
          <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed font-body">
            Are you a travel blogger, academic researcher, or publishing outlet? Use the copy deck below to cite or link back to this verified {country.name} travel directory.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => {
                const attribution = `<a href="${window.location.origin}/country/${country.slug}">${country.flag} ${country.name} Travel Directory - TripReady</a>`;
                navigator.clipboard.writeText(attribution);
                alert('HTML Citation Copied!');
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/[0.06] hover:border-[var(--accent)] text-slate-700 dark:text-slate-200 hover:text-[var(--accent)] text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all select-none cursor-pointer"
            >
              Copy HTML Citation
            </button>
            <button
              onClick={() => {
                const attribution = `[${country.flag} ${country.name} Travel Directory - TripReady](${window.location.origin}/country/${country.slug})`;
                navigator.clipboard.writeText(attribution);
                alert('Markdown Citation Copied!');
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/[0.06] hover:border-[var(--accent)] text-slate-700 dark:text-slate-200 hover:text-[var(--accent)] text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all select-none cursor-pointer"
            >
              Copy Markdown Link
            </button>
          </div>
        </section>

        {/* Featured Religious Experiences for Saudi Arabia */}
        {slug === 'saudi-arabia' && (
          <section className="animate-fade-in p-6 sm:p-8 rounded-[32px] border border-amber-500/15 dark:border-amber-500/10 bg-amber-500/5 dark:bg-amber-500/[0.01] relative overflow-hidden text-left space-y-6">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-amber-500/[0.03] filter blur-3xl pointer-events-none" />
            
            <div className="space-y-1.5 relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase tracking-widest select-none animate-pulse">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Featured Religious Experiences</span>
              </span>
              <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-luxury-primary dark:text-white">
                Spiritual Faith Journeys
              </h2>
              <p className="text-xs text-slate-550 dark:text-slate-400 font-light leading-relaxed font-body">
                Saudi Arabia is home to the two holiest sanctuaries of Islam, welcoming millions of pilgrims annually. Plan your spiritual rituals with our flagship planner.
              </p>
            </div>

            <div className="max-w-2xl relative z-10">
              <UmrahGuideCard />
            </div>
          </section>
        )}

        {/* Dynamic Navigation Tabs */}
        <div className="space-y-6">
          <div className="border-b border-white/5 flex gap-2 pb-px overflow-x-auto no-scrollbar">
            {[
              { id: 'states', label: `States / Provinces (${country.states?.length || 0})` },
              { id: 'cities', label: `Cities (${country.cities?.length || 0})` },
              { id: 'attractions', label: `Attractions (${country.attractions?.length || 0})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 border-b-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-[var(--accent)] text-[var(--accent)]'
                    : 'border-transparent text-slate-400 dark:text-slate-455 hover:text-luxury-primary dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: States */}
          {activeTab === 'states' && (
            <div className="animate-fade-in">
              {country.states && country.states.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {country.states.map((st) => (
                    <Link
                      key={st.id}
                      to={`/state/${st.slug}`}
                      className="group p-6 rounded-2xl bg-white dark:bg-[#071125] border border-slate-100 dark:border-white/[0.04] text-left flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <div className="space-y-1">
                        <h4 className="font-heading font-bold text-slate-800 dark:text-white text-base truncate group-hover:text-blue-400 transition-colors">
                          {st.name}
                        </h4>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono uppercase tracking-widest block">
                          {st.cityCount || 0} Cities Indexed
                        </span>
                      </div>
                      <ChevronRight size={16} className="text-slate-400 group-hover:text-[var(--accent)] transition-colors shrink-0" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white/80 dark:bg-[#071125]/80 border border-slate-100 dark:border-white/[0.04] rounded-[24px] space-y-3 backdrop-blur-sm">
                  <span className="text-3xl block">🏛️</span>
                  <p className="text-sm text-slate-400 font-light">No states or administrative areas found for {country.name}.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Cities */}
          {activeTab === 'cities' && (
            <div className="animate-fade-in">
              {country.cities && country.cities.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {country.cities.map((ct) => (
                    <Link
                      key={ct.id}
                      to={`/city/${ct.slug}`}
                      className="group p-5 rounded-2xl bg-white dark:bg-[#071125] border border-slate-100 dark:border-white/[0.04] text-left flex flex-col justify-between h-[120px] shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-heading font-bold text-slate-800 dark:text-white text-sm truncate group-hover:text-blue-400 transition-colors">
                            {ct.name}
                          </h4>
                          {ct.isCapital && (
                            <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 text-[8px] font-bold uppercase rounded-full tracking-wider shrink-0 flex items-center gap-0.5">
                              ★ Capital
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 block truncate">
                          State: {ct.stateName || 'N/A'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-[9px] text-[var(--accent)] font-semibold border-t border-slate-50 dark:border-white/[0.02] pt-2 mt-2">
                        <span>View Guide & Weather</span>
                        <ChevronRight size={12} />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white/80 dark:bg-[#071125]/80 border border-slate-100 dark:border-white/[0.04] rounded-[24px] space-y-3 backdrop-blur-sm">
                  <span className="text-3xl block">🏙️</span>
                  <p className="text-sm text-slate-400 font-light">No cities indexed for {country.name}.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Attractions */}
          {activeTab === 'attractions' && (
            <div className="animate-fade-in">
              {country.attractions && country.attractions.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {country.attractions.map((attr) => {
                    // Build accurate Wikipedia image URL from attraction name
                    const wikiTitle = encodeURIComponent(attr.name.replace(/\s+/g, '_'));
                    const imgUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${wikiTitle}`;
                    
                    return (
                      <AttractionCard key={attr.id} attr={attr} />
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-20 bg-white/80 dark:bg-[#071125]/80 border border-slate-100 dark:border-white/[0.04] rounded-[24px] space-y-3 backdrop-blur-sm">
                  <Landmark size={32} className="text-slate-300 dark:text-slate-600 mx-auto" />
                  <p className="text-sm text-slate-400 font-light">
                    No attractions uploaded yet. Once our global database is ready, top sightseeing recommendations will load here automatically.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ─── YOUTUBE TRAVEL EXPERIENCE SECTION ─── */}
        <div className="mt-12 pt-8 border-t border-slate-100 dark:border-white/[0.04]">
          <YouTubeTravelSection destination={country.name} />
        </div>

      </div>
    </div>
  );
}


/* ── Attraction Card with accurate Wikipedia thumbnail ── */
function AttractionCard({ attr }) {
  const [imgSrc, setImgSrc] = useState(null);
  const [imgLoading, setImgLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function fetchImage() {
      try {
        // 1. Search Wikipedia first (never 404s, always 200 OK)
        const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(attr.name + " " + attr.cityName)}&format=json&origin=*`;
        const searchRes = await fetch(searchUrl);
        if (searchRes.ok) {
          const searchData = await searchRes.json();
          const results = searchData?.query?.search || [];
          if (results.length > 0) {
            const pageTitle = results[0].title;
            // 2. Fetch page summary for exact matched page title
            const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle.replace(/\s+/g, '_'))}`);
            if (res.ok) {
              const data = await res.json();
              if (active && data.thumbnail?.source) {
                setImgSrc(data.thumbnail.source);
              }
            }
          }
        }
      } catch (e) {
        // Silently fail — no image
      } finally {
        if (active) setImgLoading(false);
      }
    }
    fetchImage();
    return () => { active = false; };
  }, [attr.name]);

  return (
    <Link
      to={`/attraction/${attr.slug}`}
      className="group rounded-2xl overflow-hidden bg-white dark:bg-[#071125] border border-slate-100 dark:border-white/[0.04] text-left flex flex-col shadow-sm hover:shadow-md transition-all duration-300"
    >
      {/* Image section */}
      <div className="relative h-40 bg-slate-100 dark:bg-white/[0.02] overflow-hidden">
        {imgLoading ? (
          <div className="absolute inset-0 animate-pulse bg-slate-200/60 dark:bg-white/[0.04]" />
        ) : imgSrc ? (
          <img 
            src={imgSrc} 
            alt={attr.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-50 dark:bg-white/[0.01]">
            <Landmark size={28} className="text-slate-300 dark:text-slate-600" />
          </div>
        )}
        {/* Category badge */}
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-md text-white text-[8px] font-bold uppercase tracking-wider">
          {attr.category || 'Sightseeing'}
        </span>
      </div>

      {/* Info section */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          <h4 className="font-heading font-bold text-slate-800 dark:text-white text-base leading-tight line-clamp-2 group-hover:text-blue-400 transition-colors">
            {attr.name}
          </h4>
          <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-405 font-medium">
            <MapPin size={10} className="text-[var(--accent)]" />
            {attr.cityName}
          </span>
        </div>
        <div className="flex items-center justify-between text-[9px] text-[var(--accent)] font-semibold border-t border-slate-50 dark:border-white/[0.02] pt-3 mt-3">
          <span>View Attraction Details</span>
          <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
