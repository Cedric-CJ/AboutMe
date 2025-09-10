<template>
  <div class="modern-gallery-4">
    <div class="gallery-wrapper">
      <div class="gallery-items">
        <div 
          v-for="(image, i) in images" 
          :key="i" 
          class="gallery-item"
          @click="selectImage(i)"
        >
          <div class="image-wrapper">
            <img :src="image.url" :alt="image.title" />
            <div class="item-content">
              <div class="item-number">{{ String(i + 1).padStart(2, '0') }}</div>
              <div class="item-title">{{ image.title }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Before/After Comparison Slider -->
      <div class="comparison-section">
        <h3>Vorher/Nachher Vergleich</h3>
        <div class="comparison-slider">
          <div class="comparison-container">
            <div class="before-image">
              <img :src="beforeUrl" alt="Vorher" />
              <div class="label">Vorher</div>
            </div>
            <div class="after-image" :style="{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }">
              <img :src="afterUrl" alt="Nachher" />
              <div class="label">Nachher</div>
            </div>
            <div 
              class="slider-handle" 
              :style="{ left: sliderPosition + '%' }"
              @mousedown="startDrag"
            >
              <div class="handle-line"></div>
              <div class="handle-circle">
                <span>⟷</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'

const images = ref([
  { url: new URL('@/assets/Pictures/Gallery/Vespa.jpg', import.meta.url).href, title: 'Vespa' },
  { url: new URL('@/assets/Pictures/Gallery/4er/Alanya.jpg', import.meta.url).href, title: 'Alanya' },
  { url: new URL('@/assets/Pictures/Gallery/4er/Tokyostore.jpg', import.meta.url).href, title: 'Tokyostore' },
  { url: new URL('@/assets/Pictures/Gallery/4er/Schloss_Fürstlich_Drehna.jpg', import.meta.url).href, title: 'Schloss Fürstlich Drehna' },
  { url: new URL('@/assets/Pictures/Gallery/4er/Side.jpg', import.meta.url).href, title: 'Side' }
])

const beforeUrl = new URL('@/assets/Pictures/Gallery/4er/Alanya.jpg', import.meta.url).href
const afterUrl = new URL('@/assets/Pictures/Gallery/4er/Side.jpg', import.meta.url).href

const sliderPosition = ref(50)
const isDragging = ref(false)

function selectImage(index) {
  console.log('Selected:', images.value[index])
}

function startDrag() {
  isDragging.value = true
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
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
}

onUnmounted(() => {
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
})
</script>

<style scoped>
.modern-gallery-4 { background: rgba(10, 15, 20, 0.9); border-radius: 16px; padding: 30px; color: white; }
.gallery-items { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 40px; }
.gallery-item { cursor: pointer; transition: transform 0.3s ease; }
.gallery-item:hover { transform: translateY(-5px); }
.image-wrapper { position: relative; border-radius: 12px; overflow: hidden; background: linear-gradient(45deg, #1a1a2e, #16213e); }
.image-wrapper img { width: 100%; height: 200px; object-fit: cover; transition: filter 0.3s ease; }
.gallery-item:hover img { filter: brightness(0.8); }
.item-content { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, rgba(0,0,0,0.8)); padding: 30px 20px 20px; }
.item-number { font-size: 0.8em; color: #12b3a6; font-weight: bold; margin-bottom: 5px; }
.item-title { font-size: 1.1em; font-weight: 600; }
.comparison-section { margin-top: 40px; }
.comparison-section h3 { font-size: 1.5em; margin-bottom: 20px; text-align: center; color: #12b3a6; }
.comparison-container { position: relative; width: 100%; height: 400px; border-radius: 12px; overflow: hidden; cursor: ew-resize; }
.before-image, .after-image { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
.before-image img, .after-image img { width: 100%; height: 100%; object-fit: cover; }
.label { position: absolute; top: 20px; left: 20px; background: rgba(0,0,0,0.7); color: white; padding: 8px 16px; border-radius: 20px; font-size: 0.9em; font-weight: 600; }
.after-image .label { right: 20px; left: auto; }
.slider-handle { position: absolute; top: 0; bottom: 0; width: 4px; background: #12b3a6; cursor: ew-resize; transform: translateX(-50%); }
.handle-line { width: 100%; height: 100%; background: #12b3a6; box-shadow: 0 0 10px rgba(18, 179, 166, 0.5); }
.handle-circle { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 40px; height: 40px; background: #12b3a6; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.2em; box-shadow: 0 0 15px rgba(18, 179, 166, 0.7); }
@media (max-width: 768px) { .gallery-items { grid-template-columns: repeat(2, 1fr); gap: 15px; } .comparison-container { height: 250px; } .handle-circle { width: 30px; height: 30px; font-size: 1em; } }
@media (max-width: 480px) { .gallery-items { grid-template-columns: 1fr; } }
</style>
