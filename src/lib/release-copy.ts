// Home page copy and JSON-LD that change with RELEASE_STATE (spec §8, §12).
// Pure functions, so `node --test` covers every state without a build.
// Erasable TypeScript only (no enums), imports with the .ts extension.
import type { ReleaseState } from './config-guard.ts';

export interface ReleaseCopyInput {
  releaseState: ReleaseState;
  showLaunchPill: boolean;
  minMacOS: string; // 'macOS 27'
}

export interface HeroCopy {
  /** Eyebrow pill text, or null when the pill is hidden. */
  pill: string | null;
  /** The line under the hero CTA. */
  requirementLine: string;
}

export function heroCopy({ releaseState, showLaunchPill, minMacOS }: ReleaseCopyInput): HeroCopy {
  const requires = `Requires ${minMacOS} or later.`;
  switch (releaseState) {
    case 'comingSoon':
      return { pill: 'Coming soon to the Mac App Store', requirementLine: `Coming soon to the Mac App Store. ${requires}` };
    case 'beta':
      return { pill: 'Now in beta on TestFlight', requirementLine: `Coming soon to the Mac App Store. ${requires}` };
    case 'released':
      return { pill: showLaunchPill ? 'New on the Mac App Store' : null, requirementLine: requires };
  }
}

export interface FactsItem {
  label: string;
  /** Present only when the item links somewhere (released: APP_STORE_URL). */
  href?: string;
}

/** The middle item of the home facts strip. */
export function storeFact(releaseState: ReleaseState, appStoreUrl: string): FactsItem {
  if (releaseState === 'released' && appStoreUrl) {
    return { label: 'Available on the Mac App Store', href: appStoreUrl };
  }
  return { label: 'Coming soon to the Mac App Store' };
}

/** JSON-LD downloadUrl: TestFlight in beta, the App Store when released, none before. */
export function downloadUrl(releaseState: ReleaseState, testflightUrl: string, appStoreUrl: string): string | undefined {
  if (releaseState === 'beta') return testflightUrl || undefined;
  if (releaseState === 'released') return appStoreUrl || undefined;
  return undefined;
}

export interface SoftwareApplicationInput {
  releaseState: ReleaseState;
  name: string;
  description: string;
  minMacOS: string;
  siteUrl: string;
  imageUrl: string;
  companyName: string;
  companyUrl: string;
  testflightUrl: string;
  appStoreUrl: string;
}

/** The SoftwareApplication JSON-LD for `/`. No `offers` until a price is set (spec §12, §18.7). */
export function softwareApplication(input: SoftwareApplicationInput): Record<string, unknown> {
  const company = { '@type': 'Organization', name: input.companyName, url: input.companyUrl };
  const url = downloadUrl(input.releaseState, input.testflightUrl, input.appStoreUrl);
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: input.name,
    description: input.description,
    operatingSystem: `${input.minMacOS} or later`,
    applicationCategory: 'UtilitiesApplication',
    author: company,
    publisher: company,
    url: input.siteUrl.endsWith('/') ? input.siteUrl : `${input.siteUrl}/`,
    image: input.imageUrl,
    ...(url ? { downloadUrl: url } : {}),
  };
}
