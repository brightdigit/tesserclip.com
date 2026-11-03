import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { pressDistribution, pressFacts, pressStatus, readReleaseInfo, renderPressReadme, type PressData } from './press.ts';

const press: PressData = JSON.parse(readFileSync(new URL('../data/press.json', import.meta.url), 'utf8'));

test('status and distribution follow the release state (spec §8)', () => {
  assert.equal(pressStatus('comingSoon', '1.0 beta 1'), 'Coming soon');
  assert.equal(pressStatus('beta', '1.0 beta 1'), 'Beta on TestFlight (1.0 beta 1)');
  assert.equal(pressStatus('released', '1.0'), 'Available on the Mac App Store');
  assert.equal(pressDistribution('comingSoon'), 'Mac App Store');
  assert.equal(pressDistribution('beta'), 'Mac App Store (TestFlight beta)');
  assert.equal(pressDistribution('released'), 'Mac App Store');
});

test('fact sheet rows are in order and have no price row', () => {
  const facts = pressFacts(press, 'beta', '1.0 beta 1');
  assert.deepEqual(
    facts.map((fact) => fact.label),
    ['App name', 'Developer', 'Platform', 'Minimum OS', 'Status', 'Category', 'Distribution', 'Website'],
  );
  assert.ok(!facts.some((fact) => /price/i.test(fact.label)));
  assert.deepEqual(facts.at(-1), { label: 'Website', value: 'tesserclip.com', href: 'https://tesserclip.com' });
});

test('reads release info from config source', () => {
  const source = [
    "export const VERSION_LABEL = '1.0 beta 1'; // comment",
    "export const RELEASE_STATE: ReleaseState = 'beta';",
    "export const SUPPORT_EMAIL = 'support@tesserclip.com';",
  ].join('\n');
  assert.deepEqual(readReleaseInfo(source), {
    releaseState: 'beta',
    versionLabel: '1.0 beta 1',
    supportEmail: 'support@tesserclip.com',
  });
  assert.throws(() => readReleaseInfo("export const RELEASE_STATE: ReleaseState = 'gold';"), /RELEASE_STATE/);
  assert.throws(() => readReleaseInfo(''), /could not read/);
});

test('reads the real src/config.ts', () => {
  const info = readReleaseInfo(readFileSync(new URL('../config.ts', import.meta.url), 'utf8'));
  assert.equal(info.supportEmail, 'support@tesserclip.com');
});

test('README carries the facts, descriptions, guidelines and contact', () => {
  const readme = renderPressReadme(press, { releaseState: 'beta', versionLabel: '1.0 beta 1', supportEmail: 'support@tesserclip.com' });
  assert.match(readme, /^TesserClip Press Kit\n={20}\n/);
  assert.ok(readme.includes(press.descriptions.short));
  assert.ok(readme.includes(press.descriptions.long));
  assert.ok(readme.includes('Status:       Beta on TestFlight (1.0 beta 1)'));
  assert.ok(readme.includes('Distribution: Mac App Store (TestFlight beta)'));
  for (const line of press.iconGuidelines) assert.ok(readme.includes(`- ${line}`));
  assert.ok(readme.includes('email support@tesserclip.com.'));
  assert.ok(readme.includes('Press page: https://tesserclip.com/press'));
  assert.ok(readme.includes('key-art/      Tesseract key art, 2400 × 1260 (PNG)'));
  assert.ok(readme.includes(press.name.text));
  assert.ok(!/press@/.test(readme));
  assert.ok(!/price/i.test(readme));
});

test('the icon section lists the six Icon Composer exports (spec §11)', () => {
  assert.deepEqual(
    press.icons.map((icon) => icon.name),
    ['Default', 'Dark', 'Clear light', 'Clear dark', 'Tinted light', 'Tinted dark'],
  );
  for (const icon of press.icons) assert.match(icon.file, /^AppIcon-macOS-\w+-1024\.png$/);
});
