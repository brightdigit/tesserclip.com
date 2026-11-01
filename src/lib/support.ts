// Pure rules for what the support page shows (spec §8, §9.5). The page passes
// in the values from src/config.ts and src/data/known-issues.ts.
import type { ReleaseState } from './config-guard.ts';

export interface SupportVisibility {
  /** “How do I join the beta?” in Common questions: beta only. */
  joinBetaFaq: boolean;
  /** The TestFlight feedback contact card: beta only. */
  testflightCard: boolean;
  /** The GitHub Issues contact card: only once the app repo is public (D12/D18). */
  githubCard: boolean;
}

export function supportVisibility(releaseState: ReleaseState, repoPublic: boolean): SupportVisibility {
  const beta = releaseState === 'beta';
  return { joinBetaFaq: beta, testflightCard: beta, githubCard: repoPublic };
}

export interface KnownIssues {
  version: string;
  items: string[];
}

/** The `#known` heading, or `null` when there is nothing to list (the section is hidden). */
export function knownIssuesHeading(knownIssues: KnownIssues): string | null {
  const items = knownIssues.items.filter((item) => item.trim() !== '');
  return items.length > 0 ? `Known issues in ${knownIssues.version}` : null;
}

/** The GitHub issue tracker for the app repo. */
export function issuesUrl(repoUrl: string): string {
  return `${repoUrl.replace(/\/+$/, '')}/issues`;
}
