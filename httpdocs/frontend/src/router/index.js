import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'

const routes = [
  // Unified Home at '/': wrapper decides by preferred language
  { path: '/', name: 'home', component: () => import('../pages/Home.vue'), meta: { showIntro: true } },
  { path: '/legal-gate', name: 'legal-gate', component: () => import('../pages/LegalGate.vue') },

  // German primary paths
  // Use ASCII primary path; keep umlaut as alias to avoid server issues on refresh
  { path: '/uebermich', name: 'de-about', component: () => import('../pages/About.vue'), alias: ['/übermich'] },
  { path: '/gallerie', name: 'de-gallery', component: () => import('../pages/Gallery.vue'), alias: ['/galerie'] },
  { path: '/blog/de', name: 'de-blog', component: () => import('../pages/Blog.vue') },
  // Unified Blog at '/blog': wrapper decides by preferred language
  { path: '/blog', name: 'blog', component: () => import('../pages/Blog.vue') },
  { path: '/projekte', name: 'de-projects', component: () => import('../pages/Projects.vue') },
  { path: '/kontakt', name: 'de-contact', component: () => import('../pages/Contact.vue') },
  { path: '/leistungen', name: 'de-services', component: () => import('../pages/Services.vue') },
  { path: '/impressum', name: 'de-impressum', component: () => import('../pages/Publisher.vue') },
  { path: '/datenschutz', name: 'de-datenschutz', component: () => import('../pages/Privacy.vue') },

  // English counterparts (mount minimal wrappers where applicable)
  { path: '/aboutme', name: 'en-about', component: () => import('../pages/About.vue') },
  { path: '/gallery', name: 'en-gallery', component: () => import('../pages/Gallery.vue') },
  { path: '/blog/eng', name: 'en-blog', component: () => import('../pages/Blog.vue') },
  { path: '/projects', name: 'en-projects', component: () => import('../pages/Projects.vue') },
  { path: '/contact', name: 'en-contact', component: () => import('../pages/Contact.vue') },
  { path: '/service', name: 'en-services', component: () => import('../pages/Services.vue') },
  { path: '/privacy', name: 'en-privacy', component: () => import('../pages/Privacy.vue'), alias: ['/Privacy'] },
  { path: '/publisher', name: 'en-publisher', component: () => import('../pages/Publisher.vue') },

  // Unknown routes go to root, but valid subpages remain on refresh
  { path: '/:pathMatch(.*)*', redirect: '/' },
  { path: '/test', name: 'test', component: () => import('../components/NorthernLights.vue') },
]

const router = createRouter({
  // Always use clean history; FTP uses .htaccess fallback and GH Pages uses 404.html
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Lightweight bot gate for legal pages (session-based) + contact overlay routing
const legalPaths = ['/impressum', '/datenschutz', '/privacy', '/publisher']
const contactPaths = ['/contact', '/kontakt']
router.beforeEach((to, from, next) => {
  try {
    // Turn contact routes into overlay instead of a standalone page
    if (contactPaths.includes(to.path)) {
      try { window.dispatchEvent(new CustomEvent('open_contact_overlay')) } catch (e) {}
      // Direct load on /contact: redirect to home while keeping overlay flag
      if (!from || !from.name) {
        sessionStorage.setItem('contact_overlay_request', '1')
        return next({ path: '/', replace: true })
      }
      return next(false) // stay on current page, just open overlay
    }

    if (to.name === 'legal-gate') return next()
    if (legalPaths.includes(to.path)) {
      const pass = sessionStorage.getItem('legal_pass') === '1'
      if (!pass) {
        return next({ path: '/legal-gate', query: { target: to.fullPath } })
      }
    }
  } catch (e) {}
  return next()
})

export default router
