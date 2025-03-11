<template>
  <div class="card-gallery">
    <div class="header text-center">
      <span class="badge">Skewed Cards</span>
      <h1>Card Gallery</h1>
      <p>
        A dynamic skewed card gallery with hover effects. Hover over a card to see it expand.
      </p>
    </div>
    <div class="cards-container">
      <div
          v-for="(card, index) in cards"
          :key="index"
          class="card-item"
      >
        <img :src="card.image" :alt="card.title" />
        <div class="card-title">{{ card.title }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
const cards = [
  { image: 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Cat_plotting_something_evil%21.jpg', title: 'Plotting Cat' },
  { image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/False_alarm_-a.jpg/1280px-False_alarm_-a.jpg', title: 'Angry Cat' },
  { image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Neugierige-Katze.JPG/1280px-Neugierige-Katze.JPG', title: 'Curious Cat' },
  { image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Al_acecho_%289272124788%29.jpg/1280px-Al_acecho_%289272124788%29.jpg', title: 'Prowling Cat' },
  { image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Mimi%26Tigsi.jpg/1280px-Mimi%26Tigsi.jpg', title: 'Sleepy Cat' }
]
</script>

<style scoped>
.card-gallery {
  animation: fade-in 0.5s ease-out forwards;
}
.header {
  margin-bottom: 2.5rem;
}
.header .badge {
  background-color: #f3e8ff; /* bg-purple-100 */
  color: #6b21a8; /* text-purple-800 */
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

.cards-container {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 112rem;
  margin: 0 auto;
  overflow: hidden;
  transform: skewX(20deg); /* Simuliert die skew-x-5 */
  height: 600px;
}

.card-item {
  flex: 1;
  height: 100%;
  position: relative;
  margin-right: 1rem;
  transition: all 1s;
}
.card-item:last-child {
  margin-right: 0;
}
.card-item:hover {
  flex-grow: 10;
}
.card-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(100%);
  transition: all 1s;
}
.card-item img:hover {
  filter: grayscale(0);
}
.card-title {
  position: absolute;
  bottom: 0;
  left: 0;
  background-color: rgba(249, 192, 203, 0.75);
  padding: 0.5rem;
  transform: rotate(-90deg);
  transform-origin: top left;
  transition: all 0.5s;
  min-width: 100%;
  text-align: center;
  font-size: 1rem;
}
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
