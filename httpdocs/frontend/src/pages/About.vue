<template>
  <section class="page-bottom-gap">
    <h2 class="text-white text-2xl font-semibold">
      {{ lang === 'en' ? "Hi, I'm" : 'Hi, ich bin' }} <span ref="twRef" class="typewriter-text"></span>
    </h2>
    <div class="mt-6 grid md:grid-cols-3 gap-6">
      <div class="glass-card md:col-span-2 p-6 text-center">
        <div class="text-zinc-300 space-y-4 max-w-none">
          <template v-if="lang === 'de'">
            <p class="text-justify">
              Ich heiße Cedric Arnhold, bin {{ age }} Jahre alt und studiere Wirtschaftsinformatik an der HTW Berlin. Neben dem Studium setze ich gern Ideen in funktionierende Projekte um – so wie diese Webseite. Während meines Pflichtpraktikums im BMDV konnte ich erste Erfahrungen in der Systemadministration sammeln und unterstütze seit 2025 auch <a href="https://netz23.de" target="_blank" rel="noopener" class="accent-link">netz23</a> bei Web- und Infrastrukturthemen.
            </p>
            <p class="text-justify">
              Aktuell arbeite ich daran, einen eigenen Online-Shop aufzubauen und tauche dabei tiefer in WordPress ein. Parallel bereite ich mich auf Zertifizierungen im Bereich Server-Infrastruktur und Backup-Umgebungen vor. Außerdem betreue ich die Webseiten meines <a href="https://mz24.net/" target="_blank" rel="noopener" class="accent-link">Vaters</a> und meiner <a href="https://buntpapieratelier.de/" target="_blank" rel="noopener" class="accent-link">Freundin</a>. Im <RouterLink to="/blog" class="accent-link">Blog</RouterLink> halte ich Learnings und Projekte fest.
            </p>
          </template>
          <template v-else>
            <p class="text-justify">
              My name is Cedric Arnhold, I'm {{ age }} years old, and I'm studying Business Informatics at HTW Berlin. I enjoy turning ideas into working products—like this site. During my internship at the Federal Ministry for Digital and Transport (BMDV) I gained first experience in system administration and since 2025 I also support <a href="https://netz23.de" target="_blank" rel="noopener" class="accent-link">netz23</a> with web and infrastructure topics.
            </p>
            <p class="text-justify">
              I'm currently building an online store and digging deeper into WordPress, while preparing certifications in server infrastructure and backup setups. I also manage my <a href="https://mz24.net/" target="_blank" rel="noopener" class="accent-link">father's</a> and my <a href="https://buntpapieratelier.de/" target="_blank" rel="noopener" class="accent-link">girlfriend's</a> websites. I share more updates and learnings on the <RouterLink to="/blog" class="accent-link">Blog</RouterLink> page.
            </p>
          </template>
        </div>
      </div>
      <div class="glass-card p-6 flex items-center justify-center">
        <img src="@/assets/Pictures/Me.png" alt="Cedric" class="about-me" />
      </div>
    </div>

    <!-- Skills Cloud -->
    <div class="skills-cloud glass-card mt-8 p-4 relative overflow-hidden">
      <h3 class="text-white font-medium mb-3">{{ lang === 'en' ? 'My Skills' : 'Meine Fähigkeiten' }}</h3>
      <div class="relative w-full h-[40vh]">
        <span v-for="(skill, i) in skills" :key="i" class="skill" :style="generateStyle()">{{ skill }}</span>
      </div>
    </div>

    <!-- Timeline -->
    <div class="timeline mt-12">
      <h3 class="text-white font-medium mb-4">{{ lang === 'en' ? 'Resume' : 'Mein Lebenslauf' }}</h3>
      <ul>
        <li v-for="ev in events" :key="ev.year">
          <div>
            <time class="text-white font-medium">{{ ev.year }}: {{ ev.title }}</time>
            <p class="text-zinc-300">{{ ev.description }}</p>
            <div v-if="ev.tags?.length" class="mt-2 flex flex-wrap gap-2">
              <span v-for="(t,i) in ev.tags" :key="i" class="px-2 py-0.5 rounded-md text-xs bg-white/10 border border-white/15 text-zinc-200">
                {{ t }}
              </span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>
<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

// Compute age based on birthday 2003-04-02
const birthDate = new Date('2003-04-02T00:00:00')
const age = computed(() => {
  const now = new Date()
  let a = now.getFullYear() - birthDate.getFullYear()
  const m = now.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate())) a--
  return a
})

const skills = ref(['JavaScript','Vue','Python','HTML','Web Development','CSS','SQL','React','Java','Spring Boot','Docker','PostgreSQL','Oracle','Flutter','Render','Dart','Typescript'])

