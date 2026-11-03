import { test } from 'node:test';
import assert from 'node:assert/strict';
import { downloadUrl, heroCopy, softwareApplication, storeFact } from './release-copy.ts';

const TF = 'https://testflight.apple.com/join/AbCdEf12';
const AS = 'https://apps.apple.com/app/id6760000000';

test('heroCopy: beta', () => {
  assert.deepEqual(heroCopy({ releaseState: 'beta', showLaunchPill: true, minMacOS: 'macOS 27' }), {
    pill: 'Now in beta on TestFlight',
    requirementLine: 'Coming soon to the Mac App Store. Requires macOS 27 or later.',
  });
});

test('heroCopy: comingSoon', () => {
  assert.deepEqual(heroCopy({ releaseState: 'comingSoon', showLaunchPill: true, minMacOS: 'macOS 27' }), {
    pill: 'Coming soon to the Mac App Store',
    requirementLine: 'Coming soon to the Mac App Store. Requires macOS 27 or later.',
  });
});

test('heroCopy: released, with and without the launch pill', () => {
  assert.deepEqual(heroCopy({ releaseState: 'released', showLaunchPill: true, minMacOS: 'macOS 27' }), {
    pill: 'New on the Mac App Store',
    requirementLine: 'Requires macOS 27 or later.',
  });
  assert.equal(heroCopy({ releaseState: 'released', showLaunchPill: false, minMacOS: 'macOS 27' }).pill, null);
});

test('storeFact: only released links to the App Store', () => {
  assert.deepEqual(storeFact('beta', AS), { label: 'Coming soon to the Mac App Store' });
  assert.deepEqual(storeFact('comingSoon', AS), { label: 'Coming soon to the Mac App Store' });
  assert.deepEqual(storeFact('released', AS), { label: 'Available on the Mac App Store', href: AS });
});

test('downloadUrl per state', () => {
  assert.equal(downloadUrl('beta', TF, AS), TF);
  assert.equal(downloadUrl('released', TF, AS), AS);
  assert.equal(downloadUrl('comingSoon', TF, AS), undefined);
  assert.equal(downloadUrl('released', TF, ''), undefined);
});

const base = {
  name: 'TesserClip',
  description: 'Fix copied text before you paste it.',
  minMacOS: 'macOS 27',
  siteUrl: 'https://tesserclip.com',
  imageUrl: 'https://tesserclip.com/og.png',
  companyName: 'BrightDigit',
  companyUrl: 'https://brightdigit.com',
  testflightUrl: TF,
  appStoreUrl: AS,
  price: '0',
  priceCurrency: 'USD',
};

test('softwareApplication: required fields', () => {
  const schema = softwareApplication({ ...base, releaseState: 'beta' });
  assert.equal(schema['@type'], 'SoftwareApplication');
  assert.equal(schema.operatingSystem, 'macOS 27 or later');
  assert.equal(schema.applicationCategory, 'UtilitiesApplication');
  assert.equal(schema.url, 'https://tesserclip.com/');
  assert.deepEqual(schema.publisher, { '@type': 'Organization', name: 'BrightDigit', url: 'https://brightdigit.com' });
  assert.equal(schema.downloadUrl, TF);
  assert.deepEqual(schema.offers, { '@type': 'Offer', price: '0', priceCurrency: 'USD' });
});

test('softwareApplication: no offers when the price is empty', () => {
  assert.equal('offers' in softwareApplication({ ...base, releaseState: 'beta', price: '' }), false);
});

test('softwareApplication: downloadUrl follows the state', () => {
  assert.equal(softwareApplication({ ...base, releaseState: 'released' }).downloadUrl, AS);
  assert.equal('downloadUrl' in softwareApplication({ ...base, releaseState: 'comingSoon' }), false);
});
