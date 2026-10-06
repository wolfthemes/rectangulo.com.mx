import { useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import { onScrollFrame } from '../../lib/scroll';
import styles from './HomeHero.module.scss';

let cx = classNames.bind(styles);

// How many viewport-heights the pinned hero takes to run through its three
// states (brief section 03). Bigger = slower/more scroll per state.
const SECTION_VH = 2.5;

const clamp01 = (v) => Math.min(Math.max(v, 0), 1);
// Remaps progress from [from, to] to [0, 1], clamped — the small helper
// every state transition below is built from.
const band = (p, from, to) => clamp01((p - from) / (to - from));

// Scroll-driven hero: logo starts dominant over the demoreel, shrinks into
// the nav as the user scrolls, then the brand statement + "View Showreel"
// CTA fade in. Imperative style writes (no React state per frame) — same
// reasoning as GalleryBanner's rAF loop: this runs at scroll cadence and a
// re-render per frame would be wasted work.
export default function HomeHero({ demoreelUrl, statement, onViewShowreel }) {
	const sectionRef = useRef(null);
	const logoRef = useRef(null);
	const navRef = useRef(null);
	const statementRef = useRef(null);

	useEffect(() => {
		const section = sectionRef.current;
		if (!section) return undefined;

		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		const apply = (scrollY) => {
			const top = section.offsetTop;
			const height = section.offsetHeight - window.innerHeight;
			const progress = height > 0 ? clamp01((scrollY - top) / height) : 0;

			// STATE 01 -> 02: logo scales down from dominant to nav-sized.
			const toNav = band(progress, 0, 0.45);
			const scale = 1 - toNav * 0.75;
			const y = -toNav * 38; // vh, rises toward the nav bar
			if (logoRef.current) {
				logoRef.current.style.transform = `translate3d(0, ${y}vh, 0) scale(${scale})`;
			}

			// STATE 02: nav + social links fade in alongside the shrinking logo.
			if (navRef.current) navRef.current.style.opacity = band(progress, 0.2, 0.5);

			// STATE 03: brand statement + View Showreel.
			if (statementRef.current) statementRef.current.style.opacity = band(progress, 0.6, 1);
		};

		if (reduce) {
			apply(0);
			return undefined;
		}

		return onScrollFrame(apply);
	}, []);

	return (
		<section ref={sectionRef} className={cx('component')} style={{ height: `${SECTION_VH * 100}vh` }}>
			<div className={cx('pinned')}>
				{demoreelUrl ? (
					<video className={cx('reel')} src={demoreelUrl} autoPlay muted loop playsInline />
				) : (
					<div className={cx('reel', 'reel--placeholder')} />
				)}

				{/* eslint-disable-next-line @next/next/no-img-element -- brand mark, not content */}
				<img ref={logoRef} className={cx('logo')} src="/images/logo.svg" alt="Rectángulo" />

				<div ref={navRef} className={cx('social')}>
					<a href="https://instagram.com/rectangulo" target="_blank" rel="noreferrer">IG</a>
					<a href="https://youtube.com/@rectangulo" target="_blank" rel="noreferrer">YT</a>
					<a href="https://vimeo.com/rectangulo" target="_blank" rel="noreferrer">VI</a>
					<a href="https://linkedin.com/company/rectangulo" target="_blank" rel="noreferrer">IN</a>
				</div>

				<div ref={statementRef} className={cx('statement')}>
					<p>{statement}</p>
					{/* ponytail: no full-demoreel lightbox built yet (brief section
					    03's "View Showreel" opens the complete piece) — disabled until
					    a caller passes onViewShowreel, rather than a button that does
					    nothing when clicked. */}
					<button
						type="button"
						className={cx('showreel')}
						onClick={onViewShowreel}
						disabled={!onViewShowreel}
					>
						View Showreel
					</button>
				</div>
			</div>
		</section>
	);
}
