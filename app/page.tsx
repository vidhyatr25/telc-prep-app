"use client";

import Link from "next/link";
import {
  BookOpen,
  CheckCircle,
  Clock,
  FileText,
  Lock,
  Star,
  Trophy,
} from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { useProgress } from "@/contexts/ProgressContext";
import { courseLevels, units } from "@/data/curriculum";
import type { Lang } from "@/data/translations";
import { cn, percentage } from "@/lib/utils";

const homeCopy = {
  en: {
    eyebrow: "TELC German Courses",
    title: "Choose your exam course",
    subtitle:
      "Start with the active A1 course. A2 is available now with TELC-style tasks. B1 and B2 are planned for later.",
    a1MockTests: "TELC A1 Mock Tests",
    unitsComplete: "units complete",
    researchInProgress: "Research in progress",
    comingSoon: "Coming soon",
    currentCourse: "Current active course",
    existingCourse: "Your existing A1 course is unchanged: same units, same lessons, same quizzes, same progress.",
    ready: "ready",
    lessons: "lessons",
    openA1: "Open A1 Course",
    a2Prep: "A2 preparation",
    a2Title: "TELC A2 course is ready",
    a2Description:
      "A2 now has a syllabus, lessons, quizzes, vocabulary games, and TELC-style mock tests for listening, reading, writing, and speaking.",
    taskReady: "A2 practice ready",
    availableNow: "Available now",
    planned: "planned",
    enabled: "Enabled",
    preparing: "Preparing",
    soon: "Soon",
  },
  de: {
    eyebrow: "TELC Deutschkurse",
    title: "Waehle deinen Pruefungskurs",
    subtitle:
      "Starte mit dem aktiven A1-Kurs. A2 ist jetzt mit TELC-Aufgaben verfuegbar. B1 und B2 sind fuer spaeter geplant.",
    a1MockTests: "TELC A1 Probepruefungen",
    unitsComplete: "Einheiten abgeschlossen",
    researchInProgress: "Recherche laeuft",
    comingSoon: "Demnaechst",
    currentCourse: "Aktueller Kurs",
    existingCourse: "Dein A1-Kurs bleibt gleich: gleiche Einheiten, gleiche Lektionen, gleiche Quizze, gleicher Fortschritt.",
    ready: "bereit",
    lessons: "Lektionen",
    openA1: "A1-Kurs oeffnen",
    a2Prep: "A2 Vorbereitung",
    a2Title: "TELC A2 Kurs ist bereit",
    a2Description:
      "A2 hat jetzt Lehrplan, Lektionen, Quizze, Vokabelspiele und TELC-Probepruefungen fuer Hoeren, Lesen, Schreiben und Sprechen.",
    taskReady: "A2 Uebung bereit",
    availableNow: "Jetzt verfuegbar",
    planned: "geplant",
    enabled: "Aktiv",
    preparing: "In Vorbereitung",
    soon: "Bald",
  },
} satisfies Record<Lang, Record<string, string>>;

const levelCopy = {
  en: {
    a1: {
      subtitle: "Foundation course",
      description: "Start with greetings, numbers, grammar basics, everyday vocabulary, and TELC A1 practice.",
    },
    a2: {
      subtitle: "Available now",
      description: "Move beyond basics with past tense, appointments, work, housing, travel, opinions, and A2 exam practice.",
    },
    b1: {
      subtitle: "Coming soon",
      description: "Independent communication, longer texts, stronger grammar, and B1 exam preparation.",
    },
    b2: {
      subtitle: "Coming soon",
      description: "Upper-intermediate fluency, longer texts, stronger argumentation, and B2 exam readiness.",
    },
  },
  de: {
    a1: {
      subtitle: "Grundkurs",
      description: "Beginne mit Begruessungen, Zahlen, Grammatik, Alltagswortschatz und TELC A1 Uebungen.",
    },
    a2: {
      subtitle: "Jetzt verfuegbar",
      description: "Lerne Perfekt, Termine, Arbeit, Wohnen, Reisen, Meinungen und A2 Pruefungstraining.",
    },
    b1: {
      subtitle: "Demnaechst",
      description: "Selbststaendige Kommunikation, laengere Texte, staerkere Grammatik und B1 Vorbereitung.",
    },
    b2: {
      subtitle: "Demnaechst",
      description: "Fortgeschrittene Kommunikation, laengere Texte, Argumentation und B2 Pruefungssicherheit.",
    },
  },
} satisfies Record<Lang, Record<string, { subtitle: string; description: string }>>;

