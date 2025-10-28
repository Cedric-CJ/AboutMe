<template>
  <div class="page-auto-contrast max-w-6xl mx-auto px-4 pt-10 pb-20">
    <div class="ice-hero">
      <h2 class="text-white text-2xl font-semibold">{{ lang === 'en' ? 'Services' : 'Leistungen' }}</h2>
      <div class="mt-2 text-cyan-200 text-sm bg-cyan-500/10 border border-cyan-300/20 rounded px-3 py-2 inline-block">
        {{ lang === 'en'
          ? 'All services are on request. Select multiple tags to filter to the most relevant services. Prices are indicative starting points.'
          : 'Alle Dienstleistungen sind auf Anfrage. Preise verstehen sich als Richtwerte. Mehrfachauswahl über Tags möglich.' }}
      </div>
      <div class="mt-4 flex gap-2 flex-wrap items-center">
        <input v-model="query" type="text" :placeholder="lang==='en' ? 'Search by title/tag' : 'Suchen nach Titel/Tag'" class="bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 w-64 px-3 py-2 rounded-md" />
        <button v-for="t in allTags" :key="t" @click="toggleTag(t)" :class="['tagchip', { active: selectedTags.includes(t) }]">{{ t }}</button>
      </div>
    </div>

    <div class="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="p in filtered" :key="p.id" class="glass-card p-4">
        <div class="text-white flex items-center justify-between text-lg font-medium">
          <span>{{ p.title }}</span>
          <div class="flex items-center gap-2">
            <span class="text-cyan-300 whitespace-nowrap">{{ formatPriceWithContext(p) }}</span>
            <button @click="showInfo(p)" class="info-icon" :title="lang==='en' ? 'More information' : 'Mehr Informationen'">
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
          <button class="glass-btn px-3 py-2 rounded-md w-full" @click="openInquiry(p)">{{ lang==='en' ? 'Make inquiry' : 'Anfrage stellen' }}</button>
        </div>
      </div>
    </div>

    <!-- Inquiry Overlay -->
    <div v-if="showInquiryOverlay" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="glass-card glass-modal p-6 max-w-3xl w-full max-h-[95vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-white text-lg font-semibold">{{ lang==='en' ? 'Make Inquiry' : 'Anfrage stellen' }}</h3>
          <button @click="closeInquiry" class="text-zinc-400 hover:text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        
        <div class="mb-4">
          <label class="block text-white text-sm font-medium mb-2">{{ lang==='en' ? 'Select a service' : 'Leistung auswählen' }}</label>
          <select v-model="selectedProductId" class="glass-select w-full px-3 py-2 rounded-md">
            <option v-for="opt in products" :key="opt.id" :value="opt.id">
              {{ sanitizeTitle(opt.title) }} — {{ formatPriceWithContext(opt) }}
            </option>
          </select>
        </div>
        
        <form @submit.prevent="submitInquiry" class="space-y-4">
          <div>
            <label class="block text-white text-sm font-medium mb-2">{{ lang==='en' ? 'Name *' : 'Name *' }}</label>
            <input v-model="inquiry.name" type="text" required class="w-full bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 px-3 py-2 rounded-md" :placeholder="lang==='en' ? 'Your name' : 'Ihr Name'" />
          </div>
          
          <div>
            <label class="block text-white text-sm font-medium mb-2">{{ lang==='en' ? 'Email *' : 'E-Mail *' }}</label>
            <input v-model="inquiry.email" type="email" required class="w-full bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 px-3 py-2 rounded-md" :placeholder="lang==='en' ? 'your@email.com' : 'ihre@email.de'" />
          </div>
          
          <div>
            <label class="block text-white text-sm font-medium mb-2">{{ lang==='en' ? 'Phone (optional)' : 'Telefon (optional)' }}</label>
            <input v-model="inquiry.phone" type="tel" class="w-full bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 px-3 py-2 rounded-md" :placeholder="lang==='en' ? '+1 234 567890' : '+49 123 456789'" />
          </div>
          
          <div>
            <label class="block text-white text-sm font-medium mb-2">{{ lang==='en' ? 'Message *' : 'Nachricht *' }}</label>
            <textarea v-model="inquiry.message" required rows="8" class="w-full bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 px-3 py-2 rounded-md resize-none min-h-[200px]" :placeholder="lang==='en' ? 'Describe your project or inquiry...' : 'Beschreiben Sie Ihr Projekt oder Ihre Anfrage...'"></textarea>
          </div>
          
          <!-- ALTCHA Widget -->
          <AltchaWidget 
            ref="altchaWidget"
            :api-url="CHALLENGE_URL"
            :lang="lang"
            @verified="onAltchaVerified"
            @error="onAltchaError"
          />
          
          <div v-if="submitError" class="error-message">
            {{ submitError }}
          </div>
          <div v-if="submitSuccess" class="success-message">
            {{ lang==='en' ? 'Your inquiry has been sent successfully!' : 'Ihre Anfrage wurde erfolgreich gesendet!' }}
          </div>
          
          <div class="flex gap-2">
            <button
              type="submit"
              class="glass-btn px-4 py-2 rounded-md flex-1"
              :disabled="isSubmitting || !altchaVerified"
            >
              {{ isSubmitting ? (lang==='en' ? 'Sending…' : 'Sende…') : (lang==='en' ? 'Send inquiry' : 'Anfrage senden') }}
            </button>
            <button type="button" @click="closeInquiry" class="glass-btn-secondary px-4 py-2 rounded-md">{{ lang==='en' ? 'Cancel' : 'Abbrechen' }}</button>
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
            <h4 class="text-white font-medium mb-2">{{ lang==='en' ? "What's included:" : 'Was ist enthalten:' }}</h4>
            <ul class="text-zinc-300 text-sm space-y-1">
              <li v-if="selectedProduct.id === 'consulting'">{{ lang==='en'
                ? '• Personal consultation (60 min.)<br>• Analysis of your current situation<br>• Concrete recommendations<br>• Written summary'
                : '• Persönliches Gespräch (60 Min.)<br>• Analyse Ihrer aktuellen Situation<br>• Konkrete Handlungsempfehlungen<br>• Schriftliche Zusammenfassung' }}</li>
              <li v-else-if="selectedProduct.id === 'modernise'">{{ lang==='en'
                ? '• Technical analysis of existing site<br>• Modern, responsive design<br>• Performance optimization<br>• SEO basics<br>• Testing & launch'
                : '• Technische Analyse der bestehenden Seite<br>• Modernes, responsives Design<br>• Performance-Optimierung<br>• SEO-Grundlagen<br>• Testing & Launch' }}</li>
              <li v-else-if="selectedProduct.id === 'custom'">{{ lang==='en'
                ? '• Individual consultation<br>• Tailored solution<br>• Price based on effort<br>• Transparent cost estimate'
                : '• Individuelle Beratung<br>• Maßgeschneiderte Lösung<br>• Preis nach Aufwand<br>• Transparente Kostenschätzung' }}</li>
              <li v-else-if="selectedProduct.id === 'site-from-scratch'">{{ lang==='en'
                ? '• Concept & planning<br>• Individual design<br>• Responsive development<br>• CMS integration<br>• Hosting setup<br>• 3 months support'
                : '• Konzeption & Planung<br>• Individuelles Design<br>• Responsive Entwicklung<br>• CMS-Integration<br>• Hosting-Setup<br>• 3 Monate Support' }}</li>
              <li v-else-if="selectedProduct.id === 'performance-seo'">{{ lang==='en'
                ? '• Lighthouse audit<br>• Core Web Vitals analysis<br>• SEO check<br>• Detailed report<br>• Prioritized action plan'
                : '• Lighthouse-Audit<br>• Core Web Vitals Analyse<br>• SEO-Check<br>• Detaillierter Bericht<br>• Priorisierter Maßnahmenplan' }}</li>
              <li v-else-if="selectedProduct.id === 'maintenance-monitoring'">{{ lang==='en'
                ? '• Regular updates<br>• Automatic backups<br>• Security monitoring<br>• Uptime monitoring<br>• Support for issues'
                : '• Regelmäßige Updates<br>• Automatische Backups<br>• Security-Monitoring<br>• Uptime-Überwachung<br>• Support bei Problemen' }}</li>
              <li v-else-if="selectedProduct.id === 'hosting-mail-setup'">{{ lang==='en'
                ? '• Domain configuration<br>• SSL certificate<br>• Email setup<br>• DNS management<br>• Basic configuration'
                : '• Domain-Konfiguration<br>• SSL-Zertifikat<br>• E-Mail-Setup<br>• DNS-Verwaltung<br>• Grundkonfiguration' }}</li>
            </ul>
          </div>
          
          <button @click="openInquiryFromInfo" class="glass-btn w-full px-4 py-2 rounded-md">{{ lang==='en' ? 'Inquire now' : 'Jetzt anfragen' }}</button>
        </div>
      </div>
    </div>
    
    <!-- Backend Maintenance Popup -->
    <BackendInProzess 
      :show="showBackendPopup"
      :form-data="{
        name: inquiry.name,
        email: inquiry.email,
        phone: inquiry.phone,
        subject: emailSubject,
        message: inquiry.message,
        service: inquirySelectedProduct?.title || ''
      }"
      :lang="lang"
      :company-email="lang === 'en' ? 'info@specialcode.de' : 'info@spezialcode.de'"
      @close="showBackendPopup = false"
      @email-opened="onEmailFallbackUsed"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import AltchaWidget from '@/components/AltchaWidget.vue'
