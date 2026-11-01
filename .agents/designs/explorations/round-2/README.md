# Home page explorations, round 2: purple glass in 3D/4D

Leo’s feedback on round 1: “I like A [Purple glass] but I was thinking more plays on 3D/4D aspect,” with Apple’s current designs, especially the developer pages, as the inspiration. These are three takes on A pushed into real depth. TesserClip is Tesser + Clip, and *tesseract* is the 4D hypercube. The icon is glass sheets stacked in depth over purple, with a clipboard tab.

**These are mockups only.** Nothing here changes `WEBSITE.md`, the Astro code or any PR. Each page is one standalone HTML file with inline CSS and no JavaScript. Fonts and images are local, and there are no external requests. The PNGs were rendered with Playwright (Chromium, `chromium.launch()` with no options): 1440 wide at 1×, and 390 wide at 2×, both full page. Animations are disabled for the full-page shots, so each one shows the designed resting frame.

The copy is the round 1 copy, in the beta state:
- “Join the beta on TestFlight” and “Coming soon to the Mac App Store. Requires macOS 27 or later.”
- The same six features, the four “How it works” steps, the safe-edits row and the privacy points.
- No clipboard history, auto-paste or hotkey.

Small display-only labels were added. Each one is decoration or a restatement of existing copy. See the per-variation notes.

## Files

| File | What |
|---|---|
| `A1-tesseract-home.html` · `.png` · `-mobile.png` | A1 Tesseract. Dark, after WWDC26 and the developer.apple.com hero |
| `A1-tesseract-hero-still-spin.png` | Extra: the hero mid-rotation (`rotateY(-78deg)` instead of the resting −34°) |
| `A2-depth-stack-home.html` · `.png` · `-mobile.png` | A2 Depth stack. The icon exploded along Z, in round 1’s purple |
| `A3-unfold-home.html` · `.png` · `-mobile.png` | A3 Unfold. A glass case unfolds into the page. Light, after developer.apple.com/design |
| `A3-unfold-hero-still-fold-078.png` | Extra: the hero mid-animation, at `--fold: 0.78` instead of the resting 0.30 |

Shared assets come from round 1 and aren’t copied:
- `../assets/icons/icon-default-384.png` (the real Icon Composer Default export, downsized);
- `../assets/fonts/` (Bricolage Grotesque and IBM Plex Mono, with their OFL licences);
- `../../assets/screens/01-editor-window.png` and `04-discard-alert-window.png`.

The TestFlight glyph, the BrightDigit logo and the line icons are inlined from round 1’s A.

---

## Apple references studied (2026-11-01)

The pages were fetched live with Playwright through the session proxy. The screenshots are in the scratch directory and aren’t committed. No Apple asset, logo or trademark is used in the mockups.

