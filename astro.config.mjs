// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://tesserclip.com',
  trailingSlash: 'ignore',
  // /help/clipboard-permission → help/clipboard-permission/index.html. Keep it:
  // GitHub Pages then answers /help with a 301 to /help/ (the app's help URLs
  // must never 404; see .agents/memory/app-help-urls.md).
  build: { format: 'directory' },
  // Astro 7 defaults compressHTML to 'jsx', which strips whitespace between
  // inline elements. `true` keeps the whitespace-safe minification.
  compressHTML: true,
  integrations: [mdx(), sitemap({ filter: (page) => !page.endsWith('/404/') })],
  vite: { plugins: [tailwindcss()] },
});
