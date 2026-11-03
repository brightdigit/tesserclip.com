import { test } from 'node:test';
import assert from 'node:assert/strict';
import { issuesUrl, knownIssuesHeading, supportVisibility } from './support.ts';

test('beta shows the join-the-beta FAQ and the TestFlight card', () => {
  assert.deepEqual(supportVisibility('beta', false), { joinBetaFaq: true, testflightCard: true, githubCard: false });
});

test('released and coming soon hide the beta-only items', () => {
  for (const state of ['released', 'comingSoon'] as const) {
    const v = supportVisibility(state, false);
    assert.equal(v.joinBetaFaq, false);
    assert.equal(v.testflightCard, false);
  }
});

test('the GitHub Issues card follows REPO_PUBLIC only', () => {
  assert.equal(supportVisibility('beta', false).githubCard, false);
  assert.equal(supportVisibility('released', false).githubCard, false);
  assert.equal(supportVisibility('beta', true).githubCard, true);
  assert.equal(supportVisibility('released', true).githubCard, true);
});

test('known issues heading reads the version', () => {
  assert.equal(knownIssuesHeading({ version: '1.0 beta 1', items: ['A bug'] }), 'Known issues in 1.0 beta 1');
});

test('known issues section is hidden when the list is empty', () => {
  assert.equal(knownIssuesHeading({ version: '1.0 beta 1', items: [] }), null);
  assert.equal(knownIssuesHeading({ version: '1.0 beta 1', items: ['  '] }), null);
});

test('issues URL is the repo’s /issues page', () => {
  assert.equal(issuesUrl('https://github.com/brightdigit/TesserClip'), 'https://github.com/brightdigit/TesserClip/issues');
  assert.equal(issuesUrl('https://github.com/brightdigit/TesserClip/'), 'https://github.com/brightdigit/TesserClip/issues');
});
