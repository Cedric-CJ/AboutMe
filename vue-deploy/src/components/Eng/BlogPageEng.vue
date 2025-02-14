<template>
  <section class="intro">
    <h1 data-text="My Blog">My Blog</h1>
  </section>
  <div class="blog-container">
    <div v-for="(blog, index) in blogs" :key="index" :class="['blog-entry', index % 2 === 0 ? 'left' : 'right']">
      <h2 class="blog-title">{{ blog.title }}</h2>
      <p class="blog-date">{{ blog.date }}</p>
      <div class="blog-content-wrapper">
        <div v-for="(section, sIndex) in blog.sections" :key="sIndex" class="blog-section">
          <template v-if="section.video">
            <video controls :class="[ getImageClass(section.imagePosition), 'blog-video' ]">
              <source :src="section.videoObjectUrl || section.video" type="video/mp4" />
              Your browser does not support video tags.
            </video>
          </template>
          <template v-else>
            <img :src="section.image" :alt="`Blog Bild ${sIndex}`" :class="getImageClass(section.imagePosition)"/>
          </template>
          <p class="blog-content" v-html="formatContent(section.content)"></p>
        </div>
      </div>
      <div class="blog-urls" v-if="blog.linkText && blog.linkUrl">
        <a :href="blog.linkUrl" target="_blank" rel="noopener noreferrer" class="blog-url">
          {{ blog.linkText }}
        </a>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "BlogPageEng",
  data() {
    return {
      blogs: []
    };
  },
  methods: {
    formatContent(content) {
      if (!content) return "";
      return content.replace(/\n/g, '<br>');
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
            if (!response.ok) throw new Error("Video could not be loaded");
            return response.blob();
          })
          .then(blob => {
            section.videoObjectUrl = URL.createObjectURL(blob);
          })
          .catch(error => {
            console.error("Error by loading Videos:", error);
          });
    }
  },
  mounted() {
    fetch("./BlogsEng.json")
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
        .catch(error => console.error("Error by loading Blogs:", error));
  }
};
</script>
<style scoped>
.blog-entry {
  --r: 1em;
  --t: 1em;
  border-inline: var(--t) solid #0000;
  border-radius: calc(var(--r) + var(--t))/var(--r);
  mask:
      radial-gradient(100% 100% at var(--_p) 0,#0000 99%,#000 102%)
      var(--_p) 100%/var(--t) var(--t) no-repeat,
      linear-gradient(#000 0 0) padding-box;
  width: 100%;
  max-width: 60%;
  padding: 1.5rem;
  background: var(--blog-background-color);
}
.blog-entry.left {
  --_p: 0;
  border-bottom-left-radius: 0 0;
  place-self: start;
}
.blog-entry.right {
  --_p: 100%;
  border-bottom-right-radius: 0 0;
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
h1::before,
h1::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: var(--text-color);
  overflow: hidden;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
}
h1::before {
  text-shadow: -2px 0 red, 2px 0 blue;
  z-index: 0;
  animation: glitch-animation 2s steps(8) infinite;
}
h1::after {
  text-shadow: -2px 0 blue, 2px 0 red;
  z-index: 0;
  animation: glitch-animation 3s steps(8) infinite reverse;
}
@keyframes glitch-animation {
  0% {
    clip-path: polygon(0 3%, 100% 3%, 100% 12%, 0 12%);
    transform: translate(2px, -2px);
    opacity: 1;
  }
  10% {
    clip-path: polygon(0 7%, 100% 7%, 100% 20%, 0 20%);
    transform: translate(-3px, 3px) skewX(5deg);
    opacity: 0.8;
  }
  20% {
    clip-path: polygon(0 12%, 100% 12%, 100% 25%, 0 25%);
    transform: translate(3px, -1px) rotate(1deg);
    opacity: 0.5;
  }
  30% {
    clip-path: polygon(0 30%, 100% 30%, 100% 38%, 0 38%);
    transform: translate(-2px, 2px) skewY(3deg);
    opacity: 0.7;
  }
  40% {
    clip-path: polygon(0 45%, 100% 45%, 100% 55%, 0 55%);
    transform: translate(1px, -3px) skewX(-5deg);
    opacity: 0.9;
  }
  50% {
    clip-path: polygon(0 50%, 100% 50%, 100% 60%, 0 60%);
    transform: translate(-3px, 1px);
    opacity: 0.6;
  }
  60% {
    clip-path: polygon(0 60%, 100% 60%, 100% 70%, 0 70%);
    transform: translate(2px, 2px) skewY(-3deg);
    opacity: 1;
  }
  80% {
    clip-path: polygon(0 85%, 100% 85%, 100% 90%, 0 90%);
    transform: translate(3px, 3px) skewX(4deg);
    opacity: 0.5;
  }
  100% {
    clip-path: polygon(0 10%, 100% 10%, 100% 15%, 0 15%);
    transform: translate(0, 0);
    opacity: 1;
  }
}
</style>