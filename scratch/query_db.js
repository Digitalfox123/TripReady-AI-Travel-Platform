import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jklhfbuuknsuveoibccp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprbGhmYnV1a25zdXZlb2liY2NwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwNzYxOTgsImV4cCI6MjA5NjY1MjE5OH0.ihVjE7xS8E-URdSfdR0-B94W_2x-AZ9QQ_ziFXcYY38';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log("Checking cities in SA...");
  const { data: saCities, error: err1 } = await supabase
    .from('cities')
    .select('*')
    .ilike('country_name', '%Saudi%');
  
  if (err1) {
    console.error("Error fetching cities:", err1);
  } else {
    console.log(`Found ${saCities.length} cities in Saudi Arabia:`);
    saCities.forEach(c => console.log(`- ${c.name} (${c.slug}), is_capital=${c.is_capital}`));
  }

  console.log("\nChecking countries for Saudi...");
  const { data: saCountry, error: err2 } = await supabase
    .from('countries')
    .select('*')
    .ilike('name', '%Saudi%');

  if (err2) {
    console.error("Error fetching country:", err2);
  } else {
    console.log("Country data:", saCountry);
  }
}

run();