import BackendInProzess from '@/components/BackendInProzess.vue'

// Language detection (route name prefix or preferred_lang)
const route = useRoute()
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

// ALTCHA verification is handled via AltchaWidget component

// Products with canonical IDs; titles/descriptions localized per language
const demoProductsDe = [
  { id: 'consulting', title: 'Beratung', description: 'Individuelle Beratung rund um Web, Hosting und Modernisierung.', price_cents: 9900, currency: 'EUR', tags: ['Service'], active: true },
  { id: 'modernise', title: 'Seite modernisieren', description: 'Bestehende Webseite in modernes Design und bessere Performance überführen.', price_cents: 24900, currency: 'EUR', tags: ['Service'], active: true },
  { id: 'custom', title: 'Sonderwünsche', description: 'Individuelle Features und Speziallösungen nach Absprache.', price_cents: 0, currency: 'EUR', tags: ['Service'], active: true },
  { id: 'site-from-scratch', title: 'Webseite von Grund auf', description: 'Planung, Design, Umsetzung & Hosting-Einrichtung – alles aus einer Hand.', price_cents: 89900, currency: 'EUR', tags: ['Projekt','Web'], active: true },
  { id: 'performance-seo', title: 'Performance-/SEO-Check', description: 'Core Web Vitals, Lighthouse, Bildoptimierung, Caching, Accessibility – Bericht & Maßnahmenplan.', price_cents: 14900, currency: 'EUR', tags: ['Audit','SEO','Performance'], active: true },
  { id: 'maintenance-monitoring', title: 'Wartung & Monitoring', description: 'Updates, Backups, Security-Checks, Uptime-Monitoring und kleinere Fixes.', price_cents: 5900, currency: 'EUR', tags: ['Wartung'], active: true },
  { id: 'hosting-mail-setup', title: 'Hosting-/Mail-Setup', description: 'Domain, DNS, SSL, Mail (z. B. mit eigenen Subdomains), grundlegende Server-Konfiguration.', price_cents: 12900, currency: 'EUR', tags: ['Setup','Server'], active: true }
]
const demoProductsEn = [
  { id: 'consulting', title: 'Consulting', description: 'Individual consulting around web, hosting and modernisation.', price_cents: 9900, currency: 'EUR', tags: ['Service'], active: true },
  { id: 'modernise', title: 'Modernise a website', description: 'Upgrade an existing website to a modern design and better performance.', price_cents: 24900, currency: 'EUR', tags: ['Service'], active: true },
  { id: 'custom', title: 'Custom features', description: 'Individual features and special solutions on request.', price_cents: 0, currency: 'EUR', tags: ['Service'], active: true },
  { id: 'site-from-scratch', title: 'Website from scratch (from)', description: 'Planning, design, implementation & hosting setup – all from one source.', price_cents: 89900, currency: 'EUR', tags: ['Project','Web'], active: true },
  { id: 'performance-seo', title: 'Performance/SEO check (from)', description: 'Core Web Vitals, Lighthouse, image optimisation, caching, accessibility – report & action plan.', price_cents: 14900, currency: 'EUR', tags: ['Audit','SEO','Performance'], active: true },
  { id: 'maintenance-monitoring', title: 'Maintenance & monitoring (from/month)', description: 'Updates, backups, security checks, uptime monitoring and minor fixes.', price_cents: 5900, currency: 'EUR', tags: ['Maintenance'], active: true },
  { id: 'hosting-mail-setup', title: 'Hosting/Mail setup (from)', description: 'Domain, DNS, SSL, mail (e.g. with custom subdomains), basic server configuration.', price_cents: 12900, currency: 'EUR', tags: ['Setup','Server'], active: true }
]