export default function HomePage() {
  const { lang } = useLang();
  const { progress } = useProgress();
  const copy = homeCopy[lang];
  const completedUnits = units.filter((unit) => progress.unitProgress[unit.id]?.quizCompleted).length;
  const completedLessons = units.reduce(
    (sum, unit) => sum + (progress.unitProgress[unit.id]?.lessonsCompleted.length ?? 0),
    0
  );
  const totalLessons = units.reduce((sum, unit) => sum + unit.lessons.length, 0);
  const a1Pct = percentage(completedLessons, totalLessons);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-10">
      <section className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold text-yellow-400">{copy.eyebrow}</p>
          <h1 className="mt-2 text-3xl font-extrabold text-white md:text-5xl">
            {copy.title}
          </h1>
          <p className="mt-3 max-w-2xl text-gray-400">
            {copy.subtitle}
          </p>
        </div>
        <Link href="/mock-tests/a1" className="btn-secondary inline-flex items-center justify-center gap-2">
          <FileText size={18} />
          {copy.a1MockTests}
        </Link>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {courseLevels.map((level) => {
          const active = level.status === "available";
          const preparing = level.status === "preparing";
          const pct = level.id === "a1" ? a1Pct : 0;
          const CardBody = (
            <CourseCardBody
              level={level}
              lang={lang}
              progressPct={pct}
              completedLabel={level.id === "a1" ? `${completedUnits}/10 ${copy.unitsComplete}` : preparing ? copy.researchInProgress : copy.comingSoon}
            />
          );

          return active ? (
            <Link key={level.id} href={level.href} className="block">
              {CardBody}
            </Link>
          ) : (
            <div key={level.id} className="block cursor-not-allowed">
              {CardBody}
            </div>
          );
        })}
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="card p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase text-gray-500">{copy.currentCourse}</p>
              <h2 className="mt-2 text-2xl font-extrabold text-white">German A1</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">
                {copy.existingCourse}
              </p>
            </div>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-yellow-400/20 bg-yellow-400/10 text-yellow-400">
              <Trophy size={22} />
            </div>
          </div>
          <div className="mt-5 progress-bar">
            <div className="progress-fill" style={{ width: `${a1Pct}%` }} />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl border border-gray-800 bg-gray-950 p-3">
              <p className="text-lg font-bold text-white">{a1Pct}%</p>
              <p className="text-xs text-gray-500">{copy.ready}</p>
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-950 p-3">
              <p className="text-lg font-bold text-white">{completedLessons}/{totalLessons}</p>
              <p className="text-xs text-gray-500">{copy.lessons}</p>
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-950 p-3">
              <p className="text-lg font-bold text-white">{progress.totalXP}</p>
              <p className="text-xs text-gray-500">XP</p>
            </div>
          </div>
          <Link href="/learn" className="btn-primary mt-5 inline-flex items-center gap-2">
            {copy.openA1}
            <BookOpen size={18} />
          </Link>
        </div>

        <div className="card p-5">
          <p className="text-xs font-bold uppercase text-gray-500">{copy.a2Prep}</p>
          <h2 className="mt-2 text-2xl font-extrabold text-white">{copy.a2Title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-400">
            {copy.a2Description}
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {(lang === "de" ? ["Hoeren", "Lesen", "Schreiben", "Sprechen"] : ["Listening", "Reading", "Writing", "Speaking"]).map((section) => (
              <div key={section} className="rounded-xl border border-gray-800 bg-gray-950 p-3">
                <p className="font-bold text-white">{section}</p>
                <p className="mt-1 text-xs text-gray-500">{copy.taskReady}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function CourseCardBody({
  level,
  lang,
  progressPct,
  completedLabel,
}: {
  level: (typeof courseLevels)[number];
  lang: Lang;
  progressPct: number;
  completedLabel: string;
}) {
  const active = level.status === "available";
  const preparing = level.status === "preparing";
  const copy = homeCopy[lang];
  const localizedLevel = levelCopy[lang][level.id];

  return (
    <div
      className={cn(
        "card h-full overflow-hidden p-5 transition-all",
        active ? "hover:border-yellow-400/40" : "opacity-65",
      )}
    >
      <div className={cn("h-1.5 rounded-full bg-gradient-to-r", level.color)} />
      <div className="mt-5 flex items-start justify-between gap-3">
        <div>
          <p className={cn("text-sm font-extrabold uppercase", level.accent)}>
            {level.id.toUpperCase()}
          </p>
          <h2 className="mt-1 text-xl font-bold text-white">{level.title}</h2>
          <p className="mt-1 text-xs font-semibold text-gray-500">{localizedLevel.subtitle}</p>
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gray-800 bg-gray-950">
          {active ? (
            <CheckCircle size={20} className="text-yellow-400" />
          ) : preparing ? (
            <Clock size={20} className="text-blue-300" />
          ) : (
            <Lock size={20} className="text-gray-500" />
          )}
        </div>
      </div>

      <p className="mt-4 min-h-[72px] text-sm leading-relaxed text-gray-400">
        {localizedLevel.description}
      </p>

      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <span>{level.unitCount} {lang === "de" ? "Einheiten" : "units"}</span>
        <span>{level.lessonCount > 0 ? `${level.lessonCount} ${copy.lessons}` : copy.planned}</span>
      </div>
      <div className="progress-bar mt-3">
        <div className="progress-fill" style={{ width: `${progressPct}%` }} />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-500">{completedLabel}</span>
        {active ? (
          <span className="inline-flex items-center gap-1 rounded-lg bg-yellow-400 px-2 py-1 text-xs font-extrabold text-gray-950">
            {copy.enabled}
          </span>
        ) : preparing ? (
          <span className="rounded-lg border border-blue-400/20 bg-blue-400/10 px-2 py-1 text-xs font-bold text-blue-300">
            {copy.preparing}
          </span>
        ) : (
          <span className="rounded-lg border border-gray-800 px-2 py-1 text-xs font-bold text-gray-500">
            {copy.soon}
          </span>
        )}
      </div>
    </div>
  );
}
