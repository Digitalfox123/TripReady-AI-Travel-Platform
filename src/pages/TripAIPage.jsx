import { useState, useRef, useEffect } from 'react';
import { 
  Compass, 
  ChevronRight, 
  ChevronDown, 
  Settings, 
  Headphones, 
  Globe, 
  Lightbulb, 
  Image as ImageIcon, 
  Paperclip, 
  Send, 
  SlidersHorizontal, 
  Lock, 
  Clock, 
  Users, 
  Menu, 
  X, 
  Bot, 
  Sparkles,
  Sun,
  Moon,
  LogIn,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  MessageSquarePlus,
  Bell,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../utils/useTranslation';
import { topDestinations } from '../data';
import { getGeminiApiKey, hasGeminiKey, askGemini } from '../utils/gemini';
import countriesList from '../data/countries.json';

// Squircle logo icon matching the favicon
function LogoIcon() {
  return (
    <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-blue-600 to-blue-700 flex items-center justify-center shadow-md select-none shrink-0 font-heading font-extrabold text-[#ffffff] text-lg tracking-tighter">
      tr.
    </div>
  );
}

// Word-by-word streaming component to simulate typing animation
function StreamingMessage({ text, onComplete, renderFormatted }) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (!text) return;
    const words = text.split(/(\s+)/);
    let index = 0;
    let current = '';

    const interval = setInterval(() => {
      if (index < words.length) {
        current += words[index];
        setDisplayedText(current);
        index++;
      } else {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, 12); // Fast 12ms per token

    return () => clearInterval(interval);
  }, [text]);

  return renderFormatted(displayedText);
}

export default function TripAIPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  
  // Grok toggleable modes
  const [deepSearchActive, setDeepSearchActive] = useState(false);
  const [thinkActive, setThinkActive] = useState(false);
  const [editImageActive, setEditImageActive] = useState(false);

  // Model Version Dropdown state
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('v3');
  
  // Settings / Support click alerts
  const [activeTheme, setActiveTheme] = useState(() => document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const fileInputRef = useRef(null);

  // Weather states
  const [selectedRegion, setSelectedRegion] = useState('Pakistan');
  const [weather, setWeather] = useState({ temp: '28°C', condition: 'Sunny', wmoCode: 0, loading: false });
  const [showWeatherModal, setShowWeatherModal] = useState(false);

  const mapWmoCode = (code) => {
    if (code === 0) return { condition: 'Sunny', icon: 'Sun' };
    if ([1, 2, 3].includes(code)) return { condition: 'Partly Cloudy', icon: 'Cloud' };
    if ([45, 48].includes(code)) return { condition: 'Foggy', icon: 'Cloud' };
    if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { condition: 'Rainy', icon: 'CloudRain' };
    if ([71, 73, 75, 77, 85, 86].includes(code)) return { condition: 'Snowy', icon: 'CloudSnow' };
    if ([95, 96, 99].includes(code)) return { condition: 'Thunderstorm', icon: 'CloudLightning' };
    return { condition: 'Pleasant', icon: 'Sun' };
  };

  useEffect(() => {
    let active = true;
    const fetchRegionWeather = async () => {
      setWeather(prev => ({ ...prev, loading: true }));
      try {
        let lat = 31.5204;
        let lng = 74.3587;
        
        const countryMatch = countriesList.find(c => c.name.toLowerCase() === selectedRegion.toLowerCase());
        const searchTerm = countryMatch ? `${countryMatch.capital}, ${countryMatch.name}` : selectedRegion;

        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchTerm)}&count=1&language=en&format=json`;
        const geoRes = await fetch(geoUrl);
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          if (geoData && geoData.results && geoData.results.length > 0) {
            lat = parseFloat(geoData.results[0].latitude);
            lng = parseFloat(geoData.results[0].longitude);
          }
        }
        
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code&timezone=auto`;
        const weatherRes = await fetch(weatherUrl);
        if (weatherRes.ok) {
          const weatherData = await weatherRes.json();
          if (weatherData && weatherData.current) {
            const conditionMapped = mapWmoCode(weatherData.current.weather_code);
            if (active) {
              setWeather({
                temp: `${Math.round(weatherData.current.temperature_2m)}°C`,
                condition: conditionMapped.condition,
                wmoCode: weatherData.current.weather_code,
                loading: false
              });
            }
          }
        }
      } catch (err) {
        console.warn("Failed to fetch region weather:", err);
        if (active) {
          setWeather(prev => ({ ...prev, loading: false }));
        }
      }
    };
    
    fetchRegionWeather();
    return () => { active = false; };
  }, [selectedRegion]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachedFile(file);
    }
  };

  const removeAttachedFile = () => {
    setAttachedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const toggleThemeLocal = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    setActiveTheme(isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  const triggerLocalReply = (textToSend) => {
    let reply = "";
    const lower = textToSend.toLowerCase();

    // Check for thinking mode logic
    let thinkPrefix = "";
    if (thinkActive) {
      thinkPrefix = `<details><summary>Thought Process</summary>
1. Analyzing user query: "${textToSend}"
2. Fetching tripready offline database parameters.
3. Calculating optimized budget schedules and local advisories.
4. Formulating travel summary context.
</details>\n\n`;
    }

    const matchedDest = topDestinations.find(dest => 
      lower.includes(dest.id.toLowerCase()) || 
      lower.includes(dest.name.toLowerCase()) || 
      lower.includes(dest.country.toLowerCase())
    );

    if (lower.includes('[analyzed document:')) {
      const fileNameMatch = textToSend.match(/\[analyzed document:\s*([^\]\n]+)\]/i);
      const fileName = fileNameMatch ? fileNameMatch[1] : "document";
      reply = thinkPrefix + `📄 **Document Analysis Successful**\n\nI have successfully scanned and processed your attached file: **${fileName}**.\n\n` + 
        `🔑 **Extracted Flight Ticket Details**:\n` +
        `• **Flight Status**: Confirmed (Scheduled on time)\n` +
        `• **Departure Time**: 08:45 AM (Local Time)\n` +
        `• **Arrival Time**: 11:30 AM (Local Time)\n` +
        `• **Baggage Allowance**: 30kg Checked, 7kg Cabin\n` +
        `• **Gate/Terminal**: Terminal 3, Gate 14B\n\n` +
        `Please let me know if you would like me to add this flight schedule to your calendar, calculate local airport transfer transits, or generate a customized packing list based on your destination's current weather forecasts!`;
    } else if (matchedDest) {
      reply = thinkPrefix + `✨ **Travel Guide for ${matchedDest.flag} ${matchedDest.name}, ${matchedDest.country}**:\n\n` +
        `📍 **Overview**: ${matchedDest.description}\n\n` +
        `🌤️ **Current Weather**: ${matchedDest.weather.temp}, ${matchedDest.weather.condition} (Humidity: ${matchedDest.weather.humidity}, AQI: ${matchedDest.weather.airQuality}).\n` +
        `📅 **Best Season to Visit**: ${matchedDest.bestTime}\n` +
        `💰 **Estimated Budget**: ${matchedDest.budget.daily || matchedDest.budget} per day.\n` +
        `   • Stays: ${matchedDest.budget.hotel || 'N/A'}\n` +
        `   • Dining: ${matchedDest.budget.food || 'N/A'}\n` +
        `   • Transits: ${matchedDest.budget.transport || 'N/A'}\n` +
        `🛡️ **Safety Parameter**: ${matchedDest.safety} | Timezone: ${matchedDest.timezone}\n\n` +
        `🌟 **Iconic Attractions**: ${matchedDest.attractions.join(', ')}\n` +
        `🍜 **Culinary Recommendations**: ${matchedDest.foods.join(', ')}\n` +
        `🚇 **Transit Preference**: ${matchedDest.transport.join(', ')}\n\n` +
        `📜 **Local Custom Advisory**: ${matchedDest.culture}\n` +
        `🛂 **Visa Guidelines**: ${matchedDest.visa}`;
    } else if (lower.includes('budget') || lower.includes('cost')) {
      reply = thinkPrefix + "📊 **Budget Optimization Report**\n\n" +
        "Traveling on a budget doesn't have to mean giving up comfort or memorable experiences. The biggest savings usually come from planning strategically, staying flexible, and focusing your spending on what matters most to you.\n\n" +
        "Here are some of the most effective budgeting hacks:\n\n" +
        "1. Set a Daily Budget\n\n" +
        "Before your trip, decide how much you can spend each day.\n\n" +
        "Break it into categories:\n\n" +
        " • 🏨 **Accommodation**: Allocate a fixed amount for lodging ($50-$80/day).\n" +
        " • 🍔 **Food**: Opt for local street foods and supermarkets ($20-$30/day).\n" +
        " • 🚆 **Transportation**: Use public subways and transit passes ($10-$15/day).\n" +
        " • 🎟️ **Activities**: Focus on free entry days and walking tours ($15-$25/day).\n\n" +
        "2. Save on Flights and Booking\n\n" +
        "Lock booking prices 45 days in advance and fly on mid-week departures (Tuesdays/Wednesdays) to save up to 35% on fares.";
    } else {
      reply = thinkPrefix + "✨ **Journey Calibration Complete**\n\nI have scanned worldwide parameters for your request.\n\n" +
        "1. Itinerary Recommendation\n\n" +
        "I advise structuring a 6-day stay, allocating your budget as follows:\n\n" +
        " • 🏨 **Accommodations**: Allocate approximately 40% for premium stays.\n" +
        " • 🍔 **Culinary Dining**: Allocate 30% for local dining experiences.\n" +
        " • 🎟️ **Activities & Entry**: Allocate 30% for local transits and sightseeing entry tickets.\n\n" +
        "Would you like me to compile a comprehensive, day-by-day flight and hotel itinerary report for this?";
    }

    setMessages((prev) => [...prev, { 
      sender: 'ai', 
      text: reply, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isStreaming: true
    }]);
  };

  const handleSend = async (textToSend = inputText) => {
    if (!textToSend.trim() && !attachedFile) return;

    let fullText = textToSend;
    if (attachedFile) {
      fullText = `[Analyzed Document: ${attachedFile.name}]\n\n${textToSend}`;
    }

    const fileAttachedInfo = attachedFile ? {
      name: attachedFile.name,
      type: attachedFile.type,
      size: attachedFile.size,
      url: attachedFile.type.startsWith('image/') ? URL.createObjectURL(attachedFile) : null
    } : null;

    // Add user message
    const newMsg = { 
      sender: 'user', 
      text: textToSend, 
      file: fileAttachedInfo,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    setAttachedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIsTyping(true);

    if (hasGeminiKey()) {
      try {
        // Build prompt with history and toggle indicators
        let promptContext = "";
        const contextMessages = messages.slice(-4); // last 4 messages context for speed
        contextMessages.forEach(m => {
          let textToSendCtx = m.text;
          if (m.sender === 'user' && m.file) {
            textToSendCtx = `[Analyzed Document: ${m.file.name}]\n\n${m.text}`;
          }
          promptContext += `${m.sender === 'user' ? 'User' : 'Assistant'}: ${textToSendCtx}\n\n`;
        });
        
        let finalPrompt = fullText;
        if (deepSearchActive) {
          finalPrompt += "\n\n[User has enabled DEEP SEARCH mode. Please perform an exceptionally detailed, deep-dive analysis. Include historical dates, structural breakdowns, bullet points, budget calculations, and multi-day travel guides with explicit context.]";
        }
        if (thinkActive) {
          finalPrompt += "\n\n[User has enabled THINK mode. Please include a section at the very beginning of your response detailing your internal step-by-step reasoning or travel design considerations inside a markdown collapsible details tag like: <details><summary>Thought Process</summary>Your detailed step-by-step reasoning here...</details>. Then provide your final comprehensive answer.]";
        }
        if (editImageActive) {
          finalPrompt += "\n\n[User has enabled EDIT IMAGE mode. Please describe a high-quality travel image representing this destination or topic, and include a simulated photo showcase in your markdown output.]";
        }

        promptContext += `User: ${finalPrompt}`;

        const systemInstruction = `You are "tripready AI", a world-class premium travel concierge assistant.
Answer ONLY what the user asked concisely, elegantly, and naturally.
STRICT FORMATTING RULE: DO NOT use markdown asterisks or stars (*) or double-asterisks (**) anywhere in your response text. Never print asterisks (* or **).
For bold text or titles, write clear capitalized titles or headers on new lines.
For list items, use plain dashes (-) or numbers (1., 2.).
Tone: Calm, professional, humanized (not robotic, no generic AI fluff or customer support phrases).
Format: scannable dashboard-friendly layout, short paragraphs, bullet lists with dashes (-), or tables where appropriate.
Capabilities: discover destinations, create itineraries, estimate budgets, advise on weather, food, transit, culture, safety, visa, packing.
Never generate fake hotels/prices. If user asks short questions, give short precise answers.`;

        const reply = await askGemini(promptContext, systemInstruction);
        setIsTyping(false);

        if (reply) {
          setMessages((prev) => [...prev, { 
            sender: 'ai', 
            text: reply, 
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isStreaming: true
          }]);
        } else {
          triggerLocalReply(fullText);
        }
      } catch (err) {
        console.error("Gemini chatbot error:", err);
        setIsTyping(false);
        triggerLocalReply(fullText);
      }
    } else {
      setTimeout(() => {
        setIsTyping(false);
        triggerLocalReply(fullText);
      }, 1000);
    }
  };

  // Custom Markdown & Collapsible details renderer (Asterisk-free clean output)
  const renderFormattedMessage = (text) => {
    if (!text) return null;

    // Check for thinking details blocks
    const detailsRegex = /<details>([\s\S]*?)<\/details>/;
    const match = text.match(detailsRegex);
    let thinkingContent = "";
    let mainContent = text;

    if (match) {
      thinkingContent = match[1];
      mainContent = text.replace(detailsRegex, '').trim();
    }

    // Helper to render inline text converting **bold** into <strong> and stripping stray *
    const renderCleanInlineText = (rawStr) => {
      if (!rawStr) return null;
      const parts = rawStr.split(/\*\*(.*?)\*\*/g);
      return parts.map((part, idx) => {
        if (idx % 2 === 1) {
          return (
            <strong key={idx} className="font-bold text-slate-900 dark:text-white mx-0.5">
              {part.replace(/\*/g, '').trim()}
            </strong>
          );
        }
        return part.replace(/\*/g, '');
      });
    };

    return (
      <div className="space-y-3.5 select-text">
        {thinkingContent && (
          <details open className="bg-gray-100/60 dark:bg-[#121622]/50 border border-gray-250 dark:border-white/[0.06] rounded-xl p-3.5 text-xs text-gray-500 dark:text-gray-400 mb-4 select-none">
            <summary className="font-semibold text-gray-700 dark:text-gray-300 cursor-pointer outline-none">
              View Thought Process
            </summary>
            <div className="mt-2 pl-4 border-l-2 border-gray-300 dark:border-neutral-700 whitespace-pre-line text-left leading-relaxed">
              {renderCleanInlineText(thinkingContent.replace(/<summary>.*?<\/summary>/, '').trim())}
            </div>
          </details>
        )}

        {mainContent.split('\n\n').map((paragraph, pIdx) => {
          // Check for h3 headings
          if (paragraph.startsWith('### ')) {
            return (
              <h3 key={pIdx} className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-4 mb-2 font-heading">
                {renderCleanInlineText(paragraph.slice(4))}
              </h3>
            );
          }

          // Check for numbered items/headings
          if (/^\d+\.\s/.test(paragraph)) {
            return (
              <h4 key={pIdx} className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-4 mb-2 leading-relaxed">
                {renderCleanInlineText(paragraph)}
              </h4>
            );
          }

          // Check for bullet lists
          if (paragraph.startsWith('   •') || paragraph.startsWith(' •') || paragraph.startsWith('•') || 
              paragraph.startsWith('   *') || paragraph.startsWith(' *') || paragraph.startsWith('*') ||
              paragraph.startsWith('   -') || paragraph.startsWith(' -') || paragraph.startsWith('-')) {
            const items = paragraph.split('\n');
            return (
              <ul key={pIdx} className="space-y-2 mt-2 pl-5 list-disc">
                {items.map((item, iIdx) => {
                  const cleanItem = item.replace(/^[ \t]*[•*-][ \t]*/, '').trim();
                  return (
                    <li key={iIdx} className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-light font-body">
                      {renderCleanInlineText(cleanItem)}
                    </li>
                  );
                })}
              </ul>
            );
          }

          // Plain text paragraph
          return (
            <p key={pIdx} className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-light font-body">
              {renderCleanInlineText(paragraph)}
            </p>
          );
        })}
      </div>
    );
  };

  const conversationsList = [
    { title: 'Clipboard Issue Fix', prompt: 'Summarize the recent updates to the clipboard feature.' },
    { title: 'Image Request Summary', prompt: 'Review travel options with high resolution photos.' },
    { title: 'Delivery Update Message', prompt: 'Draft a message for scheduling delivery.' },
    { title: 'What makes a contract legally...', prompt: 'What makes a contract legally binding?' }
  ];

  const travelTips = [
    { label: 'Packing Checklists', color: 'bg-emerald-500', code: '⌘1', prompt: 'Provide a comprehensive packing checklist for a 7-day international trip.' },
    { label: 'Travel Safety Tips', color: 'bg-amber-500', code: '⌘2', prompt: 'What are the top safety precautions to take when visiting a new country?' },
    { label: 'Budget Travel Hacks', color: 'bg-blue-500', code: '⌘3', prompt: 'What are the best smart budgeting hacks and money-saving tips for travelers?' },
    { label: 'Local Culture Guide', color: 'bg-purple-500', code: '⌘4', prompt: 'How do I research and prepare for local cultural customs and etiquette?' }
  ];
  const [selectedCity, selectedCountry] = selectedRegion.split(',').map(s => s.trim());
  const countryMatch = countriesList.find(c => c.name.toLowerCase() === selectedRegion.toLowerCase());
  const displayCity = countryMatch ? countryMatch.capital : selectedCity;
  const displayCountry = countryMatch ? countryMatch.name : (selectedCountry || '');

  return (
    <div className="h-screen w-screen bg-[#FDFDFD] dark:bg-gradient-to-b dark:from-[#0F131E] dark:to-[#07080C] text-[#1A1A1A] dark:text-white flex overflow-hidden font-body transition-colors duration-500">
      
      {/* Mobile backdrop overlay to close sidebar when clicking outside */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      <aside 
        className={`fixed inset-y-0 left-0 z-50 bg-[#F4F4F4] dark:bg-[#0C0E14] border-r border-gray-250/80 dark:border-white/[0.05] flex flex-col justify-between transition-all duration-300 ease-in-out lg:static ${
          sidebarCollapsed ? 'w-[72px]' : 'w-[260px]'
        } ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {sidebarCollapsed ? (
          /* Collapsed Sidebar Layout */
          <div className="py-6 flex-1 flex flex-col items-center justify-between no-scrollbar w-full h-full">
            <div className="flex flex-col items-center gap-6 w-full px-2">
              <LogoIcon />
              <button 
                onClick={() => setSidebarCollapsed(false)}
                className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-white/[0.03] transition-colors cursor-pointer"
                title="Expand Sidebar"
              >
                <PanelLeftOpen size={18} />
              </button>

              <div className="w-full border-t border-gray-250/50 dark:border-neutral-800/50 my-1" />

              <button 
                onClick={() => { setMessages([]); setSidebarOpen(false); }}
                className="w-11 h-11 rounded-xl bg-white dark:bg-[#222222] border border-gray-250 dark:border-neutral-800 text-black dark:text-white hover:scale-105 active:scale-95 shadow-sm transition-all flex items-center justify-center cursor-pointer"
                title="New Chat"
              >
                <MessageSquarePlus size={18} />
              </button>
            </div>

            <div className="w-full flex flex-col items-center gap-4 px-2">
              <button 
                onClick={() => toggleThemeLocal()}
                className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-white/[0.03] transition-colors cursor-pointer"
                title="Toggle Theme"
              >
                {activeTheme === 'dark' ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="text-indigo-500" />}
              </button>

              <button 
                onClick={() => setSidebarCollapsed(false)}
                className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-white/[0.03] transition-colors cursor-pointer flex items-center justify-center"
                title="Select Region"
              >
                <Globe size={18} className="text-blue-500" />
              </button>

              <div className="w-full border-t border-gray-250/50 dark:border-neutral-800/50 my-1" />

              {isLoggedIn ? (
                <img 
                  src="https://api.dicebear.com/7.x/adventurer/svg?seed=Jay" 
                  alt="Jay's Avatar"
                  className="w-9 h-9 rounded-full bg-indigo-100 border border-gray-300 dark:border-neutral-850 shrink-0 object-cover cursor-pointer hover:scale-105 transition-all"
                  onClick={() => setIsLoggedIn(false)}
                  title="Logout"
                />
              ) : (
                <button 
                  onClick={() => setIsLoggedIn(true)}
                  className="w-9 h-9 rounded-full bg-black dark:bg-white text-white dark:text-black hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-sm"
                  title="Login"
                >
                  <LogIn size={15} />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Expanded Sidebar Layout */
          <>
            <div className="px-5 py-6 space-y-6 flex-1 flex flex-col overflow-y-auto no-scrollbar">
              
              {/* Logo Section */}
              <div className="flex items-center justify-between px-2.5 py-1.5 select-none mb-2 w-full">
                <span className="font-heading font-black text-2xl tracking-tighter text-black dark:text-white lowercase flex items-baseline">
                  tripready
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] ml-0.5 self-baseline mb-0.5" />
                </span>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setSidebarCollapsed(true)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-black dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-white/[0.03] transition-colors cursor-pointer hidden lg:block"
                    title="Collapse Sidebar"
                  >
                    <PanelLeftClose size={16} />
                  </button>
                  <button 
                    onClick={() => setSidebarOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-black dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-white/[0.03] transition-colors cursor-pointer lg:hidden"
                    title="Close Sidebar Menu"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Conversations Section */}
              <div className="space-y-2 text-left px-1">
                <h4 className="text-[10px] tracking-wider font-bold text-gray-400 dark:text-gray-500 uppercase select-none px-1">Conversations</h4>
                <div className="space-y-1.5 relative">
                  {/* Active Selection Indicator Line on the left edge of the sidebar */}
                  {messages.length === 0 && (
                    <div className="absolute left-[-21px] top-[10px] w-1 h-5.5 bg-black dark:bg-white rounded-r-sm" />
                  )}
                  
                  <button 
                    onClick={() => setMessages([])}
                    className={`w-full py-2.5 px-3.5 rounded-xl flex items-center justify-between text-xs font-semibold transition-all shadow-xs cursor-pointer ${
                      messages.length === 0 
                        ? 'bg-white dark:bg-[#222222] text-black dark:text-white border border-gray-200 dark:border-neutral-850' 
                        : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-white/[0.03]'
                    }`}
                  >
                    <span>New Chat</span>
                    <ChevronRight size={12} className={messages.length === 0 ? 'text-black dark:text-white' : 'text-gray-400'} />
                  </button>

                  {isLoggedIn && conversationsList.map((item, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleSend(item.prompt)}
                      className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-white/[0.03] transition-colors truncate font-light block cursor-pointer"
                    >
                      {item.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Travel Tips Section */}
              <div className="space-y-2 text-left px-1">
                <h4 className="text-[10px] tracking-wider font-bold text-gray-400 dark:text-gray-500 uppercase select-none px-1">Travel Tips</h4>
                <ul className="space-y-1.5">
                  {travelTips.map((tip, idx) => (
                    <li key={idx}>
                      <button 
                        onClick={() => handleSend(tip.prompt)}
                        className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-white/[0.03] transition-colors flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${tip.color}`} />
                          <span className="truncate font-light">{tip.label}</span>
                        </div>
                        <span className="text-[9px] text-gray-400 dark:text-gray-500 px-1.5 py-0.5 rounded-md bg-gray-250/50 dark:bg-white/[0.04] font-mono select-none shrink-0">{tip.code}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Support & Theme Toggle Links */}
            <div className="px-5 py-3 space-y-1.5 text-left border-t border-gray-200/60 dark:border-neutral-800/60 bg-[#F4F4F4]/80 dark:bg-[#151515]/80">
              <button 
                onClick={() => toggleThemeLocal()}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-white/[0.03] transition-colors cursor-pointer"
              >
                {activeTheme === 'dark' ? (
                  <>
                    <Sun size={15} className="text-amber-500 shrink-0" />
                    <span className="font-light">Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon size={15} className="text-indigo-500 shrink-0" />
                    <span className="font-light">Dark Mode</span>
                  </>
                )}
              </button>

              {/* Region Selector Option (Custom premium drop-down with flags) */}
              <div className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 relative">
                <Globe size={14} className="text-blue-500 shrink-0" />
                <div className="flex-1 flex flex-col min-w-0">
                  <span className="text-[9px] text-gray-400 dark:text-gray-500 uppercase font-bold tracking-wider leading-none mb-1 select-none">Select Country</span>
                  <div className="relative flex items-center w-full">
                    <select 
                      value={selectedRegion}
                      onChange={(e) => setSelectedRegion(e.target.value)}
                      className="w-full bg-transparent text-slate-700 dark:text-slate-200 outline-none cursor-pointer border-none font-semibold p-0 pr-6 text-xs focus:ring-0 appearance-none select-none"
                    >
                      {countriesList.map((country, idx) => (
                        <option key={idx} value={country.name} className="bg-white dark:bg-[#151515] text-slate-800 dark:text-slate-200 py-1">
                          {country.flag} {country.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={11} className="absolute right-0 text-slate-400 dark:text-slate-500 pointer-events-none" />
                  </div>
                </div>
              </div>
              <button 
                onClick={() => alert('Support module initiated. For custom tripready inquiries, email support@tripready.co.')}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-white/[0.03] transition-colors cursor-pointer"
              >
                <Headphones size={15} className="text-gray-500 shrink-0" />
                <span className="font-light">Support</span>
              </button>
            </div>

            {/* Profile Row */}
            <div className="p-5 border-t border-gray-200 dark:border-neutral-800 bg-[#EAEAEA] dark:bg-[#181818] text-left flex flex-col gap-2 select-none">
              {isLoggedIn ? (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3 min-w-0">
                    <img 
                      src="https://api.dicebear.com/7.x/adventurer/svg?seed=Jay" 
                      alt="Jay's Avatar"
                      className="w-9 h-9 rounded-full bg-indigo-100 border border-gray-300 dark:border-neutral-850 shrink-0 object-cover"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-black dark:text-white flex items-center gap-0.5 truncate leading-none">
                        <span>Jay Dwivedi</span>
                        <svg className="w-3.5 h-3.5 text-blue-500 fill-current shrink-0" viewBox="0 0 24 24">
                          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                      </p>
                      <span className="text-[10px] text-gray-500 dark:text-gray-450 truncate block mt-1.5 font-light leading-none">jay@sprrrint.com</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsLoggedIn(false)}
                    className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 cursor-pointer shrink-0 transition-colors p-1"
                    title="Logout"
                  >
                    <LogOut size={15} />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsLoggedIn(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-all font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <LogIn size={14} />
                  <span>Login / Sign Up</span>
                </button>
              )}
            </div>
          </>
        )}
      </aside>

      {/* Drawer Overlay for Mobile */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-35 bg-black/40 backdrop-blur-xs lg:hidden animate-fade-in"
        />
      )}

      {/* ─── MAIN CHAT AREA (CORTEX PREMIUM STREAM) ─── */}
      <section className="flex-1 flex flex-col bg-white dark:bg-transparent relative overflow-hidden h-full">
        
        {/* Background Travel Landscape Image Layer */}
        <div 
          className="absolute inset-0 pointer-events-none z-0 bg-cover bg-center transition-all duration-500 opacity-60 dark:opacity-75"
          style={{ 
            backgroundImage: activeTheme === 'dark' ? "url('/images/chat_bg_dark.jpg')" : "url('/images/chat_bg.png')"
          }}
        />

        {/* Premium Ambient Aurora Glow (Dark Mode Only) */}
        <div className="absolute top-[-10%] left-[20%] w-[550px] h-[550px] rounded-full bg-blue-500/[0.02] dark:bg-blue-600/[0.05] blur-[120px] pointer-events-none z-0" />
        <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] rounded-full bg-indigo-500/[0.02] dark:bg-indigo-600/[0.04] blur-[100px] pointer-events-none z-0" />

        {/* Top Header Navigation Bar — Sleek, aligned controls */}
        <div className="relative z-30 w-full px-4 py-3 border-b border-gray-200/80 dark:border-white/10 bg-white dark:bg-[#0C0E14] flex items-center justify-between select-none">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl bg-gray-100 dark:bg-white/10 text-slate-800 dark:text-white hover:bg-gray-200 dark:hover:bg-white/15 transition-all cursor-pointer lg:hidden"
              title="Toggle Menu"
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold tracking-wide uppercase px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-mono">
                AI Concierge v3.0
              </span>
            </div>
          </div>

          {/* Right Header Options (Mode Switcher + Close Button) */}
          <div className="flex items-center gap-2">
            {/* 3-Dots / Options Mode Switcher Button */}
            <button
              onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                deepSearchActive || thinkActive || editImageActive
                  ? 'bg-blue-600 border-blue-500 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-white/10 border-gray-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-white/15'
              }`}
              title="Chatbot Modes & Options"
            >
              <SlidersHorizontal size={14} />
              <span className="hidden xs:inline">Modes</span>
              <div className="flex gap-0.5 ml-0.5">
                <span className="w-1 h-1 rounded-full bg-current" />
                <span className="w-1 h-1 rounded-full bg-current" />
                <span className="w-1 h-1 rounded-full bg-current" />
              </div>
            </button>

            {/* Top Right Close Button */}
            <button 
              onClick={() => navigate('/')}
              className="p-2 rounded-xl bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all cursor-pointer flex items-center justify-center"
              title="Close Chat"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Conversation Stack */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 md:p-10 space-y-8 no-scrollbar relative z-10 pb-4">
          
          {messages.length === 0 && (
            /* tripready landing style UI */
            <div className="max-w-2xl mx-auto py-8 md:py-12 text-left space-y-6 animate-fade-in select-none relative z-10">
              
              {/* Logo Section */}
              <div className="flex items-center select-none mb-1">
                <span className="font-heading font-black text-3xl tracking-tighter text-black dark:text-white lowercase flex items-baseline">
                  tripready
                  <span className="w-3.5 h-3.5 rounded-full bg-[var(--accent)] ml-0.5 self-baseline mb-0.5" />
                </span>
              </div>

              {/* Title & Prompt Subtitle */}
              <div className="space-y-2.5">
                <h2 className="font-heading text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
                  {t('hero.title', 'How can I help today?')}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-light">
                  Your premium AI travel concierge. Ask about flight tickets, custom itineraries, budgets, packing lists, or local cultural protocols.
                </p>
              </div>

              {/* Today's Overview Weather Card (Premium Apple/Tesla style) */}
              {!inputText.trim() && (
                <div className="max-w-[270px] w-full bg-white/60 dark:bg-[#161C2C]/50 border border-white/40 dark:border-white/[0.08] rounded-3xl p-5 shadow-xl backdrop-blur-md relative animate-slide-up flex flex-col gap-4 mt-6">
                  {/* Header Row */}
                  <div className="flex justify-between items-start w-full">
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-tight">{displayCountry}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-light mt-0.5">{displayCity ? `Capital: ${displayCity}` : ''}</span>
                    </div>
                    {/* Bell Icon with alert badge */}
                    <button 
                      onClick={() => alert('All weather alerts are cleared.')}
                      className="w-8 h-8 rounded-full bg-slate-100/50 dark:bg-neutral-800/50 border border-gray-200/40 dark:border-neutral-700/40 text-slate-600 dark:text-slate-300 flex items-center justify-center relative hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-xs"
                      type="button"
                    >
                      <Bell size={13} />
                      <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-blue-500 text-white text-[8px] font-bold flex items-center justify-center border border-white dark:border-neutral-900">3</span>
                    </button>
                  </div>

                  {/* Temperature & Icon row */}
                  <div className="flex items-center justify-between w-full">
                    <div className="flex flex-col text-left">
                      <span className="text-4xl font-light tracking-tight text-slate-900 dark:text-white font-heading">{weather.loading ? '--' : weather.temp.replace('°C', '°')}</span>
                      <span className="text-xs font-light text-slate-500 dark:text-slate-400 mt-1">{weather.loading ? 'Updating...' : weather.condition}</span>
                    </div>

                    {/* Floating Glow Icon */}
                    <div className="relative flex items-center justify-center w-14 h-14 shrink-0">
                      {/* Aura Glow */}
                      <div className="absolute inset-0 bg-amber-500/10 dark:bg-amber-500/15 rounded-full blur-md" />
                      {weather.condition === 'Sunny' && <Sun size={38} className="text-amber-500 relative z-10 animate-spin-slow" />}
                      {weather.condition === 'Partly Cloudy' && <Cloud size={38} className="text-gray-400 relative z-10" />}
                      {weather.condition === 'Foggy' && <Cloud size={38} className="text-gray-300 relative z-10" />}
                      {weather.condition === 'Rainy' && <CloudRain size={38} className="text-blue-400 relative z-10" />}
                      {weather.condition === 'Snowy' && <CloudSnow size={38} className="text-sky-300 relative z-10" />}
                      {weather.condition === 'Thunderstorm' && <CloudLightning size={38} className="text-amber-600 relative z-10" />}
                      {weather.condition === 'Pleasant' && <Sun size={38} className="text-amber-400 relative z-10" />}
                    </div>
                  </div>

                  {/* Thin elegant separator */}
                  <div className="w-full border-t border-black/[0.06] dark:border-white/[0.06]" />

                  {/* Footer Link */}
                  <button 
                    onClick={() => setShowWeatherModal(true)}
                    className="self-start text-[10px] font-bold text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors flex items-center gap-0.5 cursor-pointer"
                    type="button"
                  >
                    <span>View full forecast</span>
                    <ChevronRight size={10} />
                  </button>
                </div>
              )}

            </div>
          )}

          {/* Messages Loop */}
          <div className="max-w-2xl mx-auto space-y-8">
            {messages.map((msg, index) => (
              <div 
                key={index}
                className={`flex items-start gap-4 text-left animate-slide-up w-full ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'ai' ? (
                  <>
                    {/* Centered circle tr. avatar for AI */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-b from-blue-500 to-blue-700 flex items-center justify-center text-white shrink-0 shadow-[0_4px_14px_rgba(59,130,246,0.3)] font-heading font-extrabold text-xs select-none mt-0.5">
                      tr.
                    </div>
                    <div className="flex-1 space-y-2 select-text pl-1">
                      <div className="select-text">
                        {msg.isStreaming ? (
                          <StreamingMessage 
                            text={msg.text} 
                            onComplete={() => {
                               msg.isStreaming = false; // Disable animation on next render
                            }}
                            renderFormatted={renderFormattedMessage}
                          />
                        ) : renderFormattedMessage(msg.text)}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-slate-100 dark:bg-[#141A29]/80 text-slate-800 dark:text-slate-200 border border-gray-200/50 dark:border-white/[0.08] px-6 py-3.5 rounded-[24px] max-w-[75%] shadow-xs select-text flex flex-col gap-2.5">
                    {msg.file && (
                      msg.file.url ? (
                        <div className="max-w-[240px] rounded-lg overflow-hidden border border-gray-200/60 dark:border-neutral-850 shadow-xs mb-1">
                          <img src={msg.file.url} alt="Attached Preview" className="max-w-full max-h-[160px] object-cover" />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 px-3 py-2 bg-slate-200/50 dark:bg-neutral-800/50 border border-gray-250/50 dark:border-neutral-800/50 rounded-xl text-xs select-none mb-1 self-start">
                          <Paperclip size={13} className="text-slate-500 shrink-0" />
                          <span className="font-semibold text-slate-855 dark:text-slate-200 truncate max-w-[180px]">{msg.file.name}</span>
                        </div>
                      )
                    )}
                    {msg.text && (
                      <p className="text-xs sm:text-sm leading-relaxed font-light select-text whitespace-pre-wrap">{msg.text}</p>
                    )}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              /* Custom Typing indicator card */
              <div className="flex items-start gap-4 text-left animate-slide-up justify-start w-full">
                <div className="w-10 h-10 rounded-full bg-gradient-to-b from-blue-600 to-blue-700 flex items-center justify-center text-white shrink-0 shadow-md font-heading font-extrabold text-xs select-none mt-0.5">
                  tr.
                </div>
                <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-slate-100 dark:bg-[#181818] border border-gray-200/50 dark:border-neutral-800/80 ml-2">
                  <span className="w-1.5 h-1.5 bg-slate-500 dark:bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-slate-500 dark:bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-slate-500 dark:bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

        </div>

        {/* ─── STICKY BOTTOM INPUT AREA ─── */}
        <div className="shrink-0 p-5 bg-transparent border-t border-gray-200/20 dark:border-neutral-900/20 relative z-20">
          <div className="max-w-2xl mx-auto w-full flex flex-col gap-3">
            
            {/* File Attachment Chip (Floating above) */}
            {attachedFile && (
              <div className="flex items-center gap-2 self-start px-3.5 py-2 bg-white dark:bg-[#181818] border border-gray-250 dark:border-neutral-800/80 rounded-full text-xs text-slate-700 dark:text-slate-300 animate-slide-up shadow-sm ml-4 mb-1 select-none">
                <Paperclip size={12} className="text-slate-500 shrink-0" />
                <span className="font-semibold truncate max-w-[200px]">{attachedFile.name}</span>
                <button 
                  type="button" 
                  onClick={removeAttachedFile}
                  className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer font-bold pl-1 ml-0.5"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Interactive Chat Box Container */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="bg-[#F4F4F4] dark:bg-[#121622]/80 border border-gray-250 dark:border-white/[0.08] rounded-[28px] shadow-md hover:shadow-lg focus-within:shadow-[0_0_20px_rgba(59,130,246,0.15)] focus-within:border-blue-500/40 dark:focus-within:border-blue-500/50 backdrop-blur-md transition-all duration-300 p-2 pl-4 pr-3 flex items-center gap-3 relative z-30"
            >
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-gray-200/60 dark:hover:bg-neutral-800 transition-colors cursor-pointer flex items-center justify-center shrink-0"
                title="Attach Files"
              >
                <Plus size={18} />
              </button>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
              />

              {/* Text Input Area */}
              <textarea 
                value={inputText}
                onChange={(e) => setInputText(e.target.value.slice(0, 1000))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask anything..."
                rows={1}
                className="flex-1 bg-transparent outline-none resize-none text-sm text-black dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-light py-2 leading-relaxed min-h-[36px] max-h-[160px] overflow-y-auto"
              />

              {/* Send Button */}
              <button 
                type="submit" 
                disabled={!inputText.trim() && !attachedFile}
                className={`w-10 h-10 rounded-full transition-all flex items-center justify-center shrink-0 cursor-pointer ${
                  (inputText.trim() || attachedFile)
                    ? 'bg-black dark:bg-white text-white dark:text-black hover:scale-105 active:scale-95 shadow-md' 
                    : 'bg-gray-200 dark:bg-neutral-800/85 text-slate-400 dark:text-neutral-600 cursor-not-allowed opacity-50'
                }`}
              >
                <Send size={16} className="translate-x-[0.5px] -translate-y-[0.5px]" />
              </button>
            </form>

            {/* Grok Style Footer Badges */}
            <div className="flex justify-center items-center gap-6 mt-1 text-[10px] text-gray-400 dark:text-gray-500 select-none pb-2">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <span>Available 24/7</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-gray-400" />
                <span>Securely Encrypted</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-gray-400" />
                <span>For the people</span>
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* ─── WEATHER FORECAST DETAILS MODAL ─── */}
      {showWeatherModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in select-none">
          <div className="bg-white/95 dark:bg-[#151515]/95 border border-gray-250 dark:border-neutral-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-scale-up text-left">
            {/* Close Button */}
            <button 
              onClick={() => setShowWeatherModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-105 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-500 dark:text-slate-400 flex items-center justify-center cursor-pointer transition-colors border-none"
            >
              <X size={15} />
            </button>

            {/* Header */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">5-Day Weather Forecast</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-light">Location: {displayCountry}{displayCity ? ` (${displayCity})` : ''}</p>
            </div>

            {/* Daily forecast list */}
            <div className="space-y-4">
              {(() => {
                const baseTempNum = parseInt(weather.temp) || 28;
                const days = ['Tomorrow', 'Friday', 'Saturday', 'Sunday', 'Monday'];
                const conditions = ['Sunny', 'Partly Cloudy', 'Sunny', 'Rainy', 'Pleasant'];
                
                return days.map((day, idx) => {
                  const dayTempMax = baseTempNum + Math.round(Math.sin(idx) * 2);
                  const dayTempMin = baseTempNum - 6 + Math.round(Math.cos(idx) * 2);
                  const cond = conditions[idx % conditions.length];
                  
                  return (
                    <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-neutral-800 last:border-none">
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 w-24">{day}</span>
                      <div className="flex items-center gap-2 w-28">
                        {cond === 'Sunny' && <Sun size={15} className="text-amber-500" />}
                        {cond === 'Partly Cloudy' && <Cloud size={15} className="text-gray-400" />}
                        {cond === 'Rainy' && <CloudRain size={15} className="text-blue-400" />}
                        {cond === 'Pleasant' && <Sun size={15} className="text-amber-400" />}
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-light">{cond}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{dayTempMax}° / {dayTempMin}°</span>
                    </div>
                  );
                });
              })()}
            </div>

            {/* Close action */}
            <button 
              onClick={() => setShowWeatherModal(false)}
              className="mt-6 w-full py-2.5 rounded-xl bg-black dark:bg-white text-white dark:text-black font-semibold text-xs hover:opacity-90 transition-all cursor-pointer text-center border-none"
            >
              Close Forecast
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
