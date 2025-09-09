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
      
      <h2 class="text-white text-xl mb-4 mt-8">Modern</h2>
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div class="glass-card overflow-hidden cursor-pointer" @click="open('Modern1')">
          <div class="h-40 bg-cover bg-center" :style="bg('modern1')" />
          <div class="p-3 text-white">
            <h3 class="font-medium">Hover-Galerie</h3>
            <p class="text-sm text-zinc-300">Elegante Hover-Effekte mit Kategorien</p>
          </div>
        </div>
        <div class="glass-card overflow-hidden cursor-pointer" @click="open('Modern2')">
          <div class="h-40 bg-cover bg-center" :style="bg('modern2')" />
          <div class="p-3 text-white">
            <h3 class="font-medium">Masonry-Galerie</h3>
            <p class="text-sm text-zinc-300">Dynamisches Grid mit Lightbox</p>
          </div>
        </div>
        <div class="glass-card overflow-hidden cursor-pointer" @click="open('Modern3')">
          <div class="h-40 bg-cover bg-center" :style="bg('modern3')" />
          <div class="p-3 text-white">
            <h3 class="font-medium">Thumbnail-Galerie</h3>
            <p class="text-sm text-zinc-300">Hauptbild mit Thumbnail-Navigation</p>
          </div>
        </div>
        <div class="glass-card overflow-hidden cursor-pointer" @click="open('Modern4')">
          <div class="h-40 bg-cover bg-center" :style="bg('modern4')" />
          <div class="p-3 text-white">
            <h3 class="font-medium">Vergleichs-Galerie</h3>
            <p class="text-sm text-zinc-300">Vorher/Nachher Schieberegler</p>
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

function bg(kind) {
  const previews = {
    slide: 'linear-gradient(135deg, rgba(59,130,246,.5), rgba(16,185,129,.3)), url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 60\'%3E%3Crect width=\'100\' height=\'60\' fill=\'%23374151\'/%3E%3Ctext x=\'50\' y=\'35\' text-anchor=\'middle\' fill=\'white\' font-size=\'12\'%3ESlide%3C/text%3E%3C/svg%3E")',
    card: 'linear-gradient(135deg, rgba(236,72,153,.5), rgba(168,85,247,.3)), url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 60\'%3E%3Crect width=\'100\' height=\'60\' fill=\'%23374151\'/%3E%3Ctext x=\'50\' y=\'35\' text-anchor=\'middle\' fill=\'white\' font-size=\'12\'%3ECards%3C/text%3E%3C/svg%3E")',
    grid: 'linear-gradient(135deg, rgba(34,197,94,.5), rgba(59,130,246,.3)), url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 60\'%3E%3Crect width=\'100\' height=\'60\' fill=\'%23374151\'/%3E%3Ctext x=\'50\' y=\'35\' text-anchor=\'middle\' fill=\'white\' font-size=\'12\'%3EGrid%3C/text%3E%3C/svg%3E")',
    box: 'linear-gradient(135deg, rgba(245,158,11,.5), rgba(239,68,68,.3)), url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 60\'%3E%3Crect width=\'100\' height=\'60\' fill=\'%23374151\'/%3E%3Ctext x=\'50\' y=\'35\' text-anchor=\'middle\' fill=\'white\' font-size=\'12\'%3EBox%3C/text%3E%3C/svg%3E")',
    modern1: 'linear-gradient(135deg, rgba(139,69,19,.5), rgba(160,82,45,.3)), url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 60\'%3E%3Crect width=\'100\' height=\'60\' fill=\'%23374151\'/%3E%3Ctext x=\'50\' y=\'35\' text-anchor=\'middle\' fill=\'white\' font-size=\'12\'%3EHover%3C/text%3E%3C/svg%3E")',
    modern2: 'linear-gradient(135deg, rgba(75,0,130,.5), rgba(138,43,226,.3)), url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 60\'%3E%3Crect width=\'100\' height=\'60\' fill=\'%23374151\'/%3E%3Ctext x=\'50\' y=\'35\' text-anchor=\'middle\' fill=\'white\' font-size=\'12\'%3EMasonry%3C/text%3E%3C/svg%3E")',
    modern3: 'linear-gradient(135deg, rgba(220,20,60,.5), rgba(255,20,147,.3)), url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 60\'%3E%3Crect width=\'100\' height=\'60\' fill=\'%23374151\'/%3E%3Ctext x=\'50\' y=\'35\' text-anchor=\'middle\' fill=\'white\' font-size=\'12\'%3EThumb%3C/text%3E%3C/svg%3E")',
    modern4: 'linear-gradient(135deg, rgba(0,128,128,.5), rgba(32,178,170,.3)), url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 60\'%3E%3Crect width=\'100\' height=\'60\' fill=\'%23374151\'/%3E%3Ctext x=\'50\' y=\'35\' text-anchor=\'middle\' fill=\'white\' font-size=\'12\'%3ECompare%3C/text%3E%3C/svg%3E")'
  }
  return { backgroundImage: previews[kind] || previews.slide }
}
</script>
<style>
.fade-enter-active,.fade-leave-active{transition:opacity .2s ease}
.fade-enter-from,.fade-leave-to{opacity:0}
</style>
