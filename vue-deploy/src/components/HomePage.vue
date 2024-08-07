### Erstellt von Cedric visit my [GitHub](https://cedric-cj.github.io/AboutMe/)
<script setup>
//Timeline insperiert von https://github.com/ftes/react-dual-timeline
import { ref, onMounted } from 'vue';

import BeispielLogo from "@/assets/favicon.png";
const projects = ref([

  { name: "Beispiel Projekt", logo: BeispielLogo }]);

projects.value.sort((a, b) => a.name.localeCompare(b.name));

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
  { year: 1, title: "A", description: "..." },
  { year: 2, title: "B", description: "..." },
  { year: 3, title: "C", description: "..." },
  { year: 4, title: "D", description: "..." },
  { year: 5, title: "E", description: "..." },
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
});
</script>
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
              <time>{{ event.year }}</time>
              <p>{{ event.description }}</p>
            </div>
          </li>
        </ul>
      </div>
      <h1>Meine Projekte</h1>
      <div class="projects-list">
        <div class="project" v-for="project in projects" :key="project.name">
          <span>{{ project.name }}</span>
          <div class="logo-container">
            <img v-if="project.logo" :src="project.logo" alt="Logo" class="project-logo" @click="showFullScreen(project.logo)">
            <span v-else>Bild nicht gefunden</span>
          </div>
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

<style scoped>
main:hover {
  transform: none;
  background-color: inherit;
}
.about-us p {
  font-size: 1.25em;
  text-align: justify;
  padding: 20px
}
h1 {
  margin: 20px;
}
</style>