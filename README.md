# TELC Prep App

A German exam-preparation web app focused on TELC-style learning, practice, and progress tracking.

The app currently provides a complete **German A1** learning experience with syllabus units, vocabulary practice, pronunciation practice, games, quizzes, mock tests, and progress tracking. Higher levels are structured separately so A2, B1, and B2 can be added without mixing content across levels.

## Current Status

### Available

- German A1 course dashboard
- A1 syllabus and unit path
- A1 lessons with vocabulary, grammar, dialogue, and reading content
- A1 unit quizzes
- A1 pronunciation practice
- A1 games:
  - flashcards
  - memory game
  - word match
- A1 TELC-style mock tests
- Progress page with XP, streak, quiz history, and lesson completion
- Level-separated routes for courses, games, and mock tests

### Planned

- A2 full course content
- A2 games and mock tests
- B1 and B2 courses
- Google login
- email/password login
- database-backed user progress
- account deletion and privacy pages
- mobile app packaging for Play Store and App Store

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React icons
- Local storage for current progress tracking

## Getting Started

Install dependencies:

```bash
npm install
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
npx tsc --noEmit
```

Note: `npm run lint` may ask to configure ESLint if the local Next.js lint setup has not been initialized yet.

## Main Routes

```text
/                  Course dashboard
/learn             German A1 syllabus
/learn/[slug]      A1 unit detail
/learn/[slug]/quiz A1 unit quiz
/games             Games level selector
/games/a1          A1 games
/mock-tests        Mock test level selector
/mock-tests/a1     A1 mock tests
/mock-tests/[id]   A1 mock test runner
/progress          Progress tracking
```

## Product Structure

The app separates learning by level:

- A1: enabled
- A2: preparing
- B1: coming soon
- B2: coming soon

Games and mock tests are also separated by level, so future A2/B1/B2 practice can use different vocabulary pools, question banks, exam formats, and scoring rules.

## Development Notes

- Current progress is stored in browser `localStorage`.
- The next major backend step is adding authentication and database-backed progress.
- Pronunciation practice uses browser speech recognition, so accuracy depends on the browser and microphone.
- The app is designed for web first, with a planned Capacitor-based mobile packaging path later.

## Verification

Recent checks:

- TypeScript check passes with `npx tsc --noEmit`
- Full local route sweep passed across course, lesson, quiz, games, mock test, and progress routes

## Roadmap

1. Add authentication with Google and email/password.
2. Add database-backed progress per user.
3. Add privacy policy and account deletion pages.
4. Build complete A2 syllabus, lessons, games, and mock tests.
5. Add B1/B2 course shells and later full content.
6. Package the web app for Android/iOS with Capacitor.
7. Prepare Play Store and App Store submission requirements.