const query = ref('')
const products = computed(() => (lang.value === 'en' ? demoProductsEn : demoProductsDe))
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

// ALTCHA + API config/state
const API_URL = (() => {
  const envUrl = import.meta.env?.VITE_INQUIRY_API
  if (envUrl && envUrl.trim() !== '') {
    return envUrl
  }
  if (typeof window !== 'undefined') {
    const origin = window.location.origin ?? ''
    if (/https?:\/\/(localhost|127\.0\.0\.1)/i.test(origin)) {
      return 'http://127.0.0.1:8000/api/submit.php'
    }
  }
  return '/api/submit/'
})()

const CHALLENGE_URL = (() => {
  if (API_URL.includes('submit.php')) {
    return API_URL.replace('submit.php', 'challenge.php')
  }
  if (API_URL.endsWith('/submit')) {
    return API_URL.slice(0, -('/submit'.length)) + '/challenge/'
  }
  if (API_URL.endsWith('/submit/')) {
    return API_URL.slice(0, -('/submit/'.length)) + '/challenge/'
  }
  return '/api/challenge/'
})()
const isSubmitting = ref(false)
const submitError = ref('')
const submitSuccess = ref(false)
const altchaWidget = ref(null)
const altchaVerified = ref(false)
const showBackendPopup = ref(false)

