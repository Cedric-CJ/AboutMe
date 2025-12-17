<template>
  <section class="home-page page-bottom-gap">
    <div class="hero-banner">
      <div class="hero-top">
        <button class="pill-badge cli-chip">
          <span class="cli-symbol transition-opacity">&gt;_</span>
          <span class="brand-label">{{ brandLabel }}</span>
        </button>
      </div>

      <div class="hero-copy text-center">
        <h1 class="headline">
          <span>{{ heroLines[0] }}</span>
          <span class="accent">{{ heroLines[1] }}</span>
          <span>{{ heroLines[2] }}</span>
        </h1>
        <p class="subtitle">
          {{ heroSub }}
        </p>
        <div class="hero-actions">
          <button class="cta ghost" type="button" @click="goToServices">{{ ctaPrimary }}</button>
          <button class="cta ghost" type="button" @click="goToProjects">{{ ctaSecondary }}</button>
          <RouterLink to="/contact" class="cta primary">{{ lang==='en' ? 'Contact' : 'Kontakt aufnehmen' }}</RouterLink>
          <button class="cta ghost" @click="openPrivacy">
            {{ lang==='en' ? 'Privacy-Leitfaden' : 'Privacy-Leitfaden' }}
          </button>
        </div>
      </div>

      <div class="trust-cards" ref="trustContainer" :class="{ 'mobile-reveal': showServices }">
        <div
          v-for="badge in trustBadges"
          :key="badge.title"
          :class="['hero-card', 'trust-card', { active: activeTrust === badge.title }]"
          role="button"
          tabindex="0"
          @click="toggleTrust(badge.title)"
          @keyup.enter.prevent="toggleTrust(badge.title)"
          @keyup.space.prevent="toggleTrust(badge.title)"
        >
          <div class="card-top raise">
            <div class="icon-badge">
              <span v-if="badge.iconSvg" class="icon-emoji" v-html="badge.iconSvg"></span>
            </div>
            <div class="card-text">
              <p class="text-white font-semibold">{{ badge.title }}</p>
              <p class="text-sm text-zinc-300">{{ badge.desc }}</p>
            </div>
            <p class="trust-hint">{{ lang==='en' ? 'Tap card for details' : 'Tippe auf die Karte für Details' }}</p>
          </div>
          <div class="card-bottom">
            <p class="text-sm text-slate-100">{{ badge.detail }}</p>
          </div>
        </div>
      </div>

    <div class="scroll-indicator" v-if="showMouse" @click="scrollToSection">
      <div class="mouse"><div class="wheel"></div></div>
      <span class="swipe-dot"></span>
    </div>
  </div>

    <transition name="section-fade" appear>
      <div v-if="showServices" ref="secondSection" class="services-section">
        <div class="services-header">
          <h2>Services</h2>
          <p>{{ lang==='en'
            ? 'Solo packages for advisory, frontends and backends with privacy at the core.'
            : 'Solo-Pakete für Beratung, Frontends und Backends – Privacy first.' }}</p>
        </div>
        <div class="services-grid">
          <div v-for="item in heroHighlights" :key="item.title" class="service-card">
            <div class="icon-dot"></div>
            <p class="service-title">{{ item.title }}</p>
            <p class="service-desc">{{ item.desc }}</p>
          </div>
        </div>
        <RouterLink :to="links.services" class="cta ghost center-cta">
          {{ lang==='en' ? 'Alle Services ansehen' : 'Alle Services ansehen' }}
        </RouterLink>
      </div>
    </transition>

    <transition name="section-fade" appear>
      <section v-if="showServices" class="projects-section" ref="projectsSection">
        <div class="projects-header">
          <div>
            <h2>{{ lang==='en' ? 'Example projects' : 'Beispielprojekte' }}</h2>
          </div>
          <RouterLink :to="links.projects" class="cta ghost small">
            {{ lang==='en' ? 'Show all projects' : 'Alle Projekte' }}
          </RouterLink>
        </div>
        <div class="projects-grid">
          <article v-for="project in projectsPreview" :key="project.title" class="project-card spotlight-card">
            <div class="project-image" :style="{ backgroundImage: `url(${project.image})` }"></div>
            <div class="project-content">
              <p class="project-kicker">{{ project.subtitle }}</p>
              <h3>{{ project.title }}</h3>
              <p class="project-desc">{{ project.desc }}</p>
              <ul class="project-tags">
                <li v-for="tech in project.stack" :key="tech">{{ tech }}</li>
              </ul>
              <div class="project-actions">
                <a :href="project.link" target="_blank" rel="noreferrer" class="project-btn primary">
                  {{ lang==='en' ? 'Live' : 'Live' }}
                </a>
                <a :href="project.github" target="_blank" rel="noreferrer" class="project-btn ghost">
                  GitHub
                </a>
              </div>
            </div>
          </article>
        </div>
      </section>
    </transition>

    <transition name="section-fade" appear>
      <div v-if="showServices" class="contact-cta">
        <div class="contact-card">
          <h3>{{ lang==='en' ? 'Ready for your next project?' : 'Bereit für dein nächstes Projekt?' }}</h3>
          <p>{{ lang==='en'
            ? "Let's talk about your requirements and build a privacy-first solution."
            : 'Lass uns über deine Anforderungen sprechen und eine datenschutzkonforme Lösung entwickeln.' }}</p>
          <RouterLink to="/contact" class="cta primary">
            {{ lang==='en' ? 'Get in touch now' : 'Jetzt Kontakt aufnehmen' }}
          </RouterLink>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div
        v-if="showPrivacy"
        class="privacy-overlay"
        role="dialog"
        aria-modal="true"
        aria-label="Privacy guide"
      >
        <div class="privacy-backdrop" @click="closePrivacy"></div>
        <div class="privacy-modal glass-card" @click.stop ref="privacyModalRef">
          <header class="privacy-header">
            <div class="privacy-heading">
              <div class="privacy-icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
                  <path d="M9.1 12.83 11 14l4-4"></path>
                </svg>
              </div>
              <div class="privacy-heading-text">
                <p class="pill-badge text-xs px-3 py-1">{{ privacyIntro.kicker }}</p>
                <h3 class="privacy-title">{{ privacyIntro.title }}</h3>
                <p class="privacy-lead">{{ privacyIntro.lead }}</p>
              </div>
            </div>
          </header>

          <div class="privacy-body" role="list">
            <div
              v-for="section in privacySections"
              :key="section.id"
              :class="['accordion-item', { 'accordion-hidden-mobile': openPrivacySection && openPrivacySection !== section.id }]"
              role="listitem"
              :data-section-id="section.id"
            >
              <button
                class="accordion-trigger"
                type="button"
                @click="toggleAccordion(section.id)"
                :aria-expanded="isSectionOpen(section.id)"
              >
                <div class="accordion-left">
                  <span class="section-icon" aria-hidden="true">
                    <svg v-if="section.id === 'principles'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                    </svg>
                    <svg v-else-if="section.id === 'gdpr'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="9"></circle>
                      <path d="M8 12h8"></path>
                      <path d="M12 8v8"></path>
                    </svg>
                    <svg v-else-if="section.id === 'security'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      <circle cx="12" cy="16" r="1"></circle>
                    </svg>
                    <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 12h6"></path>
                      <path d="M12 16h6"></path>
                      <path d="M12 8h6"></path>
                      <path d="M8 12h.01"></path>
                      <path d="M8 16h.01"></path>
                      <path d="M8 8h.01"></path>
                      <rect x="3" y="4" width="7" height="16" rx="1"></rect>
                      <path d="M21 4v16"></path>
                    </svg>
                  </span>
                  <div class="accordion-titles">
                    <p class="accordion-kicker">{{ section.kicker }}</p>
                    <p class="accordion-title">{{ section.title }}</p>
                  </div>
                </div>
                <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" :class="{ open: isSectionOpen(section.id) }">
                  <path d="m6 9 6 6 6-6"></path>
                </svg>
              </button>
              <transition name="accordion">
                <div v-if="isSectionOpen(section.id)" class="accordion-panel">
                  <div v-for="item in section.items" :key="item.term" class="accordion-row">
                    <span class="row-dot" aria-hidden="true"></span>
                    <div class="accordion-copy">
                      <p class="row-term">{{ item.term }}</p>
                      <p class="row-desc">{{ item.desc }}</p>
                    </div>
                  </div>
                </div>
              </transition>
            </div>
          </div>

          <footer class="privacy-footer">
            <p class="privacy-note">{{ privacyIntro.note }}</p>
            <div class="privacy-footer-actions">
              <button type="button" class="ghost-close" @click="closePrivacy">{{ privacyIntro.close }}</button>
            </div>
          </footer>
        </div>
      </div>
    </transition>
  </section>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()
