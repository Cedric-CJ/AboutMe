<template>
  <section class="page-auto-contrast space-y-8 page-bottom-gap projects-page">
    <div class="glass-card p-6 md:p-8 hero-grid">
      <div class="space-y-3">
        <p class="pill-badge text-xs px-3 py-1">{{ copy.hero.pill }}</p>
        <h1 class="text-white text-3xl font-semibold leading-tight">{{ copy.hero.title }}</h1>
        <p class="text-zinc-200 max-w-2xl">{{ copy.hero.lead }}</p>
        <div class="flex flex-wrap gap-2">
          <span v-for="tag in copy.hero.tags" :key="tag" class="chip">{{ tag }}</span>
        </div>
        <div class="flex gap-3 flex-wrap pt-2">
          <RouterLink :to="links.gallery" class="glass-btn px-4 py-2 rounded-md">{{ copy.hero.ctaGallery }}</RouterLink>
          <RouterLink :to="links.contact" class="glass-btn-secondary px-4 py-2 rounded-md">{{ copy.hero.ctaContact }}</RouterLink>
        </div>
      </div>
      <div class="hero-media" v-if="feature">
        <div class="media-frame">
          <component
            :is="feature.mediaType === 'video' ? 'video' : 'img'"
            v-bind="getMediaProps(feature)"
            class="media-content"
          />
          <div class="media-gradient"></div>
          <div class="media-caption">
            <p class="text-white font-semibold">{{ feature.name }}</p>
            <p class="text-sm text-zinc-200">{{ feature.short }}</p>
            <div class="media-actions" v-if="feature.link || feature.github">
              <a v-if="feature.link" :href="feature.link" target="_blank" rel="noreferrer" class="glass-btn px-3 py-2 rounded-md">Live</a>
              <a v-if="feature.github" :href="feature.github" target="_blank" rel="noreferrer" class="glass-btn-secondary px-3 py-2 rounded-md">GitHub</a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
      <article
        v-for="project in rest"
        :key="project.name"
        class="spotlight-card p-4 flex flex-col gap-3"
        @mousemove="setSpotlight"
        @touchmove="setSpotlight"
      >
        <div class="media-frame h-44">
          <component
            v-if="project.mediaType !== 'icon'"
            :is="project.mediaType === 'video' ? 'video' : 'img'"
            v-bind="getMediaProps(project)"
            class="media-content"
          />
          <div v-else class="media-icon">
            <img :src="iconMap[project.icon]" :alt="`${project.name} icon`" />
          </div>
          <div class="media-gradient" v-if="project.mediaType !== 'icon'"></div>
          <div class="media-caption">
            <p class="text-white font-semibold">{{ project.name }}</p>
            <p class="text-sm text-zinc-200">{{ project.short }}</p>
          </div>
        </div>
        <p class="text-sm text-zinc-200 leading-relaxed whitespace-pre-line">{{ project.description }}</p>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tech in project.technologies"
            :key="tech"
            class="px-2 py-1 rounded-full text-[11px] bg-white/10 border border-white/10 text-zinc-200"
          >
            {{ tech }}
          </span>
        </div>
        <div class="flex gap-2 flex-wrap">
          <a v-if="project.link" :href="project.link" target="_blank" rel="noreferrer" class="glass-btn px-3 py-2 rounded-md">Live</a>
          <a v-if="project.github" :href="project.github" target="_blank" rel="noreferrer" class="glass-btn-secondary px-3 py-2 rounded-md">GitHub</a>
          <button
            v-if="!project.link && !project.github"
            type="button"
            class="glass-btn-secondary px-3 py-2 rounded-md border-dashed"
            @click="requestInfo(project)"
          >
            {{ copy.hero.onRequest }}
          </button>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

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

