<template>
  <section class="max-w-3xl mx-auto glass-card p-6 text-sm leading-6 text-zinc-200">
    <template v-if="lang==='en'">
      <h1 class="text-white text-2xl font-semibold mb-4">Privacy Policy</h1>
      <p><strong>1. Privacy at a glance</strong></p>
      <p><strong>General information</strong></p>
      <p>Protecting your personal data is important to us. We therefore process your data solely on the basis of GDPR and applicable laws. This privacy policy provides an overview of data processing on our website.</p>
      <p><strong>Data collection on this website</strong></p>
      <p><strong>Who is responsible?</strong></p>
      <p>Data processing on this website is carried out by the website operator. Contact details can be found below under “Information about the responsible party”.</p>
      <p><strong>How do we collect your data?</strong></p>
      <p>We do not collect personal data from visitors. This site operates without cookies or trackers.</p>
      <p><strong>What do we use your data for?</strong></p>
      <p>Since we do not collect any personal data, we do not use data for analytics or other purposes.</p>
      <p><strong>What rights do you have?</strong></p>
      <p>As we do not collect or process personal data ourselves, data subject rights are not applicable. If this changes, we will inform you accordingly.</p>
      <p><strong>2. Hosting</strong></p>
      <p><strong>We host with:</strong></p>
      <p><strong>netcup GmbH</strong></p>
      <p>Hosting provider: netcup GmbH, Daimlerstraße 25, 76185 Karlsruhe, Germany. Server location: Nuremberg (Germany). netcup processes technical access data to provide and secure web hosting.</p>
      <p><strong>Legal basis:</strong> Art. 6(1)(f) GDPR (legitimate interest in secure and reliable operation). For inquiries via email, Art. 6(1)(b) GDPR may apply.</p>
      <p><strong>Server log files (Webhosting 2000):</strong> Logged data may include IP address, date/time, request details, status code, transferred bytes, referrer, and user agent. <em>Retention:</em> usually up to 14 days; temporary storage can occur for attack mitigation.</p>
      <p><strong>3. General notes</strong></p>
      <p><strong>Data protection</strong></p>
      <p>We take data protection seriously. No analytics or marketing cookies/trackers are used. Technical access data (see above) are processed by our hosting provider for operation and security. We do not combine these data with other sources.</p>
      <p>Please note: data transmission on the internet (e.g., via email) can have security gaps.</p>
      <p><strong>Information about the responsible party</strong></p>
      <p>
        Cedric Jon Arnhold<br>
        Allee der Kosmonauten 202<br>
        12685 Berlin, Germany<br>
        Tel: <a href="tel:+4915785550053">+49 1578 5550053</a><br>
        Email: <a :href="`mailto:${emailAddress}`">{{ emailAddress }}</a>
      </p>
      <p><strong>External resources/third-party providers</strong></p>
      <p>This website loads fonts and libraries from external sources (e.g., Google Fonts, jsDelivr, CDNJS, unpkg). Connections to these providers may transmit IP addresses (partly outside the EU). Legal basis: Art. 6(1)(f) GDPR. You can block external sources in your browser or avoid visiting the page. Alternatively, resources could be hosted locally.</p>
      <p><strong>4. Open source notice</strong></p>
      <p>Source code is available on <a href="https://github.com/Cedric-CJ/AboutMe" target="_blank" rel="noreferrer">GitHub</a>.</p>
      <p class="mt-6 text-xs text-zinc-400">Last updated: {{ new Date().toLocaleDateString('en-GB') }}</p>
    </template>

    <template v-else>
      <h1 class="text-white text-2xl font-semibold mb-4">Datenschutzerklärung</h1>
      <p><strong>1. Datenschutz auf einen Blick</strong></p>
      <p><strong>Allgemeine Hinweise</strong></p>
      <p>Der Schutz Ihrer persönlichen Daten ist uns ein besonderes Anliegen. Wir verarbeiten Ihre Daten daher ausschließlich auf Grundlage der gesetzlichen Bestimmungen (DSGVO, TMG). In dieser Datenschutzerklärung informieren wir Sie über die wichtigsten Aspekte der Datenverarbeitung im Rahmen unserer Website.</p>
      <p><strong>Datenerfassung auf dieser Website</strong></p>
      <p><strong>Wer ist verantwortlich?</strong></p>
      <p>Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten finden Sie unten unter „Hinweis zur verantwortlichen Stelle“.</p>
      <p><strong>Wie erfassen wir Ihre Daten?</strong></p>
      <p>Wir erheben keine personenbezogenen Daten. Die Webseite funktioniert ohne Cookies/Tracker.</p>
      <p><strong>Wofür nutzen wir Ihre Daten?</strong></p>
      <p>Da keine personenbezogenen Daten erhoben werden, erfolgt keine Nutzung zu Analyse- oder anderen Zwecken.</p>
      <p><strong>Welche Rechte haben Sie?</strong></p>
      <p>Da wir keine personenbezogenen Daten erheben oder verarbeiten, entfallen die entsprechenden Betroffenenrechte. Sollte sich dies ändern, informieren wir Sie.</p>
      <p><strong>2. Hosting</strong></p>
      <p><strong>Wir hosten bei:</strong></p>
      <p><strong>netcup GmbH</strong></p>
      <p>Hosting-Dienstleister: netcup GmbH, Daimlerstraße 25, 76185 Karlsruhe, Deutschland. Serverstandort: Nürnberg (Deutschland). netcup verarbeitet technische Zugriffsdaten zur Bereitstellung/Sicherheit.</p>
      <p><strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO. Bei Anfragen per E‑Mail kann Art. 6 Abs. 1 lit. b DSGVO einschlägig sein.</p>
      <p><strong>Server-Logfiles:</strong> u. a. IP-Adresse, Datum/Zeit, Request, Statuscode, Bytes, Referrer, User‑Agent. <em>Speicherdauer:</em> i. d. R. bis zu 14 Tage; im Angriffsfall auch vorübergehend länger.</p>
      <p><strong>3. Allgemeine Hinweise</strong></p>
      <p><strong>Datenschutz</strong></p>
      <p>Keine Cookies/Tracker. Technische Zugriffsdaten werden durch den Hoster verarbeitet. Keine Zusammenführung durch uns.</p>
      <p>Hinweis: Die Datenübertragung im Internet (z. B. per E‑Mail) kann Sicherheitslücken aufweisen.</p>
      <p><strong>Hinweis zur verantwortlichen Stelle</strong></p>
      <p>
        Cedric Jon Arnhold<br>
        Allee der Kosmonauten 202<br>
        12685 Berlin<br>
        Tel: <a href="tel:+4915785550053">015785550053</a><br>
        E‑Mail: <a :href="`mailto:${emailAddress}`">{{ emailAddress }}</a>
      </p>
      <p><strong>Externe Ressourcen/Drittanbieter</strong></p>
      <p>Diese Website lädt Schriftarten und Bibliotheken aus externen Quellen (z. B. Google Fonts, jsDelivr, CDNJS, unpkg). Dabei können IP‑Adressen an Anbieter (teils außerhalb der EU) übermittelt werden. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO. Sie können externe Quellen im Browser blockieren oder die Seite nicht aufrufen. Alternativ könnten Ressourcen lokal gehostet werden.</p>
      <p><strong>4. Open Source Hinweis</strong></p>
      <p>Der Quellcode ist auf <a href="https://github.com/Cedric-CJ/AboutMe" target="_blank" rel="noreferrer">GitHub</a> verfügbar.</p>
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
