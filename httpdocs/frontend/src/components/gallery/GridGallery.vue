<template>
  <div class="gallery">
    <div class="GridGallery">
      <template v-for="(img, index) in images" :key="index">
        <input :id="'item' + index" type="checkbox" />
        <label :for="'item' + index" :class="'item' + (index + 1)" :style="{ backgroundImage: 'url(' + img + ')' }"></label>
      </template>
    </div>
  </div>
</template>
<script>
import esel from '@/assets/Pictures/Gallery/Grid/Esel.jpg'
import katze from '@/assets/Pictures/Gallery/Grid/Katze1.jpg'
import katze2 from '@/assets/Pictures/Gallery/Grid/Katze2.jpg'
import katze3 from '@/assets/Pictures/Gallery/Grid/Katze3.jpg'
import katze4 from '@/assets/Pictures/Gallery/Grid/Katze4.jpg'
import katze5 from '@/assets/Pictures/Gallery/Grid/Katze5.jpg'
import katze6 from '@/assets/Pictures/Gallery/Grid/Katze6.jpg'
import katze7 from '@/assets/Pictures/Gallery/Grid/Katze7.jpg'
import storch from '@/assets/Pictures/Gallery/Grid/Storch.jpg'
export default {
  name: 'ResponsiveGallery',
  data() {
    return { images: [esel, katze, katze2, katze3, katze4, katze5, katze6, katze7, storch] }
  }
}
</script>
<style scoped>
.gallery { 
  position: relative; 
  width: 100vw; 
  height: 100vh; 
  overflow: hidden;
}

.GridGallery { 
  position: absolute; 
  top: 50%; 
  left: 50%; 
  width: min(90vw, 90vh); 
  height: min(90vw, 90vh); 
  transform: translate(-50%, -50%); 
}

.GridGallery [class*="item"] { 
  position: absolute; 
  width: 33.333%; 
  height: 33.333%; 
  border: 1px solid transparent; 
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
  z-index: 0; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  text-align: center; 
  padding: 5px; 
  box-sizing: border-box; 
  background-size: cover; 
  background-position: center; 
  background-repeat: no-repeat;
  cursor: pointer;
  will-change: transform, z-index;
}

.GridGallery [class*="item"]:hover { 
  border: 2px solid var(--accent-raw, #3b82f6); 
  z-index: 1;
  transform: scale(1.02);
}

.GridGallery [class*="item"]:nth-of-type(1) { top: 0; left: 0; }
.GridGallery [class*="item"]:nth-of-type(2) { top: 0; left: 33.333%; }
.GridGallery [class*="item"]:nth-of-type(3) { top: 0; left: 66.666%; }
.GridGallery [class*="item"]:nth-of-type(4) { top: 33.333%; left: 0; }
.GridGallery [class*="item"]:nth-of-type(5) { top: 33.333%; left: 33.333%; }
.GridGallery [class*="item"]:nth-of-type(6) { top: 33.333%; left: 66.666%; }
.GridGallery [class*="item"]:nth-of-type(7) { top: 66.666%; left: 0; }
.GridGallery [class*="item"]:nth-of-type(8) { top: 66.666%; left: 33.333%; }
.GridGallery [class*="item"]:nth-of-type(9) { top: 66.666%; left: 66.666%; }

.GridGallery input { display: none; }

.GridGallery input:checked + [class*="item"] { 
  top: 0 !important; 
  left: 0 !important; 
  width: 100% !important; 
  height: 100% !important; 
  z-index: 10 !important;
  transform: none !important;
  border: none !important;
}

/* Responsive Design */
@media (max-width: 768px) {
  .GridGallery { 
    width: 95vw; 
    height: 95vw; 
  }
  
  .GridGallery [class*="item"] {
    padding: 2px;
  }
  
  .GridGallery [class*="item"]:hover {
    transform: scale(1.01);
    border: 1px solid var(--accent-raw, #3b82f6);
  }
}

@media (max-width: 480px) {
  .GridGallery { 
    width: 98vw; 
    height: 98vw; 
  }
  
  .GridGallery [class*="item"] {
    padding: 1px;
  }
}

@media (orientation: landscape) and (max-height: 600px) {
  .GridGallery { 
    width: 90vh; 
    height: 90vh; 
  }
}
</style>
