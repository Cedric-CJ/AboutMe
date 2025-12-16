<template>
  <div
    class="app-root min-h-screen text-foreground"
    :class="{ 'intro-active': showIntro, 'content-visible': contentVisible }"
    @click="handleClickOutside"
    :style="{ '--site-bg-image': `url(${heroBg})` }"
  >
    <div class="site-bg" aria-hidden="true" />

    <!-- Global Intro overlay (fades out after playing) -->
    <Intro v-if="showIntro" @complete="handleIntroComplete" />

    <!-- Hamburger Button -->
    <header class="top-nav">
      <label class="menubutton" @click.stop>
        <input type="checkbox" v-model="isMenuOpen" />
        <svg viewBox="0 0 32 32">
          <path class="line line-top-bottom" d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"></path>
          <path class="line" d="M7 16 27 16"></path>
        </svg>
      </label>

      <!-- Top Navigation -->
      <nav :class="['nav-bar', { visible: isMenuOpen }]" id="navMenu" @click.stop>
        <div class="nav-surface">
          <div class="menu-links">
            <RouterLink v-for="item in menuItems" :key="item.to" :to="item.to" class="nav-chip">{{ item.label }}</RouterLink>
            <button type="button" class="menu-contact-link nav-chip" @click="openContactFromMenu">
              {{ currentLang==='en' ? 'Contact' : 'Kontakt' }}
            </button>

            <div class="nav-chip tools-chip accent-picker">
              <button type="button" class="accent-toggle" @click="toggleAccentDropdown">
                <span class="accent-swatch"></span>
                <svg viewBox="0 0 14 14" aria-hidden="true">
                  <path d="M2 4.5 7 9.5 12 4.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <span class="tools-sep"></span>
              <button class="lang-btn" type="button" @click="switchLang(currentLang==='en' ? 'de' : 'en')">
                <img v-if="currentLang==='en'" :src="flagDe" alt="Deutsch" />
                <img v-else :src="flagEn" alt="English" />
              </button>
              <Transition name="fade">
                <div v-if="accentDropdownOpen" class="accent-dropdown" id="accentDropdown">
                  <div class="accent-list">
                    <button
                      v-for="c in colors"
                      :key="c"
                      type="button"
                      class="accent-swatch-option"
                      :style="{ background: c }"
                      @click="chooseAccent(c)"
                    />
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </nav>
    </header>

    <main class="app-main max-w-6xl mx-auto px-4 pt-10 pb-20">
      <RouterView v-slot="{ Component }">
        <Transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <Transition name="fade">
      <Contact v-if="showContact" :prefill="contactPrefill" @close="closeContactOverlay" />
    </Transition>

    <Coockiebanner :lang="currentLang" />
    <Footer />
  </div>
  
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import Footer from './components/layout/Footer.vue'
import Intro from './components/Intro.vue'
import Coockiebanner from './components/layout/Coockiebanner.vue'
import Contact from './pages/Contact.vue'
import { useThemeStore } from './stores/theme'
import flagDe from '@/assets/Pictures/flag-de-classic.svg'
import flagEn from '@/assets/Pictures/flag-us-classic.svg'
import heroBg from '@/assets/hero-bg.jpg'

const store = useThemeStore()
const colors = ['var(--accent-red)', 'var(--accent-yellow)', 'var(--accent-green)', 'var(--accent-purple)', 'var(--accent-teal)']
const isMenuOpen = ref(false)
const accentDropdownOpen = ref(false)
const route = useRoute()
const router = useRouter()
// Reactive tick to force recompute when preferred_lang changes
const __langTick = ref(0)

const currentLang = computed(() => {
  // consume tick
  void __langTick.value
  const n = String(route.name || '')
  if (n.startsWith('de-')) return 'de'
  if (n.startsWith('en-')) return 'en'
  // Unified routes like '/' or '/blog': consult preferred_lang
  try {
    const pref = localStorage.getItem('preferred_lang')
    if (pref === 'de' || pref === 'en') return pref
  } catch (e) {}
  // Fallback: heuristisch
  return route.path.startsWith('/start') ? 'de' : 'en'
})

