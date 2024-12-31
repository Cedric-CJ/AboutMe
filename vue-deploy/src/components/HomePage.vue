### Erstellt von Cedric visit my [GitHub](https://cedric-cj.github.io/AboutMe/)
//Timeline inspiriert von https://github.com/ftes/react-dual-timeline
<template>
  <div class="container">
    <main>
      <h1>Willkommen auf meiner Seite</h1>
      <div class="about-me">
        <p class="fade-in">Hier findest du Informationen über mich und meine Projekte.</p>
        <p class="fade-in">Viel Spaß beim Stöbern!</p>
      </div>
      <section class="who-am-i">
        <h2>Wer bin ich?</h2>
        <p>Mein Name ist Cedric Arnhold und ich studiere derzeit Wirtschaftsinformatik an der Hochschule für Technik und Wirtschaft Berlin (HTW).</p>
      </section>
      <section class="why-this-site">
        <h2>Warum mache ich diese Seite?</h2>
        <p>Diese Webseite dient als zentrale Anlaufstelle und spiegelt meine aktuellen Projekte wider. Mein Ziel ist es, kleinen und mittelständischen Unternehmen beim Umstieg in die Digitalisierung zu helfen. Viele Unternehmen haben nicht die Zeit, sich kontinuierlich um ihre Online-Präsenz zu kümmern, bis ein Brief vom Provider sie darauf hinweist, dass das Impressum, die Datenschutzerklärung oder die Sicherheit der Seite gefährdet sind. Dies kann letztendlich zu Strafen führen.</p>
      </section>
      <section class="my-skills">
        <h2>Meine Fähigkeiten</h2>
        <div class="skills-list">
          <div class="skill-category">
            <h3>Frontend</h3>
            <ul>
              <li>HTML</li>
              <li>CSS</li>
              <li>JavaScript</li>
              <li>Vue</li>
              <li>React</li>
            </ul>
          </div>
          <div class="skill-category">
            <h3>Backend</h3>
            <ul>
              <li>Python</li>
              <li>Java</li>
              <li>Spring Boot</li>
            </ul>
          </div>
          <div class="skill-category">
            <h3>Datenbanken</h3>
            <ul>
              <li>PostgreSQL</li>
              <li>Oracle</li>
            </ul>
          </div>
          <div class="skill-category">
            <h3>Sonstiges</h3>
            <ul>
              <li>Docker</li>
              <li>Render</li>
            </ul>
          </div>
        </div>
        <div class="skill-category">
          <h3>Aktuell am Ausprobieren</h3>
          <ul>
            <li>Dart/Flutter</li>
            <li>Lokale Ki</li>
          </ul>
        </div>

      </section>
      <h1>Mein Lebenslauf</h1>
      <div class="timeline">
        <ul>
          <li v-for="event in events" :key="event.year">
            <div>
              <time>{{ event.year }}: {{event.title}}</time>
              <p>{{ event.description }}</p>
            </div>
          </li>
        </ul>
      </div>
      <h1>Meine Projekte</h1>
      <div class="projects-list">
        <div class="project" v-for="project in projects" :key="project.name">
          <div class="laptop-frame">
            <img src="@/assets/Pictures/Laptop.png" alt="Laptop" class="laptop-image" />
            <div class="laptop-screen">
              <iframe :src="project.link" class="live-iframe"></iframe>
            </div>
          </div>
          <p class="project-name">{{ project.name }}</p>
          <p class="project-description">{{ project.description }}</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const projects = ref([
  {
    name: "Virtual Pet",
    link: "https://virtual-pet-bcky.onrender.com/",
    description: "Ein Studienprojekt mit Funktionen zur Benutzerregistrierung, Anmeldung und Verwaltung eines virtuellen Haustiers, bei dem der Benutzer zwischen zwei Tieren wählen, ihnen Namen geben und sie füttern, pflegen oder mit ihnen spielen kann. Die Bedürfnisse der Tiere werden über Statusleisten angezeigt, und bei mangelnder Pflege kann das Tier sterben, sodass ein neues erstellt werden muss. Eine Bestenliste zeigt die Top-Tiere an.\n\n*Derzeit leider nicht funktionsfähig, da die Datenbank nicht mehr aktiv ist.*",
  },
  {
    name: "Metallbaumeister Webseite",
    link: "https://mz24.net/",
    description: "Modernisierung der Webseite meines Vaters mit aktualisierten Datenschutz- und Impressumsseiten, einer dynamischeren Gestaltung und einer verbesserten Galerie mit Bild-Durchschaltung und Vorher-Nachher-Slider für einen modernen Look. Die Seite wurde so konzipiert, dass sie benutzerfreundlicher und optisch ansprechender ist, mit intuitiven Navigationselementen und verbesserter Ladezeit.",
  },
]);

