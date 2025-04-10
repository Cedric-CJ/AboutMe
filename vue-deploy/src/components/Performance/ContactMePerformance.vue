### Erstellt von Cedric visit my [GitHub](https://cedric-cj.github.io/AboutMe/)
<template>
  <div class="contact-page">
    <h1 class="page-title">Kontakt</h1>
    <div class="cards">
      <div class="card1" @click="openEmail">
        <div class="card-content1">
          <img :src="isDarkMode ? emailIconDark : emailIconLight" alt="E-Mail Icon" class="icon" />
          <span>E-Mail</span>
        </div>
      </div>
      <a href="https://github.com/Cedric-CJ" target="_blank" class="card1">
        <div class="card-content1">
          <img :src="isDarkMode ? githubIconDark : githubIconLight" alt="GitHub Icon" class="icon" />
          <span>GitHub</span>
        </div>
      </a>
      <a href="https://www.linkedin.com/in/cedric-arnhold-853a122a0" target="_blank" class="card1">
        <div class="card-content1">
          <img :src="isDarkMode ? linkedinIconDark : linkedinIconLight" alt="LinkedIn Icon" class="icon" />
          <span>LinkedIn</span>
        </div>
      </a>
      <a href="https://discord.com/users/456140165094572054" target="_blank" class="card1">
        <div class="card-content1">
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
      isDarkMode: false,
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
.card1 a,
.card1 a span {
  text-decoration: none;
}
.card1 {
  width: 240px;
  height: 180px;
  background: var(--card-background-color);
  border-radius: 0.5rem;
  border: 2px solid rgba(0, 255, 241, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  overflow: hidden;
}
.card1:hover {
  transform: none;
  border: 2px solid rgba(0, 255, 241, 0.1);
}
.card1::before {
  display: none;
}
.card-content1 {
  background-color: transparent;
  border-radius: inherit;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.card-content1 .icon {
  width: 48px;
  height: 48px;
  margin-bottom: 10px;
}
.card-content1 span {
  font-size: 1.2rem;
  color: var(--text-color);
}
@media (max-width:600px) {
  .card1 {
    width: 20vh;
    height: 15vh;
  }
}
@media (max-width:900px) {
  .card1 {
    width: 14vh;
    height: 14vh;
  }
  .card1,
  .card1:link,
  .card1:visited,
  .card1:hover,
  .card1:active,
  .card1 * {
    text-decoration: none;
  }
}
</style>