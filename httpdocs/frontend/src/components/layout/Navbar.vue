<template>
  <header class="sticky top-0 z-40">
    <div class="backdrop-blur-xl bg-black/30 border-b border-white/10">
      <div class="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <RouterLink to="/" class="text-white font-semibold">Cedric</RouterLink>
        <button class="px-3 py-1 rounded-md text-white border border-white/10 hover:bg-white/10" @click="$emit('toggleMenu')">
          Menü
        </button>
      </div>
    </div>
  </header>
</template>
<script setup>
import { RouterLink } from 'vue-router'
</script>
