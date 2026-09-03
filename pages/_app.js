import '../faust.config';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { FaustProvider } from '@faustwp/core';
import { initSmoothScroll, resizeSmoothScroll } from '../lib/scroll';
import { observeAnimatedHeadings, splitAnimatedHeadings } from '../lib/animate-headings';
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

	// Split (hide) immediately, every route change — this must not wait on the
	// curtain, or an above-the-fold heading can flash plain text before it's
	// ever hidden. Only the actual reveal trigger waits for the same page-enter
	// cue PageTransition drives everything else from (or fires immediately if
	// there's no curtain to wait for — first load, reduced motion).
	useEffect(() => {
		splitAnimatedHeadings();
		return onPageEnter(observeAnimatedHeadings);
	}, [router.asPath]);

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
