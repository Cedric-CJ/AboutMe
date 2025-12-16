<template>
  <section class="page-auto-contrast space-y-6 page-bottom-gap blog-page">
    <div class="glass-card p-6 md:p-8 hero-grid">
      <div class="space-y-3">
        <p class="pill-badge text-xs px-3 py-1">Blog</p>
        <h1 class="text-white text-3xl font-semibold leading-tight">{{ copy.hero.title }}</h1>
        <p class="text-zinc-200 max-w-3xl">{{ copy.hero.lead }}</p>
        <div class="flex flex-wrap gap-2">
          <span class="chip">{{ copy.hero.badges[0] }}</span>
          <span class="chip">{{ copy.hero.badges[1] }}</span>
        </div>
      </div>
    </div>

    <div v-if="isMediaError" class="warning-card">
      <p>{{ copy.warning }}</p>
    </div>

    <div class="blog-grid">
      <div v-for="(blog, index) in blogs" :key="index" class="spotlight-card p-5">
        <div class="blog-card-head" @click="toggle(index)">
          <div class="head-left">
            <svg :class="['badge', { read: read[index], pop: popIndex === index }]" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="10" fill="rgba(255,255,255,.12)"/>
              <path
                v-if="read[index]"
                d="M8 12l2 2 4-4"
                fill="none"
                stroke="var(--accent-raw, #f0c33c)"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <div>
              <h2 class="blog-title">{{ blog.title }}</h2>
              <p class="blog-date">{{ blog.date }}</p>
              <p v-if="!open[index] && blog.summary" class="blog-summary">{{ blog.summary }}</p>
            </div>
          </div>
          <button class="indicator" aria-label="toggle details">
            <svg viewBox="0 0 24 24" class="arr" :class="{rot: open[index]}"><path d="M8 5l8 7-8 7" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
          </button>
        </div>
        <transition name="expand" @enter="onEnter" @after-enter="onAfterEnter" @leave="onLeave">
          <div v-show="open[index]" class="blog-card-body is-collapsible">
            <div class="blog-content-wrapper">
              <div
                v-for="(section, sIndex) in blog.sections"
                :key="sIndex"
                :class="[
                  'blog-section',
                  { 'has-media': section.video || section.image, 'media-right': section.imagePosition === 'right' }
                ]"
              >
                <div v-if="section.video" class="media-block">
                  <video controls class="media-content" :class="getImageClass(section.imagePosition)">
                    <source :src="section.videoObjectUrl || section.video" type="video/mp4" />
                    {{ copy.videoFallback }}
                  </video>
                </div>
                <div v-else-if="section.image" class="media-block">
                  <img
                    :src="section.image"
                    :alt="`Blog Bild ${sIndex}`"
                    class="media-content"
                    :class="[{ enlarged: section.isEnlarged }, getImageClass(section.imagePosition)]"
                    @click="toggleImageSize(section)"
                  />
                </div>
                <p class="blog-content" v-html="formatContent(section.content)"></p>
              </div>
            </div>
            <div class="blog-urls" v-if="blog.linkText && blog.linkUrl">
              <a :href="blog.linkUrl" target="_blank" rel="noopener noreferrer" class="blog-url">{{ blog.linkText }}</a>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </section>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
// reactive tick to force recompute on preferred_lang change
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

const copy = computed(() => lang.value === 'en'
  ? {
      hero: {
        title: 'Stories, notes and experiments',
        lead: 'Short entries with images or video that adapt to any screen.',
        badges: ['Responsive media', 'Zero trackers'],
        media: {
          title: 'Media handling',
          desc: 'Just a quick intro per post—no ads, no filler.',
          list: ['Images/video scale smoothly', 'Self-hosted files', 'Click to enlarge', 'Video fallback text']
        }
      },
      warning: 'Some media could not be loaded. An ad blocker might be blocking videos.',
      videoFallback: 'Your browser does not support this video.'
    }
  : {
      hero: {
        title: 'Stories, Notizen und Experimente',
        lead: 'Kleine Einträge mit Themen die mich bewegen.',
        badges: ['Responsive Medien', 'Keine Tracker'],
      },
      warning: 'Einige Medien konnten nicht geladen werden. Eventuell blockiert ein AdBlocker die Videos.',
      videoFallback: 'Dein Browser unterstützt keine Videos.'
    }
)

const blogs = ref([])
const open = ref([])
const read = ref([])
const isMediaError = ref(false)
const READ_KEY = 'blog_read_flags'
const popIndex = ref(-1)
let popTimer = null

