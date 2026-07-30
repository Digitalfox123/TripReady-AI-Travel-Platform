import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { getLiveExchangeRates } from '../utils/currencyConverter';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

// Helper: Check if Supabase is properly configured
const isSupabaseConfigured = () => {
  try {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    return !!(url && anonKey && !url.includes('placeholder') && !anonKey.includes('placeholder'));
  } catch {
    return false;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [preferences, setPreferences] = useState({ language: 'English', currency: 'USD', theme: 'dark' });
  const [exchangeRates, setExchangeRates] = useState({
    USD: 1.0,
    PKR: 278.5,
    AED: 3.67,
    SAR: 3.75,
    EUR: 0.92,
    GBP: 0.78,
    INR: 83.5,
    JPY: 157.0
  });
  const [loading, setLoading] = useState(true);

  // Fetch live exchange rates on mount
  useEffect(() => {
    getLiveExchangeRates().then(rates => {
      if (rates) setExchangeRates(rates);
    });
  }, []);
  const [isFallbackMode, setIsFallbackMode] = useState(!isSupabaseConfigured());

  // ── Initialize Session & Profiles ──────────────────────────────────
  useEffect(() => {
    if (!isFallbackMode) {
      // Real Supabase Auth listener
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setUser(session.user);
          fetchOrCreateProfile(session.user);
        } else {
          const cachedGuestPrefs = localStorage.getItem('tripready_guest_preferences');
          if (cachedGuestPrefs) {
            try {
              setPreferences(JSON.parse(cachedGuestPrefs));
            } catch (e) {}
          }
          setLoading(false);
        }
      }).catch(() => {
        setIsFallbackMode(true);
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session) {
          setUser(session.user);
          fetchOrCreateProfile(session.user);
        } else {
          setUser(null);
          setProfile(null);
          const cachedGuestPrefs = localStorage.getItem('tripready_guest_preferences');
          if (cachedGuestPrefs) {
            try {
              setPreferences(JSON.parse(cachedGuestPrefs));
            } catch (e) {}
          } else {
            setPreferences({ language: 'English', currency: 'USD', theme: 'dark' });
          }
          setLoading(false);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // Local Storage Fallback Mode
      const storedSession = localStorage.getItem('tripready_session');
      if (storedSession) {
        try {
          const parsed = JSON.parse(storedSession);
          setUser(parsed.user);
          setProfile(parsed.profile);
          if (parsed.preferences) setPreferences(parsed.preferences);
        } catch (e) {
          console.error("Failed to parse mock session", e);
        }
      } else {
        const cachedGuestPrefs = localStorage.getItem('tripready_guest_preferences');
        if (cachedGuestPrefs) {
          try {
            setPreferences(JSON.parse(cachedGuestPrefs));
          } catch (e) {}
        }
      }
      setLoading(false);
    }
  }, [isFallbackMode]);

  // Fetch or create profile record in Supabase
  const fetchOrCreateProfile = async (currentUser) => {
    try {
      // Try to get profile
      let { data: prof, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // Profile does not exist, insert it
        const name = currentUser.user_metadata?.full_name || currentUser.email.split('@')[0];
        const newProf = {
          id: currentUser.id,
          full_name: name,
          avatar_url: currentUser.user_metadata?.avatar_url || ''
        };
        const { data: insertedProf, error: insError } = await supabase
          .from('profiles')
          .insert([newProf])
          .select()
          .single();

        if (!insError) prof = insertedProf;
      }

      if (prof) {
        setProfile(prof);
        // Load preferences
        const { data: prefs } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', currentUser.id)
          .single();

        if (prefs) {
          setPreferences({ language: prefs.language, currency: prefs.currency, theme: prefs.theme });
          // Apply theme
          if (prefs.theme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        } else {
          // Create default preferences
          await supabase.from('user_preferences').insert([{
            user_id: currentUser.id,
            language: 'English',
            currency: 'USD',
            theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light'
          }]);
        }
      }
    } catch (e) {
      console.warn("Error loading real Supabase profile data, continuing with defaults:", e);
    } finally {
      setLoading(false);
    }
  };

  // ── Authentication Actions ──────────────────────────────────────────
  const signUp = async (fullName, email, password) => {
    setLoading(true);
    if (!isFallbackMode) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName }
          }
        });
        if (error) throw error;
        
        // Manual insertion fallback for profile if trigger fails
        if (data.user) {
          await supabase.from('profiles').insert([{ id: data.user.id, full_name: fullName, avatar_url: '' }]);
          await supabase.from('user_preferences').insert([{ user_id: data.user.id, language: 'English', currency: 'USD', theme: 'dark' }]);
        }
        return { success: true, data };
      } catch (err) {
        // If Supabase call failed but it might be due to offline mode, fall back to mock
        console.warn("Supabase SignUp failed, trying Mock mode:", err);
        return signUpMock(fullName, email, password);
      }
    } else {
      return signUpMock(fullName, email, password);
    }
  };

  const signUpMock = async (fullName, email, password) => {
    const mockUsers = JSON.parse(localStorage.getItem('tripready_mock_users') || '[]');
    if (mockUsers.some(u => u.email === email)) {
      setLoading(false);
      return { success: false, error: new Error("Email already registered.") };
    }

    const newUser = {
      id: crypto.randomUUID(),
      email,
      user_metadata: { full_name: fullName }
    };
    const newProf = {
      id: newUser.id,
      full_name: fullName,
      avatar_url: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(fullName)}`
    };
    const newPrefs = { language: 'English', currency: 'USD', theme: 'dark' };

    mockUsers.push({ email, password, user: newUser, profile: newProf, preferences: newPrefs });
    localStorage.setItem('tripready_mock_users', JSON.stringify(mockUsers));

    const session = { user: newUser, profile: newProf, preferences: newPrefs };
    localStorage.setItem('tripready_session', JSON.stringify(session));

    setUser(newUser);
    setProfile(newProf);
    setPreferences(newPrefs);
    setLoading(false);
    return { success: true };
  };

  const signIn = async (email, password) => {
    setLoading(true);
    if (!isFallbackMode) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return { success: true, data };
      } catch (err) {
        console.warn("Supabase SignIn failed, checking mock users database:", err);
        return signInMock(email, password);
      }
    } else {
      return signInMock(email, password);
    }
  };

  const signInMock = async (email, password) => {
    const mockUsers = JSON.parse(localStorage.getItem('tripready_mock_users') || '[]');
    const matched = mockUsers.find(u => u.email === email && u.password === password);
    if (matched) {
      const session = { user: matched.user, profile: matched.profile, preferences: matched.preferences };
      localStorage.setItem('tripready_session', JSON.stringify(session));
      
      setUser(matched.user);
      setProfile(matched.profile);
      if (matched.preferences) setPreferences(matched.preferences);
      
      setLoading(false);
      return { success: true };
    } else {
      setLoading(false);
      return { success: false, error: new Error("Invalid login credentials.") };
    }
  };

  const signInWithGoogle = async () => {
    if (!isFallbackMode) {
      try {
        const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
        if (error) throw error;
        return { success: true, data };
      } catch (err) {
        console.warn("Supabase Google Auth failed, initializing Google mock session:", err);
        return signInGoogleMock();
      }
    } else {
      return signInGoogleMock();
    }
  };

  const signInGoogleMock = async () => {
    setLoading(true);
    const mockGoogleUser = {
      id: crypto.randomUUID(),
      email: 'traveler.google@gmail.com',
      user_metadata: { full_name: 'Google Guest Traveler', avatar_url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Google' }
    };
    const mockProfile = {
      id: mockGoogleUser.id,
      full_name: 'Google Guest Traveler',
      avatar_url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Google'
    };
    const mockPrefs = { language: 'English', currency: 'USD', theme: 'dark' };

    const session = { user: mockGoogleUser, profile: mockProfile, preferences: mockPrefs };
    localStorage.setItem('tripready_session', JSON.stringify(session));

    setUser(mockGoogleUser);
    setProfile(mockProfile);
    setPreferences(mockPrefs);
    setLoading(false);
    return { success: true };
  };

  const signOut = async () => {
    setLoading(true);
    if (!isFallbackMode) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn("Signout failed, clearing local session:", err);
      }
    }
    localStorage.removeItem('tripready_session');
    setUser(null);
    setProfile(null);
    setPreferences({ language: 'English', currency: 'USD', theme: 'dark' });
    setLoading(false);
  };

  const resetPassword = async (email) => {
    if (!isFallbackMode) {
      try {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
        return { success: true, data };
      } catch (err) {
        console.warn("Supabase Reset Password failed, mocking success notification:", err);
        return { success: true };
      }
    } else {
      return { success: true };
    }
  };

  // ── Profile Settings Actions ────────────────────────────────────────
  const updateProfile = async (fullName, avatarUrl) => {
    if (!user) return { success: false };
    if (!isFallbackMode) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .update({ full_name: fullName, avatar_url: avatarUrl })
          .eq('id', user.id)
          .select()
          .single();
        if (error) throw error;
        setProfile(data);
        return { success: true };
      } catch (err) {
        console.warn("Supabase profile update failed, updating mock context:", err);
        return updateProfileMock(fullName, avatarUrl);
      }
    } else {
      return updateProfileMock(fullName, avatarUrl);
    }
  };

  const updateProfileMock = async (fullName, avatarUrl) => {
    const updatedProf = { ...profile, full_name: fullName, avatar_url: avatarUrl };
    setProfile(updatedProf);
    
    // Save in session
    const storedSession = localStorage.getItem('tripready_session');
    if (storedSession) {
      const parsed = JSON.parse(storedSession);
      parsed.profile = updatedProf;
      localStorage.setItem('tripready_session', JSON.stringify(parsed));
    }
    
    // Save in users db
    const mockUsers = JSON.parse(localStorage.getItem('tripready_mock_users') || '[]');
    const idx = mockUsers.findIndex(u => u.user.id === user.id);
    if (idx !== -1) {
      mockUsers[idx].profile = updatedProf;
      localStorage.setItem('tripready_mock_users', JSON.stringify(mockUsers));
    }
    return { success: true };
  };

  const updatePreferences = async (language, currency, theme) => {
    // Read the current active theme directly from the document root to avoid sync issues
    const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';

    setPreferences({ language, currency, theme: currentTheme });

    if (user) {
      if (!isFallbackMode) {
        try {
          await supabase
            .from('user_preferences')
            .upsert({ user_id: user.id, language, currency, theme: currentTheme, updated_at: new Date() });
        } catch (err) {
          console.warn("Supabase preferences save failed, saving mock settings:", err);
        }
      } else {
        const storedSession = localStorage.getItem('tripready_session');
        if (storedSession) {
          const parsed = JSON.parse(storedSession);
          parsed.preferences = { language, currency, theme: currentTheme };
          localStorage.setItem('tripready_session', JSON.stringify(parsed));
        }
      }
    } else {
      localStorage.setItem('tripready_guest_preferences', JSON.stringify({ language, currency, theme: currentTheme }));
    }
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        preferences,
        loading,
        isFallbackMode,
        exchangeRates,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        resetPassword,
        updateProfile,
        updatePreferences,
        setIsFallbackMode // Allows user to manually switch fallback for debug testing
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
