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
import bär from '@/assets/Pictures/Gallery/4er2/BerlinerBär.jpg'
import huhn from '@/assets/Pictures/Gallery/4er2/Huhn.jpg'
import ribe from '@/assets/Pictures/Gallery/4er2/Ribe.jpg'
import steg from '@/assets/Pictures/Gallery/4er2/Steg.jpg'

export default {
  name: "ImageHoverEffect",
  data() {
    return {
      boxes: [
        { labelDE: "Berliner Bär", labelEN: "Berlin Bear", image: bär },
        { labelDE: "Huhn", labelEN: "Chicken", image: huhn },
        { labelDE: "Ribe Wikinger Dorf", labelEN: "Ribe Viking Village", image: ribe },
        { labelDE: "Steg mit Boote", labelEN: "Pier with Boats", image: steg }
      ]
    };
  },
  computed: {
    language() {
      return window.location.hash.includes('/eng/') ? 'en' : 'de'
    },
    localizedBoxes() {
      return this.boxes.map(box => ({
        ...box,
        label: this.language === 'en' ? box.labelEN : box.labelDE
      }));
    }
  }
};
</script>
<style scoped>
.BoxGallery {
  display: flex;
  width: 100%;
  padding: 4% 2%;
  box-sizing: border-box;
  height: 100vh;
}
.box {
  flex: 1;
  position: relative;
  overflow: hidden;
  transition: 0.5s ease;
  margin: 0 2%;
  box-shadow: 0 20px 30px rgba(0, 0, 0, 0.1);
}
.placeholder {
  width: 100%;
  height: calc(100% - 10vh);
  transition: 0.5s ease;
}
.placeholder img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.box > span {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  font-size: 3.8vh;
  text-align: center;
  color: var(--text-color);
  text-shadow: 4px 4px 8px rgba(0, 0, 0, 1);
  background: rgba(255, 255, 255, 0.5);
  padding: 0.5em 0;
  box-sizing: border-box;
  z-index: 2;
  transition: 0.5s ease;
}
.box:hover {
  flex: 1 1 50%;
}
.box:hover .placeholder {
  height: 100%;
}
</style>