const __langTick = ref(0)
const lang = computed(() => {
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

function onLangChanged(){ __langTick.value++ }
onMounted(() => {
  try { window.addEventListener('preferred_lang_changed', onLangChanged) } catch (e) {}
  trustOutsideHandler = (e) => {
    const container = trustContainer.value
    if (container && !container.contains(e.target)) {
      activeTrust.value = ''
    }
  }
  document.addEventListener('click', trustOutsideHandler)
  const onScrollOnce = () => {
    showMouse.value = false
    window.removeEventListener('scroll', onScrollOnce)
  }
  window.addEventListener('scroll', onScrollOnce, { passive: true })
  servicesScrollHandler = () => revealServicesOnScroll()
  window.addEventListener('scroll', servicesScrollHandler, { passive: true })
  revealServicesOnScroll()
  window.addEventListener('wheel', handleHeroWheel, { passive: false })
  window.addEventListener('touchstart', handleTouchStart, { passive: true })
  window.addEventListener('touchmove', handleTouchMove, { passive: false })
})
onBeforeUnmount(() => {
  try { window.removeEventListener('preferred_lang_changed', onLangChanged) } catch (e) {}
  if (trustOutsideHandler) {
    document.removeEventListener('click', trustOutsideHandler)
    trustOutsideHandler = null
  }
  if (servicesScrollHandler) {
    window.removeEventListener('scroll', servicesScrollHandler)
    servicesScrollHandler = null
  }
  window.removeEventListener('wheel', handleHeroWheel)
  window.removeEventListener('touchstart', handleTouchStart)
  window.removeEventListener('touchmove', handleTouchMove)
  if (privacyKeyHandler) {
    window.removeEventListener('keydown', privacyKeyHandler)
    privacyKeyHandler = null
  }
  if (privacyOutsideHandler) {
    document.removeEventListener('click', privacyOutsideHandler, true)
    privacyOutsideHandler = null
  }
  unlockBodyScroll()
})

const heroTitle = computed(() => lang.value === 'en'
  ? 'Privacy-first frontends & clear product guidance.'
  : 'Privacy-first Frontends und klare Produktberatung.'
)
const brandLabel = computed(() => {
  const host = (typeof window !== 'undefined' ? window.location.hostname : '').toLowerCase()
  if (host.includes('specialcode')) return '{SPECIALCODE}'
  if (host.includes('spezialcode')) return '{SPEZIALCODE}'
  // fallback: derive from current path (english routes contain '/aboutme' etc.)
  if (route.path.startsWith('/about') || route.path.startsWith('/projects') || route.path.startsWith('/privacy')) {
    return '{SPECIALCODE}'
  }
  return '{SPEZIALCODE}'
})
const heroLines = computed(() => lang.value === 'en'
  ? ['Custom code.', 'Zero trackers.', 'Maximum impact.']
  : ['Individueller Code.', 'Null Tracker.', 'Maximale Wirkung.']
)
const heroSub = computed(() => lang.value === 'en'
  ? 'Frontends and clean backends from one person – privacy first.'
  : 'Frontends und schlanke Backends aus einer Hand – privacy first.'
)
const ctaPrimary = computed(() => 'Services')
const ctaSecondary = computed(() => lang.value === 'en' ? 'Projects' : 'Projekte')

const heroHighlights = computed(() => lang.value === 'en'
  ? [
      { title: 'Custom code',         desc: 'Templates fall short? I craft exactly what your project needs, from scope to launch.' },
      { title: 'Advisory',            desc: 'Bring the chaos. Walk away with a clear plan and next steps.' },
      { title: 'Frontend + backend',  desc: 'Launch-ready site with data/API, built to perform, not just look good.' },
    ]
  : [
      { title: 'Individueller Code',  desc: 'Wenn Standard nicht reicht: Ich baue genau das, was dein Projekt braucht, vom Scope bis zum Launch.' },
      { title: 'Beratung',            desc: 'Bring dein Chaos mit. Geh mit Plan und klaren Schritten.' },
      { title: 'Frontend + Backend',  desc: 'Launch-fertige Seite plus Daten-/API-Schicht, gemacht für Wirkung, nicht nur Optik.' },
    ]
)

const trustBadgesBase = computed(() => lang.value === 'en'
  ? [
      {
        title: 'Cookie-free',
        desc: 'I don´t use any trackers or marketing cookies.',
        icon: 'cookie',
        detail: 'Marketing cookies, sales trackers and third-party pixels stay out. Everything loads from system/EU-hosted fonts and scripts, and Altcha replaces reCAPTCHA to keep your user flows smooth.'
      },
      {
        title: 'EU hosting',
        desc: 'German data centres, GDPR defaults & clear DPAs.',
        icon: 'shield',
        detail: 'Servers sit in Germany with tuned DACH latency, documented DPAs and no transfers outside the EU unless there is a legal basis plus safeguards I can show you.'
      },
      {
        title: 'Open source',
        desc: 'You can inspect and evolve the Code.',
        icon: 'github',
        detail: 'Key building blocks stay open source so you can audit, extend or fork them. Every dependency is visible, which keeps security reviews honest.'
      },
    ]
  : [
      {
        title: 'Cookie-frei',
        desc: 'Ich setze auf keine Tracker oder Marketing-Cookies.',
        detail: 'Marketing-Cookies, Tracker und Werbe-Pixel lasse ich weg. Alles kommt über System-/EU-gehostete Fonts und Skripte, und Altcha ersetzt reCAPTCHA für smoothe Abläufe.'
      },
      {
        title: 'EU-Hosting',
        desc: 'Server in Deutschland mit DSGVO-Vorgaben.',
        detail: 'Meine Server stehen in deutschen Rechenzentren mit optimierter DACH-Latenz, dokumentierten AV-Verträgen und keinerlei Drittland-Übermittlung ohne Rechtsgrundlage.'
      },
      {
        title: 'Open Source',
        desc: 'Code, den du nachvollziehen kannst.',
        detail: 'Wesentliche Bausteine bleiben Open Source, damit du auditieren, erweitern oder weiterreichen kannst. Offen sichtbare Abhängigkeiten beschleunigen Security-Reviews und Reparaturen.'
      },
    ]
)
const trustIconMap = {
  'cookie': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-inline text-primary"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"></path><path d="M8.5 8.5v.01"></path><path d="M16 15.5v.01"></path><path d="M12 12v.01"></path><path d="M11 17v.01"></path><path d="M7 14v.01"></path></svg>`,
  'shield': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-inline text-primary"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path></svg>`,
  'github': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-inline text-primary"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>`
}
const trustIconFallback = {
  'cookie-free': 'cookie',
  'cookie-frei': 'cookie',
  'eu hosting': 'shield',
  'eu-hosting': 'shield',
  'open source': 'github'
}
const trustBadges = computed(() => trustBadgesBase.value.map(b => {
  const key = String(b.title || '').toLowerCase()
  const iconKey = b.icon || trustIconFallback[b.title] || trustIconFallback[key] || ''
  return {
    ...b,
    iconSvg: trustIconMap[iconKey] || ''
  }
}))


const capabilityCards = computed(() => lang.value === 'en' 
  ? [
      { kicker: 'Frontend', title: 'AI-ready UI & micro frontends', desc: 'Interfaces designed for AI widgets and data-heavy states without compromising UX.', pills: ['Vue', 'React', 'TypeScript'] },
      { kicker: 'Advisory', title: 'Scoping & roadmaps', desc: 'From requirements to deliverables with realistic timelines and privacy-first defaults.', pills: ['Workshops', 'Estimates', 'Security by design'] },
      { kicker: 'Performance', title: 'Core Web Vitals experts', desc: 'Audit, optimise and validate render paths, bundle sizes and perceived speed.', pills: ['<100ms TTFB', 'A11y', 'Testing'] },
      { kicker: 'Integration', title: 'API & automation', desc: 'REST/GraphQL integration, state machines and automations that remove manual steps.', pills: ['API design', 'Caching', 'DX'] },
      { kicker: 'Design ops', title: 'Design systems & UI kits', desc: 'Documented components, tokens and behaviours to keep teams consistent.', pills: ['Accessible', 'Reusable', 'Documented'] },
      { kicker: 'Coaching', title: 'Reviews & pairing', desc: 'Pragmatic feedback for teams that want to level up their frontend practice.', pills: ['Reviews', 'Pairing', 'Playbooks'] },
    ]
  : [
      { kicker: 'Frontend', title: 'AI-ready UI & Micro-Frontends', desc: 'Interfaces mit Raum für AI-Widgets und datenintensive States – ohne Einbußen in der UX.', pills: ['Vue', 'React', 'TypeScript'] },
      { kicker: 'Beratung', title: 'Scoping & Roadmaps', desc: 'Von Anforderungen zu belastbaren Roadmaps mit Privacy-by-Design-Ansatz.', pills: ['Workshops', 'Schätzungen', 'Security by design'] },
      { kicker: 'Performance', title: 'Core Web Vitals im Fokus', desc: 'Audit, Optimierung und Validierung von Renderpfaden, Bundlegrößen und wahrgenommener Geschwindigkeit.', pills: ['<100ms TTFB', 'A11y', 'Testing'] },
      { kicker: 'Integration', title: 'API & Automation', desc: 'REST/GraphQL-Anbindung, State Machines und Automationen, die manuelle Schritte reduzieren.', pills: ['API-Design', 'Caching', 'DX'] },
      { kicker: 'Design Ops', title: 'Design-Systeme & UI-Kits', desc: 'Dokumentierte Komponenten, Tokens und Regeln für konsistente Teams.', pills: ['Accessible', 'Wiederverwendbar', 'Dokumentiert'] },
      { kicker: 'Coaching', title: 'Reviews & Pairing', desc: 'Praxisnahes Feedback für Teams, die ihr Frontend nachhaltig weiterentwickeln wollen.', pills: ['Reviews', 'Pairing', 'Playbooks'] },
    ]
)

const capabilitiesLead = computed(() => lang.value === 'en'
  ? 'Hover over any card to highlight the focus – the same micro-interactions your users should enjoy.'
  : 'Hover-Highlights wie in den Next-Gen-Templates – genauso sollen sich spätere Interfaces anfühlen.'
)

const links = computed(() => lang.value === 'en'
  ? { services: '/service', projects: '/projects' }
  : { services: '/leistungen', projects: '/projekte' }
)
const serviceCards = computed(() => heroHighlights.value)

const coverPet = new URL('../assets/Pictures/Virtuelles Haustier.png', import.meta.url).href
const coverMetal = new URL('../assets/Pictures/mz24.png', import.meta.url).href
const trustContainer = ref(null)
const activeTrust = ref('')
let trustOutsideHandler = null
const showMouse = ref(true)
const showServices = ref(false)
const secondSection = ref(null)
const projectsSection = ref(null)
let servicesScrollHandler = null
let heroScrollLocked = false
let heroTouchStart = 0
function revealServicesOnScroll(){
  if (showServices.value) return
  if (typeof window === 'undefined') return
  if (window.scrollY > 40) {
    showServices.value = true
    if (servicesScrollHandler) {
      window.removeEventListener('scroll', servicesScrollHandler)
      servicesScrollHandler = null
    }
  }
}
function scrollToSection(targetEl = secondSection){
  showServices.value = true
  nextTick(() => {
    const target = targetEl?.value || targetEl
    if (!target) return
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
  revealServicesOnScroll()
}
function goToServices(){
  scrollToSection(secondSection)
}
function goToProjects(){
  scrollToSection(projectsSection)
}
function handleHeroWheel(event){
  if (showPrivacy.value) return
  const isMobile = typeof window !== 'undefined' ? window.matchMedia('(max-width: 768px)').matches : false
  if (isMobile) return
  if (heroScrollLocked || showServices.value) return
  if (window.scrollY > 20) return
  if (event.deltaY > 10) {
    event.preventDefault()
    heroScrollLocked = true
    scrollToSection()
    setTimeout(() => { heroScrollLocked = false }, 1200)
  }
}
function handleTouchStart(event){
  if (showPrivacy.value) {
    heroTouchStart = 0
    return
  }
  heroTouchStart = event.touches?.[0]?.clientY || 0
}
function handleTouchMove(event){
  if (showPrivacy.value) return
  const isMobile = typeof window !== 'undefined' ? window.matchMedia('(max-width: 768px)').matches : false
  if (isMobile) {
    if (!showServices.value && heroTouchStart !== 0) {
      const currentY = event.touches?.[0]?.clientY || 0
      if (heroTouchStart - currentY > 12) {
        showServices.value = true
        revealServicesOnScroll()
        heroTouchStart = 0
      }
    }
    return
  }
  if (heroScrollLocked || showServices.value) return
  if (heroTouchStart === 0) return
  const currentY = event.touches?.[0]?.clientY || 0
  if (heroTouchStart - currentY > 20 && window.scrollY < 20) {
    heroScrollLocked = true
    scrollToSection()
    heroTouchStart = 0
    setTimeout(() => { heroScrollLocked = false }, 1200)
  }
}
function toggleTrust(id){ activeTrust.value = activeTrust.value === id ? '' : id }

const projectsPreview = computed(() => lang.value === 'en'
  ? [
      {
        title: 'Virtual Pet',
        subtitle: 'University project',
        desc: 'Accounts, caring loops and high scores wrapped in a playful UI.',
        stack: ['Vue', 'TypeScript', 'SQL', 'Docker'],
        link: 'https://virtual-pet-bcky.onrender.com/',
        github: 'https://github.com/Cedric-CJ/virtual-pet',
        image: coverPet
      },
      {
        title: 'Metal Master Website',
        subtitle: 'Redesign & gallery',
        desc: 'Responsive relaunch with modern gallery, before/after slider and legal pages.',
        stack: ['Vue', 'JavaScript', 'Responsive', 'Gallery'],
        link: 'https://mz24.net/',
        github: 'https://github.com/Cedric-CJ/MZ24',
        image: coverMetal
      }
    ]
  : [
      {
        title: 'Virtuelles Haustier',
        subtitle: 'Studienprojekt',
        desc: 'Accounts, Pflege-Loops und Highscores in einer spielerischen UI.',
        stack: ['Vue', 'TypeScript', 'SQL', 'Docker'],
        link: 'https://virtual-pet-bcky.onrender.com/',
        github: 'https://github.com/Cedric-CJ/virtual-pet',
        image: coverPet
      },
      {
        title: 'Metallbaumeister',
        subtitle: 'Relaunch & Galerie',
        desc: 'Responsiver Relaunch mit moderner Galerie, Vorher/Nachher-Slider und angepassten Datenschutz-Informationen.',
        stack: ['Vue', 'JavaScript', 'Responsive', 'Galerie'],
        link: 'https://mz24.net/',
        github: 'https://github.com/Cedric-CJ/MZ24',
        image: coverMetal
      }
    ]
)

function setSpotlight(e){
  const el = e.currentTarget
  if (!el) return
  const rect = el.getBoundingClientRect()
const x = e.clientX - rect.left
const y = e.clientY - rect.top
el.style.setProperty('--x', `${x}px`)
el.style.setProperty('--y', `${y}px`)
}

const showPrivacy = ref(false)
const openPrivacySection = ref(null)
const privacyModalRef = ref(null)
let privacyKeyHandler = null
let privacyOutsideHandler = null
let bodyLocked = false
let lockedScrollY = 0

const privacyIntro = computed(() => lang.value === 'en'
  ? {
      kicker: 'Privacy & Security',
      title: 'Privacy & security – my standards',
      lead: 'Here is a plain-language overview of how I handle data protection and security in projects.',
      note: 'Note: This is not legal advice, but a transparent view of how I build privacy-friendly solutions.',
      close: 'Close'
    }
  : {
      kicker: 'Privacy & Security',
      title: 'Datenschutz & Sicherheit – meine Standards',
      lead: 'Hier findest du in einfacher Sprache, wie ich Datenschutz und Sicherheit in meinen Projekten umsetze.',
      note: 'Hinweis: Das ersetzt keine Rechtsberatung, zeigt aber, wie ich Projekte datenschutzfreundlich gestalte.',
      close: 'Schließen'
    }
)

const privacySections = computed(() => lang.value === 'en'
  ? [
      {
        id: 'principles',
        kicker: 'Basics',
        title: 'Privacy principles',
        items: [
          { term: 'Privacy by Design', desc: 'Privacy is planned from the start. I reduce data use and secure it early.' },
          { term: 'Data minimisation', desc: 'Only the data that is truly needed is collected — no extra fields.' },
          { term: 'EU hosting', desc: 'Sites and data stay on EU/German servers, so EU privacy rules apply.' },
          { term: 'Transparency', desc: 'Clear what data is processed and which services run, ideally open source.' },
        ]
      },
      {
        id: 'gdpr',
        kicker: 'GDPR',
        title: 'GDPR essentials',
        items: [
          { term: 'Lawfulness (Art. 6 GDPR)', desc: 'Processing only with a valid legal basis such as consent, contract or legitimate interest.' },
          { term: 'Purpose limitation', desc: 'Data is used only for the purpose it was collected for (e.g. contact request).' },
          { term: 'Storage limitation', desc: 'Data is kept only as long as necessary or legally required.' },
          { term: 'Data subject rights', desc: 'People can request access, correction, deletion or export of their data.' },
        ]
      },
      {
        id: 'security',
        kicker: 'Security',
        title: 'Technical safeguards',
        items: [
          { term: 'TLS 1.3', desc: 'Modern HTTPS encryption protects data in transit.' },
          { term: 'X-Frame-Options', desc: 'Prevents the site from being embedded elsewhere to reduce clickjacking.' },
          { term: 'Content Security Policy (CSP)', desc: 'Defines trusted sources for scripts and assets to block XSS.' },
          { term: 'HSTS', desc: 'Enforces HTTPS so traffic is not downgraded to http.' },
          { term: 'Rate limiting', desc: 'Caps requests per time frame to slow bots and brute-force attempts.' },
          { term: '2FA', desc: 'Two factors for logins (e.g. app code) to harden access.' },
          { term: 'DB encryption at rest', desc: 'Databases stay encrypted on disk, not just in transit.' },
          { term: 'Secrets in vault', desc: 'API keys and passwords live in a secure vault, not in code.' },
          { term: 'IP allowlisting', desc: 'Only approved IPs can reach sensitive areas like admin tooling.' },
          { term: 'Audit logging', desc: 'Important actions are logged so anomalies can be traced.' },
          { term: 'Automated vulnerability scans', desc: 'Tools check the site regularly for known weaknesses.' },
          { term: 'Regular security audits', desc: 'Scheduled reviews of configs, patches and dependencies.' },
          { term: 'Threat modelling', desc: 'Systematically map attack paths and protect sensitive data.' },
        ]
      },
      {
        id: 'docs',
        kicker: 'Docs',
        title: 'Documents & templates',
        items: [
          { term: 'DPA (Data Processing Agreement)', desc: 'Agreement defining how I process client data securely as a processor.' },
          { term: 'Record of Processing Activities', desc: 'List of processes that use personal data, such as contact forms or newsletters.' },
        ]
      },
    ]
  : [
      {
        id: 'principles',
        kicker: 'Grundprinzipien',
        title: 'Datenschutz-Prinzipien',
        items: [
          { term: 'Privacy by Design', desc: 'Datenschutz wird von Anfang an mitgedacht. Ich reduziere Daten und sichere sie früh.' },
          { term: 'Datenminimierung', desc: 'Nur wirklich notwendige Daten erheben — keine überflüssigen Pflichtfelder.' },
          { term: 'EU-Hosting', desc: 'Webseite und Daten liegen auf Servern in Deutschland/EU, damit EU-Recht greift.' },
          { term: 'Transparenz', desc: 'Offenlegen, welche Daten wofür verarbeitet werden und welche Dienste laufen; gerne Open Source.' },
        ]
      },
      {
        id: 'gdpr',
        kicker: 'DSGVO',
        title: 'DSGVO-Grundlagen',
        items: [
          { term: 'Rechtmäßigkeit (Art. 6 DSGVO)', desc: 'Verarbeitung nur mit Rechtsgrundlage wie Einwilligung, Vertrag oder berechtigtem Interesse.' },
          { term: 'Zweckbindung', desc: 'Daten werden nur für den Zweck genutzt, für den sie erhoben wurden (z. B. Kontaktanfrage).' },
          { term: 'Speicherbegrenzung', desc: 'Daten bleiben nur so lange, wie es nötig oder gesetzlich gefordert ist.' },
          { term: 'Betroffenenrechte', desc: 'Auskunft, Berichtigung, Löschung oder Export können jederzeit angefragt werden.' },
        ]
      },
      {
        id: 'security',
        kicker: 'Sicherheit',
        title: 'Technische Sicherheitsmaßnahmen',
        items: [
          { term: 'TLS 1.3', desc: 'Verschlüsselte https-Verbindung schützt Daten beim Transport.' },
          { term: 'X-Frame-Options', desc: 'Verhindert fremdes Einbetten und erschwert Clickjacking.' },
          { term: 'Content Security Policy (CSP)', desc: 'Legt vertrauenswürdige Quellen für Skripte/Bilder fest und schützt vor XSS.' },
          { term: 'HSTS', desc: 'Erzwingt dauerhaft https, damit kein Downgrade auf http möglich ist.' },
          { term: 'Rate Limiting', desc: 'Begrenzt Anfragen pro Zeitfenster, schützt vor Bots und Brute-Force.' },
          { term: '2FA', desc: 'Zwei Faktoren beim Login (z. B. App-Code) erhöhen die Sicherheit deutlich.' },
          { term: 'DB encryption at rest', desc: 'Datenbank bleibt auch auf der Festplatte verschlüsselt.' },
          { term: 'Secrets in Vault', desc: 'API-Keys und Passwörter liegen in einem sicheren Tresor statt im Code.' },
          { term: 'IP-Allowlisting', desc: 'Nur freigegebene IPs dürfen sensible Bereiche wie Admin-Zugänge erreichen.' },
          { term: 'Audit Logging', desc: 'Wichtige Aktionen werden protokolliert, um Auffälligkeiten nachzuvollziehen.' },
          { term: 'Automated Vulnerability Scans', desc: 'Automatische Tools prüfen regelmäßig auf bekannte Schwachstellen.' },
          { term: 'Regular Security Audits', desc: 'Regelmäßige Checks von Konfigurationen, Patches und Abhängigkeiten.' },
          { term: 'Threat Modelling', desc: 'Systematisch prüfen, wo Angriffe möglich sind, und passende Maßnahmen ableiten.' },
        ]
      },
      {
        id: 'docs',
        kicker: 'Vorlagen',
        title: 'Dokumente & Muster',
        items: [
          { term: 'AVV (Auftragsverarbeitungsvertrag)', desc: 'Regelt, wie ich personenbezogene Daten im Auftrag verarbeite und schütze.' },
          { term: 'Verzeichnis von Verarbeitungstätigkeiten', desc: 'Liste aller Prozesse mit personenbezogenen Daten, z. B. Kontaktformular oder Newsletter.' },
        ]
      },
    ]
)

function openPrivacy(){
  showPrivacy.value = true
  openPrivacySection.value = null
  lockBodyScroll()
}
function closePrivacy(){
  showPrivacy.value = false
  openPrivacySection.value = null
  unlockBodyScroll()
}

function isSectionOpen(id){
  return openPrivacySection.value === id
}
function toggleAccordion(id){
  openPrivacySection.value = openPrivacySection.value === id ? null : id
  scrollAccordionIntoView(id)
}

function scrollAccordionIntoView(id){
  if (typeof window === 'undefined' || window.innerWidth > 768) return
  try {
    const el = document.querySelector(`[data-section-id=\"${id}\"]`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  } catch (e) {}
}

watch(showPrivacy, (visible) => {
  if (typeof window === 'undefined') return
  if (visible) {
    lockBodyScroll()
    if (privacyKeyHandler) {
      window.removeEventListener('keydown', privacyKeyHandler)
    }
    privacyKeyHandler = (e) => {
      if (e.key === 'Escape') closePrivacy()
    }
    window.addEventListener('keydown', privacyKeyHandler)

    if (privacyOutsideHandler) {
      document.removeEventListener('click', privacyOutsideHandler, true)
    }
    privacyOutsideHandler = (e) => {
      const modal = privacyModalRef.value
      if (!modal) return
      const target = e.target
      if (!modal.contains(target)) return
      const isAccordion = target.closest?.('.accordion-item')
      if (!isAccordion) {
        openPrivacySection.value = null
      }
    }
    document.addEventListener('click', privacyOutsideHandler, true)
  } else if (privacyKeyHandler) {
    window.removeEventListener('keydown', privacyKeyHandler)
    privacyKeyHandler = null
    if (privacyOutsideHandler) {
      document.removeEventListener('click', privacyOutsideHandler, true)
      privacyOutsideHandler = null
    }
    unlockBodyScroll()
  }
})

function lockBodyScroll(){
  if (typeof document === 'undefined' || bodyLocked) return
  lockedScrollY = typeof window !== 'undefined'
    ? window.scrollY || document.documentElement.scrollTop || 0
    : 0
  document.documentElement.classList.add('modal-open')
  document.body.classList.add('modal-open')
  document.body.style.position = 'fixed'
  document.body.style.width = '100%'
  document.body.style.top = `-${lockedScrollY}px`
  bodyLocked = true
}
function unlockBodyScroll(){
  if (typeof document === 'undefined' || !bodyLocked) return
  document.body.classList.remove('modal-open')
  document.documentElement.classList.remove('modal-open')
  document.body.style.position = ''
  document.body.style.width = ''
  document.body.style.top = ''
  if (typeof window !== 'undefined') {
    window.scrollTo(0, lockedScrollY || 0)
  }
  bodyLocked = false
}
</script>

<style scoped>
.home-page{
  margin: 0;
  padding: 0;
}
.home-page.page-bottom-gap{
  padding-bottom: 2rem;
}
.home-page :deep(a){ text-decoration: none; }
.hero-banner{
  position: relative;
  min-height: 100vh;
  display:flex;
  flex-direction:column;
  gap: 18px;
  text-align:center;
  margin:0 auto;
  padding: clamp(1.5rem, 3vw, 2.5rem) clamp(1rem, 4vw, 2rem) clamp(5rem, 8vh, 7rem);
  justify-content:center;
  width: min(100%, 1200px);
}
.hero-top{
  display:flex;
  align-items:center;
  justify-content:center;
  gap: 10px;
}
.hero-copy{
  width: min(100%, 860px);
  margin: 0 auto;
  padding: 0 0.75rem;
}
.cli-symbol{
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  font-weight: 700;
  letter-spacing: 0.4px;
  color: rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .92);
  display: inline-flex;
  align-items: center;
}
.brand-label{
  font-weight: 700;
  color: #eaf6f7;
  letter-spacing: 0.3px;
}
.badge-ghost{
  padding: 6px 12px;
  border-radius: 9999px;
  border:1px solid rgba(255,255,255,.16);
  background: rgba(255,255,255,.06);
  color:#d7e9f5;
  font-size: 0.85rem;
}
.headline{
  margin-top: 16px;
  display:flex;
  flex-direction:column;
  gap: 4px;
  font-size: clamp(2.5rem, 5vw, 4.2rem);
  font-weight: 800;
  color:#fff;
}
.headline .accent{ color: var(--accent-raw, var(--accent-default, #f0c33c)); }
.subtitle{
  margin-top: 8px;
  color:#d9e7ee;
  font-size: clamp(1rem, 2.2vw, 1.1rem);
  max-width: min(70ch, 90vw);
  margin-left:auto;
  margin-right:auto;
}
.hero-actions{
  margin-top: 18px;
  display:flex;
  flex-wrap:wrap;
  gap: 12px;
  justify-content:center;
}
.cta{
  border-radius: 14px;
  padding: 12px 18px;
  font-weight: 700;
  border:1px solid rgba(255,255,255,.12);
  background: rgba(255,255,255,.08);
  color:#eaf6f7;
  transition: all .2s ease;
}
.cta.small{
  padding: 10px 16px;
  font-size: 0.85rem;
}
.cta.primary{
  background: linear-gradient(135deg, rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), 0.9), rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), 1));
  color: var(--accent-text, #00111a);
  border-color: transparent;
  box-shadow: 0 10px 35px rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .35);
}
.cta.ghost:hover{ border-color: rgba(255,255,255,.25); }
.cta.primary:hover{ transform: translateY(-1px); }
.hero-card{
  position: relative;
  border:1px solid rgba(255,255,255,.12);
  border-radius: 16px;
  overflow: hidden;
}
.trust-cards{
  margin-top: 30px;
  display:grid;
  grid-template-columns: repeat(3, minmax(250px,1fr));
  gap: clamp(14px, 2vw, 18px);
  width: min(100%, 1280px);
  margin-left:auto;
  margin-right:auto;
  align-items: start;
}
.trust-card{
  text-align:left;
  background: transparent;
  border: none;
  cursor: pointer;
  position: relative;
  --hover: rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .35);
  border-radius: 18px;
  overflow: visible;
}
.card-top{
  position: relative;
  z-index: 2;
  background: linear-gradient(140deg, rgba(26,44,60,.95), rgba(32,76,104,.82));
  border:1px solid rgba(255,255,255,.22);
  border-radius: 14px;
  padding: 16px 16px 18px;
  display:flex;
  gap:12px;
  align-items:center;
  justify-content:center;
  transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
  text-align: left;
}
.card-text{ display:flex; flex-direction:column; justify-content:center; text-align:center; align-items:center; }
.card-text{
  display:flex; flex-direction:column; justify-content:center; text-align:center; align-items:center;
  writing-mode: horizontal-tb;
  letter-spacing: normal;
  white-space: normal;
}
.icon-badge{
  width: 42px; height: 42px;
  border-radius: 12px;
  display:flex; align-items:center; justify-content:center;
  border:1px solid rgba(255,255,255,.16);
  flex-shrink:0;
}
.icon-emoji svg{
  width: 22px;
  height: 22px;
  stroke: rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), 1);
  color: rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), 1);
  fill: none;
}
.card-bottom{
  position: absolute;
  left: 10px;
  right: 10px;
  top: calc(100% + clamp(6px, 1vw, 10px));
  z-index: 1;
  border-radius: 14px;
  background: linear-gradient(150deg, rgba(46,82,110,.9), rgba(58,110,140,.78));
  border:1px solid rgba(255,255,255,.24);
  padding: 16px;
  opacity: 0;
  transform: translateY(calc(-1 * clamp(24px, 4vw, 34px))) scale(.98);
  max-height: 240px;
  overflow: hidden;
  transition: opacity .25s ease, transform .3s ease, border-color .25s ease, box-shadow .25s ease;
  text-align:center;
  pointer-events: none;
  visibility: hidden;
}
.trust-hint{
  display:none;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #dfe7f1;
  margin-top: 6px;
}
.raise:hover,
.raise:focus{
  box-shadow: none;
  transform: none;
}
.trust-card.active .card-top{
  transform: none;
  box-shadow: 0 0.35em 0.6em -0.35em var(--hover);
  border-color: rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .32);
}
.trust-card.active .card-bottom{
  opacity:1;
  transform: translateY(-12px);
  max-height: 320px;
  border-color: rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .34);
  box-shadow: 0 18px 50px rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .12);
  pointer-events: auto;
  visibility: visible;
}
.scroll-indicator{
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:8px;
  cursor: pointer;
}
.mouse{
  width:26px; height:42px;
  border:2px solid rgba(255,255,255,.4);
  border-radius: 14px;
  position: relative;
  margin-top: 10vh;
}
.wheel{
  width:4px; height:10px;
  background: rgba(255,255,255,.7);
  border-radius: 999px;
  position:absolute; left:50%; top:8px;
  transform: translateX(-50%);
  animation: wheel 1.4s infinite;
}
@keyframes wheel{
  0%{ opacity:1; transform: translate(-50%,0); }
  100%{ opacity:0; transform: translate(-50%,10px); }
}
.swipe-dot{
  display:none;
  width:8px; height:8px; border-radius:999px;
  background: rgba(255,255,255,.7);
}
.services-section{
  padding: 0 1.25rem;
  text-align:center;
  max-width: 1200px;
  margin: 0 auto;
}
.services-header h2{
  color:#fff; font-size: clamp(2rem,3vw,2.6rem); font-weight:800;
}
.services-header p{ color:#d8e6ee; margin-top:6px; }
.services-grid{
  margin-top: clamp(1.75rem, 3vw, 2.6rem);
  display:grid;
  grid-template-columns: repeat(auto-fit, minmax(220px,1fr));
  gap: clamp(1rem, 2vw, 1.5rem);
}
.service-card{
  background: linear-gradient(160deg, rgba(17,28,40,.85), rgba(28,48,66,.65));
  border:1px solid rgba(255,255,255,.12);
  border-radius: 20px;
  padding: 22px;
  box-shadow: 0 25px 60px rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .08);
  text-align:left;
}
.icon-dot{
  width:18px; height:18px; border-radius:999px;
  background: radial-gradient(circle, rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), 0.9) 0%, rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), 0.15) 70%);
  margin-bottom:10px;
}
.service-title{ color:#fff; font-weight:700; font-size:1.05rem; }
.service-desc{ color:#d1d9e2; font-size: .95rem; margin-top:4px; }
.center-cta{ margin-top: clamp(1.5rem, 3vw, 2rem); display:inline-flex; }
.contact-cta{
  margin-top: clamp(2rem, 4vw, 3rem);
  display:flex;
  justify-content:center;
}
.contact-card{
  background: linear-gradient(170deg, rgba(12,21,32,.92), rgba(20,48,66,.88));
  border:1px solid rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .25);
  border-radius: 22px;
  padding: clamp(28px, 4vw, 46px) clamp(22px, 4vw, 42px);
  text-align:center;
  box-shadow: 0 24px 80px rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .2);
}
.contact-card h3{ color:#fff; font-size: clamp(1.6rem,3vw,2.2rem); font-weight:800; }
.contact-card p{ color:#d1d9e2; margin: 14px 0 32px; }
.contact-card .cta.primary{
  margin-top: 6px;
  padding: 14px 22px;
}

.projects-section{
  margin-top: clamp(2.5rem, 4vw, 3.5rem);
  position: relative;
  text-align: left;
  width: min(100%, 1280px);
  margin-left: auto;
  margin-right: auto;
}
.projects-header{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap: 1rem;
}
.projects-header h2{
  font-size: clamp(1.6rem, 5vw, 2.3rem);
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.projects-grid{
  margin-top: 1.5rem;
  display:grid;
  grid-template-columns: repeat(auto-fit, minmax(280px,1fr));
  gap: 1.5rem;
}
.project-card{
  background: rgba(5,10,20,.6);
  border:1px solid rgba(255,255,255,.08);
  border-radius: 20px;
  overflow: hidden;
  min-height: 320px;
  display:flex;
  flex-direction:column;
}
.project-image{
  width: 100%;
  aspect-ratio: 16 / 9;
  height: clamp(180px, 26vw, 240px);
  background-size: cover;
  background-position: center;
  border-bottom: 1px solid rgba(255,255,255,.08);
}
.project-content{
  padding: 1.2rem;
  display:flex;
  flex-direction:column;
  gap: 0.65rem;
  flex: 1;
}
.project-kicker{
  font-size: 0.85rem;
  color: #a1b4ca;
  text-transform: uppercase;
  letter-spacing: 0.2em;
}
.project-content h3{
  margin: 0;
  color: #fff;
  font-size: 1.35rem;
}
.project-desc{
  color:#d7e2ef;
  font-size: 0.95rem;
  line-height: 1.4;
}
.project-tags{
  list-style:none;
  margin:0;
  padding:0;
  display:flex;
  flex-wrap:wrap;
  gap:0.4rem;
}
.project-tags li{
  font-size: 0.75rem;
  padding: 0.25rem 0.7rem;
  border-radius: 999px;
  border: 1px solid rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .6);
  color: #fff;
  background: rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), 0.08);
}
.project-actions{
  margin-top: auto;
  display:flex;
  gap: 0.6rem;
}
.project-btn{
  flex:1;
  text-align:center;
  text-decoration:none;
  padding: 0.65rem 0;
  border-radius: 999px;
  font-weight: 600;
  transition: transform .2s ease, box-shadow .25s ease;
}
.project-btn.primary{
  background: linear-gradient(135deg, rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .9), rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), 1));
  color: var(--accent-text, #00111a);
  box-shadow: 0 10px 30px rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .25);
}
.project-btn.ghost{
  border:1px solid rgba(255,255,255,.2);
  color:#fff;
  background: rgba(255,255,255,.05);
}
.project-btn:hover{
  transform: translateY(-1px);
}