| Page | What I saw | What I took |
|---|---|---|
| **developer.apple.com** | A pure-black hero card holding one glowing glass object (a sparkle), lit from inside with a cool rim light. White pill buttons on black. Below it, light `#f5f5f7` bands with a tile grid (iOS 27, macOS 27…), then a full-bleed purple-to-magenta gradient band for the Developer Program. | A1’s whole hero: one luminous glass object on true black with a soft floor glow, a white pill CTA, and a ghost secondary pill. |
| **developer.apple.com/xcode** | A product page: centred icon, name, one paragraph, then a big screenshot. Each section has a small grey **eyebrow label** (“Coding intelligence”, “Preview”, “Device Hub”) over a semibold 40–48 px title, a short paragraph and a big screenshot. Alternating white and grey bands, and a lot of air. | The eyebrow-over-title rhythm in A1 (`01 · the window`) and A3 (`unfolded`, `closing`, `four frames`). A2’s centred icon-name-paragraph-CTA-screenshot hero order. |
| **developer.apple.com/design** | A light lavender-grey hero full of Liquid Glass shapes: clear lenses over colour bars, rims that refract into rainbow edges, and thin construction circles and lines behind everything. The headline is centred, semibold, about 32 px. | A3’s palette (`#EEEBF3`), its iridescent conic-gradient rims (`--rim`), and the construction circles and guide line behind the hero. |
| **HIG ▸ Materials** (Liquid Glass) | “Liquid Glass forms a distinct functional layer for controls and navigation… Don’t use Liquid Glass in the content layer.” “Use Liquid Glass effects sparingly.” The *regular* variant blurs and adjusts luminosity for legibility. The *clear* variant is for components over rich media, and over bright content you add a dark dimming layer of about 35%. Respect Reduce Transparency and Increase Contrast. | A rule for every variation: **glass only on the functional layer** (nav, buttons, callouts, kbd). Content cards use a quieter “standard material” (a tinted frost, `.mat` in A2). In A2, the callouts that sit over the white window sheets get a dark dimming layer (`.lg.dim`). A2 also honours `prefers-reduced-transparency`. |
| **developer.apple.com/wwdc** (WWDC26) | Dark presentation. A `#000` hero with a glowing glass logo, a big white wordmark and a white pill CTA. Then a `#1d1d1f` band with black, 24-ish px radius cards, a lot of white semibold type, and blue links. | A1’s band system: black and a purple-tinted `#0C0A11` (my version of `#1d1d1f`), black rounded cards (the privacy card), and all-white semibold type. |
| **apple.com/macos** | **Not reachable.** The proxy refused the tunnel (`ERR_TUNNEL_CONNECTION_FAILED`), so I didn’t use it. | Nothing taken from it directly. |

Type, measured on developer.apple.com: `"SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial` with tight negative tracking. Headlines are semibold or bold, not black.

---

## A1 Tesseract

**Idea:** the hero is a literal tesseract built from the icon’s glass. It’s the classic cube-in-a-cube projection:
- an outer glass cube;
- an inner, brighter cube;
- 8 glowing struts joining their 16 vertices;
- the icon’s three glass sheets (one carries the clipboard tab and text lines) stacked in depth inside the inner cell.

It floats on pure black over a purple glow and a faint masked grid, with two mono annotations (“x · y · z / three dimensions”, “w · one more / tesser + clip”).

Below the hero, every section sits on a face of the projection:
- **The window** is the inner face of a projected cube (a Schlegel diagram). Four gradient trapezoid walls carry its shortcuts: New Window from Clipboard ⌘N, Copy All ⇧⌘C, Undo ⌘Z · Find ⌘F, and plain text / no files.
- **Features** are “six faces”. Each card’s icon is a wireframe cube with that card’s face filled (face 1/6 … 6/6).
- **Safe edits:** the alert screenshot sits in a smaller projected-cube frame.
- **How it works** climbs one dimension per step: a line (1D), a square (2D), a cube (3D), a tesseract (4D).
- **Privacy** is a WWDC-style black card with a 2D tesseract drawing.

The palette is black, `#0C0A11` bands, `#15121C` cards, lilac `#C9A8FF` accents and Apple whites. It’s the most “developer” of the three: precise, technical and quiet.

- **Technique:** pure CSS 3D. `.tess` is a `preserve-3d` rig at `rotateX(-22deg) rotateY(-34deg)` under `perspective: 1300px`. Each cube is six `.face` divs (`rotateY/rotateX(...) translateZ(170px)`). The inner cube is the same structure under `scale3d(.46,.46,.46)`. Each strut is a line div set on a space diagonal with `rotateY(±45/±135deg) rotateZ(±35.26deg) translateX(135.4px)` (35.26° = asin(1/√3); 135.4 px = 0.46 × 170√3). The section frames and the step and feature glyphs are static SVG, generated at build time from the same oblique cube projection.
- **Motion:** the tesseract turns once every 48 s (`@keyframes tess-spin`, Y axis only). It’s off under `prefers-reduced-motion`. A true 4D rotation, where the inner and outer cells swap, would need JS or per-vertex animation. I left it out, because the slow 3D turn already reads as “hypercube”.
- **New display lines:** “One clipboard. As many windows as you need.” is the features heading. “Made for the moment between copy and paste.” moved to section 01. The wall labels restate existing copy.

