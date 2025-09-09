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
          <div class="flex items-center gap-2">
            <span class="text-cyan-300">{{ formatPrice(p.price_cents) }}</span>
            <button @click="showInfo(p)" class="info-icon" title="Mehr Informationen">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4"/>
                <path d="M12 8h.01"/>
              </svg>
            </button>
          </div>
        </div>
        <p class="text-sm text-zinc-300 mt-2 min-h-[40px]">{{ p.description }}</p>
        <div class="mt-3 flex flex-wrap gap-2">
          <span v-for="t in (p.tags || [])" :key="t" class="text-[11px] px-2 py-1 rounded-full bg-white/10 text-white border border-white/15">{{ t }}</span>
        </div>
        <div class="mt-4 flex gap-2">
          <button class="glass-btn px-3 py-2 rounded-md" @click="openInquiry(p)">Anfrage stellen</button>
          <button class="glass-btn-secondary px-3 py-2 rounded-md" @click="openInquiry(p)">Direkt anfragen</button>
        </div>
      </div>
    </div>

    <!-- Inquiry Overlay -->
    <div v-if="showInquiryOverlay" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="glass-card p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-white text-lg font-semibold">Anfrage stellen</h3>
          <button @click="closeInquiry" class="text-zinc-400 hover:text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        
        <div v-if="selectedProduct" class="mb-4 p-3 bg-white/5 rounded border border-white/10">
          <div class="text-white font-medium">{{ selectedProduct.title }}</div>
          <div class="text-cyan-300 text-sm">{{ formatPrice(selectedProduct.price_cents) }}</div>
        </div>
        
        <form @submit.prevent="submitInquiry" class="space-y-4">
          <div>
            <label class="block text-white text-sm font-medium mb-2">Name *</label>
            <input v-model="inquiry.name" type="text" required class="w-full bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 px-3 py-2 rounded-md" placeholder="Ihr Name" />
          </div>
          
          <div>
            <label class="block text-white text-sm font-medium mb-2">E-Mail *</label>
            <input v-model="inquiry.email" type="email" required class="w-full bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 px-3 py-2 rounded-md" placeholder="ihre@email.de" />
          </div>
          
          <div>
            <label class="block text-white text-sm font-medium mb-2">Telefon (optional)</label>
            <input v-model="inquiry.phone" type="tel" class="w-full bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 px-3 py-2 rounded-md" placeholder="+49 123 456789" />
          </div>
          
          <div>
            <label class="block text-white text-sm font-medium mb-2">Nachricht *</label>
            <textarea v-model="inquiry.message" required rows="4" class="w-full bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 px-3 py-2 rounded-md resize-none" placeholder="Beschreiben Sie Ihr Projekt oder Ihre Anfrage..."></textarea>
          </div>
          
          <div class="flex gap-2">
            <button type="submit" class="glass-btn px-4 py-2 rounded-md flex-1">Anfrage senden</button>
            <button type="button" @click="closeInquiry" class="glass-btn-secondary px-4 py-2 rounded-md">Abbrechen</button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Info Modal -->
    <div v-if="showInfoModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="glass-card p-6 max-w-lg w-full">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-white text-lg font-semibold">{{ selectedProduct?.title }}</h3>
          <button @click="closeInfo" class="text-zinc-400 hover:text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        
        <div v-if="selectedProduct" class="space-y-3">
          <div class="text-cyan-300 text-lg font-medium">{{ formatPrice(selectedProduct.price_cents) }}</div>
          <p class="text-zinc-300">{{ selectedProduct.description }}</p>
          
          <div class="bg-white/5 rounded p-3 border border-white/10">
            <h4 class="text-white font-medium mb-2">Was ist enthalten:</h4>
            <ul class="text-zinc-300 text-sm space-y-1">
              <li v-if="selectedProduct.id === 'beratung'">• Persönliches Gespräch (60 Min.)<br>• Analyse Ihrer aktuellen Situation<br>• Konkrete Handlungsempfehlungen<br>• Schriftliche Zusammenfassung</li>
              <li v-else-if="selectedProduct.id === 'modernisieren'">• Technische Analyse der bestehenden Seite<br>• Modernes, responsives Design<br>• Performance-Optimierung<br>• SEO-Grundlagen<br>• Testing & Launch</li>
              <li v-else-if="selectedProduct.id === 'sonderwuensche'">• Individuelle Beratung<br>• Maßgeschneiderte Lösung<br>• Preis nach Aufwand<br>• Transparente Kostenschätzung</li>
              <li v-else-if="selectedProduct.id === 'web-von-grund-auf'">• Konzeption & Planung<br>• Individuelles Design<br>• Responsive Entwicklung<br>• CMS-Integration<br>• Hosting-Setup<br>• 3 Monate Support</li>
              <li v-else-if="selectedProduct.id === 'performance-seo'">• Lighthouse-Audit<br>• Core Web Vitals Analyse<br>• SEO-Check<br>• Detaillierter Bericht<br>• Priorisierter Maßnahmenplan</li>
              <li v-else-if="selectedProduct.id === 'wartung-monitoring'">• Regelmäßige Updates<br>• Automatische Backups<br>• Security-Monitoring<br>• Uptime-Überwachung<br>• Support bei Problemen</li>
              <li v-else-if="selectedProduct.id === 'hosting-mail-setup'">• Domain-Konfiguration<br>• SSL-Zertifikat<br>• E-Mail-Setup<br>• DNS-Verwaltung<br>• Grundkonfiguration</li>
            </ul>
          </div>
          
          <button @click="openInquiryFromInfo" class="glass-btn w-full px-4 py-2 rounded-md">Jetzt anfragen</button>
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
const showInquiryOverlay = ref(false)
const showInfoModal = ref(false)
const selectedProduct = ref(null)
const inquiry = ref({
  name: '',
  email: '',
  phone: '',
  message: ''
})

