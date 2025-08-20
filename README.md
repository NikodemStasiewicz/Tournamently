# Tournamently

A modern platform for creating and managing tournaments (solo or team-based) with real-time chat, teams, rankings, and an admin panel. Built with Next.js (App Router), Prisma (MongoDB), and Socket.IO.



## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Development Scripts](#development-scripts)
- [Key Workflows](#key-workflows)
  - [Authentication & Protection](#authentication--protection)
  - [Teams](#teams)
  - [Tournaments](#tournaments)
  - [Matches](#matches)
  - [Ranking](#ranking)
  - [Chat](#chat)
- [API Overview](#api-overview)
- [Production Notes](#production-notes)
- [Seeding](#seeding)
- [License](#license)

---

## Features

- Authentication & Authorization
  - Email/password auth with JWT stored as httpOnly cookie (`token`)
  - Global route protection with middleware
  - Role-based access: `PLAYER`, `ORGANIZER`, `ADMIN`

- Teams
  - Browse public teams with search and pagination
  - Create teams with avatar (URL or local file upload)
  - Join teams (instant or with approval)
  - Roles inside a team: `OWNER`, `CAPTAIN`, `MEMBER`
  - "My Teams" view, join requests counter

- Tournaments
  - Create tournaments (single/double elimination), participant limit, dates
  - Validation: end date cannot be earlier than start date
  - Join tournaments; auto-generate bracket when full
  - Interactive bracket rendering

- Matches
  - Admin-only action to set the match winner
  - Automatic propagation of winner/loser to next matches (including losers' bracket)

- Ranking
  - Ranking by win rate and participation metrics
  - Defensive data fetching against inconsistent relations (Mongo specifics)

- Real-time Chat (Esports theme)
  - Only visible and usable for logged-in users
  - Messages styled to distinguish your own vs others
  - Socket.IO via Next.js API route

- Admin Panel
  - Users list with role management
  - Platform statistics (users, teams, tournaments, matches)
  - Protected via middleware + server-side role checks on admin APIs

---

## Tech Stack

- Framework: **Next.js** (App Router, React, TypeScript)
- Database: **MongoDB**
- ORM: **Prisma** (MongoDB provider)
- Real-time: **Socket.IO**
- Styling: **Tailwind CSS**

---

## Project Structure

```
app/
  admin/              # Admin UI (Users, Stats)
  api/                # API routes (Next.js Route Handlers)
    admin/            # Admin endpoints (protected)
    auth/             # Auth helpers (current user)
    login/            # Login (sets JWT cookie)
    logout/           # Logout (clears cookie)
    matches/          # Match-related actions (e.g., set-winner)
    profile/          # Profile-related endpoints
    register/         # Registration
    teams/            # Teams (list/create/join/my)
    tournaments/      # Tournaments (create/join/generate)
  components/         # Reusable UI components (Navbar, Team, ChatWidget, etc.)
  lib/                # Prisma client, auth helpers, ranking, types
  profile/            # Profile page with tabs (created/joined/settings)
  ranking/            # Ranking page
  teams/              # Team pages
  tournaments/        # Tournament pages
middleware.ts         # Global route protection & role checks (admin)
prisma/
  schema.prisma       # Prisma schema (MongoDB provider)
public/
  uploads/teams/      # Local storage for uploaded team avatars
```

---

## Getting Started

1. Prerequisites
   - Node.js 18+
   - MongoDB (Atlas or local)

2. Install dependencies
```
npm install --legacy-peer-deps
```

3. Generate Prisma client
```
npx prisma generate
```

4. Configure environment variables (see below) in `.env`

5. Run the dev server
```
npm run dev
```

The app should be available at http://localhost:3000.

---

## Environment Variables

Create a `.env` file with at least:

```
DATABASE_URL="mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority"
JWT_SECRET="your-strong-secret"
```

- `DATABASE_URL`: MongoDB connection string
- `JWT_SECRET`: secret for signing/verifying JWTs

---

## Development Scripts

Common Next.js scripts (exact names may vary by your package.json):

- `npm run dev` – start the development server
- `npm run build` – create a production build
- `npm run start` – start the production server

Prisma:
- `npx prisma generate` – generate Prisma client
- `npm run prisma:seed` – run seeding script (also works with `npx prisma db seed`)

---

## Key Workflows

### Authentication & Protection
- Successful login sets an httpOnly cookie `token`.
- Global `middleware.ts` protects authenticated pages and admin routes. It also checks role for `/admin/*` by calling `/api/auth/me`.

Protected routes include (configurable in `middleware.ts`):
- `/teams/:path*`
- `/profile/:path*`
- `/prediction/:path*`
- `/admin/:path*`
- `/tournaments/new`
- `/tournaments/:id/edit`
- `/tournaments`

### Teams
- List/browse teams via `/api/teams?search=&page=&limit=`
- Create team via `/api/teams` (supports avatar as URL or file upload)
  - Multipart upload saves images to `public/uploads/teams` and stores the URL in DB
- Join team via `/api/teams/[id]/join` (handles approval and capacity checks)
- "My Teams" via `/api/teams/my`

### Tournaments
- Create via `/api/tournaments` with validation (end date >= start date)
- Join via `/api/tournaments/[id]/join` with capacity guard; when full, the bracket is generated
- Brackets rendered on the tournament page with mapping for single/double elimination and grand final

### Matches
- Set winner via `POST /api/matches/[id]/set-winner` (ADMIN only)
  - Validates the winner belongs to the match
  - Propagates winner/loser to next matches when slots are available (including lower bracket in double elimination)

### Ranking
- `app/lib/ranking.ts` defensively queries matches using `tournamentId` to avoid Prisma errors on inconsistent relations, then computes win rate and participation

### Chat  
- Only rendered and active for logged-in users
- Esports-themed UI (gradient, neon accents)
- Own messages are visually distinct (right side, purple bubble), others on the left (dark bubble)
- Uses Socket.IO via `/api/socket`

---

## API Overview

Auth
- `POST /api/login` – authenticate, set JWT cookie
- `POST /api/register` – create account (server-validated email/username/password)
- `GET /api/auth/me` – current user details (used across the app)

Teams
- `GET /api/teams` – list public teams with search & pagination
- `POST /api/teams` – create team (JSON with `avatar` URL or multipart with `avatar` file)
- `GET /api/teams/my` – teams of the current user
- `POST /api/teams/[id]/join` – join a team (approval-aware)

Tournaments
- `POST /api/tournaments` – create tournament (date validation included)
- `POST /api/tournaments/[id]/join` – join tournament (capacity guard + auto bracket)

Matches (Admin-only)
- `POST /api/matches/[id]/set-winner` – set match winner (role check enforced)

Admin (Admin-only)
- `GET /api/admin/users` – list users
- `PATCH /api/admin/users/[id]` – change user role
- `GET /api/admin/stats` – platform stats

> Note: some ancillary endpoints may exist for internal flows; the above are the primary ones.

---

## Seeding

Two convenient ways:

1) Prisma (recommended)
```
npx prisma generate
npx prisma db seed
```
This creates:
- Admin: admin@example.com / Admin123!
- Player: player1@example.com / User123!
- Demo team and a sample tournament

2) Manual script
If you prefer calling the script directly:
```
npm run prisma:seed
```

Note: The seed is idempotent (upsert), it won’t duplicate entries on multiple runs.

---

## Production Notes

- Avatar Storage
  - In development, team avatars are stored locally at `public/uploads/teams` and served as static files.
  - In production/serverless environments, prefer an object storage (S3, Cloudinary, GCS). Store only the public URL in the DB.

- Security
  - Middleware protects pages and checks role for admin routes.
  - Admin-only actions are also verified in API route handlers (defense in depth).

- Data Consistency (Mongo)
  - For legacy data, the app avoids strict relational includes that may return `null` in Prisma and instead resolves relations by IDs first.
  - Consider periodic cleanup of orphaned records (e.g., participants pointing to non-existing tournaments).

---

## License

This project is provided as-is for educational and internal use. 
