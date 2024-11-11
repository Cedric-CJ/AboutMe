### Erstellt von Cedric visit my [GitHub](https://cedric-cj.github.io/AboutMe/)
//Timeline inspiriert von https://github.com/ftes/react-dual-timeline
<template>
  <div class="container">
    <header>
    </header>
    <main>
      <h1>Willkommen auf meiner Seite</h1>
      <div class="about-me">
        <p class="fade-in">Hier findest du Informationen über mich und meine Projekte.</p>
        <p class="fade-in">Viel Spaß beim Stöbern!</p>
      </div>
      <section class="who-am-i">
        <h2>Wer bin ich?</h2>
        <p>Mein Name ist Cedric Arnhold und ich studiere derzeit Wirtschaftsinformatik an der Hochschule für Technik und Wirtschaft Berlin (HTW).</p>
      </section>
      <section class="why-this-site">
        <h2>Warum mache ich diese Seite?</h2>
        <p>Diese Webseite dient als zentrale Anlaufstelle und spiegelt meine aktuellen Projekte wider. Mein Ziel ist es, kleinen und mittelständischen Unternehmen beim Umstieg in die Digitalisierung zu helfen. Viele Unternehmen haben nicht die Zeit, sich kontinuierlich um ihre Online-Präsenz zu kümmern, bis ein Brief vom Provider sie darauf hinweist, dass das Impressum, die Datenschutzerklärung oder die Sicherheit der Seite gefährdet sind. Dies kann letztendlich zu Strafen führen.</p>
      </section>
      <section class="my-skills">
        <h2>Meine Fähigkeiten</h2>
        <div class="skills-list">
          <div class="skill-category">
            <h3>Frontend</h3>
            <ul>
              <li>HTML</li>
              <li>CSS</li>
              <li>JavaScript</li>
              <li>Vue</li>
              <li>React</li>
            </ul>
          </div>
          <div class="skill-category">
            <h3>Backend</h3>
            <ul>
              <li>Python</li>
              <li>Java</li>
              <li>Spring Boot</li>
            </ul>
          </div>
          <div class="skill-category">
            <h3>Datenbanken</h3>
            <ul>
              <li>PostgreSQL</li>
              <li>Oracle</li>
            </ul>
          </div>
          <div class="skill-category">
            <h3>Sonstiges</h3>
            <ul>
              <li>Docker</li>
              <li>Render</li>
            </ul>
          </div>
        </div>
      </section>
      <h1>Mein Lebenslauf</h1>
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
        <div class="project" v-for="(project, projectIndex) in projects" :key="project.name">
          <div class="project-header">
            <span>{{ project.name }}</span>
            <button @click="toggleDescription(projectIndex)" class="description-button">Beschreibung</button>
          </div>
          <transition name="slide-fade">
            <p v-if="project.showDescription" class="project-description">{{ project.description }}</p>
          </transition>
          <div class="image-gallery">
            <div class="image-container" v-for="(img, index) in project.images" :key="img">
              <img :src="img" alt="Projektbild" class="project-img" @click="showFullScreen(img, projectIndex, index)" />
            </div>
          </div>
          <a :href="project.link" target="_blank" class="project-link">Link zum Projekt</a>
        </div>
      </div>

      <!-- Lightbox -->
      <div v-if="isFullScreenOpen" class="fullscreen-overlay" @click.self="hideFullScreen">
        <button class="close-button" @click="hideFullScreen">×</button>
        <button class="nav-button prev" @click.stop="prevImage">‹</button>
        <img :src="fullScreenImage" class="fullscreen-image" alt="Vollbild" />
        <button class="nav-button next" @click.stop="nextImage">›</button>
      </div>
    </main>
    <footer>
    </footer>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

import VP1 from "@/assets/Pictures/VP_1.png"
import VP2 from "@/assets/Pictures/VP_2.png"
import VP3 from "@/assets/Pictures/VP_3.png"
import VP4 from "@/assets/Pictures/VP_4.png"
import VP5 from "@/assets/Pictures/VP_5.png"

import MZ24_1 from "@/assets/Pictures/MZ24_1.png"
import MZ24_3 from "@/assets/Pictures/MZ24_3.png"

