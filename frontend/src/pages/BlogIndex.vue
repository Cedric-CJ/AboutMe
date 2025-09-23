<template>
  <component :is="ResolvedBlog" />
</template>

<script setup>
import { computed } from 'vue'
import BlogDe from './Blog.vue'
import BlogEn from './BlogEn.vue'

const ResolvedBlog = computed(() => {
  try {
    const pref = localStorage.getItem('preferred_lang')
    if (pref === 'en') return BlogEn
    return BlogDe
  } catch (e) {
    return BlogDe
  }
})
</script>
