<template>
  <div class="app-root min-h-screen text-foreground" @click="handleClickOutside">
    <div class="site-bg" aria-hidden="true" />
    <div class="bg-mark" aria-hidden="true" />

    <!-- Flash Intro overlay: shown on /start and /home; keyed to route for replay -->
    <FlashIntro v-if="showIntro" @complete="handleIntroComplete" :key="route.fullPath" />

    <!-- Hamburger Button -->
    <header>
      <label class="menubutton" @click.stop>
        <input type="checkbox" v-model="isMenuOpen" />
        <svg viewBox="0 0 32 32">
          <path class="line line-top-bottom" d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"></path>
          <path class="line" d="M7 16 27 16"></path>
        </svg>
      </label>

      <!-- Slide-in Navigation -->
      <nav :class="[{ visible: isMenuOpen }]" id="navMenu" @click.stop>
        <div class="menu-top">
          <div class="lang-switch">
            <img v-if="currentLang==='en'" :src="flagDe" alt="Deutsch" @click="switchLang('de')" />
            <img v-else :src="flagEn" alt="English" @click="switchLang('en')" />
          </div>
        </div>
        <div class="menu-links">
          <p v-for="item in menuItems" :key="item.to">
            <RouterLink :to="item.to">{{ item.label }}</RouterLink>
          </p>

          <div class="accent-selector mt-6">
            <p class="text-sm text-zinc-400">Akzentfarbe wählen</p>
            <div class="mt-3 grid grid-cols-5 gap-2">
              <button v-for="c in colors" :key="c" :style="{background:c}" class="h-8 rounded-md border border-white/20" @click="setAccent(c)" />
            </div>
          </div>
        </div>
        <div class="footer-links mt-6 text-sm text-zinc-400">
          <RouterLink to="/impressum" class="small-link highlight-link">Impressum</RouterLink>
          |
          <RouterLink to="/datenschutz" class="small-link highlight-link">Datenschutz</RouterLink>
        </div>
      </nav>
    </header>

    <main class="app-main max-w-6xl mx-auto px-4 pt-10 pb-20">
      <RouterView />
    </main>

    <Footer />
    <div class="glass-overlay" :class="{ active: isMenuOpen }" @click="isMenuOpen=false"></div>
  </div>
  
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import Footer from './components/layout/Footer.vue'
import FlashIntro from './components/FlashIntro.vue'
import { useThemeStore } from './stores/theme'
import flagDe from '@/assets/Pictures/flag-de.webp'
import flagEn from '@/assets/Pictures/flag-us.webp'

const store = useThemeStore()
const accent = computed(() => store.accent)
const colors = ['#FF3030', '#0042ff', '#228B22', '#7c3aed', '#12b3a6']
const isMenuOpen = ref(false)
const route = useRoute()
const router = useRouter()
const currentLang = computed(() => {
  const n = String(route.name || '')
  if (n.startsWith('de-')) return 'de'
  if (n.startsWith('en-')) return 'en'
  // Fallback: heuristisch
  return route.path.startsWith('/start') ? 'de' : 'en'
})

const menuItems = computed(() => {
  if (currentLang.value === 'en') {
    return [
      { to: '/home', label: 'Home' },
      { to: '/aboutme', label: 'About me' },
      { to: '/gallery', label: 'Gallery' },
      { to: '/blog/eng', label: 'Blog' },
      { to: '/projects', label: 'Projects' },
      { to: '/contact', label: 'Contact' },
      { to: '/shop/eng', label: 'Shop' },
    ]
  }
  return [
    { to: '/start', label: 'Startseite' },
    { to: '/uebermich', label: 'Über mich' },
    { to: '/gallerie', label: 'Galerie' },
    { to: '/blog/de', label: 'Blog' },
    { to: '/projekte', label: 'Projekte' },
    { to: '/kontakt', label: 'Kontakt' },
    { to: '/shop/de', label: 'Shop' },
  ]
})

function setAccent(c) {
  store.setAccent(c)
}

onMounted(() => {
  // apply stored accent on first load
  store.setAccent(store.accent)
})

// Intro visibility logic: show on every visit to the home routes
const showIntro = ref(false)

function updateIntroVisibility(r) {
  const shouldShow = !!(r.meta && r.meta.showIntro)
  showIntro.value = shouldShow
}