const menuItems = computed(() => {
  if (currentLang.value === 'en') {
    return [
      { to: '/', label: 'Home' },
      { to: '/aboutme', label: 'About me' },
      { to: '/gallery', label: 'Gallery' },
      { to: '/blog', label: 'Blog' },
      { to: '/projects', label: 'Projects' },
      { to: '/service', label: 'Services' },
    ]
  }
  return [
    { to: '/', label: 'Startseite' },
    { to: '/uebermich', label: 'Über mich' },
    { to: '/gallerie', label: 'Galerie' },
    { to: '/blog', label: 'Blog' },
    { to: '/projekte', label: 'Projekte' },
    { to: '/leistungen', label: 'Leistungen' },
  ]
})

const accentLabel = computed(() => currentLang.value === 'en' ? 'Choose accent color' : 'Akzentfarbe wählen')
const legalLabels = computed(() => currentLang.value === 'en' ? ({ publisher: 'Publisher', privacy: 'Privacy' }) : ({ publisher: 'Impressum', privacy: 'Datenschutz' }))
const legalLinks = computed(() => currentLang.value === 'en' ? ({ publisher: '/publisher', privacy: '/privacy' }) : ({ publisher: '/impressum', privacy: '/datenschutz' }))

function setAccent(c) {
  store.setAccent(c)
}
function chooseAccent(c) {
  setAccent(c)
  accentDropdownOpen.value = false
}
function toggleAccentDropdown() {
  accentDropdownOpen.value = !accentDropdownOpen.value
}

onMounted(() => {
  // apply stored accent on first load
  store.setAccent(store.accent)
  // Initialize preferred language from hostname if not set yet
  try {
    const key = 'preferred_lang'
    const existing = localStorage.getItem(key)
    if (!existing && typeof window !== 'undefined') {
      const host = String(window.location.hostname || '').toLowerCase()
      let inferred = 'de'
      if (host.includes('specialcode.de')) inferred = 'en'
      if (host.includes('spezialcode.de')) inferred = 'de'
      localStorage.setItem(key, inferred)
      // notify dynamic wrappers to re-render
      window.dispatchEvent(new Event('preferred_lang_changed'))
    }
  } catch (e) { /* noop */ }
  // Evaluate intro visibility immediately on first mount (all routes)
  try { Promise.resolve().then(() => updateIntroVisibility(route)) } catch (e) { updateIntroVisibility(route) }

  // React to preferred language changes without page reload
  const onLangChanged = () => { __langTick.value++ }
  window.addEventListener('preferred_lang_changed', onLangChanged)
  // stash for cleanup
  ;(window.__app_onLangChangedHandlers ||= []).push(onLangChanged)

  // React to local storage clear action from cookie banner
  const onLocalCleared = () => {
    try {
      localStorage.removeItem('blog_read_flags')
      localStorage.removeItem('special_themes_enabled')
      // if not on homepage, navigate there to meet intro route condition
      if (!(route?.name === 'home' || route?.path === '/')) {
        router.replace('/')
      } else {
        // already on home: recompute intro visibility immediately
        updateIntroVisibility(route)
      }
    } catch (e) {
      // fallback: try to recompute anyway
      try { updateIntroVisibility(route) } catch {}
    }
  }
  window.addEventListener('local_storage_cleared', onLocalCleared)
  ;(window.__app_onLocalClearedHandlers ||= []).push(onLocalCleared)

  // Listen for contact overlay requests (from contact routes or buttons)
  const onContactOverlay = (e) => {
    contactPrefill.value = e?.detail || null
    showContact.value = true
  }
  window.addEventListener('open_contact_overlay', onContactOverlay)
  ;(window.__app_onContactOverlayHandlers ||= []).push(onContactOverlay)
  if (sessionStorage.getItem('contact_overlay_request') === '1') {
    showContact.value = true
    sessionStorage.removeItem('contact_overlay_request')
  }
})

onBeforeUnmount(() => {
  const handlers = window.__app_onLangChangedHandlers || []
  handlers.forEach(h => window.removeEventListener('preferred_lang_changed', h))
  window.__app_onLangChangedHandlers = []
  const lcHandlers = window.__app_onLocalClearedHandlers || []
  lcHandlers.forEach(h => window.removeEventListener('local_storage_cleared', h))
  window.__app_onLocalClearedHandlers = []
  const contactHandlers = window.__app_onContactOverlayHandlers || []
  contactHandlers.forEach(h => window.removeEventListener('open_contact_overlay', h))
  window.__app_onContactOverlayHandlers = []
})

