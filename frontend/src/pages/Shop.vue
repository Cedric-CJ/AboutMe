<template>
  <div class="page-auto-contrast max-w-6xl mx-auto px-4 pt-10 pb-20">
    <div class="ice-hero">
      <h2 class="text-white text-2xl font-semibold">Shop</h2>
      <div class="mt-2 text-yellow-200 text-sm bg-yellow-500/10 border border-yellow-300/20 rounded px-3 py-2 inline-block">Hinweis: Der Shop ist im Aufbau. Zahlungen sind Demo.</div>
      <div class="mt-4 flex gap-2 flex-wrap items-center">
        <input v-model="query" type="text" placeholder="Suchen nach Titel/Tag" class="bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 w-64 px-3 py-2 rounded-md" />
        <button v-for="t in allTags" :key="t" @click="toggleTag(t)" :class="['tagchip', { active: selectedTags.includes(t) }]">{{ t }}</button>
      </div>
    </div>

    <div class="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="p in filtered" :key="p.id" class="glass-card p-4">
        <div class="text-white flex items-center justify-between text-lg font-medium">
          <span>{{ p.title }}</span>
          <span class="text-cyan-300">€ {{ centsToEUR(p.price_cents) }}</span>
        </div>
        <p class="text-sm text-zinc-300 mt-2 min-h-[40px]">{{ p.description }}</p>
        <div class="mt-3 flex flex-wrap gap-2">
          <span v-for="t in (p.tags || [])" :key="t" class="text-[11px] px-2 py-1 rounded-full bg-white/10 text-white border border-white/15">{{ t }}</span>
        </div>
        <div class="mt-4 flex gap-2">
          <button class="glass-btn px-3 py-2 rounded-md" @click="addToCart(p)">In den Warenkorb</button>
          <button class="glass-btn-secondary px-3 py-2 rounded-md" @click="addToCart(p)">Schnellkauf</button>
        </div>
      </div>
    </div>

    <div class="mt-12">
      <h3 class="text-white text-lg font-semibold">Warenkorb</h3>
      <div class="mt-4 grid md:grid-cols-3 gap-6">
        <div class="md:col-span-2 glass-card p-6">
          <div v-if="cart.length === 0" class="text-zinc-300">Noch keine Artikel im Warenkorb.</div>
          <div v-else class="space-y-3">
            <div v-for="i in cart" :key="i.id" class="flex items-center justify-between text-sm text-white">
              <div>
                <div class="font-medium">{{ i.title }}</div>
                <div class="text-zinc-400">{{ i.qty }} × € {{ centsToEUR(i.price_cents) }}</div>
              </div>
              <button class="text-cyan-300 hover:text-white" @click="removeFromCart(i.id)">Entfernen</button>
            </div>
          </div>
          <div class="mt-6">
            <div ref="dropinRef"></div>
          </div>
        </div>
        <div class="glass-card p-6">
          <div class="flex items-center justify-between text-white">
            <span>Zwischensumme</span>
            <span>€ {{ centsToEUR(totalCents) }}</span>
          </div>
          <div class="mt-4 grid gap-2">
            <button class="glass-btn px-3 py-2 rounded-md" @click="checkout('paypal')">PayPal (Demo)</button>
            <button class="glass-btn px-3 py-2 rounded-md" @click="checkout('klarna')">Klarna (Demo)</button>
            <button class="glass-btn px-3 py-2 rounded-md" @click="checkout('applepay')">Apple Pay (Demo)</button>
            <button class="glass-btn px-3 py-2 rounded-md" @click="checkout('googlepay')">Google Pay (Demo)</button>
            <button class="glass-btn px-3 py-2 rounded-md" :disabled="isStarting" @click="startAdyenCheckout">{{ isStarting ? 'Lade Zahlung...' : 'Zur Kasse (Adyen)' }}</button>
          </div>
          <p class="text-[12px] text-zinc-400 mt-3">Zahlung ist Demo. Für Live-Zahlungen benötigen wir deine ADYEN_* Keys.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import AdyenCheckout from '@adyen/adyen-web'
import '@adyen/adyen-web/dist/adyen.css'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || ''
const API = `${BACKEND_URL}/api`

