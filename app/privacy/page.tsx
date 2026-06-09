import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <article className="card p-6 space-y-5">
        <div>
          <p className="text-sm font-bold text-yellow-400">Privacy</p>
          <h1 className="mt-1 text-3xl font-extrabold text-white">Privacy Policy</h1>
          <p className="mt-2 text-sm text-gray-400">Last updated: June 9, 2026</p>
        </div>

        <section className="space-y-2 text-sm leading-relaxed text-gray-300">
          <h2 className="font-bold text-white">What we collect</h2>
          <p>
            If you create an account, we store your email address, optional display name, login provider,
            and learning progress such as completed lessons, XP, quiz scores, and mock test results.
          </p>
        </section>

        <section className="space-y-2 text-sm leading-relaxed text-gray-300">
          <h2 className="font-bold text-white">How we use it</h2>
          <p>
            Account data is used to authenticate you and save your TELC learning progress across devices.
            We do not sell personal data.
          </p>
        </section>

        <section className="space-y-2 text-sm leading-relaxed text-gray-300">
          <h2 className="font-bold text-white">Local storage</h2>
          <p>
            Guest progress may be stored locally in your browser. Logged-in progress is stored in the app database.
          </p>
        </section>

        <section className="space-y-2 text-sm leading-relaxed text-gray-300">
          <h2 className="font-bold text-white">Account deletion</h2>
          <p>
            You can delete your account and saved progress from the account page. Deletion removes your user account,
            login connections, sessions, and saved progress.
          </p>
        </section>

        <Link href="/account" className="btn-primary inline-flex">Manage account</Link>
      </article>
    </div>
  );
}
