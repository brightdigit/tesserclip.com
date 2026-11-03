// The home page’s 24 px stroke icon bodies, copied from .agents/designs/01-home.html.
// HomeIcon.astro wraps them in the shared <svg> attributes.
export const HOME_ICONS = {
  clipboard:
    '<rect x="5" y="4" width="14" height="17" rx="2.5"/><rect x="9" y="2.5" width="6" height="3.2" rx="1.2"/><path d="M8.5 11h7M8.5 14.5h4.5"/>',
  windows:
    '<rect x="3" y="8" width="13" height="12" rx="2"/><path d="M7.5 8V6a2 2 0 0 1 2-2H19a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3"/><path d="M3 11.5h13"/>',
  text: '<path d="M4 6.5h9M8.5 6.5V18M14.5 11h6M17.5 11v7"/>',
  copy: '<rect x="8.5" y="8.5" width="11.5" height="12.5" rx="2"/><path d="M15.5 8.5V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9.5a2 2 0 0 0 2 2h2.5"/>',
  shield:
    '<path d="M12 3.5 19 6v5.5c0 4.2-3 7.6-7 9-4-1.4-7-4.8-7-9V6l7-2.5Z"/><path d="M12 8.5v4.2"/><circle cx="12" cy="15.8" r=".6" fill="currentColor"/>',
  newText:
    '<rect x="4" y="5" width="12.5" height="16" rx="2.5"/><path d="M7.5 11.5h5.5M7.5 15h3.5"/><circle cx="18.2" cy="5.8" r="3.3" fill="currentColor" stroke="none"/>',
  restore: '<path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3"/><path d="M4.5 4.5v4h4"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10.5" rx="2.2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
  noAccount: '<circle cx="12" cy="8" r="3.6"/><path d="M5 20a7 7 0 0 1 14 0"/><path d="M4 4l16 16"/>',
  noTracking:
    '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="2.6"/><path d="M4 4l16 16"/>',
  laptop: '<rect x="4.5" y="5" width="15" height="10.5" rx="1.6"/><path d="M2.5 19h19"/>',
  download: '<path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19.5h14"/>',
  // Copy sources (home §3): a browser window, a terminal prompt, an agent sparkle.
  browser:
    '<rect x="3" y="4.5" width="18" height="15" rx="2.5"/><path d="M3 9h18"/><circle cx="6.2" cy="6.8" r=".55" fill="currentColor"/><circle cx="8.4" cy="6.8" r=".55" fill="currentColor"/>',
  terminal: '<rect x="3" y="4.5" width="18" height="15" rx="2.5"/><path d="M7 10l3 2.5L7 15M12.5 15.5H17"/>',
  agent:
    '<path d="M11 3.5c.6 3.9 2.6 5.9 6.5 6.5-3.9.6-5.9 2.6-6.5 6.5-.6-3.9-2.6-5.9-6.5-6.5 3.9-.6 5.9-2.6 6.5-6.5Z"/><path d="M18 15c.3 1.7 1.1 2.5 2.8 2.8-1.7.3-2.5 1.1-2.8 2.8-.3-1.7-1.1-2.5-2.8-2.8 1.7-.3 2.5-1.1 2.8-2.8Z"/>',
  book: '<path d="M12 6.5C10 5 7 4.5 4 5v13c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5V5c-3-.5-6 0-8 1.5Z"/><path d="M12 6.5V19"/>',
} as const;

export type HomeIconName = keyof typeof HOME_ICONS;
