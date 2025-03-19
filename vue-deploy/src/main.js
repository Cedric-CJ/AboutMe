import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/styles.css';

// Prüfen, ob der Nutzer bereits eine bevorzugte Sprache ausgewählt hat
const preferredLanguage = localStorage.getItem('preferredLanguage');

if (preferredLanguage) {
    const languageRoute = preferredLanguage === 'de' ? '/de' : '/eng';

    // Falls du lokal entwickelst, kann der Pfad anders aussehen.
    // Hier die bisherige Logik belassen oder anpassen:
    const baseURL = window.location.origin.includes('localhost')
        ? 'http://localhost:8080/AboutMe/#/'
        : 'https://cedric-cj.github.io/AboutMe/#/';

    const currentHash = window.location.hash;

    // Nur weiterleiten, wenn die aktuelle URL nicht schon die richtige Sprache enthält
    if (!currentHash || currentHash === '#' || currentHash === `#${languageRoute}`) {
        window.location.href = `${baseURL}${languageRoute}`;
    }
}

// App initialisieren
createApp(App).use(router).mount('#app');