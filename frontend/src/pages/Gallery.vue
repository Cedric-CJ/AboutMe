<template>
  <div class="relative">
    <header class="text-center py-8 relative z-10 text-white">
      <h1 class="text-3xl font-semibold">Beispiel-Galerien</h1>
      <p class="text-zinc-300">⭐Beste Erfahrung im Desktopmodus⭐</p>
    </header>
    <section class="relative z-10 px-4 max-w-6xl mx-auto">
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div v-for="g in galleries" :key="g.key" class="glass-card overflow-hidden cursor-pointer" @click="open(g.key)">
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
        <button @click="close" class="absolute top-6 right-6 z-[60] bg-white/10 border border-white/20 w-10 h-10 rounded-full text-white hover:bg-white/20 transition-colors">✕</button>
        <div class="h-full flex items-center justify-center p-6">
          <component :is="current" />
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
import ModernGallery1 from '../components/gallery/ModernGallery1.vue'
import ModernGallery2 from '../components/gallery/ModernGallery2.vue'
import ModernGallery3 from '../components/gallery/ModernGallery3.vue'
import ModernGallery4 from '../components/gallery/ModernGallery4.vue'

const selected = ref(null)
const galleries = ref([
  { key:'Schiebend', title:'Schiebegalerie Stadt', desc:'Wunderschöne Stadtszenen mit Informationspanelen', img: new URL('@/assets/Pictures/Gallery/4er/Alanya.jpg', import.meta.url).href },
  { key:'Karten', title:'Karten-Galerie', desc:'Schräge Karten mit stilvollen Hover-Effekten', img: new URL('@/assets/Pictures/Gallery/4er/Tokyostore.jpg', import.meta.url).href },
  { key:'Raster', title:'Raster-Galerie', desc:'Interaktives 3x3-Raster', img: new URL('@/assets/Pictures/Gallery/4er/Schloss_Fürstlich_Drehna.jpg', import.meta.url).href },
  { key:'Box', title:'Box-Galerie', desc:'Flexible Boxen mit Zoom-Effekt', img: new URL('@/assets/Pictures/Gallery/4er/Side.jpg', import.meta.url).href },
  { key:'Modern1', title:'Hover-Galerie', desc:'Elegante Hover-Effekte mit Kategorien', img: new URL('@/assets/Pictures/Gallery/Berlin.jpg', import.meta.url).href },
  { key:'Modern2', title:'Masonry-Galerie', desc:'Dynamisches Grid mit Lightbox', img: new URL('@/assets/Pictures/Gallery/Katze1.jpg', import.meta.url).href },
  { key:'Modern3', title:'Thumbnail-Galerie', desc:'Hauptbild mit Thumbnail-Navigation', img: new URL('@/assets/Pictures/Gallery/Katze2.jpg', import.meta.url).href },
  { key:'Modern4', title:'Vergleichs-Galerie', desc:'Vorher/Nachher Schieberegler', img: new URL('@/assets/Pictures/Gallery/Storch.jpg', import.meta.url).href }
])
function open(type) { selected.value = type }
function close() { selected.value = null }
const current = computed(() => {
  switch (selected.value) {
    case 'Schiebend': return SlideGallery
    case 'Karten': return CardGallery
    case 'Raster': return GridGallery
    case 'Box': return BoxGallery
    case 'Modern1': return ModernGallery1
    case 'Modern2': return ModernGallery2
    case 'Modern3': return ModernGallery3
    case 'Modern4': return ModernGallery4
    default: return null
  }
})

// preview background no longer used – images are explicit in template
</script>
<style>
.fade-enter-active,.fade-leave-active{transition:opacity .2s ease}
.fade-enter-from,.fade-leave-to{opacity:0}
</style>
