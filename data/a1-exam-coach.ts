export type ExamModuleId = "reading" | "listening" | "writing" | "speaking";

export const a1StudentAudit = [
  {
    student: "Student 1 - new beginner",
    concern: "Clicked the first A1 unit and reached a Unit not found screen.",
    productChange: "A1 unit, lesson, quiz, game, and mock-test routes now use stable route params.",
  },
  {
    student: "Student 2 - nervous speaker",
    concern: "Said the word correctly but pronunciation practice rejected it.",
    productChange: "Pronunciation now shows what was heard, a match score, and accepts close A1 attempts.",
  },
  {
    student: "Student 3 - exam-focused learner",
    concern: "Could not tell what is enough to pass A1.",
    productChange: "Added a readiness checklist tied to unit quizzes, mock tests, and speaking practice.",
  },
  {
    student: "Student 4 - self-study learner",
    concern: "Wanted a single cheat sheet before mock tests.",
    productChange: "Added module cheat sheets for reading, listening, writing, and speaking.",
  },
  {
    student: "Student 5 - slow reader",
    concern: "Reads every word and runs out of time.",
    productChange: "Reading guidance now teaches scanning for names, dates, prices, and keywords.",
  },
  {
    student: "Student 6 - listening beginner",
    concern: "Misses numbers, times, and station announcements.",
    productChange: "Listening cheat sheet focuses on numbers, time, place, and repeated keywords.",
  },
  {
    student: "Student 7 - writing beginner",
    concern: "Can answer vocabulary quizzes but cannot write a short message.",
    productChange: "Writing templates now give safe A1 sentence frames.",
  },
  {
    student: "Student 8 - speaking exam learner",
    concern: "Does not know what to say in the speaking intro.",
    productChange: "Speaking cheat sheet includes a ready self-introduction structure.",
  },
  {
    student: "Student 9 - practice-driven learner",
    concern: "Wanted quick quizzes per exam module, not only unit quizzes.",
    productChange: "Added module mini-quizzes for reading, listening, writing, and speaking.",
  },
  {
    student: "Student 10 - mobile learner",
    concern: "Needs clear next actions instead of a normal lesson library.",
    productChange: "Added an A1 Exam Coach section with pass readiness and focused drills.",
  },
];

export const readinessChecks = [
  "Finish every A1 unit lesson.",
  "Score 70% or more on each unit quiz.",
  "Complete at least 2 A1 mock tests.",
  "Practice 30 core words with Slow, Normal, and Say it.",
  "Memorize one speaking introduction and one writing template.",
];

export const examModules = [
  {
    id: "reading" as const,
    label: "Reading",
    goal: "Find the answer fast without translating every word.",
    cheatSheet: [
      "Read the question first.",
      "Underline names, dates, prices, places, and opening hours.",
      "In forms, check headings before details.",
      "If two answers look possible, choose the one that matches the exact situation.",
    ],
    quiz: [
      {
        question: "A poster says: Montag bis Freitag 9-18 Uhr. When is it open?",
        options: ["Only Monday", "Weekdays 9 to 18", "Every evening"],
        answer: 1,
      },
      {
        question: "What should you scan first in a notice?",
        options: ["Every word", "Names, dates, times, prices", "The longest sentence"],
        answer: 1,
      },
      {
        question: "A form asks for Geburtsdatum. What do you write?",
        options: ["Date of birth", "Phone number", "Nationality"],
        answer: 0,
      },
    ],
  },
  {
    id: "listening" as const,
    label: "Listening",
    goal: "Catch key information the first time.",
    cheatSheet: [
      "Before listening, predict the information type: time, place, number, or person.",
      "Numbers can decide the answer, so repeat them quietly.",
      "Ignore unknown words if the key detail is clear.",
      "Listen for corrected information: nicht um 8 Uhr, sondern um 9 Uhr.",
    ],
    quiz: [
      {
        question: "You hear: Der Zug kommt um 14:30 Uhr. What is the key detail?",
        options: ["Train time", "Ticket price", "Platform number"],
        answer: 0,
      },
      {
        question: "Which words often signal a correction?",
        options: ["und / oder", "nicht / sondern", "ich / du"],
        answer: 1,
      },
      {
        question: "For A1 listening, what should you write down quickly?",
        options: ["Every unknown word", "Numbers and times", "Full sentences"],
        answer: 1,
      },
    ],
  },
  {
    id: "writing" as const,
    label: "Writing",
    goal: "Write short, correct A1 messages.",
    cheatSheet: [
      "Start simply: Hallo Anna, or Sehr geehrte Damen und Herren.",
      "Use short sentences: Ich kann am Samstag nicht kommen.",
      "Answer all points from the task.",
      "End safely: Viele Gruesse or Mit freundlichen Gruessen.",
    ],
    quiz: [
      {
        question: "Best ending for a message to a friend?",
        options: ["Viele Gruesse", "Guten Morgen", "Ich komme aus Indien"],
        answer: 0,
      },
      {
        question: "What is more important at A1?",
        options: ["Long sentences", "Clear short sentences", "Advanced grammar"],
        answer: 1,
      },
      {
        question: "Which sentence cancels an appointment?",
        options: ["Ich kann leider nicht kommen.", "Ich heisse Ravi.", "Das kostet 10 Euro."],
        answer: 0,
      },
    ],
  },
  {
    id: "speaking" as const,
    label: "Speaking",
    goal: "Answer confidently with simple memorized patterns.",
    cheatSheet: [
      "Intro: Ich heisse ..., ich komme aus ..., ich wohne in ...",
      "Job: Ich bin ... von Beruf or Ich studiere.",
      "Ask back: Und Sie? or Wie bitte?",
      "If stuck, use: Koennen Sie das bitte wiederholen?",
    ],
    quiz: [
      {
        question: "What is a safe A1 phrase if you do not understand?",
        options: ["Koennen Sie das bitte wiederholen?", "Ich fahre morgen.", "Das ist teuer."],
        answer: 0,
      },
      {
        question: "How do you say where you are from?",
        options: ["Ich komme aus ...", "Ich habe ...", "Ich brauche ..."],
        answer: 0,
      },
      {
        question: "Which answer fits Was machen Sie beruflich?",
        options: ["Ich bin Ingenieur.", "Ich wohne in Berlin.", "Ich trinke Kaffee."],
        answer: 0,
      },
    ],
  },
];
