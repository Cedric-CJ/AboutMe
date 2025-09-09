<template>
  <section>
    <h2 class="text-white text-2xl font-semibold">Hi, ich bin Cedric</h2>
    <div class="mt-6 grid md:grid-cols-3 gap-6">
      <div class="glass-card md:col-span-2 p-6 text-center">
        <div class="text-zinc-300 space-y-4 max-w-none">
          <p class="text-justify">
            Ich bin Cedric Arnhold (22) und studiere Wirtschaftsinformatik an der HTW Berlin. Neben dem Studium setze ich gerne Ideen in funktionierende Projekte um – wie diese Webseite. Während meines Pflichtpraktikums im BMDV habe ich fundierte Erfahrungen in Systemadministration gesammelt.
          </p>
          <p class="text-justify">
            Parallel betreue ich die Webseite meines Vaters und modernisiere mein Hochschulprojekt „VirtualPet". Als Nächstes plane ich einen privaten Mail‑, Web‑ und Cloud‑Server. Hier teile ich künftig mehr zu Projekten und Learnings.
          </p>
        </div>
      </div>
      <div class="glass-card p-6 flex items-center justify-center">
        <img src="@/assets/Pictures/Me.png" alt="Cedric" class="about-me" />
      </div>
    </div>

    <!-- Skills Cloud -->
    <div class="skills-cloud glass-card mt-8 p-4 relative overflow-hidden">
      <h3 class="text-white font-medium mb-3">Meine Fähigkeiten</h3>
      <div class="relative w-full h-[40vh]">
        <span v-for="(skill, i) in skills" :key="i" class="skill" :style="generateStyle()">{{ skill }}</span>
      </div>
    </div>

    <!-- Timeline -->
    <div class="timeline mt-12">
      <h3 class="text-white font-medium mb-4">Mein Lebenslauf</h3>
      <ul>
        <li v-for="ev in events" :key="ev.year">
          <div>
            <time class="text-white font-medium">{{ ev.year }}: {{ ev.title }}</time>
            <p class="text-zinc-300">{{ ev.description }}</p>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const skills = ref([
  'JavaScript','Vue','Python','HTML','Web Development','CSS','SQL','React','Java','Spring Boot','Docker','PostgreSQL','Oracle','Flutter','Render','Dart','Typescript'
])

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

const events = ref([
  { year: 2026, title: 'Bachelor of Science - Wirtschaftsinformatik', description: 'Voraussichtlicher Abschluss an der HTW Berlin. Schwerpunkt auf Datenanalyse und Systemarchitektur.' },
  { year: 2024, title: 'Praktikum BMDV Abteilung Z33', description: '3,5-monatiges Fachpraktikum im IT-Bereich. Schwerpunkt: Server-Betrieb und Infrastruktur-Management.' },
  { year: 2022, title: 'Werksstudent bei Kaufland', description: 'Zwei Jahre als Werksstudent tätig. Erfahrungen in Prozessoptimierung und Kundenbetreuung.' },
  { year: 2022, title: 'Abitur Ernst-Haeckel-Schule', description: 'Abschluss mit 2,8 im Mathe-Geschichte Profil. Grundlagen für technisches Studium gelegt.' },
  { year: 2018, title: 'Praktikum Finanzamt Marzahn-Hellersdorf', description: 'Einblicke in Bürotätigkeiten und Verhandlungsführung. Erste Berufserfahrungen gesammelt.' },
  { year: 2016, title: 'Praktikum Dr. Albrecht & Plogmaker', description: 'Fünf freiwillige Praktika in Steuerberatung. Tiefe Einblicke in Beratungsprozesse erhalten.' },
])

onMounted(() => {
  // Timeline old behavior: reveal once, offset left/right
  const targets = document.querySelectorAll('.timeline ul li')
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting){
        e.target.classList.add('in-view')
        obs.unobserve(e.target)
      }
    })
  }, { threshold: 0.35 })
  targets.forEach(t => io.observe(t))
  onUnmounted(() => io.disconnect())
})
</script>
<style scoped>
.skills-cloud .skill{ position:absolute; font-weight:700; white-space:nowrap; will-change: transform }
.about-me{ height:auto; border-radius: 9999px; border:1px solid rgba(255,255,255,.2) }

/* OLD TIMELINE BEHAVIOR, adapted */
.timeline ul { margin:0; padding:0 }
.timeline ul li { list-style-type:none; position:relative; width:6px; margin:0 auto; padding-top:50px; background: rgba(255,255,255,.18) }
.timeline ul li::after { content:""; position:absolute; left:50%; bottom:0; transform: translateX(-50%); width:30px; height:30px; border-radius:50%; background: rgba(255,255,255,.18); z-index:0; transition: background 2s ease-in-out }
.timeline ul li > div{ position:relative; width:400px; min-height:100px; padding:15px; background: rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.12); border-radius:10px; box-sizing:border-box; margin:0 auto; left:0; display:flex; flex-direction:column; justify-content:center; align-items:center; visibility:hidden; opacity:0; transition: all 1s ease-in-out }
.timeline ul li:nth-child(odd) > div{ left:60px; transform: translate3d(200px,0,0) }
.timeline ul li:nth-child(even) > div{ left:-465px; transform: translate3d(-200px,0,0) }
.timeline ul li.in-view > div{ transform:none; visibility:visible; opacity:1 }

@media (max-width: 900px){
  .timeline ul li > div{ width:250px }
  .timeline ul li:nth-child(even) > div{ left:-320px }
}
@media (max-width: 600px){
  .timeline{ margin-left:-4vw; z-index:0 }
  .timeline ul li{ margin-left:0; right:10px }
  .timeline ul li > div{ width: calc(95vw - 91px); padding:10px; left:50px; transform:none }
  .timeline ul li:nth-child(odd) > div{ left:50px }
  .timeline ul li:nth-child(even) > div{ left:50px }
}
</style>