// Intro visibility logic: show on ALL routes if no recent cookie, else suppress
const showIntro = ref(false)
const contentVisible = ref(false) // becomes true when page content should start fading in
const showContact = ref(false)
const contactPrefill = ref(null)
const INTRO_KEY = 'intro_last_seen_ms'
const INTRO_COOLDOWN_MS = 60 * 60 * 1000 // 1 hour
// Note: session gating removed per requirement to show on all pages if cookie missing/expired

function shouldShowIntroNow(r) {
  try {
    // Check if this route has the showIntro meta flag
    const shouldShowOnThisRoute = r?.meta?.showIntro === true || r?.name === 'home' || r?.path === '/'
    if (!shouldShowOnThisRoute) return false // Only show on homepage
    
    const last = parseInt(localStorage.getItem(INTRO_KEY) || '0', 10)
    const now = Date.now()
    if (!last) return true // no cookie: play intro on homepage
    if (now - last > INTRO_COOLDOWN_MS) return true // older than 1h: play
    return false // within 1h: suppress
  } catch (e) {
    return true
  }
}

function updateIntroVisibility(r) {
  showIntro.value = shouldShowIntroNow(r)
}

watch(() => route.fullPath, () => updateIntroVisibility(route), { immediate: true })

function handleIntroComplete(){
  try { localStorage.setItem(INTRO_KEY, String(Date.now())) } catch (e) {}
  showIntro.value = false
}

// When intro becomes visible, automatically clear it after its fade timeline
let __introTimer = null
let __contentTimer = null
watch(showIntro, (visible) => {
  if (visible) {
    if (__introTimer) clearTimeout(__introTimer)
    if (__contentTimer) clearTimeout(__contentTimer)
    contentVisible.value = false
    // 3.6s delay until overlay fade starts + 1.8s fade duration = 5400ms total
    __contentTimer = setTimeout(() => {
      contentVisible.value = true
      __contentTimer = null
    }, 3600)
    __introTimer = setTimeout(() => {
      handleIntroComplete()
      __introTimer = null
    }, 5400)
    // Safety guard: ensure completion after max 8s even if animation/timers glitch
    setTimeout(() => { if (showIntro.value) handleIntroComplete() }, 8000)
  } else {
    if (__introTimer) { clearTimeout(__introTimer); __introTimer = null }
    if (__contentTimer) { clearTimeout(__contentTimer); __contentTimer = null }
    contentVisible.value = false
  }
})

watch(isMenuOpen, (open) => {
  if (!open) accentDropdownOpen.value = false
})

function handleClickOutside(e){
  const dropdown = document.getElementById('accentDropdown')
  if (accentDropdownOpen.value && dropdown && !dropdown.contains(e.target)) {
    accentDropdownOpen.value = false
  }
  if (isMenuOpen.value) {
    const nav = document.getElementById('navMenu')
    const burger = document.querySelector('.menubutton')
    if (nav && !nav.contains(e.target) && (!burger || !burger.contains(e.target))) {
      isMenuOpen.value = false
    }
  }
}

function switchLang(lang){
  const name = String(route.name || '')
  const map = {
    'de-about': 'en-about', 'en-about': 'de-about',
    'de-gallery': 'en-gallery', 'en-gallery': 'de-gallery',
    'de-blog': 'en-blog', 'en-blog': 'de-blog',
    'de-projects': 'en-projects', 'en-projects': 'de-projects',
    'de-contact': 'en-contact', 'en-contact': 'de-contact',
    'de-services': 'en-services', 'en-services': 'de-services',
    'de-impressum': 'en-publisher', 'en-publisher': 'de-impressum',
    'de-datenschutz': 'en-privacy', 'en-privacy': 'de-datenschutz',
  }
  try { localStorage.setItem('preferred_lang', lang) } catch (e) {}
  // notify wrappers to re-evaluate selection
  try { window.dispatchEvent(new Event('preferred_lang_changed')) } catch (e) {}

  // Unified home route
  if (name === 'home' || route.path === '/' || route.path === '/home') {
    router.replace('/')
    isMenuOpen.value = false
    return
  }
  // Unified blog route
  if (name === 'blog' || route.path === '/blog' || name === 'de-blog' || name === 'en-blog') {
    router.replace('/blog')
    isMenuOpen.value = false
    return
  }

  const target = map[name]
  if (target) {
    router.push({ name: target })
  } else {
    // fallback to home
    router.replace('/')
  }
  isMenuOpen.value = false
}