// Determine language: prefer route name prefix, else localStorage('preferred_lang'), fallback 'en'
const route = useRoute()
const lang = computed(() => {
  const n = String(route.name || '')
  if (n.startsWith('de-')) return 'de'
  if (n.startsWith('en-')) return 'en'
  try {
    const pref = localStorage.getItem('preferred_lang')
    if (pref === 'de' || pref === 'en') return pref
  } catch (e) {}
  return 'en'
})

function generateStyle(){
  const safeX = Math.random()*70
  const safeY = Math.random()*28 + 4
  const z = Math.random()*50 - 25
  const size = Math.random()*2 + 2
  const color = Math.random() > 0.5 ? 'var(--accent-raw)' : '#e5e7eb'
  const dur = Math.random()*12 + 5
  const delay = Math.random()*5
  const name = `float-${Math.random().toString(36).slice(2,7)}`
  const kf = `@keyframes ${name}{
    0%{ transform: translate3d(${safeX}vw, ${safeY}vh, ${z}px) scale(${size}); opacity:0 }
    10%{ opacity:1 }
    25%{ transform: translate3d(${safeX + (Math.random()*5-2.5)}vw, ${safeY + (Math.random()*5-2.5)}vh, ${z + (Math.random()*10-5)}px) }
    50%{ transform: translate3d(${safeX - (Math.random()*5-2.5)}vw, ${safeY - (Math.random()*5-2.5)}vh, ${z - (Math.random()*10-5)}px) }
    75%{ transform: translate3d(${safeX + (Math.random()*2.5-1.25)}vw, ${safeY + (Math.random()*2.5-1.25)}vh, ${z + (Math.random()*5-2.5)}px) }
    100%{ transform: translate3d(${safeX}vw, ${safeY}vh, ${z}px); opacity:0 }
  }`
  const styleEl = document.createElement('style')
  styleEl.textContent = kf
  document.head.appendChild(styleEl)
  return { animation: `${name} ${dur}s infinite ease-in-out ${delay}s`, color, opacity:0, zIndex: Math.round(z) }
}

const eventsDe = [
  {
    year: 2026,
    title: 'Bachelor of Science - Wirtschaftsinformatik',
    description: 'Voraussichtlicher Abschluss an der HTW Berlin. Schwerpunkt auf Datenanalyse und Systemarchitektur.',
    tags: ['Datenanalyse', 'Systemarchitektur', 'Software Engineering', 'Projektarbeit']
  },
  {
    year: 2025,
    title: 'Werkstudent netz23',
    description: 'SolarWinds ARM: Rollen- und Rechtepflege. Nessus-Scans inkl. Auswertung/Reports. Tickets & Doku in Redmine; Abstimmung und Auswertungen über Thunderbird/Office.',
    tags: ['SolarWinds ARM', 'Nessus', 'Redmine', 'Thunderbird', 'Office']
  },
  {
    year: 2024,
    title: 'Praktikum BMDV Abteilung Z33',
    description: '3,5-monatiges Fachpraktikum im IT-Bereich. Schwerpunkt: Server-Betrieb und Infrastruktur-Management.',
    tags: ['Windows Server', 'Active Directory', 'Netzwerk & Monitoring', 'Scripting', 'Dokumentation', 'Ticketsystem']
  },
  {
    year: 2022,
    title: 'Werksstudent bei Kaufland',
    description: 'Zwei Jahre als Werksstudent tätig. Erfahrungen in Prozessoptimierung und Kundenbetreuung.',
    tags: ['Prozessoptimierung', 'Kundenservice', 'Teamarbeit', 'Zuverlässigkeit']
  },
  {
    year: 2022,
    title: 'Abitur Ernst-Haeckel-Schule',
    description: 'Abschluss mit 2,8 im Mathe-Geschichte Profil. Grundlagen für technisches Studium gelegt.',
    tags: ['Mathematik', 'Analytisches Denken', 'Präsentation', 'Zeitmanagement']
  },
  {
    year: 2018,
    title: 'Praktikum Finanzamt Marzahn-Hellersdorf',
    description: 'Einblicke in Bürotätigkeiten und Verhandlungsführung. Erste Berufserfahrungen gesammelt.',
    tags: ['Aktenbearbeitung', 'Büroorganisation', 'Kommunikation', 'Sorgfalt']
  },
  {
    year: 2016,
    title: 'Praktikum Dr. Albrecht & Plogmaker',
    description: 'Fünf freiwillige Praktika in Steuerberatung. Tiefe Einblicke in Beratungsprozesse erhalten.',
    tags: ['Buchhaltung', 'Belegprüfung', 'DATEV-Einblicke', 'Mandantenkommunikation']
  }
]
const eventsEn = [
  {
    year: 2026,
    title: 'Bachelor of Science – Business Informatics (HTW Berlin)',
    description: 'Expected Bachelor graduation at the University of Applied Sciences (HTW) Berlin.',
    tags: ['Data Analysis', 'Systems Architecture', 'Software Engineering', 'Project Work']
  },
  {
    year: 2025,
    title: 'Working student netz23',
    description: 'SolarWinds ARM access upkeep; Nessus scans plus analysis and reporting. Tickets and docs in Redmine; coordination and summaries via Thunderbird/Office.',
    tags: ['SolarWinds ARM', 'Nessus', 'Redmine', 'Thunderbird', 'Office']
  },
  {
    year: 2024,
    title: 'Mandatory Internship – BMDV (Dept. Z33)',
    description: 'Dec 2024 – Mar 2025 | Practical work in operating servers & IT infrastructure; first experience in system administration.',
    tags: ['Windows Server', 'Active Directory', 'Networking & Monitoring', 'Scripting', 'Documentation', 'Ticketing']
  },
  {
    year: 2022,
    title: 'Working Student at Kaufland',
    description: 'June 2022 – August 2024.',
    tags: ['Process Optimisation', 'Customer Service', 'Teamwork', 'Reliability']
  },
  {
    year: 2022,
    title: 'A‑levels (Abitur)',
    description: 'Ernst‑Haeckel‑School Berlin | Final grade 2.8 (Math/History).',
    tags: ['Mathematics', 'Analytical Thinking', 'Presentation', 'Time Management']
  },
  {
    year: 2018,
    title: 'Internship – Tax Office Marzahn‑Hellersdorf',
    description: 'Experience in office routines and negotiations.',
    tags: ['Record Handling', 'Office Organisation', 'Communication', 'Accuracy']
  },
  {
    year: 2016,
    title: 'Internships – Dr. Albrecht & Plogmaker GbR',
    description: 'Five voluntary internships providing insights into tax consulting.',
    tags: ['Bookkeeping', 'Voucher Auditing', 'DATEV Basics', 'Client Communication']
  }
]
const events = computed(() => lang.value === 'en' ? eventsEn : eventsDe)

