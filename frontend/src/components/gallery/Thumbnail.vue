<template>
  <div class="modern-gallery-3">
    <div class="thumbnail-gallery">
      <div class="main-display">
        <div class="swiper-container main-swiper">
          <div class="swiper-wrapper">
            <div v-for="(image, i) in images" :key="i" class="swiper-slide">
              <div class="image-container">
                <img :src="image.url" :alt="image.title" />
                <div class="image-overlay">
                  <div class="image-info">
                    <h3>{{ image.title }}</h3>
                    <p>{{ image.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="navigation">
          <button class="nav-btn prev" @click="prevSlide">‹</button>
          <button class="nav-btn next" @click="nextSlide">›</button>
        </div>
      </div>
      
      <div class="thumbnail-strip">
        <div class="thumbnails">
          <div 
            v-for="(image, i) in images" 
            :key="i" 
            class="thumbnail"
            :class="{ active: currentSlide === i }"
            @click="goToSlide(i)"
          >
            <img :src="image.url" :alt="image.title" />
            <div class="thumb-overlay">
              <span>👁</span>
            </div>
          </div>
        </div>
        <div class="thumb-navigation">
          <button class="thumb-nav-btn" @click="prevThumbs">‹</button>
          <button class="thumb-nav-btn" @click="nextThumbs">›</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const images = ref([
  { url: new URL('@/assets/Pictures/Gallery/Vespa.jpg', import.meta.url).href, title: 'Vespa', description: 'Klassischer Roller' },
  { url: new URL('@/assets/Pictures/Gallery/4er/Alanya.jpg', import.meta.url).href, title: 'Alanya', description: 'Mittelmeer' },
  { url: new URL('@/assets/Pictures/Gallery/4er/Tokyostore.jpg', import.meta.url).href, title: 'Tokyostore', description: 'Stadtleben' },
  { url: new URL('@/assets/Pictures/Gallery/4er/Schloss_Fürstlich_Drehna.jpg', import.meta.url).href, title: 'Schloss Fürstlich Drehna', description: 'Sehenswürdigkeit' },
  { url: new URL('@/assets/Pictures/Gallery/4er/Side.jpg', import.meta.url).href, title: 'Side', description: 'Küste' }
])

const currentSlide = ref(0)

function nextSlide() { currentSlide.value = (currentSlide.value + 1) % images.value.length }
function prevSlide() { currentSlide.value = currentSlide.value === 0 ? images.value.length - 1 : currentSlide.value - 1 }
function goToSlide(index) { currentSlide.value = index }
function nextThumbs() {}
function prevThumbs() {}

onMounted(() => {
  setInterval(() => { nextSlide() }, 5000)
})
</script>

<style scoped>
.modern-gallery-3 { background: linear-gradient(135deg, #1a1a2e, #16213e); border-radius: 16px; overflow: hidden; color: white; }
.thumbnail-gallery { display: flex; flex-direction: column; height: 80vh; }
.main-display { position: relative; flex: 1; overflow: hidden; }
.swiper-container { width: 100%; height: 100%; }
.swiper-wrapper { display: flex; transition: transform 0.5s ease; transform: translateX(calc(-100% * v-bind(currentSlide))); }
.swiper-slide { min-width: 100%; height: 100%; position: relative; }
.image-container { width: 100%; height: 100%; position: relative; }
.image-container img { width: 100%; height: 100%; object-fit: cover; }
.image-overlay { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, rgba(0,0,0,0.8)); padding: 50px 30px 30px; opacity: 0; transition: opacity 0.3s ease; }
.swiper-slide:hover .image-overlay { opacity: 1; }
.image-info h3 { font-size: 2em; margin: 0 0 10px 0; font-weight: 700; }
.image-info p { font-size: 1.1em; opacity: 0.8; margin: 0; }
.navigation { position: absolute; top: 50%; width: 100%; display: flex; justify-content: space-between; padding: 0 20px; pointer-events: none; }
.nav-btn { background: rgba(0,0,0,0.5); border: none; color: white; font-size: 2em; width: 50px; height: 50px; border-radius: 50%; cursor: pointer; pointer-events: all; transition: background 0.3s ease; }
.nav-btn:hover { background: rgba(0,0,0,0.8); }
.thumbnail-strip { position: relative; background: rgba(0,0,0,0.3); padding: 20px; display: flex; align-items: center; }
.thumbnails { display: flex; gap: 12px; overflow-x: auto; flex: 1; padding: 0 40px; }
.thumbnail { position: relative; width: 80px; height: 60px; cursor: pointer; border-radius: 8px; overflow: hidden; transition: all 0.3s ease; border: 2px solid transparent; }
.thumbnail.active { border-color: #12b3a6; transform: scale(1.1); }
.thumbnail img { width: 100%; height: 100%; object-fit: cover; }
.thumb-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s ease; }
.thumbnail:hover .thumb-overlay { opacity: 1; }
.thumb-navigation { display: flex; gap: 10px; }
.thumb-nav-btn { background: rgba(255,255,255,0.1); border: none; color: white; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; transition: background 0.3s ease; }
.thumb-nav-btn:hover { background: rgba(255,255,255,0.2); }
@media (max-width: 768px) { .thumbnail-gallery { height: 60vh; } .thumbnails { padding: 0 20px; } .thumbnail { width: 60px; height: 45px; } }
</style>
