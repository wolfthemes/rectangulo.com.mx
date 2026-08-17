import '../faust.config';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { FaustProvider } from '@faustwp/core';
import { initSmoothScroll, resizeSmoothScroll } from '../lib/scroll';
import '@faustwp/core/dist/css/toolbar.css';
import '../styles/global.scss';

export default function MyApp({ Component, pageProps }) {
	const router = useRouter();

	useEffect(() => {
		initSmoothScroll();
	}, []);

	useEffect(() => {
		resizeSmoothScroll();
	}, [router.asPath]);

	return (
		<FaustProvider pageProps={pageProps}>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>
			<Component {...pageProps} key={router.asPath} />
		</FaustProvider>
	);
}
