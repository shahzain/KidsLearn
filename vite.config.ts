import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Deployment base path. GitHub Pages *project* sites are served from
// https://<user>.github.io/<repo>/, so the CI sets VITE_BASE=/<repo>/.
// Defaults to '/' for root hosting (Vercel, Netlify, <user>.github.io).
const base = process.env.VITE_BASE ?? '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: [
        'favicon.svg',
        'icons/apple-touch-icon.png',
        'icons/icon-*.png',
      ],
      manifest: {
        name: 'KidLearn',
        short_name: 'KidLearn',
        description:
          'A fun, offline learning app for kids ages 2–6: Animals, Birds, Counting and the ABC.',
        lang: 'en',
        dir: 'ltr',
        theme_color: '#FF8C42',
        background_color: '#FFF7ED',
        display: 'standalone',
        orientation: 'portrait',
        start_url: base,
        scope: base,
        categories: ['education', 'kids', 'games'],
        icons: [
          { src: 'icons/icon-72.png', sizes: '72x72', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-96.png', sizes: '96x96', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-128.png', sizes: '128x128', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-144.png', sizes: '144x144', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-152.png', sizes: '152x152', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-384.png', sizes: '384x384', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-192-maskable.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: 'icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Precache the app shell + fonts so the app works fully offline after first load.
        globPatterns: ['**/*.{js,css,html,ico,svg,woff2,webp}', 'icons/icon-*.png', 'icons/apple-touch-icon.png', 'sounds/*.mp3'],
        // Splash screens are large and only used by iOS at launch — keep them out of the precache.
        globIgnores: ['**/icons/splash-*.png'],
        navigateFallback: `${base}index.html`,
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
      },
      devOptions: {
        enabled: true,
        type: 'module',
        navigateFallback: `${base}index.html`,
      },
    }),
  ],
  build: {
    target: 'es2019',
  },
  // Allow any host so a Cloudflare Tunnel / ngrok URL can reach the dev + preview
  // server without editing this file every time the tunnel URL changes.
  server: {
    allowedHosts: true,
  },
  preview: {
    allowedHosts: true,
  },
})
