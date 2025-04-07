<template>
  <div class="performance-page homepage-performance">
    <h1>
      {{ lang === 'de' ? 'Startseite – Performance' : 'Home Page – Performance' }}
    </h1>
    <section>
      <p v-if="lang === 'de'">
        Willkommen auf der Startseite, optimiert für beste Performance. Diese Seite wurde speziell entwickelt, um eine schnelle Ladezeit und reibungslose Interaktionen auf allen Geräten zu gewährleisten.
      </p>
      <p v-else>
        Welcome to the home page, optimized for top performance. This page has been specifically designed to ensure fast loading times and smooth interactions on all devices.
      </p>
    </section>

    <!-- Timeline-Bereich mit Animationen (nur diese Seite animiert) -->
    <div class="timeline">
      <ul>
        <li v-for="(item, index) in timelineItems" :key="index" :class="{ 'in-view': item.inView }">
          <div>
            <time>{{ item.time }}</time>
            <p>
              {{ lang === 'de' ? item.text.de : item.text.en }}
            </p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomePagePerformance",
  props: {
    lang: {
      type: String,
      default: "de"
    }
  },
  data() {
    return {
      // Beispiel-Timeline-Daten – diese können an die Originalinhalte angepasst werden
      timelineItems: [
        { time: "2021", text: { de: "Start der Reise", en: "Journey Started" }, inView: true },
        { time: "2022", text: { de: "Erster Meilenstein", en: "First Milestone" }, inView: true },
        { time: "2023", text: { de: "Weitere Fortschritte", en: "Further Progress" }, inView: true },
        { time: "2024", text: { de: "Optimierung und Perfektionierung", en: "Optimization and Perfection" }, inView: true },
        { time: "2025", text: { de: "Zukunftsvision", en: "Future Vision" }, inView: true }
      ]
    };
  },
  mounted() {
    // Optionale Logik, um die Timeline-Animationen beim Scrollen zu triggern
  }
};
</script>

<style scoped>
.performance-page {
  font-family: 'Roboto', sans-serif;
  color: #333;
  padding: 20px;
}

h1 {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 20px;
}

section {
  text-align: center;
  margin-bottom: 40px;
}

.timeline {
  margin-top: 50px;
}

.timeline ul {
  list-style: none;
  padding: 0;
}

.timeline li {
  margin: 20px 0;
  transition: transform 0.3s ease, opacity 0.3s ease;
  opacity: 0;
}

.timeline li.in-view {
  opacity: 1;
  transform: translateX(0);
}

.timeline li div {
  padding: 20px;
  background-color: #f4f4f4;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

time {
  display: block;
  font-size: 1.2rem;
  font-weight: bold;
  color: #0077b6;
  margin-bottom: 10px;
}

p {
  font-size: 1rem;
  color: #555;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateX(-50px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>