const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually parse .env file to get credentials
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');

function getEnvVar(name) {
  const match = envContent.match(new RegExp(`^${name}=(.*)$`, 'm'));
  return match ? match[1].trim() : null;
}

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log('Searching for "antarctica" in Supabase...');

  const [countriesRes, statesRes, citiesRes] = await Promise.all([
    supabase.from('countries').select('*').ilike('name', '%antarctica%'),
    supabase.from('states').select('*').ilike('name', '%antarctica%'),
    supabase.from('cities').select('*').ilike('name', '%antarctica%')
  ]);

  console.log('Countries matched:', countriesRes.data);
  console.log('States matched:', statesRes.data);
  console.log('Cities matched:', citiesRes.data);
}

run();