@media (min-width: 769px) and (max-width: 1100px){
  .hero-banner{
    padding: 1.25rem 1rem 4.5rem;
  }
  .trust-cards{
    grid-template-columns: repeat(3, minmax(0,1fr));
    gap: 14px;
    width: min(100%, 1100px);
  }
  .card-top{
    padding: 14px 12px 16px;
  }
  .card-bottom{
    left: 8px;
    right: 8px;
  }
  .services-grid{
    grid-template-columns: repeat(2, minmax(0,1fr));
  }
  .service-card{
    padding: 18px;
  }
  .projects-grid{
    grid-template-columns: repeat(auto-fit, minmax(240px,1fr));
  }
}

@media (max-width: 768px){
  .home-page{ padding: 0; }
  .hero-banner{
    min-height: 94vh;
    padding: 1.2rem 0.75rem 4rem;
  }
  .headline{ font-size: clamp(2rem, 8vw, 2.6rem); }
  .subtitle{
    font-size: 0.95rem;
    max-width: 32ch;
  }
  .hero-actions{
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
  .cta{ width: 100%; text-align: center; }
  .services-section{
    padding: 0 0.75rem;
  }
  .services-grid{
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .service-card{
    padding: 14px;
    border-radius: 16px;
  }
  .service-title{ font-size: 1rem; }
  .service-desc{ font-size: 0.9rem; }

  .contact-cta{
    margin-top: clamp(3rem, 8vw, 3.8rem);
  }
  .contact-card{
    margin-top: clamp(0.75rem, 5vw, 1.4rem);
  }
  .mouse{ display:none; }
  .swipe-dot{
    display:block;
    animation: swipe 1.2s ease-in-out infinite;
    position: relative;
  }
  .hero-card{
    border: none;
    box-shadow: none;
  }
  .trust-cards{
    grid-template-columns: 1fr;
    gap: 14px;
    padding: 0 clamp(10px, 4vw, 18px);
    justify-items: center;
  }
  .trust-card{
    display:flex;
    flex-direction:column;
    gap: 14px;
    padding: 0;
    width: min(520px, 100%);
    margin: 0 auto;
    align-items: stretch;
  }
  .card-top{
    background: linear-gradient(140deg, rgba(16,30,44,.95), rgba(32,70,104,.85));
    border: 1px solid rgba(255,255,255,.18);
    padding: 16px;
    display:flex;
    flex-direction:column;
    gap: 8px;
    align-items:flex-start;
    justify-content:flex-start;
    width: 100%;
  }
  .card-text{
    align-items:flex-start;
    text-align:left;
  }
  .card-bottom{
    position: relative;
    opacity: 0;
    max-height: 0;
    padding: 0;
    border-radius: 16px;
    border: 1px solid rgba(255,255,255,.16);
    background: rgba(255,255,255,0.03);
    box-shadow: none;
    transform: translateX(0);
    transition: none;
    width: 100%;
    visibility: hidden;
    pointer-events: none;
  }
  .trust-card.active .card-bottom{
    opacity: 1;
    max-height: 360px;
    padding: 16px;
    transform: translateX(clamp(10px, 4vw, 18px));
    transition: max-height .4s ease, opacity .4s ease, padding .3s ease, transform .3s ease;
    visibility: visible;
    pointer-events: auto;
  }
  .trust-card.active .card-bottom p{
    color: #d6deee;
    text-align:left;
    line-height:1.5;
  }

  .card-top{ transition: none; }
  .trust-card.active .card-top{
    align-self:flex-start;
    transform: none;
  }
  .trust-card.active .card-bottom{ align-self:flex-end; }
  .trust-hint{
    display:inline-flex;
    align-self:flex-start;
    border: 1px dashed rgba(255,255,255,.4);
    padding: 5px 10px;
    border-radius: 999px;
  }
  .projects-grid{
    grid-template-columns: 1fr;
  }
  .project-card{
    min-height: auto;
  }
  .project-image{
    aspect-ratio: 4 / 3;
    height: clamp(120px, 26vw, 160px);
  }
  .project-content{
    padding: 1rem;
  }
  .project-content h3{
    font-size: 1.15rem;
  }
  .project-desc{
    font-size: 0.85rem;
  }
  .project-tags{
    gap: 0.3rem;
  }
  .project-tags li{
    font-size: 0.65rem;
    padding: 0.2rem 0.5rem;
  }
  .project-actions{
    flex-direction: column;
  }
  .project-btn{
    font-size: 0.9rem;
    padding: 0.55rem 0;
  }
  .trust-cards{
    display: none;
  }
  .trust-cards.mobile-reveal{
    display: grid;
  }
  .scroll-indicator{
    margin-top: 12px;
  }
}

.section-fade-enter-active,
.section-fade-leave-active{
  transition: opacity .45s ease, transform .45s ease;
}
.section-fade-enter-from,
.section-fade-leave-to{
  opacity: 0;
  transform: translateY(18px);
}
@keyframes swipe{
  0%{ transform: translateY(0); opacity: .7; }
  50%{ transform: translateY(8px); opacity: 1; }
  100%{ transform: translateY(0); opacity: .7; }
}

.privacy-overlay{
  position: fixed;
  inset: 0;
  z-index: 320;
  display:flex;
  align-items:center;
  justify-content:center;
  padding: clamp(12px, 4vw, 24px);
}
.privacy-backdrop{
  position:absolute;
  inset:0;
  background: rgba(0,0,0,.48);
  backdrop-filter: blur(10px);
}
.privacy-modal{
  position: relative;
  z-index:1;
  width: min(92vw, 760px);
  max-height: calc(100vh - 32px);
  padding: clamp(16px, 3vw, 24px);
  background: rgba(10,15,20,.92);
  border: 1px solid rgba(255,255,255,.12);
  border-radius: 18px;
  box-shadow: 0 24px 70px rgba(0,0,0,.45), 0 0 0 1px rgba(255,255,255,.03);
  display:flex;
  flex-direction:column;
  gap: 16px;
  overflow: hidden;
}
.privacy-header{
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap: 12px;
}
.privacy-heading{
  display:flex;
  gap: 12px;
  align-items:flex-start;
}
.privacy-icon{
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display:flex;
  align-items:center;
  justify-content:center;
  background: rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .12);
  border: 1px solid rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .35);
  color: rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), 1);
  box-shadow: 0 8px 20px rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .18);
}
.privacy-heading-text h3{
  margin: 4px 0 6px;
}
.privacy-title{
  color:#fff;
  font-size: clamp(1.15rem, 2.6vw, 1.55rem);
  font-weight: 700;
  line-height: 1.25;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.privacy-lead{
  color: #d5deea;
  max-width: 48ch;
  font-size: 0.95rem;
}
.privacy-close{
  display:flex;
  align-items:center;
  justify-content:center;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,.18);
  background: rgba(255,255,255,.08);
  color:#dce8f4;
  transition: transform .15s ease, opacity .2s ease, border-color .2s ease;
}
.privacy-close:hover{ transform: translateY(-1px); border-color: rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .55); color: #fff; }
.privacy-close:active{ opacity: .9; }

