import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jklhfbuuknsuveoibccp.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprbGhmYnV1a25zdXZlb2liY2NwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTA3NjE5OCwiZXhwIjoyMDk2NjUyMTk4fQ.4mw48gTCICgKDXyVkcUYdZiyoKEMftIN6pkEmikJD1s';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  // Query all attractions with name containing '2. '
  const { data: attractions, error } = await supabase
    .from('attractions')
    .select('id, name, city_id')
    .ilike('name', '%2. %');
  
  if (error) {
    console.error('Error fetching attractions:', error);
    return;
  }

  console.log(`Found ${attractions.length} attractions containing "2. " in their name.`);
  
  // Show a few examples of list format
  const listExamples = attractions.slice(0, 10);
  console.log('\nList format examples:');
  listExamples.forEach(ex => {
    console.log(`- ID ${ex.id} (City ${ex.city_id}): ${ex.name.substring(0, 150)}...`);
  });

  // Query count of total attractions in DB
  const { count, error: countErr } = await supabase
    .from('attractions')
    .select('*', { count: 'exact', head: true });
  
  console.log(`\nTotal attractions in database: ${count}. Error:`, countErr);
}

run();
