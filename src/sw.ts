/// <reference lib="webworker" />
/**
 * Custom Workbox service worker (vite-plugin-pwa `injectManifest`).
 *
 * Why a hand-written SW instead of the declarative `generateSW`: narration
 * MP3s are played through `new Audio()`, which ALWAYS sends a `Range` header.
 * Range-supporting hosts (Vercel) answer `206 Partial Content`, and the Cache
 * API *refuses to store a 206* - `cache.put()` throws "Partial response (status
 * code 206) is unsupported". So a runtime `CacheFirst` strategy could never
 * populate the audio cache: every clip fetch is a range request, every response
 * is a 206, every cache write silently fails, and the `audio-clips` cache stayed
 * empty. The PWA therefore had NO offline audio - an installed app opened on the
 * flaky/absent wifi typical of a hockey rink played every scenario silent.
 *
 * Fix: for the audio-clip route, strip the `Range` header before the network
 * fetch (`stripRangeHeaderPlugin`) so the SW receives - and can cache - a full
 * `200` response. `RangeRequestsPlugin` then serves the exact byte range the
 * audio element asked for out of that cached full body, both online and offline.
 * Clips are cached lazily as they first play online, so nothing is precached
 * (the full set is ~18 MB) yet every clip a kid has heard once replays offline.
 *
 * Everything else mirrors the previous generated config so nothing regresses:
 * `skipWaiting`/`clientsClaim` (the App-level `controllerchange` reload depends
 * on the new worker claiming the page), the app-shell precache + navigation
 * fallback, and the manifest StaleWhileRevalidate route. That manifest route
 * matches the BARE pathname only, so narrationAudio's stale-manifest recovery
 * refetch (`manifest.json?fresh=1`) escapes it and goes straight to the network;
 * the audio-clip route excludes the manifest for the same reason. Keep both if
 * you touch the routing.
 */
import { clientsClaim } from 'workbox-core';
import {
  precacheAndRoute,
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  type PrecacheEntry,
} from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';
import { RangeRequestsPlugin } from 'workbox-range-requests';
import type { WorkboxPlugin } from 'workbox-core/types';
import { stripRangeHeader } from './lib/swRangeStrip.ts';

declare const self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: Array<string | PrecacheEntry>;
};

self.skipWaiting();
clientsClaim();

// Precache the built app shell (JS/CSS/HTML/icons/fonts) injected at build.
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// SPA navigations fall back to the precached shell so the app opens offline.
registerRoute(new NavigationRoute(createHandlerBoundToURL('/index.html')));

/**
 * Removes the `Range` header from the outgoing network request so a
 * range-supporting host returns a cacheable `200` (full body) instead of an
 * uncacheable `206`. Without this the Cache API rejects the write and offline
 * audio is impossible - see the module header. A GET with no Range is served
 * whole, which satisfies the audio element's `bytes=0-` just fine; genuine seek
 * ranges are answered from the cached full body by RangeRequestsPlugin.
 */
const stripRangeHeaderPlugin: WorkboxPlugin = {
  requestWillFetch: async ({ request }) => stripRangeHeader(request),
};

// The audio manifest keeps a fixed URL across redeploys (its values are the
// content-hashed clip filenames). Revalidate it in the background so returning
// online users pick up regenerated/added clips instead of a stale key->filename
// map, while offline still serves the cached copy. MUST precede the broader
// /audio/ rule (first match wins) and match the bare pathname only so the
// `?fresh=1` stale-manifest recovery refetch escapes to the network.
registerRoute(
  ({ url }) => url.pathname === '/audio/manifest.json' && !url.search,
  new StaleWhileRevalidate({
    cacheName: 'audio-manifest',
    plugins: [new CacheableResponsePlugin({ statuses: [0, 200] })],
  }),
  'GET'
);

// Narration MP3s: everything under /audio/ except the manifest. CacheFirst so a
// clip heard once online replays instantly and offline. See module header for
// why the Range header is stripped and why 206 is NOT a cacheable status here
// (we only ever cache the full 200 the strip produces).
registerRoute(
  ({ url }) =>
    url.pathname.startsWith('/audio/') && url.pathname !== '/audio/manifest.json',
  new CacheFirst({
    cacheName: 'audio-clips',
    plugins: [
      stripRangeHeaderPlugin,
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new RangeRequestsPlugin(),
      new ExpirationPlugin({
        // Cover the full committed narration set (~948 clips) so every clip can
        // persist offline, with headroom for future scenarios.
        maxEntries: 1100,
        maxAgeSeconds: 60 * 60 * 24 * 30,
      }),
    ],
  }),
  'GET'
);

registerRoute(
  ({ url }) => url.origin === 'https://fonts.googleapis.com',
  new StaleWhileRevalidate({ cacheName: 'google-fonts-stylesheets' }),
  'GET'
);

registerRoute(
  ({ url }) => url.origin === 'https://fonts.gstatic.com',
  new CacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new ExpirationPlugin({ maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 }),
      new CacheableResponsePlugin({ statuses: [0, 200] }),
    ],
  }),
  'GET'
);
