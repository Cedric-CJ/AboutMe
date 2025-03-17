Inspiration: https://codepen.io/knyttneve/pen/YgZbLO
<template>
  <div class="BoxGallery">
    <div class="box" v-for="(item, index) in boxes" :key="index">
      <!-- Statt eines Bildes verwenden wir hier einen Placeholder -->
      <div class="placeholder">Hier kommt noch ein Bild</div>
      <span>{{ item.label }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "ImageHoverEffect",
  data() {
    return {
      boxes: [
        { label: "CSS" },
        { label: "Image" },
        { label: "Hover" },
        { label: "Effect" }
      ]
    };
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
  overflow: hidden;
  transition: 0.5s;
  margin: 0 2%;
  box-shadow: 0 20px 30px rgba(0, 0, 0, 0.1);
  line-height: 0;
}

/* Placeholder ersetzt das Bild und übernimmt ähnliche Maße und Übergänge */
.placeholder {
  width: 200%;
  height: calc(100% - 10vh);
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e0e0e0;
  color: #333;
  font-size: 2vh;
  transition: 0.5s;
}

.box > span {
  font-size: 3.8vh;
  display: block;
  text-align: center;
  height: 10vh;
  line-height: 2.6;
}

.box:hover {
  flex: 1 1 50%;
}

.box:hover > .placeholder {
  width: 100%;
  height: 100%;
}
</style>
