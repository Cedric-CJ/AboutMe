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

// Thumbnail-Imports (für galleryData)
import schlossImage from '@/assets/Pictures/Gallery/4er/Schloss_Fürstlich_Drehna.jpg'
import wasserfallThumb from '@/assets/Pictures/Gallery/5er/Wasserfall.jpg'
import katzeThumb from '@/assets/Pictures/Gallery/9er/Katze7.jpg'
import ribeThumb from '@/assets/Pictures/Gallery/4er2/Ribe.jpg'
import tokyostore from '@/assets/Pictures/Gallery/4er/Tokyostore.jpg'

// Für SlideGallery („Schiebend“)
import slideAlanya from '@/assets/Pictures/Gallery/4er/Alanya.jpg';
import slideSchloss from '@/assets/Pictures/Gallery/4er/Schloss_Fürstlich_Drehna.jpg';
import slideSide from '@/assets/Pictures/Gallery/4er/Side.jpg';
import slideTokyo from '@/assets/Pictures/Gallery/4er/Tokyostore.jpg';
import slideTurkey from '@/assets/Pictures/Gallery/4er/turkey.svg';
import slideTokyoFlag from '@/assets/Pictures/Gallery/4er/tokyo.svg';
import slideDeutschland from '@/assets/Pictures/Gallery/4er/deutschland.svg';

// Für CardGallery („Karten“)
import cardAlanya from '@/assets/Pictures/Gallery/5er/Alanya1.jpg';
import cardBerge from '@/assets/Pictures/Gallery/5er/Berge.jpg';
import cardHimmel from '@/assets/Pictures/Gallery/5er/Himmel.jpg';
import cardHimmel2 from '@/assets/Pictures/Gallery/5er/Himmel2.jpg';
import cardWasserfall from '@/assets/Pictures/Gallery/5er/Wasserfall.jpg';

// Für GridGallery („Raster“)
import gridEsel from '@/assets/Pictures/Gallery/9er/Esel.jpg';
import gridKatze1 from '@/assets/Pictures/Gallery/9er/Katze1.jpg';
import gridKatze2 from '@/assets/Pictures/Gallery/9er/Katze2.jpg';
import gridKatze3 from '@/assets/Pictures/Gallery/9er/Katze3.jpg';
import gridKatze4 from '@/assets/Pictures/Gallery/9er/Katze4.jpg';
import gridKatze5 from '@/assets/Pictures/Gallery/9er/Katze5.jpg';
import gridKatze6 from '@/assets/Pictures/Gallery/9er/Katze6.jpg';
import gridKatze7 from '@/assets/Pictures/Gallery/9er/Katze7.jpg';
import gridStorch from '@/assets/Pictures/Gallery/9er/Storch.jpg';

// Für BoxGallery („Box“)
import boxBär from '@/assets/Pictures/Gallery/4er2/BerlinerBär.jpg';
import boxHuhn from '@/assets/Pictures/Gallery/4er2/Huhn.jpg';
import boxRibe from '@/assets/Pictures/Gallery/4er2/Ribe.jpg';
import boxSteg from '@/assets/Pictures/Gallery/4er2/Steg.jpg';

