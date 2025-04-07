<!-- Created by Cedric, visit my [GitHub](https://cedric-cj.github.io/AboutMe/) -->
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
        <img
          v-if="currentLanguage === 'de'"
          src="@/assets/Pictures/flag-us.webp"
          alt="English"
          @click="switchLanguage('eng')"
        />
        <img
          v-else-if="currentLanguage === 'eng'"
          src="@/assets/Pictures/flag-de.webp"
          alt="Deutsch"
          @click="switchLanguage('de')"
        />
      </div>
      <!-- Hamburger Button – immer sichtbar -->
      <label class="menubutton" @click.stop>
        <input type="checkbox" v-model="isMenuOpen" />
        <svg viewBox="0 0 32 32">
          <path class="line line-top-bottom" d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"></path>
          <path class="line" d="M7 16 27 16"></path>
        </svg>
      </label>
      <!-- Slide-in Navigation -->
      <nav
        :class="[ { blogMenu: isBlogPage }, { hidden: !isMenuOpen, visible: isMenuOpen } ]"
        id="navMenu"
        @click.stop
      >
        <div class="menu-links">
          <p>
            <router-link :to="baseAboutPath">{{ menuText.about }}</router-link>
          </p>
          <p>
            <router-link :to="baseGalleryPath">{{ menuText.gallery }}</router-link>
          </p>
          <p>
            <router-link :to="baseBlogPath">Blog</router-link>
          </p>
          <p>
            <router-link :to="baseContactPath">{{ menuText.contact }}</router-link>
          </p>
          <p v-if="!performanceMode">
            <router-link :to="baseWorkInProgressPath">{{ menuText.workInProgress }}</router-link>
          </p>
          <div class="accent-selector">
            <p>{{ menuText.chooseAccent }}</p>
            <button class="button-red" @click="setAccentColor('#FF3030')">{{ menuText.red }}</button>
            <button class="button-green" @click="setAccentColor('#228B22')">{{ menuText.green }}</button>
            <button class="button-blue" @click="setAccentColor('#0042ff')">{{ menuText.blue }}</button>
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
        <div class="performance-toggle">
          <div class="rocker-wrapper">
            <label class="rocker">
              <input type="checkbox" v-model="performanceMode" @change="togglePerformance">
              <span class="switch-left">On</span>
              <span class="switch-right">Off</span>
            </label>
            <span class="toggle-info">?</span>
            <div class="tooltip">
              Das ist der Performance button und sorgt auf ältere Geräte für eine verbesserte Erfahrung meiner Seite
            </div>
          </div>
        </div>
      </nav>
    </header>
    <component :is="currentInfoMessage" v-if="showMessage" @close-message="showMessage = false"/>
    <main>
      <router-view></router-view>
    </main>
    <footer></footer>
    <div class="glass-overlay" :class="{ active: isMenuOpen }" @click="isMenuOpen = false"></div>
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
      isMenuOpen: false,
      showMessage: true,
      showPreloader: true,
      isFadingOut: false,
      accentColor: "#10e956",
      showBackToTop: false,
      performanceMode: true
    };
  },
  created() {
    // Lade den gespeicherten Zustand (falls vorhanden)
    const storedPerformance = localStorage.getItem('performanceMode');
    if (storedPerformance !== null) {
      this.performanceMode = JSON.parse(storedPerformance);
    }
  },
  computed: {
    currentLanguage() {
      const path = this.$route.path;
      if (path.startsWith("/de")) {
        return "de";
      } else if (path.startsWith("/eng")) {
        return "eng";
      }
      // Bei Performance-Seiten oder anderen Routen: Bevorzugte Sprache nutzen
      return localStorage.getItem("preferredLanguage") || "de";
    },
    currentInfoMessage() {
      return this.currentLanguage === 'de' ? InfoMessageDe : InfoMessageEng;
    },
    menuText() {
      if (this.currentLanguage === 'de') {
        return {
          about: "Über mich",
          gallery: "Gallerie",
          contact: 'Kontakt',
          workInProgress: '...',
          chooseAccent: 'Akzentfarbe wählen:',
          red: 'Rot',
          green: 'Grün',
          blue: 'Blau',
          impressum: 'Impressum',
          privacyPolicy: 'Datenschutz',
        };
      } else {
        return {
          about: "About Me",
          gallery: "Gallery",
          contact: 'Contact',
          workInProgress: '...',
          chooseAccent: 'Choose accent color:',
          red: 'Red',
          green: 'Green',
          blue: 'Blue',
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
    isBlogPage() {
      const path = this.$route.path;
      return path === '/de/blog' || path === '/eng/blog';
    },
    // Computed Properties für die Basis-Routen:
    baseAboutPath() {
      // Wenn Performance aktiv, benutze Performance-Startseite, ansonsten immer /de
      return this.performanceMode ? '/performance' : '/de';
    },
    baseGalleryPath() {
      return this.performanceMode ? '/performance/gallery' : '/de/gallery';
    },
    baseContactPath() {
      return this.performanceMode ? '/performance/contact' : '/de/contact';
    },
    baseBlogPath() {
      return this.performanceMode ? '/performance/blog' : '/de/blog';
    },
    baseWorkInProgressPath() {
      return '/de/workInProgress';
    }
  },
  methods: {
    switchLanguage(lang) {
      localStorage.setItem('preferredLanguage', lang);
      const currentPath = this.$route.path;
      if (!currentPath.startsWith('/performance')) {
        const newPath =
            lang === "eng"
                ? currentPath.replace(/^\/de/, "/eng")
                : currentPath.replace(/^\/eng/, "/de");
        this.$router.push(newPath);
      } else {
        location.reload();
      }
    },
    handleClickOutside(event) {
      if (this.isMenuOpen &&
          !this.$el.querySelector("#navMenu").contains(event.target)) {
        this.isMenuOpen = false;
      }
    },
    getContrastYIQ(hexcolor) {
      let color = hexcolor.replace("#", "");
      if (color.length === 3) {
        color = color.split("").map((c) => c + c).join("");
      }
      const r = parseInt(color.substr(0, 2), 16);
      const g = parseInt(color.substr(2, 2), 16);
      const b = parseInt(color.substr(4, 2), 16);
      const yiq = (r * 299 + g * 587 + b * 114) / 1000;
      return yiq >= 128 ? "#000000" : "#ffffff";
    },
    setAccentColor(color) {
      this.accentColor = color;
      const contrastColor = this.getContrastYIQ(color);
      document.documentElement.style.setProperty("--primary-color", color);
      document.documentElement.style.setProperty("--special-text-color", contrastColor);
      document.documentElement.style.setProperty("--timeline-background", color);
    },
    togglePerformance() {
      localStorage.setItem('performanceMode', JSON.stringify(this.performanceMode));
      const currentPath = this.$route.path;
      if (this.performanceMode) {
        // Performance ON: Wenn aktueller Pfad NICHT bereits /performance ist,
        // ersetze den Sprachprefix (/de oder /eng) durch "/performance" und behalte den Rest bei.
        if (!currentPath.startsWith('/performance')) {
          const restOfPath = currentPath.replace(/^\/(de|eng)/, '');
          this.$router.push(`/performance${restOfPath}`);
        } else {
          // Bereits in Performance – einfach bleiben
          this.$router.push(currentPath);
        }
      } else {
        // Performance OFF: Wenn aktueller Pfad mit /performance beginnt,
        // entferne diesen Teil und füge den entsprechenden Sprachprefix ein.
        if (currentPath.startsWith('/performance')) {
          const restOfPath = currentPath.replace('/performance', '');
          const langPrefix = this.currentLanguage === 'eng' ? '/eng' : '/de';
          this.$router.push(`${langPrefix}${restOfPath}`);
        } else {
          // Falls bereits in einer Sprachroute, navigiere zur Startseite der entsprechenden Sprache.
          this.$router.push(this.currentLanguage === 'eng' ? '/eng' : '/de');
        }
      }
    }
  },
  provide() {
    return {
      performanceMode: this.performanceMode
    };
  },
  mounted() {
    setTimeout(() => {
      const animatedTexts = document.querySelectorAll(".animated-text");
      animatedTexts.forEach((text, i) => {
        text.style.opacity = "0";
        text.style.transition = "opacity 0.3s ease";
        setTimeout(() => {
          text.style.opacity = "1";
        }, i * 100);
      });
    }, 500);
    setTimeout(() => {
      const preloaderText = document.querySelector(".preloader-text");
      preloaderText.style.animation = "glow 1.5s 2 alternate";
    }, "Mit KI die IT-Welt neu definieren".length * 100 + 500);
    setTimeout(() => {
      this.isFadingOut = true;
      setTimeout(() => {
        this.showPreloader = false;
      }, 1500);
    }, 5000);
  }
};
</script>
<style scoped>
#navMenu {
  position: fixed;
  top: 0;
  left: 0;
  width: 40vw;
  max-width: 400px;
  min-width: 200px;
  height: 100%;
  background: var(--background-color);
  transform: translateX(-100%);
  transition: transform 0.5s ease, opacity 0.5s ease;
  opacity: 0;
  z-index: 290;
}
#navMenu.visible {
  opacity: 1;
  transform: translateX(0);
  pointer-events: auto;
}
header {
  position: relative;
  z-index: 300;
}
.menubutton {
  cursor: pointer;
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 300;
}
.menubutton input {
  display: none;
}
.menubutton svg {
  height: 3em;
  transition: transform 600ms cubic-bezier(0.4, 0, 0.2, 1);
}
.line {
  fill: none;
  stroke: var(--primary-color);
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 3;
  transition: stroke-dasharray 600ms cubic-bezier(0.4, 0, 0.2, 1),
  stroke-dashoffset 600ms cubic-bezier(0.4, 0, 0.2, 1);
}
.line-top-bottom {
  stroke-dasharray: 12 63;
}
.menubutton input:checked + svg {
  transform: rotate(-45deg);
}
.menubutton input:checked + svg .line-top-bottom {
  stroke-dasharray: 20 300;
  stroke-dashoffset: -32.42;
}
.language-switcher {
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 1.5rem;
  z-index: 400;
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
  background-color: var(--background-color);
  z-index: 1001;
  will-change: opacity;
}
.performance-toggle {
  margin-top: 3rem;
  padding: 1rem;
  text-align: center;
}
.rocker-wrapper {
  position: relative;
  display: inline-block;
}
.rocker {
  display: inline-block;
  position: relative;
  width: 7em;
  height: 3em;
  background-color: #eee;
  border-radius: 1.5em;
  overflow: hidden;
  font-size: 1em;
  text-transform: uppercase;
  font-weight: bold;
  cursor: pointer;
}
.rocker input {
  display: none;
}
.switch-left,
.switch-right {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s, color 0.2s;
}
.switch-left {
  left: 0;
}
.switch-right {
  right: 0;
}
.rocker input:not(:checked) + .switch-left {
  background-color: #ddd;
  color: Black;
}
.rocker input:not(:checked) + .switch-left + .switch-right {
  background-color: #FF3030;
  color: Black;
}
.rocker input:checked + .switch-left {
  background-color: var(--primary-color);
  color: Black;
  overflow: hidden;
}
.rocker input:checked + .switch-left + .switch-right {
  background-color: #ddd;
  color: Black;
}
.rocker input:checked + .switch-left::after {
  content: "";
  position: absolute;
  top: 0;
  left: -110%;
  width: 100%;
  height: 100%;
  background: linear-gradient(120deg, transparent, rgba(255,255,255,0.6), transparent);
  transform: skewX(-25deg);
}
.rocker input:checked + .switch-left:hover::after {
  animation: shine 1s forwards;
}
@keyframes shine {
  0% {
    left: -100%;
  }
  100% {
    left: 150%;
  }
}.toggle-info {
   position: absolute;
   top: -0.5em;
   right: -0.5em;
   background-color: var(--primary-color);
   color: #fff;
   width: 1.5em;
   height: 1.5em;
   border-radius: 50%;
   display: flex;
   align-items: center;
   justify-content: center;
   font-size: 0.8em;
   cursor: pointer;
   z-index: 2;
 }
.tooltip {
  visibility: hidden;
  opacity: 0;
  background-color: #333;
  color: #fff;
  border-radius: 5px;
  padding: 0.5em;
  position: absolute;
  top: -4em;
  width: 50vw;
  max-width: 90vw;
  word-wrap: break-word;
  white-space: normal;
  transition: opacity 0.3s ease;
  z-index: 10;
  font-size: 0.8em;
}
.toggle-info:hover + .tooltip,
.toggle-info:focus + .tooltip {
  visibility: visible;
  opacity: 1;
}
</style>