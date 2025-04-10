<template>
  <div class="blogpage-performance">
    <section class="intro">
      <h5 data-text="My Blog" v-if="currentLang === 'en'">My Blog</h5>
      <h5 data-text="Mein Blog" v-else>Mein Blog</h5>
    </section>
    <div v-if="isMediaError" class="adblock-warning">
      <p v-if="currentLang === 'en'">
        Not all media could be loaded. This may be because an AdBlocker is blocking the media.
        Please deactivate the AdBlocker – only the media will be loaded, no advertising.
      </p>
      <p v-else>
        Es konnten nicht alle Medien geladen werden. Dies kann daran liegen, dass ein AdBlocker die Medien blockiert.
        Bitte deaktiviere den AdBlocker, es werden nur die Medien geladen - keine Werbung.
      </p>
    </div>
    <div id="blog-container" class="blog-container">
      <div
          v-for="(blog, index) in blogs"
          :key="index"
          :class="['blog-entry', index % 2 === 0 ? 'left' : 'right']"
      >
        <h2 class="blog-title">{{ blog.title }}</h2>
        <p class="blog-date">{{ blog.date }}</p>
        <div class="blog-content-wrapper">
          <div
              v-for="(section, sIndex) in blog.sections"
              :key="sIndex"
              class="blog-section"
          >
            <template v-if="section.video">
              <video controls :class="[ getImageClass(section.imagePosition), 'blog-video' ]">
                <source :src="section.videoObjectUrl || section.video" type="video/mp4" />
                <span v-if="currentLang==='en'">Your browser does not support video tags.</span>
                <span v-else>Dein Browser unterstützt keine Video Tags.</span>
              </video>
            </template>
            <template v-else>
              <img
                  :src="section.image"
                  :alt="`Blog ${currentLang==='en' ? 'Image' : 'Bild'} ${sIndex}`"
                  :class="getImageClass(section.imagePosition)"
              />
            </template>
            <p class="blog-content" v-html="formatContent(section.content)"></p>
          </div>
        </div>
        <div class="blog-urls" v-if="blog.linkText && blog.linkUrl">
          <a
              :href="blog.linkUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="blog-url"
          >
            {{ blog.linkText }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "BlogPagePerformance",
  data() {
    return {
      blogs: [],
      isMediaError: false
    };
  },
  computed: {
    currentLang() {
      const storedLang = localStorage.getItem('preferredLanguage') || 'de';
      return storedLang === 'eng' ? 'en' : 'de';
    }
  },
  methods: {
    formatContent(content) {
      if (!content) return "";
      return content.replace(/\n/g, "<br>");
    },
    getImageClass(position) {
      switch (position) {
        case "left":
          return "float-top-left";
        case "right":
          return "float-top-right";
        default:
          return "float-top-left";
      }
    },
    fetchVideo(section) {
      if (!section.video) return;
      fetch(section.video)
          .then(response => {
            if (!response.ok)
              throw new Error(this.currentLang === "en"
                  ? "Video could not be loaded"
                  : "Video konnte nicht geladen werden");
            return response.blob();
          })
          .then(blob => {
            section.videoObjectUrl = URL.createObjectURL(blob);
          })
          .catch(error => {
            console.error("Error loading video:", error);
            this.handleMediaError();
          });
    },
    handleMediaError() {
      this.isMediaError = true;
    }
  },
  mounted() {
    const jsonFile = this.currentLang === "de" ? "./BlogsDe.json" : "./BlogsEng.json";
    fetch(jsonFile)
        .then(response => response.json())
        .then(data => {
          this.blogs = data;
          this.blogs.forEach(blog => {
            blog.sections.forEach(section => {
              if (section.video) {
                this.fetchVideo(section);
              }
            });
          });
        })
        .catch(error => {
          console.error(this.currentLang === "en"
              ? "Error loading Blogs:"
              : "Fehler beim Laden der Blogs:", error);
        });
  }
};
</script>
<style scoped>
.adblock-warning {
  position: fixed;
  top: 85vh;
  left: 10vw;
  right: 10vw;
  background-color: #ffdddd;
  color: #a00;
  padding: 1rem;
  margin: 0;
  border: 1px solid #a00;
  border-radius: 5px;
  z-index: 1;
  text-align: center;
  font-size: 0.8rem;
}
.blog-entry {
  --r: 1em;
  --t: 1em;
  border-inline: var(--t) solid #0000;
  border-radius: calc(var(--r) + var(--t))/var(--r);
  mask: radial-gradient(100% 100% at var(--_p) 0, #0000 99%, #000 102%) var(--_p) 100%/var(--t) var(--t) no-repeat,
  linear-gradient(#000 0 0) padding-box;
  width: 100%;
  max-width: 60%;
  padding: 1.5rem;
  background: var(--blog-background-color);
}
.blog-entry.left {
  --_p: 0;
  border-bottom-left-radius: 0;
  place-self: start;
}
.blog-entry.right {
  --_p: 100%;
  border-bottom-right-radius: 0;
  place-self: end;
}
.blog-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem;
  background-color: transparent;
  color: var(--text-color);
  margin-top: 2rem;
}
.blog-entry.left:first-of-type {
  margin-top: 15vh;
}
.blog-title {
  margin-top: 0;
  color: var(--text-color-blog);
}
.blog-date {
  font-size: 0.9rem;
  color: var(--text-color-blog);
}
img {
  height: auto;
  width: 100%;
  max-width: 200px;
}
.blog-video {
  width: 100%;
  max-width: 200px;
  margin: 0 1rem 1rem 0;
  display: block;
}
.blog-content {
  margin: 1rem 0;
  color: var(--text-color-blog);
  text-align: justify;
  font-size: calc(0.9rem + 0.5vw);
  hyphens: auto;
  -webkit-hyphens: auto;
  -moz-hyphens: auto;
  overflow-wrap: break-word;
  word-wrap: break-word;
}
.float-top-left {
  float: left;
  margin: 0 0.5rem 0 0;
  max-width: 200px;
}
.float-top-right {
  float: right;
  margin: 0 0 0 0.5rem;
  max-width: 200px;
}
.blog-section::after {
  content: "";
  clear: both;
}
.blog-urls a {
  font-size: 0.9rem;
  color: var(--timeline-background);
  text-decoration: none;
  background-color: var(--blog-background-color);
  padding: 0.3rem 0.6rem;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}
.blog-urls a:hover {
  background-color: var(--primary-color);
  color: var(--text-color);
}
.intro {
  height: 5vh;
  position: relative;
}
h5{
  font-size: 4rem;
  text-align: center;
  color: var(--text-color);
  position: relative;
  overflow: hidden;
  line-height: 1.2;
}
</style>