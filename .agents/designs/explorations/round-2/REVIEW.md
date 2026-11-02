# Round 2 review: A1 Tesseract vs A2 Depth stack

An independent design review of the two remaining home-page directions. A3 Unfold and round 1 B and C are out, so the designers’ own pick (A3) is moot. This review covers only A1 and A2, with round 1 A and the built `01-home` / `02-home-dark` as context.

**Method.** I looked at every PNG before reading the README. Then I rendered both HTML files myself with Playwright (Chromium) at 1440×900, 1366×768, 1280×800, 390×844 and 320×640. I used `colorScheme` light and dark, with `reducedMotion` both on and off, and looked at the first screen as well as the full page. After that I read the round 2 README and `WEBSITE.md` and checked the claims I could. Renders are Linux Chromium, so system text shows in Inter rather than SF Pro. That changes nothing below.

**Verdict in one line:** build **A1**, but not as drawn. Its hero fails the spec’s first goal on every laptop screen, and it needs a light-mode story. A2 isn’t the right base: it’s the least credible of the two and the hardest to carry into the rest of the site.

---

## What I measured

| Check | A1 Tesseract | A2 Depth stack |
|---|---|---|
| CTA bottom edge, desktop (it’s the same at 1440, 1366 and 1280) | **1031 px**. It’s below the fold at 1440×900, 1366×768 and 1280×800 | 546 px. It’s above the fold everywhere |
| Tagline bottom edge, desktop | 872 px. It’s below the fold at 800 and 768 tall | 383 px |
| CTA bottom edge, 390×844 | 787 px (visible) | 511 px (visible) |
| `scrollWidth` at 320 px | 320. No overflow | **327. It scrolls sideways**, which fails §13 reflow |
| Respects `colorScheme: light` | No. It’s dark only (`color-scheme: dark`) | No. It’s dark only. The 1440 and 390 renders are byte-identical in light and dark |
| Running animations, reduced motion off / on | 1 (`tess-spin`, 48 s) / 0 ✓ | 3 (`breathe-1..3`) / 0 ✓ |
| `preserve-3d` contexts | 3 | 12 |
| Elements with `backdrop-filter` | 1 (nav) | 7 |
| `prefers-reduced-transparency` | Not handled (it only matters for the nav) | Handled ✓ |
| `prefers-contrast` | Not handled | Not handled |
| Web fonts | 0 KB on a Mac. Plex Mono is a fallback only | **41 KB Bricolage**. §3 and §5 forbid web fonts |
| Main product screenshot alt text | `alt=""`. §9 requires the descriptive alt | `alt=""`. Same problem |

**Contrast claims check out.** I recomputed them from the tokens:
- A1 ink‑3 is 7.9:1 on black, 7.0:1 on a card, and 4.07:1 on the brightest glow, where only the `aria-hidden` annotations sit. The lilac tagline on the glow is 5.4:1.
- A2 ink‑3 is 9.6:1 on the base and 5.4:1 on `#5E2A99`. Lilac on `#5E2A99` is 6.0:1, close to the claimed 6.3. Purple on white is 12.0:1.

The designers’ font-weight and backdrop counts are also accurate. What the numbers don’t capture is that A2’s tilted planes soften the text: the hero window and the feature cards are visibly rasterised. The README admits this.

---

## Scores (1–5)