.privacy-body{
  flex: 1;
  min-height: 0;
  overflow: hidden;
  padding: 4px 4px 22px;
  display:flex;
  flex-direction:column;
  gap: 12px;
  max-height: min(520px, 70vh);
  overscroll-behavior: contain;
  scroll-padding-bottom: 28px;
}
.privacy-body::-webkit-scrollbar{ width: 6px; }
.privacy-body::-webkit-scrollbar-thumb{ background: rgba(255,255,255,.12); border-radius: 999px; }

.accordion-item{
  background: rgba(255,255,255,.025);
  border:1px solid rgba(255,255,255,.08);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 14px 35px rgba(0,0,0,.26);
  transition: opacity .32s ease, transform .32s ease, border-color .32s ease, box-shadow .32s ease;
  will-change: opacity, transform;
}
.accordion-trigger{
  width: 100%;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap: 10px;
  padding: 12px 14px;
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
}
.accordion-left{
  display:flex;
  align-items:center;
  gap: 12px;
}
.section-icon{
  width: 34px;
  height: 34px;
  border-radius: 12px;
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.08);
  display:flex;
  align-items:center;
  justify-content:center;
  color: rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), 1);
}
.accordion-titles{
  display:flex;
  flex-direction:column;
  gap: 2px;
  text-align:left;
}
.accordion-kicker{
  font-size: 0.8rem;
  color: #9fb6c7;
  letter-spacing: .08em;
  text-transform: uppercase;
}
.accordion-title{
  color:#fff;
  font-weight: 700;
  font-size: 1rem;
}
.chevron{
  transition: transform .18s ease;
  color:#cbd8e6;
}
.chevron.open{ transform: rotate(180deg); }
.accordion-panel{
  padding: 12px 14px 22px;
  display:flex;
  flex-direction:column;
  gap: 12px;
  background: rgba(0,0,0,.05);
  border-top: 1px solid rgba(255,255,255,.06);
  max-height: min(200px, 70vh);
  min-height: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  scroll-padding-bottom: 28px;
  touch-action: pan-y;
  scrollbar-gutter: stable;
  scrollbar-width: thin;
}
.accordion-item[data-section-id="principles"] .accordion-panel{
  min-height: 0;
  max-height: min(200px, 70vh);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  scrollbar-gutter: stable;
  scrollbar-width: thin;
}

