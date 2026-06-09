# TELC Prep App

A German exam-preparation app for TELC-style learning, practice, mock tests, and progress tracking across web and mobile.

The product currently supports complete A1 learning, active A2 course/practice foundations, user accounts, and database-backed progress. B1 and B2 are kept as separate coming-soon tracks so future content does not mix with A1/A2.

## Available

- Course dashboard with A1, A2, B1, and B2 level cards
- German A1 syllabus, lessons, quizzes, pronunciation practice, games, mock tests, and progress tracking
- German A2 syllabus with 10 units, 20 lessons, unit quizzes, A2 vocabulary games, and A2 mock tests
- Level-separated routes for courses, games, and mock tests
- Google login through NextAuth when Google OAuth credentials are configured
- Email/password signup and login
- Prisma-backed user accounts and progress storage
- Guest/local progress fallback before login
- Account page with logout and account deletion
- Privacy and account deletion information pages
- Capacitor setup for Android/iOS packaging

## Coming Soon

- Full B1 and B2 course content
- Larger A2 test bank and deeper speaking evaluation
- Native mobile store assets, signing, and final App Store / Play Store submissions

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React icons
- NextAuth
- Prisma + SQLite for local development
- Capacitor for mobile packaging

## Getting Started

Install dependencies:

```bash
npm install
```

Create local environment values:

```bash
cp .env.example .env
```

For local development, `DATABASE_URL="file:./dev.db"` is enough. To enable Google login, add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.

Generate Prisma client and initialize the local database:

```bash
npm run db:generate
npm run db:init
```

Run the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Useful Scripts

```bash
npm run dev
npm run build
npm run start
npm run db:generate
npm run db:init
npm run cap:sync
npm run cap:android
npm run cap:ios
npx tsc --noEmit
```

## Main Routes

```text
/                         Course dashboard
/learn                    A1 syllabus
/learn/a2                 A2 syllabus
/learn/a2/[unitSlug]      A2 unit detail
/learn/a2/[unitSlug]/quiz A2 unit quiz
/games                    Games level selector
/games/a1                 A1 games
/games/a2                 A2 games
/mock-tests               Mock test level selector
/mock-tests/a1            A1 mock tests
/mock-tests/a2            A2 mock tests
/mock-tests/a2/[id]       A2 mock test runner
/progress                 Progress tracking
/login                    Login and signup
/account                  Account dashboard
/privacy                  Privacy page
/delete-account           Account deletion information
```

## Mobile Packaging

Capacitor is configured with app id `com.telcprep.app` and app name `TELC Prep`.

Because the app uses authentication and API routes, mobile builds should point to a deployed backend with `CAPACITOR_SERVER_URL` or use a production hosting strategy that preserves the Next.js server features.

See `docs/mobile-store-checklist.md` for the Android/iOS publishing checklist.

## Verification

Recommended checks before shipping changes:

```bash
npm run db:init
npx tsc --noEmit
npm run build
```
