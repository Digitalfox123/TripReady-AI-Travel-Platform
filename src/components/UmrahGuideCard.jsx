import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Compass, DollarSign, Calendar, Star, Bookmark, Share2, Sparkles, Check, CheckCircle2, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function UmrahGuideCard() {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('tripready_umrah_saved');
    if (saved === 'true') {
      setIsSaved(true);
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const nextSaved = !isSaved;
    setIsSaved(nextSaved);
    localStorage.setItem('tripready_umrah_saved', nextSaved.toString());
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/pilgrimage/umrah`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  return (
    <div className="relative group w-full rounded-[32px] border border-slate-200/60 dark:border-white/[0.04] bg-gradient-to-b from-white/70 to-slate-50/40 dark:from-[#0a1224]/80 dark:to-[#050914]/60 backdrop-blur-xl p-5 shadow-[0_10px_35px_rgba(0,0,0,0.02)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:-translate-y-1.5 transition-all duration-500 hover:border-amber-500/25 dark:hover:border-amber-500/15 overflow-hidden text-left">

      {/* Gold ambient lighting */}
      <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-amber-500/[0.04] dark:bg-amber-500/[0.08] filter blur-3xl pointer-events-none z-0" />
      
      {/* Main content: Responsive split layout to reduce vertical height */}
      <div className="relative z-10 flex flex-col lg:flex-row gap-6 items-stretch">
        
        {/* Left side: Cinematic image banner */}
        <div className="w-full lg:w-[45%] shrink-0 relative aspect-[16/10] lg:aspect-auto rounded-[24px] overflow-hidden border border-slate-220 dark:border-white/[0.03] shadow-inner group-hover:shadow-[0_8px_20px_rgba(245,158,11,0.08)] transition-all duration-500 min-h-[220px]">
          <img
            src="/assets/umrah_guide.jpg"
            alt="Makkah Grand Mosque"
            className="w-full h-full object-cover transition-transform duration-[6000ms] ease-out group-hover:scale-104 select-none absolute inset-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent pointer-events-none" />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2 items-center">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-[9px] font-semibold uppercase tracking-wider select-none">
              <Sparkles className="w-2.5 h-2.5 text-amber-400" />
              <span>Religion & Pilgrimage</span>
            </span>
            <span className="px-2.5 py-0.5 rounded bg-emerald-500/80 backdrop-blur-md border border-emerald-400/20 text-white text-[8px] font-sans font-bold uppercase tracking-wider">
              Beginner Friendly
            </span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white/95 text-[10px] font-sans font-medium tracking-wide">
            <span className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs select-none">
              <Clock className="w-3 h-3 text-amber-400" />
              12 min read
            </span>
            <span className="flex items-center gap-0.5 bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs font-semibold text-amber-400 select-none">
              <Star className="w-3 h-3 fill-amber-400 text-transparent" />
              4.9 Rating
            </span>
          </div>
        </div>

        {/* Right side: Information and CTAs */}
        <div className="flex-1 flex flex-col justify-between space-y-4">
          
          {/* Header */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-heading font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300 leading-snug">
                Complete Umrah Guide
              </h3>
              
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="relative">
                  <button
                    onClick={handleShare}
                    aria-label="Share guide"
                    className="w-8 h-8 rounded-full border border-slate-200 dark:border-white/[0.04] bg-white/40 dark:bg-white/[0.01] hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 flex items-center justify-center transition-all cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                  {showShareToast && (
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 rounded bg-black text-white text-[9px] font-sans font-bold whitespace-nowrap shadow-md z-30 animate-fade-in">
                      Link Copied!
                    </span>
                  )}
                </div>

                <button
                  onClick={handleSave}
                  aria-label="Save guide"
                  className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                    isSaved
                      ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500'
                      : 'border-slate-200 dark:border-white/[0.04] bg-white/40 dark:bg-white/[0.01] hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-emerald-500' : ''}`} />
                </button>
              </div>
            </div>
            
            <p className="text-xs text-slate-600 dark:text-slate-450 font-light leading-relaxed font-body">
              Everything you need to plan and perform Umrah confidently. Includes step-by-step rituals, budget models, packing check-offs, and historical summaries of Makkah and Madinah.
            </p>
          </div>

          {/* Quick parameters grid */}
          <div className="grid grid-cols-2 gap-2 text-[10px] sm:text-xs font-body font-light text-slate-550 dark:text-slate-400 py-2.5 border-y border-slate-200/50 dark:border-white/[0.04] px-1 bg-slate-50/30 dark:bg-white/[0.005] rounded-xl">
            <div className="flex items-center gap-2">
              <div className="w-6.5 h-6.5 rounded-lg bg-amber-500/10 dark:bg-amber-500/5 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                <DollarSign className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <span className="text-[8px] text-slate-450 dark:text-slate-500 block leading-none mb-0.5">Average Cost</span>
                <span className="font-semibold text-slate-800 dark:text-slate-250 font-heading">$800 - $1,500</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-6.5 h-6.5 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/5 flex items-center justify-center text-indigo-650 dark:text-indigo-400 shrink-0">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <span className="text-[8px] text-slate-450 dark:text-slate-500 block leading-none mb-0.5">Recommended</span>
                <span className="font-semibold text-slate-800 dark:text-slate-250 font-heading">7 - 14 Days</span>
              </div>
            </div>
          </div>

          {/* Features list */}
          <div className="space-y-1 px-1 text-left">
            <span className="text-[8px] font-sans font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Guide Pillar Core Features
            </span>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 pt-0.5 text-[10px] font-medium text-slate-655 dark:text-slate-400">
              {[
                'Step-by-Step Umrah Guide',
                'Budget Calculator',
                'Days Planner',
                'Ziyarat Guide',
                'Packing Checklist',
                'Travel Requirements'
              ].map((f) => (
                <span key={f} className="flex items-center gap-1 truncate">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                  <span className="truncate">{f}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="pt-1 px-1">
            <Link
              to={user ? "/pilgrimage/umrah" : "/auth"}
              state={!user ? { mode: 'signup', from: '/pilgrimage/umrah' } : undefined}
              className="w-full py-3 rounded-xl font-heading text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 bg-amber-500/10 hover:bg-amber-500 text-amber-700 hover:text-white dark:bg-amber-500/20 dark:text-amber-400 dark:hover:text-black shadow-[0_4px_12px_rgba(245,158,11,0.05)] border border-amber-500/20 dark:border-amber-400/25 active:scale-[0.98] relative overflow-hidden group/btn"
            >
              <span className="absolute inset-0 w-[30%] h-full bg-white/20 transform skew-x-[-30deg] -translate-x-full group-hover/btn:animate-[sweep_1s_ease-in-out]" />
              <span>{user ? 'Start Planning Your Umrah' : 'Start Planning Your Umrah (Unlock)'}</span>
              {user ? (
                <Compass className="w-4 h-4 group-hover/btn:rotate-45 transition-transform duration-350" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 animate-bounce" />
              )}
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