function openContactFromMenu(){
  isMenuOpen.value = false
  try {
    window.dispatchEvent(new CustomEvent('open_contact_overlay'))
  } catch (e) {
    window.dispatchEvent(new Event('open_contact_overlay'))
  }
}

function closeContactOverlay(){
  showContact.value = false
  contactPrefill.value = null
}
</script>

<style scoped>
.app-root { min-height: 100dvh; display: flex; flex-direction: column; }
.app-main { flex: 1 0 auto; }
.app-root > footer { margin-top: auto; }
.fade-enter-active, .fade-leave-active { transition: opacity .2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
:deep(.page-fade-enter-active),
:deep(.page-fade-leave-active) { transition: opacity 1s ease, transform 1s ease; }
:deep(.page-fade-enter-from),
:deep(.page-fade-leave-to) { opacity: 0; transform: translateY(8px); }

.top-nav { position: relative; z-index: 320; }

#navMenu {
  position: fixed;
  inset: 0 0 auto 0;
  padding: 7px 20px 0; /* breathing room around the bar */
  transform: translateY(-120%);
  opacity: 0;
  transition: transform .45s ease, opacity .35s ease;
  pointer-events: none;
  z-index: 310;
}
#navMenu.visible {
  transform: translateY(0);
  opacity: 1;
  pointer-events: auto;
}
.nav-surface {
  position: relative;
  width: calc(100vw - 32px);
  margin: 0 auto;
  border: 1px solid rgba(255,255,255,.12);
  border-radius: 18px;
  padding: 12px 22px 12px 0px; /* reserve space so links don't sit under the burger */
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  box-shadow: 0 20px 50px rgba(0,0,0,.28), 0 0 0 1px rgba(255,255,255,.02);
  backdrop-filter: blur(10px) saturate(140%);
  -webkit-backdrop-filter: blur(10px) saturate(140%);
}
.nav-legal {
  margin: 8px auto 12px;
  width: min(1180px, 100%);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  color: rgba(255,255,255,.7);
  font-size: 12px;
}
.nav-legal .legal-link {
  color: inherit;
  text-decoration: none;
  padding: 4px 6px;
  border-radius: 8px;
  transition: background .2s ease, color .2s ease;
}
.nav-legal .legal-link:hover { color: #fff; background: rgba(255,255,255,.08); }
.nav-legal .dot { opacity: .7; }

.menu-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  padding: 0 6px;
}
.nav-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #dfe6f5;
  text-decoration: none;
  font-weight: 600;
  padding: 10px 12px;
  border-radius: 12px;
  letter-spacing: .2px;
  background: rgba(255,255,255,.05);
  border: 1px solid rgba(255,255,255,.08);
  transition: background .2s ease, color .2s ease, transform .2s ease, border-color .2s ease;
}
.nav-chip.router-link-active,
.nav-chip:focus-visible {
  color: #fff;
  background: rgba(255,255,255,.06);
  border-color: rgba(255,255,255,.12);
}
.nav-chip:hover {
  color: #fff;
  background: rgba(255,255,255,.08);
  transform: translateY(-1px);
  border-color: rgba(255,255,255,.14);
}

.menu-contact-link{
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--accent-raw, var(--accent-default, #f0c33c));
  color: var(--accent-text, #00111a);
  border: 1px solid rgba(255,255,255,.18);
  border-radius: 14px;
  padding: 10px 14px;
  font-weight: 700;
  letter-spacing: .2px;
  box-shadow: 0 12px 35px rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .4);
  transition: transform .2s ease, box-shadow .2s ease;
  white-space: nowrap;
}
.menu-contact-link:hover { transform: translateY(-2px); box-shadow: 0 16px 40px rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .45); }
.menu-contact-link:active { transform: translateY(-1px); }

