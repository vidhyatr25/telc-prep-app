"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  Trophy,
  RotateCcw,
  BookOpen,
  Volume2,
  Mic,
  Play,
  Headphones,
} from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { useProgress } from "@/contexts/ProgressContext";
import { courseLevels } from "@/data/curriculum";
import { mockTests, type MockTest, type MockQuestion } from "@/data/mock-tests";
import { UnavailablePracticePage } from "@/components/practice/UnavailablePracticePage";
import { t } from "@/data/translations";
import { cn, formatTime, percentage } from "@/lib/utils";
import { Breadcrumbs } from "@/components/Breadcrumbs";

type Section = "reading" | "listening" | "writing" | "speaking";
const sections: Section[] = ["reading", "listening", "writing", "speaking"];

const sectionIcons: Record<Section, string> = {
  reading: "📖",
  listening: "🎧",
  writing: "✍️",
  speaking: "🎤",
};

const sectionColors: Record<Section, string> = {
  reading: "text-blue-400",
  listening: "text-purple-400",
  writing: "text-green-400",
  speaking: "text-orange-400",
};

const sectionInstructions: Record<Section, string> = {
  reading: "Read each text carefully, then answer the question.",
  listening: "Press Play to hear the audio. You may listen up to 2 times — the transcript is hidden, just like the real exam.",
  writing: "Complete each writing task in German. Grammar and vocabulary matter.",
  speaking: "The AI Examiner will speak to you in German. Record your response out loud.",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function speak(text: string, langCode = "de-DE", slow = false) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = langCode;
  utt.rate = slow ? 0.7 : 0.9;
  window.speechSynthesis.speak(utt);
}

