"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CheckCircle, Clock, Headphones, Mic, Trophy, Volume2, XCircle } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useProgress } from "@/contexts/ProgressContext";
import { a2MockTests } from "@/data/a2-mock-tests";
import type { MockQuestion } from "@/data/mock-tests";
import { cn, formatTime, percentage } from "@/lib/utils";

const sectionAccent: Record<MockQuestion["section"], string> = {
  reading: "text-blue-300",
  listening: "text-purple-300",
  writing: "text-green-300",
  speaking: "text-orange-300",
};

function speakGerman(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "de-DE";
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
}

function cleanListeningText(context?: string) {
  return (context ?? "")
    .split("\n")
    .filter((line) => line.trim() && !line.includes("[Listen"))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

export default function A2MockTestRunner() {
  const params = useParams<{ id: string }>();
  const test = useMemo(
    () => a2MockTests.find((item) => item.id === Number(params.id)),
    [params.id]
  );
  const { saveMockTestResult } = useProgress();
  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});

  if (!test) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-gray-400">A2 mock test not found.</p>
        <Link href="/mock-tests/a2" className="btn-primary mt-4 inline-flex">Back to A2 tests</Link>
      </div>
    );
  }

  const scoreResult = getScore(test.questions, answers);
  const passed = scoreResult.score >= test.passMark;

  const handleSubmit = () => {
    saveMockTestResult({
      testId: test.id,
      score: scoreResult.score,
      totalPoints: scoreResult.total,
      passed,
      date: new Date().toISOString(),
    });
    setSubmitted(true);
  };

  if (!started) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 space-y-6">
        <Breadcrumbs
          items={[
            { label: "Mock Tests", href: "/mock-tests" },
            { label: "A2 Mock Tests", href: "/mock-tests/a2" },
            { label: test.title },
          ]}
        />

        <div className="card p-6 text-center">
          <p className="text-sm font-bold text-blue-300">TELC A2 simulation</p>
          <h1 className="mt-2 text-3xl font-extrabold text-white">{test.title}</h1>
          <p className="mt-2 text-sm text-gray-400">{test.subtitle}</p>
          <div className="mt-5 grid grid-cols-3 gap-3">
            <Stat label="Duration" value={formatTime(test.duration)} />
            <Stat label="Pass mark" value={`${test.passMark}%`} />
            <Stat label="Questions" value={`${test.questions.length}`} />
          </div>
          <button onClick={() => setStarted(true)} className="btn-primary mt-6 inline-flex items-center gap-2">
            <Clock size={18} />
            Start A2 test
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 space-y-5">
      <Breadcrumbs
        items={[
          { label: "Mock Tests", href: "/mock-tests" },
          { label: "A2 Mock Tests", href: "/mock-tests/a2" },
          { label: test.title },
        ]}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/mock-tests/a2" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-white">
          <ArrowLeft size={16} />
          A2 tests
        </Link>
        <div className="rounded-xl border border-gray-800 bg-gray-900 px-4 py-2 text-sm font-bold text-white">
          {Object.keys(answers).length}/{test.questions.length} answered
        </div>
      </div>

      {submitted && (
        <div
          className={cn(
            "card flex items-center gap-4 p-5",
            passed ? "border-green-500/30" : "border-orange-500/30"
          )}
        >
          <Trophy className={passed ? "text-green-300" : "text-orange-300"} size={32} />
          <div>
            <p className="text-2xl font-extrabold text-white">{scoreResult.score}%</p>
            <p className="text-sm text-gray-400">
              {scoreResult.earned}/{scoreResult.total} points. {passed ? "Passed" : "Needs more practice"}.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {test.questions.map((question, index) => (
          <QuestionBlock
            key={question.id}
            question={question}
            index={index}
            answer={answers[question.id]}
            submitted={submitted}
            onAnswer={(value) => setAnswers((prev) => ({ ...prev, [question.id]: value }))}
          />
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          onClick={handleSubmit}
          disabled={submitted || Object.keys(answers).length < test.questions.length}
          className="btn-primary flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Trophy size={18} />
          Submit test
        </button>
        <button
          onClick={() => {
            setAnswers({});
            setSubmitted(false);
          }}
          className="btn-secondary"
        >
          Reset answers
        </button>
      </div>
    </div>
  );
}

function QuestionBlock({
  question,
  index,
  answer,
  submitted,
  onAnswer,
}: {
  question: MockQuestion;
  index: number;
  answer: string | number | undefined;
  submitted: boolean;
  onAnswer: (value: string | number) => void;
}) {
  const isChoice = question.type === "multiple-choice" || question.type === "true-false";
  const isCorrect = isChoice ? answer === question.answer : Boolean(String(answer ?? "").trim());
  const audioText = cleanListeningText(question.context);

  return (
    <article className="card p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className={cn("text-xs font-bold uppercase tracking-wide", sectionAccent[question.section])}>
            {question.section} | Question {index + 1} | {question.points} pts
          </p>
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

      {question.section === "listening" && (
        <button
          onClick={() => speakGerman(audioText)}
          className="mt-4 inline-flex items-center gap-2 rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm font-bold text-purple-200"
        >
          <Headphones size={16} />
          Play listening audio
        </button>
      )}

      {question.section === "speaking" && question.speakerScript && (
        <button
          onClick={() => speakGerman(question.speakerScript ?? "")}
          className="mt-4 inline-flex items-center gap-2 rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-bold text-orange-200"
        >
          <Mic size={16} />
          Hear speaking prompt
        </button>
      )}

      {question.context && question.section !== "listening" && (
        <div className="mt-4 whitespace-pre-wrap rounded-xl border border-gray-800 bg-gray-950 p-4 text-sm leading-relaxed text-gray-300">
          {question.context}
        </div>
      )}

      {question.options ? (
        <div className="mt-4 space-y-2">
          {question.options.map((option, optionIndex) => {
            const selected = answer === optionIndex;
            const correct = submitted && question.answer === optionIndex;
            return (
              <button
                key={option}
                onClick={() => onAnswer(optionIndex)}
                disabled={submitted}
                className={cn(
                  "w-full rounded-xl border p-3 text-left text-sm font-semibold transition-colors",
                  selected ? "border-yellow-400 bg-yellow-400/10 text-yellow-300" : "border-gray-800 bg-gray-950 text-gray-300 hover:border-gray-700",
                  correct && "border-green-500/40 bg-green-500/10 text-green-300",
                  submitted && selected && !correct && "border-red-500/40 bg-red-500/10 text-red-300"
                )}
              >
                {option}
              </button>
            );
          })}
        </div>
      ) : (
        <textarea
          value={String(answer ?? "")}
          onChange={(event) => onAnswer(event.target.value)}
          disabled={submitted}
          rows={question.type === "essay" ? 5 : 3}
          className="mt-4 w-full resize-none rounded-xl border border-gray-800 bg-gray-950 p-3 text-sm text-white outline-none transition-colors focus:border-yellow-400"
          placeholder={question.section === "speaking" ? "Type notes or your spoken answer..." : "Write your answer in German..."}
        />
      )}

      {submitted && (
        <div className="mt-4 rounded-xl border border-blue-500/20 bg-blue-500/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-bold uppercase tracking-wide text-blue-300">Model answer</p>
            <button onClick={() => speakGerman(String(question.answer))} className="text-blue-300 hover:text-blue-200">
              <Volume2 size={15} />
            </button>
          </div>
          <p className="mt-2 text-sm text-blue-100">{String(question.answer)}</p>
          {question.explanation && <p className="mt-2 text-xs text-blue-200/70">{question.explanation}</p>}
        </div>
      )}
    </article>
  );
}

function getScore(questions: MockQuestion[], answers: Record<string, string | number>) {
  const earned = questions.reduce((sum, question) => {
    const answer = answers[question.id];
    if (question.type === "multiple-choice" || question.type === "true-false") {
      return answer === question.answer ? sum + question.points : sum;
    }
    return String(answer ?? "").trim() ? sum + Math.round(question.points * 0.7) : sum;
  }, 0);
  const total = questions.reduce((sum, question) => sum + question.points, 0);

  return {
    earned,
    total,
    score: percentage(earned, total),
  };
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-950 p-3">
      <p className="text-lg font-extrabold text-white">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}
