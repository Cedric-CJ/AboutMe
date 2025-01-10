<template>
  <div id="app" @click="handleClickOutside">
    <div v-if="showPreloader" class="preloader fullscreen" :class="{ 'fade-out': isFadingOut }">
      <svg height="100%" width="100%" viewBox="0 0 857 151">
        <g>
          <text x="50%" y="50%" text-anchor="middle" :fill="accentColor" font-size="48" dy=".35em" class="preloader-text" :style="{ fontFamily: 'Roboto Slab, serif' }">
            <tspan v-for="(letter, index) in dynamicPreloaderText" :key="index" class="animated-text" :style="{ animationDelay: `${index * 0.1}s` }">
              {{ letter }}
            </tspan>
          </text>
        </g>
      </svg>
    </div>
    <header>
      <div class="language-switcher">
        <img v-if="currentLanguage === 'de'" src="@/assets/Pictures/flag-us.webp" alt="English" @click="switchLanguage('eng')"/>
        <!-- ansonsten die deutsche Flagge -->
        <img v-else-if="currentLanguage === 'eng'" src="@/assets/Pictures/flag-de.webp" alt="Deutsch" @click="switchLanguage('de')"/></div>
      <button id="menuButton" @click.stop="toggleMenu">
        {{ menuText.menuButton }}
      </button>
      <nav :class="{ hidden: isMenuHidden, visible: !isMenuHidden }" id="navMenu" @click.stop>
        <div class="menu-links">
          <p>
            <router-link :to="currentLanguage === 'de' ? '/de' : '/eng'">Home</router-link>
          </p>
          <p>
            <router-link :to="currentLanguage === 'de' ? '/de/contact' : '/eng/contact'">
              {{ menuText.contact }}
            </router-link>
          </p>
          <p>
            <router-link :to="currentLanguage === 'de' ? '/de/workInProgress' : '/eng/workInProgress'">
              {{ menuText.workInProgress }}
            </router-link>
          </p>
          <div class="accent-selector">
            <p>{{ menuText.chooseAccent }}</p>
            <button class="button-red" @click="setAccentColor('#FF3030')">{{ menuText.red }}</button>
            <button class="button-green" @click="setAccentColor('#228B22')">{{ menuText.green }}</button>
            <button class="button-blue" @click="setAccentColor('#1C1F26')">{{ menuText.blue }}</button>
            <label>
              {{ menuText.custom }}
              <input type="color" @input="setAccentColor($event.target.value)" />
            </label>
          </div>
        </div>
        <div class="footer-links">
          <router-link
              :to="currentLanguage === 'de' ? '/de/impressum' : '/eng/impressum'"
              class="small-link highlight-link"
          >
            {{ menuText.impressum }}
          </router-link>
          |
          <router-link
              :to="currentLanguage === 'de' ? '/de/PrivacyPolicy' : '/eng/PrivacyPolicy'"
              class="small-link highlight-link"
          >
            {{ menuText.privacyPolicy }}
          </router-link>
          <p>&copy; 2024 Cedric Arnhold</p>
        </div>
        <button id="closeMenuButton" @click.stop="toggleMenu">←</button>
      </nav>
    </header>
    <component :is="currentInfoMessage" v-if="showMessage" @close-message="showMessage = false"/>
    <button id="backToTopButton" @click="scrollToTop" v-show="showBackToTop">
      <img src="@/assets/Pictures/back%20to%20top%20button.png" alt="Back to top" />
    </button>
    <main>
      <router-view></router-view>
    </main>
    <footer>
    </footer>
  </div>
</template>

<script>
import InfoMessageDe from "@/components/De/DSGVO/InfoMessageDe.vue";
import InfoMessageEng from "@/components/Eng/DSGVO/InfoMessageEng.vue";

