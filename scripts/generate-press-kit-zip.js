#!/usr/bin/env node

/**
 * Generate the press kit ZIP from the app icons and screenshots.
 * Runs automatically as a prebuild step. Adapted from atleast.app.
 *
 *   public/downloads/tesserclip-press-kit.zip   (gitignored, rebuilt every build)
 *     README.txt     rendered from src/data/press.json (src/lib/press.ts)
 *     icons/         public/press/icons/   (SVGs + 1024/512 PNG renders)
 *     screenshots/   public/press/screenshots/
 *
 * The icon files in public/press/icons/ are committed, so dev builds don't
 * depend on sharp. They're only (re)rendered from src/assets/icon/ when one is
 * missing, or with `--force` (`npm run generate:presskit -- --force`).
 */

import archiver from 'archiver';
import { copyFileSync, createWriteStream, existsSync, mkdirSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { basename, dirname, join } from 'path';
import { readReleaseInfo, renderPressReadme } from '../src/lib/press.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const publicDir = join(rootDir, 'public');
const iconSourceDir = join(rootDir, 'src', 'assets', 'icon');
const iconDir = join(publicDir, 'press', 'icons');
const outputDir = join(publicDir, 'downloads');
const outputPath = join(outputDir, 'tesserclip-press-kit.zip');
const force = process.argv.includes('--force');

const press = JSON.parse(readFileSync(join(rootDir, 'src', 'data', 'press.json'), 'utf8'));
const releaseInfo = readReleaseInfo(readFileSync(join(rootDir, 'src', 'config.ts'), 'utf8'));
const readme = renderPressReadme(press, releaseInfo);

/** Copies the SVGs and renders the PNG/WebP icons that are missing. */
async function ensureIcons() {
  mkdirSync(iconDir, { recursive: true });
  const variants = [
    // The default icon carries both appearances through prefers-color-scheme;
    // render its light appearance (as generate-interim-icons.js does).
    {
      svg: 'app-icon.svg',
      stem: 'app-icon',
      transform: (source) => source.replace(/<style>[\s\S]*?<\/style>/, '<style>.dk{display:none}</style>'),
    },
    { svg: 'app-icon-dark.svg', stem: 'app-icon-dark', transform: (source) => source },
  ];
  let sharp;
  for (const { svg, stem, transform } of variants) {
    const source = join(iconSourceDir, svg);
    const copy = join(iconDir, svg);
    if (force || !existsSync(copy)) copyFileSync(source, copy);
    const outputs = [
      { file: `${stem}-1024.png`, size: 1024, format: 'png' },
      { file: `${stem}-512.png`, size: 512, format: 'png' },
      { file: `${stem}-1024.webp`, size: 1024, format: 'webp' },
    ];
    for (const { file, size, format } of outputs) {
      const target = join(iconDir, file);
      if (!force && existsSync(target)) continue;
      sharp ??= (await import('sharp')).default;
      const input = Buffer.from(transform(readFileSync(source, 'utf8')));
      const image = sharp(input, { density: 72 * (size / 1024) * 2 }).resize(size, size);
      await (format === 'png' ? image.png() : image.webp({ quality: 90 })).toFile(target);
      console.log(`   rendered press/icons/${file}`);
    }
  }
}

console.log('📦 Generating press kit ZIP...');

async function generatePressKit() {
  try {
    await ensureIcons();
    mkdirSync(outputDir, { recursive: true });

    const output = createWriteStream(outputPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    const done = new Promise((resolve, reject) => {
      output.on('close', resolve);
      output.on('error', reject);
      archive.on('error', reject);
    });

    archive.pipe(output);

    // Favicons and the OG image never belong in the kit (spec §11).
    const EXCLUDED_NAMES = new Set([
      'apple-touch-icon.png',
      'favicon.svg',
      'favicon-32x32.png',
      'og.png',
    ]);

    const filter = (entry) => {
      if (entry.name.endsWith('.webp')) return false;
      if (basename(entry.name).startsWith('.')) return false;
      if (EXCLUDED_NAMES.has(basename(entry.name))) return false;
      return entry;
    };

    archive.append(readme, { name: 'README.txt' });

    archive.directory(iconDir, 'icons', filter);
    archive.directory(join(publicDir, 'press', 'screenshots'), 'screenshots', filter);

    await archive.finalize();
    await done;

    console.log('✅ Press kit ZIP generated!\n');
  } catch (error) {
    console.error('❌ Error generating press kit:', error);
    process.exit(1);
  }
}

generatePressKit();
