<template>
  <div class="page-auto-contrast max-w-6xl mx-auto px-4 pt-10 pb-20">
    <div class="ice-hero">
      <h2 class="text-white text-2xl font-semibold">Leistungen</h2>
      <div class="mt-2 text-cyan-200 text-sm bg-cyan-500/10 border border-cyan-300/20 rounded px-3 py-2 inline-block">
        Alle Dienstleistungen sind auf Anfrage. Preise verstehen sich als Richtwerte. Bis jetzt nur mit externen Mailclients möglich.
      </div>
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
            <span class="text-cyan-300 whitespace-nowrap">{{ formatPriceWithContext(p) }}</span>
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
        <div class="mt-4">
          <button class="glass-btn px-3 py-2 rounded-md w-full" @click="openInquiry(p)">Anfrage stellen</button>
        </div>
      </div>
    </div>

    <!-- Inquiry Overlay -->
    <div v-if="showInquiryOverlay" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="glass-card glass-modal p-6 max-w-3xl w-full max-h-[95vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-white text-lg font-semibold">Anfrage stellen</h3>
          <button @click="closeInquiry" class="text-zinc-400 hover:text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        
        <div class="mb-4">
          <label class="block text-white text-sm font-medium mb-2">Leistung auswählen</label>
          <select v-model="selectedProductId" class="glass-select w-full px-3 py-2 rounded-md">
            <option v-for="opt in products" :key="opt.id" :value="opt.id">
              {{ sanitizeTitle(opt.title) }} — {{ formatPriceWithContext(opt) }}
            </option>
          </select>
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
            <textarea v-model="inquiry.message" required rows="8" class="w-full bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 px-3 py-2 rounded-md resize-none min-h-[200px]" placeholder="Beschreiben Sie Ihr Projekt oder Ihre Anfrage..."></textarea>
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
          <div class="text-cyan-300 text-lg font-medium whitespace-nowrap">{{ formatPriceWithContext(selectedProduct) }}</div>
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
import { ref, computed, onMounted, watch } from 'vue'

const demoProducts = [
  { id: 'beratung', title: 'Beratung', description: 'Individuelle Beratung rund um Web, Hosting und Modernisierung.', price_cents: 9900, currency: 'EUR', tags: ['Service'], active: true },
  { id: 'modernisieren', title: 'Seite modernisieren', description: 'Bestehende Webseite in modernes Design und bessere Performance überführen.', price_cents: 24900, currency: 'EUR', tags: ['Service'], active: true },
  { id: 'sonderwuensche', title: 'Sonderwünsche', description: 'Individuelle Features und Speziallösungen nach Absprache.', price_cents: 0, currency: 'EUR', tags: ['Service'], active: true },
  { id: 'web-von-grund-auf', title: 'Webseite von Grund auf', description: 'Planung, Design, Umsetzung & Hosting-Einrichtung – alles aus einer Hand.', price_cents: 89900, currency: 'EUR', tags: ['Projekt','Web'], active: true },
  { id: 'performance-seo', title: 'Performance-/SEO-Check', description: 'Core Web Vitals, Lighthouse, Bildoptimierung, Caching, Accessibility – Bericht & Maßnahmenplan.', price_cents: 14900, currency: 'EUR', tags: ['Audit','SEO','Performance'], active: true },
  { id: 'wartung-monitoring', title: 'Wartung & Monitoring', description: 'Updates, Backups, Security-Checks, Uptime-Monitoring und kleinere Fixes.', price_cents: 5900, currency: 'EUR', tags: ['Wartung'], active: true },
  { id: 'hosting-mail-setup', title: 'Hosting-/Mail-Setup', description: 'Domain, DNS, SSL, Mail (z. B. mit eigenen Subdomains), grundlegende Server-Konfiguration.', price_cents: 12900, currency: 'EUR', tags: ['Setup','Server'], active: true }
]

const query = ref('')
const products = ref(demoProducts)
const selectedTags = ref([])
const showInquiryOverlay = ref(false)
const showInfoModal = ref(false)
const selectedProduct = ref(null)
const selectedProductId = ref(null)
const inquiry = ref({
  name: '',
  email: '',
  phone: '',
  message: ''
})

