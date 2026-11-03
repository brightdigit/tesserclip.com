// The single list of keyboard shortcuts (spec §10.1), grouped by menu. The
// help page's ShortcutTable renders it, and Support links to /help/#shortcuts.
// Source: app SPEC §7 plus the standard shortcuts its QA list relies on
// (⌘G / ⇧⌘G, ⌘M, ⌘`). The app has no Settings window, so never add ⌘,.
// Erasable TypeScript only: src/lib/shortcuts.test.ts runs it under node --test.

export interface Shortcut {
  command: string;
  /** Mac key glyphs, as the Kbd component takes them (“⇧⌘C”). */
  keys: string;
  /** Shown in bold (TesserClip’s own command, Copy All). */
  emphasis?: boolean;
}

export interface ShortcutGroup {
  title: string;
  /** Column in the two-column layout on md and up. */
  column: 1 | 2;
  shortcuts: readonly Shortcut[];
}

export const SHORTCUT_GROUPS: readonly ShortcutGroup[] = [
  {
    title: 'File and Edit',
    column: 1,
    shortcuts: [
      { command: 'New Window from Clipboard', keys: '⌘N' },
      { command: 'Close', keys: '⌘W' },
      { command: 'Undo', keys: '⌘Z' },
      { command: 'Redo', keys: '⇧⌘Z' },
      { command: 'Cut', keys: '⌘X' },
      { command: 'Copy', keys: '⌘C' },
      { command: 'Copy All', keys: '⇧⌘C', emphasis: true },
      { command: 'Paste', keys: '⌘V' },
      { command: 'Paste and Match Style', keys: '⌥⇧⌘V' },
      { command: 'Select All', keys: '⌘A' },
    ],
  },
  {
    title: 'Find',
    column: 2,
    shortcuts: [
      { command: 'Find', keys: '⌘F' },
      { command: 'Find Next', keys: '⌘G' },
      { command: 'Find Previous', keys: '⇧⌘G' },
    ],
  },
  {
    title: 'App and windows',
    column: 2,
    shortcuts: [
      { command: 'Hide TesserClip', keys: '⌘H' },
      { command: 'Hide Others', keys: '⌥⌘H' },
      { command: 'Quit TesserClip', keys: '⌘Q' },
      { command: 'Minimize', keys: '⌘M' },
      { command: 'Cycle through windows', keys: '⌘`' },
      { command: 'TesserClip Help', keys: '⌘?' },
    ],
  },
];
