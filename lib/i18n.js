import { useRouter } from 'next/router';

// ponytail: copy lives inline next to the markup as `{ es, en }` pairs (no
// dictionary files, no i18n lib) — fine for a handful of pages. Spanish is the
// fallback if a pair is missing a locale.
export const LOCALES = ['es', 'en'];

export const pick = (copy, locale) => copy?.[locale] ?? copy?.es;

export function useT() {
	const { locale } = useRouter();
	return (copy) => pick(copy, locale);
}

// "/en/services" -> "/services" (router.push / asPath-style paths are
// locale-less, but hrefs read off rendered <a>s carry the prefix).
export const stripLocale = (path) => path.replace(/^\/en(?=\/|$)/, '') || '/';

// The locale a rendered href points at (default locale has no prefix).
export const localeOf = (path) => (path !== stripLocale(path) ? 'en' : 'es');

// WP menu labels come back in a single language; labels for the known routes
// are translated here by path, anything else falls through to WP's label.
export const NAV_LABELS = {
	'/services': { es: 'Servicios', en: 'Services' },
	'/projects': { es: 'Proyectos', en: 'Projects' },
	'/about': { es: 'Nosotros', en: 'About' },
	'/contact': { es: 'Contacto', en: 'Contact' },
	'/videos': { es: 'Motion', en: 'Motion' },
	'/rental': { es: 'Renta de equipo', en: 'Equipment Rental' },
	'/privacy': { es: 'Privacidad', en: 'Privacy' },
	'/cookies': { es: 'Cookies', en: 'Cookies' },
};

// Routes WP's menu still lists but that no longer have a standalone page —
// Services merged into About (brief: ABOUT - Services Integration), Contact
// merged into Footer (brief: FOOTER - Contact Integration). Filtered out of
// every nav render instead of relying on wp-admin's menu staying in sync.
export const HIDDEN_NAV_PATHS = ['/services', '/contact'];
