#!/usr/bin/env node
// Internal link checker for the built site (spec §15), adapted from
// atleast.app. Run it after `make build`: `make check-links`.
//
// It fails when:
//   1. an internal href, src or srcset has no file in dist/;
//   2. an internal link's #fragment has no matching id on its target page;
//   3. a required path is missing: APP_HELP_PATHS from src/config.ts (compiled
//      into the app, so they must never 404) plus the pages in REQUIRED below.
//
// scripts/check-links.allow lists temporary exceptions for 1 and 2 (one path
// per line, `#` starts a comment). It can never excuse a required path.

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const ALLOW_FILE = join(ROOT, 'scripts', 'check-links.allow');
const CONFIG_FILE = join(ROOT, 'src', 'config.ts');

// Required besides APP_HELP_PATHS. #6 adds '/downloads/tesserclip-press-kit.zip'
// once the press kit zip is generated at build time.
const REQUIRED = ['/', '/privacy', '/support', '/terms', '/press', '/404.html'];

if (!existsSync(DIST)) {
  console.error('check:links — dist/ not found. Run `make build` first.');
  process.exit(1);
}

/** APP_HELP_PATHS, read from src/config.ts so the list lives in one place. */
function appHelpPaths() {
  const source = readFileSync(CONFIG_FILE, 'utf8');
  const match = source.match(/APP_HELP_PATHS\s*=\s*\[([^\]]*)\]/);
  if (!match) {
    console.error('check:links — could not find APP_HELP_PATHS in src/config.ts.');
    process.exit(1);
  }
  const paths = [...match[1].matchAll(/['"]([^'"]+)['"]/g)].map((m) => m[1]);
  if (paths.length === 0) {
    console.error('check:links — APP_HELP_PATHS in src/config.ts is empty.');
    process.exit(1);
  }
  return paths;
}

/** Recursively collect every .html file under dir. */
function htmlFiles(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...htmlFiles(full));
    else if (name.endsWith('.html')) out.push(full);
  }
  return out;
}

/** Strip the fragment, the query string and any trailing slash. */
function normalize(href) {
  const path = href.split('#')[0].split('?')[0];
  if (path === '/' || path === '') return '/';
  return path.replace(/\/+$/, '');
}

/** Paths that are allowed to be missing for now. */
function readAllowlist() {
  if (!existsSync(ALLOW_FILE)) return new Set();
  return new Set(
    readFileSync(ALLOW_FILE, 'utf8')
      .split('\n')
      .map((line) => line.replace(/#.*$/, '').trim())
      .filter(Boolean)
      .map(normalize),
  );
}

/** The file dist/ serves for this internal path, or null. */
function resolveFile(path) {
  const relative = path === '/' ? '' : decodeURI(path).replace(/^\//, '');
  const target = resolve(DIST, relative);
  if (target !== DIST && !target.startsWith(DIST + sep)) return null;
  if (existsSync(target) && statSync(target).isFile()) return target;
  const index = join(target, 'index.html');
  if (existsSync(index)) return index;
  return null;
}

/** Every id (and legacy a[name]) on an HTML page, cached. */
const idCache = new Map();
function idsIn(file) {
  if (!idCache.has(file)) {
    const html = readFileSync(file, 'utf8');
    const ids = new Set();
    for (const m of html.matchAll(/\s(?:id|name)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi)) {
      ids.add(m[1] ?? m[2] ?? m[3]);
    }
    idCache.set(file, ids);
  }
  return idCache.get(file);
}

/** Every URL in href, src and srcset attributes. */
function urlsIn(html) {
  const urls = [];
  for (const m of html.matchAll(/\s(href|src|srcset)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi)) {
    const value = (m[2] ?? m[3] ?? '').trim();
    if (m[1].toLowerCase() === 'srcset') {
      for (const candidate of value.split(',')) {
        const url = candidate.trim().split(/\s+/)[0];
        if (url) urls.push(url);
      }
    } else {
      urls.push(value);
    }
  }
  return urls;
}

const allow = readAllowlist();
const problems = new Map(); // message -> Set of source pages
const report = (message, source) => {
  if (!problems.has(message)) problems.set(message, new Set());
  problems.get(message).add(source);
};

for (const file of htmlFiles(DIST)) {
  const html = readFileSync(file, 'utf8');
  const source = '/' + file.slice(DIST.length + 1).split(sep).join('/');
  for (const raw of urlsIn(html)) {
    // Same-page fragments.
    if (raw.startsWith('#')) {
      const fragment = decodeURIComponent(raw.slice(1));
      if (fragment && !idsIn(file).has(fragment)) report(`#${fragment} (no such id on the page)`, source);
      continue;
    }
    // Internal, root-absolute paths only. Skips mailto:, tel:, http(s):,
    // protocol-relative //host, data: and relative links.
    if (!raw.startsWith('/') || raw.startsWith('//')) continue;
    const path = normalize(raw);
    if (allow.has(path)) continue;
    const target = resolveFile(path);
    if (!target) {
      report(`${path} (no file in dist/)`, source);
      continue;
    }
    const hashAt = raw.indexOf('#');
    if (hashAt !== -1 && target.endsWith('.html')) {
      const fragment = decodeURIComponent(raw.slice(hashAt + 1));
      if (fragment && !idsIn(target).has(fragment)) report(`${path}#${fragment} (no such id)`, source);
    }
  }
}

const required = [...appHelpPaths(), ...REQUIRED];
const missingRequired = required.filter((path) => !resolveFile(normalize(path)));

if (problems.size > 0 || missingRequired.length > 0) {
  if (missingRequired.length > 0) {
    console.error(`check:links — ${missingRequired.length} required path(s) missing from dist/:\n`);
    for (const path of missingRequired) console.error(`  ${path}`);
    console.error('\nRequired paths (the app’s help URLs among them) must always exist. They can’t be allowlisted.\n');
  }
  if (problems.size > 0) {
    console.error(`check:links — ${problems.size} broken internal link(s):\n`);
    for (const [message, sources] of [...problems].sort()) {
      console.error(`  ${message}`);
      for (const s of [...sources].sort()) console.error(`      from ${s}`);
    }
    console.error(
      '\nFix the link, or add the path to scripts/check-links.allow if the page is coming in a later PR.',
    );
  }
  process.exit(1);
}

console.log(
  `check:links — all internal links and fragments resolve; ${required.length} required paths present.`,
);
