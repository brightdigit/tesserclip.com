import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SHORTCUT_GROUPS } from '../data/shortcuts.ts';
import { spellKeys } from './keys.ts';

const all = SHORTCUT_GROUPS.flatMap((group) => group.shortcuts);

test('matches the spec §10.1 groups in order', () => {
  assert.deepEqual(
    SHORTCUT_GROUPS.map((group) => [group.title, group.shortcuts.length]),
    [
      ['File and Edit', 10],
      ['Find', 3],
      ['App and windows', 6],
    ],
  );
});

test('never lists Command-comma: the app has no Settings window', () => {
  assert.ok(!all.some((s) => s.keys.includes(',')));
  assert.ok(!all.some((s) => /settings|preferences/i.test(s.command)));
});

test('Copy All is ⇧⌘C and is the only emphasised row', () => {
  assert.deepEqual(
    all.filter((s) => s.emphasis).map((s) => [s.command, s.keys]),
    [['Copy All', '⇧⌘C']],
  );
});

test('every shortcut spells out without raw glyphs', () => {
  for (const { keys } of all) {
    const spelled = spellKeys(keys);
    assert.doesNotMatch(spelled, /[⌘⇧⌥⌃`?]/u, `${keys} → ${spelled}`);
  }
});

test('no shortcut is listed twice', () => {
  assert.equal(new Set(all.map((s) => s.keys)).size, all.length);
});
