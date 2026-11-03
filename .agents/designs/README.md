# tesserclip.com design mockups

Static mockups for the TesserClip marketing and help site. Each screen is one standalone HTML file with inline CSS and no external requests, plus a PNG rendered with Playwright (Chromium). Local images live in `assets/`. The production build will be **Astro + Tailwind on GitHub Pages**, like month.bar and atleast.app, so the tokens and spacing below map straight onto Tailwind.

## Screens

| File | URL path | Notes |
|---|---|---|
| `01-home.html` / `01-home.png` | `/` | Desktop, 1440 wide, full page, light, **beta state** |
| `02-home-dark.png` | `/` | Same page with `colorScheme: 'dark'` |
| `03-home-mobile.png` | `/` | 390 wide (rendered @2x), light |
| `01b-home-launch.html` / `.png` | `/` | Extra: the same page in its **launch state** (Mac App Store badge in place of TestFlight) |
| `04-help.html` / `.png` | `/help` | Help index. Opened by Help ▸ TesserClip Help (⌘?) in the app |
| `05-help-clipboard-permission.html` / `.png` | `/help/clipboard-permission` | Opened by the permission window’s ? button |
| `06-privacy.html` / `.png` | `/privacy` | App Store Connect Privacy Policy URL |
| `07-support.html` / `.png` | `/support` | App Store Connect Support URL |
| `08-terms.html` / `.png` | `/terms` | Terms of Use (added to match the reference sites) |
| `09-press.html` / `.png` | `/press` | Press kit (added to match the reference sites) |
| `10-404.html` / `.png` | `/404` | Not found |

### Assets

- `assets/app-icon.svg`: a **placeholder** made by flattening `TesserClip/Resources/AppIcon.icon` (its `icon.json` plus the six SVG layers) into a macOS rounded-rect tile. Each layer uses its intrinsic SVG size and the icon.json translation, opacity and group order, with drop shadows standing in for Liquid Glass. The file carries both appearances through `prefers-color-scheme`: light uses an automatic gradient around #4A1D7A, and dark runs #4A1D7A → #06030D. Replace it with a real Icon Composer export.
- `assets/app-icon-dark.svg`: the same placeholder fixed to the dark appearance, for the press kit.
- `assets/badges/download-on-the-mac-app-store-{black,white}.svg`: **Apple’s official badge artwork**, copied from month.bar. Black is used in light mode and white in dark mode, as on month.bar.
- `assets/screens/*.png`: copies of the app mockups from `TesserClip/.claude/designs/`. The `*-window.png` files are transparent cutouts of just the window, re-rendered from the mockups’ HTML at 2×, so they can sit on the purple stage.

## Beta-state treatment

The site has **two CTA modes**, which copy atleast.app’s `PRIMARY_CTA` switch (`'testflight' | 'appstore'`) in `src/config.ts`.

- **Beta (now):** an eyebrow pill reads “Now in beta on TestFlight”. The hero CTA is a filled purple **“Join the beta on TestFlight”** button using the TestFlight glyph, which is atleast’s AppStoreBadge beta variant in TesserClip purple. A line under it says “Coming soon to the Mac App Store. Requires macOS 27 or later.” The nav CTA is a “Join Beta” pill, and the footer repeats the TestFlight button. No App Store badge appears, because a greyed-out official badge would misuse Apple’s artwork.
- **Launch:** shown in `01b-home-launch.png`. The pill reads “New on the Mac App Store”, Apple’s badge replaces the TestFlight button in the hero, nav and footer, and the line becomes “Requires macOS 27 or later.” The month.bar-style `LaunchBanner` is available for launch week if wanted.

## Design decisions

### Palette (CSS custom properties; Tailwind v4 `@theme` names)

