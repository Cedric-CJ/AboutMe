<template>
  <section class="max-w-3xl mx-auto glass-card p-6 text-sm leading-6 text-zinc-200">
    <template v-if="lang==='en'">
      <h1 class="text-white text-2xl font-semibold mb-4">Privacy Policy</h1>
      <h2 class="text-white font-medium mt-6 mb-2">1. Privacy at a glance</h2>
      <h2 class="text-white font-medium mt-6 mb-2">General information</h2>
      <p>Protecting your personal data is important to me. I therefore process your data solely on the basis of GDPR and applicable laws. This privacy policy provides an overview of data processing on my website.</p>
      <h2 class="text-white font-medium mt-6 mb-2">Data collection on this website</h2>
      <h2 class="text-white font-medium mt-6 mb-2">Who is responsible?</h2>
      <p>Data processing on this website is carried out by the website operator. Contact details can be found below under “Information about the responsible party”.</p>
      <h2 class="text-white font-medium mt-6 mb-2">How do I collect your data?</h2>
      <p>I do not collect personal data from visitors. This site operates without cookies or trackers.</p>
      <h2 class="text-white font-medium mt-6 mb-2">What do I use your data for?</h2>
      <p>Since I do not collect any personal data, I do not use data for analytics or other purposes.</p>
      <h2 class="text-white font-medium mt-6 mb-2">What rights do you have?</h2>
      <p>As I do not collect or process personal data myself, data subject rights are not applicable. If this changes, I will inform you accordingly.</p>
      <h2 class="text-white font-medium mt-6 mb-2">2. Hosting</h2>
      <p><strong>I host with:</strong></p>
      <p><strong>netcup GmbH</strong></p>
      <p>Hosting provider: netcup GmbH, Daimlerstraße 25, 76185 Karlsruhe, Germany. Server location: Nuremberg (Germany). netcup processes technical access data to provide and secure web hosting.</p>
      <p><strong>Legal basis:</strong> Art. 6(1)(f) GDPR (legitimate interest in secure and reliable operation). For inquiries via email, Art. 6(1)(b) GDPR may apply.</p>
      <p><strong>Server log files (Webhosting 2000):</strong> Logged data may include IP address, date/time, request details, status code, transferred bytes, referrer, and user agent. <em>Retention:</em> usually up to 14 days; temporary storage can occur for attack mitigation.</p>
      <h2 class="text-white font-medium mt-6 mb-2">3. General notes</h2>
      <h2 class="text-white font-medium mt-6 mb-2">Data protection</h2>
      <p>I take data protection seriously. No analytics or marketing cookies/trackers are used. Technical access data (see above) are processed by my hosting provider for operation and security. I do not combine these data with other sources.</p>
      <p>Please note: data transmission on the internet (e.g., via email) can have security gaps.</p>
      <h2 class="text-white font-medium mt-6 mb-2">Information about the responsible party</h2>
      <p>
        Cedric Jon Arnhold<br>
        Allee der Kosmonauten 202<br>
        12685 Berlin, Germany<br>
        Tel: <a class="text-ice" href="tel:+4915785550053">+49 1578 5550053</a><br>
        Email: <a class="text-ice" :href="`mailto:${emailAddress}`">{{ emailAddress }}</a>
      </p>
      <h2 class="text-white font-medium mt-6 mb-2">External resources/third-party providers</h2>
      <p>This website loads fonts and libraries from external sources (e.g., Google Fonts, jsDelivr, CDNJS, unpkg). Connections to these providers may transmit IP addresses (partly outside the EU). Legal basis: Art. 6(1)(f) GDPR. You can block external sources in your browser or avoid visiting the page. Alternatively, resources could be hosted locally.</p>
      <h2 class="text-white font-medium mt-6 mb-2">4. Open source notice</h2>
      <p>Source code is available on <a class="text-ice" href="https://github.com/Cedric-CJ/AboutMe" target="_blank" rel="noreferrer">GitHub</a>.</p>
      <p class="mt-6 text-xs text-zinc-400">Last updated: {{ new Date().toLocaleDateString('en-GB') }}</p>
    </template>

    <template v-else>
      <h1 class="text-white text-2xl font-semibold mb-4">Datenschutzerklärung</h1>
      <h2 class="text-white font-medium mt-6 mb-2">1. Datenschutz auf einen Blick</h2>
      <h2 class="text-white font-medium mt-6 mb-2">Allgemeine Hinweise</h2>
      <p>Der Schutz Ihrer persönlichen Daten ist mir ein besonderes Anliegen. Ich verarbeite Ihre Daten daher ausschließlich auf Grundlage der gesetzlichen Bestimmungen (DSGVO, TMG). In dieser Datenschutzerklärung informiere ich Sie über die wichtigsten Aspekte der Datenverarbeitung im Rahmen meiner Website.</p>
      <h2 class="text-white font-medium mt-6 mb-2">Datenerfassung auf dieser Website</h2>
      <h2 class="text-white font-medium mt-6 mb-2">Wer ist verantwortlich?</h2>
      <p>Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten finden Sie unten unter „Hinweis zur verantwortlichen Stelle“.</p>
      <h2 class="text-white font-medium mt-6 mb-2">Wie erfasse ich Ihre Daten?</h2>
      <p>Ich erhebe keine personenbezogenen Daten. Die Webseite funktioniert ohne Cookies/Tracker.</p>
      <h2 class="text-white font-medium mt-6 mb-2">Wofür nutze ich Ihre Daten?</h2>
      <p>Da ich keine personenbezogenen Daten erhebe, erfolgt keine Nutzung zu Analyse- oder anderen Zwecken.</p>
      <h2 class="text-white font-medium mt-6 mb-2">Welche Rechte haben Sie?</h2>
      <p>Da ich keine personenbezogenen Daten erhebe oder verarbeite, entfallen die entsprechenden Betroffenenrechte. Sollte sich dies ändern, informiere ich Sie.</p>
      <h2 class="text-white font-medium mt-6 mb-2">2. Hosting</h2>
      <p><strong>Ich hoste bei:</strong></p>
      <p><strong>netcup GmbH</strong></p>
      <p>Hosting-Dienstleister: netcup GmbH, Daimlerstraße 25, 76185 Karlsruhe, Deutschland. Serverstandort: Nürnberg (Deutschland). netcup verarbeitet technische Zugriffsdaten zur Bereitstellung/Sicherheit.</p>
      <p><strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO. Bei Anfragen per E‑Mail kann Art. 6 Abs. 1 lit. b DSGVO einschlägig sein.</p>
      <p><strong>Server-Logfiles:</strong> u. a. IP-Adresse, Datum/Zeit, Request, Statuscode, Bytes, Referrer, User‑Agent. <em>Speicherdauer:</em> i. d. R. bis zu 14 Tage; im Angriffsfall auch vorübergehend länger.</p>
      <h2 class="text-white font-medium mt-6 mb-2">3. Allgemeine Hinweise</h2>
      <h2 class="text-white font-medium mt-6 mb-2">Datenschutz</h2>
      <p>Keine Cookies/Tracker. Technische Zugriffsdaten werden durch den Hoster verarbeitet. Keine Zusammenführung durch mich.</p>
      <p>Hinweis: Die Datenübertragung im Internet (z. B. per E‑Mail) kann Sicherheitslücken aufweisen.</p>
      <h2 class="text-white font-medium mt-6 mb-2">Hinweis zur verantwortlichen Stelle</h2>
      <p>
        Cedric Jon Arnhold<br>
        Allee der Kosmonauten 202<br>
        12685 Berlin<br>
        Tel: <a class="text-ice" href="tel:+4915785550053">01578 5550053</a><br>
        E‑Mail: <a class="text-ice" :href="`mailto:${emailAddress}`">{{ emailAddress }}</a>
      </p>
      <h2 class="text-white font-medium mt-6 mb-2">Externe Ressourcen/Drittanbieter</h2>
      <p>Diese Website lädt Schriftarten und Bibliotheken aus externen Quellen (z. B. Google Fonts, jsDelivr, CDNJS, unpkg). Dabei können IP‑Adressen an Anbieter (teils außerhalb der EU) übermittelt werden. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO. Sie können externe Quellen im Browser blockieren oder die Seite nicht aufrufen. Alternativ könnten Ressourcen lokal gehostet werden.</p>
      <h2 class="text-white font-medium mt-6 mb-2">4. Open Source Hinweis</h2>
      <p>Der Quellcode ist auf <a class="text-ice" href="https://github.com/Cedric-CJ/AboutMe" target="_blank" rel="noreferrer">GitHub</a> verfügbar.</p>
      <p class="mt-6 text-xs text-zinc-400">Letzte Aktualisierung: {{ new Date().toLocaleDateString('de-DE') }}</p>
    </template>
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

// Determine site-specific email based on domain
const emailAddress = computed(() => {
  try {
    const host = String(window.location.hostname || '')
    return host.includes('specialcode.de') ? 'info@specialcode.de' : 'info@spezialcode.de'
  } catch (e) {
    return 'info@spezialcode.de'
  }
})
</script>
