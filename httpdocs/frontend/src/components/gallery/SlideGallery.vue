<template>
  <div id="SlideGallery">
    <div v-for="(item, index) in localizedInfo" :key="index" class="slide" :class="slideStates[index]" @click="onSlideClick(index)">
      <div class="image" :style="{ backgroundImage: 'url(' + item.image + ')' }"></div>
      <div class="overlay"></div>
      <div class="content">
        <h2 class="title" :data-title="item.city">{{ item.city }}</h2>
        <div class="emblem" :style="{ backgroundImage: 'url(' + item.emblem + ')' }"></div>
        <div class="city-info" :class="{ 'is-live': liveApplied[index] }">
          <div class="info-head">
            <h3 class="live-title">{{ currentTexts.currentTitle }}</h3>
            <span v-if="liveApplied[index]" class="live-badge">Live</span>
          </div>
          <ul>
            <li class="country-line">
              <img class="flag" :src="item.emblem" alt="flag" />
              <span><strong>{{ currentTexts.country }}</strong> {{ item.country }}</span>
            </li>
            <li class="population"><strong>{{ currentTexts.population }}</strong> {{ item.population }}</li>
            <li class="area"><strong>{{ currentTexts.area }}</strong> {{ item.area }}</li>
            <li class="founded"><strong>{{ currentTexts.founded }}</strong> {{ item.founded }}</li>
            <li class="currency"><strong>{{ currentTexts.currency }}</strong> {{ item.currency }}</li>
            <li class="conversion"><strong>{{ currentTexts.conversion }}</strong> {{ item.conversion }}</li>
            <li v-if="item.density"><strong>{{ currentTexts.density }}</strong> {{ item.density }}</li>
            <li v-if="item.region"><strong>{{ currentTexts.region }}</strong> {{ item.region }}</li>
            <li v-if="item.timezone"><strong>{{ currentTexts.timezone }}</strong> {{ item.timezone }}</li>
            <li v-if="item.coordinates"><strong>{{ currentTexts.coordinates }}</strong> {{ item.coordinates }}</li>
            <li v-if="item.elevation"><strong>{{ currentTexts.elevation }}</strong> {{ item.elevation }}</li>
            <li v-if="item.website"><strong>{{ currentTexts.website }}</strong> <a class="plain-link" :href="item.website" target="_blank" rel="noopener noreferrer">{{ shortUrl(item.website) }}</a></li>
            <li v-if="item.wikipedia"><strong>{{ currentTexts.wikipedia }}</strong> <a class="plain-link" :href="item.wikipedia" target="_blank" rel="noopener noreferrer">{{ shortUrl(item.wikipedia) }}</a></li>
          </ul>
          <div class="info-foot"><small>
            <a v-if="item.qid" :href="`https://www.wikidata.org/wiki/${item.qid}`" target="_blank" rel="noopener noreferrer">{{ language==='en' ? 'Source: Wikidata' : 'Quelle: Wikidata' }}</a>
            <span v-else><a href="https://www.wikidata.org/" target="_blank" rel="noopener noreferrer">{{ language==='en' ? 'Source: Wikidata' : 'Quelle: Wikidata' }}</a></span>
            · <a href="https://www.frankfurter.app" target="_blank" rel="noopener noreferrer">ECB rates</a>
          </small></div>
        </div>
      </div>
      <div class="btn-close" @click.stop="onClose(index)" v-show="slideStates[index] === 'active'"></div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
const emit = defineEmits(['detail'])
import alanya from '@/assets/Pictures/Gallery/Slide/Alanya.jpg'
import schloss from '@/assets/Pictures/Gallery/Slide/Schloss_Fürstlich_Drehna.jpg'
import side from '@/assets/Pictures/Gallery/Slide/Side.jpg'
import tokyo from '@/assets/Pictures/Gallery/Slide/Tokyostore.jpg'
import turkey from '@/assets/Pictures/Gallery/Slide/turkey.svg'
import tokyoflagge from '@/assets/Pictures/Gallery/Slide/tokyo.svg'
import deutschland from '@/assets/Pictures/Gallery/Slide/deutschland.svg'

