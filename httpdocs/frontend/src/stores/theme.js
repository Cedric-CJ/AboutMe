import { defineStore } from 'pinia'

const ACCENT_PRESETS = {
  '--accent-yellow': '#f0c33c',
  yellow: '#f0c33c',
  '--accent-red': '#ff5353',
  red: '#ff5353',
  '--accent-green': '#45b945',
  green: '#45b945',
  '--accent-purple': '#9f6ef5',
  purple: '#9f6ef5',
  '--accent-teal': '#12b3a6',
  teal: '#12b3a6',
}

function resolveAccentValue(value) {
  if (!value) return '#f0c33c'
  const trimmed = String(value).trim()
  if (ACCENT_PRESETS[trimmed]) return ACCENT_PRESETS[trimmed]
  // handle var(--accent-*)
  const varMatch = trimmed.match(/^var\((--[a-zA-Z0-9-]+)\)$/)
  if (varMatch && ACCENT_PRESETS[varMatch[1]]) return ACCENT_PRESETS[varMatch[1]]
  return trimmed
}

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
    accent: resolveAccentValue(localStorage.getItem('accent') || '#f0c33c'), // default yellow
    motion: true
  }),
  actions: {
    setAccent(color) {
      const resolved = resolveAccentValue(color)
      this.accent = resolved
      localStorage.setItem('accent', resolved)
      const contrast = getContrastYIQ(resolved)
      const root = document.documentElement
      root.style.setProperty('--accent', `0 0% 0%`) // not used directly in hsl
      root.style.setProperty('--primary', '240 100% 60%')
      root.style.setProperty('--accent-foreground', contrast === '#ffffff' ? '0 0% 100%' : '0 0% 0%')
      root.style.setProperty('--accent-text', contrast)
      // also expose raw color
      root.style.setProperty('--accent-raw', resolved)
      // expose rgb for background tinting
      const c = resolved.replace('#','')
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
      updateOrCreateMeta('theme-color', resolved)
      updateOrCreateMeta('msapplication-navbutton-color', resolved)
    },
    setMotion(v) { this.motion = v }
  }
})
