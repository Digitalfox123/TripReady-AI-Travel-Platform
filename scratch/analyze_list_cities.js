import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jklhfbuuknsuveoibccp.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprbGhmYnV1a25zdXZlb2liY2NwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTA3NjE5OCwiZXhwIjoyMDk2NjUyMTk4fQ.4mw48gTCICgKDXyVkcUYdZiyoKEMftIN6pkEmikJD1s';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  const { data: attractions, error } = await supabase
    .from('attractions')
    .select('id, name, city_id, cities(name, country_name)')
    .ilike('name', '%2. %');
  
  if (error) {
    console.error(error);
    return;
  }

  console.log(`Found ${attractions.length} attractions.`);
  attractions.forEach(a => {
    console.log(`City: ${a.cities?.name} (${a.cities?.country_name}) | Attr ID: ${a.id}`);
  });
}

run();
