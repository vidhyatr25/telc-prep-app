import type { MockTest } from "@/data/mock-tests";

export const a2MockTests: MockTest[] = [
  {
    id: 201,
    title: "TELC A2 Mock Test 1",
    subtitle: "Everyday life, appointments, work, and short messages",
    duration: 3600,
    passMark: 60,
    questions: [
      {
        id: "a2-mt1-r1",
        section: "reading",
        type: "multiple-choice",
        context:
          "Email from a language school:\n\nLiebe Kursteilnehmer,\nder A2-Kurs am Dienstag findet diese Woche nicht in Raum 12, sondern in Raum 18 statt. Der Unterricht beginnt wie immer um 18:30 Uhr. Bitte bringen Sie das Arbeitsbuch mit.",
        question: "What changed this week?",
        options: ["The course time", "The room", "The teacher", "The book"],
        answer: 1,
        points: 5,
        explanation: "The email says the course takes place in room 18 instead of room 12.",
      },
      {
        id: "a2-mt1-r2",
        section: "reading",
        type: "true-false",
        context:
          "Notice in an apartment building:\n\nDie Heizung wird am Freitag zwischen 9 und 13 Uhr repariert. In dieser Zeit kann es in den Wohnungen kalt sein. Bei Fragen rufen Sie bitte die Hausverwaltung an.",
        question: "True or False: The heating repair is on Friday morning.",
        options: ["True", "False"],
        answer: 0,
        points: 5,
      },
      {
        id: "a2-mt1-r3",
        section: "reading",
        type: "multiple-choice",
        context:
          "Job ad:\n\nWir suchen eine Verkaeuferin oder einen Verkaeufer fuer unsere Baeckerei. Arbeitszeit: Montag bis Freitag, 7:00 bis 13:00 Uhr. Erfahrung im Verkauf ist wuenschenswert, aber nicht notwendig.",
        question: "What does the ad say about experience?",
        options: ["It is required", "It is helpful but not required", "It is not allowed", "It must be two years"],
        answer: 1,
        points: 5,
      },
      {
        id: "a2-mt1-h1",
        section: "listening",
        type: "multiple-choice",
        context:
          "[Listen to the phone message]\n\nHallo Herr Weber, hier ist die Praxis Dr. Klein. Ihr Termin morgen um 10 Uhr muss leider verschoben werden. Koennen Sie am Donnerstag um 15 Uhr kommen? Bitte rufen Sie uns zurueck.",
        question: "When is the suggested new appointment?",
        options: ["Tomorrow at 10:00", "Thursday at 15:00", "Friday at 10:00", "Today at 15:00"],
        answer: 1,
        points: 5,
      },
      {
        id: "a2-mt1-h2",
        section: "listening",
        type: "true-false",
        context:
          "[Listen to the announcement]\n\nDer Zug nach Hamburg hat heute 20 Minuten Verspaetung. Reisende nach Bremen steigen bitte in Gleis 4 um.",
        question: "True or False: The Hamburg train is delayed by 20 minutes.",
        options: ["True", "False"],
        answer: 0,
        points: 5,
      },
      {
        id: "a2-mt1-w1",
        section: "writing",
        type: "essay",
        question:
          "Write a short email to your German teacher. Say you cannot come to class today, explain why, and ask for the homework.",
        answer:
          "Sehr geehrte Frau Schneider, leider kann ich heute nicht zum Unterricht kommen, weil ich krank bin. Koennten Sie mir bitte die Hausaufgaben schicken? Vielen Dank und viele Gruesse",
        points: 15,
        explanation: "A2 writing should answer all bullet points with polite, complete sentences.",
      },
      {
        id: "a2-mt1-s1",
        section: "speaking",
        type: "essay",
        speakerScript:
          "Erzaehlen Sie bitte von Ihrem letzten Wochenende. Was haben Sie gemacht? Mit wem waren Sie zusammen? Hat es Ihnen gefallen?",
        question:
          "Speaking: Talk about your last weekend. Include activities, people, and your opinion.",
        answer:
          "Am letzten Wochenende habe ich Freunde getroffen. Wir sind ins Kino gegangen und danach haben wir in einem Restaurant gegessen. Es hat mir gut gefallen, weil der Film sehr interessant war.",
        points: 15,
      },
    ],
  },
  {
    id: 202,
    title: "TELC A2 Mock Test 2",
    subtitle: "Housing, travel, health, opinions, and A2 exam readiness",
    duration: 3600,
    passMark: 60,
    questions: [
      {
        id: "a2-mt2-r1",
        section: "reading",
        type: "multiple-choice",
        context:
          "Message from a landlord:\n\nGuten Tag Frau Meyer, der Handwerker kommt am Mittwoch zwischen 14 und 16 Uhr, um die Dusche zu reparieren. Bitte seien Sie zu Hause oder geben Sie den Schluessel bei Frau Bauer ab.",
        question: "Why is the worker coming?",
        options: ["To repair the shower", "To paint the kitchen", "To collect rent", "To change the door"],
        answer: 0,
        points: 5,
      },
      {
        id: "a2-mt2-r2",
        section: "reading",
        type: "multiple-choice",
        context:
          "Travel notice:\n\nWegen Bauarbeiten faehrt die Buslinie 12 heute nur bis Marktplatz. Fahrgaeste zum Bahnhof nehmen bitte die Linie 8 oder die S-Bahn.",
        question: "How can passengers get to the station?",
        options: ["Only by taxi", "With line 12", "With line 8 or S-Bahn", "They cannot travel today"],
        answer: 2,
        points: 5,
      },
      {
        id: "a2-mt2-h1",
        section: "listening",
        type: "multiple-choice",
        context:
          "[Listen to the conversation]\n\nPatientin: Guten Tag, ich habe seit zwei Tagen Halsschmerzen und Fieber. Arzt: Nehmen Sie diese Tabletten zweimal am Tag und trinken Sie viel Wasser.",
        question: "How often should the patient take the tablets?",
        options: ["Once a day", "Twice a day", "Three times a day", "Only at night"],
        answer: 1,
        points: 5,
      },
      {
        id: "a2-mt2-h2",
        section: "listening",
        type: "true-false",
        context:
          "[Listen to the voicemail]\n\nHallo Lena, ich kann leider nicht um 18 Uhr kommen. Mein Zug ist spaet. Lass uns bitte um 19 Uhr vor dem Kino treffen.",
        question: "True or False: The meeting is moved to 19:00 at the cinema.",
        options: ["True", "False"],
        answer: 0,
        points: 5,
      },
      {
        id: "a2-mt2-w1",
        section: "writing",
        type: "essay",
        question:
          "Write a message to your neighbor. Say the washing machine is broken, explain when you noticed it, and ask what you should do.",
        answer:
          "Hallo Frau Bauer, die Waschmaschine im Keller ist kaputt. Ich habe es gestern Abend gemerkt. Koennen Sie mir bitte sagen, was ich machen soll? Viele Gruesse",
        points: 15,
      },
      {
        id: "a2-mt2-s1",
        section: "speaking",
        type: "essay",
        speakerScript:
          "Planen Sie mit Ihrer Partnerin einen Ausflug am Wochenende. Sprechen Sie ueber Ort, Zeit, Verkehrsmittel und Essen.",
        question:
          "Speaking role-play: Plan a weekend trip. Mention place, time, transport, and food.",
        answer:
          "Wir koennen am Samstag nach Koeln fahren. Treffen wir uns um 9 Uhr am Bahnhof? Wir fahren mit dem Zug und nehmen Broetchen und Wasser mit.",
        points: 15,
      },
    ],
  },
];
