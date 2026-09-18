# Chirpy

Chirpy is a TypeScript Express backend for a lightweight social posting app inspired by Twitter-style "chirps." It includes user authentication, JWT-based session handling, refresh token support, chirp creation and retrieval, admin metrics, and a webhook integration for upgrades.

It was built as part of the "Backend Developer Path (Typescript) on Boot.Dev

## Features

- User signup and profile updates
- Password hashing with Argon2
- JWT authentication and refresh token rotation
- Chirp creation, listing, fetching, and deletion
- Content filtering for prohibited words
- Postgres persistence with Drizzle ORM
- Health checks and admin metrics
- Static frontend served from the app folder
- Polka webhook integration for user upgrade events

## Tech Stack

- TypeScript
- Node.js + Express
- PostgreSQL
- Drizzle ORM
- Argon2
- JWT
- Vitest for tests

## Project Structure

```text
chirpy/
├── src/
│   ├── app/                 # static frontend assets
│   ├── auth/                # auth helpers and tests
│   ├── db/
│   │   ├── migrations/      # database migrations
│   │   ├── queries/         # DB query helpers
│   │   └── schema.ts        # Drizzle tables
│   ├── handlers/            # HTTP route handlers
│   ├── middleware/          # logging, error, metrics middleware
│   ├── config.ts            # environment config
│   ├── error_types.ts       # custom app errors
│   └── index.ts             # server bootstrap
├── drizzle.config.ts        # Drizzle configuration
├── package.json
├── tsconfig.json
└── README.md
```

## Prerequisites

- Node.js 18+
- PostgreSQL database
- A `.env` file with the required environment variables

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=8080
DB_URL=postgresql://username:password@localhost:5432/chirpy
TOKEN_SECRET=your_super_secret_key
POLKA_KEY=your_polka_webhook_key
PLATFORM=dev
```

Notes:

- `DB_URL` is required for the Postgres connection.
- `TOKEN_SECRET` is used to sign JWTs.
- `POLKA_KEY` is required for the webhook endpoint.
- `PLATFORM` is used by admin endpoints to control DEV-only behavior.

## Installation

```bash
npm install
```

## Database Setup

Generate and apply migrations:

```bash
npm run generate
npm run migrate
```

## Running the App

Development mode:

```bash
npm run dev
```

Production build:

```bash
npm run build
npm start
```

The server starts on the port defined by `PORT` (default: `8080`).

## Available Scripts

```bash
npm run test      # run Vitest tests
npm run build     # compile TypeScript to dist
npm run dev       # build and start the server
npm run start     # run the compiled server
npm run generate  # generate Drizzle migrations
npm run migrate   # apply pending migrations
```

## API Endpoints

### Health and Admin

- `GET /api/healthz` — returns `OK`
- `GET /admin/metrics` — returns simple HTML usage metrics
- `POST /admin/reset` — resets metrics in DEV mode only

### Users

- `POST /api/users` — create a new user
- `PUT /api/users` — update the authenticated user

### Authentication

- `POST /api/login` — logs in a user and returns a JWT + refresh token
- `POST /api/refresh` — exchanges a valid refresh token for a new JWT
- `POST /api/revoke` — invalidates a refresh token

### Chirps

- `GET /api/chirps` — list chirps
- `GET /api/chirps?authorId=<userId>` — list chirps for a single user
- `GET /api/chirps/:chirpId` — fetch a chirp by ID
- `POST /api/chirps` — create a chirp with JWT authentication
- `DELETE /api/chirps/:chirpId` — delete a chirp if owned by the authenticated user

### Webhooks

- `POST /api/polka/webhooks` — accepts Polka webhook events with API key validation

## Notes

- Chirps enforce a maximum length of 140 characters.
- Restricted words are replaced with `****` before storage.
- The frontend is served from `src/app` under the `/app` route.
- Authentication is expected via the `Authorization: Bearer <token>` header for protected routes.

## License

This project is licensed under the ISC license.
