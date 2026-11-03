#!/usr/bin/env node

/**
 * Generate the press kit ZIP from the app icons, key art and screenshots.
 * Runs automatically as a prebuild step. Adapted from atleast.app.
 *
 *   public/downloads/tesserclip-press-kit.zip   (gitignored, rebuilt every build)
 *     README.txt     rendered from src/data/press.json (src/lib/press.ts)
 *     icons/         public/press/icons/   (the six Icon Composer exports at
 *                                          1024, plus 512 renders of Default and Dark)
 *     key-art/       public/press/key-art/ (the 2400 × 1260 tesseract render)
 *     screenshots/   public/press/screenshots/
 *
 * The files in public/press/ are committed, so dev builds don't depend on
 * sharp. The 512 px renders are only (re)made from src/assets/icon/ when one
 * is missing, or with `--force` (`npm run generate:presskit -- --force`).
 */

import archiver from 'archiver';
import { createWriteStream, existsSync, mkdirSync, readFileSync } from 'fs';
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

/** Checks the committed originals and renders the 512 px icons that are missing. */
async function ensureFiles() {
  const required = [
    ...press.icons.map((icon) => join(iconDir, icon.file)),
    join(publicDir, 'press', 'key-art', press.keyArt.file),
    ...press.screenshots.map((shot) => join(publicDir, 'press', 'screenshots', shot.file)),
  ];
  const missing = required.filter((file) => !existsSync(file));
  if (missing.length) throw new Error(`press kit: missing ${missing.map((f) => f.slice(rootDir.length + 1)).join(', ')}`);

  let sharp;
  for (const variant of ['Default', 'Dark']) {
    const target = join(iconDir, `AppIcon-macOS-${variant}-512.png`);
    if (!force && existsSync(target)) continue;
    sharp ??= (await import('sharp')).default;
    await sharp(join(iconSourceDir, `AppIcon-macOS-${variant}-1024.png`)).resize(512, 512).png().toFile(target);
    console.log(`   rendered press/icons/${basename(target)}`);
  }
}

console.log('📦 Generating press kit ZIP...');

async function generatePressKit() {
  try {
    await ensureFiles();
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
      'favicon-32x32.png',
      'favicon-dark-32x32.png',
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
    archive.directory(join(publicDir, 'press', 'key-art'), 'key-art', filter);
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
