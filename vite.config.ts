import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'node:path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // Icons + favicon live in public/ and ship as-is; list them so the
      // generated service worker precaches them alongside the built app shell.
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Blue Line Brain',
        short_name: 'Blue Line Brain',
        description: 'Hockey IQ training for youth defensemen',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#08111f',
        theme_color: '#08111f',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Precache the built app shell so the app opens offline after first
        // load. The audio clips are large committed artifacts, so cache them
        // lazily at runtime instead of bloating the precache.
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff,woff2}'],
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            // The manifest maps scenario keys to content-hashed clip filenames
            // and, unlike the immutable MP3s, keeps a fixed URL across
            // redeploys. Revalidate it in the background so returning online
            // users pick up regenerated/added clips instead of being pinned to
            // a stale key->filename map, while offline still serves the cached
            // copy. Must precede the broader /audio/ rule (first match wins).
            urlPattern: ({ url }) => url.pathname === '/audio/manifest.json',
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'audio-manifest',
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/audio/'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'audio-clips',
              // Narration MP3s play via `new Audio()`, which fetches with a
              // `Range` header; range-supporting hosts answer 206 Partial
              // Content. `rangeRequests` adds Workbox's RangeRequestsPlugin
              // (caching the full body, serving partials from it) and 206 must
              // be an allowed status, or the clips would never cache offline.
              rangeRequests: true,
              expiration: {
                // Cover the full committed narration set (~706 MP3s under
                // /audio/ + manifest.json) so all clips can persist offline,
                // with headroom for future scenarios/feedback clips.
                maxEntries: 800,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
              cacheableResponse: { statuses: [0, 200, 206] },
            },
          },
          {
            urlPattern: ({ url }) => url.origin === 'https://fonts.googleapis.com',
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts-stylesheets' },
          },
          {
            urlPattern: ({ url }) => url.origin === 'https://fonts.gstatic.com',
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
