<template>
  <div class="gallery">
    <div class="GridGallery">
      <template v-for="(img, index) in images" :key="index">
        <input :id="'item' + index" type="checkbox" />
        <label :for="'item' + index" :class="'item' + (index + 1)" :style="{ backgroundImage: 'url(' + img + ')' }">
        </label>
      </template>
    </div>
  </div>
</template>
<script>
import esel from '@/assets/Pictures/Gallery/9er/Esel.jpg'
import katze from '@/assets/Pictures/Gallery/9er/Katze1.jpg'
import katze2 from '@/assets/Pictures/Gallery/9er/Katze2.jpg'
import katze3 from '@/assets/Pictures/Gallery/9er/Katze3.jpg'
import katze4 from '@/assets/Pictures/Gallery/9er/Katze4.jpg'
import katze5 from '@/assets/Pictures/Gallery/9er/Katze5.jpg'
import katze6 from '@/assets/Pictures/Gallery/9er/Katze6.jpg'
import katze7 from '@/assets/Pictures/Gallery/9er/Katze7.jpg'
import storch from '@/assets/Pictures/Gallery/9er/Storch.jpg'
export default {
  name: 'ResponsiveGallery',
  data() {
    return {
      images: [esel, katze, katze2, katze3, katze4, katze5, katze6, katze7, storch]
    }
  }
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
.GridGallery {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 90em;
  height: 90em;
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
  box-sizing: border-box;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
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