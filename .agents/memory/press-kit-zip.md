# Press kit zip and its single source

Recorded 2026-11-01 (#6).

- `prebuild` runs `scripts/generate-press-kit-zip.js` after the tests. It writes `public/downloads/tesserclip-press-kit.zip` (gitignored, rebuilt every build) with `README.txt`, `icons/` and `screenshots/`.
- The page (`src/pages/press.astro`) and the zip README both go through `src/lib/press.ts`, which reads `src/data/press.json`. Status and Distribution are computed from `RELEASE_STATE` (spec §8), never stored in the JSON.
- The script imports `src/lib/press.ts` directly (Node type stripping), but it can't import `src/config.ts` (that runs the guards and uses extensionless imports). `readReleaseInfo()` regex-reads `RELEASE_STATE`, `VERSION_LABEL` and `SUPPORT_EMAIL` from config.ts, so keep each a single-quoted one-line `export const`. A test reads the real config.ts to catch drift.
- `public/press/icons/` (SVG copies, 1024/512 PNGs, 1024 WebP) is committed so builds don't need sharp. The script only renders missing files. After the real icon lands (assets issue), run `make generate:presskit` with `-- --force` (or delete the folder) to re-render. WebP stays out of the zip (atleast's filter).
- The Copy buttons use `public/scripts/copy-card.js` via `<script is:inline src>`: Astro inlines small bundled `<script>`s, which the `script-src 'self'` CSP would block.
