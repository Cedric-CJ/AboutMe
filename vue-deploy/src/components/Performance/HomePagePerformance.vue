<!-- Erstellt von Cedric – visit my GitHub: https://cedric-cj.github.io/AboutMe/ 
     // Timeline inspiriert von https://github.com/ftes/react-dual-timeline
     // Glitch-Animation inspiriert von https://github.com/adenekan41/codewonders -->
<template>
  <div class="container">
    <section class="intro">
      <h1>{{ titleText }}</h1>
      <img src="@/assets/Pictures/Me.png" alt="Mein Bild" class="intro-image">
    </section>
    <section class="my-skills">
      <h2>{{ skillsTitle }}</h2>
      <div class="skills-cloud">
        <div v-for="(skill, index) in skills" :key="index" class="skill" :style="generateStyle()">
          {{ skill }}
        </div>
      </div>
    </section>
    <h2>{{ timelineTitle }}</h2>
    <div class="timeline">
      <ul>
        <li v-for="(event) in events" :key="event.year">
          <div>
            <time>{{ event.year }}: {{ event.title }}</time>
            <p>{{ event.description }}</p>
          </div>
        </li>
      </ul>
    </div>
    <h2>{{ projectsTitle }}</h2>
    <div class="projects-list">
      <div class="project" v-for="(project, index) in projects" :key="index">
        <h3 class="project-name">{{ project.name }}</h3>
        <p class="project-description">{{ project.description }}</p>
        <div class="project-links">
          <a :href="project.link" target="_blank" class="project-link">
            {{ currentLang === 'en' ? 'Live Website' : 'Live Webseite' }}
          </a>
          <a :href="project.github" target="_blank" class="project-link">
            GitHub Repository
          </a>
        </div>
        <div class="project-tech">
          <span v-for="tech in project.technologies" :key="tech" class="tech-badge">
            {{ tech }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
const currentLang = computed(() => {
  return localStorage.getItem("preferredLanguage") === "eng" ? "en" : "de";
});
const titleText = computed(() =>
    currentLang.value === "en" ? "Hi, I am Cedric" : "Hi, Ich bin Cedric"
);
const skillsTitle = computed(() =>
    currentLang.value === "en" ? "My Skills" : "Meine Fähigkeiten");
const timelineTitle = computed(() =>
    currentLang.value === "en" ? "My Timeline" : "Mein Lebenslauf");
const projectsTitle = computed(() =>
    currentLang.value === "en" ? "My Projects" : "Meine Projekte");
const skills = ref([
  "JavaScript",
  "Vue",
  "Python",
  "HTML",
  "Web Development",
  "CSS",
  "SQL",
  "React",
  "Java",
  "Spring Boot",
  "Docker",
  "PostgreSQL",
  "Oracle",
  "Flutter",
  "Render",
  "Dart",
  "Typescript",
]);

const events_de = [
  { year: 2026, title: "Bachelor of Science - Wirtschaftsinformatik", description: "An der Hochschule für Technik und Wirtschaft Berlin werde ich voraussichtlich 2026 mein Bachelorstudium abschließen." },
  { year: 2024, title: "Praktikum im Bundesministerium für Digitales und Verkehr Abteilung Z33", description: "Im 4. Fachsemester absolvierte ich von Dezember 2024 bis März 2025 ein 3,5-monatiges Fachpraktikum im Bereich Informationstechnik, bei dem der Schwerpunkt auf dem Betrieb von Servern und IT-Infrastruktur im BMDV lag." },
  { year: 2022, title: "Werksstudent bei Kaufland", description: "Kaufland Deutschland. Von Juni 2022 bis August 2024 als Werksstudent tätig." },
  { year: 2022, title: "Abitur", description: "An der Ernst-Haeckel-Schule Berlin. Abschluss mit 2,8er im Mathe-Geschichte Abitur." },
  { year: 2018, title: "Praktikum Finanzamt Marzahn-Hellersdorf", description: "Praktikum beim Finanzamt Marzahn-Hellersdorf, mit Erfahrungen sowohl in Bürotätigkeiten als auch bei Verhandlungen." },
  { year: 2016, title: "Praktikum bei Dr. Albrecht & Plogmaker GbR", description: "Fünf freiwillige Praktika bei der Steuerkanzlei, wo ich tiefe Einblicke in die Steuerberatung erhielt." },
];
const events_en = [
  { year: 2026, title: "Bachelor of Science - Business Informatics", description: "I expect to complete my Bachelor's degree in Business Informatics at the Berlin University of Applied Sciences for Technology and Economics in 2026." },
  { year: 2024, title: "Internship at the Federal Ministry for Digital and Transport, Department Z33", description: "During my 4th semester, I completed a 3.5-month internship from December 2024 to March 2025, focusing on server operations and IT infrastructure at the ministry." },
  { year: 2022, title: "Working Student at Kaufland", description: "Kaufland Germany. Employed as a working student from June 2022 to August 2024." },
  { year: 2022, title: "High School Diploma", description: "Graduated from Ernst-Haeckel-Schule Berlin with an average of 2.8 in Mathematics and History." },
  { year: 2018, title: "Internship at Marzahn-Hellersdorf Tax Office", description: "Internship providing experience in both office work and negotiations." },
  { year: 2016, title: "Internship at Dr. Albrecht & Plogmaker GbR", description: "Five voluntary internships at a tax consultancy provided deep insights into tax consulting." },
];
const events = computed(() =>
    currentLang.value === "en" ? events_en : events_de);
const projects_de = [
  {
    name: "Virtuelles Haustier",
    link: "https://virtual-pet-bcky.onrender.com/",
    github: "https://github.com/Cedric-CJ/virtual-pet",
    technologies: ["Vue", "JavaScript", "HTML", "CSS", "Docker", "Typescript", "SQL-DB", "React", "Post-,Rest-Schnittstelle"],
    description: "Ein Studienprojekt mit Funktionen zur Benutzerregistrierung, Anmeldung und Verwaltung eines virtuellen Haustiers, bei dem der Benutzer zwischen zwei Tieren wählen, ihnen Namen geben und sie füttern, pflegen oder mit ihnen spielen kann. Die Bedürfnisse der Tiere werden über Statusleisten angezeigt, und bei mangelnder Pflege kann das Tier sterben, sodass ein neues erstellt werden muss. Eine Bestenliste zeigt die Top-Tiere an.\n\n*Derzeit leider nicht funktionsfähig, da die Datenbank nicht mehr aktiv ist.*",
  },
  {
    name: "Metallbaumeister Webseite",
    link: "https://mz24.net/",
    github: "https://github.com/Cedric-CJ/MZ24",
    technologies: ["HTML", "CSS", "JavaScript", "Vue"],
    description: "Modernisierung der Webseite meines Vaters mit aktualisierten Datenschutz- und Impressumsseiten, einer dynamischeren Gestaltung und einer verbesserten Galerie mit Bild-Durchschaltung und Vorher-Nachher-Slider für einen modernen Look. Die Seite wurde so konzipiert, dass sie benutzerfreundlicher und optisch ansprechender ist, mit intuitiven Navigationselementen und verbesserter Ladezeit.",
  },
];
const projects_en = [
  {
    name: "Virtual Pet",
    link: "https://virtual-pet-bcky.onrender.com/",
    github: "https://github.com/Cedric-CJ/virtual-pet",
    technologies: ["Vue", "JavaScript", "HTML", "CSS", "Docker", "Typescript", "SQL-DB", "React", "Post-,Rest API"],
    description: "A study project featuring user registration, login, and management of a virtual pet. Users can choose between two pets, name them, feed, care for, or play with them. The pet's needs are displayed with status bars, and lack of care can result in the pet's death, requiring a new one to be created. A leaderboard displays the top pets.\n\n*Currently non-functional as the database is no longer active.*",
  },
  {
    name: "Metal Constructor Website",
    link: "https://mz24.net/",
    github: "https://github.com/Cedric-CJ/MZ24",
    technologies: ["HTML", "CSS", "JavaScript", "Vue"],
    description: "Modernization of my father's website with updated privacy and imprint pages, a more dynamic design, and an improved gallery featuring image transitions and a before-after slider for a modern look. The site is designed to be user-friendly and visually appealing with intuitive navigation and enhanced loading times.",
  },
];
const projects = computed(() =>
    currentLang.value === "en" ? projects_en : projects_de);
function generateStyle() {
  const safeZoneX = Math.random() * 70;
  const safeZoneY = Math.random() * 40 + 5;
  const randomZ = Math.random() * 50 - 25;
  const randomSize = Math.random() * 2 + 2;
  const randomColor = Math.random() > 0.5 ? "var(--primary-color)" : "var(--text-color)";
  const animationDuration = Math.random() * 12 + 5;
  const animationDelay = Math.random() * 5;
  const keyframesName = `float-${Math.random().toString(36).slice(2, 7)}`;
  const keyframes = `
    @keyframes ${keyframesName} {
      0% {
        transform: translate3d(${safeZoneX}vw, ${safeZoneY}vh, ${randomZ}px) scale(${randomSize});
        opacity: 0;
      }
      10% {
        opacity: 1;
      }
      25% {
        transform: translate3d(${safeZoneX + Math.random() * 5 - 2.5}vw, ${safeZoneY + Math.random() * 5 - 2.5}vh, ${randomZ + Math.random() * 10 - 5}px);
      }
      50% {
        transform: translate3d(${safeZoneX - Math.random() * 5 + 2.5}vw, ${safeZoneY - Math.random() * 5 + 2.5}vh, ${randomZ - Math.random() * 10 + 5}px);
      }
      75% {
        transform: translate3d(${safeZoneX + Math.random() * 2.5 - 1.25}vw, ${safeZoneY + Math.random() * 2.5 - 1.25}vh, ${randomZ + Math.random() * 5 - 2.5}px);
      }
      100% {
        transform: translate3d(${safeZoneX}vw, ${safeZoneY}vh, ${randomZ}px);
        opacity: 0;
      }
    }
  `;
  const styleSheet = document.styleSheets[0] || document.head.appendChild(document.createElement("style")).sheet;
  styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
  return {
    animation: `${keyframesName} ${animationDuration}s infinite ease-in-out ${animationDelay}s`,
    color: randomColor,
    opacity: 0,
    zIndex: Math.round(randomZ),
  };
}
onMounted(() => {
  const targets = document.querySelectorAll(".timeline ul li");
  const threshold = 0.5;
  const ANIMATED_CLASS = "in-view";
  const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
      const elem = entry.target;
      if (entry.intersectionRatio >= threshold) {
        elem.classList.add(ANIMATED_CLASS);
        observer.unobserve(elem);
      } else {
        elem.classList.remove(ANIMATED_CLASS);
      }
    });
  };
  const observer = new IntersectionObserver(observerCallback, { threshold });
  targets.forEach(target => observer.observe(target));

  // Parallax-Effekt für den Hexagon-Hintergrund
  const hexagonBackground = document.querySelector(".hexagon-background");
  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    hexagonBackground.style.transform = `translateY(${-scrollPosition * 0.5}px)`;
  };
  window.addEventListener("scroll", handleScroll);

  onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);
  });
});
</script>
<style scoped>
.project {
  transition: transform 0.3s ease;
  transform-origin: center center;
  position: relative;
  overflow: visible;
}
.project-links {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}
.project-links a {
  background-color: var(--primary-color);
  color: var(--text-color);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
}
.project-links a:hover {
  background-color: rgba(0,0,0,0.2);
  color: var(--text-color);
}
.project-tech {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.tech-badge {
  background-color: var(--card-background-color);
  color: var(--text-color);
  padding: 0.4rem 0.8rem;
  border-radius: 5px;
  font-size: 0.85rem;
  line-height: 1.4;
  font-weight: 500;
  transition: background-color 0.3s ease;
}
.tech-badge:hover {
  background-color: var(--primary-color);
  color: #fff;
}
.project-description {
  margin-bottom: 1rem;
  line-height: 1.5;
}
</style>