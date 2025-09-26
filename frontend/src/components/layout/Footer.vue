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
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'

const route = useRoute()

// force recompute when preferred_lang changes
const __langTick = ref(0)

const currentLang = computed(() => {
  void __langTick.value
  const n = String(route.name || '')
  if (n.startsWith('de-')) return 'de'
  if (n.startsWith('en-')) return 'en'
  try {
    const pref = localStorage.getItem('preferred_lang')
    if (pref === 'de' || pref === 'en') return pref
  } catch (e) {}
  return 'de'
})

const labels = computed(() => currentLang.value === 'en' ? ({
  publisher: 'Publisher',
  privacy: 'Privacy'
}) : ({
  publisher: 'Impressum',
  privacy: 'Datenschutz'
}))

const links = computed(() => currentLang.value === 'en' ? ({
  publisher: '/publisher',
  privacy: '/privacy'
}) : ({
  publisher: '/impressum',
  privacy: '/datenschutz'
}))

// React to preferred_lang changes without reload
let onLangChanged
onMounted(() => {
  onLangChanged = () => { __langTick.value++ }
  window.addEventListener('preferred_lang_changed', onLangChanged)
})
onBeforeUnmount(() => {
  if (onLangChanged) window.removeEventListener('preferred_lang_changed', onLangChanged)
})
</script>
