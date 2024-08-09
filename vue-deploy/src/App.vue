<template>
  <div id="app" @click="handleClickOutside">
    <header>
      <button id="menuButton" @click.stop="toggleMenu">☰ Menü</button>
      <nav :class="{ hidden: isMenuHidden, visible: !isMenuHidden }" id="navMenu" @click.stop>
        <div class="menu-links">
          <p>
            <router-link to="/">Home</router-link>
          </p>
          <p>
            <router-link to="/workInProgress">...</router-link>
          </p>
        </div>
        <div class="footer-links">
          <router-link to="/Impressum" class="small-link highlight-link">Impressum</router-link> |
          <router-link to="/PrivacyPolicy" class="small-link highlight-link">Datenschutz</router-link>
          <p>&copy; 2024 Cedric Arnhold</p>
        </div>
        <div class="DarkModeToggle">
          <DarkModeToggle />
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
import DarkModeToggle from "@/components/DSGVO/DarkModeToggle.vue";
import InfoMessage from "@/components/DSGVO/InfoMessage.vue";

export default {
  name: "App",
  components: {
    DarkModeToggle,
    InfoMessage,
  },
  data() {
    return {
      isMenuHidden: true,
      showMessage: true,
    };
  },
  methods: {
    toggleMenu() {
      this.isMenuHidden = !this.isMenuHidden;
    },
    handleClickOutside(event) {
      if (!this.$el.querySelector('#navMenu').contains(event.target) && !this.isMenuHidden) {
        this.isMenuHidden = true;
      }
    }
  }
};
</script>

<style>
/* CSS für das Highlighten der Links */
.highlight-link {
  color: var(--text-color);
  text-decoration: none;
  padding: 5px;
  border: 2px solid transparent;
  transition: color 0.3s ease, border-color 0.3s ease;
}

.highlight-link:hover {
  color: var(--primary-color);
  border-color: var(--primary-color);
  background-color: var(--menu-background-color);
  border-radius: 5px;
}
</style>
