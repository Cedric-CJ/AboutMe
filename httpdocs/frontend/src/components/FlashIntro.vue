<template>
  <transition name="flash-intro" @after-leave="$emit('complete')">
    <div v-if="show" class="flash-intro">
      <!-- WebGL storm background (Three.js) -->
      <div ref="threeMount" class="three-bg" aria-hidden="true"></div>

      <!-- Screen-space fog flicker canvas (between 3D fog and text) -->
      <canvas ref="fogCanvas" class="fog-canvas" aria-hidden="true"></canvas>

      <!-- 2D canvas overlay for diagonal text + lightning reveal -->
      <canvas ref="textCanvas" class="text-canvas" aria-hidden="true"></canvas>

      <!-- Text (single line, responsive) -->
      <div class="flash-text" aria-hidden="true">
        <span class="word" :style="`animation-delay: 0s`">{{ lineStr }}</span>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, computed, watch } from 'vue'
import { useRoute } from 'vue-router'

const show = ref(true)
const route = useRoute()
const lineStr = ref('Mit KI die IT-Welt neu definieren')
function updateIntroText() {
  const n = String(route.name || '')
  if (n.startsWith('en-')) {
    lineStr.value = 'Redefining IT with AI'
  } else {
    lineStr.value = 'Mit KI die IT-Welt neu definieren'
  }
}
updateIntroText()
watch(() => route.name, updateIntroText)

// Refs for mounts
const threeMount = ref(null)
const fogCanvas = ref(null)
const textCanvas = ref(null)

// Accent color from CSS variable
function getAccent() {
  const v = getComputedStyle(document.documentElement).getPropertyValue('--accent-raw').trim()
  return v || '#7dd3fc'
}

