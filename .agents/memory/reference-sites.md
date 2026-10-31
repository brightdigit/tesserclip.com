# Reference sites

Recorded 2026-10-31. Both are BrightDigit Astro sites on GitHub Pages.

- **brightdigit/atleast.app** is the main reference for setup and tooling:
  - Astro 7, Tailwind 4 through `@tailwindcss/vite`, Node 24 in `.mise.toml`, and the `make` front door
  - `deploy.yml` and `lighthouse.yml`, `lighthouserc.json` thresholds (perf/SEO/best-practices 0.9, a11y 0.95), `scripts/check-links.js` and `scripts/generate-press-kit-zip.js`
  - The Nav (`lg` collapse into `<details>`, “Join Beta” pill), the Footer (“is developed by” plus the BrightDigit logo SVG), the `PRIMARY_CTA` beta/App Store switch and its TestFlight button glyph
  - `StepCard` and `SectionHeading` icon tiles, the support page’s topic cards and `<details>` FAQ, the Organization JSON-LD and the config-guard pattern (`throw` in `src/config.ts`)
  - **Not copied:** its dark-only palette, Plausible, the A/B script, the leads tooling, video, `astro-icon`, and the `claude*.yml` workflows
- **brightdigit/month.bar** is the macOS app reference:
  - Apple’s official Mac App Store badge SVGs (black for light mode, white for dark, in a `<picture>`), the centred hero and the page set (index, privacy, support, terms, press, 404)
  - The press-kit structure, the terms structure (entity BrightDigit, LLC; Michigan law) and the Apple-grey text palette
  - **Not copied:** its “personal, non-commercial use” limit, the `press@` address and Plausible
- **Differences:** TesserClip uses its own icon purple (#4A1D7A light, #9B6BD8 dark) and supports both light and dark mode. atleast.app is dark only and month.bar is Apple blue.
