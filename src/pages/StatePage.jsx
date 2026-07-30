import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Globe, MapPin, Landmark, Building, ArrowLeft, ChevronRight, Compass } from 'lucide-react';
import { getStateBySlug } from '../utils/database';
import { updateEntitySEO, clearEntitySEO } from '../utils/seoHelper';

export default function StatePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('cities');

  useEffect(() => {
    let active = true;
    setLoading(true);
    async function load() {
      const data = await getStateBySlug(slug);
      if (active) {
        if (data) {
          setState(data);
          updateEntitySEO('state', data);
        } else {
          setState(null);
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
              Loading State/Province...
            </h2>
            <p className="text-xs text-[var(--text-secondary)] font-light max-w-[280px] mx-auto leading-relaxed">
              Retrieving regional administrative parameters and geography...
            </p>
          </div>

          <div className="w-36 h-[3px] bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-full overflow-hidden relative">
            <div className="absolute top-0 bottom-0 left-0 w-1/2 bg-gradient-to-r from-[var(--accent)]/40 to-[var(--accent)] rounded-full animate-loader-bar" />
          </div>
        </div>
      </div>
    );
  }

  if (!state) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[var(--bg-primary)] text-[var(--text-primary)] pt-32">
        <div className="max-w-md text-center space-y-6 bg-white dark:bg-[#071125] p-10 rounded-[32px] border border-slate-100 dark:border-white/[0.04] shadow-premium">
          <span className="text-5xl block animate-bounce">🏛️</span>
          <h2 className="font-heading text-2xl font-bold">State/Province Not Found</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-light">
            We couldn't locate a state or province with the slug <code className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded font-mono text-xs text-rose-500">{slug}</code>.
          </p>
          <button
            onClick={() => navigate('/country-explorer')}
            className="btn-primary w-full inline-flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Explorer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen neumorphic-bg pt-28 pb-24 overflow-x-hidden relative">
      {/* Dynamic Background subtle grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.01)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.002)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.002)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0 opacity-70" />
      
      {/* Decorative Orbs */}
      <div className="absolute top-12 left-[10%] w-[350px] h-[350px] rounded-full bg-[var(--accent)]/[0.03] filter blur-[80px] pointer-events-none z-0" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-slate-400 font-medium">
          <Link to="/" className="hover:text-[var(--accent)] transition-colors">Home</Link>
          <ChevronRight size={12} className="text-slate-500" />
          <Link to="/country-explorer" className="hover:text-[var(--accent)] transition-colors">Countries</Link>
          {state.country && (
            <>
              <ChevronRight size={12} className="text-slate-500" />
              <Link to={`/country/${state.country.slug}`} className="hover:text-[var(--accent)] transition-colors">
                {state.country.flag} {state.country.name}
              </Link>
            </>
          )}
          <ChevronRight size={12} className="text-slate-500" />
          <span className="text-slate-600 dark:text-slate-350">{state.name}</span>
        </nav>

        {/* Hero Header Card */}
        <div className="relative rounded-[32px] overflow-hidden neumorphic-card p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 text-left">
          <div className="space-y-4 max-w-2xl">
            <span className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-widest block mb-0.5">
              State / Province Territory • {state.country?.name || 'Global'}
            </span>
            <h1 className="font-heading text-3xl sm:text-5xl font-black text-luxury-primary dark:text-white tracking-tight flex items-center gap-3">
              <span>{state.name}</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-light leading-relaxed font-body">
              Explore the cities and towns in {state.name}, {state.country?.name || 'Global'}. Dive into detailed local guides, check out nearby sightseeing options, and plan your routes.
            </p>
            {state.country && (
              <div className="pt-2">
                <Link
                  to={`/country/${state.country.slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.04] text-xs font-semibold hover:text-[var(--accent)] hover:border-[var(--accent)]/30 transition-all duration-300"
                >
                  <span>{state.country.flag}</span>
                  <span>Explore parent country: {state.country.name}</span>
                  <ChevronRight size={12} />
                </Link>
              </div>
            )}
          </div>

          {/* Quick Metrics Panel */}
          <div className="grid grid-cols-2 gap-4 w-full md:w-auto shrink-0 md:min-w-[280px]">
            <div className="p-4 rounded-2xl neumorphic-inset">
              <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500 block mb-1">State Name</span>
              <span className="text-sm font-semibold text-luxury-primary dark:text-white flex items-center gap-1.5">
                <Landmark size={14} className="text-[var(--accent)]" />
                {state.name}
              </span>
            </div>
            <div className="p-4 rounded-2xl neumorphic-inset">
              <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500 block mb-1">Country</span>
              <span className="text-sm font-semibold text-luxury-primary dark:text-white flex items-center gap-1.5">
                <Globe size={14} className="text-[var(--accent)]" />
                {state.country?.name || 'N/A'}
              </span>
            </div>
            <div className="p-4 rounded-2xl neumorphic-inset col-span-2">
              <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500 block mb-1">Indexed Cities</span>
              <span className="text-sm font-semibold text-luxury-primary dark:text-white flex items-center gap-1.5">
                <Building size={14} className="text-[var(--accent)]" />
                {state.cities?.length || state.cityCount || 0} Cities
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Navigation Tabs */}
        <div className="space-y-6">
          <div className="border-b border-slate-100 dark:border-white/[0.04] flex gap-2 pb-px overflow-x-auto no-scrollbar">
            {[
              { id: 'cities', label: `Cities in ${state.name} (${state.cities?.length || 0})` },
              { id: 'attractions', label: `Sightseeing Attractions (${state.attractions?.length || 0})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 border-b-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-b-2 border-[var(--accent)] text-[var(--accent)]'
                    : 'border-transparent text-slate-400 dark:text-slate-455 hover:text-luxury-primary dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: Cities */}
          {activeTab === 'cities' && (
            <div className="animate-fade-in">
              {state.cities && state.cities.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {state.cities.map((ct) => (
                    <Link
                      key={ct.id}
                      to={`/city/${ct.slug}`}
                      className="p-5 rounded-2xl neumorphic-card text-left flex flex-col justify-between h-[110px]"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-heading font-bold text-luxury-primary dark:text-white text-sm truncate">
                          {ct.name}
                        </h4>
                        {ct.isCapital && (
                          <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 text-[8px] font-bold uppercase rounded-full tracking-wider shrink-0 flex items-center gap-0.5">
                            ★ Capital
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between text-[9px] text-[var(--accent)] font-semibold border-t border-slate-50 dark:border-white/[0.02] pt-2">
                        <span>Explore Local Guide</span>
                        <ChevronRight size={12} />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 neumorphic-card rounded-[24px] space-y-3">
                  <span className="text-3xl block">🏙️</span>
                  <p className="text-sm text-slate-400 font-light">No cities indexed inside this state.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Attractions */}
          {activeTab === 'attractions' && (
            <div className="animate-fade-in">
              {state.attractions && state.attractions.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {state.attractions.map((attr) => (
                    <Link
                      key={attr.id}
                      to={`/attraction/${attr.slug}`}
                      className="p-6 rounded-2xl neumorphic-card text-left flex items-start justify-between gap-4"
                    >
                      <div className="space-y-2">
                        <div className="space-y-0.5">
                          <span className="text-[9px] text-slate-400 dark:text-slate-550 font-mono uppercase tracking-widest block">
                            {attr.category || 'Sightseeing'}
                          </span>
                          <h4 className="font-heading font-bold text-luxury-primary dark:text-white text-base truncate">
                            {attr.name}
                          </h4>
                        </div>
                        <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-405 font-medium">
                          <MapPin size={10} className="text-[var(--accent)]" />
                          {attr.cityName}
                        </span>
                      </div>
                      <ChevronRight size={16} className="text-slate-400 shrink-0 self-center" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white dark:bg-[#071125] border border-slate-100 dark:border-white/[0.04] rounded-[24px] space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/[0.03] flex items-center justify-center mx-auto border border-slate-200/50 dark:border-white/[0.05]"><MapPin size={24} className="text-slate-400 dark:text-slate-500" /></div>
                  <p className="text-sm text-slate-400 font-light">
                    No state attractions uploaded yet. Once our global database is ready, top sightseeing recommendations will load here automatically.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
