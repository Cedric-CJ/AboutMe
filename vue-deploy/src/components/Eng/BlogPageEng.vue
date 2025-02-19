<template>
  <div id="large-header">
    <canvas id="demo-canvas"></canvas>
  </div>
  <section class="intro">
    <h1 data-text="My Blog">My Blog</h1>
  </section>
  <div v-if="isMediaError" class="adblock-warning">
    <p>
      Not all media could be loaded. This may be because an AdBlocker is blocking the media.
      Please deactivate the AdBlocker – only the media will be loaded, no advertising.
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
              Your browser does not support video tags.
            </video>
          </template>
          <template v-else>
            <img
                :src="section.image"
                :alt="`Blog Image ${sIndex}`"
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
</template>

<script>
export default {
  name: "BlogPageEng",
  data() {
    return {
      blogs: [],
      isMediaError: false
    };
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
            if (!response.ok) throw new Error("Video could not be loaded");
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
    },
    // Background animation (without scroll logic)
    initBackground() {
      let width, height, largeHeader, canvas, ctx, points, target;
      let stars = []; // Array for stars
      let shootingStars = []; // Array for active shooting stars

      function initHeader() {
        width = window.innerWidth;
        height = window.innerHeight;
        target = { x: width / 2, y: height / 2 };

        largeHeader = document.getElementById("large-header");
        if (largeHeader) {
          largeHeader.style.height = height + "px";
        }
        canvas = document.getElementById("demo-canvas");
        if (canvas) {
          canvas.width = width;
          canvas.height = height;
          ctx = canvas.getContext("2d");
        }

        initStars();

        // Create points for the interactive background
        points = [];
        for (let x = 0; x < width; x += width / 20) {
          for (let y = 0; y < height; y += height / 20) {
            const px = x + Math.random() * (width / 20);
            const py = y + Math.random() * (height / 20);
            points.push({ x: px, originX: px, y: py, originY: py });
          }
        }

        // For each point, find the 5 closest points
        points.forEach(p1 => {
          const closest = [];
          points.forEach(p2 => {
            if (p1 !== p2) {
              if (closest.length < 5) {
                closest.push(p2);
              } else {
                for (let i = 0; i < 5; i++) {
                  if (getDistance(p1, p2) < getDistance(p1, closest[i])) {
                    closest[i] = p2;
                    break;
                  }
                }
              }
            }
          });
          p1.closest = closest;
        });

        // Assign a circle to each point
        points.forEach(p => {
          p.circle = new Circle(p, 2 + Math.random() * 2, "rgba(218,165,32,0.3)");
        });
      }

      // Initialize stars (with random twinkle amplitude and phase)
      function initStars() {
        const numStars = 100;
        stars = [];
        for (let i = 0; i < numStars; i++) {
          stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            baseRadius: Math.random() * 1.5,
            radius: 0,
            baseAlpha: 0.5 + Math.random() * 0.5,
            twinkleAmplitude: 1,
            twinkleSpeed: 0.001 + Math.random() * 0.002,
            phase: Math.random() * 2 * Math.PI
          });
          stars[i].radius = stars[i].baseRadius;
        }
      }

      // Create a shooting star
      function spawnShootingStar() {
        shootingStars.push({
          x: Math.random() * width,
          y: 0,
          length: 80 + Math.random() * 50,
          speed: 10 + Math.random() * 5,
          angle: Math.PI / 4, // 45°
          alpha: 1
        });
      }

      // Update and draw shooting stars
      function updateShootingStars() {
        for (let i = shootingStars.length - 1; i >= 0; i--) {
          const s = shootingStars[i];
          s.x += Math.cos(s.angle) * s.speed;
          s.y += Math.sin(s.angle) * s.speed;
          s.alpha -= 0.02;
          if (s.alpha <= 0) {
            shootingStars.splice(i, 1);
          } else {
            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(
                s.x - Math.cos(s.angle) * s.length,
                s.y - Math.sin(s.angle) * s.length
            );
            ctx.strokeStyle = `rgba(255,255,255,${s.alpha})`;
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        }
        if (Math.random() < 0.002) {
          spawnShootingStar();
        }
      }

      // Draw stars (without scroll offset)
      function drawStars() {
        if (!ctx) return;
        stars.forEach(star => {
          const x = star.x;
          const y = star.y;
          const newAlpha =
              star.baseAlpha +
              star.twinkleAmplitude *
              Math.sin(performance.now() * star.twinkleSpeed + star.phase);
          star.alpha = Math.max(0.3, Math.min(newAlpha, star.baseAlpha + star.twinkleAmplitude));
          ctx.beginPath();
          ctx.arc(x, y, star.radius, 0, 2 * Math.PI, false);
          ctx.fillStyle = `rgba(255,255,255,${star.alpha})`;
          ctx.fill();
        });
      }

      function addListeners() {
        window.addEventListener("resize", () => {
          width = window.innerWidth;
          height = window.innerHeight;
          if (largeHeader) {
            largeHeader.style.height = height + "px";
          }
          if (canvas) {
            canvas.width = width;
            canvas.height = height;
          }
        });
        if (!("ontouchstart" in window)) {
          window.addEventListener("mousemove", e => {
            const posx = e.pageX || e.clientX;
            const posy = e.pageY || e.clientY;
            target.x = posx;
            target.y = posy;
          });
        }
      }

      function initAnimation() {
        animate();
        points.forEach(p => shiftPoint(p));
      }

      function animate() {
        if (ctx) {
          // Fill background with black
          ctx.fillStyle = "black";
          ctx.fillRect(0, 0, width, height);
          drawStars();
          updateShootingStars();
          points.forEach(p => {
            const distance = Math.abs(getDistance(target, p));
            if (distance < 4000) {
              p.active = 0.3;
              p.circle.active = 0.6;
            } else if (distance < 20000) {
              p.active = 0.1;
              p.circle.active = 0.3;
            } else if (distance < 40000) {
              p.active = 0.02;
              p.circle.active = 0.1;
            } else {
              p.active = 0;
              p.circle.active = 0;
            }
            drawLines(p);
            p.circle.draw();
          });
        }
        requestAnimationFrame(animate);
      }

      function shiftPoint(p) {
        const duration = 1 + Math.random();
        const newX = p.originX - 50 + Math.random() * 100;
        const newY = p.originY - 50 + Math.random() * 100;
        tween(p, duration, newX, newY, circEaseInOut, () => shiftPoint(p));
      }

      // Tween function without external libraries
      function tween(obj, duration, targetX, targetY, easeFn, onComplete) {
        const startTime = performance.now();
        const startX = obj.x;
        const startY = obj.y;
        const deltaX = targetX - startX;
        const deltaY = targetY - startY;

        function animateTween(now) {
          const elapsed = (now - startTime) / 1000;
          const t = Math.min(elapsed / duration, 1);
          const ease = easeFn(t);
          obj.x = startX + deltaX * ease;
          obj.y = startY + deltaY * ease;
          if (t < 1) {
            requestAnimationFrame(animateTween);
          } else {
            onComplete && onComplete();
          }
        }
        requestAnimationFrame(animateTween);
      }

      // Circular EaseInOut function
      function circEaseInOut(t) {
        return t < 0.5
            ? (1 - Math.sqrt(1 - 4 * t * t)) / 2
            : (Math.sqrt(1 - Math.pow(-2 * t + 2, 2)) + 1) / 2;
      }

      function drawLines(p) {
        if (!p.active) return;
        p.closest.forEach(closestPoint => {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(closestPoint.x, closestPoint.y);
          ctx.strokeStyle = "rgba(218,165,32," + p.active + ")";
          ctx.stroke();
        });
      }

      // Circle constructor for interactive points
      function Circle(pos, rad, color) {
        this.pos = pos;
        this.radius = rad;
        this.color = color;
        this.active = 0;
        this.draw = function () {
          if (!this.active) return;
          ctx.beginPath();
          ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI, false);
          ctx.fillStyle = "rgba(218,165,32," + this.active + ")";
          ctx.fill();
        };
      }

      function getDistance(p1, p2) {
        return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
      }

      // Initialize and start animation
      initHeader();
      addListeners();
      initAnimation();
    }
  },
  mounted() {
    // Start background animation
    this.initBackground();

    // Load blog data from the English JSON
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
        .catch(error => console.error("Error loading Blogs:", error));
  }
};
</script>

<style scoped>
#large-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

#demo-canvas {
  display: block;
  width: 100%;
  height: 100%;
}

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
  mask: radial-gradient(100% 100% at var(--_p) 0, #0000 99%, #000 102%)
  var(--_p) 100%/var(--t) var(--t) no-repeat,
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