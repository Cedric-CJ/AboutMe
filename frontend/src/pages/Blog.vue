<template>
  <div class="page-auto-contrast">
    <section class="intro relative">
      <h1 class="page-title text-center">Blog</h1>
    </section>
    <div v-if="isMediaError" class="adblock-warning">
      <p>Es konnten nicht alle Medien geladen werden. Eventuell blockiert ein AdBlocker die Medien.</p>
    </div>
    <div class="blog-container">
      <div v-for="(blog, index) in blogs" :key="index" class="blog-card glass-card">
        <div class="blog-card-head" @click="toggle(index)">
          <div class="head-left">
            <svg class="badge" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="rgba(255,255,255,.12)"/><path d="M8 12l2 2 4-4" fill="none" stroke="#7dd3fc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
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
              <div v-for="(section, sIndex) in blog.sections" :key="sIndex" class="blog-section">
                <template v-if="section.video">
                  <video controls class="blog-video" :class="getImageClass(section.imagePosition)">
                    <source :src="section.videoObjectUrl || section.video" type="video/mp4" />
                    Dein Browser unterstützt keine Video Tags.
                  </video>
                </template>
                <template v-else-if="section.image">
                  <img
                    :src="section.image"
                    :alt="`Blog Bild ${sIndex}`"
                    :class="['blog-img', getImageClass(section.imagePosition), { enlarged: section.isEnlarged }]"
                    @click="toggleImageSize(section)"
                  />
                </template>
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
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'

const blogs = ref([])
const open = ref([])
const isMediaError = ref(false)

function formatContent(content){ return (content || '').replace(/\n/g, '<br>') }
function getImageClass(position){ return position === 'right' ? 'float-top-right' : 'float-top-left' }
function handleMediaError(){ isMediaError.value = true }

function absPublic(path){
  if (!path) return path
  return path.startsWith('./') ? path.slice(1) : path
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
    // Prefer the first sentence from the beginning
    const sentenceEndMatch = first.match(/[.!?](?:\s|$)/)
    if (sentenceEndMatch) {
      const endIdx = first.indexOf(sentenceEndMatch[0]) + sentenceEndMatch[0].length
      // If the sentence is reasonably short, use it; otherwise fall back to slice
      if (endIdx >= 40 && endIdx <= 220) {
        return first.slice(0, endIdx).trim()
      }
    }
    // Fallback: take a clean slice from the start
    return first.slice(0,160).trim()
  }catch{return ''}
}

onMounted(async () => {
  try {
    const res = await fetch('/BlogsDe.json')
    const data = await res.json()
    blogs.value = data.map(b => ({
      ...b,
      sections: (b.sections||[]).map(s => ({
        ...s,
        image: absPublic(s.image),
        video: absPublic(s.video),
        isEnlarged: (s.image || '').includes('AWE_Digitale_Muendigkeit.jpg')
      })),
      summary: makeSummary(b)
    }))
    open.value = data.map(() => false)
    blogs.value.forEach(blog => blog.sections.forEach(fetchVideo))
  } catch (e) { /* ignore */ }
})
function toggle(i){ open.value[i] = !open.value[i] }

// Smooth height transitions for collapsible sections
function onEnter(el){
  el.style.height = '0px'
  el.style.opacity = '0'
  el.style.transform = 'translateY(-4px)'
  requestAnimationFrame(() => {
    el.style.transition = 'height .35s ease, opacity .3s ease, transform .3s ease'
    el.style.height = el.scrollHeight + 'px'
    el.style.opacity = '1'
    el.style.transform = 'translateY(0)'
  })
}
function onAfterEnter(el){
  el.style.height = 'auto'
  el.style.transition = ''
}
function onLeave(el){
  el.style.height = el.scrollHeight + 'px'
  el.style.opacity = '1'
  requestAnimationFrame(() => {
    el.style.transition = 'height .3s ease, opacity .25s ease'
    el.style.height = '0px'
    el.style.opacity = '0'
  })
}
</script>
<style scoped>
.adblock-warning { position: fixed; top: 85vh; left: 10vw; right: 10vw; background-color: #ffdddd; color: #a00; padding: 1rem; border: 1px solid #a00; border-radius: 5px; z-index: 1; text-align:center; font-size:.8rem }
.page-title { color:#fff; font-weight:600; font-size: clamp(1.5rem, 3vw, 2.25rem); text-align:center }
.blog-container { display:flex; flex-direction:column; gap:1rem; padding:0 1rem; margin:1rem auto; color: var(--text-color, #fff); max-width: 980px }
.blog-card { padding: 1rem; }
.blog-card-head { display:flex; align-items:center; justify-content: space-between; gap: 12px }
.head-left{ display:flex; align-items:center; gap:10px }
.badge{ width:24px; height:24px; border-radius:6px; flex:0 0 auto }
.blog-card-body { padding-top: .5rem }
.blog-title { margin-top:0; color:#fff; font-size: clamp(1.1rem, 2.2vw, 1.4rem) }
.blog-date { font-size:.8rem; color:#bfbfbf }
.blog-video { width:100%; max-width:220px; margin:0 .75rem .75rem 0; display:block; border-radius: 8px }
.blog-content { margin:.75rem 0; color:#ddd; text-align:justify; font-size: clamp(.9rem, 1.4vw, 1rem) }
.blog-content a { color:#7dd3fc; text-decoration: underline; }
.blog-content a:hover { color:#b3e5fc; }
.blog-img { cursor: zoom-in; transition: max-width .2s ease, transform .2s ease }
.blog-img.enlarged { cursor: zoom-out; float:none !important; display:block; margin:.5rem auto; max-width: min(100%, 720px); width:100%; transform: translateZ(0) }
.float-top-left { float:left; margin:0 .5rem 0 0; max-width: 220px }
.float-top-right { float:right; margin:0 0 0 .5rem; max-width: 220px }
.blog-section::after { content:""; display:block; clear:both }
.blog-url { font-size:.85rem; color:#7dd3fc; text-decoration:none; padding:.25rem .5rem; border-radius:5px; background:rgba(255,255,255,.05) }
.intro { position:relative; margin-bottom: .5rem }
.blog-summary{ font-size:.9rem; color:#cfd8dc; max-width: 70ch }
.indicator{ display:flex; align-items:center; justify-content:center; width:40px; height:40px; border-radius:10px; background: rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.12); color:#cfeff7 }
.indicator .arr{ width:18px; height:18px; transition: transform .25s ease }
.indicator .arr.rot{ transform: rotate(90deg) }
.is-collapsible{ overflow: hidden }
</style>