| Token | Light | Dark | Source / use |
|---|---|---|---|
| `--color-brand-accent` | **#4A1D7A** | **#9B6BD8** | icon.json base `extended-srgb .2902,.1137,.4784`; dark is AccentColor.colorset’s lightened purple. Links, icons, step numbers |
| `--color-brand-accent-strong` | #4A1D7A | #7C4DBF | Filled buttons. The dark value keeps white text above 4.5:1 |
| `--color-brand-deep` | #06030D | | icon.json dark gradient stop. Dark-mode stage gradient |
| `--color-brand-bg` | #FFFFFF | #0B0A0F | Page. Dark is near-black with a hint of the icon’s purple |
| `--color-brand-surface` | #F5F5F7 | #16141C | Alternating sections, cards |
| `--color-brand-elevated` | #FFFFFF | #1D1A24 | Icon tiles, step cards, kbd |
| `--color-brand-border` | #D2D2D7 | #2E2A37 | Card borders |
| `--color-brand-hairline` | rgba(0,0,0,.08) | rgba(255,255,255,.09) | Nav and footer rules, table rows |
| `--color-brand-text` | #1D1D1F | #F5F5F7 | Apple grays, as on month.bar |
| `--color-brand-muted` | #6E6E73 | #A1A1A6 | Secondary text |
| `--color-brand-tint` / `-tint-2` | #F4EEFA / #E8DDF5 | #1C1526 / #2A1D3B | Eyebrow pill, privacy summary |
| `--stage` | #F6F1FB → #DCCBF0 | #4A1D7A → #06030D | The gradient “stage” behind screenshots, echoing the icon |

Purple is reserved for interactive and brand moments. Everything else uses Apple’s neutral grays, so the screenshots carry the colour.

### Type

System stack: `-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", …`. There are no web fonts.

| Role | Desktop | Mobile | Tailwind |
|---|---|---|---|
| Hero name | 72 / 1.02, bold, −0.03em | 48 | `text-7xl` / `text-5xl` |
| Hero tagline | 32 / 1.2, semibold | 24 | `text-[32px]` / `text-2xl` |
| Section and page title | 48 / 1.08, semibold | 34 | `text-5xl` / `text-[34px]` |
| Split-row title | 40 | 30 | `text-[40px]` / `text-3xl` |
| Help section (h2) | 30 | 30 | `text-3xl` |
| Prose h2 | 28 | 28 | `text-[28px]` |
| Lead | 21 / 1.5, muted | 18 | `text-[21px]` / `text-lg` |
| Feature title (h3) | 20 | 20 | `text-xl` |
| Body | 18 / 1.6 (prose 1.65) | 17 | `text-lg` |
| Small body, cards | 15–17 | | `text-[15px]` / `text-base` |
| Caption, nav, footer | 14 | | `text-sm` |

Keyboard shortcuts are always `<kbd>` chips with Mac glyphs (⌘ ⇧ ⌥). Menu paths use semibold `▸` paths, and copy uses curly quotes and `…`.

### Layout grid

- Containers: `max-w-5xl` (1024) with `px-6` for most sections, as on atleast.app. `max-w-6xl` (1152) for the hero stage. `max-w-2xl` (672) for privacy, terms and support text, and about 720–760 for help articles.
- Sections: `py-24` (96) on desktop and `py-16` (64) on mobile, alternating `bg` and `surface` bands. Everything sits on the 4 px Tailwind spacing scale.
- Home features: a 3-column grid with 56 × 48 gaps, collapsing to 1 column below `md` (768).
- Help index: a 208 px sticky “On this page” sidebar plus a 720 px article, with a 64 px gap. The sidebar hides below `md`.
- The nav collapses to “Join Beta” plus a ☰ disclosure below `lg` (1024), as on atleast.app.

### Components

- **Nav:** sticky, 64 px, translucent with a backdrop blur. App icon (30 px) and name on the left; Help · Press · Privacy · Terms · Support and a CTA pill on the right.
- **Footer:** centred stack of the app icon (48), the CTA, “TesserClip is developed by [BrightDigit logo]” linking to brightdigit.com, the link row (Help · Press Kit · Privacy Policy · Terms of Use · Support · brightdigit.com), and “© 2026 BrightDigit. All rights reserved.”
- **Icon tile:** 44 px rounded-xl bordered square holding a 24 pt SF Symbols-style stroke icon in the accent colour. Used for features, help section headings, support cards and privacy points.
- **Stage:** the purple gradient panel with a window cutout. The hero crops the window at the bottom, and one callout labels Copy All (⇧⌘C).
- **Step card:** numbered circle, title, one sentence and the kbd chips.
- **FAQ:** `<details>` cards with a +/− marker. They need no JS, which suits the reference sites’ `script-src 'self'` CSP.
- **Note callout:** a surface box with an icon, for tips and “Chose Not Now?”.
- **How-to list:** big numbered steps joined by a vertical rule, plus a “path chip” showing System Settings ▸ Privacy & Security ▸ Paste from Other Apps.
- **Press:** copyable description cards, an icon gallery, a screenshot grid, a fact-sheet `<dl>`, brand swatches and a contact block.
- **Placeholder tag:** a yellow “PLACEHOLDER” / “TBD” label on anything that still needs real content. Remove it in the build.

