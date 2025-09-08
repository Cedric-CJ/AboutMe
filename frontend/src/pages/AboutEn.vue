<template>
  <section>
    <h2 class="text-white text-2xl font-semibold">Hi, I'm Cedric</h2>
    <div class="mt-6 grid md:grid-cols-3 gap-6">
      <div class="glass-card md:col-span-2 p-6 text-sm text-zinc-300 space-y-3">
        <p>
          I'm Cedric Arnhold (22), studying Business Informatics at HTW Berlin. Besides my studies, I enjoy turning ideas into
          working projects — like this website. During my mandatory internship at the Federal Ministry for Digital and Transport
          (BMDV), I gained solid hands‑on experience in system administration and server infrastructure in a short time.
        </p>
        <p>
          In parallel, I maintain my father's website and make it work well across devices. I'm also modernising my former
          university project “VirtualPet”. Next, I'm planning a private mail, web and cloud server. Here I’ll share more about
          projects and what I learn along the way.
        </p>
      </div>
      <div class="glass-card p-6 flex items-center justify-center">
        <img src="@/assets/Pictures/Me.png" alt="Cedric" class="about-me" />
      </div>
    </div>

    <!-- Skills Cloud -->
    <div class="skills-cloud glass-card mt-8 p-4 relative overflow-hidden">
      <h3 class="text-white font-medium mb-3">My Skills</h3>
      <div class="relative w-full h-[40vh]">
        <span v-for="(skill, i) in skills" :key="i" class="skill" :style="generateStyle()">{{ skill }}</span>
      </div>
    </div>

    <!-- Timeline -->
    <div class="timeline mt-12">
      <h3 class="text-white font-medium mb-4">Resume</h3>
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

const skills = ref(['JavaScript','Vue','Python','HTML','Web Development','CSS','SQL','React','Java','Spring Boot','Docker','PostgreSQL','Oracle','Flutter','Render','Dart','Typescript'])

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
  { year: 2026, title: 'Bachelor of Science – Business Informatics (HTW Berlin)', description: 'Expected Bachelor graduation at the University of Applied Sciences (HTW) Berlin.' },
  { year: 2024, title: 'Mandatory Internship – BMDV (Dept. Z33)', description: 'Dec 2024 – Mar 2025 | Practical work in operating servers & IT infrastructure; first experience in system administration.' },
  { year: 2022, title: 'Working Student at Kaufland', description: 'June 2022 – August 2024.' },
  { year: 2022, title: 'A‑levels', description: 'Ernst‑Haeckel‑School Berlin | Final grade 2.8 (Math/History).' },
  { year: 2018, title: 'Internship – Tax Office Marzahn‑Hellersdorf', description: 'Experience in office routines and negotiations.' },
  { year: 2016, title: 'Internships – Dr. Albrecht & Plogmaker GbR', description: 'Five voluntary internships providing insights into tax consulting.' }
])

onMounted(() => {
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
.about-me{ width: clamp(80px, 12vw, 160px); height:auto; border-radius: 9999px; border:1px solid rgba(255,255,255,.2) }

/* Timeline – old behavior adapted */
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
