<template>
  <div class="relative">
    <header class="text-center py-8 relative z-10 text-white">
      <h1 class="text-3xl font-semibold">Sample Galleries</h1>
      <p class="text-zinc-300">⭐Best experience on desktop⭐</p>
    </header>
    
    <section class="relative z-10 px-4 max-w-6xl mx-auto">
      <h2 class="text-white text-xl font-semibold mb-3">Static Galleries</h2>
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

      <h2 class="text-white text-xl font-semibold mb-3">Animated Galleries</h2>
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
        <button v-if="!detailOpen" @click="close" aria-label="Close" class="absolute left-1/2 -translate-x-1/2 bottom-4 md:top-6 md:bottom-auto md:left-auto md:right-6 z-[60] bg-white/15 border border-white/30 backdrop-blur-md w-11 h-11 md:w-10 md:h-10 rounded-full text-white hover:bg-white/25 transition-colors">✕</button>
        <div class="h-full flex items-center justify-center p-6">
          <component :is="current" @detail="onDetail" />
        </div>
      </div>
    </transition>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import SlideGallery from '../components/gallery/SlideGallery.vue'
import CardGallery from '../components/gallery/CardGallery.vue'
import GridGallery from '../components/gallery/GridGallery.vue'
import BoxGallery from '../components/gallery/BoxGallery.vue'
import Hover from '../components/gallery/Hover.vue'
import Masonry from '../components/gallery/Masonry.vue'
import Thumbnail from '../components/gallery/Thumbnail.vue'
import Vergleich from '../components/gallery/Vergleich.vue'

const selected = ref(null)
const detailOpen = ref(false)
// Static: Hover, Masonry, Thumbnail, Comparison
const staticGalleries = ref([
  { key:'Modern1', title:'Hover', desc:'Elegant hover effects with lesser-seen images', img: new URL('@/assets/Pictures/Gallery/Box/Ribe.jpg', import.meta.url).href },
  { key:'Modern2', title:'Masonry', desc:'Dynamic grid with lightbox (sky and cats set)', img: new URL('@/assets/Pictures/Gallery/Card/Himmel.jpg', import.meta.url).href },
  { key:'Modern3', title:'Thumbnail', desc:'Preview: Alanya, Waterfall, Mountains, Cat', img: new URL('@/assets/Pictures/Gallery/Card/Berge.jpg', import.meta.url).href },
  { key:'Modern4', title:'Comparison', desc:'Before/After Moon comparison', img: new URL('@/assets/Pictures/Gallery/Vergleich/Mond1.jpg', import.meta.url).href }
])
// Animated: the rest
const animatedGalleries = ref([
  { key:'Slide', title:'Sliding', desc:'Beautiful city scenes with info panels', img: new URL('@/assets/Pictures/Gallery/Slide/Alanya.jpg', import.meta.url).href },
  { key:'Card', title:'Card', desc:'Tilted cards with stylish hover effects', img: new URL('@/assets/Pictures/Gallery/Slide/Tokyostore.jpg', import.meta.url).href },
  { key:'Grid', title:'Grid', desc:'Interactive 3x3 grid', img: new URL('@/assets/Pictures/Gallery/Slide/Schloss_Fürstlich_Drehna.jpg', import.meta.url).href },
  { key:'Box', title:'Box', desc:'Flexible boxes with zoom effect', img: new URL('@/assets/Pictures/Gallery/Slide/Side.jpg', import.meta.url).href }
])
function open(type) { selected.value = type }
function close() { selected.value = null; detailOpen.value = false }
function onDetail(open){ detailOpen.value = !!open }
const current = computed(() => {
  switch (selected.value) {
    case 'Slide': return SlideGallery
    case 'Card': return CardGallery
    case 'Grid': return GridGallery
    case 'Box': return BoxGallery
    case 'Modern1': return Hover
    case 'Modern2': return Masonry
    case 'Modern3': return Thumbnail
    case 'Modern4': return Vergleich
    default: return null
  }
})
</script>
<style>
.fade-enter-active,.fade-leave-active{transition:opacity .2s ease}
.fade-enter-from,.fade-leave-to{opacity:0}
</style>