// --- Three.js Storm Background (loaded via dynamic script) ---
let threeCleanup = null
async function initThreeStorm() {
  const mountEl = threeMount.value
  if (!mountEl) return

  // Load three.js from CDN if not present
  if (!window.THREE) {
    await new Promise((resolve, reject) => {
      const s = document.createElement('script')
      s.src = 'https://unpkg.com/three@0.158.0/build/three.min.js'
      s.async = true
      s.onload = resolve
      s.onerror = reject
      document.head.appendChild(s)
    })
  }

  function drawFogLayer() {
    if (!fctx) return
    fctx.clearRect(0, 0, W, H)
    fctx.save()
    fctx.globalCompositeOperation = 'lighter'
    for (let i = fogPuffs.length - 1; i >= 0; i--) {
      const p = fogPuffs[i]
      // local flicker similar to flash.power spikes
      let pulse = 1
      if (Math.random() > 0.93) pulse = 1.8
      const lifeT = Math.max(0, Math.min(1, p.life / 100))
      const alpha = 0.06 + lifeT * 0.25 * pulse
      const radius = p.r * (1 + (1 - lifeT) * 0.6 * pulse)
      const g = fctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius)
      g.addColorStop(0, `rgba(255,255,255,${alpha})`)
      g.addColorStop(1, 'rgba(255,255,255,0)')
      fctx.fillStyle = g
      fctx.beginPath()
      fctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
      fctx.fill()
      // decay
      p.life -= 3 + Math.random() * 2
      if (p.life <= 0) fogPuffs.splice(i, 1)
    }
    fctx.restore()
  }

  const THREE = window.THREE
  let scene, camera, renderer, ambient, directionalLight, flash
  let cloudParticles = []
  let cloudMaterialRef = null
  let reqId

  // Fog + Text canvas state
  const tCanvas = textCanvas.value
  const tctx = tCanvas.getContext ? tCanvas.getContext('2d') : null
  const fCanvas = fogCanvas.value
  const fctx = fCanvas.getContext ? fCanvas.getContext('2d') : null
  let W = 0, H = 0
  const getTEXT = () => lineStr.value
  let ROT = -20 * Math.PI / 180 // diagonal rotation in radians (adaptive)
  let COS = Math.cos(ROT)
  let SIN = Math.sin(ROT)
  let startTime = 0
  let finished = false
  let off = document.createElement('canvas')
  let offCtx = off.getContext('2d')
  let textBounds = { w: 0, h: 0, x: 0, y: 0, fontSize: 48 }

  // Thunder strokes
  const thunderLines = []
  const fogPuffs = []
  class Thunder {
    constructor(x, y, color) {
      this.color = color
      this.life = 220
      this.path = [{ x, y }]
      this.xRange = 18
      this.yRange = 28
      this.lineWidth = 1.5 + Math.random() * 1.5
    }
    step() {
      const last = this.path[this.path.length - 1]
      this.path.push({
        x: last.x + (Math.random() * this.xRange - this.xRange / 2),
        y: last.y + (Math.random() * this.yRange)
      })
      this.life -= 10 + Math.random() * 10
      return this.life > 0
    }
    draw(ctx) {
      ctx.save()
      ctx.globalAlpha = Math.max(0, Math.min(1, this.life / 220)) * 0.85
      ctx.strokeStyle = this.color
      ctx.lineWidth = this.lineWidth
      ctx.shadowBlur = 16
      ctx.shadowColor = this.color
      ctx.beginPath()
      ctx.moveTo(this.path[0].x, this.path[0].y)
      for (let i = 1; i < this.path.length; i++) ctx.lineTo(this.path[i].x, this.path[i].y)
      ctx.stroke()
      ctx.restore()
    }
  }

  function size() {
    const rect = mountEl.getBoundingClientRect()
    return { w: Math.max(1, rect.width), h: Math.max(1, rect.height) }
  }

  function getAccent() {
    const v = getComputedStyle(document.documentElement).getPropertyValue('--accent-raw').trim()
    return v || '#7dd3fc'
  }

  function computeRotation() {
    // Adapt angle based on aspect ratio: wider screens -> steeper angle
    const aspect = W / Math.max(1, H)
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
    const t = clamp((aspect - 0.6) / (1.8 - 0.6), 0, 1) // map ~0.6..1.8
    const deg = (-10) + (-(28) - (-10)) * t // from -10 to -28
    ROT = deg * Math.PI / 180
    COS = Math.cos(ROT)
    SIN = Math.sin(ROT)
  }

  function resizeTextCanvas() {
    if (!tctx || !fctx) return
    const { w, h } = size()
    W = w; H = h
    computeRotation()
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    // fog canvas
    fCanvas.width = Math.floor(w * dpr)
    fCanvas.height = Math.floor(h * dpr)
    fCanvas.style.width = w + 'px'
    fCanvas.style.height = h + 'px'
    fctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    // text canvas
    tCanvas.width = Math.floor(w * dpr)
    tCanvas.height = Math.floor(h * dpr)
    tCanvas.style.width = w + 'px'
    tCanvas.style.height = h + 'px'
    tctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    setupText()
  }

  function setupText() {
    if (!tctx) return
    // Fit rotated text into viewport with margins
    const margin = 0.08 // 8% margins
    const maxW = W * (1 - margin * 2)
    const maxH = H * (1 - margin * 2)
    let fontSize = Math.max(22, Math.floor(W / 18))
    const family = `400 ${fontSize}px Eater, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif`
    offCtx.font = family
    let m = offCtx.measureText(getTEXT())
    const baseH = Math.ceil(fontSize * 1.2)
    // Scale down if rotated bounds exceed
    const fit = (fs) => {
      const w = offCtx.measureText(getTEXT()).width * (fs / fontSize)
      const h = baseH * (fs / fontSize)
      const rotW = Math.abs(w * COS) + Math.abs(h * SIN)
      const rotH = Math.abs(w * SIN) + Math.abs(h * COS)
      const sW = maxW / rotW
      const sH = maxH / rotH
      return Math.min(1, sW, sH)
    }
    let scale = fit(fontSize)
    if (scale < 1) fontSize = Math.floor(fontSize * scale)
    offCtx.font = `400 ${fontSize}px Eater, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif`
    m = offCtx.measureText(getTEXT())
    const textW = Math.ceil(m.width)
    const textH = Math.ceil(fontSize * 1.2)
    off.width = textW
    off.height = textH
    offCtx.font = `400 ${fontSize}px Eater, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif`
    offCtx.fillStyle = '#ffffff'
    offCtx.textBaseline = 'middle'
    offCtx.textAlign = 'left'
    offCtx.clearRect(0,0,off.width,off.height)
    offCtx.fillText(getTEXT(), 0, off.height/2)
    textBounds = { w: textW, h: textH, x: (W - textW)/2, y: (H - textH)/2, fontSize }
  }

  function drawTextLayer() {
    if (!tctx) return
    const acc = getAccent()

    // clear and backdrop darken
    tctx.clearRect(0, 0, W, H)
    const grd = tctx.createLinearGradient(0, 0, 0, H)
    grd.addColorStop(0, 'rgba(0,0,0,0.10)')
    grd.addColorStop(1, 'rgba(0,0,0,0.30)')
    tctx.fillStyle = grd
    tctx.fillRect(0, 0, W, H)

    // 6s reveal (start immediately, no initial black hold)
    const now = performance.now()
    const t = Math.max(0, Math.min(1, (now - startTime) / 5500))
    const eased = 1 - Math.pow(1 - t, 3)
    const revealW = Math.floor(textBounds.w * eased)

    // draw glow + sharp text in rotated space centered
    const cx = W / 2, cy = H / 2
    tctx.save()
    tctx.translate(cx, cy)
    tctx.rotate(ROT)
    // glow
    tctx.save()
    tctx.globalCompositeOperation = 'lighter'
    tctx.filter = 'blur(1.2px)'
    tctx.globalAlpha = 0.35
    tctx.drawImage(off, 0, 0, revealW, textBounds.h, -textBounds.w/2, -textBounds.h/2, revealW, textBounds.h)
    tctx.restore()
    // sharp
    tctx.drawImage(off, 0, 0, revealW, textBounds.h, -textBounds.w/2, -textBounds.h/2, revealW, textBounds.h)
    tctx.restore()

    // spawn accent lightning along reveal edge while animating
    if (revealW > 6 && !finished) {
      if (Math.random() < 0.22) {
        // edge point in screen coords: center + (revealPos - halfWidth) * dir
        const dirx = COS, diry = SIN
        const perpx = -SIN, perpy = COS
        const revealPos = revealW - textBounds.w / 2
        const jitter = (Math.random() - 0.5) * textBounds.h
        const sx = (W/2) + revealPos * dirx + jitter * perpx
        const sy = (H/2) + revealPos * diry + jitter * perpy
        thunderLines.push(new Thunder(sx, sy, acc))
        // fog puffs at lightning positions (localized flicker)
        spawnFogPuff(sx, sy)
      }
    }

    // draw and update thunder lines
    for (let i = thunderLines.length - 1; i >= 0; i--) {
      const alive = thunderLines[i].step()
      thunderLines[i].draw(tctx)
      if (!alive) thunderLines.splice(i, 1)
    }

    if (t >= 1 && !finished) {
      finished = true
      setTimeout(() => { thunderLines.length = 0 }, 600)
    }
  }

  function spawnFogPuff(x, y) {
    fogPuffs.push({ x, y, r: Math.random() * 20 + 10, life: 100 })
  }

  async function init() {
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(60, 1, 1, 1000)
    camera.position.z = 1
    camera.rotation.x = 1.16
    camera.rotation.y = -0.12
    camera.rotation.z = 0.27

    ambient = new THREE.AmbientLight(0x555555)
    scene.add(ambient)

    directionalLight = new THREE.DirectionalLight(0xffeedd)
    directionalLight.position.set(0, 0, 1)
    scene.add(directionalLight)

    const acc = new THREE.Color(getAccent())
    // Calmer flash: start low intensity; we'll smoothly modulate below
    flash = new THREE.PointLight(acc, 0, 500, 1.7)
    flash.position.set(200, 300, 100)
    scene.add(flash)

    // Opaque renderer to avoid any see-through during intro
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    scene.fog = new THREE.FogExp2(0x11111f, 0.002)
    renderer.setClearColor(scene.fog.color)
    const { w, h } = size()
    renderer.setSize(w, h)
    mountEl.innerHTML = ''
    mountEl.appendChild(renderer.domElement)
    // Prepare text canvas sizing now that mount has size
    // ensure Eater font is loaded before measuring
    try { await document.fonts.load('400 24px Eater'); await document.fonts.ready } catch (e) {}
    resizeTextCanvas()
    startTime = performance.now()

    // Remove white rain particles for cleaner look

    // Clouds texture
    const loader = new THREE.TextureLoader()
    loader.load(
      'https://static.vecteezy.com/system/resources/previews/010/884/548/original/dense-fluffy-puffs-of-white-smoke-and-fog-on-transparent-background-abstract-smoke-clouds-movement-blurred-out-of-focus-smoking-blows-from-machine-dry-ice-fly-fluttering-in-air-effect-texture-png.png',
      (texture) => {
        const cloudGeo = new THREE.PlaneGeometry(500, 500)
        const cloudMaterial = new THREE.MeshLambertMaterial({ map: texture, transparent: true })
        // Slightly tint clouds towards the accent color (subtle) and keep a ref for flicker
        const tint = new THREE.Color(getAccent())
        cloudMaterial.color = tint.clone().lerp(new THREE.Color('#ffffff'), 0.75)
        cloudMaterial.emissive = tint.clone()
        cloudMaterial.emissiveIntensity = 0.12
        cloudMaterialRef = cloudMaterial
        for (let p = 0; p < 25; p++) {
          const cloud = new THREE.Mesh(cloudGeo, cloudMaterial)
          cloud.position.set(Math.random() * 800 - 400, 500, Math.random() * 500 - 450)
          cloud.rotation.x = 1.16
          cloud.rotation.y = -0.12
          cloud.rotation.z = Math.random() * 360
          cloud.material.opacity = 0.6
          cloudParticles.push(cloud)
          scene.add(cloud)
        }
        animate()
      }
    )

    function animate() {
      // Subtle cloud movement
      cloudParticles.forEach((p) => { p.rotation.z -= 0.002 })

      // Calmer flash modulation using smooth low-frequency sine with slight randomness
      const tnow = performance.now() * 0.001
      const base = (Math.sin(tnow * 1.2) + 1) * 0.5 // 0..1
      const slow = (Math.sin(tnow * 0.37 + 1.3) + 1) * 0.5
      const sparkle = Math.max(0, Math.sin(tnow * 6.0)) * 0.15
      const intensity = 0.2 + base * 0.4 + slow * 0.3 + sparkle
      flash.intensity = intensity * 6.0 // cap lower than before

      // Slight random reposition occasionally, but rarely
      if (Math.random() < 0.01) {
        flash.position.set(Math.random() * 400, 300 + Math.random() * 200, 100)
      }

      // Accent-colored fog flicker based on smooth intensity
      if (cloudMaterialRef) {
        const flicker = 0.15 + intensity * 0.35
        cloudMaterialRef.emissiveIntensity = 0.08 + intensity * 0.22
        cloudMaterialRef.opacity = 0.45 + flicker * 0.2
      }

      // 2D fog + text layer drawing
      drawFogLayer()
      drawTextLayer()

      renderer.render(scene, camera)

      reqId = requestAnimationFrame(animate)
    }

    function onResize() {
      const { w, h } = size()
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      resizeTextCanvas()
    }
    window.addEventListener('resize', onResize)

    threeCleanup = () => {
      cancelAnimationFrame(reqId)
      window.removeEventListener('resize', onResize)
      renderer && renderer.dispose()
      mountEl.innerHTML = ''
      cloudParticles = []
    }
  }

  init()
}

