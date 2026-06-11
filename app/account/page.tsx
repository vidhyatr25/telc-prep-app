"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LogOut, ShieldAlert, User } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { useProgress } from "@/contexts/ProgressContext";

const copy = {
  en: {
    loading: "Loading account...",
    required: "Login required",
    requiredDescription: "Create an account to save progress across devices.",
    login: "Login",
    confirmDelete: "Type DELETE MY ACCOUNT to permanently delete your account and all saved progress.",
    deleteError: "Could not delete account. Please try again.",
    eyebrow: "Account",
    title: "Your TELC account",
    description: "Manage login, saved progress, and account deletion.",
    learner: "TELC learner",
    totalXp: "Total XP",
    streak: "Streak",
    mockTests: "Mock tests",
    actions: "Account actions",
    logout: "Logout",
    deleting: "Deleting...",
    deleteAccount: "Delete account",
    privacy: "Privacy policy",
    deletionInfo: "Deletion info",
  },
  de: {
    loading: "Konto wird geladen...",
    required: "Login erforderlich",
    requiredDescription: "Erstelle ein Konto, um deinen Fortschritt auf allen Geraeten zu speichern.",
    login: "Einloggen",
    confirmDelete: "Tippe DELETE MY ACCOUNT ein, um dein Konto und deinen gespeicherten Fortschritt dauerhaft zu loeschen.",
    deleteError: "Konto konnte nicht geloescht werden. Bitte erneut versuchen.",
    eyebrow: "Konto",
    title: "Dein TELC Konto",
    description: "Verwalte Login, gespeicherten Fortschritt und Kontoloeschung.",
    learner: "TELC Lernender",
    totalXp: "Gesamt XP",
    streak: "Serie",
    mockTests: "Probepruefungen",
    actions: "Kontoaktionen",
    logout: "Ausloggen",
    deleting: "Wird geloescht...",
    deleteAccount: "Konto loeschen",
    privacy: "Datenschutz",
    deletionInfo: "Loeschinfo",
  },
};

export default function AccountPage() {
  const router = useRouter();
  const { lang } = useLang();
  const { data: session, status } = useSession();
  const { progress } = useProgress();
  const c = copy[lang];
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  if (status === "loading") {
    return <div className="px-4 py-10 text-center text-gray-400">{c.loading}</div>;
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-md px-4 py-10 text-center">
        <div className="card p-6">
          <h1 className="text-2xl font-extrabold text-white">{c.required}</h1>
          <p className="mt-2 text-sm text-gray-400">{c.requiredDescription}</p>
          <Link href="/login" className="btn-primary mt-5 inline-flex">{c.login}</Link>
        </div>
      </div>
    );
  }

  const deleteAccount = async () => {
    const confirmation = window.prompt(c.confirmDelete);
    if (confirmation !== "DELETE MY ACCOUNT") return;

    setDeleting(true);
    setError("");
    const response = await fetch("/api/account", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ confirmation }),
    });
    if (!response.ok) {
      setError(c.deleteError);
      setDeleting(false);
      return;
    }

    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-5">
      <div>
        <p className="text-sm font-bold text-yellow-400">{c.eyebrow}</p>
        <h1 className="mt-1 text-3xl font-extrabold text-white">{c.title}</h1>
        <p className="mt-2 text-sm text-gray-400">{c.description}</p>
      </div>

      <section className="card p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-800 bg-gray-950 text-yellow-400">
            <User size={22} />
          </div>
          <div>
            <p className="font-bold text-white">{session.user?.name ?? c.learner}</p>
            <p className="text-sm text-gray-400">{session.user?.email}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <Stat label={c.totalXp} value={`${progress.totalXP}`} />
        <Stat label={c.streak} value={`${progress.streak}d`} />
        <Stat label={c.mockTests} value={`${progress.mockTestResults.length}`} />
      </section>

      <section className="card p-5 space-y-4">
        <h2 className="font-bold text-white">{c.actions}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <button onClick={() => signOut({ callbackUrl: "/" })} className="btn-secondary flex items-center justify-center gap-2">
            <LogOut size={17} />
            {c.logout}
          </button>
          <button
            onClick={deleteAccount}
            disabled={deleting}
            className="flex items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-900/20 px-5 py-2.5 font-semibold text-red-300 transition-colors hover:bg-red-900/30 disabled:opacity-60"
          >
            <ShieldAlert size={17} />
            {deleting ? c.deleting : c.deleteAccount}
          </button>
        </div>
        {error && <p className="text-sm text-red-300">{error}</p>}
        <div className="flex gap-4 text-sm text-gray-500">
          <Link href="/privacy" className="hover:text-gray-300">{c.privacy}</Link>
          <Link href="/delete-account" className="hover:text-gray-300">{c.deletionInfo}</Link>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-4">
      <p className="text-xs font-bold uppercase text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-extrabold text-white">{value}</p>
    </div>
  );
}
