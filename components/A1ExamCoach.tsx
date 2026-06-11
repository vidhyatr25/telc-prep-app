"use client";

import { useMemo, useState } from "react";
import { BookOpen, CheckCircle2, Headphones, Mic, PencilLine, Users } from "lucide-react";
import { a1StudentAudit, examModules, readinessChecks, type ExamModuleId } from "@/data/a1-exam-coach";
import { cn } from "@/lib/utils";

const moduleIcons = {
  reading: BookOpen,
  listening: Headphones,
  writing: PencilLine,
  speaking: Mic,
};

const moduleColors = {
  reading: "text-blue-300 border-blue-400/20 bg-blue-400/10",
  listening: "text-cyan-300 border-cyan-400/20 bg-cyan-400/10",
  writing: "text-emerald-300 border-emerald-400/20 bg-emerald-400/10",
  speaking: "text-violet-300 border-violet-400/20 bg-violet-400/10",
};

export function A1ExamCoach() {
  const [activeId, setActiveId] = useState<ExamModuleId>("speaking");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const activeModule = useMemo(
    () => examModules.find((module) => module.id === activeId) ?? examModules[0],
    [activeId]
  );
  const ActiveIcon = moduleIcons[activeModule.id];
  const score = activeModule.quiz.reduce((sum, item, index) => {
    return answers[`${activeModule.id}-${index}`] === item.answer ? sum + 1 : sum;
  }, 0);

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase text-yellow-400">A1 Exam Coach</p>
          <h2 className="text-xl font-extrabold text-white">Can students clear A1?</h2>
          <p className="mt-1 max-w-3xl text-sm text-gray-400">
            The course is stronger now, but students should still pass these readiness checks before booking the exam.
          </p>
        </div>
        <div className="rounded-xl border border-green-400/20 bg-green-400/10 px-4 py-2 text-sm font-bold text-green-300">
          Ready after checklist + mock tests
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="card p-4 md:p-5">
          <div className="grid gap-2 sm:grid-cols-4">
            {examModules.map((module) => {
              const Icon = moduleIcons[module.id];
              const selected = activeId === module.id;
              return (
                <button
                  key={module.id}
                  onClick={() => setActiveId(module.id)}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold transition-colors",
                    selected
                      ? moduleColors[module.id]
                      : "border-gray-800 bg-gray-950 text-gray-400 hover:border-gray-700 hover:text-white"
                  )}
                >
                  <Icon size={16} />
                  {module.label}
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex items-start gap-3">
            <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border", moduleColors[activeModule.id])}>
              <ActiveIcon size={20} />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">{activeModule.label} cheat sheet</h3>
              <p className="text-sm text-gray-400">{activeModule.goal}</p>
            </div>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {activeModule.cheatSheet.map((tip) => (
              <div key={tip} className="rounded-xl border border-gray-800 bg-gray-950 px-3 py-2 text-sm text-gray-300">
                {tip}
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-xl border border-gray-800 bg-gray-950 p-4">
            <div className="flex items-center justify-between gap-3">
              <h4 className="font-bold text-white">{activeModule.label} mini-quiz</h4>
              <span className="text-xs font-bold text-yellow-400">{score}/{activeModule.quiz.length}</span>
            </div>
            <div className="mt-4 space-y-4">
              {activeModule.quiz.map((question, questionIndex) => {
                const answerKey = `${activeModule.id}-${questionIndex}`;
                const selected = answers[answerKey];
                return (
                  <div key={question.question} className="space-y-2">
                    <p className="text-sm font-semibold text-gray-200">{question.question}</p>
                    <div className="grid gap-2 sm:grid-cols-3">
                      {question.options.map((option, optionIndex) => {
                        const chosen = selected === optionIndex;
                        const correct = question.answer === optionIndex;
                        return (
                          <button
                            key={option}
                            onClick={() => setAnswers((prev) => ({ ...prev, [answerKey]: optionIndex }))}
                            className={cn(
                              "min-h-11 rounded-xl border px-3 py-2 text-left text-xs font-semibold transition-colors",
                              chosen && correct
                                ? "border-green-400/30 bg-green-400/10 text-green-200"
                                : chosen
                                ? "border-red-400/30 bg-red-400/10 text-red-200"
                                : "border-gray-800 bg-gray-900 text-gray-400 hover:border-gray-700 hover:text-white"
                            )}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-yellow-400" />
              <h3 className="font-extrabold text-white">Pass readiness</h3>
            </div>
            <div className="mt-3 space-y-2">
              {readinessChecks.map((check) => (
                <div key={check} className="flex gap-2 text-sm text-gray-300">
                  <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-green-300" />
                  <span>{check}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-blue-300" />
              <h3 className="font-extrabold text-white">10-learner feedback added</h3>
            </div>
            <div className="mt-3 max-h-72 space-y-3 overflow-y-auto pr-1">
              {a1StudentAudit.map((item) => (
                <div key={item.student} className="rounded-xl border border-gray-800 bg-gray-950 p-3">
                  <p className="text-xs font-bold uppercase text-gray-500">{item.student}</p>
                  <p className="mt-1 text-sm text-gray-300">{item.concern}</p>
                  <p className="mt-2 text-xs font-semibold text-yellow-300">{item.productChange}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
