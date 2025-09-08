<template>
  <section class="max-w-3xl mx-auto glass-card p-6 text-sm leading-6 text-zinc-200">
    <h1 class="text-white text-2xl font-semibold mb-4">Privacy Policy</h1>

    <h2 class="text-white font-medium mt-4 mb-2">1. Responsible party</h2>
    <p>
      Cedric Jon Arnhold<br>
      Allee der Kosmonauten 202<br>
      12685 Berlin, Germany<br>
      Email: <a href="mailto:cedric.jon.arnhold@gmail.com">cedric.jon.arnhold@gmail.com</a>
    </p>

    <h2 class="text-white font-medium mt-4 mb-2">2. Data processing on this website</h2>
    <p>
      This website is a personal portfolio. We do not use invasive tracking. Server logs may be processed by the hosting
      provider to ensure operation and security (e.g., IP address, time, requested URL). These logs are automatically
      deleted according to the provider's retention schedule.
    </p>

    <h2 class="text-white font-medium mt-4 mb-2">3. Hosting</h2>
    <p>
      The website is hosted on <a class="text-ice" href="https://pages.github.com/" target="_blank" rel="noreferrer">GitHub Pages</a>.
      The provider's privacy policy applies accordingly.
    </p>

    <h2 class="text-white font-medium mt-4 mb-2">4. Contact</h2>
    <p>
      If you contact us by email, your details will be stored for the purpose of processing the inquiry and in case of
      follow-up questions. Your data will not be shared without consent.
    </p>

    <h2 class="text-white font-medium mt-4 mb-2">5. Open Source</h2>
    <p>
      The source code of this website is available on
      <a class="text-ice" href="https://github.com/Cedric-CJ/AboutMe" target="_blank" rel="noreferrer">GitHub</a>.
    </p>

    <p class="mt-6 text-xs text-zinc-400">Last updated: {{ new Date().toLocaleDateString('en-GB') }}</p>
  </section>
</template>
<script setup>
</script>
<style scoped>
section :deep(p){ margin-bottom: .6rem; }
</style>