const coverPet = new URL('../assets/Pictures/Virtuelles Haustier.png', import.meta.url).href
const coverMetal = new URL('../assets/Pictures/mz24.png', import.meta.url).href
const uniThumb = (() => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360" fill="none">
  <defs>
    <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="50%" stop-color="#132a45"/>
      <stop offset="100%" stop-color="#0b1222"/>
    </linearGradient>
    <radialGradient id="g2" cx="25%" cy="25%" r="60%">
      <stop offset="0%" stop-color="#4fd1c5" stop-opacity="0.65"/>
      <stop offset="100%" stop-color="#4fd1c5" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="g3" cx="75%" cy="35%" r="55%">
      <stop offset="0%" stop-color="#f472b6" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#f472b6" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="640" height="360" fill="url(#g1)"/>
  <rect width="640" height="360" fill="url(#g2)"/>
  <rect width="640" height="360" fill="url(#g3)"/>
  <g stroke="#6ee7ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.75">
    <rect x="120" y="90" width="400" height="200" rx="18" fill="none"/>
    <path d="M180 150h280M180 190h220M180 230h160"/>
    <circle cx="200" cy="150" r="6" fill="#6ee7ff"/>
    <circle cx="240" cy="190" r="6" fill="#6ee7ff"/>
    <circle cx="280" cy="230" r="6" fill="#6ee7ff"/>
  </g>
  <text x="50%" y="60%" text-anchor="middle" fill="#e0f2fe" font-family="Segoe UI, Arial" font-size="26" font-weight="700" opacity="0.9">
    University project
  </text>
</svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
})()
const gallery1 = new URL('../assets/Pictures/Gallery/Slide/Tokyostore.jpg', import.meta.url).href
const gallery2 = new URL('../assets/Pictures/Gallery/Box/Ribe.jpg', import.meta.url).href
const gallery3 = new URL('../assets/Pictures/Gallery/Slide/Schloss_Fürstlich_Drehna.jpg', import.meta.url).href

const projectsList = computed(() => lang.value === 'en'
  ? [
      {
        name: 'Virtual Pet',
        link: 'https://virtual-pet-bcky.onrender.com/',
        github: 'https://github.com/Cedric-CJ/virtual-pet',
        technologies: ['Vue','TypeScript','SQL','Docker','REST'],
        short: 'University project',
        description: 'Accounts, two pets, caring/playing loops and a high score. UI designed for quick feedback and playful states.',
        mediaType: 'image',
        media: coverPet
      },
      {
        name: 'Metal Master Website',
        link: 'https://mz24.net/',
        github: 'https://github.com/Cedric-CJ/MZ24',
        technologies: ['HTML','CSS','JavaScript','Vue'],
        short: 'Relaunch & gallery',
        description: 'Responsive relaunch with dynamic gallery, before/after slider, and refreshed privacy/imprint pages.',
        mediaType: 'image',
        media: coverMetal
      },
      {
        name: 'Transformation Project (Student Consulting)',
        link: '',
        github: '',
        technologies: ['Consulting', 'Project Mgmt', 'Requirements', 'Change enablement'],
        short: 'University project',
        description: 'Concept for an IT service provider with market/value analysis, requirements spec, rollout roadmap and training concept.',
        mediaType: 'icon',
        icon: 'transformation'
      },
      {
        name: 'RPA Bot Automations (BitGames)',
        link: '',
        github: '',
        technologies: ['RPA', 'Process design', 'Automation', 'Canvas'],
        short: 'University project',
        description: 'Documented service processes, Business Model Canvas, and bot tasks; produced project plan and presentations for automations.',
        mediaType: 'icon',
        icon: 'rpa'
      },
      {
        name: 'Man in the Middle – Security Lab',
        link: '',
        github: '',
        technologies: ['Networking', 'Security', 'Analysis'],
        short: 'University project',
        description: 'Milestone reports and poster on a MITM scenario; traffic capture, risks and mitigation notes.',
        mediaType: 'icon',
        icon: 'mitm'
      },
      {
        name: 'SpamFilter (Kaggle dataset)',
        link: '',
        github: '',
        technologies: ['Data prep', 'Classification', 'Email security'],
        short: 'University project',
        description: 'Worked with the email_phishing_data.csv dataset (Kaggle) to explore features and prototype a spam/phish filter.',
        mediaType: 'icon',
        icon: 'spam'
      }
    ]
  : [
      {
        name: 'Virtuelles Haustier',
        link: 'https://virtual-pet-bcky.onrender.com/',
        github: 'https://github.com/Cedric-CJ/virtual-pet',
        technologies: ['Vue','TypeScript','SQL','Docker','REST'],
        short: 'Studienprojekt',
        description: 'Accounts, zwei Tiere, Pflege- und Spiel-Loops sowie Highscore. UI für schnelles Feedback und spielerische Zustände.',
        mediaType: 'image',
        media: coverPet
      },
      {
        name: 'Metallbaumeister Webseite',
        link: 'https://mz24.net/',
        github: 'https://github.com/Cedric-CJ/MZ24',
        technologies: ['HTML','CSS','JavaScript','Vue'],
        short: 'Relaunch & Galerie',
        description: 'Responsiver Relaunch mit dynamischer Galerie, Vorher/Nachher-Slider und erneuerten Datenschutz-/Impressum-Seiten.',
        mediaType: 'image',
        media: coverMetal
      },
      {
        name: 'Transformationsprojekt (Student Consulting)',
        link: '',
        github: '',
        technologies: ['Consulting', 'Projektmanagement', 'Anforderungen', 'Change'],
        short: 'Uniprojekt',
        description: 'Konzept für einen IT-Dienstleister mit Markt-/Nutzwertanalyse, Pflichtenheft, Rollout-Plan und Schulungskonzept.',
        mediaType: 'icon',
        icon: 'transformation'
      },
      {
        name: 'RPA Bot Automatisierungen (BitGames)',
        link: '',
        github: '',
        technologies: ['RPA', 'Prozessdesign', 'Automation', 'Canvas'],
        short: 'Uniprojekt',
        description: 'Service-Prozesse dokumentiert, Business Model Canvas und Bot-Aufgaben ausgearbeitet; Projektplan und Präsentationen zu den Automatisierungen erstellt.',
        mediaType: 'icon',
        icon: 'rpa'
      },
      {
        name: 'Man in the middle – Sicherheitslabor',
        link: '',
        github: '',
        technologies: ['Netzwerk', 'Security', 'Analyse'],
        short: 'Uniprojekt',
        description: 'Meilensteine und Poster zu einem MITM-Szenario; Traffic-Analyse, Risiken und Gegenmaßnahmen skizziert.',
        mediaType: 'icon',
        icon: 'mitm'
      },
      {
        name: 'SpamFilter (Kaggle-Datensatz)',
        link: '',
        github: '',
        technologies: ['Datenaufbereitung', 'Klassifikation', 'E-Mail-Security'],
        short: 'Uniprojekt',
        description: 'Mit dem Datensatz email_phishing_data.csv (Kaggle) Features erkundet und einen Spam-/Phishing-Filter prototypisch aufgebaut.',
        mediaType: 'icon',
        icon: 'spam'
      }
    ]
)

