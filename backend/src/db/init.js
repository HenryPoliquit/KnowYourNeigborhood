// Applies schema.sql (and optionally seed.sql) to the configured database.
// Usage: node src/db/init.js [--seed]
import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function run() {
  const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  try {
    const schema = await readFile(join(__dirname, 'schema.sql'), 'utf8');
    await client.query(schema);
    console.log('Schema applied.');

    if (process.argv.includes('--seed')) {
      const seed = await readFile(join(__dirname, 'seed.sql'), 'utf8');
      await client.query(seed);
      console.log('Seed data inserted.');
    }
  } finally {
    await client.end();
  }
}

run().catch((err) => {
  console.error('DB init failed:', err.message);
  process.exit(1);
});
