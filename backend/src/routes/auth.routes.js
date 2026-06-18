// Email/password auth: register, login, me. Plus Google Sign-In.
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';

const credentials = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 6 },
    name: { type: 'string' },
  },
};

const googleCredential = {
  type: 'object',
  required: ['credential'],
  additionalProperties: false,
  properties: {
    credential: { type: 'string' },
  },
};

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Stricter limit for credential endpoints to blunt brute-force / signup abuse.
const authRateLimit = { rateLimit: { max: 10, timeWindow: '1 minute' } };

function sign(fastify, user) {
  return fastify.jwt.sign({ id: user.id, email: user.email });
}

export default async function authRoutes(fastify) {
  // Register
  fastify.post('/register', { schema: { body: credentials }, config: authRateLimit }, async (request, reply) => {
    const { email, password, name } = request.body;

    const exists = await fastify.pg.query('SELECT 1 FROM kyn.users WHERE email = $1', [email]);
    if (exists.rows.length > 0) {
      return reply.code(409).send({ error: 'Email already registered' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const { rows } = await fastify.pg.query(
      `INSERT INTO kyn.users (email, password_hash, name)
       VALUES ($1, $2, $3)
       RETURNING id, email, name`,
      [email, password_hash, name ?? null]
    );
    const user = rows[0];
    return reply.code(201).send({ token: sign(fastify, user), user });
  });

  // Login
  fastify.post('/login', { schema: { body: credentials }, config: authRateLimit }, async (request, reply) => {
    const { email, password } = request.body;
    const { rows } = await fastify.pg.query(
      'SELECT id, email, name, password_hash FROM kyn.users WHERE email = $1',
      [email]
    );
    if (rows.length === 0) return reply.code(401).send({ error: 'Invalid credentials' });

    // Google-only account (no password set) — can't log in via the password form.
    if (!rows[0].password_hash) return reply.code(401).send({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, rows[0].password_hash);
    if (!ok) return reply.code(401).send({ error: 'Invalid credentials' });

    const user = { id: rows[0].id, email: rows[0].email, name: rows[0].name };
    return { token: sign(fastify, user), user };
  });

  // Google Sign-In: verify the ID token, upsert the user, return our own JWT.
  fastify.post('/google', { schema: { body: googleCredential }, config: authRateLimit }, async (request, reply) => {
    const { credential } = request.body;

    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch {
      return reply.code(401).send({ error: 'Invalid Google token' });
    }

    if (!payload?.email || !payload.email_verified) {
      return reply.code(401).send({ error: 'Invalid Google token' });
    }

    const googleId = payload.sub;
    const email = payload.email;
    const name = payload.name ?? null;

    // 1) Existing Google account.
    let result = await fastify.pg.query(
      'SELECT id, email, name FROM kyn.users WHERE google_id = $1',
      [googleId]
    );

    // 2) Existing account by email — link google_id and backfill name if missing.
    if (result.rows.length === 0) {
      result = await fastify.pg.query(
        `UPDATE kyn.users
            SET google_id = $1,
                name = COALESCE(name, $2)
          WHERE email = $3 AND google_id IS NULL
          RETURNING id, email, name`,
        [googleId, name, email]
      );
    }

    // 3) New account — no password_hash.
    if (result.rows.length === 0) {
      result = await fastify.pg.query(
        `INSERT INTO kyn.users (email, name, google_id)
         VALUES ($1, $2, $3)
         RETURNING id, email, name`,
        [email, name, googleId]
      );
    }

    const user = result.rows[0];
    return { token: sign(fastify, user), user };
  });

  // Current user
  fastify.get('/me', { preHandler: [fastify.authenticate] }, async (request) => {
    const { rows } = await fastify.pg.query(
      'SELECT id, email, name FROM kyn.users WHERE id = $1',
      [request.user.id]
    );
    return rows[0] ?? null;
  });
}
