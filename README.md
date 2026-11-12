# Portfolio — Marcus Mallari

Single-page professional portfolio + admin dashboard, built with Next.js, TypeScript, Tailwind CSS v4, and Framer Motion.

> **"Where Business Meets Technology."**

## Structure

- `apps/web` — Next.js portfolio, admin dashboard, and API routes
- `apps/mobile` — Expo React Native companion app
- `packages/*` — shared types and utilities
- `supabase/` — optional SQL schema (the app currently uses a local JSON store at `apps/web/.data/`)

## Quick start

```bash
npm install
npm run dev:web        # http://localhost:3000
```

Configure the app by copying `.env.example` to `apps/web/.env.local` and filling in values. The admin
account is created automatically from `ADMIN_EMAIL` / `ADMIN_PASSWORD` (stored scrypt-hashed) on first
login. Session and captcha signing require `AUTH_SECRET` / `CAPTCHA_SECRET`.

## Admin dashboard

Route: `/admin` — manage projects, skills, experience, education, certifications, blog, messages,
profile, resume, and site settings. Login uses credentials + math captcha + email OTP.

Content entered in the admin dashboard is persisted to `apps/web/.data/db.json`; uploaded images and
resume PDFs go to `apps/web/.data/uploads/` and are served via `/api/uploads/<file>`.

## Scripts (root)

```bash
npm run dev:web      # develop
npm run build:web    # production build
npm run lint:web     # eslint
```

## Deployment

- Web: Vercel (set the env vars from `.env.example` in the dashboard)
- Storage: on Vercel the JSON store is ephemeral — point `SUPABASE_*` at your database or attach a volume for `.data/`
- Mobile: EAS (`npx expo build`)
