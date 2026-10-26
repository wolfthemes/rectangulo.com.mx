import { INDEXABLE, SITE_URL } from '../lib/seo/site';

export default function Robots() {}

export function getServerSideProps({ res }) {
	res.setHeader('Content-Type', 'text/plain');
	res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate');
	res.write(
		INDEXABLE
			? `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`
			: 'User-agent: *\nDisallow: /\n'
	);
	res.end();
	return { props: {} };
}
