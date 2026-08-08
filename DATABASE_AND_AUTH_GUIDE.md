# PostgreSQL, .env, and How Everything Connects

This is written assuming you've never touched a database before. It covers:
1. What a database actually is
2. Getting a free PostgreSQL database running (no install needed)
3. Filling in `.env`, field by field
4. Peeking inside your database
5. A real walkthrough of how login/auth works, file by file
6. A real walkthrough of how the frontend and backend talk, file by file

---

## 1. What is a database, really?

Forget the mystique — a database is just **organized storage**, like a set of
spreadsheets that other programs can read/write reliably and quickly.

- A **database** is the whole spreadsheet workbook (in our case, one database
  called `portfolio`).
- A **table** is one sheet in that workbook. Your project has 6 tables:
  `Admin`, `Profile`, `Skill`, `Project`, `Certificate`, `Message`.
- A **row** is one entry — one project, one skill, one message.
- A **column** is a field every row has — a `Project` row has columns like
  `title`, `summary`, `liveUrl`.

**PostgreSQL** ("Postgres") is the software that stores and manages this data
on disk and answers questions like "give me all Projects where `featured` is
true." It's not a website or an app — it's a background service that just
sits there holding your data and responding to queries.

**Prisma** (used in `backend/prisma/schema.prisma`) is a translator: instead
of writing raw SQL like `SELECT * FROM "Project" WHERE featured = true`, your
controller code writes `prisma.project.findMany({ where: { featured: true } })`
and Prisma converts that into real SQL behind the scenes.

You never connect to Postgres directly from the frontend, and rarely by hand
at all — Prisma does it for you, using the address you give it in `.env`.

---

## 2. Getting a free PostgreSQL database (Neon — recommended for beginners)

You don't need to install Postgres on your computer. **Neon** gives you a
real, hosted PostgreSQL database in about 2 minutes, for free.

1. Go to **https://neon.tech** and sign up (GitHub/Google login is fastest).
2. Click **Create a project**. Give it any name, e.g. `portfolio`.
3. Neon creates a default database for you (often called `neondb`) and shows
   you a **connection string** — a long line starting with `postgresql://`.
   It looks like:
   ```
   postgresql://neondb_owner:AbC123xyz@ep-cool-water-12345.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
4. **Copy that entire string.** That's your `DATABASE_URL`. It already
   contains your username, password, server address, and database name, all
   in one line — that's why `.env` only needs one line for the whole
   connection.
5. Keep this tab open — you'll need to come back to it if you ever forget
   the string (Neon dashboard → your project → **Connection Details**).

That's it. Neon is now running Postgres for you somewhere in the cloud;
your app just needs that one string to reach it.

*(Supabase works almost identically if you'd rather use that — sign up,
create a project, and find the connection string under
Project Settings → Database → Connection string → "URI".)*

---

## 3. Filling in `backend/.env`, field by field

Run `cp .env.example .env` inside `backend/` first, then open `.env` in an
editor. Here's what every line actually means:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/portfolio"
```
Replace this whole value with the connection string you copied from Neon.
This is the **only** setting Prisma needs to find and log into your database.
Nothing else in this file talks to Postgres.

```bash
PORT=4000
```
The port your backend API runs on locally. `http://localhost:4000` is where
it'll listen. You normally don't need to change this unless port 4000 is
already used by something else on your machine.

```bash
NODE_ENV=development
```
Tells the app whether it's running on your machine (`development`) or on a
real server (`production`). This changes small behaviors — e.g. login
cookies are stricter in production (see the auth section below).

```bash
CLIENT_ORIGIN="http://localhost:3000"
```
The exact URL of your frontend. The backend uses this as an allow-list —
it only accepts requests (and lets cookies through) from URLs listed here.
Locally this is `http://localhost:3000`. When you deploy, you'll change this
to your real domain, e.g. `https://yourname.vercel.app`.

```bash
JWT_SECRET="change-this-to-a-long-random-string"
```
A private password *for the server itself* — it's used to digitally sign
admin login tokens so they can't be forged. It should be long, random, and
never shared or committed to git. You can generate one with:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

```bash
JWT_EXPIRES_IN="7d"
```
How long an admin login session lasts before you have to log in again.
`7d` = 7 days. You could set `1h`, `30d`, etc.

```bash
COOKIE_NAME="portfolio_token"
```
The name of the browser cookie that stores your login session. Any string
works — it just needs to be consistent (the code reads this same name
everywhere).

