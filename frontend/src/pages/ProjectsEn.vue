<template>
  <section class="page-auto-contrast">
    <h2 class="text-white text-2xl font-semibold">My Projects</h2>
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
    name: 'Virtual Pet',
    link: 'https://virtual-pet-bcky.onrender.com/',
    github: 'https://github.com/Cedric-CJ/virtual-pet',
    technologies: ['Vue','JavaScript','HTML','CSS','Docker','Typescript','SQL-DB','React','REST'],
    short: 'University project with user accounts, two pets and care/play.',
    description: 'A university project featuring user registration/login and management of a virtual pet where the user can choose between two pets, name them, and feed, care or play with them. The pets\' needs are shown via status bars; lack of care may result in the pet\'s death so a new one must be created. A high score lists the top pets.\n\n*Currently not functional as the database is no longer active.*',
  },
  {
    name: 'Metal Master Website',
    link: 'https://mz24.net/',
    github: 'https://github.com/Cedric-CJ/MZ24',
    technologies: ['HTML','CSS','JavaScript','Vue'],
    short: 'Modernised website with new gallery and before/after slider.',
    description: 'Modernisation of my father\'s website with updated privacy/imprint pages, a more dynamic layout and an improved gallery with image switching and a before/after slider for a modern look. The site is designed to be more user-friendly and visually appealing with intuitive navigation and improved load times.'
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
.expand-enter-active, .expand-leave-active { transition: max-height .35s ease, opacity .3s ease, transform .3s ease; }
.expand-enter-from, .expand-leave-to { max-height: 0; opacity: 0; transform: translateY(-4px); }
.is-collapsible{ overflow: hidden }
@media (max-width: 900px){
  .laptop-frame{ width:100%; height:56vw; max-height: none }
  .laptop-screen{ top:8%; left:10%; width:80%; height:64% }
}
</style>
