"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, FileText, Gamepad2, Globe, Home, LogIn, TrendingUp, User } from "lucide-react";
import { SessionProvider, useSession } from "next-auth/react";
import { LanguageProvider, useLang } from "@/contexts/LanguageContext";
import { ProgressProvider } from "@/contexts/ProgressContext";
import { t } from "@/data/translations";
import { cn } from "@/lib/utils";

function Navbar() {
  const { lang, toggle } = useLang();
  const { data: session } = useSession();
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: t.home[lang], icon: Home },
    { href: "/learn", label: t.learn[lang], icon: BookOpen },
    { href: "/games", label: t.games[lang], icon: Gamepad2 },
    { href: "/mock-tests", label: t.mockTest[lang], icon: FileText },
    { href: "/progress", label: t.progress[lang], icon: TrendingUp },
  ];

  return (
    <>
      <header className="hidden md:flex fixed top-0 left-0 right-0 z-50 h-16 items-center border-b border-gray-800 bg-gray-950/95 px-6 backdrop-blur">
        <Link href="/" className="mr-10 flex shrink-0 items-center gap-2 text-xl font-bold text-yellow-400">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-400 text-sm font-extrabold text-gray-950">
            DE
          </span>
          <span>Deutsch TELC</span>
        </Link>

        <nav className="flex flex-1 justify-center gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all",
                  active
                    ? "bg-yellow-400/10 text-yellow-400"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                )}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={toggle}
          className="flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
        >
          <Globe size={16} />
          {lang === "en" ? "DE" : "EN"}
        </button>
        <Link
          href={session ? "/account" : "/login"}
          className="ml-2 flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
        >
          {session ? <User size={16} /> : <LogIn size={16} />}
          {session ? "Account" : "Login"}
        </Link>
      </header>

      <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-gray-800 bg-gray-950/95 backdrop-blur md:hidden">
        {navLinks.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs transition-all",
                active ? "text-yellow-400" : "text-gray-500"
              )}
            >
              <Icon size={20} />
              <span className="max-w-[3rem] truncate text-center">{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ProgressProvider>
        <LanguageProvider>
          <div className="min-h-screen bg-gray-950 text-white">
            <Navbar />
            <main className="min-h-screen pb-20 pt-0 md:pb-6 md:pt-16">{children}</main>
          </div>
        </LanguageProvider>
      </ProgressProvider>
    </SessionProvider>
  );
}