watch(() => route.fullPath, () => updateIntroVisibility(route), { immediate: true })

function handleIntroComplete(){
  showIntro.value = false
}

function handleClickOutside(e){
  const nav = document.getElementById('navMenu')
  if (isMenuOpen.value && nav && !nav.contains(e.target)) {
    isMenuOpen.value = false
  }
}

function switchLang(lang){
  const name = String(route.name || '')
  const map = {
    'de-home': 'en-home', 'en-home': 'de-home',
    'de-about': 'en-about', 'en-about': 'de-about',
    'de-gallery': 'en-gallery', 'en-gallery': 'de-gallery',
    'de-blog': 'en-blog', 'en-blog': 'de-blog',
    'de-projects': 'en-projects', 'en-projects': 'de-projects',
    'de-contact': 'en-contact', 'en-contact': 'de-contact',
    'de-shop': 'en-shop', 'en-shop': 'de-shop',
    'de-impressum': 'en-publisher', 'en-publisher': 'de-impressum',
    'de-datenschutz': 'en-privacy', 'en-privacy': 'de-datenschutz',
  }
  const target = map[name] || (lang==='de' ? 'de-home' : 'en-home')
  router.push({ name: target })
  isMenuOpen.value = false
}
</script>

<style scoped>
.app-root { min-height: 100dvh; display: flex; flex-direction: column; }
.app-main { flex: 1 0 auto; }
.app-root > footer { margin-top: auto; }
.fade-enter-active, .fade-leave-active { transition: opacity .2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

#navMenu {
  position: fixed;
  top: 0; left: 0; width: 40vw; max-width: 400px; min-width: 220px; height: 100%;
  background: rgba(0,0,0,.7); backdrop-filter: blur(10px);
  transform: translateX(-100%);
  transition: transform .5s ease, opacity .5s ease; opacity: 0; z-index: 290;
  padding: 24px; border-right: 1px solid rgba(255,255,255,.1);
  padding-top: 96px; /* avoid overlap with hamburger icon */
}
#navMenu.visible { opacity: 1; transform: translateX(0); pointer-events: auto; }
.menubutton { cursor: pointer; position: fixed; top: 1.5rem; left: 2rem; z-index: 300; }
.menubutton input { display: none; }
.menubutton svg { height: 3em; transition: transform 600ms cubic-bezier(0.4, 0, 0.2, 1); }
.line { fill: none; stroke: var(--accent-raw, #12b3a6); stroke-linecap: round; stroke-linejoin: round; stroke-width: 3; transition: stroke-dasharray 600ms cubic-bezier(0.4,0,0.2,1), stroke-dashoffset 600ms cubic-bezier(0.4,0,0.2,1); }
.line-top-bottom { stroke-dasharray: 12 63; }
.menubutton input:checked + svg { transform: rotate(-45deg); }
.menubutton input:checked + svg .line-top-bottom { stroke-dasharray: 20 300; stroke-dashoffset: -32.42; }
.glass-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.5); opacity: 0; pointer-events: none; transition: opacity .3s; z-index: 200; }
.glass-overlay.active { opacity: 1; pointer-events: auto; }
.menu-links p a { color: #fff; text-decoration: none; }
.menu-links p a:hover { text-decoration: underline; }
.menu-links { display:flex; flex-direction:column; gap: 10px; }

.menu-top { position: absolute; top: 0; left: 0; right: 0; padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; gap: 8px }
.home-link a{ color:#fff; font-weight:600; text-decoration:none }
.home-link a:hover{ text-decoration: underline }
.lang-switch { position: fixed; top: 1.5rem; right: 2rem; z-index: 301 }
.lang-switch img { width: 40px; height: auto; cursor: pointer; opacity: .95; filter: drop-shadow(0 1px 1px rgba(0,0,0,.4)); }
.lang-switch img:hover { opacity: 1 }

@media (max-width: 640px){
  #navMenu { width: 85vw; max-width: none; }
}

/* Desktop: keep paddings compact so footer remains visible without scrolling */
@media (min-width:1024px){
  .app-main{ padding-top: 0rem !important; padding-bottom: 0rem !important; }
} 
/* Extra compact for very short heights */
@media (min-width:1024px) and (max-height: 700px){
  .app-main{ padding-top: .75rem !important; padding-bottom: .5rem !important; }
}
</style>
