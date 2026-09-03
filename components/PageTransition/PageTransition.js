import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import gsap from 'gsap';
import { pageEnterClosing, playPageEnter } from '../../lib/page-enter';
import styles from './PageTransition.module.scss';

const DURATION = 0.45;
const HOLD = 0.12;

export default function PageTransition() {
	const router = useRouter();
	const topRef = useRef(null);
	const bottomRef = useRef(null);
	// Bars must be fully closed AND the new route mounted before opening —
	// whichever finishes last triggers the open, so track both with refs
	// (router events fire outside React's render cycle).
	const closed = useRef(false);
	const routed = useRef(true);

	useEffect(() => {
		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		// No curtain ever animates in this case — lib/page-enter's `open`
		// default (true) already means everything registered plays immediately.
		if (reduceMotion) return;

		const bars = [topRef.current, bottomRef.current];
		// The off-screen position must be set here, not in CSS. A CSS-authored
		// transform gets baked in by GSAP as a residual matrix the first time it
		// touches the element, and no later yPercent tween can undo it (bars stay
		// stuck off-screen forever, even at yPercent: 0). gsap.set must be the
		// only thing that ever writes transform on these elements.
		gsap.set(bars, { yPercent: (i) => (i === 0 ? -100 : 100) });

		// Scheduled by open() below; cancelled if a new nav interrupts before it
		// fires, so a rapid double-navigation can't leave a stale reveal queued.
		let revealCall = null;

		const open = () => {
			gsap.to(bars, {
				yPercent: (i) => (i === 0 ? -100 : 100),
				duration: DURATION,
				delay: HOLD,
				ease: 'power2.in',
			});
			// Reveal entrance content once the bars have mostly retreated — not
			// the instant they start moving (screen's still fully covered) and
			// not once they're fully gone (content would sit there unrevealed
			// for a beat) — timed to when the gap between them has actually
			// uncovered most of the viewport.
			revealCall = gsap.delayedCall(HOLD + DURATION * 0.6, playPageEnter);
		};

		const close = (onDone) => {
			closed.current = false;
			routed.current = false;
			revealCall?.kill();
			pageEnterClosing();
			gsap.to(bars, {
				yPercent: 0,
				duration: DURATION,
				ease: 'power2.out',
				onComplete: () => {
					closed.current = true;
					onDone?.();
					if (routed.current) open();
				},
			});
		};

		const handleStart = () => close();

		const handleDone = () => {
			routed.current = true;
			if (closed.current) open();
		};

		router.events.on('routeChangeStart', handleStart);
		router.events.on('routeChangeComplete', handleDone);
		router.events.on('routeChangeError', handleDone);

		// Intercept same-page-app link clicks so the curtain fully closes
		// *before* Next.js starts swapping in the new page — otherwise the
		// route change (and the new page's content) lands mid-animation.
		// Capture phase + stopPropagation, and BEFORE next/link's own bubble-
		// phase click handler (attached closer to the target) ever runs — else
		// Link has already preventDefault()'d and pushed by the time we see it.
		const onClick = (e) => {
			if (e.defaultPrevented || e.button !== 0) return;
			if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
			const link = e.target.closest('a');
			if (!link || link.target === '_blank' || link.hasAttribute('download')) return;

			const href = link.getAttribute('href');
			if (!href) return;
			let url;
			try {
				url = new URL(href, window.location.href);
			} catch {
				return;
			}
			if (url.origin !== window.location.origin) return;
			// Let same-page hash links (anchors, tab-only state) through untouched.
			if (url.pathname === window.location.pathname && url.search === window.location.search) return;

			e.preventDefault();
			e.stopPropagation();
			close(() => router.push(url.pathname + url.search + url.hash));
		};

		document.addEventListener('click', onClick, true);

		return () => {
			router.events.off('routeChangeStart', handleStart);
			router.events.off('routeChangeComplete', handleDone);
			router.events.off('routeChangeError', handleDone);
			document.removeEventListener('click', onClick, true);
			revealCall?.kill();
			gsap.killTweensOf(bars);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<div ref={topRef} className={`${styles.bar} ${styles.top}`} aria-hidden="true" />
			<div ref={bottomRef} className={`${styles.bar} ${styles.bottom}`} aria-hidden="true" />
		</>
	);
}
