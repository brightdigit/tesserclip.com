import { test } from 'node:test';
import assert from 'node:assert/strict';
import { breadcrumbList } from './breadcrumbs.ts';

test('builds a BreadcrumbList with 1-based positions and absolute URLs', () => {
  const list = breadcrumbList(
    [
      { name: 'TesserClip', path: '/' },
      { name: 'Help', path: '/help/' },
      { name: 'Clipboard permission', path: '/help/clipboard-permission/' },
    ],
    'https://tesserclip.com',
  );
  assert.deepEqual(list, {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'TesserClip', item: 'https://tesserclip.com/' },
      { '@type': 'ListItem', position: 2, name: 'Help', item: 'https://tesserclip.com/help/' },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Clipboard permission',
        item: 'https://tesserclip.com/help/clipboard-permission/',
      },
    ],
  });
});
