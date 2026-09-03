import '../faust.config';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { FaustProvider } from '@faustwp/core';
import { initSmoothScroll, resizeSmoothScroll } from '../lib/scroll';
import { observeAnimatedHeadings } from '../lib/animate-headings';
import { onPageEnter } from '../lib/page-enter';
import { PageTransition } from '../components/PageTransition';
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

	// Split/observe on the same page-enter cue PageTransition drives everything
	// else from (or immediately, if there's no curtain to wait for — first
	// load, reduced motion).
	useEffect(() => onPageEnter(observeAnimatedHeadings), [router.asPath]);

	return (
		<FaustProvider pageProps={pageProps}>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>
			<PageTransition />
			<Component {...pageProps} key={router.asPath} />
		</FaustProvider>
	);
}
