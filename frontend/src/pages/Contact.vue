<template>
  <section class="page-auto-contrast min-h-[100vh] flex flex-col items-center justify-center">
    <h2 class="text-white text-3xl font-semibold mb-8">{{ lang==='en' ? 'Contact' : 'Kontakt' }}</h2>
    <div class="cards" @mousemove="handleMouseMove">
      <button class="card" @click="openEmail">
        <div class="card-content">
          <img :src="isDark ? emailDark : emailLight" :alt="lang==='en' ? 'Email' : 'E-Mail'" class="icon" />
          <span>{{ lang==='en' ? 'Email' : 'E-Mail' }}</span>
        </div>
      </button>
      <a href="https://github.com/Cedric-CJ" target="_blank" rel="noreferrer" class="card">
        <div class="card-content">
          <img :src="isDark ? githubDark : githubLight" alt="GitHub" class="icon" />
          <span>GitHub</span>
        </div>
      </a>
      <a href="https://www.linkedin.com/in/cedric-arnhold-853a122a0" target="_blank" rel="noreferrer" class="card">
        <div class="card-content">
          <img :src="isDark ? linkedinDark : linkedinLight" alt="LinkedIn" class="icon" />
          <span>LinkedIn</span>
        </div>
      </a>
      <a href="https://discord.com/users/456140165094572054" target="_blank" rel="noreferrer" class="card">
        <div class="card-content">
          <img :src="isDark ? discordDark : discordLight" alt="Discord" class="icon" />
          <span>Discord</span>
        </div>
      </a>
    </div>
    <div class="glass-card mt-6 w-full max-w-2xl p-5">
      <h3 class="text-white text-xl font-semibold mb-4">{{ lang==='en' ? 'Send an inquiry' : 'Anfrage stellen' }}</h3>
      <form @submit.prevent="submitInquiry" class="grid grid-cols-1 gap-3">
        <div class="grid md:grid-cols-2 gap-3">
          <input v-model="form.name" type="text" :placeholder="lang==='en' ? 'Your name' : 'Dein Name'" class="input" required />
          <input v-model="form.email" type="email" :placeholder="lang==='en' ? 'Email' : 'E-Mail'" class="input" required />
        </div>
        <input v-model="form.subject" type="text" :placeholder="lang==='en' ? 'Subject' : 'Betreff'" class="input" required />
        <textarea v-model="form.message" :placeholder="lang==='en' ? 'Message' : 'Nachricht'" class="input min-h-32" required></textarea>
        <div class="flex gap-2 justify-end">
          <button type="reset" class="glass-btn-secondary px-4 py-2 rounded" @click="resetForm">{{ lang==='en' ? 'Reset' : 'Zurücksetzen' }}</button>
          <button type="submit" class="glass-btn px-4 py-2 rounded">{{ lang==='en' ? 'Send' : 'Senden' }}</button>
        </div>
      </form>
    </div>
  </section>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import emailDark from '@/assets/icons/email-dark.png'
import emailLight from '@/assets/icons/email-light.png'
import githubDark from '@/assets/icons/github-dark.svg'
import githubLight from '@/assets/icons/github-light.svg'
import linkedinDark from '@/assets/icons/linkedin-dark.svg'
import linkedinLight from '@/assets/icons/linkedin-light.svg'
import discordDark from '@/assets/icons/discord-dark.svg'
import discordLight from '@/assets/icons/discord-light.svg'

const isDark = ref(false)
const form = ref({ name:'', email:'', subject:'', message:'' })

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

function openEmail(){
  const addr = lang.value === 'en' ? 'info@specialcode.de' : 'info@spezialcode.de'
  window.location.href = `mailto:${addr}`
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
onMounted(() => {
  const m = window.matchMedia('(prefers-color-scheme: dark)')
  isDark.value = m.matches
  m.addEventListener('change', e => isDark.value = e.matches)
})
function submitInquiry(){
  console.log('Inquiry:', form.value)
  // TODO: integrate with backend endpoint e.g. POST /api/inquiry
}
function resetForm(){ form.value = { name:'', email:'', subject:'', message:'' } }
</script>
<style scoped>
.cards{ display:grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap:16px }
@media(min-width:640px){ .cards{ grid-template-columns: repeat(4,minmax(0,1fr)) } }
.card{ position:relative; overflow:hidden; border-radius: 16px; background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.12); cursor:pointer; }
.card::before{ content:""; position:absolute; top:var(--yPos); left:var(--xPos); transform: translate(-50%,-50%); width:240px; height:240px; background: radial-gradient(circle, rgba(255,255,255,.18), transparent 60%); opacity:.6; transition: opacity .2s; pointer-events:none }
.card:hover::before{ opacity:1 }
.card-content{ position:relative; z-index:1; display:flex; align-items:center; justify-content:center; gap:12px; padding:24px; color:#fff }
.icon{ width: clamp(22px, 4vw, 36px); height: auto; object-fit: contain }
.card-content{ padding: clamp(16px, 3.5vw, 28px) }
.input{ width:100%; color:#fff; background: rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.12); border-radius: 10px; padding: 10px 12px; outline:none }
.input:focus{ border-color: rgba(255,255,255,.28) }
</style>
