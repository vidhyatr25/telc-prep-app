# German Learning App Product Plan

## Goals

- Fix pronunciation practice so correct attempts are accepted more reliably.
- Add fresh user accounts with Google login and email/password login.
- Store each user's progress in a database instead of browser-only local storage.
- Redesign the app from an A1-only course into a German course platform.
- Provide complete A1 and A2 courses.
- Show B1 and C1 as coming soon for now.
- Prepare the same product for web, Google Play Store, and Apple App Store.

## Phase 1: Pronunciation Reliability

- Normalize German text before comparison.
- Accept close speech-recognition matches instead of exact-only matches.
- Use all recognition alternatives returned by the browser.
- Show the user what the browser heard.
- Keep listening, slow playback, and normal playback controls.

## Phase 2: Course Structure

- Replace the single A1-only curriculum model with a level-based model:
  - A1: available
  - A2: available
  - B1: coming soon
  - C1: coming soon
- Keep course units, lessons, quizzes, vocabulary, grammar, dialogue, and reading content grouped under each level.
- Update routes to support level-aware paths, for example:
  - `/learn/a1`
  - `/learn/a1/greetings`
  - `/learn/a1/greetings/lesson/1-1`
  - `/learn/a2`
- Keep old A1 links working during migration where practical.

## Phase 3: UI Redesign

- Turn the home page into a course dashboard.
- Show level cards for A1, A2, B1, and C1.
- Show progress per level after login.
- Make A1 and A2 look active and selectable.
- Make B1 and C1 locked with a clear coming-soon state.
- Update navigation to include:
  - Courses
  - Practice
  - Mock Tests
  - Progress
  - Account

## Phase 4: Authentication

- Add Google login.
- Add email/password signup and login.
- Add logout.
- Add account page.
- Add password hashing for email/password accounts.
- Start all deployed users fresh; no local-storage migration is required.

## Phase 5: Database Progress

- Store progress per user:
  - completed lessons
  - quiz scores
  - total XP
  - streak
  - mock test results
  - active course level
- Keep local storage only as a temporary guest/dev fallback if needed.
- Add account deletion because app stores require it when users can create accounts.

## Phase 6: Mobile App Publishing

- Use Capacitor to package the existing Next.js app for Android and iOS.
- Add Android project for Play Store builds.
- Add iOS project for App Store builds.
- Add mobile-friendly auth callback handling.
- Add privacy policy page.
- Add account deletion flow.
- Prepare store review assets:
  - app name
  - screenshots
  - app icon
  - privacy policy URL
  - demo/review account
  - Google Play Data Safety answers
  - Apple App Review notes

## Recommended Build Order

1. Finish pronunciation reliability.
2. Refactor curriculum into levels.
3. Redesign course dashboard and learning pages.
4. Add A2 course content.
5. Add auth and database.
6. Move progress saving to the database.
7. Add account deletion and privacy policy.
8. Add Capacitor and mobile builds.
9. Prepare Play Store and App Store submission.
