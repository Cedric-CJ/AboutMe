<template>
  <section class="max-w-3xl mx-auto glass-card p-6 text-sm leading-6 text-zinc-200">
    <template v-if="lang==='en'">
      <h1 class="text-white text-2xl font-semibold mb-4">Publisher Information</h1>
      <h2 class="text-white font-medium mt-6 mb-2">Contact</h2>
      <p>
        Cedric Jon Arnhold<br>
        Allee der Kosmonauten 202<br>
        12685 Berlin, Germany<br>
        Tel: <a class="text-ice" href="tel:+4915785550053">+49 1578 5550053</a><br>
        Email: <a class="text-ice" :href="`mailto:${emailAddress}`">{{ emailAddress }}</a>
      </p>
      <h2 class="text-white font-medium mt-6 mb-2">Operator and Domain Owner</h2>
      <p>
        Cedric Jon Arnhold<br>
        Allee der Kosmonauten 202<br>
        12685 Berlin, Germany
      </p>
      <h2 class="text-white font-medium mt-6 mb-2">Hosting</h2>
      <p>This website is hosted by <strong>netcup GmbH</strong>, Daimlerstraße 25, 76185 Karlsruhe, Germany. Server location: <strong>Nuremberg (Germany)</strong>.</p>
      <p>The source code is available on <a class="text-ice" href="https://github.com/Cedric-CJ/AboutMe" target="_blank" rel="noreferrer">GitHub</a>.</p>
      <h2 class="text-white font-medium mt-6 mb-2">Copyright</h2>
      <p>Unless otherwise indicated, the content (texts, images, graphics, styles) is protected by copyright. Copying or use – including excerpts – is only permitted with prior approval. Trademarks and trade names mentioned are subject to the rights of their respective owners.</p>
      <h2 class="text-white font-medium mt-6 mb-2">Disclaimer</h2>
      <p>I have compiled the information with care. I make no guarantee for timeliness, accuracy, completeness or quality. Liability claims are excluded unless intent or gross negligence on my part is proven. I reserve the right to change or remove content without notice.</p>
      <h2 class="text-white font-medium mt-6 mb-2">References and Links</h2>
      <p>For external pages to which I link, the respective operators are solely responsible. At the time I created the links, no illegal content was recognizable to me.</p>
      <p class="mt-6 text-xs text-zinc-400">Last updated: {{ new Date().toLocaleDateString('en-GB') }}</p>
    </template>
    <template v-else>
      <h1 class="text-white text-2xl font-semibold mb-4">Impressum</h1>
      <h2 class="text-white font-medium mt-6 mb-2">Kontakt</h2>
      <p>
        Cedric Jon Arnhold<br>
        Allee der Kosmonauten 202<br>
        12685 Berlin<br>
        Tel: <a class="text-ice" href="tel:+4915785550053">01578 5550053</a><br>
        E-Mail: <a class="text-ice" :href="`mailto:${emailAddress}`">{{ emailAddress }}</a>
      </p>
      <h2 class="text-white font-medium mt-6 mb-2">Betreiber und Domaininhaber</h2>
      <p>
        Cedric Jon Arnhold<br>
        Allee der Kosmonauten 202<br>
        12685 Berlin
      </p>
      <h2 class="text-white font-medium mt-6 mb-2">Hosting</h2>
      <p>Diese Website wird bei der <strong>netcup GmbH</strong>, Daimlerstraße 25, 76185 Karlsruhe, Deutschland, betrieben. Serverstandort: <strong>Nürnberg (Deutschland)</strong>.</p>
      <p>Der Quellcode ist auf <a class="text-ice" href="https://github.com/Cedric-CJ/AboutMe" target="_blank" rel="noreferrer">GitHub</a> verfügbar.</p>
      <h2 class="text-white font-medium mt-6 mb-2">Urheberrecht</h2>
      <p>Falls nicht anders angegeben, unterliegen Inhalte (Texte, Bilder, Grafiken, Styles) dem Urheberrecht. Eine Vervielfältigung oder Verwendung – auch auszugsweise – ist nur nach vorheriger Genehmigung gestattet. Genannte Marken- und Warenzeichen unterliegen den Rechten der jeweiligen Eigentümer.</p>
      <h2 class="text-white font-medium mt-6 mb-2">Haftungsausschluss</h2>
      <p>Ich habe die bereitgestellten Informationen mit Sorgfalt erstellt. Ich übernehme keine Gewähr für Aktualität, Korrektheit, Vollständigkeit oder Qualität. Haftungsansprüche sind ausgeschlossen, sofern kein vorsätzliches oder grob fahrlässiges Verschulden meinerseits vorliegt. Ich behalte mir vor, Inhalte ohne Ankündigung zu ändern oder zu entfernen.</p>
      <h2 class="text-white font-medium mt-6 mb-2">Verweise und Links</h2>
      <p>Für Inhalte externer Seiten, auf die ich verlinke, sind ausschließlich deren Betreiber verantwortlich. Zum Zeitpunkt der Verlinkung waren für mich keine rechtswidrigen Inhalte erkennbar.</p>
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
