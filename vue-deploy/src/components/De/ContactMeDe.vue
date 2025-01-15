<template>
  <div class="contact-page">
    <h1 class="page-title">Kontakt</h1>
    <div class="cards" @mousemove="handleMouseMove">
      <div class="card" @click="openEmail">
        <div class="card-content">
          <img :src="isDarkMode ? emailIconDark : emailIconLight" alt="E-Mail Icon" class="icon" />
          <span>E-Mail</span>
        </div>
      </div>
      <a href="https://github.com/Cedric-CJ" target="_blank" class="card">
        <div class="card-content">
          <img :src="isDarkMode ? githubIconDark : githubIconLight" alt="GitHub Icon" class="icon" />
          <span>GitHub</span>
        </div>
      </a>
      <a href="https://www.linkedin.com/in/cedric-arnhold-853a122a0" target="_blank" class="card">
        <div class="card-content">
          <img :src="isDarkMode ? linkedinIconDark : linkedinIconLight" alt="LinkedIn Icon" class="icon" />
          <span>LinkedIn</span>
        </div>
      </a>
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

.page-title {
  margin-top: -5vh;
  font-size: 3rem;
  margin-bottom: 40px;
  color: var(--text-color);
}
</style>