<template>
<section class="page-auto-contrast services-page max-w-6xl mx-auto px-0 pt-10 pb-20 space-y-8">
    <div class="glass-card p-6 md:p-8 hero-grid hero-shell">
      <div class="space-y-4">
        <div class="space-y-2">
          <p class="text-cyan-200 font-mono text-sm pill-title">{{ copy.hero.kicker }}</p>
          <h1 class="text-white text-3xl font-semibold leading-tight">{{ copy.hero.title }}</h1>
          <p class="text-zinc-200 max-w-2xl">{{ copy.hero.desc }}</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <span v-for="tag in copy.hero.tags" :key="tag" class="chip">{{ tag }}</span>
        </div>
        <div class="hero-steps">
          <p class="hero-steps-title">{{ copy.hero.stepsTitle }}</p>
          <ul class="steps-list">
            <li v-for="item in copy.hero.steps" :key="item">
              <span class="step-dot"></span>
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>
        <div class="flex gap-3 flex-wrap pt-1">
          <button class="glass-btn px-4 py-2 rounded-md" @click="openInquiry(highlightService)">
            {{ copy.hero.ctaPrimary }}
          </button>
          <a :href="phoneLink" class="glass-btn-secondary px-4 py-2 rounded-md">
            {{ copy.hero.ctaSecondary }}
          </a>
        </div>
      </div>
      <div class="hero-media">
        <div class="media-frame">
          <div class="media-overlay">
            <img v-if="copy.hero.media.img" :src="copy.hero.media.img" alt="Custom code visual" class="code-hero-img" />
          </div>
        </div>
      </div>
    </div>

    <div class="glass-card p-6 md:p-8 offerings-card">
      <div class="flex items-start justify-between flex-wrap gap-3">
        <div class="space-y-2">
          <p class="pill-badge text-xs px-3 py-1">{{ copy.offerings.kicker }}</p>
          <h2 class="text-white text-2xl font-semibold">{{ copy.offerings.title }}</h2>
          <p class="text-zinc-200 max-w-3xl">{{ copy.offerings.lead }}</p>
        </div>
      </div>
      <div class="offerings-grid mt-6">
        <div
          v-for="service in offerings"
          :key="service.id"
          class="spotlight-card offering-item p-5 md:p-6 flex flex-col gap-4"
          @mousemove="setSpotlight"
          @touchmove="setSpotlight"
        >
          <div class="flex items-start gap-3">
            <div class="dot-badge"></div>
            <div class="space-y-1">
              <p class="text-cyan-200 text-sm font-mono uppercase tracking-wide">{{ service.kicker }}</p>
              <h3 class="text-white text-xl font-semibold leading-tight">{{ service.title }}</h3>
              <p class="text-sm text-zinc-300 leading-relaxed">{{ service.description }}</p>
            </div>
          </div>
          <div>
            <p class="text-xs uppercase tracking-wide text-cyan-100 mb-2">{{ copy.offerings.deliverables }}</p>
            <ul class="offer-list">
              <li v-for="item in service.deliverables" :key="item">
                <span class="step-dot small"></span>
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>
          <div v-if="service.stack?.length" class="flex flex-wrap gap-2">
            <span
              v-for="pill in service.stack"
              :key="pill"
              class="px-2 py-1 rounded-full text-[11px] bg-white/10 border border-white/10 text-zinc-200"
            >
              {{ pill }}
            </span>
          </div>
          <div class="mt-auto flex gap-2 flex-wrap">
            <button class="glass-btn px-3 py-2 rounded-md" @click="openInquiry(service)">
              {{ copy.services.request }}
            </button>
            <a :href="phoneLink" class="glass-btn-secondary px-3 py-2 rounded-md">
              {{ copy.services.callback }}
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="glass-card p-6 md:p-8 packages-shell">
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 class="text-white text-2xl font-semibold mt-2">{{ copy.services.title }}</h2>
        </div>
      </div>

      <div class="secondary-grid mt-5">
        <div
          v-for="service in services.secondary"
          :key="service.id"
          class="package-card p-5 md:p-6 h-full flex flex-col gap-3"
        >
          <div class="flex items-start justify-between gap-3 package-head">
            <div class="space-y-1">
              <p class="text-cyan-200 text-sm font-mono uppercase tracking-wide">{{ service.kicker }}</p>
              <h3 class="text-white text-xl font-semibold leading-tight">{{ service.title }}</h3>
            </div>
            <span class="package-price">{{ service.price }}</span>
          </div>
          <p class="text-sm text-zinc-200 leading-relaxed">{{ service.desc }}</p>
          <ul class="package-list">
            <li v-for="item in service.deliverables" :key="item">
              <span class="step-dot small"></span>
              <span>{{ item }}</span>
            </li>
          </ul>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="pill in service.pills"
              :key="pill"
              class="pill-subtle"
            >
              {{ pill }}
            </span>
          </div>
          <div class="mt-auto flex gap-2 pt-2 package-actions">
            <button class="cta-red" @click="openInquiry(service)">
              {{ copy.services.request }}
            </button>
            <a :href="phoneLink" class="cta-ghost">
              {{ copy.services.callback }}
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="glass-card p-6 md:p-8">
      <div class="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div>
          <h2 class="text-white text-2xl font-semibold">{{ copy.process.title }}</h2>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="(step, idx) in processSteps"
          :key="step.title"
          class="spotlight-card p-4"
          @mousemove="setSpotlight"
          @touchmove="setSpotlight"
        >
          <p class="text-cyan-200 text-sm font-mono">0{{ idx + 1 }}</p>
          <h3 class="text-white font-semibold text-lg">{{ step.title }}</h3>
          <p class="text-sm text-zinc-300 leading-relaxed mt-1">{{ step.desc }}</p>
        </div>
      </div>
    </div>

    <div
      v-if="showInquiryOverlay"
      class="inquiry-overlay fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
    >
      <div class="glass-card glass-modal p-6 md:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <div>
            <p class="text-sm text-cyan-200 font-mono">{{ selectedService?.kicker }}</p>
            <h3 class="text-white text-2xl font-semibold leading-tight">
              {{ selectedService?.title || copy.modal.fallbackTitle }}
            </h3>
          </div>
          <button @click="closeInquiry" class="accent-close-btn" aria-label="Close inquiry">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="bg-white/5 border border-white/10 rounded-lg p-4 mb-4">
          <p class="text-white font-medium">{{ copy.modal.whatsIncluded }}</p>
          <ul class="text-sm text-zinc-200 list-disc pl-5 mt-2 space-y-1">
            <li v-for="item in selectedService?.deliverables || []" :key="item">{{ item }}</li>
          </ul>
        </div>

        <form @submit.prevent="submitInquiry" class="space-y-4">
          <div class="grid md:grid-cols-2 gap-3">
            <div>
              <label class="block text-white text-sm font-medium mb-2">{{ copy.modal.name }}</label>
              <input v-model="inquiry.name" type="text" required class="field" :placeholder="copy.modal.namePh" />
            </div>
            <div>
              <label class="block text-white text-sm font-medium mb-2">{{ copy.modal.email }}</label>
              <input v-model="inquiry.email" type="email" required class="field" :placeholder="copy.modal.emailPh" />
            </div>
          </div>

          <div>
            <label class="block text-white text-sm font-medium mb-2">{{ copy.modal.phone }}</label>
            <input v-model="inquiry.phone" type="tel" class="field" :placeholder="copy.modal.phonePh" />
          </div>

          <div>
            <label class="block text-white text-sm font-medium mb-2">{{ copy.modal.budget }}</label>
            <input v-model="inquiry.budget" type="text" class="field" :placeholder="copy.modal.budgetPh" />
          </div>

          <div>
            <label class="block text-white text-sm font-medium mb-2">{{ copy.modal.message }}</label>
            <textarea
              v-model="inquiry.message"
              required
              rows="8"
              class="field resize-none min-h-[200px]"
              :placeholder="copy.modal.messagePh"
            ></textarea>
          </div>

          <AltchaWidget
            ref="altchaWidget"
            :api-url="CHALLENGE_URL"
            :lang="lang"
            @verified="onAltchaVerified"
            @error="onAltchaError"
          />

          <div v-if="submitError" class="error-message">
            {{ submitError }}
          </div>
          <div v-if="submitSuccess" class="success-message">
            {{ copy.modal.success }}
          </div>

          <div class="flex gap-2">
            <button
              type="submit"
              class="glass-btn px-4 py-2 rounded-md flex-1"
              :disabled="isSubmitting || !altchaVerified"
            >
              {{ isSubmitting ? copy.modal.sending : copy.modal.send }}
            </button>
            <button type="button" @click="closeInquiry" class="glass-btn-secondary px-4 py-2 rounded-md">
              {{ copy.modal.cancel }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <BackendInProzess
      :show="showBackendPopup"
      :form-data="{
        name: inquiry.name,
        email: inquiry.email,
        phone: inquiry.phone,
        subject: emailSubject,
        message: inquiry.message,
        service: selectedService?.title || ''
      }"
      :lang="lang"
      :company-email="lang === 'en' ? 'info@specialcode.de' : 'info@spezialcode.de'"
      @close="showBackendPopup = false"
      @email-opened="onEmailFallbackUsed"
    />
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import AltchaWidget from '@/components/AltchaWidget.vue'
import BackendInProzess from '@/components/BackendInProzess.vue'
import customCodeImage from '@/assets/icons/project-custom.png'

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

