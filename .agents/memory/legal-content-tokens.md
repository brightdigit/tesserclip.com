# Legal pages: config tokens and privacy facts

Recorded 2026-11-01 (#4).

- `src/content/legal/*.md` can’t import `src/config.ts`, so addresses are written as `{{SUPPORT_EMAIL}}` (also inside `mailto:` links). The pages render `entry.rendered.html` through `fillTokens()` (`src/lib/legal.ts`), which also handles the `%7B%7B…%7D%7D` form Markdown puts in URLs and throws on an unknown token. Add new tokens to the map in `src/pages/privacy.astro` / `terms.astro`.
- Notes for editors go in YAML `#` comments in the frontmatter, not HTML comments: HTML comments would ship in the page.
- The config guard regex-reads the raw `privacy.md` for “doesn’t … run analytics” (spec §4). Keep that phrase while `ANALYTICS` is off.
- Don’t claim “Deleting TesserClip deletes it”: macOS keeps a sandboxed app’s `~/Library/Containers/<bundle id>` when the app is moved to the Trash. The design sentence was dropped for that reason; Leo to confirm.
- Astro scoped styles don’t reach a class passed to a child component (`<Prose class="x">` + `.x :global(a)` in the parent never matches). ProseLayout wraps Prose in its own `<div class="prose-page">` for that reason.
- Lighthouse `link-in-text-block` fails on colour-only links, so ProseLayout underlines links inside `p` and `li`.
