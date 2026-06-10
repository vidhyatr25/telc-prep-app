"use client";

import Link from "next/link";
import { BookOpen, CheckCircle, Clock, Lock } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { courseLevels } from "@/data/curriculum";
import type { Lang } from "@/data/translations";
import { cn } from "@/lib/utils";
import { Breadcrumbs } from "@/components/Breadcrumbs";

type PracticeKind = "games" | "mock-tests";

const copy = {
  en: {
    games: {
      eyebrow: "Practice Games",
      title: "Choose a level for games",
      description: "Vocabulary games are separated by course level so practice stays aligned with the syllabus.",
      activeLabel: "Open games",
      activeDescription: "Practice {level} vocabulary with flashcards, memory, and word matching.",
    },
    "mock-tests": {
      eyebrow: "Mock Tests",
      title: "Choose a level for mock tests",
      description: "Exam simulations are separated by level, so A1, A2, B1, and B2 can have different test formats and scoring.",
      activeLabel: "Open tests",
      activeDescription: "Take TELC {level} exam simulations with reading, listening, writing, and speaking sections.",
    },
    available: "Available now",
    preparingNow: "Preparing now",
    comingSoon: "Coming soon",
    content: "content",
    notEnabled: "Not enabled yet",
    planned: "Planned",
    preparing: "Preparing",
    soon: "Soon",
    note: "A1 and A2 practice areas are active now. B1 and B2 stay separated and ready for release after their syllabus, vocabulary pool, and test banks are complete.",
  },
  de: {
    games: {
      eyebrow: "Uebungsspiele",
      title: "Waehle ein Level fuer Spiele",
      description: "Vokabelspiele sind nach Kurslevel getrennt, damit die Uebung zum Lehrplan passt.",
      activeLabel: "Spiele oeffnen",
      activeDescription: "Uebe {level}-Vokabeln mit Lernkarten, Memory und Wortzuordnung.",
    },
    "mock-tests": {
      eyebrow: "Probepruefungen",
      title: "Waehle ein Level fuer Probepruefungen",
      description: "Pruefungssimulationen sind nach Level getrennt, damit A1, A2, B1 und B2 eigene Formate haben.",
      activeLabel: "Tests oeffnen",
      activeDescription: "Mache TELC {level} Simulationen mit Lesen, Hoeren, Schreiben und Sprechen.",
    },
    available: "Jetzt verfuegbar",
    preparingNow: "In Vorbereitung",
    comingSoon: "Demnaechst",
    content: "Inhalt",
    notEnabled: "Noch nicht aktiv",
    planned: "Geplant",
    preparing: "In Vorbereitung",
    soon: "Bald",
    note: "A1 und A2 Uebungsbereiche sind jetzt aktiv. B1 und B2 bleiben getrennt und werden nach Lehrplan, Vokabelpool und Testbank freigegeben.",
  },
} satisfies Record<Lang, Record<string, any>>;

export function LevelPracticeSelector({ kind }: { kind: PracticeKind }) {
  const { lang } = useLang();
  const langCopy = copy[lang];
  const page = langCopy[kind];

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 space-y-5">
      <Breadcrumbs items={[{ label: page.eyebrow }]} />

      <div>
        <p className="text-sm font-bold text-yellow-400">{page.eyebrow}</p>
        <h1 className="mt-1 text-3xl font-extrabold text-white">{page.title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-gray-400">{page.description}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {courseLevels.map((level) => {
          const enabled = level.id === "a1" || level.id === "a2";
          const preparing = level.status === "preparing";
          const href =
            kind === "mock-tests" && level.id === "a1"
              ? "/mock-tests/a1"
              : `/${kind}/${level.slug}`;
          const content = (
            <article
              className={cn(
                "card h-full overflow-hidden p-5 transition-all",
                enabled ? "hover:border-yellow-400/40" : "opacity-65 hover:border-gray-700"
              )}
            >
              <div className={cn("h-1.5 rounded-full bg-gradient-to-r", level.color)} />
              <div className="mt-5 flex items-start justify-between gap-3">
                <div>
                  <p className={cn("text-sm font-extrabold uppercase", level.accent)}>
                    {level.id.toUpperCase()}
                  </p>
                  <h2 className="mt-1 text-lg font-bold text-white">{level.title}</h2>
                  <p className="mt-1 text-xs font-semibold text-gray-500">
                    {enabled ? langCopy.available : preparing ? langCopy.preparingNow : langCopy.comingSoon}
                  </p>
                </div>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gray-800 bg-gray-950">
                  {enabled ? (
                    <CheckCircle size={20} className="text-yellow-400" />
                  ) : preparing ? (
                    <Clock size={20} className="text-blue-300" />
                  ) : (
                    <Lock size={20} className="text-gray-500" />
                  )}
                </div>
              </div>

              <p className="mt-4 min-h-[72px] text-sm leading-relaxed text-gray-400">
                {enabled
                  ? kind === "games"
                    ? page.activeDescription.replace("{level}", level.id.toUpperCase())
                    : page.activeDescription.replace("{level}", level.id.toUpperCase())
                  : level.description}
              </p>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500">
                  {enabled ? `${level.id.toUpperCase()} ${langCopy.content}` : preparing ? langCopy.notEnabled : langCopy.planned}
                </span>
                <span
                  className={cn(
                    "rounded-lg px-2 py-1 text-xs font-bold",
                    enabled
                      ? "bg-yellow-400 text-gray-950"
                      : preparing
                      ? "border border-blue-400/20 bg-blue-400/10 text-blue-300"
                      : "border border-gray-800 text-gray-500"
                  )}
                >
                  {enabled ? `${page.activeLabel}` : preparing ? langCopy.preparing : langCopy.soon}
                </span>
              </div>
            </article>
          );

          return (
            <Link
              key={level.id}
              href={enabled ? href : `/${kind}/${level.slug}`}
              className="block"
            >
              {content}
            </Link>
          );
        })}
      </div>

      <div className="card flex items-start gap-3 p-4 text-sm text-gray-400">
        <BookOpen size={18} className="mt-0.5 shrink-0 text-yellow-400" />
        <p>
          {langCopy.note}
        </p>
      </div>
    </div>
  );
}
