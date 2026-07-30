// Background Scheduled Worker for Image Retrieval & Database Persistence
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getPipelineImage } from '../utils/imagePipeline.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Parse .env file manually to support both local execution and production environments
const envPath = path.resolve(__dirname, '../../.env');
let supabaseUrl = '';
let supabaseServiceKey = '';
let unsplashAccessKey = '';

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts[0]) {
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim().replace(/['"]/g, '');
      if (key === 'VITE_SUPABASE_URL') supabaseUrl = val;
      if (key === 'SUPABASE_SERVICE_ROLE_KEY') supabaseServiceKey = val;
      if (key === 'UNSPLASH_ACCESS_KEY' || key === 'VITE_UNSPLASH_ACCESS_KEY') unsplashAccessKey = val;
    }
  });
}

// Fallback to process.env
supabaseUrl = supabaseUrl || process.env.VITE_SUPABASE_URL;
supabaseServiceKey = supabaseServiceKey || process.env.SUPABASE_SERVICE_ROLE_KEY;
unsplashAccessKey = unsplashAccessKey || process.env.UNSPLASH_ACCESS_KEY || process.env.VITE_UNSPLASH_ACCESS_KEY;

// Expose unsplash key to pipeline via process.env
if (unsplashAccessKey) {
  process.env.UNSPLASH_ACCESS_KEY = unsplashAccessKey;
}

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("CRITICAL: Supabase credentials not found in .env or environment variables!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false
  }
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Cache for city and country info to avoid redundant database calls
const cityCache = new Map();

async function getCityDetails(cityId) {
  if (cityCache.has(cityId)) return cityCache.get(cityId);
  try {
    const { data, error } = await supabase
      .from('cities')
      .select('name, country_name')
      .eq('id', cityId)
      .maybeSingle();

    if (error) {
      console.error(`Error fetching city details for city ID ${cityId}:`, error);
      return null;
    }
    if (data) {
      cityCache.set(cityId, data);
      return data;
    }
  } catch (err) {
    console.error(`Exception fetching city details for city ID ${cityId}:`, err);
  }
  return null;
}

// Checks if the attraction requires an image pipeline update
function needsUpdate(attraction) {
  let parsedDesc = {};
  try {
    parsedDesc = JSON.parse(attraction.description || '{}');
  } catch (e) {
    parsedDesc = { description: attraction.description || '' };
  }

  const image = parsedDesc.image || '';
  const confidence = parsedDesc.image_confidence || 0;
  const lastChecked = parsedDesc.last_checked || null;

  // 1. Missing image or containing the Nikon camera or passport/map placeholder
  if (!image || image.includes('photo-1476514525535-07fb3b4ae5f1') || image.includes('photo-1488646953014-85cb44e25828')) {
    return true;
  }

  // 2. Confidence is low (< 90%)
  if (confidence < 90) {
    return true;
  }

  // 3. Stale (checked more than 30 days ago)
  if (lastChecked) {
    const checkedDate = new Date(lastChecked);
    const diffTime = Math.abs(new Date() - checkedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 30) {
      return true;
    }
  } else {
    return true; // No timestamp -> needs check
  }

  return false;
}

