"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Trophy,
  RotateCcw,
  ChevronRight,
  Star,
} from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { useProgress } from "@/contexts/ProgressContext";
import { units } from "@/data/curriculum";
import { t, type Lang } from "@/data/translations";
import { cn, percentage } from "@/lib/utils";

export default function QuizPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const { lang } = useLang();
  const { completeQuiz } = useProgress();
  const router = useRouter();

  const unit = units.find((u) => u.slug === slug);

  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showResult, setShowResult] = useState(false);

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

  const questions = unit.quiz;
  const q = questions[currentQ];
  const isLast = currentQ === questions.length - 1;
  const pct = percentage(currentQ, questions.length);
  const finalScore = percentage(score, questions.length);
  const passed = finalScore >= 60;
  const xpEarned = passed ? unit.xpReward : Math.round(unit.xpReward * 0.3);

  const handleSelect = (optionIndex: number) => {
    if (answered) return;
    setSelected(optionIndex);
  };

  const handleSubmit = () => {
    if (selected === null || answered) return;
    const correct = selected === (q.answer as number);
    if (correct) setScore((s) => s + 1);
    setAnswered(true);
  };

  const handleNext = () => {
    if (isLast) {
      // save result
      completeQuiz(unit.id, finalScore, xpEarned);
      setFinished(true);
    } else {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const handleRetry = () => {
    setCurrentQ(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    return <ResultScreen
      score={finalScore}
      passed={passed}
      xpEarned={xpEarned}
      lang={lang}
      unit={unit}
      onRetry={handleRetry}
    />;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Back */}
      <Link
        href={`/learn/${unit.slug}`}
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
      >
        <ArrowLeft size={16} />
        Back to {lang === "de" ? unit.titleDe : unit.title}
      </Link>

      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span className="font-semibold text-white">
            {t.question[lang]} {currentQ + 1} {t.of[lang]} {questions.length}
          </span>
          <span className="text-yellow-400 font-semibold">{score} correct</span>
        </div>
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            animate={{ width: `${percentage(currentQ + (answered ? 1 : 0), questions.length)}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
          className="space-y-5"
        >
          <div className="card p-5">
            <p className="text-lg font-bold text-white leading-relaxed">
              {lang === "de" && q.questionDe ? q.questionDe : q.question}
            </p>
          </div>

          {/* True/False */}
          {q.type === "true-false" && q.options && (
            <div className="grid grid-cols-2 gap-3">
              {q.options.map((opt, i) => (
                <OptionButton
                  key={i}
                  label={opt}
                  index={i}
                  selected={selected}
                  answered={answered}
                  correctAnswer={q.answer as number}
                  onClick={handleSelect}
                  large
                />
              ))}
            </div>
          )}

          {/* Multiple choice */}
          {q.type === "multiple-choice" && q.options && (
            <div className="space-y-2">
              {q.options.map((opt, i) => (
                <OptionButton
                  key={i}
                  label={opt}
                  index={i}
                  selected={selected}
                  answered={answered}
                  correctAnswer={q.answer as number}
                  onClick={handleSelect}
                />
              ))}
            </div>
          )}

          {/* Explanation */}
          <AnimatePresence>
            {answered && q.explanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className={cn(
                  "rounded-xl p-4 border text-sm",
                  selected === (q.answer as number)
                    ? "bg-green-900/30 border-green-700 text-green-300"
                    : "bg-red-900/30 border-red-700 text-red-300"
                )}
              >
                <p className="font-semibold mb-1">
                  {selected === (q.answer as number) ? "✓ " + t.correct[lang] : "✗ " + t.incorrect[lang]}
                </p>
                <p>{q.explanation}</p>
              </motion.div>
            )}
            {answered && !q.explanation && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={cn(
                  "rounded-xl p-3 text-sm font-semibold",
                  selected === (q.answer as number)
                    ? "bg-green-900/30 text-green-400"
                    : "bg-red-900/30 text-red-400"
                )}
              >
                {selected === (q.answer as number) ? "✓ " + t.correct[lang] : "✗ " + t.incorrect[lang]}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* Action buttons */}
      <div className="flex gap-3">
        {!answered ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSubmit}
            disabled={selected === null}
            className={cn(
              "btn-primary flex-1",
              selected === null && "opacity-50 cursor-not-allowed"
            )}
          >
            Check Answer
          </motion.button>
        ) : (
          <motion.button
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleNext}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            {isLast ? (
              <>
                <Trophy size={18} />
                {t.finish[lang]}
              </>
            ) : (
              <>
                {t.next[lang]}
                <ChevronRight size={18} />
              </>
            )}
          </motion.button>
        )}
      </div>
    </div>
  );
}

function OptionButton({
  label,
  index,
  selected,
  answered,
  correctAnswer,
  onClick,
  large,
}: {
  label: string;
  index: number;
  selected: number | null;
  answered: boolean;
  correctAnswer: number;
  onClick: (i: number) => void;
  large?: boolean;
}) {
  const isSelected = selected === index;
  const isCorrect = index === correctAnswer;

  let state: "default" | "selected" | "correct" | "wrong" | "missed" = "default";
  if (answered) {
    if (isCorrect) state = "correct";
    else if (isSelected) state = "wrong";
  } else if (isSelected) {
    state = "selected";
  }

  return (
    <motion.button
      whileHover={!answered ? { scale: 1.02 } : {}}
      whileTap={!answered ? { scale: 0.98 } : {}}
      onClick={() => onClick(index)}
      disabled={answered}
      className={cn(
        "w-full text-left font-medium text-sm transition-all rounded-xl border p-3",
        large && "p-4 text-base text-center",
        state === "default" && "card hover:border-gray-600 text-gray-200",
        state === "selected" && "border-yellow-400 bg-yellow-400/10 text-yellow-300",
        state === "correct" && "border-green-500 bg-green-900/30 text-green-300",
        state === "wrong" && "border-red-500 bg-red-900/30 text-red-300"
      )}
    >
      <span className="flex items-center gap-3">
        {!large && (
          <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs shrink-0">
            {String.fromCharCode(65 + index)}
          </span>
        )}
        <span>{label}</span>
        {answered && isCorrect && <CheckCircle size={16} className="ml-auto text-green-400 shrink-0" />}
        {answered && isSelected && !isCorrect && <XCircle size={16} className="ml-auto text-red-400 shrink-0" />}
      </span>
    </motion.button>
  );
}

function ResultScreen({
  score,
  passed,
  xpEarned,
  lang,
  unit,
  onRetry,
}: {
  score: number;
  passed: boolean;
  xpEarned: number;
  lang: Lang;
  unit: (typeof units)[number];
  onRetry: () => void;
}) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card p-8 text-center space-y-5"
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-6xl"
        >
          {passed ? "🏆" : "💪"}
        </motion.div>

        <div>
          <h2 className="text-2xl font-extrabold text-white">
            {passed ? t.passMessage[lang] : t.failMessage[lang]}
          </h2>
          <p className="text-gray-400 mt-1">Unit quiz complete</p>
        </div>

        <div className="flex items-center justify-center gap-8">
          <div className="text-center">
            <p className={cn("text-4xl font-extrabold", passed ? "text-green-400" : "text-orange-400")}>
              {score}%
            </p>
            <p className="text-xs text-gray-400 mt-1">{t.yourScore[lang]}</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-extrabold text-yellow-400 flex items-center gap-1">
              <Star size={28} className="fill-current" />
              {xpEarned}
            </p>
            <p className="text-xs text-gray-400 mt-1">XP Earned</p>
          </div>
        </div>

        <div className="progress-bar h-3">
          <motion.div
            className="progress-fill h-3"
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />
        </div>

        {passed && (
          <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-xl p-3 text-sm text-yellow-300">
            ✓ Unit {unit.id + 1} is now unlocked!
          </div>
        )}
      </motion.div>

      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onRetry}
          className="btn-secondary flex-1 flex items-center justify-center gap-2"
        >
          <RotateCcw size={16} />
          {t.tryAgain[lang]}
        </motion.button>
        <Link href={`/learn/${unit.slug}`} className="flex-1">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} />
            {t.backToLearn[lang]}
          </motion.button>
        </Link>
      </div>
    </div>
  );
}
