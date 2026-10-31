# Go-live plan

Agreed with Leo on 2026-10-31 (decisions D6, D17, D28).

1. Agents build everything on `v0.26.1101` through stacked PRs. The repo stays **private**, and the deploy job only runs on `main`.
2. Leo merges the PRs, then runs the maintainer go-live issue:
   - Make `brightdigit/tesserclip.com` **public** (D6).
   - Enable Pages with **GitHub Actions** as the source, set the custom domain `tesserclip.com` (`public/CNAME` already ships), and enforce HTTPS.
   - DNS: apex A records `185.199.108–111.153` and AAAA `2606:50c0:8000–8003::153`, plus `www` CNAME → `brightdigit.github.io`.
   - Set `TESTFLIGHT_URL` in `src/config.ts` to the public TestFlight link. Deploy builds fail while it’s the placeholder.
   - Merge `v0.26.1101` into `main`. The push deploys.
   - Check that `https://tesserclip.com/help` and `/help/clipboard-permission` load, and that `support@tesserclip.com` receives mail.
   - Set the App Store Connect Privacy (`/privacy`), Support (`/support`) and Marketing (`/`) URLs.
3. The real assets (Icon Composer exports, real screenshots, OG image) come in a separate maintainer issue. They can land before or after go-live.
