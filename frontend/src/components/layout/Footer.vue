<template>
  <footer class="mt-10 border-t border-white/10">
    <div class="max-w-6xl mx-auto px-4 py-6 text-xs text-zinc-400 flex items-center justify-between">
      <span>© 2025 Cedric Arnhold</span>
      <div class="space-x-3">
        <RouterLink to="/impressum" class="hover:text-white">Impressum</RouterLink>
        <span>|</span>
        <RouterLink to="/datenschutz" class="hover:text-white">Datenschutz</RouterLink>
      </div>
    </div>
  </footer>
</template>
<script setup>
import { RouterLink } from 'vue-router'
</script>