const events = ref([
  { year: 2026, title: "Bachelor of Science - Wirtschaftsinformatik", description: "An der Hochschule für Technik und Wirtschaft Berlin. Studium von 2022–2026." },
  { year: 2024, title: "Praktikum im BMDV Abteilung z33", description: "4. Fachsemester 3,5 Monatiges Betriebspraktikum im Betrieb der Informationstechnik (IT-Betrieb)/Fach-Auftraggeberschnittstelle (F-AGS) BMDV"},
  { year: 2022, title: "Werksstudent bei Kaufland", description: "Kaufland Deutschland. Seit Juni 2022 als Werksstudent tätig." },
  { year: 2022, title: "Abitur", description: "Ernst-Haeckel-Schule. Abschluss mit 2,8er im Mathe-Geschichte Abitur." },
  { year: 2018, title: "Praktikum Finanzamt Marzahn-Hellersdorf", description: "Praktikum beim Finanzamt Marzahn-Hellersdorf, mit Erfahrungen sowohl im Büro als auch bei Verhandlungen." },
  { year: 2016, title: "Praktikum bei Dr. Albrecht & Plogmaker GbR", description: "Fünf freiwillige Praktika bei der Steuerkanzlei, wo ich tiefe Einblicke in die Steuerberatung erhielt." },
]);

onMounted(() => {
  const targets = document.querySelectorAll(".timeline ul li");
  const threshold = 0.5;
  const ANIMATED_CLASS = "in-view";

  function callback(entries, observer) {
    entries.forEach((entry) => {
      const elem = entry.target;
      if (entry.intersectionRatio >= threshold) {
        elem.classList.add(ANIMATED_CLASS);
        observer.unobserve(elem);
      } else {
        elem.classList.remove(ANIMATED_CLASS);
      }
    });
  }

  const observer = new IntersectionObserver(callback, { threshold });
  for (const target of targets) {
    observer.observe(target);
  }
})
</script>
<style>
html, body {
  overflow-x: hidden;
}

body {
  margin: 0;
  font-family: Arial, sans-serif;
}

.timeline {
  margin-left: -50px;
  position: relative;
  z-index: 0;
}

.timeline ul li {
  margin-left: -50px;
}

.projects-list {
  display: flex;
  flex-wrap: wrap;
  gap: 50px;
  justify-content: center;
  margin-top: 20px;
}

.project-description {
  font-size: 1rem;
  color: #ccc; /* Hellgraue Schriftfarbe */
  text-align: center;
  max-width: 90%;
  margin: 10px auto;
  line-height: 1.5;
}

.project {
  text-align: center;
}

.laptop-frame {
  position: relative;
  width: 100vw; /* Verwenden Sie vw, um die Breite relativ zur Fensterbreite zu setzen */
  height: calc(100vw * 0.66); /* Verhältnis des Laptop-Bildes: Breite zu Höhe, hier z. B. 16:10 */
  max-width: 150vh; /* Maximale Größe: passt sich an die Höhe des Bildschirms an */
  max-height: calc(150vh * 0.66); /* Verhindert Überschreiten des Bildschirms */
  margin: auto;
}

.laptop-image {
  width: 100%;
  height: auto;
  display: block;
  z-index: 1;
}

.laptop-screen {
  position: absolute;
  top: 10%; /* Adjust to fit the screen area of the laptop */
  left: 15%; /* Adjust to fit the screen area of the laptop */
  width: 70%; /* Adjust width to fit the screen area */
  height: 65%; /* Adjust height to fit the screen area */
  background: var(--background-color); /* Fallback background color */
  overflow: hidden;
}

.live-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

</style>