```bash
ADMIN_EMAIL="you@example.com"
ADMIN_PASSWORD="change-this-password"
ADMIN_NAME="Your Name"
```
These three are only used **once**, when you run `npm run seed`. That
script reads them and creates your one admin account in the `Admin` table
(with the password encrypted — see below). After you've seeded, changing
these values in `.env` does nothing unless you re-run the seed script.

---

## 4. What actually happens when you run the setup commands

```bash
npm install
```
Downloads all the libraries listed in `package.json` (Express, Prisma,
bcrypt, etc.) into a `node_modules` folder.

```bash
npx prisma migrate dev --name init
```
This is the one that **actually creates your tables**. Prisma reads
`prisma/schema.prisma`, connects to the database using your `DATABASE_URL`,
and runs the SQL needed to create the `Admin`, `Profile`, `Skill`,
`Project`, `Certificate`, and `Message` tables. It also creates a
`prisma/migrations/` folder recording exactly what it did — this is your
database's version history. If you ever change `schema.prisma` (e.g. add a
new field), you run this command again with a new `--name` to apply the
change.

```bash
npm run seed
```
Runs `prisma/seed.js`. This is a plain script that:
- Encrypts `ADMIN_PASSWORD` with **bcrypt** (a one-way hash — the real
  password is never stored anywhere, only a scrambled version that can be
  checked but not reversed) and inserts a row into `Admin`.
- Inserts one placeholder `Profile` row, a few placeholder `Skill` rows,
  one placeholder `Project`, and one placeholder `Certificate` — just so
  the site isn't empty the first time you look at it.

```bash
npm run dev
```
Starts the actual API server (`src/index.js`), which opens a live
connection to your database via Prisma and starts listening for HTTP
requests on port 4000.

---

## 5. Looking inside your database

You don't have to guess what's in there. Prisma includes a free visual
browser:

```bash
cd backend
npx prisma studio
```

This opens `http://localhost:5555` in your browser — a spreadsheet-style
view of every table, where you can see, and even manually edit or delete,
rows. Great for sanity-checking that the seed script worked, or that a
contact-form message actually got saved.

You can also always go back to your Neon dashboard → **Tables** to see the
same data from Neon's own UI.

---

## 6. How login/authentication actually works — a real walkthrough

Let's trace exactly what happens when you type your email/password into
`/admin/login` and hit submit.

**Step 1 — You submit the form**
`frontend/app/admin/login/page.js` collects `email` and `password` from the
form fields and calls:
```js
await api.post("/auth/login", form);
```

**Step 2 — The frontend sends the request**
`frontend/lib/api.js`'s `request()` function sends this as a real HTTP
request:
```
POST http://localhost:4000/api/auth/login
Content-Type: application/json
{ "email": "...", "password": "..." }
```
It also sets `credentials: "include"`, meaning "let this request send/receive
cookies" — important for later steps.

**Step 3 — The backend receives it**
`backend/src/index.js` has `app.use("/api/auth", authRoutes)`, so the
request is handed to `backend/src/routes/authRoutes.js`, which matches
`POST /login` and calls the `login` function.

**Step 4 — The backend checks your credentials**
In `backend/src/controllers/authController.js`, `login()`:
1. Looks up the `Admin` row matching your email via Prisma.
2. Uses `bcrypt.compare(password, admin.passwordHash)` to check your typed
   password against the encrypted one — without ever decrypting it.
3. If it matches, calls `signToken(...)` (`backend/src/utils/jwt.js`), which
   creates a **JWT** — a signed, tamper-proof string containing your admin
   id/email, valid for `JWT_EXPIRES_IN` (7 days by default).

**Step 5 — The backend sends the token back as a cookie**
```js
res.cookie(cookieName(), token, cookieOptions());
```
This tells the browser "store this token as a cookie named
`portfolio_token`, and automatically attach it to future requests to this
API." It's marked `httpOnly`, meaning JavaScript in the browser can't read
it (protects against theft via malicious scripts) — the browser just
carries it silently.

**Step 6 — The frontend redirects you in**
Back in `login/page.js`, the request succeeded, so it runs
`router.replace("/admin/dashboard")`.

**Step 7 — Every admin page checks you're still logged in**
`frontend/app/admin/layout.js` wraps every `/admin/*` page. On load, it
calls `api.get("/auth/me")`. Because of `credentials: "include"`, your
browser automatically attaches the `portfolio_token` cookie to this request
— you don't type anything again.

