import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, 
  Globe, 
  Wallet, 
  Bot, 
  ChevronRight, 
  ArrowUpRight, 
  Sparkles, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Check,
  Briefcase,
  Plane,
  Building2,
  Calendar
} from 'lucide-react';

export default function ToolsSuiteSection() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [isPlaying, setIsPlaying] = useState(false);
  const [budgetPercent, setBudgetPercent] = useState(62);
  const sliderRef = useRef(null);

  // Spotify player timer simulation
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setBudgetPercent((prev) => {
          if (prev >= 100) return 0;
          return prev + 1;
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Smooth Carousel scroll handlers
  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -350, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 350, behavior: 'smooth' });
    }
  };

  const tools = [
    {
      id: 'country-explorer',
      title: 'Country Explorer',
      path: '/country-explorer',
      color: 'blue',
      badge: 'Featured',
      icon: Globe,
      desc: 'Learn about local cultures, region maps, and key city details before you travel.',
      borderColor: 'border-blue-100 hover:border-blue-400 dark:border-white/[0.05] dark:group-hover:border-blue-500/40',
      bgColor: 'bg-gradient-to-b from-blue-50/80 to-blue-100/40 dark:from-[#051126] dark:to-[#030915]',
      glowColor: 'group-hover:shadow-[0_20px_50px_rgba(59,130,246,0.15)]',
      iconBg: 'bg-blue-150/10 dark:bg-blue-500/10 text-blue-650 dark:text-blue-300 border-blue-200/30 dark:border-blue-500/20',
      badgeStyle: 'bg-blue-500/10 text-blue-600 dark:text-blue-300 border-blue-500/20',
      visual: (
        <div className="w-full mt-2 flex flex-col justify-between flex-1 select-none">
          <div className="flex justify-between items-center text-[9px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold mb-2">
            <span>World Map</span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          </div>
          
          {/* Concentric rotating SVG radar/compass visual */}
          <div className="relative flex items-center justify-center h-28 w-full my-auto">
            {/* Rotating dotted compass dial */}
            <div className="absolute w-24 h-24 rounded-full border border-dashed border-blue-500/20 dark:border-blue-500/30 animate-[spin_40s_linear_infinite]" />
            <div className="absolute w-18 h-18 rounded-full border border-dashed border-slate-200 dark:border-white/[0.08]" />
            <div className="absolute w-12 h-12 rounded-full border border-blue-500/10 dark:border-blue-500/20 flex items-center justify-center">
              <Globe className="w-5 h-5 text-blue-600/40 dark:text-blue-350/30 animate-[pulse_3s_infinite]" />
            </div>
            
            {/* Rotating compass needle SVG */}
            <svg className="absolute w-28 h-28 animate-[spin_20s_linear_infinite] pointer-events-none" viewBox="0 0 100 100">
              {/* Compass Needle */}
              <polygon points="50,15 53,50 50,55 47,50" fill="url(#needle-north)" />
              <polygon points="50,85 53,50 50,55 47,50" fill="url(#needle-south)" />
              {/* Radar sweep */}
              <circle 
                cx="50" 
                cy="50" 
                r="36" 
                fill="transparent" 
                stroke="url(#blue-radar-grad)" 
                strokeWidth="1.5"
                strokeDasharray="226"
                strokeDashoffset="120"
              />
              <defs>
                <linearGradient id="needle-north" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
                <linearGradient id="needle-south" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#64748b" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="blue-radar-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                  <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.8" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Pulsing indicator dots */}
            <div className="absolute w-1.5 h-1.5 rounded-full bg-emerald-450 top-[35px] left-[35px] animate-ping" />
            <div className="absolute w-1.5 h-1.5 rounded-full bg-emerald-500 top-[35px] left-[35px]" />
            <div className="absolute w-1.5 h-1.5 rounded-full bg-blue-500 top-[65px] left-[70px]" />
          </div>

          <div className="flex items-center justify-between text-[8px] border-t border-slate-200/50 dark:border-white/[0.05] pt-1.5 font-bold font-mono mt-1">
            <span className="text-slate-500 dark:text-slate-400">Structured Data</span>
            <span className="text-blue-650 dark:text-blue-450 uppercase tracking-widest">4-Level Atlas</span>
          </div>
        </div>
      )
    },
    {
      id: 'planner',
      title: 'AI Travel Planner',
      path: '/ai-trip-planner',
      color: 'indigo',
      badge: 'Guides',
      icon: Compass,
      desc: 'Get full day-by-day travel itineraries and local weather advice.',
      borderColor: 'border-indigo-100 hover:border-indigo-400 dark:border-white/[0.05] dark:group-hover:border-indigo-500/40',
      bgColor: 'bg-gradient-to-b from-indigo-50/80 to-indigo-100/40 dark:from-[#080d1a] dark:to-[#04060d]',
      glowColor: 'group-hover:shadow-[0_20px_50px_rgba(99,102,241,0.15)]',
      iconBg: 'bg-indigo-150/10 dark:bg-indigo-500/10 text-indigo-650 dark:text-indigo-300 border-indigo-200/30 dark:border-indigo-500/20',
      badgeStyle: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border-indigo-500/20',
      visual: (
        <div className="w-full mt-2 flex flex-col justify-between flex-1 select-none">
          <div className="flex justify-between items-center text-[9px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold mb-2">
            <span>Timeline OS 2.0</span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          </div>
          
          {/* HD Linear concentric radar floating directly on card background */}
          <div className="relative flex items-center justify-center h-28 w-full my-auto">
            <div className="absolute w-24 h-24 rounded-full border border-dashed border-indigo-500/10 dark:border-indigo-500/20 animate-[spin_60s_linear_infinite]" />
            <div className="absolute w-18 h-18 rounded-full border border-slate-200 dark:border-white/[0.1] border-dashed" />
            <div className="absolute w-10 h-10 rounded-full border border-indigo-500/20 dark:border-indigo-500/30" />
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <span className="text-[7.5px] font-mono text-indigo-600 dark:text-indigo-300 tracking-widest leading-none font-bold">N 35.6762°</span>
              <span className="text-[6.5px] font-mono text-slate-500 dark:text-slate-400 mt-0.5 leading-none">DAY 03</span>
            </div>

            <svg className="absolute w-28 h-28 -rotate-90 pointer-events-none" viewBox="0 0 100 100">
              <circle 
                cx="50" 
                cy="50" 
                r="36" 
                fill="transparent" 
                stroke="url(#indigo-grad)" 
                strokeWidth="1.5"
                strokeDasharray="226"
                strokeDashoffset="75"
                className="opacity-70 dark:opacity-80"
              />
              <defs>
                <linearGradient id="indigo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity="1" />
                </linearGradient>
              </defs>
            </svg>
            
            <div className="absolute w-2 h-2 rounded-full bg-indigo-400 animate-ping top-[20px] left-[62px]" />
            <div className="absolute w-1.5 h-1.5 rounded-full bg-indigo-500 top-[20px] left-[62px]" />
          </div>

          {/* Dials at the bottom exactly mimicking Linear's screenshot, borderless */}
          <div className="flex items-center justify-center gap-4 pt-2 border-t border-slate-200/50 dark:border-white/[0.05] mt-2">
            <div className="flex items-center gap-1">
              <div className="relative w-4 h-4 rounded-full border border-indigo-500/30 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-450 animate-ping" />
                <span className="absolute w-1 h-1 rounded-full bg-indigo-500 dark:bg-indigo-300" />
              </div>
            </div>
            <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-white/[0.15] flex items-center justify-center" />
            <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-white/[0.15] relative overflow-hidden flex items-center">
              <div className="w-2 h-full bg-slate-400 dark:bg-white/[0.3]" />
            </div>
            <div className="w-4 h-4 rounded-full bg-indigo-500 border border-indigo-600 flex items-center justify-center shadow-sm">
              <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'destinations',
      title: 'Destination Information',
      path: '/destinations',
      color: 'blue',
      badge: 'Cities',
      icon: Globe,
      desc: 'Explore over 50 beautiful cities with simple budget tips and local advice.',
      borderColor: 'border-blue-100 hover:border-blue-400 dark:border-white/[0.05] dark:group-hover:border-blue-500/40',
      bgColor: 'bg-gradient-to-b from-blue-50/80 to-blue-100/40 dark:from-[#051126] dark:to-[#030915]',
      glowColor: 'group-hover:shadow-[0_20px_50px_rgba(59,130,246,0.15)]',
      iconBg: 'bg-blue-150/10 dark:bg-blue-500/10 text-blue-650 dark:text-blue-300 border-blue-200/30 dark:border-blue-500/20',
      badgeStyle: 'bg-blue-500/10 text-blue-600 dark:text-blue-300 border-blue-500/20',
      visual: (
        <div className="w-full mt-2 flex flex-col justify-between flex-1 select-none">
          <div className="text-[9px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold block text-left mb-2">Language Companion</div>
          
          <div className="space-y-1.5 flex-1 flex flex-col justify-center">
            {[
              { flag: '🇯🇵 JP', text: 'Konnichiwa (こんにちは)', meaning: 'Hello', active: true },
              { flag: '🇫🇷 FR', text: 'Bonjour (Good Day)', meaning: 'Greetings', active: false },
              { flag: '🇮🇩 ID', text: 'Terima Kasih (Thank You)', meaning: 'Gratitude', active: false },
              { flag: '🇮🇹 IT', text: 'Grazie (Thank You)', meaning: 'Gratitude', active: false }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className={`flex items-center justify-between text-[8.5px] px-2.5 py-1.5 rounded-lg border transition-all duration-300 ${
                  item.active 
                    ? 'bg-blue-500/10 dark:bg-blue-500/20 border-blue-500/20 dark:border-blue-500/40 text-blue-750 dark:text-blue-200 shadow-3xs font-bold' 
                    : 'bg-white/40 dark:bg-white/[0.02] border-slate-200/40 dark:border-white/[0.04] text-slate-650 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-[8px] font-mono opacity-80 shrink-0">{item.flag}</span>
                  <span className="truncate max-w-[110px]">{item.text}</span>
                </div>
                <span className="text-[7.5px] font-mono opacity-70">➔ {item.meaning}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'budget',
      title: 'Budget Estimator',
      path: '/budget-planner',
      color: 'emerald',
      badge: 'Budget',
      icon: Wallet,
      desc: 'Track flight, hotel, food, and transport costs instantly in local currencies.',
      borderColor: 'border-emerald-100 hover:border-emerald-400 dark:border-white/[0.05] dark:group-hover:border-emerald-500/40',
      bgColor: 'bg-gradient-to-b from-emerald-50/80 to-emerald-100/40 dark:from-[#031c10] dark:to-[#010c07]',
      glowColor: 'group-hover:shadow-[0_20px_50px_rgba(16,185,129,0.15)]',
      iconBg: 'bg-emerald-150/10 dark:bg-emerald-500/10 text-emerald-650 dark:text-emerald-300 border-emerald-200/30 dark:border-emerald-500/20',
      badgeStyle: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20',
      visual: (
        <div className="w-full mt-2 flex flex-col justify-between flex-1 select-none">
          <div className="flex items-center justify-between text-[8px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider px-0.5 mb-1.5">
            <span>Budget Control</span>
            <span className="text-emerald-650 dark:text-emerald-450 font-mono">Live Factual</span>
          </div>

          {/* Album art cover floats directly inside main card layout, outline-free wrapper */}
          <div className="relative w-full h-24 rounded-xl border border-slate-200/50 dark:border-white/[0.08] overflow-hidden shadow-xs my-1 group/album">
            <img 
              src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&q=80" 
              alt="Luxury resort overlooking ocean" 
              className="absolute inset-0 w-full h-full object-cover filter brightness-[0.95] group-hover/album:scale-103 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
            
            <div className="absolute bottom-2 left-3 text-left leading-tight pointer-events-none">
              <span className="block text-[9.5px] font-extrabold text-white tracking-wide">Bali Luxury Stays</span>
              <span className="block text-[7.5px] text-emerald-350 dark:text-emerald-300 font-mono font-bold uppercase tracking-wider">Mid-Range Estimator</span>
            </div>
          </div>

          <div className="space-y-1 px-0.5 mt-1.5">
            <div className="w-full h-1 bg-slate-200 dark:bg-white/[0.12] rounded-full overflow-hidden relative">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${budgetPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[7px] text-slate-500 dark:text-slate-300 font-mono leading-none">
              <span>${Math.floor(budgetPercent * 15)} USD</span>
              <span>$1,500 Plan</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 py-1 border-t border-slate-200/50 dark:border-white/[0.05] mt-2">
            <button 
              type="button" 
              onClick={(e) => { e.preventDefault(); setBudgetPercent(30); }}
              className="text-slate-500 dark:text-slate-455 hover:text-slate-900 dark:hover:text-white transition-colors duration-200 cursor-pointer"
            >
              <SkipBack className="w-3 h-3 shrink-0" />
            </button>
            <button 
              type="button" 
              onClick={(e) => { e.preventDefault(); setIsPlaying(!isPlaying); }}
              className="w-6 h-6 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm hover:scale-105 active:scale-95"
            >
              {isPlaying ? (
                <div className="flex gap-0.5 justify-center items-center w-2.5 h-2.5">
                  <div className="w-[2px] h-2.5 bg-slate-950 rounded-xs" />
                  <div className="w-[2px] h-2.5 bg-slate-950 rounded-xs" />
                </div>
              ) : (
                <Play className="w-2.5 h-2.5 text-slate-950 fill-slate-950 translate-x-[0.5px]" />
              )}
            </button>
            <button 
              type="button" 
              onClick={(e) => { e.preventDefault(); setBudgetPercent(90); }}
              className="text-slate-500 dark:text-slate-455 hover:text-slate-900 dark:hover:text-white transition-colors duration-200 cursor-pointer"
            >
              <SkipForward className="w-3 h-3 shrink-0" />
            </button>
          </div>

        </div>
      )
    },
    {
      id: 'trip-ai',
      title: 'Trip AI Chatbot',
      path: '/trip-ai',
      color: 'purple',
      badge: 'AI Assistant',
      icon: Bot,
      desc: 'Chat with our AI helper about packing lists and local safety tips.',
      borderColor: 'border-purple-100 hover:border-purple-400 dark:border-white/[0.05] dark:group-hover:border-purple-500/40',
      bgColor: 'bg-gradient-to-b from-purple-50/80 to-purple-100/40 dark:from-[#110524] dark:to-[#080312]',
      glowColor: 'group-hover:shadow-[0_20px_50px_rgba(168,85,247,0.15)]',
      iconBg: 'bg-purple-150/10 dark:bg-purple-500/10 text-purple-650 dark:text-purple-300 border-purple-200/30 dark:border-purple-500/20',
      badgeStyle: 'bg-purple-500/10 text-purple-600 dark:text-purple-300 border-purple-500/20',
      visual: (
        <div className="w-full mt-2 flex flex-col justify-between flex-1 select-none relative">
          
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 via-pink-500/5 to-transparent pointer-events-none" />
          
          <div className="absolute right-[10px] bottom-[10px] left-[10px] top-[10px] opacity-20 dark:opacity-30 blur-xs select-none pointer-events-none flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-24 h-24 animate-[spin-slow_40s_linear_infinite]">
              <path 
                d="M 50,15 A 35,35 0 1,1 15,50 L 50,50 Z" 
                fill="none" 
                stroke="url(#arc-swoosh-glassless)" 
                strokeWidth="10" 
                strokeLinecap="round" 
              />
              <defs>
                <linearGradient id="arc-swoosh-glassless" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="50%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="relative z-10 w-full bg-white/40 dark:bg-white/[0.03] backdrop-blur-md border border-slate-200/40 dark:border-white/[0.05] rounded-xl p-3 shadow-3xs flex-1 flex flex-col justify-between">
            <div className="flex justify-between items-center text-[7.5px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold mb-2 select-none leading-none">
              <span>AI Channels</span>
              <span className="w-1.5 h-1.5 rounded-full bg-purple-505 animate-pulse" />
            </div>
            
            <div className="space-y-1.5 flex-1 flex flex-col justify-center">
              {[
                { name: 'Itinerary Workspace', active: true },
                { name: 'Packing Checklist Desk', active: false },
                { name: 'Safety & Consul Advisory', active: false }
              ].map((space, sidx) => (
                <div 
                  key={sidx}
                  className={`flex items-center justify-between text-[8.5px] px-2.5 py-1 rounded transition-all duration-300 font-medium ${
                    space.active 
                      ? 'bg-purple-500/10 dark:bg-purple-500/20 text-purple-750 dark:text-purple-300 font-bold shadow-4xs border border-purple-500/10' 
                      : 'text-slate-550 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  <span className="truncate max-w-[120px]">{space.name}</span>
                  {space.active && <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'packing',
      title: 'Packing Assistant',
      path: '/ai-trip-planner',
      color: 'indigo',
      badge: 'Checklists',
      icon: Briefcase,
      desc: 'Get personalized packing lists based on local weather and your trip style.',
      borderColor: 'border-indigo-100 hover:border-indigo-400 dark:border-white/[0.05] dark:group-hover:border-indigo-500/40',
      bgColor: 'bg-gradient-to-b from-indigo-50/80 to-indigo-100/40 dark:from-[#080d1a] dark:to-[#04060d]',
      glowColor: 'group-hover:shadow-[0_20px_50px_rgba(99,102,241,0.15)]',
      iconBg: 'bg-indigo-150/10 dark:bg-indigo-500/10 text-indigo-650 dark:text-indigo-300 border-indigo-200/30 dark:border-indigo-500/20',
      badgeStyle: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border-indigo-500/20',
      visual: (
        <div className="w-full mt-2 flex flex-col justify-between flex-1 select-none">
          <div className="flex justify-between items-center text-[9px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold mb-2">
            <span>Smart Registry</span>
            <span className="text-[8px] text-indigo-600 dark:text-indigo-400 font-mono font-bold uppercase">Dynamic list</span>
          </div>

          <div className="space-y-1.5 flex-1 flex flex-col justify-center">
            {[
              { item: 'Passport & Visas', checked: true },
              { item: 'Universal Adapter', checked: true },
              { item: 'Cold Weather Layers', checked: false }
            ].map((node, nidx) => (
              <div 
                key={nidx} 
                className={`flex items-center gap-2 text-[8.5px] px-2.5 py-1.5 rounded-lg border ${
                  node.checked 
                    ? 'bg-indigo-500/10 dark:bg-indigo-500/20 border-indigo-500/15 dark:border-indigo-500/30 text-indigo-750 dark:text-indigo-250 font-bold' 
                    : 'bg-white/40 dark:bg-white/[0.02] border-slate-200/40 dark:border-white/[0.04] text-slate-650 dark:text-slate-300'
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                  node.checked ? 'bg-indigo-500 border-indigo-600 text-white' : 'border-slate-300 dark:border-white/[0.2]'
                }`}>
                  {node.checked && <Check className="w-2.5 h-2.5 animate-fade-in" strokeWidth={3} />}
                </div>
                <span className="font-medium">{node.item}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'flights',
      title: 'Flight Price Predictor',
      path: '/budget-planner',
      color: 'sunset',
      badge: 'Prices',
      icon: Plane,
      desc: 'Check if flight ticket prices are going up or down using past flight data.',
      borderColor: 'border-blue-100 hover:border-blue-400 dark:border-white/[0.05] dark:group-hover:border-blue-500/40',
      bgColor: 'bg-gradient-to-b from-blue-50/80 to-blue-100/40 dark:from-[#051126] dark:to-[#030915]',
      glowColor: 'group-hover:shadow-[0_20px_50px_rgba(59,130,246,0.15)]',
      iconBg: 'bg-blue-150/10 dark:bg-blue-500/10 text-blue-650 dark:text-blue-300 border-blue-200/30 dark:border-blue-500/20',
      badgeStyle: 'bg-blue-500/10 text-blue-300 dark:text-blue-200 border-blue-500/30',
      visual: (
        <div className="w-full mt-2 flex flex-col justify-between flex-1 select-none">
          <div className="flex justify-between items-center text-[9px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold mb-2">
            <span>HND Price Curve</span>
            <span className="text-[8px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">50% Drop Predicted</span>
          </div>

          <div className="relative h-20 w-full flex items-center justify-center my-1 select-none">
            <svg viewBox="0 0 120 40" className="w-full h-full overflow-visible">
              <path 
                d="M 5,5 Q 40,5 60,25 T 115,35" 
                fill="none" 
                stroke="url(#trend-grad-glassless)" 
                strokeWidth="2" 
                strokeLinecap="round" 
              />
              <circle cx="115" cy="35" r="3.5" fill="#10b981" className="animate-pulse" />
              <defs>
                <linearGradient id="trend-grad-glassless" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="50%" stopColor="#f43f5e" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute top-2 left-6 text-[7.5px] font-mono text-slate-500">$850</div>
            <div className="absolute bottom-2 right-6 text-[8.5px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">$420 Buy</div>
          </div>

          <div className="flex items-center justify-between text-[8px] border-t border-slate-200/50 dark:border-white/[0.05] pt-1.5 font-bold font-mono mt-1">
            <span className="text-slate-500 dark:text-slate-400">Historical accuracy</span>
            <span className="text-emerald-650 dark:text-emerald-450">99.9%</span>
          </div>
        </div>
      )
    },
    {
      id: 'hotels',
      title: 'Hotel Finder AI',
      path: '/ai-trip-planner',
      color: 'emerald',
      badge: 'Stays',
      icon: Building2,
      desc: 'Find top-rated hotels and stays with direct links and real reviews.',
      borderColor: 'border-emerald-100 hover:border-emerald-400 dark:border-white/[0.05] dark:group-hover:border-emerald-500/40',
      bgColor: 'bg-gradient-to-b from-emerald-50/80 to-emerald-100/40 dark:from-[#031c10] dark:to-[#010c07]',
      glowColor: 'group-hover:shadow-[0_20px_50px_rgba(16,185,129,0.15)]',
      iconBg: 'bg-emerald-150/10 dark:bg-emerald-500/10 text-emerald-650 dark:text-emerald-300 border-emerald-200/30 dark:border-emerald-500/20',
      badgeStyle: 'bg-emerald-500/10 text-emerald-300 dark:text-emerald-200 border-emerald-500/30',
      visual: (
        <div className="w-full mt-2 flex flex-col justify-between flex-1 select-none">
          <div className="flex justify-between items-center text-[9px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold mb-2">
            <span>Match Ratio</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">★ 4.9</span>
          </div>

          <div className="bg-white/50 dark:bg-white/[0.03] border border-slate-200/40 dark:border-white/[0.06] rounded-xl p-2.5 flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-slate-200/50 dark:border-white/[0.06]">
              <img 
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&q=80" 
                alt="Hotel Thumbnail" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col items-start leading-tight text-left">
              <span className="font-extrabold text-[9.5px] text-slate-900 dark:text-white">The Ritz-Carlton</span>
              <span className="text-[7.5px] text-slate-500 dark:text-slate-400 mt-0.5">Tokyo Midtown, JP</span>
              <span className="text-[8.5px] text-emerald-600 dark:text-emerald-400 font-mono font-bold mt-1">$240/night</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[8px] border-t border-slate-200/50 dark:border-white/[0.05] pt-1.5 font-bold font-mono mt-1">
            <span className="text-slate-500 dark:text-slate-400">Coordinate links</span>
            <span className="text-emerald-650 dark:text-emerald-450">Active</span>
          </div>
        </div>
      )
    },
    {
      id: 'itinerary',
      title: 'Smart Itinerary Builder',
      path: '/ai-trip-planner',
      color: 'purple',
      badge: 'Planners',
      icon: Calendar,
      desc: 'Plan daily activities grouped by neighborhood with local weather forecasts.',
      borderColor: 'border-purple-100 hover:border-purple-400 dark:border-white/[0.05] dark:group-hover:border-purple-500/40',
      bgColor: 'bg-gradient-to-b from-purple-50/80 to-purple-100/40 dark:from-[#110524] dark:to-[#080312]',
      glowColor: 'group-hover:shadow-[0_20px_50px_rgba(168,85,247,0.15)]',
      iconBg: 'bg-purple-150/10 dark:bg-purple-500/10 text-purple-650 dark:text-purple-300 border-purple-200/30 dark:border-purple-500/20',
      badgeStyle: 'bg-purple-500/10 text-purple-300 dark:text-purple-200 border-purple-500/30',
      visual: (
        <div className="w-full mt-2 flex flex-col justify-between flex-1 select-none">
          <div className="flex justify-between items-center text-[9px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold mb-2">
            <span>Route Tracker</span>
            <span className="text-purple-600 dark:text-purple-450 font-mono animate-pulse">DAY PATH</span>
          </div>

          <div className="space-y-1.5 flex-1 flex flex-col justify-center text-left pl-1">
            {[
              { time: '09:00 AM', loc: 'Shibuya Crossing', active: false },
              { time: '01:00 PM', loc: 'Meiji Shrine Walk', active: true },
              { time: '06:00 PM', loc: 'Shinjuku Ramen', active: false }
            ].map((node, ndx) => (
              <div key={ndx} className="flex items-center gap-2">
                <span className="text-[7px] font-mono text-slate-500 dark:text-slate-400 shrink-0">{node.time}</span>
                <div className="relative flex items-center justify-center shrink-0">
                  <div className="absolute h-4 w-[1px] bg-slate-200 dark:bg-white/[0.12]" />
                  <div className={`w-2 h-2 rounded-full border ${
                    node.active ? 'bg-purple-500 border-purple-600 shadow-sm' : 'border-slate-300 dark:border-white/[0.3]'
                  }`} />
                </div>
                <span className={`text-[8.5px] truncate font-medium ${
                  node.active ? 'text-purple-700 dark:text-purple-200 font-extrabold' : 'text-slate-750 dark:text-slate-300'
                }`}>
                  {node.loc}
                </span>
              </div>
            ))}
          </div>
        </div>
      )
    }
  ];

  const filters = ['All', 'Featured', 'Guides', 'Budget', 'Cities', 'AI Assistant', 'Checklists', 'Prices', 'Stays', 'Planners'];

  const filteredTools = activeFilter === 'All' 
    ? tools 
    : tools.filter(tool => tool.badge === activeFilter);

  return (
    <section className="section-padding bg-[var(--bg-primary)] border-b border-[var(--border)] relative overflow-hidden transition-colors duration-500">
      
      {/* Symmetrical glowing background blobs */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-[var(--accent)]/[0.01] dark:bg-[var(--accent)]/[0.03] filter blur-[100px] pointer-events-none z-0" />
      <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-indigo-500/[0.01] dark:bg-indigo-500/[0.02] filter blur-[100px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Block mimicking Arc screen block perfectly */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="text-left space-y-2.5 max-w-xl">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--accent)] text-[9px] font-bold uppercase tracking-[0.18em]">
              <Sparkles className="w-3 h-3 text-[var(--accent)]" /> Travel Toolkit
            </span>
            
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-luxury-primary dark:text-white leading-tight">
              There's a tool for that.
            </h2>
            <p className="text-sm text-slate-550 dark:text-slate-400 font-light leading-relaxed font-body">
              Use our simple travel tools to plan, calculate, explore, and get help instantly.
            </p>
          </div>

          {/* Interactive capsule pill category filter */}
          <div className="flex flex-wrap items-center bg-slate-50 dark:bg-white/[0.01] border border-slate-200/50 dark:border-white/[0.04] p-1 rounded-full shadow-3xs max-w-max self-start md:self-end">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  activeFilter === f
                    ? 'bg-luxury-primary dark:bg-white text-white dark:text-black shadow-xs font-black'
                    : 'text-slate-500 dark:text-slate-400 hover:text-luxury-primary dark:hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Card Layout snaps carousel container - borderless inner layouts */}
        <div 
          ref={sliderRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar py-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {filteredTools.map((tool) => {
            const ToolIcon = tool.icon;
            return (
              <div 
                key={tool.id}
                className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] shrink-0 snap-start"
              >
                <Link
                  to={tool.path}
                  className={`backdrop-blur-xl rounded-[28px] p-6 relative overflow-hidden transition-all duration-500 hover:-translate-y-2.5 group flex flex-col justify-between h-[390px] cursor-pointer select-none ${tool.borderColor} ${tool.bgColor} ${tool.glowColor}`}
                >
                  
                  {/* Theme colored corner sweep overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.03] to-transparent dark:from-white/[0.01] pointer-events-none" />

                  {/* Card Content (Relative z-10) */}
                  <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
                    <div className="space-y-4">
                      {/* Top Line branding info */}
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${tool.iconBg} transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3`}>
                            <ToolIcon className="w-4.5 h-4.5 shrink-0" />
                          </div>
                          <span className="font-heading font-extrabold text-[13px] text-slate-900 dark:text-white group-hover:text-indigo-650 dark:group-hover:text-indigo-200 transition-colors duration-300">
                            {tool.title}
                          </span>
                        </div>

                        {/* Small top-right circular trigger button, borderless */}
                        <div className="w-7 h-7 rounded-lg bg-slate-200/50 dark:bg-white/[0.04] text-slate-700 dark:text-white flex items-center justify-center transition-all duration-300 group-hover:bg-luxury-primary dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black shrink-0">
                          <ChevronRight className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5" />
                        </div>
                      </div>

                      {/* Tool Description */}
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 font-light leading-relaxed font-body text-left">
                        {tool.desc}
                      </p>
                    </div>

                    {/* Outer Card Visual Element - Borderless & Float layout */}
                    {tool.visual}

                    {/* Category Tag pill */}
                    <div className="mt-5 pt-4 border-t border-slate-200/50 dark:border-white/[0.06] flex items-center justify-between text-[8px] font-sans font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-none">
                      <span>Category:</span>
                      <span className={`px-2 py-0.5 rounded border ${tool.badgeStyle} leading-none`}>
                        {tool.badge}
                      </span>
                    </div>
                  </div>

                </Link>
              </div>
            );
          })}
        </div>

        {/* Bottom anchor and slider pagination buttons */}
        <div className="mt-12 text-center select-none flex justify-between items-center text-slate-500 dark:text-slate-400 text-xs px-2">
          <Link
            to="/ai-trip-planner"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[var(--accent)] hover:underline"
          >
            <span>Open the Travel Planner →</span>
          </Link>
          <div className="flex gap-2">
            <button 
              type="button"
              onClick={scrollLeft}
              className="w-8 h-8 rounded-full border border-slate-200 dark:border-white/[0.05] flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/[0.02] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-250 cursor-pointer shadow-sm select-none"
              aria-label="Slide Left"
            >
              {'<'}
            </button>
            <button 
              type="button"
              onClick={scrollRight}
              className="w-8 h-8 rounded-full border border-slate-200 dark:border-white/[0.05] flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/[0.02] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-250 cursor-pointer shadow-sm select-none"
              aria-label="Slide Right"
            >
              {'>'}
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
