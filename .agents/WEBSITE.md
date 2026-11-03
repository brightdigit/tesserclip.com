# tesserclip.com — Website Specification

This is the source of truth for the TesserClip marketing and help site. Agents build from it without asking questions. If something here is wrong or missing, raise it in the PR and add it to [Open questions](#18-open-questions). Don't guess.

- **Status:** v1 spec, written 2026-10-31. Every decision in it was agreed with Leo on 2026-10-31. The visual direction was revised on 2026-11-02 to the **Tesseract** restyle (issue #17): §5, §7, §8, §9, §11–§14 and §16.
- **Designs:** [`.agents/designs/`](designs/README.md), with a standalone HTML file per screen and PNGs at 1440 and 390 wide in light and dark. The v1 mockups are archived in `designs/v1-original/` and are no longer normative.
- **App facts:** the TesserClip app repo (`brightdigit/TesserClip`) `.claude/SPEC.md` and `CHANGELOG.md`. The site must never claim more than the app SPEC says.

**How to read this spec.** Each section lists **Requirements** first. They are normative: a PR that misses one is incomplete. Most sections then add **Mechanism (non-normative)**, which is the suggested way to build it. You may use a different mechanism if it meets every requirement, but say so in the PR.

---

## Contents

1. [Goals and audience](#1-goals-and-audience)
2. [Identity](#2-identity)
3. [Stack](#3-stack)
4. [Configuration](#4-configuration)
5. [Theme and design tokens](#5-theme-and-design-tokens)
6. [Directory layout](#6-directory-layout)
7. [Components](#7-components)
8. [Release states](#8-release-states)
9. [Pages](#9-pages)
10. [Help content](#10-help-content)
11. [Press kit](#11-press-kit)
12. [SEO](#12-seo)
13. [Accessibility](#13-accessibility)
14. [Performance](#14-performance)
15. [CI and deploy](#15-ci-and-deploy)
16. [QA checklist](#16-qa-checklist)
17. [Non-goals](#17-non-goals)
18. [Open questions](#18-open-questions)

---

## 1. Goals and audience

**TesserClip** is a native macOS app from BrightDigit. It opens straight to whatever text you last copied, in a plain-text editor, so you can fix it before you paste it somewhere else. It replaces the “paste into TextEdit, edit, copy again” habit. It needs macOS 27 or later, and it ships through TestFlight now and the Mac App Store later.

### Goals

1. **Explain the app in one screen.** A visitor understands what TesserClip does from the home hero.
2. **Get people into the beta.** The primary action is joining the TestFlight beta. When the app is released, it becomes the Mac App Store badge (see [§8](#8-release-states)).
3. **Host the help the app links to.** The app opens `https://tesserclip.com/help` (Help ▸ TesserClip Help, ⌘?) and `https://tesserclip.com/help/clipboard-permission` (the permission window’s ? button). Both URLs are compiled into shipped builds, so they must **never 404**.
4. **Provide the App Store Connect URLs:** Privacy Policy (`/privacy`), Support (`/support`) and Marketing (`/`).
5. **Give press what they need** on `/press`: descriptions, icon, screenshots, facts and a downloadable zip.

### Audience

- Mac users who copy text, fix it and paste it: writers, developers, support staff, anyone who edits snippets between apps. Most arrive from TestFlight invites, social posts or the App Store.
- Current users who opened Help from the app. They want an answer, not marketing.
- Press and reviewers.
- Apple App Review, who check the privacy and support URLs.

### Voice

Calm, plain and short. Use the same words the app uses (“window”, “draft”, “Copy All”, “New Window from Clipboard”). Don’t use hype words. The copy rules are in [AGENTS.md](../AGENTS.md#copy-rules).

---

## 2. Identity

| Item | Value |
|---|---|
| Domain | `tesserclip.com` (apex canonical; `www` redirects through GitHub Pages) |
| App name | TesserClip |
| Tagline | Fix copied text before you paste it. |
| Developer (display) | BrightDigit |
| Legal entity | BrightDigit, LLC (Terms only) |
| Founder | Leo Dion |
| Support email | `support@tesserclip.com` |
| Press email | Same as support (`support@tesserclip.com`). There is no `press@` address. |
| Copyright line | © 2026 BrightDigit. All rights reserved. |
| Company site | https://brightdigit.com |
| App repo | `brightdigit/TesserClip`. It isn’t public, so the site doesn’t link it while `repoPublic` is `false`. |
| Minimum OS | macOS 27 |
| Category | Productivity |
| Current version label | `1.0 beta 1` (matches the About panel’s “Version 1.0 beta 1 (2)”) |

---

## 3. Stack

### Requirements

- The site is a static site, built with **Astro 7** and styled with **Tailwind CSS 4** through `@tailwindcss/vite`. It has no backend, no database, no CMS and no client-side framework.
- TypeScript runs in strict mode (`astro/tsconfigs/strict`).
- **Node 24** is pinned in `.mise.toml`. `make` is the front door. Agents never call `npm` directly, only through `make` or `mise exec -- npm …`.
- Help articles and legal pages are **Astro content collections** written in Markdown or MDX.
- The site makes **no third-party requests at runtime**: no web fonts, no CDNs, no analytics (D7) and no embeds.
- Pages need **no JavaScript** to work. The nav menu and FAQs use `<details>`. Any small script is optional progressive enhancement, served from `'self'`.

### Versions

Copy the dependency set from `brightdigit/atleast.app` and drop what this site doesn’t use. Don’t carry over `astro-icon`, the leads tooling or the video scripts.

| Package | Version | Why |
|---|---|---|
| `astro` | `^7.3.1` | Site generator |
| `tailwindcss`, `@tailwindcss/vite` | `^4.3.3` | Styling |
| `@astrojs/sitemap` | `^3.7.4` | `sitemap-index.xml` |
| `@astrojs/mdx` | the latest major that supports Astro 7 | MDX help articles |
| `@lhci/cli` (dev) | `^0.15.1` | Lighthouse CI |
| `archiver` (dev) | `^7.0.1` | Press kit zip |
| `sharp` (dev) | `^0.35.4` | Image processing, PNG renders of SVG icons |

Commit `package-lock.json`. CI uses `npm ci`. Copy atleast.app’s `overrides` block only if `npm audit` needs it.

### `astro.config.mjs`

```js
// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://tesserclip.com',
  trailingSlash: 'ignore',
  build: { format: 'directory' }, // /help/clipboard-permission → help/clipboard-permission/index.html
  compressHTML: true,             // Astro 7 defaults to 'jsx', which strips whitespace between inline elements
  integrations: [mdx(), sitemap({ filter: (page) => !page.endsWith('/404/') })],
  vite: { plugins: [tailwindcss()] },
});
```

Keep `build.format: 'directory'`. On GitHub Pages it makes `/help` and `/help/clipboard-permission` answer with a 301 to the trailing-slash URL, then a 200. The `file` format would put `help.html` next to a `help/` directory, which GitHub Pages resolves to a 404.

### `Makefile` and `.mise.toml`

```make
NPM := mise exec -- npm
SCRIPTS := dev build preview lighthouse check\:links generate\:presskit
.PHONY: install clean build-production check-links $(SCRIPTS)

install:
	SHARP_IGNORE_GLOBAL_LIBVIPS=1 $(NPM) install
$(SCRIPTS):
	$(NPM) run $@
check-links:          # alias, D4 name
	$(NPM) run check:links
build-production:     # what the deploy job runs: config guards are fatal (§4)
	SITE_DEPLOY=1 $(NPM) run build
clean:
	rm -rf dist .astro public/downloads node_modules/.astro
```

`.mise.toml`:

```toml
[tools]
node = "24"
```

`package.json` scripts, which follow atleast.app:

```json
{
  "prebuild": "node scripts/generate-press-kit-zip.js",
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "astro": "astro",
  "lighthouse": "lhci autorun",
  "check:links": "node scripts/check-links.js",
  "generate:presskit": "node scripts/generate-press-kit-zip.js"
}
```

---

## 4. Configuration

### Requirements

- `src/config.ts` is the **only** place that holds release state, store links, addresses and feature switches. Pages and components import from it and never hard-code these values.
- **TestFlight guard (D28).** `TESTFLIGHT_URL` starts as the exported placeholder constant. When `RELEASE_STATE === 'beta'` and `TESTFLIGHT_URL` still equals the placeholder, a **production build fails** with a clear error. A production build is the deploy job on `main`, `make build-production`, or any build with `SITE_DEPLOY=1`. A placeholder link can never be published.
  - Development builds (`make dev`, `make build`, PR CI) print a one-line warning and keep going, so agents can build and check pages before Leo fills in the link. *This dev-build allowance is how D28 is applied; Leo can tighten it in review.*
- **App Store guard.** When `RELEASE_STATE === 'released'` and `APP_STORE_ID` is empty, **every** build fails, as on atleast.app.
- **Analytics off (D7).** `ANALYTICS` defaults to `{ provider: 'none' }`. While it’s off, no analytics script or analytics CSP host appears anywhere in `dist/`. Switching to Plausible must be a one-line change here, and that change must also update the CSP and the privacy page’s “This website” paragraph (the build fails if Plausible is on and the privacy copy still says “doesn’t run analytics”).
- **`REPO_PUBLIC` (D12/D18)** defaults to `false`. While it’s `false`, no page links to GitHub, the source or Issues.

### Schema

```ts
// src/config.ts
export const APP_NAME = 'TesserClip';
export const TAGLINE = 'Fix copied text before you paste it.';
export const MIN_MACOS = 'macOS 27';
export const CATEGORY = 'Productivity';
export const VERSION_LABEL = '1.0 beta 1';          // press fact sheet, support “Known issues in …”

export type ReleaseState = 'comingSoon' | 'beta' | 'released';
export const RELEASE_STATE: ReleaseState = 'beta';  // D8: launch in beta

export const TESTFLIGHT_PLACEHOLDER = 'https://testflight.apple.com/join/PLACEHOLDER';
export const TESTFLIGHT_URL: string = TESTFLIGHT_PLACEHOLDER; // maintainer go-live issue fills this
export const APP_STORE_ID = '';                      // numeric, e.g. '6760000000'
export const APP_STORE_URL = APP_STORE_ID ? `https://apps.apple.com/app/id${APP_STORE_ID}` : '';
export const SHOW_LAUNCH_PILL = true;                // released state: “New on the Mac App Store”

export const REPO_PUBLIC = false;
export const REPO_URL = 'https://github.com/brightdigit/TesserClip';

export const SUPPORT_EMAIL = 'support@tesserclip.com';
export const PRESS_EMAIL = SUPPORT_EMAIL;            // D20

export type Analytics = { provider: 'none' } | { provider: 'plausible'; domain: string };
export const ANALYTICS: Analytics = { provider: 'none' };

export const COMPANY_NAME = 'BrightDigit';
export const COMPANY_LEGAL_NAME = 'BrightDigit, LLC';
export const COMPANY_URL = 'https://brightdigit.com';
export const FOUNDER_NAME = 'Leo Dion';
export const COPYRIGHT = '© 2026 BrightDigit. All rights reserved.';
export const SITE_URL = 'https://tesserclip.com';
export const OG_IMAGE_URL = `${SITE_URL}/og.png`;

// App contract: these paths are compiled into the app and must never 404.
export const APP_HELP_PATHS = ['/help', '/help/clipboard-permission'] as const;
```

### Mechanism (non-normative)

Put the guards at the bottom of `config.ts`, so that any page import runs them:

```ts
const isDeploy = process.env.SITE_DEPLOY === '1' || process.env.GITHUB_REF === 'refs/heads/main';
if (RELEASE_STATE === 'beta' && TESTFLIGHT_URL === TESTFLIGHT_PLACEHOLDER) {
  const msg = 'TESTFLIGHT_URL is still the placeholder; set the public TestFlight link in src/config.ts';
  if (isDeploy) throw new Error(msg); else console.warn(`⚠️  ${msg}`);
}
if (RELEASE_STATE === 'released' && !APP_STORE_ID) throw new Error('APP_STORE_ID is required when RELEASE_STATE is "released"');
```

Unit-test the guard logic as a pure function (`checkConfig(config, env)`) using `node --test`, and run it in `make build`. That keeps it testable without building the site.

---

## 5. Theme and design tokens

### Requirements

- Light and dark mode follow `prefers-color-scheme`. There is no toggle.
- **Exception: the home hero stage is dark in both schemes.** So is the press key-art card, which reuses it. Nothing else on the site has a fixed scheme.
- Every colour comes from the tokens below. Don’t use raw hex in components.
- Purple is only for interactive and brand moments. Everything else uses Apple’s neutral greys.
- Type is the system stack only. There are no web fonts.
- Normal text meets WCAG AA contrast (4.5:1) in both modes, and large text and UI meet 3:1. On the hero stage this holds against the brightest point of its glow, not just against black.
- Liquid Glass (a `backdrop-filter` material) is only for the functional layer: the nav and the one callout chip in the window room. Content never sits on glass.

### Tokens

The tokens are copied from the design README. Define them with Tailwind 4 `@theme` in `src/styles/global.css` and redefine them for dark mode.

| Token (`--color-…`) | Tailwind class stem | Light | Dark | Use |
|---|---|---|---|---|
| `brand-accent` | `brand-accent` | `#4A1D7A` | `#9B6BD8` | Links, icons, step numbers |
| `brand-accent-strong` | `brand-accent-strong` | `#4A1D7A` | `#7C4DBF` | Filled buttons (white text ≥ 4.5:1) |
| `brand-deep` | `brand-deep` | `#06030D` | `#06030D` | Dark-mode stage end |
| `brand-bg` | `brand-bg` | `#FFFFFF` | `#0B0A0F` | Page |
| `brand-surface` | `brand-surface` | `#F5F5F7` | `#16141C` | Alternating bands, cards |
| `brand-elevated` | `brand-elevated` | `#FFFFFF` | `#1D1A24` | Icon tiles, step cards, `kbd` |
| `brand-border` | `brand-border` | `#D2D2D7` | `#2E2A37` | Card borders |
| `brand-hairline` | `brand-hairline` | `rgb(0 0 0 / .08)` | `rgb(255 255 255 / .09)` | Nav and footer rules, table rows |
| `brand-text` | `brand-text` | `#1D1D1F` | `#F5F5F7` | Body text |
| `brand-muted` | `brand-muted` | `#6E6E73` | `#A1A1A6` | Secondary text |
| `brand-tint` | `brand-tint` | `#F4EEFA` | `#1C1526` | Eyebrow pill, privacy summary |
| `brand-tint-2` | `brand-tint-2` | `#E8DDF5` | `#2A1D3B` | Pill border, tint hover |
| `--stage-from` / `--stage-to` | (custom property) | `#F6F1FB` → `#DCCBF0` | `#4A1D7A` → `#06030D` | Gradient stage behind screenshots (window room below `md`, help figures) |

**Hero stage and wireframe tokens** (added 2026-11-02, issue #17). The `--hero-*` values are the same in both schemes on purpose: they define the dark stage.

| Custom property | Light | Dark | Use |
|---|---|---|---|
| `--hero-bg` | `#000` | `#000` | Home hero card, press key-art card |
| `--hero-ink` | `#F5F5F7` | `#F5F5F7` | Hero headings (19.3:1 on black) |
| `--hero-ink-2` | `#C9C4D3` | `#C9C4D3` | Hero lead (12.3:1 on black, ≥ 6.3:1 on the brightest glow) |
| `--hero-ink-3` | `#A29CAE` | `#A29CAE` | Line under the hero CTA (7.9:1 on black) |
| `--hero-accent` | `#C9A8FF` | `#C9A8FF` | Hero tagline and pill dot (10.5:1 on black, ≥ 5.4:1 on the glow) |
| `--hero-line` | `rgb(255 255 255 / .16)` | same | Hero pill border |
| `--hero-glow-1` / `--hero-glow-2` | `rgb(130 70 220 / .42)` / `rgb(74 29 122 / .55)` | same | The two radial glows behind the hero art |
| `--wire` | `rgb(74 29 122 / .38)` | `rgb(214 190 255 / .50)` | Window-room and frame lines (decorative) |
| `--wall-from` / `--wall-to` | `rgb(74 29 122 / .10)` → `/ .015` | `rgb(155 107 216 / .22)` → `/ .03` | Window-room and frame wall fills |
| `--room-label` | `#4D4A55` | `#C9C4D3` | Window-room wall labels (≥ 7:1 on the walls) |
| `--privacy-card` | `brand-surface` | `#000` | `PrivacyCard` background |
| `--privacy-art` | `brand-accent` | `#C9A8FF` | Line tesseract in `PrivacyCard` |
| `--glass` / `--glass-border` | `rgb(255 255 255 / .72)` / `rgb(0 0 0 / .10)` | `rgb(29 26 36 / .66)` / `rgb(255 255 255 / .14)` | The window-room callout chip |

```css
/* src/styles/global.css (non-normative shape) */
@import "tailwindcss";
@theme {
  --font-sans: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Helvetica, Arial, sans-serif;
  --color-brand-accent: #4A1D7A;
  /* …all light values… */
}
@media (prefers-color-scheme: dark) {
  :root { --color-brand-accent: #9B6BD8; /* …all dark values… */ }
}
:root { color-scheme: light dark; }
```

### Type scale and layout

Use the design README’s type table and layout grid as written. In short:

- **Containers:** `max-w-5xl px-6` for most sections, `max-w-6xl` for the hero card, `max-w-2xl` for privacy, terms and support text, and about `max-w-[760px]` for help articles.
- **Sections:** `py-16 md:py-24`, alternating `bg-brand-bg` and `bg-brand-surface` bands.
- **Hero card:** name about `text-[46px] lg:text-7xl font-bold tracking-[-0.033em]` beside a 56 / 72 px icon, tagline `text-2xl lg:text-[32px] font-semibold` in `--hero-accent`, lead `text-lg lg:text-[21px]` in `--hero-ink-2`. Two columns at `lg` and up (copy left, a 460 px art column right); below `lg`, one centred column with the art (≤ 260 px) after the CTA.
- **Section titles:** `text-[34px] md:text-5xl font-semibold`.
- **Body:** `text-[17px] md:text-lg`, and `leading-[1.65]` in prose.
- **Breakpoints:** Tailwind defaults. The features grid collapses below `md`, the help sidebar hides below `md`, the window room drops its walls below `md`, and the nav and the hero’s two columns collapse below `lg`.
- **Step numerals:** a plain `text-[44px] font-semibold` numeral in `brand-accent`, with no circle.

---

## 6. Directory layout

```
.agents/                       # real directory; .claude -> .agents
  WEBSITE.md                   # this spec
  designs/                     # mockups (reference only; not served)
  agent-notes.md, memory/
AGENTS.md                      # CLAUDE.md -> AGENTS.md
.github/workflows/deploy.yml, lighthouse.yml
.mise.toml  Makefile  package.json  package-lock.json  astro.config.mjs  tsconfig.json  lighthouserc.json
public/
  CNAME                        # tesserclip.com
  robots.txt                   # allow all + Sitemap: https://tesserclip.com/sitemap-index.xml
  favicon-32x32.png  favicon-dark-32x32.png  apple-touch-icon.png  og.png   # from the real icon exports and the tesseract OG render
  badges/download-on-the-mac-app-store-{black,white}.svg   # Apple artwork, unmodified
  press/icons/  press/key-art/  press/screenshots/           # originals served for download and zipped
  downloads/                   # generated press zip (gitignored)
scripts/
  check-links.js  check-links.allow  generate-press-kit-zip.js
src/
  config.ts  content.config.ts
  assets/icon/AppIcon-macOS-*.png  assets/tesseract/*  assets/screens/*.png   # optimised through astro:assets
  data/shortcuts.ts  data/press.json  data/known-issues.ts
  content/help/index.mdx  content/help/clipboard-permission.mdx
  content/legal/privacy.md  content/legal/terms.md
  components/ …                # §7
  layouts/BaseLayout.astro  layouts/ProseLayout.astro  layouts/HelpLayout.astro
  pages/index.astro  pages/help/index.astro  pages/help/[slug].astro
  pages/privacy.astro  pages/terms.astro  pages/support.astro  pages/press.astro  pages/404.astro
  styles/global.css
```

- **Content collections** (`src/content.config.ts`):
  - `help` holds MDX with `{ title, description, breadcrumb, order, related?: {label, href}[] }`.
  - `legal` holds Markdown with `{ title, description, lastUpdated: date, dateLabel: 'Last updated' | 'Effective' }`.
- **`src/data/shortcuts.ts`** is the single list of shortcut rows, grouped by menu. Both the help shortcuts table and the support “Keyboard shortcuts” link target read it.
- **`src/data/press.json`** holds the descriptions and facts. Both the press page and the zip’s `README.txt` read it, so the two never drift.
- **`src/data/known-issues.ts`** is `{ version: string; items: string[] }`. The support page reads it.
- `.agents/designs/` is reference only. Copy the assets you need into `src/assets/` or `public/`, and never link to `.agents` from a page.

`.gitignore` additions: `dist/`, `.astro/`, `.lighthouseci/`, `public/downloads/`, `node_modules/`, `.DS_Store`, `.env*`.

---

## 7. Components

Each component lives in `src/components/` and is built from the design HTML’s markup and the tokens above. None of them needs client JS.

| Component | From design | Notes |
|---|---|---|
| `BaseHead` | all | Meta, canonical, OG/Twitter, icons, CSP, JSON-LD (§12). Adds an analytics tag only when `ANALYTICS.provider !== 'none'` |
| `Nav` | all | Sticky, 64 px, translucent with `backdrop-blur`. Left: a 30 px icon and “TesserClip” linking to `/`. Right: Help · Press · Privacy · Terms · Support and a `CtaPill`. Below `lg`, the links collapse into a `<details>` ☰ menu next to the pill. The current page’s link gets `aria-current="page"`. It uses the scheme tokens on every page (the hero card starts below it), and it becomes solid `brand-bg` with no blur under reduced transparency or increased contrast (§13) |
| `Footer` | all | Centred: a 48 px icon, `PrimaryCta`, “TesserClip is developed by [BrightDigitLogo]” (links to brightdigit.com), a link row (Help · Press Kit · Privacy Policy · Terms of Use · Support · brightdigit.com) and `COPYRIGHT` |
| `BrightDigitLogo` | footer | The inline SVG copied verbatim from atleast.app or the design HTML. Its accessible name is “BrightDigit” |
| `AppIcon` | all | The real Icon Composer exports (`designs/assets/icons/`): Default in light and Dark in dark, switched by `prefers-color-scheme`. On the hero card it’s always Default. Takes a `size` prop and is served at 2× that size. Decorative where the app name sits next to it (`alt=""`) |
| `PrimaryCta` | hero, footer | Switches on `RELEASE_STATE` (§8). Beta: a `TestFlightButton`. Released: an `AppStoreBadge`. Coming soon: renders nothing |
| `CtaPill` | nav | Beta: “Join Beta” → `TESTFLIGHT_URL`. Released: “Download” → `APP_STORE_URL`. Coming soon: hidden |
| `TestFlightButton` | hero, footer | Two variants. **Hero (dark stage):** a white pill (min 50 px tall) with atleast.app’s TestFlight glyph in TesserClip purple and the one-line label “Join the beta on TestFlight”. **Footer:** outlined on `surface`, with two lines, “Join the beta on” / “TestFlight”. Both open in a new tab with `rel="noopener noreferrer"`, and both have the accessible name “Join the beta on TestFlight” |
| `AppStoreBadge` | released state | Apple’s official Mac App Store badge in a `<picture>`: black in light mode and white in dark mode. **On the dark hero card it’s always the white badge.** Unmodified, at least 40 px tall, alt “Download on the Mac App Store” |
| `EyebrowPill` | hero | A pill with a dot. Copy comes from §8. On the hero card it uses `--hero-line` and `--hero-ink-2`, with a `--hero-accent` dot |
| `TesseractHero` | home | The dark hero card (`max-w-6xl`, `--hero-bg` with the two glows, radius 32 / 28). It holds `EyebrowPill`, the icon and h1 on one row, the tagline, the lead, the hero `TestFlightButton` (or the white `AppStoreBadge`), the line under the CTA, and the **static** tesseract image (`designs/assets/tesseract/tesseract-hero-*.png`) through `astro:assets` with explicit size, `alt=""` and `aria-hidden="true"`. Optionally a faint 56 px grid behind the art, masked to the glow. No animation, annotations or face labels. `color-scheme: dark` on the card |
| `WindowRoom` | home | The editor screenshot as the back face of a projected cube: four SVG wall polygons (`--wall-from/to`, `--wire` edges) at 1080∶740, with the screenshot at 70 % width. Wall labels are real text, `aria-hidden`: New Window from Clipboard ⌘N · Edit ▸ Substitutions · Undo ⌘Z · Find ⌘F · Plain text. No files. One glass callout chip, “Copy All ⇧⌘C”, points at the toolbar button. Below `md` the walls, labels and chip hide, and it falls back to the `Stage` panel |
| `ProjectedFrame` | home safe-edits row | The same projection, shallower (600∶411), around a screenshot: lines and wall tints only, never a 3D tilt |
| `Stage` | help figures, `WindowRoom` below `md` | The gradient panel (`--stage-from` → `--stage-to`) holding a window cutout |
| `TesseractMark` | help, support | A 32 px line tesseract (`designs/assets/tesseract/tesseract-mark.svg`, `currentColor`, `brand-accent`) above the breadcrumbs or h1. Decorative (`aria-hidden`). It never repeats inside content |
| `PrivacyCard` | home, privacy | `PrivacySummary` in a rounded card (`--privacy-card`, hairline border, a purple corner glow in dark) with the line tesseract (`tesseract-line.svg`, `--privacy-art`) on the right. Home: h2, paragraph and art, then the three points across. `/privacy/`: compact, points stacked, 120 px art |
| `IconTile` | features, help, support, privacy | A 44 px `rounded-xl` bordered square holding a 24 px stroke icon in `brand-accent`. Icons are inline SVG components in `src/components/icons/`, copied from the design HTML |
| `FeatureCard` | home | `IconTile`, an h3 and a paragraph. Can include `Kbd` |
| `StepCard` | home | A plain large numeral (§5), title, one sentence and `Kbd` chips. The h3 keeps its visually hidden “Step n:” prefix |
| `Kbd` | everywhere | A `<kbd>` chip with Mac glyphs (⌘ ⇧ ⌥ ⌃ ⎋ ↩ ⇥). Takes `keys="⇧⌘C"`. Its accessible label spells the keys out (“Shift Command C”) |
| `MenuPath` | help, home | Semibold text with ▸ separators, e.g. **Edit ▸ Substitutions** |
| `PathChip` | permission article | A chip showing System Settings ▸ Privacy & Security ▸ Paste from Other Apps |
| `NoteCallout` | help | A surface box with an icon, for tips and “Chose Not Now?” |
| `HowToSteps` | permission article | Big numbered steps joined by a vertical rule, as an `<ol>` |
| `ShortcutTable` | help | Renders `src/data/shortcuts.ts` groups as tables (`<th scope="row">` for the command) |
| `FaqItem` | help, support | A `<details>` card with a +/− marker. The first item on the help page is `open` |
| `TopicCard` | help, support | `IconTile`, a title and a line, linking to a page or anchor |
| `OnThisPage` | help index | A 208 px sticky sidebar `<nav aria-label="On this page">` with anchor links and secondary links. Hidden below `md` |
| `Breadcrumbs` | help pages | `TesserClip › Help › …`, as a `<nav aria-label="Breadcrumb">` with `<ol>` |
| `PrivacySummary` | inside `PrivacyCard` | The three points (Nothing leaves your Mac · No account · No tracking) |
| `CopyCard` | press | A description card. A “Copy” button is progressive enhancement: a small `'self'` script that, without JS, leaves the text selectable and hides the button |
| `ColorSwatch` | press | A swatch, the name and the hex value |
| `Prose` | legal, help | Typographic styles for content-collection output (h2, p, lists, tables, `kbd`, links) |

The design’s yellow “PLACEHOLDER” / “TBD” tags are design-only. **No placeholder tag ships.**

**3D stays out of the content layer.** The tesseract appears only as the static hero image, the window room and projected frame, the privacy card drawing, the `TesseractMark`, the press key art and the 404 drawing. Feature icons are `IconTile` line icons, and steps are numerals.

---

## 8. Release states

### Requirements

`RELEASE_STATE` drives every call to action. The site launches in **`beta`** (D8). `comingSoon` stays supported in code but is never the default.

| Element | `comingSoon` | `beta` (default) | `released` |
|---|---|---|---|
| Hero eyebrow pill | “Coming soon to the Mac App Store” | “Now in beta on TestFlight” | “New on the Mac App Store” while `SHOW_LAUNCH_PILL`, otherwise hidden |
| Hero CTA | none | Hero `TestFlightButton` (white pill, “Join the beta on TestFlight”) | `AppStoreBadge`, white variant |
| Line under the CTA | “Coming soon to the Mac App Store. Requires macOS 27 or later.” | “Coming soon to the Mac App Store. Requires macOS 27 or later.” | “Requires macOS 27 or later.” |
| Nav pill | hidden | “Join Beta” | “Download” |
| Footer CTA | none | `TestFlightButton` (outlined) | `AppStoreBadge` |
| Home facts strip, middle item | “Coming soon to the Mac App Store” | “Coming soon to the Mac App Store” | “Available on the Mac App Store” (links to `APP_STORE_URL`) |
| Support FAQ “How do I join the beta?” | hidden | shown | hidden |
| Support “TestFlight feedback” card | hidden | shown | hidden |
| Press fact sheet “Status” | “Coming soon” | “Beta on TestFlight (`VERSION_LABEL`)” | “Available on the Mac App Store” |
| Press fact sheet “Distribution” | Mac App Store | Mac App Store (TestFlight beta) | Mac App Store |
| JSON-LD `offers` / `downloadUrl` | `offers` from `PRICE` only | `downloadUrl` = `TESTFLIGHT_URL`, `offers` from `PRICE` | `downloadUrl` = `APP_STORE_URL`, `offers` from `PRICE` |

- The Mac App Store badge appears **only** in `released` with an `APP_STORE_ID`. Never show a greyed-out or “coming soon” Apple badge, because that misuses Apple’s artwork.
- Every TestFlight and App Store link opens in a new tab with `rel="noopener noreferrer"`.

Designs: the `01-home-*` renders show beta. There’s no released-state render of the restyle: the released state swaps the elements as this table says (the v1 `v1-original/01b-home-launch.png` shows the swap).

---

## 9. Pages

### Requirements

- **The design HTML’s visible text is the normative copy** for each page. Use it verbatim, including curly quotes, `…`, `▸`, non-breaking hyphens and key glyphs, except where this section lists a change. To read a design’s copy, open its `.html` in a browser or read the markup.
- Every page uses `BaseLayout` (Nav, `<main id="main">`, Footer, plus a skip link “Skip to content”).
- Internal links use trailing-slash paths (`/help/`, `/help/#shortcuts`, `/privacy/`). Mailto links use `SUPPORT_EMAIL` from config.
- Layout, spacing and states match the PNGs at 1440 px and 390 px wide, in light and dark mode. Each page has `NN-name-{1440,390}-{light,dark}.png`.
- The designs’ `tc-…` class names and RENDER-ONLY font block are mockup mechanics, not requirements.

### 9.1 Home

- **URL:** `/` · **Design:** `01-home.html`, with `01-home-1440-*`, `01-home-1440x900-*`, `01-home-1280x800-*` and `01-home-390-*` (light and dark)
- **Title:** `TesserClip: Fix copied text before you paste it`
- **Description:** `Copied text from a browser, a terminal or an AI agent? TesserClip opens straight to it in a plain-text editor, so you can fix it before you paste. For macOS 27.`

| # | Section | Content |
|---|---|---|
| 1 | Hero | `TesseractHero` (dark in both schemes). Copy, in order: pill (§8); the icon (72 px, Default) and h1 “TesserClip” on one row; tagline “Fix copied text before you paste it.”; lead “Copied something from a browser, a terminal or an AI agent? TesserClip opens straight to it in a plain‑text editor. Fix it, copy it, and paste it where it belongs.”; the hero CTA (§8); the line under the CTA (§8). The static tesseract art is on the right at `lg` and up, and under the CTA below `lg` |
| 2 | Window room | `WindowRoom`, straight after the hero with **no heading**, so it shows on the first screen. `01-editor-window.png`, alt text: “A TesserClip window showing copied release notes, ready to edit.” The section is labelled “TesserClip window” (`aria-label`) |
| 2b | Copy sources (bg band, no top padding) | h2 “From the browser, the terminal or an AI agent.”, lead “What you copy is rarely ready to paste. Fix it in TesserClip first, then paste it where it’s going.”, then three `FeatureCard`s: From a web page (`browser`) · From the terminal (`terminal`) · From an AI agent (`agent`) |
| 3 | Features (surface band) | h2 “Made for the moment between copy and paste.” and its lead, then a 3 × 2 grid of six `FeatureCard`s with `IconTile` line icons: Opens to your last copy · Every window is its own draft · A plain‑text editor · Copy All ⇧⌘C · Asks before losing edits · Knows when there’s new text (copy from the design) |
| 4 | Safe edits (bg band) | h2 “Your edits are safe until they’re copied.”, the paragraph, and two icon bullets (Quit with ⌘Q… / Already copied your edits?…). Right side: `04-discard-alert-window.png` in a `ProjectedFrame`, **at least 50 % of the row’s width** at `md` and up (a 4∶8 grid). Alt text: “The “Discard your edits?” sheet, with Cancel and Discard buttons.” |
| 5 | How it works (surface band) | h2 “How it works”, lead “No more pasting into TextEdit just to fix a typo.”, and four `StepCard`s with numerals: Copy (⌘C, “Copy text in a browser, a terminal, an AI chat or any other app.”) · Open TesserClip (⌘Tab) · Fix it (⌘Z ⌘F) · Copy it back (⇧⌘C ⌘V) |
| 6 | Privacy (bg band) | `PrivacyCard`: h2 “Your text stays on your Mac.”, the paragraph, the line tesseract, and the three `PrivacySummary` points. “No tracking” links “Privacy Policy ›” to `/privacy/` |
| 7 | Facts strip | Requires macOS 27 or later · (§8 middle item) · “Read the TesserClip Help ›” → `/help/` |
| 8 | Footer | Shared |

**Fold targets** (measured in the designs, see §16):
- At 1280×800, the hero CTA’s bottom edge is at or above 700 px.
- At 1440×900, the top edge of the window-room screenshot is inside the viewport.
- At 390×844, the hero CTA is fully visible.

Changes from the design: none, beyond wiring the CTAs to config.

Changes from v1 (2026-11-02, issue #17): the 120 px centred icon became the 72 px icon beside the h1; the hero is a dark card with the static tesseract; the stage became the window room and moved directly under the hero; the step circles became numerals; the safe-edits screenshot is larger; the privacy section is the `PrivacyCard`. The copy is unchanged.

Changes from the design (2026-11-03): the copy leans into where text comes from (browsers, terminals and AI agents). That means the hero lead, the meta description, step 1, the new copy-sources section (row 2b) and the press long description. The design PNGs predate this, so this section is new compared with them.

### 9.2 Help index

- **URL:** `/help` (served as `/help/`). The app’s Help ▸ TesserClip Help (⌘?) opens it. · **Design:** `04-help.html`, `04-help-{1440,390}-{light,dark}.png`
- **Look:** a reading page, not marketing. The header (`TesseractMark`, breadcrumbs, h1, lead) sits on a slim full-bleed `brand-tint` band. No dark stage and no 3D.
- **Title:** `TesserClip Help` · **Description:** `How TesserClip works: getting started, windows and drafts, the editor, keyboard shortcuts and clipboard permission.`
- **Source:** `src/content/help/index.mdx`. The full content contract is in [§10](#10-help-content).

### 9.3 Clipboard permission article

- **URL:** `/help/clipboard-permission` (served as `/help/clipboard-permission/`). The ? button in the app’s permission window opens it. · **Design:** `05-help-clipboard-permission.html`, `05-help-clipboard-permission-{1440,390}-{light,dark}.png`
- **Look:** like the help index, with the `TesseractMark` above the breadcrumbs and no band.
- **Title:** `Clipboard permission – TesserClip Help` · **Description:** `Allow TesserClip to read the clipboard in System Settings ▸ Privacy & Security, and what TesserClip reads.`
- **Source:** `src/content/help/clipboard-permission.mdx`. See [§10](#10-help-content).

### 9.4 Privacy Policy

- **URL:** `/privacy` · **Design:** `06-privacy.html`, `06-privacy-{1440,390}-{light,dark}.png` · **Source:** `src/content/legal/privacy.md`, `lastUpdated: 2026-10-31`, `dateLabel: 'Last updated'`
- **Title:** `Privacy Policy – TesserClip` · **Description:** `TesserClip keeps your text on your Mac. No account, no analytics and no tracking in the app, and no cookies on this website.`
- **Sections, in order:**
  - The compact `PrivacyCard`: the `PrivacySummary` (three points) with the line tesseract
  - What TesserClip reads (clipboard text when it opens a window, whether there’s new text, which app you copied from)
  - What TesserClip stores
  - What TesserClip sends
  - Apple
  - This website
  - Changes
  - Contact

Changes from the design:

1. **This website (D7)** now reads: “tesserclip.com is a static website hosted on GitHub Pages. It doesn’t use cookies, run analytics or ask for personal information.”
2. “Clipboard permission” links to `/help/clipboard-permission/`. Apple’s Privacy Policy links to `https://www.apple.com/legal/privacy/`.

Facts behind this page, checked in the app repo on 2026-10-31:

- Drafts persist in the app container, and closing a window removes its draft (`AppModel.windowWillClose` → `DraftStore.remove`).
- The app has no networking, analytics or third-party SDK code.

Re-check both before changing the claims.

### 9.5 Support

- **URL:** `/support` · **Design:** `07-support.html`, `07-support-{1440,390}-{light,dark}.png` · **Source:** `src/pages/support.astro` + `src/data/known-issues.ts`
- **Title:** `Support – TesserClip` · **Description:** `Get help with TesserClip: help articles, common questions, known issues and how to contact BrightDigit.`
- **Sections:**
  - `TesseractMark`, then h1 “Support” with the lead “Find an answer in the help, or get in touch. We read every message.” No other art; the email button stays the one purple element
  - Three `TopicCard`s: TesserClip Help → `/help/`, Clipboard permission → `/help/clipboard-permission/`, Keyboard shortcuts → `/help/#shortcuts`
  - `#common` Common questions: four `FaqItem`s from the design, with “How do I join the beta?” only in beta
  - `#known` “Known issues in 1.0 beta 1” (the heading reads `VERSION_LABEL`), listing the three items from the design. Hide the section when `items` is empty.
  - `#contact` Contact us: an Email card (`mailto:` `SUPPORT_EMAIL`, “Write to us”), a TestFlight feedback card (beta only), and the “Help us help you…” note

Changes from the design:

1. **Remove the GitHub Issues card** while `REPO_PUBLIC` is `false` (D12/D18). Support is email only, so the contact grid has two cards in beta and one when released.
2. The TestFlight feedback card’s “How to send” links to `https://testflight.apple.com/` (see [Open questions](#18-open-questions)).
3. The FAQ links “allow clipboard access” → `/help/clipboard-permission/` and “Privacy Policy” → `/privacy/`.

The known issues come from app `CHANGELOG.md` 1.0.0-beta.1 (#41–#43), rewritten in user words. #35 (help links pointing at an unlaunched site) is left out, because this site fixes it. Update the list with each beta.

### 9.6 Terms of Use

- **URL:** `/terms` · **Design:** `08-terms.html`, `08-terms-{1440,390}-{light,dark}.png` (plain prose, no art) · **Source:** `src/content/legal/terms.md`, `lastUpdated: 2026-10-31`, `dateLabel: 'Effective'`
- **Title:** `Terms of Use – TesserClip` · **Description:** `The Terms of Use for TesserClip, the Mac app from BrightDigit, LLC.`
- **Sections (D15/D19):** Agreement · License · Restrictions · Beta software · Your content · Intellectual property · No warranty · Limitation of liability · App Store terms · Changes and termination · Governing law · Contact
- The entity is “BrightDigit, LLC”. The governing law is the United States and the State of Michigan. There is **no** personal, non-commercial limit.
- “App Store terms” links Apple’s Licensed Application End User License Agreement to `https://www.apple.com/legal/internet-services/itunes/dev/stdeula/`.
- Leo reviews the legal wording in the PR. Changes from the design: none, beyond the link.

### 9.7 Press Kit

- **URL:** `/press` · **Design:** `09-press.html`, `09-press-{1440,390}-{light,dark}.png` · **Source:** `src/pages/press.astro` + `src/data/press.json`. Details are in [§11](#11-press-kit).
- **Title:** `Press Kit – TesserClip` · **Description:** `TesserClip press kit: app description, icon, screenshots, fact sheet, brand colours and contact.`

### 9.8 404

- **URL:** any unknown path, served by GitHub Pages from `dist/404.html` · **Design:** `10-404.html`, `10-404-{1440,390}-{light,dark}.png`
- **Title:** `Page not found – TesserClip` · `<meta name="robots" content="noindex">` · It is left out of the sitemap.
- **Art:** the static line tesseract with an empty (dashed) inner cell (`tesseract-line-empty.svg`, 132 px, `brand-accent`, `aria-hidden`) in place of v1’s clipboard glyph.
- **Copy:** an eyebrow “404”, h1 “This page doesn’t contain text”, the body “We couldn’t find the page you’re looking for. It may have moved, or the link may be wrong.”, and two buttons: “Go to the home page” → `/` and “Browse Help” → `/help/`.
- All asset and link URLs on this page are root-absolute, because it’s served at arbitrary depths.

---

## 10. Help content

### Requirements

- **App contract (D10).** `/help` and `/help/clipboard-permission` must exist in every build and must never move. The link check fails if either is missing from `dist/`.
- **Stable anchors on `/help/`:** `#getting-started`, `#windows`, `#editor`, `#shortcuts`, `#permission`, `#faq`. Other pages and future app builds may link to them. Don’t rename them.
- The content must stay faithful to the app SPEC. Never describe features the SPEC lists as out of scope (clipboard history, auto-paste, global hotkey, menu bar mode, Markdown, saving files, font settings, Services “Edit in TesserClip”).
- Every shortcut is a `Kbd` chip. Menu paths use `MenuPath` with ▸.
- Help is English only, and v1 has no search (D25).

### 10.1 `/help/` content contract

Layout: `HelpLayout` with `Breadcrumbs` (TesserClip › Help), h1 “TesserClip Help”, the lead, and three `TopicCard`s (Getting started → `#getting-started`, Keyboard shortcuts → `#shortcuts`, Clipboard permission → `/help/clipboard-permission/`). On `md` and up, the `OnThisPage` sidebar lists the six anchors plus “Clipboard permission article” and “Contact support”.

| Anchor | h2 | Content (verbatim from `04-help.html`) | Source in app SPEC |
|---|---|---|---|
| `getting-started` | Getting started | A 5-step ordered list (copy → open with launch/Dock/⌘Tab → edit → Copy All / ⇧⌘C or ⌘C → ⌘Tab or ⌘H, then ⌘V), then a NoteCallout about permission linking “Allow TesserClip to read the clipboard ›” | §2 |
| `windows` | Windows and drafts | The intro, the 3-row “When you… / TesserClip…” table, and h3s Window titles · When there’s new text to open · Closing and quitting | §3, §5 |
| `editor` | The editor | 4 bullets (plain text; substitutions off and how to turn them on; spelling; usual Mac text tools), then the empty-clipboard paragraph | §4 |
| `shortcuts` | Keyboard shortcuts | `ShortcutTable` with three groups (below) | §7 |
| `permission` | Clipboard permission | The summary paragraph and a link to `/help/clipboard-permission/` | §5 Permission |
| `faq` | Questions | 6 `FaqItem`s (below), then the “Still need help?” card (email + Support) | §11, §4, §5 |

**Shortcut data** (`src/data/shortcuts.ts`). These come from app SPEC §7 plus the standard shortcuts its QA list relies on:

| Group | Command | Keys |
|---|---|---|
| File and Edit | New Window from Clipboard | ⌘N |
| | Close | ⌘W |
| | Undo | ⌘Z |
| | Redo | ⇧⌘Z |
| | Cut | ⌘X |
| | Copy | ⌘C |
| | **Copy All** | ⇧⌘C |
| | Paste | ⌘V |
| | Paste and Match Style | ⌥⇧⌘V |
| | Select All | ⌘A |
| Find | Find | ⌘F |
| | Find Next | ⌘G |
| | Find Previous | ⇧⌘G |
| App and windows | Hide TesserClip | ⌘H |
| | Hide Others | ⌥⌘H |
| | Quit TesserClip | ⌘Q |
| | Minimize | ⌘M |
| | Cycle through windows | ⌘` |
| | TesserClip Help | ⌘? |

The app has **no** Settings window. Don’t list ⌘, (Command-comma).

**FAQ** (questions verbatim; answers verbatim from the design):

1. Why is my new window empty? (open by default)
2. I copied something new. Why didn’t my window change?
3. Does TesserClip keep a clipboard history?
4. Can TesserClip paste into the other app for me?
5. How do I save text to a file?
6. Why aren’t my quotes turning curly?

### 10.2 `/help/clipboard-permission/` content contract

Layout: `HelpLayout` (single column, about 760 px), `Breadcrumbs` (TesserClip › Help › Clipboard permission), h1 “Allow TesserClip to read the clipboard”, then a lead that **matches the app’s permission window body word for word**: “TesserClip opens with whatever you last copied, ready to edit. macOS asks before an app reads the clipboard on its own, so allow TesserClip once in Privacy & Security.” Next comes a figure of `06-permission-window.png` with the caption “TesserClip shows this window the first time it opens, if it needs your permission.”

Sections:

1. **Why macOS asks**: two paragraphs (the clipboard can hold private things; pasting with ⌘V never asks).
2. **Allow TesserClip**: a `HowToSteps` list of four steps.
   1. Open Privacy & Security. Mention Help ▸ Clipboard Permission… to reopen the window.
   2. Find TesserClip, with the `PathChip` “System Settings ▸ Privacy & Security ▸ Paste from Other Apps”.
   3. Allow it (“Next to TesserClip, choose Allow.”).
   4. Open your text: File ▸ New Window (⌘N).

   Then a `NoteCallout` “Chose Not Now? …”.
3. **What TesserClip reads**: three bullets, the last linking to `/privacy/`.
4. **Turn it off**: one paragraph.
5. **Related**: Getting started → `/help/#getting-started` · Why is my new window empty? → `/help/#faq` · Contact support → `/support/`.

The pane name and the “Allow” label aren’t verified on macOS 27 (see [Open questions](#18-open-questions)). Keep them in one place in the MDX so a fix is a single edit.

---

## 11. Press kit

### Requirements

- `/press` sections, in order:
  - A dark key-art card (the `TesseractHero` stage, dark in both schemes) with h1 “Press Kit”, its lead, a white-pill “Download Press Kit (.zip)” button → `/downloads/tesserclip-press-kit.zip`, and the static tesseract art on the right
  - App description: Short and Long `CopyCard`s
  - App icon: six tiles, one per Icon Composer export (Default, Dark, Clear light, Clear dark, Tinted light, Tinted dark), each labelled “1024 · PNG” and linking to its file under `/press/icons/`. The v1 “Final artwork will be exported…” note is gone
  - Key art: the 2400 × 1260 tesseract render as a downloadable tile (alt: “A glowing glass tesseract, a cube inside a cube, with the TesserClip icon’s glass sheets in its inner cell, on black.”), and **The name**: “TesserClip is tesser + clip. A tesseract is a four‑dimensional cube, drawn as a cube inside a cube. The key art builds one from the glass sheets of the app icon, with the clipboard in the middle.” This is the only place the site explains the name
  - Screenshots: four tiles with captions
  - Fact sheet `<dl>`
  - Brand colors: three `ColorSwatch`es
  - About the developer
  - Contact
- **Contact (D20)** reads: “For press questions, review copies or interviews, email support@tesserclip.com.” There is no `press@` address.
- The fact sheet rows are App name · Developer · Platform (macOS) · Minimum OS (macOS 27) · Status (§8) · Category (Productivity) · Distribution (§8) · Website (tesserclip.com). There is **no price row**.
- **The zip is generated at build time** (prebuild) and never committed. It contains:
  - `README.txt`, rendered from `src/data/press.json`: the facts, both descriptions, icon usage guidelines, the contact and the press page URL
  - `icons/`: the six Icon Composer exports at 1024, plus 512 renders of Default and Dark
  - `key-art/`: `tesseract-key-art-2400x1260.png`
  - `screenshots/`: the four screenshot PNGs
- Every image tile links to the original file under `/press/…` so it can be downloaded.
- The icons are the real Icon Composer exports (2026-11-02). The screenshots are still the app mockup PNGs until the maintainer assets issue replaces them (D13). Remove the design’s “Placeholder” / “Zip TBD” tags.
- About the developer: copy it verbatim from the design. EmpowerApps.show links to `https://empowerapps.show`.

### Mechanism (non-normative)

Adapt atleast.app’s `scripts/generate-press-kit-zip.js`:

- Write `public/downloads/tesserclip-press-kit.zip`, and read the facts from `src/data/press.json`.
- Render the PNG icons with `sharp` into `public/press/icons/`. Commit the renders so dev builds don’t depend on sharp; the script only re-renders when they’re missing.
- Exclude favicons and the OG image.

---

## 12. SEO

### Requirements

- Every page has a unique `<title>` and meta description from §9, `<html lang="en">`, and a canonical URL (`new URL(Astro.url.pathname, Astro.site)`) using the trailing-slash form.
- **Open Graph and Twitter:** `og:title`, `og:description`, `og:type=website`, `og:url`, `og:site_name=TesserClip`, `og:image=OG_IMAGE_URL` (1200×630, `og:image:alt` “TesserClip: Fix copied text before you paste it”). The image is `designs/assets/tesseract/og-image-1200x630.png`: the tesseract render on black with the icon, name and tagline. Re-export it on a Mac from its source so the wordmark is SF Pro and `twitter:card=summary_large_image`.
- **Icons:** made from the real Icon Composer exports. `favicon-32x32.png` from Default, `favicon-dark-32x32.png` from Dark (linked with `media="(prefers-color-scheme: dark)"`), and `apple-touch-icon.png` (180) from Default. The placeholder `favicon.svg` is retired.
- **Sitemap:** `@astrojs/sitemap` writes `sitemap-index.xml` without the 404 page. `robots.txt` allows everything and lists the sitemap.
- **JSON-LD:**
  - An `Organization` (BrightDigit, `COMPANY_URL`, logo, `contactPoint` email `SUPPORT_EMAIL`) on every page, as on atleast.app.
  - A `SoftwareApplication` on `/` with `name`, `description`, `operatingSystem: "macOS 27 or later"`, `applicationCategory: "UtilitiesApplication"`, `author`/`publisher` BrightDigit, `url`, `image` `downloadUrl` (§8) and `offers` (`{ '@type': 'Offer', price: PRICE, priceCurrency: PRICE_CURRENCY }`). `PRICE` is `'0'` (free) in config; set it to `''` to leave `offers` out. Google needs `offers` (or ratings) before it shows the software-app rich result.
  - A `BreadcrumbList` on both help pages.
- No `apple-itunes-app` Smart App Banner meta: Safari on macOS doesn’t show it for Mac apps.
- **CSP** (a meta tag, since GitHub Pages can’t set headers): `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'`. Add `https://plausible.io` to `script-src` and `connect-src` only when Plausible is on.

---

## 13. Accessibility

### Requirements

- **WCAG 2.2 AA.** The contrast pairs in §5 pass in both modes. Lighthouse accessibility scores at least 0.95 on every page.
- **Landmarks:** a skip link, `header`/`nav`/`main`/`footer`, one `h1` per page, and no skipped heading levels.
- **Keyboard:** every control can be reached and used with Tab, Shift-Tab, Return and Space, including the `<details>` nav menu and FAQs. Focus is always visible (a 2 px `brand-accent` outline with offset), and the focus order follows the visual order.
- **Images:**
  - Screenshots have descriptive alt text (§9). The home editor screenshot is never `alt=""`.
  - Decorative icons use `aria-hidden="true"` or `alt=""`.
  - Apple’s badge alt is “Download on the Mac App Store”.
  - The TestFlight button’s accessible name is “Join the beta on TestFlight”.
- **`Kbd`** gives screen readers a spelled-out label (“Shift Command C”).
- **Links:** external links that open a new tab say so to assistive tech (visually hidden “(opens in a new tab)”). Link text never reads only “click here”.
- **Reduced motion:** with `prefers-reduced-motion: reduce`, turn off all transitions and animations, including hover fades and `<details>` marker rotation. The site has no autoplaying media.
- **No hero motion.** The tesseract is a static image in every mode. No spin, no scroll-driven or hover 3D, and no animated decoration anywhere.
- **Decorative 3D and line art is hidden:** the hero and press art, the window-room walls and labels, the projected frames, `TesseractMark`, the privacy card drawing and the 404 drawing are `aria-hidden="true"` or `alt=""`. The h1 carries the meaning. The press key-art tile is the exception: it’s a download, so it has descriptive alt text.
- **Reduced transparency:** with `prefers-reduced-transparency: reduce`, every `backdrop-filter` surface (the nav and the window-room chip) becomes solid (`brand-bg` and `brand-elevated`).
- **Increased contrast:** with `prefers-contrast: more`:
  - The nav and chip become solid.
  - Card and chip borders become 1 px `brand-text`.
  - Wireframe lines and wall labels use `brand-text`.
  - Screenshots and the privacy card get a 1 px `brand-text` outline.
  - On the hero card, the lead, tagline, pill and requirement line go to white, and the card gets a 1 px white border.
- **Gradient or glow text:** text is never drawn with `background-clip: text`. The hero tagline is a solid colour.
- **Zoom:** content reflows at 320 px and 200 % zoom without horizontal scrolling. Tables in help scroll inside their own container if they must.
- **Colour** is never the only signal. The current nav page also gets `aria-current` and a weight change.

---

## 14. Performance

### Requirements

- **Lighthouse CI** (`lighthouserc.json`, copied from atleast.app) scores at least these on every page, in 3 runs:
  - performance 0.9
  - accessibility 0.95
  - SEO 0.9
  - best practices 0.9
- PWA audits are off, as in the reference.
- **Budgets:**
  - No render-blocking third-party requests.
  - JS shipped to any page is at most 5 KB (zero is the target).
  - CSS is at most 30 KB gzipped.
  - The hero tesseract image and the window-room screenshot are served as WebP or AVIF with explicit `width`/`height`. `fetchpriority="high"` goes on the window-room screenshot only (the h1 is the expected LCP element). The hero art loads eagerly, and everything else uses `loading="lazy"`.
  - The hero art is one image, not a live CSS 3D rig.
- Screenshots go through `astro:assets` (`<Picture>`) with responsive `widths`, so layout shift stays at 0.

### `lighthouserc.json` (non-normative)

```json
{
  "ci": {
    "collect": {
      "staticDistDir": "./dist",
      "numberOfRuns": 3,
      "url": ["/", "/help/", "/help/clipboard-permission/", "/privacy/", "/support/", "/terms/", "/press/", "/404.html"]
    },
    "assert": { "assertions": {
      "categories:performance": ["error", {"minScore": 0.9}],
      "categories:accessibility": ["error", {"minScore": 0.95}],
      "categories:seo": ["error", {"minScore": 0.9}],
      "categories:best-practices": ["error", {"minScore": 0.9}],
      "csp-xss": "off", "installable-manifest": "off", "maskable-icon": "off", "splash-screen": "off",
      "themed-omnibox": "off", "service-worker": "off", "apple-touch-icon": "off"
    }},
    "upload": { "target": "temporary-public-storage" }
  }
}
```

The 404 page’s SEO score is exempt, because it’s `noindex` on purpose. Assert it with a `assertMatrix` entry or exclude it from SEO.

---

## 15. CI and deploy

### Requirements

- **Workflows (D5):** only `deploy.yml` and `lighthouse.yml`, copied from atleast.app. There are **no** `claude.yml` or `claude-code-review.yml` workflows.
- **`deploy.yml`:**
  - On `pull_request` (any base branch, so stacked PRs get CI), it runs `npm ci`, `npm run build` and `npm run check:links`.
  - On `push` to `main` and `workflow_dispatch`, it builds with `SITE_DEPLOY=1`, so the guards are fatal (§4), runs the link check, uploads `dist/` with `actions/upload-pages-artifact`, and deploys with `actions/deploy-pages`.
  - Its permissions are `contents: read, pages: write, id-token: write`, with concurrency group `pages`.
- **`lighthouse.yml`:** runs on `pull_request` only (any base), and uploads `.lighthouseci/` as an artifact.
- Per the BrightDigit rule that CI runs on `pull_request`, not `push`, the only push trigger is the `main` deploy.
- **Node** comes from `actions/setup-node` with `node-version: '24'` and `cache: 'npm'`.
- **`public/CNAME`** contains `tesserclip.com` (D6).
- **Link check:** `scripts/check-links.js`, adapted from atleast.app. It fails the build when any of these is true:
  1. An internal `href`/`src` has no file in `dist/`.
  2. An internal link’s `#fragment` has no matching `id` on its target page.
  3. Any path in `APP_HELP_PATHS` (plus `/privacy`, `/support`, `/terms`, `/press`, `/404.html` and `/downloads/tesserclip-press-kit.zip`) is missing.

  `scripts/check-links.allow` holds temporary exceptions, but never for a required path.
- **Go-live (maintainer, D6):**
  - Leo makes the repo public.
  - Leo enables Pages with **GitHub Actions** as the source and sets the custom domain `tesserclip.com` with HTTPS enforced.
  - DNS: apex A records `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (plus AAAA `2606:50c0:8000::153`, `…8001::153`, `…8002::153`, `…8003::153`), and `www` CNAME → `brightdigit.github.io`.
  - Leo fills in `TESTFLIGHT_URL` and merges `v0.26.1101` into `main`.
  - Confirm `support@tesserclip.com` receives mail.
  - Set the App Store Connect Privacy, Support and Marketing URLs.

### Branching (D3)

`v0.26.1101` is the integration branch. Each issue gets a branch `<issue#>-<slug>` and a PR. The scaffold PR targets `v0.26.1101`. Wave 1 PRs target the scaffold branch (they’re stacked), and later waves target their parent. Agents open PRs and **never merge** them. `main` gets `v0.26.1101` at go-live.

---

## 16. QA checklist

Run this before each PR. Wave 2 runs all of it across the site. Put the results and screenshots in the PR.

- [ ] `make install && make build` succeeds, and `make check-links` passes.
- [ ] `SITE_DEPLOY=1 make build` **fails** while `TESTFLIGHT_URL` is the placeholder in beta, and passes once a real URL is set.
- [ ] Setting `RELEASE_STATE = 'released'` with an empty `APP_STORE_ID` fails the build.
- [ ] `dist/help/index.html` and `dist/help/clipboard-permission/index.html` exist. In `make preview`, `/help` and `/help/clipboard-permission` load (a redirect to the trailing slash is fine, a 404 isn’t).
- [ ] Every anchor in §10.1 exists on `/help/`.
- [ ] Playwright screenshots of each page at 1440 and 390 wide, in light and dark mode, are compared side by side with the design PNGs. Differences are listed in the PR.
- [ ] **Fold, measured in Chromium** (`getBoundingClientRect`, report the numbers in the PR). In the designs, with Inter standing in for SF Pro, they measured 535 / 803 / 493 px:
  - At 1280×800, the hero CTA’s bottom edge is ≤ 700 px.
  - At 1440×900, the window-room screenshot’s top edge is < 900 px.
  - At 390×844, the hero CTA’s bottom edge is < 844 px.
- [ ] The hero card is dark in both schemes, and every other section follows the scheme.
- [ ] Nothing animates in the hero, with Reduce Motion on or off.
- [ ] With `prefers-reduced-transparency: reduce` and with `prefers-contrast: more` (Chromium: CDP `Emulation.setEmulatedMedia`; Playwright `contrast: 'more'`), the nav and chip have no `backdrop-filter`, and the §13 contrast fallbacks apply.
- [ ] No request loads a font file (`grep -r "@font-face" dist/` finds nothing).
- [ ] Each of the three `RELEASE_STATE` values renders the §8 table correctly. In released, the hero shows the white App Store badge in both schemes.
- [ ] `grep -ri plausible dist/` finds nothing, and no request leaves the origin (check the DevTools network panel).
- [ ] No GitHub or Issues links appear anywhere while `REPO_PUBLIC` is `false`.
- [ ] No `press@` appears anywhere, and every email is `support@tesserclip.com`.
- [ ] No “PLACEHOLDER” or “TBD” text appears in `dist/` (except `TESTFLIGHT_PLACEHOLDER` in dev builds).
- [ ] The copy uses curly quotes and apostrophes, `…`, `▸` and Mac key glyphs. No straight quotes appear in visible text.
- [ ] Every claim matches the app SPEC. None of the deferred features (§10) is mentioned as available.
- [ ] Keyboard only: you can tab through the nav (including the collapsed menu at 390 px), every link and every FAQ, and focus is always visible.
- [ ] VoiceOver in Safari: landmarks, headings, `Kbd` labels and the badge and button names are announced correctly.
- [ ] With Reduce Motion on, nothing animates.
- [ ] At 320 px and 200 % zoom, nothing scrolls horizontally (`document.documentElement.scrollWidth === 320` on every page, in both schemes).
- [ ] Lighthouse CI passes the §14 thresholds.
- [ ] The press zip downloads and contains `README.txt`, `icons/` and `screenshots/`. Its README facts match the page.
- [ ] OG and Twitter tags validate (check them in an OG preview tool after deploy).
- [ ] An unknown path shows the 404 page with working styles and links at depth (`/a/b/c`).

---

## 17. Non-goals

These are out of scope for v1 (D14, D25, D7):

- SEO article collections, a blog, guides or comparison pages
- Localisation (the site is English only)
- Help search (no Pagefind)
- Analytics. The switch exists but stays off.
- Any backend, forms, newsletter or email capture
- A theme toggle (the site follows the system)
- A release notes or changelog page, an appcast or downloads (Stewed-only features)
- A launch banner. It’s available as a pattern from month.bar, but not built until Leo asks.
- Video and animated hero media

---

## 18. Open questions

These are carried over from the design README and haven’t been resolved yet. The items decisions.md resolved are listed at the end for traceability.

1. **Screenshots.** Can real screenshots be captured from a beta build, in light and dark mode, with the purple accent and the window subtitle? The interim mockups show blue buttons and no subtitle, and dark mode currently shows light-mode screenshots. *(Tracked in the maintainer assets issue.)*
2. **System Settings wording.** Confirm the pane name “Paste from Other Apps” and the per-app control label “Allow” on macOS 27 for the clipboard-permission article.
3. **Help anchors as pages.** Should any of `/help/#getting-started`, `#windows`, `#editor`, `#shortcuts`, `#permission` or `#faq` become separate pages? If they do, the anchors must keep working (leave a short section that links on).
4. **TestFlight feedback link.** Where should Support’s “How to send” point? The interim target is `https://testflight.apple.com/`.
5. **JSON-LD category.** `UtilitiesApplication` is the closest schema.org value to App Store “Productivity”. Change it if Leo prefers another.
6. **Placeholder guard in dev builds.** This spec makes the D28 guard fatal only for production and deploy builds, so PR CI can run before the link exists. Confirm that’s acceptable.
7. **Price.** Settled 2026-11-03: JSON-LD `offers` has price `0` USD (`PRICE` in config). The visible site and the press fact sheet still state no price. Update `PRICE` if the App Store price changes.

Resolved by decisions.md (2026-10-31):

- TestFlight link: a placeholder in config with a build guard. The maintainer fills it in (D17/D28).
- Analytics: none for now, behind a switch (D7).
- GitHub Issues: hidden behind `REPO_PUBLIC`, so support is email only (D12/D18).
- Emails: `support@tesserclip.com`. Press reuses it (D11/D20).
- Icon export: the maintainer assets issue (D13).
- Terms: a custom Terms of Use page, BrightDigit, LLC, Michigan law, plus a reference to Apple’s standard EULA (D15/D19).
- Press kit: ships now, with the zip generated at build time (D14).
