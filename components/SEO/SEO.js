import Head from 'next/head';
import { useRouter } from 'next/router';
import { buildSeo } from '../../lib/seo/buildSeo';
import { SITE_NAME } from '../../lib/seo/site';
import JsonLd from './JsonLd';

/**
 * All head SEO for a page, rendered server-side (next/head). Path and locale
 * come from the router, so callers only pass what is specific to the page.
 * See buildSeo for the props; `noindex` is also forced for previews.
 */
export default function SEO({ image, ...props }) {
	const { asPath, locale, query } = useRouter();
	const path = asPath.split(/[?#]/)[0].replace(/(.)\/$/, '$1');
	const seo = buildSeo({
		...props,
		image,
		path,
		locale,
		noindex: props.noindex || !!query.preview,
	});
	const img = seo.image;

	return (
		<>
			<Head>
				<title>{seo.title}</title>
				<meta name="description" content={seo.description} />
				<meta name="robots" content={seo.robots} />
				<link rel="canonical" href={seo.canonical} />
				{seo.alternates.map(({ hrefLang, href }) => (
					<link key={hrefLang} rel="alternate" hrefLang={hrefLang} href={href} />
				))}

				<meta property="og:type" content={seo.ogType} />
				<meta property="og:site_name" content={SITE_NAME} />
				<meta property="og:locale" content={seo.ogLocale} />
				<meta property="og:url" content={seo.canonical} />
				<meta property="og:title" content={seo.ogTitle} />
				<meta property="og:description" content={seo.description} />
				{img && <meta property="og:image" content={img.url} />}
				{img?.width && <meta property="og:image:width" content={img.width} />}
				{img?.height && <meta property="og:image:height" content={img.height} />}
				{img?.alt && <meta property="og:image:alt" content={img.alt} />}
				{seo.ogType === 'article' && seo.published && (
					<meta property="article:published_time" content={seo.published} />
				)}
				{seo.ogType === 'article' && seo.modified && (
					<meta property="article:modified_time" content={seo.modified} />
				)}

				<meta name="twitter:card" content={img ? 'summary_large_image' : 'summary'} />
				<meta name="twitter:title" content={seo.ogTitle} />
				<meta name="twitter:description" content={seo.description} />
				{img && <meta name="twitter:image" content={img.url} />}
			</Head>
			<JsonLd data={seo.jsonLd} />
		</>
	);
}
