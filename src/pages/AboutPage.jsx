import { useNavigate } from 'react-router-dom';
import { Award, Compass, Heart, Shield, Sparkles, Users } from 'lucide-react';

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-body overflow-x-hidden pt-20 transition-colors duration-500">
      
      {/* ─── Hero Section ─── */}
      <section className="relative py-20 bg-[var(--bg-secondary)] border-b border-[var(--border)]">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[var(--accent)]/[0.01] rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--accent)] text-xs font-semibold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5 animate-spin-slow" />
            <span>Redefining Global Travel</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl font-normal tracking-tight text-[var(--text-primary)] leading-none">
            The World's First <span className="text-[var(--accent)]">AI Travel Companion</span>
          </h1>

          <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto font-light leading-relaxed">
            Trip Ready was founded in 2025 with a simple yet bold mission: to fuse cutting-edge artificial intelligence with beautiful frontend design, empowering travelers to explore our planet stress-free.
          </p>
        </div>
      </section>

      {/* ─── Stats Row ─── */}
      <section className="py-16 bg-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Travelers Planned', value: '1M+' },
              { label: 'Destinations Evaluated', value: '5000+' },
              { label: 'Budget Precision', value: '99.8%' },
              { label: 'Carbon Neutrality', value: '100%' },
            ].map((stat, i) => (
              <div key={i} className="glass-card p-6 text-center border border-[var(--border)] shadow-premium">
                <p className="text-3xl sm:text-4xl font-heading font-normal text-[var(--accent)] tabular-nums">{stat.value}</p>
                <p className="text-[10px] text-[var(--text-secondary)] mt-2 font-bold uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Core Values Grid ─── */}
      <section className="section-padding bg-[var(--bg-secondary)] border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--accent)] text-xs font-semibold uppercase tracking-wider mb-4">
              <Award className="w-3.5 h-3.5" /> Our DNA
            </span>
            <h2 className="section-title text-center">
              Our Foundational Values
            </h2>
            <p className="section-subtitle">
              We hold ourselves to high standards of quality, accurate travel guides, and sustainability.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Uncompromised Safety',
                desc: 'We constantly verify regional travel advisories, emergency numbers, and embassy coordinates so you travel with absolute security.',
              },
              {
                icon: Heart,
                title: 'Immersive Experiences',
                desc: 'We focus on uncovering true cultural hubs and authentic culinary spots rather than just typical crowded tourist traps.',
              },
              {
                icon: Sparkles,
                title: 'Smart Optimization',
                desc: 'Our systems search through flights, hotel rates, and currency values to find you the best travel deals.',
              }
            ].map((value, idx) => (
              <div key={idx} className="glass-card p-8 text-left space-y-4 hover:-translate-y-1 transition-all duration-300 border border-[var(--border)]">
                <div className="w-12 h-12 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] flex items-center justify-center shrink-0 shadow-sm text-[var(--accent)]">
                  <value.icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-xl font-bold text-[var(--text-primary)]">{value.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-light">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Team / Call To Action ─── */}
      <section className="section-padding bg-[var(--bg-primary)]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
          <h2 className="font-heading text-3xl sm:text-5xl font-normal text-[var(--text-primary)] leading-tight">
            Join the Journey Today
          </h2>
          
          <p className="text-[var(--text-secondary)] leading-relaxed max-w-2xl mx-auto font-light text-base">
            Thousands of solo adventurers, families, and global digital nomads configure their stays and travel finances via Trip Ready daily. The future of travel planning is here.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="btn-sunset shadow-premium"
            >
              Start Trip Planning
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="btn-primary shadow-premium"
            >
              Get in Touch
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
