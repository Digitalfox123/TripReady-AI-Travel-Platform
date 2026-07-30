import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Send,
  ChevronRight,
  Globe,
  Heart,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';


/* ========== Data ========== */
const toolsLinks = [
  { name: 'AI Trip Planner', path: '/ai-trip-planner' },
  { name: 'AI Budget Planner', path: '/budget-planner' },
  { name: 'TripAI Concierge', path: '/trip-ai' },
  { name: 'Country Explorer', path: '/country-explorer' },
];

const exploreLinks = [
  { name: 'Destinations', path: '/destinations' },
  { name: 'Travel Guides', path: '/blog' },
  { name: 'About Our Mission', path: '/about' },
  { name: 'Help & Support', path: '/contact' },
];

const legalLinks = [
  { name: 'Privacy Policy', path: '/privacy' },
  { name: 'Terms of Use', path: '/terms' },
  { name: 'Legal Disclaimer', path: '/disclaimer' },
];

const socialLinks = [
  { Icon: Facebook, label: 'Facebook', href: '#' },
  { Icon: Twitter, label: 'Twitter', href: '#' },
  { Icon: Instagram, label: 'Instagram', href: '#' },
  { Icon: Youtube, label: 'YouTube', href: '#' },
  { Icon: Linkedin, label: 'LinkedIn', href: '#' },
];