## A2 Depth stack

**Idea:** round 1’s A, exploded along Z. This is the closest to what Leo already liked:
- the same Bricolage Grotesque display face and purple;
- the white TestFlight pill;
- the page now has a depth axis.

The hero is the icon pulled apart:
- the real editor window is the front sheet;
- behind it, three frosted glass windows recede up and to the right, each 150 px further back (“Re: Thursday”, “Fix sync after sleep”, “Standup notes”);
- the purple icon plate, with its clipboard tab, is the backmost layer.

A dimmed Liquid Glass callout says “Every window is its own draft. Each window keeps the text it opened with.” Another says “Copy All ⇧⌘C”.

The rest of the page:
- **Features** are six frosted planes on a gently tilted table (`rotateX(10deg)`). Alternate cards float at different `translateZ` and lean in.
- **Safe edits** shows the editor window with the Discard alert lifted forward on Z.
- **How it works** is four planes receding into the page.
- **Privacy** has its three points as Liquid Glass slabs stepping toward you.
- **Footer:** an exploded 3D build of the icon (base plate plus three sheets) over “Copy. Fix. Paste.”

- **Technique:** CSS 3D. The stack is one `preserve-3d` rig (`rotateX(6deg) rotateY(-20deg)`, `perspective: 2200px`). Its sheets use `translate3d(70n px, -52n px, -150n px)`, so they fan like the icon. The glass is layered gradients, a 1 px light rim, an inset top highlight and a diagonal sheen (`::after`), not `backdrop-filter`. Liquid Glass (`.lg`) is used only on the nav pill, the eyebrow, callouts and the privacy slabs: `backdrop-filter: blur(18px) saturate(170%)`, a specular radial `::before` and inset edge highlights. Content uses the quieter `.mat` material.
- **Motion:** the back three sheets breathe further apart and back over 10 s (`breathe-1..3`), so the depth reads as depth. It’s off under `prefers-reduced-motion`. With `prefers-reduced-transparency`, `.lg` and `.mat` turn into solid `#2A1146`.
- **The drafts aren’t history.** The sheets behind are drawn as *other open TesserClip windows*, each with its own title bar and different copied text, and the callout uses the feature copy. They must never be captioned as earlier versions, or as a clipboard history. The app has neither.

## A3 Unfold (my pick)

**Idea:** a hypercube is best understood by **unfolding** it: Dalí’s cross is the net of a tesseract. Here the icon’s glass sheets form a cuboid case with the editor window lying inside. The page tells that one object’s fold in frozen frames:
- **Hero:** the case half open (`--fold: 0.30`) on a construction-circle stage, with “--fold 0.30” and “the window inside” tags. The flaps carry the feature glyphs, and the lid is the icon’s front sheet (tab plus three lines).
- **Strip:** five frozen frames, from 1.00 copied, 0.75 open, 0.50 unfold and 0.25 edit to 0.00 flat.
- **Features:** the flat net itself. The six features are the six faces of a cross-shaped net, with dashed fold lines, a glue tab, and the heading and lead set in the net’s empty corners. Face 3 (A plain‑text editor) is the centre.
- **Safe edits:** the window in a glass tray (fold 0.62), with the Discard alert floating above.
- **How it works:** each step card shows the case at a different fold.
- **Privacy:** the case is closed (“Your text stays on your Mac.”).

It’s light, after Apple’s Design page: lavender-grey, white cards, deep purple type, and iridescent rims on every glass pane.

- **Technique:** one CSS custom property drives the whole object. `.box` is a cuboid net:
  - a base (the screenshot);
  - top, bottom, left and right flaps, each hinged on its real edge with `transform-origin` and `rotateX/rotateY(calc(var(--f) * ±90deg))`;
  - a lid hinged off the bottom flap.

  `--f: 0` is flat and `--f: 1` is closed, so every frame on the page is the same markup with a different `--f`. The camera is `rotateX(50deg) rotateZ(-26deg)` (a table-top view) under `perspective: 1600px`. `@property --f { syntax: "<number>" }` makes the fold animatable in pure CSS.
