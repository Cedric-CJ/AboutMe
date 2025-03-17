Inspiration: https://codepen.io/pieter-biesemans/pen/xQOgxx
<template>
  <div class="gallery">
    <div class="message">
      Interactive! Tap a picture to enlarge, tap again to close
    </div>
    <div class="GridGallery">
      <!-- Erzeugt 9 Elemente (1 bis 9) -->
      <template v-for="x in 9" :key="x">
        <input :id="'item' + x" type="checkbox" />
        <label :for="'item' + x" :class="'item' + x">
          Picture in cuming
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
.gallery {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: var(--background-color);
  font-family: "Open Sans", sans-serif;
  font-size: 1vmin;
  color: var(--text-color);
}
.message {
  position: absolute;
  top: 1vw;
  width: 100%;
  text-align: center;
  font-size: 2.5em;
  line-height: 2em;
}
.GridGallery {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 99em;
  height: 99em;
  transform: translate(-50%, -50%);
}
.GridGallery [class*="item"] {
  position: absolute;
  width: 33%;
  height: 33%;
  border: 1px solid transparent;
  background: var(--background-color);
  transition: all 0.5s ease-in-out;
  z-index: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 10px;
}
.GridGallery [class*="item"]:hover {
  border: 1px solid var(--primary-color);
  z-index: 1;
}
.GridGallery [class*="item"]:nth-of-type(1) { top: 0; left: 0; }
.GridGallery [class*="item"]:nth-of-type(2) { top: 0; left: 33%; }
.GridGallery [class*="item"]:nth-of-type(3) { top: 0; left: 66%; }
.GridGallery [class*="item"]:nth-of-type(4) { top: 33%; left: 0; }
.GridGallery [class*="item"]:nth-of-type(5) { top: 33%; left: 33%; }
.GridGallery [class*="item"]:nth-of-type(6) { top: 33%; left: 66%; }
.GridGallery [class*="item"]:nth-of-type(7) { top: 66%; left: 0; }
.GridGallery [class*="item"]:nth-of-type(8) { top: 66%; left: 33%; }
.GridGallery [class*="item"]:nth-of-type(9) { top: 66%; left: 66%; }
.GridGallery input {
  display: none;
}
.GridGallery input:checked + [class*="item"] {
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  z-index: 2;
}
</style>