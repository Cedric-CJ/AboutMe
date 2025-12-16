<template>
  <div class="contact-root">
    <div class="contact-overlay page-auto-contrast">
      <div class="contact-blur" />
      <div class="contact-modal glass-card">

        <div class="mt-5 quick-links" @mousemove="handleMouseMove" @touchmove="handleMouseMove">
          <button class="card" @click="openEmail">
            <div class="card-content">
              <img :src="isDark ? emailDark : emailLight" :alt="lang==='en' ? 'Email' : 'E-Mail'" class="icon" />
              <div class="card-text">
                <p class="label">{{ lang==='en' ? 'Email' : 'E-Mail' }}</p>
              </div>
            </div>
          </button>
          <button class="card" type="button" @click="openLink('https://github.com/Cedric-CJ')">
            <div class="card-content">
              <img :src="isDark ? githubDark : githubLight" alt="GitHub" class="icon" />
              <div class="card-text">
                <p class="label">GitHub</p>
              </div>
            </div>
          </button>
          <button class="card" type="button" @click="openLink('https://www.linkedin.com/in/cedric-arnhold-853a122a0')">
            <div class="card-content">
              <img :src="isDark ? linkedinDark : linkedinLight" alt="LinkedIn" class="icon" />
              <div class="card-text">
                <p class="label">LinkedIn</p>
              </div>
            </div>
          </button>
          <button class="card" type="button" @click="openLink('https://discord.com/users/456140165094572054')">
            <div class="card-content">
              <img :src="isDark ? discordDark : discordLight" alt="Discord" class="icon" />
              <div class="card-text">
                <p class="label">Discord</p>
              </div>
            </div>
          </button>
        </div>

        <div class="accent-divider my-6"></div>

        <form @submit.prevent="submitInquiry" class="form-grid">
          <div v-if="pendingRestore?.data" class="restore-banner">
            <div class="restore-text">
              <p class="title">{{ lang==='en' ? 'Draft found' : 'Entwurf gefunden' }}</p>
              <p class="lead">
                {{ lang==='en'
                  ? 'Restore your last message? It was started from another entry.'
                  : 'Letzte Nachricht wiederherstellen? Sie wurde über einen anderen Einstieg begonnen.' }}
              </p>
            </div>
            <div class="restore-actions">
              <button type="button" class="ghost-btn" @click="dismissRestore">{{ lang==='en' ? 'Ignore' : 'Ignorieren' }}</button>
              <button type="button" class="primary-btn" @click="applyRestore">{{ lang==='en' ? 'Restore' : 'Wiederherstellen' }}</button>
            </div>
          </div>
          <div class="grid md:grid-cols-2 gap-3">
            <input v-model="form.name" type="text" :placeholder="lang==='en' ? 'Your name' : 'Dein Name'" class="input" name="name" autocomplete="name" required />
            <input v-model="form.email" type="email" :placeholder="lang==='en' ? 'Email' : 'E-Mail'" class="input" name="email" autocomplete="email" required />
          </div>
          <input v-model="form.subject" type="text" :placeholder="lang==='en' ? 'Subject' : 'Betreff'" class="input" required />
          <textarea v-model="form.message" :placeholder="lang==='en' ? 'Message' : 'Nachricht'" class="input min-h-32" required></textarea>
          
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
            {{ lang==='en' ? 'Your message has been sent successfully!' : 'Ihre Nachricht wurde erfolgreich gesendet!' }}
          </div>
          
          <div class="form-actions">
            <button type="button" class="ghost-btn" @click="handleCloseClick">{{ lang==='en' ? 'Close' : 'Schließen' }}</button>
            <button type="submit" class="primary-btn" :disabled="isSubmitting || !altchaVerified">
              {{ isSubmitting ? (lang==='en' ? 'Sending...' : 'Sende...') : (lang==='en' ? 'Send' : 'Senden') }}
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <BackendInProzess 
      :show="showBackendPopup"
      :form-data="{
        name: form.name,
        email: form.email,
        phone: '',
        subject: form.subject,
        message: form.message,
        service: ''
      }"
      :lang="lang"
      :company-email="lang === 'en' ? 'info@specialcode.de' : 'info@spezialcode.de'"
      @close="showBackendPopup = false"
      @email-opened="onEmailFallbackUsed"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AltchaWidget from '@/components/AltchaWidget.vue'
