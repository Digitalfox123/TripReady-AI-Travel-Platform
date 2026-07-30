import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '..', '.env');
let supabaseUrl = '';
let supabaseServiceKey = '';

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts[0]) {
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim().replace(/['"]/g, '');
      if (key === 'VITE_SUPABASE_URL') supabaseUrl = val;
      if (key === 'SUPABASE_SERVICE_ROLE_KEY') supabaseServiceKey = val;
    }
  });
}

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Supabase credentials not found in .env!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

async function verify() {
  console.log("--- Starting Final Attractions Data Verification ---");
  try {
    const { count, error: countErr } = await supabase
      .from('attractions')
      .select('*', { count: 'exact', head: true });

    if (countErr) {
      console.error("Error getting count:", countErr.message);
      process.exit(1);
    }

    console.log(`Total attractions in database: ${count}`);
    const expectedCount = 2034; // 1529 + 505

    if (count === expectedCount) {
      console.log(`✓ Count matches exactly expected final count of ${expectedCount}!`);
    } else {
      console.warn(`WARNING: Count (${count}) does NOT match expected (${expectedCount}).`);
    }

    // Fetch last 10 samples to check the new batch
    const { data: samples, error: sampleErr } = await supabase
      .from('attractions')
      .select('id, name, slug, category, description, latitude, longitude, city_id')
      .order('id', { ascending: false })
      .limit(10);

    if (sampleErr) {
      console.error("Error fetching samples:", sampleErr.message);
      process.exit(1);
    }

    console.log("\nSample Rows from Final Batch (sorted desc):");
    console.table(samples);

    let allChecksPassed = true;
    for (const sample of samples) {
      if (!sample.slug.includes('-')) {
        console.error(`FAIL: Slug "${sample.slug}" is not hyphenated/slugified.`);
        allChecksPassed = false;
      }
      if (sample.latitude !== null || sample.longitude !== null) {
        console.error(`FAIL: Attraction "${sample.name}" has non-null coordinates.`);
        allChecksPassed = false;
      }
      if (!sample.category) {
        console.error(`FAIL: Attraction "${sample.name}" has null category.`);
        allChecksPassed = false;
      }
    }

    if (allChecksPassed) {
      console.log("\n✓ All sanity checks passed for final sample rows!");
    } else {
      console.error("\nSome sanity checks failed. Check errors above.");
    }
  } catch (err) {
    console.error("Verification failed with exception:", err);
    process.exit(1);
  }
}

verify();