const MAX_BODY_HEIGHT_PX = 560
const MIN_BODY_HEIGHT_PX = 320

function getBodyMaxHeight(){
  if (typeof window === 'undefined') return MAX_BODY_HEIGHT_PX
  const vhLimit = Math.round((window.innerHeight || 0) * 0.75)
  const safeLimit = Number.isFinite(vhLimit) && vhLimit > 0 ? vhLimit : MAX_BODY_HEIGHT_PX
  return Math.max(MIN_BODY_HEIGHT_PX, Math.min(MAX_BODY_HEIGHT_PX, safeLimit))
}

function setBodyClamp(el, isClamped, maxHeight){
  el.dataset.clamped = isClamped ? '1' : '0'
  el.dataset.maxHeight = String(maxHeight)
  el.style.maxHeight = maxHeight + 'px'
  el.style.overflowY = isClamped ? 'auto' : 'hidden'
}

function formatContent(content){ return (content || '').replace(/\n/g, '<br>') }
function getImageClass(position){ return position === 'right' ? 'align-right' : 'align-left' }
function handleMediaError(){ isMediaError.value = true }

function absPublic(path){
  if (!path) return path
  return path.startsWith('./') ? path.slice(1) : path
}

function loadReadFlags(length){
  try {
    const raw = localStorage.getItem(READ_KEY)
    if (!raw) return Array.from({ length }, () => false)
    const parts = raw.split(',')
    return Array.from({ length }, (_, i) => parts[i] === '1')
  } catch (e) {
    return Array.from({ length }, () => false)
  }
}

function persistReadState(){
  try {
    const payload = (read.value || []).map(v => v ? '1' : '0').join(',')
    localStorage.setItem(READ_KEY, payload)
  } catch (e) { /* ignore */ }
}

function triggerPop(i){
  popIndex.value = i
  if (popTimer) clearTimeout(popTimer)
  popTimer = setTimeout(() => {
    if (popIndex.value === i) popIndex.value = -1
  }, 520)
}

function markRead(i){
  if (!read.value[i]) {
    read.value[i] = true
    persistReadState()
    triggerPop(i)
  }
}

function fetchVideo(section){
  if (!section.video) return
  const v = absPublic(section.video)
  fetch(v).then(r => { if(!r.ok) throw new Error('Video konnte nicht geladen werden'); return r.blob() })
    .then(blob => { section.videoObjectUrl = URL.createObjectURL(blob) })
    .catch(() => handleMediaError())
}

function toggleImageSize(section){
  section.isEnlarged = !section.isEnlarged
}

function makeSummary(b){
  try{
    const first = (b?.sections?.[0]?.content || '').replace(/\n+/g,' ').trim()
    if (!first) return ''
    const sentenceEndMatch = first.match(/[.!?](?:\s|$)/)
    if (sentenceEndMatch) {
      const endIdx = first.indexOf(sentenceEndMatch[0]) + sentenceEndMatch[0].length
      if (endIdx >= 40 && endIdx <= 220) {
        return first.slice(0, endIdx).trim()
      }
    }
    return first.slice(0,160).trim()
  }catch{return ''}
}

async function loadBlogs(){
  try {
    const res = await fetch(lang.value === 'en' ? '/BlogsEng.json' : '/BlogsDe.json')
    const data = await res.json()
    const savedRead = loadReadFlags(data.length)
    blogs.value = data.map(b => ({
      ...b,
      sections: (b.sections||[]).map(s => ({
        ...s,
        image: absPublic(s.image),
        video: absPublic(s.video),
        isEnlarged: false
      })),
      summary: makeSummary(b)
    }))
    read.value = data.map((_, idx) => Boolean(savedRead[idx]))
    persistReadState()
    open.value = data.map(() => false)
    blogs.value.forEach(blog => blog.sections.forEach(fetchVideo))
  } catch (e) { /* ignore */ }
}

function onLangChanged(){ __langTick.value++; loadBlogs() }
onMounted(() => { try { window.addEventListener('preferred_lang_changed', onLangChanged) } catch (e) {} ; loadBlogs() })
onBeforeUnmount(() => {
  try { window.removeEventListener('preferred_lang_changed', onLangChanged) } catch (e) {}
  if (popTimer) clearTimeout(popTimer)
})
function toggle(i){
  const nextState = !open.value[i]
  open.value[i] = nextState
  if (nextState) markRead(i)
}

