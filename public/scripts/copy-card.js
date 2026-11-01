// Progressive enhancement for CopyCard (src/components/CopyCard.astro).
// Served from 'self' so it passes the CSP. Without it, the buttons stay hidden.
(() => {
  if (!navigator.clipboard || !window.isSecureContext) return;
  for (const card of document.querySelectorAll('[data-copy-card]')) {
    const button = card.querySelector('[data-copy-button]');
    const text = card.querySelector('[data-copy-text]');
    const status = card.querySelector('[data-copy-status]');
    if (!button || !text) continue;
    let timer;
    button.hidden = false;
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(text.textContent.trim());
        button.textContent = 'Copied';
        if (status) status.textContent = 'Copied to the clipboard.';
      } catch {
        button.textContent = 'Copy failed';
        if (status) status.textContent = 'Couldn’t copy. Select the text and copy it instead.';
      }
      clearTimeout(timer);
      timer = setTimeout(() => {
        button.textContent = 'Copy';
        if (status) status.textContent = '';
      }, 2000);
    });
  }
})();
