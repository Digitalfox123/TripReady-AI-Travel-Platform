const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jklhfbuuknsuveoibccp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprbGhmYnV1a25zdXZlb2liY2NwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwNzYxOTgsImV4cCI6MjA5NjY1MjE5OH0.ihVjE7xS8E-URdSfdR0-B94W_2x-AZ9QQ_ziFXcYY38';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const queries = ['hong', 'cancun', 'palo', 'paulo', 'bali'];
  for (const q of queries) {
    console.log(`=== Querying for: ${q} ===`);
    const { data, error } = await supabase
      .from('cities')
      .select('id, name, slug, country_name')
      .or(`name.ilike.%${q}%,slug.ilike.%${q}%`)
      .limit(10);
      
    if (error) {
      console.error(error);
    } else {
      (data || []).forEach(m => {
        console.log(`Match: ${m.name} (slug: ${m.slug}, id: ${m.id}, country: ${m.country_name})`);
      });
    }
  }
}

run();
