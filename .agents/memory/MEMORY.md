# Project Memory

This directory is the memory store for tesserclip.com. It’s versioned in git, so Leo, teammates and every agent see the same memories. **It replaces any native or global agent memory for this project.** Don’t save project memories to `~/.claude/projects/<project>/memory/`, Cursor memories or anything similar.

## Convention

- **One file per fact** worth remembering: decisions, constraints, gotchas, or context that you can’t get from the code, `WEBSITE.md` or git history. Use a short kebab-case filename.
- **One line per file in the index below:** `- [Title](file.md) — one-line hook`.
- **Keep it current.** Update or delete a memory that turns out to be wrong instead of leaving it stale. Check for an existing file before adding a new one.
- **Corrections go elsewhere.** Leo’s corrections and always/never directives go in [`../agent-notes.md`](../agent-notes.md).
- **Dates are absolute** (`2026-10-31`), never relative.

## Index

- [Reference sites](reference-sites.md) — what was taken from atleast.app and month.bar, and where they differ
- [App help URL contract](app-help-urls.md) — the URLs compiled into TesserClip builds, and why `build.format` must stay `directory`
- [Go-live plan](go-live-plan.md) — the repo goes public, then GitHub Pages and DNS, then the TestFlight link, then `main`. All of it is Leo’s job.
- [`node --test` runs TypeScript directly](node-test-type-stripping.md) — keep `src/lib/` erasable TS; config.ts is build-time only; check-links regex-reads APP_HELP_PATHS
- [Lighthouse as root](lighthouse-as-root.md) — `make lighthouse` needs `--no-sandbox` and Playwright’s Chromium in root agent containers
- [Restate Tailwind’s layer order in `@layer` style blocks](css-layer-order-inline-styles.md) — an inlined `@layer components` block can sort below preflight; prose rules go in `components` with `:where()`
- [Legal content tokens](legal-content-tokens.md) — `{{SUPPORT_EMAIL}}` in legal Markdown, frontmatter comments, the analytics-copy guard, and why “deleting the app deletes drafts” isn’t claimed
- [Press kit zip](press-kit-zip.md) — page and zip README share src/lib/press.ts + press.json; the script regex-reads config.ts; icon renders are committed (`--force` to redo)
- [In-text links](in-text-links.md) — one underline treatment: `link-inline` on markup links, `text-links` on Markdown wrappers; standalone › links stay hover-only
