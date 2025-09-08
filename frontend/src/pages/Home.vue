<template>
  <section>
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

      <div class="mt-8 grid md:grid-cols-2 gap-4">
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
