// Pure helpers for the legal pages (spec §9.4, §9.6). ProseLayout and the
// privacy/terms pages use them; `node --test` covers them in legal.test.ts.
// Erasable TypeScript only (see .agents/memory/node-test-type-stripping.md).

/**
 * Formats a frontmatter date as “October 31, 2026”. Frontmatter dates like
 * `2026-10-31` parse as UTC midnight, so format in UTC to avoid showing the
 * day before in western time zones.
 */
export function formatLegalDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

/**
 * Replaces `{{NAME}}` tokens in rendered Markdown HTML with values from
 * src/config.ts, so legal copy never hard-codes an address. Handles the
 * percent-encoded form Markdown produces inside link URLs
 * (`mailto:%7B%7BNAME%7D%7D`). Throws on a token with no value, so a typo
 * fails the build instead of shipping “{{SUPPORT_EMIAL}}”.
 */
export function fillTokens(html: string, tokens: Readonly<Record<string, string>>): string {
  return html.replace(/\{\{([A-Z_]+)\}\}|%7B%7B([A-Z_]+)%7D%7D/g, (_match, plain, encoded) => {
    const name: string = plain ?? encoded;
    const value = tokens[name];
    if (value === undefined) {
      throw new Error(`Unknown token {{${name}}} in legal content`);
    }
    return value;
  });
}
