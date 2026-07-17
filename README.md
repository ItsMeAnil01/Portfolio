# Anil — Full-Stack Portfolio

A production-grade portfolio, not a static site: a Next.js frontend talking to a real
Express + PostgreSQL API, with an admin dashboard to manage projects and read contact
messages without touching code or redeploying.

## Architecture

```
┌─────────────┐        REST API        ┌──────────────┐        ┌────────────┐
│   Next.js    │  ───────────────────▶ │  Express API  │ ─────▶ │ PostgreSQL │
│  (frontend)  │ ◀───────────────────  │  (backend)     │ ◀───── │  (Prisma)  │
└─────────────┘                        └──────────────┘        └────────────┘
      │                                        │
      │                                        └── Nodemailer → your inbox
      └── /admin/login, /admin/dashboard (JWT-protected)
```

- **Frontend** — Next.js 14 (App Router) + TypeScript + Tailwind. Public site fetches
  projects straight from the API on the server (no client-side loading spinner needed
  for the main content). Admin pages are client-rendered and protected by a JWT stored
  in `localStorage`, checked against the backend on every request.
- **Backend** — Express + TypeScript + Prisma. Three resources: `Project`, `Message`,
  `Admin`. Public routes are read-only for projects and write-only for the contact
  form; everything under `/api/admin/*` requires a valid admin JWT.
- **Database** — PostgreSQL, managed through Prisma migrations.
- **Email** — the contact form saves every message to the database first, then tries
  to email you a notification via SMTP (Gmail app password, SendGrid, or AWS SES all
  work). If email fails, the message is still safely in the database and visible in
  `/admin/dashboard`.

## Design

Dark trading-terminal aesthetic on purpose, not a template default: a scrolling ticker
of your stack, project cards styled as "trade tickets" with monospace stat readouts,
and a contact form framed as "opening an order" — all grounded in your dual identity
as engineer and systematic trader. Space Grotesk for display type, Inter for body
copy, JetBrains Mono for data/labels.

## Local development

Requires Node 20+, and either a local PostgreSQL instance or Docker.

```bash
# 1. Start Postgres (skip if you already have one running)
docker run --name portfolio-db -e POSTGRES_USER=portfolio -e POSTGRES_PASSWORD=portfolio \
  -e POSTGRES_DB=portfolio -p 5432:5432 -d postgres:16-alpine

# 2. Backend
cd backend
cp .env.example .env        # fill in DATABASE_URL, JWT_SECRET, ADMIN_EMAIL/PASSWORD, SMTP_*
npm install
npx prisma migrate dev --name init
npm run seed                 # creates your admin login + seeds starter projects
npm run dev                  # http://localhost:4000

# 3. Frontend (new terminal)
cd frontend
cp .env.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:4000
npm install
npm run dev                  # http://localhost:3000
```

Visit `http://localhost:3000/admin/login` and sign in with the `ADMIN_EMAIL` /
`ADMIN_PASSWORD` you set in `backend/.env` — that's how the very first admin account
gets created (the seed script hashes and stores it).

### Editing project content

Everything shown on the homepage lives in the database, not in code. After seeding,
go to `/admin/dashboard` to edit the four starter projects (Formify.ai, SecureChat,
ResumeAI, the Nifty 50 scalper) or add new ones — no redeploy required.

## Running everything with Docker Compose

```bash
cp backend/.env.example backend/.env   # only used for local var reference; compose sets its own
export JWT_SECRET=$(openssl rand -hex 32)
export ADMIN_EMAIL=you@example.com
export ADMIN_PASSWORD=change_me_now
docker compose up --build
docker compose exec backend npm run seed
```

## Deploying to AWS EC2

This is the path that matches your resume stack (EC2, Docker, GitHub Actions).

1. **Launch an EC2 instance** (Ubuntu 22.04, t3.small is plenty), open ports 22, 80,
   443 in its security group.
2. **Install Docker + Docker Compose** on the instance:
   ```bash
   curl -fsSL https://get.docker.com | sh
   sudo usermod -aG docker $USER
   sudo apt install -y docker-compose-plugin
   ```
3. **Clone the repo** onto the instance under `~/portfolio` and create a `.env` at the
   repo root with `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `SMTP_*`, and
   `NEXT_PUBLIC_API_URL` (point this at your domain/IP, e.g.
   `http://your-domain.com:4000` or behind a reverse proxy on `/api`).
4. **First deploy:**
   ```bash
   docker compose up -d --build
   docker compose exec backend npx prisma migrate deploy
   docker compose exec backend npm run seed
   ```
5. **Put Nginx (or an ALB) in front** for HTTPS via Let's Encrypt / Certbot, proxying
   `/` to port 3000 and `/api` to port 4000 — recommended over exposing raw ports.
6. **Wire up continuous deployment** using `.github/workflows/deploy.yml`: add repo
   secrets `EC2_HOST`, `EC2_USER` (`ubuntu`), and `EC2_SSH_KEY` (private key for the
   instance). Every push to `main` will type-check both apps, then SSH in, pull, and
   rebuild.
7. **Database**: for anything beyond a portfolio site's traffic, moving Postgres to
   RDS (rather than the Postgres container) removes a single point of failure and
   gives you automated backups — swap `DATABASE_URL` in `.env` to the RDS endpoint
   and drop the `postgres` service from `docker-compose.yml`.

## Security notes

- Passwords are hashed with bcrypt (12 rounds); JWTs are short-lived and stored in an
  `httpOnly` cookie as well as returned in the response body for the dashboard's
  `Authorization: Bearer` calls.
- Login and contact-form endpoints are rate-limited (`express-rate-limit`) against
  brute-force and spam.
- The contact form has a honeypot field (`company`) — bots tend to fill every input,
  humans never see it since it's visually hidden.
- All admin write endpoints validate input with `zod` before touching the database.
- Rotate `JWT_SECRET` and re-deploy if it's ever exposed; every existing admin session
  will be invalidated (a re-login is required — a good practice after any incident).

## What to customize before you ship this

- Replace the placeholder LinkedIn/GitHub links in `Footer.tsx` if they change.
- Add `imageUrl` and `liveUrl` to your seeded projects once you have screenshots/demos
  hosted (S3 is a natural fit given your stack).
- Point `CONTACT_RECEIVER_EMAIL` at the inbox you actually check.
- Consider adding a `robots.txt` / OpenGraph image once the domain is live for better
  link previews when you share it.
