"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, RotateCcw, Star, Trophy, Zap } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { useProgress } from "@/contexts/ProgressContext";
import { getAllVocab, type VocabItem } from "@/data/curriculum";
import { t, type Lang } from "@/data/translations";
import { cn, shuffle } from "@/lib/utils";
import { Breadcrumbs } from "@/components/Breadcrumbs";

type Game = "flashcards" | "memory" | "wordmatch" | null;

type GamesPageProps = {
  levelLabel?: string;
  levelHref?: string;
  getVocab?: () => VocabItem[];
};

export default function GamesPage({
  levelLabel = "A1",
  levelHref = "/games/a1",
  getVocab = getAllVocab,
}: GamesPageProps) {
  const { lang } = useLang();
  const [activeGame, setActiveGame] = useState<Game>(null);

  const games = [
    {
      id: "flashcards" as Game,
      icon: "🃏",
      title: t.flashcards[lang],
      desc: t.flashcardsDesc[lang],
      gradient: "from-blue-600 to-blue-800",
      xp: "2 XP per correct",
    },
    {
      id: "memory" as Game,
      icon: "🧠",
      title: t.memoryGame[lang],
      desc: t.memoryDesc[lang],
      gradient: "from-purple-600 to-purple-800",
      xp: "5 XP per match",
    },
    {
      id: "wordmatch" as Game,
      icon: "🔗",
      title: t.wordMatch[lang],
      desc: t.wordMatchDesc[lang],
      gradient: "from-green-600 to-emerald-800",
      xp: "3 XP per match",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">
      <Breadcrumbs
        items={[
          { label: "Games", href: "/games" },
          { label: `${levelLabel} Games`, href: levelHref },
        ]}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1"
      >
        <h1 className="text-3xl font-extrabold text-white">{levelLabel} {t.gamesTitle[lang]}</h1>
        <p className="text-gray-400">Practice {levelLabel} vocabulary with fun interactive games</p>
      </motion.div>

      {/* Game cards */}
      <div className="grid md:grid-cols-3 gap-5">
        {games.map((game, i) => (
          <motion.button
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.03, y: -3 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveGame(game.id)}
            className="card p-6 text-left space-y-4 relative overflow-hidden group hover:border-gray-600 transition-all"
          >
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-10 group-hover:opacity-20 transition-opacity",
                game.gradient
              )}
            />
            <span className="text-4xl relative">{game.icon}</span>
            <div className="relative space-y-1">
              <h3 className="font-bold text-white text-lg">{game.title}</h3>
              <p className="text-sm text-gray-400">{game.desc}</p>
            </div>
            <div className="relative flex items-center gap-1 text-xs text-yellow-400 font-semibold">
              <Star size={12} className="fill-current" />
              {game.xp}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Game modals */}
      <AnimatePresence>
        {activeGame === "flashcards" && (
          <GameModal onClose={() => setActiveGame(null)}>
            <FlashcardsGame lang={lang} getVocab={getVocab} />
          </GameModal>
        )}
        {activeGame === "memory" && (
          <GameModal onClose={() => setActiveGame(null)}>
            <MemoryGame lang={lang} getVocab={getVocab} />
          </GameModal>
        )}
        {activeGame === "wordmatch" && (
          <GameModal onClose={() => setActiveGame(null)}>
            <WordMatchGame lang={lang} getVocab={getVocab} />
          </GameModal>
        )}
      </AnimatePresence>
    </div>
  );
}

function GameModal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-sm pt-4 md:pt-10 px-4 pb-24 md:pb-6 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 10 }}
        className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-10"
        >
          <X size={22} />
        </button>
        {children}
      </motion.div>
    </motion.div>
  );
}

