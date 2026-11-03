#!/usr/bin/env node
// Renders the favicons and apple-touch icon from the real Icon Composer
// exports in src/assets/icon/ (spec §12). The outputs are committed, so builds
// don't depend on sharp; re-run this (`npm run generate:icons`) only when the
// icon changes.
//
//   public/favicon-32x32.png       32 × 32, from Default
//   public/favicon-dark-32x32.png  32 × 32, from Dark (linked for dark mode)
//   public/apple-touch-icon.png    180 × 180, from Default, on white (iOS
//                                  fills transparency with black)
//
// public/og.png is not rendered here: it's the tesseract OG render
// (.agents/designs/assets/tesseract/og-image-1200x630.png), copied as is.
// Re-export it on a Mac from assets/tesseract/source/og-image.html first.
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ICONS = join(ROOT, 'src/assets/icon');
const PUBLIC = join(ROOT, 'public');
const icon = (variant) => join(ICONS, `AppIcon-macOS-${variant}-1024.png`);

await sharp(icon('Default')).resize(32, 32).png().toFile(join(PUBLIC, 'favicon-32x32.png'));
await sharp(icon('Dark')).resize(32, 32).png().toFile(join(PUBLIC, 'favicon-dark-32x32.png'));
await sharp(icon('Default'))
  .resize(180, 180)
  .flatten({ background: '#ffffff' })
  .png()
  .toFile(join(PUBLIC, 'apple-touch-icon.png'));

console.log('generate:icons — wrote favicon-32x32.png, favicon-dark-32x32.png and apple-touch-icon.png');
