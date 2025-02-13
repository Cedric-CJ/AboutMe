### Erstellt von Cedric visit my [GitHub](https://cedric-cj.github.io/AboutMe/)
//Timeline inspiriert von https://github.com/ftes/react-dual-timeline
//Glich-Animation inspiriert von https://github.com/adenekan41/codewonders
<template>
  <div class="hexagon-background">
    <div v-for="n in 200" :key="n" class="hexagon"></div>
  </div>
  <div class="container">
    <section class="intro">
      <h1 data-text="Hi, Ich bin Cedric">Hi, Ich bin Cedric</h1>
      <p class="info">
        Diese Webseite habe ich als persönliches Hobby gestaltet, um meine Leidenschaft für Webentwicklung und Digitalisierung auszuleben. Sie dient gleichzeitig als Inspirationsquelle für Unternehmen oder Privatpersonen, die ihre eigene Online-Präsenz modernisieren oder neu aufbauen möchten.
        <br><br>
        Wenn Sie Unterstützung bei der Gestaltung oder Optimierung Ihrer Webseite benötigen, können Sie sich gerne bei mir melden. Ich helfe Ihnen, Ihre Ideen umzusetzen und Ihre digitale Präsenz zu stärken.
      </p>
    </section>
      <section class="my-skills">
        <h2>Meine Fähigkeiten</h2>
        <div class="skills-cloud">
          <div v-for="(skill, index) in skills" :key="index" class="skill" :style="generateStyle()">
            {{ skill }}
          </div>
        </div>
      </section>
      <h2>Mein Lebenslauf</h2>
      <div class="timeline">
        <ul>
          <li v-for="event in events" :key="event.year">
            <div>
              <time>{{ event.year }}: {{event.title}}</time>
              <p>{{ event.description }}</p>
            </div>
          </li>
        </ul>
      </div>
      <h1>Meine Projekte</h1>
      <div class="projects-list">
        <div class="project" v-for="(project, index) in projects" :key="index">
          <p class="project-name">
            {{ project.name }}
            <span class="info-icon" @click="openSidebar(project)" title="Mehr Informationen anzeigen">ℹ️</span>
          </p>
          <div class="laptop-frame">
            <img src="@/assets/Pictures/Laptop.png" alt="Laptop" class="laptop-image" />
            <div class="laptop-screen">
              <iframe :src="project.link" class="live-iframe"></iframe>
            </div>
          </div>
        </div>
      </div>
    <div
        class="overlay" :class="{ active: isSidebarOpen }" @click="closeSidebar">
    </div>
    <div class="sidebar" :class="{ active: isSidebarOpen }">
      <button class="close-button" @click="closeSidebar">×</button>
      <div class="sidebar-content" v-if="selectedProject">
        <h2>{{ selectedProject.name }}</h2>
        <div class="sidebar-section">
          <h3>Über</h3>
          <p>{{ selectedProject.description }}</p>
        </div>
        <div class="sidebar-section">
          <h3>Technologien</h3>
          <div class="technologies">
        <span v-for="tech in selectedProject.technologies" :key="tech" class="tech-badge">
          {{ tech }}
        </span>
          </div>
        </div>
        <div class="sidebar-section">
          <h3>Webseite</h3>
          <a :href="selectedProject.link" target="_blank" class="project-link">Live Webseite</a>
        </div>
        <div class="sidebar-section">
          <h3>GitHub</h3>
          <a :href="selectedProject.github" target="_blank" class="project-link">GitHub Repository</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted} from 'vue';
const isSidebarOpen = ref(false);
const selectedProject = ref(null);

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

