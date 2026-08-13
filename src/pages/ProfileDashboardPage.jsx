import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';
import { currencies } from '../data';
import { 
  User, LayoutDashboard, Compass, Star, Clock, BookOpen, Settings, LogOut, Globe, DollarSign,
  Plus, Edit, Trash2, Copy, Share2, Heart, Shield, FileText, CheckCircle, RefreshCw,
  Folder, Lock, MapPin, Eye, Info
} from 'lucide-react';

export default function ProfileDashboardPage() {
  const navigate = useNavigate();
  const { user, profile, preferences, updateProfile, updatePreferences, signOut, isFallbackMode } = useAuth();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'trips' | 'favorites' | 'history' | 'notes' | 'settings'
  
  // Dashboard Sub-data lists
  const [savedTrips, setSavedTrips] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [notes, setNotes] = useState([]);

  // Form Fields
  const [newName, setNewName] = useState('');
  const [newAvatar, setNewAvatar] = useState('');
  
  // Note Form
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteType, setNoteType] = useState('note'); // 'note' | 'packing_list' | 'personal'
  const [editingNoteId, setEditingNoteId] = useState(null);

  // States for actions feedback
  const [toastMsg, setToastMsg] = useState('');

  // ── Smart Route Guard ──────────────────────────────────────────────
  useEffect(() => {
    if (!user) {
      navigate('/auth', { state: { from: '/dashboard' } });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (profile) {
      setNewName(profile.full_name || '');
      setNewAvatar(profile.avatar_url || '');
    }
  }, [profile]);

  // Show status toasts
  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // ── Fetch User Records ─────────────────────────────────────────────
  const loadUserData = async () => {
    if (!user) return;

    if (!isFallbackMode) {
      try {
        // 1. Fetch saved trips
        const { data: trips, error: tripsErr } = await supabase.from('saved_ai_trips').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
        if (tripsErr) throw tripsErr;
        if (trips) setSavedTrips(trips);

        // 2. Fetch favorites
        const { data: favs, error: favsErr } = await supabase.from('favorites').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
        if (favsErr) throw favsErr;
        if (favs) setFavorites(favs);

        // 3. Fetch history
        const { data: hist, error: histErr } = await supabase.from('recently_viewed').select('*').eq('user_id', user.id).order('viewed_at', { ascending: false }).limit(20);
        if (histErr) throw histErr;
        if (hist) setRecentlyViewed(hist);

        // 4. Fetch notes
        const { data: nts, error: notesErr } = await supabase.from('travel_notes').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
        if (notesErr) throw notesErr;
        if (nts) setNotes(nts);
      } catch (err) {
        console.warn("Failed to load real Supabase data, falling back to local database:", err);
        loadLocalUserData();
      }
    } else {
      loadLocalUserData();
    }
  };

  const loadLocalUserData = () => {
    // Stored Trips
    const allTrips = JSON.parse(localStorage.getItem('tripready_saved_trips') || '[]');
    setSavedTrips(allTrips.filter(t => t.user_id === user.id));

    // Stored Favorites
    const allFavs = JSON.parse(localStorage.getItem('tripready_favorites') || '[]');
    setFavorites(allFavs.filter(f => f.user_id === user.id));

    // Stored History
    const allHist = JSON.parse(localStorage.getItem('tripready_recently_viewed') || '[]');
    setRecentlyViewed(allHist.filter(h => h.user_id === user.id));

    // Stored Notes
    const allNotes = JSON.parse(localStorage.getItem('tripready_travel_notes') || '[]');
    setNotes(allNotes.filter(n => n.user_id === user.id));
  };

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user, activeTab, isFallbackMode]);

  // ── Saved AI Trips Actions ─────────────────────────────────────────
  const handleDeleteTrip = async (id) => {
    if (!confirm('Are you sure you want to delete this trip itinerary?')) return;
    if (!isFallbackMode) {
      try {
        const { error } = await supabase.from('saved_ai_trips').delete().eq('id', id);
        if (error) throw error;
      } catch (err) {
        console.error('Supabase trip delete failed, falling back to localStorage:', err);
        const allTrips = JSON.parse(localStorage.getItem('tripready_saved_trips') || '[]');
        const filtered = allTrips.filter(t => t.id !== id);
        localStorage.setItem('tripready_saved_trips', JSON.stringify(filtered));
      }
    } else {
      const allTrips = JSON.parse(localStorage.getItem('tripready_saved_trips') || '[]');
      const filtered = allTrips.filter(t => t.id !== id);
      localStorage.setItem('tripready_saved_trips', JSON.stringify(filtered));
    }
    triggerToast('Trip itinerary deleted successfully.');
    loadUserData();
  };

  const handleDuplicateTrip = async (trip) => {
    const duplicated = {
      ...trip,
      id: crypto.randomUUID(),
      destination: `${trip.destination} (Copy)`,
      created_at: new Date().toISOString()
    };

    if (!isFallbackMode) {
      try {
        const { error } = await supabase.from('saved_ai_trips').insert([duplicated]);
        if (error) throw error;
      } catch (err) {
        console.error('Supabase trip duplicate failed, falling back to localStorage:', err);
        const allTrips = JSON.parse(localStorage.getItem('tripready_saved_trips') || '[]');
        allTrips.unshift(duplicated);
        localStorage.setItem('tripready_saved_trips', JSON.stringify(allTrips));
      }
    } else {
      const allTrips = JSON.parse(localStorage.getItem('tripready_saved_trips') || '[]');
      allTrips.unshift(duplicated);
      localStorage.setItem('tripready_saved_trips', JSON.stringify(allTrips));
    }
    triggerToast('Trip duplicated successfully.');
    loadUserData();
  };

  const handleShareTrip = (trip) => {
    const shareText = `Checkout my custom AI travel itinerary to ${trip.destination} generated on TripReady! Budget: ${trip.budget}, Duration: ${trip.duration} days.`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      triggerToast('Itinerary details copied to clipboard!');
    } else {
      alert(shareText);
    }
  };

  const handleOpenTrip = (trip) => {
    // Save current active generated plan state inside localStorage so AI planner page can restore it
    localStorage.setItem('tripready_active_itinerary', JSON.stringify(trip.itinerary_data));
    navigate('/ai-trip-planner', { state: { fromDashboard: true } });
  };

  // ── Travel Notes Actions ───────────────────────────────────────────
  const handleSaveNote = async (e) => {
    e.preventDefault();
    if (!noteTitle || !noteContent) return;

    if (editingNoteId) {
      // Update
      if (!isFallbackMode) {
        try {
          const { error } = await supabase.from('travel_notes').update({ note_type: noteType, title: noteTitle, content: noteContent }).eq('id', editingNoteId);
          if (error) throw error;
        } catch (err) {
          console.error('Supabase note update failed, falling back to localStorage:', err);
          const allNotes = JSON.parse(localStorage.getItem('tripready_travel_notes') || '[]');
          const idx = allNotes.findIndex(n => n.id === editingNoteId);
          if (idx !== -1) {
            allNotes[idx] = { ...allNotes[idx], note_type: noteType, title: noteTitle, content: noteContent };
            localStorage.setItem('tripready_travel_notes', JSON.stringify(allNotes));
          }
        }
      } else {
        const allNotes = JSON.parse(localStorage.getItem('tripready_travel_notes') || '[]');
        const idx = allNotes.findIndex(n => n.id === editingNoteId);
        if (idx !== -1) {
          allNotes[idx] = { ...allNotes[idx], note_type: noteType, title: noteTitle, content: noteContent };
          localStorage.setItem('tripready_travel_notes', JSON.stringify(allNotes));
        }
      }
      triggerToast('Note updated.');
    } else {
      // Insert
      const newNote = {
        id: crypto.randomUUID(),
        user_id: user.id,
        note_type: noteType,
        title: noteTitle,
        content: noteContent,
        created_at: new Date().toISOString()
      };
      if (!isFallbackMode) {
        try {
          const { error } = await supabase.from('travel_notes').insert([newNote]);
          if (error) throw error;
        } catch (err) {
          console.error('Supabase note insert failed, falling back to localStorage:', err);
          const allNotes = JSON.parse(localStorage.getItem('tripready_travel_notes') || '[]');
          allNotes.unshift(newNote);
          localStorage.setItem('tripready_travel_notes', JSON.stringify(allNotes));
        }
      } else {
        const allNotes = JSON.parse(localStorage.getItem('tripready_travel_notes') || '[]');
        allNotes.unshift(newNote);
        localStorage.setItem('tripready_travel_notes', JSON.stringify(allNotes));
      }
      triggerToast('New note created.');
    }

    setNoteTitle('');
    setNoteContent('');
    setEditingNoteId(null);
    loadUserData();
  };

  const handleEditNote = (note) => {
    setEditingNoteId(note.id);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setNoteType(note.note_type);
  };

  const handleDeleteNote = async (id) => {
    if (!confirm('Delete this note?')) return;
    if (!isFallbackMode) {
      try {
        const { error } = await supabase.from('travel_notes').delete().eq('id', id);
        if (error) throw error;
      } catch (err) {
        console.error('Supabase note delete failed, falling back to localStorage:', err);
        const allNotes = JSON.parse(localStorage.getItem('tripready_travel_notes') || '[]');
        const filtered = allNotes.filter(n => n.id !== id);
        localStorage.setItem('tripready_travel_notes', JSON.stringify(filtered));
      }
    } else {
      const allNotes = JSON.parse(localStorage.getItem('tripready_travel_notes') || '[]');
      const filtered = allNotes.filter(n => n.id !== id);
      localStorage.setItem('tripready_travel_notes', JSON.stringify(filtered));
    }
    triggerToast('Note deleted.');
    loadUserData();
  };

  // ── Profile Settings Actions ───────────────────────────────────────
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const res = await updateProfile(newName, newAvatar);
    if (res.success) {
      triggerToast('Profile updated successfully.');
    } else {
      triggerToast('Failed to save profile changes.');
    }
  };

  const handleUpdateLanguage = (lang) => {
    updatePreferences(lang, preferences.currency, preferences.theme);
    triggerToast(`Language updated to ${lang}`);
  };

  const handleUpdateCurrency = (curr) => {
    updatePreferences(preferences.language, curr, preferences.theme);
    triggerToast(`Currency updated to ${curr}`);
  };

  const handleUpdateTheme = (theme) => {
    updatePreferences(preferences.language, preferences.currency, theme);
    triggerToast(`Theme switched to ${theme}`);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-24 pb-12 select-none">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Toast Alert */}
        {toastMsg && (
          <div className="fixed top-20 right-6 z-50 px-5 py-3 rounded-2xl bg-gradient-to-tr from-[var(--accent)] to-indigo-600 text-white text-xs font-semibold shadow-premium border border-white/10 animate-slide-up">
            {toastMsg}
          </div>
        )}

        {/* ─── SIDEBAR CONTAINER ─── */}
        <aside className="lg:col-span-1 flex flex-col bg-white dark:bg-dark-300 border border-slate-150 dark:border-white/[0.05] rounded-3xl p-6 shadow-premium h-fit select-none">
          {/* User Details */}
          <div className="flex flex-col items-center text-center pb-6 border-b border-slate-100 dark:border-white/[0.05] mb-6">
            <div className="relative w-20 h-20 rounded-full border border-white/10 overflow-hidden mb-3">
              <img 
                src={profile?.avatar_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user.email)}`} 
                alt="Profile Avatar"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = 'https://api.dicebear.com/7.x/adventurer/svg?seed=fallback'; }}
              />
            </div>
            <h3 className="font-heading font-black text-sm text-luxury-primary dark:text-white truncate max-w-full">
              {profile?.full_name || 'Member Traveler'}
            </h3>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-light truncate max-w-full mt-0.5">{user.email}</span>
            
            {/* Sync Badge */}
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[8px] font-mono font-bold uppercase tracking-wider mt-3 ${
              isFallbackMode 
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/15'
                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/15'
            }`}>
              <RefreshCw size={8} className="animate-spin-slow" /> {isFallbackMode ? 'Sandbox Mode' : 'Cloud Synchronized'}
            </span>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex flex-col gap-1">
            {[
              { id: 'overview', name: 'Overview', icon: LayoutDashboard },
              { id: 'trips', name: 'My AI Trips', icon: Compass, count: savedTrips.length },
              { id: 'favorites', name: 'Favorites', icon: Star, count: favorites.length },
              { id: 'history', name: 'Recently Viewed', icon: Clock, count: recentlyViewed.length },
              { id: 'notes', name: 'Saved Notes', icon: BookOpen, count: notes.length },
              { id: 'settings', name: 'Settings', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                    active 
                      ? 'bg-[var(--accent)] text-white shadow-md'
                      : 'text-luxury-secondary dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.02] cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={15} />
                    <span>{tab.name}</span>
                  </div>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      active ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-white/[0.04] text-slate-500 dark:text-slate-400'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}

            <button
              onClick={signOut}
              className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold text-red-500 hover:bg-red-500/10 transition-all cursor-pointer mt-4"
            >
              <LogOut size={15} />
              <span>Logout Session</span>
            </button>
          </nav>
        </aside>

        {/* ─── MAIN WORKSPACE CONTENT ─── */}
        <main className="lg:col-span-3 flex flex-col bg-white dark:bg-dark-300 border border-slate-150 dark:border-white/[0.05] rounded-3xl p-8 shadow-premium text-left min-h-[500px]">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fade-in">
              {/* Welcome Card */}
              <div className="bg-gradient-to-tr from-[var(--accent)] to-indigo-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden select-none">
                <div className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-overlay" style={{ backgroundImage: "url('/images/landmarks.jpg')" }} />
                <div className="relative z-10 space-y-2">
                  <h2 className="font-heading font-black text-xl leading-none">Welcome Back, {profile?.full_name || 'Traveler'}!</h2>
                  <p className="text-xs text-white/80 font-light max-w-lg leading-relaxed">
                    Ready for your next adventure? You have generated {savedTrips.length} custom AI travel itineraries. Customize settings and explore new destination locks.
                  </p>
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { name: 'AI Trips Generated', val: savedTrips.length, color: 'text-blue-500', bg: 'bg-blue-500/5' },
                  { name: 'Sights Saved', val: favorites.length, color: 'text-amber-500', bg: 'bg-amber-500/5' },
                  { name: 'Places Visited', val: recentlyViewed.length, color: 'text-emerald-500', bg: 'bg-emerald-500/5' },
                  { name: 'Travel Notes', val: notes.length, color: 'text-purple-500', bg: 'bg-purple-500/5' },
                ].map((stat, idx) => (
                  <div key={idx} className={`${stat.bg} border border-slate-100 dark:border-white/[0.03] rounded-2xl p-4 flex flex-col`}>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">{stat.name}</span>
                    <span className={`text-3xl font-black ${stat.color} mt-2`}>{stat.val}</span>
                  </div>
                ))}
              </div>

              {/* Quick Preferences Panel */}
              <div className="border border-slate-100 dark:border-white/[0.04] rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-white/[0.03]">
                  <Globe className="text-[var(--accent)]" size={16} />
                  <h4 className="text-xs font-bold text-luxury-primary dark:text-white uppercase tracking-wider">Active Workspace Settings</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase">Language</span>
                    <span className="block font-semibold text-xs text-luxury-primary dark:text-white mt-1">{preferences.language}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase">Currency</span>
                    <span className="block font-semibold text-xs text-luxury-primary dark:text-white mt-1">{preferences.currency}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase">Active Theme</span>
                    <span className="block font-semibold text-xs text-luxury-primary dark:text-white mt-1 uppercase">{preferences.theme}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MY AI TRIPS */}
          {activeTab === 'trips' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-white/[0.05]">
                <h3 className="font-heading font-black text-base text-luxury-primary dark:text-white">Saved AI Itineraries</h3>
                <button 
                  onClick={() => navigate('/ai-trip-planner')}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] hover:bg-slate-100 text-[10px] font-bold text-[var(--accent)] border border-slate-150 dark:border-white/5 cursor-pointer"
                >
                  Create New Plan
                </button>
              </div>

              {savedTrips.length === 0 ? (
                <div className="text-center py-16 text-slate-400 space-y-3">
                  <Compass className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700" />
                  <h5 className="font-heading font-bold text-sm">No Saved Itineraries</h5>
                  <p className="text-xs font-light max-w-xs mx-auto leading-relaxed">
                    Once you fill the planner form and generate a trip as a logged-in user, your custom day-by-day itineraries will show up here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedTrips.map((trip) => (
                    <div key={trip.id} className="border border-slate-100 dark:border-white/[0.04] bg-slate-50/50 dark:bg-white/[0.01] hover:border-[var(--accent)]/30 rounded-2xl p-5 flex flex-col justify-between transition-all group">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-heading font-bold text-sm text-luxury-primary dark:text-white truncate pr-4">
                            {trip.destination}
                          </h4>
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-white dark:bg-dark-100 border border-slate-100 dark:border-white/[0.03] text-slate-400">
                            {trip.travel_type}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mt-4 text-[10px] text-slate-400 font-light">
                          <div>
                            <span className="block text-[8px] uppercase tracking-wider font-bold">Duration</span>
                            <span className="font-semibold text-luxury-primary dark:text-slate-200">{trip.duration} Days</span>
                          </div>
                          <div>
                            <span className="block text-[8px] uppercase tracking-wider font-bold">Budget</span>
                            <span className="font-semibold text-luxury-primary dark:text-slate-200 capitalize">{trip.budget}</span>
                          </div>
                          <div>
                            <span className="block text-[8px] uppercase tracking-wider font-bold">Date</span>
                            <span className="font-semibold text-luxury-primary dark:text-slate-200 truncate block">
                              {new Date(trip.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-white/[0.03] mt-5">
                        <button 
                          onClick={() => handleOpenTrip(trip)}
                          className="p-2 rounded-xl bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                          title="Open Itinerary"
                        >
                          <Eye size={13} />
                        </button>
                        <button 
                          onClick={() => handleDuplicateTrip(trip)}
                          className="p-2 rounded-xl bg-slate-100 dark:bg-white/[0.04] text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                          title="Duplicate Itinerary"
                        >
                          <Copy size={13} />
                        </button>
                        <button 
                          onClick={() => handleShareTrip(trip)}
                          className="p-2 rounded-xl bg-slate-100 dark:bg-white/[0.04] text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                          title="Share Info"
                        >
                          <Share2 size={13} />
                        </button>
                        <button 
                          onClick={() => handleDeleteTrip(trip.id)}
                          className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer ml-auto"
                          title="Delete Plan"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FAVORITES */}
          {activeTab === 'favorites' && (
            <div className="space-y-6 animate-fade-in">
              <div className="pb-3 border-b border-slate-100 dark:border-white/[0.05]">
                <h3 className="font-heading font-black text-base text-luxury-primary dark:text-white">Bookmarks & Favorites</h3>
              </div>

              {favorites.length === 0 ? (
                <div className="text-center py-16 text-slate-400 space-y-3">
                  <Star className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700" />
                  <h5 className="font-heading font-bold text-sm">No Saved Bookmarks</h5>
                  <p className="text-xs font-light max-w-xs mx-auto leading-relaxed">
                    Bookmark attractions, cities, and packages to save them in your workspace.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {favorites.map((fav) => (
                    <div key={fav.id} className="border border-slate-100 dark:border-white/[0.04] bg-slate-50/50 dark:bg-white/[0.01] rounded-2xl p-4 flex items-center justify-between transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                          <Heart size={14} className="fill-amber-500" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs sm:text-sm text-luxury-primary dark:text-white">{fav.item_name}</h4>
                          <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 font-mono">{fav.item_type}</span>
                        </div>
                      </div>
                      <button 
                        onClick={async () => {
                          if (!isFallbackMode) {
                            await supabase.from('favorites').delete().eq('id', fav.id);
                          } else {
                            const allFavs = JSON.parse(localStorage.getItem('tripready_favorites') || '[]');
                            const filtered = allFavs.filter(f => f.id !== fav.id);
                            localStorage.setItem('tripready_favorites', JSON.stringify(filtered));
                          }
                          triggerToast('Bookmark deleted.');
                          loadUserData();
                        }}
                        className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 cursor-pointer"
                        title="Remove Bookmark"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: RECENTLY VIEWED */}
          {activeTab === 'history' && (
            <div className="space-y-6 animate-fade-in">
              <div className="pb-3 border-b border-slate-100 dark:border-white/[0.05]">
                <h3 className="font-heading font-black text-base text-luxury-primary dark:text-white">Browsing History</h3>
              </div>

              {recentlyViewed.length === 0 ? (
                <div className="text-center py-16 text-slate-400 space-y-3">
                  <Clock className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700" />
                  <h5 className="font-heading font-bold text-sm">No Viewing History</h5>
                  <p className="text-xs font-light max-w-xs mx-auto leading-relaxed">
                    Explore country directories, city hubs, and sights to track your logs.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {recentlyViewed.map((hist) => (
                    <div 
                      key={hist.id} 
                      onClick={() => navigate(`/destination/${hist.item_slug}`)}
                      className="border border-slate-100 dark:border-white/[0.04] bg-slate-50/50 dark:bg-white/[0.01] hover:bg-slate-100/50 dark:hover:bg-white/[0.02] rounded-xl p-3.5 flex items-center justify-between transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <MapPin size={14} className="text-slate-400 group-hover:text-[var(--accent)] transition-colors" />
                        <div>
                          <h4 className="font-bold text-xs text-luxury-primary dark:text-white">{hist.item_name}</h4>
                          <span className="text-[8px] uppercase tracking-wider font-bold text-slate-400 block mt-0.5">{hist.item_type}</span>
                        </div>
                      </div>
                      <span className="text-[8px] font-mono text-slate-400">
                        {new Date(hist.viewed_at || hist.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: SAVED NOTES */}
          {activeTab === 'notes' && (
            <div className="space-y-6 animate-fade-in">
              <div className="pb-3 border-b border-slate-100 dark:border-white/[0.05]">
                <h3 className="font-heading font-black text-base text-luxury-primary dark:text-white">Travel Logs & Notes</h3>
              </div>

              {/* Form to insert/update */}
              <form onSubmit={handleSaveNote} className="bg-slate-50/50 dark:bg-white/[0.01] border border-slate-100 dark:border-white/[0.04] rounded-2xl p-5 space-y-4">
                <h4 className="text-xs font-bold text-luxury-primary dark:text-white uppercase tracking-wider">
                  {editingNoteId ? 'Edit Travel Record' : 'Create New Travel Record'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 space-y-1.5">
                    <span className="block text-[10px] text-slate-400 uppercase font-bold">Record Title</span>
                    <input 
                      type="text" 
                      value={noteTitle}
                      onChange={(e) => setNoteTitle(e.target.value)}
                      placeholder="e.g. Switzerland Packing Checklist"
                      className="w-full bg-white dark:bg-dark-100 border border-slate-150 dark:border-white/[0.06] rounded-xl px-4.5 py-2.5 text-xs text-luxury-primary dark:text-white placeholder-slate-500 font-light focus:border-[var(--accent)] outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <span className="block text-[10px] text-slate-400 uppercase font-bold">Type</span>
                    <select
                      value={noteType}
                      onChange={(e) => setNoteType(e.target.value)}
                      className="w-full bg-white dark:bg-dark-100 border border-slate-150 dark:border-white/[0.06] rounded-xl px-4 py-2.5 text-xs text-luxury-primary dark:text-white outline-none cursor-pointer focus:border-[var(--accent)]"
                    >
                      <option value="note">Travel Note</option>
                      <option value="packing_list">Packing List</option>
                      <option value="personal">Personal Log</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <span className="block text-[10px] text-slate-400 uppercase font-bold">Content</span>
                  <textarea 
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Write detailed lists, attractions to visit, or memory logs here..."
                    rows={4}
                    className="w-full bg-white dark:bg-dark-100 border border-slate-150 dark:border-white/[0.06] rounded-xl px-4.5 py-3 text-xs text-luxury-primary dark:text-white placeholder-slate-500 font-light focus:border-[var(--accent)] outline-none resize-none"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button 
                    type="submit" 
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-tr from-[var(--accent)] to-indigo-600 text-white text-xs font-semibold shadow-md hover:scale-[1.02] cursor-pointer active:scale-[0.98] transition-all"
                  >
                    {editingNoteId ? 'Save Edits' : 'Save Record'}
                  </button>
                  {editingNoteId && (
                    <button 
                      type="button" 
                      onClick={() => {
                        setNoteTitle('');
                        setNoteContent('');
                        setEditingNoteId(null);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-white/[0.04] text-luxury-primary dark:text-white text-xs font-semibold hover:bg-slate-300 dark:hover:bg-white/10 cursor-pointer transition-all"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              {/* Note entries list */}
              {notes.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  <FileText className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700" />
                  <p className="text-xs font-light mt-2">No notes created yet. Fill the editor above to save travel records.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notes.map((note) => (
                    <div key={note.id} className="border border-slate-100 dark:border-white/[0.04] bg-slate-50/50 dark:bg-white/[0.01] rounded-2xl p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-heading font-bold text-sm text-luxury-primary dark:text-white">{note.title}</h4>
                          <span className="text-[9px] uppercase tracking-wider font-mono font-bold bg-white dark:bg-dark-100 px-2.5 py-0.5 rounded-md border border-slate-100 dark:border-white/[0.03] text-slate-400">
                            {note.note_type.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-350 font-light mt-3 whitespace-pre-wrap leading-relaxed select-text">
                          {note.content}
                        </p>
                      </div>
                      <div className="flex gap-2 justify-end pt-3 border-t border-slate-100 dark:border-white/[0.03] mt-4">
                        <button 
                          onClick={() => handleEditNote(note)}
                          className="p-2 rounded-xl bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 cursor-pointer"
                          title="Edit Note"
                        >
                          <Edit size={12} />
                        </button>
                        <button 
                          onClick={() => handleDeleteNote(note.id)}
                          className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 cursor-pointer"
                          title="Delete Note"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-8 animate-fade-in">
              <div className="pb-3 border-b border-slate-100 dark:border-white/[0.05]">
                <h3 className="font-heading font-black text-base text-luxury-primary dark:text-white">Workspace Settings</h3>
              </div>

              {/* Personal Information */}
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <h4 className="text-xs font-bold text-luxury-primary dark:text-white uppercase tracking-wider">Personal Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <span className="block text-[10px] text-slate-400 uppercase font-bold">Full Name</span>
                    <input 
                      type="text" 
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-dark-100 border border-slate-150 dark:border-white/[0.06] rounded-xl px-4 py-2.5 text-xs text-luxury-primary dark:text-white"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <span className="block text-[10px] text-slate-400 uppercase font-bold">Email Address</span>
                    <input 
                      type="email" 
                      value={user.email}
                      disabled
                      className="w-full bg-slate-100 dark:bg-dark-200 border border-slate-150 dark:border-white/[0.06] rounded-xl px-4 py-2.5 text-xs text-slate-400 dark:text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <span className="block text-[10px] text-slate-400 uppercase font-bold">Avatar URL or Browse</span>
                  <div className="flex gap-2">
                    <input 
                      type="url" 
                      value={newAvatar}
                      onChange={(e) => setNewAvatar(e.target.value)}
                      placeholder="https://example.com/avatar.jpg"
                      className="flex-1 bg-slate-50 dark:bg-dark-100 border border-slate-150 dark:border-white/[0.06] rounded-xl px-4 py-2.5 text-xs text-luxury-primary dark:text-white placeholder-slate-500"
                    />
                    <label className="px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-dark-200 border border-slate-200 dark:border-white/[0.08] text-xs font-semibold text-luxury-primary dark:text-slate-300 cursor-pointer hover:bg-slate-200 dark:hover:bg-dark-300 transition-colors flex items-center gap-1.5">
                      <Folder className="w-3.5 h-3.5" />
                      Browse
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              setNewAvatar(ev.target.result);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
                <button 
                  type="submit" 
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-tr from-[var(--accent)] to-indigo-600 text-white text-xs font-semibold shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
                >
                  Save Profile Details
                </button>
              </form>

              {/* Language Settings */}
              <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-white/[0.05]">
                <h4 className="text-xs font-bold text-luxury-primary dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Globe size={14} /> Regional Language
                </h4>
                <p className="text-[10px] text-slate-400 font-light leading-relaxed">
                  Select your primary interface language. The platform translates labels automatically.
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {['English', 'اردو', 'العربية', 'Français', 'Deutsch', 'Español'].map((lang) => {
                    const active = preferences.language === lang;
                    return (
                      <button
                        key={lang}
                        onClick={() => handleUpdateLanguage(lang)}
                        className={`px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                          active 
                            ? 'bg-blue-500/10 text-blue-500 border-blue-500/30'
                            : 'bg-transparent text-slate-500 dark:text-slate-350 border-slate-150 dark:border-white/[0.05] hover:bg-slate-50 dark:hover:bg-white/[0.01] cursor-pointer'
                        }`}
                      >
                        {lang}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Currency Settings */}
              <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-white/[0.05]">
                <h4 className="text-xs font-bold text-luxury-primary dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <DollarSign size={14} /> Base Currency Exchange
                </h4>
                <p className="text-[10px] text-slate-400 font-light leading-relaxed">
                  Select your preferred currency display. All flight, hotel, packages, and AI-estimated budgets convert dynamically.
                </p>
                <div className="max-w-xs">
                  <select
                    value={preferences.currency}
                    onChange={(e) => handleUpdateCurrency(e.target.value)}
                    className="w-full bg-white dark:bg-white/[0.03] text-[var(--text-primary)] border border-luxury-border dark:border-white/[0.08] px-4 py-2.5 rounded-xl font-bold text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer shadow-xs"
                  >
                    {currencies.map(c => (
                      <option key={c.code} value={c.code} className="dark:bg-[#070e1b]">
                        {c.code} ({c.symbol}) - {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Theme Settings */}
              <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-white/[0.05]">
                <h4 className="text-xs font-bold text-luxury-primary dark:text-white uppercase tracking-wider">Appearance Theme</h4>
                <div className="flex gap-3">
                  {[
                    { id: 'light', name: 'Light Mode' },
                    { id: 'dark', name: 'Dark Mode' }
                  ].map((t) => {
                    const active = preferences.theme === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => handleUpdateTheme(t.id)}
                        className={`px-5 py-3 rounded-xl text-xs font-bold transition-all border ${
                          active 
                            ? 'bg-blue-500/10 text-blue-500 border-blue-500/30'
                            : 'bg-transparent text-slate-500 dark:text-slate-350 border-slate-150 dark:border-white/[0.05] hover:bg-slate-50 dark:hover:bg-white/[0.01] cursor-pointer'
                        }`}
                      >
                        {t.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Password & Security sessions */}
              <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-white/[0.05]">
                <h4 className="text-xs font-bold text-luxury-primary dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Shield size={14} /> Security Sessions
                </h4>
                <div className="p-4 bg-slate-50 dark:bg-dark-100 rounded-xl flex items-center justify-between border border-slate-150 dark:border-white/[0.03]">
                  <div className="flex items-center gap-3">
                    <CheckCircle size={16} className="text-emerald-500" />
                    <div>
                      <span className="block text-xs font-bold text-luxury-primary dark:text-white">Active Device Session</span>
                      <span className="block text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Windows PC • Chrome Browser</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/15 text-[8px] font-mono font-bold tracking-wider uppercase">Active</span>
                </div>
              </div>

            </div>
          )}

        </main>

      </div>
    </div>
  );
}
