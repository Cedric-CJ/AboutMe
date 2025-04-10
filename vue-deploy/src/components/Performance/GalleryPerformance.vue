### Erstellt von Cedric visit my [GitHub](https://cedric-cj.github.io/AboutMe/)
<template>
  <div class="gallery-showcase">
    <div class="gallery-header">
      <h1>{{ headerText }}</h1>
      <p>{{ subHeaderText }}</p>
    </div>
    <div v-if="!selectedGallery">
      <section>
        <h2>{{ animatedSectionTitle }}</h2>
        <div class="gallery-overview">
          <div v-for="gallery in animatedGalleries" :key="gallery.id" class="gallery-preview" @click="handleGalleryClick(gallery.type)">
            <div class="preview-image">
              <img :src="gallery.thumbnail" :alt="gallery.title" loading="lazy" />
              <div class="preview-tag">{{ gallery.type }}</div>
              <div class="preview-info">
                <h3>{{ gallery.title }}</h3>
                <p>{{ gallery.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <h2>{{ staticSectionTitle }}</h2>
        <div class="gallery-overview">
          <div v-for="gallery in staticGalleries" :key="gallery.id" class="gallery-preview" @click="handleGalleryClick(gallery.type)">
            <div class="preview-image">
              <img :src="gallery.thumbnail" :alt="gallery.title" loading="lazy" />
              <div class="preview-tag">{{ gallery.type }}</div>
              <div class="preview-info">
                <h3>{{ gallery.title }}</h3>
                <p>{{ gallery.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <LoadingSpinner v-if="isLoading" />
    <div v-if="selectedGallery" id="fullscreen-gallery" class="fullscreen-overlay">
      <button @click="handleClose" class="close-button" aria-label="Close Gallery">
        <svg xmlns="http://www.w3.org/2000/svg" class="close-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18"></path>
          <path d="M6 6l12 12"></path>
        </svg>
      </button>
      <div class="fullscreen-content">
        <component :is="currentGalleryComponent" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import BoxGallery from '../Gallery/BoxGallery.vue'
import CardGallery from '../Gallery/CardGallery.vue'
import GridGallery from '../Gallery/GridGallery.vue'
import SlideGallery from '../Gallery/SlideGallery.vue'
import LoadingSpinner from '../Gallery/LoadingSpinner.vue'
import schlossImage from '@/assets/Pictures/Gallery/4er/Schloss_Fürstlich_Drehna.jpg'
import wasserfall from '@/assets/Pictures/Gallery/5er/Wasserfall.jpg'
import katze from '@/assets/Pictures/Gallery/9er/Katze7.jpg'
import ribe from '@/assets/Pictures/Gallery/4er2/Ribe.jpg'
import tokyostore from '@/assets/Pictures/Gallery/4er/Tokyostore.jpg'
const galleryData = [
  {
    id: 'slide',
    title: 'Schiebegalerie Stadt',
    description: 'Wunderschöne Stadtszenen mit Informationspanelen',
    type: 'Schiebend',
    category: 'Animiert',
    thumbnail: schlossImage
  },
  {
    id: 'card',
    title: 'Karten-Galerie',
    description: 'Schräge Katzenkarten mit stilvollen Hover‑Effekten',
    type: 'Karten',
    category: 'Animiert',
    thumbnail: wasserfall
  },
  {
    id: 'grid',
    title: 'Raster-Galerie',
    description: 'Interaktives 3x3‑Raster mit Expand/Collapse‑Funktion',
    type: 'Raster',
    category: 'Animiert',
    thumbnail: katze
  },
  {
    id: 'box',
    title: 'Box‑Galerie',
    description: 'Flexible Boxen mit Zoom‑Effekt beim Hover',
    type: 'Box',
    category: 'Animiert',
    thumbnail: ribe
  },
  {
    id: 'static-1',
    title: 'Statische Galerie 1',
    description: 'Eine Galerie mit statischem Layout ohne Animationen',
    type: 'Statisch',
    category: 'Statisch',
    thumbnail: tokyostore
  }
]
const animatedGalleries = computed(() => galleryData.filter(gallery => gallery.category === 'Animiert'))
const staticGalleries = computed(() => galleryData.filter(gallery => gallery.category === 'Statisch'))
const selectedGallery = ref(null)
const isLoading = ref(false)
const animateCross = ref(false)
const handleGalleryClick = (type) => {
  isLoading.value = true
  setTimeout(() => {
    selectedGallery.value = type
    isLoading.value = false
  }, 1500)
}
const handleClose = () => {
  animateCross.value = true
  const overlay = document.getElementById('fullscreen-gallery')
  if (overlay) {
    overlay.classList.add('fade-out2')
  }
  setTimeout(() => {
    selectedGallery.value = null
    animateCross.value = false
  }, 300)
}
const currentGalleryComponent = computed(() => {
  switch (selectedGallery.value) {
    case 'Schiebend':
      return SlideGallery
    case 'Karten':
      return CardGallery
    case 'Raster':
      return GridGallery
    case 'Box':
      return BoxGallery
    default:
      return null
  }
})
const currentLang = computed(() => localStorage.getItem("preferredLanguage") === "eng" ? "en" : "de")
const headerText = computed(() =>
    currentLang.value === "en" ? "Example Galleries" : "Beispiel-Galerien")
const subHeaderText = computed(() =>
    currentLang.value === "en" ? "⭐ Best desktop experience ⭐" : "⭐ Beste Erfahrung im Desktopmodus ⭐")
const animatedSectionTitle = computed(() =>
    currentLang.value === "en" ? "Animated" : "Animiert")
const staticSectionTitle = computed(() =>
    currentLang.value === "en" ? "Static (coming)" : "Statisch (kommt)")
</script>
<style scoped>
.gallery-showcase {
  padding: 1rem;
  max-width: 1280px;
  margin: 0 auto;
}
.gallery-header {
  text-align: center;
  margin-bottom: 2rem;
}
.gallery-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}
.gallery-header p {
  font-size: 1.2rem;
  color: var(--special-text-color);
}
.gallery-overview {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 2rem;
}
@media (min-width: 768px) {
  .gallery-overview {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (min-width: 1024px) {
  .gallery-overview {
    grid-template-columns: repeat(4, 1fr);
  }
}
.gallery-preview {
  overflow: hidden;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
  cursor: pointer;
}
.gallery-preview:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
}
.preview-image {
  position: relative;
  height: 16rem;
  width: 100%;
}
.preview-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}
.preview-image img:hover {
  transform: scale(1.05);
}
.preview-tag {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: var(--card-background-color);
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  border-radius: 9999px;
}
.preview-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: var(--text-color);
  padding: 1rem;
  text-align: center;
}
.fullscreen-overlay {
  position: fixed;
  inset: 0;
  z-index: 500;
  background-color: var(--background-color);
  opacity: 1;
  visibility: visible;
  transition: opacity 0.3s ease-out, visibility 0.3s ease-out;
  overflow: auto;
}
.fade-out2 {
  opacity: 0 !important;
  visibility: hidden !important;
}
.close-button {
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--blog-background-color);
  border: none;
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 60;
  transition: transform 0.3s;
}
.close-button:hover {
  transform: translateX(-50%) scale(1.1);
}
.fullscreen-content {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>