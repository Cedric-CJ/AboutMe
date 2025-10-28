import { defineStore } from 'pinia'

function getContrastYIQ(hex) {
  let color = hex.replace('#', '')
  if (color.length === 3) color = color.split('').map(c => c + c).join('')
  const r = parseInt(color.substring(0, 2), 16)
  const g = parseInt(color.substring(2, 4), 16)
  const b = parseInt(color.substring(4, 6), 16)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000
  return yiq >= 128 ? '#000000' : '#ffffff'
}

export const useThemeStore = defineStore('theme', {
  state: () => ({
    accent: localStorage.getItem('accent') || '#3b82f6', // default blue
    motion: true
  }),
  actions: {
    setAccent(color) {
      this.accent = color
      localStorage.setItem('accent', color)
      const contrast = getContrastYIQ(color)
      const root = document.documentElement
      root.style.setProperty('--accent', `0 0% 0%`) // not used directly in hsl
      root.style.setProperty('--primary', '240 100% 60%')
      root.style.setProperty('--accent-foreground', contrast === '#ffffff' ? '0 0% 100%' : '0 0% 0%')
      // also expose raw color
      root.style.setProperty('--accent-raw', color)
      // expose rgb for background tinting
      const c = color.replace('#','')
      const rr = parseInt(c.substring(0,2),16)
      const gg = parseInt(c.substring(2,4),16)
      const bb = parseInt(c.substring(4,6),16)
      root.style.setProperty('--accent-rgb', `${rr}, ${gg}, ${bb}`)

      // Update browser UI theme colors (create if missing)
      const updateOrCreateMeta = (name, content) => {
        let el = document.querySelector(`meta[name="${name}"]`)
        if (!el) {
          el = document.createElement('meta')
          el.setAttribute('name', name)
          document.head.appendChild(el)
        }
        el.setAttribute('content', content)
      }
      updateOrCreateMeta('theme-color', color)
      updateOrCreateMeta('msapplication-navbutton-color', color)
    },
    setMotion(v) { this.motion = v }
  }
})