// Backend Status - set to true when backend is ready, false to show popup
const BACKEND_ACTIVE = import.meta.env?.VITE_BACKEND_ACTIVE === 'true' || false

function onAltchaVerified(payload) {
  altchaVerified.value = true
  submitError.value = ''
}

function onAltchaError(error) {
  altchaVerified.value = false
  submitError.value = lang.value === 'en' 
    ? 'Verification failed. Please try again.' 
    : 'Verifizierung fehlgeschlagen. Bitte versuchen Sie es erneut.'
}

function formatPrice(cents) {
  if (cents === 0) return lang.value === 'en' ? 'Price on request' : 'Preis auf Anfrage'
  const euro = (cents / 100).toFixed(0)
  return lang.value === 'en' ? `(from) ${euro} €` : `(ab) ${euro} €`
}

function formatPriceWithContext(p) {
  if (!p) return ''
  const base = formatPrice(p.price_cents)
  // Append per-month marker for maintenance plan
  if (p.id === 'maintenance-monitoring') return `${base}\u00A0${lang.value==='en' ? 'p.m.' : 'p.M.'}`
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
  inquiry.value.message = lang.value === 'en'
    ? `Hello Cedric,\n\nI'm interested in \"${sanitizeTitle(product.title)}\".\n\nA quick note about my project/inquiry:\n`
    : `Hallo Cedric,\n\nich interessiere mich für \"${sanitizeTitle(product.title)}\".\n\nKurz zu meinem Projekt/meiner Anfrage:\n`
  showInquiryOverlay.value = true
}

