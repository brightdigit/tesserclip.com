// Breadcrumb trail helpers for the help pages (spec §7 Breadcrumbs, §12
// BreadcrumbList JSON-LD). Erasable TypeScript only (run by node --test).

export interface Crumb {
  name: string;
  /** Root-absolute, trailing-slash path (“/help/”). */
  path: string;
}

/** schema.org BreadcrumbList for the given trail, with absolute URLs. */
export function breadcrumbList(crumbs: readonly Crumb[], site: string): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: new URL(crumb.path, site).href,
    })),
  };
}
