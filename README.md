# Portfolio — Full-Stack (Next.js + Express + PostgreSQL)

A complete personal portfolio site: a public site (hero, about, skills, projects,
certificates, contact form) backed by a real database, plus an admin dashboard
where you log in and edit everything without touching code.

```
portfolio/
  backend/    Express API + Prisma + PostgreSQL
  frontend/   Next.js (App Router) + Tailwind CSS
```

## How it fits together

- **backend/** is a REST API. It stores your profile, skills, projects,
  certificates, and contact-form messages in PostgreSQL, and handles admin
  login with a JWT stored in an httpOnly cookie.
- **frontend/** is the site people see. The homepage fetches your content
  from the API on every request (revalidated every 60s). `/admin` is a
  password-protected dashboard that calls the same API to create, edit, and
  delete content.

## 1. Local setup

### Database

You need a PostgreSQL database. Easiest options:
- [Neon](https://neon.tech) — free tier, serverless Postgres.
- [Supabase](https://supabase.com) — free tier, includes a Postgres DB.
- Or run Postgres locally / in Docker.

Either way, grab the connection string — it looks like
`postgresql://user:password@host:5432/dbname`.

### Backend

```bash
cd backend
cp .env.example .env
# edit .env: paste your DATABASE_URL, set a real JWT_SECRET,
# and set ADMIN_EMAIL / ADMIN_PASSWORD to your own login

npm install
npx prisma migrate dev --name init   # creates the tables
npm run seed                         # creates your admin account + placeholder content
npm run dev                          # starts the API on http://localhost:4000
```

### Frontend

```bash
cd frontend
cp .env.local.example .env.local
# edit .env.local if your API isn't on localhost:4000

npm install
npm run dev                          # starts the site on http://localhost:3000
```

Visit `http://localhost:3000` for the public site and
`http://localhost:3000/admin/login` to log in with the admin email/password
you set in `backend/.env`.

## 2. Editing your content

Everything on the homepage — your name, bio, skills, projects, certificates,
social links, and availability status — comes from the database, editable at
`/admin`. There is no need to touch component code to update your info;
just log in and use the dashboard. The placeholder content the seed script
creates is meant to be replaced there.

If you do want to change layout, colors, or copy structure, the design
tokens live in `frontend/tailwind.config.js` and `frontend/app/globals.css`.

## 3. Deploying (Vercel + Neon/Supabase)

**Database:** create a project on Neon or Supabase, copy the connection
string.

**Backend:** deploy `backend/` anywhere that runs Node (Render, Railway,
Fly.io, a VPS, etc. — Vercel itself is not ideal for a long-running Express
server, so a small always-on host is recommended for the API). Set these
environment variables there:
- `DATABASE_URL` — your Neon/Supabase connection string
- `JWT_SECRET` — a long random string
- `CLIENT_ORIGIN` — your deployed frontend URL, e.g. `https://yourname.vercel.app`
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`
- `NODE_ENV=production`

Then run once: `npx prisma migrate deploy` and `npm run seed`.

**Frontend:** import `frontend/` into Vercel as a new project. Set:
- `NEXT_PUBLIC_API_URL` — your deployed backend URL + `/api`, e.g.
  `https://your-api.onrender.com/api`

Deploy. Your site will be live, and `/admin/login` will let you manage
content from anywhere.

## 4. Security notes

- Change `ADMIN_PASSWORD` and `JWT_SECRET` before deploying — the defaults
  in `.env.example` are placeholders only.
- The contact form and login endpoints are rate-limited to reduce abuse.
- Admin routes on the backend all require a valid session cookie
  (`requireAuth` middleware) — the CRUD endpoints for skills, projects,
  certificates, and profile cannot be written to without logging in.
