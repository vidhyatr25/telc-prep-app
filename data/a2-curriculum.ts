import type { Lesson, QuizQuestion, Unit } from "@/data/curriculum";

type A2Unit = Unit & {
  examFocus: string;
};

const makeVocabLesson = (
  id: string,
  title: string,
  content: string,
  vocab: NonNullable<Lesson["vocab"]>
): Lesson => ({
  id,
  title,
  titleDe: title,
  type: "vocab",
  content,
  vocab,
  xp: 30,
});

const makeGrammarLesson = (
  id: string,
  title: string,
  content: string,
  examples: { german: string; english: string }[]
): Lesson => ({
  id,
  title,
  titleDe: title,
  type: "grammar",
  content,
  grammar: [
    {
      title,
      explanation: content,
      examples,
    },
  ],
  xp: 35,
});

const makeQuiz = (unitId: number, topic: string, answer: string): QuizQuestion[] => [
  {
    id: `a2-q${unitId}-1`,
    type: "multiple-choice",
    question: `Which phrase fits the A2 topic "${topic}"?`,
    options: [answer, "Ich heisse Tom.", "Das ist ein Apfel.", "Guten Morgen."],
    answer: 0,
  },
  {
    id: `a2-q${unitId}-2`,
    type: "fill-blank",
    question: "Complete the sentence: Ich habe gestern ___ gelernt.",
    answer: "Deutsch",
    explanation: "A2 learners should be comfortable talking about past activities with Perfekt.",
  },
  {
    id: `a2-q${unitId}-3`,
    type: "true-false",
    question: "A2 tasks include longer everyday messages, appointments, opinions, and short written responses.",
    options: ["True", "False"],
    answer: 0,
  },
];

