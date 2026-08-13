import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import { Bot, Loader2 } from 'lucide-react';
import { useTheme } from './hooks/useTheme';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './context/AuthContext';
import { topDestinations } from './data';
import { blogPosts } from './data/blogData';

// ── Auto-Retrying Dynamic Import Helper to Prevent Blank Screen Crashes ──
function lazyWithRetry(componentImport) {
  return lazy(async () => {
    try {
      return await componentImport();
    } catch (error) {
      console.warn("Chunk load hiccup caught. Auto-recovering page...", error);
      const lastReload = sessionStorage.getItem('chunk_auto_reload');
      const now = Date.now();
      if (!lastReload || now - parseInt(lastReload, 10) > 8000) {
        sessionStorage.setItem('chunk_auto_reload', now.toString());
        window.location.reload();
      }
      throw error;
    }
  });
}

// ── Lazy Loaded Secondary Route Pages with Auto-Retry ──
const DestinationPage = lazyWithRetry(() => import('./pages/DestinationPage'));
const BudgetPlannerPage = lazyWithRetry(() => import('./pages/BudgetPlannerPage'));
const AboutPage = lazyWithRetry(() => import('./pages/AboutPage'));
const ContactPage = lazyWithRetry(() => import('./pages/ContactPage'));
const DisclaimerPage = lazyWithRetry(() => import('./pages/DisclaimerPage'));
const TermsPage = lazyWithRetry(() => import('./pages/TermsPage'));
const PrivacyPage = lazyWithRetry(() => import('./pages/PrivacyPage'));
const TripAIPage = lazyWithRetry(() => import('./pages/TripAIPage'));
const DestinationsExplorerPage = lazyWithRetry(() => import('./pages/DestinationsExplorerPage'));
const FullTripPlannerPage = lazyWithRetry(() => import('./pages/FullTripPlannerPage'));
const BlogExplorerPage = lazyWithRetry(() => import('./pages/BlogExplorerPage'));
const BlogPostPage = lazyWithRetry(() => import('./pages/BlogPostPage'));
const CountryExplorerPage = lazyWithRetry(() => import('./pages/CountryExplorerPage'));
const CountryPage = lazyWithRetry(() => import('./pages/CountryPage'));
const StatePage = lazyWithRetry(() => import('./pages/StatePage'));
const CityPage = lazyWithRetry(() => import('./pages/CityPage'));
const AttractionPage = lazyWithRetry(() => import('./pages/AttractionPage'));
const UmrahGuidePage = lazyWithRetry(() => import('./pages/UmrahGuidePage'));
const PilgrimageHubPage = lazyWithRetry(() => import('./pages/PilgrimageHubPage'));
const AuthPage = lazyWithRetry(() => import('./pages/AuthPage'));
const ProfileDashboardPage = lazyWithRetry(() => import('./pages/ProfileDashboardPage'));

// Ultra-fast Page Loading Fallback
function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-slate-400 dark:text-slate-500">
        <Loader2 className="w-7 h-7 animate-spin text-blue-600 dark:text-blue-400" />
        <span className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400">Loading...</span>
      </div>
    </div>
  );
}

// ── Scroll to top on route change ───────────────────────────────────
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

