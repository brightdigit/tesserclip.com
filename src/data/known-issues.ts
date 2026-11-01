// Known issues listed on /support#known (spec §9.5). From the app’s
// CHANGELOG.md 1.0.0-beta.1 (#41–#43), rewritten in user words. #35 (help links
// pointing at an unlaunched site) is left out because this site fixes it.
// Update the list with each beta; an empty `items` hides the section.
import { VERSION_LABEL } from '../config';
import type { KnownIssues } from '../lib/support';

export const KNOWN_ISSUES: KnownIssues = {
  version: VERSION_LABEL,
  items: [
    'After you close a window, the clipboard text it opened with isn’t offered again as new text.',
    'The empty‑window message comes back after you delete all of a window’s text.',
    'If TesserClip can’t save your drafts, it doesn’t tell you yet.',
  ],
};