async function processAttraction(attraction) {
  const city = await getCityDetails(attraction.city_id);
  if (!city) {
    console.log(`Skipping attraction "${attraction.name}" (ID ${attraction.id}) - Parent city details not found.`);
    return false;
  }

  console.log(`\nProcessing: "${attraction.name}" in ${city.name}, ${city.country_name}...`);

  try {
    const result = await getPipelineImage(attraction.name, city.name, city.country_name);
    if (!result) {
      console.log(` -> No high-quality image found (score >= 85%) for "${attraction.name}". Using placeholder fallback.`);
      return false;
    }

    console.log(` -> Found: ${result.source} image (${result.confidence}% confidence)`);

    // Parse and update description JSON
    let parsedDesc = {};
    try {
      parsedDesc = JSON.parse(attraction.description || '{}');
    } catch (e) {
      parsedDesc = { description: attraction.description || '' };
    }

    parsedDesc.image = result.url;
    parsedDesc.images = [result.url];
    parsedDesc.featured_image = result.url;
    parsedDesc.image_source = result.source;
    parsedDesc.image_credit = result.credit;
    parsedDesc.image_confidence = result.confidence;
    parsedDesc.image_verified = result.confidence >= 90;
    parsedDesc.last_checked = new Date().toISOString();
    parsedDesc.thumbnail = result.thumbnail || result.url;
    parsedDesc.gallery_images = [result.url];

    const updatedDescription = JSON.stringify(parsedDesc);

    // Try to update with direct columns first (defensive database strategy)
    const { error: columnUpdateError } = await supabase
      .from('attractions')
      .update({
        description: updatedDescription,
        featured_image: result.url,
        image_source: result.source,
        image_credit: result.credit,
        image_confidence: result.confidence,
        image_verified: result.confidence >= 90,
        last_checked: new Date().toISOString(),
        thumbnail: result.thumbnail || result.url,
        gallery_images: [result.url]
      })
      .eq('id', attraction.id);

    if (columnUpdateError) {
      console.log(` -> DB columns not found or mismatch (code ${columnUpdateError.code}). Falling back to description JSON metadata storage.`);
      const { error: jsonUpdateError } = await supabase
        .from('attractions')
        .update({ description: updatedDescription })
        .eq('id', attraction.id);

      if (jsonUpdateError) {
        console.error(` -> Failed to update description JSON fallback:`, jsonUpdateError);
        return false;
      }
    }

    console.log(` -> Successfully saved image metadata for "${attraction.name}"`);
    return true;
  } catch (err) {
    console.error(` -> Exception processing "${attraction.name}":`, err);
    return false;
  }
}

async function runWorker(limitCount = null) {
  console.log("=========================================");
  console.log(" TRIPREADY IMAGE PIPELINE WORKER STARTING");
  console.log("=========================================");

  let page = 0;
  let finished = false;
  let totalProcessed = 0;
  let totalUpdated = 0;

  while (!finished) {
    console.log(`\nFetching page ${page + 1} of attractions (range: ${page * 1000} - ${(page + 1) * 1000 - 1})...`);
    
    const { data: attractions, error } = await supabase
      .from('attractions')
      .select('id, name, slug, category, description, city_id')
      .range(page * 1000, (page + 1) * 1000 - 1)
      .order('id', { ascending: true });

    if (error) {
      console.error("Error fetching attractions batch:", error);
      break;
    }

    if (!attractions || attractions.length === 0) {
      console.log("No more attractions found in database.");
      break;
    }

    console.log(`Loaded ${attractions.length} attractions. Filtering for items requiring updates...`);

    const updateQueue = attractions.filter(needsUpdate);
    console.log(`${updateQueue.length} attractions in this batch require image updates.`);

    for (const attraction of updateQueue) {
      const updated = await processAttraction(attraction);
      if (updated) totalUpdated++;
      totalProcessed++;

      if (limitCount && totalUpdated >= limitCount) {
        console.log(`\nReached process limit count of ${limitCount}. Stopping worker run.`);
        finished = true;
        break;
      }

      // Add a small delay between API hits to prevent rate limit triggers
      await sleep(1500);
    }

    if (attractions.length < 1000) {
      finished = true;
    } else {
      page++;
    }
  }

  console.log("\n=========================================");
  console.log(" WORKER PROCESS COMPLETED");
  console.log(` Attractions Checked: ${totalProcessed}`);
  console.log(` Images Updated:     ${totalUpdated}`);
  console.log("=========================================");
}

// Support running the worker directly from node with a command line argument (e.g. node imageWorker.js 5)
const runLimit = process.argv[2] ? parseInt(process.argv[2], 10) : null;
runWorker(runLimit);
export { runWorker };
