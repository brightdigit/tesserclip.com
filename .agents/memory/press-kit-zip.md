# Press kit zip and its single source

Recorded 2026-11-01 (#6).

- `prebuild` runs `scripts/generate-press-kit-zip.js` after the tests. It writes `public/downloads/tesserclip-press-kit.zip` (gitignored, rebuilt every build) with `README.txt`, `icons/`, `key-art/` and `screenshots/`. It fails if a file press.json names is missing from `public/press/`.
- The page (`src/pages/press.astro`) and the zip README both go through `src/lib/press.ts`, which reads `src/data/press.json`. Status and Distribution are computed from `RELEASE_STATE` (spec §8), never stored in the JSON.
- The script imports `src/lib/press.ts` directly (Node type stripping), but it can't import `src/config.ts` (that runs the guards and uses extensionless imports). `readReleaseInfo()` regex-reads `RELEASE_STATE`, `VERSION_LABEL` and `SUPPORT_EMAIL` from config.ts, so keep each a single-quoted one-line `export const`. A test reads the real config.ts to catch drift.
- Since #17 `public/press/icons/` holds the six real Icon Composer exports (`AppIcon-macOS-<Variant>-1024.png`, copied from `src/assets/icon/`) plus 512 px renders of Default and Dark, all committed. The script only renders a missing 512 (sharp); `-- --force` re-renders them. The page’s tiles are `astro:assets` thumbnails of `src/assets/icon/` that link to the `public/press/icons/` originals. Key art lives in both `src/assets/tesseract/` (thumbnail) and `public/press/key-art/` (download). WebP stays out of the zip (atleast's filter).
- The Copy buttons use `public/scripts/copy-card.js` via `<script is:inline src>`: Astro inlines small bundled `<script>`s, which the `script-src 'self'` CSP would block.