onMounted(async () => {
  // Für jetzt: Nur die drei Services lokal anbieten (keine API-Produkte laden)
})

function formatPrice(cents) {
  if (cents === 0) return 'Preis auf Anfrage'
  const euro = (cents / 100).toFixed(0)
  return `(ab) ${euro} €`
}

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

function openInquiry(product) {
  selectedProduct.value = product
  inquiry.value.message = `Hallo,\n\nich interessiere mich für "${product.title}".\n\nMein Projekt/meine Anfrage:\n`
  showInquiryOverlay.value = true
}

function closeInquiry() {
  showInquiryOverlay.value = false
  selectedProduct.value = null
  inquiry.value = { name: '', email: '', phone: '', message: '' }
}

function showInfo(product) {
  selectedProduct.value = product
  showInfoModal.value = true
}

function closeInfo() {
  showInfoModal.value = false
  selectedProduct.value = null
}

function openInquiryFromInfo() {
  closeInfo()
  openInquiry(selectedProduct.value)
}

function submitInquiry() {
  const subject = `Anfrage: ${selectedProduct.value?.title || 'Allgemeine Anfrage'}`
  const body = `Name: ${inquiry.value.name}\nE-Mail: ${inquiry.value.email}\nTelefon: ${inquiry.value.phone || 'Nicht angegeben'}\n\nService: ${selectedProduct.value?.title || 'Nicht spezifiziert'}\nPreis: ${selectedProduct.value ? formatPrice(selectedProduct.value.price_cents) : 'N/A'}\n\nNachricht:\n${inquiry.value.message}`
  
  const mailtoLink = `mailto:cedric@cedricarnhold.de?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  window.open(mailtoLink, '_blank')
  
  closeInquiry()
}
</script>

<style scoped>
.tagchip{ font-size:12px; padding:.25rem .5rem; border-radius:9999px; background: rgba(255,255,255,.1); color:#fff; border:1px solid rgba(255,255,255,.15) }
.tagchip.active{ background: var(--accent-raw); border-color: rgba(255,255,255,.3) }

.info-icon {
  color: rgba(255,255,255,0.6);
  transition: all 0.2s ease;
  padding: 2px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-icon:hover {
  color: var(--accent-raw);
  background: rgba(255,255,255,0.1);
  transform: scale(1.1);
}
</style>