import BackendInProzess from '@/components/BackendInProzess.vue'
import emailDark from '@/assets/icons/email-dark.png'
import emailLight from '@/assets/icons/email-light.png'
import githubDark from '@/assets/icons/github-dark.svg'
import githubLight from '@/assets/icons/github-light.svg'
import linkedinDark from '@/assets/icons/linkedin-dark.svg'
import linkedinLight from '@/assets/icons/linkedin-light.svg'
import discordDark from '@/assets/icons/discord-dark.svg'
import discordLight from '@/assets/icons/discord-light.svg'

const router = useRouter()
const props = defineProps({
  prefill: { type: Object, default: null }
})
const emit = defineEmits(['close'])
const route = useRoute()
const isDark = ref(false)
const form = ref({ name:'', email:'', subject:'', message:'' })
const isSubmitting = ref(false)
const submitError = ref('')
const submitSuccess = ref(false)
const altchaWidget = ref(null)
const altchaVerified = ref(false)
const showBackendPopup = ref(false)
const currentSource = ref('default')
const DRAFT_KEY = 'contact_last_draft'
const pendingRestore = ref(null)

const API_URL = (() => {
  const envUrl = import.meta.env?.VITE_INQUIRY_API
  if (envUrl && envUrl.trim() !== '') {
    return envUrl
  }
  if (typeof window !== 'undefined') {
    const origin = window.location.origin ?? ''
    const knownHosts = [
      'https://specialcode.de',
      'https://www.specialcode.de',
      'https://spezialcode.de',
      'https://www.spezialcode.de'
    ]
    if (knownHosts.includes(origin)) {
      return `${origin}/api/submit.php`
    }
    if (/https?:\/\/(localhost|127\\.0\\.0\\.1)/i.test(origin)) {
      return 'http://127.0.0.1:8000/api/submit.php'
    }
  }
  return '/api/submit.php'
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

const BACKEND_ACTIVE = import.meta.env?.VITE_BACKEND_ACTIVE === 'true' || false

const lang = computed(() => {
  try {
    const pref = localStorage.getItem('preferred_lang')
    if (pref === 'de' || pref === 'en') return pref
  } catch (e) {}
  const n = String(route.name || '')
  if (n.startsWith('de-')) return 'de'
  if (n.startsWith('en-')) return 'en'
  return 'de'
})

function saveDraft(){
  try {
    const payload = {
      source: currentSource.value || 'default',
      data: { ...form.value }
    }
    localStorage.setItem(DRAFT_KEY, JSON.stringify(payload))
  } catch (e) {}
}

function loadDraft(){
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    return parsed
  } catch (e) { return null }
}

function clearDraft(){
  try { localStorage.removeItem(DRAFT_KEY) } catch (e) {}
}

function closeOverlay(){
  saveDraft()
  const p = route?.path || ''
  if (p === '/contact' || p === '/kontakt') {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.replace('/')
    }
  }
  const evt = typeof Event !== 'undefined' ? new Event('close_contact_overlay') : null
  if (evt) {
    window.dispatchEvent(evt)
  }
  emit('close')
}

function openEmail(){
  const addr = lang.value === 'en' ? 'info@specialcode.de' : 'info@spezialcode.de'
  window.location.href = `mailto:${addr}`
}

function openLink(url){
  try {
    window.open(url, '_blank', 'noreferrer')
  } catch (e) {
    window.location.href = url
  }
}

function handleMouseMove(event){
  const cards = document.querySelectorAll('.card')
  cards.forEach(card => {
    const rect = card.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    card.style.setProperty('--xPos', `${x}px`)
    card.style.setProperty('--yPos', `${y}px`)
  })
}

function onAltchaVerified() {
  altchaVerified.value = true
  submitError.value = ''
}

function onAltchaError() {
  altchaVerified.value = false
  submitError.value = lang.value === 'en' 
    ? 'Verification failed. Please try again.' 
    : 'Verifizierung fehlgeschlagen. Bitte versuchen Sie es erneut.'
}

