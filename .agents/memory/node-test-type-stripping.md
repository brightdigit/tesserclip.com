# `node --test` runs TypeScript directly

Recorded 2026-11-01 (scaffold, #1).

- `make test` (and `prebuild`, so every `make build` and CI build) runs `node --test src/lib/*.test.ts`. There's no test framework or TS compiler: Node 22.18+ and Node 24 strip types natively.
- So files under `src/lib/` must use **erasable TypeScript only**: no `enum`, `namespace`, parameter properties or `import x = require()`. Type-only imports need `type` (`import { type Foo }`).
- Test files import with the `.ts` extension (`./config-guard.ts`). `astro/tsconfigs/base` sets `allowImportingTsExtensions`, so that type-checks. Astro code imports without the extension, which Vite resolves.
- `src/config.ts` reads `process.env` and `node:fs`, so it's build-time only. Never import it from a client `<script>`.
- `scripts/check-links.js` reads `APP_HELP_PATHS` out of `src/config.ts` with a regex rather than importing it. Keep that constant on one line.
