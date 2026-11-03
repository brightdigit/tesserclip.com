# Agent Notes

A running log of Leo’s corrections and standing always/never directives for this repo.

- **Read this file at the start of every session, before doing any work.**
- **Append proactively.** When Leo corrects you or gives an always/never instruction, add one line here without being asked.
- **One line per entry,** newest at the bottom, starting with the date (`YYYY-MM-DD`).
- **No stale entries.** When a directive supersedes an earlier one, update or remove the old line. Don’t leave both.
- Longer project facts belong in [`memory/`](memory/MEMORY.md), not here.

---

- 2026-10-31 — `.agents/` is the real directory and `.claude` is a symlink to it. `AGENTS.md` is the real file and `CLAUDE.md` is a symlink to it. The spec is `.agents/WEBSITE.md`, the designs are `.agents/designs/`, and memory goes in `.agents/memory/`, never a native or global memory store.
- 2026-10-31 — The site launches in **beta** (`RELEASE_STATE = 'beta'`). `comingSoon` stays supported in code but isn’t the default.
- 2026-10-31 — Agents open PRs and never merge them. Leo reviews and merges.
- 2026-10-31 — Don’t add Claude GitHub workflows (`claude.yml`, `claude-code-review.yml`). The only workflows are deploy and Lighthouse.
- 2026-11-03 — The public TestFlight link is `https://testflight.apple.com/join/WX95KgBZ`, set in `TESTFLIGHT_URL` in `src/config.ts` (it works once Apple approves the beta). Keep the placeholder guard: a production or deploy build must fail if `RELEASE_STATE === 'beta'` and the link is ever reset to `TESTFLIGHT_PLACEHOLDER`.
- 2026-10-31 — Help URLs baked into the app (`/help`, `/help/clipboard-permission`) must never 404. Don’t move or rename them, and keep them in the link check’s required paths.
- 2026-10-31 — CI runs on `pull_request` only. The one push trigger is the GitHub Pages deploy on `main`.
- 2026-10-31 — Support is email only (`support@tesserclip.com`) while `REPO_PUBLIC` is `false`. Press reuses the support address, and there is no `press@`.
- 2026-11-02 — Visual direction is the round-2 A1 Tesseract hybrid per REVIEW.md: static dark hero card, system fonts, no hero animation; A2 Depth stack and A3 Unfold were rejected.
- 2026-11-03 — Hide the site from search engines for now: keep `SEARCH_INDEXING = false` (every page `noindex, nofollow`) until Leo says to go public. Don’t block crawling in `robots.txt`.
- 2026-11-03 — The site uses Plausible (`ANALYTICS = { provider: 'plausible', domain: 'tesserclip.com' }`, `script.outbound-links.js`, as on atleast.app). The privacy page must say so: cookieless, no stored IP and no advertising. Supersedes the 2026-10-31 “no analytics” note.
