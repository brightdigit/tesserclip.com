#!/usr/bin/env node
// Renders the interim favicons and OG image from the placeholder icon
// (src/assets/icon/app-icon.svg). The outputs are committed, so builds don't
// depend on sharp; re-run this (`npm run generate:icons`) only when the icon
// changes. The real-assets issue (#8) replaces all of them.
//
//   public/favicon.svg          copy of the icon (follows the colour scheme)
//   public/favicon-32x32.png    32 × 32
//   public/apple-touch-icon.png 180 × 180
//   public/og.png               1200 × 630
import { copyFileSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ICON = join(ROOT, 'src/assets/icon/app-icon.svg');
const ICON_DARK = join(ROOT, 'src/assets/icon/app-icon-dark.svg');
const PUBLIC = join(ROOT, 'public');

// The light appearance, with the colour-scheme media query removed, so
// librsvg renders a stable image.
const lightIcon = Buffer.from(
  readFileSync(ICON, 'utf8').replace(/<style>[\s\S]*?<\/style>/, '<style>.dk{display:none}</style>'),
);

copyFileSync(ICON, join(PUBLIC, 'favicon.svg'));
await sharp(lightIcon, { density: 72 }).resize(32, 32).png().toFile(join(PUBLIC, 'favicon-32x32.png'));
await sharp(lightIcon, { density: 144 }).resize(180, 180).png().toFile(join(PUBLIC, 'apple-touch-icon.png'));

// OG image: the dark-stage gradient (#4A1D7A → #06030D), the dark icon, the
// name and the tagline.
const iconPng = await sharp(readFileSync(ICON_DARK), { density: 144 }).resize(300, 300).png().toBuffer();
const font = `-apple-system, 'SF Pro Display', 'Helvetica Neue', Inter, Helvetica, Arial, sans-serif`;
const background = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0.35" y2="1">
      <stop offset="0" stop-color="#4A1D7A"/><stop offset="0.55" stop-color="#22103A"/><stop offset="1" stop-color="#06030D"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <text x="440" y="300" font-family="${font}" font-size="96" font-weight="700" letter-spacing="-2.5" fill="#FFFFFF">TesserClip</text>
  <text x="444" y="372" font-family="${font}" font-size="38" font-weight="500" fill="#E8DDF5">Fix copied text before you paste it.</text>
  <text x="444" y="452" font-family="${font}" font-size="26" font-weight="400" fill="#A1A1A6">For macOS 27 · tesserclip.com</text>
</svg>`);
await sharp(background)
  .composite([{ input: iconPng, left: 110, top: 165 }])
  .png()
  .toFile(join(PUBLIC, 'og.png'));

console.log('generate:icons — wrote favicon.svg, favicon-32x32.png, apple-touch-icon.png and og.png');
