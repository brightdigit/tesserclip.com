import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fillTokens, formatLegalDate } from './legal.ts';

test('formatLegalDate writes the long US date', () => {
  assert.equal(formatLegalDate(new Date('2026-10-31')), 'October 31, 2026');
});

test('formatLegalDate keeps the frontmatter day in any time zone', () => {
  // UTC midnight is still October 30 in America/Detroit; the label must not slip.
  assert.equal(formatLegalDate(new Date('2026-10-31T00:00:00Z')), 'October 31, 2026');
});

test('fillTokens replaces plain and percent-encoded tokens', () => {
  const html =
    '<p>Email <a href="mailto:%7B%7BSUPPORT_EMAIL%7D%7D">{{SUPPORT_EMAIL}}</a>.</p>';
  assert.equal(
    fillTokens(html, { SUPPORT_EMAIL: 'support@tesserclip.com' }),
    '<p>Email <a href="mailto:support@tesserclip.com">support@tesserclip.com</a>.</p>',
  );
});

test('fillTokens leaves HTML without tokens alone', () => {
  assert.equal(fillTokens('<p>Nothing {here}.</p>', {}), '<p>Nothing {here}.</p>');
});

test('fillTokens throws on an unknown token', () => {
  assert.throws(() => fillTokens('{{SUPPORT_EMIAL}}', { SUPPORT_EMAIL: 'x' }), /SUPPORT_EMIAL/);
});