const demoProducts = [
  { id: 'beratung', title: 'Beratung', description: 'Individuelle Beratung rund um Web, Hosting und Modernisierung.', price_cents: 9900, currency: 'EUR', tags: ['Service'], active: true },
  { id: 'modernisieren', title: 'Seite modernisieren', description: 'Bestehende Webseite in modernes Design und bessere Performance überführen.', price_cents: 24900, currency: 'EUR', tags: ['Service'], active: true },
  { id: 'sonderwuensche', title: 'Sonderwünsche', description: 'Individuelle Features und Speziallösungen nach Absprache.', price_cents: 0, currency: 'EUR', tags: ['Service'], active: true },
  { id: 'web-von-grund-auf', title: 'Webseite von Grund auf (ab)', description: 'Planung, Design, Umsetzung & Hosting-Einrichtung – alles aus einer Hand.', price_cents: 89900, currency: 'EUR', tags: ['Projekt','Web'], active: true },
  { id: 'performance-seo', title: 'Performance-/SEO-Check (ab)', description: 'Core Web Vitals, Lighthouse, Bildoptimierung, Caching, Accessibility – Bericht & Maßnahmenplan.', price_cents: 14900, currency: 'EUR', tags: ['Audit','SEO','Performance'], active: true },
  { id: 'wartung-monitoring', title: 'Wartung & Monitoring (ab/Monat)', description: 'Updates, Backups, Security-Checks, Uptime-Monitoring und kleinere Fixes.', price_cents: 5900, currency: 'EUR', tags: ['Wartung'], active: true },
  { id: 'hosting-mail-setup', title: 'Hosting-/Mail-Setup (ab)', description: 'Domain, DNS, SSL, Mail (z. B. mit eigenen Subdomains), grundlegende Server-Konfiguration.', price_cents: 12900, currency: 'EUR', tags: ['Setup','Server'], active: true }
]

const query = ref('')
const products = ref(demoProducts)
const selectedTags = ref([])
const cart = ref(JSON.parse(localStorage.getItem('ice_cart') || '[]'))
const dropinRef = ref(null)
const isStarting = ref(false)

onMounted(async () => {
  // Für jetzt: Nur die drei Services lokal anbieten (keine API-Produkte laden)
})

function centsToEUR(c) { return (c / 100).toFixed(2).replace('.', ',') }

const allTags = computed(() => Array.from(new Set(products.value.flatMap(p => p.tags || []))))
function toggleTag(t){
  const i = selectedTags.value.indexOf(t)
  if (i>=0) selectedTags.value.splice(i,1)
  else selectedTags.value.push(t)
}
const filtered = computed(() => products.value.filter(p => {
  const q = query.value.toLowerCase()
  const matchQ = !q || p.title.toLowerCase().includes(q) || (p.tags||[]).some(t => t.toLowerCase().includes(q))
  const matchTags = selectedTags.value.length === 0 || selectedTags.value.every(t => (p.tags||[]).includes(t))
  return matchQ && matchTags
}))

function addToCart(p) {
  const existing = cart.value.find(i => i.id === p.id)
  if (existing) existing.qty += 1
  else cart.value.unshift({ id: p.id, title: p.title, price_cents: p.price_cents, currency: p.currency, qty: 1 })
  localStorage.setItem('ice_cart', JSON.stringify(cart.value))
}
function removeFromCart(id) {
  cart.value = cart.value.filter(i => i.id !== id)
  localStorage.setItem('ice_cart', JSON.stringify(cart.value))
}

const totalCents = computed(() => cart.value.reduce((s, i) => s + i.price_cents * i.qty, 0))

async function checkout(provider) {
  try {
    const items = cart.value.map(i => ({ product_id: i.id, qty: i.qty }))
    const res = await axios.post(`${API}/checkout/session`, { provider, items })
    if (res.data && res.data.order_id) {
      // keep simple: log
      console.info(`Checkout ${provider}:`, res.data)
    } else {
      console.warn('Checkout: unerwartete Antwort')
    }
  } catch (e) {
    console.warn('Checkout nicht möglich (Demo). Vermutlich fehlen ADYEN_* Keys.')
  }
}

async function startAdyenCheckout() {
  if (cart.value.length === 0) return
  isStarting.value = true
  try {
    const items = cart.value.map(i => ({ product_id: i.id, qty: i.qty }))
    const { data } = await axios.post(`${API}/checkout/session`, { provider: 'adyen', items })
    if (!data?.adyen?.id || !data?.adyen?.sessionData) {
      console.warn('Adyen nicht konfiguriert. Bitte ADYEN_* Variablen setzen.')
      isStarting.value = false
      return
    }
    const checkout = await AdyenCheckout({
      clientKey: data.adyen.clientKey,
      environment: data.adyen.environment === 'live' ? 'live' : 'test',
      locale: 'de-DE',
      session: { id: data.adyen.id, sessionData: data.adyen.sessionData },
      onPaymentCompleted: () => { cart.value = []; localStorage.setItem('ice_cart', '[]') },
      onError: (err) => { console.error(err) }
    })
    const dropin = checkout.create('dropin', { paymentMethodConfiguration: {} })
    if (dropinRef.value) dropin.mount(dropinRef.value)
  } catch (err) {
    console.error(err)
  } finally {
    isStarting.value = false
  }
}
</script>

<style scoped>
.tagchip{ font-size:12px; padding:.25rem .5rem; border-radius:9999px; background: rgba(255,255,255,.1); color:#fff; border:1px solid rgba(255,255,255,.15) }
.tagchip.active{ background: var(--accent-raw); border-color: rgba(255,255,255,.3) }
</style>
