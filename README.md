# Know Your Neighborhood

A community-driven web app to discover, add, and map local stores in your
neighborhood. Browse stores, register an account to contribute, pin each store
on a map, and get in touch via the contact form.

Originally a Spring Boot + JSP + MySQL project, rebuilt on a JavaScript stack.

## Tech stack

| Layer    | Technology |
|----------|-----------|
| Frontend | Vite + Vue 3 + Vuetify, Pinia, Vue Router, axios |
| Maps     | Leaflet + OpenStreetMap (geocoding via Nominatim) |
| Backend  | Fastify (Node.js), raw SQL via `@fastify/postgres` |
| Auth     | Email/password with JWT (`@fastify/jwt`), bcrypt-hashed passwords |
| Database | PostgreSQL |

## Project layout

```
backend/    Fastify API (auth, stores, messages)
frontend/   Vite + Vue + Vuetify SPA
```

## Prerequisites

- Node.js 20+
- PostgreSQL 14+

## Setup

### 1. Database

Create the database (adjust user/host as needed):

```bash
psql -U postgres -c "CREATE DATABASE kyn;"
```

### 2. Backend

```bash
cd backend
cp .env.example .env        # then edit DATABASE_URL and JWT_SECRET
npm install
npm run db:init             # creates tables; add --seed for sample data
npm run dev                 # http://localhost:3000
```

`.env` keys:

- `DATABASE_URL` — e.g. `postgres://postgres:yourpass@localhost:5432/kyn`
- `JWT_SECRET` — long random string
- `PORT` — default `3000`
- `CORS_ORIGIN` — Vite dev origin, default `http://localhost:5173`

### 3. Frontend

```bash
cd frontend
cp .env.example .env        # VITE_API_URL points at the backend
npm install
npm run dev                 # http://localhost:5173
```

## API

| Method | Path                  | Auth | Description            |
|--------|-----------------------|------|------------------------|
| POST   | `/api/auth/register`  | —    | Create account, returns JWT |
| POST   | `/api/auth/login`     | —    | Login, returns JWT     |
| GET    | `/api/auth/me`        | ✓    | Current user           |
| GET    | `/api/stores`         | —    | List stores            |
| GET    | `/api/stores/:id`     | —    | Get one store          |
| POST   | `/api/stores`         | ✓    | Create store           |
| PUT    | `/api/stores/:id`     | ✓    | Update store           |
| DELETE | `/api/stores/:id`     | ✓    | Delete store           |
| POST   | `/api/messages`       | —    | Submit contact message |
| GET    | `/api/messages`       | ✓    | List messages          |

Protected routes require an `Authorization: Bearer <token>` header. All SQL uses
parameterized queries (`$1`, `$2`, …).

## Features

- Store CRUD with name, phone, locality, and geocoded coordinates
- Email/password authentication; only logged-in users can add/edit/delete stores
- Interactive Leaflet map: plot all located stores, or click/geocode to place a
  store when adding/editing
- Contact form persisted to the database

## Notes

- OAuth (Google/Facebook) is out of scope in this build; the schema leaves room
  to add it later.
- Nominatim geocoding is rate-limited — keep usage low for development.
