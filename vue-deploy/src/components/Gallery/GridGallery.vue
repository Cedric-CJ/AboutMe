<template>
  <div class="grid-gallery">
    <div class="header text-center">
      <span class="badge">Interactive Grid</span>
      <h1>Grid Gallery</h1>
      <p>
        Interactive! Tap a picture to enlarge, tap again to close.
        A clean 3x3 grid with smooth transitions.
      </p>
    </div>
    <div class="grid-container">
      <div
          v-for="(image, index) in images"
          :key="index"
          :class="computedGridClass(index)"
          @click="toggleExpanded(index)"
      >
        <img :src="image" :alt="`Gallery image ${index + 1}`" loading="lazy" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const images = [
  'https://picsum.photos/750/750?image=501',
  'https://picsum.photos/750/750?image=502',
  'https://picsum.photos/750/750?image=503',
  'https://picsum.photos/750/750?image=504',
  'https://picsum.photos/750/750?image=505',
  'https://picsum.photos/750/750?image=506',
  'https://picsum.photos/750/750?image=507',
  'https://picsum.photos/750/750?image=508',
  'https://picsum.photos/750/750?image=509'
]

const expandedIndex = ref(null)
const toggleExpanded = (index) => {
  expandedIndex.value = expandedIndex.value === index ? null : index
}

function getGridPosition(index) {
  const positions = [
    'top-0 left-0',      // 0
    'top-0 left-33',     // approximativ; Passe den Wert ggf. an
    'top-0 left-66',
    'top-33 left-0',
    'top-33 left-33',
    'top-33 left-66',
    'top-66 left-0',
    'top-66 left-33',
    'top-66 left-66'
  ]
  return positions[index] || ''
}

const computedGridClass = (index) => {
  if (expandedIndex.value === index) {
    return 'expanded'
  } else {
    return `grid-item ${getGridPosition(index)}`
  }
}
</script>

<style scoped>
.grid-gallery {
  animation: fade-in 0.5s ease-out forwards;
}
.header {
  margin-bottom: 2.5rem;
}
.header .badge {
  background-color: #dcfce7; /* bg-green-100 */
  color: #166534; /* text-green-800 */
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 1rem;
}
.header h1 {
  font-size: 2.25rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 0.5rem;
}
.header p {
  font-size: 1.125rem;
  color: #6b7280;
  max-width: 42rem;
  margin: 0 auto;
}
.grid-container {
  position: relative;
  width: 100%;
  max-width: 80rem;
  height: 600px;
  margin: 0 auto;
}
.grid-item {
  position: absolute;
  width: 33.33%;
  height: 33.33%;
  z-index: 0;
  transition: all 0.5s;
  border: 0;
}
.grid-item:hover {
  border: 2px solid #fff;
  z-index: 1;
}
.expanded {
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  z-index: 10 !important;
}
.grid-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}
.grid-item img:hover {
  transform: scale(1.05);
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
