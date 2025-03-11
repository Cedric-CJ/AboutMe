<template>
  <div class="gallery-showcase">
    <div class="gallery-overview">
      <div
          v-for="gallery in galleryData"
          :key="gallery.id"
          class="gallery-preview"
          @click="handleGalleryClick(gallery.type)"
      >
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

    <!-- Loading Spinner wird hier eingebunden -->
    <LoadingSpinner v-if="isLoading" />

    <!-- Fullscreen Overlay für die ausgewählte Galerie -->
    <div v-if="selectedGallery" id="fullscreen-gallery" class="fullscreen-overlay">
      <button
          @click="handleClose"
          class="close-button"
          aria-label="Close gallery"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             class="close-icon" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
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

const galleryData = [
  {
    id: 'slide',
    title: 'City Slide Gallery',
    description: 'Beautiful city slides with information panels',
    type: 'slide',
    thumbnail: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=500&auto=format&fit=crop'
  },
  {
    id: 'card',
    title: 'Card Gallery',
    description: 'Skewed cat cards with stylish hover effects',
    type: 'card',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Neugierige-Katze.JPG/640px-Neugierige-Katze.JPG'
  },
  {
    id: 'grid',
    title: 'Grid Gallery',
    description: 'Interactive 3x3 grid with expand/collapse function',
    type: 'grid',
    thumbnail: 'https://picsum.photos/750/750?image=502'
  },
  {
    id: 'box',
    title: 'Box Gallery',
    description: 'Flexible boxes with zoom effect on hover',
    type: 'box',
    thumbnail: 'https://source.unsplash.com/1000x800?w=500'
  }
]

const selectedGallery = ref(null)
const isLoading = ref(false)

const handleGalleryClick = (type) => {
  isLoading.value = true
  setTimeout(() => {
    selectedGallery.value = type
    isLoading.value = false
  }, 1500)
}

const handleClose = () => {
  const overlay = document.getElementById('fullscreen-gallery')
  if (overlay) {
    overlay.classList.add('fade-out')
  }
  setTimeout(() => {
    selectedGallery.value = null
  }, 500)
}

const currentGalleryComponent = computed(() => {
  switch (selectedGallery.value) {
    case 'slide':
      return SlideGallery
    case 'card':
      return CardGallery
    case 'grid':
      return GridGallery
    case 'box':
      return BoxGallery
    default:
      return null
  }
})
</script>

<style scoped>
.gallery-showcase {
  min-height: 100vh;
  background-color: #fff;
}
.gallery-overview {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}
.gallery-preview {
  overflow: hidden;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: all 0.3s;
  cursor: pointer;
}
.gallery-preview:hover {
  box-shadow: 0 4px 6px rgba(0,0,0,0.15);
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
  background: rgba(255,255,255,0.8);
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  border-radius: 9999px;
}
.preview-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0,0,0,0.6);
  color: #fff;
  padding: 1rem;
  text-align: center;
}

.fullscreen-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  background-color: #fff;
  animation: fade-in 0.5s ease-out forwards;
  overflow: auto;
}
.close-button {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: #fff;
  border: none;
  border-radius: 50%;
  padding: 0.5rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}
.close-button:hover {
  transform: scale(1.1) rotate(90deg);
}
.fullscreen-content {
  padding: 4rem 1rem 6rem;
  max-width: 1536px;
  margin: 0 auto;
}

/* Fade-out Animation */
.fade-out {
  opacity: 0;
  visibility: hidden;
  transition: opacity 1.5s ease, visibility 1.5s ease;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
