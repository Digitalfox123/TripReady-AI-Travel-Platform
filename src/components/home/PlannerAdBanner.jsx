import { Link } from 'react-router-dom';
import { Sparkles, TreePine, ShieldCheck, Sun, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function PlannerAdBanner() {
  return (
    <section className="relative px-4 sm:px-6 lg:px-8 py-5 sm:py-6 overflow-hidden bg-[var(--bg-primary)] transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        
        {/* Banner container with stunning nature mountain-lake background */}
        <div className="rounded-[32px] border border-slate-200/60 dark:border-white/[0.04] relative min-h-[300px] flex items-center p-6 sm:p-10 md:px-12 md:py-10 shadow-premium overflow-hidden group">
          
          {/* Nature Unsplash background image */}
          <img 
            src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1600&q=80" 
            alt="Stunning Nature Landscape" 
            className="absolute inset-0 w-full h-full object-cover filter brightness-[0.75] dark:brightness-[0.6] group-hover:scale-102 transition-transform duration-[12000ms] ease-out select-none"
          />
          
          {/* Custom bottom-up and left-to-right dark radial gradient overlay for perfect readability in both light & dark modes */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/20 md:to-black/10 z-0 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent z-0 pointer-events-none" />

          {/* Floating animated particles for ambient depth */}
          <div className="absolute inset-0 pointer-events-none opacity-20 z-10">
            <span className="absolute top-6 left-1/4 w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="absolute bottom-8 left-1/3 w-2 h-2 rounded-full bg-white animate-ping opacity-60" />
            <span className="absolute top-12 right-1/4 w-1 h-1 rounded-full bg-white animate-pulse" />
          </div>

          {/* 2-Column Responsive Layout */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center w-full">
            
            {/* Left Column: Description & Typography (md:col-span-7) */}
            <div className="md:col-span-7 text-left space-y-4">
              
              {/* Glassmorphism badge */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[9px] font-bold uppercase tracking-wider select-none shadow-sm">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Planner OS 3.0 has arrived</span>
              </span>

              {/* Premium Typography Heading */}
              <div className="space-y-3">
                <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-light text-white leading-tight tracking-tight">
                  Plan your ultimate journey.<br />
                  <span className="italic font-light text-slate-200 normal-case tracking-normal">Crafted for your personal travel pace.</span>
                </h2>
                
                <p className="text-xs sm:text-sm text-white/80 font-light leading-relaxed max-w-xl font-body">
                  Ditch the static, generic itineraries. Instantly design complete, day-by-day roadmaps, optimized transit routes, seasonal packing lists, and elegant, magazine-style printouts tailored for your next adventure.
                </p>
              </div>

              {/* Value props list */}
              <div className="flex flex-wrap gap-x-5 gap-y-1.5 pt-1 text-[9px] sm:text-[10px] font-sans font-bold text-white uppercase tracking-wider select-none">
                <span className="flex items-center gap-1.5">
                  <TreePine className="w-3.5 h-3.5 text-emerald-400" /> Eco-Conscious Routes
                </span>
                <span className="flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-400" /> Smart Weather Sync
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Trusted Advisories
                </span>
              </div>

            </div>

            {/* Right Column: Floating glassmorphic CTA card (md:col-span-5) */}
            <div className="md:col-span-5 flex justify-center md:justify-end">
              <div className="w-full max-w-sm rounded-[24px] border border-white/20 bg-white/10 backdrop-blur-xl p-6 shadow-2xl space-y-5 text-left relative overflow-hidden group/miniCard">
                
                {/* Micro-glare shine sweep */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover/miniCard:translate-x-full duration-1000 ease-out pointer-events-none" />

                <div className="space-y-3 relative z-10">
                  <span className="text-[9px] font-sans font-extrabold uppercase tracking-widest text-amber-400 block select-none leading-none">
                    Interactive Planner
                  </span>
                  
                  {/* Miniature Checklist */}
                  <div className="space-y-2 text-white/90 text-xs font-medium">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Custom Day-by-Day Roadmap</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Optimized Route Clustering</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Printable Travel Magazines</span>
                    </div>
                  </div>
                </div>

                {/* Primary Button inside poster card */}
                <div className="pt-2 relative z-10 space-y-2.5">
                  <Link 
                    to="/ai-trip-planner" 
                    className="w-full py-3.5 rounded-xl font-heading text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center gap-1.5 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer bg-white text-black hover:bg-slate-100 shadow-lg border border-white/15 group/btn"
                  >
                    <span>PLAN YOUR TRIP</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </Link>

                  <span className="text-[9.5px] text-slate-300 font-sans tracking-widest uppercase font-semibold text-center block leading-none select-none">
                    ⚡ TAKES UNDER 60 SECONDS
                  </span>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
