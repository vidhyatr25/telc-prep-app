"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  CheckCircle,
  ChevronRight,
  FileText,
  Headphones,
  Lock,
  Mic,
  Star,
} from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { useProgress } from "@/contexts/ProgressContext";
import { units } from "@/data/curriculum";
import { t, type Lang } from "@/data/translations";
import { cn, percentage } from "@/lib/utils";
import { Breadcrumbs } from "@/components/Breadcrumbs";

const examSkills = [
  {
    label: "Reading",
    detail: "notices, emails, forms",
    icon: BookOpen,
    color: "border-blue-400/20 bg-blue-400/10 text-blue-300",
  },
  {
    label: "Listening",
    detail: "announcements, short talks",
    icon: Headphones,
    color: "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
  },
  {
    label: "Writing",
    detail: "forms and short messages",
    icon: FileText,
    color: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  },
  {
    label: "Speaking",
    detail: "intro and role-play",
    icon: Mic,
    color: "border-violet-400/20 bg-violet-400/10 text-violet-300",
  },
];

const pageCopy = {
  en: {
    breadcrumb: "German A1",
    eyebrow: "TELC A1 Course",
    title: "German A1 Syllabus",
    description:
      "Follow the complete A1 path from basic vocabulary and grammar to TELC-style speaking, reading, writing, listening, quizzes, and mock tests.",
    ready: "Ready",
    units: "Units",
    path: "A1 syllabus path",
    unlockHint: "Complete each unit quiz to unlock the next unit.",
    mockTests: "Mock tests",
    lessons: "lessons",
    quizDone: "Quiz done",
    completePrevious: "Complete unit {unit} quiz to unlock",
    skills: {
      Reading: { label: "Reading", detail: "notices, emails, forms" },
      Listening: { label: "Listening", detail: "announcements, short talks" },
      Writing: { label: "Writing", detail: "forms and short messages" },
      Speaking: { label: "Speaking", detail: "intro and role-play" },
    },
  },
  de: {
    breadcrumb: "Deutsch A1",
    eyebrow: "TELC A1 Kurs",
    title: "Deutsch A1 Lehrplan",
    description:
      "Folge dem kompletten A1-Weg von Grundwortschatz und Grammatik bis zu TELC Sprechen, Lesen, Schreiben, Hoeren, Quizzen und Probepruefungen.",
    ready: "Bereit",
    units: "Einheiten",
    path: "A1 Lehrpfad",
    unlockHint: "Schliesse jedes Einheiten-Quiz ab, um die naechste Einheit freizuschalten.",
    mockTests: "Probepruefungen",
    lessons: "Lektionen",
    quizDone: "Quiz erledigt",
    completePrevious: "Schliesse Einheit {unit} ab, um freizuschalten",
    skills: {
      Reading: { label: "Lesen", detail: "Hinweise, E-Mails, Formulare" },
      Listening: { label: "Hoeren", detail: "Durchsagen, kurze Texte" },
      Writing: { label: "Schreiben", detail: "Formulare und kurze Nachrichten" },
      Speaking: { label: "Sprechen", detail: "Vorstellung und Rollenspiel" },
    },
  },
};