function extractAudioScript(context: string): string {
  if (!context) return "";
  return context
    .split("\n")
    .filter((l) => l.trim() && !l.includes("🎧") && !l.match(/^\s*\[.*\]\s*$/))
    .join(" ")
    .replace(/['"]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function MockTestRunnerPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const { lang } = useLang();
  const { saveMockTestResult } = useProgress();

  const levelRoute = courseLevels.find((level) => level.slug === id);
  if (levelRoute && levelRoute.id !== "a1") {
    return <UnavailablePracticePage levelSlug={id} kind="mock-tests" />;
  }

  const test = mockTests.find((m) => m.id === Number(id));

  const [activeSection, setActiveSection] = useState<Section>("reading");
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [audioPlays, setAudioPlays] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(test?.duration ?? 3600);
  const [submitted, setSubmitted] = useState(false);
  const [started, setStarted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!started || submitted) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [started, submitted]);

  if (!test) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-400">Test not found.</p>
        <Link href="/mock-tests/a1" className="btn-primary mt-4 inline-block">Back to Tests</Link>
      </div>
    );
  }

  const sectionQuestions = (sec: Section) => test.questions.filter((q) => q.section === sec);
  const currentQuestions = sectionQuestions(activeSection);
  const answeredCount = Object.keys(answers).length;
  const totalQ = test.questions.length;
  const timerWarning = timeLeft < 300;

  const handleAnswer = (qId: string, value: string | number) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const handlePlay = (qId: string) => {
    setAudioPlays((prev) => ({ ...prev, [qId]: (prev[qId] ?? 0) + 1 }));
  };

  const handleSubmit = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    let earned = 0;
    let total = 0;
    test.questions.forEach((q) => {
      total += q.points;
      const ua = answers[q.id];
      if (q.type === "multiple-choice" || q.type === "true-false") {
        if (ua === (q.answer as number) || ua === q.answer) earned += q.points;
      } else if (ua && String(ua).trim().length > 0) {
        earned += Math.round(q.points * 0.7);
      }
    });
    const score = percentage(earned, total);
    saveMockTestResult({ testId: test.id, score, totalPoints: total, passed: score >= test.passMark, date: new Date().toISOString() });
    setSubmitted(true);
  };

  if (!started) return <StartScreen test={test} lang={lang} onStart={() => setStarted(true)} />;

  if (submitted) {
    return (
      <ResultsScreen
        test={test}
        answers={answers}
        lang={lang}
        onRetake={() => {
          setAnswers({});
          setAudioPlays({});
          setTimeLeft(test.duration);
          setSubmitted(false);
          setStarted(false);
          setActiveSection("reading");
        }}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
      <Breadcrumbs
        items={[
          { label: "Mock Tests", href: "/mock-tests" },
          { label: "A1 Mock Tests", href: "/mock-tests/a1" },
          { label: test.title },
        ]}
      />

      {/* Header bar */}
      <div className="flex items-center justify-between">
        <Link href="/mock-tests/a1" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm">
          <ArrowLeft size={16} />
          Tests
        </Link>
        <div className={cn(
          "flex items-center gap-2 font-mono font-bold text-lg px-4 py-2 rounded-xl",
          timerWarning ? "bg-red-900/40 text-red-400 border border-red-600/30 animate-pulse" : "bg-gray-800 text-white"
        )}>
          <Clock size={18} />
          {formatTime(timeLeft)}
        </div>
        <div className="text-sm text-gray-400">
          <span className="text-white font-semibold">{answeredCount}</span>/{totalQ} answered
        </div>
      </div>

      {/* Section tabs */}
      <div className="flex gap-1 bg-gray-900 p-1 rounded-xl border border-gray-800">
        {sections.map((sec) => {
          const secQs = sectionQuestions(sec);
          if (secQs.length === 0) return null;
          const answeredInSec = secQs.filter((q) => answers[q.id] !== undefined).length;
          const active = sec === activeSection;
          return (
            <button
              key={sec}
              onClick={() => setActiveSection(sec)}
              className={cn(
                "flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-lg text-xs font-semibold transition-all",
                active ? "bg-yellow-400/10 text-yellow-400" : "text-gray-500 hover:text-gray-300"
              )}
            >
              <span>{sectionIcons[sec]}</span>
              <span className="hidden sm:inline capitalize">{t[sec]?.[lang] ?? sec}</span>
              <span className={cn("text-xs", answeredInSec === secQs.length ? "text-green-400" : "text-gray-600")}>
                {answeredInSec}/{secQs.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Section instruction banner */}
      <div className={cn(
        "rounded-xl px-4 py-2.5 text-xs font-medium border flex items-center gap-2",
        activeSection === "listening" ? "bg-purple-900/20 border-purple-700/30 text-purple-300" :
        activeSection === "speaking"  ? "bg-orange-900/20 border-orange-700/30 text-orange-300" :
        activeSection === "writing"   ? "bg-green-900/20 border-green-700/30 text-green-300" :
                                        "bg-blue-900/20 border-blue-700/30 text-blue-300"
      )}>
        <span>{sectionIcons[activeSection]}</span>
        {sectionInstructions[activeSection]}
      </div>

      {/* Questions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          {currentQuestions.map((q, qi) => {
            const commonProps = {
              question: q,
              index: qi,
              answer: answers[q.id],
              onAnswer: (val: string | number) => handleAnswer(q.id, val),
              lang,
            };

            if (q.section === "listening") {
              return (
                <ListeningCard
                  key={q.id}
                  {...commonProps}
                  plays={audioPlays[q.id] ?? 0}
                  onPlay={() => handlePlay(q.id)}
                />
              );
            }
            if (q.section === "speaking") {
              return <SpeakingCard key={q.id} {...commonProps} />;
            }
            return <QuestionCard key={q.id} {...commonProps} />;
          })}
        </motion.div>
      </AnimatePresence>

      {/* Submit */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-4 border-t border-gray-800">
        <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
          <span>{answeredCount} / {totalQ} questions answered</span>
          {answeredCount < totalQ && <span className="text-orange-400">{totalQ - answeredCount} unanswered</span>}
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          className={cn("btn-primary w-full flex items-center justify-center gap-2", answeredCount < totalQ && "opacity-80")}
        >
          <Trophy size={18} />
          {(t as any).submitTest?.[lang] ?? "Submit Test"}
        </motion.button>
      </motion.div>
    </div>
  );
}

// ── Listening Card ────────────────────────────────────────────────────────────
function ListeningCard({
  question, index, answer, onAnswer, lang, plays, onPlay,
}: {
  question: MockQuestion;
  index: number;
  answer: string | number | undefined;
  onAnswer: (val: string | number) => void;
  lang: string;
  plays: number;
  onPlay: () => void;
}) {
  const audioText = extractAudioScript(question.context ?? "");
  const maxPlays = 2;
  const canPlay = plays < maxPlays;
  const hasPlayed = plays > 0;

  const handlePlay = () => {
    if (!canPlay) return;
    speak(audioText, "de-DE");
    onPlay();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="card p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="w-6 h-6 rounded-full bg-purple-400/10 text-purple-400 text-xs font-bold flex items-center justify-center">{index + 1}</span>
        <span className="text-xs text-gray-500 font-semibold uppercase tracking-wide">{question.points} pts</span>
        <span className="ml-auto text-xs text-purple-300 font-semibold flex items-center gap-1">
          <Headphones size={12} /> Listening
        </span>
        {answer !== undefined && <CheckCircle size={14} className="text-green-400" />}
      </div>

      {/* Audio player */}
      <div className="bg-purple-900/20 border border-purple-700/30 rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-600/30 flex items-center justify-center shrink-0">
            <Headphones size={20} className="text-purple-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white">Audio Recording</p>
            <p className="text-xs text-gray-400">{plays}/{maxPlays} plays used · Transcript hidden</p>
          </div>
          <button
            onClick={handlePlay}
            disabled={!canPlay}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shrink-0",
              canPlay
                ? "bg-purple-600 hover:bg-purple-500 text-white"
                : "bg-gray-800 text-gray-600 cursor-not-allowed"
            )}
          >
            <Play size={14} />
            {plays === 0 ? "Play" : plays >= maxPlays ? "Played ✓" : "Play Again"}
          </button>
        </div>
        {plays > 0 && plays < maxPlays && (
          <p className="text-xs text-purple-400/70 text-center">1 more play remaining</p>
        )}
        {plays >= maxPlays && (
          <p className="text-xs text-gray-500 text-center">Maximum plays reached (TELC A1 limit)</p>
        )}
      </div>

      {/* Question — only revealed after first play */}
      <AnimatePresence>
        {!hasPlayed && (
          <motion.div exit={{ opacity: 0 }} className="text-center py-3 text-gray-500 text-sm">
            Press <strong className="text-purple-400">Play</strong> to hear the audio, then answer below.
          </motion.div>
        )}
      </AnimatePresence>

      {hasPlayed && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <p className="font-semibold text-white">{question.question}</p>

          {question.type === "multiple-choice" && question.options && (
            <div className="space-y-2">
              {question.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => onAnswer(i)}
                  className={cn(
                    "w-full text-left p-3 rounded-xl border text-sm font-medium transition-all",
                    answer === i ? "border-yellow-400 bg-yellow-400/10 text-yellow-300" : "card hover:border-gray-600 text-gray-200"
                  )}
                >
                  <span className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-xs shrink-0">
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </span>
                </button>
              ))}
            </div>
          )}

          {question.type === "true-false" && question.options && (
            <div className="grid grid-cols-2 gap-3">
              {question.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => onAnswer(i)}
                  className={cn(
                    "p-3 rounded-xl border text-sm font-bold text-center transition-all",
                    answer === i ? "border-yellow-400 bg-yellow-400/10 text-yellow-300" : "card hover:border-gray-600 text-gray-200"
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

// ── Speaking Card ─────────────────────────────────────────────────────────────
function SpeakingCard({
  question, index, answer, onAnswer, lang,
}: {
  question: MockQuestion;
  index: number;
  answer: string | number | undefined;
  onAnswer: (val: string | number) => void;
  lang: string;
}) {
  const [examinerSpoken, setExaminerSpoken] = useState(false);
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState((typeof answer === "string" ? answer : "") || "");
  const recognitionRef = useRef<any>(null);

  const examinerText = question.speakerScript ?? "";
  const hasMic = typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const handleHear = () => {
    if (examinerText) speak(examinerText, "de-DE");
    setExaminerSpoken(true);
  };

  const startRecording = () => {
    if (!hasMic) {
      onAnswer("(spoken response)");
      return;
    }
    const SR = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = "de-DE";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    setRecording(true);

    rec.onresult = (e: any) => {
      const said = e.results[0][0].transcript;
      setTranscript(said);
      onAnswer(said);
      setRecording(false);
    };
    rec.onerror = () => setRecording(false);
    rec.onend = () => setRecording(false);
    recognitionRef.current = rec;
    rec.start();
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
    setRecording(false);
  };

  const hasAnswered = answer !== undefined;

  // ── MCQ Speaking ──
  if (question.type === "multiple-choice") {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="card p-5 space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-orange-400/10 text-orange-400 text-xs font-bold flex items-center justify-center">{index + 1}</span>
          <span className="text-xs text-gray-500 font-semibold uppercase tracking-wide">{question.points} pts</span>
          <span className="ml-auto text-xs text-orange-300 font-semibold flex items-center gap-1"><Mic size={12} /> Speaking</span>
          {hasAnswered && <CheckCircle size={14} className="text-green-400" />}
        </div>

        {/* AI Examiner */}
        <div className="bg-orange-900/20 border border-orange-700/30 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-600/20 border border-orange-600/30 flex items-center justify-center text-xl">👩‍🏫</div>
            <div>
              <p className="text-sm font-bold text-orange-300">AI Examiner</p>
              <p className="text-xs text-gray-500">TELC A1 — Speaking Test</p>
            </div>
          </div>
          <button
            onClick={handleHear}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-600/20 border border-orange-600/30 text-orange-300 hover:bg-orange-600/30 transition-colors text-sm font-semibold w-full justify-center"
          >
            <Volume2 size={14} />
            {examinerSpoken ? "Hear again" : "Hear the question"}
          </button>
          {examinerSpoken && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-white italic border-t border-orange-700/20 pt-2">
              "{examinerText}"
            </motion.p>
          )}
        </div>

        <p className="text-sm text-gray-400 font-medium">Choose the most appropriate response:</p>
        <div className="space-y-2">
          {question.options?.map((opt, i) => (
            <button
              key={i}
              onClick={() => onAnswer(i)}
              className={cn(
                "w-full text-left p-3 rounded-xl border text-sm font-medium transition-all",
                answer === i ? "border-yellow-400 bg-yellow-400/10 text-yellow-300" : "card hover:border-gray-600 text-gray-200"
              )}
            >
              <span className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-xs shrink-0">
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </span>
            </button>
          ))}
        </div>
      </motion.div>
    );
  }

  // ── Essay Speaking ──
  const taskLines = question.question.split("\n").filter((l) => l.trim());
  const taskTitle = taskLines[0].replace(/🎤\s*(SPEAKING[^:—\n]*[:\s—]*)?/i, "").trim();
  const bulletPoints = taskLines.filter((l) => l.match(/^[•\d]/)).map((l) => l.replace(/^[•\d.\s]+/, "").trim());

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="card p-5 space-y-4">
      <div className="flex items-center gap-2">
        <span className="w-6 h-6 rounded-full bg-orange-400/10 text-orange-400 text-xs font-bold flex items-center justify-center">{index + 1}</span>
        <span className="text-xs text-gray-500 font-semibold uppercase tracking-wide">{question.points} pts</span>
        <span className="ml-auto text-xs text-orange-300 font-semibold flex items-center gap-1"><Mic size={12} /> Speaking</span>
        {hasAnswered && <CheckCircle size={14} className="text-green-400" />}
      </div>

      {/* AI Examiner panel */}
      <div className="bg-orange-900/20 border border-orange-700/30 rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-600/20 border border-orange-600/30 flex items-center justify-center text-xl">👩‍🏫</div>
          <div>
            <p className="text-sm font-bold text-orange-300">AI Examiner</p>
            <p className="text-xs text-gray-500">TELC A1 — Speaking Test</p>
          </div>
          <button
            onClick={handleHear}
            className="ml-auto flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-600/20 border border-orange-600/30 text-orange-300 hover:bg-orange-600/30 transition-colors text-sm font-semibold"
          >
            <Volume2 size={14} />
            {examinerSpoken ? "Hear again" : "Hear task"}
          </button>
        </div>
        <AnimatePresence>
          {examinerSpoken && (
            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="text-sm text-white italic border-t border-orange-700/20 pt-2">
              "{examinerText}"
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Task instructions */}
      <div className="space-y-2">
        <p className="text-sm font-bold text-white">{taskTitle}</p>
        {bulletPoints.length > 0 && (
          <ul className="space-y-1.5">
            {bulletPoints.map((pt, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0 mt-1.5" />
                {pt}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Recording area */}
      <div className="space-y-3">
        {!hasAnswered || recording ? (
          <button
            onClick={recording ? stopRecording : startRecording}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all",
              recording
                ? "bg-red-600/30 border border-red-500/40 text-red-300 animate-pulse"
                : "bg-orange-600/20 border border-orange-600/30 text-orange-300 hover:bg-orange-600/30"
            )}
          >
            <Mic size={16} />
            {recording ? "🔴 Recording… Click to stop" : hasMic ? "🎙️ Start Speaking" : "Mark as Attempted"}
          </button>
        ) : null}

        {!hasMic && !hasAnswered && (
          <p className="text-xs text-gray-500 text-center">Microphone not available — click the button to mark as attempted.</p>
        )}

        {/* Transcript */}
        <AnimatePresence>
          {(transcript || hasAnswered) && !recording && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-900/20 border border-green-700/30 rounded-xl p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-green-400 uppercase tracking-wide">Your Response</p>
                <button onClick={startRecording} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                  Record again
                </button>
              </div>
              <p className="text-sm text-gray-300 italic">
                {transcript || "(speaking response recorded)"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Model answer shown after attempting */}
        <AnimatePresence>
          {hasAnswered && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-blue-900/20 border border-blue-700/30 rounded-xl p-4 space-y-2">
              <p className="text-xs font-bold text-blue-400 uppercase tracking-wide">Model Answer</p>
              <p className="text-sm text-gray-300 italic">{question.answer as string}</p>
              <button
                onClick={() => speak(question.answer as string, "de-DE")}
                className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors mt-1"
              >
                <Volume2 size={12} />
                Hear model answer
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ── Generic Question Card (reading + writing) ─────────────────────────────────
function QuestionCard({
  question, index, answer, onAnswer, lang,
}: {
  question: MockQuestion;
  index: number;
  answer: string | number | undefined;
  onAnswer: (val: string | number) => void;
  lang: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="card p-5 space-y-4"
    >
      <div className="flex items-center gap-2">
        <span className="w-6 h-6 rounded-full bg-yellow-400/10 text-yellow-400 text-xs font-bold flex items-center justify-center">{index + 1}</span>
        <span className="text-xs text-gray-500 font-semibold uppercase tracking-wide">{question.points} pts</span>
        {answer !== undefined && <CheckCircle size={14} className="text-green-400 ml-auto" />}
      </div>

      {question.context && (
        <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
          {question.context}
        </div>
      )}

      <p className="font-semibold text-white">{question.question}</p>

      {question.type === "multiple-choice" && question.options && (
        <div className="space-y-2">
          {question.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => onAnswer(i)}
              className={cn(
                "w-full text-left p-3 rounded-xl border text-sm font-medium transition-all",
                answer === i ? "border-yellow-400 bg-yellow-400/10 text-yellow-300" : "card hover:border-gray-600 text-gray-200"
              )}
            >
              <span className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-xs shrink-0">
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </span>
            </button>
          ))}
        </div>
      )}

      {question.type === "true-false" && question.options && (
        <div className="grid grid-cols-2 gap-3">
          {question.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => onAnswer(i)}
              className={cn(
                "p-3 rounded-xl border text-sm font-bold text-center transition-all",
                answer === i ? "border-yellow-400 bg-yellow-400/10 text-yellow-300" : "card hover:border-gray-600 text-gray-200"
              )}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {(question.type === "fill-blank" || question.type === "essay") && (
        <textarea
          rows={question.type === "essay" ? 5 : 3}
          placeholder={question.type === "essay" ? "Write your answer in German..." : "Fill in your answer..."}
          value={(answer as string) ?? ""}
          onChange={(e) => onAnswer(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white text-sm resize-none focus:outline-none focus:border-yellow-400 placeholder-gray-600"
        />
      )}
    </motion.div>
  );
}

// ── Start Screen ──────────────────────────────────────────────────────────────
function StartScreen({ test, lang, onStart }: { test: MockTest; lang: string; onStart: () => void }) {
  const presentSections = Array.from(new Set(test.questions.map((q) => q.section)));

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8 text-center">
      <div className="text-left">
        <Breadcrumbs
          items={[
            { label: "Mock Tests", href: "/mock-tests" },
            { label: "A1 Mock Tests", href: "/mock-tests/a1" },
            { label: test.title },
          ]}
        />
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
        <div className="text-6xl">📋</div>
        <h1 className="text-3xl font-extrabold text-white">{test.title}</h1>
        <p className="text-gray-400">{test.subtitle}</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6 space-y-4 text-left">
        <h3 className="font-bold text-white">Before you start:</h3>
        <ul className="space-y-3 text-sm text-gray-300">
          <li className="flex items-start gap-2">
            <Clock size={14} className="text-yellow-400 shrink-0 mt-0.5" />
            <span>You have <strong className="text-white">{formatTime(test.duration)}</strong> to complete all sections</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle size={14} className="text-green-400 shrink-0 mt-0.5" />
            <span>Pass mark is <strong className="text-white">{test.passMark}%</strong></span>
          </li>
          <li className="flex items-start gap-2">
            <Headphones size={14} className="text-purple-400 shrink-0 mt-0.5" />
            <span><strong className="text-white">Listening:</strong> audio will play via TTS. Transcripts are hidden — max 2 plays per question.</span>
          </li>
          <li className="flex items-start gap-2">
            <Mic size={14} className="text-orange-400 shrink-0 mt-0.5" />
            <span><strong className="text-white">Speaking:</strong> the AI Examiner speaks in German. Record your spoken response (Chrome/Edge) or type it.</span>
          </li>
          <li className="flex items-start gap-2">
            <BookOpen size={14} className="text-blue-400 shrink-0 mt-0.5" />
            <span>{test.questions.length} questions across {presentSections.length} sections</span>
          </li>
        </ul>

        <div className="pt-2 border-t border-gray-800 grid grid-cols-4 gap-2">
          {presentSections.map((sec) => {
            const count = test.questions.filter((q) => q.section === sec).length;
            return (
              <div key={sec} className="text-center">
                <p className="text-xl">{sectionIcons[sec as Section] ?? "📄"}</p>
                <p className="text-xs text-gray-400 capitalize mt-1">{sec}</p>
                <p className="text-xs text-gray-500">{count}q</p>
              </div>
            );
          })}
        </div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        onClick={onStart}
        className="btn-primary text-lg px-10 py-4 flex items-center gap-2 mx-auto"
      >
        <Clock size={20} />
        Start Test — {formatTime(test.duration)}
      </motion.button>
    </div>
  );
}

// ── Results Screen ────────────────────────────────────────────────────────────
function ResultsScreen({
  test, answers, lang, onRetake,
}: {
  test: MockTest;
  answers: Record<string, string | number>;
  lang: string;
  onRetake: () => void;
}) {
  let earned = 0;
  let total = 0;
  test.questions.forEach((q) => {
    total += q.points;
    const ua = answers[q.id];
    if (q.type === "multiple-choice" || q.type === "true-false") {
      if (ua === (q.answer as number) || ua === q.answer) earned += q.points;
    } else if (ua && String(ua).trim().length > 0) {
      earned += Math.round(q.points * 0.7);
    }
  });

  const score = percentage(earned, total);
  const passed = score >= test.passMark;

  const sectionBreakdown = sections.map((sec) => {
    const secQs = test.questions.filter((q) => q.section === sec);
    if (secQs.length === 0) return null;
    let secEarned = 0;
    let secTotal = 0;
    secQs.forEach((q) => {
      secTotal += q.points;
      const ua = answers[q.id];
      if (q.type === "multiple-choice" || q.type === "true-false") {
        if (ua === (q.answer as number) || ua === q.answer) secEarned += q.points;
      } else if (ua && String(ua).trim().length > 0) {
        secEarned += Math.round(q.points * 0.7);
      }
    });
    return { sec, secEarned, secTotal, pct: percentage(secEarned, secTotal) };
  }).filter(Boolean);

  // Listening questions for transcript review
  const listeningQs = test.questions.filter((q) => q.section === "listening");

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <Breadcrumbs
        items={[
          { label: "Mock Tests", href: "/mock-tests" },
          { label: "A1 Mock Tests", href: "/mock-tests/a1" },
          { label: `${test.title} Results` },
        ]}
      />

      {/* Score card */}
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card p-8 text-center space-y-5">
        <motion.div animate={{ rotate: [0, -10, 10, -5, 5, 0] }} transition={{ duration: 0.7, delay: 0.3 }} className="text-6xl">
          {passed ? "🏆" : "💪"}
        </motion.div>
        <div>
          <h2 className="text-2xl font-extrabold text-white">{passed ? (t.passMessage as any)?.[lang] ?? "Excellent!" : (t.failMessage as any)?.[lang] ?? "Keep practising!"}</h2>
          <p className="text-gray-400 mt-1">{test.title}</p>
        </div>
        <div className="flex items-center justify-center gap-6">
          <div className="text-center">
            <p className={cn("text-5xl font-extrabold", passed ? "text-green-400" : "text-orange-400")}>{score}%</p>
            <p className="text-xs text-gray-400 mt-1">Your Score</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{earned}/{total}</p>
            <p className="text-xs text-gray-400 mt-1">Points</p>
          </div>
          <div className="text-center">
            <p className={cn("text-2xl font-bold", passed ? "text-green-400" : "text-red-400")}>{passed ? "PASS" : "FAIL"}</p>
            <p className="text-xs text-gray-400 mt-1">Result</p>
          </div>
        </div>
        <div className="progress-bar h-3">
          <motion.div
            className={cn("h-3 rounded-full", passed ? "bg-gradient-to-r from-green-500 to-green-400" : "bg-gradient-to-r from-orange-600 to-orange-400")}
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
        <p className={cn("text-sm font-semibold", passed ? "text-green-400" : "text-orange-400")}>Pass mark: {test.passMark}%</p>
      </motion.div>

      {/* Section breakdown */}
      <div className="card p-5 space-y-4">
        <h3 className="font-bold text-white">Section Breakdown</h3>
        <div className="space-y-3">
          {sectionBreakdown.map((sb) => {
            if (!sb) return null;
            return (
              <div key={sb.sec}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className={cn("font-medium capitalize flex items-center gap-1.5", sectionColors[sb.sec as Section])}>
                    {sectionIcons[sb.sec as Section]} {sb.sec}
                  </span>
                  <span className="text-white font-semibold">{sb.pct}%</span>
                </div>
                <div className="progress-bar">
                  <motion.div className="progress-fill" initial={{ width: 0 }} animate={{ width: `${sb.pct}%` }} transition={{ duration: 0.8 }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Listening transcripts — revealed for learning */}
      {listeningQs.length > 0 && (
        <div className="card p-5 space-y-4">
          <h3 className="font-bold text-white flex items-center gap-2">
            <Headphones size={16} className="text-purple-400" />
            Listening Transcripts
            <span className="text-xs text-gray-500 font-normal">(hidden during the test)</span>
          </h3>
          {listeningQs.map((q, i) => {
            const audioText = extractAudioScript(q.context ?? "");
            const ua = answers[q.id];
            const correct = ua === q.answer;
            return (
              <div key={q.id} className="border-t border-gray-800 pt-3 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-purple-400">Q{i + 1}</span>
                  {ua !== undefined && (
                    correct
                      ? <CheckCircle size={13} className="text-green-400" />
                      : <XCircle size={13} className="text-red-400" />
                  )}
                </div>
                <div className="bg-purple-900/20 border border-purple-700/30 rounded-xl p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold text-purple-300 uppercase tracking-wide">Transcript</p>
                    <button onClick={() => speak(audioText, "de-DE")} className="ml-auto text-purple-400 hover:text-purple-300 transition-colors">
                      <Volume2 size={13} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-300">{audioText}</p>
                </div>
                <p className="text-xs text-gray-400">{q.question}</p>
                {q.explanation && <p className="text-xs text-gray-500 italic">{q.explanation}</p>}
              </div>
            );
          })}
        </div>
      )}

      {/* Writing + Speaking model answers */}
      {test.questions.filter((q) => q.type === "essay" || q.type === "fill-blank").length > 0 && (
        <div className="card p-5 space-y-4">
          <h3 className="font-bold text-white">Model Answers</h3>
          {test.questions.filter((q) => q.type === "essay" || q.type === "fill-blank").map((q) => (
            <div key={q.id} className="space-y-2 border-t border-gray-800 pt-3 first:border-0 first:pt-0">
              <p className="text-sm font-semibold text-gray-300">{q.question.slice(0, 80)}…</p>
              <div className="bg-green-900/20 border border-green-700/30 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-green-500 font-bold uppercase tracking-wide">Model Answer</p>
                  {q.section === "speaking" && (
                    <button onClick={() => speak(q.answer as string, "de-DE")} className="flex items-center gap-1 text-xs text-green-400 hover:text-green-300">
                      <Volume2 size={11} /> Listen
                    </button>
                  )}
                </div>
                <p className="text-sm text-green-300">{q.answer as string}</p>
              </div>
              {answers[q.id] && (
                <div className="bg-blue-900/20 border border-blue-700/30 rounded-xl p-3">
                  <p className="text-xs text-blue-500 font-bold uppercase tracking-wide mb-1">Your Answer</p>
                  <p className="text-sm text-blue-300">{String(answers[q.id])}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="grid gap-3 sm:grid-cols-3">
        <button onClick={onRetake} className="btn-secondary flex-1 flex items-center justify-center gap-2">
          <RotateCcw size={16} /> Retake
        </button>
        <Link href="/mock-tests/a1" className="btn-primary flex items-center justify-center gap-2">
          <ArrowLeft size={16} /> All Tests
        </Link>
        <Link href="/learn" className="btn-secondary flex items-center justify-center">
          A1 Syllabus
        </Link>
      </div>
    </div>
  );
}
