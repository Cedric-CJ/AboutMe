<template>
  <div class="box-gallery">
    <div class="header text-center">
      <span class="badge">Flexible Boxes</span>
      <h1>Box Gallery</h1>
      <p>
        A clean and modern box gallery with flexible items. Hover over a box to see it expand.
      </p>
    </div>
    <div class="boxes flex-container">
      <div
          v-for="(box, index) in boxes"
          :key="index"
          class="box-item"
      >
        <div class="box-image">
          <img :src="box.image" :alt="box.text" />
        </div>
        <span class="box-text">{{ box.text }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const boxes = [
  { image: 'https://source.unsplash.com/1000x800', text: 'CSS' },
  { image: 'https://source.unsplash.com/1000x802', text: 'Image' },
  { image: 'https://source.unsplash.com/1000x804', text: 'Hover' },
  { image: 'https://source.unsplash.com/1000x806', text: 'Effect' }
]
</script>

<style scoped>
.box-gallery {
  /* Eigene Wrapper-Regeln, um globale Einflüsse zu minimieren */
  background: transparent;
}
.header {
  margin-bottom: 2.5rem;
}
.header .badge {
  display: inline-block;
  background-color: #cffafe; /* bg-cyan-100 */
  color: #155e75; /* text-cyan-800 */
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 1rem;
}
.header h1 {
  font-size: 2.25rem;
  font-weight: bold;
  color: #1f2937; /* text-gray-900 */
  margin-bottom: 0.5rem;
}
.header p {
  font-size: 1.125rem;
  color: #6b7280; /* text-gray-500 */
  max-width: 42rem;
  margin: 0 auto;
}

.flex-container {
  display: flex;
  width: 100%;
  padding: 0 4%;
  box-sizing: border-box;
  height: 600px;
  max-width: 112rem;
  margin: 0 auto;
}

.box-item {
  flex: 1;
  overflow: hidden;
  margin: 0 2%;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: all 0.5s;
}
.box-item:hover {
  box-shadow: 0 4px 6px rgba(0,0,0,0.15);
  flex: 1 1 50%;
}
.box-image {
  height: calc(100% - 10vh);
  overflow: hidden;
}
.box-image img {
  width: 200%;
  height: 100%;
  object-fit: cover;
  transition: all 0.5s;
}
.box-image img:hover {
  width: 100%;
  height: 100%;
}
.box-text {
  display: block;
  text-align: center;
  font-size: 1.875rem;
  height: 10vh;
  line-height: 2.6;
}

/* Animation */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
.box-gallery {
  animation: fade-in 0.5s ease-out forwards;
}
</style>