// ── Dynamic SEO Document Title & Description Manager ──────────────────
function SEOManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    let title = "Trip Ready — Ultimate AI Travel Planner & Itinerary Organizer";
    let desc = "Plan custom dream trips in seconds with Trip Ready, the ultimate AI travel planner and personal travel companion. Get live weather forecasts, smart budget calculations, real-time currency conversions, and safety advisories.";

    if (pathname === '/') {
      title = "Trip Ready — Ultimate AI Travel Planner & Custom Itinerary Organizer";
      desc = "Plan custom dream trips in seconds with Trip Ready, the ultimate AI travel planner and personal travel companion. Get live weather, budget tips, and local safety rules.";
    } else if (pathname === '/ai-trip-planner') {
      title = "AI Trip Planner — Generate Personalized Travel Itineraries | Trip Ready";
      desc = "Create customized day-by-day itineraries, flight & hotel guides, budget allocations, safety memos, and printable travel magazines instantly with our AI travel engine.";
    } else if (pathname === '/destinations') {
      title = "Explore Worldwide Travel Destinations — Travel Directory | Trip Ready";
      desc = "Browse through 50+ beautiful cities, mountainous regions, pristine islands, and historic landscapes with real-world budget indexes, custom tips, and visa outlines.";
    } else if (pathname === '/budget-planner') {
      title = "AI Travel Budget Planner & Calculator — Expense Estimator | Trip Ready";
      desc = "Track and calculate flights, hotels, food, transport, and sightseeing expenses instantly in USD and local dynamic regional currencies.";
    } else if (pathname === '/trip-ai') {
      title = "TripAI Chatbot — Ask Your Personal AI Travel Assistant | Trip Ready";
      desc = "Ask TripAI about local travel guides, packing checklists, hidden gem spots, visa entries, and custom packing registries.";
    } else if (pathname === '/country-explorer') {
      title = "Country & Continent Explorer — Destination Guides | Trip Ready";
      desc = "Explore country facts, interactive region maps, economic details, cultural guidelines, and deep-dive city directories on Trip Ready.";
    } else if (pathname === '/about') {
      title = "About Trip Ready — Our Mission & Core Team | Trip Ready";
      desc = "Learn about the vision and core engineering team behind Trip Ready, building the world's most helpful and beautiful travel companion.";
    } else if (pathname === '/contact') {
      title = "Contact Support & Inquiries — Customer Desk | Trip Ready";
      desc = "Reach out to the Trip Ready customer support desk. Ask questions, report issues, or provide travel feedback.";
    } else if (pathname === '/pilgrimage') {
      title = "Religion & Pilgrimage Hub — Sacred Travel Guides & Calculators | Trip Ready";
      desc = "Explore faith-based travel guides, sacred landmarks, and pilgrimage requirements. Plan journeys for Umrah, Vatican pilgrimage, Bodh Gaya, Varanasi, and more.";
    } else if (pathname === '/pilgrimage/umrah') {
      title = "Complete Umrah Guide — Step-by-Step Rituals & Budget Calculator | Trip Ready";
      desc = "Everything you need to perform Umrah confidently. Learn step-by-step rituals, packing lists, Nusuk app guide, and calculate expenses instantly.";
    } else if (pathname.startsWith('/destination/')) {
      const destId = pathname.split('/').pop();
      const matched = topDestinations.find(d => d.id === destId);
      if (matched) {
        title = `Explore ${matched.name}, ${matched.country} — AI Local Travel Guide & Safety Info | Trip Ready`;
        desc = `Discover real-world budgets, top sights, emergency hotline directories, local transit apps, and custom cultural protocols for ${matched.name}, ${matched.country} on Trip Ready.`;
      } else {
        title = "Destination Travel Directory & Details — Custom Guides | Trip Ready";
        desc = "Comprehensive local guide containing emergency hotlines, culture protocols, vital transit apps, and weather forecast overlays.";
      }
    } else if (pathname === '/blog') {
      title = "Travel Chronicles — Factual Guides, Budgets & Insights | Trip Ready";
      desc = "Browse professional travel logs, budget breakdowns, visa exemptions, and AI trip planning advice. Standardized data directories for smart travel.";
    } else if (pathname.startsWith('/blog/')) {
      const postId = pathname.split('/').pop();
      const matched = blogPosts.find(b => b.id === postId);
      if (matched) {
        title = `${matched.title} — Travel Chronicles | Trip Ready`;
        desc = matched.subtitle || matched.description;
      } else {
        title = "Travel Chronicles & Logs — Custom Guides | Trip Ready";
        desc = "Browse factual travel logs and budget breakdowns.";
      }
    }

    // Only set standard pages. Entity pages manage their own SEO.
    if (!pathname.startsWith('/country/') && !pathname.startsWith('/state/') && !pathname.startsWith('/city/') && !pathname.startsWith('/attraction/')) {
      document.title = title;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', desc);
      }
    }
  }, [pathname]);

  return null;
}

// ── App Shell ───────────────────────────────────────────────────────
export default function App() {
  const { isDark, toggleTheme } = useTheme();
  const { pathname } = useLocation();

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-500">
        <ScrollToTop />
        <SEOManager />

        {/* Navbar — visible everywhere except on TripAI chatbot page */}
        {pathname !== '/trip-ai' && <Navbar isDark={isDark} toggleTheme={toggleTheme} />}

        {/* Main content with Auto-Recovery ErrorBoundary */}
        <main className="flex-1">
          <ErrorBoundary key={pathname}>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/destinations" element={<DestinationsExplorerPage />} />
                <Route path="/destination/:id" element={<DestinationPage />} />
                <Route path="/budget-planner" element={<BudgetPlannerPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/disclaimer" element={<DisclaimerPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/trip-ai" element={<TripAIPage />} />
                <Route path="/ai-trip-planner" element={<FullTripPlannerPage />} />
                <Route path="/blog" element={<BlogExplorerPage />} />
                <Route path="/blog/:id" element={<BlogPostPage />} />
                <Route path="/country-explorer" element={<CountryExplorerPage />} />
                <Route path="/country/:slug" element={<CountryPage />} />
                <Route path="/state/:slug" element={<StatePage />} />
                <Route path="/city/:slug" element={<CityPage />} />
                <Route path="/attraction/:slug" element={<AttractionPage />} />
                <Route path="/pilgrimage" element={<PilgrimageHubPage />} />
                <Route path="/pilgrimage/umrah" element={<UmrahGuidePage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/dashboard" element={<ProfileDashboardPage />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>

        {/* Footer — visible everywhere except on TripAI chatbot page */}
        {pathname !== '/trip-ai' && <Footer isDark={isDark} />}

        {/* Floating pulsing bot icon bottom-right */}
        {pathname !== '/trip-ai' && (
          <Link 
            to="/trip-ai"
            className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-gradient-to-tr from-[var(--accent)] to-indigo-600 text-white shadow-xl hover:shadow-[0_0_20px_rgba(46,91,255,0.4)] hover:scale-105 active:scale-95 transition-all duration-300 group select-none cursor-pointer"
            aria-label="Ask TripAI Chatbot"
          >
            {/* Glowing pulse rings */}
            <span className="absolute -inset-1.5 rounded-full border border-[var(--accent)]/35 animate-ping opacity-60 pointer-events-none" />
            <Bot size={22} className="relative z-10 group-hover:rotate-12 transition-transform duration-300" />
          </Link>
        )}
      </div>
    </AuthProvider>
  );
}
