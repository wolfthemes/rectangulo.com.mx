import Head from 'next/head';

/**
 * Provide SEO related meta tags to a page.
 *
 * @param {Props} props The props object.
 * @param {string} props.title Used for the page title, og:title, twitter:title, etc.
 * @param {string} props.description Used for the meta description, og:description, twitter:description, etc.
 * @param {string} props.imageUrl Used for the og:image and twitter:image. NOTE: Must be an absolute url.
 * @param {string} props.url Used for the og:url, twitter:url and canonical.
 *
 * @returns {React.ReactElement} The SEO component
 */

// Site-level defaults, overridden per page by the props above.
const SITE = {
	url: 'https://rectangulo.com.mx',
	name: 'Rectángulo',
	title: 'Rectángulo',
	description: '',
	image: 'https://rectangulo.com.mx/assets/img/og.png',
	imageWidth: '1200',
	imageHeight: '630',
	locale: 'en_US',
};

export default function SEO({ title, description, imageUrl, url }) {
	const metaTitle = title || SITE.title;
	const metaDescription = description || SITE.description;
	const metaImage = imageUrl || SITE.image;
	const metaUrl = url || SITE.url;

	return (
		<Head>
			<title>{metaTitle}</title>
			<meta name="title" content={metaTitle} />
			<meta name="description" content={metaDescription} />
			<meta name="robots" content="index, follow" />
			<link rel="canonical" href={metaUrl} />

			<meta property="og:type" content="website" />
			<meta property="og:site_name" content={SITE.name} />
			<meta property="og:locale" content={SITE.locale} />
			<meta property="og:url" content={metaUrl} />
			<meta property="og:title" content={metaTitle} />
			<meta property="og:description" content={metaDescription} />
			<meta property="og:image" content={metaImage} />
			<meta property="og:image:width" content={SITE.imageWidth} />
			<meta property="og:image:height" content={SITE.imageHeight} />

			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:url" content={metaUrl} />
			<meta name="twitter:title" content={metaTitle} />
			<meta name="twitter:description" content={metaDescription} />
			<meta name="twitter:image" content={metaImage} />
		</Head>
	);
}
