import { LOCALES } from '../i18n';

// Frontend origin. Stage: https://rectangulo-com-mx.vercel.app, prod:
// https://rectangulo.com.mx — set per Vercel environment.
export const SITE_URL = (
	process.env.NEXT_PUBLIC_SITE_URL || 'https://rectangulo-com-mx.vercel.app'
).replace(/\/$/, '');

// Fails safe: anything that isn't explicitly production is noindex + Disallow.
export const INDEXABLE = process.env.NEXT_PUBLIC_SITE_ENV === 'production';

export const SITE_NAME = 'Rectángulo';

export const OG_LOCALES = { es: 'es_MX', en: 'en_US' };

// ponytail: reuses the HOME statement (pages/index.js) — swap for the
// client's real meta descriptions, ideally per page.
export const DEFAULT_DESCRIPTION = {
	es: 'Somos una productora audiovisual especializada en contenido comercial, branded content y narrativa.',
	en: 'We are an audiovisual production company specialized in commercial content, branded content and narrative.',
};

// Next pages (pages/*.js) that exist in both locales. Everything else is WP
// content, which only has one language, so /en/<it> is a duplicate of the es
// URL (canonical → es, no hreflang).
export const TRANSLATED_PATHS = [
	'/',
	'/about',
	'/contact',
	'/projects',
	'/projects/archive',
	'/projects',
	'/rental',
	'/services',
	'/videos',
	'/privacy',
	'/cookies',
];

const WP_ORIGIN = new URL(process.env.NEXT_PUBLIC_WORDPRESS_URL || SITE_URL).origin;

export const isTranslated = (path) => TRANSLATED_PATHS.includes(path);

// "/about" + "en" -> "/en/about"; es (default locale) has no prefix.
export const localePath = (path, locale) =>
	locale === 'en' ? `/en${path === '/' ? '' : path}` : path;

export const absoluteUrl = (path, locale = 'es') => `${SITE_URL}${localePath(path, locale)}`;

// Any page URL coming from WP (uri, link, ...) -> the frontend equivalent.
// Not for /wp-content/ assets: those only exist on the backend.
export function toFrontendUrl(url) {
	if (!url) return null;
	try {
		const { pathname, search, hash } = new URL(url, WP_ORIGIN);
		return `${SITE_URL}${pathname}${search}${hash}`;
	} catch {
		return null;
	}
}

// Backend-domain links inside WP post content -> relative frontend links.
export const rewriteContentLinks = (html) =>
	html?.replaceAll(new RegExp(`href=(["'])${WP_ORIGIN}(?!/wp-content)`, 'g'), 'href=$1') ?? html;

export function plainText(html, max = 160) {
	const text = (html ?? '')
		.replace(/<[^>]*>/g, ' ')
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&#8217;|&rsquo;/g, '’')
		.replace(/\s+/g, ' ')
		.trim();
	return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

export { LOCALES };
