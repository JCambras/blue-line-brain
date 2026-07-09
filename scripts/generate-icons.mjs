// One-off icon generator: rasterizes public/favicon.svg into the PNG icons
// the PWA manifest references. The emitted PNGs are committed build artifacts
// (like public/audio), so the app/CI never rasterize at runtime and `sharp`
// is intentionally NOT a committed dependency. To regenerate after editing
// favicon.svg: `npm i -D sharp && node scripts/generate-icons.mjs && npm un sharp`.
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const svg = readFileSync(path.join(root, 'public', 'favicon.svg'));

const targets = [
  { file: 'pwa-192x192.png', size: 192 },
  { file: 'pwa-512x512.png', size: 512 },
  { file: 'maskable-icon-512x512.png', size: 512 },
  { file: 'apple-touch-icon.png', size: 180 },
];

for (const { file, size } of targets) {
  await sharp(svg, { density: 384 })
    .resize(size, size)
    .png()
    .toFile(path.join(root, 'public', file));
  console.log(`wrote public/${file} (${size}x${size})`);
}
