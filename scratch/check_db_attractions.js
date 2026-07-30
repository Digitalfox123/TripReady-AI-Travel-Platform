import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jklhfbuuknsuveoibccp.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprbGhmYnV1a25zdXZlb2liY2NwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTA3NjE5OCwiZXhwIjoyMDk2NjUyMTk4fQ.4mw48gTCICgKDXyVkcUYdZiyoKEMftIN6pkEmikJD1s';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkCommonImages() {
  console.log('--- Checking common images in database ---');
  
  const { data, error } = await supabase
    .from('attractions')
    .select('description')
    .limit(1000);
    
  if (error) {
    console.error(error);
    return;
  }
  
  const counts = {};
  data.forEach(item => {
    try {
      const parsed = JSON.parse(item.description);
      const img = parsed.image || parsed.featured_image || 'none';
      counts[img] = (counts[img] || 0) + 1;
    } catch (_) {
      // Ignore
    }
  });
  
  console.log('Top image URLs in first 1000 attractions:');
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  sorted.slice(0, 15).forEach(([img, count]) => {
    console.log(`- Count: ${count}, URL: ${img}`);
  });
}

checkCommonImages();
