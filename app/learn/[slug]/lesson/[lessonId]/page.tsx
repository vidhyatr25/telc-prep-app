"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronRight, CheckCircle, Star, Volume2, Mic, Eye } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { useProgress } from "@/contexts/ProgressContext";
import { units, type Lesson, type VocabItem } from "@/data/curriculum";
import { t } from "@/data/translations";
import { cn } from "@/lib/utils";

const articleColors: Record<string, string> = {
  der: "bg-blue-600 text-white",
  die: "bg-red-600 text-white",
  das: "bg-green-600 text-white",
  "die (pl)": "bg-pink-600 text-white",
};

function speak(text: string, langCode = "de-DE", slow = false) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = langCode;
  utt.rate = slow ? 0.6 : 0.85;
  window.speechSynthesis.speak(utt);
}

function getSpeakingCheckpoint(lesson: Lesson) {
  const vocabPhrase = lesson.vocab?.[0]?.german;
  if (vocabPhrase) return vocabPhrase;

  const dialoguePhrase = lesson.dialogue?.[0]?.line;
  if (dialoguePhrase) return dialoguePhrase;

  const grammarPhrase = lesson.grammar?.flatMap((rule) => rule.examples)[0]?.german;
  if (grammarPhrase) return grammarPhrase;

  const germanLikeSentence = lesson.content
    .split(/[.!?]/)
    .map((part) => part.trim())
    .find((part) => /\b(ich|du|sie|Sie|wir|der|die|das|ein|eine|und|ist|bin|habe|kommen|wohnen)\b/i.test(part));

  return germanLikeSentence || lesson.title;
}

