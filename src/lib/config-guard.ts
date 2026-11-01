// Pure release-config checks (spec §4). src/config.ts runs them on import, and
// `node --test` covers them in config-guard.test.ts (run by `make build`).
// Keep this file to erasable TypeScript only (no enums or parameter
// properties) so Node can run it directly with type stripping.

export type ReleaseState = 'comingSoon' | 'beta' | 'released';

export type Analytics = { provider: 'none' } | { provider: 'plausible'; domain: string };

export interface GuardConfig {
  releaseState: ReleaseState;
  testflightUrl: string;
  testflightPlaceholder: string;
  appStoreId: string;
  analytics: Analytics;
  /** Raw source of src/content/legal/privacy.md, when it exists. */
  privacyCopy?: string;
}

export interface GuardEnv {
  SITE_DEPLOY?: string;
  GITHUB_REF?: string;
}

export interface GuardResult {
  /** Fatal problems: the build must stop. */
  errors: string[];
  /** Problems that only matter for a production (deploy) build. */
  warnings: string[];
}

export const TESTFLIGHT_PLACEHOLDER_MESSAGE =
  'TESTFLIGHT_URL is still the placeholder; set the public TestFlight link in src/config.ts';
export const APP_STORE_ID_MESSAGE = 'APP_STORE_ID is required when RELEASE_STATE is "released"';
export const ANALYTICS_COPY_MESSAGE =
  'ANALYTICS is on, but src/content/legal/privacy.md still says the site doesn’t run analytics; update its “This website” paragraph';

/** A production build is the deploy job on main, `make build-production`, or any SITE_DEPLOY=1 build. */
export function isProductionBuild(env: GuardEnv): boolean {
  return env.SITE_DEPLOY === '1' || env.GITHUB_REF === 'refs/heads/main';
}

/** Matches “doesn’t … run analytics” with a straight or curly apostrophe. */
const NO_ANALYTICS_COPY = /doesn['’]t[^.]*\brun analytics\b/i;

export function checkConfig(config: GuardConfig, env: GuardEnv): GuardResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (config.releaseState === 'beta' && config.testflightUrl === config.testflightPlaceholder) {
    (isProductionBuild(env) ? errors : warnings).push(TESTFLIGHT_PLACEHOLDER_MESSAGE);
  }

  if (config.releaseState === 'released' && config.appStoreId.trim() === '') {
    errors.push(APP_STORE_ID_MESSAGE);
  }

  if (
    config.analytics.provider !== 'none' &&
    config.privacyCopy !== undefined &&
    NO_ANALYTICS_COPY.test(config.privacyCopy)
  ) {
    errors.push(ANALYTICS_COPY_MESSAGE);
  }

  return { errors, warnings };
}
