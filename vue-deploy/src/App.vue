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
            <router-link :to="currentLanguage === 'de' ? '/de' : '/eng'">{{ menuText.about }}</router-link>
          </p>
          <p>
            <router-link :to="currentLanguage === 'de' ? '/de/gallery' : '/eng/gallery'">{{ menuText.gallery }}</router-link>
          </p>
          <p>
            <router-link :to="currentLanguage === 'de' ? '/de/blog' : '/eng/blog'">Blog</router-link>
          </p>
          <p>
            <router-link :to="currentLanguage === 'de' ? '/de/contact' : '/eng/contact'">{{ menuText.contact }}</router-link>
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
      </nav>
    </header>
    <component :is="currentInfoMessage" v-if="showMessage" @close-message="showMessage = false"/>
    <main>
      <router-view></router-view>
    </main>
    <footer></footer>
    <!-- Glass Overlay -->
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
  computed: {
    currentLanguage() {
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
          about: "Über mich",
          gallery: "Gallerie",
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
          about: "About Me",
          gallery: "Gallery",
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
    isBlogPage() {
      const path = this.$route.path;
      return path === '/de/blog' || path === '/eng/blog';
    }
  },
  methods: {
    switchLanguage(lang) {
      localStorage.setItem('preferredLanguage', lang);

      // Aktueller Pfad, z.B. "/de/contact" oder "/eng/workInProgress"
      const currentPath = this.$route.path;
      const newPath =
        lang === "eng"
          ? currentPath.replace(/^\/de/, "/eng")
          : currentPath.replace(/^\/eng/, "/de");
      this.$router.push(newPath);
    },
    handleClickOutside(event) {
      if (
        this.isMenuOpen &&
        !this.$el.querySelector("#navMenu").contains(event.target)
      ) {
        this.isMenuOpen = false;
      }
    },
    // Berechnet den Kontrast basierend auf der YIQ-Formel
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
  },
  // Performance Mode global bereitstellen
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
  },
};
</script>
<style>
/* Header, Language-Switcher, Preloader etc. bleiben unverändert */

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
  overflow-y: auto; /* Damit das Menü scrollbar ist */
}

/* Header (inklusive Menü und Sprachwechsel) – bleibt über dem Overlay */
header {
  position: relative;
  z-index: 300;
}

/* Modernisierte Menü-Styles (Slide-in Navigation, Hamburger Button) */
.menubutton {
  cursor: pointer;
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 110;
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

/* Weitere Styles (Language-Switcher, Fullscreen Preloader) */
.language-switcher {
  position: fixed;
  top: 0;
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
</style>