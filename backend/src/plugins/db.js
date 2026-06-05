// Registers @fastify/postgres so routes can use fastify.pg.query(sql, params).
import fp from 'fastify-plugin';
import fastifyPostgres from '@fastify/postgres';

async function db(fastify) {
  // Supabase requires SSL. Its pooler uses a publicly-trusted cert, so keep
  // verification on (never set rejectUnauthorized: false). Disable SSL only for
  // a local Postgres by setting DB_SSL=false.
  const useSsl = process.env.DB_SSL !== 'false';

  await fastify.register(fastifyPostgres, {
    connectionString: process.env.DATABASE_URL,
    ssl: useSsl,
    max: 3, // keep the pool small — serverless spins up many short-lived instances
  });
}

export default fp(db, { name: 'db' });