const generateStyle = () => {
  const safeZoneX = Math.random() * 70; // X-Position in % innerhalb eines sicheren Bereichs
  const safeZoneY = Math.random() * 40 + 5; // Y-Position in % innerhalb eines sicheren Bereichs
  const randomZ = Math.random() * 50 - 25; // Tiefe (-25px bis 25px)
  const randomSize = Math.random() * 2 + 2; // Dynamische Schriftgröße (0.8 bis 2.3)
  const randomColor = Math.random() > 0.5 ? 'var(--primary-color)' : 'var(--text-color)'; // Zufällige Farbe
  const animationDuration = Math.random() * 12 + 5; // Animationsdauer (10 bis 30s)
  const animationDelay = Math.random() * 5; // Verzögerung (0 bis 5s)

  // Zufällige Bewegung (chaotischer Effekt)
  const keyframesName = `float-${Math.random().toString(36).slice(2, 7)}`; // Verwende `slice` statt `substr`
  const keyframes = `
    @keyframes ${keyframesName} {
      0% {
        transform: translate3d(${safeZoneX}vw, ${safeZoneY}vh, ${randomZ}px) scale(${randomSize});
        opacity: 0;
      }
      10% {
        opacity: 1; /* Wörter erscheinen */
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
        opacity: 0; /* Wörter verschwinden */
      }
    }
  `;

  // Keyframes dem Dokument hinzufügen
  const styleSheet = document.styleSheets[0] || document.head.appendChild(document.createElement('style')).sheet;
  styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

  return {
    animation: `${keyframesName} ${animationDuration}s infinite ease-in-out ${animationDelay}s`,
    color: randomColor,
    opacity: 0, // Start als unsichtbar
    zIndex: Math.round(randomZ), // Z-Index basierend auf Tiefe
  };
};

const projects = ref([
  {
    name: "Virtuelles Haustier",
    link: "https://virtual-pet-bcky.onrender.com/",
    github: "https://github.com/Cedric-CJ/virtual-pet",
    technologies: ["Vue", "JavaScript", "HTML", "CSS", "Docker", "Typescript"],
    description: "Ein Studienprojekt mit Funktionen zur Benutzerregistrierung, Anmeldung und Verwaltung eines virtuellen Haustiers, bei dem der Benutzer zwischen zwei Tieren wählen, ihnen Namen geben und sie füttern, pflegen oder mit ihnen spielen kann. Die Bedürfnisse der Tiere werden über Statusleisten angezeigt, und bei mangelnder Pflege kann das Tier sterben, sodass ein neues erstellt werden muss. Eine Bestenliste zeigt die Top-Tiere an.\n\n*Derzeit leider nicht funktionsfähig, da die Datenbank nicht mehr aktiv ist.*",
  },
  {
    name: "Metallbaumeister Webseite",
    link: "https://mz24.net/",
    github: "https://github.com/Cedric-CJ/MZ24",
    technologies: ["HTML", "CSS", "JavaScript", "Vue"],
    description: "Modernisierung der Webseite meines Vaters mit aktualisierten Datenschutz- und Impressumsseiten, einer dynamischeren Gestaltung und einer verbesserten Galerie mit Bild-Durchschaltung und Vorher-Nachher-Slider für einen modernen Look. Die Seite wurde so konzipiert, dass sie benutzerfreundlicher und optisch ansprechender ist, mit intuitiven Navigationselementen und verbesserter Ladezeit.",
  },
]);

const openSidebar = (project) => {
  selectedProject.value = project;
  isSidebarOpen.value = true;
};

const closeSidebar = () => {
  isSidebarOpen.value = false;
  selectedProject.value = null;
};

const events = ref([
  { year: 2026, title: "Bachelor of Science - Wirtschaftsinformatik", description: "An der Hochschule für Technik und Wirtschaft Berlin. Studium von 2022–2026." },
  { year: 2024, title: "Praktikum im BMDV Abteilung z33", description: "4. Fachsemester 3,5 Monatiges Betriebspraktikum im Betrieb der Informationstechnik (IT-Betrieb)/Fach-Auftraggeberschnittstelle (F-AGS) BMDV"},
  { year: 2022, title: "Werksstudent bei Kaufland", description: "Kaufland Deutschland. Seit Juni 2022 als Werksstudent tätig." },
  { year: 2022, title: "Abitur", description: "Ernst-Haeckel-Schule. Abschluss mit 2,8er im Mathe-Geschichte Abitur." },
  { year: 2018, title: "Praktikum Finanzamt Marzahn-Hellersdorf", description: "Praktikum beim Finanzamt Marzahn-Hellersdorf, mit Erfahrungen sowohl im Büro als auch bei Verhandlungen." },
  { year: 2016, title: "Praktikum bei Dr. Albrecht & Plogmaker GbR", description: "Fünf freiwillige Praktika bei der Steuerkanzlei, wo ich tiefe Einblicke in die Steuerberatung erhielt." },
]);

