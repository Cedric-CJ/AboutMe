 <div align="center">
 
 # AboutMe – Vue 3 (DE/EN)
 
 Eine zweisprachige, moderne Portfolio‑Webseite mit Glas-/ICE‑Look, responsivem UI, Blog, Projekten, Galerie und Demo‑Shop.
 
 </div>
 
 ---
 
 ## Inhalt
 - Überblick
 - Features
 - Projektstruktur
 - Entwicklung (lokal starten, bauen)
 - Deployment (GitHub Pages Workflow)
 - Inhalte pflegen (Blog, Projekte, Shop)
 - Übersetzung / Sprachwechsel
 - Design/Theme (Akzentfarbe, ICE‑Hintergrund)
 - Barrierefreiheit und Performance
 - Troubleshooting
 
 ## Überblick
 Die App ist ein Vue‑3‑Projekt (Vite) mit zweisprachigem Routing (Deutsch/Englisch). Inhalte wie Blogposts werden aus JSON geladen. Das Design folgt einem gläsernen „ICE“-Stil mit anpassbarer Akzentfarbe.
 
 ## Features
 - Sprachumschaltung (DE/EN) mit URL‑Spiegelung der Seiten.
 - Einheitliches Hamburger‑Menü mit animiertem X, Flagge oben rechts, sprachspezifischen Links/Labels.
 - Start/Home: Intro, schnelle Links, Card‑Highlights.
 - About/Über mich: Text, Bild, Skills‑Cloud (gleichmäßige Verteilung + sanfter Drift), Timeline mit Reveal‑Effekt (links/rechts).
 - Gallery: vier Layout‑Demos (Slide/Card/Grid/Box), modaler Viewer – ohne extra Hintergrundeffekte.
 - Blog: datengetrieben über JSON, Karten mit „Weiter lesen/Read more“, weiche Expand‑Transition; Medien (Bild/Video) je Abschnitt; optional Links pro Artikel. Kurze Summary unter dem Titel (ein Einzeiler) – für DE und EN.
 - Projekte/Projects: Karten mit Badges, kurzer Beschreibung im zugeklappten Zustand und ausführlichem Text aufgeklappt; Live/GitHub‑Links; sanfte Expand‑Transition; kleiner „Laptop“-Preview‑Frame möglich.
 - Kontakt/Contact: Icon‑Karten, Anfrageformular (Client‑seitig), später an Backend anschließbar.
 - Shop (Demo): Produktliste, Tag‑Filter (mehrfach), Suche, Warenkorb (LocalStorage), Demo‑Zahlungsbuttons; Adyen‑Dropin vorbereitet (erfordert eigene Keys).
 - Akzentfarbe: frei wählbar; färbt den Hintergrund‑Gradient live.
 - Auto‑Kontrast: text-shadow und semitransparente Blöcke für Lesbarkeit bei hellen Flächen.
 
 ## Projektstruktur
 Wichtigste Verzeichnisse/Dateien:
 - `frontend/`
   - `index.html` – Einstieg, bindet `src/main.js` ein
   - `package.json` – Scripts/Deps
   - `vite.config.js` – Alias `@` auf `src`
   - `tailwind.config.js` – (optional) Tailwind‑Setup, falls verwendet
   - `public/`
     - `BlogsDe.json`, `BlogsEng.json` – Blogdaten (DE/EN)
   - `src/`
     - `main.js`, `App.vue`, `router/index.js`, `stores/theme.js`
     - `pages/` – Seiten (DE/EN)
     - `components/` – UI‑Bausteine (z. B. Galerie‑Layouts)
 
 Hinweis: Falls Dateien fehlen (z. B. bei Re‑Initialisierung), bitte die Seiten nach diesem Schema wieder anlegen. Das Routing war zuletzt so konzipiert:
 - DE: `/start`, `/übermich`, `/gallerie`, `/blog/de`, `/projekte`, `/kontakt`, `/shop/de`, `/impressum`, `/datenschutz`
 - EN: `/home`, `/aboutme`, `/gallery`, `/blog/eng`, `/projects`, `/contact`, `/shop/eng`, `/publisher`, `/Privacy`
 
 ## Entwicklung
 Voraussetzungen: Node 18+ empfohlen.
 
 - Abhängigkeiten installieren
 ```bash
 cd frontend
 npm install
 ```
 
 - Entwicklung starten
 ```bash
 npm run dev
 ```
 Vite startet unter `http://localhost:5173` (siehe `vite.config.js`).
 
 - Produktion bauen
 ```bash
 npm run build
 ```
 Bundler‑Output in `frontend/dist`.
 
 ## Deployment (GitHub Pages)
 Workflow: `.github/workflows/deploy.yml`
 - Trigger: Push auf `master`
 - Schritte: Checkout → Install → Build → Deploy mit `peaceiris/actions-gh-pages`
 - Erwartet `frontend/dist` als `publish_dir`
 
 Achte darauf, dass im Workflow `publish_dir` ohne abschließenden Punkt definiert ist:
 ```yaml
 with:
   publish_dir: ./frontend/dist
 ```
 
 ## Inhalte pflegen
 ### Blog
 - Dateien: `frontend/public/BlogsDe.json`, `frontend/public/BlogsEng.json`
 - Struktur eines Eintrags:
 ```json
 {
   "title": "Hey everyone!",
   "date": "Saturday, 15 February 2025",
   "sections": [
     { "content": "…", "image": "./Blog/Me.jpg", "imagePosition": "left" },
     { "content": "…", "video": "./Blog/Tour.mp4", "imagePosition": "right" }
   ],
   "linkText": "My LinkedIn",
   "linkUrl": "https://…"
 }
 ```
 - Medien: `image` ODER `video` pro Abschnitt. Videos können als Blob geladen werden, damit AdBlock/Serverrestriktionen weniger stören.
 - Summary (kurzer Einzeiler unter dem Titel): wird aus dem ersten Abschnitt abgeleitet oder aus einem optionalen Feld generiert (siehe „Nächste Schritte“).
 
 ### Projekte
 - Pflege in `pages/Projects*.vue` direkt oder via separater JSON (optional nachrüstbar).
 - Felder: `name`, `link`, `github`, `technologies[]`, `short` (kurz, für zugeklappt), `description` (lang, für aufgeklappt – `whitespace-pre-line`).
 
 ### Shop (Demo)
 - `demoProducts` in `pages/Shop*.vue` anpassen.
 - Tag‑Filter: Chips im Header anklicken, mehrere Tags kombinierbar; zusätzlich Suchfeld.
 - Adyen: Für Live‑Test Umgebungsvariablen/Keys (ClientKey, Session) hinterlegen und Backend‑Endpoint bereitstellen.
 
 ## Übersetzung / Sprachwechsel
 - Der Umschalter zeigt immer die nicht aktive Sprache (DE<->EN).
 - Mapping spiegelt Pfade (inkl. Umlaute/Aliasse):
   - DE→EN: `/start↔/home`, `/übermich↔/aboutme`, `/gallerie↔/gallery`, `/blog/de↔/blog/eng`, `/shop/de↔/shop/eng`, `/kontakt↔/contact`, `/impressum↔/publisher`, `/datenschutz↔/Privacy`.
 - Menülinks/Labels richten sich automatisch nach der erkannten Sprache.
 
 ## Design/Theme
 - Akzentfarbe wählbar (Menü → „Akzentfarbe wählen“). Die Farbe setzt `--accent-rgb`/`--accent-raw` und färbt den Hintergrund‑Gradient live.
 - Auto‑Kontrast: `.page-auto-contrast` aktiviert text-shadow und optionale `.text-block`‑Container.
 
 ## Barrierefreiheit & Performance
 - Fokus auf klare Lesbarkeit (Textschatten, Kontraste) und gute Touch‑Ziele (Buttons/Chips).
 - Smooth Transitions (max-height + opacity + translate) für Blog/Projekte.
 - Vite + Code‑Splitting (Dynamic Imports im Router).
 
 ## Troubleshooting
 - Importfehler (Datei existiert nicht): prüfen, ob Seite/Komponente vorhanden und Pfad korrekt ist. Nach größeren Umbauten `npm run dev` neu starten.
 - Vue/Types Warnungen in IDE: sicherstellen, dass `node_modules` vorhanden ist und `vue` direkt installiert ist; ggf. TS/Vue Server neu starten.
 - GH Pages: `publish_dir` korrekt auf `./frontend/dist` setzen; ggf. Branch/Token prüfen.
 
 ## Nächste Schritte (geplant)
 - About – Timeline 1:1 vollständig (Pfeilspitzen/Marker via ::before/::after, MQ‑Offsets, optionale `timeline-infinite`‑Scale‑Loop).
 - Skills‑Cloud – Feinschliff (Mindestabstand/Margen, noch gleichmäßigeres Pattern).
 - Sprachwechsel – Edge‑Cases/Aliasse weiter härten, Deep‑Links prüfen.
 - Blog – kurze Summary unter dem Titel (DE & EN) standardmäßig anzeigen.
 
 ## Lizenz
 Persönliches Portfolio – Inhalte (Texte/Bilder/Grafiken/Styles) sind, sofern nicht anders angegeben, urheberrechtlich geschützt.
