import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowLeft, Shield } from 'lucide-react';

export default function TermsPage() {
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
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-heading text-2xl sm:text-4xl font-normal text-[var(--text-primary)]">Terms & Conditions</h1>
              <p className="text-[10px] text-[var(--text-secondary)] mt-1 font-mono uppercase tracking-wider">Last updated: May 25, 2026</p>
            </div>
          </div>

          <div className="space-y-5 text-sm text-[var(--text-secondary)] leading-relaxed font-light">
            <p>
              Welcome to <strong>Trip Ready</strong>. By accessing our website, configuring trip finances, using the AI chatbot planner, or scanning visa checklists, you agree to comply with and be bound by the following Terms & Conditions.
            </p>

            <h3 className="font-heading text-lg font-bold text-[var(--text-primary)] pt-4">1. Permitted Use of AI Services</h3>
            <p>
              Trip Ready grants travelers a limited, non-exclusive, non-transferable license to query our AI travel advisor, formulate custom budgets, check climate timelines, and review destination guides. You may not scrape, frame, or reverse engineer any mathematical models, layouts, CSS properties, or structural APIs powering the application.
            </p>

            <h3 className="font-heading text-lg font-bold text-[var(--text-primary)] pt-4">2. Account Responsibility & Integrity</h3>
            <p>
              If you register an account, you must keep billing records, traveler specifications, and stay details confidential. Any suspicious account access must be reported instantly to our support desk coordinates. We reserve the absolute right to suspend accounts attempting malicious operations.
            </p>

            <h3 className="font-heading text-lg font-bold text-[var(--text-primary)] pt-4">3. Revisions to Terms</h3>
            <p>
              We reserve the right to revise our SaaS features, stay listings, calculations algorithms, and current Terms at our discretion without prior notice. Continued exploration on the website constitutes active agreement to revised terms.
            </p>
          </div>

          <div className="pt-6 border-t border-[var(--border)] flex items-center justify-between text-[10px] text-[var(--text-secondary)] font-mono">
            <span>Trip Ready Legal Operations</span>
            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-[var(--accent)]" /> Protected</span>
          </div>
        </div>
      </div>
    </div>
  );
}
