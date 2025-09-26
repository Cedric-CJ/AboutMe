/**inspariert von https://codepen.io/mallendeo/pen/xORqVp */
<template>
  <section v-if="isVisible" id="intro" class="section section--intro intro-overlay">
    <!-- mousemove event layer (for background effect) -->
    <div class="mouse-tracker-layer"></div>

    <div class="square-dark-wrapper">
      <div class="square-dark"></div>
    </div>

    <div class="pango-logo-group">
      <!-- Outer logo outline animation -->
      <svg class="outer-logo-circle" viewBox="0 0 700 700">
        <circle class="circle" fill="none" cx="350" cy="350" r="330"/>
      </svg>

      <!-- Replaced with personal logo image -->
      <img class="pango-logo" src="@/assets/Pictures/Me.png" alt="Logo" />
      <div class="square-wrapper">
        <div class="line"></div>
        <div class="line"></div>
        <div class="line"></div>
        <div class="line"></div>
      </div>
      <div class="sparks">
        <svg class="spark" viewBox="91 -1 94 94" xmlns="http://www.w3.org/2000/svg">
          <path d="M184 92c0-50.8-41.2-92-92-92" stroke="#d0d0d0" fill="none"/>
        </svg>
        <svg class="spark" viewBox="91 -1 94 94" xmlns="http://www.w3.org/2000/svg">
          <path d="M184 92c0-50.8-41.2-92-92-92" stroke="#d0d0d0" fill="none"/>
        </svg>
      </div>
    </div>

    <h1 class="pango-words">
      <span class="pango-word">CEDRIC</span>
      <div class="line-separator"></div>
      <span class="pango-word">ARNHOLD</span>
    </h1>

    <div class="bg-lines-wrapper"></div>
  </section>
</template>

<script>
import { onMounted, ref } from 'vue'
// Replaces the element text with an array of spans
// and returns it
function splitTextInSpans(elem) {
  const letters = elem.textContent.split('')
  elem.innerHTML = ''
  return letters.map(letter => {
    const span = document.createElement('span')
    span.textContent = letter
    elem.appendChild(span)
    return span
  })
}

