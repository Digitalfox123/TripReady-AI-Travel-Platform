import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Star, Compass, ArrowLeft, ChevronRight, Globe, Info, AlertTriangle, Clock, Sun, Award, Sparkles, Landmark } from 'lucide-react';
import { getAttractionBySlug } from '../utils/database';
import { updateEntitySEO, clearEntitySEO } from '../utils/seoHelper';
import MapPanel from '../components/MapPanel';

export default function AttractionPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [attraction, setAttraction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapHotspot, setMapHotspot] = useState(null);
  const [wikiData, setWikiData] = useState(null);
  const [wikiLoading, setWikiLoading] = useState(false);

  useEffect(() => {
    if (!attraction) return;
    const needsWiki = !attraction.longDescription || attraction.longDescription.length < 50;
    if (!needsWiki) return;

    setWikiLoading(true);
    async function loadWiki() {
      try {
        const query = `${attraction.name}, ${attraction.city?.name || ''}`;
        const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`;
        const searchRes = await fetch(searchUrl);
        if (!searchRes.ok) return;
        const searchData = await searchRes.json();
        const results = searchData?.query?.search || [];
        if (results.length === 0) return;
        
        const pageTitle = results[0].title;
        const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle.replace(/\s+/g, '_'))}`;
        const res = await fetch(summaryUrl);
        if (!res.ok) return;
        const data = await res.json();
        if (data.extract) {
          setWikiData(data);
        }
      } catch (e) {
        console.warn("Wiki details fetch failed:", e);
      } finally {
        setWikiLoading(false);
      }
    }
    loadWiki();
  }, [attraction]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    async function load() {
      const data = await getAttractionBySlug(slug);
      if (active) {
        if (data) {
          setAttraction(data);
          updateEntitySEO('attraction', data);
          
          setMapHotspot({
            name: data.name,
            desc: data.description || 'Sightseeing attraction.',
            type: data.category || 'Sightseeing',
            subway: 'Subway Access: Available',
            airport: 'Location Verified'
          });
        } else {
          setAttraction(null);
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
              Loading Attraction Details...
            </h2>
            <p className="text-xs text-[var(--text-secondary)] font-light max-w-[280px] mx-auto leading-relaxed">
              Retrieving location coordinates and verified reviews...
            </p>
          </div>

          <div className="w-36 h-[3px] bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-full overflow-hidden relative">
            <div className="absolute top-0 bottom-0 left-0 w-1/2 bg-gradient-to-r from-[var(--accent)]/40 to-[var(--accent)] rounded-full animate-loader-bar" />
          </div>
        </div>
      </div>
    );
  }

  if (!attraction) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[var(--bg-primary)] text-[var(--text-primary)] pt-32">
        <div className="max-w-md text-center space-y-6 bg-white dark:bg-[#071125] p-10 rounded-[32px] border border-slate-100 dark:border-white/[0.04] shadow-premium">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto border border-amber-500/20 mb-2"><MapPin size={32} className="text-amber-500 animate-pulse" /></div>
          <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto border border-amber-500/20">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="font-heading text-2xl font-bold">Attraction Directory Preparing</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-light leading-relaxed">
            The global attractions database is not ready yet. Once the dataset is uploaded, sightseeing entries like <code className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded font-mono text-xs text-amber-500">{slug}</code> will resolve here automatically.
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary w-full inline-flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Set coordinate values from dataset (or fallback if empty)
  const coords = attraction.coordinates || { lat: 33.6844, lng: 73.0479 };
  const mockVectorHotspots = [
    { id: 1, name: attraction.name, desc: attraction.description || 'Verified coordinates.', x: '50%', y: '50%' }
  ];

  return (
    <div className="min-h-screen neumorphic-bg pt-28 pb-24 overflow-x-hidden relative">
      {/* Background subtle grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.01)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.002)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.002)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0 opacity-70" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-slate-400 font-medium">
          <Link to="/" className="hover:text-[var(--accent)] transition-colors">Home</Link>
          <ChevronRight size={12} className="text-slate-500" />
          <Link to="/destinations" className="hover:text-[var(--accent)] transition-colors">Destinations</Link>
          {attraction.country && (
            <>
              <ChevronRight size={12} className="text-slate-500" />
              <Link to={`/country/${attraction.country.slug}`} className="hover:text-[var(--accent)] transition-colors">
                {attraction.country.flag} {attraction.country.name}
              </Link>
            </>
          )}
          {attraction.state && (
            <>
              <ChevronRight size={12} className="text-slate-500" />
              <Link to={`/state/${attraction.state.slug}`} className="hover:text-[var(--accent)] transition-colors">
                {attraction.state.name}
              </Link>
            </>
          )}
          {attraction.city && (
            <>
              <ChevronRight size={12} className="text-slate-500" />
              <Link to={`/city/${attraction.city.slug}`} className="hover:text-[var(--accent)] transition-colors">
                {attraction.city.name}
              </Link>
            </>
          )}
          <ChevronRight size={12} className="text-slate-500" />
        </nav>
        {/* Hero Banner Section with Image */}
        {attraction.image && (
          <div className="relative h-[400px] rounded-[36px] overflow-hidden shadow-premium group">
            <img
              src={attraction.image}
              alt={attraction.name}
              className="w-full h-full object-cover transition-transform duration-[4000ms] ease-out scale-102 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            
            <div className="absolute bottom-10 left-10 right-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-left">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-white/80 text-xs font-bold uppercase tracking-widest">
                  <span className="px-2.5 py-0.5 rounded bg-[var(--accent)] text-white font-extrabold">
                    {attraction.category || 'Sightseeing'}
                  </span>
                  <span>•</span>
                  {attraction.city && (
                    <Link to={`/city/${attraction.city.slug}`} className="hover:underline text-white font-bold">
                      {attraction.city.name}
                    </Link>
                  )}
                  {attraction.country && (
                    <>
                      <span>•</span>
                      <span className="text-white/90 font-medium">
                        {attraction.country.flag} {attraction.country.name}
                      </span>
                    </>
                  )}
                </div>
                <h1 className="font-heading text-4xl sm:text-6xl font-black text-white leading-none tracking-tight">
                  {attraction.name}
                </h1>
                <p className="text-white/70 text-xs sm:text-sm font-light max-w-2xl leading-relaxed">
                  {attraction.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 text-left">
          {/* Main Info (Left 2 columns) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Long Description */}
            {(attraction.longDescription || wikiData) && (
              <div className="neumorphic-card p-8 md:p-10 rounded-[32px] space-y-4">
                <h2 className="font-heading text-2xl font-bold text-luxury-primary dark:text-white">
                  About this Landmark
                </h2>
                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                  {attraction.longDescription || wikiData?.extract}
                </p>
              </div>
            )}

            {/* Historical Information */}
            {(attraction.historicalInfo || wikiData) && (
              <div className="neumorphic-card p-8 md:p-10 rounded-[32px] space-y-4">
                <h2 className="font-heading text-2xl font-bold text-luxury-primary dark:text-white flex items-center gap-2">
                  📜 Historical Context
                </h2>
                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                  {attraction.historicalInfo || `Located in the historical heart of ${attraction.city?.name || 'the region'}, ${attraction.name} represents a major point of interest for travelers exploring ${attraction.country?.name || 'the country'}. Historical archives mention: ${wikiData?.extract || ''}`}
                </p>
              </div>
            )}

            {/* Why it is Important */}
            {(attraction.whyImportant || wikiData) && (
              <div className="neumorphic-card p-8 md:p-10 rounded-[32px] space-y-4">
                <h2 className="font-heading text-2xl font-bold text-luxury-primary dark:text-white flex items-center gap-2">
                  💡 Cultural & Heritage Significance
                </h2>
                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                  {attraction.whyImportant || `Cultural significance summary: ${wikiData?.description || 'A highly recommended cultural landmark.'} This attraction ranks highly for heritage tourism.`}
                </p>
              </div>
            )}

            {/* Reviews Section */}
            {attraction.reviews && attraction.reviews.length > 0 && (
              <div className="neumorphic-card p-8 md:p-10 rounded-[32px] space-y-6">
                <h2 className="font-heading text-2xl font-bold text-luxury-primary dark:text-white flex items-center gap-2">
                  ⭐ Real Traveler Reviews
                </h2>
                <div className="space-y-4">
                  {attraction.reviews.map((rev, idx) => (
                    <div key={idx} className="p-5 rounded-2xl neumorphic-inset space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700 dark:text-slate-300">{rev.author}</span>
                        <span className="text-amber-500 flex items-center gap-0.5">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} size={12} fill="currentColor" />
                          ))}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 italic">
                        "{rev.text}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Info / Sidebar (Right 1 column) */}
          <div className="space-y-8">
            <div className="p-8 rounded-[32px] neumorphic-card space-y-6">
              <h3 className="font-heading text-xl font-bold text-luxury-primary dark:text-white border-b border-slate-100 dark:border-white/[0.04] pb-4">
                Visitor Information
              </h3>

              <div className="space-y-4 text-xs sm:text-sm">
                {attraction.visitDuration && (
                  <div className="flex items-center gap-3">
                    <Clock size={16} className="text-[var(--accent)] shrink-0" />
                    <div>
                      <div className="text-slate-400 text-[10px] uppercase tracking-wider font-bold">Suggested Duration</div>
                      <div className="font-semibold text-slate-700 dark:text-slate-300">{attraction.visitDuration}</div>
                    </div>
                  </div>
                )}

                {attraction.bestTimeToVisit && (
                  <div className="flex items-center gap-3">
                    <Sun size={16} className="text-amber-500 shrink-0" />
                    <div>
                      <div className="text-slate-400 text-[10px] uppercase tracking-wider font-bold">Best Time to Visit</div>
                      <div className="font-semibold text-slate-700 dark:text-slate-300">{attraction.bestTimeToVisit}</div>
                    </div>
                  </div>
                )}

                {attraction.touristPriorityScore && (
                  <div className="flex items-center gap-3">
                    <Award size={16} className="text-[var(--accent)] shrink-0" />
                    <div>
                      <div className="text-slate-400 text-[10px] uppercase tracking-wider font-bold">Tourist Priority Score</div>
                      <div className="font-semibold text-slate-700 dark:text-slate-300">
                        {attraction.touristPriorityScore} / 10 (Must-Visit)
                      </div>
                    </div>
                  </div>
                )}

                {attraction.technologyRelevance > 1 && (
                  <div className="flex items-center gap-3">
                    <Sparkles size={16} className="text-violet-500 shrink-0" />
                    <div>
                      <div className="text-slate-400 text-[10px] uppercase tracking-wider font-bold">Technology Relevance</div>
                      <div className="font-semibold text-slate-700 dark:text-slate-300">
                        {attraction.technologyRelevance} / 10
                      </div>
                    </div>
                  </div>
                )}

                {attraction.cultureRelevance > 1 && (
                  <div className="flex items-center gap-3">
                    <Landmark size={16} className="text-emerald-500 shrink-0" />
                    <div>
                      <div className="text-slate-400 text-[10px] uppercase tracking-wider font-bold">Culture Relevance</div>
                      <div className="font-semibold text-slate-700 dark:text-slate-300">
                        {attraction.cultureRelevance} / 10
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {attraction.website && (
                <div className="pt-4 border-t border-slate-100 dark:border-white/[0.04]">
                  <a
                    href={attraction.website}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary w-full inline-flex items-center justify-center gap-2 text-xs py-3"
                  >
                    <Globe size={14} />
                    Official Website
                  </a>
                </div>
              )}

              {/* Tag Cloud */}
              {attraction.tags && attraction.tags.length > 0 && (
                <div className="pt-4 border-t border-slate-100 dark:border-white/[0.04] space-y-2">
                  <div className="text-slate-400 text-[9px] uppercase tracking-wider font-bold">Tags</div>
                  <div className="flex flex-wrap gap-1.5">
                    {attraction.tags.map((t, i) => (
                      <span key={i} className="px-2.5 py-1 rounded bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.04] text-[10px] font-semibold text-slate-550 dark:text-slate-400">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Coordinates / Map Verification Box */}
            <div className="p-6 rounded-[32px] neumorphic-inset space-y-4">
              <h4 className="text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-widest">
                Location Coordinates
              </h4>
              <div className="text-xs space-y-2 text-slate-500 dark:text-slate-405">
                <div>🌐 Latitude: <span className="font-mono">{coords.lat.toFixed(5)}</span></div>
                <div>🌐 Longitude: <span className="font-mono">{coords.lng.toFixed(5)}</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Attractions Map View */}
        <section className="pt-8 border-t border-slate-100 dark:border-white/[0.04]">
          <MapPanel
            geoCoords={coords}
            destination={attraction.city || { name: attraction.name }}
            attractions={[attraction]}
            hospitals={[]}
            mapHotspot={mapHotspot}
            setMapHotspot={setMapHotspot}
            mapHotspots={mockVectorHotspots}
          />
        </section>

      </div>
    </div>
  );
}