onMounted(() => {
  const targets = document.querySelectorAll(".timeline ul li");
  const threshold = 0.5;
  const ANIMATED_CLASS = "in-view";

  function callback(entries, observer) {
    entries.forEach((entry) => {
      const elem = entry.target;
      if (entry.intersectionRatio >= threshold) {
        elem.classList.add(ANIMATED_CLASS);
        observer.unobserve(elem);
      } else {
        elem.classList.remove(ANIMATED_CLASS);
      }
    });
  }

  const observer = new IntersectionObserver(callback, { threshold });
  for (const target of targets) {
    observer.observe(target);
  }
  const hexagonBackground = document.querySelector('.hexagon-background');

  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    hexagonBackground.style.transform = `translateY(${-scrollPosition * 0.5}px)`; // Parallax-Effekt
  };

  window.addEventListener('scroll', handleScroll);

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  })
});
</script>
<style>
html{
  overflow-x: hidden;
}

.hexagon-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 350%; /* Verlängert den Hintergrund für den Scroll-Effekt */
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 5px;
  z-index: -1; /* Hinter allen anderen Inhalten */
  background: linear-gradient(120deg, #1a1a1a, #262626); /* Dunkler Verlauf */
  overflow: hidden;
  transform: translateY(0); /* Startposition */
  will-change: transform; /* Optimiert die Leistung bei der Bewegung */
}

.hexagon {
  position: relative;
  width: 120px;
  height: 69px; /* Höhe = Breite * sqrt(3) / 2 */
  background: rgba(255, 255, 255, 0.1); /* Transparente Farbe für die Kacheln */
  clip-path: polygon(
      50% 0%,
      100% 25%,
      100% 75%,
      50% 100%,
      0% 75%,
      0% 25%
  );
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2); /* Subtile Schatten für Tiefe */
  transition: transform 0.5s, background 0.5s; /* Weiche Übergänge */
}

.hexagon:hover {
  transform: scale(1.1); /* Leichte Vergrößerung beim Hover */
  background: rgba(255, 255, 255, 0.2); /* Hellerer Effekt beim Hover */
}

.hexagon:nth-child(even) {
  transform: translateY(50%); /* Für das Schachbrettmuster */
  animation: float 6s ease-in-out infinite; /* Animation für ein Schwebe-Effekt */
}

@keyframes float {
  0%, 100% {
    transform: translateY(50%) translateX(0);
  }
  50% {
    transform: translateY(50%) translateX(10px); /* Subtile Bewegung */
  }
}

.timeline {
  overflow-x: hidden;
  position: relative;
}

.intro {
  height: 50vh; /* Nimmt den gesamten sichtbaren Bereich ein */
}

.overlay {
  pointer-events: none;
}

.overlay.active {
  background: rgba(0, 0, 0, 0.6); /* Abdunkeln bei aktiver Sidebar */
  opacity: 1;
  visibility: visible;
}

