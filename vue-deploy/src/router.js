import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/components/HomePage.vue';
import ImpressumPage from '@/components/DSGVO/ImpressumPage.vue';
import PrivacyPolicy from "@/components/DSGVO/PrivacyPolicy.vue";

const routes = [
    { path: '/', component: HomePage },
    { path: '/impressum', component: ImpressumPage },
    { path: '/:notFound(.*)', redirect: '/' },
    { path: '/PrivacyPolicy', component: PrivacyPolicy },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;