const copy = computed(() => lang.value === 'en'
  ? {
      hero: {
        kicker: 'Highlight',
        title: 'Your custom project',
        desc: 'I start by figuring out what you really need and then build it: a site with forms plus the part behind the scenes that stores and processes requests. Clear steps, fixed milestones and a rough budget after a short scoping.',
        tags: ['Clear plan', 'Milestones', 'Quality checks', 'One builder'],
        stepsTitle: 'How it works',
        steps: [
          'We clarify your goal and what "done" means',
          'You get 2-3 simple solution paths (pros and cons)',
          'I build site + backstage system (data, emails, light automation)',
          'Launch, short docs and handoff call — optional care after'
        ],
        ctaPrimary: 'Request',
        ctaSecondary: 'Call me',
        media: { img: customCodeImage }
      },
      offerings: {
        kicker: 'Services',
        title: 'What I deliver',
        lead: 'Pick single services or combine them into your highlight project.',
        deliverables: 'Deliverables'
      },
      services: { pill: 'Offers', title: 'Packages', request: 'Request', callback: 'Call me' },
      process:  { title: 'Process', lead: 'From first call to launch in four clear steps.' },
      modal: {
        fallbackTitle: 'Inquiry',
        whatsIncluded: 'What you get',
        name: 'Name *',
        namePh: 'Your name',
        email: 'Email *',
        emailPh: 'you@email.com',
        phone: 'Phone (optional)',
        phonePh: '+49 1578 5550053',
        budget: 'Budget (optional)',
        budgetPh: 'e.g. 3-8k or TBD',
        message: 'Message *',
        messagePh: 'What do you want to build? Who is it for? Any deadline?',
        send: 'Send inquiry',
        sending: 'Sending...',
        cancel: 'Cancel',
        success: 'Your inquiry was sent successfully!'
      }
    }
  : {
      hero: {
        kicker: 'Highlight',
        title: 'Dein individuelles Projekt',
        desc: 'Ich helfe dir zuerst herauszufinden, was du wirklich brauchst – und setze es dann um: eine Website mit Formularen und dem Teil im Hintergrund, der Anfragen oder Anmeldungen speichert. Du bekommst klare Schritte, feste Meilensteine und nach einem kurzen Scoping eine grobe Kostenspanne.',
        tags: ['Klarer Plan', 'Meilensteine', 'Qualitätschecks', 'Aus einer Hand'],
        stepsTitle: 'So läuft\'s ab',
        steps: [
          'Wir klären dein Ziel und was am Ende "fertig" heißt',
          'Du bekommst 2-3 einfache Lösungswege (mit Vor- und Nachteilen)',
          'Ich baue Website + Hintergrund-System (Daten, E-Mails, einfache Automatik)',
          'Launch, kurze Doku und Übergabe-Call – optional Betreuung danach'
        ],
        ctaPrimary: 'Anfragen',
        ctaSecondary: 'Rückruf',
        media: { img: customCodeImage }
      },
      offerings: {
        kicker: 'Services',
        title: 'Was ich anbiete',
        lead: 'Einzelne Leistungen oder kombiniert als Highlight-Projekt.',
        deliverables: 'Leistungen'
      },
      services: { pill: 'Angebote', title: 'Pakete', request: 'Anfragen', callback: 'Rückruf' },
      process:  { title: 'Ablauf', lead: 'Vom ersten Call bis Launch in vier klaren Schritten.' },
      modal: {
        fallbackTitle: 'Anfrage',
        whatsIncluded: 'Was du bekommst',
        name: 'Name *',
        namePh: 'Dein Name',
        email: 'E-Mail *',
        emailPh: 'du@email.de',
        phone: 'Telefon (optional)',
        phonePh: '+49 1578 5550053',
        budget: 'Budget (optional)',
        budgetPh: 'z. B. 3-8k oder offen',
        message: 'Nachricht *',
        messagePh: 'Was möchtest du bauen? Für wen? Gibt es eine Deadline?',
        send: 'Anfrage senden',
        sending: 'Sende...',
        cancel: 'Abbrechen',
        success: 'Deine Anfrage wurde erfolgreich gesendet!'
      }
    }
)
const offerings = computed(() => lang.value === 'en'
  ? [
      {
        id: 'frontend',
        kicker: 'Frontend',
        title: 'Frontend development',
        description: 'Modern, responsive interfaces built for performance.',
        deliverables: [
          'React, Vue or Next.js frontends',
          'Progressive Web Apps (PWA)',
          'Accessible UI components',
          'Performance optimisation',
          'Responsive design'
        ],
        stack: ['React', 'Vue', 'TypeScript', 'Next.js', 'Vite']
      },
      {
        id: 'backend',
        kicker: 'Backend',
        title: 'Backend development',
        description: 'Scalable server setups with a focus on security.',
        deliverables: [
          'RESTful & GraphQL APIs',
          'Microservices architecture',
          'Authentication & authorization',
          'Rate limiting & security',
          'Caching strategies'
        ],
        stack: ['Node.js', 'Express', 'PostgreSQL', 'Redis', 'Docker']
      },
      {
        id: 'database',
        kicker: 'Data',
        title: 'Databases',
        description: 'Database design, migration and optimisation.',
        deliverables: [
          'Schema design & normalization',
          'Migration management',
          'Query optimisation',
          'Backup strategies',
          'Data encryption at rest'
        ],
        stack: ['PostgreSQL', 'MongoDB', 'Redis', 'Prisma', 'TypeORM']
      },
      {
        id: 'mobile',
        kicker: 'Mobile',
        title: 'Mobile apps',
        description: 'Native-feel experiences on iOS and Android.',
        deliverables: [
          'Cross-platform development',
          'Native module integration',
          'Offline capability',
          'Push notifications',
          'App Store deployment'
        ],
        stack: ['React Native', 'Flutter', 'Expo', 'Firebase', 'Swift']
      },
      {
        id: 'security',
        kicker: 'Security',
        title: 'Security audit',
        description: 'Comprehensive security analysis and penetration testing.',
        deliverables: [
          'Vulnerability assessment',
          'Penetration testing',
          'Code security review',
          'GDPR compliance check',
          'Security best practices'
        ],
        stack: ['OWASP', 'Burp Suite', 'SQLMap', 'Nmap', 'Metasploit']
      },
      {
        id: 'advisory-training',
        kicker: 'Advisory',
        title: 'Consulting & training',
        description: 'Technical consulting and team training.',
        deliverables: [
          'Architecture consulting',
          'Code reviews',
          'Developer training',
          'Best practices workshops',
          'Tech stack evaluation'
        ],
        stack: ['Coaching', 'Workshops', 'Documentation', 'Code review', 'Consulting']
      }
    ]
  : [
      {
        id: 'frontend',
        kicker: 'Frontend',
        title: 'Frontend-Entwicklung',
        description: 'Moderne, responsive Oberflächen mit Fokus auf Performance.',
        deliverables: [
          'React-, Vue- oder Next.js-Frontends',
          'Progressive Web Apps (PWA)',
          'Barrierearme UI-Komponenten',
          'Performance-Optimierung',
          'Responsives Design'
        ],
        stack: ['React', 'Vue', 'TypeScript', 'Next.js', 'Vite']
      },
      {
        id: 'backend',
        kicker: 'Backend',
        title: 'Backend-Entwicklung',
        description: 'Skalierbare Server-Architekturen mit Fokus auf Sicherheit.',
        deliverables: [
          'RESTful- & GraphQL-APIs',
          'Microservices-Architektur',
          'Authentication & Authorization',
          'Rate Limiting & Security',
          'Caching-Strategien'
        ],
        stack: ['Node.js', 'Express', 'PostgreSQL', 'Redis', 'Docker']
      },
      {
        id: 'database',
        kicker: 'Daten',
        title: 'Datenbanken',
        description: 'Datenbank-Design, Migration und Optimierung.',
        deliverables: [
          'Schema-Design & Normalisierung',
          'Migrations-Management',
          'Query-Optimierung',
          'Backup-Strategien',
          'Verschlüsselung von Daten'
        ],
        stack: ['PostgreSQL', 'MongoDB', 'Redis', 'Prisma', 'TypeORM']
      }
    ]
)
const services = computed(() => lang.value === 'en'
  ? {
      secondary: [
        {
          id: 'consulting',
          kicker: 'Consulting',
          title: 'Consulting (fixed price on request)',
          desc: 'A focused 1:1 call so you leave knowing what to build, a rough budget and the next steps.',
          deliverables: [
            '75-90 min video call (goal, audience, content, schedule)',
            'Short recap (decisions + open points)',
            '2-3 solution options (simple / solid / extended) with effort ranges',
            'Checklist for the next 7-14 days',
            '1 follow-up within 5 business days'
          ],
          pills: ['Clarity', 'Options', 'Next steps'],
          price: 'Fixed fee (on request)'
        },
        {
          id: 'frontend-backend',
          kicker: 'Package',
          title: 'Package: Website + system behind it',
          desc: 'A modern website plus a simple system that stores and processes inquiries, leads or signups.',
          deliverables: [
            'Landing page or small site (up to 5 pages) in Vue/React',
            'Mobile-optimised, clear structure, contact/signup forms',
            'Data storage + simple flows (e.g., confirmation email, optional mini admin view)',
            'Launch setup (hosting/domain), simple error tracking, handover video + short docs'
          ],
          pills: ['Website', 'Forms', 'Data', 'Launch-ready'],
          price: 'Price after scoping'
        }
      ]
    }
  : {
      secondary: [
        {
          id: 'consulting',
          kicker: 'Beratung',
          title: 'Beratung (Festpreis auf Anfrage)',
          desc: 'Ein fokussierter 1:1 Call, damit du klar weißt: Was bauen wir? Was kostet es grob? Was sind die nächsten Schritte?',
          deliverables: [
            '75-90 Min. Videocall (Ziel, Zielgruppe, Inhalte, Zeitplan)',
            'Kurzes Recap (Entscheidungen + offene Punkte)',
            '2-3 Lösungsoptionen (einfach / solide / umfangreich) mit Aufwandsspannen',
            'Checkliste für die nächsten 7-14 Tage',
            '1 Rückfrage innerhalb von 5 Werktagen'
          ],
          pills: ['Klarheit', 'Optionen', 'Nächste Schritte'],
          price: 'Festpreis (auf Anfrage)'
        },
        {
          id: 'frontend-backend',
          kicker: 'Paket',
          title: 'Paket: Website + System im Hintergrund',
          desc: 'Eine moderne Website plus ein einfaches System, das Anfragen, Leads oder Anmeldungen speichert und verarbeitet.',
          deliverables: [
            'Landingpage oder kleine Website (bis 5 Seiten) in Vue/React',
            'Mobiloptimiert, klare Struktur, Kontakt-/Signup-Formulare',
            'Datenspeicherung + einfache Abläufe (z. B. Bestätigung per E-Mail, optional Mini-Admin-Ansicht)',
            'Launch-Setup (Hosting/Domain), simples Fehler-Tracking, Übergabe-Video + kurze Doku'
          ],
          pills: ['Website', 'Formulare', 'Daten', 'Launch-ready'],
          price: 'Preis nach Scoping'
        }
      ]
    }
)
const highlightService = computed(() => ({
  id: 'highlight',
  kicker: copy.value.hero.kicker,
  title: copy.value.hero.title,
  desc: copy.value.hero.desc,
  deliverables: copy.value.hero.steps,
  pills: copy.value.hero.tags
}))
const processSteps = computed(() => lang.value === 'en'
  ? [
      { title: '01 Kickoff',         desc: 'Clarify goal, scope, timeline, budget and success criteria.' },
      { title: '02 Scope & Plan',    desc: 'Review current state, refine requirements, set milestones and change rules.' },
      { title: '03 Build & Launch',  desc: 'Short iterations with demos and tests, then launch with safe deploy and monitoring.' },
      { title: '04 Handoff & Care',  desc: 'Docs, handover call, bugfix window - optional further development.' },
    ]
  : [
      { title: '01 Kickoff',             desc: 'Ziel, Rahmen, Zeitplan, Budget und Erfolgskriterien klären.' },
      { title: '02 Scope & Plan',        desc: 'Ist-Stand prüfen, Anforderungen schärfen, Meilensteine + Change-Regeln festlegen.' },
      { title: '03 Umsetzung & Go-Live', desc: 'Kurze Iterationen mit Demos und Tests, danach Launch mit sicherem Deployment & Monitoring.' },
      { title: '04 Übergabe & Betreuung',desc: 'Doku, Übergabe-Call, Bugfix-Fenster - optional Weiterentwicklung.' },
    ]
)
const phoneLink = 'tel:+4915785550053'
const links = computed(() => lang.value === 'en'
  ? { contact: '/contact' }
  : { contact: '/kontakt' }
)

