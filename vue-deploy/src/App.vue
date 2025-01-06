<template>
  <div id="app" @click="handleClickOutside">
    <div v-if="showPreloader" class="preloader fullscreen" :class="{ 'fade-out': isFadingOut }">
      <svg height="100%" width="100%" viewBox="0 0 857 151">
        <g>
          <text x="50%" y="50%" text-anchor="middle" :fill="accentColor" font-size="48" dy=".35em" class="preloader-text" :style="{ fontFamily: 'Roboto Slab, serif' }">
            <tspan v-for="(letter, index) in preloaderText" :key="index" class="animated-text" :style="{ animationDelay: `${index * 0.1}s` }">
              {{ letter }}
            </tspan>
          </text>
        </g>
      </svg>
    </div>

    <header>
      <button id="menuButton" @click.stop="toggleMenu">☰ Menü</button>
      <nav :class="{ hidden: isMenuHidden, visible: !isMenuHidden }" id="navMenu" @click.stop>
        <div class="menu-links">
          <p>
            <router-link to="/">Home</router-link>
          </p>
          <p>
            <router-link to="/contact">Contact</router-link>
          </p>
          <p>
            <router-link to="/workInProgress">...</router-link>
          </p>
          <div class="accent-selector">
            <p>Akzentfarbe wählen:</p>
            <button class="button-red" @click="setAccentColor('#FF3030')">Rot</button>
            <button class="button-green" @click="setAccentColor('#228B22')">Grün</button>
            <button class="button-blue" @click="setAccentColor('#1C1F26')">Deep Navy-Blau</button>
            <label>
              Benutzerdefiniert:
              <input type="color" @input="setAccentColor($event.target.value)" />
            </label>
          </div>
        </div>
        <div class="footer-links">
          <router-link to="/Impressum" class="small-link highlight-link">Impressum</router-link> |
          <router-link to="/PrivacyPolicy" class="small-link highlight-link">Datenschutz</router-link>
          <p>&copy; 2024 Cedric Arnhold</p>
        </div>
        <button id="closeMenuButton" @click.stop="toggleMenu">←</button>
      </nav>
    </header>

    <InfoMessage v-if="showMessage" @close-message="showMessage = false" />
    <main>
      <router-view></router-view>
    </main>
    <footer>
    </footer>
  </div>
</template>

<script>
import InfoMessage from "@/components/DSGVO/InfoMessage.vue";

export default {
  name: "App",
  components: {
    InfoMessage,
  },
  data() {
    return {
      isMenuHidden: true,
      showMessage: true,
      showPreloader: true,
      isFadingOut: false,
      preloaderText: "Mit KI die IT-Welt neu definieren".split(""),
      accentColor: '#10e956', // Default accent color
    };
  },
  methods: {
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
  },
};
</script>

<style>
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
</style>