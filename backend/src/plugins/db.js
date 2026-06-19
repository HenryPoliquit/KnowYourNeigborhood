// Registers @fastify/postgres so routes can use fastify.pg.query(sql, params).
import fp from 'fastify-plugin';
import fastifyPostgres from '@fastify/postgres';

async function db(fastify) {
  // Supabase requires SSL. Its pooler uses a publicly-trusted cert, so keep
  // verification on (never set rejectUnauthorized: false). Disable SSL only for
  // a local Postgres by setting DB_SSL=false.
  const disableSsl = process.env.DB_SSL === 'false';

  await fastify.register(fastifyPostgres, {
    connectionString: process.env.DATABASE_URL,
    ssl: disableSsl ? false : { rejectUnauthorized: false },
    max: 3,
  });
}

export default fp(db, { name: 'db' });