onMounted(() => {
  // Typewriter effect (per language)
  const words = lang.value === 'en'
    ? ['DEVELOPER', 'DESIGNER', 'TECH-FREAK']
    : ['ENTWICKLER', 'DESIGNER', 'TECH-FREAK']
  const speed = 100
  const pauseAfterWord = 1000
  const eraseSpeed = 50
  const pauseBeforeType = 500
  let textIndex = 0
  let charIndex = 0
  let timerId = null

  function typeWriter(){
    const el = twRef.value
    if (!el) return
    if (charIndex < words[textIndex].length){
      el.textContent += words[textIndex].charAt(charIndex)
      charIndex++
      timerId = setTimeout(typeWriter, speed)
    } else {
      timerId = setTimeout(eraseText, pauseAfterWord)
    }
  }
  function eraseText(){
    const el = twRef.value
    if (!el) return
    if (el.textContent.length > 0){
      el.textContent = el.textContent.slice(0,-1)
      timerId = setTimeout(eraseText, eraseSpeed)
    } else {
      textIndex = (textIndex + 1) % words.length
      charIndex = 0
      timerId = setTimeout(typeWriter, pauseBeforeType)
    }
  }
  // Helper: erase any existing content (e.g., 'Cedric') using the same erase animation,
  // then begin the regular typewriter cycle without advancing the word index prematurely.
  function eraseExistingThenType(){
    const el = twRef.value
    if (!el) return
    if (el.textContent.length > 0){
      el.textContent = el.textContent.slice(0,-1)
      timerId = setTimeout(eraseExistingThenType, eraseSpeed)
    } else {
      charIndex = 0
      timerId = setTimeout(typeWriter, pauseBeforeType)
    }
  }
  // Show 'Cedric' for 3 seconds, then erase smoothly and start typing rotating words
  if (twRef.value) twRef.value.textContent = 'Cedric'
  timerId = setTimeout(eraseExistingThenType, 3000)

  // Timeline old behavior: reveal once, offset left/right
  const targets = document.querySelectorAll('.timeline ul li')
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting){
        e.target.classList.add('in-view')
        obs.unobserve(e.target)
      }
    })
  }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' })
  targets.forEach(t => io.observe(t))
  onUnmounted(() => { io.disconnect(); if (timerId) clearTimeout(timerId) })
})

