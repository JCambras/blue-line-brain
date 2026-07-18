/**
 * Unit tests for the service worker's range helpers (`src/sw.ts` uses them to
 * make narration mp3s cacheable AND playable). The end-to-end offline-audio
 * behavior is verified in a real prod build/preview; these lock down the two
 * invariants the whole fix rests on: the network fetch must carry NO `Range`
 * header (so the host returns a cacheable full `200` instead of an uncacheable
 * `206`), and a range request must still be ANSWERED with a genuine `206` even
 * on the cache-miss path (WebKit refuses a 200 for a range request), while
 * non-200s pass through so stale-manifest 404 recovery keeps working.
 * Run: `npm test`  (node --experimental-strip-types --test)
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { stripRangeHeader, ensurePartialResponse } from '../src/lib/swRangeStrip.ts';

test('a range request is rewritten without its Range header', () => {
  const req = new Request('https://x/audio/clip.mp3', {
    headers: { Range: 'bytes=0-' },
  });
  const out = stripRangeHeader(req);
  assert.equal(out.headers.has('range'), false, 'Range header is gone');
  assert.equal(out.url, req.url, 'same URL (cache key unchanged)');
  assert.equal(out.method, 'GET', 'still a GET');
});

test('a seek range (non-zero start) is also stripped', () => {
  const req = new Request('https://x/audio/clip.mp3', {
    headers: { Range: 'bytes=20000-' },
  });
  assert.equal(stripRangeHeader(req).headers.has('range'), false);
});

test('a request without a Range header is returned unchanged', () => {
  const req = new Request('https://x/audio/clip.mp3');
  const out = stripRangeHeader(req);
  assert.equal(out, req, 'no new Request allocated when there is nothing to strip');
  assert.equal(out.headers.has('range'), false);
});

test('other headers survive the strip', () => {
  const req = new Request('https://x/audio/clip.mp3', {
    headers: { Range: 'bytes=0-', 'X-Keep': 'yes' },
  });
  const out = stripRangeHeader(req);
  assert.equal(out.headers.has('range'), false);
  assert.equal(out.headers.get('x-keep'), 'yes', 'unrelated headers are preserved');
});

test('credentials and redirect mode survive the strip', () => {
  const req = new Request('https://x/audio/clip.mp3', {
    headers: { Range: 'bytes=0-' },
    credentials: 'include',
    redirect: 'follow',
  });
  const out = stripRangeHeader(req);
  assert.equal(out.credentials, 'include');
  assert.equal(out.redirect, 'follow');
});

const rangeReq = () =>
  new Request('https://x/audio/clip.mp3', { headers: { Range: 'bytes=0-' } });

test('a full 200 answering a range request is converted to a partial response', async () => {
  const partial = new Response('ab', { status: 206 });
  let calls = 0;
  const out = await ensurePartialResponse(rangeReq(), new Response('abcdef'), async () => {
    calls += 1;
    return partial;
  });
  assert.equal(calls, 1, 'the injected createPartialResponse is used');
  assert.equal(out, partial, 'its 206 is what the audio element receives');
});

test('a non-200 (stale-manifest 404) passes through as-is so recovery can fire', async () => {
  const notFound = new Response('', { status: 404 });
  const out = await ensurePartialResponse(rangeReq(), notFound, async () => {
    throw new Error('must not synthesize a partial from an error response');
  });
  assert.equal(out, notFound);
});

test('a cache-hit 206 passes through untouched (no double conversion)', async () => {
  const partial = new Response('ab', { status: 206 });
  const out = await ensurePartialResponse(rangeReq(), partial, async () => {
    throw new Error('must not re-partial an already-partial response');
  });
  assert.equal(out, partial);
});

test('a rangeless request keeps its full 200', async () => {
  const full = new Response('abcdef');
  const out = await ensurePartialResponse(
    new Request('https://x/audio/clip.mp3'),
    full,
    async () => {
      throw new Error('nothing asked for a range - no partial to make');
    }
  );
  assert.equal(out, full);
});
