import React from 'react';
import { Search, MapPin, Shield, Calendar, Globe, ArrowRight, Check, Heart, Sparkles, Navigation, Layers, Compass, HelpCircle, CheckSquare, FileCheck, Languages, Coins, Sun, Cloud, Plane, DollarSign, TrendingUp, Map, Ticket } from 'lucide-react';
import ImageWithWatermark from '../ImageWithWatermark';

export default function JourneyFlowSection() {
  return (
    <section className="section-padding bg-[#faf9f6] dark:bg-[#020813] relative overflow-hidden border-t border-slate-100 dark:border-white/[0.03] [perspective:1200px]">
      
      {/* 3D/Vector Background Visuals - Global Flight Orbits & Coordinate Grids */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.008] pointer-events-none select-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:28px_28px]" />
      
      {/* Volumetric ambient light mesh */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-500/10 via-purple-500/5 to-transparent dark:from-indigo-500/[0.02] dark:via-purple-500/[0.01] rounded-full blur-[140px] pointer-events-none animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent dark:from-emerald-500/[0.02] dark:via-emerald-500/[0.01] rounded-full blur-[160px] pointer-events-none animate-float [animation-delay:2s]" />

      {/* Premium 3D Floating Travel Elements (Scattered surrounding the header, matching Assemble style) */}
      <div className="absolute inset-x-0 top-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-0 pointer-events-none z-20 hidden xl:block">
        <div className="relative w-full h-full">

          {/* 1. Weather Sun Card */}
          <div className="absolute top-[20px] left-[2%] xl:left-[4%] w-14 h-14 xl:w-16 xl:h-16 bg-white dark:bg-[#1b1f2e] border border-slate-200/60 dark:border-white/5 rounded-[18px] shadow-[0_12px_28px_rgba(15,23,42,0.08),0_4px_10px_rgba(15,23,42,0.04)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.6)] flex items-center justify-center -rotate-6 animate-float z-20">
            <Sun className="w-6 h-6 xl:w-7 xl:h-7 text-slate-800 dark:text-white" />
          </div>

          {/* 2. Aeroplane Card */}
          <div className="absolute top-[100px] left-[7%] xl:left-[11%] w-14 h-14 xl:w-16 xl:h-16 bg-white dark:bg-[#1b1f2e] border border-slate-200/60 dark:border-white/5 rounded-[18px] shadow-[0_12px_28px_rgba(15,23,42,0.08),0_4px_10px_rgba(15,23,42,0.04)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.6)] flex items-center justify-center rotate-6 animate-float [animation-delay:1s] z-20">
            <Plane className="w-6 h-6 xl:w-7 xl:h-7 text-slate-800 dark:text-white transform -rotate-45" />
          </div>

          {/* 3. Compass Card */}
          <div className="absolute top-[180px] left-[1%] xl:left-[3%] w-14 h-14 xl:w-16 xl:h-16 bg-white dark:bg-[#1b1f2e] border border-slate-200/60 dark:border-white/5 rounded-[18px] shadow-[0_12px_28px_rgba(15,23,42,0.08),0_4px_10px_rgba(15,23,42,0.04)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.6)] flex items-center justify-center -rotate-12 animate-float [animation-delay:2s] z-20">
            <Compass className="w-6 h-6 xl:w-7 xl:h-7 text-slate-800 dark:text-white" />
          </div>

          {/* 4. Flight Ticket Card */}
          <div className="absolute top-[260px] left-[4%] xl:left-[8%] w-14 h-14 xl:w-16 xl:h-16 bg-white dark:bg-[#1b1f2e] border border-slate-200/60 dark:border-white/5 rounded-[18px] shadow-[0_12px_28px_rgba(15,23,42,0.08),0_4px_10px_rgba(15,23,42,0.04)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.6)] flex items-center justify-center rotate-3 animate-float [animation-delay:3s] z-20">
            <Ticket className="w-6 h-6 xl:w-7 xl:h-7 text-slate-800 dark:text-white transform -rotate-12" />
          </div>

          {/* 5. Calendar Card */}
          <div className="absolute top-[30px] right-[2%] xl:right-[4%] w-14 h-14 xl:w-16 xl:h-16 bg-white dark:bg-[#1b1f2e] border border-slate-200/60 dark:border-white/5 rounded-[18px] shadow-[0_12px_28px_rgba(15,23,42,0.08),0_4px_10px_rgba(15,23,42,0.04)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.6)] flex items-center justify-center rotate-6 animate-float [animation-delay:0.5s] z-20">
            <Calendar className="w-6 h-6 xl:w-7 xl:h-7 text-slate-800 dark:text-white" />
          </div>

          {/* 6. Route Map Card */}
          <div className="absolute top-[110px] right-[7%] xl:right-[11%] w-14 h-14 xl:w-16 xl:h-16 bg-white dark:bg-[#1b1f2e] border border-slate-200/60 dark:border-white/5 rounded-[18px] shadow-[0_12px_28px_rgba(15,23,42,0.08),0_4px_10px_rgba(15,23,42,0.04)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.6)] flex items-center justify-center -rotate-6 animate-float [animation-delay:1.5s] z-20">
            <Map className="w-6 h-6 xl:w-7 xl:h-7 text-slate-800 dark:text-white" />
          </div>

          {/* 7. Dollar Coin Card */}
          <div className="absolute top-[190px] right-[1%] xl:right-[3%] w-14 h-14 xl:w-16 xl:h-16 bg-white dark:bg-[#1b1f2e] border border-slate-200/60 dark:border-white/5 rounded-[18px] shadow-[0_12px_28px_rgba(15,23,42,0.08),0_4px_10px_rgba(15,23,42,0.04)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.6)] flex items-center justify-center rotate-12 animate-float [animation-delay:2.5s] z-20">
            <DollarSign className="w-6 h-6 xl:w-7 xl:h-7 text-slate-800 dark:text-white" />
          </div>

          {/* 8. Map Pin Card */}
          <div className="absolute top-[270px] right-[4%] xl:right-[8%] w-14 h-14 xl:w-16 xl:h-16 bg-white dark:bg-[#1b1f2e] border border-slate-200/60 dark:border-white/5 rounded-[18px] shadow-[0_12px_28px_rgba(15,23,42,0.08),0_4px_10px_rgba(15,23,42,0.04)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.6)] flex items-center justify-center -rotate-3 animate-float [animation-delay:3.5s] z-20">
            <MapPin className="w-6 h-6 xl:w-7 xl:h-7 text-slate-800 dark:text-white" />
          </div>

        </div>
      </div>




      {/* Faint Minimalist flight path curved line */}
      <svg className="absolute inset-0 w-full h-full text-slate-200/50 dark:text-white/[0.01] pointer-events-none select-none" xmlns="http://www.w3.org/2000/svg">
        <path d="M -100 250 Q 500 -50 1100 250 T 2300 150" fill="none" stroke="currentColor" strokeWidth="0.75" strokeDasharray="2 4" />
      </svg>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50/50 dark:bg-white/[0.03] border border-slate-150/70 dark:border-white/5 text-luxury-primary dark:text-slate-300 text-xs font-semibold uppercase tracking-widest shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse-glow" /> Explore & Plan
          </span>
          <h2 className="section-title text-center text-balance !mb-2">
            From an idea to a complete journey.
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base font-light font-body max-w-2xl mx-auto leading-relaxed">
            Discover new destinations, check local travel rules, and build your perfect itinerary all in one place.
          </p>
        </div>

        {/* 3-Column Grid with 3D Depth & Layers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch text-left">
          
          {/* Left Area: Spans 2 Columns on Desktop */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 [transform-style:preserve-3d]">
            
            {/* Card 1: Destinations (Postcard Parallax style) */}
            <div className="glass-card bg-gradient-to-b from-white to-slate-50/50 dark:from-[#080e1e]/90 dark:to-[#040814]/95 border border-slate-150 dark:border-white/[0.05] rounded-[32px] overflow-hidden shadow-[0_15px_40px_rgba(2,8,19,0.03)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.5)] hover:shadow-[0_30px_70px_rgba(2,8,19,0.08)] dark:hover:shadow-[0_35px_75px_rgba(0,0,0,0.6)] transition-all duration-500 flex flex-col justify-between h-[390px] group [transform:translateZ(0px)] hover:[transform:translateZ(10px)]">
              <div className="p-8 pb-4 space-y-2">
                <span className="text-[9px] font-mono tracking-widest text-indigo-500 dark:text-indigo-400 font-bold uppercase">01 • EXPLORE</span>
                <h3 className="font-heading text-2xl font-bold text-luxury-primary dark:text-white tracking-tight">
                  Destinations
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-light leading-relaxed font-body">
                  Browse over <strong>200 countries</strong>. Find the best places to visit, local highlights, and weather guides for cities like <strong>Tokyo</strong>, <strong>Paris</strong>, and <strong>Reykjavik</strong>.
                </p>
              </div>

              {/* Bottom half: Image with overlay pills & Parallax frame */}
              <div className="relative h-52 w-full px-6 pb-6 mt-auto overflow-hidden">
                <div className="relative w-full h-full rounded-2xl overflow-hidden border border-slate-200/60 dark:border-white/10 shadow-lg group-hover:shadow-2xl transition-all duration-500">
                  <ImageWithWatermark
                    src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80"
                    alt="Scenic boat ride in Kyoto"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    wrapperClassName="w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Floating pill categories */}
                  <div className="absolute bottom-4 inset-x-4 flex items-center gap-2 overflow-x-auto no-scrollbar">
                    <span className="px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-black/75 backdrop-blur-md border border-white/20 dark:border-white/10 text-[9px] font-bold text-luxury-primary dark:text-white shadow-md whitespace-nowrap">
                      Japan (Kyoto)
                    </span>
                    <span className="px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-black/75 backdrop-blur-md border border-white/20 dark:border-white/10 text-[9px] font-bold text-luxury-primary dark:text-white shadow-md whitespace-nowrap">
                      Iceland (Reykjavik)
                    </span>
                    
                    {/* Circle button with arrow */}
                    <div className="w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-500 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-black flex items-center justify-center shrink-0 shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>

                    <span className="px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-black/75 backdrop-blur-md border border-white/20 dark:border-white/10 text-[9px] font-bold text-luxury-primary dark:text-white shadow-md whitespace-nowrap">
                      France (Paris)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Global Travel Info (Glowing branched sphere style) */}
            <div className="glass-card bg-gradient-to-b from-white to-slate-50/50 dark:from-[#080e1e]/90 dark:to-[#040814]/95 border border-slate-150 dark:border-white/[0.05] rounded-[32px] overflow-hidden shadow-[0_15px_40px_rgba(2,8,19,0.03)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.5)] hover:shadow-[0_30px_70px_rgba(2,8,19,0.08)] dark:hover:shadow-[0_35px_75px_rgba(0,0,0,0.6)] transition-all duration-500 flex flex-col justify-between h-[390px] group [transform:translateZ(0px)] hover:[transform:translateZ(10px)]">
              <div className="p-8 pb-4 space-y-2">
                <span className="text-[9px] font-mono tracking-widest text-purple-500 dark:text-purple-400 font-bold uppercase">02 • TRAVEL INFO</span>
                <h3 className="font-heading text-2xl font-bold text-luxury-primary dark:text-white tracking-tight">
                  Travel Rules
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-light leading-relaxed font-body">
                  Get instant visa guidelines, safety tips, and live exchange rates for your destination before you fly.
                </p>
              </div>

              {/* Branching Avatars/Badges Graphic */}
              <div className="relative h-48 w-full bg-slate-50/40 dark:bg-black/15 border-t border-slate-100 dark:border-white/5 overflow-hidden">
                
                {/* SVG Connecting Paths with dynamic glowing gradient lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Clean, thinned connecting lines from center (50, 20) to Y=80 */}
                  <path d="M 50 20 Q 50 50 12 80" stroke="currentColor" className="text-slate-200 dark:text-white/5" strokeWidth="0.75" strokeDasharray="2 3" fill="none" />
                  <path d="M 50 20 Q 50 50 31 80" stroke="currentColor" className="text-slate-200 dark:text-white/5" strokeWidth="0.75" strokeDasharray="2 3" fill="none" />
                  <path d="M 50 20 Q 50 50 50 80" stroke="currentColor" className="text-slate-200 dark:text-white/5" strokeWidth="0.75" strokeDasharray="2 3" fill="none" />
                  <path d="M 50 20 Q 50 50 69 80" stroke="currentColor" className="text-slate-200 dark:text-white/5" strokeWidth="0.75" strokeDasharray="2 3" fill="none" />
                  <path d="M 50 20 Q 50 50 88 80" stroke="currentColor" className="text-slate-200 dark:text-white/5" strokeWidth="0.75" strokeDasharray="2 3" fill="none" />
                </svg>

                {/* Central Parent Sphere - Ultra-minimalist modern globe */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0b1329] flex items-center justify-center shadow-md dark:shadow-2xl z-10 group/globe">
                  <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-indigo-500 dark:text-indigo-400 group-hover/globe:rotate-12 transition-transform duration-500" />
                  </div>
                </div>

                {/* 5 Child Badges at the bottom - premium, thinned glassmorphism designs */}
                <div className="absolute bottom-5 inset-x-0 w-full flex justify-between px-3.5">
                  
                  {/* VISA CHECKLIST */}
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 flex items-center justify-center shadow-sm hover:border-blue-500/30 hover:scale-110 transition-all duration-300 shrink-0 ml-[1%]" title="Visa Checklists">
                    <FileCheck className="w-4.5 h-4.5 text-blue-500" strokeWidth={2} />
                  </div>

                  {/* SAFETY INDEX */}
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 flex items-center justify-center shadow-sm hover:border-purple-500/30 hover:scale-110 transition-all duration-300 shrink-0" title="Safety Index">
                    <Shield className="w-4.5 h-4.5 text-purple-500" strokeWidth={2} />
                  </div>

                  {/* CURRENCY EXCHANGE */}
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 flex items-center justify-center shadow-sm hover:border-amber-500/30 hover:scale-110 transition-all duration-300 shrink-0" title="Currency Converter">
                    <Coins className="w-4.5 h-4.5 text-amber-500" strokeWidth={2} />
                  </div>

                  {/* LANGUAGE GUIDE */}
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 flex items-center justify-center shadow-sm hover:border-emerald-500/30 hover:scale-110 transition-all duration-300 shrink-0" title="Language Guide">
                    <Languages className="w-4.5 h-4.5 text-emerald-500" strokeWidth={2} />
                  </div>

                  {/* TRANSIT GUIDE */}
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 flex items-center justify-center shadow-sm hover:border-cyan-500/30 hover:scale-110 transition-all duration-300 shrink-0 mr-[1%]" title="Transit App Logos">
                    <Navigation className="w-4 h-4 text-cyan-500 transform rotate-45" strokeWidth={2} />
                  </div>

                </div>
              </div>
            </div>

            {/* Card 3: Dynamic Planner (3D Card Stack style) */}
            <div className="md:col-span-2 glass-card bg-gradient-to-r from-amber-500/10 via-emerald-500/5 to-transparent dark:from-amber-500/[0.03] dark:via-emerald-500/[0.01] border border-slate-150 dark:border-white/[0.05] rounded-[32px] overflow-hidden shadow-[0_15px_40px_rgba(2,8,19,0.03)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.5)] hover:shadow-[0_30px_70px_rgba(2,8,19,0.08)] dark:hover:shadow-[0_35px_75px_rgba(0,0,0,0.6)] transition-all duration-500 flex flex-col md:flex-row justify-between items-center p-8 gap-8 min-h-[290px] group [transform:translateZ(0px)] hover:[transform:translateZ(10px)] text-left">
              
              <div className="md:w-[55%] space-y-4">
                <span className="text-[9px] font-mono tracking-widest text-emerald-500 dark:text-emerald-400 font-bold uppercase">03 • PLANNER</span>
                <h3 className="font-heading text-3xl font-bold text-luxury-primary dark:text-white leading-none tracking-tight">
                  Easy Planning
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-light leading-relaxed font-body">
                  Create day-by-day plans. Manage budgets, map walking routes, and keep your schedules handy with an offline checklist.
                </p>
                
                <div className="flex gap-3 pt-2">
                  <button className="px-5 py-2.5 rounded-xl bg-emerald-600 dark:bg-emerald-500 text-white font-medium text-xs tracking-wide hover:bg-emerald-700 dark:hover:bg-emerald-600 hover:scale-[1.03] hover:shadow-lg hover:shadow-emerald-500/10 active:scale-[0.97] transition-all cursor-pointer">
                    Start Planning
                  </button>
                  <button className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 hover:border-slate-350 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-800 dark:text-white font-medium text-xs tracking-wide bg-white/60 dark:bg-white/[0.01] hover:scale-[1.03] active:scale-[0.97] transition-all cursor-pointer">
                    View Samples
                  </button>
                </div>
              </div>

              {/* Graphic right: 3D Overlapping paper cards with perspective */}
              <div className="md:w-[45%] w-full relative h-48 flex items-center justify-center [perspective:800px] [transform-style:preserve-3d]">
                
                {/* Back Card (Travel Map snippet, tilted back) */}
                <div className="absolute top-0 right-4 w-[185px] h-[135px] rounded-2xl border border-slate-250 dark:border-white/[0.06] bg-slate-50 dark:bg-[#080f21] shadow-lg p-3 flex flex-col justify-between transform [transform:rotateY(-15deg)_rotateX(10deg)_translateZ(-20px)] opacity-70 group-hover:opacity-90 group-hover:[transform:rotateY(-5deg)_rotateX(5deg)_translateZ(-10px)] transition-all duration-500 select-none">
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] font-mono text-slate-400">ROUTE GRID</span>
                    <MapPin className="w-3 h-3 text-red-500 animate-pulse" />
                  </div>
                  <div className="h-10 bg-slate-150/70 dark:bg-white/5 rounded-lg overflow-hidden border border-slate-200/50 dark:border-white/5 flex items-center justify-center">
                    <span className="text-[7.5px] font-mono text-slate-450 dark:text-slate-500">Kyoto Landmark Mapping</span>
                  </div>
                  <span className="text-[9px] text-slate-450 dark:text-slate-400 font-mono">Kyoto route map</span>
                </div>

                {/* Front Card (Curly Document checklist with volumetric drop shadow) */}
                <div className="absolute top-8 right-12 w-[195px] h-[135px] rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#121b38] shadow-[10px_20px_40px_rgba(2,8,19,0.12)] dark:shadow-[10px_20px_55px_rgba(0,0,0,0.5)] p-4 flex flex-col justify-between transform [transform:rotateY(10deg)_rotateX(5deg)_translateZ(20px)] group-hover:[transform:rotateY(2deg)_rotateX(2deg)_translateZ(30px)] transition-all duration-500 border-l-[3.5px] border-l-emerald-500">
                  <div className="flex items-center gap-2 border-b border-slate-100 dark:border-white/5 pb-2">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-500/15 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-emerald-500" />
                    </div>
                    <span className="text-[9px] font-heading font-extrabold text-luxury-primary dark:text-white uppercase tracking-wider">Itinerary Checklist</span>
                  </div>
                  
                  {/* Checklist lines */}
                  <div className="space-y-1.5 text-[8.5px] text-slate-655 dark:text-slate-350">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span className="truncate">Confirm Kyoto hotel booking</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span className="truncate">Verify visa status (90 days)</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0" />
                      <span className="line-through truncate">Buy Swiss SBB Pass</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Area: Tall Glass Smartphone Mockup Card */}
          <div className="lg:col-span-1 glass-card bg-gradient-to-b from-white to-slate-50/50 dark:from-[#080e1e]/90 dark:to-[#040814]/95 border border-slate-150 dark:border-white/[0.05] rounded-[32px] overflow-hidden shadow-[0_15px_40px_rgba(2,8,19,0.03)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.5)] hover:shadow-[0_30px_70px_rgba(2,8,19,0.08)] dark:hover:shadow-[0_35px_75px_rgba(0,0,0,0.6)] transition-all duration-500 flex flex-col justify-between min-h-[600px] h-full p-8 relative group [transform:translateZ(0px)] hover:[transform:translateZ(10px)]">
            
            {/* Phone Screen Bevel Glass reflection overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.015] dark:via-white/[0.007] to-transparent transform -translate-x-full group-hover:translate-x-full duration-1000 ease-out pointer-events-none" />

            {/* Smartphone Address/Notch Bar */}
            <div className="w-full flex items-center justify-between py-2.5 px-4 rounded-2xl bg-slate-50 dark:bg-black/25 border border-slate-200/50 dark:border-white/5 text-[10px] text-slate-500 dark:text-slate-400 select-none shadow-inner">
              <span className="font-mono tracking-tight text-slate-655 dark:text-slate-400 font-semibold">tripready.co/app</span>
              <div className="flex gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-350 dark:bg-slate-700" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-350 dark:bg-slate-700" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-350 dark:bg-slate-700" />
              </div>
            </div>

            {/* Rebound Pill Badge */}
            <div className="mt-8 flex justify-center">
              <span className="px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-black/20 text-[9px] font-mono font-bold tracking-widest text-slate-550 dark:text-slate-400 uppercase shadow-sm">
                Live Sync ©
              </span>
            </div>

            {/* Phone Screen Header Title */}
            <div className="text-center space-y-3 mt-6 relative z-10 max-w-xs mx-auto">
              <h3 className="font-heading text-3xl sm:text-4xl font-bold text-luxury-primary dark:text-white leading-tight tracking-tight">
                Your Assistant
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-light leading-relaxed font-body">
                Keep your plans, routes, and timeline organized in one easy-to-use visual guide.
              </p>
            </div>

            {/* Volumetric Glowing Search Field */}
            <div className="mt-8 relative max-w-xs mx-auto w-full z-10">
              <div className="w-full bg-white dark:bg-[#080e1e]/60 border border-slate-200 dark:border-white/10 rounded-2xl p-2.5 flex items-center justify-between shadow-[0_5px_15px_rgba(0,0,0,0.02)] focus-within:shadow-lg focus-within:border-indigo-500/30 transition-all duration-300">
                <span className="text-[11px] text-slate-450 dark:text-slate-500 pl-2">Explore Tokyo, Paris...</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-500 dark:hover:bg-emerald-400 text-white flex items-center justify-center cursor-pointer shadow-md hover:scale-105 active:scale-95 transition-all">
                  <Search className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Volumetric Wavy Contour Terrain Graphic */}
            <div className="relative h-60 w-full overflow-hidden mt-10 rounded-2xl select-none border border-slate-100 dark:border-white/5 shadow-inner">
              
              {/* Back wave */}
              <svg className="absolute bottom-0 w-full h-full text-emerald-500/10 dark:text-emerald-500/[0.03] fill-current" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 80 Q25 45 50 68 T100 55 L100 100 L0 100 Z" />
              </svg>
              
              {/* Mid wave */}
              <svg className="absolute bottom-0 w-full h-full text-emerald-500/20 dark:text-emerald-500/[0.06] fill-current animate-[pulse_6s_ease-in-out_infinite]" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 88 Q30 65 60 82 T100 70 L100 100 L0 100 Z" />
              </svg>
              
              {/* Front main contour wave */}
              <svg className="absolute bottom-0 w-full h-44 text-emerald-600/30 dark:text-emerald-500/15 fill-current" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 94 Q22 82 42 88 T82 76 T100 82 L100 100 L0 100 Z" />
              </svg>
              
              {/* Overlay brand tags */}
              <div className="absolute bottom-4 inset-x-2 flex justify-around text-[9px] font-mono tracking-widest text-slate-455 dark:text-white/25 font-bold uppercase z-10 px-2 select-none">
                <span>SBB MOBILE</span>
                <span>GRAB</span>
                <span>DB NAVIGATOR</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
