import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Globe, Shield, Calendar, Star, Check, Plane, ArrowRight, Sparkles, Compass, CheckCircle2 } from 'lucide-react';
import { GlowCard } from '../ui/spotlight-card';

// Custom React hook to key out solid black backgrounds for transparent images
function useTransparentImage(src, isBlackBg = true) {
  const [processedSrc, setProcessedSrc] = useState(null);

  useEffect(() => {
    if (!src) return;
    const img = new Image();
    img.src = src;
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      try {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        
        if (isBlackBg) {
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i+1];
            const b = data[i+2];
            const brightness = Math.max(r, g, b);
            
            if (brightness < 14) {
              data[i+3] = 0;
            } else if (brightness < 38) {
              data[i+3] = ((brightness - 14) / 24) * 255;
            }
          }
        }
        
        ctx.putImageData(imgData, 0, 0);
        setProcessedSrc(canvas.toDataURL('image/png'));
      } catch (e) {
        setProcessedSrc(src);
      }
    };
    img.onerror = () => {
      setProcessedSrc(src);
    };
  }, [src, isBlackBg]);

  return processedSrc;
}

// 3D Tilt Card wrapper with smooth responsiveness & touch support
function TiltCard({ children, className, glowColor = 'blue', style = {} }) {
  const cardRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');

  const handleMouseMove = (e) => {
    if (!cardRef.current || window.innerWidth < 768) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    const tiltX = -y * 6;
    const tiltY = x * 6;
    
    setTransformStyle(`perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.015, 1.015, 1.015)`);
  };

  const handleMouseLeave = () => {
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  return (
    <GlowCard
      ref={cardRef}
      glowColor={glowColor}
      customSize={true}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative rounded-[28px] border transition-all duration-500 ease-out select-none ${className}`}
      style={{ 
        transform: transformStyle, 
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
        ...style
      }}
    >
      {children}
    </GlowCard>
  );
}

export default function ImmersiveDiscoverySection() {
  const sectionRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const transparentGlobe = useTransparentImage('/earth_globe_pure_black.png');

  const handleMouseMove = (e) => {
    if (!sectionRef.current) return;
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
      className="py-16 sm:py-24 bg-[var(--bg-primary)] text-[var(--text-primary)] border-t border-[var(--border)] relative overflow-hidden transition-colors duration-500"
    >
      {/* Background vector coordinate grid overlay */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.015] pointer-events-none select-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:32px_32px] z-0" />
      
      {/* Dynamic Cursor-Following Volumetric Ambient Glow */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-500 ease-out bg-[radial-gradient(600px_circle_at_var(--mouse-x,0px)_var(--mouse-y,0px),rgba(37,99,235,0.07),transparent_60%)] dark:bg-[radial-gradient(600px_circle_at_var(--mouse-x,0px)_var(--mouse-y,0px),rgba(59,130,246,0.02),transparent_60%)]"
        style={{ opacity: isHovered ? 1 : 0 }}
      />

      {/* Subtle ambient light Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Self-contained keyframes */}
      <style>{`
        @keyframes customPulse {
          0%, 100% { transform: scale(1); opacity: 0.85; }
          50% { transform: scale(1.1); opacity: 1; filter: drop-shadow(0 0 6px rgba(37,99,235,0.8)); }
        }
        @keyframes drawRoute {
          0% { stroke-dashoffset: 240; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes spinSlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes floatPin1 {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-6px) scale(1.08); }
        }
        @keyframes floatPin2 {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-4px) scale(0.95); }
        }
        .animate-draw-route { stroke-dasharray: 240; animation: drawRoute 7s linear infinite; }
        .animate-spin-slow { animation: spinSlow 50s linear infinite; }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 md:mb-20 space-y-4 select-none">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full border border-blue-500/20 shadow-sm">
            <Sparkles className="w-4 h-4 text-blue-500 animate-pulse" />
            <span>How It Works</span>
            <Plane className="w-3.5 h-3.5 rotate-45 text-blue-500" />
          </div>

          <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-luxury-primary dark:text-white leading-[1.1]">
            From idea to a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500">perfect trip</span>
          </h2>

          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg font-light max-w-2xl mx-auto leading-relaxed">
            A simple 3-step workflow designed to transform your travel aspirations into organized, stress-free reality.
          </p>
        </div>

        {/* CARDS CONTAINER GRID */}
        <div className="relative max-w-6xl mx-auto">
          
          {/* Connecting Curved Arches (Desktop >1024px) */}
          <div className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden lg:block text-blue-500/30">
            <svg className="w-full h-full" viewBox="0 0 1152 420" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              <path 
                d="M 340,210 C 370,140 400,140 430,210" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeDasharray="6 6" 
              />
              <path 
                d="M 720,210 C 750,140 780,140 810,210" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeDasharray="6 6" 
              />
            </svg>
          </div>

          {/* SaaS Grid layout - 1 col on mobile, 2 cols on tablet, 3 cols on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch relative z-10">
            
            {/* CARD 1 — DISCOVER */}
            <TiltCard 
              glowColor="blue"
              className="bg-[#0A0F1E] text-white border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:shadow-[0_30px_70px_rgba(37,99,235,0.4)] p-6 sm:p-7 flex flex-col justify-between"
              style={{ background: 'linear-gradient(145deg, #0A0F1E 30%, #172554 100%)' }}
            >
              <div className="relative h-full flex flex-col justify-between space-y-6">
                <div>
                  {/* Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/60 text-cyan-400 text-xs font-bold font-mono tracking-widest shadow-[0_0_12px_rgba(6,182,212,0.2)]">
                      01
                    </span>
                    <span className="text-[11px] font-semibold text-cyan-300/80 uppercase tracking-wider flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5" /> Exploration
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="text-left" style={{ transform: 'translateZ(20px)' }}>
                    <h3 className="text-2xl font-bold text-white leading-tight">
                      Discover
                    </h3>
                    <p className="text-sm text-slate-300/80 mt-2 leading-relaxed font-light">
                      Explore global destinations, top sights, curated experiences and hidden gems worldwide.
                    </p>
                  </div>
                </div>

                {/* Inner Visual Container */}
                <div 
                  className="w-full h-44 rounded-2xl bg-[#0A0F1E]/80 border border-white/10 flex items-center justify-center relative select-none shadow-[inset_0_4px_20px_rgba(0,0,0,0.8)] overflow-hidden"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Glowing core halo */}
                  <div className="absolute w-28 h-28 rounded-full bg-blue-600/30 blur-2xl z-0 animate-pulse" />

                  {/* 3D Globe Asset */}
                  {transparentGlobe ? (
                    <img 
                      src={transparentGlobe} 
                      alt="3D Globe"
                      className="w-32 h-32 object-contain z-10 animate-spin-slow drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]" 
                      style={{ transform: 'translateZ(15px)' }}
                      loading="eager"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 z-10 animate-spin-slow">
                      <Globe className="w-12 h-12 text-cyan-400 opacity-80" />
                    </div>
                  )}
                  
                  {/* Floating map pins */}
                  <div 
                    className="absolute top-8 left-12 z-20 animate-[floatPin1_4s_infinite_ease-in-out]"
                    style={{ transform: 'translateZ(25px)' }}
                  >
                    <MapPin size={18} className="text-cyan-400 fill-cyan-400/30 drop-shadow-[0_0_10px_#00D4FF]" />
                  </div>
                  <div 
                    className="absolute bottom-8 right-12 z-20 animate-[floatPin2_3.5s_infinite_ease-in-out_1s]"
                    style={{ transform: 'translateZ(20px)' }}
                  >
                    <MapPin size={16} className="text-blue-400 fill-blue-400/30 drop-shadow-[0_0_8px_#2563EB]" />
                  </div>
                </div>

                {/* Action CTA Link */}
                <div className="pt-2 text-left">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors">
                    <span>Explore Destinations</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </TiltCard>

            {/* CARD 2 — UNDERSTAND */}
            <TiltCard 
              glowColor="purple"
              className="bg-[#0A0F1E] text-white border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:shadow-[0_30px_70px_rgba(124,58,237,0.4)] p-6 sm:p-7 flex flex-col justify-between"
              style={{ background: 'linear-gradient(145deg, #0A0F1E 30%, #2e1065 100%)' }}
            >
              <div className="relative h-full flex flex-col justify-between space-y-6">
                <div>
                  {/* Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-full border border-purple-500/30 bg-purple-950/60 text-purple-400 text-xs font-bold font-mono tracking-widest shadow-[0_0_12px_rgba(168,85,247,0.2)]">
                      02
                    </span>
                    <span className="text-[11px] font-semibold text-purple-300/80 uppercase tracking-wider flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5" /> Intelligence
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="text-left" style={{ transform: 'translateZ(20px)' }}>
                    <h3 className="text-2xl font-bold text-white leading-tight">
                      Understand
                    </h3>
                    <p className="text-sm text-slate-300/80 mt-2 leading-relaxed font-light">
                      Get complete country intelligence: visa policies, safety index, budgets & local transport.
                    </p>
                  </div>
                </div>

                {/* Inner Visual Container */}
                <div 
                  className="w-full h-44 rounded-2xl bg-[#0A0F1E]/80 border border-white/10 flex items-center justify-center relative select-none shadow-[inset_0_4px_20px_rgba(0,0,0,0.8)] overflow-hidden p-3"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Glowing background halo */}
                  <div className="absolute w-28 h-28 rounded-full bg-purple-600/25 blur-2xl z-0" />

                  {/* Glassmorphic UI Info Panel */}
                  <div 
                    className="w-full max-w-[210px] bg-[#0A0F1E]/80 backdrop-blur-xl border border-white/15 rounded-xl p-3.5 shadow-2xl space-y-2.5 z-10 transition-transform duration-300 group-hover:scale-105"
                    style={{ transform: 'translateZ(25px)' }}
                  >
                    {/* Row 1 - Visa */}
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-300 font-light flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Visa</span>
                      </span>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/40 bg-emerald-950/60 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.2)]">
                        Visa Free
                      </span>
                    </div>

                    {/* Row 2 - Best Time */}
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-300 font-light flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-cyan-400" />
                        <span>Best Time</span>
                      </span>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-cyan-500/40 bg-cyan-950/60 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.2)]">
                        Apr - Oct
                      </span>
                    </div>

                    {/* Row 3 - Safety */}
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-300 font-light flex items-center gap-1.5">
                        <Shield className="w-4 h-4 text-purple-400" />
                        <span>Safety</span>
                      </span>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-purple-500/40 bg-purple-950/60 text-purple-300 shadow-[0_0_8px_rgba(168,85,247,0.2)]">
                        98% High
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action CTA Link */}
                <div className="pt-2 text-left">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 group-hover:text-purple-300 transition-colors">
                    <span>View Country Insights</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </TiltCard>

            {/* CARD 3 — PLAN */}
            <TiltCard 
              glowColor="cyan"
              className="bg-[#0A0F1E] text-white border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:shadow-[0_30px_70px_rgba(6,182,212,0.4)] p-6 sm:p-7 flex flex-col justify-between md:col-span-2 lg:col-span-1"
              style={{ background: 'linear-gradient(145deg, #0A0F1E 30%, #0e7490 100%)' }}
            >
              <div className="relative h-full flex flex-col justify-between space-y-6">
                <div>
                  {/* Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-full border border-blue-500/30 bg-blue-950/60 text-blue-400 text-xs font-bold font-mono tracking-widest shadow-[0_0_12px_rgba(59,130,246,0.2)]">
                      03
                    </span>
                    <span className="text-[11px] font-semibold text-cyan-300/80 uppercase tracking-wider flex items-center gap-1">
                      <Plane className="w-3.5 h-3.5 rotate-45" /> AI Planner
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="text-left" style={{ transform: 'translateZ(20px)' }}>
                    <h3 className="text-2xl font-bold text-white leading-tight">
                      Plan
                    </h3>
                    <p className="text-sm text-slate-300/80 mt-2 leading-relaxed font-light">
                      Create personalized AI itineraries with day-by-day routes based on your style & budget.
                    </p>
                  </div>
                </div>

                {/* Inner Visual Container */}
                <div 
                  className="w-full h-44 rounded-2xl bg-[#0A0F1E]/80 border border-white/10 flex items-center justify-center relative select-none shadow-[inset_0_4px_20px_rgba(0,0,0,0.8)] overflow-hidden"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Grid background */}
                  <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_14px]" />

                  {/* Curved Glowing Route Arc */}
                  <svg className="absolute inset-0 w-full h-full text-cyan-400" viewBox="0 0 200 120" fill="none">
                    <path
                      d="M 20,90 Q 70,25 120,75 T 180,30"
                      stroke="url(#route-glow-clean)"
                      strokeWidth="3.5"
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

                  {/* Map Pin Waypoints */}
                  <div className="absolute left-[36px] bottom-[30px] animate-[floatPin1_3s_infinite_ease-in-out]">
                    <MapPin className="w-4 h-4 text-cyan-400 fill-cyan-400/30 drop-shadow-[0_0_8px_rgba(6,182,212,0.9)]" />
                  </div>
                  <div className="absolute right-[28px] top-[26px] animate-[floatPin2_4s_infinite_ease-in-out]">
                    <MapPin className="w-4 h-4 text-purple-400 fill-purple-400/30 drop-shadow-[0_0_8px_rgba(168,85,247,0.9)]" />
                  </div>

                  {/* Budget Chip */}
                  <div 
                    className="absolute left-5 top-4 bg-[#0A0F1E]/90 backdrop-blur-xl border border-white/15 rounded-xl px-3 py-1.5 shadow-2xl flex flex-col items-start leading-none transition-transform duration-300 group-hover:scale-105"
                    style={{ transform: 'translateZ(30px)' }}
                  >
                    <span className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold mb-1">Budget</span>
                    <span className="text-cyan-400 font-extrabold text-xs">$1,850</span>
                  </div>

                  {/* Rating Badge */}
                  <div 
                    className="absolute right-5 bottom-4 bg-[#0A0F1E]/90 backdrop-blur-xl border border-white/15 rounded-xl px-3 py-1.5 shadow-2xl flex items-center gap-1.5 transition-transform duration-300 group-hover:scale-105"
                    style={{ transform: 'translateZ(25px)' }}
                  >
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
                    <div className="flex flex-col items-start leading-none">
                      <span className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold mb-1">AI Score</span>
                      <span className="text-white font-extrabold text-xs">9.8/10</span>
                    </div>
                  </div>
                </div>

                {/* Action CTA Link */}
                <div className="pt-2 text-left">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors">
                    <span>Start AI Trip Planner</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
