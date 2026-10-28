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
	'/rental',
	'/services',
	'/videos',
	'/privacy',
	'/cookies',
];

// Utility/WooCommerce pages the headless frontend has no use for in search.
export const NOINDEX_PATHS = ['/shop', '/cart', '/checkout', '/my-account'];

// ponytail: draft meta descriptions for the Next-only pages, not client copy —
// have the client approve or replace them. WP content uses its excerpt.
export const PAGE_DESCRIPTIONS = {
	'/about': {
		es: 'Conoce al equipo, las instalaciones y la forma de trabajar de Rectángulo, productora audiovisual en Guadalajara.',
		en: 'Meet the team, the facilities and the way of working of Rectángulo, an audiovisual production company in Guadalajara.',
	},
	'/contact': {
		es: 'Cuéntanos tu proyecto. Contacta a Rectángulo, productora audiovisual en Guadalajara, México.',
		en: 'Tell us about your project. Contact Rectángulo, an audiovisual production company in Guadalajara, Mexico.',
	},
	'/projects': {
		es: 'Proyectos de Rectángulo: contenido comercial, branded content y narrativa audiovisual.',
		en: 'Rectángulo projects: commercial content, branded content and audiovisual storytelling.',
	},
	'/projects/archive': {
		es: 'Archivo de proyectos de Rectángulo, productora audiovisual en Guadalajara.',
		en: 'Rectángulo project archive, an audiovisual production company in Guadalajara.',
	},
	'/rental': {
		es: 'Renta de equipo audiovisual de Rectángulo en Guadalajara.',
		en: 'Audiovisual equipment rental by Rectángulo in Guadalajara.',
	},
	'/services': {
		es: 'Servicios de producción audiovisual de Rectángulo, de la idea a la entrega final.',
		en: 'Audiovisual production services by Rectángulo, from the idea to the final delivery.',
	},
	'/videos': {
		es: 'Motion y video de Rectángulo: una selección de nuestro trabajo en movimiento.',
		en: 'Motion and video by Rectángulo: a selection of our work in motion.',
	},
	'/privacy': {
		es: 'Aviso de privacidad de Rectángulo.',
		en: 'Rectángulo privacy notice.',
	},
	'/cookies': {
		es: 'Política de cookies de Rectángulo.',
		en: 'Rectángulo cookie policy.',
	},
};

const WP_ORIGIN = new URL(process.env.NEXT_PUBLIC_WORDPRESS_URL || SITE_URL).origin;

export const isTranslated = (path) => TRANSLATED_PATHS.includes(path);

// "/about" + "en" -> "/en/about"; es (default locale) has no prefix.
export const localePath = (path, locale) =>
	locale === 'en' ? `/en${path === '/' ? '' : path}` : path;

export const absoluteUrl = (path, locale = 'es') => `${SITE_URL}${localePath(path, locale)}`;

// A WP page URL or uri (relative, or on the backend origin) -> the frontend
// equivalent. Other origins come back untouched. Not for /wp-content/ assets:
// those only exist on the backend.
export function toFrontendUrl(url) {
	if (!url) return null;
	try {
		const { origin, pathname, search, hash } = new URL(url, WP_ORIGIN);
		return origin === WP_ORIGIN ? `${SITE_URL}${pathname}${search}${hash}` : url;
	} catch {
		return null;
	}
}

// Backend-domain links inside WP post content -> relative frontend links.
const BACKEND_LINK = new RegExp(
	`href=(["'])${WP_ORIGIN.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?=[/?#"'])(?!/wp-content)/?`,
	'g'
);
export const rewriteContentLinks = (html) => html?.replace(BACKEND_LINK, 'href=$1/') ?? html;

export function plainText(html, max = 160) {
	const named = {
		nbsp: ' ',
		amp: '&',
		quot: '"',
		lt: '<',
		gt: '>',
		hellip: '…',
		rsquo: '’',
		lsquo: '‘',
		ndash: '–',
		mdash: '—',
	};
	const text = (html ?? '')
		.replace(/<[^>]*>/g, ' ')
		.replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(code))
		.replace(/&([a-z]+);/g, (m, name) => named[name] ?? m)
		.replace(/\s+/g, ' ')
		.trim();
	return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

export { LOCALES };
