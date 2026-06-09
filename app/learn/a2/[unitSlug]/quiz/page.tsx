"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CheckCircle, Trophy, XCircle } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useProgress } from "@/contexts/ProgressContext";
import { a2Units } from "@/data/a2-curriculum";
import { cn, percentage } from "@/lib/utils";

export default function A2QuizPage() {
  const params = useParams<{ unitSlug: string }>();
  const unit = useMemo(
    () => a2Units.find((item) => item.slug === params.unitSlug),
    [params.unitSlug]
  );
  const { completeQuiz } = useProgress();
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [submitted, setSubmitted] = useState(false);

  if (!unit) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-gray-400">A2 unit not found.</p>
        <Link href="/learn/a2" className="btn-primary mt-4 inline-flex">Back to A2</Link>
      </div>
    );
  }

  const earned = unit.quiz.reduce((sum, question) => {
    const answer = answers[question.id];
    if (question.type === "fill-blank") {
      return String(answer ?? "").trim().toLowerCase() === String(question.answer).toLowerCase()
        ? sum + 1
        : sum;
    }
    return answer === question.answer ? sum + 1 : sum;
  }, 0);
  const score = percentage(earned, unit.quiz.length);
  const passed = score >= 70;

  const handleSubmit = () => {
    completeQuiz(unit.id, score, passed ? unit.xpReward : Math.round(unit.xpReward / 2));
    setSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 space-y-5">
      <Breadcrumbs
        items={[
          { label: "Courses", href: "/learn" },
          { label: "A2", href: "/learn/a2" },
          { label: unit.title, href: `/learn/a2/${unit.slug}` },
          { label: "Quiz" },
        ]}
      />

      <Link
        href={`/learn/a2/${unit.slug}`}
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 transition-colors hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to unit
      </Link>

      <header className="card p-5">
        <p className="text-sm font-bold text-blue-300">TELC A2 unit quiz</p>
        <h1 className="mt-1 text-3xl font-extrabold text-white">{unit.title}</h1>
        <p className="mt-2 text-sm text-gray-400">{unit.examFocus}</p>
      </header>

      {submitted && (
        <div
          className={cn(
            "card flex items-center gap-4 p-5",
            passed ? "border-green-500/30" : "border-orange-500/30"
          )}
        >
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
              passed ? "bg-green-500/15 text-green-300" : "bg-orange-500/15 text-orange-300"
            )}
          >
            <Trophy size={24} />
          </div>
          <div>
            <p className="text-xl font-extrabold text-white">{score}%</p>
            <p className="text-sm text-gray-400">
              {passed ? "Passed. The next A2 topic is ready." : "Keep practising and retake when ready."}
            </p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {unit.quiz.map((question, index) => {
          const answer = answers[question.id];
          const isCorrect =
            question.type === "fill-blank"
              ? String(answer ?? "").trim().toLowerCase() === String(question.answer).toLowerCase()
              : answer === question.answer;

          return (
            <article key={question.id} className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Question {index + 1}</p>
                  <h2 className="mt-2 font-bold text-white">{question.question}</h2>
                </div>
                {submitted && (
                  isCorrect ? (
                    <CheckCircle className="shrink-0 text-green-400" size={20} />
                  ) : (
                    <XCircle className="shrink-0 text-red-400" size={20} />
                  )
                )}
              </div>

              {question.options ? (
                <div className="mt-4 space-y-2">
                  {question.options.map((option, optionIndex) => {
                    const selected = answer === optionIndex;
                    const correct = question.answer === optionIndex;
                    return (
                      <button
                        key={option}
                        onClick={() => setAnswers((prev) => ({ ...prev, [question.id]: optionIndex }))}
                        disabled={submitted}
                        className={cn(
                          "w-full rounded-xl border p-3 text-left text-sm font-semibold transition-colors",
                          selected ? "border-yellow-400 bg-yellow-400/10 text-yellow-300" : "border-gray-800 bg-gray-950 text-gray-300 hover:border-gray-700",
                          submitted && correct && "border-green-500/40 bg-green-500/10 text-green-300",
                          submitted && selected && !correct && "border-red-500/40 bg-red-500/10 text-red-300"
                        )}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <input
                  value={String(answer ?? "")}
                  onChange={(event) => setAnswers((prev) => ({ ...prev, [question.id]: event.target.value }))}
                  disabled={submitted}
                  className="mt-4 w-full rounded-xl border border-gray-800 bg-gray-950 p-3 text-sm text-white outline-none transition-colors focus:border-yellow-400"
                  placeholder="Type your answer"
                />
              )}

              {submitted && question.explanation && (
                <p className="mt-3 rounded-xl border border-blue-500/20 bg-blue-500/10 p-3 text-sm text-blue-200">
                  {question.explanation}
                </p>
              )}
            </article>
          );
        })}
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitted || Object.keys(answers).length < unit.quiz.length}
        className="btn-primary flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Trophy size={18} />
        Submit A2 quiz
      </button>
    </div>
  );
}
