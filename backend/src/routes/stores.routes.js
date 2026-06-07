// Store CRUD. Reads are public; create/update/delete require auth.
// All queries are parameterized ($1, $2, ...) — never interpolate user input.

const storeBody = {
  type: 'object',
  required: ['name'],
  properties: {
    name: { type: 'string', minLength: 1 },
    phone_number: { type: ['string', 'null'] },
    locality: { type: ['string', 'null'] },
    latitude: { type: ['number', 'null'] },
    longitude: { type: ['number', 'null'] },
  },
  additionalProperties: false,
};

export default async function storesRoutes(fastify) {
  // List all stores
  fastify.get('/', async () => {
    const { rows } = await fastify.pg.query(
      'SELECT * FROM stores ORDER BY created_at DESC'
    );
    return rows;
  });

  // Get one store
  fastify.get('/:id', async (request, reply) => {
    const { rows } = await fastify.pg.query(
      'SELECT * FROM stores WHERE id = $1',
      [request.params.id]
    );
    if (rows.length === 0) return reply.code(404).send({ error: 'Not found' });
    return rows[0];
  });

  // Create store (auth)
  fastify.post(
    '/',
    { preHandler: [fastify.authenticate], schema: { body: storeBody } },
    async (request, reply) => {
      const { name, phone_number, locality, latitude, longitude } = request.body;
      const { rows } = await fastify.pg.query(
        `INSERT INTO stores (name, phone_number, locality, latitude, longitude, user_id)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [name, phone_number ?? null, locality ?? null, latitude ?? null, longitude ?? null, request.user.id]
      );
      return reply.code(201).send(rows[0]);
    }
  );

  // Update store (auth)
  fastify.put(
    '/:id',
    { preHandler: [fastify.authenticate], schema: { body: storeBody } },
    async (request, reply) => {
      const { name, phone_number, locality, latitude, longitude } = request.body;
      // Ownership predicate (user_id) prevents editing other users' stores (IDOR).
      const { rows } = await fastify.pg.query(
        `UPDATE stores
         SET name = $1, phone_number = $2, locality = $3, latitude = $4, longitude = $5, updated_at = now()
         WHERE id = $6 AND user_id = $7
         RETURNING *`,
        [name, phone_number ?? null, locality ?? null, latitude ?? null, longitude ?? null, request.params.id, request.user.id]
      );
      if (rows.length === 0) return reply.code(404).send({ error: 'Not found' });
      return rows[0];
    }
  );

  // Delete store (auth)
  fastify.delete(
    '/:id',
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      // Ownership predicate (user_id) prevents deleting other users' stores (IDOR).
      const { rowCount } = await fastify.pg.query(
        'DELETE FROM stores WHERE id = $1 AND user_id = $2',
        [request.params.id, request.user.id]
      );
      if (rowCount === 0) return reply.code(404).send({ error: 'Not found' });
      return reply.code(204).send();
    }
  );
}