const showInquiryOverlay = ref(false)
const selectedServiceId = ref('')
const inquiry = ref({ name: '', email: '', phone: '', budget: '', message: '' })
const isSubmitting = ref(false)
const submitError = ref('')
const submitSuccess = ref(false)
const altchaWidget = ref(null)
const altchaVerified = ref(false)
const showBackendPopup = ref(false)

const API_URL = (() => {
  const envUrl = import.meta.env?.VITE_INQUIRY_API
  if (envUrl && envUrl.trim() !== '') {
    return envUrl
  }
  if (typeof window !== 'undefined') {
    const origin = window.location.origin ?? ''
    const knownHosts = [
      'https://specialcode.de',
      'https://www.specialcode.de',
      'https://spezialcode.de',
      'https://www.spezialcode.de'
    ]
    if (knownHosts.includes(origin)) {
      return `${origin}/api/submit.php`
    }
    if (/https?:\/\/(localhost|127\.0\.0\.1)/i.test(origin)) {
      return 'http://127.0.0.1:8000/api/submit.php'
    }
  }
  return '/api/submit.php'
})()

const CHALLENGE_URL = (() => {
  if (API_URL.includes('submit.php')) {
    return API_URL.replace('submit.php', 'challenge.php')
  }
  if (API_URL.endsWith('/submit')) {
    return API_URL.slice(0, -('/submit'.length)) + '/challenge/'
  }
  if (API_URL.endsWith('/submit/')) {
    return API_URL.slice(0, -('/submit/'.length)) + '/challenge/'
  }
  return '/api/challenge/'
})()

