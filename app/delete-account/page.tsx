import Link from "next/link";

export default function DeleteAccountPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="card p-6 space-y-5">
        <div>
          <p className="text-sm font-bold text-red-300">Account deletion</p>
          <h1 className="mt-1 text-3xl font-extrabold text-white">Delete your account</h1>
          <p className="mt-2 text-sm leading-relaxed text-gray-400">
            App stores require a clear way for users to delete accounts. This page explains the flow.
          </p>
        </div>

        <div className="rounded-xl border border-red-500/30 bg-red-900/20 p-4 text-sm leading-relaxed text-red-100">
          Deleting your account removes your profile, login connections, sessions, and saved progress. This action
          cannot be undone.
        </div>

        <ol className="list-decimal space-y-2 pl-5 text-sm text-gray-300">
          <li>Login to your account.</li>
          <li>Open the Account page.</li>
          <li>Select Delete account.</li>
          <li>Type DELETE MY ACCOUNT in the confirmation prompt.</li>
        </ol>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/account" className="btn-primary inline-flex justify-center">
            Go to account
          </Link>
          <Link href="/privacy" className="btn-secondary inline-flex justify-center">
            Privacy policy
          </Link>
        </div>
      </div>
    </div>
  );
}
