<template>
  <div class="modern-gallery-2">
    <div class="gallery-container">
      <div v-for="(image, i) in images" :key="i" class="gallery-item" @click="openLightbox(i)">
        <img :src="image.url" :alt="image.title" />
        <div class="item-overlay">{{ image.title }}</div>
      </div>
    </div>
    
    <!-- Lightbox -->
    <div v-if="lightboxOpen" class="lightbox" @click="closeLightbox">
      <div class="lightbox-content" @click.stop>
        <img :src="images[currentIndex].url" :alt="images[currentIndex].title" />
        <div class="lightbox-title">{{ images[currentIndex].title }}</div>
        <button class="close-btn" @click="closeLightbox">×</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const images = ref([
  { url: new URL('@/assets/Pictures/Gallery/Vespa.jpg', import.meta.url).href, title: 'Vespa' },
  { url: new URL('@/assets/Pictures/Gallery/4er/Alanya.jpg', import.meta.url).href, title: 'Alanya' },
  { url: new URL('@/assets/Pictures/Gallery/4er/Tokyostore.jpg', import.meta.url).href, title: 'Tokyostore' },
  { url: new URL('@/assets/Pictures/Gallery/4er/Schloss_Fürstlich_Drehna.jpg', import.meta.url).href, title: 'Schloss Fürstlich Drehna' },
  { url: new URL('@/assets/Pictures/Gallery/4er/Side.jpg', import.meta.url).href, title: 'Side' }
])

const lightboxOpen = ref(false)
const currentIndex = ref(0)

function openLightbox(index) {
  currentIndex.value = index
  lightboxOpen.value = true
}

function closeLightbox() {
  lightboxOpen.value = false
}
</script>

<style scoped>
.modern-gallery-2 {
  padding: 20px;
  background: rgba(10, 15, 20, 0.8);
  border-radius: 16px;
}

.gallery-container {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(6, 1fr);
  gap: 0.5em;
  height: 70vh;
  max-height: 600px;
}

.gallery-item {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.gallery-item:nth-child(1) { grid-column: span 2; grid-row: span 2; }
.gallery-item:nth-child(2) { grid-column: span 3; grid-row: span 3; }
.gallery-item:nth-child(4) { grid-column: span 1; grid-row: span 2; }

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.5s ease;
}

.item-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.7);
  color: white; display: flex; align-items: center; justify-content: center;
  font-size: 1.5em; font-weight: bold; opacity: 0; transition: opacity 0.3s ease;
}

.gallery-item:hover img { filter: blur(4px); transform: scale(1.05); }
.gallery-item:hover .item-overlay { opacity: 1; }

.lightbox {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0, 0, 0, 0.9); display: flex; align-items: center; justify-content: center; z-index: 1000;
}

.lightbox-content { position: relative; max-width: 90%; max-height: 90%; }
.lightbox-content img { max-width: 100%; max-height: 100%; object-fit: contain; }
.lightbox-title { position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0, 0, 0, 0.8); color: white; padding: 1em; font-size: 1.2em; text-align: center; }

.close-btn {
  position: absolute; top: -10px; right: -10px; width: 40px; height: 40px;
  background: rgba(0, 0, 0, 0.8); color: white; border: none; border-radius: 50%; font-size: 1.5em; cursor: pointer; display: flex; align-items: center; justify-content: center;
}

@media (max-width: 800px) {
  .gallery-container { display: flex; flex-wrap: wrap; justify-content: center; height: auto; }
  .gallery-item { width: 48%; height: 200px; margin: 1%; }
  .gallery-item:nth-child(n) { grid-column: unset; grid-row: unset; }
}
</style>
