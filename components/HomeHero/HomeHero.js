import { useEffect, useLayoutEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import gsap from 'gsap';
import Link from 'next/link';
import { onScrollFrame, getLenis } from '../../lib/scroll';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { DrawButton } from '../DrawButton';
import { NAV_LABELS, useT } from '../../lib/i18n';
import { SOCIAL_LINKS } from '../../constants/contact';
import styles from './HomeHero.module.scss';

let cx = classNames.bind(styles);

// How many viewport-heights the pinned hero takes to run through its three
// states (brief section 03). The wordmark shrink spans the full 0-1 range
// (see `toCorner` below), so this is also how long the pin itself lasts —
// it releases exactly as the shrink finishes, not some arbitrary scroll
// distance after.
const SECTION_VH = 1.5;

// How long the video-ready hold will wait before giving up and fading the
// reel in regardless (slow connection, failed load, or a placeholder div
// with no `readyState` at all) — the intro must never hang indefinitely.
const VIDEO_WAIT_MS = 2500;

const clamp01 = (v) => Math.min(Math.max(v, 0), 1);
// Remaps progress from [from, to] to [0, 1], clamped — the small helper
// every state transition below is built from.
const band = (p, from, to) => clamp01((p - from) / (to - from));

// Manually pre-split instead of handing this to SplitType (see the is-split
// JSX below): the generic char-splitter isolates every single letter into
// its own span with no idea which pairs are meant to ligature together —
// "ee" and "oo" here need to stay inside the same span, or StretchPro's
// calt/liga substitution that merges them into the brand's ambigram shapes
// can't see them as adjacent and never fires. Every other letter has no
// ligature to protect, so it's free to split on its own same as before.
const WORDMARK_UNITS = ['R', 'ee', 'c', 't', 'a', 'n', 'g', 'u', 'l', 'oo'];

// Resolves once the video can actually play, or after VIDEO_WAIT_MS,
// whichever comes first — a placeholder <div> (no demoreelUrl) has no
// `readyState` at all and resolves immediately rather than waiting out
// the full timeout for nothing.
function waitForVideo(reel) {
	return new Promise((resolve) => {
		if (!reel || reel.tagName !== 'VIDEO' || reel.readyState >= 3) {
			resolve();
			return;
		}
		const done = () => {
			reel.removeEventListener('canplaythrough', done);
			clearTimeout(timer);
			resolve();
		};
		const timer = setTimeout(done, VIDEO_WAIT_MS);
		reel.addEventListener('canplaythrough', done);
	});
}

// Scroll-driven hero: nav + social links fade in over the demoreel, then
// the brand statement + "View Showreel" CTA. Imperative style writes (no
// React state per frame) — same reasoning as GalleryBanner's rAF loop: this
// runs at scroll cadence and a re-render per frame would be wasted work.
export default function HomeHero({ demoreelUrl, statement, onViewShowreel, menuItems = [] }) {
	const t = useT();
	// WP's menu query can append ghost items without a __typename (see NavigationMenu).
	const navItems = menuItems.filter((item) => item.__typename && item.path);
	const sectionRef = useRef(null);
	const reelRef = useRef(null);
	const wordmarkRef = useRef(null);
	const navRef = useRef(null);
	const statementRef = useRef(null);
	const scrollCueRef = useRef(null);
	const curtainRef = useRef(null);
	// Flips once the load-in intro finishes — guards the scroll-driven effect
	// below from writing to the same elements the intro's GSAP timeline is
	// still animating (both would fight over wordmarkRef's transform).
	const introDone = useRef(false);

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
			const parent = el.parentElement;
			if (!parent) return;
			// Padding is fixed-length, so it doesn't scale with font-size the way
			// the text does — strip it from both sides of the ratio (available
			// space and rendered width) so only the part that actually scales
			// drives the convergence.
			const cs = getComputedStyle(el);
			const paddingX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
			// -1px safety margin: scrollWidth rounds to whole pixels, so a size
			// that converges to an exact fit can still round up a fraction over —
			// enough to clip the last glyph against the viewport edge.
			const available = parent.clientWidth - paddingX - 1;
			const textWidth = el.scrollWidth - paddingX;
			if (available <= 0 || !textWidth) return;
			const current = parseFloat(cs.fontSize);
			el.style.fontSize = `${(current * available) / textWidth}px`;
		};

		fit();
		document.fonts?.ready?.then(fit);
		window.addEventListener('resize', fit);
		return () => window.removeEventListener('resize', fit);
	}, []);

	// Load-in intro (HOME brief section 02): red curtain lifts to the hero's
	// own dark backdrop, the wordmark reveals letter by letter from the
	// bottom of the screen, a short hold (extended if the video isn't ready
	// yet), then the wordmark rises to its resting top-of-screen spot as the
	// video crossfades in and the nav appears below it. Runs every load — no
	// session skip (a shorter variant for an already-cached video is future
	// work, not this one).
	useLayoutEffect(() => {
		const curtain = curtainRef.current;
		const wordmark = wordmarkRef.current;
		const reel = reelRef.current;
		if (!curtain || !wordmark) return undefined;

		const chars = wordmark.querySelectorAll('.char');
		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		if (reduce) {
			gsap.set(curtain, { autoAlpha: 0 });
			gsap.set(chars, { opacity: 1, y: 0 });
			if (reel) gsap.set(reel, { opacity: 1 });
			introDone.current = true;
			return undefined;
		}

		// Closed/hidden starting state, written directly (not via CSS) so
		// there's no flash-of-visible-before-hidden race waiting on a browser
		// paint — same reasoning PageTransition's own curtain bars document.
		// The wordmark itself stays hidden a beat longer still (see below). Nav
		// is untouched here — it's not part of the intro at all, still only
		// the existing scroll-driven fade below (same as before the intro).
		gsap.set(curtain, { yPercent: 0 });
		gsap.set(chars, { opacity: 0, y: '0.6em' });
		gsap.set(wordmark, { autoAlpha: 0 });
		if (reel) gsap.set(reel, { opacity: 0 });

		const lenis = getLenis();
		lenis?.stop();

		let cancelled = false;

		(async () => {
			// Wait for the real display font (not the fallback) and the
			// fit-to-width effect's resulting layout before measuring anything —
			// starting the curtain against fallback-font metrics is what left the
			// wordmark's bottom-of-viewport offset wrong once the real font swapped
			// in mid-intro. document.fonts.ready already resolves once fit() has
			// re-run for it (that effect runs first and chains off the same
			// promise); the rAF just lets that resize actually paint/layout before
			// this measures it.
			await document.fonts?.ready;
			if (cancelled) return;
			await new Promise(requestAnimationFrame);
			if (cancelled) return;

			const rect = wordmark.getBoundingClientRect();
			const startY = Math.max(window.innerHeight - rect.bottom - 24, 0);
			gsap.set(wordmark, { y: startY, autoAlpha: 1 });

			// Curtain lift and letter-by-letter reveal overlap, not sequential —
			// but the letters start a beat after the curtain's already moving,
			// not at the exact same instant.
			await Promise.all([
				gsap.to(curtain, { yPercent: -100, duration: 0.8, ease: 'power2.inOut', delay: 0.15 }),
				gsap.to(chars, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.04, delay: 0.35 }),
			]);
			if (cancelled) return;
			await Promise.all([gsap.to({}, { duration: 0.3 }), waitForVideo(reel)]);
			if (cancelled) return;
			await Promise.all([
				gsap.to(wordmark, { y: 0, duration: 0.9, ease: 'power3.inOut' }),
				reel ? gsap.to(reel, { opacity: 1, duration: 0.9, ease: 'power2.out' }) : Promise.resolve(),
			]);
			if (cancelled) return;
			introDone.current = true;
			lenis?.start();
		})();

		return () => {
			cancelled = true;
			gsap.killTweensOf([curtain, wordmark, reel, ...chars].filter(Boolean));
			lenis?.start();
		};
	}, []);

	useEffect(() => {
		const section = sectionRef.current;
		if (!section) return undefined;

		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		const apply = (scrollY) => {
			// The load-in intro owns these elements' styles until it's done —
			// see the useLayoutEffect above.
			if (!introDone.current) return;

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

			// Wordmark shrinks into the top-left corner across the whole pin —
			// it's what the pin's scroll distance is sized to, so it finishes
			// exactly as the section releases, not partway through a longer
			// scroll. Scale only — transform-origin: top left (CSS) anchors it.
			if (wordmarkRef.current) {
				wordmarkRef.current.style.transform = `scale(${1 - progress * 0.7})`;
			}

			// Nav fades in as the wordmark collapses into its corner mark — same
			// band as before the load-in intro existed, nav was never part of
			// that timeline.
			const showNav = band(progress, 0, 0.55);
			if (navRef.current) {
				navRef.current.style.opacity = showNav;
				navRef.current.style.visibility = showNav > 0 ? 'visible' : 'hidden';
			}

			// Brand statement + View Showreel — lands before the pin releases.
			const showStatement = band(progress, 0.35, 0.85);
			if (statementRef.current) {
				statementRef.current.style.opacity = showStatement;
				statementRef.current.style.visibility = showStatement > 0 ? 'visible' : 'hidden';
			}

			// Scroll cue: gone almost as soon as the visitor acts on it — a tiny
			// band, not tied to the statement/nav timing above.
			const showCue = 1 - band(progress, 0, 0.08);
			if (scrollCueRef.current) {
				scrollCueRef.current.style.opacity = showCue;
				scrollCueRef.current.style.visibility = showCue > 0 ? 'visible' : 'hidden';
			}
		};

		if (reduce) {
			// Final state, not 0: the statement would otherwise stay hidden forever.
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

				{/* Same reasoning as .pinned::before's bottom fade — keeps the nav
				    (top-left wordmark, top-right social links) readable over
				    whatever the reel is showing, mirrored to the top edge. */}
				<div className={cx('topFade')} aria-hidden="true" />

				<div className={cx('lines')} aria-hidden="true" />
				<div ref={curtainRef} className={cx('curtain')} aria-hidden="true" />

				{/* The page's real h1 — Header's own logo is hidden on HOME (see
				    pages/index.js), so this is the only brand mark left. Built by
				    hand instead of SplitType (see WORDMARK_UNITS above for why) and
				    revealed by the load-in intro's own GSAP timeline above, not the
				    shared .is-animated-chars/IntersectionObserver combo — that one's
				    tuned for a scroll-triggered reveal elsewhere, this needs a
				    one-time reveal gated to the curtain lifting. */}
				<h1 ref={wordmarkRef} className={cx('wordmark')}>
					{WORDMARK_UNITS.map((unit, i) => (
						<span key={i} className="char">
							{unit}
						</span>
					))}
				</h1>

				<div ref={navRef} className={cx('social')} style={{ visibility: 'hidden' }}>
					<nav className={cx('menu')} aria-label="Hero">
						{navItems.map(({ id, path, label }) => (
							<Link key={id ?? path} href={path}>{t(NAV_LABELS[path.replace(/\/+$/, '')]) ?? label}</Link>
						))}
					</nav>
					{SOCIAL_LINKS.map(({ short, label, href }) => (
						<a key={short} href={href} target="_blank" rel="noreferrer" aria-label={label}>{short}</a>
					))}
					<LanguageSwitcher />
				</div>

				<div ref={statementRef} className={cx('statement')} style={{ visibility: 'hidden' }}>
					<p>{statement}</p>
					{/* ponytail: no full-demoreel lightbox built yet (brief section
					    03's "View Showreel" opens the complete piece) — disabled until
					    a caller passes onViewShowreel, rather than a button that does
					    nothing when clicked. */}
					<DrawButton onClick={onViewShowreel} disabled={!onViewShowreel}>
						{t({ es: 'Ver showreel', en: 'View Showreel' })}
					</DrawButton>
				</div>

				<div ref={scrollCueRef} className={cx('scrollCue')} aria-hidden="true" style={{ visibility: 'hidden' }}>
					{t({ es: 'Scroll', en: 'Scroll' })}
				</div>
			</div>
		</section>
	);
}
