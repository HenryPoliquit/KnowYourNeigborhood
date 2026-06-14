// Vercel serverless entry. Reuses the Fastify app from src/server.js and drives
// it via the Node request event instead of binding a port.
import { build } from '../src/server.js';

const app = build();

export default async function handler(req, res) {
  await app.ready();
  app.server.emit('request', req, res);
}