const BACKEND_ACTIVE = import.meta.env?.VITE_BACKEND_ACTIVE === 'true' || false

const servicesFlat = computed(() => {
  const all = []
  if (highlightService.value) all.push(highlightService.value)
  if (offerings.value?.length) all.push(...offerings.value)
  if (services.value?.secondary) all.push(...services.value.secondary)
  return all
})

const selectedService = computed(() => servicesFlat.value.find(s => s.id === selectedServiceId.value) || servicesFlat.value[0])
const emailSubject = computed(() => {
  const s = selectedService.value
  return lang.value === 'en'
    ? `Inquiry: ${s ? sanitizeTitle(s.title) : 'General inquiry'}`
    : `Anfrage: ${s ? sanitizeTitle(s.title) : 'Allgemeine Anfrage'}`
})

watch(servicesFlat, (list) => {
  if (!list.length) return
  if (!selectedServiceId.value) selectedServiceId.value = list[0].id
}, { immediate: true })

watch(selectedServiceId, () => {
  if (showInquiryOverlay.value) updateInquiryMessage()
})

function openInquiry(service){
  const chosen = service || servicesFlat.value[0] || highlightService.value
  const subject = lang.value === 'en'
    ? `Inquiry: ${sanitizeTitle(chosen?.title || '')}`
    : `Anfrage: ${sanitizeTitle(chosen?.title || '')}`
  const deliverables = (chosen?.deliverables || []).map(d => `- ${d}`).join('\n')
  const intro = lang.value === 'en'
    ? `Hi Cedric,\n\nI'm interested in your package "${sanitizeTitle(chosen?.title || '')}".`
    : `Hi Cedric,\n\nich interessiere mich für dein Paket „${sanitizeTitle(chosen?.title || '')}“.`
  const bundle = deliverables
    ? (lang.value === 'en' ? '\n\nScope:\n' : '\n\nLeistungsumfang:\n') + deliverables
    : ''
  const optional = lang.value === 'en'
    ? '\n\nOptional: budget, timing, target audience or links.'
    : '\n\nOptional: Budget, Timing, Zielgruppe oder Links.'
  const message = `${intro}${bundle}${optional}\n\nDanke!`
  const source = `service:${chosen?.id || sanitizeTitle(chosen?.title || '') || 'service'}`
  try {
    window.dispatchEvent(new CustomEvent('open_contact_overlay', { detail: { subject, message, source } }))
  } catch (e) {
    window.dispatchEvent(new Event('open_contact_overlay'))
  }
}