| Criterion | A1 | Why | A2 | Why |
|---|---|---|---|---|
| Clarity in 5 s | **2** | A glowing cube and “x · y · z / three dimensions” fill the first 900 px. The lead and CTA are below the fold on every laptop, and nothing on screen says “text editor” | **4** | The name, tagline, lead and CTA are all above the fold, and a real editor window peeks under them. A stack of titled windows behind it could still read as clipboard history |
| Brand fit (icon and name) | **5** | It’s literally a tesseract, built from the icon’s glass, with the icon’s sheets in the inner cell. Tesser + Clip, made visible | **4** | It’s the icon exploded, so the icon fit is excellent. It says nothing about “tesser”, and it looks like a generic stack-of-cards hero |
| Apple-platform credibility | **4** | System type, true black, white pill and eyebrow rhythm. It sits comfortably next to developer.apple.com and WWDC26. It loses a point for the mono “face 3/6” and axis annotations, which feel like a design student’s portfolio | **2** | A full purple wash, a glowing gradient-filled 132 px display face, tilted cards and seven glass panes. It reads as 2023 Dribbble glassmorphism, not Apple 2026. Apple’s own HIG says glass is for the functional layer, used sparingly |
| Legibility and a11y | **3** | Body text is flat and high-contrast. But the product screenshot has no alt text, there’s no reduced-transparency or increased-contrast handling, and it’s dark only | **2** | Body text sits on tilted, rasterised planes. It has seven backdrop-filters, overflows at 320, and the content all sits on a moving glow. It does handle reduced transparency |
| Mobile | **4** | The hero works at 390×844 with the CTA visible, and the content is flat. The page is long (7.4k px), with big empty bands | **3** | The hero is better at 390. But it scrolls sideways at 320, and the tilted 3D gets cramped |
| Light/dark | **2** | Dark only. But its band and card colours are almost exactly the spec’s dark tokens (`#0B0A0F` / `#16141C`), so a light page is a straight translation | **1** | Dark only, and the purple space *is* the design. There’s no plausible light version |
| Performance | **4** | 0 KB fonts, one blur, one compositor animation. The 3D rig adds about 300 DOM nodes | **2** | 41 KB font, 7 blurs, a large 3D hero and three animations. Lighthouse TBT on throttled mobile is a real risk against the 0.9 bar |
| Buildability (Astro 7, Tailwind 4, no JS) | **4** | One self-contained hero component (or a static image), and everything else is flat Tailwind | **3** | Doable, but it has 12 `preserve-3d` contexts with Safari and Chromium flattening traps, and an HTML rebuild of the Discard alert that has to be maintained by hand |
| Extends to help, privacy, support and press | **4** | Neutral bands, system type and flat cards are the spec’s existing component set. The cube becomes a small mark | **2** | Long help prose and legal text on a purple glow is tiring and off-spec. The help pages would look like a different site |
| Longevity | **4** | A wireframe tesseract is a durable, ownable mark. It can be an OG image, press key art or a launch banner for years | **2** | The purple glow and frosted panes will date within one design cycle |
| **Total (of 50)** | **36** | | **25** | |

Neither one is shippable as drawn. A1 is the right foundation once its hero is fixed.

---

## A1 Tesseract: critique

**What’s right.** It’s the only direction that answers Leo’s brief, “more plays on 3D/4D”, with real 4D rather than just depth. And it does it with restraint: the spectacle stays in the hero, and everything below is calm, flat and readable. The designers call that “mostly in the hero” as if it were a weakness. I think it’s the main strength. The best idea below the fold is section 01, “the window”. It puts the flat editor screenshot inside a Schlegel-diagram room, with the walls carrying real shortcuts (New Window from Clipboard ⌘N, Copy All ⇧⌘C, Undo ⌘Z · Find ⌘F). That gives depth without tilting any text. The black privacy card with the 2D tesseract drawing is the second-best moment.

**Biggest weaknesses, with fixes:**

