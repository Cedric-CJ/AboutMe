<template>
  <div class="contact-page">
    <!-- Heading -->
    <h1 class="page-title">Kontakt</h1>

    <!-- Cards Container -->
    <div class="cards" @mousemove="handleMouseMove">
      <!-- Email Card -->
      <div class="card" @click="openEmail">
        <div class="card-content">
          <img :src="isDarkMode ? emailIconDark : emailIconLight" alt="E-Mail Icon" class="icon" />
          <span>E-Mail</span>
        </div>
      </div>

      <!-- GitHub Card -->
      <a href="https://github.com/Cedric-CJ" target="_blank" class="card">
        <div class="card-content">
          <img :src="isDarkMode ? githubIconDark : githubIconLight" alt="GitHub Icon" class="icon" />
          <span>GitHub</span>
        </div>
      </a>

      <!-- LinkedIn Card -->
      <a href="https://www.linkedin.com/in/cedric-arnhold-853a122a0" target="_blank" class="card">
        <div class="card-content">
          <img :src="isDarkMode ? linkedinIconDark : linkedinIconLight" alt="LinkedIn Icon" class="icon" />
          <span>LinkedIn</span>
        </div>
      </a>

      <!-- Discord Card -->
      <a href="https://discord.com/users/456140165094572054" target="_blank" class="card">
        <div class="card-content">
          <img :src="isDarkMode ? discordIconDark : discordIconLight" alt="Discord Icon" class="icon" />
          <span>Discord</span>
        </div>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isDarkMode: false, // Update this based on user preference
      emailIconDark: require('@/assets/icons from Icons8/email-dark.png'),
      emailIconLight: require('@/assets/icons from Icons8/email-light.png'),
      githubIconDark: require('@/assets/icons from Icons8/github-dark.svg'),
      githubIconLight: require('@/assets/icons from Icons8/Github-light.svg'),
      linkedinIconDark: require('@/assets/icons from Icons8/linkedin-dark.svg'),
      linkedinIconLight: require('@/assets/icons from Icons8/linkedin-light.svg'),
      discordIconDark: require('@/assets/icons from Icons8/discord-dark.svg'),
      discordIconLight: require('@/assets/icons from Icons8/discord-light.svg'),
    };
  },
  methods: {
    openEmail() {
      window.location.href = 'mailto:cedric.jon.arnhold+AboutMeAdministration@gmail.com';
    },
    handleMouseMove(event) {
      const cards = document.querySelectorAll(".card");
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        card.style.setProperty("--xPos", `${x}px`);
        card.style.setProperty("--yPos", `${y}px`);
      });
    }
  },
  mounted() {
    const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    this.isDarkMode = darkModeMediaQuery.matches;

    darkModeMediaQuery.addEventListener("change", (e) => {
      this.isDarkMode = e.matches;
    });
  }
};
</script>

<style>
/* Container for the entire contact page */
.contact-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 85vh;
  background-color: var(--background-color);
  color: var(--text-color);
  padding: 10px;
}

/* Heading Styles */
.page-title {
  margin-top: -5vh;
  font-size: 3rem;
  margin-bottom: 40px;
  color: var(--text-color);
}

/* Cards Container */
.cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
}

/* Card Styling */
.card {
  width: 240px;
  height: 180px;
  background: var(--card-background-color);
  border-radius: 0.5rem;
  border: 2px solid rgba(0, 255, 241, 0.1); /* Subtle border */
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  overflow: hidden;
}

/* Card hover effect */
.card:hover {
  transform: scale(0.97);
  border: 2px solid rgb(145, 65, 76); /* Glowing border */
}

.card::before {
  content: "";
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: inherit;
  background: radial-gradient(
      circle at var(--xPos, 50%) var(--yPos, 50%),
      rgba(255, 0, 50, 0.5),
      transparent 100%
  );
  transition: opacity 0.3s ease-in-out;
  opacity: 0;
}

/* Hover state for glow effect */
.card:hover::before {
  opacity: 1;
}

/* Card content - icon and text */
.card-content {
  background-color: transparent;
  border-radius: inherit;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.card-content .icon {
  width: 48px;
  height: 48px;
  margin-bottom: 10px;
}

.card-content span {
  font-size: 1.2rem;
  color: var(--text-color);
}

@media (max-width:600px) {
  .card {
    width: 20vh;
    height: 15vh;
  }
}

@media (max-width:900px) {
  .card {
    width: 14vh;
    height: 14vh;
  }
}
</style>
