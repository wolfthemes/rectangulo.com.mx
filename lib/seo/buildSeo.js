import { NAV_LABELS, pick } from '../i18n';
import {
	DEFAULT_DESCRIPTION,
	INDEXABLE,
	LOCALES,
	OG_LOCALES,
	SITE_NAME,
	SITE_URL,
	absoluteUrl,
	isTranslated,
	plainText,
} from './site';

// WP post-type URL prefix -> the Next page that lists them (breadcrumb parent).
const PARENTS = { work: '/portfolio', video: '/videos' };

// WP featured-image node -> absolute og:image through the frontend's own
// image optimizer (/wp-content/ isn't served on the frontend domain).
// 1200 is one of next/image's default deviceSizes, which the optimizer requires.
function ogImage(image) {
	if (!image?.sourceUrl) return null;
	const { width, height } = image.mediaDetails ?? {};
	return {
		url: `${SITE_URL}/_next/image?url=${encodeURIComponent(image.sourceUrl)}&w=1200&q=75`,
		width: width && height ? 1200 : null,
		height: width && height ? Math.round((1200 * height) / width) : null,
		alt: image.altText || null,
	};
}

/**
 * The one mapping from page/WP data to everything SEO renders.
 *
 * @param {object} args
 * @param {string} args.path Locale-less path, no query, e.g. "/work/dac-2026".
 * @param {string} args.locale 'es' | 'en'.
 * @param {string} [args.title] Bare page title (site name is appended).
 * @param {string} [args.description] Plain text or HTML (excerpt/content).
 * @param {object} [args.image] WP media node (sourceUrl, altText, mediaDetails).
 * @param {'article'|'work'|'video'} [args.type] Content kind, drives og:type + JSON-LD.
 * @param {object} [args.node] WP node (SeoFragment: dateGmt, modifiedGmt).
 * @param {string} [args.author]
 * @param {boolean} [args.noindex]
 */
export function buildSeo({ path, locale, title, description, image, type, node, author, noindex }) {
	const translated = isTranslated(path);
	const lang = translated ? locale : 'es';
	const canonical = absoluteUrl(path, lang);
	const metaTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME;
	const metaDescription = plainText(description) || pick(DEFAULT_DESCRIPTION, lang);
	const img = ogImage(image);
	const published = node?.dateGmt ? `${node.dateGmt}Z` : null;
	const modified = node?.modifiedGmt ? `${node.modifiedGmt}Z` : null;

	const crumbs = [{ name: SITE_NAME, url: absoluteUrl('/', lang) }];
	if (path !== '/') {
		const parent = PARENTS[path.split('/')[1]];
		if (parent)
			crumbs.push({ name: pick(NAV_LABELS[parent], lang), url: absoluteUrl(parent, lang) });
		crumbs.push({ name: title || path, url: canonical });
	}

	const org = {
		'@type': 'Organization',
		'@id': `${SITE_URL}/#organization`,
		name: SITE_NAME,
		url: SITE_URL,
	};
	const webPage = {
		'@type': 'WebPage',
		'@id': `${canonical}#webpage`,
		url: canonical,
		name: metaTitle,
		description: metaDescription,
		inLanguage: lang,
		isPartOf: { '@id': `${SITE_URL}/#website` },
		breadcrumb: { '@id': `${canonical}#breadcrumb` },
		...(img && { primaryImageOfPage: { '@type': 'ImageObject', url: img.url } }),
		...(published && { datePublished: published }),
		...(modified && { dateModified: modified }),
	};
	const main = {
		article: {
			'@type': 'Article',
			headline: title,
			author: author ? { '@type': 'Person', name: author } : { '@id': org['@id'] },
		},
		work: { '@type': 'CreativeWork', name: title, creator: { '@id': org['@id'] } },
		video: {
			'@type': 'VideoObject',
			name: title,
			description: metaDescription,
			uploadDate: published,
		},
	}[type];

	const jsonLd = {
		'@context': 'https://schema.org',
		'@graph': [
			org,
			{
				'@type': 'WebSite',
				'@id': `${SITE_URL}/#website`,
				url: SITE_URL,
				name: SITE_NAME,
				publisher: { '@id': org['@id'] },
				inLanguage: LOCALES,
			},
			webPage,
			{
				'@type': 'BreadcrumbList',
				'@id': `${canonical}#breadcrumb`,
				itemListElement: crumbs.map(({ name, url }, i) => ({
					'@type': 'ListItem',
					position: i + 1,
					name,
					item: url,
				})),
			},
			...(main
				? [
						{
							...main,
							'@id': `${canonical}#main`,
							url: canonical,
							mainEntityOfPage: { '@id': `${canonical}#webpage` },
							...(img && { image: img.url, thumbnailUrl: img.url }),
							...(published && type !== 'video' && { datePublished: published }),
							...(modified && { dateModified: modified }),
						},
					]
				: []),
		],
	};

	return {
		title: metaTitle,
		ogTitle: title || SITE_NAME,
		description: metaDescription,
		canonical,
		robots: INDEXABLE && !noindex ? 'index, follow' : 'noindex, nofollow',
		ogType: type === 'article' ? 'article' : 'website',
		ogLocale: OG_LOCALES[lang],
		image: img,
		published,
		modified,
		alternates: translated
			? [
					...LOCALES.map((l) => ({ hrefLang: l, href: absoluteUrl(path, l) })),
					{ hrefLang: 'x-default', href: absoluteUrl(path, 'es') },
				]
			: [],
		jsonLd,
	};
}
