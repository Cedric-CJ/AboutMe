<template>
  <section class="home-page">
    <div class="hero glass-card p-6 md:p-10">
      <div class="hero-grid">
        <div class="hero-copy">
          <h1 class="name">Cedric Arnhold</h1>
          <p class="tagline">{{ lang === 'en' ? 'Redefining IT with AI' : 'Mit KI die IT-Welt neu definieren' }}</p>
          <p class="intro">
            <template v-if="lang==='en'">
              I'm Cedric, studying Business Informatics in Berlin and building projects I enjoy — from websites and small tools to server setups. Here you’ll find a selection of my work, a gallery, blog posts and ways to get in touch.
            </template>
            <template v-else>
              Ich bin Cedric, studiere Wirtschaftsinformatik in Berlin und baue Projekte, die mir Spaß machen – von Webseiten über kleine Tools bis hin zu Server-Setups. Hier findest du eine Auswahl meiner Arbeiten, eine Galerie, Blogbeiträge und Kontaktmöglichkeiten.
            </template>
          </p>
          <div class="links">
            <RouterLink :to="links.projects" class="glass-btn px-4 py-2 rounded-md">{{ labels.projects }}</RouterLink>
            <RouterLink :to="links.about" class="glass-btn-secondary px-4 py-2 rounded-md">{{ labels.about }}</RouterLink>
            <RouterLink :to="links.gallery" class="glass-btn-secondary px-4 py-2 rounded-md">{{ labels.gallery }}</RouterLink>
            <RouterLink to="/blog" class="glass-btn-secondary px-4 py-2 rounded-md">Blog</RouterLink>
            <RouterLink :to="links.contact" class="glass-btn-secondary px-4 py-2 rounded-md">{{ labels.contact }}</RouterLink>
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
            <h3 class="text-white font-semibold">{{ lang==='en' ? 'Highlights' : 'Highlights' }}</h3>
          </div>
          <ul class="text-zinc-300 text-sm space-y-1">
            <li v-if="lang!=='en'">• Sauberes Glass-UI mit variabler Akzentfarbe</li>
            <li v-else>• Clean Glass-UI with variable accent color</li>
            <li v-if="lang!=='en'">• Reaktionsschnelle Micro-Animationen</li>
            <li v-else>• Responsive micro-animations</li>
            <li v-if="lang!=='en'">• Klares Informationsdesign für Tech-Profile</li>
            <li v-else>• Clear information design for tech profiles</li>
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
            <li>• Frontend: Vue + CSS + React</li>
            <li>• Backend: Python, Java, FastAPI + SQL</li>
            <li>• Deploy: Render + GitHub Actions</li>
            <li v-if="lang!=='en'">• Umgebung: Linux, Windows, Android, IOS</li>
            <li v-else>• Environment: Linux, Windows, Android, IOS</li>
          </ul>
        </div>
        <div class="glass-card p-4">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/></svg>
            </div>
            <h3 class="text-white font-semibold">{{ lang==='en' ? 'Focus' : 'Fokus' }}</h3>
          </div>
          <ul class="text-zinc-300 text-sm space-y-1">
            <li v-if="lang!=='en'">• Daten, Web, Infrastruktur</li>
            <li v-else>• Data, Web, Infrastructure</li>
            <li v-if="lang!=='en'">• Lernen by Doing</li>
            <li v-else>• Learning by Doing</li>
            <li v-if="lang!=='en'">• Moderne Entwicklungspraktiken</li>
            <li v-else>• Modern development practices</li>
          </ul>
        </div>
      </div>

      <div class="mt-4 grid md:grid-cols-2 gap-4">
        <div class="glass-card p-4">
          <h3 class="text-white font-medium">{{ lang==='en' ? 'Virtual Pet' : 'Virtuelles Haustier' }}</h3>
          <p class="text-zinc-300 text-sm">
            <template v-if="lang==='en'">University project with user accounts, two pets, care/play and high score.</template>
            <template v-else>Studienprojekt mit Benutzerkonten, zwei Tieren, Pflege/Spiel und Highscore.</template>
          </p>
          <div class="mt-3 flex gap-2">
            <a href="https://virtual-pet-bcky.onrender.com/" target="_blank" class="glass-btn px-3 py-1 rounded">Live</a>
            <a href="https://github.com/Cedric-CJ/virtual-pet" target="_blank" class="glass-btn-secondary px-3 py-1 rounded">GitHub</a>
          </div>
        </div>
        <div class="glass-card p-4">
          <h3 class="text-white font-medium">{{ lang==='en' ? 'Metal Master Website' : 'Metallbaumeister Webseite' }}</h3>
          <p class="text-zinc-300 text-sm">
            <template v-if="lang==='en'">Modernised with a new gallery, before/after and responsive layout.</template>
            <template v-else>Modernisierung mit neuer Galerie, Vorher/Nachher und responsivem Layout.</template>
          </p>
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
 import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
 import { RouterLink, useRoute } from 'vue-router'

 const route = useRoute()
 // reactive tick to re-evaluate when preferred_lang changes
 const __langTick = ref(0)
 const lang = computed(() => {
   // consume tick so this recomputes on language change broadcasts
   void __langTick.value
   const n = String(route.name || '')
   if (n.startsWith('de-')) return 'de'
   if (n.startsWith('en-')) return 'en'
   try {
     const pref = localStorage.getItem('preferred_lang')
     if (pref === 'de' || pref === 'en') return pref
   } catch (e) {}
   return 'de'
 })

 // listen for language change broadcasts from App.vue
 function onLangChanged(){ __langTick.value++ }
 onMounted(() => { try { window.addEventListener('preferred_lang_changed', onLangChanged) } catch (e) {} })
 onBeforeUnmount(() => { try { window.removeEventListener('preferred_lang_changed', onLangChanged) } catch (e) {} })

 const labels = computed(() => lang.value === 'en'
   ? { projects: 'Projects', about: 'About me', gallery: 'Gallery', contact: 'Contact' }
   : { projects: 'Projekte', about: 'Über mich', gallery: 'Galerie', contact: 'Kontakt' }
 )
 const links = computed(() => lang.value === 'en'
   ? { projects: '/projects', about: '/aboutme', gallery: '/gallery', contact: '/contact' }
   : { projects: '/projekte', about: '/uebermich', gallery: '/gallerie', contact: '/kontakt' }
 )
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
  .home-page{ min-height: calc(100dvh - 12rem); overflow: hidden; }
  .home-page .hero{ max-height:calc(100dvh - 9rem); display:flex; flex-direction:column; justify-content:center; padding: 1.1rem 1.1rem 1.1rem }
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
