# AGENTS.md

Guidance for coding agents working in this repository. `CLAUDE.md` is a symlink to this file, and `.claude/` is a symlink to `.agents/`.

## Project

This is the marketing and help website for **TesserClip**, BrightDigit’s macOS app that opens straight to the text you last copied, so you can fix it before you paste it. The site is static and deployed to GitHub Pages at **tesserclip.com**.

- **Spec (source of truth):** [`.agents/WEBSITE.md`](.agents/WEBSITE.md). Read it before you build anything. It covers pages, copy, states, SEO, accessibility, CI and the QA checklist.
- **Designs:** [`.agents/designs/`](.agents/designs/README.md), a PNG and standalone HTML per screen. The design HTML’s visible text is the normative copy unless the spec lists a change.
- **App facts:** `brightdigit/TesserClip` `.claude/SPEC.md` and `CHANGELOG.md`. The site must never claim more than the app SPEC says.
- **App contract:** shipped app builds open `https://tesserclip.com/help` and `https://tesserclip.com/help/clipboard-permission`. Those URLs must never 404.

## Stack

- **Astro 7** (static output, `build.format: 'directory'`) with **Tailwind CSS 4** through `@tailwindcss/vite`
- `@astrojs/sitemap` and `@astrojs/mdx`. Help articles and legal pages are content collections.
- TypeScript in strict mode
- **Node 24** pinned in `.mise.toml`
- Lighthouse CI (`lighthouserc.json`) and an internal link checker (`scripts/check-links.js`)
- No backend, no CMS, no analytics, no web fonts and no third-party requests

The setup is copied from `brightdigit/atleast.app`. The page set, App Store badges and terms follow `brightdigit/month.bar`.

## Commands

Always go through `make` (or `mise exec -- npm …`). Don’t call `npm` directly, because it may not be on PATH.

| Command | What it does |
|---|---|
| `make install` | Installs dependencies |
| `make dev` | Starts the dev server |
| `make build` | Production build to `dist/`. The prebuild step generates the press kit zip. Config guards only warn here. |
| `make build-production` | The same build with `SITE_DEPLOY=1`, so config guards are fatal (TestFlight placeholder, App Store ID) |
| `make preview` | Serves `dist/` locally |
| `make check-links` | Checks internal links, fragments and required paths in `dist/`. Run it after `make build`. |
| `make lighthouse` | Runs Lighthouse CI against `dist/` |
| `make clean` | Removes `dist/`, `.astro/` and generated downloads |

## Structure

```
src/config.ts            release state, TestFlight/App Store links, emails, switches (the only place for these)
src/content/help/        /help and /help/clipboard-permission (MDX)
src/content/legal/       privacy.md, terms.md
src/data/                shortcuts.ts, press.json, known-issues.ts
src/components/          Nav, Footer, BaseHead, PrimaryCta, Kbd, … (spec §7)
src/layouts/             BaseLayout, ProseLayout, HelpLayout
src/pages/               index, help/, privacy, support, terms, press, 404
public/                  CNAME, robots.txt, icons, badges, press originals
scripts/                 check-links.js, generate-press-kit-zip.js
.agents/                 WEBSITE.md, designs/, agent-notes.md, memory/
.github/workflows/       deploy.yml, lighthouse.yml (no claude workflows)
```

## Memory & Corrections Convention

These two in-repo files are the source of truth for how to work here. Both are committed.

- **[`.agents/agent-notes.md`](.agents/agent-notes.md)** is an append-only log of Leo’s corrections and always/never directives. It has one dated line per entry, newest at the bottom. Append to it **proactively**, without being asked, whenever you get a correction or a standing instruction. When a directive supersedes an earlier one, update or remove the old line.
- **[`.agents/memory/`](.agents/memory/MEMORY.md)** is project memory. Each fact (a decision, constraint, gotcha or context you can’t get from the code or git history) gets its own file, plus one line in `.agents/memory/MEMORY.md`. Update or delete memories that turn out to be wrong.
- **Read both before doing any work.**
- **Never** store project memory in a native or global memory system, such as `~/.claude/projects/…/memory/`. Write it here so it’s versioned and shared.

## Workflow

- **Integration branch:** `v0.26.1101`. Work is split into GitHub issues (milestone `v0.26.1101` if it exists). Each issue body names its wave, dependencies, branch and PR base.
- **One branch per issue,** named `<issue#>-<slug>`, in its own git worktree.
- **Stacked PRs.** The scaffold PR targets `v0.26.1101`. Dependent issues branch from the parent issue’s branch and open their PR against it. Don’t wait at wave boundaries for merges.
- **Agents open PRs and never merge them.** Leo reviews and merges.
- **Before opening a PR:**
  1. Run `make build` and `make check-links`.
  2. Take Playwright screenshots of your pages (1440 and 390 wide, light and dark) and compare them with the design PNGs.
  3. Put the screenshots and any differences in the PR description.
- **Keep parallel branches merge-clean.** Put new UI in new files. Shared files (`config.ts`, `Nav`, `Footer`, `BaseLayout`, `global.css`) get additive edits only.
- **Don’t add** `claude.yml` or `claude-code-review.yml` workflows, and don’t add analytics.
- Push with `git push -u origin HEAD`. Never commit secrets. The repo will become public.

## Copy rules

- Use plain, short sentences in a calm voice with no hype. Use the app’s own words: window, draft, Copy All, New Window from Clipboard.
- Use typographic punctuation: curly quotes and apostrophes (’ “ ”), `…` (not three dots) and `▸` for menu paths (**Edit ▸ Substitutions**).
- Write shortcuts as Mac key glyphs in `<kbd>` chips (⌘ ⇧ ⌥ ⌃), e.g. ⇧⌘C.
- **Never overclaim.** Describe only what the app SPEC says v1 does. Never imply clipboard history, auto-paste, a global hotkey, a menu bar mode, Markdown, saving files or font settings.
- Privacy copy must match reality: the app sends nothing and has no analytics, and the site has no cookies and no analytics.
- Use “BrightDigit” for display and “BrightDigit, LLC” only in the Terms.
- The footer line is `© 2026 BrightDigit. All rights reserved.`
- The only email is `support@tesserclip.com`, which also covers press.
- Use English only.