@media (min-width: 769px){
  .privacy-body{
    align-items: stretch;
  }
  .accordion-item{
    flex-shrink: 0;
  }
}

.accordion-row{
  display:flex;
  align-items:flex-start;
  gap: 12px;
  padding: 2px 0;
}
.row-dot{
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .95) 0%, rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .3) 68%);
  margin-top: 4px;
  flex-shrink: 0;
}
.accordion-copy{
  display:flex;
  flex-direction:column;
  gap: 4px;
}
.row-term{
  color:#e7f4ff;
  font-weight: 700;
  font-size: 0.95rem;
}
.row-desc{
  color:#d1d9e2;
  font-size: 0.92rem;
  line-height: 1.48;
}

.privacy-footer{
  display:flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items:center;
  justify-content:space-between;
  border-top: 1px solid rgba(255,255,255,.08);
  padding-top: 12px;
}
.privacy-note{
  color:#c5d4e4;
  font-size: 0.9rem;
  max-width: 46ch;
}
.privacy-footer-actions{
  display:flex;
  align-items:center;
  gap: 10px;
  flex-wrap: wrap;
}
.ghost-close{
  border: 1px dashed rgba(255,255,255,.22);
  background: transparent;
  color:#d8e6f2;
  padding: 8px 12px;
  border-radius: 10px;
  cursor: pointer;
}
.ghost-close:hover{ border-color: rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .6); color:#fff; }

