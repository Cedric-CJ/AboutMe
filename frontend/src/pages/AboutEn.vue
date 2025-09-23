<template>
  <section>
    <h2 class="text-white text-2xl font-semibold">Hi, I'm <span ref="twRef" class="typewriter-text"></span></h2>
    <div class="mt-6 grid md:grid-cols-3 gap-6">
      <div class="glass-card md:col-span-2 p-6 text-center">
        <div class="text-zinc-300 space-y-4 max-w-none">
        <p class="text-justify">
          My name is Cedric Arnhold, I'm {{ age }} years old, and I'm studying Business Informatics at HTW Berlin. Besides my studies, I enjoy turning ideas into functional projects – like this website. During my mandatory internship at the Federal Ministry for Digital and Transport (BMDV), I was able to gain my first experience in system administration.
        </p>
        <p class="text-justify">
          I'm currently working on building my own online store and delving deeper into the world of WordPress. At the same time, I'm preparing for certifications in server infrastructure and backup environments to further strengthen my career prospects.
          I also manage my <a href="https://mz24.net/" target="_blank" rel="noopener" class="accent-link">father's</a> and my <a href="https://buntpapieratelier.de/" target="_blank" rel="noopener" class="accent-link">girlfriend's</a> websites. I'll be sharing more about my projects and learnings on the <RouterLink to="/blog/eng" class="accent-link">Blog</RouterLink> page in the future.
        </p>
        </div>
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
import { RouterLink } from 'vue-router'

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
  {
    year: 2026,
    title: 'Bachelor of Science – Business Informatics (HTW Berlin)',
    description: 'Expected Bachelor graduation at the University of Applied Sciences (HTW) Berlin.',
    tags: ['Data Analysis', 'Systems Architecture', 'Software Engineering', 'Project Work']
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
])

onMounted(() => {
  // Typewriter effect with 3s initial 'Cedric'
  const words = ['DEVELOPER', 'DESIGNER', 'TECH-FREAK']
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
  // Erase the initially shown 'Cedric' with the same animation, then start typing words
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
  if (twRef.value) twRef.value.textContent = 'Cedric'
  timerId = setTimeout(eraseExistingThenType, 3000)

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

/* Timeline – old behavior adapted */
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
    width: calc(100% - 40px);
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
