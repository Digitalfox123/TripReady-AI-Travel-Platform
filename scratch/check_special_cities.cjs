const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jklhfbuuknsuveoibccp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprbGhmYnV1a25zdXZlb2liY2NwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwNzYxOTgsImV4cCI6MjA5NjY1MjE5OH0.ihVjE7xS8E-URdSfdR0-B94W_2x-AZ9QQ_ziFXcYY38';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  // Check cities for kong
  {
    console.log('=== Checking cities for %kong% ===');
    const { data, error } = await supabase
      .from('cities')
      .select('id, name, slug, country_name')
      .ilike('name', '%kong%');
    if (error) console.error(error);
    else console.log(data);
  }

  // Check cities for %canc%
  {
    console.log('=== Checking cities for %canc% ===');
    const { data, error } = await supabase
      .from('cities')
      .select('id, name, slug, country_name')
      .ilike('name', '%canc%');
    if (error) console.error(error);
    else console.log(data);
  }

  // Check countries for %hong%
  {
    console.log('=== Checking countries for %hong% ===');
    const { data, error } = await supabase
      .from('countries')
      .select('id, name, slug')
      .ilike('name', '%hong%');
    if (error) console.error(error);
    else console.log(data);
  }

  // Check cities for %bali%
  {
    console.log('=== Checking cities for %bali% ===');
    const { data, error } = await supabase
      .from('cities')
      .select('id, name, slug, country_name')
      .ilike('name', '%bali%');
    if (error) console.error(error);
    else console.log(data);
  }
}

run();
