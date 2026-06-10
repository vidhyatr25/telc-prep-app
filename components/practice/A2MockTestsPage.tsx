"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle, Clock, Target, Trophy, XCircle } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useLang } from "@/contexts/LanguageContext";
import { useProgress } from "@/contexts/ProgressContext";
import { a2MockTests } from "@/data/a2-mock-tests";
import { cn, formatTime } from "@/lib/utils";

const sectionColors: Record<string, string> = {
  reading: "bg-blue-900/40 text-blue-300 border-blue-700/40",
  listening: "bg-purple-900/40 text-purple-300 border-purple-700/40",
  writing: "bg-green-900/40 text-green-300 border-green-700/40",
  speaking: "bg-orange-900/40 text-orange-300 border-orange-700/40",
};

const copy = {
  en: {
    root: "Mock Tests",
    current: "A2 Mock Tests",
    eyebrow: "TELC A2 Exam Practice",
    title: "A2 Mock Tests",
    description: "Practice A2 reading, listening, writing, and speaking with longer everyday tasks.",
    syllabus: "A2 syllabus",
    duration: "Duration",
    passMark: "Pass mark",
    points: "Points",
    retake: "Retake A2 test",
    start: "Start A2 test",
    section: {
      reading: "reading",
      listening: "listening",
      writing: "writing",
      speaking: "speaking",
    },
  },
  de: {
    root: "Probepruefungen",
    current: "A2 Probepruefungen",
    eyebrow: "TELC A2 Pruefungstraining",
    title: "A2 Probepruefungen",
    description: "Uebe A2 Lesen, Hoeren, Schreiben und Sprechen mit laengeren Alltagsaufgaben.",
    syllabus: "A2 Lehrplan",
    duration: "Dauer",
    passMark: "Bestehensgrenze",
    points: "Punkte",
    retake: "A2 Test wiederholen",
    start: "A2 Test starten",
    section: {
      reading: "Lesen",
      listening: "Hoeren",
      writing: "Schreiben",
      speaking: "Sprechen",
    },
  },
};

export default function A2MockTestsPage() {
  const { lang } = useLang();
  const { progress } = useProgress();
  const c = copy[lang];

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 space-y-5">
      <Breadcrumbs
        items={[
          { label: c.root, href: "/mock-tests" },
          { label: c.current },
        ]}
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold text-blue-300">{c.eyebrow}</p>
          <h1 className="mt-1 text-3xl font-extrabold text-white">{c.title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-400">
            {c.description}
          </p>
        </div>
        <Link href="/learn/a2" className="rounded-xl border border-gray-800 bg-gray-900 px-4 py-2 text-sm font-semibold text-gray-300 transition-colors hover:border-gray-700 hover:text-white">
          {c.syllabus}
        </Link>
      </div>

      <div className="grid gap-4">
        {a2MockTests.map((test, index) => {
          const result = progress.mockTestResults.find((item) => item.testId === test.id);
          const totalPoints = test.questions.reduce((sum, question) => sum + question.points, 0);
          const sections = Array.from(new Set(test.questions.map((question) => question.section)));

          return (
            <Link key={test.id} href={`/mock-tests/a2/${test.id}`} className="block">
              <article
                className={cn(
                  "card p-5 transition-all hover:border-blue-400/40",
                  result?.passed && "border-green-500/30",
                  result && !result.passed && "border-orange-500/20"
                )}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-cyan-600 text-lg font-extrabold text-gray-950">
                      {index + 1}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold leading-tight text-white">{test.title}</h2>
                      <p className="mt-1 text-sm text-gray-400">{test.subtitle}</p>
                    </div>
                  </div>

                  {result && (
                    <div
                      className={cn(
                        "flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-1.5 text-sm font-bold",
                        result.passed
                          ? "border-green-500/30 bg-green-900/40 text-green-400"
                          : "border-orange-500/30 bg-orange-900/40 text-orange-400"
                      )}
                    >
                      {result.passed ? <CheckCircle size={14} /> : <XCircle size={14} />}
                      {result.score}%
                    </div>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <StatPill icon={<Clock size={14} />} label={c.duration} value={formatTime(test.duration)} />
                  <StatPill icon={<Target size={14} />} label={c.passMark} value={`${test.passMark}%`} />
                  <StatPill icon={<Trophy size={14} />} label={c.points} value={`${totalPoints}`} />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {sections.map((section) => (
                    <span
                      key={section}
                      className={cn(
                        "rounded-lg border px-2.5 py-1 text-xs font-semibold capitalize",
                        sectionColors[section] ?? "border-gray-700 bg-gray-800 text-gray-300"
                      )}
                    >
                      {c.section[section as keyof typeof c.section] ?? section}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between rounded-xl bg-blue-400 px-4 py-3 font-bold text-gray-950">
                  <span>{result ? c.retake : c.start}</span>
                  <ArrowRight size={16} />
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function StatPill({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl bg-gray-800/60 p-3 text-center">
      <span className="text-gray-400">{icon}</span>
      <span className="text-sm font-bold text-white">{value}</span>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );
}
