// Crawl a deployed site's sitemap and flag SEO problems.
//   node scripts/seo-check.js https://rectangulo-com-mx.vercel.app
// Needs NEXT_PUBLIC_WORDPRESS_URL (env or .env.local) to detect backend-domain leaks.
const fs = require('node:fs');

const base = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '');
const env = fs.existsSync('.env.local') ? fs.readFileSync('.env.local', 'utf8') : '';
const backend = new URL(
	process.env.NEXT_PUBLIC_WORDPRESS_URL || env.match(/^NEXT_PUBLIC_WORDPRESS_URL=(.+)$/m)?.[1]
).host;

const get = async (url) => {
	const res = await fetch(url);
	return { status: res.status, text: await res.text() };
};
const tag = (html, re) => html.match(re)?.[1];

async function main() {
	const problems = [];
	const flag = (url, msg) => problems.push(`${url}\n    ${msg}`);

	const robots = await get(`${base}/robots.txt`);
	if (robots.text.includes(backend)) flag('/robots.txt', 'contains backend domain');
	const sitemap = await get(`${base}/sitemap.xml`);
	if (sitemap.status !== 200) throw new Error(`/sitemap.xml -> ${sitemap.status}`);
	if (sitemap.text.includes(backend)) flag('/sitemap.xml', 'contains backend domain');

	const urls = [...sitemap.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
	const titles = new Map();
	for (const url of urls) {
		const { status, text } = await get(url.replace(/^https?:\/\/[^/]+/, base));
		if (status !== 200) {
			flag(url, `HTTP ${status}`);
			continue;
		}
		const title = tag(text, /<title[^>]*>([^<]*)<\/title>/);
		if (!title) flag(url, 'missing <title>');
		else titles.set(title, [...(titles.get(title) ?? []), url]);
		if (!tag(text, /<meta name="description" content="([^"]+)"/))
			flag(url, 'missing meta description');
		const canonical = tag(text, /<link rel="canonical" href="([^"]+)"/);
		if (!canonical) flag(url, 'missing canonical');
		else if (canonical !== url) flag(url, `canonical differs from sitemap URL: ${canonical}`);
		if (!tag(text, /<script type="application\/ld\+json"[^>]*>([^<]+)<\/script>/))
			flag(url, 'missing JSON-LD');
		// Backend links are fine only as /wp-content/ asset URLs (og:image goes through /_next/image).
		const leaks = [
			...text.matchAll(
				new RegExp(`https?://${backend.replace(/\./g, '\\.')}(?!/wp-content)[^"'\\s<]*`, 'g')
			),
		];
		if (leaks.length)
			flag(url, `backend URLs: ${[...new Set(leaks.map((m) => m[0]))].slice(0, 3).join(', ')}`);
		for (const m of text.matchAll(/<img\b[^>]*>/g)) {
			if (!/\balt="[^"]+"/.test(m[0]))
				flag(url, `image without alt: ${tag(m[0], /src="([^"]+)"/)}`);
		}
	}
	for (const [title, list] of titles) {
		if (list.length > 1) flag(list[0], `duplicate title "${title}" on ${list.length} pages`);
	}

	console.log(`Checked ${urls.length} URLs on ${base}`);
	console.log(
		problems.length ? `\n${problems.join('\n')}\n\n${problems.length} problem(s)` : 'No problems.'
	);
	process.exit(problems.length ? 1 : 0);
}

main().catch((e) => {
	console.error(e.message);
	process.exit(2);
});
