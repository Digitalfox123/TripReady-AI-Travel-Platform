import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Clock, Sparkles } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('support');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-body overflow-x-hidden pt-20 transition-colors duration-500">
      
      {/* ─── Hero Section ─── */}
      <section className="relative py-16 bg-[var(--bg-secondary)] border-b border-[var(--border)]">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[var(--accent)]/[0.01] rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 text-center space-y-4 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--accent)] text-xs font-semibold uppercase tracking-wider">
            <Mail className="w-3.5 h-3.5" /> Support Desk
          </span>
          <h1 className="font-heading text-4xl sm:text-6xl font-normal tracking-tight text-[var(--text-primary)] leading-none">
            Get In Touch With <span className="text-[var(--accent)]">Our Team</span>
          </h1>
          <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-xl mx-auto font-light leading-relaxed">
            Have questions about our AI models, currency updates, or partnership opportunities? Reach out anytime.
          </p>
        </div>
      </section>

      {/* ─── Main Content Grid ─── */}
      <section className="section-padding bg-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            
            {/* Left: Contact Info */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <div className="glass-card p-6 sm:p-8 space-y-6 border border-[var(--border)]">
                <h3 className="font-heading text-xl font-bold text-[var(--text-primary)] flex items-center gap-2 border-b border-[var(--border)] pb-4">
                  <Sparkles className="w-5 h-5 text-[var(--accent)] animate-pulse" /> Support Coordinates
                </h3>

                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center shrink-0 text-[var(--accent)] shadow-sm">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider block font-bold">Email Support</span>
                      <a href="mailto:support@tripready.com" className="text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors text-sm font-semibold mt-0.5 block">
                        support@tripready.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center shrink-0 text-[var(--accent)] shadow-sm">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider block font-bold">Hotline Desk</span>
                      <span className="text-[var(--text-primary)] text-sm font-semibold font-mono mt-0.5 block">
                        +1 (800) 540-3200
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center shrink-0 text-[var(--accent)] shadow-sm">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider block font-bold">HQ Coordinates</span>
                      <span className="text-[var(--text-primary)] text-sm font-medium leading-relaxed mt-0.5 block">
                        100 Silicon Blvd, Suite 400, San Francisco, CA
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center shrink-0 text-[var(--accent)] shadow-sm">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider block font-bold">Desk Hours</span>
                      <span className="text-[var(--text-primary)] text-sm font-medium leading-relaxed mt-0.5 block">
                        Monday - Friday: 09:00 AM - 06:00 PM EST
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: styled form */}
            <div className="lg:col-span-7 w-full">
              <div className="glass-card p-6 sm:p-8 relative overflow-hidden border border-[var(--border)]">
                {/* Accent line top highlight */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-[var(--accent)]" />

                {submitted ? (
                  <div className="text-center py-12 space-y-4 animate-scale-in text-left">
                    <CheckCircle size={64} className="text-[var(--accent)] mx-auto animate-pulse" />
                    <h3 className="text-2xl font-heading font-normal mb-2 text-center text-[var(--text-primary)]">Message Transmitted</h3>
                    <p className="text-[var(--text-secondary)] max-w-sm mx-auto text-sm leading-relaxed font-light text-center">
                      Our support staff has successfully queued your submission. We typically reply within 2 hours.
                    </p>
                    <div className="flex justify-center mt-6">
                      <button
                        onClick={() => setSubmitted(false)}
                        className="btn-primary py-2.5 px-6 rounded-full text-xs font-semibold shadow-premium"
                      >
                        Send Another Message
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5 text-left">
                    <h3 className="text-lg font-heading font-normal text-[var(--text-primary)]">Transmit Secure Message</h3>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-bold font-heading">Full Name</label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Traveler Name"
                          className="w-full bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border)] px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-[var(--accent)] font-medium text-sm transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-bold font-heading">Email Address</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="email@domain.com"
                          className="w-full bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border)] px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-[var(--accent)] font-medium text-sm transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-bold font-heading">Subject Topic</label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border)] px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-[var(--accent)] font-medium text-sm transition-all"
                      >
                        <option value="support">Technical Support / Budget Engine</option>
                        <option value="partnership">B2B SaaS / Travel Partners</option>
                        <option value="press">Press & Marketing inquiries</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-bold font-heading">Message Details</label>
                      <textarea
                        required
                        rows={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Write your request details here..."
                        className="w-full bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border)] px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-[var(--accent)] font-medium text-sm transition-all"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full btn-sunset py-3.5 rounded-full font-bold flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all text-sm shadow-premium"
                    >
                      <Send className="w-4 h-4 text-white" />
                      <span>Transmit Message</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
            
          </div>
        </div>
      </section>
    </div>
  );
}
