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

**Live site:** https://portfolio-kappa-six-u5zrf3x6gl.vercel.app

- Web: Vercel (team `racs`, project `portfolio`) — pushes to `main` auto-deploy
- Build config lives in `vercel.json`; the Vercel project's **Root Directory** is `apps/web`
  while `installCommand` runs at the repo root so npm workspaces resolve `@portfolio/*`
- Environment variables are set for `production` and `preview` (`vercel env ls`).
  Secrets (`ADMIN_PASSWORD`, `AUTH_SECRET`, `CAPTCHA_SECRET`, `SMTP_PASS`,
  `GEMINI_API_KEY`) are stored as encrypted secrets
- Storage: on Vercel the JSON store is ephemeral — `apps/web/.data/db.json` is read
  at runtime but admin writes do not persist. Point `SUPABASE_*` at a database for
  durable editing
- The local JSON store is traced into the deployment via `outputFileTracingIncludes`
  in `apps/web/next.config.ts`; without it the deployed site falls back to the
  in-code seed
- Mobile: EAS (`npx expo build`)

### Lockfile note

The root `package-lock.json` is authoritative (npm workspaces). npm only records
optional platform binaries for the host OS, so the Linux builds of
`@tailwindcss/oxide`, `@next/swc` and `@unrs/resolver-binding` were merged in
manually. If you ever regenerate the lockfile with `npm install` on Windows, re-add
those entries or the Vercel build fails with `Cannot find native binding`.

