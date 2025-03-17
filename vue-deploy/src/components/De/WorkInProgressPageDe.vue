### Erstellt von Cedric visit my [GitHub](https://cedric-cj.github.io/AboutMe/)
<template>
  <div class="typewriter-wrapper">
    <div class="typewriter">
      <span>{{ currentText.substring(0, displayIndex) }}</span>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      texts: ["Work in progress...", "Seite in Bearbeitung..."],
      currentText: "",
      displayIndex: 0,
      isDeleting: false,
      textIndex: 0,
      typingSpeed: 100, // Geschwindigkeit des Tippens
      deletingSpeed: 50, // Geschwindigkeit des Löschens
      delayBetweenTexts: 1000, // Pause zwischen den Texten
    };
  },
  mounted() {
    this.typeText();
  },
  methods: {
    typeText() {
      const currentString = this.texts[this.textIndex];
      if (!this.isDeleting) {
        if (this.displayIndex < currentString.length) {
          this.displayIndex++;
          setTimeout(this.typeText, this.typingSpeed);
        } else {
          this.isDeleting = true;
          setTimeout(this.typeText, this.delayBetweenTexts);
        }
      } else {
        if (this.displayIndex > 0) {
          this.displayIndex--;
          setTimeout(this.typeText, this.deletingSpeed);
        } else {
          this.isDeleting = false;
          this.textIndex = (this.textIndex + 1) % this.texts.length;
          setTimeout(this.typeText, this.typingSpeed);
        }
      }
      this.currentText = currentString;
    },
  },
};
</script>
<style scoped>
.typewriter-wrapper {
  padding-top: 100px; /* Fester Abstand vom oberen Rand */
  transition: padding-top 0.3s ease; /* Weiche Animation, wenn das Padding geändert wird */
}

.typewriter {
  font-family: "Courier New", Courier, monospace;
  font-size: 2em;
  white-space: nowrap;
  border-right: 2px solid;
  overflow: hidden;
  display: inline-block;
  box-sizing: border-box;
}
</style>