function closeInquiry(){
  showInquiryOverlay.value = false
  submitError.value = ''
  submitSuccess.value = false
  altchaVerified.value = false
  inquiry.value = { name: '', email: '', phone: '', budget: '', message: '' }
}

function sanitizeTitle(str){
  return String(str || '').replace(/[<>]/g, '')
}

function updateInquiryMessage(force = false){
  const s = selectedService.value
  if (!s) return
  const header = lang.value === 'en' ? 'Hello Cedric,' : 'Hallo Cedric,'
  const marker = lang.value === 'en' ? 'A quick note about my project:' : 'Kurz zu meinem Projekt:'
  const template = lang.value === 'en'
    ? `${header}\n\nI'm interested in "${sanitizeTitle(s.title)}".\n\n${marker}\n-`
    : `${header}\n\nich interessiere mich für "${sanitizeTitle(s.title)}".\n\n${marker}\n-`
  if (force || !inquiry.value.message || inquiry.value.message.startsWith('Hello Cedric') || inquiry.value.message.startsWith('Hallo Cedric')) {
    inquiry.value.message = template
  }
}

function onAltchaVerified() {
  altchaVerified.value = true
  submitError.value = ''
}

function onAltchaError() {
  altchaVerified.value = false
  submitError.value = lang.value === 'en' 
    ? 'Verification failed. Please try again.' 
    : 'Verifizierung fehlgeschlagen. Bitte versuchen Sie es erneut.'
}