const language = computed(() => window.location.pathname.startsWith('/en') ? 'en' : 'de')
const currentTexts = computed(() => language.value === 'en' ? {
  currentTitle: 'Current Data',
  country: 'Country:', founded: 'Founded:', population: 'Population:', area: 'Area:', currency: 'Currency:', conversion: 'Exchange rate:',
  density: 'Density:', region: 'Region:', timezone: 'Time zone:', coordinates: 'Coordinates:', elevation: 'Elevation:', website: 'Website:', wikipedia: 'Wikipedia:'
} : {
  currentTitle: 'Aktuelle Daten',
  country: 'Land:', founded: 'Gegründet:', population: 'Einwohner:', area: 'Fläche:', currency: 'Währung:', conversion: 'Wechselkurs:',
  density: 'Bevölkerungsdichte:', region: 'Region:', timezone: 'Zeitzone:', coordinates: 'Koordinaten:', elevation: 'Höhe:', website: 'Webseite:', wikipedia: 'Wikipedia:'
})
// Base data (fallbacks). Live data may overwrite some fields when a slide opens
const info = ref([
  { city: 'Alanya', country: 'Türkei', population: '300.000', founded: '1221 n. Chr.', area: '1500km²', currency: 'Türkische Lira', conversion: '—', image: alanya, emblem: turkey, region: '', timezone: '', coordinates: '', elevation: '', website: '', qid: '', density: '', wikipedia: '' },
  { city: 'Drehna', country: 'Deutschland', population: '271', founded: '18. Jahrhundert', area: '20km²', currency: 'Euro', conversion: '—', image: schloss, emblem: deutschland, region: '', timezone: '', coordinates: '', elevation: '', website: '', qid: '', density: '', wikipedia: '' },
  { city: 'Side', country: 'Türkei', population: '15.000', founded: '150 v. Chr.', area: '2300km²', currency: 'Türkische Lira', conversion: '—', image: side, emblem: turkey, region: '', timezone: '', coordinates: '', elevation: '', website: '', qid: '', density: '', wikipedia: '' },
  { city: 'Tokyo', country: 'Japan', population: '124 Millionen', founded: '1603 n. Chr.', area: '378.000 km²', currency: 'Japanische Yen', conversion: '—', image: tokyo, emblem: tokyoflagge, region: '', timezone: '', coordinates: '', elevation: '', website: '', qid: '', density: '', wikipedia: '' }
])
const localizedInfo = computed(() => {
  if (language.value === 'en') {
    return info.value.map(item => {
      const founded = item.founded.replace('n. Chr.', 'AD').replace('v. Chr.', 'BC')
      let country = item.country
      if (country === 'Türkei') country = 'Turkey'
      if (country === 'Deutschland') country = 'Germany'
      let currency = item.currency
      if (currency === 'Türkische Lira') currency = 'Turkish Lira'
      if (currency === 'Japanische Yen') currency = 'Japanese Yen'
      let conversion = item.conversion.replace(',', '.')
      return { ...item, founded, country, currency, conversion }
    })
  }
  return info.value
})
const slideStates = ref(info.value.map(() => 'anim-in'))
// Holds dynamic data fetched per city
const liveData = ref(info.value.map(() => ({ population: null, conversion: null })))
const liveApplied = ref(info.value.map(() => false))
function onSlideClick(index){
  if (slideStates.value[index] !== 'active' && !slideStates.value.some(s => s === 'active')) {
    slideStates.value[index] = 'active'
    slideStates.value = slideStates.value.map((s,i) => i!==index ? 'anim-out' : s)
    emit('detail', true)
    fetchLiveData(index)
  }
}
function onClose(index){
  slideStates.value[index] = 'last-viewed'
  slideStates.value = slideStates.value.map((s,i) => i!==index ? 'anim-in' : s)
  emit('detail', false)
}