function intro() {
  function animateLogo(tl) {
    const maxWindowSize = Math.max(window.innerHeight, window.innerWidth)

    const squareDarkWrapper = document.querySelector('.square-dark-wrapper')
    const squareDark = squareDarkWrapper.querySelector('.square-dark')

    const square = document.querySelector('.square-wrapper')
    const lines = square.querySelectorAll('.line')

    const sparks = document.querySelectorAll('.spark')
    const outerCircle = document.querySelector('.outer-logo-circle .circle')
    const logo = document.querySelector('.pango-logo')

    tl.set(squareDark, {
        height: maxWindowSize,
        width: maxWindowSize
      })
      .set(lines, { scaleX: 0 })

    _.forEach(lines, (line, i) => {
      tl.to(lines[i], 2, {
        scaleX: 1,
        ease: 'Expo.easeOut'
      }, i / 10)
    })

    tl.to(lines, .05, {
        opacity: 0
      }, 1)
      .to(squareDarkWrapper, 1.5, {
        scale: 1.4,
        ease: 'Expo.easeOut'
      }, 1)
      .to(square, 2, {
        rotationZ: 45,
        ease: 'Expo.easeOut'
      }, 1.5)
      .to(sparks, 1, {
        strokeDashoffset: 0,
        ease: 'Expo.easeOut'
      }, 1.5)
      .to(sparks, 1, {
        strokeDashoffset: 145,
        ease: 'Expo.easeOut'
      }, 1.5)
      .to(outerCircle, 1.4, {
        strokeDashoffset: 0,
        ease: 'Expo.easeInOut'
      }, 1.7)
      .to(outerCircle, .4, {
        opacity: 0,
        ease: 'Power4.easeOut'
      }, 2.7)
      .to(logo, 1, {
        opacity: 1,
        scale: 1,
        ease: 'Power4.easeOut'
      }, 2.7)

    return tl
  }

  function animateWords(tl) {
    const wordsWrapper  = document.querySelector('.pango-words')
    const words         = wordsWrapper.querySelectorAll('.pango-word')
    const lineSeparator = wordsWrapper.querySelector('.line-separator')

    tl.set(lineSeparator, { scaleX: 0 })
      .to(lineSeparator, 1, {
        scaleX: 1,
        ease: 'Expo.easeOut'
      }, 3)

    _.forEach(words, word => {
      const spans = splitTextInSpans(word)
      _.forEach(spans, (span, j) => {
        let tlWords = new TimelineMax()

        tlWords.set(span, { y: span.clientHeight, opacity: 1 })
        const delay = (3 + ((Math.abs(spans.length / 2 - j)) / 20)).toFixed(2)
        tlWords.to(span, 1.4, {
          y: 0,
          ease: 'Expo.easeOut'
        }, delay)
      })
    })
    return tl
  }

  function animateBackground(tl) {
    const wrapper = document.querySelector('.bg-lines-wrapper')
    const createLines = qty => {
      for (let i = 0; i < qty; i++) {
        const line = document.createElement('div')
        line.classList.add('line')
        wrapper.appendChild(line)
        tl.set(line, {
            x: _.random(window.innerWidth),
            y: _.random(window.innerHeight),
            z: _.random(-200, 200),
            width: _.random(0, 100) + 50,
            scaleX: 0
          })
      }
    }

    function animateLines(lines) {
      for (let line of lines) {
        const startTime = _.random(5, true)
        tl.to(line, .4, {
            scaleX: 1,
            ease: 'Expo.Power4'
          }, startTime)
          .to(line, 2, {
            scaleX: 0,
            x: '+=' + line.style.width,
            ease: 'Power4.easeOut'
          }, startTime + .4)
      }

      // 3d rotation
      const rotate = (rx, ry) => {
        TweenMax.to(wrapper, .75, {
            rotationX: ry,
            rotationY: rx,
            ease: 'Power0.easenone'
          })
      }

      // update rotation values
      function update(elem, event, tilt) {
        if (tilt) {
          const tiltLR = event.gamma
          const tiltFB = event.beta
          rotate(tiltLR / 1.5, tiltFB / 1.5)

          return
        }

        const xpos = event.layerX || event.offsetX
        const ypos = event.layerY || event.offsetY

        const ax = -(window.innerWidth / 2 - xpos) / 40
        const ay = (window.innerHeight / 2 - ypos) / 10
        rotate(ax, ay)
      }

      // get element for mousemove event tracking
      // on top of all other layers
      const trackerLayer = document.querySelector('.mouse-tracker-layer')
      trackerLayer.addEventListener('mousemove', e => window.requestAnimationFrame(() => update(wrapper, e)))

      if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', e =>
          window.requestAnimationFrame(() => update(wrapper, e, true)))
      }
    }

    createLines(50)
    animateLines(wrapper.querySelectorAll('.line'))
  }

  return {
    animateLogo,
    animateWords,
    animateBackground
  }
}

// Choose light/dark foreground based on current accent color for readability
function chooseIntroForegroundFromAccent() {
  try {
    const root = document.documentElement
    let accent = getComputedStyle(root).getPropertyValue('--accent-raw').trim()
    if (!accent) return
    let r, g, b
    if (accent.startsWith('rgb')) {
      const m = accent.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i)
      if (m) { r = +m[1]; g = +m[2]; b = +m[3] }
    } else {
      let hex = accent.replace('#','')
      if (hex.length === 3) hex = hex.split('').map(c=>c+c).join('')
      r = parseInt(hex.substring(0,2),16)
      g = parseInt(hex.substring(2,4),16)
      b = parseInt(hex.substring(4,6),16)
    }
    if (typeof r === 'number' && typeof g === 'number' && typeof b === 'number') {
      const yiq = (r * 299 + g * 587 + b * 114) / 1000
      const fg = yiq >= 128 ? '#111111' : '#ffffff'
      root.style.setProperty('--intro-foreground', fg)
    }
  } catch (e) { /* noop */ }
}