const feature = computed(() => projectsList.value[0])
const rest = computed(() => projectsList.value.slice(1))

const galleryPreview = computed(() => [
  { src: gallery1, alt: 'All visuals', label: lang.value === 'en' ? 'All visuals' : 'Alle Visuals' },
  { src: gallery2, alt: 'City scene', label: lang.value === 'en' ? 'City scene' : 'City scene' },
  { src: gallery3, alt: 'Hover cards', label: lang.value === 'en' ? 'Hover cards' : 'Hover-Karten' },
])

const links = computed(() => lang.value === 'en'
  ? { gallery: '/gallery', contact: '/contact' }
  : { gallery: '/gallerie', contact: '/kontakt' }
)

const copy = computed(() => lang.value === 'en'
  ? {
      hero: {
        pill: 'Projects',
        title: 'Projects & uni case studies',
        lead: 'Client work plus university builds: concise summaries, stacks, and how to reach me.',
        tags: ['Responsive media', 'Repos or on request', 'Self-hosted assets'],
        ctaGallery: 'Open gallery',
        ctaContact: 'Start a project',
        onRequest: 'Info on request',
      },
      gallery: {
        title: 'Gallery highlights',
        lead: 'Animation of modernising my site (legacy portfolio to today). Selected frames — adaptive and hover-ready.',
        cta: 'All visuals'
      }
    }
  : {
      hero: {
        pill: 'Projekte',
        title: 'Projekte & Uni-Cases',
        lead: 'Kundenarbeit plus Hochschulprojekte: kurze Zusammenfassungen, Tech-Stack und direkter Draht zu mir.',
        tags: ['Responsive Medien', 'Repos oder auf Anfrage', 'Selbst gehostete Assets'],
        ctaGallery: 'Galerie öffnen',
        ctaContact: 'Projekt starten',
        onRequest: 'Infos auf Anfrage',
      },
      gallery: {
        title: 'Galerie-Highlights',
        lead: 'Animation der Modernisierung meiner Seite (von legacy Portfolio bis heute). Ausgewählte Ausschnitte — adaptiv und hoverbar.',
        cta: 'Alle Visuals'
      }
    }
)

