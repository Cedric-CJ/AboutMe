<template>
  <div class="modern-gallery-1">
    <div class="gallery-grid">
      <div v-for="(image, i) in slides" :key="i" class="img-box" @click="selectImage(i)">
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
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isEn = computed(() => String(route.name || '').startsWith('en-'))

const images = ref([
  { url: new URL('@/assets/Pictures/Gallery/Box/BerlinerBär.jpg', import.meta.url).href, titleDe: 'Berliner Bär', catDe: 'Stadt', titleEn: 'Berlin Bear', catEn: 'City' },
  { url: new URL('@/assets/Pictures/Gallery/Box/Steg.jpg', import.meta.url).href, titleDe: 'Steg', catDe: 'Landschaften', titleEn: 'Pier', catEn: 'Landscape' },
  { url: new URL('@/assets/Pictures/Gallery/Box/Ribe.jpg', import.meta.url).href, titleDe: 'Ribe', catDe: 'Orte', titleEn: 'Ribe', catEn: 'Places' },
  { url: new URL('@/assets/Pictures/Gallery/Grid/Storch.jpg', import.meta.url).href, titleDe: 'Storch', catDe: 'Natur', titleEn: 'Stork', catEn: 'Nature' },
  { url: new URL('@/assets/Pictures/Gallery/Grid/Esel.jpg', import.meta.url).href, titleDe: 'Esel', catDe: 'Tiere', titleEn: 'Donkey', catEn: 'Animals' }
])

const slides = computed(() => images.value.map(i => ({
  url: i.url,
  title: isEn.value ? i.titleEn : i.titleDe,
  category: isEn.value ? i.catEn : i.catDe
})))

function selectImage(index) {
  console.log('Selected image:', slides.value[index])
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
  .gallery-grid { gap: 8px; }
  .img-box {
    width: 48%;
    height: 160px; /* default phone: 2 across */
    margin: 1%;
    aspect-ratio: unset;
  }
  .img-box img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* consistent look in fixed-height tiles */
  }
  .overlay { align-items: flex-end; padding: 12px; }
  .caption .title { font-size: 1.05em; }
  .caption .category { font-size: 0.8em; }
}
/* 3 across on mid phones */
@media (min-width: 360px) and (max-width: 768px) {
  .img-box { width: 32%; height: 130px; margin: 0.66%; }
}
/* 4 across on wide phones */
@media (min-width: 480px) and (max-width: 768px) {
  .img-box { width: 24%; height: 120px; margin: 0.5%; }
}

@media (max-width: 350px) {
  .img-box {
    width: 98%;
    height: auto;
  }
}
</style>
