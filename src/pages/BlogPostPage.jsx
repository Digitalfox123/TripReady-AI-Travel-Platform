import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowLeft, 
  Heart, 
  Share2, 
  Bookmark, 
  Copy, 
  Check,
  ChevronRight, 
  Sparkles,
  MapPin,
  TrendingUp,
  Brain,
  Compass,
  Camera
} from 'lucide-react';
import { blogPosts } from '../data/blogData';
import { updateEntitySEO, clearEntitySEO } from '../utils/seoHelper';

// ── Inline Markdown Utility Parser ──────────────────────────────────
const parseInline = (text) => {
  if (!text) return '';
  let parsed = text;
  
  // Escape html tag boundaries to prevent layout brokenness
  parsed = parsed
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
    
  // Inline code chunks
  parsed = parsed.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-[11.5px] font-mono text-indigo-500 dark:text-indigo-300 font-semibold">$1</code>');
  
  // Bold elements
  parsed = parsed.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-slate-900 dark:text-white">$1</strong>');
  
  // Italic elements
  parsed = parsed.replace(/\*([^*]+)\*/g, '<em class="italic text-slate-800 dark:text-slate-200">$1</em>');
  
  // Dynamic Links (relative/absolute)
  parsed = parsed.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, label, url) => {
    if (url.startsWith('http') || url.startsWith('mailto')) {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-[var(--accent)] hover:underline inline-flex items-center gap-0.5">${label}<span class="inline-block text-[10px] transform transition-transform duration-300 group-hover:translate-x-0.5">↗</span></a>`;
    } else {
      return `<a href="${url}" class="text-[var(--accent)] hover:underline">${label}</a>`;
    }
  });
  
  return parsed;
};

// ── Block-level Markdown Parser ─────────────────────────────────────
const renderBlock = (block) => {
  const lines = block.split('\n');
  if (lines.some(line => line.trim().startsWith('*') || line.trim().startsWith('-') || /^\d+\./.test(line.trim()))) {
    // List block identified
    const renderedLines = lines.map(line => {
      const trimmed = line.trim();
      const isBullet = trimmed.startsWith('*') || trimmed.startsWith('-');
      const isNumbered = /^\d+\./.test(trimmed);
      
      if (isBullet || isNumbered) {
        const content = isBullet ? trimmed.substring(1).trim() : trimmed.replace(/^\d+\./, '').trim();
        const parsedText = parseInline(content);
        const indent = line.search(/\S/);
        
        // Dynamic nested formatting
        const paddingLeft = indent > 2 ? 'pl-6 list-[circle]' : '';
        return `<li class="my-1.5 text-left text-xs sm:text-sm text-slate-650 dark:text-slate-350 leading-relaxed ${paddingLeft}">${parsedText}</li>`;
      } else {
        return `<p class="text-xs sm:text-sm text-slate-650 dark:text-slate-350 leading-relaxed mb-1">${parseInline(line)}</p>`;
      }
    });
    return `<ul class="list-disc pl-5 my-4 space-y-1 text-left">${renderedLines.join('')}</ul>`;
  } else {
    // Regular paragraph
    const parsed = parseInline(block);
    return `<p class="text-xs sm:text-sm text-slate-650 dark:text-slate-350 leading-relaxed my-4 text-left font-light">${parsed}</p>`;
  }
};

