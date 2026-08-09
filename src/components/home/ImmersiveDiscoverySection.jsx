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
      className={`group relative rounded-[24px] sm:rounded-[28px] border transition-transform duration-300 ease-out select-none ${className}`}
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
      className="py-12 sm:py-20 bg-[var(--bg-primary)] text-[var(--text-primary)] border-t border-[var(--border)] relative overflow-hidden transition-colors duration-500"
    >
      {/* Background coordinate grid overlay */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.01] pointer-events-none select-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:32px_32px] z-0" />

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
          50% { transform: translateY(-5px); }
        }
        .animate-draw-route { stroke-dasharray: 240; animation: drawRoute 7s linear infinite; }
        .animate-spin-slow { animation: spinSlow 50s linear infinite; }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 space-y-3 select-none">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 text-xs font-semibold px-3.5 py-1 rounded-full border border-blue-500/20 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>How It Works</span>
            <Plane className="w-3.5 h-3.5 rotate-45 text-blue-500" />
          </div>

          <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-luxury-primary dark:text-white leading-tight">
            From idea to a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500">perfect trip</span>
          </h2>

          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-base font-light max-w-xl mx-auto leading-relaxed">
            A simple 3-step workflow designed to transform your travel aspirations into organized reality.
          </p>
        </div>

        {/* CARDS CONTAINER GRID */}
        <div className="relative max-w-6xl mx-auto">
          
          {/* Grid layout: 1 col on mobile, 2 on tablet, 3 on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7 items-stretch relative z-10">
            
            {/* CARD 1 — DISCOVER */}
            <TiltCard 
              className="bg-[#0A0F1E] text-white border-white/10 shadow-lg hover:border-blue-500/30 p-5 sm:p-6 flex flex-col justify-between"
              style={{ background: 'linear-gradient(145deg, #0A0F1E 30%, #172554 100%)' }}
            >
              <div className="relative h-full flex flex-col justify-between space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full border border-cyan-500/30 bg-cyan-950/60 text-cyan-400 text-[11px] font-bold font-mono tracking-widest">
                      01
                    </span>
                    <span className="text-[10px] font-semibold text-cyan-300/80 uppercase tracking-wider flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5" /> Exploration
                    </span>
                  </div>

                  <div className="text-left">
                    <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                      Discover
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300/80 mt-1.5 leading-relaxed font-light">
                      Explore global destinations, top sights, curated experiences and hidden gems worldwide.
                    </p>
                  </div>
                </div>

                {/* Inner Visual Container */}
                <div className="w-full h-36 sm:h-40 rounded-xl bg-[#0A0F1E]/80 border border-white/10 flex items-center justify-center relative select-none overflow-hidden">
                  <img 
                    src="/earth_globe_pure_black.png" 
                    alt="3D Globe"
                    className="w-24 h-24 sm:w-28 sm:h-28 object-contain z-10 animate-spin-slow"
                    loading="lazy"
                    decoding="async"
                  />
                  
                  <div className="absolute top-6 left-10 z-20 animate-[floatPin1_4s_infinite_ease-in-out]">
                    <MapPin size={16} className="text-cyan-400 fill-cyan-400/30" />
                  </div>
                  <div className="absolute bottom-6 right-10 z-20 animate-[floatPin1_3.5s_infinite_ease-in-out_1s]">
                    <MapPin size={14} className="text-blue-400 fill-blue-400/30" />
                  </div>
                </div>

                {/* Action CTA Link */}
                <div className="pt-1 text-left">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors cursor-pointer">
                    <span>Explore Destinations</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </TiltCard>

            {/* CARD 2 — UNDERSTAND */}
            <TiltCard 
              className="bg-[#0A0F1E] text-white border-white/10 shadow-lg hover:border-purple-500/30 p-5 sm:p-6 flex flex-col justify-between"
              style={{ background: 'linear-gradient(145deg, #0A0F1E 30%, #2e1065 100%)' }}
            >
              <div className="relative h-full flex flex-col justify-between space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full border border-purple-500/30 bg-purple-950/60 text-purple-400 text-[11px] font-bold font-mono tracking-widest">
                      02
                    </span>
                    <span className="text-[10px] font-semibold text-purple-300/80 uppercase tracking-wider flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5" /> Intelligence
                    </span>
                  </div>

                  <div className="text-left">
                    <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                      Understand
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300/80 mt-1.5 leading-relaxed font-light">
                      Get complete country intelligence: visa policies, safety index, budgets & local transport.
                    </p>
                  </div>
                </div>

                {/* Inner Visual Container */}
                <div className="w-full h-36 sm:h-40 rounded-xl bg-[#0A0F1E]/80 border border-white/10 flex items-center justify-center relative select-none overflow-hidden p-3">
                  <div className="w-full max-w-[200px] bg-[#0A0F1E]/90 border border-white/15 rounded-xl p-3 space-y-2 z-10">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-300 font-light flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Visa</span>
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/40 bg-emerald-950/60 text-emerald-300">
                        Visa Free
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-300 font-light flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Best Time</span>
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-cyan-500/40 bg-cyan-950/60 text-cyan-300">
                        Apr - Oct
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-300 font-light flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-purple-400" />
                        <span>Safety</span>
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-purple-500/40 bg-purple-950/60 text-purple-300">
                        98% High
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action CTA Link */}
                <div className="pt-1 text-left">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 group-hover:text-purple-300 transition-colors cursor-pointer">
                    <span>View Country Insights</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </TiltCard>

            {/* CARD 3 — PLAN */}
            <TiltCard 
              className="bg-[#0A0F1E] text-white border-white/10 shadow-lg hover:border-cyan-500/30 p-5 sm:p-6 flex flex-col justify-between md:col-span-2 lg:col-span-1"
              style={{ background: 'linear-gradient(145deg, #0A0F1E 30%, #0e7490 100%)' }}
            >
              <div className="relative h-full flex flex-col justify-between space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full border border-blue-500/30 bg-blue-950/60 text-blue-400 text-[11px] font-bold font-mono tracking-widest">
                      03
                    </span>
                    <span className="text-[10px] font-semibold text-cyan-300/80 uppercase tracking-wider flex items-center gap-1">
                      <Plane className="w-3.5 h-3.5 rotate-45" /> AI Planner
                    </span>
                  </div>

                  <div className="text-left">
                    <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                      Plan
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300/80 mt-1.5 leading-relaxed font-light">
                      Create personalized AI itineraries with day-by-day routes based on your style & budget.
                    </p>
                  </div>
                </div>

                {/* Inner Visual Container */}
                <div className="w-full h-36 sm:h-40 rounded-xl bg-[#0A0F1E]/80 border border-white/10 flex items-center justify-center relative select-none overflow-hidden">
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

                  <div className="absolute left-4 top-3 bg-[#0A0F1E]/90 border border-white/15 rounded-lg px-2.5 py-1 flex flex-col items-start leading-none">
                    <span className="text-[8px] text-slate-400 uppercase tracking-widest font-semibold mb-0.5">Budget</span>
                    <span className="text-cyan-400 font-bold text-xs">$1,850</span>
                  </div>

                  <div className="absolute right-4 bottom-3 bg-[#0A0F1E]/90 border border-white/15 rounded-lg px-2.5 py-1 flex items-center gap-1.5 leading-none">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <div className="flex flex-col items-start leading-none">
                      <span className="text-[8px] text-slate-400 uppercase tracking-widest font-semibold mb-0.5">AI Score</span>
                      <span className="text-white font-bold text-xs">9.8/10</span>
                    </div>
                  </div>
                </div>

                {/* Action CTA Link */}
                <div className="pt-1 text-left">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors cursor-pointer">
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