async function submitInquiry(){
  submitError.value = ''
  submitSuccess.value = false

  if (!BACKEND_ACTIVE) {
    showBackendPopup.value = true
    return
  }

  if (!altchaWidget.value || !altchaWidget.value.isVerified()) {
    submitError.value = lang.value === 'en'
      ? 'Please complete the verification first.'
      : 'Bitte schließe die Verifizierung zuerst ab.'
    return
  }

  isSubmitting.value = true
  try{
    const altchaPayload = altchaWidget.value.getPayload()
    const budgetNote = inquiry.value.budget ? (lang.value === 'en'
      ? `\n\nBudget (optional): ${inquiry.value.budget}`
      : `\n\nBudget (optional): ${inquiry.value.budget}`) : ''
    const payload = {
      name: inquiry.value.name,
      email: inquiry.value.email,
      phone: inquiry.value.phone,
      subject: emailSubject.value,
      message: `${inquiry.value.message}${budgetNote}`,
      source: 'services',
      service_id: selectedService.value?.id || null,
      altcha: altchaPayload,
      budget: inquiry.value.budget
    }

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const data = await res.json()

    if (!res.ok) {
      if (res.status === 0 || res.status >= 500) {
        showBackendPopup.value = true
        return
      }
      throw new Error(data.error || 'Request failed: ' + res.status)
    }

    submitSuccess.value = true
    setTimeout(() => {
      closeInquiry()
    }, 2800)
  }catch(err){
    if (String(err?.message || '').includes('Failed to fetch') || String(err?.message || '').includes('Network')) {
      showBackendPopup.value = true
      isSubmitting.value = false
      return
    }
    submitError.value = String(err?.message || err || 'Unknown error')
    console.error('Services inquiry failed', err)
  }finally{
    isSubmitting.value = false
  }
}

