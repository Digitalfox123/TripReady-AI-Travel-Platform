const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const schemaPath = path.join(__dirname, '..', 'supabase', 'schema.sql');
const sql = fs.readFileSync(schemaPath, 'utf8');

const baseConfig = {
  user: 'postgres.jklhfbuuknsuveoibccp', // pooler routes via username suffix
  host: 'aws-1-ap-northeast-1.pooler.supabase.com', // Verified active pooler host
  database: 'postgres',
  port: 6543, // Correct port for pooler connections
  ssl: {
    rejectUnauthorized: false
  }
};

const passwordsToTry = [
  '4QU5NnPaD4tDPx@',      // raw password
  '[4QU5NnPaD4tDPx@]',    // with brackets
];

async function run() {
  console.log('--- Connecting to Supabase PostgreSQL Pooler ---');
  let client = null;
  let connected = false;

  for (const password of passwordsToTry) {
    console.log(`Attempting connection with password: "${password}"...`);
    client = new Client({ ...baseConfig, password });
    try {
      await client.connect();
      console.log('✓ Connected successfully!');
      connected = true;
      break;
    } catch (err) {
      console.log(`Connection failed: ${err.message}`);
      try {
        await client.end();
      } catch (e) {}
    }
  }

  if (!connected) {
    console.error('Fatal: Could not connect to database with any password combination.');
    process.exit(1);
  }

  try {
    console.log('Applying schema.sql migration...');
    // Execute the full SQL block
    await client.query(sql);
    console.log('✓ Schema applied successfully!');
  } catch (err) {
    console.error('Migration Failed:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
