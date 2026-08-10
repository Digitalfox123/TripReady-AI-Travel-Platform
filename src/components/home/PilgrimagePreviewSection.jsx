import { Link } from 'react-router-dom';
import { Sparkles, Compass, Globe, ArrowRight, Landmark } from 'lucide-react';
import UmrahGuideCard from '../UmrahGuideCard';

export default function PilgrimagePreviewSection() {
  const religions = [
    { name: 'Islamic', icon: '🕌' },
    { name: 'Christian', icon: '⛪' },
    { name: 'Buddhist', icon: '☸️' },
    { name: 'Hindu', icon: '🛕' },
    { name: 'Sikh', icon: '🪯' },
    { name: 'Jewish', icon: '🔯' },
  ];

  return (
    <section className="section-padding bg-[var(--bg-primary)] border-t border-[var(--border)] relative overflow-hidden transition-colors duration-500">
      
      {/* Background ambient details */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.01)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none z-0 opacity-60" />
      
      {/* Background glowing blobs */}
      <div className="absolute top-1/4 left-0 w-full max-w-[500px] h-[250px] bg-gradient-to-tr from-amber-500/10 via-yellow-500/5 to-transparent dark:from-amber-500/5 dark:via-yellow-550/2 rounded-full blur-[120px] pointer-events-none overflow-hidden z-0" />
      <div className="absolute bottom-1/4 right-0 w-full max-w-[600px] h-[250px] bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent dark:from-indigo-500/5 dark:via-purple-550/2 rounded-full blur-[140px] pointer-events-none overflow-hidden z-0" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 sm:mb-20 text-left">
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase tracking-widest mb-1 select-none">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sacred Travel</span>
            </div>
            <h2 className="section-title !mb-2">
              Religion & Pilgrimage Hub
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] font-light leading-relaxed">
              Plan spiritual journeys, explore sacred landmarks, and navigate complex pilgrimage requirements with our curated guides.
            </p>
          </div>
          
          <div className="shrink-0 pb-1">
            <Link
              to="/pilgrimage"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--accent)] hover:underline group cursor-pointer"
            >
              <span>Explore Pilgrimage Hub</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          
          {/* Card 1: Faith-Based Travel Planning */}
          <div className="glass-card bg-gradient-to-b from-white to-slate-50/50 dark:from-[#080e1e]/90 dark:to-[#040814]/95 border border-slate-150 dark:border-white/[0.05] rounded-[32px] p-8 shadow-[0_15px_40px_rgba(2,8,19,0.03)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.5)] flex flex-col justify-between hover:-translate-y-1.5 transition-all duration-500 text-left">
            <div className="space-y-6">
              {/* Icon Container */}
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-inner">
                <Compass className="w-6 h-6" />
              </div>
              
              <div className="space-y-3">
                <h3 className="font-heading text-2xl font-bold text-luxury-primary dark:text-white tracking-tight leading-snug">
                  Faith-Based Travel Planning
                </h3>
                <p className="text-slate-550 dark:text-slate-400 text-xs sm:text-sm font-light leading-relaxed font-body">
                  Faith journeys require meticulous planning, specialized budget models, and deep cultural awareness. Explore our immersive pilgrimage hub guides for step-by-step guidance for millions of spiritual seekers.
                </p>
              </div>

              {/* Religions list */}
              <div className="space-y-2">
                <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                  Supported Faith Traditions
                </span>
                <div className="flex flex-wrap gap-2">
                  {religions.map((r) => (
                    <span
                      key={r.name}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/[0.05] text-[10px] font-bold text-[var(--text-primary)] select-none"
                    >
                      <span>{r.icon}</span>
                      <span>{r.name}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Button */}
            <div className="pt-8">
              <Link
                to="/pilgrimage"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-[var(--text-primary)] hover:bg-[var(--text-primary)]/95 text-[var(--bg-primary)] transition-all duration-300 font-semibold text-xs tracking-wider uppercase shadow-premium hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-[var(--border)] cursor-pointer group"
              >
                <span>Browse All Guides</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Card 2: Complete Umrah Guide (flagship center card) */}
          <div className="flex w-full">
            <UmrahGuideCard />
          </div>

          {/* Card 3: Complete Hajj Guide */}
          <div className="glass-card bg-gradient-to-b from-white to-slate-50/50 dark:from-[#080e1e]/90 dark:to-[#040814]/95 border border-slate-150 dark:border-white/[0.05] rounded-[32px] p-8 shadow-[0_15px_40px_rgba(2,8,19,0.03)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.5)] flex flex-col justify-between hover:-translate-y-1.5 transition-all duration-500 text-left">
            <div className="space-y-6">
              {/* Icon Container */}
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/15 flex items-center justify-center text-indigo-650 dark:text-indigo-400 shadow-inner">
                <Landmark className="w-6 h-6" />
              </div>
              
              <div className="space-y-3">
                <h3 className="font-heading text-2xl font-bold text-luxury-primary dark:text-white tracking-tight leading-snug">
                  Complete Hajj Guide
                </h3>
                <p className="text-slate-550 dark:text-slate-400 text-xs sm:text-sm font-light leading-relaxed font-body">
                  Network coordination for Hajj rituals with live tracking, visa checks, and weather alerts. Detail-oriented planning templates designed to guide pilgrims safely through the sacred routes and rituals.
                </p>
              </div>

              {/* Hajj parameters */}
              <div className="grid grid-cols-2 gap-2 text-[10px] sm:text-xs font-body font-light text-slate-550 dark:text-slate-400 py-3 border-y border-slate-200/50 dark:border-white/[0.04] px-1 bg-slate-50/30 dark:bg-white/[0.005] rounded-2xl">
                <div>
                  <span className="text-[9px] text-slate-400 block leading-none mb-0.5">Average Cost</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-250">$3,500 - $8,000</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block leading-none mb-0.5">Recommended</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-250">14 - 21 Days</span>
                </div>
              </div>
            </div>

            {/* Button */}
            <div className="pt-8">
              <Link
                to="/pilgrimage"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-white hover:bg-slate-50 dark:bg-white/[0.02] hover:dark:bg-white/[0.05] text-[var(--text-primary)] transition-all duration-300 font-semibold text-xs tracking-wider uppercase border border-slate-200 dark:border-white/[0.08] cursor-pointer group"
              >
                <span>Preview Guide</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
