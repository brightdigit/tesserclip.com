---
title: Privacy Policy
description: TesserClip keeps your text on your Mac. No account, no analytics and no tracking in the app, and no cookies on this website.
lastUpdated: 2026-11-03
dateLabel: Last updated
# Facts behind these claims (spec §9.4), checked in brightdigit/TesserClip on
# 2026-10-31: drafts persist in the app container and closing a window removes
# its draft (AppModel.windowWillClose → DraftStore.remove); the app has no
# networking, analytics or third-party SDK code. Re-check before changing them.
# {{SUPPORT_EMAIL}} below is filled from src/config.ts at build time.
---

## What TesserClip reads

**Clipboard text, when it opens a window.** Opening a window is the only time TesserClip reads what’s on the clipboard. macOS asks for your permission first; see [Clipboard permission](/help/clipboard-permission/).

**Whether there’s new text.** While TesserClip is the active app, it checks whether the clipboard has changed and holds text, without reading the text, so it can show the new‑text dot.

**Which app you copied from.** To show “Safari · Oct 27 at 1:49 PM” under a window’s title, TesserClip notes which app was in front when the clipboard changed. It doesn’t read anything inside that app.

## What TesserClip stores

So your windows come back after you quit, TesserClip saves each open window’s draft in its own container on your Mac: the text, the text it opened with, and where and when it was copied. It also remembers your <span class="menu-path">Edit ▸ Substitutions</span> choices. When you close a window, its draft is removed.

This data never leaves your Mac.

## What TesserClip sends

Nothing. TesserClip has no account, no server and no analytics. Choosing <span class="menu-path">Help ▸ TesserClip Help</span> opens this website in your web browser.

## Apple

TesserClip is distributed through the Mac App Store and, during the beta, TestFlight. If you’ve chosen to share crash data and analytics with app developers, Apple may give BrightDigit crash reports and anonymous usage numbers. TestFlight also sends us any feedback you choose to submit. Apple’s handling of that data is covered by [Apple’s Privacy Policy](https://www.apple.com/legal/privacy/).

## This website

tesserclip.com is a static website hosted on GitHub Pages. It doesn’t use cookies or ask for personal information.

It counts visits with [Plausible](https://plausible.io/), a privacy‑friendly analytics service that doesn’t use cookies or persistent identifiers. Plausible records the page you visited, the site that linked to it, your browser, operating system, device type and country, and clicks on links to other sites, such as TestFlight. It doesn’t store your IP address, and none of it is used for advertising or to follow you across other sites.

## Changes

If this policy changes, we’ll update it here and change the date at the top.

## Contact

Questions about privacy? Email [{{SUPPORT_EMAIL}}](mailto:{{SUPPORT_EMAIL}}).
