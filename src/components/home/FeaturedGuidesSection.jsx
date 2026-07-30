import { Link } from 'react-router-dom';
import { Sparkles, Compass, Star, Briefcase, Calendar, Globe, ArrowRight, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function FeaturedGuidesSection() {
  const { user } = useAuth();
  return (
    <section className="section-padding bg-[var(--bg-primary)] border-b border-[var(--border)] relative overflow-hidden transition-colors duration-500">
      
      {/* Custom Styles Injection for Card Entrance Keyframes */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes cardEntrance {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.25 rounded-full bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-[10px] font-medium uppercase tracking-[0.18em] shadow-sm select-none">
            <Sparkles className="w-3 h-3 animate-pulse" />
            <span>Spiritual Ecosystem</span>
          </span>
          <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-luxury-primary dark:text-white leading-[1.1] mb-2 text-center text-balance">
            Spiritual Travel, <span className="font-editorial italic font-light text-amber-600 dark:text-amber-400/90">reimagined.</span>
          </h2>
          <p className="text-sm sm:text-base max-w-xl mx-auto text-luxury-secondary dark:text-slate-400 font-light leading-relaxed font-body">
            Navigate sacred routes, verify local guidelines, and plan holy pilgrimages with reverence.
          </p>
        </div>

        {/* Widescreen Landscape Poster Card */}
        <div 
          className="relative overflow-hidden rounded-[20px] border border-[#C9A84C]/30 dark:border-[#C9A84C]/25 bg-[#FAF7F2] dark:bg-[#0B0F1A] max-w-[920px] w-full mx-auto hover:-translate-y-1 hover:shadow-[0_30px_60px_rgba(0,0,0,0.2),_0_0_60px_rgba(201,168,76,0.1)] dark:hover:shadow-[0_40px_80px_rgba(0,0,0,0.6),_0_0_70px_rgba(201,168,76,0.15)] transition-all duration-500 group text-left shadow-[0_20px_50px_rgba(0,0,0,0.12),_0_0_50px_rgba(201,168,76,0.06)] dark:shadow-[0_30px_70px_rgba(0,0,0,0.5),_0_0_60px_rgba(201,168,76,0.1)]"
          style={{
            animation: 'cardEntrance 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards'
          }}
        >
          
          {/* Symmetrical Islamic geometric watermark */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.04] z-0 select-none text-[#C9A84C]">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="islamicGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M30 0 L60 30 L30 60 L0 30 Z" fill="none" stroke="currentColor" strokeWidth="1" />
                  <path d="M0 0 L60 60 M60 0 L0 60" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
                  <circle cx="30" cy="30" r="4" fill="none" stroke="currentColor" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#islamicGrid)" />
            </svg>
          </div>

          {/* Card-wide diagonal reflection sweep on hover */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.015] dark:via-white/[0.005] to-transparent -translate-x-full group-hover:translate-x-full duration-1000 ease-out pointer-events-none z-20" />

          <div className="grid grid-cols-1 md:grid-cols-10 gap-0 items-stretch">
            
            {/* Left Column: Full-height Framed Hero Image (md:col-span-4) */}
            <div className="md:col-span-4 relative overflow-hidden z-10 flex flex-col justify-stretch rounded-t-[20px] md:rounded-l-[20px] md:rounded-tr-none">
              <div className="w-full h-full min-h-[340px] md:min-h-[460px] relative overflow-hidden">
                <img
                  src="/kaaba_arched.jpg"
                  alt="Holy Kaaba Masjid al-Haram Makkah"
                  className="w-full h-full object-cover object-center transition-transform duration-[8000ms] group-hover:scale-[1.02] select-none"
                />
                
                {/* Vignette effect overlay around image edges */}
                <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.6)] pointer-events-none z-10" />

                {/* Subtle dark-to-transparent gradient overlay at the bottom so it bleeds smoothly */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#FAF7F2] dark:from-[#0B0F1A] to-transparent opacity-95 dark:opacity-100 pointer-events-none z-10" />

                {/* Floating Frosted Glass Badges (Top-Left) */}
                <div className="absolute top-4 left-4 z-20">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 dark:bg-black/35 backdrop-blur-[12px] border border-[#C9A84C]/30 dark:border-white/10 text-white text-[11px] font-inter font-normal tracking-wide select-none shadow-md">
                    <Star className="w-3.5 h-3.5 fill-[#C9A84C] text-[#C9A84C]" />
                    <span>FLAGSHIP GUIDE</span>
                  </span>
                </div>

                {/* Rating Badge (Bottom-Left) */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2 px-[14px] py-[8px] rounded-[10px] bg-black/40 backdrop-blur-[12px] border border-white/10 text-white z-20 text-[11px] font-inter tracking-wide shadow-lg">
                  <div className="flex items-center gap-0.5 text-[#C9A84C]">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                  <span className="font-medium text-white">4.9</span>
                  <span className="text-white/60 font-light">(12,000+ pilgrims)</span>
                </div>
              </div>
            </div>

            {/* Right Column: Poster details & Call-to-actions (md:col-span-6) */}
            <div className="md:col-span-6 p-9 flex flex-col justify-between space-y-6 relative overflow-hidden z-10 bg-white/60 dark:bg-black/30 backdrop-blur-[30px] dark:backdrop-blur-[20px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] border-t md:border-t-0 md:border-l border-slate-200/20 dark:border-white/[0.05]">
              
              {/* Subtle top-to-bottom gradient overlay inside right column */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#FAF7F2]/40 dark:to-[#0B0F1A]/40 pointer-events-none z-0" />
              
              <div className="space-y-4 relative z-10">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-inter font-normal tracking-[2px] uppercase text-[#C9A84C] opacity-70 block select-none">
                    FEATURED SPIRITUAL JOURNEY
                  </span>
                  <h3 className="font-editorial text-[36px] sm:text-[42px] font-light tracking-tight text-[#1A1209] dark:text-[#F0EDE8] leading-[1.1] select-none">
                    Complete Umrah Itinerary
                    <span className="font-editorial italic font-normal text-[#C9A84C] dark:text-[#E8C97A] block mt-1">
                      & Planning Guide
                    </span>
                  </h3>
                </div>

                <p className="font-inter text-[15px] font-normal leading-[1.7] text-[#4A3F2F] dark:text-[#F0EDE8]/70 text-balance">
                  Embark on a structured pilgrimage with step-by-step rituals, Nusuk approvals, budget estimates, and interactive maps.
                </p>

                {/* Info Row: Estimated Budget + Trip Duration */}
                <div className="flex flex-col sm:flex-row items-stretch gap-4 relative z-10">
                  <div className="flex-1 flex items-center gap-3.5 bg-white/40 dark:bg-white/[0.05] border border-[#C9A84C]/30 dark:border-[#C9A84C]/20 rounded-xl py-3 px-5">
                    <div className="text-[#C9A84C]">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <span className="font-inter text-[10px] tracking-[0.12em] uppercase text-[#4A3F2F]/50 dark:text-white/40 block leading-none mb-1">
                        ESTIMATED BUDGET
                      </span>
                      <span className="font-inter text-base sm:text-lg font-medium text-[#1A1209] dark:text-[#F0EDE8]">
                        $800 – $1,500
                      </span>
                    </div>
                  </div>
                  
                  <div className="hidden sm:block w-px bg-slate-200/50 dark:bg-white/[0.08]" />

                  <div className="flex-1 flex items-center gap-3.5 bg-white/40 dark:bg-white/[0.05] border border-[#C9A84C]/30 dark:border-[#C9A84C]/20 rounded-xl py-3 px-5">
                    <div className="text-[#C9A84C]">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <span className="font-inter text-[10px] tracking-[0.12em] uppercase text-[#4A3F2F]/50 dark:text-white/40 block leading-none mb-1">
                        TRIP DURATION
                      </span>
                      <span className="font-inter text-base sm:text-lg font-medium text-[#1A1209] dark:text-[#F0EDE8]">
                        7 – 14 Days
                      </span>
                    </div>
                  </div>
                </div>

                {/* Includes Row */}
                <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-left relative z-10 pt-1">
                  <span className="font-inter text-[10px] tracking-[0.12em] uppercase text-[#C9A84C] font-medium mr-1 select-none">
                    INCLUDES:
                  </span>
                  <span className="font-inter text-xs sm:text-[13px] text-[#4A3F2F]/80 dark:text-[#F0EDE8]/65 font-medium">Nusuk Approvals</span>
                  <span className="text-[#C9A84C]/80 select-none text-[10px] px-1">◆</span>
                  <span className="font-inter text-xs sm:text-[13px] text-[#4A3F2F]/80 dark:text-[#F0EDE8]/65 font-medium">Ziyarat Maps</span>
                  <span className="text-[#C9A84C]/80 select-none text-[10px] px-1">◆</span>
                  <span className="font-inter text-xs sm:text-[13px] text-[#4A3F2F]/80 dark:text-[#F0EDE8]/65 font-medium">Interactive Checklist</span>
                  <span className="text-[#C9A84C]/80 select-none text-[10px] px-1">◆</span>
                  <span className="font-inter text-xs sm:text-[13px] text-[#4A3F2F]/80 dark:text-[#F0EDE8]/65 font-medium">Budget Planner</span>
                </div>
              </div>

              {/* Action buttons with 12px gap */}
              <div className="flex flex-col gap-3 pt-3 border-t border-slate-200/20 dark:border-white/[0.06] relative z-10">
                
                {/* Primary CTA */}
                <Link
                  to={user ? "/pilgrimage/umrah" : "/auth"}
                  state={!user ? { mode: 'signup', from: '/pilgrimage/umrah' } : undefined}
                  style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C97A)' }}
                  className="w-full h-[52px] rounded-full text-[#0B0F1A] font-inter font-medium text-[14px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 hover:brightness-110 hover:scale-[1.01] cursor-pointer shadow-md active:scale-[0.99] relative overflow-hidden group/btn"
                >
                  <span className="absolute inset-0 w-[30%] h-full bg-white/20 transform skew-x-[-30deg] -translate-x-full group-hover/btn:animate-[sweep_1.5s_infinite]" />
                  <span>{user ? 'Start Planning Your Umrah' : 'Start Planning Your Umrah (Unlock)'}</span>
                  {user ? (
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 transition-transform duration-300 shrink-0 animate-bounce" />
                  )}
                </Link>
                
                {/* Secondary CTA */}
                <Link
                  to="/pilgrimage"
                  className="w-full h-[52px] rounded-full border border-[#C9A84C]/40 hover:bg-[#C9A84C]/8 text-[#C9A84C] font-inter font-medium text-[14px] uppercase tracking-wider flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-[0.99]"
                >
                  <span>Browse Pilgrimage Hub</span>
                </Link>

              </div>
            </div>

          </div>
        </div>

        {/* Religious Trip Planning notice below card */}
        <div className="mt-8 max-w-4xl mx-auto flex items-start sm:items-center gap-3 p-4 rounded-2xl bg-[#FAF7F2]/55 dark:bg-[#070d1e]/40 backdrop-blur-md border border-slate-200/50 dark:border-white/[0.06] text-[11.5px] sm:text-xs text-slate-650 dark:text-slate-400 leading-relaxed font-body shadow-sm select-none text-left">
          <div className="w-8 h-8 rounded-lg bg-[#C9A84C]/10 dark:bg-indigo-500/20 text-[#C9A84C] dark:text-[#E8C97A] border border-[#C9A84C]/25 dark:border-[#C9A84C]/10 flex items-center justify-center shrink-0">
            <Globe className="w-4 h-4" />
          </div>
          <span>
            Planning another sacred journey? We offer dedicated step-by-step guides for <Link to="/pilgrimage" className="text-amber-600 dark:text-[#E8C97A] font-medium hover:underline transition-colors duration-300">Religious Trip Planning Across the World</Link> covering Christian, Buddhist, Hindu, Sikh, and Jewish pilgrimages.
          </span>
        </div>
      </div>
    </section>
  );
}

