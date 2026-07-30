-- ── Supabase Database Tables & RLS Setup ────────────────────────────

-- 1. Profiles Table (Auth Sync)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  avatar_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Allow users to update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow users to insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. Saved AI Trips Table
CREATE TABLE IF NOT EXISTS public.saved_ai_trips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  destination TEXT NOT NULL,
  duration INT NOT NULL,
  budget TEXT NOT NULL,
  travel_type TEXT NOT NULL,
  itinerary_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.saved_ai_trips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to manage their own saved trips" ON public.saved_ai_trips
  FOR ALL USING (auth.uid() = user_id);

-- 3. Favorites Table
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  item_id TEXT NOT NULL,
  item_name TEXT NOT NULL,
  item_type TEXT CHECK (item_type IN ('destination', 'attraction', 'hotel', 'restaurant')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, item_id, item_type)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to manage their own favorites" ON public.favorites
  FOR ALL USING (auth.uid() = user_id);

-- 4. Recently Viewed Table
CREATE TABLE IF NOT EXISTS public.recently_viewed (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  item_slug TEXT NOT NULL,
  item_name TEXT NOT NULL,
  item_type TEXT CHECK (item_type IN ('city', 'country', 'attraction')) NOT NULL,
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.recently_viewed ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to manage their own history" ON public.recently_viewed
  FOR ALL USING (auth.uid() = user_id);

-- 5. Travel Notes Table
CREATE TABLE IF NOT EXISTS public.travel_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  note_type TEXT CHECK (note_type IN ('note', 'packing_list', 'personal')) NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.travel_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to manage their own travel notes" ON public.travel_notes
  FOR ALL USING (auth.uid() = user_id);

-- 6. User Preferences Table
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  language TEXT DEFAULT 'English' NOT NULL,
  currency TEXT DEFAULT 'USD' NOT NULL,
  theme TEXT DEFAULT 'dark' NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to manage their own preferences" ON public.user_preferences
  FOR ALL USING (auth.uid() = user_id);
