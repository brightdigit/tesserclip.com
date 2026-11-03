# Restate Tailwind’s layer order in component `<style>` blocks that use `@layer`

Recorded 2026-11-01 (help pages, #3).

- Astro can inline a small `<style is:global>` block into the page **before** the Tailwind stylesheet link.
- The first `@layer` statement a browser sees fixes the layer order. A block that opens with `@layer components { … }` therefore makes `components` the *lowest* layer, so Tailwind’s preflight (`base`) beats it: list styles, table and heading margins silently disappear.
- Fix: start such a block with `@layer theme, base, components, utilities;` (Tailwind 4’s order), then the `@layer components { … }` rules. `HelpLayout.astro` does this for `.help-prose`.
- Why use the layer at all: unlayered CSS (like the scaffold’s scoped `Prose` styles) beats every Tailwind utility regardless of specificity, so prose rules that components must override belong in `components`, with `:where()` selectors.
