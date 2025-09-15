<template>
  <div class="modern-gallery-2">
    <div class="gallery-container">
      <div v-for="(image, i) in slides" :key="i" class="gallery-item" @click="openLightbox(i)">
        <img :src="image.url" :alt="image.title" />
        <div class="item-overlay">{{ image.title }}</div>
      </div>
    </div>
    
    <!-- Lightbox -->
    <div v-if="lightboxOpen" class="lightbox" @click="closeLightbox">
      <!-- Unified, prominent top-center close -->
      <button
        class="close-floating"
        aria-label="Close"
        @click.stop="closeLightbox"
      >✕</button>
      <div class="lightbox-content" @click.stop>
        <img :src="slides[currentIndex].url" :alt="slides[currentIndex].title" />
        <div class="lightbox-title">{{ slides[currentIndex].title }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isEn = computed(() => String(route.name || '').startsWith('en-'))

// Extended set to better fill the grid
const images = ref([
  { url: new URL('@/assets/Pictures/Gallery/Card/Himmel.jpg', import.meta.url).href, titleDe: 'Himmel', titleEn: 'Sky' },
  { url: new URL('@/assets/Pictures/Gallery/Card/Himmel2.jpg', import.meta.url).href, titleDe: 'Himmel 2', titleEn: 'Sky 2' },
  { url: new URL('@/assets/Pictures/Gallery/Card/Wasserfall.jpg', import.meta.url).href, titleDe: 'Wasserfall', titleEn: 'Waterfall' },
  { url: new URL('@/assets/Pictures/Gallery/Card/Berge.jpg', import.meta.url).href, titleDe: 'Berge', titleEn: 'Mountains' },
  { url: new URL('@/assets/Pictures/Gallery/Grid/Katze1.jpg', import.meta.url).href, titleDe: 'Katze 1', titleEn: 'Cat 1' },
  { url: new URL('@/assets/Pictures/Gallery/Grid/Katze2.jpg', import.meta.url).href, titleDe: 'Katze 2', titleEn: 'Cat 2' },
  { url: new URL('@/assets/Pictures/Gallery/Grid/Katze3.jpg', import.meta.url).href, titleDe: 'Katze 3', titleEn: 'Cat 3' },
  { url: new URL('@/assets/Pictures/Gallery/Grid/Katze4.jpg', import.meta.url).href, titleDe: 'Katze 4', titleEn: 'Cat 4' },
  { url: new URL('@/assets/Pictures/Gallery/Grid/Katze5.jpg', import.meta.url).href, titleDe: 'Katze 5', titleEn: 'Cat 5' },
  { url: new URL('@/assets/Pictures/Gallery/Grid/Katze6.jpg', import.meta.url).href, titleDe: 'Katze 6', titleEn: 'Cat 6' },
  { url: new URL('@/assets/Pictures/Gallery/Grid/Katze7.jpg', import.meta.url).href, titleDe: 'Katze 7', titleEn: 'Cat 7' },
  { url: new URL('@/assets/Pictures/Gallery/Grid/Storch.jpg', import.meta.url).href, titleDe: 'Storch', titleEn: 'Stork' },
  { url: new URL('@/assets/Pictures/Gallery/Box/Ribe.jpg', import.meta.url).href, titleDe: 'Ribe', titleEn: 'Ribe' },
  { url: new URL('@/assets/Pictures/Gallery/Box/Steg.jpg', import.meta.url).href, titleDe: 'Steg', titleEn: 'Pier' },
  { url: new URL('@/assets/Pictures/Gallery/Box/BerlinerBär.jpg', import.meta.url).href, titleDe: 'Berliner Bär', titleEn: 'Berlin Bear' },
  { url: new URL('@/assets/Pictures/Gallery/Slide/Alanya.jpg', import.meta.url).href, titleDe: 'Alanya', titleEn: 'Alanya' },
  { url: new URL('@/assets/Pictures/Gallery/Slide/Side.jpg', import.meta.url).href, titleDe: 'Side', titleEn: 'Side' },
  { url: new URL('@/assets/Pictures/Gallery/Slide/Tokyostore.jpg', import.meta.url).href, titleDe: 'Tokyo Store', titleEn: 'Tokyo Store' }
])

const slides = computed(() => images.value.map(i => ({
  url: i.url,
  title: isEn.value ? i.titleEn : i.titleDe
})))

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
  grid-auto-flow: dense; /* fill gaps nicely */
  height: calc(100vh - 10px);
  max-width: 1200px; /* center grid area on large screens */
  margin: 0 auto;
}

.gallery-item {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.gallery-item:nth-child(6n + 1) { grid-column: span 2; grid-row: span 2; }
.gallery-item:nth-child(2) { grid-column: span 3; grid-row: span 3; }
.gallery-item:nth-child(4) { grid-column: span 1; grid-row: span 2; }

.gallery-item img {
  width: 100%;
  min-height: 100%;
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

.lightbox-content { position: relative; max-width: 90%; max-height: 90%; display:flex; align-items:center; justify-content:center }
.lightbox-content img { max-width: 100%; max-height: 100%; object-fit: contain; }
.lightbox-title { position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0, 0, 0, 0.8); color: white; padding: 1em; font-size: 1.2em; text-align: center; }

.close-floating {
  position: absolute; top: 18px; left: 50%; transform: translateX(-50%);
  width: 48px; height: 48px; border-radius: 50%;
  background: rgba(255,255,255,0.15); color: #fff; border: 1px solid rgba(255,255,255,0.35);
  display:flex; align-items:center; justify-content:center;
  font-size: 20px; cursor: pointer; z-index: 1010; backdrop-filter: blur(6px);
  transition: background .2s ease, transform .2s ease;
}
.close-floating:hover { background: rgba(255,255,255,0.25); transform: translateX(-50%) scale(1.05); }
@media (max-width: 768px){
  .close-floating { width: 44px; height: 44px; font-size: 18px; top: auto; bottom: 12px; }
}

@media (max-width: 800px) {
  .gallery-container { display: flex; align-items: flex-start; flex-wrap: wrap; justify-content: center; gap: 0; height: auto; }
  .gallery-item { width: 48%; margin: 1%; height: 140px; border-radius: 10px; background: #000; }
  .gallery-item img { width: 100%; height: 100%; object-fit: cover; }
  .item-overlay { font-size: 1.1em; }
  .gallery-item:nth-child(n) { grid-column: unset; grid-row: unset; }
}
@media (max-width: 350px){
  .gallery-item { width: 98%; margin: 1%; height: 120px; }
}
/* mid phone: 3 across */
@media (min-width: 360px) and (max-width: 480px){
  .gallery-item { width: 32%; height: 110px; }
}
/* wide phone: 4 across */
@media (min-width: 480px) and (max-width: 800px){
  .gallery-item { width: 24%; height: 110px; }
}
</style>
