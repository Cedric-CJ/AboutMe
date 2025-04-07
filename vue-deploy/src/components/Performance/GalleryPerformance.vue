<template>
  <div class="performance-page gallery-performance">
    <h1>
      {{ lang === 'de' ? 'Galerie – Performance' : 'Gallery – Performance' }}
    </h1>
    <section>
      <p v-if="lang === 'de'">
        Willkommen in der Galerie. Alle Inhalte wie gewohnt, aber für eine besonders schnelle Darstellung optimiert.
      </p>
      <p v-else>
        Welcome to the gallery. All content as usual, but optimized for a faster, performance-focused experience.
      </p>
    </section>
    <!-- Hier können Bilder oder weitere Galerie-Komponenten integriert werden -->
  </div>
</template>

<script>
export default {
  name: "GalleryPerformance",
  props: {
    lang: {
      type: String,
      default: "de"
    }
  }
};
</script>

<style scoped>
</style>