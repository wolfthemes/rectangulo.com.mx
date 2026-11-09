import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './Preloader.module.scss';

// First-load splash (brief: HOME - Loading Screen). Mounted once in _app,
// outside any single page — runs on the initial hard load only, not on
// client-side route changes (PageTransition already owns those). A module
// flag, not sessionStorage: a fresh tab should always see it once, but SPA
// navigation within the same session never re-triggers it.
let hasPlayed = false;

const MIN_HOLD_MS = 600;

export default function Preloader() {
	const rootRef = useRef(null);

	useLayoutEffect(() => {
		const root = rootRef.current;
		if (!root || hasPlayed) {
			if (root) gsap.set(root, { autoAlpha: 0, display: 'none' });
			return undefined;
		}
		hasPlayed = true;

		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduce) {
			gsap.set(root, { autoAlpha: 0, display: 'none' });
			return undefined;
		}

		const tween = gsap.to(root, {
			autoAlpha: 0,
			duration: 0.6,
			ease: 'power2.inOut',
			delay: MIN_HOLD_MS / 1000,
			onComplete: () => gsap.set(root, { display: 'none' }),
		});
		return () => tween.kill();
	}, []);

	return (
		<div ref={rootRef} className={styles.component} aria-hidden="true">
			{/* eslint-disable-next-line @next/next/no-img-element -- brand mark, not content */}
			<img className={styles.logo} src="/images/logo.svg" alt="" />
		</div>
	);
}
