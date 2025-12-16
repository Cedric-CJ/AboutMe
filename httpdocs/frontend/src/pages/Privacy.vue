<template>
  <section class="page-auto-contrast space-y-8">
    <div class="glass-card p-6 md:p-8 hero-grid">
      <div class="space-y-3">
        <p class="pill-badge text-xs px-3 py-1">{{ copy.hero.pill }}</p>
        <h1 class="text-white text-3xl font-semibold leading-tight">
          {{ copy.hero.title }}
        </h1>
        <p class="text-zinc-200 max-w-2xl">
          {{ copy.hero.lead }}
        </p>
        <div class="flex flex-wrap gap-2">
          <span v-for="tag in copy.hero.tags" :key="tag" class="chip">{{ tag }}</span>
        </div>
      </div>
      <div class="hero-media">
        <div class="media-frame">
          <div class="media-overlay">
            <p class="text-white font-semibold text-lg">{{ copy.hero.media.title }}</p>
            <p class="text-sm text-zinc-200">{{ copy.hero.media.desc }}</p>
            <ul class="text-xs text-zinc-300 space-y-1 mt-3">
              <li v-for="item in copy.hero.media.list" :key="item">• {{ item }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-4">
      <article
        v-for="(card, idx) in copy.infoCards"
        :key="idx"
        class="spotlight-card p-5 h-full flex flex-col gap-2"
        @mousemove="setSpotlight"
        @touchmove="setSpotlight"
      >
        <p class="text-cyan-200 text-sm font-mono">{{ card.kicker }}</p>
        <h3 class="text-white text-xl font-semibold leading-tight">{{ card.title }}</h3>
        <p class="text-sm text-zinc-200 leading-relaxed whitespace-pre-line">{{ card.body }}</p>
      </article>
    </div>

    <div class="glass-card p-6 md:p-8 space-y-5">
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p class="pill-badge text-xs px-3 py-1">{{ copy.sectionsPill }}</p>
          <h2 class="text-white text-2xl font-semibold mt-2">{{ copy.sectionsTitle }}</h2>
          <p class="text-zinc-300 max-w-3xl">{{ copy.sectionsLead }}</p>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <article
          v-for="(section, idx) in copy.sections"
          :key="idx"
          class="spotlight-card p-5 flex flex-col gap-3"
          @mousemove="setSpotlight"
          @touchmove="setSpotlight"
        >
          <h3 class="text-white text-lg font-semibold leading-tight">{{ section.title }}</h3>
          <p v-for="(p, i) in section.paragraphs" :key="i" class="text-sm text-zinc-200 leading-relaxed">
            {{ p }}
          </p>
          <ul v-if="section.list" class="text-sm text-zinc-200 space-y-1 list-disc pl-4">
            <li v-for="item in section.list" :key="item">{{ item }}</li>
          </ul>
          <div v-if="section.actions" class="flex gap-2 flex-wrap pt-1">
            <a
              v-for="action in section.actions"
              :key="action.label"
              :href="action.href"
              class="glass-btn-secondary px-3 py-2 rounded-md text-sm"
              target="_blank"
              rel="noreferrer"
            >
              {{ action.label }}
            </a>
          </div>
        </article>
      </div>

      <div class="media-note">
        <div>
          <p class="text-white font-semibold">{{ copy.mediaNote.title }}</p>
          <p class="text-sm text-zinc-200">{{ copy.mediaNote.body }}</p>
        </div>
        <div class="badge-list">
          <span v-for="item in copy.mediaNote.badges" :key="item" class="chip">{{ item }}</span>
        </div>
      </div>
    </div>

    <div class="glass-card p-6 md:p-8">
      <div class="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div>
          <h3 class="text-white text-xl font-semibold">{{ copy.meta.title }}</h3>
          <p class="text-zinc-300">{{ copy.meta.desc }}</p>
        </div>
        <p class="text-sm text-zinc-400">{{ copy.meta.updated }} {{ formattedDate }}</p>
      </div>
      <div class="grid sm:grid-cols-2 gap-4">
        <div class="bg-white/5 border border-white/10 rounded-lg p-4">
          <p class="text-white font-semibold">{{ copy.meta.contact.title }}</p>
          <p class="text-sm text-zinc-200 leading-relaxed mt-2">
            Cedric Jon Arnhold<br>
            Allee der Kosmonauten 202<br>
            12685 Berlin, Deutschland
          </p>
          <p class="text-sm text-zinc-200 mt-3">
            {{ copy.meta.contact.phone }}
            <br>
            <a class="text-ice underline" :href="`mailto:${emailAddress}`">{{ emailAddress }}</a>
          </p>
        </div>
        <div class="bg-white/5 border border-white/10 rounded-lg p-4">
          <p class="text-white font-semibold">{{ copy.meta.openSource.title }}</p>
          <p class="text-sm text-zinc-200 leading-relaxed mt-2">{{ copy.meta.openSource.body }}</p>
          <a class="glass-btn px-3 py-2 rounded-md inline-flex mt-3" href="https://github.com/Cedric-CJ/AboutMe/tree/v2" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

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

const emailAddress = computed(() => {
  try {
    const host = String(window.location.hostname || '')
    return host.includes('specialcode.de') ? 'info@specialcode.de' : 'info@spezialcode.de'
  } catch (e) {
    return 'info@spezialcode.de'
  }
})

const formattedDate = computed(() => lang.value === 'en'
  ? new Date().toLocaleDateString('en-GB')
  : new Date().toLocaleDateString('de-DE')
)

const copy = computed(() => lang.value === 'en'
  ? {
      hero: {
        pill: 'Privacy',
        title: 'Privacy-first, zero trackers',
        lead: 'No analytics pixels, no remote fonts, no surprise calls. Hosting and code stay in the EU.',
        tags: ['No cookies', 'EU hosting', 'Self-hosted assets'],
        media: {
          title: 'Data flow',
          desc: 'Only technical access data at the host.',
          list: ['No Google Fonts', 'No trackers', 'No third-party APIs']
        }
      },
      infoCards: [
        { kicker: 'Hosting', title: 'netcup GmbH', body: 'Location: Nuremberg (Germany). Logs: IP, time, request, status, user agent. Retention: usually up to 14 days; longer only for incident response.' },
        { kicker: 'Legal basis', title: 'Art. 6(1)(f) GDPR', body: 'Legitimate interest in secure, stable operation. For contact emails, Art. 6(1)(b) GDPR (pre-contractual steps) may apply.' },
        { kicker: 'Data rights', title: 'Your rights', body: 'If data is ever processed, you can request access, rectification, erasure, restriction, portability or objection. Right now no personal data is collected via this site.' }
      ],
      sectionsPill: 'Policy',
      sectionsTitle: 'What this site does',
      sectionsLead: 'A concise overview of processing, external resources and how to reach out.',
      sections: [
        { title: 'Data collection', paragraphs: ['No personal data is collected via forms or analytics on this site. The only data touched is the technical access data logged by the host for security.'] },
        { title: 'External resources', paragraphs: ['No Google Font API or remote CDNs are called. Libraries are bundled locally.'], list: ['Fonts: system/local', 'Scripts: bundled locally', 'APIs: none from third parties'] },
        { title: 'Emails', paragraphs: ['If you email me, your message is processed to reply. Legal basis: Art. 6(1)(b) GDPR. I keep correspondence only as long as needed.'] },
        { title: 'Security', paragraphs: ['TLS 1.3, HSTS and strict CSP on deploy. No iframes or third-party embeds.'] }
      ],
      mediaNote: {
        title: 'Media & assets',
        body: 'Images and videos are self-hosted; they adapt to screen size. If something fails to load, your blocker might be filtering media.',
        badges: ['Responsive images', 'Self-hosted video', 'No CDN calls']
      },
      meta: {
        title: 'Contact & open source',
        desc: 'Questions about privacy or data access? Reach out any time.',
        updated: 'Last updated:',
        contact: { title: 'Responsible', phone: 'Tel: +49 1578 5550053' },
        openSource: { title: 'Source', body: 'Full source code for this site is available.' }
      }
    }
  : {
      hero: {
        pill: 'Datenschutz',
        title: 'Privacy-first, keine Tracker',
        lead: 'Keine Analytics-Pixel, keine entfernten Fonts, keine Überraschungen. Hosting und Code bleiben in der EU.',
        tags: ['Keine Cookies', 'EU-Hosting', 'Selbst gehostete Assets'],
        media: {
          title: 'Datenfluss',
          desc: 'Nur technische Zugriffsdaten beim Hoster.',
          list: ['Keine Google Fonts', 'Keine Tracker', 'Keine Dritt-APIs']
        }
      },
      infoCards: [
        { kicker: 'Hosting', title: 'netcup GmbH', body: 'Standort: Nürnberg (Deutschland). Logs: IP, Zeit, Request, Status, User Agent. Aufbewahrung: i. d. R. bis 14 Tage; länger nur zur Abwehr von Angriffen.' },
        { kicker: 'Rechtsgrundlage', title: 'Art. 6 Abs. 1 lit. f DSGVO', body: 'Berechtigtes Interesse an sicherem, stabilem Betrieb. Bei Kontakt-E-Mails gilt Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen).' },
        { kicker: 'Ihre Rechte', title: 'Betroffenenrechte', body: 'Bei Datenverarbeitung: Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit oder Widerspruch. Aktuell werden über diese Seite keine personenbezogenen Daten erhoben.' }
      ],
      sectionsPill: 'Richtlinie',
      sectionsTitle: 'Was diese Seite macht',
      sectionsLead: 'Kurzer Überblick zu Verarbeitung, externen Ressourcen und Kontakt.',
      sections: [
        { title: 'Datenerhebung', paragraphs: ['Keine personenbezogenen Daten über Formulare oder Analytics. Es fallen nur technische Zugriffsdaten beim Hoster an (s. oben).'] },
        { title: 'Externe Ressourcen', paragraphs: ['Keine Google Fonts oder entfernten CDNs. Bibliotheken sind lokal gebündelt.'], list: ['Fonts: System/selbst gehostet', 'Scripts: lokal gebündelt', 'APIs: keine Dritte'] },
        { title: 'E-Mails', paragraphs: ['Bei E-Mail-Kontakt werden die Angaben zur Beantwortung verarbeitet. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO. Aufbewahrung nur solange erforderlich.'] },
        { title: 'Sicherheit', paragraphs: ['TLS 1.3, HSTS und strikte CSP beim Deployment. Keine iframes oder Dritt-Embeds.'] }
      ],
      mediaNote: {
        title: 'Medien & Assets',
        body: 'Bilder und Videos sind selbst gehostet und passen sich der Bildschirmgröße an. Falls etwas nicht lädt, blockiert evtl. ein Filter.',
        badges: ['Responsive Bilder', 'Self-hosted Video', 'Keine CDN-Calls']
      },
      meta: {
        title: 'Kontakt & Open Source',
        desc: 'Fragen zum Datenschutz oder zu Auskünften? Melde dich gern.',
        updated: 'Letzte Aktualisierung:',
        contact: { title: 'Verantwortlich', phone: 'Tel: +49 1578 5550053' },
        openSource: { title: 'Quelle', body: 'Der komplette Quellcode der Seite ist offen verfügbar.' }
      }
    }
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
</script>

<style scoped>
.hero-grid{
  display:grid;
  grid-template-columns: repeat(auto-fit, minmax(260px,1fr));
  gap: 20px;
}
.hero-media{
  display:flex;
  justify-content:flex-end;
}
.media-frame{
  position:relative;
  width:100%;
  max-width: 360px;
  aspect-ratio: 4 / 3;
  border-radius: 18px;
  overflow:hidden;
  background: linear-gradient(
    135deg,
    rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .25),
    rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .18)
  );
  border:1px solid rgba(255,255,255,.12);
  box-shadow: 0 16px 50px rgba(0,0,0,.28);
}
.media-overlay{
  position:absolute;
  inset:0;
  padding: 18px;
  background: radial-gradient(circle at 20% 20%, rgba(255,255,255,.05), transparent 45%),
              radial-gradient(circle at 80% 80%, rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .12), transparent 50%),
              rgba(6,10,16,.72);
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
.media-note{
  display:flex;
  gap:18px;
  flex-wrap:wrap;
  align-items:flex-start;
  padding: 14px;
  border-radius: 14px;
  background: rgba(255,255,255,.04);
  border:1px solid rgba(255,255,255,.08);
}
.badge-list{ display:flex; gap:8px; flex-wrap:wrap; }
</style>
