import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'

const routes = [
  // Unified Home at '/': wrapper decides by preferred language
  { path: '/', name: 'home', component: () => import('../pages/HomeIndex.vue'), meta: { showIntro: true } },
  // Keep '/home' for old links: redirect to '/'
  { path: '/home', redirect: '/' },
  // Legacy '/start' routes redirect to root
  { path: '/start', redirect: '/' },

  // German primary paths
  // Use ASCII primary path; keep umlaut as alias to avoid server issues on refresh
  { path: '/uebermich', name: 'de-about', component: () => import('../pages/About.vue'), alias: ['/übermich'] },
  { path: '/gallerie', name: 'de-gallery', component: () => import('../pages/Gallery.vue'), alias: ['/galerie'] },
  { path: '/blog/de', name: 'de-blog', component: () => import('../pages/Blog.vue') },
  // Unified Blog at '/blog': wrapper decides by preferred language
  { path: '/blog', name: 'blog', component: () => import('../pages/BlogIndex.vue') },
  { path: '/projekte', name: 'de-projects', component: () => import('../pages/Projects.vue') },
  { path: '/kontakt', name: 'de-contact', component: () => import('../pages/Contact.vue') },
  { path: '/leistungen', name: 'de-services', component: () => import('../pages/Services.vue') },
  { path: '/impressum', name: 'de-impressum', component: () => import('../pages/Publisher.vue') },
  { path: '/datenschutz', name: 'de-datenschutz', component: () => import('../pages/Privacy.vue') },

  // English counterparts (mount minimal wrappers where applicable)
  { path: '/aboutme', name: 'en-about', component: () => import('../pages/AboutEn.vue') },
  { path: '/gallery', name: 'en-gallery', component: () => import('../pages/GalleryEn.vue') },
  { path: '/blog/eng', name: 'en-blog', component: () => import('../pages/BlogEn.vue') },
  { path: '/projects', name: 'en-projects', component: () => import('../pages/ProjectsEn.vue') },
  { path: '/contact', name: 'en-contact', component: () => import('../pages/ContactEn.vue') },
  { path: '/service', name: 'en-services', component: () => import('../pages/ServicesEn.vue') },
  { path: '/privacy', name: 'en-privacy', component: () => import('../pages/PrivacyEn.vue'), alias: ['/Privacy'] },
  { path: '/publisher', name: 'en-publisher', component: () => import('../pages/PublisherEn.vue') },

  // Unknown routes go to root, but valid subpages remain on refresh
  { path: '/:pathMatch(.*)*', redirect: '/' },
  { path: '/test', name: 'test', component: () => import('../components/NorthernLights.vue') },
]

const router = createRouter({
  // Always use clean history; FTP uses .htaccess fallback and GH Pages uses 404.html
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
