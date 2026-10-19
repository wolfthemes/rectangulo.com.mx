import { useEffect, useLayoutEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import { onScrollFrame } from '../../lib/scroll';
import { SOCIAL_LINKS } from '../../constants/contact';
import styles from './HomeHero.module.scss';

let cx = classNames.bind(styles);

// How many viewport-heights the pinned hero takes to run through its three
// states (brief section 03). Bigger = slower/more scroll per state.
const SECTION_VH = 2.5;

const MENU = [
	{ label: 'Work', href: '/portfolio' },
	{ label: 'Services', href: '/services' },
	{ label: 'Projects', href: '/projects' },
];

const clamp01 = (v) => Math.min(Math.max(v, 0), 1);
// Remaps progress from [from, to] to [0, 1], clamped — the small helper
// every state transition below is built from.
const band = (p, from, to) => clamp01((p - from) / (to - from));

// Scroll-driven hero: nav + social links fade in over the demoreel, then
// the brand statement + "View Showreel" CTA. Imperative style writes (no
// React state per frame) — same reasoning as GalleryBanner's rAF loop: this
// runs at scroll cadence and a re-render per frame would be wasted work.
export default function HomeHero({ demoreelUrl, statement, onViewShowreel }) {
	const sectionRef = useRef(null);
	const reelRef = useRef(null);
	const wordmarkRef = useRef(null);
	const navRef = useRef(null);
	const statementRef = useRef(null);

	// Fit the wordmark to the full section width rather than guessing a
	// clamp() that's right for one word at one viewport — scales the current
	// font-size by (available width / rendered width), which converges
	// correctly on every call, so plain resize (no ResizeObserver needed) and
	// a refit once the real font swaps in are enough; no fit-text dependency
	// for a single-element, single-line case this small.
	useLayoutEffect(() => {
		const el = wordmarkRef.current;
		if (!el) return undefined;

		const fit = () => {
			const available = el.parentElement?.clientWidth;
			if (!available || !el.scrollWidth) return;
			const current = parseFloat(getComputedStyle(el).fontSize);
			el.style.fontSize = `${(current * available) / el.scrollWidth}px`;
		};

		fit();
		document.fonts?.ready?.then(fit);
		window.addEventListener('resize', fit);
		return () => window.removeEventListener('resize', fit);
	}, []);

	useEffect(() => {
		const section = sectionRef.current;
		if (!section) return undefined;

		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		const apply = (scrollY) => {
			const top = section.offsetTop;
			const height = section.offsetHeight - window.innerHeight;
			const progress = height > 0 ? clamp01((scrollY - top) / height) : 0;

			// Background moves slower than the pin itself (classic parallax) —
			// the whole point of pinning the hero is lost if the video just
			// sits static while everything else happens on top of it. Scaled up
			// so the vertical drift never uncovers an edge.
			if (reelRef.current) {
				reelRef.current.style.transform = `translate3d(0, ${(progress - 0.5) * 15}%, 0) scale(1.15)`;
			}

			// STATE 01 -> 02: wordmark shrinks into the top-left corner. Scale
			// only — transform-origin: top left (set in CSS) does the anchoring,
			// no translate math needed.
			const toCorner = band(progress, 0, 0.4);
			if (wordmarkRef.current) {
				wordmarkRef.current.style.transform = `scale(${1 - toCorner * 0.7})`;
			}

			// STATE 01 -> 02: nav + social links fade in.
			// visibility keeps hidden links out of tab order / pointer reach.
			const showNav = band(progress, 0.2, 0.5);
			if (navRef.current) {
				navRef.current.style.opacity = showNav;
				navRef.current.style.visibility = showNav > 0 ? 'visible' : 'hidden';
			}

			// STATE 03: brand statement + View Showreel.
			const showStatement = band(progress, 0.6, 1);
			if (statementRef.current) {
				statementRef.current.style.opacity = showStatement;
				statementRef.current.style.visibility = showStatement > 0 ? 'visible' : 'hidden';
			}
		};

		if (reduce) {
			// Final state, not 0: nav + statement would otherwise stay hidden forever.
			apply(Infinity);
			return undefined;
		}

		return onScrollFrame(apply);
	}, []);

	return (
		<section ref={sectionRef} className={cx('component')} style={{ height: `${SECTION_VH * 100}vh` }}>
			<div className={cx('pinned')}>
				{demoreelUrl ? (
					<video ref={reelRef} className={cx('reel')} src={demoreelUrl} autoPlay muted loop playsInline />
				) : (
					<div ref={reelRef} className={cx('reel', 'reel--placeholder')} />
				)}

				<div className={cx('lines')} aria-hidden="true" />

				{/* Decorative display wordmark; the real brand name lives in the
				    header logo, so this is hidden from the accessibility tree. */}
				<p ref={wordmarkRef} className={cx('wordmark')} aria-hidden="true">Reectanguloo</p>

				<div ref={navRef} className={cx('social')} style={{ visibility: 'hidden' }}>
					<nav className={cx('menu')} aria-label="Hero">
						{MENU.map(({ label, href }) => (
							<a key={href} href={href}>{label}</a>
						))}
					</nav>
					{SOCIAL_LINKS.map(({ short, label, href }) => (
						<a key={short} href={href} target="_blank" rel="noreferrer" aria-label={label}>{short}</a>
					))}
				</div>

				<div ref={statementRef} className={cx('statement')} style={{ visibility: 'hidden' }}>
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