.accordion-enter-active,
.accordion-leave-active{
  transition: opacity .32s ease, transform .32s ease;
}
.accordion-enter-from,
.accordion-leave-to{
  opacity: 0;
  transform: translateY(-8px) scaleY(.98);
}
.accordion-enter-to,
.accordion-leave-from{
  opacity: 1;
  transform: translateY(0) scaleY(1);
}

@media (max-width: 640px){
  .privacy-modal{
    width: min(96vw, 620px);
    max-height: calc(100vh - 20px - env(safe-area-inset-top) - env(safe-area-inset-bottom));
    padding: 14px;
    box-shadow: 0 18px 60px rgba(0,0,0,.5), 0 0 0 1px rgba(255,255,255,.04);
  }
  .privacy-header{
    padding-top: max(4px, env(safe-area-inset-top));
  }
  .privacy-footer{
    padding-bottom: max(6px, env(safe-area-inset-bottom));
  }
  .privacy-header{
    align-items:flex-start;
  }
  .privacy-heading{
    align-items:flex-start;
  }
  .privacy-lead{
    font-size: 0.9rem;
  }
  .privacy-footer{
    flex-direction: column;
    align-items:flex-start;
  }
  .privacy-footer-actions{
    width: 100%;
  }
  .privacy-footer-actions a,
  .privacy-footer-actions button{
    width: 100%;
    justify-content: center;
    text-align: center;
  }
  .privacy-body{
    max-height: min(470px, 72vh);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
  }
  .accordion-item{
    transition: opacity .34s ease, transform .34s ease, max-height .36s ease, margin .36s ease;
  }
  .accordion-hidden-mobile{
    opacity: 0;
    max-height: 0;
    margin: 0;
    padding: 0;
    pointer-events: none;
    transform: translateY(-4px);
    overflow: hidden;
  }
  .row-dot{
    margin-top: 3px;
  }
  .accordion-panel{
    padding: 10px 12px clamp(56px, 12vh, 90px);
    max-height: min(400px, 72vh);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
    min-height: 0;
    scrollbar-width: thin;
  }
  .accordion-item[data-section-id="principles"] .accordion-panel{
    max-height: min(400px, 72vh);
    padding: 10px 12px clamp(56px, 12vh, 90px);
    min-height: 0;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
    scrollbar-width: thin;
  }
}

