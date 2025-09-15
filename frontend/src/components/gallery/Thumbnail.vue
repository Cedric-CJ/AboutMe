<template>
  <div class="modern-gallery-3">
    <div class="thumbnail-gallery">
      <div class="main-display">
        <div class="swiper-container main-swiper">
          <div class="swiper-wrapper" :style="{ transform: `translateX(-${100*currentSlide}%)` }">
            <div v-for="(image, i) in slides" :key="i" class="swiper-slide">
              <div class="image-container" :style="{ height: containerHeight + 'px' }">
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
        <!-- Thumbnails overlayed at bottom of the image -->
        <div class="thumbnail-overlay">
          <div class="thumbnails">
            <div 
              v-for="(image, i) in slides" 
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, nextTick } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isEn = computed(() => String(route.name || '').startsWith('en-'))

const images = ref([
  { url: new URL('@/assets/Pictures/Gallery/Slide/Alanya.jpg', import.meta.url).href, titleDe: 'Alanya', descDe: 'Mittelmeer', titleEn: 'Alanya', descEn: 'Mediterranean' },
  { url: new URL('@/assets/Pictures/Gallery/Card/Wasserfall.jpg', import.meta.url).href, titleDe: 'Wasserfall', descDe: 'Natur', titleEn: 'Waterfall', descEn: 'Nature' },
  { url: new URL('@/assets/Pictures/Gallery/Card/Berge.jpg', import.meta.url).href, titleDe: 'Berge', descDe: 'Gebirge', titleEn: 'Mountains', descEn: 'Range' },
  { url: new URL('@/assets/Pictures/Gallery/Grid/Katze4.jpg', import.meta.url).href, titleDe: 'Katze', descDe: 'Tier', titleEn: 'Cat', descEn: 'Animal' }
])

const slides = computed(() => images.value.map(i => ({
  url: i.url,
  title: isEn.value ? i.titleEn : i.titleDe,
  description: isEn.value ? i.descEn : i.descDe
})))

const currentSlide = ref(0)
const containerEl = ref(null)
const containerHeight = ref(0)

// cache natural aspect ratios
const ratios = ref([])

function preloadRatios(){
  ratios.value = images.value.map(i => 1)
  images.value.forEach((it, idx) => {
    const img = new Image()
    img.onload = () => {
      if (img.naturalWidth && img.naturalHeight) {
        ratios.value[idx] = img.naturalWidth / img.naturalHeight
        recalcHeight()
      }
    }
    img.src = it.url
  })
}

function recalcHeight(){
  const root = containerEl.value
  if (!root) return
  const wrap = root.querySelector('.image-container')
  const width = root.clientWidth || (wrap ? wrap.clientWidth : 0)
  const ratio = ratios.value[currentSlide.value] || 1.6 // fallback wide
  // target height based on width/ratio, limited by viewport
  const heightByWidth = width > 0 ? width / ratio : window.innerHeight * 0.6
  const maxVh = Math.min(window.innerHeight * 0.8, 820)
  const minPx = 220
  const h = Math.max(minPx, Math.min(maxVh, heightByWidth))
  containerHeight.value = Math.round(h)
}

function onResize(){ recalcHeight() }

async function afterSlideChange(){ await nextTick(); recalcHeight() }
function nextSlide() { currentSlide.value = (currentSlide.value + 1) % images.value.length; afterSlideChange() }
function prevSlide() { currentSlide.value = currentSlide.value === 0 ? images.value.length - 1 : currentSlide.value - 1; afterSlideChange() }
function goToSlide(index) { currentSlide.value = index; afterSlideChange() }
function nextThumbs() {}
function prevThumbs() {}

onMounted(async () => {
  await nextTick()
  // root element to compute width from
  containerEl.value = document.querySelector('.main-display')
  preloadRatios()
  recalcHeight()
  window.addEventListener('resize', onResize)
  setInterval(() => { nextSlide() }, 5000)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
})
</script>

<style scoped>
.modern-gallery-3 { background: linear-gradient(135deg, #1a1a2e, #16213e); border-radius: 16px; overflow: hidden; color: white; }
/* Let the whole gallery size itself to content with safe viewport caps */
.thumbnail-gallery { display: flex; flex-direction: column; gap: 0; }
.main-display { position: relative; overflow: hidden; width: 100%; max-height: none; }
.swiper-container { width: 100%; height: auto; }
.swiper-wrapper { display: flex; transition: transform 0.5s ease; height: auto; }
.swiper-slide { min-width: 100%; height: auto; position: relative; }
.image-container { width: 100%; position: relative; display:flex; align-items:center; justify-content:center; background:#000; }
/* Show full image without cropping (force contain by giving container a height) */
.image-container img { width: 100%; height: 100%; object-fit: contain; display:block }
.image-overlay { position: absolute; bottom: 64px; left: 0; right: 0; background: linear-gradient(transparent, rgba(0,0,0,0.8)); padding: 24px 20px 16px; opacity: 0; transition: opacity 0.3s ease; }
.swiper-slide:hover .image-overlay { opacity: 1; }
.image-info h3 { font-size: 2em; margin: 0 0 10px 0; font-weight: 700; }
.image-info p { font-size: 1.1em; opacity: 0.8; margin: 0; }
.navigation { position: absolute; top: 50%; width: 100%; display: flex; justify-content: space-between; padding: 0 20px; pointer-events: none; }
.nav-btn { background: rgba(0,0,0,0.5); border: none; color: white; font-size: 2em; width: 50px; height: 50px; border-radius: 50%; cursor: pointer; pointer-events: all; transition: background 0.3s ease; }
.nav-btn:hover { background: rgba(0,0,0,0.8); }
/* Thumbnails overlay inside image */
.thumbnail-overlay { position: absolute; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.38); backdrop-filter: blur(2px); padding: 4px 8px; display: flex; align-items: center; }
.thumbnail-overlay::before { content:""; position:absolute; left:0; right:0; top:-20px; height:20px; background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.25) 100%); pointer-events:none }
.thumbnails { display: flex; gap: 8px; overflow-x: auto; flex: 1; padding: 0 4px; justify-content: center; align-items:center }
.thumbnail { position: relative; width: 68px; height: 50px; cursor: pointer; border-radius: 8px; overflow: hidden; transition: all 0.3s ease; border: 2px solid transparent; }
.thumbnail.active { border-color: #12b3a6; transform: scale(1.1); }
.thumbnail img { width: 100%; height: 100%; object-fit: cover; }
.thumb-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s ease; }
.thumbnail:hover .thumb-overlay { opacity: 1; }
/* Hide potential scrollbars across browsers */
.thumbnails { scrollbar-width: none; }
.thumbnails::-webkit-scrollbar { display: none; }
/* remove old external strip navigation */
.thumb-navigation { display: none; }
@media (max-width: 768px) {
  .thumbnail-gallery { gap: 4px; }
  .main-display { aspect-ratio: unset; max-height: none; overflow: hidden; }
  .swiper-container { height: auto; }
  .swiper-wrapper { height: auto; }
  .swiper-slide { height: auto; }
  .image-container img { width: 100%; height: 100%; object-fit: contain; }
  .thumbnail-overlay { position: absolute; left:0; right:0; bottom:0; background: rgba(0,0,0,0.42); padding: 2px 4px; }
  .thumbnails { padding: 0 2px; gap: 5px; justify-content: center; }
  .thumbnail { width: 40px; height: 28px; }
  .image-overlay { display: none; bottom: 52px; }
}
</style>
