# Anil Kumar — Full-Stack Portfolio

A production-grade developer portfolio, featuring a Next.js frontend, an Express + MongoDB backend, and an interactive admin dashboard to manage projects, edit experiences/skills, and view contact messages.

---

## Architecture

```
┌─────────────┐        REST API        ┌──────────────┐        ┌────────────┐
│   Next.js    │  ───────────────────▶ │  Express API  │ ─────▶ │  MongoDB   │
│  (frontend)  │ ◀───────────────────  │  (backend)     │ ◀───── │  (Prisma)  │
└─────────────┘                        └──────────────┘        └────────────┘
      │                                        │
      │                                        └── Nodemailer → your inbox
      └── /admin/login, /admin/dashboard (JWT-protected)
```

- **Frontend** — Next.js 14 (App Router) + TypeScript + Tailwind. Public pages fetch projects, skills, and experiences directly from the API on the server (SEO-friendly). Includes an interactive CLI terminal and customized cursor easing.
- **Backend** — Express + TypeScript + Prisma. Supports collections for `Project`, `Experience`, `Skill`, `Message`, and `Admin`. JWT is used for session authentication.
- **Database** — MongoDB Atlas, integrated with Prisma Client.
- **Email** — The contact form saves messages to the database and forwards them to your inbox via SMTP.

---

## Design System

Vibrant glassmorphic dark-terminal aesthetic: a rolling marquee of your stack, project cards styled as monospace readouts, an interactive terminal console with commands matching the single-page scroll sections, and a magnetic tracking cursor.

---

## Local Development

Requires Node 20+ and a MongoDB connection string (local or Atlas cluster).

```bash
# 1. Clone & setup backend
cd backend
cp .env.example .env        # Add your MongoDB DATABASE_URL, JWT_SECRET, and Admin credentials
npm install
npm run prisma:push          # Push schemas to MongoDB (no migrations needed)
npm run seed                 # Seed default admin user, 35 skills, and projects
npm run dev                  # Start dev API on http://localhost:4000

# 2. Setup frontend (in a new terminal)
cd frontend
cp .env.example .env.local   # Set NEXT_PUBLIC_API_URL=http://localhost:4000
npm install
npm run dev                  # Start Next.js dev server on http://localhost:3000
```

Visit `http://localhost:3000/admin/login` and sign in with the admin credentials you set in your backend `.env` file to access the dashboard.

---

## Docker Compose Setup

Run the entire stack locally with Docker:

```bash
# Setup environmental parameters
export DATABASE_URL="your-mongodb-atlas-url"
export JWT_SECRET=$(openssl rand -hex 32)
export ADMIN_EMAIL=you@example.com
export ADMIN_PASSWORD=your_password

# Build and run containers
docker compose up --build
docker compose exec backend npm run seed
```

---

## Deployment to AWS EC2

This setup is built for easy deployment using EC2, Docker, and GitHub Actions:

1. **Launch EC2 Instance** (Ubuntu 22.04 LTS), open ports 80 (HTTP) and 443 (HTTPS) in its Security Group.
2. **Install Docker Engine**:
   ```bash
   curl -fsSL https://get.docker.com | sh
   sudo usermod -aG docker $USER
   ```
3. **Setup environment variables** in a `.env` file at the repository root containing your MongoDB string, JWT parameters, and SMTP credentials.
4. **Deploy Application**:
   ```bash
   docker compose up -d --build
   docker compose exec backend npm run prisma:push
   docker compose exec backend npm run seed
   ```
5. **Setup Nginx reverse proxy** to forward `/` to Next.js on port 3000 and `/api` to Express on port 4000, secure with Let's Encrypt SSL.
6. **CD Pipeline**: GitHub Actions workflow (.github/workflows/deploy.yml) automatically triggers builds and runs SSH remote deployment steps when pushed to `main`.