1. **The hero buries the pitch (critical).** At 1440×900 the lead sentence is cut off and the TestFlight CTA starts at about 983 px. At 1280×800 and 1366×768 you can’t even see the tagline: the first screen is the nav, a pill, a cube and half a wordmark. That fails §1 goal 1 (“Explain the app in one screen”) and goal 2 (get people into the beta). The hero is a fixed height, so it doesn’t adapt. *Fix:* at `lg` and up, use a two-column hero with the copy on the left (pill, h1, tagline, lead, CTA, requirement line) and the tesseract on the right at about 420–460 px. Below `lg`, stack the copy first and put a smaller cube (≤ 260 px) after the CTA. Target: the CTA bottom ≤ 640 px at 1280×800, and the top of the window stage visible at 1440×900.
2. **Nothing on the first screen shows the product.** Developer.apple.com can open on an abstract glowing object because everyone already knows what Xcode is. TesserClip has no such luck. *Fix:* move the section 01 window room straight under the hero, with no h2 block in between, so its top edge peeks above the fold. Then put “Made for the moment between copy and paste.” after it, as the features heading. That’s also back where §9.1 has it.
3. **The decoding labels are gimmicky.** “x · y · z / three dimensions”, “w · one more / tesser + clip”, the “face 1/6…6/6” tags, and the lead “Six things TesserClip does, one on each face of the cube.” all explain the metaphor instead of the app. Mac users who copy and paste a lot don’t care. *Fix:* cut all of them. Explain the name once, on `/press` (“The name”), where press will actually want it.
4. **The glyphs don’t mean anything.** The six feature icons are the same wireframe cube with a different face filled, and the step glyphs go line → square → cube → tesseract. Neither tells you anything about Copy, Open, Fix or Copy back, or about the features. *Fix:* use the spec’s `IconTile` line icons for features, and numerals for steps (A2’s large numerals or the baseline circles). Keep the cube only in three places: the hero, the window room and the privacy card.
5. **It’s dark only.** That’s a §5 violation, and it matters more than it looks. Help readers arrive from the app, often in light mode. *Fix:* see the recommendation below. The hero stays a dark stage, and the rest follows the system.
6. **It animates.** The 48 s spin is gentle, and reduced motion turns it off. But §17 lists “Video and animated hero media” as a non-goal. *Fix:* ship the resting frame as a static image. That also helps with LCP and cross-browser consistency (the README itself warns about Safari and Chromium flattening differences), and it gives press the same art.
7. **Smaller issues.**
   - The editor screenshot is `alt=""`; it needs §9’s alt text.
   - The safe-edits screenshot is small and dim inside its projected frame. Make it at least 50 % of the row width.
   - There are about 300 px of dead black above section 01, and the bands run long on mobile. Use §5’s `py-16 md:py-24`.
   - The nav needs a `prefers-reduced-transparency` and `prefers-contrast` fallback (a solid `#0B0A0F`).
   - The white-pill “Join the beta on TestFlight” replaces the spec’s two-line `TestFlightButton`. That’s fine on a dark stage, but record it in §7.

## A2 Depth stack: critique

**What’s right.** It’s the clearest of the two above the fold, because it keeps the baseline’s order (pill → name → tagline → lead → CTA → product) and adds depth only below the CTA. The hero literally *is* the icon, and the “Every window is its own draft” callout ties the depth to a real feature. Large numerals in How it works are the most readable step treatment in round 2. The exploded-icon footer is a nice moment.

**Biggest weaknesses, with fixes:**

1. **It looks like clipboard history.** The hero stacks “Re: Thursday”, “Fix sync after sleep” and “Standup notes” behind the current window, fanned back in time. That’s exactly the visual language of clipboard managers (Paste, Maccy). The app has no history, and AGENTS.md forbids implying one. A small callout can’t outweigh the picture. *Fix:* if A2 is kept, show only one window plus the icon’s plain sheets, with no titled windows. At that point it’s round 1 A again.
2. **The text sits on tilted planes.** The hero window, the feature table (`rotateX(10deg)` with leaning cards), the safe-edits screenshot and the step planes all tilt. In Chromium the text rasterises soft, and it reads worse than the flat baseline. *Fix:* keep body text on flat planes, and allow 3D only in the hero and footer art. The README suggests this too.
3. **The purple runs everywhere.** It breaks §5 (“Purple is only for interactive and brand moments”). With seven Liquid Glass panes on the content layer as well, it goes against HIG Materials (“sparingly”, “functional layer”), and against the credibility the brief asked for. *Fix:* use neutral bands and keep purple for the hero stage and CTAs, which is what A1 already does.
4. **It breaks spec constraints.** It needs a 41 KB web font (§3 and §5 say no web fonts), it’s dark only, and it scrolls sideways at 320 px (§13). *Fix:* use the system display type, and find and clip the 7 px overflow in the hero stack.
5. **It would be hard to build and keep up.** There are 12 `preserve-3d` contexts, and the Discard alert is rebuilt in HTML rather than shown as the real screenshot, so it will drift from the app. *Fix:* use the screenshot (§9.1 row 4) on a flat stage.
6. **It doesn’t carry to the other pages.** Long help articles and legal text can’t sit on this background, so `/help` would have to become a different site.

