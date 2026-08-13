import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Globe, Shield, Calendar, Star, Check, Plane, ArrowRight, Sparkles, Compass, CheckCircle2 } from 'lucide-react';

// Lightweight 3D Tilt Card wrapper optimized for 60fps performance (tilt disabled on touch devices)
function TiltCard({ children, className = '', style = {} }) {
  const cardRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState('none');

  const handleMouseMove = (e) => {
    if (!cardRef.current || window.innerWidth < 1024) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    const tiltX = -y * 5;
    const tiltY = x * 5;
    
    setTransformStyle(`perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.01, 1.01, 1.01)`);
  };

  const handleMouseLeave = () => {
    setTransformStyle('none');
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative rounded-[28px] border transition-all duration-300 ease-out select-none ${className}`}
      style={{ 
        transform: transformStyle,
        willChange: transformStyle === 'none' ? 'auto' : 'transform',
        ...style
      }}
    >
      {children}
    </div>
  );
}

export default function ImmersiveDiscoverySection() {
  const sectionRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!sectionRef.current || window.innerWidth < 1024) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    sectionRef.current.style.setProperty('--mouse-x', `${x}px`);
    sectionRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <section 
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="py-20 sm:py-28 bg-[var(--bg-primary)] text-[var(--text-primary)] border-t border-[var(--border)] relative overflow-hidden transition-colors duration-500"
    >
      {/* Background coordinate grid overlay */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.015] pointer-events-none select-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:32px_32px] z-0" />

      {/* Self-contained lightweight keyframes */}
      <style>{`
        @keyframes drawRoute {
          0% { stroke-dashoffset: 240; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes spinSlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes floatPin1 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-draw-route { stroke-dasharray: 240; animation: drawRoute 7s linear infinite; }
        .animate-spin-slow { animation: spinSlow 45s linear infinite; }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* SECTION HEADER — Matching Site Standard (Image 3 Reference) */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20 select-none">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.03] text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>HOW IT WORKS</span>
          </div>

          <h2 className="section-title text-slate-900 dark:text-white">
            From idea to a <span className="italic font-light text-slate-500 dark:text-slate-400">perfect trip.</span>
          </h2>

          <p className="section-subtitle max-w-xl mx-auto text-slate-500 dark:text-slate-400 text-sm sm:text-base mt-3 font-light">
            A simple 3-step workflow designed to transform your travel aspirations into organized reality.
          </p>
        </div>

        {/* CARDS CONTAINER GRID */}
        <div className="relative max-w-6xl mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch relative z-10">
            
            {/* CARD 1 — DISCOVER */}
            <TiltCard 
              className="bg-[#070C18] text-white border-white/10 shadow-xl hover:border-cyan-500/40 p-6 sm:p-7 flex flex-col justify-between group"
              style={{ background: 'radial-gradient(circle at 80% 20%, rgba(6,182,212,0.12) 0%, transparent 60%), linear-gradient(145deg, #070C18 30%, #0F172A 100%)' }}
            >
              <div className="relative h-full flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full border border-cyan-500/30 bg-cyan-950/60 text-cyan-400 text-[11px] font-bold font-mono tracking-widest">
                      01
                    </span>
                    <span className="text-[10px] font-semibold text-cyan-300/90 uppercase tracking-wider flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-cyan-400" /> Exploration
                    </span>
                  </div>

                  <div className="text-left">
                    <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight font-heading">
                      Discover
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300/80 mt-2 leading-relaxed font-light">
                      Explore global destinations, top sights, curated experiences and hidden gems worldwide.
                    </p>
                  </div>
                </div>

                {/* Inner Visual Container — High-Tech Vector 3D Globe (No PNG checkerboard artifacts) */}
                <div className="w-full h-40 sm:h-44 rounded-2xl bg-[#030712]/70 border border-white/10 flex items-center justify-center relative select-none overflow-hidden group-hover:border-cyan-500/20 transition-colors">
                  {/* Subtle ambient glow behind globe */}
                  <div className="absolute inset-0 bg-radial from-cyan-500/20 via-transparent to-transparent opacity-70 blur-xl pointer-events-none" />

                  {/* High-Tech Vector 3D Sphere */}
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-cyan-950/60 via-slate-900/90 to-blue-950/80 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.25)]">
                    
                    {/* Lat/Long Wireframe Rings SVG */}
                    <svg className="absolute inset-0 w-full h-full text-cyan-400/30 animate-spin-slow" viewBox="0 0 100 100" fill="none">
                      <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" />
                      <ellipse cx="50" cy="50" rx="46" ry="18" stroke="currentColor" strokeWidth="0.8" />
                      <ellipse cx="50" cy="50" rx="46" ry="34" stroke="currentColor" strokeWidth="0.8" />
                      <ellipse cx="50" cy="50" rx="18" ry="46" stroke="currentColor" strokeWidth="0.8" />
                      <line x1="50" y1="4" x2="50" y2="96" stroke="currentColor" strokeWidth="0.8" />
                      <line x1="4" y1="50" x2="96" y2="50" stroke="currentColor" strokeWidth="0.8" />
                    </svg>

                    {/* Center Glow Icon */}
                    <Globe className="w-14 h-14 text-cyan-300 stroke-[1.3] relative z-10 drop-shadow-[0_0_12px_rgba(6,182,212,0.7)]" />
                  </div>
                  
                  {/* Floating Map Pins */}
                  <div className="absolute top-5 left-8 z-20 animate-[floatPin1_4s_infinite_ease-in-out]">
                    <div className="p-1.5 rounded-full bg-cyan-500/20 backdrop-blur-xs border border-cyan-400/40 text-cyan-300 shadow-sm">
                      <MapPin size={14} className="fill-cyan-400/50" />
                    </div>
                  </div>
                  <div className="absolute bottom-5 right-8 z-20 animate-[floatPin1_3.5s_infinite_ease-in-out_1s]">
                    <div className="p-1 rounded-full bg-blue-500/20 backdrop-blur-xs border border-blue-400/40 text-blue-300 shadow-sm">
                      <MapPin size={12} className="fill-blue-400/50" />
                    </div>
                  </div>
                </div>

                {/* Action CTA Link */}
                <div className="pt-1 text-left">
                  <span className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors cursor-pointer">
                    <span>Explore Destinations</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </TiltCard>

            {/* CARD 2 — UNDERSTAND */}
            <TiltCard 
              className="bg-[#070C18] text-white border-white/10 shadow-xl hover:border-purple-500/40 p-6 sm:p-7 flex flex-col justify-between group"
              style={{ background: 'radial-gradient(circle at 80% 20%, rgba(168,85,247,0.12) 0%, transparent 60%), linear-gradient(145deg, #070C18 30%, #1E1B4B 100%)' }}
            >
              <div className="relative h-full flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full border border-purple-500/30 bg-purple-950/60 text-purple-400 text-[11px] font-bold font-mono tracking-widest">
                      02
                    </span>
                    <span className="text-[10px] font-semibold text-purple-300/90 uppercase tracking-wider flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-purple-400" /> Intelligence
                    </span>
                  </div>

                  <div className="text-left">
                    <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight font-heading">
                      Understand
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300/80 mt-2 leading-relaxed font-light">
                      Get complete country intelligence: visa policies, safety index, budgets & local transport.
                    </p>
                  </div>
                </div>

                {/* Inner Visual Container — Clean Glassmorphic Intelligence Badge */}
                <div className="w-full h-40 sm:h-44 rounded-2xl bg-[#030712]/70 border border-white/10 flex items-center justify-center relative select-none overflow-hidden p-3.5 group-hover:border-purple-500/20 transition-colors">
                  <div className="w-full max-w-[210px] bg-slate-900/80 border border-white/15 rounded-xl p-3.5 space-y-2.5 z-10 shadow-lg backdrop-blur-md">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-300 font-light flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Visa Policy</span>
                      </span>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/40 bg-emerald-950/70 text-emerald-300">
                        Visa Free
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-300 font-light flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Best Season</span>
                      </span>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-cyan-500/40 bg-cyan-950/70 text-cyan-300">
                        Apr - Oct
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-300 font-light flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-purple-400" />
                        <span>Safety Index</span>
                      </span>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-purple-500/40 bg-purple-950/70 text-purple-300">
                        98% High
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action CTA Link */}
                <div className="pt-1 text-left">
                  <span className="inline-flex items-center gap-2 text-xs font-semibold text-purple-400 group-hover:text-purple-300 transition-colors cursor-pointer">
                    <span>View Country Insights</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </TiltCard>

            {/* CARD 3 — PLAN */}
            <TiltCard 
              className="bg-[#070C18] text-white border-white/10 shadow-xl hover:border-blue-500/40 p-6 sm:p-7 flex flex-col justify-between md:col-span-2 lg:col-span-1 group"
              style={{ background: 'radial-gradient(circle at 80% 20%, rgba(59,130,246,0.12) 0%, transparent 60%), linear-gradient(145deg, #070C18 30%, #0369A1 100%)' }}
            >
              <div className="relative h-full flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full border border-blue-500/30 bg-blue-950/60 text-blue-400 text-[11px] font-bold font-mono tracking-widest">
                      03
                    </span>
                    <span className="text-[10px] font-semibold text-blue-300/90 uppercase tracking-wider flex items-center gap-1.5">
                      <Plane className="w-3.5 h-3.5 rotate-45 text-blue-400" /> AI Planner
                    </span>
                  </div>

                  <div className="text-left">
                    <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight font-heading">
                      Plan
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300/80 mt-2 leading-relaxed font-light">
                      Create personalized AI itineraries with day-by-day routes based on your style & budget.
                    </p>
                  </div>
                </div>

                {/* Inner Visual Container — SVG Route & Badges */}
                <div className="w-full h-40 sm:h-44 rounded-2xl bg-[#030712]/70 border border-white/10 flex items-center justify-center relative select-none overflow-hidden group-hover:border-blue-500/20 transition-colors">
                  <svg className="absolute inset-0 w-full h-full text-cyan-400" viewBox="0 0 200 120" fill="none">
                    <path
                      d="M 20,90 Q 70,25 120,75 T 180,30"
                      stroke="url(#route-glow-clean)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray="5 5"
                      className="animate-draw-route"
                    />
                    <defs>
                      <linearGradient id="route-glow-clean" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#2563EB" />
                        <stop offset="50%" stopColor="#00D4FF" />
                        <stop offset="100%" stopColor="#a855f7" />
                      </linearGradient>
                    </defs>
                  </svg>

                  <div className="absolute left-4 top-3 bg-slate-900/85 border border-white/15 rounded-xl px-3 py-1.5 flex flex-col items-start leading-none backdrop-blur-xs shadow-md">
                    <span className="text-[8px] text-slate-400 uppercase tracking-widest font-semibold mb-0.5">Budget</span>
                    <span className="text-cyan-400 font-bold text-xs">$1,850</span>
                  </div>

                  <div className="absolute right-4 bottom-3 bg-slate-900/85 border border-white/15 rounded-xl px-3 py-1.5 flex items-center gap-1.5 leading-none backdrop-blur-xs shadow-md">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <div className="flex flex-col items-start leading-none">
                      <span className="text-[8px] text-slate-400 uppercase tracking-widest font-semibold mb-0.5">AI Score</span>
                      <span className="text-white font-bold text-xs">9.8/10</span>
                    </div>
                  </div>
                </div>

                {/* Action CTA Link */}
                <div className="pt-1 text-left">
                  <span className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 group-hover:text-blue-300 transition-colors cursor-pointer">
                    <span>Start AI Trip Planner</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </TiltCard>

          </div>

        </div>

      </div>
    </section>
  );
}