export default {
  name: "App",
  components: {
    InfoMessageDe,
    InfoMessageEng,
  },
  data() {
    return {
      isMenuHidden: true,
      showMessage: true,
      showPreloader: true,
      isFadingOut: false,
      accentColor: '#10e956', // Default accent color
      showBackToTop: false,
    };
  },
  computed: {
    currentLanguage() {
      // Wir prüfen, ob der Pfad mit /de oder /eng beginnt
      const path = this.$route.path;
      if (path.startsWith("/de")) {return "de";
      } else if (path.startsWith("/eng")) {return "eng";
      } return "de";
      // Falls du eine Standard-Sprache hast, gib sie hier zurück:
    },
    currentInfoMessage() {
      return this.currentLanguage === 'de' ? InfoMessageDe : InfoMessageEng;
    },
    menuText() {
      // Ein "Dictionary" mit deutschen und englischen Übersetzungen
      if (this.currentLanguage === 'de') {
        return {
          menuButton: '☰ Menü',
          contact: 'Kontakt',
          workInProgress: '...',
          chooseAccent: 'Akzentfarbe wählen:',
          red: 'Rot',
          green: 'Grün',
          blue: 'Deep Navy-Blau',
          custom: 'Benutzerdefiniert:',
          impressum: 'Impressum',
          privacyPolicy: 'Datenschutz',
        };
      } else {
        return {
          menuButton: '☰ Menu',
          contact: 'Contact',
          workInProgress: '...',
          chooseAccent: 'Choose accent color:',
          red: 'Red',
          green: 'Green',
          blue: 'Deep Navy-Blue',
          custom: 'Custom:',
          impressum: 'Imprint',
          privacyPolicy: 'Privacy Policy',
        };
      }
    },
    dynamicPreloaderText() {
      if (this.currentLanguage === 'de') {
        return "Mit KI die IT-Welt neu definieren".split("");
      } else {
        return "Redefining the IT world with AI".split("");
      }
    },
  },
  methods: {
    switchLanguage(lang) {
      localStorage.setItem('preferredLanguage', lang);

      // Aktueller Pfad, z.B. "/de/contact" oder "/eng/workInProgress"
      const currentPath = this.$route.path;

      let newPath;

      if (lang === 'eng') {
        // Ersetze am Anfang "/de" durch "/eng"
        // Beispiel: "/de/contact" => "/eng/contact"
        newPath = currentPath.replace(/^\/de/, '/eng');
      } else {
        // Ersetze am Anfang "/eng" durch "/de"
        // Beispiel: "/eng/contact" => "/de/contact"
        newPath = currentPath.replace(/^\/eng/, '/de');
      }

      // Nun navigieren wir zu newPath
      this.$router.push(newPath);
    },

    toggleMenu() {
      const navMenu = document.getElementById('navMenu');

      if (this.isMenuHidden) {
        // Menü einblenden
        this.isMenuHidden = false;
        navMenu.classList.remove('hidden');
        navMenu.classList.add('visible');
      } else {
        // Menü ausblenden
        navMenu.classList.remove('visible');
        navMenu.classList.add('hidden');
        // Sofort das `isMenuHidden` setzen, keine Verzögerung
        this.isMenuHidden = true;
      }
    },
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth', // Sanftes Scrollen
      });
    },
    handleScroll() {
      const scrollPosition = window.scrollY;
      this.showBackToTop = scrollPosition > 600; // Zeige den Button nach 300px Scrollen
    },

    handleClickOutside(event) {
      if (!this.$el.querySelector('#navMenu').contains(event.target) && !this.isMenuHidden) {
        this.toggleMenu();
      }
    },
    setAccentColor(color) {
      this.accentColor = color;
      document.documentElement.style.setProperty('--primary-color', color);
      document.documentElement.style.setProperty('--timeline-background', color);
    },
  },
  mounted() {
    setTimeout(() => {
      const animatedTexts = document.querySelectorAll(".animated-text");
      animatedTexts.forEach((text, i) => {
        text.style.opacity = "0";
        text.style.transition = "opacity 0.3s ease";
        setTimeout(() => {
          text.style.opacity = "1";
        }, i * 100); // Staggered animation
      });
    }, 500); // Animation delay

    setTimeout(() => {
      const preloaderText = document.querySelector(".preloader-text");
      preloaderText.style.animation = "glow 1.5s 2 alternate";
    }, ("Mit KI die IT-Welt neu definieren".length * 100) + 500); // Glow starts after text is fully visible

    setTimeout(() => {
      this.isFadingOut = true;
      setTimeout(() => {
        this.showPreloader = false;
      }, 1500); // Fade-out duration
    }, 5000); // Total duration before fade-out

    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
};
</script>
<style>
.language-switcher {
  position: fixed;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 1.5rem;
  z-index: 9999;
}

.language-switcher img {
  width: 10vw;
  height: auto;
  min-width: 40px;
  max-width: 80px;
  cursor: pointer;
  transition: transform 0.2s;
}

.language-switcher img:hover {
  transform: scale(1.1);
  border-color: var(--primary-color);
}

.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #121212;
  z-index: 1001;
  will-change: opacity;
}

.fade-out {
  opacity: 0;
  visibility: hidden;
  transition: opacity 1.5s ease, visibility 1.5s ease;
}

.preloader-text {
  font-family: 'Roboto Slab', serif;
}

.animated-text {
  display: inline-block;
  opacity: 0;
  animation: fade-in 0.5s ease forwards;
}

.accent-selector {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
}

.accent-selector .button-red {
  cursor: pointer;
  padding: 10px;
  border: none;
  border-radius: 5px;
  color: #ffffff;
  background-color: #FF3030;
  font-size: 1rem;
}

.accent-selector .button-green {
  cursor: pointer;
  padding: 10px;
  border: none;
  border-radius: 5px;
  color: #ffffff;
  background-color: #228B22;
  font-size: 1rem;
}

.accent-selector .button-blue {
  cursor: pointer;
  padding: 10px;
  border: none;
  border-radius: 5px;
  color: #ffffff;
  background-color: #1C1F26;
  font-size: 1rem;
}

.accent-selector input {
  margin-top: 5px;
  cursor: pointer;
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes glow {
  0%, 100% {
    text-shadow: 0 0 5px var(--primary-color), 0 0 10px var(--primary-color), 0 0 20px var(--primary-color);
  }
  50% {
    text-shadow: 0 0 10px var(--primary-color), 0 0 20px var(--primary-color), 0 0 40px var(--primary-color);
  }
}

body {
  background-color:var(--background-color);
  color: var(--text-color);
}

#backToTopButton {
  opacity: 1 !important;
  visibility: visible !important;
}

#backToTopButton {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px; /* Gleiche Höhe und Breite für einen runden Button */
  height: 60px;
  border-radius: 50%; /* Rund machen */
  background-color: transparent; /* Hintergrund durchsichtig */
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3); /* Schatten für 3D-Effekt */
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
}

#backToTopButton img {
  width: 100%; /* Bild passt sich an Button-Größe an */
  height: 100%;
  object-fit: cover; /* Bild füllen ohne Verzerrung */
  border-radius: 50%; /* Bild rund machen */
}

#backToTopButton:hover {
  transform: scale(1.1); /* Leichter Hover-Effekt */
}

#backToTopButton:active {
  transform: scale(0.95); /* Klick-Effekt */
}
</style>