---

## Recommendation: A1 as the base, plus three specific borrowings

I disagree with the README in two places. It calls A2 “the safest evolution” of what Leo liked. I think it’s the riskiest one: it has the history misread, it breaks the spec in four places, and it’s the least credible to Apple developers. I agree that A1 makes the strongest first impression for a developer audience. But I don’t accept dark only as the price. A narrow exception covers it.

**Top three reasons for A1:**
1. **It’s the only real 3D/4D answer to the brief that stays restrained.** The tesseract is the name made visible, and everything below it is flat and readable. That’s also why it can carry over to the rest of the site.
2. **It belongs next to Apple’s 2026 developer pages.** It uses system type, true black, a white pill, eyebrow-over-title sections and one luminous object. With 0 KB of fonts and one blur, it has the best odds of meeting the Lighthouse 0.9 and 0.95 bars.
3. **Its problems are fixable layout choices, not a flawed concept.** A1’s problems are fold position, decoding labels and dark only. A2’s problems are the concept itself: stacked windows suggest history, and the purple glass is the whole look.

**The hybrid, section by section:**

| § 9.1 row | Source | What to build |
|---|---|---|
| Nav | A1 | Sticky translucent bar with one blur. In light mode it uses the spec tokens, and over the dark hero stage it uses A1’s dark values. Solid fallback for reduced transparency and increased contrast |
| 1. Hero | **A1, recomposed** | A **dark stage in both colour schemes**, a rounded `max-w-6xl` black card like developer.apple.com’s hero card. In light mode it sits on the white page, and in dark mode it bleeds into the page. The copy is on the left and a **static** tesseract image on the right (≥ `lg`). Below `lg`, the copy comes first and the cube is smaller and underneath. No annotations. Pill, CTA and requirement line follow §8. The CTA is a white pill with the TestFlight glyph, accessible name “Join the beta on TestFlight” |
| 2. Stage | **A1 section 01** | The Schlegel window room, directly under the hero so it peeks above the fold. The walls carry real-text shortcut labels. Use the §9.1 alt text. **Borrow from A2:** the “Copy All ⇧⌘C” glass chip pointing at the toolbar button (functional-layer glass, used once). In light mode the room has light walls (`--stage-from/to` light) and dark lines |
| 3. Features | A1 layout, **baseline icons** | Heading “Made for the moment between copy and paste.” and its spec lead. Flat 3 × 2 `FeatureCard`s with `IconTile` line icons. No face labels and no cube lead. (“One clipboard. As many windows as you need.” is good copy. If Leo wants it, it can go in the lead, with a §9.1 change.) |
| 4. Safe edits | A1, enlarged | The real `04-discard-alert-window.png` at ≥ 50 % width, in a shallow projected frame (lines only, no tilt) |
| 5. How it works | **A2 numerals** on A1 cards | Four flat `StepCard`s with large numerals and `Kbd` chips. Drop the 1D→4D glyphs |
| 6. Privacy | **A1 card** | The privacy card with the 2D tesseract line drawing. It’s black in dark mode and `brand-surface` in light mode. `PrivacySummary` points as in the spec |
| 7. Facts strip | spec | Unchanged |
| 8. Footer | A1 + **A2 idea, simplified** | The spec footer. Optionally, a small static exploded-icon image above “Copy. Fix. Paste.”, as a flat image rather than live 3D |

