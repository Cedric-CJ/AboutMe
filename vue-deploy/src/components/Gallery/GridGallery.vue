Inspiration: https://codepen.io/pieter-biesemans/pen/xQOgxx
<template>
  <div class="gallery">
    <div class="message">
      Interactive! Tap a picture to enlarge, tap again to close<br>
      Made by
      <a href="https://codepen.io/pieter-biesemans/" target="_blank" title="check out my other work">
        Pieter Biesemans
      </a>
      with &#9749;, &#128420; &amp; &#8986;
    </div>
    <div class="container">
      <!-- Erzeugt 9 Elemente (1 bis 9) -->
      <template v-for="x in 9" :key="x">
        <input :id="'item' + x" type="checkbox" />
        <label :for="'item' + x" :class="'item' + x">
          Hier kommt noch ein Bild
        </label>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResponsiveGallery'
}
</script>

<style scoped>
/* Grundlegende Reset-Regeln */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Wrapper der Komponente */
.gallery {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: #333;
  font-family: "Open Sans", sans-serif;
  font-size: 1vmin;
  color: white;
}

/* Info-/Meldungsbereich */
.message {
  position: absolute;
  top: 1vw;
  width: 100%;
  text-align: center;
  font-size: 1.5em;
  line-height: 2em;
}

.message a {
  color: inherit;
  text-decoration: none;
  border-bottom: 1px solid #444;
}

.message a:hover {
  border-width: 3px;
}

/* Galerie-Container – zentriert auf der Seite */
.container {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80em;
  height: 80em;
  transform: translate(-50%, -50%);
}

/* Styling für jedes einzelne Element (Label) */
.container [class*="item"] {
  position: absolute;
  width: 33%;
  height: 33%;
  border: 1px solid transparent;
  /* Statt eines Hintergrundbilds wird hier ein Hintergrundfarbton gesetzt und der Placeholder-Text angezeigt */
  background: #555;
  transition: all 0.5s ease-in-out;
  z-index: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 10px;
}

.container [class*="item"]:hover {
  border: 1px solid white;
  z-index: 1;
}

/* Positionierung der 9 Elemente */
.container [class*="item"]:nth-of-type(1) { top: 0; left: 0; }
.container [class*="item"]:nth-of-type(2) { top: 0; left: 33%; }
.container [class*="item"]:nth-of-type(3) { top: 0; left: 66%; }
.container [class*="item"]:nth-of-type(4) { top: 33%; left: 0; }
.container [class*="item"]:nth-of-type(5) { top: 33%; left: 33%; }
.container [class*="item"]:nth-of-type(6) { top: 33%; left: 66%; }
.container [class*="item"]:nth-of-type(7) { top: 66%; left: 0; }
.container [class*="item"]:nth-of-type(8) { top: 66%; left: 33%; }
.container [class*="item"]:nth-of-type(9) { top: 66%; left: 66%; }

/* Die Checkboxes sind unsichtbar */
.container input {
  display: none;
}

/* Wenn ein Input aktiviert wird, nimmt das zugehörige Label den gesamten Container ein */
.container input:checked + [class*="item"] {
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  z-index: 2;
}
</style>