function onEmailFallbackUsed() {
  setTimeout(() => {
    closeInquiry()
  }, 1000)
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
</script>

<style scoped>
.hero-grid{
  display:grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 20px;
}
.hero-shell{
  background: linear-gradient(150deg, rgba(10,16,26,.92), rgba(14,32,48,.86));
  border: 1px solid rgba(255,255,255,.12);
  box-shadow: 0 24px 70px rgba(0,0,0,.35);
}
.hero-steps{
  margin-top: 6px;
}
.hero-steps-title{
  font-size: 0.85rem;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: #9ad8ff;
  margin-bottom: 6px;
}
.steps-list{
  display:grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 8px 14px;
  padding: 0;
  margin: 0;
  list-style: none;
}
.steps-list li{
  display:flex;
  align-items:flex-start;
  gap: 10px;
  color: #d1d9e2;
}
.step-dot{
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), 1) 0%, rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .35) 70%);
  box-shadow: 0 0 12px rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .45);
  margin-top: 4px;
  flex-shrink: 0;
}
.step-dot.small{
  width: 10px;
  height: 10px;
  margin-top: 6px;
}
.offerings-card{
  background: linear-gradient(150deg, rgba(10,18,26,.9), rgba(16,36,50,.85));
  border: 1px solid rgba(255,255,255,.1);
  box-shadow: 0 20px 60px rgba(0,0,0,.32);
}
.offerings-grid{
  display:grid;
  grid-template-columns: repeat(auto-fit, minmax(260px,1fr));
  gap: 14px;
}
.offering-item{
  min-height: 320px;
}
.dot-badge{
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), 1), rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .2));
  box-shadow: 0 0 16px rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .45);
  flex-shrink: 0;
  margin-top: 4px;
}
.offer-list{
  display:grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px 12px;
  padding: 0;
  margin: 0;
  list-style: none;
}
.offer-list li{
  display:flex;
  align-items:flex-start;
  gap: 10px;
  color:#d7e2ef;
  font-size: 0.95rem;
  line-height: 1.4;
}
.package-card{
  position: relative;
  background: radial-gradient(circle at 20% 20%, rgba(255,255,255,.05), transparent 40%),
              radial-gradient(circle at 80% 10%, rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .14), transparent 45%),
              rgba(5,10,20,.75);
  border:1px solid rgba(255,255,255,.08);
  border-radius: 18px;
  box-shadow: 0 18px 55px rgba(0,0,0,.32);
}
.package-card::after{
  content:"";
  position:absolute;
  inset:0;
  border-radius: inherit;
  pointer-events:none;
  border: 1px solid rgba(255,255,255,.05);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.04);
}
.packages-shell{
  background: linear-gradient(135deg, rgba(8,12,18,.9), rgba(12,26,38,.85));
  border: 1px solid rgba(255,255,255,.08);
  box-shadow: 0 28px 80px rgba(0,0,0,.35);
}
.package-head h3{
  color: #dff6ff;
}
.package-price{
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 12px;
  background: rgba(255,255,255,.08);
  border: 1px solid rgba(255,255,255,.14);
  color: #e7f1ff;
  white-space: nowrap;
}
.package-list{
  list-style:none;
  padding:0;
  margin:0;
  display:grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 8px 12px;
}
.package-list li{
  display:flex;
  gap: 10px;
  color: #d7e2ef;
  font-size: 0.97rem;
  line-height: 1.45;
}
.pill-subtle{
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(255,255,255,.08);
  border: 1px solid rgba(255,255,255,.12);
  color: #e0e8f5;
  font-size: 11px;
}
.package-actions .cta-red,
.package-actions .cta-ghost{
  flex: 1;
  text-align: center;
  border-radius: 12px;
  padding: 10px 14px;
  font-weight: 600;
  border: 1px solid rgba(255,255,255,.15);
}
.cta-red{
  background: linear-gradient(135deg, rgba(255,108,108,.85), rgba(255,73,73,.75));
  color: #0b0f16;
  box-shadow: 0 10px 30px rgba(255,92,92,.35);
}
.cta-ghost{
  background: rgba(255,255,255,.08);
  color: #f6f8fc;
}
.cta-red:hover{ transform: translateY(-1px); }
.cta-ghost:hover{ border-color: rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .5); }
@media (min-width: 900px){
  .hero-grid{
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }
}
.hero-media{
  display:flex;
  justify-content:center;
  align-items:center;
}
.media-frame{
  position:relative;
  width:100%;
  max-width: 260px;
  aspect-ratio: 1 / 1;
  border-radius: 18px;
  overflow:hidden;
  background: linear-gradient(
    135deg,
    rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .45),
    rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .28)
  );
  border:1px solid rgba(255,255,255,.2);
  box-shadow: 0 16px 50px rgba(0,0,0,.24);
}
.services-page .spotlight-card{
  background: linear-gradient(150deg, rgba(10,16,26,.92), rgba(14,32,44,.86));
  border:1px solid rgba(255,255,255,.1);
  box-shadow: 0 18px 55px rgba(0,0,0,.32);
}
.media-overlay{
  position:absolute;
  inset:0;
  padding: 16px;
  display:flex;
  align-items:center;
  justify-content:center;
  background:
    radial-gradient(circle at 20% 20%, rgba(255,255,255,.12), transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .18), transparent 55%),
    linear-gradient(145deg, rgba(20,28,40,.78), rgba(12,24,34,.68));
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
.field{
  width:100%;
  background: rgba(255,255,255,.05);
  border:1px solid rgba(255,255,255,.12);
  color:#fff;
  padding: 10px 12px;
  border-radius: 10px;
  outline:none;
}
.field:focus{
  border-color: rgba(255,255,255,.32);
}
.glass-modal {
  scrollbar-width: none;
}
.glass-modal::-webkit-scrollbar { width: 0; height: 0; }