function closeInquiry() {
  showInquiryOverlay.value = false
  selectedProduct.value = null
  inquiry.value = { name: '', email: '', phone: '', message: '' }
  altchaVerified.value = false
  submitSuccess.value = false
  submitError.value = ''
  if (altchaWidget.value) {
    altchaWidget.value.reset()
  }
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
  return lang.value === 'en'
    ? `Inquiry: ${p ? sanitizeTitle(p.title) : 'General inquiry'}`
    : `Anfrage: ${p ? sanitizeTitle(p.title) : 'Allgemeine Anfrage'}`
})

// Keep the inquiry text in sync with dropdown selection (only if template header is intact)
function updateInquiryTemplateService() {
  const p = inquirySelectedProduct.value
  if (!p) return
  const header = lang.value === 'en' ? 'Hello Cedric,' : 'Hallo Cedric,'
  const marker = lang.value === 'en' ? 'A quick note about my project/inquiry:' : 'Kurz zu meinem Projekt/meiner Anfrage:'
  const msg = inquiry.value.message || ''
  if (msg.startsWith(header)) {
    // Split by marker to preserve everything the user wrote after it
    const parts = msg.split(marker)
    const tail = parts.length > 1 ? parts.slice(1).join(marker) : '\n'
    inquiry.value.message = lang.value === 'en'
      ? `${header}\n\nI'm interested in \"${sanitizeTitle(p.title)}\".\n\n${marker}\n${tail.trimStart()}`
      : `${header}\n\nich interessiere mich für \"${sanitizeTitle(p.title)}\".\n\n${marker}\n${tail.trimStart()}`
  }
}

watch(selectedProductId, () => {
  if (showInquiryOverlay.value) updateInquiryTemplateService()
})

async function submitInquiry() {
  submitError.value = ''
  submitSuccess.value = false
  
  // Check if backend is active
  if (!BACKEND_ACTIVE) {
    showBackendPopup.value = true
    return
  }
  
  // Check ALTCHA verification
  if (!altchaWidget.value || !altchaWidget.value.isVerified()) {
    submitError.value = lang.value === 'en'
      ? 'Please complete the verification first.'
      : 'Bitte schließen Sie zuerst die Verifizierung ab.'
    return
  }
  
  isSubmitting.value = true
  try{
    const altchaPayload = altchaWidget.value.getPayload()
    
    const p = inquirySelectedProduct.value
    const payload = {
      name: inquiry.value.name,
      email: inquiry.value.email,
      phone: inquiry.value.phone,
      subject: emailSubject.value,
      message: inquiry.value.message,
      source: 'services',
      service_id: p ? p.id : null,
      altcha: altchaPayload
    }

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    
    const data = await res.json()
    
    if (!res.ok) {
      // If backend is not reachable, show fallback popup
      if (res.status === 0 || res.status >= 500) {
        showBackendPopup.value = true
        return
      }
      throw new Error(data.error || 'Request failed: ' + res.status)
    }
    
    submitSuccess.value = true
    setTimeout(() => {
      closeInquiry()
    }, 3000)
  }catch(err){
    // Check if it's a network error (backend not reachable)
    if (err.message.includes('Failed to fetch') || err.message.includes('Network')) {
      showBackendPopup.value = true
      isSubmitting.value = false
      return
    }
    submitError.value = String(err?.message || err || 'Unknown error')
    console.error('Services inquiry failed', err)
  }finally{
    isSubmitting.value = false
  }
}

function onEmailFallbackUsed() {
  // Log when user uses email fallback
  console.log('User used email fallback from services')
  // Reset inquiry after email is opened
  setTimeout(() => {
    closeInquiry()
  }, 1000)
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

/* Error and success messages */
.error-message{ padding:10px 12px; background: rgba(239,68,68,.1); border:1px solid rgba(239,68,68,.3); border-radius:8px; color:#ef4444; font-size:14px; margin-top:8px }
.success-message{ padding:10px 12px; background: rgba(34,197,94,.1); border:1px solid rgba(34,197,94,.3); border-radius:8px; color:#22c55e; font-size:14px; margin-top:8px }
</style>