async function submitInquiry(){
  submitError.value = ''
  submitSuccess.value = false
  
  if (!BACKEND_ACTIVE) {
    showBackendPopup.value = true
    return
  }
  
  if (!altchaWidget.value || !altchaWidget.value.isVerified()) {
    submitError.value = lang.value === 'en'
      ? 'Please complete the verification first.'
      : 'Bitte schließe die Verifizierung zuerst ab.'
    return
  }
  
  isSubmitting.value = true
  try{
    const altchaPayload = altchaWidget.value.getPayload()
    
    const payload = {
      name: form.value.name,
      email: form.value.email,
      subject: form.value.subject,
      phone: '',
      message: form.value.message,
      source: 'contact',
      service_id: null,
      altcha: altchaPayload
    }

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    
    const data = await res.json()
    
    if (!res.ok) {
      if (res.status === 0 || res.status >= 500) {
        showBackendPopup.value = true
        return
      }
      throw new Error(data.error || 'Request failed: ' + res.status)
    }
    
    submitSuccess.value = true
    clearDraft()
    setTimeout(() => {
      resetForm()
    }, 3000)
  }catch(err){
    if (String(err?.message || '').includes('Failed to fetch') || String(err?.message || '').includes('Network')) {
      showBackendPopup.value = true
      isSubmitting.value = false
      return
    }
    submitError.value = String(err?.message || err || 'Unknown error')
    console.error('Submit failed', err)
  }finally{
    isSubmitting.value = false
  }
}

function onEmailFallbackUsed() {
  setTimeout(() => {
    resetForm()
  }, 1000)
}

function resetForm(){ 
  form.value = { name:'', email:'', subject:'', message:'' }
  altchaVerified.value = false
  submitSuccess.value = false
  submitError.value = ''
  clearDraft()
  pendingRestore.value = null
  if (altchaWidget.value) {
    altchaWidget.value.reset()
  }
}

function hasContent(data){
  return Object.values(data || {}).some(v => String(v || '').trim().length > 0)
}

function applyPrefill(pref, preserveMessage = false){
  if (!pref) return
  form.value = {
    ...form.value,
    name: pref.name ?? form.value.name,
    email: pref.email ?? form.value.email,
    subject: pref.subject ?? form.value.subject,
    message: preserveMessage ? form.value.message : (pref.message ?? form.value.message)
  }
}

watch(() => props.prefill, (val) => {
  const incomingSource = val?.source || 'default'
  currentSource.value = incomingSource
  const stored = loadDraft()
  const hasDraft = stored?.data && hasContent(stored.data)
  const sameSource = (stored?.source || 'default') === incomingSource
  if (sameSource && hasDraft){
    form.value = { ...form.value, ...stored.data }
    applyPrefill(val, true)
    pendingRestore.value = { data: stored.data, source: stored.source || 'default' }
  } else {
    applyPrefill(val, false)
    pendingRestore.value = hasDraft ? { data: stored.data, source: stored.source || 'default' } : null
  }
}, { immediate: true })

function handleCloseClick(){
  saveDraft()
  closeOverlay()
}

function applyRestore(){
  if (pendingRestore.value?.data){
    form.value = { ...form.value, ...pendingRestore.value.data }
  }
  pendingRestore.value = null
}

function dismissRestore(){
  pendingRestore.value = null
}

