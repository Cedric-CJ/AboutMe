<template>
  <div class="gate">
    <div class="glass">
      <p class="pill">Bot Check</p>
      <h2>{{ lang==='en' ? 'Redirecting securely…' : 'Sichere Weiterleitung…' }}</h2>
      <p class="text">{{ lang==='en'
        ? 'We run a quick client-side check to keep scrapers away.'
        : 'Kurzer clientseitiger Check, um Scraper fernzuhalten.' }}</p>
      <p class="small">{{ lang==='en' ? 'No interaction required.' : 'Keine Aktion nötig.' }}</p>
      <div class="loader"></div>
    </div>
    <form ref="honeypot" class="hp" aria-hidden="true">
      <input type="text" name="email" autocomplete="off" />
      <input type="text" name="name" autocomplete="off" />
    </form>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const honeypot = ref(null)
const lang = computed(() => {
  const n = String(route.name || '')
  if (n.startsWith('de-')) return 'de'
  if (n.startsWith('en-')) return 'en'
  try {
    const pref = localStorage.getItem('preferred_lang')
    if (pref === 'de' || pref === 'en') return pref
  } catch (e) {}
  return 'de'
})

onMounted(() => {
  // Honeypot fill to flag naive bots
  try {
    const form = honeypot.value
    if (form) {
      const inputs = form.querySelectorAll('input')
      inputs.forEach((input, i) => { input.value = i === 0 ? 'noop' : 'check' })
    }
  } catch (e) {}

  // Session pass for this tab
  try { sessionStorage.setItem('legal_pass', '1') } catch (e) {}

  const target = route.query.target || '/impressum'
  setTimeout(() => {
    router.replace(String(target))
  }, 650)
})
</script>

<style scoped>
.gate{
  min-height: 60vh;
  display: grid;
  place-items: center;
  padding: 1.5rem;
}
.glass{
  background: rgba(10,15,20,.78);
  border:1px solid rgba(255,255,255,.12);
  border-radius: 16px;
  padding: 24px 26px;
  text-align:center;
  max-width: 520px;
  width: 100%;
  backdrop-filter: blur(12px);
}
.pill{
  display:inline-flex;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(255,255,255,.08);
  border:1px solid rgba(255,255,255,.12);
  color:#d9e7ee;
  font-size: 0.85rem;
}
h2{ color:#fff; font-size: 1.6rem; margin: 10px 0 6px; }
.text{ color:#d2dbe5; margin-bottom: 4px; }
.small{ color:#9fb4c6; font-size: 0.9rem; }
.loader{
  margin: 14px auto 0;
  width: 38px; height: 38px;
  border-radius:50%;
  border:3px solid rgba(255,255,255,.18);
  border-top-color: rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .9);
  animation: spin 1s linear infinite;
}
@keyframes spin{ to { transform: rotate(360deg); } }
.hp{ position:absolute; opacity:0; pointer-events:none; }
</style>
