"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle, Clock, FileText, Target, Trophy, XCircle } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { useProgress } from "@/contexts/ProgressContext";
import { mockTests } from "@/data/mock-tests";
import { t, type Lang } from "@/data/translations";
import { cn, formatTime } from "@/lib/utils";
import { Breadcrumbs } from "@/components/Breadcrumbs";

const sectionColors: Record<string, string> = {
  reading: "bg-blue-900/40 text-blue-300 border-blue-700/40",
  listening: "bg-purple-900/40 text-purple-300 border-purple-700/40",
  writing: "bg-green-900/40 text-green-300 border-green-700/40",
  speaking: "bg-orange-900/40 text-orange-300 border-orange-700/40",
};

export default function MockTestsPage() {
  const { lang } = useLang();
  const { progress } = useProgress();

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 space-y-5">
      <Breadcrumbs
        items={[
          { label: "Mock Tests", href: "/mock-tests" },
          { label: "A1 Mock Tests" },
        ]}
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold text-yellow-400">TELC A1 Exam Practice</p>
          <h1 className="mt-1 text-3xl font-extrabold text-white">{t.mockTestTitle[lang]}</h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-400">{t.mockTestSubtitle[lang]}</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row md:flex-col">
          <Link href="/learn" className="rounded-xl border border-gray-800 bg-gray-900 px-4 py-2 text-sm font-semibold text-gray-300 transition-colors hover:border-gray-700 hover:text-white">
            A1 syllabus
          </Link>
          <div className="rounded-xl border border-blue-700/30 bg-blue-900/20 px-4 py-2 text-sm text-gray-300">
            <p className="font-semibold text-white">4 sections</p>
            <p className="text-xs text-gray-400">Reading, Listening, Writing, Speaking</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {mockTests.map((test) => {
          const result = progress.mockTestResults.find((r) => r.testId === test.id);
          const totalPoints = test.questions.reduce((sum, q) => sum + q.points, 0);
          const sections = Array.from(new Set(test.questions.map((q) => q.section)));

          return (
            <Link key={test.id} href={`/mock-tests/${test.id}`} className="block">
              <article
                className={cn(
                  "card p-5 transition-all hover:border-gray-600",
                  result?.passed && "border-green-500/30",
                  result && !result.passed && "border-orange-500/20"
                )}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-amber-600 text-lg font-extrabold text-gray-900">
                      {test.id}
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
                  <StatPill icon={<Clock size={14} />} label="Duration" value={formatTime(test.duration)} />
                  <StatPill icon={<Target size={14} />} label="Pass mark" value={`${test.passMark}%`} />
                  <StatPill icon={<Trophy size={14} />} label="Points" value={`${totalPoints}`} />
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
                      {getSectionLabel(section, lang)}
                    </span>
                  ))}
                </div>

                {result && (
                  <div className="mt-4 rounded-xl bg-gray-800/50 p-3 text-sm">
                    <div className="flex flex-wrap items-center gap-3 text-gray-300">
                      <span className="font-semibold text-white">Previous result</span>
                      <span>{result.score}% - {result.passed ? "PASSED" : "FAILED"}</span>
                      <span className="text-gray-500">{new Date(result.date).toLocaleDateString()}</span>
                    </div>
                    <div className="progress-bar mt-2">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          result.passed
                            ? "bg-gradient-to-r from-green-500 to-green-400"
                            : "bg-gradient-to-r from-orange-600 to-orange-400"
                        )}
                        style={{ width: `${result.score}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between rounded-xl bg-yellow-400 px-4 py-3 font-bold text-gray-900">
                  <span>{result ? "Retake Test" : t.startTest[lang]}</span>
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

function getSectionLabel(section: string, lang: Lang) {
  const entry = t[section];
  return entry?.[lang] ?? section;
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
