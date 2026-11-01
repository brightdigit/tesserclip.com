# Home page explorations

Three alternative visual directions for the tesserclip.com home page (`/`). They’re more expressive than the restrained designs in `../01-home.*`. **These are mockups only.** Nothing here changes `WEBSITE.md`, the Astro code or any PR. Each file is one standalone HTML page with inline CSS. Fonts and icons are local, there are no external requests, and the PNGs were rendered with Playwright (Chromium): 1440 wide at 1×, and 390 wide at 2×, both full page.

The copy is the current home page’s copy, in the beta state. It says “Join the beta on TestFlight”, “Coming soon to the Mac App Store. Requires macOS 27 or later.”, and has the same six features, the four “How it works” steps and the privacy points. There’s no clipboard history, auto-paste or hotkey. The few additions are display-only, and each is a restatement of existing copy: B’s and C’s figure captions, C’s “Copy. Fix. Paste.” poster stack and shortcut band, and A’s “Copy. Fix. Paste.” footer line.

## Files

| File | What |
|---|---|
| `A-purple-glass-home.html` · `.png` · `-mobile.png` | A. Purple glass. One full-colour scheme, with no light/dark split |
| `B-editorial-home.html` · `.png` · `-mobile.png` · `-dark.png` · `-dark-mobile.png` | B. Text-first editorial. Paper (light) and ink (dark) |
| `C-poster-home.html` · `.png` · `-mobile.png` · `-dark.png` · `-dark-mobile.png` | C. Poster. Neon on near-black (dark) and a riso print on lilac (light) |
| `assets/icons/AppIcon-macOS-*-1024@1x.png` | The real Icon Composer exports (Default, Dark, ClearLight, ClearDark, TintedLight, TintedDark) |
| `assets/icons/icon-{default,dark}-384.png` | 384 px downsized copies of Default and Dark (about 87 KB each). The pages use these, because the 1024 exports are 1.8–2.1 MB each |
| `assets/fonts/*.woff2` + `OFL-*.txt` | Self-hosted Latin-subset fonts and their SIL OFL 1.1 licences (from Fontsource npm packages) |

The screenshots come from `../assets/screens/` and aren’t copied. Pages that support both schemes use a `<picture>` to swap in the Dark icon for `prefers-color-scheme: dark`. A uses Default throughout, since it has only one scheme.

---

## A. Purple glass (required direction)

