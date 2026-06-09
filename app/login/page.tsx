"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getProviders, signIn, useSession } from "next-auth/react";
import type { ClientSafeProvider } from "next-auth/react";
import { BookOpen, Mail } from "lucide-react";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md px-4 py-10 text-sm text-gray-400">Loading login...</div>}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const [providers, setProviders] = useState<Record<string, ClientSafeProvider> | null>(null);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const callbackUrl = searchParams.get("callbackUrl") ?? "/account";

  useEffect(() => {
    getProviders().then(setProviders);
  }, []);

  useEffect(() => {
    if (status === "authenticated") router.replace(callbackUrl);
  }, [callbackUrl, router, status]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    if (mode === "signup") {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error ?? "Could not create account.");
        setLoading(false);
        return;
      }
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    setLoading(false);
    if (result?.error) {
      setError(mode === "signup" ? "Account created, but login failed." : "Invalid email or password.");
      return;
    }

    router.push(callbackUrl);
  };

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <div className="card p-6">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-400 text-gray-950">
            <BookOpen size={24} />
          </div>
          <h1 className="mt-4 text-2xl font-extrabold text-white">
            {mode === "login" ? "Login" : "Create account"}
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Save your TELC progress across devices.
          </p>
        </div>

        {providers?.google && (
          <button
            onClick={() => signIn("google", { callbackUrl })}
            className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 font-semibold text-white transition-colors hover:border-gray-500"
          >
            Continue with Google
          </button>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === "signup" && (
            <label className="block">
              <span className="text-xs font-bold uppercase text-gray-500">Name</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-800 bg-gray-950 px-4 py-3 text-white outline-none focus:border-yellow-400"
                placeholder="Your name"
              />
            </label>
          )}

          <label className="block">
            <span className="text-xs font-bold uppercase text-gray-500">Email</span>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              required
              className="mt-1 w-full rounded-xl border border-gray-800 bg-gray-950 px-4 py-3 text-white outline-none focus:border-yellow-400"
              placeholder="you@example.com"
            />
          </label>

          <label className="block">
            <span className="text-xs font-bold uppercase text-gray-500">Password</span>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              required
              minLength={8}
              className="mt-1 w-full rounded-xl border border-gray-800 bg-gray-950 px-4 py-3 text-white outline-none focus:border-yellow-400"
              placeholder="At least 8 characters"
            />
          </label>

          {error && (
            <p className="rounded-xl border border-red-500/30 bg-red-900/20 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}

          <button disabled={loading} className="btn-primary flex w-full items-center justify-center gap-2 disabled:opacity-60">
            <Mail size={18} />
            {loading ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
          </button>
        </form>

        <button
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setError("");
          }}
          className="mt-4 w-full text-center text-sm font-semibold text-yellow-400 hover:text-yellow-300"
        >
          {mode === "login" ? "Need an account? Sign up" : "Already have an account? Login"}
        </button>

        <div className="mt-5 flex justify-center gap-4 text-xs text-gray-500">
          <Link href="/privacy" className="hover:text-gray-300">Privacy</Link>
          <Link href="/delete-account" className="hover:text-gray-300">Delete account</Link>
        </div>
      </div>
    </div>
  );
}
