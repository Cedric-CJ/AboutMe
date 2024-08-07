### Erstellt von Cedric visit my [GitHub](https://cedric-cj.github.io/AboutMe/)
<template>
  <div class="info-message">
    <div>
      <p>
        Diese Seite nutzt keine Cookies, diesbezüglich wird laut
          <a href="https://dr-dsgvo.de/tmg-paragraph-15-nutzungsdaten/" target="_blank">§ 15 DDG</a>
          kein Cookie Manager für diese Webseite benötigt.
        </p>
      <button @click="closeMessage">Verstanden</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InfoMessage',
  methods: {
    confirmRedirect() {
      if (confirm('Sie verlassen jetzt die Seite und gelangen zur Seite des Erstellers dieser Seite. Möchten Sie fortfahren?')) {
        window.location.href = 'https://cedric-cj.github.io/AboutMe/';
      }
    },
    closeMessage() {
      this.$emit('close-message');
    }
  },
};
</script>

<style scoped>
.info-message {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  max-width: 90%;
  background-color: #333;
  color: white;
  text-align: center;
  padding: 20px;
  z-index: 1000;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.info-message p {
  margin: 0;
  padding: 0;
}

.footer-credits
{
  color: gray;
  font-size: 10px;
  padding: 2px;
  text-decoration: none;
  cursor: pointer;
  display: inline-block;
}

.info-message a {
  color: #f39c12;
  text-decoration: none;
}

.info-message button {
  margin-top: 10px;
  padding: 10px;
  border: none;
  background-color: #f39c12;
  color: white;
  cursor: pointer;
  border-radius: 5px;
}

.info-message button:hover {
  background-color: #e08e0b;
}
</style>