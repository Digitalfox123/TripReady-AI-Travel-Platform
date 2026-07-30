const { Client } = require('pg');

const passwordsToTry = [
  '4QU5NnPaD4tDPx@',      // raw password
  '[4QU5NnPaD4tDPx@]',    // with brackets
];

async function test() {
  for (const password of passwordsToTry) {
    console.log(`Testing IPv6 with password: "${password}"...`);
    const client = new Client({
      user: 'postgres',
      host: '2406:da14:25a:5800:fbfa:8fde:4b11:ac60',
      database: 'postgres',
      password: password,
      port: 5432,
      family: 6,
      ssl: { rejectUnauthorized: false }
    });

    try {
      await client.connect();
      console.log('✓ IPv6 Connection Successful!');
      await client.end();
      return;
    } catch (err) {
      console.log(`IPv6 Connection failed: ${err.message}`);
      try {
        await client.end();
      } catch (e) {}
    }
  }
}

test();
