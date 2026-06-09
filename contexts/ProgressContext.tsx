"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { load, save } from "@/lib/storage";

export interface UnitProgress {
  unitId: number;
  lessonsCompleted: number[];  // lesson indices
  quizScore?: number;
  quizCompleted: boolean;
  xpEarned: number;
}

export interface MockTestResult {
  testId: number;
  score: number;
  totalPoints: number;
  passed: boolean;
  date: string;
}

export interface ProgressState {
  unitProgress: Record<number, UnitProgress>;
  mockTestResults: MockTestResult[];
  totalXP: number;
  streak: number;
  lastActiveDate: string;
  flashcardXP: number;
  memoryXP: number;
}

const defaultProgress: ProgressState = {
  unitProgress: {},
  mockTestResults: [],
  totalXP: 0,
  streak: 1,
  lastActiveDate: "",
  flashcardXP: 0,
  memoryXP: 0,
};

interface ProgressContextType {
  progress: ProgressState;
  completeLesson: (unitId: number, lessonIndex: number, xp: number) => void;
  completeQuiz: (unitId: number, score: number, xp: number) => void;
  saveMockTestResult: (result: MockTestResult) => void;
  addXP: (amount: number, type?: "flashcard" | "memory") => void;
  resetProgress: () => void;
  isLessonDone: (unitId: number, lessonIndex: number) => boolean;
  isUnitUnlocked: (unitId: number) => boolean;
  getUnitProgress: (unitId: number) => UnitProgress;
}

const ProgressContext = createContext<ProgressContextType>({} as ProgressContextType);

function withTodayStreak(state: ProgressState): ProgressState {
  const stored: ProgressState = {
    ...defaultProgress,
    ...state,
    unitProgress: state.unitProgress ?? {},
    mockTestResults: state.mockTestResults ?? [],
  };
  const today = new Date().toDateString();
  if (stored.lastActiveDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const wasYesterday = stored.lastActiveDate === yesterday.toDateString();
    return {
      ...stored,
      streak: wasYesterday ? stored.streak + 1 : 1,
      lastActiveDate: today,
    };
  }
  return stored;
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const [progress, setProgress] = useState<ProgressState>(defaultProgress);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "authenticated") {
      let cancelled = false;
      fetch("/api/progress")
        .then((response) => (response.ok ? response.json() : defaultProgress))
        .then((remote) => {
          if (cancelled) return;
          const updated = withTodayStreak(remote as ProgressState);
          setProgress(updated);
          save("progress", updated);
          fetch("/api/progress", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updated),
          }).catch(() => {});
        })
        .catch(() => {
          if (!cancelled) setProgress(withTodayStreak(load<ProgressState>("progress", defaultProgress)));
        });
      return () => {
        cancelled = true;
      };
    }

    const stored = withTodayStreak(load<ProgressState>("progress", defaultProgress));
    setProgress(stored);
    save("progress", stored);
  }, [status]);

  const persistRemote = useCallback(
    (newState: ProgressState) => {
      if (status !== "authenticated") return;
      fetch("/api/progress", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newState),
      }).catch(() => {});
    },
    [status]
  );

  const persist = useCallback((newState: ProgressState) => {
    setProgress(newState);
    save("progress", newState);
    persistRemote(newState);
  }, [persistRemote]);

  const completeLesson = useCallback(
    (unitId: number, lessonIndex: number, xp: number) => {
      setProgress((prev) => {
        const existing = prev.unitProgress[unitId] ?? {
          unitId,
          lessonsCompleted: [],
          quizCompleted: false,
          xpEarned: 0,
        };
        if (existing.lessonsCompleted.includes(lessonIndex)) return prev;
        const updated: ProgressState = {
          ...prev,
          totalXP: prev.totalXP + xp,
          unitProgress: {
            ...prev.unitProgress,
            [unitId]: {
              ...existing,
              lessonsCompleted: [...existing.lessonsCompleted, lessonIndex],
              xpEarned: existing.xpEarned + xp,
            },
          },
        };
        save("progress", updated);
        persistRemote(updated);
        return updated;
      });
    },
    [persistRemote]
  );

  const completeQuiz = useCallback(
    (unitId: number, score: number, xp: number) => {
      setProgress((prev) => {
        const existing = prev.unitProgress[unitId] ?? {
          unitId,
          lessonsCompleted: [],
          quizCompleted: false,
          xpEarned: 0,
        };
        const updated: ProgressState = {
          ...prev,
          totalXP: prev.totalXP + xp,
          unitProgress: {
            ...prev.unitProgress,
            [unitId]: {
              ...existing,
              quizScore: score,
              quizCompleted: true,
              xpEarned: existing.xpEarned + xp,
            },
          },
        };
        save("progress", updated);
        persistRemote(updated);
        return updated;
      });
    },
    [persistRemote]
  );

  const saveMockTestResult = useCallback((result: MockTestResult) => {
    setProgress((prev) => {
      const updated: ProgressState = {
        ...prev,
        totalXP: prev.totalXP + Math.round(result.score / 2),
        mockTestResults: [
          ...prev.mockTestResults.filter((r) => r.testId !== result.testId),
          result,
        ],
      };
      save("progress", updated);
      persistRemote(updated);
      return updated;
    });
  }, [persistRemote]);

  const addXP = useCallback((amount: number, type?: "flashcard" | "memory") => {
    setProgress((prev) => {
      const updated: ProgressState = {
        ...prev,
        totalXP: prev.totalXP + amount,
        flashcardXP: type === "flashcard" ? prev.flashcardXP + amount : prev.flashcardXP,
        memoryXP: type === "memory" ? prev.memoryXP + amount : prev.memoryXP,
      };
      save("progress", updated);
      persistRemote(updated);
      return updated;
    });
  }, [persistRemote]);

  const resetProgress = useCallback(() => {
    const fresh = { ...defaultProgress, lastActiveDate: new Date().toDateString() };
    persist(fresh);
  }, [persist]);

  const isLessonDone = useCallback(
    (unitId: number, lessonIndex: number) => {
      return progress.unitProgress[unitId]?.lessonsCompleted.includes(lessonIndex) ?? false;
    },
    [progress]
  );

  const isUnitUnlocked = useCallback(
    (unitId: number) => {
      if (unitId === 1) return true;
      const prev = progress.unitProgress[unitId - 1];
      return prev?.quizCompleted ?? false;
    },
    [progress]
  );

  const getUnitProgress = useCallback(
    (unitId: number): UnitProgress =>
      progress.unitProgress[unitId] ?? {
        unitId,
        lessonsCompleted: [],
        quizCompleted: false,
        xpEarned: 0,
      },
    [progress]
  );

  return (
    <ProgressContext.Provider
      value={{
        progress,
        completeLesson,
        completeQuiz,
        saveMockTestResult,
        addXP,
        resetProgress,
        isLessonDone,
        isUnitUnlocked,
        getUnitProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  return useContext(ProgressContext);
}
