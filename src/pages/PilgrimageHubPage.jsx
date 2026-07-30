import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, Compass, Clock, Star, DollarSign, Calendar, Landmark, 
  BookOpen, ChevronRight, X, Mail, CheckCircle, Info, Heart, Share2, 
  Globe, AlertCircle, ArrowUpRight, Bookmark, MapPin, Shield, ShieldAlert,
  CloudSun, HelpCircle, FileText, ChevronDown, Check, ArrowRight, PhoneCall,
  Activity, Navigation, Eye, FileDown, Languages, Utensils, MessageSquare,
  ThumbsUp, User
} from 'lucide-react';
import { spiritualReligions, spiritualDestinations } from '../data/spiritualDestinations';
import { getSpiritualDetails } from '../utils/spiritualDetailsGenerator';
import UmrahGuideCard from '../components/UmrahGuideCard';
import YouTubeTravelSection from '../components/YouTubeTravelSection';

export default function PilgrimageHubPage() {
  const [selectedReligion, setSelectedReligion] = useState('all');
  const [selectedDestId, setSelectedDestId] = useState(null);
  const [drawerTab, setDrawerTab] = useState('heritage'); // heritage, sanctuary, pilgrim, visit, companion
  
  // Interactive checklist state
  const [checkedItems, setCheckedItems] = useState({});
  
  // Interactive Q&A chat state
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Accordion toggle states
  const [openAccordions, setOpenAccordions] = useState({
    whyImportant: true,
    history: false,
    architecture: false,
    etiquette: true,
    faq: false
  });

  const toggleAccordion = (key) => {
    setOpenAccordions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Saved guides list state
  const [savedGuides, setSavedGuides] = useState({});
  const [shareToastText, setShareToastText] = useState('');

  // Load saved guides on mount
  useEffect(() => {
    const saved = {};
    spiritualDestinations.forEach(dest => {
      if (localStorage.getItem(`tripready_pilgrim_saved_${dest.id}`) === 'true') {
        saved[dest.id] = true;
      }
    });
    setSavedGuides(saved);
  }, []);

  const toggleSave = (id, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const isSaved = !savedGuides[id];
    setSavedGuides(prev => ({ ...prev, [id]: isSaved }));
    localStorage.setItem(`tripready_pilgrim_saved_${id}`, isSaved ? 'true' : 'false');
  };

  const handleShare = (dest, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const shareUrl = `${window.location.origin}/pilgrimage?dest=${dest.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setShareToastText(dest.id);
      setTimeout(() => setShareToastText(''), 2000);
    });
  };

  // Filtered destinations list
  const filteredDestinations = useMemo(() => {
    if (selectedReligion === 'all') return spiritualDestinations;
    return spiritualDestinations.filter(d => d.religion === selectedReligion);
  }, [selectedReligion]);

  // Selected destination detailed model
  const activeDest = useMemo(() => {
    const base = spiritualDestinations.find(d => d.id === selectedDestId);
    if (!base) return null;
    return {
      ...base,
      details: getSpiritualDetails(base)
    };
  }, [selectedDestId]);

  // Handle opening the details drawer
  const openDetails = (destId) => {
    setSelectedDestId(destId);
    setDrawerTab('heritage');
    setCheckedItems({});
    
    // Reset AI Assistant Chat
    const initialPrompt = getInitialAIChat(destId);
    setChatMessages(initialPrompt);
    setChatInput('');
    setIsTyping(false);
  };

  // Helper to resolve initial AI Chat messages
  const getInitialAIChat = (destId) => {
    const destObj = spiritualDestinations.find(d => d.id === destId);
    const name = destObj ? destObj.name : 'this sacred site';
    return [
      {
        sender: 'ai',
        text: `Peace be upon you! I am your AI Pilgrim Companion for ${name}. I can assist you with history, rituals, prayer times, dress code guidelines, or travel costs. Ask me any question below!`
      }
    ];
  };

  // Handle clicking sample AI queries
  const handleSampleQuestion = (question, answer) => {
    if (isTyping) return;
    
    // Add user message
    setChatMessages(prev => [...prev, { sender: 'user', text: question }]);
    setIsTyping(true);
    
    setTimeout(() => {
      setChatMessages(prev => [...prev, { sender: 'ai', text: answer }]);
      setIsTyping(false);
    }, 800);
  };

  // Handle submitting custom questions
  const handleCustomQuestionSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isTyping) return;
    
    const query = chatInput.trim();
    setChatMessages(prev => [...prev, { sender: 'user', text: query }]);
    setChatInput('');
    setIsTyping(true);

    // Simulate smart keyword-based answering
    setTimeout(() => {
      let reply = `I've registered your question about "${query}". For this sacred destination, please verify that you follow the local modesty rules, carry official entry permits where required, and consult local coordinators for prayer times.`;
      
      const lower = query.toLowerCase();
      if (lower.includes('wear') || lower.includes('dress') || lower.includes('clothes')) {
        reply = activeDest?.details?.etiquette?.dressCode || reply;
      } else if (lower.includes('cost') || lower.includes('price') || lower.includes('budget') || lower.includes('money')) {
        reply = `The estimated cost structure is: Low budget is ${activeDest?.details?.costs?.low}, Medium budget is ${activeDest?.details?.costs?.medium}, and Luxury is ${activeDest?.details?.costs?.luxury}.`;
      } else if (lower.includes('time') || lower.includes('hour') || lower.includes('open') || lower.includes('close')) {
        reply = `Opening hours are ${activeDest?.details?.openingHours?.openingTime} to ${activeDest?.details?.openingHours?.closingTime}. ${activeDest?.details?.openingHours?.prayerClosure}`;
      } else if (lower.includes('food') || lower.includes('restaurant') || lower.includes('eat')) {
        reply = `Nearby food options include: ${activeDest?.details?.foodNearby?.map(f => `${f.name} (${f.type})`).join(', ')}.`;
      }

      setChatMessages(prev => [...prev, { sender: 'ai', text: reply }]);
      setIsTyping(false);
    }, 1000);
  };

  // Professional SVG icons for religion filter tabs
  const ReligionIcon = ({ iconId, active }) => {
    const color = active ? 'currentColor' : 'currentColor';
    const s = 14;
    const svgProps = { width: s, height: s, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };
    switch (iconId) {
      case 'globe':
        return <svg {...svgProps}><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
      case 'islam':
        return <svg {...svgProps} fill={color} stroke="none"><path d="M12 2C8.43 2 5.23 3.93 3.5 6.8A8.5 8.5 0 0 0 12.8 20.5c.4 0 .8-.03 1.2-.08A10 10 0 0 1 12 2z"/><path d="M17.2 7.8l.6-1.8.6 1.8h1.9l-1.5 1.1.6 1.8-1.6-1.1-1.5 1.1.5-1.8-1.5-1.1z"/></svg>;
      case 'cross':
        return <svg {...svgProps}><line x1="12" y1="3" x2="12" y2="21"/><line x1="5" y1="8" x2="19" y2="8"/></svg>;
      case 'om':
        return <svg {...svgProps} strokeWidth="1.8"><path d="M7 15c-2-1-3-3-2-5s3-3 5-2c1 .5 2 1.5 2 3"/><path d="M12 11c0 3-1 5-3 6"/><path d="M15 8c2 0 4 1 4 4s-2 5-5 5"/><path d="M17 4c1 1 1 2 0 3"/><circle cx="17" cy="3" r="0.5" fill={color}/></svg>;
      case 'dharma':
        return <svg {...svgProps}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2"/><line x1="12" y1="3" x2="12" y2="10"/><line x1="12" y1="14" x2="12" y2="21"/><line x1="3" y1="12" x2="10" y2="12"/><line x1="14" y1="12" x2="21" y2="12"/><line x1="5.6" y1="5.6" x2="10.6" y2="10.6"/><line x1="13.4" y1="13.4" x2="18.4" y2="18.4"/><line x1="18.4" y1="5.6" x2="13.4" y2="10.6"/><line x1="10.6" y1="13.4" x2="5.6" y2="18.4"/></svg>;
      case 'star-david':
        return <svg {...svgProps}><polygon points="12,2 17,10 22,18 12,14 2,18 7,10"/><polygon points="12,22 7,14 2,6 12,10 22,6 17,14"/></svg>;
      case 'khanda':
        return <svg {...svgProps} strokeWidth="1.8"><line x1="12" y1="2" x2="12" y2="22"/><circle cx="12" cy="12" r="5"/><path d="M4 4 c4 4 4 8 0 16"/><path d="M20 4 c-4 4-4 8 0 16"/></svg>;
      case 'yinyang':
        return <svg {...svgProps}><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20 5 5 0 0 1 0-10 5 5 0 0 0 0-10z" fill={color}/><circle cx="12" cy="7" r="1.5" fill="var(--bg-primary, #0a1224)"/><circle cx="12" cy="17" r="1.5" fill={color}/></svg>;
      case 'star9':
        return <svg {...svgProps}><polygon points="12,2 14,9 21,9 15.5,13.5 17.5,21 12,16.5 6.5,21 8.5,13.5 3,9 10,9"/></svg>;
      case 'hand':
        return <svg {...svgProps}><path d="M18 11V6a1 1 0 0 0-2 0v4"/><path d="M14 10V4a1 1 0 0 0-2 0v6"/><path d="M10 10V5a1 1 0 0 0-2 0v5"/><path d="M6 12V9a1 1 0 0 0-2 0v7a8 8 0 0 0 16 0v-4a1 1 0 0 0-2 0"/></svg>;
      case 'compass':
        return <svg {...svgProps}><circle cx="12" cy="12" r="10"/><polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88"/></svg>;
      default:
        return <svg {...svgProps}><circle cx="12" cy="12" r="10"/></svg>;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-500 pt-28 pb-24 overflow-x-hidden relative">
      
      {/* Background subtle grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.01)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.002)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.002)_1px,transparent_1px)] bg-[size:44px_44px] pointer-events-none z-0 opacity-60" />
      
      {/* Decorative Orbs */}
      <div className="absolute top-12 left-10 w-[350px] h-[350px] rounded-full bg-amber-500/[0.02] dark:bg-amber-500/[0.04] filter blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-24 right-10 w-[450px] h-[450px] rounded-full bg-indigo-500/[0.01] dark:bg-indigo-500/[0.03] filter blur-[120px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-slate-400 font-medium">
          <Link to="/" className="hover:text-[var(--accent)] transition-colors">Home</Link>
          <ChevronRight size={12} className="text-slate-500" />
          <span className="text-slate-600 dark:text-slate-350 font-semibold">Religion & Pilgrimage Hub</span>
        </nav>

        {/* Hero Section Banner (Preserved stats card) */}
        <div className="relative rounded-[36px] overflow-hidden bg-white dark:bg-[#071125] border border-slate-100 dark:border-white/[0.04] p-8 md:p-14 shadow-[0_12px_45px_rgba(2,6,23,0.03)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.45)] flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500/0 via-amber-500/40 to-amber-500/0" />

          <div className="space-y-4 text-left max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-650 dark:text-amber-400 text-[10px] font-bold uppercase tracking-widest animate-pulse select-none">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sacred Travel Ecosystem</span>
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl font-black text-luxury-primary dark:text-white tracking-tight leading-tight">
              Religion & Pilgrimage
            </h1>
            <p className="text-sm sm:text-base text-slate-550 dark:text-slate-400 font-light leading-relaxed font-body">
              A comprehensive global platform designed to assist pilgrims, spiritual travelers, and historical explorers. Discover sacred landmarks, estimate budgets, checklist essentials, and generate detailed religious itineraries.
            </p>
          </div>

          {/* Quick Hub Statistics */}
          <div className="grid grid-cols-2 gap-4 w-full lg:w-auto shrink-0 lg:min-w-[320px]">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.01] border border-slate-100 dark:border-white/[0.04] text-left">
              <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-slate-400 block mb-1">Supported Faiths</span>
              <span className="text-base font-bold text-luxury-primary dark:text-white flex items-center gap-1.5 font-heading">
                <Globe size={14} className="text-amber-500" />
                10 Religions
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.01] border border-slate-100 dark:border-white/[0.04] text-left">
              <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-slate-400 block mb-1">Pillar Guides</span>
              <span className="text-base font-bold text-luxury-primary dark:text-white flex items-center gap-1.5 font-heading">
                <BookOpen size={14} className="text-indigo-500" />
                Pillar Cards
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.01] border border-slate-100 dark:border-white/[0.04] text-left">
              <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-slate-400 block mb-1">Ziyarat Coordinates</span>
              <span className="text-base font-bold text-luxury-primary dark:text-white flex items-center gap-1.5 font-heading">
                <Compass size={14} className="text-emerald-500" />
                50+ Holy Sights
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.01] border border-slate-100 dark:border-white/[0.04] text-left">
              <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-slate-400 block mb-1">Calculators</span>
              <span className="text-base font-bold text-luxury-primary dark:text-white flex items-center gap-1.5 font-heading">
                <DollarSign size={14} className="text-rose-500" />
                Interactive Models
              </span>
            </div>
          </div>
        </div>

        {/* Categories Section Pill Selector (Modified Filter Hub Guides) */}
        <div className="space-y-4">
          <div className="text-left space-y-1">
            <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Browse Faith Traditions
            </span>
            <h3 className="font-heading text-lg font-bold text-luxury-primary dark:text-white">
              Filter Hub Guides
            </h3>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
            {spiritualReligions.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedReligion(r.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 border whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                  selectedReligion === r.id
                    ? 'bg-amber-500 border-transparent text-white shadow-md'
                    : 'bg-white dark:bg-white/[0.01] border-slate-200 dark:border-white/[0.06] text-slate-600 dark:text-slate-350 hover:border-slate-350 dark:hover:border-white/10'
                }`}
              >
                <ReligionIcon iconId={r.iconId} active={selectedReligion === r.id} />
                <span>{r.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Guides Display Grid */}
        <div className="space-y-8">
          <div className="text-left">
            <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-luxury-primary dark:text-white">
              {selectedReligion === 'all' ? 'All Spiritual Destinations' : `${spiritualReligions.find(r => r.id === selectedReligion)?.name} Destinations`}
            </h3>
            <p className="text-xs text-slate-450 dark:text-slate-500 mt-1 font-light font-body">
              Click a destination below to load the complete historical timeline, pilgrimage guide, visitor rules, and smart AI assistant.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* 1. Flagship Umrah Guide Card (renders first if "All" or "Islam" is selected) */}
            {(selectedReligion === 'all' || selectedReligion === 'islamic') && (
              <div className="md:col-span-2 lg:col-span-3">
                <UmrahGuideCard />
              </div>
            )}

            {/* 2. Grid of other Spiritual Sights */}
            {filteredDestinations.map((dest) => {
              const isSaved = savedGuides[dest.id];
              const showToast = shareToastText === dest.id;

              return (
                <div
                  key={dest.id}
                  onClick={() => openDetails(dest.id)}
                  className="group flex flex-col justify-between rounded-[32px] border border-slate-100 dark:border-white/[0.04] bg-white dark:bg-[#071125]/80 hover:bg-slate-50/50 dark:hover:bg-[#0c1831] p-5 shadow-[0_4px_25px_rgba(0,0,0,0.01)] dark:shadow-[0_10px_35px_rgba(0,0,0,0.3)] transition-all duration-500 text-left relative overflow-hidden select-none h-full hover:-translate-y-1 cursor-pointer"
                >
                  {/* Symmetrical border line at top */}
                  <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-amber-500/0 via-amber-500/20 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="space-y-4">
                    {/* Image Aspect ratio box */}
                    <div className="aspect-[16/10] w-full rounded-2xl overflow-hidden relative shadow-sm shrink-0 bg-slate-100 dark:bg-white/[0.02]">
                      <img
                        src={dest.image}
                        alt={dest.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-black/30 pointer-events-none" />

                      {/* Header tags overlay */}
                      <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
                        <span className="px-2.5 py-0.5 rounded-md bg-black/40 text-[9px] font-bold text-white uppercase tracking-wider backdrop-blur-xs">
                          {dest.religion === 'islamic' ? 'Islam' : 
                           dest.religion === 'christian' ? 'Christianity' :
                           dest.religion === 'hinduism' ? 'Hinduism' :
                           dest.religion === 'buddhism' ? 'Buddhism' :
                           dest.religion === 'judaism' ? 'Judaism' :
                           dest.religion === 'sikhism' ? 'Sikhism' :
                           dest.religion === 'taoism' ? 'Taoism' :
                           dest.religion === 'bahai' ? 'Baháʼí' :
                           dest.religion === 'jainism' ? 'Jainism' : 'Sacred'}
                        </span>
                        
                        <div className="flex gap-1.5">
                          {dest.unesco && (
                            <span className="px-2 py-0.5 rounded-md bg-amber-500/90 text-[8px] font-bold text-white uppercase tracking-wider flex items-center gap-0.5">
                              <Sparkles size={8} />
                              UNESCO
                            </span>
                          )}
                          <button
                            onClick={(e) => toggleSave(dest.id, e)}
                            className={`p-1.5 rounded-lg backdrop-blur-xs transition-colors cursor-pointer ${
                              isSaved 
                                ? 'bg-rose-500 text-white' 
                                : 'bg-black/30 hover:bg-black/50 text-white'
                            }`}
                          >
                            <Heart size={11} className={isSaved ? 'fill-current' : ''} />
                          </button>
                        </div>
                      </div>

                      {/* Visitors label overlay */}
                      <div className="absolute bottom-3 left-3 text-[10px] font-semibold text-white/95 flex items-center gap-1">
                        <Activity size={10} className="text-amber-450 animate-pulse" />
                        <span>{dest.visitors} pilgrims / year</span>
                      </div>
                    </div>

                    {/* Titles */}
                    <div className="space-y-1.5 text-left">
                      <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        <MapPin size={10} />
                        <span>{dest.city}, {dest.country}</span>
                      </div>
                      
                      <h4 className="font-heading text-base font-extrabold text-luxury-primary dark:text-white line-clamp-1">
                        {dest.name}
                      </h4>
                      <p className="text-xs text-slate-400 dark:text-slate-500 italic font-light">
                        Local: {dest.localName}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-light leading-relaxed font-body line-clamp-2">
                        {dest.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Symmetrical CTA Button */}
                  <div className="pt-4 mt-auto">
                    <button
                      onClick={() => openDetails(dest.id)}
                      className="w-full py-2.5 rounded-xl font-heading text-[10px] font-bold uppercase tracking-wider text-center flex items-center justify-center gap-1.5 bg-slate-100 dark:bg-white border border-slate-200 dark:border-transparent text-slate-700 dark:text-black transition-all hover:bg-amber-500 hover:text-white hover:border-transparent cursor-pointer"
                    >
                      <span>Explore Guide & Details</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ─── SACRED DETAILS SIDE OVER / DRAWER (UI/UX PRO MAX) ─── */}
      {activeDest && activeDest.details && (
        <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/85 backdrop-blur-md flex justify-end animate-fade-in">
          {/* Main Slide-over Panel */}
          <div className="w-full max-w-2xl bg-white dark:bg-[#071125] border-l border-slate-100 dark:border-white/[0.08] h-full shadow-[0_0_60px_rgba(0,0,0,0.5)] flex flex-col animate-slide-left text-left relative overflow-hidden">
            
            {/* Drawer Header Hero */}
            <div className="h-56 relative shrink-0">
              <img 
                src={activeDest.image} 
                alt={activeDest.name}
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071125] via-[#071125]/20 to-black/50" />
              
              {/* Close Button overlay */}
              <button 
                onClick={() => setSelectedDestId(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-xs transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>

              {/* Title & metadata overlay */}
              <div className="absolute bottom-5 left-6 right-6 text-left space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-amber-500 text-white text-[8px] font-bold uppercase tracking-wider">
                    {activeDest.details.hero.religion}
                  </span>
                  {activeDest.unesco && (
                    <span className="px-2.5 py-0.5 rounded bg-blue-600 text-white text-[8px] font-bold uppercase tracking-wider flex items-center gap-0.5">
                      <Sparkles size={8} />
                      UNESCO Heritage
                    </span>
                  )}
                  <span className="text-[10px] text-slate-300 font-semibold flex items-center gap-0.5">
                    <Star size={10} className="fill-amber-500 text-amber-500" />
                    {activeDest.details.hero.rating}
                  </span>
                </div>

                <h3 className="font-heading text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-sm line-clamp-1">
                  {activeDest.name}
                </h3>
                <p className="text-xs text-slate-300 font-light italic">
                  Local: {activeDest.localName} — {activeDest.city}, {activeDest.country} ({activeDest.details.hero.continent})
                </p>
              </div>
            </div>

            {/* Quick action bar */}
            <div className="px-6 py-3 bg-slate-50 dark:bg-white/[0.01] border-b border-slate-100 dark:border-white/[0.04] flex items-center justify-between shrink-0">
              <div className="flex gap-2">
                <button 
                  onClick={() => toggleSave(activeDest.id)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer ${
                    savedGuides[activeDest.id]
                      ? 'bg-rose-500 text-white'
                      : 'bg-slate-200/50 dark:bg-white/[0.04] text-slate-650 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                  }`}
                >
                  <Heart size={12} className={savedGuides[activeDest.id] ? 'fill-current' : ''} />
                  <span>{savedGuides[activeDest.id] ? 'Saved to Trip' : 'Save'}</span>
                </button>
                <button 
                  onClick={() => handleShare(activeDest)}
                  className="px-3 py-1.5 rounded-lg bg-slate-200/50 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/10 text-slate-650 dark:text-slate-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Share2 size={12} />
                  <span>{shareToastText === activeDest.id ? 'Copied Link!' : 'Share'}</span>
                </button>
              </div>

              <div className="flex gap-2">
                <a 
                  href={`https://maps.google.com/?q=${encodeURIComponent(activeDest.name + ' ' + activeDest.city)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all"
                >
                  <Navigation size={12} />
                  <span>Navigate</span>
                </a>
                <button
                  onClick={() => setDrawerTab('companion')}
                  className="px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500 hover:text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Sparkles size={12} />
                  <span>AI Guide</span>
                </button>
              </div>
            </div>

            {/* Inner Drawer Tab selector */}
            <div className="flex border-b border-slate-100 dark:border-white/[0.04] overflow-x-auto no-scrollbar shrink-0 bg-white dark:bg-[#071125]">
              {[
                { id: 'heritage', label: 'Heritage', icon: <Landmark size={12} /> },
                { id: 'sanctuary', label: 'Sanctuary', icon: <Compass size={12} /> },
                { id: 'pilgrim', label: 'Pilgrim', icon: <BookOpen size={12} /> },
                { id: 'visit', label: 'Visit Planner', icon: <Clock size={12} /> },
                { id: 'companion', label: 'AI Companion', icon: <MessageSquare size={12} /> }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setDrawerTab(t.id)}
                  className={`flex-1 py-3 px-4 text-center text-[10px] font-bold uppercase tracking-wider border-b-2 flex items-center justify-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                    drawerTab === t.id
                      ? 'border-amber-500 text-amber-500 bg-amber-500/[0.02]'
                      : 'border-transparent text-slate-450 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-50/50 dark:hover:bg-white/[0.01]'
                  }`}
                >
                  {t.icon}
                  <span>{t.label}</span>
                </button>
              ))}
            </div>

            {/* Drawer Body Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">

              {/* ─── TAB 1: HERITAGE ─── */}
              {drawerTab === 'heritage' && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Quick Facts Grid Card */}
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.01] border border-slate-100 dark:border-white/[0.04] space-y-4">
                    <h4 className="font-heading text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-1">
                      <Info size={12} /> Quick Facts
                    </h4>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-[11px]">
                      {activeDest.details.quickFacts.map((fact, idx) => (
                        <div key={idx} className="flex justify-between py-1.5 border-b border-slate-100/50 dark:border-white/[0.02]">
                          <span className="text-slate-450 dark:text-slate-500 font-light">{fact.label}</span>
                          <span className="font-bold text-slate-800 dark:text-slate-350">{fact.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Why Important Accordion */}
                  <div className="border border-slate-100 dark:border-white/[0.04] rounded-2xl overflow-hidden">
                    <button 
                      onClick={() => toggleAccordion('whyImportant')}
                      className="w-full p-4 flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.01] text-left cursor-pointer"
                    >
                      <h4 className="font-heading text-xs font-black uppercase tracking-widest text-slate-850 dark:text-slate-300">
                        Why is this Place Important?
                      </h4>
                      <ChevronDown size={14} className={`transform transition-transform ${openAccordions.whyImportant ? 'rotate-180' : ''}`} />
                    </button>
                    {openAccordions.whyImportant && (
                      <div className="p-5 border-t border-slate-100 dark:border-white/[0.04] space-y-4 text-xs font-light leading-relaxed">
                        <div className="space-y-1">
                          <h5 className="font-bold text-slate-750 dark:text-slate-400 uppercase text-[9px] tracking-wider">Religious Significance</h5>
                          <p>{activeDest.details.importance.religiousSignificance}</p>
                        </div>
                        <div className="space-y-1">
                          <h5 className="font-bold text-slate-750 dark:text-slate-400 uppercase text-[9px] tracking-wider">Historical Legacy</h5>
                          <p>{activeDest.details.importance.historicalSignificance}</p>
                        </div>
                        <div className="space-y-1">
                          <h5 className="font-bold text-slate-750 dark:text-slate-400 uppercase text-[9px] tracking-wider">Spiritual Vibe</h5>
                          <p>{activeDest.details.importance.spiritualImportance}</p>
                        </div>
                        <div className="space-y-1">
                          <h5 className="font-bold text-slate-750 dark:text-slate-400 uppercase text-[9px] tracking-wider">Sacred Traditions</h5>
                          <p>{activeDest.details.importance.sacredTraditions}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Timeline History */}
                  <div className="border border-slate-100 dark:border-white/[0.04] rounded-2xl overflow-hidden">
                    <button 
                      onClick={() => toggleAccordion('history')}
                      className="w-full p-4 flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.01] text-left cursor-pointer"
                    >
                      <h4 className="font-heading text-xs font-black uppercase tracking-widest text-slate-850 dark:text-slate-300">
                        Historical Chronicles (Timeline)
                      </h4>
                      <ChevronDown size={14} className={`transform transition-transform ${openAccordions.history ? 'rotate-180' : ''}`} />
                    </button>
                    {openAccordions.history && (
                      <div className="p-5 border-t border-slate-100 dark:border-white/[0.04] space-y-4">
                        <div className="relative pl-6 border-l-2 border-slate-200 dark:border-white/[0.06] ml-2 space-y-6 text-left">
                          {activeDest.details.history.map((h, idx) => (
                            <div key={idx} className="relative">
                              <span className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-white dark:ring-[#071125]" />
                              <div className="space-y-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">{h.period}</span>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed font-body">{h.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sacred Areas subdivision */}
                  <div className="space-y-3">
                    <h4 className="font-heading text-xs font-black uppercase tracking-widest text-slate-450 dark:text-slate-500">
                      Sacred Zones Inside Complex
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      {activeDest.details.sacredAreas.map((area, idx) => (
                        <div key={idx} className="p-4 rounded-xl border border-slate-100 dark:border-white/[0.03] bg-slate-50/30 dark:bg-white/[0.005] flex justify-between items-center gap-4 text-xs">
                          <div className="space-y-1">
                            <span className="font-bold text-slate-800 dark:text-white block">{area.name}</span>
                            <p className="text-[11px] text-slate-500 dark:text-slate-450 font-light font-body">{area.description}</p>
                          </div>
                          <span className="shrink-0 px-2 py-1 rounded bg-slate-200/50 dark:bg-white/[0.04] text-[9px] text-slate-500 dark:text-slate-400 font-mono">
                            {area.distance}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Related Destinations */}
                  <div className="space-y-3">
                    <h4 className="font-heading text-xs font-black uppercase tracking-widest text-slate-450 dark:text-slate-500">
                      People Also Visited
                    </h4>
                    <div className="flex flex-wrap gap-2 text-[10px] font-medium text-slate-650 dark:text-slate-350">
                      {activeDest.details.relatedDestinations.map((rel, idx) => (
                        <span key={idx} className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.04]">
                          {rel}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* ─── TAB 2: SANCTUARY ─── */}
              {drawerTab === 'sanctuary' && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Architecture specs */}
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.01] border border-slate-100 dark:border-white/[0.04] space-y-4">
                    <h4 className="font-heading text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                      Architectural Marvels
                    </h4>
                    <div className="space-y-3 text-xs leading-relaxed font-light">
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-400 block text-[10px] uppercase">Style & Framework</span>
                        <p>{activeDest.details.architecture.style}</p>
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-400 block text-[10px] uppercase">Exterior Facade</span>
                        <p>{activeDest.details.architecture.exterior}</p>
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-400 block text-[10px] uppercase">Interior Art</span>
                        <p>{activeDest.details.architecture.interior}</p>
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-400 block text-[10px] uppercase">Materials Used</span>
                        <p>{activeDest.details.architecture.materials}</p>
                      </div>
                    </div>
                  </div>

                  {/* Prayer & Worship Info */}
                  <div className="p-5 rounded-2xl border border-slate-100 dark:border-white/[0.04] space-y-3 text-xs text-left">
                    <h4 className="font-heading text-xs font-black uppercase tracking-widest text-slate-850 dark:text-slate-350 flex items-center gap-1.5">
                      <Landmark size={12} className="text-amber-500" />
                      Prayer & Worship Services
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-light leading-relaxed font-body">
                      {activeDest.details.prayerInfo.hallDescription}
                    </p>
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.01] border border-slate-100 dark:border-white/[0.03]">
                        <span className="text-[9px] text-slate-400 block">Hall Capacity</span>
                        <span className="font-bold text-slate-850 dark:text-slate-300 font-heading">{activeDest.details.prayerInfo.capacity}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.01] border border-slate-100 dark:border-white/[0.03]">
                        <span className="text-[9px] text-slate-400 block">Special Prayers</span>
                        <span className="font-bold text-slate-850 dark:text-slate-300">{activeDest.details.prayerInfo.specialPrayers}</span>
                      </div>
                    </div>
                  </div>

                  {/* Virtual Tour section */}
                  <div className="p-5 rounded-2xl bg-indigo-500/[0.02] border border-indigo-500/10 space-y-3 text-xs text-left">
                    <h4 className="font-heading text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                      <Eye size={12} />
                      Virtual 360° Walkthrough
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-body font-light">
                      {activeDest.details.virtualTour.droneView}
                    </p>
                    <div className="pt-2 flex gap-3">
                      <button className="flex-1 py-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500 hover:text-white text-indigo-650 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-wider border border-indigo-500/20 transition-all cursor-pointer">
                        Drone Panorama
                      </button>
                      <button className="flex-1 py-2 rounded-lg bg-slate-200/50 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/10 text-slate-650 dark:text-slate-300 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer">
                        Interior Walk
                      </button>
                    </div>
                  </div>

                  {/* Nearby Attractions */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-slate-100 dark:border-white/[0.03] space-y-2 text-xs">
                      <span className="font-bold text-slate-850 dark:text-slate-300 uppercase text-[9px] tracking-wider block">Nearby Religious Sites</span>
                      <ul className="space-y-1.5 text-slate-500 dark:text-slate-405 font-light font-body list-disc pl-4">
                        {activeDest.details.nearbyReligious.map((n, i) => (
                          <li key={i}>{n}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-100 dark:border-white/[0.03] space-y-2 text-xs">
                      <span className="font-bold text-slate-850 dark:text-slate-300 uppercase text-[9px] tracking-wider block">Local Landmarks</span>
                      <ul className="space-y-1.5 text-slate-500 dark:text-slate-405 font-light font-body list-disc pl-4">
                        {activeDest.details.nearbyAttractions.map((n, i) => (
                          <li key={i}>{n}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                </div>
              )}

              {/* ─── TAB 3: PILGRIM ─── */}
              {drawerTab === 'pilgrim' && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Pilgrimage Guide Route */}
                  <div className="p-5 rounded-2xl bg-amber-500/[0.02] border border-amber-500/10 space-y-3 text-xs text-left">
                    <h4 className="font-heading text-xs font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">
                      Recommended Pilgrimage Route
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-light font-body">
                      <strong>Transit Route:</strong> {activeDest.details.pilgrimageGuide.route}
                    </p>
                    <div className="grid grid-cols-2 gap-4 pt-1 text-[11px]">
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase">Recommended Gate</span>
                        <span className="font-bold text-slate-800 dark:text-slate-300">{activeDest.details.pilgrimageGuide.gate}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase">Est. Duration</span>
                        <span className="font-bold text-slate-800 dark:text-slate-300">{activeDest.details.pilgrimageGuide.duration}</span>
                      </div>
                    </div>

                    <div className="pt-3 space-y-2">
                      <span className="font-bold text-slate-850 dark:text-slate-300 uppercase text-[9px] tracking-wider block">Ritual Order / Steps</span>
                      <div className="space-y-2">
                        {activeDest.details.pilgrimageGuide.steps.map((step, idx) => (
                          <div key={idx} className="flex gap-3 text-xs leading-relaxed font-light">
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-450 text-[10px] font-bold shrink-0">{idx + 1}</span>
                            <p className="pt-0.5 text-slate-550 dark:text-slate-400 font-body">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Dress Code & Etiquette Accordion */}
                  <div className="border border-slate-100 dark:border-white/[0.04] rounded-2xl overflow-hidden">
                    <button 
                      onClick={() => toggleAccordion('etiquette')}
                      className="w-full p-4 flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.01] text-left cursor-pointer"
                    >
                      <h4 className="font-heading text-xs font-black uppercase tracking-widest text-slate-850 dark:text-slate-300">
                        Religious Etiquette & Dress Code
                      </h4>
                      <ChevronDown size={14} className={`transform transition-transform ${openAccordions.etiquette ? 'rotate-180' : ''}`} />
                    </button>
                    {openAccordions.etiquette && (
                      <div className="p-5 border-t border-slate-100 dark:border-white/[0.04] space-y-4 text-xs">
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.01] border border-slate-100 dark:border-white/[0.03] space-y-1">
                          <span className="font-bold text-slate-800 dark:text-slate-350 text-[9px] uppercase tracking-wider block">Dress Policy</span>
                          <p className="font-light text-slate-550 dark:text-slate-400 font-body">{activeDest.details.etiquette.dressCode}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <span className="font-bold text-emerald-600 dark:text-emerald-450 text-[9px] uppercase tracking-wider block">Recommended (Do's)</span>
                            <ul className="space-y-1.5 font-light text-slate-500 dark:text-slate-400 font-body">
                              {activeDest.details.etiquette.dos.map((item, idx) => (
                                <li key={idx} className="flex gap-1.5 items-start">
                                  <Check size={12} className="text-emerald-500 shrink-0 mt-0.5" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="space-y-2">
                            <span className="font-bold text-rose-500 text-[9px] uppercase tracking-wider block">Strictly Forbidden (Don'ts)</span>
                            <ul className="space-y-1.5 font-light text-slate-500 dark:text-slate-400 font-body">
                              {activeDest.details.etiquette.donts.map((item, idx) => (
                                <li key={idx} className="flex gap-1.5 items-start">
                                  <X size={12} className="text-rose-500 shrink-0 mt-0.5" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-150 dark:border-white/[0.02] grid grid-cols-2 gap-4 text-[11px] font-light">
                          <div>
                            <span className="text-slate-400 block text-[9px] uppercase">Shoes Policy</span>
                            <span className="font-bold text-slate-750 dark:text-slate-300">{activeDest.details.etiquette.shoesPolicy}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[9px] uppercase">Photography</span>
                            <span className="font-bold text-slate-750 dark:text-slate-300">{activeDest.details.etiquette.photography}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Interactive Packing / Preparation Checklist */}
                  <div className="p-5 rounded-2xl border border-slate-100 dark:border-white/[0.04] space-y-3 text-left">
                    <h4 className="font-heading text-xs font-black uppercase tracking-widest text-slate-850 dark:text-slate-300 flex items-center gap-1.5">
                      <FileText size={12} />
                      Interactive Pilgrim Preparation Checklist
                    </h4>
                    <p className="text-[10px] text-slate-450 dark:text-slate-500 font-light font-body">
                      Tap items below to check off requirements as you prepare for departure.
                    </p>
                    <div className="space-y-2.5 pt-2">
                      {activeDest.details.checklist.map((item, idx) => {
                        const isChecked = checkedItems[idx];
                        return (
                          <div 
                            key={idx}
                            onClick={() => setCheckedItems(prev => ({ ...prev, [idx]: !prev[idx] }))}
                            className="flex items-center gap-3 cursor-pointer select-none text-xs text-left group/chk"
                          >
                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                              isChecked 
                                ? 'bg-emerald-500 border-transparent text-white' 
                                : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.01] group-hover/chk:border-slate-350'
                            }`}>
                              {isChecked && <Check size={12} />}
                            </div>
                            <span className={`font-body font-light transition-all ${
                              isChecked ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-650 dark:text-slate-350'
                            }`}>
                              {item}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Suggested Itinerary Options */}
                  <div className="space-y-3">
                    <h4 className="font-heading text-xs font-black uppercase tracking-widest text-slate-450 dark:text-slate-500">
                      Suggested Itineraries
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      {activeDest.details.suggestedItinerary.map((it, idx) => (
                        <div key={idx} className="p-4 rounded-xl border border-slate-100 dark:border-white/[0.03] bg-slate-50/20 dark:bg-white/[0.005] text-left space-y-1 text-xs">
                          <span className="font-bold text-slate-800 dark:text-white block">{it.name}</span>
                          <p className="font-body font-light text-slate-500 dark:text-slate-400 leading-relaxed">{it.plan}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* ─── TAB 4: VISIT PLANNER ─── */}
              {drawerTab === 'visit' && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Live Crowd Level Widget */}
                  <div className="p-5 rounded-2xl bg-amber-500/[0.02] border border-amber-500/10 space-y-4 text-xs text-left">
                    <h4 className="font-heading text-xs font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 flex items-center justify-between">
                      <span>Live Crowd Levels</span>
                      <span className="px-2 py-0.5 rounded bg-amber-500 text-white text-[8px] font-sans font-bold uppercase tracking-wider animate-pulse">Live</span>
                    </h4>
                    
                    {/* Simulated crowd index bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-[11px] font-bold">
                        <span className="text-slate-500">Current Occupancy Index</span>
                        <span className="text-amber-600 dark:text-amber-400">{activeDest.details.crowd.currentLevel} (45% capacity)</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 dark:bg-white/[0.04] rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: '45%' }} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2 text-[11px] leading-relaxed">
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Best Visiting Hours</span>
                        <ul className="list-disc pl-4 text-slate-500 dark:text-slate-400">
                          {activeDest.details.crowd.bestHours.map((h, i) => <li key={i}>{h}</li>)}
                        </ul>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Peak Congestion Days</span>
                        <ul className="list-disc pl-4 text-slate-500 dark:text-slate-400">
                          {activeDest.details.crowd.peakDays.map((d, i) => <li key={i}>{d}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Weather Widget */}
                  <div className="p-5 rounded-2xl border border-slate-100 dark:border-white/[0.04] space-y-4 text-xs text-left">
                    <h4 className="font-heading text-xs font-black uppercase tracking-widest text-slate-850 dark:text-slate-300 flex items-center gap-1">
                      <CloudSun size={12} className="text-blue-500" /> Current Weather Forecast
                    </h4>
                    <div className="flex justify-between items-center bg-slate-50/50 dark:bg-white/[0.005] p-3 rounded-xl border border-slate-100/50 dark:border-white/[0.02]">
                      <div className="space-y-1">
                        <span className="text-2xl font-heading font-black text-slate-850 dark:text-white">{activeDest.details.weather.temp}</span>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-light">{activeDest.details.weather.current}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-right font-light">
                        <div>
                          <span className="text-slate-400 block">Humidity</span>
                          <span className="font-bold text-slate-700 dark:text-slate-300">{activeDest.details.weather.humidity}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Heat Index</span>
                          <span className="font-bold text-slate-700 dark:text-slate-300">{activeDest.details.weather.heatIndex}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Rain Chance</span>
                          <span className="font-bold text-slate-700 dark:text-slate-300">{activeDest.details.weather.rain}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Wind NW</span>
                          <span className="font-bold text-slate-700 dark:text-slate-300">{activeDest.details.weather.wind}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Travel Costs */}
                  <div className="p-5 rounded-2xl border border-slate-100 dark:border-white/[0.04] space-y-4 text-xs text-left">
                    <h4 className="font-heading text-xs font-black uppercase tracking-widest text-slate-850 dark:text-slate-300 flex items-center gap-1.5">
                      <DollarSign size={12} className="text-rose-500" />
                      Estimated Travel Budget
                    </h4>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.01] border border-slate-100 dark:border-white/[0.03]">
                        <span className="text-[9px] text-slate-400 block">Economy / Low</span>
                        <span className="font-bold text-slate-800 dark:text-slate-350">{activeDest.details.costs.low}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.01] border border-slate-100 dark:border-white/[0.03]">
                        <span className="text-[9px] text-slate-400 block">Standard / Med</span>
                        <span className="font-bold text-slate-800 dark:text-slate-350">{activeDest.details.costs.medium}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.01] border border-slate-100 dark:border-white/[0.03]">
                        <span className="text-[9px] text-slate-400 block">Premium / Lux</span>
                        <span className="font-bold text-slate-800 dark:text-slate-350">{activeDest.details.costs.luxury}</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-450 dark:text-slate-500 font-light font-body text-center">
                      Average per-day spending including local lodging, halal/veg food, and local transit: <strong>{activeDest.details.costs.perDay}</strong>
                    </p>
                  </div>

                  {/* Transportation & Access */}
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.01] border border-slate-100 dark:border-white/[0.04] space-y-4 text-xs text-left font-light leading-relaxed">
                    <h4 className="font-heading text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                      Transit Coordinates & Logistics
                    </h4>
                    <div className="space-y-3 font-body">
                      <div>
                        <strong className="text-slate-750 dark:text-slate-300 block text-[10px] uppercase font-heading">Nearest Airport</strong>
                        <p>{activeDest.details.transportation.airport}</p>
                      </div>
                      <div>
                        <strong className="text-slate-750 dark:text-slate-300 block text-[10px] uppercase font-heading">Metro Links</strong>
                        <p>{activeDest.details.transportation.metro}</p>
                      </div>
                      <div>
                        <strong className="text-slate-750 dark:text-slate-300 block text-[10px] uppercase font-heading">Shuttle Buses</strong>
                        <p>{activeDest.details.transportation.bus}</p>
                      </div>
                      <div>
                        <strong className="text-slate-750 dark:text-slate-300 block text-[10px] uppercase font-heading">Parking Grounds</strong>
                        <p>{activeDest.details.transportation.parking}</p>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* ─── TAB 5: AI COMPANION ─── */}
              {drawerTab === 'companion' && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* AI Assistant Chat Box interface */}
                  <div className="border border-slate-100 dark:border-white/[0.04] rounded-2xl overflow-hidden flex flex-col bg-slate-50/50 dark:bg-white/[0.005] h-96">
                    {/* Chat Area */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar text-xs">
                      {chatMessages.map((msg, idx) => (
                        <div 
                          key={idx} 
                          className={`flex gap-3 max-w-[85%] ${
                            msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto text-left'
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center font-bold ${
                            msg.sender === 'user' ? 'bg-amber-500 text-white' : 'bg-indigo-500 text-white'
                          }`}>
                            {msg.sender === 'user' ? <User size={12} /> : <Sparkles size={12} />}
                          </div>
                          <div className={`p-3 rounded-2xl leading-relaxed ${
                            msg.sender === 'user'
                              ? 'bg-amber-500 text-white rounded-tr-none'
                              : 'bg-slate-100 dark:bg-white/[0.03] text-slate-800 dark:text-slate-300 rounded-tl-none border border-slate-200/50 dark:border-white/[0.02]'
                          }`}>
                            <p className="font-body font-light">{msg.text}</p>
                          </div>
                        </div>
                      ))}

                      {isTyping && (
                        <div className="flex gap-3 max-w-[85%] mr-auto text-left">
                          <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center bg-indigo-500 text-white font-bold">
                            <Sparkles size={12} />
                          </div>
                          <div className="p-3 rounded-2xl bg-slate-100 dark:bg-white/[0.03] text-slate-400 rounded-tl-none border border-slate-200/50 dark:border-white/[0.02]">
                            <span className="animate-pulse">Typing guide response...</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Chat Input form */}
                    <form 
                      onSubmit={handleCustomQuestionSubmit}
                      className="p-3 border-t border-slate-100 dark:border-white/[0.04] bg-white dark:bg-[#071125] flex gap-2"
                    >
                      <input
                        type="text"
                        placeholder="Ask me dress rules, prayer times, hotel info..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        disabled={isTyping}
                        className="flex-1 bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-amber-500 text-slate-800 dark:text-white"
                      />
                      <button 
                        type="submit"
                        disabled={isTyping}
                        className="px-4 py-2 rounded-xl bg-amber-500 text-white font-heading text-[10px] font-bold uppercase tracking-wider transition-colors hover:bg-amber-600 disabled:opacity-50 cursor-pointer"
                      >
                        Send
                      </button>
                    </form>
                  </div>

                  {/* Sample AI Questions */}
                  <div className="space-y-2">
                    <span className="font-bold text-slate-450 dark:text-slate-500 uppercase text-[9px] tracking-wider block text-left">Suggested Q&A Queries</span>
                    <div className="flex flex-wrap gap-2 text-[10px]">
                      {activeDest.details.aiAssistant.map((qa, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSampleQuestion(qa.q, qa.a)}
                          disabled={isTyping}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.04] hover:border-amber-500 text-slate-650 dark:text-slate-350 text-left transition-colors cursor-pointer"
                        >
                          {qa.q}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Nearby food and hotels */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-slate-100 dark:border-white/[0.03] space-y-2 text-xs">
                      <span className="font-bold text-slate-850 dark:text-slate-300 uppercase text-[9px] tracking-wider block flex items-center gap-1">
                        <Utensils size={10} className="text-amber-500" /> Nearby Restaurants
                      </span>
                      <div className="space-y-2">
                        {activeDest.details.foodNearby.map((food, i) => (
                          <div key={i} className="text-[11px]">
                            <span className="font-bold text-slate-800 dark:text-white block">{food.name}</span>
                            <span className="text-slate-400 dark:text-slate-500 block text-[9px] uppercase font-mono">{food.type}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-100 dark:border-white/[0.03] space-y-2 text-xs">
                      <span className="font-bold text-slate-850 dark:text-slate-300 uppercase text-[9px] tracking-wider block flex items-center gap-1">
                        <Landmark size={10} className="text-indigo-500" /> Nearby Hotels
                      </span>
                      <div className="space-y-2">
                        {activeDest.details.hotelsNearby.map((hotel, i) => (
                          <div key={i} className="text-[11px]">
                            <span className="font-bold text-slate-800 dark:text-white block">{hotel.name}</span>
                            <span className="text-slate-400 dark:text-slate-500 block text-[9px] uppercase">{hotel.type} — <strong>{hotel.price}</strong></span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* FAQ Accordion */}
                  <div className="border border-slate-100 dark:border-white/[0.04] rounded-2xl overflow-hidden">
                    <button 
                      onClick={() => toggleAccordion('faq')}
                      className="w-full p-4 flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.01] text-left cursor-pointer"
                    >
                      <h4 className="font-heading text-xs font-black uppercase tracking-widest text-slate-850 dark:text-slate-300">
                        Frequently Asked Questions (FAQ)
                      </h4>
                      <ChevronDown size={14} className={`transform transition-transform ${openAccordions.faq ? 'rotate-180' : ''}`} />
                    </button>
                    {openAccordions.faq && (
                      <div className="p-5 border-t border-slate-100 dark:border-white/[0.04] space-y-4 text-xs font-light leading-relaxed">
                        {activeDest.details.faq.map((fq, idx) => (
                          <div key={idx} className="space-y-1">
                            <span className="font-bold text-slate-800 dark:text-white block font-heading text-[11px]">{fq.q}</span>
                            <p className="text-slate-550 dark:text-slate-400 font-body">{fq.a}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Dynamic YouTube Travel & Sacred Video Section */}
                  <div className="pt-6 border-t border-slate-200/50 dark:border-white/[0.04]">
                    <YouTubeTravelSection 
                      destination={activeDest.name} 
                      category="religious"
                      title={`▶️ Sacred ${activeDest.name} 4K Experience`}
                      subtitle={`Explore verified 4K walking tours, documentaries, and sacred highlights of ${activeDest.name}.`}
                    />
                  </div>

                  {/* Download Section */}
                  <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-white/10 space-y-2.5 text-xs text-left">
                    <span className="font-bold text-slate-850 dark:text-slate-300 uppercase text-[9px] tracking-wider block flex items-center gap-1">
                      <FileDown size={10} className="text-amber-500" /> Download Offline Guides
                    </span>
                    <div className="space-y-2">
                      {activeDest.details.downloads.map((d, i) => (
                        <div key={i} className="flex justify-between items-center text-[11px] py-1 border-b border-slate-100/50 dark:border-white/[0.02]">
                          <span className="text-slate-650 dark:text-slate-350">{d}</span>
                          <button className="text-[10px] font-bold text-amber-500 uppercase hover:underline cursor-pointer">
                            Download
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
