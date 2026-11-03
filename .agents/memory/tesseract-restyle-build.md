# How the Tesseract restyle is built

Recorded 2026-11-02 (#17).

- The mockups’ `#tesseract-restyle` CSS became tokens in `src/styles/global.css` (`--hero-*`, `--wire`, `--wall-*`, `--room-label`, `--privacy-*`, `--glass*`, `--hero-cta-glyph`, `--tint-muted`, with `text-hero-*` utilities through `@theme inline`) and components: `HeroStage` (the dark card, shared by `TesseractHero` and the press key-art card), `HeroPillButton`, `WindowRoom`, `ProjectedFrame`, `PrivacyCard`, `TesseractMark`, `LineTesseract`. Gradients, masks and SVG fills sit in each component’s scoped `<style>`; everything else is utilities.
- `reduce-transparency:` is a custom variant in global.css; `contrast-more:` is Tailwind’s own. Bordered cards switch to `brand-text` borders in one unlayered `prefers-contrast: more` rule in global.css.
- The tesseract SVGs are imported as Astro SVG components from `src/assets/tesseract/`, so they inline and take `currentColor`.
- **The design PNGs were rendered without JS and from the 7-qa CSS.** Utilities that 7-qa never generated (e.g. `h-32` on the press icon tiles) silently did nothing in the mockups, so match the PNG, not the class list. The CopyCard “Copy” buttons show on the site (JS) but not in the PNGs.
- `brand-muted` on `brand-tint` is 4.45:1 in light mode, so the help index band re-points `--color-brand-muted` at `--tint-muted` (#636366).
- A pixel diff against the design PNGs (Playwright, `reducedMotion: 'reduce'`, images decoded before `fullPage`) is the fastest way to check a page: the box renders the same fallback font the mockups used, so unchanged pages diff at 0.0 %.
- The press fact sheet’s website link lightens `brand-accent` 12 % toward white in dark mode: #9B6BD8 on `brand-elevated` is 4.47:1 (axe fails it; it predates #17).