function onKeydown(e) {
  if (e.key === 'Escape') {
    closeOverlay()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<style scoped>
.contact-overlay{
  position: fixed;
  inset: 0;
  z-index: 220;
  display: grid;
  align-items: flex-start;
  justify-content: center;
  padding: clamp(12px, 3vw, 26px);
  overflow-y: auto;
}
.contact-blur{
  position:absolute; inset:0;
  backdrop-filter: blur(18px);
  background: radial-gradient(circle at 18% 18%, rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .20), transparent 42%),
              radial-gradient(circle at 82% 78%, rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .22), transparent 46%),
              rgba(8, 16, 26, 0.42);
  z-index: 0;
}
.contact-modal{
  position: relative;
  z-index: 1;
  width: min(95vw, 840px);
  max-height: min(95vh, 940px);
  overflow: auto;
  border-radius: 22px;
  padding: clamp(18px, 2.4vw, 28px);
  background: linear-gradient(160deg, rgba(18,28,42,.85), rgba(16,54,72,.75));
  border:1px solid rgba(255,255,255,.18);
  box-shadow: 0 28px 90px rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .18);
}
.contact-top{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:10px;
}
.contact-chip{
  display:inline-flex;
  align-items:center;
  gap:8px;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(255,255,255,.08);
  border:1px solid rgba(255,255,255,.16);
  color:#e9f6f7;
  font-weight:600;
  font-size: 14px;
}
.ghost-close{
  background: none;
  border: 1px solid rgba(255,255,255,.22);
  color: #d7e6eb;
  border-radius: 10px;
  padding: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color .2s ease, color .2s ease, background .2s ease;
}
.ghost-close:hover,
.ghost-close:focus-visible{
  border-color: rgba(255,255,255,.36);
  background: rgba(255,255,255,.08);
  color: #fff;
}
.contact-intro{
  margin-top: 18px;
  color:#dfeff2;
}
.contact-intro h3{
  font-size: clamp(20px, 2.4vw, 24px);
  font-weight: 700;
  margin: 0 0 6px 0;
}
.contact-intro p{
  margin: 0;
  color: #b7d1d6;
}
.quick-links{
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px,1fr));
  gap: 12px;
}
.card{
  position:relative;
  overflow:hidden;
  border-radius: 14px;
  background: rgba(255,255,255,.08);
  border: 1px solid rgba(255,255,255,.18);
  cursor:pointer;
  min-height: 92px;
  transition: transform .18s ease, border-color .2s ease, box-shadow .2s ease;
}
.card::before{
  content:"";
  position:absolute;
  top:var(--yPos);
  left:var(--xPos);
  transform: translate(-50%,-50%);
  width:230px; height:230px;
  background: radial-gradient(circle, rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .25), transparent 60%);
  opacity:.5;
  transition: opacity .2s;
  pointer-events:none;
}
.card:hover{
  transform: translateY(-2px);
  border-color: rgba(255,255,255,.32);
  box-shadow: 0 12px 30px rgba(0,0,0,.28);
}
.card:hover::before{ opacity:1 }
.card-content{
  position:relative;
  z-index:1;
  display:flex;
  align-items:center;
  justify-content:center;
  gap:12px;
  padding: 16px;
  color:#fff;
  width: 100%;
}
.card-text{
  display:flex;
  flex-direction:column;
  gap:2px;
  align-items:center;
  text-align:center;
}
.card .label{
  color:#f6fbff;
  font-weight:600;
  line-height: 1.2;
}
.card .icon{
  filter: brightness(0) invert(1);
}
.quick-links .card{
  justify-content:center;
}
.contact-overlay::-webkit-scrollbar{
  width: 0;
  height: 0;
}
.contact-overlay{
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,.35) transparent;
}
.contact-overlay::-webkit-scrollbar-track{
  background: transparent;
}
.contact-overlay::-webkit-scrollbar-thumb{
  background: rgba(255,255,255,.3);
  border-radius: 999px;
}
@media (max-width: 640px){
  .contact-modal{
    width: 95vw;
    max-height: calc(100dvh - 18px);
    padding: 16px;
    border-radius: 18px;
    margin-top: 6px;
  }
  .contact-overlay{
    padding: 10px;
    align-items: flex-start;
  }
  .form-actions{
    justify-content: flex-start;
  }
  .contact-top{
    position: sticky;
    top: 0;
    padding-bottom: 6px;
    background: linear-gradient(180deg, rgba(18,28,42,.95), rgba(18,28,42,.75));
    z-index: 2;
  }
}
.restore-banner{
  display:flex;
  flex-direction:column;
  gap:10px;
  padding: 12px;
  border-radius: 12px;
  background: rgba(255,255,255,.06);
  border:1px solid rgba(255,255,255,.18);
}
.restore-banner .title{
  margin:0;
  color:#fff;
  font-weight:700;
}
.restore-banner .lead{
  margin:0;
  color:#d6e3ea;
  font-size: 14px;
}
.restore-actions{
  display:flex;
  gap:8px;
  flex-wrap: wrap;
}
@media (max-width: 640px){
  .quick-links{
    grid-template-columns: repeat(2,minmax(0,1fr));
  }
  .card{
    min-height: 76px;
  }
  .card-text{
    display:none;
  }
  .card-content{
    justify-content:center;
  }
  .card .icon{
    width: 32px; height: 32px;
  }
}
.icon{
  width: clamp(22px, 4vw, 32px);
  height: auto;
  object-fit: contain;
}
.form-grid{
  display: grid;
  gap: 12px;
}
.input{
  width:100%;
  color:#fff;
  background: rgba(255,255,255,.08);
  border:1px solid rgba(255,255,255,.18);
  border-radius: 12px;
  padding: 12px 14px;
  outline:none;
  font-size: 15px;
}
.input:focus{
  border-color: rgba(255,255,255,.36);
}
.form-actions{
  display:flex;
  gap:10px;
  justify-content:flex-end;
  flex-wrap: wrap;
}
.ghost-btn,
.primary-btn{
  border-radius: 10px;
  padding: 10px 16px;
  border:1px solid transparent;
  font-weight:600;
  cursor:pointer;
  transition: transform .15s ease, box-shadow .2s ease, border-color .2s ease, background .2s ease;
}
.ghost-btn{
  background: rgba(255,255,255,.08);
  border-color: rgba(255,255,255,.18);
  color:#e7f4f7;
}
.ghost-btn:hover,
.ghost-btn:focus-visible{
  border-color: rgba(255,255,255,.32);
}
.primary-btn{
  background: linear-gradient(
    135deg,
    rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .9),
    rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .9)
  );
  color: var(--accent-text, #031019);
  box-shadow: 0 12px 30px rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .25);
}
.primary-btn:disabled{
  opacity:.6;
  cursor:not-allowed;
  box-shadow:none;
}
.primary-btn:not(:disabled):hover,
.primary-btn:not(:disabled):focus-visible{
  transform: translateY(-1px);
  box-shadow: 0 18px 40px rgba(0,0,0,.25);
}
.error-message{
  padding:10px 12px;
  background: rgba(239,68,68,.12);
  border:1px solid rgba(239,68,68,.32);
  border-radius:8px;
  color:#ef4444;
  font-size:14px;
  margin-top:4px;
}
.success-message{
  padding:10px 12px;
  background: rgba(34,197,94,.12);
  border:1px solid rgba(34,197,94,.32);
  border-radius:8px;
  color:#22c55e;
  font-size:14px;
  margin-top:4px;
}
@media (max-width: 640px){
  .contact-modal{
    width: 95vw;
    max-height: calc(100dvh - 18px);
    padding: 16px;
    border-radius: 18px;
    margin-top: 6px;
  }
  .contact-overlay{
    padding: 10px;
    align-items: flex-start;
  }
  .form-actions{
    justify-content: flex-start;
  }
  .contact-top{
    position: sticky;
    top: 0;
    padding-bottom: 6px;
    background: linear-gradient(180deg, rgba(18,28,42,.95), rgba(18,28,42,.75));
    z-index: 2;
  }
}
@media (min-width: 1024px){
  .contact-modal{
    width: min(90vw, 900px);
  }
  .input{
    font-size: 16px;
  }
}
.min-h-32{
  min-height: clamp(160px, 40vh, 320px);
  max-height: 360px;
  overflow: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,.3) transparent;
}
.min-h-32::-webkit-scrollbar{
  width: 8px;
}
.min-h-32::-webkit-scrollbar-track{
  background: transparent;
}
.min-h-32::-webkit-scrollbar-thumb{
  background: rgba(255,255,255,.35);
  border-radius: 999px;
}
.icon{
  width: clamp(22px, 4vw, 32px);
  height: auto;
  object-fit: contain;
}
.form-grid{
  display: grid;
  gap: 12px;
}
.input{
  width:100%;
  color:#fff;
  background: rgba(255,255,255,.08);
  border:1px solid rgba(255,255,255,.18);
  border-radius: 12px;
  padding: 12px 14px;
  outline:none;
  font-size: 15px;
}
.input:focus{
  border-color: rgba(255,255,255,.36);
}
.form-actions{
  display:flex;
  gap:10px;
  justify-content:flex-end;
  flex-wrap: wrap;
}
.ghost-btn,
.primary-btn{
  border-radius: 10px;
  padding: 10px 16px;
  border:1px solid transparent;
  font-weight:600;
  cursor:pointer;
  transition: transform .15s ease, box-shadow .2s ease, border-color .2s ease, background .2s ease;
}
.ghost-btn{
  background: rgba(255,255,255,.08);
  border-color: rgba(255,255,255,.18);
  color:#e7f4f7;
}
.ghost-btn:hover,
.ghost-btn:focus-visible{
  border-color: rgba(255,255,255,.32);
}
.primary-btn{
  background: linear-gradient(
    135deg,
    rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .9),
    rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .9)
  );
  color: var(--accent-text, #031019);
  box-shadow: 0 12px 30px rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .25);
}
.primary-btn:disabled{
  opacity:.6;
  cursor:not-allowed;
  box-shadow:none;
}
.primary-btn:not(:disabled):hover,
.primary-btn:not(:disabled):focus-visible{
  transform: translateY(-1px);
  box-shadow: 0 18px 40px rgba(0,0,0,.25);
}
.error-message{
  padding:10px 12px;
  background: rgba(239,68,68,.12);
  border:1px solid rgba(239,68,68,.32);
  border-radius:8px;
  color:#ef4444;
  font-size:14px;
  margin-top:4px;
}
.success-message{
  padding:10px 12px;
  background: rgba(34,197,94,.12);
  border:1px solid rgba(34,197,94,.32);
  border-radius:8px;
  color:#22c55e;
  font-size:14px;
  margin-top:4px;
}
</style>