// --- Live data (Wikidata) ---
// Mapping of city to Wikidata Q-ID (expandable)
const wikidataIds = {
  'Tokyo': 'Q1490',
  'Alanya': 'Q171810',
  'Side': 'Q152405',
  'Drehna': 'Q52151453'
}

async function fetchLiveData(index){
  try{
    const city = info.value[index]?.city
    const qid = wikidataIds[city]
    if (!qid) return
    const url = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${qid}&props=claims|labels|sitelinks/urls&format=json&origin=*`
    const res = await fetch(url)
    if (!res.ok) { console.warn('Wikidata fetch failed for', city, qid); return }
    const data = await res.json()
    const entity = data?.entities?.[qid]
    if (!entity) return
    // store qid for source link
    info.value[index].qid = qid

    // Helpers
    const getClaim = (p) => entity?.claims?.[p]?.[0]?.mainsnak?.datavalue?.value
    const formatNumber = (n) => {
      try{ const num = typeof n === 'number' ? n : parseFloat(n); return isFinite(num) ? new Intl.NumberFormat(language.value==='en'?'en':'de').format(num) : null }catch{return null}
    }

    // Population (P1082) - pick most recent
    let pop = null
    const pops = (entity?.claims?.P1082||[]).sort((a,b)=>{
      const ta = a?.qualifiers?.P585?.[0]?.datavalue?.value?.time || ''
      const tb = b?.qualifiers?.P585?.[0]?.datavalue?.value?.time || ''
      return tb.localeCompare(ta)
    })
    if (pops[0]?.mainsnak?.datavalue?.value?.amount){
      pop = pops[0].mainsnak.datavalue.value.amount
    }

    // Area (P2046) square kilometres if unit is Q712226 (square kilometre) or fallback
    let area = null
    const areaClaim = entity?.claims?.P2046?.[0]?.mainsnak?.datavalue?.value
    if (areaClaim?.amount){
      const unit = String(areaClaim?.unit||'')
      const amt = parseFloat(areaClaim.amount)
      if (unit.endsWith('/Q712226')){ // square kilometre
        area = amt
      } else {
        area = amt // leave as-is
      }
    }

    // Inception (P571) -> founded year
    let founded = null
    const inception = entity?.claims?.P571?.[0]?.mainsnak?.datavalue?.value?.time
    if (inception){
      // time format like "+1603-00-00T00:00:00Z"
      const m = String(inception).match(/([0-9]{3,4})/)
      if (m) founded = m[1]
    }

    // Currency (P38) -> label
    let currency = null
    const currId = entity?.claims?.P38?.[0]?.mainsnak?.datavalue?.value?.id
    if (currId){
      const curl = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${currId}&props=labels&format=json&origin=*`
      const cres = await fetch(curl)
      if (cres.ok){
        const cdata = await cres.json()
        const labels = cdata?.entities?.[currId]?.labels
        currency = labels?.[language.value==='en'?'en':'de']?.value || labels?.en?.value || null
      }
    }

    // Region (P131) -> label
    let region = null
    const regId = entity?.claims?.P131?.[0]?.mainsnak?.datavalue?.value?.id
    if (regId){
      const rurl = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${regId}&props=labels&format=json&origin=*`
      const rres = await fetch(rurl)
      if (rres.ok){
        const rdata = await rres.json()
        const rlabels = rdata?.entities?.[regId]?.labels
        region = rlabels?.[language.value==='en'?'en':'de']?.value || rlabels?.en?.value || null
      }
    }

    // Time zone (P421) -> label
    let timezone = null
    const tzId = entity?.claims?.P421?.[0]?.mainsnak?.datavalue?.value?.id
    if (tzId){
      const tzurl = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${tzId}&props=labels&format=json&origin=*`
      const tzres = await fetch(tzurl)
      if (tzres.ok){
        const tzdata = await tzres.json()
        const tzlabels = tzdata?.entities?.[tzId]?.labels
        timezone = tzlabels?.[language.value==='en'?'en':'de']?.value || tzlabels?.en?.value || null
      }
    }

    // Coordinates (P625)
    let coordinates = null
    const coord = getClaim('P625')
    if (coord && typeof coord.latitude === 'number' && typeof coord.longitude === 'number'){
      const nf = new Intl.NumberFormat(language.value==='en'?'en':'de', { maximumFractionDigits: 4 })
      coordinates = `${nf.format(coord.latitude)}, ${nf.format(coord.longitude)}`
    }

    // Elevation (P2044)
    let elevation = null
    const elev = entity?.claims?.P2044?.[0]?.mainsnak?.datavalue?.value
    if (elev?.amount){
      const meters = parseFloat(elev.amount)
      if (isFinite(meters)) elevation = `${Math.round(meters)} m`
    }

    // Website (P856)
    let website = null
    const web = entity?.claims?.P856?.[0]?.mainsnak?.datavalue?.value
    if (typeof web === 'string') website = web

    // Country (P17) -> label
    let countryLabel = null
    const countryId = entity?.claims?.P17?.[0]?.mainsnak?.datavalue?.value?.id
    if (countryId){
      const curlCountry = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${countryId}&props=labels&format=json&origin=*`
      const cresCountry = await fetch(curlCountry)
      if (cresCountry.ok){
        const cdata = await cresCountry.json()
        const clabels = cdata?.entities?.[countryId]?.labels
        countryLabel = clabels?.[language.value==='en'?'en':'de']?.value || clabels?.en?.value || null
      }
    }

    // Wikipedia sitelink
    let wikipedia = null
    const sitelinks = entity?.sitelinks || {}
    const sitePreferred = (language.value==='en' ? 'enwiki' : 'dewiki')
    const mkWikiUrl = (site) => {
      const s = sitelinks?.[site]
      if (!s) return null
      const lang = site.replace('wiki','')
      return `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(s.title)}`
    }
    wikipedia = mkWikiUrl(sitePreferred) || mkWikiUrl('dewiki') || mkWikiUrl('enwiki') || null

    // Apply updates to the visible data
    let applied = false
    if (pop){ info.value[index].population = formatNumber(pop); applied = true }
    if (area){ info.value[index].area = `${formatNumber(area)}km²`; applied = true }
    if (founded){
      info.value[index].founded = language.value==='en' ? `${founded} AD` : `${founded} n. Chr.`
      applied = true
    }
    if (currency){ info.value[index].currency = currency; applied = true }
    if (countryLabel){ info.value[index].country = countryLabel; applied = true }
    if (region){ info.value[index].region = region; applied = true }
    if (timezone){ info.value[index].timezone = timezone; applied = true }
    if (coordinates){ info.value[index].coordinates = coordinates; applied = true }
    if (elevation){ info.value[index].elevation = elevation; applied = true }
    if (website){ info.value[index].website = website; applied = true }
    if (wikipedia){ info.value[index].wikipedia = wikipedia; applied = true }

    // Density (population per km²)
    try{
      const popNum = pop != null ? parseFloat(pop) : NaN
      const areaNum = typeof area === 'number' ? area : NaN
      if (isFinite(popNum) && isFinite(areaNum) && areaNum > 0){
        const d = popNum / areaNum
        const dStr = new Intl.NumberFormat(language.value==='en'?'en':'de', { maximumFractionDigits: 0 }).format(d) + ' / km²'
        info.value[index].density = dStr
        applied = true
      }
    }catch{/* ignore */}
    if (applied) liveApplied.value[index] = true
    // Fetch dynamic exchange rate vs EUR
    await fetchExchangeRate(index)
    console.debug('Wikidata applied for', city, { pop, area, founded, currency })
  }catch{/* ignore */}
}

// Display helper: make long URLs shorter for display while keeping them clickable
function shortUrl(u){
  try{
    const url = new URL(u)
    const host = url.hostname.replace(/^www\./,'')
    const path = url.pathname.replace(/\/$/, '')
    const shown = `${host}${path ? path : ''}`
    return shown.length > 36 ? shown.slice(0,33) + '…' : shown
  }catch{ return u }
}

function currencyCodeFromLabel(label, index){
  const l = String(label||'').toLowerCase()
  const country = String(info.value[index]?.country || '').toLowerCase()
  // Heuristics for TRY
  if (l.includes('turkish') || l.includes('türk') || l.includes('lira') || l.includes('lira') || l.includes('try') || country.includes('türkei') || country.includes('turkey')) return 'TRY'
  // Common others
  if (l.includes('yen') || l.includes('japan')) return 'JPY'
  if (l.includes('euro') || l.includes('eur')) return 'EUR'
  return null
}

async function fetchExchangeRate(index){
  try{
    const label = info.value[index]?.currency
    const code = currencyCodeFromLabel(label, index)
    if (!code) return
    if (code === 'EUR'){ info.value[index].conversion = '1€ = 1€'; return }
    // Try exchangerate.host (ECB) first
    const url1 = `https://api.exchangerate.host/latest?base=EUR&symbols=${code}`
    const res1 = await fetch(url1)
    let rate = null
    if (res1.ok){ const data1 = await res1.json(); rate = data1?.rates?.[code] }
    // Fallback: frankfurter.app (ECB)
    if (!rate){
      const url2 = `https://api.frankfurter.app/latest?from=EUR&to=${code}`
      const res2 = await fetch(url2)
      if (res2.ok){ const data2 = await res2.json(); rate = data2?.rates?.[code] }
    }
    if (rate){
      const formatted = new Intl.NumberFormat(language.value==='en'?'en':'de', { maximumFractionDigits: 2 }).format(rate)
      info.value[index].conversion = `1€ = ${formatted} ${code}`
    } else {
      info.value[index].conversion = language.value==='en' ? 'N/A' : 'k. A.'
    }
  }catch{/* ignore */}
}
</script>
<style scoped>
#SlideGallery{ display:flex; align-items:center; justify-content:center; height:100vh; width:100vw }
.slide{ position:relative; flex:1; height:100%; overflow:hidden; cursor:pointer; transition:flex .5s ease; --overlayW: 32%; }
.image{ position:absolute; top:0; left:0; height:100%; width:100%; background:#ccc; background-size:cover; background-position:center; pointer-events:none; transition:transform .6s ease, opacity .3s ease; will-change: transform }
.overlay{ position:absolute; top:0; left:0; height:100%; width:100%; background-image:linear-gradient(rgba(20,20,20,.6), rgba(20,20,20,0)); background-size:100% 200%; opacity:1; pointer-events:none; transition:opacity .3s ease }
.content{ position:absolute; top:0; left:0; height:100%; width:100%; pointer-events:none }

.content .title{ position:absolute; top:10px; left:0; right:0; height:48px; box-sizing:border-box; font-size:1.6em; text-align:center; text-shadow:0 2px 2px #2f2f2f; color:#e5e5e5; opacity:0; transition:opacity .3s ease, transform .3s ease }
.content .title:after{ position:absolute; top:0; left:0; right:0; height:0; display:block; content:attr(data-title); overflow:hidden; color:#fff; transition:height .45s ease }
.content .title:before{ position:absolute; bottom:8px; display:block; content:""; height:2px; 
  left: var(--overlayW); width: calc(100% - var(--overlayW) - 4%);
  background:white; transform-origin:left; transform:scaleX(0); transition:transform .6s ease }
.content .emblem{ position:absolute; height:160px; width:25%; opacity:0; transform:translateY(100px); transition:opacity .5s ease, transform .5s ease; background-position:center; background-repeat:no-repeat; background-size:contain }
.content .city-info{ position:absolute; top:70px; left:20px; padding:0 16px; font-size:clamp(.9rem, 1.1vw, 1rem); color:white; text-shadow:0 1px 3px rgba(0,0,0,.7);
  min-width: 260px; max-width: min(520px, 32vw);
  max-height: calc(100% - 120px); overflow:auto; line-height: 1.35;
  opacity:0; transition:opacity .4s ease, transform .4s ease; pointer-events:auto }

.content .city-info .info-head{ display:flex; align-items:center; justify-content:space-between; margin-bottom:8px }
.content .city-info .live-title{ margin:0 0 6px 0; font-size:1.1em; font-weight:700; letter-spacing:.2px }
.content .city-info .live-badge{ font-size:.75em; padding:.2em .5em; border-radius:999px; background: rgba(125, 211, 252, .15); color:#7dd3fc; border:1px solid rgba(125,211,252,.35) }
.content .city-info ul{ list-style:none; padding:0; margin:0 }
.content .city-info li{ position:relative; margin:.2rem 0; text-align:left; opacity:0; transform:translateX(-20px); transition:opacity .3s ease, transform .3s ease; overflow-wrap: anywhere }
.content .city-info .country-line{ display:flex; align-items:center; gap:.5rem; margin-top:.15rem }
.content .city-info .country-line .flag{ width:22px; height:22px; object-fit:contain; filter: drop-shadow(0 1px 1px rgba(0,0,0,.4)) }
.content .city-info .plain-link{ color:#fff; text-decoration: underline; pointer-events:auto }

.btn-close{ position:absolute; z-index:100; pointer-events:none;
  /* Responsive sizing and insets */
  --sz: clamp(32px, 5vw, 64px);
  --inset: clamp(20px, 3vw, 40px);
  top: var(--inset); right: var(--inset); height: var(--sz); width: var(--sz);
}
.btn-close:before,.btn-close:after{
  position:absolute; top:50%; left:50%; display:block; content:"";
  width: 74%; height: clamp(3px, .6vw, 6px); background-color:white; border-radius:3px; opacity:0;
  cursor:pointer; transition:opacity .3s ease, transform .3s ease;
}
.btn-close:after{ transform: translate(-50%, -50%) rotate(45deg) }
.btn-close:before{ transform: translate(-50%, -50%) rotate(-45deg) }
.slide:hover:not(.active):not(.anim-out) .image{ transform:scale(1.06) }
.slide:hover:not(.active):not(.anim-out) .overlay{ opacity:.5 }
.slide:hover:not(.active):not(.anim-out) .content .title{ opacity:1; transform:translateY(10px) }
.slide:hover:not(.active):not(.anim-out) .content .title:after{ height:100% }
.slide.last-viewed .content .city-info{ transition-delay:0s }
.slide.last-viewed .content .city-info li:nth-of-type(1){ transition-delay:.05s }
.slide.last-viewed .content .city-info li:nth-of-type(2){ transition-delay:.1s }
.slide.last-viewed .content .city-info li:nth-of-type(3){ transition-delay:.15s }
.slide.last-viewed .content .emblem{ transition-delay:0s }
.slide.active{ cursor:default; flex:4 }
.slide.anim-out{ flex:0 }
.slide.active .overlay{ width: var(--overlayW); background-size:100% 100%; transition:opacity .3s ease }
.slide.active .content{ position:absolute; top:0; left:0; height:100%; width:100% }
.slide.active .content .title{ opacity:1; transform:translateY(10px) }
.slide.active .content .title:after{ height:100% }
.slide.active .content .title:before{ transform:scaleX(1) }
.slide.active .content .city-info{ opacity:1; transform:translateX(0) }
.slide.active .content .city-info li{ opacity:1; transform:translateX(0) }
.slide.active .content .emblem{ opacity:.8; transform:translateY(80px) }
.slide.active .btn-close{ cursor:pointer; pointer-events:auto }
.slide.active .btn-close:before,.slide.active .btn-close:after{ opacity:1 }

/* Mobile adjustments */
@media (max-width: 640px){
  .slide{ --overlayW: 100%; }
  .content .title:before{ left:20%; width:60%; }
  .content .city-info{ left:16px; right:16px; max-width: calc(100% - 32px); }
}

</style>
