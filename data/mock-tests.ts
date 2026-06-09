export interface MockQuestion {
  id: string;
  section: "reading" | "listening" | "writing" | "speaking";
  type: "multiple-choice" | "true-false" | "fill-blank" | "essay";
  question: string;
  context?: string; // reading passage or scenario
  options?: string[];
  answer: string | number;
  points: number;
  speakerScript?: string;
  explanation?: string;
}

export interface MockTest {
  id: number;
  title: string;
  subtitle: string;
  duration: number; // seconds
  passMark: number; // percentage
  questions: MockQuestion[];
}

export const mockTests: MockTest[] = [
  {
    id: 1,
    title: "Telc A1 Mock Test 1",
    subtitle: "Full exam simulation — 60 minutes",
    duration: 3600,
    passMark: 60,
    questions: [
      // === READING (Lesen) ===
      {
        id: "mt1-r1",
        section: "reading",
        type: "multiple-choice",
        context:
          "Notice on a shop door:\n\n🏪 GEÖFFNET\nMontag – Freitag: 9:00 – 18:00 Uhr\nSamstag: 10:00 – 14:00 Uhr\nSonntag: GESCHLOSSEN",
        question: "The shop is open on Saturday until...",
        options: ["6:00 PM", "2:00 PM", "12:00 PM", "The shop is closed on Saturday"],
        answer: 1,
        points: 5,
        explanation: "Samstag: 10:00–14:00 Uhr = open until 2 PM.",
      },
      {
        id: "mt1-r2",
        section: "reading",
        type: "true-false",
        context:
          "Text message:\n\n'Hallo! Ich bin um 15 Uhr am Bahnhof. Der Zug kommt 10 Minuten später. Bis dann! — Maria'",
        question: "True or False: Maria arrives at the station at 3 PM and the train arrives at 3:10 PM.",
        options: ["True", "False"],
        answer: 0,
        points: 5,
        explanation: "15 Uhr = 3 PM; 10 Minuten später = 10 minutes later = 3:10 PM.",
      },
      {
        id: "mt1-r3",
        section: "reading",
        type: "multiple-choice",
        context:
          "From a form:\n\nName: Müller\nVorname: Hans\nGeburtsdatum: 15.03.1985\nNationalität: Deutsch\nBeruf: Ingenieur",
        question: "What is Hans Müller's profession?",
        options: ["Teacher", "Doctor", "Engineer", "Student"],
        answer: 2,
        points: 5,
        explanation: "Beruf = profession; Ingenieur = engineer.",
      },
      {
        id: "mt1-r4",
        section: "reading",
        type: "multiple-choice",
        context:
          "Email:\n\nBetreff: Treffen morgen\n\nHallo Petra!\nKann ich morgen um 10 Uhr zu dir kommen? Ich bringe Kaffee mit. \nBis morgen,\nSarah",
        question: "What does Sarah want to do tomorrow?",
        options: [
          "Go to a café with Petra",
          "Visit Petra at 10 AM and bring coffee",
          "Call Petra at 10 AM",
          "Buy coffee from Petra",
        ],
        answer: 1,
        points: 5,
        explanation: "'zu dir kommen' = come to your place; 'bringe Kaffee mit' = bring coffee.",
      },
      {
        id: "mt1-r5",
        section: "reading",
        type: "multiple-choice",
        context:
          "Sign in a restaurant:\n\n🍽️ Heute Mittagsmenü:\nSuppe + Hauptgericht + Getränk = 9,50 €\n(Nur von 12:00 – 14:00 Uhr)",
        question: "The lunch menu is available...",
        options: [
          "All day for €9.50",
          "Between 12:00 and 14:00 for €9.50",
          "Only for drinks between 12 and 2",
          "On weekends only",
        ],
        answer: 1,
        points: 5,
      },
      {
        id: "mt1-r6",
        section: "reading",
        type: "true-false",
        context:
          "Notice on apartment door:\n\n'Liebe Nachbarn, wir renovieren unsere Küche.\nAb Montag, für ca. 2 Wochen.\nEs kann manchmal laut sein. Entschuldigung!\n— Familie Becker'",
        question: "True or False: The Becker family is moving out.",
        options: ["True", "False"],
        answer: 1,
        points: 5,
        explanation: "They are renovating ('renovieren') their kitchen, not moving out.",
      },
      {
        id: "mt1-r7",
        section: "reading",
        type: "multiple-choice",
        context:
          "Classified ad:\n\nVerkaufe Fahrrad. Farbe: Rot. Gut in Ordnung. Preis: 80 Euro. Tel: 0176-123456\n— Klaus",
        question: "What color is the bicycle for sale?",
        options: ["Blue", "Green", "Red", "Black"],
        answer: 2,
        points: 5,
      },

      // === LISTENING (Hören) — simulated with transcripts ===
      {
        id: "mt1-h1",
        section: "listening",
        type: "multiple-choice",
        context:
          "🎧 [Listen to the announcement]\n\n'Achtung! Zug 142 nach Frankfurt kommt mit 15 Minuten Verspätung. Bitte warten Sie auf Gleis 3.'",
        question: "Train 142 is delayed by how many minutes?",
        options: ["5 minutes", "10 minutes", "15 minutes", "20 minutes"],
        answer: 2,
        points: 5,
      },
      {
        id: "mt1-h2",
        section: "listening",
        type: "multiple-choice",
        context:
          "🎧 [Listen to the conversation]\n\nAnna: 'Wo wohnst du jetzt?'\nTom: 'Ich wohne in Berlin, in der Nähe vom Bahnhof. Und du?'\nAnna: 'Ich bin noch in München.'",
        question: "Where does Tom live?",
        options: ["Munich", "Hamburg", "Berlin", "Frankfurt"],
        answer: 2,
        points: 5,
      },
      {
        id: "mt1-h3",
        section: "listening",
        type: "true-false",
        context:
          "🎧 [Voicemail message]\n\n'Hallo, hier ist Dr. Schneider. Ihr Termin ist am Dienstag um halb drei. Bitte rufen Sie zurück, wenn Sie nicht kommen können.'",
        question: "True or False: The appointment is at 3:30 PM on Tuesday.",
        options: ["True", "False"],
        answer: 1,
        points: 5,
        explanation: "'Halb drei' = 2:30 PM, not 3:30 PM. (Half to three = 2:30)",
      },
      {
        id: "mt1-h4",
        section: "listening",
        type: "multiple-choice",
        context:
          "🎧 [Shop conversation]\n\nKunde: 'Ich suche eine Hose in Größe 38.'\nVerkäufer: 'Wir haben nur noch Größe 40 in Blau.'\nKunde: 'Haben Sie auch Schwarz?'\nVerkäufer: 'In Schwarz leider nicht mehr.'",
        question: "What size does the customer want?",
        options: ["36", "38", "40", "42"],
        answer: 1,
        points: 5,
      },
      {
        id: "mt1-h5",
        section: "listening",
        type: "multiple-choice",
        context:
          "🎧 [Weather forecast]\n\n'Guten Morgen! Heute wird es sonnig und warm, circa 24 Grad. Am Nachmittag sind leichte Wolken möglich. Kein Regen.'",
        question: "What is today's expected temperature?",
        options: ["18°C", "20°C", "24°C", "28°C"],
        answer: 2,
        points: 5,
      },
      {
        id: "mt1-h6",
        section: "listening",
        type: "true-false",
        context:
          "🎧 [Conversation at a café]\n\nKellnerin: 'Was darf es sein?'\nGast: 'Einen Kaffee und ein Stück Kuchen, bitte.'\nKellnerin: 'Mit Milch?'\nGast: 'Ja, bitte.'",
        question: "True or False: The guest orders coffee with milk and a piece of cake.",
        options: ["True", "False"],
        answer: 0,
        points: 5,
      },

      // === WRITING (Schreiben) ===
      {
        id: "mt1-w1",
        section: "writing",
        type: "fill-blank",
        question:
          "Fill in the registration form. You are: Name=Schmidt, First name=Julia, Date of birth=10.05.1995, Country=England, Phone=+44 7911 123456\n\nName: ___\nVorname: ___\nGeburtsdatum: ___\nLand: ___\nTelefon: ___",
        answer: "Schmidt | Julia | 10.05.1995 | England | +44 7911 123456",
        points: 10,
        explanation: "Form filling is a core Telc A1 writing task.",
      },
      {
        id: "mt1-w2",
        section: "writing",
        type: "essay",
        question:
          "Write a short message to your friend (30–40 words). Tell them:\n• You cannot come to the meeting tonight\n• Explain why (you are sick / have a doctor's appointment)\n• Suggest a new time to meet",
        answer:
          "Hallo! Leider kann ich heute Abend nicht kommen. Ich bin krank und habe einen Arzttermin. Können wir uns morgen um 15 Uhr treffen? Bis dann!",
        points: 15,
        explanation:
          "Model answer. Key elements: apology, reason, alternative time. Grammar and vocabulary count.",
      },

      // === SPEAKING (Sprechen) ===
      {
        id: "mt1-s1",
        section: "speaking",
        type: "essay",
        speakerScript: "Hallo! Willkommen zum Sprechteil. Bitte stellen Sie sich vor. Sagen Sie mir: Wie heißen Sie? Woher kommen Sie? Wo wohnen Sie jetzt? Was machen Sie beruflich? Und was sind Ihre Hobbys?",
        question:
          "🎤 SPEAKING TASK 1: Introduce yourself.\n\nTell the examiner:\n• Your name\n• Where you come from\n• Where you live now\n• Your job or what you study\n• One hobby",
        answer:
          "Ich heiße [Name]. Ich komme aus [Land]. Ich wohne jetzt in [Stadt]. Ich bin [Beruf/Student]. In meiner Freizeit [Hobby] ich gern.",
        points: 10,
        explanation: "Speak for about 1 minute. Use complete sentences.",
      },
      {
        id: "mt1-s2",
        section: "speaking",
        type: "multiple-choice",
        speakerScript: "Wo kaufen Sie normalerweise Lebensmittel?",
        context:
          "🎤 SPEAKING TASK 2 — Choose the correct response.\n\nExaminer says: 'Wo kaufen Sie normalerweise Lebensmittel?'",
        question: "Which is the most appropriate answer?",
        options: [
          "Ich wohne in Berlin.",
          "Ich kaufe normalerweise im Supermarkt.",
          "Ich esse gern Pizza.",
          "Der Zug fährt um 9 Uhr ab.",
        ],
        answer: 1,
        points: 5,
        explanation: "The question asks where you normally buy groceries — the supermarket answer is correct.",
      },
    ],
  },
  {
    id: 2,
    title: "Telc A1 Mock Test 2",
    subtitle: "Focus on everyday situations",
    duration: 3600,
    passMark: 60,
    questions: [
      {
        id: "mt2-r1",
        section: "reading",
        type: "multiple-choice",
        context:
          "Sign at a pool:\n\n🏊 Schwimmbad Regeln\n• Kein Essen im Wasser!\n• Kinder unter 12 Jahren nur mit Erwachsenen\n• Öffnungszeiten: täglich 7:00 – 21:00 Uhr",
        question: "Children under 12 may use the pool...",
        options: [
          "Without restrictions",
          "Only on weekends",
          "Only with an adult",
          "Only between 7-12 AM",
        ],
        answer: 2,
        points: 5,
      },
      {
        id: "mt2-r2",
        section: "reading",
        type: "true-false",
        context:
          "Postcard:\n\n'Liebe Oma! Wir sind jetzt in Wien. Das Wetter ist sehr schön. Wir essen viel Kuchen! Wir kommen am Freitag zurück. Viele Grüße, Anna und Peter'",
        question: "True or False: Anna and Peter will return home on Friday.",
        options: ["True", "False"],
        answer: 0,
        points: 5,
      },
      {
        id: "mt2-r3",
        section: "reading",
        type: "multiple-choice",
        context:
          "Job advertisement:\n\nWir suchen eine Köchin / einen Koch\nArbeitszeit: Mo–Fr, 8–16 Uhr\nErfahrung: mindestens 2 Jahre\nBewerbungen an: jobs@restaurant-europa.de",
        question: "What experience is required for this job?",
        options: [
          "No experience necessary",
          "At least 1 year",
          "At least 2 years",
          "At least 5 years",
        ],
        answer: 2,
        points: 5,
      },
      {
        id: "mt2-r4",
        section: "reading",
        type: "multiple-choice",
        context:
          "Bus timetable:\n\nLinie 42: Marktplatz → Bahnhof\n10:15 — 10:30 — 10:45 — 11:00\nFahrtzeit: ca. 12 Minuten",
        question: "If you take the 10:30 bus, when do you approximately arrive at the station?",
        options: ["10:40", "10:42", "10:45", "11:00"],
        answer: 1,
        points: 5,
        explanation: "10:30 + 12 minutes = 10:42.",
      },
      {
        id: "mt2-r5",
        section: "reading",
        type: "true-false",
        context:
          "Notice:\n\n'Liebe Mieter,\nDie Waschmaschine im Keller ist kaputt. Reparatur: voraussichtlich nächste Woche.\nEntschuldigung für die Unannehmlichkeiten!\n— Die Hausverwaltung'",
        question: "True or False: The washing machine will be repaired today.",
        options: ["True", "False"],
        answer: 1,
        explanation: "'Voraussichtlich nächste Woche' = expected next week, not today.",
        points: 5,
      },
      {
        id: "mt2-h1",
        section: "listening",
        type: "multiple-choice",
        context:
          "🎧 [Phone conversation]\n\nReception: 'Hotel Adler, guten Tag!'\nGuest: 'Guten Tag. Ich möchte ein Zimmer für zwei Personen, für drei Nächte.'\nReception: 'Von wann bis wann?'\nGuest: 'Vom 15. bis 18. Juli, bitte.'",
        question: "How long does the guest want to stay?",
        options: ["2 nights", "3 nights", "4 nights", "5 nights"],
        answer: 1,
        points: 5,
      },
      {
        id: "mt2-h2",
        section: "listening",
        type: "true-false",
        context:
          "🎧 [Radio announcement]\n\n'Achtung Autofahrer! Auf der A9 Richtung München gibt es einen Stau. Bitte nehmen Sie die Umleitung über die B11. Danke!'",
        question: "True or False: There is a traffic jam on the way to Munich.",
        options: ["True", "False"],
        answer: 0,
        points: 5,
      },
      {
        id: "mt2-h3",
        section: "listening",
        type: "multiple-choice",
        context:
          "🎧 [Conversation between friends]\n\nKlaus: 'Was machst du heute Abend?'\nLisa: 'Ich gehe ins Kino. Der neue Film mit Julia Roberts läuft.'\nKlaus: 'Interessant! Wann fängt er an?'\nLisa: 'Um 20 Uhr.'",
        question: "What is Lisa doing tonight?",
        options: ["Going to a restaurant", "Watching TV at home", "Going to the cinema", "Meeting Klaus"],
        answer: 2,
        points: 5,
      },
      {
        id: "mt2-h4",
        section: "listening",
        type: "multiple-choice",
        context:
          "🎧 [Supermarket announcement]\n\n'Liebe Kunden! Heute haben wir frische Erdbeeren im Angebot: 500g für nur 1,99 Euro! Das Angebot gilt nur heute.'",
        question: "What is on sale today?",
        options: ["Apples", "Bananas", "Strawberries", "Oranges"],
        answer: 2,
        points: 5,
      },
      {
        id: "mt2-w1",
        section: "writing",
        type: "fill-blank",
        question:
          "Complete this message with the correct words from the box:\n[morgen / leider / danke / komme / Uhr]\n\n'Hallo Ben! ___ kann ich nicht kommen. Ich ___ ___  um 15 ___ . Ist das okay? ___!'",
        answer: "Leider / komme / morgen / Uhr / Danke",
        points: 10,
      },
      {
        id: "mt2-w2",
        section: "writing",
        type: "essay",
        question:
          "Write a short note to your neighbor (30-40 words). Tell them:\n• You found their keys\n• Where you found them (in front of the door / vor der Tür)\n• They can come to collect them (abholen)",
        answer:
          "Hallo! Ich habe Ihren Schlüssel gefunden. Er lag vor der Tür. Sie können ihn bei mir abholen. Ich bin heute Abend zu Hause. Viele Grüße!",
        points: 15,
      },
      {
        id: "mt2-s1",
        section: "speaking",
        type: "essay",
        speakerScript: "Erzählen Sie mir von Ihrem Tagesablauf. Wann stehen Sie auf? Was essen Sie zum Frühstück? Wie kommen Sie zur Arbeit oder zur Schule? Und was machen Sie am Abend?",
        question:
          "🎤 SPEAKING: Your partner asks you about your daily routine.\n\nAnswer these questions in complete sentences:\n• Wann stehen Sie auf?\n• Was essen Sie zum Frühstück?\n• Wie kommen Sie zur Arbeit / zur Schule?\n• Was machen Sie am Abend?",
        answer:
          "Ich stehe um 7 Uhr auf. Zum Frühstück esse ich Toast und trinke Kaffee. Ich fahre mit dem Bus zur Arbeit. Am Abend lese ich ein Buch oder sehe fern.",
        points: 15,
      },
    ],
  },
  {
    id: 3,
    title: "Telc A1 Mock Test 3",
    subtitle: "Advanced A1 — exam-ready challenge",
    duration: 3600,
    passMark: 65,
    questions: [
      {
        id: "mt3-r1",
        section: "reading",
        type: "multiple-choice",
        context:
          "Hotel notice:\n\n🏨 Information für unsere Gäste\n• Frühstück: 7:00 – 10:00 Uhr (Zimmer 1–20: Saal A; Zimmer 21–40: Saal B)\n• Check-out: bis 12:00 Uhr\n• Parkplatz: kostenfrei für Hotelgäste",
        question: "Guests in room 35 should have breakfast in...",
        options: ["Saal A", "Saal B", "Their room", "The lobby"],
        answer: 1,
        points: 5,
      },
      {
        id: "mt3-r2",
        section: "reading",
        type: "true-false",
        context:
          "Notice in a library:\n\n'Bücher können für 3 Wochen ausgeliehen werden. Mit Studentenausweis: kostenlos. Ohne Studentenausweis: 2 Euro pro Buch. Rückgabe bitte rechtzeitig!'",
        question: "True or False: Students can borrow books for free.",
        options: ["True", "False"],
        answer: 0,
        points: 5,
      },
      {
        id: "mt3-r3",
        section: "reading",
        type: "multiple-choice",
        context:
          "Advertisement:\n\nSprachkurs Deutsch für Anfänger\nKursstart: 1. September\nKurszeiten: Di + Do, 18:00 – 20:00 Uhr\nKursgebühr: 150 Euro (inkl. Lernmaterial)\nAnmeldung: info@sprachschule-berlin.de",
        question: "How many times per week does the course meet?",
        options: ["Once", "Twice", "Three times", "Every day"],
        answer: 1,
        points: 5,
        explanation: "Tuesday (Di) and Thursday (Do) = twice a week.",
      },
      {
        id: "mt3-r4",
        section: "reading",
        type: "multiple-choice",
        context:
          "SMS:\n\n'Hi! Ich bin jetzt beim Arzt. Muss noch ca. 30 Min warten. Können wir uns um 17 Uhr treffen statt um 16:30? LG, Julia'",
        question: "Julia wants to meet...",
        options: [
          "At 4:30 PM as planned",
          "At 5:00 PM instead of 4:30 PM",
          "At the doctor's office",
          "Tomorrow",
        ],
        answer: 1,
        points: 5,
      },
      {
        id: "mt3-r5",
        section: "reading",
        type: "true-false",
        context:
          "Recipe card:\n\nSchokoladenkuchen (für 8 Personen)\nZutaten: 200g Mehl, 100g Zucker, 3 Eier, 150g Butter, 100g Schokolade\nBack-Temperatur: 180°C, ca. 35 Minuten",
        question: "True or False: The chocolate cake recipe is for 4 people.",
        options: ["True", "False"],
        answer: 1,
        explanation: "The recipe says 'für 8 Personen' = for 8 people.",
        points: 5,
      },
      {
        id: "mt3-h1",
        section: "listening",
        type: "multiple-choice",
        context:
          "🎧 [Airport announcement]\n\n'Guten Tag. Flug LH 456 nach London Heathrow: Boarding beginnt jetzt an Gate B12. Passagiere mit Kindern können zuerst einsteigen.'",
        question: "Which passengers may board first?",
        options: ["Business class", "Senior citizens", "Passengers with children", "All passengers"],
        answer: 2,
        points: 5,
      },
      {
        id: "mt3-h2",
        section: "listening",
        type: "true-false",
        context:
          "🎧 [Conversation]\n\nHans: 'Guten Morgen, Frau Weber! Haben Sie heute Zeit für ein Meeting?'\nFrau Weber: 'Guten Morgen, Herr Schmidt! Leider nicht heute — ich habe den ganzen Tag Termine. Morgen früh, vielleicht?'\nHans: 'Ja, 9 Uhr?'\nFrau Weber: 'Perfekt!'",
        question: "True or False: They will meet today at 9 AM.",
        options: ["True", "False"],
        answer: 1,
        explanation: "Frau Weber said 'nicht heute' (not today). They agree on tomorrow at 9 AM.",
        points: 5,
      },
      {
        id: "mt3-h3",
        section: "listening",
        type: "multiple-choice",
        context:
          "🎧 [Phone message]\n\n'Hallo Markus! Hier ist deine Schwester. Mama hat heute Geburtstag — vergiss nicht! Wir treffen uns um 19 Uhr bei Mama zu Hause. Bitte bring etwas Wein mit. Tschüss!'",
        question: "What should Markus bring?",
        options: ["Cake", "Flowers", "Wine", "Nothing"],
        answer: 2,
        points: 5,
      },
      {
        id: "mt3-h4",
        section: "listening",
        type: "multiple-choice",
        context:
          "🎧 [Conversation at the market]\n\nVerkäufer: 'Guten Morgen! Was hätten Sie gern?'\nKunde: 'Ein Kilo Tomaten und eine halbe Kilo Zwiebeln, bitte.'\nVerkäufer: 'Das macht 3 Euro 20.'\nKunde: 'Hier sind 5 Euro.'\nVerkäufer: 'Und 1 Euro 80 zurück.'",
        question: "How much change does the customer receive?",
        options: ["€0.80", "€1.20", "€1.80", "€2.00"],
        answer: 2,
        points: 5,
      },
      {
        id: "mt3-w1",
        section: "writing",
        type: "fill-blank",
        question:
          "Fill in the registration form for a gym membership:\n\nYou are: Michael Brown, born 22.08.1990, British, living at: Hauptstraße 15, 10115 Berlin\n\nName: ___\nVorname: ___\nGeburtsdatum: ___\nStaatsangehörigkeit: ___\nAdresse: ___",
        answer: "Brown | Michael | 22.08.1990 | Britisch | Hauptstraße 15, 10115 Berlin",
        points: 10,
      },
      {
        id: "mt3-w2",
        section: "writing",
        type: "essay",
        question:
          "Write a short message to your German language school (30-40 words). Tell them:\n• You want to register for the A1 course (Kurs anmelden)\n• When the course starts (1st September)\n• Your contact details (name, email, phone)",
        answer:
          "Sehr geehrte Damen und Herren,\nich möchte mich für den A1-Kurs anmelden, der am 1. September beginnt. Mein Name ist [Name], E-Mail: [email], Tel: [Telefon]. Mit freundlichen Grüßen!",
        points: 15,
      },
      {
        id: "mt3-s1",
        section: "speaking",
        type: "essay",
        speakerScript: "Jetzt machen wir ein Rollenspiel. Sie sind am Bahnhof. Ich bin der Angestellte. Bitte fragen Sie nach: einer Fahrkarte nach Hamburg, ob einfach oder hin-und-zurück, dem Preis, der Abfahrtszeit, und dem Gleis.",
        question:
          "🎤 SPEAKING TASK: Role play — You are at the train station.\n\nAsk for:\n1. A ticket to Hamburg\n2. One way or return — you want one way (einfach)\n3. The price\n4. The departure time\n5. The platform number",
        answer:
          "Einmal Hamburg, bitte. Einfach. Was kostet das? Wann fährt der Zug? Und auf welchem Gleis?",
        points: 15,
        explanation: "Use polite 'Sie' form. Speak clearly and in complete sentences where possible.",
      },
    ],
  },
];
