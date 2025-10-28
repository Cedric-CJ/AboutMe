import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // Treat web component tag as custom element
          isCustomElement: (tag) => tag === 'altcha-widget'
        }
      }
    })
  ],
  // Use '/AboutMe/' on GitHub Pages, root '/' for FTP/other deployments
  base: process.env.DEPLOY_TARGET === 'gh-pages' ? '/AboutMe/' : '/',
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), 'src')
    }
  },
  server: {
    port: 5173,
    open: false
  }
})
