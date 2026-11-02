# tesserclip.com design mockups: Tesseract

The current designs for the TesserClip site. They’re the round-2 **A1 Tesseract** direction with every change in the independent review applied (`design-explorations` branch, `.agents/designs/explorations/round-2/REVIEW.md`). Leo approved it on 2026-11-02 (issue #17). The v1 mockups they replace are archived in [`v1-original/`](v1-original/README.md).

**In one line:** a static dark hero card with the tesseract on the right, then the product straight away, and everything below the hero is the calm, flat, system-scheme site the spec already describes.

## How these files were made

- Each page is one standalone HTML file with no external requests. It was generated from the **7-qa build** (`dist/`), so the visible text is the current built copy in the **beta** state. The file inlines the built Tailwind CSS, then a `#tesseract-restyle` style block with the new tokens and components (`tc-…` classes), then a RENDER-ONLY font block.
- **RENDER-ONLY font block.** The Linux renderer has no SF Pro, so `<style id="render-only-font">` puts Inter into the stack for the PNGs. It’s marked in every file. It isn’t part of the design: the site ships the system stack only, with no web fonts.
- PNGs are Playwright (Chromium) renders with `reducedMotion: 'reduce'`: 1440 wide at 1×, and 390 wide at 2×, full page. The home page also has above-the-fold renders at 1440×900 and 1280×800.
- The `tc-…` class names and the markup are a reference, not an API. Build the components named in `WEBSITE.md` §7 with Tailwind.

## Screens

Every row has a `-light.png` and a `-dark.png`.

| File | URL path | Renders |
|---|---|---|
| `01-home.html` | `/` | `01-home-1440-*` (full page), `01-home-1440x900-*` and `01-home-1280x800-*` (first screen), `01-home-390-*` |
| `04-help.html` | `/help/` | `04-help-1440-*`, `04-help-390-*` |
| `05-help-clipboard-permission.html` | `/help/clipboard-permission/` | `05-help-clipboard-permission-1440-*`, `-390-*` |
| `06-privacy.html` | `/privacy/` | `06-privacy-1440-*`, `-390-*` |
| `07-support.html` | `/support/` | `07-support-1440-*`, `-390-*` |
| `08-terms.html` | `/terms/` | `08-terms-1440-*`, `-390-*` |
| `09-press.html` | `/press/` | `09-press-1440-*`, `-390-*` |
| `10-404.html` | `/404.html` | `10-404-1440-*`, `-390-*` |

There’s no new released-state mockup. The released state swaps the CTAs exactly as `WEBSITE.md` §8 says. Note that on the dark hero card the Mac App Store badge is always the **white** variant, whatever the scheme.

### Measured (Chromium, Inter stand-in)

| Check | Target (REVIEW.md) | Measured |
|---|---|---|
| Hero CTA bottom at 1280×800 | ≤ ~700 px | **535 px** (the same at 1440×900 and 1366×768) |
| Window room top / screenshot top at 1440×900 | Screenshot top visible | Room **694 px**, screenshot **803 px** |
| Window room top at 1280×800 | Peeks above the fold | **694 px** (the screenshot starts at 803, just below) |
| Hero CTA bottom at 390×844 | Visible | **493 px** |
| Safe-edits screenshot width | ≥ 50 % of the row | **51 %** at 1440 (77 % at 390) |
| `scrollWidth` at 320 px, every page, both schemes | 320 | **320**, no overflow |

SF Pro sets slightly tighter than Inter, so on a Mac these numbers can only go down.

## Assets

| Path | What |
|---|---|
| `assets/icons/AppIcon-macOS-{Default,Dark,ClearLight,ClearDark,TintedLight,TintedDark}-1024@1x.png` | The real Icon Composer exports. They replace the placeholder `app-icon.svg` / `app-icon-dark.svg` (kept only for `v1-original/`) |
| `assets/icons/icon-{default,dark}-{128,256}.png` | Downsizes for the mockups’ nav, footer and hero |
| `assets/tesseract/tesseract-hero-{600,1200}.{png,webp}` | **The hero art.** The resting frame of A1’s tesseract (outer glass cube, inner cell with the icon’s three sheets, eight struts, floor glow), exported once as a static, transparent image. Shown at 460 px (≥ `lg`) or 240 px (below) |
| `assets/tesseract/og-image-1200x630.png` | The OG/Twitter image: the hero art on black with the icon, name, tagline and URL |
| `assets/tesseract/tesseract-key-art-2400x1260.png` | Press key art: the hero art alone on the black stage |
| `assets/tesseract/tesseract-line.svg` | The 2D line tesseract (oblique projection, inner cell filled). Privacy card. `currentColor` |
| `assets/tesseract/tesseract-line-empty.svg` | The same with an empty, dashed inner cell. 404 |
| `assets/tesseract/tesseract-mark.svg` | The 32 px mark: non-scaling 1.5 px strokes. Help and support headers |
| `assets/tesseract/source/*.html` | Sources for the renders. Re-export the OG image on a Mac (delete its RENDER-ONLY block) so its wordmark is SF Pro |
| `assets/screens/*.png` | Unchanged app mockup screenshots (open question 1 in the spec) |
| `assets/badges/*.svg` | Unchanged Apple badge artwork |

## Palette and tokens

**The §5 tokens are unchanged** and still drive every section below the hero, in both schemes: `brand-accent`, `brand-accent-strong`, `brand-bg`, `brand-surface`, `brand-elevated`, `brand-border`, `brand-hairline`, `brand-text`, `brand-muted`, `brand-tint`, `brand-tint-2`, `--stage-from/to`. A1’s band and card colours were already the dark tokens (`#0B0A0F` / `#16141C`), so they map straight on.

The restyle adds these:

| Token | Light | Dark | Use |
|---|---|---|---|
| `--hero-bg` | `#000` | `#000` | Hero and press key-art card. **The same in both schemes** |
| `--hero-ink` | `#F5F5F7` | same | Hero h1 (19.3:1 on black) |
| `--hero-ink-2` | `#C9C4D3` | same | Hero lead (12.3:1 on black, ≥ 6.3:1 on the brightest glow) |
| `--hero-ink-3` | `#A29CAE` | same | Line under the CTA (7.9:1 on black) |
| `--hero-accent` | `#C9A8FF` | same | Tagline, pill dot (10.5:1 on black, 5.4:1 on the brightest glow) |
| `--hero-line` | `rgb(255 255 255 / .16)` | same | Pill border |
| `--hero-glow-1` / `-2` | `rgb(130 70 220 / .42)` / `rgb(74 29 122 / .55)` | same | The two radial glows behind the art |
| `--wire` | `rgb(74 29 122 / .38)` | `rgb(214 190 255 / .50)` | Room and frame lines (decorative) |
| `--wall-from` / `--wall-to` | `rgb(74 29 122 / .10)` → `/ .015` | `rgb(155 107 216 / .22)` → `/ .03` | Room and frame wall fills |
| `--room-label` | `#4D4A55` | `#C9C4D3` | Wall labels (8.7:1 on white, 7.3:1 on the light wall tint, 11.6:1 on the dark page) |
| `--privacy-card` | `brand-surface` | `#000` | Privacy card background |
| `--privacy-art` | `brand-accent` | `#C9A8FF` | Line tesseract in the privacy card |
| `--glass` / `--glass-border` | `rgb(255 255 255 / .72)` / `rgb(0 0 0 / .10)` | `rgb(29 26 36 / .66)` / `rgb(255 255 255 / .14)` | The one glass chip (“Copy All ⇧⌘C”) |

**The hero exception.** The home hero card and the press key-art card are always dark, in both schemes (`color-scheme: dark` on the card). In light mode the card sits on the white page as a rounded black panel. In dark mode it bleeds into the near-black page with a 6 % white hairline. Nothing else on the site has a fixed scheme.

Purple is still only for interactive and brand moments. The hero glow and the wireframes are brand moments.

## Type

The system stack only. Nothing new to download.

| Role | Desktop (≥ `lg`) | Below `lg` |
|---|---|---|
| Hero h1 | 72 / 1.02, bold, −0.033em, beside a 72 px icon | 46, beside a 56 px icon |
| Hero tagline | 32 / 1.2, semibold, `--hero-accent` | 24 |
| Hero lead | 21 / 1.5, `--hero-ink-2`, max 540 px | 18 |
| Hero CTA | 17 semibold, white pill, min 50 px tall | same |
| Press h1 (key-art card) | 64 | 46 |
| Step numeral | 44 / 1, semibold, `brand-accent`, tabular | same |
| Privacy card h2 | 44 | 30 |
| Everything else | As in the v1 type table (`v1-original/README.md`) and the built site | |

## Layout

- **Hero card:** `max-w-6xl` (1152), 24 px from the nav and the page edges (16 below `md`), radius 32 (28 below `lg`).
  - ≥ `lg`: two columns, copy left and a 460 px art column right. Padding 48 / 40 / 48 / 72.
  - Below `lg`: one centred column, copy first, then the art at 240 px.
- **Window room:** directly under the hero, in `max-w-5xl`, with 40–48 px above it and no heading.
  - ≥ `md`: the room is a 1080∶740 projected cube with the screenshot at 70 % width as its back face.
  - Below `md`: the walls and labels hide, and it falls back to the v1 stage (gradient panel, window cropped on the right and bottom).
- Then features (surface band), safe edits (bg), how it works (surface), privacy (bg, with the card), the facts strip and the footer. Sections keep `py-16 md:py-24`.
- **Safe edits** uses a 4∶8 grid so the framed screenshot is at least half the row.

## Components

New or changed (spec §7 has the requirements):

- **`TesseractHero`.** The dark hero card. Its parts:
  - the pill (§8 copy) on a dark tint;
  - the icon and h1 on one row, then the tagline and lead;
  - the `TestFlightButton` hero variant: a **white pill** with the TestFlight glyph in TesserClip purple and the one-line label “Join the beta on TestFlight”;
  - the line under the CTA;
  - on the right, the **static** tesseract image, decorative (`alt=""`, `aria-hidden`);
  - a faint 56 px grid behind the art, masked to the glow.

  There are no annotations, labels or animation.
- **`WindowRoom`.** The flat editor screenshot as the back face of a projected cube. The four walls are SVG polygons with hairline edges, and they carry real-text labels:
  - top: New Window from Clipboard ⌘N
  - right: Edit ▸ Substitutions
  - bottom: Undo ⌘Z · Find ⌘F
  - left: Plain text. No files.

  The labels restate existing copy and are `aria-hidden`. The screenshot carries the §9.1 alt text. One glass chip, “Copy All ⇧⌘C”, points at the toolbar button. It’s the only Liquid Glass below the hero (functional-layer callout, HIG Materials).
- **`ProjectedFrame`.** The same projection, shallower, around the Discard alert screenshot (lines and wall tints only, no tilt).
- **`StepCard`.** A plain 44 px numeral replaces the numbered circle. The cards, copy and `Kbd` chips are unchanged.
- **`PrivacyCard`.** The `PrivacySummary` points in a rounded card with the line tesseract on the right. It’s `brand-surface` in light and black (with a purple corner glow) in dark.
  - Home: h2, paragraph and art on the first row, then the three points across.
  - `/privacy/`: a compact version with the points stacked and a 120 px drawing.
- **`TesseractMark`.** A 32 px line tesseract in `brand-accent`, above the breadcrumbs on both help pages and above the h1 on Support. It’s decorative and never repeats inside content.
- **Help index header** sits on a slim full-bleed `brand-tint` band.
- **Press:** the top section is a dark key-art card (h1, lead, a white-pill “Download Press Kit (.zip)”, and the art at 380 px). The App icon section shows all six exports. A new **Key art** section has the 2400×1260 download and a short **The name** note: the only place the tesser + clip idea is explained.
- **404:** the line tesseract with an empty, dashed inner cell (132 px) replaces the clipboard glyph.
- **Unchanged:** Nav (but with the real icons, and solid under reduced transparency or increased contrast), Footer, `FeatureCard` and `IconTile` (the features keep their line icons), `Kbd`, FAQ, `TopicCard`, `NoteCallout`, `HowToSteps`, `ShortcutTable`, `CopyCard`, `ColorSwatch`, `Prose`, facts strip.
- **`AppIcon`** now uses the real exports: Default in light and Dark in dark (a `<picture>` with a `prefers-color-scheme` source). On the hero card it’s always Default.

## Accessibility built into the mockups

- **No motion:** the hero is a still image. There are no animations or transitions anywhere under `prefers-reduced-motion`.
- **`prefers-reduced-transparency: reduce`:** the nav becomes solid `brand-bg` and the glass chip becomes solid `brand-elevated`, with no `backdrop-filter`.
- **`prefers-contrast: more`:**
  - The same solid nav and chip.
  - The hero text goes to white, and the card gets a 1 px white border.
  - Card borders, wire lines and wall labels use `brand-text`.
  - Screenshots and the privacy card get a 1 px `brand-text` outline.
- **Alt text:**
  - The editor screenshot: “A TesserClip window showing copied release notes, ready to edit.”
  - The alert: “The “Discard your edits?” sheet, with Cancel and Discard buttons.”
  - The key art has a descriptive alt.
  - The hero art, wireframes, marks and wall labels are decorative and hidden.

## Deviations from REVIEW.md

- **The optional footer exploded-icon image** isn’t drawn. It’s optional, and the footer stays the spec footer.
- **“Copy. Fix. Paste.”** (A1’s footer line) isn’t used. It isn’t in the spec copy.
- **“How it works ›”**, the ghost button beside A1’s CTA, is dropped to keep the hero to the §8 elements.
- **The right wall** reads “Edit ▸ Substitutions” instead of A1’s “Copy All ⇧⌘C”, because the glass chip already says Copy All.
- **The hero art format.** It’s exported as PNG and WebP. AVIF is left to `astro:assets`, which generates it from the PNG at build time.
- **The help-index tint band** is drawn (REVIEW.md marks it optional).
