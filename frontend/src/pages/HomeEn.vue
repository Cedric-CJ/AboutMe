<template>
  <section>
    <div class="hero glass-card p-6 md:p-10">
      <div class="hero-grid">
        <div class="hero-copy">
          <h1 class="name">Cedric Arnhold</h1>
          <p class="tagline">Redefining IT with AI</p>
          <p class="intro">I'm Cedric, studying Business Informatics in Berlin and building projects I enjoy — from websites and small tools to server setups. Here you’ll find a selection of my work, a gallery, blog posts and ways to get in touch.</p>
          <div class="links">
            <RouterLink to="/projects" class="glass-btn px-4 py-2 rounded-md">Projects</RouterLink>
            <RouterLink to="/aboutme" class="glass-btn-secondary px-4 py-2 rounded-md">About me</RouterLink>
            <RouterLink to="/gallery" class="glass-btn-secondary px-4 py-2 rounded-md">Gallery</RouterLink>
            <RouterLink to="/blog/eng" class="glass-btn-secondary px-4 py-2 rounded-md">Blog</RouterLink>
            <RouterLink to="/contact" class="glass-btn-secondary px-4 py-2 rounded-md">Contact</RouterLink>
          </div>
        </div>
        <div class="hero-portrait">
          <div class="portrait-ring">
            <img src="@/assets/Pictures/Me.png" alt="Cedric" class="me" />
          </div>
        </div>
      </div>

      <div class="mt-8 grid md:grid-cols-2 gap-4">
        <div class="glass-card p-4">
          <h3 class="text-white font-medium">Virtual Pet</h3>
          <p class="text-zinc-300 text-sm">University project with user accounts, two pets, care/play and high score.</p>
          <div class="mt-3 flex gap-2">
            <a href="https://virtual-pet-bcky.onrender.com/" target="_blank" class="glass-btn px-3 py-1 rounded">Live</a>
            <a href="https://github.com/Cedric-CJ/virtual-pet" target="_blank" class="glass-btn-secondary px-3 py-1 rounded">GitHub</a>
          </div>
        </div>
        <div class="glass-card p-4">
          <h3 class="text-white font-medium">Metal Master Website</h3>
          <p class="text-zinc-300 text-sm">Modernised with a new gallery, before/after and responsive layout.</p>
          <div class="mt-3 flex gap-2">
            <a href="https://mz24.net/" target="_blank" class="glass-btn px-3 py-1 rounded">Live</a>
            <a href="https://github.com/Cedric-CJ/MZ24" target="_blank" class="glass-btn-secondary px-3 py-1 rounded">GitHub</a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup>
import { RouterLink } from 'vue-router'
</script>
<style scoped>
.hero{ overflow:hidden }
.hero-grid{ display:grid; grid-template-columns: 1.4fr .8fr; gap: 1.25rem; align-items: center }
@media (max-width: 900px){ .hero-grid{ grid-template-columns: 1fr; } .hero-portrait{ order:-1; justify-content:flex-start } }
.hero-copy{ display:flex; flex-direction:column }
.me{ height:auto; border-radius: 9999px; border:2px solid rgba(255,255,255,.25); background: rgba(255,255,255,.06) }
.portrait-ring{ position:relative; display:inline-block; border-radius:9999px }
.hero-portrait{ display:flex; justify-content:flex-end }
.name{ color:#fff; font-weight:700; font-size: clamp(2rem,4vw,3rem); letter-spacing:.2px }
.tagline{ color:#cfeff7; margin-top:2px }
.intro{ color:#ddd; margin-top: 12px; max-width: 64ch }
.links{ margin-top: 16px; display:flex; flex-wrap:wrap; gap:10px }
</style>
