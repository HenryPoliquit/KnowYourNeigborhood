import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';

import db from './plugins/db.js';
import auth from './plugins/auth.js';
import storesRoutes from './routes/stores.routes.js';
import authRoutes from './routes/auth.routes.js';
import messagesRoutes from './routes/messages.routes.js';

export function build() {
  const fastify = Fastify({ logger: true, trustProxy: true });

  // Security headers.
  fastify.register(helmet);

  // Global rate limit; routes can override via `config.rateLimit`.
  // Note: in-memory store is per-instance — best-effort under serverless.
  fastify.register(rateLimit, {
    global: true,
    max: 100,
    timeWindow: '1 minute',
  });

  fastify.register(cors, {
    origin: process.env.CORS_ORIGIN ?? true,
  });

  fastify.register(db);
  fastify.register(auth);

  fastify.get('/health', async () => ({ status: 'ok' }));

  fastify.register(authRoutes, { prefix: '/api/auth' });
  fastify.register(storesRoutes, { prefix: '/api/stores' });
  fastify.register(messagesRoutes, { prefix: '/api/messages' });

  return fastify;
}

// Only bind a port when run as a standalone server (local dev / non-Vercel).
// On Vercel the app is imported by api/index.js and driven via the request event.
if (!process.env.VERCEL) {
  const fastify = build();
  const port = Number(process.env.PORT ?? 3000);

  fastify.listen({ port, host: '0.0.0.0' }).catch((err) => {
    fastify.log.error(err);
    process.exit(1);
  });
}
