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
        <div class="project" v-for="project in projects" :key="project.name">
          <span>{{ project.name }}</span>
          <div class="image-gallery">
            <div class="image-container" v-for="img in project.images" :key="img">
              <img :src="img" alt="Projektbild" class="project-img" @click="showFullScreen(img)">
            </div>
          </div>
          <a :href="project.link" target="_blank" class="project-link">Link zum Projekt</a>
        </div>
      </div>
      <div class="Images">
      </div>
    </main>
    <footer>
    </footer>
    <div v-if="fullScreenImage" class="fullscreen-overlay" @click="hideFullScreen">
      <img :src="fullScreenImage" class="fullscreen-image" alt="Vollbild">
    </div>
  </div>
</template>

<script setup>
import VP from "@/assets/Pictures/Virtual-pet.png"
import { ref, onMounted } from 'vue';
import MZ24_1 from "@/assets/Pictures/MZ24_1.png"
import MZ24_2 from "@/assets/Pictures/MZ24_2.png"
import MZ24_3 from "@/assets/Pictures/MZ24_3.png"

const projects = ref([
  { name: "Virtual Pet", images: [VP], link: "https://github.com/Cedric-CJ/virtual-pet" },
  { name: "Metallbaumeister Webseite", images: [MZ24_1, MZ24_2, MZ24_3], link: "http://mz24.net/" }
]);

const fullScreenImage = ref(null);

const showFullScreen = (src) => {
  fullScreenImage.value = src;
  document.addEventListener('keydown', handleEscapeKey);
};

const hideFullScreen = () => {
  fullScreenImage.value = null;
  document.removeEventListener('keydown', handleEscapeKey);
};

const handleEscapeKey = (event) => {
  if (event.key === 'Escape') {
    hideFullScreen();
  }
};

const events = ref([
  { year: 2026, title: "Bachelor of Science - Wirtschaftsinformatik", description: "An der Hochschule für Technik und Wirtschaft Berlin. Studium von 2022–2026." },
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
body {
  margin: 0;
  font-family: Arial, sans-serif;
}

/* Projekte-Layout */
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
  background-color: #f9f9f9;
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
  color: black;
  font-weight: bold;
  cursor: pointer;
  transition: color 0.2s;
  display: inline;
  padding: 0;
  margin: 0;
}

.project-link:hover {
  color: blue;
}

.project-img:hover {
  transform: scale(1.05);
}

/* Vollbildmodus */
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
  z-index: 1000;
}

.fullscreen-image {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 10px;
}

</style>