## Reference patterns reused

From **atleast.app**:
- The Nav: fixed translucent bar, the `lg` collapse into a `<details>` menu, and the “Join Beta” pill.
- The Footer: centred icon, the CTA, “is developed by” plus `BrightDigitLogo` (its SVG is inlined here verbatim), the link row and the © line.
- The `PRIMARY_CTA` beta/App Store switch and the TestFlight button design, glyph included.
- The `StepCard` and `SectionHeading` icon tiles.
- The support page’s topic cards, `<details>` FAQ and “Still have questions?” card.
- The `max-w-5xl` / `max-w-2xl` widths and `py-24` rhythm.

From **month.bar**:
- Apple’s official Mac App Store badge SVGs, black and white, switched by colour scheme.
- The centred hero: icon, name, subtitle, description, badge, screenshot.
- The page set: index, privacy, support, terms, press, 404.
- The press-kit structure: download zip, Key features/App description, App icons, Screenshots, Fact sheet, Brand colors, About the Developer, Contact.
- The terms text structure. It’s adapted, with a Beta software section added.
- The Apple-gray text palette.

The difference: TesserClip uses its own icon purple instead of atleast’s dark-only palette or month.bar’s Apple blue, and supports both light and dark mode, as atleast doesn’t.

## Assumptions

- **The app mockups are reused as-is.** They predate two later decisions: the window subtitle (source app · date) and the purple accent. They show blue buttons and no subtitle. `02-new-text` is superseded, because the subtitle indicator moved to a dot on the button, so it isn’t used anywhere.
- “Paste from Other Apps” is the pane name from `.claude/memory/pasteboard-privacy-settings-url.md`. The memory confirms the URL but not the pane visually. The per-app choice is written as **Allow**, which is unverified.
- **Privacy:** closing *any* window removes its draft, and the app has no network code, analytics or third-party SDKs. Both follow from the SPEC; neither is confirmed in code. The Apple paragraph covers opt-in crash and analytics sharing and TestFlight feedback generically.
- **The website collects nothing.** The privacy page says tesserclip.com uses no cookies and asks for no personal information. Both reference sites run **Plausible**, so if tesserclip.com adds it, that paragraph must change (see Open questions).
- **Terms:** the legal entity is “BrightDigit, LLC” and the governing law is the United States and Michigan, both copied from month.bar. I removed month.bar’s “personal, non-commercial use” limit, because it’s an odd fit for a text editor.
- **Press facts:** the category is “Productivity”. The bio is shortened from month.bar’s. There’s no price row, because the brief says not to state one.
- **Support known issues** are rewritten from CHANGELOG #41–#43 in user-facing words. #35 (the help site not being live) is left out, since this site fixes it.
- Shortcuts come from SPEC §7, plus the standard ones the QA list relies on: ⌘G / ⇧⌘G, ⌘M and ⌘`.

## Open questions for Leo

1. **TestFlight public link:** is there one, or will testers be invited by email? Every “Join Beta” CTA currently points to `#testflight-url`.
2. **Website analytics:** add Plausible like month.bar and atleast.app, or stay analytics-free? This decides the “This website” paragraph in the privacy policy.
3. **GitHub Issues:** will `brightdigit/TesserClip` be public, or should Support offer email only? The card is tagged “Repo TBD”.
4. **Email addresses:** are `support@tesserclip.com` and `press@tesserclip.com` real yet?
5. **Screenshots:** can we capture real ones from a beta build, in light and dark, with the purple accent and the window subtitle? The website’s dark mode currently shows light-mode app screenshots.
6. **Icon export:** please export the final icon from Icon Composer (1024 PNG for Default, Dark, Clear and Tinted) for the hero, favicon, OG image and press kit.
7. **System Settings wording:** confirm the pane name and the per-app control label on macOS 27 for the clipboard-permission article.
8. **Terms:** confirm the legal entity name and governing law, and whether a custom Terms page is wanted at all, rather than Apple’s standard EULA alone.
9. **Press kit zip:** what goes in it, and should the press page wait until launch?
10. **Help links in the app:** the anchors used here are `/help#getting-started`, `#windows`, `#editor`, `#shortcuts`, `#permission` and `#faq`. Should any of them become separate pages?