/* ========== Reusable column component ========== */
const FooterColumn = ({ title, links }) => (
  <div className="text-left">
    <h4 className="font-heading font-bold text-white text-xs uppercase tracking-wider mb-5">{title}</h4>
    <ul className="space-y-3">
      {links.map((link) => (
        <li key={link.name}>
          <Link
            to={link.path}
            className="group flex items-center gap-1.5 text-neutral-400 hover:text-[var(--accent)] text-xs uppercase tracking-wider transition-colors duration-300 font-medium"
          >
            <ChevronRight
              size={12}
              className="opacity-0 -translate-x-1.5 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 text-[var(--accent)]"
            />
            <span>{link.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

/* ========== Logo (matches Navbar) ========== */
const Logo = () => (
  <span className="font-heading font-black text-xl tracking-tighter text-white lowercase flex items-baseline select-none">
    tripready
    <span className="w-2 h-2 rounded-full bg-[var(--accent)] ml-0.5 group-hover:scale-125 transition-transform duration-300 self-baseline mb-0.5" />
  </span>
);

/* ========== Main Footer ========== */
export default function Footer() {
  const { preferences, updatePreferences } = useAuth();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="relative bg-[#091220] text-slate-400 overflow-hidden border-t border-slate-900 transition-colors duration-500">
      
      {/* ---- Single Accent top border fade ---- */}
      <div
        aria-hidden
        className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/30 to-transparent"
      />

      {/* ========== TOP SECTION — 4 columns ========== */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 lg:gap-8">
          
          {/* Column 1: Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2 text-left space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <Logo />
            </Link>
            
            <p className="text-neutral-400 text-xs leading-relaxed max-w-xs font-light">
              Your AI-powered travel companion. Discover destinations, plan budgets, and organize journeys — all in one simple, peaceful planner.
            </p>
            
            {/* Social icons */}
            <div className="flex items-center gap-2 pt-2">
              {socialLinks.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="p-2 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-500 hover:text-[var(--accent)] hover:border-[var(--accent)]/30 hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: AI Travel Tools */}
          <FooterColumn title="AI Tools" links={toolsLinks} />

          {/* Column 3: Explore */}
          <FooterColumn title="Explore" links={exploreLinks} />

          {/* Column 4: Legal */}
          <FooterColumn title="Legal" links={legalLinks} />
        </div>
      </div>

      {/* ========== MIDDLE SECTION — Newsletter ========== */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 bg-[#050C16] border border-white/[0.06] rounded-[24px] shadow-premium relative overflow-hidden backdrop-blur-md">
          {/* Text */}
          <div className="flex-1 text-center md:text-left space-y-1">
            <h4 className="font-heading font-normal text-white text-lg flex items-center justify-center md:justify-start gap-2">
              <Globe size={18} className="text-[var(--accent)]" />
              Stay Travel-Ready
            </h4>
            <p className="text-neutral-400 text-xs font-light">
              Get travel cost updates, destination alerts, and helpful travel tips sent straight to your inbox.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubscribe} className="flex w-full md:w-auto gap-2">
            <div className="relative flex-1 md:w-64">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full pl-4 pr-4 py-2.5 rounded-full bg-[#101A2E] border border-white/[0.08] text-white placeholder:text-neutral-500 text-xs outline-none focus:border-[var(--accent)]/40 focus:ring-1 focus:ring-[var(--accent)]/20 transition-all"
              />
            </div>
            <button
              type="submit"
              className="btn-sunset flex items-center gap-1.5 shrink-0"
            >
              <Send size={12} />
              <span>Subscribe</span>
            </button>
          </form>

          {/* Success toast */}
          {subscribed && (
            <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-emerald-500 text-xs font-medium animate-fade-in">
              ✓ Subscribed successfully! Welcome to Trip Ready.
            </p>
          )}
        </div>
      </div>

      {/* ========== BOTTOM SECTION ========== */}
      <div className="relative border-t border-slate-900 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright text (left-aligned) */}
          <p className="font-heading font-semibold text-[9px] tracking-[0.16em] text-slate-500 uppercase leading-none text-center sm:text-left select-none">
            © 2026 TRIP READY. ALL RIGHTS RESERVED. DESIGNED FOR EXPLORERS.
          </p>
          
          {/* Language & Currency selectors (right-aligned) */}
          <div className="flex items-center gap-3 select-none">
            {/* Language Selector */}
            <div className="relative flex items-center bg-slate-950/60 dark:bg-neutral-900/60 border border-slate-800/80 dark:border-white/[0.06] rounded-full px-4 py-1.5 text-slate-400 hover:border-slate-700 dark:hover:border-white/[0.12] hover:text-slate-200 transition-all duration-300">
              <Globe size={11} className="mr-1.5 text-slate-500" />
              <select
                value={preferences.language}
                onChange={(e) => updatePreferences(e.target.value, preferences.currency, preferences.theme)}
                className="bg-transparent border-none outline-none text-[10px] font-bold text-slate-300 cursor-pointer appearance-none pr-5 select-none focus:ring-0 focus:border-none p-0"
              >
                {['English', 'اردو', 'العربية', 'Français', 'Deutsch', 'Español'].map(lang => (
                  <option key={lang} value={lang} className="bg-[#0f172a] text-slate-200">{lang}</option>
                ))}
              </select>
              <ChevronDown size={10} className="absolute right-3.5 text-slate-500 pointer-events-none" />
            </div>

            {/* Currency Selector */}
            <div className="relative flex items-center bg-slate-950/60 dark:bg-neutral-900/60 border border-slate-800/80 dark:border-white/[0.06] rounded-full px-4 py-1.5 text-slate-400 hover:border-slate-700 dark:hover:border-white/[0.12] hover:text-slate-200 transition-all duration-300">
              <span className="mr-1.5 font-bold text-[10px] text-slate-550">$</span>
              <select
                value={preferences.currency}
                onChange={(e) => updatePreferences(preferences.language, e.target.value, preferences.theme)}
                className="bg-transparent border-none outline-none text-[10px] font-bold text-slate-300 cursor-pointer appearance-none pr-5 select-none focus:ring-0 focus:border-none p-0"
              >
                {['USD', 'PKR', 'AED', 'SAR', 'EUR', 'GBP', 'INR', 'JPY'].map(curr => (
                  <option key={curr} value={curr} className="bg-[#0f172a] text-slate-200">{curr}</option>
                ))}
              </select>
              <ChevronDown size={10} className="absolute right-3.5 text-slate-500 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
