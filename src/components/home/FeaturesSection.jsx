import {
  Brain,
  Calculator,
  Sparkles,
  ArrowRight,
  Navigation,
  CloudSun,
  Globe,
  CheckSquare,
  FileText,
  Map
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { features } from '../../data';

export default function FeaturesSection() {
  return (
    <section className="section-padding bg-[var(--bg-primary)] text-[var(--text-primary)] border-t border-[var(--border)] relative overflow-hidden transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 relative z-10 space-y-32">
        
        {/* Section Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--accent)] text-[10px] font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-3 h-3 text-[var(--accent)]" />
            <span>How It Works</span>
          </div>
          <h2 className="section-title text-[var(--text-primary)]">
            Travel planning, <span className="italic font-light text-[var(--text-secondary)] dark:text-slate-350">made simple.</span>
          </h2>
        </div>

        {/* Story Block 1: AI Planner (Text Left, Image Right) */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="lg:w-1/2 space-y-6 text-left">
            <div className="w-10 h-10 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)]">
              <Brain className="w-5 h-5" />
            </div>
            
            <h3 className="font-heading text-3xl sm:text-4xl font-normal text-[var(--text-primary)] leading-tight">
              Perfect itineraries,<br />
              <span className="italic font-light text-[var(--text-secondary)] dark:text-slate-350">calculated in seconds.</span>
            </h3>

            <p className="text-[var(--text-secondary)] font-light font-body leading-relaxed text-sm sm:text-base">
              Our smart system automatically figures out the best times to visit, local options, and travel routes to show them in a single, simple dashboard. No cluttered tabs, no messy schedules. Just a clean path forward.
            </p>

            <div className="pt-2">
              <Link to="/destination/tokyo" className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--accent)] uppercase tracking-wider hover:underline">
                <span>Configure Stays</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="lg:w-1/2 w-full">
            <div className="aspect-[4/3] rounded-[28px] overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border)] shadow-premium relative">
              <img
                src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=80"
                alt="Kyoto temple"
                className="w-full h-full object-cover opacity-90 dark:opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent" />
            </div>
          </div>
        </div>

        {/* Story Block 2: Budget (Image Left, Text Right) */}
        <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-20">
          <div className="lg:w-1/2 space-y-6 text-left">
            <div className="w-10 h-10 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)]">
              <Calculator className="w-5 h-5" />
            </div>

            <h3 className="font-heading text-3xl sm:text-4xl font-normal text-[var(--text-primary)] leading-tight">
              Travel budget,<br />
              <span className="italic font-light text-[var(--text-secondary)] dark:text-slate-350">aligned with comfort.</span>
            </h3>

            <p className="text-[var(--text-secondary)] font-light font-body leading-relaxed text-sm sm:text-base">
              Set a daily budget limit, check hotel costs instantly, and see exchange rates. We track your spending categories automatically so you never overspend.
            </p>

            <div className="pt-2">
              <Link to="/budget-planner" className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--accent)] uppercase tracking-wider hover:underline">
                <span>AI Budget Planner</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="lg:w-1/2 w-full">
            <div className="aspect-[4/3] rounded-[28px] overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border)] shadow-premium relative">
              <img
                src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80"
                alt="Stay pricing details"
                className="w-full h-full object-cover opacity-90 dark:opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent" />
            </div>
          </div>
        </div>

        {/* Why Choose Trip Ready? 3x3 Features Grid */}
        <div className="pt-24 border-t border-[var(--border)] space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--accent)] text-[10px] font-bold uppercase tracking-widest mx-auto">
              <span>Why Choose Us</span>
            </div>
            <h3 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-luxury-primary dark:text-white leading-tight">
              Why use <span className="italic font-light text-[var(--text-secondary)] dark:text-slate-350">Trip Ready?</span>
            </h3>
            <p className="text-[var(--text-secondary)] font-light font-body text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
              Plan your next adventure easily with smart AI tools, real-time safety updates, and simple guides.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const IconComp = {
                Brain: Brain,
                Calculator: Calculator,
                Sparkles: Sparkles,
                Navigation: Navigation,
                CloudSun: CloudSun,
                Globe: Globe,
                CheckSquare: CheckSquare,
                FileText: FileText,
                Map: Map,
              }[feature.icon] || Sparkles;

              return (
                <div
                  key={feature.id}
                  className="bg-white dark:bg-[#081125] border border-[var(--border)] p-6 rounded-[28px] flex flex-col items-start text-left space-y-4 hover:border-[var(--accent)]/20 hover:shadow-premium group transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-10 h-10 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] group-hover:text-[var(--accent)] group-hover:bg-[var(--accent)]/[0.06] transition-all">
                    <IconComp className="w-5 h-5 text-[var(--accent)]" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-heading text-base font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                      {feature.title}
                    </h4>
                    <p className="text-[var(--text-secondary)] font-light font-body text-xs leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