export default function LearnPage() {
  const { lang } = useLang();
  const { isUnitUnlocked, getUnitProgress, progress } = useProgress();
  const c = pageCopy[lang];

  const completedUnits = units.filter((unit) => getUnitProgress(unit.id).quizCompleted).length;
  const completedLessons = units.reduce(
    (sum, unit) => sum + getUnitProgress(unit.id).lessonsCompleted.length,
    0
  );
  const totalLessons = units.reduce((sum, unit) => sum + unit.lessons.length, 0);
  const progressPct = percentage(completedLessons, totalLessons);

  return (
    <div className="mx-auto max-w-5xl px-4 py-4 md:py-5 space-y-4">
      <Breadcrumbs items={[{ label: c.breadcrumb }]} />

      <section className="card border-yellow-400/20 p-4 md:p-5">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-extrabold uppercase text-yellow-400">{c.eyebrow}</p>
              <h1 className="mt-1 text-2xl font-extrabold text-white md:text-3xl">
                {c.title}
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-400">
                {c.description}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 md:w-[360px]">
              <CompactStat label={c.ready} value={`${progressPct}%`} />
              <CompactStat label={c.units} value={`${completedUnits}/${units.length}`} />
              <CompactStat label="XP" value={`${progress.totalXP}`} icon={<Star size={13} className="fill-current" />} />
            </div>
          </div>

          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPct}%` }} />
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {examSkills.map((skill) => (
              <div key={skill.label} className="flex items-center gap-2 rounded-xl border border-gray-800 bg-gray-950 px-3 py-2">
                <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border", skill.color)}>
                  <skill.icon size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white">{c.skills[skill.label as keyof typeof c.skills].label}</p>
                  <p className="truncate text-xs text-gray-500">{c.skills[skill.label as keyof typeof c.skills].detail}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-white">{c.path}</h2>
            <p className="text-xs text-gray-500">{c.unlockHint}</p>
          </div>
          <Link href="/mock-tests/a1" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-800 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-gray-700">
            <FileText size={17} />
            {c.mockTests}
          </Link>
        </div>

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 z-0 w-0.5 bg-gray-800" />
          <div className="relative space-y-4">
            {units.map((unit, index) => {
              const unlocked = isUnitUnlocked(unit.id);
              const up = getUnitProgress(unit.id);
              const lessonsCount = unit.lessons.length;
              const doneCount = up.lessonsCompleted.length;
              const quizDone = up.quizCompleted;
              const pct = percentage(doneCount, lessonsCount);

              return (
                <motion.div
                  key={unit.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.035 }}
                  className="relative z-10"
                >
                  <div
                    className={cn(
                      "absolute left-5 top-7 z-10 flex h-6 w-6 items-center justify-center rounded-full border-2",
                      quizDone
                        ? "border-yellow-400 bg-yellow-400"
                        : unlocked
                        ? "border-yellow-400 bg-gray-900"
                        : "border-gray-700 bg-gray-900"
                    )}
                  >
                    {quizDone ? (
                      <CheckCircle size={14} className="text-gray-900" />
                    ) : unlocked ? (
                      <span className="text-xs font-bold text-yellow-400">{unit.id}</span>
                    ) : (
                      <Lock size={10} className="text-gray-600" />
                    )}
                  </div>

                  <div className="ml-16">
                    {unlocked ? (
                      <Link href={`/learn/${unit.slug}`}>
                        <UnitCard
                          unit={unit}
                          lang={lang}
                          unlocked={unlocked}
                          doneCount={doneCount}
                          lessonsCount={lessonsCount}
                          quizDone={quizDone}
                          pct={pct}
                          copy={c}
                        />
                      </Link>
                    ) : (
                      <UnitCard
                        unit={unit}
                        lang={lang}
                        unlocked={unlocked}
                        doneCount={doneCount}
                        lessonsCount={lessonsCount}
                        quizDone={quizDone}
                        pct={pct}
                        copy={c}
                      />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

function CompactStat({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-950 px-3 py-2">
      <p className="text-[11px] font-bold uppercase text-gray-500">{label}</p>
      <p className="mt-0.5 flex items-center gap-1 text-lg font-extrabold text-white">
        {icon}
        {value}
      </p>
    </div>
  );
}

function UnitCard({
  unit,
  lang,
  unlocked,
  doneCount,
  lessonsCount,
  quizDone,
  pct,
  copy,
}: {
  unit: (typeof units)[number];
  lang: Lang;
  unlocked: boolean;
  doneCount: number;
  lessonsCount: number;
  quizDone: boolean;
  pct: number;
  copy: typeof pageCopy.en;
}) {
  return (
    <motion.div
      whileHover={unlocked ? { scale: 1.01 } : {}}
      whileTap={unlocked ? { scale: 0.99 } : {}}
      className={cn(
        "card group p-4 transition-all duration-200",
        unlocked ? "cursor-pointer hover:border-gray-600" : "cursor-not-allowed opacity-60",
        quizDone && "border-yellow-400/30 bg-yellow-400/5"
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-2xl",
            unit.color,
            !unlocked && "grayscale"
          )}
        >
          {unlocked ? unit.icon : <Lock size={18} />}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="mb-0.5 text-xs font-medium text-gray-500">
                {t.unit[lang]} {unit.id}
              </p>
              <h3 className="font-bold leading-tight text-white">
                {lang === "de" ? unit.titleDe : unit.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-xs text-gray-400">
                {lang === "de" ? unit.descriptionDe : unit.description}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1 rounded-lg border border-yellow-400/20 bg-yellow-400/10 px-2 py-1">
              <Star size={12} className="text-yellow-400" />
              <span className="text-xs font-bold text-yellow-400">{unit.xpReward}</span>
            </div>
          </div>

          <div className="mt-3 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>
                {doneCount}/{lessonsCount} {copy.lessons}
              </span>
              {quizDone && (
                <span className="flex items-center gap-1 font-semibold text-yellow-400">
                  <CheckCircle size={12} />
                  {copy.quizDone}
                </span>
              )}
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>

        {unlocked && (
          <ChevronRight
            size={18}
            className="mt-1 shrink-0 text-gray-600 transition-colors group-hover:text-yellow-400"
          />
        )}
      </div>

      {!unlocked && (
        <p className="mt-3 text-center text-xs text-gray-500">
          {copy.completePrevious.replace("{unit}", String(unit.id - 1))}
        </p>
      )}
    </motion.div>
  );
}
