# App help URL contract

Checked in `brightdigit/TesserClip` on 2026-10-31 (branch `v1.0.0-beta.1`).

- `HelpDestination.url` is `https://tesserclip.com/help` and backs Help ▸ TesserClip Help (⌘?).
- `HelpDestination.clipboardPermission` is `https://tesserclip.com/help/clipboard-permission` and backs the ? button in the permission window.
- The source is `Packages/TesserClipApp/Sources/TesserClipApp/Help/HelpDestination.swift`, and `PermissionDestinationTests` pins both URLs.
- Shipped TestFlight builds contain these exact URLs, so they must resolve **forever**. Never rename, move or remove these pages.
- Keep Astro `build.format: 'directory'`:
  - With it, GitHub Pages answers `/help` with a 301 to `/help/` and then a 200.
  - The `file` format would emit `help.html` next to a `help/` directory, which risks a 404 for `/help`.
- `scripts/check-links.js` lists both paths as required, so the build fails if either is missing.
- The app has no other site URLs (no in-app privacy or support links). The App Store Connect Privacy, Support and Marketing URLs are set by hand at go-live.
- The app CHANGELOG known issue #35 (“Help links point to tesserclip.com, which hasn’t launched yet”) is closed by this site going live.
