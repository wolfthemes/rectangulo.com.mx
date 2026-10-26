import Head from 'next/head';

// "<" escaped so content can never close the script tag.
export default function JsonLd({ data }) {
	return (
		<Head>
			<script
				key="jsonld"
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
			/>
		</Head>
	);
}
