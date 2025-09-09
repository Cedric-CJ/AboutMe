<template>
  <footer class="mt-10 border-t border-white/10">
    <div class="max-w-6xl mx-auto px-4 py-6 text-zinc-400 flex items-center justify-between text-xs sm:text-sm lg:text-base">
      <span>© {{ new Date().getFullYear() }} Cedric Arnhold</span>
      <div class="space-x-3">
        <RouterLink :to="links.publisher" class="hover:text-white">{{ labels.publisher }}</RouterLink>
        <span>|</span>
        <RouterLink :to="links.privacy" class="hover:text-white">{{ labels.privacy }}</RouterLink>
      </div>
    </div>
  </footer>
 </template>
<script setup>
import { RouterLink, useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const isEnglish = computed(() => route.fullPath.startsWith('/en'))

const labels = computed(() => isEnglish.value ? ({
  publisher: 'Publisher',
  privacy: 'Privacy'
}) : ({
  publisher: 'Impressum',
  privacy: 'Datenschutz'
}))

const links = computed(() => isEnglish.value ? ({
  publisher: '/publisher',
  privacy: '/privacy'
}) : ({
  publisher: '/impressum',
  privacy: '/datenschutz'
}))
</script>
