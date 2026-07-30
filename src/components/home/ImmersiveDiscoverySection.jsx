import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Globe, Shield, Calendar, Star, Check, Plane, Heart, MessageCircle, Send, Bookmark } from 'lucide-react';
import { GlowCard } from '../ui/spotlight-card';

// Custom React hook to remove solid black backgrounds and cache as transparent data URLs (removes checkerboards)
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
            
            // Key out black pixels
            if (brightness < 12) {
              data[i+3] = 0; // Fully transparent
            } else if (brightness < 36) {
              // Smooth transition
              data[i+3] = ((brightness - 12) / 24) * 255;
            }
          }
        }
        
        ctx.putImageData(imgData, 0, 0);
        setProcessedSrc(canvas.toDataURL('image/png'));
      } catch (e) {
        console.error("Error processing transparent background:", e);
        setProcessedSrc(src);
      }
    };
    img.onerror = () => {
      setProcessedSrc(src);
    };
  }, [src, isBlackBg]);

  return processedSrc;
}

// Premium 3D Tilt Card wrapper with SaaS specs (1px solid white/8% border, 24px border radius, shadow, 24px padding)
function TiltCard({ children, className, hoverGlowClass, glowColor = 'blue', style = {} }) {
  const cardRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    // Controlled SaaS-style subtle tilt
    const tiltX = -y * 8;
    const tiltY = x * 8;
    
    setTransformStyle(`perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.01, 1.01, 1.01)`);
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
      className={`border border-white/[0.08] rounded-[24px] p-6 relative flex flex-col justify-between transition-all duration-300 ease-out shadow-[0_8px_30px_rgba(0,0,0,0.3)] ${hoverGlowClass} select-none cursor-default ${className}`}
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

  // Process transparent globe asset on component mount to key out background
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
      className="section-padding bg-[var(--bg-primary)] text-[var(--text-primary)] border-t border-[var(--border)] relative overflow-hidden transition-colors duration-500"
      style={{ contentVisibility: 'auto' }}
    >
      {/* Background vector coordinate grid overlay */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.008] pointer-events-none select-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:28px_28px] z-0" />
      
      {/* Dynamic Cursor-Following Volumetric Ambient Glow */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-500 ease-out bg-[radial-gradient(600px_circle_at_var(--mouse-x,0px)_var(--mouse-y,0px),rgba(79,107,237,0.06),transparent_60%)] dark:bg-[radial-gradient(600px_circle_at_var(--mouse-x,0px)_var(--mouse-y,0px),rgba(99,102,241,0.015),transparent_60%)]"
        style={{
          opacity: isHovered ? 1 : 0,
        }}
      />

      {/* Subtle static background glowing ambient light */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-500/10 via-purple-500/5 to-transparent dark:from-indigo-500/[0.01] dark:via-purple-500/[0.003] rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Premium CSS-only Volumetric Cloud Cluster (Right) - Zero jagged edges, perfectly soft & glowing */}
      <div className="absolute top-[-10%] right-[-10%] w-[35vw] h-[35vw] max-w-[450px] min-w-[260px] pointer-events-none z-0 select-none">
        {/* Base soft white-blue body */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/95 to-blue-50/40 dark:from-blue-950/15 dark:to-transparent rounded-full blur-[70px] opacity-90 dark:opacity-40" />
        {/* Soft cyan volumetric highlight */}
        <div className="absolute top-[15%] left-[20%] w-[65%] h-[65%] bg-gradient-to-tr from-cyan-300/20 to-indigo-300/10 dark:from-cyan-500/5 dark:to-indigo-500/5 rounded-full blur-[45px] opacity-70 animate-[float_6s_ease-in-out_infinite]" />
        {/* Glowing core */}
        <div className="absolute top-[25%] left-[30%] w-[45%] h-[45%] bg-white dark:bg-slate-900/10 rounded-full blur-[25px] opacity-95 dark:opacity-30" />
      </div>

      {/* Premium CSS-only Volumetric Cloud Cluster (Left) - Perfectly soft & glowing */}
      <div className="absolute bottom-[5%] left-[-8%] w-[25vw] h-[25vw] max-w-[320px] min-w-[180px] pointer-events-none z-0 select-none">
        {/* Base soft body */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/90 to-indigo-50/30 dark:from-indigo-950/15 dark:to-transparent rounded-full blur-[60px] opacity-80 dark:opacity-30" />
        {/* Soft violet volumetric highlight */}
        <div className="absolute bottom-[10%] right-[10%] w-[55%] h-[55%] bg-gradient-to-bl from-purple-300/15 to-blue-300/15 dark:from-purple-500/5 dark:to-blue-500/5 rounded-full blur-[35px] opacity-60 animate-[float_5s_ease-in-out_infinite_1.5s]" />
      </div>

      {/* Self-contained keyframes for UI details */}
      <style>{`
        @keyframes customPulse {
          0%, 100% { transform: scale(1) translateY(0); opacity: 0.85; }
          50% { transform: scale(1.1) translateY(-2px); opacity: 1; filter: drop-shadow(0 0 4px rgba(79,107,237,0.6)); }
        }
        @keyframes drawRoute {
          0% { stroke-dashoffset: 200; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes spinSlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes floatMapPin {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes floatPin1 {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-5px) scale(1.05); }
        }
        @keyframes floatPin2 {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-3px) scale(0.95); }
        }
        @keyframes floatPin3 {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-4px) scale(1.02); }
        }

        .animate-pulse-pin { animation: customPulse 2s infinite ease-in-out; }
        .animate-draw-route { stroke-dasharray: 200; animation: drawRoute 8s linear infinite; }
        .animate-spin-slow { animation: spinSlow 45s linear infinite; }
        .animate-float-pin { animation: floatMapPin 3s ease-in-out infinite; }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20 space-y-4 select-none">
          <div className="inline-flex items-center gap-1.5 bg-[#EEF1FD] dark:bg-blue-950/40 text-[#4F6BED] dark:text-blue-400 text-sm font-semibold px-4 py-1 rounded-full mb-2 border border-blue-500/10 shadow-sm animate-float-pin">
            <span>How it works</span>
            <Plane className="w-3.5 h-3.5 rotate-45 text-[#4F6BED] dark:text-blue-400" />
          </div>
          <h2 className="section-title text-center text-balance !mb-2">
            From idea to a perfect trip
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base font-light font-body max-w-2xl mx-auto leading-relaxed">
            A simple flow that turns your travel dreams into{' '}
            <span className="relative inline-block font-semibold text-slate-800 dark:text-white">
              reality.
              <svg className="absolute left-0 -bottom-1.5 w-full h-2 text-[#4F6BED] dark:text-blue-455" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0,5 Q50,9 100,5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              </svg>
            </span>
          </p>
        </div>

        {/* CARDS WRAPPER GRID */}
        <div className="relative max-w-6xl mx-auto">
          
          {/* Animated Connecting Paths (Desktop only) */}
          <div className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden lg:block text-[#00D4FF]/30">
            <svg className="w-full h-full" viewBox="0 0 1152 420" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              <defs>
                <filter id="glow-teal" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#00D4FF"/>
                </marker>
              </defs>
              
              <path 
                d="M 335,210 C 362,145 398,145 425,210" 
                stroke="#00D4FF" 
                strokeWidth="2" 
                strokeDasharray="5 5" 
                markerEnd="url(#arrow)" 
                filter="url(#glow-teal)"
              />
              <path 
                d="M 720,210 C 747,145 783,145 810,210" 
                stroke="#00D4FF" 
                strokeWidth="2" 
                strokeDasharray="5 5" 
                markerEnd="url(#arrow)" 
                filter="url(#glow-teal)"
              />
            </svg>
          </div>

          {/* SaaS Grid layout: equal height items stretch automatically */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch relative z-10">
            
            {/* CARD 1 — DISCOVER */}
            <TiltCard 
              glowColor="blue"
              className="aspect-square flex flex-col justify-between shadow-[0_20px_45px_-12px_rgba(0,0,0,0.6)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)]" 
              hoverGlowClass="hover:shadow-[0_30px_70px_-10px_rgba(27,61,232,0.45)] dark:hover:shadow-[0_35px_80px_-10px_rgba(27,61,232,0.7)]"
              style={{ background: 'linear-gradient(135deg, #0A0F1E 30%, #1B3DE8 120%)' }}
            >
              <div className="relative h-full flex flex-col justify-between">
                <div>
                  {/* Badge */}
                  <div className="flex items-start justify-between">
                    <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full border border-cyan-500/20 bg-cyan-950/40 text-cyan-400 text-[10px] font-bold font-mono tracking-wider shadow-[0_0_8px_rgba(6,182,212,0.15)]">
                      01
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="text-left mt-4" style={{ transform: 'translateZ(20px)' }}>
                    <h3 className="text-[22px] font-bold text-white leading-snug">
                      Discover
                    </h3>
                    <p className="text-[13px] text-white/60 mt-1.5 leading-relaxed font-light line-clamp-3">
                      Explore destinations, top places, experiences and travel inspiration from around the world.
                    </p>
                  </div>
                </div>

                {/* Inner Visual Container (Bottom Half) */}
                <div 
                  className="w-full h-[145px] overflow-hidden rounded-[20px] bg-[#0A0F1E]/50 border border-white/[0.04] flex items-center justify-center relative select-none shadow-[inset_0_4px_16px_rgba(0,0,0,0.8),0_10px_25px_rgba(0,0,0,0.4)]"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Glowing blue/cyan light halo */}
                  <div className="absolute w-24 h-24 rounded-full bg-[#1B3DE8]/30 blur-2xl z-0 animate-pulse" />

                  {/* 3D Globe Asset */}
                  {transparentGlobe ? (
                    <img 
                      src={transparentGlobe} 
                      alt="3D Globe"
                      className="w-28 h-28 object-contain z-10 animate-spin-slow drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)]" 
                      style={{ transform: 'translateZ(10px)' }}
                      loading="eager"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 z-10 animate-spin-slow">
                      <Globe className="w-10 h-10 text-cyan-400 opacity-60" />
                    </div>
                  )}
                  
                  {/* Floating map pins */}
                  <div 
                    className="absolute top-10 left-16 z-20 animate-[floatPin1_4s_infinite_ease-in-out]"
                    style={{ transform: 'translateZ(25px)' }}
                  >
                    <MapPin size={16} className="text-cyan-400 fill-cyan-400/20 drop-shadow-[0_0_8px_#00D4FF]" />
                  </div>
                  <div 
                    className="absolute bottom-8 right-14 z-20 animate-[floatPin2_3s_infinite_ease-in-out_1s]"
                    style={{ transform: 'translateZ(20px)' }}
                  >
                    <MapPin size={14} className="text-blue-400 fill-blue-400/20 drop-shadow-[0_0_6px_#1B3DE8]" />
                  </div>
                  <div 
                    className="absolute top-16 right-16 z-20 animate-[floatPin3_5s_infinite_ease-in-out_0.5s]"
                    style={{ transform: 'translateZ(15px)' }}
                  >
                    <MapPin size={12} className="text-cyan-300 fill-cyan-300/20 drop-shadow-[0_0_5px_#00D4FF]" />
                  </div>
                </div>

                {/* Read More Link */}
                <div className="text-left mt-2 z-20">
                  <span className="text-[11px] font-medium text-white/50 hover:text-white/80 transition-colors cursor-pointer">
                    Read more &rarr;
                  </span>
                </div>
              </div>
            </TiltCard>

            {/* CARD 2 — UNDERSTAND */}
            <TiltCard 
              glowColor="purple"
              className="aspect-square flex flex-col justify-between shadow-[0_20px_45px_-12px_rgba(0,0,0,0.6)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)]" 
              hoverGlowClass="hover:shadow-[0_30px_70px_-10px_rgba(45,27,232,0.45)] dark:hover:shadow-[0_35px_80px_-10px_rgba(45,27,232,0.7)]"
              style={{ background: 'linear-gradient(135deg, #0A0F1E 30%, #2D1BE8 120%)' }}
            >
              <div className="relative h-full flex flex-col justify-between">
                <div>
                  {/* Badge */}
                  <div className="flex items-start justify-between">
                    <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full border border-cyan-500/20 bg-cyan-950/40 text-cyan-400 text-[10px] font-bold font-mono tracking-wider shadow-[0_0_8px_rgba(6,182,212,0.15)]">
                      02
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="text-left mt-4" style={{ transform: 'translateZ(20px)' }}>
                    <h3 className="text-[22px] font-bold text-white leading-snug">
                      Understand
                    </h3>
                    <p className="text-[13px] text-white/60 mt-1.5 leading-relaxed font-light line-clamp-3">
                      Get complete country insights including visa, safety, costs, culture, transport & more.
                    </p>
                  </div>
                </div>

                {/* Inner Visual Container (Bottom Half) */}
                <div 
                  className="w-full h-[145px] overflow-hidden rounded-[20px] bg-[#0A0F1E]/50 border border-white/[0.04] flex items-center justify-center relative select-none shadow-[inset_0_4px_16px_rgba(0,0,0,0.8),0_10px_25px_rgba(0,0,0,0.4)]"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Glowing background halo */}
                  <div className="absolute w-24 h-24 rounded-full bg-[#2D1BE8]/30 blur-2xl z-0" />

                  {/* Sleek dark UI info panel with glassmorphism frosted effect */}
                  <div 
                    className="w-[190px] bg-[#0A0F1E]/60 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-[0_25px_50px_-10px_rgba(0,0,0,0.85)] space-y-2 z-10 transition-transform duration-300 hover:scale-105"
                    style={{ transform: 'translateZ(25px)' }}
                  >
                    {/* Row 1 - Visa */}
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-white/60 font-light flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Visa</span>
                      </span>
                      <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.2)]">
                        Easy
                      </span>
                    </div>

                    {/* Row 2 - Best Season */}
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-white/60 font-light flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-blue-400" />
                        <span>Best Time</span>
                      </span>
                      <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full border border-blue-500/30 bg-blue-950/40 text-blue-400 shadow-[0_0_6px_rgba(45,27,232,0.2)]">
                        Apr-Oct
                      </span>
                    </div>

                    {/* Row 3 - Safety */}
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-white/60 font-light flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-white/85" />
                        <span>Safety</span>
                      </span>
                      <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-white shadow-[0_0_6px_rgba(255,255,255,0.1)]">
                        High
                      </span>
                    </div>
                  </div>
                </div>

                {/* Read More Link */}
                <div className="text-left mt-2 z-20">
                  <span className="text-[11px] font-medium text-white/50 hover:text-white/80 transition-colors cursor-pointer">
                    Read more &rarr;
                  </span>
                </div>
              </div>
            </TiltCard>

            {/* CARD 3 — PLAN */}
            <TiltCard 
              glowColor="cyan"
              className="aspect-square flex flex-col justify-between shadow-[0_20px_45px_-12px_rgba(0,0,0,0.6)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)]" 
              hoverGlowClass="hover:shadow-[0_30px_70px_-10px_rgba(13,47,191,0.45)] dark:hover:shadow-[0_35px_80px_-10px_rgba(13,47,191,0.7)]"
              style={{ background: 'linear-gradient(135deg, #0A0F1E 30%, #0D2FBF 120%)' }}
            >
              <div className="relative h-full flex flex-col justify-between">
                <div>
                  {/* Badge */}
                  <div className="flex items-start justify-between">
                    <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full border border-cyan-500/20 bg-cyan-950/40 text-cyan-400 text-[10px] font-bold font-mono tracking-wider shadow-[0_0_8px_rgba(6,182,212,0.15)]">
                      03
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="text-left mt-4" style={{ transform: 'translateZ(20px)' }}>
                    <h3 className="text-[22px] font-bold text-white leading-snug">
                      Plan
                    </h3>
                    <p className="text-[13px] text-white/60 mt-1.5 leading-relaxed font-light line-clamp-3">
                      Create a personalized itinerary with AI based on your style, budget and preferences.
                    </p>
                  </div>
                </div>

                {/* Inner Visual Container (Bottom Half) */}
                <div 
                  className="w-full h-[145px] overflow-hidden rounded-[20px] bg-[#0A0F1E]/50 border border-white/[0.04] flex items-center justify-center relative select-none shadow-[inset_0_4px_16px_rgba(0,0,0,0.8),0_10px_25px_rgba(0,0,0,0.4)]"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Grid pattern */}
                  <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:12px_12px]" />

                  {/* Curved Glowing Route Line */}
                  <svg className="absolute inset-0 w-full h-full text-cyan-400" viewBox="0 0 200 120" fill="none">
                    <path
                      d="M 20,90 Q 70,30 110,70 T 180,30"
                      stroke="url(#route-glow)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray="4 4"
                      className="animate-draw-route"
                    />
                    <defs>
                      <linearGradient id="route-glow" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#1B3DE8" />
                        <stop offset="55%" stopColor="#00D4FF" />
                        <stop offset="100%" stopColor="#2D1BE8" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Floating Pins on the route */}
                  <div className="absolute left-[35px] bottom-[30px] animate-[floatPin1_3s_infinite_ease-in-out]">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400/20 drop-shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
                  </div>
                  <div className="absolute right-[30px] top-[25px] animate-[floatPin2_4s_infinite_ease-in-out]">
                    <MapPin className="w-3.5 h-3.5 text-blue-500 fill-blue-500/20 drop-shadow-[0_0_6px_rgba(27,61,232,0.8)]" />
                  </div>

                  {/* Budget Chip */}
                  <div 
                    className="absolute left-6 top-4 bg-[#0A0F1E]/80 backdrop-blur-md border border-white/10 rounded-lg px-2 py-1 shadow-[0_12px_24px_-4px_rgba(0,0,0,0.7)] flex flex-col items-start leading-none transition-transform duration-300 hover:scale-105"
                    style={{ transform: 'translateZ(30px)' }}
                  >
                    <span className="text-[7px] text-white/40 uppercase tracking-wider mb-0.5">Budget</span>
                    <span className="text-cyan-400 font-extrabold text-[11px]">$1,850</span>
                  </div>

                  {/* Star Rating Badge */}
                  <div 
                    className="absolute right-6 bottom-4 bg-[#0A0F1E]/80 backdrop-blur-md border border-white/10 rounded-lg px-2 py-1 shadow-[0_12px_24px_-4px_rgba(0,0,0,0.7)] flex items-center gap-1 transition-transform duration-300 hover:scale-105"
                    style={{ transform: 'translateZ(25px)' }}
                  >
                    <Star className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
                    <div className="flex flex-col items-start leading-none">
                      <span className="text-[7px] text-white/40 uppercase tracking-wider mb-0.5">Score</span>
                      <span className="text-white font-extrabold text-[10px]">9.4/10</span>
                    </div>
                  </div>
                </div>

                {/* Read More Link */}
                <div className="text-left mt-2 z-20">
                  <span className="text-[11px] font-medium text-white/50 hover:text-white/80 transition-colors cursor-pointer">
                    Read more &rarr;
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
