/**
 * Unit tests for the pure coach-voice timing helpers. The audio "feel" (no
 * garble at section boundaries, a natural beat before option A) is verified by
 * ear in the running app; these lock down the numbers behind it.
 * Run: `npm test`  (node --experimental-strip-types --test)
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  CLIP_FADE_MS,
  CLIP_FADE_STEP_MS,
  OPTION_GAP_MS,
  OPTION_LEAD_IN_MS,
  fadeRamp,
} from '../src/lib/narrationTiming.ts';

test('the option lead-in is an unhurried, positive beat', () => {
  assert.ok(OPTION_LEAD_IN_MS >= 500, 'at least a half second so the options are not rushed');
});

test('the inter-option gap separates reads without dragging', () => {
  assert.ok(OPTION_GAP_MS > 0, 'there is a real beat between option reads');
  assert.ok(
    OPTION_GAP_MS < OPTION_LEAD_IN_MS,
    'peers are spaced less than the phase change into the options'
  );
});

test('fadeRamp lands on exactly silence', () => {
  const ramp = fadeRamp(1, CLIP_FADE_MS, CLIP_FADE_STEP_MS);
  assert.ok(ramp.length >= 1, 'always at least one step');
  assert.equal(ramp[ramp.length - 1], 0, 'ends fully silent so the release is inaudible');
});

test('fadeRamp is monotonically decreasing and bounded by the start volume', () => {
  const start = 0.8;
  const ramp = fadeRamp(start, CLIP_FADE_MS, CLIP_FADE_STEP_MS);
  for (let i = 0; i < ramp.length; i++) {
    assert.ok(ramp[i] >= 0 && ramp[i] <= start, `step ${i} within [0, start]`);
    if (i > 0) assert.ok(ramp[i] < ramp[i - 1], `step ${i} quieter than the last`);
  }
});

test('fadeRamp has the expected number of steps for the configured window', () => {
  const ramp = fadeRamp(1, CLIP_FADE_MS, CLIP_FADE_STEP_MS);
  assert.equal(ramp.length, Math.round(CLIP_FADE_MS / CLIP_FADE_STEP_MS));
});

test('fadeRamp never underflows below zero even with odd divisions', () => {
  const ramp = fadeRamp(0.5, 100, 30); // 100/30 rounds to 3 steps
  assert.equal(ramp.length, 3);
  for (const v of ramp) assert.ok(v >= 0, 'clamped at zero');
  assert.equal(ramp[ramp.length - 1], 0);
});
