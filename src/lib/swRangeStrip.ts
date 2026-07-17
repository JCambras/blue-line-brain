/**
 * Pure helper for the service worker's audio-clip caching (see `src/sw.ts`).
 *
 * `new Audio()` fetches media with a `Range` header, so a range-supporting host
 * answers `206 Partial Content` - and the Cache API refuses to store a 206
 * (`cache.put` throws "Partial response ... unsupported"). Stripping the `Range`
 * header before the network fetch makes the host return a full `200` the SW can
 * cache; `RangeRequestsPlugin` then serves the requested byte range from that
 * cached full body. Without this the narration cache never populates and the
 * installed PWA plays silent offline.
 *
 * Kept DOM-free (only `Request`/`Headers`, available in the browser, the SW, and
 * Node's test runtime) so it can be imported by `src/sw.ts` and unit-tested by
 * `scripts/sw-range-strip.test.ts` without a service-worker/Workbox harness.
 */
export function stripRangeHeader(request: Request): Request {
  if (!request.headers.has('range')) return request;
  const headers = new Headers(request.headers);
  headers.delete('range');
  return new Request(request, { headers });
}
