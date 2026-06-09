# Mobile Store Checklist

This app can be packaged with Capacitor after the web app is deployed with working auth and database APIs.

## Capacitor

The Capacitor config is in `capacitor.config.ts`.

For a hosted production backend, set:

```bash
CAPACITOR_SERVER_URL="https://your-production-domain.com"
```

Then run:

```bash
npm run cap:sync
```

Android and iOS projects can be added with:

```bash
npx cap add android
npx cap add ios
```

Open native projects:

```bash
npm run cap:android
npm run cap:ios
```

## Store Requirements

- Production app URL
- Privacy policy URL
- Account deletion flow
- Demo/review account
- App icon
- Screenshots for required device sizes
- Google OAuth production callback URLs
- Google Play Data Safety answers
- Apple App Privacy answers
- Clear support/contact email

## Account Deletion

The app includes:

- `/delete-account`
- `/privacy`
- authenticated account deletion from `/account`

## Important

Because this app uses authentication and server APIs, mobile builds should use a deployed web backend.
Pure static export is not enough for the full logged-in product unless the auth/database backend is moved to a separate API service.
