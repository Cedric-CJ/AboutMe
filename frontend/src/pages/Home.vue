<template>
  <section class="home-page">
    <div class="hero glass-card p-6 md:p-10">
      <div class="hero-grid">
        <div class="hero-copy">
          <h1 class="name">Cedric Arnhold</h1>
          <p class="tagline">Mit KI die IT-Welt neu definieren</p>
          <p class="intro">Ich bin Cedric, studiere Wirtschaftsinformatik in Berlin und baue Projekte, die mir Spaß machen – von Webseiten über kleine Tools bis hin zu Server-Setups. Hier findest du eine Auswahl meiner Arbeiten, eine Galerie, Blogbeiträge und Kontaktmöglichkeiten.</p>
          <div class="links">
            <RouterLink to="/projekte" class="glass-btn px-4 py-2 rounded-md">Projekte</RouterLink>
            <RouterLink to="/uebermich" class="glass-btn-secondary px-4 py-2 rounded-md">Über mich</RouterLink>
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
</script>
<style scoped>
/* Base styles */
.home-page{ min-height:90vh; display:flex; align-items:center; margin-top:2.5rem; margin-bottom: -.5rem; }
.hero{ overflow:visible }
.hero-grid{ display:grid; grid-template-columns: 1.4fr .8fr; gap: 1.25rem; align-items: start }
.hero-copy{ display:flex; flex-direction:column }
.me{ height:auto; width: clamp(160px, 22vw, 240px); max-height: 42vh; object-fit: cover; border-radius: 9999px; border:2px solid rgba(255,255,255,.25); background: rgba(255,255,255,.06) }
.portrait-ring{ position:relative; display:inline-block; border-radius:9999px}
.hero-portrait{ display:flex; justify-content:flex-end }
.name{ color:#fff; font-weight:700; font-size: clamp(1.8rem,3.2vw,2.6rem); letter-spacing:.2px; line-height:1.1 }
.tagline{ color:#cfeff7; margin-top:2px }
.intro{ color:#ddd; margin-top: 12px; max-width: 64ch; font-size: clamp(.9rem, 1.3vw, 1rem) }
.links{ margin-top: 16px; display:flex; flex-wrap:wrap; gap:10px }

/* Mobile responsive */
@media (max-width: 900px){ 
  .hero-grid{ grid-template-columns: 1fr; } 
  .hero-portrait{ order:-1; justify-content:flex-start } 
}

/* Desktop - heights above 700px: ensure footer visibility */
@media (min-width: 1024px) and (min-height: 701px){
  .home-page{ min-height: calc(100vh - 8rem); }
  .home-page .hero{ max-height:calc(100vh - 8rem); display:flex; flex-direction:column; justify-content:center; padding:1.75rem 1.25rem 1.25rem }
  .home-page .mt-8{ margin-top: .5rem }
  .home-page .grid.md\:grid-cols-3{ gap:.75rem }
}

/* Desktop - heights under 700px: compact layout */
@media (min-width: 1024px) and (max-height: 700px){
  .home-page{ min-height: calc(100vh - 6rem); margin-top: 1rem; }
  .name{ font-size: clamp(1.2rem, 1.8vw, 1.6rem); line-height: 1.05; }
  .tagline{ margin-top: 1px; font-size: 0.9rem; }
  .intro{ font-size: clamp(.75rem, .9vw, .82rem); margin-top: 8px; line-height: 1.3; }
  .links{ margin-top: 6px; gap:6px; }
  .links .glass-btn, .links .glass-btn-secondary{ padding: 6px 12px; font-size: 0.85rem; }
  .hero-grid{ gap: .8rem; align-items: center; }
  .me{ max-height: 18vh; width: clamp(100px, 14vw, 160px); }
  .home-page .hero{ max-height: calc(100vh - 6rem); padding: 0.75rem 1rem 0.5rem; overflow: hidden; }
  .home-page .mt-8{ margin-top: .15rem; }
  .home-page .mt-4{ margin-top: .15rem; }
  .home-page .grid.md\:grid-cols-3{ gap:.5rem; }
  .home-page .grid.md\:grid-cols-2{ gap:.5rem; }
  .home-page .glass-card{ padding: 0.75rem !important; }
  .home-page .glass-card h3{ font-size: 0.9rem; }
  .home-page .glass-card p{ font-size: 0.8rem; line-height: 1.3; }
  .home-page .glass-card ul li{ font-size: 0.75rem; }
  .home-page .glass-card .w-8{ width: 1.75rem; height: 1.75rem; }
  .home-page .glass-card .w-8 svg{ width: 0.875rem; height: 0.875rem; }
  .home-page .mb-6{ margin-bottom: 0.5rem; }
}
</style>