---

## Changes to make before building (in priority order)

1. **Fix the fold.** Recompose the hero as above. The acceptance check: at 1280×800 the CTA’s bottom is ≤ 700 px, and at 1440×900 the top of the window stage is visible. At 390×844 the CTA is visible, as it already is.
2. **Make light and dark work.** The hero card is always dark (add a one-line §5 exception: “the home hero stage is dark in both schemes”). Every other section, and every other page, follows `prefers-color-scheme` with the existing §5 tokens. A1’s band and card colours are already the dark tokens, so map them, not new hexes.
3. **Make the hero static and cut the decoding labels.** Remove `tess-spin` (§17). Export the resting frame as AVIF and WebP at 1× and 2× with explicit size, `alt=""` and `aria-hidden` (the h1 carries the meaning). Use it again as the OG image and as press key art. Delete the x · y · z / w annotations, the “face n/6” tags and the “one on each face of the cube” lead. Explain the name on `/press`.
4. **Put the product right after the hero.** Move section 01’s window room straight under the hero. Give the screenshot the §9.1 alt text. Add the single “Copy All ⇧⌘C” chip. Enlarge the safe-edits screenshot.
5. **Use meaningful icons, not cube glyphs.** Features get the spec’s `IconTile` icons, and steps get numerals. The cube appears only in the hero, the window room, the privacy card, and as a small mark on help, press and 404.
6. **Add the accessibility fallbacks.** Add `prefers-reduced-transparency` and `prefers-contrast: more`, giving a solid nav and 1 px solid borders on cards. Turn off all transitions under reduced motion (§13). Verify reflow at 320 px and 200 % zoom.
7. **Update the spec in the same PR.**
   - §5: the dark hero exception, and the tokens for wire and glow.
   - §7: a `TesseractHero` (static image) component and a `WindowRoom` stage, plus the white-pill `TestFlightButton` variant for dark stages.
   - §9.1: the new section order and copy.
   - §13: decorative 3D art is `aria-hidden`.
8. **Use real assets.** Use the Icon Composer exports at 2×, and real beta screenshots in light and dark (open question 1). The window room makes the dark-mode screenshot gap more visible, so it’s worth closing first.

## What help, privacy, support and press look like in this direction

- **Shared:** system type and the §5 tokens, following the system colour scheme. Neutral bands, flat cards and no glow behind text. The nav and footer match the home page. The only brand flourish is a small (24–32 px) line-drawn tesseract mark, taken from A1’s privacy card. It goes next to page eyebrows and doesn’t repeat inside the content.
- **Help (`/help/`, `/help/clipboard-permission/`):** reading pages, not marketing.
  - About 760 px of prose with the `OnThisPage` sidebar, `Breadcrumbs`, `Kbd` chips, `ShortcutTable` and `<details>` FAQs.
  - The header is a plain title with a sentence-case eyebrow (“Help”). No dark stage and no 3D.
  - Optional, on the help index only: a slim light-tint band with the line mark at the top. The permission article’s `HowToSteps` uses the same numerals as How it works.
  - People open these from the app mid-task, so they must load instantly and read well in light mode.
- **Privacy and Terms:** `max-w-2xl` prose. Privacy opens with the same privacy card as the home page (black in dark mode, `brand-surface` in light), with the 2D tesseract drawing and the three `PrivacySummary` points, then the policy text. Terms is plain prose with no art.
- **Support:** `TopicCard`s and FAQs on neutral bands, with the email button as the one purple element. No 3D.
- **Press:** the one other page allowed some spectacle. Use a dark key-art card with the static tesseract render, available as a download alongside the icon and screenshots. Add a short “The name” note (tesser + clip, after the tesseract, the 4D cube), which is where the annotations belong. The fact sheet and copy cards stay flat.
- **404:** the line-drawn tesseract with an empty inner cell, plus plain copy and links to Home and Help. It’s static.
