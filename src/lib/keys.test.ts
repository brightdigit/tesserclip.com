import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spellKeys } from './keys.ts';

test('spells modifier glyphs and letters', () => {
  assert.equal(spellKeys('⇧⌘C'), 'Shift Command C');
  assert.equal(spellKeys('⌥⇧⌘V'), 'Option Shift Command V');
  assert.equal(spellKeys('⌃⌘q'), 'Control Command Q');
});

test('spells punctuation keys', () => {
  assert.equal(spellKeys('⌘`'), 'Command Grave Accent');
  assert.equal(spellKeys('⌘?'), 'Command Question Mark');
});

test('keeps named keys as words', () => {
  assert.equal(spellKeys('⌘Tab'), 'Command Tab');
  assert.equal(spellKeys('esc'), 'Escape');
  assert.equal(spellKeys('return'), 'Return');
  assert.equal(spellKeys('⎋'), 'Escape');
});
