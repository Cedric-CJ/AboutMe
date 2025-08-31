/* Frontend-only mock data for the portfolio. Replace with backend integration later. */

export const profile = {
  name: "Cedric Arnhold",
  tagline: "Wirtschaftsinformatik-Student – Data, Web & Infrastruktur",
  location: "Berlin, Deutschland",
  email: "cedric@example.com",
  social: {
    github: "https://github.com/cedric",
    linkedin: "https://www.linkedin.com/in/cedric/",
    x: "https://x.com/cedric"
  }
};

export const timeline = [
  {
    year: "2026",
    title: "Bachelor of Science – Wirtschaftsinformatik",
    org: "HTW Berlin",
    detail: "Voraussichtlicher Abschluss 2026.",
  },
  {
    year: "2024",
    title: "Praktikum – Bundesministerium für Digitales und Verkehr (Z33)",
    org: "BMDV",
    detail: "IT-Betrieb, Server und Infrastruktur (12/2024 – 03/2025).",
  },
  {
    year: "2022–2024",
    title: "Werkstudent",
    org: "Kaufland Deutschland",
    detail: "Von 06/2022 bis 08/2024 als Werkstudent tätig.",
  },
  {
    year: "2022",
    title: "Abitur",
    org: "Ernst-Haeckel-Schule Berlin",
    detail: "Mathe/Geschichte Abitur mit 2,8.",
  },
  {
    year: "2018",
    title: "Praktikum",
    org: "Finanzamt Marzahn-Hellersdorf",
    detail: "Einblicke in Büro- und Verhandlungstätigkeiten.",
  },
  {
    year: "2016",
    title: "Praktikum",
    org: "Dr. Albrecht &amp; Plogmaker GbR",
    detail: "Fünf freiwillige Praktika in Steuerberatung, vertiefte Einblicke.",
  },
];

export const skills = [
  {
    category: "Sprachen/Technologien",
    items: [
      "JavaScript", "TypeScript", "Python", "SQL", "HTML", "CSS", "Dart"
    ]
  },
  {
    category: "Frameworks &amp; Tools",
    items: [
      "Vue", "React", "Spring Boot", "Java", "Flutter", "Docker"
    ]
  },
  {
    category: "Datenbanken/Hosting",
    items: ["PostgreSQL", "Oracle", "Render", "SQL-DB"]
  }
];

export const projects = [
  {
    id: "virtual-pet",
    title: "Virtuelles Haustier",
    description: "Studienprojekt: Registrierung/Anmeldung, Tierwahl, Pflege, Statusleisten, Bestenliste.",
    overview: "Benutzer wählen zwischen zwei Tieren, benennen sie und interagieren (füttern, pflegen, spielen). Schlechte Pflege führt zum Ableben – dann neues Tier.",
    status: "Derzeit nicht funktionsfähig (DB offline).",
    tech: ["Vue", "JavaScript", "HTML", "CSS", "Docker", "TypeScript", "SQL", "React", "REST"],
    links: { live: "#", repo: "#" },
    highlights: [
      "Auth-Flows mit Session Handling (Mock)",
      "Spiel-Loop mit Zeit-basierten Needs",
      "Leaderboards &amp; Entity-Modelle"
    ]
  },
  {
    id: "metallbaumeister",
    title: "Metallbaumeister Webseite",
    description: "Modernisierte Website mit DSGVO-Seiten, dynamischer Galerie und Vorher-Nachher-Slider.",
    overview: "Neues Erscheinungsbild, intuitive Navigation, verbesserte Ladezeiten und Bilddarstellung.",
    status: "Live",
    tech: ["HTML", "CSS", "JavaScript", "Vue"],
    links: { live: "#", repo: "#" },
    highlights: [
      "Bild-Durchschaltung &amp; Vorher-Nachher",
      "Impressum/Datenschutz nach aktuellem Stand",
      "Performante, schlichte Umsetzung"
    ]
  }
];

export const gallery = [
  { id: "g1", title: "Projekt-Shot A" },
  { id: "g2", title: "Projekt-Shot B" },
  { id: "g3", title: "Projekt-Shot C" },
  { id: "g4", title: "Projekt-Shot D" },
  { id: "g5", title: "Projekt-Shot E" },
  { id: "g6", title: "Projekt-Shot F" }
];

export const blogPosts = [
  { id: "b1", title: "Was ich aus meinem Praktikum im BMDV gelernt habe", tag: "Praxis", excerpt: "Serverbetrieb, Monitoring, Verantwortung – mein Recap." },
  { id: "b2", title: "Vue vs. React – wann nutze ich was?", tag: "Frontend", excerpt: "Kurzvergleich aus Studentenperspektive." },
  { id: "b3", title: "SQL-Tipps für kleine Projekte", tag: "Daten", excerpt: "Indexe, Joins, und Lesbarkeit." }
];

export const contactPreset = {
  topics: [
    { value: "projekt", label: "Projektanfrage" },
    { value: "werkstudent", label: "Werkstudent/Praktikum" },
    { value: "sonstiges", label: "Sonstiges" }
  ]
};