import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sun, Moon, Menu, X, Plane, Search, ChevronRight, ChevronDown, Compass, MapPin, Globe, Map, User } from 'lucide-react';
import { searchDestinations } from '../utils/database';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../utils/useTranslation';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Destinations', path: '/destinations' },
  { name: 'Religion & Pilgrimage', path: '/pilgrimage' },
  { name: 'Explorer', path: '/country-explorer' },
  { name: 'AI Trip Planner', path: '/ai-trip-planner' },
  { name: 'Budget Planner', path: '/budget-planner' },
  { name: 'TripAI', path: '/trip-ai' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

const Logo = ({ scrolled, hasDarkHero }) => (
  <span className={`font-heading font-black text-xl tracking-tighter lowercase flex items-baseline select-none transition-colors duration-300 ${
    !scrolled && hasDarkHero
      ? 'text-white'
      : 'text-luxury-primary dark:text-white'
  }`}>
    tripready
    <span className="w-2 h-2 rounded-full bg-[var(--accent)] ml-0.5 group-hover:scale-125 transition-transform duration-300 self-baseline mb-0.5" />
  </span>
);

export default function Navbar({ isDark, toggleTheme }) {
  const { user, profile } = useAuth();
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [activeItemIndex, setActiveItemIndex] = useState(-1);
  
  // Tools Dropdown State & Timer for smooth hover transitions
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const dropdownTimerRef = useRef(null);

  const handleMouseEnter = () => {
    if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current);
    setToolsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimerRef.current = setTimeout(() => {
      setToolsDropdownOpen(false);
    }, 150);
  };

  const toolItems = [
    { name: 'Religion & Pilgrimage', path: '/pilgrimage', desc: 'Explore faith-based journeys & calculators' },
    { name: 'AI Trip Planner', path: '/ai-trip-planner', desc: 'Custom day-by-day itineraries instantly' },
    { name: 'Budget Planner', path: '/budget-planner', desc: 'Estimate and track travel expenses' },
  ];
  
  const location = useLocation();
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const modalRef = useRef(null);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 24);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    setActiveItemIndex(-1);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = (mobileOpen || searchOpen) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen, searchOpen]);

  // Handle fuzzy search execution
  useEffect(() => {
    let active = true;
    async function runSearch() {
      if (searchQuery.trim().length > 0) {
        try {
          const results = await searchDestinations(searchQuery, 8);
          if (active) {
            setSearchResults(results);
            setActiveItemIndex(prev => Math.min(prev, results.length - 1));
          }
        } catch (e) {
          console.error(e);
        }
      } else {
        setSearchResults([]);
        setActiveItemIndex(-1);
      }
    }
    runSearch();
    return () => {
      active = false;
    };
  }, [searchQuery]);

  // Keyboard accessibility handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!searchOpen) return;

      if (e.key === 'Escape') {
        setSearchOpen(false);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveItemIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveItemIndex((prev) => (prev > 0 ? prev - 1 : searchResults.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (activeItemIndex >= 0 && searchResults[activeItemIndex]) {
          handleSelectResult(searchResults[activeItemIndex]);
        } else if (searchResults.length > 0) {
          handleSelectResult(searchResults[0]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen, searchResults, activeItemIndex]);

  // Handle clicks outside of search container
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target) && searchOpen) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchOpen]);

  // Focus search input when modal opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 150);
    }
  }, [searchOpen]);

  const handleSelectResult = (item) => {
    setSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    setActiveItemIndex(-1);
    
    if (item.type === 'guide') {
      navigate(item.path);
    } else {
      // Always navigate to the destination info page layout
      navigate(`/destination/${item.slug}`);
    }
  };

  const isActive = (path) => location.pathname === path;

  // Render type specific badge
  const renderBadge = (type) => {
    switch (type) {
      case 'country':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/15 whitespace-nowrap">
            <Globe className="inline-block mr-1 text-blue-500 align-middle" size={11} /> Country
          </span>
        );
      case 'state':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/15 whitespace-nowrap">
            <Map className="inline-block mr-1 text-purple-500 align-middle" size={11} /> State
          </span>
        );
      case 'city':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/15 whitespace-nowrap">
            <MapPin className="inline-block mr-1 text-emerald-500 align-middle" size={11} /> City
          </span>
        );
      case 'attraction':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/15 whitespace-nowrap">
            <MapPin className="inline-block mr-1 text-orange-500 align-middle" size={11} /> Attraction
          </span>
        );
      case 'guide':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/15 whitespace-nowrap">
            <Compass className="inline-block mr-1 text-amber-500 align-middle" size={11} /> Guide
          </span>
        );
      default:
        return null;
    }
  };

  const hasDarkHero = (location.pathname === '/pilgrimage/umrah') || (isDark && ['/pilgrimage', '/country-explorer', '/ai-trip-planner'].includes(location.pathname));

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 w-full border-b backdrop-blur-xl flex items-center ${
          scrolled
            ? 'bg-white/95 dark:bg-[#020813]/95 border-slate-200/50 dark:border-white/[0.08] shadow-md h-[64px]'
            : 'bg-transparent border-transparent h-[78px]'
        }`}
      >
        <div className="w-full px-6 sm:px-8 lg:px-10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <Logo scrolled={scrolled} hasDarkHero={hasDarkHero} />
          </Link>

          {/* Links */}
          <ul className="hidden lg:flex items-center gap-1 xl:gap-1.5">
            {/* Primary Left Links */}
            {[
              { name: 'Home', path: '/' },
              { name: 'Destinations', path: '/destinations' },
              { name: 'Explorer', path: '/country-explorer' },
            ].map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`relative px-2 xl:px-3.5 py-2 text-[10px] xl:text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-300 ${
                    isActive(link.path)
                      ? 'text-[var(--accent)] font-bold'
                      : !scrolled && hasDarkHero
                      ? 'text-white/90 hover:text-[var(--accent)]'
                      : 'text-luxury-secondary dark:text-slate-300 hover:text-[var(--accent)] dark:hover:text-[var(--accent)]'
                  }`}
                >
                  {t('nav.' + link.name.toLowerCase(), link.name)}
                  {isActive(link.path) && (
                    <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                  )}
                </Link>
              </li>
            ))}

            {/* Tools Dropdown Link */}
            <li 
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                className={`flex items-center gap-1 px-2 xl:px-3.5 py-2 text-[10px] xl:text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-300 cursor-pointer ${
                  toolItems.some(item => isActive(item.path))
                    ? 'text-[var(--accent)] font-bold'
                    : !scrolled && hasDarkHero
                    ? 'text-white/90 hover:text-[var(--accent)]'
                    : 'text-luxury-secondary dark:text-slate-300 hover:text-[var(--accent)] dark:hover:text-[var(--accent)]'
                }`}
              >
                <span>Tools</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${toolsDropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
              </button>
              
              {/* Dropdown Menu */}
              <div 
                className={`absolute left-1/2 -translate-x-1/2 mt-2 w-72 bg-white/95 dark:bg-dark-300/95 backdrop-blur-md border border-slate-150 dark:border-white/[0.08] shadow-premium rounded-2xl p-2.5 transition-all duration-300 z-50 origin-top ${
                  toolsDropdownOpen 
                    ? 'opacity-100 translate-y-0 pointer-events-auto visible scale-100' 
                    : 'opacity-0 -translate-y-2 pointer-events-none invisible scale-95'
                }`}
              >
                {toolItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`block px-3.5 py-2 rounded-xl transition-all duration-200 text-left ${
                      isActive(item.path)
                        ? 'bg-[var(--accent)]/10 text-[var(--accent)] font-bold'
                        : 'text-luxury-primary dark:text-white hover:bg-slate-50 dark:hover:bg-white/[0.03]'
                    }`}
                  >
                    <span className="block text-xs font-bold">{t(item.name === 'Religion & Pilgrimage' ? 'nav.pilgrimage' : item.name === 'AI Trip Planner' ? 'nav.plan' : item.name === 'Budget Planner' ? 'nav.budget' : 'nav.' + item.name.toLowerCase(), item.name)}</span>
                    <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-light mt-0.5 leading-snug">{item.desc}</span>
                  </Link>
                ))}
              </div>
            </li>

            {/* Primary Right Links */}
            {[
              { name: 'TripAI', path: '/trip-ai' },
              { name: 'About', path: '/about' },
              { name: 'Contact', path: '/contact' },
            ].map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`relative px-2 xl:px-3.5 py-2 text-[10px] xl:text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-300 ${
                    isActive(link.path)
                      ? 'text-[var(--accent)] font-bold'
                      : !scrolled && hasDarkHero
                      ? 'text-white/90 hover:text-[var(--accent)]'
                      : 'text-luxury-secondary dark:text-slate-300 hover:text-[var(--accent)] dark:hover:text-[var(--accent)]'
                  }`}
                >
                  {t('nav.' + link.name.toLowerCase(), link.name)}
                  {isActive(link.path) && (
                    <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Search Trigger Button */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
              className={`p-2 rounded-full transition-all ${
                !scrolled && hasDarkHero
                  ? 'text-white/90 hover:text-white hover:bg-white/10'
                  : 'text-luxury-secondary dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <Search size={16} />
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className={`p-2 rounded-full transition-all ${
                !scrolled && hasDarkHero
                  ? 'text-white/90 hover:text-white hover:bg-white/10'
                  : 'text-luxury-secondary dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* CTA buttons or User Profile Avatar */}
            {user ? (
              <div className="flex items-center gap-3.5">
                <Link to="/ai-trip-planner" className="btn-primary py-1.5 px-4 text-[11px]">
                  {t('nav.plan', 'Plan Trip')}
                </Link>
                <Link 
                  to="/dashboard" 
                  className={`w-8 h-8 rounded-full border overflow-hidden hover:scale-105 hover:border-[var(--accent)] active:scale-95 transition-all flex items-center justify-center ${
                    !scrolled && hasDarkHero
                      ? 'border-white/20 bg-white/10'
                      : 'border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/[0.04]'
                  }`}
                  title="View Profile Workspace"
                >
                  <img 
                    src={profile?.avatar_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user.email)}`} 
                    alt="Profile Avatar"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = 'https://api.dicebear.com/7.x/adventurer/svg?seed=fallback'; }}
                  />
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link 
                  to="/auth" 
                  className={`px-3.5 py-1.5 rounded-full border transition-all text-[11px] font-bold ${
                    !scrolled && hasDarkHero
                      ? 'border-white/20 hover:bg-white/10 text-white'
                      : 'border-slate-200 dark:border-white/[0.08] hover:bg-slate-50 dark:hover:bg-white/5 text-luxury-primary dark:text-white'
                  }`}
                >
                  {t('nav.signin', 'Sign In')}
                </Link>
                <Link 
                  to="/auth" 
                  state={{ mode: 'signup' }} 
                  className="px-3.5 py-1.5 rounded-full bg-gradient-to-tr from-[var(--accent)] to-indigo-600 hover:scale-105 active:scale-95 transition-all text-[11px] font-bold text-white shadow-sm"
                >
                  {t('nav.register', 'Register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile actions */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Mobile Search button */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
              className={`p-2 rounded-full transition-all ${
                !scrolled && hasDarkHero
                  ? 'text-white hover:bg-white/10'
                  : 'text-luxury-primary dark:text-white hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <Search size={20} />
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className={`p-2 rounded-full transition-all ${
                !scrolled && hasDarkHero
                  ? 'text-white hover:bg-white/10'
                  : 'text-luxury-primary dark:text-white hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* ─── Global Search Modal Overlay ─── */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/85 backdrop-blur-md flex justify-center pt-24 px-4 overflow-y-auto">
          <div 
            ref={modalRef}
            className="w-full max-w-2xl bg-white dark:bg-[#071125] border border-slate-150 dark:border-white/[0.08] rounded-[32px] p-6 shadow-premium max-h-[550px] flex flex-col animate-scale-in text-left"
          >
            {/* Search Input Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/[0.04]">
              <div className="flex items-center gap-3 flex-1">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search countries, states, cities, attractions..."
                  className="w-full bg-transparent border-none outline-none text-base font-body text-luxury-primary dark:text-white placeholder-slate-400"
                />
              </div>
              <button 
                onClick={() => setSearchOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Search Results */}
            <div className="flex-1 overflow-y-auto py-3 no-scrollbar space-y-1.5">
              {searchQuery.trim().length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <Compass className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700 animate-spin-slow" />
                  <p className="text-xs font-light max-w-xs mx-auto leading-relaxed">
                    Search the global database instantly. Type a city ("Lahore", "Tokyo"), state ("Punjab", "California"), or country ("Pakistan", "Japan").
                  </p>
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map((item, idx) => (
                  <button
                    key={`${item.type}_${item.id}`}
                    onClick={() => handleSelectResult(item)}
                    onMouseEnter={() => setActiveItemIndex(idx)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all border text-left ${
                      idx === activeItemIndex
                        ? 'bg-slate-50 dark:bg-white/[0.03] border-slate-150 dark:border-white/10 scale-[1.005]'
                        : 'bg-transparent border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/[0.04] text-slate-500 dark:text-slate-400 flex items-center justify-center shrink-0">
                        {item.type === 'country' && <Globe size={14} />}
                        {item.type === 'state' && <Map size={14} />}
                        {item.type === 'city' && <MapPin size={14} />}
                        {item.type === 'attraction' && <MapPin size={14} />}
                        {item.type === 'guide' && <Compass size={14} />}
                      </div>
                      <div className="truncate">
                        <h4 className="font-heading font-bold text-xs sm:text-sm text-luxury-primary dark:text-white truncate">
                          {item.name}
                        </h4>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-light truncate mt-0.5">
                          {item.displaySubtitle}
                        </p>
                      </div>
                    </div>
                    {renderBadge(item.type)}
                  </button>
                ))
              ) : (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <Search className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700" />
                  <h5 className="font-heading font-bold text-sm">No Results Found</h5>
                  <p className="text-xs font-light max-w-xs mx-auto leading-relaxed">
                    We couldn't find any country, state, city, or attraction matching "{searchQuery}". Try verifying the spelling.
                  </p>
                </div>
              )}
            </div>

            {/* Footer tips */}
            <div className="pt-3 border-t border-slate-100 dark:border-white/[0.04] flex items-center justify-between text-[9px] font-mono text-slate-400">
              <span>↑↓ Navigation</span>
              <span>⏎ Select</span>
              <span>ESC Close</span>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-xs transition-opacity duration-300 lg:hidden ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileOpen(false)}
      />

      <aside
        className={`fixed top-0 right-0 z-[70] h-full w-[280px] transition-transform duration-300 ease-in-out lg:hidden
          bg-white dark:bg-dark-300 border-l border-luxury-border dark:border-white/[0.04] shadow-premium
          ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-luxury-border dark:border-white/[0.04]">
          <Link to="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
            <Logo />
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 text-luxury-secondary dark:text-slate-300 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col px-4 pt-4 gap-1 text-left">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={`px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300
                ${
                  isActive(link.path)
                    ? 'bg-[var(--accent)]/10 text-[var(--accent)] font-extrabold'
                    : 'text-luxury-secondary dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.02]'
                }
              `}
            >
              {t(link.name === 'Religion & Pilgrimage' ? 'nav.pilgrimage' : link.name === 'AI Trip Planner' ? 'nav.plan' : link.name === 'Budget Planner' ? 'nav.budget' : 'nav.' + link.name.toLowerCase(), link.name)}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 inset-x-0 p-6 space-y-4 border-t border-luxury-border dark:border-white/[0.04]">
          {/* Mobile Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-slate-150 dark:border-white/[0.04] text-xs font-bold uppercase tracking-widest text-luxury-secondary dark:text-slate-355 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-all"
          >
            <span>Appearance</span>
            <div className="flex items-center gap-1.5">
              {isDark ? (
                <>
                  <Sun size={14} className="text-amber-500" />
                  <span className="text-[10px] text-slate-500">Light</span>
                </>
              ) : (
                <>
                  <Moon size={14} className="text-indigo-400" />
                  <span className="text-[10px] text-slate-500">Dark</span>
                </>
              )}
            </div>
          </button>

          {user ? (
            <div className="flex gap-2">
              <Link
                to="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl border border-slate-150 dark:border-white/[0.04] text-xs font-bold uppercase tracking-widest text-luxury-secondary dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.02]"
              >
                <User size={13} /> Dashboard
              </Link>
              <Link
                to="/ai-trip-planner"
                onClick={() => setMobileOpen(false)}
                className="btn-primary flex-1 flex items-center justify-center gap-2 text-xs"
              >
                Plan Trip
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                to="/auth"
                onClick={() => setMobileOpen(false)}
                className="w-full py-3 rounded-xl border border-slate-150 dark:border-white/[0.04] text-center text-xs font-bold uppercase tracking-widest text-luxury-secondary dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.02]"
              >
                Sign In
              </Link>
              <Link
                to="/auth"
                state={{ mode: 'signup' }}
                onClick={() => setMobileOpen(false)}
                className="btn-primary w-full py-3 text-center text-xs font-bold"
              >
                Register Free
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
