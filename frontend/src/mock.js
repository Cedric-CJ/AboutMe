/* Frontend-only mock data for the portfolio. Replace with backend integration later. */

export const profile = {
  name: "Max Mustermann",
  tagline: "Wirtschaftsinformatik-Student mit Fokus auf Data, AI & Web",
  location: "Berlin, Deutschland",
  email: "max.mustermann@example.com",
  social: {
    github: "https://github.com/example",
    linkedin: "https://www.linkedin.com/in/example/",
    x: "https://x.com/example"
  }
};

export const projects = [
  {
    id: "p1",
    title: "KI-gestütztes Studienplan-Tool",
    description: "Web-App, die mit Embeddings Module empfiehlt und einen Wochenplan generiert.",
    tags: ["React", "FastAPI", "Python", "LLM"],
    link: "#",
  },
  {
    id: "p2",
    title: "Data Warehouse Mini-Stack",
    description: "ETL-Pipeline von CSV zu MongoDB mit Visualisierung im Dashboard.",
    tags: ["MongoDB", "Pandas", "Tailwind", "Charts"],
    link: "#",
  },
  {
    id: "p3",
    title: "Serverless Kostenmonitor",
    description: "Batch-Skripte und UI zur Kostenüberwachung studentischer Cloud-Accounts.",
    tags: ["Node", "AWS", "FinOps"],
    link: "#",
  }
];

export const skills = [
  {
    category: "Sprachen",
    items: ["Python", "JavaScript/TypeScript", "SQL", "R Basics"]
  },
  {
    category: "Frameworks",
    items: ["React", "FastAPI", "TailwindCSS", "Pandas", "NumPy"]
  },
  {
    category: "Themen",
    items: ["Datenmodellierung", "ETL", "LLM Basics", "Web-Architektur", "Testing"]
  }
];

export const experience = [
  {
    id: "e1",
    role: "Werkstudent Data Engineering",
    company: "Tech GmbH",
    start: "04/2024",
    end: "aktuell",
    bullets: [
      "Aufbau kleiner ETL-Jobs (CSV → MongoDB)",
      "Dashboards mit Kennzahlen für das Controlling",
      "Kostentransparenz in Cloud-Sandbox"
    ]
  },
  {
    id: "e2",
    role: "Tutor – Programmieren",
    company: "Hochschule",
    start: "10/2023",
    end: "03/2024",
    bullets: [
      "Begleitung von Übungsgruppen in Python",
      "Code Reviews und Best Practices",
      "Einführung in Git-Workflows"
    ]
  }
];

export const contactPreset = {
  topics: [
    { value: "projekt", label: "Projektanfrage" },
    { value: "werkstudent", label: "Werkstudent/Praktikum" },
    { value: "sonstiges", label: "Sonstiges" }
  ]
};