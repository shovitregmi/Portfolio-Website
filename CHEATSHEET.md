# Portfolio — Cheat Sheet

A plain-English map of every file/folder, how the pieces talk to each other,
and the exact steps to run it. Keep this open while you work.

---

## 1. The big picture

```
Browser  ──>  frontend (Next.js, port 3000)  ──>  backend (Express API, port 4000)  ──>  PostgreSQL
              "what people see"                    "the logic + rules"                    "where data lives"
```

- The **public site** (`/`) reads data from the API and displays it. It doesn't
  talk to the database directly — only the backend does that.
- The **admin dashboard** (`/admin`) is just a password-protected part of the
  same frontend. It calls the same API, but with extra permission (a login
  cookie) to create/edit/delete things.
- The **backend** is the only thing that touches PostgreSQL. It exposes URLs
  like `/api/projects` that return JSON.

Nothing on the frontend can write to the database without going through the
backend's `requireAuth` check first — that's the whole security model.

---

## 2. Backend — `backend/`

The API server. Talks to PostgreSQL via **Prisma** (a library that lets you
query the database using JavaScript instead of raw SQL).

| File / folder | What it does |
|---|---|
| `package.json` | Lists dependencies (Express, Prisma, JWT, bcrypt...) and the npm scripts you run (`npm run dev`, `npm run seed`, etc). |
| `.env.example` | Template for your secrets/config. Copy to `.env` and fill in real values — `.env` itself is never committed to git. |
| `.gitignore` | Tells git to ignore `node_modules` and `.env`. |
| `prisma/schema.prisma` | **The database blueprint.** Defines every table (Admin, Profile, Skill, Project, Certificate, Message) and their columns. Change this file when you want to add/remove a field, then re-run a migration. |
| `prisma/seed.js` | A one-time script that creates your admin login and some placeholder content, so the site isn't empty on first run. |
| `src/index.js` | **The entry point.** Starts the Express server, wires up security middleware (helmet, CORS, rate limiting), and mounts all the route files under `/api/...`. Run this file and the API is live. |
| `src/config/db.js` | Creates one shared Prisma client so every controller talks to the same database connection pool. |
| `src/utils/jwt.js` | Small helper to create and verify the login token (JWT) used for admin sessions. |
| `src/middleware/auth.js` | The bouncer. `requireAuth` checks the login cookie on every admin-only route and blocks the request if it's missing/invalid. |
| `src/middleware/errorHandler.js` | Catches errors from anywhere in the app and turns them into clean JSON error responses instead of crashing the server. |
| `src/controllers/*.js` | **The actual logic.** One file per data type — e.g. `projectController.js` has the functions that list, create, update, and delete projects. This is where you'd edit *what* an endpoint does. |
| `src/routes/*.js` | **The URL map.** Each file says "when a request hits this URL + method, run this controller function." e.g. `projectRoutes.js` maps `GET /api/projects` → `listProjects`. This is where you'd edit *which URL* triggers what. |

**Data flow example:** someone submits the contact form →
`routes/messageRoutes.js` matches `POST /api/messages` → runs
`controllers/messageController.js`'s `createMessage` → that calls Prisma →
Prisma writes a row into the `Message` table in PostgreSQL.

---

## 3. Frontend — `frontend/`

The Next.js site (uses the **App Router**, meaning folders under `app/`
define your URLs).

