import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'node:path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // injectManifest (hand-written src/sw.ts) rather than generateSW: the
      // narration MP3s are played via `new Audio()`, whose Range request yields a
      // 206 that the Cache API refuses to store, so a declarative CacheFirst
      // could never cache a clip and the PWA had no offline audio. src/sw.ts
      // strips the Range header so clips cache as full 200s. See its header.
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      registerType: 'autoUpdate',
      // Icons + favicon live in public/ and ship as-is; list them so the
      // service worker precaches them alongside the built app shell.
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      injectManifest: {
        // Precache the built app shell. The audio clips are large committed
        // artifacts (~18 MB), so they are runtime-cached lazily by src/sw.ts
        // instead of bloating the precache / stalling install on flaky wifi.
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff,woff2}'],
      },
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