- **Motion:** the hero case folds closed, opens flat and closes again over 14 s (`@keyframes unfold`). It’s off under `prefers-reduced-motion`. A natural production extra is a scroll-driven version (`animation-timeline: view()`), so the case unfolds as the page scrolls. That’s still CSS-only, and it must also stop under reduced motion. Browsers without `@property` (all current ones have it) would just show the static fold.
- **New display labels:** the fold values, “the window inside”, “net · 6 faces”, “6 faces · 1 window”, and the kickers. None of them describes a feature.

---

## Browser support and performance

| | A1 | A2 | A3 |
|---|---|---|---|
| `transform-style: preserve-3d` | Hero tesseract (16 faces, 8 struts, 3 sheets) | Hero stack, feature grid, steps, privacy slabs, icon | Every box (7 elements each × 12 boxes) |
| `backdrop-filter` | Nav only (1) | Nav, eyebrow, 2 callouts, 3 privacy slabs (7) | Nav only (1) |
| Animation | `transform` only (compositor) | `transform` only (compositor) | `--f` via `@property`: recalculates the transforms of one box per frame |
| `@property` | — | — | Required for the animation, not the static render |

- `preserve-3d`, `perspective` and `@property` work in current Safari, Chrome and Firefox. Safari has supported `@property` since 16.4. The macOS 27 audience is all on current Safari.
- **Never put `backdrop-filter`, `filter`, `opacity < 1` with children, or `overflow: hidden` on an element that must keep its 3D children in 3D.** All of these force flattening, and Safari and Chromium differ on which flatten. The 3D faces here are gradient fills, not blurred glass, for exactly this reason. Leaf elements, like the screenshot pane in A3, can still clip.
- Chromium rasterises text on 3D-transformed planes as a bitmap, so it softens slightly. A2’s tilted feature planes show this. Keep tilts under about 12° on planes that carry body text, or make those planes flat on mobile (all three do).
- Expected cost:
  - **A1** is the cheapest of the 3D ones. One small 3D object animates, and the rest is flat.
  - **A2** costs the most: seven backdrop-filters plus the large 3D hero. That’s fine on Apple silicon, but expect TBT/INP to land somewhere in Lighthouse’s throttled runs.
  - **A3** has many small 3D boxes, but only the hero animates. Its frames are static.
- LCP:
  - **A1:** the wordmark. It uses the system font, so nothing to preload.
  - **A2:** the 132 px Bricolage wordmark. Preload the font.
  - **A3:** the wordmark or the hero icon.
  - None of the 3D heroes is the LCP element, since they’re made of divs, not one image.
- Mobile: every variation keeps one 3D hero at a smaller scale. A2 and A3 flatten their content-layer 3D (features, steps, privacy) at ≤ 820 px. All three pages measure `scrollWidth = 390` at 390 wide, with no horizontal scroll.

## Fonts and their cost

| Variation | Display | Body | Mono | Bytes downloaded on a Mac |
|---|---|---|---|---|
| A1 | System (SF Pro Display) | System (SF Pro Text) | `ui-monospace` (SF Mono), with IBM Plex Mono 400 as an `@font-face` fallback | **0 KB** on Apple platforms. 15 KB elsewhere, only when SF Mono and Menlo are missing |
| A2 | Bricolage Grotesque, variable (self-hosted) | System | — | **41 KB** |
| A3 | System | System | Same as A1 | **0 KB** on Apple platforms, 15 KB elsewhere |

**The screenshots show a fallback.** This Linux renderer has no SF fonts. The stacks include `Inter`, which is installed here, so the PNGs render the system-font parts in Inter (and the mono labels in IBM Plex Mono). On a Mac, A1 and A3 render in SF Pro and SF Mono: a little tighter and rounder, with the same metrics class. All licences are SIL OFL 1.1 and live in `../assets/fonts/`.

## Contrast (WCAG 2.x, computed against the actual tokens)

