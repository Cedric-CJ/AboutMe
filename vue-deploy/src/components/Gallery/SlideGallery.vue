<template>
  <div class="slide-gallery">
    <div class="header text-center">
      <span class="badge">Slide Expansion</span>
      <h1>City Slide Gallery</h1>
      <p>
        Click to expand. Features beautiful city perspectives with detailed information.
      </p>
    </div>
    <div class="slides-container">
      <div
          v-for="(slide, index) in slides"
          :key="index"
          :class="[
          'slide-item',
          activeSlide === index ? 'active-slide' : '',
          activeSlide !== null && activeSlide !== index ? 'shrink-slide' : '',
          lastViewedSlide === index ? 'last-viewed-slide' : ''
        ]"
          @click="handleSlideClick(index)"
      >
        <div class="slide-bg" :style="{ backgroundImage: `url(${slide.image})` }"></div>
        <div class="slide-gradient"></div>
        <div class="slide-content">
          <h3>{{ slide.city }}</h3>
          <div v-if="activeSlide === index">
            <div class="slide-emblem" :style="{ backgroundImage: `url(${slide.emblem})` }"></div>
            <ul>
              <li>Country: {{ slide.country }}</li>
              <li>Founded: {{ slide.founded }}</li>
              <li>Population: {{ slide.population }}</li>
            </ul>
          </div>
          <button v-if="activeSlide === index" @click.stop="handleClose" aria-label="Close gallery">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="close-icon">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const slides = [
  {
    city: 'Venice',
    country: 'Italy',
    population: '260,060',
    founded: '697',
    image: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=800',
    emblem: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Emblem_of_Italy.svg/240px-Emblem_of_Italy.svg.png'
  },
  {
    city: 'Paris',
    country: 'France',
    population: '2.2 Million',
    founded: '~250BC',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
    emblem: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Coat_of_arms_of_the_French_Republic.svg/240px-Coat_of_arms_of_the_French_Republic.svg.png'
  },
  {
    city: 'Salzburg',
    country: 'Austria',
    population: '145,871',
    founded: '1622',
    image: 'https://images.unsplash.com/photo-1516550893885-7b7791d01bd9?w=800',
    emblem: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Austria_Bundesadler.svg/240px-Austria_Bundesadler.svg.png'
  },
  {
    city: 'Prague',
    country: 'Czech Republic',
    population: '1.2 Million',
    founded: '870',
    image: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=800',
    emblem: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Coat_of_arms_of_the_Czech_Republic.svg/240px-Coat_of_arms_of_the_Czech_Republic.svg.png'
  }
]

const activeSlide = ref(null)
const lastViewedSlide = ref(null)

const handleSlideClick = (index) => {
  if (activeSlide.value === null && lastViewedSlide.value === null) {
    activeSlide.value = index
  }
}

const handleClose = () => {
  lastViewedSlide.value = activeSlide.value
  activeSlide.value = null
  setTimeout(() => {
    lastViewedSlide.value = null
  }, 1000)
}
</script>

<style scoped>
.slide-gallery {
  animation: fade-in 0.5s ease-out forwards;
}
.header {
  margin-bottom: 2.5rem;
}
.header .badge {
  background-color: #ffebcd; /* Example: amber-100 */
  color: #d97706; /* amber-800 */
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
.slides-container {
  display: flex;
  height: 600px;
  width: 100%;
  max-width: 112rem;
  margin: 0 auto;
}
.slide-item {
  flex: 1;
  position: relative;
  overflow: hidden;
  transition: all 1s;
  cursor: pointer;
}
.active-slide {
  flex-grow: 3;
}
.shrink-slide {
  flex-grow: 0.2;
  cursor: default;
}
.last-viewed-slide {
  flex: 1;
}
.slide-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  transition: transform 0.7s;
}
.group:hover .slide-bg {
  transform: scale(1.1);
}
.slide-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
  opacity: 0.7;
  transition: opacity 0.3s;
}
.slide-content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.5rem;
  color: #ffffff;
}
.slide-content h3 {
  font-size: 1.875rem;
  font-weight: bold;
  opacity: 0;
  transform: translateY(-2.5rem);
  transition: all 0.5s;
}
.slide-item:hover .slide-content h3 {
  opacity: 1;
  transform: translateY(0);
}
.slide-emblem {
  position: absolute;
  top: 6rem;
  left: 1.5rem;
  width: 5rem;
  height: 5rem;
  background-size: contain;
  background-repeat: no-repeat;
  transition: all 0.7s 0.5s;
}
.close-icon {
  color: #000;
}
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
