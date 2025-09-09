<template>
  <transition name="flash-intro" @after-leave="$emit('complete')">
    <div v-if="show" class="flash-intro">
      <!-- Initial blackout for 1s to allow assets to load -->
      <div v-if="blackout" class="blackout" aria-hidden="true"></div>
      <!-- WebGL storm background (Three.js) -->
      <div ref="threeMount" class="three-bg" aria-hidden="true"></div>

      <!-- Text (single line, responsive) -->
      <div class="flash-text">
        <span class="word" :style="`animation-delay: 0s`">{{ line }}</span>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

const show = ref(true)
const line = 'Mit KI die IT-Welt neu definieren'
const blackout = ref(true)

// Refs for mounts
const threeMount = ref(null)

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

  const THREE = window.THREE
  let scene, camera, renderer, ambient, directionalLight, flash
  let cloudParticles = []
  let cloudMaterialRef = null
  const rainCount = 15000
  let reqId

  function size() {
    const rect = mountEl.getBoundingClientRect()
    return { w: Math.max(1, rect.width), h: Math.max(1, rect.height) }
  }

  function init() {
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
    flash = new THREE.PointLight(acc, 30, 500, 1.7)
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
        cloudMaterial.emissiveIntensity = 0.2
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
      cloudParticles.forEach((p) => { p.rotation.z -= 0.002 })
      // No rain position updates

      if (Math.random() > 0.93 || flash.power > 100) {
        if (flash.power < 100) flash.position.set(Math.random() * 400, 300 + Math.random() * 200, 100)
        flash.power = 50 + Math.random() * 500
      }
      // Accent-colored fog flicker based on lightning pulses and a soft time-based flicker
      if (cloudMaterialRef) {
        const t = performance.now() * 0.002
        const soft = (Math.sin(t * 1.7) + 1) * 0.5 // 0..1
        const pulse = Math.min(1, flash.power / 550) // normalize flash.power
        const flicker = 0.2 + soft * 0.25 + pulse * 0.55 // 0.2..1.0
        cloudMaterialRef.emissiveIntensity = flicker
        cloudMaterialRef.opacity = 0.45 + flicker * 0.25
      }
      renderer.render(scene, camera)
      reqId = requestAnimationFrame(animate)
    }

    function onResize() {
      const { w, h } = size()
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
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
  // keep blackout for 1s, then show scene/text; fade out later
  setTimeout(() => { blackout.value = false }, 1000)
  setTimeout(() => { show.value = false }, 3200)
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
.blackout {
  position: absolute;
  inset: 0;
  background: #000;
  z-index: 50;
}

.three-bg { position: absolute; inset: 0; z-index: 1; }


.flash-text {
  position: relative;
  z-index: 20;
  font-size: clamp(2.5rem, 8vw, 6rem);
  font-weight: 900;
  /* Use external Fighting Spirit font (linked in index.html), with bold weight */
  font-family: 'Fighting Spirit TBS', 'Fighting Spirit TBS Bold', system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  color: var(--acc-bright);
  text-shadow:
    0 0 1px var(--acc-core),
    0 0 8px var(--acc-core),
    0 0 18px var(--acc-bright),
    0 0 42px var(--acc-outer),
    0 0 64px var(--acc-outer);
  transform: rotate(-20deg);
  display: flex;
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
