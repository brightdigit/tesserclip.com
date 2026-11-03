// The only place for release state, store links, addresses and feature
// switches (spec §4). Pages and components import from here and never
// hard-code these values. The guards at the bottom run on any import.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { checkConfig, type Analytics, type ReleaseState } from './lib/config-guard';

export type { Analytics, ReleaseState };

export const APP_NAME = 'TesserClip';
export const TAGLINE = 'Fix copied text before you paste it.';
export const MIN_MACOS = 'macOS 27';
export const CATEGORY = 'Productivity';
export const VERSION_LABEL = '1.0 beta 1'; // press fact sheet, support “Known issues in …”

export const RELEASE_STATE: ReleaseState = 'beta'; // D8: launch in beta

export const TESTFLIGHT_PLACEHOLDER = 'https://testflight.apple.com/join/PLACEHOLDER';
export const TESTFLIGHT_URL: string = 'https://testflight.apple.com/join/WX95KgBZ'; // public beta link (#9)
export const APP_STORE_ID: string = ''; // numeric, e.g. '6760000000'
export const APP_STORE_URL = APP_STORE_ID ? `https://apps.apple.com/app/id${APP_STORE_ID}` : '';
export const SHOW_LAUNCH_PILL = true; // released state: “New on the Mac App Store”

export const REPO_PUBLIC = false;
export const REPO_URL = 'https://github.com/brightdigit/TesserClip';

export const SUPPORT_EMAIL = 'support@tesserclip.com';
export const PRESS_EMAIL = SUPPORT_EMAIL; // D20

export const ANALYTICS: Analytics = { provider: 'none' };

export const COMPANY_NAME = 'BrightDigit';
export const COMPANY_LEGAL_NAME = 'BrightDigit, LLC';
export const COMPANY_URL = 'https://brightdigit.com';
export const FOUNDER_NAME = 'Leo Dion';
export const COPYRIGHT = '© 2026 BrightDigit. All rights reserved.';
export const SITE_URL = 'https://tesserclip.com';
export const OG_IMAGE_URL = `${SITE_URL}/og.png`;

// App contract: these paths are compiled into the app and must never 404.
// scripts/check-links.js reads this list (keep it on one line).
export const APP_HELP_PATHS = ['/help', '/help/clipboard-permission'] as const;

// ---------------------------------------------------------------------------
// Guards (spec §4, D28). The logic is a pure function in lib/config-guard.ts.

const privacyPath = join(process.cwd(), 'src/content/legal/privacy.md');

const guard = checkConfig(
  {
    releaseState: RELEASE_STATE,
    testflightUrl: TESTFLIGHT_URL,
    testflightPlaceholder: TESTFLIGHT_PLACEHOLDER,
    appStoreId: APP_STORE_ID,
    analytics: ANALYTICS,
    privacyCopy: existsSync(privacyPath) ? readFileSync(privacyPath, 'utf8') : undefined,
  },
  process.env,
);

for (const warning of guard.warnings) console.warn(`⚠️  ${warning} (fatal with SITE_DEPLOY=1)`);
if (guard.errors.length > 0) {
  throw new Error(`src/config.ts: ${guard.errors.join('; ')}`);
}
