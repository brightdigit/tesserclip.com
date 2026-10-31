# Agent Notes

A running log of Leo’s corrections and standing always/never directives for this repo.

- **Read this file at the start of every session, before doing any work.**
- **Append proactively.** When Leo corrects you or gives an always/never instruction, add one line here without being asked.
- **One line per entry,** newest at the bottom, starting with the date (`YYYY-MM-DD`).
- **No stale entries.** When a directive supersedes an earlier one, update or remove the old line. Don’t leave both.
- Longer project facts belong in [`memory/`](memory/MEMORY.md), not here.

---

- 2026-10-31 — `.agents/` is the real directory and `.claude` is a symlink to it. `AGENTS.md` is the real file and `CLAUDE.md` is a symlink to it. The spec is `.agents/WEBSITE.md`, the designs are `.agents/designs/`, and memory goes in `.agents/memory/`, never a native or global memory store.
- 2026-10-31 — No analytics for now. No Plausible script by default. Keep the `ANALYTICS` config switch so adding it later is a one-line change, and the privacy page must say the site has no cookies or analytics.
- 2026-10-31 — The site launches in **beta** (`RELEASE_STATE = 'beta'`). `comingSoon` stays supported in code but isn’t the default.
- 2026-10-31 — Agents open PRs and never merge them. Leo reviews and merges.
- 2026-10-31 — Don’t add Claude GitHub workflows (`claude.yml`, `claude-code-review.yml`). The only workflows are deploy and Lighthouse.
- 2026-10-31 — The TestFlight link is a placeholder constant in `src/config.ts`. A production or deploy build must fail while `RELEASE_STATE === 'beta'` and the link is still the placeholder. Filling it in is part of the maintainer go-live issue.
- 2026-10-31 — Help URLs baked into the app (`/help`, `/help/clipboard-permission`) must never 404. Don’t move or rename them, and keep them in the link check’s required paths.
- 2026-10-31 — CI runs on `pull_request` only. The one push trigger is the GitHub Pages deploy on `main`.
- 2026-10-31 — Support is email only (`support@tesserclip.com`) while `REPO_PUBLIC` is `false`. Press reuses the support address, and there is no `press@`.