// Smooth height transitions for collapsible sections
function onEnter(el){
  const maxHeight = getBodyMaxHeight()
  const fullHeight = el.scrollHeight
  const isClamped = fullHeight > maxHeight
  const targetHeight = isClamped ? maxHeight : fullHeight

  setBodyClamp(el, isClamped, maxHeight)

  el.style.height = '0px'
  el.style.opacity = '0'
  el.style.transform = 'translateY(-4px)'
  requestAnimationFrame(() => {
    el.style.transition = 'height .35s ease, opacity .3s ease, transform .3s ease'
    el.style.height = targetHeight + 'px'
    el.style.opacity = '1'
    el.style.transform = 'translateY(0)'
  })
}
function onAfterEnter(el){
  const maxHeight = Number(el.dataset.maxHeight || MAX_BODY_HEIGHT_PX)
  const isClamped = el.dataset.clamped === '1'
  el.style.height = isClamped ? `${maxHeight}px` : 'auto'
  el.style.transition = ''
  el.style.maxHeight = `${maxHeight}px`
  el.style.overflowY = isClamped ? 'auto' : 'hidden'
}
function onLeave(el){
  const maxHeight = Number(el.dataset.maxHeight || MAX_BODY_HEIGHT_PX)
  el.dataset.clamped = '0'
  el.style.maxHeight = `${maxHeight}px`
  el.style.overflowY = 'hidden'
  const currentHeight = el.getBoundingClientRect().height || maxHeight
  el.style.height = `${Math.min(currentHeight, maxHeight)}px`
  el.style.opacity = '1'
  requestAnimationFrame(() => {
    el.style.transition = 'height .3s ease, opacity .25s ease'
    el.style.height = '0px'
    el.style.opacity = '0'
  })
}
</script>
<style scoped>
.hero-grid{
  display:grid;
  grid-template-columns: repeat(auto-fit, minmax(260px,1fr));
  gap: 20px;
}
.blog-page .glass-card,
.blog-page .spotlight-card{
  background: linear-gradient(150deg, rgba(10,16,26,.9), rgba(14,30,44,.85));
  border:1px solid rgba(255,255,255,.1);
  box-shadow: 0 18px 55px rgba(0,0,0,.32);
}
.media-list{
  list-style:none;
  padding:0;
  margin:0;
}
.media-list li{
  display:flex;
  align-items:flex-start;
  gap: 8px;
}
.media-dot{
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), 1) 0%, rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .35) 70%);
  box-shadow: 0 0 10px rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .4);
  margin-top: 6px;
  flex-shrink: 0;
}
.hero-media{
  display:flex;
  justify-content:flex-end;
}
.media-frame{
  position:relative;
  width:100%;
  max-width: 420px;
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
.warning-card{
  border:1px solid rgba(239,68,68,.35);
  background: rgba(239,68,68,.1);
  color: #fecdd3;
  padding: 12px 14px;
  border-radius: 12px;
}
.blog-grid{
  display:grid;
  grid-template-columns: 1fr;
  gap: 10px;
  max-width: 860px;
  margin: 0 auto;
}
:root{
  --dock: clamp(10px, 3.2vw, 44px);
}
.blog-grid .spotlight-card{
  background: rgba(255,255,255,.03);
  border: 1px solid rgba(255,255,255,.06);
  box-shadow: 0 14px 40px rgba(0,0,0,.28);
  position: relative;
}
.blog-section{
  display:grid;
  grid-template-columns: minmax(180px, 260px) minmax(0, 1fr);
  gap: 10px 14px;
  align-items:start;
  margin: 12px 0 14px;
  position: relative;
}
.blog-section + .blog-section{
  margin-top: 6px;
}
.blog-section.media-right{
  grid-template-columns: minmax(0, 1fr) minmax(180px, 260px);
}
.blog-section.media-right .media-block{ order: 2; }
.blog-section.media-right .blog-content{ order: 1; }
.blog-section.media-right + .blog-section:not(.media-right) .media-block,
.blog-section:not(.media-right) + .blog-section.media-right .media-block{
  margin-top: calc(-1 * var(--dock));
  position: relative;
  z-index: 2;
}
.blog-card-head { display:flex; align-items:center; justify-content: space-between; gap: 12px; cursor:pointer }
.head-left{ display:flex; align-items:center; gap:10px }
.badge{ width:24px; height:24px; border-radius:6px; flex:0 0 auto }
.blog-card-body { padding-top: .35rem; max-height: clamp(320px, 70vh, 560px); overflow: hidden; position: relative; }
.blog-content-wrapper{ display:grid; gap: 12px; }
.blog-title { margin-top:0; color:#f7fbff; font-size: clamp(1.05rem, 2vw, 1.35rem); letter-spacing: .02em; }
.blog-date { font-size:.85rem; color:#b7c9d8; position: relative; padding-left: 18px; }
.blog-date::before{
  content:"";
  position:absolute;
  left: 0;
  top: 50%;
  width: 10px;
  height: 2px;
  border-radius: 999px;
  background: rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .9);
  transform: translateY(-50%);
}
.blog-content { margin:.75rem 0; color:#ddd; text-align:left; font-size: clamp(.92rem, 1.4vw, 1.02rem) }
.blog-content a { color: var(--accent-raw, var(--accent-default, #f0c33c)); text-decoration: underline; text-decoration-color: currentColor; }
.blog-content a:hover { opacity: .9; }
.blog-summary{ font-size: clamp(.9rem, 1.3vw, .98rem); color:#cfd8dc; max-width: 70ch }
.indicator{ display:flex; align-items:center; justify-content:center; width:40px; height:40px; border-radius:10px; background: rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.12); color:#cfeff7 }
.indicator .arr{ width:18px; height:18px; transition: transform .25s ease }
.indicator .arr.rot{ transform: rotate(90deg) }
.is-collapsible{ overflow: hidden }
.media-block{
  width: 100%;
  max-width: 260px;
  margin: 0;
}
.media-content{
  width:100%;
  height: auto;
  max-height: 260px;
  object-fit: cover;
  border-radius: 16px;
  box-shadow: 0 10px 28px rgba(0,0,0,.26);
  display:block;
}
.media-content.enlarged{
  max-height: none;
}
.blog-section .blog-content{
  margin: 0;
  text-align: left;
}
.blog-section .media-block{
  margin: 0;
}
.blog-url { font-size:.9rem; color: var(--accent-raw, var(--accent-default, #f0c33c)); text-decoration:none; padding:.35rem .6rem; border-radius:8px; background:rgba(255,255,255,.05) }
.blog-urls{ margin-top: 8px }
.expand-enter-active, .expand-leave-active { transition: all .25s ease }
.expand-enter-from, .expand-leave-to { opacity:0; transform: translateY(-4px) }
.badge{
  width:24px;
  height:24px;
  border-radius:6px;
  flex:0 0 auto;
  opacity:.45;
  transition: opacity .2s ease;
  position: relative;
  overflow: visible;
}
.badge.read{
  opacity:1;
}
.badge.read circle{
  fill: rgba(255,255,255,.16);
}
.badge.pop::after{
  content:"";
  position:absolute;
  inset:-6px;
  border-radius:50%;
  border:2px solid rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .65);
  animation: badge-pop 0.52s ease-out forwards;
  pointer-events:none;
}
.badge.pop::before{
  content:"";
  position:absolute;
  inset:0;
  border-radius:50%;
  background: radial-gradient(circle, rgba(var(--accent-rgb, var(--accent-rgb-default, 240,195,60)), .32), transparent 70%);
  animation: badge-pop-inner 0.42s ease-out forwards;
  pointer-events:none;
}
@keyframes badge-pop{
  0%{ transform: scale(.55); opacity:.9; }
  60%{ transform: scale(1.25); opacity:.6; }
  100%{ transform: scale(1.9); opacity:0; }
}
@keyframes badge-pop-inner{
  0%{ transform: scale(.8); opacity:.75; }
  80%{ transform: scale(1.2); opacity:.45; }
  100%{ transform: scale(1.4); opacity:0; }
}
@media (max-width: 720px){
  .blog-grid{ gap:10px }
  .blog-title{ font-size: clamp(1rem, 4vw, 1.18rem); }
  .blog-content{ font-size: clamp(.9rem, 3.8vw, .98rem); }
  .blog-content,
  .blog-section .blog-content{
    text-align: justify;
    text-justify: inter-word;
    hyphens: auto;
    line-height: 1.58;
    text-wrap: pretty;
  }
  .media-content{ max-height: clamp(200px, 70vw, 320px); }
  .blog-section{
    display:flex;
    flex-direction: column;
    gap: 8px;
  }
  .blog-section.media-right{ grid-template-columns: 1fr; }
  .media-block{ max-width: 100%; }
  .blog-section + .blog-section{
    margin-top: 8px;
  }
  :root{ --dock: clamp(6px, 2.2vw, 18px); }
}
</style>