**Step 8 — The backend verifies the cookie on every protected request**
`backend/src/middleware/auth.js`'s `requireAuth` runs before any admin-only
route (creating a project, editing your profile, etc). It reads the cookie,
calls `verifyToken()`, and either:
- succeeds → attaches `req.admin` and lets the request through, or
- fails/missing → responds `401 Not authenticated`, which the frontend
  layout catches and redirects you back to `/admin/login`.

**In short:** the password is only ever checked once, at login. After that,
a signed cookie proves who you are on every request, and `requireAuth` is
the single gatekeeper protecting every write operation (create/update/delete)
across skills, projects, certificates, and your profile.

---

## 7. How the frontend and backend connect — two real examples

### Example A: A visitor loads your homepage (read)

1. Someone visits `http://localhost:3000/`.
2. `frontend/app/page.js` is a **server component** — it runs on the
   server, before any HTML is sent to the browser. It calls:
   ```js
   safeFetch("/projects", [])
   safeFetch("/profile", null)
   // ...etc
   ```
3. Each of those hits the backend, e.g. `GET http://localhost:4000/api/projects`.
4. `backend/src/routes/projectRoutes.js` matches `GET /` → runs
   `listProjects` in `projectController.js` → `prisma.project.findMany()`
   → Postgres returns the rows → they come back as JSON.
5. `page.js` passes that JSON as props into `components/Projects.js`, which
   renders the actual cards.
6. This whole page is cached for 60 seconds (`export const revalidate = 60`
   in `page.js`), so it's not hitting your database on literally every
   single visitor — only once a minute at most.

No login, no cookie needed — this is public data.

### Example B: You add a new project from the admin dashboard (write)

1. You're on `/admin/projects`, logged in (cookie already set from the
   login flow above).
2. You fill out the form and submit. `frontend/app/admin/projects/page.js`
   calls:
   ```js
   await api.post("/projects", payload);
   ```
3. The browser sends `POST http://localhost:4000/api/projects` **with your
   `portfolio_token` cookie attached automatically**.
4. `backend/src/routes/projectRoutes.js` matches `POST /`, but notice the
   route is defined as:
   ```js
   router.post("/", requireAuth, createProject);
   ```
   `requireAuth` runs first. If your cookie is missing/expired, the request
   is rejected right here with `401` — `createProject` never even runs.
5. If you're validly logged in, `createProject` in `projectController.js`
   runs: it generates a URL-friendly `slug` from your title, then
   `prisma.project.create({ data: {...} })` inserts the new row into
   Postgres.
6. The new project comes back as JSON; the admin page calls `load()` again
   to refresh its list, and you see it appear.
7. The **next time** anyone loads the public homepage (after the 60-second
   cache expires), `Example A`'s flow runs again and your new project shows
   up there too.

This is the whole pattern for every admin action (editing your profile,
adding a skill, deleting a certificate, reading contact messages) — same
five steps: form → `api.js` → route file → `requireAuth` gate →
controller → Prisma → Postgres.

---

## 8. File-by-file, condensed

*(Full descriptions are in `CHEATSHEET.md` — this is the quick-glance version.)*

### Backend
```
src/index.js                 starts the server, wires up all routes
src/config/db.js              the shared Prisma (database) connection
src/utils/jwt.js              creates/checks login tokens
src/middleware/auth.js        the login gatekeeper (requireAuth)
src/middleware/errorHandler.js turns errors into clean JSON responses
src/controllers/*.js          the logic — what each action actually does
src/routes/*.js               the URL map — which route runs which controller
prisma/schema.prisma          defines your database tables
prisma/seed.js                creates your admin login + placeholder data
```

### Frontend
```
app/layout.js                 wraps every page (fonts, global styles)
app/page.js                   the public homepage (fetches + renders everything)
app/globals.css               shared utility classes + base styles
lib/api.js                    the one place that talks to the backend
components/*.js               one file per homepage section
app/admin/layout.js           the login gatekeeper for /admin pages
app/admin/login/page.js       the login form
app/admin/dashboard/page.js   edit your profile/bio
app/admin/projects/page.js    manage projects
app/admin/skills/page.js      manage skills
app/admin/certificates/page.js manage certificates
app/admin/messages/page.js    read contact-form submissions
```
