export type Lang = "en" | "de";

export const t: Record<string, Record<Lang, string>> = {
  // Nav
  home: { en: "Home", de: "Startseite" },
  learn: { en: "Learn", de: "Lernen" },
  games: { en: "Games", de: "Spiele" },
  mockTest: { en: "Mock Tests", de: "Probeprüfungen" },
  progress: { en: "Progress", de: "Fortschritt" },

  // Home
  appTitle: { en: "Deutsch A1", de: "Deutsch A1" },
  appSubtitle: {
    en: "Your path to Telc A1 certification",
    de: "Ihr Weg zur Telc A1 Zertifizierung",
  },
  startLearning: { en: "Start Learning", de: "Jetzt Lernen" },
  continuelearning: { en: "Continue Learning", de: "Weiterlernen" },
  yourProgress: { en: "Your Progress", de: "Ihr Fortschritt" },
  units: { en: "Units", de: "Einheiten" },
  quizzes: { en: "Quizzes", de: "Quiz" },
  tests: { en: "Mock Tests", de: "Probeprüfungen" },
  completed: { en: "Completed", de: "Abgeschlossen" },

  // Learn
  learnTitle: { en: "A1 Learning Path", de: "A1 Lernpfad" },
  learnSubtitle: {
    en: "10 structured units aligned to the Telc A1 syllabus",
    de: "10 strukturierte Einheiten nach dem Telc A1 Lehrplan",
  },
  unit: { en: "Unit", de: "Einheit" },
  lesson: { en: "Lesson", de: "Lektion" },
  vocabulary: { en: "Vocabulary", de: "Vokabeln" },
  grammar: { en: "Grammar", de: "Grammatik" },
  startUnit: { en: "Start Unit", de: "Einheit starten" },
  continueUnit: { en: "Continue", de: "Weiter" },
  locked: { en: "Locked", de: "Gesperrt" },

  // Quiz
  quizTitle: { en: "Quiz", de: "Quiz" },
  question: { en: "Question", de: "Frage" },
  of: { en: "of", de: "von" },
  correct: { en: "Correct!", de: "Richtig!" },
  incorrect: { en: "Incorrect!", de: "Falsch!" },
  next: { en: "Next", de: "Weiter" },
  finish: { en: "Finish", de: "Beenden" },
  yourScore: { en: "Your Score", de: "Ihr Ergebnis" },
  tryAgain: { en: "Try Again", de: "Nochmal versuchen" },
  backToLearn: { en: "Back to Learning", de: "Zurück zum Lernen" },

  // Games
  gamesTitle: { en: "Learning Games", de: "Lernspiele" },
  flashcards: { en: "Flashcards", de: "Lernkarten" },
  flashcardsDesc: {
    en: "Flip cards to master vocabulary",
    de: "Karten umdrehen um Vokabeln zu lernen",
  },
  memoryGame: { en: "Memory Match", de: "Memory-Spiel" },
  memoryDesc: {
    en: "Match German words with their meanings",
    de: "Deutsche Wörter mit ihren Bedeutungen verbinden",
  },
  wordMatch: { en: "Word Match", de: "Wörter zuordnen" },
  wordMatchDesc: {
    en: "Drag words to their correct translation",
    de: "Wörter der richtigen Übersetzung zuordnen",
  },
  flip: { en: "Flip", de: "Umdrehen" },
  knew: { en: "I knew it!", de: "Ich wusste es!" },
  didntKnow: { en: "Still learning", de: "Noch lernen" },

  // Mock Test
  mockTestTitle: { en: "Telc A1 Mock Tests", de: "Telc A1 Probeprüfungen" },
  mockTestSubtitle: {
    en: "Simulate the real Telc A1 exam experience",
    de: "Die echte Telc A1 Prüfungserfahrung simulieren",
  },
  startTest: { en: "Start Test", de: "Test starten" },
  timeRemaining: { en: "Time Remaining", de: "Verbleibende Zeit" },
  submitTest: { en: "Submit Test", de: "Test abgeben" },
  testResult: { en: "Test Result", de: "Testergebnis" },
  passMessage: {
    en: "Congratulations! You're exam-ready!",
    de: "Herzlichen Glückwunsch! Sie sind prüfungsbereit!",
  },
  failMessage: {
    en: "Keep practicing — you're getting there!",
    de: "Weiter üben — Sie sind auf dem richtigen Weg!",
  },
  reading: { en: "Reading", de: "Lesen" },
  listening: { en: "Listening", de: "Hören" },
  writing: { en: "Writing", de: "Schreiben" },
  speaking: { en: "Speaking", de: "Sprechen" },

  // Progress
  progressTitle: { en: "My Progress", de: "Mein Fortschritt" },
  totalXP: { en: "Total XP", de: "Gesamt XP" },
  streak: { en: "Day Streak", de: "Tage-Serie" },
  accuracy: { en: "Accuracy", de: "Genauigkeit" },
  unitsCompleted: { en: "Units Completed", de: "Abgeschlossene Einheiten" },
  resetProgress: { en: "Reset Progress", de: "Fortschritt zurücksetzen" },

  // Common
  back: { en: "Back", de: "Zurück" },
  close: { en: "Close", de: "Schließen" },
  english: { en: "English", de: "Englisch" },
  german: { en: "German", de: "Deutsch" },
  switchLang: { en: "Switch to German", de: "Auf Englisch wechseln" },
  points: { en: "XP", de: "XP" },
  excellent: { en: "Excellent", de: "Ausgezeichnet" },
  good: { en: "Good", de: "Gut" },
  pass: { en: "Pass", de: "Bestanden" },
  needsPractice: { en: "Needs Practice", de: "Braucht Übung" },
};
