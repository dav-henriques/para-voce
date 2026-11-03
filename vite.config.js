import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Se for publicar numa subpasta (ex.: GitHub Pages em /para-voce/), troque a base.
const base = process.env.BASE ?? '/'

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: {
        id: base,
        name: 'para você ♡',
        short_name: 'para você ♡',
        description: 'um potinho cheio de bilhetinhos, pra quando você precisar de um carinho.',
        lang: 'pt-BR',
        start_url: base,
        scope: base,
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#FFF5EA',
        theme_color: '#8F2638',
        icons: [
          { src: 'icons/pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // tudo que o app precisa fica guardado no aparelho (funciona sem internet)
        globPatterns: ['**/*.{js,css,html,svg,png,jpg,jpeg,webp,avif,gif,woff2}'],
        globIgnores: ['splash/**', '**/*cyrillic*', '**/*greek*', '**/*vietnamese*'],
        maximumFileSizeToCacheInBytes: 12 * 1024 * 1024,
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
        // música: guardada à parte, com suporte a "range requests" (exigência do Safari)
        runtimeCaching: [
          {
            urlPattern: ({ url }) => /\.(mp3|m4a|aac|ogg|wav)$/i.test(url.pathname),
            handler: 'CacheFirst',
            options: {
              cacheName: 'musica',
              rangeRequests: true,
              cacheableResponse: { statuses: [200] },
              expiration: { maxEntries: 4 },
            },
          },
        ],
      },
    }),
  ],
})