@media (max-width: 480px){
  .headline{
    font-size: clamp(1.6rem, 7vw, 1.9rem);
    line-height: 1.2;
  }
  .headline span{
    white-space: nowrap;
  }
}

@media (max-width: 400px){
  .privacy-body{
    padding:4px 4px 0px;
    gap: 5px;
    max-height: min(520px, 78vh);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
  }
  .privacy-modal{
    gap: 12px;
    padding: 12px;
  }
  .privacy-icon{
    width: 40px;
    height: 40px;
  }
  .privacy-title{
    font-size: 1.1rem;
    line-height: 1.25;
  }
  .privacy-lead{
    font-size: 0.9rem;
    line-height: 1.4;
  }
  .accordion-trigger{
    padding: 10px 12px;
  }
  .accordion-kicker{
    font-size: 0.75rem;
  }
  .accordion-title{
    font-size: 0.95rem;
  }
  .accordion-panel{
    padding: 10px 12px clamp(56px, 12vh, 90px);
    gap: 10px;
    max-height: min(400px, 78vh);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
    min-height: 0;
    scrollbar-width: thin;
  }
  .row-term{
    font-size: 0.9rem;
  }
  .row-desc{
    font-size: 0.88rem;
    line-height: 1.45;
  }
  .privacy-note{
    font-size: 0.88rem;
  }
  .ghost-close{
    font-size: 0.95rem;
    padding: 10px 12px;
  }

  .accordion-item[data-section-id="security"] .accordion-panel{
    padding: 10px 12px clamp(56px, 12vh, 90px);
    max-height: min(400px, 78vh);
  }
  .accordion-item[data-section-id="principles"] .accordion-panel{
    padding: 10px 12px clamp(56px, 12vh, 90px);
    max-height: min(400px, 78vh);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
    min-height: 0;
    scrollbar-gutter: stable;
    scrollbar-width: thin;
  }
  .accordion-item[data-section-id="privacy"] .accordion-panel{
    padding: 10px 12px clamp(56px, 12vh, 90px);
    max-height: min(400px, 78vh);
  }
}
:global(body.modal-open),
:global(html.modal-open){
  overflow: hidden;
  overscroll-behavior: contain;
  touch-action: pan-y;
}
:global(body.modal-open){
  position: fixed;
  width: 100%;
  height: 100%;
}

.privacy-overlay{
  touch-action: pan-y;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.privacy-modal{
  touch-action: pan-y;
}
.privacy-body{
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}

/* Global scrollbar styling */
:global(body){
  scrollbar-color: rgba(255,255,255,.35) rgba(12,18,28,.7);
  scrollbar-width: thin;
}
:global(::-webkit-scrollbar){
  width: 10px;
}
:global(::-webkit-scrollbar-track){
  background: rgba(12,18,28,.7);
  border-radius: 999px;
}
:global(::-webkit-scrollbar-thumb){
  background: linear-gradient(180deg, rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .9), rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .55));
  border-radius: 999px;
  border: 2px solid rgba(12,18,28,.7);
}
.accordion-item[data-section-id="principles"] .accordion-panel::-webkit-scrollbar{
  width: 8px;
}
.accordion-item[data-section-id="principles"] .accordion-panel::-webkit-scrollbar-track{
  background: rgba(12,18,28,.65);
  border-radius: 999px;
}
.accordion-item[data-section-id="principles"] .accordion-panel::-webkit-scrollbar-thumb{
  background: linear-gradient(180deg, rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .9), rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .55));
  border-radius: 999px;
  border: 2px solid rgba(12,18,28,.7);
}
</style>
