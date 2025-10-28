<template>
  <div class="relative">
    <header class="text-center py-8 relative z-10 text-white">
      <h1 class="text-3xl font-semibold">{{ lang==='en' ? 'Sample Galleries' : 'Beispiel-Galerien' }}</h1>
      <p class="text-zinc-300">{{ lang==='en' ? '⭐Best experience on desktop⭐' : '⭐Beste Erfahrung im Desktopmodus⭐' }}</p>
    </header>
    
    <section class="relative z-10 px-4 max-w-6xl mx-auto">
      <h2 class="text-white text-xl font-semibold mb-3">{{ lang==='en' ? 'Static Galleries' : 'Statische Gallerien' }}</h2>
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
        <div v-for="g in staticGalleries" :key="g.key" class="glass-card overflow-hidden cursor-pointer" @click="open(g.key)">
          <div class="h-40 relative">
            <img :src="g.img" alt="" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black/35"></div>
            <div class="absolute inset-x-0 bottom-0 p-3 text-white">
              <h3 class="font-medium">{{ g.title }}</h3>
              <p class="text-sm text-zinc-300">{{ g.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <h2 class="text-white text-xl font-semibold mb-3">{{ lang==='en' ? 'Animated Galleries' : 'Animierte Gallerien' }}</h2>
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div v-for="g in animatedGalleries" :key="g.key" class="glass-card overflow-hidden cursor-pointer" @click="open(g.key)">
          <div class="h-40 relative">
            <img :src="g.img" alt="" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black/35"></div>
            <div class="absolute inset-x-0 bottom-0 p-3 text-white">
              <h3 class="font-medium">{{ g.title }}</h3>
              <p class="text-sm text-zinc-300">{{ g.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <transition name="fade">
      <div v-if="selected" class="fixed inset-0 z-50 bg-black/90">
        <button
          v-if="!detailOpen"
          @click="close"
          :aria-label="lang==='en' ? 'Close' : 'Schließen'"
          class="absolute left-1/2 -translate-x-1/2 bottom-4 md:top-4 md:bottom-auto z-[60]
                 bg-white/15 border border-white/30 backdrop-blur-md
                 w-11 h-11 md:w-14 md:h-14 rounded-full text-white
                 hover:bg-white/25 transition-colors shadow-lg flex items-center justify-center"
        >✕</button>
        <div class="h-full flex items-center justify-center p-6">
          <component :is="current" @detail="onDetail" />
        </div>
      </div>
    </transition>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import SlideGallery from '../components/gallery/SlideGallery.vue'
import CardGallery from '../components/gallery/CardGallery.vue'
import GridGallery from '../components/gallery/GridGallery.vue'
import BoxGallery from '../components/gallery/BoxGallery.vue'
import Hover from '../components/gallery/Hover.vue'
import Masonry from '../components/gallery/Masonry.vue'
import Thumbnail from '../components/gallery/Thumbnail.vue'
import Vergleich from '../components/gallery/Vergleich.vue'

// Language detection
const route = useRoute()
const lang = computed(() => {
  const n = String(route.name || '')
  if (n.startsWith('de-')) return 'de'
  if (n.startsWith('en-')) return 'en'
  try {
    const pref = localStorage.getItem('preferred_lang')
    if (pref === 'de' || pref === 'en') return pref
  } catch (e) {}
  return 'de'
})

// Close any open gallery overlay with ESC
function onKeydown(e){
  if (e.key === 'Escape' && selected.value){
    e.preventDefault()
    close()
  }
}
onMounted(() => { try{ window.addEventListener('keydown', onKeydown) }catch{} })
onBeforeUnmount(() => { try{ window.removeEventListener('keydown', onKeydown) }catch{} })

const selected = ref(null)
const detailOpen = ref(false)
// Static galleries (localized titles/descriptions)
const staticGalleries = computed(() => [
  { key:'Modern1', title:'Hover', desc: lang.value==='en' ? 'Elegant hover effects with categories' : 'Elegante Hover-Effekte mit Kategorien', img: new URL('@/assets/Pictures/Gallery/Box/Ribe.jpg', import.meta.url).href },
  { key:'Modern2', title:'Masonry', desc: lang.value==='en' ? 'Dynamic grid with lightbox' : 'Dynamisches Grid mit Lightbox', img: new URL('@/assets/Pictures/Gallery/Card/Himmel.jpg', import.meta.url).href },
  { key:'Modern3', title:'Thumbnail', desc: lang.value==='en' ? 'Main image with thumbnail navigation' : 'Hauptbild mit Thumbnail-Navigation', img: new URL('@/assets/Pictures/Gallery/Card/Berge.jpg', import.meta.url).href },
  { key:'Modern4', title: (lang.value==='en' ? 'Comparison' : 'Vergleich'), desc: lang.value==='en' ? 'Before/After Moon comparisons' : 'Vorher/Nachher Mond-Vergleiche', img: new URL('@/assets/Pictures/Gallery/Vergleich/Mond1.jpg', import.meta.url).href }
])
// Animated galleries (use canonical keys: Slide, Card, Grid, Box)
const animatedGalleries = computed(() => [
  { key:'Slide', title: (lang.value==='en' ? 'Sliding' : 'Schiebend'), desc: lang.value==='en' ? 'Beautiful city scenes with info panels' : 'Wunderschöne Stadtszenen mit Informationspanelen', img: new URL('@/assets/Pictures/Gallery/Slide/Alanya.jpg', import.meta.url).href },
  { key:'Card', title: (lang.value==='en' ? 'Card' : 'Karten'), desc: lang.value==='en' ? 'Tilted cards with stylish hover effects' : 'Schräge Karten mit stilvollen Hover-Effekten', img: new URL('@/assets/Pictures/Gallery/Slide/Tokyostore.jpg', import.meta.url).href },
  { key:'Grid', title: (lang.value==='en' ? 'Grid' : 'Raster'), desc: lang.value==='en' ? 'Interactive 3x3 grid' : 'Interaktives 3x3-Raster', img: new URL('@/assets/Pictures/Gallery/Slide/Schloss_Fürstlich_Drehna.jpg', import.meta.url).href },
  { key:'Box', title: 'Box', desc: lang.value==='en' ? 'Flexible boxes with zoom effect' : 'Flexible Boxen mit Zoom-Effekt', img: new URL('@/assets/Pictures/Gallery/Slide/Side.jpg', import.meta.url).href }
])
function open(type) { selected.value = type }
function close() { selected.value = null; detailOpen.value = false }
function onDetail(open){ detailOpen.value = !!open }
const current = computed(() => {
  switch (selected.value) {
    case 'Schiebend':
    case 'Slide': return SlideGallery
    case 'Karten':
    case 'Card': return CardGallery
    case 'Raster':
    case 'Grid': return GridGallery
    case 'Box': return BoxGallery
    case 'Modern1': return Hover
    case 'Modern2': return Masonry
    case 'Modern3': return Thumbnail
    case 'Modern4': return Vergleich
    default: return null
  }
})

// preview background no longer used – images are explicit in template
</script>
<style>
.fade-enter-active,.fade-leave-active{transition:opacity .2s ease}
.fade-enter-from,.fade-leave-to{opacity:0}
</style>