export const a2Units: A2Unit[] = [
  {
    id: 201,
    slug: "a2-daily-life",
    title: "Daily Life & Small Talk",
    titleDe: "Alltag und Small Talk",
    description: "Speak naturally about routines, free time, weather, and daily plans.",
    descriptionDe: "Uber Alltag, Freizeit, Wetter und Plane sprechen.",
    icon: "A2",
    color: "from-blue-500 to-cyan-600",
    examFocus: "Speaking Part 1 and short everyday conversations",
    xpReward: 120,
    lessons: [
      makeVocabLesson("a2-1-1", "Everyday Conversation", "A2 conversations need follow-up questions and longer answers.", [
        { german: "Wie laeuft dein Tag?", english: "How is your day going?" },
        { german: "Ich habe viel zu tun.", english: "I have a lot to do." },
        { german: "Was machst du am Wochenende?", english: "What are you doing at the weekend?" },
        { german: "Ich treffe Freunde.", english: "I am meeting friends." },
      ]),
      makeGrammarLesson("a2-1-2", "Longer Answers", "Use connectors to make A2 answers longer and clearer.", [
        { german: "Ich lerne Deutsch, weil ich in Deutschland arbeiten moechte.", english: "I learn German because I want to work in Germany." },
        { german: "Am Wochenende koche ich und danach sehe ich einen Film.", english: "At the weekend I cook and then watch a film." },
      ]),
    ],
    quiz: makeQuiz(1, "daily life", "Ich habe viel zu tun."),
  },
  {
    id: 202,
    slug: "a2-past-events",
    title: "Past Events",
    titleDe: "Vergangene Ereignisse",
    description: "Use Perfekt to talk about yesterday, trips, work, and study.",
    descriptionDe: "Mit Perfekt uber gestern, Reisen, Arbeit und Lernen sprechen.",
    icon: "A2",
    color: "from-indigo-500 to-blue-700",
    examFocus: "Speaking and writing about recent experiences",
    xpReward: 130,
    lessons: [
      makeGrammarLesson("a2-2-1", "Perfekt Basics", "Most spoken past events use haben/sein plus a participle.", [
        { german: "Ich habe gestern gelernt.", english: "I studied yesterday." },
        { german: "Wir sind nach Berlin gefahren.", english: "We travelled to Berlin." },
      ]),
      makeVocabLesson("a2-2-2", "Trip and Weekend Verbs", "Common verbs for describing past activities.", [
        { german: "besucht", english: "visited" },
        { german: "gekauft", english: "bought" },
        { german: "gearbeitet", english: "worked" },
        { german: "gefahren", english: "travelled/went" },
      ]),
    ],
    quiz: makeQuiz(2, "past events", "Ich habe gestern gearbeitet."),
  },
  {
    id: 203,
    slug: "a2-appointments",
    title: "Appointments & Plans",
    titleDe: "Termine und Plane",
    description: "Make, change, and cancel appointments politely.",
    descriptionDe: "Termine vereinbaren, verschieben und absagen.",
    icon: "A2",
    color: "from-sky-500 to-blue-600",
    examFocus: "Listening messages and writing short replies",
    xpReward: 120,
    lessons: [
      makeVocabLesson("a2-3-1", "Appointment Phrases", "Useful language for arranging times.", [
        { german: "Ich moechte einen Termin vereinbaren.", english: "I would like to make an appointment." },
        { german: "Koennen wir den Termin verschieben?", english: "Can we move the appointment?" },
        { german: "Ich muss leider absagen.", english: "Unfortunately I have to cancel." },
      ]),
      makeGrammarLesson("a2-3-2", "Polite Requests", "A2 tasks often expect polite modal verb phrases.", [
        { german: "Koennte ich bitte am Dienstag kommen?", english: "Could I please come on Tuesday?" },
        { german: "Ich kann leider nicht um 10 Uhr.", english: "Unfortunately I cannot at 10." },
      ]),
    ],
    quiz: makeQuiz(3, "appointments", "Ich moechte einen Termin vereinbaren."),
  },
  {
    id: 204,
    slug: "a2-work",
    title: "Work & Applications",
    titleDe: "Arbeit und Bewerbungen",
    description: "Understand job ads and describe work experience.",
    descriptionDe: "Stellenanzeigen verstehen und Berufserfahrung beschreiben.",
    icon: "A2",
    color: "from-emerald-500 to-cyan-700",
    examFocus: "Reading ads and writing formal messages",
    xpReward: 130,
    lessons: [
      makeVocabLesson("a2-4-1", "Job Ad Vocabulary", "Words that appear in simple job ads.", [
        { german: "die Arbeitszeit", english: "working hours" },
        { german: "die Erfahrung", english: "experience" },
        { german: "die Bewerbung", english: "application" },
        { german: "Teilzeit", english: "part-time" },
      ]),
      makeGrammarLesson("a2-4-2", "Formal Email Sentences", "Use polite phrases in work-related writing.", [
        { german: "Sehr geehrte Damen und Herren,", english: "Dear Sir or Madam," },
        { german: "Ich interessiere mich fuer die Stelle.", english: "I am interested in the position." },
      ]),
    ],
    quiz: makeQuiz(4, "work", "Ich interessiere mich fuer die Stelle."),
  },
  {
    id: 205,
    slug: "a2-housing",
    title: "Housing & City Life",
    titleDe: "Wohnen und Stadtleben",
    description: "Discuss apartments, repairs, rent, rooms, and neighborhoods.",
    descriptionDe: "Uber Wohnungen, Reparaturen, Miete und Stadtteile sprechen.",
    icon: "A2",
    color: "from-teal-500 to-emerald-700",
    examFocus: "Reading notices and describing housing problems",
    xpReward: 120,
    lessons: [
      makeVocabLesson("a2-5-1", "Apartment Problems", "Describe common housing issues.", [
        { german: "die Heizung ist kaputt", english: "the heating is broken" },
        { german: "die Miete", english: "rent" },
        { german: "der Nachbar", english: "neighbor" },
        { german: "die Reparatur", english: "repair" },
      ]),
      makeGrammarLesson("a2-5-2", "Describing Problems", "Use simple but clear problem descriptions.", [
        { german: "Seit gestern funktioniert die Heizung nicht.", english: "The heating has not worked since yesterday." },
        { german: "Koennen Sie bitte jemanden schicken?", english: "Can you please send someone?" },
      ]),
    ],
    quiz: makeQuiz(5, "housing", "Seit gestern funktioniert die Heizung nicht."),
  },
  {
    id: 206,
    slug: "a2-health",
    title: "Health & Emergencies",
    titleDe: "Gesundheit und Notfalle",
    description: "Explain symptoms and understand basic medical instructions.",
    descriptionDe: "Symptome erklaren und einfache Anweisungen verstehen.",
    icon: "A2",
    color: "from-rose-500 to-red-700",
    examFocus: "Doctor role-play and listening instructions",
    xpReward: 130,
    lessons: [
      makeVocabLesson("a2-6-1", "Symptoms", "A2 health tasks require more detail than A1.", [
        { german: "mir ist schwindlig", english: "I feel dizzy" },
        { german: "die Schmerzen", english: "pain" },
        { german: "das Medikament", english: "medicine" },
        { german: "die Untersuchung", english: "examination" },
      ]),
      makeGrammarLesson("a2-6-2", "Health Instructions", "Understand and give basic instructions.", [
        { german: "Nehmen Sie die Tabletten zweimal am Tag.", english: "Take the tablets twice a day." },
        { german: "Sie sollen viel Wasser trinken.", english: "You should drink a lot of water." },
      ]),
    ],
    quiz: makeQuiz(6, "health", "Nehmen Sie die Tabletten zweimal am Tag."),
  },
  {
    id: 207,
    slug: "a2-travel",
    title: "Travel & Public Services",
    titleDe: "Reisen und offentliche Dienste",
    description: "Handle tickets, delays, public offices, and travel problems.",
    descriptionDe: "Tickets, Verspatungen, Amter und Reiseprobleme besprechen.",
    icon: "A2",
    color: "from-orange-500 to-amber-700",
    examFocus: "Listening announcements and service role-play",
    xpReward: 130,
    lessons: [
      makeVocabLesson("a2-7-1", "Travel Problems", "Useful phrases for delays and tickets.", [
        { german: "der Zug hat Verspaetung", english: "the train is delayed" },
        { german: "die Verbindung", english: "connection" },
        { german: "der Schalter", english: "counter" },
        { german: "die Unterlagen", english: "documents" },
      ]),
      makeGrammarLesson("a2-7-2", "Asking for Help", "A2 role-plays often require clear requests.", [
        { german: "Koennen Sie mir bitte helfen?", english: "Can you please help me?" },
        { german: "Welche Unterlagen brauche ich?", english: "Which documents do I need?" },
      ]),
    ],
    quiz: makeQuiz(7, "travel", "Der Zug hat Verspaetung."),
  },
  {
    id: 208,
    slug: "a2-opinions",
    title: "Opinions & Comparisons",
    titleDe: "Meinungen und Vergleiche",
    description: "Compare options and explain simple opinions.",
    descriptionDe: "Optionen vergleichen und einfache Meinungen begrunden.",
    icon: "A2",
    color: "from-violet-500 to-purple-700",
    examFocus: "Speaking Part 2 and short written reasons",
    xpReward: 120,
    lessons: [
      makeVocabLesson("a2-8-1", "Opinion Phrases", "Give reasons and preferences.", [
        { german: "Ich finde das praktisch.", english: "I find that practical." },
        { german: "Meiner Meinung nach", english: "in my opinion" },
        { german: "besser als", english: "better than" },
        { german: "nicht so teuer wie", english: "not as expensive as" },
      ]),
      makeGrammarLesson("a2-8-2", "Comparisons", "Use als and wie for simple comparisons.", [
        { german: "Das Fahrrad ist billiger als das Auto.", english: "The bicycle is cheaper than the car." },
        { german: "Der Bus ist nicht so schnell wie der Zug.", english: "The bus is not as fast as the train." },
      ]),
    ],
    quiz: makeQuiz(8, "opinions", "Meiner Meinung nach ist das praktisch."),
  },
  {
    id: 209,
    slug: "a2-reading-writing",
    title: "Reading & Writing Strategies",
    titleDe: "Lesen und Schreiben Strategien",
    description: "Read real-life texts and write short A2 messages.",
    descriptionDe: "Alltagstexte lesen und kurze A2-Nachrichten schreiben.",
    icon: "A2",
    color: "from-fuchsia-500 to-pink-700",
    examFocus: "A2 written exam preparation",
    xpReward: 140,
    lessons: [
      makeVocabLesson("a2-9-1", "Real-Life Text Types", "Recognize common A2 reading texts.", [
        { german: "die Anzeige", english: "advertisement" },
        { german: "die Mitteilung", english: "notice/message" },
        { german: "die Einladung", english: "invitation" },
        { german: "die Beschwerde", english: "complaint" },
      ]),
      makeGrammarLesson("a2-9-2", "Short Message Structure", "A2 writing should answer every bullet point.", [
        { german: "Vielen Dank fuer deine Einladung.", english: "Thank you for your invitation." },
        { german: "Leider kann ich am Samstag nicht kommen.", english: "Unfortunately I cannot come on Saturday." },
      ]),
    ],
    quiz: makeQuiz(9, "reading and writing", "Leider kann ich am Samstag nicht kommen."),
  },
  {
    id: 210,
    slug: "a2-exam-training",
    title: "A2 Exam Training",
    titleDe: "A2 Prufungstraining",
    description: "Practice integrated TELC A2 reading, listening, writing, and speaking tasks.",
    descriptionDe: "Integrierte TELC A2 Aufgaben trainieren.",
    icon: "A2",
    color: "from-slate-500 to-gray-700",
    examFocus: "Full A2 exam review",
    xpReward: 160,
    lessons: [
      makeVocabLesson("a2-10-1", "Exam Instructions", "Know the words used in task instructions.", [
        { german: "kreuzen Sie an", english: "tick/select" },
        { german: "ordnen Sie zu", english: "match/assign" },
        { german: "schreiben Sie eine Nachricht", english: "write a message" },
      ]),
      makeGrammarLesson("a2-10-2", "Exam Answer Patterns", "Reusable A2 answer patterns for speaking and writing.", [
        { german: "Ich moechte gern ueber meinen Alltag sprechen.", english: "I would like to talk about my daily life." },
        { german: "Koennen wir einen neuen Termin machen?", english: "Can we make a new appointment?" },
      ]),
    ],
    quiz: makeQuiz(10, "exam training", "Kreuzen Sie die richtige Antwort an."),
  },
];

export function getAllA2Vocab() {
  return a2Units.flatMap((unit) =>
    unit.lessons.flatMap((lesson) => lesson.vocab ?? [])
  );
}
