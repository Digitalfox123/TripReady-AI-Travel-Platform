import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Sparkles, Calendar, Clock, ArrowRight, User, Heart } from 'lucide-react';
import { blogPosts } from '../data/blogData';

export default function BlogExplorerPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [likes, setLikes] = useState({});

  useEffect(() => {
    // Page dynamic title sync
    document.title = "Travel Chronicles — Factual Guides & Insights | Trip Ready";
  }, []);

  const handleLike = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setLikes(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const categories = ['All', 'Budgeting', 'Intelligence', 'Locales'];
  const categoryDisplay = {
    'All': 'All',
    'Budgeting': 'Budgeting',
    'Intelligence': 'Tips',
    'Locales': 'Destinations'
  };

  // Filter & Search Logic
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      post.keywords.some(kw => kw.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Featured Post is the first one
  const featuredPost = blogPosts[0];
  const gridPosts = filteredPosts.filter(post => searchQuery || activeCategory !== 'All' ? true : post.id !== featuredPost.id);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-500 pt-28 pb-20 overflow-hidden">
      
      {/* Symmetrical glowing background blobs */}
      <div className="absolute top-20 left-[10%] w-[400px] h-[400px] rounded-full bg-[var(--accent)]/[0.02] dark:bg-[var(--accent)]/[0.01] filter blur-[110px] pointer-events-none z-0" />
      <div className="absolute bottom-40 right-[10%] w-[450px] h-[450px] rounded-full bg-indigo-500/[0.02] dark:bg-indigo-500/[0.01] filter blur-[120px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Cinematic Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16 animate-slide-up">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--accent)] text-[9px] font-bold uppercase tracking-[0.18em] select-none">
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" /> Travel Guides & Stories
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight leading-none">
            Travel logs,<br />
            <span className="italic font-light text-luxury-secondary dark:text-slate-400">fully documented.</span>
          </h1>
          <p className="text-sm text-slate-550 dark:text-slate-400 font-light leading-relaxed font-body">
            Factual guidelines, budget breakdowns, visa exemptions, and AI insights organized into structured reads.
          </p>
        </div>

        {/* Filter and Search Bar Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 bg-white/60 dark:bg-[#101A2E]/50 border border-slate-200/50 dark:border-white/[0.06] rounded-[28px] p-4 backdrop-blur-md animate-fade-in">
          
          {/* Search Box */}
          <div className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-50 dark:bg-white/[0.03] border border-slate-200/50 dark:border-white/[0.05] rounded-2xl w-full md:max-w-md">
            <Search className="w-4 h-4 text-slate-450 dark:text-slate-450" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keywords, tags, or topics..."
              className="w-full bg-transparent text-xs text-luxury-primary dark:text-white placeholder-slate-400 outline-none"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center bg-slate-50 dark:bg-white/[0.01] border border-slate-200/50 dark:border-white/[0.04] p-1 rounded-full shadow-3xs max-w-max self-start md:self-auto">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-4 py-1.5 rounded-full text-[9.5px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  activeCategory === c
                    ? 'bg-luxury-primary dark:bg-white text-white dark:text-black shadow-xs font-black'
                    : 'text-slate-400 dark:text-slate-400 hover:text-luxury-primary dark:hover:text-white'
                }`}
              >
                {categoryDisplay[c]}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Display Layout */}
        {filteredPosts.length > 0 ? (
          <div className="space-y-12">
            
            {/* A. Featured Post (Show only when no active filters) */}
            {!searchQuery && activeCategory === 'All' && (
              <div className="animate-fade-in">
                <Link
                  to={`/blog/${featuredPost.id}`}
                  className="group grid grid-cols-1 lg:grid-cols-12 gap-8 rounded-[36px] border border-slate-200/60 dark:border-white/[0.05] bg-gradient-to-b from-slate-50/50 to-slate-100/30 dark:from-[#0c1424]/30 dark:to-[#080d1a]/20 backdrop-blur-xl p-6 md:p-8 hover:border-slate-350 dark:hover:border-white/10 hover:shadow-premium select-none transition-all duration-500"
                >
                  {/* Image Column */}
                  <div className="lg:col-span-7 aspect-[16/9] lg:aspect-auto rounded-3xl overflow-hidden border border-slate-200/50 dark:border-white/[0.04] relative">
                    <img
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-102"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                    <span className="absolute top-4 left-4 px-3 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10 text-white text-[9px] font-sans font-bold uppercase tracking-wider">
                      Featured {categoryDisplay[featuredPost.category] || featuredPost.category}
                    </span>
                  </div>

                  {/* Text Details Column */}
                  <div className="lg:col-span-5 flex flex-col justify-between text-left">
                    <div className="space-y-4">
                      {/* Meta info */}
                      <div className="flex items-center gap-3 text-[9px] font-sans font-bold text-slate-450 dark:text-slate-400 uppercase tracking-widest leading-none">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {featuredPost.date}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {featuredPost.readTime}
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="font-heading font-extrabold text-xl sm:text-2xl lg:text-3xl text-slate-900 dark:text-white group-hover:text-[var(--accent)] transition-colors duration-300 leading-snug">
                        {featuredPost.title}
                      </h2>

                      {/* Subtitle */}
                      <p className="text-xs sm:text-sm text-slate-650 dark:text-slate-350 font-light leading-relaxed">
                        {featuredPost.subtitle}
                      </p>

                      {/* Post description preview */}
                      <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 font-light leading-relaxed font-body">
                        {featuredPost.description}
                      </p>
                    </div>

                    {/* Author & Footer redirect row */}
                    <div className="mt-8 pt-6 border-t border-slate-200/50 dark:border-white/[0.04] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-250/50 dark:bg-white/[0.04] flex items-center justify-center text-slate-500 dark:text-slate-300">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white leading-none">{featuredPost.author.split(',')[0]}</p>
                          <span className="text-[9px] text-slate-450 dark:text-slate-400 font-light uppercase tracking-wider">{featuredPost.author.split(',')[1] || 'Editor'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Like button */}
                        <button 
                          onClick={(e) => handleLike(featuredPost.id, e)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            likes[featuredPost.id] 
                              ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' 
                              : 'bg-slate-200/40 dark:bg-white/[0.02] text-slate-400 hover:text-red-500 dark:hover:text-red-400'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${likes[featuredPost.id] ? 'fill-current' : ''}`} />
                        </button>

                        <div className="px-5 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black text-[10px] font-bold uppercase tracking-widest inline-flex items-center gap-1.5 transition-all duration-300 group-hover:scale-102">
                          <span>Read Article</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* B. Secondary Grid Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {gridPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.id}`}
                  className="group flex flex-col justify-between rounded-[28px] border border-slate-200/60 dark:border-white/[0.05] bg-gradient-to-b from-slate-50/50 to-slate-100/30 dark:from-[#0c1424]/30 dark:to-[#080d1a]/20 backdrop-blur-xl p-5 hover:-translate-y-2 transition-all duration-500 hover:border-slate-350 dark:hover:border-white/10 hover:shadow-premium select-none h-full"
                >
                  <div className="space-y-4">
                    {/* Visual Thumbnail */}
                    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-slate-200/50 dark:border-white/[0.04]">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 text-white text-[8px] font-sans font-bold uppercase tracking-wider">
                        {categoryDisplay[post.category] || post.category}
                      </span>
                    </div>

                    {/* Metadata Row */}
                    <div className="flex items-center gap-3 text-[9px] font-sans font-bold text-slate-450 dark:text-slate-400 uppercase tracking-widest leading-none">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {post.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {post.readTime}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-heading font-extrabold text-[15px] text-slate-900 dark:text-white group-hover:text-[var(--accent)] transition-colors duration-300 leading-snug text-left line-clamp-2">
                      {post.title}
                    </h3>

                    {/* Subtitle */}
                    <p className="text-[11px] text-slate-600 dark:text-slate-350 font-light leading-relaxed font-body text-left line-clamp-3">
                      {post.subtitle}
                    </p>
                  </div>

                  {/* Author & Footer Redirect */}
                  <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-white/[0.04] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200/50 dark:bg-white/[0.04] flex items-center justify-center text-slate-500 dark:text-slate-300">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[9.5px] font-medium text-slate-650 dark:text-slate-300">
                        {post.author.split(',')[0]}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {/* Like button */}
                      <button 
                        onClick={(e) => handleLike(post.id, e)}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                          likes[post.id] 
                            ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20 shadow-4xs' 
                            : 'bg-slate-200/40 dark:bg-white/[0.02] text-slate-400 hover:text-red-500 dark:hover:text-red-400'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${likes[post.id] ? 'fill-current' : ''}`} />
                      </button>

                      <div className="w-6 h-6 rounded-lg bg-slate-200/40 dark:bg-white/[0.03] text-slate-650 dark:text-white flex items-center justify-center transition-all duration-300 group-hover:bg-[var(--accent)] group-hover:text-white shadow-3xs">
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

          </div>
        ) : (
          <div className="text-center py-20 bg-white/40 dark:bg-[#101A2E]/20 border border-dashed border-slate-200 dark:border-white/10 rounded-[36px] max-w-md mx-auto animate-fade-in space-y-4">
            <span className="text-4xl">🏝️</span>
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">No travel stories found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">Try refining your search terms or selecting a different travel category filter.</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
              className="px-4 py-1.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black text-[9.5px] font-bold uppercase tracking-wider transition-all duration-300 hover:scale-102 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
