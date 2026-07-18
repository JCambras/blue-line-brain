/**
 * Pure helpers for the service worker's audio-clip caching (see `src/sw.ts`).
 *
 * `new Audio()` fetches media with a `Range` header, so a range-supporting host
 * answers `206 Partial Content` - and the Cache API refuses to store a 206
 * (`cache.put` throws "Partial response ... unsupported"). Stripping the `Range`
 * header before the network fetch makes the host return a full `200` the SW can
 * cache. The audio element still expects its range answered with a genuine 206
 * (WebKit's media loader refuses a 200 for a range request), so the byte range
 * is carved out of the full body on every path: by `RangeRequestsPlugin` on
 * cache hits and by `ensurePartialResponse` on the cache-miss network response.
 * Without the strip the narration cache never populates and the installed PWA
 * plays silent offline; without the 206 restore the first online play of each
 * clip is silent on iOS.
 *
 * Kept DOM-free (only `Request`/`Response`/`Headers`, available in the browser,
 * the SW, and Node's test runtime) so they can be imported by `src/sw.ts` and
 * unit-tested by `scripts/sw-range-strip.test.ts` without a service-worker/
 * Workbox harness.
 */
export function stripRangeHeader(request: Request): Request {
  if (!request.headers.has('range')) return request;
  const headers = new Headers(request.headers);
  headers.delete('range');
  // Rebuilt from the URL rather than `new Request(request, { headers })`: some
  // engines reject an init on a no-cors (media) request, and a throw inside
  // `requestWillFetch` fails the whole strategy. Mode is left at its default -
  // for these same-origin GETs it changes nothing on the wire.
  return new Request(request.url, {
    method: request.method,
    headers,
    credentials: request.credentials,
    redirect: request.redirect,
  });
}

export type CreatePartialResponse = (
  request: Request,
  response: Response
) => Promise<Response>;

/**
 * Answers a range request that got a full `200` (the cache-miss network path,
 * where the strip above removed the `Range` header) with the genuine `206` the
 * audio element asked for, via the injected `createPartialResponse` (Workbox's,
 * in the SW). Everything else passes through untouched: cache hits are already
 * 206 from `RangeRequestsPlugin`, and a non-200 - a 404 from a filename a stale
 * manifest still points at - must stay an error so narrationAudio's
 * stale-manifest recovery fires.
 */
export async function ensurePartialResponse(
  request: Request,
  response: Response,
  createPartial: CreatePartialResponse
): Promise<Response> {
  if (!request.headers.has('range') || response.status !== 200) return response;
  return createPartial(request, response);
}
