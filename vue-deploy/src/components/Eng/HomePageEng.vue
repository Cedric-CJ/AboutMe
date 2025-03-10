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

<style>
html {
  overflow-x: hidden;
}

.hexagon-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 350%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 5px;
  z-index: -1;
  background: linear-gradient(120deg, #1a1a1a, #262626);
  overflow: hidden;
  transform: translateY(0);
  will-change: transform;
}

.hexagon {
  position: relative;
  width: 120px;
  height: 69px;
  background: rgba(255, 255, 255, 0.1);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  transition: transform 0.5s, background 0.5s;
}

.hexagon:hover {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 0.2);
}

.hexagon:nth-child(even) {
  transform: translateY(50%);
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(50%) translateX(0); }
  50% { transform: translateY(50%) translateX(10px); }
}

.timeline {
  overflow-x: hidden;
  position: relative;
}

.intro {
  height: 50vh;
}

.info {
  font-family: "Poppins", sans-serif;
  color: var(--special-text-color);
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
  width: 90vw;
  height: calc(100vw * 0.66);
  max-width: 150vh;
  max-height: calc(150vh * 0.66);
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
  top: 8%;
  left: 14%;
  width: 72%;
  height: 70%;
  background: var(--background-color);
  overflow: hidden;
}

.live-iframe {
  position: relative;
  width: 100%;
  height: 100%;
  border: none;
}

.my-skills {
  margin-top: 50vh;
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
  font-size: 1.2rem;
  margin-left: 8px;
  cursor: pointer;
  color: var(--primary-color);
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
  color: #f39c12;
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
  content: attr(data-text);
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
  width: 100vw;
  height: 50vh;
  perspective: 1000px;
  overflow: hidden;
}

.skill {
  position: absolute;
  font-size: calc(1.5vw + 2vh);
  font-weight: bold;
  font-family: Arial, sans-serif;
  animation: none;
  opacity: 0;
  white-space: nowrap;
}

/* Glass Overlay with Blur Effect */
.glass-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(8px);
  background-color: rgba(0, 0, 0, 0.2);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease;
  z-index: 90;
}
.glass-overlay.active {
  opacity: 1;
  visibility: visible;
}
</style>