- **A1 (black):**
  - Main text: ink 19.3:1. ink‑2 12.3:1 on black and 10.9:1 on cards. ink‑3 7.9:1 on black, 7.0:1 on cards and 7.4:1 on the band. Lilac 10.5:1. The CTA is black on white (21:1).
  - Hero glow: at its brightest point (≈ `#4E2783`), ink‑2 is still 6.3:1 and the lilac tagline (32 px) is 5.4:1.
  - The decorative mono axis labels drop to about 4.1:1 there. They’re `aria-hidden` and sit off the glow’s centre.
- **A2 (purple):**
  - ink‑2 (white 84%) is 13.8:1 on the base and 7.3:1 at the brightest top glow. ink‑3 (white 70%) is 9.7:1, falling to 5.6:1 at the brightest glow. The lilac tagline is 12.8:1, falling to 6.3:1.
  - Body text on the `.mat` cards over the glow is 8.5:1.
  - The dimmed callouts over the white window sheets were tuned up to `rgba(46,16,82,.74–.80)`. White text there is about 7:1, and ink‑2 is 6.2:1. At the HIG’s plain 35% dimming it was 4.4:1, which failed, so A2 dims harder than the HIG minimum.
  - The TestFlight pill (purple on white) is 12.0:1.
- **A3 (light):**
  - ink 15.3:1. ink‑2 8.5:1 on bg and 10.0:1 on white. ink‑3 5.7:1 on bg and 6.7:1 on white. Accent 10.2:1. The CTA (white on purple) is 12.0:1.
  - Over the hero glow, ink‑2 is 6.7:1, the accent tagline 8.1:1, and ink‑3 4.5:1. The only ink‑3 text there is the 14 px requirement line, which passes exactly, so don’t lighten the glow.

## Recommendation

**A3 Unfold**, with A1’s tesseract kept as a secondary motif.

- **It’s the only one that makes 3D/4D *mean* something.** The app’s idea is “one copied text, opened out so you can fix it”, and the page shows that literally: a closed glass case (the icon) that unfolds to reveal the window, then lays its six faces flat as the six features. It’s the tesseract-net idea at a level anyone gets, without needing to know what a hypercube is.
- **It’s built on one `--fold` variable.** Every illustration is the same component at a different value. That makes it cheap to build as one Astro component, easy to animate with scroll later, and naturally static under reduced motion.
- **It’s light, like developer.apple.com/design.** That keeps the spec’s calm voice and readable prose, and it translates to the help pages (they keep the light layout and only borrow the rims and the mono kickers). A dark version is straightforward, since the iridescent rims work on `#0B0A0F` too. Body text contrast is AA everywhere, with comfortable margins.
- **It costs 0 KB of fonts on a Mac** and uses one `backdrop-filter`.

**A1** is the most striking first impression for a developer audience, and its hero would also make the best OG image, press graphic or launch-week banner. I’d borrow two things from it for A3: the projected-cube “six faces” feature glyphs, and the 1D → 4D step glyphs. Its costs: it’s dark-only, which needs a §5 exception, and the effect is mostly in the hero.

**A2** is the safest evolution of what Leo already picked. It’s lush, but it carries round 1 A’s costs plus more: seven backdrop-filters, tilted text, dark only, and a 41 KB font. Its “stack of windows” hero also needs care so it never reads as clipboard history. If Leo prefers it, drop the tilted feature grid (keep it flat) and keep the 3D in the hero and footer only.

### Spec changes any of these would need (§4/§5)

- **A1 or A2:** a fixed dark scheme for the home page, with `color-scheme: dark`.
- **A2:** “self-hosted display face allowed, ≤ 75 KB”, as in round 1.
- **All three:** new tokens (`--rim`, the glass and material tokens, `--fold`), and a §13 note that 3D illustrations are `aria-hidden` or labelled with `role="img"` and stop moving under `prefers-reduced-motion`.
- **All three:** use the real Icon Composer exports at 2× display size in WebP or AVIF. The 384 px PNGs here are stand-ins.
