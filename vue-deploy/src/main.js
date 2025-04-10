import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/styles.css';

const baseURL = window.location.origin.includes('localhost')
    ? 'http://localhost:8080/AboutMe/#/'
    : 'https://cedric-cj.github.io/AboutMe/#/';

const normalizeHash = (hash) => hash.replace(/\/$/, '');
const currentHash = normalizeHash(window.location.hash);

const performanceMode = localStorage.getItem('performanceMode');

if (performanceMode !== null) {
    if (performanceMode === "false") {
        // Performance OFF → Falls der Hash nicht mit '#/de' oder '#/eng' beginnt,
        // leite zur bevorzugten Sprachseite weiter.
        if (!currentHash.startsWith('#/de') && !currentHash.startsWith('#/eng')) {
            const preferredLanguage = localStorage.getItem('preferredLanguage') || 'de';
            window.location.href = `${baseURL}${preferredLanguage}`;
        }
    } else {
        // Performance ON → Nur umleiten, wenn der Hash nicht mit '#/performance' beginnt
        if (!currentHash.startsWith('#/performance')) {
            window.location.href = `${baseURL}performance`;
        }
    }
} else {
    // Falls Performance-Modus nicht gesetzt: Standardmäßig aktivieren
    localStorage.setItem('performanceMode', "true");
    if (!currentHash.startsWith('#/performance')) {
        window.location.href = `${baseURL}performance`;
    }
}

createApp(App).use(router).mount('#app');