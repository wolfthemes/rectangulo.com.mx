import {
	LOCALES,
	NOINDEX_PATHS,
	TRANSLATED_PATHS,
	absoluteUrl,
	toFrontendUrl,
} from '../lib/seo/site';

// Built from WPGraphQL rather than proxying wp-sitemap.xml: the core sitemap
// lists WooCommerce pages and WP pages that the Next pages shadow, and lacks
// the es/en alternates for the Next-only routes.
// ponytail: first:100 per type (WPGraphQL's page cap) — paginate past 100 entries.
const QUERY = `{
	posts(first: 100) { nodes { uri modifiedGmt } }
	works(first: 100) { nodes { uri modifiedGmt } }
}`;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

export default function Sitemap() {}

export async function getServerSideProps({ res }) {
	// A WP outage still serves the static routes (cached briefly) instead of a 500.
	let data = null;
	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/graphql`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ query: QUERY }),
		});
		data = (await response.json()).data;
	} catch {}

	const entries = [
		// One <url> per locale, each carrying the full alternate set.
		...TRANSLATED_PATHS.filter((path) => !NOINDEX_PATHS.includes(path)).flatMap((path) =>
			LOCALES.map((locale) => ({
				loc: absoluteUrl(path, locale),
				alternates: [
					...LOCALES.map((l) => [l, absoluteUrl(path, l)]),
					['x-default', absoluteUrl(path)],
				],
			}))
		),
		...[data?.posts, data?.works]
			.flatMap((type) => type?.nodes ?? [])
			.filter((node) => node.uri)
			.map((node) => ({
				loc: toFrontendUrl(node.uri).replace(/\/$/, ''),
				lastmod: `${node.modifiedGmt}Z`,
			})),
	];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries
	.map(
		({ loc, lastmod, alternates = [] }) =>
			`<url><loc>${esc(loc)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}${alternates
				.map(([l, href]) => `<xhtml:link rel="alternate" hreflang="${l}" href="${esc(href)}"/>`)
				.join('')}</url>`
	)
	.join('\n')}
</urlset>`;

	res.setHeader('Content-Type', 'application/xml');
	res.setHeader('Cache-Control', `public, s-maxage=${data ? 3600 : 60}, stale-while-revalidate`);
	res.write(xml);
	res.end();
	return { props: {} };
}
