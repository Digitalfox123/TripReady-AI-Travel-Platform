import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jklhfbuuknsuveoibccp.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprbGhmYnV1a25zdXZlb2liY2NwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTA3NjE5OCwiZXhwIjoyMDk2NjUyMTk4fQ.4mw48gTCICgKDXyVkcUYdZiyoKEMftIN6pkEmikJD1s';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  // Find US country id
  const { data: country } = await supabase
    .from('countries')
    .select('id')
    .eq('slug', 'united-states')
    .single();
  
  if (!country) {
    console.log('US country not found');
    return;
  }

  // Find all US cities
  const { data: cities } = await supabase
    .from('cities')
    .select('id')
    .eq('country_id', country.id);

  const cityIds = cities.map(c => c.id);
  console.log(`US has ${cityIds.length} cities.`);

  // Get total count of attractions in these cities using aggregation
  const { count, error } = await supabase
    .from('attractions')
    .select('*', { count: 'exact', head: true })
    .in('city_id', cityIds);

  console.log(`Total US attractions in database (via count): ${count}. Error:`, error);
}

run();
