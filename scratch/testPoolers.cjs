const { Client } = require('pg');

const hosts = [
  'aws-0-ap-northeast-1.pooler.supabase.com',
  'aws-0-ap-southeast-1.pooler.supabase.com',
  'aws-0-ap-south-1.pooler.supabase.com',
  'aws-0-us-west-1.pooler.supabase.com',
  'aws-0-us-east-1.pooler.supabase.com',
  'aws-0-eu-central-1.pooler.supabase.com',
];

async function test() {
  for (const host of hosts) {
    console.log(`Testing pooler host: ${host}...`);
    const client = new Client({
      user: 'postgres.jklhfbuuknsuveoibccp',
      host: host,
      database: 'postgres',
      password: '4QU5NnPaD4tDPx@',
      port: 6543,
      ssl: { rejectUnauthorized: false }
    });

    try {
      await client.connect();
      console.log(`✓ SUCCESS connecting to pooler host: ${host}!`);
      await client.end();
      return;
    } catch (err) {
      console.log(`Failed on ${host}: ${err.message}`);
      try {
        await client.end();
      } catch (e) {}
    }
  }
}

test();
