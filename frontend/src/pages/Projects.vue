<template>
  <section class="page-auto-contrast">
    <h2 class="text-white text-2xl font-semibold">Meine Projekte</h2>
    <div class="projects-cards mt-6">
      <div v-for="(p, i) in projects" :key="i" class="project-card glass-card">
        <div class="project-head" @click="toggle(i)">
          <div class="head-left">
            <svg class="badge" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="4" fill="rgba(255,255,255,.12)"/><path d="M8 12h8M8 16h5M8 8h10" stroke="#7dd3fc" stroke-width="2" stroke-linecap="round"/></svg>
            <div>
              <h3 class="text-white text-lg font-medium">{{ p.name }}</h3>
              <p v-if="!open[i]" class="text-zinc-300 text-sm leading-snug max-w-[60ch]">{{ p.short }}</p>
            </div>
          </div>
          <button class="indicator" aria-label="toggle details">
            <svg viewBox="0 0 24 24" class="arr" :class="{rot: open[i]}"><path d="M8 5l8 7-8 7" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
          </button>
        </div>
        <transition name="expand" @enter="onEnter" @after-enter="onAfterEnter" @leave="onLeave">
          <div v-show="open[i]" class="project-body is-collapsible">
            <div class="laptop-frame">
              <img src="@/assets/Pictures/Laptop.png" alt="Laptop" class="laptop-image" />
              <div class="laptop-screen">
                <iframe :src="p.link" class="live-iframe"></iframe>
              </div>
            </div>
            <p class="text-zinc-300 mt-3 whitespace-pre-line">{{ p.description }}</p>
            <div class="flex flex-wrap gap-2 mt-3">
              <span v-for="tech in p.technologies" :key="tech" class="px-2 py-1 text-xs rounded bg-white/5 border border-white/10 text-zinc-200">{{ tech }}</span>
            </div>
            <div class="mt-3 flex gap-2">
              <a :href="p.link" target="_blank" class="glass-btn px-3 py-1 rounded">Live</a>
              <a :href="p.github" target="_blank" class="glass-btn-secondary px-3 py-1 rounded">GitHub</a>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </section>
</template>
<script setup>
import { ref } from 'vue'

const open = ref([])

const projects = ref([
  {
    name: 'Virtuelles Haustier',
    link: 'https://virtual-pet-bcky.onrender.com/',
    github: 'https://github.com/Cedric-CJ/virtual-pet',
    technologies: ['Vue','JavaScript','HTML','CSS','Docker','Typescript','SQL-DB','React','REST'],
    short: 'Studienprojekt mit Registrierung/Anmeldung, zwei Tieren und Pflege/Spiel.',
    description: 'Ein Studienprojekt mit Funktionen zur Benutzerregistrierung, Anmeldung und Verwaltung eines virtuellen Haustiers, bei dem der Benutzer zwischen zwei Tieren wählen, ihnen Namen geben und sie füttern, pflegen oder mit ihnen spielen kann. Die Bedürfnisse der Tiere werden über Statusleisten angezeigt, und bei mangelnder Pflege kann das Tier sterben, sodass ein neues erstellt werden muss. Eine Bestenliste zeigt die Top-Tiere an.\n\n*Derzeit leider nicht funktionsfähig, da die Datenbank nicht mehr aktiv ist.*',
  },
  {
    name: 'Metallbaumeister Webseite',
    link: 'https://mz24.net/',
    github: 'https://github.com/Cedric-CJ/MZ24',
    technologies: ['HTML','CSS','JavaScript','Vue'],
    short: 'Modernisierung der Webseite mit neuer Galerie und Vorher/Nachher.',
    description: 'Modernisierung der Webseite meines Vaters mit aktualisierten Datenschutz- und Impressumsseiten, einer dynamischeren Gestaltung und einer verbesserten Galerie mit Bild-Durchschaltung und Vorher-Nachher-Slider für einen modernen Look. Die Seite wurde so konzipiert, dass sie benutzerfreundlicher und optisch ansprechender ist, mit intuitiven Navigationselementen und verbesserter Ladezeit.'
  }
])
open.value = projects.value.map(() => false)
function toggle(i){ open.value[i] = !open.value[i] }

// Smooth height transitions for collapsible project details
function onEnter(el){
  el.style.height = '0px'
  el.style.opacity = '0'
  el.style.transform = 'translateY(-4px)'
  requestAnimationFrame(() => {
    el.style.transition = 'height .35s ease, opacity .3s ease, transform .3s ease'
    el.style.height = el.scrollHeight + 'px'
    el.style.opacity = '1'
    el.style.transform = 'translateY(0)'
  })
}
function onAfterEnter(el){
  el.style.height = 'auto'
  el.style.transition = ''
}
function onLeave(el){
  el.style.height = el.scrollHeight + 'px'
  el.style.opacity = '1'
  requestAnimationFrame(() => {
    el.style.transition = 'height .3s ease, opacity .25s ease'
    el.style.height = '0px'
    el.style.opacity = '0'
  })
}
</script>
<style scoped>
.projects-cards{ display:grid; grid-template-columns: 1fr; gap: 14px }
.project-card{ padding: 1rem }
.project-head{ display:flex; align-items:center; justify-content: space-between }
.head-left{ display:flex; align-items:center; gap:10px }
.badge{ width:24px; height:24px; border-radius:6px; flex:0 0 auto }
.indicator{ display:flex; align-items:center; justify-content:center; width:40px; height:40px; border-radius:10px; background: rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.12); color:#cfeff7 }
.indicator .arr{ width:18px; height:18px; transition: transform .25s ease }
.indicator .arr.rot{ transform: rotate(90deg) }
.laptop-frame{ position:relative; width:90vw; height:calc(100vw * .66); max-width: 1100px; max-height: calc(1100px * .66); margin:auto }
.laptop-image{ width:100%; height:auto; display:block; z-index:0; position: relative }
/* Place live frame behind the laptop image and slightly reduce height so it never peeks out */
.laptop-screen{ position:absolute; top:8%; left:14%; width:72%; height:66%; background: rgba(0,0,0,.4); overflow:hidden; border-radius: 6px; z-index:1 }
.live-iframe{ position:relative; width:100%; height:100%; border:none; display:block }
.chev{ display:inline-block; transition: transform .25s ease }
.chev.rot{ transform: rotate(180deg) }
.is-collapsible{ overflow: hidden }
@media (max-width: 900px){
  .laptop-frame{ width:100%; height:56vw; max-height: none }
  .laptop-screen{ top:8%; left:10%; width:80%; height:64% }
}
</style>
