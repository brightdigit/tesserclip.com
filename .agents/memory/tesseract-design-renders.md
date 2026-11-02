# Tesseract design renders

The 2026-11-02 Tesseract mockups (`.agents/designs/*.html`) were generated from the 7-qa build’s `dist/` pages, with the built Tailwind CSS inlined and a `#tesseract-restyle` block of `tc-…` classes on top. So their copy is the built copy, and the `tc-…` names are mockup mechanics, not component names.

- **RENDER-ONLY font block.** The Linux render box has no SF Pro, so every mockup has a `<style id="render-only-font">` that adds Inter. It’s not part of the design and must never reach `src/`.
- **The OG image’s wordmark is Inter** for the same reason. `assets/tesseract/source/og-image.html` is the source: re-export it on a Mac (delete its RENDER-ONLY block) before go-live.
- **The hero art is a static render** of the A1 CSS 3D rig (`assets/tesseract/source/tesseract-hero.html`, Playwright, `omitBackground`). Don’t rebuild it as live CSS 3D on the site.
- **Full-page Playwright renders skip off-screen `decoding="async"` / `loading="lazy"` images.** Strip both attributes (or `await img.decode()` for each image) before `fullPage` screenshots, or tiles render empty.
- Fold numbers in the README were measured with Inter. SF Pro sets slightly tighter, so the real site should measure the same or slightly smaller.
