<template>
  <div id="SlideGallery">
    <div v-for="(item, index) in localizedInfo" :key="index" class="slide" :class="slideStates[index]" @click="onSlideClick(index)">
      <div class="image" :style="{ backgroundImage: 'url(' + item.image + ')' }"></div>
      <div class="overlay"></div>
      <div class="content">
        <h2 class="title" :data-title="item.city">{{ item.city }}</h2>
        <div class="emblem" :style="{ backgroundImage: 'url(' + item.emblem + ')' }"></div>
        <ul class="city-info">
          <li class="country">{{ currentTexts.country }} {{ item.country }}</li>
          <li class="founded">{{ currentTexts.founded }} {{ item.founded }}</li>
          <li class="population">{{ currentTexts.population }} {{ item.population }}</li>
          <li class="area">{{ currentTexts.area }} {{ item.area }}</li>
          <li class="currency">{{ currentTexts.currency }} {{ item.currency }}</li>
          <li class="conversion">{{ currentTexts.conversion }} {{ item.conversion }}</li>
        </ul>
      </div>
      <div class="btn-close" @click.stop="onClose(index)" v-show="slideStates[index] === 'active'"></div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
const emit = defineEmits(['detail'])
import alanya from '@/assets/Pictures/Gallery/4er/Alanya.jpg'
import schloss from '@/assets/Pictures/Gallery/4er/Schloss_Fürstlich_Drehna.jpg'
import side from '@/assets/Pictures/Gallery/4er/Side.jpg'
import tokyo from '@/assets/Pictures/Gallery/4er/Tokyostore.jpg'
import turkey from '@/assets/Pictures/Gallery/4er/turkey.svg'
import tokyoflagge from '@/assets/Pictures/Gallery/4er/tokyo.svg'
import deutschland from '@/assets/Pictures/Gallery/4er/deutschland.svg'

const language = computed(() => window.location.pathname.startsWith('/en') ? 'en' : 'de')
const currentTexts = computed(() => language.value === 'en' ? {
  country: 'Country:', founded: 'Founded:', population: 'Population:', area: 'Area:', currency: 'Currency:', conversion: 'Conversion:'
} : {
  country: 'Land:', founded: 'Gegründet:', population: 'Einwohner:', area: 'Fläche:', currency: 'Währung:', conversion: 'Wechselkurs:'
})
// Base data (fallbacks). Live data may overwrite some fields when a slide opens
const info = [
  { city: 'Alanya', country: 'Türkei', population: '300.000', founded: '1221 n. Chr.', area: '1500km²', currency: 'Türkische Lira', conversion: '1€ = 41,43 Lira', image: alanya, emblem: turkey },
  { city: 'Drehna', country: 'Deutschland', population: '271', founded: '18. Jahrhundert', area: '20km²', currency: 'Euro', conversion: '1€ = 1€ :)', image: schloss, emblem: deutschland },
  { city: 'Side', country: 'Türkei', population: '15.000', founded: '150 v. Chr.', area: '2300km²', currency: 'Türkische Lira', conversion: '1€ = 41,43 Lira', image: side, emblem: turkey },
  { city: 'Tokyo', country: 'Japan', population: '124 Millionen', founded: '1603 n. Chr.', area: '378.000 km²', currency: 'Japanische Yen', conversion: '1€ = 163,30 Yen', image: tokyo, emblem: tokyoflagge }
]
const localizedInfo = computed(() => {
  if (language.value === 'en') {
    return info.map(item => {
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
  return info
})
const slideStates = ref(info.map(() => 'anim-in'))
// Holds dynamic data fetched per city
const liveData = ref(info.map(() => ({ population: null, conversion: null })))
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
</script>
<style scoped>
#SlideGallery{ display:flex; align-items:center; justify-content:center; height:100vh; width:100vw }
.slide{ position:relative; flex:1; height:100%; overflow:hidden; cursor:pointer; transition:flex .5s ease }
.image{ position:absolute; background:#ccc; background-size:cover; background-position:center; pointer-events:none; transition:transform .6s ease, opacity .3s ease; will-change: transform }
.overlay{ position:absolute; top:0; left:0; height:100%; width:100%; background-image:linear-gradient(rgba(20,20,20,.6), rgba(20,20,20,0)); background-size:100% 200%; opacity:1; pointer-events:none; transition:opacity .3s ease }
.content{ position:absolute; top:0; left:0; height:100%; width:100%; pointer-events:none }
.content .title{ position:absolute; top:10px; left:0; right:0; height:48px; box-sizing:border-box; font-size:1.6em; text-align:center; text-shadow:0 2px 2px #2f2f2f; color:#e5e5e5; opacity:0; transition:opacity .3s ease, transform .3s ease }
.content .title:after{ position:absolute; top:0; left:0; right:0; height:0; display:block; content:attr(data-title); overflow:hidden; color:#fff; transition:height .45s ease }
.content .title:before{ position:absolute; bottom:8px; display:block; content:""; height:2px; width:60%; left:20%; background:white; transform-origin:left; transform:scaleX(0); transition:transform .6s ease }
.content .emblem{ position:absolute; height:160px; width:25%; opacity:0; transform:translateY(100px); transition:opacity .5s ease, transform .5s ease; background-position:center; background-repeat:no-repeat; background-size:contain }
.content .city-info{ position:absolute; bottom:20px; right:20px; padding:16px 16px 16px 80px; font-size:1em; color:white; text-shadow:0 1px 4px #0f0f0f; background-image:linear-gradient(180deg, rgba(20,20,20,.6), rgba(20,20,20,0)); opacity:0; transition:opacity .4s ease, transform .4s ease }
.content .city-info li{ position:relative; margin-bottom:5px; text-align:justify; opacity:0; transform:translateX(-20px); transition:opacity .3s ease, transform .3s ease }
.btn-close{ position:absolute; z-index:100; top:20px; right:20px; height:28px; width:28px; pointer-events:none }
.btn-close:before,.btn-close:after{ position:absolute; top:12px; display:block; content:""; width:100%; height:3px; background-color:white; opacity:0; cursor:pointer; transition:opacity .3s ease, transform .3s ease }
.btn-close:after{ transform:rotate(45deg) translateX(-12px) }
.btn-close:before{ transform:rotate(-45deg) translateX(12px) }
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
.slide.active .overlay{ width:25%; background-size:100% 100%; transition:opacity .3s ease }
.slide.active .content{ position:absolute; top:0; left:0; height:100%; width:100% }
.slide.active .content .title{ opacity:1; transform:translateY(10px) }
.slide.active .content .title:after{ height:100% }
.slide.active .content .title:before{ transform:scaleX(1) }
.slide.active .content .city-info{ opacity:1; transform:translateX(0) }
.slide.active .content .city-info li{ opacity:1; transform:translateX(0) }
.slide.active .content .emblem{ opacity:.8; transform:translateY(80px) }
.slide.active .btn-close{ cursor:pointer; pointer-events:auto }
.slide.active .btn-close:before,.slide.active .btn-close:after{ opacity:1 }
.slide.anim-in .image{ top:0; left:0; height:100%; width:100% }
</style>
