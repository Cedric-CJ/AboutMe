<template>
  <FlashIntro v-if="showIntro" @complete="showIntro = false" />
  <section v-show="!showIntro">
    <div class="hero glass-card p-6 md:p-10">
      <div class="hero-grid">
        <div class="hero-copy">
          <h1 class="name">Cedric Arnhold</h1>
          <p class="tagline">Mit KI die IT-Welt neu definieren</p>
          <p class="intro">Ich bin Cedric, studiere Wirtschaftsinformatik in Berlin und baue Projekte, die mir Spaß machen – von Webseiten über kleine Tools bis hin zu Server-Setups. Hier findest du eine Auswahl meiner Arbeiten, eine Galerie, Blogbeiträge und Kontaktmöglichkeiten.</p>
          <div class="links">
            <RouterLink to="/projekte" class="glass-btn px-4 py-2 rounded-md">Projekte</RouterLink>
            <RouterLink to="/übermich" class="glass-btn-secondary px-4 py-2 rounded-md">Über mich</RouterLink>
            <RouterLink to="/gallerie" class="glass-btn-secondary px-4 py-2 rounded-md">Galerie</RouterLink>
            <RouterLink to="/blog/de" class="glass-btn-secondary px-4 py-2 rounded-md">Blog</RouterLink>
            <RouterLink to="/kontakt" class="glass-btn-secondary px-4 py-2 rounded-md">Kontakt</RouterLink>
          </div>
        </div>
        <div class="hero-portrait">
          <div class="portrait-ring">
            <img src="@/assets/Pictures/Me.png" alt="Cedric" class="me" />
          </div>
        </div>
      </div>

      <!-- Feature Cards -->
      <div class="mt-8 grid md:grid-cols-3 gap-4 mb-6">
        <div class="glass-card p-4">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            </div>
            <h3 class="text-white font-semibold">Highlights</h3>
          </div>
          <ul class="text-zinc-300 text-sm space-y-1">
            <li>• Sauberes Glass-UI mit variabler Akzentfarbe</li>
            <li>• Reaktionsschnelle Micro-Animationen</li>
            <li>• Klares Informationsdesign für Tech-Profile</li>
          </ul>
        </div>
        <div class="glass-card p-4">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/></svg>
            </div>
            <h3 class="text-white font-semibold">Stack</h3>
          </div>
          <ul class="text-zinc-300 text-sm space-y-1">
            <li>• Vue + Tailwind + Router v7</li>
            <li>• Backend: FastAPI + MongoDB</li>
            <li>• Deploy: Render + GitHub Actions</li>
          </ul>
        </div>
        <div class="glass-card p-4">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/></svg>
            </div>
            <h3 class="text-white font-semibold">Fokus</h3>
          </div>
          <ul class="text-zinc-300 text-sm space-y-1">
            <li>• Daten, Web, Infrastruktur</li>
            <li>• Lernen by Doing</li>
            <li>• Moderne Entwicklungspraktiken</li>
          </ul>
        </div>
      </div>

      <div class="mt-4 grid md:grid-cols-2 gap-4">
        <div class="glass-card p-4">
          <h3 class="text-white font-medium">Virtuelles Haustier</h3>
          <p class="text-zinc-300 text-sm">Studienprojekt mit Benutzerkonten, zwei Tieren, Pflege/Spiel und Highscore.</p>
          <div class="mt-3 flex gap-2">
            <a href="https://virtual-pet-bcky.onrender.com/" target="_blank" class="glass-btn px-3 py-1 rounded">Live</a>
            <a href="https://github.com/Cedric-CJ/virtual-pet" target="_blank" class="glass-btn-secondary px-3 py-1 rounded">GitHub</a>
          </div>
        </div>
        <div class="glass-card p-4">
          <h3 class="text-white font-medium">Metallbaumeister Webseite</h3>
          <p class="text-zinc-300 text-sm">Modernisierung mit neuer Galerie, Vorher/Nachher und responsivem Layout.</p>
          <div class="mt-3 flex gap-2">
            <a href="https://mz24.net/" target="_blank" class="glass-btn px-3 py-1 rounded">Live</a>
            <a href="https://github.com/Cedric-CJ/MZ24" target="_blank" class="glass-btn-secondary px-3 py-1 rounded">GitHub</a>
          </div>
        </div>
      </div>
    </div>
  </section>
  
</template>
<script setup>
import { RouterLink } from 'vue-router'
import { ref, onMounted } from 'vue'
import FlashIntro from '@/components/FlashIntro.vue'

const showIntro = ref(true)
</script>
<style scoped>
.hero{ overflow:hidden }
.hero-grid{ display:grid; grid-template-columns: 1.4fr .8fr; gap: 1.25rem; align-items: center }
@media (max-width: 900px){ .hero-grid{ grid-template-columns: 1fr; } .hero-portrait{ order:-1; justify-content:flex-start } }
.hero-copy{ display:flex; flex-direction:column }
.me{height:auto; border-radius: 9999px; border:2px solid rgba(255,255,255,.25); background: rgba(255,255,255,.06) }
.portrait-ring{ position:relative; display:inline-block; border-radius:9999px}
.hero-portrait{ display:flex; justify-content:flex-end }
.name{ color:#fff; font-weight:700; font-size: clamp(2rem,4vw,3rem); letter-spacing:.2px }
.tagline{ color:#cfeff7; margin-top:2px }
.intro{ color:#ddd; margin-top: 12px; max-width: 64ch }
.links{ margin-top: 16px; display:flex; flex-wrap:wrap; gap:10px }
</style>