// ── Flashcards Game ──────────────────────────────────────────────────────────
function FlashcardsGame({ lang, getVocab }: { lang: Lang; getVocab: () => VocabItem[] }) {
  const { addXP } = useProgress();
  const [deck, setDeck] = useState<VocabItem[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const [learning, setLearning] = useState(0);
  const [done, setDone] = useState(false);
  const [sessionXP, setSessionXP] = useState(0);

  useEffect(() => {
    const all = getVocab();
    setDeck(shuffle(all).slice(0, 20));
  }, [getVocab]);

  const card = deck[index];

  const handleKnew = () => {
    addXP(2, "flashcard");
    setKnown((k) => k + 1);
    setSessionXP((x) => x + 2);
    next();
  };

  const handleLearning = () => {
    setLearning((l) => l + 1);
    next();
  };

  const next = () => {
    if (index + 1 >= deck.length) {
      setDone(true);
    } else {
      setIndex((i) => i + 1);
      setFlipped(false);
    }
  };

  const restart = () => {
    setDeck(shuffle(getVocab()).slice(0, 20));
    setIndex(0);
    setFlipped(false);
    setKnown(0);
    setLearning(0);
    setDone(false);
    setSessionXP(0);
  };

  if (deck.length === 0) {
    return <div className="p-8 text-center text-gray-400">Loading cards...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">{t.flashcards[lang]}</h2>
        <div className="flex items-center gap-2 text-sm text-yellow-400 font-semibold">
          <Star size={14} className="fill-current" />
          {sessionXP} XP
        </div>
      </div>

      {done ? (
        <div className="text-center space-y-4 py-6">
          <div className="text-5xl">🎉</div>
          <h3 className="text-xl font-bold text-white">Session Complete!</h3>
          <div className="flex justify-center gap-8 text-sm">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">{known}</p>
              <p className="text-gray-400">{t.knew[lang]}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-400">{learning}</p>
              <p className="text-gray-400">{t.didntKnow[lang]}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-400">+{sessionXP}</p>
              <p className="text-gray-400">XP Earned</p>
            </div>
          </div>
          <button onClick={restart} className="btn-primary flex items-center gap-2 mx-auto">
            <RotateCcw size={16} />
            New Session
          </button>
        </div>
      ) : (
        <>
          {/* Progress */}
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>{index + 1} / {deck.length}</span>
            <span className="text-green-400">{known} known</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${((index) / deck.length) * 100}%` }} />
          </div>

          {/* Card */}
          <motion.div
            key={index}
            initial={{ opacity: 0, rotateY: -30 }}
            animate={{ opacity: 1, rotateY: 0 }}
            className="relative cursor-pointer"
            onClick={() => setFlipped((f) => !f)}
            style={{ perspective: 1000 }}
          >
            <motion.div
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={{ duration: 0.4 }}
              style={{ transformStyle: "preserve-3d", position: "relative", minHeight: "200px" }}
            >
              {/* Front */}
              <div
                className="absolute inset-0 card p-8 flex flex-col items-center justify-center text-center rounded-2xl"
                style={{ backfaceVisibility: "hidden" }}
              >
                <p className="text-xs text-gray-500 mb-3 uppercase tracking-wide">German</p>
                <p className="text-3xl font-extrabold text-white">{card?.german}</p>
                {card?.example && (
                  <p className="text-sm text-gray-400 mt-3 italic">"{card.example}"</p>
                )}
                <p className="text-xs text-gray-600 mt-4">Tap to reveal</p>
              </div>
              {/* Back */}
              <div
                className="absolute inset-0 card p-8 flex flex-col items-center justify-center text-center rounded-2xl bg-yellow-400/5 border-yellow-400/30"
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              >
                <p className="text-xs text-gray-500 mb-3 uppercase tracking-wide">English</p>
                <p className="text-3xl font-extrabold text-yellow-400">{card?.english}</p>
                {card?.exampleEn && (
                  <p className="text-sm text-gray-400 mt-3 italic">"{card.exampleEn}"</p>
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* Buttons — only show when flipped */}
          <AnimatePresence>
            {flipped && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="grid grid-cols-2 gap-3"
              >
                <button
                  onClick={handleLearning}
                  className="btn-secondary flex items-center justify-center gap-2 text-orange-400 border border-orange-400/30 hover:bg-orange-400/10"
                >
                  {t.didntKnow[lang]}
                </button>
                <button
                  onClick={handleKnew}
                  className="btn-primary flex items-center justify-center gap-2"
                >
                  <Star size={14} className="fill-current" />
                  {t.knew[lang]} +2 XP
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}

// ── Memory Game ───────────────────────────────────────────────────────────────
interface MemCard {
  id: number;
  pairId: number;
  text: string;
  isGerman: boolean;
  flipped: boolean;
  matched: boolean;
}

function MemoryGame({ lang, getVocab }: { lang: Lang; getVocab: () => VocabItem[] }) {
  const { addXP } = useProgress();
  const [cards, setCards] = useState<MemCard[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [sessionXP, setSessionXP] = useState(0);
  const [done, setDone] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());

  const initGame = useCallback(() => {
    const all = getVocab();
    const pairs = shuffle(all).slice(0, 8);
    const cardArr: MemCard[] = [];
    pairs.forEach((item, i) => {
      cardArr.push({ id: i * 2, pairId: i, text: item.german, isGerman: true, flipped: false, matched: false });
      cardArr.push({ id: i * 2 + 1, pairId: i, text: item.english, isGerman: false, flipped: false, matched: false });
    });
    setCards(shuffle(cardArr));
    setSelected([]);
    setMatches(0);
    setAttempts(0);
    setSessionXP(0);
    setDone(false);
    setStartTime(Date.now());
  }, [getVocab]);

  useEffect(() => { initGame(); }, [initGame]);

  const handleFlip = (id: number) => {
    if (selected.length === 2) return;
    const card = cards.find((c) => c.id === id);
    if (!card || card.flipped || card.matched) return;

    const newSelected = [...selected, id];
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, flipped: true } : c))
    );

    if (newSelected.length === 2) {
      setAttempts((a) => a + 1);
      const [a, b] = newSelected.map((sid) => cards.find((c) => c.id === sid)!);
      const aCard = cards.find((c) => c.id === newSelected[0])!;
      const bCard = { ...card };

      setTimeout(() => {
        if (aCard.pairId === card.pairId && aCard.id !== card.id) {
          // Match!
          setCards((prev) =>
            prev.map((c) =>
              c.pairId === aCard.pairId ? { ...c, matched: true, flipped: true } : c
            )
          );
          const newMatches = matches + 1;
          addXP(5, "memory");
          setSessionXP((x) => x + 5);
          setMatches(newMatches);
          if (newMatches === 8) setDone(true);
        } else {
          setCards((prev) =>
            prev.map((c) =>
              newSelected.includes(c.id) && !c.matched ? { ...c, flipped: false } : c
            )
          );
        }
        setSelected([]);
      }, 900);
    }
    setSelected(newSelected);
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">{t.memoryGame[lang]}</h2>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-gray-400">{matches}/8 pairs</span>
          <span className="text-yellow-400 font-semibold flex items-center gap-1">
            <Star size={12} className="fill-current" />
            {sessionXP} XP
          </span>
        </div>
      </div>

      {done ? (
        <div className="text-center space-y-4 py-4">
          <div className="text-5xl">🏆</div>
          <h3 className="text-xl font-bold text-white">All Pairs Found!</h3>
          <p className="text-gray-400">Completed in {attempts} attempts</p>
          <p className="text-yellow-400 font-bold text-lg">+{sessionXP} XP Earned!</p>
          <button onClick={initGame} className="btn-primary flex items-center gap-2 mx-auto">
            <RotateCcw size={16} />
            Play Again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {cards.map((card) => (
            <motion.button
              key={card.id}
              whileHover={!card.flipped && !card.matched ? { scale: 1.05 } : {}}
              whileTap={!card.flipped && !card.matched ? { scale: 0.95 } : {}}
              onClick={() => handleFlip(card.id)}
              className={cn(
                "aspect-square rounded-xl border text-xs font-bold flex items-center justify-center p-1.5 text-center transition-all",
                card.matched
                  ? "bg-green-900/30 border-green-500 text-green-300 cursor-default"
                  : card.flipped
                  ? card.isGerman
                    ? "bg-blue-900/40 border-blue-500 text-white"
                    : "bg-yellow-400/10 border-yellow-500 text-yellow-300"
                  : "bg-gray-800 border-gray-700 text-gray-600 hover:border-gray-500 cursor-pointer"
              )}
            >
              {card.flipped || card.matched ? (
                <span className="leading-tight">{card.text}</span>
              ) : (
                <span className="text-lg">?</span>
              )}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Word Match Game ───────────────────────────────────────────────────────────
interface WMPair {
  german: string;
  english: string;
}

function WordMatchGame({ lang, getVocab }: { lang: Lang; getVocab: () => VocabItem[] }) {
  const { addXP } = useProgress();
  const [pairs, setPairs] = useState<WMPair[]>([]);
  const [shuffledEn, setShuffledEn] = useState<string[]>([]);
  const [selectedDE, setSelectedDE] = useState<string | null>(null);
  const [selectedEN, setSelectedEN] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]); // german words matched
  const [wrong, setWrong] = useState<string | null>(null);
  const [sessionXP, setSessionXP] = useState(0);
  const [done, setDone] = useState(false);

  const initGame = useCallback(() => {
    const all = getVocab();
    const selected = shuffle(all).slice(0, 6);
    const p = selected.map((v) => ({ german: v.german, english: v.english }));
    setPairs(p);
    setShuffledEn(shuffle(p.map((x) => x.english)));
    setSelectedDE(null);
    setSelectedEN(null);
    setMatched([]);
    setWrong(null);
    setSessionXP(0);
    setDone(false);
  }, [getVocab]);

  useEffect(() => { initGame(); }, [initGame]);

  const handleDE = (german: string) => {
    if (matched.includes(german)) return;
    setSelectedDE(german);
    setWrong(null);
  };

  const handleEN = (english: string) => {
    if (!selectedDE) return;
    if (matched.includes(selectedDE)) return;
    setSelectedEN(english);

    const pair = pairs.find((p) => p.german === selectedDE);
    if (pair?.english === english) {
      // Correct!
      const newMatched = [...matched, selectedDE];
      setMatched(newMatched);
      addXP(3);
      setSessionXP((x) => x + 3);
      setSelectedDE(null);
      setSelectedEN(null);
      if (newMatched.length === pairs.length) setDone(true);
    } else {
      // Wrong
      setWrong(selectedDE);
      setTimeout(() => {
        setSelectedDE(null);
        setSelectedEN(null);
        setWrong(null);
      }, 800);
    }
  };

  const getENState = (english: string) => {
    const matchedPair = pairs.find((p) => matched.includes(p.german));
    const isMatchedEN = pairs.some((p) => matched.includes(p.german) && p.english === english);
    if (isMatchedEN) return "matched";
    if (selectedEN === english && wrong) return "wrong";
    if (selectedEN === english) return "selected";
    return "default";
  };

  const getDEState = (german: string) => {
    if (matched.includes(german)) return "matched";
    if (wrong === german) return "wrong";
    if (selectedDE === german) return "selected";
    return "default";
  };

  const stateClasses: Record<string, string> = {
    default: "card hover:border-gray-600 text-gray-200 cursor-pointer",
    selected: "border-yellow-400 bg-yellow-400/10 text-yellow-300",
    matched: "border-green-500 bg-green-900/30 text-green-300 cursor-default",
    wrong: "border-red-500 bg-red-900/30 text-red-300",
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">{t.wordMatch[lang]}</h2>
        <span className="text-yellow-400 font-semibold text-sm flex items-center gap-1">
          <Star size={12} className="fill-current" />
          {sessionXP} XP
        </span>
      </div>

      {done ? (
        <div className="text-center space-y-4 py-4">
          <div className="text-5xl">🎯</div>
          <h3 className="text-xl font-bold text-white">All Matched!</h3>
          <p className="text-yellow-400 font-bold text-lg">+{sessionXP} XP Earned!</p>
          <button onClick={initGame} className="btn-primary flex items-center gap-2 mx-auto">
            <RotateCcw size={16} />
            New Round
          </button>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-400">Select a German word, then its English translation.</p>
          <div className="grid grid-cols-2 gap-3">
            {/* German column */}
            <div className="space-y-2">
              <p className="text-xs text-blue-400 font-bold uppercase tracking-wide">Deutsch</p>
              {pairs.map(({ german }) => (
                <motion.button
                  key={german}
                  whileHover={!matched.includes(german) ? { scale: 1.03 } : {}}
                  whileTap={!matched.includes(german) ? { scale: 0.97 } : {}}
                  onClick={() => handleDE(german)}
                  className={cn(
                    "w-full text-left p-3 rounded-xl border text-sm font-medium transition-all",
                    stateClasses[getDEState(german)]
                  )}
                >
                  {matched.includes(german) ? "✓ " : ""}{german}
                </motion.button>
              ))}
            </div>

            {/* English column */}
            <div className="space-y-2">
              <p className="text-xs text-yellow-400 font-bold uppercase tracking-wide">English</p>
              {shuffledEn.map((english) => {
                const state = getENState(english);
                return (
                  <motion.button
                    key={english}
                    whileHover={state === "default" && selectedDE ? { scale: 1.03 } : {}}
                    whileTap={state === "default" && selectedDE ? { scale: 0.97 } : {}}
                    onClick={() => handleEN(english)}
                    className={cn(
                      "w-full text-left p-3 rounded-xl border text-sm font-medium transition-all",
                      stateClasses[state],
                      !selectedDE && state === "default" && "opacity-60"
                    )}
                  >
                    {state === "matched" ? "✓ " : ""}{english}
                  </motion.button>
                );
              })}
            </div>
          </div>
          <p className="text-xs text-gray-500 text-center">
            {matched.length} / {pairs.length} matched
          </p>
        </>
      )}
    </div>
  );
}
