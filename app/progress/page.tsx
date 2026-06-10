"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Flame, Trophy, AlertTriangle, X, CheckCircle, XCircle } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { useProgress } from "@/contexts/ProgressContext";
import { units } from "@/data/curriculum";
import { t } from "@/data/translations";
import { cn, percentage } from "@/lib/utils";

interface Level {
  label: string;
  min: number;
  max: number;
  color: string;
}

const levels: Level[] = [
  { label: "Beginner", min: 0, max: 500, color: "text-gray-400" },
  { label: "Elementary", min: 500, max: 1500, color: "text-blue-400" },
  { label: "Pre-Intermediate", min: 1500, max: 3000, color: "text-purple-400" },
  { label: "Intermediate", min: 3000, max: Infinity, color: "text-yellow-400" },
];

const copy = {
  en: {
    subtitle: "Track your German A1 journey",
    currentLevel: "Current Level",
    maxLevel: "Max Level!",
    xpTo: "XP to",
    days: "days",
    unitsDone: "Units Done",
    lessonsDone: "Lessons Done",
    testsTaken: "Tests Taken",
    completed: "completed",
    lessons: "lessons",
    mockTests: "mock tests",
    weeksAgo: "4 weeks ago",
    today: "Today",
    unitProgress: "Unit Progress",
    mockHistory: "Mock Test History",
    resetTitle: "Reset Progress?",
    resetBody: "This will permanently delete all your XP, completed lessons, quiz scores, and mock test results. This action cannot be undone.",
    cancel: "Cancel",
    resetAll: "Reset All",
  },
  de: {
    subtitle: "Verfolge deinen Deutsch A1 Fortschritt",
    currentLevel: "Aktuelles Level",
    maxLevel: "Maximales Level!",
    xpTo: "XP bis",
    days: "Tage",
    unitsDone: "Einheiten",
    lessonsDone: "Lektionen",
    testsTaken: "Tests",
    completed: "abgeschlossen",
    lessons: "Lektionen",
    mockTests: "Probepruefungen",
    weeksAgo: "Vor 4 Wochen",
    today: "Heute",
    unitProgress: "Einheitenfortschritt",
    mockHistory: "Probepruefungen Verlauf",
    resetTitle: "Fortschritt zuruecksetzen?",
    resetBody: "Dies loescht dauerhaft alle XP, abgeschlossenen Lektionen, Quiz-Ergebnisse und Probepruefungen. Diese Aktion kann nicht rueckgaengig gemacht werden.",
    cancel: "Abbrechen",
    resetAll: "Alles zuruecksetzen",
  },
};

function getLevel(xp: number): Level & { progressPct: number; xpToNext: number } {
  const level = levels.find((l, i) => {
    const next = levels[i + 1];
    return xp >= l.min && (!next || xp < next.min);
  }) ?? levels[levels.length - 1];

  const next = levels[levels.indexOf(level) + 1];
  const progressPct = next
    ? percentage(xp - level.min, next.min - level.min)
    : 100;
  const xpToNext = next ? next.min - xp : 0;

  return { ...level, progressPct, xpToNext };
}

