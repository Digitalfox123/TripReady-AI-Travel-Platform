const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jklhfbuuknsuveoibccp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprbGhmYnV1a25zdXZlb2liY2NwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTA3NjE5OCwiZXhwIjoyMDk2NjUyMTk4fQ.4mw48gTCICgKDXyVkcUYdZiyoKEMftIN6pkEmikJD1s';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAndFixDb() {
  console.log('Querying countries table...');
  const { data: countries, error: cErr } = await supabase.from('countries').select('id, name, image, gallery');
  if (cErr) {
    console.error('Countries error:', cErr);
  } else {
    for (const c of countries) {
      let needsUpdate = false;
      let newImage = c.image;
      let newGallery = c.gallery;

      if (c.image && c.image.includes('1469854523086')) {
        console.log(`FOUND in country image: ${c.name} (ID: ${c.id})`);
        newImage = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80';
        needsUpdate = true;
      }
      if (c.gallery && JSON.stringify(c.gallery).includes('1469854523086')) {
        console.log(`FOUND in country gallery: ${c.name} (ID: ${c.id})`);
        newGallery = c.gallery.map(img => 
          img.includes('1469854523086') 
            ? 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80' 
            : img
        );
        needsUpdate = true;
      }

      if (needsUpdate) {
        console.log(`Updating country: ${c.name}...`);
        const { error } = await supabase.from('countries').update({ image: newImage, gallery: newGallery }).eq('id', c.id);
        if (error) console.error(`Failed to update country ${c.name}:`, error);
        else console.log(`Successfully updated country ${c.name}!`);
      }
    }
  }

  console.log('Querying cities table...');
  const { data: cities, error: ciErr } = await supabase.from('cities').select('id, name, image, gallery');
  if (ciErr) {
    console.error('Cities error:', ciErr);
  } else {
    for (const c of cities) {
      let needsUpdate = false;
      let newImage = c.image;
      let newGallery = c.gallery;

      if (c.image && c.image.includes('1469854523086')) {
        console.log(`FOUND in city image: ${c.name} (ID: ${c.id})`);
        newImage = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80';
        needsUpdate = true;
      }
      if (c.gallery && JSON.stringify(c.gallery).includes('1469854523086')) {
        console.log(`FOUND in city gallery: ${c.name} (ID: ${c.id})`);
        newGallery = c.gallery.map(img => 
          img.includes('1469854523086') 
            ? 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80' 
            : img
        );
        needsUpdate = true;
      }

      if (needsUpdate) {
        console.log(`Updating city: ${c.name}...`);
        const { error } = await supabase.from('cities').update({ image: newImage, gallery: newGallery }).eq('id', c.id);
        if (error) console.error(`Failed to update city ${c.name}:`, error);
        else console.log(`Successfully updated city ${c.name}!`);
      }
    }
  }

  console.log('Db update and check completed.');
}

checkAndFixDb();