/* Animation calls moved into onMounted() */

export default {
  emits: ['complete'],
  setup(props, { emit }) {
    const isVisible = ref(true)
    onMounted(() => {
      // ensure readable text regardless of accent
      chooseIntroForegroundFromAccent()
      // lock scroll while intro is visible
      const prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      // Safeguard: ensure GSAP and lodash are present
      if (typeof window !== 'undefined' && typeof window.TimelineMax !== 'undefined' && typeof window._ !== 'undefined') {
        try {
          const tlLogo = new TimelineMax()
          const tlWords = new TimelineMax()
          intro().animateLogo(tlLogo)
          intro().animateWords(tlWords)

          // Fade out overlay once both animations are roughly done
          const overlay = document.getElementById('intro')
          const fadeDelay = 3.6 // seconds after start
          TweenMax.to(overlay, 1.8, {
            delay: fadeDelay,
            opacity: 0,
            ease: 'Power2.easeInOut',
            onComplete: () => { 
              isVisible.value = false 
              document.body.style.overflow = prevOverflow
              try { emit('complete') } catch (e) {}
            }
          })
          // Optionally enable background if desired:
          // intro().animateBackground(new TimelineMax({ delay: 2.8, repeat: -1, repeatDelay: 0 }))
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn('Intro animation failed to start:', e)
          // Fallback: end intro quickly
          setTimeout(() => { 
            isVisible.value = false
            document.body.style.overflow = prevOverflow
            try { emit('complete') } catch (err) {}
          }, 1200)
        }
      } else {
        // eslint-disable-next-line no-console
        console.warn('Intro dependencies missing: ensure GSAP v2 and lodash are loaded')
        // End intro quickly if deps missing
        setTimeout(() => { 
          isVisible.value = false
          document.body.style.overflow = prevOverflow
          try { emit('complete') } catch (e) {}
        }, 1200)
      }
    })
    return { isVisible }
  }
}
</script>

<style lang="stylus" scoped>
@import 'nib';
// Use site variables when available
introBg = var(--intro-neutral, #2e2e2e);

/* Full-screen overlay glass */
.intro-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 9999;
  /* tint with neutral color (use unquote to keep CSS var intact for Stylus) */
  background: unquote('rgba(var(--intro-neutral-rgb, 46, 46, 46), 0.08)');
  backdrop-filter: blur(12px) saturate(1.2);
  -webkit-backdrop-filter: blur(12px) saturate(1.2);
  border: 1px solid unquote('rgba(var(--intro-neutral-rgb, 46, 46, 46), 0.20)');
}

.absolute-center {
  absolute: top 0 right 0 bottom 0 left 0;
  margin: auto;
}

.section {
  position: relative;
  width: 100%;
  min-height: 100vh;
}

.section--intro {
  overflow: hidden;
}

html, body {
  width: 100%;
  min-height: 100%;
  background: #f0f0f0;
  overflow-x: hidden;
}

.wrapper {
  size: 960px 100%;
  margin: auto;
  z-index: 14;
  position: relative;
}

.square-wrapper {
  @extend .absolute-center;
  size: 225px;
  background: unquote('rgba(var(--intro-neutral-rgb, 46, 46, 46), 0.12)');
  border: 1px solid unquote('rgba(var(--intro-neutral-rgb, 46, 46, 46), 0.30)');
  box-shadow: 0 8px 30px rgba(0,0,0,.25), 0 2px 8px rgba(0,0,0,.18);
}

.line {
  absolute: top 0 left 0;
  width: 100%;
  size: 100% 4px;
  background: introBg;
  &:nth-child(3) {
    top: auto;
    bottom: 0;
  }
  &:nth-child(2), &:nth-child(4) {
    top: 50%;
    left: -50%;
    margin-top: -2px;
    transform: rotate(90deg);
  }
  &:nth-child(2) {
    left: 50%;
  }
}

