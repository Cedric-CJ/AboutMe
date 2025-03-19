### Erstellt von Cedric visit my [GitHub](https://cedric-cj.github.io/AboutMe/)
<template>
  <div class="gallery-showcase">
    <NorthernLights />
    <header class="gallery-header">
      <h1>Example Galleries</h1>
    </header>
    <div v-if="!selectedGallery">
      <section>
        <h2>Animated</h2>
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
        <h2>Static (will come soon)</h2>
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
      <button @click="handleClose" class="close-button" aria-label="Close gallery">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-gray-800 transition-transform duration-200" :class="{ 'rotate-animation': animateCross }" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
import NorthernLights from '@/components/northern-lights.vue'

import schlossImage from '@/assets/Pictures/Gallery/4er/Schloss_Fürstlich_Drehna.jpg'
import wasserfall from '@/assets/Pictures/Gallery/5er/Wasserfall.jpg'
import katze from '@/assets/Pictures/Gallery/9er/Katze7.jpg'
import ribe from '@/assets/Pictures/Gallery/4er2/Ribe.jpg'
import tokyostore from '@/assets/Pictures/Gallery/4er/Tokyostore.jpg'

const galleryData = [
  {
    id: 'slide',
    title: 'City Slide Gallery',
    description: 'Beautiful city slides with information panels',
    type: 'Slide',
    category: 'Animated',
    thumbnail: schlossImage
  },
  {
    id: 'card',
    title: 'Card Gallery',
    description: 'Skewed cat cards with stylish hover effects',
    type: 'Card',
    category: 'Animated',
    thumbnail: wasserfall
  },
  {
    id: 'grid',
    title: 'Grid Gallery',
    description: 'Interactive 3x3 grid with expand/collapse function',
    type: 'Grid',
    category: 'Animated',
    thumbnail: katze
  },
  {
    id: 'box',
    title: 'Box Gallery',
    description: 'Flexible boxes with zoom effect on hover',
    type: 'Box',
    category: 'Animated',
    thumbnail: ribe
  },
  {
    id: 'static-1',
    title: 'Static Gallery 1',
    description: 'A static layout gallery with no animations',
    type: 'Static',
    category: 'Static',
    thumbnail: tokyostore
  }
]
const animatedGalleries = computed(() => galleryData.filter(gallery => gallery.category === 'Animated'))
const staticGalleries = computed(() => galleryData.filter(gallery => gallery.category === 'Static'))
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
    case 'Slide':
      return SlideGallery
    case 'Card':
      return CardGallery
    case 'Grid':
      return GridGallery
    case 'Box':
      return BoxGallery
    default:
      return null
  }
})
</script>
<style scoped>
.gallery-showcase {
  position: relative;
  min-height: 100vh;
  background-color: transparent;
}
.gallery-header {
  text-align: center;
  padding: 2rem;
  color: var(--special-text-color);
  position: relative;
  z-index: 10;
}
.gallery-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}
.gallery-overview {
  width: 100%;
  max-width: 1280px;
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 2rem;
  position: relative;
  z-index: 10;
}
@media (min-width: 768px) {
  .gallery-overview {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .gallery-showcase {
    padding-top: 0;
  }
}
@media (min-width: 1024px) {
  .gallery-overview {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  .gallery-showcase {
    padding-top: 0;
  }
}
.gallery-preview {
  overflow: hidden;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
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
  transition: transform 0.5s;
}
.preview-image img:hover {
  transform: scale(1.1);
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
.rotate-animation {
  animation: rotateCross 0.2s forwards;
}
</style>