export default function ProgressPage() {
  const { lang } = useLang();
  const { progress, resetProgress, getUnitProgress } = useProgress();
  const [showResetModal, setShowResetModal] = useState(false);
  const c = copy[lang];

  const level = getLevel(progress.totalXP);
  const totalLessons = units.reduce((s, u) => s + u.lessons.length, 0);
  const completedLessons = units.reduce(
    (s, u) => s + (getUnitProgress(u.id).lessonsCompleted.length),
    0
  );
  const completedUnits = units.filter((u) => getUnitProgress(u.id).quizCompleted).length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1"
      >
        <h1 className="text-3xl font-extrabold text-white">{t.progressTitle[lang]}</h1>
        <p className="text-gray-400">{c.subtitle}</p>
      </motion.div>

      {/* Level card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">{c.currentLevel}</p>
            <h2 className={cn("text-2xl font-extrabold", level.color)}>{level.label}</h2>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">{t.totalXP[lang]}</p>
            <p className="text-2xl font-extrabold text-yellow-400 flex items-center gap-1 justify-end">
              <Star size={20} className="fill-current" />
              {progress.totalXP}
            </p>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>{level.label}</span>
            {level.xpToNext > 0 ? (
              <span>{level.xpToNext} {c.xpTo} {levels[levels.indexOf(level) + 1]?.label}</span>
            ) : (
              <span className="text-yellow-400">{c.maxLevel}</span>
            )}
          </div>
          <div className="progress-bar h-3">
            <motion.div
              className="progress-fill h-3"
              initial={{ width: 0 }}
              animate={{ width: `${level.progressPct}%` }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>
        </div>

        {/* All levels */}
        <div className="grid grid-cols-4 gap-2 pt-2">
          {levels.map((lv, i) => (
            <div
              key={lv.label}
              className={cn(
                "text-center p-2 rounded-lg text-xs",
                progress.totalXP >= lv.min
                  ? "bg-yellow-400/10 border border-yellow-400/20"
                  : "bg-gray-800/50 border border-gray-800"
              )}
            >
              <p className={cn("font-bold", progress.totalXP >= lv.min ? lv.color : "text-gray-600")}>
                {lv.label === "Pre-Intermediate" ? "Pre-Int." : lv.label}
              </p>
              <p className="text-gray-500 mt-0.5">{lv.min} XP</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Stats grid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { label: t.streak[lang], value: `${progress.streak}`, icon: "🔥", sub: "days" },
          { label: "Units Done", value: `${completedUnits}/10`, icon: "📚", sub: "completed" },
          { label: "Lessons Done", value: `${completedLessons}/${totalLessons}`, icon: "📖", sub: "lessons" },
          { label: "Tests Taken", value: `${progress.mockTestResults.length}`, icon: "📝", sub: "mock tests" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.05 }}
            className="card p-4 flex flex-col items-center gap-1 text-center"
          >
            <span className="text-3xl">{s.icon}</span>
            <span className="text-xl font-extrabold text-white">{s.value}</span>
            <span className="text-xs text-gray-400">{s.label}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Streak calendar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card p-5 space-y-3"
      >
        <div className="flex items-center gap-2">
          <Flame size={18} className="text-orange-400" />
          <h3 className="font-bold text-white">{t.streak[lang]}</h3>
          <span className="ml-auto text-orange-400 font-extrabold text-lg">{progress.streak} {c.days}</span>
        </div>
        {/* Calendar dots — last 28 days */}
        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: 28 }, (_, i) => {
            const daysAgo = 27 - i;
            const active = daysAgo < progress.streak;
            return (
              <div
                key={i}
                className={cn(
                  "w-full aspect-square rounded-md",
                  active
                    ? daysAgo === 0
                      ? "bg-orange-400"
                      : "bg-orange-600/70"
                    : "bg-gray-800"
                )}
                title={`${daysAgo} days ago`}
              />
            );
          })}
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>{c.weeksAgo}</span>
          <span>{c.today}</span>
        </div>
      </motion.div>

      {/* Unit progress table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="card p-5 space-y-4"
      >
        <h3 className="font-bold text-white">{c.unitProgress}</h3>
        <div className="space-y-3">
          {units.map((unit, i) => {
            const up = getUnitProgress(unit.id);
            const pct = percentage(up.lessonsCompleted.length, unit.lessons.length);
            return (
              <motion.div
                key={unit.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.04 }}
                className="space-y-1.5"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{unit.icon}</span>
                  <span className="text-sm text-white font-medium flex-1 truncate">
                    {lang === "de" ? unit.titleDe : unit.title}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-gray-400 shrink-0">
                    <span>{up.lessonsCompleted.length}/{unit.lessons.length}</span>
                    {up.quizCompleted ? (
                      <span className="text-yellow-400 font-semibold">✓ Quiz</span>
                    ) : (
                      <span className="text-gray-600">Quiz</span>
                    )}
                    <span className="text-yellow-400 font-semibold">+{up.xpEarned}</span>
                  </div>
                </div>
                <div className="progress-bar">
                  <motion.div
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, delay: 0.3 + i * 0.04 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Mock test history */}
      {progress.mockTestResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="card p-5 space-y-4"
        >
          <h3 className="font-bold text-white">{c.mockHistory}</h3>
          <div className="space-y-2">
            {progress.mockTestResults.map((result) => (
              <div
                key={result.testId + result.date}
                className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  {result.passed ? (
                    <CheckCircle size={16} className="text-green-400 shrink-0" />
                  ) : (
                    <XCircle size={16} className="text-red-400 shrink-0" />
                  )}
                  <div>
                    <p className="text-sm font-semibold text-white">
                      TELC A1 Mock Test {result.testId}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(result.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={cn(
                      "text-lg font-extrabold",
                      result.passed ? "text-green-400" : "text-orange-400"
                    )}
                  >
                    {result.score}%
                  </p>
                  <p
                    className={cn(
                      "text-xs font-semibold",
                      result.passed ? "text-green-500" : "text-red-500"
                    )}
                  >
                    {result.passed ? t.pass[lang] : t.needsPractice[lang]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Reset progress */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="pt-2"
      >
        <button
          onClick={() => setShowResetModal(true)}
          className="w-full py-3 rounded-xl border border-red-700/40 text-red-400 hover:bg-red-900/20 transition-all text-sm font-semibold flex items-center justify-center gap-2"
        >
          <AlertTriangle size={16} />
          {t.resetProgress[lang]}
        </button>
      </motion.div>

      {/* Reset confirmation modal */}
      <AnimatePresence>
        {showResetModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-sm space-y-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-900/40 flex items-center justify-center">
                    <AlertTriangle size={20} className="text-red-400" />
                  </div>
                  <h3 className="font-bold text-white text-lg">{c.resetTitle}</h3>
                </div>
                <button
                  onClick={() => setShowResetModal(false)}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                {c.resetBody}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetModal(false)}
                  className="btn-secondary flex-1"
                >
                  {c.cancel}
                </button>
                <button
                  onClick={() => {
                    resetProgress();
                    setShowResetModal(false);
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition-all"
                >
                  {c.resetAll}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
