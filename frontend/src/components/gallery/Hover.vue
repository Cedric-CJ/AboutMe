<template>
  <div class="modern-gallery-1">
    <div class="gallery-grid">
      <div v-for="(image, i) in images" :key="i" class="img-box" @click="selectImage(i)">
        <img :src="image.url" :alt="image.title" />
        <div class="overlay">
          <div class="caption">
            <p class="title">{{ image.title }}</p>
            <p class="category">{{ image.category }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const images = ref([
  { url: new URL('@/assets/Pictures/Gallery/Vespa.jpg', import.meta.url).href, title: 'Vespa', category: 'Fahrzeuge' },
  { url: new URL('@/assets/Pictures/Gallery/4er/Alanya.jpg', import.meta.url).href, title: 'Alanya', category: 'Städte' },
  { url: new URL('@/assets/Pictures/Gallery/4er/Tokyostore.jpg', import.meta.url).href, title: 'Tokio Store', category: 'Städte' },
  { url: new URL('@/assets/Pictures/Gallery/4er/Schloss_Fürstlich_Drehna.jpg', import.meta.url).href, title: 'Schloss Fürstlich Drehna', category: 'Sehenswürdigkeiten' },
  { url: new URL('@/assets/Pictures/Gallery/4er/Side.jpg', import.meta.url).href, title: 'Side', category: 'Landschaften' }
])

function selectImage(index) {
  console.log('Selected image:', images.value[index])
}
</script>

<style scoped>
.modern-gallery-1 {
  padding: 20px;
  background: rgba(10, 15, 20, 0.8);
  border-radius: 16px;
}

.gallery-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.img-box {
  position: relative;
  width: 350px;
  height: 250px;
  margin: 10px;
  overflow: hidden;
  cursor: pointer;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.img-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0);
  transition: background 0.3s ease;
  display: flex;
  align-items: flex-end;
  padding: 20px;
}

.caption {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
  color: white;
}

.caption .title {
  font-size: 1.2em;
  font-weight: bold;
  margin: 0;
}

.caption .category {
  font-size: 0.9em;
  opacity: 0.7;
  margin: 5px 0 0 0;
}

.img-box:hover img {
  transform: scale(1.1);
}

.img-box:hover .overlay {
  background: rgba(0, 0, 0, 0.5);
}

.img-box:hover .caption {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 768px) {
  .img-box {
    width: 48%;
    margin: 1%;
  }
}

@media (max-width: 350px) {
  .img-box {
    width: 98%;
  }
}
</style>
