/**
 * Unit tests for the service worker's Range-strip helper (`src/sw.ts` uses it to
 * make narration mp3s cacheable). The end-to-end offline-audio behavior is
 * verified in a real prod build/preview; these lock down the one invariant the
 * whole fix rests on: the network fetch must carry NO `Range` header, so the
 * host returns a cacheable full `200` instead of an uncacheable `206`.
 * Run: `npm test`  (node --experimental-strip-types --test)
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { stripRangeHeader } from '../src/lib/swRangeStrip.ts';

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