// ref for typewriter span
const twRef = ref(null)
</script>
<style scoped>
.skills-cloud .skill{ position:absolute; font-weight:700; white-space:nowrap; will-change: transform }
.about-me{ height:auto; border-radius: 9999px; border:1px solid rgba(255,255,255,.2) }

/* Requested .text-2xl adjustments + mobile centering */
h2.text-2xl { font-size: 1.5rem; line-height: 2rem; padding-top: 2rem; }
@media (max-width: 640px){ h2.text-2xl { text-align: center; } }

/* Accent-highlighted inline links (readable and on-brand) */
.accent-link{ color: var(--accent-raw); }

/* OLD TIMELINE BEHAVIOR, adapted */
.timeline ul { margin:0; padding:0 }
.timeline ul li { list-style-type:none; position:relative; width:6px; margin:0 auto; padding-top:50px; background: rgba(255,255,255,.18); z-index:0 }
.timeline ul li::after { content:""; position:absolute; left:50%; bottom:0; transform: translateX(-50%); width:30px; height:30px; border-radius:50%; background: rgba(255,255,255,.28); z-index:1; transition: background 2s ease-in-out; box-shadow: 0 0 0 1px rgba(255,255,255,.15) }
.timeline ul li > div{ position:relative; width:400px; min-height:100px; padding:15px; background: rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.12); border-radius:10px; box-sizing:border-box; margin:0 auto; left:0; display:flex; flex-direction:column; justify-content:center; align-items:center; visibility:hidden; opacity:0; transition: all 1s ease-in-out }
.timeline ul li > div::before{ content:""; position:absolute; bottom:7px; width:0; height:0; border-style:solid }
.timeline ul li:nth-child(odd) > div{ left:60px; transform: translate3d(200px,0,0) }
.timeline ul li:nth-child(odd) > div::before{ left:-15px; border-width:8px 16px 8px 0; border-color: transparent rgba(255,255,255,.08) transparent transparent }
.timeline ul li:nth-child(even) > div{ left:-465px; transform: translate3d(-200px,0,0) }
.timeline ul li:nth-child(even) > div::before{ right:-15px; border-width:8px 0 8px 16px; border-color: transparent transparent transparent rgba(255,255,255,.08) }
.timeline ul li.in-view > div{ transform:none; visibility:visible; opacity:1 }

@media (max-width: 900px){
  .timeline ul li > div{ width:250px }
  .timeline ul li:nth-child(even) > div{ left:-320px }
}
@media (max-width: 600px){
  /* Mobile: left line via ::before, full-width li, single column cards */
  .timeline{ margin-left:0; padding-left:0; z-index:0; overflow-x: hidden }
  .timeline ul{ position: relative }
  .timeline ul li{ position: relative; width: 100%; margin: 0; padding-left: 40px; background: transparent; right:auto; left:auto }
  .timeline ul li::before{ content:""; position:absolute; left:12px; top:0; bottom:0; width:4px; background: rgba(255,255,255,.18); border-radius:2px; z-index:0 }
  .timeline ul li::after{ left:12px; transform: translateX(-50%); width:16px; height:16px; background: rgba(255,255,255,.30); z-index:2; box-shadow: 0 0 0 1px rgba(255,255,255,.22) }
  .timeline ul li > div{
    position: relative;
    margin-left: 0;
    left: 0;
    width: calc(100% - 40px); /* full width minus left padding for line */
    max-width: 100%;
    padding:10px;
    transform: translate3d(40px, 0, 0); /* subtle slide-in from right on mobile */
    visibility:visible;
    opacity:1;
    box-sizing: border-box;
    white-space: normal;
    word-break: break-word;
  }
  /* Arrow pointer like original (pointing to the left line, slight gap to dot) */
  .timeline ul li > div::before{
    content: "";
    position: absolute;
    bottom: 0px; /* align with dot position */
    left: -15px; /* arrow tip directly at card edge */
    width: 0; height: 0;
    border-style: solid;
    border-width: 8px 15px 8px 0; /* width tuned so tip stops before the dot */
    border-color: transparent rgba(255,255,255,.08) transparent transparent;
  }
  .timeline ul li:nth-child(odd) > div{ left:0 }
  .timeline ul li:nth-child(even) > div{ left:0 }
  /* Force both odd/even to use left-pointing arrow on mobile */
  .timeline ul li:nth-child(even) > div::before{
    bottom: 0px;
    left: -15px;
    right: auto;
    border-width: 8px 15px 8px 0;
    border-color: transparent rgba(255,255,255,.08) transparent transparent;
  }
}
</style>
