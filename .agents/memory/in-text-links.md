# In-text links use `link-inline` / `text-links`

Recorded 2026-11-01 (QA pass, #7).

- Links inside running text are underlined so colour isn’t the only signal (spec §13; Lighthouse `link-in-text-block` drops accessibility to 0.96 without it). The designs don’t show the underline; every wave-1 page had to add it.
- There is one treatment, defined in `src/styles/global.css`: accent colour, 1 px underline at 40 % of the colour, 3 px offset, solid on hover.
  - On an `<a>` written in markup: `class="link-inline"`.
  - For unclassed links in Markdown/MDX output: put `text-links` on a wrapper. `Prose`, `HelpLayout`’s article and `FaqItem`’s answer already do.
- Standalone “more ›” links (with `ChevronIcon`, not inside a sentence) keep `text-brand-accent hover:underline`, as in the designs.
- Don’t add per-page underline rules again.
