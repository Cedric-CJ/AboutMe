<template>
  <div class="BoxGallery">
    <div class="box" v-for="(box, index) in localizedBoxes" :key="index">
      <div class="placeholder">
        <img :src="box.image" :alt="box.label" />
      </div>
      <span>{{ box.label }}</span>
    </div>
  </div>
</template>
<script>
import baer from '@/assets/Pictures/Gallery/4er2/BerlinerBär.jpg'
import huhn from '@/assets/Pictures/Gallery/4er2/Huhn.jpg'
import ribe from '@/assets/Pictures/Gallery/4er2/Ribe.jpg'
import steg from '@/assets/Pictures/Gallery/4er2/Steg.jpg'

export default {
  name: 'ImageHoverEffect',
  data() {
    return {
      boxes: [
        { labelDE: 'Berliner Bär', labelEN: 'Berlin Bear', image: baer },
        { labelDE: 'Huhn', labelEN: 'Chicken', image: huhn },
        { labelDE: 'Ribe Wikinger Dorf', labelEN: 'Ribe Viking Village', image: ribe },
        { labelDE: 'Steg mit Boote', labelEN: 'Pier with Boats', image: steg }
      ]
    }
  },
  computed: {
    language() {
      return window.location.pathname.startsWith('/en') ? 'en' : 'de'
    },
    localizedBoxes() {
      return this.boxes.map(box => ({ ...box, label: this.language === 'en' ? box.labelEN : box.labelDE }))
    }
  }
}
</script>
<style scoped>
.BoxGallery {
  display: flex;
  width: 100%;
  padding: 2%;
  box-sizing: border-box;
  height: 100vh;
  gap: 1%;
}

.box {
  flex: 1;
  position: relative;
  overflow: hidden;
  transition: flex 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  will-change: flex;
  min-width: 0;
}

.placeholder { 
  width: 100%; 
  height: calc(100% - 8vh); 
  transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: height;
}

.placeholder img { 
  width: 100%; 
  height: 100%; 
  object-fit: cover;
  display: block;
}

.box > span {
  position: absolute; 
  bottom: 0; 
  left: 0; 
  width: 100%;
  font-size: clamp(1rem, 3vh, 2rem);
  text-align: center; 
  color: var(--text-color, #fff);
  text-shadow: 2px 2px 4px rgba(0,0,0,0.8); 
  background: rgba(0,0,0,0.3);
  padding: 0.5em 0; 
  box-sizing: border-box; 
  z-index: 2; 
  transition: background 0.3s ease;
}

.box:hover { 
  flex: 2; 
}

.box:hover .placeholder { 
  height: 100%; 
}

.box:hover > span {
  background: rgba(0,0,0,0.5);
}

/* Responsive Design */
@media (max-width: 768px) {
  .BoxGallery {
    flex-direction: row;
    flex-wrap: wrap;
    height: 100vh;
    padding: 1%;
    gap: 1%;
  }
  
  .box {
    flex: 1 1 48%;
    height: 48vh;
    min-height: 200px;
    margin: 0;
  }
  
  .box:hover {
    flex: 1 1 48%;
    height: 48vh;
  }
  
  .placeholder {
    height: calc(100% - 6vh);
  }
  
  .box > span {
    font-size: clamp(0.9rem, 2.5vh, 1.5rem);
  }
}

@media (max-width: 480px) {
  .BoxGallery {
    padding: 0.5%;
  }
  
  .box {
    height: 20vh;
    min-height: 150px;
  }
  
  .box:hover {
    height: 35vh;
  }
  
  .box > span {
    font-size: clamp(0.8rem, 2vh, 1.2rem);
    padding: 0.3em 0;
  }
}
</style>
