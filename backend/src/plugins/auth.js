// Registers @fastify/jwt and exposes fastify.authenticate as a preHandler.
import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';

async function auth(fastify) {
  await fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET,
  });

  // preHandler that rejects requests without a valid Bearer token.
  fastify.decorate('authenticate', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch {
      reply.code(401).send({ error: 'Unauthorized' });
    }
  });
}

export default fp(auth, { name: 'auth' });
