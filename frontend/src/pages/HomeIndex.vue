<template>
  <component :is="ResolvedHome" />
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import HomeDe from './Home.vue'
import HomeEn from './HomeEn.vue'

const lang = ref('de')
function readPref(){
  try {
    const p = localStorage.getItem('preferred_lang')
    if (p === 'en' || p === 'de') lang.value = p
    else lang.value = 'de'
  } catch (e) { lang.value = 'de' }
}
readPref()

function onLangChanged(){ readPref() }
onMounted(() => window.addEventListener('preferred_lang_changed', onLangChanged))
onBeforeUnmount(() => window.removeEventListener('preferred_lang_changed', onLangChanged))

const ResolvedHome = computed(() => lang.value === 'en' ? HomeEn : HomeDe)
</script>