.accent-picker { position: relative; }
.accent-toggle {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: transparent;
  border: none;
  color: inherit;
  padding: 0;
  cursor: pointer;
  justify-content: center;
}
.accent-swatch {
  width: 18px; height: 18px; border-radius: 8px;
  background: var(--accent-raw, var(--accent-default, #f0c33c));
  box-shadow: 0 0 0 1px rgba(255,255,255,.18), 0 8px 16px rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .4);
}
.accent-toggle svg { width: 14px; height: 14px; opacity: .7; }

.accent-dropdown {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  background: rgba(8,12,18,.92);
  border: 1px solid rgba(255,255,255,.06);
  border-radius: 12px;
  padding: 10px;
  box-shadow: 0 12px 28px rgba(0,0,0,.3);
  min-width: 110px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 5;
}
.accent-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.accent-swatch-option {
  width: 100%;
  height: 22px;
  border-radius: 6px;
  border: 1px solid rgba(255,255,255,.14);
  box-shadow: 0 4px 10px rgba(0,0,0,.22);
  cursor: pointer;
  transition: transform .15s ease, box-shadow .2s ease, border-color .2s ease;
}
.accent-swatch-option:hover { transform: translateY(-1px); box-shadow: 0 12px 26px rgba(0,0,0,.35); border-color: rgba(255,255,255,.32); }

.lang-switch { display: flex; align-items: center; gap: 8px; position: static; }
.lang-switch img {
  width: clamp(32px, 5vw, 35px);
  height: clamp(24px, 4vw, 30px);
  object-fit: cover;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  opacity: .92;
  box-shadow: 0 8px 18px rgba(0,0,0,.22);
  transition: transform .2s ease, opacity .2s ease, box-shadow .2s ease;
}
.lang-switch img:hover { transform: translateY(-1px); opacity: 1; box-shadow: 0 12px 22px rgba(0,0,0,.28); }
.lang-btn img {
  width: clamp(32px, 5vw, 35px);
  height: clamp(24px, 4vw, 30px);
  border-radius: 8px;
  box-shadow: 0 6px 14px rgba(0,0,0,.22);
  border: none;
  object-fit: cover;
}
.tools-chip {
  gap: 10px;
  padding-left: 10px;
  padding-right: 10px;
}   
.tools-sep {
  width: 1px;
  height: 18px;
  background: rgba(255,255,255,.18);
}
.tools-chip .lang-btn {
  background: transparent;
  border: none;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.menubutton {
  cursor: pointer;
  position: fixed;
  top: 18px;
  left: 24px;
  z-index: 330;
  padding: 8px;
}
.menubutton input { display: none; }
.menubutton svg { height: 2.7em; transition: transform 600ms cubic-bezier(0.4, 0, 0.2, 1); }
.line { fill: none; stroke: var(--accent-raw, var(--accent-default, #f0c33c)); stroke-linecap: round; stroke-linejoin: round; stroke-width: 3; transition: stroke-dasharray 600ms cubic-bezier(0.4,0,0.2,1), stroke-dashoffset 600ms cubic-bezier(0.4,0,0.2,1); }
.line-top-bottom { stroke-dasharray: 12 63; }
.menubutton input:checked + svg { transform: rotate(-45deg); }
.menubutton input:checked + svg .line-top-bottom { stroke-dasharray: 20 300; stroke-dashoffset: -32.42; }
@media (max-width: 1024px){
  #navMenu 
  .nav-surface {
    width: 95vw;
    flex-wrap: wrap;
    justify-content: flex-start;
  }
  .menubutton {
    position: fixed;
    top: calc(1rem + 3px);
    left: calc(1rem + 15px);
    transform: none;
  }
  .menu-links { justify-content: flex-end; width: 100%; }
  .menu-actions { justify-content: flex-end; width: 100%; }
}
@media (max-width: 700px){
  #navMenu { padding: 12px 8px 0; }
  .nav-surface {
    padding: 12px 12px 4px;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 10px;
    align-items: center;
    width: calc(100vw - 16px);
    margin-top: 64px;
    border: 1px solid rgba(255,255,255,.12);
    border-radius: 14px;
  }
  .menubutton { top: 1rem; left: 1rem; }
  .menu-links {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 10px;
  }
  .menu-links .nav-chip,
  .menu-links .menu-contact-link {
    width: 100%;
    justify-content: center;
    text-align: center;
  }
}
@media (min-width:1024px){
  .app-main{ padding-top: 2rem !important; padding-bottom: 0rem !important; }
} 
@media (min-width:1024px) and (max-height: 700px){
  .app-main{ padding-top: .75rem !important; padding-bottom: .5rem !important; }
}

/* While Intro is active, prepare content and control fade with content-visible toggle */
.app-root.intro-active .app-main { opacity: 0; pointer-events: none; transition: opacity 1.8s ease-in-out; }
.app-root.intro-active.content-visible .app-main { opacity: 1; pointer-events: auto; }
</style>
