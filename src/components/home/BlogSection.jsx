import { Link } from 'react-router-dom';
import { Sparkles, Calendar, Clock, ArrowRight, User } from 'lucide-react';
import { blogPosts } from '../../data/blogData';

export default function BlogSection() {
  return (
    <section className="section-padding bg-[var(--bg-primary)] border-b border-[var(--border)] relative overflow-hidden transition-colors duration-500">
      
      {/* Symmetrical glowing background blobs */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-[var(--accent)]/[0.01] dark:bg-[var(--accent)]/[0.02] filter blur-[100px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="text-left space-y-2.5 max-w-xl">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--accent)] text-[9px] font-bold uppercase tracking-[0.18em]">
              <Sparkles className="w-3 h-3 text-[var(--accent)]" /> Travel Chronicles
            </span>
            
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-luxury-primary dark:text-white leading-tight">
              Latest Stories & Insights
            </h2>
            <p className="text-sm text-slate-550 dark:text-slate-400 font-light leading-relaxed font-body">
              Factual guides, budget breakdowns, and expert travel insights from our local correspondents.
            </p>
          </div>

          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[var(--accent)] hover:underline self-start md:self-end"
          >
            <span>Explore All Chronicles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.slice(0, 3).map((post) => (
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
                    {post.category}
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

                {/* Description */}
                <p className="text-[11px] text-slate-600 dark:text-slate-350 font-light leading-relaxed font-body text-left line-clamp-3">
                  {post.subtitle}
                </p>
              </div>

              {/* Author & Arrow at the bottom */}
              <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-white/[0.04] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-200/50 dark:bg-white/[0.04] flex items-center justify-center text-slate-500 dark:text-slate-300">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[9.5px] font-medium text-slate-650 dark:text-slate-300">
                    {post.author.split(',')[0]}
                  </span>
                </div>
                <div className="w-6 h-6 rounded-lg bg-slate-200/40 dark:bg-white/[0.03] text-slate-650 dark:text-white flex items-center justify-center transition-all duration-300 group-hover:bg-[var(--accent)] group-hover:text-white shadow-3xs">
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
