// Contact form. POST is public; GET (list) requires auth.
const messageBody = {
  type: 'object',
  required: ['body'],
  properties: {
    name: { type: ['string', 'null'] },
    email: { type: ['string', 'null'] },
    body: { type: 'string', minLength: 1 },
  },
  additionalProperties: false,
};

export default async function messagesRoutes(fastify) {
  fastify.post('/', {
    schema: { body: messageBody },
    config: { rateLimit: { max: 5, timeWindow: '1 minute' } },
  }, async (request, reply) => {
    const { name, email, body } = request.body;
    const { rows } = await fastify.pg.query(
      `INSERT INTO messages (name, email, body)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name ?? null, email ?? null, body]
    );
    return reply.code(201).send(rows[0]);
  });

  fastify.get('/', { preHandler: [fastify.authenticate] }, async () => {
    const { rows } = await fastify.pg.query(
      'SELECT * FROM messages ORDER BY created_at DESC'
    );
    return rows;
  });
}
