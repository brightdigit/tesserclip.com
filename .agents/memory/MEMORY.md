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