| File / folder | What it does |
|---|---|
| `package.json` | Frontend dependencies (Next.js, React, Tailwind) and scripts. |
| `.env.local.example` | Template for `NEXT_PUBLIC_API_URL` — tells the frontend where the backend lives. Copy to `.env.local`. |
| `next.config.js` | Next.js settings — currently just allows loading images from any domain (for project screenshots hosted elsewhere). |
| `tailwind.config.js` | **Design tokens.** Colors, fonts, and animations used across the site. Change a hex code here and it updates everywhere. |
| `postcss.config.js` | Wiring so Tailwind's CSS classes actually compile. You won't need to touch this. |
| `jsconfig.json` | Lets you write `import x from "@/components/x"` instead of long relative paths like `../../components/x`. |
| `app/layout.js` | The outermost wrapper for every page — loads fonts and applies the global background/text color. |
| `app/globals.css` | Base styles and reusable utility classes (`.btn-primary`, `.card`, `.input`, etc.) used throughout the components. |
| `app/page.js` | **The homepage.** Fetches profile/skills/projects/certificates from the API (server-side, before the page even renders) and passes them to the section components. |
| `lib/api.js` | A small fetch wrapper every component uses to talk to the backend — automatically sends the login cookie and throws a readable error on failure. |
| `components/Nav.js` | Top navigation bar with the mobile hamburger menu. |
| `components/Hero.js` | The intro section — the typed `whoami` terminal animation, your name/title/tagline. |
| `components/About.js` | Bio + quick facts (location, email, availability). |
| `components/Skills.js` | Renders your skills, grouped by category, with proficiency bars. |
| `components/Projects.js` | Project cards grid (image, tags, live/source links). |
| `components/Certificates.js` | Certificate list. |
| `components/Contact.js` | The contact form — submits to `POST /api/messages`. |
| `components/Footer.js` | Bottom links (GitHub, LinkedIn, etc). |
| `components/StatusBar.js` | The fixed bar at the very bottom of the screen showing availability + local time — the site's signature visual detail. |
| `app/admin/layout.js` | **The admin bouncer.** Wraps every `/admin/*` page, checks if you're logged in (`GET /api/auth/me`), and redirects to the login page if not. Also renders the admin sidebar. |
| `app/admin/login/page.js` | Login form → `POST /api/auth/login`. |
| `app/admin/dashboard/page.js` | Edit your profile (name, bio, socials, availability toggle). |
| `app/admin/projects/page.js` | Add/edit/delete projects. |
| `app/admin/skills/page.js` | Add/edit/delete skills. |
| `app/admin/certificates/page.js` | Add/edit/delete certificates. |
| `app/admin/messages/page.js` | Read contact-form submissions, mark read/unread, delete. |

**Data flow example:** you edit your bio in `/admin/dashboard` and hit save →
that page calls `api.put("/profile", ...)` → hits the backend's
`PUT /api/profile` → `requireAuth` checks your cookie → `profileController.js`
updates the row → next time anyone loads `/`, `app/page.js` fetches the new
bio and it shows up (within ~60 seconds, since the homepage caches for a
minute).

---

## 4. How to run it (local machine)

You need **Node.js** (v18+) installed, and a PostgreSQL database (Neon/Supabase
free tier is the fastest way to get one — see README.md for links).

### Step 1 — Get a database connection string
Sign up at Neon or Supabase, create a project, copy the connection string
(looks like `postgresql://user:password@host/dbname`).

### Step 2 — Set up the backend
```bash
cd backend
cp .env.example .env
```
Open `.env` and fill in:
- `DATABASE_URL` → paste your connection string
- `JWT_SECRET` → any long random string
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` → the login you'll use for `/admin`

```bash
npm install
npx prisma migrate dev --name init
npm run seed
npm run dev
```
Leave this terminal running. You should see
`Portfolio API listening on http://localhost:4000`.

### Step 3 — Set up the frontend (new terminal)
```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```
Leave this running too. You should see the site is ready at
`http://localhost:3000`.

### Step 4 — Use it
- Public site: **http://localhost:3000**
- Admin login: **http://localhost:3000/admin/login** — use the
  `ADMIN_EMAIL` / `ADMIN_PASSWORD` you set in `backend/.env`.
- Log in, go to Projects/Skills/Certificates/Overview, and replace the
  placeholder content with your real info.

### Common issues
| Symptom | Likely cause |
|---|---|
| Frontend shows placeholder/empty content | Backend isn't running, or `NEXT_PUBLIC_API_URL` in `frontend/.env.local` doesn't match the backend's actual port/URL. |
| "Invalid email or password" on login | Double-check `ADMIN_EMAIL`/`ADMIN_PASSWORD` in `backend/.env`, then re-run `npm run seed` from `backend/`. |
| Prisma errors about missing tables | You skipped `npx prisma migrate dev --name init`, or `DATABASE_URL` is wrong. |
| CORS error in browser console | `CLIENT_ORIGIN` in `backend/.env` doesn't match the URL the frontend is actually running on. |

---

## 5. Where to make common changes

| I want to... | Edit this |
|---|---|
| Change colors/fonts | `frontend/tailwind.config.js` |
| Change section layout/copy structure | The relevant file in `frontend/components/` |
| Add a new field to Projects (e.g. "client name") | `backend/prisma/schema.prisma` → run a new migration → add the field to `projectController.js`, `app/admin/projects/page.js`, and `components/Projects.js` |
| Change what shows in the admin sidebar | `frontend/app/admin/layout.js` (`navItems`) |
| Add a new public API endpoint | Add a function to a `controllers/*.js` file, wire it up in the matching `routes/*.js` file |
