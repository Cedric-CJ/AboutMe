<template>
  <div
    class="cookie-banner"
    :class="{ open: isOpen }"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
  >
    <button class="cookie-icon" @click.prevent :aria-expanded="String(isOpen)" aria-label="Cookie-Informationen">
      <span class="emoji" aria-hidden="true">🍪</span>
    </button>

    <div class="cookie-text" role="status">
      <template v-if="langComputed === 'de'">
        <p>
          Wir nutzen nur <strong>technisch notwendige Local-Storage-Einträge</strong>:
          Sprache (<code>preferred_lang</code>), Farb-Akzent (<code>accent</code>) und ob das Intro schon gezeigt wurde (<code>intro_last_seen_ms</code>).<br>
          Keine Analyse, kein Tracking, kein Marketing, keine Weitergabe an Dritte.
          <RouterLink to="/datenschutz">Details</RouterLink>
        </p>
        <p class="actions">
          <a href="#" class="clear-link" @click.prevent="clearLocal">
            Lokale Daten löschen
          </a>
        </p>
      </template>
      <template v-else>
        <p>
          We only use <strong>strictly necessary local-storage entries</strong>:
          language (<code>preferred_lang</code>), accent color (<code>accent</code>), and whether the intro was shown (<code>intro_last_seen_ms</code>).<br>
          No analytics, tracking, or marketing. No data is shared with third parties.
          <RouterLink to="/privacy">Details</RouterLink>
        </p>
        <p class="actions">
          <a href="#" class="clear-link" @click.prevent="clearLocal">
            Clear local data
          </a>
        </p>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  lang: { type: String, default: '' },
})

const isHovering = ref(false)
const keepOpen = ref(false)
const forceClosed = ref(false)
let closeTimer = null
const isOpen = computed(() => !forceClosed.value && (isHovering.value || keepOpen.value))

// Compute language from prop, then fall back to preferred_lang localStorage, else 'en'
// tick to force recompute on preferred_lang_changed
const __langTick = ref(0)

const langComputed = computed(() => {
  void __langTick.value
  if (props.lang === 'de' || props.lang === 'en') return props.lang
  try {
    const pref = localStorage.getItem('preferred_lang')
    if (pref === 'de' || pref === 'en') return pref
  } catch (e) {}
  return 'en'
})

onMounted(() => {
  const onLangChanged = () => {
    __langTick.value++
  }
  window.addEventListener('preferred_lang_changed', onLangChanged)
  ;(window.__cookie_banner_onLangChanged ||= []).push(onLangChanged)
})

onBeforeUnmount(() => {
  const handlers = window.__cookie_banner_onLangChanged || []
  handlers.forEach(h => window.removeEventListener('preferred_lang_changed', h))
  window.__cookie_banner_onLangChanged = []
})
// Manage delayed close on mouse leave (3s)
watch(isHovering, (h) => {
  // If we're forcing it closed, ignore hover-driven open/close changes
  if (forceClosed.value) {
    if (closeTimer) { clearTimeout(closeTimer); closeTimer = null }
    return
  }
  if (h) {
    keepOpen.value = false
    if (closeTimer) { clearTimeout(closeTimer); closeTimer = null }
  } else {
    if (closeTimer) clearTimeout(closeTimer)
    keepOpen.value = true
    closeTimer = setTimeout(() => { keepOpen.value = false; closeTimer = null }, 3000)
  }
})

function clearLocal(){
  try{
    localStorage.removeItem('preferred_lang')
    localStorage.removeItem('accent')
    localStorage.removeItem('intro_last_seen_ms')
  }catch{/* ignore */}
  // Let the app decide how to react (navigate to home and/or show intro)
  try { window.dispatchEvent(new Event('local_storage_cleared')) } catch {/* ignore */}
  // Close the banner immediately for clean UX, even if still hovered
  try{
    forceClosed.value = true
    if (closeTimer) { clearTimeout(closeTimer); closeTimer = null }
    keepOpen.value = false
    isHovering.value = false
    // keep it closed briefly to avoid reopening due to residual hover/mousemove
    setTimeout(() => { forceClosed.value = false }, 2000)
  }catch{/* ignore */}
}

</script>

<style scoped>
.cookie-banner {
  position: fixed;
  left: 1rem;
  bottom: 1rem;
  width: 40px;          /* keep button footprint fixed */
  height: 40px;         /* keep button footprint fixed */
  color: #fff;
  z-index: 250; /* below hamburger (300) and nav (290), above glass (200) */
}

.cookie-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 9999px;
  background: var(--accent-raw, #12b3a6);
  color: #0a0a0a;
  border: 1px solid rgba(255,255,255,.25);
  box-shadow: 0 4px 16px rgba(0,0,0,.35);
  cursor: pointer;
}
.cookie-icon .emoji { display:block; font-size: 20px; line-height: 1; transform: translateY(1px); }
.cookie-icon:hover { filter: brightness(1.05); }

.cookie-text {
  position: absolute;
  left: 48px;           /* render to the right of the fixed icon */
  bottom: 0;
  max-width: 560px;
  width: clamp(280px, 42vw, 560px);  /* constant width; animate via scaleX */
  overflow: hidden;
  opacity: 0;
  transform: scaleX(0);
  transform-origin: left center;
  transition: opacity .25s ease, transform .25s ease, padding .25s ease;
  background: rgba(0,0,0,.7);
  border: 1px solid rgba(255,255,255,.12);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 0 .75rem;
  display: inline-block;
  color: #fff; /* base text in white for readability */
  white-space: normal;
  word-break: normal;
  overflow-wrap: anywhere;
  hyphens: auto;
  pointer-events: none;
  will-change: transform, opacity;
}
.cookie-text p { margin: .6rem .25rem; font-size: .9rem; line-height: 1.35; color: inherit; text-shadow: 0 1px 2px rgba(0,0,0,.6); -webkit-text-stroke: 0.2px rgba(0,0,0,.35); }
.cookie-text code { color: inherit; opacity: .95; }
.cookie-text a { color: inherit; text-decoration: underline; }
.cookie-text a.clear-link { color: var(--accent-raw, #12b3a6); text-decoration: underline; font-weight: 600; }
.cookie-text a.clear-link:hover { filter: brightness(1.1); }
.cookie-text .actions { margin-top: .25rem; }

.cookie-banner.open .cookie-text {
  opacity: 1;
  transform: scaleX(1);
  padding: .6rem .75rem;
  pointer-events: auto;
}

@media (max-width: 480px){
  .cookie-text p { font-size: .85rem }
}
</style>
