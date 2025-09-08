<template>
  <div class="relative">
    <header class="text-center py-8 relative z-10 text-white">
      <h1 class="text-3xl font-semibold">Beispiel-Galerien</h1>
      <p class="text-zinc-300">⭐Beste Erfahrung im Desktopmodus⭐</p>
    </header>
    <section class="relative z-10 px-4 max-w-6xl mx-auto">
      <h2 class="text-white text-xl mb-4">Animiert</h2>
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div class="glass-card overflow-hidden cursor-pointer" @click="open('Schiebend')">
          <div class="h-40 bg-cover bg-center" :style="bg('slide')" />
          <div class="p-3 text-white">
            <h3 class="font-medium">Schiebegalerie Stadt</h3>
            <p class="text-sm text-zinc-300">Wunderschöne Stadtszenen mit Informationspanelen</p>
          </div>
        </div>
        <div class="glass-card overflow-hidden cursor-pointer" @click="open('Karten')">
          <div class="h-40 bg-cover bg-center" :style="bg('card')" />
          <div class="p-3 text-white">
            <h3 class="font-medium">Karten-Galerie</h3>
            <p class="text-sm text-zinc-300">Schräge Karten mit stilvollen Hover-Effekten</p>
          </div>
        </div>
        <div class="glass-card overflow-hidden cursor-pointer" @click="open('Raster')">
          <div class="h-40 bg-cover bg-center" :style="bg('grid')" />
          <div class="p-3 text-white">
            <h3 class="font-medium">Raster-Galerie</h3>
            <p class="text-sm text-zinc-300">Interaktives 3x3-Raster</p>
          </div>
        </div>
        <div class="glass-card overflow-hidden cursor-pointer" @click="open('Box')">
          <div class="h-40 bg-cover bg-center" :style="bg('box')" />
          <div class="p-3 text-white">
            <h3 class="font-medium">Box-Galerie</h3>
            <p class="text-sm text-zinc-300">Flexible Boxen mit Zoom-Effekt</p>
          </div>
        </div>
      </div>
    </section>

    <transition name="fade">
      <div v-if="selected" class="fixed inset-0 z-50 bg-black/90">
        <button @click="close" class="absolute top-6 left-1/2 -translate-x-1/2 bg-white/10 border border-white/20 w-10 h-10 rounded-full text-white">✕</button>
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

const selected = ref(null)
function open(type) { selected.value = type }
function close() { selected.value = null }
const current = computed(() => {
  switch (selected.value) {
    case 'Schiebend': return SlideGallery
    case 'Karten': return CardGallery
    case 'Raster': return GridGallery
    case 'Box': return BoxGallery
    default: return null
  }
})

function bg(kind) {
  // Platzhalter: Hintergründe, sobald Bilder kopiert sind
  return { backgroundImage: 'linear-gradient(135deg, rgba(59,130,246,.3), rgba(255,255,255,.1))' }
}
</script>
<style>
.fade-enter-active,.fade-leave-active{transition:opacity .2s ease}
.fade-enter-from,.fade-leave-to{opacity:0}
</style>
