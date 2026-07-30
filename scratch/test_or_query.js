import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jklhfbuuknsuveoibccp.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprbGhmYnV1a25zdXZlb2liY2NwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTA3NjE5OCwiZXhwIjoyMDk2NjUyMTk4fQ.4mw48gTCICgKDXyVkcUYdZiyoKEMftIN6pkEmikJD1s';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  // Test .or query for cities
  const { data: cities, error } = await supabase
    .from('cities')
    .select('id, name, slug, country_name')
    .or('name.ilike.%shanghai%,slug.eq.shanghai');
  
  console.log('Cities or-query result:', cities, 'Error:', error);

  // Test .or query for countries
  const { data: countries, error: countryErr } = await supabase
    .from('countries')
    .select('id, name, slug')
    .or('name.ilike.%china%,slug.eq.china');
  
  console.log('Countries or-query result:', countries, 'Error:', countryErr);
}

run();
