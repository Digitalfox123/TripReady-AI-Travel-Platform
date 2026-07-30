import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Shield } from 'lucide-react';

export default function DisclaimerPage() {
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
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-heading text-2xl sm:text-4xl font-normal text-[var(--text-primary)]">Legal Disclaimer</h1>
              <p className="text-[10px] text-[var(--text-secondary)] mt-1 font-mono uppercase tracking-wider">Last updated: May 25, 2026</p>
            </div>
          </div>

          <div className="space-y-5 text-sm text-[var(--text-secondary)] leading-relaxed font-light">
            <p>
              Welcome to <strong>Trip Ready</strong>. The information provided on this platform (including but not limited to travel budgets, weather forecasts, visa entry eligibility checklists, safety ratings, emergency numbers, stay suggestions, and currency exchange rates) is compiled and simulated via automated algorithmic models for educational and general planning assistance only.
            </p>

            <h3 className="font-heading text-lg font-bold text-[var(--text-primary)] pt-4">1. No Financial or Legal Advice</h3>
            <p>
              Our budget planning and currency converter features are simulated calculations based on historical parameters, approximate pricing multipliers, and estimated inflation curves. They do not constitute official financial recommendations. Stays prices fluctuate constantly and should be checked directly via verified travel merchants before booking. Visa entry declarations do not represent legal border authorizations; travelers must confirm entry protocol clearances with corresponding national embassies.
            </p>

            <h3 className="font-heading text-lg font-bold text-[var(--text-primary)] pt-4">2. Accuracy of Travel Data</h3>
            <p>
              While our AI models strive to analyze relative atmospheric conditions and regional updates, microclimate anomalies and unexpected events occur. Under no circumstances will Trip Ready be held responsible for travel delays, flight cancellations, financial loss, custom clearance rejections, or safety issues encountered while exploring.
            </p>

            <h3 className="font-heading text-lg font-bold text-[var(--text-primary)] pt-4">3. Third-Party Listings</h3>
            <p>
              Any links to stay properties, boutique lodges, tourist sites, or embassy web resources are governed by third-party terms. We do not inspect, endorse, or verify third-party booking channels. Use them at your own risk.
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