.error-message{ padding:10px 12px; background: rgba(239,68,68,.1); border:1px solid rgba(239,68,68,.3); border-radius:8px; color:#ef4444; font-size:14px; margin-top:8px }
.success-message{ padding:10px 12px; background: rgba(34,197,94,.1); border:1px solid rgba(34,197,94,.3); border-radius:8px; color:#22c55e; font-size:14px; margin-top:8px }
.secondary-grid{
  display:grid;
  grid-template-columns: repeat(auto-fit,minmax(320px,1fr));
  gap:14px;
}
.primary-package{
  border: 1px solid rgba(255,255,255,.12);
  background: rgba(255,255,255,.04);
}
.accent-close-btn{
  display:flex;
  align-items:center;
  justify-content:center;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: var(--accent-raw, var(--accent-default, #f0c33c));
  color: var(--accent-text, #00111a);
  border: 1px solid rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .65);
  box-shadow: 0 10px 24px rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .35);
  transition: transform .15s ease, box-shadow .2s ease, opacity .2s ease;
}
.accent-close-btn:hover{ transform: translateY(-1px); box-shadow: 0 14px 30px rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .45); }
.accent-close-btn:active{ transform: translateY(0); opacity: .95; }
.code-hero-img{
  width:78%;
  height:78%;
  object-fit: contain;
  display:block;
}
.services-page{
  padding-left: clamp(10px, 3.5vw, 18px);
  padding-right: clamp(10px, 3.5vw, 18px);
  max-width: 100vw;
  overflow-x: hidden;
}
.services-page h1{ font-size: clamp(1.9rem, 4vw, 2.6rem); }
.services-page p{ font-size: clamp(0.95rem, 2.6vw, 1.05rem); }
.services-page .chip{ font-size: clamp(0.82rem, 2.2vw, 0.92rem); }
.services-page .text-xs{ font-size: clamp(0.82rem, 2.1vw, 0.9rem); }
.services-page .text-sm{ font-size: clamp(0.9rem, 2.4vw, 1rem); }
.services-page .text-lg{ font-size: clamp(1.05rem, 2.8vw, 1.25rem); }
.services-page .text-xl{ font-size: clamp(1.2rem, 3vw, 1.4rem); }
.services-page .glass-card{
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}

@media (max-width: 640px){
  .services-page{
    padding-left: clamp(6px, 3vw, 12px);
    padding-right: clamp(6px, 3vw, 12px);
  }
  .secondary-grid{
    grid-template-columns: minmax(0, 1fr);
    gap: 12px;
  }
  .offer-list{
    grid-template-columns: 1fr;
  }
  .package-list{
    grid-template-columns: 1fr;
  }
  .package-card{
    padding: 14px 12px;
    min-height: auto;
  }
  .package-head{
    align-items: flex-start;
  }
  .package-head h3{
    font-size: 1.05rem;
    line-height: 1.25;
  }
  .package-price{
    margin-left: auto;
    font-size: 11px;
    padding: 6px 10px;
  }
  .package-list li{
    font-size: 0.92rem;
    line-height: 1.35;
  }
  .package-actions{
    flex-direction: column;
  }
  .package-actions .cta-red,
  .package-actions .cta-ghost{
    width: 100%;
  }
}
@media (max-width: 1024px){
  .offerings-grid{
    grid-template-columns: 1fr;
  }
}
.inquiry-overlay{
  width:100vw;
  height:100vh;
  inset:0;
}
</style>