// (Double helix canvas removed)

onMounted(async () => {
  await nextTick()
  initThreeStorm()
  // Start reveal immediately; still hide overlay after animation
  setTimeout(() => { show.value = false }, 6000)
})

onBeforeUnmount(() => {
  threeCleanup && threeCleanup()
})
</script>

<style scoped>
.flash-intro {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* Full overlay blackout layer */
/* removed blackout hold */

.three-bg { position: absolute; inset: 0; z-index: 1; }
.fog-canvas { position: absolute; inset: 0; z-index: 2; display: block; }
.text-canvas { position: absolute; inset: 0; z-index: 3; display: block; }


.flash-text {
  position: relative;
  z-index: 20;
  font-size: clamp(2.5rem, 8vw, 6rem);
  font-weight: 400; /* Eater is a display font with regular weight */
  /* Use Google Font "Eater" (linked in index.html) */
  font-family: 'Eater', system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  color: var(--acc-bright);
  text-shadow:
    0 0 1px var(--acc-core),
    0 0 8px var(--acc-core),
    0 0 18px var(--acc-bright),
    0 0 42px var(--acc-outer),
    0 0 64px var(--acc-outer);
  transform: rotate(-20deg);
  display: none; /* hidden – canvas handles the rendered text */
  flex-wrap: wrap;
  gap: 0.5em;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  line-height: 1;
}

.word {
  display: inline-block;
  animation: flashWord 0.6s ease-out forwards;
  opacity: 0;
  transform: translateX(-100px) rotate(-15deg);
  /* subtle bevel/gloss to enhance 3D feel */
  -webkit-text-stroke: 0.5px rgba(255,255,255,0.15);
}

@keyframes flashWord {
  0% {
    opacity: 0;
    transform: translateX(-100px) rotate(-15deg) scale(0.8);
  }
  30% {
    opacity: 1;
    transform: translateX(10px) rotate(2deg) scale(1.1);
  }
  60% {
    transform: translateX(-5px) rotate(-1deg) scale(1);
  }
  100% {
    opacity: 1;
    transform: translateX(0) rotate(0deg) scale(1);
  }
}

.flash-intro-leave-active {
  transition: opacity 1.2s cubic-bezier(.22,.61,.36,1), transform 1.2s cubic-bezier(.22,.61,.36,1);
}

.flash-intro-leave-to {
  opacity: 0;
  transform: scale(1.2);
}

@media (max-width: 768px) {
  .flash-text {
    font-size: clamp(1.8rem, 7vw, 4.5rem);
    gap: 0.3em;
  }
}

/* Accent palette derived from global --accent-raw; falls back to cyan/teal mix */
:host, .flash-intro {
  --acc-raw: var(--accent-raw, #12b3a6);
  --acc-core: color-mix(in oklab, var(--acc-raw) 85%, #ffffff 15%);
  --acc-bright: color-mix(in oklab, var(--acc-raw) 70%, #7dd3fc 30%);
  --acc-outer: color-mix(in oklab, var(--acc-raw) 40%, #7dd3fc 60%);
}

/* Font is loaded via external <link> in index.html */
</style>