**Idea:** the whole page sits *inside* the icon. A full-bleed purple gradient runs from the icon’s lit top edge (#5E2A99) through its base (#4A1D7A) down to the dark stop (#06030D) at the footer. Big translucent sheets, skewed −14° like the icon’s stacked cards, frame the hero. Each content block (nav, feature cards, steps, privacy panel, screenshot slab) is a `backdrop-filter` glass card with a bright 1 px top edge. The screenshot sits on a glass slab, with two skewed sheets fanned out behind it and a fade into the page at the bottom. The four steps step down like a fanned stack. The wordmark is white **Bricolage Grotesque ExtraBold** at 150 px, with the tagline in lilac. The CTA is inverted to a white pill with purple text, so it’s the brightest thing on the page.

- **Fonts:** Bricolage Grotesque (variable, `wght` 200–800), display only. Body, nav and kbd stay on the system stack.
- **Palette:**

  | Token | Value | Use |
  |---|---|---|
  | `--purple-hi` | #5E2A99 | Gradient top |
  | `--purple` | #4A1D7A | Icon base, CTA text |
  | `--deep` | #06030D | Footer |
  | `--lilac` | #D9C4F5 | Tagline, list icons |
  | `--ink` / `--ink-2` / `--ink-3` | #FFF / white 86% / white 74% | Text |
  | Glass fill | white 16% → 6% gradient | Cards |
  | Glass edge | white 18–34% | Card borders |
  | Glow | #B080EC at 45% (radial) | Behind the hero |

- **Contrast (WCAG 2.x):**
  - White on #4A1D7A is 12.0:1, and white on #5E2A99 is 9.3:1.
  - `--ink-2` body text on bare purple is 9.3:1. On the lightest glass case (16% white over #5E2A99) it’s 5.0:1.
  - `--ink-3` captions are 7.2:1 on #4A1D7A (5.8:1 on #5E2A99), and they’re used only on bare purple, never on glass.
  - The lilac tagline is 7.5:1 on #4A1D7A, and 4.1:1 at the brightest point of the hero glow, where it’s 44 px display text (large-text AA is 3:1).
  - The TestFlight button (#4A1D7A on white) is 12.0:1.
  - Nav links are full white, because the nav glass sits on the brightest part of the gradient.
  - Thinnest margin: with the 16% glass gradient over the brightest purple, `--ink-2` is 5.0:1. Don’t lighten the glass any further.
- **Cost:** 41 KB of fonts (one variable file). `backdrop-filter` runs on about 18 elements. That’s fine on Apple silicon, but it adds compositing cost while scrolling on low-end devices and in Lighthouse’s throttled CPU runs. Expect a small TBT/INP hit, not an LCP one. The hero LCP becomes the 150 px wordmark, so preload the font.
- **Spec changes to adopt it:**
  - §5 “Light and dark mode follow `prefers-color-scheme`” would need an exception: the home page (or the whole site) is one fixed purple scheme with `color-scheme: dark`.
  - §5 “Type is the system stack only” becomes “system stack, plus self-hosted Bricolage Grotesque for display”.
  - New tokens: `--font-display`, `--color-glass-*`, `--color-lilac`, and the gradient stops. The current `--stage` token goes away.
  - The help, legal and press pages would need a decision: go purple too (long prose on purple is tiring), or stay light/dark and keep purple to the home page. My suggestion is the second.
  - Use real Icon Composer exports at 2× display size in WebP or AVIF. The 384 PNGs here are stand-ins.

## B. Text-first editorial

**Idea:** the product is about text, so typography is the hero. The page is laid out like a well-set magazine:
- a mono top strip and a centred serif nameplate between a double rule;
- a huge **Instrument Serif** headline, with *before* set in purple italic;
- next to it, a “proof sheet” of the copied release notes in **IBM Plex Mono**. It shows two typos struck through in purple, the fix written above each in serif italic, a highlighter mark, a caret and a cursor, plus a margin column of notes: “Undo is ⌘Z away. / Then copy it all. ⇧⌘C”.

That’s the “copied text being fixed” moment as a still image. Below it, the screenshot is a captioned *Fig. 1* on a light-lavender band. Features are numbered 01–06 in a column grid, and the safe-edits section is a pull quote. “How it works” uses big italic serif numerals, and the privacy statement is a 104 px serif headline. The footer is a giant nameplate. Kbd chips look like typewriter keys (mono, heavier bottom border). Purple is used only as accent ink.

- **Fonts:** Instrument Serif Regular and Italic for display only (it has one weight, so it isn’t for body text). IBM Plex Mono 400 and 500 for labels, the proof sheet and kbd. Body is the system stack.
- **Palette:**

  | Token | Light | Dark |
  |---|---|---|
  | `--paper` | #FBF8F2 | #141019 |
  | `--paper-2` (lavender band) | #F1EAF8 | #1D1627 |
  | `--sheet` | #FFFFFF | #1F1A26 |
  | `--ink` | #1E1726 | #EFE9F5 |
  | `--ink-2` | #4F4659 | #C4BBCE |
  | `--ink-3` | #6E6578 | #A39AAE |
  | `--accent` | #4A1D7A | #B892EA |
  | `--accent-ink` (on accent) | #FFFFFF | #1A0F28 |
  | `--mark` (highlighter) | #E4D3F7 | #3A2752 |

  The dark accent is #B892EA rather than the app’s #9B6BD8, because Instrument Serif’s hairlines thin out at #9B6BD8 on near-black.
- **Contrast:**
  - Light: ink 16.4:1, ink-2 8.4:1, ink-3 5.2:1 (4.7:1 on the lavender band), and accent 11.3:1 on paper. The button (white on #4A1D7A) is 12.0:1.
  - Dark: ink 15.8:1, ink-2 10.2:1, ink-3 7.0:1, and accent 7.5:1. The button (#1A0F28 on #B892EA) is 7.3:1.
  - Everything passes AA, and nearly everything passes AAA.
- **Cost:** 72 KB of fonts in total (Instrument Serif 21 + 22 KB, Plex Mono 15 + 15 KB). Drop Plex Mono 500 and the italic to get to about 36 KB. There’s no `backdrop-filter` and no gradients, so this is the cheapest direction to render.
- **Spec changes to adopt it:**
  - §5 type: add `--font-serif` (Instrument Serif) and `--font-mono` (IBM Plex Mono, replacing the `ui-monospace` stack for kbd). Swap the page colour tokens to paper and ink.
  - The section rhythm changes from centred headings to a 280 px label column plus content, and from alternating gray bands to hairline rules.
  - Help articles would inherit it naturally. The serif h2s and mono kbd suit long prose.
  - Light and dark both work, so the existing §5 dark-mode rule still holds.

## C. Poster

**Idea:** a bold gig-poster home page. The hero is three oversized **Unbounded Black** words, “COPY. / FIX. / PASTE.”, at 200 px:
- COPY and PASTE are outlined;
- FIX sits inside a text-selection highlight with a glowing insertion cursor, so the poster literally shows text being edited;
- each word carries its shortcut tag (⌘C in any app, ⌘Z in TesserClip, ⌘V where it belongs).

The real `<h1>` sits under a neon rule: “TesserClip. Fix copied text before you paste it.” Below that, a tilted neon band lists the app’s shortcuts, and the screenshot is tilted with a neon outline and a round “Copy All ⇧⌘C” sticker. The features have huge outlined numerals. “How it works” is four chunky 3-D keycaps, with the Fix key lit, and the footer ends on a giant outlined “TESSERCLIP” that bleeds off the bottom edge.

- Dark is the hero look: near-black purple with neon lilac and a glow.
- Light is a two-colour riso print: deep purple ink on lilac paper, with no glow.

- **Fonts:** Unbounded (variable, `wght` 200–900) for display, headings and kbd. Body is the system stack. *Gotcha:* the variable font has overlapping contours, so a plain `-webkit-text-stroke` outline shows the joins inside the letters. Outlines here use a double-width stroke under a fill of the page colour (`paint-order: stroke fill`), which hides them. Fontsource’s static instances have the same overlaps, so they don’t fix this.
- **Palette:**

  | Token | Light (riso) | Dark (neon) |
  |---|---|---|
  | `--bg` | #EDE3FA | #0B0614 |
  | `--bg-2` | #E1D2F5 | #140B22 |
  | `--ink` | #1F0838 | #F6F0FF |
  | `--ink-2` | #47305F | #CDBFE0 |
  | `--ink-3` | #5E4A75 | #A796BE |
  | `--neon` (accent, rules, outlines) | #4A1D7A | #C9A2FF |
  | `--neon-ink` (on neon) | #FFFFFF | #14081F |
  | `--sel` (selection highlight) | #C6A3F2 | #7C4DBF |
  | `--glow` | none | #C9A2FF at 55%, plus #9B6BD8 at 45% |

- **Contrast:**
  - Dark: ink 17.9:1, ink-2 11.5:1, ink-3 7.4:1, and neon 9.6:1 on bg. The CTA (#14081F on #C9A2FF) is 9.3:1, and white on the #7C4DBF selection is 5.7:1.
  - Light: ink 14.8:1, ink-2 9.1:1, ink-3 6.3:1 (5.4:1 on bg-2), and accent 9.7:1. The FIX selection (#1F0838 on #C6A3F2) is 8.6:1.
  - Outlined words are decorative (`aria-hidden`), and their real text is in the `<h1>` and headings.
- **Cost:** 51 KB of fonts (one variable file). The glows are `box-shadow`/`text-shadow` only, with no `backdrop-filter`. The band is static here. If it scrolls as a marquee, it must stop under `prefers-reduced-motion` (§13 already requires this). Lighthouse’s CLS is safe because every display block has a fixed size.
- **Spec changes to adopt it:**
  - §5 type: add `--font-display` (Unbounded). Unbounded is wide, so headings need roughly 30% smaller sizes than the system-font scale for the same line length.
  - New tokens: `--neon`, `--sel`, `--glow`, plus the riso light palette.
  - The help and legal pages would keep the system body type, with only Unbounded headings.
  - The outlined-type technique and the overlap gotcha above belong in the memory folder.

---

## Font cost summary (Latin subset, woff2)

| Font | Files used | Bytes | Licence | Used by |
|---|---|---|---|---|
| Bricolage Grotesque (variable `wght`) | 1 | 41,344 | SIL OFL 1.1 | A |
| Instrument Serif Regular + Italic | 2 | 21,032 + 22,128 | SIL OFL 1.1 | B |
| IBM Plex Mono 400 + 500 | 2 | 14,708 + 14,888 | SIL OFL 1.1 | B |
| Unbounded (variable `wght`) | 1 | 50,904 | SIL OFL 1.1 | C |

The current site ships **0 bytes** of fonts. For any direction:
- Self-host the files (`font-src 'self'` is already in the §12 CSP, so the CSP doesn’t change).
- Preload the one file the hero uses.
- Use `font-display: swap`, with a metric-matched fallback (`size-adjust`) to avoid layout shift.
- Ship only the Latin subset. ⌘ ⇧ ⌥ ▸ aren’t in these subsets and fall back to the system font. That’s intended, because SF renders the Mac key glyphs best.

The spec line that has to change is §4/§5: “no web fonts” becomes “no *third-party* font requests; self-hosted display faces allowed, at most about 75 KB”.

## Recommendation

**B (editorial)**, with one borrow from A.

- B is the direction that most belongs to *this* product. TesserClip is a text editor for fixing text, and the proof-sheet hero explains the app in one look, before anyone reads a word.
- B also keeps the spec’s calm voice and both colour schemes, and passes AA (mostly AAA) with room to spare.
- B adds no compositing cost, and with the italic and Mono 500 dropped its fonts come down to about 36 KB.
- B carries straight over to the help articles, which are the pages the app actually opens.

**A** is the strongest answer to “make it look like the icon”, and it’s finished enough to build. The costs:
- It drops light/dark mode.
- Its contrast margins on glass are thin, at 5.0:1 in the worst case.
- `backdrop-filter` is everywhere.
- It doesn’t translate to long help pages.

If Leo wants the purple, I’d take A’s full-bleed purple-glass treatment for **one band only** in B: the closing CTA and footer, with the Default icon and skewed sheets. That gives the page an icon-coloured finale without putting body text on glass.

**C** is the loudest and the most fun. But it reads as a launch-event poster rather than a calm utility, and Unbounded’s width makes every heading fight for space at 390 px. Keep it in mind for a launch-week banner, OG image or press graphics rather than the site.
