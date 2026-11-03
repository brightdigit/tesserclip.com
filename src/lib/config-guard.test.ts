import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  ANALYTICS_COPY_MESSAGE,
  APP_STORE_ID_MESSAGE,
  TESTFLIGHT_PLACEHOLDER_MESSAGE,
  checkConfig,
  isProductionBuild,
  type GuardConfig,
} from './config-guard.ts';

const PLACEHOLDER = 'https://testflight.apple.com/join/PLACEHOLDER';
const REAL = 'https://testflight.apple.com/join/AbCdEf12';

const base: GuardConfig = {
  releaseState: 'beta',
  testflightUrl: PLACEHOLDER,
  testflightPlaceholder: PLACEHOLDER,
  appStoreId: '',
  analytics: { provider: 'none' },
};

test('isProductionBuild: SITE_DEPLOY=1 or the main ref', () => {
  assert.equal(isProductionBuild({}), false);
  assert.equal(isProductionBuild({ SITE_DEPLOY: '0' }), false);
  assert.equal(isProductionBuild({ GITHUB_REF: 'refs/pull/3/merge' }), false);
  assert.equal(isProductionBuild({ SITE_DEPLOY: '1' }), true);
  assert.equal(isProductionBuild({ GITHUB_REF: 'refs/heads/main' }), true);
});

test('beta + placeholder: dev builds only warn', () => {
  const result = checkConfig(base, {});
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.warnings, [TESTFLIGHT_PLACEHOLDER_MESSAGE]);
});

test('beta + placeholder: production builds fail', () => {
  assert.deepEqual(checkConfig(base, { SITE_DEPLOY: '1' }).errors, [TESTFLIGHT_PLACEHOLDER_MESSAGE]);
  assert.deepEqual(checkConfig(base, { GITHUB_REF: 'refs/heads/main' }).errors, [
    TESTFLIGHT_PLACEHOLDER_MESSAGE,
  ]);
});

test('beta + real TestFlight link passes a production build', () => {
  const result = checkConfig({ ...base, testflightUrl: REAL }, { SITE_DEPLOY: '1' });
  assert.deepEqual(result, { errors: [], warnings: [] });
});

test('comingSoon ignores the TestFlight placeholder', () => {
  const result = checkConfig({ ...base, releaseState: 'comingSoon' }, { SITE_DEPLOY: '1' });
  assert.deepEqual(result, { errors: [], warnings: [] });
});

test('released without APP_STORE_ID fails every build', () => {
  const released: GuardConfig = { ...base, releaseState: 'released' };
  assert.deepEqual(checkConfig(released, {}).errors, [APP_STORE_ID_MESSAGE]);
  assert.deepEqual(checkConfig(released, { SITE_DEPLOY: '1' }).errors, [APP_STORE_ID_MESSAGE]);
  assert.deepEqual(checkConfig({ ...released, appStoreId: '   ' }, {}).errors, [APP_STORE_ID_MESSAGE]);
});

test('released with APP_STORE_ID passes, even with the TestFlight placeholder', () => {
  const result = checkConfig({ ...base, releaseState: 'released', appStoreId: '6760000000' }, { SITE_DEPLOY: '1' });
  assert.deepEqual(result, { errors: [], warnings: [] });
});

test('analytics on while the privacy copy says “doesn’t run analytics” fails', () => {
  const privacyCopy =
    'tesserclip.com is a static website hosted on GitHub Pages. It doesn’t use cookies, run analytics or ask for personal information.';
  const plausible: GuardConfig = {
    ...base,
    testflightUrl: REAL,
    analytics: { provider: 'plausible', domain: 'tesserclip.com' },
    privacyCopy,
  };
  assert.deepEqual(checkConfig(plausible, {}).errors, [ANALYTICS_COPY_MESSAGE]);
  assert.deepEqual(checkConfig({ ...plausible, privacyCopy: privacyCopy.replace('’', "'") }, {}).errors, [
    ANALYTICS_COPY_MESSAGE,
  ]);
  // Updated copy passes.
  assert.deepEqual(
    checkConfig({ ...plausible, privacyCopy: 'This website uses Plausible, a cookieless analytics service.' }, {})
      .errors,
    [],
  );
  // Analytics off: the copy is correct as is.
  assert.deepEqual(checkConfig({ ...plausible, analytics: { provider: 'none' } }, {}).errors, []);
});
