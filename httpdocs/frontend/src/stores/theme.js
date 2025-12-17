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

const HOLIDAY_ACCENT = '#a61715'
const HOLIDAY_ACCENT_RGB = '166, 23, 21'

function getFirstAdvent(year) {
  const start = new Date(year, 10, 27) // Nov 27th (month is 0-indexed)
  for (let i = 0; i < 7; i++) {
    const candidate = new Date(start)
    candidate.setDate(start.getDate() + i)
    if (candidate.getDay() === 0) return candidate // Sunday
  }
  return new Date(year, 10, 27)
}

function getTotensonntag(year) {
  const firstAdvent = getFirstAdvent(year)
  const tot = new Date(firstAdvent)
  tot.setDate(tot.getDate() - 7)
  return tot
}

function getChristmasWindow(year) {
  const totensonntag = getTotensonntag(year)
  const start = new Date(totensonntag)
  start.setDate(totensonntag.getDate() + 1) // Monday after Totensonntag
  const end = new Date(year + 1, 0, 6, 23, 59, 59, 999) // Jan 6 of next year
  return { start, end }
}

function isChristmasSeason(now = new Date()) {
  const thisWindow = getChristmasWindow(now.getFullYear())
  const prevWindow = getChristmasWindow(now.getFullYear() - 1)
  return (now >= prevWindow.start && now <= prevWindow.end) || (now >= thisWindow.start && now <= thisWindow.end)
}

function shouldForceHolidayAccent(savedAccent) {
  if (!savedAccent) return true
  const normalized = resolveAccentValue(savedAccent)
  return normalized === ACCENT_PRESETS['--accent-yellow'] || normalized === '#f0c33c'
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
    motion: true,
    debugThemeOverride: (() => {
      try {
        return sessionStorage.getItem('debugThemeOverride') || null
      } catch (e) {
        return null
      }
    })()
  }),
  actions: {
    setAccent(color, options = {}) {
      const { persist = true } = options
      const resolved = resolveAccentValue(color)
      this.accent = resolved
      if (persist) localStorage.setItem('accent', resolved)
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
    applySeasonalTheme(now = new Date(), options = {}) {
      const isLocal = (() => {
        if (typeof window === 'undefined') return false
        const h = String(window.location.hostname || '')
        return h === 'localhost' || h === '127.0.0.1' || h === '::1'
      })()
      const root = document.documentElement
      const override = isLocal ? (options.debugOverride ?? this.debugThemeOverride) : null

      let holidayActive = false

      if (override === 'holiday') holidayActive = true
      else if (override === 'none') { holidayActive = false }
      else if (!isLocal) {
        holidayActive = isChristmasSeason(now)
      } else {
        holidayActive = isChristmasSeason(now)
      }

      root.classList.toggle('holiday-theme', holidayActive)
      root.style.setProperty('--holiday-accent-raw', HOLIDAY_ACCENT)
      root.style.setProperty('--holiday-accent-rgb', HOLIDAY_ACCENT_RGB)

      if (holidayActive) {
        const rawStored = (() => { try { return localStorage.getItem('accent') } catch (e) { return null } })()
        const useHolidayAccent = shouldForceHolidayAccent(rawStored)
        const accentToApply = useHolidayAccent ? HOLIDAY_ACCENT : resolveAccentValue(rawStored || this.accent)
        this.setAccent(accentToApply, { persist: false })
        return
      }

      // Outside the holiday window: re-apply the stored accent without re-persisting it
      this.setAccent(this.accent, { persist: false })
    },
    setMotion(v) { this.motion = v },
    setDebugThemeOverride(mode) {
      const isLocal = (() => {
        if (typeof window === 'undefined') return false
        const h = String(window.location.hostname || '')
        return h === 'localhost' || h === '127.0.0.1' || h === '::1'
      })()
      if (!isLocal) return
      const normalized = ['holiday', 'none'].includes(mode) ? mode : null
      this.debugThemeOverride = normalized
      try { sessionStorage.setItem('debugThemeOverride', normalized || '') } catch (e) {}
      this.applySeasonalTheme(new Date(), { debugOverride: normalized })
      try { window.dispatchEvent(new Event('theme_override_changed')) } catch (e) {}
    }
  }
})
