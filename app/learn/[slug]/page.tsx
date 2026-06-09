"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  MessageSquare,
  BookMarked,
  FileText,
  CheckCircle,
  ChevronRight,
  Trophy,
  Lock,
} from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { useProgress } from "@/contexts/ProgressContext";
import { courseLevels, units, type CourseLevel } from "@/data/curriculum";
import { t } from "@/data/translations";
import { cn } from "@/lib/utils";

const lessonTypeIcon: Record<string, React.ReactNode> = {
  vocab: <BookOpen size={16} />,
  grammar: <BookMarked size={16} />,
  dialogue: <MessageSquare size={16} />,
  reading: <FileText size={16} />,
};

const lessonTypeColor: Record<string, string> = {
  vocab: "text-blue-400 bg-blue-400/10",
  grammar: "text-purple-400 bg-purple-400/10",
  dialogue: "text-green-400 bg-green-400/10",
  reading: "text-orange-400 bg-orange-400/10",
};

export default function UnitDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const { lang } = useLang();
  const { isLessonDone, isUnitUnlocked, getUnitProgress } = useProgress();
  const router = useRouter();

  const level = courseLevels.find((courseLevel) => courseLevel.slug === slug);
  if (level) {
    return <CourseLevelLanding level={level} />;
  }

  const unit = units.find((u) => u.slug === slug);

  if (!unit) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-400">Unit not found.</p>
        <Link href="/learn" className="btn-primary mt-4 inline-block">
          {t.backToLearn[lang]}
        </Link>
      </div>
    );
  }

  const unlocked = isUnitUnlocked(unit.id);
  const up = getUnitProgress(unit.id);
  const allLessonsDone = unit.lessons.every((_, i) => isLessonDone(unit.id, i));

  if (!unlocked) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="text-6xl">🔒</div>
        <h2 className="text-2xl font-bold">{t.locked[lang]}</h2>
        <p className="text-gray-400">Complete the previous unit to unlock this one.</p>
        <Link href="/learn" className="btn-primary inline-block">
          {t.backToLearn[lang]}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Back */}
      <Link
        href="/learn"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
      >
        <ArrowLeft size={16} />
        {t.backToLearn[lang]}
      </Link>

      {/* Unit header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "card overflow-hidden bg-gradient-to-br p-6 border-0",
          unit.color
        )}
      >
        <div className="flex items-center gap-4">
          <span className="text-5xl">{unit.icon}</span>
          <div>
            <p className="text-white/70 text-sm font-medium">
              {t.unit[lang]} {unit.id}
            </p>
            <h1 className="text-2xl font-extrabold text-white">
              {lang === "de" ? unit.titleDe : unit.title}
            </h1>
            <p className="text-white/80 text-sm mt-1">
              {lang === "de" ? unit.descriptionDe : unit.description}
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-4 text-white/70 text-sm">
          <span>⭐ {unit.xpReward} XP reward</span>
          <span>📚 {unit.lessons.length} lessons</span>
          {up.quizCompleted && (
            <span className="text-yellow-300 font-semibold">✓ Quiz passed</span>
          )}
        </div>
      </motion.div>

      {/* Lessons */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-white">{t.lesson[lang]}s</h2>
        {unit.lessons.map((lesson, index) => {
          const done = isLessonDone(unit.id, index);
          const typeColor = lessonTypeColor[lesson.type] ?? "text-gray-400 bg-gray-800";
          return (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.06 }}
            >
              <Link href={`/learn/${unit.slug}/lesson/${lesson.id}`}>
                <motion.div
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.99 }}
                  className={cn(
                    "card p-4 flex items-center gap-4 cursor-pointer group hover:border-gray-600 transition-all",
                    done && "border-green-500/30 bg-green-500/5"
                  )}
                >
                  <div
                    className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                      typeColor
                    )}
                  >
                    {lessonTypeIcon[lesson.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm leading-tight">
                      {lang === "de" ? lesson.titleDe : lesson.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 capitalize">
                      {lesson.type} · ⭐ {lesson.xp} XP
                    </p>
                  </div>
                  {done ? (
                    <CheckCircle size={18} className="text-green-400 shrink-0" />
                  ) : (
                    <ChevronRight
                      size={18}
                      className="text-gray-600 group-hover:text-yellow-400 transition-colors shrink-0"
                    />
                  )}
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Quiz section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card p-5 space-y-3"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-400/10 flex items-center justify-center">
            <Trophy size={20} className="text-yellow-400" />
          </div>
          <div>
            <p className="font-bold text-white">Unit Quiz</p>
            <p className="text-xs text-gray-400">{unit.quiz.length} questions · ⭐ {unit.xpReward} XP</p>
          </div>
          {up.quizCompleted && (
            <div className="ml-auto flex items-center gap-1 text-green-400 text-sm font-semibold">
              <CheckCircle size={16} />
              {up.quizScore}%
            </div>
          )}
        </div>

        {!allLessonsDone && !up.quizCompleted && (
          <p className="text-xs text-gray-500">
            Complete all lessons first to prepare for the quiz, or jump right in!
          </p>
        )}

        <Link href={`/learn/${unit.slug}/quiz`}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "w-full py-3 rounded-xl font-bold text-sm transition-all",
              up.quizCompleted
                ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                : "btn-primary"
            )}
          >
            {up.quizCompleted ? "Retake Quiz" : "Start Quiz →"}
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}

function CourseLevelLanding({ level }: { level: CourseLevel }) {
  const outline = level.outline ?? [];
  const isA1 = level.id === "a1";
  const showOutline = level.status === "available" || level.status === "preparing";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Link
        href="/learn"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
      >
        <ArrowLeft size={16} />
        Back to courses
      </Link>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("card overflow-hidden border-0 bg-gradient-to-br p-6", level.color)}
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase text-white/70">{level.id.toUpperCase()}</p>
            <h1 className="mt-1 text-3xl font-extrabold text-white">{level.title}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/80">
              {level.description}
            </p>
          </div>
          <div className="rounded-2xl border border-white/20 bg-black/20 px-4 py-3 text-sm text-white/80">
            <p className="font-bold text-white">{level.unitCount} units</p>
            <p>{level.lessonCount > 0 ? `${level.lessonCount} lessons planned` : "Coming soon"}</p>
          </div>
        </div>
      </motion.div>

      {isA1 ? (
        <div className="card p-5">
          <p className="font-bold text-white">A1 lessons are available on the main learning path.</p>
          <Link href="/learn" className="btn-primary mt-4 inline-flex">
            Open A1 path
          </Link>
        </div>
      ) : showOutline ? (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-white">{level.id.toUpperCase()} course outline</h2>
            <p className="text-sm text-gray-500">
              This level is being prepared. These researched units will become full lessons, quizzes, speaking practice, and mock tests.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {outline.map((unit, index) => (
              <motion.div
                key={unit.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="card p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-blue-400/20 bg-blue-400/10 text-sm font-extrabold text-blue-300">
                    {unit.id}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-white">{unit.title}</h3>
                      <span className="rounded-md border border-gray-800 px-2 py-0.5 text-xs font-semibold text-gray-500">
                        {unit.focus}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-gray-400">
                      {unit.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card p-5 text-center">
          <Lock size={28} className="mx-auto text-gray-500" />
          <h2 className="mt-3 text-xl font-bold text-white">{level.title} is coming soon</h2>
          <p className="mt-2 text-sm text-gray-500">
            This level will unlock after the A1 and A2 content is complete.
          </p>
        </div>
      )}
    </div>
  );
}
