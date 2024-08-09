import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/components/HomePage.vue';
import ImpressumPage from '@/components/DSGVO/ImpressumPage.vue';
import PrivacyPolicy from "@/components/DSGVO/PrivacyPolicy.vue";
import WorkInProgressPage from "@/components/WorkInProgressPage.vue";

const routes = [
    { path: '/', name: "Home", component: HomePage },
    { path: '/impressum', name: "Impressum", component: ImpressumPage },
    { path: '/:notFound(.*)', redirect: '/' },
    { path: '/PrivacyPolicy', name: "Datenschutz", component: PrivacyPolicy },
    { path: '/workInProgress', name: "Work in Progress...", component: WorkInProgressPage},
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;