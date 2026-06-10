"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, ChevronRight, Star } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { a2Units } from "@/data/a2-curriculum";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { cn } from "@/lib/utils";

const copy = {
  en: {
    breadcrumb: "German A2",
    dashboard: "Course dashboard",
    eyebrow: "TELC A2 Course",
    title: "German A2 Syllabus",
    description:
      "Build beyond A1 with past tense, appointments, work, housing, health, travel, opinions, reading strategies, writing tasks, and A2 exam training.",
    mockTests: "A2 mock tests",
    path: "A2 syllabus path",
    unit: "Unit",
  },
  de: {
    breadcrumb: "Deutsch A2",
    dashboard: "Kursuebersicht",
    eyebrow: "TELC A2 Kurs",
    title: "Deutsch A2 Lehrplan",
    description:
      "Baue auf A1 auf mit Perfekt, Terminen, Arbeit, Wohnen, Gesundheit, Reisen, Meinungen, Lesestrategien, Schreibaufgaben und A2 Pruefungstraining.",
    mockTests: "A2 Probepruefungen",
    path: "A2 Lehrpfad",
    unit: "Einheit",
  },
};

export default function A2CoursePage() {
  const { lang } = useLang();
  const c = copy[lang];

  return (
    <div className="mx-auto max-w-5xl px-4 py-5 space-y-5">
      <Breadcrumbs items={[{ label: c.breadcrumb }]} />

      <section className="card p-5">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white">
          <ArrowLeft size={14} />
          {c.dashboard}
        </Link>
        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-extrabold uppercase text-blue-300">{c.eyebrow}</p>
            <h1 className="mt-1 text-3xl font-extrabold text-white">{c.title}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-400">
              {c.description}
            </p>
          </div>
          <Link href="/mock-tests/a2" className="btn-primary inline-flex items-center gap-2">
            {c.mockTests}
          </Link>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-extrabold text-white">{c.path}</h2>
        <div className="grid gap-3">
          {a2Units.map((unit) => (
            <Link key={unit.slug} href={`/learn/a2/${unit.slug}`} className="block">
              <article className="card p-4 transition-all hover:border-gray-600">
                <div className="flex items-start gap-4">
                  <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-extrabold text-white", unit.color)}>
                    A2
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-gray-500">{c.unit} {unit.id - 200}</p>
                    <h3 className="font-bold text-white">{unit.title}</h3>
                    <p className="mt-1 text-sm text-gray-400">{unit.description}</p>
                    <p className="mt-2 text-xs text-blue-300">{unit.examFocus}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1 rounded-lg border border-yellow-400/20 bg-yellow-400/10 px-2 py-1 text-xs font-bold text-yellow-400">
                    <Star size={12} />
                    {unit.xpReward}
                  </div>
                  <ChevronRight size={18} className="mt-1 shrink-0 text-gray-600" />
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
