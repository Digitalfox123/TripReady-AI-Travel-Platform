import { useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft, Shield } from 'lucide-react';

export default function PrivacyPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-body overflow-x-hidden pt-20 transition-colors duration-500">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold text-[var(--accent)] hover:underline transition-colors uppercase tracking-wider mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go Back</span>
        </button>

        <div className="glass-card p-6 sm:p-10 relative overflow-hidden text-left space-y-6 border border-[var(--border)] shadow-premium">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-[var(--accent)]" />
          
          <div className="flex items-center gap-3 border-b border-[var(--border)] pb-6">
            <div className="w-12 h-12 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)] shadow-sm">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-heading text-2xl sm:text-4xl font-normal text-[var(--text-primary)]">Privacy Policy</h1>
              <p className="text-[10px] text-[var(--text-secondary)] mt-1 font-mono uppercase tracking-wider">Last updated: May 25, 2026</p>
            </div>
          </div>

          <div className="space-y-5 text-sm text-[var(--text-secondary)] leading-relaxed font-light">
            <p>
              At <strong>Trip Ready</strong>, we hold traveler privacy in the highest regard. This Privacy Policy documents what information we collect (including trip preferences, selected billing currencies, stayed interests, feedback messaging records) and how we secure it.
            </p>

            <h3 className="font-heading text-lg font-bold text-[var(--text-primary)] pt-4">1. Information We Collect</h3>
            <p>
              We collect general specifications you type in the search bar and the budget configurator (including departure/destination spots, duration, dates, traveler metrics, stay styles) to process optimal calculations in real-time. When you use the Contact form, we collect your name and email to resolve coordinates.
            </p>

            <h3 className="font-heading text-lg font-bold text-[var(--text-primary)] pt-4">2. Cookies & Local Storage</h3>
            <p>
              We use standard browser cookies and local storage tokens to persist your aesthetic settings, specifically keeping track of dark/light theme toggles and custom budget planning estimates so they load smoothly when you return.
            </p>

            <h3 className="font-heading text-lg font-bold text-[var(--text-primary)] pt-4">3. Data Security</h3>
            <p>
              We employ enterprise-grade SSL transmission encryptions, glassmorphism firewalls, and direct access controls. We never sell, distribute, or exchange traveler details with third-party advertising companies. Your records stay encrypted.
            </p>
          </div>

          <div className="pt-6 border-t border-[var(--border)] flex items-center justify-between text-[10px] text-[var(--text-secondary)] font-mono">
            <span>Trip Ready Legal Operations</span>
            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-[var(--accent)]" /> Insured Protected</span>
          </div>
        </div>
      </div>
    </div>
  );
}
