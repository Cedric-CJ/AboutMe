<!-- Created by Cedric, visit my [GitHub](https://cedric-cj.github.io/AboutMe/) -->
<!-- Timeline inspired by https://github.com/ftes/react-dual-timeline -->
<!-- Glitch animation inspired by https://github.com/adenekan41/codewonders -->
<template>
  <div class="hexagon-background">
    <div v-for="n in 200" :key="n" class="hexagon"></div>
  </div>
  <div class="container">
    <section class="intro">
      <h1 data-text="Hi, I'm Cedric">Hi, I'm Cedric</h1>
      <p class="info">
        I created this website as a personal hobby to pursue my passion for web development and digitalization. It also serves as a source of inspiration for companies or individuals looking to modernize or build their own online presence.
        <br><br>
        If you need support in designing or optimizing your website, feel free to contact me. I can help you bring your ideas to life and strengthen your digital presence.
      </p>
    </section>
    <section class="my-skills">
      <h2>My Skills</h2>
      <div class="skills-cloud">
        <div v-for="(skill, index) in skills" :key="index" class="skill" :style="generateStyle()">
          {{ skill }}
        </div>
      </div>
    </section>
    <h2>My CV</h2>
    <div class="timeline">
      <ul>
        <li v-for="event in events" :key="event.year">
          <div>
            <time>{{ event.year }}: {{ event.title }}</time>
            <p>{{ event.description }}</p>
          </div>
        </li>
      </ul>
    </div>
    <h1>My Projects</h1>
    <div class="projects-list">
      <div class="project" v-for="(project, index) in projects" :key="index">
        <p class="project-name">
          {{ project.name }}
          <span class="info-icon" @click="openSidebar(project)" title="Show more information">ℹ️</span>
        </p>
        <div class="laptop-frame">
          <img src="@/assets/Pictures/Laptop.png" alt="Laptop" class="laptop-image" />
          <div class="laptop-screen">
            <iframe :src="project.link" class="live-iframe"></iframe>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Glass Overlay with Blur Effect -->
  <div class="glass-overlay" :class="{ active: isSidebarOpen }" @click="closeSidebar"></div>
  <div class="sidebar" :class="{ active: isSidebarOpen }">
    <button class="close-button" @click="closeSidebar">×</button>
    <div class="sidebar-content" v-if="selectedProject">
      <h2>{{ selectedProject.name }}</h2>
      <div class="sidebar-section">
        <h3>About</h3>
        <p>{{ selectedProject.description }}</p>
      </div>
      <div class="sidebar-section">
        <h3>Technologies</h3>
        <div class="technologies">
          <span v-for="tech in selectedProject.technologies" :key="tech" class="tech-badge">
            {{ tech }}
          </span>
        </div>
      </div>
      <div class="sidebar-section">
        <h3>Website</h3>
        <a :href="selectedProject.link" target="_blank" class="project-link">Live Website</a>
      </div>
      <div class="sidebar-section">
        <h3>GitHub</h3>
        <a :href="selectedProject.github" target="_blank" class="project-link">GitHub Repository</a>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

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
  const safeZoneX = Math.random() * 70;
  const safeZoneY = Math.random() * 40 + 5;
  const randomZ = Math.random() * 50 - 25;
  const randomSize = Math.random() * 2 + 2;
  const randomColor = Math.random() > 0.5 ? 'var(--primary-color)' : 'var(--text-color)';
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
  const styleSheet = document.styleSheets[0] || document.head.appendChild(document.createElement('style')).sheet;
  styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
  return {
    animation: `${keyframesName} ${animationDuration}s infinite ease-in-out ${animationDelay}s`,
    color: randomColor,
    opacity: 0,
    zIndex: Math.round(randomZ),
  };
};

const projects = ref([
  {
    name: "Virtual Pet",
    link: "https://virtual-pet-bcky.onrender.com/",
    github: "https://github.com/Cedric-CJ/virtual-pet",
    technologies: ["Vue", "JavaScript", "HTML", "CSS", "Docker", "Typescript", "SQL-DB", "React", "Post-,Rest-interface"],
    description: "A study project featuring user registration, login, and management of a virtual pet, where the user can choose between two animals, name them, and feed, groom, or play with them. The animal's needs are displayed via status bars, and if care is neglected, the animal may die and a new one must be created. A leaderboard shows the top animals.\n\n*Currently not functional because the database is no longer active.*",
  },
  {
    name: "Metalworker Website",
    link: "https://mz24.net/",
    github: "https://github.com/Cedric-CJ/MZ24",
    technologies: ["HTML", "CSS", "JavaScript", "Vue"],
    description: "Modernization of my father's website with updated data protection and imprint pages, a more dynamic design, and an improved gallery with image slideshow and before/after slider for a modern look. The page is designed to be more user-friendly and visually appealing, with intuitive navigation elements and improved loading times.",
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

const handleClickOutside = (event) => {
  const sidebarEl = document.querySelector(".sidebar");
  if (isSidebarOpen.value && sidebarEl && !sidebarEl.contains(event.target)) {
    closeSidebar();
  }
};

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
  targets.forEach(target => observer.observe(target));

  const hexagonBackground = document.querySelector('.hexagon-background');
  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    hexagonBackground.style.transform = `translateY(${-scrollPosition * 0.5}px)`;
  };
  window.addEventListener('scroll', handleScroll);

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
    document.removeEventListener("click", handleClickOutside);
  });
});

const events = ref([
  { year: 2026, title: "Bachelor of Science - Business Informatics", description: "At the University of Applied Sciences Berlin, I am expected to complete my BSc in 2026." },
  { year: 2024, title: "Internship at the Federal Ministry for Digital and Transport, Department Z33", description: "During my 4th semester, I completed a 3.5-month internship from December 2024 to March 2025 in IT operations, focusing on server management and IT infrastructure at the BMDV." },
  { year: 2022, title: "Working Student at Kaufland", description: "Kaufland Germany. Employed as a working student from June 2022 to August 2024." },
  { year: 2022, title: "High School Diploma (Abitur)", description: "At Ernst-Haeckel-Schule Berlin. Graduated with a 2.8 GPA in a Math-History focus." },
  { year: 2018, title: "Internship at Finanzamt Marzahn-Hellersdorf", description: "Internship at the Marzahn-Hellersdorf tax office, gaining experience in office work and negotiations." },
  { year: 2016, title: "Internship at Dr. Albrecht & Plogmaker GbR", description: "Five voluntary internships at the tax consultancy, gaining deep insights into tax advisory processes." },
]);
</script>
<style scoped>
</style>