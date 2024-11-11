import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/components/HomePage.vue';
import ImpressumPage from '@/components/DSGVO/ImpressumPage.vue';
import PrivacyPolicy from "@/components/DSGVO/PrivacyPolicy.vue";
import WorkInProgressPage from "@/components/WorkInProgressPage.vue";
import ContactMe from "@/components/ContactMe.vue";
import TestPage from "@/components/TestPage.vue";

const routes = [
    { path: '/', name: "Home", component: HomePage },
    { path: '/impressum', name: "Impressum", component: ImpressumPage },
    { path: '/:notFound(.*)', redirect: '/' },
    { path: '/PrivacyPolicy', name: "Datenschutz", component: PrivacyPolicy },
    { path: '/workInProgress', name: "Work in Progress...", component: WorkInProgressPage},
    { path: '/contact', name: "Contact", component: ContactMe},
    { path: '/test', name: "TestPage", component: TestPage}];

const router = createRouter({
    history: createWebHistory('/AboutMe/'),
    routes,
});

export default router;