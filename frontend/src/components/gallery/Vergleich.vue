<template>
  <div class="modern-gallery-4">
    <div class="gallery-wrapper">
          <div class="gallery-items">
            <div 
              v-for="(image, i) in images" 
              :key="i" 
              class="gallery-item"
              @click="selectImage(i)"
              draggable="true"
              @dragstart="onThumbDragStart(i, $event)"
              @dragend="onThumbDragEnd"
            >
              <div class="image-wrapper">
                <img :src="image.url" :alt="image.title" />
                <a v-if="image.link" class="source-badge" :href="image.link" target="_blank" rel="noopener noreferrer" @click.stop>
                  Quelle ↗
                </a>
                
              </div>
            </div>
          </div>
          
          <!-- Single Image or Before/After Comparison -->
          <transition name="fade-zoom" mode="out-in">
            <div v-if="showSingle" key="single" class="single-section">
              <div class="single-container">
                <img :src="singleUrl" alt="Bild" />
              </div>
            </div>
            <div v-else key="compare" class="comparison-section">
              <h3>{{ isEn ? 'Before/After Comparison' : 'Vorher/Nachher Vergleich' }}</h3>
              <div class="comparison-slider">
                <div 
                  class="comparison-container" 
                  @click="onClickContainer" 
                  @touchstart.passive="onTouchStart" 
                  @touchmove.passive="onTouchMove" 
                  @touchend.passive="onTouchEnd"
                  @dragover.prevent="onDragOver"
                  @drop.prevent="onDrop"
                >
                  <!-- Drag hint overlay -->
                  <div v-if="showHint || draggingIndex!==null" class="drag-hint" aria-hidden="true">
                    <div class="hint-left">
                      <span class="arrow">⇠</span>
                      <span class="text">{{ isEn ? 'Drop here' : 'Hier ablegen' }}</span>
                    </div>
                    <div class="hint-right">
                      <span class="text">{{ isEn ? 'Drop here' : 'Hier ablegen' }}</span>
                      <span class="arrow">⇢</span>
                    </div>
                  </div>
                  <!-- Drop highlight: left/right -->
                  <div class="drop-highlight left" :class="{ active: dragOverSide==='left' }" aria-hidden="true"></div>
                  <div class="drop-highlight right" :class="{ active: dragOverSide==='right' }" aria-hidden="true"></div>
                  <div class="before-image">
                    <img :src="beforeUrl" :alt="isEn ? 'Before' : 'Vorher'" :style="{ transform: `scale(${beforeScale})` }" />
                    <div class="label">{{ isEn ? 'Before' : 'Vorher' }}</div>
                  </div>
                  <div class="after-image" :style="{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }">
                    <img :src="afterUrl" :alt="isEn ? 'After' : 'Nachher'" :style="{ transform: `scale(${afterScale})` }" />
                    <div class="label">{{ isEn ? 'After' : 'Nachher' }}</div>
                  </div>
                  <div 
                    class="slider-handle" 
                    :style="{ left: sliderPosition + '%' }"
                    @mousedown="startDrag"
                    @touchstart.passive="startDrag"
                  >
                    <div class="handle-line"></div>
                    <div class="handle-circle">
                      <span>⟷</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </template>

    <script setup>
    import { ref, onUnmounted, watch, computed, onMounted } from 'vue'
    import { useRoute } from 'vue-router'

    const images = ref([
      { url: new URL('@/assets/Pictures/Gallery/Vergleich/Mond1.jpg', import.meta.url).href, title: 'Mond 1', compare: true, link: 'https://www.instagram.com/p/DA9h6IKyye0/?img_index=1' },
      { url: new URL('@/assets/Pictures/Gallery/Vergleich/Mond2.jpg', import.meta.url).href, title: 'Mond 2', compare: false, link: 'http://www.luckwlt.com/' },
      { url: new URL('@/assets/Pictures/Gallery/Vergleich/Mond3.jpg', import.meta.url).href, title: 'Mond 3', compare: true, link: 'https://www.instagram.com/p/DOT6diLjFlb/?img_index=3' },
      { url: new URL('@/assets/Pictures/Gallery/Vergleich/Mond4.jpg', import.meta.url).href, title: 'Mond 4', compare: true, link: 'https://www.reddit.com/r/spaceporn/comments/1mmiggy/hyperdetailed_moon_last_night_by_andrew_mccarthy/' }
    ])

    // Default: compare fixed "Vorher" (Mond1) with a "Nachher" image (Mond3)
    const beforeUrl = ref(new URL('@/assets/Pictures/Gallery/Vergleich/Mond1.jpg', import.meta.url).href)
    const afterUrl = ref(new URL('@/assets/Pictures/Gallery/Vergleich/Mond3.jpg', import.meta.url).href)

    // Single-image mode (for images that are not comparable)
    const showSingle = ref(false)
    const singleUrl = ref('')

    // Drag state for thumbnails
    const draggingIndex = ref(null)
    const dragOverSide = ref(null) // 'left' | 'right' | null

    const sliderPosition = ref(50)
    const isDragging = ref(false)
    const beforeScale = ref(1.2)
    const afterScale = ref(1)

    // Language detection (simple): use route name prefix like in App.vue
    const route = useRoute()
    const isEn = computed(() => {
      const n = String(route.name || '')
      return n.startsWith('en-')
    })

    // Drag hint (animated arrows shown initially and during drag)
    const showHint = ref(true)
    onMounted(() => {
      setTimeout(() => { showHint.value = false }, 2500)
    })

    function selectImage(index) {
      const img = images.value[index]
      if (!img) return
      if (img.compare === false) {
        // Enter single-image mode
        singleUrl.value = img.url
        showSingle.value = true
        return
      }
      // Leave single-image mode and update comparison
      showSingle.value = false
      afterUrl.value = img.url
      // If Mond1 is selected for Nachher, keep both sides at 1.2x for parity
      const isMond1 = /\/Mond1\.jpg$/i.test(img.url) || String(img.url).includes('Mond1.jpg')
      if (isMond1) {
        beforeScale.value = 1.2
        afterScale.value = 1.2
      } else {
        // Otherwise reset right side to 1x (left may be Mond1 and stays 1.2x via watcher)
        afterScale.value = 1
      }
    }

    function startDrag() {
      isDragging.value = true
      document.addEventListener('mousemove', onDrag)
      document.addEventListener('mouseup', stopDrag)
      document.addEventListener('touchmove', onTouchMove, { passive: true })
      document.addEventListener('touchend', onTouchEnd, { passive: true })
      // Avoid blue text-selection artifacts during drag
      document.body.style.userSelect = 'none'
      document.body.style.webkitUserSelect = 'none'
    }

    function onDrag(event) {
      if (!isDragging.value) return
      const container = document.querySelector('.comparison-container')
      if (!container) return
      const rect = container.getBoundingClientRect()
      const x = event.clientX - rect.left
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
      sliderPosition.value = percentage
    }

    function stopDrag() {
      isDragging.value = false
      document.removeEventListener('mousemove', onDrag)
      document.removeEventListener('mouseup', stopDrag)
      document.removeEventListener('touchmove', onTouchMove)
      document.removeEventListener('touchend', onTouchEnd)
      document.body.style.userSelect = ''
      document.body.style.webkitUserSelect = ''
    }

    // Tap to position
    function onClickContainer(e) {
      const container = e.currentTarget
      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
      sliderPosition.value = percentage
    }

    // Touch handlers
    function onTouchStart(e) {
      isDragging.value = true
      onTouchMove(e)
    }

    function onTouchMove(e) {
      if (!isDragging.value) return
      const touch = e.touches && e.touches[0]
      if (!touch) return
      const container = document.querySelector('.comparison-container')
      if (!container) return
      const rect = container.getBoundingClientRect()
      const x = touch.clientX - rect.left
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
      sliderPosition.value = percentage
    }

    function onTouchEnd() {
      isDragging.value = false
    }

    // Drag-and-drop from thumbnails
    function onThumbDragStart(index, e) {
      const img = images.value[index]
      if (!img || img.compare === false) { e.preventDefault(); return }
      draggingIndex.value = index
      e.dataTransfer?.setData('text/plain', String(index))
      e.dataTransfer?.setDragImage?.(new Image(), 0, 0)
    }

    function onThumbDragEnd() {
      draggingIndex.value = null
      dragOverSide.value = null
    }

    function onDragOver(e) {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      dragOverSide.value = x < rect.width / 2 ? 'left' : 'right'
    }

    function onDrop(e) {
      let index = draggingIndex.value
      if (index == null && e.dataTransfer) {
        const data = e.dataTransfer.getData('text/plain')
        if (data) index = Number(data)
      }
      if (index == null) return
      const img = images.value[index]
      if (!img) return
      if (img.compare === false) {
        singleUrl.value = img.url
        showSingle.value = true
        return
      }
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const side = x < rect.width / 2 ? 'left' : 'right'
      // Invert assignment to match expected UX (drop-left updates right, drop-right updates left)
      if (side === 'left') {
        afterUrl.value = img.url
        applyDefaultScale('right', img.url)
      } else {
        beforeUrl.value = img.url
        applyDefaultScale('left', img.url)
      }
      dragOverSide.value = null
    }

    function applyDefaultScale(side, url) {
      const isMond1 = /\/Mond1\.jpg$/i.test(url) || String(url).includes('Mond1.jpg')
      if (side === 'left') {
        beforeScale.value = isMond1 ? 1.2 : 1
        // if left is Mond1 and right is also Mond1, ensure right matches too
        if ((/\/Mond1\.jpg$/i.test(afterUrl.value) || String(afterUrl.value).includes('Mond1.jpg'))) {
          afterScale.value = 1.2
        }
      } else {
        afterScale.value = isMond1 ? 1.2 : 1
      }
    }

    // React whenever the left image (Vorher) changes, keep Mond1 at 1.2x
    watch(beforeUrl, (url) => {
      const isMond1 = /\/Mond1\.jpg$/i.test(url) || String(url).includes('Mond1.jpg')
      beforeScale.value = isMond1 ? 1.2 : 1
    })

    onUnmounted(() => {
      document.removeEventListener('mousemove', onDrag)
      document.removeEventListener('mouseup', stopDrag)
      document.removeEventListener('touchmove', onTouchMove)
      document.removeEventListener('touchend', onTouchEnd)
      document.body.style.userSelect = ''
      document.body.style.webkitUserSelect = ''
    })
    </script>

    <style scoped>
    .modern-gallery-4 { background: rgba(10, 15, 20, 0.9); border-radius: 16px; padding: 30px; color: white; }
    /* Desktop: grid thumbnails */
    .gallery-items { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 24px; }
    .gallery-item { cursor: grab; transition: transform 0.3s ease; }
    .gallery-item:hover { transform: translateY(-5px); }
    .image-wrapper { position: relative; border-radius: 12px; overflow: hidden; background: linear-gradient(45deg, #1a1a2e, #16213e); }
    .image-wrapper img { width: 100%; height: 200px; object-fit: cover; transition: filter 0.3s ease; display:block }
    .gallery-item:hover img { filter: brightness(0.8); }
    
    .source-badge { position: absolute; top: 8px; left: 8px; background: rgba(18,179,166,0.85); color: #081018; padding: 4px 8px; border-radius: 10px; font-size: 0.72em; font-weight: 700; }
    .comparison-section { margin-top: 10px; }
    .single-section { margin-top: 10px; }
    .single-container { position: relative; width: 100%; height: 400px; border-radius: 12px; overflow: hidden; background:#000; display:flex; align-items:center; justify-content:center }
    .single-container img { width:auto; height:auto; max-width:100%; max-height:100%; object-fit: contain; display:block }
    .single-label { position: absolute; top: 20px; left: 20px; background: rgba(0,0,0,0.7); color: white; padding: 8px 16px; border-radius: 20px; font-size: 0.9em; font-weight: 600; }
    .fade-zoom-enter-active, .fade-zoom-leave-active { transition: opacity .25s ease, transform .25s ease; }
    .fade-zoom-enter-from, .fade-zoom-leave-to { opacity: 0; transform: scale(.98); }
    .comparison-section h3 { font-size: 1.5em; margin-bottom: 10px; text-align: center; color: #12b3a6; }
    .comparison-container { position: relative; width: 100%; height: 400px; border-radius: 12px; overflow: hidden; cursor: ew-resize; }
    .before-image, .after-image { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
    /* Use contain for better alignment across different source sizes */
    .before-image img, .after-image img { width: 100%; height: 100%; object-fit: contain; background: #000; transform-origin: center center; }
    .label { position: absolute; top: 20px; left: 20px; background: rgba(0,0,0,0.7); color: white; padding: 8px 16px; border-radius: 20px; font-size: 0.9em; font-weight: 600; }
    .after-image .label { right: 20px; left: auto; }
    .drop-highlight { position: absolute; top: 0; bottom: 0; width: 50%; pointer-events: none; opacity: 0; transition: opacity .15s ease; background: rgba(var(--accent-rgb, 18,179,166), 0.08); }
    .drop-highlight.left { left: 0; border-right: 2px dashed var(--accent-raw, #12b3a6); }
    .drop-highlight.right { right: 0; border-left: 2px dashed var(--accent-raw, #12b3a6); }
    .drop-highlight.active { opacity: 0.35; }
    .slider-handle { position: absolute; top: 0; bottom: 0; width: 4px; background: #12b3a6; cursor: ew-resize; transform: translateX(-50%); user-select: none; -webkit-user-select: none; }
    .handle-line { width: 100%; height: 100%; background: #12b3a6; box-shadow: 0 0 10px rgba(18, 179, 166, 0.5); }
    .handle-circle { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 40px; height: 40px; background: #12b3a6; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.2em; box-shadow: 0 0 15px rgba(18, 179, 166, 0.7); }
    .comparison-container, .comparison-container * { user-select: none; -webkit-user-select: none; }
    /* Drag hint overlay */
    .drag-hint { position: absolute; inset: 0; display:flex; align-items:center; justify-content:space-between; pointer-events:none; padding: 0 14px; z-index: 6; }
    .drag-hint .hint-left, .drag-hint .hint-right{ display:flex; align-items:center; gap:8px; color:#fff; background: rgba(0,0,0,.35); padding:6px 10px; border-radius: 999px; opacity:.85; animation: pulse 1.6s ease-in-out infinite; }
    .drag-hint .arrow{ font-size: 1.2rem; filter: drop-shadow(0 0 6px rgba(0,0,0,.35)); }
    .drag-hint .text{ font-size: .85rem }
    @keyframes pulse { 0%,100%{ transform: translateY(0); opacity:.75 } 50%{ transform: translateY(-2px); opacity:1 } }
    /* Tablet: slightly smaller compare area and more compact thumbnails */
    @media (max-width: 768px) {
      .modern-gallery-4 { padding: 14px; }
      /* switch thumbnails to horizontal scroll row */
      .gallery-items { display: flex; gap: 8px; overflow-x: auto; padding: 6px 2px 10px; margin-bottom: 10px; }
      .gallery-items { scrollbar-width: thin; }
      .gallery-items::-webkit-scrollbar { height: 6px; }
      .gallery-items::-webkit-scrollbar-thumb { background: rgba(255,255,255,.15); border-radius: 6px; }
      .gallery-item { flex: 0 0 auto; width: 92px; }
      .image-wrapper img { height: 72px; }
      .comparison-container { height: 280px; }
      .single-container { height: 280px; }
      .handle-circle { width: 30px; height: 30px; font-size: 1em; }
      .label { top: 10px; padding: 6px 12px; font-size: .8em; }
      .drag-hint .text{ display:none }
    }
    /* Phone: 2-column stable grid to avoid overly tall scroll, smaller handle */
    @media (max-width: 480px) {
      .modern-gallery-4 { padding: 12px; }
      .gallery-items { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 8px; overflow: visible; padding: 4px 0 8px; margin-bottom: 8px; }
      .gallery-item { width: auto; }
      .image-wrapper img { height: 82px; }
      .item-content { padding: 10px 8px 8px; }
      .item-number { display:none }
      .item-title { font-size: .95em }
      .comparison-container { height: 260px; }
      .single-container { height: 260px; }
      .handle-circle { width: 26px; height: 26px; font-size: .9em; }
    }
    </style>