function getMediaProps(item){
  if (item.mediaType === 'video') {
    return { controls: true, src: item.media }
  }
  return { src: item.media, alt: item.name }
}

import spamIcon from '@/assets/icons/spam.png'
import rpaIcon from '@/assets/icons/rpa.png'
import mitmIcon from '@/assets/icons/mitm.png'
import transformationIcon from '@/assets/icons/transformation.png'
const iconMap = {
  spam: spamIcon,
  rpa: rpaIcon,
  mitm: mitmIcon,
  transformation: transformationIcon
}

function setSpotlight(e){
  const el = e.currentTarget
  if (!el) return
  const rect = el.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  el.style.setProperty('--x', `${x}px`)
  el.style.setProperty('--y', `${y}px`)
}

function requestInfo(project){
  const subj = lang.value === 'en'
    ? `Request: ${project.name}`
    : `Anfrage: ${project.name}`
  const body = lang.value === 'en'
    ? `Hi Cedric,\n\nI'm interested in your university project "${project.name}". Please send me more details and, if possible, additional material. Thanks!`
    : `Hi Cedric,\n\nich interessiere mich für dein Uniprojekt „${project.name}“. Schick mir bitte weitere Infos und gerne zusätzliches Material. Danke!`
  const source = `project:${project.name}`
  try {
    window.dispatchEvent(new CustomEvent('open_contact_overlay', { detail: { subject: subj, message: body, source } }))
  } catch (e) {
    window.dispatchEvent(new Event('open_contact_overlay'))
  }
}
</script>

<style scoped>
.hero-grid{
  display:grid;
  grid-template-columns: repeat(auto-fit, minmax(260px,1fr));
  gap: 20px;
}
.projects-page .glass-card,
.projects-page .spotlight-card{
  background: linear-gradient(150deg, rgba(10,16,26,.9), rgba(14,30,44,.85));
  border:1px solid rgba(255,255,255,.1);
  box-shadow: 0 18px 55px rgba(0,0,0,.32);
}
.hero-media{
  display:flex;
  justify-content:flex-end;
}
.media-frame{
  position:relative;
  width:100%;
  max-width: 420px;
  border-radius: 18px;
  overflow:hidden;
  background: linear-gradient(150deg, rgba(10,16,26,.88), rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .18));
  border:1px solid rgba(255,255,255,.12);
  box-shadow: 0 16px 50px rgba(0,0,0,.28);
}
.media-content{
  width:100%;
  height:100%;
  object-fit: cover;
  display:block;
}
.media-gradient{
  position:absolute;
  inset:0;
  background: linear-gradient(180deg, transparent, rgba(0,0,0,.6));
  pointer-events:none;
}
.media-actions{
  display:flex;
  gap:8px;
  flex-wrap:wrap;
}
.media-icon{
  position:absolute;
  inset:0;
  display:flex;
  align-items:center;
  justify-content:center;
  color: var(--accent-raw, var(--accent-default, #f0c33c));
  background: rgba(0,0,0,.12);
}
.media-icon img{
  width: clamp(38px, 12vw, 64px);
  height: clamp(38px, 12vw, 64px);
  object-fit: contain;
  filter: drop-shadow(0 0 10px rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .7));
}
.media-caption{
  position:absolute;
  bottom:10px;
  left:12px;
  right:12px;
  display:flex;
  flex-direction:column;
  gap:6px;
}
.chip{
  display:inline-flex;
  align-items:center;
  gap:6px;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(255,255,255,.08);
  border:1px solid rgba(255,255,255,.14);
  color:#e6f6f7;
  font-size: 12px;
}
.media-thumb{
  aspect-ratio: 4 / 3;
}
</style>