// Projekte- und Bilddaten
const projects = ref([
  { name: "Virtual Pet",
    images: [VP1, VP2, VP3, VP4, VP5],
    link: "https://virtual-pet-bcky.onrender.com/",
    description: "Ein Studienprojekt mit Funktionen zur Benutzerregistrierung, Anmeldung und Verwaltung eines virtuellen Haustiers, bei dem der Benutzer zwischen zwei Tieren wählen, ihnen Namen geben und sie füttern, pflegen oder mit ihnen spielen kann. Die Bedürfnisse der Tiere werden über Statusleisten angezeigt, und bei mangelnder Pflege kann das Tier sterben, sodass ein neues erstellt werden muss. Eine Bestenliste zeigt die Top-Tiere an.\n\n"+"*Derzeit leider nicht funktionsfähig, da die Datenbank nicht mehr aktiv ist.",
    showDescription: false },

  { name: "Metallbaumeister Webseite",
    images: [MZ24_1, MZ24_3],
    link: "https://mz24.net/",
    description: "Modernisierung der Webseite meines Vaters mit aktualisierten Datenschutz- und Impressumsseiten, einer dynamischeren Gestaltung und einer verbesserten Galerie mit Bild-Durchschaltung und Vorher-Nachher-Slider für einen modernen Look. Die Seite wurde so konzipiert, dass sie benutzerfreundlicher und optisch ansprechender ist, mit intuitiven Navigationselementen und verbesserter Ladezeit.",
    showDescription: false }
]);

const toggleDescription = (projectIndex) => {
  projects.value[projectIndex].showDescription = !projects.value[projectIndex].showDescription;
};

// Zustand für das Vollbildbild und den Index
const fullScreenImage = ref(null);
const isFullScreenOpen = ref(false);
const currentImageIndex = ref(0);
const currentProjectIndex = ref(0);

// Funktion zum Anzeigen des Vollbildmodus und Hinzufügen von Keydown-Listenern
const showFullScreen = (src, projectIndex, index) => {
  fullScreenImage.value = src;
  currentProjectIndex.value = projectIndex;
  currentImageIndex.value = index;
  isFullScreenOpen.value = true;
  document.addEventListener('keydown', handleKeyDown);
};

// Funktion zum Verlassen des Vollbildmodus und Entfernen von Keydown-Listenern
const hideFullScreen = () => {
  isFullScreenOpen.value = false;
  fullScreenImage.value = null;
  document.removeEventListener('keydown', handleKeyDown);
};

// Bildnavigations-Funktionen
const nextImage = () => {
  const images = projects.value[currentProjectIndex.value].images;
  currentImageIndex.value = (currentImageIndex.value + 1) % images.length;
  fullScreenImage.value = images[currentImageIndex.value];
};

const prevImage = () => {
  const images = projects.value[currentProjectIndex.value].images;
  currentImageIndex.value =
      (currentImageIndex.value - 1 + images.length) % images.length;
  fullScreenImage.value = images[currentImageIndex.value];
};

// Tasteneingaben (ESC, Pfeiltasten) behandeln
const handleKeyDown = (event) => {
  if (event.key === 'Escape') {
    hideFullScreen();
  } else if (event.key === 'ArrowRight') {
    nextImage();
  } else if (event.key === 'ArrowLeft') {
    prevImage();
  }
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
})
</script>
<style>
html, body {
  overflow-x: hidden;
}

body {
  margin: 0;
  font-family: Arial, sans-serif;
}

.projects-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.project {
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 5px;
  background-color: #f8f8f8;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.description-button {
  background: none;
  border: none;
  color: #0073e6;
  cursor: pointer;
  font-weight: bold;
  padding: 5px 0;
  margin-bottom: 10px;
}
.project-description {
  padding: 10px;
  border-top: 1px solid #ddd;
  margin-top: 10px;
  font-size: 14px;
}

a {
  text-align: center;
}

.image-gallery {
  display: flex;
  overflow-x: auto;
  gap: 10px;
  padding: 10px 0;
}

.image-container {
  flex-shrink: 0;
}

.project-img {
  max-height: 150px;
  border-radius: 5px;
  cursor: pointer;
  transition: transform 0.2s;
}

.project-link {
  text-decoration: none;
  color: #333;
  font-weight: bold;
  cursor: pointer;
  transition: color 0.2s;
}

.project-link:hover {
  color: #0073e6;
}

.project-img:hover {
  transform: scale(1.05);
}

.fullscreen-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}

.fullscreen-image {
  max-width: 95%;
  max-height: 95%;
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 10px;
}

.nav-button {
  background: rgba(255, 255, 255, 0.8);
  border: none;
  font-size: 2em;
  color: #333;
  cursor: pointer;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 50%;
  width: 2.5em;
  height: 2.5em;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  z-index: 1001;
}

@media (max-width: 768px) {
  .nav-button {
    top: 80%;
  }
}

.nav-button.prev {
  left: 10%;
}

.nav-button.next {
  right: 10%;
}

.close-button {
  position: absolute;
  top: 5%;
  right: 5%;
  background: white;
  border: none;
  font-size: 2em;
  color: #333;
  cursor: pointer;
  border-radius: 50%;
  width: 1.5em;
  height: 1.5em;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.timeline {
  margin-left: -50px;
  position: relative;
  z-index: 0;
}

.timeline ul li {
  margin-left: -50px;
}
</style>