.square-dark-wrapper {
  @extend .absolute-center;
  size: 0;
  will-change: transform;
  transform: scale(0);
}

.square-dark {
  /* milky glass circle with neutral tint */
  background: unquote('rgba(var(--intro-neutral-rgb, 46, 46, 46), 0.14)');
  border: 1px solid unquote('rgba(var(--intro-neutral-rgb, 46, 46, 46), 0.22)');
  border-radius: 50%;
  transform: translateX(-50%) translateY(-50%);
}

.sparks {
  @extend .absolute-center;
  size: 100px;
}

.spark {
  transform: rotate(45deg);
  size: 100%;
  absolute: top 0 right -200%;
  will-change: stroke-dashoffset;
  stroke-dasharray: 145;
  stroke-dashoffset: -145;
  &:last-child {
    left: -200%;
    right: auto;
    transform: rotate(-135deg);
  }
}

.pango-logo-group {
  @extend .absolute-center;
  margin-top: -5rem;
  z-index: 15;
}

.pango-logo {
  @extend .absolute-center;
  size: 250px;
  z-index: 16;
  opacity: 0;
  transform: scale(.9);
  object-fit: contain;
  image-rendering: auto;
}

.pango-words {
  size: 190px 120px;
  font-family: 'Lato';
  font-size: 3rem;
  font-weight: 300;
  /* Use high-contrast foreground from theme with fallback */
  color: var(--intro-foreground, var(--accent-foreground, #ffffff));
  @extend .absolute-center;
  top: auto;
  bottom: 10%;
  overflow: hidden;
  will-change: opacity;
  text-shadow: 0 1px 2px rgba(0,0,0,.35), unquote('0 0 10px rgba(var(--intro-neutral-rgb, 46, 46, 46), .18)');

  .line-separator {
    size: 90% 1px;
    background: var(--intro-foreground, var(--accent-foreground, #ffffff));
    will-change: transform;
    margin: .2em auto;
  }
}

.pango-word {
  text-align: center;
  display: block;
  overflow: hidden;
  line-height: 1;
  span {
    will-change: transform;
    display: inline-block;
  }
  &:last-of-type {
    letter-spacing: 0.11em;
    font-size: 1.4rem;
    font-weight: 100;
  }
}

.outer-logo-circle {
  @extend .absolute-center;
  size: 190px;
  z-index: 14;
  transform-origin: 50% 50%;
  transform: rotate(-90deg) scale(.9);
  .circle {
    transform: translateZ(1px);
    /* follow readable foreground */
    stroke: var(--intro-foreground, var(--accent-foreground, #ffffff));
    stroke-dasharray: 2072;
    stroke-dashoffset: 2072;
    stroke-width: 16px;
  }
}

.bg-lines-wrapper {
  size: 100%;
  absolute: top 0 left 0;
  z-index: 10;
  will-change: transform;
  transform: perspective(1000px) rotateX(45deg);
  transform-style: preserve-3d;
  .line {
    absolute: top 0 left 0;
    /* fallback dark gray with alpha */
    background: rgba(46, 46, 46, 0.28);
    size: 2px;
    transform: scaleX(0);
    transform-origin: 0 50%;
  }
}

/* Sparks follow neutral color */
.spark path {
  stroke: var(--intro-neutral, #2e2e2e);
}

.mouse-tracker-layer {
  absolute: top 0 left 0;
  size: 100%;
  z-index: 18;
}

.top-nav {
  absolute: top 0 right 0;
  z-index: 19;
}

.nav-list {
  list-style: none;
  padding: 1rem 2rem;
}

.nav-list--item {
  display: inline-block;
  a {
    color: #f0f0f0;
    padding: .4rem;
    margin: 0 .4rem;
    display: block;
    text-transform: uppercase;
    text-decoration: none;
    transition: all .2s ease;
    border: 1px solid transparent;
    &:hover {
      border-color: currentColor;
    }
  }
}
</style>
