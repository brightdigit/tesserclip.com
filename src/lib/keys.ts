// Spells out Mac shortcut glyphs for screen readers: "⇧⌘C" → "Shift Command C".
// Used by the Kbd component. Erasable TypeScript only (run by node --test).

const GLYPHS: Record<string, string> = {
  '⌘': 'Command',
  '⇧': 'Shift',
  '⌥': 'Option',
  '⌃': 'Control',
  '⎋': 'Escape',
  '↩': 'Return',
  '⇥': 'Tab',
  '⌫': 'Delete',
  '⌦': 'Forward Delete',
  '␣': 'Space',
  '←': 'Left Arrow',
  '→': 'Right Arrow',
  '↑': 'Up Arrow',
  '↓': 'Down Arrow',
  '`': 'Grave Accent',
  '?': 'Question Mark',
  ',': 'Comma',
  '.': 'Period',
  '/': 'Slash',
  ';': 'Semicolon',
  '=': 'Equals',
  '-': 'Minus',
  '[': 'Left Bracket',
  ']': 'Right Bracket',
};

const WORDS: Record<string, string> = {
  esc: 'Escape',
  return: 'Return',
  enter: 'Return',
  tab: 'Tab',
  space: 'Space',
  delete: 'Delete',
};

export function spellKeys(keys: string): string {
  const parts: string[] = [];
  // Runs of two or more letters are key names ("Tab", "esc"); everything
  // else is one key per character.
  for (const token of keys.trim().match(/[A-Za-z]{2,}|\S/gu) ?? []) {
    if (token.length > 1) {
      parts.push(WORDS[token.toLowerCase()] ?? token);
    } else {
      parts.push(GLYPHS[token] ?? token.toUpperCase());
    }
  }
  return parts.join(' ');
}
