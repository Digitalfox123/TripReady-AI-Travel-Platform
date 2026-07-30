import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, TrendingUp, ArrowRight, Shield, Heart } from 'lucide-react';
import { topDestinations } from '../../data';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../utils/supabaseClient';

export default function DestinationsSection() {
  const navigate = useNavigate();
  const { user, isFallbackMode } = useAuth();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (!user) { setFavorites([]); return; }
    if (isFallbackMode) {
      const allFavs = JSON.parse(localStorage.getItem('tripready_favorites') || '[]');
      setFavorites(allFavs.filter(f => f.user_id === user.id));
    } else {
      supabase.from('favorites').select('*').eq('user_id', user.id).then(({ data }) => { if (data) setFavorites(data); });
    }
  }, [user, isFallbackMode]);

  const toggleFavorite = async (dest, e) => {
    if (e) e.stopPropagation();
    if (!user) { alert('Please log in to save favorites!'); return; }
    const isFav = favorites.some(f => f.item_id === dest.id && f.item_type === 'destination');
    if (isFav) {
      if (isFallbackMode) {
        const allFavs = JSON.parse(localStorage.getItem('tripready_favorites') || '[]');
        const filtered = allFavs.filter(f => !(f.user_id === user.id && f.item_id === dest.id && f.item_type === 'destination'));
        localStorage.setItem('tripready_favorites', JSON.stringify(filtered));
        setFavorites(filtered.filter(f => f.user_id === user.id));
      } else {
        await supabase.from('favorites').delete().eq('user_id', user.id).eq('item_id', dest.id).eq('item_type', 'destination');
        setFavorites(prev => prev.filter(f => f.item_id !== dest.id));
      }
    } else {
      const newFav = { id: crypto.randomUUID(), user_id: user.id, item_id: dest.id, item_name: dest.name, item_type: 'destination', created_at: new Date().toISOString() };
      if (isFallbackMode) {
        const allFavs = JSON.parse(localStorage.getItem('tripready_favorites') || '[]');
        allFavs.unshift(newFav);
        localStorage.setItem('tripready_favorites', JSON.stringify(allFavs));
        setFavorites(allFavs.filter(f => f.user_id === user.id));
      } else {
        await supabase.from('favorites').insert([newFav]);
        setFavorites(prev => [newFav, ...prev]);
      }
    }
  };

  const isFavorite = (id) => favorites.some(f => f.item_id === id && f.item_type === 'destination');

  // Slice to only top 3 destinations for a highly spacious, editorial look
  const featured = topDestinations.slice(0, 3);

  return (
    <section className="section-padding bg-[var(--bg-primary)] text-[var(--text-primary)] border-t border-[var(--border)] relative overflow-hidden transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-luxury-border dark:border-white/[0.08] bg-[var(--bg-secondary)] text-[var(--accent)] text-[10px] font-bold uppercase tracking-widest mb-4">
            <TrendingUp className="w-3 h-3 text-[var(--accent)]" />
            <span>Featured Escapes</span>
          </div>
          <h2 className="section-title">
            Destinations for the <span className="italic font-light text-luxury-secondary dark:text-slate-350">thoughtful traveler.</span>
          </h2>
          <p className="section-subtitle">
            Curated global spots analyzed for climatic windows, budget cap allocations, and structural luxury stays.
          </p>
        </div>
 
        {/* Asymmetrical/Spacious Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {featured.map((dest, idx) => (
            <div
              key={dest.id}
              onClick={() => navigate(`/destination/${dest.id}`)}
              className={`group relative rounded-[28px] overflow-hidden cursor-pointer bg-white dark:bg-[#081125] border border-[var(--border)] shadow-[0_12px_40px_rgba(2,6,23,0.08)] transition-all duration-500 hover:-translate-y-2 ${
                idx === 1 ? 'lg:translate-y-6' : ''
              }`}
            >
              {/* Image Container with high-resolution photography */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80';
                  }}
                />
                
                {/* Soft gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

                {/* Rank Badge */}
                <span className="absolute top-4 left-4 bg-white/90 text-[#0F172A] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm border border-[rgba(15,23,42,0.05)]">
                  Spot #{dest.rank}
                </span>

                {/* Heart Favorite */}
                <button
                  onClick={(e) => toggleFavorite(dest, e)}
                  className={`absolute top-14 left-4 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-300 z-10 ${isFavorite(dest.id) ? 'bg-red-500/80 border border-red-400/50 shadow-lg shadow-red-500/25' : 'bg-black/30 border border-white/15 hover:bg-black/50 hover:border-white/25'}`}
                >
                  <Heart className={`w-4 h-4 transition-all duration-300 ${isFavorite(dest.id) ? 'text-white fill-white scale-110' : 'text-white/80'}`} />
                </button>

                {/* Safe rating */}
                <span className="absolute top-4 right-4 bg-white/20 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm border border-white/20 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-white" /> {dest.safety}
                </span>

                {/* Editorial Text Overlay */}
                <div className="absolute bottom-0 inset-x-0 p-6 text-left space-y-2">
                  <div className="flex items-center gap-1.5 text-white/70 text-xs">
                    <span>{dest.flag}</span>
                    <span className="font-medium tracking-wide uppercase">{dest.country}</span>
                  </div>
                  
                  <h3 className="font-heading text-2xl font-normal text-white">
                    {dest.name}
                  </h3>

                  <p className="text-white/80 text-xs font-light leading-relaxed font-body line-clamp-2">
                    {dest.preview}
                  </p>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-white/60 font-body">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-luxury-accent" /> {dest.bestTime}</span>
                    <span className="font-bold text-luxury-accent">{dest.budget.daily} / day</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-24">
          <button
            onClick={() => navigate('/destinations')}
            className="group btn-primary inline-flex items-center gap-2"
          >
            <span>Explore All Destinations</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
}
