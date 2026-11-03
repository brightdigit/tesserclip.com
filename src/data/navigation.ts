// Site navigation, shared by Nav and Footer. Internal links use trailing-slash paths.
import { COMPANY_URL } from '../config';

export interface NavLink {
  href: string;
  label: string;
}

/** Nav: Help · Press · Privacy · Terms · Support (spec §7). */
export const NAV_LINKS: readonly NavLink[] = [
  { href: '/help/', label: 'Help' },
  { href: '/press/', label: 'Press' },
  { href: '/privacy/', label: 'Privacy' },
  { href: '/terms/', label: 'Terms' },
  { href: '/support/', label: 'Support' },
];

/** Footer link row: Help · Press Kit · Privacy Policy · Terms of Use · Support · brightdigit.com. */
export const FOOTER_LINKS: readonly NavLink[] = [
  { href: '/help/', label: 'Help' },
  { href: '/press/', label: 'Press Kit' },
  { href: '/privacy/', label: 'Privacy Policy' },
  { href: '/terms/', label: 'Terms of Use' },
  { href: '/support/', label: 'Support' },
  { href: COMPANY_URL, label: 'brightdigit.com' },
];
