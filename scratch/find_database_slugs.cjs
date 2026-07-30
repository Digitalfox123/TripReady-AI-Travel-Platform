const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jklhfbuuknsuveoibccp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprbGhmYnV1a25zdXZlb2liY2NwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwNzYxOTgsImV4cCI6MjA5NjY1MjE5OH0.ihVjE7xS8E-URdSfdR0-B94W_2x-AZ9QQ_ziFXcYY38';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const userCities = [
  'Bangkok', 'Tokyo', 'Kyoto', 'Osaka', 'Seoul', 'Busan', 'Singapore', 'Hong Kong',
  'Kuala Lumpur', 'Dubai', 'Abu Dhabi', 'Mecca', 'Medina', 'Istanbul', 'Antalya',
  'Bali', 'Jakarta', 'Phuket', 'Chiang Mai', 'Hanoi', 'Ho Chi Minh City', 'Paris',
  'London', 'Rome', 'Milan', 'Venice', 'Barcelona', 'Madrid', 'Amsterdam', 'Vienna',
  'Prague', 'Athens', 'Lisbon', 'Budapest', 'Berlin', 'Munich', 'Zurich', 'New York City',
  'Los Angeles', 'Las Vegas', 'San Francisco', 'Miami', 'Orlando', 'Washington D.C.',
  'Toronto', 'Vancouver', 'Montreal', 'Mexico City', 'Cancun', 'Rio de Janeiro', 'Sao Paulo'
];

async function run() {
  console.log('Querying Supabase for city slugs...');
  const results = [];
  for (const city of userCities) {
    const norm = city.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Query by name or slug
    const { data, error } = await supabase
      .from('cities')
      .select('id, name, slug, country_name')
      .or(`name.ilike.%${city}%,slug.ilike.%${norm}%`);
      
    if (error) {
      console.error(`Error for ${city}:`, error);
    } else {
      results.push({ city, matches: data || [] });
    }
  }

  // Print results
  results.forEach(r => {
    console.log(`City: ${r.city}`);
    if (r.matches.length === 0) {
      console.log('  -> NO MATCH FOUND');
    } else {
      r.matches.forEach(m => {
        console.log(`  -> Match: ${m.name} (slug: ${m.slug}, id: ${m.id}, country: ${m.country_name})`);
      });
    }
  });
}

run();
