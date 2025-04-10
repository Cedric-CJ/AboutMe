import { createRouter, createWebHashHistory } from 'vue-router';
import HomePageDe from '@/components/De/HomePageDe.vue';
import HomePageEng from '@/components/Eng/HomePageEng.vue';
import ImpressumPageDe from '@/components/De/DSGVO/ImpressumPageDe.vue';
import ImpressumPageEng from '@/components/Eng/DSGVO/ImpressumPageEng.vue';
import PrivacyPolicyDe from '@/components/De/DSGVO/PrivacyPolicyDe.vue';
import PrivacyPolicyEng from '@/components/Eng/DSGVO/PrivacyPolicyEng.vue';
import WorkInProgressPageDe from '@/components/De/WorkInProgressPageDe.vue';
import WorkInProgressPageEng from "@/components/Eng/WorkInProgressPageEng.vue";
import ContactMeDe from '@/components/De/ContactMeDe.vue';
import ContactMeEng from '@/components/Eng/ContactMeEng.vue';
import TestPageDe from '@/components/De/TestPageDe.vue';
import TestPageEng from '@/components/Eng/TestPageEng.vue';
import InfoMessageDe from "@/components/De/DSGVO/InfoMessageDe.vue";
import InfoMessageEng from "@/components/Eng/DSGVO/InfoMessageEng.vue";
import BlogPageDe from "@/components/De/BlogPageDe.vue";
import BlogPageEng from "@/components/Eng/BlogPageEng.vue";
import GalleryDe from "@/components/De/GalleryDe.vue";
import GalleryEng from "@/components/Eng/GalleryEng.vue";
import GalleryPerformance from "@/components/Performance/GalleryPerformance.vue";
import HomePagePerformance from "@/components/Performance/HomePagePerformance.vue";
import ContactMePerformance from "@/components/Performance/ContactMePerformance.vue";
import BlogPagePerformance from "@/components/Performance/BlogPagePerformance.vue";

const routes = [
    {
        path: '/',
        beforeEnter: (to, from, next) => {
            const performanceMode = localStorage.getItem('performanceMode');
            if (performanceMode === "false") {
                // Hole die bevorzugte Sprache, Standard ist 'de'
                const preferredLanguage = localStorage.getItem('preferredLanguage') || 'de';
                next(`/${preferredLanguage}`);
            } else {
                next('/performance');
            }
        }
    },
    // Deutsche Routen
    { path: '/de', name: 'HomeDe', component: HomePageDe },
    { path: '/de/gallery', name: 'GalleryDe', component: GalleryDe },
    { path: '/de/impressum', name: 'ImpressumDe', component: ImpressumPageDe },
    { path: '/de/PrivacyPolicy', name: 'DatenschutzDe', component: PrivacyPolicyDe },
    { path: '/de/workInProgress', name: 'WorkInProgressDe', component: WorkInProgressPageDe },
    { path: '/de/contact', name: 'ContactDe', component: ContactMeDe },
    { path: '/de/test', name: 'TestPageDe', component: TestPageDe },
    { path: '/de/infoMessage', name: 'InfoMessageDe', component: InfoMessageDe },
    { path: '/de/blog', name: 'BlogPageDe', component: BlogPageDe },
    // Englische Routen
    { path: '/eng', name: 'HomeEng', component: HomePageEng },
    { path: '/eng/gallery', name: 'GalleryEng', component: GalleryEng },
    { path: '/eng/impressum', name: 'ImpressumEng', component: ImpressumPageEng },
    { path: '/eng/PrivacyPolicy', name: 'PrivacyPolicyEng', component: PrivacyPolicyEng },
    { path: '/eng/workInProgress', name: 'WorkInProgressEng', component: WorkInProgressPageEng },
    { path: '/eng/contact', name: 'ContactEng', component: ContactMeEng },
    { path: '/eng/test', name: 'TestPageEng', component: TestPageEng },
    { path: '/eng/infoMessage', name: 'InfoMessageEng', component: InfoMessageEng},
    { path: "/eng/blog", name: "BlogPageEng", component: BlogPageEng },
    //Performance Routen
    { path: '/performance', name: 'HomePerformance', component: HomePagePerformance },
    { path: '/performance/gallery', name: 'GalleryPerformance', component: GalleryPerformance },
    { path: '/performance/contact', name: 'ContactPerformance', component: ContactMePerformance },
    { path: '/performance/blog', name: 'BlogPerformance', component: BlogPagePerformance },
    // Fallback für ungültige Routen
    { path: '/:notFound(.*)', redirect: '/' },
];

const router = createRouter({
    history: createWebHashHistory('/AboutMe/'),
    routes,
});

export default router;