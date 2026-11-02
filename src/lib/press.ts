// Press kit logic shared by the /press page and the build-time zip
// (scripts/generate-press-kit-zip.js), so the two can't drift (spec §11).
// Both read src/data/press.json; Status and Distribution follow the release
// state (spec §8). Erasable TypeScript only: node --test and the zip script
// run this file directly with Node's type stripping.
import type { ReleaseState } from './config-guard.ts';

export interface PressData {
  lead: string;
  descriptions: { short: string; long: string };
  facts: {
    appName: string;
    developer: string;
    platform: string;
    minimumOS: string;
    category: string;
    website: string;
  };
  /** The Icon Composer exports, served from public/press/icons/ and zipped under icons/. */
  icons: { name: string; file: string; alt: string }[];
  iconLabel: string;
  iconGuidelines: string[];
  /** Served from public/press/key-art/ and zipped under key-art/. */
  keyArt: { file: string; title: string; label: string; alt: string };
  /** “The name”: the only place the site explains tesser + clip (spec §11). */
  name: { title: string; text: string };
  screenshots: { file: string; caption: string }[];
  colors: { name: string; hex: string; use: string }[];
}

export interface Fact {
  label: string;
  value: string;
  href?: string;
}

/** Fact sheet “Status” (spec §8). */
export function pressStatus(state: ReleaseState, versionLabel: string): string {
  switch (state) {
    case 'comingSoon':
      return 'Coming soon';
    case 'beta':
      return `Beta on TestFlight (${versionLabel})`;
    case 'released':
      return 'Available on the Mac App Store';
  }
}

/** Fact sheet “Distribution” (spec §8). */
export function pressDistribution(state: ReleaseState): string {
  return state === 'beta' ? 'Mac App Store (TestFlight beta)' : 'Mac App Store';
}

/** The fact sheet rows, in order. There is no price row (spec §11). */
export function pressFacts(press: PressData, state: ReleaseState, versionLabel: string): Fact[] {
  const { facts } = press;
  return [
    { label: 'App name', value: facts.appName },
    { label: 'Developer', value: facts.developer },
    { label: 'Platform', value: facts.platform },
    { label: 'Minimum OS', value: facts.minimumOS },
    { label: 'Status', value: pressStatus(state, versionLabel) },
    { label: 'Category', value: facts.category },
    { label: 'Distribution', value: pressDistribution(state) },
    { label: 'Website', value: facts.website.replace(/^https?:\/\//, ''), href: facts.website },
  ];
}

export interface ReleaseInfo {
  releaseState: ReleaseState;
  versionLabel: string;
  supportEmail: string;
}

/**
 * Reads RELEASE_STATE, VERSION_LABEL and SUPPORT_EMAIL out of the source of
 * src/config.ts. The zip script can't import config.ts (it runs the build-time
 * guards and uses extensionless imports), so it reads the constants the way
 * scripts/check-links.js reads APP_HELP_PATHS.
 */
export function readReleaseInfo(configSource: string): ReleaseInfo {
  const read = (name: string): string => {
    const match = configSource.match(new RegExp(`export const ${name}(?::[^=]+)?\\s*=\\s*'([^']*)'`));
    if (!match) throw new Error(`press: could not read ${name} from src/config.ts`);
    return match[1];
  };
  const releaseState = read('RELEASE_STATE');
  if (releaseState !== 'comingSoon' && releaseState !== 'beta' && releaseState !== 'released') {
    throw new Error(`press: unknown RELEASE_STATE '${releaseState}'`);
  }
  return { releaseState, versionLabel: read('VERSION_LABEL'), supportEmail: read('SUPPORT_EMAIL') };
}

function heading(text: string, underline: string): string {
  return `${text}\n${underline.repeat([...text].length)}`;
}

/** README.txt for the press kit zip (spec §11). */
export function renderPressReadme(press: PressData, info: ReleaseInfo): string {
  const facts = pressFacts(press, info.releaseState, info.versionLabel);
  const width = Math.max(...facts.map((fact) => fact.label.length)) + 2;
  const factLines = facts.map((fact) => `${`${fact.label}:`.padEnd(width)}${fact.href ?? fact.value}`);
  const pressPage = `${press.facts.website.replace(/\/$/, '')}/press`;

  return [
    heading(`${press.facts.appName} Press Kit`, '='),
    '',
    press.lead,
    '',
    heading('Fact sheet', '-'),
    ...factLines,
    '',
    heading('Short description', '-'),
    press.descriptions.short,
    '',
    heading('Long description', '-'),
    press.descriptions.long,
    '',
    heading('Contents', '-'),
    `icons/        App icon: the ${press.icons.length} Icon Composer exports at 1024 px, plus 512 px renders of Default and Dark (PNG)`,
    `key-art/      ${press.keyArt.title} key art, ${press.keyArt.label.replace(' · ', ' (')})`,
    'screenshots/  App screenshots (PNG)',
    '',
    heading(press.name.title, '-'),
    press.name.text,
    '',
    heading('Icon usage guidelines', '-'),
    ...press.iconGuidelines.map((line) => `- ${line}`),
    '',
    heading('Brand colors', '-'),
    ...press.colors.map((color) => `${color.hex}  ${color.name} (${color.use})`),
    '',
    heading('Contact', '-'),
    `For press questions, review copies or interviews, email ${info.supportEmail}.`,
    `Press page: ${pressPage}`,
    '',
  ].join('\n');
}
