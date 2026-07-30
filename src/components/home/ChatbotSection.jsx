import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Wallet,
  Search,
  MessageCircle,
  Package,
  Shield,
  Bot,
  Send,
  User,
  Sparkles,
  ArrowRight,
  Globe,
  Wifi,
  Battery,
  Signal,
  Compass,
  Hotel,
  Palmtree,
  Mountain,
  DollarSign,
  Sun,
  ChevronRight,
  CheckCheck,
  Droplet,
  Star
} from 'lucide-react';
import { chatbotFeatures } from '../../data';

const featureIconMap = {
  MapPin,
  Wallet,
  Search,
  MessageCircle,
  Package,
  Shield,
};

export default function ChatbotSection() {
  const navigate = useNavigate();

  return (
    <section className="section-padding bg-[var(--bg-primary)] border-t border-[var(--border)] relative overflow-hidden transition-colors duration-500">
      
      {/* Background glowing gradients */}
      <div 
        className="absolute inset-0 bg-radial-glow pointer-events-none opacity-25 dark:opacity-20"
        style={{ background: 'radial-gradient(circle at right, rgba(249, 115, 22, 0.04) 0%, transparent 60%)' }} 
      />
      <div 
        className="absolute right-0 top-1/4 w-96 h-96 bg-[var(--accent)]/5 rounded-full blur-[120px] pointer-events-none z-0" 
      />

      <div className="max-w-7xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* ─── Left Side: Content ─── */}
          <div className="lg:col-span-7 text-left space-y-6">
            
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--accent)] text-[10px] font-bold uppercase tracking-[0.2em]">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>World's First AI Guide</span>
            </div>

            {/* Title Head */}
            <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-normal leading-[1.1] text-luxury-primary dark:text-white tracking-tight">
              AI Travel <span className="italic font-light text-[var(--accent)] dark:text-slate-400">Chatbot.</span>
            </h2>

            {/* Subhead text */}
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base font-light max-w-xl font-body leading-relaxed">
              Your intelligent travel companion that knows every hidden gem, saves you money, and plans the perfect trip—just for you.
            </p>

            {/* Capabilities modular cards */}
            <div className="grid sm:grid-cols-2 gap-4 pt-4">
              {chatbotFeatures.map((feat, index) => {
                const IconComp = featureIconMap[feat.icon];
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-5 rounded-[24px] bg-white/40 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/[0.05] hover:bg-white/75 dark:hover:bg-white/[0.04] hover:-translate-y-1 hover:shadow-premium hover:border-[var(--accent)]/20 transition-all duration-300 text-left select-none group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/5 border border-slate-200/65 dark:border-white/10 flex items-center justify-center shrink-0 text-blue-600 dark:text-blue-400 shadow-sm">
                        {IconComp && <IconComp className="w-4.5 h-4.5" />}
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-heading text-sm font-bold text-luxury-primary dark:text-white">
                          {feat.title}
                        </h4>
                        <p className="text-slate-500 dark:text-slate-400 text-xs font-light font-body leading-normal">
                          {feat.title === 'Packing Suggestions' ? 'Smart packing lists and weather-based reminders' : feat.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors shrink-0 ml-2" />
                  </div>
                );
              })}
            </div>

            {/* CTA Trigger + Reviews */}
            <div className="pt-2 flex flex-wrap items-center gap-6">
              <button 
                onClick={() => navigate('/trip-ai')}
                className="btn-sunset px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-premium shrink-0"
              >
                <span>Launch Assistant Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3">
                {/* Avatars */}
                <div className="flex -space-x-2.5">
                  <img className="w-7 h-7 rounded-full border border-white dark:border-[#020813] object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&auto=format&q=60" alt="Traveler" />
                  <img className="w-7 h-7 rounded-full border border-white dark:border-[#020813] object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&fit=crop&auto=format&q=60" alt="Traveler" />
                  <img className="w-7 h-7 rounded-full border border-white dark:border-[#020813] object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&fit=crop&auto=format&q=60" alt="Traveler" />
                  <img className="w-7 h-7 rounded-full border border-white dark:border-[#020813] object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&fit=crop&auto=format&q=60" alt="Traveler" />
                </div>
                {/* Stars and text */}
                <div className="text-left leading-none space-y-1">
                  <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 block">Loved by 10,000+ travelers</span>
                  <div className="flex items-center gap-1.5">
                    <div className="flex text-emerald-500">
                      <Star className="w-2.5 h-2.5 fill-current" />
                      <Star className="w-2.5 h-2.5 fill-current" />
                      <Star className="w-2.5 h-2.5 fill-current" />
                      <Star className="w-2.5 h-2.5 fill-current" />
                      <Star className="w-2.5 h-2.5 fill-current" />
                    </div>
                    <span className="text-[9px] text-slate-500 dark:text-slate-400 font-bold">4.9/5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Right Side: Glassmorphism Phone & Floating Widgets ─── */}
          <div className="lg:col-span-5 flex justify-center w-full relative z-10">
            
            {/* Deep glow backdrop */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-[var(--accent)]/10 to-purple-650/10 blur-[60px] rounded-full scale-75 animate-pulse-glow" />

            <div className="relative mt-8 lg:mt-0 select-none">
              
              {/* Overlapping Floating Widget 1: Left Card (Frosted Glassmorphism Weather Widget) */}
              <div className="absolute -left-28 top-[25%] z-30 hidden lg:flex flex-col p-4 w-[140px] rounded-3xl backdrop-blur-md bg-white/70 dark:bg-slate-900/75 border border-white/40 dark:border-white/[0.08] shadow-[0_15px_45px_rgba(0,0,0,0.08)] dark:shadow-[0_25px_55px_rgba(0,0,0,0.45)] text-left animate-float" style={{ animationDelay: '500ms' }}>
                <span className="text-[10px] font-bold text-slate-900 dark:text-white font-heading">Bali, Indonesia</span>
                
                <div className="flex items-center gap-2 mt-2">
                  <Sun className="w-6 h-6 text-amber-500 animate-spin-slow shrink-0" />
                  <div>
                    <span className="text-xl font-extrabold text-slate-900 dark:text-white leading-none block">28°</span>
                    <span className="text-[9px] text-slate-400 dark:text-slate-400 font-light block mt-0.5">Sunny</span>
                  </div>
                </div>

                <div className="h-px bg-slate-250/60 dark:bg-white/[0.06] my-3" />

                <div className="space-y-2.5">
                  <div className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1" />
                    <div>
                      <span className="text-[8px] text-slate-400 block font-light leading-none">Air Quality</span>
                      <span className="text-[9px] font-bold text-slate-800 dark:text-slate-200 block mt-0.5">Good</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Droplet className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[8px] text-slate-400 block font-light leading-none">Humidity</span>
                      <span className="text-[9px] font-bold text-slate-800 dark:text-slate-200 block mt-0.5">60%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Overlapping Floating Widget 2: Right Card (Frosted Obsidian Glassmorphism Code Widget) */}
              <div className="absolute -right-36 top-[10%] z-30 hidden lg:flex flex-col p-4 rounded-3xl bg-slate-950/85 dark:bg-[#040914]/90 border border-white/10 dark:border-white/[0.06] shadow-[0_20px_50px_rgba(0,0,0,0.25)] dark:shadow-[0_30px_65px_rgba(0,0,0,0.6)] backdrop-blur-xl w-[220px] animate-float" style={{ animationDelay: '0ms' }}>
                
                {/* File Header Tab */}
                <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-white/[0.06] text-left">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-[8px] font-mono text-slate-450 dark:text-slate-455 ml-1.5 uppercase font-bold tracking-wider">route_optimizer.py</span>
                  </div>
                </div>

                {/* Code Block */}
                <div className="font-mono text-[9px] text-left space-y-1.5 leading-relaxed text-slate-300">
                  <div>
                    <span className="text-blue-400 font-semibold">def </span>
                    <span className="text-emerald-400">optimize_route</span>(trip):
                  </div>
                  <div className="pl-3.5">
                    destinations = trip.places
                  </div>
                  <div className="pl-3.5">
                    budget = trip.budget
                  </div>
                  <div className="pl-3.5">
                    route = AI.optimize(destinations, budget)
                  </div>
                  <div className="pl-3.5">
                    <span className="text-pink-400">return </span>
                    route
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3.5 pt-2.5 border-t border-white/[0.06] space-y-1.5">
                  <div className="flex items-center justify-between text-[7.5px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest">
                    <span>AI Efficiency</span>
                    <span className="text-emerald-400">98.6%</span>
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full w-[98.6%]" />
                  </div>
                </div>
              </div>

              {/* Overlapping Floating Widget 3: Bottom Right Glass capsule */}
              <div className="absolute -right-20 bottom-[10%] z-30 hidden lg:flex flex-col p-4 rounded-3xl bg-white/70 dark:bg-slate-900/75 border border-white/40 dark:border-white/[0.08] shadow-[0_15px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] backdrop-blur-xl w-[150px] text-left animate-float" style={{ animationDelay: '1000ms' }}>
                <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/35 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2">
                  <Shield className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-[10px] font-bold text-slate-900 dark:text-white leading-tight">Travel Safe, Always</h4>
                <p className="text-[8px] text-slate-500 dark:text-slate-400 font-light mt-0.5 leading-normal">24/7 support wherever you go.</p>
                <div className="mt-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-[8px] font-bold text-blue-600 dark:text-blue-400 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-950/60 transition-colors">
                  <span>We're here for you</span>
                  <ArrowRight className="w-2 h-2" />
                </div>
              </div>

              {/* Glassmorphism Phone Frame */}
              <div className="w-[285px] sm:w-[315px] rounded-[48px] p-2 bg-white/20 dark:bg-white/5 border border-white/30 dark:border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_30px_70px_rgba(0,0,0,0.5)] backdrop-blur-xl relative">
                
                {/* Screen Container */}
                <div className="rounded-[40px] overflow-hidden bg-slate-50/90 dark:bg-[#070e1b]/95 border border-white/15 dark:border-white/5 flex flex-col relative h-[510px] z-10 shadow-inner">
                  
                  {/* Status Bar */}
                  <div className="px-5 pt-3.5 pb-1 flex items-center justify-between z-30 select-none text-slate-800 dark:text-white/90">
                    <span className="text-[9px] font-bold font-mono tracking-tight">9:41</span>
                    
                    {/* Dynamic Island Notch */}
                    <div className="w-20 h-4.5 bg-black rounded-full flex items-center justify-center relative z-30 select-none shadow-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-900 border border-white/10 absolute right-4" />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Signal className="w-2.5 h-2.5" />
                      <Wifi className="w-2.5 h-2.5" />
                      <Battery className="w-3 h-3" />
                    </div>
                  </div>

                  {/* App Header inside Mockup */}
                  <div className="px-5 py-3 bg-white/40 dark:bg-[#070e1b]/40 backdrop-blur-md border-b border-slate-200/50 dark:border-white/5 flex items-center justify-between text-left relative z-20">
                    <div className="flex items-center gap-2">
                      <div className="w-5.5 h-5.5 rounded-full bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                        <Bot className="w-3 h-3" />
                      </div>
                      <span className="text-slate-900 dark:text-white font-extrabold tracking-tight text-[11px] font-heading">TripReady AI</span>
                    </div>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  </div>

                  {/* Circular Tabs / Quick Filter Buttons */}
                  <div className="px-5 pt-3 pb-2 flex items-center justify-between gap-1.5 relative z-20 select-none">
                    {/* Tab 1 - Active with Compass and Blue circle */}
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md cursor-pointer transform hover:scale-105 transition-all">
                      <Compass className="w-3.5 h-3.5" />
                    </div>
                    {/* Tab 2 */}
                    <div className="w-7 h-7 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-455 dark:text-slate-400 flex items-center justify-center cursor-pointer hover:bg-slate-100 dark:hover:bg-white/10 transition-all">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    {/* Tab 3 */}
                    <div className="w-7 h-7 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-455 dark:text-slate-400 flex items-center justify-center cursor-pointer hover:bg-slate-100 dark:hover:bg-white/10 transition-all">
                      <Palmtree className="w-3.5 h-3.5" />
                    </div>
                    {/* Tab 4 */}
                    <div className="w-7 h-7 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-455 dark:text-slate-400 flex items-center justify-center cursor-pointer hover:bg-slate-100 dark:hover:bg-white/10 transition-all">
                      <Search className="w-3.5 h-3.5" />
                    </div>
                    {/* Tab 5 */}
                    <div className="w-7 h-7 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-455 dark:text-slate-400 flex items-center justify-center cursor-pointer hover:bg-slate-100 dark:hover:bg-white/10 transition-all">
                      <Package className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Conversation area */}
                  <div className="flex-1 p-3.5 space-y-3 overflow-y-auto no-scrollbar text-[9.5px] text-left leading-relaxed relative z-20">
                    
                    {/* User Message Bubble */}
                    <div className="flex flex-col items-end gap-1 animate-fade-in">
                      <div className="max-w-[85%] rounded-[16px] rounded-tr-[3px] px-3.5 py-2 bg-blue-600 text-white shadow-sm font-body">
                        Plan a 5-day trip to Bali
                      </div>
                      <div className="flex items-center gap-1 text-[7.5px] text-slate-400 mr-1 select-none">
                        <span>9:41 AM</span>
                        <CheckCheck className="w-3 h-3 text-blue-500" />
                      </div>
                    </div>

                    {/* Itinerary AI Card */}
                    <div className="flex justify-start animate-fade-in">
                      <div className="max-w-[95%] rounded-[18px] rounded-tl-[3px] p-3.5 bg-white dark:bg-white/[0.04] border border-slate-200/60 dark:border-white/[0.08] shadow-[0_4px_16px_rgba(0,0,0,0.02)] space-y-2.5 text-slate-800 dark:text-slate-250 font-body">
                        
                        <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-white/[0.03]">
                          <Compass className="w-3.5 h-3.5 text-blue-500 animate-spin-slow" />
                          <span className="font-heading font-extrabold text-[9.5px] text-slate-900 dark:text-white uppercase tracking-wider">Your Itinerary</span>
                        </div>

                        {/* Itinerary items */}
                        <div className="space-y-2.5 text-[9px]">
                          <div className="flex items-start gap-2.5">
                            <div className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                              <span className="text-[8px] font-bold">1</span>
                            </div>
                            <div>
                              <strong className="text-slate-900 dark:text-white block font-heading">Ubud Sanctuary</strong>
                              <span className="text-slate-500 dark:text-slate-400 font-light block mt-0.5 leading-tight">Sacred temples & spa pools.</span>
                            </div>
                          </div>

                          <div className="flex items-start gap-2.5">
                            <div className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                              <span className="text-[8px] font-bold">2</span>
                            </div>
                            <div>
                              <strong className="text-slate-900 dark:text-white block font-heading">Coastal Serenity</strong>
                              <span className="text-slate-500 dark:text-slate-400 font-light block mt-0.5 leading-tight">Relaxing beach sands & fine dining.</span>
                            </div>
                          </div>

                          <div className="flex items-start gap-2.5">
                            <div className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                              <span className="text-[8px] font-bold">3</span>
                            </div>
                            <div>
                              <strong className="text-slate-900 dark:text-white block font-heading">Nusa Penida Adventure</strong>
                              <span className="text-slate-500 dark:text-slate-400 font-light block mt-0.5 leading-tight">Island cliffs, turquoise bays & viewpoints.</span>
                            </div>
                          </div>
                        </div>

                        {/* Cost panel */}
                        <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-950/40 flex items-center justify-between text-[8px] font-bold text-emerald-600 dark:text-emerald-455 leading-none">
                          <span>Est. Cost for 2 People</span>
                          <span>$1,850</span>
                        </div>

                      </div>
                    </div>

                  </div>

                  {/* Chat input */}
                  <div className="mx-3.5 mb-3.5 p-2 bg-white dark:bg-[#070e1b]/90 border border-slate-200 dark:border-white/5 rounded-2xl flex items-center gap-2 relative z-20 shadow-sm">
                    <input
                      type="text"
                      placeholder="Ask me anything about your trip..."
                      className="flex-1 bg-transparent px-2 text-[9px] text-slate-800 dark:text-white placeholder-slate-400 outline-none font-body"
                      readOnly
                    />
                    <button className="w-5.5 h-5.5 rounded-full bg-blue-600 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all">
                      <Send className="w-2.5 h-2.5" />
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Featured In Logos */}
        <div className="mt-16 pt-8 border-t border-[var(--border)] w-full flex flex-wrap items-center justify-center lg:justify-between gap-6 text-slate-400 dark:text-slate-550 text-xs select-none">
          <span className="text-[10px] uppercase tracking-wider font-semibold">Featured in</span>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 font-heading font-extrabold text-sm tracking-tight">
            <span className="hover:text-slate-600 dark:hover:text-slate-400 transition-colors">Forbes</span>
            <span className="hover:text-slate-600 dark:hover:text-slate-400 transition-colors font-mono">TechCrunch</span>
            <span className="hover:text-slate-600 dark:hover:text-slate-400 transition-colors">Business Insider</span>
            <span className="hover:text-slate-600 dark:hover:text-slate-400 transition-colors tracking-widest">WIRED</span>
          </div>
        </div>
      </div>
    </section>
  );
}