export default function LessonPage() {
  const params = useParams<{ slug: string; lessonId: string }>();
  const { slug, lessonId } = params;
  const { lang } = useLang();
  const { completeLesson, isLessonDone } = useProgress();
  const router = useRouter();
  const [showXP, setShowXP] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [speakingPassed, setSpeakingPassed] = useState(false);

  const unit = units.find((u) => u.slug === slug);
  const lessonIndex = unit?.lessons.findIndex((l) => l.id === lessonId) ?? -1;
  const lesson = unit?.lessons[lessonIndex];

  useEffect(() => {
    setShowXP(false);
    setCompleted(false);
    setSpeakingPassed(false);
  }, [slug, lessonId]);

  if (!unit || !lesson || lessonIndex === -1) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-400">Lesson not found.</p>
        <Link href={`/learn/${slug}`} className="btn-primary mt-4 inline-block">
          Back to Unit
        </Link>
      </div>
    );
  }

  const alreadyDone = isLessonDone(unit.id, lessonIndex);
  const nextLesson = unit.lessons[lessonIndex + 1];
  const speakingCheckpoint = getSpeakingCheckpoint(lesson);
  const needsSpeaking = Boolean(speakingCheckpoint) && !alreadyDone;
  const canComplete = alreadyDone || !needsSpeaking || speakingPassed;

  const handleComplete = () => {
    if (!canComplete) return;
    if (!alreadyDone) {
      completeLesson(unit.id, lessonIndex, lesson.xp);
    }
    setShowXP(true);
    setCompleted(true);
    setTimeout(() => setShowXP(false), 2000);
  };

  const handleNext = () => {
    if (nextLesson) {
      router.push(`/learn/${unit.slug}/lesson/${nextLesson.id}`);
    } else {
      router.push(`/learn/${unit.slug}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* XP popup */}
      <AnimatePresence>
        {showXP && !alreadyDone && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-yellow-400 text-gray-900 px-6 py-3 rounded-2xl font-extrabold text-lg flex items-center gap-2 shadow-2xl"
          >
            <Star size={20} className="fill-current" />
            +{lesson.xp} XP!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Link href="/learn" className="hover:text-white transition-colors">
          {t.learn[lang]}
        </Link>
        <ChevronRight size={14} />
        <Link href={`/learn/${unit.slug}`} className="hover:text-white transition-colors">
          {lang === "de" ? unit.titleDe : unit.title}
        </Link>
        <ChevronRight size={14} />
        <span className="text-white font-medium truncate">
          {lang === "de" ? lesson.titleDe : lesson.title}
        </span>
      </div>

      {/* Lesson header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-5 flex items-center gap-4"
      >
        <span className="text-3xl">{unit.icon}</span>
        <div className="flex-1">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium capitalize">
            {lesson.type} · ⭐ {lesson.xp} XP
          </p>
          <h1 className="text-xl font-extrabold text-white mt-0.5">
            {lang === "de" ? lesson.titleDe : lesson.title}
          </h1>
        </div>
        {alreadyDone && (
          <CheckCircle size={24} className="text-green-400 shrink-0" />
        )}
      </motion.div>

      {/* Content description */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="card p-4 text-gray-300 text-sm leading-relaxed"
      >
        {lang === "de" && lesson.contentDe ? lesson.contentDe : lesson.content}
      </motion.div>

      {/* Lesson content by type */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        {lesson.type === "vocab" && lesson.vocab && (
          <VocabContent vocab={lesson.vocab} lang={lang} />
        )}
        {lesson.type === "grammar" && lesson.grammar && (
          <GrammarContent grammar={lesson.grammar} lang={lang} />
        )}
        {lesson.type === "dialogue" && lesson.dialogue && (
          <DialogueContent dialogue={lesson.dialogue} lang={lang} />
        )}
        {lesson.type === "reading" && (
          <ReadingContent content={lang === "de" && lesson.contentDe ? lesson.contentDe : lesson.content} />
        )}
      </motion.div>

      {/* Complete button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        {!alreadyDone && speakingCheckpoint && (
          <CompletionSpeakingCheckpoint
            phrase={speakingCheckpoint}
            passed={speakingPassed}
            onPassed={() => setSpeakingPassed(true)}
          />
        )}

        {!completed ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleComplete}
            disabled={!canComplete}
            className={cn(
              "btn-primary w-full text-base flex items-center justify-center gap-2",
              !canComplete && "cursor-not-allowed opacity-50 hover:scale-100"
            )}
          >
            <CheckCircle size={18} />
            {alreadyDone ? "Already Completed — Continue" : canComplete ? "Mark Complete & Continue" : "Speak checkpoint to complete"}
            {!alreadyDone && <span className="ml-1 opacity-75">+{lesson.xp} XP</span>}
          </motion.button>
        ) : (
          <motion.button
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleNext}
            className="btn-primary w-full text-base flex items-center justify-center gap-2"
          >
            {nextLesson ? `Next: ${lang === "de" ? nextLesson.titleDe : nextLesson.title}` : "Back to Unit"}
            <ChevronRight size={18} />
          </motion.button>
        )}
        <Link
          href={`/learn/${unit.slug}`}
          className="block text-center text-sm text-gray-500 hover:text-gray-300 transition-colors py-2"
        >
          <ArrowLeft size={14} className="inline mr-1" />
          Back to {lang === "de" ? unit.titleDe : unit.title}
        </Link>
      </motion.div>
    </div>
  );
}

// ── Vocab grid ────────────────────────────────────────────────────────────────
type VocabPracticeMode = "learn" | "recall" | "speak";

function getVocabOptions(vocab: VocabItem[], active: number) {
  const indexes = [active];
  let offset = 1;
  while (indexes.length < Math.min(4, vocab.length) && offset < vocab.length + 4) {
    const next = (active + offset * 2 + 1) % vocab.length;
    if (!indexes.includes(next)) indexes.push(next);
    offset += 1;
  }
  return indexes.map((index) => vocab[index].german).sort((a, b) => a.localeCompare(b));
}

function VocabContent({ vocab, lang }: { vocab: VocabItem[]; lang: string }) {
  const [flipped, setFlipped] = useState<Set<number>>(new Set());
  const [active, setActive] = useState(0);
  const [mode, setMode] = useState<VocabPracticeMode>("learn");

  const toggleFlip = (i: number) => {
    setFlipped((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <VocabCoach
        vocab={vocab}
        active={active}
        lang={lang}
        mode={mode}
        setActive={setActive}
        setMode={setMode}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {vocab.map((item, i) => {
          const isFlipped = flipped.has(i);
          return (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setActive(i);
                toggleFlip(i);
              }}
              className={cn(
                "card p-4 cursor-pointer select-none min-h-[110px] flex flex-col items-center justify-center gap-1.5 text-center hover:border-gray-600 transition-all relative group",
                active === i && "border-yellow-400/40 bg-yellow-400/5"
              )}
            >
              {/* Speak button — top-right, click without flipping */}
              <button
                onClick={(e) => { e.stopPropagation(); speak(item.german); }}
                className="absolute top-2 right-2 text-gray-700 hover:text-yellow-400 transition-colors opacity-0 group-hover:opacity-100"
                title="Listen to pronunciation"
              >
                <Volume2 size={14} />
              </button>

              {!isFlipped ? (
                <>
                  {item.article && (
                    <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full", articleColors[item.article] ?? "bg-gray-700 text-gray-300")}>
                      {item.article}
                    </span>
                  )}
                  <p className="font-bold text-white text-sm leading-tight">{item.german}</p>
                  {item.example && (
                    <p className="text-xs text-gray-500 italic leading-tight line-clamp-2">{item.example}</p>
                  )}
                  {/* Hover-to-peek: English fades in on hover */}
                  <p className="text-xs font-semibold text-yellow-400 opacity-0 group-hover:opacity-75 transition-opacity duration-200 mt-auto">
                    {item.english}
                  </p>
                  <p className="text-xs text-gray-600 absolute bottom-2 left-0 right-0 text-center group-hover:opacity-0 transition-opacity">
                    Tap to flip
                  </p>
                </>
              ) : (
                <>
                  <p className="font-bold text-yellow-400 text-sm leading-tight">{item.english}</p>
                  {item.exampleEn && (
                    <p className="text-xs text-gray-400 italic leading-tight">{item.exampleEn}</p>
                  )}
                  <p className="text-xs text-gray-600 mt-auto">Tap for German</p>
                </>
              )}
            </motion.div>
          );
        })}
      </div>

    </div>
  );
}

// ── Pronunciation Practice ────────────────────────────────────────────────────
function VocabCoach({
  vocab,
  active,
  lang,
  mode,
  setActive,
  setMode,
}: {
  vocab: VocabItem[];
  active: number;
  lang: string;
  mode: VocabPracticeMode;
  setActive: (index: number) => void;
  setMode: (mode: VocabPracticeMode) => void;
}) {
  const item = vocab[active];
  const [meaningFor, setMeaningFor] = useState<number | null>(null);
  const [choice, setChoice] = useState<{ active: number; answer: string } | null>(null);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [speakFeedback, setSpeakFeedback] = useState<"good" | "close" | "try" | "error" | null>(null);
  const showMeaning = meaningFor === active;
  const selected = choice?.active === active ? choice.answer : null;
  const options = getVocabOptions(vocab, active);
  const hasSpeechRecognition =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const resetSpeak = () => {
    setTranscript("");
    setScore(null);
    setSpeakFeedback(null);
  };

  const go = (direction: number) => {
    const next = (active + direction + vocab.length) % vocab.length;
    setActive(next);
    setMeaningFor(null);
    setChoice(null);
    resetSpeak();
  };

  const startSpeaking = () => {
    const speechWindow = window as SpeechRecognitionWindow;
    const SR = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
    if (!SR) {
      setSpeakFeedback("error");
      return;
    }

    const rec = new SR();
    rec.lang = "de-DE";
    rec.interimResults = false;
    rec.maxAlternatives = 5;
    setListening(true);
    resetSpeak();

    rec.onresult = (event) => {
      const alternatives = Array.from(event.results[0] ?? [])
        .map((result) => result.transcript)
        .filter(Boolean);
      const bestScore = alternatives.reduce(
        (best, said) => Math.max(best, getPronunciationScore(said, item.german)),
        0
      );
      setTranscript(alternatives[0] ?? "");
      setScore(Math.round(bestScore * 100));
      setSpeakFeedback(bestScore >= 0.78 ? "good" : bestScore >= 0.55 ? "close" : "try");
      setListening(false);
    };
    rec.onerror = () => {
      setSpeakFeedback("error");
      setListening(false);
    };
    rec.onend = () => setListening(false);
    rec.start();
  };

  return (
    <section className="card overflow-hidden border-yellow-400/20">
      <div className="border-b border-gray-800 bg-gray-950/60 p-3">
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: "learn" as const, label: "Learn" },
            { id: "recall" as const, label: "Recall" },
            { id: "speak" as const, label: "Speak" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setMode(tab.id);
                setChoice(null);
                resetSpeak();
              }}
              className={cn(
                "rounded-xl border px-3 py-2 text-sm font-bold transition-colors",
                mode === tab.id
                  ? "border-yellow-400/30 bg-yellow-400/10 text-yellow-300"
                  : "border-gray-800 bg-gray-900 text-gray-400 hover:border-gray-700 hover:text-white"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 md:p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-extrabold uppercase text-yellow-400">
              {lang === "de" ? "Deutsch" : "German"} phrase {active + 1}/{vocab.length}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {item.article && (
                <span className={cn("rounded-md px-2 py-1 text-xs font-bold", articleColors[item.article] ?? "bg-gray-700 text-gray-300")}>
                  {item.article}
                </span>
              )}
              <h3 className="text-2xl font-extrabold text-white">{item.german}</h3>
            </div>
            {(showMeaning || mode !== "learn") && (
              <p className="mt-2 text-base font-semibold text-yellow-300">{item.english}</p>
            )}
            {item.example && (
              <p className="mt-3 rounded-xl border border-gray-800 bg-gray-950 px-3 py-2 text-sm text-gray-300">
                {item.example}
              </p>
            )}
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <button
              onClick={() => speak(item.german, "de-DE", true)}
              className="rounded-xl border border-blue-400/20 bg-blue-400/10 px-3 py-2 text-sm font-bold text-blue-300 hover:bg-blue-400/20"
            >
              Slow
            </button>
            <button
              onClick={() => speak(item.german)}
              className="rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-sm font-bold text-gray-300 hover:border-gray-600"
            >
              Normal
            </button>
            <button
              onClick={() => setMeaningFor(showMeaning ? null : active)}
              className="rounded-xl border border-yellow-400/20 bg-yellow-400/10 px-3 py-2 text-sm font-bold text-yellow-300 hover:bg-yellow-400/20"
            >
              Meaning
            </button>
          </div>
        </div>

        {mode === "recall" && (
          <div className="mt-5 rounded-2xl border border-gray-800 bg-gray-950 p-4">
            <p className="text-sm font-bold text-white">Choose the German phrase for: {item.english}</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {options.map((option) => {
                const isSelected = selected === option;
                const isCorrect = option === item.german;
                return (
                  <button
                    key={option}
                    onClick={() => setChoice({ active, answer: option })}
                    className={cn(
                      "min-h-12 rounded-xl border px-3 py-2 text-left text-sm font-semibold transition-colors",
                      isSelected && isCorrect
                        ? "border-green-400/30 bg-green-400/10 text-green-300"
                        : isSelected
                        ? "border-red-400/30 bg-red-400/10 text-red-300"
                        : "border-gray-800 bg-gray-900 text-gray-300 hover:border-gray-700"
                    )}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {mode === "speak" && (
          <div className="mt-5 rounded-2xl border border-green-400/20 bg-green-400/10 p-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={startSpeaking}
                disabled={listening || !hasSpeechRecognition}
                className={cn(
                  "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-60",
                  listening
                    ? "border border-red-400/30 bg-red-400/10 text-red-300"
                    : "border border-green-400/30 bg-gray-950 text-green-300 hover:bg-green-400/10"
                )}
              >
                <Mic size={16} />
                {listening ? "Listening..." : "Speak phrase"}
              </button>
              {!hasSpeechRecognition && (
                <span className="self-center text-xs font-semibold text-red-300">
                  Speech practice works best in Chrome or Edge.
                </span>
              )}
            </div>

            {speakFeedback && (
              <div
                className={cn(
                  "mt-3 rounded-xl border px-3 py-2 text-sm font-semibold",
                  speakFeedback === "good"
                    ? "border-green-400/30 bg-green-400/10 text-green-300"
                    : speakFeedback === "close"
                    ? "border-yellow-400/30 bg-yellow-400/10 text-yellow-300"
                    : speakFeedback === "error"
                    ? "border-red-400/30 bg-red-400/10 text-red-300"
                    : "border-orange-400/30 bg-orange-400/10 text-orange-300"
                )}
              >
                {speakFeedback === "good"
                  ? "Good speaking match."
                  : speakFeedback === "close"
                  ? "Close. Repeat once more with slow audio."
                  : speakFeedback === "error"
                  ? "Mic was blocked or no speech was captured."
                  : "Try again slowly. Aim for the main words first."}
                {transcript && (
                  <span className="block pt-1 text-xs opacity-80">
                    Heard: {transcript}
                    {score !== null && ` - Practice match ${score}%`}
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            onClick={() => go(-1)}
            className="rounded-xl border border-gray-800 bg-gray-950 px-4 py-2 text-sm font-bold text-gray-400 hover:border-gray-700 hover:text-white"
          >
            Previous
          </button>
          <div className="flex flex-wrap justify-center gap-1">
            {vocab.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setActive(index);
                  setChoice(null);
                  resetSpeak();
                }}
                className={cn("h-2.5 w-2.5 rounded-full transition-all", index === active ? "bg-yellow-400 scale-125" : "bg-gray-700 hover:bg-gray-500")}
                aria-label={`Phrase ${index + 1}`}
              />
            ))}
          </div>
          <button
            onClick={() => go(1)}
            className="rounded-xl border border-gray-800 bg-gray-950 px-4 py-2 text-sm font-bold text-gray-400 hover:border-gray-700 hover:text-white"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}

function normalizeSpeechText(value: string) {
  return value
    .toLowerCase()
    .replace(/\u00e4/g, "ae")
    .replace(/\u00f6/g, "oe")
    .replace(/\u00fc/g, "ue")
    .replace(/\u00df/g, "ss")
    .replace(/[^a-z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshteinDistance(a: string, b: string) {
  const previous = Array.from({ length: b.length + 1 }, (_, index) => index);

  for (let i = 0; i < a.length; i++) {
    const current = [i + 1];
    for (let j = 0; j < b.length; j++) {
      const cost = a[i] === b[j] ? 0 : 1;
      current[j + 1] = Math.min(
        current[j] + 1,
        previous[j + 1] + 1,
        previous[j] + cost
      );
    }
    previous.splice(0, previous.length, ...current);
  }

  return previous[b.length];
}

function isPronunciationMatch(spoken: string, expected: string) {
  return getPronunciationScore(spoken, expected) >= 0.68;
}

function getPronunciationScore(spoken: string, expected: string) {
  const said = normalizeSpeechText(spoken);
  const target = normalizeSpeechText(expected);
  if (!said || !target) return 0;
  if (said === target || said.includes(target) || target.includes(said)) return 1;

  const compactSaid = said.replace(/\s/g, "");
  const compactTarget = target.replace(/\s/g, "");
  if (compactSaid === compactTarget) return 1;

  const distance = levenshteinDistance(compactSaid, compactTarget);
  const longest = Math.max(compactSaid.length, compactTarget.length);
  if (longest === 0) return 0;

  const charScore = Math.max(0, 1 - distance / longest);
  const saidTokens = new Set(said.split(" ").filter(Boolean));
  const targetTokens = target.split(" ").filter(Boolean);
  const matchedTokens = targetTokens.filter((token) => {
    if (saidTokens.has(token)) return true;
    return Array.from(saidTokens).some((saidToken) => {
      const tokenDistance = levenshteinDistance(saidToken, token);
      return 1 - tokenDistance / Math.max(saidToken.length, token.length) >= 0.72;
    });
  });
  const wordScore = targetTokens.length ? matchedTokens.length / targetTokens.length : 0;

  return Math.max(charScore, wordScore);
}

type SpeechAlternative = { transcript: string };
type SpeechRecognitionResult = {
  length: number;
  [index: number]: SpeechAlternative;
};
type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: { results: { [index: number]: SpeechRecognitionResult } }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
};
type SpeechRecognitionWindow = Window & {
  SpeechRecognition?: new () => SpeechRecognitionLike;
  webkitSpeechRecognition?: new () => SpeechRecognitionLike;
};

function CompletionSpeakingCheckpoint({
  phrase,
  passed,
  onPassed,
}: {
  phrase: string;
  passed: boolean;
  onPassed: () => void;
}) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<"pass" | "close" | "try" | "error" | null>(passed ? "pass" : null);
  const hasSpeechRecognition =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const startCheckpoint = () => {
    const speechWindow = window as SpeechRecognitionWindow;
    const SR = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
    if (!SR) {
      setFeedback("error");
      return;
    }

    const rec = new SR();
    rec.lang = "de-DE";
    rec.interimResults = false;
    rec.maxAlternatives = 5;
    setListening(true);
    setTranscript("");
    setScore(null);
    setFeedback(null);

    rec.onresult = (event) => {
      const alternatives = Array.from(event.results[0] ?? [])
        .map((result) => result.transcript)
        .filter(Boolean);
      const bestScore = alternatives.reduce(
        (best, said) => Math.max(best, getPronunciationScore(said, phrase)),
        0
      );
      const percent = Math.round(bestScore * 100);
      setTranscript(alternatives[0] ?? "");
      setScore(percent);
      setListening(false);

      if (bestScore >= 0.55) {
        setFeedback(bestScore >= 0.78 ? "pass" : "close");
        onPassed();
      } else {
        setFeedback("try");
      }
    };
    rec.onerror = () => {
      setListening(false);
      setFeedback("error");
    };
    rec.onend = () => setListening(false);
    rec.start();
  };

  return (
    <section
      className={cn(
        "rounded-2xl border p-4",
        passed ? "border-green-400/30 bg-green-400/10" : "border-yellow-400/25 bg-yellow-400/10"
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className={cn("text-xs font-extrabold uppercase", passed ? "text-green-300" : "text-yellow-300")}>
            Required speaking checkpoint
          </p>
          <p className="mt-1 text-sm text-gray-300">
            Speak this once to unlock lesson completion.
          </p>
          <p className="mt-2 rounded-xl border border-gray-800 bg-gray-950 px-3 py-2 text-base font-extrabold text-white">
            {phrase}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            onClick={() => speak(phrase, "de-DE", true)}
            className="rounded-xl border border-blue-400/20 bg-blue-400/10 px-3 py-2 text-sm font-bold text-blue-300 hover:bg-blue-400/20"
          >
            Listen slow
          </button>
          <button
            onClick={startCheckpoint}
            disabled={listening || passed || !hasSpeechRecognition}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-60",
              passed
                ? "border border-green-400/30 bg-green-400/10 text-green-300"
                : listening
                ? "border border-red-400/30 bg-red-400/10 text-red-300"
                : "border border-yellow-400/30 bg-gray-950 text-yellow-300 hover:bg-yellow-400/10"
            )}
          >
            <Mic size={16} />
            {passed ? "Speaking done" : listening ? "Listening..." : "Speak now"}
          </button>
        </div>
      </div>

      {!hasSpeechRecognition && (
        <p className="mt-3 text-xs font-semibold text-red-300">
          Speech completion works best in Chrome or Edge. Please use one of those browsers for speaking lessons.
        </p>
      )}

      {feedback && (
        <div
          className={cn(
            "mt-3 rounded-xl border px-3 py-2 text-sm font-semibold",
            feedback === "pass"
              ? "border-green-400/30 bg-green-400/10 text-green-300"
              : feedback === "close"
              ? "border-yellow-400/30 bg-yellow-400/10 text-yellow-300"
              : feedback === "error"
              ? "border-red-400/30 bg-red-400/10 text-red-300"
              : "border-orange-400/30 bg-orange-400/10 text-orange-300"
          )}
        >
          {feedback === "pass"
            ? "Good. Lesson completion is unlocked."
            : feedback === "close"
            ? "Close enough for this lesson. Completion is unlocked."
            : feedback === "error"
            ? "Mic was blocked or no speech was captured."
            : "Try again slowly. Listen once, then repeat clearly."}
          {transcript && (
            <span className="block pt-1 text-xs opacity-80">
              Heard: {transcript}
              {score !== null && ` - Match ${score}%`}
            </span>
          )}
        </div>
      )}
    </section>
  );
}

function PronunciationPractice({ vocab }: { vocab: VocabItem[] }) {
  const [current, setCurrent] = useState(0);
  const [listening, setListening] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "close" | "wrong" | "error" | null>(null);
  const [heardTranscript, setHeardTranscript] = useState("");
  const [pronunciationScore, setPronunciationScore] = useState<number | null>(null);

  const item = vocab[current];
  const hasSpeechRecognition =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const handleRecord = () => {
    if (!hasSpeechRecognition) return;
    const speechWindow = window as SpeechRecognitionWindow;
    const SR = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = "de-DE";
    rec.interimResults = false;
    rec.maxAlternatives = 5;
    setListening(true);
    setFeedback(null);
    setHeardTranscript("");
    setPronunciationScore(null);

    rec.onresult = (e) => {
      const alternatives = Array.from(e.results[0] ?? [])
        .map((result) => result.transcript)
        .filter(Boolean);
      const bestScore = alternatives.reduce(
        (best, said) => Math.max(best, getPronunciationScore(said, item.german)),
        0
      );
      setHeardTranscript(alternatives[0] ?? "");
      setPronunciationScore(Math.round(bestScore * 100));
      setFeedback(bestScore >= 0.82 ? "correct" : bestScore >= 0.68 ? "close" : "wrong");
      setListening(false);
    };
    rec.onerror = () => { setHeardTranscript(""); setPronunciationScore(null); setFeedback("error"); setListening(false); };
    rec.onend = () => setListening(false);
    rec.start();
  };

  const go = (dir: number) => {
    setCurrent((c) => (c + dir + vocab.length) % vocab.length);
    setFeedback(null);
    setHeardTranscript("");
    setPronunciationScore(null);
  };

  return (
    <div className="card p-5 space-y-4 border-yellow-400/20">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-white flex items-center gap-2 text-sm">
          <Volume2 size={15} className="text-yellow-400" />
          Pronunciation Practice
        </h3>
        <span className="text-xs text-gray-500">{current + 1} / {vocab.length}</span>
      </div>

      {/* Word display */}
      <div className="bg-gray-800 rounded-xl p-6 text-center space-y-2">
        {item.article && (
          <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full inline-block mb-1", articleColors[item.article] ?? "bg-gray-700 text-gray-300")}>
            {item.article}
          </span>
        )}
        <p className="text-3xl font-extrabold text-white">{item.german}</p>
        <p className="text-gray-400 text-sm">{item.english}</p>
        {item.example && (
          <p className="text-xs text-gray-500 italic">"{item.example}"</p>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 justify-center flex-wrap">
        <button
          onClick={() => speak(item.german, "de-DE", true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600/20 border border-blue-600/30 text-blue-300 hover:bg-blue-600/30 transition-colors text-sm font-semibold"
        >
          <Volume2 size={15} />
          Slow
        </button>
        <button
          onClick={() => speak(item.german)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800 border border-gray-700 text-gray-300 hover:border-gray-500 transition-colors text-sm font-semibold"
        >
          <Volume2 size={15} />
          Normal
        </button>
        {hasSpeechRecognition ? (
          <button
            onClick={handleRecord}
            disabled={listening}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all",
              listening
                ? "bg-red-600/30 border border-red-600/40 text-red-300 animate-pulse"
                : "bg-green-600/20 border border-green-600/30 text-green-300 hover:bg-green-600/30"
            )}
          >
            <Mic size={15} />
            {listening ? "Listening…" : "Say it!"}
          </button>
        ) : (
          <span className="text-xs text-gray-600 self-center">
            (mic not available in this browser)
          </span>
        )}
      </div>

      {/* Feedback */}
      <AnimatePresence mode="wait">
        {feedback && (
          <motion.div
            key={feedback}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={cn(
              "rounded-xl p-3 text-sm font-semibold text-center",
              feedback === "correct"
                ? "bg-green-900/30 text-green-400 border border-green-700/30"
                : feedback === "close"
                ? "bg-yellow-900/30 text-yellow-300 border border-yellow-700/30"
                : feedback === "error"
                ? "bg-red-900/30 text-red-300 border border-red-700/30"
                : "bg-orange-900/30 text-orange-400 border border-orange-700/30"
            )}
          >
            {feedback === "correct"
              ? "Great pronunciation."
              : feedback === "close"
              ? "Close enough for A1. Listen once more and repeat."
              : feedback === "error"
              ? "Mic was blocked or no speech was captured. Allow microphone access and try again."
              : "Not quite yet. Use Slow, then repeat the word in one clear breath."}
          </motion.div>
        )}
      </AnimatePresence>

      {heardTranscript && (
        <p className="text-center text-xs font-medium text-gray-500">
          Heard: {heardTranscript}
          {pronunciationScore !== null && ` - Match ${pronunciationScore}%`}
        </p>
      )}

      {/* Navigation */}
      <div className="flex items-center gap-3">
        <button onClick={() => go(-1)} className="flex-1 py-2 rounded-xl text-xs text-gray-500 hover:text-gray-300 border border-gray-800 hover:border-gray-700 transition-all">
          ← Prev
        </button>
        <div className="flex gap-1 flex-wrap justify-center">
          {vocab.map((_, i) => (
            <button
              key={i}
              onClick={() => { setCurrent(i); setFeedback(null); setHeardTranscript(""); setPronunciationScore(null); }}
              className={cn("w-2 h-2 rounded-full transition-all", i === current ? "bg-yellow-400 scale-125" : "bg-gray-700 hover:bg-gray-500")}
            />
          ))}
        </div>
        <button onClick={() => go(1)} className="flex-1 py-2 rounded-xl text-xs text-gray-500 hover:text-gray-300 border border-gray-800 hover:border-gray-700 transition-all">
          Next →
        </button>
      </div>
    </div>
  );
}

// ── Grammar accordion ─────────────────────────────────────────────────────────
function GrammarContent({
  grammar,
  lang,
}: {
  grammar: NonNullable<Lesson["grammar"]>;
  lang: string;
}) {
  const [open, setOpen] = useState<Set<number>>(new Set([0]));

  const toggle = (i: number) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <div className="space-y-3">
      {grammar.map((rule, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className="card overflow-hidden"
        >
          <button
            onClick={() => toggle(i)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-800/50 transition-colors"
          >
            <span className="font-bold text-white">{rule.title}</span>
            <ChevronRight
              size={18}
              className={cn("text-gray-500 transition-transform shrink-0", open.has(i) && "rotate-90")}
            />
          </button>
          <AnimatePresence>
            {open.has(i) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 space-y-3">
                  <p className="text-sm text-gray-400">{rule.explanation}</p>
                  <div className="rounded-xl overflow-hidden border border-gray-700">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-800 text-gray-400 text-xs uppercase">
                          <th className="p-2.5 text-left font-semibold">Deutsch</th>
                          <th className="p-2.5 text-left font-semibold">English</th>
                          <th className="p-2.5 w-8"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {rule.examples.map((ex, j) => (
                          <tr
                            key={j}
                            className={cn("border-t border-gray-800", j % 2 === 0 ? "bg-gray-900" : "bg-gray-900/50")}
                          >
                            <td className="p-2.5 font-medium text-white">{ex.german}</td>
                            <td className="p-2.5 text-gray-300">{ex.english}</td>
                            <td className="p-2.5">
                              <button
                                onClick={() => speak(ex.german)}
                                className="text-gray-600 hover:text-yellow-400 transition-colors"
                                title="Listen"
                              >
                                <Volume2 size={13} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}

// ── Dialogue bubbles ──────────────────────────────────────────────────────────
function DialogueContent({
  dialogue,
  lang,
}: {
  dialogue: NonNullable<Lesson["dialogue"]>;
  lang: string;
}) {
  const [showHint, setShowHint] = useState<Set<number>>(new Set());
  const [roleSpeaker, setRoleSpeaker] = useState(dialogue[0]?.speaker ?? "");
  const [roleLineIndex, setRoleLineIndex] = useState(0);
  const [roleListening, setRoleListening] = useState(false);
  const [roleTranscript, setRoleTranscript] = useState("");
  const [roleScore, setRoleScore] = useState<number | null>(null);
  const [roleFeedback, setRoleFeedback] = useState<"good" | "close" | "try" | "error" | null>(null);

  const speakers = Array.from(new Set(dialogue.map((d) => d.speaker)));
  const speakerIndex: Record<string, number> = {};
  speakers.forEach((s, i) => { speakerIndex[s] = i; });
  const roleTurns = dialogue
    .map((line, index) => ({ line, index }))
    .filter((turn) => turn.line.speaker === roleSpeaker);
  const activeRoleTurn = roleTurns[Math.min(roleLineIndex, Math.max(roleTurns.length - 1, 0))];
  const previousCue = activeRoleTurn
    ? dialogue
        .slice(0, activeRoleTurn.index)
        .reverse()
        .find((line) => line.speaker !== roleSpeaker)
    : null;

  const bubbleColors = [
    "bg-blue-600/20 border-blue-600/30",
    "bg-purple-600/20 border-purple-600/30",
    "bg-green-600/20 border-green-600/30",
    "bg-orange-600/20 border-orange-600/30",
  ];
  const nameColors = ["text-blue-400", "text-purple-400", "text-green-400", "text-orange-400"];

  const playAll = () => {
    let delay = 0;
    dialogue.forEach((line) => {
      setTimeout(() => speak(line.line), delay);
      delay += line.line.split(" ").length * 500 + 600;
    });
  };

  const clearRoleResult = () => {
    setRoleTranscript("");
    setRoleScore(null);
    setRoleFeedback(null);
  };

  const handleRoleRecord = () => {
    if (!activeRoleTurn) return;
    const speechWindow = window as SpeechRecognitionWindow;
    const SR = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
    if (!SR) {
      setRoleFeedback("error");
      return;
    }
    const rec = new SR();
    rec.lang = "de-DE";
    rec.interimResults = false;
    rec.maxAlternatives = 5;
    setRoleListening(true);
    clearRoleResult();

    rec.onresult = (event) => {
      const alternatives = Array.from(event.results[0] ?? [])
        .map((result) => result.transcript)
        .filter(Boolean);
      const bestScore = alternatives.reduce(
        (best, said) => Math.max(best, getPronunciationScore(said, activeRoleTurn.line.line)),
        0
      );
      setRoleTranscript(alternatives[0] ?? "");
      setRoleScore(Math.round(bestScore * 100));
      setRoleFeedback(bestScore >= 0.78 ? "good" : bestScore >= 0.55 ? "close" : "try");
      setRoleListening(false);
    };
    rec.onerror = () => {
      setRoleFeedback("error");
      setRoleListening(false);
    };
    rec.onend = () => setRoleListening(false);
    rec.start();
  };

  const nextRoleLine = () => {
    setRoleLineIndex((current) => Math.min(current + 1, Math.max(roleTurns.length - 1, 0)));
    clearRoleResult();
  };

  return (
    <div className="space-y-4">
      {/* Play full dialogue */}
      <button
        onClick={playAll}
        className="w-full flex items-center justify-center gap-2 py-2.5 text-sm text-gray-400 hover:text-yellow-400 border border-dashed border-gray-700 hover:border-yellow-400/40 rounded-xl transition-all"
      >
        <Volume2 size={14} />
        Play full dialogue
      </button>

      {dialogue.map((line, i) => {
        const idx = speakerIndex[line.speaker];
        const isRight = idx % 2 === 1;
        const hintOn = showHint.has(i);
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: isRight ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            className={cn("flex", isRight && "justify-end")}
          >
            <div className={cn("max-w-[80%]", isRight && "text-right")}>
              <p className={cn("text-xs font-bold mb-1", nameColors[idx % nameColors.length])}>
                {line.speaker}
              </p>
              <div
                className={cn(
                  "rounded-2xl border p-3",
                  bubbleColors[idx % bubbleColors.length],
                  isRight ? "rounded-tr-sm" : "rounded-tl-sm"
                )}
              >
                <p className="text-white text-sm">{line.line}</p>
                {lang === "de" && line.lineDe && (
                  <p className="text-gray-400 text-xs mt-1 italic">{line.lineDe}</p>
                )}
                {/* Vocabulary hint panel */}
                <AnimatePresence>
                  {hintOn && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="text-yellow-300/70 text-xs mt-2 pt-2 border-t border-white/10 italic">
                        Meaning: {line.english ?? "English meaning will be added soon."}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {/* Per-line controls */}
              <div className={cn("flex gap-2 mt-1", isRight ? "justify-end" : "justify-start")}>
                <button
                  onClick={() => speak(line.line)}
                  className="text-gray-600 hover:text-blue-400 transition-colors"
                  title="Listen"
                >
                  <Volume2 size={13} />
                </button>
                <button
                  onClick={() =>
                    setShowHint((prev) => {
                      const next = new Set(prev);
                      if (next.has(i)) next.delete(i);
                      else next.add(i);
                      return next;
                    })
                  }
                  className={cn("transition-colors", hintOn ? "text-yellow-400" : "text-gray-600 hover:text-yellow-400")}
                  title="Show English meaning"
                >
                  <Eye size={13} />
                </button>
              </div>
            </div>
          </motion.div>
        );
      })}

      <div className="card border-green-400/20 p-4 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase text-green-300">Role-play speaking</p>
            <h3 className="font-extrabold text-white">Choose your role and answer out loud</h3>
            <p className="mt-1 text-xs text-gray-500">
              Listen to the cue, say your line, then check the practice match.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {speakers.map((speaker) => (
              <button
                key={speaker}
                onClick={() => {
                  setRoleSpeaker(speaker);
                  setRoleLineIndex(0);
                  clearRoleResult();
                }}
                className={cn(
                  "rounded-xl border px-3 py-2 text-sm font-bold transition-colors",
                  roleSpeaker === speaker
                    ? "border-green-400/30 bg-green-400/10 text-green-300"
                    : "border-gray-800 bg-gray-950 text-gray-400 hover:border-gray-700 hover:text-white"
                )}
              >
                {speaker}
              </button>
            ))}
          </div>
        </div>

        {activeRoleTurn && (
          <div className="rounded-2xl border border-gray-800 bg-gray-950 p-4 space-y-3">
            {previousCue && (
              <div className="rounded-xl border border-blue-400/20 bg-blue-400/10 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase text-blue-300">Cue from {previousCue.speaker}</p>
                    <p className="mt-1 text-sm text-white">{previousCue.line}</p>
                    {previousCue.english && <p className="mt-1 text-xs text-gray-400">{previousCue.english}</p>}
                  </div>
                  <button
                    onClick={() => speak(previousCue.line)}
                    className="shrink-0 rounded-lg border border-blue-400/20 p-2 text-blue-300 hover:bg-blue-400/10"
                    title="Play cue"
                  >
                    <Volume2 size={16} />
                  </button>
                </div>
              </div>
            )}

            <div>
              <p className="text-xs font-bold uppercase text-yellow-400">
                Your turn {roleLineIndex + 1}/{roleTurns.length} - {roleSpeaker}
              </p>
              <p className="mt-1 text-lg font-extrabold text-white">{activeRoleTurn.line.line}</p>
              {activeRoleTurn.line.english && (
                <p className="mt-1 text-sm text-gray-400">{activeRoleTurn.line.english}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => speak(activeRoleTurn.line.line, "de-DE", true)}
                className="rounded-xl border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-sm font-bold text-blue-300 hover:bg-blue-400/20"
              >
                Listen slow
              </button>
              <button
                onClick={handleRoleRecord}
                disabled={roleListening}
                className={cn(
                  "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-colors disabled:opacity-70",
                  roleListening
                    ? "border border-red-400/30 bg-red-400/10 text-red-300"
                    : "border border-green-400/30 bg-green-400/10 text-green-300 hover:bg-green-400/20"
                )}
              >
                <Mic size={16} />
                {roleListening ? "Listening..." : "Speak my line"}
              </button>
              <button
                onClick={nextRoleLine}
                disabled={roleLineIndex >= roleTurns.length - 1}
                className="rounded-xl border border-gray-800 bg-gray-900 px-4 py-2 text-sm font-bold text-gray-300 hover:border-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next line
              </button>
            </div>

            {roleFeedback && (
              <div
                className={cn(
                  "rounded-xl border px-3 py-2 text-sm font-semibold",
                  roleFeedback === "good"
                    ? "border-green-400/30 bg-green-400/10 text-green-300"
                    : roleFeedback === "close"
                    ? "border-yellow-400/30 bg-yellow-400/10 text-yellow-300"
                    : roleFeedback === "error"
                    ? "border-red-400/30 bg-red-400/10 text-red-300"
                    : "border-orange-400/30 bg-orange-400/10 text-orange-300"
                )}
              >
                {roleFeedback === "good"
                  ? "Good speaking match."
                  : roleFeedback === "close"
                  ? "Close. Repeat once more with the slow audio."
                  : roleFeedback === "error"
                  ? "Mic was blocked or no speech was captured."
                  : "Try again slowly. Focus on the main words first."}
                {roleTranscript && (
                  <span className="block pt-1 text-xs opacity-80">
                    Heard: {roleTranscript}
                    {roleScore !== null && ` - Practice match ${roleScore}%`}
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Reading passage ───────────────────────────────────────────────────────────
function ReadingContent({ content }: { content: string }) {
  return (
    <div className="card p-6 space-y-3">
      <button
        onClick={() => speak(content)}
        className="flex items-center gap-2 text-xs text-gray-500 hover:text-yellow-400 transition-colors"
      >
        <Volume2 size={13} />
        Listen to passage
      </button>
      <div className="border-l-4 border-yellow-400 pl-4">
        <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
}