// Definiere die Galerie-Daten
const galleryData = [
  {
    id: 'slide',
    title: 'Schiebegalerie Stadt',
    description: 'Wunderschöne Stadtszenen mit Informationspanelen',
    type: 'Schiebend',
    category: 'Animiert',
    thumbnail: schlossImage,
    images: [
      slideAlanya,
      slideSchloss,
      slideSide,
      slideTokyo,
      slideTurkey,
      slideTokyoFlag,
      slideDeutschland
    ]
  },
  {
    id: 'card',
    title: 'Karten-Galerie',
    description: 'Schräge Katzenkarten mit stilvollen Hover‑Effekten',
    type: 'Karten',
    category: 'Animiert',
    thumbnail: wasserfallThumb,
    images: [
      cardAlanya,
      cardBerge,
      cardHimmel,
      cardHimmel2,
      cardWasserfall
    ]
  },
  {
    id: 'grid',
    title: 'Raster-Galerie',
    description: 'Interaktives 3x3‑Raster mit Expand/Collapse‑Funktion',
    type: 'Raster',
    category: 'Animiert',
    thumbnail: katzeThumb,
    images: [
      gridEsel,
      gridKatze1,
      gridKatze2,
      gridKatze3,
      gridKatze4,
      gridKatze5,
      gridKatze6,
      gridKatze7,
      gridStorch
    ]
  },
  {
    id: 'box',
    title: 'Box‑Galerie',
    description: 'Flexible Boxen mit Zoom‑Effekt beim Hover',
    type: 'Box',
    category: 'Animiert',
    thumbnail: ribeThumb,
    images: [
      boxBär,
      boxHuhn,
      boxRibe,
      boxSteg
    ]
  },
  {
    id: 'static-1',
    title: 'Statische Galerie 1',
    description: 'Eine Galerie mit statischem Layout ohne Animationen',
    type: 'Statisch',
    category: 'Statisch',
    thumbnail: tokyostore,
    images: []  // Für statische Galerien werden hier keine zusätzlichen Bilder benötigt
  }
];

// Filter für die Kategorien
const animatedGalleries = computed(() => galleryData.filter(gallery => gallery.category === 'Animiert'))
const staticGalleries = computed(() => galleryData.filter(gallery => gallery.category === 'Statisch'))

const selectedGallery = ref(null)
const isLoading = ref(false)
const animateCross = ref(false)

// Preload-Funktion: Entfernt doppelte URLs, bevor die Bilder vorgeladen werden
function preloadImages(urls) {
  const uniqueUrls = Array.from(new Set(urls));
  return Promise.all(
      uniqueUrls.map(url => new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = resolve;
        img.onerror = reject;
      }))
  );
}

// Beim Klick auf eine Galerie: Finde den Eintrag und lade die dazugehörigen Bilder vor
const handleGalleryClick = (type) => {
  const galleryItem = galleryData.find(item => item.type === type);
  let galleryImageUrls = galleryItem && galleryItem.images ? galleryItem.images : [];
  // Optional: Füge das Thumbnail hinzu, falls es noch nicht drin ist
  if (galleryItem && galleryItem.thumbnail && !galleryImageUrls.includes(galleryItem.thumbnail)) {
    galleryImageUrls.unshift(galleryItem.thumbnail);
  }

  isLoading.value = true;

  const delayPromise = new Promise(resolve => setTimeout(resolve, 1500));

  // Warte sowohl auf das Vorladen der Bilder als auch auf den Delay
  Promise.all([ preloadImages(galleryImageUrls), delayPromise ])
      .then(() => {
        selectedGallery.value = type;
        isLoading.value = false;
      })
      .catch((error) => {
        console.error("Fehler beim Vorladen der Bilder:", error);
        // Im Fehlerfall trotzdem die Galerie anzeigen
        selectedGallery.value = type;
        isLoading.value = false;
      });
}

const handleClose = () => {
  animateCross.value = true;
  const overlay = document.getElementById('fullscreen-gallery');
  if (overlay) {
    overlay.classList.add('fade-out2');
  }
  setTimeout(() => {
    selectedGallery.value = null;
    animateCross.value = false;
  }, 300);
}

const currentGalleryComponent = computed(() => {
  switch (selectedGallery.value) {
    case 'Schiebend':
      return SlideGallery;
    case 'Karten':
      return CardGallery;
    case 'Raster':
      return GridGallery;
    case 'Box':
      return BoxGallery;
    default:
      return null;
  }
})

// Sprachunterstützung (über localStorage)
const currentLang = computed(() => localStorage.getItem("preferredLanguage") === "eng" ? "en" : "de")
const headerText = computed(() =>
    currentLang.value === "en" ? "Example Galleries" : "Beispiel-Galerien"
)
const subHeaderText = computed(() =>
    currentLang.value === "en" ? "⭐ Best desktop experience ⭐" : "⭐ Beste Erfahrung im Desktopmodus ⭐"
)
const animatedSectionTitle = computed(() =>
    currentLang.value === "en" ? "Animated" : "Animiert"
)
const staticSectionTitle = computed(() =>
    currentLang.value === "en" ? "Static (coming)" : "Statisch (kommt)"
)
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