onMounted(async () => {
  // Inhalte sind nur zur Auswahl, Beauftragung erfolgt nach Rücksprache
})

function formatPrice(cents) {
  if (cents === 0) return 'Preis auf Anfrage'
  const euro = (cents / 100).toFixed(0)
  return `(ab) ${euro} €`
}

function formatPriceWithContext(p) {
  if (!p) return ''
  const base = formatPrice(p.price_cents)
  // Append per-month marker for maintenance plan
  if (p.id === 'wartung-monitoring') return `${base}\u00A0p.M.`
  return base
}

function sanitizeTitle(title){
  if (!title) return ''
  // Remove occurrences like '(ab)', '(ab/Monat)', '(from)', '(from/month)' etc.
  return title.replace(/\s*\((ab|from)(?:[^)]*)\)/gi, '').trim()
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
  selectedProductId.value = product?.id || null
  inquiry.value.message = `Hallo Cedric,\n\nich interessiere mich für \"${sanitizeTitle(product.title)}\".\n\nKurz zu meinem Projekt/meiner Anfrage:\n`
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

const inquirySelectedProduct = computed(() => {
  const byId = products.value.find(p => p.id === selectedProductId.value)
  return byId || selectedProduct.value
})

const emailSubject = computed(() => {
  const p = inquirySelectedProduct.value
  return `Anfrage: ${p ? sanitizeTitle(p.title) : 'Allgemeine Anfrage'}`
})

// Keep the inquiry text in sync with dropdown selection (only if template header is intact)
function updateInquiryTemplateService() {
  const p = inquirySelectedProduct.value
  if (!p) return
  const header = 'Hallo Cedric,'
  const marker = 'Kurz zu meinem Projekt/meiner Anfrage:'
  const msg = inquiry.value.message || ''
  if (msg.startsWith(header)) {
    // Split by marker to preserve everything the user wrote after it
    const parts = msg.split(marker)
    const tail = parts.length > 1 ? parts.slice(1).join(marker) : '\n'
    inquiry.value.message = `${header}\n\nich interessiere mich für \"${sanitizeTitle(p.title)}\".\n\n${marker}\n${tail.trimStart()}`
  }
}

watch(selectedProductId, () => {
  if (showInquiryOverlay.value) updateInquiryTemplateService()
})

function submitInquiry() {
  const p = inquirySelectedProduct.value
  const subject = emailSubject.value
  const body = `Name: ${inquiry.value.name}\nE-Mail: ${inquiry.value.email}\nTelefon: ${inquiry.value.phone || 'Nicht angegeben'}\n\nService: ${p ? sanitizeTitle(p.title) : 'Nicht spezifiziert'}\nPreis: ${p ? formatPriceWithContext(p) : 'N/A'}\n\nNachricht an Cedric:\n${inquiry.value.message}`
  
  const mailtoLink = `mailto:cedric.jon.arnhold@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
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

/* Glass select for dark mode */
.glass-select {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  color: #fff;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  backdrop-filter: blur(6px);
}
/* Add a subtle dropdown arrow using a linear-gradient */
.glass-select {
  background-image:
    linear-gradient(45deg, transparent 50%, rgba(255,255,255,0.6) 50%),
    linear-gradient(135deg, rgba(255,255,255,0.6) 50%, transparent 50%);
  background-position:
    calc(100% - 20px) calc(50% - 2px),
    calc(100% - 15px) calc(50% - 2px);
  background-size: 5px 5px, 5px 5px;
  background-repeat: no-repeat;
  padding-right: 36px; /* room for arrow */
}
.glass-select:focus {
  outline: none;
  border-color: rgba(255,255,255,0.25);
  box-shadow: 0 0 0 3px rgba(255,255,255,0.1);
}
/* Ensure options have readable contrast in dark mode (support varies across browsers) */
.glass-select option { color: #fff; background: rgba(0,0,0,0.8); }

/* Glass styled scrollbar for the inquiry modal */
.glass-modal {
  /* Hide scrollbar visuals but keep scrolling if needed */
  scrollbar-width: none; /* Firefox */
}
.glass-modal::-webkit-scrollbar { width: 0; height: 0; }
</style>