export default function BlogPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeHeading, setActiveHeading] = useState('');

  useEffect(() => {
    const matchedPost = blogPosts.find(p => p.id === id);
    if (matchedPost) {
      setPost(matchedPost);
      // Retrieve related posts (exclude current)
      const others = blogPosts.filter(p => p.id !== id).slice(0, 2);
      setRelated(others);
      
      // Update metadata & schema graph dynamically
      updateEntitySEO('blog', matchedPost);
      
      // Reset scroll to top
      window.scrollTo(0, 0);
    } else {
      setPost(null);
    }
    return () => {
      clearEntitySEO();
    };
  }, [id]);

  // Set up an intersection observer for TOC heading highlighting
  useEffect(() => {
    if (!post) return;
    
    const headingElements = document.querySelectorAll('.blog-content h2');
    const observerOptions = {
      root: null,
      rootMargin: '-10% 0px -75% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveHeading(entry.target.id);
        }
      });
    }, observerOptions);

    headingElements.forEach(el => observer.observe(el));
    
    return () => {
      headingElements.forEach(el => observer.unobserve(el));
    };
  }, [post]);

  if (!post) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center pt-28 pb-20 px-4">
        <div className="max-w-md text-center space-y-5 rounded-[36px] border border-slate-200/50 dark:border-white/[0.05] bg-white/40 dark:bg-[#101A2E]/20 p-8 backdrop-blur-xl animate-fade-in shadow-premium">
          <span className="text-5xl block animate-bounce">🌍</span>
          <h2 className="font-heading text-2xl font-extrabold text-slate-900 dark:text-white">Chronicle Not Located</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed">
            The travel post you are searching for might have been archived or repositioned to a new section.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:scale-102 hover:shadow-lg cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Chronicles
          </Link>
        </div>
      </div>
    );
  }

  // Intercept click on compiled HTML links for React Router client navigation
  const handleContentClick = (e) => {
    const target = e.target.closest('a');
    if (target) {
      const href = target.getAttribute('href');
      if (href && href.startsWith('/')) {
        e.preventDefault();
        navigate(href);
      }
    }
  };

  // Dynamic share link copy
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Assemble headings for Table of Contents
  const headings = post.sections
    .filter(sec => sec.type === 'heading')
    .map(sec => {
      const idStr = sec.text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return { text: sec.text, id: idStr };
    });

  const handleTOCScroll = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const yOffset = -110; 
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-500 pt-24 sm:pt-28 pb-20 overflow-hidden">
      
      {/* Cinematic Glowing Backgrounds */}
      <div className="absolute top-10 left-[15%] w-[450px] h-[450px] rounded-full bg-[var(--accent)]/[0.015] dark:bg-[var(--accent)]/[0.008] filter blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-1/2 right-[10%] w-[400px] h-[400px] rounded-full bg-indigo-500/[0.015] dark:bg-indigo-500/[0.008] filter blur-[110px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Breadcrumb row */}
        <div className="flex items-center justify-between py-4 mb-8 border-b border-slate-200/50 dark:border-white/[0.04] animate-fade-in">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-[10px] font-sans font-bold uppercase tracking-widest text-slate-450 dark:text-slate-450 hover:text-[var(--accent)] transition-colors duration-300"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Chronicles
          </Link>
          <div className="flex items-center gap-2 text-[9px] font-sans font-bold text-slate-450 dark:text-slate-400 uppercase tracking-widest select-none">
            <Link to="/" className="hover:text-[var(--accent)] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <Link to="/blog" className="hover:text-[var(--accent)] transition-colors">Chronicles</Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-400 truncate max-w-[120px] sm:max-w-xs">{post.category}</span>
          </div>
        </div>

        {/* Cinematic Article Title Panel */}
        <div className="text-left space-y-6 max-w-4xl mb-12 animate-slide-up">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--accent)] text-[9px] font-bold uppercase tracking-[0.18em] select-none">
            <Sparkles className="w-3 h-3 text-[var(--accent)]" /> {post.category} Focus
          </span>
          
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            {post.title}
          </h1>
          
          <p className="text-sm sm:text-base lg:text-lg text-slate-650 dark:text-slate-350 font-light leading-relaxed font-body">
            {post.subtitle}
          </p>

          {/* Symmetrical metadata bar */}
          <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-slate-200/50 dark:border-white/[0.04]">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-200/60 dark:bg-white/[0.04] flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-4xs">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-none">{post.author}</p>
                </div>
              </div>

              <div className="h-4 w-px bg-slate-200 dark:bg-white/[0.08]" />

              <div className="flex items-center gap-4 text-[9.5px] font-sans font-bold text-slate-450 dark:text-slate-400 uppercase tracking-widest leading-none">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {post.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {post.readTime}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* Fact Check trust stamp */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/15 dark:border-emerald-500/10 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Fact-Checked & Verified</span>
              </div>
            </div>

            {/* Social sharing icons */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setLiked(!liked)}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  liked 
                    ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' 
                    : 'bg-slate-100 dark:bg-white/[0.02] text-slate-400 hover:text-red-500 hover:bg-slate-200/50 dark:hover:bg-white/[0.06] border border-slate-200/50 dark:border-white/[0.04]'
                }`}
                aria-label="Like this chronicle"
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
              </button>

              <button 
                onClick={() => setBookmarked(!bookmarked)}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  bookmarked 
                    ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20' 
                    : 'bg-slate-100 dark:bg-white/[0.02] text-slate-400 hover:text-amber-500 hover:bg-slate-200/50 dark:hover:bg-white/[0.06] border border-slate-200/50 dark:border-white/[0.04]'
                }`}
                aria-label="Bookmark this chronicle"
              >
                <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
              </button>

              <button 
                onClick={handleShare}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all bg-slate-100 dark:bg-white/[0.02] text-slate-400 hover:text-[var(--accent)] hover:bg-slate-200/50 dark:hover:bg-white/[0.06] border border-slate-200/50 dark:border-white/[0.04] relative cursor-pointer"
                aria-label="Copy share link"
              >
                {copied ? <Check className="w-4 h-4 text-green-500 animate-fade-in" /> : <Share2 className="w-4 h-4" />}
                {copied && (
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-slate-900 text-white text-[8px] font-sans font-bold uppercase tracking-wider shadow-md animate-fade-in whitespace-nowrap">
                    Link Copied!
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Full-width premium post header image */}
        <div className="aspect-[21/9] w-full rounded-[40px] overflow-hidden border border-slate-200/60 dark:border-white/[0.05] bg-slate-100 dark:bg-[#0c1424]/30 relative mb-12 shadow-premium animate-fade-in">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover select-none pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative items-start">
          
          {/* LEFT: Symmetrical Table of Contents (Sticky on desktop) */}
          <aside className="lg:col-span-3 lg:sticky lg:top-28 space-y-8 order-2 lg:order-1 text-left hidden lg:block animate-fade-in">
            {headings.length > 0 && (
              <div className="rounded-[28px] border border-slate-200/60 dark:border-white/[0.04] bg-gradient-to-b from-slate-50/50 to-slate-100/30 dark:from-[#0c1424]/30 dark:to-[#080d1a]/20 p-6 backdrop-blur-xl">
                <h3 className="font-heading font-black text-[9px] text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-4 select-none flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-[var(--accent)] animate-spin-slow" /> Directory Guide
                </h3>
                <nav className="space-y-3 font-sans">
                  {headings.map((h, idx) => (
                    <a
                      key={idx}
                      href={`#${h.id}`}
                      onClick={(e) => handleTOCScroll(e, h.id)}
                      className={`block text-[11px] font-bold leading-normal transition-all duration-300 py-0.5 border-l-2 pl-3 truncate ${
                        activeHeading === h.id
                          ? 'border-[var(--accent)] text-[var(--accent)] font-black pl-4'
                          : 'border-transparent text-slate-450 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-white/20'
                      }`}
                    >
                      {h.text}
                    </a>
                  ))}
                </nav>
              </div>
            )}

            {/* Travel OS Tools Promo Container */}
            <div className="rounded-[28px] border border-[var(--border)] bg-gradient-to-br from-indigo-600/[0.02] to-[var(--accent)]/[0.05] p-6 text-left space-y-4">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-[var(--accent)]/10 text-[var(--accent)] text-[8px] font-bold uppercase tracking-wider">
                <Brain className="w-3 h-3" /> Trip Ready AI
              </span>
              <h4 className="font-heading font-extrabold text-[13px] text-slate-900 dark:text-white leading-tight">
                Synthesize customized itineraries instantly
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-light leading-relaxed font-body">
                Let our machine-learning model calculate budget distributions and optimize coordinates for you.
              </p>
              <Link
                to="/ai-trip-planner"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black text-[10px] font-bold uppercase tracking-wider hover:opacity-90 transition-all select-none"
              >
                Launch AI Planner <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </aside>

          {/* MIDDLE: Comprehensive Markdown-Compiled Post Content */}
          <article 
            onClick={handleContentClick}
            className="lg:col-span-6 space-y-6 order-1 lg:order-2 blog-content max-w-none text-left"
          >
            {post.sections.map((section, secIdx) => {
              switch (section.type) {
                case 'intro':
                  return (
                    <div 
                      key={secIdx}
                      className="text-xs sm:text-[13px] text-slate-650 dark:text-slate-350 leading-relaxed font-light pl-4 border-l-2 border-[var(--accent)]/60 py-1 mb-8 italic"
                      dangerouslySetInnerHTML={{ __html: parseInline(section.content) }}
                    />
                  );

                case 'heading':
                  const idStr = section.text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                  return (
                    <h2 
                      key={secIdx}
                      id={idStr}
                      className="font-heading font-black text-lg sm:text-xl lg:text-2xl text-slate-900 dark:text-white pt-8 pb-3 mt-8 mb-4 border-b border-slate-200/50 dark:border-white/[0.04] flex items-center gap-2"
                    >
                      <span className="w-1.5 h-5 rounded-full bg-gradient-to-b from-[var(--accent)] to-indigo-600 inline-block" />
                      {section.text}
                    </h2>
                  );

                case 'subheading':
                  return (
                    <h3 
                      key={secIdx}
                      className="font-heading font-extrabold text-sm sm:text-base text-slate-800 dark:text-slate-100 mt-6 mb-3 flex items-center gap-1.5"
                    >
                      {section.text}
                    </h3>
                  );

                case 'text':
                  // Split content by double newlines to handle multiple paragraph blocks
                  const paragraphs = section.content.split('\n\n');
                  return (
                    <div key={secIdx} className="space-y-4">
                      {paragraphs.map((para, paraIdx) => (
                        <div 
                          key={paraIdx}
                          dangerouslySetInnerHTML={{ __html: renderBlock(para) }}
                        />
                      ))}
                    </div>
                  );

                case 'table':
                  return (
                    <div 
                      key={secIdx}
                      className="my-8 overflow-hidden rounded-[24px] border border-slate-200/60 dark:border-white/[0.05] bg-slate-50/50 dark:bg-[#0c1424]/10 shadow-3xs backdrop-blur-xl"
                    >
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200/60 dark:divide-white/[0.05]">
                          <thead className="bg-slate-100/60 dark:bg-white/[0.01]">
                            <tr>
                              {section.headers.map((h, hIdx) => (
                                <th 
                                  key={hIdx} 
                                  scope="col" 
                                  className="px-5 py-3.5 text-left text-[9px] font-sans font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-none"
                                >
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200/60 dark:divide-white/[0.04] bg-transparent">
                            {section.rows.map((row, rIdx) => (
                              <tr 
                                key={rIdx} 
                                className="hover:bg-slate-200/30 dark:hover:bg-white/[0.01] transition-all"
                              >
                                {row.map((cell, cIdx) => (
                                  <td 
                                    key={cIdx} 
                                    className="px-5 py-3.5 whitespace-nowrap text-left"
                                  >
                                    <span 
                                      className="text-xs sm:text-[13px] text-slate-650 dark:text-slate-300 font-light"
                                      dangerouslySetInnerHTML={{ __html: parseInline(cell) }} 
                                    />
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );

                case 'proscons':
                  return (
                    <div key={secIdx} className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-8">
                      {/* Pros column */}
                      <div className="rounded-[24px] border border-emerald-500/10 bg-emerald-500/[0.02] dark:bg-emerald-500/[0.01] p-5 text-left flex flex-col justify-between">
                        <div>
                          <h4 className="font-heading font-extrabold text-[11px] sm:text-xs text-emerald-600 dark:text-emerald-450 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 text-[10px] font-black">✓</span>
                            Key Advantages
                          </h4>
                          <ul className="space-y-2.5">
                            {section.pros.map((pro, pIdx) => (
                              <li 
                                key={pIdx} 
                                className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed font-light flex items-start gap-2"
                              >
                                <span className="text-emerald-500 mt-1 select-none font-bold text-xs">•</span>
                                <span>{pro}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Cons column */}
                      <div className="rounded-[24px] border border-rose-500/10 bg-rose-500/[0.02] dark:bg-rose-500/[0.01] p-5 text-left flex flex-col justify-between">
                        <div>
                          <h4 className="font-heading font-extrabold text-[11px] sm:text-xs text-rose-600 dark:text-rose-450 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 text-[10px] font-black">✕</span>
                            Considerations
                          </h4>
                          <ul className="space-y-2.5">
                            {section.cons.map((con, cIdx) => (
                              <li 
                                key={cIdx} 
                                className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed font-light flex items-start gap-2"
                              >
                                <span className="text-rose-500 mt-1 select-none font-bold text-xs">•</span>
                                <span>{con}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );

                case 'conclusion':
                  return (
                    <div key={secIdx} className="my-10 rounded-[28px] border border-[var(--border)] bg-gradient-to-br from-indigo-50/50 to-[var(--accent)]/[0.03] dark:from-[#0c1424]/30 dark:to-indigo-500/[0.01] p-6 sm:p-8 text-left space-y-3 relative overflow-hidden shadow-sm">
                      <span className="absolute top-0 right-0 text-7xl opacity-5 pointer-events-none select-none">✍️</span>
                      <h3 className="font-heading font-black text-[9px] text-[var(--accent)] uppercase tracking-[0.2em] mb-1 flex items-center gap-1.5 select-none">
                        <Sparkles className="w-3.5 h-3.5" /> Final Thoughts & Verdict
                      </h3>
                      <h4 className="font-heading font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-tight">
                        {section.title || "The Final Verdict"}
                      </h4>
                      <div 
                        className="text-xs sm:text-[13px] text-slate-650 dark:text-slate-350 leading-relaxed font-light font-body"
                        dangerouslySetInnerHTML={{ __html: parseInline(section.content) }}
                      />
                    </div>
                  );

                case 'faq':
                case 'faqs':
                  return (
                    <div key={secIdx} className="my-10 space-y-6 text-left">
                      <h2 className="font-heading font-black text-base sm:text-lg lg:text-xl text-slate-900 dark:text-white pb-3 border-b border-slate-200/50 dark:border-white/[0.04] flex items-center gap-2">
                        <span className="w-1.5 h-5 rounded-full bg-gradient-to-b from-[var(--accent)] to-indigo-600 inline-block" />
                        Frequently Asked Questions (FAQs)
                      </h2>
                      <div className="space-y-4">
                        {section.items.map((item, idx) => (
                          <div 
                            key={idx}
                            className="rounded-2xl border border-slate-200/60 dark:border-white/[0.04] bg-slate-50/50 dark:bg-[#0c1424]/10 p-5 space-y-2.5 hover:border-slate-350 dark:hover:border-white/10 transition-all duration-300 shadow-4xs"
                          >
                            <h4 className="font-heading font-bold text-xs sm:text-[13px] text-slate-900 dark:text-white flex items-start gap-2">
                              <span className="text-[var(--accent)] font-black text-sm">Q.</span>
                              <span className="leading-tight">{item.question}</span>
                            </h4>
                            <div 
                              className="text-xs sm:text-[12.5px] text-slate-650 dark:text-slate-350 font-light leading-relaxed pl-5 border-l border-slate-200 dark:border-white/[0.08]"
                              dangerouslySetInnerHTML={{ __html: parseInline(item.answer) }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  );

                default:
                  return null;
              }
            })}

            {/* Symmetrical Post Tags Row */}
            <div className="pt-8 border-t border-slate-200/50 dark:border-white/[0.04] mt-12 flex flex-wrap gap-2 justify-start items-center">
              <span className="text-[10px] font-sans font-bold text-slate-400 dark:text-slate-450 uppercase tracking-widest mr-2 select-none">Tags:</span>
              {post.tags.map((tag, idx) => (
                <span 
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/[0.04] text-[10px] text-slate-600 dark:text-slate-400 font-light select-none hover:text-[var(--accent)] hover:border-[var(--accent)]/30 transition-all duration-300"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Suggested Images section for developers/designers */}
            {post.suggestedImages && post.suggestedImages.length > 0 && (
              <div className="mt-12 p-6 rounded-[28px] border border-dashed border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-[#0c1424]/10 text-left space-y-4 animate-fade-in select-none">
                <h3 className="font-heading font-black text-[9px] text-[var(--accent)] uppercase tracking-[0.2em] flex items-center gap-1.5 select-none">
                  <Camera className="w-3.5 h-3.5 text-[var(--accent)]" /> Photographic Art Suggestions
                </h3>
                <div className="space-y-4">
                  {post.suggestedImages.map((img, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 leading-none">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] inline-block" />
                        {img.type} Prompt:
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-light font-mono leading-relaxed pl-3 border-l border-slate-200 dark:border-white/[0.08]">
                        "{img.prompt}"
                      </p>
                      {img.caption && (
                        <p className="text-[9.5px] text-slate-450 dark:text-slate-500 italic pl-3">
                          Caption: {img.caption}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* RIGHT: Related Articles & Side CTA Block */}
          <aside className="lg:col-span-3 space-y-8 order-3 text-left animate-fade-in">
            
            {/* Related Articles Card */}
            {related.length > 0 && (
              <div className="rounded-[28px] border border-slate-200/60 dark:border-white/[0.04] bg-gradient-to-b from-slate-50/50 to-slate-100/30 dark:from-[#0c1424]/30 dark:to-[#080d1a]/20 p-6 backdrop-blur-xl">
                <h3 className="font-heading font-black text-[9px] text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-4 select-none">
                  Related Chronicles
                </h3>
                <div className="space-y-4">
                  {related.map((post) => (
                    <Link
                      key={post.id}
                      to={`/blog/${post.id}`}
                      className="group block space-y-2 transition-all p-2 rounded-2xl hover:bg-slate-200/30 dark:hover:bg-white/[0.01]"
                    >
                      <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-slate-200/50 dark:border-white/[0.04]">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-102"
                        />
                      </div>
                      <h4 className="font-heading font-extrabold text-xs text-slate-800 dark:text-slate-200 group-hover:text-[var(--accent)] transition-all line-clamp-2 leading-snug">
                        {post.title}
                      </h4>
                      <div className="flex items-center gap-3 text-[8.5px] font-sans font-bold text-slate-450 dark:text-slate-400 uppercase tracking-widest leading-none">
                        <span>{post.date}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Budgeting Engine Side Widget */}
            <div className="rounded-[28px] border border-slate-200/60 dark:border-white/[0.04] bg-gradient-to-b from-slate-50/50 to-slate-100/30 dark:from-[#0c1424]/30 dark:to-[#080d1a]/20 p-6 backdrop-blur-xl text-left space-y-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-550 dark:text-emerald-400 text-[8px] font-bold uppercase tracking-wider select-none">
                <TrendingUp className="w-3 h-3" /> Live Cost Auditing
              </span>
              <h4 className="font-heading font-extrabold text-[13px] text-slate-900 dark:text-white leading-tight">
                Live Dynamic Budgets & Exchanges
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-light leading-relaxed font-body">
                Estimate double-occupancy hotel rooms, local transits, and meal caps automatically.
              </p>
              <Link
                to="/budget-planner"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black text-[10px] font-bold uppercase tracking-wider hover:opacity-90 transition-all select-none shadow-3xs"
              >
                Estimate Costs <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Return to Explorer Page */}
            <div className="text-center">
              <Link
                to="/blog"
                className="inline-flex items-center justify-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-[var(--accent)] hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Chronicles Directory
              </Link>
            </div>

          </aside>

        </div>

      </div>
    </div>
  );
}