.info {
  font-family: "Poppins", sans-serif; /* Wähle eine moderne Schriftart */
  color: var(--text-color);
  text-align: justify;
  text-align-last: center;
  background: linear-gradient(120deg, var(--primary-color), #f39c12);
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  max-width: 800px;
  margin: 2rem auto;
  position: relative;
  overflow: hidden;
}

.laptop-frame {
  position: relative;
  width: 90vw; /* Verwenden Sie vw, um die Breite relativ zur Fensterbreite zu setzen */
  height: calc(100vw * 0.66); /* Verhältnis des Laptop-Bildes: Breite zu Höhe, hier z. B. 16:10 */
  max-width: 150vh; /* Maximale Größe: passt sich an die Höhe des Bildschirms an */
  max-height: calc(150vh * 0.66); /* Verhindert Überschreiten des Bildschirms */
  margin: auto;
}

.laptop-image {
  width: 100%;
  height: auto;
  display: block;
  z-index: 1;
}

.laptop-screen {
  position: absolute;
  top: 8%; /* Adjust to fit the screen area of the laptop */
  left: 14%; /* Adjust to fit the screen area of the laptop */
  width: 72%; /* Adjust width to fit the screen area */
  height: 70%; /* Adjust height to fit the screen area */
  background: var(--background-color); /* Fallback background color */
  overflow: hidden;
}

.live-iframe {
  position: relative;
  width: 100%;
  height: 100%;
  border: none;
}

.my-skills {
  margin-top: 50vh; /* Scrollbar setzt hier ein */
}

body {
  margin: 0;
  font-family: Arial, sans-serif;
}

.projects-list {
  display: flex;
  flex-wrap: wrap;
  gap: 50px;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 100px;
}

.project {
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.project:hover {
  transform: scale(1.05);
}

.info-icon {
  font-size: 1.2rem; /* Größe des Icons */
  margin-left: 8px; /* Abstand zum Projektnamen */
  cursor: pointer; /* Zeigt an, dass es anklickbar ist */
  color: var(--primary-color); /* Farbe passend zum Design */
  transition: transform 0.2s ease, color 0.2s ease;
}

.sidebar {
  position: fixed;
  top: 0;
  right: -100vh;
  width: 40vw;
  height: 100%;
  background: var(--background-color);
  color: white;
  box-shadow: -10px 0 20px rgba(0, 0, 0, 0.5);
  padding: 2vh;
  z-index: 99999;
  overflow-y: auto;
  transform: translateX(0);
  transition: transform 0.3s ease;
}

.sidebar.active {
  transform: translateX(-100vh);
}

.sidebar-content {
  margin-top: 50px;
}

.sidebar h2 {
  font-size: 2rem;
  margin-bottom: 10px;
}

.sidebar p {
  line-height: 1.5;
  margin-bottom: 20px;
}

.sidebar-section {
  margin-bottom: 20px;
}

.sidebar-section h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #f39c12; /* Akzentfarbe für Überschriften */
}

.technologies {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tech-badge {
  background: var(--card-background-color);
  color: var(--text-color);
  border-radius: 5px;
  padding: 5px 10px;
  font-size: 0.9rem;
}

.project-link {
  display: inline-block;
  padding: 10px 15px;
  color: var(--text-color);
  background-color: var(--primary-color);
  text-decoration: none;
  border-radius: 5px;
  bottom: 10vh;
}

.project-link:hover {
  background-color: var(--primary-color);
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 2rem;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
}

h1 {
  font-size: 4rem;
  text-align: center;
  color: var(--text-color);
  position: relative;
  text-transform: uppercase;
  overflow: hidden;
  line-height: 1.2;
}

h1::before,
h1::after {
  content: attr(data-text); /* Dupliziert den Text */
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: var(--text-color);
  overflow: hidden;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
}

h1::before {
  text-shadow: -2px 0 red, 2px 0 blue;
  z-index: 0;
  animation: glitch-animation 2s steps(8) infinite;
}

h1::after {
  text-shadow: -2px 0 blue, 2px 0 red;
  z-index: 0;
  animation: glitch-animation 3s steps(8) infinite reverse;
}

@keyframes glitch-animation {
  0% {
    clip-path: polygon(0 3%, 100% 3%, 100% 12%, 0 12%);
    transform: translate(2px, -2px);
    opacity: 1;
  }
  10% {
    clip-path: polygon(0 7%, 100% 7%, 100% 20%, 0 20%);
    transform: translate(-3px, 3px) skewX(5deg);
    opacity: 0.8;
  }
  20% {
    clip-path: polygon(0 12%, 100% 12%, 100% 25%, 0 25%);
    transform: translate(3px, -1px) rotate(1deg);
    opacity: 0.5;
  }
  30% {
    clip-path: polygon(0 30%, 100% 30%, 100% 38%, 0 38%);
    transform: translate(-2px, 2px) skewY(3deg);
    opacity: 0.7;
  }
  40% {
    clip-path: polygon(0 45%, 100% 45%, 100% 55%, 0 55%);
    transform: translate(1px, -3px) skewX(-5deg);
    opacity: 0.9;
  }
  50% {
    clip-path: polygon(0 50%, 100% 50%, 100% 60%, 0 60%);
    transform: translate(-3px, 1px);
    opacity: 0.6;
  }
  60% {
    clip-path: polygon(0 60%, 100% 60%, 100% 70%, 0 70%);
    transform: translate(2px, 2px) skewY(-3deg);
    opacity: 1;
  }
  80% {
    clip-path: polygon(0 85%, 100% 85%, 100% 90%, 0 90%);
    transform: translate(3px, 3px) skewX(4deg);
    opacity: 0.5;
  }
  100% {
    clip-path: polygon(0 10%, 100% 10%, 100% 15%, 0 15%);
    transform: translate(0, 0);
    opacity: 1;
  }
}

.skills-cloud {
  position: relative;
  width: 100vw; /* Vollbildbreite */
  height: 50vh; /* Halbe Bildschirmhöhe */
  perspective: 1000px; /* 3D-Effekt */
  overflow: hidden;
}

.skill {
  position: absolute;
  font-size: calc(1.5vw + 2vh); /* Dynamische Schriftgröße */
  font-weight: bold;
  font-family: Arial, sans-serif;
  animation: none; /* Animation wird per JS hinzugefügt */
  opacity: 0; /* Start als unsichtbar */
  white-space: nowrap;
}
</style>