<template>
  <div class="page-auto-contrast max-w-6xl mx-auto px-4 pt-10 pb-20">
    <div class="ice-hero">
      <h2 class="text-white text-2xl font-semibold">Shop</h2>
      <div class="mt-2 text-yellow-200 text-sm bg-yellow-500/10 border border-yellow-300/20 rounded px-3 py-2 inline-block">Note: The shop is under construction. Payments are demo-only.</div>
      <div class="mt-4 flex gap-2 flex-wrap items-center">
        <input v-model="query" type="text" placeholder="Search by title/tag" class="bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 w-64 px-3 py-2 rounded-md" />
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
          <button class="glass-btn px-3 py-2 rounded-md" @click="addToCart(p)">Add to cart</button>
          <button class="glass-btn-secondary px-3 py-2 rounded-md" @click="addToCart(p)">Quick buy</button>
        </div>
      </div>
    </div>

    <div class="mt-12">
      <h3 class="text-white text-lg font-semibold">Cart</h3>
      <div class="mt-4 grid md:grid-cols-3 gap-6">
        <div class="md:col-span-2 glass-card p-6">
          <div v-if="cart.length === 0" class="text-zinc-300">No items in the cart yet.</div>
          <div v-else class="space-y-3">
            <div v-for="i in cart" :key="i.id" class="flex items-center justify-between text-sm text-white">
              <div>
                <div class="font-medium">{{ i.title }}</div>
                <div class="text-zinc-400">{{ i.qty }} × € {{ centsToEUR(i.price_cents) }}</div>
              </div>
              <button class="text-cyan-300 hover:text-white" @click="removeFromCart(i.id)">Remove</button>
            </div>
          </div>
          <div class="mt-6">
            <div ref="dropinRef"></div>
          </div>
        </div>
        <div class="glass-card p-6">
          <div class="flex items-center justify-between text-white">
            <span>Subtotal</span>
            <span>€ {{ centsToEUR(totalCents) }}</span>
          </div>
          <div class="mt-4 grid gap-2">
            <button class="glass-btn px-3 py-2 rounded-md" @click="checkout('paypal')">PayPal (Demo)</button>
            <button class="glass-btn px-3 py-2 rounded-md" @click="checkout('klarna')">Klarna (Demo)</button>
            <button class="glass-btn px-3 py-2 rounded-md" @click="checkout('applepay')">Apple Pay (Demo)</button>
            <button class="glass-btn px-3 py-2 rounded-md" @click="checkout('googlepay')">Google Pay (Demo)</button>
            <button class="glass-btn px-3 py-2 rounded-md" :disabled="isStarting" @click="startAdyenCheckout">{{ isStarting ? 'Loading payment...' : 'Checkout (Adyen)' }}</button>
          </div>
          <p class="text-[12px] text-zinc-400 mt-3">Payments are demo only. For live payments you need your ADYEN_* keys.</p>
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
  { id: 'consulting', title: 'Consulting', description: 'Individual consulting around web, hosting and modernisation.', price_cents: 9900, currency: 'EUR', tags: ['Service'], active: true },
  { id: 'modernise', title: 'Modernise a website', description: 'Upgrade an existing website to a modern design and better performance.', price_cents: 24900, currency: 'EUR', tags: ['Service'], active: true },
  { id: 'custom', title: 'Custom features', description: 'Individual features and special solutions on request.', price_cents: 0, currency: 'EUR', tags: ['Service'], active: true },
  { id: 'site-from-scratch', title: 'Website from scratch (from)', description: 'Planning, design, implementation & hosting setup – all from one source.', price_cents: 89900, currency: 'EUR', tags: ['Project','Web'], active: true },
  { id: 'performance-seo', title: 'Performance/SEO check (from)', description: 'Core Web Vitals, Lighthouse, image optimisation, caching, accessibility – report & action plan.', price_cents: 14900, currency: 'EUR', tags: ['Audit','SEO','Performance'], active: true },
  { id: 'maintenance-monitoring', title: 'Maintenance & monitoring (from/month)', description: 'Updates, backups, security checks, uptime monitoring and minor fixes.', price_cents: 5900, currency: 'EUR', tags: ['Maintenance'], active: true },
  { id: 'hosting-mail-setup', title: 'Hosting/Mail setup (from)', description: 'Domain, DNS, SSL, mail (e.g. with custom subdomains), basic server configuration.', price_cents: 12900, currency: 'EUR', tags: ['Setup','Server'], active: true }
]

const query = ref('')
const products = ref(demoProducts)
const selectedTags = ref([])
const cart = ref(JSON.parse(localStorage.getItem('ice_cart_en') || '[]'))
const dropinRef = ref(null)
const isStarting = ref(false)

onMounted(async () => {
  // Demo only
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
  localStorage.setItem('ice_cart_en', JSON.stringify(cart.value))
}
function removeFromCart(id) {
  cart.value = cart.value.filter(i => i.id !== id)
  localStorage.setItem('ice_cart_en', JSON.stringify(cart.value))
}

const totalCents = computed(() => cart.value.reduce((s, i) => s + i.price_cents * i.qty, 0))

async function checkout(provider) {
  try {
    const items = cart.value.map(i => ({ product_id: i.id, qty: i.qty }))
    const res = await axios.post(`${API}/checkout/session`, { provider, items })
    console.info(`Checkout ${provider}:`, res.data)
  } catch (e) {
    console.warn('Checkout demo only. Missing ADYEN_* keys.')
  }
}

async function startAdyenCheckout() {
  if (cart.value.length === 0) return
  isStarting.value = true
  try {
    const items = cart.value.map(i => ({ product_id: i.id, qty: i.qty }))
    const { data } = await axios.post(`${API}/checkout/session`, { provider: 'adyen', items })
    if (!data?.adyen?.id || !data?.adyen?.sessionData) {
      console.warn('Adyen not configured. Please provide ADYEN_* variables.')
      isStarting.value = false
      return
    }
    const checkout = await AdyenCheckout({
      clientKey: data.adyen.clientKey,
      environment: data.adyen.environment === 'live' ? 'live' : 'test',
      locale: 'en-GB',
      session: { id: data.adyen.id, sessionData: data.adyen.sessionData },
      onPaymentCompleted: () => { cart.value = []; localStorage.setItem('ice_cart_en', '[]') },
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
