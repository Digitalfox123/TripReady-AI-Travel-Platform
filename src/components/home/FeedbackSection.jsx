import { useState } from 'react';
import { Star, Send, CheckCircle, User, Mail, Globe, MessageSquare } from 'lucide-react';
import { countries } from '../../data';

const countriesList = countries.map(c => c.name);

export default function FeedbackSection() {
  const [formData, setFormData] = useState({ name: '', email: '', country: '', message: '' });
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <section className="section-padding bg-[var(--bg-secondary)] text-[var(--text-primary)] border-t border-luxury-border relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column — Text */}
          <div className="lg:col-span-5 text-left space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-luxury-border bg-[var(--bg-primary)] text-[10px] font-bold text-luxury-secondary uppercase tracking-widest">
              <MessageSquare className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Feedback</span>
            </div>

            <h2 className="font-heading text-4xl sm:text-5xl font-normal leading-tight text-luxury-primary dark:text-white">
              Share your <span className="italic font-light text-slate-550">experience.</span>
            </h2>

            <p className="text-luxury-secondary dark:text-slate-400 text-base font-light leading-relaxed font-body">
              Your insights help us continuously polish Trip Ready. Let us know how we can elevate your travel workspace.
            </p>
          </div>

          {/* Right Column — Form */}
          <div className="lg:col-span-7 w-full">
            <div className="glass-card p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-luxury-accent/50 to-purple-500/20" />

              {isSubmitted ? (
                <div className="text-center py-12 space-y-4 animate-scale-in">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto animate-pulse" />
                  <h3 className="font-heading text-2xl font-bold text-luxury-primary dark:text-white">Feedback Queued</h3>
                  <p className="text-slate-400 text-sm font-light font-body max-w-sm mx-auto leading-relaxed">
                    Thank you. We review every entry to maintain elite design and mathematical precision.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: '', email: '', country: '', message: '' });
                      setRating(0);
                    }}
                    className="px-6 py-2.5 rounded-full bg-slate-100 dark:bg-white/[0.04] text-xs font-bold text-luxury-primary dark:text-slate-200 border border-luxury-border dark:border-white/[0.06] hover:bg-slate-200 transition-colors"
                  >
                    Send Another Response
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 text-left">
                  <h3 className="font-heading text-lg font-bold text-luxury-primary dark:text-white mb-2">Submit Feedback</h3>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="Your name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-luxury-border dark:border-white/[0.06] text-luxury-primary dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-luxury-accent/30 text-xs font-body"
                      />
                    </div>

                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-luxury-border dark:border-white/[0.06] text-luxury-primary dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-luxury-accent/30 text-xs font-body"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <Globe className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select
                      name="country"
                      required
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-luxury-border dark:border-white/[0.06] text-luxury-primary dark:text-slate-200 focus:outline-none text-xs font-body appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Select Country</option>
                      {countriesList.map((c) => (
                        <option key={c} value={c} className="bg-white dark:bg-dark-300 text-luxury-primary dark:text-white">
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="relative">
                    <textarea
                      name="message"
                      required
                      rows={4}
                      placeholder="Share your travel experiences or feature suggestions..."
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-luxury-border dark:border-white/[0.06] text-luxury-primary dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-luxury-accent/30 text-xs font-body resize-none"
                    />
                  </div>

                  {/* Rating */}
                  <div className="flex items-center justify-between pt-2 border-t border-luxury-border dark:border-white/[0.04]">
                    <span className="text-xs text-slate-400 font-medium">Rate your travel planner</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoveredStar(star)}
                          onMouseLeave={() => setHoveredStar(0)}
                          className="hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-5 h-5 transition-colors ${
                              star <= (hoveredStar || rating)
                                ? 'text-luxury-accent fill-luxury-accent'
                                : 'text-slate-300 dark:text-slate-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-sunset py-3.5 rounded-xl font-bold flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-white" />
                        <span>Submit Feedback</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
