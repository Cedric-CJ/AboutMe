import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  // Root redirects to /start (DE home)
  { path: '/', redirect: '/start' },

  // German primary paths
  { path: '/start', name: 'de-home', component: () => import('../pages/Home.vue'), meta: { showIntro: true } },
  // Use ASCII primary path; keep umlaut as alias to avoid server issues on refresh
  { path: '/uebermich', name: 'de-about', component: () => import('../pages/About.vue'), alias: ['/übermich'] },
  { path: '/gallerie', name: 'de-gallery', component: () => import('../pages/Gallery.vue'), alias: ['/galerie'] },
  { path: '/blog/de', name: 'de-blog', component: () => import('../pages/Blog.vue') },
  { path: '/projekte', name: 'de-projects', component: () => import('../pages/Projects.vue') },
  { path: '/kontakt', name: 'de-contact', component: () => import('../pages/Contact.vue') },
  { path: '/leistungen', name: 'de-services', component: () => import('../pages/Services.vue') },
  { path: '/impressum', name: 'de-impressum', component: () => import('../pages/Publisher.vue') },
  { path: '/datenschutz', name: 'de-datenschutz', component: () => import('../pages/Privacy.vue') },

  // English counterparts (mount minimal wrappers where applicable)
  { path: '/home', name: 'en-home', component: () => import('../pages/HomeEn.vue'), meta: { showIntro: true } },
  { path: '/aboutme', name: 'en-about', component: () => import('../pages/AboutEn.vue') },
  { path: '/gallery', name: 'en-gallery', component: () => import('../pages/GalleryEn.vue') },
  { path: '/blog/eng', name: 'en-blog', component: () => import('../pages/BlogEn.vue') },
  { path: '/projects', name: 'en-projects', component: () => import('../pages/ProjectsEn.vue') },
  { path: '/contact', name: 'en-contact', component: () => import('../pages/ContactEn.vue') },
  { path: '/service', name: 'en-services', component: () => import('../pages/ServicesEn.vue') },
  { path: '/Privacy', name: 'en-privacy', component: () => import('../pages/PrivacyEn.vue') },
  { path: '/publisher', name: 'en-publisher', component: () => import('../pages/PublisherEn.vue') },

  // Unknown routes go to /start, but valid subpages remain on refresh
  { path: '/:pathMatch(.*)*', redirect: '/start' },
  { path: '/test', name: 'test', component: () => import('../components/NorthernLights.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
